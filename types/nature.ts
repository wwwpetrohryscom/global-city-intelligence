/**
 * Nature discovery — canonical taxonomy for city-based outdoor destinations.
 *
 * The taxonomy is derived from what the curated nearby-place corpus actually
 * contains (Wikidata P31 types across 32,543 places), not from a wish list of
 * URL templates. Categories with no corpus support are absent; categories the
 * corpus supports but that never reach a publication threshold still exist so
 * a place can be labelled honestly on the hub.
 */
export type NatureCategory =
  | "waterfall"
  | "cave"
  | "canyon"
  | "glacier"
  | "beach"
  | "lake"
  | "island"
  | "volcano"
  | "river"
  | "wetland"
  | "mountain"
  | "valley"
  | "coast"
  | "desert"
  | "forest"
  | "national-park"
  | "nature-reserve"
  | "park"
  | "viewpoint";

/**
 * How a classification was reached.
 *  - `high`   a curated Wikidata type (P31) mapped directly
 *  - `medium` resolved through one subclass-of (P279) hop
 *  - `low`    resolved only from the type entity's English label
 *  - `none`   no structured evidence, or vetoed as contamination
 * Only `high` and `medium` are publishable.
 */
export type NatureConfidence = "none" | "low" | "medium" | "high";

export interface NatureClassification {
  placeSlug: string;
  /** Every category the place's structured types license, in priority order. */
  categories: readonly NatureCategory[];
  /** Highest-priority category, or undefined when nothing is publishable. */
  primary?: NatureCategory;
  confidence: NatureConfidence;
  /** English label of the Wikidata type that produced the primary category. */
  typeLabel?: string;
}

/** A corroborated city centre. */
export interface CityCoordinate {
  citySlug: string;
  latitude: number;
  longitude: number;
  wikidataId?: string;
}

/**
 * Distance bands, derived from the corpus's own `distanceBand` vocabulary:
 * measured against real coordinates the existing `nearby` records sit at a
 * p99 of 59 km, `regional` spans 60-120 km, and `longer_weekend` starts at
 * 122 km. The bands below reproduce those boundaries rather than inventing
 * new ones. Bands describe DISTANCE, never travel time.
 */
export type NatureDistanceBand = "nearby" | "day-trip" | "weekend";

/** One classified place as it appears for a specific city. */
export interface CityNaturePlace {
  placeSlug: string;
  name: string;
  countrySlug: string;
  /** Great-circle distance from the city centre, in kilometres. */
  distanceKm: number;
  band: NatureDistanceBand;
  categories: readonly NatureCategory[];
  primary: NatureCategory;
  confidence: NatureConfidence;
  typeLabel?: string;
  summary: string;
  /** True when the place lies in a different country from the city. */
  crossBorder: boolean;
  hasDetailPage: boolean;
  image?: NatureImage;
}

export interface NatureImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  sourceUrl: string;
  author: string;
  license: string;
  licenseUrl?: string;
  attributionText: string;
}

/** Category rollup for one city. */
export interface CityNatureCategory {
  category: NatureCategory;
  count: number;
  /** Set when the category clears the dedicated-page threshold. */
  routeSegment?: NatureRouteSegment;
}

/** URL segments a dedicated category page may be published under. */
export type NatureRouteSegment =
  | "lakes"
  | "mountains"
  | "beaches"
  | "forests"
  | "waterfalls"
  | "parks"
  | "islands"
  | "protected-areas";

/** Everything the nature pages for a city need, computed once. */
export interface CityNatureProfile {
  citySlug: string;
  places: readonly CityNaturePlace[];
  categories: readonly CityNatureCategory[];
  /** Distinct countries represented, city's own country first. */
  countrySlugs: readonly string[];
  crossBorderCount: number;
  /** True when the umbrella /nature hub clears its publication threshold. */
  hubEligible: boolean;
}
