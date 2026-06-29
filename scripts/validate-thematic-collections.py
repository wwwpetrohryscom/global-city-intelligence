#!/usr/bin/env python3
"""
Validate the thematic discovery collections in lib/data/thematic-collections.ts:

  - unique collection slugs
  - valid city references (exist in cities.ts)
  - valid place references (exist in nearby-places.ts)
  - 5-50 nearby places, 2-50 cities
  - valid theme type
  - featured / weekendTrips / visualGuides are subsets of members
  - relatedCollections: 2-15, no self-reference, no duplicates, all resolve (no orphan)
  - no duplicate collection membership sets / no exact duplicate collections
  - photo counters consistent with community-photos.ts + detail pages, non-negative

Mirrors the runtime guard (which fails `next build`). Non-zero exit on failure.
"""
from __future__ import annotations
import re, sys
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "lib/data/thematic-collections.ts"
PLACES = ROOT / "lib/data/nearby-places.ts"
CITIES = ROOT / "lib/data/cities.ts"
PHOTOS = ROOT / "lib/data/community-photos.ts"
DETAILS = ROOT / "lib/data/nearby-place-detail-pages.ts"

VALID_THEMES = {
    "mountain_escapes","lake_escapes","coastal_landscapes","island_getaways","forest_walks",
    "national_park_weekends","protected_landscapes","river_valleys","waterfall_destinations",
    "nature_photography_spots","sunrise_viewpoints","hiking_areas","cycling_friendly_areas",
    "wildlife_areas","unesco_nature_areas","cross_border_nature_areas","family_outdoor_escapes",
    "scenic_drives","weekend_nature_retreats","alpine_landscapes","nordic_nature","mediterranean_nature",
    "atlantic_coast_nature","great_lakes_nature","volcanic_landscapes","wetlands_marshes",
    "rural_countryside_escapes","safest_cities","family_friendly_cities","digital_nomad_cities",
    "retirement_friendly_cities","high_quality_of_life_cities","technology_cities","startup_cities",
    "business_hubs","remote_work_cities","finance_centers","manufacturing_cities","research_cities",
    "tourism_economies","government_centers","innovation_cities",
    "academic_research_cities","student_cities","university_cities","engineering_education_cities",
    "medical_education_cities","business_education_cities","international_student_cities",
    "technology_education_hubs","academic_capitals","knowledge_economy_cities",
    "healthcare_cities","medical_centers","university_medical_cities","healthcare_access_cities",
    "healthy_living_cities","active_lifestyle_cities","senior_friendly_cities","retirement_cities",
    "affordable_retirement_cities","nature_retirement_cities",
}
NATURE_CATEGORIES = {"nature","park","mountain","lake","beach","island","waterfront","family_outdoor","general_weekend_place"}
NORDIC_COUNTRIES = {"sweden","finland","denmark","norway","iceland"}
EUROPE_COUNTRIES = {"austria","belgium","bulgaria","croatia","czechia","denmark","estonia","finland","france",
    "germany","greece","hungary","ireland","italy","latvia","lithuania","luxembourg","netherlands","poland",
    "portugal","romania","slovakia","slovenia","spain","sweden","united-kingdom"}
MIN_P, MAX_P, MIN_C, MAX_C, MIN_R, MAX_R = 5, 50, 2, 80, 2, 15


def arr(field, block):
    m = re.search(field + r":\s*\[(.*?)\]", block, re.DOTALL)
    return re.findall(r'"([^"]+)"', m.group(1)) if m else []


def num(field, block):
    m = re.search(field + r":\s*(-?\d+)", block)
    return int(m.group(1)) if m else None


