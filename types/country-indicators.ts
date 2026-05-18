import type {
  DataProvenance,
  MetricVerificationStatus,
} from "./datasets";

export type CountryIndicatorKey =
  | "population"
  | "gdp_per_capita"
  | "unemployment_rate"
  | "internet_usage"
  | "life_expectancy"
  | "health_expenditure"
  | "education_index"
  | "co2_emissions_per_capita"
  | "urban_population_share"
  | "public_transport_context"
  | "digital_access";

export interface CountryIndicatorRecord {
  countrySlug: string;
  countryCode: string;
  indicatorKey: CountryIndicatorKey;
  label: string;
  value?: number;
  unit?: string;
  dataYear: string;
  lastUpdated: string;
  sourceIds: string[];
  datasetId: string;
  verificationStatus: MetricVerificationStatus;
  notes?: string;
}

export interface CountryIndicatorProfile {
  countrySlug: string;
  countryCode: string;
  indicators: CountryIndicatorRecord[];
  summary?: string;
  sourceIds: string[];
  datasetIds: string[];
  dataYear: string;
  lastUpdated: string;
  verificationStatus: MetricVerificationStatus;
  provenance: DataProvenance[];
}
