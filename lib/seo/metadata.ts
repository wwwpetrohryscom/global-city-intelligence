import type { Metadata } from "next";
import { LAST_UPDATED } from "@/lib/data/constants";
import { absoluteUrl, getCollectionUrl } from "@/lib/seo/routes";
import type { CityCollection } from "@/types";

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
