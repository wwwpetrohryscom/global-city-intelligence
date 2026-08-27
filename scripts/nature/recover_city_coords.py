#!/usr/bin/env python3
"""Recovery pass for cities the settlement-constrained lookup missed.

Drops the P31/P279* settlement constraint (some corpus cities are boroughs,
metropolitan municipalities, or special administrative entities) and widens
the label net to name variants. Candidate identity is still decided by
graph-fit in verify_city_coords.py, which is what makes the wider net safe.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "wave11"))
from sparql import sparql, parse_point  # noqa: E402

CACHE = Path(__file__).resolve().parent / "cache"
data = json.load(open(CACHE / "city-candidates.json"))
missing = set(json.load(open(CACHE / "city-coords.json"))["missing"])

src = (ROOT / "lib/data/cities.ts").read_text()
body = src[src.index("const seeds: CitySeed[] = ["): src.index("export const cities: City[] = seeds.map(buildCity);")]
it = list(re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', body))
cities = {}
for i, m in enumerate(it):
    blk = body[m.start(): it[i + 1].start() if i + 1 < len(it) else len(body)]
    g = lambda f: (re.search(f + r':\s*"((?:[^"\\]|\\.)*)"', blk) or [None, None])[1]
    cities[m.group(1)] = {"slug": m.group(1), "name": g("name"), "countryName": g("countryName")}

targets = [cities[s] for s in sorted(missing) if s in cities]
print(f"recovering {len(targets)} cities")

by_country = {}
for c in targets:
    by_country.setdefault(c["countryName"], []).append(c)


def variants(name):
    out = {name, f"{name} City"}
    if name.endswith(" City"):
        out.add(name[:-5])
    out.add(re.sub(r"\s*\(.*\)$", "", name).strip())
    return {v for v in out if v}


added = 0
for cname, group in sorted(by_country.items()):
    cq = data["country_qids"].get(cname)
    if not cq:
        print(f"  !! no country QID for {cname}")
        continue
    for i in range(0, len(group), 60):
        ch = group[i:i + 60]
        allv = sorted({v for c in ch for v in variants(c["name"])})
        vals = " ".join('"%s"@en' % v.replace('"', "") for v in allv)
        q = f"""SELECT ?item ?l ?coord ?pop WHERE {{
          VALUES ?l {{ {vals} }}
          {{ ?item rdfs:label ?l }} UNION {{ ?item skos:altLabel ?l }}
          ?item wdt:P17 wd:{cq} ; wdt:P625 ?coord .
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
            qid = r["item"]["value"].rsplit("/", 1)[-1]
            b = hits.setdefault(r["l"]["value"], {})
            if qid not in b or pop > b[qid]["pop"]:
                b[qid] = {"qid": qid, "lat": lat, "lon": lon, "pop": pop}
        for c in ch:
            pool = {}
            for v in variants(c["name"]):
                pool.update(hits.get(v, {}))
            if pool:
                data["cand"][c["slug"]] = sorted(pool.values(), key=lambda x: -x["pop"])[:16]
                added += 1
        json.dump(data, open(CACHE / "city-candidates.json", "w"))
    print(f"  {cname}: {sum(1 for c in group if data['cand'].get(c['slug']))}/{len(group)}", flush=True)

json.dump(data, open(CACHE / "city-candidates.json", "w"))
print(f"recovered candidate sets: {added}")
