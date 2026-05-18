import { airQualityDataset } from "@/lib/data/official/air-quality/dataset";
import { countryIndicatorDataset } from "@/lib/data/official/country-indicators/dataset";
import type { OfficialDataset } from "@/types";

/**
 * Central registry of official datasets known to the platform.
 * Each entry is the metadata for a dataset; the actual records live
 * in their own dataset module (see `lib/data/official/air-quality`,
 * `lib/data/official/country-indicators`, …).
 */
export const officialDatasets: OfficialDataset[] = [
  airQualityDataset,
  countryIndicatorDataset,
];

export function getOfficialDatasetById(
  datasetId: string,
): OfficialDataset | undefined {
  return officialDatasets.find((dataset) => dataset.id === datasetId);
}

export function listOfficialDatasets(): OfficialDataset[] {
  return officialDatasets;
}
