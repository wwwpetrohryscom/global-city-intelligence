import type { DiscoveryCity, DiscoveryIndex } from "@/lib/discovery/types";

/**
 * Similar Cities + Better Alternatives — the deterministic recommendation
 * engine.
 *
 * PURE AND CLIENT-SAFE: no `@/lib/data` import. It operates on the existing
 * `DiscoveryIndex` wire format, so the exact same code runs at build time
 * (fed by `buildDiscoveryIndex()`) and in the browser (fed by the already
 * emitted /discovery-index/cities.json) — one engine, two callers, no second
 * index and no drift between server-rendered and interactive results.
 *
 * ------------------------------------------------------------------------
 * THE MODEL (chosen by measurement, not preference)
 * ------------------------------------------------------------------------
 * Vector: the 8 published 0–100 scores (safety, healthcare, economy,
 * education, climate comfort, air quality, internet, affordability) plus
 * annual average temperature (°C) and log10(population). Population enters in
 * log scale because it spans 1e3–4e7 — raw values would reduce the dimension
 * to "megacity or not".
 *
 * Normalization: min–max over the valid corpus, so every dimension spans
 * [0,1] and none dominates by unit. Rank/percentile and median/IQR robust
 * scaling were also evaluated against real probes (Porto, Tokyo, Brno,
 * Reykjavik, Singapore, Dubai): all three produced near-identical
 * neighbour orderings; rank normalization additionally compressed genuine
 * extremes (it placed Naha third for Dubai). Min–max won on simplicity and
 * interpretability — a distance of 0.02 literally means "2% of full scale
 * apart on an average dimension".
 *
 * Distance: mean absolute difference (L1) across the 10 normalized
 * dimensions. Euclidean produced the same top neighbours on every probe and
 * is harder to explain, so the simpler model ships.
 *
 * ------------------------------------------------------------------------
 * PLACEHOLDER EXCLUSION (canonical, not re-detected)
 * ------------------------------------------------------------------------
 * The 249 placeholder cities are recognisable in the index by `a === null` —
 * the null that `isSentinelCity()` (the repository's single sentinel
 * definition, guarded by validate-sentinel-cohort) produced at build time.
 * They have exactly two genuinely city-specific numeric fields (annual temp,
 * climate comfort) out of ten, so no honest similarity can be computed. They
 * are excluded as sources AND as candidates: they never influence
 * normalization, never appear in results, never become "alternatives".
 *
 * ------------------------------------------------------------------------
 * CALIBRATED CONSTANTS (measured on the real corpus, 2026-08)
 * ------------------------------------------------------------------------
 * Distances over an 800-city sample: nearest neighbour p50 = 0.014,
 * 4th-neighbour p75 = 0.030, 8th-neighbour p90 = 0.055, while RANDOM pairs
 * sit at p10 = 0.097 / p50 = 0.195. So everything below 0.055 is far closer
 * than 90% of random pairs, and the bands below are selective rather than
 * flattering.
 */

/** Ordered score keys shared with the discovery index record. */
export const SCORE_KEYS = ["f", "h", "e", "u", "k", "q", "i", "a"] as const;
export type ScoreKey = (typeof SCORE_KEYS)[number];

export const SCORE_LABELS: Record<ScoreKey, string> = {
  f: "safety",
  h: "healthcare",
  e: "economy",
  u: "education",
  k: "climate comfort",
  q: "air quality",
  i: "internet",
  a: "affordability",
};

/** Similarity bands. Anchored to the measured neighbour distribution. */
export const BAND_VERY = 0.02;
export const BAND_SIMILAR = 0.035;
export const BAND_SOMEWHAT = 0.055;

/** Similar-list shape: quality first, then diversity. Measured: without the
 * country cap, 420 of 800 sampled cities drew ALL top-8 from their own
 * country (within-country score granularity is coarse, so compatriots
 * cluster). Cap 3 of the 6 slots per country; never admit anything beyond
 * BAND_SOMEWHAT to fill a slot — 96% of cities still fill ≥3 slots. */
export const SIMILAR_COUNT = 6;
export const MAX_SAME_COUNTRY = 3;

/** Alternatives: the candidate must stay recognisably similar (≤ 0.075 —
 * between the somewhat-band edge and half the random-pair p10), must improve
 * the target by ≥ 5 points on the 0–100 scale (among similar pairs the p90
 * |difference| is only 1–6 points, so 5 is a genuinely material gap, not
 * noise), and may not degrade more than 2 other score dimensions by ≥ 5
 * points. Availability is honestly uneven: ~45% of cities have no
 * economy/healthcare alternative under these rules, and then none is shown. */
export const ALT_MAX_DIST = 0.075;
export const ALT_MIN_GAIN = 5;
export const ALT_TRADEOFF_POINTS = 5;
export const ALT_MAX_TRADEOFFS = 2;
export const ALT_COUNT = 4;

