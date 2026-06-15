#!/usr/bin/env python3
"""Deterministic Healthcare & Retirement + medical-facilities generator. No
randomness, no network.

Inputs (per city): /tmp/economy_signals.json (population, name, countrySlug,
comfort, affordability, airQuality, infrastructure, natureCount, coastal,
mountain, airport) + /tmp/quality_scores.json (QoL healthcare/overallSafety/
retirement/walkability/outdoorLifestyle/greenSpace/cleanliness/mobility/qol) +
/tmp/education_scores.json (researchScore, focus_medical, capital). Blended with
country HEALTH priors + PUBLIC-healthcare-affordability tiers.

HEALTHCARE SCORES (clamped 0-100; s=clamp(log10(pop)-5,-1..2.2); cap=0/1):
  access      = .55*hQoL + .30*healthB + 4*min(s,1.5) + 4cap
  hospitalAv  = .30*hQoL + .30*healthB + 9*min(s,2.0) + 5cap
  specialist  = .30*hQoL + .25*healthB + .15*eduResearch + 6*min(s,1.7) + 5cap + 2*min(medSchools,4)
  preventative= .45*hQoL + .25*healthB + .15*cleanliness + 3*min(s,1.3)
  emergency   = .40*hQoL + .20*healthB + .15*infra + 6*min(s,1.6) + 4cap
  affordabilityHc = publicBase(US=44 / high-public=80 / else=58) + .15(aff-50)
  healthcare  = .20access + .16hospitalAv + .16specialist + .12preventative + .14emergency
                + .12affordabilityHc + .10*hQoL
RETIREMENT SCORES (anchored on existing QoL signals for cross-phase consistency):
  affordability = aff;  healthcareSupport = healthcare;  climateComfort = comfort
  safetySupport = QoL.overallSafety;  walkability = QoL.walkability
  accessibility = .45*mobility + .35*walkability + .20*infra
  activeLifestyle = .40*outdoorLifestyle + .22*comfort + .18*min(100,nature*13) + .12*walkability
                    + 8[coast] + 6[mtn]
  retirement = .22healthcareSupport + .18affordability + .16safetySupport + .14climateComfort
               + .12activeLifestyle + .10accessibility + .08walkability
FACILITIES: 3-10 per city by category+size; generic type-based names; REPRESENTATIVE
dataset entities only — not a directory of real or accredited facilities.

Writes lib/data/healthcare-retirement.ts and /tmp/healthcare_scores.json."""
import json, math
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
sig = {r["slug"]: r for r in json.load(open("/tmp/economy_signals.json"))}
q = {r["citySlug"]: r for r in json.load(open("/tmp/quality_scores.json"))}
edu = {r["citySlug"]: r for r in json.load(open("/tmp/education_scores.json"))}


def tset(slugs, val, d):
    for s in slugs:
        d[s] = val


HEALTH = {}
tset(["switzerland", "norway", "denmark", "finland", "sweden", "iceland",
      "netherlands", "austria", "luxembourg", "japan", "singapore", "germany",
      "france", "belgium", "canada", "australia"], 90, HEALTH)
tset(["united-kingdom", "ireland", "new-zealand", "south-korea", "taiwan",
      "hong-kong", "spain", "italy", "portugal", "slovenia", "czechia", "estonia",
      "israel", "united-arab-emirates", "qatar"], 84, HEALTH)
tset(["poland", "hungary", "slovakia", "lithuania", "latvia", "croatia", "greece",
      "chile", "uruguay", "costa-rica", "malaysia", "china", "saudi-arabia",
      "kuwait", "bahrain", "oman", "panama"], 74, HEALTH)
tset(["romania", "bulgaria", "serbia", "montenegro", "north-macedonia", "albania",
      "bosnia-and-herzegovina", "moldova", "ukraine", "turkey", "thailand", "mexico",
      "brazil", "argentina", "colombia", "peru", "ecuador", "dominican-republic",
      "jordan", "lebanon", "sri-lanka", "tunisia", "morocco", "south-africa",
      "namibia", "botswana", "vietnam", "philippines", "indonesia"], 64, HEALTH)
