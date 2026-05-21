import type { Metadata } from "next";
import { LAST_UPDATED } from "@/lib/data/constants";
import {
  absoluteUrl,
  getCityIntentUrl,
  getCollectionUrl,
} from "@/lib/seo/routes";
import type {
  City,
  CityCollection,
  CityIntent,
  CityIntentPage,
  Country,
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
