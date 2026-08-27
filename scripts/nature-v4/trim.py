#!/usr/bin/env python3
"""V4 — trim each city to the publication bar plus one spare.

Measured: the dedicated-page count is identical whether a city is topped up to
4, 5 or 6 entities, because the bar is 4 and everything beyond it is an extra
card, not an extra page. Topping up to 6 would have added 2,850 corpus records
and zero pages. Five is bar + 1: enough that a page survives one entity later
failing classification, and nothing beyond that.
"""
import json, math, collections
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
NC = ROOT / "scripts/nature/cache"
HERE = Path(__file__).resolve().parent
TARGET = 5

coords = json.load(open(NC / "city-coords.json"))["coords"]
cls = json.load(open(NC / "classification.json"))
places = json.load(open(NC / "places-compact.json"))
resolved = json.load(open(HERE / "cache" / "resolved.json"))


def hav(a, b, c, d):
    r = math.radians
    return 2 * 6371 * math.asin(math.sqrt(
        math.sin((r(c) - r(a)) / 2) ** 2 + math.cos(r(a)) * math.cos(r(c)) * math.sin((r(d) - r(b)) / 2) ** 2))


have = {"forest": collections.Counter(), "waterfall": collections.Counter()}
for p in places:
    c = cls[p["slug"]]
    if c["confidence"] not in ("high", "medium"):
        continue
    for cat in ("forest", "waterfall"):
        if cat in (c["categories"] or []):
            for x in p["cities"]:
                if x in coords and hav(coords[x]["lat"], coords[x]["lon"], p["lat"], p["lon"]) <= 300:
                    have[cat][x] += 1

CAT = {"forest": "forest", "fall": "waterfall"}
before = sum(len(v) for v in resolved.values())
out = {}
for key, recs in resolved.items():
    kind, city = key.split("|", 1)
    need = max(0, TARGET - have[CAT[kind]].get(city, 0))
    out[key] = recs[:need]          # already sorted nearest-first
after = sum(len(v) for v in out.values())
json.dump(out, open(HERE / "cache" / "resolved-trimmed.json", "w"))
print(f"trimmed {before} -> {after} records (target {TARGET}/city, dropped {before - after})")
