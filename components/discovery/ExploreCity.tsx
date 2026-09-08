import { EcosystemLink } from "@/components/navigation/EcosystemLink";
import { PLACES_PUBLIC } from "@/lib/navigation/ecosystem";
import { placesLinkForCity } from "@/lib/navigation/places";
import {
  publishedRankings,
  type RankingRegistryEntry,
} from "@/lib/navigation/rankings-registry";
import { blogUrl } from "@/lib/navigation/ecosystem";
import { staticRoutes } from "@/lib/seo/routes";

/**
 * EXPLORE <CITY> — one cross-product module, shared by every city page.
 *
 * WHAT IT IS FOR: a city page was the end of the road. From Singapore you
 * could reach Singapore's own sections, but not the Places coverage of the
 * same city, not the rankings it appears in, not the editorial layer. This is
 * the one surface that connects a city across the three GCI products.
 *
 * WRITTEN ONCE, NOT 4,442 TIMES. Every link is resolved from a registry:
 * ranking routes from `lib/navigation/rankings-registry`, the Places route
 * from the committed Places manifest, the rest from `lib/seo/routes`. No route
 * is assembled from a guess about what probably exists.
 *
 * TWO KINDS OF LINK, KEPT APART:
 *
 *   "Rankings featuring this city" lists only shortlists that actually name
 *   this city in their data. Membership is a fact read from the collection's
 *   own citySlugs, never inferred from the city's scores and never implied by
 *   the mere existence of both pages.
 *
 *   "Explore rankings" is a set of global entry points. They are labelled as
 *   what they are — "Families ranking", not "a top family city" — because the
 *   ranking page is what the link leads to and no claim about this city is
 *   being made by linking to it.
 */
export interface ExploreCityProps {
  citySlug: string;
  cityName: string;
  /** Registry ids of shortlists that name this city. Resolved by the caller. */
  memberRankingIds: string[];
}

/** The global ranking entry points offered on a city page, in this order. */
const CITY_RANKING_ENTRY_POINTS = [
  "collection:best-cities-for-public-transport",
  "collection:best-cities-for-families",
  "collection:best-cities-for-startups",
  "collection:best-cities-for-remote-workers",
  "collection:best-cities-for-clean-air",
  "ranking:most-affordable-global-cities",
];

export function ExploreCity({
  citySlug,
  cityName,
  memberRankingIds,
}: ExploreCityProps) {
  const byId = new Map(publishedRankings().map((entry) => [entry.id, entry]));

  const memberships = memberRankingIds
    .map((id) => byId.get(id))
    .filter((entry): entry is RankingRegistryEntry => Boolean(entry));

  const memberIds = new Set(memberships.map((entry) => entry.id));
  const entryPoints = CITY_RANKING_ENTRY_POINTS.map((id) => byId.get(id))
    .filter((entry): entry is RankingRegistryEntry => Boolean(entry))
    // A shortlist this city is already listed in appears above, with the
    // stronger statement. Repeating it here as a generic link would be noise.
    .filter((entry) => !memberIds.has(entry.id));

  const places = placesLinkForCity(citySlug);

  return (
    <section
      aria-labelledby="explore-city-heading"
      className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm"
    >
      <h2
        className="text-2xl font-semibold text-text-primary"
        id="explore-city-heading"
      >
        Explore {cityName}
      </h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {cityName} across Global City Intelligence — comparisons, rankings
        {places ? ", places" : ""} and editorial coverage.
      </p>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* The curated directory, not /compare-cities: that page is
            deliberately noindex (its content is a query parameter), so 4,442
            city pages should not point crawlers at it. */}
        <ExploreLink
          description="Curated city-vs-city comparisons."
          href={staticRoutes.compare}
          label="Compare cities"
        />
        {places ? (
          <ExploreLink
            description={
              places.cityScoped
                ? `Verified places and neighbourhoods in ${cityName}.`
                : "Verified places and neighbourhoods across GCI Places."
            }
            href={places.href}
            label={places.cityScoped ? `Places in ${cityName}` : "GCI Places"}
          />
        ) : null}
        <ExploreLink
          description="Every published ranking and shortlist."
          href={staticRoutes.rankings}
          label="All rankings"
        />
        <ExploreLink
          description="Curated city shortlists by intent."
          href={staticRoutes.collections}
          label="Best Cities shortlists"
        />
        <ExploreLink
          description="Analysis and data stories from GCI Media."
          href={blogUrl("/cities")}
          label="City stories"
        />
      </ul>

      {memberships.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-text-primary">
            Shortlists that include {cityName}
          </h3>
          <p className="mt-1 text-xs leading-5 text-text-secondary">
            {cityName} is named in these curated shortlists. Each states its own
            selection criteria.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {memberships.map((entry) => (
              <li key={entry.id}>
                <EcosystemLink
                  className="inline-flex min-h-10 items-center rounded-full border border-eco-200 bg-eco-50/70 px-3.5 text-sm font-medium text-eco-800 transition hover:border-eco-300 hover:bg-eco-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500"
                  href={entry.route}
                >
                  {entry.shortLabel}
                </EcosystemLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {entryPoints.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-text-primary">
            Explore rankings
          </h3>
          <p className="mt-1 text-xs leading-5 text-text-secondary">
            Global ranking pages. Linking to one says nothing about how{" "}
            {cityName} places in it.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {entryPoints.map((entry) => (
              <li key={entry.id}>
                <EcosystemLink
                  className="inline-flex min-h-10 items-center rounded-full border border-neutral-border bg-surface-soft px-3.5 text-sm text-text-secondary transition hover:border-eco-200 hover:bg-eco-50 hover:text-eco-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500"
                  href={entry.route}
                >
                  {entry.shortLabel} ranking
                </EcosystemLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!PLACES_PUBLIC ? (
        // Deliberately silent. GCI Places is not yet reachable on this domain,
        // and announcing a product a reader cannot open is worse than not
        // mentioning it. The module gains the Places entry the moment the
        // PLACES_PUBLIC switch is flipped.
        null
      ) : null}
    </section>
  );
}

function ExploreLink({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <li>
      <EcosystemLink
        className="group flex h-full flex-col rounded-xl border border-neutral-border bg-surface-soft p-4 transition hover:border-eco-300 hover:bg-eco-50/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500"
        href={href}
      >
        <span className="text-sm font-semibold text-text-primary group-hover:text-eco-800">
          {label}
        </span>
        <span className="mt-1 text-xs leading-5 text-text-secondary">
          {description}
        </span>
      </EcosystemLink>
    </li>
  );
}
