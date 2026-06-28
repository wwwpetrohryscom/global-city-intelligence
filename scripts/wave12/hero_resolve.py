#!/usr/bin/env python3
"""Wave 11 Phase 3: resolve a hero image per selected city.
P18 (from discovery) -> P373 category fallback. Commons license/filename/resolution/
author filters. Checkpoints /tmp/w12/heroes.json (resumable). Reports failures."""
import sys, json, time
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C

OUT = Path("/tmp/w12")
selected = json.load(open(OUT / "selected.json"))
HEROES = OUT / "heroes.json"
FAILS = OUT / "hero_fails.json"
heroes = json.load(open(HEROES)) if HEROES.exists() else {}
COUNTRY_NAME = {"united-states": "United States", "canada": "Canada", "australia": "Australia",
                "germany": "Germany", "france": "France", "united-kingdom": "United Kingdom"}
MIN_DIM = 1000  # reject low-resolution originals

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
    return {
        "src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
        "alt": f"View of {city['name']}, {COUNTRY_NAME[city['countrySlug']]}",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + src_file,
        "author": author, "authorUrl": C.author_url(ii["artist"]),
        "license": lic, "licenseUrl": licurl,
        "attributionText": f"{author} / Wikimedia Commons, {lic}",
        "commonsFile": src_file,
    }

def resolve(city):
    # 1. P18 from discovery
    h = try_file(city.get("p18file"), city)
    if h: return h
    # 2. P373 category fallback
    try:
        claims = C.entity_claims(city["qid"])
    except Exception:
        return None
    cats = C.claim_values(claims, "P373")
    # also try P18 from fresh claims (in case discovery missed)
    for f in C.claim_values(claims, "P18"):
        h = try_file(f, city)
        if h: return h
    for cat in cats:
        try:
            files = C.category_files(cat, limit=80)
        except Exception:
            continue
        # prefer jpg photos; score by resolution implicitly via try_file
        files.sort(key=lambda f: (0 if f.lower().endswith((".jpg", ".jpeg")) else 1, f.lower()))
        for f in files:
            h = try_file(f, city)
            if h: return h
    return None

def main():
    todo = [c for c in selected if c["slug"] not in heroes]
    print(f"to resolve: {len(todo)} (already {len(heroes)})")
    fails = []
    for i, c in enumerate(selected):
        if c["slug"] in heroes: continue
        try:
            h = resolve(c)
        except Exception as e:
            h = None
        if h:
            h["qid"] = c["qid"]
            heroes[c["slug"]] = h
        else:
            fails.append(c["slug"])
        if (i + 1) % 10 == 0:
            json.dump(heroes, open(HEROES, "w"), ensure_ascii=False)
            print(f"  {i+1}/{len(selected)} resolved={len(heroes)} fails={len(fails)}")
        time.sleep(0.35)
    json.dump(heroes, open(HEROES, "w"), ensure_ascii=False)
    json.dump(fails, open(FAILS, "w"))
    print(f"DONE resolved={len(heroes)}/{len(selected)} fails={len(fails)}")
    if fails: print("FAILS:", fails)

if __name__ == "__main__":
    main()
