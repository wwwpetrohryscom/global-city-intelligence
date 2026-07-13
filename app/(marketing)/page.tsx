import type { Metadata } from "next";
import Link from "next/link";
import { CityCard } from "@/components/cards/CityCard";
import { LinkCard } from "@/components/cards/link-card";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ImageAttribution } from "@/components/media/ImageAttribution";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { DataTable } from "@/components/tables/DataTable";
import { HubNav } from "@/components/navigation/HubNav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllCities,
  getAllCollections,
  getAllCountries,
  getAllModules,
  getAllRankings,
  getCollectionIntentLabel,
} from "@/lib/data/queries";
import { getCityHeroImage } from "@/lib/data/media/queries";
import { dataSources, getSourcesByIds } from "@/lib/data/sources";
import { createMetadata } from "@/lib/seo/metadata";
import {
  cityRoute,
  getCollectionUrl,
  moduleRoute,
  rankingRoute,
  staticRoutes,
} from "@/lib/seo/routes";
import { datasetSchema, webpageSchema } from "@/lib/seo/schema";
import type { City, PlaceImage } from "@/types";

const title = "Global City Intelligence Platform";
const description =
  "Server-rendered city and country intelligence covering affordability, air quality, energy readiness, resilience, public safety, healthcare, and global rankings — attributed to official data sources.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.home,
});

