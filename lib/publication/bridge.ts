import type {
  Photo,
  PhotoAttribution,
  PublicationCandidate,
  PublicationResult,
  PublicationValidationError,
} from "@/types";
import type { CommunityPhotoSubmission } from "@/types/submissions";
import { licenseFromIntent, photoStatusFromPublicationStatus } from "./rules";
import {
  validatePublicationReadiness,
  type PublicationContext,
} from "./validation";

/**
 * Pure conversion helpers between the submission, publication, and photo
 * layers (foundation only). No side effects, no persistence, no publishing —
 * every function returns a value the caller may inspect.
 */

/** Internal reference scheme used as a community photo's source page until a
 * public credit route exists (a later phase). Non-empty + honest. */
export function communitySourceRef(submissionId: string): string {
  return `community-submission:${submissionId}`;
}

function buildCommunityAttribution(
  submission: CommunityPhotoSubmission,
): PhotoAttribution {
  const license = licenseFromIntent(submission.licenseIntent) ?? "";
  return {
    author: submission.photographerName,
    source: "Community submission",
    license,
    sourceUrl: communitySourceRef(submission.id),
    attributionText: license
      ? `${submission.photographerName} / Community submission, ${license}`
      : `${submission.photographerName} / Community submission`,
  };
}

/**
 * Bridge: an APPROVED submission → a `PublicationCandidate` in the initial
 * "candidate" state. Returns null when the submission is not approved (only
 * approved submissions are eligible for publication).
 */
export function submissionToPublicationCandidate(
  submission: CommunityPhotoSubmission,
): PublicationCandidate | null {
  if (submission.status !== "approved") return null;
  return {
    id: `pub-candidate-${submission.id}`,
    submissionId: submission.id,
    citySlug: submission.citySlug,
    nearbyPlaceSlug: submission.nearbyPlaceSlug,
    title: submission.title,
    description: submission.description,
    photographerName: submission.photographerName,
    attribution: buildCommunityAttribution(submission),
    captureDate: submission.captureDate,
    licenseIntent: submission.licenseIntent,
    altText: submission.altText,
    status: "candidate",
    createdAt: submission.reviewedAt ?? submission.updatedAt,
    updatedAt: submission.updatedAt,
    isExample: submission.isExample,
  };
}

/**
 * Bridge: the METADATA portion of the `Photo` a candidate would become. The
 * render payload (`src` / `width` / `height`) comes from an uploaded image in
 * a later phase and is intentionally absent here.
 */
export function candidateToPhotoMetadata(
  candidate: PublicationCandidate,
): Omit<Photo, "src" | "width" | "height"> {
  return {
    id: `photo-${candidate.id}`,
    // Slug uniqueness relies on one-candidate-per-submission plus the existing
    // photo-galleries slug guard; community slugs use a distinct `-community`
    // suffix so they never collide with the verified catalog's slugs.
    slug: `${candidate.submissionId}-community`,
    title: candidate.title,
    description: candidate.description,
    sourceType: "community",
    // Status reflects the publication status — only a published candidate maps
    // to an "approved" (gallery-surfaced) photo; others map to a non-surfacing
    // status, so a Photo built from a non-published candidate is never shown.
    status: photoStatusFromPublicationStatus(candidate.status),
    attribution: candidate.attribution,
    authorName: candidate.photographerName,
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
    citySlug: candidate.citySlug,
    nearbyPlaceSlug: candidate.nearbyPlaceSlug,
    sourceSubmissionId: candidate.submissionId,
    alt: candidate.altText ?? candidate.title,
  };
}

/** Combine a candidate's metadata with an uploaded image's render payload → `Photo`. */
export function buildPhotoFromCandidate(
  candidate: PublicationCandidate,
  image: { src: string; width: number; height: number; alt?: string },
): Photo {
  return {
    ...candidateToPhotoMetadata(candidate),
    src: image.src,
    width: image.width,
    height: image.height,
    alt: image.alt ?? candidate.altText ?? candidate.title,
  };
}

/**
 * Assess whether a candidate is publishable WITHOUT an image (the honest
 * Phase-4 terminal: readiness can be determined before any upload exists).
 * Pure; returns a `PublicationResult` with no `photo`. Folds in full readiness
 * (submission approved, references valid, rules satisfied) plus the
 * publishable-state gate.
 */
export function assessPublishability(
  candidate: PublicationCandidate,
  context: PublicationContext,
): PublicationResult {
  const readiness = validatePublicationReadiness(candidate, context);
  const errors = [...readiness.errors];
  if (candidate.status !== "ready" && candidate.status !== "published") {
    errors.push({
      field: "status",
      code: "not_publishable_state",
      message: `candidate status "${candidate.status}" is not publishable`,
      severity: "error",
    });
  }
  return {
    ok: errors.length === 0,
    candidateId: candidate.id,
    status: candidate.status,
    errors,
    warnings: [...readiness.warnings],
  };
}

/**
 * Model a publish attempt (pure; nothing is persisted). Full readiness
 * (submission approved, references valid, rules satisfied) must already have
 * been checked with `validatePublicationReadiness` / `assessPublishability` —
 * this performs the final publishable-state + attribution gate and produces the
 * would-be `Photo` once an uploaded image is supplied.
 */
export function publishCandidate(
  candidate: PublicationCandidate,
  image: { src: string; width: number; height: number; alt?: string },
): PublicationResult {
  const errors: PublicationValidationError[] = [];
  if (candidate.status !== "ready" && candidate.status !== "published") {
    errors.push({
      field: "status",
      code: "not_publishable_state",
      message: `candidate status "${candidate.status}" is not publishable`,
      severity: "error",
    });
  }
  const a = candidate.attribution;
  if (!a || !a.author || !a.source || !a.license || !a.sourceUrl) {
    errors.push({
      field: "attribution",
      code: "has_attribution",
      message: "candidate attribution is incomplete",
      severity: "error",
    });
  }
  if (errors.length > 0) {
    return { ok: false, candidateId: candidate.id, status: candidate.status, errors, warnings: [] };
  }
  return {
    ok: true,
    candidateId: candidate.id,
    status: "published",
    // Publishing transitions the candidate to "published" → an "approved"
    // (gallery-surfaced) photo, regardless of whether the input was "ready".
    photo: buildPhotoFromCandidate({ ...candidate, status: "published" }, image),
    errors: [],
    warnings: [],
  };
}
