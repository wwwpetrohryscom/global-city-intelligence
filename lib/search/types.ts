import type { MacroRegion } from "@/lib/search/regions";

/**
 * Wire format for the generated search index.
 *
 * Deliberately minimal: names, slugs, the country relationship, and the two
 * facets the UI filters on. No Phase A–F payloads, no module data, no imagery,
 * no nearby-place records, no prose. Keys are short because they are repeated
 * ~4,500 times in the city index and every byte is transferred to the client.
 */

/** One country row. `c` is the number of published cities for that country. */
export interface CountryIndexRecord {
  /** slug */ s: string;
  /** name */ n: string;
  /** ISO 3166-1 alpha-2 */ i: string;
  /** fine-grained source region, e.g. "Baltic Europe" */ r: string;
  /** macro region bucket used by the filters */ m: MacroRegion | null;
  /** published city count */ c: number;
}

/** One city row. The country relationship is by slug; the name is denormalised
 *  so a result row can render "Porto, Portugal" without a second lookup. */
export interface CityIndexRecord {
  /** slug */ s: string;
  /** name */ n: string;
  /** country slug */ cs: string;
  /** country name */ cn: string;
  /**
   * Disambiguator, present ONLY on rows whose (name, country) pair is not
   * unique — 14 rows today, all US (two Portlands, two Salems, and so on).
   * Without it those results render as identical strings and a visitor cannot
   * tell which one they are about to open.
   *
   * The value is the city's own slug, i.e. its real URL path. The city records
   * carry no state/province field (`region` is "North America" for every one
   * of the colliding rows), so the slug is the only genuine distinguishing
   * datum available — inventing state names from slug suffixes would be
   * fabrication.
   */
  d?: string;
}

export interface CountrySearchIndex {
  generatedFor: string;
  count: number;
  countries: CountryIndexRecord[];
}

export interface CitySearchIndex {
  generatedFor: string;
  count: number;
  cities: CityIndexRecord[];
}

export const SEARCH_INDEX_COUNTRIES_PATH = "/search-index/countries.json";
export const SEARCH_INDEX_CITIES_PATH = "/search-index/cities.json";
