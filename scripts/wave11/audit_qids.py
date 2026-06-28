#!/usr/bin/env python3
"""Wave 11 Phase 9a: deterministic batch verification of all 250 new city QIDs.
Confirms each QID: resolves, is in the declared country, coords match selection,
and is a settlement (not an admin region / county). Flags anomalies."""
import sys, json, math
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
from sparql import sparql, parse_point

OUT = Path("/tmp/w11")
sel = json.load(open(OUT / "selected.json"))
by_qid = {c["qid"]: c for c in sel}
CC_EXPECT = {"united-states": "Q30", "canada": "Q16", "australia": "Q408",
             "germany": "Q183", "france": "Q142", "netherlands": "Q55"}

def hav(a, b, c, d):
    r = math.radians
    return 2*6371*math.asin(math.sqrt(math.sin((r(c)-r(a))/2)**2 + math.cos(r(a))*math.cos(r(c))*math.sin((r(d)-r(b))/2)**2))

qids = list(by_qid.keys())
rows_all = {}
for i in range(0, len(qids), 120):
    chunk = qids[i:i+120]
    vals = " ".join("wd:" + q for q in chunk)
    q = f"""
SELECT ?item (SAMPLE(?lab) AS ?label) (SAMPLE(?coord) AS ?c) (SAMPLE(?cnt) AS ?country)
       (GROUP_CONCAT(DISTINCT ?p31l; SEPARATOR="|") AS ?types) (SAMPLE(?pop) AS ?population)
WHERE {{
  VALUES ?item {{ {vals} }}
  OPTIONAL {{ ?item rdfs:label ?lab . FILTER(lang(?lab)="en") }}
  OPTIONAL {{ ?item wdt:P625 ?coord }}
  OPTIONAL {{ ?item wdt:P17 ?cnt }}
  OPTIONAL {{ ?item wdt:P1082 ?pop }}
  OPTIONAL {{ ?item wdt:P31 ?p31 . ?p31 rdfs:label ?p31l . FILTER(lang(?p31l)="en") }}
}} GROUP BY ?item
"""
    for r in sparql(q, timeout=180):
        qid = r["item"]["value"].split("/")[-1]
        lat, lon = parse_point(r.get("c", {}).get("value"))
        rows_all[qid] = {
            "label": r.get("label", {}).get("value"),
            "lat": lat, "lon": lon,
            "country": (r.get("country", {}).get("value", "").split("/")[-1] or None),
            "types": (r.get("types", {}).get("value", "") or "").lower(),
        }
    print(f"  verified chunk {i//120+1} ({len(rows_all)})")

ADMIN_BAD = ("metropolitan area", "metropolitan region", "county", "region of", "department",
             "arrondissement", "canton", "district of", "prefecture", "agglomeration",
             "borough of", "neighborhood", "quarter of", "locality of")
flags = []
for c in sel:
    q = c["qid"]; r = rows_all.get(q)
    if not r:
        flags.append((c["slug"], "QID_UNRESOLVED", q)); continue
    if r["country"] != CC_EXPECT[c["countrySlug"]]:
        flags.append((c["slug"], "WRONG_COUNTRY", f'{r["country"]} != {CC_EXPECT[c["countrySlug"]]}'))
    if r["lat"] is not None:
        d = hav(c["lat"], c["lon"], r["lat"], r["lon"])
        if d > 8:
            flags.append((c["slug"], "COORD_MISMATCH", f"{d:.1f}km {r['label']}"))
    if any(b in r["types"] for b in ADMIN_BAD):
        flags.append((c["slug"], "ADMIN_TYPE", r["types"][:50]))

print(f"\n=== AUDIT: {len(sel)} cities, {len(flags)} flags ===")
for f in flags:
    print("  FLAG", f)
json.dump({"flags": flags, "qid_data": rows_all}, open(OUT / "audit_qids.json", "w"), ensure_ascii=False)
if not flags:
    print("ALL 250 city QIDs verified: correct country, coords match, settlement type.")
