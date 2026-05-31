import type {
  CommunityPhotoPolicy,
  CommunityPhotoReviewPriority,
  CommunityPhotoSafetyFlag,
  CommunityPhotoSourceType,
  CommunityPhotoSubmissionStatus,
  CommunityPhotoVisibility,
} from "@/types";

// Default platform policy. Foundation-only: nothing reads this at runtime yet.
const DEFAULT_POLICY: CommunityPhotoPolicy = {
  maxFileSizeBytes: 15_000_000,           // 15 MB
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"] as const,
  minWidth: 800,
  minHeight: 600,
  maxWidth: 8000,
  maxHeight: 8000,
  requiresModeration: true,
  allowedTargetTypes: [
    "nearby_weekend_place",
    "city",
    "country",
  ] as const,
  defaultReviewPriority: "normal",
  publicUseAllowedStatuses: ["approved"] as const,
};

export function getCommunityPhotoPolicy(): CommunityPhotoPolicy {
  return DEFAULT_POLICY;
}

// Frozen label maps (English; future i18n is out of scope for the foundation pass).
const STATUS_LABEL: Record<CommunityPhotoSubmissionStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  approved: "Approved community photo",
  rejected: "Rejected submission",
  hidden: "Hidden community photo",
  reported: "Reported community photo",
  removed: "Removed submission",
};

const SOURCE_LABEL: Record<CommunityPhotoSourceType, string> = {
  verified_source: "Verified source image",
  user_uploaded: "Community photo",
  moderator_added: "Moderator-added image",
};

const SAFETY_FLAG_LABEL: Record<CommunityPhotoSafetyFlag, string> = {
  people_visible: "People visible",
  private_person_main_subject: "Private person as main subject",
  child_visible: "Child visible",
  license_unclear: "License unclear",
  wrong_place: "Wrong place",
  low_quality: "Low quality",
  duplicate: "Duplicate",
  commercial_content: "Commercial content",
  private_property: "Private property",
  unsafe_activity: "Unsafe activity",
  nudity_or_sexual_content: "Nudity or sexual content",
  violence_or_disturbing: "Violence or disturbing content",
  hate_or_extremism: "Hate or extremist content",
  personal_information: "Personal information visible",
  spam: "Spam",
  manipulated_or_ai_generated: "Manipulated or AI-generated",
  copyright_risk: "Copyright risk",
  other: "Other concern",
};

export function getCommunityPhotoStatusLabel(status: CommunityPhotoSubmissionStatus): string {
  return STATUS_LABEL[status];
}
export function getCommunityPhotoSourceLabel(sourceType: CommunityPhotoSourceType): string {
  return SOURCE_LABEL[sourceType];
}
export function getCommunityPhotoSafetyFlagLabel(flag: CommunityPhotoSafetyFlag): string {
  return SAFETY_FLAG_LABEL[flag];
}

// Visibility derivation from status. user-facing UI must use this — never set visibility directly.
export function getCommunityPhotoVisibilityForStatus(
  status: CommunityPhotoSubmissionStatus,
): CommunityPhotoVisibility {
  switch (status) {
    case "draft":
      return "private";
    case "pending_review":
    case "reported":
      return "pending";
    case "approved":
      return "public";
    case "rejected":
    case "hidden":
    case "removed":
      return "hidden";
  }
}

export function canCommunityPhotoBePublic(status: CommunityPhotoSubmissionStatus): boolean {
  return DEFAULT_POLICY.publicUseAllowedStatuses.includes(status);
}

export function requiresModeration(sourceType: CommunityPhotoSourceType): boolean {
  // user_uploaded ALWAYS requires moderation; moderator_added may require review
  // depending on platform policy; verified_source does NOT use this lifecycle
  // (it's bridged from the existing verified media catalog at a later stage).
  if (sourceType === "user_uploaded") return true;
  if (sourceType === "moderator_added") return true;
  return false;
}

export function isUserUploadedSource(sourceType: CommunityPhotoSourceType): boolean {
  return sourceType === "user_uploaded";
}
export function isVerifiedSource(sourceType: CommunityPhotoSourceType): boolean {
  return sourceType === "verified_source";
}

// High-risk flag set — must never auto-approve and must use high or urgent priority.
const HIGH_RISK_FLAGS: readonly CommunityPhotoSafetyFlag[] = [
  "child_visible",
  "private_person_main_subject",
  "personal_information",
  "violence_or_disturbing",
  "hate_or_extremism",
  "nudity_or_sexual_content",
  "copyright_risk",
  "manipulated_or_ai_generated",
] as const;

export function getDefaultCommunityPhotoReviewPriority(
  flags: readonly CommunityPhotoSafetyFlag[],
): CommunityPhotoReviewPriority {
  if (flags.some((f) => HIGH_RISK_FLAGS.includes(f))) return "high";
  return DEFAULT_POLICY.defaultReviewPriority;
}

export function shouldBlockAutoApproval(
  flags: readonly CommunityPhotoSafetyFlag[],
): boolean {
  return flags.some((f) => HIGH_RISK_FLAGS.includes(f));
}

export function getCommunityPhotoHighRiskFlags(): readonly CommunityPhotoSafetyFlag[] {
  return HIGH_RISK_FLAGS;
}
