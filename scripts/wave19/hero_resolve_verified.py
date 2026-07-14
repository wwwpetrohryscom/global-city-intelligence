#!/usr/bin/env python3
"""Subject-verified hero re-resolution for cities whose P18/fallback hero was
contaminated (food, airport, nautical chart, fungus/bird/fruit, aircraft). For each
target we discover city-specific Commons categories (Wikidata P373 + Commons category
search for '<name> <admin>') and a disambiguated File-namespace search, then require
each candidate file's OWN categories to reference the city/admin and contain NO
contamination or wrong-place token, on top of the normal try_file gate. Updates heroes.json."""
import sys, json, re, unicodedata, urllib.parse
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C

OUT = Path("/tmp/w19")
heroes = json.load(open(OUT / "heroes.json"))
sel = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
CN = {"brazil": "Brazil", "mexico": "Mexico", "argentina": "Argentina", "colombia": "Colombia",
      "chile": "Chile", "peru": "Peru", "ecuador": "Ecuador", "bolivia": "Bolivia", "uruguay": "Uruguay",
      "paraguay": "Paraguay", "costa-rica": "Costa Rica", "panama": "Panama", "dominican-republic": "Dominican Republic"}
MIN_DIM = 1000
API = "https://commons.wikimedia.org/w/api.php"

TARGETS = ["oruro", "luque", "armenia", "esmeraldas", "monteria", "puente-alto", "petropolis", "baranoa"]
# extra reject tokens beyond the shared contamination set (per-city wrong-place / topic)
EXTRA_REJECT = {
    "luque": ("airport", "pettirossi", "aviation", "aircraft"),
    "armenia": ("airport", "aeropuerto", "edén", "eden", "aviation"),
    "monteria": ("airport", "aeropuerto", "garzones", "aviation"),
    "esmeraldas": ("chart", "map", "admiralty"),
    "puente-alto": ("papaver", "fruit", "amapola", "flower", "poppy"),
    "petropolis": ("airplane", "aircraft", "14-bis", "aviation"),
    "baranoa": ("bird", "passerif", "aves", "ornitholog"),
    "oruro": ("food", "buñuelo", "bunuelo", "api con", "cuisine", "dish"),
}
CONTAM = re.compile(r"fungi|fungus|lichen|beetle|insect|butterfly|nautical chart|admiralty|\bcharts?\b|"
    r"\bmaps? of|\bfruit\b|flowers of|plantae|species|specimen|\bfood\b|cuisine|dishes|beverages|"
    r"aircraft|airliners|airport|aeropuerto|aeroporto|birds of|passerif|reptile|amphibian|arachnid", re.I)

def norm(s):
    return re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower())

def api_get(params):
    try:
        return C._get(API + "?" + urllib.parse.urlencode(params), expect="query")
    except Exception:
        return {}

def cat_search(term, limit=12):
    d = api_get({"action": "query", "format": "json", "list": "search", "srnamespace": "14",
                 "srsearch": term, "srlimit": str(limit)})
    return [m["title"].split(":", 1)[1] for m in d.get("query", {}).get("search", []) if ":" in m["title"]]

def file_search(term, limit=40):
    d = api_get({"action": "query", "format": "json", "list": "search", "srnamespace": "6",
                 "srsearch": term, "srlimit": str(limit)})
    return [m["title"].split(":", 1)[1] for m in d.get("query", {}).get("search", []) if ":" in m["title"]]

def file_categories(fn):
    d = api_get({"action": "query", "format": "json", "titles": "File:" + fn,
                 "prop": "categories", "cllimit": "500"})
    out = []
    for p in d.get("query", {}).get("pages", {}).values():
        for c in p.get("categories", []):
            out.append(c["title"].split(":", 1)[-1])
    return out

def file_coords(fn):
    """Commons file GPS coordinates (the {{Location}}/{{Object location}} template),
    if present. Returns (lat, lon) or None."""
    d = api_get({"action": "query", "format": "json", "titles": "File:" + fn,
                 "prop": "coordinates", "coprimary": "all"})
    for p in d.get("query", {}).get("pages", {}).values():
        for co in p.get("coordinates", []) or []:
            try:
                return float(co["lat"]), float(co["lon"])
            except Exception:
                pass
    return None

import math as _m
def _hav(a, b, c, d):
    r = _m.radians
    return 2 * 6371 * _m.asin(_m.sqrt(_m.sin((r(c) - r(a)) / 2) ** 2 + _m.cos(r(a)) * _m.cos(r(c)) * _m.sin((r(d) - r(b)) / 2) ** 2))

