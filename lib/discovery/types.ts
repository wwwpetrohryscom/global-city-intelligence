/**
 * Wire format for the generated city-discovery index.
 *
 * Client-safe: no `@/lib/data` import anywhere in this file. It is imported by
 * both the build-time generator (server) and the Finder UI (client), so it must
 * stay free of the corpus.
 *
 * The format mirrors the conventions already established by
 * `lib/search/types.ts`: short keys, because every one is repeated ~4,400
 * times, and no prose/imagery/nested records. Country metadata is hoisted into
 * a lookup table and referenced by integer index rather than denormalised onto
 * every city — repeating "united-states"/"United States" 529 times is pure
 * transfer cost.
 *
 * NULL SEMANTICS: a null score means "this city has no published value for this
 * dimension", never "zero" and never "average". See `SENTINEL_POPULATION` in
 * `lib/discovery/build-index.ts` for why 249 cities carry nulls.
 */

/** Country lookup row, referenced by `DiscoveryCity.c` (its array index). */
export interface DiscoveryCountry {
  /** slug */ s: string;
  /** name */ n: string;
  /** ISO 3166-1 alpha-2 */ i: string;
  /** macro region bucket, null when unmapped */ m: string | null;
}

/**
 * One city row.
 *
 * Every score field is a 0–100 value already published on that city's own
 * pages. Nothing here is a new metric: the Finder re-presents existing
 * published values, it does not compute a composite of them.
 */
export interface DiscoveryCity {
  /** slug */ s: string;
  /** name */ n: string;
  /** index into `DiscoveryIndex.countries` */ c: number;
  /** population, absolute count; null when unpublished */ p: number | null;
  /** affordability score 0–100, higher = more affordable; null when unpublished */ a: number | null;
  /** safety score 0–100; null when unpublished */ f: number | null;
  /** air-quality score 0–100; null when unpublished */ q: number | null;
  /** internet-speed score 0–100; null when unpublished */ i: number | null;
  /** index into `DiscoveryIndex.zones` */ z: number;
  /** annual average temperature °C */ t: number;
  /** climate comfort score 0–100 */ k: number;
  /** economy score 0–100 */ e: number;
  /** education score 0–100 */ u: number;
  /** healthcare score 0–100 */ h: number;
  /**
   * Published monthly cost for one person, in `cur` — NOT converted to a
   * common currency, because no exchange-rate data exists in this repository.
   * Carried for side-by-side display on the comparison view only: it is never
   * sorted, filtered or ranked, since 305,000,000 IRR and 490 KWD are not
   * comparable magnitudes. Null for cities with no published cost profile.
   */
  mc: number | null;
  /** ISO 4217 code for `mc`. */ cur: string | null;
}

export interface DiscoveryIndex {
  generatedFor: "city-discovery";
  /** Bumped whenever the record shape changes so a stale cached index is detectable. */
  version: number;
  count: number;
  /** Distinct `ClimateProfile.climateZone` values, referenced by `DiscoveryCity.z`. */
  zones: string[];
  countries: DiscoveryCountry[];
  cities: DiscoveryCity[];
}

export const DISCOVERY_INDEX_VERSION = 1;
export const DISCOVERY_INDEX_PATH = "/discovery-index/cities.json";
