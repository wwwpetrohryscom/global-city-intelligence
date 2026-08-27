#!/usr/bin/env python3
"""City identity collision audit — the whole 4,444-city corpus.

Never merges on a name match. A candidate is raised when several independent
signals agree, and each candidate is classified rather than acted on:

  A TRUE DUPLICATE            same real city recorded twice
  B SAME NAME, DIFFERENT CITY must stay separate
  C MUNICIPALITY VS CITY      product/semantic decision
  D METRO/ADMIN VS CITY       identity decision
  E INSUFFICIENT EVIDENCE     never merge
"""
import json, math, re, unicodedata, collections
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent / "cache"
OUT.mkdir(exist_ok=True)

NEAR_KM = 12.0        # candidate radius; a real twin sits far inside this
EXACT_KM = 0.05

src = (ROOT / "lib/data/cities.ts").read_text()
body = src[src.index("const seeds: CitySeed[] = ["):src.index("export const cities: City[] = seeds.map(buildCity);")]
it = list(re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', body))
cities = {}
for i, m in enumerate(it):
    blk = body[m.start(): it[i + 1].start() if i + 1 < len(it) else len(body)]
    g = lambda f: (re.search(f + r':\s*"((?:[^"\\]|\\.)*)"', blk) or [None, None])[1]
    cities[m.group(1)] = {"slug": m.group(1), "name": g("name"), "country": g("countrySlug"),
                          "countryName": g("countryName"), "region": g("region"),
                          "population": g("population")}

coords = {}
for m in re.finditer(r'^\s*\["([a-z0-9-]+)", (-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?), (?:"(Q\d+)"|undefined)\],$',
                     (ROOT / "lib/data/city-coordinates.ts").read_text(), re.M):
    coords[m.group(1)] = {"lat": float(m.group(2)), "lon": float(m.group(3)), "qid": m.group(4)}


def hav(a, b, c, d):
    r = math.radians
    return 2 * 6371 * math.asin(math.sqrt(
        math.sin((r(c) - r(a)) / 2) ** 2 + math.cos(r(a)) * math.cos(r(c)) * math.sin((r(d) - r(b)) / 2) ** 2))


def norm(name):
    s = unicodedata.normalize("NFKD", (name or "")).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "", s)


SUFFIX = re.compile(r"-(municipality|city|gr|us|uk|ca|au|br|de|fr|it|es|pl|nl|se|no|fi|dk|cz|py|mx|za|jp|kr|cn|in|tr|ru|ua|ar|cl|co|pe)$")


def slug_base(slug):
    return SUFFIX.sub("", slug)


# ---- candidate generation: several independent signals ----------------------
by_qid = collections.defaultdict(list)
for s, c in coords.items():
    if c["qid"]:
        by_qid[c["qid"]].append(s)

pairs = {}


def add(a, b, signal):
    key = tuple(sorted((a, b)))
    pairs.setdefault(key, set()).add(signal)


for qid, slugs in by_qid.items():
    if len(slugs) > 1:
        for i in range(len(slugs)):
            for j in range(i + 1, len(slugs)):
                add(slugs[i], slugs[j], "same-qid")

# spatial bucket so the sweep is O(n) not O(n^2)
buckets = collections.defaultdict(list)
for s, c in coords.items():
    buckets[(round(c["lat"] * 4), round(c["lon"] * 4))].append(s)
for (la, lo), members in buckets.items():
    near = []
    for dla in (-1, 0, 1):
        for dlo in (-1, 0, 1):
            near += buckets.get((la + dla, lo + dlo), [])
    for a in members:
        for b in near:
            if a >= b:
                continue
            km = hav(coords[a]["lat"], coords[a]["lon"], coords[b]["lat"], coords[b]["lon"])
            if km <= EXACT_KM:
                add(a, b, "identical-coordinates")
            elif km <= NEAR_KM:
                add(a, b, "coordinates-within-%dkm" % NEAR_KM)

by_namecountry = collections.defaultdict(list)
for s, c in cities.items():
    by_namecountry[(norm(c["name"]), c["country"])].append(s)
for k, slugs in by_namecountry.items():
    if len(slugs) > 1:
        for i in range(len(slugs)):
            for j in range(i + 1, len(slugs)):
                add(slugs[i], slugs[j], "same-normalised-name+country")

by_base = collections.defaultdict(list)
for s in cities:
    by_base[slug_base(s)].append(s)
for base, slugs in by_base.items():
    if len(slugs) > 1:
        for i in range(len(slugs)):
            for j in range(i + 1, len(slugs)):
                add(slugs[i], slugs[j], "slug-differs-only-by-suffix")

# ---- classification ---------------------------------------------------------
rows = []
for (a, b), signals in pairs.items():
    ca, cb = cities.get(a), cities.get(b)
    if not ca or not cb:
        continue
    km = (hav(coords[a]["lat"], coords[a]["lon"], coords[b]["lat"], coords[b]["lon"])
          if a in coords and b in coords else None)
    same_country = ca["country"] == cb["country"]
    same_name = norm(ca["name"]) == norm(cb["name"])
    qa, qb = coords.get(a, {}).get("qid"), coords.get(b, {}).get("qid")
    same_qid = bool(qa and qa == qb)
    muni = bool(re.search(r"-municipality$", a) or re.search(r"-municipality$", b))

    if not same_country:
        cls = "B. SAME NAME, DIFFERENT CITY (different country)"
    elif muni and same_name:
        cls = "C. MUNICIPALITY VS CITY PROPER"
    elif same_qid:
        cls = "A. TRUE DUPLICATE (same Wikidata entity)"
    elif same_name and km is not None and km <= 2.0:
        cls = "A. TRUE DUPLICATE (same name, same country, same point)"
    elif same_name and km is not None and km <= NEAR_KM:
        cls = "D. SAME NAME, ADJACENT ENTITIES — needs identity evidence"
    elif km is not None and km <= EXACT_KM:
        cls = "D. IDENTICAL POINT, DIFFERENT NAME — needs identity evidence"
    else:
        cls = "E. INSUFFICIENT EVIDENCE"
    rows.append({"a": a, "b": b, "country": ca["country"] if same_country else f"{ca['country']}/{cb['country']}",
                 "nameA": ca["name"], "nameB": cb["name"], "km": round(km, 3) if km is not None else None,
                 "sameName": same_name, "qidA": qa, "qidB": qb, "sameQid": same_qid,
                 "signals": sorted(signals), "classification": cls})

rows.sort(key=lambda r: (r["classification"], r["km"] if r["km"] is not None else 9e9))
json.dump(rows, open(OUT / "collisions.json", "w"), indent=1)

print(f"cities audited: {len(cities)}; coordinates: {len(coords)}")
print(f"collision candidates: {len(rows)}\n")
for cls, n in collections.Counter(r["classification"] for r in rows).most_common():
    print(f"  {n:5d}  {cls}")
print("\n--- candidates needing a decision (A / C / D) ---")
for r in rows:
    if r["classification"].startswith(("A.", "C.", "D.")):
        print(f"  [{r['classification'][:2]}] {r['a']:26s} {r['b']:28s} {str(r['km']):>8s} km  "
              f"{r['nameA']} / {r['nameB']}  qid {r['qidA']} / {r['qidB']}")
        print(f"        signals: {', '.join(r['signals'])}")