def try_file(fn, city):
    if C.file_unsuitable(fn):
        return None
    ii = C.imageinfo(fn, width=1280)
    if not ii or ii["mime"] not in ("image/jpeg", "image/png"):
        return None
    if max(ii.get("ow") or 0, ii.get("oh") or 0) < MIN_DIM:
        return None
    if not C.license_ok(ii["licenseCode"], ii["licenseShort"]):
        return None
    author = C.clean_author(ii["artist"])
    if not author:
        return None
    lic, licurl = C.normalize_license(ii["licenseCode"], ii["licenseShort"])
    if ii.get("licenseUrl"):
        licurl = ii["licenseUrl"]
    sf = fn.replace("_", " ")
    return {"src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
            "alt": f"View of {city['name']}, {CN[city['countrySlug']]}",
            "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + sf,
            "author": author, "authorUrl": C.author_url(ii["artist"]),
            "license": lic, "licenseUrl": licurl,
            "attributionText": f"{author} / Wikimedia Commons, {lic}", "commonsFile": sf}

PREF = ("skyline", "aerial", "vista", "panoram", "centro", "cidade", "ciudad", "avenida", "downtown",
        "cityscape", "catedral", "cathedral", "plaza", "praça", "praca", "iglesia", "igreja", "parque")
def score(f):
    fl = f.lower()
    return (0 if any(k in fl for k in PREF) else 1, 0 if fl.endswith((".jpg", ".jpeg")) else 1, fl)

def subject_ok(fn, city, want_tokens, reject_tokens):
    cats = file_categories(fn)
    blob = (" | ".join(cats) + " | " + fn).lower()
    nblob = norm(" ".join(cats) + " " + fn)
    if CONTAM.search(blob) or any(r in blob for r in reject_tokens):
        return False, "contam/reject"
    # PRIMARY signal: file coordinates must be within 30 km of the city (kills namesakes)
    fc = file_coords(fn)
    if fc is not None:
        km = _hav(city["lat"], city["lon"], fc[0], fc[1])
        if km <= 30:
            return True, f"geo {km:.0f}km"
        return False, f"geo-far {km:.0f}km"
    # No coords: require category to reference the city AND its admin region (strict)
    admin_tok = norm(city.get("admin") or "")
    has_city = any(w in nblob for w in want_tokens)
    has_admin = len(admin_tok) > 4 and admin_tok[:7] in nblob
    if has_city and has_admin:
        return True, "cat city+admin (no geo)"
    return False, "no-geo weak-cat"

for slug in TARGETS:
    city = sel[slug]; name = city["name"]; admin = city.get("admin") or ""
    want = [norm(name)[:7]] + ([norm(admin)[:7]] if len(norm(admin)) > 4 else [])
    want = [w for w in want if len(w) >= 4]
    reject = EXTRA_REJECT.get(slug, ())
    cats = []
    for q in [f"{name} {admin}".strip(), name]:
        cats += cat_search(q, 12)
    try:
        cats += C.claim_values(C.entity_claims(city["qid"]), "P373")
    except Exception:
        pass
    # keep only categories that look city-related and not contamination
    cats = [c for c in dict.fromkeys(cats) if any(w in norm(c) for w in want) and not CONTAM.search(c.lower())]
    files = []
    for cat in cats[:10]:
        try:
            files += C.category_files(cat, limit=60)
        except Exception:
            pass
    for q in [f"{name} {admin} centro", f"{name} {admin} vista", f"{name} panorama", f"{name} {CN[city['countrySlug']]}"]:
        files += file_search(q, 30)
    chosen, reason = None, ""
    for fn in sorted(dict.fromkeys(files), key=score):
        h = try_file(fn, city)
        if not h:
            continue
        ok, why = subject_ok(fn, city, want, reject)
        if not ok:
            continue
        chosen, reason = h, why
        break
    if chosen:
        chosen["qid"] = city["qid"]
        heroes[slug] = chosen
        print(f"  ✅ {slug}: {chosen['commonsFile'][:52]} ({chosen['width']}x{chosen['height']}, {chosen['license']}) [{reason}]")
    else:
        heroes.pop(slug, None)
        print(f"  ❌ {slug}: no geo/subject-verified hero found — left UNRESOLVED")

json.dump(heroes, open(OUT / "heroes.json", "w"), ensure_ascii=False)
print("DONE")
