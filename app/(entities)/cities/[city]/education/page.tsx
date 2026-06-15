import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/Card";
import { ScoreBar } from "@/components/ui/score-bar";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllEducationProfiles,
  getCityBySlug,
  getCountryBySlug,
  getEducation,
  getUniversitiesForCity,
  hasVisualCityGuidePage,
  hasWeekendTripPage,
} from "@/lib/data/queries";
import { hasClimate } from "@/lib/data/climate";
import { hasCostOfLiving } from "@/lib/data/cost-of-living";
import { hasEconomy } from "@/lib/data/economy";
import { createMetadata } from "@/lib/seo/metadata";
import {
  cityRoute,
  climateRoute,
  costOfLivingRoute,
  countryRoute,
  economyRoute,
  educationRoute,
  staticRoutes,
  visualCityGuideRoute,
  weekendTripRoute,
} from "@/lib/seo/routes";
import { breadcrumbSchema, itemListSchema, webpageSchema } from "@/lib/seo/schema";
import type { EducationCategory, EducationProfile } from "@/types/education";
import type { UniversityType } from "@/types/universities";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return getAllEducationProfiles().map((profile) => ({ city: profile.citySlug }));
}

const CATEGORY_LABEL: Record<EducationCategory, string> = {
  global_academic_hub: "Global academic hub",
  major_university_city: "Major university city",
  research_center: "Research center",
  student_city: "Student city",
  regional_education_center: "Regional education center",
  mixed: "Mixed education base",
};

const TYPE_LABEL: Record<UniversityType, string> = {
  public: "Public",
  private: "Private",
  research: "Research",
  technical: "Technical",
  medical: "Medical",
  business: "Business",
};

const REPRESENTATIVE_NOTE =
  "Universities below are deterministic, representative dataset entities generated for research and discovery — they are not a directory of specific, real, or accredited institutions, and the scores are not rankings. Verify actual universities and accreditation with official sources.";

function pageTitle(cityName: string): string {
  return `Universities and education in ${cityName}`;
}

function pageDescription(cityName: string, p: EducationProfile): string {
  return `Education profile for ${cityName}: ${CATEGORY_LABEL[p.educationCategory].toLowerCase()} with an education score of ${p.educationScore}/100, covering universities, research environment, student life, and international students. Deterministic, representative dataset — not institutional rankings.`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  const profile = getEducation(citySlug);
  if (!city || !profile) {
    return {};
  }
  return createMetadata({
    title: pageTitle(city.name),
    description: pageDescription(city.name, profile),
    path: educationRoute(city.slug),
    lastModified: profile.updatedAt,
  });
}

