import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { FactList } from "@/components/ui/fact-list";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import { toolsBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { staticRoutes } from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

const title = "Relocation Checklist";
const description =
  "Use a practical relocation checklist to organize city research, budgeting, documents, housing, healthcare, transport, safety, and first-week planning. Includes links to city profiles, country hubs, methodology, and data sources.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.relocationChecklist,
});

interface ChecklistSection {
  title: string;
  summary: string;
  items: string[];
}

const SECTIONS: ChecklistSection[] = [
  {
    title: "Destination research",
    summary:
      "Build the directional picture of where you are going before any other planning. Pair city profiles with country hubs for structured indicators.",
    items: [
      "Open the destination city profile and read the overall outlook",
      "Open the destination country hub for national context",
      "Compare two or more candidate cities through curated comparison pages",
      "Review the public safety section on the city or country page",
      "Review the healthcare access section for the city or country",
      "Review the transport and mobility section for the city or country",
      "Note any verified versus unverified indicator labels on each page",
    ],
  },
  {
    title: "Budget planning",
    summary:
      "Use the platform's planning calculators to bracket your costs. Outputs reflect only the numbers you enter — they are not official estimates.",
    items: [
      "Estimate a monthly living budget with the cost of living calculator",
      "Estimate a trip budget for the move itself with the travel budget calculator",
      "Track housing, food, transport, healthcare, and lifestyle assumptions",
      "Keep a separate emergency reserve outside the monthly budget",
      "Plan for a higher first-month buffer for setup costs",
      "Re-run the calculators after collecting real quotes",
    ],
  },
  {
    title: "Documents and verification",
    summary:
      "Always verify documents and any visa, residence, work, or registration rules with official government sources. This checklist does not replace official guidance.",
    items: [
      "Check that your passport meets validity rules required by your destination",
      "Verify visa, residence, or work permit requirements with official government sources",
      "Prepare core identity documents (national ID, civil records as applicable)",
      "Keep digital and physical copies of every important document",
      "Confirm any in-person appointment processes through official channels",
      "Track the expiry date of every document you rely on",
    ],
  },
  {
    title: "Housing preparation",
    summary:
      "Treat housing as a verification exercise. Never wire money or sign agreements before independent verification of the property and counterparty.",
    items: [
      "Research neighborhoods using city and country pages and independent sources",
      "Verify lease terms through a local source you trust",
      "Understand local deposit and notice requirements",
      "Avoid sending money before independent verification of the property",
      "Keep written records of every agreement and payment",
      "Set up a fallback short-term option if the long-term plan falls through",
    ],
  },
  {
    title: "Healthcare and insurance preparation",
    summary:
      "Use country and city healthcare sections for context, but verify your specific eligibility, coverage, and prescription rules with official providers or government sources.",
    items: [
      "Read the country healthcare access section for general context",
      "Verify insurance requirements with official providers or government sources",
      "Identify emergency numbers from the country or city emergency section",
      "Check medication rules and prescription requirements with official sources",
      "Carry summaries of any chronic conditions or recurring prescriptions",
      "Keep a copy of your insurance policy with you on arrival day",
    ],
  },
  {
    title: "Transport and arrival",
    summary:
      "Plan how you move on day one. Use city transport sections for verified context, and save backup options in case the primary plan fails.",
    items: [
      "Read the city transport section for verified mobility context",
      "Plan airport, train, or border arrival logistics in advance",
      "Save links to official transport authority and operator sites",
      "Keep a backup route option that does not depend on a single provider",
      "Plan the first ride from arrival to accommodation before you land",
      "Keep some local currency or a working payment method for the first hour",
    ],
  },
  {
    title: "Safety and communication",
    summary:
      "Save emergency contacts from official sources before you arrive, and keep your communications resilient and private.",
    items: [
      "Save emergency numbers from the country emergency section",
      "Share your itinerary with at least one trusted contact",
      "Avoid sharing sensitive personal details publicly online",
      "Use secure communication tools and password-protected backups",
      "Note the nearest hospital, police station, and embassy or consulate",
      "Plan a check-in cadence with your trusted contact for the first week",
    ],
  },
  {
    title: "First week after arrival",
    summary:
      "Use the first week to settle the basics. Verify any local registration requirement with official sources rather than informal guidance.",
    items: [
      "Register locally if required by official sources for your status",
      "Set up connectivity (mobile, home internet) with verified providers",
      "Learn the daily transport route you will rely on most",
      "Locate the nearest healthcare and public service access points",
      "Review local safety information on the city or country page",
      "Refine your monthly budget in the calculator with real first-week costs",
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
    numberOfItems: SECTIONS.length,
    itemListElement: SECTIONS.map((section, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: section.title,
    })),
  };
}

