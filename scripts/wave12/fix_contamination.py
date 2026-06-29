#!/usr/bin/env python3
"""Wave 12 audit remediation: purge non-nature / whole-landmass nearby places
(Great Britain, Ireland, Principality of Sealand, Zug Island, Binnenalster) from
every data file (seeds + VERIFIED_IMAGES + facts + detail-slugs + discovery-graph
node + dangling edges), and from the /tmp/w12 staging JSON. Append-only-safe: only
removes Wave-12-added records."""
import json, re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
OUT = Path("/tmp/w12")
scan = json.load(open(OUT / "purge_scan.json"))
PURGE = sorted({x[2] for x in scan["badqid"]})  # slugs to remove
print("purging", len(PURGE), "places")

# ---------- 1. nearby-places.ts: remove seed block + VERIFIED_IMAGES block ----------
np = (ROOT / "lib/data/nearby-places.ts").read_text()


def remove_seed_block(text, slug):
    """Remove the `  {\n ... slug: "slug" ... \n  },` PlaceSeed record."""
    key = f'slug: "{slug}",'
    pos = text.find(key)
    if pos == -1:
        return text, False
    # find the enclosing `  {` before pos
    start = text.rfind("\n  {\n", 0, pos)
    # find the matching `\n  },` after pos
    end = text.find("\n  },", pos)
    assert start != -1 and end != -1, slug
    end += len("\n  },")
    return text[:start] + text[end:], True


def remove_image_block(text, slug):
    """Remove the `  "slug": {\n ... \n  },` VERIFIED_IMAGES entry."""
    key = f'"{slug}": {{'
    pos = text.find(key)
    if pos == -1:
        return text, False
    start = text.rfind("\n", 0, pos)
    end = text.find("\n  },", pos) + len("\n  },")
    return text[:start] + text[end:], True


for slug in PURGE:
    np, ok1 = remove_seed_block(np, slug)
    np, ok2 = remove_image_block(np, slug)
    assert ok1, f"seed {slug} not found"
(ROOT / "lib/data/nearby-places.ts").write_text(np)
print("nearby-places.ts: seeds + images removed")

# ---------- 2. facts ----------
fa = (ROOT / "lib/data/nearby-place-facts.ts").read_text()
for slug in PURGE:
    fa = re.sub(rf'\n  "{re.escape(slug)}": \{{[^\n]*\}},', "", fa)
(ROOT / "lib/data/nearby-place-facts.ts").write_text(fa)
print("nearby-place-facts.ts: facts removed")

# ---------- 3. detail-slugs ----------
de = (ROOT / "lib/data/nearby-place-detail-pages.ts").read_text()
for slug in PURGE:
    de = re.sub(rf'\n  "{re.escape(slug)}",', "", de)
(ROOT / "lib/data/nearby-place-detail-pages.ts").write_text(de)
print("nearby-place-detail-pages.ts: detail slugs removed")

# ---------- 4. discovery graph: remove node + any edges referencing purged slugs ----------
g = (ROOT / "lib/data/nearby-place-discovery-graph.ts").read_text()
pset = set(PURGE)
# remove node blocks  `  "slug": [\n ... \n  ],`
for slug in PURGE:
    g = re.sub(rf'\n  "{re.escape(slug)}": \[\n(?:.*\n)*?  \],', "", g, count=1)
# remove dangling edge lines that reference a purged placeSlug
lines = g.splitlines(keepends=True)
kept = [ln for ln in lines if not (("placeSlug:" in ln) and any(f'placeSlug: "{s}"' in ln for s in pset))]
g = "".join(kept)
(ROOT / "lib/data/nearby-place-discovery-graph.ts").write_text(g)
print("nearby-place-discovery-graph.ts: nodes + dangling edges removed")

# ---------- 5. staging JSON ----------
for fn in ("nearby.json", "sparse_add.json"):
    d = json.load(open(OUT / fn))
    for city in list(d):
        d[city] = [r for r in d[city] if r["slug"] not in pset]
    json.dump(d, open(OUT / fn, "w"), ensure_ascii=False)
print("staging json updated")

# ---------- report per-city counts after purge ----------
src = (ROOT / "lib/data/nearby-places.ts").read_text()
cc = {}
for ch in re.split(r'(?=slug: ")', src):
    m = re.match(r'slug: "([a-z0-9-]+)"', ch)
    if not m:
        continue
    cm = re.search(r'connectedCitySlugs: \[([^\]]*)\]', ch)
    for c in (re.findall(r'"([a-z0-9-]+)"', cm.group(1)) if cm else []):
        cc[c] = cc.get(c, 0) + 1
affected = sorted({x[1] for x in scan["badqid"]})
drop = [(c, cc.get(c, 0)) for c in affected if cc.get(c, 0) < 5]
print("affected cities now <5:", drop)
json.dump([c for c, n in drop], open(OUT / "purge_retopup.json", "w"))
print("DONE")
