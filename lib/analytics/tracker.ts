"use client";

import { PROVIDER_ANALYTICS_ID_KEY, storedAnalyticsAuthorisation } from "@/lib/analytics/preferences";

/**
 * THE MAIN SITE'S TRACKER LOADER — the only route by which a third-party
 * script may now reach a page on www.globalcityintelligence.com.
 *
 * WHAT IT REPLACES. Until Phase 9.3A the tracker was a `<Script>` in
 * `app/layout.tsx` with `strategy="afterInteractive"`. That did two things
 * nobody had agreed to: it baked the tag into all 84,836 static pages, and it
 * emitted a `<link rel="preload">`, so a browser fetched webmasterid.com
 * before any code had considered a preference. The provider then minted
 * `wmid:av:v1` and sent a page view on initialisation.
 *
 * The provider does honour Do Not Track and Global Privacy Control — its
 * minified source guards three initialisation functions on exactly that test —
 * but only AFTER the script has been requested. A request to a third party is
 * itself the thing consent is about, so honouring a signal afterwards is too
 * late to be the mechanism.
 *
 * Hence: no tag in the static output, no next/script, no preload, no prefetch.
 * The element is constructed at runtime, after somebody has said yes, and if
 * nobody has then nothing about the page mentions the provider at all.
 */

/* ------------------------------------------------------------------ *
 * THE EXISTING, VERIFIED CONFIGURATION — preserved exactly.
 *
 * Same property as before this change and the same one GCI Places uses. A
 * second site id would split one reader across two properties and mint a
 * second identifier for the same person; rotating it would silently orphan
 * every measurement taken so far.
 * ------------------------------------------------------------------ */

export const TRACKER_SRC = "https://webmasterid.com/tracker.iife.min.js";
export const TRACKER_SITE_ID = "wm_hmlk0yl01zarz1cc";
export const TRACKER_ENDPOINT = "https://webmasterid-ingest-api.vercel.app/api/events";
export const TRACKER_ORIGIN = "https://webmasterid.com";
export const TRACKER_ELEMENT_ID = "webmasterid-tracker";

/**
 * WHERE REAL MEASUREMENT MAY HAPPEN.
 *
 * The canonical product only. A draft deploy, the Netlify origin and localhost
 * must not put test traffic into a production metric — and the origin is also
 * where a crawler can reach the site, where an event would be a robot's.
 *
 * An EQUALITY, deliberately. `endsWith` would accept
 * evil-www.globalcityintelligence.com, which anybody can register; a poison
 * case in the Places repository widened this and passed every probe in the
 * list until a hostname that actually satisfies the suffix was added.
 */
export const MEASURED_HOST = "www.globalcityintelligence.com";

export function isMeasuredHost(hostname?: string): boolean {
  const host = hostname ?? (typeof window === "undefined" ? "" : window.location.hostname);
  return host === MEASURED_HOST;
}

/* ------------------------------------------------------------------ *
 * THE DECISION.
 * ------------------------------------------------------------------ */

export type TrackerRefusal = "wrong-host" | "not-authorised" | "already-loaded" | "no-document";

export type TrackerDecision = { load: true } | { load: false; reason: TrackerRefusal };

export interface TrackerConditions {
  /** The page is being served from the canonical production host. */
  canonicalHost: boolean;
  /** The reader has said yes, and no browser signal overrides it. */
  authorised: boolean;
  /** The script is already on the page. */
  alreadyLoaded: boolean;
}

/**
 * MAY THE TRACKER LOAD? A pure function, so the answer is assertable without a
 * browser, a network or a build.
 *
 * The host is checked before the reader's decision so that a draft deploy
 * refuses before consulting anything personal, and `already-loaded` comes last
 * because it is a fact about the page rather than a permission.
 */
export function trackerDecision(conditions: TrackerConditions): TrackerDecision {
  if (!conditions.canonicalHost) return { load: false, reason: "wrong-host" };
  if (!conditions.authorised) return { load: false, reason: "not-authorised" };
  if (conditions.alreadyLoaded) return { load: false, reason: "already-loaded" };
  return { load: true };
}

export function currentConditions(): TrackerConditions {
  const hasDocument = typeof document !== "undefined";
  return {
    canonicalHost: isMeasuredHost(),
    authorised: storedAnalyticsAuthorisation().authorised,
    alreadyLoaded: hasDocument && document.getElementById(TRACKER_ELEMENT_ID) !== null,
  };
}

/* ------------------------------------------------------------------ *
 * INSERTION.
 * ------------------------------------------------------------------ */

