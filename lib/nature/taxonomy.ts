import type { NatureCategory, NatureRouteSegment } from "@/types";

/**
 * Presentation + publication rules for the nature taxonomy.
 *
 * The category list itself lives in `types/nature.ts`; the classification that
 * assigns categories to places is generated into
 * `lib/data/nature-classification.ts`. This module is the single place where a
 * category becomes a label, a heading, or a route — no component does its own
 * string matching on category names.
 */

export const NATURE_CATEGORY_LABEL: Record<NatureCategory, string> = {
  waterfall: "Waterfall",
  cave: "Cave",
  canyon: "Canyon",
  glacier: "Glacier",
  beach: "Beach",
  lake: "Lake",
  island: "Island",
  volcano: "Volcano",
  river: "River",
  wetland: "Wetland",
  mountain: "Mountain",
  valley: "Valley",
  coast: "Coast",
  desert: "Desert",
  forest: "Forest",
  "national-park": "National park",
  "nature-reserve": "Protected area",
  park: "Park",
  viewpoint: "Viewpoint",
};

export const NATURE_CATEGORY_PLURAL: Record<NatureCategory, string> = {
  waterfall: "Waterfalls",
  cave: "Caves",
  canyon: "Canyons",
  glacier: "Glaciers",
  beach: "Beaches",
  lake: "Lakes",
  island: "Islands",
  volcano: "Volcanoes",
  river: "Rivers",
  wetland: "Wetlands",
  mountain: "Mountains",
  valley: "Valleys",
  coast: "Coast and headlands",
  desert: "Desert landscapes",
  forest: "Forests",
  "national-park": "National parks",
  "nature-reserve": "Protected areas",
  park: "Parks",
  viewpoint: "Viewpoints",
};

/**
 * Dedicated per-city routes. A segment may aggregate more than one category —
 * `protected-areas` covers both national parks and other designated reserves,
 * because splitting them produces two thin pages where the reader wants one.
 */
export const NATURE_ROUTE_CATEGORIES: Record<
  NatureRouteSegment,
  readonly NatureCategory[]
> = {
  lakes: ["lake"],
  mountains: ["mountain"],
  beaches: ["beach"],
  forests: ["forest"],
  waterfalls: ["waterfall"],
  parks: ["park"],
  islands: ["island"],
  "protected-areas": ["national-park", "nature-reserve"],
};

/** Stable order the routes are listed in, on hubs and in the sitemap. */
export const NATURE_ROUTE_ORDER: readonly NatureRouteSegment[] = [
  "lakes",
  "mountains",
  "beaches",
  "forests",
  "waterfalls",
  "islands",
  "parks",
  "protected-areas",
];

export const NATURE_ROUTE_LABEL: Record<NatureRouteSegment, string> = {
  lakes: "Lakes",
  mountains: "Mountains",
  beaches: "Beaches",
  forests: "Forests",
  waterfalls: "Waterfalls",
  parks: "Parks",
  islands: "Islands",
  "protected-areas": "Protected areas",
};

/**
 * Publication thresholds.
 *
 * A URL template existing is not a reason to publish a page. These numbers
 * come from the measured corpus distribution: at four places a dedicated page
 * has enough to compare and rank by distance, and 2,807 city/category pairs
 * clear it. Dropping to three would add 1,867 pages whose median content is a
 * three-card list — route count, not value.
 *
 * The hub additionally requires three distinct categories, because its whole
 * job is grouping: with one or two groups it is a reordering of the existing
 * nearby-weekend-places page rather than a different answer.
 */
export const NATURE_PAGE_MIN_PLACES = 4;
export const NATURE_HUB_MIN_PLACES = 5;
export const NATURE_HUB_MIN_CATEGORIES = 3;

/**
 * A place further than this from the city centre is not a weekend destination
 * from that city, whatever the corpus attached it to. 99.9% of the corpus's
 * city-place edges sit inside it.
 */
export const NATURE_MAX_DISTANCE_KM = 300;

/** Confidence tiers allowed onto a published page. */
export const NATURE_PUBLISHABLE_CONFIDENCE = ["high", "medium"] as const;

export function natureCategoryLabel(category: NatureCategory): string {
  return NATURE_CATEGORY_LABEL[category];
}

export function natureCategoryPlural(category: NatureCategory): string {
  return NATURE_CATEGORY_PLURAL[category];
}

/** The route segment a category can be published under, if any. */
export function routeSegmentForCategory(
  category: NatureCategory,
): NatureRouteSegment | undefined {
  return NATURE_ROUTE_ORDER.find((segment) =>
    NATURE_ROUTE_CATEGORIES[segment].includes(category),
  );
}
