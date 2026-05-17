import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCollectionIntentLabel } from "@/lib/data/queries";
import { getCollectionUrl, staticRoutes } from "@/lib/seo/routes";
import type { CountryCollectionMatch } from "@/lib/data/queries";

const SECTION_ID = "country-collections";

export function CountryCollectionsSection({
  countryName,
  matches,
}: {
  countryName: string;
  matches: CountryCollectionMatch[];
}) {
  return (
    <section aria-labelledby={`${SECTION_ID}-heading`} id={SECTION_ID}>
      <SectionHeading
        description={`Curated city collections that include at least one ${countryName} city. Each collection is a comparison-oriented shortlist, not an official ranking.`}
        title={`Best Cities collections featuring ${countryName}`}
      />
      <h2 className="sr-only" id={`${SECTION_ID}-heading`}>
        Best Cities collections featuring {countryName}
      </h2>
      {matches.length === 0 ? (
        <p className="mt-6 text-sm leading-6 text-text-secondary">
          No curated city collections currently reference {countryName} cities.
          Browse the{" "}
          <Link
            className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
            href={staticRoutes.collections}
          >
            Best Cities collections index
          </Link>{" "}
          for related shortlists.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {matches.map(({ collection, matchingCitySlugs }) => (
            <li key={collection.slug}>
              <Card as="article" className="h-full" interactive>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  {getCollectionIntentLabel(collection.intent)}
                </p>
                <h3 className="mt-2 text-base font-semibold text-text-primary">
                  <Link
                    className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                    href={getCollectionUrl(collection.slug)}
                  >
                    {collection.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  {collection.description}
                </p>
                <p className="mt-4 text-xs text-text-muted">
                  {matchingCitySlugs.length}{" "}
                  {matchingCitySlugs.length === 1
                    ? "city"
                    : "cities"}{" "}
                  from {countryName} in this collection
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
