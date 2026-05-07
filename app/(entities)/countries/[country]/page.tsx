import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityCard } from "@/components/cards/CityCard";
import { MetricCard } from "@/components/cards/MetricCard";
import { PublicSafetySection } from "@/components/safety/PublicSafetySection";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { DataTable } from "@/components/tables/DataTable";
import { PageHeader } from "@/components/layout/PageHeader";
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
  getCountryBySlug,
  getCountryEmergencyContacts,
  getCountryEmergencyProfile,
  getEmergencySources,
} from "@/lib/data/queries";
import { getSourcesByIds } from "@/lib/data/sources";
import { countryBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { countryRoute, staticRoutes } from "@/lib/seo/routes";
import {
  breadcrumbSchema,
  datasetSchema,
  emergencyServiceSchema,
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

  return createMetadata({
    title: `${country.name} City Intelligence Country Profile`,
    description: `${country.name} country profile for indexed city intelligence pages, source context, data year, and connected city pages.`,
    path: countryRoute(country.slug),
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
  const title = `${country.name} City Intelligence`;
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

  return (
    <main>
      <JsonLd data={webpageSchema({ path: countryRoute(country.slug), title, description })} />
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
                  context: "Used for geographic clustering and regional comparisons.",
                },
                {
                  metric: "Indexed cities",
                  value: String(cities.length),
                  context: cities.map((city) => city.name).join(", "),
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

        <PublicSafetySection
          countryName={country.name}
          countryProfile={emergencyProfile}
          variant="country"
        />

        <section>
          <SectionHeading
            description="Each linked city page includes its own metadata, data table, source block, and module links."
            title={`Indexed cities in ${country.name}`}
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {cities.map((city) => (
              <CityCard city={city} key={city.slug} />
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-text-primary">
              Interpretation
            </h2>
            <p className="mt-4 leading-7 text-text-secondary">{explanationCopy}</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.rankings}
                >
                  All rankings
                </a>
                <span className="text-text-secondary">
                  {" "}
                  compare city profiles through ranking tables.
                </span>
              </li>
              <li>
                <a
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={dataSourcesLink.href}
                >
                  {dataSourcesLink.text}
                </a>
                <span className="text-text-secondary">
                  {" "}
                  for the source registry behind these scores.
                </span>
              </li>
              <li>
                <a
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={methodologyLink.href}
                >
                  {methodologyLink.text}
                </a>
                <span className="text-text-secondary">
                  {" "}
                  for the scoring model used across modules.
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
