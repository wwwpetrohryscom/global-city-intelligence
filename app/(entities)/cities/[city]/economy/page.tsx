import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { PhaseCrossLinks } from "@/components/seo/phase-cross-links";
import { Card } from "@/components/ui/Card";
import { ScoreBar } from "@/components/ui/score-bar";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllEconomyProfiles,
  getCityBySlug,
  getCountryBySlug,
  getEconomy,
  getJobs,
  hasVisualCityGuidePage,
  hasWeekendTripPage,
} from "@/lib/data/queries";
import { hasClimate } from "@/lib/data/climate";
import { hasCostOfLiving } from "@/lib/data/cost-of-living";
import { hasEducation } from "@/lib/data/education";
import { hasHealthcare } from "@/lib/data/healthcare-retirement";
import { createMetadata } from "@/lib/seo/metadata";
import { cityTitleName } from "@/lib/seo/city-title";
import {
  cityRoute,
  climateRoute,
  costOfLivingRoute,
  countryRoute,
  economyRoute,
  educationRoute,
  healthcareRoute,
  staticRoutes,
  visualCityGuideRoute,
  weekendTripRoute,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";
import type { EconomyCategory, EconomyProfile } from "@/types/economy";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return getAllEconomyProfiles().map((profile) => ({ city: profile.citySlug }));
}

const CATEGORY_LABEL: Record<EconomyCategory, string> = {
  global_hub: "Global hub",
  major_economy: "Major economy",
  regional_center: "Regional center",
  industrial_city: "Industrial city",
  tourism_economy: "Tourism economy",
  government_center: "Government center",
  education_research: "Education & research",
  mixed: "Mixed economy",
};

function pageTitle(cityName: string, countryName: string): string {
  return `Economy and jobs in ${cityName}, ${countryName}`;
}

function pageDescription(cityName: string, p: EconomyProfile): string {
  return `Economy and jobs profile for ${cityName}: a ${CATEGORY_LABEL[p.economyCategory].toLowerCase()} with an economy score of ${p.economyScore}/100, key industries including ${p.dominantIndustries.slice(0, 3).join(", ").toLowerCase()}, plus employment, salary, business, startup, remote-work, and career indicators. Deterministic planning estimates — not measured economic data.`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  const profile = getEconomy(citySlug);
  if (!city || !profile) {
    return {};
  }
  return createMetadata({
    title: pageTitle(cityTitleName(city), city.countryName),
    description: pageDescription(cityTitleName(city), profile),
    path: economyRoute(city.slug),
    lastModified: profile.updatedAt,
  });
}