tset(["india", "egypt", "pakistan", "nigeria", "kenya", "ghana", "ethiopia",
      "tanzania", "uganda", "rwanda", "zambia", "mozambique", "senegal", "cambodia",
      "guatemala"], 54, HEALTH)
HEALTH_DEFAULT = 64

HIGH_PUBLIC = {
    "switzerland", "norway", "denmark", "finland", "sweden", "iceland", "netherlands",
    "austria", "luxembourg", "germany", "france", "belgium", "canada", "australia",
    "new-zealand", "united-kingdom", "ireland", "spain", "italy", "portugal", "slovenia",
    "czechia", "estonia", "lithuania", "latvia", "slovakia", "poland", "hungary", "croatia",
    "greece", "japan", "south-korea", "taiwan", "israel", "romania", "bulgaria",
}


def clamp(x):
    return max(0, min(100, int(round(x))))


def parse_pop(s):
    import re
    m = re.search(r'([\d.]+)\s*([MmKk])', s or '')
    if not m:
        return 300000.0
    return float(m.group(1)) * (1e6 if m.group(2) in 'Mm' else 1e3)


def band(x):
    if x >= 80:
        return "very strong"
    if x >= 68:
        return "strong"
    if x >= 55:
        return "solid"
    if x >= 42:
        return "developing"
    return "limited"


def join_human(items):
    items = list(items)
    if not items:
        return ""
    if len(items) == 1:
        return items[0]
    return ", ".join(items[:-1]) + " and " + items[-1]


HC_CAT_PHRASE = {
    "global_medical_hub": "a major medical hub",
    "major_healthcare_center": "a major healthcare center",
    "regional_healthcare_center": "a regional healthcare center",
    "healthcare_access_city": "solid baseline healthcare access",
    "developing_healthcare_market": "a developing healthcare market",
    "mixed": "a mixed healthcare profile",
}

FAC_PATTERN = ["general_hospital", "medical_center", "community_hospital",
               "specialist_hospital", "university_hospital", "general_hospital",
               "medical_center", "specialist_hospital", "community_hospital",
               "medical_center"]
FAC_NAMES = {
    "general_hospital": ["{C} General Hospital", "{C} City Hospital", "{C} Central Hospital"],
    "medical_center": ["{C} Medical Center", "{C} Health Center", "{C} Clinic Center"],
    "community_hospital": ["{C} Community Hospital", "{C} District Hospital", "{C} Regional Clinic"],
    "specialist_hospital": ["{C} Specialist Hospital", "{C} Specialist Medical Center", "{C} Rehabilitation Center"],
    "university_hospital": ["{C} University Hospital", "{C} Teaching Hospital"],
}
HC_COUNT_BASE = {"global_medical_hub": 9, "major_healthcare_center": 7,
                 "regional_healthcare_center": 5, "healthcare_access_city": 4,
                 "developing_healthcare_market": 3, "mixed": 3}
VALID_HC_CATS = set(HC_CAT_PHRASE)
VALID_RET_CATS = {"premium_retirement", "active_retirement", "affordable_retirement",
                  "urban_retirement", "nature_retirement", "mixed"}
VALID_FAC_TYPES = set(FAC_NAMES)
VALID_SVC = {"local", "regional", "national"}


