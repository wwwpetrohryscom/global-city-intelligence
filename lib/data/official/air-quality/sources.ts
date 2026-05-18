import { dataSources, getSourcesByIds } from "@/lib/data/sources";
import { findMissingSourceIds } from "@/lib/data/official/sources";
import type { DataSource } from "@/types";

const AIR_QUALITY_BASELINE_SOURCE_IDS = [
  "who-air",
  "eea-air",
  "epa-naaqs",
] as const;

export function getAirQualityBaselineSources(): DataSource[] {
  return getSourcesByIds([...AIR_QUALITY_BASELINE_SOURCE_IDS]);
}

export function getAirQualityBaselineSourceIds(): string[] {
  const missing = findMissingSourceIds(
    [...AIR_QUALITY_BASELINE_SOURCE_IDS],
    dataSources,
  );
  if (missing.length > 0) {
    throw new Error(
      `Air-quality baseline sources missing from registry: ${missing.join(", ")}`,
    );
  }
  return [...AIR_QUALITY_BASELINE_SOURCE_IDS];
}
