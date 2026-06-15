import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllClimateProfiles,
  getClimate,
  getCityBySlug,
  getCountryBySlug,
  hasVisualCityGuidePage,
  hasWeekendTripPage,
} from "@/lib/data/queries";
import { hasCostOfLiving } from "@/lib/data/cost-of-living";
import { hasEconomy } from "@/lib/data/economy";
import { hasEducation } from "@/lib/data/education";
import { createMetadata } from "@/lib/seo/metadata";
import {
  cityRoute,
  climateRoute,
  costOfLivingRoute,
  countryRoute,
  economyRoute,
  educationRoute,
  staticRoutes,
  visualCityGuideRoute,
  weekendTripRoute,
} from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";
import type { ClimateProfile, MonthlyClimate } from "@/types/climate";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return getAllClimateProfiles().map((profile) => ({ city: profile.citySlug }));
}

function pageTitle(cityName: string): string {
  return `Climate in ${cityName}`;
}

function pageDescription(cityName: string, p: ClimateProfile): string {
  return `Climate profile for ${cityName}: a ${p.climateZone.toLowerCase()} climate with an annual average of ${p.annualAvgTempC}°C and about ${p.annualPrecipitationMm} mm of precipitation a year. Month-by-month temperatures, rainfall, rainy days, and sunshine, plus a climate comfort score. Deterministic planning estimates — not a forecast.`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  const profile = getClimate(citySlug);
  if (!city || !profile) {
    return {};
  }
  return createMetadata({
    title: pageTitle(city.name),
    description: pageDescription(city.name, profile),
    path: climateRoute(city.slug),
    lastModified: profile.updatedAt,
  });
}

function comfortBand(score: number): string {
  if (score >= 75) return "very comfortable";
  if (score >= 60) return "comfortable";
  if (score >= 45) return "moderate";
  if (score >= 30) return "challenging";
  return "demanding";
}

// Deterministic "best months" — most comfortable for time outdoors:
// mild highs, not-cold lows, lower rainfall, decent sunshine.
function visitScore(m: MonthlyClimate): number {
  const tempPenalty = Math.abs(m.avgHighC - 23) * 2.2 + Math.max(0, 8 - m.avgLowC) * 1.5;
  const rainPenalty = m.rainyDays * 2.0;
  const sunBonus = m.sunshineHours / 30;
  return 100 - tempPenalty - rainPenalty + sunBonus;
}

const NORTH_SEASONS: { name: string; months: number[] }[] = [
  { name: "Winter", months: [11, 0, 1] },
  { name: "Spring", months: [2, 3, 4] },
  { name: "Summer", months: [5, 6, 7] },
  { name: "Autumn", months: [8, 9, 10] },
];
const SOUTH_SEASONS: { name: string; months: number[] }[] = [
  { name: "Summer", months: [11, 0, 1] },
  { name: "Autumn", months: [2, 3, 4] },
  { name: "Winter", months: [5, 6, 7] },
  { name: "Spring", months: [8, 9, 10] },
];

