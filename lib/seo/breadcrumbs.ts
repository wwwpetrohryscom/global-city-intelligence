import {
  getCityBySlug,
  getComparisonBySlug,
  getCountryBySlug,
  getModuleBySlug,
  getRankingBySlug,
} from "@/lib/data/queries";
import {
  cityRoute,
  comparisonRoute,
  countryRoute,
  moduleRoute,
  rankingRoute,
  staticRoutes,
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
