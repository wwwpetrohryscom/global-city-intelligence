import Link from "next/link";
import { getComparisonIntentLabel } from "@/lib/data/comparisons";
import { comparisonRoute } from "@/lib/seo/routes";
import type { CityComparison } from "@/types";

export function RelatedComparisons({
  comparisons,
}: {
  comparisons: CityComparison[];
}) {
  if (comparisons.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-comparisons-heading"
      className="space-y-4"
    >
      <div className="max-w-3xl">
        <h2
          className="text-2xl font-semibold text-text-primary"
          id="related-comparisons-heading"
        >
          Related comparisons
        </h2>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Pairs that share a city, comparison intent, or region — useful for
          users planning a wider relocation, remote-work, or business decision.
        </p>
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {comparisons.map((comparison) => (
          <li key={comparison.slug}>
            <Link
              className="block rounded-2xl border border-neutral-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md"
              href={comparisonRoute(comparison.slug)}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {comparison.region} ·{" "}
                {getComparisonIntentLabel(comparison.comparisonIntent)}
              </p>
              <p className="mt-2 text-base font-semibold text-text-primary">
                {comparison.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {comparison.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