def gen_city(slug):
    s_ = sig[slug]
    qq = q[slug]
    ed = edu.get(slug, {})
    name = s_["name"]
    cs = s_["countrySlug"]
    comfort = s_["comfort"]
    aff = s_["affordability"]
    airq = s_["airQuality"]
    infra = s_["infrastructure"]
    natureCount = s_["natureCount"]
    coast, mtn = s_["coastal"], s_["mountain"]
    hQoL = qq["healthcareScore"]
    safety = qq["overallSafetyScore"]
    walk = qq["walkabilityScore"]
    outdoor = qq["outdoorLifestyleScore"]
    green = qq["greenSpaceScore"]
    clean = qq["cleanlinessScore"]
    mobility = qq["mobilityScore"]
    qol = qq["qualityOfLifeScore"]
    eduResearch = ed.get("researchScore", 55)
    medSchools = ed.get("focus_medical", 0)
    cap = ed.get("capital", 0)
    healthB = HEALTH.get(cs, HEALTH_DEFAULT)
    pop = parse_pop(s_["population"])
    s = max(-1.0, min(2.2, math.log10(max(pop, 1.0)) - 5.0))

    access = clamp(0.55 * hQoL + 0.30 * healthB + 4 * min(s, 1.5) + 4 * cap)
    hospitalAv = clamp(0.30 * hQoL + 0.30 * healthB + 9 * min(s, 2.0) + 5 * cap)
    specialist = clamp(0.30 * hQoL + 0.25 * healthB + 0.15 * eduResearch + 6 * min(s, 1.7)
                       + 5 * cap + 2 * min(medSchools, 4))
    preventative = clamp(0.45 * hQoL + 0.25 * healthB + 0.15 * clean + 3 * min(s, 1.3))
    emergency = clamp(0.40 * hQoL + 0.20 * healthB + 0.15 * infra + 6 * min(s, 1.6) + 4 * cap)
    publicBase = 44 if cs == "united-states" else (80 if cs in HIGH_PUBLIC else 58)
    affordabilityHc = clamp(publicBase + 0.15 * (aff - 50))
    healthcare = clamp(0.20 * access + 0.16 * hospitalAv + 0.16 * specialist + 0.12 * preventative
                       + 0.14 * emergency + 0.12 * affordabilityHc + 0.10 * hQoL)

    if pop >= 4e6 and healthcare >= 80:
        hc_cat = "global_medical_hub"
    elif healthcare >= 72 and pop >= 1e6:
        hc_cat = "major_healthcare_center"
    elif healthcare < 54:
        hc_cat = "developing_healthcare_market"
    elif affordabilityHc >= 72 and access >= 64 and healthcare < 70:
        hc_cat = "healthcare_access_city"
    elif healthcare >= 60:
        hc_cat = "regional_healthcare_center"
    else:
        hc_cat = "mixed"

    # retirement
    accessibility = clamp(0.45 * mobility + 0.35 * walk + 0.20 * infra)
    activeLifestyle = clamp(0.40 * outdoor + 0.22 * comfort + 0.18 * min(100, natureCount * 13)
                            + 0.12 * walk + (8 if coast else 0) + (6 if mtn else 0))
    retirement = clamp(0.22 * healthcare + 0.18 * aff + 0.16 * safety + 0.14 * comfort
                       + 0.12 * activeLifestyle + 0.10 * accessibility + 0.08 * walk)

    if retirement >= 72 and healthcare >= 74 and safety >= 74:
        ret_cat = "premium_retirement"
    elif (coast or mtn) and natureCount >= 4 and activeLifestyle >= 62:
        ret_cat = "nature_retirement"
    elif activeLifestyle >= 68:
        ret_cat = "active_retirement"
    elif pop >= 1.0e6 and walk >= 68 and accessibility >= 66:
        ret_cat = "urban_retirement"
    elif aff >= 64 and retirement >= 52:
        ret_cat = "affordable_retirement"
    else:
        ret_cat = "mixed"

    # facilities
    count = HC_COUNT_BASE[hc_cat] + (1 if s >= 1.0 else 0) + (1 if s >= 1.6 else 0) + (1 if s >= 2.0 else 0)
    count = max(3, min(10, count))
    has_med_school = medSchools >= 1 or ed.get("educationCategory") in ("global_academic_hub", "major_university_city", "research_center")
    facilities = []
    type_use = {}
    uni_hosp = 0
    for i in range(count):
        ftype = FAC_PATTERN[i % len(FAC_PATTERN)]
        if ftype == "university_hospital" and not has_med_school:
            ftype = "medical_center"
        templates = FAC_NAMES[ftype]
        u = type_use.get(ftype, 0)
        if u < len(templates):
            fname = templates[u].format(C=name)
        else:
            fname = templates[u % len(templates)].format(C=name) + f" {u // len(templates) + 1}"
        type_use[ftype] = u + 1
        if ftype == "university_hospital":
            uni_hosp += 1
        lvl_score = (2 if pop >= 2e6 else (1 if pop >= 6e5 else 0)) + (1 if cap and i == 0 else 0) \
            + (1 if ftype in ("university_hospital", "specialist_hospital") else 0) \
            - (1 if ftype == "community_hospital" else 0)
        svc = "national" if lvl_score >= 3 else ("regional" if lvl_score >= 1 else "local")
        facilities.append({
            "id": f"{slug}-fac-{i + 1}", "citySlug": slug, "name": fname, "type": ftype,
            "serviceLevel": svc, "createdAt": "2026-06-15", "updatedAt": "2026-06-15",
        })

    healthyLiving = clamp(0.30 * outdoor + 0.25 * clean + 0.20 * healthcare + 0.15 * airq + 0.10 * green)
    senior = clamp(0.30 * accessibility + 0.25 * safety + 0.25 * healthcare + 0.20 * walk)

    # summaries
    hc_sum = (f"{name} has {HC_CAT_PHRASE[hc_cat]}, supported by hospitals, specialist "
              f"services, and public-health infrastructure, with a healthcare score of {healthcare}/100.")
    ma_sum = (f"Residents have {band(access)} access to healthcare across primary, "
              f"specialist, and emergency care.")
    env_fac = []
    if has_med_school:
        env_fac.append("medical education")
    if eduResearch >= 70:
        env_fac.append("research activity")
    env_fac.append("local medical services")
    he_sum = (f"The healthcare environment in {name} is supported by {join_human(env_fac)}, "
              f"with {count} representative facilities in our dataset.")

    ret_sum = (f"{name} offers a combination of healthcare access, safety, and amenities "
               f"that may appeal to retirees, with a retirement score of {retirement}/100.")
    life_fac = []
    if green >= 65:
        life_fac.append("parks and green space")
    if walk >= 68:
        life_fac.append("walkable streets")
    if qol >= 70:
        life_fac.append("broad urban amenities")
    if not life_fac:
        life_fac.append("local amenities")
    life_sum = f"Residents benefit from {join_human(life_fac)} and day-to-day services."
    aff_sum = (f"Retirement affordability in {name} reflects local living costs, housing, "
               f"and service availability, with an affordability score of {aff}/100.")
    act_extra = ", coastal access" if coast else (", mountain access" if mtn else "")
    act_sum = (f"Outdoor recreation{act_extra} and walkability support an active retirement "
               f"lifestyle in {name}.")

    hc_profile = {
        "citySlug": slug, "healthcareScore": healthcare, "healthcareAccessScore": access,
        "hospitalAvailabilityScore": hospitalAv, "specialistCareScore": specialist,
        "preventativeCareScore": preventative, "emergencyCareScore": emergency,
        "healthcareAffordabilityScore": affordabilityHc, "healthcareCategory": hc_cat,
        "healthcareSummary": hc_sum, "medicalAccessSummary": ma_sum,
        "healthcareEnvironmentSummary": he_sum,
        "createdAt": "2026-06-15", "updatedAt": "2026-06-15",
    }
    ret_profile = {
        "citySlug": slug, "retirementScore": retirement, "affordabilityScore": aff,
        "healthcareSupportScore": healthcare, "climateComfortScore": comfort,
        "safetySupportScore": safety, "walkabilityScore": walk,
        "accessibilityScore": accessibility, "activeLifestyleScore": activeLifestyle,
        "retirementCategory": ret_cat, "retirementSummary": ret_sum,
        "lifestyleSummary": life_sum, "affordabilitySummary": aff_sum,
        "activeLivingSummary": act_sum,
        "createdAt": "2026-06-15", "updatedAt": "2026-06-15",
    }
    score_row = {
        "citySlug": slug, "healthcareScore": healthcare, "healthcareAccessScore": access,
        "hospitalAvailabilityScore": hospitalAv, "healthcareAffordabilityScore": affordabilityHc,
        "retirementScore": retirement, "affordabilityScore": aff,
        "activeLifestyleScore": activeLifestyle, "healthyLivingScore": healthyLiving,
        "seniorScore": senior, "uniHospitalCount": uni_hosp, "facilityCount": count,
        "healthcareCategory": hc_cat, "retirementCategory": ret_cat, "capital": cap,
        "coastal": 1 if coast else 0, "mountain": 1 if mtn else 0, "natureCount": natureCount,
    }
    return hc_profile, ret_profile, facilities, score_row


