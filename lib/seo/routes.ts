import { ECOSYSTEM_PATH } from "@/lib/ecosystem/products";
import type { ModuleSlug } from "@/types";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.globalcityintelligence.com";

export const staticRoutes = {
  home: "/",
  cities: "/cities",
  countries: "/countries",
  methodology: "/methodology",
  dataSources: "/data-sources",
  rankings: "/rankings",
  compare: "/compare",
  exploreCities: "/explore-cities",
  compareCities: "/compare-cities",
  collections: "/best-cities",
  tools: "/tools",
  costOfLivingCalculator: "/tools/cost-of-living-calculator",
  travelBudgetCalculator: "/tools/travel-budget-calculator",
  relocationChecklist: "/tools/relocation-checklist",
  arrival: "/arrival",
  movingTo: "/moving-to",
  visualGuides: "/visual-guides",
  summerTravel: "/summer-travel",
  weekendTrips: "/weekend-trips",
  nearbyWeekendPlaces: "/nearby-weekend-places",
  regionalCollections: "/collections",
  thematicCollections: "/themes",
  ecosystem: ECOSYSTEM_PATH,
} as const;

export function comparisonRoute(comparisonSlug: string) {
  return `/compare/${comparisonSlug}`;
}

export function absoluteUrl(path: string) {
  if (path === "/") {
    return siteUrl;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function cityRoute(citySlug: string) {
  return `/cities/${citySlug}`;
}

export function getCityIntentUrl(citySlug: string, intentSlug: string) {
  return `/cities/${citySlug}/${intentSlug}`;
}

export function countryRoute(countrySlug: string) {
  return `/countries/${countrySlug}`;
}

export function moduleRoute(moduleSlug: ModuleSlug, citySlug: string) {
  return `/${moduleSlug}/${citySlug}`;
}

export function rankingRoute(rankingSlug: string) {
  return `/rankings/${rankingSlug}`;
}

export function arrivalRoute(citySlug: string) {
  return `/arrival/${citySlug}`;
}

export function neighborhoodPlanningRoute(citySlug: string) {
  return `/cities/${citySlug}/neighborhoods`;
}

export function movingToCityRoute(citySlug: string) {
  return `/cities/${citySlug}/moving-to`;
}

export function visualCityGuideRoute(citySlug: string) {
  return `/cities/${citySlug}/visual-guide`;
}

export function summerTravelRoute(citySlug: string) {
  return `/cities/${citySlug}/summer-travel`;
}

export function weekendTripRoute(citySlug: string) {
  return `/cities/${citySlug}/weekend-trip`;
}

export function costOfLivingRoute(citySlug: string) {
  return `/cities/${citySlug}/cost-of-living`;
}

export function climateRoute(citySlug: string) {
  return `/cities/${citySlug}/climate`;
}

export function economyRoute(citySlug: string) {
  return `/cities/${citySlug}/economy`;
}

export function educationRoute(citySlug: string) {
  return `/cities/${citySlug}/education`;
}

export function healthcareRoute(citySlug: string) {
  return `/cities/${citySlug}/healthcare`;
}

export function nearbyWeekendPlacesCityRoute(citySlug: string) {
  return `/cities/${citySlug}/nearby-weekend-places`;
}

export function nearbyWeekendPlaceRoute(slug: string) {
  return `/nearby-weekend-places/${slug}`;
}

export function getCollectionUrl(slug: string) {
  return `/${slug}`;
}

export function regionalCollectionRoute(slug: string) {
  return `/collections/${slug}`;
}

export function thematicCollectionRoute(slug: string) {
  return `/themes/${slug}`;
}

export function getCollectionsIndexUrl() {
  return staticRoutes.collections;
}

/**
 * NOTE: `getAllIndexableRoutes()` used to live here. It was the ONLY consumer of
 * this file's `@/lib/data/queries` imports, and because ~86 modules import this
 * file, it transitively pulled the ~155 MB generated data layer into nearly every
 * route's server bundle (one ~132.7 MB shared chunk). It now lives in
 * `lib/seo/build/all-indexable-routes.ts`, which is build-time only.
 *
 * Keep this module free of `@/lib/data` imports: everything here must stay pure
 * string/path construction so runtime routes do not load the corpus.
 */
