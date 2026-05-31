import { cities } from "@/lib/data/cities";
import { nearbyWeekendPlaces } from "@/lib/data/nearby-places";
import {
  NEARBY_WEEKEND_PLACE_DETAIL_SLUGS,
  isNearbyWeekendPlaceDetailSlug,
} from "@/lib/data/nearby-place-detail-pages";
import type {
  City,
  NearbyPlaceCategory,
  NearbyWeekendPlace,
} from "@/types";

function getCityBySlug(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}

const bySlug: ReadonlyMap<string, NearbyWeekendPlace> = (() => {
  const map = new Map<string, NearbyWeekendPlace>();
  for (const place of nearbyWeekendPlaces) {
    if (!map.has(place.slug)) {
      map.set(place.slug, place);
    }
  }
  return map;
})();

const byCity: ReadonlyMap<string, readonly NearbyWeekendPlace[]> = (() => {
  const map = new Map<string, NearbyWeekendPlace[]>();
  for (const place of nearbyWeekendPlaces) {
    for (const citySlug of place.connectedCitySlugs) {
      const list = map.get(citySlug);
      if (list) {
        list.push(place);
      } else {
        map.set(citySlug, [place]);
      }
    }
  }
  return map;
})();

const byCountry: ReadonlyMap<string, readonly NearbyWeekendPlace[]> = (() => {
  const map = new Map<string, NearbyWeekendPlace[]>();
  for (const place of nearbyWeekendPlaces) {
    const list = map.get(place.countrySlug);
    if (list) {
      list.push(place);
    } else {
      map.set(place.countrySlug, [place]);
    }
  }
  return map;
})();

export function getAllNearbyWeekendPlaces(): NearbyWeekendPlace[] {
  return nearbyWeekendPlaces;
}

export function getNearbyWeekendPlaceBySlug(
  slug: string,
): NearbyWeekendPlace | undefined {
  return bySlug.get(slug);
}

export function getNearbyWeekendPlacesForCity(
  citySlug: string,
): readonly NearbyWeekendPlace[] {
  return byCity.get(citySlug) ?? [];
}

export function getNearbyWeekendPlacesForCountry(
  countrySlug: string,
): readonly NearbyWeekendPlace[] {
  return byCountry.get(countrySlug) ?? [];
}

export function getNearbyWeekendPlacesByCategory(
  category: NearbyPlaceCategory,
): NearbyWeekendPlace[] {
  return nearbyWeekendPlaces.filter((place) => place.category === category);
}

export function hasNearbyWeekendPlacesForCity(citySlug: string): boolean {
  return byCity.has(citySlug);
}

export function getNearbyWeekendPlacesForWeekendTrip(
  citySlug: string,
  limit = 6,
): readonly NearbyWeekendPlace[] {
  const list = getNearbyWeekendPlacesForCity(citySlug);
  if (limit <= 0 || list.length <= limit) {
    return list;
  }
  return list.slice(0, limit);
}

export function getAllNearbyWeekendPlaceDetailPages(): NearbyWeekendPlace[] {
  return NEARBY_WEEKEND_PLACE_DETAIL_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (place): place is NearbyWeekendPlace => Boolean(place),
  );
}

export function getNearbyWeekendPlaceDetailPageBySlug(
  slug: string,
): NearbyWeekendPlace | undefined {
  if (!isNearbyWeekendPlaceDetailSlug(slug)) return undefined;
  return bySlug.get(slug);
}

export function hasNearbyWeekendPlaceDetailPage(slug: string): boolean {
  return isNearbyWeekendPlaceDetailSlug(slug) && bySlug.has(slug);
}

// IIFE-built ReadonlyMap of citySlug -> the resolved City object (for cities that have at least one nearby place).
// This list is the eligibility allow-list for /cities/[city]/nearby-weekend-places.
const citiesWithNearbyPlaces: ReadonlyMap<string, City> = (() => {
  const m = new Map<string, City>();
  for (const place of nearbyWeekendPlaces) {
    for (const slug of place.connectedCitySlugs) {
      if (m.has(slug)) continue;
      const city = getCityBySlug(slug);
      if (city) m.set(slug, city);
    }
  }
  return m;
})();

export function getAllCitiesWithNearbyWeekendPlaces(): readonly City[] {
  return Array.from(citiesWithNearbyPlaces.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getNearbyWeekendPlaceCityPageBySlug(citySlug: string): City | undefined {
  return citiesWithNearbyPlaces.get(citySlug);
}

export function hasNearbyWeekendPlacesCityPage(citySlug: string): boolean {
  return citiesWithNearbyPlaces.has(citySlug);
}
