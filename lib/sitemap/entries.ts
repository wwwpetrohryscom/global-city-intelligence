import type { MetadataRoute } from "next";
import { LAST_UPDATED } from "@/lib/data/constants";
import { NEARBY_WEEKEND_PLACE_DETAIL_SLUGS } from "@/lib/data/nearby-place-detail-pages";
import {
  getAllArrivalPages,
  getAllCitiesWithNearbyWeekendPlaces,
  getAllCityIntentPages,
  getAllCollections,
  getAllComparisons,
  getAllMovingToCityPages,
  getAllNeighborhoodPlanningPages,
  getAllRegionalCollections,
  getAllSummerTravelPages,
  getAllThematicCollections,
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
  climateRoute,
  economyRoute,
  educationRoute,
  healthcareRoute,
  costOfLivingRoute,
  comparisonRoute,
  countryRoute,
  getCityIntentUrl,
  getCollectionUrl,
  moduleRoute,
  movingToCityRoute,
  nearbyWeekendPlaceRoute,
  nearbyWeekendPlacesCityRoute,
  neighborhoodPlanningRoute,
  rankingRoute,
  regionalCollectionRoute,
  staticRoutes,
  thematicCollectionRoute,
  summerTravelRoute,
  visualCityGuideRoute,
  weekendTripRoute,
} from "@/lib/seo/routes";

/** A single sitemap URL entry plus the category it shards under. */
export type SitemapEntry = MetadataRoute.Sitemap[number] & { category: SitemapCategory };

/**
 * Sitemap shard categories (stable, deterministic order). New categories may be
 * appended; existing ones are never renamed (shard URLs stay stable between builds).
 */
export const SITEMAP_CATEGORY_ORDER = [
  "static",
  "country",
  "cities",
  "phases",
  "modules",
  "nearby",
  "weekend",
  "visual",
  "collections",
  "guides",
] as const;
export type SitemapCategory = (typeof SITEMAP_CATEGORY_ORDER)[number];

function tag<T extends MetadataRoute.Sitemap>(
  category: SitemapCategory,
  items: T,
): SitemapEntry[] {
  return items.map((item) => ({ ...item, category }));
}

/**
 * Build the complete, deterministic set of sitemap entries — identical URL set,
 * lastModified, changeFrequency and priority as the legacy single sitemap, each
 * tagged with a shard category. Pure / no current-date usage (Rule #3).
 */
