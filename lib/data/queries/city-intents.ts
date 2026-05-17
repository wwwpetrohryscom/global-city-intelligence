import { cityIntentPages, cityIntents } from "@/lib/data/city-intents";
import type { CityIntent, CityIntentPage, CityIntentSlug } from "@/types";

export function getAllCityIntents(): CityIntent[] {
  return cityIntents;
}

export function getCityIntentBySlug(
  intentSlug: string,
): CityIntent | undefined {
  return cityIntents.find((entry) => entry.slug === intentSlug);
}

export function getAllCityIntentPages(): CityIntentPage[] {
  return cityIntentPages;
}

export function getCityIntentPage(
  citySlug: string,
  intentSlug: string,
): CityIntentPage | undefined {
  return cityIntentPages.find(
    (page) => page.citySlug === citySlug && page.intentSlug === intentSlug,
  );
}

export function getIntentPagesForCity(citySlug: string): CityIntentPage[] {
  return cityIntentPages.filter((page) => page.citySlug === citySlug);
}

export function getIntentPagesForIntent(
  intentSlug: CityIntentSlug,
): CityIntentPage[] {
  return cityIntentPages.filter((page) => page.intentSlug === intentSlug);
}

export function getIntentPagesForCollection(
  collectionSlug: string,
): CityIntentPage[] {
  return cityIntentPages.filter((page) =>
    page.relatedCollectionSlugs?.includes(collectionSlug),
  );
}
