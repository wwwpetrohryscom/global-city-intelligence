#!/usr/bin/env python3
"""Relaxed hero retry for wave14 fails (mostly BE/AT/CH towns whose valid P18 photos
are just below the strict 1000px hero floor). Lowers MIN_DIM to 600 (== the audit
floor), still requiring CC/PD license + real author + jpeg/png. P18 -> P373 category
fallback. Idempotent: only fills cities missing from heroes.json."""
import json, sys, time
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C

OUT = Path("/tmp/w14")
selected = json.load(open(OUT / "selected.json"))
HEROES = OUT / "heroes.json"
heroes = json.load(open(HEROES))
COUNTRY_NAME = {"united-states": "United States", "united-kingdom": "United Kingdom",
                "germany": "Germany", "belgium": "Belgium", "austria": "Austria", "switzerland": "Switzerland"}
MIN_DIM = 600


def try_file(fn, city):
    if not fn or C.file_unsuitable(fn):
        return None
    ii = C.imageinfo(fn, width=1280)
    if not ii or ii["mime"] not in ("image/jpeg", "image/png"):
        return None
    if max(ii.get("ow") or 0, ii.get("oh") or 0) < MIN_DIM:
        return None
    if not C.license_ok(ii["licenseCode"], ii["licenseShort"]):
        return None
    author = C.clean_author(ii["artist"])
    if not author:
        return None
    lic, licurl = C.normalize_license(ii["licenseCode"], ii["licenseShort"])
    if ii.get("licenseUrl"):
        licurl = ii["licenseUrl"]
    sf = fn.replace("_", " ")
    return {"src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
            "alt": f"View of {city['name']}, {COUNTRY_NAME[city['countrySlug']]}",
            "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + sf,
            "author": author, "authorUrl": C.author_url(ii["artist"]),
            "license": lic, "licenseUrl": licurl,
            "attributionText": f"{author} / Wikimedia Commons, {lic}",
            "commonsFile": sf, "qid": city["qid"]}


def resolve(city):
    h = try_file(city.get("p18file"), city)
    if h:
        return h
    try:
        claims = C.entity_claims(city["qid"])
    except Exception:
        return None
    for f in C.claim_values(claims, "P18"):
        h = try_file(f, city)
        if h:
            return h
    for cat in C.claim_values(claims, "P373"):
        try:
            files = C.category_files(cat, limit=80)
        except Exception:
            continue
        files.sort(key=lambda f: (0 if f.lower().endswith((".jpg", ".jpeg")) else 1, f.lower()))
        for f in files:
            h = try_file(f, city)
            if h:
                return h
    return None


todo = [c for c in selected if c["slug"] not in heroes]
print(f"retrying {len(todo)} fails at MIN_DIM={MIN_DIM}")
still = []
for i, c in enumerate(todo):
    try:
        h = resolve(c)
    except Exception:
        h = None
    if h:
        heroes[c["slug"]] = h
    else:
        still.append(c["slug"])
    if (i + 1) % 20 == 0:
        json.dump(heroes, open(HEROES, "w"), ensure_ascii=False)
        print(f"  {i+1}/{len(todo)} resolved_total={len(heroes)} still_fail={len(still)}")
    time.sleep(0.15)
json.dump(heroes, open(HEROES, "w"), ensure_ascii=False)
json.dump(still, open(OUT / "hero_fails.json", "w"))
print(f"DONE heroes={len(heroes)}/250 still_fail={len(still)}: {still}")
