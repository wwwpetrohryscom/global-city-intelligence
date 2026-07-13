#!/usr/bin/env python3
"""Wave 18 repair: replace cities that lack an acceptable verified hero OR cannot
reach 5 verified nearby places, with stronger same-country candidates satisfying
BOTH. Dynamic repair set (no hardcoded slugs). Mirrors wave18_select eligibility +
the disputed/Kashmir/TRNC/ancient exclusions. Swaps selected/heroes/nearby.json."""
import json, re, sys, math, unicodedata, difflib
from collections import Counter, defaultdict
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave18")
import commons as C
import nearby_resolve as NR

OUT = "/tmp/w18"
CN = {"japan": "Japan", "south-korea": "South Korea", "china": "China", "india": "India",
      "pakistan": "Pakistan", "iran": "Iran", "iraq": "Iraq", "saudi-arabia": "Saudi Arabia",
      "oman": "Oman", "united-arab-emirates": "United Arab Emirates", "cyprus": "Cyprus"}
HERO_MIN = 1000      # preferred resolution floor
HERO_RELAX = 600     # relaxed floor (justified fallback for image-poor towns)
PLACE = ("placeholder", "lorem", "click here", "unknown author", "unknown license", "image here", "todo", "tbd")

existing_qidset = set(json.load(open(f"{OUT}/existing_qidset.json")))
existing_slugs = set(json.load(open(f"{OUT}/existing_slugs.json")))
EXCLUDE_QIDS = set(json.load(open(f"{OUT}/exclude_qids.json"))) if __import__("os").path.exists(f"{OUT}/exclude_qids.json") else set()
KASHMIR = re.compile(r"muzaffarabad|mirpur|kotli|bhimber|\bbagh\b|rawalakot|poonch|neelum|hattian|haveli|"
    r"sudhanoti|gilgit|skardu|ghizer|hunza|\bnagar\b|astore|diamer|chilas|ghanche|shigar|kharmang|jammu|"
    r"kashmir|kupwara|anantnag|baramulla|pulwama|budgam|ganderbal|bandipora|shopian|kulgam|\bleh\b|kargil|ladakh|srinagar", re.I)
HARD = re.compile(r"metropolitan|urban agglomeration|agglomeration|conurbation|\bregion\b|prefecture(?!-level)|"
    r"special ward|autonomous (region|prefecture|county|okrug)|\bemirate\b|\bgovernorate\b|\bbanner\b|"
    r"\bprovince\b|\bstate\b|special administrative region|\barea\b|urban area|development zone|free zone|"
    r"former municipality|abandoned")
# existing-city name set (per country) — reject spares whose base slug/name duplicates an existing city
_ex_cities = json.load(open(f"{OUT}/existing_cities.json"))
EX_NAMES = defaultdict(set)
for _e in _ex_cities:
    EX_NAMES[_e["countrySlug"]].add(re.sub(r"[^a-z0-9]", "", (_e["name"] or "").lower()))
# Hong Kong / Macau SAR bbox — excluded from mainland China selection (separate country slugs)
def _in_hk_macau(lat, lon): return 22.0 <= lat <= 22.65 and 113.3 <= lon <= 114.5
SOFT = re.compile(r"\bquarter\b|subdivision|neighbou?rhood|suburb|city district|urban district|\bdistrict\b|"
    r"\bcounty\b|\bward\b|\bhamlet\b|\bvillage\b|\bsubdistrict\b|\btownship\b")
CITYISH = re.compile(r"\bcity\b|\btown\b|municipality|prefecture-level|county-level|sub-provincial|special city|metropolitan city")
ANCIENT = re.compile(r"archaeological site|ancient city|city-state|\bruins\b|necropolis", re.I)
BOX = {"japan": (24.0, 45.6, 122.9, 146.0), "south-korea": (33.0, 38.7, 124.5, 132.0),
       "china": (17.8, 53.6, 73.4, 135.1), "india": (6.6, 35.7, 68.0, 97.5),
       "pakistan": (23.5, 37.2, 60.8, 78.0), "iran": (25.0, 40.0, 44.0, 63.5),
       "iraq": (29.0, 37.5, 38.7, 48.7), "saudi-arabia": (16.0, 32.2, 34.4, 55.7),
       "oman": (16.5, 26.5, 51.8, 60.0), "united-arab-emirates": (22.5, 26.2, 51.0, 56.5),
       "cyprus": (34.5, 35.8, 32.2, 34.7)}
PREMAP = str.maketrans({"ß": "ss"})
def slugify(name):
    s = unicodedata.normalize("NFKD", (name or "").translate(PREMAP)).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")
def norm(s): return re.sub(r"[^a-z0-9]", "", (s or "").lower())


def eligible(r, keep_qids, keep_slugs, keep_names):
    if not r["qid"] or not r["name"] or r["lat"] is None: return None
    if r["qid"] in existing_qidset or r["qid"] in keep_qids or r["qid"] in EXCLUDE_QIDS: return None
    if (r["population"] or 0) < 1000: return None
    cc, t, nm = r["countrySlug"], (r["types"] or ""), r["name"]
    if HARD.search(t): return None
    if SOFT.search(t) and not CITYISH.search(t): return None
    if ANCIENT.search(t) and not re.search(r"big city|provincial capital|prefecture-level|megacity|city of japan|tourist", t): return None
    a, b, c, d = BOX[cc]
    if not (a <= r["lat"] <= b and c <= r["lon"] <= d): return None
    if cc == "china" and _in_hk_macau(r["lat"], r["lon"]): return None   # HK/Macau are separate country slugs
    if cc == "india" and r["lat"] >= 32.5 and 73.5 <= r["lon"] <= 79.5: return None
    if cc in ("india", "pakistan") and KASHMIR.search((r.get("admin") or "")): return None
    if r["adminQ"] and r["adminQ"] in existing_qidset: return None
    if norm(nm) in EX_NAMES.get(cc, set()): return None                 # name duplicates an existing city
    if slugify(nm) in existing_slugs: return None                       # base slug already taken (same place)
    if (cc, norm(nm)) in keep_names: return None
    return r


