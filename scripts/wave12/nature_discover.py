#!/usr/bin/env python3
"""Wave 11 Phase 4a: discover nature features (with P18 image + coords) per country
via QLever. Caches /tmp/w12/nature_<countrySlug>.json (resumable)."""
import sys, json, re
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
from sparql import sparql, parse_point, filepath_to_name

OUT = Path("/tmp/w12")
CQ = {"united-states": "Q30", "canada": "Q16", "australia": "Q408",
      "germany": "Q183", "france": "Q142", "united-kingdom": "Q145"}
# nature roots: protected area, mountain, mountain range, lake, waterfall, island, forest,
# beach, gorge, canyon, cape, valley, archipelago, national park, nature reserve, peninsula
ROOTS = ("wd:Q473972 wd:Q8502 wd:Q46831 wd:Q23397 wd:Q34038 wd:Q23442 wd:Q4421 "
         "wd:Q40080 wd:Q150784 wd:Q1245089 wd:Q185113 wd:Q39816 wd:Q33837 "
         "wd:Q46169 wd:Q179049 wd:Q34763")

QTMPL = """
SELECT ?f (SAMPLE(?nm) AS ?name) (SAMPLE(?coord) AS ?c) (SAMPLE(?sl) AS ?sitelinks)
       (SAMPLE(?img) AS ?image) (GROUP_CONCAT(DISTINCT ?t31; SEPARATOR="|") AS ?types)
       (SAMPLE(?iucnL) AS ?iucn) (SAMPLE(?inc) AS ?inception) (SAMPLE(?web) AS ?website)
WHERE {
  VALUES ?root { %(ROOTS)s }
  ?f wdt:P31/wdt:P279* ?root ;
     wdt:P17 wd:%(CQ)s ;
     wdt:P18 ?img ;
     wdt:P625 ?coord ;
     wikibase:sitelinks ?sl .
  FILTER(?sl >= 2)
  OPTIONAL { ?f rdfs:label ?nm . FILTER(lang(?nm)="en") }
  OPTIONAL { ?f wdt:P31 ?t31e . ?t31e rdfs:label ?t31 . FILTER(lang(?t31)="en") }
  OPTIONAL { ?f wdt:P814 ?iucnE . ?iucnE rdfs:label ?iucnL . FILTER(lang(?iucnL)="en") }
  OPTIONAL { ?f wdt:P571 ?inc }
  OPTIONAL { ?f wdt:P856 ?web }
}
GROUP BY ?f
LIMIT 30000
"""

def run(slug, cq):
    cache = OUT / f"nature_{slug}.json"
    if cache.exists():
        rows = json.load(open(cache)); print(f"{slug}: cached {len(rows)}"); return rows
    rows = sparql(QTMPL % {"ROOTS": ROOTS, "CQ": cq}, timeout=300)
    out = []
    for r in rows:
        def g(k): return r[k]["value"] if k in r and r[k]["value"] != "" else None
        lat, lon = parse_point(g("c"))
        if lat is None: continue
        inc = g("inception")
        year = None
        if inc:
            m = re.search(r"(-?\d{3,4})-", inc)
            if m: year = int(m.group(1))
        out.append({
            "qid": r["f"]["value"].split("/")[-1], "name": g("name"),
            "lat": lat, "lon": lon, "sitelinks": int(g("sitelinks")) if g("sitelinks") else 0,
            "p18file": filepath_to_name(g("image")), "types": (g("types") or "").lower(),
            "iucn": g("iucn"), "inception": year, "website": g("website"),
            "countrySlug": slug,
        })
    json.dump(out, open(cache, "w"), ensure_ascii=False)
    print(f"{slug}: fetched {len(out)}")
    return out

if __name__ == "__main__":
    only = sys.argv[1] if len(sys.argv) > 1 else None
    tot = 0
    for slug, cq in CQ.items():
        if only and slug != only: continue
        tot += len(run(slug, cq))
    print("TOTAL nature:", tot)
