#!/usr/bin/env python3
"""Replace the 4 weak Wave-18 cities that cannot reach 5 verified nearby (per user
decision — keep the 7 majors as documented fallback) with stronger same-country
candidates that have 5-8 verified nearby AND a verified hero. Preserves quotas
(Saudi 30, Oman 10). Resolves nearby via the regular + deep P18/P373 pools and hero
via P18->P373. Swaps selected/heroes/nearby.json."""
import sys, json, re
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave18")
import commons as C
import nearby_resolve as NR
from deep_nearby_p373 import cat_image, ME, CN, REGION

OUT = Path("/tmp/w18")
REPLACE = {"al-majma-ah": "saudi-arabia", "dumat-al-jandal": "saudi-arabia",
           "diriyah": "saudi-arabia", "al-mazyunah": "oman"}
CN_NAME = {"saudi-arabia": "Saudi Arabia", "oman": "Oman"}
MIN_DIM = 1000
HERO_RELAX = 600
PLACE = ("placeholder", "lorem", "click here", "unknown author", "unknown license", "image here", "todo", "tbd")

# deep P18 pool (verified images) + deep P373 pool (category images), ME + CN
me18 = [f for f in json.load(open(OUT / "deep_pool_me.json")) if f["name"] and f["p18file"] and NR.genuine_nature(f["types"], f["name"])]
me373 = [f for f in json.load(open(OUT / "deep373_me.json")) if f["name"] and NR.genuine_nature(f["types"], f["name"])]
existing_q = set(json.load(open(OUT / "existing_qidset.json")))
existing_s = set(json.load(open(OUT / "existing_slugs.json")))
excl = set(json.load(open(OUT / "exclude_qids.json")))


def clean(s): return s and not any(t in s.lower() for t in PLACE)


def resolve_nearby(city, used):
    """Regular pool (220km) + deep P18 (300km) + deep P373 (300km), verified, up to 8."""
    out, seen = [], set()
    clat, clon = city["lat"], city["lon"]
    # pass 1: regular + deep-P18 (P18 images)
    cands = []
    for f in NR.pool + me18:
        km = NR.hav(clat, clon, f["lat"], f["lon"])
        if km <= (170 if f in NR.pool else 300):
            cands.append((km, f, "p18"))
    for f in me373:
        km = NR.hav(clat, clon, f["lat"], f["lon"])
        if km <= 300:
            cands.append((km, f, "p373"))
    cands.sort(key=lambda x: x[0] - min(x[1]["sitelinks"], 30) * 1.5)
    for km, f, kind in cands:
        if len(out) >= 8: break
        if f["qid"] in seen: continue
        cat = NR.categorize(f["types"])
        if NR.urban_island(f["lat"], f["lon"], cat): continue
        ps = NR.slugify(f["name"])
        if not ps: continue
        sl = f"{ps}-near-{city['slug']}"
        if sl in used: continue
        img = NR.verify_image(f, f["name"]) if kind != "p373" else cat_image(f.get("commonsCat"), f["name"])
        if not img: continue
        seen.add(f["qid"]); used.add(sl)
        desig = NR.designation(f["types"], cat)
        iucn = None
        if f.get("iucn"):
            mm = re.match(r"(Ia|Ib|IV|VI|V|III|II|I)\b", re.sub(r".*category\s*", "", f["iucn"]).strip())
            iucn = mm.group(1) if mm else None
        out.append({"slug": sl, "name": f["name"], "countrySlug": f["countrySlug"],
            "regionName": REGION.get(f["countrySlug"], "Middle East"), "category": cat,
            "summary": (f"{f['name']} is a {desig.lower()} reachable from {city['name']} as a nearby nature "
                        f"destination. Research access, facilities, and seasonal conditions with official sources before visiting."),
            "connectedCitySlugs": [city["slug"]], "distanceBand": NR.band(km), "wikidataId": f["qid"],
            "officialUrl": f["website"] if f.get("website") else None,
            "latitude": round(f["lat"], 5), "longitude": round(f["lon"], 5),
            "verificationStatus": "verified", "img": img,
            "facts": {"designation": desig, "iucnCategory": iucn,
                      "established": f.get("inception") if (f.get("inception") and 1000 < f["inception"] <= 2026) else None},
            "distanceKm": round(km, 1)})
    return out


