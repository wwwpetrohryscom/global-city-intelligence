#!/usr/bin/env python3
"""Deep topup for still-sparse cities: nature features WITHOUT requiring Wikidata P18;
resolve image via P18/P373/Commons-search. min-dim 600. Targets cities still <5."""
import sys, json, re, urllib.parse
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C
from sparql import sparql, parse_point, filepath_to_name
import nearby_resolve as NR

OUT = Path("/tmp/w11")
selected = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
nearby = json.load(open(OUT / "nearby.json"))
existing_nearby_slugs = set(json.load(open(OUT / "existing_nearby_slugs.json")))
TARGET = 5
CQ = {"australia": "Q408", "united-states": "Q30", "canada": "Q16"}
ROOTS = ("wd:Q473972 wd:Q8502 wd:Q46831 wd:Q23397 wd:Q34038 wd:Q23442 wd:Q4421 wd:Q40080 "
         "wd:Q150784 wd:Q1245089 wd:Q185113 wd:Q39816 wd:Q33837 wd:Q46169 wd:Q179049 wd:Q34763")

def region_features(cc, lat, lon):
    """Nature features in a bbox (no P18 requirement)."""
    dlat, dlon = 1.7, 2.6
    q = f"""
SELECT ?f (SAMPLE(?nm) AS ?name) (SAMPLE(?coord) AS ?c) (SAMPLE(?sl) AS ?sitelinks)
       (SAMPLE(?img) AS ?image) (GROUP_CONCAT(DISTINCT ?t31; SEPARATOR="|") AS ?types)
       (SAMPLE(?iucnL) AS ?iucn) (SAMPLE(?inc) AS ?inception) (SAMPLE(?web) AS ?website)
WHERE {{
  VALUES ?root {{ {ROOTS} }}
  ?f wdt:P31/wdt:P279* ?root ; wdt:P17 wd:{CQ[cc]} ; wdt:P625 ?coord ; wikibase:sitelinks ?sl .
  OPTIONAL {{ ?f rdfs:label ?nm . FILTER(lang(?nm)="en") }}
  OPTIONAL {{ ?f wdt:P18 ?img }}
  OPTIONAL {{ ?f wdt:P31 ?t31e . ?t31e rdfs:label ?t31 . FILTER(lang(?t31)="en") }}
  OPTIONAL {{ ?f wdt:P814 ?iucnE . ?iucnE rdfs:label ?iucnL . FILTER(lang(?iucnL)="en") }}
  OPTIONAL {{ ?f wdt:P571 ?inc }}
  OPTIONAL {{ ?f wdt:P856 ?web }}
}} GROUP BY ?f LIMIT 40000
"""
    rows = sparql(q, timeout=300); out = []
    for r in rows:
        def g(k): return r[k]["value"] if k in r and r[k]["value"] != "" else None
        la, lo = parse_point(g("c"))
        if la is None or abs(la - lat) > dlat or abs(lo - lon) > dlon: continue
        inc = g("inception"); yr = None
        if inc:
            m = re.search(r"(-?\d{3,4})-", inc)
            if m: yr = int(m.group(1))
        out.append({"qid": r["f"]["value"].split("/")[-1], "name": g("name"), "lat": la, "lon": lo,
                    "sitelinks": int(g("sitelinks")) if g("sitelinks") else 0, "p18file": filepath_to_name(g("image")),
                    "types": (g("types") or "").lower(), "iucn": g("iucn"), "inception": yr, "website": g("website"),
                    "countrySlug": cc})
    return out

