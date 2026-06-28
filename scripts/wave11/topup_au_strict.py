#!/usr/bin/env python3
"""Deep topup for remaining sparse AU cities using region nature features (no P18
required; image via P18/P373/search), with the STRONG genuine-nature filter."""
import sys, json, re, urllib.parse
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C
from sparql import sparql, parse_point, filepath_to_name
import nearby_resolve as NR
import nearby_topup_deep as DEEP  # reuse region_features + get_image + search_image

OUT = Path("/tmp/w11")
nearby = json.load(open(OUT / "nearby.json"))
selected = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
existing_nearby_slugs = set(json.load(open(OUT / "existing_nearby_slugs.json")))

BAD = re.compile(r"historic|memorial|monument|battlefield|\bfort\b|fortress|museum|aquarium|\bzoo\b|"
    r"bird park|theme park|amusement|\bprison\b|archaeolog|fossil|pile dwelling|rijksbeschermd|\bdam\b|"
    r"\bcanal\b|water ?works|\bhamlet\b|outbuilding|attraction|neighbou?rhood|\bsquare\b|statue|\bchurch\b|"
    r"cathedral|\bpalace\b|chateau|\bestate\b|heritage|\bmanor\b|\babbey\b|monastery|\bmine\b|industrial|"
    r"stadium|cemetery|botanical|\bgarden\b|\bbuilding\b|historic district|world heritage|conservation area|"
    r"\bhouse\b|\bvilla\b|\bdepot\b|\bcastle\b|citadel")
def ok(types): return bool(types) and not BAD.search(types)

TARGET = 5
used = set(r["slug"] for v in nearby.values() for r in v)
for slug in ["broome", "mount-isa", "port-hedland"]:
    if len(nearby[slug]) >= TARGET: continue
    c = selected[slug]
    feats = DEEP.region_features("australia", c["lat"], c["lon"])
    have = {r["wikidataId"] for r in nearby[slug]}
    cands = []
    for f in feats:
        if f["qid"] in have or not f["name"] or not ok(f["types"]): continue
        km = NR.hav(c["lat"], c["lon"], f["lat"], f["lon"])
        if km > 170: continue
        cands.append((km, f))
    cands.sort(key=lambda x: x[0] - min(x[1]["sitelinks"], 30) * 1.2)
    added = 0
    for km, f in cands:
        if len(nearby[slug]) >= TARGET: break
        cat = NR.categorize(f["types"]); pslug = NR.slugify(f["name"])
        if not pslug: continue
        sl = f"{pslug}-near-{slug}"
        if sl in existing_nearby_slugs or sl in used: continue
        img = DEEP.get_image(f)
        if not img: continue
        used.add(sl); have.add(f["qid"])
        desig = NR.designation(f["types"], cat)
        nearby[slug].append({"slug": sl, "name": f["name"], "countrySlug": "australia", "regionName": "Oceania",
            "category": cat, "summary": (f"{f['name']} is a {desig.lower()} reachable from {c['name']} as a nearby nature "
            f"destination. Research access, facilities, and seasonal conditions with official sources before visiting."),
            "connectedCitySlugs": [slug], "distanceBand": NR.band(km), "wikidataId": f["qid"],
            "officialUrl": f["website"] if f.get("website") else None, "latitude": round(f["lat"], 5),
            "longitude": round(f["lon"], 5), "verificationStatus": "verified", "img": img,
            "facts": {"designation": desig, "iucnCategory": (re.sub(r".*category\s*", "", f["iucn"]).strip()[:4] if f.get("iucn") else None),
                      "established": f.get("inception") if (f.get("inception") and 1000 < f["inception"] <= 2026) else None},
            "distanceKm": round(km, 1)})
        added += 1
    print(f"  {slug}: +{added} -> {len(nearby[slug])}")

VALID = {"Ia","Ib","I","II","III","IV","V","VI"}
for v in nearby.values():
    for r in v:
        iu = r["facts"].get("iucnCategory")
        if iu and iu not in VALID:
            m = re.match(r"(Ia|Ib|IV|VI|V|III|II|I)\b", iu.strip()); r["facts"]["iucnCategory"] = m.group(1) if (m and m.group(1) in VALID) else None
json.dump(nearby, open(OUT / "nearby.json", "w"), ensure_ascii=False)
print("under5:", sorted([(s, len(v)) for s, v in nearby.items() if len(v) < 5]))
print("total nearby:", sum(len(v) for v in nearby.values()))
