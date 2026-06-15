#!/usr/bin/env python3
"""Deterministically build 5 city-quality thematic collections (Safest / Family /
Digital Nomad / Retirement / High Quality of Life). Each groups the top cities by
a quality score together with REAL nearby nature places reachable from them.
Computes exact photo counters and guarantees distinct membership sets vs existing
collections. Emits /tmp/quality_collections_records.txt (TS record blocks to splice
into lib/data/thematic-collections.ts). No randomness, no network."""
import json, re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
scores = {r["citySlug"]: r for r in json.load(open("/tmp/quality_scores.json"))}

NATURE = {"nature", "park", "mountain", "lake", "beach", "island", "waterfront",
          "family_outdoor", "general_weekend_place"}

# --- city -> ordered nature place slugs; place -> category ---
near = (ROOT / "lib/data/nearby-places.ts").read_text()
city_places = {}
for m in re.finditer(
    r'slug: "([a-z0-9-]+)",[\s\S]*?category: "([a-z_]+)",[\s\S]*?connectedCitySlugs: \[([^\]]*)\]',
    near,
):
    pslug, cat, cstr = m.group(1), m.group(2), m.group(3)
    if cat not in NATURE:
        continue
    for cm in re.finditer(r'"([a-z0-9-]+)"', cstr):
        city_places.setdefault(cm.group(1), [])
        if pslug not in city_places[cm.group(1)]:
            city_places[cm.group(1)].append(pslug)

# --- exact photo counts per place ---
photos = (ROOT / "lib/data/community-photos.ts").read_text()
off, com = {}, {}
for m in re.finditer(r'nearbyPlaceSlug: "([a-z0-9-]+)"[\s\S]*?sourceType: "(official|community)"', photos):
    p, t = m.group(1), m.group(2)
    (off if t == "official" else com)[p] = (off if t == "official" else com).get(p, 0) + 1

# --- detail-eligible place set ---
detail_src = (ROOT / "lib/data/nearby-place-detail-pages.ts").read_text()
detail = set(re.findall(r'^\s*"([a-z0-9-]+)",', detail_src, re.M))

PERSONAS = [
    ("safest-cities", "Safest Cities", "safest_cities", "overallSafetyScore", "safety"),
    ("family-friendly-cities", "Family Friendly Cities", "family_friendly_cities", "familyFriendlyScore", "family-living"),
    ("digital-nomad-cities", "Digital Nomad Cities", "digital_nomad_cities", "digitalNomadScore", "remote-work suitability"),
    ("retirement-friendly-cities", "Retirement Friendly Cities", "retirement_friendly_cities", "retirementScore", "retirement-suitability"),
    ("high-quality-of-life-cities", "High Quality Of Life Cities", "high_quality_of_life_cities", "qualityOfLifeScore", "quality-of-life"),
]
NEW_SLUGS = [p[0] for p in PERSONAS]

# Existing collection membership sets (avoid identical-set collision). Exclude
# our own 5 slugs so the script is idempotent if they are already spliced in.
tc = (ROOT / "lib/data/thematic-collections.ts").read_text()
existing_sets = set()
for m in re.finditer(r'slug: "([a-z0-9-]+)",[\s\S]*?nearbyPlaces: \[([^\]]*)\]', tc):
    if m.group(1) in NEW_SLUGS:
        continue
    slugs = tuple(sorted(re.findall(r'"([a-z0-9-]+)"', m.group(2))))
    existing_sets.add(slugs)

TARGET_CITIES, TARGET_PLACES, CAP_PLACES = 14, 11, 18
built = []
used_keys = set(existing_sets)

for slug, title, theme, score_key, phrase in PERSONAS:
    ranked = sorted(
        (c for c in scores if c in city_places and city_places[c]),
        key=lambda c: (-scores[c][score_key], c),
    )
    cities, places = [], []
    for c in ranked:
        if len(cities) >= TARGET_CITIES and len(places) >= TARGET_PLACES:
            break
        cities.append(c)
        for p in city_places[c]:
            if p not in places and len(places) < CAP_PLACES:
                places.append(p)
    # ensure distinct membership set (extend with more cities' places if needed)
    idx = len(cities)
    while tuple(sorted(places)) in used_keys and idx < len(ranked):
        for p in city_places[ranked[idx]]:
            if p not in places and len(places) < CAP_PLACES:
                places.append(p)
        if ranked[idx] not in cities and len(cities) < 50:
            cities.append(ranked[idx])
        idx += 1
    key = tuple(sorted(places))
    assert key not in used_keys, f"{slug}: could not make distinct place set"
    used_keys.add(key)
    assert len(places) >= 5 and len(cities) >= 2, (slug, len(places), len(cities))

    official = sum(off.get(p, 0) for p in places)
    community = sum(com.get(p, 0) for p in places)
    eligible = sum(1 for p in places if p in detail)
    built.append({
        "slug": slug, "title": title, "themeType": theme,
        "phrase": phrase, "cities": cities, "places": places,
        "featuredCities": cities[:6], "featuredPlaces": places[:8],
        "official": official, "community": community, "eligible": eligible,
    })


def arr(xs):
    return "[" + ", ".join(f'"{x}"' for x in xs) + "]"


def emit(b):
    related = [s for s in NEW_SLUGS if s != b["slug"]]
    desc = (f"{b['title']} is a thematic discovery collection of {len(b['places'])} "
            f"nearby nature places across {len(b['cities'])} cities, grouped from our "
            f"deterministic {b['phrase']} index. Membership is derived from existing "
            f"city scores and place categories — not popularity, reviews, or paid "
            f"placement. These are planning estimates; verify transport, healthcare, "
            f"weather, and safety with official sources before visiting.")
    L = []
    L.append("  {")
    L.append(f'    slug: "{b["slug"]}",')
    L.append(f'    title: "{b["title"]}",')
    L.append(f'    themeType: "{b["themeType"]}",')
    L.append(f'    description:\n      {json.dumps(desc, ensure_ascii=False)},')
    L.append(f"    cities: {arr(b['cities'])},")
    L.append(f"    nearbyPlaces: {arr(b['places'])},")
    L.append(f"    featuredPlaces: {arr(b['featuredPlaces'])},")
    L.append(f"    featuredCities: {arr(b['featuredCities'])},")
    L.append(f"    weekendTrips: [],")
    L.append(f"    visualGuides: [],")
    L.append(f"    relatedCollections: {arr(related)},")
    L.append(f"    officialPhotoCount: {b['official']},")
    L.append(f"    communityPhotoCount: {b['community']},")
    L.append(f"    photoEligiblePlaceCount: {b['eligible']},")
    L.append("  },")
    return "\n".join(L)


records = "\n".join(emit(b) for b in built)
open("/tmp/quality_collections_records.txt", "w").write(records + "\n")
print("built 5 collections:")
for b in built:
    print(f"  {b['slug']:30s} cities={len(b['cities']):2d} places={len(b['places']):2d} "
          f"off={b['official']} com={b['community']} eligible={b['eligible']} "
          f"top={b['cities'][:3]}")
print("\n--- records written to /tmp/quality_collections_records.txt ---")
