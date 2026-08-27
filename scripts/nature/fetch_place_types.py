#!/usr/bin/env python3
"""Fetch structured Wikidata types for every nearby-place QID in the corpus.

Pulls, per place entity:
  P31  instance of        (+ English label)
  P279* one hop of subclass-of on each P31 value (+ label)
  P361 part of            (+ label)   — used only for contamination signals

The result is cached to scripts/nature/cache/place-types.json so the
classifier is reproducible offline. Network is only needed to refresh.

Usage: python3 scripts/nature/fetch_place_types.py [qids.json] [--refresh]
"""
import json, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "wave11"))
from sparql import sparql  # noqa: E402

CACHE = Path(__file__).resolve().parent / "cache"
CACHE.mkdir(exist_ok=True)
OUT = CACHE / "place-types.json"

qid_file = Path(sys.argv[1]) if len(sys.argv) > 1 and not sys.argv[1].startswith("-") else CACHE / "qids.json"
qids = sorted(set(json.load(open(qid_file))))
done = {}
if OUT.exists() and "--refresh" not in sys.argv:
    done = json.load(open(OUT))
todo = [q for q in qids if q not in done]
print(f"qids {len(qids)}; cached {len(done)}; todo {len(todo)}", flush=True)

CHUNK = 400
for i in range(0, len(todo), CHUNK):
    chunk = todo[i:i + CHUNK]
    vals = " ".join("wd:" + q for q in chunk)
    q = f"""SELECT ?item ?t ?tl ?st ?stl WHERE {{
      VALUES ?item {{ {vals} }}
      ?item wdt:P31 ?t .
      OPTIONAL {{ ?t rdfs:label ?tl . FILTER(lang(?tl) = "en") }}
      OPTIONAL {{ ?t wdt:P279 ?st . OPTIONAL {{ ?st rdfs:label ?stl . FILTER(lang(?stl) = "en") }} }}
    }}"""
    rows = sparql(q, timeout=300)
    for c in chunk:
        done.setdefault(c, {"p31": {}, "super": {}})
    for r in rows:
        qid = r["item"]["value"].rsplit("/", 1)[-1]
        t = r["t"]["value"].rsplit("/", 1)[-1]
        done[qid]["p31"][t] = r.get("tl", {}).get("value", "")
        if "st" in r:
            st = r["st"]["value"].rsplit("/", 1)[-1]
            done[qid]["super"][st] = r.get("stl", {}).get("value", "")
    json.dump(done, open(OUT, "w"))
    print(f"  chunk {i // CHUNK + 1}/{(len(todo) + CHUNK - 1) // CHUNK}: {len(done)} cached", flush=True)
    time.sleep(0.3)

json.dump(done, open(OUT, "w"))
missing = [q for q in qids if not done.get(q, {}).get("p31")]
print(f"done. cached={len(done)} without-P31={len(missing)}")
