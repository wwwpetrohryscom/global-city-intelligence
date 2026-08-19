/**
 * Derived classifications used by the City Finder filters.
 *
 * METHODOLOGY RULE: every band here is a pure, deterministic bucketing of a
 * value the site already publishes, and every band label states its own numeric
 * threshold. There is no weighting, no composite, no normalisation and no
 * inferred "quality" — a visitor reading "1M – 5M" or "Affordability 70+" can
 * see exactly what qualified a city without consulting a methodology page.
 *
 * This file deliberately introduces NO new metric. In particular it does not
 * derive a cost band from `CostOfLivingProfile.monthlyCost*`: those values are
 * denominated in 83 different local currencies (Tehran ≈ 305,000,000 IRR vs
 * Kuwait City ≈ 490 KWD) and the repository contains no exchange-rate table, so
 * any cross-city cost bucketing would be fabricated. Affordability is expressed
 * only through the published unitless `affordabilityScore`.
 *
 * Client-safe: pure functions over primitives, no `@/lib/data` import.
 */

export interface Band<Id extends string> {
  id: Id;
  /** Human label. States the threshold so the label *is* the methodology. */
  label: string;
  /** Inclusive lower bound. */
  min: number;
  /** Exclusive upper bound. */
  max: number;
}

/* ------------------------------------------------------------------ *
 * Population — absolute inhabitant counts parsed from `City.population`.
 * ------------------------------------------------------------------ */

export type PopulationBandId = "xs" | "s" | "m" | "l" | "xl";

export const POPULATION_BANDS: readonly Band<PopulationBandId>[] = [
  { id: "xs", label: "Under 100k", min: 0, max: 100_000 },
  { id: "s", label: "100k – 500k", min: 100_000, max: 500_000 },
  { id: "m", label: "500k – 1M", min: 500_000, max: 1_000_000 },
  { id: "l", label: "1M – 5M", min: 1_000_000, max: 5_000_000 },
  { id: "xl", label: "5M and above", min: 5_000_000, max: Number.POSITIVE_INFINITY },
] as const;

/* ------------------------------------------------------------------ *
 * Temperature — annual average °C from the published climate profile.
 * ------------------------------------------------------------------ */

export type TemperatureBandId = "cold" | "cool" | "mild" | "warm" | "hot";

export const TEMPERATURE_BANDS: readonly Band<TemperatureBandId>[] = [
  { id: "cold", label: "Cold — under 5°C", min: Number.NEGATIVE_INFINITY, max: 5 },
  { id: "cool", label: "Cool — 5 to 12°C", min: 5, max: 12 },
  { id: "mild", label: "Mild — 12 to 18°C", min: 12, max: 18 },
  { id: "warm", label: "Warm — 18 to 24°C", min: 18, max: 24 },
  { id: "hot", label: "Hot — 24°C and above", min: 24, max: Number.POSITIVE_INFINITY },
] as const;

/* ------------------------------------------------------------------ *
 * Published 0–100 scores (affordability, safety, air quality, internet,
 * economy, education, healthcare) share one tier set. Thresholds are stated
 * in the label; no qualitative claim ("good", "best") is attached.
 * ------------------------------------------------------------------ */

export type ScoreBandId = "high" | "mid" | "low";

export const SCORE_BANDS: readonly Band<ScoreBandId>[] = [
  { id: "high", label: "75 and above", min: 75, max: Number.POSITIVE_INFINITY },
  { id: "mid", label: "60 to 74", min: 60, max: 75 },
  { id: "low", label: "Under 60", min: Number.NEGATIVE_INFINITY, max: 60 },
] as const;

/** Affordability reads more naturally with its direction spelled out. */
export const AFFORDABILITY_BANDS: readonly Band<ScoreBandId>[] = [
  { id: "high", label: "More affordable — score 75+", min: 75, max: Number.POSITIVE_INFINITY },
  { id: "mid", label: "Mid-range — score 60 to 74", min: 60, max: 75 },
  { id: "low", label: "Less affordable — under 60", min: Number.NEGATIVE_INFINITY, max: 60 },
] as const;

/**
 * Resolve a value to its band id.
 *
 * Returns null for null/NaN input — a city with no published value belongs to
 * NO band and can therefore never satisfy a band filter. This is the single
 * rule that keeps the 249 cities with unpublished scores from silently passing
 * as mid-range (see `lib/discovery/build-index.ts`).
 */
export function bandOf<Id extends string>(
  bands: readonly Band<Id>[],
  value: number | null | undefined,
): Id | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  for (const band of bands) {
    if (value >= band.min && value < band.max) return band.id;
  }
  return null;
}

/** Format a population count for display. Null renders as an explicit absence. */
export function formatPopulation(value: number | null): string {
  if (value == null) return "Not available";
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${m >= 10 ? Math.round(m) : Number(m.toFixed(1))}M`;
  }
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}
