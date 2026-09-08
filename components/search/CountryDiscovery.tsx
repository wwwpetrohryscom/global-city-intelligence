"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { useSearchIndex } from "@/components/search/use-search-index";
import { fold, bestRank, MatchRank } from "@/lib/search/match";
import { search } from "@/lib/search/query";
import { MACRO_REGIONS, type MacroRegion } from "@/lib/search/regions";

/**
 * Discovery layer for /countries: search, region facets and sorting over the
 * country set, plus city hits pulled from the lazily-loaded city index.
 *
 * This is a client component, but Next pre-renders it to HTML, so every
 * country card link ships in the server-rendered markup and stays crawlable.
 * Search filters that list; it never becomes the only way to reach a country.
 * The full verified-layer table still renders below this section untouched.
 *
 * No `lib/data` or `lib/seo/routes` import — country rows arrive as props from
 * the server page and hrefs are literal path shapes.
 */

export interface CountryRow {
  slug: string;
  name: string;
  iso2: string;
  region: string;
  macroRegion: MacroRegion | null;
  cityCount: number;
  flag: string;
  /** Nominal GDP, current US$, snapshot reference year. Null when unreported. */
  gdpCurrentUsd: number | null;
  /** GDP per capita, current US$, same reference year. Null when unreported. */
  gdpPerCapitaCurrentUsd: number | null;
}

/**
 * MISSING VALUES SORT LAST, THEY DO NOT SORT AS ZERO.
 *
 * A country the World Bank does not report has no value. Treating that as 0
 * would place it at the very bottom of a descending sort as though it were the
 * smallest economy on earth — a claim the data does not make. It sorts after
 * every country that has a comparable figure, alphabetically among its peers.
 * This mirrors `compareByEconomicSort` on the server; the two must agree,
 * because the server produces the first paint and this produces every reorder.
 */
function byNumberDesc(
  field: "gdpCurrentUsd" | "gdpPerCapitaCurrentUsd",
): (a: CountryRow, b: CountryRow) => number {
  return (a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av !== null && bv !== null) return bv - av || a.name.localeCompare(b.name);
    if (av !== null) return -1;
    if (bv !== null) return 1;
    return a.name.localeCompare(b.name);
  };
}

/**
 * Only sorts backed by real fields. The country records carry no popularity,
 * ranking or created-at signal, so "Popular" and "Recently Added" are
 * deliberately absent rather than faked from row order.
 *
 * The two economic sorts read published World Bank indicators. Their labels
 * name the measure — GDP is not called "wealth" and GDP per capita is not
 * called "quality of life", because the source defines neither.
 */
const SORTS = {
  gdp: {
    label: "Economic size",
    compare: byNumberDesc("gdpCurrentUsd"),
  },
  "gdp-per-capita": {
    label: "GDP per capita",
    compare: byNumberDesc("gdpPerCapitaCurrentUsd"),
  },
  az: { label: "A–Z", compare: (a: CountryRow, b: CountryRow) => a.name.localeCompare(b.name) },
  "cities-desc": {
    label: "Most cities",
    compare: (a: CountryRow, b: CountryRow) =>
      b.cityCount - a.cityCount || a.name.localeCompare(b.name),
  },
} as const;

type SortKey = keyof typeof SORTS;

const SORT_KEYS = Object.keys(SORTS) as SortKey[];

/**
 * The default MUST match the server's `DEFAULT_COUNTRY_SORT`. If it did not,
 * the list would silently reorder itself on hydration and the order in the
 * served HTML would not be the order anybody sees.
 */
const DEFAULT_SORT: SortKey = "gdp";

/**
 * Compact currency for a card. Formats for READING only — every sort compares
 * the raw number, never this string.
 */
