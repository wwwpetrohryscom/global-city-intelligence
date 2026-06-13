import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllRegionalCollections,
  getRegionTypeLabel,
} from "@/lib/data/queries";
import { regionalCollectionBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { regionalCollectionRoute, staticRoutes } from "@/lib/seo/routes";
import {
  breadcrumbSchema,
  itemListSchema,
  webpageSchema,
} from "@/lib/seo/schema";
import type { RegionType } from "@/types";

const title = "Regional Discovery Collections: Nature & Weekend Regions";
const description =
  "Browse regional discovery collections — named natural regions (mountain ranges, coasts, lakes, river valleys, national parks, forests, islands, cross-border landscapes) that group nearby places and cities for local-first day and weekend planning. Geographic collections derived from existing data, not tourism rankings.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.regionalCollections,
});

// Display order for the region-type sections.
const REGION_TYPE_ORDER: RegionType[] = [
  "mountain_region",
  "coastal_region",
  "lake_region",
  "river_region",
  "national_park_region",
  "protected_landscape_region",
  "forest_region",
  "island_region",
  "cross_border_region",
  "weekend_escape_region",
];

export default function RegionalCollectionsIndexPage() {
  const collections = getAllRegionalCollections();
  const breadcrumbs = regionalCollectionBreadcrumbs();

  const totalCities = new Set(collections.flatMap((c) => c.cities)).size;
  const totalPlaces = new Set(collections.flatMap((c) => c.nearbyPlaces)).size;

  const byType = REGION_TYPE_ORDER.map((rt) => ({
    regionType: rt,
    label: getRegionTypeLabel(rt),
    items: collections
      .filter((c) => c.regionType === rt)
      .slice()
      .sort((a, b) => b.nearbyPlaces.length - a.nearbyPlaces.length),
  })).filter((group) => group.items.length > 0);

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: staticRoutes.regionalCollections,
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={itemListSchema({
          name: title,
          description,
          items: collections.map((c) => ({
            name: c.title,
            path: regionalCollectionRoute(c.slug),
          })),
        })}
      />

      <PageHeader
        eyebrow="Regional collections"
        intro={description}
        title={title}
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Collections
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {collections.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Region types
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {byType.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Cities linked
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {totalCities}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Nearby places linked
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {totalPlaces}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-12 py-12">
        <BreadcrumbNav items={breadcrumbs} />

        <p className="max-w-3xl text-sm leading-6 text-text-secondary">
          Collections are generated deterministically from city and nearby-place
          coordinates, nearby-place categories, and Wikidata-backed
          classifications. They answer &quot;where else nearby could I spend a
          day or a weekend?&quot; — they are not tourism rankings and use no
          popularity or visitor data. Data year {DATA_YEAR}; last updated{" "}
          {LAST_UPDATED}.
        </p>

        {byType.map((group) => (
          <section
            aria-labelledby={`group-${group.regionType}`}
            key={group.regionType}
          >
            <SectionHeading
              description={`${group.items.length} ${group.label.toLowerCase()} collections.`}
              title={group.label}
            />
            <h2 className="sr-only" id={`group-${group.regionType}`}>
              {group.label}
            </h2>
            <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {group.items.map((collection) => (
                <li key={collection.slug}>
                  <Card as="article" className="h-full">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      {`${group.label} · ${collection.nearbyPlaces.length} places · ${collection.cities.length} cities`}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-text-primary">
                      <Link
                        className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                        href={regionalCollectionRoute(collection.slug)}
                      >
                        {collection.title}
                      </Link>
                    </h3>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </main>
  );
}
