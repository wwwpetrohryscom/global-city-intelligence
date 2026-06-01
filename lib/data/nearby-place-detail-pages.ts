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
  "apuseni-natural-park-near-oradea",
  "atlantic-islands-of-galicia-national-park-near-vigo",
  "bergamo-near-milan",
  "black-forest-national-park-near-karlsruhe",
  "blue-mountains-near-sydney",
  "boise-national-forest-near-boise",
  "brighton-near-london",
  "bruges-near-brussels",
  "bunya-mountains-national-park-near-toowoomba",
  "cairngorms-national-park-near-aberdeen",
  "calanques-near-marseille",
  "castello-di-torrechiara-near-parma",
  "castlemaine-diggings-national-heritage-park-near-bendigo",
  "champagne-hillsides-houses-and-cellars-near-reims",
  "chantilly-near-paris",
  "chateau-de-chenonceau-near-tours",
  "citadel-of-namur-near-namur",
  "cliffs-of-moher-near-limerick",
  "curonian-spit-national-park-near-klaipeda",
  "delft-near-rotterdam",
  "drottningholm-near-stockholm",
  "el-escorial-near-madrid",
  "englischer-garten-munich",
  "etretat-near-rouen",
  "everglades-near-miami",
  "fontainebleau-near-paris",
  "gatineau-park-near-ottawa",
  "glamis-castle-near-dundee",
  "grampians-national-park-near-ballarat",
  "greenwich-london",
  "haarlem-near-amsterdam",
  "hailuoto-near-oulu",
  "heidelberg-near-frankfurt",
  "holyrood-park-edinburgh",
  "hyde-park-london",
  "jean-lafitte-national-historical-park-near-new-orleans",
  "karlstejn-near-prague",
  "kew-gardens-london",
  "lake-como-near-milan",
  "last-mountain-lake-national-wildlife-area-near-regina",
  "loonse-en-drunense-duinen-national-park-near-tilburg",
  "lubeck-near-hamburg",
  "mammoth-cave-national-park-near-louisville",
  "mount-rainier-near-seattle",
  "nesebar-near-varna",
  "new-forest-national-park-near-southampton",
  "north-york-moors-national-park-near-york",
  "olympic-near-seattle",
  "otranto-near-lecce",
  "parc-naturel-regional-de-briere-near-nantes",
  "peak-district-near-manchester",
  "picos-de-europa-national-park-near-santander",
  "point-reyes-near-san-francisco",
  "rocky-mountain-near-denver",
  "roskilde-near-copenhagen",
  "rottnest-island-near-perth",
  "royal-national-park-sydney",
  "roztocze-national-park-near-lublin",
  "saguaro-national-park-near-tucson",
  "schonbrunn-vienna",
  "segovia-near-madrid",
  "shenandoah-near-washington-dc",
  "sintra-near-lisbon",
  "slovak-paradise-national-park-near-kosice",
  "stanley-park-vancouver",
  "suomenlinna-helsinki",
  "tivoli-near-rome",
  "toledo-near-madrid",
  "uppsala-near-stockholm",
  "val-d-orcia-near-siena",
  "versailles-near-paris",
  "wachau-valley-near-vienna",
  "wichita-mountains-wildlife-refuge-near-oklahoma-city",
  "wicklow-mountains-near-dublin",
  "windsor-near-london",
  "zaanse-schans-near-amsterdam",
  "zollverein-coal-mine-industrial-complex-near-essen",
] as const;

const DETAIL_SLUG_SET: ReadonlySet<string> = new Set(
  NEARBY_WEEKEND_PLACE_DETAIL_SLUGS,
);

export function isNearbyWeekendPlaceDetailSlug(slug: string): boolean {
  return DETAIL_SLUG_SET.has(slug);
}
