import type { MetadataRoute } from "next";
import { LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllCollections,
  getAllComparisons,
  getCities,
  getCountries,
  getModules,
  getRankings,
} from "@/lib/data/queries";
import {
  absoluteUrl,
  cityRoute,
  comparisonRoute,
  countryRoute,
  getCollectionUrl,
  moduleRoute,
  rankingRoute,
  staticRoutes,
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

  return [
    ...staticItems,
    ...cityItems,
    ...countryItems,
    ...moduleItems,
    ...rankingItems,
    ...comparisonItems,
    ...collectionItems,
  ];
}
