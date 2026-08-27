#!/usr/bin/env python3
"""V3 — resolve curated nearby nature places for cities that have none.

Reuses the wave pipeline's discovery filters verbatim (they encode the
airport / artificial-island / administrative-region fixes already applied to
the corpus) and adds Commons-category image recovery for entities that carry a
P373 category but no P18 statement.

The licensing bar is unchanged: every image is verified through the Commons
API for a real file, an acceptable licence, a named author, real dimensions
and an acceptable mime type. A candidate that cannot produce one is dropped,
not published without an image.

Cache: scripts/nature-v3/cache/resolved.json (resumable per city).
"""
import sys, json, math, re, time, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "wave11"))
import commons as C  # noqa: E402

# Import the shipped validator's own suspicious-source patterns rather than
# restating them: `nearby_file_unsuitable` tests the FILENAME, while the
# validator tests the src URL, and a file named "Map_by_the_US_Army..." fails
# only the second (the URL contains "/Map_"). Sharing the constant makes the
# two impossible to drift apart.
import importlib.util as _ilu
_spec = _ilu.spec_from_file_location("_vnp", ROOT / "scripts/validate-nearby-places.py")
_vnp = _ilu.module_from_spec(_spec)
_spec.loader.exec_module(_vnp)
SUSPICIOUS_SRC = [(lbl, re.compile(pat, re.IGNORECASE)) for lbl, pat in _vnp.SUSPICIOUS_SRC_PATTERNS]


def suspicious_source(src_url, source_url):
    for _lbl, rx in SUSPICIOUS_SRC:
        if rx.search(src_url or "") or rx.search(source_url or ""):
            return True
    return False

HERE = Path(__file__).resolve().parent
OUT = HERE / "cache"
targets = json.load(open(OUT / "targets.json"))
existing = json.load(open(ROOT / "scripts/nature/cache/places-compact.json"))
EXISTING_SLUGS = {p["slug"] for p in existing}
# Dedup is PER CITY, not global. The corpus already curates one feature for
# several cities where that is geographically true (Veluwezoom serves both
# Nijmegen and Hilversum), and a global block would hand Mount Fuji to whichever
# city happened to be processed first and deny it to Tokyo. Slugs stay unique
# because they embed the city.
EXISTING_QIDS_BY_CITY = {}
for _p in existing:
    for _c in _p["cities"]:
        EXISTING_QIDS_BY_CITY.setdefault(_c, set()).add(_p["qid"])

PRIMARY_KM = 170.0     # the radius the corpus was built with
FALLBACK_KM = 300.0    # sparse-region ceiling; equals the published nature cap
PER_CITY = 8           # corpus convention

# ---- discovery filters, copied from scripts/wave19/nearby_resolve.py --------
BAD_TYPE = re.compile(r"historic|memorial|monument|battlefield|\bfort\b|fortress|museum|aquarium|\bzoo\b|"
    r"bird park|theme park|amusement|\bprison\b|archaeolog|fossil|pile dwelling|rijksbeschermd|\bdam\b|"
    r"\bcanal\b|water ?works|\bhamlet\b|outbuilding|attraction|neighbou?rhood|\bsquare\b|statue|\bchurch\b|"
    r"cathedral|\bpalace\b|chateau|\bestate\b|heritage|\bmanor\b|\babbey\b|monastery|\bmine\b|industrial|"
    r"stadium|cemetery|botanical|\bgarden\b|\bbuilding\b|historic district|world heritage|conservation area|\bairport\b|aeroporto|aeropuerto|aerodrome|airfield|air base|spaceport|seaport|container port|"
    r"\bhouse\b|\bvilla\b|\bdepot\b|\bcastle\b|citadel|\bvillage\b|commune of|human settlement|municipality|"
    r"urban park|former lake|woolen mill|\bmill\b|civic|ceremonial|parkway|\broad\b|\bhighway\b")
BAD_NAME = re.compile(r"memorial|monument|\bhistoric\b|heritage|\bmall\b|battlefield|\bfort\b|\bprison\b|"
    r"museum|state historic|national historic|\bcanal\b|woolen mill|quartermaster|\bdepot\b|president|"
    r"capitol|courthouse|\bhall\b|cathedral|\bchurch\b|\bdam\b|parkway|bathing beach|arabian peninsula|"
    r"indian subcontinent|\barabia\b|\beurasia\b|\bafrica\b|arabian plate|\bairport\b|aeroporto|aeropuerto|"
    r"south america|américa do sul|américa del sur|amazon basin|\bsouth american\b|latin america|aerodrome|"
    r"air base|palm jumeirah|palm jebel|\bthe world\b|world islands|amwaj|passport island|deira island|"
    r"jumeirah island|reclaimed|marina city|jumeirah islands|\bmarina\b|"
    # V3 additions: urban drainage infrastructure is not nature, and a
    # landmass the size of a country is not a weekend destination.
    r"\bdrain\b|\bsewer|\bnullah\b|storm ?water|"
    r"\bhonshu\b|\bhokkaido\b|\bkyushu\b|\bshikoku\b|japanese archipelago|"
    r"japanese alps|\bhonshū\b|british isles|\bborneo\b|\bsumatra\b|\bjava\b island|"
    r"korean peninsula|iberian peninsula|\banatolia\b|scandinavian peninsula|"
    r"\bgreat britain\b|\bireland\b island", re.I)
