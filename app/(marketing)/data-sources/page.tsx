import type { Metadata } from "next";
import { SourceCard } from "@/components/cards/source-card";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { DataTable } from "@/components/tables/DataTable";
import { FactList } from "@/components/ui/fact-list";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import { dataSources } from "@/lib/data/sources";
import { staticBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { staticRoutes } from "@/lib/seo/routes";
import { breadcrumbSchema, datasetSchema, webpageSchema } from "@/lib/seo/schema";

const title = "Global City Intelligence Data Sources";
const description =
  "Trusted institutional source references used for city intelligence methodology, air quality, energy, climate, and resilience context.";
const breadcrumbs = staticBreadcrumbs("Data Sources", staticRoutes.dataSources);

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.dataSources,
});

export default function DataSourcesPage() {
  return (
    <main>
      <JsonLd data={webpageSchema({ path: staticRoutes.dataSources, title, description })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={datasetSchema({
          name: "Global city intelligence source registry",
          description,
          path: staticRoutes.dataSources,
          dataYear: DATA_YEAR,
          sources: dataSources,
        })}
      />
      <PageHeader eyebrow="Source registry" intro={description} title={title} />
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbNav items={breadcrumbs} />

        <FactList
          facts={[
            { label: "Last updated", value: LAST_UPDATED },
            { label: "Data year", value: DATA_YEAR },
            { label: "Source policy", value: "Trusted institutions only" },
            { label: "Indexability", value: "Visible source blocks" },
          ]}
        />

        <section>
          <SectionHeading
            description="Each source is listed as crawlable text with a normal link. Future ingestion can attach exact dataset tables to the same source IDs."
            title="Trusted sources"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {dataSources.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            description="The table makes the source registry readable for users, crawlers, and answer engines."
            title="Source coverage table"
          />
          <div className="mt-6">
            <DataTable
              caption="Data source coverage table"
              rows={dataSources.map((source) => ({
                metric: source.organization,
                value: source.name,
                context: source.description,
              }))}
            />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-text-primary">
              Explanation
            </h2>
            <p className="mt-4 leading-7 text-text-secondary">
              The platform separates source identity from route content. Cities,
              countries, modules, and rankings reference source IDs, then pages
              render the matching source block in HTML. This keeps the data
              model scalable and makes source governance easier.
            </p>
            <p className="mt-4 leading-7 text-text-secondary">
              Structured indicators are directional and intended for
              orientation; they are not presented as official measured
              observations. Verified layers — such as country emergency
              contacts and healthcare access — are attributed to the official
              publishers listed here, and additional verified data is
              integrated continuously.
            </p>
          </article>
          <SourceBlock sources={dataSources} />
        </section>
      </div>
    </main>
  );
}
