import type {
  DataProvenance,
  MetricVerificationStatus,
} from "./datasets";

export type AirQualityMetricKey =
  | "pm25"
  | "pm10"
  | "no2"
  | "o3"
  | "aqi"
  | "air_quality_category";

export interface AirQualityCityMetric {
  citySlug: string;
  countrySlug: string;
  metricKey: AirQualityMetricKey;
  label: string;
  value?: number;
  unit?: string;
  category?: string;
  dataYear: string;
  lastUpdated: string;
  sourceIds: string[];
  datasetId: string;
  verificationStatus: MetricVerificationStatus;
  notes?: string;
}

export interface AirQualityCityProfile {
  citySlug: string;
  countrySlug: string;
  metrics: AirQualityCityMetric[];
  summary: string;
  sourceIds: string[];
  datasetIds: string[];
  dataYear: string;
  lastUpdated: string;
  verificationStatus: MetricVerificationStatus;
  provenance: DataProvenance[];
}

export interface AirQualityDatasetRecord {
  citySlug: string;
  countrySlug: string;
  pm25?: number;
  pm10?: number;
  no2?: number;
  o3?: number;
  aqi?: number;
  category?: string;
  dataYear: string;
  lastUpdated: string;
  sourceIds: string[];
  datasetId: string;
  notes?: string;
}
