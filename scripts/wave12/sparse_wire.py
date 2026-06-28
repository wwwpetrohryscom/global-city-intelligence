#!/usr/bin/env python3
"""Wave 12 sparse-expansion wiring: append the topped-up nearby places (sparse_add.json)
into nearby-places.ts (wave12SparseSeeds), facts, detail-slugs — append-only. Mirrors
wave12-wire.py's nearby section but targets sparse_add + a fresh const + correct spread."""
import json
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
OUT = Path("/tmp/w12")
DATE = "2026-06-28"
add = json.load(open(OUT / "sparse_add.json"))


def j(v):
    return json.dumps(v, ensure_ascii=False)


seed_lines = ["const wave12SparseSeeds: readonly PlaceSeed[] = ["]
img_lines = [f"  // ===== Wave 12 sparse-expansion verified images ({DATE}) ====="]
facts_lines = [f"  // ===== Wave 12 sparse-expansion facts ({DATE}) ====="]
detail_slugs = []
place_total = 0
for cs, places in add.items():
    for p in places:
        place_total += 1
        sf = [
            f"    slug: {j(p['slug'])},", f"    name: {j(p['name'])},",
            f"    countrySlug: {j(p['countrySlug'])},", f"    regionName: {j(p['regionName'])},",
            f"    category: {j(p['category'])},",
            f"    summary:\n      {j(p['summary'])},",
            f"    connectedCitySlugs: {j(p['connectedCitySlugs'])},",
            f"    distanceBand: {j(p['distanceBand'])},",
            f"    wikidataId: {j(p['wikidataId'])},",
        ]
        if p.get("officialUrl"):
            sf.append(f"    officialUrl: {j(p['officialUrl'])},")
        sf += [
            f"    latitude: {p['latitude']},", f"    longitude: {p['longitude']},",
            "    coordinateSource: \"wikidata\",",
            f"    verificationStatus: {j(p['verificationStatus'])},",
        ]
        seed_lines.append("  {\n" + "\n".join(sf) + "\n  },")
        im = p["img"]
        ifields = [
            f"    src: {j(im['src'])},", f"    width: {int(im['width'])},", f"    height: {int(im['height'])},",
            f"    alt: {j(im['alt'])},", "    source: \"wikimedia-commons\",",
            f"    sourceUrl: {j(im['sourceUrl'])},", f"    author: {j(im['author'])},",
        ]
        if im.get("authorUrl"):
            ifields.append(f"    authorUrl: {j(im['authorUrl'])},")
        ifields += [
            f"    license: {j(im['license'])},", f"    licenseUrl: {j(im['licenseUrl'])},",
            f"    attributionText: {j(im['attributionText'])},",
            "    verified: true,", f"    verifiedAt: {j(DATE)},",
        ]
        img_lines.append(f"  {j(p['slug'])}: {{\n" + "\n".join(ifields) + "\n  },")
        if p["verificationStatus"] == "verified" and p.get("officialUrl") and p["slug"][:1].isalpha():
            detail_slugs.append(p["slug"])
            fa = p["facts"]; fparts = []
            if fa.get("designation"): fparts.append(f"designation: {j(fa['designation'])}")
            if fa.get("iucnCategory"): fparts.append(f"iucnCategory: {j(fa['iucnCategory'])}")
            if fa.get("established"): fparts.append(f"established: {int(fa['established'])}")
            fparts.append(f"wikidataId: {j(p['wikidataId'])}")
            facts_lines.append(f"  {j(p['slug'])}: {{ " + ", ".join(fparts) + " },")
seed_lines.append("];")

np_src = (ROOT / "lib/data/nearby-places.ts").read_text()
anchor = "...wave11NearbySeeds, ...wave12NearbySeeds];"
assert np_src.count(anchor) == 1, f"spread anchor count={np_src.count(anchor)}"
np_src = np_src.replace(
    "const wave12SparseSeeds",  # guard against double-run
    "const wave12SparseSeeds") if "const wave12SparseSeeds" in np_src else np_src
assert "const wave12SparseSeeds" not in np_src, "sparse seeds already wired"
# insert the const right before the seeds decl, and extend the spread
decl_idx = np_src.index("const seeds: readonly PlaceSeed[] = [")
np_src = np_src[:decl_idx] + "\n".join(seed_lines) + "\n\n" + np_src[decl_idx:]
np_src = np_src.replace(anchor, "...wave11NearbySeeds, ...wave12NearbySeeds, ...wave12SparseSeeds];")
vi_close = np_src.index("\n};", np_src.index("const VERIFIED_IMAGES"))
np_src = np_src[:vi_close] + "\n" + "\n".join(img_lines) + np_src[vi_close:]
(ROOT / "lib/data/nearby-places.ts").write_text(np_src)
print(f"nearby-places.ts: +{place_total} sparse seeds + images (wave12SparseSeeds)")

facts_src = (ROOT / "lib/data/nearby-place-facts.ts").read_text()
idx = facts_src.rfind("\n};")
facts_src = facts_src[:idx] + "\n" + "\n".join(facts_lines) + facts_src[idx:]
(ROOT / "lib/data/nearby-place-facts.ts").write_text(facts_src)
print(f"nearby-place-facts.ts: +{len(facts_lines)-1} facts")

det_src = (ROOT / "lib/data/nearby-place-detail-pages.ts").read_text()
det_block = f"  // ===== Wave 12 sparse-expansion detail pages ({DATE}) =====\n" + "\n".join(f"  {j(s)}," for s in detail_slugs)
idx = det_src.rfind("\n] as const;")
det_src = det_src[:idx] + "\n" + det_block + det_src[idx:]
(ROOT / "lib/data/nearby-place-detail-pages.ts").write_text(det_src)
print(f"nearby-place-detail-pages.ts: +{len(detail_slugs)} sparse detail slugs")
print(f"SPARSE WIRE DONE: {len(add)} cities, +{place_total} places")
