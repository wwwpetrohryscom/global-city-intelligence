import type { Metadata } from "next";
import Link from "next/link";
import { CityCard } from "@/components/cards/CityCard";
import { LinkCard } from "@/components/cards/link-card";
import { Section } from "@/components/layout/Section";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { DataTable } from "@/components/tables/DataTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllCities,
  getAllCollections,
  getAllModules,
  getAllRankings,
  getCollectionIntentLabel,
} from "@/lib/data/queries";
import { getSourcesByIds } from "@/lib/data/sources";
import { createMetadata } from "@/lib/seo/metadata";
import {
  cityRoute,
  getCollectionUrl,
  rankingRoute,
  staticRoutes,
} from "@/lib/seo/routes";
import { datasetSchema, webpageSchema } from "@/lib/seo/schema";

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
  const rankings = getAllRankings();
  const modules = getAllModules();
  const collections = getAllCollections();
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
      <PageHeader
        eyebrow="City intelligence"
        intro={description}
        title="Global City Intelligence Platform"
      >
        <dl className="grid gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Last updated
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {LAST_UPDATED}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {DATA_YEAR}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Indexable routes
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              Cities, countries, modules, and rankings
            </dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button href={staticRoutes.rankings}>Explore rankings</Button>
          <Button href={staticRoutes.methodology} variant="secondary">
            Read methodology
          </Button>
        </div>
      </PageHeader>

      <Section className="bg-white" containerClassName="space-y-14">
        <section>
          <SectionHeading
            description="Start with cities, then move into modules and rankings. Every link is crawlable and every data block has text and table equivalents."
            title="Explore city profiles"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {cities.map((city) => (
              <CityCard city={city} key={city.slug} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            description="The homepage includes a compact table so search engines and users can compare core scores without waiting for client-side JavaScript."
            title="City intelligence table"
          />
          <div className="mt-6">
            <DataTable
              caption="City intelligence overview table"
              rows={cities.map((city) => ({
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