hc_profiles, ret_profiles, facilities, score_rows = [], [], [], []
for slug in sig:
    h, r, fs, row = gen_city(slug)
    hc_profiles.append(h)
    ret_profiles.append(r)
    facilities.extend(fs)
    score_rows.append(row)

# --- Python guard mirror ---
HC_SCORES = ["healthcareScore", "healthcareAccessScore", "hospitalAvailabilityScore",
             "specialistCareScore", "preventativeCareScore", "emergencyCareScore",
             "healthcareAffordabilityScore"]
HC_SUMM = ["healthcareSummary", "medicalAccessSummary", "healthcareEnvironmentSummary"]
RET_SCORES = ["retirementScore", "affordabilityScore", "healthcareSupportScore",
              "climateComfortScore", "safetySupportScore", "walkabilityScore",
              "accessibilityScore", "activeLifestyleScore"]
RET_SUMM = ["retirementSummary", "lifestyleSummary", "affordabilitySummary", "activeLivingSummary"]
hc_seen, ret_seen = set(), set()
for h in hc_profiles:
    assert h["citySlug"] not in hc_seen
    hc_seen.add(h["citySlug"])
    for k in HC_SCORES:
        assert isinstance(h[k], int) and 0 <= h[k] <= 100, (h["citySlug"], k, h[k])
    assert h["healthcareCategory"] in VALID_HC_CATS
    for k in HC_SUMM:
        assert isinstance(h[k], str) and len(h[k]) >= 12
