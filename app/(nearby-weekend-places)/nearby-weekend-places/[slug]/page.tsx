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
  getAllNearbyWeekendPlaceDetailPages,
  getCityBySlug,
  getCountryBySlug,
  getNearbyPlaceCategoryLabel,
  getNearbyPlaceFacts,
  getNearbyWeekendPlaceDetailPageBySlug,
  getSourcesByIds,
  hasArrivalPage,
  hasMovingToCityPage,
  hasNeighborhoodPlanningPage,
  hasSummerTravelPage,
  hasVisualCityGuidePage,
  hasWeekendTripPage,
} from "@/lib/data/queries";
import { createMetadata } from "@/lib/seo/metadata";
import {
  arrivalRoute,
  cityRoute,
  countryRoute,
  movingToCityRoute,
  nearbyWeekendPlaceRoute,
  neighborhoodPlanningRoute,
  staticRoutes,
  summerTravelRoute,
  visualCityGuideRoute,
  weekendTripRoute,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllNearbyWeekendPlaceDetailPages().map((place) => ({
    slug: place.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = getNearbyWeekendPlaceDetailPageBySlug(slug);
  if (!place) return {};
  const title = `${place.name}: Nearby Weekend Place to Research`;
  const country = getCountryBySlug(place.countrySlug);
  const focus = country ? country.name : "indexed city profiles";
  const description = `Use this source-backed nearby weekend place record for local-first planning near ${focus}, with verification status, official source link, Wikidata identity, visual context, planning tools, and source transparency.`;
  return createMetadata({
    title,
    description,
    path: nearbyWeekendPlaceRoute(place.slug),
  });
}

export default async function NearbyWeekendPlaceDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const place = getNearbyWeekendPlaceDetailPageBySlug(slug);
  if (!place) {
    notFound();
  }

  const country = getCountryBySlug(place.countrySlug);
  const connectedCities = place.connectedCitySlugs
    .map((s) => getCityBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const sources = getSourcesByIds(place.sourceIds);
  const categoryLabel = getNearbyPlaceCategoryLabel(place.category);
  const facts = getNearbyPlaceFacts(place.slug);

  const breadcrumbs = [
    { name: "Home", href: staticRoutes.home },
    { name: "Nearby weekend places", href: staticRoutes.nearbyWeekendPlaces },
    { name: place.name, href: nearbyWeekendPlaceRoute(place.slug) },
  ];

  const pageTitle = `${place.name}: Nearby Weekend Place to Research`;
  const focusName = country ? country.name : "indexed city profiles";
  const pageDescription = `Use this source-backed nearby weekend place record for local-first planning near ${focusName}, with verification status, official source link, Wikidata identity, visual context, planning tools, and source transparency.`;

  const sourcesList = sources.map((s) => s.name).join(", ");

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: nearbyWeekendPlaceRoute(place.slug),
          title: pageTitle,
          description: pageDescription,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHeader
        eyebrow="Nearby weekend place"
        intro={place.summary}
        title={pageTitle}
      >
        <dl className="grid gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Verification status
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              Verified source record
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Category
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {categoryLabel}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Country
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {country?.name ?? place.countrySlug}
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

        {place.image ? (
          <section
            aria-labelledby="detail-visual-heading"
            className="rounded-2xl border border-neutral-border bg-white shadow-sm overflow-hidden"
          >
            <h2 className="sr-only" id="detail-visual-heading">
              Visual context
            </h2>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={place.image.alt}
                className="block h-auto w-full object-cover"
                decoding="async"
                height={place.image.height}
                loading="lazy"
                sizes="(min-width: 1024px) 768px, 100vw"
                src={place.image.src}
                style={{
                  aspectRatio: `${place.image.width} / ${place.image.height}`,
                }}
                width={place.image.width}
              />
              <figcaption className="border-t border-neutral-border bg-surface-soft px-5 py-3 text-sm leading-6 text-text-secondary">
                Image:{" "}
                {place.image.authorUrl ? (
                  <a
                    className="underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                    href={place.image.authorUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {place.image.author}
                  </a>
                ) : (
                  place.image.author
                )}{" "}
                /{" "}
                <a
                  className="underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={place.image.sourceUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Wikimedia Commons file page
                </a>{" "}
                /{" "}
                {place.image.licenseUrl ? (
                  <a
                    className="underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                    href={place.image.licenseUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {place.image.license}
                  </a>
                ) : (
                  place.image.license
                )}
                . Visual context only — not evidence of current conditions,
                access, or weather.
              </figcaption>
            </figure>
          </section>
        ) : null}

        <section
          aria-labelledby="detail-overview-heading"
          className="rounded-2xl border border-neutral-border bg-surface-soft p-6"
        >
          <h2
            className="text-2xl font-semibold text-text-primary"
            id="detail-overview-heading"
          >
            Overview
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
            This is a source-backed nearby weekend place record connected to
            one or more indexed city profiles. It supports local-first weekend
            planning by linking a public destination — a park, heritage site,
            nature reserve, or other public place — to the city profiles that
            reference it, alongside an official source URL and a Wikidata
            identifier for identity.
          </p>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
            This page is not a route planner, not a ticket guide, not an
            events page, not a tourism ranking, and not a live availability
            source. Records do not publish exact distances, travel times,
            transport schedules, opening hours, ticket prices, restaurant or
            hotel recommendations, attraction rankings, or live access
            status. Verify access and current conditions with the official
            source linked below before departure.
          </p>
        </section>

        <section aria-labelledby="detail-cities-heading">
          <SectionHeading
            description="Use these indexed city profiles to plan from your origin city. Where each city has detailed surfaces (arrival, weekend-trip, summer-travel, visual-guide, moving-to), the secondary links open them; verify access, transport, weather, health, and safety details with official sources before departure."
            title="Connected cities"
          />
          <h2 className="sr-only" id="detail-cities-heading">
            Connected cities
          </h2>
          {connectedCities.length > 0 ? (
            <ul className="mt-6 grid gap-5 md:grid-cols-2">
              {connectedCities.map((connectedCity) => {
                const cityCountry = getCountryBySlug(connectedCity.countrySlug);
                return (
                  <li key={connectedCity.slug}>
                    <Card as="article" className="h-full">
                      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        {cityCountry ? cityCountry.name : "Indexed city"}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-text-primary">
                        <Link
                          className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                          href={cityRoute(connectedCity.slug)}
                        >
                          {`${connectedCity.name} city profile`}
                        </Link>
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        {hasArrivalPage(connectedCity.slug) ? (
                          <Link
                            className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                            href={arrivalRoute(connectedCity.slug)}
                          >
                            Arrival planning
                          </Link>
                        ) : null}
                        {hasWeekendTripPage(connectedCity.slug) ? (
                          <Link
                            className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                            href={weekendTripRoute(connectedCity.slug)}
                          >
                            Weekend trip guide
                          </Link>
                        ) : null}
                        {hasSummerTravelPage(connectedCity.slug) ? (
                          <Link
                            className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                            href={summerTravelRoute(connectedCity.slug)}
                          >
                            Summer travel guide
                          </Link>
                        ) : null}
                        {hasVisualCityGuidePage(connectedCity.slug) ? (
                          <Link
                            className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                            href={visualCityGuideRoute(connectedCity.slug)}
                          >
                            Visual city guide
                          </Link>
                        ) : null}
                        {hasNeighborhoodPlanningPage(connectedCity.slug) ? (
                          <Link
                            className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                            href={neighborhoodPlanningRoute(connectedCity.slug)}
                          >
                            Neighborhood planning
                          </Link>
                        ) : null}
                        {hasMovingToCityPage(connectedCity.slug) ? (
                          <Link
                            className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                            href={movingToCityRoute(connectedCity.slug)}
                          >
                            Moving-to guide
                          </Link>
                        ) : null}
                        {cityCountry ? (
                          <Link
                            className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                            href={countryRoute(cityCountry.slug)}
                          >
                            {`${cityCountry.name} country profile`}
                          </Link>
                        ) : null}
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-6 text-base leading-7 text-text-secondary">
              No connected city profiles are linked to this record yet.
            </p>
          )}
        </section>

        <section
          aria-labelledby="detail-sources-heading"
          className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm"
        >
          <h2
            className="text-2xl font-semibold text-text-primary"
            id="detail-sources-heading"
          >
            Sources and identity
          </h2>
          <dl className="mt-5 grid gap-4 md:grid-cols-2">
            {place.wikidataId ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Wikidata identity
                </dt>
                <dd className="mt-1 text-base text-text-primary">
                  <Link
                    className="underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                    href={`https://www.wikidata.org/wiki/${place.wikidataId}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {place.wikidataId}
                  </Link>
                </dd>
              </div>
            ) : null}
            {place.officialUrl ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Official source
                </dt>
                <dd className="mt-1 break-words text-base text-text-primary">
                  <Link
                    className="underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                    href={place.officialUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {place.officialUrl}
                  </Link>
                </dd>
              </div>
            ) : null}
            {place.commonsCategory ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Commons category
                </dt>
                <dd className="mt-1 break-words text-base text-text-primary">
                  <Link
                    className="underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                    href={`https://commons.wikimedia.org/wiki/Category:${encodeURIComponent(
                      place.commonsCategory,
                    )}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {place.commonsCategory}
                  </Link>
                </dd>
              </div>
            ) : null}
          </dl>
          {sources.length > 0 ? (
            <p className="mt-5 text-sm leading-6 text-text-secondary">
              Source registry entries cited on this record: {sourcesList}.
            </p>
          ) : null}
        </section>

        {facts ? (
          <section
            aria-labelledby="detail-facts-heading"
            className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm"
          >
            <h2
              className="text-2xl font-semibold text-text-primary"
              id="detail-facts-heading"
            >
              Reference data
            </h2>
            <dl className="mt-5 grid gap-4 md:grid-cols-3">
              {facts.designation ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Designation
                  </dt>
                  <dd className="mt-1 text-base text-text-primary">
                    {facts.designation}
                  </dd>
                </div>
              ) : null}
              {facts.iucnCategory ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    IUCN category
                  </dt>
                  <dd className="mt-1 text-base text-text-primary">
                    {facts.iucnCategory}
                  </dd>
                </div>
              ) : null}
              {facts.established ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Established
                  </dt>
                  <dd className="mt-1 text-base text-text-primary">
                    {facts.established}
                  </dd>
                </div>
              ) : null}
            </dl>
            <p className="mt-5 text-sm leading-6 text-text-secondary">
              Reference attributes from the place&apos;s Wikidata entity
              (designation, IUCN protected-area category, year established).
              Verify current details with the official source before
              departure.
            </p>
          </section>
        ) : null}

        <section
          aria-labelledby="detail-verify-heading"
          className="rounded-2xl bg-surface-soft p-6"
        >
          <h2
            className="text-2xl font-semibold text-text-primary"
            id="detail-verify-heading"
          >
            What to verify before departure
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
            Records do not publish exact distances, travel times, transport
            schedules, opening hours, ticket prices, restaurant or hotel
            recommendations, attraction rankings, or live access status. The
            following items should be verified directly with the official
            source linked above and with other trusted current sources before
            travel.
          </p>
          <ul className="mt-4 grid list-disc gap-2 pl-6 text-base leading-7 text-text-secondary">
            <li>
              Access and route details from official transport and source
              pages
            </li>
            <li>Current weather from a trusted current source</li>
            <li>Seasonal status or closures from the official source</li>
            <li>Opening or access status where relevant</li>
            <li>Costs or booking needs where relevant</li>
            <li>Health and safety context from official sources</li>
          </ul>
        </section>

        <section aria-labelledby="detail-tools-heading">
          <SectionHeading
            description="Planning surfaces that take user-entered estimates and structured city and country context instead of publishing fixed prices, schedules, or rankings."
            title="Planning tools"
          />
          <h2 className="sr-only" id="detail-tools-heading">
            Planning tools
          </h2>
          <ul className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.travelBudgetCalculator}
              >
                Travel budget calculator
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.costOfLivingCalculator}
              >
                Cost of living calculator
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.weekendTrips}
              >
                Weekend trip guides
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.nearbyWeekendPlaces}
              >
                Nearby weekend places directory
              </Link>
            </li>
          </ul>
        </section>

        <section aria-labelledby="detail-continue-heading">
          <SectionHeading
            description="Pair this nearby weekend place record with the platform's other planning surfaces: city and country profiles, comparisons, arrival planning, weekend-trip and summer-travel guides, visual orientation, moving-to research, and the calculators that take user-entered estimates instead of publishing fixed prices."
            title="Continue exploring"
          />
          <h2 className="sr-only" id="detail-continue-heading">
            Continue exploring
          </h2>
          <ul className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.nearbyWeekendPlaces}
              >
                Nearby weekend places
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.weekendTrips}
              >
                Weekend trip guides
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.summerTravel}
              >
                Summer travel guides
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.visualGuides}
              >
                Visual city guides
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.arrival}
              >
                Arrival planning guides
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.movingTo}
              >
                Moving-to guides
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.cities}
              >
                City profiles
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.countries}
              >
                Country profiles
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.compare}
              >
                City comparisons
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.travelBudgetCalculator}
              >
                Travel budget calculator
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.costOfLivingCalculator}
              >
                Cost of living calculator
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.methodology}
              >
                Scoring methodology
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.dataSources}
              >
                Data sources registry
              </Link>
            </li>
          </ul>
        </section>
      </Container>
    </main>
  );
}
