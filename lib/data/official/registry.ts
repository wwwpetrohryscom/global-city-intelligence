import { airQualityDataset } from "@/lib/data/official/air-quality/dataset";
import type { OfficialDataset } from "@/types";

/**
 * Central registry of official datasets known to the platform.
 * Each entry is the metadata for a dataset; the actual records live
 * in their own dataset module (see `lib/data/official/air-quality`).
 */
export const officialDatasets: OfficialDataset[] = [airQualityDataset];

export function getOfficialDatasetById(
  datasetId: string,
): OfficialDataset | undefined {
  return officialDatasets.find((dataset) => dataset.id === datasetId);
}

export function listOfficialDatasets(): OfficialDataset[] {
  return officialDatasets;
}
