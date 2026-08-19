import { getAllCities } from "@/lib/data/queries";
import { getClimate } from "@/lib/data/climate";
import { getCostOfLiving } from "@/lib/data/cost-of-living";
import { getEconomy } from "@/lib/data/economy";
import { getEducation } from "@/lib/data/education";
import { getHealthcare } from "@/lib/data/healthcare-retirement";
import { isSentinelCity } from "@/lib/discovery/build-index";
import { DIMENSION_IDS } from "@/lib/city-intelligence/dimensions";

/**
 * SERVER ONLY — country cohort statistics for the City Intelligence Scorecard.
 *
 * Imports `@/lib/data`, so it must never be reached from a client component.
 *
 * ------------------------------------------------------------------------
 * COST MODEL (this is why the file is shaped like this)
 * ------------------------------------------------------------------------
 * 4,444 city pages each need to know where their city sits inside its country.
 * Computing that per page would be O(cities²) — ~20M comparisons — and would
 * dominate an already 400-second build. Instead every cohort is built ONCE,
 * memoised at module scope, and each page then does an O(1) map read plus an
 * O(log n) binary search. Total preprocessing is O(N log N) over 4,444 rows.
 *
 * ------------------------------------------------------------------------
 * VALIDITY (the rule that keeps placeholders out of the statistics)
 * ------------------------------------------------------------------------
 * `isSentinelCity()` is imported from `lib/discovery/build-index` rather than
 * reimplemented: the repository must have exactly ONE definition of "this
 * record is a placeholder", and `scripts/validate-sentinel-cohort.mjs` already
 * guards that definition against upstream rewording.
 *
 * Placeholder cities are excluded from every cohort entirely. They do not
 * contribute values, they do not move anyone else's position, and they receive
 * no position of their own. Their directional scores are the literal 50 that
 * marks "not yet measured", and for economy/education/healthcare their values
 * are a country-level default — constant within country for 21–23 of the 24
 * countries holding three or more of them. Ranking a default against real
 * measurements would manufacture intelligence that does not exist.
 */

export interface Cohort {
  /** Ascending valid values for one country + dimension. */
  sorted: number[];
  /** value -> how many cities share it, for tie handling. */
  counts: Map<number, number>;
}

export interface CityValues {
  slug: string;
  name: string;
  countrySlug: string;
  countryName: string;
  isPlaceholder: boolean;
  /** dimension id -> published value, or null when unpublished. */
  values: Map<string, number | null>;
}

const finite = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

function readCityValues(): CityValues[] {
  return getAllCities().map((city) => {
    const placeholder = isSentinelCity(city.population);
    const cost = getCostOfLiving(city.slug);
    const climate = getClimate(city.slug);
    const economy = getEconomy(city.slug);
    const education = getEducation(city.slug);
    const healthcare = getHealthcare(city.slug);

    const values = new Map<string, number | null>([
      ["safety", finite(city.modules.safety?.score)],
      ["healthcare", finite(healthcare?.healthcareScore)],
      ["economy", finite(economy?.economyScore)],
      ["education", finite(education?.educationScore)],
      ["climate", finite(climate?.comfortScore)],
      ["air-quality", finite(city.modules["air-quality"]?.score)],
      ["internet", finite(city.modules["internet-speed"]?.score)],
      ["affordability", finite(cost?.affordabilityScore)],
    ]);

    return {
      slug: city.slug,
      name: city.name,
      countrySlug: city.countrySlug,
      countryName: city.countryName,
      isPlaceholder: placeholder,
      values,
    };
  });
}

let cachedCities: CityValues[] | null = null;
export function allCityValues(): CityValues[] {
  if (!cachedCities) cachedCities = readCityValues();
  return cachedCities;
}

/** countrySlug -> dimensionId -> Cohort. Placeholder cities never contribute. */
let cachedCohorts: Map<string, Map<string, Cohort>> | null = null;

export function cohorts(): Map<string, Map<string, Cohort>> {
  if (cachedCohorts) return cachedCohorts;
  const out = new Map<string, Map<string, Cohort>>();
  const buckets = new Map<string, Map<string, number[]>>();

  for (const city of allCityValues()) {
    if (city.isPlaceholder) continue;
    let byDim = buckets.get(city.countrySlug);
    if (!byDim) {
      byDim = new Map();
      buckets.set(city.countrySlug, byDim);
    }
    for (const id of DIMENSION_IDS) {
      const v = city.values.get(id) ?? null;
      if (v === null) continue;
      const list = byDim.get(id);
      if (list) list.push(v);
      else byDim.set(id, [v]);
    }
  }

  for (const [countrySlug, byDim] of buckets) {
    const dims = new Map<string, Cohort>();
    for (const [id, values] of byDim) {
      values.sort((a, b) => a - b);
      const counts = new Map<number, number>();
      for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
      dims.set(id, { sorted: values, counts });
    }
    out.set(countrySlug, dims);
  }
  cachedCohorts = out;
  return out;
}

/** Number of non-placeholder cities in a country, for UI copy. */
let cachedCohortSize: Map<string, number> | null = null;
export function countryCohortSize(countrySlug: string): number {
  if (!cachedCohortSize) {
    cachedCohortSize = new Map();
    for (const c of allCityValues()) {
      if (c.isPlaceholder) continue;
      cachedCohortSize.set(c.countrySlug, (cachedCohortSize.get(c.countrySlug) ?? 0) + 1);
    }
  }
  return cachedCohortSize.get(countrySlug) ?? 0;
}

/** Count of values strictly below `value`, via binary search — O(log n). */
export function countStrictlyBelow(sorted: number[], value: number): number {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < value) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
