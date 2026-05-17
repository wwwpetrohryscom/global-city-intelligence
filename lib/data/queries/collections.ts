import { cityCollections } from "@/lib/data/collections";
import { cities } from "@/lib/data/cities";
import type { City, CityCollection } from "@/types";

export function getAllCollections(): CityCollection[] {
  return cityCollections;
}

export function getCollectionBySlug(slug: string): CityCollection | undefined {
  return cityCollections.find((collection) => collection.slug === slug);
}

export function getCitiesForCollection(slug: string): City[] {
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return [];
  }

  const seen = new Set<string>();

  return collection.citySlugs
    .map((citySlug) => {
      if (seen.has(citySlug)) {
        return undefined;
      }

      seen.add(citySlug);

      return cities.find((city) => city.slug === citySlug);
    })
    .filter((city): city is City => Boolean(city));
}

export function getRelatedCollections(
  slug: string,
  limit = 3,
): CityCollection[] {
  const current = getCollectionBySlug(slug);

  if (!current) {
    return [];
  }

  const explicit = (current.relatedCollectionSlugs ?? [])
    .map((relatedSlug) => getCollectionBySlug(relatedSlug))
    .filter((collection): collection is CityCollection => Boolean(collection));

  if (explicit.length >= limit) {
    return explicit.slice(0, limit);
  }

  const explicitSlugs = new Set(explicit.map((collection) => collection.slug));
  const fallback = cityCollections.filter(
    (collection) =>
      collection.slug !== slug && !explicitSlugs.has(collection.slug),
  );

  return [...explicit, ...fallback].slice(0, limit);
}

export function getCollectionsForCity(citySlug: string): CityCollection[] {
  return cityCollections.filter((collection) =>
    collection.citySlugs.includes(citySlug),
  );
}
