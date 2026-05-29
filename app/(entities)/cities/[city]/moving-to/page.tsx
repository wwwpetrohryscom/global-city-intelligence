import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceHeroImage } from "@/components/media/PlaceHeroImage";
import { MovingChecklist } from "@/components/moving/MovingChecklist";
import {
  MovingOverviewCards,
  type MovingOverviewCard,
} from "@/components/moving/MovingOverviewCards";
import {
  MovingRelatedLinks,
  type MovingRelatedLink,
} from "@/components/moving/MovingRelatedLinks";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { Card } from "@/components/ui/Card";
import { FactList } from "@/components/ui/fact-list";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCityHeroImage } from "@/lib/data/media/queries";
import {
  getAllMovingToCityPages,
  getCityBySlug,
  getComparisonsForCity,
  getCountryBySlug,
  getCountryEmergencyProfile,
  getCountryHealthcareProfile,
  getCountryTransportProfile,
  getMovingFocusLabel,
  getMovingToCityChecklist,
  getMovingToCityPageByCitySlug,
  getSourcesByIds,
  hasArrivalPage,
  hasNeighborhoodPlanningPage,
  hasSummerTravelPage,
  hasVerifiedEmergencyData,
  hasVerifiedHealthcareData,
  hasVerifiedTransportData,
  hasVisualCityGuidePage,
} from "@/lib/data/queries";
import { movingToCityBreadcrumbs } from "@/lib/seo/breadcrumbs";
import {
  generateMovingToCityMetadata,
  ogImageFromPlaceImage,
} from "@/lib/seo/metadata";
import {
  arrivalRoute,
  cityRoute,
  comparisonRoute,
  countryRoute,
  movingToCityRoute,
  neighborhoodPlanningRoute,
  staticRoutes,
  summerTravelRoute,
  visualCityGuideRoute,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return getAllMovingToCityPages().map((page) => ({ city: page.citySlug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const movingPage = getMovingToCityPageByCitySlug(citySlug);
  const city = movingPage ? getCityBySlug(movingPage.citySlug) : undefined;

  if (!movingPage || !city) {
    return {};
  }

  const country = getCountryBySlug(city.countrySlug);

  return generateMovingToCityMetadata({
    movingPage,
    city,
    country,
    image: ogImageFromPlaceImage(getCityHeroImage(city.slug)),
  });
}

export default async function MovingToCityPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const movingPage = getMovingToCityPageByCitySlug(citySlug);
  const city = movingPage ? getCityBySlug(movingPage.citySlug) : undefined;

  if (!movingPage || !city) {
    notFound();
  }

  const country = getCountryBySlug(city.countrySlug);
  const breadcrumbs = movingToCityBreadcrumbs(city.slug);
  const sources = getSourcesByIds(movingPage.sourceIds);
  const checklist = getMovingToCityChecklist();

  const emergencyProfile = getCountryEmergencyProfile(city.countrySlug);
  const healthcareProfile = getCountryHealthcareProfile(city.countrySlug);
  const transportProfile = getCountryTransportProfile(city.countrySlug);
  const emergencyVerified = hasVerifiedEmergencyData(emergencyProfile);
  const healthcareVerified = hasVerifiedHealthcareData(healthcareProfile);
  const transportVerified = hasVerifiedTransportData(transportProfile);

  const relatedComparisons = getComparisonsForCity(city.slug).slice(0, 4);
  const cityHasArrival = hasArrivalPage(city.slug);
  const cityHasNeighborhood = hasNeighborhoodPlanningPage(city.slug);
  const cityHasVisualGuide = hasVisualCityGuidePage(city.slug);
  const cityHasSummerTravel = hasSummerTravelPage(city.slug);

  const title = `Moving to ${city.name}: Planning Guide`;
  const description = `Plan relocation research for ${city.name}${country ? `, ${country.name}` : ""} with city context, country context, arrival planning, neighborhood research, cost tools, healthcare access, public-safety context, transport notes, and source transparency. Not immigration, visa, tax, legal, financial, medical, or property advice.`;

  const overviewCards: MovingOverviewCard[] = [
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
      label: "Relocation focus",
      value: getMovingFocusLabel(movingPage.movingFocus),
      description:
        "Editorial framing for this relocation planning guide. The page does not give visa, tax, legal, or property advice.",
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

  const relatedLinks: MovingRelatedLink[] = [
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
              "First-day arrival planning context — pairs with relocation research.",
          },
        ]
      : []),
    ...(cityHasNeighborhood
      ? [
          {
            label: `Neighborhood planning guide for ${city.name}`,
            href: neighborhoodPlanningRoute(city.slug),
            description:
              "Structured neighborhood research checklist — pairs with relocation planning.",
          },
        ]
      : []),
    ...(cityHasVisualGuide
      ? [
          {
            label: `Visual guide to ${city.name}`,
            href: visualCityGuideRoute(city.slug),
            description:
              "Source-attributed verified imagery alongside structured city intelligence.",
          },
        ]
      : []),
    ...(cityHasSummerTravel
      ? [
          {
            label: `Summer travel planning guide for ${city.name}`,
            href: summerTravelRoute(city.slug),
            description:
              "Seasonal planning checklist — pairs with relocation research.",
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
          path: movingToCityRoute(city.slug),
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHeader
        eyebrow="Moving to"
        intro={movingPage.summary}
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
              {movingPage.updatedDate}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {movingPage.dataYear}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-14 py-12">
        <BreadcrumbNav items={breadcrumbs} />

        <section
          aria-label={`${city.name} visual context for relocation planning`}
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
                "Relocation research checklist (not immigration, visa, tax, legal, financial, medical, or property advice)",
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

        <section aria-labelledby="moving-overview-heading">
          <SectionHeading
            description={`Snapshot for planning a move to ${city.name}. Each card connects to the structured profile, country hub, and verified context layers behind the indicators. This page does not provide visa, tax, legal, or property advice.`}
            title={`${city.name} relocation planning overview`}
          />
          <h2 className="sr-only" id="moving-overview-heading">
            {city.name} relocation planning overview
          </h2>
          <div className="mt-6">
            <MovingOverviewCards cards={overviewCards} />
          </div>
        </section>

        <section aria-labelledby="moving-checklist-heading">
          <SectionHeading
            description="Practical, neutral checklist organised by relocation category. Items reference structured platform sections and official sources — they do not publish visa rules, tax rules, rent prices, salary expectations, crime rates, school rankings, or property advice."
            title="Relocation research checklist"
          />
          <h2 className="sr-only" id="moving-checklist-heading">
            Relocation research checklist
          </h2>
          <div className="mt-6">
            <MovingChecklist items={checklist} />
          </div>
        </section>

        <section aria-labelledby="moving-context-heading">
          <SectionHeading
            description="Which platform-side context layers are available for the country and city behind relocation research. Where verified data is not on file, the platform shows a transparent fallback rather than fabricated information."
            title="Context-layer availability"
          />
          <h2 className="sr-only" id="moving-context-heading">
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
                    ? `Verified country-level emergency contact context is on file for ${country?.name ?? "this country"}. Always confirm current numbers with the official local emergency service.`
                    : `No verified country-level emergency contact context is on file yet. Confirm current emergency numbers with the official local service.`}
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
                    ? `Verified country-level healthcare access context is on file for ${country?.name ?? "this country"}. Confirm registration, insurance, and access through official local sources.`
                    : `No verified country-level healthcare access context is on file yet. Confirm registration, insurance, and access through official local sources.`}
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

        <section aria-labelledby="moving-related-heading">
          <SectionHeading
            description="Open the related platform layers behind relocation research. Verify legal, immigration, tax, housing, and healthcare details directly with official or qualified sources."
            title="Related context and tools"
          />
          <h2 className="sr-only" id="moving-related-heading">
            Related context and tools for moving to {city.name}
          </h2>
          <MovingRelatedLinks links={relatedLinks} />
        </section>

        {relatedComparisons.length > 0 ? (
          <section aria-labelledby="moving-comparisons-heading">
            <SectionHeading
              description={`City-vs-city comparisons that include ${city.name}. Use these to weigh relocation research against other cities you are considering.`}
              title="Related comparisons"
            />
            <h2 className="sr-only" id="moving-comparisons-heading">
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

        <section aria-labelledby="moving-disclaimer-heading">
          <SectionHeading
            description="What this page is and is not. Read this before treating any relocation decision as final."
            title="Scope and limitations"
          />
          <h2 className="sr-only" id="moving-disclaimer-heading">
            Scope and limitations
          </h2>
          <div className="mt-6 rounded-2xl border border-neutral-border bg-surface-soft p-6">
            <p className="text-sm leading-7 text-text-primary">
              This page is a relocation <strong>research checklist</strong> for
              {" "}
              {city.name}
              {country ? `, ${country.name}` : ""}. It does not publish visa or
              immigration steps, tax rules, rental law, rent or sale prices,
              salary expectations, exact cost estimates, crime rates, school
              rankings, hospital proximities, transit operators, or area
              &ldquo;best&rdquo; / &ldquo;safest&rdquo; / &ldquo;cheapest&rdquo;
              claims. Confirm immigration, residency, registration, tax,
              housing, healthcare, and family-service details directly with the
              official government source, landlord, agent, or qualified
              professional. This is not immigration, visa, tax, legal,
              financial, medical, or property advice.
            </p>
          </div>
        </section>

        <SourceBlock sources={sources} />
      </Container>
    </main>
  );
}
