import { cityRoute, countryRoute, moduleRoute, rankingRoute, staticRoutes } from "@/lib/seo/routes";
import type { City, Country, IntelligenceModule, Ranking } from "@/types";

export interface InternalLink {
  text: string;
  href: string;
}

export const internalLink = {
  cityProfile(city: Pick<City, "slug" | "name">): InternalLink {
    return { text: `Open the ${city.name} city profile`, href: cityRoute(city.slug) };
  },
  countryProfile(country: Pick<Country, "slug" | "name">): InternalLink {
    return { text: `Explore ${country.name} city profiles`, href: countryRoute(country.slug) };
  },
  moduleInCity(
    moduleItem: Pick<IntelligenceModule, "slug" | "name">,
    city: Pick<City, "slug" | "name">,
  ): InternalLink {
    return {
      text: `View ${moduleItem.name.toLowerCase()} indicators for ${city.name}`,
      href: moduleRoute(moduleItem.slug, city.slug),
    };
  },
  costOfLivingInCity(city: Pick<City, "slug" | "name">): InternalLink {
    return {
      text: `Compare cost of living in ${city.name}`,
      href: moduleRoute("cost-of-living", city.slug),
    };
  },
  airQualityInCity(city: Pick<City, "slug" | "name">): InternalLink {
    return {
      text: `View air quality indicators for ${city.name}`,
      href: moduleRoute("air-quality", city.slug),
    };
  },
  cityInRankings(city: Pick<City, "name">): InternalLink {
    return {
      text: `See where ${city.name} appears in global rankings`,
      href: staticRoutes.rankings,
    };
  },
  ranking(ranking: Pick<Ranking, "slug" | "shortTitle">): InternalLink {
    return {
      text: `Open the ${ranking.shortTitle} ranking`,
      href: rankingRoute(ranking.slug),
    };
  },
  methodology(): InternalLink {
    return { text: "Read the scoring methodology", href: staticRoutes.methodology };
  },
  dataSources(): InternalLink {
    return { text: "Browse all data sources", href: staticRoutes.dataSources };
  },
};
