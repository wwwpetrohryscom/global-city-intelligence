#!/usr/bin/env python3
"""Repair pass for cities the SPARQL mirror could not identify.

The QLever Wikidata mirror is missing English rdfs:labels for a set of
entities (Tampa Q49255, Indianapolis, Jacksonville, ...), so a label-driven
SPARQL lookup silently returns only namesakes. For the cities whose resolved
geometry looks wrong, candidates are re-fetched from the live Wikidata
`wbsearchentities` API (which searches aliases and descriptions) and scored
by the same place-geometry witness.

Writes the extra candidates back into scripts/nature/cache/city-candidates.json
so verify_city_coords.py can pick them up.
"""
import json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CACHE = Path(__file__).resolve().parent / "cache"
API = "https://www.wikidata.org/w/api.php"
UA = "GCI-nature/1.0 (titan95431@gmail.com) python-urllib"

data = json.load(open(CACHE / "city-candidates.json"))
suspicious = json.load(open(CACHE / "suspicious.json"))

src = (ROOT / "lib/data/cities.ts").read_text()
body = src[src.index("const seeds: CitySeed[] = ["): src.index("export const cities: City[] = seeds.map(buildCity);")]
it = list(re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', body))
info = {}
for i, m in enumerate(it):
    blk = body[m.start(): it[i + 1].start() if i + 1 < len(it) else len(body)]
    g = lambda f: (re.search(f + r':\s*"((?:[^"\\]|\\.)*)"', blk) or [None, None])[1]
    info[m.group(1)] = {"name": g("name"), "country": g("countryName")}


def api(params):
    params = dict(params, format="json")
    url = API + "?" + urllib.parse.urlencode(params)
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            sys.stderr.write(f"  api retry {attempt + 1}: {e}\n")
            time.sleep(2 + attempt * 2)
    return {}


added = 0
for n, slug in enumerate(suspicious, 1):
    meta = info.get(slug)
    if not meta:
        continue
    qids = []
    for term in {meta["name"], f'{meta["name"]}, {meta["country"]}'}:
        res = api({"action": "wbsearchentities", "search": term, "language": "en",
                   "uselang": "en", "type": "item", "limit": 15})
        qids += [h["id"] for h in res.get("search", [])]
    qids = list(dict.fromkeys(qids))[:30]
    if not qids:
        continue
    got = []
    for i in range(0, len(qids), 25):
        res = api({"action": "wbgetentities", "ids": "|".join(qids[i:i + 25]),
                   "props": "claims", "languages": "en"})
        for qid, ent in (res.get("entities") or {}).items():
            claims = ent.get("claims") or {}
            coord = claims.get("P625")
            if not coord:
                continue
            v = coord[0].get("mainsnak", {}).get("datavalue", {}).get("value") or {}
            if "latitude" not in v:
                continue
            pop = 0.0
            for c in claims.get("P1082") or []:
                amt = c.get("mainsnak", {}).get("datavalue", {}).get("value", {}).get("amount")
                if amt:
                    pop = max(pop, abs(float(amt)))
            got.append({"qid": qid, "lat": v["latitude"], "lon": v["longitude"], "pop": pop})
    if got:
        existing = {c["qid"] for c in data["cand"].get(slug, [])}
        merged = (data["cand"].get(slug) or []) + [g for g in got if g["qid"] not in existing]
        data["cand"][slug] = sorted(merged, key=lambda x: -x["pop"])[:40]
        added += 1
    if n % 25 == 0:
        json.dump(data, open(CACHE / "city-candidates.json", "w"))
        print(f"  {n}/{len(suspicious)} repaired sets: {added}", flush=True)

json.dump(data, open(CACHE / "city-candidates.json", "w"))
print(f"repaired candidate sets: {added}/{len(suspicious)}")
