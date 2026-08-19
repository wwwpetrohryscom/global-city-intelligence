import {
  DIMENSION_IDS,
  INTELLIGENCE_DIMENSIONS,
  dimensionById,
} from "@/lib/city-intelligence/dimensions";
import type {
  CityScorecard,
  DimensionPosition,
  PositionBand,
  ScorecardEntry,
} from "@/lib/city-intelligence/types";
import {
  allCityValues,
  cohorts,
  countStrictlyBelow,
  countryCohortSize,
} from "@/lib/city-intelligence/cohorts";

/**
 * SERVER ONLY — assembles a city's Scorecard from real published values.
 *
 * ------------------------------------------------------------------------
 * THE STATISTICAL CONVENTION (stated once, enforced by the validator)
 * ------------------------------------------------------------------------
 * Position uses the MIDRANK convention: (cities scoring strictly below +
 * half the cities sharing this exact value) / cohort size. Tied cities all
 * receive the identical position — a city can never outrank another holding
 * the same published value — and a tied block is centred rather than credited
 * with the whole gap beneath it.
 *
 * Midrank was chosen over strictly-below after measuring both against the real
 * corpus: strictly-below put 32.4% of entries in a band labelled "Bottom 25%",
 * because every city tied at a cohort's minimum scored 0% below. Midrank
 * brings that to 27.4% and every other band within ~2.5 points of its label,
 * so the label a visitor reads matches what the band actually contains.
 *
 * The result is reported as a BAND, not a printed percentile. Several
 * dimensions are heavily tied (49% of cities share an economy value with more
 * than a quarter of their cohort; 60% for climate comfort), so an exact
 * percentile would be an artifact of how ties are broken rather than a
 * measurement. Bands are the most precision the corpus honestly supports.
 *
 * ------------------------------------------------------------------------
 * WHEN NO POSITION IS STATED
 * ------------------------------------------------------------------------
 * 1. no-value           — the city publishes nothing for this dimension.
 * 2. placeholder-record — the city is a known placeholder; its scores are the
 *                         literal 50 marker, and for economy/education/
 *                         healthcare a country default. It is excluded from
 *                         every cohort and receives no position at all.
 * 3. cohort-too-small   — fewer than MIN_COHORT comparable cities. 27 countries
 *                         hold exactly one. "Top 10% in Liechtenstein" out of
 *                         two cities is not intelligence.
 * 4. tie-block-too-large — the city shares its value with more than a quarter
 *                         of the cohort. "Higher than 70%" would conceal that
 *                         a quarter of the country is identical, so the honest
 *                         statement is "typical".
 */

/**
 * 10 comparable cities. Measured against the real distribution: n>=10 covers
 * 4,081 of 4,195 valid cities (97.3%) across 59 of 105 countries, while
 * excluding the 27 single-city and 7 two-to-four-city countries where a
 * positional claim cannot mean anything. Lowering it to 5 would add 0.9% more
 * cities at the cost of ranking cities against four peers; raising it to 20
 * would cost 2.2% for no gain in defensibility.
 */
export const MIN_COHORT = 10;

/**
 * A tie block larger than this share of the cohort makes any positional claim
 * misleading, because most of the "below" mass is cities holding a different
 * value while a large plurality is identical to this one.
 */
export const MAX_TIE_SHARE = 0.25;

/** Top/bottom band cut-offs, in share-strictly-below terms. */
const TOP_10 = 0.9;
const TOP_25 = 0.75;
const ABOVE = 0.6;
const BELOW = 0.4;
const BOTTOM_25 = 0.25;

function bandFor(share: number): PositionBand {
  if (share >= TOP_10) return "top-10";
  if (share >= TOP_25) return "top-25";
  if (share >= ABOVE) return "above-typical";
  if (share > BELOW) return "typical";
  if (share > BOTTOM_25) return "below-typical";
  return "bottom-25";
}

export const STRENGTH_BANDS: readonly PositionBand[] = ["top-10", "top-25"];
export const TRADE_OFF_BANDS: readonly PositionBand[] = ["bottom-25", "below-typical"];
/** Keep the dashboard readable rather than exhaustive. */
export const MAX_HIGHLIGHTS = 4;

