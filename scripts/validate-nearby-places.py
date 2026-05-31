#!/usr/bin/env python3
"""
Validate the curated nearby-weekend-places dataset against the
established safety rules:

  - unique place slugs
  - every connectedCitySlug exists in lib/data/cities.ts
  - every countrySlug exists in lib/data/countries.ts
  - every sourceId resolves to an existing source
  - no exact distance / travel-time / price / opening-hour fields
    (also no liveSchedule / routeDetails / currentWeather /
    eventDate / hotelPrice / flightPrice fields)
  - no unsafe positive wording in summary or cautionNotes
  - every record's verificationStatus is exactly one of
    "verified", "partial", or "needs_review"
  - records flagged "verified" must carry a wikidataId and/or
    officialUrl (preferably both)
  - if a record declares latitude OR longitude, both must be
    present alongside a non-empty coordinateSource
  - records with image: ensure source/author/license/attribution
    structure is present AND `verified: true` with a non-empty
    `verifiedAt` value (no images shipped in MVP; this is a
    forward-compatible check)

Run:   python3 scripts/validate-nearby-places.py
Exit:  non-zero on any failure.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NEARBY_PATH = ROOT / "lib/data/nearby-places.ts"
CITIES_PATH = ROOT / "lib/data/cities.ts"
COUNTRIES_PATH = ROOT / "lib/data/countries.ts"
SOURCES_PATH = ROOT / "lib/data/sources/index.ts"

# Wording rules — every match in a summary or cautionNotes is a
# positive claim and must be flagged. Negative-disclaimer matches in
# documentation comments are tolerated (the script scans seed
# `summary:` strings only).
POSITIVE_BANNED = (
    "best nearby",
    "best day trip",
    "must-see",
    "must see",
    "hidden gem",
    "top attraction",
    "top attractions",
    "cheapest",
    "safest",
    "guaranteed",
    "ticket price",
    "opening hours",
    "live schedule",
    "exact travel time",
    "exact distance",
)

# Field-name rules — these field names are not allowed on records.
BANNED_FIELDS = (
    "travelTimeMinutes",
    "exactDistanceKm",
    "ticketPrice",
    "openingHours",
    "liveSchedule",
    "routeDetails",
    "currentWeather",
    "eventDate",
    "hotelPrice",
    "flightPrice",
)

# Allowed verificationStatus literal values.
ALLOWED_VERIFICATION_STATUSES = ("verified", "partial", "needs_review")


def load(path: Path) -> str:
    return path.read_text()


def collect_set(pattern: str, text: str) -> set[str]:
    return set(re.findall(pattern, text, re.MULTILINE))


def main() -> int:
    errors: list[str] = []

    nearby_src = load(NEARBY_PATH)
    cities_src = load(CITIES_PATH)
    countries_src = load(COUNTRIES_PATH)
    sources_src = load(SOURCES_PATH)

    # Build seed records (each delimited by `{` ... `},` inside the
    # `seeds` constant — we walk the file for slug+name+summary
    # triplets, which is enough for the validation rules below).
    seed_pattern = re.compile(
        r'\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*'
        r'countrySlug:\s*"([^"]+)",'
        r'(?:\s*regionName:\s*"([^"]*)",)?'
        r'\s*category:\s*"([^"]+)",\s*'
        r'summary:\s*\n?\s*"((?:[^"\\]|\\.)+)",\s*'
        r'connectedCitySlugs:\s*\[([^\]]*)\]',
        re.DOTALL,
    )
    seeds: list[dict[str, object]] = []
    for m in seed_pattern.finditer(nearby_src):
        seeds.append(
            {
                "slug": m.group(1),
                "name": m.group(2),
                "countrySlug": m.group(3),
                "regionName": m.group(4) or "",
                "category": m.group(5),
                "summary": m.group(6),
                "connectedCitySlugs": re.findall(r'"([^"]+)"', m.group(7)),
            }
        )

    if not seeds:
        errors.append("no seed records parsed from lib/data/nearby-places.ts")
        print_results(errors)
        return 1

    # Unique slugs
    seen: set[str] = set()
    for seed in seeds:
        slug = seed["slug"]
        assert isinstance(slug, str)
        if slug in seen:
            errors.append(f"duplicate slug: {slug}")
        seen.add(slug)

    # City references
    city_slugs = collect_set(
        r'^\s+slug:\s*"([a-z][a-z0-9-]*)",',
        cities_src,
    )
    # Cities.ts has many slugs across various scopes; the registry
    # column extraction above matches the established pattern used
    # by other validation scripts.
    for seed in seeds:
        for ref in seed["connectedCitySlugs"]:
            assert isinstance(ref, str)
            if ref not in city_slugs:
                errors.append(
                    f"{seed['slug']}: connectedCitySlug not in cities.ts: {ref}"
                )

    # Country references
    country_slugs = collect_set(
        r'^\s+slug:\s*"([a-z][a-z0-9-]*)",',
        countries_src,
    )
    for seed in seeds:
        cs = seed["countrySlug"]
        assert isinstance(cs, str)
        if cs not in country_slugs:
            errors.append(f"{seed['slug']}: countrySlug not in countries.ts: {cs}")

    # Source IDs (places use the shared COMMON_SOURCES list; check both
    # the literal IDs in the COMMON_SOURCES array and any extras passed
    # to placeSources()).
    source_ids = collect_set(r'id:\s*"([a-z][a-z0-9-]*)"', sources_src)
    used_sources: set[str] = set()
    common_match = re.search(
        r"COMMON_SOURCES:\s*readonly string\[\]\s*=\s*\[([^\]]+)\]",
        nearby_src,
    )
    if common_match:
        for s in re.findall(r'"([a-z][a-z0-9-]*)"', common_match.group(1)):
            used_sources.add(s)
    for m in re.finditer(r"placeSources\(\[([^\]]*)\]\)", nearby_src):
        for s in re.findall(r'"([a-z][a-z0-9-]*)"', m.group(1)):
            used_sources.add(s)
    for sid in sorted(used_sources):
        if sid not in source_ids:
            errors.append(f"sourceId not in sources registry: {sid}")

    # Banned fields anywhere in the records section
    for field in BANNED_FIELDS:
        if re.search(rf"\b{re.escape(field)}\s*:", nearby_src):
            errors.append(f"banned field present in nearby-places.ts: {field}")

    # Positive-wording check in seed summaries and cautionNotes only
    # (NOT in file-level docstrings or comments).
    for seed in seeds:
        text = seed["summary"]
        assert isinstance(text, str)
        for banned in POSITIVE_BANNED:
            if banned.lower() in text.lower():
                errors.append(
                    f"{seed['slug']}: banned positive wording in summary: '{banned}'"
                )
    for m in re.finditer(r'cautionNotes:\s*"((?:[^"\\]|\\.)+)"', nearby_src):
        text = m.group(1)
        for banned in POSITIVE_BANNED:
            if banned.lower() in text.lower():
                errors.append(
                    f"banned positive wording in cautionNotes: '{banned}'"
                )

    # If any image records ever ship: enforce required attribution fields
    for m in re.finditer(r"image:\s*\{([^}]+)\}", nearby_src):
        block = m.group(1)
        for required in (
            "src",
            "width",
            "height",
            "alt",
            "source",
            "sourceUrl",
            "author",
            "license",
            "attributionText",
            "verified",
            "verifiedAt",
        ):
            if not re.search(rf"\b{required}\s*:", block):
                errors.append(
                    f"image record missing required field: {required}"
                )
        # Stronger image rules: `verified` must literally be `true`
        # and `verifiedAt` must be a non-empty string.
        if not re.search(r"\bverified\s*:\s*true\b", block):
            errors.append(
                "image record must declare `verified: true`"
            )
        verified_at_match = re.search(
            r'\bverifiedAt\s*:\s*"([^"]*)"', block
        )
        if not verified_at_match or not verified_at_match.group(1).strip():
            errors.append(
                "image record must declare a non-empty `verifiedAt`"
            )

    # Per-seed block scans for verificationStatus / wikidataId /
    # officialUrl / coordinate enforcement. We walk the file and
    # carve out each `{ slug: "...", ... }` record block by tracking
    # brace depth from the slug declaration onward.
    seed_blocks: dict[str, str] = {}
    for slug_match in re.finditer(r'\{\s*slug:\s*"([^"]+)"', nearby_src):
        slug = slug_match.group(1)
        start = slug_match.start()
        # Walk forward to find the matching closing brace for this
        # record. Start one char after the opening `{`.
        depth = 0
        i = start
        end = -1
        while i < len(nearby_src):
            ch = nearby_src[i]
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
            i += 1
        if end > start:
            seed_blocks[slug] = nearby_src[start:end]

    for seed in seeds:
        slug = seed["slug"]
        assert isinstance(slug, str)
        block = seed_blocks.get(slug, "")

        # verificationStatus literal must be one of the allowed values
        vs_match = re.search(
            r'\bverificationStatus\s*:\s*"([^"]*)"', block
        )
        if not vs_match:
            errors.append(
                f"{slug}: missing verificationStatus literal"
            )
            verification_status = None
        else:
            verification_status = vs_match.group(1)
            if verification_status not in ALLOWED_VERIFICATION_STATUSES:
                errors.append(
                    f"{slug}: invalid verificationStatus "
                    f"'{verification_status}' (expected one of "
                    f"{', '.join(ALLOWED_VERIFICATION_STATUSES)})"
                )

        # When verified — must have wikidataId or officialUrl
        if verification_status == "verified":
            wd_match = re.search(
                r'\bwikidataId\s*:\s*"([^"]+)"', block
            )
            ou_match = re.search(
                r'\bofficialUrl\s*:\s*"([^"]+)"', block
            )
            if not wd_match and not ou_match:
                errors.append(
                    f"{slug}: verificationStatus 'verified' requires "
                    f"wikidataId and/or officialUrl"
                )

        # Coordinate enforcement: if latitude or longitude declared,
        # both must be present and coordinateSource must be non-empty.
        lat_match = re.search(r'\blatitude\s*:\s*([^,\n}]+)', block)
        lon_match = re.search(r'\blongitude\s*:\s*([^,\n}]+)', block)
        if lat_match or lon_match:
            if not lat_match:
                errors.append(
                    f"{slug}: longitude declared without latitude"
                )
            if not lon_match:
                errors.append(
                    f"{slug}: latitude declared without longitude"
                )
            cs_match = re.search(
                r'\bcoordinateSource\s*:\s*"([^"]*)"', block
            )
            if not cs_match or not cs_match.group(1).strip():
                errors.append(
                    f"{slug}: latitude/longitude declared without "
                    f"non-empty coordinateSource"
                )

    return print_results(errors, count=len(seeds))


def print_results(errors: list[str], count: int = 0) -> int:
    if errors:
        print("FAIL: nearby-weekend-places validation failed:", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        return 1
    print(f"PASS: nearby-weekend-places ({count} records) — all checks clean.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
