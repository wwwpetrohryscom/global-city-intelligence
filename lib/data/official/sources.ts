import type { DataSource } from "@/types";

export interface OfficialSourceCandidate {
  id: string;
  name: string;
  organization: string;
  url: string;
  description: string;
  reliabilityNote: string;
}

/**
 * Trusted source candidates that may back official dataset records.
 * Adding an entry here does not automatically register the source — it
 * must also be present in `lib/data/sources/index.ts` to be cited by
 * dataset records or JSON-LD. This file is a documentation surface
 * for sources that have been reviewed against the accepted-source
 * policy described in `docs/data-ingestion.md`.
 */
export const trustedOfficialSourceCandidates: OfficialSourceCandidate[] = [
  {
    id: "openaq",
    name: "OpenAQ open air-quality platform",
    organization: "OpenAQ",
    url: "https://openaq.org/",
    description:
      "Open-source aggregator of air-quality monitoring data sourced from government and research institutions worldwide.",
    reliabilityNote:
      "Used as a primary aggregator of station-level air-quality measurements attributed back to official publishers.",
  },
];

export function listTrustedOfficialSourceCandidates(): OfficialSourceCandidate[] {
  return trustedOfficialSourceCandidates;
}

export function findTrustedOfficialSourceCandidate(
  id: string,
): OfficialSourceCandidate | undefined {
  return trustedOfficialSourceCandidates.find((candidate) => candidate.id === id);
}

/**
 * Helper used by dataset modules to assert that every source they
 * cite is present in the central source registry. Returns the set of
 * missing source IDs.
 */
export function findMissingSourceIds(
  sourceIds: string[],
  registry: DataSource[],
): string[] {
  const known = new Set(registry.map((source) => source.id));
  return sourceIds.filter((id) => !known.has(id));
}
