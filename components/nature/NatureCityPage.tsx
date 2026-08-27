import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { NatureExploreLinks } from "@/components/nature/NatureExploreLinks";
import {
  NatureFilterBar,
  type NatureFilterItem,
} from "@/components/nature/NatureFilterBar";
import { NaturePlaceCard } from "@/components/nature/NaturePlaceCard";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import { getCountryBySlug } from "@/lib/data/queries";
import {
  NATURE_BAND_LABEL,
  NATURE_BAND_MAX_KM,
  NATURE_BAND_ORDER,
  formatDistance,
  formatDistanceShort,
} from "@/lib/nature/distance";
import {
  natureCategoryLabel,
  natureCategoryPlural,
} from "@/lib/nature/taxonomy";
import {
  REACHABILITY_BAND_LABEL,
  REACHABILITY_BAND_ORDER,
} from "@/lib/reachability/bands";
import {
  cityRoute,
  countryRoute,
  nearbyWeekendPlaceRoute,
  nearbyWeekendPlacesCityRoute,
  staticRoutes,
  weekendTripRoute,
} from "@/lib/seo/routes";
import { breadcrumbSchema, itemListSchema, webpageSchema } from "@/lib/seo/schema";
import type {
  City,
  CityNaturePlace,
  Country,
  NatureCategory,
  NatureDistanceBand,
  NatureRouteSegment,
} from "@/types";

/**
 * Shared body for the nature hub and every dedicated category page.
 *
 * Both page families answer the same question shape ("what nature can I reach
 * from here"), differ only in which subset they show, and share their linking,
 * schema and ordering rules — so they share one implementation rather than
 * eight near-copies that drift.
 */