/**
 * A module latch as well as the DOM check.
 *
 * The DOM check answers "is the element there"; this answers "did we already
 * decide to put it there". Both are needed: an effect can run twice before the
 * browser has appended anything — Strict Mode does exactly that, and a fast
 * double render can do it anywhere — so two calls could both observe an empty
 * document and both insert.
 */
let inserted = false;

/** Test seam. Resets the latch — never called by product code. */
export function __resetTrackerLatch(): void {
  inserted = false;
}

export type TrackerOutcome = "loaded" | TrackerRefusal;

export function loadTracker(conditions: TrackerConditions = currentConditions()): TrackerOutcome {
  if (typeof document === "undefined") return "no-document";
  if (inserted) return "already-loaded";

  const decision = trackerDecision(conditions);
  if (!decision.load) return decision.reason;

  const script = document.createElement("script");
  script.id = TRACKER_ELEMENT_ID;
  script.src = TRACKER_SRC;
  script.defer = true;
  script.setAttribute("data-wmid", TRACKER_SITE_ID);
  script.setAttribute("data-endpoint", TRACKER_ENDPOINT);

  inserted = true;
  try {
    document.body.appendChild(script);
  } catch {
    /* Measurement is observational. A page that cannot load it still works. */
    inserted = false;
    return "no-document";
  }
  return "loaded";
}

/* ------------------------------------------------------------------ *
 * WITHDRAWAL.
 * ------------------------------------------------------------------ */

/**
 * Remove the provider's identifier from this browser.
 *
 * Deleting `wmid:av:v1` works, but on its own it is not withdrawal: any later
 * tracker event regenerates it with a fresh value. The other half is that the
 * script must stop being inserted, which the authorisation gate guarantees for
 * every future page load. Both halves, or neither.
 *
 * ONLY that key. A withdrawal that reached into other storage would be taking
 * something the reader did not offer.
 */
export function removeTrackerIdentifier(): boolean {
  try {
    if (typeof window === "undefined") return false;
    window.localStorage.removeItem(PROVIDER_ANALYTICS_ID_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * IS THE PROVIDER RUNNING IN THIS DOCUMENT RIGHT NOW?
 *
 * Three signals, because a DOM-only check is the most fragile of them. A
 * runtime probe of the real script established why: the provider installs
 * `__webmasteridTrackerInitialized` and a `WebmasterID` object, and REMOVING
 * THE SCRIPT ELEMENT LEAVES BOTH ALIVE. An absent element proves nothing;
 * either global proves the code is still there.
 *
 * The module latch is included too, for the window between appending the
 * element and the provider finishing its own initialisation.
 */
export function trackerIsLive(): boolean {
  if (inserted) return true;
  if (typeof window !== "undefined") {
    const global = window as unknown as Record<string, unknown>;
    if (global.__webmasteridTrackerInitialized === true) return true;
    if (global.WebmasterID !== undefined) return true;
  }
  if (typeof document === "undefined") return false;
  return document.getElementById(TRACKER_ELEMENT_ID) !== null;
}

export interface WithdrawalResult {
  identifierRemoved: boolean;
  /**
   * TRUE WHEN A RELOAD IS REQUIRED TO FINISH WITHDRAWING — not suggested,
   * required, and the name says so because the previous one did not.
   *
   * A runtime probe of the real provider settled this. Loading it writes
   * `wmid:av:v1`, sets `__webmasteridTrackerInitialized` and installs a
   * `WebmasterID` object. Then: removing the <script> element removes the TAG
   * and nothing else, both globals survive; deleting `wmid:av:v1` works, but
   * the API is still installed and a later event REGENERATED the identifier
   * with a fresh value; and only a reload returns the document to a state with
   * no globals, no tag and no identifier.
   *
   * There is no documented teardown, and patching somebody else's minified
   * globals would be guesswork. Reload is the clean boundary, so withdrawal
   * performs it rather than describing it.
   */
  reloadRequiredForActiveTrackerWithdrawal: boolean;
}

export function withdrawInCurrentDocument(): WithdrawalResult {
  const wasLive =
    trackerIsLive() ||
    (typeof window !== "undefined" &&
      (window as unknown as Record<string, unknown>).__webmasteridTrackerInitialized === true);
  if (typeof document !== "undefined") {
    document.getElementById(TRACKER_ELEMENT_ID)?.remove();
  }
  inserted = false;
  const identifierRemoved = removeTrackerIdentifier();
  return { identifierRemoved, reloadRequiredForActiveTrackerWithdrawal: wasLive };
}
