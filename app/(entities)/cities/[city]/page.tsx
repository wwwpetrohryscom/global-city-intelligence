import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinkCard } from "@/components/cards/link-card";
import { MetricCard } from "@/components/cards/MetricCard";
import { PlaceHeroImage } from "@/components/media/PlaceHeroImage";
import { PlaceSecondaryImages } from "@/components/media/PlaceSecondaryImages";
import { RelatedComparisons } from "@/components/comparison/RelatedComparisons";
import { AirQualityProfileSection } from "@/components/data/AirQualityProfileSection";
import { HealthcareAccessSection } from "@/components/healthcare/HealthcareAccessSection";
import { PublicSafetySection } from "@/components/safety/PublicSafetySection";
import { TransportMobilitySection } from "@/components/transport/TransportMobilitySection";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { AiOverviewSection } from "@/components/seo/ai-overview-section";
import { FaqSection } from "@/components/seo/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { DataTable } from "@/components/tables/DataTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScoreBar } from "@/components/ui/score-bar";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  generateCityExplanation,
  generateCityIntro,
} from "@/lib/content/generators";
import { internalLink } from "@/lib/content/links";
import { demoDataNotice } from "@/lib/content/quality";
import {
  getAirportsForCity,
  getAllCities,
  getAllModules,
  getAllRankings,
  getCityAiOverview,
  getCityBySlug,
  getCityFaq,
  getCityHealthcareProfile,
  getCityMobilityProfile,
  getCitySafetyProfile,
  getCityIntentBySlug,
  getCityRelationshipLabel,
  getCollectionIntentLabel,
  getCollectionsForCity,
  getRegionalCollectionsForCity,
  getRegionTypeLabel,
  getThematicCollectionsForCity,
  getThemeLabel,
  getRelatedCities,
  getComparisonsForCity,
  getIntentPagesForCity,
  getCountryEmergencyProfile,
  getCountryHealthcareProfile,
  getCountryTransportProfile,
  getHospitalRegistryProfile,
  getVerifiedHospitalsForCity,
  hasArrivalPage,
  hasMovingToCityPage,
  hasNearbyWeekendPlacesCityPage,
  hasNeighborhoodPlanningPage,
  hasSummerTravelPage,
  hasVisualCityGuidePage,
  hasWeekendTripPage,
} from "@/lib/data/queries";
import { getClimate, hasClimate } from "@/lib/data/climate";
import { getCityQuality } from "@/lib/data/city-quality";
import { getEconomy, hasEconomy } from "@/lib/data/economy";
import { getEducation, getUniversitiesForCity, hasEducation } from "@/lib/data/education";
import { getHealthcare, getRetirement, hasHealthcare } from "@/lib/data/healthcare-retirement";
import type { EconomyCategory } from "@/types/economy";
import type { EducationCategory } from "@/types/education";
import type { HealthcareCategory } from "@/types/healthcare";
import { getSourcesByIds } from "@/lib/data/sources";
import { cityBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { hasCostOfLiving } from "@/lib/data/cost-of-living";
import { createMetadata, ogImageFromPlaceImage } from "@/lib/seo/metadata";
import { getCityHeroImage } from "@/lib/data/media/queries";
import {
  arrivalRoute,
  cityRoute,
  countryRoute,
  getCityIntentUrl,
  getCollectionUrl,
  moduleRoute,
  regionalCollectionRoute,
  thematicCollectionRoute,
  movingToCityRoute,
  nearbyWeekendPlacesCityRoute,
  neighborhoodPlanningRoute,
  rankingRoute,
  staticRoutes,
  summerTravelRoute,
  visualCityGuideRoute,
  costOfLivingRoute,
  climateRoute,
  economyRoute,
  educationRoute,
  healthcareRoute,
  weekendTripRoute,
} from "@/lib/seo/routes";
import {
  airportSchema,
  breadcrumbSchema,
  datasetSchema,
  webpageSchema,
} from "@/lib/seo/schema";

const CITY_ECONOMY_LABEL: Record<EconomyCategory, string> = {
  global_hub: "global hub",
  major_economy: "major economy",
  regional_center: "regional center",
  industrial_city: "industrial city",
  tourism_economy: "tourism economy",
  government_center: "government center",
  education_research: "education & research center",
  mixed: "mixed economy",
};

const CITY_EDUCATION_LABEL: Record<EducationCategory, string> = {
  global_academic_hub: "global academic hub",
  major_university_city: "major university city",
  research_center: "research center",
  student_city: "student city",
  regional_education_center: "regional education center",
  mixed: "mixed education base",
};

const CITY_HEALTHCARE_LABEL: Record<HealthcareCategory, string> = {
  global_medical_hub: "global medical hub",
  major_healthcare_center: "major healthcare center",
  regional_healthcare_center: "regional healthcare center",
  healthcare_access_city: "healthcare access city",
  developing_healthcare_market: "developing healthcare market",
  mixed: "mixed healthcare profile",
};

type PageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return getAllCities().map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    return {};
  }

  return createMetadata({
    title: `${city.name} City Intelligence: Scores, Data and Rankings`,
    description: `${city.name} city intelligence profile with affordability, air quality, energy, resilience, sources, tables, and rankings.`,
    path: cityRoute(city.slug),
    type: "article",
    image: ogImageFromPlaceImage(getCityHeroImage(city.slug)),
  });
}

