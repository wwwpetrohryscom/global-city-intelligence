import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinkCard } from "@/components/cards/link-card";
import { MetricCard } from "@/components/cards/MetricCard";
import { RelatedComparisons } from "@/components/comparison/RelatedComparisons";
import { HealthcareAccessSection } from "@/components/healthcare/HealthcareAccessSection";
import { PublicSafetySection } from "@/components/safety/PublicSafetySection";
import { TransportMobilitySection } from "@/components/transport/TransportMobilitySection";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
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
  getCityBySlug,
  getCityHealthcareProfile,
  getCityMobilityProfile,
  getCitySafetyProfile,
  getCityIntentBySlug,
  getCollectionIntentLabel,
  getCollectionsForCity,
  getComparisonsForCity,
  getIntentPagesForCity,
  getCountryEmergencyProfile,
  getCountryHealthcareProfile,
  getCountryTransportProfile,
  getHospitalRegistryProfile,
  getVerifiedHospitalsForCity,
} from "@/lib/data/queries";
import { getSourcesByIds } from "@/lib/data/sources";
import { cityBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import {
  cityRoute,
  countryRoute,
  getCityIntentUrl,
  getCollectionUrl,
  moduleRoute,
  rankingRoute,
} from "@/lib/seo/routes";
import {
  airportSchema,
  breadcrumbSchema,
  datasetSchema,
  webpageSchema,
} from "@/lib/seo/schema";

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
  const cityAirports = getAirportsForCity(city.slug);
  const relatedComparisons = getComparisonsForCity(city.slug).slice(0, 4);
  const cityIntentPages = getIntentPagesForCity(city.slug);

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
          </div>
        </section>

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
