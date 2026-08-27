#!/usr/bin/env python3
"""V4 Phase 12/13 — forest and waterfall coverage distribution.

Counts, per city, how many VALID candidates exist within the unchanged 300 km
cap: what the corpus already publishes, plus what the harvest could add. This
is what decides whether a low page count is a corpus problem or real sparsity.
"""
import json, math, re, sys, collections, statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "scripts" / "nature-v3"))
from resolve import genuine_nature  # noqa: E402

NC = ROOT / "scripts/nature/cache"
coords = json.load(open(NC / "city-coords.json"))["coords"]
cls = json.load(open(NC / "classification.json"))
places = json.load(open(NC / "places-compact.json"))
MAXKM = 300


def hav(a, b, c, d):
    r = math.radians
    return 2 * 6371 * math.asin(math.sqrt(
        math.sin((r(c) - r(a)) / 2) ** 2 + math.cos(r(a)) * math.cos(r(c)) * math.sin((r(d) - r(b)) / 2) ** 2))


src = (ROOT / "lib/data/cities.ts").read_text()
body = src[src.index("const seeds: CitySeed[] = ["):src.index("export const cities: City[] = seeds.map(buildCity);")]
it = list(re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', body))
country = {}
for i, m in enumerate(it):
    blk = body[m.start(): it[i + 1].start() if i + 1 < len(it) else len(body)]
    g = re.search(r'countrySlug: "([a-z0-9-]+)"', blk)
    country[m.group(1)] = g.group(1) if g else None

for kind, cat in (("forest", "forest"), ("fall", "waterfall")):
    pools = {}
    for f in HERE.glob(f"cache/{kind}_*.json"):
        cs = f.stem[len(kind) + 1:]
        pools[cs] = [x for x in json.load(open(f))
                     if x["name"] and genuine_nature(x["types"], x["name"], x["sitelinks"])]
    have = collections.Counter()
    for p in places:
        c = cls[p["slug"]]
        if c["confidence"] in ("high", "medium") and cat in (c["categories"] or []):
            for x in p["cities"]:
                if x in coords and hav(coords[x]["lat"], coords[x]["lon"], p["lat"], p["lon"]) <= MAXKM:
                    have[x] += 1
    existing_qids = collections.defaultdict(set)
    for p in places:
        for x in p["cities"]:
            existing_qids[x].add(p["qid"])

    potential = collections.Counter()
    for slug, co in coords.items():
        pool = pools.get(country.get(slug) or "", [])
        n = 0
        for f in pool:
            if f["qid"] in existing_qids[slug]:
                continue
            if abs(f["lat"] - co["lat"]) > 3.2 or abs(f["lon"] - co["lon"]) > 4.2:
                continue
            if hav(co["lat"], co["lon"], f["lat"], f["lon"]) <= MAXKM:
                n += 1
        potential[slug] = n

    total = {s: have.get(s, 0) + potential.get(s, 0) for s in coords}
    print(f"\n=== {cat.upper()} coverage distribution (300 km cap) ===")
    print(f"  pool after filters: {sum(len(v) for v in pools.values())}")
    for label, d in (("published today", have), ("published + harvestable", total)):
        vals = [d.get(s, 0) for s in coords]
        buckets = {n: sum(1 for v in vals if v >= n) for n in (1, 2, 3, 4, 5, 10)}
        nz = sorted(v for v in vals if v)
        print(f"  {label}:")
        print(f"    0:{sum(1 for v in vals if v == 0)}  " + "  ".join(f">={n}:{c}" for n, c in buckets.items()))
        if nz:
            print(f"    median(non-zero)={statistics.median(nz):.0f} p75={nz[int(.75*len(nz))]} "
                  f"p90={nz[int(.90*len(nz))]} max={nz[-1]}")
    print(f"  cities that could NEWLY reach >=4: "
          f"{sum(1 for s in coords if have.get(s,0) < 4 <= total[s])}")
