/**
 * Retired city slugs and the canonical slug each now resolves to.
 *
 * These are consolidations of records that denoted the SAME real place: both
 * sides resolved to one Wikidata entity and sat on one coordinate. The retired
 * slug had been published, so it keeps a permanent 301 to its canonical twin
 * (see netlify.toml) and resolves silently anywhere a slug is read back from a
 * visitor's browser.
 *
 * This is deliberately not a general redirect table. An entry belongs here only
 * when a slug was published and then retired by a proven identity merge — never
 * to paper over a slug that simply changed shape, and never for a slug that was
 * never public.
 */
export const RETIRED_CITY_SLUGS: Readonly<Record<string, string>> = {
  // Both resolved to Q190847, "Alexandroupolis, city in Thrace, Greece".
  "alexandroupolis-gr": "alexandroupoli",
  // Both resolved to Q26087, "Tromsø Municipality", on the same point, and
  // both carried municipality-scale population.
  "tromso-municipality": "tromso",
};

/**
 * Resolve a possibly-retired city slug to the slug that exists today.
 * Returns the input unchanged when it is not a retired slug, so it is safe to
 * call on any value.
 */
export function resolveCitySlug(slug: string): string {
  return RETIRED_CITY_SLUGS[slug] ?? slug;
}

/** True when the slug was retired by an identity merge. */
export function isRetiredCitySlug(slug: string): boolean {
  return Object.hasOwn(RETIRED_CITY_SLUGS, slug);
}
