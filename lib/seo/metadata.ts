import type { Metadata } from "next";
import { LAST_UPDATED } from "@/lib/data/constants";
import { absoluteUrl } from "@/lib/seo/routes";

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
