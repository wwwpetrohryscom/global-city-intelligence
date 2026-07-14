#!/usr/bin/env python3
"""Subject-audit heroes whose filename does not contain the city name. For each we
fetch the Commons file's own categories and classify:
  OK        — categories clearly reference the city or its admin region
  WRONG     — categories reference a DIFFERENT city, or biology/map/chart/species/food
              (P18 contamination), and NOT the city
  UNCERTAIN — neither confirmed nor clearly wrong (hand off to agent review)
No data is changed; prints a classification for follow-up."""
import sys, json, re, unicodedata, urllib.parse
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C

OUT = Path("/tmp/w19")
heroes = json.load(open(OUT / "heroes.json"))
sel = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
repaired = {"merida", "campo-grande", "aracaju", "rio-branco", "macapa", "palmas", "la-boquilla", "salgar"}
API = "https://commons.wikimedia.org/w/api.php"

# admin region per selected city (helps confirm subject)
ADMIN = {c["slug"]: (c.get("admin") or "") for c in json.load(open(OUT / "selected.json"))}

BIO_MAP = re.compile(r"fungi|fungus|lichen|\bmoss\b|beetle|insect|moth\b|butterfly|"
    r"nautical chart|admiralty chart|\bcharts\b|\bmaps of|old maps|\bfruit\b|flowers of|plantae|"
    r"species|specimen|mycolog|herbaria|\bfood\b|cuisine|\bdishes\b|\bdrinks\b|beverages|churrasco|"
    r"aircraft|airliners|arthropod|arachnid|amphibian|reptile|\bbirds of\b", re.I)
# airport / chart / map filenames also make poor city heroes even when geolocated to the city
WEAK = re.compile(r"aeropuerto|airport|aeroporto|aerodrome|admiralty chart|nautical chart|"
    r"\bmap\b|\bchart\b|\bpreparaci|buñuelo|bunuelo|\bplato\b|\bfungus\b", re.I)
def contam(fn, catjoin):
    blob = fn.lower() + " | " + catjoin
    return bool(BIO_MAP.search(blob) or WEAK.search(blob))

def norm(s):
    return re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower())

def file_categories(fn):
    params = {"action": "query", "format": "json", "titles": "File:" + fn,
              "prop": "categories", "cllimit": "500"}
    try:
        d = C._get(API + "?" + urllib.parse.urlencode(params), expect="query")
    except Exception:
        return None
    out = []
    for p in d.get("query", {}).get("pages", {}).values():
        for c in p.get("categories", []):
            out.append(c["title"].split(":", 1)[-1])
    return out

ambiguous = []
for slug, h in heroes.items():
    if slug in repaired:
        continue
    fn = h.get("commonsFile", "")
    cn = norm(sel[slug]["name"])
    if cn and cn[:6] in norm(fn):
        continue
    ambiguous.append(slug)

ok, wrong, uncertain = [], [], []
for slug in ambiguous:
    h = heroes[slug]; fn = h["commonsFile"]; city = sel[slug]
    cn = norm(city["name"]); admin = norm(ADMIN.get(slug, ""))
    cats = file_categories(fn)
    if cats is None:
        uncertain.append((slug, city["name"], fn, "cat-fetch-failed")); continue
    blob = norm(" ".join(cats))
    catjoin = " | ".join(cats).lower()
    city_hit = (cn and cn[:6] in blob) or (admin and len(admin) > 4 and admin in blob)
    # contamination (fungus/chart/map/food/aircraft/airport) => WRONG regardless of city match
    if contam(fn, catjoin):
        wrong.append((slug, city["name"], city["countrySlug"], fn, f"contam: {catjoin[:60] or fn.lower()}")); continue
    if city_hit:
        ok.append((slug, fn)); continue
    uncertain.append((slug, city["name"], fn, (catjoin[:80] or "no-categories")))

print(f"ambiguous-filename heroes audited: {len(ambiguous)}")
print(f"  OK (category confirms city): {len(ok)}")
print(f"  WRONG (contamination / other place): {len(wrong)}")
for w in wrong: print("    ✗", w[0], "|", w[1], w[2], "|", w[3][:45], "|", w[4])
print(f"  UNCERTAIN (needs review): {len(uncertain)}")
for u in uncertain: print("    ?", u[0], "|", u[1], "|", u[2][:45], "|", u[3][:60])
json.dump({"ok": [o[0] for o in ok], "wrong": wrong, "uncertain": uncertain},
          open(OUT / "hero_cat_audit.json", "w"), ensure_ascii=False)
