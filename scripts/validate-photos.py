#!/usr/bin/env python3
"""
Validate the community-photo render-layer dataset in
lib/data/community-photos.ts against the foundation rules:

  - unique photo ids
  - unique photo slugs
  - every citySlug references a real city in lib/data/cities.ts
  - every nearbyPlaceSlug references a real place in lib/data/nearby-places.ts
  - every record references a citySlug and/or a nearbyPlaceSlug
  - sourceType is one of: official | community
  - status is one of: pending | approved | rejected
  - official photos are never status "pending"
  - attribution carries author, source, license, sourceUrl
  - render payload (src, width>0, height>0, alt) is present

This mirrors the runtime guard in lib/data/photo-galleries.ts (which fails
`next build`). Exit code is non-zero on any failure.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / "lib/data/community-photos.ts"
CITIES = ROOT / "lib/data/cities.ts"
NEARBY = ROOT / "lib/data/nearby-places.ts"

VALID_SOURCE_TYPES = {"official", "community"}
VALID_STATUSES = {"pending", "approved", "rejected"}


def carve_objects(text: str) -> list[str]:
    """Carve each top-level `{ ... }` record inside the communityPhotos array.

    String-aware: braces inside double-quoted string values (e.g. a future
    community caption or a sourceUrl containing `{`) do not affect depth.
    """
    m = re.search(r"export const communityPhotos[^=]*=\s*\[", text)
    if not m:
        return []
    i = m.end() - 1  # position of the array's opening `[`
    objs: list[str] = []
    depth = 0
    obj_start = -1
    in_string = False
    escaped = False
    while i < len(text):
        ch = text[i]
        if in_string:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == '"':
                in_string = False
            i += 1
            continue
        if ch == '"':
            in_string = True
        elif ch == "{":
            if depth == 0:
                obj_start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and obj_start >= 0:
                objs.append(text[obj_start : i + 1])
                obj_start = -1
        elif ch == "]" and depth == 0:
            break
        i += 1
    return objs


def field(block: str, name: str) -> str | None:
    m = re.search(rf'\b{name}:\s*"((?:[^"\\]|\\.)*)"', block)
    return m.group(1) if m else None


def num_field(block: str, name: str) -> int | None:
    m = re.search(rf"\b{name}:\s*(-?\d+)", block)
    return int(m.group(1)) if m else None


def main() -> int:
    text = PHOTOS.read_text()
    city_slugs = set(re.findall(r'^\s+slug:\s*"([a-z][a-z0-9-]*)",', CITIES.read_text(), re.M))
    # Nearby place slugs: read the seeds section (before VERIFIED_IMAGES) and
    # match every `slug:` field, independent of subsequent field order.
    nearby_seeds = NEARBY.read_text().split("const VERIFIED_IMAGES")[0]
    place_slugs = set(re.findall(r'\bslug:\s*"([a-z][a-z0-9-]*)"', nearby_seeds))

    records = carve_objects(text)
    errors: list[str] = []
    if not records:
        errors.append("no photo records parsed from lib/data/community-photos.ts")

    seen_ids: set[str] = set()
    seen_slugs: set[str] = set()
    for block in records:
        pid = field(block, "id")
        slug = field(block, "slug")
        tag = pid or slug or "<unknown>"
        if not pid:
            errors.append(f"{tag}: missing id")
        elif pid in seen_ids:
            errors.append(f"{pid}: duplicate id")
        if pid:
            seen_ids.add(pid)
        if not slug:
            errors.append(f"{tag}: missing slug")
        elif slug in seen_slugs:
            errors.append(f"{slug}: duplicate slug")
        if slug:
            seen_slugs.add(slug)

        source_type = field(block, "sourceType")
        status = field(block, "status")
        if source_type not in VALID_SOURCE_TYPES:
            errors.append(f"{tag}: invalid sourceType {source_type!r}")
        if status not in VALID_STATUSES:
            errors.append(f"{tag}: invalid status {status!r}")
        if source_type == "official" and status == "pending":
            errors.append(f"{tag}: official photos cannot be status 'pending'")

        city_slug = field(block, "citySlug")
        place_slug = field(block, "nearbyPlaceSlug")
        if not city_slug and not place_slug:
            errors.append(f"{tag}: must reference a citySlug and/or nearbyPlaceSlug")
        if city_slug and city_slug not in city_slugs:
            errors.append(f"{tag}: citySlug {city_slug!r} not found in cities.ts")
        if place_slug and place_slug not in place_slugs:
            errors.append(f"{tag}: nearbyPlaceSlug {place_slug!r} not found in nearby-places.ts")

        for required in ("author", "source", "license", "sourceUrl"):
            if not field(block, required):
                errors.append(f"{tag}: attribution missing {required}")
        if not field(block, "src"):
            errors.append(f"{tag}: missing src")
        if not field(block, "alt"):
            errors.append(f"{tag}: missing alt")
        w, h = num_field(block, "width"), num_field(block, "height")
        if w is None or w <= 0:
            errors.append(f"{tag}: width must be a positive integer")
        if h is None or h <= 0:
            errors.append(f"{tag}: height must be a positive integer")

    if errors:
        print("FAIL: community-photos validation failed:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        return 1
    n_official = sum(1 for b in records if field(b, "sourceType") == "official")
    print(
        f"PASS: community-photos ({len(records)} records — "
        f"{n_official} official, {len(records) - n_official} community) — all checks clean."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
