#!/usr/bin/env python3
"""Wave 16 sparse-expansion wiring: append topped-up nearby (sparse_add.json) into
nearby-places.ts (wave16SparseSeeds), facts, detail-slugs. Targets post-wave16-wire
anchor `...wave16NearbySeeds];`."""
import json
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
OUT = Path("/tmp/w16")
DATE = "2026-07-09"
add = json.load(open(OUT / "sparse_add.json"))


def j(v):
    return json.dumps(v, ensure_ascii=False)


seed_lines = ["const wave16SparseSeeds: readonly PlaceSeed[] = ["]
img_lines = [f"  // ===== Wave 16 sparse-expansion verified images ({DATE}) ====="]
facts_lines = [f"  // ===== Wave 16 sparse-expansion facts ({DATE}) ====="]
detail_slugs = []
place_total = 0
for cs, places in add.items():
    for p in places:
        place_total += 1
        sf = [f"    slug: {j(p['slug'])},", f"    name: {j(p['name'])},",
              f"    countrySlug: {j(p['countrySlug'])},", f"    regionName: {j(p['regionName'])},",
              f"    category: {j(p['category'])},", f"    summary:\n      {j(p['summary'])},",
              f"    connectedCitySlugs: {j(p['connectedCitySlugs'])},",
              f"    distanceBand: {j(p['distanceBand'])},", f"    wikidataId: {j(p['wikidataId'])},"]
        if p.get("officialUrl"): sf.append(f"    officialUrl: {j(p['officialUrl'])},")
        sf += [f"    latitude: {p['latitude']},", f"    longitude: {p['longitude']},",
               "    coordinateSource: \"wikidata\",", f"    verificationStatus: {j(p['verificationStatus'])},"]
        seed_lines.append("  {\n" + "\n".join(sf) + "\n  },")
        im = p["img"]
        ifields = [f"    src: {j(im['src'])},", f"    width: {int(im['width'])},", f"    height: {int(im['height'])},",
                   f"    alt: {j(im['alt'])},", "    source: \"wikimedia-commons\",",
                   f"    sourceUrl: {j(im['sourceUrl'])},", f"    author: {j(im['author'])},"]
        if im.get("authorUrl"): ifields.append(f"    authorUrl: {j(im['authorUrl'])},")
        ifields += [f"    license: {j(im['license'])},", f"    licenseUrl: {j(im['licenseUrl'])},",
                    f"    attributionText: {j(im['attributionText'])},", "    verified: true,", f"    verifiedAt: {j(DATE)},"]
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
anchor = "...wave16NearbySeeds];"
assert np_src.count(anchor) == 1, f"spread anchor count={np_src.count(anchor)}"
assert "const wave16SparseSeeds" not in np_src, "sparse seeds already wired"
decl_idx = np_src.index("const seeds: readonly PlaceSeed[] = [")
np_src = np_src[:decl_idx] + "\n".join(seed_lines) + "\n\n" + np_src[decl_idx:]
np_src = np_src.replace(anchor, "...wave16NearbySeeds, ...wave16SparseSeeds];")
vi_close = np_src.index("\n};", np_src.index("const VERIFIED_IMAGES"))
np_src = np_src[:vi_close] + "\n" + "\n".join(img_lines) + np_src[vi_close:]
(ROOT / "lib/data/nearby-places.ts").write_text(np_src)
print(f"nearby-places.ts: +{place_total} sparse seeds + images (wave16SparseSeeds)")

facts_src = (ROOT / "lib/data/nearby-place-facts.ts").read_text()
idx = facts_src.rfind("\n};")
(ROOT / "lib/data/nearby-place-facts.ts").write_text(facts_src[:idx] + "\n" + "\n".join(facts_lines) + facts_src[idx:])
print(f"nearby-place-facts.ts: +{len(facts_lines)-1} facts")

det_src = (ROOT / "lib/data/nearby-place-detail-pages.ts").read_text()
det_block = f"  // ===== Wave 16 sparse-expansion detail pages ({DATE}) =====\n" + "\n".join(f"  {j(s)}," for s in detail_slugs)
idx = det_src.rfind("\n] as const;")
(ROOT / "lib/data/nearby-place-detail-pages.ts").write_text(det_src[:idx] + "\n" + det_block + det_src[idx:])
print(f"nearby-place-detail-pages.ts: +{len(detail_slugs)} sparse detail slugs")
print(f"SPARSE WIRE DONE: {len(add)} cities, +{place_total} places")
