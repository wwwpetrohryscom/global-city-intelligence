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
  getAllHealthcareProfiles,
  getCityBySlug,
  getCountryBySlug,
  getHealthcare,
  getMedicalFacilitiesForCity,
  getRetirement,
  hasVisualCityGuidePage,
  hasWeekendTripPage,
} from "@/lib/data/queries";
import { hasClimate } from "@/lib/data/climate";
import { hasCostOfLiving } from "@/lib/data/cost-of-living";
import { hasEconomy } from "@/lib/data/economy";
import { hasEducation } from "@/lib/data/education";
import { createMetadata } from "@/lib/seo/metadata";
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
import { breadcrumbSchema, itemListSchema, webpageSchema } from "@/lib/seo/schema";
import type { HealthcareCategory, HealthcareProfile } from "@/types/healthcare";
import type { MedicalFacilityType } from "@/types/medical-facilities";
import type { RetirementCategory } from "@/types/retirement";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return getAllHealthcareProfiles().map((profile) => ({ city: profile.citySlug }));
}

const HC_CATEGORY_LABEL: Record<HealthcareCategory, string> = {
  global_medical_hub: "Global medical hub",
  major_healthcare_center: "Major healthcare center",
  regional_healthcare_center: "Regional healthcare center",
  healthcare_access_city: "Healthcare access city",
  developing_healthcare_market: "Developing healthcare market",
  mixed: "Mixed healthcare profile",
};

const RET_CATEGORY_LABEL: Record<RetirementCategory, string> = {
  premium_retirement: "Premium retirement",
  active_retirement: "Active retirement",
  affordable_retirement: "Affordable retirement",
  urban_retirement: "Urban retirement",
  nature_retirement: "Nature retirement",
  mixed: "Mixed retirement profile",
};

const FAC_TYPE_LABEL: Record<MedicalFacilityType, string> = {
  general_hospital: "General hospital",
  specialist_hospital: "Specialist hospital",
  university_hospital: "University hospital",
  medical_center: "Medical center",
  community_hospital: "Community hospital",
};

const REPRESENTATIVE_NOTE =
  "Facilities below are deterministic, representative dataset entities generated for research and discovery — they are not a directory of specific, real, or accredited hospitals or clinics. Verify actual facilities, services, and emergency information with official sources.";

function pageTitle(cityName: string): string {
  return `Healthcare and retirement in ${cityName}`;
}

function pageDescription(cityName: string, p: HealthcareProfile): string {
  return `Healthcare and retirement profile for ${cityName}: ${HC_CATEGORY_LABEL[p.healthcareCategory].toLowerCase()} with a healthcare score of ${p.healthcareScore}/100, covering medical access, specialist and emergency care, affordability, and retirement suitability. Deterministic planning estimates — not measured health data or a facility directory.`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  const profile = getHealthcare(citySlug);
  if (!city || !profile) {
    return {};
  }
  return createMetadata({
    title: pageTitle(city.name),
    description: pageDescription(city.name, profile),
    path: healthcareRoute(city.slug),
    lastModified: profile.updatedAt,
  });
}

