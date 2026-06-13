import { cities } from "@/lib/data/cities";
import { communityPhotoSubmissions } from "@/lib/data/community-photo-submissions";
import { nearbyWeekendPlaces } from "@/lib/data/nearby-places";
import {
  validatePublicationReadiness,
  type PublicationContext,
} from "@/lib/publication";
import type { PublicationCandidate, PublicationStatus } from "@/types";

/**
 * Community photo PUBLICATION foundation — sample candidates + data-access.
 *
 * Phase 4 architecture only. These are FICTIONAL, clearly-marked example
 * records (`isExample: true`), each DERIVED from an approved example
 * submission (see lib/data/community-photo-submissions.ts), used solely to
 * exercise the publication model, rules, bridges, and validators. No real
 * users, no uploads, no stored files, no persistence, no actual publishing.
 *
 * Attribution mirrors what `submissionToPublicationCandidate` produces:
 * author = photographerName, source = "Community submission", license derived
 * from the contributor's licenseIntent, and a `community-submission:<id>`
 * source reference (a public credit route is a later phase).
 *
 * Integrity is enforced at module evaluation by `assertPublicationIntegrity`
 * (so an invalid record fails `next build`, because this module is re-exported
 * from lib/data/queries) and by the `validate:publication` script.
 */

const EXAMPLE_CANDIDATES: PublicationCandidate[] = [
  {
    id: "pub-candidate-example-submission-07",
    submissionId: "example-submission-07",
    citySlug: "sofia",
    title: "Example: City rooftops below Vitosha",
    description:
      "Fictional foundation example illustrating an approved submission that has been published.",
    photographerName: "Example Contributor G",
    attribution: {
      author: "Example Contributor G",
      source: "Community submission",
      license: "CC BY-SA 4.0",
      sourceUrl: "community-submission:example-submission-07",
      attributionText: "Example Contributor G / Community submission, CC BY-SA 4.0",
    },
    captureDate: "2026-03-30",
    licenseIntent: "creative_commons",
    altText: "City rooftops of Sofia with the Vitosha massif behind",
    status: "published",
    createdAt: "2026-06-12T14:00:00.000Z",
    updatedAt: "2026-06-12T16:00:00.000Z",
    isExample: true,
  },
  {
    id: "pub-candidate-example-submission-10",
    submissionId: "example-submission-10",
    citySlug: "salzburg",
    title: "Example: Old town and fortress from the river",
    description:
      "Fictional foundation example illustrating a candidate validated and ready to publish.",
    photographerName: "Example Contributor J",
    attribution: {
      author: "Example Contributor J",
      source: "Community submission",
      license: "CC BY-SA 4.0",
      sourceUrl: "community-submission:example-submission-10",
      attributionText: "Example Contributor J / Community submission, CC BY-SA 4.0",
    },
    captureDate: "2026-04-05",
    licenseIntent: "creative_commons",
    altText: "Salzburg old town with the Hohensalzburg fortress above the Salzach",
    status: "ready",
    createdAt: "2026-06-12T14:30:00.000Z",
    updatedAt: "2026-06-12T15:30:00.000Z",
    isExample: true,
  },
  {
    id: "pub-candidate-example-submission-11",
    submissionId: "example-submission-11",
    nearbyPlaceSlug: "cliffs-of-moher-near-limerick",
    title: "Example: Sea cliffs under a grey sky",
    description:
      "Fictional foundation example illustrating a nearby-place candidate ready to publish.",
    photographerName: "Example Contributor K",
    attribution: {
      author: "Example Contributor K",
      source: "Community submission",
      license: "Public domain",
      sourceUrl: "community-submission:example-submission-11",
      attributionText: "Example Contributor K / Community submission, Public domain",
    },
    licenseIntent: "public_domain",
    altText: "The Cliffs of Moher rising above the Atlantic on the west coast of Ireland",
    status: "ready",
    createdAt: "2026-06-12T14:35:00.000Z",
    updatedAt: "2026-06-12T15:35:00.000Z",
    isExample: true,
  },
  {
    id: "pub-candidate-example-submission-12",
    submissionId: "example-submission-12",
    citySlug: "dublin",
    title: "Example: Georgian doorways along a terrace",
    description:
      "Fictional foundation example illustrating a freshly created publication candidate.",
    photographerName: "Example Contributor L",
    attribution: {
      author: "Example Contributor L",
      source: "Community submission",
      license: "Used with contributor's permission",
      sourceUrl: "community-submission:example-submission-12",
      attributionText:
        "Example Contributor L / Community submission, Used with contributor's permission",
    },
    captureDate: "2026-05-11",
    licenseIntent: "user_owned",
    altText: "A row of colourful Georgian doorways in Dublin",
    status: "candidate",
    createdAt: "2026-06-12T14:40:00.000Z",
    updatedAt: "2026-06-12T14:40:00.000Z",
    isExample: true,
  },
  {
    id: "pub-candidate-example-submission-13",
    submissionId: "example-submission-13",
    nearbyPlaceSlug: "banff-national-park-near-calgary",
    title: "Example: Turquoise lake below the peaks",
    description:
      "Fictional foundation example illustrating a freshly created nearby-place candidate.",
    photographerName: "Example Contributor M",
    attribution: {
      author: "Example Contributor M",
      source: "Community submission",
      license: "Used with permission",
      sourceUrl: "community-submission:example-submission-13",
      attributionText: "Example Contributor M / Community submission, Used with permission",
    },
    licenseIntent: "user_has_permission",
    altText: "A glacial lake ringed by mountains in Banff National Park",
    status: "candidate",
    createdAt: "2026-06-12T14:45:00.000Z",
    updatedAt: "2026-06-12T14:45:00.000Z",
    isExample: true,
  },
  {
    id: "pub-candidate-example-submission-14",
    submissionId: "example-submission-14",
    citySlug: "porto",
    title: "Example: Riverside houses along the Douro",
    description:
      "Fictional foundation example illustrating a previously published photo that has been archived.",
    photographerName: "Example Contributor N",
    attribution: {
      author: "Example Contributor N",
      source: "Community submission",
      license: "CC BY-SA 4.0",
      sourceUrl: "community-submission:example-submission-14",
      attributionText: "Example Contributor N / Community submission, CC BY-SA 4.0",
    },
    captureDate: "2026-03-22",
    licenseIntent: "creative_commons",
    altText: "Colourful riverside houses of the Ribeira district in Porto",
    status: "archived",
    createdAt: "2026-06-12T14:50:00.000Z",
    updatedAt: "2026-06-12T16:30:00.000Z",
    isExample: true,
  },
];

