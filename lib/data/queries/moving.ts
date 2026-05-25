import { cities } from "@/lib/data/cities";
import {
  getMovingChecklist as getChecklistImpl,
  movingToCityPages,
} from "@/lib/data/moving";
import type { MovingChecklistItem, MovingToCityPage } from "@/types";

const movingIndex: ReadonlyMap<string, MovingToCityPage> = (() => {
  const map = new Map<string, MovingToCityPage>();
  for (const page of movingToCityPages) {
    if (!map.has(page.citySlug)) {
      map.set(page.citySlug, page);
    }
  }
  return map;
})();

export function getAllMovingToCityPages(): MovingToCityPage[] {
  return movingToCityPages;
}

export function getMovingToCityPageByCitySlug(
  citySlug: string,
): MovingToCityPage | undefined {
  return movingIndex.get(citySlug);
}

export function hasMovingToCityPage(citySlug: string): boolean {
  return movingIndex.has(citySlug);
}

export function getMovingToCityPagesForCountry(
  countrySlug: string,
): MovingToCityPage[] {
  const citySlugs = new Set(
    cities
      .filter((city) => city.countrySlug === countrySlug)
      .map((city) => city.slug),
  );
  return movingToCityPages.filter((page) => citySlugs.has(page.citySlug));
}

export function getMovingToCityChecklist(): readonly MovingChecklistItem[] {
  return getChecklistImpl();
}
