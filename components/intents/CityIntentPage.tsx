import Link from "next/link";
import { AirQualityProfileSection } from "@/components/data/AirQualityProfileSection";
import { PlaceHeroImage } from "@/components/media/PlaceHeroImage";
import { CityIntentCriteria } from "@/components/intents/CityIntentCriteria";
import {
  CityIntentOverviewCards,
  type IntentOverviewCard,
} from "@/components/intents/CityIntentOverviewCards";
import { CityIntentTable } from "@/components/intents/CityIntentTable";
import { RelatedIntentLinks } from "@/components/intents/RelatedIntentLinks";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { Card } from "@/components/ui/Card";
import { FactList } from "@/components/ui/fact-list";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getCityHealthcareProfile,
  getCollectionBySlug,
  getComparisonBySlug,
  getComparisonIntentLabel,
  getCountryEmergencyProfile,
  getCountryHealthcareProfile,
  hasVerifiedCityMobilityData,
  hasVerifiedEmergencyData,
  hasVerifiedHealthcareData,
} from "@/lib/data/queries";
import { getSourcesByIds } from "@/lib/data/sources";
import { cityIntentBreadcrumbs } from "@/lib/seo/breadcrumbs";
import {
  cityRoute,
  comparisonRoute,
  countryRoute,
  getCityIntentUrl,
  getCollectionUrl,
  staticRoutes,
} from "@/lib/seo/routes";
import {
  breadcrumbSchema,
  datasetSchema,
  webpageSchema,
} from "@/lib/seo/schema";
import type {
  City,
  CityIntent,
  CityIntentPage as CityIntentPageType,
  Country,
} from "@/types";

interface CityIntentPageProps {
  city: City;
  country?: Country;
  intent: CityIntent;
  intentPage: CityIntentPageType;
  otherIntentPagesForCity: CityIntentPageType[];
}

