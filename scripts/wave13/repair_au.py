#!/usr/bin/env python3
"""Replace the 4 remote-outback AU cities that could not reach >=5 verified nearby
nature places with stronger AU candidates (ranks 51-90 by SEO) that satisfy BOTH a
verified Commons hero AND >=5 verified nearby places. Swaps selected/heroes/nearby."""
import json, sys
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave13")
import commons as C
import nearby_resolve as NR  # importing builds the genuine-nature pool + resolve_city()

OUT = "/tmp/w13"
BAD = ["newman", "weipa", "roma", "cobar"]
COUNTRY_NAME = {"australia": "Australia"}
MIN_DIM = 600

selected = json.load(open(f"{OUT}/selected.json"))
heroes = json.load(open(f"{OUT}/heroes.json"))
nearby = json.load(open(f"{OUT}/nearby.json"))
au_extra = json.load(open(f"{OUT}/au_extra.json"))

used = set(r["slug"] for v in nearby.values() for r in v)  # global new-wave slug dedup


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
                "alt": f"View of {c['name']}, Australia",
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


winners = []
for c in au_extra:
    if len(winners) >= len(BAD):
        break
    recs = NR.resolve_city(c, used)  # 5-8 verified nearby; mutates `used`
    if len(recs) < 5:
        continue
    h = hero_for(c)
    if not h:
        continue
    winners.append((c, recs, h))
    print(f"  ACCEPT {c['slug']:20s} nearby={len(recs)} hero={h['width']}x{h['height']} {h['license']}")

if len(winners) < len(BAD):
    print(f"ONLY {len(winners)} replacements found for {len(BAD)} needed — STOP")
    sys.exit(1)

# swap
bad_set = set(BAD)
selected = [c for c in selected if c["slug"] not in bad_set]
for s in BAD:
    heroes.pop(s, None)
    nearby.pop(s, None)
for c, recs, h in winners:
    selected.append({k: c[k] for k in c})
    heroes[c["slug"]] = h
    nearby[c["slug"]] = recs

json.dump(selected, open(f"{OUT}/selected.json", "w"), ensure_ascii=False)
json.dump(heroes, open(f"{OUT}/heroes.json", "w"), ensure_ascii=False)
json.dump(nearby, open(f"{OUT}/nearby.json", "w"), ensure_ascii=False)

import collections as _c
print(f"\nSWAPPED OUT: {BAD}")
print(f"SWAPPED IN : {[c['slug'] for c,_,_ in winners]}")
print(f"selected={len(selected)} heroes={len(heroes)} nearby-cities={len(nearby)}")
print("per-country:", dict(_c.Counter(c['countrySlug'] for c in selected)))
cnt = [len(v) for v in nearby.values()]
print(f"nearby places total={sum(cnt)} under5={sum(1 for x in cnt if x<5)} over8={sum(1 for x in cnt if x>8)}")
