#!/usr/bin/env python3
"""Re-splice ONLY nearby-place-facts.ts + nearby-place-detail-pages.ts with the
correct gate: detail/facts require verified + officialUrl + letter-first slug.
Run AFTER `git checkout` of those two files (revert to HEAD)."""
import json
from pathlib import Path
ROOT = Path("/Users/agent/global-city-intelligence")
DATE = "2026-06-28"
nearby = json.load(open("/tmp/w11/nearby.json"))
def j(v): return json.dumps(v, ensure_ascii=False)

facts_lines = [f"  // ===== Wave 11 facts ({DATE}) ====="]
detail_slugs = []
for cs, places in nearby.items():
    for p in places:
        if p["verificationStatus"] == "verified" and p.get("officialUrl") and p["slug"][:1].isalpha():
            detail_slugs.append(p["slug"])
            fa = p["facts"]; fparts = []
            if fa.get("designation"): fparts.append(f"designation: {j(fa['designation'])}")
            if fa.get("iucnCategory"): fparts.append(f"iucnCategory: {j(fa['iucnCategory'])}")
            if fa.get("established"): fparts.append(f"established: {int(fa['established'])}")
            fparts.append(f"wikidataId: {j(p['wikidataId'])}")
            facts_lines.append(f"  {j(p['slug'])}: {{ " + ", ".join(fparts) + " },")

facts_src = (ROOT / "lib/data/nearby-place-facts.ts").read_text()
idx = facts_src.rfind("\n};")
(ROOT / "lib/data/nearby-place-facts.ts").write_text(facts_src[:idx] + "\n" + "\n".join(facts_lines) + facts_src[idx:])

det_src = (ROOT / "lib/data/nearby-place-detail-pages.ts").read_text()
det_block = f"  // ===== Wave 11 verified detail pages ({DATE}) =====\n" + "\n".join(f"  {j(s)}," for s in detail_slugs)
idx = det_src.rfind("\n] as const;")
(ROOT / "lib/data/nearby-place-detail-pages.ts").write_text(det_src[:idx] + "\n" + det_block + det_src[idx:])
print(f"facts: +{len(facts_lines)-1}; detail: +{len(detail_slugs)} (gated on officialUrl + letter-first)")
