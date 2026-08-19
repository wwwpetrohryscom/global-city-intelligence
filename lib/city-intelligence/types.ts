/**
 * City Intelligence Scorecard — shared types.
 *
 * Client-safe: no `@/lib/data` import. The Scorecard renders on the server, but
 * these types are also the contract future features (City Match, Similar
 * Cities, City vs City) will consume, so they must stay corpus-free.
 */

/** Which direction is "better" for a dimension, or that it carries no direction. */
export type DimensionDirection = "higher" | "lower" | "context";

/**
 * Where a city sits within its country cohort.
 *
 * Bands rather than a raw percentile, deliberately. Several dimensions are
 * heavily tied — 49% of cities share an economy value with >25% of their
 * cohort, 60% for climate comfort — so a printed "83rd percentile" would be an
 * artifact of tie-breaking rather than a measurement. A band is the most
 * precision the corpus actually supports.
 */
export type PositionBand =
  | "top-10"
  | "top-25"
  | "above-typical"
  | "typical"
  | "below-typical"
  | "bottom-25";

export interface DimensionPosition {
  band: PositionBand;
  /**
   * Midrank percentile within the country cohort, 0–100: cities scoring
   * strictly below plus half of those tied, over cohort size. Retained for
   * ordering and validation; the UI shows the band, not this number, because
   * the corpus does not support that precision.
   */
  percentileMidrank: number;
  /** Unrounded midrank share 0–1. Ordering only; never rendered. */
  share: number;
  /** Cities in the country cohort with a valid value for this dimension. */
  cohortSize: number;
  /** How many cities share this exact value, including this one. */
  tieCount: number;
}

export interface ScorecardEntry {
  dimensionId: string;
  /** Published 0–100 value, or null when the city has no usable value. */
  value: number | null;
  /**
   * Country-relative position, or null when it cannot be stated honestly:
   * cohort too small, value unpublished, city is a placeholder record, or the
   * city's tie block is large enough that a positional claim would mislead.
   */
  position: DimensionPosition | null;
  /** Why `position` is null, for the validator and for UI copy. */
  positionSuppressedReason:
    | null
    | "no-value"
    | "placeholder-record"
    | "cohort-too-small"
    | "tie-block-too-large";
}

export interface CityScorecard {
  citySlug: string;
  cityName: string;
  countrySlug: string;
  countryName: string;
  /** True when this city's directional scores are placeholders, not measurements. */
  isPlaceholderRecord: boolean;
  entries: ScorecardEntry[];
  /** Dimension ids in the top band, strongest first. Empty for placeholder records. */
  strengths: string[];
  /** Dimension ids in the bottom band, weakest first. Empty for placeholder records. */
  tradeOffs: string[];
  /** Cities in this city's country cohort (placeholder records excluded). */
  cohortSize: number;
}
