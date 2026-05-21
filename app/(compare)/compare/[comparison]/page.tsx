import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComparisonBarSummary } from "@/components/charts/ComparisonBarSummary";
import { ComparisonSummaryCards } from "@/components/comparison/ComparisonSummaryCards";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { RelatedComparisons } from "@/components/comparison/RelatedComparisons";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildComparisonCategories } from "@/lib/data/comparisons-categories";
import { getComparisonIntentLabel } from "@/lib/data/comparisons";
import {
  getAllComparisons,
  getCityBySlug,
  getComparisonBySlug,
  getCountryBySlug,
  getCountryEmergencyProfile,
  getCountryHealthcareProfile,
  getCountryTransportProfile,
  getRelatedComparisons,
} from "@/lib/data/queries";
import { getSourcesByIds } from "@/lib/data/sources";
import { comparisonBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import {
  cityRoute,
  comparisonRoute,
  countryRoute,
  staticRoutes,
} from "@/lib/seo/routes";
import {
  breadcrumbSchema,
  datasetSchema,
  webpageSchema,
} from "@/lib/seo/schema";

type PageProps = {
  params: Promise<{ comparison: string }>;
};

export function generateStaticParams() {
  return getAllComparisons().map((comparison) => ({ comparison: comparison.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { comparison: comparisonSlug } = await params;
  const comparison = getComparisonBySlug(comparisonSlug);

  if (!comparison) {
    return {};
  }

  return createMetadata({
    title: comparison.title,
    description: comparison.description,
    path: comparisonRoute(comparison.slug),
    type: "article",
    lastModified: comparison.updatedDate,
  });
}

export default async function ComparisonPage({ params }: PageProps) {
  const { comparison: comparisonSlug } = await params;
  const comparison = getComparisonBySlug(comparisonSlug);

  if (!comparison) {
    notFound();
  }

  const cityA = getCityBySlug(comparison.cityASlug);
  const cityB = getCityBySlug(comparison.cityBSlug);

  if (!cityA || !cityB) {
    notFound();
  }

  const countryA = getCountryBySlug(cityA.countrySlug);
  const countryB = getCountryBySlug(cityB.countrySlug);
  const breadcrumbs = comparisonBreadcrumbs(comparison.slug);
  const sources = getSourcesByIds(comparison.sourceIds);
  const categories = buildComparisonCategories({
    cityA,
    cityB,
    countryA,
    countryB,
  });
  const related = getRelatedComparisons(comparison.slug);
  const intentLabel = getComparisonIntentLabel(comparison.comparisonIntent);

  const layersA = {
    emergency: getCountryEmergencyProfile(cityA.countrySlug)?.verificationStatus === "verified",
    healthcare: getCountryHealthcareProfile(cityA.countrySlug)?.verificationStatus === "verified",
    transport: getCountryTransportProfile(cityA.countrySlug)?.verificationStatus === "verified",
  };
  const layersB = {
    emergency: getCountryEmergencyProfile(cityB.countrySlug)?.verificationStatus === "verified",
    healthcare: getCountryHealthcareProfile(cityB.countrySlug)?.verificationStatus === "verified",
    transport: getCountryTransportProfile(cityB.countrySlug)?.verificationStatus === "verified",
  };

  const h1 = `${cityA.name} vs ${cityB.name}: City Intelligence Comparison`;

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: comparisonRoute(comparison.slug),
          title: comparison.title,
          description: comparison.description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={datasetSchema({
          name: `${cityA.name} vs ${cityB.name} city intelligence comparison`,
          description: comparison.description,
          path: comparisonRoute(comparison.slug),
          dataYear: comparison.dataYear,
          sources,
        })}
      />

      <PageHeader
        eyebrow={`${comparison.region} · ${intentLabel}`}
        intro={comparison.description}
        title={h1}
      >
        <dl className="grid gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Last updated
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {comparison.updatedDate}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {comparison.dataYear}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-12 py-12">
        <BreadcrumbNav items={breadcrumbs} />

        <ComparisonSummaryCards
          cityA={cityA}
          cityB={cityB}
          countryA={countryA}
          countryB={countryB}
          dataYear={comparison.dataYear}
          intentLabel={intentLabel}
          lastUpdated={comparison.updatedDate}
          layersA={layersA}
          layersB={layersB}
        />

        <section aria-labelledby="comparison-visual-summary-heading">
          <SectionHeading
            description="Lightweight visual summary using directional module scores from the underlying city profiles. The comparison table below remains the source of truth."
            title="Visual summary"
          />
          <h2 className="sr-only" id="comparison-visual-summary-heading">
            {cityA.name} and {cityB.name} visual summary
          </h2>
          <div className="mt-6">
            <ComparisonBarSummary cityA={cityA} cityB={cityB} />
          </div>
        </section>

        <section>
          <SectionHeading
            description="Side-by-side directional indicators for both cities. Where verified city-level data is not yet available, rows fall back to national context rather than guessed values."
            title="Category comparison"
          />
          <div className="mt-6">
            <ComparisonTable
              caption={`${cityA.name} versus ${cityB.name} city intelligence comparison`}
              categories={categories}
              cityAName={cityA.name}
              cityBName={cityB.name}
            />
          </div>
        </section>

        <section>
          <SectionHeading
            description="A short interpretation guide for the categories above. Use the linked official sources for critical decisions; do not treat structured indicators as official measurements."
            title="How to interpret this comparison"
          />
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {categories.map((category) => (
              <li
                className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm"
                key={category.key}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  {category.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-text-primary">
                  {category.summary}
                </p>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  {category.interpretation}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-text-primary">
              Methodology and limitations
            </h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Comparison pages reuse the structured indicators on the underlying
              city and country profiles. Indicators are directional. Verified
              emergency, healthcare, and transport profiles are surfaced where
              official source-backed data exists, and a transparent fallback is
              shown otherwise. Read the{" "}
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.methodology}
              >
                scoring methodology
              </Link>
              {" "}for how indicators are constructed, and the{" "}
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.dataSources}
              >
                data sources
              </Link>
              {" "}registry for the official publishers cited across the site.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={cityRoute(cityA.slug)}
                >
                  Open the {cityA.name} city profile
                </Link>
              </li>
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={cityRoute(cityB.slug)}
                >
                  Open the {cityB.name} city profile
                </Link>
              </li>
              {countryA ? (
                <li>
                  <Link
                    className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                    href={countryRoute(countryA.slug)}
                  >
                    Open the {countryA.name} country profile
                  </Link>
                </li>
              ) : null}
              {countryB && countryB.slug !== countryA?.slug ? (
                <li>
                  <Link
                    className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                    href={countryRoute(countryB.slug)}
                  >
                    Open the {countryB.name} country profile
                  </Link>
                </li>
              ) : null}
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.cities}
                >
                  Cities directory
                </Link>
              </li>
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.countries}
                >
                  Country directory
                </Link>
              </li>
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.rankings}
                >
                  Browse global city rankings
                </Link>
              </li>
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.compare}
                >
                  Back to all comparisons
                </Link>
              </li>
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.costOfLivingCalculator}
                >
                  Open the cost of living calculator
                </Link>
                <span className="text-text-secondary">
                  {" "}
                  — use your own monthly budget inputs to estimate the cost
                  difference between these cities. Planning estimator only,
                  not an official cost-of-living measurement.
                </span>
              </li>
              <li>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.travelBudgetCalculator}
                >
                  Open the travel budget calculator
                </Link>
                <span className="text-text-secondary">
                  {" "}
                  — use your own trip inputs to estimate a travel budget for
                  either city. Then review the city profiles, safety,
                  healthcare, and transport context. Planning estimator only,
                  not an official travel cost estimate.
                </span>
              </li>
            </ul>
          </article>
          <SourceBlock sources={sources} />
        </section>

        <RelatedComparisons comparisons={related} />
      </Container>
    </main>
  );
}
