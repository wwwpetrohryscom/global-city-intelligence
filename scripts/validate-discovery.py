#!/usr/bin/env python3
"""
Validate the city discovery graph in lib/data/city-discovery-graph.ts:

  - every source citySlug exists in lib/data/cities.ts
  - every related citySlug exists in lib/data/cities.ts
  - no self-references
  - no duplicate references within a node
  - relationshipType is one of the allowed values
  - at most 10 related cities per city
  - distanceKm is a positive integer

Mirrors the runtime guard (which fails `next build`). Non-zero exit on failure.
"""
from __future__ import annotations
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GRAPH = ROOT / "lib/data/city-discovery-graph.ts"
CITIES = ROOT / "lib/data/cities.ts"

VALID = {"nearby_city","same_region","same_corridor","weekend_trip",
         "coastal_cluster","mountain_cluster","lake_cluster","cross_border"}
MAX_RELATED = 10


def main() -> int:
    text = GRAPH.read_text()
    city_slugs = set(re.findall(r'^\s+slug:\s*"([a-z][a-z0-9-]*)",', CITIES.read_text(), re.M))
    # carve the object literal after `CITY_DISCOVERY_GRAPH ... = {`
    start = text.find("CITY_DISCOVERY_GRAPH")
    body_start = text.find("{", start)
    # find matching close brace
    depth = 0; i = body_start; end = -1
    while i < len(text):
        if text[i] == "{": depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0: end = i; break
        i += 1
    body = text[body_start:end]
    errors: list[str] = []
    total = 0; nodes = 0
    # each node: "slug": [ ... ],
    for m in re.finditer(r'"([a-z0-9-]+)":\s*\[(.*?)\]', body, re.DOTALL):
        slug = m.group(1); arr = m.group(2)
        if slug not in city_slugs:
            errors.append(f"{slug}: source city not in cities.ts")
        nodes += 1
        edges = re.findall(r'\{\s*citySlug:\s*"([^"]+)",\s*distanceKm:\s*(-?\d+),\s*relationshipType:\s*"([^"]+)"\s*\}', arr)
        if len(edges) > MAX_RELATED:
            errors.append(f"{slug}: {len(edges)} edges exceeds max {MAX_RELATED}")
        seen = set()
        for cslug, dist, rtype in edges:
            total += 1
            if cslug == slug: errors.append(f"{slug}: self-reference")
            if cslug in seen: errors.append(f"{slug}: duplicate reference to {cslug}")
            seen.add(cslug)
            if cslug not in city_slugs: errors.append(f"{slug}: related city {cslug} not in cities.ts")
            if rtype not in VALID: errors.append(f"{slug}: invalid relationshipType {rtype}")
            if int(dist) <= 0: errors.append(f"{slug}: non-positive distanceKm to {cslug}")

    if errors:
        print("FAIL: city-discovery-graph validation failed:", file=sys.stderr)
        for e in errors[:50]:
            print(f"  - {e}", file=sys.stderr)
        return 1
    print(f"PASS: city-discovery-graph ({nodes} cities, {total} relationships, "
          f"avg {total/nodes:.1f} per city) — all checks clean.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
