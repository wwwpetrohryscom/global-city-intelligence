#!/usr/bin/env python3
"""
Validate the curated nearby-weekend-places dataset against the
established safety rules:

  - unique place slugs
  - every connectedCitySlug exists in lib/data/cities.ts
  - every countrySlug exists in lib/data/countries.ts
  - every sourceId resolves to an existing source
  - no exact distance / travel-time / price / opening-hour fields
  - no unsafe positive wording in summary or cautionNotes
  - records with image: ensure source/author/license/attribution
    structure is present (no images shipped in MVP; this is a
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
)


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
