#!/usr/bin/env python3
"""
Validate the nearby-place discovery graph in
lib/data/nearby-place-discovery-graph.ts:

  - every source placeSlug exists in lib/data/nearby-places.ts
  - every related placeSlug exists in lib/data/nearby-places.ts
  - no self-references
  - no duplicate references within a node
  - relationshipType is one of the allowed enum members
  - at most 10 related places per place
  - distanceKm is a positive integer

Mirrors the runtime guard (which fails `next build`). Non-zero exit on failure.
"""
from __future__ import annotations
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GRAPH = ROOT / "lib/data/nearby-place-discovery-graph.ts"
PLACES = ROOT / "lib/data/nearby-places.ts"

# PascalCase members of NearbyPlaceRelationshipType
VALID_MEMBERS = {
    "NearbyPlace", "SameRegion", "SameProtectedAreaSystem", "SameMountainRegion",
    "SameCoastline", "SameRiverSystem", "SameLakeRegion", "SameEcoregion",
    "WeekendAlternative", "CrossBorderNature",
}
MAX_RELATED = 10


def place_slugs() -> set[str]:
    # slugs live on PlaceSeed objects: `slug: "..."`
    return set(re.findall(r'\bslug:\s*"([a-z0-9][a-z0-9-]*)"', PLACES.read_text()))


def main() -> int:
    text = GRAPH.read_text()
    slugs = place_slugs()
    start = text.find("NEARBY_PLACE_DISCOVERY_GRAPH")
    body_start = text.find("{", start)
    depth = 0; i = body_start; end = -1
    while i < len(text):
        if text[i] == "{": depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0: end = i; break
        i += 1
    body = text[body_start:end]

    errors: list[str] = []
    nodes = 0; total = 0
    for m in re.finditer(r'"([a-z0-9-]+)":\s*\[(.*?)\]', body, re.DOTALL):
        slug = m.group(1); arr = m.group(2)
        nodes += 1
        if slug not in slugs:
            errors.append(f"{slug}: source place not in nearby-places.ts")
        edges = re.findall(
            r'\{\s*placeSlug:\s*"([^"]+)",\s*distanceKm:\s*(-?\d+),'
            r'\s*relationshipType:\s*Rel\.(\w+)\s*\}', arr)
        if len(edges) > MAX_RELATED:
            errors.append(f"{slug}: {len(edges)} edges exceeds max {MAX_RELATED}")
        seen = set()
        for pslug, dist, member in edges:
            total += 1
            if pslug == slug: errors.append(f"{slug}: self-reference")
            if pslug in seen: errors.append(f"{slug}: duplicate reference to {pslug}")
            seen.add(pslug)
            if pslug not in slugs: errors.append(f"{slug}: related place {pslug} not in nearby-places.ts")
            if member not in VALID_MEMBERS: errors.append(f"{slug}: invalid relationshipType {member}")
            if int(dist) <= 0: errors.append(f"{slug}: non-positive distanceKm to {pslug}")

    if errors:
        print("FAIL: nearby-place-discovery-graph validation failed:", file=sys.stderr)
        for e in errors[:50]:
            print(f"  - {e}", file=sys.stderr)
        return 1
    print(f"PASS: nearby-place-discovery-graph ({nodes} places, {total} relationships, "
          f"avg {total/nodes:.1f} per place) — all checks clean.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
