import { getAllCities, getAllCountries } from "@/lib/data/queries";
import { getClimate } from "@/lib/data/climate";
import { getCostOfLiving } from "@/lib/data/cost-of-living";
import { getEconomy } from "@/lib/data/economy";
import { getEducation } from "@/lib/data/education";
import { getHealthcare } from "@/lib/data/healthcare-retirement";
import { macroRegionFor } from "@/lib/search/regions";
import {
  DISCOVERY_INDEX_VERSION,
  type DiscoveryCity,
  type DiscoveryCountry,
  type DiscoveryIndex,
} from "@/lib/discovery/types";

/**
 * Build-time construction of the city-discovery index.
 *
 * SERVER ONLY — imports `@/lib/data`, so it must never be reached from a client
 * component. Its sole consumer is the static route handler at
 * `app/discovery-index/cities.json/route.ts`, which Next materialises into a
 * plain JSON file during `next build`. The browser only ever fetches that file:
 * no API route, no search service, no runtime data dependency.
 *
 * ------------------------------------------------------------------------
 * THE SENTINEL RULE (the most important thing in this file)
 * ------------------------------------------------------------------------
 * 249 of the 4,444 cities are placeholders awaiting data integration. They are
 * identifiable with certainty: `City.population === "Pending integration"`, and
 * that predicate corresponds EXACTLY — 249/249, verified with zero exceptions —
 * to the cohort whose every directional score is the literal value 50:
 *
 *   City.scores.{overall,affordability,airQuality,energy,resilience} === 50
 *   City.modules[*].score                                            === 50
 *   CostOfLivingProfile.affordabilityScore                           === 50
 *
 * The city pages already disclose this ("Data confidence: Directional —
 * indicators pending integration of verified city-level data"). Carrying those
 * 50s into a discovery index would be far worse than carrying nothing: a
 * visitor filtering for "affordability 60+" would silently exclude Sofia and
 * York on the strength of a number that was never a measurement, and a visitor
 * sorting by safety would see 249 cities cluster at a fabricated midpoint.
 *
 * So every score that is provably sentinel for this cohort is emitted as null,
 * and `bandOf()` guarantees a null can never satisfy a band filter.
 *
 * Deliberately NOT nulled for this cohort: climate (real and distinct — 140
 * distinct annual temperatures across the 249) and the economy/education/
 * healthcare profile scores (7–12 distinct values each, i.e. coarse but not a
 * single placeholder constant, and published as-is on those cities' pages).
 * Nulling real values would be its own kind of dishonesty.
 */
const SENTINEL_POPULATION = "Pending integration";

/** True when the city carries the unpublished-data marker described above. */
export function isSentinelCity(population: string): boolean {
  return population.trim() === SENTINEL_POPULATION;
}

/**
 * Parse `City.population` ("~1.8M metro", "~290K", "37.2M metro", "1.5M
 * city-state") into an absolute count.
 *
 * Returns null when no numeric magnitude is present, which is exactly the
 * sentinel cohort — verified: all 4,195 non-sentinel values parse, all 249
 * sentinel values do not. The qualifier ("metro", "urban", "city") is
 * deliberately ignored rather than reconciled: the corpus does not define a
 * consistent metro-vs-city boundary, so pretending to normalise it would invent
 * precision the source data does not carry. The band labels therefore describe
 * the published figure, whatever its basis.
 */
export function parsePopulation(raw: string): number | null {
  const match = /([\d.]+)\s*([KM])/i.exec(raw);
  if (!match) return null;
  const magnitude = Number.parseFloat(match[1]);
  if (!Number.isFinite(magnitude)) return null;
  const multiplier = match[2].toUpperCase() === "M" ? 1_000_000 : 1_000;
  return Math.round(magnitude * multiplier);
}

/** Emit a published 0–100 score, or null when the city is a sentinel. */
function score(value: number | undefined, sentinel: boolean): number | null {
  if (sentinel) return null;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function buildDiscoveryIndex(): DiscoveryIndex {
  const allCountries = getAllCountries();

  const countries: DiscoveryCountry[] = allCountries
    .map((country) => ({
      s: country.slug,
      n: country.name,
      i: country.iso2,
      m: macroRegionFor(country.slug, country.region),
    }))
    .sort((a, b) => a.n.localeCompare(b.n));
  const countryIndexBySlug = new Map(countries.map((c, i) => [c.s, i]));

  const zones: string[] = [];
  const zoneIndex = new Map<string, number>();
  const zoneIdFor = (zone: string): number => {
    const existing = zoneIndex.get(zone);
    if (existing !== undefined) return existing;
    const next = zones.length;
    zones.push(zone);
    zoneIndex.set(zone, next);
    return next;
  };

  const cities: DiscoveryCity[] = [];
  for (const city of getAllCities()) {
    const countryIdx = countryIndexBySlug.get(city.countrySlug);
    // A city whose country is absent from the index could not render a
    // country name or be filtered by region; dropping it silently would make
    // the Finder's counts disagree with the corpus, so this is a build error.
    if (countryIdx === undefined) {
      throw new Error(
        `discovery index: city "${city.slug}" references unknown country "${city.countrySlug}"`,
      );
    }

    const sentinel = isSentinelCity(city.population);
    const cost = getCostOfLiving(city.slug);

    // These four profiles are 100% covered today. If that ever regresses, the
    // build must fail loudly rather than emit a 0 — a 0 would render as a real
    // published score and rank the city last on every sort.
    const climate = getClimate(city.slug);
    const economy = getEconomy(city.slug);
    const education = getEducation(city.slug);
    const healthcare = getHealthcare(city.slug);
    if (!climate || !economy || !education || !healthcare) {
      const missing = [
        !climate && "climate",
        !economy && "economy",
        !education && "education",
        !healthcare && "healthcare",
      ].filter(Boolean).join(", ");
      throw new Error(
        `discovery index: city "${city.slug}" is missing profile(s): ${missing}`,
      );
    }

    cities.push({
      s: city.slug,
      n: city.name,
      c: countryIdx,
      p: parsePopulation(city.population),
      a: score(cost?.affordabilityScore, sentinel),
      f: score(city.modules.safety?.score, sentinel),
      q: score(city.modules["air-quality"]?.score, sentinel),
      i: score(city.modules["internet-speed"]?.score, sentinel),
      z: zoneIdFor(climate.climateZone),
      t: climate.annualAvgTempC,
      k: climate.comfortScore,
      e: economy.economyScore,
      u: education.educationScore,
      h: healthcare.healthcareScore,
      // Raw local-currency figures are NOT sentinel-nulled: unlike the
      // directional scores they are real published planning estimates for
      // every city, and the comparison view always renders them next to their
      // currency code so they are never read as a common unit.
      mc: cost?.monthlyCostSingle ?? null,
      cur: cost?.localCurrency ?? null,
    });
  }

  cities.sort((a, b) => a.n.localeCompare(b.n));

  return {
    generatedFor: "city-discovery",
    version: DISCOVERY_INDEX_VERSION,
    count: cities.length,
    zones,
    countries,
    cities,
  };
}
