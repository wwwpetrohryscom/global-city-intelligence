import type { CountryIndicatorKey } from "@/types";

export const COUNTRY_INDICATOR_LABELS: Record<CountryIndicatorKey, string> = {
  population: "Population",
  gdp_per_capita: "GDP per capita",
  unemployment_rate: "Unemployment rate",
  internet_usage: "Internet usage",
  life_expectancy: "Life expectancy",
  health_expenditure: "Health expenditure",
  education_index: "Education index",
  co2_emissions_per_capita: "CO₂ emissions per capita",
  urban_population_share: "Urban population share",
  public_transport_context: "Public transport context",
  digital_access: "Digital access",
};

export const COUNTRY_INDICATOR_UNITS: Partial<
  Record<CountryIndicatorKey, string>
> = {
  population: "people",
  gdp_per_capita: "USD",
  unemployment_rate: "%",
  internet_usage: "% of population",
  life_expectancy: "years",
  health_expenditure: "% of GDP",
  education_index: "index",
  co2_emissions_per_capita: "tonnes CO₂",
  urban_population_share: "% of population",
  digital_access: "% of population",
};

export const COUNTRY_INDICATOR_KEYS: CountryIndicatorKey[] = Object.keys(
  COUNTRY_INDICATOR_LABELS,
) as CountryIndicatorKey[];