export default async function HealthcarePage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  const healthcare = getHealthcare(citySlug);
  const retirement = getRetirement(citySlug);

  if (!city || !healthcare || !retirement) {
    notFound();
  }

  const country = getCountryBySlug(city.countrySlug);
  const facilities = getMedicalFacilitiesForCity(city.slug);
  const title = pageTitle(city.name);
  const description = pageDescription(city.name, healthcare);

  const breadcrumbs = [
    { name: "Home", href: staticRoutes.home },
    { name: "Cities", href: staticRoutes.cities },
    { name: city.name, href: cityRoute(city.slug) },
    { name: "Healthcare", href: healthcareRoute(city.slug) },
  ];

  return (
    <main>
      <JsonLd data={webpageSchema({ path: healthcareRoute(city.slug), title, description })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={itemListSchema({
          name: `Medical facilities in ${city.name}`,
          description: `Representative medical facilities in ${city.name} (deterministic dataset entities).`,
          items: facilities.map((f) => ({ name: f.name, path: healthcareRoute(city.slug) })),
        })}
      />

      <PageHeader eyebrow="Healthcare & retirement" intro={healthcare.healthcareSummary} title={title}>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Healthcare type
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {HC_CATEGORY_LABEL[healthcare.healthcareCategory]}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Healthcare score
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {healthcare.healthcareScore}/100
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Retirement score
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {retirement.retirementScore}/100
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-12 pb-20">
        <BreadcrumbNav items={breadcrumbs} />

        <section aria-labelledby="overview-heading">
          <h2 className="sr-only" id="overview-heading">
            Healthcare overview
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>{healthcare.healthcareSummary}</p>
            <p className="mt-3">
              {city.name}
              {country ? `, ${country.name}` : ""} is classified as a{" "}
              <span className="font-semibold text-text-primary">
                {HC_CATEGORY_LABEL[healthcare.healthcareCategory].toLowerCase()}
              </span>{" "}
              in our deterministic healthcare index. These are planning estimates derived from
              country healthcare priors and existing city signals — not measured clinical data,
              outcomes, or a facility directory. Data year {DATA_YEAR}; last updated {LAST_UPDATED}.
            </p>
          </Card>
        </section>

        <section aria-labelledby="facilities-heading">
          <SectionHeading
            description="Representative healthcare ecosystem for this city — deterministic dataset entities, not a verified facility directory."
            title="Medical facilities"
          />
          <h2 className="sr-only" id="facilities-heading">
            Medical facilities
          </h2>
          <Card className="mb-5 border-dashed text-sm leading-6 text-text-secondary">
            <p>{REPRESENTATIVE_NOTE}</p>
          </Card>
          <ul className="grid gap-3 md:grid-cols-2">
            {facilities.map((f) => (
              <li key={f.id}>
                <Card className="flex h-full items-baseline justify-between gap-3">
                  <span className="text-sm font-semibold text-text-primary">{f.name}</span>
                  <span className="shrink-0 text-right text-xs text-text-secondary">
                    {FAC_TYPE_LABEL[f.type]}
                    <br />
                    {f.serviceLevel} service
                  </span>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="access-heading">
          <SectionHeading
            description="How readily residents can reach healthcare services."
            title="Healthcare access"
          />
          <h2 className="sr-only" id="access-heading">
            Healthcare access
          </h2>
          <Card>
            <ScoreBar label="Healthcare access" value={healthcare.healthcareAccessScore} />
            <p className="mt-5 text-sm leading-6 text-text-secondary">
              {healthcare.medicalAccessSummary}
            </p>
          </Card>
        </section>

        <section aria-labelledby="emergency-heading">
          <SectionHeading
            description="Capacity and reach of emergency medical care."
            title="Emergency care"
          />
          <h2 className="sr-only" id="emergency-heading">
            Emergency care
          </h2>
          <Card>
            <ScoreBar label="Emergency care" value={healthcare.emergencyCareScore} />
            <p className="mt-5 text-sm leading-6 text-text-secondary">
              Emergency-care capacity reflects infrastructure, hospital availability, and the scale
              of the local medical system. For real emergency information, always use official local
              services.
            </p>
          </Card>
        </section>

        <section aria-labelledby="specialist-heading">
          <SectionHeading
            description="Availability of specialist and advanced medical services."
            title="Specialist care"
          />
          <h2 className="sr-only" id="specialist-heading">
            Specialist care
          </h2>
          <Card>
            <div className="space-y-4">
              <ScoreBar label="Specialist care" value={healthcare.specialistCareScore} />
              <ScoreBar label="Hospital availability" value={healthcare.hospitalAvailabilityScore} />
              <ScoreBar label="Preventative care" value={healthcare.preventativeCareScore} />
            </div>
            <p className="mt-5 text-sm leading-6 text-text-secondary">
              Specialist-care strength is supported by larger hospitals, university and teaching
              facilities, and medical research where present.
            </p>
          </Card>
        </section>

        <section aria-labelledby="hc-score-heading">
          <SectionHeading
            description="A 0–100 composite of access, hospital availability, specialist, preventative, and emergency care, plus affordability. Used consistently across the platform."
            title="Healthcare score"
          />
          <h2 className="sr-only" id="hc-score-heading">
            Healthcare score
          </h2>
          <Card>
            <div className="space-y-4">
              <ScoreBar label="Healthcare score" value={healthcare.healthcareScore} />
              <ScoreBar label="Access" value={healthcare.healthcareAccessScore} />
              <ScoreBar label="Hospital availability" value={healthcare.hospitalAvailabilityScore} />
              <ScoreBar label="Specialist care" value={healthcare.specialistCareScore} />
              <ScoreBar label="Preventative care" value={healthcare.preventativeCareScore} />
              <ScoreBar label="Emergency care" value={healthcare.emergencyCareScore} />
              <ScoreBar label="Affordability" value={healthcare.healthcareAffordabilityScore} />
            </div>
          </Card>
        </section>

        <section aria-labelledby="hc-afford-heading">
          <SectionHeading
            description="How affordable healthcare is, shaped by the public-system context and local costs."
            title="Healthcare affordability"
          />
          <h2 className="sr-only" id="hc-afford-heading">
            Healthcare affordability
          </h2>
          <Card>
            <ScoreBar label="Healthcare affordability" value={healthcare.healthcareAffordabilityScore} />
            <p className="mt-5 text-sm leading-6 text-text-secondary">
              A higher score indicates more affordable access, typically reflecting public-healthcare
              coverage and lower out-of-pocket costs.
            </p>
          </Card>
        </section>

        <section aria-labelledby="hc-category-heading">
          <SectionHeading
            description="The healthcare archetype this city most resembles, and what supports it."
            title="Healthcare category"
          />
          <h2 className="sr-only" id="hc-category-heading">
            Healthcare category
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>
              {city.name} is a{" "}
              <span className="font-semibold text-text-primary">
                {HC_CATEGORY_LABEL[healthcare.healthcareCategory].toLowerCase()}
              </span>
              . {healthcare.healthcareEnvironmentSummary}
            </p>
          </Card>
        </section>

        <section aria-labelledby="ret-suitability-heading">
          <SectionHeading
            description="How the city stacks up as a place to retire, combining healthcare, safety, affordability, and lifestyle."
            title="Retirement suitability"
          />
          <h2 className="sr-only" id="ret-suitability-heading">
            Retirement suitability
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>{retirement.retirementSummary}</p>
          </Card>
        </section>

        <section aria-labelledby="ret-score-heading">
          <SectionHeading
            description="A 0–100 composite of healthcare support, affordability, safety, climate comfort, active lifestyle, accessibility, and walkability."
            title="Retirement score"
          />
          <h2 className="sr-only" id="ret-score-heading">
            Retirement score
          </h2>
          <Card>
            <div className="space-y-4">
              <ScoreBar label="Retirement score" value={retirement.retirementScore} />
              <ScoreBar label="Healthcare support" value={retirement.healthcareSupportScore} />
              <ScoreBar label="Affordability" value={retirement.affordabilityScore} />
              <ScoreBar label="Safety support" value={retirement.safetySupportScore} />
              <ScoreBar label="Climate comfort" value={retirement.climateComfortScore} />
              <ScoreBar label="Active lifestyle" value={retirement.activeLifestyleScore} />
              <ScoreBar label="Accessibility" value={retirement.accessibilityScore} />
              <ScoreBar label="Walkability" value={retirement.walkabilityScore} />
            </div>
          </Card>
        </section>

        <section aria-labelledby="ret-category-heading">
          <SectionHeading
            description="The retirement archetype this city most resembles."
            title="Retirement category"
          />
          <h2 className="sr-only" id="ret-category-heading">
            Retirement category
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>
              {city.name} fits the{" "}
              <span className="font-semibold text-text-primary">
                {RET_CATEGORY_LABEL[retirement.retirementCategory].toLowerCase()}
              </span>{" "}
              profile, based on the balance of its retirement indicators. These are planning
              estimates, not financial, medical, or relocation advice.
            </p>
          </Card>
        </section>

        <section aria-labelledby="ret-lifestyle-heading">
          <SectionHeading
            description="Everyday amenities and quality of life for residents."
            title="Lifestyle"
          />
          <h2 className="sr-only" id="ret-lifestyle-heading">
            Lifestyle
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>{retirement.lifestyleSummary}</p>
          </Card>
        </section>

        <section aria-labelledby="ret-climate-heading">
          <SectionHeading
            description="How comfortable the year-round climate is."
            title="Climate comfort"
          />
          <h2 className="sr-only" id="ret-climate-heading">
            Climate comfort
          </h2>
          <Card>
            <ScoreBar label="Climate comfort" value={retirement.climateComfortScore} />
          </Card>
        </section>

        <section aria-labelledby="ret-access-heading">
          <SectionHeading
            description="Ease of getting around, via public transport, walkability, and infrastructure."
            title="Accessibility"
          />
          <h2 className="sr-only" id="ret-access-heading">
            Accessibility
          </h2>
          <Card>
            <ScoreBar label="Accessibility" value={retirement.accessibilityScore} />
          </Card>
        </section>

        <section aria-labelledby="ret-walk-heading">
          <SectionHeading
            description="How walkable the city is day to day."
            title="Walkability"
          />
          <h2 className="sr-only" id="ret-walk-heading">
            Walkability
          </h2>
          <Card>
            <ScoreBar label="Walkability" value={retirement.walkabilityScore} />
          </Card>
        </section>

        <section aria-labelledby="ret-active-heading">
          <SectionHeading
            description="Support for an active, outdoor retirement lifestyle."
            title="Active retirement"
          />
          <h2 className="sr-only" id="ret-active-heading">
            Active retirement
          </h2>
          <Card>
            <ScoreBar label="Active lifestyle" value={retirement.activeLifestyleScore} />
            <p className="mt-5 text-sm leading-6 text-text-secondary">
              {retirement.activeLivingSummary}
            </p>
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