def clean(s): return s and not any(t in s.lower() for t in PLACE)
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
                "alt": f"View of {c['name']}, {CN[c['countrySlug']]}",
                "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + sf,
                "author": au, "authorUrl": C.author_url(ii["artist"]),
                "license": lic, "licenseUrl": licurl, "attributionText": attr,
                "commonsFile": sf, "qid": c["qid"]}
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
    selected = json.load(open(f"{OUT}/selected.json"))
    heroes = json.load(open(f"{OUT}/heroes.json"))
    nearby = json.load(open(f"{OUT}/nearby.json"))
    used_nearby = set(r["slug"] for v in nearby.values() for r in v)

    def hero_ok(s):
        h = heroes.get(s)
        return bool(h) and max(h["width"], h["height"]) >= HERO_RELAX
    # Replace: (a) any city lacking an acceptable hero (a page needs one), and
    # (b) under-5-nearby cities ONLY if they are small (<1.5M) — never swap out a
    # major metro (Xi'an/Chongqing/Zhengzhou) just to chase a nearby count; those
    # keep the max verified nearby available (Wikidata desert/plain coverage limit).
    bad = [c for c in selected if not hero_ok(c["slug"])
           or (len(nearby.get(c["slug"], [])) < 5 and (c["population"] or 0) < 1_500_000)]
    need = Counter(c["countrySlug"] for c in bad)
    print("repair set:", {c["slug"]: (("hero" if not hero_ok(c["slug"]) else "") + ("nearby" if len(nearby.get(c["slug"], [])) < 5 else "")) for c in bad})
    print("per country:", dict(need))

    bad_slugs = {c["slug"] for c in bad}
    kept = [c for c in selected if c["slug"] not in bad_slugs]
    keep_qids = {c["qid"] for c in kept}
    keep_slugs = {c["slug"] for c in kept}
    keep_names = {(c["countrySlug"], norm(c["name"])) for c in kept}
    picked = set()

    def seo(r):
        return (math.log10(max(r["population"] or 1000, 1000)) * 11 + min(r["sitelinks"], 150) * 0.42
                + (6 if r["hasImage"] else 0) + (9 if r["capitalOf"] else 0))

    adds = []
    for cc, n in need.items():
        raw = json.load(open(f"{OUT}/raw_{cc}.json"))
        pool = [r for r in raw if eligible(r, keep_qids, keep_slugs, keep_names)]
        pool.sort(key=seo, reverse=True)
        got = 0
        for cand in pool:
            if got >= n: break
            sg = slugify(cand["name"])
            if not sg or sg in existing_slugs or sg in keep_slugs or sg in picked:
                sg = f"{sg}-{ {'japan':'jp','south-korea':'kr','china':'cn','india':'in','pakistan':'pk','iran':'ir','iraq':'iq','saudi-arabia':'sa','oman':'om','united-arab-emirates':'ae','cyprus':'cy'}[cc] }"
            if sg in existing_slugs or sg in keep_slugs or sg in picked: continue
            recs = NR.resolve_city({**cand, "slug": sg}, used_nearby)
            if len(recs) < 5: continue
            h = hero_for(cand, HERO_MIN) or hero_for(cand, HERO_RELAX)
            if not h: continue
            picked.add(sg); keep_qids.add(cand["qid"]); keep_names.add((cc, norm(cand["name"])))
            r2 = dict(cand); r2["slug"] = sg
            adds.append(r2); heroes[sg] = h; nearby[sg] = recs; got += 1
            print(f"  +{sg:22s} ({cc}) {cand['qid']:10s} nearby={len(recs)} hero={h['width']}x{h['height']} {h['author'][:18]}")
        if got < n:
            print(f"  !! only {got}/{n} for {cc} — keeping originals for the shortfall")

    # remove only as many originals as we found replacements for, worst-first (no hero worst)
    replaced_by_cc = Counter(a["countrySlug"] for a in adds)
    to_remove = []
    for cc in need:
        cands = sorted([c for c in bad if c["countrySlug"] == cc],
                       key=lambda c: (hero_ok(c["slug"]), len(nearby.get(c["slug"], []))))
        to_remove += [c["slug"] for c in cands[:replaced_by_cc.get(cc, 0)]]
    rm = set(to_remove)
    for s in rm:
        heroes.pop(s, None); nearby.pop(s, None)
    selected = [c for c in selected if c["slug"] not in rm] + adds

    json.dump(selected, open(f"{OUT}/selected.json", "w"), ensure_ascii=False)
    json.dump(heroes, open(f"{OUT}/heroes.json", "w"), ensure_ascii=False)
    json.dump(nearby, open(f"{OUT}/nearby.json", "w"), ensure_ascii=False)
    cnt = [len(nearby.get(c["slug"], [])) for c in selected]
    hcnt = sum(1 for c in selected if hero_ok(c["slug"]))
    print(f"\nremoved {len(rm)}, added {len(adds)} | selected={len(selected)}")
    print("per-country:", dict(Counter(c["countrySlug"] for c in selected)))
    print(f"heroes ok={hcnt}/{len(selected)} | nearby under5={sum(1 for x in cnt if x < 5)} total_nearby={sum(cnt)}")


if __name__ == "__main__":
    main()
