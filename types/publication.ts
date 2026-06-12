import type { PhotoAttribution } from "./photos";
import type { CommunityPhotoLicenseIntent } from "./community-media";

/**
 * Community photo PUBLICATION domain model (foundation only).
 *
 * Phase 4 of the community-photo roadmap: the bridge between an approved
 * `CommunityPhotoSubmission` (see `types/submissions.ts`) and a published
 * `Photo` (see `types/photos.ts`). It models the pipeline
 *
 *   Approved Submission → Publication Candidate → (Ready) → Published Photo → Gallery
 *
 * as pure data shapes plus pure, synchronous helpers in `lib/publication/`.
 * There is NO upload, NO storage, NO persistence, NO moderation UI, NO auth,
 * NO backend, NO route, and NO automatic publishing. Converting a candidate
 * into a real `Photo` additionally needs an uploaded image (`src`/dimensions),
 * which is a LATER phase — the bridge here supplies everything except that
 * render payload.
 */

/** Lifecycle state of a publication candidate. */
export type PublicationStatus =
  | "candidate"
  | "ready"
  | "published"
  | "archived";

/** Severity of a single publication-validation finding. */
export type PublicationValidationSeverity = "error" | "warning";

/** A single, detailed publication-validation finding. */
export interface PublicationValidationError {
  /** Offending field (e.g. "title", "attribution"), or "*" for record-level. */
  field: string;
  /** Stable machine code — typically a `PublicationRule.id`. */
  code: string;
  message: string;
  severity: PublicationValidationSeverity;
}

/** Result returned by every publication validator (pure, deterministic). */
export interface PublicationValidationResult {
  ok: boolean;
  readonly errors: PublicationValidationError[];
  readonly warnings: PublicationValidationError[];
}

/** A declarative publication rule a candidate must satisfy to become publishable. */
export interface PublicationRule {
  id: string;
  description: string;
  severity: PublicationValidationSeverity;
}

/**
 * An approved submission that is eligible to become a `Photo`. The `attribution`
 * block is the shared `PhotoAttribution` shape, so a ready candidate maps
 * directly onto a community `Photo`. `submissionId` links back to the
 * originating `CommunityPhotoSubmission`.
 */
export interface PublicationCandidate {
  id: string;
  submissionId: string;
  citySlug?: string;
  nearbyPlaceSlug?: string;
  title: string;
  description: string;
  photographerName: string;
  attribution: PhotoAttribution;
  captureDate?: string;
  licenseIntent?: CommunityPhotoLicenseIntent;
  altText?: string;
  status: PublicationStatus;
  createdAt: string;
  updatedAt: string;
  /** Marks foundation fixture records (fictional; no real users/uploads). */
  isExample?: boolean;
}

/**
 * The outcome of a modeled publish attempt (pure; nothing is persisted). On
 * success `photo` is the `Photo` that WOULD be published once combined with an
 * uploaded image's render payload.
 */
export interface PublicationResult {
  ok: boolean;
  candidateId: string;
  status: PublicationStatus;
  /** Present only when the candidate is publishable and an image was supplied. */
  photo?: import("./photos").Photo;
  readonly errors: PublicationValidationError[];
  readonly warnings: PublicationValidationError[];
}
