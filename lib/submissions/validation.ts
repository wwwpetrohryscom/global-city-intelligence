import type {
  CommunityPhotoSubmission,
  CommunityPhotoSubmissionDraft,
  SubmissionReviewState,
  SubmissionStatus,
  SubmissionValidationError,
  SubmissionValidationResult,
} from "@/types/submissions";
import {
  canTransition,
  isReviewStateConsistent,
  isSubmissionReviewState,
  isSubmissionStatus,
} from "./workflow";

/**
 * Pure, synchronous submission validators (foundation only). No I/O, no
 * network, no persistence. Reference checks take the known-good slug sets as
 * arguments so the validators stay deterministic and testable; the build-time
 * guard in `lib/data/community-photo-submissions.ts` supplies the real sets
 * from `cities.ts` / `nearby-places.ts`.
 */

// Content limits — guard against empty and excessively long text (no AI / no
// image analysis; this is plain structural validation only).
export const SUBMISSION_LIMITS = {
  titleMin: 3,
  titleMax: 120,
  descriptionMin: 10,
  descriptionMax: 2000,
  photographerMin: 2,
  photographerMax: 120,
  notesMax: 1000,
  sourceFileNameMax: 255,
  maxFileSizeBytes: 25_000_000,
} as const;

const ALLOWED_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

function err(
  field: string,
  code: string,
  message: string,
): SubmissionValidationError {
  return { field, code, message, severity: "error" };
}
function warn(
  field: string,
  code: string,
  message: string,
): SubmissionValidationError {
  return { field, code, message, severity: "warning" };
}
function result(
  errors: SubmissionValidationError[],
  warnings: SubmissionValidationError[],
): SubmissionValidationResult {
  return { ok: errors.length === 0, errors, warnings };
}

function len(value: string | undefined): number {
  return value ? value.trim().length : 0;
}

/** Validate the text + file-metadata fields of a draft. */
export function validateSubmissionDraft(
  draft: CommunityPhotoSubmissionDraft,
): SubmissionValidationResult {
  const errors: SubmissionValidationError[] = [];
  const warnings: SubmissionValidationError[] = [];
  const L = SUBMISSION_LIMITS;

  if (!draft.id || !draft.id.trim()) errors.push(err("id", "required", "id is required"));

  // Empty-submission guard — a single high-level error when the record is
  // wholly blank (the per-field too_short checks below also fire; this gives a
  // clearer top-level diagnostic).
  if (len(draft.title) === 0 && len(draft.description) === 0 && len(draft.photographerName) === 0) {
    errors.push(err("*", "empty_submission", "submission has no title, description, or photographer"));
  }

  if (len(draft.title) < L.titleMin)
    errors.push(err("title", "too_short", `title must be at least ${L.titleMin} characters`));
  if (len(draft.title) > L.titleMax)
    errors.push(err("title", "too_long", `title must be at most ${L.titleMax} characters`));

  if (len(draft.description) < L.descriptionMin)
    errors.push(err("description", "too_short", `description must be at least ${L.descriptionMin} characters`));
  if (len(draft.description) > L.descriptionMax)
    errors.push(err("description", "too_long", `description must be at most ${L.descriptionMax} characters`));

  if (len(draft.photographerName) < L.photographerMin)
    errors.push(err("photographerName", "too_short", "photographerName is required"));
  if (len(draft.photographerName) > L.photographerMax)
    errors.push(err("photographerName", "too_long", `photographerName must be at most ${L.photographerMax} characters`));

  if (draft.notes !== undefined && len(draft.notes) > L.notesMax)
    errors.push(err("notes", "too_long", `notes must be at most ${L.notesMax} characters`));

  if (!draft.sourceFileName || !draft.sourceFileName.trim()) {
    errors.push(err("sourceFileName", "required", "sourceFileName metadata is required"));
  } else {
    // sourceFileName is intentionally measured untrimmed (file names may have
    // meaningful leading/trailing characters), unlike the trimmed text fields.
    if (draft.sourceFileName.length > L.sourceFileNameMax)
      errors.push(err("sourceFileName", "too_long", "sourceFileName is too long"));
    const lower = draft.sourceFileName.toLowerCase();
    if (!ALLOWED_FILE_EXTENSIONS.some((ext) => lower.endsWith(ext)))
      errors.push(err("sourceFileName", "unsupported_type", `sourceFileName must end with one of ${ALLOWED_FILE_EXTENSIONS.join(", ")}`));
  }

  if (typeof draft.sourceFileSize !== "number" || draft.sourceFileSize <= 0)
    errors.push(err("sourceFileSize", "invalid", "sourceFileSize must be a positive byte count"));
  else if (draft.sourceFileSize > L.maxFileSizeBytes)
    errors.push(err("sourceFileSize", "too_large", `sourceFileSize exceeds ${L.maxFileSizeBytes} bytes`));

  if (!draft.citySlug && !draft.nearbyPlaceSlug)
    errors.push(err("*", "no_target", "submission must reference a citySlug and/or nearbyPlaceSlug"));

  if (!draft.createdAt) errors.push(err("createdAt", "required", "createdAt is required"));
  if (!draft.updatedAt) errors.push(err("updatedAt", "required", "updatedAt is required"));

  return result(errors, warnings);
}

