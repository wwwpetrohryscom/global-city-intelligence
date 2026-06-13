import type {
  CommunityPhotoLicenseIntent,
  PhotoStatus,
  PublicationRule,
  PublicationStatus,
} from "@/types";

/**
 * Publication workflow rules + status machine (foundation only). Pure data and
 * pure predicates; no I/O. Encodes the pipeline:
 *
 *   candidate → ready → published → archived
 *
 * documented end-to-end (with the upstream submission lifecycle) as:
 *   draft → submitted → under_review → approved → candidate → ready → published → (gallery)
 */

export const PUBLICATION_STATUSES: readonly PublicationStatus[] = [
  "candidate",
  "ready",
  "published",
  "archived",
] as const;

/** Allowed forward transitions for each publication status. */
export const PUBLICATION_TRANSITIONS: Record<
  PublicationStatus,
  readonly PublicationStatus[]
> = {
  candidate: ["ready", "archived"],
  // A `ready` candidate may regress to `candidate` if re-validation fails.
  ready: ["published", "candidate", "archived"],
  published: ["archived"],
  // An archived photo may be re-published in a later phase. Note re-publishing
  // flows through this status flip FIRST: `publishCandidate` only accepts a
  // candidate already in `ready`/`published`, not `archived`.
  archived: ["published"],
} as const;

export function isPublicationStatus(value: string): value is PublicationStatus {
  return (PUBLICATION_STATUSES as readonly string[]).includes(value);
}

export function canPublicationTransition(
  from: PublicationStatus,
  to: PublicationStatus,
): boolean {
  return PUBLICATION_TRANSITIONS[from].includes(to);
}

/** A candidate is surfaced publicly (i.e. has become a gallery photo) only when published. */
export function isPubliclyPublished(status: PublicationStatus): boolean {
  return status === "published";
}

/**
 * Map a publication status onto the render-layer `PhotoStatus`. Only a
 * `published` candidate yields an `approved` photo (the only status the gallery
 * layer surfaces); everything else maps to a non-surfacing status, so a Photo
 * built from a non-published candidate is never shown.
 */
export function photoStatusFromPublicationStatus(
  status: PublicationStatus,
): PhotoStatus {
  switch (status) {
    case "published":
      return "approved";
    case "candidate":
    case "ready":
      return "pending";
    case "archived":
      return "rejected";
  }
}

/**
 * The rules every candidate must satisfy before it can become publishable
 * (`ready` → `published`). Codes are reused as `PublicationValidationError.code`.
 */
export const PUBLICATION_RULES: readonly PublicationRule[] = [
  { id: "submission_approved", description: "The originating submission must be approved.", severity: "error" },
  { id: "has_target", description: "A valid city or nearby-place target is required.", severity: "error" },
  { id: "has_title", description: "A non-empty title is required.", severity: "error" },
  { id: "has_description", description: "A non-empty description is required.", severity: "error" },
  { id: "has_photographer", description: "A photographer name is required.", severity: "error" },
  { id: "has_attribution", description: "Complete attribution (author, source, license, sourceUrl) is required.", severity: "error" },
  { id: "has_alt_text", description: "Alt text is recommended for accessibility.", severity: "warning" },
  { id: "valid_status", description: "Publication status must be a known value.", severity: "error" },
] as const;

const STATUS_LABEL: Record<PublicationStatus, string> = {
  candidate: "Publication candidate",
  ready: "Ready to publish",
  published: "Published",
  archived: "Archived",
};

export function getPublicationStatusLabel(status: PublicationStatus): string {
  return STATUS_LABEL[status];
}

/**
 * Map a contributor's declared license intent to a concrete license label for
 * the published photo's attribution. Returns null when no publishable license
 * can be derived (e.g. "unknown"), which blocks publication readiness.
 *
 * `user_owned` / `user_has_permission` deliberately yield a human-readable
 * permission note rather than an SPDX-style token: the contributor retains
 * copyright and grants use, so there is no standard license identifier. The
 * community photo's attribution carries this prose; community photos are not
 * subject to the verified-catalog license accept-list.
 */
export function licenseFromIntent(
  intent: CommunityPhotoLicenseIntent | undefined,
): string | null {
  switch (intent) {
    case "creative_commons":
      return "CC BY-SA 4.0";
    case "public_domain":
      return "Public domain";
    case "user_owned":
      return "Used with contributor's permission";
    case "user_has_permission":
      return "Used with permission";
    case "unknown":
    case undefined:
    default:
      return null;
  }
}
