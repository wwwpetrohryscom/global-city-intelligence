import {
  AFFORDABILITY_BANDS,
  POPULATION_BANDS,
  SCORE_BANDS,
  TEMPERATURE_BANDS,
  bandOf,
  type PopulationBandId,
  type ScoreBandId,
  type TemperatureBandId,
} from "@/lib/discovery/bands";
import { bestRank, compareMatches, fold, MatchRank } from "@/lib/search/match";
import type { DiscoveryCity, DiscoveryIndex } from "@/lib/discovery/types";

/**
 * Pure filtering/sorting engine for the City Finder.
 *
 * Deliberately UI-free and dependency-free (it reuses the existing
 * `lib/search/match` primitives rather than introducing a second matcher) so it
 * can be unit-tested and validated at build time without a browser.
 *
 * COMPOSITION: every active facet is ANDed. "Europe + more affordable + warm"
 * yields the intersection, not a union of three result sets.
 *
 * MISSING DATA: a city with a null score is excluded from any filter on that
 * dimension (`bandOf(null)` is null and never equals a selected band) and sorts
 * to the END of a sort on that dimension regardless of direction. A city with
 * no published safety score must never appear as either the safest or the least
 * safe city — both would be a claim the corpus does not support.
 */

export interface FinderFilters {
  /** Free-text query over city name and country name. */
  q: string;
  /** Macro-region names; empty = no constraint. */
  regions: string[];
  /** Country slugs; empty = no constraint. */
  countries: string[];
  population: PopulationBandId[];
  temperature: TemperatureBandId[];
  /** Climate zone labels, e.g. "Mediterranean". */
  zones: string[];
  affordability: ScoreBandId[];
  safety: ScoreBandId[];
  airQuality: ScoreBandId[];
  internet: ScoreBandId[];
  economy: ScoreBandId[];
  education: ScoreBandId[];
  healthcare: ScoreBandId[];
}

export const EMPTY_FILTERS: FinderFilters = {
  q: "",
  regions: [],
  countries: [],
  population: [],
  temperature: [],
  zones: [],
  affordability: [],
  safety: [],
  airQuality: [],
  internet: [],
  economy: [],
  education: [],
  healthcare: [],
};

export type SortId =
  | "name-asc"
  | "name-desc"
  | "population-desc"
  | "population-asc"
  | "affordability-desc"
  | "safety-desc"
  | "temperature-desc"
  | "temperature-asc";

export interface SortOption {
  id: SortId;
  label: string;
  /** Dimension whose null values must sink to the bottom, if any. */
  nullableKey?: keyof Pick<DiscoveryCity, "p" | "a" | "f">;
}

/**
 * Sorts are limited to dimensions with a real, cross-city-comparable value.
 *
 * There is deliberately no "Popular", "Trending", "Featured", "Recommended" or
 * "Best match" option: the corpus contains no popularity, traffic or ranking
 * signal, and a composite score would need a weighting no source justifies.
 * There is likewise no cost sort — `monthlyCost*` is denominated in 83 local
 * currencies with no exchange-rate table available.
 */
export const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name A–Z" },
  { id: "name-desc", label: "Name Z–A" },
  { id: "population-desc", label: "Population — largest first", nullableKey: "p" },
  { id: "population-asc", label: "Population — smallest first", nullableKey: "p" },
  { id: "affordability-desc", label: "Affordability score — highest first", nullableKey: "a" },
  { id: "safety-desc", label: "Safety score — highest first", nullableKey: "f" },
  { id: "temperature-desc", label: "Warmest first" },
  { id: "temperature-asc", label: "Coolest first" },
] as const;

export const DEFAULT_SORT: SortId = "name-asc";

/** True when no facet constrains the result set. */
export function isEmptyFilters(f: FinderFilters): boolean {
  return (
    f.q.trim() === "" &&
    f.regions.length === 0 &&
    f.countries.length === 0 &&
    f.population.length === 0 &&
    f.temperature.length === 0 &&
    f.zones.length === 0 &&
    f.affordability.length === 0 &&
    f.safety.length === 0 &&
    f.airQuality.length === 0 &&
    f.internet.length === 0 &&
    f.economy.length === 0 &&
    f.education.length === 0 &&
    f.healthcare.length === 0
  );
}

/** Number of active facets, for the "N filters applied" affordance. */
export function activeFilterCount(f: FinderFilters): number {
  return (
    (f.q.trim() === "" ? 0 : 1) +
    f.regions.length +
    f.countries.length +
    f.population.length +
    f.temperature.length +
    f.zones.length +
    f.affordability.length +
    f.safety.length +
    f.airQuality.length +
    f.internet.length +
    f.economy.length +
    f.education.length +
    f.healthcare.length
  );
}

