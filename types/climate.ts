/**
 * Climate profile for a city.
 *
 * Values are deterministic, latitude- and region-aware planning estimates
 * generated from a country climate regime baseline — they are not measured
 * station data, not a forecast, and not a weather service. `comfortScore`
 * (0–100, higher = more comfortable) is a documented composite used
 * consistently across the platform (see scripts/generate-climate.py).
 */
export interface MonthlyClimate {
  month: string;

  avgHighC: number;
  avgLowC: number;

  precipitationMm: number;
  rainyDays: number;

  sunshineHours: number;
}

export interface ClimateProfile {
  citySlug: string;

  climateZone: string;

  annualAvgTempC: number;
  annualPrecipitationMm: number;

  hottestMonth: string;
  coldestMonth: string;
  wettestMonth: string;
  driestMonth: string;

  monthly: MonthlyClimate[];

  comfortScore: number;

  createdAt: string;
  updatedAt: string;
}
