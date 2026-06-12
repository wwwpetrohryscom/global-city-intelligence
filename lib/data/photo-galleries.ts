import { cities } from "@/lib/data/cities";
import { communityPhotos } from "@/lib/data/community-photos";
import { nearbyWeekendPlaces } from "@/lib/data/nearby-places";
import type {
  Photo,
  PhotoGallery,
  PhotoGalleryTargetType,
  PhotoSourceType,
  PhotoStatus,
} from "@/types";

/**
 * Photo gallery + data-access layer (foundation only).
 *
 * Groups the render-layer `Photo` records from `lib/data/community-photos.ts`
 * into per-city and per-nearby-place galleries. There is NO route, NO page,
 * and NO UI here — this is the data-access layer that future gallery surfaces
 * will read from. Only `status: "approved"` photos are exposed publicly, so
 * future `pending` / `rejected` community submissions never render.
 *
 * Build-safety: `assertPhotoReferentialIntegrity` runs once at module
 * evaluation. Because this module is re-exported from `lib/data/queries`
 * (which the built pages import), an invalid photo record fails `next build`.
 * The `validate:photos` script enforces the same rules as an explicit gate.
 */

const VALID_SOURCE_TYPES: readonly PhotoSourceType[] = ["official", "community"];
const VALID_STATUSES: readonly PhotoStatus[] = ["pending", "approved", "rejected"];

function assertPhotoReferentialIntegrity(photos: readonly Photo[]): void {
  const citySlugs = new Set(cities.map((c) => c.slug));
  const placeSlugs = new Set(nearbyWeekendPlaces.map((p) => p.slug));
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const errors: string[] = [];

  for (const photo of photos) {
    const tag = photo.id || photo.slug || "<unknown>";
    if (!photo.id) errors.push(`${tag}: missing id`);
    else if (seenIds.has(photo.id)) errors.push(`${photo.id}: duplicate photo id`);
    if (photo.id) seenIds.add(photo.id);

    if (!photo.slug) errors.push(`${tag}: missing slug`);
    else if (seenSlugs.has(photo.slug)) errors.push(`${photo.slug}: duplicate photo slug`);
    if (photo.slug) seenSlugs.add(photo.slug);

    const a = photo.attribution;
    if (!a || !a.author || !a.source || !a.license || !a.sourceUrl) {
      errors.push(`${tag}: incomplete attribution (author/source/license/sourceUrl required)`);
    }

    if (!VALID_SOURCE_TYPES.includes(photo.sourceType)) {
      errors.push(`${tag}: invalid sourceType "${photo.sourceType}"`);
    }
    if (!VALID_STATUSES.includes(photo.status)) {
      errors.push(`${tag}: invalid status "${photo.status}"`);
    }
    // Official photos are pre-cleared; they must never sit in the "pending" state.
    if (photo.sourceType === "official" && photo.status === "pending") {
      errors.push(`${tag}: official photos cannot have status "pending"`);
    }

    if (!photo.citySlug && !photo.nearbyPlaceSlug) {
      errors.push(`${tag}: photo must reference a citySlug and/or nearbyPlaceSlug`);
    }
    if (photo.citySlug && !citySlugs.has(photo.citySlug)) {
      errors.push(`${tag}: citySlug "${photo.citySlug}" not found in cities.ts`);
    }
    if (photo.nearbyPlaceSlug && !placeSlugs.has(photo.nearbyPlaceSlug)) {
      errors.push(
        `${tag}: nearbyPlaceSlug "${photo.nearbyPlaceSlug}" not found in nearby-places.ts`,
      );
    }

    if (!photo.src || !photo.alt) errors.push(`${tag}: missing src/alt render payload`);
    if (photo.width <= 0 || photo.height <= 0) errors.push(`${tag}: non-positive dimensions`);
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid community photo records (${errors.length}):\n  - ${errors.join("\n  - ")}`,
    );
  }
}

// Build-time gate: throws (and fails the build) if any record is invalid.
assertPhotoReferentialIntegrity(communityPhotos);

function buildGallery(
  targetType: PhotoGalleryTargetType,
  targetSlug: string,
  photos: readonly Photo[],
): PhotoGallery {
  const officialCount = photos.filter((p) => p.sourceType === "official").length;
  return {
    targetType,
    targetSlug,
    photos,
    officialCount,
    communityCount: photos.length - officialCount,
    total: photos.length,
  };
}

// ---- raw record access (all statuses; for future moderation tooling) ----

export function getAllPhotos(): readonly Photo[] {
  return communityPhotos;
}

export function getPhotoBySlug(slug: string): Photo | undefined {
  return communityPhotos.find((p) => p.slug === slug);
}

export function getPhotosByStatus(status: PhotoStatus): readonly Photo[] {
  return communityPhotos.filter((p) => p.status === status);
}

export function getPhotosBySourceType(sourceType: PhotoSourceType): readonly Photo[] {
  return communityPhotos.filter((p) => p.sourceType === sourceType);
}

// ---- public, render-ready access (approved only) ----

/** Approved photos attached to a city, in catalog order. */
export function getCityPhotos(citySlug: string): readonly Photo[] {
  return communityPhotos.filter(
    (p) => p.status === "approved" && p.citySlug === citySlug,
  );
}

/** Approved photos attached to a nearby weekend place, in catalog order. */
export function getNearbyPlacePhotos(nearbyPlaceSlug: string): readonly Photo[] {
  return communityPhotos.filter(
    (p) => p.status === "approved" && p.nearbyPlaceSlug === nearbyPlaceSlug,
  );
}

/** City Gallery — official + community + mixed, approved only. */
export function getCityPhotoGallery(citySlug: string): PhotoGallery {
  return buildGallery("city", citySlug, getCityPhotos(citySlug));
}

/** Nearby Place Gallery — official + community + mixed, approved only. */
export function getNearbyPlacePhotoGallery(nearbyPlaceSlug: string): PhotoGallery {
  return buildGallery("nearby_place", nearbyPlaceSlug, getNearbyPlacePhotos(nearbyPlaceSlug));
}

export function hasCityPhotos(citySlug: string): boolean {
  return getCityPhotos(citySlug).length > 0;
}

export function hasNearbyPlacePhotos(nearbyPlaceSlug: string): boolean {
  return getNearbyPlacePhotos(nearbyPlaceSlug).length > 0;
}

// ---- small render helpers (labels) ----
// Render-layer labels for Photo records. For the submission/moderation
// lifecycle labels (a separate vocabulary) use lib/community-media/policy.ts.

const SOURCE_LABEL: Record<PhotoSourceType, string> = {
  official: "Verified official photo",
  community: "Community photo",
};
const STATUS_LABEL: Record<PhotoStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

export function getPhotoSourceLabel(sourceType: PhotoSourceType): string {
  return SOURCE_LABEL[sourceType];
}
export function getPhotoStatusLabel(status: PhotoStatus): string {
  return STATUS_LABEL[status];
}
