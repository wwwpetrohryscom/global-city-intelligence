#!/usr/bin/env python3
"""Phase 3/4 — deep identity evidence for the flagged pairs.

The QIDs in lib/data/city-coordinates.ts were resolved by the nature pipeline
(label lookup plus geometry), so two records resolving to the same QID is a
CANDIDATE signal, not proof. This pulls the entities themselves — type,
official name, population, admin status — and prints the corpus records beside
them so the decision rests on evidence rather than on the slug.
"""
import json, re, sys, urllib.parse, urllib.request, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
API = "https://www.wikidata.org/w/api.php"
UA = "GCI-identity/1.0 (titan95431@gmail.com) python-urllib"
PAIRS = [("alexandroupoli", "alexandroupolis-gr"), ("tromso", "tromso-municipality"),
         ("baerum-municipality", "sandvika")]


def api(params):
    url = API + "?" + urllib.parse.urlencode(dict(params, format="json"))
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            sys.stderr.write(f"  retry {i+1}: {e}\n"); time.sleep(2 + 2 * i)
    return {}


src = (ROOT / "lib/data/cities.ts").read_text()
body = src[src.index("const seeds: CitySeed[] = ["):src.index("export const cities: City[] = seeds.map(buildCity);")]
it = list(re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', body))
rec = {}
for i, m in enumerate(it):
    blk = body[m.start(): it[i + 1].start() if i + 1 < len(it) else len(body)]
    rec[m.group(1)] = blk

coords = {}
for m in re.finditer(r'^\s*\["([a-z0-9-]+)", (-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?), (?:"(Q\d+)"|undefined)\],$',
                     (ROOT / "lib/data/city-coordinates.ts").read_text(), re.M):
    coords[m.group(1)] = (float(m.group(2)), float(m.group(3)), m.group(4))

# what each slug actually generates
nearby = (ROOT / "lib/data/nearby-places.ts").read_text()
graph = (ROOT / "lib/data/city-discovery-graph.ts").read_text()


def usage(slug):
    return {
        "nearbyPlaces": len(re.findall(r'"%s"' % re.escape(slug), nearby)),
        "graphEdges": len(re.findall(r'citySlug: "%s"' % re.escape(slug), graph)),
        "graphNode": bool(re.search(r'^  "%s": \[' % re.escape(slug), graph, re.M)),
    }


for a, b in PAIRS:
    print(f"\n{'=' * 74}\n{a}   vs   {b}\n{'=' * 74}")
    qids = []
    for s in (a, b):
        blk = rec.get(s, "")
        g = lambda f: (re.search(f + r':\s*"((?:[^"\\]|\\.)*)"', blk) or [None, None])[1]
        lat, lon, qid = coords.get(s, (None, None, None))
        qids.append(qid)
        print(f"\n  [{s}]")
        print(f"    name        : {g('name')}")
        print(f"    country     : {g('countrySlug')}  region: {g('region')}")
        print(f"    population  : {g('population')}")
        print(f"    coordinates : {lat}, {lon}   resolved QID: {qid}")
        print(f"    usage       : {usage(s)}")
    for qid in dict.fromkeys([q for q in qids if q]):
        ent = api({"action": "wbgetentities", "ids": qid, "props": "labels|descriptions|claims",
                   "languages": "en"}).get("entities", {}).get(qid, {})
        claims = ent.get("claims") or {}
        def vals(prop):
            out = []
            for c in claims.get(prop, []):
                v = c.get("mainsnak", {}).get("datavalue", {}).get("value")
                if isinstance(v, dict) and "id" in v:
                    out.append(v["id"])
                elif isinstance(v, dict) and "amount" in v:
                    out.append(v["amount"])
                elif isinstance(v, dict) and "text" in v:
                    out.append(v["text"])
                elif v is not None:
                    out.append(str(v)[:40])
            return out
        p31 = vals("P31")
        labels = {}
        if p31:
            got = api({"action": "wbgetentities", "ids": "|".join(p31[:6]), "props": "labels", "languages": "en"})
            for k, v in (got.get("entities") or {}).items():
                labels[k] = v.get("labels", {}).get("en", {}).get("value", k)
        print(f"\n  Wikidata {qid}: {ent.get('labels', {}).get('en', {}).get('value')}")
        print(f"    description : {ent.get('descriptions', {}).get('en', {}).get('value')}")
        print(f"    P31 (is a)  : {[labels.get(x, x) for x in p31]}")
        print(f"    P1082 pop   : {vals('P1082')[:2]}")
        print(f"    P1376 capital-of: {vals('P1376')[:3]}   P131 in: {vals('P131')[:3]}")
