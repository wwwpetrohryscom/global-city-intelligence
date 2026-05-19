import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { HubNav } from "@/components/navigation/HubNav";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllComparisons,
  getComparisonIntentLabel,
} from "@/lib/data/queries";
import { staticBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { comparisonRoute, staticRoutes } from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";
import type { ComparisonRegion } from "@/types";

const title = "City Comparison Directory";
const description =
  "Browse curated city-vs-city comparisons across cost of living, air quality, safety, healthcare, transport, emergency services, and country context. Every comparison link is server-rendered and crawlable.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.compare,
});

const REGION_ORDER: ComparisonRegion[] = [
  "Europe",
  "North America",
  "Asia",
  "Middle East",
  "Latin America",
  "Africa",
  "Oceania",
  "Global",
];

export default function CompareIndexPage() {
  const comparisons = getAllComparisons();
  const breadcrumbs = staticBreadcrumbs("Compare", staticRoutes.compare);
  const grouped = groupBy(comparisons, (comparison) => comparison.region);
  const orderedRegions = REGION_ORDER.filter((region) => grouped[region]?.length);

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: staticRoutes.compare,
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <PageHeader eyebrow="Compare" intro={description} title={title}>
        <dl className="grid gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Curated comparisons
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {comparisons.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Regions covered
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {orderedRegions.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Last updated
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {LAST_UPDATED}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {DATA_YEAR}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-12 py-12">
        <BreadcrumbNav items={breadcrumbs} />
        <HubNav activeHref={staticRoutes.compare} />

        <section>
          <SectionHeading
            description="A curated directory of city-vs-city comparison pages. We do not generate every possible pair — only useful pairs for relocation, remote work, business, and regional planning."
            title="All curated comparisons"
          />
          <div className="mt-6 space-y-10">
            {orderedRegions.map((region) => {
              const items = grouped[region] ?? [];
              return (
                <section
                  aria-labelledby={`region-${region.toLowerCase().replace(/\s+/g, "-")}`}
                  key={region}
                >
                  <h3
                    className="text-base font-semibold uppercase tracking-[0.18em] text-brand-500"
                    id={`region-${region.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {region}
                  </h3>
                  <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((comparison) => (
                      <li key={comparison.slug}>
                        <Link
                          className="block rounded-2xl border border-neutral-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md"
                          href={comparisonRoute(comparison.slug)}
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            {getComparisonIntentLabel(comparison.comparisonIntent)}
                          </p>
                          <p className="mt-2 text-base font-semibold text-text-primary">
                            {comparison.title}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-text-secondary">
                            {comparison.description}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-border bg-surface-soft p-6">
          <h2 className="text-2xl font-semibold text-text-primary">
            How to use the comparison directory
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
            Each comparison page reuses the structured indicators from the
            underlying city and country profiles. Indicators are directional
            and intended for orientation; verified emergency, healthcare, and
            transport layers are surfaced where official source-backed data
            exists, and a transparent fallback is shown otherwise. Use the
            linked official sources for critical decisions.
          </p>
          <ul className="mt-5 grid gap-3 text-sm md:grid-cols-2">
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
                Countries directory
              </Link>
              <span className="text-text-secondary">
                {" "}
                — national context for every supported country.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.rankings}
              >
                Global rankings
              </Link>
              <span className="text-text-secondary">
                {" "}
                — compare cities through structured tables.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.methodology}
              >
                Scoring methodology
              </Link>
              <span className="text-text-secondary">
                {" "}
                — how indicators are constructed and read.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.dataSources}
              >
                Data sources
              </Link>
              <span className="text-text-secondary">
                {" "}
                — the official registry behind verified layers.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.costOfLivingCalculator}
              >
                Cost of living calculator
              </Link>
              <span className="text-text-secondary">
                {" "}
                — after choosing cities to compare, estimate your own monthly
                budget. Planning estimator based on your inputs only.
              </span>
            </li>
          </ul>
        </section>
      </Container>
    </main>
  );
}

function groupBy<T, K extends string>(items: T[], pickKey: (item: T) => K): Record<K, T[]> {
  return items.reduce<Record<K, T[]>>((acc, item) => {
    const key = pickKey(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}
