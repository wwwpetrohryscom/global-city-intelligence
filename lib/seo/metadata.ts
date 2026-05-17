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
} from "@/types";

interface MetadataInput {
  title: string;
  description: string;
  path: string;
  lastModified?: string;
  type?: "website" | "article";
}

export const siteName = "Global City Intelligence";

export function createMetadata({
  title,
  description,
  path,
  lastModified = LAST_UPDATED,
  type = "website",
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      dateModified: lastModified,
      updatedDate: lastModified,
    },
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
