import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import type { AirQualityDatasetRecord, OfficialDataset } from "@/types";

export const AIR_QUALITY_DATASET_ID = "global-city-air-quality" as const;

/**
 * Metadata for the platform's air-quality dataset.
 *
 * The dataset is wired to five accepted publishers: WHO, EEA, US
 * EPA NAAQS, US EPA AirData (annual AQI summary), and OpenAQ.
 * The first verified batch ships a single record (New York City)
 * sourced from EPA AirData annual AQI summary statistics. Other
 * candidate cities remain in the fallback state until the
 * publisher-specific ingestion path is exercised (see
 * `docs/air-quality-data.md` and `scripts/data/ingest-air-quality.sh`).
 */
export const airQualityDataset: OfficialDataset = {
  id: AIR_QUALITY_DATASET_ID,
  name: "Global City Intelligence — air-quality dataset",
  description:
    "Platform-side dataset for city-level air-quality intelligence. The first verified batch covers New York City from the US EPA AirData annual AQI summary; additional cities are added per the accepted-source policy as their publisher data becomes available.",
  publisher: "Global City Intelligence",
  sourceIds: ["openaq", "who-air", "eea-air", "epa-naaqs", "us-epa-airdata"],
  dataYear: DATA_YEAR,
  lastUpdated: LAST_UPDATED,
  license: undefined,
  coverage: {
    geographyLevel: "city",
    citySlugs: ["new-york"],
    notes:
      "First verified batch: New York City, sourced from the US EPA AirData annual_aqi_by_county_2024 summary (Median AQI for New York County / Manhattan, the reference borough). The platform does not synthesize values for other candidate cities — they render transparent fallback until their accepted publisher data is integrated.",
  },
  verificationStatus: "partial",
};

/**
 * Air-quality records published by the platform.
 *
 * Records are appended manually after a verified publisher value
 * is downloaded and reviewed. The platform does not fetch from any
 * publisher at runtime; the manual helper
 * `scripts/data/ingest-air-quality.sh` is used for OpenAQ-routed
 * pulls and is never imported by app/, lib/, or components/.
 */
export const airQualityDatasetRecords: AirQualityDatasetRecord[] = [
  {
    citySlug: "new-york",
    countrySlug: "united-states",
    aqi: 43,
    dataYear: "2024",
    lastUpdated: "2025-12-04",
    sourceIds: ["us-epa-airdata", "epa-naaqs"],
    datasetId: AIR_QUALITY_DATASET_ID,
    notes:
      "Annual Median AQI for New York County (Manhattan) in 2024, from the US EPA AirData annual_aqi_by_county_2024 summary (file last modified 2025-12-04). New York City spans five counties; Manhattan is shown as the reference borough and is disclosed in the record. Methodology: US EPA NAAQS AQI breakpoints. No transformation beyond honest selection of the reference county.",
  },
];
