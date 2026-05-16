import { cityComparisons } from "@/lib/data/comparisons";
import type { CityComparison } from "@/types";

export function getAllComparisons(): CityComparison[] {
  return cityComparisons;
}

export function getComparisonBySlug(slug: string): CityComparison | undefined {
  return cityComparisons.find((comparison) => comparison.slug === slug);
}

export function getComparisonsForCity(citySlug: string): CityComparison[] {
  return cityComparisons.filter(
    (comparison) =>
      comparison.cityASlug === citySlug || comparison.cityBSlug === citySlug,
  );
}

export function getRelatedComparisons(slug: string, limit = 4): CityComparison[] {
  const current = getComparisonBySlug(slug);
  if (!current) {
    return [];
  }

  const scored = cityComparisons
    .filter((comparison) => comparison.slug !== slug)
    .map((comparison) => {
      let score = 0;
      if (
        comparison.cityASlug === current.cityASlug ||
        comparison.cityBSlug === current.cityASlug ||
        comparison.cityASlug === current.cityBSlug ||
        comparison.cityBSlug === current.cityBSlug
      ) {
        score += 3;
      }
      if (comparison.comparisonIntent === current.comparisonIntent) {
        score += 2;
      }
      if (comparison.region === current.region) {
        score += 1;
      }
      return { comparison, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.comparison);
}
