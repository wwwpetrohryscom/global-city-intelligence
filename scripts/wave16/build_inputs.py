#!/usr/bin/env python3
"""Wave 13 input builder (no network). Two outputs consumed downstream:
  /tmp/w16/existing_nearby_slugs.json  — every existing nearby-place slug (dedup
                                         target for nearby_resolve).
  /tmp/w16/collections_data.json       — derived {regional,thematic} view that
                                         assign_collections.py expects:
       regional: {slug, type(=regionType), countries[derived], centroid[derived], cities}
       thematic: {slug, type(=themeType), countries[derived], cities}
Countries are derived from each collection's member cities (slug->countrySlug from
existing_cities.json). Centroid = mean of member-city coords present in
all_city_coords.json (regional only; thematic don't use proximity). Idempotent."""
import json, re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
OUT = Path("/tmp/w16")

# ---- 1. existing nearby-place slugs ----
np = (ROOT / "lib/data/nearby-places.ts").read_text()
slugs = set()
for ch in re.split(r'(?=slug: ")', np):
    m = re.match(r'slug: "([a-z0-9-]+)"', ch)
    if m:
        slugs.add(m.group(1))
json.dump(sorted(slugs), open(OUT / "existing_nearby_slugs.json", "w"))
print(f"existing_nearby_slugs.json: {len(slugs)} slugs")

# ---- 2. collections_data.json (needs existing_cities + coords) ----
ec_path = OUT / "existing_cities.json"
coords_path = OUT / "all_city_coords.json"
if not ec_path.exists():
    print("existing_cities.json absent -> skip collections_data (run after extract_existing)")
    raise SystemExit(0)

country_by_slug = {c["slug"]: c["countrySlug"] for c in json.load(open(ec_path))}
# fold new selected cities too (harmless; they aren't members yet)
if (OUT / "selected.json").exists():
    for c in json.load(open(OUT / "selected.json")):
        country_by_slug.setdefault(c["slug"], c["countrySlug"])
coords = json.load(open(coords_path)) if coords_path.exists() else {}


def parse_records(path, type_field):
    """Brace-depth parse each top-level {...} record; pull slug, <type_field>, cities[]."""
    s = (ROOT / path).read_text()
    o = s.index("[", s.index("=", s.index("export const")))
    depth, end = 0, o
    for j in range(o, len(s)):
        if s[j] == "[":
            depth += 1
        elif s[j] == "]":
            depth -= 1
            if depth == 0:
                end = j
                break
    arr = s[o + 1:end]
    recs, bd, rs = [], 0, None
    for j, ch in enumerate(arr):
        if ch == "{":
            if bd == 0:
                rs = j
            bd += 1
        elif ch == "}":
            bd -= 1
            if bd == 0 and rs is not None:
                blk = arr[rs:j + 1]
                sm = re.search(r'slug:\s*"([a-z0-9-]+)"', blk)
                tm = re.search(type_field + r':\s*"([a-z0-9_]+)"', blk)
                cm = re.search(r'\bcities:\s*\[([^\]]*)\]', blk)
                if sm and tm:
                    cities = re.findall(r'"([a-z0-9-]+)"', cm.group(1)) if cm else []
                    recs.append({"slug": sm.group(1), "type": tm.group(1), "cities": cities})
                rs = None
    return recs


def countries_of(cities):
    return sorted({country_by_slug[c] for c in cities if c in country_by_slug})


def centroid_of(cities):
    pts = [coords[c] for c in cities if c in coords]
    if not pts:
        return None
    return [round(sum(p[0] for p in pts) / len(pts), 5), round(sum(p[1] for p in pts) / len(pts), 5)]


regional = []
for r in parse_records("lib/data/regional-collections.ts", "regionType"):
    regional.append({"slug": r["slug"], "type": r["type"], "cities": r["cities"],
                     "countries": countries_of(r["cities"]), "centroid": centroid_of(r["cities"])})
thematic = []
for t in parse_records("lib/data/thematic-collections.ts", "themeType"):
    thematic.append({"slug": t["slug"], "type": t["type"], "cities": t["cities"],
                     "countries": countries_of(t["cities"])})

json.dump({"regional": regional, "thematic": thematic}, open(OUT / "collections_data.json", "w"))
print(f"collections_data.json: {len(regional)} regional, {len(thematic)} thematic "
      f"({sum(1 for r in regional if r['centroid']) } regional w/ centroid)")
