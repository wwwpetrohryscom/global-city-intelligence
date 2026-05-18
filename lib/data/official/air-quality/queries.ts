import { cities } from "@/lib/data/cities";
import {
  airQualityDataset,
  airQualityDatasetRecords,
} from "@/lib/data/official/air-quality/dataset";
import { normalizeAirQualityRecord } from "@/lib/data/official/air-quality/normalize";
// Importing validate here ensures the module-load assertion runs as
// part of the dataset boot sequence.
import "@/lib/data/official/air-quality/validate";
import { getSourcesByIds } from "@/lib/data/sources";
import type {
  AirQualityCityMetric,
  AirQualityCityProfile,
  DataSource,
  OfficialDataset,
} from "@/types";

export function getAirQualityProfileForCity(
  citySlug: string,
): AirQualityCityProfile | undefined {
  const record = airQualityDatasetRecords.find(
    (entry) => entry.citySlug === citySlug,
  );
  if (!record) {
    return undefined;
  }
  return normalizeAirQualityRecord(record);
}

export function getAirQualityMetricsForCity(
  citySlug: string,
): AirQualityCityMetric[] {
  const profile = getAirQualityProfileForCity(citySlug);
  return profile?.metrics ?? [];
}

export function hasVerifiedAirQualityData(citySlug: string): boolean {
  const profile = getAirQualityProfileForCity(citySlug);
  return profile?.verificationStatus === "verified";
}

export function getCitiesWithVerifiedAirQualityData(): string[] {
  return airQualityDatasetRecords
    .map((record) => record.citySlug)
    .filter((citySlug) => hasVerifiedAirQualityData(citySlug))
    .filter((citySlug) =>
      cities.some((city) => city.slug === citySlug),
    );
}

export function getAirQualitySourcesForCity(citySlug: string): DataSource[] {
  const profile = getAirQualityProfileForCity(citySlug);
  if (!profile) {
    return [];
  }
  return getSourcesByIds(profile.sourceIds);
}

export function getAirQualityDatasetMetadata(): OfficialDataset {
  return airQualityDataset;
}
