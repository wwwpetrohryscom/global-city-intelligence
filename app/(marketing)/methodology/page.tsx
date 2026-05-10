import type { Metadata } from "next";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { DataTable } from "@/components/tables/DataTable";
import { FactList } from "@/components/ui/fact-list";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/ui/section-heading";
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
