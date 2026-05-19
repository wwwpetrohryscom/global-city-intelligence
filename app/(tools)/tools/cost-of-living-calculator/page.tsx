import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/Card";
import { FactList } from "@/components/ui/fact-list";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  CostOfLivingCalculator,
  type CalculatorCityOption,
} from "@/components/tools/CostOfLivingCalculator";
import { CostOfLivingExampleTable } from "@/components/tools/CostOfLivingExampleTable";
import { CalculatorMethodology } from "@/components/tools/CalculatorMethodology";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import { getAllComparisons, getCities } from "@/lib/data/queries";
import { toolsBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import {
  absoluteUrl,
  cityRoute,
  staticRoutes,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

const title = "Cost of Living Comparison Calculator";
const description =
  "Estimate and compare monthly living costs between cities using your own housing, food, transport, utilities, healthcare, and lifestyle inputs. Includes methodology notes, city links, and source transparency.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.costOfLivingCalculator,
});

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("::");
}

function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description,
    url: absoluteUrl(staticRoutes.costOfLivingCalculator),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    browserRequirements:
      "Requires JavaScript for the interactive calculator widget. Methodology, example breakdown, and internal links are server-rendered and remain readable without JavaScript.",
    isAccessibleForFree: true,
    inLanguage: "en",
    dateModified: LAST_UPDATED,
  };
}

export default function CostOfLivingCalculatorPage() {
  const cities = getCities();
  const breadcrumbs = toolsBreadcrumbs(
    "Cost of Living Calculator",
    staticRoutes.costOfLivingCalculator,
  );

  const calculatorCities: CalculatorCityOption[] = cities
    .map((city) => ({
      slug: city.slug,
      name: city.name,
      countryName: city.countryName,
      url: cityRoute(city.slug),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const comparisonByPair: Record<string, string> = {};
  for (const comparison of getAllComparisons()) {
    comparisonByPair[pairKey(comparison.cityASlug, comparison.cityBSlug)] =
      comparison.slug;
  }

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: staticRoutes.costOfLivingCalculator,
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
                value: "An official cost-of-living measurement",
              },
            ]}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <article className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-text-primary">
              A budget-first comparison, not a leaderboard
            </h2>
            <p className="mt-3 leading-7 text-text-secondary">
              Cost-of-living calculators on the internet usually multiply your
              budget by a city-specific index and present the output as a
              precise number. Those indices vary widely between providers and
              are rarely backed by source attribution at the line-item level.
              This calculator avoids that path entirely: it adds the numbers
              you enter, subtracts the totals, and shows the difference.
            </p>
            <p className="mt-3 leading-7 text-text-secondary">
              That keeps the result honest. The output reflects your assumptions
              about housing, food, transport, utilities, internet, healthcare,
              and lifestyle in each city — not synthesized rent prices or
              guessed salary multipliers.
            </p>
          </article>
          <Card as="section">
            <h2 className="text-base font-semibold text-text-primary">
              When to use this
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-text-secondary">
              <li>· Bracketing a relocation conversation</li>
              <li>· Planning a longer stay in another city</li>
              <li>· Stress-testing a remote-work budget against new housing</li>
              <li>· Comparing two budgets you already maintain</li>
            </ul>
            <h3 className="mt-5 text-sm font-semibold text-text-primary">
              When not to use this
            </h3>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-text-secondary">
              <li>· Tax planning or financial advice</li>
              <li>· Salary negotiation with no other inputs</li>
              <li>· Official cost-of-living reporting</li>
            </ul>
          </Card>
        </section>

        <CostOfLivingCalculator
          cities={calculatorCities}
          comparePath={staticRoutes.compare}
          comparisonByPair={comparisonByPair}
          methodologyPath={staticRoutes.methodology}
        />

        <section>
          <SectionHeading
            description="An illustrative two-city breakdown showing how the calculation lines up. The values below are example inputs only — they are not verified rent, food, or transport prices for any specific city."
            title="Example monthly breakdown"
          />
          <div className="mt-6">
            <CostOfLivingExampleTable />
          </div>
          <p className="mt-3 text-xs leading-5 text-text-muted">
            Example values shown for illustration only. They are not derived
            from an official cost-of-living dataset, and they do not
            represent any specific city.
          </p>
        </section>

        <section>
          <CalculatorMethodology />
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
                for every supported city.
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
                indicator context per country.
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
                Side-by-side structured comparisons — useful when a pair
                you&apos;re considering already has a curated page.
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
                readiness, and urban resilience. Not a leaderboard for cost.
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
                Travel budget calculator
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Planning a shorter trip? Use the travel budget calculator with
                your own accommodation, food, transport, activity, travel, and
                buffer inputs. Planning estimator only, not an official travel
                cost estimate.
              </p>
              <Link
                className="mt-3 inline-flex font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.travelBudgetCalculator}
              >
                Open travel budget calculator
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
              This tool does not import a third-party cost-of-living index,
              and it does not call any external API at request time. Every
              number on the page either comes from your input or is clearly
              labelled as an illustrative example. The city dropdown is sourced
              from the platform&apos;s local city registry; no live pricing is
              fetched. If you spot a city you&apos;d expect to see but don&apos;t, the
              registry hasn&apos;t yet onboarded it — please use a similar city
              in the same region as a planning proxy and treat the result
              accordingly.
            </p>
          </Card>
        </section>
      </div>
    </main>
  );
}