export function getSitemapEntries(): SitemapEntry[] {
  const cities = getCities();
  const modules = getModules();
  const staticFreshness = new Date(LAST_UPDATED);

  // ---- static (home, hubs, tools, index pages) ----
  const staticItems = tag("static", [
    { url: absoluteUrl(staticRoutes.home), lastModified: staticFreshness, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl(staticRoutes.cities), lastModified: staticFreshness, changeFrequency: "weekly", priority: 0.95 },
    { url: absoluteUrl(staticRoutes.countries), lastModified: staticFreshness, changeFrequency: "weekly", priority: 0.95 },
    { url: absoluteUrl(staticRoutes.methodology), lastModified: staticFreshness, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl(staticRoutes.dataSources), lastModified: staticFreshness, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl(staticRoutes.rankings), lastModified: staticFreshness, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl(staticRoutes.compare), lastModified: staticFreshness, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl(staticRoutes.collections), lastModified: staticFreshness, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl(staticRoutes.tools), lastModified: staticFreshness, changeFrequency: "monthly", priority: 0.72 },
    { url: absoluteUrl(staticRoutes.costOfLivingCalculator), lastModified: staticFreshness, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl(staticRoutes.travelBudgetCalculator), lastModified: staticFreshness, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl(staticRoutes.relocationChecklist), lastModified: staticFreshness, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl(staticRoutes.arrival), lastModified: staticFreshness, changeFrequency: "monthly", priority: 0.75 },
    { url: absoluteUrl(staticRoutes.movingTo), lastModified: staticFreshness, changeFrequency: "monthly", priority: 0.75 },
    { url: absoluteUrl(staticRoutes.visualGuides), lastModified: staticFreshness, changeFrequency: "monthly", priority: 0.75 },
    { url: absoluteUrl(staticRoutes.summerTravel), lastModified: staticFreshness, changeFrequency: "monthly", priority: 0.75 },
    { url: absoluteUrl(staticRoutes.weekendTrips), lastModified: staticFreshness, changeFrequency: "monthly", priority: 0.75 },
    { url: absoluteUrl(staticRoutes.nearbyWeekendPlaces), lastModified: staticFreshness, changeFrequency: "monthly", priority: 0.75 },
    { url: absoluteUrl(staticRoutes.regionalCollections), lastModified: staticFreshness, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl(staticRoutes.thematicCollections), lastModified: staticFreshness, changeFrequency: "monthly", priority: 0.8 },
  ]);

  // ---- country ----
  const countryItems = tag("country", getCountries().map((country) => ({
    url: absoluteUrl(countryRoute(country.slug)),
    lastModified: new Date(country.lastUpdated),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  })));

  // ---- cities ----
  const cityItems = tag("cities", cities.map((city) => ({
    url: absoluteUrl(cityRoute(city.slug)),
    lastModified: new Date(city.lastUpdated),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  })));

  // ---- Phase A–F (one route each per city) ----
  const phaseRoutes: Array<[(s: string) => string, number]> = [
    [costOfLivingRoute, 0.7],
    [climateRoute, 0.7],
    [economyRoute, 0.72],
    [educationRoute, 0.72],
    [healthcareRoute, 0.72],
  ];
  const phaseItems = tag(
    "phases",
    phaseRoutes.flatMap(([route, priority]) =>
      cities.map((city) => ({
        url: absoluteUrl(route(city.slug)),
        lastModified: new Date(city.lastUpdated),
        changeFrequency: "monthly" as const,
        priority,
      })),
    ),
  );

  // ---- module pages (safety / air-quality / energy / … per city) ----
  const moduleItems = tag(
    "modules",
    modules.flatMap((moduleItem) =>
      cities.map((city) => ({
        url: absoluteUrl(moduleRoute(moduleItem.slug, city.slug)),
        lastModified: new Date(city.modules[moduleItem.slug].lastUpdated),
        changeFrequency: "weekly" as const,
        priority: 0.82,
      })),
    ),
  );

  // ---- nearby weekend places (detail + per-city index) ----
  const nearbyItems = tag("nearby", [
    ...NEARBY_WEEKEND_PLACE_DETAIL_SLUGS.map((slug) => ({
      url: absoluteUrl(nearbyWeekendPlaceRoute(slug)),
      lastModified: staticFreshness,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...getAllCitiesWithNearbyWeekendPlaces().map((city) => ({
      url: absoluteUrl(nearbyWeekendPlacesCityRoute(city.slug)),
      lastModified: staticFreshness,
      changeFrequency: "monthly" as const,
      priority: 0.72,
    })),
  ]);

  // ---- weekend (weekend trips + summer travel) ----
  const weekendItems = tag("weekend", [
    ...getAllWeekendTripPages().map((page) => ({
      url: absoluteUrl(weekendTripRoute(page.citySlug)),
      lastModified: new Date(page.updatedDate),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...getAllSummerTravelPages().map((page) => ({
      url: absoluteUrl(summerTravelRoute(page.citySlug)),
      lastModified: new Date(page.updatedDate),
      changeFrequency: "monthly" as const,
      priority: 0.76,
    })),
  ]);

  // ---- visual city guides ----
  const visualItems = tag("visual", getAllVisualCityGuidePages().map((page) => ({
    url: absoluteUrl(visualCityGuideRoute(page.citySlug)),
    lastModified: new Date(page.updatedDate),
    changeFrequency: "monthly" as const,
    priority: 0.72,
  })));

  // ---- collections (curated + regional + thematic + city intents + comparisons + rankings) ----
  const collectionItems = tag("collections", [
    ...getRankings().map((ranking) => ({
      url: absoluteUrl(rankingRoute(ranking.slug)),
      lastModified: new Date(ranking.lastUpdated),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...getAllComparisons().map((comparison) => ({
      url: absoluteUrl(comparisonRoute(comparison.slug)),
      lastModified: new Date(comparison.updatedDate),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...getAllCollections().map((collection) => ({
      url: absoluteUrl(getCollectionUrl(collection.slug)),
      lastModified: new Date(collection.updatedDate),
      changeFrequency: "weekly" as const,
      priority: 0.88,
    })),
    ...getAllCityIntentPages().map((page) => ({
      url: absoluteUrl(getCityIntentUrl(page.citySlug, page.intentSlug)),
      lastModified: new Date(page.updatedDate),
      changeFrequency: "weekly" as const,
      priority: 0.83,
    })),
    ...getAllRegionalCollections().map((collection) => ({
      url: absoluteUrl(regionalCollectionRoute(collection.slug)),
      lastModified: staticFreshness,
      changeFrequency: "monthly" as const,
      priority: 0.74,
    })),
    ...getAllThematicCollections().map((collection) => ({
      url: absoluteUrl(thematicCollectionRoute(collection.slug)),
      lastModified: staticFreshness,
      changeFrequency: "monthly" as const,
      priority: 0.74,
    })),
  ]);

  // ---- relocation guides (arrival, neighborhood, moving-to) ----
  const guideItems = tag("guides", [
    ...getAllArrivalPages().map((page) => ({
      url: absoluteUrl(arrivalRoute(page.citySlug)),
      lastModified: new Date(page.updatedDate),
      changeFrequency: "monthly" as const,
      priority: 0.74,
    })),
    ...getAllNeighborhoodPlanningPages().map((page) => ({
      url: absoluteUrl(neighborhoodPlanningRoute(page.citySlug)),
      lastModified: new Date(page.updatedDate),
      changeFrequency: "monthly" as const,
      priority: 0.73,
    })),
    ...getAllMovingToCityPages().map((page) => ({
      url: absoluteUrl(movingToCityRoute(page.citySlug)),
      lastModified: new Date(page.updatedDate),
      changeFrequency: "monthly" as const,
      priority: 0.74,
    })),
  ]);

  return [
    ...staticItems,
    ...countryItems,
    ...cityItems,
    ...phaseItems,
    ...moduleItems,
    ...nearbyItems,
    ...weekendItems,
    ...visualItems,
    ...collectionItems,
    ...guideItems,
  ];
}