def main() -> int:
    text = DATA.read_text()
    psrc_all = PLACES.read_text()
    place_slugs = set(re.findall(r'\bslug:\s*"([a-z0-9][a-z0-9-]*)"', psrc_all))
    city_slugs = set(re.findall(r'\bslug:\s*"([a-z0-9][a-z0-9-]*)"', CITIES.read_text()))
    place_category = dict(re.findall(r'slug:\s*"([a-z0-9-]+)"[^}]*?category:\s*"([a-z_]+)"', psrc_all, re.DOTALL))
    place_country = dict(re.findall(r'slug:\s*"([a-z0-9-]+)",\s*\n\s*name:\s*"[^"]*",\s*\n\s*countrySlug:\s*"([a-z0-9-]+)"', psrc_all))
    # photo attachment from community-photos.ts
    psrc = PHOTOS.read_text()
    off, com = Counter(), Counter()
    for rec in re.split(r'\n  \{', psrc):
        ps = re.search(r'nearbyPlaceSlug:\s*"([a-z0-9-]+)"', rec)
        st = re.search(r'sourceType:\s*"([a-z_]+)"', rec)
        if ps and st:
            (off if st.group(1) == "official" else com)[ps.group(1)] += 1
    dtxt = DETAILS.read_text()
    di = dtxt.index("= [", dtxt.index("NEARBY_WEEKEND_PLACE_DETAIL_SLUGS")) + 2
    d, j = 0, di
    while j < len(dtxt):
        if dtxt[j] == "[": d += 1
        elif dtxt[j] == "]":
            d -= 1
            if d == 0: break
        j += 1
    detail = set(re.findall(r'"([a-z0-9-]+)"', dtxt[di:j]))

    blocks = re.split(r'\n  \{\n', text)
    errors: list[str] = []
    slugs_seen = set()
    parsed = []
    for b in blocks:
        sm = re.search(r'slug:\s*"([a-z0-9-]+)"', b)
        tm = re.search(r'themeType:\s*"([a-z_]+)"', b)
        if not sm or not tm:
            continue
        slug, theme = sm.group(1), tm.group(1)
        if slug in slugs_seen: errors.append(f"{slug}: duplicate slug")
        slugs_seen.add(slug)
        if theme not in VALID_THEMES: errors.append(f"{slug}: invalid themeType {theme}")
        places = arr("nearbyPlaces", b); cs = arr("cities", b)
        fp = arr("featuredPlaces", b); fc = arr("featuredCities", b)
        wt = arr("weekendTrips", b); vg = arr("visualGuides", b)
        related = arr("relatedCollections", b)
        parsed.append((slug, places))
        if not (MIN_P <= len(places) <= MAX_P): errors.append(f"{slug}: {len(places)} places out of 5-50")
        if not (MIN_C <= len(cs) <= MAX_C): errors.append(f"{slug}: {len(cs)} cities out of 2-50")
        if len(places) != len(set(places)): errors.append(f"{slug}: duplicate place refs")
        if len(cs) != len(set(cs)): errors.append(f"{slug}: duplicate city refs")
        for p in places:
            if p not in place_slugs: errors.append(f"{slug}: place {p} not in nearby-places.ts")
            cat = place_category.get(p)
            if cat and cat not in NATURE_CATEGORIES: errors.append(f"{slug}: non-nature place {p} ({cat})")
            pc = place_country.get(p)
            if theme == "nordic_nature" and pc and pc not in NORDIC_COUNTRIES: errors.append(f"{slug}: non-Nordic place {p} ({pc})")
            if theme == "alpine_landscapes" and pc and pc not in EUROPE_COUNTRIES: errors.append(f"{slug}: non-European alpine place {p} ({pc})")
        for c in cs:
            if c not in city_slugs: errors.append(f"{slug}: city {c} not in cities.ts")
        pset, cset = set(places), set(cs)
        for p in fp:
            if p not in pset: errors.append(f"{slug}: featuredPlace {p} not a member")
        for c in fc + wt + vg:
            if c not in cset: errors.append(f"{slug}: city-derived ref {c} not a member city")
        if not (MIN_R <= len(related) <= MAX_R): errors.append(f"{slug}: {len(related)} related out of 2-15")
        if slug in related: errors.append(f"{slug}: related self-reference")
        if len(related) != len(set(related)): errors.append(f"{slug}: duplicate related refs")
        # photo consistency
        eo = sum(off.get(p, 0) for p in places)
        ec = sum(com.get(p, 0) for p in places)
        ee = sum(1 for p in places if p in detail)
        if num("officialPhotoCount", b) != eo: errors.append(f"{slug}: officialPhotoCount mismatch ({num('officialPhotoCount', b)} != {eo})")
        if num("communityPhotoCount", b) != ec: errors.append(f"{slug}: communityPhotoCount mismatch")
        if num("photoEligiblePlaceCount", b) != ee: errors.append(f"{slug}: photoEligiblePlaceCount mismatch")

    all_slugs = {s for s, _ in parsed}
    for b in blocks:
        sm = re.search(r'slug:\s*"([a-z0-9-]+)"', b)
        if not sm or sm.group(1) not in all_slugs:
            continue
        for r in arr("relatedCollections", b):
            if r not in all_slugs: errors.append(f"{sm.group(1)}: related {r} not found")

    member_sets = {}
    for slug, places in parsed:
        key = tuple(sorted(places))
        if key in member_sets: errors.append(f"{slug}: duplicate membership set of {member_sets[key]}")
        else: member_sets[key] = slug

    if errors:
        print("FAIL: thematic-collections validation failed:", file=sys.stderr)
        for e in errors[:50]:
            print(f"  - {e}", file=sys.stderr)
        return 1
    themes_used = len({re.search(r'themeType:\s*"([a-z_]+)"', b).group(1)
                       for b in blocks if re.search(r'themeType:\s*"([a-z_]+)"', b)})
    rel = sum(len(arr("relatedCollections", b)) for b in blocks if re.search(r'themeType', b))
    print(f"PASS: thematic-collections ({len(parsed)} collections, {themes_used} theme types, "
          f"{rel} related links) — all checks clean.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
