#!/usr/bin/env python3
"""Fix wrong collection memberships found by the audit: remove inland cities from
sea-coast collections + far cities from cross-border collections. Deterministic
cross-border distance sweep (>75km from centroid). Guarantees every new city keeps
>=1 regional (re-adds to <country>-weekend-escapes if a removal drops it to 0)."""
import json, re, math
from pathlib import Path
ROOT = Path("/Users/agent/global-city-intelligence")
OUT = Path("/tmp/w11")
cd = json.load(open(OUT / "collections_data.json"))
coords = json.load(open(OUT / "all_city_coords.json"))
newset = set(c["slug"] for c in json.load(open(OUT / "selected.json")))
cc_of = {c["slug"]: c["countrySlug"] for c in json.load(open(OUT / "selected.json"))}
reg_by = {r["slug"]: r for r in cd["regional"]}

def hav(a, b, c, d):
    r = math.radians
    return 2*6371*math.asin(math.sqrt(math.sin((r(c)-r(a))/2)**2 + math.cos(r(a))*math.cos(r(c))*math.sin((r(d)-r(b))/2)**2))

# explicit agent-flagged removals (collection, city)
removals = {
    ("baltic-sea-coast", "brandenburg-an-der-havel"), ("baltic-sea-coast", "frankfurt-oder"),
    ("united-states-coast", "davenport"), ("belgium-netherlands-borderlands", "doetinchem"),
    ("germany-luxembourg-borderlands", "ludenscheid"), ("germany-luxembourg-borderlands", "unna"),
    ("germany-luxembourg-borderlands", "wesel"), ("european-coast", "bourg-en-bresse"),
    ("european-coast", "deventer"), ("european-coast", "macon-fr"), ("european-coast", "montauban"),
    ("european-coast", "neuwied"), ("european-coast", "rosenheim"),
    ("belgium-germany-borderlands", "unna"), ("belgium-germany-borderlands", "wesel"),
}

# read current cities per regional collection (post-splice)
text = (ROOT / "lib/data/regional-collections.ts").read_text()
blocks = re.split(r"\n  \{\n", text)
cur = {}
for b in blocks:
    sm = re.search(r'slug:\s*"([a-z0-9-]+)"', b)
    cm = re.search(r'\n\s*cities: \[(.*?)\]', b)
    if sm and cm: cur[sm.group(1)] = re.findall(r'"([^"]+)"', cm.group(1))

# deterministic cross-border sweep: remove NEW city from cross_border coll if >75km from centroid
for r in cd["regional"]:
    if r["type"] != "cross_border_region" or not r["centroid"]:
        continue
    cent = r["centroid"]
    for city in cur.get(r["slug"], []):
        if city in newset and city in coords:
            if hav(coords[city][0], coords[city][1], cent[0], cent[1]) > 75:
                removals.add((r["slug"], city))

# apply removals + track coverage
removed_count = 0
for i, b in enumerate(blocks):
    sm = re.search(r'slug:\s*"([a-z0-9-]+)"', b)
    if not sm: continue
    slug = sm.group(1)
    drop = {c for (s, c) in removals if s == slug}
    if not drop: continue
    m = re.search(r'(\n\s*cities: \[)(.*?)(\])', b)
    cities = re.findall(r'"([^"]+)"', m.group(2))
    kept = [c for c in cities if c not in drop]
    removed_count += len(cities) - len(kept)
    newarr = m.group(1) + ", ".join(f'"{c}"' for c in kept) + m.group(3)
    blocks[i] = b[:m.start()] + newarr + b[m.end():]
text = "\n  {\n".join(blocks)
(ROOT / "lib/data/regional-collections.ts").write_text(text)
print(f"removed {removed_count} wrong regional memberships ({len(removals)} pairs)")

# verify every new city still in >=1 regional; re-add to <country>-weekend-escapes if not
text = (ROOT / "lib/data/regional-collections.ts").read_text()
blocks = re.split(r"\n  \{\n", text)
city_in = {}
for b in blocks:
    sm = re.search(r'slug:\s*"([a-z0-9-]+)"', b)
    cm = re.search(r'\n\s*cities: \[(.*?)\]', b)
    if sm and cm:
        for c in re.findall(r'"([^"]+)"', cm.group(1)):
            city_in.setdefault(c, []).append(sm.group(1))
no_reg = [c for c in newset if c not in city_in]
print("new cities with 0 regional after removal:", no_reg)
if no_reg:
    readd = {}
    for c in no_reg:
        readd.setdefault(f"{cc_of[c]}-weekend-escapes", []).append(c)
    for i, b in enumerate(blocks):
        sm = re.search(r'slug:\s*"([a-z0-9-]+)"', b)
        if sm and sm.group(1) in readd:
            m = re.search(r'(\n\s*cities: \[)(.*?)(\])', b)
            ins = "".join(f', "{c}"' for c in readd[sm.group(1)])
            blocks[i] = b[:m.start()] + m.group(1) + m.group(2) + ins + m.group(3) + b[m.end():]
            print(f"  re-added {readd[sm.group(1)]} to {sm.group(1)}")
    (ROOT / "lib/data/regional-collections.ts").write_text("\n  {\n".join(blocks))
print("FIX DONE")
