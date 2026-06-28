#!/usr/bin/env python3
"""Drop 5 obscure nearby features whose images could not be cleanly resolved, and
re-topup the affected cities from the nature pool (strict image verify)."""
import sys, json
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C
import nearby_resolve as NR

OUT = Path("/tmp/w11")
nearby = json.load(open(OUT / "nearby.json"))
selected = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
existing_nearby_slugs = set(json.load(open(OUT / "existing_nearby_slugs.json")))

GARBAGE = {"glacial-ridge-national-wildlife-refuge-near-grand-forks", "tempe-town-lake-near-tempe"}

# combined pool per country (sitelinks>=2 + full sitelinks>=0 if present)
def pool_for(cc):
    p = list(NR.pool)  # already filtered name+p18; but it's all-country. filter cc
    p = [f for f in p if f["countrySlug"] == cc]
    full = OUT / f"nature_full_{cc}.json"
    if full.exists():
        seen = {f["qid"] for f in p}
        for f in json.load(open(full)):
            if f["qid"] not in seen and f.get("name") and f.get("p18file"):
                p.append(f); seen.add(f["qid"])
    return p

# global used slugs (all current)
used = set()
for v in nearby.values():
    for r in v: used.add(r["slug"])

affected = {}
for slug in GARBAGE:
    city = slug.split("-near-")[-1]
    affected.setdefault(city, set()).add(slug)

for city, drop in affected.items():
    recs = nearby[city]
    dropped_qids = {r["wikidataId"] for r in recs if r["slug"] in drop}
    nearby[city] = [r for r in recs if r["slug"] not in drop]
    for s in drop: used.discard(s)
    have_qids = {r["wikidataId"] for r in nearby[city]} | dropped_qids
    c = selected[city]; clat, clon = c["lat"], c["lon"]
    pool = pool_for(c["countrySlug"])
    cands = []
    for f in pool:
        if f["qid"] in have_qids: continue
        if abs(f["lat"] - clat) > 1.7 or abs(f["lon"] - clon) > 2.6: continue
        km = NR.hav(clat, clon, f["lat"], f["lon"])
        if km > 170: continue
        cands.append((km, f))
    cands.sort(key=lambda x: x[0] - min(x[1]["sitelinks"], 30) * 1.5)
    target = max(5, len(recs))  # restore to >=5 (and at least prior count)
    added = 0
    for km, f in cands:
        if len(nearby[city]) >= target: break
        cat = NR.categorize(f["types"]); pslug = NR.slugify(f["name"])
        if not pslug: continue
        sl = f"{pslug}-near-{city}"
        if sl in existing_nearby_slugs or sl in used: continue
        img = NR.verify_image(f, f["name"])
        if not img: continue
        used.add(sl); have_qids.add(f["qid"])
        desig = NR.designation(f["types"], cat)
        import re
        nearby[city].append({
            "slug": sl, "name": f["name"], "countrySlug": f["countrySlug"], "regionName": NR.REGION[f["countrySlug"]],
            "category": cat,
            "summary": (f"{f['name']} is a {desig.lower()} reachable from {c['name']} as a nearby nature destination. "
                        f"Research access, facilities, and seasonal conditions with official sources before visiting."),
            "connectedCitySlugs": [city], "distanceBand": NR.band(km), "wikidataId": f["qid"],
            "officialUrl": f["website"] if f.get("website") else None,
            "latitude": round(f["lat"], 5), "longitude": round(f["lon"], 5), "verificationStatus": "verified", "img": img,
            "facts": {"designation": desig,
                      "iucnCategory": (re.sub(r".*category\s*", "", f["iucn"]).strip()[:4] if f.get("iucn") else None),
                      "established": f.get("inception") if (f.get("inception") and 1000 < f["inception"] <= 2026) else None},
            "distanceKm": round(km, 1)})
        added += 1
    print(f"  {city}: dropped {len(drop)}, +{added} -> {len(nearby[city])}")

# re-clean any iucn that came in from replacements
import re
VALID = {"Ia","Ib","I","II","III","IV","V","VI"}
for v in nearby.values():
    for r in v:
        iu = r["facts"].get("iucnCategory")
        if iu and iu not in VALID:
            m = re.match(r"(Ia|Ib|IV|VI|V|III|II|I)\b", iu.strip())
            r["facts"]["iucnCategory"] = m.group(1) if (m and m.group(1) in VALID) else None

json.dump(nearby, open(OUT / "nearby.json", "w"), ensure_ascii=False)
print("under5 now:", sorted([(s, len(v)) for s, v in nearby.items() if len(v) < 5]))
print("total nearby:", sum(len(v) for v in nearby.values()))