def hero_for(c, mindim):
    def tryf(fn):
        if not fn or C.file_unsuitable(fn): return None
        ii = C.imageinfo(fn, width=1280)
        if not ii or ii["mime"] not in ("image/jpeg", "image/png"): return None
        if max(ii.get("ow") or 0, ii.get("oh") or 0) < mindim: return None
        if not C.license_ok(ii["licenseCode"], ii["licenseShort"]): return None
        au = C.clean_author(ii["artist"])
        if not au or not clean(au): return None
        lic, licurl = C.normalize_license(ii["licenseCode"], ii["licenseShort"])
        if ii.get("licenseUrl"): licurl = ii["licenseUrl"]
        attr = f"{au} / Wikimedia Commons, {lic}"
        if not clean(attr): return None
        sf = fn.replace("_", " ")
        return {"src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
                "alt": f"View of {c['name']}, {CN_NAME[c['countrySlug']]}",
                "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + sf, "author": au,
                "authorUrl": C.author_url(ii["artist"]), "license": lic, "licenseUrl": licurl,
                "attributionText": attr, "commonsFile": sf, "qid": c["qid"]}
    h = tryf(c.get("p18file"))
    if h: return h
    try: claims = C.entity_claims(c["qid"])
    except Exception: return None
    for f in C.claim_values(claims, "P18"):
        h = tryf(f)
        if h: return h
    for cat in C.claim_values(claims, "P373"):
        try: files = C.category_files(cat, limit=80)
        except Exception: continue
        for f in sorted(files, key=lambda f: (0 if f.lower().endswith((".jpg", ".jpeg")) else 1, f.lower())):
            h = tryf(f)
            if h: return h
    return None


def main():
    selected = json.load(open(OUT / "selected.json"))
    heroes = json.load(open(OUT / "heroes.json"))
    nearby = json.load(open(OUT / "nearby.json"))
    kept = [c for c in selected if c["slug"] not in REPLACE]
    keep_q = {c["qid"] for c in kept}
    keep_names = {(c["countrySlug"], re.sub(r"[^a-z0-9]", "", c["name"].lower())) for c in kept}
    used_nearby = set(r["slug"] for v in nearby.values() for r in v) | set(NR.existing_nearby_slugs)

    from collections import Counter
    need = Counter(REPLACE.values())
    HK = lambda la, lo: 22.0 <= la <= 22.65 and 113.3 <= lo <= 114.5
    adds = []
    for cc, n in need.items():
        raw = json.load(open(OUT / f"raw_{cc}.json"))
        cands = [r for r in raw if r["qid"] not in existing_q and r["qid"] not in keep_q and r["qid"] not in excl
                 and (r.get("population") or 0) >= 1000 and r.get("lat")
                 and (cc, re.sub(r"[^a-z0-9]", "", (r["name"] or "").lower())) not in keep_names]
        cands.sort(key=lambda r: -((r["population"] or 0)))
        got = 0
        for r in cands:
            if got >= n: break
            sg = NR.slugify(r["name"])
            if not sg or sg in existing_s or sg in {c["slug"] for c in kept} or sg in {a["slug"] for a in adds}: continue
            recs = resolve_nearby({**r, "slug": sg}, used_nearby)
            if len(recs) < 5: continue
            h = hero_for(r, MIN_DIM) or hero_for(r, HERO_RELAX)
            if not h: continue
            r2 = dict(r); r2["slug"] = sg
            adds.append(r2); heroes[sg] = h; nearby[sg] = recs; keep_q.add(r["qid"]); got += 1
            print(f"  +{sg:20s} ({cc}) {r['qid']:10s} pop={int(r['population'] or 0):>7} nearby={len(recs)} hero={h['width']}x{h['height']}")
        assert got == n, f"only {got}/{n} replacements for {cc}"

    for s in REPLACE:
        heroes.pop(s, None); nearby.pop(s, None)
    selected = kept + adds
    json.dump(selected, open(OUT / "selected.json", "w"), ensure_ascii=False)
    json.dump(heroes, open(OUT / "heroes.json", "w"), ensure_ascii=False)
    json.dump(nearby, open(OUT / "nearby.json", "w"), ensure_ascii=False)
    print(f"\nremoved {list(REPLACE)}, added {[a['slug'] for a in adds]}")
    print("per-country:", dict(Counter(c["countrySlug"] for c in selected)), "total", len(selected))
    cnt = [len(nearby.get(c["slug"], [])) for c in selected]
    print(f"under5 now: {sum(1 for x in cnt if x < 5)} | total nearby {sum(cnt)}")


if __name__ == "__main__":
    main()
