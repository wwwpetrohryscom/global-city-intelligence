#!/usr/bin/env python3
"""Wave 14 validation fixes:
1. Drop 9 contaminated nearby records the resolver let through: 2 county-map images
   (waconda-lake), 4 whole-landmass "Great Britain" satellite images (genuine-nature
   filter miss — the country is not a weekend destination), 3 satellite/urban-river-
   island images (isle-of-bute, dutton-island, ross-island). Removes seed +
   VERIFIED_IMAGES + discovery-graph node + inbound edges. Each affected city keeps 7
   verified nearby (>=5).
2. Sanitize the escaped-quote place name E. P. "Tom" Sawyer State Park -> E. P. Tom
   Sawyer State Park (escaped quotes break the validator's name:"([^"]+)" regex)."""
import json, re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
DROP = ["waconda-lake-near-hutchinson", "waconda-lake-near-salina",
        "isle-of-bute-near-dumbarton", "dutton-island-near-vacaville",
        "great-britain-near-widnes", "great-britain-near-stretford",
        "great-britain-near-accrington", "great-britain-near-bootle",
        "ross-island-near-beaverton"]

# ---- 1a. nearby-places.ts: seeds + VERIFIED_IMAGES + escaped-quote sanitize ----
np = ROOT / "lib/data/nearby-places.ts"
t = np.read_text()
for sl in DROP:
    t2 = re.sub(r'\n  \{\n    slug: "' + re.escape(sl) + r'",[\s\S]*?\n  \},', '', t, count=1)
    assert t2 != t, f"seed {sl} not removed"
    t = t2
    t2 = re.sub(r'\n  "' + re.escape(sl) + r'": \{\n[\s\S]*?\n  \},', '', t, count=1)
    assert t2 != t, f"VERIFIED_IMAGES {sl} not removed"
    t = t2
assert 'E. P. \\"Tom\\" Sawyer' in t, "escaped-quote name not found"
t = t.replace('E. P. \\"Tom\\" Sawyer', 'E. P. Tom Sawyer')
np.write_text(t)
print(f"nearby-places.ts: dropped {len(DROP)} seeds+images; sanitized E. P. Tom Sawyer")

# ---- 1b. discovery graph: nodes + inbound edges ----
g = ROOT / "lib/data/nearby-place-discovery-graph.ts"
gt = g.read_text()
for sl in DROP:
    gt2 = re.sub(r'\n  "' + re.escape(sl) + r'": \[\n[\s\S]*?\n  \],', '', gt, count=1)
    assert gt2 != gt, f"graph node {sl} not removed"
    gt = gt2
    gt = re.sub(r'\n *\{ placeSlug: "' + re.escape(sl) + r'",[^\n]*\},', '', gt)
g.write_text(gt)
resid = sum(gt.count(f'"{sl}"') for sl in DROP)
print(f"discovery-graph: nodes + inbound edges removed; residual refs={resid}")

# ---- 1c. facts + detail (defensive; none expected) ----
for rel in ("lib/data/nearby-place-facts.ts", "lib/data/nearby-place-detail-pages.ts"):
    p = ROOT / rel
    s = p.read_text()
    for sl in DROP:
        s = re.sub(r'\n  "' + re.escape(sl) + r'": \{[^\n]*\},', '', s)
        s = re.sub(r'\n  "' + re.escape(sl) + r'",', '', s)
    p.write_text(s)

# ---- 2. update /tmp/w14/nearby.json for consistency ----
nb = json.load(open("/tmp/w14/nearby.json"))
dropset = set(DROP)
for city in list(nb):
    nb[city] = [r for r in nb[city] if r["slug"] not in dropset]
    for r in nb[city]:
        if 'E. P. "Tom"' in r.get("name", ""):
            r["name"] = r["name"].replace('E. P. "Tom" Sawyer', 'E. P. Tom Sawyer')
json.dump(nb, open("/tmp/w14/nearby.json", "w"), ensure_ascii=False)
cnt = [len(v) for v in nb.values()]
print(f"nearby.json updated: total={sum(cnt)} min={min(cnt)} (all >=5: {min(cnt)>=5})")
