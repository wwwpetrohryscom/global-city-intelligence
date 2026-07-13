#!/usr/bin/env python3
"""Deep verified nearby search for the 14 Wave-18 cities under 5 nearby places.
Broad landform/body-of-water/protected-area umbrellas (P279*) capture wadis, oases,
escarpments, plateaus, lava fields, salt lakes, canyons, wetlands, geoparks, etc.
without guessing exact class QIDs; cross-border neighbour countries (that exist in
countries.ts) are included for border desert cities. Client-side: genuine_nature
filter + Commons image verification + global/local dedup + distance <= 300 km.
Never fabricates; airports/artificial/maps already excluded by commons + genuine_nature."""
import sys, json, re
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave18")
from sparql import sparql, parse_point, filepath_to_name
import nearby_resolve as NR   # genuine_nature, verify_image, categorize, designation, band, slugify, hav, urban_island

OUT = Path("/tmp/w18")
ROOTS = "wd:Q271669 wd:Q15324 wd:Q863944 wd:Q473972 wd:Q4421 wd:Q23442"  # landform/water/land-waters/protected/forest/island
# neighbour countries that EXIST in countries.ts (nearby countrySlug must validate)
ME = {"Q851": "saudi-arabia", "Q810": "jordan", "Q796": "iraq", "Q817": "kuwait",
      "Q846": "qatar", "Q878": "united-arab-emirates", "Q842": "oman", "Q398": "bahrain", "Q79": "egypt"}
CN = {"Q148": "china", "Q232": "kazakhstan"}
REGION = dict(NR.REGION)
REGION.update({"jordan": "Middle East", "kuwait": "Middle East", "qatar": "Middle East",
               "bahrain": "Middle East", "egypt": "Africa", "kazakhstan": "Central Asia"})

QTMPL = """
SELECT ?f (SAMPLE(?nm) AS ?name) (SAMPLE(?coord) AS ?c) (SAMPLE(?sl) AS ?sitelinks)
       (SAMPLE(?img) AS ?image) (GROUP_CONCAT(DISTINCT ?t31; SEPARATOR="|") AS ?types)
       (SAMPLE(?ctry) AS ?country) (SAMPLE(?iucnL) AS ?iucn) (SAMPLE(?inc) AS ?inception) (SAMPLE(?web) AS ?website)
WHERE {
  VALUES ?root { %(ROOTS)s }
  VALUES ?ctry { %(CTRY)s }
  ?f wdt:P31/wdt:P279* ?root ; wdt:P17 ?ctry ; wdt:P18 ?img ; wdt:P625 ?coord ; wikibase:sitelinks ?sl .
  OPTIONAL { ?f rdfs:label ?nm . FILTER(lang(?nm)="en") }
  OPTIONAL { ?f wdt:P31 ?t31e . ?t31e rdfs:label ?t31 . FILTER(lang(?t31)="en") }
  OPTIONAL { ?f wdt:P814 ?iucnE . ?iucnE rdfs:label ?iucnL . FILTER(lang(?iucnL)="en") }
  OPTIONAL { ?f wdt:P571 ?inc }
  OPTIONAL { ?f wdt:P856 ?web }
} GROUP BY ?f LIMIT 40000
"""


def fetch_pool(tag, cmap):
    cache = OUT / f"deep_pool_{tag}.json"
    if cache.exists():
        rows = json.load(open(cache)); print(f"deep pool {tag}: cached {len(rows)}"); return rows
    ctry = " ".join(f"wd:{q}" for q in cmap)
    res = sparql(QTMPL % {"ROOTS": ROOTS, "CTRY": ctry}, timeout=300)
    out = []
    for r in res:
        def g(k): return r[k]["value"] if k in r and r[k]["value"] != "" else None
        lat, lon = parse_point(g("c"))
        if lat is None: continue
        inc = g("inception"); year = None
        if inc:
            m = re.search(r"(-?\d{3,4})-", inc)
            if m: year = int(m.group(1))
        cq = (g("country") or "").split("/")[-1]
        out.append({"qid": r["f"]["value"].split("/")[-1], "name": g("name"),
            "lat": lat, "lon": lon, "sitelinks": int(g("sitelinks")) if g("sitelinks") else 0,
            "p18file": filepath_to_name(g("image")), "types": (g("types") or "").lower(),
            "iucn": g("iucn"), "inception": year, "website": g("website"),
            "countrySlug": cmap.get(cq, cq)})
    json.dump(out, open(cache, "w"), ensure_ascii=False)
    print(f"deep pool {tag}: fetched {len(out)}"); return out


