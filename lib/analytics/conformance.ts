/**
 * THE SHARED-CONSENT CONFORMANCE TABLE.
 *
 * GCI Places and the main site are two repositories that must agree, exactly,
 * about what a stored preference means — because they are one origin, one key
 * and one reader's decision. A comment saying "keep in sync with Places" is
 * not a mechanism; this is.
 *
 * Every row is a real stored value and a real pair of browser signals, with
 * the authorisation both implementations must produce. The Main gate runs them
 * against `preferences.ts`. The same table can be dropped into the Places
 * repository unchanged and run against `privacy-preferences.ts` — the function
 * names differ in path only, and the vectors are deliberately written as raw
 * strings so nothing about either implementation's types is assumed.
 *
 * THE ROWS THAT MATTER MOST are the ones where a plausible bug would resolve
 * to GRANTED: an absent preference, a corrupt one, a future schema version, an
 * array, a bare string, a grant with a browser signal set. Under opt-in every
 * one of them must be false, and each is here because each is a way somebody
 * could accidentally start measuring a person who never agreed.
 */

export type ExpectedReason = "browser-signal" | "undecided" | "denied" | "unavailable";

export interface ConformanceVector {
  /** What this row is checking, in the report's words. */
  name: string;
  /** Exactly what is in localStorage under `gci.privacy.v1`. */
  stored: string | null;
  dnt?: boolean;
  gpc?: boolean;
  storageAvailable?: boolean;
  expected: boolean;
  expectedReason?: ExpectedReason;
}

export const CONSENT_CONFORMANCE: readonly ConformanceVector[] = [
  /* ---- the three plain states ---- */
  { name: "nobody has been asked", stored: null, expected: false, expectedReason: "undecided" },
  {
    name: "an explicit refusal",
    stored: '{"version":1,"analytics":"denied","decidedAt":"2026-09-10T00:00:00.000Z"}',
    expected: false,
    expectedReason: "denied",
  },
  {
    name: "an explicit grant",
    stored: '{"version":1,"analytics":"granted","decidedAt":"2026-09-10T00:00:00.000Z"}',
    expected: true,
  },

  /* ---- signals outrank a stored grant, in every combination ---- */
  {
    name: "a grant with Do Not Track on",
    stored: '{"version":1,"analytics":"granted","decidedAt":"2026-09-10T00:00:00.000Z"}',
    dnt: true,
    expected: false,
    expectedReason: "browser-signal",
  },
  {
    name: "a grant with Global Privacy Control on",
    stored: '{"version":1,"analytics":"granted","decidedAt":"2026-09-10T00:00:00.000Z"}',
    gpc: true,
    expected: false,
    expectedReason: "browser-signal",
  },
  {
    name: "a grant with both signals on",
    stored: '{"version":1,"analytics":"granted","decidedAt":"2026-09-10T00:00:00.000Z"}',
    dnt: true,
    gpc: true,
    expected: false,
    expectedReason: "browser-signal",
  },
  {
    name: "a refusal with a signal on — still a refusal, and the signal is why",
    stored: '{"version":1,"analytics":"denied","decidedAt":"2026-09-10T00:00:00.000Z"}',
    gpc: true,
    expected: false,
    expectedReason: "browser-signal",
  },

  /* ---- every way a malformed value could be mistaken for agreement ---- */
  { name: "an empty string", stored: "", expected: false, expectedReason: "undecided" },
  { name: "not JSON at all", stored: "{ not json", expected: false, expectedReason: "undecided" },
  { name: "JSON null", stored: "null", expected: false, expectedReason: "undecided" },
  { name: "a bare string", stored: '"granted"', expected: false, expectedReason: "undecided" },
  { name: "a bare true", stored: "true", expected: false, expectedReason: "undecided" },
  {
    name: "an array that happens to contain a grant",
    stored: '[{"version":1,"analytics":"granted","decidedAt":"2026-09-10T00:00:00.000Z"}]',
    expected: false,
    expectedReason: "undecided",
  },
  {
    name: "a FUTURE schema version",
    stored: '{"version":2,"analytics":"granted","decidedAt":"2026-09-10T00:00:00.000Z"}',
    expected: false,
    expectedReason: "undecided",
  },
  {
    name: "a version that is a string rather than a number",
    stored: '{"version":"1","analytics":"granted","decidedAt":"2026-09-10T00:00:00.000Z"}',
    expected: false,
    expectedReason: "undecided",
  },
  {
    name: "an unknown choice",
    stored: '{"version":1,"analytics":"maybe","decidedAt":"2026-09-10T00:00:00.000Z"}',
    expected: false,
    expectedReason: "undecided",
  },
  {
    name: "a grant with no timestamp",
    stored: '{"version":1,"analytics":"granted"}',
    expected: false,
    expectedReason: "undecided",
  },
  {
    name: "a grant with a timestamp that is not a date",
    stored: '{"version":1,"analytics":"granted","decidedAt":"whenever"}',
    expected: false,
    expectedReason: "undecided",
  },
  {
    name: "a grant with an unparseable ISO-shaped timestamp",
    stored: '{"version":1,"analytics":"granted","decidedAt":"2026-13-45T99:99:99.000Z"}',
    expected: false,
    expectedReason: "undecided",
  },
  {
    name: "a grant smuggling extra fields",
    stored:
      '{"version":1,"analytics":"granted","decidedAt":"2026-09-10T00:00:00.000Z","visitorId":"abc","lat":1.3}',
    expected: true,
  },

  /* ---- storage itself unavailable ---- */
  {
    name: "storage cannot be read",
    stored: '{"version":1,"analytics":"granted","decidedAt":"2026-09-10T00:00:00.000Z"}',
    storageAvailable: false,
    expected: false,
    expectedReason: "unavailable",
  },
];

/**
 * The fields a stored preference is allowed to carry back out. Anything else a
 * writer put in must not survive parsing — which the "smuggling" vector above
 * checks the behaviour of, and this list lets a gate check the shape of.
 */
export const PREFERENCE_FIELDS = ["version", "analytics", "decidedAt"] as const;
