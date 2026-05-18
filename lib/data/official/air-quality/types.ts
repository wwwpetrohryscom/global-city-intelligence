import type { AirQualityMetricKey } from "@/types";

export const AIR_QUALITY_METRIC_LABELS: Record<AirQualityMetricKey, string> = {
  pm25: "PM2.5",
  pm10: "PM10",
  no2: "Nitrogen dioxide (NO₂)",
  o3: "Ozone (O₃)",
  aqi: "Air Quality Index",
  air_quality_category: "Air quality category",
};

export const AIR_QUALITY_METRIC_UNITS: Partial<Record<AirQualityMetricKey, string>> = {
  pm25: "µg/m³",
  pm10: "µg/m³",
  no2: "µg/m³",
  o3: "µg/m³",
};
