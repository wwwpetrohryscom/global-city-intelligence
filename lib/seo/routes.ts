import { getCities, getCountries, getModules, getRankings } from "@/lib/data/queries";
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

export function countryRoute(countrySlug: string) {
  return `/countries/${countrySlug}`;
}

export function moduleRoute(moduleSlug: ModuleSlug, citySlug: string) {
  return `/${moduleSlug}/${citySlug}`;
}

export function rankingRoute(rankingSlug: string) {
  return `/rankings/${rankingSlug}`;
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
    ...cities.map((city) => cityRoute(city.slug)),
    ...getCountries().map((country) => countryRoute(country.slug)),
    ...modules.flatMap((moduleItem) =>
      cities.map((city) => moduleRoute(moduleItem.slug, city.slug)),
    ),
    ...getRankings().map((ranking) => rankingRoute(ranking.slug)),
  ];
}
