import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllCostProfiles,
  getCostOfLiving,
} from "@/lib/data/cost-of-living";
import { hasClimate } from "@/lib/data/climate";
import { hasEconomy } from "@/lib/data/economy";
import {
  getCityBySlug,
  getCountryBySlug,
  hasVisualCityGuidePage,
  hasWeekendTripPage,
} from "@/lib/data/queries";
import { createMetadata } from "@/lib/seo/metadata";
import {
  cityRoute,
  climateRoute,
  costOfLivingRoute,
  countryRoute,
  economyRoute,
  staticRoutes,
  visualCityGuideRoute,
  weekendTripRoute,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";
import type { CostOfLivingProfile } from "@/types/cost-of-living";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return getAllCostProfiles().map((profile) => ({ city: profile.citySlug }));
}

function formatMoney(value: number, currency: string): string {
  return `${new Intl.NumberFormat("en-US").format(value)} ${currency}`;
}

function pageTitle(cityName: string): string {
  return `Cost of Living in ${cityName}`;
}

function pageDescription(cityName: string, profile: CostOfLivingProfile): string {
  return `Cost of living estimates for ${cityName}: monthly budgets for a single person, a couple, and a family; studio, one-bedroom, and three-bedroom rent; food and transport costs in ${profile.localCurrency}; and an affordability score for comparison. Planning estimates derived from country baselines — not live prices.`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  const profile = getCostOfLiving(citySlug);
  if (!city || !profile) {
    return {};
  }
  return createMetadata({
    title: pageTitle(city.name),
    description: pageDescription(city.name, profile),
    path: costOfLivingRoute(city.slug),
    lastModified: profile.updatedAt,
  });
}

function affordabilityBand(score: number): string {
  if (score >= 75) return "relatively affordable";
  if (score >= 55) return "moderate";
  if (score >= 40) return "relatively expensive";
  return "expensive";
}

