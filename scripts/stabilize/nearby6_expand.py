#!/usr/bin/env python3
"""Wave 12 sparse-nearby expansion: audit the ENTIRE dataset for cities with <5
nearby places and top them up to >=5 using the same strong nature-only filter +
Commons image verification as the main resolver. Append-only: emits NEW nearby
records only (existing city nearby untouched), global slug dedup + per-city QID
dedup against what each city already links. Writes /tmp/w12/sparse_add.json."""
import sys, json, re, time
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave12")
import nearby_resolve as NR

ROOT = Path("/Users/agent/global-city-intelligence")
OUT = Path("/tmp/w12")
TARGET = 6  # Phase 5: lift cities to >=6 nearby

# region labels for the expanded country set (used in nearby record regionName)
REGION = dict(NR.REGION)
REGION.update({
    "italy": "Southern Europe", "spain": "Southern Europe", "portugal": "Southern Europe",
    "greece": "Southern Europe", "croatia": "Southern Europe", "serbia": "Southern Europe",
    "poland": "Central Europe", "czechia": "Central Europe", "slovakia": "Central Europe",
    "hungary": "Central Europe", "slovenia": "Central Europe", "austria": "Central Europe",
    "switzerland": "Central Europe", "netherlands": "Western Europe", "belgium": "Western Europe",
    "luxembourg": "Western Europe", "ireland": "Western Europe",
    "sweden": "Northern Europe", "norway": "Northern Europe", "denmark": "Northern Europe",
    "finland": "Northern Europe", "estonia": "Northern Europe", "latvia": "Northern Europe",
    "lithuania": "Northern Europe", "romania": "Eastern Europe", "bulgaria": "Eastern Europe",
    "ukraine": "Eastern Europe", "new-zealand": "Oceania",
})

# ---- load every available nature pool, filtered to genuine nature, grouped by country ----
pools = {}
for fp in sorted(OUT.glob("nature_*.json")):
    slug = fp.stem.replace("nature_", "")
    rows = json.load(open(fp))
    keep = [f for f in rows if f.get("name") and f.get("p18file")
            and NR.genuine_nature(f["types"], f["name"]) and slug in REGION]
    if keep:
        pools[slug] = keep
print("pools loaded:", {k: len(v) for k, v in sorted(pools.items())})

# ---- city coords + country ----
coords = json.load(open(OUT / "all_city_coords.json"))
ec = {c["slug"]: c["countrySlug"] for c in json.load(open(OUT / "existing_cities.json"))}
for c in json.load(open(OUT / "selected.json")):
    ec[c["slug"]] = c["countrySlug"]

# ---- parse CURRENT nearby-places.ts per-RECORD (order-independent): per-city
# existing QIDs/count + global slug set. Field order in a PlaceSeed is
# slug -> category -> connectedCitySlugs -> wikidataId, so parse each record block
# whole rather than with cross-field non-greedy spans. ----
src = (ROOT / "lib/data/nearby-places.ts").read_text()
global_slugs = set()
city_qids = {}   # city -> set(qid) already linked
city_count = {}  # city -> count
# split the whole file at each `slug: "` boundary; each chunk holds exactly one
# PlaceSeed's fields (its connectedCitySlugs + wikidataId precede the next slug).
# VERIFIED_IMAGES entries use `"<slug>": {` keys (no `slug: "`) so are not matched.
for ch in re.split(r'(?=slug: ")', src):
    sm = re.match(r'slug: "([a-z0-9-]+)"', ch)
    if not sm:
        continue
    global_slugs.add(sm.group(1))
    qm = re.search(r'wikidataId: "(Q\d+)"', ch)
    cm = re.search(r'connectedCitySlugs: \[([^\]]*)\]', ch)
    for c in (re.findall(r'"([a-z0-9-]+)"', cm.group(1)) if cm else []):
        city_count[c] = city_count.get(c, 0) + 1
        if qm:
            city_qids.setdefault(c, set()).add(qm.group(1))
print("existing nearby places:", len(global_slugs), "| cities with >=1 nearby:", len(city_count),
      "| sub-5:", sum(1 for c in ec if city_count.get(c, 0) < TARGET))

