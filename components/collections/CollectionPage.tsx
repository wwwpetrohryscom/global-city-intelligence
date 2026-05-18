import Link from "next/link";
import { CityCollectionCard } from "@/components/collections/CityCollectionCard";
import { CityCollectionTable } from "@/components/collections/CityCollectionTable";
import { CollectionCriteria } from "@/components/collections/CollectionCriteria";
import { RelatedCollections } from "@/components/collections/RelatedCollections";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { Card } from "@/components/ui/Card";
import { FactList } from "@/components/ui/fact-list";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getAllCityIntents,
  getCitiesForCollection,
  getCityIntentPage,
  getCollectionIntentLabel,
  getRelatedCollections,
} from "@/lib/data/queries";
import { getSourcesByIds } from "@/lib/data/sources";
import { collectionBreadcrumbs } from "@/lib/seo/breadcrumbs";
import {
  absoluteUrl,
  cityRoute,
  getCityIntentUrl,
  getCollectionUrl,
  staticRoutes,
} from "@/lib/seo/routes";
import { breadcrumbSchema, datasetSchema, webpageSchema } from "@/lib/seo/schema";
import type { ReactNode } from "react";
import type { CityCollection } from "@/types";

interface CollectionPageProps {
  collection: CityCollection;
  comparisonNotes: Record<string, string>;
  /**
   * Optional server-rendered slot rendered after the methodology
   * note. Used by individual collection pages (e.g. clean-air) to
   * surface dataset coverage without altering the shared layout.
   */
  additionalSection?: ReactNode;
}

