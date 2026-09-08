/**
 * Country economic snapshot — the ordering layer for the country directory.
 *
 * WHY A SEPARATE LAYER: the existing `country-indicators` dataset carries
 * GDP per capita for 25 countries only, which cannot order a 105-country
 * directory. This layer covers every supported country, carries nominal GDP
 * as well, and pins one reference year so nothing is compared across vintages.
 *
 * WHAT IT IS NOT: it is not a score. Nothing here is modelled, weighted or
 * combined with Global City Intelligence scores. Two official World Bank
 * indicators are stored as published, and ordering is a plain sort on one of
 * them.
 */
export type CountryEconomicReportingStatus = "reported" | "not-reported";

export interface CountryEconomicRecord {
  countrySlug: string;
  /** ISO 3166-1 alpha-2, matching `lib/data/countries.ts`. */
  countryCode: string;
  /** World Bank country id (ISO 3166-1 alpha-3). Absent when not reported. */
  iso3Code?: string;
  /** NY.GDP.MKTP.CD, current US$. Absent when not reported. */
  gdpCurrentUsd?: number;
  /** NY.GDP.PCAP.CD, current US$. Absent when not reported. */
  gdpPerCapitaCurrentUsd?: number;
  /** Always the snapshot reference year when present — never a per-row vintage. */
  dataYear?: string;
  reportingStatus: CountryEconomicReportingStatus;
  /** Why a country carries no value. Required when not reported. */
  note?: string;
}
