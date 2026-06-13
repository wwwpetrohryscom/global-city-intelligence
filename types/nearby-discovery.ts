/**
 * Nearby-place discovery graph — local-first place-to-place navigation.
 *
 * A deterministic, statically-generated network linking each curated nearby
 * weekend place to a small set of geographically- and ecologically-related
 * places so a visitor can answer: "If I enjoyed this place, where else nearby
 * would I likely enjoy spending a day or a weekend?" — NOT "what is famous?".
 * No popularity, traffic, or visitor-count signal is used; relationships are
 * derived purely from coordinates, shared natural regions (mountain ranges,
 * rivers, lakes, coastlines), protected-area systems, administrative region,
 * broad ecoregion, and cross-border ecological continuity.
 *
 * This is a pure data layer reusing existing `/nearby-weekend-places/[slug]`
 * detail routes — no new routes, schemas, or page families are introduced.
 */

/** How two nearby places relate for local-first discovery. */
export enum NearbyPlaceRelationshipType {
  /** Within day-trip range with generic adjacency and no shared specific feature. */
  NearbyPlace = "nearby_place",
  /** Same country and same administrative / named region. */
  SameRegion = "same_region",
  /** Shared park operator or parent protected-area family. */
  SameProtectedAreaSystem = "same_protected_area_system",
  /** Shared mountain range, or two mountain places in the same massif. */
  SameMountainRegion = "same_mountain_region",
  /** Shared sea/coast, or two coastal places along the same coastline. */
  SameCoastline = "same_coastline",
  /** Both lie on / belong to the same river or watercourse. */
  SameRiverSystem = "same_river_system",
  /** Shared lake, or two lake places in the same lake district. */
  SameLakeRegion = "same_lake_region",
  /** Cross-region ecological continuity (same continent + broad biome band). */
  SameEcoregion = "same_ecoregion",
  /** A broader-area alternative day/weekend nature destination. */
  WeekendAlternative = "weekend_alternative",
  /** Nature areas in different countries forming a continuous landscape. */
  CrossBorderNature = "cross_border_nature",
}

/** A single related-place edge. */
export interface RelatedPlace {
  placeSlug: string;
  /** Great-circle distance between place centres, in kilometres. */
  distanceKm: number;
  relationshipType: NearbyPlaceRelationshipType;
}

/** A place's discovery node: its ordered list of related places (nearest first). */
export interface NearbyPlaceDiscoveryNode {
  placeSlug: string;
  relatedPlaces: readonly RelatedPlace[];
}