for r in ret_profiles:
    assert r["citySlug"] not in ret_seen
    ret_seen.add(r["citySlug"])
    for k in RET_SCORES:
        assert isinstance(r[k], int) and 0 <= r[k] <= 100, (r["citySlug"], k, r[k])
    assert r["retirementCategory"] in VALID_RET_CATS
    for k in RET_SUMM:
        assert isinstance(r[k], str) and len(r[k]) >= 12
assert hc_seen == ret_seen == set(sig)
fids = set()
per_city = {}
for f in facilities:
    assert f["id"] not in fids
    fids.add(f["id"])
    assert f["citySlug"] in hc_seen
    assert f["type"] in VALID_FAC_TYPES
    assert f["serviceLevel"] in VALID_SVC
    assert f["name"]
    per_city[f["citySlug"]] = per_city.get(f["citySlug"], 0) + 1
for slug, n in per_city.items():
    assert 3 <= n <= 10, (slug, n)
assert set(per_city) == hc_seen

json.dump(score_rows, open("/tmp/healthcare_scores.json", "w"))


def j(v):
    return json.dumps(v, ensure_ascii=False)


L = []
L.append('import type { HealthcareProfile } from "@/types/healthcare";')
L.append('import type { MedicalFacility } from "@/types/medical-facilities";')
L.append('import type { RetirementProfile } from "@/types/retirement";')
L.append("")
L.append("/**")
L.append(" * Deterministic per-city Healthcare + Retirement profiles + REPRESENTATIVE")
L.append(" * medical-facility entities. Generated by scripts/generate-healthcare.py from")
L.append(" * country healthcare priors blended with existing per-city signals. Distinct")
L.append(" * from the verified country-level data in lib/data/healthcare.ts. Facilities")
L.append(" * are illustrative dataset entities for discovery and SEO — NOT a directory of")
L.append(" * real or accredited hospitals, and scores are NOT clinical outcomes. Do not")
L.append(" * edit by hand; rules are documented in the generator header.")
L.append(" */")
L.append("export const healthcareProfiles: readonly HealthcareProfile[] = [")
for h in hc_profiles:
    L.append("  {")
    L.append(f"    citySlug: {j(h['citySlug'])},")
    L.append("    healthcareScore: %d, healthcareAccessScore: %d, hospitalAvailabilityScore: %d," % (
        h["healthcareScore"], h["healthcareAccessScore"], h["hospitalAvailabilityScore"]))
    L.append("    specialistCareScore: %d, preventativeCareScore: %d, emergencyCareScore: %d," % (
        h["specialistCareScore"], h["preventativeCareScore"], h["emergencyCareScore"]))
    L.append("    healthcareAffordabilityScore: %d," % h["healthcareAffordabilityScore"])
    L.append(f"    healthcareCategory: {j(h['healthcareCategory'])},")
    L.append(f"    healthcareSummary: {j(h['healthcareSummary'])},")
    L.append(f"    medicalAccessSummary: {j(h['medicalAccessSummary'])},")
    L.append(f"    healthcareEnvironmentSummary: {j(h['healthcareEnvironmentSummary'])},")
    L.append('    createdAt: "2026-06-15", updatedAt: "2026-06-15",')
    L.append("  },")
