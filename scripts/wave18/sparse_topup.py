#!/usr/bin/env python3
"""Top up cities still under 5 verified nearby places after the main pass, by
re-searching the SAME verified nature pool at a wider radius (up to 300 km) —
geographically reasonable for vast, feature-sparse desert/plain countries
(Saudi/Iraq/Oman/inland China). Appends only the extra features needed to reach
5-8; never drops or duplicates existing ones. Reuses nearby_resolve helpers."""
import json, sys
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave18")
import nearby_resolve as NR

OUT = "/tmp/w18"
WIDE_KM = 300
selected = json.load(open(f"{OUT}/selected.json"))
nearby = json.load(open(f"{OUT}/nearby.json"))
byslug = {c["slug"]: c for c in selected}
used = set(r["slug"] for v in nearby.values() for r in v) | set(NR.existing_nearby_slugs)


def wide_resolve(city, have, want):
    clat, clon = city["lat"], city["lon"]
    have_qids = {r.get("wikidataId") for r in have}
    cands = []
    for f in NR.pool:
        if abs(f["lat"] - clat) > 3.2 or abs(f["lon"] - clon) > 4.2:
            continue
        km = NR.hav(clat, clon, f["lat"], f["lon"])
        if km > WIDE_KM:
            continue
        cands.append((km, f))
    cands.sort(key=lambda x: x[0] - min(x[1]["sitelinks"], 30) * 1.5)
    out = []
    for km, f in cands:
        if len(have) + len(out) >= want:
            break
        if f["qid"] in have_qids:
            continue
        cat = NR.categorize(f["types"])
        if NR.urban_island(f["lat"], f["lon"], cat):
            continue
        pslug = NR.slugify(f["name"])
        if not pslug:
            continue
        sl = f"{pslug}-near-{city['slug']}"
        if sl in used:
            continue
        img = NR.verify_image(f, f["name"])
        if not img:
            continue
        have_qids.add(f["qid"]); used.add(sl)
        desig = NR.designation(f["types"], cat)
        import re
        iucn = None
        if f.get("iucn"):
            m = re.match(r"(Ia|Ib|IV|VI|V|III|II|I)\b", re.sub(r".*category\s*", "", f["iucn"]).strip())
            iucn = m.group(1) if m else None
        out.append({"slug": sl, "name": f["name"], "countrySlug": f["countrySlug"],
            "regionName": NR.REGION[f["countrySlug"]], "category": cat,
            "summary": (f"{f['name']} is a {desig.lower()} reachable from {city['name']} as a nearby nature "
                        f"destination. Research access, facilities, and seasonal conditions with official sources before visiting."),
            "connectedCitySlugs": [city["slug"]], "distanceBand": NR.band(km), "wikidataId": f["qid"],
            "officialUrl": f["website"] if f.get("website") else None,
            "latitude": round(f["lat"], 5), "longitude": round(f["lon"], 5),
            "verificationStatus": "verified", "img": img,
            "facts": {"designation": desig, "iucnCategory": iucn,
                      "established": f.get("inception") if (f.get("inception") and 1000 < f["inception"] <= 2026) else None},
            "distanceKm": round(km, 1)})
    return out


short = [c for c in selected if len(nearby.get(c["slug"], [])) < 5]
print(f"under-5 before top-up: {len(short)}")
fixed = 0
for c in short:
    have = nearby.get(c["slug"], [])
    add = wide_resolve(c, have, 7)
    if add:
        nearby[c["slug"]] = have + add
        if len(nearby[c["slug"]]) >= 5:
            fixed += 1
    print(f"  {c['slug']:22s} {len(have)} -> {len(nearby.get(c['slug'], []))}")
json.dump(nearby, open(f"{OUT}/nearby.json", "w"), ensure_ascii=False)
still = [c["slug"] for c in selected if len(nearby.get(c["slug"], [])) < 5]
cnt = [len(nearby.get(c["slug"], [])) for c in selected]
print(f"\nfixed {fixed}; still under-5: {len(still)} -> {still}")
print(f"total nearby={sum(cnt)} min={min(cnt)}")