function positionFor(
  countrySlug: string,
  dimensionId: string,
  value: number,
): { position: DimensionPosition | null; reason: ScorecardEntry["positionSuppressedReason"] } {
  const cohort = cohorts().get(countrySlug)?.get(dimensionId);
  if (!cohort || cohort.sorted.length < MIN_COHORT) {
    return { position: null, reason: "cohort-too-small" };
  }
  const size = cohort.sorted.length;
  const tieCount = cohort.counts.get(value) ?? 0;
  if (tieCount / size > MAX_TIE_SHARE) {
    return { position: null, reason: "tie-block-too-large" };
  }
  const below = countStrictlyBelow(cohort.sorted, value);
  const share = (below + tieCount / 2) / size;
  return {
    position: {
      band: bandFor(share),
      percentileMidrank: Math.round(share * 100),
      // Unrounded, for ordering only. Sorting on the rounded value collapses
      // across a band edge and can list a weaker dimension ahead of a stronger.
      share,
      cohortSize: size,
      tieCount,
    },
    reason: null,
  };
}

let cachedIndex: Map<string, ReturnType<typeof allCityValues>[number]> | null = null;
function cityIndex() {
  if (!cachedIndex) cachedIndex = new Map(allCityValues().map((c) => [c.slug, c]));
  return cachedIndex;
}

export function buildScorecard(citySlug: string): CityScorecard | null {
  const city = cityIndex().get(citySlug);
  if (!city) return null;

  const entries: ScorecardEntry[] = [];
  for (const dimension of INTELLIGENCE_DIMENSIONS) {
    const value = city.values.get(dimension.id) ?? null;

    if (value === null) {
      entries.push({ dimensionId: dimension.id, value: null, position: null, positionSuppressedReason: "no-value" });
      continue;
    }
    if (city.isPlaceholder) {
      // The value is shown (the city's own page publishes it) but never
      // positioned: for the directional scores it is the literal 50 marker,
      // and for economy/education/healthcare it is a country default.
      entries.push({
        dimensionId: dimension.id,
        value,
        position: null,
        positionSuppressedReason: "placeholder-record",
      });
      continue;
    }
    const { position, reason } = positionFor(city.countrySlug, dimension.id, value);
    entries.push({ dimensionId: dimension.id, value, position, positionSuppressedReason: reason });
  }

  // Highlights come from country-relative position, never from a raw threshold:
  // a score of 80 is only a strength if it is strong *for that country*.
  const ranked = entries.filter((e) => e.position !== null);
  const strengths = ranked
    .filter((e) => STRENGTH_BANDS.includes(e.position!.band))
    .sort((a, b) => b.position!.share - a.position!.share)
    .slice(0, MAX_HIGHLIGHTS)
    .map((e) => e.dimensionId);
  const tradeOffs = ranked
    .filter((e) => TRADE_OFF_BANDS.includes(e.position!.band))
    .sort((a, b) => a.position!.share - b.position!.share)
    .slice(0, MAX_HIGHLIGHTS)
    .map((e) => e.dimensionId);

  return {
    citySlug: city.slug,
    cityName: city.name,
    countrySlug: city.countrySlug,
    countryName: city.countryName,
    isPlaceholderRecord: city.isPlaceholder,
    entries,
    strengths,
    tradeOffs,
    cohortSize: countryCohortSize(city.countrySlug),
  };
}

/**
 * Human label for a band, phrased as a comparison, never as a verdict and
 * never as a quantile.
 *
 * The labels deliberately carry NO percentage. Aggregated across all
 * dimensions the bands do land within ~2.5 points of a 10/15/15/20/15/25
 * split, but per dimension they do not: the tie filter is not band-neutral,
 * so on the tie-heavy dimensions the band that would be called "Bottom 25%"
 * actually holds 39.1% of positioned climate entries, 31.7% of healthcare and
 * 31.6% of economy, while "Around typical" holds just 6.6% of healthcare.
 * Per cohort it is worse — 40 of 112 Dutch cities (35.7%) fall in the lowest
 * healthcare band. Printing "Bottom 25%" on those cards would be a precision
 * claim the corpus cannot support, so the label states the direction of the
 * comparison and lets the cohort size carry the scale.
 */
export function bandLabel(band: PositionBand): string {
  switch (band) {
    case "top-10": return "Among the highest";
    case "top-25": return "Higher than most";
    case "above-typical": return "Above typical";
    case "typical": return "Around typical";
    case "below-typical": return "Below typical";
    case "bottom-25": return "Among the lowest";
  }
}

export { DIMENSION_IDS, dimensionById };
