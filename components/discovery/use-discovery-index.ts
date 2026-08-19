"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DISCOVERY_INDEX_PATH,
  DISCOVERY_INDEX_VERSION,
  type DiscoveryIndex,
} from "@/lib/discovery/types";

/**
 * Lazily loads the generated city-discovery index.
 *
 * Same contract as `components/search/use-search-index.ts`: a single cacheable
 * GET for a build-time static JSON file, module-level caching so a remount
 * never refetches, and no load at all until a consumer calls `prime()`. The
 * index is therefore absent from every page that does not render the Finder.
 */

let cache: DiscoveryIndex | null = null;
let inflight: Promise<DiscoveryIndex> | null = null;

async function loadIndex(): Promise<DiscoveryIndex> {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    const res = await fetch(DISCOVERY_INDEX_PATH);
    if (!res.ok) {
      throw new Error(`discovery index unavailable (${res.status})`);
    }
    const parsed = (await res.json()) as DiscoveryIndex;
    if (
      !parsed ||
      !Array.isArray(parsed.cities) ||
      !Array.isArray(parsed.countries) ||
      parsed.version !== DISCOVERY_INDEX_VERSION
    ) {
      // A cached index from an older deploy would be silently wrong rather
      // than obviously broken, so shape/version is checked before use.
      throw new Error("discovery index has an unexpected shape or version");
    }
    cache = parsed;
    return cache;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export type DiscoveryIndexState = {
  index: DiscoveryIndex | null;
  status: "idle" | "loading" | "ready" | "error";
  prime: () => void;
  retry: () => void;
};

export function useDiscoveryIndex(autoLoad = false): DiscoveryIndexState {
  const [state, setState] = useState<{
    index: DiscoveryIndex | null;
    status: DiscoveryIndexState["status"];
  }>(() => (cache ? { index: cache, status: "ready" } : { index: null, status: "idle" }));

  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const start = useCallback(() => {
    if (cache) {
      setState({ index: cache, status: "ready" });
      return;
    }
    setState((prev) => (prev.status === "loading" ? prev : { ...prev, status: "loading" }));
    loadIndex()
      .then((index) => {
        if (!alive.current) return;
        setState({ index, status: "ready" });
      })
      .catch(() => {
        if (!alive.current) return;
        setState((prev) => ({ ...prev, status: "error" }));
      });
  }, []);

  const prime = useCallback(() => {
    setState((prev) => {
      if (prev.status === "idle") {
        // Defer the actual fetch out of the setState updater.
        queueMicrotask(start);
        return { ...prev, status: "loading" };
      }
      return prev;
    });
  }, [start]);

  useEffect(() => {
    if (autoLoad) prime();
  }, [autoLoad, prime]);

  return { ...state, prime, retry: start };
}
