#!/usr/bin/env python3
"""Replace wave18 cities lacking a usable verified hero OR >=5 verified nearby with
stronger same-country candidates satisfying BOTH. Swaps selected/heroes/nearby."""
import json, re, sys
from collections import Counter
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave18")
import commons as C
import nearby_resolve as NR

OUT = "/tmp/w18"
REPLACE = {"raseiniai": "lithuania",
           "astrakhan": "russia", "tomsk": "russia", "orenburg": "russia",
           "penza": "russia", "kemerovo": "russia", "kirov": "russia"}
CN = {"japan": "Japan", "south-korea": "South Korea", "china": "China", "india": "India",
      "pakistan": "Pakistan", "iran": "Iran", "iraq": "Iraq", "saudi-arabia": "Saudi Arabia",
      "oman": "Oman", "united-arab-emirates": "United Arab Emirates", "cyprus": "Cyprus"}
MIN_DIM = 600


def sn(n):
    return re.sub(r"[^a-z0-9]", "", (n or "").lower())


selected = json.load(open(f"{OUT}/selected.json"))
heroes = json.load(open(f"{OUT}/heroes.json"))
nearby = json.load(open(f"{OUT}/nearby.json"))
used = set(r["slug"] for v in nearby.values() for r in v)
extra = {cc: json.load(open(f"{OUT}/{cc}_extra.json")) for cc in set(REPLACE.values())}
kept = [c for c in selected if c["slug"] not in REPLACE]
keep_slugs = {c["slug"] for c in kept}
keep_q = {c["qid"] for c in kept}
keep_names = {(c["countrySlug"], sn(c["name"])) for c in kept}
picked = set()


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
                "alt": f"View of {c['name']}, {CN[c['countrySlug']]}",
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
        for f in sorted(files, key=lambda f: (0 if f.lower().endswith((".jpg", ".jpeg")) else 1, f.lower())):
            h = tryf(f)
            if h: return h
    return None


need = Counter(REPLACE.values())
adds = []
for cc, n in need.items():
    got = 0
    for cand in extra[cc]:
        if got >= n: break
        if cand["slug"] in keep_slugs or cand["slug"] in picked or cand["qid"] in keep_q: continue
        if (cc, sn(cand["name"])) in keep_names: continue
        if re.search(r"\bsector\b|city district|subdivision", (cand.get("types") or "") + " " + cand["name"], re.I): continue
        recs = NR.resolve_city(cand, used)
        if len(recs) < 5: continue
        h = hero_for(cand)
        if not h: continue
        picked.add(cand["slug"]); keep_names.add((cc, sn(cand["name"]))); keep_q.add(cand["qid"])
        adds.append((cand, recs, h)); got += 1
        print(f"  +{cand['slug']} ({cc}) nearby={len(recs)} hero={h['width']}x{h['height']}")
    if got < n:
        print(f"  !! only {got}/{n} for {cc}"); sys.exit(1)

for bad in REPLACE:
    heroes.pop(bad, None); nearby.pop(bad, None)
selected = kept
for cand, recs, h in adds:
    selected.append(dict(cand)); heroes[cand["slug"]] = h; nearby[cand["slug"]] = recs

json.dump(selected, open(f"{OUT}/selected.json", "w"), ensure_ascii=False)
json.dump(heroes, open(f"{OUT}/heroes.json", "w"), ensure_ascii=False)
json.dump(nearby, open(f"{OUT}/nearby.json", "w"), ensure_ascii=False)
cnt = [len(v) for v in nearby.values()]
print(f"\nremoved {len(REPLACE)}, added {len(adds)} | selected={len(selected)} heroes={len(heroes)}")
print("per-country:", dict(Counter(c['countrySlug'] for c in selected)))
print(f"nearby total={sum(cnt)} under5={sum(1 for x in cnt if x<5)} | heroes complete={len(heroes)==len(selected)==350}")
