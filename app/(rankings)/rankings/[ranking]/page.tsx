import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinkCard } from "@/components/cards/link-card";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { RankingTable } from "@/components/tables/ranking-table";
import { FactList } from "@/components/ui/fact-list";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getRankingBySlug,
  getRankingEntriesWithCities,
  getRankings,
} from "@/lib/data/queries";
import { getSourcesByIds } from "@/lib/data/sources";
import { rankingBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { cityRoute, rankingRoute } from "@/lib/seo/routes";
import { breadcrumbSchema, datasetSchema, webpageSchema } from "@/lib/seo/schema";

type PageProps = {
  params: Promise<{ ranking: string }>;
};

export function generateStaticParams() {
  return getRankings().map((ranking) => ({ ranking: ranking.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ranking: rankingSlug } = await params;
  const ranking = getRankingBySlug(rankingSlug);

  if (!ranking) {
    return {};
  }

  return createMetadata({
    title: ranking.title,
    description: ranking.description,
    path: rankingRoute(ranking.slug),
    type: "article",
  });
}

export default async function RankingDetailPage({ params }: PageProps) {
  const { ranking: rankingSlug } = await params;
  const ranking = getRankingBySlug(rankingSlug);

  if (!ranking) {
    notFound();
  }

  const entries = getRankingEntriesWithCities(ranking.slug);
  const breadcrumbs = rankingBreadcrumbs(ranking.slug);
  const sources = getSourcesByIds(ranking.sources);

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: rankingRoute(ranking.slug),
          title: ranking.title,
          description: ranking.description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={datasetSchema({
          name: `${ranking.title} dataset`,
          description: ranking.description,
          path: rankingRoute(ranking.slug),
          dataYear: ranking.dataYear,
          sources,
        })}
      />
      <PageHeader eyebrow="Ranking" intro={ranking.description} title={ranking.title} />
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbNav items={breadcrumbs} />
        <FactList
          facts={[
            { label: "Last updated", value: ranking.lastUpdated },
            { label: "Data year", value: ranking.dataYear },
            { label: "Cities ranked", value: String(entries.length) },
            { label: "Ranking type", value: ranking.shortTitle },
          ]}
        />

        <section>
          <SectionHeading
            description="Ranking rows link directly to city profile pages, keeping comparisons useful for users and crawlable for search engines."
            title="Ranking table"
          />
          <div className="mt-6">
            <RankingTable caption={`${ranking.title} table`} entries={entries} />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-text-primary">
              Explanation
            </h2>
            <p className="mt-4 leading-7 text-text-secondary">
              {ranking.methodology}
            </p>
            <p className="mt-4 leading-7 text-text-secondary">
              Rankings are directional intelligence, not official government
              scores. Each entry links to a city profile where users can inspect
              module-level context, source blocks, and data tables.
            </p>
          </article>
          <SourceBlock sources={sources} />
        </section>

        <section>
          <SectionHeading
            description="Continue from the ranking into city profiles. The links below are normal server-rendered anchors."
            title="City pages in this ranking"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {entries.map((entry) => (
              <LinkCard
                description={entry.note}
                href={cityRoute(entry.city.slug)}
                key={entry.city.slug}
                title={`#${entry.rank} ${entry.city.name}`}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
