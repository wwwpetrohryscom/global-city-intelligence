#!/usr/bin/env python3
"""Phase 13: re-image nearby places that currently use satellite/aerial imagery with
real ground-level Commons photos (reject satellite/map/flag/logo, require name token,
>=800px, accepted license + author). Writes /tmp/w12/sat_reimage.json."""
import sys, json, re, urllib.parse
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C

bad = json.load(open("/tmp/w12/sat_images.json"))
REJECT = re.compile(r'satellite|worldwind|landsat|sentinel|copernicus|/Map_|_map[._]|map_of|topograf|ordnance|_sheet\.|imagery|_labeled|locator|\.svg|/Flag_|coat[_-]of|emblem|_logo|montage|collage', re.I)


def acc(f, ii, mind=800):
    if not ii or ii["mime"] not in ("image/jpeg", "image/png"):
        return False
    if REJECT.search(f):
        return False
    if max(ii.get("ow") or 0, ii.get("oh") or 0) < mind:
        return False
    if not C.license_ok(ii["licenseCode"], ii["licenseShort"]):
        return False
    return bool(C.clean_author(ii["artist"]))


def wiki_lead(title):
    p = {"action": "query", "format": "json", "prop": "pageimages", "piprop": "name", "titles": title, "redirects": "1"}
    try:
        d = C._get("https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode(p), expect="query")
        for _, pg in d["query"]["pages"].items():
            if "pageimage" in pg:
                return pg["pageimage"].replace("_", " ")
    except Exception:
        pass
    return None


def search(q):
    p = {"action": "query", "format": "json", "list": "search", "srsearch": "filetype:bitmap " + q, "srnamespace": "6", "srlimit": "25"}
    try:
        d = C._get(C.COMMONS + "?" + urllib.parse.urlencode(p), expect="query")
        return [m["title"].split(":", 1)[1] for m in d["query"]["search"]]
    except Exception:
        return []


fixed = json.load(open("/tmp/w12/sat_reimage.json")) if __import__("os").path.exists("/tmp/w12/sat_reimage.json") else {}
for i, b in enumerate(bad):
    if b["slug"] in fixed:
        continue
    name = b["name"]
    tok = re.sub(r"[^a-z]", "", name.lower())[:5]
    chosen = None
    lead = wiki_lead(name)
    if lead and lead.lower().endswith((".jpg", ".jpeg", ".png")) and not REJECT.search(lead):
        ii = C.imageinfo(lead)
        if acc(lead, ii):
            chosen = (lead, ii)
    if not chosen:
        for q in [name, name + " lake", name + " shore", name + " view"]:
            best = None
            for f in search(q):
                if tok and tok not in f.lower().replace(" ", ""):
                    continue
                ii = C.imageinfo(f)
                if not acc(f, ii):
                    continue
                md = max(ii["ow"], ii["oh"])
                if best is None or md > best[0]:
                    best = (md, f, ii)
            if best:
                chosen = (best[1], best[2])
                break
    if chosen:
        f, ii = chosen
        au = C.clean_author(ii["artist"])
        lic, licurl = C.normalize_license(ii["licenseCode"], ii["licenseShort"])
        if ii.get("licenseUrl"):
            licurl = ii["licenseUrl"]
        sf = f.replace("_", " ")
        fixed[b["slug"]] = {"src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
                            "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + sf, "author": au,
                            "authorUrl": C.author_url(ii["artist"]), "license": lic, "licenseUrl": licurl,
                            "attributionText": f"{au} / Wikimedia Commons, {lic}", "commonsFile": sf}
    if (i + 1) % 10 == 0:
        json.dump(fixed, open("/tmp/w12/sat_reimage.json", "w"), ensure_ascii=False)
        print(f"  {i+1}/{len(bad)} processed, {len(fixed)} fixed", flush=True)
json.dump(fixed, open("/tmp/w12/sat_reimage.json", "w"), ensure_ascii=False)
print(f"DONE re-imaged {len(fixed)}/{len(bad)}; unfixable={len(bad)-len(fixed)}")
print("unfixable:", [b["slug"] for b in bad if b["slug"] not in fixed])
