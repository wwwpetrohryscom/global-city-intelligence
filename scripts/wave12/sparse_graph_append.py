#!/usr/bin/env python3
"""Wave 12 sparse expansion: append graph nodes for the topped-up sparse places to
NEARBY_PLACE_DISCOVERY_GRAPH (append-only). Each sparse place links to its 10
nearest places drawn from the sparse-add + wave12-main pools (all of which have
nodes), so no edge dangles to a node-less place."""
import json, math
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
OUT = Path("/tmp/w12")
sparse = json.load(open(OUT / "sparse_add.json"))
main = json.load(open(OUT / "nearby.json"))


def flat(d):
    out = []
    for city, recs in d.items():
        for r in recs:
            out.append({"slug": r["slug"], "lat": r["latitude"], "lon": r["longitude"],
                        "cat": r["category"], "country": r["countrySlug"], "city": city})
    return out


nodes = flat(sparse)                 # nodes to create (sparse only)
pool = nodes + flat(main)            # candidate neighbours (all have graph nodes)
node_slugs = {p["slug"] for p in nodes}
print("sparse nodes:", len(nodes), "| candidate pool:", len(pool))


def hav(a, b, c, d):
    r = math.radians
    return 2 * 6371 * math.asin(math.sqrt(math.sin((r(c) - r(a)) / 2) ** 2 + math.cos(r(a)) * math.cos(r(c)) * math.sin((r(d) - r(b)) / 2) ** 2))


COASTAL = {"beach", "waterfront", "island"}


def rel(a, b, km):
    if a["country"] != b["country"]: return "CrossBorderNature"
    if km <= 30: return "NearbyPlace"
    if a["cat"] == b["cat"] == "mountain": return "SameMountainRegion"
    if a["cat"] in COASTAL and b["cat"] in COASTAL: return "SameCoastline"
    if a["cat"] == b["cat"] == "lake": return "SameLakeRegion"
    if km <= 120: return "SameRegion"
    return "WeekendAlternative"


blocks = [f'  // ===== Wave 12 sparse expansion ({len(nodes)} new place nodes) =====']
total = 0
for p in nodes:
    cand = []
    for q in pool:
        if q["slug"] == p["slug"]: continue
        if abs(q["lat"] - p["lat"]) > 6 or abs(q["lon"] - p["lon"]) > 8: continue
        cand.append((hav(p["lat"], p["lon"], q["lat"], q["lon"]), q))
    cand.sort(key=lambda x: x[0])
    edges = cand[:10]
    if len(edges) < 5:
        edges = sorted(((hav(p["lat"], p["lon"], q["lat"], q["lon"]), q) for q in pool if q["slug"] != p["slug"]),
                       key=lambda x: x[0])[:10]
    total += len(edges)
    lines = "\n".join(
        f'    {{ placeSlug: {json.dumps(q["slug"])}, distanceKm: {max(1, round(km))}, relationshipType: Rel.{rel(p, q, km)} }},'
        for km, q in edges)
    blocks.append(f'  {json.dumps(p["slug"])}: [\n{lines}\n  ],')

src = (ROOT / "lib/data/nearby-place-discovery-graph.ts").read_text()
assert "Wave 12 sparse expansion" not in src, "sparse graph already appended"
start = src.index("NEARBY_PLACE_DISCOVERY_GRAPH")
bo = src.index("{", start); depth = 0; i = bo; close = -1
while i < len(src):
    if src[i] == "{": depth += 1
    elif src[i] == "}":
        depth -= 1
        if depth == 0: close = i; break
    i += 1
assert close > 0
before = src[:close].rstrip()
if not before.endswith(","): before += ","
src = before + "\n" + "\n".join(blocks) + "\n" + src[close:]
(ROOT / "lib/data/nearby-place-discovery-graph.ts").write_text(src)
print(f"nearby-place-discovery-graph.ts: +{len(nodes)} sparse nodes, {total} edges (avg {total/max(1,len(nodes)):.1f})")