export function NatureCityPage({
  city,
  country,
  places,
  title,
  description,
  eyebrow,
  path,
  breadcrumbLabel,
  segments,
  current,
  categoryCounts,
  showFilters,
  hasWeekendTrip,
  hasHub,
}: {
  city: City;
  country?: Country;
  places: readonly CityNaturePlace[];
  title: string;
  description: string;
  eyebrow: string;
  path: string;
  breadcrumbLabel: string;
  segments: readonly NatureRouteSegment[];
  current: NatureRouteSegment | "hub";
  categoryCounts: readonly { category: NatureCategory; count: number }[];
  showFilters: boolean;
  hasWeekendTrip: boolean;
  /** False when the umbrella hub did not clear its own threshold. */
  hasHub: boolean;
}) {
  const breadcrumbs = [
    { name: "Home", href: staticRoutes.home },
    { name: "Cities", href: staticRoutes.cities },
    { name: city.name, href: cityRoute(city.slug) },
    { name: breadcrumbLabel, href: path },
  ];

  const nearest = places[0];
  const furthest = places[places.length - 1];
  const crossBorder = places.filter((place) => place.crossBorder);
  const crossBorderCountries = Array.from(
    new Set(crossBorder.map((place) => place.countrySlug)),
  );

  // Hero policy: use a verified image of a real place from THIS page's set —
  // the closest one that has one — so the picture is of something the reader
  // can actually reach. A city skyline is never substituted, and when no
  // eligible place carries a verified image the page simply renders without a
  // hero rather than showing the wrong landscape.
  const heroPlace = places.find((place) => place.image);

  const filterItems: NatureFilterItem[] = places.map((place) => ({
    slug: place.placeSlug,
    categories: place.categories,
    band: place.band,
    crossBorder: place.crossBorder,
  }));

  const bandsPresent = NATURE_BAND_ORDER.filter((band) =>
    places.some((place) => place.band === band),
  );

  const reachabilityBands = REACHABILITY_BAND_ORDER.map((band) => ({
    band,
    count: places.filter((place) => place.band === band).length,
  })).filter((entry) => entry.count > 0);

  const grid = (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {places.map((place) => (
        <li data-nature-slug={place.placeSlug} key={place.placeSlug}>
          <NaturePlaceCard
            cityName={city.name}
            countryName={countryNameFor(place, country, city)}
            place={place}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <main>
      <JsonLd data={webpageSchema({ path, title, description })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={itemListSchema({
          name: title,
          description,
          items: places.map((place) => ({
            name: place.name,
            path: place.hasDetailPage
              ? nearbyWeekendPlaceRoute(place.placeSlug)
              : `${staticRoutes.nearbyWeekendPlaces}#${place.placeSlug}`,
          })),
        })}
      />

      {heroPlace?.image ? (
        <figure className="border-b border-neutral-border bg-surface-soft">
          <div className="mx-auto max-w-[1400px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={heroPlace.image.alt}
              className="block h-[220px] w-full object-cover sm:h-[300px] lg:h-[380px]"
              decoding="sync"
              fetchPriority="high"
              height={heroPlace.image.height}
              loading="eager"
              src={heroPlace.image.src}
              width={heroPlace.image.width}
            />
            <figcaption className="px-4 py-3 text-xs leading-5 text-text-secondary sm:px-6">
              {heroPlace.name} — {formatDistance(heroPlace.distanceKm)} from{" "}
              {city.name}.{" "}
              <span className="sr-only">Image credit: </span>
              Image: {heroPlace.image.attributionText}
            </figcaption>
          </div>
        </figure>
      ) : null}

      <PageHeader eyebrow={eyebrow} intro={description} title={title}>
        <dl className="grid gap-4">
          <Stat label="Places listed" value={String(places.length)} />
          {nearest ? (
            <Stat
              label="Closest"
              value={`${nearest.name} — ${formatDistanceShort(nearest.distanceKm)}`}
            />
          ) : null}
          {furthest && furthest !== nearest ? (
            <Stat
              label="Furthest listed"
              value={formatDistanceShort(furthest.distanceKm)}
            />
          ) : null}
          <Stat label="Last updated" value={LAST_UPDATED} />
          <Stat label="Data year" value={DATA_YEAR} />
        </dl>
      </PageHeader>

      <Container className="space-y-12 py-12">
        <BreadcrumbNav items={breadcrumbs} />

        <section
          aria-labelledby="nature-how-heading"
          className="rounded-2xl border border-neutral-border bg-surface-soft p-6"
        >
          <h2
            className="text-xl font-semibold text-text-primary"
            id="nature-how-heading"
          >
            How this list is built
          </h2>
          <p className="mt-3 text-sm leading-7 text-text-primary">
            Each place is classified from its own Wikidata type, not from its
            name, and is ordered by measured straight-line distance from the
            centre of {city.name}. Distances are great-circle kilometres between
            two published coordinates — this page does not publish travel times,
            transport schedules, opening hours, ticket prices, or rankings.
            Confirm access, facilities, and seasonal conditions with an official
            source before travelling.
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
                href={nearbyWeekendPlacesCityRoute(city.slug)}
              >
                All nearby weekend places
              </Link>
            </li>
            {hasWeekendTrip ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={weekendTripRoute(city.slug)}
                >
                  {city.name} weekend trip planning
                </Link>
              </li>
            ) : null}
          </ul>
        </section>

        {reachabilityBands.length > 0 ? (
          <section
            aria-labelledby="nature-reach-heading"
            className="rounded-2xl border border-neutral-border bg-white p-6"
          >
            <h2
              className="text-lg font-semibold text-text-primary"
              id="nature-reach-heading"
            >
              How far these are
            </h2>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Reachability is a second axis over the same places: the category
              says what a destination is, the band says how far it sits from{" "}
              {city.name}. Distances are measured in a straight line — this page
              publishes no travel times.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {reachabilityBands.map(({ band, count }) => (
                <li
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-border bg-surface-soft px-3 py-1.5 text-sm text-text-primary"
                  key={band}
                >
                  <span className="font-semibold">{count}</span>
                  <span className="text-text-secondary">
                    {REACHABILITY_BAND_LABEL[band].toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {categoryCounts.length > 0 ? (
          <section aria-labelledby="nature-breakdown-heading" className="space-y-4">
            <h2
              className="text-lg font-semibold text-text-primary"
              id="nature-breakdown-heading"
            >
              What is out there
            </h2>
            <ul className="flex flex-wrap gap-2">
              {categoryCounts.map((entry) => (
                <li
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-border bg-white px-3 py-1.5 text-sm text-text-primary"
                  key={entry.category}
                >
                  <span className="font-semibold">{entry.count}</span>
                  <span className="text-text-secondary">
                    {entry.count === 1
                      ? natureCategoryLabel(entry.category).toLowerCase()
                      : natureCategoryPlural(entry.category).toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="nature-places-heading" className="space-y-6">
          <SectionHeading
            description={`Ordered by straight-line distance from ${city.name}, closest first. ${bandDescription(bandsPresent)}`}
            title={`${places.length} ${places.length === 1 ? "place" : "places"} near ${city.name}`}
          />
          <h2 className="sr-only" id="nature-places-heading">
            Places near {city.name}
          </h2>
          {showFilters ? (
            <NatureFilterBar
              bandOptions={bandsPresent.map((band) => ({
                value: band,
                label: NATURE_BAND_LABEL[band],
              }))}
              categoryOptions={categoryCounts.map((entry) => ({
                value: entry.category,
                label: natureCategoryPlural(entry.category),
              }))}
              hasCrossBorder={crossBorder.length > 0}
              items={filterItems}
            >
              {grid}
            </NatureFilterBar>
          ) : (
            grid
          )}
        </section>

        {crossBorder.length > 0 ? (
          <section
            aria-labelledby="nature-cross-border-heading"
            className="rounded-2xl border border-neutral-border bg-white p-6"
          >
            <h2
              className="text-lg font-semibold text-text-primary"
              id="nature-cross-border-heading"
            >
              Across the border
            </h2>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {crossBorder.length}{" "}
              {crossBorder.length === 1 ? "place is" : "places are"} in a
              different country from {city.name}
              {country ? ` (${country.name})` : ""}. Each card names its
              country. Check entry requirements and border crossing rules before
              travelling.
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {crossBorderCountries.map((slug) => (
                <li key={slug}>
                  <Link
                    className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                    href={countryRoute(slug)}
                  >
                    {getCountryBySlug(slug)?.name ?? slug} country hub
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* A nav whose only entry is the page you are on is not navigation. */}
        {hasHub || segments.some((segment) => segment !== current) ? (
          <NatureExploreLinks
            cityName={city.name}
            citySlug={city.slug}
            current={current}
            includeHub={hasHub}
            segments={segments}
          />
        ) : null}
      </Container>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold text-text-primary">{value}</dd>
    </div>
  );
}

/**
 * Legend for the bands this page actually uses, with the boundaries read from
 * the band table rather than repeated as prose that could drift away from it.
 */
function bandDescription(bands: readonly NatureDistanceBand[]): string {
  if (bands.length === 0) return "";
  const parts = bands.map((band) => {
    const label = NATURE_BAND_LABEL[band].toLowerCase();
    const max = NATURE_BAND_MAX_KM[band];
    return Number.isFinite(max) ? `${label} is up to ${max} km` : `${label} is beyond ${NATURE_BAND_MAX_KM["day-trip"]} km`;
  });
  return `Distance bands: ${parts.join(", ")}.`;
}

function countryNameFor(
  place: CityNaturePlace,
  country: Country | undefined,
  city: City,
): string | undefined {
  if (!place.crossBorder) return country?.name ?? city.countryName;
  return getCountryBySlug(place.countrySlug)?.name ?? place.countrySlug;
}
