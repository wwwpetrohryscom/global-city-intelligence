#!/usr/bin/env python3
"""
Validate the publication-candidate dataset in
lib/data/publication-candidates.ts against the foundation rules:

  - unique candidate ids
  - unique submissionId (one candidate per submission)
  - every submissionId references a real submission in
    lib/data/community-photo-submissions.ts AND that submission is approved
  - every citySlug references a real city in lib/data/cities.ts
  - every nearbyPlaceSlug references a real place in lib/data/nearby-places.ts
  - every record references a citySlug and/or a nearbyPlaceSlug
  - status is one of: candidate | ready | published | archived
  - title / description / photographerName present and within length limits
  - attribution carries author, source, license, sourceUrl

Mirrors the runtime guard in lib/data/publication-candidates.ts (which fails
`next build`). Exit code is non-zero on any failure.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CANDS = ROOT / "lib/data/publication-candidates.ts"
SUBS = ROOT / "lib/data/community-photo-submissions.ts"
CITIES = ROOT / "lib/data/cities.ts"
NEARBY = ROOT / "lib/data/nearby-places.ts"

VALID_STATUS = {"candidate", "ready", "published", "archived"}
LIMITS = {"title": (3, 120), "description": (10, 2000), "photographerName": (2, 120)}


def strip_comments(text: str) -> str:
    """Remove // line comments and /* */ block comments (string-safe-ish; the
    data files use no braces in strings adjacent to comment markers)."""
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.DOTALL)
    return re.sub(r"//[^\n]*", "", text)


def carve_objects(text: str, anchor: str) -> list[str]:
    """String-aware top-level brace carver for the array after `anchor`.
    Comments are stripped first so a brace inside a comment cannot miscount."""
    text = strip_comments(text)
    m = re.search(anchor + r"[^=]*=\s*\[", text)
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


def approved_submission_ids(text: str) -> set[str]:
    out: set[str] = set()
    for block in carve_objects(text, "EXAMPLE_SUBMISSIONS"):
        if field(block, "status") == "approved":
            sid = field(block, "id")
            if sid:
                out.add(sid)
    return out


def all_submission_ids(text: str) -> set[str]:
    return {field(b, "id") for b in carve_objects(text, "EXAMPLE_SUBMISSIONS") if field(b, "id")}


def main() -> int:
    text = CANDS.read_text()
    subs_text = SUBS.read_text()
    city_slugs = set(re.findall(r'^\s+slug:\s*"([a-z][a-z0-9-]*)",', CITIES.read_text(), re.M))
    nearby_seeds = NEARBY.read_text().split("const VERIFIED_IMAGES")[0]
    place_slugs = set(re.findall(r'\bslug:\s*"([a-z][a-z0-9-]*)"', nearby_seeds))
    approved = approved_submission_ids(subs_text)
    known_subs = all_submission_ids(subs_text)

    records = carve_objects(text, "EXAMPLE_CANDIDATES")
    errors: list[str] = []
    if not records:
        errors.append("no candidate records parsed from lib/data/publication-candidates.ts")

    seen_ids: set[str] = set()
    seen_sub_ids: set[str] = set()
    for block in records:
        cid = field(block, "id")
        tag = cid or "<unknown>"
        if not cid:
            errors.append(f"{tag}: missing id")
        elif cid in seen_ids:
            errors.append(f"{cid}: duplicate id")
        if cid:
            seen_ids.add(cid)

        sub_id = field(block, "submissionId")
        if not sub_id:
            errors.append(f"{tag}: missing submissionId")
        else:
            if sub_id in seen_sub_ids:
                errors.append(f"{tag}: duplicate submissionId {sub_id!r}")
            seen_sub_ids.add(sub_id)
            if sub_id not in known_subs:
                errors.append(f"{tag}: submissionId {sub_id!r} not found in submissions")
            elif sub_id not in approved:
                errors.append(f"{tag}: submission {sub_id!r} is not approved")

        for f, (lo, hi) in LIMITS.items():
            n = len((field(block, f) or "").strip())
            if n < lo:
                errors.append(f"{tag}: {f} too short ({n} < {lo})")
            if n > hi:
                errors.append(f"{tag}: {f} too long ({n} > {hi})")

        status = field(block, "status")
        if status not in VALID_STATUS:
            errors.append(f"{tag}: invalid status {status!r}")

        for f in ("createdAt", "updatedAt"):
            if not (field(block, f) or "").strip():
                errors.append(f"{tag}: {f} is required")

        city_slug = field(block, "citySlug")
        place_slug = field(block, "nearbyPlaceSlug")
        if not city_slug and not place_slug:
            errors.append(f"{tag}: must reference a citySlug and/or nearbyPlaceSlug")
        if city_slug and city_slug not in city_slugs:
            errors.append(f"{tag}: citySlug {city_slug!r} not found in cities.ts")
        if place_slug and place_slug not in place_slugs:
            errors.append(f"{tag}: nearbyPlaceSlug {place_slug!r} not found in nearby-places.ts")

        # attribution sub-block
        am = re.search(r"attribution:\s*\{(.*?)\n    \}", block, re.DOTALL)
        ablock = am.group(1) if am else ""
        for required in ("author", "source", "license", "sourceUrl"):
            if not field(ablock, required):
                errors.append(f"{tag}: attribution missing {required}")

    if errors:
        print("FAIL: publication-candidates validation failed:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        return 1
    by_status: dict[str, int] = {}
    for b in records:
        s = field(b, "status") or "?"
        by_status[s] = by_status.get(s, 0) + 1
    summary = ", ".join(f"{k}:{v}" for k, v in sorted(by_status.items()))
    print(f"PASS: publication-candidates ({len(records)} records — {summary}) — all checks clean.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
