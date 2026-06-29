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
  getAllCitiesWithNearbyWeekendPlaces,
  getCityBySlug,
  getCountryBySlug,
  getNearbyPlaceCategoryLabel,
  getNearbyWeekendPlacesForCity,
  hasArrivalPage,
  hasMovingToCityPage,
  hasNearbyWeekendPlaceDetailPage,
  hasNearbyWeekendPlacesCityPage,
  hasNeighborhoodPlanningPage,
  hasSummerTravelPage,
  hasVisualCityGuidePage,
  hasWeekendTripPage,
} from "@/lib/data/queries";
import { createMetadata } from "@/lib/seo/metadata";
import { cityTitleName } from "@/lib/seo/city-title";
import {
  absoluteUrl,
  arrivalRoute,
  cityRoute,
  countryRoute,
  movingToCityRoute,
  nearbyWeekendPlaceRoute,
  nearbyWeekendPlacesCityRoute,
  neighborhoodPlanningRoute,
  staticRoutes,
  summerTravelRoute,
  visualCityGuideRoute,
  weekendTripRoute,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return getAllCitiesWithNearbyWeekendPlaces().map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city || !hasNearbyWeekendPlacesCityPage(citySlug)) {
    return {};
  }
  const title = `Nearby Weekend Places from ${cityTitleName(city)}, ${city.countryName}`;
  const description = `Research source-backed nearby weekend places connected to ${city.name} for local-first short breaks, with verification status, official source links, Wikidata identity, visual context, planning tools, and source transparency.`;
  return createMetadata({
    title,
    description,
    path: nearbyWeekendPlacesCityRoute(city.slug),
  });
}

const STATUS_LABEL = {
  verified: "Verified source record",
  partial: "Partially verified source record",
  needs_review: "Pending detailed verification",
} as const;

