import { NEARBY_WEEKEND_PLACE_DETAIL_SLUGS } from "@/lib/data/nearby-place-detail-pages";
import {
  getAllArrivalPages,
  getAllCityIntentPages,
  getAllCollections,
  getAllMovingToCityPages,
  getAllNeighborhoodPlanningPages,
  getAllSummerTravelPages,
  getAllVisualCityGuidePages,
  getAllWeekendTripPages,
  getCities,
  getCountries,
  getModules,
  getRankings,
} from "@/lib/data/queries";
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

export function nearbyWeekendPlaceRoute(slug: string) {
  return `/nearby-weekend-places/${slug}`;
}

export function getCollectionUrl(slug: string) {
  return `/${slug}`;
}

export function getCollectionsIndexUrl() {
  return staticRoutes.collections;
}

export function getAllIndexableRoutes() {
  const cities = getCities();
  const modules = getModules();

  return [
    staticRoutes.home,
    staticRoutes.cities,
    staticRoutes.countries,
    staticRoutes.methodology,
    staticRoutes.dataSources,
    staticRoutes.rankings,
    staticRoutes.compare,
    staticRoutes.collections,
    staticRoutes.tools,
    staticRoutes.costOfLivingCalculator,
    staticRoutes.travelBudgetCalculator,
    staticRoutes.relocationChecklist,
    staticRoutes.arrival,
    staticRoutes.movingTo,
    staticRoutes.visualGuides,
    staticRoutes.summerTravel,
    staticRoutes.weekendTrips,
    staticRoutes.nearbyWeekendPlaces,
    ...cities.map((city) => cityRoute(city.slug)),
    ...getCountries().map((country) => countryRoute(country.slug)),
    ...modules.flatMap((moduleItem) =>
      cities.map((city) => moduleRoute(moduleItem.slug, city.slug)),
    ),
    ...getRankings().map((ranking) => rankingRoute(ranking.slug)),
    ...getAllCollections().map((collection) => getCollectionUrl(collection.slug)),
    ...getAllCityIntentPages().map((page) =>
      getCityIntentUrl(page.citySlug, page.intentSlug),
    ),
    ...getAllArrivalPages().map((page) => arrivalRoute(page.citySlug)),
    ...getAllNeighborhoodPlanningPages().map((page) =>
      neighborhoodPlanningRoute(page.citySlug),
    ),
    ...getAllMovingToCityPages().map((page) =>
      movingToCityRoute(page.citySlug),
    ),
    ...getAllVisualCityGuidePages().map((page) =>
      visualCityGuideRoute(page.citySlug),
    ),
    ...getAllSummerTravelPages().map((page) =>
      summerTravelRoute(page.citySlug),
    ),
    ...getAllWeekendTripPages().map((page) =>
      weekendTripRoute(page.citySlug),
    ),
    ...NEARBY_WEEKEND_PLACE_DETAIL_SLUGS.map((slug) =>
      nearbyWeekendPlaceRoute(slug),
    ),
  ];
}
