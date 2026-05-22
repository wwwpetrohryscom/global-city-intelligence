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
  getAllArrivalPages,
  getAllCountries,
  getArrivalFocusLabel,
  getCityBySlug,
  getCountryBySlug,
} from "@/lib/data/queries";
import { staticBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import {
  absoluteUrl,
  arrivalRoute,
  cityRoute,
  countryRoute,
  staticRoutes,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

const title = "City Arrival Planning Guides";
const description =
  "Browse city arrival planning guides for first-day planning, transport context, public safety, healthcare context, budgeting tools, methodology notes, and source transparency.";
const introParagraph =
  "Each guide links back to the structured city profile, country hub, public-safety references, healthcare access notes, transport-authority context, budget tools, methodology, and the data sources registry. These pages support first-day planning context only — they are not an official airport or transport service, not a transfer guide, and not legal, immigration, or medical advice. Verify time-sensitive details with official airport and transport sources before you travel.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.arrival,
});

export default function ArrivalDirectoryPage() {
  const arrivalPages = getAllArrivalPages();
  const breadcrumbs = staticBreadcrumbs("Arrival planning", staticRoutes.arrival);
  const countries = getAllCountries();

  const guides = arrivalPages
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
    url: absoluteUrl(staticRoutes.arrival),
    numberOfItems: guides.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: guides.map((entry) => ({
      "@type": "ListItem",
      name: `Arriving in ${entry.city.name}: City Arrival Planning Guide`,
      url: absoluteUrl(arrivalRoute(entry.city.slug)),
    })),
  };

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: staticRoutes.arrival,
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={itemListSchema} />

      <PageHeader eyebrow="Arrival planning" intro={introParagraph} title={title}>
        <dl className="grid gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Arrival guides
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
          aria-labelledby="arrival-directory-scope-heading"
          className="rounded-2xl border border-neutral-border bg-surface-soft p-6"
        >
          <h2
            className="text-2xl font-semibold text-text-primary"
            id="arrival-directory-scope-heading"
          >
            Sources and methodology
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
            Arrival guides are planning context only — they do not publish
            airport names, terminal information, transfer routes, fares,
            schedules, operator details, live status, emergency contacts, visa
            or immigration requirements, or medical instructions. For
            time-sensitive details, always confirm with the official airport,
            transport authority, and government source. Read the{" "}
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

        <section aria-labelledby="arrival-directory-grid-heading">
          <SectionHeading
            description="Each card opens a city arrival planning guide with links to the structured city profile, country hub, public-safety references, healthcare context, transport context, and planning tools."
            title="All arrival planning guides"
          />
          <h2 className="sr-only" id="arrival-directory-grid-heading">
            All arrival planning guides
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {guides.map(({ page, city, country }) => (
              <li key={page.citySlug}>
                <Card as="article" className="h-full" interactive>
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    {country ? country.name : "Indexed city"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-text-primary">
                    <Link
                      className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                      href={arrivalRoute(city.slug)}
                    >
                      {`Arriving in ${city.name}`}
                    </Link>
                  </h3>
                  <p className="mt-1 text-xs font-medium text-text-secondary">
                    {getArrivalFocusLabel(page.arrivalFocus)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-text-secondary">
                    {page.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    <Link
                      className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                      href={arrivalRoute(city.slug)}
                    >
                      {`Open the ${city.name} arrival guide`}
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
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="arrival-directory-country-heading">
          <SectionHeading
            description="A complete index of arrival planning guides grouped by country, fully present in the initial HTML so every link is crawlable without client-side JavaScript."
            title="Arrival guides by country"
          />
          <h2 className="sr-only" id="arrival-directory-country-heading">
            Arrival guides by country
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
                        href={arrivalRoute(city.slug)}
                      >
                        {`Arriving in ${city.name}`}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="arrival-directory-related-heading"
          className="rounded-2xl border border-neutral-border bg-surface-soft p-6"
        >
          <h2
            className="text-2xl font-semibold text-text-primary"
            id="arrival-directory-related-heading"
          >
            Continue exploring
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
            Use the structured city and country profiles, comparisons, and
            planning tools alongside any arrival guide. Calculators use your
            own inputs and do not query airport, flight, or transport
            providers — they do not publish live prices, fares, or schedules.
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
                href={staticRoutes.travelBudgetCalculator}
              >
                Travel budget calculator
              </Link>
              <span className="text-text-secondary">
                {" "}
                — estimate accommodation, food, transport, activities,
                healthcare buffer, and emergency buffer using your own inputs.
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
