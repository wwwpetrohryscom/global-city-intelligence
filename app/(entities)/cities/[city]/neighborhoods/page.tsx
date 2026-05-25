import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceHeroImage } from "@/components/media/PlaceHeroImage";
import {
  NeighborhoodOverviewCards,
  type NeighborhoodOverviewCard,
} from "@/components/neighborhoods/NeighborhoodOverviewCards";
import { NeighborhoodPlanningChecklist } from "@/components/neighborhoods/NeighborhoodPlanningChecklist";
import {
  NeighborhoodRelatedLinks,
  type NeighborhoodRelatedLink,
} from "@/components/neighborhoods/NeighborhoodRelatedLinks";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { Card } from "@/components/ui/Card";
import { FactList } from "@/components/ui/fact-list";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCityHeroImage } from "@/lib/data/media/queries";
import {
  getAllNeighborhoodPlanningPages,
  getCityBySlug,
  getComparisonsForCity,
  getCountryBySlug,
  getCountryEmergencyProfile,
  getCountryHealthcareProfile,
  getCountryTransportProfile,
  getNeighborhoodPlanningChecklist,
  getNeighborhoodPlanningFocusLabel,
  getNeighborhoodPlanningPageByCitySlug,
  getSourcesByIds,
  hasArrivalPage,
  hasVerifiedEmergencyData,
  hasVerifiedHealthcareData,
  hasVerifiedTransportData,
} from "@/lib/data/queries";
import { neighborhoodPlanningBreadcrumbs } from "@/lib/seo/breadcrumbs";
import {
  generateNeighborhoodPlanningMetadata,
  ogImageFromPlaceImage,
} from "@/lib/seo/metadata";
import {
  arrivalRoute,
  cityRoute,
  comparisonRoute,
  countryRoute,
  neighborhoodPlanningRoute,
  staticRoutes,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return getAllNeighborhoodPlanningPages().map((page) => ({
    city: page.citySlug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const planningPage = getNeighborhoodPlanningPageByCitySlug(citySlug);
  const city = planningPage ? getCityBySlug(planningPage.citySlug) : undefined;

  if (!planningPage || !city) {
    return {};
  }

  const country = getCountryBySlug(city.countrySlug);

  return generateNeighborhoodPlanningMetadata({
    planningPage,
    city,
    country,
    image: ogImageFromPlaceImage(getCityHeroImage(city.slug)),
  });
}

export default async function CityNeighborhoodsPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const planningPage = getNeighborhoodPlanningPageByCitySlug(citySlug);
  const city = planningPage ? getCityBySlug(planningPage.citySlug) : undefined;

  if (!planningPage || !city) {
    notFound();
  }

  const country = getCountryBySlug(city.countrySlug);
  const breadcrumbs = neighborhoodPlanningBreadcrumbs(city.slug);
  const sources = getSourcesByIds(planningPage.sourceIds);
  const checklist = getNeighborhoodPlanningChecklist();

  const emergencyProfile = getCountryEmergencyProfile(city.countrySlug);
  const healthcareProfile = getCountryHealthcareProfile(city.countrySlug);
  const transportProfile = getCountryTransportProfile(city.countrySlug);
  const emergencyVerified = hasVerifiedEmergencyData(emergencyProfile);
  const healthcareVerified = hasVerifiedHealthcareData(healthcareProfile);
  const transportVerified = hasVerifiedTransportData(transportProfile);

  const relatedComparisons = getComparisonsForCity(city.slug).slice(0, 4);
  const cityHasArrival = hasArrivalPage(city.slug);

  const title = `Neighborhood Planning Guide for ${city.name}`;
  const description = `Plan neighborhood research in ${city.name}${country ? `, ${country.name}` : ""} with transport context, public-safety context, healthcare access, arrival planning, budgeting tools, methodology notes, and source transparency.`;

  const overviewCards: NeighborhoodOverviewCard[] = [
    {
      label: "City",
      value: city.name,
      description: country
        ? `Indexed city profile in ${country.name}.`
        : "Indexed city profile.",
    },
    {
      label: "Country hub",
      value: country?.name ?? "Linked country profile",
      description:
        "Open the country hub for verified emergency, healthcare, and transport-authority context where available.",
    },
    {
      label: "Planning focus",
      value: getNeighborhoodPlanningFocusLabel(planningPage.planningFocus),
      description:
        "Editorial framing for this neighborhood planning guide. The page does not name or rank neighborhoods.",
    },
    {
      label: "Verified context layers",
      value: String(
        [emergencyVerified, healthcareVerified, transportVerified].filter(
          Boolean,
        ).length,
      ),
      description:
        "Count of verified emergency, healthcare, and transport profiles available for the country / city.",
    },
  ];

  const relatedLinks: NeighborhoodRelatedLink[] = [
    {
      label: `${city.name} city intelligence profile`,
      href: cityRoute(city.slug),
      description:
        "Open the full city profile for directional indicators and module context.",
    },
    ...(country
      ? [
          {
            label: `${country.name} country intelligence hub`,
            href: countryRoute(country.slug),
            description:
              "National context behind city indicators and verified utility layers.",
          },
        ]
      : []),
    ...(cityHasArrival
      ? [
          {
            label: `Arrival planning guide for ${city.name}`,
            href: arrivalRoute(city.slug),
            description:
              "First-day arrival planning context — pairs with neighborhood research.",
          },
        ]
      : []),
    {
      label: "Cost of living calculator",
      href: staticRoutes.costOfLivingCalculator,
      description:
        "Compare monthly costs between cities using your own inputs.",
    },
    {
      label: "Travel budget calculator",
      href: staticRoutes.travelBudgetCalculator,
      description:
        "Estimate a trip and arrival budget using your own inputs. Planning estimator only.",
    },
    {
      label: "Relocation checklist",
      href: staticRoutes.relocationChecklist,
      description:
        "Structure relocation preparation across documents, housing, healthcare, and first-week planning.",
    },
    {
      label: "Cities directory",
      href: staticRoutes.cities,
      description: "Browse every indexed city profile.",
    },
    {
      label: "Countries directory",
      href: staticRoutes.countries,
      description: "National context for every supported country.",
    },
    {
      label: "City comparisons",
      href: staticRoutes.compare,
      description: "Side-by-side directional comparisons between cities.",
    },
    {
      label: "Scoring methodology",
      href: staticRoutes.methodology,
      description: "How structured indicators are constructed and read.",
    },
    {
      label: "Data sources registry",
      href: staticRoutes.dataSources,
      description: "Official publishers cited by verified layers.",
    },
  ];

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: neighborhoodPlanningRoute(city.slug),
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHeader
        eyebrow="Neighborhood planning"
        intro={planningPage.summary}
        title={title}
      >
        <dl className="grid gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              City
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              <Link
                className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                href={cityRoute(city.slug)}
              >
                {city.name}
              </Link>
            </dd>
          </div>
          {country ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Country
              </dt>
              <dd className="mt-1 text-lg font-semibold text-text-primary">
                <Link
                  className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                  href={countryRoute(country.slug)}
                >
                  {country.name}
                </Link>
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Last updated
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {planningPage.updatedDate}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {planningPage.dataYear}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-14 py-12">
        <BreadcrumbNav items={breadcrumbs} />

        <section
          aria-label={`${city.name} visual context for neighborhood planning`}
          className="max-w-2xl"
        >
          <PlaceHeroImage
            placeName={`${city.name}${country ? `, ${country.name}` : ""}`}
            placeSlug={city.slug}
            placeType="city"
          />
        </section>

        <FactList
          facts={[
            {
              label: "Page style",
              value:
                "Neighborhood research checklist (not a real-estate, rental, or safety-ranking service)",
            },
            {
              label: "Sources referenced",
              value: `${sources.length} structured references`,
            },
            {
              label: "Indexing",
              value: "Allowed in robots",
            },
            {
              label: "Verification",
              value:
                emergencyVerified || healthcareVerified || transportVerified
                  ? "At least one verified country-level utility layer"
                  : "Structured indicators only; fallback for verified layers",
            },
          ]}
        />

        <section aria-labelledby="neighborhood-overview-heading">
          <SectionHeading
            description={`Snapshot for neighborhood research in ${city.name}. Each card connects to the structured profile, country hub, and verified context layers behind the indicators. This page does not name or rank neighborhoods.`}
            title={`${city.name} neighborhood planning overview`}
          />
          <h2 className="sr-only" id="neighborhood-overview-heading">
            {city.name} neighborhood planning overview
          </h2>
          <div className="mt-6">
            <NeighborhoodOverviewCards cards={overviewCards} />
          </div>
        </section>

        <section aria-labelledby="neighborhood-checklist-heading">
          <SectionHeading
            description="Practical, neutral checklist organised by research category. Items reference structured platform sections and official sources — they do not name neighborhoods, publish rent or crime data, school rankings, or legal / rental / immigration advice."
            title="Neighborhood research checklist"
          />
          <h2 className="sr-only" id="neighborhood-checklist-heading">
            Neighborhood research checklist
          </h2>
          <div className="mt-6">
            <NeighborhoodPlanningChecklist items={checklist} />
          </div>
        </section>

        <section aria-labelledby="neighborhood-context-heading">
          <SectionHeading
            description="Which platform-side context layers are available for the country and city behind neighborhood research. Where verified data is not on file, the platform shows a transparent fallback rather than fabricated information."
            title="Context-layer availability"
          />
          <h2 className="sr-only" id="neighborhood-context-heading">
            Context-layer availability for {city.name}
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            <li>
              <Card as="article" className="h-full">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Transport context
                </p>
                <p className="mt-2 text-sm leading-6 text-text-primary">
                  {transportVerified
                    ? `Verified country-level transport-authority context is on file for ${country?.name ?? "this country"}. Confirm routes, fares, and schedules through the official authorities cited on the country hub.`
                    : `No verified country-level transport-authority context is on file yet. Use the city transport / mobility profile for structured framing and confirm details through official authorities.`}
                </p>
                <Link
                  className="mt-3 inline-block text-sm font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={cityRoute(city.slug)}
                >
                  Open the city transport context
                </Link>
              </Card>
            </li>
            <li>
              <Card as="article" className="h-full">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Safety context
                </p>
                <p className="mt-2 text-sm leading-6 text-text-primary">
                  {emergencyVerified
                    ? `Verified country-level emergency contact context is on file for ${country?.name ?? "this country"}. Always confirm current numbers with the official local emergency service. This page does not publish crime rates or area safety rankings.`
                    : `No verified country-level emergency contact context is on file yet. Confirm current emergency numbers with the official local service. This page does not publish crime rates or area safety rankings.`}
                </p>
                {country ? (
                  <Link
                    className="mt-3 inline-block text-sm font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                    href={countryRoute(country.slug)}
                  >
                    Open the country safety context
                  </Link>
                ) : null}
              </Card>
            </li>
            <li>
              <Card as="article" className="h-full">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Healthcare context
                </p>
                <p className="mt-2 text-sm leading-6 text-text-primary">
                  {healthcareVerified
                    ? `Verified country-level healthcare access context is on file for ${country?.name ?? "this country"}. Confirm registration, insurance, and access through official local sources. This page does not publish school or hospital rankings.`
                    : `No verified country-level healthcare access context is on file yet. Confirm registration, insurance, and access through official local sources. This page does not publish school or hospital rankings.`}
                </p>
                {country ? (
                  <Link
                    className="mt-3 inline-block text-sm font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                    href={countryRoute(country.slug)}
                  >
                    Open the country healthcare context
                  </Link>
                ) : null}
              </Card>
            </li>
          </ul>
        </section>

        <section aria-labelledby="neighborhood-related-heading">
          <SectionHeading
            description="Open the related platform layers behind neighborhood research. Verify housing, safety, and local information directly with official and local sources."
            title="Related context and tools"
          />
          <h2 className="sr-only" id="neighborhood-related-heading">
            Related context and tools for {city.name} neighborhood planning
          </h2>
          <NeighborhoodRelatedLinks links={relatedLinks} />
        </section>

        {relatedComparisons.length > 0 ? (
          <section aria-labelledby="neighborhood-comparisons-heading">
            <SectionHeading
              description={`City-vs-city comparisons that include ${city.name}. Use these to weigh neighborhood research against other cities you are considering.`}
              title="Related comparisons"
            />
            <h2 className="sr-only" id="neighborhood-comparisons-heading">
              Related comparisons for {city.name}
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {relatedComparisons.map((comparison) => (
                <li key={comparison.slug}>
                  <Card as="article" className="h-full p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Comparison
                    </p>
                    <p className="mt-2 text-base font-semibold text-text-primary">
                      <Link
                        className="underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                        href={comparisonRoute(comparison.slug)}
                      >
                        {comparison.title}
                      </Link>
                    </p>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {comparison.description}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="neighborhood-disclaimer-heading">
          <SectionHeading
            description="What this page is and is not. Read this before treating any neighborhood-related decision as final."
            title="Scope and limitations"
          />
          <h2 className="sr-only" id="neighborhood-disclaimer-heading">
            Scope and limitations
          </h2>
          <div className="mt-6 rounded-2xl border border-neutral-border bg-surface-soft p-6">
            <p className="text-sm leading-7 text-text-primary">
              This page is a neighborhood <strong>research checklist</strong>{" "}
              for {city.name}
              {country ? `, ${country.name}` : ""}. It does not name
              neighborhoods, publish rent or sale prices, crime rates, school
              rankings, hospital proximities, walkability scores, transit
              operators, or area &ldquo;best&rdquo; / &ldquo;safest&rdquo; /
              &ldquo;cheapest&rdquo; claims. Confirm
              housing, lease, safety, healthcare, school, transport, and visa
              details directly with the landlord, agent, official local
              authority, or qualified professional. This is not real-estate,
              rental, legal, immigration, financial, or medical advice.
            </p>
          </div>
        </section>

        <SourceBlock sources={sources} />
      </Container>
    </main>
  );
}
