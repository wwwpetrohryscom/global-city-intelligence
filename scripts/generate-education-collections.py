#!/usr/bin/env python3
"""Deterministically build 10 education thematic collections. Each groups the top
cities by an education/research signal together with REAL nearby nature places
reachable from them. Computes exact photo counters and guarantees distinct
membership sets vs all existing collections. Emits
/tmp/education_collections_records.txt. No randomness, no network.

NOTE: "Research Cities" already exists as a Phase D economy collection, so the
education research collection uses the distinct slug/theme academic-research-cities."""
import json, re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
scores = {r["citySlug"]: r for r in json.load(open("/tmp/education_scores.json"))}

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

# (slug, title, themeType, score_key, phrase, category_filter, capital_only)
PERSONAS = [
    ("academic-research-cities", "Research University Cities", "academic_research_cities", "researchScore", "research", None, False),
    ("student-cities", "Student Cities", "student_cities", "studentFriendlinessScore", "student-life", None, False),
    ("university-cities", "University Cities", "university_cities", "universityDensityScore", "university-density", None, False),
    ("engineering-education-cities", "Engineering Education Cities", "engineering_education_cities", "focus_engineering", "engineering-education", None, False),
    ("medical-education-cities", "Medical Education Cities", "medical_education_cities", "focus_medical", "medical-education", None, False),
    ("business-education-cities", "Business Education Cities", "business_education_cities", "focus_business", "business-education", None, False),
    ("international-student-cities", "International Student Cities", "international_student_cities", "internationalStudentScore", "international-students", None, False),
    ("technology-education-hubs", "Technology Education Hubs", "technology_education_hubs", "focus_computer_science", "technology-education", None, False),
    ("academic-capitals", "Academic Capitals", "academic_capitals", "academicReputationScore", "academic-reputation", None, True),
    ("knowledge-economy-cities", "Knowledge Economy Cities", "knowledge_economy_cities", "knowledgeScore", "knowledge-economy", None, False),
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

for slug, title, theme, score_key, phrase, cat_filter, capital_only in PERSONAS:
    pool = [c for c in scores if c in city_places and city_places[c]]
    if capital_only:
        pool = [c for c in pool if scores[c]["capital"] == 1]
    ranked = sorted(pool, key=lambda c: (-scores[c][score_key], -scores[c]["educationScore"], c))
    cities, places = [], []
    for c in ranked:
        if len(cities) >= TARGET_CITIES and len(places) >= TARGET_PLACES:
            break
        cities.append(c)
        for p in city_places[c]:
            if p not in places and len(places) < CAP_PLACES:
                places.append(p)
    idx = len(cities)
    while tuple(sorted(places)) in used_keys and idx < len(ranked):
        for p in city_places[ranked[idx]]:
            if p not in places and len(places) < CAP_PLACES:
                places.append(p)
        if ranked[idx] not in cities and len(cities) < CAP_CITIES:
            cities.append(ranked[idx])
        idx += 1
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
            f"city education signals and place categories — not popularity, reviews, or "
            f"institutional rankings. These are planning estimates; verify universities "
            f"and accreditation with official sources.")
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
open("/tmp/education_collections_records.txt", "w").write(records + "\n")
print("built 10 education collections:")
for b in built:
    print(f"  {b['slug']:28s} cities={len(b['cities']):2d} places={len(b['places']):2d} "
          f"elig={b['eligible']} top={b['cities'][:3]}")
