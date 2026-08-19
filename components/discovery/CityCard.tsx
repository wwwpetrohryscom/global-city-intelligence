"use client";

import Link from "next/link";
import { formatPopulation } from "@/lib/discovery/bands";
import { cityRoute } from "@/lib/seo/routes";
import type { DiscoveryCity } from "@/lib/discovery/types";

/**
 * One result row in the Finder.
 *
 * Shows four attributes, not every attribute: population, climate zone, annual
 * average temperature and affordability. The rest live on the city's own pages
 * and in the comparison view — a card that rendered all eleven fields would
 * stop being scannable, which is the only job a result card has.
 *
 * An unpublished value renders the words "Not available". It is never shown as
 * 0, blank, or "—", each of which reads as a real low value at a glance.
 */

function Stat({ label, value }: { label: string; value: string }) {
  const missing = value === "Not available";
  return (
    <div className="min-w-0">
      <dt className="text-[11px] uppercase tracking-wide text-text-muted">{label}</dt>
      <dd className={missing ? "truncate text-sm text-text-muted italic" : "truncate text-sm font-medium text-text-primary"}>
        {value}
      </dd>
    </div>
  );
}

export function CityCard({
  city,
  countryName,
  zone,
  saved,
  compared,
  compareDisabled,
  onToggleSave,
  onToggleCompare,
}: {
  city: DiscoveryCity;
  countryName: string;
  zone: string;
  saved: boolean;
  compared: boolean;
  compareDisabled: boolean;
  onToggleSave: (slug: string) => void;
  onToggleCompare: (slug: string) => void;
}) {
  return (
    <li className="flex flex-col rounded-xl border border-neutral-border bg-white p-4 transition-colors hover:border-brand-300">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-text-primary">
            <Link
              className="rounded-sm hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              href={cityRoute(city.s)}
            >
              {city.n}
            </Link>
          </h3>
          <p className="truncate text-sm text-text-secondary">{countryName}</p>
        </div>
        <button
          aria-label={saved ? `Remove ${city.n} from saved cities` : `Save ${city.n}`}
          aria-pressed={saved}
          className={[
            // 44px is the accessible touch-target floor; desktop can afford the
            // tighter control since pointer precision is higher there.
            "inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border px-2.5 text-xs font-medium transition-colors lg:min-h-9",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
            saved
              ? "border-brand-500 bg-brand-50 text-brand-700"
              : "border-neutral-border text-text-secondary hover:border-neutral-line hover:text-text-primary",
          ].join(" ")}
          onClick={() => onToggleSave(city.s)}
          type="button"
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5">
        <Stat label="Population" value={formatPopulation(city.p)} />
        <Stat label="Climate" value={zone} />
        <Stat label="Avg temp" value={`${city.t}°C`} />
        <Stat
          label="Affordability"
          value={city.a === null ? "Not available" : `${city.a}/100`}
        />
      </dl>

      <div className="mt-4 flex items-center gap-2 border-t border-neutral-border pt-3">
        <Link
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-brand-navy lg:min-h-9 px-3 text-sm font-medium text-white transition-colors hover:bg-brand-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          href={cityRoute(city.s)}
        >
          View city
        </Link>
        <button
          aria-label={
            compared
              ? `Remove ${city.n} from comparison`
              : `Add ${city.n} to comparison`
          }
          aria-pressed={compared}
          className={[
            "inline-flex min-h-11 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors lg:min-h-9",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
            compared
              ? "border-accent-blue bg-eco-50 text-eco-700"
              : "border-neutral-border text-text-secondary hover:border-neutral-line hover:text-text-primary",
            !compared && compareDisabled ? "cursor-not-allowed opacity-40" : "",
          ].join(" ")}
          disabled={!compared && compareDisabled}
          onClick={() => onToggleCompare(city.s)}
          type="button"
        >
          {compared ? "Comparing" : "Compare"}
        </button>
      </div>
    </li>
  );
}
