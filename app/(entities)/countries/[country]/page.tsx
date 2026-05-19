import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MetricCard } from "@/components/cards/MetricCard";
import { CountryCitiesSection } from "@/components/country/CountryCitiesSection";
import { CountryCollectionsSection } from "@/components/country/CountryCollectionsSection";
import { CountryComparisonsSection } from "@/components/country/CountryComparisonsSection";
import { CountryHubNavigation } from "@/components/country/CountryHubNavigation";
import {
  CountryOverviewCards,
  type OverviewCard,
} from "@/components/country/CountryOverviewCards";
import { CountryRankingsSection } from "@/components/country/CountryRankingsSection";
import { CountryIndicatorsSection } from "@/components/data/CountryIndicatorsSection";
import { HealthcareAccessSection } from "@/components/healthcare/HealthcareAccessSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { PublicSafetySection } from "@/components/safety/PublicSafetySection";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { DataTable } from "@/components/tables/DataTable";
import { TransportMobilitySection } from "@/components/transport/TransportMobilitySection";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  generateCountryExplanation,
  generateCountryIntro,
} from "@/lib/content/generators";
import { internalLink } from "@/lib/content/links";
import { demoDataNotice } from "@/lib/content/quality";
import {
  getAllCountries,
  getCitiesByCountrySlug,
  getCollectionsForCountry,
  getComparisonsForCountry,
  getCountryBySlug,
  getCountryEmergencyContacts,
  getCountryEmergencyProfile,
  getCountryHealthcareProfile,
  getCountryTransportProfile,
  getEmergencySources,
  getHealthcareSources,
  getHospitalRegistryProfile,
  getRankingsForCountry,
  getTransportSources,
  hasVerifiedEmergencyData,
  hasVerifiedHealthcareData,
  hasVerifiedTransportData,
} from "@/lib/data/queries";
import { getSourcesByIds } from "@/lib/data/sources";
import { countryBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { countryRoute, staticRoutes } from "@/lib/seo/routes";
import {
  breadcrumbSchema,
  datasetSchema,
  emergencyServiceSchema,
  healthcareAccessSchema,
  transportAuthoritySchema,
  webpageSchema,
} from "@/lib/seo/schema";

type PageProps = {
  params: Promise<{ country: string }>;
};

export function generateStaticParams() {
  return getAllCountries().map((country) => ({ country: country.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const country = getCountryBySlug(countrySlug);

  if (!country) {
    return {};
  }

  const cityCount = getCitiesByCountrySlug(country.slug).length;
  const cityCountText =
    cityCount === 0
      ? ""
      : cityCount === 1
        ? " covering one supported city profile,"
        : ` covering ${cityCount} supported city profiles,`;

  return createMetadata({
    title: `${country.name} Country Intelligence Hub`,
    description: `Explore ${country.name} city intelligence${cityCountText} public safety context, healthcare access, transport information, comparisons, collections, rankings, and source-attributed data.`,
    path: countryRoute(country.slug),
    lastModified: country.lastUpdated,
    type: "article",
  });
}

export default async function CountryPage({ params }: PageProps) {
  const { country: countrySlug } = await params;
  const country = getCountryBySlug(countrySlug);

  if (!country) {
    notFound();
  }

  const cities = getCitiesByCountrySlug(country.slug);
  const sources = getSourcesByIds(country.sources);
  const breadcrumbs = countryBreadcrumbs(country.slug);
  const title = `${country.name} Country Intelligence Hub`;
  const introCopy = generateCountryIntro(country, cities);
  const explanationCopy = generateCountryExplanation(country, cities);
  const description = introCopy;
  const methodologyLink = internalLink.methodology();
  const dataSourcesLink = internalLink.dataSources();

  const emergencyProfile = getCountryEmergencyProfile(country.slug);
  const emergencyContacts = emergencyProfile
    ? getCountryEmergencyContacts(emergencyProfile)
    : [];
  const emergencySources = emergencyProfile
    ? getEmergencySources(emergencyProfile)
    : [];

  const healthcareProfile = getCountryHealthcareProfile(country.slug);
  const hospitalRegistry = getHospitalRegistryProfile(country.slug);
  const healthcareSources = healthcareProfile
    ? getHealthcareSources(healthcareProfile)
    : [];
  const hospitalRegistrySources = hospitalRegistry
    ? getHealthcareSources(hospitalRegistry)
    : [];
  const healthcareJsonLdSources = (() => {
    const seen = new Set<string>();
    return [...healthcareSources, ...hospitalRegistrySources].filter((source) => {
      if (seen.has(source.id)) {
        return false;
      }
      seen.add(source.id);
      return true;
    });
  })();

  const transportProfile = getCountryTransportProfile(country.slug);
  const transportSources = transportProfile
    ? getTransportSources(transportProfile)
    : [];

  const countryComparisons = getComparisonsForCountry(country.slug);
  const countryCollections = getCollectionsForCountry(country.slug);
  const countryRankings = getRankingsForCountry(country.slug);

  const verifiedEmergency = hasVerifiedEmergencyData(emergencyProfile);
  const verifiedHealthcare =
    hasVerifiedHealthcareData(healthcareProfile) ||
    hasVerifiedHealthcareData(hospitalRegistry);
  const verifiedTransport = hasVerifiedTransportData(transportProfile);

  const overviewCards: OverviewCard[] = [
    {
      label: "Supported cities",
      value: String(cities.length),
      description: `City profiles indexed for ${country.name}.`,
    },
    {
      label: "Emergency profile",
      value: verifiedEmergency ? "Verified" : "Fallback",
      description: verifiedEmergency
        ? "Country emergency contacts attributed to official publishers."
        : "Verified emergency data is not available; fallback context is shown.",
    },
    {
      label: "Healthcare profile",
      value: verifiedHealthcare ? "Verified" : "Fallback",
      description: verifiedHealthcare
        ? "Healthcare layer attributed to official health authorities."
        : "Verified healthcare data is not available; fallback context is shown.",
    },
    {
      label: "Transport profile",
      value: verifiedTransport ? "Verified" : "Fallback",
      description: verifiedTransport
        ? "Transport authority and operator references attributed to official sources."
        : "Verified transport data is not available; fallback context is shown.",
    },
    {
      label: "Related comparisons",
      value: String(countryComparisons.length),
      description: "Curated city-vs-city comparison pages that reference this country.",
    },
    {
      label: "Related collections",
      value: String(countryCollections.length),
      description: "Best Cities collections that include at least one city from this country.",
    },
    {
      label: "Data year",
      value: country.dataYear,
      description: "Reference year for the country intelligence dataset.",
    },
    {
      label: "Last updated",
      value: country.lastUpdated,
      description: "Most recent platform-side review of the country hub.",
    },
  ];

  const hubNavItems: { href: string; label: string }[] = [
    { href: "#country-overview", label: "Overview" },
    { href: "#country-cities", label: "Cities" },
    { href: "#country-indicators", label: "Indicators" },
  ];

  if (emergencyProfile) {
    hubNavItems.push({
      href: "#emergency-public-safety-heading",
      label: "Public safety",
    });
  }
  if (healthcareProfile || hospitalRegistry) {
    hubNavItems.push({
      href: "#healthcare-access-heading",
      label: "Healthcare",
    });
  }
  if (transportProfile) {
    hubNavItems.push({
      href: "#transport-mobility-heading",
      label: "Transport",
    });
  }
  hubNavItems.push(
    { href: "#country-comparisons", label: "Comparisons" },
    { href: "#country-collections", label: "Collections" },
    { href: "#country-rankings", label: "Rankings" },
    { href: "#country-sources", label: "Sources" },
  );

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: countryRoute(country.slug),
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={datasetSchema({
          name: `${country.name} city intelligence country dataset`,
          description,
          path: countryRoute(country.slug),
          dataYear: country.dataYear,
          sources,
        })}
      />
      {emergencyProfile && emergencyContacts.length > 0 ? (
        <JsonLd
          data={emergencyServiceSchema({
            countryName: country.name,
            path: countryRoute(country.slug),
            profile: emergencyProfile,
            contacts: emergencyContacts,
            sources: emergencySources,
          })}
        />
      ) : null}
      {healthcareProfile ? (
        <JsonLd
          data={healthcareAccessSchema({
            countryName: country.name,
            path: countryRoute(country.slug),
            profile: healthcareProfile,
            sources: healthcareJsonLdSources,
            hospitalRegistry,
          })}
        />
      ) : null}
      {transportProfile ? (
        <JsonLd
          data={transportAuthoritySchema({
            countryName: country.name,
            path: countryRoute(country.slug),
            profile: transportProfile,
            sources: transportSources,
          })}
        />
      ) : null}
      <PageHeader eyebrow={country.region} intro={introCopy} title={title}>
        <dl className="grid gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Last updated
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {country.lastUpdated}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {country.dataYear}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Country code
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {country.iso2}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbNav items={breadcrumbs} />

        <CountryHubNavigation items={hubNavItems} />

        <section aria-labelledby="country-overview-heading" id="country-overview">
          <SectionHeading
            description={`Snapshot of structured ${country.name} city intelligence and which verified utility layers are available on this hub.`}
            title={`${country.name} country overview`}
          />
          <h2 className="sr-only" id="country-overview-heading">
            {country.name} country overview
          </h2>
          <div className="mt-6">
            <CountryOverviewCards cards={overviewCards} />
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {country.metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section>
          <SectionHeading
            description="Country pages group cities into crawlable clusters and give national context without replacing city-level comparisons."
            title={`${country.name} data table`}
          />
          <div className="mt-6">
            <DataTable
              caption={`${country.name} country intelligence data table`}
              rows={[
                {
                  metric: "Region",
                  value: country.region,
                  context:
                    "Used for geographic clustering and regional comparisons.",
                },
                {
                  metric: "Indexed cities",
                  value: String(cities.length),
                  context: cities.map((city) => city.name).join(", ") || "—",
                },
                ...country.metrics.map((metric) => ({
                  metric: metric.label,
                  value: metric.value,
                  context: metric.description,
                })),
              ]}
            />
          </div>
        </section>

        <CountryCitiesSection countryName={country.name} cities={cities} />

        <CountryIndicatorsSection country={country} />

        <PublicSafetySection
          countryName={country.name}
          countryProfile={emergencyProfile}
          variant="country"
        />

        <HealthcareAccessSection
          countryName={country.name}
          countryProfile={healthcareProfile}
          emergencySectionHref="#emergency-public-safety-heading"
          hospitalRegistry={hospitalRegistry}
          variant="country"
        />

        <TransportMobilitySection
          countryName={country.name}
          countryProfile={transportProfile}
          emergencySectionHref="#emergency-public-safety-heading"
          healthcareSectionHref="#healthcare-access-heading"
          variant="country"
        />

        <CountryComparisonsSection
          comparisons={countryComparisons}
          countryName={country.name}
        />

        <CountryCollectionsSection
          countryName={country.name}
          matches={countryCollections}
        />

        <CountryRankingsSection
          countryName={country.name}
          matches={countryRankings}
        />

        <section
          aria-labelledby="country-sources-heading"
          className="grid gap-5 lg:grid-cols-[1fr_1fr]"
          id="country-sources"
        >
          <article className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
            <h2
              className="text-2xl font-semibold text-text-primary"
              id="country-sources-heading"
            >
              Interpretation and methodology note
            </h2>
            <p className="mt-4 leading-7 text-text-secondary">
              {explanationCopy}
            </p>
            <p className="mt-4 leading-7 text-text-secondary">
              Structured indicators on this hub are directional and intended for
              orientation. Verified utility layers — emergency, healthcare,
              transport — are attributed to official publishers where available
              and use transparent fallback states where verified country-level
              data is not yet integrated.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.cities}
                >
                  Cities directory
                </Link>
                <span className="text-text-secondary">
                  {" "}
                  — browse every indexed city profile.
                </span>
              </li>
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.countries}
                >
                  All countries
                </Link>
                <span className="text-text-secondary">
                  {" "}
                  — navigate to other country hubs.
                </span>
              </li>
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.compare}
                >
                  City comparisons
                </Link>
                <span className="text-text-secondary">
                  {" "}
                  — curated city-vs-city pages with structured indicators.
                </span>
              </li>
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.collections}
                >
                  Best Cities collections
                </Link>
                <span className="text-text-secondary">
                  {" "}
                  — comparison-oriented shortlists by intent.
                </span>
              </li>
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.rankings}
                >
                  All rankings
                </Link>
                <span className="text-text-secondary">
                  {" "}
                  — structured rankings across city intelligence categories.
                </span>
              </li>
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={methodologyLink.href}
                >
                  {methodologyLink.text}
                </Link>
                <span className="text-text-secondary">
                  {" "}
                  for the scoring model used across modules.
                </span>
              </li>
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={dataSourcesLink.href}
                >
                  {dataSourcesLink.text}
                </Link>
                <span className="text-text-secondary">
                  {" "}
                  for the source registry behind verified layers.
                </span>
              </li>
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.travelBudgetCalculator}
                >
                  Travel budget calculator
                </Link>
                <span className="text-text-secondary">
                  {" "}
                  — plan a trip budget for cities in {country.name}. Use your
                  own trip inputs and then review city, public safety,
                  healthcare, and transport context. Planning estimator only,
                  not an official travel cost estimate.
                </span>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-6 text-text-secondary">
              {demoDataNotice()}
            </p>
          </article>
          <SourceBlock sources={sources} />
        </section>
      </div>
    </main>
  );
}
