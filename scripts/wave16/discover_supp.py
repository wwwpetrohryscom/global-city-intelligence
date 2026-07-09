#!/usr/bin/env python3
"""Wave 16 supplement: national municipality/urban-area classes for SE/NO/DK/FI/RO/HR/SK
that are NOT subclasses of human-settlement Q486972, so the main discover.py Q486972
query misses them. Query each class directly and merge into raw_<country>.json (dedup
by QID)."""
import sys, json
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
from sparql import sparql, parse_point, filepath_to_name

OUT = Path("/tmp/w16")
# country slug -> (country QID, [class QIDs], pop threshold)
SUPP = {
    "sweden":   ("Q34",  ["Q12813115", "Q127448"], 6000),   # urban area (tätort) + municipality (kommun)
    "norway":   ("Q20",  ["Q755707"],              4000),   # municipality of Norway (kommune)
    "denmark":  ("Q35",  ["Q2616791"],             7000),   # municipality of Denmark (kommune)
    "finland":  ("Q33",  ["Q856076"],              6000),   # municipality of Finland (kunta)
    "romania":  ("Q218", ["Q16858213", "Q659103"], 12000),  # municipiu + oraș (town)
    "croatia":  ("Q224", ["Q1637706"],             5000),   # city/town of Croatia (grad)
    "slovakia": ("Q214", ["Q15649576", "Q160091"], 6000),   # town of Slovakia (mesto)
}

QTMPL = """
SELECT ?item (SAMPLE(?name) AS ?nm) (MAX(?pop) AS ?population) (SAMPLE(?coord) AS ?c)
       (SAMPLE(?sl) AS ?sitelinks) (SAMPLE(?img) AS ?image)
       (GROUP_CONCAT(DISTINCT ?p31Label; SEPARATOR="|") AS ?types)
       (SAMPLE(?adminLabel) AS ?admin) (SAMPLE(?adm) AS ?adminQ)
       (SAMPLE(?capOf) AS ?capitalOf) (GROUP_CONCAT(DISTINCT ?alias; SEPARATOR="|") AS ?aliases)
WHERE {
  VALUES ?cls { %(CLS)s }
  ?item wdt:P31 ?cls ; wdt:P17 wd:%(CQ)s ; wdt:P1082 ?pop ; wdt:P625 ?coord ; wikibase:sitelinks ?sl .
  FILTER(?pop >= %(TH)d)
  OPTIONAL { ?item wdt:P18 ?img }
  OPTIONAL { ?item wdt:P31 ?p31 . ?p31 rdfs:label ?p31Label . FILTER(lang(?p31Label)="en") }
  OPTIONAL { ?item wdt:P131 ?adm . ?adm rdfs:label ?adminLabel . FILTER(lang(?adminLabel)="en") }
  OPTIONAL { ?item wdt:P1376 ?capOf }
  OPTIONAL { ?item rdfs:label ?name . FILTER(lang(?name)="en") }
  OPTIONAL { ?item skos:altLabel ?alias . FILTER(lang(?alias)="en") }
} GROUP BY ?item ORDER BY DESC(?population) LIMIT 4000
"""

def run(slug, cq, classes, th):
    rows = sparql(QTMPL % {"CLS": " ".join("wd:" + c for c in classes), "CQ": cq, "TH": th}, timeout=300)
    out = []
    for r in rows:
        def g(k): return r[k]["value"] if k in r and r[k]["value"] != "" else None
        lat, lon = parse_point(g("c")); img = g("image")
        out.append({"qid": r["item"]["value"].split("/")[-1], "name": g("nm"),
            "population": float(r["population"]["value"]) if "population" in r else None,
            "lat": lat, "lon": lon, "sitelinks": int(g("sitelinks")) if g("sitelinks") else 0,
            "hasImage": bool(img), "p18file": filepath_to_name(img), "types": (g("types") or "").lower(),
            "admin": g("admin"), "adminQ": (g("adminQ").split("/")[-1] if g("adminQ") else None),
            "capitalOf": bool(g("capitalOf")), "aliases": [a for a in (g("aliases") or "").split("|") if a],
            "countrySlug": slug})
    cache = OUT / f"raw_{slug}.json"
    existing = json.load(open(cache)) if cache.exists() else []
    by = {r["qid"]: r for r in existing}; added = 0
    for r in out:
        if r["qid"] not in by:
            by[r["qid"]] = r; added += 1
    merged = sorted(by.values(), key=lambda r: -(r["population"] or 0))
    json.dump(merged, open(cache, "w"), ensure_ascii=False)
    print(f"{slug}: supp {len(out)}, merged {len(merged)} (+{added})")

if __name__ == "__main__":
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for slug, (cq, classes, th) in SUPP.items():
        if only and slug != only: continue
        try:
            run(slug, cq, classes, th)
        except Exception as e:
            print(f"{slug}: ERROR {e}")
