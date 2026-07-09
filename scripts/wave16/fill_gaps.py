#!/usr/bin/env python3
"""Fill regional-collection gaps for wave16 (thematic had 0 gaps):
 - Norway (35, all): the Nordic northern-europe-weekend-escapes is now full (splice
   filled it with SE/DK/FI cities), and Norway has no other Nordic regional home. CREATE
   a NEW `norway-weekend-escapes` (weekend_escape_region — no place-category constraint),
   like every country has its own. Additive (collection count grows, not reduced);
   existing RegionalCollection schema; MAX_CITIES guard untouched.
 - Slovakia (4) / Croatia (2): splice into LIVE room-having, geographically-apt existing
   collections (czechia-slovakia-borderlands / croatia-mountains)."""
import re, json
from pathlib import Path
from collections import Counter

ROOT = Path("/Users/agent/global-city-intelligence")
RC = ROOT / "lib/data/regional-collections.ts"
CAP = 80
sel = json.load(open("/tmp/w16/selected.json"))
country = {c["slug"]: c["countrySlug"] for c in sel}
new = [c["slug"] for c in sel]
nb = json.load(open("/tmp/w16/nearby.json"))


def parse(text):
    out = []
    for b in text.split("\n  {\n")[1:]:
        sm = re.search(r'slug:\s*"([a-z0-9-]+)"', b)
        cm = re.search(r'\n\s*cities: \[(.*?)\]', b)
        if sm and cm:
            out.append((sm.group(1), re.findall(r'"([a-z0-9-]+)"', cm.group(1))))
    return out


text = RC.read_text()
parsed = parse(text)
rsize = {s: len(c) for s, c in parsed}
rcov = Counter()
for _, cs in parsed:
    for c in cs:
        rcov[c] += 1
noreg = [s for s in new if rcov.get(s, 0) < 1]
by_country = {}
for s in noreg:
    by_country.setdefault(country[s], []).append(s)
print("regional gaps:", {k: len(v) for k, v in by_country.items()})

# ---- 1. CREATE norway-weekend-escapes ----
no_cities = by_country.get("norway", [])
assert "norway-weekend-escapes" not in rsize, "already exists"
# 5-30 nearby places from the Norwegian cities (weekend_escape_region: any category)
places = []
seen = set()
for c in no_cities:
    for r in nb.get(c, []):
        if r["slug"] not in seen:
            seen.add(r["slug"]); places.append(r["slug"])
places = places[:28]
assert 5 <= len(places) <= 30 and 2 <= len(no_cities) <= 80
feat_places = places[:8]
feat_cities = no_cities[:5]
related = ["northern-europe-weekend-escapes", "baltic-sea-coast", "sweden-national-parks", "finland-national-parks"]
related = [r for r in related if r in rsize]  # keep only existing
desc = (f"Norway Weekend Escapes groups {len(places)} nearby places across {len(no_cities)} cities "
        f"for local-first day and weekend discovery — fjords, mountains, waterfalls, coast and "
        f"protected areas. This is a geographic discovery collection derived from regional "
        f"weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor "
        f"data. Verify access, transport, weather, health, and safety with official sources before visiting.")
def arr(xs): return "[" + ", ".join(f'"{x}"' for x in xs) + "]"
record = (
    "  {\n"
    '    slug: "norway-weekend-escapes",\n'
    '    title: "Norway Weekend Escapes",\n'
    "    description:\n"
    f"      {json.dumps(desc, ensure_ascii=False)},\n"
    '    regionType: "weekend_escape_region",\n'
    f"    cities: {arr(no_cities)},\n"
    f"    nearbyPlaces: {arr(places)},\n"
    f"    featuredPlaces: {arr(feat_places)},\n"
    f"    featuredCities: {arr(feat_cities)},\n"
    f"    relatedCollections: {arr(related)},\n"
    "  },\n"
)
# insert before the array's closing "\n];" (the one preceding assertRegionalCollections)
close = text.index("\n];\n", text.index("REGIONAL_DISCOVERY_COLLECTIONS"))
text = text[:close] + "\n" + record.rstrip("\n") + text[close:]
RC.write_text(text)
print(f"created norway-weekend-escapes: {len(no_cities)} cities, {len(places)} places, related={related}")

# ---- 2. splice Slovakia / Croatia into LIVE room-having homes ----
text = RC.read_text()
rsize = {s: len(c) for s, c in parse(text)}
TARGET = {"slovakia": ["czechia-slovakia-borderlands", "poland-slovakia-borderlands", "hungary-slovakia-borderlands"],
          "croatia": ["croatia-mountains", "croatia-slovenia-borderlands"]}
adds = {}
for cc in ("slovakia", "croatia"):
    for s in by_country.get(cc, []):
        tgt = next((t for t in TARGET[cc] if rsize.get(t, CAP) < CAP), None)
        assert tgt, f"no room for {s} in {TARGET[cc]}"
        adds.setdefault(tgt, []).append(s); rsize[tgt] += 1
if adds:
    parts = text.split("\n  {\n")
    for i in range(1, len(parts)):
        sm = re.search(r'slug:\s*"([a-z0-9-]+)"', parts[i])
        if not sm or sm.group(1) not in adds: continue
        m = re.search(r'(\n(\s*)cities: \[)(.*?)(\])', parts[i])
        existing = re.findall(r'"([^"]+)"', m.group(3))
        ins = "".join(f', "{c}"' for c in adds[sm.group(1)] if c not in existing)
        parts[i] = parts[i][:m.start()] + m.group(1) + m.group(3) + ins + m.group(4) + parts[i][m.end():]
    RC.write_text("\n  {\n".join(parts))
    print("spliced:", {k: len(v) for k, v in adds.items()})

# ---- verify ----
final = parse(RC.read_text())
cov = Counter()
for _, cs in final:
    for c in cs:
        cov[c] += 1
still = [s for s in new if cov.get(s, 0) < 1]
mx = max(len(c) for _, c in final)
print(f"after: new w/o regional={len(still)} | max regional={mx} | total regional collections={len(final)}")
assert not still and mx <= CAP, "incomplete or CAP exceeded"
print("GAP FILL OK")
