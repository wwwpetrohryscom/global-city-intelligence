import type { Metadata } from "next";
import { LAST_UPDATED } from "@/lib/data/constants";
import {
  absoluteUrl,
  arrivalRoute,
  getCityIntentUrl,
  getCollectionUrl,
  movingToCityRoute,
  neighborhoodPlanningRoute,
} from "@/lib/seo/routes";
import type {
  ArrivalPage,
  City,
  CityCollection,
  CityIntent,
  CityIntentPage,
  Country,
  MovingToCityPage,
  NeighborhoodPlanningPage,
  PlaceImage,
} from "@/types";

interface MetadataOgImage {
  url: string;
  width?: number;
  height?: number;
  alt: string;
}

interface MetadataInput {
  title: string;
  description: string;
  path: string;
  lastModified?: string;
  type?: "website" | "article";
  /**
   * Optional verified hero image used for Open Graph + Twitter
   * previews. Pass only verified records — when undefined, the
   * resulting Metadata has no `openGraph.images` / `twitter.images`
   * so link previews quietly fall back to the platform's default
   * card rather than rendering a broken or placeholder asset.
   */
  image?: MetadataOgImage;
}

export const siteName = "Global City Intelligence";

export function createMetadata({
  title,
  description,
  path,
  lastModified = LAST_UPDATED,
  type = "website",
  image,
}: MetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type,
      ...(image
        ? {
            images: [
              {
                url: image.url,
                width: image.width,
                height: image.height,
                alt: image.alt,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image.url] } : {}),
    },
    other: {
      dateModified: lastModified,
      updatedDate: lastModified,
    },
  };
}

/**
 * Build the optional OG-image input for `createMetadata` from a
 * verified `PlaceImage` (city or country hero). Returns undefined for
 * any record that is not verified, has no src, or has no alt — so
 * callers can pipe the value straight in without an extra guard and
 * unverified records never leak into link-preview metadata.
 */
export function ogImageFromPlaceImage(
  image: PlaceImage | undefined,
): MetadataOgImage | undefined {
  if (!image || !image.verified || !image.src || !image.alt) {
    return undefined;
  }
  return {
    url: image.src,
    width: image.width,
    height: image.height,
    alt: image.alt,
  };
}

export function generateCollectionMetadata(
  collection: CityCollection,
): Metadata {
  return createMetadata({
    title: collection.title,
    description: collection.description,
    path: getCollectionUrl(collection.slug),
    lastModified: collection.updatedDate,
    type: "article",
  });
}

export function generateArrivalMetadata({
  arrivalPage,
  city,
  country,
  image,
}: {
  arrivalPage: ArrivalPage;
  city: City;
  country: Country | undefined;
  image?: MetadataOgImage;
}): Metadata {
  const countryFragment = country ? `, ${country.name}` : "";
  const title = `Arriving in ${city.name}: City Arrival Planning Guide`;
  const description = `Plan your arrival in ${city.name}${countryFragment} with city intelligence links, transport context, public-safety references, healthcare access notes, budget tools, relocation checklist, sources, and methodology — not an official airport or travel instruction service.`;

  return createMetadata({
    title,
    description,
    path: arrivalRoute(arrivalPage.citySlug),
    lastModified: arrivalPage.updatedDate,
    type: "article",
    image,
  });
}

export function generateNeighborhoodPlanningMetadata({
  planningPage,
  city,
  country,
  image,
}: {
  planningPage: NeighborhoodPlanningPage;
  city: City;
  country: Country | undefined;
  image?: MetadataOgImage;
}): Metadata {
  const countryFragment = country ? `, ${country.name}` : "";
  const title = `Neighborhood Planning Guide for ${city.name}`;
  const description = `Plan neighborhood research in ${city.name}${countryFragment} with transport context, public-safety context, healthcare access, arrival planning, budgeting tools, methodology notes, and source transparency. Not a real-estate, rental, or safety-ranking service.`;

  return createMetadata({
    title,
    description,
    path: neighborhoodPlanningRoute(planningPage.citySlug),
    lastModified: planningPage.updatedDate,
    type: "article",
    image,
  });
}

export function generateMovingToCityMetadata({
  movingPage,
  city,
  country,
  image,
}: {
  movingPage: MovingToCityPage;
  city: City;
  country: Country | undefined;
  image?: MetadataOgImage;
}): Metadata {
  const countryFragment = country ? `, ${country.name}` : "";
  const title = `Moving to ${city.name}: Planning Guide`;
  const description = `Plan relocation research for ${city.name}${countryFragment} with city context, country context, arrival planning, neighborhood research, cost tools, healthcare access, public-safety context, transport notes, methodology, and source transparency. Not immigration, visa, tax, legal, financial, medical, or property advice.`;

  return createMetadata({
    title,
    description,
    path: movingToCityRoute(movingPage.citySlug),
    lastModified: movingPage.updatedDate,
    type: "article",
    image,
  });
}

export function generateCityIntentMetadata({
  city,
  country,
  intent,
  intentPage,
}: {
  city: City;
  country: Country | undefined;
  intent: CityIntent;
  intentPage: CityIntentPage;
}): Metadata {
  const countryFragment = country ? ` in ${country.name}` : "";
  const title = `${city.name} for ${intent.shortTitle}: City Intelligence Guide`;
  const description = `Explore ${city.name}${countryFragment} for ${intent.shortTitle.toLowerCase()} using structured city intelligence across cost context, safety, healthcare, transport, public services, sources, and related comparisons.`;

  return createMetadata({
    title,
    description,
    path: getCityIntentUrl(intentPage.citySlug, intentPage.intentSlug),
    lastModified: intentPage.updatedDate,
    type: "article",
  });
}
