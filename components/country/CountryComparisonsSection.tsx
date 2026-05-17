import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { getComparisonIntentLabel } from "@/lib/data/queries";
import { comparisonRoute, staticRoutes } from "@/lib/seo/routes";
import type { CityComparison } from "@/types";

const SECTION_ID = "country-comparisons";

export function CountryComparisonsSection({
  countryName,
  comparisons,
}: {
  countryName: string;
  comparisons: CityComparison[];
}) {
  return (
    <section aria-labelledby={`${SECTION_ID}-heading`} id={SECTION_ID}>
      <SectionHeading
        description={`Curated city-vs-city comparisons that include at least one city from ${countryName}. Each link opens a comparison page with structured indicators across cost, safety, healthcare, transport, and country context.`}
        title={`Related city comparisons for ${countryName}`}
      />
      <h2 className="sr-only" id={`${SECTION_ID}-heading`}>
        Related city comparisons for {countryName}
      </h2>
      {comparisons.length === 0 ? (
        <p className="mt-6 text-sm leading-6 text-text-secondary">
          No curated city comparisons reference {countryName} yet. Browse the{" "}
          <Link
            className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
            href={staticRoutes.compare}
          >
            full city comparison directory
          </Link>{" "}
          for cross-country comparisons.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {comparisons.map((comparison) => (
            <li key={comparison.slug}>
              <Link
                className="block h-full rounded-2xl border border-neutral-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md"
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
      )}
    </section>
  );
}
