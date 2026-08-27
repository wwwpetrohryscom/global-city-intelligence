#!/usr/bin/env python3
"""V3 — write recovered places into lib/data/nearby-places.ts.

Two edits, both additive except the QID repairs:
  1. replace the wikidataId on records that were wired to the wrong entity
  2. append a natureV3Seeds array plus its verified images

Summaries follow the existing corpus wording exactly: neutral, no superlative,
no distance, no travel time, no opening hours or prices.
"""
import json, re, collections
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent / "cache"
NEARBY = ROOT / "lib/data/nearby-places.ts"
BATCH_DATE = "2026-08-27"

src = NEARBY.read_text()

# ---------------------------------------------------------------- QID repair
repairs = {k: v for k, v in json.load(open(OUT / "qid-repairs.json")).items() if v}
applied = 0
for slug, rep in repairs.items():
    m = re.search(r'(\n    slug: "%s",[\s\S]{0,1400}?wikidataId: ")(Q\d+)(")' % re.escape(slug), src)
    if not m:
        continue
    src = src[:m.start(2)] + rep["qid"] + src[m.end(2):]
    applied += 1
print(f"QID repairs applied: {applied}/{len(repairs)}")

# A repaired record's cached facts were read off the WRONG entity — Fire Island
# National Seashore's designation came from a film — so the stale rows are
# removed rather than re-pointed. Facts are optional; a wrong one is not.
facts_path = ROOT / "lib/data/nearby-place-facts.ts"
facts_src = facts_path.read_text()
removed = 0
for slug in repairs:
    m = re.search(r'\n  "%s": \{[^\n]*\},' % re.escape(slug), facts_src)
    if m:
        facts_src = facts_src[:m.start()] + facts_src[m.end():]
        removed += 1
if removed:
    facts_path.write_text(facts_src)
print(f"stale fact rows removed for repaired records: {removed}")

# ---------------------------------------------------------------- new seeds
region_by_country = {}
counts = collections.defaultdict(collections.Counter)
for m in re.finditer(r'countrySlug: "([a-z0-9-]+)",\s*\n\s*regionName: "([^"]+)"', src):
    counts[m.group(1)][m.group(2)] += 1
for c, cc in counts.items():
    region_by_country[c] = cc.most_common(1)[0][0]

DESIG = [
    ("national park", "national park"), ("nature reserve", "nature reserve"),
    ("wildlife sanctuary", "wildlife sanctuary"), ("wildlife refuge", "wildlife refuge"),
    ("state park", "state park"), ("provincial park", "provincial park"),
    ("regional park", "regional park"), ("natural park", "natural park"),
    ("nature park", "nature park"), ("country park", "country park"),
    ("protected landscape", "protected landscape area"), ("biosphere", "biosphere reserve"),
    ("geopark", "geopark"), ("waterfall", "waterfall"), ("stratovolcano", "volcano"),
    ("volcano", "volcano"), ("glacier", "glacier"), ("canyon", "canyon"),
    ("gorge", "gorge"), ("cave", "cave"), ("wetland", "wetland"), ("marsh", "marsh"),
    ("beach", "beach"), ("cape", "cape"), ("headland", "headland"), ("cove", "cove"),
    ("calanque", "calanque"), ("fjord", "fjord"), ("lagoon", "lagoon"),
    ("mountain range", "mountain range"), ("mountain", "mountain"), ("hill", "hill"),
    ("island", "island"), ("archipelago", "island group"), ("lake", "lake"),
    ("reservoir", "reservoir"), ("forest", "forest"), ("valley", "valley"),
    ("bay", "bay"), ("peninsula", "peninsula"), ("river", "river"), ("park", "park"),
]


def designation(types):
    for needle, label in DESIG:
        if needle in types:
            return label
    return "natural area"