export default async function ClimatePage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  const profile = getClimate(citySlug);

  if (!city || !profile) {
    notFound();
  }

  const country = getCountryBySlug(city.countrySlug);
  const m = profile.monthly;
  const southern = (m[0]?.avgHighC ?? 0) > (m[6]?.avgHighC ?? 0); // Jan warmer than Jul
  const seasons = southern ? SOUTH_SEASONS : NORTH_SEASONS;

  const title = pageTitle(city.name);
  const description = pageDescription(city.name, profile);

  const breadcrumbs = [
    { name: "Home", href: staticRoutes.home },
    { name: "Cities", href: staticRoutes.cities },
    { name: city.name, href: cityRoute(city.slug) },
    { name: "Climate", href: climateRoute(city.slug) },
  ];

  const annualSun = m.reduce((sum, x) => sum + x.sunshineHours, 0);
  const annualRainyDays = m.reduce((sum, x) => sum + x.rainyDays, 0);
  const hottest = m.reduce((a, b) => (b.avgHighC > a.avgHighC ? b : a));
  const coldest = m.reduce((a, b) => (b.avgLowC < a.avgLowC ? b : a));
  const band = comfortBand(profile.comfortScore);

  const bestMonths = [...m]
    .map((mo) => ({ mo, score: visitScore(mo) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.mo.month);

  const overview = `${city.name}${country ? `, ${country.name}` : ""} has a ${profile.climateZone.toLowerCase()} climate. The annual average temperature is about ${profile.annualAvgTempC}°C and the city receives roughly ${profile.annualPrecipitationMm} mm of precipitation across ${annualRainyDays} rainy days a year, with around ${annualSun} hours of sunshine. The warmest month is ${profile.hottestMonth} (highs near ${hottest.avgHighC}°C) and the coldest is ${profile.coldestMonth} (lows near ${coldest.avgLowC}°C). These are deterministic, latitude- and region-based planning estimates — not a forecast or measured station data; check current conditions with an official meteorological service before travel.`;

  const seasonRows = seasons.map((s) => {
    const hi = s.months.reduce((sum, i) => sum + m[i].avgHighC, 0) / s.months.length;
    const lo = s.months.reduce((sum, i) => sum + m[i].avgLowC, 0) / s.months.length;
    const rain = s.months.reduce((sum, i) => sum + m[i].precipitationMm, 0);
    return { name: s.name, hi: Math.round(hi), lo: Math.round(lo), rain };
  });

  const peers = (city.relatedCitySlugs ?? [])
    .map((slug) => {
      const peerCity = getCityBySlug(slug);
      const peerProfile = getClimate(slug);
      return peerCity && peerProfile ? { city: peerCity, profile: peerProfile } : null;
    })
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main>
      <JsonLd data={webpageSchema({ path: climateRoute(city.slug), title, description })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHeader eyebrow="Climate" intro={overview} title={title}>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Climate zone
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {profile.climateZone}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Comfort score
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {profile.comfortScore}/100
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-12 pb-20">
        <BreadcrumbNav items={breadcrumbs} />

        <section aria-labelledby="overview-heading">
          <h2 className="sr-only" id="overview-heading">
            Climate overview
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>{overview}</p>
            <p className="mt-3">
              Data year {DATA_YEAR}; last updated {LAST_UPDATED}.
            </p>
          </Card>
        </section>

        <section aria-labelledby="zone-heading">
          <SectionHeading
            description="Köppen-style classification derived deterministically from latitude and regional precipitation regime."
            title="Climate zone"
          />
          <h2 className="sr-only" id="zone-heading">
            Climate zone
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>
              {city.name} is classified as{" "}
              <span className="font-semibold text-text-primary">{profile.climateZone}</span>. This
              reflects its annual temperature range and the seasonal pattern of its rainfall.
            </p>
          </Card>
        </section>

        <section aria-labelledby="temps-heading">
          <SectionHeading
            description="Annual averages and seasonal extremes."
            title="Average temperatures"
          />
          <h2 className="sr-only" id="temps-heading">
            Average temperatures
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Annual average", `${profile.annualAvgTempC}°C`],
              ["Warmest month", `${profile.hottestMonth} (${hottest.avgHighC}°C)`],
              ["Coldest month", `${profile.coldestMonth} (${coldest.avgLowC}°C)`],
              ["Comfort score", `${profile.comfortScore}/100`],
            ].map(([label, value]) => (
              <li key={label}>
                <Card className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-text-secondary">{label}</span>
                  <span className="text-base font-semibold text-text-primary">{value}</span>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="rain-heading">
          <SectionHeading
            description="Annual precipitation and how it is distributed across the year."
            title="Rainfall overview"
          />
          <h2 className="sr-only" id="rain-heading">
            Rainfall overview
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>
              {city.name} receives about{" "}
              <span className="font-semibold text-text-primary">
                {profile.annualPrecipitationMm} mm
              </span>{" "}
              of precipitation a year over roughly {annualRainyDays} rainy days. The wettest month
              is {profile.wettestMonth} and the driest is {profile.driestMonth}.
            </p>
          </Card>
        </section>

        <section aria-labelledby="sun-heading">
          <SectionHeading
            description="Estimated annual sunshine and its seasonal pattern."
            title="Sunshine overview"
          />
          <h2 className="sr-only" id="sun-heading">
            Sunshine overview
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>
              {city.name} sees an estimated{" "}
              <span className="font-semibold text-text-primary">{annualSun} hours</span> of sunshine
              a year, concentrated in the warmer months around {profile.hottestMonth}.
            </p>
          </Card>
        </section>

        <section aria-labelledby="monthly-heading">
          <SectionHeading
            description="Month-by-month estimates of temperature, rainfall, rainy days, and sunshine."
            title="Monthly climate table"
          />
          <h2 className="sr-only" id="monthly-heading">
            Monthly climate table
          </h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-border bg-white shadow-sm">
            <table className="min-w-full border-collapse text-left text-sm">
              <caption className="sr-only">{`${city.name} monthly climate table`}</caption>
              <thead className="bg-neutral-soft text-text-secondary">
                <tr>
                  {["Month", "High", "Low", "Rain", "Rainy Days", "Sunshine"].map((h) => (
                    <th className="px-4 py-3 font-semibold" key={h} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                {m.map((mo) => (
                  <tr className="odd:bg-white even:bg-neutral-soft/60" key={mo.month}>
                    <th className="px-4 py-3 font-medium text-text-primary" scope="row">
                      {mo.month}
                    </th>
                    <td className="px-4 py-3 text-text-secondary">{mo.avgHighC}°C</td>
                    <td className="px-4 py-3 text-text-secondary">{mo.avgLowC}°C</td>
                    <td className="px-4 py-3 text-text-secondary">{mo.precipitationMm} mm</td>
                    <td className="px-4 py-3 text-text-secondary">{mo.rainyDays}</td>
                    <td className="px-4 py-3 text-text-secondary">{mo.sunshineHours} h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="best-heading">
          <SectionHeading
            description="Months with the mildest temperatures and lower rainfall, by the deterministic comfort heuristic. Not a tourism ranking."
            title="Best months to visit"
          />
          <h2 className="sr-only" id="best-heading">
            Best months to visit
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>
              By temperature and rainfall, the most comfortable months in {city.name} are{" "}
              <span className="font-semibold text-text-primary">{bestMonths.join(", ")}</span>.
              Conditions vary year to year — verify with a current forecast before booking.
            </p>
          </Card>
        </section>

        <section aria-labelledby="seasonal-heading">
          <SectionHeading
            description="Average conditions by season."
            title="Seasonal summary"
          />
          <h2 className="sr-only" id="seasonal-heading">
            Seasonal summary
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {seasonRows.map((s) => (
              <li key={s.name}>
                <Card>
                  <p className="text-sm font-semibold text-text-primary">{s.name}</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {s.hi}°C / {s.lo}°C
                  </p>
                  <p className="text-xs text-text-secondary">{s.rain} mm rain</p>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="comfort-heading">
          <SectionHeading
            description="A 0–100 composite of temperature balance, rainfall, sunshine, seasonality, and winter/summer extremes; higher means more comfortable. Used consistently across the platform."
            title="Climate comfort score"
          />
          <h2 className="sr-only" id="comfort-heading">
            Climate comfort score
          </h2>
          <Card className="text-sm leading-6 text-text-secondary">
            <p>
              {city.name} has a climate comfort score of{" "}
              <span className="font-semibold text-text-primary">{profile.comfortScore}/100</span>,
              a {band} year-round climate by this measure. The score weights mild temperatures most,
              then rainfall balance, sunshine, low seasonality, and the absence of extreme winter
              cold or summer heat.
            </p>
            {peers.length > 0 ? (
              <ul className="mt-4 grid gap-2">
                {peers.map(({ city: peerCity, profile: peerProfile }) => (
                  <li key={peerCity.slug}>
                    <Link
                      className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                      href={climateRoute(peerCity.slug)}
                    >
                      Climate in {peerCity.name}
                    </Link>{" "}
                    — {peerProfile.climateZone}, comfort {peerProfile.comfortScore}/100
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>
        </section>

        <section aria-labelledby="continue-heading">
          <SectionHeading
            description="Continue researching this city across the platform's other planning surfaces."
            title="Continue exploring"
          />
          <h2 className="sr-only" id="continue-heading">
            Continue exploring
          </h2>
          <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={cityRoute(city.slug)}
              >
                {city.name} city profile
              </Link>
            </li>
            {hasCostOfLiving(city.slug) ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={costOfLivingRoute(city.slug)}
                >
                  Cost of living in {city.name}
                </Link>
              </li>
            ) : null}
            {hasEconomy(city.slug) ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={economyRoute(city.slug)}
                >
                  Economy and jobs in {city.name}
                </Link>
              </li>
            ) : null}
            {hasEducation(city.slug) ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={educationRoute(city.slug)}
                >
                  Universities and education in {city.name}
                </Link>
              </li>
            ) : null}
            {hasWeekendTripPage(city.slug) ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={weekendTripRoute(city.slug)}
                >
                  {city.name} weekend trip
                </Link>
              </li>
            ) : null}
            {hasVisualCityGuidePage(city.slug) ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={visualCityGuideRoute(city.slug)}
                >
                  {city.name} visual guide
                </Link>
              </li>
            ) : null}
            {country ? (
              <li>
                <Link
                  className="text-text-secondary underline decoration-neutral-border underline-offset-2 hover:text-brand-500"
                  href={countryRoute(country.slug)}
                >
                  {country.name} country profile
                </Link>
              </li>
            ) : null}
          </ul>
        </section>
      </Container>
    </main>
  );
}