NATURE_OK = re.compile(r"national park|nature reserve|national nature reserve|protected landscape|state park|"
    r"provincial park|regional park|natural park|nature park|national forest|state forest|\bforest\b|"
    r"\bmountain|\bpeak\b|massif|\bhill\b|\blake\b|reservoir|\bbay\b|\bcape\b|peninsula|\bbeach\b|\bisland\b|"
    r"archipelago|waterfall|\bgorge\b|canyon|\bvalley\b|wilderness|geopark|marine park|wildlife refuge|"
    r"wildlife management|wildlife sanctuary|wetland|moor|heath|dune|fjord|estuary|nature monument|"
    r"conservation park|country park|biosphere|ramsar|natura 2000|special area of conservation|fell|"
    r"national wildlife|state natural|natural area|scenic|national seashore|national lakeshore|common\b|"
    r"downs\b|\bvolcano|\bcave\b|\bspring\b|\bglacier\b|\bdesert\b|\bmarsh\b|\bswamp\b|\briver\b|\bcoast")


# A physical landform type outranks a designation layered on top of it. The
# inherited BAD_TYPE list treats "heritage" as fatal, which rejects Mount Fuji
# — typed both `stratovolcano` and `World Heritage Site`. This mirrors the
# hard/soft veto split already used by the nature taxonomy.
STRONG_NATURE = re.compile(
    r"\bmountain\b|\bmountain range\b|stratovolcano|\bvolcano\b|\bpeak\b|\bmassif\b|"
    r"\blake\b|reservoir|waterfall|\bisland\b|\bbeach\b|\bforest\b|canyon|\bgorge\b|"
    r"\bcave\b|\bglacier\b|national park|nature reserve|wildlife refuge|\bwetland\b|"
    r"\bvalley\b|\bbay\b|\bcape\b|\bfjord\b|\bdune\b|hot spring")
# Types that disqualify a candidate no matter what else it is.
HARD_BAD_TYPE = re.compile(
    r"sovereign state|\bcountry\b|city-state|\bcontinent\b|subcontinent|"
    r"\bairport\b|aerodrome|air base|spaceport|railway station|"
    r"human settlement|municipality|commune of|\bvillage\b|\bcity\b|"
    r"\bmuseum\b|\bstadium\b|\bcastle\b|\bpalace\b|\bchurch\b|\bmine\b|"
    r"artificial island|botanical|golf|artificial hill|artificial waterfall|"
    r"\bfountain\b|artificial lake island|water feature|swimming pool")


# Extensive classes describe features that can be any size, from a local river
# to the Nile. For those — and only those — a very high interwiki count is a
# reliable signal of continental scale: the Nile (245 sitelinks), the Ganges
# (179), the Sinai Peninsula (131) and "Mainland Southeast Asia" (108) are not
# weekend destinations. Point destinations are exempt, so Mount Fuji (146) and
# the Cape of Good Hope (104) are unaffected.
EXTENSIVE_TYPE = re.compile(
    r"\briver\b|watercourse|\bpeninsula\b|mountain range|mountain chain|"
    r"\bplateau\b|\bdesert\b|\bplain\b|\bregion\b|\bsea\b|\bgulf\b|\bbay\b|"
    r"\bstrait\b|archipelago|subcontinent|\bbasin\b|landmass|"
    r"\bisland\b|\bislet\b|body of water|marginal sea")
EXTENSIVE_MAX_SITELINKS = 60


def genuine_nature(types, name, sitelinks=0):
    if sitelinks >= EXTENSIVE_MAX_SITELINKS and EXTENSIVE_TYPE.search(types or ""):
        return False
    if BAD_NAME.search(name or ""):
        return False
    if not types:
        return False
    if HARD_BAD_TYPE.search(types):
        return False
    if BAD_TYPE.search(types) and not STRONG_NATURE.search(types):
        return False
    return bool(NATURE_OK.search(types))


def hav(a, b, c, d):
    r = math.radians
    return 2 * 6371 * math.asin(math.sqrt(
        math.sin((r(c) - r(a)) / 2) ** 2 + math.cos(r(a)) * math.cos(r(c)) * math.sin((r(d) - r(b)) / 2) ** 2))