sparse = [c for c in ec if city_count.get(c, 0) < TARGET and c in coords]
# feasible = sparse city whose country has a pool
feasible = [c for c in sparse if ec[c] in pools]
deferred = sorted(set(ec[c] for c in sparse if ec[c] not in pools))
print(f"sparse cities total={len(sparse)} feasible(pool)={len(feasible)} "
      f"deferred-countries={len(deferred)}: {deferred}")


def expand_city(slug):
    clat, clon = coords[slug]
    cc = ec[slug]
    pool = pools[cc]
    have_qids = set(city_qids.get(slug, set()))
    need = TARGET - city_count.get(slug, 0)
    cands = []
    for f in pool:
        if abs(f["lat"] - clat) > 1.7 or abs(f["lon"] - clon) > 2.6:
            continue
        km = NR.hav(clat, clon, f["lat"], f["lon"])
        if km > 170:
            continue
        cands.append((km, f))
    cands.sort(key=lambda x: x[0] - min(x[1]["sitelinks"], 30) * 1.5)
    out = []
    cityname = slug.replace("-us", "").replace("-uk", "").replace("-", " ").title()
    for km, f in cands:
        if len(out) >= need + 1:  # small buffer
            break
        if f["qid"] in have_qids:
            continue
        cat = NR.categorize(f["types"])
        if NR.urban_island(f["lat"], f["lon"], cat):
            continue
        pslug = NR.slugify(f["name"])
        if not pslug:
            continue
        sl = f"{pslug}-near-{slug}"
        if sl in global_slugs:
            continue
        img = NR.verify_image(f, f["name"])
        if not img:
            continue
        if re.search(r'satellite|worldwind|landsat|sentinel|copernicus|imagery_map|_labeled', img['src'], re.I):
            continue
        have_qids.add(f["qid"])
        global_slugs.add(sl)
        desig = NR.designation(f["types"], cat)
        iucn = None
        if f.get("iucn"):
            m = re.match(r"(Ia|Ib|IV|VI|V|III|II|I)\b", re.sub(r".*category\s*", "", f["iucn"]).strip())
            iucn = m.group(1) if m else None
        out.append({
            "slug": sl, "name": f["name"], "countrySlug": cc, "regionName": REGION[cc],
            "category": cat,
            "summary": (f"{f['name']} is a {desig.lower()} reachable from {cityname} as a nearby nature "
                        f"destination. Research access, facilities, and seasonal conditions with official "
                        f"sources before visiting."),
            "connectedCitySlugs": [slug], "distanceBand": NR.band(km), "wikidataId": f["qid"],
            "officialUrl": f["website"] if f.get("website") else None,
            "latitude": round(f["lat"], 5), "longitude": round(f["lon"], 5),
            "verificationStatus": "verified", "img": img,
            "facts": {"designation": desig, "iucnCategory": iucn,
                      "established": f.get("inception") if (f.get("inception") and 1000 < f["inception"] <= 2026) else None},
            "distanceKm": round(km, 1)})
    return out


def main():
    SA = OUT / "nearby6_add.json"
    add = json.load(open(SA)) if SA.exists() else {}
    done = set(add)
    still_short = []
    todo = [c for c in feasible if c not in done]
    for i, slug in enumerate(todo):
        recs = expand_city(slug)
        if recs:
            add[slug] = recs
        final = city_count.get(slug, 0) + len(recs)
        if final < TARGET:
            still_short.append((slug, final))
        if (i + 1) % 25 == 0:
            json.dump(add, open(SA, "w"), ensure_ascii=False)
            print(f"  {i+1}/{len(todo)} | +{sum(len(v) for v in add.values())} places | short={len(still_short)}")
        time.sleep(0.03)
    json.dump(add, open(SA, "w"), ensure_ascii=False)
    tot = sum(len(v) for v in add.values())
    print(f"DONE sparse expand: {len(add)} cities topped up, +{tot} nearby places; "
          f"still<5 after expand={len(still_short)}")
    json.dump(still_short, open(OUT / "nearby6_still_short.json", "w"))


if __name__ == "__main__":
    main()