export default function RelocationChecklistPage() {
  const breadcrumbs = toolsBreadcrumbs(
    "Relocation Checklist",
    staticRoutes.relocationChecklist,
  );

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: staticRoutes.relocationChecklist,
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={itemListSchema()} />
      <PageHeader
        eyebrow="Planning checklist"
        intro={description}
        title={title}
      />
      <Container className="space-y-12 py-12">
        <BreadcrumbNav items={breadcrumbs} />

        <section>
          <FactList
            facts={[
              { label: "Last updated", value: LAST_UPDATED },
              { label: "Data year", value: DATA_YEAR },
              {
                label: "What this is",
                value: "Practical relocation planning checklist",
              },
              {
                label: "What this is not",
                value:
                  "Legal, immigration, tax, medical, insurance, or financial advice",
              },
            ]}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <Card as="article" className="p-6">
            <h2 className="text-2xl font-semibold text-text-primary">
              A planning checklist, not an official guide
            </h2>
            <p className="mt-3 leading-7 text-text-secondary">
              The relocation checklist is a structured way to organize the
              practical tasks of moving to a new city or country. It pairs
              naturally with the platform&apos;s city profiles, country hubs,
              and planning calculators. Use it as a general preparation guide
              rather than a country-specific legal or immigration document.
            </p>
            <p className="mt-3 leading-7 text-text-secondary">
              For anything official — visas, residence permits, work
              authorisation, tax residency, medical eligibility, insurance
              terms, lease law, school enrolment, or any other regulated
              requirement — verify directly with the relevant government
              authority, licensed professional, or accredited provider.
            </p>
          </Card>
          <Card as="section">
            <h2 className="text-base font-semibold text-text-primary">
              What this is not
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-text-secondary">
              <li>· Not legal or immigration advice</li>
              <li>· Not tax advice</li>
              <li>· Not medical or insurance advice</li>
              <li>· Not a complete country-specific requirements list</li>
              <li>· Not an official relocation guide</li>
            </ul>
          </Card>
        </section>

        <section>
          <SectionHeading
            description="Each section groups related preparation tasks. The order is suggested, not required. Adapt the checklist to your destination and personal situation, and always verify regulated requirements with official sources."
            title="Relocation checklist sections"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {SECTIONS.map((section, index) => (
              <Card as="article" className="flex flex-col p-6" key={section.title}>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                  Section {index + 1}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-text-primary">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {section.summary}
                </p>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-text-secondary">
                  {section.items.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            description="Pair the checklist with the planning calculators so the budget conversations stay grounded in your own numbers rather than guessed estimates."
            title="Planning tools to use alongside"
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card as="article">
              <h3 className="text-base font-semibold text-text-primary">
                Tools directory
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                The full index of planning utilities, with each tool&apos;s
                scope and disclaimers.
              </p>
              <Link
                className="mt-3 inline-flex font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.tools}
              >
                Browse all tools
              </Link>
            </Card>
            <Card as="article">
              <h3 className="text-base font-semibold text-text-primary">
                Cost of living calculator
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Compare a monthly living budget between two cities using your
                own inputs. Planning estimator only, not an official
                cost-of-living measurement.
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
                Travel budget calculator
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Estimate the trip itself — accommodation, food, local
                transport, activities, travel, healthcare buffer, and
                emergency buffer — using your own inputs.
              </p>
              <Link
                className="mt-3 inline-flex font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.travelBudgetCalculator}
              >
                Open travel budget calculator
              </Link>
            </Card>
          </div>
        </section>

        <section>
          <SectionHeading
            description="Continue into structured city and country intelligence, comparisons, collections, rankings, and source-attributed reference pages."
            title="Use platform context"
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

        <section>
          <Card as="article" className="border-dashed">
            <h2 className="text-base font-semibold text-text-primary">
              Source and verification transparency
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              The relocation checklist is a planning aid. It does not include
              country-specific visa, residence, work, tax, healthcare, or
              insurance requirements, and it is not maintained as a legal or
              immigration reference. For any regulated requirement, verify
              with the relevant official government authority, licensed
              professional, or accredited provider before acting. Use the
              platform&apos;s city profiles and country hubs for
              source-attributed context across emergency contacts, healthcare
              access, and transport authorities where verified data is
              available.
            </p>
          </Card>
        </section>
      </Container>
    </main>
  );
}
