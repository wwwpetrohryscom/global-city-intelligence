import { cities } from "@/lib/data/cities";
import {
  getWeekendTripChecklist as getChecklistImpl,
  weekendTripPages,
} from "@/lib/data/weekend-trip";
import type {
  WeekendTripChecklistItem,
  WeekendTripCityPage,
} from "@/types";

const weekendIndex: ReadonlyMap<string, WeekendTripCityPage> = (() => {
  const map = new Map<string, WeekendTripCityPage>();
  for (const page of weekendTripPages) {
    if (!map.has(page.citySlug)) {
      map.set(page.citySlug, page);
    }
  }
  return map;
})();

export function getAllWeekendTripPages(): WeekendTripCityPage[] {
  return weekendTripPages;
}

export function getWeekendTripPageByCitySlug(
  citySlug: string,
): WeekendTripCityPage | undefined {
  return weekendIndex.get(citySlug);
}

export function hasWeekendTripPage(citySlug: string): boolean {
  return weekendIndex.has(citySlug);
}

export function getWeekendTripPagesForCountry(
  countrySlug: string,
): WeekendTripCityPage[] {
  const citySlugs = new Set(
    cities
      .filter((city) => city.countrySlug === countrySlug)
      .map((city) => city.slug),
  );
  return weekendTripPages.filter((page) => citySlugs.has(page.citySlug));
}

export function getWeekendTripChecklist(): readonly WeekendTripChecklistItem[] {
  return getChecklistImpl();
}
