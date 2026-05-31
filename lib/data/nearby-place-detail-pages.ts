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
  "bergamo-near-milan",
  "blue-mountains-near-sydney",
  "brighton-near-london",
  "bruges-near-brussels",
  "calanques-near-marseille",
  "chantilly-near-paris",
  "delft-near-rotterdam",
  "drottningholm-near-stockholm",
  "el-escorial-near-madrid",
  "englischer-garten-munich",
  "everglades-near-miami",
  "fontainebleau-near-paris",
  "gatineau-park-near-ottawa",
  "greenwich-london",
  "haarlem-near-amsterdam",
  "heidelberg-near-frankfurt",
  "holyrood-park-edinburgh",
  "hyde-park-london",
  "karlstejn-near-prague",
  "kew-gardens-london",
  "lake-como-near-milan",
  "lubeck-near-hamburg",
  "mount-rainier-near-seattle",
  "olympic-near-seattle",
  "peak-district-near-manchester",
  "point-reyes-near-san-francisco",
  "rocky-mountain-near-denver",
  "roskilde-near-copenhagen",
  "rottnest-island-near-perth",
  "royal-national-park-sydney",
  "schonbrunn-vienna",
  "segovia-near-madrid",
  "shenandoah-near-washington-dc",
  "sintra-near-lisbon",
  "stanley-park-vancouver",
  "suomenlinna-helsinki",
  "tivoli-near-rome",
  "toledo-near-madrid",
  "uppsala-near-stockholm",
  "versailles-near-paris",
  "wachau-valley-near-vienna",
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