L.append("];")
L.append("")
L.append("export const retirementProfiles: readonly RetirementProfile[] = [")
for r in ret_profiles:
    L.append("  {")
    L.append(f"    citySlug: {j(r['citySlug'])},")
    L.append("    retirementScore: %d, affordabilityScore: %d, healthcareSupportScore: %d," % (
        r["retirementScore"], r["affordabilityScore"], r["healthcareSupportScore"]))
    L.append("    climateComfortScore: %d, safetySupportScore: %d, walkabilityScore: %d," % (
        r["climateComfortScore"], r["safetySupportScore"], r["walkabilityScore"]))
    L.append("    accessibilityScore: %d, activeLifestyleScore: %d," % (
        r["accessibilityScore"], r["activeLifestyleScore"]))
    L.append(f"    retirementCategory: {j(r['retirementCategory'])},")
    L.append(f"    retirementSummary: {j(r['retirementSummary'])},")
    L.append(f"    lifestyleSummary: {j(r['lifestyleSummary'])},")
    L.append(f"    affordabilitySummary: {j(r['affordabilitySummary'])},")
    L.append(f"    activeLivingSummary: {j(r['activeLivingSummary'])},")
    L.append('    createdAt: "2026-06-15", updatedAt: "2026-06-15",')
    L.append("  },")
L.append("];")
L.append("")
L.append("export const medicalFacilities: readonly MedicalFacility[] = [")
for f in facilities:
    L.append("  { " + ", ".join([
        f"id: {j(f['id'])}", f"citySlug: {j(f['citySlug'])}", f"name: {j(f['name'])}",
        f"type: {j(f['type'])}", f"serviceLevel: {j(f['serviceLevel'])}",
        'createdAt: "2026-06-15"', 'updatedAt: "2026-06-15"',
    ]) + " },")
