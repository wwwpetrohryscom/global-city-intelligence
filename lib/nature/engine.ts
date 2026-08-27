import { cities } from "@/lib/data/cities";
import { getCityCoordinate } from "@/lib/data/city-coordinates";
import { NATURE_CLASSIFICATION } from "@/lib/data/nature-classification";
import { isNearbyWeekendPlaceDetailSlug } from "@/lib/data/nearby-place-detail-pages";
import { nearbyWeekendPlaces } from "@/lib/data/nearby-places";
import { distanceBandFor, greatCircleKm } from "@/lib/nature/distance";
import {
  NATURE_HUB_MIN_CATEGORIES,
  NATURE_HUB_MIN_PLACES,
  NATURE_MAX_DISTANCE_KM,
  NATURE_PAGE_MIN_PLACES,
  NATURE_PUBLISHABLE_CONFIDENCE,
  NATURE_ROUTE_CATEGORIES,
  NATURE_ROUTE_ORDER,
} from "@/lib/nature/taxonomy";
import type {
  CityNatureCategory,
  CityNaturePlace,
  CityNatureProfile,
  NatureCategory,
  NatureRouteSegment,
} from "@/types";

/**
 * Nature discovery engine — server-only.
 *
 * Builds, once per build, the per-city nature profile every nature page reads
 * from. Nothing here is exported to the client: the corpus is 42 MB and must
 * never reach a browser bundle. Pages pass the small city-scoped subset they
 * actually render down to any client component.
 */

const PUBLISHABLE = new Set<string>(NATURE_PUBLISHABLE_CONFIDENCE);

const cityCountry: ReadonlyMap<string, string> = new Map(
  cities.map((city) => [city.slug, city.countrySlug]),
);

function buildProfiles(): ReadonlyMap<string, CityNatureProfile> {
  const byCity = new Map<string, CityNaturePlace[]>();
  // A feature curated for two nearby cities appears twice in the corpus under
  // different slugs; a city must never list the same feature twice.
  const seen = new Map<string, Set<string>>();

  for (const place of nearbyWeekendPlaces) {
    const classification = NATURE_CLASSIFICATION.get(place.slug);
    if (!classification?.primary) continue;
    if (!PUBLISHABLE.has(classification.confidence)) continue;
    if (place.latitude === undefined || place.longitude === undefined) continue;
    if (!Number.isFinite(place.latitude) || !Number.isFinite(place.longitude)) {
      continue;
    }

    for (const citySlug of place.connectedCitySlugs) {
      const origin = getCityCoordinate(citySlug);
      if (!origin) continue;

      const distanceKm = greatCircleKm(
        origin.latitude,
        origin.longitude,
        place.latitude,
        place.longitude,
      );
      if (!Number.isFinite(distanceKm) || distanceKm > NATURE_MAX_DISTANCE_KM) {
        continue;
      }

      const identity = place.wikidataId ?? place.slug;
      const already = seen.get(citySlug);
      if (already?.has(identity)) continue;
      if (already) {
        already.add(identity);
      } else {
        seen.set(citySlug, new Set([identity]));
      }

      // Band from the ROUNDED distance, not the raw one, so a card can never
      // read "120 km - weekend distance" while its neighbour at the same
      // printed number reads "day-trip".
      const published = Math.round(distanceKm * 10) / 10;

      const entry: CityNaturePlace = {
        placeSlug: place.slug,
        name: place.name,
        countrySlug: place.countrySlug,
        distanceKm: published,
        band: distanceBandFor(published),
        categories: classification.categories,
        primary: classification.primary,
        confidence: classification.confidence,
        typeLabel: classification.typeLabel,
        summary: place.summary,
        crossBorder: cityCountry.get(citySlug) !== place.countrySlug,
        hasDetailPage: isNearbyWeekendPlaceDetailSlug(place.slug),
        image: place.image
          ? {
              src: place.image.src,
              width: place.image.width,
              height: place.image.height,
              alt: place.image.alt,
              sourceUrl: place.image.sourceUrl,
              author: place.image.author,
              license: place.image.license,
              licenseUrl: place.image.licenseUrl,
              attributionText: place.image.attributionText,
            }
          : undefined,
      };

      const list = byCity.get(citySlug);
      if (list) list.push(entry);
      else byCity.set(citySlug, [entry]);
    }
  }

  const profiles = new Map<string, CityNatureProfile>();
  for (const [citySlug, places] of byCity) {
    // Deterministic order: nearest first, then name — never popularity.
    places.sort(
      (a, b) => a.distanceKm - b.distanceKm || a.name.localeCompare(b.name),
    );

    const counts = new Map<NatureCategory, number>();
    for (const place of places) {
      for (const category of place.categories) {
        counts.set(category, (counts.get(category) ?? 0) + 1);
      }
    }

    const categories: CityNatureCategory[] = Array.from(counts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));

    const own = cityCountry.get(citySlug);
    const countrySlugs = Array.from(new Set(places.map((p) => p.countrySlug))).sort(
      (a, b) => {
        if (a === own) return -1;
        if (b === own) return 1;
        return a.localeCompare(b);
      },
    );

    profiles.set(citySlug, {
      citySlug,
      places,
      categories,
      countrySlugs,
      crossBorderCount: places.filter((p) => p.crossBorder).length,
      hubEligible:
        places.length >= NATURE_HUB_MIN_PLACES &&
        categories.length >= NATURE_HUB_MIN_CATEGORIES,
    });
  }
  return profiles;
}

