import { countries } from "@/lib/data/countries";
import {
  COUNTRY_INDICATOR_DATASET_ID,
  countryIndicatorRecords,
} from "@/lib/data/official/country-indicators/dataset";
import { COUNTRY_INDICATOR_KEYS } from "@/lib/data/official/country-indicators/types";
import {
  ValidationReport,
  assertFinitePositive,
  assertNonEmptyString,
  assertSourceIdsExist,
  assertVerificationStatus,
} from "@/lib/data/official/validation";
import type { CountryIndicatorKey, CountryIndicatorRecord } from "@/types";

// Percent-of-population indicators that must fall within [0, 100].
// `digital_access` is intentionally excluded: it is sourced from the
// World Bank "Fixed broadband subscriptions (per 100 people)"
// indicator (IT.NET.BBND.P2), which is a rate per 100 people and
// can exceed 100 in countries with multi-subscription households.
const PERCENT_KEYS: ReadonlySet<CountryIndicatorKey> = new Set([
  "unemployment_rate",
  "internet_usage",
  "urban_population_share",
]);

const LIFE_EXPECTANCY_MAX = 130;

function validateRecord(
  record: CountryIndicatorRecord,
  report: ValidationReport,
): void {
  assertNonEmptyString(record.countrySlug, "countrySlug", report);
  assertNonEmptyString(record.countryCode, "countryCode", report);
  assertNonEmptyString(record.dataYear, "dataYear", report);
  assertNonEmptyString(record.lastUpdated, "lastUpdated", report);
  assertNonEmptyString(record.datasetId, "datasetId", report);

  const country = countries.find(
    (entry) => entry.slug === record.countrySlug,
  );
  if (!country) {
    report.addError(`Unknown countrySlug "${record.countrySlug}"`);
  } else if (country.iso2 !== record.countryCode) {
    report.addError(
      `Country "${record.countrySlug}" iso2 is "${country.iso2}" but record claims "${record.countryCode}"`,
    );
  }

  if (record.datasetId !== COUNTRY_INDICATOR_DATASET_ID) {
    report.addError(
      `Record for "${record.countrySlug}" references unknown datasetId "${record.datasetId}"`,
    );
  }

  if (!COUNTRY_INDICATOR_KEYS.includes(record.indicatorKey)) {
    report.addError(
      `Record for "${record.countrySlug}" uses unknown indicatorKey "${record.indicatorKey}"`,
    );
  }

  if (record.sourceIds.length === 0) {
    report.addError(
      `Record for "${record.countrySlug}/${record.indicatorKey}" must cite at least one sourceId`,
    );
  }
  assertSourceIdsExist(record.sourceIds, report);

  assertVerificationStatus(record.verificationStatus, report);

  if (
    record.verificationStatus === "verified" &&
    record.value === undefined
  ) {
    report.addError(
      `Record for "${record.countrySlug}/${record.indicatorKey}" is marked verified but has no numeric value`,
    );
  }

  assertFinitePositive(
    record.value,
    `value (${record.countrySlug}/${record.indicatorKey})`,
    report,
  );

  if (record.value !== undefined && PERCENT_KEYS.has(record.indicatorKey)) {
    if (record.value > 100) {
      report.addError(
        `Percentage indicator "${record.indicatorKey}" for "${record.countrySlug}" is > 100 (got ${record.value})`,
      );
    }
  }

  if (
    record.indicatorKey === "life_expectancy" &&
    record.value !== undefined &&
    record.value > LIFE_EXPECTANCY_MAX
  ) {
    report.addError(
      `Life expectancy for "${record.countrySlug}" is implausibly high (${record.value})`,
    );
  }
}

export function validateCountryIndicatorDataset(): ValidationReport {
  const report = new ValidationReport();

  const seen = new Set<string>();
  for (const record of countryIndicatorRecords) {
    const key = `${record.countrySlug}/${record.indicatorKey}`;
    if (seen.has(key)) {
      report.addError(
        `Duplicate country-indicator record for "${key}"`,
      );
    }
    seen.add(key);
    validateRecord(record, report);
  }

  return report;
}

const initialReport = validateCountryIndicatorDataset();
initialReport.throwIfErrors("Country-indicator dataset failed validation:");
