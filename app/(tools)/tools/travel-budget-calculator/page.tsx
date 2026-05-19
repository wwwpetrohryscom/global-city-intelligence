import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/Card";
import { FactList } from "@/components/ui/fact-list";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  TravelBudgetCalculator,
  type TravelCityOption,
} from "@/components/tools/TravelBudgetCalculator";
import { TravelBudgetExampleTable } from "@/components/tools/TravelBudgetExampleTable";
import { TravelBudgetMethodology } from "@/components/tools/TravelBudgetMethodology";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import { getCities } from "@/lib/data/queries";
import { toolsBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import {
  absoluteUrl,
  cityRoute,
  countryRoute,
  staticRoutes,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

const title = "Travel Budget Calculator";
const description =
  "Estimate a trip budget using your own accommodation, food, local transport, activities, travel, healthcare buffer, and emergency buffer inputs. Includes city links, methodology notes, and source transparency.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.travelBudgetCalculator,
});

function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description,
    url: absoluteUrl(staticRoutes.travelBudgetCalculator),
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    browserRequirements:
      "Requires JavaScript for the interactive calculator widget. Methodology, example breakdown, and internal links are server-rendered and remain readable without JavaScript.",
    isAccessibleForFree: true,
    inLanguage: "en",
    dateModified: LAST_UPDATED,
  };
}