/** Climate intents use temperature difference, not "better": ≥ 3°C — just
 * under a third of the corpus IQR (10°C) — before "warmer/cooler" is claimed. */
export const CLIMATE_MIN_DELTA_C = 3;

/** All ten dimensions must be present to enter the engine. Today every
 * non-placeholder city has a complete vector; this guard fails closed if a
 * future corpus change introduces partial records rather than letting a
 * 2-dimension "match" masquerade as a strong one. */
export const MIN_COMPARABLE_DIMENSIONS = 10;

export type SimilarityBand = "very" | "similar" | "somewhat";

export function bandOf(distance: number): SimilarityBand | null {
  if (distance <= BAND_VERY) return "very";
  if (distance <= BAND_SIMILAR) return "similar";
  if (distance <= BAND_SOMEWHAT) return "somewhat";
  return null;
}

export function bandLabel(band: SimilarityBand): string {
  return band === "very" ? "Very similar" : band === "similar" ? "Similar" : "Somewhat similar";
}

export interface EngineContext {
  cities: DiscoveryCity[];        // valid (non-placeholder) only
  countryName: (idx: number) => string;
  vectors: number[][];            // normalized, aligned with `cities`
  bySlug: Map<string, number>;
}

/** Build the normalization context once; O(N·m). */
export function buildContext(index: DiscoveryIndex): EngineContext {
  const cities = index.cities.filter(
    (c) =>
      c.a !== null && c.f !== null && c.q !== null && c.i !== null &&
      c.p !== null && Number.isFinite(c.t),
  );
  const rawVec = (c: DiscoveryCity): number[] => [
    ...SCORE_KEYS.map((k) => c[k] as number),
    c.t,
    Math.log10(c.p as number),
  ];
  const raws = cities.map(rawVec);
  const dims = raws[0]?.length ?? 0;
  const mins: number[] = []; const maxs: number[] = [];
  for (let j = 0; j < dims; j += 1) {
    let lo = Infinity, hi = -Infinity;
    for (const r of raws) { if (r[j] < lo) lo = r[j]; if (r[j] > hi) hi = r[j]; }
    mins.push(lo); maxs.push(hi === lo ? lo + 1 : hi);
  }
  const vectors = raws.map((r) => r.map((v, j) => (v - mins[j]) / (maxs[j] - mins[j])));
  return {
    cities,
    countryName: (idx) => index.countries[idx]?.n ?? "",
    vectors,
    bySlug: new Map(cities.map((c, i) => [c.s, i])),
  };
}

export function distance(a: number[], b: number[]): number {
  // Both vectors are complete by construction (see MIN_COMPARABLE_DIMENSIONS);
  // the guard is here so a partial record can never silently produce a
  // "closer" distance by comparing fewer dimensions.
  if (a.length < MIN_COMPARABLE_DIMENSIONS || b.length < MIN_COMPARABLE_DIMENSIONS) {
    return Number.POSITIVE_INFINITY;
  }
  let s = 0;
  for (let j = 0; j < a.length; j += 1) s += Math.abs(a[j] - b[j]);
  return s / a.length;
}

/* ------------------------------------------------------------------ *
 * Explanations — evidence, not marketing.
 * ------------------------------------------------------------------ */

export interface SimilarHit {
  city: DiscoveryCity;
  dist: number;
  band: SimilarityBand;
  /** 2–3 dimensions where the two cities are closest, e.g. "safety". */
  sharedTraits: string[];
  /** The most material difference, phrased with direction, or null when the
   *  pair is close on every dimension. */
  keyDifference: string | null;
}

function describeDifference(base: DiscoveryCity, other: DiscoveryCity, j: number): string {
  if (j < SCORE_KEYS.length) {
    const k = SCORE_KEYS[j];
    const d = (other[k] as number) - (base[k] as number);
    const noun = SCORE_LABELS[k];
    if (k === "a") return d > 0 ? "more affordable" : "less affordable";
    return d > 0 ? `stronger ${noun}` : `weaker ${noun}`;
  }
  if (j === SCORE_KEYS.length) {
    return (other.t - base.t) > 0 ? "warmer climate" : "cooler climate";
  }
  return (other.p as number) > (base.p as number) ? "larger population" : "smaller population";
}

export function explainPair(
  ctx: EngineContext, baseIdx: number, otherIdx: number,
): { sharedTraits: string[]; keyDifference: string | null } {
  const va = ctx.vectors[baseIdx]; const vb = ctx.vectors[otherIdx];
  const diffs = va.map((v, j) => ({ j, d: Math.abs(v - vb[j]) }));
  const sortedClose = [...diffs].sort((x, y) => x.d - y.d);
  const shared = sortedClose
    .filter((x) => x.j < SCORE_KEYS.length && x.d <= 0.04)
    .slice(0, 3)
    .map((x) => SCORE_LABELS[SCORE_KEYS[x.j]]);
  const worst = [...diffs].sort((x, y) => y.d - x.d)[0];
  const keyDifference = worst && worst.d >= 0.06
    ? describeDifference(ctx.cities[baseIdx], ctx.cities[otherIdx], worst.j)
    : null;
  return { sharedTraits: shared, keyDifference };
}

