import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllRegionalCollections,
  getCityBySlug,
  getCountryBySlug,
  getNearbyPlaceCategoryLabel,
  getNearbyWeekendPlaceBySlug,
  getRegionTypeLabel,
  getRegionalCollectionBySlug,
  getRelatedRegionalCollections,
  hasNearbyWeekendPlaceDetailPage,
} from "@/lib/data/queries";
import { regionalCollectionBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import {
  cityRoute,
  nearbyWeekendPlaceRoute,
  regionalCollectionRoute,
  staticRoutes,
} from "@/lib/seo/routes";
import {
  breadcrumbSchema,
  itemListSchema,
  webpageSchema,
} from "@/lib/seo/schema";
import type { RegionalCollection } from "@/types";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllRegionalCollections().map((collection) => ({
    slug: collection.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getRegionalCollectionBySlug(slug);
  if (!collection) return {};
  // Overflow collections (slug "...-2") share a base title with the original; tag the
  // page title with the part number so every <title> stays unique.
  const overflow = slug.match(/-(\d+)$/);
  const partTag = overflow ? ` (Part ${overflow[1]})` : "";
  return createMetadata({
    title: `${collection.title}${partTag}: Regional Discovery Collection`,
    description: collection.description,
    path: regionalCollectionRoute(collection.slug),
  });
}

export default async function RegionalCollectionDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const collection = getRegionalCollectionBySlug(slug);
  if (!collection) {
    notFound();
  }

  const breadcrumbs = regionalCollectionBreadcrumbs(collection.slug);
  const regionLabel = getRegionTypeLabel(collection.regionType);
  const pageTitle = `${collection.title}: Regional Discovery Collection`;

  const cities = collection.cities
    .map((s) => getCityBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const places = collection.nearbyPlaces
    .map((s) => {
      const place = getNearbyWeekendPlaceBySlug(s);
      return place
        ? { place, hasDetail: hasNearbyWeekendPlaceDetailPage(s) }
        : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  // Related collections (same region type / shared places / shared cities),
  // precomputed deterministically in the data layer.
  const related: RegionalCollection[] = getRelatedRegionalCollections(collection.slug);

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: regionalCollectionRoute(collection.slug),
          title: pageTitle,
          description: collection.description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={itemListSchema({
          name: `${collection.title} — nearby places`,
          description: collection.description,
          items: places.map((p) => ({
            name: p.place.name,
            path: p.hasDetail
              ? nearbyWeekendPlaceRoute(p.place.slug)
              : staticRoutes.nearbyWeekendPlaces,
          })),
        })}
      />

      <PageHeader
        eyebrow={`Regional collection · ${regionLabel}`}
        intro={collection.description}
        title={collection.title}
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Region type
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {regionLabel}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Cities
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {cities.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Nearby places
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {places.length}
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
        </dl>
      </PageHeader>

      <Container className="space-y-12 py-12">
        <BreadcrumbNav items={breadcrumbs} />

        <section aria-labelledby="overview-heading">
          <SectionHeading
            description="How this regional collection was assembled."
            title="Overview"
          />
          <h2 className="sr-only" id="overview-heading">
            Overview
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-text-secondary">
            {collection.description}
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-text-secondary">
            This is a geographic discovery collection generated deterministically
            from existing city and nearby-place data ({DATA_YEAR}). It is not a
            tourism ranking and uses no popularity or visitor data. Verify
            access, transport, weather, health, and safety with official sources
            before visiting.
          </p>
        </section>

        <section aria-labelledby="cities-heading">
          <SectionHeading
            description="Indexed city profiles within this region — useful starting points for local-first planning."
            title="Cities in this region"
          />
          <h2 className="sr-only" id="cities-heading">
            Cities in this region
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cities.map((city) => {
              const country = getCountryBySlug(city.countrySlug);
              return (
                <li key={city.slug}>
                  <Card as="article" className="h-full">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      {country ? country.name : "Indexed city"}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-text-primary">
                      <Link
                        className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                        href={cityRoute(city.slug)}
                      >
                        {`${city.name} city profile`}
                      </Link>
                    </h3>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="places-heading">
          <SectionHeading
            description="Nearby nature and recreation places grouped into this region. Linked places open their source-backed detail record."
            title="Nearby places in this region"
          />
          <h2 className="sr-only" id="places-heading">
            Nearby places in this region
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {places.map(({ place, hasDetail }) => {
              const country = getCountryBySlug(place.countrySlug);
              return (
                <li key={place.slug}>
                  <Card as="article" className="h-full">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      {`${getNearbyPlaceCategoryLabel(place.category)}${country ? ` · ${country.name}` : ""}`}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-text-primary">
                      {hasDetail ? (
                        <Link
                          className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                          href={nearbyWeekendPlaceRoute(place.slug)}
                        >
                          {place.name}
                        </Link>
                      ) : (
                        place.name
                      )}
                    </h3>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>

        {related.length > 0 ? (
          <section aria-labelledby="related-heading">
            <SectionHeading
              description="Other regional collections that share cities with this region."
              title="Related collections"
            />
            <h2 className="sr-only" id="related-heading">
              Related collections
            </h2>
            <ul className="mt-6 grid gap-3 text-sm md:grid-cols-2">
              {related.map((rc) => (
                <li key={rc.slug}>
                  <Link
                    className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                    href={regionalCollectionRoute(rc.slug)}
                  >
                    {`${rc.title} (${getRegionTypeLabel(rc.regionType)})`}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="explore-heading">
          <SectionHeading
            description="Continue exploring regional discovery."
            title="Explore more"
          />
          <h2 className="sr-only" id="explore-heading">
            Explore more
          </h2>
          <ul className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            <li>
              <Link
                className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                href={staticRoutes.regionalCollections}
              >
                All regional collections
              </Link>
            </li>
            <li>
              <Link
                className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                href={staticRoutes.nearbyWeekendPlaces}
              >
                All nearby weekend places
              </Link>
            </li>
          </ul>
        </section>
      </Container>
    </main>
  );
}
