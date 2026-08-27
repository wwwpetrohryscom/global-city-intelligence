import Link from "next/link";
import {
  natureCategoryLabel,
  natureCategoryPlural,
} from "@/lib/nature/taxonomy";
import { cityNatureRoute } from "@/lib/seo/routes";
import type { CityNatureCategory } from "@/types";

/**
 * Compact nature summary for a city overview page.
 *
 * Shows counts for the categories the city actually has, capped at six so the
 * overview page does not turn into a second nature hub. A category with no
 * places is not rendered as a zero — it is simply absent.
 */
export function CityNatureModule({
  cityName,
  citySlug,
  categories,
  totalPlaces,
}: {
  cityName: string;
  citySlug: string;
  categories: readonly CityNatureCategory[];
  totalPlaces: number;
}) {
  const shown = categories.filter((entry) => entry.count > 0).slice(0, 6);
  if (shown.length === 0) return null;

  return (
    <section
      aria-labelledby="city-nature-module-heading"
      className="rounded-2xl border border-neutral-border bg-surface-soft p-6"
    >
      <h2
        className="text-xl font-semibold text-text-primary"
        id="city-nature-module-heading"
      >
        Nature near {cityName}
      </h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {totalPlaces} classified outdoor destinations within weekend reach,
        grouped by what kind of place they are. Distances are straight-line
        kilometres from the city centre.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {shown.map((entry) => (
          <li
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-border bg-white px-3 py-1.5 text-sm text-text-primary"
            key={entry.category}
          >
            <span className="font-semibold">{entry.count}</span>
            <span className="text-text-secondary">
              {(entry.count === 1
                ? natureCategoryLabel(entry.category)
                : natureCategoryPlural(entry.category)
              ).toLowerCase()}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4">
        <Link
          className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-600 underline decoration-brand-500 decoration-2 underline-offset-4 hover:bg-brand-50"
          href={cityNatureRoute(citySlug)}
        >
          Explore nature near {cityName}
        </Link>
      </p>
    </section>
  );
}
