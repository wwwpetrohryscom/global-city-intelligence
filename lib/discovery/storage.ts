/**
 * Browser-local persistence for Saved Cities and Recently Viewed.
 *
 * One small shared utility rather than scattered `localStorage` calls, because
 * every call site needs the same four defences: SSR safety (this module is
 * imported by components that render on the server during export), a disabled
 * or quota-exhausted store, malformed JSON written by an older build, and
 * values that are the right JSON shape but the wrong type.
 *
 * PRIVACY: everything here stays in the visitor's browser. Nothing is
 * transmitted, no cookie is set, no analytics event carries it, and no account
 * is involved — so this adds no consent obligation. The site's existing
 * analytics tag is untouched by this module.
 *
 * WHAT IS STORED: slugs and timestamps only. Never a copy of a city record —
 * a cached copy would go stale against the corpus and start contradicting the
 * pages it links to. Current data is always resolved from the discovery index.
 */

/** Versioned keys: a shape change bumps the suffix and the old key is ignored. */
export const SAVED_CITIES_KEY = "gci:saved-cities:v1";
export const RECENT_CITIES_KEY = "gci:recent-cities:v1";

/** Recently Viewed is a convenience list, not an archive. */
export const RECENT_LIMIT = 12;
/** Comparison is only legible up to a handful of columns. */
export const MAX_COMPARE = 4;

export interface RecentEntry {
  /** city slug */
  slug: string;
  /** epoch milliseconds of the most recent visit */
  at: number;
}

/**
 * A slug we are willing to persist. Deliberately strict: the value is later
 * interpolated into a URL, and this keeps anything odd in storage from
 * reaching the router. Real corpus slugs are lowercase alphanumeric + hyphen.
 */
const SLUG_RE = /^[a-z0-9-]{1,80}$/;

export function isValidSlug(value: unknown): value is string {
  return typeof value === "string" && SLUG_RE.test(value);
}

/** Returns null when storage is unavailable (SSR, disabled, privacy mode). */
function store(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    const s = window.localStorage;
    // Safari in private mode historically exposed localStorage but threw on
    // write, so presence alone is not proof it works. Reads still succeed
    // there; write failures are handled at each write site.
    return s ?? null;
  } catch {
    return null;
  }
}

function readRaw(key: string): unknown {
  const s = store();
  if (!s) return null;
  try {
    const raw = s.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    // Malformed JSON — treat as empty rather than throwing into render.
    return null;
  }
}

function writeRaw(key: string, value: unknown): boolean {
  const s = store();
  if (!s) return false;
  try {
    s.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // QuotaExceededError or a store that rejects writes. The in-memory state
    // still updates for this session; persistence is best-effort by design.
    return false;
  }
}

/* ------------------------------- saved ------------------------------- */

/** Saved slugs, de-duplicated, insertion order preserved (newest last). */
export function readSaved(): string[] {
  const parsed = readRaw(SAVED_CITIES_KEY);
  if (!Array.isArray(parsed)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const entry of parsed) {
    if (!isValidSlug(entry) || seen.has(entry)) continue;
    seen.add(entry);
    out.push(entry);
  }
  return out;
}

export function writeSaved(slugs: string[]): boolean {
  const seen = new Set<string>();
  const clean = slugs.filter((s) => {
    if (!isValidSlug(s) || seen.has(s)) return false;
    seen.add(s);
    return true;
  });
  return writeRaw(SAVED_CITIES_KEY, clean);
}

/* ------------------------------- recent ------------------------------ */

/**
 * Recently viewed, newest first, capped at RECENT_LIMIT.
 *
 * Sorting on read (rather than trusting write order) means a list written by a
 * different tab, or an older build, still presents correctly.
 */
export function readRecent(): RecentEntry[] {
  const parsed = readRaw(RECENT_CITIES_KEY);
  if (!Array.isArray(parsed)) return [];
  const out: RecentEntry[] = [];
  const seen = new Set<string>();
  for (const entry of parsed) {
    if (typeof entry !== "object" || entry === null) continue;
    const { slug, at } = entry as { slug?: unknown; at?: unknown };
    if (!isValidSlug(slug) || seen.has(slug)) continue;
    if (typeof at !== "number" || !Number.isFinite(at)) continue;
    seen.add(slug);
    out.push({ slug, at });
  }
  return out.sort((a, b) => b.at - a.at).slice(0, RECENT_LIMIT);
}

/**
 * Record a visit. Re-visiting an existing city moves it to the top rather than
 * adding a second entry, so one city is one entry regardless of how many of its
 * pages the visitor opened.
 */
export function pushRecent(slug: string, now: number): RecentEntry[] {
  if (!isValidSlug(slug)) return readRecent();
  const existing = readRecent().filter((e) => e.slug !== slug);
  const next = [{ slug, at: now }, ...existing].slice(0, RECENT_LIMIT);
  writeRaw(RECENT_CITIES_KEY, next);
  return next;
}

export function writeRecent(entries: RecentEntry[]): boolean {
  return writeRaw(RECENT_CITIES_KEY, entries.slice(0, RECENT_LIMIT));
}

export function clearKey(key: string): boolean {
  const s = store();
  if (!s) return false;
  try {
    s.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
