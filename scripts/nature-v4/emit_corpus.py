#!/usr/bin/env python3
"""V4 — append forest and waterfall recoveries to lib/data/nearby-places.ts."""
import json, re, collections
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
NEARBY = ROOT / "lib/data/nearby-places.ts"
BATCH_DATE = "2026-08-27"
src = NEARBY.read_text()

region_by_country = {}
counts = collections.defaultdict(collections.Counter)
for m in re.finditer(r'countrySlug: "([a-z0-9-]+)",\s*\n\s*regionName: "([^"]+)"', src):
    counts[m.group(1)][m.group(2)] += 1
for c, cc in counts.items():
    region_by_country[c] = cc.most_common(1)[0][0]

DESIG = [("national forest", "national forest"), ("state forest", "state forest"),
         ("forest reserve", "forest reserve"), ("protection forest", "protection forest"),
         ("urban forest", "urban forest"), ("royal forest", "royal forest"),
         ("old-growth forest", "old-growth forest"), ("rainforest", "rainforest"),
         ("cloud forest", "cloud forest"), ("woodland", "woodland"), ("grove", "grove"),
         ("forest", "forest"), ("cataract", "cataract"), ("cascade", "cascade"),
         ("waterfall", "waterfall")]


def designation(types, kind):
    for needle, label in DESIG:
        if needle in types:
            return label
    return "forest" if kind == "forest" else "waterfall"


def esc(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')


csrc = (ROOT / "lib/data/cities.ts").read_text()
cbody = csrc[csrc.index("const seeds: CitySeed[] = ["):csrc.index("export const cities: City[] = seeds.map(buildCity);")]
it = list(re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', cbody))
city_names = {}
for i, m in enumerate(it):
    blk = cbody[m.start(): it[i + 1].start() if i + 1 < len(it) else len(cbody)]
    nm = re.search(r'name: "((?:[^"\\]|\\.)*)"', blk)
    city_names[m.group(1)] = nm.group(1) if nm else m.group(1)

records = []
for key, recs in json.load(open(HERE / "cache" / "resolved-trimmed.json")).items():
    kind, city = key.split("|", 1)
    for r in recs:
        records.append((city, kind, r))
records.sort(key=lambda x: (x[0], x[2]["slug"]))
print(f"records: {len(records)}")

seed_lines, image_lines = [], []
for city, kind, r in records:
    cname = city_names.get(city, city)
    des = designation(r["types"], kind)
    summary = (f"{r['name']} is a {des} reachable from {cname} as a nearby nature "
               f"destination. Research access, facilities, and seasonal conditions with "
               f"official sources before visiting.")
    region = region_by_country.get(r["countrySlug"], "")
    status = "verified" if r.get("officialUrl") else "partial"
    parts = ['  {', f'    slug: "{esc(r["slug"])}",', f'    name: "{esc(r["name"])}",',
             f'    countrySlug: "{r["countrySlug"]}",']
    if region:
        parts.append(f'    regionName: "{esc(region)}",')
    parts += [f'    category: "{r["category"]}",', '    summary:', f'      "{esc(summary)}",',
              f'    connectedCitySlugs: ["{city}"],', f'    distanceBand: "{r["distanceBand"]}",',
              f'    wikidataId: "{r["wikidataId"]}",']
    if r.get("officialUrl"):
        parts.append(f'    officialUrl: "{esc(r["officialUrl"])}",')
    parts += [f'    latitude: {r["latitude"]},', f'    longitude: {r["longitude"]},',
              '    coordinateSource: "wikidata",', f'    verificationStatus: "{status}",', '  },']
    seed_lines += parts

    im = r["image"]
    image_lines += [f'  "{esc(r["slug"])}": {{', f'    src: "{esc(im["src"])}",',
                    f'    width: {im["width"]},', f'    height: {im["height"]},',
                    f'    alt: "{esc(im["alt"])}",', '    source: "wikimedia-commons",',
                    f'    sourceUrl: "{esc(im["sourceUrl"])}",', f'    author: "{esc(im["author"])}",',
                    f'    license: "{esc(im["license"])}",']
    if im.get("licenseUrl"):
        image_lines.append(f'    licenseUrl: "{esc(im["licenseUrl"])}",')
    image_lines += [f'    attributionText: "{esc(im["attributionText"])}",', '    verified: true,',
                    f'    verifiedAt: "{BATCH_DATE}",', '  },']

anchor = src.index("const VERIFIED_IMAGES")
open_brace = src.index("{", anchor) + 1
src = src[:open_brace] + f"\n  // ===== Forest + waterfall recovery V4 ({len(records)} places, {BATCH_DATE}) =====\n" + "\n".join(image_lines) + src[open_brace:]

spread = re.search(r"\nconst seeds: readonly PlaceSeed\[\] = \[([^\]]*)\];", src)
block = (f"\nconst natureV4Seeds: readonly PlaceSeed[] = [\n"
         f"  // ===== Forest + waterfall recovery V4 ({BATCH_DATE}) =====\n"
         f"  // Tops the two weakest categories up to the publication bar plus one\n"
         f"  // spare, from candidates within 120 km. Discovered from a bounded\n"
         f"  // P31/P279* traversal of explicit forest and waterfall roots and\n"
         f"  // verified through Commons at the unchanged licensing bar.\n"
         + "\n".join(seed_lines) + "\n];\n")
src = src[:spread.start()] + block + src[spread.start():]
src = src.replace(spread.group(0), spread.group(0).replace("...natureV3Seeds]", "...natureV3Seeds, ...natureV4Seeds]"))

NEARBY.write_text(src)
print(f"wrote {NEARBY} ({NEARBY.stat().st_size/1e6:.1f} MB)")
