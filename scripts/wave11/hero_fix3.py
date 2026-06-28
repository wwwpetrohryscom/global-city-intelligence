#!/usr/bin/env python3
"""Fix 5 remaining wrong heroes (haguenau, velsen, san-angelo, suresnes, gouda) found by
re-audit. Wikipedia lead + targeted Commons search; require city-token in filename;
exclude wrong subjects (poop-bag, panzersperre, paris-view, train/station, road signs)."""
import sys, json, re, urllib.parse
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C

OUT = Path("/tmp/w11")
heroes = json.load(open(OUT / "heroes.json"))
sel = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
COUNTRY = {"united-states":"United States","canada":"Canada","australia":"Australia","germany":"Germany","france":"France","netherlands":"Netherlands"}

# slug -> (wiki title, required token, candidate queries, extra-exclude regex)
JOBS = {
  "haguenau": ("Haguenau", "haguenau", ["Haguenau centre","Haguenau old town","Haguenau hôtel de ville","Haguenau église","Haguenau"], r"tirez|toutounet|sac|sign"),
  "velsen": ("Velsen", "velsen", ["Velsen raadhuis","Velsen town hall","Velsen church","Velsen centrum","Velsen"], r"panzer|landfront|sperre|widerstand|bunker|atlantic ?wall|w\.n\."),
  "san-angelo": ("San Angelo, Texas", "san angelo", ["San Angelo Texas downtown","San Angelo skyline","San Angelo riverwalk","San Angelo Concho","San Angelo Texas"], r"school|panoramio|road|sign|fairview"),
  "suresnes": ("Suresnes", "suresnes", ["Suresnes mairie","Suresnes cité jardins","Suresnes hôtel de ville","Suresnes rue","Suresnes centre"], r"paris|vu de|eiffel|f[eé]cheray|panorama de paris"),
  "gouda": ("Gouda", "gouda", ["Gouda stadhuis","Gouda markt","Gouda town hall","Gouda Sint-Jan","Gouda market square"], r"station|perron|trein|flirt|train|spoor"),
}
GOOD = re.compile(r"stadhuis|hôtel de ville|town hall|raadhuis|markt|market|centre|centrum|old town|"
    r"altstadt|skyline|panorama|view|kerk|kirche|église|church|cathedral|mairie|downtown|riverwalk|"
    r"cité|rue |street|innenstadt", re.I)

def wiki_lead(title):
    p={"action":"query","format":"json","prop":"pageimages","piprop":"name","titles":title,"redirects":"1"}
    try:
        d=C._get("https://en.wikipedia.org/w/api.php?"+urllib.parse.urlencode(p),expect="query")
        for _,pg in d["query"]["pages"].items():
            if "pageimage" in pg: return pg["pageimage"].replace("_"," ")
    except Exception: pass
    return None
def search(q,limit=50):
    p={"action":"query","format":"json","list":"search","srsearch":"filetype:bitmap "+q,"srnamespace":"6","srlimit":str(limit)}
    try:
        d=C._get(C.COMMONS+"?"+urllib.parse.urlencode(p),expect="query")
        return [m["title"].split(":",1)[1] for m in d["query"]["search"]]
    except Exception: return []

def acceptable(f, ii, exclude, mindim=1000):
    if C.file_unsuitable(f) or re.search(exclude, f, re.I): return False
    if not ii or ii["mime"] not in ("image/jpeg","image/png"): return False
    if max(ii.get("ow") or 0, ii.get("oh") or 0) < mindim: return False
    if (ii.get("ow") or 0) < (ii.get("oh") or 1): return False
    if not C.license_ok(ii["licenseCode"], ii["licenseShort"]): return False
    return bool(C.clean_author(ii["artist"]))

for slug,(title,token,queries,excl) in JOBS.items():
    c=sel[slug]; chosen=None
    # 1. wiki lead (if it contains token & acceptable)
    lead=wiki_lead(title)
    if lead and token in lead.lower() and lead.lower().endswith((".jpg",".jpeg",".png")):
        ii=C.imageinfo(lead)
        if acceptable(lead,ii,excl): chosen=(lead,ii)
    # 2. targeted search requiring token
    if not chosen:
        for q in queries:
            best=None
            for f in search(q):
                if token not in f.lower() or not f.lower().endswith((".jpg",".jpeg")): continue
                ii=C.imageinfo(f)
                if not acceptable(f,ii,excl): continue
                sc=(1 if GOOD.search(f) else 0, max(ii["ow"],ii["oh"]))
                if best is None or sc>best[0]: best=(sc,f,ii)
            if best: chosen=(best[1],best[2]); break
    if chosen:
        f,ii=chosen; au=C.clean_author(ii["artist"])
        lic,licurl=C.normalize_license(ii["licenseCode"],ii["licenseShort"])
        if ii.get("licenseUrl"): licurl=ii["licenseUrl"]
        sf=f.replace("_"," ")
        heroes[slug]={"src":ii["url"],"width":int(ii["width"]),"height":int(ii["height"]),
            "alt":f"View of {c['name']}, {COUNTRY[c['countrySlug']]}","sourceUrl":"https://commons.wikimedia.org/wiki/File:"+sf,
            "author":au,"authorUrl":C.author_url(ii["artist"]),"license":lic,"licenseUrl":licurl,
            "attributionText":f"{au} / Wikimedia Commons, {lic}","commonsFile":sf,"qid":c["qid"]}
        print(f"  {slug} -> {lic} {ii['width']}x{ii['height']} | {sf[:50]} | {au[:20]}")
    else:
        print(f"  {slug} -> STILL FAIL")
json.dump(heroes,open(OUT/"heroes.json","w"),ensure_ascii=False)
print("saved")
