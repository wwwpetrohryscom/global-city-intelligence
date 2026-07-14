#!/usr/bin/env python3
"""Subject-verified hero re-resolution for the 2 cities whose fallback heroes were
namesake false-matches (rio-branco -> Avenida Rio Branco in Rio de Janeiro; palmas ->
a 'Palmas Música' concert in Belém). For each we mine ONLY city-specific Commons
categories + a disambiguated File-namespace search, then require that every candidate
file's OWN categories contain a right-place token and contain NO wrong-place token,
on top of the normal try_file license/author/resolution gate. Updates heroes.json."""
import sys, json, urllib.parse
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C

OUT = Path("/tmp/w19")
heroes = json.load(open(OUT / "heroes.json"))
sel = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
COUNTRY_NAME = {"brazil": "Brazil", "colombia": "Colombia"}
MIN_DIM = 1000
API = "https://commons.wikimedia.org/w/api.php"

TARGETS = {
    "rio-branco": {
        "cats": ["Mercado Velho (Rio Branco)", "Palácio Rio Branco (Acre)",
                 "Cathedral of Our Lady of Nazareth, Rio Branco", "Câmara Municipal de Rio Branco",
                 "Rio Branco"],
        "search": ["Rio Branco Acre centro", "Rio Branco Acre vista", "Rio Branco Acre"],
        "want": ("acre", "rio branco"), "reject": ("rio de janeiro", "janeiro", "guanabara"),
    },
    "palmas": {
        "cats": ["Avenida Juscelino Kubitschek (Palmas)", "Taquaruçu (Palmas)", "Palmas"],
        "search": ["Palmas Tocantins vista", "Palmas Tocantins avenida", "Palmas Tocantins"],
        "want": ("tocantins", "palmas"), "reject": ("belém", "belem", "pará", "para ", "gran canaria",
                                                     "paraná", "parana", "espírito santo", "concert", "música", "musica"),
    },
}


def file_categories(fn):
    params = {"action": "query", "format": "json", "titles": "File:" + fn,
              "prop": "categories", "cllimit": "500"}
    try:
        d = C._get(API + "?" + urllib.parse.urlencode(params), expect="query")
    except Exception:
        return []
    pages = d.get("query", {}).get("pages", {})
    cats = []
    for p in pages.values():
        for c in p.get("categories", []):
            cats.append(c["title"].split(":", 1)[-1].lower())
    return cats


def subject_ok(fn, want, reject):
    cats = file_categories(fn)
    blob = " | ".join(cats) + " | " + fn.lower()
    if any(r in blob for r in reject):
        return False, f"reject-token in {blob[:60]}"
    if any(w in blob for w in want):
        return True, "ok"
    return False, "no right-place token"


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
            "alt": f"View of {city['name']}, {COUNTRY_NAME[city['countrySlug']]}",
            "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + sf,
            "author": author, "authorUrl": C.author_url(ii["artist"]),
            "license": lic, "licenseUrl": licurl,
            "attributionText": f"{author} / Wikimedia Commons, {lic}", "commonsFile": sf}


def search_files(query, limit=40):
    params = {"action": "query", "format": "json", "list": "search", "srnamespace": "6",
              "srsearch": query, "srlimit": str(limit)}
    try:
        d = C._get(API + "?" + urllib.parse.urlencode(params), expect="query")
    except Exception:
        return []
    return [m["title"].split(":", 1)[1] for m in d.get("query", {}).get("search", []) if ":" in m["title"]]


PREF = ("skyline", "aerial", "vista", "panoram", "centro", "cidade", "avenida", "downtown",
        "cityscape", "catedral", "cathedral", "palácio", "palacio", "mercado", "praça", "praca")


def score(f):
    fl = f.lower()
    return (0 if any(k in fl for k in PREF) else 1, 0 if fl.endswith((".jpg", ".jpeg")) else 1, fl)


def resolve(slug, spec):
    city = sel[slug]
    cands = []
    for cat in spec["cats"]:
        try:
            cands += C.category_files(cat, limit=80)
        except Exception:
            pass
    for q in spec["search"]:
        cands += search_files(q, 40)
    seen = set()
    for fn in sorted(dict.fromkeys(cands), key=score):
        if fn in seen:
            continue
        seen.add(fn)
        h = try_file(fn, city)
        if not h:
            continue
        ok, why = subject_ok(fn, spec["want"], spec["reject"])
        if not ok:
            print(f"    skip {fn[:50]}: {why}")
            continue
        return h
    return None


for slug, spec in TARGETS.items():
    print(f"=== {slug} ===")
    h = resolve(slug, spec)
    if h:
        h["qid"] = sel[slug]["qid"]
        heroes[slug] = h
        print(f"  ✅ {h['commonsFile']} ({h['width']}x{h['height']}, {h['license']}, author={h['author']})")
    else:
        print("  ❌ no subject-verified hero found")

json.dump(heroes, open(OUT / "heroes.json", "w"), ensure_ascii=False)
print("DONE")