export function CityIntentPage({
  city,
  country,
  intent,
  intentPage,
  otherIntentPagesForCity,
}: CityIntentPageProps) {
  const sources = getSourcesByIds(intentPage.sourceIds);
  const breadcrumbs = cityIntentBreadcrumbs(city.slug, intent.slug);
  const path = getCityIntentUrl(city.slug, intent.slug);

  const verifiedEmergency = hasVerifiedEmergencyData(
    getCountryEmergencyProfile(city.countrySlug),
  );
  const healthcareProfile =
    getCityHealthcareProfile(city.slug) ??
    getCountryHealthcareProfile(city.countrySlug);
  const verifiedHealthcare = hasVerifiedHealthcareData(healthcareProfile);
  const verifiedCityTransport = hasVerifiedCityMobilityData(city.slug);

  const relatedCollections = (intentPage.relatedCollectionSlugs ?? [])
    .map((slug) => getCollectionBySlug(slug))
    .filter((collection): collection is NonNullable<typeof collection> =>
      Boolean(collection),
    );

  const relatedComparisons = (intentPage.relatedComparisonSlugs ?? [])
    .map((slug) => getComparisonBySlug(slug))
    .filter((comparison): comparison is NonNullable<typeof comparison> =>
      Boolean(comparison),
    );

  const title = `${city.name} for ${intent.shortTitle}: City Intelligence Guide`;
  const description = `Explore ${city.name} for ${intent.shortTitle.toLowerCase()} using structured city intelligence across cost context, safety, healthcare, transport, public services, and related comparisons.`;

  const overviewCards: IntentOverviewCard[] = [
    {
      label: "Intent",
      value: intent.shortTitle,
      description: intent.description,
    },
    {
      label: "City",
      value: city.name,
      description: country
        ? `Indexed city profile in ${country.name}.`
        : "Indexed city profile.",
    },
    {
      label: "Verified utility layers",
      value: String(
        [verifiedEmergency, verifiedHealthcare, verifiedCityTransport].filter(
          Boolean,
        ).length,
      ),
      description:
        "Emergency, healthcare, and city-level transport profiles that are verified for this city or country.",
    },
    {
      label: "Last updated",
      value: intentPage.updatedDate,
      description: `Data year: ${intentPage.dataYear}.`,
    },
  ];

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path,
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={datasetSchema({
          name: `${city.name} ${intent.shortTitle.toLowerCase()} city intelligence dataset`,
          description,
          path,
          dataYear: intentPage.dataYear,
          sources,
        })}
      />

      <PageHeader
        eyebrow={`City intent / ${intent.shortTitle}`}
        intro={intentPage.intro}
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
              {intentPage.updatedDate}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {intentPage.dataYear}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-14 py-12">
        <BreadcrumbNav items={breadcrumbs} />

        <section
          aria-label={`${city.name} visual context for ${intent.shortTitle.toLowerCase()}`}
          className="max-w-2xl"
        >
          <PlaceHeroImage
            placeName={`${city.name}${country ? `, ${country.name}` : ""}`}
            placeSlug={city.slug}
            placeType="city"
          />
        </section>

        <section aria-labelledby="intent-overview-heading">
          <SectionHeading
            description={`Snapshot for ${city.name} viewed through the ${intent.shortTitle.toLowerCase()} lens. Verified utility layers and source-backed references are summarized here.`}
            title={`${city.name} overview for ${intent.shortTitle.toLowerCase()}`}
          />
          <h2 className="sr-only" id="intent-overview-heading">
            {city.name} overview for {intent.shortTitle.toLowerCase()}
          </h2>
          <div className="mt-6">
            <CityIntentOverviewCards cards={overviewCards} />
          </div>
        </section>

        <FactList
          facts={[
            {
              label: "Page style",
              value: "Comparison-oriented guide (not a scored ranking)",
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
                verifiedEmergency || verifiedHealthcare || verifiedCityTransport
                  ? "At least one verified utility layer"
                  : "Structured indicators only; fallback for verified layers",
            },
          ]}
        />

        <section>
          <SectionHeading
            description="Each criterion explains why a category matters and points to the structured city intelligence behind the comparison."
            title="Selection criteria"
          />
          <div className="mt-6">
            <CityIntentCriteria
              criteria={intent.criteria}
              criteriaNotes={intentPage.criteriaNotes}
            />
          </div>
        </section>

        <section>
          <SectionHeading
            description="A real HTML comparison table connecting the intent to structured city intelligence. Each row links into the city profile, module pages, comparisons, or related collections."
            title="City intelligence table"
          />
          <div className="mt-6">
            <CityIntentTable
              caption={`${city.name} city intelligence table for ${intent.shortTitle.toLowerCase()}`}
              city={city}
              country={country}
              flags={{
                verifiedEmergency,
                verifiedHealthcare,
                verifiedTransport: verifiedCityTransport,
              }}
              intentPage={intentPage}
            />
          </div>
        </section>

        {intent.slug === "clean-air" ? (
          <AirQualityProfileSection
            city={city}
            fallbackCopy={`Source-attributed air-quality measurements for ${city.name} will appear in this clean-air intent guide once the platform integrates verified values from accepted official publishers. Until then, structured air-quality module context informs the comparison.`}
            contextLinks={[
              {
                label: "Browse the clean-air city collection",
                href: "/best-cities-for-clean-air",
              },
              {
                label: `Open the ${city.name} city profile`,
                href: cityRoute(city.slug),
              },
            ]}
          />
        ) : null}

        <section aria-labelledby="utility-layers-heading">
          <SectionHeading
            description="Which platform-side utility layers carry verified, source-attributed data for this city. Where verified data is unavailable, the platform shows transparent fallback states rather than fabricated numbers."
            title="Utility-layer availability"
          />
          <h2 className="sr-only" id="utility-layers-heading">
            Utility-layer availability for {city.name}
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            <li>
              <Card as="article" className="h-full">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Emergency
                </p>
                <p className="mt-2 text-base font-semibold text-text-primary">
                  {verifiedEmergency ? "Verified" : "Fallback"}
                </p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {verifiedEmergency
                    ? "Country emergency contacts attributed to official publishers."
                    : "Verified emergency data is not yet available; fallback context is shown."}
                </p>
              </Card>
            </li>
            <li>
              <Card as="article" className="h-full">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Healthcare
                </p>
                <p className="mt-2 text-base font-semibold text-text-primary">
                  {verifiedHealthcare ? "Verified" : "Fallback"}
                </p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {verifiedHealthcare
                    ? "Healthcare layer attributed to official health authorities."
                    : "Verified healthcare data is not yet available; fallback context is shown."}
                </p>
              </Card>
            </li>
            <li>
              <Card as="article" className="h-full">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Transport
                </p>
                <p className="mt-2 text-base font-semibold text-text-primary">
                  {verifiedCityTransport ? "Verified" : "Fallback"}
                </p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {verifiedCityTransport
                    ? "City-level transport authority and operator references attributed to official sources."
                    : "Verified city-level transport data is not yet available; country-level references may apply."}
                </p>
              </Card>
            </li>
          </ul>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Card as="article" className="p-6">
            <h2 className="text-2xl font-semibold text-text-primary">
              Practical interpretation and methodology note
            </h2>
            <p className="mt-4 leading-7 text-text-secondary">
              {intentPage.summary}
            </p>
            <p className="mt-4 leading-7 text-text-secondary">
              This guide is comparison-oriented, not an official ranking. Where
              verified city-level data is unavailable, the platform shows
              transparent fallback states. For critical decisions, always
              verify through the linked official sources.
            </p>
            <p className="mt-5 text-sm leading-6 text-text-secondary">
              See the{" "}
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.methodology}
              >
                scoring methodology
              </Link>{" "}
              and{" "}
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.dataSources}
              >
                data sources registry
              </Link>{" "}
              for the structured intelligence model.
            </p>
          </Card>
          <SourceBlock sources={sources} />
        </section>

        {relatedCollections.length > 0 ? (
          <section>
            <SectionHeading
              description="Curated Best Cities collections related to this intent."
              title="Related city collections"
            />
            <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relatedCollections.map((collection) => (
                <li key={collection.slug}>
                  <Card as="article" className="h-full" interactive>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Collection
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-text-primary">
                      <Link
                        className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                        href={getCollectionUrl(collection.slug)}
                      >
                        {collection.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                      {collection.description}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {relatedComparisons.length > 0 ? (
          <section>
            <SectionHeading
              description={`Curated city-vs-city comparisons that reference ${city.name}.`}
              title="Related city comparisons"
            />
            <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relatedComparisons.map((comparison) => (
                <li key={comparison.slug}>
                  <Card as="article" className="h-full" interactive>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      {getComparisonIntentLabel(comparison.comparisonIntent)}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-text-primary">
                      <Link
                        className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                        href={comparisonRoute(comparison.slug)}
                      >
                        {comparison.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                      {comparison.description}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {otherIntentPagesForCity.length > 0 ? (
          <section>
            <SectionHeading
              description={`Other intent guides available for ${city.name}.`}
              title={`More ${city.name} intent guides`}
            />
            <div className="mt-6">
              <RelatedIntentLinks
                cityName={city.name}
                intentPages={otherIntentPagesForCity}
              />
            </div>
          </section>
        ) : null}

        <section>
          <SectionHeading
            description="Continue from this guide into broader navigation paths."
            title="Where to go next"
          />
          <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <NextLinkCard
              description={`Open the full ${city.name} city profile with modules and rankings.`}
              href={cityRoute(city.slug)}
              title={`${city.name} city profile`}
            />
            {country ? (
              <NextLinkCard
                description={`Open the ${country.name} country intelligence hub.`}
                href={countryRoute(country.slug)}
                title={`${country.name} country hub`}
              />
            ) : null}
            <NextLinkCard
              description="Browse every indexed city profile."
              href={staticRoutes.cities}
              title="Cities directory"
            />
            <NextLinkCard
              description="Browse curated city collections."
              href={staticRoutes.collections}
              title="Best Cities collections"
            />
            <NextLinkCard
              description="Open curated city-vs-city comparison pages."
              href={staticRoutes.compare}
              title="City comparison directory"
            />
            <NextLinkCard
              description="See structured rankings across city intelligence categories."
              href={staticRoutes.rankings}
              title="City intelligence rankings"
            />
            <NextLinkCard
              description="Read how indicators are constructed and interpreted."
              href={staticRoutes.methodology}
              title="Scoring methodology"
            />
            <NextLinkCard
              description="See the official sources behind verified utility layers."
              href={staticRoutes.dataSources}
              title="Data sources registry"
            />
          </ul>
        </section>
      </Container>
    </main>
  );
}

function NextLinkCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <li>
      <Card as="article" interactive>
        <h3 className="text-base font-semibold text-text-primary">
          <Link
            className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
            href={href}
          >
            {title}
          </Link>
        </h3>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          {description}
        </p>
      </Card>
    </li>
  );
}

