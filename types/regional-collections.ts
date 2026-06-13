/**
 * Regional discovery collections — local-first regional navigation.
 *
 * A deterministic, statically-generated layer that groups existing cities and
 * nearby weekend places into named natural regions (mountain ranges, coasts,
 * lakes, river valleys, national-park systems, forests, islands, cross-border
 * landscapes) so a resident can discover where else nearby they could spend a
 * day or a weekend. Derived purely from existing data — coordinates, nearby-
 * place categories, and Wikidata-backed classifications (mountain range P4552,
 * body of water P206, protected-area operator P137) — never popularity,
 * tourism rankings, or visitor counts.
 *
 * This reuses existing `/cities/[slug]` and `/nearby-weekend-places/[slug]`
 * routes for members; the only new routes are the collections hub and detail
 * pages. No new schema types are introduced (WebPage / BreadcrumbList /
 * ItemList only).
 */

/** The natural-region category a collection represents. */
export type RegionType =
  | "mountain_region"
  | "coastal_region"
  | "lake_region"
  | "river_region"
  | "national_park_region"
  | "forest_region"
  | "island_region"
  | "cross_border_region"
  | "protected_landscape_region"
  | "weekend_escape_region";

/** A regional discovery collection of cities + nearby places. */
export interface RegionalCollection {
  slug: string;
  title: string;
  description: string;
  regionType: RegionType;
  /** City slugs in this region (resolve to /cities/[slug]). */
  cities: readonly string[];
  /** Nearby-place slugs in this region (resolve to /nearby-weekend-places/[slug]). */
  nearbyPlaces: readonly string[];
  /** A small ordered subset of nearbyPlaces to surface first. */
  featuredPlaces: readonly string[];
  /** A small ordered subset of cities to surface first. */
  featuredCities: readonly string[];
  /** Slugs of related collections (shared region type / places / cities). */
  relatedCollections: readonly string[];
}
