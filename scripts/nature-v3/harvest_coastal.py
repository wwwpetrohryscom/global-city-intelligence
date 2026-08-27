#!/usr/bin/env python3
"""V3 Phase 6/7 — harvest beach and coastal features for every corpus country.

Coastal-ness is decided from data, never from a city's name: a city counts as
coastal when a real beach or coastal landform entity exists within
COASTAL_PROXIMITY_KM of its resolved coordinate.
"""
import sys, json, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "wave11"))
from sparql import sparql, parse_point, filepath_to_name  # noqa: E402

OUT = Path(__file__).resolve().parent / "cache"
CQ = json.load(open(ROOT / "scripts/nature/cache/city-candidates.json"))["country_qids"]

import re
src = (ROOT / "lib/data/cities.ts").read_text()
body = src[src.index("const seeds: CitySeed[] = ["):src.index("export const cities: City[] = seeds.map(buildCity);")]
it = list(re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', body))
pairs = {}
for i, m in enumerate(it):
    blk = body[m.start(): it[i+1].start() if i+1 < len(it) else len(body)]
    cs = re.search(r'countrySlug: "([a-z0-9-]+)"', blk)
    cn = re.search(r'countryName: "((?:[^"\\]|\\.)*)"', blk)
    if cs and cn:
        pairs[cs.group(1)] = cn.group(1)

# beach, urban beach, coastal landforms: cape, headland, cove, cliff, spit,
# lagoon, seashore, shore, coast, bay, fjord
ROOTS = ("wd:Q40080 wd:Q7900097 wd:Q185113 wd:Q191992 wd:Q31615 wd:Q107679 "
         "wd:Q93352 wd:Q468756 wd:Q187223 wd:Q941043 wd:Q45776 wd:Q14713846")
QTMPL = """
SELECT ?f (SAMPLE(?nm) AS ?name) (SAMPLE(?coord) AS ?c) (SAMPLE(?sl) AS ?sitelinks)
       (SAMPLE(?img) AS ?image) (SAMPLE(?cc) AS ?commons)
       (GROUP_CONCAT(DISTINCT ?t31; SEPARATOR="|") AS ?types) (SAMPLE(?web) AS ?website)
WHERE {
  VALUES ?root { %(ROOTS)s }
  ?f wdt:P31/wdt:P279* ?root ; wdt:P17 wd:%(CQ)s ; wdt:P625 ?coord ; wikibase:sitelinks ?sl .
  { ?f wdt:P18 ?img } UNION { ?f wdt:P373 ?cc }
  OPTIONAL { ?f wdt:P18 ?img }
  OPTIONAL { ?f wdt:P373 ?cc }
  OPTIONAL { ?f rdfs:label ?nm . FILTER(lang(?nm)="en") }
  OPTIONAL { ?f wdt:P31 ?t31e . ?t31e rdfs:label ?t31 . FILTER(lang(?t31)="en") }
  OPTIONAL { ?f wdt:P856 ?web }
} GROUP BY ?f LIMIT 40000
"""

for cslug, cname in sorted(pairs.items()):
    cq = CQ.get(cname)
    cache = OUT / f"coast_{cslug}.json"
    if cache.exists() or not cq:
        continue
    try:
        rows = sparql(QTMPL % {"ROOTS": ROOTS, "CQ": cq}, retries=3, timeout=600)
    except Exception as e:
        print(f"  !! {cslug}: {e}", flush=True)
        continue
    out = []
    for r in rows:
        def g(k):
            return r[k]["value"] if k in r and r[k]["value"] != "" else None
        lat, lon = parse_point(g("c"))
        if lat is None:
            continue
        img = g("image")
        out.append({"qid": r["f"]["value"].rsplit("/", 1)[-1], "name": g("name"),
                    "lat": lat, "lon": lon, "sitelinks": int(g("sitelinks") or 0),
                    "p18file": filepath_to_name(img) if img else None,
                    "commons": g("commons"), "types": (g("types") or "").lower(),
                    "website": g("website")})
    json.dump(out, open(cache, "w"))
    print(f"{cslug}: {len(out)}", flush=True)
    time.sleep(0.3)
print("coastal harvest done")
