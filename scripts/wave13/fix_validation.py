#!/usr/bin/env python3
"""Post-wire validation fixes:
1. Revert MAX_CITIES 84->80 (do not touch the guard); move the 4 overflow US cities
   from full united-states-mountains into room-having united-states-national-parks
   (national_park_region, no proximity gate; all 4 are within weekend range of major
   federal/state parkland).
2. Drop the sheet-hedges-wood-near-{nuneaton,loughborough} nearby place: its only two
   Commons photos are both named "Sheet ...", a false positive on the cartography
   `/Sheet_` heuristic. Both cities keep 7 verified nearby (>=5). Removes seed records,
   VERIFIED_IMAGES, discovery-graph nodes, and all inbound graph edges."""
import re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
FOUR = ["caldwell", "troy", "newnan", "chico"]

# ---------- 1. collections ----------
rc = ROOT / "lib/data/regional-collections.ts"
s = rc.read_text()
assert "const MAX_CITIES = 84;" in s
s = s.replace("const MAX_CITIES = 84;", "const MAX_CITIES = 80;")

def cities_array(text, coll_slug):
    m = re.search(r'(slug: "' + re.escape(coll_slug) + r'",[\s\S]*?\n\s*cities: \[)(.*?)(\])', text)
    assert m, f"{coll_slug} not found"
    return m

# remove the 4 from united-states-mountains
m = cities_array(s, "united-states-mountains")
kept = [c for c in re.findall(r'"([^"]+)"', m.group(2)) if c not in FOUR]
new_inner = ", ".join(f'"{c}"' for c in kept)
s = s[:m.start()] + m.group(1) + new_inner + m.group(3) + s[m.end():]
print(f"united-states-mountains -> {len(kept)} cities (removed {FOUR})")

# add the 4 to united-states-national-parks
m = cities_array(s, "united-states-national-parks")
existing = re.findall(r'"([^"]+)"', m.group(2))
to_add = [c for c in FOUR if c not in existing]
insert = "".join(f', "{c}"' for c in to_add)
s = s[:m.start()] + m.group(1) + m.group(2) + insert + m.group(3) + s[m.end():]
rc.write_text(s)
print(f"united-states-national-parks -> {len(existing)+len(to_add)} cities (+{to_add})")

# ---------- 2. drop sheet-hedges-wood ----------
SLUGS = ["sheet-hedges-wood-near-nuneaton", "sheet-hedges-wood-near-loughborough"]

# 2a. nearby-places.ts: seed records + VERIFIED_IMAGES
np = ROOT / "lib/data/nearby-places.ts"
t = np.read_text()
for sl in SLUGS:
    # seed record: "  {\n    slug: \"sl\", ... \n  },"
    t2 = re.sub(r'\n  \{\n    slug: "' + re.escape(sl) + r'",[\s\S]*?\n  \},', '', t, count=1)
    assert t2 != t, f"seed record for {sl} not removed"
    t = t2
    # VERIFIED_IMAGES entry: "\n  \"sl\": {\n ... \n  },"
    t2 = re.sub(r'\n  "' + re.escape(sl) + r'": \{\n[\s\S]*?\n  \},', '', t, count=1)
    assert t2 != t, f"VERIFIED_IMAGES for {sl} not removed"
    t = t2
np.write_text(t)
print(f"nearby-places.ts: removed {len(SLUGS)} seed records + images")

# 2b. discovery graph: node blocks + inbound edge lines
g = ROOT / "lib/data/nearby-place-discovery-graph.ts"
gt = g.read_text()
for sl in SLUGS:
    # node block: "  \"sl\": [\n ... \n  ],"
    gt2 = re.sub(r'\n  "' + re.escape(sl) + r'": \[\n[\s\S]*?\n  \],', '', gt, count=1)
    assert gt2 != gt, f"graph node for {sl} not removed"
    gt = gt2
    # inbound edge lines referencing this slug as a target
    gt = re.sub(r'\n *\{ placeSlug: "' + re.escape(sl) + r'",[^\n]*\},', '', gt)
g.write_text(gt)
# report residual references (should be 0)
resid = sum(gt.count(f'"{sl}"') for sl in SLUGS)
print(f"nearby-place-discovery-graph.ts: nodes + inbound edges removed; residual refs={resid}")
