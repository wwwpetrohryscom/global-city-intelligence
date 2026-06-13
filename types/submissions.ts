/**
 * Community photo SUBMISSION domain model (foundation only).
 *
 * Phase 3 of the community-photo roadmap: the draft → review → approval
 * lifecycle a contributor's photo moves through BEFORE any upload, storage,
 * auth, moderation UI, or publishing exists. Everything here is a pure data
 * shape or (in `lib/submissions/`) a pure, synchronous validator. There is NO
 * upload, NO network, NO persistence, NO API, and NO route.
 *
 * Relationship to the other photo modules:
 *   - `types/photos.ts`           → an APPROVED, published photo + galleries
 *      (Phase 1-2). An approved submission is the input to that layer.
 *   - `types/community-media.ts`  → the heavier INTERNAL moderation/admin
 *      record (`CommunityPhotoSubmission` there carries userId / storageKey /
 *      safetyFlags / visibility) used by the moderation queue (Phase 4-5).
 *
 * NOTE ON NAMING: this module also exports a `CommunityPhotoSubmission` type.
 * It is the PUBLIC, lightweight draft-lifecycle record (no user ids, no
 * storage keys, no real files) and is intentionally distinct from the
 * internal admin record of the same name in `types/community-media.ts`. To
 * avoid a barrel name clash, the new types are imported from
 * `@/types/submissions` directly; the non-colliding ones are also re-exported
 * from `@/types`.
 */

import type { CommunityPhotoLicenseIntent } from "./community-media";

/** Public workflow state of a submission. */
export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected";

/** Reviewer-facing sub-state, recorded by a future moderation flow. */
export type SubmissionReviewState =
  | "not_reviewed"
  | "in_review"
  | "accepted"
  | "declined"
  | "changes_requested";

/** Severity of a single validation finding. */
export type SubmissionValidationSeverity = "error" | "warning";

/** A single, detailed validation finding. */
export interface SubmissionValidationError {
  /** The offending field (e.g. "title", "citySlug"), or "*" for record-level. */
  field: string;
  /** Stable machine code (e.g. "required", "too_long", "invalid_reference"). */
  code: string;
  /** Human-readable explanation. */
  message: string;
  severity: SubmissionValidationSeverity;
}

/** Result returned by every submission validator (pure, deterministic). */
export interface SubmissionValidationResult {
  ok: boolean;
  readonly errors: SubmissionValidationError[];
  readonly warnings: SubmissionValidationError[];
}

/**
 * A draft a contributor composes. `sourceFileName` / `sourceFileSize` are
 * metadata only — no file is uploaded or stored at this phase. At least one
 * of `citySlug` / `nearbyPlaceSlug` ties the draft to a place.
 */
export interface CommunityPhotoSubmissionDraft {
  id: string;
  citySlug?: string;
  nearbyPlaceSlug?: string;
  title: string;
  description: string;
  photographerName: string;
  /** File name metadata only; NOT a stored or uploaded file. */
  sourceFileName: string;
  /** Declared file size in bytes (metadata only). */
  sourceFileSize: number;
  /** Optional ISO date the photo was taken. */
  captureDate?: string;
  notes?: string;
  /**
   * Declared licensing intent (reuses the moderation vocabulary). Captured so
   * an approved submission can later become a published `Photo`, whose
   * attribution REQUIRES a license. Declaration only — no rights are granted
   * or verified at this phase.
   */
  licenseIntent?: CommunityPhotoLicenseIntent;
  /** Contributor-declared alt text, carried through to the future `Photo`. */
  altText?: string;
  createdAt: string;
  updatedAt: string;
  /** Marks foundation fixture records (fictional; no real users/uploads). */
  isExample?: boolean;
}

/**
 * A draft that has entered the lifecycle: it carries a workflow `status` and
 * an embedded review block. `status: "draft"` records may still be stored
 * here (a draft is a submission whose lifecycle has not advanced).
 */
export interface CommunityPhotoSubmission extends CommunityPhotoSubmissionDraft {
  status: SubmissionStatus;
  /** ISO timestamp set when a draft is first submitted. */
  submittedAt?: string;
  reviewState: SubmissionReviewState;
  reviewedAt?: string;
  reviewReason?: string;
  reviewNotes?: string;
  // Reviewer identity is intentionally NOT modeled here — it belongs to the
  // future auth/moderation phase and will be added then as an optional field
  // (additive, non-breaking). Accounts/auth are out of scope for this phase.
}
