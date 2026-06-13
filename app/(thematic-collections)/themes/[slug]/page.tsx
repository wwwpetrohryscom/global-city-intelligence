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
  getAllThematicCollections,
  getCityBySlug,
  getCountryBySlug,
  getNearbyPlaceCategoryLabel,
  getNearbyWeekendPlaceBySlug,
  getRelatedThematicCollections,
  getThemeLabel,
  getThematicCollectionBySlug,
  hasNearbyWeekendPlaceDetailPage,
} from "@/lib/data/queries";
import { thematicCollectionBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import {
  cityRoute,
  nearbyWeekendPlaceRoute,
  staticRoutes,
  thematicCollectionRoute,
  weekendTripRoute,
  visualCityGuideRoute,
} from "@/lib/seo/routes";
import {
  breadcrumbSchema,
  itemListSchema,
  webpageSchema,
} from "@/lib/seo/schema";
import type { ThematicCollection } from "@/types";

export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllThematicCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getThematicCollectionBySlug(slug);
  if (!collection) return {};
  return createMetadata({
    title: `${collection.title}: Thematic Discovery Collection`,
    description: collection.description,
    path: thematicCollectionRoute(collection.slug),
  });
}

export default async function ThematicCollectionDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const collection = getThematicCollectionBySlug(slug);
  if (!collection) {
    notFound();
  }

  const breadcrumbs = thematicCollectionBreadcrumbs(collection.slug);
  const themeLabel = getThemeLabel(collection.themeType);
  const pageTitle = `${collection.title}: Thematic Discovery Collection`;

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
  const related: ThematicCollection[] = getRelatedThematicCollections(
    collection.slug,
  );

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: thematicCollectionRoute(collection.slug),
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
        eyebrow={`Theme · ${themeLabel}`}
        intro={collection.description}
        title={collection.title}
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Theme
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {themeLabel}
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
              Cities
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {cities.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Photo-eligible places
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {collection.photoEligiblePlaceCount} ({collection.officialPhotoCount}{" "}
              official)
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-12 py-12">
        <BreadcrumbNav items={breadcrumbs} />

        <section aria-labelledby="overview-heading">
          <SectionHeading
            description="How this theme collection was assembled."
            title="Overview"
          />
          <h2 className="sr-only" id="overview-heading">
            Overview
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-text-secondary">
            {collection.description}
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-text-secondary">
            Generated deterministically from existing place categories and
            Wikidata classifications ({DATA_YEAR}); not a tourism ranking. Photo
            counters are computed statically from existing community-photo
            records. Verify access, transport, weather, health, and safety with
            official sources before visiting. Last updated {LAST_UPDATED}.
          </p>
        </section>

        <section aria-labelledby="places-heading">
          <SectionHeading
            description="Nearby nature and recreation places grouped under this theme. Linked places open their source-backed detail record."
            title="Places in this theme"
          />
          <h2 className="sr-only" id="places-heading">
            Places in this theme
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

        <section aria-labelledby="cities-heading">
          <SectionHeading
            description="Indexed city profiles within this theme — useful starting points for local-first planning. Weekend-trip and visual-guide links open where available."
            title="Cities in this theme"
          />
          <h2 className="sr-only" id="cities-heading">
            Cities in this theme
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cities.map((city) => {
              const country = getCountryBySlug(city.countrySlug);
              const hasWeekend = collection.weekendTrips.includes(city.slug);
              const hasVisual = collection.visualGuides.includes(city.slug);
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
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      {hasWeekend ? (
                        <Link
                          className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                          href={weekendTripRoute(city.slug)}
                        >
                          Weekend trip guide
                        </Link>
                      ) : null}
                      {hasVisual ? (
                        <Link
                          className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                          href={visualCityGuideRoute(city.slug)}
                        >
                          Visual city guide
                        </Link>
                      ) : null}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>

        {related.length > 0 ? (
          <section aria-labelledby="related-heading">
            <SectionHeading
              description="Other thematic collections related by theme, shared places, or shared cities."
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
                    href={thematicCollectionRoute(rc.slug)}
                  >
                    {`${rc.title} (${getThemeLabel(rc.themeType)})`}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="explore-heading">
          <SectionHeading
            description="Continue exploring."
            title="Explore more"
          />
          <h2 className="sr-only" id="explore-heading">
            Explore more
          </h2>
          <ul className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            <li>
              <Link
                className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                href={staticRoutes.thematicCollections}
              >
                All themes
              </Link>
            </li>
            <li>
              <Link
                className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                href={staticRoutes.regionalCollections}
              >
                Regional collections
              </Link>
            </li>
          </ul>
        </section>
      </Container>
    </main>
  );
}
