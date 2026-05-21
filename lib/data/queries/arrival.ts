import { arrivalChecklist, arrivalPages } from "@/lib/data/arrival";
import { cities } from "@/lib/data/cities";
import type { ArrivalChecklistItem, ArrivalPage } from "@/types";

const arrivalIndex: ReadonlyMap<string, ArrivalPage> = (() => {
  const map = new Map<string, ArrivalPage>();
  for (const page of arrivalPages) {
    if (!map.has(page.citySlug)) {
      map.set(page.citySlug, page);
    }
  }
  return map;
})();

export function getAllArrivalPages(): ArrivalPage[] {
  return arrivalPages;
}

export function getArrivalPageByCitySlug(
  citySlug: string,
): ArrivalPage | undefined {
  return arrivalIndex.get(citySlug);
}

export function hasArrivalPage(citySlug: string): boolean {
  return arrivalIndex.has(citySlug);
}

export function getArrivalPagesForCountry(countrySlug: string): ArrivalPage[] {
  const citySlugs = new Set(
    cities
      .filter((city) => city.countrySlug === countrySlug)
      .map((city) => city.slug),
  );
  return arrivalPages.filter((page) => citySlugs.has(page.citySlug));
}

export function getArrivalChecklist(): ArrivalChecklistItem[] {
  return arrivalChecklist;
}
