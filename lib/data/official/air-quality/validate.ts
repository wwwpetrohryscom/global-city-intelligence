import {
  AIR_QUALITY_DATASET_ID,
  airQualityDatasetRecords,
} from "@/lib/data/official/air-quality/dataset";
import {
  ValidationReport,
  assertCityCountryMatches,
  assertCityExists,
  assertFinitePositive,
  assertNonEmptyString,
  assertSourceIdsExist,
} from "@/lib/data/official/validation";
import type { AirQualityDatasetRecord } from "@/types";

const AQI_MAX = 500;

function validateRecord(
  record: AirQualityDatasetRecord,
  report: ValidationReport,
): void {
  assertCityExists(record.citySlug, report);
  assertCityCountryMatches(record.citySlug, record.countrySlug, report);
  assertNonEmptyString(record.dataYear, "dataYear", report);
  assertNonEmptyString(record.lastUpdated, "lastUpdated", report);
  assertNonEmptyString(record.datasetId, "datasetId", report);

  if (record.datasetId !== AIR_QUALITY_DATASET_ID) {
    report.addError(
      `Record for "${record.citySlug}" references unknown datasetId "${record.datasetId}"`,
    );
  }

  if (record.sourceIds.length === 0) {
    report.addError(
      `Record for "${record.citySlug}" must cite at least one sourceId`,
    );
  }
  assertSourceIdsExist(record.sourceIds, report);

  assertFinitePositive(record.pm25, `pm25 (${record.citySlug})`, report);
  assertFinitePositive(record.pm10, `pm10 (${record.citySlug})`, report);
  assertFinitePositive(record.no2, `no2 (${record.citySlug})`, report);
  assertFinitePositive(record.o3, `o3 (${record.citySlug})`, report);
  assertFinitePositive(record.aqi, `aqi (${record.citySlug})`, report);

  if (record.aqi !== undefined && record.aqi > AQI_MAX) {
    report.addError(
      `Record for "${record.citySlug}" has impossible AQI ${record.aqi} (must be <= ${AQI_MAX})`,
    );
  }
}

export function validateAirQualityDataset(): ValidationReport {
  const report = new ValidationReport();

  const seenCities = new Set<string>();
  for (const record of airQualityDatasetRecords) {
    if (seenCities.has(record.citySlug)) {
      report.addError(
        `Duplicate air-quality record for city "${record.citySlug}"`,
      );
    }
    seenCities.add(record.citySlug);
    validateRecord(record, report);
  }

  return report;
}

/**
 * Eagerly validate the dataset at module load. With an empty record
 * set this is a no-op; once records are added, malformed entries will
 * throw at build time instead of silently shipping bad data.
 */
const initialReport = validateAirQualityDataset();
initialReport.throwIfErrors(
  "Air-quality dataset failed validation:",
);