DASHES = dict.fromkeys(map(ord, "‐‑‒–—―−·•"), "-")
PREMAP = str.maketrans({"ß": "ss", "Ø": "O", "ø": "o", "Æ": "Ae", "æ": "ae", "Å": "A", "å": "a",
                        "Œ": "Oe", "œ": "oe", "Ł": "L", "ł": "l", "Đ": "D", "đ": "d",
                        "Þ": "Th", "þ": "th", "ð": "d", "Ð": "D"})


def slugify(name):
    s = (name or "").translate(DASHES).translate(PREMAP)
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def categorize(t):
    """Corpus-level category. The nature taxonomy re-derives its own from P31;
    this only has to be a sane value for the existing NearbyPlaceCategory union."""
    if re.search(r"\bmountain|\bpeak|summit|volcano|massif|\bhill\b|cordillera|sierra|\bfell\b|\bdowns\b", t):
        return "mountain"
    if re.search(r"island|archipelago|\bislet|\bisle\b", t):
        return "island"
    if re.search(r"\bbeach\b", t):
        return "beach"
    if re.search(r"\bbay\b|\bcape\b|peninsula|fjord|estuary|headland|\bcoast|lagoon|shoal|seashore", t):
        return "waterfront"
    if re.search(r"\blake\b|reservoir|\bloch\b|\bpond\b|\bmere\b", t):
        return "lake"
    if re.search(r"country park|regional park|city park|urban park|municipal park|\bpark$|public park|common\b", t) and "national" not in t:
        return "park"
    return "nature"


def band(km):
    return "nearby" if km <= 60 else ("regional" if km <= 120 else "longer_weekend")


def verify_file(fn, name):
    """Verify one Commons filename into a publishable image record, or None."""
    if not fn or C.nearby_file_unsuitable(fn):
        return None
    try:
        ii = C.imageinfo(fn, width=1280)
    except Exception:
        return None
    if not ii or ii.get("mime") not in ("image/jpeg", "image/png"):
        return None
    if max(ii.get("ow") or 0, ii.get("oh") or 0) < 600:
        return None
    if not C.license_ok(ii.get("licenseCode"), ii.get("licenseShort")):
        return None
    author = C.clean_author(ii.get("artist"))
    if not author:
        return None
    lic, licurl = C.normalize_license(ii.get("licenseCode"), ii.get("licenseShort"))
    if ii.get("licenseUrl"):
        licurl = ii["licenseUrl"]
    if not (ii.get("width") and ii.get("height")):
        return None
    source_url = "https://commons.wikimedia.org/wiki/File:" + fn.replace("_", " ")
    if suspicious_source(ii["url"], source_url):
        return None
    return {"src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
            "alt": f"Verified Wikimedia Commons image of {name}",
            "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + fn.replace("_", " "),
            "author": author, "license": lic, "licenseUrl": licurl,
            "attributionText": f"{author} / Wikimedia Commons, {lic}",
            "recovery": "p18" if not getattr(verify_file, "_cat", False) else "commons-category"}


IMG_CACHE_PATH = OUT / "image-cache.json"
IMG_CACHE = json.load(open(IMG_CACHE_PATH)) if IMG_CACHE_PATH.exists() else {}


def resolve_image_cached(feat):
    """Image verification is the expensive step; cache the verdict per entity so
    selection can be re-run without re-hitting Commons."""
    qid = feat["qid"]
    if qid in IMG_CACHE:
        return IMG_CACHE[qid]
    img = resolve_image(feat)
    IMG_CACHE[qid] = img
    if len(IMG_CACHE) % 25 == 0:
        json.dump(IMG_CACHE, open(IMG_CACHE_PATH, "w"))
    return img


def resolve_image(feat):
    """P18 first; then the entity's own Commons category, newest-first, capped."""
    verify_file._cat = False
    img = verify_file(feat.get("p18file"), feat["name"])
    if img:
        return img
    cat = feat.get("commons")
    if not cat:
        return None
    try:
        files = C.category_files(cat, limit=25)
    except Exception:
        return None
    verify_file._cat = True
    for fn in files[:12]:
        img = verify_file(fn, feat["name"])
        if img:
            return img
    return None


