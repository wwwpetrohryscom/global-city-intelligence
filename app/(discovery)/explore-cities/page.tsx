import type { Metadata } from "next";
import Link from "next/link";
import { CityFinder } from "@/components/discovery/CityFinder";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import { getAllCities, getAllCountries } from "@/lib/data/queries";
import { isSentinelCity } from "@/lib/discovery/build-index";
import { staticBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { staticRoutes } from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

const title = "Find the right city for you";
const description =
  "Explore every indexed city by region, population, affordability, climate, safety, economy, education and healthcare. Filter, shortlist and compare using the same published data as the city pages.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.exploreCities,
});

/**
 * The City Finder.
 *
 * The interactive surface is a client component, but this page is a normal
 * static export: the heading, the explanatory copy, the methodology notes and
 * the crawlable entry points below are all in the served HTML. The discovery
 * index itself is fetched lazily by the Finder, so no other route pays for it.
 *
 * Filter state lives in React state and is deliberately NOT reflected in the
 * URL. Every combination of 13 facets would otherwise be a crawlable URL, which
 * is exactly the faceted-indexation explosion that damages a large site's crawl
 * budget. This page has a single canonical URL and no parameterised variants.
 */
export default function ExploreCitiesPage() {
  const cities = getAllCities();
  const countries = getAllCountries();
  // Coverage is computed from the corpus, not asserted, so the disclosure below
  // can never drift away from what the index actually contains.
  const withoutScores = cities.filter((city) => isSentinelCity(city.population)).length;
  const withScores = cities.length - withoutScores;
  const breadcrumbs = staticBreadcrumbs("Explore cities", staticRoutes.exploreCities);

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: staticRoutes.exploreCities,
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <PageHeader
        eyebrow="City finder"
        intro={`Filter ${cities.length.toLocaleString("en-US")} cities across ${countries.length} countries by the dimensions that decide where you can actually live or work. Every filter reads a value already published on that city's own pages — nothing here is a new score.`}
        title={title}
      >
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Cities
            </dt>
            <dd className="text-lg font-semibold text-text-primary">
              {cities.length.toLocaleString("en-US")}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Countries
            </dt>
            <dd className="text-lg font-semibold text-text-primary">
              {countries.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="text-lg font-semibold text-text-primary">{DATA_YEAR}</dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="pb-16">
        <BreadcrumbNav items={breadcrumbs} />

        <div className="mt-8">
          <CityFinder />
        </div>

        <section className="mt-16 border-t border-neutral-border pt-10">
          <SectionHeading
            description="What the filters mean, and where they stop."
            title="How this works"
          />
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Filters read published values
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Population bands, temperature bands and score bands are plain
                bucketings of figures already shown on each city&rsquo;s pages.
                Each band states its own threshold — &ldquo;1M – 5M&rdquo;,
                &ldquo;Warm — 18 to 24°C&rdquo; — so a result never depends on a
                weighting you cannot see. There is no composite
                &ldquo;best match&rdquo; score and no ranking of one city above
                another.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Missing data is excluded, not guessed
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {withScores.toLocaleString("en-US")} cities carry published
                affordability, safety, air-quality and internet scores.{" "}
                {withoutScores.toLocaleString("en-US")} are still awaiting data
                integration and show{" "}
                <span className="italic">Not available</span> instead. Those
                cities are left out of any filter or sort on a dimension they
                have no value for, rather than being treated as average — but
                they remain fully searchable and their climate data is real.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Why there is no cost filter
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Monthly budgets and rents are published in each city&rsquo;s own
                local currency across 83 currencies, and this platform holds no
                exchange-rate data. Ranking those figures against each other
                would compare rials with francs and produce confident nonsense,
                so affordability is offered only through the unitless
                affordability score.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Saved cities stay in your browser
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Your shortlist and your recently viewed list are stored in this
                browser only. There is no account, nothing is uploaded, and
                clearing them removes them completely.
              </p>
            </div>
          </div>
          <p className="mt-6 text-xs text-text-muted">
            Data year {DATA_YEAR}. Last updated {LAST_UPDATED}. See the{" "}
            <Link className="underline decoration-neutral-line" href={staticRoutes.methodology}>
              methodology
            </Link>{" "}
            and{" "}
            <Link className="underline decoration-neutral-line" href={staticRoutes.dataSources}>
              data sources
            </Link>
            .
          </p>
        </section>

        {/* Crawlable, JS-free entry points. The Finder is additive: it never
            replaces the static directories as the route into the corpus. */}
        <section className="mt-12 border-t border-neutral-border pt-10">
          <SectionHeading
            description="Every city and country also remains reachable through the standard directories."
            title="Browse instead"
          />
          <ul className="mt-6 flex flex-wrap gap-3">
            {[
              { href: staticRoutes.countries, label: "All countries" },
              { href: staticRoutes.cities, label: "All cities" },
              { href: staticRoutes.rankings, label: "Rankings" },
              { href: staticRoutes.compare, label: "Curated comparisons" },
              { href: staticRoutes.collections, label: "Best-city collections" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  className="inline-flex min-h-[44px] items-center rounded-lg border border-neutral-border bg-white px-4 text-sm font-medium text-text-primary transition-colors hover:border-brand-300"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </main>
  );
}
