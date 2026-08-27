import Link from "next/link";
import { REACHABILITY_BAND_ORDER, REACHABILITY_BAND_LABEL } from "@/lib/reachability/bands";
import { selectForBand } from "@/lib/reachability/engine";
import { nearbyWeekendPlacesCityRoute } from "@/lib/seo/routes";
import type { CityReachability } from "@/lib/reachability/types";

/**
 * Compact "Around {City}" block for the city overview.
 *
 * The overview already carries a great deal; this stays to one line per band
 * plus a single link onward, rather than repeating the full reachability
 * sections that the nearby-weekend-places page renders.
 */
export function AroundCityModule({
  reach,
  cityName,
  citySlug,
  hasNearbyPage,
}: {
  reach: CityReachability;
  cityName: string;
  citySlug: string;
  hasNearbyPage: boolean;
}) {
  const rows = REACHABILITY_BAND_ORDER.map((band) => ({
    band,
    items: selectForBand(reach, band, 3),
  })).filter((row) => row.items.length > 0);

  if (rows.length === 0) return null;

  return (
    <section
      aria-labelledby="around-city-heading"
      className="rounded-2xl border border-neutral-border bg-surface-soft p-6"
    >
      <h2
        className="text-xl font-semibold text-text-primary"
        id="around-city-heading"
      >
        Around {cityName}
      </h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {reach.destinations.length} indexed destinations within reach —{" "}
        {reach.cities.length} cities and {reach.nature.length} natural places —
        grouped by measured straight-line distance.
        {reach.crossBorderCountries.length > 0
          ? ` Cross-border options reach ${reach.crossBorderCountries.join(", ")}.`
          : ""}
      </p>
      <dl className="mt-4 space-y-3">
        {rows.map(({ band, items }) => (
          <div className="flex flex-wrap items-baseline gap-x-2" key={band}>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              {REACHABILITY_BAND_LABEL[band]}
            </dt>
            <dd className="text-sm text-text-primary">
              {items.map((destination, index) => (
                <span key={`${destination.kind}:${destination.slug}`}>
                  {index > 0 ? <span aria-hidden="true"> · </span> : null}
                  <Link
                    className="text-text-primary decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                    href={destination.href}
                  >
                    {destination.name}
                  </Link>
                  <span className="text-text-muted">
                    {" "}
                    {Math.round(destination.distanceKm)} km
                  </span>
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      {hasNearbyPage ? (
        <p className="mt-4">
          <Link
            className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-600 underline decoration-brand-500 decoration-2 underline-offset-4 hover:bg-brand-50"
            href={nearbyWeekendPlacesCityRoute(citySlug)}
          >
            Explore everything within reach of {cityName}
          </Link>
        </p>
      ) : null}
    </section>
  );
}
