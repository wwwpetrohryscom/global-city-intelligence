#!/usr/bin/env python3
"""Wave 11 Phase 1: discover candidate cities in the 6 target countries via QLever.
Deterministic; caches raw rows /tmp/w11/raw_<countrySlug>.json (resumable)."""
import sys, json
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
from sparql import sparql, parse_point, filepath_to_name

OUT = Path("/tmp/w11"); OUT.mkdir(parents=True, exist_ok=True)

COUNTRIES = {
    "united-states": ("Q30", 28000),
    "canada":        ("Q16", 14000),
    "australia":     ("Q408", 9000),
    "germany":       ("Q183", 24000),
    "france":        ("Q142", 18000),
    "netherlands":   ("Q55", 16000),
}

QTMPL = """
SELECT ?item (SAMPLE(?name) AS ?nm) (MAX(?pop) AS ?population)
       (SAMPLE(?coord) AS ?c) (SAMPLE(?sl) AS ?sitelinks) (SAMPLE(?img) AS ?image)
       (GROUP_CONCAT(DISTINCT ?p31Label; SEPARATOR="|") AS ?types)
       (SAMPLE(?adminLabel) AS ?admin) (SAMPLE(?adm) AS ?adminQ)
       (SAMPLE(?capOf) AS ?capitalOf)
       (GROUP_CONCAT(DISTINCT ?alias; SEPARATOR="|") AS ?aliases)
WHERE {
  ?item wdt:P31/wdt:P279* wd:Q486972 ;
        wdt:P17 wd:%(CQ)s ;
        wdt:P1082 ?pop ;
        wdt:P625 ?coord ;
        wikibase:sitelinks ?sl .
  FILTER(?pop >= %(TH)d)
  OPTIONAL { ?item wdt:P18 ?img }
  OPTIONAL { ?item wdt:P31 ?p31 . ?p31 rdfs:label ?p31Label . FILTER(lang(?p31Label)="en") }
  OPTIONAL { ?item wdt:P131 ?adm . ?adm rdfs:label ?adminLabel . FILTER(lang(?adminLabel)="en") }
  OPTIONAL { ?item wdt:P1376 ?capOf }
  OPTIONAL { ?item rdfs:label ?name . FILTER(lang(?name)="en") }
  OPTIONAL { ?item skos:altLabel ?alias . FILTER(lang(?alias)="en") }
}
GROUP BY ?item
ORDER BY DESC(?population)
LIMIT 2500
"""

def run_country(slug, cq, th):
    cache = OUT / f"raw_{slug}.json"
    if cache.exists():
        rows = json.load(open(cache)); print(f"{slug}: cached {len(rows)}"); return rows
    rows = sparql(QTMPL % {"CQ": cq, "TH": th}, timeout=300)
    out = []
    for r in rows:
        def g(k):
            return r[k]["value"] if k in r and r[k]["value"] != "" else None
        qid = r["item"]["value"].split("/")[-1]
        lat, lon = parse_point(g("c"))
        img = g("image")
        out.append({
            "qid": qid, "name": g("nm"),
            "population": float(r["population"]["value"]) if "population" in r else None,
            "lat": lat, "lon": lon,
            "sitelinks": int(g("sitelinks")) if g("sitelinks") else 0,
            "hasImage": bool(img),
            "p18file": filepath_to_name(img),
            "types": (g("types") or "").lower(),
            "admin": g("admin"),
            "adminQ": (g("adminQ").split("/")[-1] if g("adminQ") else None),
            "capitalOf": bool(g("capitalOf")),
            "aliases": [a for a in (g("aliases") or "").split("|") if a],
            "countrySlug": slug,
        })
    json.dump(out, open(cache, "w"), ensure_ascii=False)
    print(f"{slug}: fetched {len(out)}")
    return out

if __name__ == "__main__":
    only = sys.argv[1] if len(sys.argv) > 1 else None
    total = 0
    for slug, (cq, th) in COUNTRIES.items():
        if only and slug != only: continue
        total += len(run_country(slug, cq, th))
    print(f"TOTAL raw rows: {total}")
