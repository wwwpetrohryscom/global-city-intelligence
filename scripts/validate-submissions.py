#!/usr/bin/env python3
"""
Validate the community-photo SUBMISSION dataset in
lib/data/community-photo-submissions.ts against the foundation rules:

  - unique submission ids
  - every citySlug references a real city in lib/data/cities.ts
  - every nearbyPlaceSlug references a real place in lib/data/nearby-places.ts
  - every record references a citySlug and/or a nearbyPlaceSlug
  - status is one of: draft | submitted | under_review | approved | rejected
  - reviewState is one of: not_reviewed | in_review | accepted | declined |
    changes_requested
  - status <-> reviewState are mutually consistent (no invalid workflow state)
  - title / description / photographerName present and within length limits
  - sourceFileName present with a supported extension; sourceFileSize positive

This mirrors the runtime guard in lib/data/community-photo-submissions.ts
(which fails `next build`). Exit code is non-zero on any failure.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SUBS = ROOT / "lib/data/community-photo-submissions.ts"
CITIES = ROOT / "lib/data/cities.ts"
NEARBY = ROOT / "lib/data/nearby-places.ts"

VALID_STATUS = {"draft", "submitted", "under_review", "approved", "rejected"}
VALID_REVIEW = {
    "not_reviewed",
    "in_review",
    "accepted",
    "declined",
    "changes_requested",
}
CONSISTENCY = {
    "draft": {"not_reviewed"},
    "submitted": {"not_reviewed", "in_review"},
    "under_review": {"in_review", "changes_requested"},
    "approved": {"accepted"},
    "rejected": {"declined"},
}
LIMITS = {
    "title": (3, 120),
    "description": (10, 2000),
    "photographerName": (2, 120),
}
ALLOWED_EXT = (".jpg", ".jpeg", ".png", ".webp")


def carve_objects(text: str) -> list[str]:
    """String-aware brace carver for the EXAMPLE_SUBMISSIONS array."""
    m = re.search(r"EXAMPLE_SUBMISSIONS[^=]*=\s*\[", text)
    if not m:
        return []
    i = m.end() - 1
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
    # Require an integer literal (digits + `_` separators) terminated by a
    # comma / newline / brace so a stray float is not silently truncated.
    m = re.search(rf"\b{name}:\s*([\d_]+)\s*[,\n}}]", block)
    return int(m.group(1).replace("_", "")) if m else None


NOTES_MAX = 1000
SOURCE_FILENAME_MAX = 255
MAX_FILE_SIZE_BYTES = 25_000_000


def main() -> int:
    text = SUBS.read_text()
    city_slugs = set(re.findall(r'^\s+slug:\s*"([a-z][a-z0-9-]*)",', CITIES.read_text(), re.M))
    nearby_seeds = NEARBY.read_text().split("const VERIFIED_IMAGES")[0]
    place_slugs = set(re.findall(r'\bslug:\s*"([a-z][a-z0-9-]*)"', nearby_seeds))

    records = carve_objects(text)
    errors: list[str] = []
    if not records:
        errors.append("no submission records parsed from lib/data/community-photo-submissions.ts")

    seen_ids: set[str] = set()
    for block in records:
        sid = field(block, "id")
        tag = sid or "<unknown>"
        if not sid:
            errors.append(f"{tag}: missing id")
        elif sid in seen_ids:
            errors.append(f"{sid}: duplicate id")
        if sid:
            seen_ids.add(sid)

        for f, (lo, hi) in LIMITS.items():
            v = field(block, f) or ""
            n = len(v.strip())
            if n < lo:
                errors.append(f"{tag}: {f} too short ({n} < {lo})")
            if n > hi:
                errors.append(f"{tag}: {f} too long ({n} > {hi})")

        status = field(block, "status")
        review = field(block, "reviewState")
        if status not in VALID_STATUS:
            errors.append(f"{tag}: invalid status {status!r}")
        if review not in VALID_REVIEW:
            errors.append(f"{tag}: invalid reviewState {review!r}")
        if status in CONSISTENCY and review not in CONSISTENCY[status]:
            errors.append(f"{tag}: reviewState {review!r} inconsistent with status {status!r}")

        city_slug = field(block, "citySlug")
        place_slug = field(block, "nearbyPlaceSlug")
        if not city_slug and not place_slug:
            errors.append(f"{tag}: must reference a citySlug and/or nearbyPlaceSlug")
        if city_slug and city_slug not in city_slugs:
            errors.append(f"{tag}: citySlug {city_slug!r} not found in cities.ts")
        if place_slug and place_slug not in place_slugs:
            errors.append(f"{tag}: nearbyPlaceSlug {place_slug!r} not found in nearby-places.ts")

        fn = field(block, "sourceFileName")
        if not fn:
            errors.append(f"{tag}: missing sourceFileName")
        else:
            if not fn.lower().endswith(ALLOWED_EXT):
                errors.append(f"{tag}: sourceFileName {fn!r} has unsupported extension")
            if len(fn) > SOURCE_FILENAME_MAX:
                errors.append(f"{tag}: sourceFileName too long ({len(fn)} > {SOURCE_FILENAME_MAX})")
        size = num_field(block, "sourceFileSize")
        if size is None or size <= 0:
            errors.append(f"{tag}: sourceFileSize must be a positive integer")
        elif size > MAX_FILE_SIZE_BYTES:
            errors.append(f"{tag}: sourceFileSize {size} exceeds {MAX_FILE_SIZE_BYTES}")

        notes = field(block, "notes")
        if notes is not None and len(notes.strip()) > NOTES_MAX:
            errors.append(f"{tag}: notes too long ({len(notes.strip())} > {NOTES_MAX})")
        if not field(block, "createdAt"):
            errors.append(f"{tag}: missing createdAt")
        if not field(block, "updatedAt"):
            errors.append(f"{tag}: missing updatedAt")

    if errors:
        print("FAIL: community-photo-submissions validation failed:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        return 1
    by_status: dict[str, int] = {}
    for b in records:
        by_status[field(b, "status") or "?"] = by_status.get(field(b, "status") or "?", 0) + 1
    summary = ", ".join(f"{k}:{v}" for k, v in sorted(by_status.items()))
    print(f"PASS: community-photo-submissions ({len(records)} records — {summary}) — all checks clean.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