export default function TravelBudgetCalculatorPage() {
  const cities = getCities();
  const breadcrumbs = toolsBreadcrumbs(
    "Travel Budget Calculator",
    staticRoutes.travelBudgetCalculator,
  );

  const calculatorCities: TravelCityOption[] = cities
    .map((city) => ({
      slug: city.slug,
      name: city.name,
      countryName: city.countryName,
      countrySlug: city.countrySlug,
      url: cityRoute(city.slug),
      countryUrl: countryRoute(city.countrySlug),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: staticRoutes.travelBudgetCalculator,
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={softwareApplicationSchema()} />
      <PageHeader
        eyebrow="Planning tool"
        intro={description}
        title={title}
      />
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbNav items={breadcrumbs} />

        <section>
          <FactList
            facts={[
              { label: "Last updated", value: LAST_UPDATED },
              { label: "Data year", value: DATA_YEAR },
              {
                label: "What this is",
                value: "Planning estimator from your inputs",
              },
              {
                label: "What this is not",
                value: "An official travel cost calculator",
              },
            ]}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <article className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-text-primary">
              A worksheet, not a fare estimator
            </h2>
            <p className="mt-3 leading-7 text-text-secondary">
              Travel calculators on the internet usually multiply a base price
              by a destination index and present the output as a confident
              total. Those indices vary widely between providers and rarely
              attribute their underlying values. This worksheet avoids that
              path entirely: it scales the numbers you enter by your trip
              length and travelers, sums them, and shows daily and per-person
              breakdowns.
            </p>
            <p className="mt-3 leading-7 text-text-secondary">
              That keeps the result honest. The output reflects your
              assumptions about accommodation, food, local transport,
              activities, insurance, long-distance travel, and an emergency
              buffer — not synthesized hotel rates, guessed flight prices, or
              opaque destination multipliers.
            </p>
          </article>
          <Card as="section">
            <h2 className="text-base font-semibold text-text-primary">
              When to use this
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-text-secondary">
              <li>· Bracketing a trip-planning conversation</li>
              <li>· Sanity-checking quotes you already have</li>
              <li>· Stress-testing how trip length changes the total</li>
              <li>· Comparing two budget styles for the same destination</li>
            </ul>
            <h3 className="mt-5 text-sm font-semibold text-text-primary">
              When not to use this
            </h3>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-text-secondary">
              <li>· Booking decisions without verifying real prices</li>
              <li>· Insurance, medical, or financial advice</li>
              <li>· Official travel budgeting or expense reporting</li>
            </ul>
          </Card>
        </section>

        <TravelBudgetCalculator
          cities={calculatorCities}
          dataSourcesPath={staticRoutes.dataSources}
          methodologyPath={staticRoutes.methodology}
        />

        <section>
          <SectionHeading
            description="An illustrative seven-day, two-traveler breakdown showing how the calculation lines up. The values below are example inputs only — they are not verified hotel, food, transport, or activity prices for any specific destination."
            title="Example trip breakdown"
          />
          <div className="mt-6">
            <TravelBudgetExampleTable />
          </div>
          <p className="mt-3 text-xs leading-5 text-text-muted">
            Example values shown for illustration only. They are not derived
            from an official travel cost dataset, and they do not represent
            any specific destination.
          </p>
        </section>

        <section>
          <TravelBudgetMethodology />
        </section>

        <section>
          <SectionHeading
            description="The calculator does not stand alone. Pair the planning estimate with the platform's structured city and country intelligence so the number you see is anchored in context."
            title="Continue planning"
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card as="article">
              <h3 className="text-base font-semibold text-text-primary">
                City profiles
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Source-attributed metrics, sections, and module deep-dives
                for every supported destination city.
              </p>
              <Link
                className="mt-3 inline-flex font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.cities}
              >
                Browse cities
              </Link>
            </Card>
            <Card as="article">
              <h3 className="text-base font-semibold text-text-primary">
                Country hubs
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Verified emergency, healthcare, transport, and World Bank
                indicator context per destination country.
              </p>
              <Link
                className="mt-3 inline-flex font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.countries}
              >
                Browse countries
              </Link>
            </Card>
            <Card as="article">
              <h3 className="text-base font-semibold text-text-primary">
                City comparisons
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Side-by-side structured comparisons — useful when you&apos;re
                weighing two destinations that already have a curated page.
              </p>
              <Link
                className="mt-3 inline-flex font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.compare}
              >
                Open comparison index
              </Link>
            </Card>
            <Card as="article">
              <h3 className="text-base font-semibold text-text-primary">
                Curated collections
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Editorially scoped city collections (clean-air, remote-work,
                transport, families, startups) — never ranked, always with
                fallback transparency.
              </p>
              <Link
                className="mt-3 inline-flex font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.collections}
              >
                Browse collections
              </Link>
            </Card>
            <Card as="article">
              <h3 className="text-base font-semibold text-text-primary">
                Rankings
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Directional scoring across affordability, air quality, energy
                readiness, and urban resilience. Not a leaderboard for travel
                cost.
              </p>
              <Link
                className="mt-3 inline-flex font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.rankings}
              >
                Browse rankings
              </Link>
            </Card>
            <Card as="article">
              <h3 className="text-base font-semibold text-text-primary">
                Cost of living calculator
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Planning a longer stay or a relocation rather than a trip? Use
                the cost of living calculator to compare monthly budgets
                between two cities.
              </p>
              <Link
                className="mt-3 inline-flex font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.costOfLivingCalculator}
              >
                Open cost of living calculator
              </Link>
            </Card>
            <Card as="article">
              <h3 className="text-base font-semibold text-text-primary">
                Methodology and sources
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                How the platform constructs every published score, indicator,
                and dataset — and where the underlying values come from.
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.methodology}
                >
                  Methodology
                </Link>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.dataSources}
                >
                  Data sources
                </Link>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <Card as="article" className="border-dashed">
            <h2 className="text-base font-semibold text-text-primary">
              Source and fallback transparency
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              This tool does not import a third-party travel cost index, and
              it does not call any external booking, airline, or hotel API at
              request time. Every number on the page either comes from your
              input or is clearly labelled as an illustrative example. The
              destination dropdown is sourced from the platform&apos;s local
              city registry; no live pricing is fetched. Verify real prices
              with providers before booking, and use the destination city and
              country pages for source-attributed safety, healthcare, and
              transport context.
            </p>
          </Card>
        </section>
      </div>
    </main>
  );
}
