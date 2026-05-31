import type {
  CommunityPhotoPolicy,
  CommunityPhotoPublicRecord,
  CommunityPhotoSourceType,
  CommunityPhotoSubmission,
  CommunityPhotoSubmissionStatus,
  CommunityPhotoValidationResult,
} from "@/types";
import {
  canCommunityPhotoBePublic,
  getCommunityPhotoHighRiskFlags,
  getCommunityPhotoPolicy,
  isUserUploadedSource,
  requiresModeration,
  shouldBlockAutoApproval,
} from "./policy";

function ok(warnings: string[] = []): CommunityPhotoValidationResult {
  return { ok: true, errors: [], warnings };
}
function fail(errors: string[], warnings: string[] = []): CommunityPhotoValidationResult {
  return { ok: false, errors, warnings };
}

// === Draft submission ===
// Validates a partial submission BEFORE upload. Pure / synchronous.
export function validateCommunityPhotoSubmissionDraft(
  input: Pick<
    CommunityPhotoSubmission,
    | "sourceType"
    | "targetType"
    | "targetSlug"
    | "licenseIntent"
    | "userConfirmedRights"
    | "userConfirmedNoSensitiveContent"
    | "userConfirmedPlaceMatch"
    | "safetyFlags"
  > & {
    altText?: string;
    caption?: string;
  },
): CommunityPhotoValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const policy = getCommunityPhotoPolicy();

  if (!policy.allowedTargetTypes.includes(input.targetType)) {
    errors.push(`targetType ${input.targetType} is not allowed by current policy`);
  }
  if (!input.targetSlug || !input.targetSlug.trim()) {
    errors.push("targetSlug must be non-empty");
  }
  if (isUserUploadedSource(input.sourceType)) {
    if (!input.userConfirmedRights) {
      errors.push("user_uploaded submissions require userConfirmedRights=true");
    }
    if (!input.userConfirmedPlaceMatch) {
      errors.push("user_uploaded submissions require userConfirmedPlaceMatch=true");
    }
    if (!input.userConfirmedNoSensitiveContent) {
      errors.push(
        "user_uploaded submissions require userConfirmedNoSensitiveContent=true",
      );
    }
  }
  if (shouldBlockAutoApproval(input.safetyFlags)) {
    warnings.push(
      "submission carries high-risk safety flags; moderation cannot auto-approve",
    );
  }
  return errors.length === 0 ? ok(warnings) : fail(errors, warnings);
}

// === Target reference shape ===
// Pure check that the target type + slug are syntactically present and target is
// not on the deferred list. Does NOT resolve against project data — that is a
// concern for future server-side validation (see future_custom_place note).
export function validateCommunityPhotoTarget(
  targetType: CommunityPhotoSubmission["targetType"],
  targetSlug: string,
): CommunityPhotoValidationResult {
  const errors: string[] = [];
  const policy = getCommunityPhotoPolicy();
  if (!policy.allowedTargetTypes.includes(targetType)) {
    errors.push(
      `targetType ${targetType} is not enabled for public community photos in current policy`,
    );
  }
  if (!targetSlug || !targetSlug.trim()) {
    errors.push("targetSlug must be non-empty");
  }
  return errors.length === 0 ? ok() : fail(errors);
}

