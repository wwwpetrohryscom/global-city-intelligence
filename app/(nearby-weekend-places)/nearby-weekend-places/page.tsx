import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { HubNav } from "@/components/navigation/HubNav";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllCountries,
  getAllNearbyWeekendPlaces,
  getCityBySlug,
  getCountryBySlug,
  getNearbyPlaceCategoryLabel,
  hasNearbyWeekendPlaceDetailPage,
  hasNearbyWeekendPlacesCityPage,
} from "@/lib/data/queries";
import { staticBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import {
  absoluteUrl,
  cityRoute,
  countryRoute,
  nearbyWeekendPlaceRoute,
  nearbyWeekendPlacesCityRoute,
  staticRoutes,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

const title = "Nearby Weekend Places to Research";
const description =
  "Browse source-backed nearby weekend place records connected to city profiles for local-first short breaks, with verification status, city links, planning tools, methodology, and source transparency.";

const introParagraph =
  "Each record is a short, source-attributed reference to a park, heritage site, nature reserve, or other public destination within weekend reach of an indexed city. These pages are research orientation only — they are not a tourism guide, not an attractions ranking, not an itinerary generator, and not evidence of current local conditions. Records do not publish exact distances, travel times, transport schedules, opening hours, ticket prices, restaurant or hotel recommendations, attraction rankings, or live access status. Verify access, opening times, weather, health, and safety details with the official source linked on each record before departure.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.nearbyWeekendPlaces,
});

const CATEGORY_ORDER = [
  "nature",
  "waterfront",
  "historic_town",
  "park",
  "beach",
  "lake",
  "mountain",
  "island",
  "cultural_site",
  "regional_city",
  "family_outdoor",
  "general_weekend_place",
] as const;

