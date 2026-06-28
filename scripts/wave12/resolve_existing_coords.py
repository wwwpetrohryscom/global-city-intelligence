#!/usr/bin/env python3
"""Resolve coords (P625) for all existing-city QIDs via QLever (chunked).
Writes /tmp/w12/all_city_coords.json {slug:[lat,lon]} = existing(by QID) + new(from selected)."""
import sys, json
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
from sparql import sparql, parse_point

OUT = Path("/tmp/w12")
qid_by_slug = json.load(open(OUT / "existing_qids.json"))  # slug -> QID (1826)
selected = json.load(open(OUT / "selected.json"))

slug_by_qid = {q: s for s, q in qid_by_slug.items()}
qids = list(slug_by_qid.keys())
coords = {}
CHUNK = 500
for i in range(0, len(qids), CHUNK):
    chunk = qids[i:i+CHUNK]
    vals = " ".join("wd:" + q for q in chunk)
    q = f"""SELECT ?item (SAMPLE(?c) AS ?coord) WHERE {{
      VALUES ?item {{ {vals} }} ?item wdt:P625 ?c . }} GROUP BY ?item"""
    rows = sparql(q, timeout=180)
    for r in rows:
        qid = r["item"]["value"].split("/")[-1]
        lat, lon = parse_point(r["coord"]["value"])
        if lat is not None and qid in slug_by_qid:
            coords[slug_by_qid[qid]] = [round(lat, 5), round(lon, 5)]
    print(f"  chunk {i//CHUNK+1}: total coords {len(coords)}")

# add new cities
for c in selected:
    coords[c["slug"]] = [round(c["lat"], 5), round(c["lon"], 5)]

json.dump(coords, open(OUT / "all_city_coords.json", "w"))
print(f"existing with coords: {len(coords)-len(selected)}/{len(qid_by_slug)}; +{len(selected)} new; total {len(coords)}")
