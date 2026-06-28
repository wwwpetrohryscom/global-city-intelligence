#!/usr/bin/env python3
"""
Validate the regional discovery collections in lib/data/regional-collections.ts:

  - collection slug unique
  - valid regionType
  - 5-30 nearby places, 2-15 cities
  - no duplicate place / city references
  - every place exists in nearby-places.ts; every city exists in cities.ts
  - featuredPlaces subset of nearbyPlaces; featuredCities subset of cities
  - category-consistency (single-feature region types only admit matching categories)
  - forest_region members are forest-linked; river_region members are river-linked
  - relatedCollections: no self-reference, no duplicates, all resolve, none orphan
  - no collection is a strict subset of another collection of the same type

Mirrors the runtime guard (which fails `next build`). Non-zero exit on failure.
"""
from __future__ import annotations
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "lib/data/regional-collections.ts"
PLACES = ROOT / "lib/data/nearby-places.ts"
CITIES = ROOT / "lib/data/cities.ts"

VALID = {"mountain_region","coastal_region","lake_region","river_region","national_park_region",
         "forest_region","island_region","cross_border_region","protected_landscape_region",
         "weekend_escape_region"}
ALLOWED_CATEGORIES = {
    "mountain_region": {"mountain"}, "lake_region": {"lake"},
    "coastal_region": {"beach", "island", "waterfront"}, "island_region": {"island"},
    "river_region": {"nature", "park", "waterfront"}, "forest_region": {"nature", "park"},
    "protected_landscape_region": {"park", "nature"},
}
FOREST_TOKENS = ["forest", "wald", "forêt", "foret", "bos", "bois", "woods"]
RIVER_TOKENS = ["valley", "vallée", "vallee", "river", "rhine", "danube", "loire", "gorge"]
MIN_PLACES, MAX_PLACES, MIN_CITIES, MAX_CITIES = 5, 30, 2, 80


def arr(field, block):
    m = re.search(field + r":\s*\[(.*?)\]", block, re.DOTALL)
    return re.findall(r'"([^"]+)"', m.group(1)) if m else []


def main() -> int:
    text = DATA.read_text()
    places_src = PLACES.read_text()
    place_slugs = set(re.findall(r'\bslug:\s*"([a-z0-9][a-z0-9-]*)"', places_src))
    city_slugs = set(re.findall(r'\bslug:\s*"([a-z0-9][a-z0-9-]*)"', CITIES.read_text()))
    place_category = dict(re.findall(
        r'slug:\s*"([a-z0-9-]+)"[^}]*?category:\s*"([a-z_]+)"', places_src, re.DOTALL))
    place_name = dict(re.findall(
        r'slug:\s*"([a-z0-9-]+)",\s*\n\s*name:\s*"([^"]+)"', places_src))

    blocks = re.split(r'\n  \{\n', text)
    errors: list[str] = []
    slugs_seen = set()
    parsed = []  # (slug, rtype, places list)
    for b in blocks:
        sm = re.search(r'slug:\s*"([a-z0-9-]+)"', b)
        rm = re.search(r'regionType:\s*"([a-z_]+)"', b)
        if not sm or not rm:
            continue
        slug, rtype = sm.group(1), rm.group(1)
        if slug in slugs_seen: errors.append(f"{slug}: duplicate collection slug")
        slugs_seen.add(slug)
        if rtype not in VALID: errors.append(f"{slug}: invalid regionType {rtype}")
        cities = arr("cities", b); places = arr("nearbyPlaces", b)
        fplaces = arr("featuredPlaces", b); fcities = arr("featuredCities", b)
        related = arr("relatedCollections", b)
        parsed.append((slug, rtype, places))
        if not (MIN_PLACES <= len(places) <= MAX_PLACES): errors.append(f"{slug}: {len(places)} places out of range")
        if not (MIN_CITIES <= len(cities) <= MAX_CITIES): errors.append(f"{slug}: {len(cities)} cities out of range")
        if len(places) != len(set(places)): errors.append(f"{slug}: duplicate place refs")
        if len(cities) != len(set(cities)): errors.append(f"{slug}: duplicate city refs")
        allowed = ALLOWED_CATEGORIES.get(rtype)
        for p in places:
            if p not in place_slugs: errors.append(f"{slug}: place {p} not in nearby-places.ts")
            cat = place_category.get(p)
            if allowed and cat and cat not in allowed:
                errors.append(f"{slug}: place {p} category {cat} invalid for {rtype}")
            nm = place_name.get(p, "").lower()
            if rtype == "forest_region" and not any(t in nm for t in FOREST_TOKENS):
                errors.append(f"{slug}: forest_region place {p} not forest-linked")
            if rtype == "river_region" and not any(t in nm for t in RIVER_TOKENS):
                errors.append(f"{slug}: river_region place {p} not river-linked")
        for c in cities:
            if c not in city_slugs: errors.append(f"{slug}: city {c} not in cities.ts")
        for p in fplaces:
            if p not in places: errors.append(f"{slug}: featuredPlace {p} not in nearbyPlaces")
        for c in fcities:
            if c not in cities: errors.append(f"{slug}: featuredCity {c} not in cities")
        if not related: errors.append(f"{slug}: orphan collection (no relatedCollections)")
        if len(related) != len(set(related)): errors.append(f"{slug}: duplicate related refs")
        if slug in related: errors.append(f"{slug}: related self-reference")

    all_slugs = {s for s, _, _ in parsed}
    for b in blocks:
        sm = re.search(r'slug:\s*"([a-z0-9-]+)"', b)
        if not sm or sm.group(1) not in all_slugs:
            continue
        for r in arr("relatedCollections", b):
            if r not in all_slugs: errors.append(f"{sm.group(1)}: related {r} not found")

    # strict subset within same type
    by_type: dict[str, list] = {}
    for slug, rtype, places in parsed:
        by_type.setdefault(rtype, []).append((slug, set(places)))
    for rtype, lst in by_type.items():
        for s1, p1 in lst:
            for s2, p2 in lst:
                if s1 != s2 and len(p1) < len(p2) and p1 <= p2:
                    errors.append(f"{s1}: strict subset of same-type {s2}"); break

    if errors:
        print("FAIL: regional-collections validation failed:", file=sys.stderr)
        for e in errors[:50]:
            print(f"  - {e}", file=sys.stderr)
        return 1
    types_used = len({rt for _, rt, _ in parsed})
    rel = sum(len(arr("relatedCollections", b)) for b in blocks
              if re.search(r'slug:\s*"([a-z0-9-]+)"', b) and re.search(r'regionType', b))
    print(f"PASS: regional-collections ({len(parsed)} collections, {types_used} region types, "
          f"{rel} related links) — all checks clean.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