L.append("];")
L.append("")
L.append("const healthcareBySlug: Record<string, HealthcareProfile> = {};")
L.append("for (const profile of healthcareProfiles) {")
L.append("  healthcareBySlug[profile.citySlug] = profile;")
L.append("}")
L.append("const retirementBySlug: Record<string, RetirementProfile> = {};")
L.append("for (const profile of retirementProfiles) {")
L.append("  retirementBySlug[profile.citySlug] = profile;")
L.append("}")
L.append("const facilitiesByCity: Record<string, MedicalFacility[]> = {};")
L.append("for (const facility of medicalFacilities) {")
L.append("  (facilitiesByCity[facility.citySlug] ??= []).push(facility);")
L.append("}")
L.append("")
L.append('const VALID_HEALTHCARE_CATEGORIES: ReadonlySet<string> = new Set([')
L.append('  "global_medical_hub", "major_healthcare_center", "regional_healthcare_center",')
L.append('  "healthcare_access_city", "developing_healthcare_market", "mixed",')
L.append("]);")
L.append('const VALID_RETIREMENT_CATEGORIES: ReadonlySet<string> = new Set([')
L.append('  "premium_retirement", "active_retirement", "affordable_retirement",')
L.append('  "urban_retirement", "nature_retirement", "mixed",')
L.append("]);")
L.append('const VALID_FACILITY_TYPES: ReadonlySet<string> = new Set([')
L.append('  "general_hospital", "specialist_hospital", "university_hospital",')
L.append('  "medical_center", "community_hospital",')
L.append("]);")
L.append('const VALID_SERVICE_LEVELS: ReadonlySet<string> = new Set(["local", "regional", "national"]);')
L.append("")
L.append("/** Build-time integrity guard — throws (failing `next build`) on any invalid record. */")
L.append("function assertHealthcareIntegrity(")
L.append("  healthcare: readonly HealthcareProfile[],")
L.append("  retirement: readonly RetirementProfile[],")
L.append("  facilities: readonly MedicalFacility[],")
L.append("): void {")
L.append("  const errors: string[] = [];")
L.append('  const inRange = (n: number) => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 100;')
L.append("  const hcSeen = new Set<string>();")
L.append("  for (const h of healthcare) {")
L.append("    if (hcSeen.has(h.citySlug)) errors.push(`duplicate healthcare citySlug: ${h.citySlug}`);")
L.append("    hcSeen.add(h.citySlug);")
L.append("    const scores = [")
L.append("      h.healthcareScore, h.healthcareAccessScore, h.hospitalAvailabilityScore,")
L.append("      h.specialistCareScore, h.preventativeCareScore, h.emergencyCareScore,")
L.append("      h.healthcareAffordabilityScore,")
L.append("    ];")
L.append("    if (scores.some((n) => !inRange(n))) errors.push(`${h.citySlug}: healthcare score out of range`);")
L.append("    if (!VALID_HEALTHCARE_CATEGORIES.has(h.healthcareCategory))")
L.append("      errors.push(`${h.citySlug}: invalid healthcareCategory`);")
L.append("    if ([h.healthcareSummary, h.medicalAccessSummary, h.healthcareEnvironmentSummary]")
L.append('      .some((t) => typeof t !== "string" || t.length === 0))')
L.append("      errors.push(`${h.citySlug}: missing healthcare summary`);")
L.append("  }")
L.append("  const retSeen = new Set<string>();")
L.append("  for (const r of retirement) {")
L.append("    if (retSeen.has(r.citySlug)) errors.push(`duplicate retirement citySlug: ${r.citySlug}`);")
L.append("    retSeen.add(r.citySlug);")
L.append("    const scores = [")
L.append("      r.retirementScore, r.affordabilityScore, r.healthcareSupportScore,")
L.append("      r.climateComfortScore, r.safetySupportScore, r.walkabilityScore,")
L.append("      r.accessibilityScore, r.activeLifestyleScore,")
L.append("    ];")
L.append("    if (scores.some((n) => !inRange(n))) errors.push(`${r.citySlug}: retirement score out of range`);")
L.append("    if (!VALID_RETIREMENT_CATEGORIES.has(r.retirementCategory))")
L.append("      errors.push(`${r.citySlug}: invalid retirementCategory`);")
L.append("    if ([r.retirementSummary, r.lifestyleSummary, r.affordabilitySummary, r.activeLivingSummary]")
L.append('      .some((t) => typeof t !== "string" || t.length === 0))')
L.append("      errors.push(`${r.citySlug}: missing retirement summary`);")
L.append("  }")
L.append("  for (const slug of hcSeen) if (!retSeen.has(slug)) errors.push(`${slug}: healthcare without retirement`);")
L.append("  for (const slug of retSeen) if (!hcSeen.has(slug)) errors.push(`${slug}: retirement without healthcare`);")
L.append("  const idSeen = new Set<string>();")
L.append("  const facCount = new Map<string, number>();")
L.append("  for (const f of facilities) {")
L.append("    if (idSeen.has(f.id)) errors.push(`duplicate facility id: ${f.id}`);")
L.append("    idSeen.add(f.id);")
L.append("    if (!hcSeen.has(f.citySlug)) errors.push(`${f.id}: facility references unknown city ${f.citySlug}`);")
L.append("    if (!VALID_FACILITY_TYPES.has(f.type)) errors.push(`${f.id}: invalid type ${f.type}`);")
L.append("    if (!VALID_SERVICE_LEVELS.has(f.serviceLevel)) errors.push(`${f.id}: invalid serviceLevel`);")
L.append("    if (!f.name) errors.push(`${f.id}: missing name`);")
L.append("    facCount.set(f.citySlug, (facCount.get(f.citySlug) ?? 0) + 1);")
L.append("  }")
L.append("  for (const slug of hcSeen) {")
L.append("    const n = facCount.get(slug) ?? 0;")
L.append("    if (n < 3 || n > 10) errors.push(`${slug}: ${n} medical facilities (must be 3-10)`);")
L.append("  }")
L.append("  if (errors.length > 0) {")
L.append('    throw new Error(`healthcare integrity failure:\\n${errors.join("\\n")}`);')
L.append("  }")
L.append("}")
L.append("")
L.append("assertHealthcareIntegrity(healthcareProfiles, retirementProfiles, medicalFacilities);")
L.append("")
L.append("export function getHealthcare(citySlug: string): HealthcareProfile | undefined {")
L.append("  return healthcareBySlug[citySlug];")
L.append("}")
L.append("")
L.append("export function hasHealthcare(citySlug: string): boolean {")
L.append("  return Object.prototype.hasOwnProperty.call(healthcareBySlug, citySlug);")
L.append("}")
L.append("")
L.append("export function getAllHealthcareProfiles(): readonly HealthcareProfile[] {")
L.append("  return healthcareProfiles;")
L.append("}")
L.append("")
L.append("export function getRetirement(citySlug: string): RetirementProfile | undefined {")
L.append("  return retirementBySlug[citySlug];")
L.append("}")
L.append("")
L.append("export function hasRetirement(citySlug: string): boolean {")
L.append("  return Object.prototype.hasOwnProperty.call(retirementBySlug, citySlug);")
L.append("}")
L.append("")
L.append("export function getAllRetirementProfiles(): readonly RetirementProfile[] {")
L.append("  return retirementProfiles;")
L.append("}")
L.append("")
L.append("export function getMedicalFacilitiesForCity(citySlug: string): readonly MedicalFacility[] {")
L.append("  return facilitiesByCity[citySlug] ?? [];")
L.append("}")
L.append("")
L.append("export function getAllMedicalFacilities(): readonly MedicalFacility[] {")
L.append("  return medicalFacilities;")
L.append("}")

open(ROOT / "lib/data/healthcare-retirement.ts", "w").write("\n".join(L) + "\n")

from collections import Counter
print(f"wrote lib/data/healthcare-retirement.ts: {len(hc_profiles)} healthcare + {len(ret_profiles)} retirement + {len(facilities)} facilities")
print(f"  facilities/city: min {min(per_city.values())} max {max(per_city.values())} avg {len(facilities)/len(hc_profiles):.1f}")
print("  healthcare cat:", dict(Counter(h["healthcareCategory"] for h in hc_profiles)))
print("  retirement cat:", dict(Counter(r["retirementCategory"] for r in ret_profiles)))
print("  facility types:", dict(Counter(f["type"] for f in facilities)))
hcby = {h["citySlug"]: h for h in hc_profiles}
rby = {r["citySlug"]: r for r in ret_profiles}
for s in ("vienna", "valencia", "toronto", "zurich", "lagos", "bangkok", "miami"):
    if s in hcby:
        print(f"  {s:9s} hc={hcby[s]['healthcareScore']:3d}/{hcby[s]['healthcareCategory']:24s} "
              f"ret={rby[s]['retirementScore']:3d}/{rby[s]['retirementCategory']}")