const PROFILES = buildProfiles();

export function getCityNatureProfile(
  citySlug: string,
): CityNatureProfile | undefined {
  return PROFILES.get(citySlug);
}

/** Places for one dedicated route segment, nearest first. */
export function getNaturePlacesForRoute(
  citySlug: string,
  segment: NatureRouteSegment,
): readonly CityNaturePlace[] {
  const profile = PROFILES.get(citySlug);
  if (!profile) return [];
  const wanted = NATURE_ROUTE_CATEGORIES[segment];
  return profile.places.filter((place) =>
    place.categories.some((category) => wanted.includes(category)),
  );
}

export function hasNatureHubPage(citySlug: string): boolean {
  return PROFILES.get(citySlug)?.hubEligible === true;
}

/**
 * A dedicated category page stands on its own evidence. It is deliberately NOT
 * gated behind the hub: Cusco has seven classified mountains and nothing else,
 * so it earns `/mountains` while `/nature` — whose entire job is grouping —
 * has nothing to group and is correctly withheld.
 */
export function hasNatureRoutePage(
  citySlug: string,
  segment: NatureRouteSegment,
): boolean {
  return (
    getNaturePlacesForRoute(citySlug, segment).length >= NATURE_PAGE_MIN_PLACES
  );
}

/** Route segments this city publishes a dedicated page for, in stable order. */
export function getNatureRoutesForCity(
  citySlug: string,
): readonly NatureRouteSegment[] {
  return NATURE_ROUTE_ORDER.filter((segment) =>
    hasNatureRoutePage(citySlug, segment),
  );
}

export function getAllCitiesWithNatureHub(): readonly string[] {
  return Array.from(PROFILES.keys())
    .filter((slug) => PROFILES.get(slug)?.hubEligible)
    .sort();
}

export function getAllCitiesWithNatureRoute(
  segment: NatureRouteSegment,
): readonly string[] {
  return Array.from(PROFILES.keys())
    .filter((slug) => hasNatureRoutePage(slug, segment))
    .sort();
}

/** Every published nature route, for sitemap + validator parity. */
export function getAllNatureRoutePairs(): readonly {
  citySlug: string;
  segment: NatureRouteSegment;
}[] {
  const out: { citySlug: string; segment: NatureRouteSegment }[] = [];
  for (const citySlug of Array.from(PROFILES.keys()).sort()) {
    for (const segment of NATURE_ROUTE_ORDER) {
      if (hasNatureRoutePage(citySlug, segment)) out.push({ citySlug, segment });
    }
  }
  return out;
}
