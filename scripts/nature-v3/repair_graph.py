#!/usr/bin/env python3
"""V3 Phase 8/9 — repair wrong distances in lib/data/city-discovery-graph.ts.

The graph publishes great-circle distances between city centres. For a handful
of cities its geometry is self-consistent around the WRONG point: Hradec
Kralove's edges describe a location ~130 km away near Prague, while both
Wikidata and the city's own curated places put it where it actually is.

lib/data/city-coordinates.ts is the source of truth for where a city is, so
every edge is recomputed from it. An edge is rewritten only when it moves by
more than TOLERANCE_KM, so correct rows stay byte-identical and the diff shows
exactly the geometry that was wrong.
"""
import json, math, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GRAPH = ROOT / "lib/data/city-discovery-graph.ts"
TOLERANCE_KM = 1.0   # rewrite anything that disagrees by more than rounding

coords = {}
for m in re.finditer(r'^\s*\["([a-z0-9-]+)", (-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?),',
                     (ROOT / "lib/data/city-coordinates.ts").read_text(), re.M):
    coords[m.group(1)] = (float(m.group(2)), float(m.group(3)))
print(f"authoritative coordinates: {len(coords)}")


def hav(a, b, c, d):
    r = math.radians
    return 2 * 6371 * math.asin(math.sqrt(
        math.sin((r(c) - r(a)) / 2) ** 2 + math.cos(r(a)) * math.cos(r(c)) * math.sin((r(d) - r(b)) / 2) ** 2))


src = GRAPH.read_text()
out, cur, changed, checked = [], None, 0, 0
touched = {}
for line in src.split("\n"):
    head = re.match(r'^  "([a-z0-9-]+)": \[', line)
    if head:
        cur = head.group(1)
        out.append(line)
        continue
    edge = re.match(r'^(\s*\{ citySlug: "([a-z0-9-]+)", distanceKm: )(\d+(?:\.\d+)?)(, relationshipType: .*)$', line)
    if edge and cur and cur in coords and edge.group(2) in coords:
        a, b = coords[cur], coords[edge.group(2)]
        got = round(hav(a[0], a[1], b[0], b[1]))
        checked += 1
        if abs(got - float(edge.group(3))) > TOLERANCE_KM:
            changed += 1
            touched[cur] = touched.get(cur, 0) + 1
            touched[edge.group(2)] = touched.get(edge.group(2), 0) + 1
            out.append(f"{edge.group(1)}{got}{edge.group(4)}")
            continue
    out.append(line)

GRAPH.write_text("\n".join(out))
print(f"edges checked: {checked}; edges rewritten: {changed}")
print(f"cities whose geometry changed: {len(touched)}")
for s, n in sorted(touched.items(), key=lambda kv: -kv[1])[:20]:
    print(f"  {s}: {n} edges")
