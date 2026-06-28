import { siteName } from "@/lib/seo/metadata";
import { absoluteUrl, siteUrl } from "@/lib/seo/routes";
import type {
  AirportProfile,
  BreadcrumbItem,
  CountryEmergencyProfile,
  CountryTransportProfile,
  DataSource,
  EmergencyContact,
  HealthcareAccessProfile,
  HospitalRegistryProfile,
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

export function itemListSchema({
  name,
  description,
  items,
}: {
  name: string;
  description: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
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

export function healthcareAccessSchema({
  countryName,
  path,
  profile,
  sources,
  hospitalRegistry,
}: {
  countryName: string;
  path: string;
  profile: HealthcareAccessProfile;
  sources: DataSource[];
  hospitalRegistry?: HospitalRegistryProfile;
}) {
  const portal = profile.officialHealthPortal;
  const authority = profile.publicHealthAuthority;

  return {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name:
      profile.healthcareSystemName ?? `${countryName} healthcare information`,
    description:
      "Verified national healthcare and public-health information attributed to official government, public health, or recognised health-system publishers.",
    areaServed: {
      "@type": "Country",
      name: countryName,
      identifier: profile.countryCode,
    },
    url: absoluteUrl(path),
    sameAs: [
      portal?.url,
      authority?.url,
      hospitalRegistry?.registryUrl,
    ].filter((value): value is string => Boolean(value)),
    parentOrganization: portal
      ? {
          "@type": "GovernmentOrganization",
          name: portal.label,
          url: portal.url,
        }
      : undefined,
    isBasedOn: sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.name,
      url: source.url,
      publisher: {
        "@type": "Organization",
        name: source.organization,
      },
    })),
    dateModified: profile.lastVerified,
  };
}

export function transportAuthoritySchema({
  countryName,
  path,
  profile,
  sources,
}: {
  countryName: string;
  path: string;
  profile: CountryTransportProfile;
  sources: DataSource[];
}) {
  const portal =
    profile.nationalTransportAuthority ?? profile.officialTransportPortal;
  const sameAs = [
    profile.nationalTransportAuthority?.url,
    profile.aviationAuthority?.url,
    profile.railAuthority?.url,
    profile.transportSafetyAuthority?.url,
    profile.officialTransportPortal?.url,
  ].filter((value): value is string => Boolean(value));

  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name:
      profile.nationalTransportAuthority?.label ??
      `${countryName} transport authorities`,
    description:
      "Verified national transport authorities, operators, and aviation publishers attributed to official government sources.",
    areaServed: {
      "@type": "Country",
      name: countryName,
      identifier: profile.countryCode,
    },
    url: portal ? portal.url : absoluteUrl(path),
    sameAs,
    isBasedOn: sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.name,
      url: source.url,
      publisher: {
        "@type": "Organization",
        name: source.organization,
      },
    })),
    dateModified: profile.lastVerified,
  };
}

export function airportSchema({
  airport,
  cityName,
  countryName,
}: {
  airport: AirportProfile;
  cityName?: string;
  countryName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Airport",
    name: airport.name,
    iataCode: airport.iataCode,
    url: airport.officialUrl,
    address: cityName
      ? {
          "@type": "PostalAddress",
          addressLocality: cityName,
          addressCountry: countryName,
        }
      : {
          "@type": "PostalAddress",
          addressCountry: countryName,
        },
    dateModified: airport.lastVerified,
  };
}

/**
 * schema.org FAQPage — used for both the city FAQ block and the AI-Overview
 * answer-first block (both are Question → acceptedAnswer pairs). Renders the
 * structured data Google needs for FAQ rich results / AI Overview eligibility.
 */
export function faqSchema(
  faqs: { question: string; answer: string }[],
  url?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(url ? { url: absoluteUrl(url) } : {}),
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
