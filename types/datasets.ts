export type MetricVerificationStatus = "verified" | "partial" | "unavailable";

export interface DatasetCoverage {
  geographyLevel: "city" | "country" | "station" | "region";
  citySlugs?: string[];
  countrySlugs?: string[];
  notes?: string;
}

export interface DataProvenance {
  datasetId: string;
  sourceIds: string[];
  publisher: string;
  retrievedAt?: string;
  lastVerified: string;
  license?: string;
  transformationNotes?: string;
  verificationStatus: MetricVerificationStatus;
}

export interface OfficialDataset {
  id: string;
  name: string;
  description: string;
  publisher: string;
  sourceIds: string[];
  dataYear: string;
  lastUpdated: string;
  license?: string;
  coverage: DatasetCoverage;
  verificationStatus: MetricVerificationStatus;
}

export interface NormalizedMetric {
  id: string;
  metricKey: string;
  label: string;
  value?: number;
  unit?: string;
  citySlug?: string;
  countrySlug?: string;
  dataYear: string;
  lastUpdated: string;
  sourceIds: string[];
  provenance: DataProvenance;
  verificationStatus: MetricVerificationStatus;
  notes?: string;
}
