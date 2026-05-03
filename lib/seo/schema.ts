import { siteName } from "@/lib/seo/metadata";
import { absoluteUrl, siteUrl } from "@/lib/seo/routes";
import type { BreadcrumbItem, DataSource } from "@/types";

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
  };
}

export function webpageSchema({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
    },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function datasetSchema({
  name,
  description,
  path,
  dataYear,
  sources,
}: {
  name: string;
  description: string;
  path: string;
  dataYear: string;
  sources: DataSource[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name,
    description,
    url: absoluteUrl(path),
    temporalCoverage: dataYear,
    creator: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    citation: sources.map((source) => source.url),
    license: "https://opensource.org/license/mit/",
  };
}
