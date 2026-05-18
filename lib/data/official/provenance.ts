import type {
  DataProvenance,
  MetricVerificationStatus,
  OfficialDataset,
} from "@/types";

/**
 * Build a DataProvenance object from a dataset definition plus an
 * optional override of the verification status. This is the only
 * helper that should construct provenance records, so every metric
 * is attributable to a registered dataset.
 */
export function buildProvenance(
  dataset: OfficialDataset,
  overrides: {
    sourceIds?: string[];
    retrievedAt?: string;
    license?: string;
    transformationNotes?: string;
    verificationStatus?: MetricVerificationStatus;
  } = {},
): DataProvenance {
  return {
    datasetId: dataset.id,
    sourceIds: overrides.sourceIds ?? dataset.sourceIds,
    publisher: dataset.publisher,
    retrievedAt: overrides.retrievedAt,
    lastVerified: dataset.lastUpdated,
    license: overrides.license ?? dataset.license,
    transformationNotes: overrides.transformationNotes,
    verificationStatus: overrides.verificationStatus ?? dataset.verificationStatus,
  };
}

export function isProvenanceVerified(provenance: DataProvenance): boolean {
  return provenance.verificationStatus === "verified";
}
