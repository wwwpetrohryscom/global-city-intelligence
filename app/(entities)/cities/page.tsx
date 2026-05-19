import type { Metadata } from "next";
import Link from "next/link";
import { CityCard } from "@/components/cards/CityCard";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { HubNav } from "@/components/navigation/HubNav";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllCities,
  getAllCountries,
  getCitiesByCountrySlug,
} from "@/lib/data/queries";
import { staticBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import {
  cityRoute,
  countryRoute,
  staticRoutes,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

const title = "Global City Intelligence Directory";
const description =
  "Browse every indexed city profile and compare structured indicators across affordability, air quality, energy readiness, resilience, public safety, healthcare, and transport. All city links are server-rendered and crawlable.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.cities,
});

export default function CitiesIndexPage() {
  const cities = getAllCities();
  const countries = getAllCountries();
  const breadcrumbs = staticBreadcrumbs("Cities", staticRoutes.cities);

  const countriesWithCities = countries
    .map((country) => ({
      country,
      cities: getCitiesByCountrySlug(country.slug),
    }))
    .filter((entry) => entry.cities.length > 0)
    .sort((a, b) => a.country.name.localeCompare(b.country.name));

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: staticRoutes.cities,
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <PageHeader
        eyebrow="Directory"
        intro={description}
        title={title}
      >
        <dl className="grid gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Cities indexed
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {cities.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Countries covered
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {countriesWithCities.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Last updated
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {LAST_UPDATED}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {DATA_YEAR}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-12 py-12">
        <BreadcrumbNav items={breadcrumbs} />
        <HubNav activeHref={staticRoutes.cities} />

        <section>
          <SectionHeading
            description="Each card opens the full city profile with structured indicators, source-attributed emergency and healthcare information, and crawlable internal links to module and ranking pages."
            title="All indexed cities"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {cities.map((city) => (
              <CityCard city={city} key={city.slug} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            description="A complete index of cities grouped by country, fully present in the initial HTML so every link is crawlable without client-side JavaScript."
            title="Cities by country"
          />
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {countriesWithCities.map(({ country, cities: countryCities }) => (
              <article
                className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm"
                key={country.slug}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  {country.region}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-text-primary">
                  <Link
                    className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                    href={countryRoute(country.slug)}
                  >
                    {country.name}
                  </Link>
                </h3>
                <ul className="mt-3 grid grid-cols-1 gap-1 text-sm">
                  {countryCities
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((city) => (
                      <li key={city.slug}>
                        <Link
                          className="text-text-secondary hover:text-brand-500"
                          href={cityRoute(city.slug)}
                        >
                          {city.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-border bg-surface-soft p-6">
          <h2 className="text-2xl font-semibold text-text-primary">
            How to use this directory
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
            Each city profile combines structured indicators (affordability,
            air quality, energy, resilience), source-attributed verified
            layers (emergency contacts, healthcare access, transport
            authorities where available), and crawlable internal links to
            module and ranking pages. Indicators are directional; for
            critical decisions, follow the official source links cited on
            each page.
          </p>
          <ul className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.countries}
              >
                Country intelligence directory
              </Link>
              <span className="text-text-secondary">
                {" "}
                — national context for every supported country.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.rankings}
              >
                Global rankings
              </Link>
              <span className="text-text-secondary">
                {" "}
                — compare cities through structured tables.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.methodology}
              >
                Scoring methodology
              </Link>
              <span className="text-text-secondary">
                {" "}
                — how indicators are constructed and read.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.dataSources}
              >
                Data sources
              </Link>
              <span className="text-text-secondary">
                {" "}
                — the official registry behind verified layers.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.collections}
              >
                Best Cities collections
              </Link>
              <span className="text-text-secondary">
                {" "}
                — curated city shortlists by intent.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.costOfLivingCalculator}
              >
                Cost of living calculator
              </Link>
              <span className="text-text-secondary">
                {" "}
                — planning a move or longer stay? Use your own budget inputs
                to compare monthly costs between cities. Not an official
                cost-of-living measurement.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.travelBudgetCalculator}
              >
                Travel budget calculator
              </Link>
              <span className="text-text-secondary">
                {" "}
                — planning a visit or shorter stay? Use your own trip inputs
                to estimate accommodation, food, transport, activities,
                travel, and emergency buffer. Not an official travel cost
                estimate.
              </span>
            </li>
          </ul>
        </section>
      </Container>
    </main>
  );
}
