import { countries } from "@/lib/data/countries";
import {
  REFERENCE_YEAR,
  countryEconomicRecords,
} from "@/lib/data/official/country-economics/dataset";
import { countryIndicatorRecords } from "@/lib/data/official/country-indicators/dataset";
import { ValidationReport } from "@/lib/data/official/validation";

/**
 * Module-load validation for the country economic snapshot.
 *
 * The rules here are about MEANING, not shape. A value that is a finite number
 * in the right field still breaks the product if it belongs to a different
 * year than its neighbours, or if a missing value has been filled with zero.
 */
export function validateCountryEconomics(): ValidationReport {
  const report = new ValidationReport();
  const seen = new Set<string>();

  for (const record of countryEconomicRecords) {
    const { countrySlug } = record;

    if (seen.has(countrySlug)) {
      report.addError(`Duplicate country-economics record for "${countrySlug}"`);
    }
    seen.add(countrySlug);

    const country = countries.find((entry) => entry.slug === countrySlug);
    if (!country) {
      report.addError(`Unknown countrySlug "${countrySlug}"`);
    } else if (country.iso2 !== record.countryCode) {
      report.addError(
        `Country "${countrySlug}" iso2 is "${country.iso2}" but the economic record claims "${record.countryCode}"`,
      );
    }

    if (record.reportingStatus === "reported") {
      for (const field of ["gdpCurrentUsd", "gdpPerCapitaCurrentUsd"] as const) {
        const value = record[field];
        if (typeof value !== "number" || !Number.isFinite(value)) {
          report.addError(
            `"${countrySlug}" is marked reported but ${field} is not a finite number`,
          );
        } else if (value <= 0) {
          // Zero is the specific failure this catches: a missing value filled
          // in as 0 passes every "is it a number" check and then sorts as the
          // smallest economy in the world.
          report.addError(
            `"${countrySlug}" has a non-positive ${field} (${value}); a missing value must be absent, never zero`,
          );
        }
      }

      // Every reported row must belong to the SAME year. A row silently
      // carrying an older vintage would make the default ordering compare
      // 2024 against 2019 with nothing on screen to say so.
      if (record.dataYear !== REFERENCE_YEAR) {
        report.addError(
          `"${countrySlug}" has dataYear "${record.dataYear}" but the snapshot reference year is "${REFERENCE_YEAR}"`,
        );
      }
    } else {
      if (
        record.gdpCurrentUsd !== undefined ||
        record.gdpPerCapitaCurrentUsd !== undefined
      ) {
        report.addError(
          `"${countrySlug}" is marked not-reported but still carries a value`,
        );
      }
      if (!record.note) {
        report.addError(
          `"${countrySlug}" is marked not-reported and must explain why in "note"`,
        );
      }
    }
  }

  // Every supported country must appear, or the directory would silently drop
  // rows the moment it sorts through this layer.
  for (const country of countries) {
    if (!seen.has(country.slug)) {
      report.addError(
        `Supported country "${country.slug}" has no country-economics record`,
      );
    }
  }

  if (!/^\d{4}$/.test(REFERENCE_YEAR)) {
    report.addError(`Reference year "${REFERENCE_YEAR}" is not a four-digit year`);
  }

  // CROSS-LAYER CONSISTENCY. Both layers publish World Bank NY.GDP.PCAP.CD.
  // If they drift apart, the same metric shows two different numbers on two
  // pages of the same site, which reads as a defect no footnote can repair.
  const economicsBySlug = new Map(
    countryEconomicRecords.map((record) => [record.countrySlug, record]),
  );
  for (const indicator of countryIndicatorRecords) {
    if (indicator.indicatorKey !== "gdp_per_capita") continue;
    const economics = economicsBySlug.get(indicator.countrySlug);
    if (!economics?.gdpPerCapitaCurrentUsd || indicator.value === undefined) continue;
    if (indicator.dataYear !== economics.dataYear) continue;
    const drift =
      Math.abs(indicator.value - economics.gdpPerCapitaCurrentUsd) /
      economics.gdpPerCapitaCurrentUsd;
    if (drift > 0.001) {
      report.addError(
        `GDP per capita for "${indicator.countrySlug}" (${indicator.dataYear}) differs between layers: country-indicators has ${indicator.value}, country-economics has ${economics.gdpPerCapitaCurrentUsd}`,
      );
    }
  }

  return report;
}

const initialReport = validateCountryEconomics();
initialReport.throwIfErrors("Country-economics snapshot failed validation:");
