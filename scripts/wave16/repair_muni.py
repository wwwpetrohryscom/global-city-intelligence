#!/usr/bin/env python3
"""Remove the 18 'X Municipality' (kommun/kommune) entities that duplicate EXISTING
clean-named cities (Oslo/Gothenburg/Malmö/Uppsala/Lund/... — the name-dedup missed them
via the suffix), and replace with clean distinct same-country cities. The other
'X Municipality' entities (Bærum, Eidsvoll, ... — no existing city entity) are kept."""
import json, re, sys
from collections import Counter
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave16")
import commons as C
import nearby_resolve as NR

OUT = "/tmp/w16"
CN = {"sweden": "Sweden", "norway": "Norway", "denmark": "Denmark", "finland": "Finland",
      "romania": "Romania", "croatia": "Croatia", "slovakia": "Slovakia"}
MIN_DIM = 600


def sm(n):
    return re.sub(r"[^a-z0-9]", "", re.sub(r"\b(municipality|kommun|kommune|kunta|stad|city|town|oras)\b", "", (n or "").lower()))


selected = json.load(open(f"{OUT}/selected.json"))
heroes = json.load(open(f"{OUT}/heroes.json"))
nearby = json.load(open(f"{OUT}/nearby.json"))
ex_names = set((c["countrySlug"], sm(c["name"])) for c in json.load(open(f"{OUT}/existing_cities.json")))

# identify dups-vs-existing
remove = [c for c in selected if (c["countrySlug"], sm(c["name"])) in ex_names]
need = Counter(c["countrySlug"] for c in remove)
print("removing (dup-vs-existing):", dict(need))
rm_slugs = {c["slug"] for c in remove}
kept = [c for c in selected if c["slug"] not in rm_slugs]
keep_names = set((c["countrySlug"], sm(c["name"])) for c in kept)
keep_slugs = {c["slug"] for c in kept}
used = set(r["slug"] for v in nearby.values() for r in v)
extra = {cc: json.load(open(f"{OUT}/{cc}_extra.json")) for cc in need}
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


adds = []
for cc, n in need.items():
    got = 0
    for cand in extra[cc]:
        if got >= n: break
        if cand["slug"] in keep_slugs or cand["slug"] in picked: continue
        if (cc, sm(cand["name"])) in keep_names or (cc, sm(cand["name"])) in ex_names: continue
        if re.search(r"\bsector\b|city district|subdivision", (cand.get("types") or "") + " " + cand["name"], re.I): continue
        recs = NR.resolve_city(cand, used)
        if len(recs) < 5: continue
        h = hero_for(cand)
        if not h: continue
        picked.add(cand["slug"]); keep_names.add((cc, sm(cand["name"])))
        adds.append((cand, recs, h)); got += 1
        print(f"  +{cand['slug']} ({cc}) nearby={len(recs)} hero={h['width']}x{h['height']}")
    if got < n:
        print(f"  !! only {got}/{n} for {cc}"); sys.exit(1)

for c in remove:
    heroes.pop(c["slug"], None); nearby.pop(c["slug"], None)
selected = kept
for cand, recs, h in adds:
    selected.append(dict(cand)); heroes[cand["slug"]] = h; nearby[cand["slug"]] = recs

json.dump(selected, open(f"{OUT}/selected.json", "w"), ensure_ascii=False)
json.dump(heroes, open(f"{OUT}/heroes.json", "w"), ensure_ascii=False)
json.dump(nearby, open(f"{OUT}/nearby.json", "w"), ensure_ascii=False)
cnt = [len(v) for v in nearby.values()]
print(f"\nremoved {len(remove)}, added {len(adds)} | selected={len(selected)} heroes={len(heroes)}")
print("per-country:", dict(Counter(c['countrySlug'] for c in selected)))
print(f"nearby total={sum(cnt)} under5={sum(1 for x in cnt if x<5)} | heroes complete={len(heroes)==len(selected)==250}")
