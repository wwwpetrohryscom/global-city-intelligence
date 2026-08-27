#!/usr/bin/env python3
"""Remove references to place records deleted by the identity merge.

Deleting a duplicate feature record leaves two kinds of orphan: a facts row
keyed on its slug, and related-place edges in the place discovery graph. Both
are repaired by re-deriving the set of live slugs and dropping anything that
names a slug the corpus no longer has.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "lib/data"
live = set(re.findall(r'^ {4}slug: "([a-z0-9-]+)",$', (DATA / "nearby-places.ts").read_text(), re.M))
print(f"live place records: {len(live)}")

# 1. facts rows -------------------------------------------------------------
facts = DATA / "nearby-place-facts.ts"
text = facts.read_text()
removed = 0
for m in list(re.finditer(r'\n  "([a-z0-9-]+)": \{[^\n]*\},', text)):
    if m.group(1) not in live:
        text = text.replace(m.group(0), "", 1)
        removed += 1
facts.write_text(text)
print(f"facts rows removed: {removed}")

# 2. detail-page allow-list --------------------------------------------------
detail = DATA / "nearby-place-detail-pages.ts"
text = detail.read_text()
gone = [s for s in re.findall(r'"([a-z0-9-]+)"', text[text.index("DETAIL_SLUGS"):]) if s not in live and s != "slug"]
for s in gone:
    text = re.sub(r'\n\s*"%s",' % re.escape(s), "", text, count=1)
detail.write_text(text)
print(f"detail slugs removed: {len(gone)}")

# 3. place discovery graph ---------------------------------------------------
graph = DATA / "nearby-place-discovery-graph.ts"
text = graph.read_text()
nodes_removed = edges_removed = 0
for m in list(re.finditer(r'\n  "([a-z0-9-]+)": \[[\s\S]*?\n  \],', text)):
    if m.group(1) not in live:
        text = text.replace(m.group(0), "", 1)
        nodes_removed += 1
for m in list(re.finditer(r'\n\s*\{ placeSlug: "([a-z0-9-]+)",[^\n]*\},', text)):
    if m.group(1) not in live:
        text = text.replace(m.group(0), "", 1)
        edges_removed += 1
graph.write_text(text)
print(f"place-graph nodes removed: {nodes_removed}; edges removed: {edges_removed}")
