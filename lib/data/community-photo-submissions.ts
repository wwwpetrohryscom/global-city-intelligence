import { cities } from "@/lib/data/cities";
import { nearbyWeekendPlaces } from "@/lib/data/nearby-places";
import { validateSubmissionRecord } from "@/lib/submissions";
import type {
  CommunityPhotoSubmission,
  SubmissionStatus,
} from "@/types/submissions";

/**
 * Community photo SUBMISSION foundation — sample dataset + data-access layer.
 *
 * Phase 3 architecture only: these are FICTIONAL, clearly-marked example
 * records (`isExample: true`) that exist solely to exercise the submission
 * model, workflow, review, and validation layers. There are no real users, no
 * uploads, no stored files (`sourceFileName` / `sourceFileSize` are metadata
 * only), no persistence, and no network.
 *
 * Referential + state integrity is enforced at module-evaluation time by
 * `assertSubmissionIntegrity` (so an invalid record fails `next build`,
 * because this module is re-exported from `lib/data/queries`) and by the
 * `validate:submissions` script gate.
 *
 * Intended publication lifecycle (documented, not implemented):
 *   draft → submitted → under_review → approved → (future) Community Photo
 * An approved submission becomes a published `Photo` (sourceType
 * "community") only once a real upload exists — a later phase.
 */

