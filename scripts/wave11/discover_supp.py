#!/usr/bin/env python3
"""Supplementary discovery for FR (commune Q484170) + NL (gemeente Q2039348 + city Q515),
whose settlement classes are not under Q486972. Merges into raw_<country>.json by QID."""
import sys, json
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
from sparql import sparql, parse_point, filepath_to_name

OUT = Path("/tmp/w11")

QTMPL = """
SELECT ?item (SAMPLE(?name) AS ?nm) (MAX(?pop) AS ?population)
       (SAMPLE(?coord) AS ?c) (SAMPLE(?sl) AS ?sitelinks) (SAMPLE(?img) AS ?image)
       (GROUP_CONCAT(DISTINCT ?p31Label; SEPARATOR="|") AS ?types)
       (SAMPLE(?adminLabel) AS ?admin) (SAMPLE(?adm) AS ?adminQ)
       (SAMPLE(?capOf) AS ?capitalOf)
       (GROUP_CONCAT(DISTINCT ?alias; SEPARATOR="|") AS ?aliases)
WHERE {
  %(SEL)s
  ?item wdt:P17 wd:%(CQ)s ;
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

JOBS = {
    "france":      ("Q142", 18000, "?item wdt:P31 wd:Q484170 ."),
    "netherlands": ("Q55", 16000, "VALUES ?cls { wd:Q2039348 wd:Q515 } ?item wdt:P31 ?cls ."),
}

def parse_rows(rows, slug):
    out = []
    for r in rows:
        def g(k): return r[k]["value"] if k in r and r[k]["value"] != "" else None
        qid = r["item"]["value"].split("/")[-1]
        lat, lon = parse_point(g("c")); img = g("image")
        out.append({
            "qid": qid, "name": g("nm"),
            "population": float(r["population"]["value"]) if "population" in r else None,
            "lat": lat, "lon": lon,
            "sitelinks": int(g("sitelinks")) if g("sitelinks") else 0,
            "hasImage": bool(img), "p18file": filepath_to_name(img),
            "types": (g("types") or "").lower(), "admin": g("admin"),
            "adminQ": (g("adminQ").split("/")[-1] if g("adminQ") else None),
            "capitalOf": bool(g("capitalOf")),
            "aliases": [a for a in (g("aliases") or "").split("|") if a],
            "countrySlug": slug,
        })
    return out

for slug, (cq, th, sel) in JOBS.items():
    rows = parse_rows(sparql(QTMPL % {"CQ": cq, "TH": th, "SEL": sel}, timeout=300), slug)
    cache = OUT / f"raw_{slug}.json"
    existing = json.load(open(cache)) if cache.exists() else []
    by = {r["qid"]: r for r in existing}
    added = 0
    for r in rows:
        if r["qid"] not in by:
            by[r["qid"]] = r; added += 1
    merged = sorted(by.values(), key=lambda r: -(r["population"] or 0))
    json.dump(merged, open(cache, "w"), ensure_ascii=False)
    print(f"{slug}: supp fetched {len(rows)}, merged total {len(merged)} (+{added} new QIDs)")
