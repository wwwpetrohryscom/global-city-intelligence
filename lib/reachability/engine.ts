import { cities } from "@/lib/data/cities";
import { getRelatedCities } from "@/lib/data/city-discovery-graph";
import { isRetiredCitySlug } from "@/lib/data/city-aliases";
import { isNearbyWeekendPlaceDetailSlug } from "@/lib/data/nearby-place-detail-pages";
import { getCityNatureProfile } from "@/lib/nature/engine";
import {
  REACHABILITY_MAX_KM,
  reachabilityBandFor,
  type ReachabilityBand,
} from "@/lib/reachability/bands";
import {
  cityRoute,
  nearbyWeekendPlaceRoute,
  staticRoutes,
} from "@/lib/seo/routes";
import type { CityReachability, ReachabilityDestination } from "@/lib/reachability/types";

/**
 * Reachability engine — server-only.
 *
 * Composes two things the repository already has rather than building a third:
 * the published city discovery graph (42,741 inter-city edges, each carrying a
 * great-circle distance recomputed from `lib/data/city-coordinates.ts`) and the
 * nature layer's per-city place profiles. No new dataset is generated, so this
 * adds nothing to the corpus, the build's memory budget, or the artifact beyond
 * the markup it renders.
 *
 * Everything here is distance. The repository has no routing or timetable data,
 * so no output of this module may be rendered as a journey time.
 */

const MAX_PER_CATEGORY = 2;   // no page should be six lakes
const MAX_PER_KIND_PER_BAND = 4;

const cityBySlug = new Map(cities.map((city) => [city.slug, city]));

function cityDestination(
  fromCountry: string,
  slug: string,
  distanceKm: number,
  relationship: string,
): ReachabilityDestination | null {
  const city = cityBySlug.get(slug);
  if (!city) return null;
  return {
    kind: "city",
    slug,
    name: city.name,
    distanceKm: Math.round(distanceKm * 10) / 10,
    band: reachabilityBandFor(distanceKm),
    countrySlug: city.countrySlug,
    countryName: city.countryName,
    crossBorder: city.countrySlug !== fromCountry,
    href: cityRoute(slug),
    relationship,
  };
}

function buildFor(citySlug: string): CityReachability | undefined {
  const source = cityBySlug.get(citySlug);
  if (!source) return undefined;

  const seen = new Set<string>();
  const out: ReachabilityDestination[] = [];

  // ---- urban destinations, straight from the published graph ---------------
  for (const related of getRelatedCities(citySlug)) {
    if (related.citySlug === citySlug) continue;          // never self-link
    if (isRetiredCitySlug(related.citySlug)) continue;    // never a merged slug
    if (related.distanceKm > REACHABILITY_MAX_KM) continue;
    const destination = cityDestination(
      source.countrySlug,
      related.citySlug,
      related.distanceKm,
      related.relationshipType,
    );
    if (!destination || seen.has(`city:${destination.slug}`)) continue;
    seen.add(`city:${destination.slug}`);
    out.push(destination);
  }

  // ---- nature destinations, from the classified profile --------------------
  const profile = getCityNatureProfile(citySlug);
  for (const place of profile?.places ?? []) {
    if (place.distanceKm > REACHABILITY_MAX_KM) continue;
    if (seen.has(`nature:${place.placeSlug}`)) continue;
    seen.add(`nature:${place.placeSlug}`);
    const country = cityBySlug.get(citySlug)?.countrySlug;
    out.push({
      kind: "nature",
      slug: place.placeSlug,
      name: place.name,
      distanceKm: place.distanceKm,
      band: reachabilityBandFor(place.distanceKm),
      countrySlug: place.countrySlug,
      countryName:
        cities.find((c) => c.countrySlug === place.countrySlug)?.countryName ??
        place.countrySlug,
      crossBorder: place.countrySlug !== country,
      href: isNearbyWeekendPlaceDetailSlug(place.placeSlug)
        ? nearbyWeekendPlaceRoute(place.placeSlug)
        : `${staticRoutes.nearbyWeekendPlaces}#${place.placeSlug}`,
      category: place.primary,
      typeLabel: place.typeLabel,
    });
  }

  // Deterministic: nearest first, then name. Never popularity.
  out.sort((a, b) => a.distanceKm - b.distanceKm || a.name.localeCompare(b.name));

  const byBand = { nearby: [], "day-trip": [], weekend: [] } as Record<
    ReachabilityBand,
    ReachabilityDestination[]
  >;
  for (const destination of out) byBand[destination.band].push(destination);

  return {
    citySlug,
    destinations: out,
    byBand,
    cities: out.filter((d) => d.kind === "city"),
    nature: out.filter((d) => d.kind === "nature"),
    crossBorder: out.filter((d) => d.crossBorder),
    crossBorderCountries: Array.from(
      new Set(out.filter((d) => d.crossBorder).map((d) => d.countryName)),
    ).sort(),
  };
}

const CACHE = new Map<string, CityReachability | undefined>();

export function getCityReachability(citySlug: string): CityReachability | undefined {
  if (!CACHE.has(citySlug)) CACHE.set(citySlug, buildFor(citySlug));
  return CACHE.get(citySlug);
}

/**
 * A short, varied selection for one band.
 *
 * Diversity is applied as a cap, never by promoting a weaker candidate: at most
 * two nature destinations of one category and at most four of either kind, so a
 * band cannot render as six lakes, but a city that genuinely only has lakes
 * still shows the lakes it has.
 */
export function selectForBand(
  reach: CityReachability,
  band: ReachabilityBand,
  limit: number,
): readonly ReachabilityDestination[] {
  const perCategory = new Map<string, number>();
  const perKind = new Map<string, number>();
  const picked: ReachabilityDestination[] = [];
  for (const destination of reach.byBand[band]) {
    if (picked.length >= limit) break;
    const kindCount = perKind.get(destination.kind) ?? 0;
    if (kindCount >= MAX_PER_KIND_PER_BAND) continue;
    if (destination.category) {
      const n = perCategory.get(destination.category) ?? 0;
      if (n >= MAX_PER_CATEGORY) continue;
      perCategory.set(destination.category, n + 1);
    }
    perKind.set(destination.kind, kindCount + 1);
    picked.push(destination);
  }
  return picked;
}

export function hasReachability(citySlug: string): boolean {
  return (getCityReachability(citySlug)?.destinations.length ?? 0) > 0;
}
