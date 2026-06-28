#!/usr/bin/env python3
"""Shared SPARQL helper for Wave 11. Primary endpoint: QLever Wikidata mirror
(qlever.dev) — fast, not rate-limited. Falls back to WDQS on failure.
Quirks vs WDQS: P625 returns WKT 'POINT(lon lat)'; P18 returns a
commons Special:FilePath URL; no wikibase:label SERVICE (use rdfs:label)."""
import json, urllib.parse, urllib.request, urllib.error, time, sys, re

UA = "GCI-wave11/1.0 (titan95431@gmail.com) python-urllib"
QLEVER = "https://qlever.dev/api/wikidata"
WDQS = "https://query.wikidata.org/sparql"

PREFIXES = """PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
"""

def _qlever(query, timeout):
    body = (PREFIXES + query).encode("utf-8")
    req = urllib.request.Request(QLEVER, data=body, headers={
        "User-Agent": UA, "Accept": "application/sparql-results+json",
        "Content-Type": "application/sparql-query"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())["results"]["bindings"]

def sparql(query, retries=5, timeout=180):
    last = None
    for attempt in range(retries):
        try:
            return _qlever(query, timeout)
        except Exception as e:
            last = e
            sys.stderr.write(f"  qlever retry {attempt+1}: {e}\n")
            time.sleep(4 + attempt * 4)
    raise RuntimeError(f"SPARQL (qlever) failed after {retries}: {last}")

def parse_point(wkt):
    """'POINT(lon lat)' -> (lat, lon)."""
    if not wkt:
        return None, None
    m = re.search(r"POINT\(([-\d.eE]+)\s+([-\d.eE]+)\)", wkt)
    if not m:
        return None, None
    return float(m.group(2)), float(m.group(1))

def filepath_to_name(url):
    """commons Special:FilePath/<name> -> decoded filename."""
    if not url:
        return None
    m = re.search(r"Special:FilePath/(.+)$", url)
    if not m:
        return None
    return urllib.parse.unquote(m.group(1)).replace("_", " ")

if __name__ == "__main__":
    print("ok", sparql("SELECT ?x WHERE { BIND(1 AS ?x) }"))
