import type { NearbyWeekendPlace } from "@/types";

/**
 * Curated allow-list of nearby weekend places that have a dedicated
 * detail route at /nearby-weekend-places/[slug].
 *
 * Inclusion criteria (audited 2026-05-31):
 *   - verificationStatus === "verified"
 *   - wikidataId present
 *   - officialUrl present (from Wikidata P856)
 *   - latitude + longitude + coordinateSource present
 *   - image present and passing validate:nearby-places
 *   - countrySlug and at least one connectedCitySlug resolve
 *   - sourceIds resolve
 *
 * Adding a slug here automatically:
 *   - emits /nearby-weekend-places/<slug> in the sitemap
 *   - causes the directory + weekend-trip cards for that place to
 *     link to the internal detail page
 *
 * This is a controlled first batch. Future expansion must re-run
 * the eligibility audit before adding entries.
 */
export const NEARBY_WEEKEND_PLACE_DETAIL_SLUGS: readonly NearbyWeekendPlace["slug"][] = [
  "blue-mountains-near-sydney",
  "brighton-near-london",
  "bruges-near-brussels",
  "calanques-near-marseille",
  "englischer-garten-munich",
  "fontainebleau-near-paris",
  "greenwich-london",
  "heidelberg-near-frankfurt",
  "holyrood-park-edinburgh",
  "hyde-park-london",
  "karlstejn-near-prague",
  "kew-gardens-london",
  "lake-como-near-milan",
  "mount-rainier-near-seattle",
  "peak-district-near-manchester",
  "schonbrunn-vienna",
  "shenandoah-near-washington-dc",
  "sintra-near-lisbon",
  "suomenlinna-helsinki",
  "tivoli-near-rome",
  "toledo-near-madrid",
  "versailles-near-paris",
  "wicklow-mountains-near-dublin",
  "windsor-near-london",
  "zaanse-schans-near-amsterdam",
] as const;

const DETAIL_SLUG_SET: ReadonlySet<string> = new Set(
  NEARBY_WEEKEND_PLACE_DETAIL_SLUGS,
);

export function isNearbyWeekendPlaceDetailSlug(slug: string): boolean {
  return DETAIL_SLUG_SET.has(slug);
}