export default function NearbyWeekendPlacesDirectoryPage() {
  const allPlaces = getAllNearbyWeekendPlaces();
  const placeHref = (place: (typeof allPlaces)[number]): string => {
    if (hasNearbyWeekendPlaceDetailPage(place.slug)) {
      return nearbyWeekendPlaceRoute(place.slug);
    }
    const city = place.connectedCitySlugs[0];
    if (city && hasNearbyWeekendPlacesCityPage(city)) {
      return nearbyWeekendPlacesCityRoute(city);
    }
    if (city) {
      return cityRoute(city);
    }
    return staticRoutes.nearbyWeekendPlaces;
  };
  const breadcrumbs = staticBreadcrumbs(
    "Nearby weekend places",
    staticRoutes.nearbyWeekendPlaces,
  );
  const countries = getAllCountries();

  const entries = allPlaces
    .map((place) => {
      const country = getCountryBySlug(place.countrySlug);
      const connectedCities = place.connectedCitySlugs
        .map((slug) => getCityBySlug(slug))
        .filter((c): c is NonNullable<typeof c> => Boolean(c));
      return { place, country, connectedCities };
    })
    .sort((a, b) => a.place.name.localeCompare(b.place.name));

  const verifiedCount = entries.filter(
    (e) => e.place.verificationStatus === "verified",
  ).length;
  const partialCount = entries.filter(
    (e) => e.place.verificationStatus === "partial",
  ).length;
  const needsReviewCount = entries.filter(
    (e) => e.place.verificationStatus === "needs_review",
  ).length;
  const countryCount = new Set(entries.map((e) => e.place.countrySlug)).size;
  const connectedCityCount = new Set(
    entries.flatMap((e) => e.connectedCities.map((c) => c.slug)),
  ).size;

  const entriesByCountry = countries
    .map((country) => ({
      country,
      items: entries
        .filter((e) => e.place.countrySlug === country.slug)
        .sort((a, b) => a.place.name.localeCompare(b.place.name)),
    }))
    .filter((g) => g.items.length > 0)
    .sort((a, b) => a.country.name.localeCompare(b.country.name));

  const entriesByCategory = CATEGORY_ORDER.map((category) => ({
    category,
    label: getNearbyPlaceCategoryLabel(category),
    items: entries
      .filter((e) => e.place.category === category)
      .sort((a, b) => a.place.name.localeCompare(b.place.name)),
  })).filter((g) => g.items.length > 0);

  type CityType = NonNullable<ReturnType<typeof getCityBySlug>>;
  const cityBuckets = new Map<
    string,
    { city: CityType; items: typeof allPlaces }
  >();
  for (const e of entries) {
    for (const city of e.connectedCities) {
      const bucket = cityBuckets.get(city.slug);
      if (bucket) {
        bucket.items.push(e.place);
      } else {
        cityBuckets.set(city.slug, { city, items: [e.place] });
      }
    }
  }
  const cityIndex = Array.from(cityBuckets.values())
    .map((g) => ({
      city: g.city,
      items: g.items.slice().sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.city.name.localeCompare(b.city.name));

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description,
    url: absoluteUrl(staticRoutes.nearbyWeekendPlaces),
    numberOfItems: entries.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: entries.slice(0, 100).map((entry) => ({
      "@type": "ListItem",
      name: entry.place.name,
      url: absoluteUrl(placeHref(entry.place)),
    })),
  };

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: staticRoutes.nearbyWeekendPlaces,
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
              {entries.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Countries represented
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {countryCount}
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
        <HubNav />

        <section
          aria-labelledby="nearby-directory-local-first-heading"
          className="rounded-2xl border border-neutral-border bg-surface-soft p-6"
        >
          <h2
            className="text-2xl font-semibold text-text-primary"
            id="nearby-directory-local-first-heading"
          >
            Start from your own city
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
            Weekend breaks do not require flights. Start from your own city
            profile, then compare nearby city and country context before
            choosing a destination. Records on this page are planning
            candidates, not route instructions — they describe parks, heritage
            sites, nature reserves, and other public destinations within
            weekend reach of an indexed city, indexed across {connectedCityCount}{" "}
            connected city profiles.
          </p>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
            Official links and Wikidata identifiers help establish the
            identity of each place, but they do not confirm current access or
            local conditions. The platform does not publish exact distances,
            travel times, transport schedules, ticket prices, opening hours,
            live availability, weather forecasts, or event dates. Use the
            official source linked on each record to verify access, opening
            times, weather, health, and safety details before departure.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link
              className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
              href={staticRoutes.cities}
            >
              Open the cities directory
            </Link>
            <Link
              className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
              href={staticRoutes.countries}
            >
              Countries directory
            </Link>
            <Link
              className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
              href={staticRoutes.weekendTrips}
            >
              Weekend trip guides
            </Link>
            <Link
              className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
              href={staticRoutes.travelBudgetCalculator}
            >
              Travel budget calculator
            </Link>
          </div>
        </section>

        <section
          aria-labelledby="nearby-directory-sources-heading"
          className="rounded-2xl border border-neutral-border bg-surface-soft p-6"
        >
          <h2
            className="text-2xl font-semibold text-text-primary"
            id="nearby-directory-sources-heading"
          >
            Sources and methodology
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
            Nearby weekend places are sourced exclusively from Wikidata —
            primary identifier (QID), coordinates (P625), and official website
            (P856) — together with the linked operator (park authority,
            municipality, heritage body, or UNESCO official page) where
            Wikidata&apos;s P856 points at it. Records do not publish fixed
            itineraries, attraction rankings, restaurant or hotel
            recommendations, event or festival dates, ticket prices, hotel or
            flight prices, opening hours, transport schedules, exact travel
            times, exact distances, weather forecasts, crime rates, or any
            &ldquo;best&rdquo; / &ldquo;must-see&rdquo; /
            &ldquo;safest&rdquo; / &ldquo;cheapest&rdquo; claims. Verify
            access, opening times, weather, health, and safety details with
            the official source linked on each record before departure. Read
            the{" "}
            <Link
              className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
              href={staticRoutes.methodology}
            >
              scoring methodology
            </Link>{" "}
            for how structured indicators are constructed, and the{" "}
            <Link
              className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
              href={staticRoutes.dataSources}
            >
              data sources
            </Link>{" "}
            registry for the official publishers cited across the platform.
          </p>
        </section>

        <section
          aria-labelledby="nearby-directory-status-heading"
          className="rounded-2xl border border-neutral-border bg-surface-soft p-6"
        >
          <h2
            className="text-2xl font-semibold text-text-primary"
            id="nearby-directory-status-heading"
          >
            Verification status
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
            Verification status reflects the strength of the structured
            identity match on Wikidata for each record. Status labels do not
            indicate current access, suitability, weather, or safety
            conditions — always verify with the official source linked on
            each record before departure.
          </p>
          <dl className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-neutral-border bg-white p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Verified source record
              </dt>
              <dd className="mt-1 text-lg font-semibold text-text-primary">
                {verifiedCount} records
              </dd>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Wikidata identity confirmed (QID) and a public-authority
                official URL from Wikidata P856 are both present.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-border bg-white p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Partially verified source record
              </dt>
              <dd className="mt-1 text-lg font-semibold text-text-primary">
                {partialCount} records
              </dd>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Wikidata identity confirmed (QID and coordinates from
                Wikidata P625) but no P856 official URL on Wikidata yet.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-border bg-white p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Pending detailed verification
              </dt>
              <dd className="mt-1 text-lg font-semibold text-text-primary">
                {needsReviewCount} records
              </dd>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Used when a confident Wikidata QID match is not yet
                established.
              </p>
            </div>
          </dl>
        </section>

        <section aria-labelledby="nearby-directory-country-heading">
          <SectionHeading
            description="A complete index of nearby weekend place records grouped by country, fully present in the initial HTML so every link is crawlable without client-side JavaScript."
            title="Nearby places by country"
          />
          <h2 className="sr-only" id="nearby-directory-country-heading">
            Nearby places by country
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {entriesByCountry.map(({ country, items }) => (
              <article
                className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm"
                key={country.slug}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  {country.region}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-text-primary">
                  <Link
                    className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                    href={countryRoute(country.slug)}
                  >
                    {country.name}
                  </Link>
                </h3>
                <ul className="mt-3 grid grid-cols-1 gap-1 text-sm">
                  {items.map(({ place }) => (
                    <li key={place.slug}>
                      <Link
                        className="text-text-secondary hover:text-brand-500"
                        href={placeHref(place)}
                      >
                        {place.name}
                      </Link>{" "}
                      — {getNearbyPlaceCategoryLabel(place.category)}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="nearby-directory-category-heading">
          <SectionHeading
            description="A complete index of nearby weekend place records grouped by category, fully present in the initial HTML so every link is crawlable without client-side JavaScript."
            title="Nearby places by category"
          />
          <h2 className="sr-only" id="nearby-directory-category-heading">
            Nearby places by category
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {entriesByCategory.map(({ category, label, items }) => (
              <article
                className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm"
                key={category}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  {category}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-text-primary">
                  {label}
                </h3>
                <ul className="mt-3 grid grid-cols-1 gap-1 text-sm">
                  {items.map(({ place, country }) => (
                    <li key={place.slug}>
                      <Link
                        className="text-text-secondary hover:text-brand-500"
                        href={placeHref(place)}
                      >
                        {place.name}
                      </Link>
                      {country ? (
                        <span className="text-text-secondary">
                          {" "}
                          — {country.name}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="nearby-directory-city-heading">
          <SectionHeading
            description="A complete index of nearby weekend place records grouped by the connected city profile that links to them, fully present in the initial HTML so every link is crawlable without client-side JavaScript."
            title="Nearby places by connected city"
          />
          <h2 className="sr-only" id="nearby-directory-city-heading">
            Nearby places by connected city
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cityIndex.map(({ city, items }) => {
              const cityCountry = getCountryBySlug(city.countrySlug);
              return (
                <article
                  className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm"
                  key={city.slug}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    {cityCountry ? cityCountry.name : "Indexed city"}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-text-primary">
                    <Link
                      className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                      href={cityRoute(city.slug)}
                    >
                      {city.name}
                    </Link>
                  </h3>
                  {hasNearbyWeekendPlacesCityPage(city.slug) ? (
                    <p className="mt-1 text-xs text-text-secondary">
                      <Link
                        className="underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                        href={nearbyWeekendPlacesCityRoute(city.slug)}
                      >
                        Nearby weekend places from {city.name}
                      </Link>
                    </p>
                  ) : null}
                  <ul className="mt-3 grid grid-cols-1 gap-1 text-sm">
                    {items.map((place) => (
                      <li key={place.slug}>
                        <Link
                          className="text-text-secondary hover:text-brand-500"
                          href={placeHref(place)}
                        >
                          {place.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="nearby-directory-continue-heading">
          <SectionHeading
            description="Pair the nearby weekend places directory with the platform's other planning surfaces: city and country profiles, comparisons, arrival planning, weekend-trip and summer-travel guides, visual orientation, moving-to research, and the calculators that take user-entered estimates instead of publishing fixed prices."
            title="Continue exploring"
          />
          <h2 className="sr-only" id="nearby-directory-continue-heading">
            Continue exploring
          </h2>
          <ul className="mt-5 grid gap-3 text-sm md:grid-cols-2">
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
                href={staticRoutes.visualGuides}
              >
                Visual city guides
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.summerTravel}
              >
                Summer 2026 travel guides
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
