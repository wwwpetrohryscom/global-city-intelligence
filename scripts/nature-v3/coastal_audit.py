#!/usr/bin/env python3
"""V3 Phase 6 — coastal coverage audit.

Coastal-ness is decided from geography, not from the city's name: a city is
coastal when a real beach or coastal-landform entity exists within
COASTAL_PROXIMITY_KM of its resolved coordinate. The gap is then the set of
coastal cities whose curated corpus publishes no beach and no coast feature.
"""
import json, math, re, collections
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
OUT = HERE / "cache"
NCACHE = ROOT / "scripts/nature/cache"

COASTAL_PROXIMITY_KM = 30.0   # a sea beach this close means the city has coast access

# Sea-coast evidence only. The harvest pulls every subclass of shore, which in
# France means 193 Seine `riverfront` quais inside 30 km of Paris — enough to
# call the most famously inland capital in Europe coastal. River and urban
# beaches are excluded for the same reason.
SEA_COAST_TYPE = re.compile(
    r"\bbeach\b|sand beach|shingle beach|\bcape\b|headland|\bcove\b|calanque|"
    r"sea cliff|\bfjord\b|seashore|\bcoast\b|\bspit\b|\blagoon\b|\bisthmus\b")
NOT_SEA_COAST = re.compile(
    r"riverfront|river beach|urban beach|\bstreet\b|\broad\b|\bquay\b|"
    r"lake beach|reservoir|\bcanal\b|cultural heritage|urban area")


def sea_coastal(types):
    t = types or ""
    return bool(SEA_COAST_TYPE.search(t)) and not NOT_SEA_COAST.search(t)
BEACH_SEARCH_KM = 60.0        # how far a "beaches near X" page may reach for pass 1

coords = json.load(open(NCACHE / "city-coords.json"))["coords"]
cls = json.load(open(NCACHE / "classification.json"))
places = json.load(open(NCACHE / "places-compact.json"))

src = (ROOT / "lib/data/cities.ts").read_text()
body = src[src.index("const seeds: CitySeed[] = ["):src.index("export const cities: City[] = seeds.map(buildCity);")]
it = list(re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', body))
meta = {}
for i, m in enumerate(it):
    blk = body[m.start(): it[i+1].start() if i+1 < len(it) else len(body)]
    g = lambda f: (re.search(f + r':\s*"((?:[^"\\]|\\.)*)"', blk) or [None, None])[1]
    meta[m.group(1)] = {"name": g("name"), "country": g("countrySlug"), "countryName": g("countryName")}


def hav(a, b, c, d):
    r = math.radians
    return 2 * 6371 * math.asin(math.sqrt(
        math.sin((r(c) - r(a)) / 2) ** 2 + math.cos(r(a)) * math.cos(r(c)) * math.sin((r(d) - r(b)) / 2) ** 2))


pools = {}
for f in OUT.glob("coast_*.json"):
    pools[f.stem[len("coast_"):]] = json.load(open(f))

by_city = collections.defaultdict(list)
for p in places:
    for c in p["cities"]:
        by_city[c].append(p)

BEACHY = {"beach", "coast"}
rows = []
for slug, mm in meta.items():
    co = coords.get(slug)
    pool = pools.get(mm["country"], [])
    if not co:
        continue
    near = [f for f in pool
            if sea_coastal(f["types"])
            and abs(f["lat"] - co["lat"]) <= 1.2 and abs(f["lon"] - co["lon"]) <= 1.6
            and hav(co["lat"], co["lon"], f["lat"], f["lon"]) <= COASTAL_PROXIMITY_KM]
    if not near:
        continue                                  # not coastal by evidence
    have_beach = have_coast = 0
    for p in by_city.get(slug, []):
        c = cls[p["slug"]]
        if c["confidence"] not in ("high", "medium"):
            continue
        cats = set(c["categories"])
        if "beach" in cats:
            have_beach += 1
        if "coast" in cats:
            have_coast += 1
    rows.append({"slug": slug, "name": mm["name"], "country": mm["country"],
                 "countryName": mm["countryName"], "lat": co["lat"], "lon": co["lon"],
                 "coastalEvidence": len(near), "beaches": have_beach, "coast": have_coast})

rows.sort(key=lambda r: (r["beaches"] + r["coast"], -r["coastalEvidence"]))
json.dump(rows, open(OUT / "coastal-audit.json", "w"), indent=1)

gaps = [r for r in rows if r["beaches"] == 0 and r["coast"] == 0]
thin = [r for r in rows if 0 < r["beaches"] + r["coast"] < 4]
print(f"coastal cities identified by geography : {len(rows)}")
print(f"  with NO beach and NO coast feature   : {len(gaps)}")
print(f"  with 1-3 (thin, below page threshold): {len(thin)}")
print(f"  with >=4 (beach page already possible): {len(rows) - len(gaps) - len(thin)}")
print("\nlargest evidence gaps (most nearby real beaches, none curated):")
for r in gaps[:25]:
    print(f"  {r['slug']:26s} {r['countryName'][:16]:18s} nearby beach/coast entities within 30 km: {r['coastalEvidence']}")
for probe in ("porto", "nice", "gdansk"):
    r = next((x for x in rows if x["slug"] == probe), None)
    print(f"\n{probe}: " + (f"coastal evidence {r['coastalEvidence']}, curated beaches {r['beaches']}, coast {r['coast']}" if r else "NOT classified coastal by evidence"))
