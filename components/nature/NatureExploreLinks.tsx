import Link from "next/link";
import { NATURE_ROUTE_LABEL } from "@/lib/nature/taxonomy";
import { cityNatureCategoryRoute, cityNatureRoute } from "@/lib/seo/routes";
import type { NatureRouteSegment } from "@/types";

/**
 * One compact contextual row, not a link farm.
 *
 * Only routes that actually exist for this city are listed, and the row the
 * reader is already on is rendered as plain text rather than a self-link.
 */
export function NatureExploreLinks({
  cityName,
  citySlug,
  segments,
  current,
  includeHub = true,
}: {
  cityName: string;
  citySlug: string;
  segments: readonly NatureRouteSegment[];
  current?: NatureRouteSegment | "hub";
  includeHub?: boolean;
}) {
  if (segments.length === 0 && !includeHub) return null;

  return (
    <nav aria-label={`Nature near ${cityName}`} className="text-sm">
      <span className="font-semibold text-text-primary">
        Explore nature near {cityName}:
      </span>{" "}
      <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-2">
        {includeHub ? (
          <Item
            current={current === "hub"}
            href={cityNatureRoute(citySlug)}
            label="All nature"
          />
        ) : null}
        {segments.map((segment) => (
          <Item
            current={current === segment}
            href={cityNatureCategoryRoute(citySlug, segment)}
            key={segment}
            label={NATURE_ROUTE_LABEL[segment]}
          />
        ))}
      </ul>
    </nav>
  );
}

function Item({
  href,
  label,
  current,
}: {
  href: string;
  label: string;
  current: boolean;
}) {
  return (
    <li>
      {current ? (
        <span
          aria-current="page"
          className="inline-flex min-h-[44px] items-center rounded-full border border-eco-200 bg-eco-50 px-3.5 py-2 text-sm font-semibold text-eco-800"
        >
          {label}
        </span>
      ) : (
        <Link
          className="inline-flex min-h-[44px] items-center rounded-full border border-neutral-border bg-white px-3.5 py-2 text-sm font-medium text-text-secondary hover:border-eco-200 hover:bg-eco-50/40 hover:text-eco-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          href={href}
        >
          {label}
        </Link>
      )}
    </li>
  );
}