def main():
    sel = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
    nb = json.load(open(OUT / "nearby.json"))
    deficient = [(s, c) for s, c in sel.items() if len(nb.get(s, [])) < 5]
    me_pool = [f for f in fetch_pool("me", ME) if f["name"] and f["p18file"] and NR.genuine_nature(f["types"], f["name"])]
    cn_pool = [f for f in fetch_pool("cn", CN) if f["name"] and f["p18file"] and NR.genuine_nature(f["types"], f["name"])]
    print(f"genuine-nature deep pools: ME={len(me_pool)} CN={len(cn_pool)}")
    used = set(r["slug"] for v in nb.values() for r in v) | set(NR.existing_nearby_slugs)

    log = {}
    for s, c in deficient:
        pool = cn_pool if c["countrySlug"] in ("china",) else me_pool
        clat, clon = c["lat"], c["lon"]
        have = nb.get(s, [])
        have_qids = {r.get("wikidataId") for r in have}
        cands = []
        for f in pool:
            km = NR.hav(clat, clon, f["lat"], f["lon"])
            if km > 300: continue
            cands.append((km, f))
        cands.sort(key=lambda x: x[0] - min(x[1]["sitelinks"], 30) * 1.5)
        added, rejected = [], []
        for km, f in cands:
            if len(have) + len(added) >= 8: break
            if f["qid"] in have_qids: continue
            cat = NR.categorize(f["types"])
            if NR.urban_island(f["lat"], f["lon"], cat): rejected.append((f["name"], "urban-island")); continue
            pslug = NR.slugify(f["name"])
            if not pslug: continue
            sl = f"{pslug}-near-{s}"
            if sl in used: rejected.append((f["name"], "dup-slug")); continue
            img = NR.verify_image(f, f["name"])
            if not img: rejected.append((f["name"], "no-verified-image")); continue
            have_qids.add(f["qid"]); used.add(sl)
            desig = NR.designation(f["types"], cat)
            iucn = None
            if f.get("iucn"):
                mm = re.match(r"(Ia|Ib|IV|VI|V|III|II|I)\b", re.sub(r".*category\s*", "", f["iucn"]).strip())
                iucn = mm.group(1) if mm else None
            added.append({"slug": sl, "name": f["name"], "countrySlug": f["countrySlug"],
                "regionName": REGION.get(f["countrySlug"], "Middle East"), "category": cat,
                "summary": (f"{f['name']} is a {desig.lower()} reachable from {c['name']} as a nearby nature "
                            f"destination. Research access, facilities, and seasonal conditions with official sources before visiting."),
                "connectedCitySlugs": [s], "distanceBand": NR.band(km), "wikidataId": f["qid"],
                "officialUrl": f["website"] if f.get("website") else None,
                "latitude": round(f["lat"], 5), "longitude": round(f["lon"], 5),
                "verificationStatus": "verified", "img": img,
                "facts": {"designation": desig, "iucnCategory": iucn,
                          "established": f.get("inception") if (f.get("inception") and 1000 < f["inception"] <= 2026) else None},
                "distanceKm": round(km, 1)})
        nb[s] = have + added
        log[s] = {"before": len(have), "after": len(nb[s]), "added": [a["name"] for a in added],
                  "candidates_in_range": len(cands), "rejected_sample": rejected[:6]}
        print(f"  {s:18s} {len(have)} -> {len(nb[s])}  (+{len(added)}: {[a['name'] for a in added]})")

    json.dump(nb, open(OUT / "nearby.json", "w"), ensure_ascii=False)
    json.dump(log, open(OUT / "deep_log.json", "w"), ensure_ascii=False, indent=1)
    still = [(s, len(nb.get(s, []))) for s, c in deficient if len(nb.get(s, [])) < 5]
    print(f"\nstill under-5 after deep search: {still}")


if __name__ == "__main__":
    main()
