import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceHeroImage } from "@/components/media/PlaceHeroImage";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { Card } from "@/components/ui/Card";
import { FactList } from "@/components/ui/fact-list";
import { SectionHeading } from "@/components/ui/section-heading";
import { WeekendTripChecklist } from "@/components/weekend-trip/WeekendTripChecklist";
import {
  WeekendTripOverviewCards,
  type WeekendTripOverviewCard,
} from "@/components/weekend-trip/WeekendTripOverviewCards";
import {
  WeekendTripRelatedLinks,
  type WeekendTripRelatedLink,
} from "@/components/weekend-trip/WeekendTripRelatedLinks";
import { getCityHeroImage } from "@/lib/data/media/queries";
import {
  getAllWeekendTripPages,
  getCityBySlug,
  getComparisonsForCity,
  getCountryBySlug,
  getCountryEmergencyProfile,
  getCountryHealthcareProfile,
  getCountryTransportProfile,
  getNearbyPlaceCategoryLabel,
  getNearbyWeekendPlacesForWeekendTrip,
  getSourcesByIds,
  getWeekendTripChecklist,
  getWeekendTripFocusLabel,
  getWeekendTripPageByCitySlug,
  hasArrivalPage,
  hasMovingToCityPage,
  hasNearbyWeekendPlaceDetailPage,
  hasNeighborhoodPlanningPage,
  hasSummerTravelPage,
  hasVerifiedEmergencyData,
  hasVerifiedHealthcareData,
  hasVerifiedTransportData,
  hasVisualCityGuidePage,
} from "@/lib/data/queries";
import { weekendTripBreadcrumbs } from "@/lib/seo/breadcrumbs";
import {
  generateWeekendTripMetadata,
  ogImageFromPlaceImage,
} from "@/lib/seo/metadata";
import {
  arrivalRoute,
  cityRoute,
  comparisonRoute,
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
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return getAllWeekendTripPages().map((page) => ({ city: page.citySlug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const weekendPage = getWeekendTripPageByCitySlug(citySlug);
  const city = weekendPage ? getCityBySlug(weekendPage.citySlug) : undefined;

  if (!weekendPage || !city) {
    return {};
  }

  const country = getCountryBySlug(city.countrySlug);

  return generateWeekendTripMetadata({
    weekendPage,
    city,
    country,
    image: ogImageFromPlaceImage(getCityHeroImage(city.slug)),
  });
}

export default async function WeekendTripPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const weekendPage = getWeekendTripPageByCitySlug(citySlug);
  const city = weekendPage ? getCityBySlug(weekendPage.citySlug) : undefined;

  if (!weekendPage || !city) {
    notFound();
  }

  const country = getCountryBySlug(city.countrySlug);
  const breadcrumbs = weekendTripBreadcrumbs(city.slug);
  const sources = getSourcesByIds(weekendPage.sourceIds);
  const checklist = getWeekendTripChecklist();

  const emergencyProfile = getCountryEmergencyProfile(city.countrySlug);
  const healthcareProfile = getCountryHealthcareProfile(city.countrySlug);
  const transportProfile = getCountryTransportProfile(city.countrySlug);
  const emergencyVerified = hasVerifiedEmergencyData(emergencyProfile);
  const healthcareVerified = hasVerifiedHealthcareData(healthcareProfile);
  const transportVerified = hasVerifiedTransportData(transportProfile);

  const relatedComparisons = getComparisonsForCity(city.slug).slice(0, 4);
  const cityHasArrival = hasArrivalPage(city.slug);
  const cityHasVisualGuide = hasVisualCityGuidePage(city.slug);
  const cityHasNeighborhood = hasNeighborhoodPlanningPage(city.slug);
  const cityHasMovingTo = hasMovingToCityPage(city.slug);
  const cityHasSummerTravel = hasSummerTravelPage(city.slug);
  const nearbyPlaces = getNearbyWeekendPlacesForWeekendTrip(city.slug, 6);

  const title = `Weekend Trip Planning Guide for ${city.name}`;
  const description = `Plan a weekend city trip to ${city.name}${country ? `, ${country.name}` : ""} with arrival planning, visual orientation, Summer 2026 travel context, budget tools, transport notes, healthcare and public-safety context, comparisons, methodology, and source transparency.`;

  const overviewCards: WeekendTripOverviewCard[] = [
    {
      label: "City",
      value: city.name,
      description: country
        ? `Indexed city profile in ${country.name}.`
        : "Indexed city profile.",
    },
    {
      label: "Country hub",
      value: country?.name ?? "Linked country profile",
      description:
        "Open the country hub for verified emergency, healthcare, and transport-authority context where available.",
    },
    {
      label: "Weekend focus",
      value: getWeekendTripFocusLabel(weekendPage.weekendFocus),
      description:
        "Editorial framing for this weekend trip planning guide. The page does not publish itineraries, attraction rankings, or restaurant / hotel recommendations.",
    },
    {
      label: "Verified context layers",
      value: String(
        [emergencyVerified, healthcareVerified, transportVerified].filter(
          Boolean,
        ).length,
      ),
      description:
        "Count of verified emergency, healthcare, and transport profiles available for the country / city.",
    },
  ];

  const relatedLinks: WeekendTripRelatedLink[] = [
    {
      label: `${city.name} city intelligence profile`,
      href: cityRoute(city.slug),
      description:
        "Open the full city profile for directional indicators and module context.",
    },
    ...(country
      ? [
          {
            label: `${country.name} country intelligence hub`,
            href: countryRoute(country.slug),
            description:
              "National context behind city indicators and verified utility layers.",
          },
        ]
      : []),
    ...(cityHasArrival
      ? [
          {
            label: `Arrival planning guide for ${city.name}`,
            href: arrivalRoute(city.slug),
            description:
              "First-day arrival planning context — pairs with weekend planning.",
          },
        ]
      : []),
    ...(cityHasSummerTravel
      ? [
          {
            label: `Summer 2026 travel planning guide for ${city.name}`,
            href: summerTravelRoute(city.slug),
            description:
              "Seasonal planning checklist — pairs with weekend planning.",
          },
        ]
      : []),
    ...(cityHasVisualGuide
      ? [
          {
            label: `Visual guide to ${city.name}`,
            href: visualCityGuideRoute(city.slug),
            description:
              "Source-attributed verified imagery — pairs with weekend planning.",
          },
        ]
      : []),
    ...(cityHasNeighborhood
      ? [
          {
            label: `Neighborhood planning guide for ${city.name}`,
            href: neighborhoodPlanningRoute(city.slug),
            description:
              "Neighborhood research checklist — pairs with weekend planning.",
          },
        ]
      : []),
    ...(cityHasMovingTo
      ? [
          {
            label: `Moving to ${city.name} planning guide`,
            href: movingToCityRoute(city.slug),
            description:
              "Relocation research checklist — pairs with weekend planning.",
          },
        ]
      : []),
    {
      label: "Travel budget calculator",
      href: staticRoutes.travelBudgetCalculator,
      description:
        "Estimate a trip and arrival budget using your own inputs. Planning estimator only.",
    },
    {
      label: "Cost of living calculator",
      href: staticRoutes.costOfLivingCalculator,
      description:
        "Compare monthly costs between cities using your own inputs.",
    },
    {
      label: "Relocation checklist",
      href: staticRoutes.relocationChecklist,
      description:
        "Structure relocation preparation across documents, housing, healthcare, and first-week planning.",
    },
    {
      label: "Cities directory",
      href: staticRoutes.cities,
      description: "Browse every indexed city profile.",
    },
    {
      label: "Countries directory",
      href: staticRoutes.countries,
      description: "National context for every supported country.",
    },
    {
      label: "City comparisons",
      href: staticRoutes.compare,
      description: "Side-by-side directional comparisons between cities.",
    },
    {
      label: "Arrival planning directory",
      href: staticRoutes.arrival,
      description: "Browse every curated city arrival planning guide.",
    },
    {
      label: "Summer 2026 travel directory",
      href: staticRoutes.summerTravel,
      description: "Browse every curated Summer 2026 city travel guide.",
    },
    {
      label: "Visual city guides directory",
      href: staticRoutes.visualGuides,
      description: "Browse every curated source-attributed visual city guide.",
    },
    {
      label: "Moving-to directory",
      href: staticRoutes.movingTo,
      description: "Browse every curated moving-to city planning guide.",
    },
    {
      label: "Scoring methodology",
      href: staticRoutes.methodology,
      description: "How structured indicators are constructed and read.",
    },
    {
      label: "Data sources registry",
      href: staticRoutes.dataSources,
      description: "Official publishers cited by verified layers.",
    },
  ];

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: weekendTripRoute(city.slug),
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHeader
        eyebrow="Weekend trip"
        intro={weekendPage.summary}
        title={title}
      >
        <dl className="grid gap-4">
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
          {country ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Country
              </dt>
              <dd className="mt-1 text-lg font-semibold text-text-primary">
                <Link
                  className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                  href={countryRoute(country.slug)}
                >
                  {country.name}
                </Link>
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Last updated
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {weekendPage.updatedDate}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {weekendPage.dataYear}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-14 py-12">
        <BreadcrumbNav items={breadcrumbs} />

        <section
          aria-label={`${city.name} visual context for weekend trip planning`}
          className="max-w-2xl"
        >
          <PlaceHeroImage
            placeName={`${city.name}${country ? `, ${country.name}` : ""}`}
            placeSlug={city.slug}
            placeType="city"
          />
        </section>

        <FactList
          facts={[
            {
              label: "Page style",
              value:
                "Weekend trip planning checklist (not an itinerary, events calendar, hotel-price guide, restaurant guide, or tourism ranking)",
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
              label: "Verification",
              value:
                emergencyVerified || healthcareVerified || transportVerified
                  ? "At least one verified country-level utility layer"
                  : "Structured indicators only; fallback for verified layers",
            },
          ]}
        />

        <section aria-labelledby="weekend-overview-heading">
          <SectionHeading
            description={`Snapshot for planning a weekend city trip to ${city.name}. Cards link to the structured profile, country hub, and verified context layers behind the indicators. This page does not publish itineraries, attraction rankings, or restaurant / hotel recommendations.`}
            title={`${city.name} weekend planning overview`}
          />
          <h2 className="sr-only" id="weekend-overview-heading">
            {city.name} weekend planning overview
          </h2>
          <div className="mt-6">
            <WeekendTripOverviewCards cards={overviewCards} />
          </div>
        </section>

        <section aria-labelledby="weekend-checklist-heading">
          <SectionHeading
            description="Practical, neutral weekend trip research checklist organised by category. Items reference structured platform sections and official sources — they do not publish itineraries, day-by-day schedules, attraction rankings, restaurant or hotel recommendations, event dates, ticket prices, opening hours, transport schedules, airport routes, or weather forecasts."
            title="Weekend trip research checklist"
          />
          <h2 className="sr-only" id="weekend-checklist-heading">
            Weekend trip research checklist
          </h2>
          <div className="mt-6">
            <WeekendTripChecklist items={checklist} />
          </div>
        </section>

        <section aria-labelledby="weekend-context-heading">
          <SectionHeading
            description="Which platform-side context layers are available for the country and city behind weekend trip planning. Where verified data is not on file, the platform shows a transparent fallback rather than fabricated information."
            title="Context-layer availability"
          />
          <h2 className="sr-only" id="weekend-context-heading">
            Context-layer availability for {city.name}
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            <li>
              <Card as="article" className="h-full">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Transport context
                </p>
                <p className="mt-2 text-sm leading-6 text-text-primary">
                  {transportVerified
                    ? `Verified country-level transport-authority context is on file for ${country?.name ?? "this country"}. Confirm routes, fares, and schedules through the official authorities cited on the country hub.`
                    : `No verified country-level transport-authority context is on file yet. Use the city transport / mobility profile for structured framing and confirm details through official authorities.`}
                </p>
                <Link
                  className="mt-3 inline-block text-sm font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={cityRoute(city.slug)}
                >
                  Open the city transport context
                </Link>
              </Card>
            </li>
            <li>
              <Card as="article" className="h-full">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Safety context
                </p>
                <p className="mt-2 text-sm leading-6 text-text-primary">
                  {emergencyVerified
                    ? `Verified country-level emergency contact context is on file for ${country?.name ?? "this country"}. Always confirm current numbers with the official local emergency service.`
                    : `No verified country-level emergency contact context is on file yet. Confirm current emergency numbers with the official local service.`}
                </p>
                {country ? (
                  <Link
                    className="mt-3 inline-block text-sm font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                    href={countryRoute(country.slug)}
                  >
                    Open the country safety context
                  </Link>
                ) : null}
              </Card>
            </li>
            <li>
              <Card as="article" className="h-full">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Healthcare context
                </p>
                <p className="mt-2 text-sm leading-6 text-text-primary">
                  {healthcareVerified
                    ? `Verified country-level healthcare access context is on file for ${country?.name ?? "this country"}. Confirm registration, insurance, and access through official local sources. This guide is not medical advice.`
                    : `No verified country-level healthcare access context is on file yet. Confirm registration, insurance, and access through official local sources. This guide is not medical advice.`}
                </p>
                {country ? (
                  <Link
                    className="mt-3 inline-block text-sm font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                    href={countryRoute(country.slug)}
                  >
                    Open the country healthcare context
                  </Link>
                ) : null}
              </Card>
            </li>
          </ul>
        </section>

        <section aria-labelledby="weekend-related-heading">
          <SectionHeading
            description="Open the related platform layers behind weekend trip planning. Verify events, opening hours, transport, weather, health, and safety details with official or trusted current sources before departure."
            title="Related context and tools"
          />
          <h2 className="sr-only" id="weekend-related-heading">
            Related context and tools for the {city.name} weekend trip
          </h2>
          <WeekendTripRelatedLinks links={relatedLinks} />
        </section>

        {nearbyPlaces.length > 0 ? (
          <section aria-labelledby="weekend-nearby-heading">
            <SectionHeading
              description={`Source-backed candidate places connected to ${city.name} as starting points for short-trip research. The status shown on each card reflects the level of source verification: a matched Wikidata identity together with an official URL is shown as verified, an identity match without a confirmed official URL is shown as partially verified, and records not yet matched to a stable identifier are shown as pending review. Verify access, opening, transport, weather, and seasonal conditions with official sources before departure. This is not a ranking, an itinerary, or a tourism guide.`}
              title="Nearby weekend places to research"
            />
            <h2 className="sr-only" id="weekend-nearby-heading">
              Nearby weekend places to research from {city.name}
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {nearbyPlaces.map((place) => {
                const statusLabel =
                  place.verificationStatus === "verified"
                    ? "Verified source record"
                    : place.verificationStatus === "partial"
                      ? "Partially verified source record"
                      : "Pending detailed verification";
                return (
                  <li key={place.slug}>
                    <Card as="article" className="h-full p-5">
                      {place.image ? (
                        <figure className="mb-3 -mx-5 -mt-5 overflow-hidden rounded-t-2xl border-b border-neutral-border bg-surface-soft">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt={place.image.alt}
                            className="block h-auto w-full object-cover"
                            decoding="async"
                            height={place.image.height}
                            loading="lazy"
                            sizes="(min-width: 768px) 384px, 100vw"
                            src={place.image.src}
                            style={{ aspectRatio: `${place.image.width} / ${place.image.height}` }}
                            width={place.image.width}
                          />
                          <figcaption className="border-t border-neutral-border bg-white px-3 py-2 text-xs leading-5 text-text-secondary">
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
                            <a
                              className="underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                              href={place.image.licenseUrl}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {place.image.license}
                            </a>
                            . Visual context only.
                          </figcaption>
                        </figure>
                      ) : null}
                      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        {getNearbyPlaceCategoryLabel(place.category)}
                        {place.regionName ? ` · ${place.regionName}` : ""}
                      </p>
                      <h3 className="mt-2 text-base font-semibold text-text-primary">
                        {hasNearbyWeekendPlaceDetailPage(place.slug) ? (
                          <Link
                            className="underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                            href={nearbyWeekendPlaceRoute(place.slug)}
                          >
                            {place.name}
                          </Link>
                        ) : place.officialUrl ? (
                          <Link
                            className="underline decoration-brand-500 decoration-2 hover:bg-orange-50"
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
                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {place.summary}
                      </p>
                      <p className="mt-3 text-xs text-text-secondary">
                        {statusLabel}.
                        {place.wikidataId ? ` Wikidata: ${place.wikidataId}.` : ""}
                      </p>
                    </Card>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-xs leading-5 text-text-secondary">
              Records do not publish exact distances, travel times, transport
              schedules, opening hours, ticket prices, restaurant or hotel
              recommendations, attraction rankings, or live access status.
              Confirm time-sensitive details with the official park, museum,
              transport authority, or municipal source for each place.
            </p>
          </section>
        ) : null}

        {relatedComparisons.length > 0 ? (
          <section aria-labelledby="weekend-comparisons-heading">
            <SectionHeading
              description={`City-vs-city comparisons that include ${city.name}. Use these alongside weekend trip planning to weigh other cities you are considering.`}
              title="Related comparisons"
            />
            <h2 className="sr-only" id="weekend-comparisons-heading">
              Related comparisons for {city.name}
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {relatedComparisons.map((comparison) => (
                <li key={comparison.slug}>
                  <Card as="article" className="h-full p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Comparison
                    </p>
                    <p className="mt-2 text-base font-semibold text-text-primary">
                      <Link
                        className="underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                        href={comparisonRoute(comparison.slug)}
                      >
                        {comparison.title}
                      </Link>
                    </p>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {comparison.description}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="weekend-disclaimer-heading">
          <SectionHeading
            description="What this page is and is not. Read this before treating any weekend trip detail as final."
            title="Scope and limitations"
          />
          <h2 className="sr-only" id="weekend-disclaimer-heading">
            Scope and limitations
          </h2>
          <div className="mt-6 rounded-2xl border border-neutral-border bg-surface-soft p-6">
            <p className="text-sm leading-7 text-text-primary">
              This page is a weekend trip <strong>research checklist</strong>
              {" "}
              for {city.name}
              {country ? `, ${country.name}` : ""}. It does not publish
              day-by-day itineraries, attraction rankings, restaurant or hotel
              recommendations, event or festival dates, ticket prices, hotel
              or flight prices, opening hours, transport schedules, airport
              routes, exact travel times, weather forecasts, exact
              temperatures, crime rates, or any &ldquo;best&rdquo; /
              &ldquo;must-see&rdquo; / &ldquo;top&rdquo; /
              &ldquo;safest&rdquo; / &ldquo;cheapest&rdquo; claims. Verify
              events, opening hours, transport, weather, health, and safety
              details with official or trusted current sources before
              departure. This is not medical, legal, visa, or immigration
              advice.
            </p>
          </div>
        </section>

        <SourceBlock sources={sources} />
      </Container>
    </main>
  );
}
