#!/usr/bin/env python3
"""Phase 1 — what reachability inputs already exist?

The point is to avoid building anything the corpus already has. Reports what is
available for nearby cities, nature places, urban destinations, cross-border
links and the existing distance vocabulary.
"""
import json, math, re, collections, statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "lib/data"


def hav(a, b, c, d):
    r = math.radians
    return 2 * 6371 * math.asin(math.sqrt(
        math.sin((r(c) - r(a)) / 2) ** 2 + math.cos(r(a)) * math.cos(r(c)) * math.sin((r(d) - r(b)) / 2) ** 2))


coords = {}
for m in re.finditer(r'^\s*\["([a-z0-9-]+)", (-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?),',
                     (DATA / "city-coordinates.ts").read_text(), re.M):
    coords[m.group(1)] = (float(m.group(2)), float(m.group(3)))

src = (DATA / "cities.ts").read_text()
body = src[src.index("const seeds: CitySeed[] = ["):src.index("export const cities: City[] = seeds.map(buildCity);")]
it = list(re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', body))
country, popn = {}, {}
for i, m in enumerate(it):
    blk = body[m.start(): it[i + 1].start() if i + 1 < len(it) else len(body)]
    g = re.search(r'countrySlug: "([a-z0-9-]+)"', blk)
    p = re.search(r'population: "([^"]*)"', blk)
    country[m.group(1)] = g.group(1) if g else None
    popn[m.group(1)] = p.group(1) if p else None

print(f"A. CITY COORDINATES        : {len(coords)} cities, all with a corroborated point")

# existing city-to-city graph
graph = (DATA / "city-discovery-graph.ts").read_text()
nodes = re.findall(r'^  "([a-z0-9-]+)": \[', graph, re.M)
edges = re.findall(r'citySlug: "([a-z0-9-]+)", distanceKm: (\d+(?:\.\d+)?), relationshipType: "([a-z_]+)"', graph)
print(f"B. CITY DISCOVERY GRAPH    : {len(nodes)} nodes, {len(edges)} edges")
d = sorted(float(e[1]) for e in edges)
print(f"   edge distance km        : p50={statistics.median(d):.0f} p90={d[int(.9*len(d))]:.0f} max={d[-1]:.0f}")
print(f"   relationship types      : {dict(collections.Counter(e[2] for e in edges).most_common())}")
per = collections.Counter()
cur = None
for line in graph.split("\n"):
    h = re.match(r'^  "([a-z0-9-]+)": \[', line)
    if h:
        cur = h.group(1)
    elif cur and "citySlug:" in line:
        per[cur] += 1
v = sorted(per.values())
print(f"   edges per city          : min={v[0]} p50={statistics.median(v):.0f} max={v[-1]}  (cities with none: {len(coords)-len(per)})")

# cross-border already present?
xb = 0
for cur_slug, n in per.items():
    pass
cur = None
cross = collections.Counter()
for line in graph.split("\n"):
    h = re.match(r'^  "([a-z0-9-]+)": \[', line)
    if h:
        cur = h.group(1)
        continue
    m = re.search(r'citySlug: "([a-z0-9-]+)"', line)
    if m and cur and country.get(cur) and country.get(m.group(1)) and country[cur] != country[m.group(1)]:
        cross[cur] += 1
print(f"C. CROSS-BORDER CITY EDGES : {sum(cross.values())} edges across {len(cross)} cities")

# nature / nearby corpus
nearby = (DATA / "nearby-places.ts").read_text()
recs = re.findall(r'^ {4}slug: "([a-z0-9-]+)",$', nearby, re.M)
print(f"D. NEARBY PLACE RECORDS    : {len(recs)}")
cls = json.load(open(ROOT / "scripts/nature/cache/classification.json"))
pub = sum(1 for v in cls.values() if v["primary"] and v["confidence"] in ("high", "medium"))
print(f"E. CLASSIFIED NATURE PLACES: {pub} publishable")

# existing distance vocabulary
bands = collections.Counter(re.findall(r'distanceBand: "([a-z_]+)"', nearby))
print(f"F. EXISTING distanceBand   : {dict(bands)}")
dist = ROOT / "lib/nature/distance.ts"
print(f"G. NATURE BAND THRESHOLDS  : " +
      re.search(r'nearby: (\d+),\s*\n\s*"day-trip": (\d+)', dist.read_text()).group(0).replace("\n", " ").replace("  ", " "))

# page families that could host enrichment
for page in ("nearby-weekend-places", "weekend-trip", "nature"):
    n = len(re.findall(r'^  "([a-z0-9-]+)"', "", re.M))
print(f"H. WEEKEND-TRIP PAGES      : {len(re.findall(r'citySlug: \"[a-z0-9-]+\"', (DATA / 'weekend-trip.ts').read_text()))}")
