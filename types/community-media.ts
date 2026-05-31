/**
 * Community media foundation types.
 *
 * FOUNDATION-ONLY MODEL: This module defines the vocabulary, record shapes,
 * policy contract, and validation result type for a future community-photo
 * submission flow. There is NO public UI, NO route, NO API endpoint, NO
 * upload form, and NO storage integration shipped alongside these types.
 *
 * Verified-source media (the existing curated catalog used in
 * `types/media.ts`, `types/nearby-places.ts`, and `lib/data/nearby-places.ts`)
 * is NOT part of this model and MUST remain separate. The
 * `"verified_source"` value on `CommunityPhotoSourceType` is reserved for
 * future UI-tab parity only; it does not bridge to the existing verified
 * media catalog and no such bridge is implied here.
 *
 * All exported types are pure data shapes. No runtime values are exported
 * from this file.
 */

/** Origin/provenance tag for a community-photo record. */
export type CommunityPhotoSourceType =
  | "verified_source"
  | "user_uploaded"
  | "moderator_added";

/** Lifecycle state of a community-photo submission. */
export type CommunityPhotoSubmissionStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "hidden"
  | "reported"
  | "removed";

/** Decision a moderator may record against a submission. */
export type CommunityPhotoModerationDecision =
  | "approve"
  | "reject"
  | "hide"
  | "remove"
  | "request_changes";

/** Safety / policy flags that may be attached to a submission or decision. */
export type CommunityPhotoSafetyFlag =
  | "people_visible"
  | "private_person_main_subject"
  | "child_visible"
  | "license_unclear"
  | "wrong_place"
  | "low_quality"
  | "duplicate"
  | "commercial_content"
  | "private_property"
  | "unsafe_activity"
  | "nudity_or_sexual_content"
  | "violence_or_disturbing"
  | "hate_or_extremism"
  | "personal_information"
  | "spam"
  | "manipulated_or_ai_generated"
  | "copyright_risk"
  | "other";

/** Visibility state distinct from lifecycle status. */
export type CommunityPhotoVisibility =
  | "private"
  | "pending"
  | "public"
  | "hidden";

/** Allowed attachment target kinds for a community photo. */
export type CommunityPhotoAttachmentTargetType =
  | "nearby_weekend_place"
  | "city"
  | "country"
  | "future_custom_place";

/** User-declared licensing intent at submission time. */
export type CommunityPhotoLicenseIntent =
  | "user_owned"
  | "user_has_permission"
  | "public_domain"
  | "creative_commons"
  | "unknown";

/** Review priority hint for the moderation queue. */
export type CommunityPhotoReviewPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

/** Full community-photo submission record (internal/admin shape). */
export interface CommunityPhotoSubmission {
  id: string;
  sourceType: CommunityPhotoSourceType;
  status: CommunityPhotoSubmissionStatus;
  visibility: CommunityPhotoVisibility;
  targetType: CommunityPhotoAttachmentTargetType;
  targetSlug: string;
  submittedByUserId: string;
  originalFilename?: string;
  storageKey?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  width?: number;
  height?: number;
  caption?: string;
  altText?: string;
  locationHint?: string;
  licenseIntent: CommunityPhotoLicenseIntent;
  userConfirmedRights: boolean;
  userConfirmedNoSensitiveContent: boolean;
  userConfirmedPlaceMatch: boolean;
  safetyFlags: readonly CommunityPhotoSafetyFlag[];
  reviewPriority: CommunityPhotoReviewPriority;
  submittedAt: string;
  updatedAt: string;
  reviewedAt?: string;
  reviewedByUserId?: string;
  moderationDecision?: CommunityPhotoModerationDecision;
  moderationNotes?: string;
  rejectionReason?: string;
  publicUrl?: string;
  thumbnailUrl?: string;
  attributionLabel?: string;
  reportCount?: number;
  hiddenReason?: string;
}

/** Minimal public-render shape for an approved community photo. */
export interface CommunityPhotoPublicRecord {
  id: string;
  sourceType: CommunityPhotoSourceType;
  targetType: CommunityPhotoAttachmentTargetType;
  targetSlug: string;
  publicUrl: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  altText: string;
  caption?: string;
  attributionLabel: string;
  approvedAt: string;
  safetyFlags: readonly CommunityPhotoSafetyFlag[];
}

/** Moderation event record tied to a submission. */
export interface CommunityPhotoModerationRecord {
  submissionId: string;
  reviewerUserId: string;
  decision: CommunityPhotoModerationDecision;
  notes?: string;
  safetyFlags: readonly CommunityPhotoSafetyFlag[];
  createdAt: string;
}

/** Policy contract governing acceptable submissions and public-use rules. */
export interface CommunityPhotoPolicy {
  maxFileSizeBytes: number;
  allowedMimeTypes: readonly string[];
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
  requiresModeration: boolean;
  allowedTargetTypes: readonly CommunityPhotoAttachmentTargetType[];
  defaultReviewPriority: CommunityPhotoReviewPriority;
  publicUseAllowedStatuses: readonly CommunityPhotoSubmissionStatus[];
}

/** Result returned by pure validation helpers (no I/O, deterministic). */
export interface CommunityPhotoValidationResult {
  ok: boolean;
  readonly errors: string[];
  readonly warnings: string[];
}
