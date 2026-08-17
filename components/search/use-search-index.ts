"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SEARCH_INDEX_CITIES_PATH,
  SEARCH_INDEX_COUNTRIES_PATH,
  type CityIndexRecord,
  type CitySearchIndex,
  type CountryIndexRecord,
  type CountrySearchIndex,
} from "@/lib/search/types";

/**
 * Lazily loads the generated search indexes.
 *
 * The indexes are plain static JSON emitted at build time, so this is a single
 * cacheable GET against the CDN — no API route and no search service. Loading
 * is deferred until the visitor actually engages with search, which keeps the
 * city index off the critical path of every page that merely renders the
 * search affordance.
 *
 * Module-level caches (not component state) so opening search a second time,
 * or mounting two search surfaces on one page, never refetches.
 */

type Loaded = {
  countries: CountryIndexRecord[];
  cities: CityIndexRecord[];
};

let cache: Loaded | null = null;
let inflight: Promise<Loaded> | null = null;

async function loadIndexes(): Promise<Loaded> {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    // Both indexes are fetched in parallel — no waterfall.
    const [countriesRes, citiesRes] = await Promise.all([
      fetch(SEARCH_INDEX_COUNTRIES_PATH),
      fetch(SEARCH_INDEX_CITIES_PATH),
    ]);
    if (!countriesRes.ok || !citiesRes.ok) {
      throw new Error(
        `search index unavailable (${countriesRes.status}/${citiesRes.status})`,
      );
    }
    const countryIndex = (await countriesRes.json()) as CountrySearchIndex;
    const cityIndex = (await citiesRes.json()) as CitySearchIndex;
    cache = {
      countries: countryIndex.countries ?? [],
      cities: cityIndex.cities ?? [],
    };
    return cache;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export type SearchIndexState = {
  countries: CountryIndexRecord[];
  cities: CityIndexRecord[];
  status: "idle" | "loading" | "ready" | "error";
  /** Call to begin loading — safe to call repeatedly. */
  prime: () => void;
};

export function useSearchIndex(): SearchIndexState {
  const [state, setState] = useState<Omit<SearchIndexState, "prime">>(() =>
    cache
      ? { countries: cache.countries, cities: cache.cities, status: "ready" }
      : { countries: [], cities: [], status: "idle" },
  );
  // Guards against setState after unmount when a slow fetch resolves late.
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const prime = useCallback(() => {
    if (cache) {
      setState({
        countries: cache.countries,
        cities: cache.cities,
        status: "ready",
      });
      return;
    }
    setState((prev) => (prev.status === "idle" ? { ...prev, status: "loading" } : prev));
    loadIndexes()
      .then((loaded) => {
        if (!alive.current) return;
        setState({
          countries: loaded.countries,
          cities: loaded.cities,
          status: "ready",
        });
      })
      .catch(() => {
        if (!alive.current) return;
        setState((prev) => ({ ...prev, status: "error" }));
      });
  }, []);

  return { ...state, prime };
}