def main():
    pools = {}
    for c in targets["cities"]:
        cs = c["country"]
        if cs in pools:
            continue
        f = OUT / f"nature_{cs}.json"
        pools[cs] = [x for x in json.load(open(f)) if x["name"] and genuine_nature(x["types"], x["name"], x["sitelinks"])] if f.exists() else []
    for cs, p in sorted(pools.items()):
        print(f"  pool {cs}: {len(p)}")

    resolved = json.load(open(OUT / "resolved.json")) if (OUT / "resolved.json").exists() else {}
    used_slugs = set(EXISTING_SLUGS)
    for cslug, recs in resolved.items():
        for r in recs:
            used_slugs.add(r["slug"])
            EXISTING_QIDS_BY_CITY.setdefault(cslug, set()).add(r["wikidataId"])

    todo = [c for c in targets["cities"] if c["slug"] not in resolved]
    print(f"\ncities to resolve: {len(todo)}")

    for n, city in enumerate(todo, 1):
        pool = pools.get(city["country"], [])
        used_qids = set(EXISTING_QIDS_BY_CITY.get(city["slug"], set()))
        cands = []
        for f in pool:
            if f["qid"] in used_qids:
                continue
            if abs(f["lat"] - city["lat"]) > 3.2 or abs(f["lon"] - city["lon"]) > 4.2:
                continue
            km = hav(city["lat"], city["lon"], f["lat"], f["lon"])
            if km > FALLBACK_KM:
                continue
            cands.append((km, f))
        # nearest first, but prefer better-documented entities at similar range
        # Selection policy.
        #
        # Nearest-first alone is wrong for a large city: every slot fills with
        # canalised urban rivers inside the first few kilometres, and Mount Fuji
        # at 95 km never gets looked at. Two passes instead:
        #   pass A guarantees one entry from each distance band that has any,
        #          so the page spans "this afternoon" to "this weekend";
        #   pass B fills the rest by notability, capped per category so a city
        #          reaches the >=3 distinct categories a hub needs.
        BANDS = ((0.0, 60.0), (60.0, 120.0), (120.0, FALLBACK_KM))
        MAX_PER_CATEGORY = 3
        MAX_RIVERS = 2

        def is_river(f):
            return bool(re.search(r"\briver\b|\bstream\b|\bcreek\b|watercourse", f["types"]))

        cands.sort(key=lambda x: (-x[1]["sitelinks"], x[0]))
        picked, seen_names = [], set()
        cat_count, river_count = {}, 0

        def take(km, f):
            nonlocal river_count
            key = slugify(f["name"])
            if not key or key in seen_names or f["qid"] in used_qids:
                return False
            cat = categorize(f["types"])
            if cat_count.get(cat, 0) >= MAX_PER_CATEGORY:
                return False
            if is_river(f) and river_count >= MAX_RIVERS:
                return False
            img = resolve_image_cached(f)
            if not img:
                return False
            slug = f"{key}-near-{city['slug']}"
            if slug in used_slugs:
                return False
            picked.append({
                "slug": slug, "name": f["name"], "countrySlug": city["country"],
                "category": cat, "connectedCitySlugs": [city["slug"]],
                "distanceBand": band(km), "wikidataId": f["qid"],
                "officialUrl": f.get("website"),
                "latitude": round(f["lat"], 5), "longitude": round(f["lon"], 5),
                "km": round(km, 1), "image": img, "types": f["types"],
                "sitelinks": f["sitelinks"],
            })
            seen_names.add(key)
            cat_count[cat] = cat_count.get(cat, 0) + 1
            if is_river(f):
                river_count += 1
            used_qids.add(f["qid"])
            used_slugs.add(slug)
            return True

        for lo, hi in BANDS:                                   # pass A
            for km, f in cands:
                if lo <= km < hi and take(km, f):
                    break

        # Pass B prefers NEARER features, breaking ties on notability. Sorting
        # it by raw notability made every city within 300 km of a famous
        # landmark collect the same set: Nagoya, Kyoto and Osaka all pulled
        # Mount Fuji and Tokyo Bay, and the resulting spread no longer described
        # any one of them.
        for km, f in sorted(cands, key=lambda x: (round(x[0] / 25), -x[1]["sitelinks"], x[0])):
            if len(picked) >= PER_CITY:
                break
            take(km, f)

        picked.sort(key=lambda p: p["km"])

        resolved[city["slug"]] = picked
        json.dump(resolved, open(OUT / "resolved.json", "w"))
        json.dump(IMG_CACHE, open(IMG_CACHE_PATH, "w"))
        print(f"  [{n}/{len(todo)}] {city['slug']:28s} cands={len(cands):5d} picked={len(picked)}"
              f"  {'/'.join(p['category'] for p in picked)}", flush=True)

    tot = sum(len(v) for v in resolved.values())
    print(f"\nresolved cities: {len(resolved)}; new places: {tot}")
    print(f"cities reaching >=5 places: {sum(1 for v in resolved.values() if len(v) >= 5)}")
    print(f"cities still empty       : {sum(1 for v in resolved.values() if not v)}")


if __name__ == "__main__":
    main()
