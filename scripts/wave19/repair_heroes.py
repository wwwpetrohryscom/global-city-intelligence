#!/usr/bin/env python3
"""Deep hero repair for wave19 cities whose P18/P373 pass failed (mostly montage/
collage P18 files rejected by file_unsuitable). Widens the search: P373 categories
with a larger file limit, likely city subcategories, and a Commons File-namespace
search for the city name. Applies the SAME quality filters as hero_resolve (license,
author, >=1000px, jpg/png) — no weakening. Writes into /tmp/w19/heroes.json."""
import sys, json, time, urllib.parse
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C

OUT = Path("/tmp/w19")
sel = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
heroes = json.load(open(OUT / "heroes.json"))
FAILS = json.load(open(OUT / "hero_fails.json"))
COUNTRY_NAME = {"brazil": "Brazil", "mexico": "Mexico", "argentina": "Argentina",
                "colombia": "Colombia", "chile": "Chile", "peru": "Peru", "ecuador": "Ecuador",
                "bolivia": "Bolivia", "uruguay": "Uruguay", "paraguay": "Paraguay",
                "costa-rica": "Costa Rica", "panama": "Panama", "dominican-republic": "Dominican Republic"}
MIN_DIM = 1000
COMMONS = "https://commons.wikimedia.org/w/api.php"


def try_file(filename, city):
    if not filename: return None
    if C.file_unsuitable(filename): return None
    ii = C.imageinfo(filename, width=1280)
    if not ii: return None
    if ii["mime"] not in ("image/jpeg", "image/png"): return None
    ow, oh = ii.get("ow") or 0, ii.get("oh") or 0
    if max(ow, oh) < MIN_DIM: return None
    if not C.license_ok(ii["licenseCode"], ii["licenseShort"]): return None
    author = C.clean_author(ii["artist"])
    if not author: return None
    lic, licurl = C.normalize_license(ii["licenseCode"], ii["licenseShort"])
    if ii.get("licenseUrl"): licurl = ii["licenseUrl"]
    src_file = filename.replace("_", " ")
    return {"src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
            "alt": f"View of {city['name']}, {COUNTRY_NAME[city['countrySlug']]}",
            "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + src_file,
            "author": author, "authorUrl": C.author_url(ii["artist"]),
            "license": lic, "licenseUrl": licurl,
            "attributionText": f"{author} / Wikimedia Commons, {lic}", "commonsFile": src_file}


def search_files(query, limit=60):
    """Commons File-namespace search (srnamespace=6)."""
    params = {"action": "query", "format": "json", "list": "search", "srnamespace": "6",
              "srsearch": query, "srlimit": str(limit)}
    try:
        d = C._get(COMMONS + "?" + urllib.parse.urlencode(params), expect="query")
    except Exception:
        return []
    return [m["title"].split(":", 1)[1] for m in d.get("query", {}).get("search", []) if ":" in m["title"]]


def subcats(category, limit=40):
    params = {"action": "query", "format": "json", "list": "categorymembers",
              "cmtitle": "Category:" + category, "cmtype": "subcat", "cmlimit": str(limit)}
    try:
        d = C._get(COMMONS + "?" + urllib.parse.urlencode(params), expect="query")
    except Exception:
        return []
    return [m["title"].split(":", 1)[1] for m in d.get("query", {}).get("categorymembers", [])]


# prefer photo-like filenames (skyline/view/panorama/vista), then jpg
def score(f):
    fl = f.lower()
    kw = any(k in fl for k in ("skyline", "panoram", "vista", "view", "aerial", "centro",
                               "cidade", "ciudad", "downtown", "praca", "plaza", "catedral",
                               "avenida", "landscape", "cityscape"))
    return (0 if kw else 1, 0 if fl.endswith((".jpg", ".jpeg")) else 1, fl)


def resolve(city):
    tried = set()
    def attempt(files):
        for f in sorted(files, key=score):
            if f in tried: continue
            tried.add(f)
            if C.file_unsuitable(f): continue
            h = try_file(f, city)
            if h: return h
        return None
    # 1. P373 categories, wide pull + one level of city subcats
    try:
        claims = C.entity_claims(city["qid"])
    except Exception:
        claims = {}
    for f in C.claim_values(claims, "P18"):
        h = try_file(f, city)
        if h: return h
    cats = C.claim_values(claims, "P373")
    for cat in cats:
        try:
            h = attempt(C.category_files(cat, limit=300))
            if h: return h
        except Exception:
            pass
        for sc in subcats(cat):
            if any(w in sc.lower() for w in ("view", "panoram", "skyline", "cityscape",
                                             "aerial", "buildings", "streets", "centro", "downtown")):
                try:
                    h = attempt(C.category_files(sc, limit=120))
                    if h: return h
                except Exception:
                    pass
    # 2. Commons File-namespace search for the city name (+ country to disambiguate)
    q = f'{city["name"]} {COUNTRY_NAME[city["countrySlug"]]}'
    h = attempt(search_files(q, limit=80))
    if h: return h
    h = attempt(search_files(city["name"], limit=80))
    if h: return h
    return None


def main():
    still = []
    for s in FAILS:
        city = sel[s]
        try:
            h = resolve(city)
        except Exception as e:
            h = None
        if h:
            h["qid"] = city["qid"]
            heroes[s] = h
            print(f"  ✅ {s}: {h['commonsFile']}  ({h['width']}x{h['height']}, {h['license']})")
        else:
            still.append(s)
            print(f"  ❌ {s}: still no suitable hero")
        time.sleep(0.3)
    json.dump(heroes, open(OUT / "heroes.json", "w"), ensure_ascii=False)
    json.dump(still, open(OUT / "hero_fails.json", "w"))
    print(f"REPAIR DONE: heroes={len(heroes)}/{len(sel)}  still_failing={still}")


if __name__ == "__main__":
    main()
