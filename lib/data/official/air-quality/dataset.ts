import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import type { AirQualityDatasetRecord, OfficialDataset } from "@/types";

export const AIR_QUALITY_DATASET_ID = "global-city-air-quality" as const;

/**
 * Metadata for the platform's air-quality dataset. The dataset begins
 * empty: no city-level measurements are published until they can be
 * sourced from accepted official publishers (see
 * `docs/data-ingestion.md` for the accepted-source policy).
 */
export const airQualityDataset: OfficialDataset = {
  id: AIR_QUALITY_DATASET_ID,
  name: "Global City Intelligence — air-quality dataset",
  description:
    "Platform-side dataset for city-level air-quality intelligence. Records are populated from accepted official publishers and remain empty until verification.",
  publisher: "Global City Intelligence",
  sourceIds: ["who-air", "eea-air", "epa-naaqs"],
  dataYear: DATA_YEAR,
  lastUpdated: LAST_UPDATED,
  license: undefined,
  coverage: {
    geographyLevel: "city",
    citySlugs: [],
    notes:
      "Coverage is intentionally empty at launch. The platform shows transparent fallback states until verified city-level measurements are integrated from accepted publishers.",
  },
  verificationStatus: "unavailable",
};

/**
 * Air-quality records published by the platform. Empty by design: see
 * `dataset.coverage.notes` and `docs/air-quality-data.md`.
 */
export const airQualityDatasetRecords: AirQualityDatasetRecord[] = [];