const EXAMPLE_SUBMISSIONS: CommunityPhotoSubmission[] = [
  {
    id: "example-submission-01",
    citySlug: "paris",
    title: "Example: Seine riverbank on a clear morning",
    description:
      "Fictional foundation example. A wide view along the Seine used to exercise the submission draft model.",
    photographerName: "Example Contributor A",
    sourceFileName: "example-paris-seine.jpg",
    sourceFileSize: 3_400_000,
    captureDate: "2026-05-02",
    licenseIntent: "user_owned",
    altText: "Footpath and trees along the Seine riverbank in Paris",
    notes: "Example draft, not yet submitted.",
    createdAt: "2026-06-12T09:00:00.000Z",
    updatedAt: "2026-06-12T09:00:00.000Z",
    isExample: true,
    status: "draft",
    reviewState: "not_reviewed",
  },
  {
    id: "example-submission-02",
    nearbyPlaceSlug: "blue-mountains-near-sydney",
    title: "Example: Eucalyptus ridgeline at dawn",
    description:
      "Fictional foundation example for a nearby-place submission draft attached to Blue Mountains National Park.",
    photographerName: "Example Contributor B",
    sourceFileName: "example-blue-mountains.jpg",
    sourceFileSize: 5_100_000,
    createdAt: "2026-06-12T09:05:00.000Z",
    updatedAt: "2026-06-12T09:05:00.000Z",
    isExample: true,
    status: "draft",
    reviewState: "not_reviewed",
  },
  {
    id: "example-submission-03",
    citySlug: "venice",
    title: "Example: Quiet canal away from the crowds",
    description:
      "Fictional foundation example illustrating a submitted record awaiting the review queue.",
    photographerName: "Example Contributor C",
    sourceFileName: "example-venice-canal.png",
    sourceFileSize: 4_250_000,
    createdAt: "2026-06-12T09:10:00.000Z",
    updatedAt: "2026-06-12T10:00:00.000Z",
    isExample: true,
    status: "submitted",
    submittedAt: "2026-06-12T10:00:00.000Z",
    reviewState: "not_reviewed",
  },
  {
    id: "example-submission-04",
    nearbyPlaceSlug: "calanques-near-marseille",
    title: "Example: Limestone inlet and turquoise water",
    description:
      "Fictional foundation example illustrating a submission that a reviewer has opened (in review).",
    photographerName: "Example Contributor D",
    sourceFileName: "example-calanques.jpg",
    sourceFileSize: 6_800_000,
    captureDate: "2026-04-18",
    createdAt: "2026-06-12T09:15:00.000Z",
    updatedAt: "2026-06-12T11:00:00.000Z",
    isExample: true,
    status: "submitted",
    submittedAt: "2026-06-12T10:30:00.000Z",
    reviewState: "in_review",
  },
  {
    id: "example-submission-05",
    citySlug: "regensburg",
    title: "Example: Old town rooftops above the Danube",
    description:
      "Fictional foundation example illustrating a record actively under review.",
    photographerName: "Example Contributor E",
    sourceFileName: "example-regensburg.webp",
    sourceFileSize: 2_900_000,
    createdAt: "2026-06-12T09:20:00.000Z",
    updatedAt: "2026-06-12T12:00:00.000Z",
    isExample: true,
    status: "under_review",
    submittedAt: "2026-06-12T10:45:00.000Z",
    reviewState: "in_review",
  },
  {
    id: "example-submission-06",
    nearbyPlaceSlug: "lake-annecy-near-annecy",
    title: "Example: Lakeshore path in early autumn",
    description:
      "Fictional foundation example illustrating a review that requested changes before approval.",
    photographerName: "Example Contributor F",
    sourceFileName: "example-lake-annecy.jpg",
    sourceFileSize: 4_000_000,
    createdAt: "2026-06-12T09:25:00.000Z",
    updatedAt: "2026-06-12T13:00:00.000Z",
    isExample: true,
    status: "under_review",
    submittedAt: "2026-06-12T11:15:00.000Z",
    reviewState: "changes_requested",
    reviewedAt: "2026-06-12T13:00:00.000Z",
    reviewNotes: "Example note: please provide a wider framing of the shoreline.",
  },
  {
    id: "example-submission-07",
    citySlug: "sofia",
    title: "Example: City rooftops below Vitosha",
    description:
      "Fictional foundation example illustrating an approved submission ready for the (future) publishing step.",
    photographerName: "Example Contributor G",
    sourceFileName: "example-sofia.jpg",
    sourceFileSize: 5_600_000,
    captureDate: "2026-03-30",
    licenseIntent: "creative_commons",
    altText: "City rooftops of Sofia with the Vitosha massif behind",
    createdAt: "2026-06-12T09:30:00.000Z",
    updatedAt: "2026-06-12T14:00:00.000Z",
    isExample: true,
    status: "approved",
    submittedAt: "2026-06-12T11:30:00.000Z",
    reviewState: "accepted",
    reviewedAt: "2026-06-12T14:00:00.000Z",
  },
  {
    id: "example-submission-08",
    nearbyPlaceSlug: "vitosha-near-sofia",
    title: "Example: Foggy beech forest on the slopes",
    description:
      "Fictional foundation example illustrating a rejected submission with a recorded reason.",
    photographerName: "Example Contributor H",
    sourceFileName: "example-vitosha.jpg",
    sourceFileSize: 3_100_000,
    createdAt: "2026-06-12T09:35:00.000Z",
    updatedAt: "2026-06-12T15:00:00.000Z",
    isExample: true,
    status: "rejected",
    submittedAt: "2026-06-12T12:00:00.000Z",
    reviewState: "declined",
    reviewedAt: "2026-06-12T15:00:00.000Z",
    reviewReason: "Example reason: the location could not be confirmed.",
  },
  {
    id: "example-submission-09",
    citySlug: "bolzano",
    nearbyPlaceSlug: "dolomites-near-bolzano",
    title: "Example: Alpine peaks above the valley",
    description:
      "Fictional foundation example for a dual-target draft (city plus nearby place).",
    photographerName: "Example Contributor I",
    sourceFileName: "example-dolomites.jpg",
    sourceFileSize: 7_200_000,
    createdAt: "2026-06-12T09:40:00.000Z",
    updatedAt: "2026-06-12T09:40:00.000Z",
    isExample: true,
    status: "draft",
    reviewState: "not_reviewed",
  },

  // Additional APPROVED examples — these seed the Phase 4 publication
  // candidates (a publication candidate derives from an approved submission).
  {
    id: "example-submission-10",
    citySlug: "salzburg",
    title: "Example: Old town and fortress from the river",
    description:
      "Fictional foundation example: an approved submission ready to seed a publication candidate.",
    photographerName: "Example Contributor J",
    sourceFileName: "example-salzburg.jpg",
    sourceFileSize: 5_000_000,
    captureDate: "2026-04-05",
    licenseIntent: "creative_commons",
    altText: "Salzburg old town with the Hohensalzburg fortress above the Salzach",
    createdAt: "2026-06-12T09:45:00.000Z",
    updatedAt: "2026-06-12T14:30:00.000Z",
    isExample: true,
    status: "approved",
    submittedAt: "2026-06-12T11:00:00.000Z",
    reviewState: "accepted",
    reviewedAt: "2026-06-12T14:30:00.000Z",
  },
  {
    id: "example-submission-11",
    nearbyPlaceSlug: "cliffs-of-moher-near-limerick",
    title: "Example: Sea cliffs under a grey sky",
    description:
      "Fictional foundation example: an approved nearby-place submission seeding a publication candidate.",
    photographerName: "Example Contributor K",
    sourceFileName: "example-cliffs-of-moher.jpg",
    sourceFileSize: 6_100_000,
    licenseIntent: "public_domain",
    altText: "The Cliffs of Moher rising above the Atlantic on the west coast of Ireland",
    createdAt: "2026-06-12T09:50:00.000Z",
    updatedAt: "2026-06-12T14:35:00.000Z",
    isExample: true,
    status: "approved",
    submittedAt: "2026-06-12T11:05:00.000Z",
    reviewState: "accepted",
    reviewedAt: "2026-06-12T14:35:00.000Z",
  },
  {
    id: "example-submission-12",
    citySlug: "dublin",
    title: "Example: Georgian doorways along a terrace",
    description:
      "Fictional foundation example: an approved city submission seeding a publication candidate.",
    photographerName: "Example Contributor L",
    sourceFileName: "example-dublin.jpg",
    sourceFileSize: 3_900_000,
    captureDate: "2026-05-11",
    licenseIntent: "user_owned",
    altText: "A row of colourful Georgian doorways in Dublin",
    createdAt: "2026-06-12T09:55:00.000Z",
    updatedAt: "2026-06-12T14:40:00.000Z",
    isExample: true,
    status: "approved",
    submittedAt: "2026-06-12T11:10:00.000Z",
    reviewState: "accepted",
    reviewedAt: "2026-06-12T14:40:00.000Z",
  },
  {
    id: "example-submission-13",
    nearbyPlaceSlug: "banff-national-park-near-calgary",
    title: "Example: Turquoise lake below the peaks",
    description:
      "Fictional foundation example: an approved nearby-place submission seeding a publication candidate.",
    photographerName: "Example Contributor M",
    sourceFileName: "example-banff.jpg",
    sourceFileSize: 7_000_000,
    licenseIntent: "user_has_permission",
    altText: "A glacial lake ringed by mountains in Banff National Park",
    createdAt: "2026-06-12T10:00:00.000Z",
    updatedAt: "2026-06-12T14:45:00.000Z",
    isExample: true,
    status: "approved",
    submittedAt: "2026-06-12T11:15:00.000Z",
    reviewState: "accepted",
    reviewedAt: "2026-06-12T14:45:00.000Z",
  },
  {
    id: "example-submission-14",
    citySlug: "porto",
    title: "Example: Riverside houses along the Douro",
    description:
      "Fictional foundation example: an approved city submission seeding a publication candidate.",
    photographerName: "Example Contributor N",
    sourceFileName: "example-porto.jpg",
    sourceFileSize: 4_600_000,
    captureDate: "2026-03-22",
    licenseIntent: "creative_commons",
    altText: "Colourful riverside houses of the Ribeira district in Porto",
    createdAt: "2026-06-12T10:05:00.000Z",
    updatedAt: "2026-06-12T14:50:00.000Z",
    isExample: true,
    status: "approved",
    submittedAt: "2026-06-12T11:20:00.000Z",
    reviewState: "accepted",
    reviewedAt: "2026-06-12T14:50:00.000Z",
  },
];

