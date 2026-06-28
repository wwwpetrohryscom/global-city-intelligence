#!/usr/bin/env python3
"""Fix media issues found by validators: clean IUCN categories; re-resolve heroes
and nearby images that have unsuitable filenames or unusable authors. Updates
/tmp/w11/heroes.json and /tmp/w11/nearby.json."""
import sys, json, re, urllib.parse
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C

OUT = Path("/tmp/w11")
heroes = json.load(open(OUT / "heroes.json"))
nearby = json.load(open(OUT / "nearby.json"))
sel = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
COUNTRY = {"united-states": "United States", "canada": "Canada", "australia": "Australia",
           "germany": "Germany", "france": "France", "netherlands": "Netherlands"}
VALID_IUCN = {"Ia", "Ib", "I", "II", "III", "IV", "V", "VI"}
PLACEHOLDER = ("placeholder", "lorem", "click here", "unknown author", "unknown license",
               "image here", "todo", "tbd")
def ph(t): return any(x in (t or "").lower() for x in PLACEHOLDER)

def clean_iucn(v):
    if not v: return None
    m = re.match(r"(Ia|Ib|IV|VI|V|III|II|I)\b", v.strip())
    if m and m.group(1) in VALID_IUCN: return m.group(1)
    return None

def search_best(query, mindim=900, landscape=True):
    params = {"action": "query", "format": "json", "list": "search",
              "srsearch": "filetype:bitmap " + query, "srnamespace": "6", "srlimit": "40"}
    try:
        d = C._get(C.COMMONS + "?" + urllib.parse.urlencode(params), expect="query")
    except Exception:
        return None
    best = None
    for m in d["query"]["search"]:
        f = m["title"].split(":", 1)[1]
        if not f.lower().endswith((".jpg", ".jpeg")): continue
        if C.nearby_file_unsuitable(f): continue
        ii = C.imageinfo(f)
        if not ii or ii["mime"] != "image/jpeg": continue
        md = max(ii.get("ow") or 0, ii.get("oh") or 0)
        if md < mindim: continue
        if landscape and (ii.get("ow") or 0) < (ii.get("oh") or 1): continue
        if not C.license_ok(ii["licenseCode"], ii["licenseShort"]): continue
        au = C.clean_author(ii["artist"])
        if not au or ph(au): continue
        if best is None or md > best[0]:
            lic, licurl = C.normalize_license(ii["licenseCode"], ii["licenseShort"])
            if ii.get("licenseUrl"): licurl = ii["licenseUrl"]
            best = (md, f, ii, au, lic, licurl)
    return best

# 1. clean IUCN in nearby.json
fixed_iucn = 0
for city, recs in nearby.items():
    for r in recs:
        iu = r["facts"].get("iucnCategory")
        if iu is not None and iu not in VALID_IUCN:
            r["facts"]["iucnCategory"] = clean_iucn(iu)
            fixed_iucn += 1
print("iucn cleaned:", fixed_iucn)

# 2. re-resolve bad heroes
bad_heroes = [s for s, v in heroes.items() if C.file_unsuitable(v["commonsFile"]) or ph(v["author"]) or "unknown" in v["author"].lower()]
print("bad heroes:", bad_heroes)
for slug in bad_heroes:
    c = sel[slug]
    queries = [f"{c['name']} {c.get('admin') or ''}".strip(), f"{c['name']} {COUNTRY[c['countrySlug']]}", c["name"]]
    got = None
    for q in queries:
        got = search_best(q, mindim=900)
        if got: break
    if not got:
        print("  HERO STILL FAIL", slug); continue
    md, f, ii, au, lic, licurl = got
    sf = f.replace("_", " ")
    heroes[slug] = {"src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
        "alt": f"View of {c['name']}, {COUNTRY[c['countrySlug']]}",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + sf, "author": au,
        "authorUrl": C.author_url(ii["artist"]), "license": lic, "licenseUrl": licurl,
        "attributionText": f"{au} / Wikimedia Commons, {lic}", "commonsFile": sf, "qid": c["qid"]}
    print(f"  hero {slug} -> {lic} {ii['width']}x{ii['height']} {sf[:40]} | {au[:20]}")

# 3. re-resolve bad nearby images
def ph_or_unknown(s): return ph(s) or "unknown" in (s or "").lower()
fixed_img = 0
for city, recs in nearby.items():
    for r in recs:
        im = r["img"]; fn = im["sourceUrl"].split("File:")[-1]
        if not (C.nearby_file_unsuitable(fn) or ph_or_unknown(im["author"])):
            continue
        got = search_best(r["name"], mindim=800)
        if not got:
            got = search_best(f"{r['name']} {COUNTRY[r['countrySlug']]}", mindim=700)
        if not got:
            print("  IMG STILL FAIL", r["slug"]); continue
        md, f, ii, au, lic, licurl = got
        sf = f.replace("_", " ")
        r["img"] = {"src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
            "alt": f"Verified Wikimedia Commons image of {r['name']}",
            "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + sf, "author": au,
            "authorUrl": C.author_url(ii["artist"]), "license": lic, "licenseUrl": licurl,
            "attributionText": f"{au} / Wikimedia Commons, {lic}"}
        fixed_img += 1
        print(f"  img {r['slug']} -> {lic} {sf[:40]}")
print("images fixed:", fixed_img)

json.dump(heroes, open(OUT / "heroes.json", "w"), ensure_ascii=False)
json.dump(nearby, open(OUT / "nearby.json", "w"), ensure_ascii=False)
print("saved")
