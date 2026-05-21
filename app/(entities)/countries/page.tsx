import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ImageAttribution } from "@/components/media/ImageAttribution";
import { HubNav } from "@/components/navigation/HubNav";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import { getCountryHeroImage } from "@/lib/data/media/queries";
import {
  getAllCountries,
  getCitiesByCountrySlug,
  getCountryEmergencyProfile,
  getCountryHealthcareProfile,
  hasVerifiedCountryIndicators,
} from "@/lib/data/queries";
import { staticBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import {
  cityRoute,
  countryRoute,
  staticRoutes,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

const title = "Global Country Intelligence Directory";
const description =
  "Browse every supported country profile and understand national context for city data, emergency services, healthcare access, and transport systems. All country links are server-rendered and crawlable.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.countries,
});

export default function CountriesIndexPage() {
  const countries = getAllCountries()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  const breadcrumbs = staticBreadcrumbs("Countries", staticRoutes.countries);

  const rows = countries.map((country) => {
    const countryCities = getCitiesByCountrySlug(country.slug);
    const emergency = getCountryEmergencyProfile(country.slug);
    const healthcare = getCountryHealthcareProfile(country.slug);
    return {
      country,
      cityCount: countryCities.length,
      cityNames: countryCities.map((city) => city.name).join(", "),
      hasEmergency: emergency?.verificationStatus === "verified",
      hasHealthcare: healthcare?.verificationStatus === "verified",
      hasIndicators: hasVerifiedCountryIndicators(country.slug),
    };
  });

  const totalCities = rows.reduce((sum, row) => sum + row.cityCount, 0);
  const verifiedEmergency = rows.filter((row) => row.hasEmergency).length;
  const verifiedHealthcare = rows.filter((row) => row.hasHealthcare).length;
  const verifiedIndicators = rows.filter((row) => row.hasIndicators).length;

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: staticRoutes.countries,
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <PageHeader eyebrow="Directory" intro={description} title={title}>
        <dl className="grid gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Countries indexed
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {countries.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Linked cities
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {totalCities}
            </dd>
          </div>
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
        </dl>
      </PageHeader>

      <Container className="space-y-12 py-12">
        <BreadcrumbNav items={breadcrumbs} />
        <HubNav activeHref={staticRoutes.countries} />

        <section>
          <SectionHeading
            description={`${verifiedEmergency} of ${countries.length} countries have verified emergency contact profiles, ${verifiedHealthcare} have verified healthcare access profiles, and ${verifiedIndicators} have verified country indicators. Indicators below show which verified layers are available per country.`}
            title="All indexed countries"
          />
          <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-border bg-white shadow-sm">
            <table className="min-w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Country intelligence directory with verified-layer indicators
              </caption>
              <thead className="bg-neutral-soft text-text-primary">
                <tr>
                  <th
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                    scope="col"
                  >
                    Country
                  </th>
                  <th
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                    scope="col"
                  >
                    Region
                  </th>
                  <th
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                    scope="col"
                  >
                    Indexed cities
                  </th>
                  <th
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                    scope="col"
                  >
                    Verified layers
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                {rows.map((row) => (
                  <tr
                    className="odd:bg-white even:bg-neutral-soft/60"
                    key={row.country.slug}
                  >
                    <th
                      className="px-4 py-4 font-medium text-text-primary"
                      scope="row"
                    >
                      <Link
                        className="underline decoration-brand-500 decoration-2 underline-offset-4 hover:bg-orange-50"
                        href={countryRoute(row.country.slug)}
                      >
                        {row.country.name}
                      </Link>
                      <span className="ml-2 text-xs font-normal uppercase tracking-wide text-text-secondary">
                        {row.country.iso2}
                      </span>
                    </th>
                    <td className="px-4 py-4 text-text-secondary">
                      {row.country.region}
                    </td>
                    <td className="border-l-2 border-brand-500 px-4 py-4 text-text-primary">
                      <span className="font-semibold">{row.cityCount}</span>
                      {row.cityNames ? (
                        <span className="ml-2 text-xs text-text-secondary">
                          {row.cityNames}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <ul className="flex flex-wrap gap-2 text-xs">
                        <LayerIndicator
                          available={row.hasEmergency}
                          label="Emergency"
                        />
                        <LayerIndicator
                          available={row.hasHealthcare}
                          label="Healthcare"
                        />
                        <LayerIndicator
                          available={row.hasIndicators}
                          label="Indicators"
                        />
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <SectionHeading
            description="Each country page groups its supported cities, summarises national context, and surfaces verified emergency and healthcare layers where available."
            title="Browse by country"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((row) => {
              const hero = getCountryHeroImage(row.country.slug);
              const aspectStyle =
                hero?.width && hero.height
                  ? { aspectRatio: `${hero.width} / ${hero.height}` }
                  : { aspectRatio: "16 / 9" };
              return (
                <article
                  className="overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md"
                  key={row.country.slug}
                >
                  {hero ? (
                    <figure className="border-b border-neutral-border bg-neutral-soft">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={hero.alt}
                        className="block h-auto w-full object-cover"
                        decoding="async"
                        height={hero.height}
                        loading="lazy"
                        sizes="(min-width: 1280px) 24rem, (min-width: 768px) 50vw, 100vw"
                        src={hero.src}
                        style={aspectStyle}
                        width={hero.width}
                      />
                      <figcaption className="px-4 py-2">
                        <ImageAttribution image={hero} />
                      </figcaption>
                    </figure>
                  ) : null}
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      {row.country.region}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-text-primary">
                      <Link
                        className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                        href={countryRoute(row.country.slug)}
                      >
                        {row.country.name}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                      {row.country.intro}
                    </p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      {row.cityCount} indexed cit{row.cityCount === 1 ? "y" : "ies"}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2 text-sm">
                      {getCitiesByCountrySlug(row.country.slug).map((city) => (
                        <li key={city.slug}>
                          <Link
                            className="rounded-full border border-neutral-border bg-surface-soft px-3 py-1 text-text-secondary transition hover:border-brand-400 hover:text-brand-500"
                            href={cityRoute(city.slug)}
                          >
                            {city.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-border bg-surface-soft p-6">
          <h2 className="text-2xl font-semibold text-text-primary">
            How to use this directory
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
            Country profiles provide the national context behind city
            indicators: regional classification, indexed cities, and verified
            information layers attributed to official publishers. Verified
            emergency and healthcare layers cite government, public-health,
            and emergency-service sources. Structured indicators are
            directional; for critical decisions, follow the official source
            links cited on each page.
          </p>
          <ul className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.cities}
              >
                Cities directory
              </Link>
              <span className="text-text-secondary">
                {" "}
                — browse every indexed city profile.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.rankings}
              >
                Global rankings
              </Link>
              <span className="text-text-secondary">
                {" "}
                — compare cities through structured tables.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.methodology}
              >
                Scoring methodology
              </Link>
              <span className="text-text-secondary">
                {" "}
                — how indicators are constructed and read.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.dataSources}
              >
                Data sources
              </Link>
              <span className="text-text-secondary">
                {" "}
                — the official registry behind verified layers.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.travelBudgetCalculator}
              >
                Travel budget calculator
              </Link>
              <span className="text-text-secondary">
                {" "}
                — review country hubs, then estimate a trip budget using your
                own inputs. Planning estimator only, not an official travel
                cost estimate.
              </span>
            </li>
          </ul>
        </section>
      </Container>
    </main>
  );
}

function LayerIndicator({
  label,
  available,
}: {
  label: string;
  available: boolean;
}) {
  return (
    <li
      aria-label={`${label}: ${available ? "verified" : "not yet verified"}`}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
        available
          ? "border-brand-400 bg-orange-50 text-brand-600"
          : "border-neutral-border bg-neutral-soft text-text-secondary"
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          available ? "bg-brand-500" : "bg-text-secondary/50"
        }`}
      />
      {label}
    </li>
  );
}