export default async function EconomyPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  const economy = getEconomy(citySlug);
  const jobs = getJobs(citySlug);

  if (!city || !economy || !jobs) {
    notFound();
  }

  const country = getCountryBySlug(city.countrySlug);
  const title = pageTitle(cityTitleName(city), city.countryName);
  const description = pageDescription(cityTitleName(city), economy);

  const breadcrumbs = [
    { name: "Home", href: staticRoutes.home },
    { name: "Cities", href: staticRoutes.cities },
    { name: city.name, href: cityRoute(city.slug) },
    { name: "Economy", href: economyRoute(city.slug) },
  ];

  const sectorJobs: { label: string; value: number }[] = [
    { label: "Technology", value: jobs.technologyJobsScore },
    { label: "Healthcare", value: jobs.healthcareJobsScore },
    { label: "Finance", value: jobs.financeJobsScore },
    { label: "Manufacturing", value: jobs.manufacturingJobsScore },
    { label: "Tourism", value: jobs.tourismJobsScore },
    { label: "Education", value: jobs.educationJobsScore },
  ];

  const peers = (city.relatedCitySlugs ?? [])
    .map((slug) => {
      const peerCity = getCityBySlug(slug);
      const peerProfile = getEconomy(slug);
      return peerCity && peerProfile
        ? { city: peerCity, profile: peerProfile }
        : null;
    })
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main>
      <JsonLd data={webpageSchema({ path: economyRoute(city.slug), title, description })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHeader eyebrow="Economy & jobs" intro={economy.economySummary} title={title}>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Economy type
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {CATEGORY_LABEL[economy.economyCategory]}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Economy score
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {economy.economyScore}/100
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-12 pb-20">
        <BreadcrumbNav items={breadcrumbs} />

        <section aria-labelledby="overview-heading">
          <h2 className="sr-only" id="overview-heading">
            Economy overview
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>{economy.economySummary}</p>
            <p className="mt-3">
              {city.name}
              {country ? `, ${country.name}` : ""} is classified as a{" "}
              <span className="font-semibold text-text-primary">
                {CATEGORY_LABEL[economy.economyCategory].toLowerCase()}
              </span>{" "}
              in our deterministic economy index. These are planning estimates derived from country
              economic priors and existing city signals — not measured GDP or labour-market
              statistics. Data year {DATA_YEAR}; last updated {LAST_UPDATED}.
            </p>
          </Card>
        </section>

        <section aria-labelledby="industries-heading">
          <SectionHeading
            description="The sectors that most shape the local economy, derived deterministically from country and city signals."
            title="Key industries"
          />
          <h2 className="sr-only" id="industries-heading">
            Key industries
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {economy.dominantIndustries.map((industry) => (
              <li key={industry}>
                <span className="inline-flex rounded-full border border-neutral-border bg-neutral-soft px-3 py-1 text-sm font-medium text-text-primary">
                  {industry}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="employment-heading">
          <SectionHeading
            description="The breadth of the labour market and where opportunities concentrate."
            title="Employment outlook"
          />
          <h2 className="sr-only" id="employment-heading">
            Employment outlook
          </h2>
          <Card>
            <div className="space-y-4">
              <ScoreBar label="Employment" value={economy.employmentScore} />
              <ScoreBar label="Job market" value={jobs.jobMarketScore} />
            </div>
            <p className="mt-5 text-sm leading-6 text-text-secondary">{economy.jobsSummary}</p>
          </Card>
        </section>

        <section aria-labelledby="salary-heading">
          <SectionHeading
            description="Estimated pay levels and how far local incomes stretch against the cost of living."
            title="Salary potential"
          />
          <h2 className="sr-only" id="salary-heading">
            Salary potential
          </h2>
          <Card>
            <div className="space-y-4">
              <ScoreBar label="Salary potential" value={economy.salaryScore} />
              <ScoreBar
                label="Affordability-adjusted income"
                value={economy.affordabilityAdjustedIncomeScore}
              />
            </div>
            <p className="mt-5 text-sm leading-6 text-text-secondary">
              The affordability-adjusted income score combines estimated pay with the local cost of
              living, indicating how far a typical income stretches in {city.name}.
            </p>
          </Card>
        </section>

        <section aria-labelledby="business-heading">
          <SectionHeading
            description="Conditions for operating and growing a business locally."
            title="Business environment"
          />
          <h2 className="sr-only" id="business-heading">
            Business environment
          </h2>
          <Card>
            <ScoreBar label="Business environment" value={economy.businessEnvironmentScore} />
            <p className="mt-5 text-sm leading-6 text-text-secondary">
              This reflects infrastructure, institutional capacity, and the scale of the local
              market relative to peer cities.
            </p>
          </Card>
        </section>

        <section aria-labelledby="startup-heading">
          <SectionHeading
            description="How supportive the local ecosystem is for new ventures."
            title="Startup ecosystem"
          />
          <h2 className="sr-only" id="startup-heading">
            Startup ecosystem
          </h2>
          <Card>
            <div className="space-y-4">
              <ScoreBar label="Startup ecosystem" value={economy.startupScore} />
              <ScoreBar label="Innovation" value={economy.innovationScore} />
            </div>
            <p className="mt-5 text-sm leading-6 text-text-secondary">{economy.startupSummary}</p>
          </Card>
        </section>

        <section aria-labelledby="remote-heading">
          <SectionHeading
            description="Suitability for remote and distributed work."
            title="Remote work suitability"
          />
          <h2 className="sr-only" id="remote-heading">
            Remote work suitability
          </h2>
          <Card>
            <div className="space-y-4">
              <ScoreBar label="Remote work" value={economy.remoteWorkScore} />
              <ScoreBar label="Remote job availability" value={jobs.remoteWorkAvailabilityScore} />
            </div>
            <p className="mt-5 text-sm leading-6 text-text-secondary">{economy.remoteWorkSummary}</p>
          </Card>
        </section>

        <section aria-labelledby="career-heading">
          <SectionHeading
            description="Overall career opportunity and how it breaks down by sector."
            title="Career opportunities"
          />
          <h2 className="sr-only" id="career-heading">
            Career opportunities
          </h2>
          <Card>
            <div className="space-y-4">
              <ScoreBar
                label="Overall career opportunity"
                value={jobs.overallCareerOpportunityScore}
              />
              {sectorJobs.map((sector) => (
                <ScoreBar key={sector.label} label={sector.label} value={sector.value} />
              ))}
            </div>
          </Card>
        </section>

        <section aria-labelledby="economy-score-heading">
          <SectionHeading
            description="A 0–100 composite of employment, salary, business environment, startups, innovation, remote work, and affordability-adjusted income. Used consistently across the platform."
            title="Economy score"
          />
          <h2 className="sr-only" id="economy-score-heading">
            Economy score
          </h2>
          <Card>
            <div className="space-y-4">
              <ScoreBar label="Economy score" value={economy.economyScore} />
              <ScoreBar label="Employment" value={economy.employmentScore} />
              <ScoreBar label="Salary" value={economy.salaryScore} />
              <ScoreBar label="Business environment" value={economy.businessEnvironmentScore} />
              <ScoreBar label="Startup ecosystem" value={economy.startupScore} />
              <ScoreBar label="Innovation" value={economy.innovationScore} />
              <ScoreBar label="Remote work" value={economy.remoteWorkScore} />
            </div>
          </Card>
        </section>

        <section aria-labelledby="jobs-score-heading">
          <SectionHeading
            description="A 0–100 labour-market composite and its sector components."
            title="Jobs score"
          />
          <h2 className="sr-only" id="jobs-score-heading">
            Jobs score
          </h2>
          <Card>
            <div className="space-y-4">
              <ScoreBar label="Job market" value={jobs.jobMarketScore} />
              {sectorJobs.map((sector) => (
                <ScoreBar key={sector.label} label={sector.label} value={sector.value} />
              ))}
              <ScoreBar label="Remote availability" value={jobs.remoteWorkAvailabilityScore} />
              <ScoreBar label="Career opportunity" value={jobs.overallCareerOpportunityScore} />
            </div>
            {peers.length > 0 ? (
              <ul className="mt-5 grid gap-2 text-sm">
                {peers.map(({ city: peerCity, profile: peerProfile }) => (
                  <li key={peerCity.slug}>
                    <Link
                      className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                      href={economyRoute(peerCity.slug)}
                    >
                      Economy in {peerCity.name}
                    </Link>{" "}
                    — {CATEGORY_LABEL[peerProfile.economyCategory]}, economy{" "}
                    {peerProfile.economyScore}/100
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
            {hasCostOfLiving(city.slug) ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={costOfLivingRoute(city.slug)}
                >
                  Cost of living in {city.name}
                </Link>
              </li>
            ) : null}
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
            {hasEducation(city.slug) ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={educationRoute(city.slug)}
                >
                  Universities and education in {city.name}
                </Link>
              </li>
            ) : null}
            {hasHealthcare(city.slug) ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={healthcareRoute(city.slug)}
                >
                  Healthcare and retirement in {city.name}
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
          </ul>
        </section>
        <PhaseCrossLinks cityName={city.name} citySlug={city.slug} />
      </Container>
    </main>
  );
}
