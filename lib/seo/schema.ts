import { siteName } from "@/lib/seo/metadata";
import { absoluteUrl, siteUrl } from "@/lib/seo/routes";
import type {
  BreadcrumbItem,
  CountryEmergencyProfile,
  DataSource,
  EmergencyContact,
} from "@/types";

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

export function emergencyServiceSchema({
  countryName,
  path,
  profile,
  contacts,
  sources,
}: {
  countryName: string;
  path: string;
  profile: CountryEmergencyProfile;
  contacts: EmergencyContact[];
  sources: DataSource[];
}) {
  const primary = sources[0];

  return {
    "@context": "https://schema.org",
    "@type": "EmergencyService",
    name: `${countryName} emergency services`,
    description: `Verified emergency contact numbers for ${countryName}, attributed to official emergency-service or government publishers.`,
    areaServed: {
      "@type": "Country",
      name: countryName,
      identifier: profile.countryCode,
    },
    url: absoluteUrl(path),
    contactPoint: contacts.map((contact) => ({
      "@type": "ContactPoint",
      contactType: contact.label,
      telephone: contact.value,
      availableLanguage: "en",
      hoursAvailable:
        contact.availability === "24/7" ? "Mo-Su 00:00-23:59" : undefined,
      description: contact.notes,
    })),
    isBasedOn: sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.name,
      url: source.url,
      publisher: {
        "@type": "Organization",
        name: source.organization,
      },
    })),
    provider: primary
      ? {
          "@type": "Organization",
          name: primary.organization,
          url: primary.url,
        }
      : undefined,
    dateModified: profile.lastVerified,
  };
}
