#!/usr/bin/env python3
"""Wave 11.1: deterministically assign each new city to regional + thematic collections
(append-only memberships). Country-scope + nature-category + proximity gated. Writes
/tmp/w12/coll_assign.json = {regional:{slug:[newcities]}, thematic:{slug:[newcities]}}."""
import json, re, math
from pathlib import Path
OUT = Path("/tmp/w12")
cd = json.load(open(OUT / "collections_data.json"))
coords = json.load(open(OUT / "all_city_coords.json"))
sel = json.load(open(OUT / "selected.json"))
nb = json.load(open(OUT / "nearby.json"))
CCSLUG = {c["slug"]: c["countrySlug"] for c in sel}

def hav(a, b, c, d):
    r = math.radians
    return 2*6371*math.asin(math.sqrt(math.sin((r(c)-r(a))/2)**2 + math.cos(r(a))*math.cos(r(c))*math.sin((r(d)-r(b))/2)**2))

# city profiles
prof = {}
for c in sel:
    recs = nb[c["slug"]]
    cats = set(r["category"] for r in recs)
    desig = " ".join((r["facts"].get("designation") or "").lower() for r in recs)
    names = " ".join(r["name"].lower() for r in recs)
    prof[c["slug"]] = {
        "cc": c["countrySlug"], "lat": c["lat"], "lon": c["lon"], "cats": cats,
        "has_np": "national park" in desig,
        "has_river": any(t in names for t in ("valley", "river", "gorge", "vallee", "vallée")),
        "has_waterfall": "waterfall" in desig or "waterfall" in names,
    }

REG_CAT = {"mountain_region": {"mountain"}, "lake_region": {"lake"}, "island_region": {"island"},
           "coastal_region": {"beach", "island"}, "forest_region": {"nature", "park"},
           "protected_landscape_region": {"park", "nature"}}
THEME_CAT = {"mountain_escapes": {"mountain"}, "lake_escapes": {"lake"}, "island_getaways": {"island"},
             "coastal_landscapes": {"beach", "island"}, "forest_walks": {"nature", "park"},
             "protected_landscapes": {"park", "nature"}}
GENERIC_THEMES = {"nature_photography_spots", "sunrise_viewpoints", "hiking_areas", "cycling_friendly_areas",
                  "wildlife_areas", "family_outdoor_escapes", "scenic_drives", "weekend_nature_retreats",
                  "rural_countryside_escapes"}
# region-specific themes we DO NOT auto-assign (Alps/Nordic/Med/Atlantic/Great-Lakes/volcanic/unesco/etc.)
SKIP_THEMES = {"alpine_landscapes", "nordic_nature", "mediterranean_nature", "atlantic_coast_nature",
               "great_lakes_nature", "volcanic_landscapes", "unesco_nature_areas", "cross_border_nature_areas",
               "wetlands_marshes", "safest_cities", "family_friendly_cities", "digital_nomad_cities",
               "retirement_friendly_cities", "high_quality_of_life_cities", "technology_cities", "startup_cities",
               "business_hubs", "remote_work_cities", "finance_centers", "manufacturing_cities", "research_cities",
               "tourism_economies", "government_centers", "innovation_cities", "academic_research_cities",
               "student_cities", "university_cities", "engineering_education_cities", "medical_education_cities",
               "business_education_cities", "international_student_cities", "technology_education_hubs",
               "academic_capitals", "knowledge_economy_cities", "healthcare_cities", "medical_centers",
               "university_medical_cities", "healthcare_access_cities", "healthy_living_cities",
               "active_lifestyle_cities", "senior_friendly_cities", "retirement_cities", "affordable_retirement_cities",
               "nature_retirement_cities"}

CAP = 80
def reg_prox(coll, cc):
    slug, t = coll["slug"], coll["type"]
    if slug == f"{cc}-weekend-escapes": return None        # nationwide catch-all
    if slug.startswith("weekend-escapes-near-"): return 185
    if len(coll["countries"]) > 1: return 110 if t == "cross_border_region" else 850
    if t == "weekend_escape_region": return 380            # single-country state-level
    return None                                            # single-country nationwide nature

def reg_cat_match(coll, p):
    t = coll["type"]
    if t in REG_CAT: return bool(p["cats"] & REG_CAT[t])
    if t == "national_park_region": return p["has_np"]
    if t == "river_region": return p["has_river"]
    if t in ("cross_border_region", "weekend_escape_region"): return True
    return False

def theme_match(coll, p):
    t = coll["type"]
    if t in SKIP_THEMES: return False
    if t in THEME_CAT: return bool(p["cats"] & THEME_CAT[t])
    if t == "national_park_weekends": return p["has_np"]
    if t == "river_valleys": return p["has_river"]
    if t == "waterfall_destinations": return p["has_waterfall"]
    if t in GENERIC_THEMES: return True
    return False

