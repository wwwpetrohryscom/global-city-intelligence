import type { SubmissionReviewState, SubmissionStatus } from "@/types/submissions";

/**
 * Submission workflow rules (foundation only). Pure data + pure predicates;
 * nothing here performs I/O. Encodes the intended lifecycle:
 *
 *   draft → submitted → under_review → approved → (→ Community Photo)
 *                                    ↘ rejected → draft (resubmit)
 *
 * The "→ Community Photo" step (an approved submission becoming a published
 * `Photo` with sourceType "community") is a FUTURE phase and is not
 * implemented here — an approved submission has no uploaded image yet.
 */

export const SUBMISSION_STATUSES: readonly SubmissionStatus[] = [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "rejected",
] as const;

export const SUBMISSION_REVIEW_STATES: readonly SubmissionReviewState[] = [
  "not_reviewed",
  "in_review",
  "accepted",
  "declined",
  "changes_requested",
] as const;

/** Allowed forward transitions for each status. */
export const SUBMISSION_TRANSITIONS: Record<
  SubmissionStatus,
  readonly SubmissionStatus[]
> = {
  draft: ["submitted"],
  submitted: ["under_review", "rejected"],
  // On the under_review → submitted bounce-back, the caller must reset
  // reviewState to "in_review"/"not_reviewed" (a "changes_requested" review
  // state is not consistent with the "submitted" status — see
  // STATUS_REVIEW_CONSISTENCY).
  under_review: ["approved", "rejected", "submitted"],
  approved: [],
  rejected: ["draft"],
  // `approved` is terminal in this foundation; takedown of a published photo is
  // a separate concern handled by the moderation/visibility layer, not here.
} as const;

/** Review states that are internally consistent with each workflow status. */
export const STATUS_REVIEW_CONSISTENCY: Record<
  SubmissionStatus,
  readonly SubmissionReviewState[]
> = {
  draft: ["not_reviewed"],
  submitted: ["not_reviewed", "in_review"],
  under_review: ["in_review", "changes_requested"],
  approved: ["accepted"],
  rejected: ["declined"],
} as const;

export function isSubmissionStatus(value: string): value is SubmissionStatus {
  return (SUBMISSION_STATUSES as readonly string[]).includes(value);
}

export function isSubmissionReviewState(
  value: string,
): value is SubmissionReviewState {
  return (SUBMISSION_REVIEW_STATES as readonly string[]).includes(value);
}

/** True when `to` is a permitted next status from `from`. */
export function canTransition(
  from: SubmissionStatus,
  to: SubmissionStatus,
): boolean {
  return SUBMISSION_TRANSITIONS[from].includes(to);
}

/** True when `reviewState` is consistent with `status`. */
export function isReviewStateConsistent(
  status: SubmissionStatus,
  reviewState: SubmissionReviewState,
): boolean {
  return STATUS_REVIEW_CONSISTENCY[status].includes(reviewState);
}

/** A submission is publicly visible (eligible to become a photo) only when approved. */
export function isPubliclyApproved(status: SubmissionStatus): boolean {
  return status === "approved";
}

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  approved: "Approved",
  rejected: "Rejected",
};

const REVIEW_STATE_LABEL: Record<SubmissionReviewState, string> = {
  not_reviewed: "Not reviewed",
  in_review: "In review",
  accepted: "Accepted",
  declined: "Declined",
  changes_requested: "Changes requested",
};

export function getSubmissionStatusLabel(status: SubmissionStatus): string {
  return STATUS_LABEL[status];
}

export function getSubmissionReviewStateLabel(
  state: SubmissionReviewState,
): string {
  return REVIEW_STATE_LABEL[state];
}
