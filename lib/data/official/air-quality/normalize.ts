import {
  airQualityDataset,
  airQualityDatasetRecords,
} from "@/lib/data/official/air-quality/dataset";
import {
  AIR_QUALITY_METRIC_LABELS,
  AIR_QUALITY_METRIC_UNITS,
} from "@/lib/data/official/air-quality/types";
import {
  resolveAggregateStatus,
  uniqueIds,
} from "@/lib/data/official/normalization";
import { buildProvenance } from "@/lib/data/official/provenance";
import type {
  AirQualityCityMetric,
  AirQualityCityProfile,
  AirQualityDatasetRecord,
  AirQualityMetricKey,
  MetricVerificationStatus,
} from "@/types";

interface NumericExtraction {
  key: AirQualityMetricKey;
  value: number | undefined;
}

function numericMetricsFromRecord(
  record: AirQualityDatasetRecord,
): NumericExtraction[] {
  return [
    { key: "pm25", value: record.pm25 },
    { key: "pm10", value: record.pm10 },
    { key: "no2", value: record.no2 },
    { key: "o3", value: record.o3 },
    { key: "aqi", value: record.aqi },
  ];
}

function buildMetric({
  record,
  metricKey,
  value,
  category,
  verificationStatus,
}: {
  record: AirQualityDatasetRecord;
  metricKey: AirQualityMetricKey;
  value?: number;
  category?: string;
  verificationStatus: MetricVerificationStatus;
}): AirQualityCityMetric {
  return {
    citySlug: record.citySlug,
    countrySlug: record.countrySlug,
    metricKey,
    label: AIR_QUALITY_METRIC_LABELS[metricKey],
    value,
    unit: AIR_QUALITY_METRIC_UNITS[metricKey],
    category,
    dataYear: record.dataYear,
    lastUpdated: record.lastUpdated,
    sourceIds: record.sourceIds,
    datasetId: record.datasetId,
    verificationStatus,
    notes: record.notes,
  };
}

export function normalizeAirQualityRecord(
  record: AirQualityDatasetRecord,
): AirQualityCityProfile {
  const numericMetrics = numericMetricsFromRecord(record)
    .filter(
      (entry): entry is { key: AirQualityMetricKey; value: number } =>
        entry.value !== undefined,
    )
    .map((entry) =>
      buildMetric({
        record,
        metricKey: entry.key,
        value: entry.value,
        verificationStatus: "verified",
      }),
    );

  const categoryMetric =
    record.category !== undefined
      ? [
          buildMetric({
            record,
            metricKey: "air_quality_category",
            category: record.category,
            verificationStatus: "verified",
          }),
        ]
      : [];

  const metrics: AirQualityCityMetric[] = [...numericMetrics, ...categoryMetric];
  const status = resolveAggregateStatus(
    metrics.map((metric) => metric.verificationStatus),
  );

  const provenance = buildProvenance(airQualityDataset, {
    sourceIds: record.sourceIds,
    verificationStatus: status,
  });

  return {
    citySlug: record.citySlug,
    countrySlug: record.countrySlug,
    metrics,
    summary:
      record.notes ??
      "Source-attributed air-quality measurements published from official publishers.",
    sourceIds: uniqueIds(record.sourceIds),
    datasetIds: [record.datasetId],
    dataYear: record.dataYear,
    lastUpdated: record.lastUpdated,
    verificationStatus: status,
    provenance: [provenance],
  };
}

export function normalizeAllAirQualityRecords(): AirQualityCityProfile[] {
  return airQualityDatasetRecords.map(normalizeAirQualityRecord);
}
