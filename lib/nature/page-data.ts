import { notFound } from "next/navigation";
import {
  getCityBySlug,
  getCountryBySlug,
  hasWeekendTripPage,
} from "@/lib/data/queries";
import {
  getCityNatureProfile,
  getNaturePlacesForRoute,
  getNatureRoutesForCity,
  hasNatureHubPage,
  hasNatureRoutePage,
} from "@/lib/nature/engine";

import { NATURE_ROUTE_LABEL } from "@/lib/nature/taxonomy";
import { cityNatureCategoryRoute, cityNatureRoute } from "@/lib/seo/routes";
import { cityTitleName } from "@/lib/seo/city-title";
import type { NatureImage, NatureRouteSegment } from "@/types";

/**
 * Props assembly for the nature hub and every category route.
 *
 * Kept in one place so the title, description and eligibility rules a page
 * renders are the same ones its `generateMetadata` and the sitemap use — a
 * page that 404s must never appear in the sitemap, and vice versa.
 */

/**
 * Headings are intent-shaped and factual. "Best" is never used: nothing here
 * ranks by quality, only by measured distance.
 */
export function natureHubTitle(city: { name: string; slug: string; countrySlug: string; countryName: string }) {
  return `Nature Near ${cityTitleName(city)}, ${city.countryName}`;
}

export function natureCategoryTitle(
  city: { name: string; slug: string; countrySlug: string; countryName: string },
  segment: NatureRouteSegment,
) {
  return `${NATURE_ROUTE_LABEL[segment]} Near ${cityTitleName(city)}, ${city.countryName}`;
}

export function natureHubDescription(cityName: string, count: number, categories: number) {
  return `Research ${count} classified outdoor destinations within weekend reach of ${cityName}, grouped across ${categories} kinds of place and ordered by measured straight-line distance from the city centre. Distances only — no travel times, schedules, or rankings.`;
}

export function natureCategoryDescription(
  cityName: string,
  segment: NatureRouteSegment,
  count: number,
) {
  const label = NATURE_ROUTE_LABEL[segment].toLowerCase();
  return `Research ${count} ${label} within weekend reach of ${cityName}, classified from Wikidata types and ordered by measured straight-line distance from the city centre. Distances only — no travel times, schedules, or rankings.`;
}

/**
 * Link-preview image for a nature page: the same verified place image the
 * page uses as its hero, never a city skyline and never a placeholder. Returns
 * undefined when no eligible place carries one, so the preview falls back to
 * the platform default rather than showing the wrong landscape.
 */
function natureOgImage(places: readonly { image?: NatureImage }[]) {
  const image = places.find((place) => place.image)?.image;
  if (!image?.src || !image.alt) return undefined;
  return {
    url: image.src,
    width: image.width,
    height: image.height,
    alt: image.alt,
  };
}

export function buildNatureHubProps(citySlug: string) {
  const city = getCityBySlug(citySlug);
  if (!city || !hasNatureHubPage(citySlug)) return undefined;
  const profile = getCityNatureProfile(citySlug);
  if (!profile) return undefined;

  return {
    city,
    country: getCountryBySlug(city.countrySlug),
    places: profile.places,
    title: natureHubTitle(city),
    description: natureHubDescription(
      city.name,
      profile.places.length,
      profile.categories.length,
    ),
    eyebrow: "Nature discovery",
    path: cityNatureRoute(citySlug),
    breadcrumbLabel: "Nature",
    segments: getNatureRoutesForCity(citySlug),
    current: "hub" as const,
    categoryCounts: profile.categories.map(({ category, count }) => ({
      category,
      count,
    })),
    showFilters: true,
    hasWeekendTrip: hasWeekendTripPage(citySlug),
    hasHub: true,
  };
}

export function buildNatureCategoryProps(
  citySlug: string,
  segment: NatureRouteSegment,
) {
  const city = getCityBySlug(citySlug);
  if (!city || !hasNatureRoutePage(citySlug, segment)) return undefined;
  const places = getNaturePlacesForRoute(citySlug, segment);

  const counts = new Map<string, number>();
  for (const place of places) {
    for (const category of place.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }

  return {
    city,
    country: getCountryBySlug(city.countrySlug),
    places,
    title: natureCategoryTitle(city, segment),
    description: natureCategoryDescription(city.name, segment, places.length),
    eyebrow: NATURE_ROUTE_LABEL[segment],
    path: cityNatureCategoryRoute(citySlug, segment),
    breadcrumbLabel: NATURE_ROUTE_LABEL[segment],
    segments: getNatureRoutesForCity(citySlug),
    current: segment,
    categoryCounts: Array.from(counts.entries())
      .map(([category, count]) => ({ category: category as never, count }))
      .sort((a, b) => b.count - a.count),
    showFilters: false,
    hasWeekendTrip: hasWeekendTripPage(citySlug),
    hasHub: hasNatureHubPage(citySlug),
  };
}

export function requireNatureCategoryProps(
  citySlug: string,
  segment: NatureRouteSegment,
) {
  const props = buildNatureCategoryProps(citySlug, segment);
  if (!props) notFound();
  return props;
}

/**
 * Metadata for a nature page, kept separate from the render props so the page
 * component is never handed fields it does not render.
 */
export function natureMetadataFor(
  props: { title: string; description: string; path: string; places: readonly { image?: NatureImage }[] } | undefined,
) {
  if (!props) return undefined;
  return {
    title: props.title,
    description: props.description,
    path: props.path,
    image: natureOgImage(props.places),
  };
}
