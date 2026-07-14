#!/usr/bin/env python3
"""Fill collection gaps for wave19. The under-represented countries (RU/TR/UA/BY/IL/RS/
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
sel = json.load(open("/tmp/w19/selected.json"))
country = {c["slug"]: c["countrySlug"] for c in sel}
CN = {"brazil": "Brazil", "mexico": "Mexico", "argentina": "Argentina", "colombia": "Colombia",
      "chile": "Chile", "peru": "Peru", "ecuador": "Ecuador", "bolivia": "Bolivia", "uruguay": "Uruguay",
      "paraguay": "Paraguay", "costa-rica": "Costa Rica", "panama": "Panama", "dominican-republic": "Dominican Republic"}
new = [c["slug"] for c in sel]
nb = json.load(open("/tmp/w19/nearby.json"))
# wave19 sibling collections (populated before each loop); each created collection
# references 3 siblings, never itself, all valid post-run.
REG_POOL = []
THE_POOL = []
REG_RELATED = ["europe-weekend-escapes", "asia-weekend-escapes"]  # splice fallback (unused: all countries create)
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


LAT = {c["slug"]: c["lat"] for c in sel}
def chunks(cc, cities, kind):
    """One collection per country, EXCEPT countries over the 80-city collection cap
    (Japan/China at 100) split into latitude-sorted northern/southern halves."""
    suf = "-weekend-escapes" if kind == "escapes" else "-weekend-nature-retreats"
    lab = "Weekend Escapes" if kind == "escapes" else "Weekend Nature Retreats"
    if len(cities) <= 78:
        return [(f"{cc}{suf}", f"{CN[cc]} {lab}", cities)]
    ordered = sorted(cities, key=lambda s: LAT.get(s, 0))
    mid = len(ordered) // 2
    return [(f"southern-{cc}{suf}", f"Southern {CN[cc]} {lab}", ordered[:mid]),
            (f"northern-{cc}{suf}", f"Northern {CN[cc]} {lab}", ordered[mid:])]


def make_regional(slug, title, cities):
    places = places_for(cities, mx=28)
    assert 5 <= len(places) <= 30 and 2 <= len(cities) <= 80, f"{slug} regional bounds (c={len(cities)} p={len(places)})"
    desc = (f"{title} groups {len(places)} nearby places across {len(cities)} cities "
            f"for local-first day and weekend discovery — parks, mountains, lakes, coast and protected "
            f"areas. This is a geographic discovery collection derived from regional weekend-escape "
            f"geography; it is not a tourism ranking and uses no popularity or visitor data. Verify "
            f"access, transport, weather, health, and safety with official sources before visiting.")
    return ("  {\n"
            f'    slug: "{slug}",\n    title: "{title}",\n'
            f"    description:\n      {json.dumps(desc, ensure_ascii=False)},\n"
            '    regionType: "weekend_escape_region",\n'
            f"    cities: {arr(cities)},\n    nearbyPlaces: {arr(places)},\n"
            f"    featuredPlaces: {arr(places[:8])},\n    featuredCities: {arr(cities[:6])},\n"
            f"    relatedCollections: {arr([x for x in REG_POOL if x != slug][:3])},\n" + "  },\n")


def make_thematic(slug, title, cities):
    places = places_for(cities, nature_only=True, mx=40)
    assert 5 <= len(places) <= 50 and 2 <= len(cities) <= 80, f"{slug} thematic bounds ({len(places)}p)"
    desc = (f"{title} is a thematic discovery collection of {len(places)} nearby "
            f"places across {len(cities)} cities — parks, mountains, lakes and nature areas. Grouped by "
            f"outdoor theme for local-first day and weekend discovery; derived deterministically from "
            f"place categories and Wikidata classifications, not popularity or rankings. Verify access, "
            f"transport, weather, health, and safety with official sources before visiting.")
    wt = cities[:min(10, len(cities))]
    pe = sum(1 for p in places if p in DETAIL_SET)
    return ("  {\n"
            f'    slug: "{slug}",\n    title: "{title}",\n'
            f"    description:\n      {json.dumps(desc, ensure_ascii=False)},\n"
            '    themeType: "weekend_nature_retreats",\n'
            f"    cities: {arr(cities)},\n    nearbyPlaces: {arr(places)},\n"
            f"    featuredPlaces: {arr(places[:8])},\n    featuredCities: {arr(cities[:6])},\n"
            f"    weekendTrips: {arr(wt)},\n    visualGuides: {arr(wt)},\n"
            f"    officialPhotoCount: 0,\n    communityPhotoCount: 0,\n    photoEligiblePlaceCount: {pe},\n"
            f"    relatedCollections: {arr([x for x in THE_POOL if x != slug][:3])},\n" + "  },\n")


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
REG_CHUNKS = []
for cc, cities in by.items():
    if len(cities) >= 2:
        REG_CHUNKS += chunks(cc, cities, "escapes")
    else:  # single-gap country -> splice into a room-having continental collection
        tgt = next((t for t in REG_RELATED if rsize.get(t, CAP) < CAP), None)
        assert tgt, f"no room to splice {cc} single gap"
        splice_cities(RC, {tgt: cities}); rsize[tgt] += len(cities)
        print(f"  spliced {cc} single gap -> {tgt}")
REG_POOL[:] = [slug for slug, _, _ in REG_CHUNKS]
reg_records = [make_regional(slug, title, cs) for slug, title, cs in REG_CHUNKS]
if reg_records:
    insert_records(RC, "REGIONAL_DISCOVERY_COLLECTIONS", reg_records)
    print(f"created {len(reg_records)} regional collections: {REG_POOL}")

# ---------- THEMATIC ----------
ttext = TC.read_text()
tcov = coverage(ttext)
nothe = [s for s in new if tcov.get(s, 0) < 1]
byt = defaultdict(list)
for s in nothe:
    byt[country[s]].append(s)
print("thematic gaps:", {k: len(v) for k, v in byt.items()})
THE_CHUNKS = []
for cc, cities in byt.items():
    if len(cities) >= 2:
        THE_CHUNKS += chunks(cc, cities, "nature-retreats")
THE_POOL[:] = [slug for slug, _, _ in THE_CHUNKS]
the_records = [make_thematic(slug, title, cs) for slug, title, cs in THE_CHUNKS]
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
