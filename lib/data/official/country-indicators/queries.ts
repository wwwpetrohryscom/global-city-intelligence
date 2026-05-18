import { countries } from "@/lib/data/countries";
import {
  countryIndicatorDataset,
  countryIndicatorRecords,
} from "@/lib/data/official/country-indicators/dataset";
import { normalizeCountryIndicatorRecords } from "@/lib/data/official/country-indicators/normalize";
// Importing validate here ensures the module-load assertion runs.
import "@/lib/data/official/country-indicators/validate";
import { getSourcesByIds } from "@/lib/data/sources";
import type {
  CountryIndicatorProfile,
  CountryIndicatorRecord,
  DataSource,
  OfficialDataset,
} from "@/types";

export function getCountryIndicatorsForCountry(
  countrySlug: string,
): CountryIndicatorRecord[] {
  return countryIndicatorRecords.filter(
    (record) => record.countrySlug === countrySlug,
  );
}

export function getCountryIndicatorProfile(
  countrySlug: string,
): CountryIndicatorProfile | undefined {
  const records = getCountryIndicatorsForCountry(countrySlug);
  return normalizeCountryIndicatorRecords(records);
}

export function hasVerifiedCountryIndicators(countrySlug: string): boolean {
  const profile = getCountryIndicatorProfile(countrySlug);
  return profile?.verificationStatus === "verified";
}

export function getCountriesWithVerifiedIndicators(): string[] {
  const slugs = Array.from(
    new Set(countryIndicatorRecords.map((record) => record.countrySlug)),
  ).filter((slug) => hasVerifiedCountryIndicators(slug));

  return slugs.filter((slug) => countries.some((entry) => entry.slug === slug));
}

export function getCountryIndicatorSources(countrySlug: string): DataSource[] {
  const profile = getCountryIndicatorProfile(countrySlug);
  if (!profile) {
    return [];
  }
  return getSourcesByIds(profile.sourceIds);
}

export function getCountryIndicatorDatasetMetadata(): OfficialDataset {
  return countryIndicatorDataset;
}
