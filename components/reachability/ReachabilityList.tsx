import Link from "next/link";
import { natureCategoryLabel } from "@/lib/nature/taxonomy";
import type { ReachabilityDestination } from "@/lib/reachability/types";

/**
 * One reachability destination, as a compact row.
 *
 * Deliberately a link row rather than an image card: these blocks are added to
 * four page families across 4,442 cities, and image cards at that multiplier
 * would cost more artifact than the feature is worth. The nature pages already
 * carry the imagery.
 *
 * Every row states measured straight-line distance. None states a travel time —
 * the repository has no routing data, so a duration would be invented.
 */
export function ReachabilityRow({
  destination,
}: {
  destination: ReachabilityDestination;
}) {
  const kind =
    destination.kind === "city"
      ? "City"
      : destination.category
        ? natureCategoryLabel(destination.category)
        : "Nature";

  return (
    <li className="flex flex-wrap items-baseline gap-x-2 gap-y-1 py-1.5">
      <Link
        className="text-sm font-medium text-text-primary decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
        href={destination.href}
      >
        {destination.name}
      </Link>
      <span className="text-xs text-text-muted">{kind}</span>
      <span className="text-xs font-medium text-text-secondary">
        {Math.round(destination.distanceKm)} km
      </span>
      {destination.crossBorder ? (
        <span className="rounded-full border border-neutral-border bg-white px-2 py-0.5 text-[11px] font-medium text-text-secondary">
          Across the border · {destination.countryName}
        </span>
      ) : null}
    </li>
  );
}

export function ReachabilityList({
  destinations,
  ariaLabel,
}: {
  destinations: readonly ReachabilityDestination[];
  ariaLabel: string;
}) {
  if (destinations.length === 0) return null;
  return (
    <ul aria-label={ariaLabel} className="divide-y divide-neutral-border/70">
      {destinations.map((destination) => (
        <ReachabilityRow
          destination={destination}
          key={`${destination.kind}:${destination.slug}`}
        />
      ))}
    </ul>
  );
}