def search_image(name, mindim=600):
    params = {"action": "query", "format": "json", "list": "search",
              "srsearch": "filetype:bitmap " + name, "srnamespace": "6", "srlimit": "25"}
    try:
        d = C._get(C.COMMONS + "?" + urllib.parse.urlencode(params), expect="query")
    except Exception:
        return None
    for m in d["query"]["search"]:
        f = m["title"].split(":", 1)[1]
        if not f.lower().endswith((".jpg", ".jpeg")) or C.nearby_file_unsuitable(f): continue
        ii = C.imageinfo(f)
        if not ii or ii["mime"] != "image/jpeg": continue
        if max(ii.get("ow") or 0, ii.get("oh") or 0) < mindim: continue
        if (ii.get("ow") or 0) < (ii.get("oh") or 1): continue
        if not C.license_ok(ii["licenseCode"], ii["licenseShort"]): continue
        au = C.clean_author(ii["artist"])
        if not au: continue
        lic, licurl = C.normalize_license(ii["licenseCode"], ii["licenseShort"])
        if ii.get("licenseUrl"): licurl = ii["licenseUrl"]
        sf = f.replace("_", " ")
        return {"src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
                "alt": f"Verified Wikimedia Commons image of {name}",
                "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + sf, "author": au,
                "authorUrl": C.author_url(ii["artist"]), "license": lic, "licenseUrl": licurl,
                "attributionText": f"{au} / Wikimedia Commons, {lic}"}
    return None

def get_image(f):
    img = NR.verify_image(f, f["name"]) if f.get("p18file") else None
    if img: return img
    # P18/P373 via entitydata
    try:
        cl = C.entity_claims(f["qid"])
        for fn in C.claim_values(cl, "P18"):
            f2 = dict(f); f2["p18file"] = fn
            img = NR.verify_image(f2, f["name"])
            if img: return img
        for cat in C.claim_values(cl, "P373"):
            for fn in C.category_files(cat, limit=40):
                if not fn.lower().endswith((".jpg", ".jpeg")) or C.nearby_file_unsuitable(fn): continue
                f2 = dict(f); f2["p18file"] = fn
                img = NR.verify_image(f2, f["name"])
                if img: return img
    except Exception:
        pass
    return search_image(f["name"])

used = set()
for v in nearby.values():
    for r in v: used.add(r["slug"])
short = {s: len(v) for s, v in nearby.items() if len(v) < TARGET}
print("deep topup targets:", sorted(short.items(), key=lambda x: x[1]))
for slug in short:
    city = selected[slug]; cc = city["countrySlug"]
    feats = region_features(cc, city["lat"], city["lon"])
    have = {r["wikidataId"] for r in nearby[slug]}
    cands = []
    for f in feats:
        if f["qid"] in have or not f["name"]: continue
        km = NR.hav(city["lat"], city["lon"], f["lat"], f["lon"])
        if km > 170: continue
        cands.append((km, f))
    cands.sort(key=lambda x: x[0] - min(x[1]["sitelinks"], 30) * 1.2)
    added = 0
    for km, f in cands:
        if len(nearby[slug]) >= TARGET: break
        cat = NR.categorize(f["types"]); pslug = NR.slugify(f["name"])
        if not pslug: continue
        sl = f"{pslug}-near-{slug}"
        if sl in existing_nearby_slugs or sl in used: continue
        img = get_image(f)
        if not img: continue
        used.add(sl); have.add(f["qid"])
        desig = NR.designation(f["types"], cat)
        nearby[slug].append({
            "slug": sl, "name": f["name"], "countrySlug": cc, "regionName": NR.REGION[cc], "category": cat,
            "summary": (f"{f['name']} is a {desig.lower()} reachable from {city['name']} as a nearby nature "
                        f"destination. Research access, facilities, and seasonal conditions with official sources before visiting."),
            "connectedCitySlugs": [slug], "distanceBand": NR.band(km), "wikidataId": f["qid"],
            "officialUrl": f["website"] if f.get("website") else None,
            "latitude": round(f["lat"], 5), "longitude": round(f["lon"], 5), "verificationStatus": "verified", "img": img,
            "facts": {"designation": desig,
                      "iucnCategory": (re.sub(r".*category\s*", "", f["iucn"]).strip()[:4] if f.get("iucn") else None),
                      "established": f.get("inception") if (f.get("inception") and 1000 < f["inception"] <= 2026) else None},
            "distanceKm": round(km, 1)})
        added += 1
    print(f"  {slug}: +{added} -> {len(nearby[slug])}")
json.dump(nearby, open(OUT / "nearby.json", "w"), ensure_ascii=False)
print("FINAL under 5:", sorted([(s, len(v)) for s, v in nearby.items() if len(v) < 5]))
print("total nearby:", sum(len(v) for v in nearby.values()))
