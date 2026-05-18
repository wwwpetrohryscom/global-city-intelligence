import type { MetricVerificationStatus } from "@/types";

/**
 * Resolve a profile-level verification status from an array of
 * per-metric statuses. The logic is conservative:
 *   - no metrics => unavailable
 *   - all verified => verified
 *   - mixed       => partial
 *   - none verified but some present => partial
 */
export function resolveAggregateStatus(
  statuses: MetricVerificationStatus[],
): MetricVerificationStatus {
  if (statuses.length === 0) {
    return "unavailable";
  }

  const verifiedCount = statuses.filter((s) => s === "verified").length;

  if (verifiedCount === statuses.length) {
    return "verified";
  }

  return "partial";
}

export function uniqueIds(ids: string[]): string[] {
  return Array.from(new Set(ids));
}
