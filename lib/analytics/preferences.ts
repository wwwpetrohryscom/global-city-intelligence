/**
 * ANALYTICS PREFERENCES — the main site's half of ONE decision.
 *
 * WHY THIS FILE EXISTS, AND WHY IT IS NOT A SECOND CONSENT SYSTEM.
 *
 * GCI Places shipped a global opt-in architecture in Phase 9.3: nothing is
 * measured until a reader says yes, a browser signal outranks a stored yes,
 * and silence is a no. The main site was running the SAME tracker — same
 * script, same site id `wm_hmlk0yl01zarz1cc`, same durable `wmid:av:v1` — with
 * no consent mechanism at all, loaded unconditionally from the layout and
 * preloaded before anything had decided anything.
 *
 * That was one policy describing two opposite postures, and the legal analysis
 * behind the opt-in decision (docs/ANALYTICS_CONSENT_DECISION.md in the Places
 * repository) was never about a product — it was about this identifier.
 *
 * Main and canonical Places are THE SAME ORIGIN. `/places/*` is a Netlify
 * rewrite, not a redirect, so both run on www.globalcityintelligence.com and
 * share first-party storage. That is what makes this one decision rather than
 * two: a reader who answers on either has answered for both, and this file
 * reads and writes the key Places already owns.
 *
 * THE SEMANTICS ARE NOT ALLOWED TO DRIFT from the Places implementation. They
 * are pinned as an executable table in `conformance.ts`, which
 * `scripts/validate-analytics-consent.mjs` runs against these functions — so a
 * change here that diverges fails a gate rather than producing two products
 * that quietly disagree about what somebody consented to.
 */

/**
 * The shared preference key. Owned by Places, read and written by both.
 *
 * NOT a main-site variant. `gci.main.privacy` or an analytics cookie would
 * recreate the split this file exists to close, and would ask somebody who has
 * already answered to answer again.
 */
export const PRIVACY_PREFERENCES_KEY = "gci.privacy.v1";

export const PRIVACY_PREFERENCES_VERSION = 1;

/** The provider's durable identifier. Removed on withdrawal; never written here. */
export const PROVIDER_ANALYTICS_ID_KEY = "wmid:av:v1";

/** The only two things a person can have decided. Absence is a third state. */
export type AnalyticsChoice = "granted" | "denied";

export interface PrivacyPreferences {
  version: typeof PRIVACY_PREFERENCES_VERSION;
  analytics: AnalyticsChoice;
  /** When the choice was made. Never leaves the device. */
  decidedAt: string;
}

/**
 * WHY measurement is or is not authorised — a reason, not a boolean, because
 * the interface says something different in each case and because a test that
 * can only see `false` cannot tell a respected browser signal from a bug.
 */
export type AnalyticsAuthorisation =
  | { authorised: true }
  | {
      authorised: false;
      reason: "browser-signal" | "undecided" | "denied" | "unavailable";
    };

const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T/;

/**
 * Parse a stored preference.
 *
 * ANYTHING UNRECOGNISED RETURNS null, WHICH READS AS UNDECIDED. A corrupt
 * value, an unknown version, an array, a future schema — all of them mean "no",
 * because under opt-in the safe failure and the privacy-protective failure are
 * the same direction. This is where that is decided, and it is the single most
 * important line in the file.
 *
 * Only the three known fields are copied out, by construction, so a writer that
 * added an identifier or a location contributes nothing to what comes back.
 */
export function parsePreferences(raw: string | null): PrivacyPreferences | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
  const value = parsed as Record<string, unknown>;
  if (value.version !== PRIVACY_PREFERENCES_VERSION) return null;
  if (value.analytics !== "granted" && value.analytics !== "denied") return null;
  if (typeof value.decidedAt !== "string" || !ISO_TIMESTAMP.test(value.decidedAt)) return null;
  if (Number.isNaN(Date.parse(value.decidedAt))) return null;
  return {
    version: PRIVACY_PREFERENCES_VERSION,
    analytics: value.analytics,
    decidedAt: value.decidedAt,
  };
}

/**
 * Does this browser ask not to be tracked?
 *
 * Read for GCI's OWN decision rather than delegated to the provider. The
 * tracker does honour both signals — its minified source guards three
 * initialisation functions on exactly this test — but relying on that would
 * mean the script had already been requested before anything checked, and the
 * request to a third party is itself the thing consent is about.
 */
export function browserRefusesTracking(nav?: {
  doNotTrack?: string | null;
  globalPrivacyControl?: boolean;
  msDoNotTrack?: string | null;
}): boolean {
  const source =
    nav ??
    (typeof navigator === "undefined"
      ? undefined
      : (navigator as unknown as {
          doNotTrack?: string | null;
          globalPrivacyControl?: boolean;
          msDoNotTrack?: string | null;
        }));
  if (!source) return false;
  if (source.globalPrivacyControl === true) return true;
  const dnt = source.doNotTrack ?? source.msDoNotTrack ?? null;
  return dnt === "1" || dnt === "yes";
}

/**
 * THE PRECEDENCE RULE, identical to the one GCI Places applies.
 *
 *   1. A browser signal (DNT or GPC) forces OFF and OUTRANKS A STORED GRANT.
 *      Somebody who turned that on answered the question in a place that
 *      covers every site; letting a later per-site tap override it would make
 *      the general refusal count for less than the specific one.
 *   2. An explicit refusal is OFF.
 *   3. Undecided is OFF — silence is not agreement.
 *   4. Only an explicit grant, with no overriding signal, is ON.
 *
 * A stored grant is never mutated because a signal is present. The signal
 * makes the ANSWER false while it lasts; it does not rewrite what somebody
 * chose, and turning GPC off later must not require them to choose again.
 */
export function analyticsAuthorisation(
  preferences: PrivacyPreferences | null,
  options?: { refusesTracking?: boolean; storageAvailable?: boolean },
): AnalyticsAuthorisation {
  if (options?.storageAvailable === false) return { authorised: false, reason: "unavailable" };
  const refuses = options?.refusesTracking ?? browserRefusesTracking();
  if (refuses) return { authorised: false, reason: "browser-signal" };
  if (preferences === null) return { authorised: false, reason: "undecided" };
  if (preferences.analytics === "denied") return { authorised: false, reason: "denied" };
  return { authorised: true };
}

/** The serialised form of a decision. Three fields, and never more. */
export function preferencesFor(analytics: AnalyticsChoice, now = new Date()): PrivacyPreferences {
  return {
    version: PRIVACY_PREFERENCES_VERSION,
    analytics,
    decidedAt: now.toISOString(),
  };
}

/**
 * Read the stored decision and answer the only question callers ask.
 *
 * This module owns the read, so the loader and the interface can never
 * disagree about what somebody chose — and so a storage failure has one
 * answer, in one place, rather than a try/catch at every call site.
 */
export function storedAnalyticsAuthorisation(): AnalyticsAuthorisation {
  if (typeof window === "undefined") return { authorised: false, reason: "unavailable" };
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(PRIVACY_PREFERENCES_KEY);
  } catch {
    return { authorised: false, reason: "unavailable" };
  }
  return analyticsAuthorisation(parsePreferences(raw));
}
