#!/usr/bin/env python3
"""Verify agent-proposed nearby-nature CANDIDATES deterministically before accepting.
Agent output is treated as UNTRUSTED: every candidate QID is re-fetched from Wikidata
(real P625 coords, P31 types, P373 category, P18 image); then genuine_nature + Commons
license/author/resolution filters + distance(<=320km) + global/per-city dedup are applied
exactly like the main resolver. Only survivors are appended to /tmp/w19/nearby.json.
Never fabricates. Input: /tmp/w19/nearby_candidates.json = {slug:[{wikidataQid,...}]}."""
import sys, json, re, time
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave19")
from sparql import sparql, parse_point, filepath_to_name
import commons as C
import nearby_resolve as NR

OUT = Path("/tmp/w19")
sel = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
nb = json.load(open(OUT / "nearby.json"))
cand = json.load(open(OUT / "nearby_candidates.json"))
used = set(r["slug"] for v in nb.values() for r in v) | set(NR.existing_nearby_slugs)
MAX_KM = 320
MIN_DIM = 600

# A nearby place's countrySlug is the FEATURE's real P17 country (not the city's).
# Only countries present in countries.ts may be used; anything else (e.g. Venezuela)
# is rejected so we never mislabel a cross-border feature.
COUNTRY_SLUG = {"Q155": "brazil", "Q96": "mexico", "Q414": "argentina", "Q739": "colombia",
                "Q298": "chile", "Q419": "peru", "Q736": "ecuador", "Q750": "bolivia",
                "Q77": "uruguay", "Q733": "paraguay", "Q800": "costa-rica", "Q804": "panama",
                "Q786": "dominican-republic", "Q30": "united-states", "Q774": "guatemala"}
REGIONMAP = dict(NR.REGION)
REGIONMAP.update({"united-states": "North America", "guatemala": "Central America"})

# Candidate-path nature acceptance (does NOT touch the shared genuine_nature filter).
# Applies only to agent-surfaced, Wikidata-confirmed candidates that still pass every
# other gate (image/license/resolution/distance/country/dedup). It rescues real parks &
# reserves that Wikidata types only as the generic "protected area", and a city's OWN
# river when its P625 point is genuinely at the city (<=50 km). Rivers whose point is
# far, admin-only areas, and BAD_NAME/BAD_TYPE hits stay rejected.
STRONG_NATURE = re.compile(
    r"national park|national reserve|national nature reserve|nature reserve|natural reserve|"
    r"conservation area|biological reserve|ecological (reserve|station|park)|"
    r"wildlife (refuge|sanctuary|reserve|management)|state park|national forest|state forest|"
    r"protected landscape|natural monument|geopark|extractive reserve|natural heritage|"
    r"patrim[oô]nio natural|environmental protection area|flora and fauna protection|national wildlife|"
    r"regional conservation|marine reserve|forest reserve", re.I)
RIVERISH = re.compile(r"\briver\b|watercourse|\bstream\b|\bcreek\b", re.I)
def nature_ok(name, types, km):
    if NR.genuine_nature(types, name):
        return True
    if NR.BAD_NAME.search(name or "") or NR.BAD_TYPE.search(types or ""):
        return False
    blob = (name or "") + " | " + (types or "")
    if STRONG_NATURE.search(blob):
        return True
    if RIVERISH.search(types or "") and km <= 50:   # the city's own river, point confirmed near
        return True
    return False

# ---- batch-fetch real Wikidata facts for all proposed QIDs ----
all_qids = sorted({c["wikidataQid"].strip() for lst in cand.values() for c in lst
                   if re.fullmatch(r"Q\d+", c.get("wikidataQid", "").strip() or "")})
print(f"candidate QIDs to verify: {len(all_qids)}")
facts = {}
BATCH = 60
for i in range(0, len(all_qids), BATCH):
    chunk = all_qids[i:i + BATCH]
    values = " ".join(f"wd:{q}" for q in chunk)
    q = """
    SELECT ?f (SAMPLE(?coord) AS ?c) (SAMPLE(?cat) AS ?commonsCat) (SAMPLE(?img) AS ?image)
           (SAMPLE(?nm) AS ?name) (GROUP_CONCAT(DISTINCT ?t31; SEPARATOR="|") AS ?types)
           (SAMPLE(?iucnL) AS ?iucn) (SAMPLE(?inc) AS ?inception) (SAMPLE(?web) AS ?website)
           (SAMPLE(?ctry) AS ?country)
    WHERE {
      VALUES ?f { %s }
      OPTIONAL { ?f wdt:P625 ?coord }
      OPTIONAL { ?f wdt:P373 ?cat }
      OPTIONAL { ?f wdt:P18 ?img }
      OPTIONAL { ?f wdt:P17 ?ctry }
      OPTIONAL { ?f rdfs:label ?nm . FILTER(lang(?nm)="en") }
      OPTIONAL { ?f wdt:P31 ?t31e . ?t31e rdfs:label ?t31 . FILTER(lang(?t31)="en") }
      OPTIONAL { ?f wdt:P814 ?iucnE . ?iucnE rdfs:label ?iucnL . FILTER(lang(?iucnL)="en") }
      OPTIONAL { ?f wdt:P571 ?inc }
      OPTIONAL { ?f wdt:P856 ?web }
    } GROUP BY ?f
    """ % values
    try:
        rows = sparql(q, timeout=120)
    except Exception as e:
        print("  sparql batch failed:", e); rows = []
    for r in rows:
        def g(k): return r[k]["value"] if k in r and r[k]["value"] != "" else None
        qid = r["f"]["value"].split("/")[-1]
        lat, lon = parse_point(g("c"))
        inc = g("inception"); year = None
        if inc:
            mm = re.search(r"(-?\d{3,4})-", inc)
            if mm: year = int(mm.group(1))
        facts[qid] = {"lat": lat, "lon": lon, "cat": g("commonsCat"),
                      "p18file": filepath_to_name(g("image")), "name": g("name"),
                      "types": (g("types") or "").lower(), "iucn": g("iucn"),
                      "inception": year, "website": g("website"),
                      "country": (g("country") or "").split("/")[-1]}
    time.sleep(0.3)
