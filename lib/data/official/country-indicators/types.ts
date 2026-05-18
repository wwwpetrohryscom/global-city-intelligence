import type { CountryIndicatorKey } from "@/types";

export const COUNTRY_INDICATOR_LABELS: Record<CountryIndicatorKey, string> = {
  population: "Population",
  gdp_per_capita: "GDP per capita",
  unemployment_rate: "Unemployment rate",
  internet_usage: "Internet usage",
  life_expectancy: "Life expectancy",
  health_expenditure: "Health expenditure per capita",
  education_index: "Education index",
  co2_emissions_per_capita: "CO₂ emissions per capita",
  urban_population_share: "Urban population share",
  public_transport_context: "Public transport context",
  // `digital_access` is currently sourced from the World Bank
  // "Fixed broadband subscriptions (per 100 people)" indicator
  // (IT.NET.BBND.P2). The label and unit reflect that mapping
  // explicitly so the indicator is not mistaken for a broader
  // "general internet access" measurement.
  digital_access: "Fixed broadband subscriptions",
};

export const COUNTRY_INDICATOR_UNITS: Partial<
  Record<CountryIndicatorKey, string>
> = {
  population: "people",
  gdp_per_capita: "current US$",
  unemployment_rate: "percent",
  internet_usage: "percent",
  life_expectancy: "years",
  health_expenditure: "current US$",
  education_index: "index",
  co2_emissions_per_capita: "metric tons per capita",
  urban_population_share: "percent",
  digital_access: "per 100 people",
};

export const COUNTRY_INDICATOR_KEYS: CountryIndicatorKey[] = Object.keys(
  COUNTRY_INDICATOR_LABELS,
) as CountryIndicatorKey[];
