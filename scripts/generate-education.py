#!/usr/bin/env python3
"""Deterministic Education & Universities generator. No randomness, no network.

Inputs (per city): /tmp/economy_signals.json (population, QoL education /
infrastructure / qualityOfLife / digitalNomad / walkability / affordability /
overall, airport, name, countrySlug) + /tmp/economy_scores.json (economyScore,
innovationScore, technologyJobsScore, educationJobsScore). Blended with country
ACADEMIC and INTL priors + hardcoded national-capital flags.

EDUCATION SCORES (clamped 0-100 int; s = clamp(log10(pop)-5, -1..2.2); cap/air = 0/1):
  higherEducation   = .50*eduQoL + .30*academicB + 5*min(s,1.6) + 5cap
  research          = .40*innov + .40*academicB + 6*min(s,1.7) + 5cap + 3air
  internationalStu  = intlB + .15(qol-60) + 6*min(s,1.7) + 6cap + 4air + 5[english]
  studentFriendly   = .35*walk + .20*aff + .20*qol + .15*digitalNomad + 4*min(s,1.4)
  universityDensity = 40 + 7*min(s,2.0) + .20(eduQoL-60) + 5cap
  academicReputation= .45*academicB + .30*research + 5*min(s,1.6) + 5cap
  education         = .24*higherEd + .20*research + .16*academicRep + .14*studentFriendly
                      + .14*international + .12*universityDensity
UNIVERSITIES: 3-15 per city by category+size; deterministic type pattern, generic
type-based names, 2-6 focus areas, international-focus + research-intensity scores,
student-population category, illustrative foundedYear. REPRESENTATIVE dataset
entities only — not a directory of real or accredited institutions.

Writes lib/data/education.ts (education + universities + guard + access) and
/tmp/education_scores.json."""
import json, math
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
sig = {r["slug"]: r for r in json.load(open("/tmp/economy_signals.json"))}
esc = {r["citySlug"]: r for r in json.load(open("/tmp/economy_scores.json"))}


def tset(slugs, val, d):
    for s in slugs:
        d[s] = val


# Country academic-reputation priors
ACADEMIC = {}
tset(["united-states", "united-kingdom", "switzerland", "germany", "netherlands",
      "sweden", "canada", "australia", "japan", "singapore"], 88, ACADEMIC)
tset(["france", "denmark", "finland", "belgium", "austria", "south-korea", "ireland",
      "norway", "israel", "taiwan", "hong-kong", "new-zealand", "china", "italy",
      "spain"], 80, ACADEMIC)
tset(["czechia", "poland", "portugal", "greece", "hungary", "estonia", "slovenia",
      "lithuania", "latvia", "slovakia", "croatia", "chile", "india", "malaysia",
      "saudi-arabia", "united-arab-emirates", "qatar", "brazil", "mexico",
      "argentina", "south-africa", "turkey", "thailand", "uruguay", "costa-rica"], 70, ACADEMIC)
tset(["romania", "bulgaria", "serbia", "montenegro", "north-macedonia", "albania",
      "bosnia-and-herzegovina", "moldova", "ukraine", "vietnam", "indonesia",
      "philippines", "colombia", "peru", "ecuador", "dominican-republic", "jordan",
      "lebanon", "sri-lanka", "morocco", "tunisia", "egypt", "namibia", "botswana",
      "cambodia", "guatemala", "panama", "kuwait", "bahrain", "oman"], 60, ACADEMIC)
tset(["pakistan", "nigeria", "kenya", "ghana", "ethiopia", "tanzania", "uganda",
      "rwanda", "zambia", "mozambique", "senegal"], 52, ACADEMIC)
ACADEMIC_DEFAULT = 62

# International-student attractiveness priors
INTL = {}
tset(["united-states", "united-kingdom", "australia", "canada", "germany",
      "netherlands", "france", "switzerland", "ireland", "new-zealand", "singapore",
      "united-arab-emirates"], 85, INTL)
tset(["sweden", "denmark", "finland", "austria", "belgium", "spain", "italy",
      "japan", "south-korea", "czechia", "portugal", "hungary", "poland", "malaysia",
      "qatar", "china", "hong-kong", "taiwan", "norway"], 72, INTL)
