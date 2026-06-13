import type {
  PublicationCandidate,
  PublicationStatus,
  PublicationValidationError,
  PublicationValidationResult,
} from "@/types";
import { canPublicationTransition, isPublicationStatus } from "./rules";

/**
 * Pure, synchronous publication validators (foundation only). No I/O. Place
 * references and submission-approval are passed in via `context` so the
 * validators stay deterministic; the build-time guard in
 * `lib/data/publication-candidates.ts` supplies the real sets.
 */

const LIMITS = {
  titleMin: 3,
  titleMax: 120,
  descriptionMin: 10,
  descriptionMax: 2000,
  photographerMin: 2,
  photographerMax: 120,
} as const;

function err(field: string, code: string, message: string): PublicationValidationError {
  return { field, code, message, severity: "error" };
}
function warn(field: string, code: string, message: string): PublicationValidationError {
  return { field, code, message, severity: "warning" };
}
function result(
  errors: PublicationValidationError[],
  warnings: PublicationValidationError[],
): PublicationValidationResult {
  return { ok: errors.length === 0, errors, warnings };
}
function len(v: string | undefined): number {
  return v ? v.trim().length : 0;
}

export interface PublicationContext {
  citySlugs: ReadonlySet<string>;
  nearbyPlaceSlugs: ReadonlySet<string>;
  /** Set of submission ids whose submission status is "approved". */
  approvedSubmissionIds: ReadonlySet<string>;
  /** Set of all existing submission ids. */
  knownSubmissionIds: ReadonlySet<string>;
}

/** Structural validation of a candidate's own fields (no context needed). */
export function validatePublicationCandidate(
  candidate: PublicationCandidate,
): PublicationValidationResult {
  const errors: PublicationValidationError[] = [];
  const warnings: PublicationValidationError[] = [];

  if (!candidate.id || !candidate.id.trim()) errors.push(err("id", "required", "id is required"));
  if (!candidate.submissionId || !candidate.submissionId.trim())
    errors.push(err("submissionId", "required", "submissionId is required"));

  if (len(candidate.title) < LIMITS.titleMin) errors.push(err("title", "has_title", "title is required"));
  if (len(candidate.title) > LIMITS.titleMax) errors.push(err("title", "too_long", "title is too long"));
  if (len(candidate.description) < LIMITS.descriptionMin)
    errors.push(err("description", "has_description", "description is required"));
  if (len(candidate.description) > LIMITS.descriptionMax)
    errors.push(err("description", "too_long", "description is too long"));
  if (len(candidate.photographerName) < LIMITS.photographerMin)
    errors.push(err("photographerName", "has_photographer", "photographerName is required"));
  if (len(candidate.photographerName) > LIMITS.photographerMax)
    errors.push(err("photographerName", "too_long", "photographerName is too long"));

  const a = candidate.attribution;
  if (!a || !a.author || !a.source || !a.license || !a.sourceUrl)
    errors.push(err("attribution", "has_attribution", "attribution must include author, source, license, and sourceUrl"));

  if (!candidate.citySlug && !candidate.nearbyPlaceSlug)
    errors.push(err("*", "has_target", "candidate must reference a citySlug and/or nearbyPlaceSlug"));

  if (!isPublicationStatus(candidate.status))
    errors.push(err("status", "valid_status", `invalid publication status "${candidate.status}"`));

  if (!candidate.altText) warnings.push(warn("altText", "has_alt_text", "alt text is recommended for accessibility"));
  if (!candidate.createdAt) errors.push(err("createdAt", "required", "createdAt is required"));
  if (!candidate.updatedAt) errors.push(err("updatedAt", "required", "updatedAt is required"));

  return result(errors, warnings);
}

/** Validate the candidate's references + originating-submission approval. */
export function validatePublicationRules(
  candidate: PublicationCandidate,
  context: PublicationContext,
): PublicationValidationResult {
  const errors: PublicationValidationError[] = [];
  if (candidate.submissionId && !context.knownSubmissionIds.has(candidate.submissionId))
    errors.push(err("submissionId", "invalid_reference", `submissionId "${candidate.submissionId}" not found`));
  else if (candidate.submissionId && !context.approvedSubmissionIds.has(candidate.submissionId))
    errors.push(err("submissionId", "submission_approved", `submission "${candidate.submissionId}" is not approved`));

  if (candidate.citySlug && !context.citySlugs.has(candidate.citySlug))
    errors.push(err("citySlug", "invalid_reference", `citySlug "${candidate.citySlug}" not found`));
  if (candidate.nearbyPlaceSlug && !context.nearbyPlaceSlugs.has(candidate.nearbyPlaceSlug))
    errors.push(err("nearbyPlaceSlug", "invalid_reference", `nearbyPlaceSlug "${candidate.nearbyPlaceSlug}" not found`));

  return result(errors, []);
}

/** Full readiness: structural validity + rules. A passing result means the
 * candidate is eligible to transition to `ready` / `published`. */
export function validatePublicationReadiness(
  candidate: PublicationCandidate,
  context: PublicationContext,
): PublicationValidationResult {
  const base = validatePublicationCandidate(candidate);
  const rules = validatePublicationRules(candidate, context);
  return result([...base.errors, ...rules.errors], [...base.warnings, ...rules.warnings]);
}

/** Validate a proposed publication status change is an allowed transition. */
export function validatePublicationTransition(
  from: PublicationStatus,
  to: PublicationStatus,
): PublicationValidationResult {
  if (!canPublicationTransition(from, to))
    return result([err("status", "invalid_transition", `cannot transition from "${from}" to "${to}"`)], []);
  return result([], []);
}
