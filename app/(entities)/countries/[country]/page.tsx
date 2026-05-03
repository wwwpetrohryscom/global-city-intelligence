import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityCard } from "@/components/cards/CityCard";
import { MetricCard } from "@/components/cards/MetricCard";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { DataTable } from "@/components/tables/DataTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getCitiesByCountrySlug,
  getCountries,
  getCountryBySlug,
} from "@/lib/data/queries";
import { getSourcesByIds } from "@/lib/data/sources";
import { countryBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { countryRoute, staticRoutes } from "@/lib/seo/routes";
import { breadcrumbSchema, datasetSchema, webpageSchema } from "@/lib/seo/schema";

type PageProps = {
  params: Promise<{ country: string }>;
};

export function generateStaticParams() {
  return getCountries().map((country) => ({ country: country.slug }));
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
  const description = country.intro;

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
      <PageHeader eyebrow={country.region} intro={country.intro} title={title}>
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
              Explanation
            </h2>
            <p className="mt-4 leading-7 text-text-secondary">
              Country pages provide a stable parent layer for programmatic SEO.
              They prevent city pages from becoming isolated and make it easier
              to add new cities, regions, and source-specific context later.
            </p>
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
                  href={staticRoutes.dataSources}
                >
                  Data sources
                </a>
                <span className="text-text-secondary">
                  {" "}
                  shows the source registry used across city and country pages.
                </span>
              </li>
            </ul>
          </article>
          <SourceBlock sources={sources} />
        </section>
      </div>
    </main>
  );
}