/** Selected band ids, or no constraint when none are selected. */
function matchesBand<Id extends string>(
  selected: readonly Id[],
  bands: Parameters<typeof bandOf<Id>>[0],
  value: number | null,
): boolean {
  if (selected.length === 0) return true;
  const band = bandOf(bands, value);
  // A null value yields a null band, which is in no selection — so cities with
  // unpublished values are excluded rather than silently passing.
  return band !== null && selected.includes(band);
}

export interface FinderContext {
  /** country array index → macro region, precomputed once per index load. */
  regionByCountryIdx: (string | null)[];
  countrySlugByIdx: string[];
  zoneNames: string[];
}

export function buildContext(index: DiscoveryIndex): FinderContext {
  return {
    regionByCountryIdx: index.countries.map((c) => c.m),
    countrySlugByIdx: index.countries.map((c) => c.s),
    zoneNames: index.zones,
  };
}

export function matches(
  city: DiscoveryCity,
  countryName: string,
  filters: FinderFilters,
  ctx: FinderContext,
): boolean {
  if (filters.regions.length > 0) {
    const region = ctx.regionByCountryIdx[city.c];
    if (region === null || !filters.regions.includes(region)) return false;
  }
  if (filters.countries.length > 0) {
    if (!filters.countries.includes(ctx.countrySlugByIdx[city.c])) return false;
  }
  if (filters.zones.length > 0) {
    if (!filters.zones.includes(ctx.zoneNames[city.z])) return false;
  }
  if (!matchesBand(filters.population, POPULATION_BANDS, city.p)) return false;
  if (!matchesBand(filters.temperature, TEMPERATURE_BANDS, city.t)) return false;
  if (!matchesBand(filters.affordability, AFFORDABILITY_BANDS, city.a)) return false;
  if (!matchesBand(filters.safety, SCORE_BANDS, city.f)) return false;
  if (!matchesBand(filters.airQuality, SCORE_BANDS, city.q)) return false;
  if (!matchesBand(filters.internet, SCORE_BANDS, city.i)) return false;
  if (!matchesBand(filters.economy, SCORE_BANDS, city.e)) return false;
  if (!matchesBand(filters.education, SCORE_BANDS, city.u)) return false;
  if (!matchesBand(filters.healthcare, SCORE_BANDS, city.h)) return false;

  const q = fold(filters.q);
  if (q) {
    const rank = bestRank([fold(city.n), fold(countryName)], q);
    if (rank === MatchRank.None) return false;
  }
  return true;
}

/** Nulls last, in both directions. */
function compareNullable(
  a: number | null,
  b: number | null,
  direction: 1 | -1,
): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return (a - b) * direction;
}

export function sortCities(
  cities: DiscoveryCity[],
  sort: SortId,
): DiscoveryCity[] {
  const out = [...cities];
  const byName = (a: DiscoveryCity, b: DiscoveryCity) =>
    a.n.localeCompare(b.n) || a.s.localeCompare(b.s);

  switch (sort) {
    case "name-asc":
      return out.sort(byName);
    case "name-desc":
      return out.sort((a, b) => byName(b, a));
    case "population-desc":
      return out.sort((a, b) => compareNullable(a.p, b.p, -1) || byName(a, b));
    case "population-asc":
      return out.sort((a, b) => compareNullable(a.p, b.p, 1) || byName(a, b));
    case "affordability-desc":
      return out.sort((a, b) => compareNullable(a.a, b.a, -1) || byName(a, b));
    case "safety-desc":
      return out.sort((a, b) => compareNullable(a.f, b.f, -1) || byName(a, b));
    case "temperature-desc":
      return out.sort((a, b) => b.t - a.t || byName(a, b));
    case "temperature-asc":
      return out.sort((a, b) => a.t - b.t || byName(a, b));
    default: {
      // Exhaustiveness guard: a new SortId must be handled explicitly rather
      // than silently falling back to an unrelated ordering.
      const never: never = sort;
      throw new Error(`unhandled sort: ${String(never)}`);
    }
  }
}

/** Text-relevance ordering, used only while a query is active. */
export function sortByRelevance(
  cities: DiscoveryCity[],
  query: string,
  countryNameByIdx: string[],
): DiscoveryCity[] {
  const q = fold(query);
  if (!q) return cities;
  return [...cities]
    .map((city) => ({
      city,
      rank: bestRank([fold(city.n), fold(countryNameByIdx[city.c])], q),
    }))
    .sort((a, b) =>
      compareMatches(
        { rank: a.rank, name: a.city.n },
        { rank: b.rank, name: b.city.n },
      ),
    )
    .map((entry) => entry.city);
}

export function runFinder(
  index: DiscoveryIndex,
  filters: FinderFilters,
  sort: SortId,
  ctx: FinderContext,
): DiscoveryCity[] {
  const countryNameByIdx = index.countries.map((c) => c.n);
  const filtered = index.cities.filter((city) =>
    matches(city, countryNameByIdx[city.c], filters, ctx),
  );
  return sortCities(filtered, sort);
}
