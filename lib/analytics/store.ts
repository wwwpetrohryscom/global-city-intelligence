"use client";

import {
  PRIVACY_PREFERENCES_KEY,
  type AnalyticsAuthorisation,
  type AnalyticsChoice,
  type PrivacyPreferences,
  analyticsAuthorisation,
  browserRefusesTracking,
  parsePreferences,
  preferencesFor,
} from "@/lib/analytics/preferences";
import { withdrawInCurrentDocument } from "@/lib/analytics/tracker";

/**
 * THE PREFERENCE STORE — one subscription, one source of truth.
 *
 * `useSyncExternalStore` with an explicit server snapshot, because this is
 * read during hydration on a statically exported site: the server has no
 * browser and must render the UNDECIDED state, or React will hydrate a page
 * that disagrees with the DOM it was given.
 *
 * It also listens for `storage`, so a decision made in another tab — or on
 * GCI Places, which is the same origin behind a proxy rewrite — reaches this
 * one without a reload. That is the whole point of sharing a key.
 */

export interface PrivacyState {
  ready: boolean;
  preferences: PrivacyPreferences | null;
  authorisation: AnalyticsAuthorisation;
  refusesTracking: boolean;
  /** False when storage refuses writes, so the UI can say so rather than lie. */
  writable: boolean;
}

const SERVER_STATE: PrivacyState = {
  ready: false,
  preferences: null,
  authorisation: { authorised: false, reason: "unavailable" },
  refusesTracking: false,
  writable: false,
};

let snapshot: PrivacyState = SERVER_STATE;
let cachedRaw: string | null | undefined;
const listeners = new Set<() => void>();

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function compute(): PrivacyState {
  const store = storage();
  if (!store) {
    return { ...SERVER_STATE, ready: true };
  }
  let raw: string | null = null;
  try {
    raw = store.getItem(PRIVACY_PREFERENCES_KEY);
  } catch {
    return { ...SERVER_STATE, ready: true };
  }
  const preferences = parsePreferences(raw);
  const refusesTracking = browserRefusesTracking();
  return {
    ready: true,
    preferences,
    authorisation: analyticsAuthorisation(preferences, { refusesTracking }),
    refusesTracking,
    writable: true,
  };
}

function refresh(): void {
  snapshot = compute();
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) {
    refresh();
    if (typeof window !== "undefined") {
      window.addEventListener("storage", onStorage);
    }
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function onStorage(event: StorageEvent): void {
  if (event.key !== null && event.key !== PRIVACY_PREFERENCES_KEY) return;
  refresh();
}

export function getSnapshot(): PrivacyState {
  const store = storage();
  if (store) {
    /* Cheap freshness check: re-derive only when the stored bytes changed. */
    let raw: string | null = null;
    try {
      raw = store.getItem(PRIVACY_PREFERENCES_KEY);
    } catch {
      raw = null;
    }
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      snapshot = compute();
    }
  }
  return snapshot;
}

export function getServerSnapshot(): PrivacyState {
  return SERVER_STATE;
}

function write(choice: AnalyticsChoice): boolean {
  const store = storage();
  if (!store) return false;
  try {
    store.setItem(PRIVACY_PREFERENCES_KEY, JSON.stringify(preferencesFor(choice)));
  } catch {
    return false;
  }
  cachedRaw = undefined;
  refresh();
  return true;
}

export function allowAnalytics(): boolean {
  return write("granted");
}

export function denyAnalytics(): boolean {
  return write("denied");
}

export interface WithdrawalOutcome {
  refused: boolean;
  identifierRemoved: boolean;
  /** A reload was required to terminate a running tracker, and was performed. */
  reloadRequiredForActiveTrackerWithdrawal: boolean;
}

/**
 * WITHDRAWAL, and the reload is part of it rather than a suggestion afterwards.
 *
 * The refusal is recorded FIRST, so nothing can re-create the identifier
 * between deleting it and the decision taking effect. Recording a refusal
 * rather than deleting the preference is deliberate: an absent preference
 * means "not asked", and somebody who has just withdrawn has been asked —
 * deleting it would put the prompt back in front of them.
 *
 * Then the reload, when the provider is actually running. A runtime probe
 * settled that this is required and not optional: removing the <script>
 * element leaves `window.WebmasterID` and `__webmasteridTrackerInitialized`
 * alive, and deleting `wmid:av:v1` is undone by the next event. Reporting that
 * and stopping would mean withdrawal did not take effect until the reader
 * happened to navigate — leaving the provider running for exactly as long as
 * they took to press a second button.
 *
 * By the time the page returns the stored preference already says no, so the
 * loader never inserts the script and there is nothing to loop on. A reader
 * who declines before anything loaded gets no reload: there is nothing to
 * terminate, and a page jumping under them would be unexplained.
 *
 * The reload is INJECTED so the conformance gate can assert it happened
 * exactly once, without a browser.
 */
export function withdrawAnalyticsCompletely(
  reload: () => void = () => {
    if (typeof window !== "undefined") window.location.reload();
  },
): WithdrawalOutcome {
  const refused = write("denied");
  const { identifierRemoved, reloadRequiredForActiveTrackerWithdrawal } = withdrawInCurrentDocument();
  if (refused && reloadRequiredForActiveTrackerWithdrawal) reload();
  return { refused, identifierRemoved, reloadRequiredForActiveTrackerWithdrawal };
}