tset(["estonia", "slovenia", "lithuania", "latvia", "slovakia", "croatia", "greece",
      "chile", "uruguay", "costa-rica", "panama", "saudi-arabia", "kuwait", "bahrain",
      "oman", "israel", "turkey", "thailand", "mexico", "brazil", "argentina",
      "south-africa"], 58, INTL)
INTL_DEFAULT = 50
ENGLISH = {"united-states", "united-kingdom", "australia", "canada", "new-zealand",
           "ireland", "singapore"}

CAPITALS = {
    "united-kingdom": "london", "france": "paris", "germany": "berlin", "spain": "madrid",
    "italy": "rome", "netherlands": "amsterdam", "belgium": "brussels", "austria": "vienna",
    "portugal": "lisbon", "greece": "athens", "ireland": "dublin", "finland": "helsinki",
    "sweden": "stockholm", "denmark": "copenhagen", "norway": "oslo", "switzerland": "bern",
    "poland": "warsaw", "czechia": "prague", "hungary": "budapest", "romania": "bucharest",
    "bulgaria": "sofia", "ukraine": "kyiv", "serbia": "belgrade", "croatia": "zagreb",
    "slovakia": "bratislava", "slovenia": "ljubljana", "lithuania": "vilnius", "latvia": "riga",
    "estonia": "tallinn", "iceland": "reykjavik", "luxembourg": "luxembourg-city",
    "moldova": "chisinau", "montenegro": "podgorica", "north-macedonia": "skopje",
    "albania": "tirana", "bosnia-and-herzegovina": "sarajevo", "japan": "tokyo",
    "south-korea": "seoul", "china": "beijing", "taiwan": "taipei", "singapore": "singapore",
    "malaysia": "kuala-lumpur", "thailand": "bangkok", "vietnam": "hanoi", "indonesia": "jakarta",
    "philippines": "manila", "india": "new-delhi", "pakistan": "islamabad", "sri-lanka": "colombo",
    "cambodia": "phnom-penh", "israel": "jerusalem", "united-arab-emirates": "abu-dhabi",
    "qatar": "doha", "saudi-arabia": "riyadh", "kuwait": "kuwait-city", "bahrain": "manama",
    "oman": "muscat", "jordan": "amman", "lebanon": "beirut", "turkey": "ankara",
    "australia": "canberra", "new-zealand": "wellington", "canada": "ottawa",
    "united-states": "washington", "mexico": "mexico-city", "brazil": "brasilia",
    "argentina": "buenos-aires", "chile": "santiago", "colombia": "bogota", "peru": "lima",
    "ecuador": "quito", "uruguay": "montevideo", "panama": "panama-city", "costa-rica": "san-jose",
    "dominican-republic": "santo-domingo", "guatemala": "guatemala-city", "south-africa": "pretoria",
    "egypt": "cairo", "morocco": "rabat", "tunisia": "tunis", "nigeria": "abuja", "kenya": "nairobi",
    "ghana": "accra", "ethiopia": "addis-ababa", "tanzania": "dodoma", "uganda": "kampala",
    "rwanda": "kigali", "zambia": "lusaka", "mozambique": "maputo", "senegal": "dakar",
    "namibia": "windhoek", "botswana": "gaborone",
}
ALL_SLUGS = set(sig)
CAPITAL_SLUGS = {v for v in CAPITALS.values() if v in ALL_SLUGS}

VOCAB = ["Engineering", "Computer Science", "Medicine", "Healthcare", "Business",
         "Economics", "Finance", "Law", "Humanities", "Social Sciences", "Education",
         "Environmental Sciences", "Agriculture", "Architecture", "Design", "Arts",
         "Physics", "Mathematics", "Biotechnology", "Energy", "Transportation",
         "Tourism", "Public Policy"]
VOCAB_SET = set(VOCAB)
VALID_CATEGORIES = {"global_academic_hub", "major_university_city", "research_center",
                    "student_city", "regional_education_center", "mixed"}
VALID_TYPES = {"public", "private", "research", "technical", "medical", "business"}

TYPE_PATTERN = ["public", "technical", "business", "medical", "research", "private",
                "private", "technical", "business", "medical", "research", "private",
                "technical", "business", "private"]
