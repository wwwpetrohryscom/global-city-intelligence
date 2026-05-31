import type { MetadataRoute } from "next";
import { LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllArrivalPages,
  getAllCityIntentPages,
  getAllCollections,
  getAllComparisons,
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
import {
  absoluteUrl,
  arrivalRoute,
  cityRoute,
  comparisonRoute,
  countryRoute,
  getCityIntentUrl,
  getCollectionUrl,
  moduleRoute,
  movingToCityRoute,
  neighborhoodPlanningRoute,
  rankingRoute,
  staticRoutes,
  summerTravelRoute,
  visualCityGuideRoute,
  weekendTripRoute,
} from "@/lib/seo/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = getCities();
  const modules = getModules();
  const staticFreshness = new Date(LAST_UPDATED);

  const staticItems: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(staticRoutes.home),
      lastModified: staticFreshness,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl(staticRoutes.cities),
      lastModified: staticFreshness,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: absoluteUrl(staticRoutes.countries),
      lastModified: staticFreshness,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: absoluteUrl(staticRoutes.methodology),
      lastModified: staticFreshness,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl(staticRoutes.dataSources),
      lastModified: staticFreshness,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl(staticRoutes.rankings),
      lastModified: staticFreshness,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl(staticRoutes.compare),
      lastModified: staticFreshness,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl(staticRoutes.collections),
      lastModified: staticFreshness,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl(staticRoutes.tools),
      lastModified: staticFreshness,
      changeFrequency: "monthly",
      priority: 0.72,
    },
    {
      url: absoluteUrl(staticRoutes.costOfLivingCalculator),
      lastModified: staticFreshness,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl(staticRoutes.travelBudgetCalculator),
      lastModified: staticFreshness,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl(staticRoutes.relocationChecklist),
      lastModified: staticFreshness,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl(staticRoutes.arrival),
      lastModified: staticFreshness,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: absoluteUrl(staticRoutes.movingTo),
      lastModified: staticFreshness,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: absoluteUrl(staticRoutes.visualGuides),
      lastModified: staticFreshness,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: absoluteUrl(staticRoutes.summerTravel),
      lastModified: staticFreshness,
      changeFrequency: "monthly",
      priority: 0.75,
    },
  ];

  const cityItems = cities.map((city) => ({
    url: absoluteUrl(cityRoute(city.slug)),
    lastModified: new Date(city.lastUpdated),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const countryItems = getCountries().map((country) => ({
    url: absoluteUrl(countryRoute(country.slug)),
    lastModified: new Date(country.lastUpdated),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const moduleItems = modules.flatMap((moduleItem) =>
    cities.map((city) => ({
      url: absoluteUrl(moduleRoute(moduleItem.slug, city.slug)),
      lastModified: new Date(city.modules[moduleItem.slug].lastUpdated),
      changeFrequency: "weekly" as const,
      priority: 0.82,
    })),
  );

  const rankingItems = getRankings().map((ranking) => ({
    url: absoluteUrl(rankingRoute(ranking.slug)),
    lastModified: new Date(ranking.lastUpdated),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const comparisonItems = getAllComparisons().map((comparison) => ({
    url: absoluteUrl(comparisonRoute(comparison.slug)),
    lastModified: new Date(comparison.updatedDate),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const collectionItems = getAllCollections().map((collection) => ({
    url: absoluteUrl(getCollectionUrl(collection.slug)),
    lastModified: new Date(collection.updatedDate),
    changeFrequency: "weekly" as const,
    priority: 0.88,
  }));

  const cityIntentItems = getAllCityIntentPages().map((page) => ({
    url: absoluteUrl(getCityIntentUrl(page.citySlug, page.intentSlug)),
    lastModified: new Date(page.updatedDate),
    changeFrequency: "weekly" as const,
    priority: 0.83,
  }));

  const arrivalItems = getAllArrivalPages().map((page) => ({
    url: absoluteUrl(arrivalRoute(page.citySlug)),
    lastModified: new Date(page.updatedDate),
    changeFrequency: "monthly" as const,
    priority: 0.74,
  }));

  const neighborhoodPlanningItems = getAllNeighborhoodPlanningPages().map(
    (page) => ({
      url: absoluteUrl(neighborhoodPlanningRoute(page.citySlug)),
      lastModified: new Date(page.updatedDate),
      changeFrequency: "monthly" as const,
      priority: 0.73,
    }),
  );

  const movingToCityItems = getAllMovingToCityPages().map((page) => ({
    url: absoluteUrl(movingToCityRoute(page.citySlug)),
    lastModified: new Date(page.updatedDate),
    changeFrequency: "monthly" as const,
    priority: 0.74,
  }));

  const visualCityGuideItems = getAllVisualCityGuidePages().map((page) => ({
    url: absoluteUrl(visualCityGuideRoute(page.citySlug)),
    lastModified: new Date(page.updatedDate),
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));

  const summerTravelItems = getAllSummerTravelPages().map((page) => ({
    url: absoluteUrl(summerTravelRoute(page.citySlug)),
    lastModified: new Date(page.updatedDate),
    changeFrequency: "monthly" as const,
    priority: 0.76,
  }));

  const weekendTripItems = getAllWeekendTripPages().map((page) => ({
    url: absoluteUrl(weekendTripRoute(page.citySlug)),
    lastModified: new Date(page.updatedDate),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    ...staticItems,
    ...cityItems,
    ...countryItems,
    ...moduleItems,
    ...rankingItems,
    ...comparisonItems,
    ...collectionItems,
    ...cityIntentItems,
    ...arrivalItems,
    ...neighborhoodPlanningItems,
    ...movingToCityItems,
    ...visualCityGuideItems,
    ...summerTravelItems,
    ...weekendTripItems,
  ];
}
