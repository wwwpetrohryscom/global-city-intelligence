#!/usr/bin/env python3
"""V4 Phase 7/8 — global forest and waterfall candidate harvest.

Same shape as the V3 harvest, narrowed to two class trees. Traversal is
bounded: P31/P279* from an explicit root list, never open-ended recursion.
Roots are listed here, in scripts/nature-v4/README.md and in the validator.

Cache: scripts/nature-v4/cache/{forest,fall}_<countrySlug>.json (resumable).
"""
import sys, json, re, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "wave11"))
from sparql import sparql, parse_point, filepath_to_name  # noqa: E402

OUT = Path(__file__).resolve().parent / "cache"
OUT.mkdir(exist_ok=True)
CQ = json.load(open(ROOT / "scripts/nature/cache/city-candidates.json"))["country_qids"]

# forest, woodland, national forest, state forest, forest reserve, protection
# forest, urban forest, royal forest, old-growth forest, rainforest, taiga,
# cloud forest, grove, tropical forest
FOREST_ROOTS = ("wd:Q4421 wd:Q3241565 wd:Q3079027 wd:Q2324919 wd:Q7315273 wd:Q329842 "
                "wd:Q1197552 wd:Q1975546 wd:Q208478 wd:Q159183 wd:Q1054813 wd:Q1189895 "
                "wd:Q1510380 wd:Q199403 wd:Q612741 wd:Q16966008")
# waterfall, cascade, cataract, waterfall group
FALL_ROOTS = "wd:Q34038 wd:Q357384 wd:Q1332767 wd:Q3623925"

QTMPL = """
SELECT ?f (SAMPLE(?nm) AS ?name) (SAMPLE(?coord) AS ?c) (SAMPLE(?sl) AS ?sitelinks)
       (SAMPLE(?img) AS ?image) (SAMPLE(?cc) AS ?commons)
       (GROUP_CONCAT(DISTINCT ?t31; SEPARATOR="|") AS ?types) (SAMPLE(?web) AS ?website)
WHERE {
  VALUES ?root { %(ROOTS)s }
  ?f wdt:P31/wdt:P279* ?root ; wdt:P17 wd:%(CQ)s ; wdt:P625 ?coord ; wikibase:sitelinks ?sl .
  { ?f wdt:P18 ?img } UNION { ?f wdt:P373 ?cc }
  OPTIONAL { ?f wdt:P18 ?img }
  OPTIONAL { ?f wdt:P373 ?cc }
  OPTIONAL { ?f rdfs:label ?nm . FILTER(lang(?nm)="en") }
  OPTIONAL { ?f wdt:P31 ?t31e . ?t31e rdfs:label ?t31 . FILTER(lang(?t31)="en") }
  OPTIONAL { ?f wdt:P856 ?web }
} GROUP BY ?f LIMIT 60000
"""

src = (ROOT / "lib/data/cities.ts").read_text()
body = src[src.index("const seeds: CitySeed[] = ["):src.index("export const cities: City[] = seeds.map(buildCity);")]
it = list(re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', body))
pairs = {}
for i, m in enumerate(it):
    blk = body[m.start(): it[i + 1].start() if i + 1 < len(it) else len(body)]
    cs = re.search(r'countrySlug: "([a-z0-9-]+)"', blk)
    cn = re.search(r'countryName: "((?:[^"\\]|\\.)*)"', blk)
    if cs and cn:
        pairs[cs.group(1)] = cn.group(1)

for kind, roots in (("forest", FOREST_ROOTS), ("fall", FALL_ROOTS)):
    for cslug, cname in sorted(pairs.items()):
        cache = OUT / f"{kind}_{cslug}.json"
        cq = CQ.get(cname)
        if cache.exists() or not cq:
            continue
        try:
            rows = sparql(QTMPL % {"ROOTS": roots, "CQ": cq}, retries=3, timeout=600)
        except Exception as e:
            print(f"  !! {kind}/{cslug}: {e}", flush=True)
            continue
        out = []
        for r in rows:
            def g(k):
                return r[k]["value"] if k in r and r[k]["value"] != "" else None
            lat, lon = parse_point(g("c"))
            if lat is None:
                continue
            img = g("image")
            out.append({"qid": r["f"]["value"].rsplit("/", 1)[-1], "name": g("name"),
                        "lat": lat, "lon": lon, "sitelinks": int(g("sitelinks") or 0),
                        "p18file": filepath_to_name(img) if img else None,
                        "commons": g("commons"), "types": (g("types") or "").lower(),
                        "website": g("website")})
        json.dump(out, open(cache, "w"))
        if out:
            print(f"{kind}/{cslug}: {len(out)}", flush=True)
        time.sleep(0.2)
print("harvest done")
