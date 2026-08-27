#!/usr/bin/env python3
"""V4 Phase 7-9 — top up forest and waterfall coverage.

Only cities that can honestly reach the UNCHANGED >=4 bar are topped up, and
only from candidates within SEARCH_KM. That radius is deliberately tighter than
the layer's 300 km cap: a "Forests near X" page whose every entry sits 280 km
away is within policy and still not worth publishing. Nothing is added to a
city that cannot reach four verified entities inside it.
"""
import sys, json, math, re, collections
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "scripts" / "nature-v3"))
from resolve import (genuine_nature, slugify, band, hav,          # noqa: E402
                     resolve_image_cached, IMG_CACHE, IMG_CACHE_PATH,
                     BAD_NAME, HARD_BAD_TYPE)

SEARCH_KM = 120.0      # nearby + day-trip bands only
TARGET_PER_CITY = 6    # clears the unchanged >=4 bar with headroom
MIN_TO_BOTHER = 4      # never add to a city that still cannot reach the bar

NC = ROOT / "scripts/nature/cache"
coords = json.load(open(NC / "city-coords.json"))["coords"]
cls = json.load(open(NC / "classification.json"))
places = json.load(open(NC / "places-compact.json"))

used_slugs = {p["slug"] for p in places}
qids_by_city = collections.defaultdict(set)
for p in places:
    for c in p["cities"]:
        qids_by_city[c].add(p["qid"])

src = (ROOT / "lib/data/cities.ts").read_text()
body = src[src.index("const seeds: CitySeed[] = ["):src.index("export const cities: City[] = seeds.map(buildCity);")]
it = list(re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', body))
country = {}
for i, m in enumerate(it):
    blk = body[m.start(): it[i + 1].start() if i + 1 < len(it) else len(body)]
    g = re.search(r'countrySlug: "([a-z0-9-]+)"', blk)
    country[m.group(1)] = g.group(1) if g else None

# Categories the corpus record carries. The nature taxonomy re-derives its own
# from P31 — this only has to be a valid NearbyPlaceCategory.
CORPUS_CATEGORY = {"forest": "nature", "fall": "nature"}

out_path = HERE / "cache" / "resolved.json"
out = json.load(open(out_path)) if out_path.exists() else {}
for key, recs in out.items():
    cs = key.split("|", 1)[1]
    for r in recs:
        used_slugs.add(r["slug"])
        qids_by_city[cs].add(r["wikidataId"])

for kind, cat in (("forest", "forest"), ("fall", "waterfall")):
    pools = {}
    for f in (HERE / "cache").glob(f"{kind}_*.json"):
        pools[f.stem[len(kind) + 1:]] = [
            x for x in json.load(open(f))
            if x["name"] and genuine_nature(x["types"], x["name"], x["sitelinks"])
            and not BAD_NAME.search(x["name"]) and not HARD_BAD_TYPE.search(x["types"])
        ]

    have = collections.Counter()
    for p in places:
        c = cls[p["slug"]]
        if c["confidence"] in ("high", "medium") and cat in (c["categories"] or []):
            for x in p["cities"]:
                if x in coords and hav(coords[x]["lat"], coords[x]["lon"], p["lat"], p["lon"]) <= 300:
                    have[x] += 1

    added = cities_done = 0
    for slug, co in sorted(coords.items()):
        key = f"{kind}|{slug}"
        if key in out:
            continue
        pool = pools.get(country.get(slug) or "", [])
        mine = qids_by_city[slug]
        cands = []
        for f in pool:
            if f["qid"] in mine:
                continue
            if abs(f["lat"] - co["lat"]) > 1.8 or abs(f["lon"] - co["lon"]) > 2.4:
                continue
            km = hav(co["lat"], co["lon"], f["lat"], f["lon"])
            if km <= SEARCH_KM:
                cands.append((km, f))
        if have.get(slug, 0) + len(cands) < MIN_TO_BOTHER:
            out[key] = []
            continue

        need = max(0, TARGET_PER_CITY - have.get(slug, 0))
        if need == 0:
            out[key] = []
            continue
        # nearest first, notability breaking ties
        cands.sort(key=lambda x: (round(x[0] / 15), -x[1]["sitelinks"], x[0]))

        picked, seen = [], set()
        for km, f in cands:
            if len(picked) >= need:
                break
            nm = slugify(f["name"])
            place_slug = f"{nm}-near-{slug}"
            if not nm or nm in seen or place_slug in used_slugs or f["qid"] in mine:
                continue
            img = resolve_image_cached(f)
            if not img:
                continue
            picked.append({"slug": place_slug, "name": f["name"], "countrySlug": country[slug],
                           "category": CORPUS_CATEGORY[kind],
                           "connectedCitySlugs": [slug], "distanceBand": band(km),
                           "wikidataId": f["qid"], "officialUrl": f.get("website"),
                           "latitude": round(f["lat"], 5), "longitude": round(f["lon"], 5),
                           "km": round(km, 1), "image": img, "types": f["types"],
                           "sitelinks": f["sitelinks"], "kind": kind})
            seen.add(nm)
            used_slugs.add(place_slug)
            mine.add(f["qid"])
        picked.sort(key=lambda p: p["km"])
        out[key] = picked
        added += len(picked)
        cities_done += 1
        if cities_done % 200 == 0:
            json.dump(out, open(out_path, "w"))
            json.dump(IMG_CACHE, open(IMG_CACHE_PATH, "w"))
            print(f"  {kind}: {cities_done} cities, {added} places", flush=True)

    json.dump(out, open(out_path, "w"))
    json.dump(IMG_CACHE, open(IMG_CACHE_PATH, "w"))
    print(f"{kind}: cities topped up {cities_done}, places added {added}")

tot = sum(len(v) for v in out.values())
print(f"\nV4 places: {tot}")
