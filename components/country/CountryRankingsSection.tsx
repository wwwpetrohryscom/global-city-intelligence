import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/section-heading";
import { rankingRoute, staticRoutes } from "@/lib/seo/routes";
import type { CountryRankingMatch } from "@/lib/data/queries";

const SECTION_ID = "country-rankings";

export function CountryRankingsSection({
  countryName,
  matches,
}: {
  countryName: string;
  matches: CountryRankingMatch[];
}) {
  return (
    <section aria-labelledby={`${SECTION_ID}-heading`} id={SECTION_ID}>
      <SectionHeading
        description={`Explore rankings where supported ${countryName} city profiles appear. Use rankings as directional city intelligence, not an official government ranking.`}
        title={`Rankings featuring ${countryName} cities`}
      />
      <h2 className="sr-only" id={`${SECTION_ID}-heading`}>
        Rankings featuring {countryName} cities
      </h2>
      {matches.length === 0 ? (
        <p className="mt-6 text-sm leading-6 text-text-secondary">
          No structured rankings currently include {countryName} city profiles.
          Browse the{" "}
          <Link
            className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
            href={staticRoutes.rankings}
          >
            full rankings directory
          </Link>{" "}
          for global comparisons.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {matches.map(({ ranking, matchingCitySlugs }) => (
            <li key={ranking.slug}>
              <Card as="article" className="h-full" interactive>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Ranking
                </p>
                <h3 className="mt-2 text-base font-semibold text-text-primary">
                  <Link
                    className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                    href={rankingRoute(ranking.slug)}
                  >
                    {ranking.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  {ranking.description}
                </p>
                <p className="mt-4 text-xs text-text-muted">
                  {matchingCitySlugs.length}{" "}
                  {matchingCitySlugs.length === 1 ? "city" : "cities"} from{" "}
                  {countryName} appears in this ranking
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-sm leading-6 text-text-secondary">
        See the{" "}
        <Link
          className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
          href={staticRoutes.rankings}
        >
          full rankings directory
        </Link>{" "}
        for every available structured ranking.
      </p>
    </section>
  );
}
