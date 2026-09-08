import { countries } from "@/lib/data/countries";
import {
  COUNTRY_ECONOMICS_INDICATOR_IDS,
  COUNTRY_ECONOMICS_RETRIEVED_AT,
  COUNTRY_ECONOMICS_SOURCE_LAST_UPDATED,
  REFERENCE_YEAR,
  countryEconomicRecords,
} from "@/lib/data/official/country-economics/dataset";
// Importing validate here runs the module-load assertion, matching the
// convention used by the country-indicators layer.
import "@/lib/data/official/country-economics/validate";
import type { CountryEconomicRecord } from "@/lib/data/official/country-economics/types";

export type CountryEconomicSort = "gdp" | "gdp-per-capita" | "az";

/**
 * The directory's default ordering. Economic size, not the alphabet and not
 * the order records happen to sit in the corpus.
 */
export const DEFAULT_COUNTRY_SORT: CountryEconomicSort = "gdp";

export const COUNTRY_SORT_LABELS: Record<CountryEconomicSort, string> = {
  gdp: "Economic size",
  "gdp-per-capita": "GDP per capita",
  az: "A–Z",
};

/**
 * What each sort actually measures, stated in the words of the source rather
 * than as a judgement. GDP is not "wealth" and GDP per capita is not "quality
 * of life"; neither phrase appears anywhere in this layer.
 */
export const COUNTRY_SORT_DESCRIPTIONS: Record<CountryEconomicSort, string> = {
  gdp: `Nominal GDP, current US$, ${REFERENCE_YEAR} — largest first`,
  "gdp-per-capita": `GDP per capita, current US$, ${REFERENCE_YEAR} — highest first`,
  az: "Country name, alphabetical",
};

const byCountrySlug = new Map(
  countryEconomicRecords.map((record) => [record.countrySlug, record]),
);

export function getCountryEconomics(
  countrySlug: string,
): CountryEconomicRecord | undefined {
  return byCountrySlug.get(countrySlug);
}

export function getCountryEconomicsMetadata() {
  const reported = countryEconomicRecords.filter(
    (record) => record.reportingStatus === "reported",
  ).length;
  return {
    referenceYear: REFERENCE_YEAR,
    retrievedAt: COUNTRY_ECONOMICS_RETRIEVED_AT,
    sourceLastUpdated: COUNTRY_ECONOMICS_SOURCE_LAST_UPDATED,
    indicatorIds: COUNTRY_ECONOMICS_INDICATOR_IDS,
    sourceId: "world-bank-wdi",
    reportedCount: reported,
    totalCount: countryEconomicRecords.length,
    unreportedCount: countryEconomicRecords.length - reported,
  };
}

/**
 * MISSING-DATA POLICY, in one place so nothing can implement it differently.
 *
 * A country the World Bank does not report has NO value. It is never coerced
 * to zero (zero sorts as the smallest economy on earth, which is a claim the
 * data does not make) and never dropped from the directory (it still has a
 * profile). It sorts after every country that does have a comparable value,
 * alphabetically among its peers, and the UI labels why.
 */
export function compareByEconomicSort(
  sort: CountryEconomicSort,
  a: { slug: string; name: string },
  b: { slug: string; name: string },
): number {
  if (sort === "az") return a.name.localeCompare(b.name);

  const field =
    sort === "gdp" ? "gdpCurrentUsd" : ("gdpPerCapitaCurrentUsd" as const);
  const av = byCountrySlug.get(a.slug)?.[field];
  const bv = byCountrySlug.get(b.slug)?.[field];

  const aHas = typeof av === "number";
  const bHas = typeof bv === "number";
  if (aHas && bHas) {
    // Numeric comparison on the raw value. Never on a formatted string: "$9B"
    // sorts above "$18T" lexicographically.
    return bv - av || a.name.localeCompare(b.name);
  }
  if (aHas) return -1;
  if (bHas) return 1;
  return a.name.localeCompare(b.name);
}

/** Supported countries in the platform's default economic order. */
export function getCountriesByEconomicSize() {
  return countries
    .slice()
    .sort((a, b) => compareByEconomicSort("gdp", a, b));
}