# Generic archetype-style names so records read as REPRESENTATIVE categories,
# not claims about a specific real/accredited institution (see disclaimers).
NAME_TEMPLATES = {
    "public": ["{C} Public University", "{C} City University", "{C} State University", "{C} Metropolitan University"],
    "technical": ["{C} Institute of Technology", "{C} University of Technology", "{C} Polytechnic", "{C} Technical University"],
    "business": ["{C} Business School", "{C} School of Economics", "{C} School of Management"],
    "medical": ["{C} Medical School", "{C} School of Health Sciences", "{C} University of Medical Sciences"],
    "research": ["{C} Research Institute", "{C} Institute of Science", "{C} Graduate Research University"],
    "private": ["{C} International University", "{C} University of Applied Sciences", "{C} Liberal Arts College", "{C} Open University", "{C} Modern University"],
}
TYPE_FOCUS = {
    "public": ["Humanities", "Social Sciences", "Law", "Economics", "Education", "Arts", "Mathematics", "Physics"],
    "technical": ["Engineering", "Computer Science", "Physics", "Mathematics", "Architecture", "Energy", "Transportation", "Design"],
    "business": ["Business", "Economics", "Finance", "Law", "Public Policy", "Tourism", "Social Sciences"],
    "medical": ["Medicine", "Healthcare", "Biotechnology", "Social Sciences", "Environmental Sciences"],
    "research": ["Physics", "Mathematics", "Biotechnology", "Environmental Sciences", "Engineering", "Computer Science", "Energy"],
    "private": ["Business", "Computer Science", "Design", "Arts", "Humanities", "Social Sciences", "Tourism", "Law"],
}
TYPE_INTL = {"private": 8, "business": 7, "research": 5, "technical": 3, "medical": 2, "public": 0}
TYPE_RES = {"research": 12, "technical": 8, "medical": 7, "public": 2, "business": -4, "private": -6}
COUNT_BASE = {"global_academic_hub": 12, "major_university_city": 8, "research_center": 6,
              "student_city": 5, "regional_education_center": 4, "mixed": 3}
CAT_PHRASE = {
    "global_academic_hub": "a leading academic hub",
    "major_university_city": "a major university city",
    "research_center": "a research-focused education center",
    "student_city": "a student-oriented city",
    "regional_education_center": "a regional education center",
    "mixed": "a developing education base",
}


def clamp(x):
    return max(0, min(100, int(round(x))))


def parse_pop(s):
    import re
    m = re.search(r'([\d.]+)\s*([MmKk])', s or '')
    if not m:
        return 300000.0
    return float(m.group(1)) * (1e6 if m.group(2) in 'Mm' else 1e3)


def seedint(s):
    return sum(ord(ch) for ch in s)


def band(x):
    if x >= 80:
        return "very strong"
    if x >= 68:
        return "strong"
    if x >= 55:
        return "moderate"
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