# live city counts (mutated as we assign)
reg_count = {r["slug"]: len(r["cities"]) for r in cd["regional"]}
reg_members = {r["slug"]: set(r["cities"]) for r in cd["regional"]}
the_count = {t["slug"]: len(t["cities"]) for t in cd["thematic"]}
the_members = {t["slug"]: set(t["cities"]) for t in cd["thematic"]}
reg_by = {r["slug"]: r for r in cd["regional"]}
the_by = {t["slug"]: t for t in cd["thematic"]}

def reg_eligible(slug):
    p = prof[slug]; cc = p["cc"]; out = []
    for r in cd["regional"]:
        if cc not in r["countries"]: continue
        if slug in reg_members[r["slug"]]: continue
        if reg_count[r["slug"]] >= CAP: continue
        if not reg_cat_match(r, p): continue
        pr = reg_prox(r, cc)
        if pr is not None:
            cent = r["centroid"]
            if r["slug"].startswith("weekend-escapes-near-"):
                hub = r["slug"].replace("weekend-escapes-near-", "")
                cent = coords.get(hub, cent)
            if not cent: continue
            if hav(p["lat"], p["lon"], cent[0], cent[1]) > pr: continue
        out.append(r["slug"])
    return out

def the_eligible(slug):
    p = prof[slug]; cc = p["cc"]; out = []
    for t in cd["thematic"]:
        if cc not in t["countries"]: continue
        if slug in the_members[t["slug"]]: continue
        if the_count[t["slug"]] >= CAP: continue
        if not theme_match(t, p): continue
        out.append(t["slug"])
    return out

# preference: specific (nature-type, near-hub, state) before nationwide catch-all; smaller collections first
def reg_pref(s, cc):
    coll = reg_by[s]
    nationwide = 1 if s == f"{cc}-weekend-escapes" else 0
    generic = 1 if coll["type"] == "weekend_escape_region" else 0
    return (nationwide, generic, reg_count[s])
def the_pref(s):
    generic = 1 if the_by[s]["type"] in GENERIC_THEMES else 0
    return (generic, the_count[s])

N_REG, N_THE = 5, 6
assign_reg = {r["slug"]: [] for r in cd["regional"]}
assign_the = {t["slug"]: [] for t in cd["thematic"]}
order = [c["slug"] for c in sel]
cov_reg = {c: 0 for c in order}
cov_the = {c: 0 for c in order}

def add_reg(slug, s):
    assign_reg[s].append(slug); reg_members[s].add(slug); reg_count[s] += 1; cov_reg[slug] += 1
def add_the(slug, s):
    assign_the[s].append(slug); the_members[s].add(slug); the_count[s] += 1; cov_the[slug] += 1

# Pass A — guarantee 1 each, picking the eligible collection with the MOST room (spread).
for slug in order:
    cc = prof[slug]["cc"]
    er = reg_eligible(slug)
    if er:
        # prefer a specific (non-catch-all) collection with most room; fall back to catch-all
        er.sort(key=lambda s: (1 if s == f"{cc}-weekend-escapes" else 0, -(CAP - reg_count[s])))
        add_reg(slug, er[0])
    et = the_eligible(slug)
    if et:
        et.sort(key=lambda s: -(CAP - the_count[s]))  # most room first
        add_the(slug, et[0])
# Pass B — enrich up to N, preferring specificity/generic then most room.
for slug in order:
    cc = prof[slug]["cc"]
    for s in sorted(reg_eligible(slug), key=lambda s: reg_pref(s, cc)):
        if cov_reg[slug] >= N_REG: break
        add_reg(slug, s)
    for s in sorted(the_eligible(slug), key=the_pref):
        if cov_the[slug] >= N_THE: break
        add_the(slug, s)

# coverage check
reg_cov = {slug: 0 for slug in order}
the_cov = {slug: 0 for slug in order}
for s, lst in assign_reg.items():
    for c in lst: reg_cov[c] += 1
for s, lst in assign_the.items():
    for c in lst: the_cov[c] += 1
no_reg = [c for c in order if reg_cov[c] == 0]
no_the = [c for c in order if the_cov[c] == 0]
print("cities w/o regional:", len(no_reg), no_reg[:10])
print("cities w/o thematic:", len(no_the), no_the[:10])
print("regional memberships added:", sum(len(v) for v in assign_reg.values()))
print("thematic memberships added:", sum(len(v) for v in assign_the.values()))
print("regional collections touched:", sum(1 for v in assign_reg.values() if v))
print("thematic collections touched:", sum(1 for v in assign_the.values() if v))
print("max regional collection size after:", max(reg_count.values()))
print("max thematic collection size after:", max(the_count.values()))
json.dump({"regional": {k: v for k, v in assign_reg.items() if v},
           "thematic": {k: v for k, v in assign_the.items() if v}},
          open(OUT / "coll_assign.json", "w"))
