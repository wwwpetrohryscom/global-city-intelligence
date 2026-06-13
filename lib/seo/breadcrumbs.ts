import {
  getCityBySlug,
  getCityIntentBySlug,
  getCollectionBySlug,
  getComparisonBySlug,
  getCountryBySlug,
  getModuleBySlug,
  getRankingBySlug,
  getRegionalCollectionBySlug,
} from "@/lib/data/queries";
import {
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
  regionalCollectionRoute,
  staticRoutes,
  summerTravelRoute,
  visualCityGuideRoute,
  weekendTripRoute,
} from "@/lib/seo/routes";
import type { BreadcrumbItem, ModuleSlug } from "@/types";

const homeCrumb: BreadcrumbItem = {
  name: "Home",
  href: staticRoutes.home,
};

export function cityBreadcrumbs(citySlug: string): BreadcrumbItem[] {
  const city = getCityBySlug(citySlug);

  return [
    homeCrumb,
    {
      name: "Cities",
      href: staticRoutes.cities,
    },
    {
      name: city?.name || "City",
      href: cityRoute(citySlug),
    },
  ];
}

export function countryBreadcrumbs(countrySlug: string): BreadcrumbItem[] {
  const country = getCountryBySlug(countrySlug);

  return [
    homeCrumb,
    {
      name: "Countries",
      href: staticRoutes.countries,
    },
    {
      name: country?.name || "Country",
      href: countryRoute(countrySlug),
    },
  ];
}

export function moduleBreadcrumbs(
  moduleSlug: ModuleSlug,
  citySlug: string,
): BreadcrumbItem[] {
  const city = getCityBySlug(citySlug);
  const moduleItem = getModuleBySlug(moduleSlug);

  return [
    homeCrumb,
    {
      name: city?.name || "City",
      href: cityRoute(citySlug),
    },
    {
      name: moduleItem?.name || "Module",
      href: moduleRoute(moduleSlug, citySlug),
    },
  ];
}

export function rankingBreadcrumbs(rankingSlug?: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    homeCrumb,
    {
      name: "Rankings",
      href: staticRoutes.rankings,
    },
  ];

  if (rankingSlug) {
    const ranking = getRankingBySlug(rankingSlug);
    crumbs.push({
      name: ranking?.shortTitle || "Ranking",
      href: rankingRoute(rankingSlug),
    });
  }

  return crumbs;
}

export function staticBreadcrumbs(
  label: string,
  href: string,
): BreadcrumbItem[] {
  return [homeCrumb, { name: label, href }];
}

export function toolsBreadcrumbs(
  label: string,
  href: string,
): BreadcrumbItem[] {
  return [
    homeCrumb,
    { name: "Tools", href: staticRoutes.tools },
    { name: label, href },
  ];
}

export function arrivalBreadcrumbs(citySlug: string): BreadcrumbItem[] {
  const city = getCityBySlug(citySlug);

  return [
    homeCrumb,
    {
      name: "Cities",
      href: staticRoutes.cities,
    },
    {
      name: city?.name || "City",
      href: cityRoute(citySlug),
    },
    {
      name: "Arrival planning",
      href: arrivalRoute(citySlug),
    },
  ];
}

export function neighborhoodPlanningBreadcrumbs(
  citySlug: string,
): BreadcrumbItem[] {
  const city = getCityBySlug(citySlug);

  return [
    homeCrumb,
    {
      name: "Cities",
      href: staticRoutes.cities,
    },
    {
      name: city?.name || "City",
      href: cityRoute(citySlug),
    },
    {
      name: "Neighborhood planning",
      href: neighborhoodPlanningRoute(citySlug),
    },
  ];
}

export function movingToCityBreadcrumbs(citySlug: string): BreadcrumbItem[] {
  const city = getCityBySlug(citySlug);

  return [
    homeCrumb,
    {
      name: "Cities",
      href: staticRoutes.cities,
    },
    {
      name: city?.name || "City",
      href: cityRoute(citySlug),
    },
    {
      name: "Moving to",
      href: movingToCityRoute(citySlug),
    },
  ];
}

export function visualCityGuideBreadcrumbs(citySlug: string): BreadcrumbItem[] {
  const city = getCityBySlug(citySlug);

  return [
    homeCrumb,
    {
      name: "Cities",
      href: staticRoutes.cities,
    },
    {
      name: city?.name || "City",
      href: cityRoute(citySlug),
    },
    {
      name: "Visual guide",
      href: visualCityGuideRoute(citySlug),
    },
  ];
}

export function summerTravelBreadcrumbs(citySlug: string): BreadcrumbItem[] {
  const city = getCityBySlug(citySlug);

  return [
    homeCrumb,
    {
      name: "Cities",
      href: staticRoutes.cities,
    },
    {
      name: city?.name || "City",
      href: cityRoute(citySlug),
    },
    {
      name: "Summer travel",
      href: summerTravelRoute(citySlug),
    },
  ];
}

export function weekendTripBreadcrumbs(citySlug: string): BreadcrumbItem[] {
  const city = getCityBySlug(citySlug);

  return [
    homeCrumb,
    {
      name: "Cities",
      href: staticRoutes.cities,
    },
    {
      name: city?.name || "City",
      href: cityRoute(citySlug),
    },
    {
      name: "Weekend trip",
      href: weekendTripRoute(citySlug),
    },
  ];
}

export function cityIntentBreadcrumbs(
  citySlug: string,
  intentSlug: string,
): BreadcrumbItem[] {
  const city = getCityBySlug(citySlug);
  const intent = getCityIntentBySlug(intentSlug);

  return [
    homeCrumb,
    {
      name: "Cities",
      href: staticRoutes.cities,
    },
    {
      name: city?.name || "City",
      href: cityRoute(citySlug),
    },
    {
      name: intent?.shortTitle || "Intent",
      href: getCityIntentUrl(citySlug, intentSlug),
    },
  ];
}

export function collectionBreadcrumbs(slug?: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    homeCrumb,
    {
      name: "Best Cities",
      href: staticRoutes.collections,
    },
  ];

  if (slug) {
    const collection = getCollectionBySlug(slug);
    crumbs.push({
      name: collection?.shortTitle || collection?.title || "Collection",
      href: getCollectionUrl(slug),
    });
  }

  return crumbs;
}

export function comparisonBreadcrumbs(slug: string): BreadcrumbItem[] {
  const comparison = getComparisonBySlug(slug);
  const cityA = comparison ? getCityBySlug(comparison.cityASlug) : undefined;
  const cityB = comparison ? getCityBySlug(comparison.cityBSlug) : undefined;
  const name =
    cityA && cityB ? `${cityA.name} vs ${cityB.name}` : "Comparison";

  return [
    homeCrumb,
    {
      name: "Compare",
      href: staticRoutes.compare,
    },
    {
      name,
      href: comparisonRoute(slug),
    },
  ];
}

export function regionalCollectionBreadcrumbs(slug?: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    homeCrumb,
    {
      name: "Regional collections",
      href: staticRoutes.regionalCollections,
    },
  ];

  if (slug) {
    const collection = getRegionalCollectionBySlug(slug);
    crumbs.push({
      name: collection?.title || "Collection",
      href: regionalCollectionRoute(slug),
    });
  }

  return crumbs;
}