export default function HomePage() {
  const cities = getAllCities();
  const countries = getAllCountries();
  const rankings = getAllRankings();
  const modules = getAllModules();
  const collections = getAllCollections();
  const heroCity = cities.find((city) => city.slug === "new-york") ?? cities[0];
  const heroImage = heroCity ? getCityHeroImage(heroCity.slug) : undefined;
  const sources = getSourcesByIds([
    "un-habitat",
    "who-air",
    "nasa-power",
    "ipcc-urban",
  ]);

  return (
    <main>
      <JsonLd data={webpageSchema({ path: staticRoutes.home, title, description })} />
      <JsonLd
        data={datasetSchema({
          name: "Global city intelligence overview dataset",
          description,
          path: staticRoutes.home,
          dataYear: DATA_YEAR,
          sources,
        })}
      />
      <HomeHero
        citiesCount={cities.length}
        collectionsCount={collections.length}
        countriesCount={countries.length}
        heroCity={heroCity}
        heroImage={heroImage}
        modulesCount={modules.length}
        rankingsCount={rankings.length}
        sourceCount={dataSources.length}
      />

      <Section className="bg-white" containerClassName="space-y-12">
        <HubNav activeHref={staticRoutes.home} />

        <section>
          <SectionHeading
            description="A featured selection of city profiles. Browse the complete, crawlable index of every indexed city in the cities directory."
            title="Explore city profiles"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {cities.slice(0, 12).map((city) => (
              <CityCard city={city} key={city.slug} />
            ))}
          </div>
          <p className="mt-6 text-sm">
            <Link
              className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
              href={staticRoutes.cities}
            >
              Browse all {cities.length} indexed cities →
            </Link>
          </p>
        </section>

        <section>
          <SectionHeading
            description="A compact table of leading city profiles so search engines and users can compare core scores without waiting for client-side JavaScript. The full directory is grouped by country in the cities index."
            title="City intelligence table"
          />
          <div className="mt-6">
            <DataTable
              caption="City intelligence overview table (selected cities)"
              rows={cities.slice(0, 50).map((city) => ({
                metric: city.name,
                value: `${city.scores.overall}/100`,
                context: `${city.countryName}; affordability ${city.scores.affordability}/100, air quality ${city.scores.airQuality}/100, energy ${city.scores.energy}/100.`,
              }))}
            />
          </div>
        </section>

        <section>
          <SectionHeading
            description="Curated city collections offer comparison-oriented shortlists by intent — for remote work, families, startups, clean air, and public transport. None of these are scored rankings."
            title="Best Cities collections"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection) => (
              <LinkCard
                description={`${getCollectionIntentLabel(collection.intent)} — ${collection.description}`}
                href={getCollectionUrl(collection.slug)}
                key={collection.slug}
                title={collection.title}
              />
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-text-secondary">
            <Link
              className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
              href={staticRoutes.collections}
            >
              Browse all city collections
            </Link>
            .
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <Card as="article" className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
              Planning tool
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-text-primary">
              Cost of Living Comparison Calculator
            </h2>
            <p className="mt-3 leading-7 text-text-secondary">
              Estimate your own monthly budget between two cities. Use your own
              housing, food, transport, healthcare, and lifestyle inputs, then
              continue to city profiles and structured comparisons.
            </p>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Planning estimator based on your inputs, not an official
              cost-of-living measurement.
            </p>
            <Link
              className="mt-4 inline-flex font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
              href={staticRoutes.costOfLivingCalculator}
            >
              Open the cost of living calculator
            </Link>
          </Card>
          <Card as="article" className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
              Planning tool
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-text-primary">
              Travel Budget Calculator
            </h2>
            <p className="mt-3 leading-7 text-text-secondary">
              Plan a trip budget with your own inputs. Estimate accommodation,
              food, local transport, activities, travel, healthcare buffer, and
              emergency buffer, then use city profiles for safety, healthcare,
              and transport context.
            </p>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Planning estimator based on your inputs, not an official travel
              cost estimate.
            </p>
            <Link
              className="mt-4 inline-flex font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
              href={staticRoutes.travelBudgetCalculator}
            >
              Open the travel budget calculator
            </Link>
          </Card>
          <Card as="article" className="p-6">
            <h2 className="text-2xl font-semibold text-text-primary">
              Pair the calculators with city intelligence
            </h2>
            <p className="mt-3 leading-7 text-text-secondary">
              After estimating a budget, open a city profile to read structured
              indicators across affordability, air quality, energy, healthcare,
              and transport, or compare two cities through curated comparison
              pages.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.cities}
              >
                Browse cities
              </Link>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.compare}
              >
                Open comparisons
              </Link>
            </div>
          </Card>
        </section>

        <section>
          <SectionHeading
            description="Rankings are built from the same typed data layer used by city and module pages, so new cities can scale into every crawl path."
            title="Rankings and modules"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {rankings.map((ranking) => (
              <LinkCard
                description={ranking.description}
                href={rankingRoute(ranking.slug)}
                key={ranking.slug}
                title={ranking.title}
              />
            ))}
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((moduleItem) => {
              const sampleCity = cities[0];
              return (
                <LinkCard
                  description={moduleItem.description}
                  href={`/${moduleItem.pathSegment}/${sampleCity.slug}`}
                  key={moduleItem.slug}
                  title={`${moduleItem.name} module`}
                />
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-text-primary">
              How to read the platform
            </h2>
            <p className="mt-4 leading-7 text-text-secondary">
              Global City Intelligence is organized as topic, subtopic, and
              article paths. City pages summarize the whole profile. Module
              pages go deeper into a single topic. Country pages add national
              context. Ranking pages connect cities through crawlable
              comparison tables.
            </p>
            <Divider className="my-5" />
            <p className="leading-7 text-text-secondary">
              Structured indicators are directional and intended for
              orientation. Verified layers — including emergency contacts and
              healthcare access — are attributed to official government,
              public-health, and emergency-service publishers and are being
              integrated continuously. For critical decisions, always verify
              through the official sources cited on each page.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50" href={cityRoute("new-york")}>
                New York profile
              </Link>
              <Link className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50" href={staticRoutes.methodology}>
                Methodology
              </Link>
              <Link className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50" href={staticRoutes.dataSources}>
                Data sources
              </Link>
            </div>
          </Card>
          <SourceBlock sources={sources} />
        </section>
      </Section>
    </main>
  );
}

function HomeHero({
  citiesCount,
  countriesCount,
  modulesCount,
  rankingsCount,
  collectionsCount,
  sourceCount,
  heroCity,
  heroImage,
}: {
  citiesCount: number;
  countriesCount: number;
  modulesCount: number;
  rankingsCount: number;
  collectionsCount: number;
  sourceCount: number;
  heroCity?: City;
  heroImage?: PlaceImage;
}) {
  const popularLinks = [
    { href: moduleRoute("cost-of-living", heroCity?.slug ?? "new-york"), label: "Cost of living" },
    { href: rankingRoute("best-cities-quality-of-life"), label: "Quality of life" },
    { href: moduleRoute("air-quality", heroCity?.slug ?? "new-york"), label: "Air quality" },
    { href: moduleRoute("energy", heroCity?.slug ?? "new-york"), label: "Energy" },
  ];

  return (
    <section className="relative overflow-hidden border-b border-neutral-border bg-[radial-gradient(circle_at_18%_0%,rgba(254,215,170,0.46),transparent_34rem),linear-gradient(180deg,#FFFBF7_0%,#FFFFFF_100%)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#92400E_0%,#B86108_38%,#EA8C1A_72%,#FED7AA_100%)]"
      />
      <Container className="relative py-8 md:py-10">
        <div className="overflow-hidden rounded-[1.45rem] border border-neutral-border/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05),0_24px_70px_rgba(15,23,42,0.08)] lg:grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative z-10 px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
              Global city intelligence
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] text-text-primary sm:text-5xl lg:text-[3.55rem]">
              Understand cities.{" "}
              <span className="text-brand-600">Make better choices.</span>
            </h1>
            <p className="mt-5 max-w-[62ch] text-base leading-8 text-text-secondary sm:text-[1.0625rem]">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={staticRoutes.rankings}>Explore rankings</Button>
              <Button href={staticRoutes.cities} variant="secondary">
                Browse cities
              </Button>
              <Button href={staticRoutes.methodology} variant="ghost">
                Methodology
              </Button>
            </div>

            <nav aria-label="Popular city intelligence topics" className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Popular
              </p>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm">
                {popularLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="inline-flex rounded-full border border-neutral-border bg-surface-soft px-3 py-1.5 font-medium text-text-secondary transition hover:border-brand-200 hover:bg-brand-50 hover:text-text-primary"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <dl className="mt-7 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Last updated
                </dt>
                <dd className="mt-1 font-semibold text-text-primary">
                  {LAST_UPDATED}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Data year
                </dt>
                <dd className="mt-1 font-semibold text-text-primary">
                  {DATA_YEAR}
                </dd>
              </div>
            </dl>
          </div>

          <figure className="relative min-h-[18rem] border-t border-neutral-border bg-text-primary lg:min-h-[31rem] lg:border-l lg:border-t-0">
            {heroImage ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={heroImage.alt}
                  className="absolute inset-0 h-full w-full object-cover contrast-[1.03] saturate-[1.02]"
                  decoding="async"
                  height={heroImage.height}
                  loading="eager"
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  src={heroImage.src}
                  width={heroImage.width}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.56)_0%,rgba(15,23,42,0.12)_46%,rgba(15,23,42,0.02)_100%)]"
                />
                <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-slate-950/75 p-4 text-white shadow-[0_10px_28px_rgba(15,23,42,0.28)] backdrop-blur-sm sm:inset-x-6 sm:bottom-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-100">
                    Featured city profile
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {heroCity ? heroCity.name : "New York"}
                  </p>
                  {heroCity ? (
                    <p className="mt-1 text-sm leading-6 text-white/80">
                      {heroCity.countryName} / {heroCity.region} · Overall{" "}
                      {heroCity.scores.overall}/100
                    </p>
                  ) : null}
                  <ImageAttribution image={heroImage} className="mt-2 text-white/70" />
                </figcaption>
              </>
            ) : (
              <figcaption className="flex h-full min-h-[18rem] items-center justify-center p-8 text-center text-white">
                <span className="max-w-sm text-lg font-semibold">
                  Verified city imagery is rendered from the existing media catalog.
                </span>
              </figcaption>
            )}
          </figure>
        </div>

        <dl className="relative z-10 mx-4 -mt-5 grid overflow-hidden rounded-2xl border border-neutral-border/80 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.09)] sm:mx-6 sm:grid-cols-2 lg:mx-12 lg:grid-cols-5">
          <HomeStat label="Cities" value={citiesCount.toLocaleString("en-US")} />
          <HomeStat label="Countries" value={countriesCount.toLocaleString("en-US")} />
          <HomeStat label="Data phases" value={modulesCount.toLocaleString("en-US")} />
          <HomeStat
            label="Rankings & collections"
            value={(rankingsCount + collectionsCount).toLocaleString("en-US")}
          />
          <HomeStat label="Source records" value={sourceCount.toLocaleString("en-US")} />
        </dl>
      </Container>
    </section>
  );
}

function HomeStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-neutral-border/80 px-5 py-4 last:border-b-0 sm:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {label}
      </dt>
      <dd className="mt-1 text-xl font-semibold tabular-nums text-text-primary">
        {value}
      </dd>
    </div>
  );
}
