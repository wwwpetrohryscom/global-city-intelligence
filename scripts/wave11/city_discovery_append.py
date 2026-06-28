#!/usr/bin/env python3
"""Wave 11 Phase 7a: append new-city nodes to CITY_DISCOVERY_GRAPH (append-only;
existing nodes untouched). Each new city -> up to 10 nearest related cities."""
import json, math, re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
OUT = Path("/tmp/w11")
coords = json.load(open(OUT / "all_city_coords.json"))  # slug -> [lat,lon] (existing+new)
sel = json.load(open(OUT / "selected.json"))
new_by_slug = {c["slug"]: c for c in sel}
# country per slug: existing from existing_cities, new from selected
country = {c["slug"]: c["countrySlug"] for c in json.load(open(OUT / "existing_cities.json"))}
for c in sel: country[c["slug"]] = c["countrySlug"]

def hav(a, b, c, d):
    r = math.radians
    return 2*6371*math.asin(math.sqrt(math.sin((r(c)-r(a))/2)**2 + math.cos(r(a))*math.cos(r(c))*math.sin((r(d)-r(b))/2)**2))

pool = [(s, v[0], v[1]) for s, v in coords.items()]
def edges_for(slug):
    la, lo = coords[slug]; cc = country.get(slug)
    cand = []
    for s2, la2, lo2 in pool:
        if s2 == slug: continue
        if abs(la2-la) > 8 or abs(lo2-lo) > 9: continue
        km = hav(la, lo, la2, lo2)
        cand.append((km, s2))
    cand.sort()
    out = []
    for km, s2 in cand[:10]:
        c2 = country.get(s2)
        rel = "cross_border" if (c2 and c2 != cc) else ("nearby_city" if km <= 80 else "same_region")
        out.append((s2, max(1, round(km)), rel))
    # if <5 within bbox, widen (rare, remote)
    if len(out) < 5:
        allc = sorted(((hav(la, lo, la2, lo2), s2) for s2, la2, lo2 in pool if s2 != slug))[:10]
        out = []
        for km, s2 in allc:
            c2 = country.get(s2)
            rel = "cross_border" if (c2 and c2 != cc) else ("nearby_city" if km <= 80 else "same_region")
            out.append((s2, max(1, round(km)), rel))
    return out

blocks = [f'  // ===== Wave 11 ({len(sel)} new cities) =====']
total_edges = 0
for c in sel:
    es = edges_for(c["slug"])
    total_edges += len(es)
    lines = "\n".join(
        f'    {{ citySlug: {json.dumps(s)}, distanceKm: {d}, relationshipType: {json.dumps(rel)} }},'
        for s, d, rel in es)
    blocks.append(f'  {json.dumps(c["slug"])}: [\n{lines}\n  ],')

src = (ROOT / "lib/data/city-discovery-graph.ts").read_text()
# insert before the closing `};` of the CITY_DISCOVERY_GRAPH object
start = src.index("CITY_DISCOVERY_GRAPH")
# find matching close of the object literal
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
(ROOT / "lib/data/city-discovery-graph.ts").write_text(src)
print(f"city-discovery-graph.ts: +{len(sel)} nodes, {total_edges} edges (avg {total_edges/len(sel):.1f})")
