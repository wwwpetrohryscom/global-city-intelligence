"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { filterCities } from "@/lib/search/query";

/**
 * Searchable city directory for a country page.
 *
 * Operates purely on the cities passed in by the server page — one country's
 * worth, typically a handful to a few dozen — so it needs no fetch, no global
 * index and no `lib/data` import. Pre-rendered to HTML by Next, so every city
 * link is crawlable; filtering only narrows an already-complete list.
 */

export interface DirectoryCity {
  slug: string;
  name: string;
  /** Fine-grained subnational/region label already present on the city record. */
  region: string;
}

export function CityDirectory({
  cities,
  countryName,
}: {
  cities: DirectoryCity[];
  countryName: string;
}) {
  const [query, setQuery] = useState("");
  const baseId = useId();
  const inputId = `${baseId}-city-search`;

  const sorted = useMemo(
    () => cities.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [cities],
  );

  /**
   * The per-row region label is only worth its visual weight when it actually
   * distinguishes rows. For 57 of the 105 countries every city shares one
   * region value (all Japanese cities read "East Asia"), so repeating it down
   * the list is pure noise. For the other 48 it carries real subnational
   * detail — Oregon vs California, Bavaria vs Saxony, Wales vs Cornwall — and
   * those are precisely the large countries this directory exists for, so the
   * label stays there.
   */
  const regionIsDifferentiating = useMemo(
    () => new Set(sorted.map((city) => city.region)).size > 1,
    [sorted],
  );
  const visible = useMemo(() => filterCities(sorted, query), [sorted, query]);
  const trimmed = query.trim();

  // Below a handful of cities a search box is friction, not help — the whole
  // list already fits on one screen.
  const showSearch = sorted.length >= 8;

  return (
    <div className="space-y-4">
      {showSearch ? (
        <div>
          <label
            className="block text-sm font-semibold text-text-primary"
            htmlFor={inputId}
          >
            {`Search cities in ${countryName}`}
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
              placeholder={`Search cities in ${countryName}`}
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
          <p aria-live="polite" className="mt-2 text-sm text-text-secondary">
            {trimmed
              ? `${visible.length} of ${sorted.length} cities match “${trimmed}”`
              : `${sorted.length} ${sorted.length === 1 ? "city" : "cities"}, A–Z`}
          </p>
        </div>
      ) : (
        <p className="text-sm text-text-secondary">
          {sorted.length} {sorted.length === 1 ? "city" : "cities"}, A–Z
        </p>
      )}

      {visible.length ? (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((city) => (
            <li key={city.slug}>
              <Link
                href={`/cities/${city.slug}`}
                className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-eco-200 bg-white px-3.5 py-2.5 text-sm transition duration-150 hover:border-eco-300 hover:bg-eco-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500"
              >
                <span className="truncate font-medium text-text-primary">
                  {city.name}
                </span>
                {regionIsDifferentiating ? (
                  <span className="shrink-0 text-xs text-text-secondary">
                    {city.region}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-eco-200 bg-white px-4 py-8 text-center text-sm text-text-secondary">
          No cities in {countryName} match “{trimmed}”.{" "}
          <button
            type="button"
            className="font-medium text-eco-700 underline"
            onClick={() => setQuery("")}
          >
            Clear search
          </button>
        </p>
      )}
    </div>
  );
}
