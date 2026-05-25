import { cities } from "@/lib/data/cities";
import {
  getNeighborhoodPlanningChecklist as getChecklistImpl,
  neighborhoodPlanningPages,
} from "@/lib/data/neighborhoods";
import type {
  NeighborhoodChecklistItem,
  NeighborhoodPlanningPage,
} from "@/types";

const planningIndex: ReadonlyMap<string, NeighborhoodPlanningPage> = (() => {
  const map = new Map<string, NeighborhoodPlanningPage>();
  for (const page of neighborhoodPlanningPages) {
    if (!map.has(page.citySlug)) {
      map.set(page.citySlug, page);
    }
  }
  return map;
})();

export function getAllNeighborhoodPlanningPages(): NeighborhoodPlanningPage[] {
  return neighborhoodPlanningPages;
}

export function getNeighborhoodPlanningPageByCitySlug(
  citySlug: string,
): NeighborhoodPlanningPage | undefined {
  return planningIndex.get(citySlug);
}

export function hasNeighborhoodPlanningPage(citySlug: string): boolean {
  return planningIndex.has(citySlug);
}

export function getNeighborhoodPlanningPagesForCountry(
  countrySlug: string,
): NeighborhoodPlanningPage[] {
  const citySlugs = new Set(
    cities
      .filter((city) => city.countrySlug === countrySlug)
      .map((city) => city.slug),
  );
  return neighborhoodPlanningPages.filter((page) =>
    citySlugs.has(page.citySlug),
  );
}

export function getNeighborhoodPlanningChecklist(): readonly NeighborhoodChecklistItem[] {
  return getChecklistImpl();
}
