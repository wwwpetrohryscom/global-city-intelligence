import type { MetadataRoute } from "next";
import { getCities, getCountries, getModules, getRankings } from "@/lib/data/queries";
import {
  absoluteUrl,
  cityRoute,
  countryRoute,
  moduleRoute,
  rankingRoute,
  staticRoutes,
} from "@/lib/seo/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = getCities();
  const modules = getModules();

  const staticItems: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(staticRoutes.home),
      lastModified: new Date("2026-05-10"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl(staticRoutes.cities),
      lastModified: new Date("2026-05-10"),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: absoluteUrl(staticRoutes.countries),
      lastModified: new Date("2026-05-10"),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: absoluteUrl(staticRoutes.methodology),
      lastModified: new Date("2026-05-10"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl(staticRoutes.dataSources),
      lastModified: new Date("2026-05-10"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl(staticRoutes.rankings),
      lastModified: new Date("2026-05-10"),
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

  return [...staticItems, ...cityItems, ...countryItems, ...moduleItems, ...rankingItems];
}
