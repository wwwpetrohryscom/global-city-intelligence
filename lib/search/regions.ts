/**
 * Macro-region grouping used by the country/city discovery filters.
 *
 * IMPORTANT: this is a *derived presentation layer*, not a new taxonomy. The
 * authoritative geography stays `Country.region` in `lib/data/countries.ts`
 * (23 fine-grained values such as "Baltic Europe" or "Southeastern Europe"),
 * which is still what country cards display. This module only folds those
 * values into the seven coarse buckets the discovery filters expose, so a
 * visitor can narrow 105 countries without us rewriting any source data.
 *
 * Nothing here is client-hostile: no `lib/data` import, so it is safe to pull
 * into a client component.
 */

export const MACRO_REGIONS = [
  "Europe",
  "Asia",
  "North America",
  "Latin America",
  "Africa",
  "Oceania",
  "Middle East",
] as const;

export type MacroRegion = (typeof MACRO_REGIONS)[number];

/** Fine-grained `Country.region` → macro bucket. */
const REGION_TO_MACRO: Record<string, MacroRegion> = {
  "Western Europe": "Europe",
  "Southeastern Europe": "Europe",
  "Central Europe": "Europe",
  "Southern Europe": "Europe",
  "Northern Europe": "Europe",
  "Eastern Europe": "Europe",
  "Baltic Europe": "Europe",

  "Southeast Asia": "Asia",
  "East Asia": "Asia",
  "South Asia": "Asia",
  "Central Asia": "Asia",

  "North America": "North America",

  "Latin America": "Latin America",
  "Central America": "Latin America",
  Caribbean: "Latin America",

  Africa: "Africa",
  "Southern Africa": "Africa",
  "East Africa": "Africa",
  "West Africa": "Africa",
  "North Africa": "Africa",

  Oceania: "Oceania",

  "Middle East": "Middle East",
};

/**
 * The source data splits the region between "Middle East" (Oman, Kuwait,
 * Bahrain, Jordan, Lebanon, Iraq) and "Western Asia" (the Gulf states, Israel,
 * Turkey, Iran and the South Caucasus). A "Middle East" filter that omitted
 * Saudi Arabia and the UAE would read as broken, so "Western Asia" is resolved
 * per country rather than as a block. The three South Caucasus states fall to
 * Asia; every other "Western Asia" member is treated as Middle East.
 */
const WESTERN_ASIA_TO_ASIA = new Set(["georgia", "armenia", "azerbaijan"]);

export function macroRegionFor(
  countrySlug: string,
  region: string,
): MacroRegion | null {
  if (region === "Western Asia") {
    return WESTERN_ASIA_TO_ASIA.has(countrySlug) ? "Asia" : "Middle East";
  }
  return REGION_TO_MACRO[region] ?? null;
}

/**
 * Emoji flag derived from the ISO 3166-1 alpha-2 code already stored on every
 * country record — a pure transform of existing data, not a new asset or a new
 * claim. Returns an empty string for anything that is not a well-formed code so
 * a bad value degrades to "no flag" instead of rendering mojibake.
 */
export function flagEmoji(iso2: string): string {
  const code = iso2.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "";
  const REGIONAL_INDICATOR_A = 0x1f1e6;
  const LETTER_A = 65;
  return String.fromCodePoint(
    ...[...code].map((c) => REGIONAL_INDICATOR_A + (c.charCodeAt(0) - LETTER_A)),
  );
}
