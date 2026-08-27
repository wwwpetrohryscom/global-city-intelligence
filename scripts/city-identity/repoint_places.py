#!/usr/bin/env python3
"""Repoint a merged city's nearby places onto its canonical twin.

Place slugs are NOT renamed: they are published URLs, and a slug is an opaque
identifier, so renaming them would cost redirects for no reader benefit. Only
the connected city changes. Records whose Wikidata id the canonical city
already carries are removed outright, so one feature cannot appear twice on one
city's page, and any curated collection that referenced a removed record is
repaired in the same pass.
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "lib/data"
MERGES = [("alexandroupoli", "alexandroupolis-gr"), ("tromso", "tromso-municipality")]

nearby = DATA / "nearby-places.ts"
text = nearby.read_text()

# index every seed record: slug -> (wikidataId, connected cities)
recs = [(m.group(1), m.start()) for m in re.finditer(r'^ {4}slug: "([a-z0-9-]+)",$', text, re.M)]
info = {}
for i, (slug, start) in enumerate(recs):
    end = recs[i + 1][1] if i + 1 < len(recs) else len(text)
    blk = text[start:end]
    qid = re.search(r'wikidataId: "(Q\d+)"', blk)
    cities = re.search(r'connectedCitySlugs: \[([^\]]*)\]', blk)
    info[slug] = {
        "qid": qid.group(1) if qid else None,
        "cities": re.findall(r'"([a-z0-9-]+)"', cities.group(1)) if cities else [],
        "start": start, "end": end,
    }

summary = {}
removed_slugs = []
for canonical, dup in MERGES:
    canon_qids = {v["qid"] for v in info.values() if canonical in v["cities"] and v["qid"]}
    dup_slugs = [s for s, v in info.items() if dup in v["cities"]]
    keep, drop = [], []
    for s in dup_slugs:
        (drop if info[s]["qid"] and info[s]["qid"] in canon_qids else keep).append(s)
    summary[dup] = {"canonicalHad": len(canon_qids), "duplicateHad": len(dup_slugs),
                    "repointed": len(keep), "removedAsDuplicateFeature": len(drop)}
    removed_slugs += drop
    # repoint the survivors
    for s in keep:
        text = re.sub(r'(slug: "%s",[\s\S]{0,1600}?connectedCitySlugs: \[)"%s"' % (re.escape(s), re.escape(dup)),
                      lambda m: m.group(1) + f'"{canonical}"', text, count=1)

# remove records that duplicate a feature the canonical city already has
for s in removed_slugs:
    m = re.search(r'\n  \{\n    slug: "%s",[\s\S]*?\n  \},' % re.escape(s), text)
    if m:
        text = text[:m.start()] + text[m.end():]
    im = re.search(r'\n  "%s": \{[\s\S]*?\n  \},' % re.escape(s), text)
    if im:
        text = text[:im.start()] + text[im.end():]
nearby.write_text(text)

# repair collections that referenced a removed place record
for name in ("regional-collections.ts", "thematic-collections.ts", "collections.ts"):
    path = DATA / name
    if not path.exists():
        continue
    t = path.read_text()
    n = 0
    for s in removed_slugs:
        for pat in (f'"{s}", ', f', "{s}"', f'"{s}"'):
            while pat in t:
                t = t.replace(pat, "", 1)
                n += 1
    if n:
        path.write_text(t)
        summary[f"collections:{name}"] = n

# the detail-page allow-list must not name a removed record
detail = DATA / "nearby-place-detail-pages.ts"
t = detail.read_text()
n = 0
for s in removed_slugs:
    for pat in (f'  "{s}",\n', f'"{s}", ', f'"{s}"'):
        if pat in t:
            t = t.replace(pat, "", 1)
            n += 1
            break
if n:
    detail.write_text(t)
    summary["nearby-place-detail-pages.ts"] = n

print(json.dumps(summary, indent=1))
print("removed place records:", len(removed_slugs))
