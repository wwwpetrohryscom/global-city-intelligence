#!/usr/bin/env python3
"""Wave 15 validation fixes:
1. Drop 3 nearby records: 2 whole-landmass "Italian Peninsula" satellite images
   (near chieti/avezzano — a peninsula/landmass is not a weekend destination), and
   zlibky-u-vraze-near-pisek whose Commons filename URL-encodes the Czech 'že' to
   '%C5%BEe' -> a false 'bee' fauna_macro match in the validator (legit landscape,
   but no alternative image). Each affected city keeps 7 verified nearby.
2. Sanitize the label suffix on "Praia de São Bernardino - Portugal" -> "Praia de
   São Bernardino" (cosmetic; real beach kept)."""
import json, re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
DROP = ["italian-peninsula-near-chieti", "italian-peninsula-near-avezzano",
        "zlibky-u-vraze-near-pisek"]

# ---- 1a. nearby-places.ts: seeds + VERIFIED_IMAGES + name sanitize ----
np = ROOT / "lib/data/nearby-places.ts"
t = np.read_text()
for sl in DROP:
    t2 = re.sub(r'\n  \{\n    slug: "' + re.escape(sl) + r'",[\s\S]*?\n  \},', '', t, count=1)
    assert t2 != t, f"seed {sl} not removed"
    t = t2
    t2 = re.sub(r'\n  "' + re.escape(sl) + r'": \{\n[\s\S]*?\n  \},', '', t, count=1)
    assert t2 != t, f"VERIFIED_IMAGES {sl} not removed"
    t = t2
assert "Praia de São Bernardino - Portugal" in t, "praia name not found"
t = t.replace("Praia de São Bernardino - Portugal", "Praia de São Bernardino")
np.write_text(t)
print(f"nearby-places.ts: dropped {len(DROP)}; sanitized Praia de São Bernardino")

# ---- 1b. discovery graph: nodes + inbound edges ----
g = ROOT / "lib/data/nearby-place-discovery-graph.ts"
gt = g.read_text()
for sl in DROP:
    gt2 = re.sub(r'\n  "' + re.escape(sl) + r'": \[\n[\s\S]*?\n  \],', '', gt, count=1)
    assert gt2 != gt, f"graph node {sl} not removed"
    gt = gt2
    gt = re.sub(r'\n *\{ placeSlug: "' + re.escape(sl) + r'",[^\n]*\},', '', gt)
g.write_text(gt)
print(f"discovery-graph: nodes + inbound edges removed; residual refs={sum(gt.count(chr(34)+sl+chr(34)) for sl in DROP)}")

# ---- 1c. facts + detail (defensive) ----
for rel in ("lib/data/nearby-place-facts.ts", "lib/data/nearby-place-detail-pages.ts"):
    p = ROOT / rel
    s = p.read_text()
    for sl in DROP:
        s = re.sub(r'\n  "' + re.escape(sl) + r'": \{[^\n]*\},', '', s)
        s = re.sub(r'\n  "' + re.escape(sl) + r'",', '', s)
    p.write_text(s)

# ---- 2. update /tmp/w15/nearby.json ----
nb = json.load(open("/tmp/w15/nearby.json"))
dropset = set(DROP)
for city in list(nb):
    nb[city] = [r for r in nb[city] if r["slug"] not in dropset]
    for r in nb[city]:
        if r.get("name") == "Praia de São Bernardino - Portugal":
            r["name"] = "Praia de São Bernardino"
json.dump(nb, open("/tmp/w15/nearby.json", "w"), ensure_ascii=False)
cnt = [len(v) for v in nb.values()]
print(f"nearby.json: total={sum(cnt)} min={min(cnt)} (all >=5: {min(cnt) >= 5})")
