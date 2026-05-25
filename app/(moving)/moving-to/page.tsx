import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { HubNav } from "@/components/navigation/HubNav";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllCountries,
  getAllMovingToCityPages,
  getCityBySlug,
  getCountryBySlug,
  getMovingFocusLabel,
  hasArrivalPage,
  hasNeighborhoodPlanningPage,
} from "@/lib/data/queries";
import { staticBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import {
  absoluteUrl,
  arrivalRoute,
  cityRoute,
  countryRoute,
  movingToCityRoute,
  neighborhoodPlanningRoute,
  staticRoutes,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

const title = "Moving to City Planning Guides";
const description =
  "Browse moving-to city planning guides for relocation research, arrival planning, neighborhood research, cost tools, healthcare context, public safety context, transport notes, methodology, and source transparency.";
const introParagraph =
  "Each guide links back to the structured city profile, country hub, neighborhood research, arrival planning, public-safety references, healthcare access notes, transport-authority context, budget tools, methodology, and the data sources registry. These pages support relocation research only — they are not immigration, visa, tax, legal, financial, medical, rental, or property advice. Verify legal, immigration, tax, housing, and healthcare details with official or qualified sources.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.movingTo,
});

export default function MovingToDirectoryPage() {
  const movingPages = getAllMovingToCityPages();
  const breadcrumbs = staticBreadcrumbs("Moving to", staticRoutes.movingTo);
  const countries = getAllCountries();

  const guides = movingPages
    .map((page) => {
      const city = getCityBySlug(page.citySlug);
      if (!city) {
        return undefined;
      }
      const country = getCountryBySlug(city.countrySlug);
      return { page, city, country };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .sort((a, b) => a.city.name.localeCompare(b.city.name));

  const countryCount = new Set(guides.map((entry) => entry.city.countrySlug))
    .size;

  const guidesByCountry = countries
    .map((country) => ({
      country,
      entries: guides
        .filter((entry) => entry.city.countrySlug === country.slug)
        .sort((a, b) => a.city.name.localeCompare(b.city.name)),
    }))
    .filter((entry) => entry.entries.length > 0)
    .sort((a, b) => a.country.name.localeCompare(b.country.name));

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description,
    url: absoluteUrl(staticRoutes.movingTo),
    numberOfItems: guides.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: guides.map((entry) => ({
      "@type": "ListItem",
      name: `Moving to ${entry.city.name}: Planning Guide`,
      url: absoluteUrl(movingToCityRoute(entry.city.slug)),
    })),
  };

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: staticRoutes.movingTo,
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={itemListSchema} />

      <PageHeader eyebrow="Moving to" intro={introParagraph} title={title}>
        <dl className="grid gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Moving-to guides
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {guides.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Countries represented
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {countryCount}
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
        <HubNav />

        <section
          aria-labelledby="moving-directory-scope-heading"
          className="rounded-2xl border border-neutral-border bg-surface-soft p-6"
        >
          <h2
            className="text-2xl font-semibold text-text-primary"
            id="moving-directory-scope-heading"
          >
            Sources and methodology
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
            Moving-to guides are relocation research context only — they do not
            publish visa or immigration steps, tax rules, rental law, rent or
            sale prices, salary expectations, exact moving costs, crime rates,
            school rankings, hospital proximities, transit operators, or
            neighborhood &ldquo;best&rdquo; / &ldquo;safest&rdquo; /
            &ldquo;cheapest&rdquo; claims. For time-sensitive details, always
            confirm with the official government source, landlord, agent, or
            qualified professional. Read the{" "}
            <Link
              className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
              href={staticRoutes.methodology}
            >
              scoring methodology
            </Link>{" "}
            for how structured indicators are constructed, and the{" "}
            <Link
              className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
              href={staticRoutes.dataSources}
            >
              data sources
            </Link>{" "}
            registry for the official publishers cited across the platform.
          </p>
        </section>

        <section aria-labelledby="moving-directory-grid-heading">
          <SectionHeading
            description="Each card opens a moving-to planning guide with links to the structured city profile, country hub, neighborhood planning, arrival planning, public-safety references, healthcare context, transport context, and budgeting tools."
            title="All moving-to planning guides"
          />
          <h2 className="sr-only" id="moving-directory-grid-heading">
            All moving-to planning guides
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {guides.map(({ page, city, country }) => {
              const cityHasArrival = hasArrivalPage(city.slug);
              const cityHasNeighborhood = hasNeighborhoodPlanningPage(
                city.slug,
              );
              return (
                <li key={page.citySlug}>
                  <Card as="article" className="h-full" interactive>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      {country ? country.name : "Indexed city"}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-text-primary">
                      <Link
                        className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                        href={movingToCityRoute(city.slug)}
                      >
                        {`Moving to ${city.name}`}
                      </Link>
                    </h3>
                    <p className="mt-1 text-xs font-medium text-text-secondary">
                      {getMovingFocusLabel(page.movingFocus)}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                      {page.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <Link
                        className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                        href={movingToCityRoute(city.slug)}
                      >
                        {`Open the ${city.name} moving-to guide`}
                      </Link>
                      <Link
                        className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                        href={cityRoute(city.slug)}
                      >
                        {`${city.name} city profile`}
                      </Link>
                      {country ? (
                        <Link
                          className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                          href={countryRoute(country.slug)}
                        >
                          {`${country.name} country hub`}
                        </Link>
                      ) : null}
                      {cityHasNeighborhood ? (
                        <Link
                          className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                          href={neighborhoodPlanningRoute(city.slug)}
                        >
                          {`${city.name} neighborhood guide`}
                        </Link>
                      ) : null}
                      {cityHasArrival ? (
                        <Link
                          className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                          href={arrivalRoute(city.slug)}
                        >
                          {`${city.name} arrival guide`}
                        </Link>
                      ) : null}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="moving-directory-country-heading">
          <SectionHeading
            description="A complete index of moving-to planning guides grouped by country, fully present in the initial HTML so every link is crawlable without client-side JavaScript."
            title="Moving-to guides by country"
          />
          <h2 className="sr-only" id="moving-directory-country-heading">
            Moving-to guides by country
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {guidesByCountry.map(({ country, entries }) => (
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
                  {entries.map(({ city }) => (
                    <li key={city.slug}>
                      <Link
                        className="text-text-secondary hover:text-brand-500"
                        href={movingToCityRoute(city.slug)}
                      >
                        {`Moving to ${city.name}`}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="moving-directory-related-heading"
          className="rounded-2xl border border-neutral-border bg-surface-soft p-6"
        >
          <h2
            className="text-2xl font-semibold text-text-primary"
            id="moving-directory-related-heading"
          >
            Continue exploring
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
            Use the structured city and country profiles, comparisons, arrival
            planning, and planning tools alongside any moving-to guide.
            Calculators use your own inputs and do not query housing, salary,
            or transport providers — they do not publish live prices, rents, or
            schedules.
          </p>
          <ul className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.cities}
              >
                Cities directory
              </Link>
              <span className="text-text-secondary">
                {" "}
                — every indexed city profile with structured indicators.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.countries}
              >
                Countries directory
              </Link>
              <span className="text-text-secondary">
                {" "}
                — national context for every supported country.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.compare}
              >
                City comparisons
              </Link>
              <span className="text-text-secondary">
                {" "}
                — side-by-side directional comparisons between cities.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.arrival}
              >
                Arrival planning guides
              </Link>
              <span className="text-text-secondary">
                {" "}
                — first-day planning context paired with moving-to research.
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
                — estimate a monthly budget for any city using your own inputs.
                Planning estimator only.
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
                — estimate an arrival and first-month trip budget using your
                own inputs.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.relocationChecklist}
              >
                Relocation checklist
              </Link>
              <span className="text-text-secondary">
                {" "}
                — organise documents, housing, healthcare, transport, and
                first-week planning.
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
                — how structured indicators are constructed and read.
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
                — official publishers behind verified utility layers.
              </span>
            </li>
          </ul>
        </section>
      </Container>
    </main>
  );
}
