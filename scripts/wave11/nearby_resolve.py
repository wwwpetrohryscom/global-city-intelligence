#!/usr/bin/env python3
"""Wave 11 Phase 4b: match each selected city to 5-8 nearby nature features (<=170km),
verify each feature's Commons image, build PlaceSeed+image+facts. Checkpoints
/tmp/w11/nearby.json (resumable). Global slug dedup + within-city QID dedup."""
import sys, json, math, re, time, unicodedata
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C

OUT = Path("/tmp/w11")
selected = json.load(open(OUT / "selected.json"))
existing_nearby_slugs = set(json.load(open(OUT / "existing_nearby_slugs.json")))
REGION = {"united-states": "North America", "canada": "North America", "australia": "Oceania",
          "germany": "Central Europe", "france": "Western Europe", "netherlands": "Western Europe"}

# pool of nature features
pool = []
for cc in ["united-states", "canada", "australia", "germany", "france", "netherlands"]:
    pool.extend(json.load(open(OUT / f"nature_{cc}.json")))
pool = [f for f in pool if f["name"] and f["p18file"]]
print(f"nature pool: {len(pool)}")

DASHES = dict.fromkeys(map(ord, "‐‑‒–—―−·•"), "-")
PREMAP = str.maketrans({"ß": "ss", "Ø": "O", "ø": "o", "Æ": "Ae", "æ": "ae", "Å": "A", "å": "a",
    "Œ": "Oe", "œ": "oe", "Ł": "L", "ł": "l", "Đ": "D", "đ": "d", "Þ": "Th", "þ": "th", "ð": "d", "Ð": "D"})
def slugify(name):
    s = (name or "").translate(DASHES).translate(PREMAP)
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

def hav(a, b, c, d):
    R = 6371.0; r = math.radians
    return 2 * R * math.asin(math.sqrt(
        math.sin((r(c) - r(a)) / 2) ** 2
        + math.cos(r(a)) * math.cos(r(c)) * math.sin((r(d) - r(b)) / 2) ** 2))

# category mapping (priority order)
def categorize(types):
    t = types
    if re.search(r"\bmountain|\bpeak|summit|volcano|massif|\bhill\b|cordillera|sierra", t): return "mountain"
    if re.search(r"island|archipelago|\bislet|\bisle\b", t): return "island"
    if re.search(r"\bbeach\b", t): return "beach"
    if re.search(r"\bbay\b|\bcape\b|peninsula|fjord|estuary|headland|\bcoast|lagoon|shoal|seashore", t): return "waterfront"
    if re.search(r"\blake\b|reservoir|\bloch\b|\bpond\b|\bmere\b|water reservoir", t): return "lake"
    if re.search(r"country park|regional park|city park|urban park|municipal park|\bpark$|public park", t) and "national" not in t: return "park"
    return "nature"

DESIG_PRI = ["national park", "national forest", "national nature reserve", "state park",
    "provincial park", "regional natural park", "natural park", "nature park", "nature reserve",
    "protected landscape", "landscape protection area", "national monument", "marine park",
    "national wildlife refuge", "geopark", "biosphere reserve", "wilderness area",
    "conservation area", "country park", "protected area", "forest", "lake", "mountain",
    "waterfall", "island", "bay"]
def designation(types, cat):
    for d in DESIG_PRI:
        if d in types:
            return d.title()
    return {"mountain": "Mountain Area", "lake": "Lake", "island": "Island",
            "beach": "Beach", "waterfront": "Coastal Area", "park": "Park"}.get(cat, "Natural Area")

CATWORD = {"nature": "natural area", "park": "park", "mountain": "mountain area", "lake": "lake",
           "beach": "beach", "island": "island", "waterfront": "coastal area"}

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

def band(km):
    return "nearby" if km <= 60 else ("regional" if km <= 120 else "longer_weekend")

def resolve_city(city, used_slugs):
    clat, clon = city["lat"], city["lon"]
    cands = []
    for f in pool:
        if abs(f["lat"] - clat) > 1.7 or abs((f["lon"] - clon)) > 2.6: continue
        km = hav(clat, clon, f["lat"], f["lon"])
        if km > 170: continue
        cands.append((km, f))
    # rank: notable + close (treat each sitelink as ~1.5km closer, capped)
    cands.sort(key=lambda x: x[0] - min(x[1]["sitelinks"], 30) * 1.5)
    out = []
    seen_qid = set()
    for km, f in cands:
        if len(out) >= 8: break
        if f["qid"] in seen_qid: continue
        cat = categorize(f["types"])
        pslug = slugify(f["name"])
        if not pslug: continue
        slug = f"{pslug}-near-{city['slug']}"
        if slug in existing_nearby_slugs or slug in used_slugs: continue
        img = verify_image(f, f["name"])
        if not img: continue
        seen_qid.add(f["qid"]); used_slugs.add(slug)
        desig = designation(f["types"], cat)
        summary = (f"{f['name']} is a {desig.lower() if desig else CATWORD.get(cat,'natural area')} "
                   f"reachable from {city['name']} as a nearby nature destination. Research access, "
                   f"facilities, and seasonal conditions with official sources before visiting.")
        rec = {
            "slug": slug, "name": f["name"], "countrySlug": f["countrySlug"],
            "regionName": REGION[f["countrySlug"]], "category": cat, "summary": summary,
            "connectedCitySlugs": [city["slug"]], "distanceBand": band(km),
            "wikidataId": f["qid"],
            "officialUrl": f["website"] if f.get("website") else None,
            "latitude": round(f["lat"], 5), "longitude": round(f["lon"], 5),
            "verificationStatus": "verified",
            "img": img,
            "facts": {"designation": desig,
                      "iucnCategory": (re.sub(r".*category\s*", "", f["iucn"]).strip()[:4] if f.get("iucn") else None),
                      "established": f.get("inception") if (f.get("inception") and 1000 < f["inception"] <= 2026) else None},
            "distanceKm": round(km, 1),
        }
        out.append(rec)
    return out

def main():
    NB = OUT / "nearby.json"
    nearby = json.load(open(NB)) if NB.exists() else {}
    used = set()
    for v in nearby.values():
        for r in v: used.add(r["slug"])
    short = []
    for i, city in enumerate(selected):
        if city["slug"] in nearby: continue
        recs = resolve_city(city, used)
        nearby[city["slug"]] = recs
        if len(recs) < 5: short.append((city["slug"], len(recs)))
        if (i + 1) % 10 == 0:
            json.dump(nearby, open(NB, "w"), ensure_ascii=False)
            tot = sum(len(v) for v in nearby.values())
            print(f"  {i+1}/{len(selected)} cities, {tot} nearby, short={len(short)}")
        time.sleep(0.05)
    json.dump(nearby, open(NB, "w"), ensure_ascii=False)
    tot = sum(len(v) for v in nearby.values())
    print(f"DONE: {len(nearby)} cities, {tot} nearby places")
    print(f"under-5 cities ({len(short)}):", short)

if __name__ == "__main__":
    main()
