#!/usr/bin/env python3
"""V4 Phase 1/2 — where do forest and waterfall candidates get lost?

Walks every corpus record whose structured types OR name suggest a forest or a
waterfall and reports the stage each one dies at, so the bottleneck is measured
rather than assumed.
"""
import json, re, math, collections
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
NC = ROOT / "scripts/nature/cache"
places = json.load(open(NC / "places-compact.json"))
cls = json.load(open(NC / "classification.json"))
types = json.load(open(NC / "place-types.json"))
coords = json.load(open(NC / "city-coords.json"))["coords"]

MAXKM = 300
PUB = {"high", "medium"}

FOREST_TYPE = re.compile(r"\bforest\b|woodland|\bwood\b|rainforest|taiga|\bgrove\b|\bcopse\b|"
                         r"\bjungle\b|arboret|bosque|\bbos\b|wald\b", re.I)
FOREST_NAME = re.compile(r"\bforest\b|\bwood(s|land)?\b|\bbois\b|\bwald\b|\bbosc|\bbosque\b|"
                         r"\bselva\b|\bforêt\b|\bskog\b|\bles\b|\bpuszcza\b", re.I)
FALL_TYPE = re.compile(r"waterfall|cascade|cataract|\bfalls\b", re.I)
FALL_NAME = re.compile(r"waterfall|\bfalls\b|cascad|cataract|\bcachoeira\b|\bsalto\b|\bcascata\b|"
                       r"\bwasserfall\b|\bvodopad|\bfossen?\b|\bchute[s]?\b", re.I)


def hav(a, b, c, d):
    r = math.radians
    return 2 * 6371 * math.asin(math.sqrt(
        math.sin((r(c) - r(a)) / 2) ** 2 + math.cos(r(a)) * math.cos(r(c)) * math.sin((r(d) - r(b)) / 2) ** 2))


def report(label, type_rx, name_rx, category):
    cand, stage = [], collections.Counter()
    for p in places:
        t = types.get(p["qid"]) or {"p31": {}, "super": {}}
        labels = " | ".join(list(t["p31"].values()) + list(t["super"].values()))
        by_type = bool(type_rx.search(labels))
        by_name = bool(name_rx.search(p["name"] or ""))
        if not (by_type or by_name):
            continue
        c = cls[p["slug"]]
        cand.append(p)
        if not t["p31"]:
            stage["dead/absent QID"] += 1
        elif c["vetoed"]:
            stage[f"vetoed: {c['vetoed'].split(':')[0]}"] += 1
        elif c["confidence"] == "none":
            stage["no publishable structured type"] += 1
        elif c["confidence"] == "low":
            stage["low confidence (withheld)"] += 1
        elif category not in (c["categories"] or []):
            stage[f"classified, but not as {category} (primary {c['primary']})"] += 1
        else:
            far = all(
                (hav(coords[x]["lat"], coords[x]["lon"], p["lat"], p["lon"]) > MAXKM)
                for x in p["cities"] if x in coords
            ) if p["cities"] else True
            stage["beyond 300 km of every connected city" if far else "PUBLISHED as " + category] += 1

    print(f"\n=== {label} ===")
    print(f"  candidates (type or name evidence): {len(cand)}")
    for k, n in stage.most_common():
        print(f"    {n:6d}  {k}")
    # how many cities could reach the >=4 bar today
    per_city = collections.Counter()
    for p in places:
        c = cls[p["slug"]]
        if c["confidence"] in PUB and category in (c["categories"] or []):
            for x in p["cities"]:
                if x in coords and hav(coords[x]["lat"], coords[x]["lon"], p["lat"], p["lon"]) <= MAXKM:
                    per_city[x] += 1
    dist = collections.Counter(per_city.values())
    print(f"  cities with >=1 published {category}: {len(per_city)}")
    for n in (1, 2, 3, 4, 5, 10):
        print(f"    >= {n:2d}: {sum(v for k, v in dist.items() if k >= n)}")
    return cand


report("FOREST", FOREST_TYPE, FOREST_NAME, "forest")
report("WATERFALL", FALL_TYPE, FALL_NAME, "waterfall")
