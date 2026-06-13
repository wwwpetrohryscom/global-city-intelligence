/**
 * Thematic discovery collections — a theme-first discovery layer that sits
 * alongside (and does not replace) the geography-first regional collections.
 *
 * Each collection groups cities and nearby places around a common outdoor /
 * nature THEME (mountain escapes, lake escapes, waterfall destinations, alpine
 * landscapes, …) so a resident can discover by interest rather than by region.
 * Everything is deterministic and derived only from existing data — place
 * categories, Wikidata classifications (P31 / P4552 / P206), reference facts,
 * and the discovery graphs — never popularity, rankings, or "best" lists.
 *
 * Reuses existing `/cities/[slug]` and `/nearby-weekend-places/[slug]` routes
 * for members; the only new routes are `/themes` and `/themes/[slug]`. No new
 * schema types (WebPage / BreadcrumbList / ItemList only).
 *
 * The photo counters are future-ready, computed statically from the existing
 * community-photo records — no uploads, storage, or backend.
 */

/** The outdoor/nature theme a collection represents. */
export type ThemeType =
  | "mountain_escapes"
  | "lake_escapes"
  | "coastal_landscapes"
  | "island_getaways"
  | "forest_walks"
  | "national_park_weekends"
  | "protected_landscapes"
  | "river_valleys"
  | "waterfall_destinations"
  | "nature_photography_spots"
  | "sunrise_viewpoints"
  | "hiking_areas"
  | "cycling_friendly_areas"
  | "wildlife_areas"
  | "unesco_nature_areas"
  | "cross_border_nature_areas"
  | "family_outdoor_escapes"
  | "scenic_drives"
  | "weekend_nature_retreats"
  | "alpine_landscapes"
  | "nordic_nature"
  | "mediterranean_nature"
  | "atlantic_coast_nature"
  | "great_lakes_nature"
  | "volcanic_landscapes"
  | "wetlands_marshes"
  | "rural_countryside_escapes";

/** A thematic discovery collection of cities + nearby places. */
export interface ThematicCollection {
  slug: string;
  title: string;
  themeType: ThemeType;
  description: string;
  /** City slugs in this theme (resolve to /cities/[slug]). */
  cities: readonly string[];
  /** Nearby-place slugs in this theme (resolve to /nearby-weekend-places/[slug]). */
  nearbyPlaces: readonly string[];
  /** A small ordered subset of nearbyPlaces to surface first. */
  featuredPlaces: readonly string[];
  /** A small ordered subset of cities to surface first. */
  featuredCities: readonly string[];
  /** City slugs in this theme that have a weekend-trip page. */
  weekendTrips: readonly string[];
  /** City slugs in this theme that have a visual-guide page. */
  visualGuides: readonly string[];
  /** Slugs of related thematic collections (theme-relevant). */
  relatedCollections: readonly string[];
  /** Future-ready photo counters, computed statically from existing data. */
  officialPhotoCount: number;
  communityPhotoCount: number;
  photoEligiblePlaceCount: number;
}
