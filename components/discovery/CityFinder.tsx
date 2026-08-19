"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CityCard } from "@/components/discovery/CityCard";
import { CompareTray } from "@/components/discovery/CompareTray";
import { FilterControls } from "@/components/discovery/FilterControls";
import { useDiscoveryIndex } from "@/components/discovery/use-discovery-index";
import {
  useCompareSelection,
  useRecentCities,
  useSavedCities,
} from "@/components/discovery/use-city-lists";
import {
  DEFAULT_SORT,
  EMPTY_FILTERS,
  SORT_OPTIONS,
  activeFilterCount,
  buildContext,
  isEmptyFilters,
  runFinder,
  type FinderFilters,
  type SortId,
} from "@/lib/discovery/filter";
import { cityRoute } from "@/lib/seo/routes";
import type { DiscoveryCity } from "@/lib/discovery/types";

/** How many results to render at once; more are revealed on demand. */
const PAGE_SIZE = 48;

type ArrayFacet = Exclude<keyof FinderFilters, "q">;

export function CityFinder() {
  // autoLoad: this component only ever renders on /explore-cities, which the
  // visitor reached in order to browse, so waiting for an interaction before
  // fetching would just add latency. No other route mounts it.
  const { index, status, retry } = useDiscoveryIndex(true);
  const [filters, setFilters] = useState<FinderFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortId>(DEFAULT_SORT);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { saved, hydrated: savedReady, toggle: toggleSave, clear: clearSaved } = useSavedCities();
  const { recent, hydrated: recentReady, clear: clearRecent } = useRecentCities();
  const compare = useCompareSelection();

  const ctx = useMemo(() => (index ? buildContext(index) : null), [index]);
  const byslug = useMemo(() => {
    const map = new Map<string, DiscoveryCity>();
    if (index) for (const city of index.cities) map.set(city.s, city);
    return map;
  }, [index]);

  const results = useMemo(() => {
    if (!index || !ctx) return [];
    return runFinder(index, filters, sort, ctx);
  }, [index, ctx, filters, sort]);

  // A changed query or facet should show the top of the new result set, not
  // keep the visitor's previous scroll depth into a different list.
  useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [filters, sort]);

  const toggleArray = useCallback((facet: ArrayFacet, value: string) => {
    setFilters((prev) => {
      const current = prev[facet] as string[];
      return {
        ...prev,
        [facet]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  }, []);

  const clearAll = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const countryName = useCallback(
    (city: DiscoveryCity) => index?.countries[city.c]?.n ?? "",
    [index],
  );
  const nameOf = useCallback(
    (slug: string) => byslug.get(slug)?.n ?? slug,
    [byslug],
  );

  const activeCount = activeFilterCount(filters);
  const visible = results.slice(0, limit);

  if (status === "error") {
    return (
      <div className="rounded-xl border border-neutral-border bg-white p-6">
        <h2 className="text-base font-semibold text-text-primary">
          The city index could not be loaded
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          The Finder needs a one-off data file that did not download. Every city
          page remains available through{" "}
          <Link className="underline decoration-brand-500" href="/cities">
            the city directory
          </Link>
          .
        </p>
        <button
          className="mt-4 inline-flex min-h-[44px] items-center rounded-lg bg-brand-navy px-4 text-sm font-semibold text-white hover:bg-brand-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          onClick={retry}
          type="button"
        >
          Try again
        </button>
      </div>
    );
  }

  if (status !== "ready" || !index || !ctx) {
    return (
      <div
        aria-busy="true"
        aria-live="polite"
        className="rounded-xl border border-neutral-border bg-white p-6 text-sm text-text-secondary"
      >
        Loading city data…
      </div>
    );
  }

  const savedCities = saved
    .map((slug) => byslug.get(slug))
    .filter((c): c is DiscoveryCity => c !== undefined);
  const recentCities = recent
    .map((entry) => byslug.get(entry.slug))
    .filter((c): c is DiscoveryCity => c !== undefined);

  const filterPanel = (
    <FilterControls filters={filters} index={index} onToggleArray={toggleArray} />
  );

  return (
    <div className={compare.selected.length > 0 ? "pb-24" : undefined}>
      {/* Saved + recently viewed: separate concepts, deliberately not merged.
          Saved is an intentional shortlist; recent is navigation history. */}
      {savedReady && savedCities.length > 0 ? (
        <ShortlistRow
          action={{ label: "Clear saved", onClick: clearSaved }}
          cities={savedCities}
          countryName={countryName}
          description="Cities you saved. Stored only in this browser."
          title="Saved cities"
        />
      ) : null}
      {recentReady && recentCities.length > 0 ? (
        <ShortlistRow
          action={{ label: "Clear history", onClick: clearRecent }}
          cities={recentCities}
          countryName={countryName}
          description="Cities you opened recently, newest first. Stored only in this browser."
          title="Recently viewed"
        />
      ) : null}

      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-8">
        {/* Desktop: persistent sidebar. Mobile: a bottom-sheet drawer, so the
            filter set never becomes a wall of controls above the results. */}
        <aside className="hidden lg:block">
          <h2 className="text-sm font-semibold text-text-primary">Filters</h2>
          <div className="mt-4">{filterPanel}</div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col gap-3 rounded-xl border border-neutral-border bg-white p-3 sm:flex-row sm:items-center">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Search cities by name or country</span>
              <input
                className="min-h-[44px] w-full rounded-lg border border-neutral-border px-3 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-brand-500"
                onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
                placeholder="Search city or country"
                type="search"
                value={filters.q}
              />
            </label>
            <label className="shrink-0">
              <span className="sr-only">Sort results</span>
              <select
                className="min-h-[44px] w-full rounded-lg border border-neutral-border bg-white px-3 text-sm text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-brand-500 sm:w-auto"
                onChange={(e) => setSort(e.target.value as SortId)}
                value={sort}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              aria-expanded={drawerOpen}
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-lg border border-neutral-border px-3 text-sm font-medium text-text-primary lg:hidden"
              onClick={() => setDrawerOpen(true)}
              type="button"
            >
              Filters
              {activeCount > 0 ? (
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
                  {activeCount}
                </span>
              ) : null}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {/* Truthful, pre-truncation count. */}
            <p aria-live="polite" className="text-sm text-text-secondary">
              <strong className="font-semibold text-text-primary">
                {results.length.toLocaleString("en-US")}
              </strong>{" "}
              {results.length === 1 ? "city" : "cities"}
              {isEmptyFilters(filters)
                ? ""
                : results.length === 1
                  ? " matches your filters"
                  : " match your filters"}
              {visible.length < results.length
                ? ` — showing first ${visible.length.toLocaleString("en-US")}`
                : ""}
            </p>
            {activeCount > 0 ? (
              <button
                className="text-sm font-medium text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                onClick={clearAll}
                type="button"
              >
                Clear all filters
              </button>
            ) : null}
          </div>

          {results.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-neutral-line bg-surface-soft p-8 text-center">
              <p className="text-sm font-medium text-text-primary">
                No cities match every filter
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
                Filters combine, so each one you add narrows the result further.
                Cities with no published value for a filtered dimension are
                excluded from that filter rather than assumed to pass.
              </p>
              <button
                className="mt-4 inline-flex min-h-[44px] items-center rounded-lg border border-neutral-border px-4 text-sm font-medium text-text-primary hover:border-neutral-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                onClick={clearAll}
                type="button"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((city) => (
                  <CityCard
                    city={city}
                    compareDisabled={compare.full}
                    compared={compare.selected.includes(city.s)}
                    countryName={countryName(city)}
                    key={city.s}
                    onToggleCompare={compare.toggle}
                    onToggleSave={toggleSave}
                    saved={saved.includes(city.s)}
                    zone={index.zones[city.z]}
                  />
                ))}
              </ul>
              {visible.length < results.length ? (
                <button
                  className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-neutral-border bg-white px-4 text-sm font-semibold text-text-primary hover:border-neutral-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                  onClick={() => setLimit((l) => l + PAGE_SIZE)}
                  type="button"
                >
                  Show more cities
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>

      {drawerOpen ? (
        <FilterDrawer
          activeCount={activeCount}
          onClear={clearAll}
          onClose={() => setDrawerOpen(false)}
          resultCount={results.length}
        >
          {filterPanel}
        </FilterDrawer>
      ) : null}

      <CompareTray
        nameOf={nameOf}
        onClear={compare.clear}
        onRemove={compare.remove}
        selected={compare.selected}
      />
    </div>
  );
}

function ShortlistRow({
  title,
  description,
  cities,
  countryName,
  action,
}: {
  title: string;
  description: string;
  cities: DiscoveryCity[];
  countryName: (city: DiscoveryCity) => string;
  action: { label: string; onClick: () => void };
}) {
  return (
    <section className="mb-6 rounded-xl border border-neutral-border bg-surface-soft p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        <button
          className="text-xs font-medium text-text-secondary underline underline-offset-2 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          onClick={action.onClick}
          type="button"
        >
          {action.label}
        </button>
      </div>
      <p className="mt-1 text-xs text-text-muted">{description}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {cities.map((city) => (
          <li key={city.s}>
            <Link
              className="inline-flex min-h-[36px] items-center rounded-full border border-neutral-border bg-white px-3 text-sm text-text-primary transition-colors hover:border-brand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              href={cityRoute(city.s)}
            >
              {city.n}
              <span className="ml-1.5 text-text-muted">{countryName(city)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FilterDrawer({
  children,
  onClose,
  onClear,
  activeCount,
  resultCount,
}: {
  children: React.ReactNode;
  onClose: () => void;
  onClear: () => void;
  activeCount: number;
  resultCount: number;
}) {
  // Escape closes, and the background does not scroll behind the sheet.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        aria-label="Close filters"
        className="absolute inset-0 bg-brand-navy/40"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <div
        aria-label="Filters"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-white"
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-neutral-border px-4 py-3">
          <h2 className="text-base font-semibold text-text-primary">Filters</h2>
          <button
            className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">{children}</div>
        <div className="flex items-center gap-3 border-t border-neutral-border px-4 py-3">
          {activeCount > 0 ? (
            <button
              className="inline-flex min-h-[44px] items-center rounded-lg border border-neutral-border px-4 text-sm font-medium text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              onClick={onClear}
              type="button"
            >
              Clear all
            </button>
          ) : null}
          <button
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            onClick={onClose}
            type="button"
          >
            Show {resultCount.toLocaleString("en-US")}{" "}
            {resultCount === 1 ? "city" : "cities"}
          </button>
        </div>
      </div>
    </div>
  );
}