// Every example candidate is derived (by construction) from an APPROVED
// submission with complete attribution, so the guard applies full
// `validatePublicationReadiness` to all of them — including early
// `candidate`-status records — as an invariant of this fixture dataset.
function assertPublicationIntegrity(
  candidates: readonly PublicationCandidate[],
): void {
  const approvedSubmissionIds = new Set(
    communityPhotoSubmissions.filter((s) => s.status === "approved").map((s) => s.id),
  );
  const context: PublicationContext = {
    citySlugs: new Set(cities.map((c) => c.slug)),
    nearbyPlaceSlugs: new Set(nearbyWeekendPlaces.map((p) => p.slug)),
    approvedSubmissionIds,
    knownSubmissionIds: new Set(communityPhotoSubmissions.map((s) => s.id)),
  };
  const seenIds = new Set<string>();
  const seenSubmissionIds = new Set<string>();
  const errors: string[] = [];

  for (const candidate of candidates) {
    const tag = candidate.id || "<unknown>";
    if (!candidate.id) errors.push(`${tag}: missing id`);
    else if (seenIds.has(candidate.id)) errors.push(`${candidate.id}: duplicate candidate id`);
    if (candidate.id) seenIds.add(candidate.id);

    if (candidate.submissionId) {
      if (seenSubmissionIds.has(candidate.submissionId))
        errors.push(`${tag}: duplicate submissionId "${candidate.submissionId}" (one candidate per submission)`);
      seenSubmissionIds.add(candidate.submissionId);
    }

    const res = validatePublicationReadiness(candidate, context);
    for (const e of res.errors) errors.push(`${tag}: [${e.field}] ${e.message}`);
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid publication candidates (${errors.length}):\n  - ${errors.join("\n  - ")}`,
    );
  }
}

// Build-time gate: throws (and fails `next build`) on any invalid record.
assertPublicationIntegrity(EXAMPLE_CANDIDATES);

export const publicationCandidates: readonly PublicationCandidate[] =
  EXAMPLE_CANDIDATES;

// ---- data-access layer (static; no persistence) ----

export function getPublicationCandidates(): readonly PublicationCandidate[] {
  return publicationCandidates;
}

export function getPublicationCandidateById(
  id: string,
): PublicationCandidate | undefined {
  return publicationCandidates.find((c) => c.id === id);
}

export function getCandidatesByStatus(
  status: PublicationStatus,
): readonly PublicationCandidate[] {
  return publicationCandidates.filter((c) => c.status === status);
}

export function getReadyCandidates(): readonly PublicationCandidate[] {
  return getCandidatesByStatus("ready");
}

export function getPublishedCandidates(): readonly PublicationCandidate[] {
  return getCandidatesByStatus("published");
}

export function getArchivedCandidates(): readonly PublicationCandidate[] {
  return getCandidatesByStatus("archived");
}

export function getCandidatesForCity(
  citySlug: string,
): readonly PublicationCandidate[] {
  return publicationCandidates.filter((c) => c.citySlug === citySlug);
}

export function getCandidatesForNearbyPlace(
  nearbyPlaceSlug: string,
): readonly PublicationCandidate[] {
  return publicationCandidates.filter((c) => c.nearbyPlaceSlug === nearbyPlaceSlug);
}

export function getCandidateForSubmission(
  submissionId: string,
): PublicationCandidate | undefined {
  return publicationCandidates.find((c) => c.submissionId === submissionId);
}
