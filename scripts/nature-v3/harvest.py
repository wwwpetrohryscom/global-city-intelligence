#!/usr/bin/env python3
"""V3 Phase 3/4 — harvest candidate nature features per country from Wikidata.

Widened from the wave pipeline in one deliberate way: a candidate qualifies with
EITHER a P18 image OR a P373 Commons category. The wave harvest required P18,
which is the main reason whole regions produced nothing — the feature exists and
is well typed, it just has no image statement on the entity. Commons-category
candidates go through the same image verification later, so the licensing bar is
unchanged; only the discovery net widens.

Cache: scripts/nature-v3/cache/nature_<countrySlug>.json (resumable).
"""
import sys, json, re, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "wave11"))
from sparql import sparql, parse_point, filepath_to_name  # noqa: E402

OUT = Path(__file__).resolve().parent / "cache"
OUT.mkdir(exist_ok=True)
targets = json.load(open(OUT / "targets.json"))

# nature roots: protected area, mountain, mountain range, lake, waterfall, island,
# forest, beach, canyon, gorge, cape, valley, archipelago, national park,
# nature reserve, peninsula, volcano, desert, reservoir, hill, hot spring, spring,
# wetland, marsh, bay, river, cave, glacier, dune, plateau, coast
ROOTS = ("wd:Q473972 wd:Q8502 wd:Q46831 wd:Q23397 wd:Q34038 wd:Q23442 wd:Q4421 "
         "wd:Q40080 wd:Q150784 wd:Q1245089 wd:Q185113 wd:Q39816 wd:Q33837 "
         "wd:Q46169 wd:Q179049 wd:Q34763 wd:Q8072 wd:Q8514 wd:Q131681 wd:Q54050 "
         "wd:Q177380 wd:Q124714 wd:Q170321 wd:Q30198 wd:Q39594 wd:Q4022 wd:Q35509 "
         "wd:Q35666 wd:Q25391 wd:Q75520 wd:Q93352 wd:Q158454 wd:Q22698 wd:Q1377575")

QTMPL = """
SELECT ?f (SAMPLE(?nm) AS ?name) (SAMPLE(?coord) AS ?c) (SAMPLE(?sl) AS ?sitelinks)
       (SAMPLE(?img) AS ?image) (SAMPLE(?cc) AS ?commons)
       (GROUP_CONCAT(DISTINCT ?t31; SEPARATOR="|") AS ?types)
       (SAMPLE(?web) AS ?website)
WHERE {
  VALUES ?root { %(ROOTS)s }
  ?f wdt:P31/wdt:P279* ?root ;
     wdt:P17 wd:%(CQ)s ;
     wdt:P625 ?coord ;
     wikibase:sitelinks ?sl .
  { ?f wdt:P18 ?img } UNION { ?f wdt:P373 ?cc }
  OPTIONAL { ?f wdt:P18 ?img }
  OPTIONAL { ?f wdt:P373 ?cc }
  OPTIONAL { ?f rdfs:label ?nm . FILTER(lang(?nm)="en") }
  OPTIONAL { ?f wdt:P31 ?t31e . ?t31e rdfs:label ?t31 . FILTER(lang(?t31)="en") }
  OPTIONAL { ?f wdt:P856 ?web }
}
GROUP BY ?f
LIMIT 60000
"""

slug_by_name = {}
for c in targets["cities"]:
    slug_by_name[c["countryName"]] = c["country"]

done = 0
for cname, cq in targets["byCountryName"].items():
    cslug = slug_by_name[cname]
    cache = OUT / f"nature_{cslug}.json"
    if cache.exists():
        print(f"{cslug}: cached {len(json.load(open(cache)))}", flush=True)
        continue
    try:
        rows = sparql(QTMPL % {"ROOTS": ROOTS, "CQ": cq}, retries=3, timeout=600)
    except Exception as e:
        print(f"  !! {cslug}: {e}", flush=True)
        continue
    out = []
    for r in rows:
        def g(k):
            return r[k]["value"] if k in r and r[k]["value"] != "" else None
        lat, lon = parse_point(g("c"))
        if lat is None:
            continue
        img = g("image")
        out.append({
            "qid": r["f"]["value"].rsplit("/", 1)[-1],
            "name": g("name"), "lat": lat, "lon": lon,
            "sitelinks": int(g("sitelinks") or 0),
            "p18file": filepath_to_name(img) if img else None,
            "commons": g("commons"),
            "types": (g("types") or "").lower(),
            "website": g("website"),
        })
    json.dump(out, open(cache, "w"))
    done += 1
    print(f"{cslug}: {len(out)} features (with P18: {sum(1 for x in out if x['p18file'])}, "
          f"commons-only: {sum(1 for x in out if not x['p18file'] and x['commons'])})", flush=True)
    time.sleep(0.4)
print(f"\nharvested {done} new countries")
