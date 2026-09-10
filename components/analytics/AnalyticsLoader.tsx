"use client";

import { useEffect } from "react";

import { loadTracker } from "@/lib/analytics/tracker";
import { useAnalyticsAuthorised } from "@/lib/analytics/use-privacy";

/**
 * THE ONE PLACE THE TRACKER CAN ENTER A MAIN-SITE PAGE.
 *
 * Rendered once, in the root layout, and rendering nothing. Its whole job is
 * to ask `loadTracker()` after a decision has been read from this browser —
 * never during the static build, where there is no decision to read and where
 * anything it produced would be baked into 84,836 pages.
 *
 * It re-asks when the answer changes, so a reader who grants gets measurement
 * from that moment rather than from their next navigation — including when the
 * grant was made on GCI Places, which shares this origin and this key and
 * reaches us through a `storage` event.
 *
 * It cannot double-insert: `loadTracker` holds a module latch AND checks the
 * document, which between them survive Strict Mode's deliberate double effect,
 * a fast double render, and this component being mounted twice by a future
 * refactor.
 */
export function AnalyticsLoader(): null {
  const authorised = useAnalyticsAuthorised();

  useEffect(() => {
    if (!authorised) return;
    loadTracker();
  }, [authorised]);

  return null;
}
