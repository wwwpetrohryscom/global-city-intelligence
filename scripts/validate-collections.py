#!/usr/bin/env python3
"""
Validate the regional discovery collections in lib/data/regional-collections.ts:

  - collection slug unique
  - valid regionType
  - >= 5 nearby places, >= 2 cities
  - no duplicate place / city references
  - every place exists in nearby-places.ts; every city exists in cities.ts
  - featuredPlaces subset of nearbyPlaces; featuredCities subset of cities

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
# Single-feature region types whose members must carry a matching category
# (national-park / cross-border / weekend-escape span categories: unconstrained).
ALLOWED_CATEGORIES = {
    "mountain_region": {"mountain"},
    "lake_region": {"lake"},
    "coastal_region": {"beach", "island", "waterfront"},
    "island_region": {"island"},
    "river_region": {"nature", "park", "waterfront"},
    "forest_region": {"nature", "park"},
    "protected_landscape_region": {"park", "nature"},
}
MIN_PLACES, MIN_CITIES = 5, 2


def arr(field, block):
    m = re.search(field + r":\s*\[(.*?)\]", block, re.DOTALL)
    return re.findall(r'"([^"]+)"', m.group(1)) if m else []


def main() -> int:
    text = DATA.read_text()
    places_src = PLACES.read_text()
    place_slugs = set(re.findall(r'\bslug:\s*"([a-z0-9][a-z0-9-]*)"', places_src))
    city_slugs = set(re.findall(r'\bslug:\s*"([a-z0-9][a-z0-9-]*)"', CITIES.read_text()))
    # slug -> category map (slug then category appear in field order on each seed)
    place_category = dict(re.findall(
        r'slug:\s*"([a-z0-9-]+)"[^}]*?category:\s*"([a-z_]+)"', places_src, re.DOTALL))

    # split into collection blocks by top-level "slug:" markers
    blocks = re.split(r'\n  \{\n', text)
    errors: list[str] = []
    slugs_seen = set()
    n = 0
    for b in blocks:
        sm = re.search(r'slug:\s*"([a-z0-9-]+)"', b)
        rm = re.search(r'regionType:\s*"([a-z_]+)"', b)
        if not sm or not rm:
            continue
        n += 1
        slug = sm.group(1); rtype = rm.group(1)
        if slug in slugs_seen: errors.append(f"{slug}: duplicate collection slug")
        slugs_seen.add(slug)
        if rtype not in VALID: errors.append(f"{slug}: invalid regionType {rtype}")
        cities = arr("cities", b); places = arr("nearbyPlaces", b)
        fplaces = arr("featuredPlaces", b); fcities = arr("featuredCities", b)
        if len(places) < MIN_PLACES: errors.append(f"{slug}: {len(places)} places below min {MIN_PLACES}")
        if len(cities) < MIN_CITIES: errors.append(f"{slug}: {len(cities)} cities below min {MIN_CITIES}")
        if len(places) != len(set(places)): errors.append(f"{slug}: duplicate place refs")
        if len(cities) != len(set(cities)): errors.append(f"{slug}: duplicate city refs")
        allowed = ALLOWED_CATEGORIES.get(rtype)
        for p in places:
            if p not in place_slugs: errors.append(f"{slug}: place {p} not in nearby-places.ts")
            if allowed:
                cat = place_category.get(p)
                if cat and cat not in allowed:
                    errors.append(f"{slug}: place {p} category {cat} invalid for {rtype}")
        for c in cities:
            if c not in city_slugs: errors.append(f"{slug}: city {c} not in cities.ts")
        for p in fplaces:
            if p not in places: errors.append(f"{slug}: featuredPlace {p} not in nearbyPlaces")
        for c in fcities:
            if c not in cities: errors.append(f"{slug}: featuredCity {c} not in cities")

    if errors:
        print("FAIL: regional-collections validation failed:", file=sys.stderr)
        for e in errors[:50]:
            print(f"  - {e}", file=sys.stderr)
        return 1
    types_used = len({re.search(r'regionType:\s*"([a-z_]+)"', b).group(1)
                      for b in blocks if re.search(r'regionType:\s*"([a-z_]+)"', b)})
    print(f"PASS: regional-collections ({n} collections, {types_used} region types) — all checks clean.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
