import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceHeroImage } from "@/components/media/PlaceHeroImage";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { SummerTravelChecklist } from "@/components/summer-travel/SummerTravelChecklist";
import {
  SummerTravelOverviewCards,
  type SummerTravelOverviewCard,
} from "@/components/summer-travel/SummerTravelOverviewCards";
import {
  SummerTravelRelatedLinks,
  type SummerTravelRelatedLink,
} from "@/components/summer-travel/SummerTravelRelatedLinks";
import { Card } from "@/components/ui/Card";
import { FactList } from "@/components/ui/fact-list";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCityHeroImage } from "@/lib/data/media/queries";
import {
  getAllSummerTravelPages,
  getCityBySlug,
  getComparisonsForCity,
  getCountryBySlug,
  getCountryEmergencyProfile,
  getCountryHealthcareProfile,
  getCountryTransportProfile,
  getSourcesByIds,
  getSummerTravelChecklist,
  getSummerTravelFocusLabel,
  getSummerTravelPageByCitySlug,
  hasArrivalPage,
  hasMovingToCityPage,
  hasNeighborhoodPlanningPage,
  hasVerifiedEmergencyData,
  hasVerifiedHealthcareData,
  hasVerifiedTransportData,
  hasVisualCityGuidePage,
} from "@/lib/data/queries";
import { summerTravelBreadcrumbs } from "@/lib/seo/breadcrumbs";
import {
  generateSummerTravelMetadata,
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
  return getAllSummerTravelPages().map((page) => ({ city: page.citySlug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const summerPage = getSummerTravelPageByCitySlug(citySlug);
  const city = summerPage ? getCityBySlug(summerPage.citySlug) : undefined;

  if (!summerPage || !city) {
    return {};
  }

  const country = getCountryBySlug(city.countrySlug);

  return generateSummerTravelMetadata({
    summerPage,
    city,
    country,
    image: ogImageFromPlaceImage(getCityHeroImage(city.slug)),
  });
}

export default async function SummerTravelPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const summerPage = getSummerTravelPageByCitySlug(citySlug);
  const city = summerPage ? getCityBySlug(summerPage.citySlug) : undefined;

  if (!summerPage || !city) {
    notFound();
  }

  const country = getCountryBySlug(city.countrySlug);
  const breadcrumbs = summerTravelBreadcrumbs(city.slug);
  const sources = getSourcesByIds(summerPage.sourceIds);
  const checklist = getSummerTravelChecklist();

  const emergencyProfile = getCountryEmergencyProfile(city.countrySlug);
  const healthcareProfile = getCountryHealthcareProfile(city.countrySlug);
  const transportProfile = getCountryTransportProfile(city.countrySlug);
  const emergencyVerified = hasVerifiedEmergencyData(emergencyProfile);
  const healthcareVerified = hasVerifiedHealthcareData(healthcareProfile);
  const transportVerified = hasVerifiedTransportData(transportProfile);

  const relatedComparisons = getComparisonsForCity(city.slug).slice(0, 4);
  const cityHasArrival = hasArrivalPage(city.slug);
  const cityHasNeighborhood = hasNeighborhoodPlanningPage(city.slug);
  const cityHasMovingTo = hasMovingToCityPage(city.slug);
  const cityHasVisualGuide = hasVisualCityGuidePage(city.slug);

  const title = `Summer Travel Planning Guide for ${city.name}`;
  const description = `Plan summer travel research for ${city.name}${country ? `, ${country.name}` : ""} with arrival planning, visual orientation, budget tools, transport context, healthcare and public-safety context, city comparisons, methodology, and source transparency.`;

  const overviewCards: SummerTravelOverviewCard[] = [
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
      label: "Summer focus",
      value: getSummerTravelFocusLabel(summerPage.summerFocus),
      description:
        "Editorial framing for this summer travel planning guide. The page does not publish weather forecasts, event dates, or tourism rankings.",
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

  const relatedLinks: SummerTravelRelatedLink[] = [
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
              "First-day arrival planning context — pairs with summer planning.",
          },
        ]
      : []),
    ...(cityHasVisualGuide
      ? [
          {
            label: `Visual guide to ${city.name}`,
            href: visualCityGuideRoute(city.slug),
            description:
              "Source-attributed verified imagery — pairs with summer planning.",
          },
        ]
      : []),
    ...(cityHasNeighborhood
      ? [
          {
            label: `Neighborhood planning guide for ${city.name}`,
            href: neighborhoodPlanningRoute(city.slug),
            description:
              "Neighborhood research checklist — pairs with summer planning.",
          },
        ]
      : []),
    ...(cityHasMovingTo
      ? [
          {
            label: `Moving to ${city.name} planning guide`,
            href: movingToCityRoute(city.slug),
            description:
              "Relocation research checklist — pairs with summer planning.",
          },
        ]
      : []),
    {
      label: "Travel budget calculator",
      href: staticRoutes.travelBudgetCalculator,
      description:
        "Estimate a trip and arrival budget using your own inputs. Planning estimator only.",
    },
    {
      label: "Cost of living calculator",
      href: staticRoutes.costOfLivingCalculator,
      description:
        "Compare monthly costs between cities using your own inputs.",
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
      label: "Arrival planning directory",
      href: staticRoutes.arrival,
      description: "Browse every curated city arrival planning guide.",
    },
    {
      label: "Moving-to directory",
      href: staticRoutes.movingTo,
      description: "Browse every curated moving-to city planning guide.",
    },
    {
      label: "Visual city guides directory",
      href: staticRoutes.visualGuides,
      description: "Browse every curated source-attributed visual city guide.",
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
          path: summerTravelRoute(city.slug),
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHeader
        eyebrow="Summer travel"
        intro={summerPage.summary}
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
              {summerPage.updatedDate}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {summerPage.dataYear}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-14 py-12">
        <BreadcrumbNav items={breadcrumbs} />

        <section
          aria-label={`${city.name} visual context for summer travel planning`}
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
                "Summer travel planning checklist (not a weather forecast, events calendar, hotel-price guide, or tourism ranking)",
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

        <section aria-labelledby="summer-overview-heading">
          <SectionHeading
            description={`Snapshot for planning summer 2026 travel to ${city.name}. Cards link to the structured profile, country hub, and verified context layers behind the indicators. This page does not publish weather forecasts, event dates, or tourism rankings.`}
            title={`${city.name} summer travel overview`}
          />
          <h2 className="sr-only" id="summer-overview-heading">
            {city.name} summer travel overview
          </h2>
          <div className="mt-6">
            <SummerTravelOverviewCards cards={overviewCards} />
          </div>
        </section>

        <section aria-labelledby="summer-checklist-heading">
          <SectionHeading
            description="Practical, neutral summer 2026 planning checklist organised by category. Items reference structured platform sections and official sources — they do not publish weather forecasts, event dates, ticket prices, hotel prices, transport schedules, airport routes, or attraction rankings."
            title="Summer 2026 planning checklist"
          />
          <h2 className="sr-only" id="summer-checklist-heading">
            Summer 2026 planning checklist
          </h2>
          <div className="mt-6">
            <SummerTravelChecklist items={checklist} />
          </div>
        </section>

        <section aria-labelledby="summer-context-heading">
          <SectionHeading
            description="Which platform-side context layers are available for the country and city behind summer travel planning. Where verified data is not on file, the platform shows a transparent fallback rather than fabricated information."
            title="Context-layer availability"
          />
          <h2 className="sr-only" id="summer-context-heading">
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
                    ? `Verified country-level healthcare access context is on file for ${country?.name ?? "this country"}. Confirm registration, insurance, and access through official local sources. This guide is not medical advice.`
                    : `No verified country-level healthcare access context is on file yet. Confirm registration, insurance, and access through official local sources. This guide is not medical advice.`}
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

        <section aria-labelledby="summer-related-heading">
          <SectionHeading
            description="Open the related platform layers behind summer travel planning. Verify weather, events, transport, health, and safety details with official or trusted current sources before departure."
            title="Related context and tools"
          />
          <h2 className="sr-only" id="summer-related-heading">
            Related context and tools for {city.name} summer travel
          </h2>
          <SummerTravelRelatedLinks links={relatedLinks} />
        </section>

        {relatedComparisons.length > 0 ? (
          <section aria-labelledby="summer-comparisons-heading">
            <SectionHeading
              description={`City-vs-city comparisons that include ${city.name}. Use these alongside summer travel planning to weigh other cities you are considering.`}
              title="Related comparisons"
            />
            <h2 className="sr-only" id="summer-comparisons-heading">
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

        <section aria-labelledby="summer-disclaimer-heading">
          <SectionHeading
            description="What this page is and is not. Read this before treating any summer travel detail as final."
            title="Scope and limitations"
          />
          <h2 className="sr-only" id="summer-disclaimer-heading">
            Scope and limitations
          </h2>
          <div className="mt-6 rounded-2xl border border-neutral-border bg-surface-soft p-6">
            <p className="text-sm leading-7 text-text-primary">
              This page supports summer 2026 city travel planning for
              {" "}
              {city.name}
              {country ? `, ${country.name}` : ""}. It does not publish weather
              forecasts, exact temperatures, heatwave claims, event or festival
              dates, ticket prices, hotel or flight prices, opening hours,
              transport schedules, airport routes, attraction rankings, crime
              rates, or any &ldquo;best&rdquo; / &ldquo;must-see&rdquo; /
              &ldquo;safest&rdquo; / &ldquo;cheapest&rdquo; claims. Verify
              weather, events, transport, health, and safety details with
              official or trusted current sources before departure. This is not
              medical, legal, visa, or immigration advice.
            </p>
          </div>
        </section>

        <SourceBlock sources={sources} />
      </Container>
    </main>
  );
}
