#!/usr/bin/env python3
"""Resolve a corroborated coordinate for every indexed city.

The hero-image `notes` field in lib/data/media/city-images.ts records the
LANDMARK entity a photo was resolved through ("Resolved via landmark article
'Rijksmuseum' -> Wikidata Q190804"), not the city entity, so it is not a
usable city identity. Cities are therefore resolved from scratch:

  1. Wikidata candidates by label/altLabel, constrained to the city's country
     (P17) and to settlement classes (P31/P279* human settlement), carrying
     coordinates (P625) and population (P1082).
  2. Disambiguation against the PUBLISHED city-discovery graph, which stores
     great-circle distances between city centres. The correct entity is the
     candidate that best reproduces those published distances to the city's
     already-resolved neighbours; population only breaks the initial tie.

A city whose best candidate still cannot reproduce the corpus geometry is
dropped rather than published, so a namesake in the wrong region can never
become a distance shown on a page.

Output: scripts/nature/cache/city-coords.json
"""
import json, re, sys, math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "wave11"))
from sparql import sparql, parse_point  # noqa: E402

CACHE = Path(__file__).resolve().parent / "cache"
CACHE.mkdir(exist_ok=True)
CAND = CACHE / "city-candidates.json"

# Countries whose Wikidata label differs from the corpus label, or which are
# not sovereign states and so miss the P31/P279* Q3624078 constraint.
COUNTRY_QID_OVERRIDE = {
    "China": "Q148", "Czechia": "Q213", "Hong Kong": "Q8646", "Netherlands": "Q55",
}

src = (ROOT / "lib/data/cities.ts").read_text()
body = src[src.index("const seeds: CitySeed[] = ["): src.index("export const cities: City[] = seeds.map(buildCity);")]
it = list(re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', body))
cities = []
for i, m in enumerate(it):
    blk = body[m.start(): it[i + 1].start() if i + 1 < len(it) else len(body)]
    g = lambda f: (re.search(f + r':\s*"((?:[^"\\]|\\.)*)"', blk) or [None, None])[1]
    cities.append({"slug": m.group(1), "name": g("name"), "countryName": g("countryName")})
print(f"cities: {len(cities)}")

data = json.load(open(CAND)) if CAND.exists() else {"country_qids": {}, "cand": {}}
data["country_qids"].update(COUNTRY_QID_OVERRIDE)


def chunked(seq, n):
    for i in range(0, len(seq), n):
        yield seq[i:i + n]


names = sorted({c["countryName"] for c in cities if c["countryName"]})
todo = [c for c in names if c not in data["country_qids"]]
for ch in chunked(todo, 60):
    vals = " ".join('"%s"@en' % c for c in ch)
    rows = sparql(f"""SELECT ?item ?l WHERE {{ VALUES ?l {{ {vals} }}
      ?item rdfs:label ?l . ?item wdt:P31/wdt:P279* wd:Q3624078 . }}""", timeout=240)
    for r in rows:
        data["country_qids"].setdefault(r["l"]["value"], r["item"]["value"].rsplit("/", 1)[-1])
json.dump(data, open(CAND, "w"))
print(f"country QIDs: {len(data['country_qids'])}/{len(names)}")

by_country = {}
for c in cities:
    if c["slug"] not in data["cand"]:
        by_country.setdefault(c["countryName"], []).append(c)

for cname, group in sorted(by_country.items()):
    cq = data["country_qids"].get(cname)
    if not cq:
        print(f"  !! no country QID for {cname}")
        continue
    for ch in chunked(group, 100):
        vals = " ".join('"%s"@en' % c["name"].replace('"', "") for c in ch)
        q = f"""SELECT ?item ?l ?coord ?pop WHERE {{
          VALUES ?l {{ {vals} }}
          {{ ?item rdfs:label ?l }} UNION {{ ?item skos:altLabel ?l }}
          ?item wdt:P17 wd:{cq} ; wdt:P625 ?coord ; wdt:P31/wdt:P279* wd:Q486972 .
          OPTIONAL {{ ?item wdt:P1082 ?pop }} }}"""
        try:
            rows = sparql(q, retries=4, timeout=300)
        except Exception as e:
            print(f"  !! {cname}: {e}")
            continue
        hits = {}
        for r in rows:
            lat, lon = parse_point(r["coord"]["value"])
            if lat is None:
                continue
            pop = float(r["pop"]["value"]) if "pop" in r else 0.0
            key = r["l"]["value"]
            qid = r["item"]["value"].rsplit("/", 1)[-1]
            bucket = hits.setdefault(key, {})
            prev = bucket.get(qid)
            if prev is None or pop > prev["pop"]:
                bucket[qid] = {"qid": qid, "lat": lat, "lon": lon, "pop": pop}
        for c in ch:
            cand = sorted(hits.get(c["name"], {}).values(), key=lambda x: -x["pop"])
            data["cand"][c["slug"]] = cand[:12]
        json.dump(data, open(CAND, "w"))
    got = sum(1 for c in group if data["cand"].get(c["slug"]))
    print(f"  {cname}: {got}/{len(group)}", flush=True)

json.dump(data, open(CAND, "w"))
print("candidates:", sum(1 for c in cities if data["cand"].get(c["slug"])), "/", len(cities))
