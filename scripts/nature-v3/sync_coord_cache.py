#!/usr/bin/env python3
"""Rebuild scripts/nature/cache/city-coords.json from the committed
lib/data/city-coordinates.ts, which is the source of truth for city position.
Keeps the cache and the shipped file from drifting apart."""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
src = (ROOT / "lib/data/city-coordinates.ts").read_text()
coords = {}
for m in re.finditer(r'^\s*\["([a-z0-9-]+)", (-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?), (?:"(Q\d+)"|undefined)\],$', src, re.M):
    # Preserve int-vs-float exactly as written so re-emitting the file is a
    # no-op instead of a 5-row cosmetic diff.
    lit = lambda t: int(t) if "." not in t else float(t)
    coords[m.group(1)] = {"lat": lit(m.group(2)), "lon": lit(m.group(3)), "qid": m.group(4),
                          "witness": "published", "identity": "published",
                          "worstPlaceKm": None, "medianPlaceKm": None, "places": 0,
                          "graphMedianErrorKm": None}
out = ROOT / "scripts/nature/cache/city-coords.json"
prev = json.load(open(out)) if out.exists() else {}
json.dump({"coords": coords, "dropped": {}, "graphConflicts": prev.get("graphConflicts", {}),
           "sparse": prev.get("sparse", {})}, open(out, "w"))
print(f"synced {len(coords)} coordinates from lib/data/city-coordinates.ts")
