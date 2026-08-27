import Link from "next/link";
import { Card } from "@/components/ui/Card";
import {
  NATURE_BAND_LABEL,
  formatDistance,
} from "@/lib/nature/distance";
import { natureCategoryLabel } from "@/lib/nature/taxonomy";
import { nearbyWeekendPlaceRoute, staticRoutes } from "@/lib/seo/routes";
import type { CityNaturePlace } from "@/types";

/**
 * One outdoor destination, as it relates to one city.
 *
 * Everything on the card is measured or quoted: the distance is great-circle
 * kilometres between two published coordinates, the type label is the English
 * label of the place's own Wikidata type, and the summary is the corpus
 * summary. Nothing is generated prose, and no travel time is shown, because
 * the repository has no routing data to derive one from.
 */
export function NaturePlaceCard({
  place,
  cityName,
  countryName,
}: {
  place: CityNaturePlace;
  cityName: string;
  countryName?: string;
}) {
  const href = place.hasDetailPage
    ? nearbyWeekendPlaceRoute(place.placeSlug)
    : `${staticRoutes.nearbyWeekendPlaces}#${place.placeSlug}`;

  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">
      {place.image ? (
        <div className="border-b border-neutral-border/85 bg-surface-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={place.image.alt}
            className="block h-44 w-full object-cover"
            decoding="async"
            height={place.image.height}
            loading="lazy"
            src={place.image.src}
            width={place.image.width}
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-eco-200 bg-eco-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-eco-800">
            {natureCategoryLabel(place.primary)}
          </span>
          <span className="inline-flex items-center rounded-full border border-neutral-border bg-surface-soft px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.06em] text-text-secondary">
            {NATURE_BAND_LABEL[place.band]}
          </span>
          {place.crossBorder && countryName ? (
            <span className="inline-flex items-center rounded-full border border-neutral-border bg-white px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.06em] text-text-secondary">
              Across the border · {countryName}
            </span>
          ) : null}
        </div>

        <h3 className="text-base font-semibold leading-6 text-text-primary">
          <Link
            className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
            href={href}
          >
            {place.name}
          </Link>
        </h3>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-text-muted">
              Straight-line distance
            </dt>
            <dd className="mt-0.5 font-medium text-text-primary">
              {formatDistance(place.distanceKm)}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-text-muted">
              Recorded type
            </dt>
            <dd className="mt-0.5 font-medium text-text-primary">
              {place.typeLabel ?? natureCategoryLabel(place.primary)}
            </dd>
          </div>
        </dl>

        <p className="text-sm leading-6 text-text-secondary">{place.summary}</p>

        <p className="mt-auto pt-1">
          <Link
            className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-600 underline decoration-brand-500 decoration-2 underline-offset-4 hover:bg-brand-50"
            href={href}
          >
            View place
            <span className="sr-only">
              {" "}
              — {place.name}, {formatDistance(place.distanceKm)} from {cityName}
            </span>
          </Link>
        </p>

        {place.image ? (
          <p className="text-[11px] leading-4 text-text-muted">
            <span className="sr-only">Image credit: </span>
            Image: {place.image.attributionText}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
