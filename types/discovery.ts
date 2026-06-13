/**
 * City discovery graph — local-first city-to-city navigation.
 *
 * A deterministic, statically-generated network linking each city to a small
 * set of geographically-related cities so residents can discover where else
 * nearby they could spend a day or a weekend. It answers "where else nearby
 * could I go?" — NOT "what are the most famous cities?" (no popularity or
 * tourism rankings are used; relationships are derived purely from geography,
 * shared region, shared natural-recreation profile, and country borders).
 *
 * This is a pure data layer reusing existing `/cities/[slug]` routes — no new
 * routes, schemas, or page families are introduced.
 */

/** How two cities relate for local-first discovery. */
export type CityRelationshipType =
  | "nearby_city"
  | "same_region"
  | "same_corridor"
  | "weekend_trip"
  | "coastal_cluster"
  | "mountain_cluster"
  | "lake_cluster"
  | "cross_border";

/** A single related-city edge. */
export interface RelatedCity {
  citySlug: string;
  /** Great-circle distance between city centres, in kilometres. */
  distanceKm: number;
  relationshipType: CityRelationshipType;
}

/** A city's discovery node: its ordered list of related cities (nearest first). */
export interface CityDiscoveryNode {
  citySlug: string;
  relatedCities: readonly RelatedCity[];
}
