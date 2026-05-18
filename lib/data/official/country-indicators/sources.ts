import { dataSources, getSourcesByIds } from "@/lib/data/sources";
import { findMissingSourceIds } from "@/lib/data/official/sources";
import type { DataSource } from "@/types";

/**
 * Baseline references used by the country-indicators surface even
 * when no measurements have been integrated yet. Every id must
 * resolve in `lib/data/sources/index.ts`.
 */
const COUNTRY_INDICATOR_BASELINE_SOURCE_IDS = [
  "un-habitat",
  "who",
  "oecd-health",
] as const;

export function getCountryIndicatorBaselineSources(): DataSource[] {
  return getSourcesByIds([...COUNTRY_INDICATOR_BASELINE_SOURCE_IDS]);
}

export function getCountryIndicatorBaselineSourceIds(): string[] {
  const missing = findMissingSourceIds(
    [...COUNTRY_INDICATOR_BASELINE_SOURCE_IDS],
    dataSources,
  );
  if (missing.length > 0) {
    throw new Error(
      `Country-indicator baseline sources missing from registry: ${missing.join(", ")}`,
    );
  }
  return [...COUNTRY_INDICATOR_BASELINE_SOURCE_IDS];
}
