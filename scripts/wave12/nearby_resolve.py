#!/usr/bin/env python3
"""Wave 12 nearby resolver — nature-only with the STRONG filter (type + name +
NATURE_OK + urban-island) baked in upfront, so the first pass is already clean.
Matches each city to 5-8 nature features <=170km, verifies Commons images, global
slug dedup + within-city QID dedup. Checkpoints /tmp/w12/nearby.json (resumable)."""
import sys, json, math, re, time, unicodedata
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C

OUT = Path("/tmp/w12")
selected = json.load(open(OUT / "selected.json"))
existing_nearby_slugs = set(json.load(open(OUT / "existing_nearby_slugs.json")))
REGION = {"united-states": "North America", "canada": "North America", "australia": "Oceania",
          "germany": "Central Europe", "france": "Western Europe", "united-kingdom": "Western Europe"}

# ---- strong genuine-nature filter (from Wave 11 nearby_clean2, applied upfront) ----
BAD_TYPE = re.compile(r"historic|memorial|monument|battlefield|\bfort\b|fortress|museum|aquarium|\bzoo\b|"
    r"bird park|theme park|amusement|\bprison\b|archaeolog|fossil|pile dwelling|rijksbeschermd|\bdam\b|"
    r"\bcanal\b|water ?works|\bhamlet\b|outbuilding|attraction|neighbou?rhood|\bsquare\b|statue|\bchurch\b|"
    r"cathedral|\bpalace\b|chateau|\bestate\b|heritage|\bmanor\b|\babbey\b|monastery|\bmine\b|industrial|"
    r"stadium|cemetery|botanical|\bgarden\b|\bbuilding\b|historic district|world heritage|conservation area|"
    r"\bhouse\b|\bvilla\b|\bdepot\b|\bcastle\b|citadel|\bvillage\b|commune of|human settlement|municipality|"
    r"urban park|former lake|woolen mill|\bmill\b|civic|ceremonial|parkway|\broad\b|\bhighway\b")
BAD_NAME = re.compile(r"memorial|monument|\bhistoric\b|heritage|\bmall\b|battlefield|\bfort\b|\bprison\b|"
    r"museum|state historic|national historic|\bcanal\b|woolen mill|quartermaster|\bdepot\b|president|"
    r"capitol|courthouse|\bhall\b|cathedral|\bchurch\b|\bdam\b|parkway|bathing beach", re.I)
NATURE_OK = re.compile(r"national park|nature reserve|national nature reserve|protected landscape|state park|"
    r"provincial park|regional park|natural park|nature park|national forest|state forest|\bforest\b|"
    r"\bmountain|\bpeak\b|massif|\bhill\b|\blake\b|reservoir|\bbay\b|\bcape\b|peninsula|\bbeach\b|\bisland\b|"
    r"archipelago|waterfall|\bgorge\b|canyon|\bvalley\b|wilderness|geopark|marine park|wildlife refuge|"
    r"wildlife management|wildlife sanctuary|wetland|moor|heath|dune|fjord|estuary|nature monument|"
    r"conservation park|country park|biosphere|ramsar|natura 2000|special area of conservation|fell|"
    r"national wildlife|state natural|natural area|scenic|national seashore|national lakeshore|common\b|downs\b")
def genuine_nature(types, name):
    if BAD_NAME.search(name or ""): return False
    if not types: return False
    if BAD_TYPE.search(types): return False
    return bool(NATURE_OK.search(types))

METROS = [(48.853,2.349),(40.713,-74.006),(49.283,-123.121),(39.953,-75.165),(42.360,-71.058),
          (34.052,-118.244),(41.881,-87.629),(38.895,-77.036),(45.501,-73.567),(43.651,-79.383),
          (51.507,-0.128),(53.480,-2.243),(52.486,-1.890),(55.953,-3.188),(53.408,-2.991)]  # +London/Manchester/Birmingham/Edinburgh/Liverpool
def hav(a, b, c, d):
    r = math.radians
    return 2*6371*math.asin(math.sqrt(math.sin((r(c)-r(a))/2)**2 + math.cos(r(a))*math.cos(r(c))*math.sin((r(d)-r(b))/2)**2))
def urban_island(lat, lon, cat):
    return cat in ("island", "waterfront") and any(hav(lat, lon, m[0], m[1]) < 25 for m in METROS)

# clean pool: genuine-nature features only
pool = []
for cc in ["united-states", "canada", "australia", "germany", "france", "united-kingdom"]:
    fn = OUT / f"nature_{cc}.json"
    if fn.exists():
        for f in json.load(open(fn)):
            if f["name"] and f["p18file"] and genuine_nature(f["types"], f["name"]):
                pool.append(f)
print("genuine-nature pool:", len(pool))

DASHES = dict.fromkeys(map(ord, "‐‑‒–—―−·•"), "-")
PREMAP = str.maketrans({"ß": "ss", "Ø": "O", "ø": "o", "Æ": "Ae", "æ": "ae", "Å": "A", "å": "a",
    "Œ": "Oe", "œ": "oe", "Ł": "L", "ł": "l", "Đ": "D", "đ": "d", "Þ": "Th", "þ": "th", "ð": "d", "Ð": "D"})
def slugify(name):
    s = (name or "").translate(DASHES).translate(PREMAP)
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

