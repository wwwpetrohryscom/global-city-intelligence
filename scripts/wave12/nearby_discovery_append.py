#!/usr/bin/env python3
"""Wave 11 Phase 7b: append new-place nodes to NEARBY_PLACE_DISCOVERY_GRAPH
(append-only). Each new nearby place -> up to 10 nearest related new places."""
import json, math
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
OUT = Path("/tmp/w12")
nearby = json.load(open(OUT / "nearby.json"))

places = []  # flat list of new places
for city, recs in nearby.items():
    for r in recs:
        places.append({"slug": r["slug"], "lat": r["latitude"], "lon": r["longitude"],
                       "cat": r["category"], "country": r["countrySlug"], "city": city})
print("new places:", len(places))

def hav(a, b, c, d):
    r = math.radians
    return 2*6371*math.asin(math.sqrt(math.sin((r(c)-r(a))/2)**2 + math.cos(r(a))*math.cos(r(c))*math.sin((r(d)-r(b))/2)**2))

COASTAL = {"beach", "waterfront", "island"}
def rel(a, b, km):
    if a["country"] != b["country"]: return "CrossBorderNature"
    if km <= 30: return "NearbyPlace"
    if a["cat"] == b["cat"] == "mountain": return "SameMountainRegion"
    if a["cat"] in COASTAL and b["cat"] in COASTAL: return "SameCoastline"
    if a["cat"] == b["cat"] == "lake": return "SameLakeRegion"
    if km <= 120: return "SameRegion"
    return "WeekendAlternative"

blocks = [f'  // ===== Wave 11 ({len(places)} new places) =====']
total = 0
for p in places:
    cand = []
    for q in places:
        if q["slug"] == p["slug"]: continue
        if abs(q["lat"]-p["lat"]) > 6 or abs(q["lon"]-p["lon"]) > 8: continue
        km = hav(p["lat"], p["lon"], q["lat"], q["lon"])
        cand.append((km, q))
    cand.sort(key=lambda x: x[0])
    edges = cand[:10]
    if len(edges) < 5:  # widen for isolated places
        edges = sorted(((hav(p["lat"], p["lon"], q["lat"], q["lon"]), q) for q in places if q["slug"] != p["slug"]), key=lambda x: x[0])[:10]
    total += len(edges)
    lines = "\n".join(
        f'    {{ placeSlug: {json.dumps(q["slug"])}, distanceKm: {max(1, round(km))}, relationshipType: Rel.{rel(p, q, km)} }},'
        for km, q in edges)
    blocks.append(f'  {json.dumps(p["slug"])}: [\n{lines}\n  ],')

src = (ROOT / "lib/data/nearby-place-discovery-graph.ts").read_text()
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
print(f"nearby-place-discovery-graph.ts: +{len(places)} nodes, {total} edges (avg {total/len(places):.1f})")
