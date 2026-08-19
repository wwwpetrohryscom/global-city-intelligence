"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MAX_COMPARE,
  RECENT_CITIES_KEY,
  SAVED_CITIES_KEY,
  clearKey,
  pushRecent,
  readRecent,
  readSaved,
  writeSaved,
  type RecentEntry,
} from "@/lib/discovery/storage";

/**
 * Saved Cities + Recently Viewed, backed by localStorage.
 *
 * HYDRATION: both hooks deliberately start from the empty state and load in an
 * effect. Reading localStorage during render would produce server HTML (always
 * empty, since the site is statically exported) that disagrees with the first
 * client render, which is a hydration error. The brief cost is one frame where
 * the lists are empty; `hydrated` lets callers hold back UI until then instead
 * of flashing an incorrect "nothing saved" message.
 *
 * CROSS-TAB: the `storage` event fires only in OTHER tabs, so mirroring it is
 * enough to keep two open tabs consistent — a few lines, no polling, no
 * broadcast channel.
 */

export function useSavedCities() {
  const [saved, setSaved] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSaved(readSaved());
    setHydrated(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === SAVED_CITIES_KEY || event.key === null) {
        setSaved(readSaved());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((slug: string) => {
    setSaved((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      writeSaved(next);
      return next;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setSaved((prev) => {
      const next = prev.filter((s) => s !== slug);
      writeSaved(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    clearKey(SAVED_CITIES_KEY);
    setSaved([]);
  }, []);

  return { saved, hydrated, toggle, remove, clear };
}

export function useRecentCities() {
  const [recent, setRecent] = useState<RecentEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRecent(readRecent());
    setHydrated(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === RECENT_CITIES_KEY || event.key === null) {
        setRecent(readRecent());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const clear = useCallback(() => {
    clearKey(RECENT_CITIES_KEY);
    setRecent([]);
  }, []);

  return { recent, hydrated, clear };
}

/**
 * Records a city visit exactly once per mount.
 *
 * Mounted by the city-page navigation so that /cities/tokyo,
 * /cities/tokyo/climate and /safety/tokyo all record the single identity
 * "tokyo" rather than three separate history entries.
 */
export function useRecordVisit(slug: string) {
  useEffect(() => {
    if (!slug) return;
    pushRecent(slug, Date.now());
  }, [slug]);
}

/**
 * Compare selection. Session-scoped React state rather than localStorage: a
 * comparison is a transient act, and a tray silently repopulating with
 * yesterday's cities on a fresh visit would be surprising. Shareability is
 * handled by the URL instead (see /compare-cities).
 */
export function useCompareSelection(initial: string[] = []) {
  const [selected, setSelected] = useState<string[]>(initial);

  const toggle = useCallback((slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setSelected((prev) => prev.filter((s) => s !== slug));
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  return { selected, toggle, remove, clear, full: selected.length >= MAX_COMPARE };
}
