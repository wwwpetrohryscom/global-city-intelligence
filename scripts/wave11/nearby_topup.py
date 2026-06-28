#!/usr/bin/env python3
"""Wave 11 Phase 4c: top up cities with <6 nearby places using a broader nature pool
(sitelinks>=0). Per shortfall country, fetch full nature pool once; match + verify
images; append. Dedup by QID within-city + slug globally."""
import sys, json, math, re, time, unicodedata
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C
from sparql import sparql, parse_point, filepath_to_name
import nearby_resolve as NR  # reuse slugify, categorize, designation, hav, band, REGION, verify_image

OUT = Path("/tmp/w11")
selected = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
nearby = json.load(open(OUT / "nearby.json"))
existing_nearby_slugs = set(json.load(open(OUT / "existing_nearby_slugs.json")))
TARGET = 6

ROOTS = ("wd:Q473972 wd:Q8502 wd:Q46831 wd:Q23397 wd:Q34038 wd:Q23442 wd:Q4421 "
         "wd:Q40080 wd:Q150784 wd:Q1245089 wd:Q185113 wd:Q39816 wd:Q33837 "
         "wd:Q46169 wd:Q179049 wd:Q34763")
CQ = {"united-states": "Q30", "canada": "Q16", "australia": "Q408",
      "germany": "Q183", "france": "Q142", "netherlands": "Q55"}

def full_pool(cc):
    cache = OUT / f"nature_full_{cc}.json"
    if cache.exists(): return json.load(open(cache))
    q = f"""
SELECT ?f (SAMPLE(?nm) AS ?name) (SAMPLE(?coord) AS ?c) (SAMPLE(?sl) AS ?sitelinks)
       (SAMPLE(?img) AS ?image) (GROUP_CONCAT(DISTINCT ?t31; SEPARATOR="|") AS ?types)
       (SAMPLE(?iucnL) AS ?iucn) (SAMPLE(?inc) AS ?inception) (SAMPLE(?web) AS ?website)
WHERE {{
  VALUES ?root {{ {ROOTS} }}
  ?f wdt:P31/wdt:P279* ?root ; wdt:P17 wd:{CQ[cc]} ; wdt:P18 ?img ; wdt:P625 ?coord ; wikibase:sitelinks ?sl .
  OPTIONAL {{ ?f rdfs:label ?nm . FILTER(lang(?nm)="en") }}
  OPTIONAL {{ ?f wdt:P31 ?t31e . ?t31e rdfs:label ?t31 . FILTER(lang(?t31)="en") }}
  OPTIONAL {{ ?f wdt:P814 ?iucnE . ?iucnE rdfs:label ?iucnL . FILTER(lang(?iucnL)="en") }}
  OPTIONAL {{ ?f wdt:P571 ?inc }}
  OPTIONAL {{ ?f wdt:P856 ?web }}
}} GROUP BY ?f LIMIT 40000
"""
    rows = sparql(q, timeout=300); out = []
    for r in rows:
        def g(k): return r[k]["value"] if k in r and r[k]["value"] != "" else None
        lat, lon = parse_point(g("c"))
        if lat is None: continue
        inc = g("inception"); year = None
        if inc:
            m = re.search(r"(-?\d{3,4})-", inc)
            if m: year = int(m.group(1))
        out.append({"qid": r["f"]["value"].split("/")[-1], "name": g("name"), "lat": lat, "lon": lon,
                    "sitelinks": int(g("sitelinks")) if g("sitelinks") else 0, "p18file": filepath_to_name(g("image")),
                    "types": (g("types") or "").lower(), "iucn": g("iucn"), "inception": year,
                    "website": g("website"), "countrySlug": cc})
    json.dump(out, open(cache, "w"), ensure_ascii=False)
    print(f"  full pool {cc}: {len(out)}")
    return out

used = set()
for v in nearby.values():
    for r in v: used.add(r["slug"])

short = {s: len(v) for s, v in nearby.items() if len(v) < TARGET}
print("shortfall cities:", sorted(short.items(), key=lambda x: x[1]))
pools = {}
for slug in short:
    city = selected[slug]; cc = city["countrySlug"]
    if cc not in pools: pools[cc] = full_pool(cc)
    pool = pools[cc]
    have_qids = {r["wikidataId"] for r in nearby[slug]}
    clat, clon = city["lat"], city["lon"]
    cands = []
    for f in pool:
        if f["qid"] in have_qids or not f["name"] or not f["p18file"]: continue
        if abs(f["lat"] - clat) > 1.7 or abs(f["lon"] - clon) > 2.6: continue
        km = NR.hav(clat, clon, f["lat"], f["lon"])
        if km > 170: continue
        cands.append((km, f))
    cands.sort(key=lambda x: x[0] - min(x[1]["sitelinks"], 30) * 1.5)
    added = 0
    for km, f in cands:
        if len(nearby[slug]) >= TARGET: break
        cat = NR.categorize(f["types"]); pslug = NR.slugify(f["name"])
        if not pslug: continue
        sl = f"{pslug}-near-{slug}"
        if sl in existing_nearby_slugs or sl in used: continue
        img = NR.verify_image(f, f["name"])
        if not img: continue
        used.add(sl); have_qids.add(f["qid"])
        desig = NR.designation(f["types"], cat)
        summary = (f"{f['name']} is a {desig.lower()} reachable from {city['name']} as a nearby nature "
                   f"destination. Research access, facilities, and seasonal conditions with official sources before visiting.")
        nearby[slug].append({
            "slug": sl, "name": f["name"], "countrySlug": cc, "regionName": NR.REGION[cc],
            "category": cat, "summary": summary, "connectedCitySlugs": [slug], "distanceBand": NR.band(km),
            "wikidataId": f["qid"], "officialUrl": f["website"] if f.get("website") else None,
            "latitude": round(f["lat"], 5), "longitude": round(f["lon"], 5), "verificationStatus": "verified",
            "img": img,
            "facts": {"designation": desig,
                      "iucnCategory": (re.sub(r".*category\s*", "", f["iucn"]).strip()[:4] if f.get("iucn") else None),
                      "established": f.get("inception") if (f.get("inception") and 1000 < f["inception"] <= 2026) else None},
            "distanceKm": round(km, 1)})
        added += 1
    print(f"  {slug}: +{added} -> {len(nearby[slug])}")

json.dump(nearby, open(OUT / "nearby.json", "w"), ensure_ascii=False)
print("still under 5:", sorted([(s, len(v)) for s, v in nearby.items() if len(v) < 5]))
print("total nearby:", sum(len(v) for v in nearby.values()))
