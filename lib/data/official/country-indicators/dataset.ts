import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import type { CountryIndicatorRecord, OfficialDataset } from "@/types";

export const COUNTRY_INDICATOR_DATASET_ID =
  "global-country-indicators" as const;

/**
 * Metadata for the platform's country-indicator dataset. Begins empty
 * by design: numeric values land in `countryIndicatorRecords` only
 * after the platform integrates source-attributed records from
 * accepted publishers (see `docs/country-indicators-data.md`).
 */
export const countryIndicatorDataset: OfficialDataset = {
  id: COUNTRY_INDICATOR_DATASET_ID,
  name: "Global City Intelligence — country indicators dataset",
  description:
    "Platform-side dataset for country-level public indicators. Records are populated from accepted official publishers and remain empty until verification.",
  publisher: "Global City Intelligence",
  sourceIds: ["un-habitat", "who", "oecd-health"],
  dataYear: DATA_YEAR,
  lastUpdated: LAST_UPDATED,
  license: undefined,
  coverage: {
    geographyLevel: "country",
    countrySlugs: [],
    notes:
      "Coverage is intentionally empty at launch. The platform shows transparent fallback states until verified country indicators are integrated from accepted publishers (World Bank, OECD, UN Data, WHO, IMF, Eurostat, EEA, or official national statistical offices).",
  },
  verificationStatus: "unavailable",
};

/**
 * Country-indicator records published by the platform. Empty by
 * design — see `dataset.coverage.notes` and the data-ingestion docs
 * for the policy that gates new records.
 */
export const countryIndicatorRecords: CountryIndicatorRecord[] = [];
