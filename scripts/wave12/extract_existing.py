#!/usr/bin/env python3
"""Wave 11 Phase 0: extract existing city state for dedup + generator inputs.
Outputs:
  /tmp/w12/existing_cities.json   list of {slug,name,countrySlug,countryName,region,population,affordability}
  /tmp/w12/existing_slugs.json    sorted list of slugs
  /tmp/w12/existing_qids.json     {slug: QID} harvested from city-images hero notes
  /tmp/w12/existing_qidset.json   sorted list of unique QIDs
  /tmp/w12/country_counts.json    {countrySlug: count}
No network. Deterministic."""
import json, re, os
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
OUT = Path("/tmp/w12"); OUT.mkdir(parents=True, exist_ok=True)

src = (ROOT / "lib/data/cities.ts").read_text()
# isolate the seeds array region (between `const seeds: CitySeed[] = [` and the export line)
start = src.index("const seeds: CitySeed[] = [")
end = src.index("export const cities: City[] = seeds.map(buildCity);")
body = src[start:end]

# split into per-record blocks anchored on slug
slug_iter = list(re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', body))
records = []
for i, m in enumerate(slug_iter):
    blk = body[m.start(): slug_iter[i+1].start() if i+1 < len(slug_iter) else len(body)]
    slug = m.group(1)
    def grab(field):
        mm = re.search(field + r':\s*"((?:[^"\\]|\\.)*)"', blk)
        return mm.group(1) if mm else None
    name = grab("name")
    countrySlug = grab("countrySlug")
    countryName = grab("countryName")
    region = grab("region")
    population = grab("population")
    aff = None
    am = re.search(r'affordability: (\d+)', blk)
    if am: aff = int(am.group(1))
    records.append({
        "slug": slug, "name": name, "countrySlug": countrySlug,
        "countryName": countryName, "region": region,
        "population": population, "affordability": aff if aff is not None else 50,
    })

# sanity: unique slugs
slugs = [r["slug"] for r in records]
assert len(slugs) == len(set(slugs)), f"DUP slugs in cities.ts: {len(slugs)} vs {len(set(slugs))}"

# QIDs from city-images hero notes  notes: "Resolved via Wikidata Q123 -> Commons ..."
img_src = (ROOT / "lib/data/media/city-images.ts").read_text()
qid_by_slug = {}
for m in re.finditer(r'placeSlug: "([a-z0-9-]+)",[\s\S]{0,1400}?notes: "Resolved via Wikidata (Q\d+)', img_src):
    qid_by_slug.setdefault(m.group(1), m.group(2))
# also catch any inline `wikidataId`/`qid` on city image entries (rare)

# country counts
cc = {}
for r in records:
    cc[r["countrySlug"]] = cc.get(r["countrySlug"], 0) + 1

json.dump(records, open(OUT / "existing_cities.json", "w"), ensure_ascii=False)
json.dump(sorted(slugs), open(OUT / "existing_slugs.json", "w"))
json.dump(qid_by_slug, open(OUT / "existing_qids.json", "w"))
json.dump(sorted(set(qid_by_slug.values())), open(OUT / "existing_qidset.json", "w"))
json.dump(cc, open(OUT / "country_counts.json", "w"))

print(f"records: {len(records)}")
print(f"slugs unique: {len(set(slugs))}")
print(f"hero-note QIDs: {len(qid_by_slug)} slugs -> {len(set(qid_by_slug.values()))} unique QIDs")
print("affordability present:", sum(1 for r in records if r['affordability'] is not None))
print("population present:", sum(1 for r in records if r['population']))
print("countrySlug present:", sum(1 for r in records if r['countrySlug']))
print("\n=== target-country existing counts ===")
for k in ["united-states","canada","australia","germany","france","netherlands"]:
    print(f"  {k:16s} {cc.get(k,0)}")
print("\n=== top-15 countries by count ===")
for k,v in sorted(cc.items(), key=lambda x:-x[1])[:15]:
    print(f"  {k:24s} {v}")