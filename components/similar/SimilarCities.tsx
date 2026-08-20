import Link from "next/link";
import { bandLabel, type SimilarHit } from "@/lib/similar/engine";

/**
 * Similar Cities — SERVER component.
 *
 * Six compact, crawlable cards. Every recommendation arrives precomputed as
 * primitive props; no statistics run here and no client JS is added. The
 * interactive layer (alternatives, save, compare) is the separate client
 * component rendered after this section.
 */
export function SimilarCities({
  cityName,
  citySlug,
  hits,
  countryNames,
}: {
  cityName: string;
  citySlug: string;
  hits: SimilarHit[];
  countryNames: string[];
}) {
  /**
   * 52 of 4,195 valid cities (1.2%) have no city within the somewhat-similar
   * band — Singapore's nearest peer sits at 0.105 and Reykjavík's at 0.082,
   * roughly twice the band edge. Saying so is more useful than an absent
   * section, and far more honest than widening the band until every city has
   * a "match". The copy states a search result, never a property of the
   * city: the alternatives explorer below still works for them.
   */
  if (hits.length === 0) {
    return (
      <section aria-labelledby="similar-cities-heading" id="similar-cities" className="space-y-2">
        <h2 className="text-xl font-semibold text-text-primary" id="similar-cities-heading">
          Cities similar to {cityName}
        </h2>
        <p className="text-sm text-text-secondary">
          No close match found using the currently published Global City Intelligence
          indicators — no candidate city met the similarity threshold this model
          applies. That is a result of what is measured here, not a statement that no
          comparable city exists. You can still explore alternatives that improve a
          specific indicator below.
        </p>
      </section>
    );
  }
  return (
    <section aria-labelledby="similar-cities-heading" id="similar-cities" className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-text-primary" id="similar-cities-heading">
          Cities similar to {cityName}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Cities with comparable characteristics based on the indicators currently
          published by Global City Intelligence.
        </p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {hits.map((hit, i) => (
          <li key={hit.city.s}>
            <Link
              href={`/cities/${hit.city.s}`}
              className="flex h-full min-h-11 flex-col gap-1 rounded-xl border border-neutral-border bg-white p-3 transition-colors hover:border-eco-300 hover:bg-eco-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500"
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate font-medium text-text-primary">{hit.city.n}</span>
                <span className="shrink-0 rounded-md bg-eco-50 px-1.5 py-0.5 text-[11px] font-medium text-eco-800">
                  {bandLabel(hit.band)}
                </span>
              </span>
              <span className="text-xs text-text-secondary">{countryNames[i]}</span>
              <span className="mt-1 text-xs leading-5 text-text-secondary">
                {hit.sharedTraits.length > 0
                  ? `Comparable ${hit.sharedTraits.join(", ")}`
                  : "Broadly comparable profile"}
                {hit.keyDifference ? `; ${hit.keyDifference}.` : "."}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`/explore-cities?similarTo=${citySlug}`}
        className="inline-flex min-h-11 items-center text-sm font-medium text-eco-700 underline decoration-eco-300 decoration-2 underline-offset-4 hover:decoration-eco-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500 lg:min-h-9"
      >
        Explore all cities similar to {cityName}
      </Link>
    </section>
  );
}
