import type { NatureDistanceBand } from "@/types";

/**
 * Distance model.
 *
 * The repository has no routing or timetable data, so nothing here produces a
 * travel time. Everything is measured great-circle distance between two
 * published coordinates, and every string this module returns says "km" or
 * "miles" — never "1 hour from Prague".
 */

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Great-circle distance in kilometres between two WGS84 points. */
export function greatCircleKm(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number,
): number {
  const dLat = toRadians(toLat - fromLat);
  const dLon = toRadians(toLon - fromLon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/**
 * Band boundaries reproduce the corpus's existing `distanceBand` vocabulary
 * measured against real coordinates: `nearby` records reach a p99 of 59 km,
 * `regional` runs 60-120 km, `longer_weekend` begins at 122 km.
 */
export const NATURE_BAND_MAX_KM: Record<NatureDistanceBand, number> = {
  nearby: 60,
  "day-trip": 120,
  weekend: Number.POSITIVE_INFINITY,
};

export const NATURE_BAND_ORDER: readonly NatureDistanceBand[] = [
  "nearby",
  "day-trip",
  "weekend",
];

export const NATURE_BAND_LABEL: Record<NatureDistanceBand, string> = {
  nearby: "Nearby",
  "day-trip": "Day-trip distance",
  weekend: "Weekend distance",
};

export function distanceBandFor(distanceKm: number): NatureDistanceBand {
  if (distanceKm <= NATURE_BAND_MAX_KM.nearby) return "nearby";
  if (distanceKm <= NATURE_BAND_MAX_KM["day-trip"]) return "day-trip";
  return "weekend";
}

/**
 * Rounded straight-line distance, e.g. "about 24 km (15 mi)".
 *
 * Below a kilometre the rounded value is 0, and "about 0 km" reads as a
 * broken number rather than as "it is in the city" — 74 places in the corpus
 * sit that close — so the sub-kilometre case is worded instead of rounded.
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) return "under 1 km from the city centre";
  const km = Math.round(distanceKm);
  const miles = Math.round(distanceKm * 0.621371);
  return `about ${km} km (${miles} mi)`;
}

/** Compact form for headline stats, e.g. "24 km" / "under 1 km". */
export function formatDistanceShort(distanceKm: number): string {
  if (distanceKm < 1) return "under 1 km";
  return `about ${Math.round(distanceKm)} km`;
}
