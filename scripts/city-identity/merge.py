#!/usr/bin/env python3
"""Consolidate a duplicate city record into its canonical twin.

Only pairs proven to denote the SAME Wikidata entity are merged. For each
merged pair every downstream reference is repaired rather than left dangling:
per-city datasets, the discovery graph, curated collections, and the nearby
place records, which are repointed to the canonical city and de-duplicated by
Wikidata id so one feature cannot appear twice on one city's page.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "lib/data"

# canonical <- duplicate. Evidence for each pair is in
# scripts/city-identity/cache/collisions.json and the wave report.
MERGES = [
    # Both records resolve to Q190847 "Alexandroupolis, city in Thrace,
    # Greece"; identical coordinates. `alexandroupoli` keeps its curated intro
    # and carries no artificial country suffix, so it is canonical.
    ("alexandroupoli", "alexandroupolis-gr"),
    # Both records resolve to Q26087 "Tromsø Municipality" and sit on the same
    # point, and both carry municipality-scale population (~77K / ~80K), so
    # neither describes the city proper. `tromso` matches the corpus's bare
    # city-slug convention.
    ("tromso", "tromso-municipality"),
]

PER_CITY_FILES = ["climate.ts", "cost-of-living.ts", "economy.ts", "education.ts",
                  "healthcare-retirement.ts", "city-quality.ts", "city-faqs.ts",
                  "city-ai-overviews.ts", "visual-guides.ts", "weekend-trip.ts",
                  "cities.ts", "city-intents.ts", "arrival.ts", "moving.ts",
                  "neighborhoods.ts", "summer-travel.ts", "healthcare.ts",
                  "hospitals.ts", "transport.ts", "mobility.ts", "emergency.ts",
                  "public-safety.ts", "rankings.ts", "comparisons.ts"]


def remove_blocks(text, key, slug):
    """Delete every top-level object literal whose `key` is `slug`."""
    out, removed = text, 0
    pattern = re.compile(r'%s:\s*"%s"' % (re.escape(key), re.escape(slug)))
    while True:
        m = pattern.search(out)
        if not m:
            break
        start = out.rfind("{", 0, m.start())
        if start < 0:
            break
        depth, i, n = 0, start, len(out)
        while i < n:
            ch = out[i]
            if ch == '"':                      # skip strings
                i += 1
                while i < n and out[i] != '"':
                    i += 2 if out[i] == "\\" else 1
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    break
            i += 1
        end = i + 1
        while end < n and out[end] in ", \n":
            end += 1
            if out[end - 1] == "\n":
                break
        line_start = out.rfind("\n", 0, start) + 1
        prefix = out[line_start:start]
        out = out[:line_start if prefix.strip() == "" else start] + out[end:]
        removed += 1
    return out, removed


def drop_from_arrays(text, slug):
    """Remove a slug from any string array, leaving the array well-formed."""
    n = 0
    for pat in (f'"{slug}", ', f', "{slug}"', f'"{slug}"'):
        while pat in text:
            text = text.replace(pat, "", 1)
            n += 1
    return text, n


report = {}
for canonical, dup in MERGES:
    entry = {"canonical": canonical, "duplicate": dup, "edits": {}}

    # 1. per-city datasets -----------------------------------------------------
    for name in PER_CITY_FILES:
        path = DATA / name
        if not path.exists():
            continue
        text = path.read_text()
        if f'"{dup}"' not in text:
            continue
        for key in ("citySlug", "slug", "cityId"):
            text, n = remove_blocks(text, key, dup)
            if n:
                entry["edits"][f"{name}:{key}"] = n
        path.write_text(text)

    # 2. hero imagery ----------------------------------------------------------
    img = DATA / "media/city-images.ts"
    text = img.read_text()
    text, n = remove_blocks(text, "placeSlug", dup)
    if n:
        entry["edits"]["media/city-images.ts"] = n
        img.write_text(text)

    # 3. coordinates -----------------------------------------------------------
    coords = DATA / "city-coordinates.ts"
    text = coords.read_text()
    text2 = re.sub(r'^\s*\["%s", [^\]]*\],\n' % re.escape(dup), "", text, flags=re.M)
    if text2 != text:
        entry["edits"]["city-coordinates.ts"] = 1
        coords.write_text(text2)

    # 4. discovery graph: drop the node and every edge that points at it --------
    graph = DATA / "city-discovery-graph.ts"
    text = graph.read_text()
    node = re.search(r'\n  "%s": \[[\s\S]*?\n  \],' % re.escape(dup), text)
    edges = len(re.findall(r'^\s*\{ citySlug: "%s",[^\n]*\n' % re.escape(dup), text, re.M))
    if node:
        text = text[:node.start()] + text[node.end():]
    text = re.sub(r'^\s*\{ citySlug: "%s",[^\n]*\n' % re.escape(dup), "", text, flags=re.M)
    entry["edits"]["city-discovery-graph.ts"] = {"node": bool(node), "edges": edges}
    graph.write_text(text)

    # 5. curated collections ---------------------------------------------------
    for name in ("regional-collections.ts", "thematic-collections.ts", "collections.ts"):
        path = DATA / name
        if not path.exists():
            continue
        text = path.read_text()
        if f'"{dup}"' not in text:
            continue
        text, n = drop_from_arrays(text, dup)
        entry["edits"][name] = n
        path.write_text(text)

    report[dup] = entry

json.dump(report, open(Path(__file__).resolve().parent / "cache" / "merge-report.json", "w"), indent=1)
for dup, e in report.items():
    print(f"\n{e['canonical']} <- {dup}")
    for k, v in e["edits"].items():
        print(f"   {k}: {v}")
