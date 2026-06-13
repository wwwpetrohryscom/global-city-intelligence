/**
 * Community photo platform — render-layer domain model (foundation only).
 *
 * This module defines the PUBLIC, render-oriented photo record and gallery
 * shapes used to attach verified-official imagery (today) and approved
 * community imagery (future) to cities and nearby weekend places. It is a
 * complement to — not a replacement for — the submission/moderation
 * lifecycle contract in `types/community-media.ts`:
 *
 *   - `types/community-media.ts`  → how a community photo is SUBMITTED and
 *      MODERATED (draft → pending_review → approved, safety flags, policy).
 *   - `types/photos.ts` (here)    → how an approved photo is REPRESENTED and
 *      GROUPED for rendering (Photo + PhotoGallery).
 *
 * Foundation scope: data shapes, relationships, and a data-access layer ONLY.
 * There is NO route, NO gallery page, NO upload form, NO API, and NO storage
 * shipped with this model. All exported symbols here are pure types.
 *
 * A future approved `CommunityPhotoSubmission` maps onto a `Photo` with
 * `sourceType: "community"` and `status: "approved"`; verified-source imagery
 * maps onto `Photo` with `sourceType: "official"` and `status: "approved"`.
 * A `moderator_added` submission maps to `"official"` or `"community"` per
 * the platform's later policy. `Photo.sourceSubmissionId` carries the link
 * back to the originating submission for community records.
 *
 * The `PhotoSourceType` / `PhotoStatus` values are a DISTINCT render-layer
 * vocabulary; they are deliberately NOT the same string values as
 * `CommunityPhotoSourceType` / `CommunityPhotoSubmissionStatus`. Post-approval
 * takedown states (hidden / removed / reported) live on the submission
 * lifecycle, not here — the render layer simply stops surfacing a photo whose
 * `status` is no longer `"approved"`. Additional attachment targets beyond
 * city / nearby place (e.g. `country`, already reserved by
 * `CommunityPhotoAttachmentTargetType`) can be added later by widening
 * `PhotoGalleryTargetType` and adding an optional slug field — no rewrite of
 * the existing shapes is required.
 */

/** Provenance of a photo record. */
export type PhotoSourceType = "official" | "community";

/**
 * Public moderation state of a photo record. Official photos ship as
 * `"approved"`; future community photos default to `"pending"` and only
 * render once `"approved"`. `"rejected"` photos are retained for audit but
 * never rendered.
 */
export type PhotoStatus = "pending" | "approved" | "rejected";

/** Reusable attribution block, compatible with existing Wikimedia records. */
export interface PhotoAttribution {
  /** Human-readable author / creator name. */
  author: string;
  /** Provider or origin label, e.g. "Wikimedia Commons", "Community submission". */
  source: string;
  /** Short license name, e.g. "CC BY-SA 4.0", "Public domain". */
  license: string;
  /** Canonical link to the license deed. */
  licenseUrl?: string;
  /** Canonical link to the source / file description page. */
  sourceUrl: string;
  /** Optional link to the author's profile page. */
  authorUrl?: string;
  /** Optional pre-composed attribution string for direct rendering. */
  attributionText?: string;
}

/**
 * A single photo attached to a city, a nearby weekend place, or both.
 * `citySlug` / `nearbyPlaceSlug` are the relationship keys; at least one
 * must be present (enforced by the data-access integrity guard and the
 * `validate:photos` gate).
 */
export interface Photo {
  id: string;
  slug: string;
  title: string;
  description: string;
  sourceType: PhotoSourceType;
  status: PhotoStatus;
  attribution: PhotoAttribution;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  /** Optional city relationship (slug in lib/data/cities.ts). */
  citySlug?: string;
  /** Optional nearby-place relationship (slug in lib/data/nearby-places.ts). */
  nearbyPlaceSlug?: string;
  /**
   * Optional provenance link to the originating `CommunityPhotoSubmission`
   * (set only for `sourceType: "community"` records in a future phase).
   * Inert for the current official-only catalog.
   */
  sourceSubmissionId?: string;
  /** Render payload — required so a gallery can display the photo. */
  src: string;
  width: number;
  height: number;
  alt: string;
}

/** The kinds of entity a gallery can hang off. */
export type PhotoGalleryTargetType = "city" | "nearby_place";

/**
 * A render-ready collection of approved photos for one target entity.
 * `City Gallery` and `Nearby Place Gallery` are instances of this shape
 * distinguished by `targetType`. Supports official-only, community-only,
 * and mixed sets (counts are pre-computed for convenience).
 */
export interface PhotoGallery {
  targetType: PhotoGalleryTargetType;
  targetSlug: string;
  photos: readonly Photo[];
  officialCount: number;
  communityCount: number;
  total: number;
}