export default async function NearbyWeekendPlacesCityPage({
  params,
}: PageProps) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city || !hasNearbyWeekendPlacesCityPage(citySlug)) {
    notFound();
  }

  const country = getCountryBySlug(city.countrySlug);
  const places = [...getNearbyWeekendPlacesForCity(citySlug)].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const verifiedCount = places.filter(
    (place) => place.verificationStatus === "verified",
  ).length;
  const partialCount = places.filter(
    (place) => place.verificationStatus === "partial",
  ).length;
  const needsReviewCount = places.filter(
    (place) => place.verificationStatus === "needs_review",
  ).length;

  const breadcrumbs = [
    { name: "Home", href: staticRoutes.home },
    { name: "Cities", href: staticRoutes.cities },
    { name: city.name, href: cityRoute(city.slug) },
    {
      name: "Nearby weekend places",
      href: nearbyWeekendPlacesCityRoute(city.slug),
    },
  ];

  const title = `Nearby Weekend Places from ${cityTitleName(city)}, ${city.countryName}`;
  const description = `Research source-backed nearby weekend places connected to ${city.name} for local-first short breaks, with verification status, official source links, Wikidata identity, visual context, planning tools, and source transparency.`;

  const introParagraph = `Research source-backed public places within weekend reach of ${city.name}. The records on this page are planning candidates — not a route planner, not a tourism ranking, not a live schedule, and not a price guide. Verify access, transport, weather, opening status, and seasonal conditions with the official source linked on each record before departure.`;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description,
    url: absoluteUrl(nearbyWeekendPlacesCityRoute(city.slug)),
    numberOfItems: places.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: places.map((place) => ({
      "@type": "ListItem",
      name: place.name,
      url: absoluteUrl(
        hasNearbyWeekendPlaceDetailPage(place.slug)
          ? nearbyWeekendPlaceRoute(place.slug)
          : `${staticRoutes.nearbyWeekendPlaces}#${place.slug}`,
      ),
    })),
  };

  const cityHasWeekendTrip = hasWeekendTripPage(city.slug);
  const cityHasSummerTravel = hasSummerTravelPage(city.slug);
  const cityHasVisualGuide = hasVisualCityGuidePage(city.slug);
  const cityHasNeighborhood = hasNeighborhoodPlanningPage(city.slug);
  const cityHasMovingTo = hasMovingToCityPage(city.slug);
  const cityHasArrival = hasArrivalPage(city.slug);

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: nearbyWeekendPlacesCityRoute(city.slug),
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={itemListSchema} />

      <PageHeader
        eyebrow="Nearby weekend places"
        intro={introParagraph}
        title={title}
      >
        <dl className="grid gap-4">
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
              City
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              <Link
                className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                href={cityRoute(city.slug)}
              >
                {city.name}
              </Link>
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

        <section
          aria-labelledby="detail-overview-heading"
          className="rounded-2xl border border-neutral-border bg-surface-soft p-6"
        >
          <h2
            className="text-xl font-semibold text-text-primary"
            id="detail-overview-heading"
          >
            Start from your own city
          </h2>
          <p className="mt-3 text-sm leading-7 text-text-primary">
            This page helps users research nearby weekend places connected to
            {" "}
            {city.name}
            {country ? `, ${country.name}` : ""}, as a starting point for
            local-first weekend rest. It is not a route planner, ticket guide,
            events page, tourism ranking, or live availability source. Records
            are planning candidates only.
          </p>
          <p className="mt-3 text-sm leading-7 text-text-primary">
            Records do not publish exact distances, travel times, transport
            schedules, opening hours, ticket prices, restaurant or hotel
            recommendations, attraction rankings, or live access status.
            Confirm time-sensitive details with the official park, museum,
            transport authority, or municipal source linked on each record.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <li>
              <Link
                className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                href={cityRoute(city.slug)}
              >
                {city.name} city profile
              </Link>
            </li>
            {country ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={countryRoute(country.slug)}
                >
                  {country.name} country hub
                </Link>
              </li>
            ) : null}
            <li>
              <Link
                className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                href={staticRoutes.nearbyWeekendPlaces}
              >
                Global nearby weekend places directory
              </Link>
            </li>
            {cityHasWeekendTrip ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={weekendTripRoute(city.slug)}
                >
                  Weekend trip planning guide for {city.name}
                </Link>
              </li>
            ) : null}
          </ul>
        </section>

        <section aria-labelledby="city-nearby-grid-heading">
          <SectionHeading
            description="Each card opens an official source where Wikidata lists one, plus links to the connected city, country profile, and the detail page for verified records. Records are unordered and not ranked; verify access and conditions with the official source before departure."
            title={`Nearby weekend places from ${city.name}`}
          />
          <h2 className="sr-only" id="city-nearby-grid-heading">
            Nearby weekend places from {city.name}
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {places.map((place) => {
              const statusLabel = STATUS_LABEL[place.verificationStatus];
              const eyebrow = `${country?.name ?? "Indexed place"}${
                place.regionName ? ` · ${place.regionName}` : ""
              }`;
              const hasDetail = hasNearbyWeekendPlaceDetailPage(place.slug);
              return (
                <li key={place.slug} id={place.slug}>
                  <Card as="article" className="h-full" interactive>
                    {place.image ? (
                      <figure className="mb-4 -mx-5 -mt-5 overflow-hidden rounded-t-2xl border-b border-neutral-border bg-surface-soft">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={place.image.alt}
                          className="block h-auto w-full object-cover"
                          decoding="async"
                          height={place.image.height}
                          loading="lazy"
                          sizes="(min-width: 1280px) 384px, (min-width: 768px) 50vw, 100vw"
                          src={place.image.src}
                          style={{
                            aspectRatio: `${place.image.width} / ${place.image.height}`,
                          }}
                          width={place.image.width}
                        />
                        <figcaption className="border-t border-neutral-border bg-white px-4 py-2 text-xs leading-5 text-text-secondary">
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
                            Wikimedia Commons
                          </a>
                          ,{" "}
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
                          . Visual context only.
                        </figcaption>
                      </figure>
                    ) : null}
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      {eyebrow}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-text-primary">
                      {hasDetail ? (
                        <Link
                          className="decoration-brand-500 hover:underline"
                          href={nearbyWeekendPlaceRoute(place.slug)}
                        >
                          {place.name}
                        </Link>
                      ) : place.officialUrl ? (
                        <Link
                          className="decoration-brand-500 hover:underline"
                          href={place.officialUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {place.name}
                        </Link>
                      ) : (
                        place.name
                      )}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-text-secondary">
                      {getNearbyPlaceCategoryLabel(place.category)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {place.summary}
                    </p>
                    <p className="mt-3 text-xs text-text-secondary">
                      {statusLabel}.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      {hasDetail && place.officialUrl ? (
                        <a
                          className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                          href={place.officialUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Official source
                        </a>
                      ) : null}
                      {place.wikidataId ? (
                        <a
                          className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                          href={`https://www.wikidata.org/wiki/${place.wikidataId}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Wikidata: {place.wikidataId}
                        </a>
                      ) : null}
                      {place.commonsCategory ? (
                        <a
                          className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                          href={`https://commons.wikimedia.org/wiki/Category:${encodeURIComponent(place.commonsCategory)}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Commons category
                        </a>
                      ) : null}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>

        <section
          aria-labelledby="city-nearby-howto-heading"
          className="rounded-2xl bg-surface-soft p-6"
        >
          <h2
            className="text-xl font-semibold text-text-primary"
            id="city-nearby-howto-heading"
          >
            How to use this page
          </h2>
          <p className="mt-3 text-sm leading-7 text-text-primary">
            This page is a planning surface. Records do not publish exact
            distances, travel times, transport schedules, opening hours, ticket
            prices, restaurant or hotel recommendations, attraction rankings,
            or live access status.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-text-primary">
            <li>
              Start with the {city.name} city profile to anchor the location
              and country context.
            </li>
            <li>
              Compare the nearby place records above against your origin
              city&rsquo;s transport and access patterns.
            </li>
            <li>
              Open the detail page for any record marked &ldquo;Verified source
              record&rdquo; to see the official source, Wikidata identity, and
              visual context.
            </li>
            <li>
              Check the official source linked on each record for current
              opening, access, seasonal status, and conditions before
              departure.
            </li>
            <li>
              Use the travel budget calculator for user-entered estimates — the
              platform does not publish ticket prices, transport schedules, or
              hotel/flight prices.
            </li>
            <li>
              Confirm route, weather, opening/access status, and costs from
              official or trusted current sources before departure.
            </li>
          </ul>
        </section>

        <section
          aria-labelledby="city-nearby-status-heading"
          className="rounded-2xl bg-surface-soft p-6"
        >
          <h2
            className="text-xl font-semibold text-text-primary"
            id="city-nearby-status-heading"
          >
            Verification status legend
          </h2>
          <p className="mt-3 text-sm leading-7 text-text-primary">
            The status shown on each card reflects the level of source
            verification: a matched Wikidata identity together with an official
            URL is shown as verified, an identity match without a confirmed
            official URL is shown as partially verified, and records not yet
            matched to a stable identifier are shown as pending review.
          </p>
          <dl className="mt-4 grid gap-4 md:grid-cols-3">
            {verifiedCount > 0 ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Verified source record
                </dt>
                <dd className="mt-1 text-base font-semibold text-text-primary">
                  {verifiedCount}
                </dd>
              </div>
            ) : null}
            {partialCount > 0 ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Partially verified source record
                </dt>
                <dd className="mt-1 text-base font-semibold text-text-primary">
                  {partialCount}
                </dd>
              </div>
            ) : null}
            {needsReviewCount > 0 ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Pending detailed verification
                </dt>
                <dd className="mt-1 text-base font-semibold text-text-primary">
                  {needsReviewCount}
                </dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section
          aria-labelledby="city-nearby-sources-heading"
          className="rounded-2xl bg-surface-soft p-6"
        >
          <h2
            className="text-xl font-semibold text-text-primary"
            id="city-nearby-sources-heading"
          >
            Sources and methodology
          </h2>
          <p className="mt-3 text-sm leading-7 text-text-primary">
            Nearby weekend places are sourced exclusively from Wikidata —
            primary identifier (QID), coordinates (P625), and official website
            (P856) — together with the linked operator (park authority,
            municipality, heritage body, or UNESCO official page) where
            Wikidata&rsquo;s P856 points at it. Records do not publish fixed
            itineraries, attraction rankings, restaurant or hotel
            recommendations, event or festival dates, ticket prices, hotel or
            flight prices, opening hours, transport schedules, exact travel
            times, exact distances, weather forecasts, crime rates, or any
            &ldquo;best&rdquo; / &ldquo;must-see&rdquo; / &ldquo;safest&rdquo;
            / &ldquo;cheapest&rdquo; claims. Verify access, opening times,
            weather, health, and safety details with the official source linked
            on each record before departure. Read the{" "}
            <Link
              className="underline decoration-brand-500 decoration-2 hover:bg-orange-50"
              href={staticRoutes.methodology}
            >
              scoring methodology
            </Link>{" "}
            for how structured indicators are constructed, and the{" "}
            <Link
              className="underline decoration-brand-500 decoration-2 hover:bg-orange-50"
              href={staticRoutes.dataSources}
            >
              data sources
            </Link>{" "}
            registry for the official publishers cited across the platform.
          </p>
        </section>

        <section aria-labelledby="city-nearby-continue-heading">
          <SectionHeading
            description={`Open related platform layers behind ${city.name} weekend research. Verify events, opening hours, transport, weather, health, and safety details with official or trusted current sources before departure.`}
            title="Continue exploring"
          />
          <h2 className="sr-only" id="city-nearby-continue-heading">
            Continue exploring from {city.name}
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            <li>
              <Link
                className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                href={cityRoute(city.slug)}
              >
                {city.name} city intelligence profile
              </Link>
            </li>
            {country ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={countryRoute(city.countrySlug)}
                >
                  {country.name} country intelligence hub
                </Link>
              </li>
            ) : null}
            <li>
              <Link
                className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                href={staticRoutes.nearbyWeekendPlaces}
              >
                Global nearby weekend places directory
              </Link>
            </li>
            {cityHasWeekendTrip ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={weekendTripRoute(city.slug)}
                >
                  Weekend trip planning guide for {city.name}
                </Link>
              </li>
            ) : null}
            {cityHasSummerTravel ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={summerTravelRoute(city.slug)}
                >
                  Summer 2026 travel planning guide for {city.name}
                </Link>
              </li>
            ) : null}
            {cityHasVisualGuide ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={visualCityGuideRoute(city.slug)}
                >
                  Visual guide to {city.name}
                </Link>
              </li>
            ) : null}
            {cityHasNeighborhood ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={neighborhoodPlanningRoute(city.slug)}
                >
                  Neighborhood planning guide for {city.name}
                </Link>
              </li>
            ) : null}
            {cityHasMovingTo ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={movingToCityRoute(city.slug)}
                >
                  Moving to {city.name} planning guide
                </Link>
              </li>
            ) : null}
            {cityHasArrival ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={arrivalRoute(city.slug)}
                >
                  Arrival planning guide for {city.name}
                </Link>
              </li>
            ) : null}
            <li>
              <Link
                className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                href={staticRoutes.compare}
              >
                City comparisons
              </Link>
            </li>
            <li>
              <Link
                className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                href={staticRoutes.travelBudgetCalculator}
              >
                Travel budget calculator
              </Link>
            </li>
            <li>
              <Link
                className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                href={staticRoutes.costOfLivingCalculator}
              >
                Cost of living calculator
              </Link>
            </li>
            <li>
              <Link
                className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                href={staticRoutes.relocationChecklist}
              >
                Relocation checklist
              </Link>
            </li>
            <li>
              <Link
                className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                href={staticRoutes.methodology}
              >
                Scoring methodology
              </Link>
            </li>
            <li>
              <Link
                className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
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
