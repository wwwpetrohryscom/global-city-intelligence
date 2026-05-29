import { cities } from "@/lib/data/cities";
import {
  getSummerTravelChecklist as getChecklistImpl,
  summerTravelPages,
} from "@/lib/data/summer-travel";
import type {
  SummerTravelChecklistItem,
  SummerTravelCityPage,
} from "@/types";

const summerIndex: ReadonlyMap<string, SummerTravelCityPage> = (() => {
  const map = new Map<string, SummerTravelCityPage>();
  for (const page of summerTravelPages) {
    if (!map.has(page.citySlug)) {
      map.set(page.citySlug, page);
    }
  }
  return map;
})();

export function getAllSummerTravelPages(): SummerTravelCityPage[] {
  return summerTravelPages;
}

export function getSummerTravelPageByCitySlug(
  citySlug: string,
): SummerTravelCityPage | undefined {
  return summerIndex.get(citySlug);
}

export function hasSummerTravelPage(citySlug: string): boolean {
  return summerIndex.has(citySlug);
}

export function getSummerTravelPagesForCountry(
  countrySlug: string,
): SummerTravelCityPage[] {
  const citySlugs = new Set(
    cities
      .filter((city) => city.countrySlug === countrySlug)
      .map((city) => city.slug),
  );
  return summerTravelPages.filter((page) => citySlugs.has(page.citySlug));
}

export function getSummerTravelChecklist(): readonly SummerTravelChecklistItem[] {
  return getChecklistImpl();
}
