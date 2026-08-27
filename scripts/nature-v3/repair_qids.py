#!/usr/bin/env python3
"""V3 — repair corpus records wired to the wrong Wikidata entity.

Some curated places carry a QID that does not describe the place: Triberg
Waterfalls typed `human`, Titisee a `Wikimedia location map template`, Lahinch
Beach the village rather than the beach. The classifier correctly refuses them,
so real features silently vanish from the nature layer.

Repair is identity-first and geometry-checked: candidates come from the live
Wikidata search API, and a replacement is accepted only when its own P625 sits
within MAX_OFFSET_KM of the coordinate the corpus already publishes for that
place. A name match alone is never enough.
"""
import json, math, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
OUT = HERE / "cache"
API = "https://www.wikidata.org/w/api.php"
UA = "GCI-nature-v3/1.0 (titan95431@gmail.com) python-urllib"
MAX_OFFSET_KM = 25.0

places = {p["slug"]: p for p in json.load(open(ROOT / "scripts/nature/cache/places-compact.json"))}
types = json.load(open(ROOT / "scripts/nature/cache/place-types.json"))
NONPLACE = re.compile(r"^(human|asteroid|album|film|taxon|song|band|surname|given name|"
                      r"scholarly article|Wikimedia .*|encyclopedic article|disambiguation page|"
                      r"combat vehicle model|video game|television series|book|comic|painting|"
                      r"film poster|family name|human settlement)$", re.I)

targets = []
for slug, p in places.items():
    p31 = (types.get(p["qid"]) or {}).get("p31") or {}
    if not p31 or all(NONPLACE.match(lab or "") for lab in p31.values()):
        targets.append(p)
print(f"records to repair: {len(targets)}")


def api(params):
    url = API + "?" + urllib.parse.urlencode(dict(params, format="json"))
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            sys.stderr.write(f"  retry {i+1}: {e}\n")
            time.sleep(2 + 2 * i)
    return {}


def hav(a, b, c, d):
    r = math.radians
    return 2 * 6371 * math.asin(math.sqrt(
        math.sin((r(c) - r(a)) / 2) ** 2 + math.cos(r(a)) * math.cos(r(c)) * math.sin((r(d) - r(b)) / 2) ** 2))


repaired = json.load(open(OUT / "qid-repairs.json")) if (OUT / "qid-repairs.json").exists() else {}
for n, p in enumerate(targets, 1):
    if p["slug"] in repaired:
        continue
    res = api({"action": "wbsearchentities", "search": p["name"], "language": "en",
               "uselang": "en", "type": "item", "limit": 20})
    ids = [h["id"] for h in res.get("search", []) if h["id"] != p["qid"]]
    best = None
    for i in range(0, len(ids), 20):
        ent = api({"action": "wbgetentities", "ids": "|".join(ids[i:i + 20]), "props": "claims"})
        for qid, e in (ent.get("entities") or {}).items():
            claims = e.get("claims") or {}
            coord = claims.get("P625")
            if not coord:
                continue
            v = coord[0].get("mainsnak", {}).get("datavalue", {}).get("value") or {}
            if "latitude" not in v:
                continue
            km = hav(p["lat"], p["lon"], v["latitude"], v["longitude"])
            if km > MAX_OFFSET_KM:
                continue
            p31 = [c.get("mainsnak", {}).get("datavalue", {}).get("value", {}).get("id")
                   for c in claims.get("P31") or []]
            p31 = [x for x in p31 if x]
            if not p31:
                continue
            if best is None or km < best["km"]:
                best = {"qid": qid, "km": round(km, 2), "p31": p31}
    repaired[p["slug"]] = best
    json.dump(repaired, open(OUT / "qid-repairs.json", "w"))
    print(f"  [{n}/{len(targets)}] {p['name'][:34]:36s} {p['qid']} -> "
          f"{best['qid'] + ' (' + str(best['km']) + ' km)' if best else 'NO REPLACEMENT'}", flush=True)

ok = sum(1 for v in repaired.values() if v)
print(f"\nrepaired: {ok}/{len(repaired)}  (unrepairable stay excluded, never guessed)")
