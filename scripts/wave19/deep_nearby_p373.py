#!/usr/bin/env python3
"""Deepest verified nearby search for still-deficient Wave-18 cities: fetch nearby
natural features that have a Wikimedia Commons CATEGORY (P373) even when they lack a
P18 statement, and resolve the first acceptable licensed photo from that category
(same method as hero resolution). This recovers major cities (Salalah/Burayda/Ha'il/
Al-Kharj/Yinchuan) whose surrounding Najd/Dhofar/Ningxia nature is under-imaged in
Wikidata P18. Broad landform/water/protected umbrellas + cross-border neighbours.
Contamination rules unchanged (commons.file/nearby_file_unsuitable + genuine_nature)."""
import sys, json, re
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave19")
from sparql import sparql, parse_point
import commons as C
import nearby_resolve as NR

OUT = Path("/tmp/w19")
ROOTS = "wd:Q271669 wd:Q15324 wd:Q863944 wd:Q473972 wd:Q4421 wd:Q23442"
LATAM = {"Q155": "brazil", "Q96": "mexico", "Q414": "argentina", "Q739": "colombia",
         "Q298": "chile", "Q419": "peru", "Q736": "ecuador", "Q750": "bolivia",
         "Q77": "uruguay", "Q733": "paraguay", "Q800": "costa-rica", "Q804": "panama",
         "Q786": "dominican-republic"}
NEIGH = {"Q30": "united-states", "Q774": "guatemala"}
REGION = dict(NR.REGION)
REGION.update({"united-states": "North America", "guatemala": "Central America"})
MIN_DIM = 600
PLACE = ("placeholder", "lorem", "unknown author", "unknown license", "todo", "tbd")

QTMPL = """
SELECT ?f (SAMPLE(?nm) AS ?name) (SAMPLE(?coord) AS ?c) (SAMPLE(?sl) AS ?sitelinks)
       (SAMPLE(?cat) AS ?commonsCat) (GROUP_CONCAT(DISTINCT ?t31; SEPARATOR="|") AS ?types)
       (SAMPLE(?ctry) AS ?country) (SAMPLE(?iucnL) AS ?iucn) (SAMPLE(?inc) AS ?inception) (SAMPLE(?web) AS ?website)
WHERE {
  VALUES ?root { %(ROOTS)s }
  VALUES ?ctry { %(CTRY)s }
  ?f wdt:P31/wdt:P279* ?root ; wdt:P17 ?ctry ; wdt:P373 ?cat ; wdt:P625 ?coord ; wikibase:sitelinks ?sl .
  OPTIONAL { ?f rdfs:label ?nm . FILTER(lang(?nm)="en") }
  OPTIONAL { ?f wdt:P31 ?t31e . ?t31e rdfs:label ?t31 . FILTER(lang(?t31)="en") }
  OPTIONAL { ?f wdt:P814 ?iucnE . ?iucnE rdfs:label ?iucnL . FILTER(lang(?iucnL)="en") }
  OPTIONAL { ?f wdt:P571 ?inc }
  OPTIONAL { ?f wdt:P856 ?web }
} GROUP BY ?f LIMIT 40000
"""


def clean(s): return s and not any(t in s.lower() for t in PLACE)


def cat_image(cat, name):
    """First acceptable licensed genuine photo from a Commons category (P373)."""
    try:
        files = C.category_files(cat, limit=80)
    except Exception:
        return None
    for fn in sorted(files, key=lambda f: (0 if f.lower().endswith((".jpg", ".jpeg")) else 1, f.lower())):
        if C.nearby_file_unsuitable(fn):
            continue
        ii = C.imageinfo(fn, width=1280)
        if not ii or ii["mime"] not in ("image/jpeg", "image/png"):
            continue
        if max(ii.get("ow") or 0, ii.get("oh") or 0) < MIN_DIM:
            continue
        if not C.license_ok(ii["licenseCode"], ii["licenseShort"]):
            continue
        au = C.clean_author(ii["artist"])
        if not au or not clean(au):
            continue
        lic, licurl = C.normalize_license(ii["licenseCode"], ii["licenseShort"])
        if ii.get("licenseUrl"):
            licurl = ii["licenseUrl"]
        sf = fn.replace("_", " ")
        return {"src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
                "alt": f"Verified Wikimedia Commons image of {name}",
                "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + sf,
                "author": au, "authorUrl": C.author_url(ii["artist"]),
                "license": lic, "licenseUrl": licurl,
                "attributionText": f"{au} / Wikimedia Commons, {lic}"}
    return None