// === File metadata vs policy ===
export function validateCommunityPhotoFileMetadata(
  metadata: {
    mimeType?: string;
    fileSizeBytes?: number;
    width?: number;
    height?: number;
  },
  policy: CommunityPhotoPolicy = getCommunityPhotoPolicy(),
): CommunityPhotoValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (metadata.mimeType !== undefined) {
    if (!policy.allowedMimeTypes.includes(metadata.mimeType)) {
      errors.push(`mimeType ${metadata.mimeType} is not in the allowed list`);
    }
  } else {
    warnings.push("mimeType not provided; will be required at upload time");
  }
  if (metadata.fileSizeBytes !== undefined) {
    if (metadata.fileSizeBytes <= 0) errors.push("fileSizeBytes must be positive");
    if (metadata.fileSizeBytes > policy.maxFileSizeBytes)
      errors.push(
        `fileSizeBytes ${metadata.fileSizeBytes} exceeds maxFileSizeBytes ${policy.maxFileSizeBytes}`,
      );
  }
  if (metadata.width !== undefined && metadata.width < policy.minWidth) {
    errors.push(`width ${metadata.width} below policy minimum ${policy.minWidth}`);
  }
  if (metadata.height !== undefined && metadata.height < policy.minHeight) {
    errors.push(`height ${metadata.height} below policy minimum ${policy.minHeight}`);
  }
  if (policy.maxWidth !== undefined && metadata.width !== undefined && metadata.width > policy.maxWidth) {
    errors.push(`width ${metadata.width} above policy maximum ${policy.maxWidth}`);
  }
  if (policy.maxHeight !== undefined && metadata.height !== undefined && metadata.height > policy.maxHeight) {
    errors.push(`height ${metadata.height} above policy maximum ${policy.maxHeight}`);
  }
  return errors.length === 0 ? ok(warnings) : fail(errors, warnings);
}

// === Rights / sensitive-content / place-match confirmations ===
export function validateCommunityPhotoRightsConfirmation(input: {
  sourceType: CommunityPhotoSourceType;
  userConfirmedRights: boolean;
  userConfirmedNoSensitiveContent: boolean;
  userConfirmedPlaceMatch: boolean;
}): CommunityPhotoValidationResult {
  const errors: string[] = [];
  if (!isUserUploadedSource(input.sourceType)) return ok();
  if (!input.userConfirmedRights)
    errors.push("user_uploaded requires userConfirmedRights=true");
  if (!input.userConfirmedNoSensitiveContent)
    errors.push("user_uploaded requires userConfirmedNoSensitiveContent=true");
  if (!input.userConfirmedPlaceMatch)
    errors.push("user_uploaded requires userConfirmedPlaceMatch=true");
  return errors.length === 0 ? ok() : fail(errors);
}

// === Pre-publish gate ===
// Submission is allowed to transition to public only when all of these hold.
export function validateCommunityPhotoModerationReadiness(input: {
  sourceType: CommunityPhotoSourceType;
  status: CommunityPhotoSubmissionStatus;
  safetyFlags: readonly CommunityPhotoSubmission["safetyFlags"][number][];
}): CommunityPhotoValidationResult {
  const errors: string[] = [];
  if (requiresModeration(input.sourceType) && input.status !== "approved") {
    errors.push(`status ${input.status} requires moderation approval before public use`);
  }
  if (!canCommunityPhotoBePublic(input.status)) {
    errors.push(`status ${input.status} cannot be public`);
  }
  if (shouldBlockAutoApproval(input.safetyFlags)) {
    errors.push("submission carries high-risk safety flag(s); auto-approval blocked");
  }
  return errors.length === 0 ? ok() : fail(errors);
}

// === Public record gate ===
// Validates a CommunityPhotoPublicRecord shape — required for ANY render path.
export function validateCommunityPhotoPublicRecord(
  record: CommunityPhotoPublicRecord,
): CommunityPhotoValidationResult {
  const errors: string[] = [];
  if (!record.publicUrl || !record.publicUrl.trim())
    errors.push("public record must have publicUrl");
  if (!record.altText || !record.altText.trim())
    errors.push("public record must have non-empty altText");
  if (record.width <= 0) errors.push("public record width must be positive");
  if (record.height <= 0) errors.push("public record height must be positive");
  if (!record.attributionLabel || !record.attributionLabel.trim())
    errors.push("public record must have attributionLabel");
  const blocked = getCommunityPhotoHighRiskFlags();
  if (record.safetyFlags.some((f) => blocked.includes(f)))
    errors.push("public record carries a blocked safety flag");
  return errors.length === 0 ? ok() : fail(errors);
}
