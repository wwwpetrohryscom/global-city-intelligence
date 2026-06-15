import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceHeroImage } from "@/components/media/PlaceHeroImage";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { Card } from "@/components/ui/Card";
import { FactList } from "@/components/ui/fact-list";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  VisualGuideMediaSection,
} from "@/components/visual-guides/VisualGuideMediaSection";
import {
  VisualGuideOverviewCards,
  type VisualGuideOverviewCard,
} from "@/components/visual-guides/VisualGuideOverviewCards";
import {
  VisualGuideRelatedLinks,
  type VisualGuideRelatedLink,
} from "@/components/visual-guides/VisualGuideRelatedLinks";
import {
  getCityHeroImage,
  getPlaceSecondaryImages,
} from "@/lib/data/media/queries";
import {
  getAllVisualCityGuidePages,
  getCityBySlug,
  getComparisonsForCity,
  getCountryBySlug,
  getCountryEmergencyProfile,
  getCountryHealthcareProfile,
  getCountryTransportProfile,
  getRegionalCollectionsForCity,
  getRegionTypeLabel,
  getThematicCollectionsForCity,
  getThemeLabel,
  getSourcesByIds,
  getVisualCityGuidePageByCitySlug,
  getVisualGuideFocusLabel,
  getVisualGuideSections,
  hasArrivalPage,
  hasMovingToCityPage,
  hasNeighborhoodPlanningPage,
  hasSummerTravelPage,
  hasVerifiedEmergencyData,
  hasVerifiedHealthcareData,
  hasVerifiedTransportData,
  hasWeekendTripPage,
} from "@/lib/data/queries";
import { visualCityGuideBreadcrumbs } from "@/lib/seo/breadcrumbs";
import {
  generateVisualCityGuideMetadata,
  ogImageFromPlaceImage,
} from "@/lib/seo/metadata";
import {
  arrivalRoute,
  cityRoute,
  climateRoute,
  costOfLivingRoute,
  economyRoute,
  comparisonRoute,
  countryRoute,
  movingToCityRoute,
  neighborhoodPlanningRoute,
  regionalCollectionRoute,
  thematicCollectionRoute,
  staticRoutes,
  summerTravelRoute,
  visualCityGuideRoute,
  weekendTripRoute,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return getAllVisualCityGuidePages().map((page) => ({
    city: page.citySlug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const visualPage = getVisualCityGuidePageByCitySlug(citySlug);
  const city = visualPage ? getCityBySlug(visualPage.citySlug) : undefined;

  if (!visualPage || !city) {
    return {};
  }

  const country = getCountryBySlug(city.countrySlug);

  return generateVisualCityGuideMetadata({
    visualPage,
    city,
    country,
    image: ogImageFromPlaceImage(getCityHeroImage(city.slug)),
  });
}

export default async function VisualCityGuidePage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const visualPage = getVisualCityGuidePageByCitySlug(citySlug);
  const city = visualPage ? getCityBySlug(visualPage.citySlug) : undefined;

  if (!visualPage || !city) {
    notFound();
  }

  const country = getCountryBySlug(city.countrySlug);
  const breadcrumbs = visualCityGuideBreadcrumbs(city.slug);
  const sources = getSourcesByIds(visualPage.sourceIds);
  const sections = getVisualGuideSections();
  const heroImage = getCityHeroImage(city.slug);
  const secondaryImages = getPlaceSecondaryImages("city", city.slug);

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
  const cityHasSummerTravel = hasSummerTravelPage(city.slug);
  const cityHasWeekendTrip = hasWeekendTripPage(city.slug);
  const relatedCollections = getRegionalCollectionsForCity(city.slug).slice(0, 6);
  const themedCollections = getThematicCollectionsForCity(city.slug).slice(0, 6);

  const title = `Visual Guide to ${city.name}`;
  const description = `Explore source-attributed visual context for ${city.name}${country ? `, ${country.name}` : ""} with city intelligence links, arrival planning, neighborhood research, moving-to planning, comparisons, tools, methodology, and source transparency.`;

  const overviewCards: VisualGuideOverviewCard[] = [
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
      label: "Visual focus",
      value: getVisualGuideFocusLabel(visualPage.visualFocus),
      description:
        "Editorial framing for this visual guide. Images are orientation, not evidence — pair with structured context layers.",
    },
    {
      label: "Verified imagery",
      value: heroImage
        ? secondaryImages.length > 0
          ? `Hero + ${secondaryImages.length} secondary`
          : "Hero only"
        : "Fallback (no verified hero)",
      description:
        "Imagery comes from the existing verified media catalog with source, author, and license metadata. Fallback cities render the designed fallback block instead.",
    },
  ];

  const relatedLinks: VisualGuideRelatedLink[] = [
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
              "First-day arrival planning context — pairs with visual orientation.",
          },
        ]
      : []),
    ...(cityHasNeighborhood
      ? [
          {
            label: `Neighborhood planning guide for ${city.name}`,
            href: neighborhoodPlanningRoute(city.slug),
            description:
              "Structured neighborhood research checklist — pairs with visual orientation.",
          },
        ]
      : []),
    ...(cityHasMovingTo
      ? [
          {
            label: `Moving to ${city.name} planning guide`,
            href: movingToCityRoute(city.slug),
            description:
              "Relocation research checklist — pairs with visual orientation.",
          },
        ]
      : []),
    ...(cityHasSummerTravel
      ? [
          {
            label: `Summer 2026 travel planning guide for ${city.name}`,
            href: summerTravelRoute(city.slug),
            description:
              "Seasonal planning checklist — pairs with visual orientation.",
          },
        ]
      : []),
    ...(cityHasWeekendTrip
      ? [
          {
            label: `Weekend trip planning guide for ${city.name}`,
            href: weekendTripRoute(city.slug),
            description:
              "Short-trip planning checklist — pairs with visual orientation.",
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
      label: `Cost of living in ${city.name}`,
      href: costOfLivingRoute(city.slug),
      description:
        "Monthly budgets, rent, food, and transport in the local currency, with an affordability score. Planning estimates, not live prices.",
    },
    {
      label: `Climate in ${city.name}`,
      href: climateRoute(city.slug),
      description:
        "Month-by-month temperatures, rainfall, sunshine, and the best months to visit, with a climate comfort score. Deterministic estimates, not a forecast.",
    },
    {
      label: `Economy and jobs in ${city.name}`,
      href: economyRoute(city.slug),
      description:
        "Key industries, employment, salary, startup, remote-work, and career indicators, with an economy score. Deterministic planning estimates, not measured economic data.",
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
          path: visualCityGuideRoute(city.slug),
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHeader
        eyebrow="Visual guide"
        intro={visualPage.summary}
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
              {visualPage.updatedDate}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {visualPage.dataYear}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-14 py-12">
        <BreadcrumbNav items={breadcrumbs} />

        <section
          aria-label={`${city.name} verified hero imagery`}
          className="max-w-3xl"
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
                "Visual orientation guide (not a tourism guide, attractions ranking, or official tourism information)",
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

        <section aria-labelledby="visual-overview-heading">
          <SectionHeading
            description={`Snapshot for orienting visually around ${city.name}. Cards link to the structured profile, country hub, and verified context layers behind the indicators. Imagery is orientation, not evidence.`}
            title={`${city.name} visual overview`}
          />
          <h2 className="sr-only" id="visual-overview-heading">
            {city.name} visual overview
          </h2>
          <div className="mt-6">
            <VisualGuideOverviewCards cards={overviewCards} />
          </div>
        </section>

        {secondaryImages.length > 0 ? (
          <section aria-labelledby="visual-secondary-heading">
            <SectionHeading
              description={`Up to three additional verified images from the existing media catalog, each with source and license attribution. Use these as orientation only — they capture single moments and are not evidence of current conditions.`}
              title="More verified imagery"
            />
            <h2 className="sr-only" id="visual-secondary-heading">
              More verified imagery of {city.name}
            </h2>
            <VisualGuideMediaSection images={secondaryImages} />
          </section>
        ) : null}

        <section aria-labelledby="visual-reading-heading">
          <SectionHeading
            description="How to read a city visually using the platform. Each prompt connects imagery to structured indicators and official sources — imagery is orientation, not evidence."
            title={`How to read ${city.name} visually`}
          />
          <h2 className="sr-only" id="visual-reading-heading">
            How to read {city.name} visually
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {sections.map((section) => (
              <li key={section.label}>
                <Card as="article" className="h-full p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    {section.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-primary">
                    {section.description}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="visual-context-heading">
          <SectionHeading
            description="Which platform-side context layers are available for the country and city behind the imagery. Where verified data is not on file, the platform shows a transparent fallback rather than fabricated information."
            title="Context-layer availability"
          />
          <h2 className="sr-only" id="visual-context-heading">
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

        <section aria-labelledby="visual-related-heading">
          <SectionHeading
            description="Open the related platform layers behind the visual orientation. Use city, country, arrival, neighborhood, and moving-to planning pages alongside the imagery."
            title="Related context and tools"
          />
          <h2 className="sr-only" id="visual-related-heading">
            Related context and tools for the {city.name} visual guide
          </h2>
          <VisualGuideRelatedLinks links={relatedLinks} />
        </section>

        {relatedComparisons.length > 0 ? (
          <section aria-labelledby="visual-comparisons-heading">
            <SectionHeading
              description={`City-vs-city comparisons that include ${city.name}. Use these alongside the visual orientation to weigh other cities you are considering.`}
              title="Related comparisons"
            />
            <h2 className="sr-only" id="visual-comparisons-heading">
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

        {relatedCollections.length > 0 ? (
          <section aria-labelledby="visual-collections-heading">
            <SectionHeading
              description={`Regional discovery collections that include ${city.name} — named natural regions grouping nearby places and cities for local-first day and weekend planning.`}
              title="Related collections"
            />
            <h2 className="sr-only" id="visual-collections-heading">
              Related collections
            </h2>
            <ul className="mt-6 grid gap-3 text-sm md:grid-cols-2">
              {relatedCollections.map((collection) => (
                <li key={collection.slug}>
                  <Link
                    className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                    href={regionalCollectionRoute(collection.slug)}
                  >
                    {`${collection.title} (${getRegionTypeLabel(collection.regionType)})`}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {themedCollections.length > 0 ? (
          <section aria-labelledby="visual-themes-heading">
            <SectionHeading
              description={`Theme-first discovery collections that include ${city.name} — grouped by outdoor interest.`}
              title="Themed collections"
            />
            <h2 className="sr-only" id="visual-themes-heading">
              Themed collections
            </h2>
            <ul className="mt-6 grid gap-3 text-sm md:grid-cols-2">
              {themedCollections.map((collection) => (
                <li key={collection.slug}>
                  <Link
                    className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                    href={thematicCollectionRoute(collection.slug)}
                  >
                    {`${collection.title} (${getThemeLabel(collection.themeType)})`}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="visual-disclaimer-heading">
          <SectionHeading
            description="What this page is and is not. Read this before treating any image as evidence."
            title="Scope and limitations"
          />
          <h2 className="sr-only" id="visual-disclaimer-heading">
            Scope and limitations
          </h2>
          <div className="mt-6 rounded-2xl border border-neutral-border bg-surface-soft p-6">
            <p className="text-sm leading-7 text-text-primary">
              This page is a <strong>visual orientation guide</strong> for
              {" "}
              {city.name}
              {country ? `, ${country.name}` : ""}. Imagery comes from the
              existing verified media catalog with source, author, and license
              attribution. It is not a tourism guide, not an attractions
              ranking, not an official tourism page, and not evidence of
              current local conditions. The page does not publish neighborhood
              names, district boundaries, rent or sale prices, crime rates,
              school rankings, hospital proximities, transit operators,
              commute times, or any &ldquo;best&rdquo; / &ldquo;must-see&rdquo;
              / &ldquo;safest&rdquo; / &ldquo;cheapest&rdquo; claims. For
              time-sensitive details, confirm with the official local source.
            </p>
          </div>
        </section>

        <SourceBlock sources={sources} />
      </Container>
    </main>
  );
}
