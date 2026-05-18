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

/**
 * Short per-indicator interpretation notes surfaced in the UI.
 * Notes are deliberately conservative: they describe what the
 * indicator does NOT tell users as much as what it does, to discourage
 * ranking-style interpretation. Keep each note under ~140 characters.
 */
export const COUNTRY_INDICATOR_INTERPRETATIONS: Partial<
  Record<CountryIndicatorKey, string>
> = {
  population:
    "National scale only — not a city population value or a measure of urban density.",
  gdp_per_capita:
    "Economic context only — not a cost-of-living score or a household-income measure.",
  unemployment_rate:
    "Modeled ILO labor-market context — not a guarantee of job availability for any specific worker.",
  internet_usage:
    "Share of population that uses the internet — not a measure of connection speed or quality.",
  life_expectancy:
    "National health-context indicator — not individual health guidance.",
  health_expenditure:
    "Per-capita spending context — not a measure of healthcare quality or access for any individual.",
  co2_emissions_per_capita:
    "National emissions context — not a city-level air-quality measurement.",
  urban_population_share:
    "Share of population living in urban areas — not a quality-of-life or urban-form measure.",
  digital_access:
    "Fixed broadband subscriptions per 100 people — not a measure of overall internet quality or speed.",
};

/**
 * Indicator groups used for storytelling on the country hub. The
 * grouping is purely a UI organisation aid and does not change any
 * underlying numeric values, units, or validation rules.
 */
export type CountryIndicatorGroupKey =
  | "economic"
  | "population_urban"
  | "digital"
  | "health"
  | "environment";

export interface CountryIndicatorGroup {
  key: CountryIndicatorGroupKey;
  label: string;
  description: string;
  indicatorKeys: CountryIndicatorKey[];
}

export const COUNTRY_INDICATOR_GROUPS: CountryIndicatorGroup[] = [
  {
    key: "economic",
    label: "Economic context",
    description:
      "National-level economic signals to read alongside city-level cost and services pages.",
    indicatorKeys: ["gdp_per_capita", "unemployment_rate"],
  },
  {
    key: "population_urban",
    label: "Population and urban context",
    description:
      "National scale and urbanisation context; pair with city profiles for local detail.",
    indicatorKeys: ["population", "urban_population_share"],
  },
  {
    key: "digital",
    label: "Digital access context",
    description:
      "Connectivity context drawn from World Bank usage and subscription indicators.",
    indicatorKeys: ["internet_usage", "digital_access"],
  },
  {
    key: "health",
    label: "Health context",
    description:
      "National health-system context; not a substitute for verified city-level healthcare layers.",
    indicatorKeys: ["life_expectancy", "health_expenditure"],
  },
  {
    key: "environment",
    label: "Environment context",
    description:
      "National emissions context; read separately from city-level air-quality data.",
    indicatorKeys: ["co2_emissions_per_capita"],
  },
];
