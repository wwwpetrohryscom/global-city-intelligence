#!/usr/bin/env python3
"""Test discovery SPARQL on Germany to validate shape + timeouts."""
import sys
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
from sparql import sparql

# Germany Q183, settlements pop>=40000, with coords. Aggregate sitelinks + image flag + P31 + admin parent.
Q = """
SELECT ?item ?itemLabel ?pop ?lat ?lon ?sitelinks
       (SAMPLE(?img) AS ?image) (GROUP_CONCAT(DISTINCT ?p31Label; separator="|") AS ?types)
       (SAMPLE(?adminLabel) AS ?admin) (SAMPLE(?capOf) AS ?capitalOf)
WHERE {
  ?item wdt:P31/wdt:P279* wd:Q486972 ;
        wdt:P17 wd:Q183 ;
        wdt:P1082 ?pop ;
        wdt:P625 ?coord ;
        wikibase:sitelinks ?sitelinks .
  FILTER(?pop >= 40000)
  BIND(geof:latitude(?coord) AS ?lat)
  BIND(geof:longitude(?coord) AS ?lon)
  OPTIONAL { ?item wdt:P18 ?img }
  OPTIONAL { ?item wdt:P31 ?p31 . ?p31 rdfs:label ?p31Label . FILTER(lang(?p31Label)="en") }
  OPTIONAL { ?item wdt:P131 ?adm . ?adm rdfs:label ?adminLabel . FILTER(lang(?adminLabel)="en") }
  OPTIONAL { ?item wdt:P1376 ?capOf }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
GROUP BY ?item ?itemLabel ?pop ?lat ?lon ?sitelinks
ORDER BY DESC(?pop)
LIMIT 20
"""
rows = sparql(Q)
print("rows:", len(rows))
for r in rows[:20]:
    qid = r["item"]["value"].split("/")[-1]
    print(f"{qid:9s} {r['itemLabel']['value']:22s} pop={int(float(r['pop']['value'])):>9d} "
          f"sl={r['sitelinks']['value']:>3s} img={'Y' if 'image' in r else '-'} "
          f"cap={'Y' if 'capitalOf' in r else '-'} types={r.get('types',{}).get('value','')[:40]}")
