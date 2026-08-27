#!/usr/bin/env python3
"""V3 Phase 7 — recover beach/coast places for coastal cities that lack them.

Targets only cities that are coastal by evidence AND have enough real beach
entities nearby to reach the unchanged >=4 publication threshold. Nothing is
added to pad a count: a city that cannot reach four verified beaches keeps
whatever it has and simply gets no /beaches page.
"""
import sys, json, math, re, collections
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from resolve import (slugify, categorize, band, resolve_image_cached, hav,   # noqa: E402
                     IMG_CACHE, IMG_CACHE_PATH, BAD_NAME, HARD_BAD_TYPE)
from coastal_audit import sea_coastal  # noqa: E402

OUT = HERE / "cache"
NCACHE = ROOT / "scripts/nature/cache"
SEARCH_KM = 60.0        # a beach page should not send anyone 200 km up the coast
TARGET_PER_CITY = 6     # enough to clear the unchanged >=4 bar with headroom
MIN_EVIDENCE = 4        # skip cities that cannot reach the bar honestly

audit = json.load(open(OUT / "coastal-audit.json"))
existing = json.load(open(NCACHE / "places-compact.json"))
used_slugs = {p["slug"] for p in existing}
qids_by_city = collections.defaultdict(set)
for p in existing:
    for c in p["cities"]:
        qids_by_city[c].add(p["qid"])

prior = json.load(open(OUT / "resolved.json")) if (OUT / "resolved.json").exists() else {}
for c, recs in prior.items():
    for r in recs:
        used_slugs.add(r["slug"])
        qids_by_city[c].add(r["wikidataId"])

pools = {f.stem[len("coast_"):]: json.load(open(f)) for f in OUT.glob("coast_*.json")}
out = json.load(open(OUT / "coastal-resolved.json")) if (OUT / "coastal-resolved.json").exists() else {}
for c, recs in out.items():
    for r in recs:
        used_slugs.add(r["slug"])
        qids_by_city[c].add(r["wikidataId"])

targets = [r for r in audit if r["beaches"] + r["coast"] < 4 and r["slug"] not in out]
targets.sort(key=lambda r: -r["coastalEvidence"])
print(f"coastal cities below the beach threshold: {len(targets)}")

processed = added = 0
for row in targets:
    pool = pools.get(row["country"], [])
    have = qids_by_city[row["slug"]]
    cands = []
    for f in pool:
        if not f["name"] or f["qid"] in have:
            continue
        if not sea_coastal(f["types"]):
            continue
        if BAD_NAME.search(f["name"]) or HARD_BAD_TYPE.search(f["types"]):
            continue
        if abs(f["lat"] - row["lat"]) > 0.9 or abs(f["lon"] - row["lon"]) > 1.2:
            continue
        km = hav(row["lat"], row["lon"], f["lat"], f["lon"])
        if km <= SEARCH_KM:
            cands.append((km, f))
    if len(cands) + row["beaches"] + row["coast"] < MIN_EVIDENCE:
        out[row["slug"]] = []
        continue
    cands.sort(key=lambda x: (-x[1]["sitelinks"], x[0]))

    picked, seen = [], set()
    need = TARGET_PER_CITY - (row["beaches"] + row["coast"])
    for km, f in cands:
        if len(picked) >= need:
            break
        key = slugify(f["name"])
        slug = f"{key}-near-{row['slug']}"
        if not key or key in seen or slug in used_slugs or f["qid"] in have:
            continue
        img = resolve_image_cached(f)
        if not img:
            continue
        picked.append({"slug": slug, "name": f["name"], "countrySlug": row["country"],
                       "category": categorize(f["types"]),
                       "connectedCitySlugs": [row["slug"]], "distanceBand": band(km),
                       "wikidataId": f["qid"], "officialUrl": f.get("website"),
                       "latitude": round(f["lat"], 5), "longitude": round(f["lon"], 5),
                       "km": round(km, 1), "image": img, "types": f["types"],
                       "sitelinks": f["sitelinks"]})
        seen.add(key)
        used_slugs.add(slug)
        have.add(f["qid"])
    picked.sort(key=lambda p: p["km"])
    out[row["slug"]] = picked
    added += len(picked)
    processed += 1
    if processed % 20 == 0:
        json.dump(out, open(OUT / "coastal-resolved.json", "w"))
        json.dump(IMG_CACHE, open(IMG_CACHE_PATH, "w"))
        print(f"  {processed}/{len(targets)} cities, {added} beach/coast places added", flush=True)

json.dump(out, open(OUT / "coastal-resolved.json", "w"))
json.dump(IMG_CACHE, open(IMG_CACHE_PATH, "w"))
tot = sum(len(v) for v in out.values())
print(f"\ncoastal cities processed: {len(out)}; beach/coast places added: {tot}")
print(f"cities that reached >=4 beach/coast: {sum(1 for k, v in out.items() if len(v) + next((r['beaches']+r['coast'] for r in audit if r['slug']==k), 0) >= 4)}")
