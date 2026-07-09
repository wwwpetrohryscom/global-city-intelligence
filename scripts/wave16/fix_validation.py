#!/usr/bin/env python3
"""Wave 16 validation fixes: drop 2 nearby records:
 - mosso-near-skanderborg: Danish lake Mossø; its Commons filename contains "Moss" ->
   false 'flora_macro' (moss the plant) match in the validator (all Mossø images share
   this, so re-imaging can't help).
 - cimbrian-peninsula-near-billund: the Cimbrian Peninsula IS Jutland (Denmark's whole
   mainland) — a landmass, not a weekend destination (cf. wave15's Italian Peninsula).
Removes seed + VERIFIED_IMAGES + discovery-graph node + inbound edges. Each affected
city keeps 7 verified nearby. (Hanko/Varanger peninsulas kept — real nature areas.)"""
import json, re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
DROP = ["mosso-near-skanderborg", "cimbrian-peninsula-near-billund"]

np = ROOT / "lib/data/nearby-places.ts"
t = np.read_text()
for sl in DROP:
    t2 = re.sub(r'\n  \{\n    slug: "' + re.escape(sl) + r'",[\s\S]*?\n  \},', '', t, count=1)
    assert t2 != t, f"seed {sl} not removed"
    t = t2
    t2 = re.sub(r'\n  "' + re.escape(sl) + r'": \{\n[\s\S]*?\n  \},', '', t, count=1)
    assert t2 != t, f"VERIFIED_IMAGES {sl} not removed"
    t = t2
np.write_text(t)
print(f"nearby-places.ts: dropped {len(DROP)} seeds+images")

g = ROOT / "lib/data/nearby-place-discovery-graph.ts"
gt = g.read_text()
for sl in DROP:
    gt2 = re.sub(r'\n  "' + re.escape(sl) + r'": \[\n[\s\S]*?\n  \],', '', gt, count=1)
    assert gt2 != gt, f"graph node {sl} not removed"
    gt = gt2
    gt = re.sub(r'\n *\{ placeSlug: "' + re.escape(sl) + r'",[^\n]*\},', '', gt)
g.write_text(gt)
print(f"discovery-graph: nodes + inbound edges removed; residual refs={sum(gt.count(chr(34)+sl+chr(34)) for sl in DROP)}")

for rel in ("lib/data/nearby-place-facts.ts", "lib/data/nearby-place-detail-pages.ts"):
    p = ROOT / rel
    s = p.read_text()
    for sl in DROP:
        s = re.sub(r'\n  "' + re.escape(sl) + r'": \{[^\n]*\},', '', s)
        s = re.sub(r'\n  "' + re.escape(sl) + r'",', '', s)
    p.write_text(s)

nb = json.load(open("/tmp/w16/nearby.json"))
dropset = set(DROP)
for city in list(nb):
    nb[city] = [r for r in nb[city] if r["slug"] not in dropset]
json.dump(nb, open("/tmp/w16/nearby.json", "w"), ensure_ascii=False)
cnt = [len(v) for v in nb.values()]
print(f"nearby.json: total={sum(cnt)} min={min(cnt)} (all >=5: {min(cnt) >= 5})")