export default async function EducationPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  const profile = getEducation(citySlug);

  if (!city || !profile) {
    notFound();
  }

  const country = getCountryBySlug(city.countrySlug);
  const universities = getUniversitiesForCity(city.slug);
  const title = pageTitle(city.name);
  const description = pageDescription(city.name, profile);

  const breadcrumbs = [
    { name: "Home", href: staticRoutes.home },
    { name: "Cities", href: staticRoutes.cities },
    { name: city.name, href: cityRoute(city.slug) },
    { name: "Education", href: educationRoute(city.slug) },
  ];

  // Aggregate academic strengths across the city's universities (top by frequency).
  const focusFreq = new Map<string, number>();
  for (const u of universities) {
    for (const f of u.focusAreas) {
      focusFreq.set(f, (focusFreq.get(f) ?? 0) + 1);
    }
  }
  const academicStrengths = [...focusFreq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([f]) => f);

  return (
    <main>
      <JsonLd data={webpageSchema({ path: educationRoute(city.slug), title, description })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={itemListSchema({
          name: `Universities in ${city.name}`,
          description: `Representative universities in ${city.name} (deterministic dataset entities).`,
          items: universities.map((u) => ({ name: u.name, path: educationRoute(city.slug) })),
        })}
      />

      <PageHeader eyebrow="Education & universities" intro={profile.educationSummary} title={title}>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Education type
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {CATEGORY_LABEL[profile.educationCategory]}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Education score
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {profile.educationScore}/100
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-12 pb-20">
        <BreadcrumbNav items={breadcrumbs} />

        <section aria-labelledby="overview-heading">
          <h2 className="sr-only" id="overview-heading">
            Education overview
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>{profile.educationSummary}</p>
            <p className="mt-3">
              {city.name}
              {country ? `, ${country.name}` : ""} is classified as a{" "}
              <span className="font-semibold text-text-primary">
                {CATEGORY_LABEL[profile.educationCategory].toLowerCase()}
              </span>{" "}
              in our deterministic education index. These are planning estimates derived from
              country academic priors and existing city signals — not measured enrolment data or
              institutional rankings. Data year {DATA_YEAR}; last updated {LAST_UPDATED}.
            </p>
          </Card>
        </section>

        <section aria-labelledby="universities-heading">
          <SectionHeading
            description="Representative academic ecosystem for this city — deterministic dataset entities, not a verified institutional directory."
            title="Universities"
          />
          <h2 className="sr-only" id="universities-heading">
            Universities
          </h2>
          <Card className="mb-5 border-dashed text-sm leading-6 text-text-secondary">
            <p>{REPRESENTATIVE_NOTE}</p>
          </Card>
          <ul className="grid gap-4 md:grid-cols-2">
            {universities.map((u) => (
              <li key={u.id}>
                <Card className="h-full">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-base font-semibold text-text-primary">{u.name}</h3>
                    <span className="shrink-0 rounded-full border border-neutral-border bg-neutral-soft px-2.5 py-0.5 text-xs font-medium text-text-secondary">
                      {TYPE_LABEL[u.type]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">
                    {u.studentPopulationCategory} student body
                    {u.foundedYear ? ` · est. ~${u.foundedYear}` : ""}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {u.focusAreas.map((f) => (
                      <li key={f}>
                        <span className="inline-flex rounded-full bg-neutral-soft px-2 py-0.5 text-xs text-text-secondary">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-text-secondary">
                    <div>
                      <dt className="inline">Research intensity: </dt>
                      <dd className="inline font-semibold text-text-primary">
                        {u.researchIntensityScore}/100
                      </dd>
                    </div>
                    <div>
                      <dt className="inline">International focus: </dt>
                      <dd className="inline font-semibold text-text-primary">
                        {u.internationalFocusScore}/100
                      </dd>
                    </div>
                  </dl>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="research-env-heading">
          <SectionHeading
            description="Where research activity concentrates and how strong it is."
            title="Research environment"
          />
          <h2 className="sr-only" id="research-env-heading">
            Research environment
          </h2>
          <Card>
            <ScoreBar label="Research" value={profile.researchScore} />
            <p className="mt-5 text-sm leading-6 text-text-secondary">{profile.researchSummary}</p>
          </Card>
        </section>

        <section aria-labelledby="student-life-heading">
          <SectionHeading
            description="The day-to-day experience for students."
            title="Student life"
          />
          <h2 className="sr-only" id="student-life-heading">
            Student life
          </h2>
          <Card>
            <ScoreBar label="Student friendliness" value={profile.studentFriendlinessScore} />
            <p className="mt-5 text-sm leading-6 text-text-secondary">
              {profile.studentExperienceSummary}
            </p>
          </Card>
        </section>

        <section aria-labelledby="international-heading">
          <SectionHeading
            description="How the city draws students from abroad."
            title="International students"
          />
          <h2 className="sr-only" id="international-heading">
            International students
          </h2>
          <Card>
            <ScoreBar label="International students" value={profile.internationalStudentScore} />
            <p className="mt-5 text-sm leading-6 text-text-secondary">
              {profile.internationalSummary}
            </p>
          </Card>
        </section>

        <section aria-labelledby="strengths-heading">
          <SectionHeading
            description="Academic fields most represented across the city's universities in our dataset."
            title="Academic strengths"
          />
          <h2 className="sr-only" id="strengths-heading">
            Academic strengths
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {academicStrengths.map((f) => (
              <li key={f}>
                <span className="inline-flex rounded-full border border-neutral-border bg-neutral-soft px-3 py-1 text-sm font-medium text-text-primary">
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="education-score-heading">
          <SectionHeading
            description="A 0–100 composite of higher education, research, reputation, student friendliness, international appeal, and university density. Used consistently across the platform."
            title="Education score"
          />
          <h2 className="sr-only" id="education-score-heading">
            Education score
          </h2>
          <Card>
            <div className="space-y-4">
              <ScoreBar label="Education score" value={profile.educationScore} />
              <ScoreBar label="Higher education" value={profile.higherEducationScore} />
              <ScoreBar label="Research" value={profile.researchScore} />
              <ScoreBar label="Academic reputation" value={profile.academicReputationScore} />
              <ScoreBar label="Student friendliness" value={profile.studentFriendlinessScore} />
              <ScoreBar label="International students" value={profile.internationalStudentScore} />
              <ScoreBar label="University density" value={profile.universityDensityScore} />
            </div>
          </Card>
        </section>

        <section aria-labelledby="student-friendliness-heading">
          <SectionHeading
            description="How well the city supports student life overall."
            title="Student friendliness"
          />
          <h2 className="sr-only" id="student-friendliness-heading">
            Student friendliness
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <ScoreBar label="Student friendliness" value={profile.studentFriendlinessScore} />
            <p className="mt-5">
              {city.name} has a student-friendliness score of{" "}
              <span className="font-semibold text-text-primary">
                {profile.studentFriendlinessScore}/100
              </span>
              , reflecting affordability, walkability, connectivity, and overall quality of life for
              students.
            </p>
          </Card>
        </section>

        <section aria-labelledby="research-score-heading">
          <SectionHeading
            description="Research strength and the density of academic institutions."
            title="Research score"
          />
          <h2 className="sr-only" id="research-score-heading">
            Research score
          </h2>
          <Card>
            <div className="space-y-4">
              <ScoreBar label="Research" value={profile.researchScore} />
              <ScoreBar label="University density" value={profile.universityDensityScore} />
              <ScoreBar label="Academic reputation" value={profile.academicReputationScore} />
            </div>
            <p className="mt-5 text-sm leading-6 text-text-secondary">
              {city.name} has {universities.length} representative universities in our dataset and a
              research score of {profile.researchScore}/100.
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
      </Container>
    </main>
  );
}
