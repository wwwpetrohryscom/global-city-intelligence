import type { Metadata } from "next";
import { LinkCard } from "@/components/cards/link-card";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { DataTable } from "@/components/tables/DataTable";
import { FactList } from "@/components/ui/fact-list";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import { getRankings } from "@/lib/data/queries";
import { getSourcesByIds } from "@/lib/data/sources";
import { rankingBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { rankingRoute, staticRoutes } from "@/lib/seo/routes";
import { breadcrumbSchema, datasetSchema, webpageSchema } from "@/lib/seo/schema";

const title = "City Intelligence Rankings";
const description =
  "Crawlable rankings for global city intelligence, clean air, energy readiness, and affordability balance.";
const breadcrumbs = rankingBreadcrumbs();

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.rankings,
});

export default function RankingsPage() {
  const rankings = getRankings();
  const sources = getSourcesByIds([
    "un-habitat",
    "who-air",
    "nasa-power",
    "ipcc-urban",
  ]);

  return (
    <main>
      <JsonLd data={webpageSchema({ path: staticRoutes.rankings, title, description })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={datasetSchema({
          name: "City intelligence rankings index",
          description,
          path: staticRoutes.rankings,
          dataYear: DATA_YEAR,
          sources,
        })}
      />
      <PageHeader eyebrow="Rankings" intro={description} title={title} />
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbNav items={breadcrumbs} />
        <FactList
          facts={[
            { label: "Last updated", value: LAST_UPDATED },
            { label: "Data year", value: DATA_YEAR },
            { label: "Ranking pages", value: String(rankings.length) },
            { label: "Indexing", value: "Allowed in robots" },
          ]}
        />

        <section>
          <SectionHeading
            description="Each ranking has its own URL, unique metadata, visible explanation, source block, and table of city links."
            title="Available rankings"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {rankings.map((ranking) => (
              <LinkCard
                description={ranking.description}
                href={rankingRoute(ranking.slug)}
                key={ranking.slug}
                title={ranking.title}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            description="This table gives crawlers and users a compact overview of the ranking cluster."
            title="Ranking coverage table"
          />
          <div className="mt-6">
            <DataTable
              caption="Ranking coverage table"
              rows={rankings.map((ranking) => ({
                metric: ranking.shortTitle,
                value: `${ranking.entries.length} cities`,
                context: ranking.description,
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
              Ranking pages connect the city graph. They help users compare
              options quickly while creating crawlable internal links back to
              the individual city profiles and module pages.
            </p>
          </article>
          <SourceBlock sources={sources} />
        </section>
      </div>
    </main>
  );
}
