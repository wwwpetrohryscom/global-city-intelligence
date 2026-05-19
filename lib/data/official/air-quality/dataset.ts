import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import type { AirQualityDatasetRecord, OfficialDataset } from "@/types";

export const AIR_QUALITY_DATASET_ID = "global-city-air-quality" as const;

/**
 * Metadata for the platform's air-quality dataset.
 *
 * The dataset is wired to four accepted publishers: WHO, EEA, US
 * EPA NAAQS, and OpenAQ (added as the primary station-level
 * aggregator that preserves underlying provider attribution).
 * Numeric records remain empty until the manual ingestion script
 * (see `scripts/data/ingest-air-quality.sh` and
 * `docs/air-quality-data.md`) is run with a valid `OPENAQ_API_KEY`
 * environment variable; the platform shows transparent fallback
 * states elsewhere.
 */
export const airQualityDataset: OfficialDataset = {
  id: AIR_QUALITY_DATASET_ID,
  name: "Global City Intelligence — air-quality dataset",
  description:
    "Platform-side dataset for city-level air-quality intelligence. Records are populated from accepted official publishers (WHO, EEA, US EPA NAAQS) routed through OpenAQ provider attribution at build time.",
  publisher: "Global City Intelligence",
  sourceIds: ["openaq", "who-air", "eea-air", "epa-naaqs"],
  dataYear: DATA_YEAR,
  lastUpdated: LAST_UPDATED,
  license: undefined,
  coverage: {
    geographyLevel: "city",
    citySlugs: [],
    notes:
      "Coverage is empty until verified city-level measurements are integrated from accepted publishers. The ingestion pipeline routes through OpenAQ's v3 API and requires the OPENAQ_API_KEY environment variable; runs without a key skip every city rather than fabricate values.",
  },
  verificationStatus: "unavailable",
};

/**
 * Air-quality records published by the platform.
 *
 * Empty by design until the manual ingestion script
 * `scripts/data/ingest-air-quality.sh` is run with a valid OpenAQ
 * API key. The script writes each record with its underlying
 * provider attribution preserved (the agency that supplied the
 * measurement to OpenAQ), not the OpenAQ aggregator alone.
 */
export const airQualityDatasetRecords: AirQualityDatasetRecord[] = [];
