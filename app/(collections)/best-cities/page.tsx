import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { HubNav } from "@/components/navigation/HubNav";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/Card";
import { FactList } from "@/components/ui/fact-list";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllCollections,
  getCitiesForCollection,
  getCollectionIntentLabel,
} from "@/lib/data/queries";
import { collectionBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import {
  getCollectionUrl,
  staticRoutes,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

const title = "Best Cities Collections: City Intelligence Shortlists";
const description =
  "Browse curated city collections — comparison-oriented shortlists across remote work, family life, startups, clean air, and public transport. Each collection is a useful set of cities to compare, not an official ranking.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.collections,
});

export default function CollectionsIndexPage() {
  const collections = getAllCollections();
  const breadcrumbs = collectionBreadcrumbs();

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: staticRoutes.collections,
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHeader eyebrow="Best Cities" intro={description} title={title}>
        <dl className="grid gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Curated collections
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {collections.length}
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
        <HubNav activeHref={staticRoutes.collections} />

        <FactList
          facts={[
            {
              label: "Selection style",
              value: "Comparison-oriented shortlists",
            },
            {
              label: "Cities per collection",
              value: "Curated, typically 8–15",
            },
            {
              label: "Indexing",
              value: "Allowed in robots",
            },
            {
              label: "Ranking claim",
              value: "Not an official ranking",
            },
          ]}
        />

        <section>
          <SectionHeading
            description="Each collection links to a dedicated landing page with criteria, comparison table, methodology note, and city profiles. Collections are deliberately curated rather than algorithmically ranked."
            title="All curated city collections"
          />
          <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection) => {
              const cities = getCitiesForCollection(collection.slug);
              return (
                <li key={collection.slug}>
                  <Card as="article" interactive>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      {getCollectionIntentLabel(collection.intent)}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-text-primary">
                      <Link
                        className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                        href={getCollectionUrl(collection.slug)}
                      >
                        {collection.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                      {collection.description}
                    </p>
                    <p className="mt-4 text-xs text-text-muted">
                      {cities.length} cities / updated {collection.updatedDate}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-neutral-border bg-surface-soft p-6">
          <h2 className="text-2xl font-semibold text-text-primary">
            How to read collection pages
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
            Each collection page surfaces a shortlist of cities worth comparing,
            structured intelligence criteria, a real HTML comparison table, and
            transparent methodology notes. Collections do not claim that a city
            is objectively best; they are curated entry points into the
            structured city intelligence platform.
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
                href={staticRoutes.compare}
              >
                City-vs-city comparisons
              </Link>
              <span className="text-text-secondary">
                {" "}
                — pairwise comparison pages.
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
                — structured rankings using the underlying data.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.methodology}
              >
                Methodology
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
          </ul>
        </section>
      </Container>
    </main>
  );
}