/** Validate that the draft's place references resolve against known slugs. */
export function validateSubmissionReferences(
  draft: Pick<CommunityPhotoSubmissionDraft, "citySlug" | "nearbyPlaceSlug">,
  known: { citySlugs: ReadonlySet<string>; nearbyPlaceSlugs: ReadonlySet<string> },
): SubmissionValidationResult {
  const errors: SubmissionValidationError[] = [];
  if (draft.citySlug && !known.citySlugs.has(draft.citySlug))
    errors.push(err("citySlug", "invalid_reference", `citySlug "${draft.citySlug}" not found`));
  if (draft.nearbyPlaceSlug && !known.nearbyPlaceSlugs.has(draft.nearbyPlaceSlug))
    errors.push(err("nearbyPlaceSlug", "invalid_reference", `nearbyPlaceSlug "${draft.nearbyPlaceSlug}" not found`));
  return result(errors, []);
}

/** Validate the status + review block are valid enums and mutually consistent. */
export function validateSubmissionState(
  status: SubmissionStatus,
  reviewState: SubmissionReviewState,
): SubmissionValidationResult {
  const errors: SubmissionValidationError[] = [];
  if (!isSubmissionStatus(status))
    errors.push(err("status", "unsupported_state", `invalid status "${status}"`));
  if (!isSubmissionReviewState(reviewState))
    errors.push(err("reviewState", "unsupported_state", `invalid reviewState "${reviewState}"`));
  if (
    isSubmissionStatus(status) &&
    isSubmissionReviewState(reviewState) &&
    !isReviewStateConsistent(status, reviewState)
  )
    errors.push(err("reviewState", "inconsistent_state", `reviewState "${reviewState}" is not consistent with status "${status}"`));
  return result(errors, []);
}

/** Validate that a proposed status change is an allowed transition. */
export function validateSubmissionTransition(
  from: SubmissionStatus,
  to: SubmissionStatus,
): SubmissionValidationResult {
  if (!canTransition(from, to))
    return result([err("status", "invalid_transition", `cannot transition from "${from}" to "${to}"`)], []);
  return result([], []);
}

/** Compose every check for one full submission record. */
export function validateSubmissionRecord(
  submission: CommunityPhotoSubmission,
  known: { citySlugs: ReadonlySet<string>; nearbyPlaceSlugs: ReadonlySet<string> },
): SubmissionValidationResult {
  const draft = validateSubmissionDraft(submission);
  const refs = validateSubmissionReferences(submission, known);
  const state = validateSubmissionState(submission.status, submission.reviewState);
  const errors = [...draft.errors, ...refs.errors, ...state.errors];
  const warnings = [...draft.warnings, ...refs.warnings, ...state.warnings];
  // Approved records should carry a review timestamp (soft expectation).
  if (submission.status === "approved" && !submission.reviewedAt)
    warnings.push(warn("reviewedAt", "missing_review_timestamp", "approved submission has no reviewedAt"));
  // Any non-draft status implies the draft was submitted (soft expectation).
  if (submission.status !== "draft" && !submission.submittedAt)
    warnings.push(warn("submittedAt", "missing_submitted_timestamp", `status "${submission.status}" has no submittedAt`));
  return result(errors, warnings);
}

/** Flag likely-duplicate submissions by (title + photographerName). Warning-level. */
export function findDuplicateSubmissionMetadata(
  submissions: readonly CommunityPhotoSubmissionDraft[],
): SubmissionValidationError[] {
  const seen = new Map<string, string>();
  const warnings: SubmissionValidationError[] = [];
  for (const s of submissions) {
    const key = `${s.title.trim().toLowerCase()}::${s.photographerName.trim().toLowerCase()}`;
    const prev = seen.get(key);
    if (prev)
      warnings.push(warn("*", "duplicate_metadata", `submission ${s.id} duplicates title+photographer of ${prev}`));
    else seen.set(key, s.id);
  }
  return warnings;
}
