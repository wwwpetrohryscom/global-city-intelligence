import Link from "next/link";
import { cityRoute, countryRoute } from "@/lib/seo/routes";
import type { City, Country } from "@/types";

function VerifiedBadge({
  label,
  available,
}: {
  label: string;
  available: boolean;
}) {
  return (
    <li
      aria-label={`${label}: ${available ? "verified" : "not yet verified"}`}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
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

interface SideProps {
  city: City;
  country?: Country;
  layers: {
    emergency: boolean;
    healthcare: boolean;
    transport: boolean;
  };
}

function ComparisonSide({ city, country, layers }: SideProps) {
  return (
    <article className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {country?.name ?? city.countryName} / {city.region}
      </p>
      <h3 className="mt-1 text-xl font-semibold text-text-primary">
        <Link
          className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
          href={cityRoute(city.slug)}
        >
          {city.name}
        </Link>
      </h3>
      <p className="mt-3 text-sm leading-6 text-text-secondary">{city.outlook}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="font-semibold uppercase tracking-wide text-text-secondary">
            Overall
          </dt>
          <dd className="mt-1 text-base font-semibold text-text-primary">
            {city.scores.overall}/100
          </dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wide text-text-secondary">
            Population
          </dt>
          <dd className="mt-1 text-base font-semibold text-text-primary">
            {city.population}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-text-secondary">
        Verified layers
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        <VerifiedBadge available={layers.emergency} label="Emergency" />
        <VerifiedBadge available={layers.healthcare} label="Healthcare" />
        <VerifiedBadge available={layers.transport} label="Transport" />
      </ul>
      {country ? (
        <p className="mt-4 text-sm">
          <Link
            className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
            href={countryRoute(country.slug)}
          >
            Open {country.name} country profile
          </Link>
        </p>
      ) : null}
    </article>
  );
}

export function ComparisonSummaryCards({
  cityA,
  cityB,
  countryA,
  countryB,
  layersA,
  layersB,
  intentLabel,
  dataYear,
  lastUpdated,
}: {
  cityA: City;
  cityB: City;
  countryA?: Country;
  countryB?: Country;
  layersA: SideProps["layers"];
  layersB: SideProps["layers"];
  intentLabel: string;
  dataYear: string;
  lastUpdated: string;
}) {
  return (
    <section
      aria-label="Comparison summary"
      className="space-y-4"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <ComparisonSide city={cityA} country={countryA} layers={layersA} />
        <ComparisonSide city={cityB} country={countryB} layers={layersB} />
      </div>
      <dl className="grid gap-4 rounded-2xl border border-neutral-border bg-surface-soft p-5 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Comparison intent
          </dt>
          <dd className="mt-1 text-sm font-semibold text-text-primary">
            {intentLabel}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Last updated
          </dt>
          <dd className="mt-1 text-sm font-semibold text-text-primary">
            {lastUpdated}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Data year
          </dt>
          <dd className="mt-1 text-sm font-semibold text-text-primary">
            {dataYear}
          </dd>
        </div>
      </dl>
    </section>
  );
}
