import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { HubNav } from "@/components/navigation/HubNav";
import { Card } from "@/components/ui/Card";
import { FactList } from "@/components/ui/fact-list";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import { staticBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { absoluteUrl, staticRoutes } from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

const title = "Tools and Calculators";
const description =
  "Explore Global City Intelligence planning tools, including cost of living and travel budget calculators that use your own inputs and link back to city, country, comparison, methodology, and data-source pages.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.tools,
});

interface ToolEntry {
  name: string;
  href: string;
  description: string;
  helpsWith: string[];
  doesNotDo: string[];
  primaryAnchor: string;
  relatedLinks: { label: string; href: string }[];
}

const TOOLS: ToolEntry[] = [
  {
    name: "Cost of Living Comparison Calculator",
    href: staticRoutes.costOfLivingCalculator,
    description:
      "Compare monthly living budgets using your own housing, food, transport, healthcare, and lifestyle inputs. Planning estimator only — not an official cost-of-living measurement.",
    helpsWith: [
      "Bracketing a relocation conversation between two cities",
      "Planning a longer stay against a realistic monthly budget",
      "Stress-testing how a single budget line changes the total",
    ],
    doesNotDo: [
      "Publish official rent, grocery, transport, or salary values",
      "Rank cities by affordability or cost-of-living index",
      "Provide financial, tax, or relocation advice",
    ],
    primaryAnchor: "Open the cost of living calculator",
    relatedLinks: [
      { label: "Cities directory", href: staticRoutes.cities },
      { label: "City comparisons", href: staticRoutes.compare },
    ],
  },
  {
    name: "Travel Budget Calculator",
    href: staticRoutes.travelBudgetCalculator,
    description:
      "Estimate a trip budget using your own accommodation, food, local transport, activities, travel, healthcare buffer, and emergency buffer inputs. Planning estimator only — not an official travel cost estimate.",
    helpsWith: [
      "Bracketing a trip-planning conversation for a destination",
      "Sanity-checking quotes you already have on hand",
      "Stress-testing how trip length or travelers change the total",
    ],
    doesNotDo: [
      "Query hotel, flight, or booking providers for live prices",
      "Rank destinations by cost or affordability",
      "Provide financial, insurance, medical, or travel advice",
    ],
    primaryAnchor: "Open the travel budget calculator",
    relatedLinks: [
      { label: "Country hubs", href: staticRoutes.countries },
      { label: "Cities directory", href: staticRoutes.cities },
    ],
  },
];

function itemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description,
    itemListOrder: "https://schema.org/ItemListUnordered",
    numberOfItems: TOOLS.length,
    itemListElement: TOOLS.map((tool) => ({
      "@type": "ListItem",
      name: tool.name,
      url: absoluteUrl(tool.href),
    })),
  };
}

export default function ToolsIndexPage() {
  const breadcrumbs = staticBreadcrumbs("Tools", staticRoutes.tools);

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: staticRoutes.tools,
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={itemListSchema()} />
      <PageHeader
        eyebrow="Planning tools"
        intro={description}
        title={title}
      />
      <Container className="space-y-12 py-12">
        <BreadcrumbNav items={breadcrumbs} />
        <HubNav activeHref={staticRoutes.tools} />

        <section>
          <FactList
            facts={[
              { label: "Last updated", value: LAST_UPDATED },
              { label: "Data year", value: DATA_YEAR },
              {
                label: "What this is",
                value: "Directory of planning utilities",
              },
              {
                label: "What this is not",
                value: "Official measurements or advice",
              },
            ]}
          />
        </section>

        <section>
          <SectionHeading
            description="Each tool is a planning worksheet that uses your own inputs. None of them publish official rent, hotel, transport, or salary values, and none of them rank cities or destinations. Pair each tool with the platform's city and country profiles for source-attributed context."
            title="Available planning tools"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {TOOLS.map((tool) => (
              <Card as="article" className="flex flex-col p-6" key={tool.href}>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                  Planning tool
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-text-primary">
                  {tool.name}
                </h2>
                <p className="mt-3 leading-7 text-text-secondary">
                  {tool.description}
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      What it helps with
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm leading-6 text-text-secondary">
                      {tool.helpsWith.map((item) => (
                        <li key={item}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      What it does not do
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm leading-6 text-text-secondary">
                      {tool.doesNotDo.map((item) => (
                        <li key={item}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                  <Link
                    className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                    href={tool.href}
                  >
                    {tool.primaryAnchor}
                  </Link>
                  {tool.relatedLinks.map((related) => (
                    <Link
                      className="text-text-secondary underline decoration-neutral-border decoration-2 underline-offset-2 hover:text-text-primary"
                      href={related.href}
                      key={related.href}
                    >
                      {related.label}
                    </Link>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
          <Card as="article" className="p-6">
            <h2 className="text-2xl font-semibold text-text-primary">
              How to read the tools
            </h2>
            <p className="mt-3 leading-7 text-text-secondary">
              Calculators on this site are worksheets — they sum, scale, and
              annualise the numbers you enter, and they do not import a
              third-party cost-of-living or travel-cost index. There are no
              hidden city multipliers, no synthesized rent or hotel prices, and
              no exchange-rate conversions. Outputs reflect exactly what you
              type in, formatted in the currency you choose.
            </p>
            <p className="mt-3 leading-7 text-text-secondary">
              Use the tools to bracket conversations: relocation budgets,
              shorter trips, stress-testing assumptions. Pair the planning
              estimates with city and country profiles for source-attributed
              context across safety, healthcare, transport, and air quality.
            </p>
          </Card>
          <Card as="section">
            <h2 className="text-base font-semibold text-text-primary">
              Transparency
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-text-secondary">
              <li>· No external pricing API is called at request time</li>
              <li>· Tool defaults are zero or empty — never implied prices</li>
              <li>· City lists come from the platform&apos;s local registry</li>
              <li>· Methodology and data sources are linked from every tool</li>
            </ul>
          </Card>
        </section>

        <section>
          <SectionHeading
            description="Continue from the tools directory into structured city and country intelligence, comparisons, collections, rankings, and source-attributed reference pages."
            title="Continue exploring"
          />
          <ul className="mt-6 grid gap-3 text-sm md:grid-cols-2">
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.cities}
              >
                Cities directory
              </Link>
              <span className="text-text-secondary">
                {" "}
                — browse every indexed city profile.
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
                — curated city-vs-city pages with structured indicators.
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
                — comparison-oriented shortlists by intent.
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
                — structured rankings across city intelligence categories.
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
          </ul>
        </section>
      </Container>
    </main>
  );
}