export function CollectionPage({
  collection,
  comparisonNotes,
  additionalSection,
}: CollectionPageProps) {
  const cities = getCitiesForCollection(collection.slug);
  const related = getRelatedCollections(collection.slug);
  const sources = getSourcesByIds(collection.sourceIds);
  const breadcrumbs = collectionBreadcrumbs(collection.slug);
  const collectionPath = getCollectionUrl(collection.slug);

  const matchingIntent = getAllCityIntents().find(
    (intent) => intent.relatedCollectionSlug === collection.slug,
  );
  const intentGuidesForCollection = matchingIntent
    ? cities
        .map((city) => ({
          city,
          page: getCityIntentPage(city.slug, matchingIntent.slug),
        }))
        .filter(
          (entry): entry is { city: typeof entry.city; page: NonNullable<typeof entry.page> } =>
            Boolean(entry.page),
        )
    : [];

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${collection.shortTitle} — curated city collection`,
    description:
      "A curated, comparison-oriented list of cities. Not a ranked or scored ordering.",
    numberOfItems: cities.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    url: absoluteUrl(collectionPath),
    itemListElement: cities.map((city) => ({
      "@type": "ListItem",
      name: city.name,
      url: absoluteUrl(cityRoute(city.slug)),
    })),
  };

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: collectionPath,
          title: collection.title,
          description: collection.description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={datasetSchema({
          name: `${collection.shortTitle} city collection dataset`,
          description: collection.description,
          path: collectionPath,
          dataYear: collection.dataYear,
          sources,
        })}
      />
      <JsonLd data={itemListSchema} />

      <PageHeader
        eyebrow={`Best Cities / ${getCollectionIntentLabel(collection.intent)}`}
        intro={collection.intro}
        title={collection.title}
      >
        <dl className="grid gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Cities in this collection
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {cities.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Last updated
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {collection.updatedDate}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {collection.dataYear}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-14 py-12">
        <BreadcrumbNav items={breadcrumbs} />

        <FactList
          facts={[
            {
              label: "Selection style",
              value: "Curated shortlist (not a scored ranking)",
            },
            {
              label: "Sources referenced",
              value: `${sources.length} structured references`,
            },
            {
              label: "Indexing",
              value: "Allowed in robots",
            },
            {
              label: "Comparison aim",
              value: "Useful cities to compare for orientation",
            },
          ]}
        />

        <section>
          <SectionHeading
            description="Each criterion explains why a category matters and points to the structured city intelligence behind the comparison. The collection is not a scored ranking."
            title="Selection criteria"
          />
          <div className="mt-6">
            <CollectionCriteria criteria={collection.criteria} />
          </div>
        </section>

        <section>
          <SectionHeading
            description="The shortlist below is a curated set of cities worth comparing. Order is not a ranking. Open any city profile to see structured intelligence and verified utility layers where available."
            title="City intelligence shortlist"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cities.map((city) => (
              <CityCollectionCard
                city={city}
                key={city.slug}
                note={comparisonNotes[city.slug]}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            description="A real HTML comparison table for crawlers and users. Each row links into a city profile and surfaces which verified utility layers exist."
            title="Comparison table"
          />
          <div className="mt-6">
            <CityCollectionTable
              caption={`Comparison table for ${collection.shortTitle.toLowerCase()} collection`}
              cities={cities}
              comparisonNotes={comparisonNotes}
            />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Card as="article" className="p-6">
            <h2 className="text-2xl font-semibold text-text-primary">
              Methodology note
            </h2>
            <p className="mt-4 leading-7 text-text-secondary">
              {collection.methodologyNote}
            </p>
            <p className="mt-4 leading-7 text-text-secondary">
              The page is designed for comparison, not as an official ranking.
              Where verified city-level data is unavailable, the platform shows
              transparent fallback states rather than fabricated numbers. For
              critical decisions, always verify through the linked official
              sources.
            </p>
            <p className="mt-5 text-sm leading-6 text-text-secondary">
              For more on how scoring and data tables work across the platform,
              read the{" "}
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.methodology}
              >
                scoring methodology
              </Link>{" "}
              or browse the{" "}
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.dataSources}
              >
                data sources registry
              </Link>
              .
            </p>
          </Card>
          <SourceBlock sources={sources} />
        </section>

        {additionalSection}

        <section>
          <SectionHeading
            description="Continue from this collection into broader navigation paths or other comparison-oriented collections."
            title="Where to go next"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <NextLinkCard
              description="Browse every indexed city profile for direct comparison."
              href={staticRoutes.cities}
              title="All city profiles"
            />
            <NextLinkCard
              description="Open the country directory for national context behind each city."
              href={staticRoutes.countries}
              title="Country directory"
            />
            <NextLinkCard
              description="Compare structured indicators through curated city-vs-city comparison pages."
              href={staticRoutes.compare}
              title="City comparison directory"
            />
            <NextLinkCard
              description="See structured rankings built from the same typed data layer."
              href={staticRoutes.rankings}
              title="City intelligence rankings"
            />
            <NextLinkCard
              description="Read how indicators are constructed and interpreted."
              href={staticRoutes.methodology}
              title="Scoring methodology"
            />
            <NextLinkCard
              description="See the official sources behind verified utility layers."
              href={staticRoutes.dataSources}
              title="Data sources registry"
            />
          </div>
        </section>

        {matchingIntent && intentGuidesForCollection.length > 0 ? (
          <section aria-labelledby="related-intent-guides-heading">
            <SectionHeading
              description={`Practical ${matchingIntent.shortTitle.toLowerCase()} intent guides for cities listed in this collection. Each guide is a comparison-oriented view, not an official ranking.`}
              title={`${matchingIntent.shortTitle} intent guides for these cities`}
            />
            <h2 className="sr-only" id="related-intent-guides-heading">
              {matchingIntent.shortTitle} intent guides for these cities
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {intentGuidesForCollection.map(({ city, page }) => (
                <li key={`${city.slug}-${page.intentSlug}`}>
                  <Card as="article" className="h-full" interactive>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      {matchingIntent.shortTitle}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-text-primary">
                      <Link
                        className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                        href={getCityIntentUrl(page.citySlug, page.intentSlug)}
                      >
                        {city.name} for {matchingIntent.shortTitle}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                      {page.summary}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <SectionHeading
            description="Other curated city collections you can compare alongside this page."
            title="Related collections"
          />
          <div className="mt-6">
            <RelatedCollections collections={related} />
          </div>
        </section>
      </Container>
    </main>
  );
}

function NextLinkCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Card as="article" interactive>
      <h3 className="text-base font-semibold text-text-primary">
        <Link
          className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
          href={href}
        >
          {title}
        </Link>
      </h3>
      <p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>
    </Card>
  );
}
