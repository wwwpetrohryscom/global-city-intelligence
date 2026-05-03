import { cities } from "@/lib/data/cities";
import { countries } from "@/lib/data/countries";
import { intelligenceModules } from "@/lib/data/modules";
import { rankings } from "@/lib/data/rankings";
import type { ModuleSlug } from "@/types";

export function getCities() {
  return cities;
}

export function getCityBySlug(slug: string) {
  return cities.find((city) => city.slug === slug);
}

export function getCountries() {
  return countries;
}

export function getCountryBySlug(slug: string) {
  return countries.find((country) => country.slug === slug);
}

export function getCitiesByCountrySlug(countrySlug: string) {
  return cities.filter((city) => city.countrySlug === countrySlug);
}

export function getModules() {
  return intelligenceModules;
}

export function getModuleBySlug(slug: string) {
  return intelligenceModules.find((moduleItem) => moduleItem.slug === slug);
}

export function getCityModule(citySlug: string, moduleSlug: ModuleSlug) {
  const city = getCityBySlug(citySlug);

  if (!city) {
    return undefined;
  }

  return city.modules[moduleSlug];
}

export function getRankings() {
  return rankings;
}

export function getRankingBySlug(slug: string) {
  return rankings.find((ranking) => ranking.slug === slug);
}

export function getRankingEntriesWithCities(slug: string) {
  const ranking = getRankingBySlug(slug);

  if (!ranking) {
    return [];
  }

  return ranking.entries
    .map((entry) => {
      const city = getCityBySlug(entry.citySlug);
      return city ? { ...entry, city } : undefined;
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
}
