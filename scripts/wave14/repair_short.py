#!/usr/bin/env python3
"""Replace wave14 cities that can't get a usable verified hero (or >=5 nearby) with
stronger same-country candidates that satisfy BOTH a verified Commons hero (relaxed
600px floor) AND >=5 verified nearby places. Swaps selected/heroes/nearby."""
import json, sys
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave14")
import commons as C
import nearby_resolve as NR

OUT = "/tmp/w14"
# city to replace -> country whose *_extra.json pool to draw from
REPLACE = {"hallein": "austria", "neuruppin": "germany"}
COUNTRY_NAME = {"austria": "Austria", "germany": "Germany"}
MIN_DIM = 600

selected = json.load(open(f"{OUT}/selected.json"))
heroes = json.load(open(f"{OUT}/heroes.json"))
nearby = json.load(open(f"{OUT}/nearby.json"))
used = set(r["slug"] for v in nearby.values() for r in v)
by_country_extra = {cc: json.load(open(f"{OUT}/{cc}_extra.json")) for cc in set(REPLACE.values())}
taken = set()


def hero_for(c):
    def tryf(fn):
        if not fn or C.file_unsuitable(fn): return None
        ii = C.imageinfo(fn, width=1280)
        if not ii or ii["mime"] not in ("image/jpeg", "image/png"): return None
        if max(ii.get("ow") or 0, ii.get("oh") or 0) < MIN_DIM: return None
        if not C.license_ok(ii["licenseCode"], ii["licenseShort"]): return None
        au = C.clean_author(ii["artist"])
        if not au: return None
        lic, licurl = C.normalize_license(ii["licenseCode"], ii["licenseShort"])
        if ii.get("licenseUrl"): licurl = ii["licenseUrl"]
        sf = fn.replace("_", " ")
        return {"src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
                "alt": f"View of {c['name']}, {COUNTRY_NAME[c['countrySlug']]}",
                "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + sf,
                "author": au, "authorUrl": C.author_url(ii["artist"]),
                "license": lic, "licenseUrl": licurl,
                "attributionText": f"{au} / Wikimedia Commons, {lic}", "commonsFile": sf, "qid": c["qid"]}
    h = tryf(c.get("p18file"))
    if h: return h
    try:
        claims = C.entity_claims(c["qid"])
    except Exception:
        return None
    for f in C.claim_values(claims, "P18"):
        h = tryf(f)
        if h: return h
    for cat in C.claim_values(claims, "P373"):
        try:
            files = C.category_files(cat, limit=60)
        except Exception:
            continue
        files.sort(key=lambda f: (0 if f.lower().endswith((".jpg", ".jpeg")) else 1, f.lower()))
        for f in files:
            h = tryf(f)
            if h: return h
    return None


swaps = {}
for bad, cc in REPLACE.items():
    for cand in by_country_extra[cc]:
        if cand["slug"] in taken or cand["slug"] in {c["slug"] for c in selected}:
            continue
        recs = NR.resolve_city(cand, used)
        if len(recs) < 5:
            continue
        h = hero_for(cand)
        if not h:
            continue
        taken.add(cand["slug"])
        swaps[bad] = (cand, recs, h)
        print(f"  {bad} -> {cand['slug']} (nearby={len(recs)} hero={h['width']}x{h['height']} {h['license']})")
        break
    if bad not in swaps:
        print(f"  !! no replacement found for {bad}"); sys.exit(1)

# apply swaps
bad_set = set(REPLACE)
selected = [c for c in selected if c["slug"] not in bad_set]
for bad in REPLACE:
    heroes.pop(bad, None); nearby.pop(bad, None)
for bad, (cand, recs, h) in swaps.items():
    selected.append(dict(cand)); heroes[cand["slug"]] = h; nearby[cand["slug"]] = recs

json.dump(selected, open(f"{OUT}/selected.json", "w"), ensure_ascii=False)
json.dump(heroes, open(f"{OUT}/heroes.json", "w"), ensure_ascii=False)
json.dump(nearby, open(f"{OUT}/nearby.json", "w"), ensure_ascii=False)

import collections as _c
cnt = [len(v) for v in nearby.values()]
print(f"\nSWAPPED: {dict((b,s[0]['slug']) for b,s in swaps.items())}")
print(f"selected={len(selected)} heroes={len(heroes)} nearby-cities={len(nearby)}")
print("per-country:", dict(_c.Counter(c['countrySlug'] for c in selected)))
print(f"nearby total={sum(cnt)} under5={sum(1 for x in cnt if x<5)} over8={sum(1 for x in cnt if x>8)}")
print("heroes complete:", len(heroes) == len(selected) == 250)
