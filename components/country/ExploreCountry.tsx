import { EcosystemLink } from "@/components/navigation/EcosystemLink";
import { blogUrl, PLACES_PUBLIC, placesIndexUrl } from "@/lib/navigation/ecosystem";
import { PLACES_CITIES } from "@/lib/navigation/places";
import { staticRoutes } from "@/lib/seo/routes";

/**
 * EXPLORE <COUNTRY> — the country-page counterpart of the city module.
 *
 * PART W wants a country page to lead onward: to its cities, to the rankings,
 * to comparisons, and to Places and Media where those are genuinely relevant.
 *
 * "WHERE RELEVANT" IS A DATA QUESTION, NOT A GUESS. The Places entry appears
 * only when this country actually contains a city with a published Places hub,
 * and it names those cities. A country with no Places coverage gets no Places
 * link at all — not a country-shaped Places URL, which does not exist in that
 * product's route architecture.
 */
export function ExploreCountry({
  countryName,
  citySlugs,
}: {
  countryName: string;
  /** The country's own city slugs, used to test real Places coverage. */
  citySlugs: string[];
}) {
  const placesCities = PLACES_PUBLIC
    ? PLACES_CITIES.filter((city) => citySlugs.includes(city.gciCitySlug))
    : [];

  return (
    <section
      aria-labelledby="explore-country-heading"
      className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm"
    >
      <h2
        className="text-2xl font-semibold text-text-primary"
        id="explore-country-heading"
      >
        Explore {countryName} across Global City Intelligence
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ExploreLink
          description={`Every indexed city profile in ${countryName}.`}
          href="#country-cities"
          label={`Cities in ${countryName}`}
        />
        <ExploreLink
          description="Every published ranking and shortlist."
          href={staticRoutes.rankings}
          label="Rankings"
        />
        <ExploreLink
          description="Curated city-vs-city comparisons."
          href={staticRoutes.compare}
          label="Compare cities"
        />
        <ExploreLink
          description="Browse all countries in order of economic size."
          href={staticRoutes.countries}
          label="All countries"
        />
        <ExploreLink
          description="Analysis and data stories from GCI Media."
          href={blogUrl("/cities")}
          label="City stories"
        />
        {placesCities.length > 0 ? (
          <ExploreLink
            description={`Verified places in ${placesCities
              .map((city) => city.name)
              .join(", ")}.`}
            href={placesIndexUrl()}
            label="GCI Places"
          />
        ) : null}
      </ul>
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
