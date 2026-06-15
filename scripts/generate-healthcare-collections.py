#!/usr/bin/env python3
"""Deterministically build 10 healthcare/retirement thematic collections. Each
groups the top cities by a healthcare/retirement signal together with REAL nearby
nature places reachable from them. Computes exact photo counters and guarantees
distinct membership sets vs all existing collections. Emits
/tmp/healthcare_collections_records.txt. No randomness, no network."""
import json, re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
scores = {r["citySlug"]: r for r in json.load(open("/tmp/healthcare_scores.json"))}

NATURE = {"nature", "park", "mountain", "lake", "beach", "island", "waterfront",
          "family_outdoor", "general_weekend_place"}

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

photos = (ROOT / "lib/data/community-photos.ts").read_text()
off, com = {}, {}
for m in re.finditer(r'nearbyPlaceSlug: "([a-z0-9-]+)"[\s\S]*?sourceType: "(official|community)"', photos):
    p, t = m.group(1), m.group(2)
    (off if t == "official" else com)[p] = (off if t == "official" else com).get(p, 0) + 1

detail = set(re.findall(r'^\s*"([a-z0-9-]+)",', (ROOT / "lib/data/nearby-place-detail-pages.ts").read_text(), re.M))

# (slug, title, themeType, score_key, phrase, ret_cat_filter, min_retirement)
PERSONAS = [
    ("healthcare-cities", "Healthcare Cities", "healthcare_cities", "healthcareScore", "healthcare", None, None),
    ("medical-centers", "Medical Centers", "medical_centers", "hospitalAvailabilityScore", "hospital-availability", None, None),
    ("university-medical-cities", "University Medical Cities", "university_medical_cities", "uniHospitalCount", "university-medical", None, None),
    ("healthcare-access-cities", "Healthcare Access Cities", "healthcare_access_cities", "healthcareAccessScore", "healthcare-access", None, None),
    ("healthy-living-cities", "Healthy Living Cities", "healthy_living_cities", "healthyLivingScore", "healthy-living", None, None),
    ("active-lifestyle-cities", "Active Lifestyle Cities", "active_lifestyle_cities", "activeLifestyleScore", "active-lifestyle", None, None),
    ("senior-friendly-cities", "Senior Friendly Cities", "senior_friendly_cities", "seniorScore", "senior-friendliness", None, None),
    ("retirement-cities", "Retirement Cities", "retirement_cities", "retirementScore", "retirement", None, None),
    ("affordable-retirement-cities", "Affordable Retirement Cities", "affordable_retirement_cities", "affordabilityScore", "affordable-retirement", None, 50),
    ("nature-retirement-cities", "Nature Retirement Cities", "nature_retirement_cities", "activeLifestyleScore", "nature-retirement", "nature_retirement", None),
]
NEW_SLUGS = [p[0] for p in PERSONAS]

tc = (ROOT / "lib/data/thematic-collections.ts").read_text()
existing_sets = set()
for m in re.finditer(r'slug: "([a-z0-9-]+)",[\s\S]*?nearbyPlaces: \[([^\]]*)\]', tc):
    if m.group(1) in NEW_SLUGS:
        continue
    existing_sets.add(tuple(sorted(re.findall(r'"([a-z0-9-]+)"', m.group(2)))))

TARGET_CITIES, TARGET_PLACES, CAP_PLACES, CAP_CITIES = 14, 11, 18, 40
built = []
used_keys = set(existing_sets)

for slug, title, theme, score_key, phrase, ret_filter, min_ret in PERSONAS:
    pool = [c for c in scores if c in city_places and city_places[c]]
    if ret_filter:
        pool = [c for c in pool if scores[c]["retirementCategory"] == ret_filter]
    if min_ret is not None:
        pool = [c for c in pool if scores[c]["retirementScore"] >= min_ret]
    ranked = sorted(pool, key=lambda c: (-scores[c][score_key], -scores[c]["healthcareScore"], c))
    cities, places = [], []
    for c in ranked:
        if len(cities) >= TARGET_CITIES and len(places) >= TARGET_PLACES:
            break
        cities.append(c)
        for p in city_places[c]:
            if p not in places and len(places) < CAP_PLACES:
                places.append(p)
    idx = len(cities)
    key = tuple(sorted(places))
    # Differentiate from any already-used set. When the place list is at capacity,
    # SWAP the last place for a fresh one (a weakly-tied signal like uniHospitalCount
    # can otherwise reproduce another collection's exact set).
    while key in used_keys and idx < len(ranked):
        nextcity = ranked[idx]
        idx += 1
        fresh = [p for p in city_places[nextcity] if p not in places]
        if fresh:
            if len(places) >= CAP_PLACES:
                places[-1] = fresh[0]
            else:
                places.append(fresh[0])
            if nextcity not in cities and len(cities) < CAP_CITIES:
                cities.append(nextcity)
            key = tuple(sorted(places))
    assert key not in used_keys, f"{slug}: could not make distinct place set"
    used_keys.add(key)
    assert len(places) >= 5 and len(cities) >= 2, (slug, len(places), len(cities))

    built.append({
        "slug": slug, "title": title, "themeType": theme, "phrase": phrase,
        "cities": cities, "places": places,
        "featuredCities": cities[:6], "featuredPlaces": places[:8],
        "official": sum(off.get(p, 0) for p in places),
        "community": sum(com.get(p, 0) for p in places),
        "eligible": sum(1 for p in places if p in detail),
    })


def arr(xs):
    return "[" + ", ".join(f'"{x}"' for x in xs) + "]"


def emit(b):
    related = [s for s in NEW_SLUGS if s != b["slug"]][:12]
    desc = (f"{b['title']} is a thematic discovery collection of {len(b['places'])} "
            f"nearby nature places across {len(b['cities'])} cities, grouped from our "
            f"deterministic {b['phrase']} index. Membership is derived from existing "
            f"city healthcare and retirement signals and place categories — not "
            f"popularity, reviews, or medical rankings. These are planning estimates; "
            f"verify healthcare facilities and services with official sources.")
    L = ["  {",
         f'    slug: "{b["slug"]}",',
         f'    title: "{b["title"]}",',
         f'    themeType: "{b["themeType"]}",',
         f'    description:\n      {json.dumps(desc, ensure_ascii=False)},',
         f"    cities: {arr(b['cities'])},",
         f"    nearbyPlaces: {arr(b['places'])},",
         f"    featuredPlaces: {arr(b['featuredPlaces'])},",
         f"    featuredCities: {arr(b['featuredCities'])},",
         "    weekendTrips: [],",
         "    visualGuides: [],",
         f"    relatedCollections: {arr(related)},",
         f"    officialPhotoCount: {b['official']},",
         f"    communityPhotoCount: {b['community']},",
         f"    photoEligiblePlaceCount: {b['eligible']},",
         "  },"]
    return "\n".join(L)


records = "\n".join(emit(b) for b in built)
open("/tmp/healthcare_collections_records.txt", "w").write(records + "\n")
print("built 10 healthcare/retirement collections:")
for b in built:
    print(f"  {b['slug']:30s} cities={len(b['cities']):2d} places={len(b['places']):2d} "
          f"elig={b['eligible']} top={b['cities'][:3]}")
