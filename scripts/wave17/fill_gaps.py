#!/usr/bin/env python3
"""Fill collection gaps for wave17. The under-represented countries (RU/TR/UA/BY/IL/RS/
ME/SI/EE + BG overflow) have no country-scoped collections, so CREATE per-country
`{country}-weekend-escapes` (regional, weekend_escape_region) + `{country}-weekend-nature-
retreats` (thematic, weekend_nature_retreats) — additive (counts grow, not reduced),
existing schema, like wave16's norway-weekend-escapes. Countries with <2 gap cities are
spliced into an existing room-having collection. MAX_CITIES guard untouched."""
import re, json
from pathlib import Path
from collections import Counter, defaultdict

ROOT = Path("/Users/agent/global-city-intelligence")
RC = ROOT / "lib/data/regional-collections.ts"
TC = ROOT / "lib/data/thematic-collections.ts"
CAP = 80
sel = json.load(open("/tmp/w17/selected.json"))
country = {c["slug"]: c["countrySlug"] for c in sel}
CN = {"greece": "Greece", "hungary": "Hungary", "bulgaria": "Bulgaria", "slovenia": "Slovenia",
      "serbia": "Serbia", "lithuania": "Lithuania", "latvia": "Latvia", "estonia": "Estonia",
      "montenegro": "Montenegro", "ukraine": "Ukraine", "belarus": "Belarus", "russia": "Russia",
      "turkey": "Turkey", "israel": "Israel", "czechia": "Czechia"}
new = [c["slug"] for c in sel]
nb = json.load(open("/tmp/w17/nearby.json"))
REG_RELATED = ["central-europe-weekend-escapes", "southern-europe-weekend-escapes", "baltic-europe-weekend-escapes"]
THE_RELATED = ["austria-weekend-nature-retreats", "belgium-weekend-nature-retreats", "australia-weekend-nature-retreats"]
NATURE_CATS = {"nature", "park", "mountain", "lake", "beach", "island", "waterfront", "family_outdoor"}
DETAIL_SET = set(re.findall(r'"([a-z0-9-]+)"', (ROOT / "lib/data/nearby-place-detail-pages.ts").read_text()))


def coverage(text):
    cov = Counter()
    for b in text.split("\n  {\n")[1:]:
        m = re.search(r'\n\s*cities: \[(.*?)\]', b)
        if m:
            for c in re.findall(r'"([a-z0-9-]+)"', m.group(1)):
                cov[c] += 1
    return cov


def sizes(text):
    d = {}
    for b in text.split("\n  {\n")[1:]:
        sm = re.search(r'slug:\s*"([a-z0-9-]+)"', b)
        cm = re.search(r'\n\s*cities: \[(.*?)\]', b)
        if sm and cm:
            d[sm.group(1)] = len(re.findall(r'"[a-z0-9-]+"', cm.group(1)))
    return d


def arr(xs): return "[" + ", ".join(f'"{x}"' for x in xs) + "]"


def places_for(cities, nature_only=False, mx=28):
    out, seen = [], set()
    for c in cities:
        for r in nb.get(c, []):
            if nature_only and r["category"] not in NATURE_CATS:
                continue
            if r["slug"] not in seen:
                seen.add(r["slug"]); out.append(r["slug"])
    return out[:mx]


def make_regional(cc, cities):
    places = places_for(cities, mx=28)
    assert 5 <= len(places) <= 30 and 2 <= len(cities) <= 80, f"{cc} regional bounds"
    desc = (f"{CN[cc]} Weekend Escapes groups {len(places)} nearby places across {len(cities)} cities "
            f"for local-first day and weekend discovery — parks, mountains, lakes, coast and protected "
            f"areas. This is a geographic discovery collection derived from regional weekend-escape "
            f"geography; it is not a tourism ranking and uses no popularity or visitor data. Verify "
            f"access, transport, weather, health, and safety with official sources before visiting.")
    return ("  {\n"
            f'    slug: "{cc}-weekend-escapes",\n    title: "{CN[cc]} Weekend Escapes",\n'
            f"    description:\n      {json.dumps(desc, ensure_ascii=False)},\n"
            '    regionType: "weekend_escape_region",\n'
            f"    cities: {arr(cities)},\n    nearbyPlaces: {arr(places)},\n"
            f"    featuredPlaces: {arr(places[:8])},\n    featuredCities: {arr(cities[:6])},\n"
            f"    relatedCollections: {arr(REG_RELATED)},\n" + "  },\n")


