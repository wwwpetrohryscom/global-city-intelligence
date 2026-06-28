#!/usr/bin/env python3
"""Re-resolve the 16 wrong-subject heroes (beer label, badges, map, car, satellite,
COA, drawings, etc.) using Wikipedia lead image (PageImages) + townscape-aware
Commons search with a wrong-subject reject list. Updates heroes.json."""
import sys, json, re, urllib.parse, urllib.request
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C

OUT = Path("/tmp/w11")
heroes = json.load(open(OUT / "heroes.json"))
sel = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
bad = json.load(open(OUT / "bad_heroes.json"))
COUNTRY = {"united-states": "United States", "canada": "Canada", "australia": "Australia",
           "germany": "Germany", "france": "France", "netherlands": "Netherlands"}

# wikipedia article titles (disambiguated)
TITLE = {
    "binghamton": "Binghamton, New York", "brandenburg-an-der-havel": "Brandenburg an der Havel",
    "cambridge-us": "Cambridge, Massachusetts", "chartres": "Chartres", "den-helder": "Den Helder",
    "gaspe": "Gaspé, Quebec", "greifswald": "Greifswald", "heusden": "Heusden, North Brabant",
    "mount-isa": "Mount Isa", "north-bay": "North Bay, Ontario", "perigueux": "Périgueux",
    "redwood-city": "Redwood City, California", "saint-germain-en-laye": "Saint-Germain-en-Laye",
    "vaudreuil-dorion": "Vaudreuil-Dorion", "velsen": "Velsen", "wichita-falls": "Wichita Falls, Texas",
}
WRONG = re.compile(r"label|badge|\bncm\b|beer|\bale\b|drawing|turtle|fortwo|\bcar\b|bust|brides|\bmoon\b|"
    r"storm|sturmtief|watercolo|painting|\bpeat\b|\bbog\b|opentopo|satellite|nasa|\bcoa\b|coat[_ ]of[_ ]arms|"
    r"herbarium|specimen|manuscript|diagram|fonds|levasseur|\bplan\b|gemeentekaart|topograf|aerial photo of|"
    r"\bmap\b|\bseal\b|banknote|stamp|portrait|engraving|lithograph", re.I)
GOOD = re.compile(r"skyline|panorama|cityscape|downtown|centre-ville|center|\bview\b|h[oô]tel de ville|rathaus|"
    r"altstadt|old town|\bmarket\b|markt|\bhall\b|street|strasse|straße|\bdom\b|cathedral|kirche|\bvue\b|"
    r"\bville\b|harbour|harbor|waterfront|aerial|luftbild|innenstadt|centrum|gr: place|\bplace\b|\bsquare\b", re.I)

def acceptable(f, ii, mindim=1000):
    if C.file_unsuitable(f) or WRONG.search(f): return False
    if not ii or ii["mime"] not in ("image/jpeg", "image/png"): return False
    if max(ii.get("ow") or 0, ii.get("oh") or 0) < mindim: return False
    if (ii.get("ow") or 0) < (ii.get("oh") or 1): return False  # landscape
    if not C.license_ok(ii["licenseCode"], ii["licenseShort"]): return False
    au = C.clean_author(ii["artist"])
    return bool(au)

def build(slug, f, ii):
    c = sel[slug]; au = C.clean_author(ii["artist"])
    lic, licurl = C.normalize_license(ii["licenseCode"], ii["licenseShort"])
    if ii.get("licenseUrl"): licurl = ii["licenseUrl"]
    sf = f.replace("_", " ")
    return {"src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
        "alt": f"View of {c['name']}, {COUNTRY[c['countrySlug']]}",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + sf, "author": au,
        "authorUrl": C.author_url(ii["artist"]), "license": lic, "licenseUrl": licurl,
        "attributionText": f"{au} / Wikimedia Commons, {lic}", "commonsFile": sf, "qid": c["qid"]}

def wiki_lead(title):
    """Wikipedia lead image filename via PageImages."""
    p = {"action": "query", "format": "json", "prop": "pageimages", "piprop": "name",
         "titles": title, "redirects": "1"}
    try:
        d = C._get("https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode(p), expect="query")
        for _, pg in d["query"]["pages"].items():
            if "pageimage" in pg: return pg["pageimage"].replace("_", " ")
    except Exception: pass
    return None

def wiki_images(title, limit=60):
    p = {"action": "query", "format": "json", "prop": "images", "imlimit": str(limit), "titles": title, "redirects": "1"}
    try:
        d = C._get("https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode(p), expect="query")
        out = []
        for _, pg in d["query"]["pages"].items():
            for im in pg.get("images", []):
                t = im["title"]
                if t.lower().startswith("file:"): out.append(t.split(":", 1)[1])
        return out
    except Exception: return []

def commons_search(q, limit=40):
    p = {"action": "query", "format": "json", "list": "search", "srsearch": "filetype:bitmap " + q,
         "srnamespace": "6", "srlimit": str(limit)}
    try:
        d = C._get(C.COMMONS + "?" + urllib.parse.urlencode(p), expect="query")
        return [m["title"].split(":", 1)[1] for m in d["query"]["search"]]
    except Exception: return []

for slug in bad:
    c = sel[slug]; title = TITLE.get(slug, c["name"])
    chosen = None
    # 1. wikipedia lead
    lead = wiki_lead(title)
    if lead and lead.lower().endswith((".jpg", ".jpeg", ".png")):
        ii = C.imageinfo(lead)
        if acceptable(lead, ii): chosen = (lead, ii)
    # 2. wikipedia article images preferring townscape keywords
    if not chosen:
        imgs = wiki_images(title)
        imgs.sort(key=lambda f: (0 if GOOD.search(f) else 1, 0 if f.lower().endswith((".jpg", ".jpeg")) else 1))
        for f in imgs:
            if not f.lower().endswith((".jpg", ".jpeg", ".png")): continue
            ii = C.imageinfo(f)
            if acceptable(f, ii): chosen = (f, ii); break
    # 3. commons search with townscape terms
    if not chosen:
        admin = c.get("admin") or ""
        for q in [f"{c['name']} skyline", f"{c['name']} {admin}", f"{c['name']} {COUNTRY[c['countrySlug']]}", c["name"]]:
            best = None
            for f in commons_search(q):
                if not f.lower().endswith((".jpg", ".jpeg")): continue
                ii = C.imageinfo(f)
                if not acceptable(f, ii): continue
                score = (1 if GOOD.search(f) else 0, max(ii.get("ow") or 0, ii.get("oh") or 0))
                if best is None or score > best[0]: best = (score, f, ii)
            if best: chosen = (best[1], best[2]); break
    if chosen:
        heroes[slug] = build(slug, chosen[0], chosen[1])
        h = heroes[slug]
        print(f"  {slug} -> {h['license']} {h['width']}x{h['height']} | {h['commonsFile'][:48]} | {h['author'][:20]}")
    else:
        print(f"  {slug} -> STILL FAIL")

json.dump(heroes, open(OUT / "heroes.json", "w"), ensure_ascii=False)
print("saved heroes.json")