function formatUsd(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function economicLine(
  country: CountryRow,
  sort: SortKey,
  referenceYear: string,
): string {
  if (sort === "gdp-per-capita") {
    return country.gdpPerCapitaCurrentUsd === null
      ? "GDP per capita not reported by the World Bank"
      : `${formatUsd(country.gdpPerCapitaCurrentUsd)} per person · ${referenceYear}`;
  }
  if (sort === "gdp") {
    return country.gdpCurrentUsd === null
      ? "GDP not reported by the World Bank"
      : `${formatUsd(country.gdpCurrentUsd)} GDP · ${referenceYear}`;
  }
  // Under a non-economic sort the card says nothing about GDP rather than
  // repeating the region line directly above it.
  return "";
}

export function CountryDiscovery({
  countries,
  referenceYear,
}: {
  countries: CountryRow[];
  /** The one year every economic value belongs to. Shown, never implied. */
  referenceYear: string;
}) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<MacroRegion | "all">("all");
  const [sort, setSort] = useState<SortKey>(DEFAULT_SORT);
  const { cities, status, prime } = useSearchIndex();

  /**
   * SORT STATE IN THE URL — shareable, but never a second page.
   *
   * `?sort=` is read after mount and written with replaceState, so it never
   * navigates and never creates a history entry. Because this site is a static
   * export, a query string cannot produce a second document: /countries and
   * /countries?sort=az are the same file, and its <link rel="canonical"> points
   * at /countries with no query. There is exactly one indexable country
   * directory, whatever the control is set to.
   */
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("sort");
    if (requested && (SORT_KEYS as string[]).includes(requested)) {
      setSort(requested as SortKey);
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (sort === DEFAULT_SORT) {
      if (!url.searchParams.has("sort")) return;
      url.searchParams.delete("sort");
    } else {
      if (url.searchParams.get("sort") === sort) return;
      url.searchParams.set("sort", sort);
    }
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [sort]);

  const baseId = useId();
  const inputId = `${baseId}-country-search`;
  const sortId = `${baseId}-country-sort`;

  const trimmed = query.trim();

  // Region facet counts come from the same rows the grid renders, so a chip can
  // never advertise a count the grid cannot show.
  const regionCounts = useMemo(() => {
    const counts = new Map<MacroRegion | "all", number>([["all", countries.length]]);
    for (const c of countries) {
      if (!c.macroRegion) continue;
      counts.set(c.macroRegion, (counts.get(c.macroRegion) ?? 0) + 1);
    }
    return counts;
  }, [countries]);

  const visible = useMemo(() => {
    const q = fold(trimmed);
    return countries
      .filter((c) => (region === "all" ? true : c.macroRegion === region))
      .filter((c) => {
        if (!q) return true;
        if (bestRank([fold(c.name)], q) !== MatchRank.None) return true;
        return fold(c.iso2) === q;
      })
      .sort(SORTS[sort].compare);
  }, [countries, region, sort, trimmed]);

  // City hits are a secondary group so a query like "Brno" is not a dead end on
  // a countries page. Requires the lazily-fetched city index.
  const cityHits = useMemo(() => {
    if (!trimmed || status !== "ready") return [];
    return search([], cities, trimmed, { countries: 0, cities: 8 }).cities;
  }, [cities, status, trimmed]);

  return (
    <section aria-labelledby={`${baseId}-heading`} className="space-y-6">
      <h2 className="sr-only" id={`${baseId}-heading`}>
        Find a country or city
      </h2>

      <div className="rounded-2xl border border-eco-200 bg-gradient-to-b from-eco-50/70 to-white p-4 shadow-sm sm:p-6">
        <label
          className="block text-sm font-semibold text-text-primary"
          htmlFor={inputId}
        >
          Search countries or cities
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-eco-200 bg-white px-3.5 focus-within:border-eco-400 focus-within:ring-2 focus-within:ring-eco-200">
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-eco-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" strokeLinecap="round" />
          </svg>
          <input
            id={inputId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={prime}
            placeholder="Search countries or cities"
            autoComplete="off"
            spellCheck={false}
            type="search"
            className="min-h-11 flex-1 border-0 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary"
          />
          {trimmed ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2 text-xs font-medium text-text-secondary transition hover:bg-eco-50 hover:text-eco-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500"
            >
              Clear
            </button>
          ) : null}
        </div>

        {/* Region facets. Real buttons with aria-pressed, not div toggles. */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-secondary">
            Region
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {(["all", ...MACRO_REGIONS] as const).map((key) => {
              const selected = region === key;
              const count = regionCounts.get(key) ?? 0;
              if (key !== "all" && count === 0) return null;
              return (
                <li key={key}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setRegion(key)}
                    className={`inline-flex min-h-11 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500 ${
                      selected
                        ? "border-eco-500 bg-eco-500 text-white"
                        : "border-eco-200 bg-white text-text-secondary hover:border-eco-300 hover:bg-eco-50 hover:text-eco-800"
                    }`}
                  >
                    {key === "all" ? "All regions" : key}
                    <span
                      className={`text-xs font-normal ${selected ? "text-white/80" : "text-text-secondary"}`}
                    >
                      {count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label
            className="text-xs font-semibold uppercase tracking-[0.08em] text-text-secondary"
            htmlFor={sortId}
          >
            Sort
          </label>
          <select
            id={sortId}
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="min-h-11 rounded-xl border border-eco-200 bg-white px-3 py-2 text-sm text-text-primary transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500"
          >
            {Object.entries(SORTS).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
          <p aria-live="polite" className="text-sm text-text-secondary">
            {visible.length} of {countries.length} countries
            {cityHits.length ? ` · ${cityHits.length} matching cities` : ""}
          </p>
        </div>

        {/* What is driving the order, in one line, always visible. */}
        <p className="mt-3 text-xs leading-5 text-text-secondary">
          {sort === "gdp" || sort === "gdp-per-capita" ? (
            <>
              Ordered by{" "}
              <span className="font-medium text-text-primary">
                {sort === "gdp"
                  ? "nominal GDP (current US$)"
                  : "GDP per capita (current US$)"}
              </span>
              , highest first · World Bank, reference year {referenceYear} ·
              countries the World Bank does not report appear last.{" "}
              <Link className="underline decoration-eco-300 underline-offset-2" href="/methodology#country-economic-order">
                How this order is produced
              </Link>
            </>
          ) : sort === "az" ? (
            "Ordered alphabetically by country name."
          ) : (
            "Ordered by the number of indexed cities."
          )}
        </p>
      </div>

      {cityHits.length ? (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-text-secondary">
            Cities
          </h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {cityHits.map((city) => (
              <li key={city.s}>
                <Link
                  href={`/cities/${city.s}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-ecogreen-200 bg-ecogreen-50/60 px-3 py-2 text-sm text-text-primary transition hover:border-ecogreen-300 hover:bg-ecogreen-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500"
                >
                  <span className="font-medium">{city.n}</span>
                  <span className="text-xs text-text-secondary">
                    {city.d ? `${city.cn} · /${city.d}` : city.cn}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {visible.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((country) => (
            <li key={country.slug}>
              <Link
                href={`/countries/${country.slug}`}
                className="group flex h-full min-h-11 flex-col gap-2 rounded-2xl border border-eco-200 bg-white p-4 transition duration-150 hover:border-eco-300 hover:shadow-[0_10px_28px_-18px_rgba(23,32,51,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500"
              >
                <span className="flex items-center gap-2">
                  {country.flag ? (
                    <span aria-hidden="true" className="text-lg leading-none">
                      {country.flag}
                    </span>
                  ) : null}
                  <span className="font-semibold text-text-primary">
                    {country.name}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-text-secondary">
                    {country.iso2}
                  </span>
                </span>
                <span className="text-xs text-text-secondary">{country.region}</span>
                {economicLine(country, sort, referenceYear) ? (
                  <span className="text-xs text-text-secondary">
                    {economicLine(country, sort, referenceYear)}
                  </span>
                ) : null}
                <span className="mt-auto flex items-center justify-between pt-1">
                  <span className="text-sm text-text-secondary">
                    {country.cityCount === 1
                      ? "1 city"
                      : `${country.cityCount} cities`}
                  </span>
                  <span className="text-sm font-medium text-eco-700 group-hover:text-eco-800">
                    Explore cities →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-eco-200 bg-white px-4 py-10 text-center text-sm text-text-secondary">
          No countries match{trimmed ? ` “${trimmed}”` : ""}
          {region === "all" ? "" : ` in ${region}`}.{" "}
          <button
            type="button"
            className="font-medium text-eco-700 underline"
            onClick={() => {
              setQuery("");
              setRegion("all");
            }}
          >
            Reset filters
          </button>
        </p>
      )}
    </section>
  );
}