export default async function CityPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const title = `${city.name} City Intelligence`;
  const description = `${city.intro} Compare affordability, air quality, energy readiness, resilience, sources, and rankings.`;
  const breadcrumbs = cityBreadcrumbs(city.slug);
  const sources = getSourcesByIds(city.sources);
  const rankings = getAllRankings().slice(0, 3);
  const modules = getAllModules();
  const introCopy = generateCityIntro(city);
  const explanationCopy = generateCityExplanation(city, modules);
  const rankingsLink = internalLink.cityInRankings(city);
  const methodologyLink = internalLink.methodology();
  const countryEmergencyProfile = getCountryEmergencyProfile(city.countrySlug);
  const citySafetyProfile = getCitySafetyProfile(city.slug);
  const countryHealthcareProfile = getCountryHealthcareProfile(city.countrySlug);
  const cityHealthcareProfile = getCityHealthcareProfile(city.slug);
  const cityHospitalRegistry = getHospitalRegistryProfile(
    city.countrySlug,
    city.slug,
  );
  const cityVerifiedHospitals = getVerifiedHospitalsForCity(city.slug);
  const countryTransportProfile = getCountryTransportProfile(city.countrySlug);
  const cityCollections = getCollectionsForCity(city.slug);
  const cityMobilityProfile = getCityMobilityProfile(city.slug);
  const cityQuality = getCityQuality(city.slug);
  const cityAirports = getAirportsForCity(city.slug);
  const relatedComparisons = getComparisonsForCity(city.slug).slice(0, 4);
  const cityIntentPages = getIntentPagesForCity(city.slug);
  const relatedCities = getRelatedCities(city.slug)
    .map((related) => {
      const target = getCityBySlug(related.citySlug);
      return target ? { ...related, city: target } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  const relatedCollections = getRegionalCollectionsForCity(city.slug).slice(0, 6);
  const themedCollections = getThematicCollectionsForCity(city.slug).slice(0, 6);
  const cityAiOverview = getCityAiOverview(city.slug);
  const cityFaq = getCityFaq(city.slug);

  return (
    <main>
      <JsonLd data={webpageSchema({ path: cityRoute(city.slug), title, description })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={datasetSchema({
          name: `${city.name} city intelligence dataset`,
          description,
          path: cityRoute(city.slug),
          dataYear: city.dataYear,
          sources,
        })}
      />
      {cityAirports.map((airport) => (
        <JsonLd
          data={airportSchema({
            airport,
            cityName: city.name,
            countryName: city.countryName,
          })}
          key={airport.id}
        />
      ))}
      <PageHeader eyebrow={`${city.countryName} / ${city.region}`} intro={introCopy} title={title}>
        <dl className="grid gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Last updated
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {city.lastUpdated}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {city.dataYear}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Population
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {city.population}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbNav items={breadcrumbs} />

        <section aria-label={`${city.name} visual context`}>
          <PlaceHeroImage
            placeName={`${city.name}, ${city.countryName}`}
            placeSlug={city.slug}
            placeType="city"
            priority
          />
        </section>

        <PlaceSecondaryImages
          headingId="city-visual-context-heading"
          placeName={`${city.name}, ${city.countryName}`}
          placeSlug={city.slug}
          placeType="city"
        />

        <section className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
          <article className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-text-primary">
              Overall score
            </h2>
            <p className="mt-4 leading-7 text-text-secondary">{city.outlook}</p>
            <div className="mt-6 space-y-4">
              <ScoreBar label="Overall" value={city.scores.overall} />
              <ScoreBar label="Affordability" value={city.scores.affordability} />
              <ScoreBar label="Air quality" value={city.scores.airQuality} />
              <ScoreBar label="Energy" value={city.scores.energy} />
            </div>
          </article>
          <div className="grid gap-5 md:grid-cols-3">
            {city.metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            description="The table is part of the initial server-rendered HTML and mirrors the key city score cards."
            title={`${city.name} data table`}
          />
          <div className="mt-6">
            <DataTable
              caption={`${city.name} city intelligence data table`}
              rows={[
                {
                  metric: "Overall score",
                  value: `${city.scores.overall}/100`,
                  context: "Composite score across major city intelligence modules.",
                },
                ...modules.map((moduleItem) => ({
                  metric: moduleItem.name,
                  value: `${city.modules[moduleItem.slug].score}/100`,
                  context: city.modules[moduleItem.slug].summary,
                })),
                {
                  metric: "Resilience",
                  value: `${city.scores.resilience}/100`,
                  context: "Climate adaptation and infrastructure continuity context.",
                },
              ]}
            />
          </div>
        </section>

        {cityQuality ? (
          <>
            <section aria-labelledby="safety-scores-heading">
              <SectionHeading
                description="Deterministic safety estimates from our index — planning signals derived from country priors and city data, not official crime statistics."
                title="Safety"
              />
              <h2 className="sr-only" id="safety-scores-heading">
                Safety
              </h2>
              <article className="mt-6 rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <ScoreBar label="Overall safety" value={cityQuality.safety.overallSafetyScore} />
                  <ScoreBar label="Low crime" value={cityQuality.safety.crimeScore} />
                  <ScoreBar label="Personal safety" value={cityQuality.safety.personalSafetyScore} />
                  <ScoreBar label="Night safety" value={cityQuality.safety.nightSafetyScore} />
                  <ScoreBar label="Road safety" value={cityQuality.safety.roadSafetyScore} />
                </div>
                <p className="mt-5 text-sm leading-6 text-text-secondary">
                  {cityQuality.safetySummary}
                </p>
              </article>
            </section>

            <section aria-labelledby="quality-of-life-heading">
              <SectionHeading
                description="A composite quality-of-life estimate and its component indicators."
                title="Quality of Life"
              />
              <h2 className="sr-only" id="quality-of-life-heading">
                Quality of Life
              </h2>
              <article className="mt-6 rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <ScoreBar label="Quality of life" value={cityQuality.quality.qualityOfLifeScore} />
                  <ScoreBar label="Healthcare" value={cityQuality.quality.healthcareScore} />
                  <ScoreBar label="Education" value={cityQuality.quality.educationScore} />
                  <ScoreBar label="Green space" value={cityQuality.quality.greenSpaceScore} />
                  <ScoreBar label="Cleanliness" value={cityQuality.quality.cleanlinessScore} />
                  <ScoreBar label="Infrastructure" value={cityQuality.quality.infrastructureScore} />
                  <ScoreBar label="Mobility" value={cityQuality.quality.mobilityScore} />
                </div>
                <p className="mt-5 text-sm leading-6 text-text-secondary">
                  {cityQuality.qualitySummary}
                </p>
              </article>
            </section>

            <section aria-labelledby="family-friendliness-heading">
              <SectionHeading
                description="How the city scores for raising a family, with the indicators that drive it."
                title="Family Friendliness"
              />
              <h2 className="sr-only" id="family-friendliness-heading">
                Family Friendliness
              </h2>
              <article className="mt-6 rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <ScoreBar label="Family friendliness" value={cityQuality.lifestyle.familyFriendlyScore} />
                  <ScoreBar label="Education" value={cityQuality.quality.educationScore} />
                  <ScoreBar label="Green space" value={cityQuality.quality.greenSpaceScore} />
                  <ScoreBar label="Overall safety" value={cityQuality.safety.overallSafetyScore} />
                </div>
                <p className="mt-5 text-sm leading-6 text-text-secondary">
                  {cityQuality.familySummary}
                </p>
              </article>
            </section>

            <section aria-labelledby="digital-nomad-heading">
              <SectionHeading
                description="Suitability for remote workers, based on connectivity, mobility, and livability."
                title="Digital Nomad Suitability"
              />
              <h2 className="sr-only" id="digital-nomad-heading">
                Digital Nomad Suitability
              </h2>
              <article className="mt-6 rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <ScoreBar label="Digital nomad suitability" value={cityQuality.lifestyle.digitalNomadScore} />
                  <ScoreBar label="Walkability" value={cityQuality.lifestyle.walkabilityScore} />
                  <ScoreBar label="Cycling" value={cityQuality.lifestyle.cyclingScore} />
                  <ScoreBar label="Infrastructure" value={cityQuality.quality.infrastructureScore} />
                </div>
                <p className="mt-5 text-sm leading-6 text-text-secondary">
                  {cityQuality.nomadSummary}
                </p>
              </article>
            </section>

            <section aria-labelledby="retirement-heading">
              <SectionHeading
                description="Suitability for retirement, weighing healthcare, affordability, climate, and environment."
                title="Retirement Suitability"
              />
              <h2 className="sr-only" id="retirement-heading">
                Retirement Suitability
              </h2>
              <article className="mt-6 rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <ScoreBar label="Retirement suitability" value={cityQuality.lifestyle.retirementScore} />
                  <ScoreBar label="Healthcare" value={cityQuality.quality.healthcareScore} />
                  <ScoreBar label="Cleanliness" value={cityQuality.quality.cleanlinessScore} />
                  <ScoreBar label="Outdoor lifestyle" value={cityQuality.lifestyle.outdoorLifestyleScore} />
                </div>
                <p className="mt-5 text-sm leading-6 text-text-secondary">
                  {cityQuality.retirementSummary}
                </p>
              </article>
            </section>
          </>
        ) : null}

        <PublicSafetySection
          cityName={city.name}
          cityProfile={citySafetyProfile}
          countryHref={countryRoute(city.countrySlug)}
          countryName={city.countryName}
          countryProfile={countryEmergencyProfile}
          variant="city"
        />

        <HealthcareAccessSection
          cityName={city.name}
          cityProfile={cityHealthcareProfile}
          countryHref={countryRoute(city.countrySlug)}
          countryName={city.countryName}
          countryProfile={countryHealthcareProfile}
          emergencySectionHref="#emergency-public-safety-heading"
          hospitalRegistry={cityHospitalRegistry}
          variant="city"
          verifiedHospitals={cityVerifiedHospitals}
        />

        <TransportMobilitySection
          cityAirports={cityAirports}
          cityName={city.name}
          cityProfile={cityMobilityProfile}
          countryHref={countryRoute(city.countrySlug)}
          countryName={city.countryName}
          countryProfile={countryTransportProfile}
          emergencySectionHref="#emergency-public-safety-heading"
          healthcareSectionHref="#healthcare-access-heading"
          variant="city"
        />

        <AirQualityProfileSection
          city={city}
          contextLinks={[
            {
              label: `Open the ${city.name} air-quality module`,
              href: moduleRoute("air-quality", city.slug),
            },
            {
              label: "Browse the clean-air city collection",
              href: "/best-cities-for-clean-air",
            },
          ]}
        />

        {cityAiOverview ? (
          <AiOverviewSection
            cityName={city.name}
            items={cityAiOverview.items}
            path={cityRoute(city.slug)}
          />
        ) : null}

        {relatedComparisons.length > 0 ? (
          <RelatedComparisons comparisons={relatedComparisons} />
        ) : null}

        {cityCollections.length > 0 ? (
          <section>
            <SectionHeading
              description={`Curated city collections that include ${city.name}. Each is a comparison-oriented shortlist, not an official ranking.`}
              title={`${city.name} in city collections`}
            />
            <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {cityCollections.map((collection) => (
                <li key={collection.slug}>
                  <LinkCard
                    description={`${getCollectionIntentLabel(collection.intent)} — ${collection.description}`}
                    href={getCollectionUrl(collection.slug)}
                    title={collection.title}
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {cityIntentPages.length > 0 ? (
          <section>
            <SectionHeading
              description={`Practical intent-focused guides available for ${city.name}. Each guide is a comparison-oriented view, not an official ranking.`}
              title={`${city.name} intent guides`}
            />
            <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {cityIntentPages.map((page) => {
                const intent = getCityIntentBySlug(page.intentSlug);
                if (!intent) {
                  return null;
                }
                return (
                  <li key={`${page.citySlug}-${page.intentSlug}`}>
                    <LinkCard
                      description={page.summary}
                      href={getCityIntentUrl(page.citySlug, page.intentSlug)}
                      title={`${city.name} for ${intent.shortTitle}`}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <section>
          <SectionHeading
            description="City pages link to module and ranking pages so crawlers can move through the topic cluster naturally."
            title={`Explore ${city.name} modules`}
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((moduleItem) => (
              <LinkCard
                description={city.modules[moduleItem.slug].summary}
                href={moduleRoute(moduleItem.slug, city.slug)}
                key={moduleItem.slug}
                title={`${moduleItem.name} in ${city.name}`}
              />
            ))}
            <LinkCard
              description="Compare this city against other indexed cities in crawlable ranking tables."
              href={rankingRoute("overall-city-intelligence")}
              title="City rankings"
            />
            {hasCostOfLiving(city.slug) ? (
              <LinkCard
                description={`Cost of living estimates for ${city.name} — monthly budgets, rent, food, and transport in the local currency, plus an affordability score for comparison. Planning estimates derived from country baselines, not live prices.`}
                href={costOfLivingRoute(city.slug)}
                title={`Cost of living in ${city.name}`}
              />
            ) : null}
            {hasClimate(city.slug)
              ? (() => {
                  const climate = getClimate(city.slug)!;
                  return (
                    <LinkCard
                      description={`Climate profile for ${city.name} — ${climate.climateZone} climate, annual average ${climate.annualAvgTempC}°C, comfort score ${climate.comfortScore}/100. Month-by-month temperatures, rainfall, sunshine, and the best months to visit. Deterministic planning estimates, not a forecast.`}
                      href={climateRoute(city.slug)}
                      title={`Climate in ${city.name}`}
                    />
                  );
                })()
              : null}
            {hasEconomy(city.slug)
              ? (() => {
                  const economy = getEconomy(city.slug)!;
                  return (
                    <LinkCard
                      description={`Economy and jobs profile for ${city.name} — ${CITY_ECONOMY_LABEL[economy.economyCategory]}, economy score ${economy.economyScore}/100, key industries including ${economy.dominantIndustries.slice(0, 3).join(", ").toLowerCase()}. Employment, salary, startup, remote-work, and career indicators. Deterministic planning estimates.`}
                      href={economyRoute(city.slug)}
                      title={`Economy and jobs in ${city.name}`}
                    />
                  );
                })()
              : null}
            {hasEducation(city.slug)
              ? (() => {
                  const education = getEducation(city.slug)!;
                  const uniCount = getUniversitiesForCity(city.slug).length;
                  return (
                    <LinkCard
                      description={`Education profile for ${city.name} — ${CITY_EDUCATION_LABEL[education.educationCategory]}, education score ${education.educationScore}/100, ${uniCount} representative universities, plus research, student life, and international-student indicators. Deterministic dataset, not institutional rankings.`}
                      href={educationRoute(city.slug)}
                      title={`Universities and education in ${city.name}`}
                    />
                  );
                })()
              : null}
            {hasHealthcare(city.slug)
              ? (() => {
                  const healthcare = getHealthcare(city.slug)!;
                  const retirement = getRetirement(city.slug);
                  return (
                    <LinkCard
                      description={`Healthcare and retirement profile for ${city.name} — ${CITY_HEALTHCARE_LABEL[healthcare.healthcareCategory]}, healthcare score ${healthcare.healthcareScore}/100${retirement ? `, retirement score ${retirement.retirementScore}/100` : ""}. Medical access, specialist and emergency care, affordability, and retirement suitability. Deterministic planning estimates.`}
                      href={healthcareRoute(city.slug)}
                      title={`Healthcare and retirement in ${city.name}`}
                    />
                  );
                })()
              : null}
            {hasArrivalPage(city.slug) ? (
              <LinkCard
                description={`Practical arrival planning context for ${city.name} — links into transport, public-safety, healthcare, budgeting tools, and methodology. Not an official airport or travel instruction service.`}
                href={arrivalRoute(city.slug)}
                title={`Arrival planning guide for ${city.name}`}
              />
            ) : null}
            {hasNeighborhoodPlanningPage(city.slug) ? (
              <LinkCard
                description={`Structured neighborhood research checklist for ${city.name} — links into transport, public-safety, healthcare, arrival planning, and budgeting tools. Not a real-estate, rental, or safety-ranking service.`}
                href={neighborhoodPlanningRoute(city.slug)}
                title={`Neighborhood planning guide for ${city.name}`}
              />
            ) : null}
            {hasMovingToCityPage(city.slug) ? (
              <LinkCard
                description={`Structured relocation research checklist for ${city.name} — links into country context, arrival planning, neighborhood research, cost tools, healthcare, public safety, and transport. Not immigration, visa, tax, legal, financial, medical, or property advice.`}
                href={movingToCityRoute(city.slug)}
                title={`Moving to ${city.name} planning guide`}
              />
            ) : null}
            {hasVisualCityGuidePage(city.slug) ? (
              <LinkCard
                description={`Source-attributed visual context for ${city.name} using verified Wikimedia imagery from the existing media catalog, alongside structured city intelligence and planning links. Not a tourism guide or attractions ranking.`}
                href={visualCityGuideRoute(city.slug)}
                title={`Visual guide to ${city.name}`}
              />
            ) : null}
            {hasSummerTravelPage(city.slug) ? (
              <LinkCard
                description={`Summer 2026 travel planning checklist for ${city.name} — links into arrival planning, visual orientation, budget tools, transport, public safety, and healthcare context. Not a weather forecast, events calendar, hotel-price guide, or tourism ranking.`}
                href={summerTravelRoute(city.slug)}
                title={`Summer 2026 travel planning guide for ${city.name}`}
              />
            ) : null}
            {hasWeekendTripPage(city.slug) ? (
              <LinkCard
                description={`Weekend trip planning checklist for ${city.name} — links into arrival planning, Summer 2026 travel context, visual orientation, budget tools, transport, public safety, and healthcare context. Not an itinerary, events calendar, hotel-price guide, restaurant guide, or tourism ranking.`}
                href={weekendTripRoute(city.slug)}
                title={`Weekend trip planning guide for ${city.name}`}
              />
            ) : null}
            {hasNearbyWeekendPlacesCityPage(city.slug) ? (
              <LinkCard
                description="Source-backed nearby place records for local-first weekend planning, with verification status, official source links, Wikidata identity, and visual context."
                href={nearbyWeekendPlacesCityRoute(city.slug)}
                title={`Nearby weekend places from ${city.name}`}
              />
            ) : null}
            <LinkCard
              description={`Estimate a monthly budget for ${city.name} using your own housing, food, transport, healthcare, and lifestyle inputs. Planning estimator only — not an official cost-of-living measurement.`}
              href={staticRoutes.costOfLivingCalculator}
              title={`Estimate a monthly budget for ${city.name}`}
            />
            <LinkCard
              description={`Plan a trip budget for ${city.name} using your own accommodation, food, local transport, activities, travel, healthcare buffer, and emergency buffer inputs. Planning estimator only — not an official travel cost estimate.`}
              href={staticRoutes.travelBudgetCalculator}
              title={`Plan a trip budget for ${city.name}`}
            />
          </div>
        </section>

        {relatedCities.length > 0 ? (
          <section>
            <SectionHeading
              description={`Where else nearby you could spend a day or a weekend from ${city.name}. Links are derived from geographic proximity, shared region, shared natural-recreation areas, transport corridors, and country borders — not popularity or tourism rankings.`}
              title={`Nearby cities from ${city.name}`}
            />
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedCities.map((related) => (
                <LinkCard
                  description={`${getCityRelationshipLabel(related.relationshipType)} · about ${related.distanceKm} km from ${city.name}. Explore ${related.city.name}'s city intelligence profile.`}
                  href={cityRoute(related.city.slug)}
                  key={related.citySlug}
                  title={`${related.city.name}, ${related.city.countryName}`}
                />
              ))}
            </div>
          </section>
        ) : null}

        {relatedCollections.length > 0 ? (
          <section>
            <SectionHeading
              description={`Regional discovery collections that include ${city.name} — named natural regions grouping nearby nature, parks, lakes, coasts, and mountains for local-first day and weekend planning.`}
              title={`Related collections`}
            />
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedCollections.map((collection) => (
                <LinkCard
                  description={`${getRegionTypeLabel(collection.regionType)} · ${collection.nearbyPlaces.length} places across ${collection.cities.length} cities.`}
                  href={regionalCollectionRoute(collection.slug)}
                  key={collection.slug}
                  title={collection.title}
                />
              ))}
            </div>
          </section>
        ) : null}

        {themedCollections.length > 0 ? (
          <section>
            <SectionHeading
              description={`Theme-first discovery collections that include ${city.name} — grouped by outdoor interest (mountains, lakes, coasts, forests, national parks) rather than geography.`}
              title={`Themed collections`}
            />
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {themedCollections.map((collection) => (
                <LinkCard
                  description={`${getThemeLabel(collection.themeType)} · ${collection.nearbyPlaces.length} places across ${collection.cities.length} cities.`}
                  href={thematicCollectionRoute(collection.slug)}
                  key={collection.slug}
                  title={collection.title}
                />
              ))}
            </div>
          </section>
        ) : null}

        {cityFaq ? (
          <FaqSection
            cityName={city.name}
            items={cityFaq.items}
            path={cityRoute(city.slug)}
          />
        ) : null}

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-text-primary">
              Interpretation
            </h2>
            <p className="mt-4 leading-7 text-text-secondary">{explanationCopy}</p>
            <p className="mt-4 leading-7 text-text-secondary">
              Country context is available on the{" "}
              <a className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50" href={countryRoute(city.countrySlug)}>
                {city.countryName} country page
              </a>
              . Related rankings include{" "}
              {rankings.map((ranking, index) => (
                <span key={ranking.slug}>
                  <a className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50" href={rankingRoute(ranking.slug)}>
                    {ranking.shortTitle}
                  </a>
                  {index < rankings.length - 1 ? ", " : "."}
                </span>
              ))}{" "}
              <a className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50" href={rankingsLink.href}>
                {rankingsLink.text}
              </a>{" "}or{" "}
              <a className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50" href={methodologyLink.href}>
                {methodologyLink.text.toLowerCase()}
              </a>.
            </p>
            <p className="mt-4 text-xs leading-6 text-text-secondary">
              {demoDataNotice()}
            </p>
          </article>
          <SourceBlock sources={sources} />
        </section>
      </div>
    </main>
  );
}