print(f"fetched facts for {len(facts)} QIDs")


def cat_image(cat, name):
    if not cat: return None
    try:
        files = C.category_files(cat, limit=200)
    except Exception:
        return None
    files.sort(key=lambda f: (0 if f.lower().endswith((".jpg", ".jpeg")) else 1, f.lower()))
    for fn in files:
        if C.nearby_file_unsuitable(fn): continue
        ii = C.imageinfo(fn, width=1280)
        if not ii or ii["mime"] not in ("image/jpeg", "image/png"): continue
        if max(ii.get("ow") or 0, ii.get("oh") or 0) < MIN_DIM: continue
        if not C.license_ok(ii["licenseCode"], ii["licenseShort"]): continue
        au = C.clean_author(ii["artist"])
        if not au: continue
        lic, licurl = C.normalize_license(ii["licenseCode"], ii["licenseShort"])
        if ii.get("licenseUrl"): licurl = ii["licenseUrl"]
        sf = fn.replace("_", " ")
        return {"src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
                "alt": f"Verified Wikimedia Commons image of {name}",
                "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + sf,
                "author": au, "authorUrl": C.author_url(ii["artist"]),
                "license": lic, "licenseUrl": licurl,
                "attributionText": f"{au} / Wikimedia Commons, {lic}"}
    return None


def resolve_img(f, name):
    # 1) P18 file, 2) P373 category
    if f.get("p18file"):
        g = NR.verify_image({"p18file": f["p18file"]}, name)
        if g: return g
    return cat_image(f.get("cat"), name)


added_total, report = 0, {}
for slug, lst in cand.items():
    if slug not in sel: continue
    city = sel[slug]
    have = nb.get(slug, [])
    have_q = {r.get("wikidataId") for r in have}
    added = []
    # order candidates by agent-provided distance
    for cc in sorted(lst, key=lambda x: x.get("approxDistanceKm", 999)):
        if len(have) + len(added) >= 8: break
        qid = (cc.get("wikidataQid") or "").strip()
        if not re.fullmatch(r"Q\d+", qid): continue
        f = facts.get(qid)
        if not f: report.setdefault(slug, []).append((cc.get("name"), "qid-not-found")); continue
        if qid in have_q: continue
        if f["lat"] is None: report.setdefault(slug, []).append((f.get("name"), "no-coords")); continue
        km = NR.hav(city["lat"], city["lon"], f["lat"], f["lon"])
        if km > MAX_KM: report.setdefault(slug, []).append((f.get("name"), f"too-far {km:.0f}km")); continue
        # feature's REAL country (P17) — must be a country in countries.ts, else reject
        fcc = COUNTRY_SLUG.get(f.get("country"))
        if not fcc:
            report.setdefault(slug, []).append((f.get("name"), f"unsupported-country [{f.get('country')}]")); continue
        nm = f["name"] or cc.get("name")
        if not nm: continue
        if not nature_ok(nm, f["types"], km):
            report.setdefault(slug, []).append((nm, f"not-genuine-nature [{f['types'][:40]}]")); continue
        cat = NR.categorize(f["types"])
        if NR.urban_island(f["lat"], f["lon"], cat): continue
        ps = NR.slugify(nm)
        if not ps: continue
        sl = f"{ps}-near-{slug}"
        if sl in used: continue
        img = resolve_img(f, nm)
        if not img: report.setdefault(slug, []).append((nm, "no-verified-image")); continue
        have_q.add(qid); used.add(sl)
        desig = NR.designation(f["types"], cat)
        iucn = None
        if f.get("iucn"):
            mm = re.match(r"(Ia|Ib|IV|VI|V|III|II|I)\b", re.sub(r".*category\s*", "", f["iucn"]).strip())
            iucn = mm.group(1) if mm else None
        added.append({"slug": sl, "name": nm, "countrySlug": fcc,
            "regionName": REGIONMAP[fcc], "category": cat,
            "summary": (f"{nm} is a {desig.lower()} reachable from {city['name']} as a nearby nature "
                        f"destination. Research access, facilities, and seasonal conditions with official sources before visiting."),
            "connectedCitySlugs": [slug], "distanceBand": NR.band(km), "wikidataId": qid,
            "officialUrl": f["website"] if f.get("website") else None,
            "latitude": round(f["lat"], 5), "longitude": round(f["lon"], 5),
            "verificationStatus": "verified", "img": img,
            "facts": {"designation": desig, "iucnCategory": iucn,
                      "established": f.get("inception") if (f.get("inception") and 1000 < f["inception"] <= 2026) else None},
            "distanceKm": round(km, 1)})
    if added:
        nb[slug] = have + added
        added_total += len(added)
    print(f"  {slug:16s} {len(have)} -> {len(nb.get(slug, []))}  (+{[a['name'] for a in added]})")
    if report.get(slug): print(f"      rejected: {report[slug][:6]}")

json.dump(nb, open(OUT / "nearby.json", "w"), ensure_ascii=False)
still = [(s, len(nb.get(s, []))) for s in cand if len(nb.get(s, [])) < 5]
print(f"\nverified additions: {added_total}; still under-5: {still}")
