import type { Metadata } from "next";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { DataTable } from "@/components/tables/DataTable";
import { FactList } from "@/components/ui/fact-list";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/ui/section-heading";
import { REFERENCE_YEAR as ECONOMIC_REFERENCE_YEAR } from "@/lib/data/official/country-economics/dataset";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import { getSourcesByIds } from "@/lib/data/sources";
import { staticBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { staticRoutes } from "@/lib/seo/routes";
import { breadcrumbSchema, datasetSchema, webpageSchema } from "@/lib/seo/schema";

const title = "City Intelligence Methodology";
const description =
  "How Global City Intelligence scores affordability, air quality, energy readiness, and resilience with transparent source-backed logic.";
const breadcrumbs = staticBreadcrumbs("Methodology", staticRoutes.methodology);

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.methodology,
});

export default function MethodologyPage() {
  const sources = getSourcesByIds([
    "un-habitat",
    "who-air",
    "nasa-power",
    "ipcc-urban",
  ]);

  return (
    <main>
      <JsonLd data={webpageSchema({ path: staticRoutes.methodology, title, description })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={datasetSchema({
          name: "City intelligence methodology dataset",
          description,
          path: staticRoutes.methodology,
          dataYear: DATA_YEAR,
          sources,
        })}
      />
      <PageHeader eyebrow="Methodology" intro={description} title={title} />
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbNav items={breadcrumbs} />

        <section>
          <FactList
            facts={[
              { label: "Last updated", value: LAST_UPDATED },
              { label: "Data year", value: DATA_YEAR },
              { label: "Scoring scale", value: "0 to 100" },
              { label: "Rendering", value: "Server-rendered HTML" },
            ]}
          />
        </section>

        <section>
          <SectionHeading
            description="Scores are intentionally practical: a city is healthier to live in when access, exposure, affordability, and resilience work together."
            title="Scoring model"
          />
          <div className="mt-6">
            <DataTable
              caption="Methodology weights table"
              rows={[
                {
                  metric: "Affordability",
                  value: "25%",
                  context:
                    "Housing pressure, daily essentials, transport dependency, and service access.",
                },
                {
                  metric: "Air quality",
                  value: "25%",
                  context:
                    "Health-oriented interpretation of PM2.5, PM10, nitrogen dioxide, ozone, and monitoring confidence.",
                },
                {
                  metric: "Energy readiness",
                  value: "25%",
                  context:
                    "Clean-energy transition capacity, grid resilience, climate stress, and renewable-resource context.",
                },
                {
                  metric: "Urban resilience",
                  value: "25%",
                  context:
                    "Climate adaptation, institutional capacity, infrastructure reliability, and daily-life continuity.",
                },
              ]}
            />
          </div>
        </section>

        {/* PART AS: the country directory's default order is a data decision
            with consequences, so it is documented where methodology lives
            rather than only in a code comment. */}
        <section id="country-economic-order" className="scroll-mt-[var(--sticky-stack-height)]">
          <SectionHeading
            description="How the country directory is ordered, and what that order does and does not claim."
            title="Country directory order"
          />
          <div className="mt-6 space-y-4 text-base leading-7 text-text-secondary">
            <p>
              The country directory opens in order of economic size: nominal
              GDP in current US dollars, largest first. The values are World
              Bank World Development Indicators, indicator{" "}
              <code className="rounded bg-neutral-soft px-1.5 py-0.5 text-sm">
                NY.GDP.MKTP.CD
              </code>
              . The optional second sort uses GDP per capita in current US
              dollars, indicator{" "}
              <code className="rounded bg-neutral-soft px-1.5 py-0.5 text-sm">
                NY.GDP.PCAP.CD
              </code>
              . Alphabetical order remains available as a utility sort.
            </p>
            <p>
              <strong className="text-text-primary">One reference year.</strong>{" "}
              Every value in the snapshot belongs to {ECONOMIC_REFERENCE_YEAR},
              the most recent year for which both indicators are published for
              every supported country the World Bank reports. Nothing is
              compared across vintages, and no value is presented as if it were
              current-year data.
            </p>
            <p>
              <strong className="text-text-primary">Missing values.</strong> A
              country the World Bank does not report carries no value. It is
              never treated as zero — zero would sort it as the smallest
              economy in the world — and it is never dropped from the
              directory. It appears after every country with a comparable
              figure, and the interface says the value is not reported.
            </p>
            <p>
              <strong className="text-text-primary">
                This is an ordering, not a ranking.
              </strong>{" "}
              Nothing here is a Global City Intelligence score, a composite, or
              a weighting of several statistics. Two published World Bank
              indicators are stored as they are issued and sorted numerically.
              GDP is not a measure of wealth as households experience it, and
              GDP per capita is not a measure of quality of life; neither is
              described as such anywhere in the product.
            </p>
            <p>
              The snapshot is committed and rebuilt deliberately by{" "}
              <code className="rounded bg-neutral-soft px-1.5 py-0.5 text-sm">
                scripts/build-country-economics.mjs
              </code>
              . Nothing is fetched at request time.
            </p>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-text-primary">
              Explanation
            </h2>
            <p className="mt-4 leading-7 text-text-secondary">
              The platform avoids thin generated pages by pairing each score
              with visible context, tables, source blocks, and internal links.
              Scores are useful only when users can understand what is being
              rewarded, what is being penalized, and which data category drives
              the interpretation.
            </p>
            <p className="mt-4 leading-7 text-text-secondary">
              The data layer is production-shaped. Each city, module, ranking,
              and source is typed so verified datasets can be integrated
              continuously without changing crawlable routes, metadata, or
              structured data.
            </p>
          </article>
          <SourceBlock sources={sources} />
        </section>
      </div>
    </main>
  );
}
