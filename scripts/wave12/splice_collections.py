#!/usr/bin/env python3
"""Wave 11.1: append city memberships into regional + thematic collections.
Append-only: only each touched collection's `cities: [...]` array grows (new slugs
appended after existing). IDs, order, descriptions, counters, related, places,
featured* untouched. Also raises the regional MAX_CITIES guard 15->50."""
import json, re
from pathlib import Path
ROOT = Path("/Users/agent/global-city-intelligence")
assign = json.load(open("/tmp/w12/coll_assign.json"))

def splice(path, adds):
    text = path.read_text()
    parts = text.split("\n  {\n")  # parts[0]=header, parts[1:]=collection blocks (without leading "  {\n")
    touched = 0; added = 0
    for i in range(1, len(parts)):
        b = parts[i]
        sm = re.search(r'slug:\s*"([a-z0-9-]+)"', b)
        if not sm or sm.group(1) not in adds:
            continue
        slug = sm.group(1)
        new = adds[slug]
        m = re.search(r'(\n(\s*)cities: \[)(.*?)(\])', b)
        assert m, f"{slug}: cities array not found"
        existing = re.findall(r'"([^"]+)"', m.group(3))
        # append only new (skip any already present — defensive)
        to_add = [c for c in new if c not in existing]
        if not to_add:
            continue
        insert = "".join(f', "{c}"' for c in to_add)
        newarr = m.group(1) + m.group(3) + insert + m.group(4)
        parts[i] = b[:m.start()] + newarr + b[m.end():]
        touched += 1; added += len(to_add)
    path.write_text("\n  {\n".join(parts))
    print(f"{path.name}: {touched} collections touched, +{added} memberships")
    return touched, added

splice(ROOT / "lib/data/regional-collections.ts", assign["regional"])
splice(ROOT / "lib/data/thematic-collections.ts", assign["thematic"])

