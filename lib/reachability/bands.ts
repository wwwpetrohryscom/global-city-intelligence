import type { NatureDistanceBand } from "@/types";

/**
 * The canonical reachability band registry.
 *
 * There is deliberately ONE definition of these thresholds in the repository.
 * The nature layer derived them from the corpus's own `distanceBand`
 * vocabulary — measured against real coordinates, existing `nearby` records
 * reach a p99 of 59 km, `regional` spans 60–120 km and `longer_weekend` starts
 * at 122 km — and `lib/nature/distance.ts` now imports them from here rather
 * than restating them, so a second, competing model cannot appear.
 *
 * The same boundaries hold for city-to-city destinations: measured across the
 * 42,741 published inter-city edges they split 15,277 / 11,377 / 11,886, and
 * 90.2% of all edges fall inside the 300 km ceiling.
 *
 * A band describes DISTANCE. It never describes travel time: the repository
 * has no routing or timetable data, so nothing here may be rendered as an
 * hour count.
 */
export type ReachabilityBand = NatureDistanceBand;

export const REACHABILITY_BAND_MAX_KM: Record<ReachabilityBand, number> = {
  nearby: 60,
  "day-trip": 120,
  weekend: Number.POSITIVE_INFINITY,
};

/** Nothing beyond this is offered as a destination, in any band. */
export const REACHABILITY_MAX_KM = 300;

export const REACHABILITY_BAND_ORDER: readonly ReachabilityBand[] = [
  "nearby",
  "day-trip",
  "weekend",
];

/** Short label for a chip. */
export const REACHABILITY_BAND_LABEL: Record<ReachabilityBand, string> = {
  nearby: "Nearby",
  "day-trip": "Day-trip distance",
  weekend: "Weekend distance",
};

/** Heading used when a band introduces a group of destinations. */
export const REACHABILITY_BAND_HEADING: Record<ReachabilityBand, string> = {
  nearby: "Close to the city",
  "day-trip": "Day-trip distance",
  weekend: "Weekend distance",
};

/**
 * One sentence explaining what a band means, in distance terms only. These
 * strings are rendered verbatim, so they are the guarantee that no page
 * implies a journey time.
 */
export const REACHABILITY_BAND_NOTE: Record<ReachabilityBand, string> = {
  nearby: "Within 60 km of the city centre, measured in a straight line.",
  "day-trip": "Between 60 km and 120 km from the city centre, measured in a straight line.",
  weekend: "More than 120 km from the city centre, measured in a straight line.",
};

export function reachabilityBandFor(distanceKm: number): ReachabilityBand {
  if (distanceKm <= REACHABILITY_BAND_MAX_KM.nearby) return "nearby";
  if (distanceKm <= REACHABILITY_BAND_MAX_KM["day-trip"]) return "day-trip";
  return "weekend";
}