def categorize(t):
    if re.search(r"\bmountain|\bpeak|summit|volcano|massif|\bhill\b|cordillera|sierra|\bfell\b|\bdowns\b", t): return "mountain"
    if re.search(r"island|archipelago|\bislet|\bisle\b", t): return "island"
    if re.search(r"\bbeach\b", t): return "beach"
    if re.search(r"\bbay\b|\bcape\b|peninsula|fjord|estuary|headland|\bcoast|lagoon|shoal|seashore", t): return "waterfront"
    if re.search(r"\blake\b|reservoir|\bloch\b|\bpond\b|\bmere\b", t): return "lake"
    if re.search(r"country park|regional park|city park|urban park|municipal park|\bpark$|public park|common\b", t) and "national" not in t: return "park"
    return "nature"

DESIG_PRI = ["national park", "national forest", "national nature reserve", "state park", "provincial park",
    "regional natural park", "natural park", "nature park", "nature reserve", "protected landscape",
    "national wildlife refuge", "geopark", "biosphere reserve", "country park", "area of outstanding natural beauty",
    "protected area", "forest", "lake", "mountain", "waterfall", "island", "bay"]
def designation(types, cat):
    for d in DESIG_PRI:
        if d in types: return d.title()
    return {"mountain": "Mountain Area", "lake": "Lake", "island": "Island", "beach": "Beach",
            "waterfront": "Coastal Area", "park": "Park"}.get(cat, "Natural Area")

def verify_image(f, name):
    fn = f["p18file"]
    if not fn or C.nearby_file_unsuitable(fn): return None
    ii = C.imageinfo(fn, width=1280)
    if not ii or ii["mime"] not in ("image/jpeg", "image/png"): return None
    if max(ii.get("ow") or 0, ii.get("oh") or 0) < 800: return None
    if not C.license_ok(ii["licenseCode"], ii["licenseShort"]): return None
    au = C.clean_author(ii["artist"])
    if not au: return None
    lic, licurl = C.normalize_license(ii["licenseCode"], ii["licenseShort"])
    if ii.get("licenseUrl"): licurl = ii["licenseUrl"]
    sf = fn.replace("_", " ")
    return {"src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
            "alt": f"Verified Wikimedia Commons image of {name}",
            "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + sf,
            "author": au, "authorUrl": C.author_url(ii["artist"]),
            "license": lic, "licenseUrl": licurl,
            "attributionText": f"{au} / Wikimedia Commons, {lic}"}

def band(km): return "nearby" if km <= 60 else ("regional" if km <= 120 else "longer_weekend")

def resolve_city(city, used):
    clat, clon = city["lat"], city["lon"]
    cands = []
    for f in pool:
        if abs(f["lat"]-clat) > 1.7 or abs(f["lon"]-clon) > 2.6: continue
        km = hav(clat, clon, f["lat"], f["lon"])
        if km > 170: continue
        cands.append((km, f))
    cands.sort(key=lambda x: x[0] - min(x[1]["sitelinks"], 30) * 1.5)
    out, seen_qid = [], set()
    for km, f in cands:
        if len(out) >= 8: break
        if f["qid"] in seen_qid: continue
        cat = categorize(f["types"])
        if urban_island(f["lat"], f["lon"], cat): continue
        pslug = slugify(f["name"])
        if not pslug: continue
        sl = f"{pslug}-near-{city['slug']}"
        if sl in existing_nearby_slugs or sl in used: continue
        img = verify_image(f, f["name"])
        if not img: continue
        seen_qid.add(f["qid"]); used.add(sl)
        desig = designation(f["types"], cat)
        out.append({"slug": sl, "name": f["name"], "countrySlug": f["countrySlug"],
            "regionName": REGION[f["countrySlug"]], "category": cat,
            "summary": (f"{f['name']} is a {desig.lower()} reachable from {city['name']} as a nearby nature "
                        f"destination. Research access, facilities, and seasonal conditions with official sources before visiting."),
            "connectedCitySlugs": [city["slug"]], "distanceBand": band(km), "wikidataId": f["qid"],
            "officialUrl": f["website"] if f.get("website") else None,
            "latitude": round(f["lat"], 5), "longitude": round(f["lon"], 5), "verificationStatus": "verified", "img": img,
            "facts": {"designation": desig,
                      "iucnCategory": (re.match(r"(Ia|Ib|IV|VI|V|III|II|I)\b", re.sub(r".*category\s*", "", f["iucn"]).strip()).group(1)
                                       if (f.get("iucn") and re.match(r"(Ia|Ib|IV|VI|V|III|II|I)\b", re.sub(r".*category\s*", "", f["iucn"]).strip())) else None),
                      "established": f.get("inception") if (f.get("inception") and 1000 < f["inception"] <= 2026) else None},
            "distanceKm": round(km, 1)})
    return out

def main():
    NB = OUT / "nearby.json"
    nearby = json.load(open(NB)) if NB.exists() else {}
    used = set(r["slug"] for v in nearby.values() for r in v)
    short = []
    for i, city in enumerate(selected):
        if city["slug"] in nearby: continue
        recs = resolve_city(city, used)
        nearby[city["slug"]] = recs
        if len(recs) < 5: short.append((city["slug"], len(recs)))
        if (i + 1) % 10 == 0:
            json.dump(nearby, open(NB, "w"), ensure_ascii=False)
            print(f"  {i+1}/{len(selected)} cities, {sum(len(v) for v in nearby.values())} nearby, short={len(short)}")
        time.sleep(0.05)
    json.dump(nearby, open(NB, "w"), ensure_ascii=False)
    print(f"DONE {len(nearby)} cities, {sum(len(v) for v in nearby.values())} nearby; under5={len(short)}: {short}")

if __name__ == "__main__":
    main()
