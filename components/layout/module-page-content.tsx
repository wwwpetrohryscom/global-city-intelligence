import Link from "next/link";
import { LinkCard } from "@/components/cards/link-card";
import { MetricCard } from "@/components/cards/MetricCard";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SourceBlock } from "@/components/seo/source-block";
import { DataTable } from "@/components/tables/DataTable";
import { ScoreBar } from "@/components/ui/score-bar";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  generateModuleExplanation,
  generateModuleIntro,
} from "@/lib/content/generators";
import { internalLink } from "@/lib/content/links";
import { demoDataNotice } from "@/lib/content/quality";
import { getAllCities, getAllModules, getAllRankings } from "@/lib/data/queries";
import { getSourcesByIds } from "@/lib/data/sources";
import { moduleBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { cityRoute, moduleRoute, rankingRoute } from "@/lib/seo/routes";
import { breadcrumbSchema, datasetSchema, webpageSchema } from "@/lib/seo/schema";
import type { City, CityModuleData, IntelligenceModule } from "@/types";

export function ModulePageContent({
  city,
  moduleItem,
  moduleData,
  title,
  description,
}: {
  city: City;
  moduleItem: IntelligenceModule;
  moduleData: CityModuleData;
  title: string;
  description: string;
}) {
  const breadcrumbs = moduleBreadcrumbs(moduleItem.slug, city.slug);
  const sources = getSourcesByIds(moduleData.sources);
  const relatedModules = getAllModules().filter(
    (relatedModule) => relatedModule.slug !== moduleItem.slug,
  );
  const rankings = getAllRankings().slice(0, 2);
  const path = moduleRoute(moduleItem.slug, city.slug);

  const allCities = getAllCities();
  const rankedCities = allCities
    .filter((otherCity) => otherCity.slug !== city.slug)
    .map((otherCity) => ({
      city: otherCity,
      moduleData: otherCity.modules[moduleItem.slug],
    }))
    .sort((a, b) => b.moduleData.score - a.moduleData.score);
  // Cap the on-page comparison so module pages stay small (the full set would
  // be 1,000+ rows per page across 6 modules x every city, which blows up the
  // build output). Same-country peers first, then the highest-scoring cities
  // globally, deduped, max 30. Every city remains crawlable via the sitemap,
  // the /cities index, and per-city profiles.
  const COMPARISON_CAP = 30;
  const sameCountryCities = rankedCities.filter(
    (entry) => entry.city.countrySlug === city.countrySlug,
  );
  const sameCountrySlugs = new Set(
    sameCountryCities.map((entry) => entry.city.slug),
  );
  const otherCities = [
    ...sameCountryCities,
    ...rankedCities.filter((entry) => !sameCountrySlugs.has(entry.city.slug)),
  ].slice(0, COMPARISON_CAP);

  const introCopy = generateModuleIntro(moduleItem, city);
  const explanationCopy = generateModuleExplanation(moduleItem, city, allCities);
  const cityProfileLink = internalLink.cityProfile(city);
  const methodologyLink = internalLink.methodology();

  return (
    <main>
      <JsonLd data={webpageSchema({ path, title, description })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={datasetSchema({
          name: `${moduleItem.name} dataset for ${city.name}`,
          description,
          path,
          dataYear: moduleData.dataYear,
          sources,
        })}
      />
      <PageHeader eyebrow={moduleItem.name} intro={introCopy} title={title}>
        <dl className="grid gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Last updated
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {moduleData.lastUpdated}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Data year
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {moduleData.dataYear}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Module score
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {moduleData.score}/100
            </dd>
          </div>
        </dl>
      </PageHeader>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbNav items={breadcrumbs} />

        <section className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
          <article className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-text-primary">
              {moduleItem.name} score
            </h2>
            <p className="mt-4 leading-7 text-text-secondary">
              {moduleItem.description}
            </p>
            <div className="mt-6">
              <ScoreBar label={`${moduleItem.name} in ${city.name}`} value={moduleData.score} />
            </div>
          </article>
          <div className="grid gap-5 md:grid-cols-3">
            {moduleData.metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            description="This HTML table mirrors the visible score cards so important comparison data is never trapped in a browser-only chart."
            title={`${city.name} ${moduleItem.name.toLowerCase()} data table`}
          />
          <div className="mt-6">
            <DataTable
              caption={`${city.name} ${moduleItem.name} data table`}
              rows={moduleData.table}
            />
          </div>
        </section>

        <section>
          <SectionHeading
            description="A crawlable comparison across a selection of same-country and top-scoring cities. The complete set is reachable via the rankings, the cities index, and each city profile."
            title={`${moduleItem.name} city comparison`}
          />
          <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-border bg-white shadow-sm">
            <table className="min-w-full border-collapse text-left text-sm">
              <caption className="sr-only">{`${moduleItem.name} city comparison table`}</caption>
              <thead className="bg-neutral-soft text-text-secondary">
                <tr>
                  <th className="px-4 py-3 font-semibold" scope="col">
                    City
                  </th>
                  <th className="px-4 py-3 font-semibold" scope="col">
                    Score
                  </th>
                  <th className="px-4 py-3 font-semibold" scope="col">
                    Summary
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                <tr className="bg-orange-50/40">
                  <th className="px-4 py-4 font-medium text-text-primary" scope="row">
                    {city.name} (this page)
                  </th>
                  <td className="border-l-2 border-brand-500 px-4 py-4 font-semibold text-text-primary">
                    {moduleData.score}/100
                  </td>
                  <td className="px-4 py-4 text-text-secondary">{moduleData.summary}</td>
                </tr>
                {otherCities.map(({ city: otherCity, moduleData: otherModule }) => (
                  <tr className="odd:bg-white even:bg-neutral-soft/60 hover:bg-orange-50/60" key={otherCity.slug}>
                    <th className="px-4 py-4 font-medium text-text-primary" scope="row">
                      <Link
                        className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                        href={moduleRoute(moduleItem.slug, otherCity.slug)}
                      >
                        {otherCity.name}
                      </Link>
                    </th>
                    <td className="border-l-2 border-brand-500 px-4 py-4 font-semibold text-text-primary">
                      {otherModule.score}/100
                    </td>
                    <td className="px-4 py-4 text-text-secondary">{otherModule.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-text-primary">
              Interpretation
            </h2>
            <p className="mt-4 leading-7 text-text-secondary">{explanationCopy}</p>
            <p className="mt-4 leading-7 text-text-secondary">
              Read this module with the main{" "}
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={cityProfileLink.href}
              >
                {cityProfileLink.text.toLowerCase()}
              </Link>{" "}
              and the{" "}
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={methodologyLink.href}
              >
                {methodologyLink.text.toLowerCase()}
              </Link>{" "}
              page so single-topic pages do not hide tradeoffs across dimensions.
            </p>
            <p className="mt-4 text-xs leading-6 text-text-secondary">
              {demoDataNotice()}
            </p>
          </article>
          <SourceBlock sources={sources} />
        </section>

        <section>
          <SectionHeading
            description="These links connect module pages back to city, ranking, and sibling topic paths with crawlable href values."
            title="Continue exploring"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <LinkCard
              description={`Return to the complete ${city.name} profile with all module scores and source context.`}
              href={cityRoute(city.slug)}
              title={`${city.name} city profile`}
            />
            {relatedModules.map((relatedModule) => (
              <LinkCard
                description={relatedModule.description}
                href={moduleRoute(relatedModule.slug, city.slug)}
                key={relatedModule.slug}
                title={`${relatedModule.name} in ${city.name}`}
              />
            ))}
            {rankings.map((ranking) => (
              <LinkCard
                description={ranking.description}
                href={rankingRoute(ranking.slug)}
                key={ranking.slug}
                title={ranking.shortTitle}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