function assertSubmissionIntegrity(
  submissions: readonly CommunityPhotoSubmission[],
): void {
  const known = {
    citySlugs: new Set(cities.map((c) => c.slug)),
    nearbyPlaceSlugs: new Set(nearbyWeekendPlaces.map((p) => p.slug)),
  };
  const seenIds = new Set<string>();
  const errors: string[] = [];

  for (const submission of submissions) {
    const tag = submission.id || "<unknown>";
    if (!submission.id) errors.push(`${tag}: missing id`);
    else if (seenIds.has(submission.id)) errors.push(`${submission.id}: duplicate submission id`);
    if (submission.id) seenIds.add(submission.id);

    const res = validateSubmissionRecord(submission, known);
    for (const e of res.errors) {
      errors.push(`${tag}: [${e.field}] ${e.message}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid community photo submissions (${errors.length}):\n  - ${errors.join("\n  - ")}`,
    );
  }
}

// Build-time gate: throws (and fails `next build`) on any invalid record.
assertSubmissionIntegrity(EXAMPLE_SUBMISSIONS);

export const communityPhotoSubmissions: readonly CommunityPhotoSubmission[] =
  EXAMPLE_SUBMISSIONS;

// ---- data-access layer (static; no persistence) ----

export function getAllSubmissions(): readonly CommunityPhotoSubmission[] {
  return communityPhotoSubmissions;
}

export function getSubmissionById(id: string): CommunityPhotoSubmission | undefined {
  return communityPhotoSubmissions.find((s) => s.id === id);
}

export function getSubmissionsByStatus(
  status: SubmissionStatus,
): readonly CommunityPhotoSubmission[] {
  return communityPhotoSubmissions.filter((s) => s.status === status);
}

export function getDraftSubmissions(): readonly CommunityPhotoSubmission[] {
  return getSubmissionsByStatus("draft");
}

export function getApprovedSubmissions(): readonly CommunityPhotoSubmission[] {
  return getSubmissionsByStatus("approved");
}

export function getSubmissionsForCity(
  citySlug: string,
): readonly CommunityPhotoSubmission[] {
  return communityPhotoSubmissions.filter((s) => s.citySlug === citySlug);
}

export function getSubmissionsForNearbyPlace(
  nearbyPlaceSlug: string,
): readonly CommunityPhotoSubmission[] {
  return communityPhotoSubmissions.filter((s) => s.nearbyPlaceSlug === nearbyPlaceSlug);
}

/** Approved submissions attached to a city (the future-photo pipeline for that city). */
export function getApprovedSubmissionsForCity(
  citySlug: string,
): readonly CommunityPhotoSubmission[] {
  return communityPhotoSubmissions.filter(
    (s) => s.status === "approved" && s.citySlug === citySlug,
  );
}

/** Approved submissions attached to a nearby place. */
export function getApprovedSubmissionsForNearbyPlace(
  nearbyPlaceSlug: string,
): readonly CommunityPhotoSubmission[] {
  return communityPhotoSubmissions.filter(
    (s) => s.status === "approved" && s.nearbyPlaceSlug === nearbyPlaceSlug,
  );
}
