#!/usr/bin/env python3
"""Extract deterministic per-city signals for the Safety & Quality-of-Life
generator. Reads existing repo data (cities.ts scores, climate.ts comfortScore,
nearby-places.ts nature density, city-discovery-graph.ts coastal/mountain/lake
cluster flags) + /tmp/col_cities.json (population/affordability/region) and
writes /tmp/quality_signals.json. No network, no randomness."""
import json, re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
col = json.load(open("/tmp/col_cities.json"))  # slug,name,countrySlug,region,population,affordability

# --- 1. scores.{overall,affordability,airQuality,energy,resilience} from cities.ts ---
cities_src = (ROOT / "lib/data/cities.ts").read_text()
slug_pos = [(m.start(), m.group(1)) for m in re.finditer(r'\bslug: "([a-z0-9][a-z0-9-]*)"', cities_src)]
scores = {}
for m in re.finditer(
    r'scores: \{ overall: (\d+), affordability: (\d+), airQuality: (\d+), energy: (\d+), resilience: (\d+) \}',
    cities_src,
):
    # pair each scores block with the nearest preceding slug
    prev = None
    for pos, slug in slug_pos:
        if pos < m.start():
            prev = slug
        else:
            break
    if prev is not None:
        scores[prev] = {
            "overall": int(m.group(1)), "affordability": int(m.group(2)),
            "airQuality": int(m.group(3)), "energy": int(m.group(4)),
            "resilience": int(m.group(5)),
        }

# --- 2. comfortScore from climate.ts ---
clim_src = (ROOT / "lib/data/climate.ts").read_text()
clim_slug_pos = [(m.start(), m.group(1)) for m in re.finditer(r'citySlug: "([a-z0-9-]+)"', clim_src)]
comfort = {}
for m in re.finditer(r'comfortScore: (\d+)', clim_src):
    prev = None
    for pos, slug in clim_slug_pos:
        if pos < m.start():
            prev = slug
        else:
            break
    if prev is not None and prev not in comfort:
        comfort[prev] = int(m.group(1))

# --- 3. nature density from nearby-places.ts ---
NATURE = {"nature", "park", "mountain", "lake", "beach", "island", "waterfront", "family_outdoor"}
near_src = (ROOT / "lib/data/nearby-places.ts").read_text()
nature_count = {}
for m in re.finditer(r'category: "([a-z_]+)"[\s\S]*?connectedCitySlugs: \[([^\]]*)\]', near_src):
    cat = m.group(1)
    if cat not in NATURE:
        continue
    for cm in re.finditer(r'"([a-z0-9-]+)"', m.group(2)):
        nature_count[cm.group(1)] = nature_count.get(cm.group(1), 0) + 1

# --- 4. coastal / mountain / lake cluster flags from city-discovery-graph.ts ---
disc_src = (ROOT / "lib/data/city-discovery-graph.ts").read_text()
flags = {}
for m in re.finditer(r'"([a-z0-9-]+)":\s*\[(.*?)\]', disc_src, re.DOTALL):
    slug, block = m.group(1), m.group(2)
    flags[slug] = {
        "coastal": "coastal_cluster" in block,
        "mountain": "mountain_cluster" in block,
        "lake": "lake_cluster" in block,
    }

# --- merge ---
out = []
missing = []
for c in col:
    s = c["slug"]
    sc = scores.get(s)
    if sc is None:
        missing.append(s)
        sc = {"overall": 50, "affordability": c.get("affordability", 50),
              "airQuality": 55, "energy": 55, "resilience": 50}
    fl = flags.get(s, {"coastal": False, "mountain": False, "lake": False})
    out.append({
        "slug": s,
        "name": c["name"],
        "countrySlug": c["countrySlug"],
        "region": c["region"],
        "population": c["population"],
        "overall": sc["overall"],
        "affordability": sc["affordability"],
        "airQuality": sc["airQuality"],
        "energy": sc["energy"],
        "resilience": sc["resilience"],
        "comfort": comfort.get(s, 60),
        "natureCount": nature_count.get(s, 0),
        "coastal": fl["coastal"],
        "mountain": fl["mountain"],
        "lake": fl["lake"],
    })

json.dump(out, open("/tmp/quality_signals.json", "w"), ensure_ascii=False)
print(f"wrote {len(out)} city signal records")
print(f"scores extracted: {len(scores)}; comfort: {len(comfort)}; "
      f"nature cities: {len(nature_count)}; cluster nodes: {len(flags)}")
if missing:
    print(f"WARNING: {len(missing)} cities missing scores (used fallback): {missing[:10]}")
# spot checks
by = {r["slug"]: r for r in out}
for s in ("copenhagen", "new-york", "vienna", "norfolk", "singapore", "tokyo", "zurich"):
    if s in by:
        r = by[s]
        print(f"  {s:14s} overall={r['overall']} air={r['airQuality']} comfort={r['comfort']} "
              f"nature={r['natureCount']} coastal={r['coastal']} mtn={r['mountain']}")