def gen_city(slug):
    s_ = sig[slug]
    e_ = esc[slug]
    name = s_["name"]
    cs = s_["countrySlug"]
    eduQoL = s_["education"]
    infra = s_["infrastructure"]
    qol = s_["qualityOfLife"]
    dn = s_["digitalNomad"]
    walk = s_["walkability"]
    aff = s_["affordability"]
    innov = e_["innovationScore"]
    academicB = ACADEMIC.get(cs, ACADEMIC_DEFAULT)
    intlB = INTL.get(cs, INTL_DEFAULT)
    cap = 1 if slug in CAPITAL_SLUGS else 0
    air = 1 if s_["airport"] else 0
    english = 5 if cs in ENGLISH else 0
    pop = parse_pop(s_["population"])
    s = max(-1.0, min(2.2, math.log10(max(pop, 1.0)) - 5.0))

    higherEd = clamp(0.50 * eduQoL + 0.30 * academicB + 5 * min(s, 1.6) + 5 * cap)
    research = clamp(0.40 * innov + 0.40 * academicB + 6 * min(s, 1.7) + 5 * cap + 3 * air)
    international = clamp(intlB + 0.15 * (qol - 60) + 6 * min(s, 1.7) + 6 * cap + 4 * air + english)
    studentFriendly = clamp(0.35 * walk + 0.20 * aff + 0.20 * qol + 0.15 * dn + 4 * min(s, 1.4))
    universityDensity = clamp(40 + 7 * min(s, 2.0) + 0.20 * (eduQoL - 60) + 5 * cap)
    academicRep = clamp(0.45 * academicB + 0.30 * research + 5 * min(s, 1.6) + 5 * cap)
    education = clamp(0.24 * higherEd + 0.20 * research + 0.16 * academicRep + 0.14 * studentFriendly
                      + 0.14 * international + 0.12 * universityDensity)

    if pop >= 3e6 and education >= 82:
        category = "global_academic_hub"
    elif research >= 78 and research >= higherEd and pop >= 8e5:
        category = "research_center"
    elif studentFriendly >= 74 and studentFriendly >= education:
        category = "student_city"
    elif education >= 74 and pop >= 1e6:
        category = "major_university_city"
    elif education >= 56:
        category = "regional_education_center"
    else:
        category = "mixed"

    count = COUNT_BASE[category] + (1 if s >= 1.0 else 0) + (1 if s >= 1.6 else 0) + (1 if s >= 2.0 else 0)
    count = max(3, min(15, count))

    # --- universities ---
    unis = []
    type_use = {}
    focus_freq = {}
    for i in range(count):
        utype = TYPE_PATTERN[i % len(TYPE_PATTERN)]
        templates = NAME_TEMPLATES[utype]
        u = type_use.get(utype, 0)
        if u < len(templates):
            uname = templates[u].format(C=name)
        else:
            uname = templates[u % len(templates)].format(C=name) + f" {u // len(templates) + 1}"
        type_use[utype] = u + 1

        sd = seedint(slug) + i * 37
        flist = TYPE_FOCUS[utype]
        fcount = 2 + (sd % 5)  # 2-6
        start = sd % len(flist)
        focus, k = [], 0
        while len(focus) < fcount and k < len(flist):
            f = flist[(start + k) % len(flist)]
            if f not in focus:
                focus.append(f)
            k += 1
        for f in focus:
            focus_freq[f] = focus_freq.get(f, 0) + 1

        intl_score = clamp(international + TYPE_INTL[utype] - 2 * i + (sd % 5 - 2))
        res_score = clamp(research + TYPE_RES[utype] - 2 * i + ((sd // 5) % 5 - 2))
        base_pop = (2 if pop >= 2e6 else (1 if pop >= 7e5 else 0)) + (1 if i == 0 else 0) \
            - (1 if utype in ("private", "medical", "research") else 0)
        pop_cat = "large" if base_pop >= 2 else ("medium" if base_pop >= 1 else "small")

        sd3 = seedint(slug) + i * 53
        if utype == "public" and i == 0:
            year = 1700 + (sd3 % 250)
        elif utype == "private":
            year = min(2016, 1900 + (sd3 % 116))
        else:
            year = 1850 + (sd3 % 165)
        year = max(1500, min(2018, year))

        unis.append({
            "id": f"{slug}-uni-{i + 1}", "citySlug": slug, "name": uname, "type": utype,
            "focusAreas": focus, "internationalFocusScore": intl_score,
            "researchIntensityScore": res_score, "studentPopulationCategory": pop_cat,
            "foundedYear": year, "createdAt": "2026-06-15", "updatedAt": "2026-06-15",
        })

    # aggregate focus areas (top by frequency, tie-break by VOCAB order)
    city_focus = sorted(focus_freq, key=lambda f: (-focus_freq[f], VOCAB.index(f)))
    top_focus = city_focus[:4]
    research_fields = [f for f in city_focus if f in {
        "Engineering", "Computer Science", "Physics", "Mathematics", "Biotechnology",
        "Medicine", "Healthcare", "Environmental Sciences", "Energy"}][:3]
    if not research_fields:
        research_fields = top_focus[:3]

    # --- summaries ---
    edu_sum = (f"{name} is {CAT_PHRASE[category]} with a mix of universities and research "
               f"activity in our dataset, spanning fields such as {join_human(top_focus[:3])}.")
    sfac = []
    if walk >= 70:
        sfac.append("walkable neighborhoods")
    if aff >= 60:
        sfac.append("relatively affordable living")
    if qol >= 70:
        sfac.append("strong quality of life")
    if dn >= 70:
        sfac.append("good connectivity")
    if not sfac:
        sfac.append("local student services")
    stu_sum = (f"{name} offers a {band(studentFriendly)} student environment, supported by "
               f"{join_human(sfac[:3])}.")
    res_sum = (f"Research activity in {name} centers on {join_human(research_fields)}, "
               f"with a research score of {research}/100.")
    intl_sum = (f"{name} {'attracts' if international >= 58 else 'is building its appeal to'} "
                f"international students through academic programs and "
                f"{'strong urban quality of life' if qol >= 68 else 'its urban environment'}.")

    profile = {
        "citySlug": slug, "educationScore": education, "higherEducationScore": higherEd,
        "researchScore": research, "internationalStudentScore": international,
        "studentFriendlinessScore": studentFriendly, "universityDensityScore": universityDensity,
        "academicReputationScore": academicRep, "educationCategory": category,
        "educationSummary": edu_sum, "studentExperienceSummary": stu_sum,
        "researchSummary": res_sum, "internationalSummary": intl_sum,
        "createdAt": "2026-06-15", "updatedAt": "2026-06-15",
    }
    # focus-area counts for collections
    fc = {
        "engineering": focus_freq.get("Engineering", 0),
        "computer_science": focus_freq.get("Computer Science", 0),
        "medical": focus_freq.get("Medicine", 0) + focus_freq.get("Healthcare", 0),
        "business": focus_freq.get("Business", 0) + focus_freq.get("Finance", 0),
    }
    score_row = {
        "citySlug": slug, "educationScore": education, "researchScore": research,
        "internationalStudentScore": international, "studentFriendlinessScore": studentFriendly,
        "universityDensityScore": universityDensity, "academicReputationScore": academicRep,
        "educationCategory": category, "capital": cap,
        "knowledgeScore": clamp(0.5 * research + 0.5 * innov),
        "uniCount": count, **{f"focus_{k}": v for k, v in fc.items()},
    }
    return profile, unis, score_row


profiles, universities, score_rows = [], [], []
for slug in sig:
    p, us, row = gen_city(slug)
    profiles.append(p)
    universities.extend(us)
    score_rows.append(row)

# --- Python guard mirror ---
EDU_SCORES = ["educationScore", "higherEducationScore", "researchScore",
              "internationalStudentScore", "studentFriendlinessScore",
              "universityDensityScore", "academicReputationScore"]
EDU_SUMMARIES = ["educationSummary", "studentExperienceSummary", "researchSummary", "internationalSummary"]
seen = set()
for p in profiles:
    assert p["citySlug"] not in seen, p["citySlug"]
    seen.add(p["citySlug"])
    for k in EDU_SCORES:
        assert isinstance(p[k], int) and 0 <= p[k] <= 100, (p["citySlug"], k, p[k])
    assert p["educationCategory"] in VALID_CATEGORIES, (p["citySlug"], p["educationCategory"])
    for k in EDU_SUMMARIES:
        assert isinstance(p[k], str) and len(p[k]) >= 12, (p["citySlug"], k)
uids = set()
per_city = {}
for u in universities:
    assert u["id"] not in uids, u["id"]
    uids.add(u["id"])
    assert u["citySlug"] in seen, u["citySlug"]
    assert u["type"] in VALID_TYPES, (u["id"], u["type"])
    assert u["studentPopulationCategory"] in {"small", "medium", "large"}
    assert 2 <= len(u["focusAreas"]) <= 6, (u["id"], u["focusAreas"])
    assert all(f in VOCAB_SET for f in u["focusAreas"]), u["focusAreas"]
    assert 0 <= u["internationalFocusScore"] <= 100 and 0 <= u["researchIntensityScore"] <= 100
    assert 1500 <= u["foundedYear"] <= 2025
    assert len(set(u["focusAreas"])) == len(u["focusAreas"]), u["id"]
    per_city[u["citySlug"]] = per_city.get(u["citySlug"], 0) + 1
for slug, n in per_city.items():
    assert 3 <= n <= 15, (slug, n)
assert set(per_city) == seen, "every city must have universities"

json.dump(score_rows, open("/tmp/education_scores.json", "w"))


def j(v):
    return json.dumps(v, ensure_ascii=False)


L = []
L.append('import type { EducationProfile } from "@/types/education";')
L.append('import type { UniversityProfile } from "@/types/universities";')
L.append("")
L.append("/**")
L.append(" * Deterministic Education profiles + REPRESENTATIVE university entities — one")
L.append(" * education profile per city, 3-15 universities per city. Generated by")
L.append(" * scripts/generate-education.py from country academic priors blended with")
L.append(" * existing per-city signals. Universities are illustrative dataset entities")
L.append(" * for discovery and SEO — NOT a directory of real or accredited institutions,")
L.append(" * and scores are NOT rankings. Do not edit by hand; rules are documented in")
L.append(" * the generator header.")
L.append(" */")
L.append("export const educationProfiles: readonly EducationProfile[] = [")
for p in profiles:
    L.append("  {")
    L.append(f"    citySlug: {j(p['citySlug'])},")
    L.append("    educationScore: %d, higherEducationScore: %d, researchScore: %d, internationalStudentScore: %d," % (
        p["educationScore"], p["higherEducationScore"], p["researchScore"], p["internationalStudentScore"]))
    L.append("    studentFriendlinessScore: %d, universityDensityScore: %d, academicReputationScore: %d," % (
        p["studentFriendlinessScore"], p["universityDensityScore"], p["academicReputationScore"]))
    L.append(f"    educationCategory: {j(p['educationCategory'])},")
    L.append(f"    educationSummary: {j(p['educationSummary'])},")
    L.append(f"    studentExperienceSummary: {j(p['studentExperienceSummary'])},")
    L.append(f"    researchSummary: {j(p['researchSummary'])},")
    L.append(f"    internationalSummary: {j(p['internationalSummary'])},")
    L.append('    createdAt: "2026-06-15", updatedAt: "2026-06-15",')
    L.append("  },")
L.append("];")
L.append("")
L.append("export const universities: readonly UniversityProfile[] = [")
for u in universities:
    L.append("  { " + ", ".join([
        f"id: {j(u['id'])}", f"citySlug: {j(u['citySlug'])}", f"name: {j(u['name'])}",
        f"type: {j(u['type'])}", f"focusAreas: {j(u['focusAreas'])}",
        f"internationalFocusScore: {u['internationalFocusScore']}",
        f"researchIntensityScore: {u['researchIntensityScore']}",
        f"studentPopulationCategory: {j(u['studentPopulationCategory'])}",
        f"foundedYear: {u['foundedYear']}",
        'createdAt: "2026-06-15"', 'updatedAt: "2026-06-15"',
    ]) + " },")
L.append("];")
L.append("")
L.append("const educationBySlug: Record<string, EducationProfile> = {};")
L.append("for (const profile of educationProfiles) {")
L.append("  educationBySlug[profile.citySlug] = profile;")
L.append("}")
L.append("const universitiesByCity: Record<string, UniversityProfile[]> = {};")
L.append("for (const university of universities) {")
L.append("  (universitiesByCity[university.citySlug] ??= []).push(university);")
L.append("}")
L.append("")
L.append("const VALID_EDUCATION_CATEGORIES: ReadonlySet<string> = new Set([")
L.append('  "global_academic_hub", "major_university_city", "research_center",')
L.append('  "student_city", "regional_education_center", "mixed",')
L.append("]);")
L.append('const VALID_UNIVERSITY_TYPES: ReadonlySet<string> = new Set([')
L.append('  "public", "private", "research", "technical", "medical", "business",')
L.append("]);")
L.append("")
L.append("/** Build-time integrity guard — throws (failing `next build`) on any invalid record. */")
L.append("function assertEducationIntegrity(")
L.append("  education: readonly EducationProfile[],")
L.append("  unis: readonly UniversityProfile[],")
L.append("): void {")
L.append("  const errors: string[] = [];")
L.append('  const inRange = (n: number) => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 100;')
L.append("  const eduSeen = new Set<string>();")
L.append("  for (const e of education) {")
L.append("    if (!e.citySlug) errors.push(`missing citySlug`);")
L.append("    if (eduSeen.has(e.citySlug)) errors.push(`duplicate education citySlug: ${e.citySlug}`);")
L.append("    eduSeen.add(e.citySlug);")
L.append("    const scores = [")
L.append("      e.educationScore, e.higherEducationScore, e.researchScore,")
L.append("      e.internationalStudentScore, e.studentFriendlinessScore,")
L.append("      e.universityDensityScore, e.academicReputationScore,")
L.append("    ];")
L.append("    if (scores.some((n) => !inRange(n))) errors.push(`${e.citySlug}: education score out of range`);")
L.append("    if (!VALID_EDUCATION_CATEGORIES.has(e.educationCategory))")
L.append("      errors.push(`${e.citySlug}: invalid educationCategory ${e.educationCategory}`);")
L.append("    const summaries = [")
L.append("      e.educationSummary, e.studentExperienceSummary, e.researchSummary, e.internationalSummary,")
L.append("    ];")
L.append('    if (summaries.some((t) => typeof t !== "string" || t.length === 0))')
L.append("      errors.push(`${e.citySlug}: missing summary`);")
L.append("  }")
L.append("  const idSeen = new Set<string>();")
L.append("  const cityUniCount = new Map<string, number>();")
L.append("  for (const u of unis) {")
L.append("    if (idSeen.has(u.id)) errors.push(`duplicate university id: ${u.id}`);")
L.append("    idSeen.add(u.id);")
L.append("    if (!eduSeen.has(u.citySlug)) errors.push(`${u.id}: university references unknown city ${u.citySlug}`);")
L.append("    if (!VALID_UNIVERSITY_TYPES.has(u.type)) errors.push(`${u.id}: invalid type ${u.type}`);")
L.append('    if (!["small", "medium", "large"].includes(u.studentPopulationCategory))')
L.append("      errors.push(`${u.id}: invalid studentPopulationCategory`);")
L.append("    if (u.focusAreas.length < 2 || u.focusAreas.length > 6)")
L.append("      errors.push(`${u.id}: focusAreas must be 2-6`);")
L.append("    if (!inRange(u.internationalFocusScore) || !inRange(u.researchIntensityScore))")
L.append("      errors.push(`${u.id}: university score out of range`);")
L.append("    if (u.foundedYear !== undefined && (u.foundedYear < 1000 || u.foundedYear > 2025))")
L.append("      errors.push(`${u.id}: implausible foundedYear ${u.foundedYear}`);")
L.append("    cityUniCount.set(u.citySlug, (cityUniCount.get(u.citySlug) ?? 0) + 1);")
L.append("  }")
L.append("  for (const slug of eduSeen) {")
L.append("    const n = cityUniCount.get(slug) ?? 0;")
L.append("    if (n < 3 || n > 15) errors.push(`${slug}: ${n} universities (must be 3-15)`);")
L.append("  }")
L.append("  if (errors.length > 0) {")
L.append('    throw new Error(`education integrity failure:\\n${errors.join("\\n")}`);')
L.append("  }")
L.append("}")
L.append("")
L.append("assertEducationIntegrity(educationProfiles, universities);")
L.append("")
L.append("export function getEducation(citySlug: string): EducationProfile | undefined {")
L.append("  return educationBySlug[citySlug];")
L.append("}")
L.append("")
L.append("export function hasEducation(citySlug: string): boolean {")
L.append("  return Object.prototype.hasOwnProperty.call(educationBySlug, citySlug);")
L.append("}")
L.append("")
L.append("export function getAllEducationProfiles(): readonly EducationProfile[] {")
L.append("  return educationProfiles;")
L.append("}")
L.append("")
L.append("export function getUniversitiesForCity(citySlug: string): readonly UniversityProfile[] {")
L.append("  return universitiesByCity[citySlug] ?? [];")
L.append("}")
L.append("")
L.append("export function getAllUniversities(): readonly UniversityProfile[] {")
L.append("  return universities;")
L.append("}")

open(ROOT / "lib/data/education.ts", "w").write("\n".join(L) + "\n")

from collections import Counter
print(f"wrote lib/data/education.ts: {len(profiles)} education profiles, {len(universities)} universities")
print(f"  universities/city: min {min(per_city.values())} max {max(per_city.values())} avg {len(universities)/len(profiles):.1f}")
print("  category dist:", dict(Counter(p["educationCategory"] for p in profiles)))
print("  university type dist:", dict(Counter(u["type"] for u in universities)))
by = {p["citySlug"]: p for p in profiles}
for s in ("boston", "prague", "berlin", "toronto", "melbourne", "lagos", "munich"):
    if s in by:
        p = by[s]
        unis = [u for u in universities if u["citySlug"] == s]
        print(f"  {s:10s} edu={p['educationScore']:3d} cat={p['educationCategory']:22s} unis={len(unis)} eg={unis[0]['name']}")
