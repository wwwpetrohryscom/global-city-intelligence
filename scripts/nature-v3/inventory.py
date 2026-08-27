#!/usr/bin/env python3
"""Phase 1 — inventory every city with zero publishable nature coverage.

Separates three different failures that all look like "no page":
  * no curated nearby place exists at all
  * places exist but none survives classification
  * places exist and classify but all fall outside the distance cap
"""
import json, math, collections, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / "scripts/nature/cache"
OUT = Path(__file__).resolve().parent / "cache"
OUT.mkdir(exist_ok=True)

coords = json.load(open(CACHE / "city-coords.json"))["coords"]
cls = json.load(open(CACHE / "classification.json"))
places = json.load(open(CACHE / "places-compact.json"))
types = json.load(open(CACHE / "place-types.json"))

import re
src = (ROOT / "lib/data/cities.ts").read_text()
body = src[src.index("const seeds: CitySeed[] = ["):src.index("export const cities: City[] = seeds.map(buildCity);")]
it = list(re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', body))
meta = {}
for i, m in enumerate(it):
    blk = body[m.start(): it[i+1].start() if i+1 < len(it) else len(body)]
    g = lambda f: (re.search(f + r':\s*"((?:[^"\\]|\\.)*)"', blk) or [None, None])[1]
    meta[m.group(1)] = {"name": g("name"), "country": g("countrySlug"), "countryName": g("countryName")}

MAXKM = 300
PUB = {"high", "medium"}

def hav(a, b, c, d):
    r = math.radians
    return 2*6371*math.asin(math.sqrt(math.sin((r(c)-r(a))/2)**2 + math.cos(r(a))*math.cos(r(c))*math.sin((r(d)-r(b))/2)**2))

by_city = collections.defaultdict(list)
for p in places:
    for c in p["cities"]:
        by_city[c].append(p)

rows = []
for slug, mm in meta.items():
    co = coords.get(slug)
    raw = by_city.get(slug, [])
    eligible, rejected = [], []
    for p in raw:
        c = cls[p["slug"]]
        km = hav(co["lat"], co["lon"], p["lat"], p["lon"]) if co else None
        rec = {"slug": p["slug"], "name": p["name"], "km": round(km, 1) if km else None,
               "confidence": c["confidence"], "primary": c["primary"], "vetoed": c["vetoed"],
               "p31": list((types.get(p["qid"], {}).get("p31") or {}).values())[:3]}
        if c["confidence"] in PUB and c["primary"] and km is not None and km <= MAXKM:
            eligible.append(rec)
        else:
            rejected.append(rec)
    if eligible:
        continue
    if not raw:
        cause = "A. no nearby source data — generator never produced a place for this city"
    elif all(r["vetoed"] for r in rejected):
        cause = "F. every candidate rejected as contamination"
    elif all(r["confidence"] not in PUB for r in rejected):
        cause = "C/D. candidates exist but carry no publishable structured type"
    elif all((r["km"] or 9e9) > MAXKM for r in rejected):
        cause = "H. candidates exist but all beyond the 300 km cap"
    else:
        cause = "H. mixed"
    rows.append({"slug": slug, "name": mm["name"], "country": mm["country"],
                 "countryName": mm["countryName"],
                 "lat": co["lat"] if co else None, "lon": co["lon"] if co else None,
                 "rawPlaces": len(raw), "rejected": rejected, "cause": cause})

rows.sort(key=lambda r: (r["country"], r["slug"]))
json.dump(rows, open(OUT / "zero-coverage.json", "w"), indent=1)
print(f"cities with ZERO publishable nature coverage: {len(rows)} / {len(meta)}")
print(f"  of which zero raw corpus places : {sum(1 for r in rows if r['rawPlaces'] == 0)}")
print(f"  of which have raw but none pass : {sum(1 for r in rows if r['rawPlaces'] > 0)}")
print("\nroot causes:")
for c, n in collections.Counter(r["cause"] for r in rows).most_common():
    print(f"  {n:4d}  {c}")
print("\nby country (top 20):")
for c, n in collections.Counter(r["countryName"] for r in rows).most_common(20):
    print(f"  {n:4d}  {c}")
print("\ncities with raw places but no publishable one:")
for r in rows:
    if r["rawPlaces"]:
        print(f"  {r['slug']} ({r['countryName']}): {r['rawPlaces']} raw")
        for x in r["rejected"][:8]:
            print(f"       {str(x['km']):>7} km conf={x['confidence']:6s} veto={str(x['vetoed'])[:34]:36s} {x['name'][:30]} P31={x['p31']}")