/* ------------------------------------------------------------------ *
 * Similar cities.
 * ------------------------------------------------------------------ */

export function similarCities(ctx: EngineContext, slug: string): SimilarHit[] {
  const i = ctx.bySlug.get(slug);
  if (i === undefined) return [];
  const scored: { j: number; d: number }[] = [];
  for (let j = 0; j < ctx.cities.length; j += 1) {
    if (j === i) continue;
    const d = distance(ctx.vectors[i], ctx.vectors[j]);
    if (d <= BAND_SOMEWHAT) scored.push({ j, d });
  }
  scored.sort((a, b) => a.d - b.d || ctx.cities[a.j].s.localeCompare(ctx.cities[b.j].s));
  const out: SimilarHit[] = [];
  let sameCountry = 0;
  for (const { j, d } of scored) {
    const same = ctx.cities[j].c === ctx.cities[i].c;
    if (same && sameCountry >= MAX_SAME_COUNTRY) continue;
    const band = bandOf(d);
    if (!band) continue;
    const { sharedTraits, keyDifference } = explainPair(ctx, i, j);
    out.push({ city: ctx.cities[j], dist: d, band, sharedTraits, keyDifference });
    if (same) sameCountry += 1;
    if (out.length === SIMILAR_COUNT) break;
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Better alternatives — better ONLY along a named dimension.
 * ------------------------------------------------------------------ */

export type IntentId = ScoreKey | "warmer" | "cooler";

export const INTENTS: { id: IntentId; label: string }[] = [
  { id: "a", label: "More affordable" },
  { id: "f", label: "Higher safety" },
  { id: "q", label: "Cleaner air" },
  { id: "i", label: "Faster internet" },
  { id: "e", label: "Stronger economy" },
  { id: "h", label: "Stronger healthcare" },
  { id: "u", label: "Stronger education" },
  { id: "warmer", label: "Warmer" },
  { id: "cooler", label: "Cooler" },
];

export interface AlternativeHit {
  city: DiscoveryCity;
  dist: number;
  /** e.g. "+9 affordability" or "+4.2°C annual average". */
  gain: string;
  /** Material trade-offs (≥ ALT_TRADEOFF_POINTS drops), each named. May be empty. */
  tradeOffs: string[];
  sharedTraits: string[];
}

export function alternatives(ctx: EngineContext, slug: string, intent: IntentId): AlternativeHit[] {
  const i = ctx.bySlug.get(slug);
  if (i === undefined) return [];
  const base = ctx.cities[i];
  const hits: { j: number; d: number; gainNum: number }[] = [];
  for (let j = 0; j < ctx.cities.length; j += 1) {
    if (j === i) continue;
    const d = distance(ctx.vectors[i], ctx.vectors[j]);
    if (d > ALT_MAX_DIST) continue;
    const cand = ctx.cities[j];
    let gainNum: number;
    if (intent === "warmer") gainNum = cand.t - base.t;
    else if (intent === "cooler") gainNum = base.t - cand.t;
    else gainNum = (cand[intent] as number) - (base[intent] as number);
    const minGain = intent === "warmer" || intent === "cooler" ? CLIMATE_MIN_DELTA_C : ALT_MIN_GAIN;
    if (gainNum < minGain) continue;
    let drops = 0;
    for (const k of SCORE_KEYS) {
      if (k === intent) continue;
      if ((base[k] as number) - (ctx.cities[j][k] as number) >= ALT_TRADEOFF_POINTS) drops += 1;
    }
    if (drops > ALT_MAX_TRADEOFFS) continue;
    hits.push({ j, d, gainNum });
  }
  hits.sort((a, b) => b.gainNum - a.gainNum || a.d - b.d || ctx.cities[a.j].s.localeCompare(ctx.cities[b.j].s));
  return hits.slice(0, ALT_COUNT).map(({ j, d, gainNum }) => {
    const cand = ctx.cities[j];
    const tradeOffs = SCORE_KEYS
      .filter((k) => k !== intent && (base[k] as number) - (cand[k] as number) >= ALT_TRADEOFF_POINTS)
      .map((k) => `${SCORE_LABELS[k]} −${(base[k] as number) - (cand[k] as number)}`);
    const gain = intent === "warmer" || intent === "cooler"
      ? `${gainNum > 0 ? "+" : ""}${gainNum.toFixed(1)}°C annual average`
      : `+${gainNum} ${SCORE_LABELS[intent as ScoreKey]}`;
    return { city: cand, dist: d, gain, tradeOffs, sharedTraits: explainPair(ctx, i, j).sharedTraits };
  });
}