export default async function CostOfLivingPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  const profile = getCostOfLiving(citySlug);

  if (!city || !profile) {
    notFound();
  }

  const country = getCountryBySlug(city.countrySlug);
  const cur = profile.localCurrency;

  const breadcrumbs = [
    { name: "Home", href: staticRoutes.home },
    { name: "Cities", href: staticRoutes.cities },
    { name: city.name, href: cityRoute(city.slug) },
    { name: "Cost of living", href: costOfLivingRoute(city.slug) },
  ];

  const title = pageTitle(city.name);
  const description = pageDescription(city.name, profile);

  // same-country peers with cost-of-living pages, for a neutral comparison
  const peers = (city.relatedCitySlugs ?? [])
    .map((slug) => {
      const peerCity = getCityBySlug(slug);
      const peerProfile = getCostOfLiving(slug);
      return peerCity && peerProfile
        ? { city: peerCity, profile: peerProfile }
        : null;
    })
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const band = affordabilityBand(profile.affordabilityScore);

  const overview = `This page summarises typical cost of living in ${city.name}${country ? `, ${country.name}` : ""}, expressed in ${cur}. A single person can expect to budget around ${formatMoney(profile.monthlyCostSingle, cur)} per month before rent-driven variation, with an affordability score of ${profile.affordabilityScore}/100 (higher means more affordable). On that scale ${city.name} is ${band} relative to other cities in the dataset. These are deterministic planning estimates derived from a country cost baseline adjusted for the city's affordability and size — they are not live market prices, not a ranking, and should be verified against current local sources before relocation or travel decisions.`;

  const sections = [
    {
      id: "monthly-budget",
      title: "Monthly budget",
      description:
        "Indicative total monthly spending by household type, before housing-market variation.",
      rows: [
        ["Single person", formatMoney(profile.monthlyCostSingle, cur)],
        ["Couple", formatMoney(profile.monthlyCostCouple, cur)],
        ["Family", formatMoney(profile.monthlyCostFamily, cur)],
      ],
    },
    {
      id: "housing-costs",
      title: "Housing costs",
      description: "Typical monthly rent by dwelling size.",
      rows: [
        ["Studio", formatMoney(profile.rentStudio, cur)],
        ["One-bedroom", formatMoney(profile.rentOneBedroom, cur)],
        ["Three-bedroom", formatMoney(profile.rentThreeBedroom, cur)],
      ],
    },
    {
      id: "food-costs",
      title: "Food costs",
      description: "Everyday food and drink reference prices.",
      rows: [
        ["Restaurant meal", formatMoney(profile.mealRestaurant, cur)],
        ["Coffee", formatMoney(profile.coffee, cur)],
      ],
    },
    {
      id: "transport-costs",
      title: "Transport costs",
      description: "Public transport reference price.",
      rows: [
        ["Monthly transit pass", formatMoney(profile.publicTransportPass, cur)],
      ],
    },
  ];

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: costOfLivingRoute(city.slug),
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHeader eyebrow="Cost of living" intro={overview} title={title}>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Single / month
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {formatMoney(profile.monthlyCostSingle, cur)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Affordability
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {profile.affordabilityScore}/100
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-12 pb-20">
        <BreadcrumbNav items={breadcrumbs} />

        <section aria-labelledby="overview-heading">
          <h2 className="sr-only" id="overview-heading">
            Overview
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>{overview}</p>
            <p className="mt-3">
              Currency: <span className="font-semibold text-text-primary">{cur}</span>.
              Data year {DATA_YEAR}; last updated {LAST_UPDATED}.
            </p>
          </Card>
        </section>

        {sections.map((s) => (
          <section aria-labelledby={`${s.id}-heading`} key={s.id}>
            <SectionHeading description={s.description} title={s.title} />
            <h2 className="sr-only" id={`${s.id}-heading`}>
              {s.title}
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {s.rows.map(([label, value]) => (
                <li key={label}>
                  <Card className="flex items-baseline justify-between gap-4">
                    <span className="text-sm text-text-secondary">{label}</span>
                    <span className="text-base font-semibold text-text-primary">
                      {value}
                    </span>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section aria-labelledby="affordability-heading">
          <SectionHeading
            description="A 0–100 comparison score; higher means more affordable. Mirrors the affordability dimension used across the platform's rankings."
            title="Affordability score"
          />
          <h2 className="sr-only" id="affordability-heading">
            Affordability score
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>
              {city.name} has an affordability score of{" "}
              <span className="font-semibold text-text-primary">
                {profile.affordabilityScore}/100
              </span>
              , which places it in the {band} range relative to other indexed
              cities. Because every city profile uses the same scale, this score
              is the most reliable cross-city comparison — local-currency totals
              above are not directly comparable between countries.
            </p>
          </Card>
        </section>

        <section aria-labelledby="comparison-heading">
          <SectionHeading
            description="Neutral, source-grounded comparison with related cities. Not a ranking and not a recommendation."
            title="Cost comparison summary"
          />
          <h2 className="sr-only" id="comparison-heading">
            Cost comparison summary
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>
              In {city.name} a single-person monthly budget is around{" "}
              {formatMoney(profile.monthlyCostSingle, cur)} and a one-bedroom
              rent around {formatMoney(profile.rentOneBedroom, cur)}. Use the
              affordability score ({profile.affordabilityScore}/100) to compare
              across countries, since amounts are shown in each city&apos;s local
              currency.
            </p>
            {peers.length > 0 ? (
              <ul className="mt-4 grid gap-2">
                {peers.map(({ city: peerCity, profile: peerProfile }) => (
                  <li key={peerCity.slug}>
                    <Link
                      className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                      href={costOfLivingRoute(peerCity.slug)}
                    >
                      Cost of living in {peerCity.name}
                    </Link>{" "}
                    — affordability {peerProfile.affordabilityScore}/100
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>
        </section>

        <section aria-labelledby="continue-heading">
          <SectionHeading
            description="Continue researching this city across the platform's other planning surfaces."
            title="Continue exploring"
          />
          <h2 className="sr-only" id="continue-heading">
            Continue exploring
          </h2>
          <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={cityRoute(city.slug)}
              >
                {city.name} city profile
              </Link>
            </li>
            {hasClimate(city.slug) ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={climateRoute(city.slug)}
                >
                  Climate in {city.name}
                </Link>
              </li>
            ) : null}
            {hasEconomy(city.slug) ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={economyRoute(city.slug)}
                >
                  Economy and jobs in {city.name}
                </Link>
              </li>
            ) : null}
            {country ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={countryRoute(country.slug)}
                >
                  {country.name} country profile
                </Link>
              </li>
            ) : null}
            {hasWeekendTripPage(city.slug) ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={weekendTripRoute(city.slug)}
                >
                  {city.name} weekend trip
                </Link>
              </li>
            ) : null}
            {hasVisualCityGuidePage(city.slug) ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={visualCityGuideRoute(city.slug)}
                >
                  {city.name} visual guide
                </Link>
              </li>
            ) : null}
          </ul>
        </section>
      </Container>
    </main>
  );
}