def esc(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')


city_names = {}
csrc = (ROOT / "lib/data/cities.ts").read_text()
cbody = csrc[csrc.index("const seeds: CitySeed[] = ["):csrc.index("export const cities: City[] = seeds.map(buildCity);")]
it = list(re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', cbody))
for i, m in enumerate(it):
    blk = cbody[m.start(): it[i + 1].start() if i + 1 < len(it) else len(cbody)]
    nm = re.search(r'name: "((?:[^"\\]|\\.)*)"', blk)
    city_names[m.group(1)] = nm.group(1) if nm else m.group(1)

records = []
for source in ("resolved.json", "coastal-resolved.json"):
    data = json.load(open(OUT / source))
    for city, recs in data.items():
        for r in recs:
            records.append((city, r))
records.sort(key=lambda x: (x[0], x[1]["slug"]))
print(f"new seed records: {len(records)}")

seed_lines, image_lines = [], []
for city, r in records:
    cname = city_names.get(city, city)
    des = designation(r["types"])
    summary = (f"{r['name']} is a {des} reachable from {cname} as a nearby nature "
               f"destination. Research access, facilities, and seasonal conditions with "
               f"official sources before visiting.")
    region = region_by_country.get(r["countrySlug"], "")
    status = "verified" if r.get("officialUrl") else "partial"
    parts = [
        '  {',
        f'    slug: "{esc(r["slug"])}",',
        f'    name: "{esc(r["name"])}",',
        f'    countrySlug: "{r["countrySlug"]}",',
    ]
    if region:
        parts.append(f'    regionName: "{esc(region)}",')
    parts += [
        f'    category: "{r["category"]}",',
        '    summary:',
        f'      "{esc(summary)}",',
        f'    connectedCitySlugs: ["{city}"],',
        f'    distanceBand: "{r["distanceBand"]}",',
        f'    wikidataId: "{r["wikidataId"]}",',
    ]
    if r.get("officialUrl"):
        parts.append(f'    officialUrl: "{esc(r["officialUrl"])}",')
    parts += [
        f'    latitude: {r["latitude"]},',
        f'    longitude: {r["longitude"]},',
        '    coordinateSource: "wikidata",',
        f'    verificationStatus: "{status}",',
        '  },',
    ]
    seed_lines += parts

    im = r["image"]
    image_lines += [
        f'  "{esc(r["slug"])}": {{',
        f'    src: "{esc(im["src"])}",',
        f'    width: {im["width"]},',
        f'    height: {im["height"]},',
        f'    alt: "{esc(im["alt"])}",',
        '    source: "wikimedia-commons",',
        f'    sourceUrl: "{esc(im["sourceUrl"])}",',
        f'    author: "{esc(im["author"])}",',
        f'    license: "{esc(im["license"])}",',
    ]
    if im.get("licenseUrl"):
        image_lines.append(f'    licenseUrl: "{esc(im["licenseUrl"])}",')
    image_lines += [
        f'    attributionText: "{esc(im["attributionText"])}",',
        '    verified: true,',
        f'    verifiedAt: "{BATCH_DATE}",',
        '  },',
    ]

# splice images into VERIFIED_IMAGES
anchor = src.index("const VERIFIED_IMAGES")
open_brace = src.index("{", anchor) + 1
header = (f"\n  // ===== Nature corpus recovery V3 ({len(records)} recovered places, "
          f"{BATCH_DATE}) =====\n")
src = src[:open_brace] + header + "\n".join(image_lines) + src[open_brace:]

# append the seed array before the `seeds` spread and register it
spread = re.search(r"\nconst seeds: readonly PlaceSeed\[\] = \[([^\]]*)\];", src)
block = (f"\nconst natureV3Seeds: readonly PlaceSeed[] = [\n"
         f"  // ===== Nature corpus recovery V3 ({BATCH_DATE}) =====\n"
         f"  // Cities that had no curated nature place at all, plus coastal cities\n"
         f"  // whose corpus carried no beach. Discovered from Wikidata structured\n"
         f"  // types and verified through Commons for a real file, an acceptable\n"
         f"  // licence, a named author and real dimensions.\n"
         + "\n".join(seed_lines) + "\n];\n")
src = src[:spread.start()] + block + src[spread.start():]
src = src.replace(spread.group(0),
                  spread.group(0).replace("...wave19NearbySeeds]", "...wave19NearbySeeds, ...natureV3Seeds]"))

NEARBY.write_text(src)
print(f"wrote {NEARBY} ({NEARBY.stat().st_size/1e6:.1f} MB)")
