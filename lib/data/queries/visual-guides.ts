import { cities } from "@/lib/data/cities";
import {
  getVisualGuideSections as getSectionsImpl,
  visualCityGuidePages,
} from "@/lib/data/visual-guides";
import type { VisualCityGuidePage, VisualGuideSection } from "@/types";

const visualIndex: ReadonlyMap<string, VisualCityGuidePage> = (() => {
  const map = new Map<string, VisualCityGuidePage>();
  for (const page of visualCityGuidePages) {
    if (!map.has(page.citySlug)) {
      map.set(page.citySlug, page);
    }
  }
  return map;
})();

export function getAllVisualCityGuidePages(): VisualCityGuidePage[] {
  return visualCityGuidePages;
}

export function getVisualCityGuidePageByCitySlug(
  citySlug: string,
): VisualCityGuidePage | undefined {
  return visualIndex.get(citySlug);
}

export function hasVisualCityGuidePage(citySlug: string): boolean {
  return visualIndex.has(citySlug);
}

export function getVisualCityGuidePagesForCountry(
  countrySlug: string,
): VisualCityGuidePage[] {
  const citySlugs = new Set(
    cities
      .filter((city) => city.countrySlug === countrySlug)
      .map((city) => city.slug),
  );
  return visualCityGuidePages.filter((page) => citySlugs.has(page.citySlug));
}

export function getVisualGuideSections(): readonly VisualGuideSection[] {
  return getSectionsImpl();
}
