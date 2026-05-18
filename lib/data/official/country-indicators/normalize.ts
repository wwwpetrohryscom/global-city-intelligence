import {
  COUNTRY_INDICATOR_DATASET_ID,
  countryIndicatorDataset,
  countryIndicatorRecords,
} from "@/lib/data/official/country-indicators/dataset";
import {
  resolveAggregateStatus,
  uniqueIds,
} from "@/lib/data/official/normalization";
import { buildProvenance } from "@/lib/data/official/provenance";
import type {
  CountryIndicatorProfile,
  CountryIndicatorRecord,
  MetricVerificationStatus,
} from "@/types";

export function normalizeCountryIndicatorRecords(
  records: CountryIndicatorRecord[],
): CountryIndicatorProfile | undefined {
  if (records.length === 0) {
    return undefined;
  }

  const first = records[0];

  const statuses: MetricVerificationStatus[] = records.map(
    (record) => record.verificationStatus,
  );
  const verificationStatus = resolveAggregateStatus(statuses);

  const sourceIds = uniqueIds(records.flatMap((record) => record.sourceIds));
  const datasetIds = uniqueIds(records.map((record) => record.datasetId));

  const provenance = uniqueIds(datasetIds).map((datasetId) =>
    buildProvenance(countryIndicatorDataset, {
      sourceIds:
        datasetId === COUNTRY_INDICATOR_DATASET_ID ? sourceIds : undefined,
      verificationStatus,
    }),
  );

  return {
    countrySlug: first.countrySlug,
    countryCode: first.countryCode,
    indicators: records,
    sourceIds,
    datasetIds,
    dataYear: first.dataYear,
    lastUpdated: first.lastUpdated,
    verificationStatus,
    provenance,
  };
}

export function normalizeAllCountryIndicatorRecords(): CountryIndicatorProfile[] {
  const grouped = new Map<string, CountryIndicatorRecord[]>();
  for (const record of countryIndicatorRecords) {
    const list = grouped.get(record.countrySlug) ?? [];
    list.push(record);
    grouped.set(record.countrySlug, list);
  }

  const profiles: CountryIndicatorProfile[] = [];
  for (const records of grouped.values()) {
    const profile = normalizeCountryIndicatorRecords(records);
    if (profile) {
      profiles.push(profile);
    }
  }
  return profiles;
}