def fetch(tag, cmap):
    cache = OUT / f"deep373_{tag}.json"
    if cache.exists():
        return json.load(open(cache))
    ctry = " ".join(f"wd:{q}" for q in cmap)
    res = sparql(QTMPL % {"ROOTS": ROOTS, "CTRY": ctry}, timeout=300)
    out = []
    for r in res:
        def g(k): return r[k]["value"] if k in r and r[k]["value"] != "" else None
        lat, lon = parse_point(g("c"))
        if lat is None or not g("commonsCat"):
            continue
        inc = g("inception"); yr = None
        if inc:
            m = re.search(r"(-?\d{3,4})-", inc)
            if m: yr = int(m.group(1))
        cq = (g("country") or "").split("/")[-1]
        out.append({"qid": r["f"]["value"].split("/")[-1], "name": g("name"), "lat": lat, "lon": lon,
            "sitelinks": int(g("sitelinks")) if g("sitelinks") else 0, "commonsCat": g("commonsCat"),
            "types": (g("types") or "").lower(), "iucn": g("iucn"), "inception": yr,
            "website": g("website"), "countrySlug": cmap.get(cq, cq)})
    json.dump(out, open(cache, "w"), ensure_ascii=False)
    print(f"deep373 {tag}: {len(out)} features w/ Commons category")
    return out


def main():
    sel = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
    nb = json.load(open(OUT / "nearby.json"))
    deficient = [(s, c) for s, c in sel.items() if len(nb.get(s, [])) < 5]
    ADJ = {"colombia": ["brazil", "peru", "ecuador", "panama"],
           "peru": ["brazil", "bolivia", "chile", "ecuador", "colombia"],
           "brazil": ["argentina", "paraguay", "bolivia", "peru", "colombia", "uruguay"],
           "argentina": ["chile", "bolivia", "paraguay", "uruguay", "brazil"],
           "bolivia": ["peru", "chile", "argentina", "paraguay", "brazil"],
           "chile": ["peru", "bolivia", "argentina"], "ecuador": ["colombia", "peru"],
           "paraguay": ["brazil", "argentina", "bolivia"], "uruguay": ["brazil", "argentina"],
           "mexico": ["guatemala"], "costa-rica": ["panama"], "panama": ["costa-rica", "colombia"],
           "dominican-republic": []}
    def_ccs = {c["countrySlug"] for _, c in deficient}
    src_ccs = set(def_ccs)
    for cc in def_ccs:
        src_ccs |= set(ADJ.get(cc, []))
    SLUG2Q = {v: k for k, v in {**LATAM, **NEIGH}.items()}
    pool = []
    for cc in sorted(src_ccs):
        q = SLUG2Q.get(cc)
        if not q:
            continue
        pool += [f for f in fetch(cc, {q: cc}) if f["name"] and NR.genuine_nature(f["types"], f["name"])]
    print(f"deficient={sorted(def_ccs)} sources={sorted(src_ccs)} p373 deep pool={len(pool)}")
    used = set(r["slug"] for v in nb.values() for r in v) | set(NR.existing_nearby_slugs)
    for s, c in deficient:
        have = nb.get(s, [])
        have_q = {r.get("wikidataId") for r in have}
        cands = sorted([(NR.hav(c["lat"], c["lon"], f["lat"], f["lon"]), f) for f in pool
                        if NR.hav(c["lat"], c["lon"], f["lat"], f["lon"]) <= 300],
                       key=lambda x: x[0] - min(x[1]["sitelinks"], 30) * 1.5)
        added = []
        for km, f in cands:
            if len(have) + len(added) >= 7:
                break
            if f["qid"] in have_q:
                continue
            cat = NR.categorize(f["types"])
            if NR.urban_island(f["lat"], f["lon"], cat):
                continue
            ps = NR.slugify(f["name"])
            if not ps:
                continue
            sl = f"{ps}-near-{s}"
            if sl in used:
                continue
            img = cat_image(f["commonsCat"], f["name"])
            if not img:
                continue
            have_q.add(f["qid"]); used.add(sl)
            desig = NR.designation(f["types"], cat)
            iucn = None
            if f.get("iucn"):
                mm = re.match(r"(Ia|Ib|IV|VI|V|III|II|I)\b", re.sub(r".*category\s*", "", f["iucn"]).strip())
                iucn = mm.group(1) if mm else None
            added.append({"slug": sl, "name": f["name"], "countrySlug": f["countrySlug"],
                "regionName": REGION.get(f["countrySlug"], "South America"), "category": cat,
                "summary": (f"{f['name']} is a {desig.lower()} reachable from {c['name']} as a nearby nature "
                            f"destination. Research access, facilities, and seasonal conditions with official sources before visiting."),
                "connectedCitySlugs": [s], "distanceBand": NR.band(km), "wikidataId": f["qid"],
                "officialUrl": f["website"] if f.get("website") else None,
                "latitude": round(f["lat"], 5), "longitude": round(f["lon"], 5),
                "verificationStatus": "verified", "img": img,
                "facts": {"designation": desig, "iucnCategory": iucn,
                          "established": f.get("inception") if (f.get("inception") and 1000 < f["inception"] <= 2026) else None},
                "distanceKm": round(km, 1)})
        nb[s] = have + added
        print(f"  {s:18s} {len(have)} -> {len(nb[s])}  (+{[a['name'] for a in added]})")
    json.dump(nb, open(OUT / "nearby.json", "w"), ensure_ascii=False)
    still = [(s, len(nb.get(s, []))) for s, c in deficient if len(nb.get(s, [])) < 5]
    print(f"\nstill under-5 after P373 deep search: {still}")


if __name__ == "__main__":
    main()
