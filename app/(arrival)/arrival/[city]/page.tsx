import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrivalChecklist,
} from "@/components/arrival/ArrivalChecklist";
import {
  ArrivalOverviewCards,
  type ArrivalOverviewCard,
} from "@/components/arrival/ArrivalOverviewCards";
import {
  ArrivalRelatedLinks,
  type ArrivalRelatedLink,
} from "@/components/arrival/ArrivalRelatedLinks";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceHeroImage } from "@/components/media/PlaceHeroImage";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { Card } from "@/components/ui/Card";
import { FactList } from "@/components/ui/fact-list";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCityHeroImage } from "@/lib/data/media/queries";
import {
  getAllArrivalPages,
  getArrivalChecklist,
  getArrivalFocusLabel,
  getArrivalPageByCitySlug,
  getCityBySlug,
  getComparisonsForCity,
  getCountryBySlug,
  getCountryEmergencyProfile,
  getCountryHealthcareProfile,
  getCountryTransportProfile,
  getSourcesByIds,
  hasMovingToCityPage,
  hasNeighborhoodPlanningPage,
  hasSummerTravelPage,
  hasVerifiedEmergencyData,
  hasVerifiedHealthcareData,
  hasVerifiedTransportData,
  hasVisualCityGuidePage,
} from "@/lib/data/queries";
import { arrivalBreadcrumbs } from "@/lib/seo/breadcrumbs";
import {
  generateArrivalMetadata,
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
  return getAllArrivalPages().map((page) => ({ city: page.citySlug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const arrivalPage = getArrivalPageByCitySlug(citySlug);
  const city = arrivalPage ? getCityBySlug(arrivalPage.citySlug) : undefined;

  if (!arrivalPage || !city) {
    return {};
  }

  const country = getCountryBySlug(city.countrySlug);

  return generateArrivalMetadata({
    arrivalPage,
    city,
    country,
    image: ogImageFromPlaceImage(getCityHeroImage(city.slug)),
  });
}

export default async function ArrivalCityPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const arrivalPage = getArrivalPageByCitySlug(citySlug);
  const city = arrivalPage ? getCityBySlug(arrivalPage.citySlug) : undefined;

  if (!arrivalPage || !city) {
    notFound();
  }

  const country = getCountryBySlug(city.countrySlug);
  const breadcrumbs = arrivalBreadcrumbs(city.slug);
  const sources = getSourcesByIds(arrivalPage.sourceIds);
  const checklist = getArrivalChecklist();

  const emergencyProfile = getCountryEmergencyProfile(city.countrySlug);
  const healthcareProfile = getCountryHealthcareProfile(city.countrySlug);
  const transportProfile = getCountryTransportProfile(city.countrySlug);
  const emergencyVerified = hasVerifiedEmergencyData(emergencyProfile);
  const healthcareVerified = hasVerifiedHealthcareData(healthcareProfile);
  const transportVerified = hasVerifiedTransportData(transportProfile);

  const relatedComparisons = getComparisonsForCity(city.slug).slice(0, 4);

  const title = `Arriving in ${city.name}: City Arrival Planning Guide`;
  const description = `Plan your arrival in ${city.name}${country ? `, ${country.name}` : ""} with city intelligence links, transport context, public-safety references, healthcare access notes, budget tools, sources, and methodology — not an official airport or travel instruction service.`;

  const overviewCards: ArrivalOverviewCard[] = [
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
      label: "Arrival focus",
      value: getArrivalFocusLabel(arrivalPage.arrivalFocus),
      description:
        "Editorial framing for this arrival guide. The full content covers general planning, not airport-specific instructions.",
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

  const relatedLinks: ArrivalRelatedLink[] = [
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
    ...(hasNeighborhoodPlanningPage(city.slug)
      ? [
          {
            label: `Neighborhood planning guide for ${city.name}`,
            href: neighborhoodPlanningRoute(city.slug),
            description:
              "Structured neighborhood research checklist — pairs with arrival planning.",
          },
        ]
      : []),
    ...(hasMovingToCityPage(city.slug)
      ? [
          {
            label: `Moving to ${city.name} planning guide`,
            href: movingToCityRoute(city.slug),
            description:
              "Structured relocation research checklist — pairs with arrival planning.",
          },
        ]
      : []),
    ...(hasVisualCityGuidePage(city.slug)
      ? [
          {
            label: `Visual guide to ${city.name}`,
            href: visualCityGuideRoute(city.slug),
            description:
              "Source-attributed verified imagery alongside structured city intelligence.",
          },
        ]
      : []),
    ...(hasSummerTravelPage(city.slug)
      ? [
          {
            label: `Summer travel planning guide for ${city.name}`,
            href: summerTravelRoute(city.slug),
            description:
              "Seasonal planning checklist — pairs with arrival research.",
          },
        ]
      : []),
    {
      label: "Travel budget calculator",
      href: staticRoutes.travelBudgetCalculator,
      description:
        "Estimate a trip budget using your own inputs. Planning estimator only.",
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
          path: arrivalRoute(city.slug),
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHeader eyebrow="Arrival planning" intro={arrivalPage.summary} title={title}>
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
              {arrivalPage.updatedDate}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {arrivalPage.dataYear}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-14 py-12">
        <BreadcrumbNav items={breadcrumbs} />

        <section
          aria-label={`${city.name} visual context for arrival planning`}
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
              value: "Comparison-oriented arrival guide (not an official airport or travel service)",
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

        <section aria-labelledby="arrival-overview-heading">
          <SectionHeading
            description={`Snapshot for arriving in ${city.name}. Each card connects to the structured profile, country hub, and verified context layers behind the indicators.`}
            title={`${city.name} arrival overview`}
          />
          <h2 className="sr-only" id="arrival-overview-heading">
            {city.name} arrival overview
          </h2>
          <div className="mt-6">
            <ArrivalOverviewCards cards={overviewCards} />
          </div>
        </section>

        <section aria-labelledby="arrival-checklist-heading">
          <SectionHeading
            description="Practical, neutral checklist organised by category. Items reference structured platform sections and official sources — they do not provide schedules, fares, transfer routes, visa instructions, or medical advice."
            title="Arrival planning checklist"
          />
          <h2 className="sr-only" id="arrival-checklist-heading">
            Arrival planning checklist
          </h2>
          <div className="mt-6">
            <ArrivalChecklist items={checklist} />
          </div>
        </section>

        <section aria-labelledby="arrival-context-heading">
          <SectionHeading
            description="Which platform-side context layers are available for the country and city around arrival. Where verified data is not on file, the platform shows a transparent fallback rather than fabricated information."
            title="Context-layer availability"
          />
          <h2 className="sr-only" id="arrival-context-heading">
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
                    : `No verified country-level transport-authority context is on file yet. Use the city transport / mobility profile for structured context and confirm details through official authorities.`}
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
                    ? `Verified country-level healthcare access context is on file for ${country?.name ?? "this country"}. Use it alongside official insurance and access documentation.`
                    : `No verified country-level healthcare access context is on file yet. Confirm access and coverage with official sources.`}
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

        <section aria-labelledby="arrival-budget-heading">
          <SectionHeading
            description="Planning estimators that use your own inputs. They do not query airport, flight, hotel, or transport providers and do not provide live prices."
            title="Budget and relocation tools"
          />
          <h2 className="sr-only" id="arrival-budget-heading">
            Budget and relocation tools
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            <li>
              <Card as="article" className="h-full">
                <h3 className="text-base font-semibold text-text-primary">
                  Travel budget calculator
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Estimate accommodation, food, local transport, activities,
                  travel, healthcare buffer, and emergency buffer using your
                  own inputs.
                </p>
                <Link
                  className="mt-3 inline-block text-sm font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.travelBudgetCalculator}
                >
                  Open the travel budget calculator
                </Link>
              </Card>
            </li>
            <li>
              <Card as="article" className="h-full">
                <h3 className="text-base font-semibold text-text-primary">
                  Cost of living calculator
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Compare monthly living budgets between cities using your own
                  housing, food, transport, healthcare, and lifestyle inputs.
                </p>
                <Link
                  className="mt-3 inline-block text-sm font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.costOfLivingCalculator}
                >
                  Open the cost of living calculator
                </Link>
              </Card>
            </li>
            <li>
              <Card as="article" className="h-full">
                <h3 className="text-base font-semibold text-text-primary">
                  Relocation checklist
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Organise city research, budgeting, documents, housing,
                  healthcare, transport, and first-week planning.
                </p>
                <Link
                  className="mt-3 inline-block text-sm font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={staticRoutes.relocationChecklist}
                >
                  Open the relocation checklist
                </Link>
              </Card>
            </li>
          </ul>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Card as="article" className="p-6">
            <h2 className="text-2xl font-semibold text-text-primary">
              Methodology and limitations
            </h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Arrival planning guides are comparison-oriented and link back to
              the structured city, country, transport, safety, and healthcare
              layers on the platform. This page does not publish airport names,
              transfer routes, fares, schedules, taxi prices, or visa
              requirements. For time-sensitive details — flights, official
              transport disruptions, emergency numbers, healthcare coverage,
              and visa or immigration rules — always verify with the official
              source. Read the{" "}
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.methodology}
              >
                scoring methodology
              </Link>{" "}
              for how indicators are constructed, and the{" "}
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.dataSources}
              >
                data sources
              </Link>{" "}
              registry for the official publishers cited across the site.
            </p>
            <ArrivalRelatedLinks links={relatedLinks} />
          </Card>
          <SourceBlock sources={sources} />
        </section>

        {relatedComparisons.length > 0 ? (
          <section aria-labelledby="arrival-related-comparisons-heading">
            <SectionHeading
              description={`City comparisons that include ${city.name}. Comparisons reuse the structured city and country indicators behind this arrival guide.`}
              title={`Related comparisons including ${city.name}`}
            />
            <h2 className="sr-only" id="arrival-related-comparisons-heading">
              Related comparisons including {city.name}
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {relatedComparisons.map((comparison) => (
                <li key={comparison.slug}>
                  <Card as="article" interactive>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      {comparison.region}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-text-primary">
                      <Link
                        className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                        href={comparisonRoute(comparison.slug)}
                      >
                        {comparison.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {comparison.description}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </main>
  );
}
