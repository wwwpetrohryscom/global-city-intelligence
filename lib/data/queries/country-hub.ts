import { cities } from "@/lib/data/cities";
import { cityCollections } from "@/lib/data/collections";
import { cityComparisons } from "@/lib/data/comparisons";
import { rankings } from "@/lib/data/rankings";
import type { CityCollection, CityComparison, Ranking } from "@/types";

export function getComparisonsForCountry(
  countrySlug: string,
): CityComparison[] {
  const citySlugs = new Set(
    cities
      .filter((city) => city.countrySlug === countrySlug)
      .map((city) => city.slug),
  );

  if (citySlugs.size === 0) {
    return [];
  }

  return cityComparisons.filter(
    (comparison) =>
      citySlugs.has(comparison.cityASlug) ||
      citySlugs.has(comparison.cityBSlug),
  );
}

export interface CountryCollectionMatch {
  collection: CityCollection;
  matchingCitySlugs: string[];
}

export function getCollectionsForCountry(
  countrySlug: string,
): CountryCollectionMatch[] {
  const citiesInCountry = cities
    .filter((city) => city.countrySlug === countrySlug)
    .map((city) => city.slug);

  if (citiesInCountry.length === 0) {
    return [];
  }

  const matches: CountryCollectionMatch[] = [];

  for (const collection of cityCollections) {
    const matchingCitySlugs = collection.citySlugs.filter((slug) =>
      citiesInCountry.includes(slug),
    );

    if (matchingCitySlugs.length > 0) {
      matches.push({ collection, matchingCitySlugs });
    }
  }

  return matches;
}

export interface CountryRankingMatch {
  ranking: Ranking;
  matchingCitySlugs: string[];
}

export function getRankingsForCountry(
  countrySlug: string,
): CountryRankingMatch[] {
  const citiesInCountry = cities
    .filter((city) => city.countrySlug === countrySlug)
    .map((city) => city.slug);

  if (citiesInCountry.length === 0) {
    return [];
  }

  const matches: CountryRankingMatch[] = [];

  for (const ranking of rankings) {
    const matchingCitySlugs = ranking.entries
      .map((entry) => entry.citySlug)
      .filter((slug) => citiesInCountry.includes(slug));

    if (matchingCitySlugs.length > 0) {
      matches.push({ ranking, matchingCitySlugs });
    }
  }

  return matches;
}