def make_thematic(cc, cities):
    places = places_for(cities, nature_only=True, mx=40)
    assert 5 <= len(places) <= 50 and 2 <= len(cities) <= 80, f"{cc} thematic bounds ({len(places)}p)"
    desc = (f"{CN[cc]} Weekend Nature Retreats is a thematic discovery collection of {len(places)} nearby "
            f"places across {len(cities)} cities — parks, mountains, lakes and nature areas. Grouped by "
            f"outdoor theme for local-first day and weekend discovery; derived deterministically from "
            f"place categories and Wikidata classifications, not popularity or rankings. Verify access, "
            f"transport, weather, health, and safety with official sources before visiting.")
    wt = cities[:min(10, len(cities))]
    pe = sum(1 for p in places if p in DETAIL_SET)
    return ("  {\n"
            f'    slug: "{cc}-weekend-nature-retreats",\n    title: "{CN[cc]} Weekend Nature Retreats",\n'
            f"    description:\n      {json.dumps(desc, ensure_ascii=False)},\n"
            '    themeType: "weekend_nature_retreats",\n'
            f"    cities: {arr(cities)},\n    nearbyPlaces: {arr(places)},\n"
            f"    featuredPlaces: {arr(places[:8])},\n    featuredCities: {arr(cities[:6])},\n"
            f"    weekendTrips: {arr(wt)},\n    visualGuides: {arr(wt)},\n"
            f"    officialPhotoCount: 0,\n    communityPhotoCount: 0,\n    photoEligiblePlaceCount: {pe},\n"
            f"    relatedCollections: {arr(THE_RELATED)},\n" + "  },\n")


def insert_records(path, array_const, records):
    text = path.read_text()
    close = text.index("\n];\n", text.index(array_const))
    path.write_text(text[:close] + "\n" + "".join(records).rstrip("\n") + text[close:])


def splice_cities(path, adds):
    text = path.read_text()
    parts = text.split("\n  {\n")
    for i in range(1, len(parts)):
        sm = re.search(r'slug:\s*"([a-z0-9-]+)"', parts[i])
        if not sm or sm.group(1) not in adds:
            continue
        m = re.search(r'(\n(\s*)cities: \[)(.*?)(\])', parts[i])
        existing = re.findall(r'"([^"]+)"', m.group(3))
        ins = "".join(f', "{c}"' for c in adds[sm.group(1)] if c not in existing)
        parts[i] = parts[i][:m.start()] + m.group(1) + m.group(3) + ins + m.group(4) + parts[i][m.end():]
    path.write_text("\n  {\n".join(parts))


# ---------- REGIONAL ----------
rtext = RC.read_text()
rcov = coverage(rtext); rsize = sizes(rtext)
noreg = [s for s in new if rcov.get(s, 0) < 1]
by = defaultdict(list)
for s in noreg:
    by[country[s]].append(s)
print("regional gaps:", {k: len(v) for k, v in by.items()})
reg_records = []
for cc, cities in by.items():
    if len(cities) >= 2:
        reg_records.append(make_regional(cc, cities))
    else:  # single-gap country -> splice into a room-having continental collection
        tgt = next((t for t in REG_RELATED if rsize.get(t, CAP) < CAP), None)
        assert tgt, f"no room to splice {cc} single gap"
        splice_cities(RC, {tgt: cities}); rsize[tgt] += len(cities)
        print(f"  spliced {cc} single gap -> {tgt}")
if reg_records:
    insert_records(RC, "REGIONAL_DISCOVERY_COLLECTIONS", reg_records)
    print(f"created {len(reg_records)} regional collections: {[cc + '-weekend-escapes' for cc, c in by.items() if len(c) >= 2]}")

# ---------- THEMATIC ----------
ttext = TC.read_text()
tcov = coverage(ttext)
nothe = [s for s in new if tcov.get(s, 0) < 1]
byt = defaultdict(list)
for s in nothe:
    byt[country[s]].append(s)
print("thematic gaps:", {k: len(v) for k, v in byt.items()})
the_records = [make_thematic(cc, cities) for cc, cities in byt.items() if len(cities) >= 2]
if the_records:
    insert_records(TC, "THEMATIC_COLLECTIONS", the_records)
    print(f"created {len(the_records)} thematic collections")

# ---------- verify ----------
rc2 = coverage(RC.read_text()); tc2 = coverage(TC.read_text())
sr = [s for s in new if rc2.get(s, 0) < 1]; st = [s for s in new if tc2.get(s, 0) < 1]
mr = max(sizes(RC.read_text()).values()); mt = max(sizes(TC.read_text()).values())
print(f"after: new w/o regional={len(sr)} w/o thematic={len(st)} | max reg={mr} max the={mt}")
print(f"regional collections={len(sizes(RC.read_text()))} thematic={len(sizes(TC.read_text()))}")
assert not sr and not st and mr <= CAP and mt <= CAP, "gap fill incomplete or CAP exceeded"
print("GAP FILL OK")
