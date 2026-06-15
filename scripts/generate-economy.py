#!/usr/bin/env python3
"""Deterministic Economy & Jobs generator. No randomness, no network.

Inputs (per city, via export-economy-signals.py -> /tmp/economy_signals.json):
  country economic priors (econ/salary/business/startup/innovation/remote +
  manufacturing + tourism bases, by economic-development tier) BLENDED with
  per-city signals: existing overall score, quality-of-life education /
  infrastructure / healthcare / digital-nomad / mobility scores, affordability,
  climate comfort, nearby-nature density, coastal flag, metro size, plus
  hardcoded national-capital and verified-airport flags.

ECONOMY SCORES (clamped 0-100 int; s = clamp(log10(pop)-5, -1..2.2); cap/air = 0/1):
  employment = econB + .12(ov-60) + 4*min(s,1.6) + 5cap
  salary     = salaryB + .10(ov-60) + 5*min(s,1.6) + 5cap + 3air
  startup    = startupB + .10(edu-60) + .08(dn-60) + 6*min(s,1.7) + 6cap + 4air
  business   = businessB + .12(infra-60) + 3*min(s,1.5) + 5cap
  remoteWork = remoteB + .30(dn-55) + .10(infra-60) + .06(aff-50)
  innovation = innovB + .12(edu-60) + 6*min(s,1.7) + 5cap + 4air
  affAdjInc  = .55*salary + .45*aff
  economy    = .22emp + .18sal + .15bus + .13startup + .12innov + .10remote + .10affAdjInc
JOBS SCORES:
  technologyJobs   = innovB + .12(edu-60) + 6*min(s,1.7) + 4cap + 3air
  healthcareJobs   = .50*health + .30*econB + 5*min(s,1.5) + 3cap
  financeJobs      = businessB + .10(ov-60) + 7*min(s,1.8) + 8cap + 3air
  manufacturingJobs= manuB + .05(energy-55) + 2*min(s,1.2) - 6*max(0,s-1.6)
  tourismJobs      = tourismB + .10(comfort-50) + 10[coast] + 5[mtn] + 1.5*min(nature,8)
  educationJobs    = .55*edu + .25*econB + 5*min(s,1.5) + 4cap
  remoteAvail      = .55*remoteWork + .25*technologyJobs + .20*infra
  jobMarket        = .30emp + .24economy + .24business + .22technologyJobs
  overallCareer    = .30jobMarket + .20salary + .20economy + .15innovation + .15remoteAvail
Industries: per-industry deterministic weight from signals; take weight>=60 sorted
desc (tie-break fixed vocab order), clamped to 3-6. Category: deterministic tree.

Writes lib/data/economy.ts (economy + jobs profiles + guard + access) and /tmp/economy_scores.json."""
import json, math
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
sig = json.load(open("/tmp/economy_signals.json"))


def tset(slugs, vals, d):
    for s in slugs:
        d[s] = vals


# Base econ tiers: (econ, salary, business, startup, innovation, remote)
BASE = {}
tset(["switzerland", "singapore", "united-states", "luxembourg", "netherlands",
      "denmark", "norway", "sweden", "ireland"], (80, 82, 82, 76, 80, 78), BASE)
tset(["germany", "austria", "finland", "belgium", "france", "united-kingdom",
      "canada", "australia", "new-zealand", "japan", "south-korea", "hong-kong",
      "taiwan", "israel", "united-arab-emirates", "qatar", "iceland"],
     (72, 74, 74, 68, 72, 72), BASE)
tset(["czechia", "poland", "slovenia", "estonia", "lithuania", "latvia",
      "slovakia", "hungary", "croatia", "portugal", "spain", "italy", "greece",
      "chile", "uruguay", "costa-rica", "panama", "malaysia", "china",
      "saudi-arabia", "kuwait", "bahrain", "oman"], (62, 62, 62, 56, 58, 62), BASE)
tset(["romania", "bulgaria", "serbia", "montenegro", "north-macedonia", "albania",
      "bosnia-and-herzegovina", "moldova", "ukraine", "turkey", "thailand",
      "vietnam", "indonesia", "philippines", "mexico", "brazil", "argentina",
      "colombia", "peru", "ecuador", "dominican-republic", "jordan", "lebanon",
      "sri-lanka", "india", "morocco", "tunisia", "egypt", "south-africa",
      "namibia", "botswana", "cambodia", "guatemala"], (52, 50, 52, 46, 48, 54), BASE)
tset(["pakistan", "nigeria", "kenya", "ghana", "ethiopia", "tanzania", "uganda",
      "rwanda", "zambia", "mozambique", "senegal"], (44, 42, 44, 38, 40, 48), BASE)
BASE_DEFAULT = (52, 50, 52, 46, 48, 54)

# Manufacturing base
MANU = {}
tset(["germany", "japan", "south-korea", "china", "czechia", "slovakia", "poland",
      "taiwan", "mexico", "hungary", "romania", "thailand", "vietnam", "india",
      "turkey", "indonesia"], 82, MANU)
tset(["united-states", "italy", "spain", "brazil", "austria", "sweden",
      "netherlands", "belgium", "france", "portugal", "malaysia", "south-africa",
      "ukraine", "morocco", "tunisia", "bulgaria", "serbia"], 72, MANU)
tset(["canada", "united-kingdom", "finland", "denmark", "norway", "switzerland",
      "ireland", "israel", "argentina", "colombia", "peru", "egypt", "philippines",
      "pakistan", "slovenia", "lithuania", "latvia", "estonia", "croatia"], 60, MANU)
MANU_DEFAULT = 50

# Tourism base
TOUR = {}
tset(["spain", "italy", "greece", "portugal", "croatia", "thailand", "turkey",
      "mexico", "morocco", "indonesia", "iceland", "austria", "dominican-republic",
      "costa-rica", "egypt", "tunisia"], 86, TOUR)
tset(["france", "united-kingdom", "switzerland", "netherlands", "japan", "malaysia",
      "vietnam", "cambodia", "united-arab-emirates", "south-africa", "peru",
      "argentina", "ireland", "philippines", "sri-lanka", "jordan", "lebanon",
      "montenegro", "albania", "panama"], 74, TOUR)
tset(["germany", "united-states", "canada", "australia", "new-zealand", "czechia",
      "poland", "hungary", "slovenia", "estonia", "lithuania", "latvia", "slovakia",
      "romania", "bulgaria", "serbia", "denmark", "sweden", "norway", "finland",
      "belgium", "chile", "uruguay", "colombia", "brazil", "china", "south-korea",
      "taiwan", "hong-kong", "singapore", "israel", "namibia", "botswana", "kenya",
      "qatar", "bahrain", "oman", "kuwait", "saudi-arabia"], 60, TOUR)
TOUR_DEFAULT = 50

# National capitals (country slug -> capital city slug). Intersected with the
# dataset; non-matches are simply not flagged.
CAPITALS = {
    "united-kingdom": "london", "france": "paris", "germany": "berlin",
    "spain": "madrid", "italy": "rome", "netherlands": "amsterdam",
    "belgium": "brussels", "austria": "vienna", "portugal": "lisbon",
    "greece": "athens", "ireland": "dublin", "finland": "helsinki",
    "sweden": "stockholm", "denmark": "copenhagen", "norway": "oslo",
    "switzerland": "bern", "poland": "warsaw", "czechia": "prague",
    "hungary": "budapest", "romania": "bucharest", "bulgaria": "sofia",
    "ukraine": "kyiv", "serbia": "belgrade", "croatia": "zagreb",
    "slovakia": "bratislava", "slovenia": "ljubljana", "lithuania": "vilnius",
    "latvia": "riga", "estonia": "tallinn", "iceland": "reykjavik",
    "luxembourg": "luxembourg-city", "moldova": "chisinau", "montenegro": "podgorica",
    "north-macedonia": "skopje", "albania": "tirana", "bosnia-and-herzegovina": "sarajevo",
    "japan": "tokyo", "south-korea": "seoul", "china": "beijing", "taiwan": "taipei",
    "singapore": "singapore", "malaysia": "kuala-lumpur", "thailand": "bangkok",
    "vietnam": "hanoi", "indonesia": "jakarta", "philippines": "manila",
    "india": "new-delhi", "pakistan": "islamabad", "sri-lanka": "colombo",
    "cambodia": "phnom-penh", "israel": "jerusalem", "united-arab-emirates": "abu-dhabi",
    "qatar": "doha", "saudi-arabia": "riyadh", "kuwait": "kuwait-city",
    "bahrain": "manama", "oman": "muscat", "jordan": "amman", "lebanon": "beirut",
    "turkey": "ankara", "australia": "canberra", "new-zealand": "wellington",
    "canada": "ottawa", "united-states": "washington", "mexico": "mexico-city",
    "brazil": "brasilia", "argentina": "buenos-aires", "chile": "santiago",
    "colombia": "bogota", "peru": "lima", "ecuador": "quito", "uruguay": "montevideo",
    "panama": "panama-city", "costa-rica": "san-jose", "dominican-republic": "santo-domingo",
    "guatemala": "guatemala-city", "south-africa": "pretoria", "egypt": "cairo",
    "morocco": "rabat", "tunisia": "tunis", "nigeria": "abuja", "kenya": "nairobi",
    "ghana": "accra", "ethiopia": "addis-ababa", "tanzania": "dodoma",
    "uganda": "kampala", "rwanda": "kigali", "zambia": "lusaka", "mozambique": "maputo",
    "senegal": "dakar", "namibia": "windhoek", "botswana": "gaborone",
}
ALL_SLUGS = {c["slug"] for c in sig}
CAPITAL_SLUGS = {v for v in CAPITALS.values() if v in ALL_SLUGS}

AUTO = {"germany", "japan", "south-korea", "united-states", "czechia", "slovakia",
        "mexico", "france", "italy", "spain", "sweden", "hungary", "romania",
        "india", "china", "thailand", "brazil", "turkey", "united-kingdom"}
AEROSPACE = {"united-states", "france", "united-kingdom", "germany", "canada",
             "brazil", "japan", "italy", "spain"}
ENERGY = {"united-arab-emirates", "qatar", "saudi-arabia", "kuwait", "bahrain",
          "oman", "norway", "nigeria", "netherlands", "united-states", "canada",
          "brazil", "egypt"}
MINING = {"australia", "chile", "peru", "south-africa", "canada", "indonesia",
          "zambia", "ghana", "botswana", "brazil", "mexico", "namibia", "mozambique"}
AGRI = {"argentina", "brazil", "ukraine", "india", "vietnam", "thailand",
        "indonesia", "kenya", "ethiopia", "tanzania", "uganda", "ghana",
        "new-zealand", "netherlands", "morocco", "egypt", "guatemala", "ecuador"}

VOCAB = ["Technology", "Software", "Finance", "Banking", "Insurance", "Healthcare",
         "Biotech", "Manufacturing", "Automotive", "Aerospace", "Tourism",
         "Hospitality", "Education", "Research", "Government", "Logistics",
         "Maritime", "Energy", "Mining", "Agriculture", "Creative Industries",
         "Telecommunications"]
VOCAB_INDEX = {name: i for i, name in enumerate(VOCAB)}
VALID_CATEGORIES = {"global_hub", "major_economy", "regional_center",
                    "industrial_city", "tourism_economy", "government_center",
                    "education_research", "mixed"}


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
        return "moderate"
    if x >= 42:
        return "developing"
    return "limited"


def join_human(items):
    if not items:
        return ""
    if len(items) == 1:
        return items[0]
    return ", ".join(items[:-1]) + " and " + items[-1]


CAT_PHRASE = {
    "global_hub": "globally connected", "major_economy": "large and diversified",
    "regional_center": "regional", "industrial_city": "manufacturing-oriented",
    "tourism_economy": "tourism-driven", "government_center": "government- and services-oriented",
    "education_research": "education- and research-focused", "mixed": "mixed",
}
SECTOR_LABEL = {
    "technology": "technology", "healthcare": "healthcare",
    "finance": "finance and professional services", "manufacturing": "manufacturing",
    "tourism": "tourism and hospitality", "education": "education and research",
}


def gen(c):
    name = c["name"]
    cs = c["countrySlug"]
    ov, aff, energy, comfort = c["overall"], c["affordability"], c["energy"], c["comfort"]
    edu, infra, health = c["education"], c["infrastructure"], c["healthcare"]
    dn = c["digitalNomad"]
    natureCount = c["natureCount"]
    coast, mtn = c["coastal"], c["mountain"]
    econB, salaryB, businessB, startupB, innovB, remoteB = BASE.get(cs, BASE_DEFAULT)
    manuB = MANU.get(cs, MANU_DEFAULT)
    tourB = TOUR.get(cs, TOUR_DEFAULT)
    cap = 1 if c["slug"] in CAPITAL_SLUGS else 0
    air = 1 if c["airport"] else 0
    pop = parse_pop(c["population"])
    s = max(-1.0, min(2.2, math.log10(max(pop, 1.0)) - 5.0))

    employment = clamp(econB + 0.10 * (ov - 60) + 3 * min(s, 1.6) + 4 * cap)
    salary = clamp(salaryB + 0.08 * (ov - 60) + 4 * min(s, 1.6) + 4 * cap + 2 * air)
    startup = clamp(startupB + 0.08 * (edu - 60) + 0.06 * (dn - 60) + 5 * min(s, 1.7) + 5 * cap + 3 * air)
    business = clamp(businessB + 0.10 * (infra - 60) + 3 * min(s, 1.5) + 4 * cap)
    remoteWork = clamp(remoteB + 0.25 * (dn - 55) + 0.10 * (infra - 60) + 0.05 * (aff - 50))
    innovation = clamp(innovB + 0.10 * (edu - 60) + 5 * min(s, 1.7) + 4 * cap + 3 * air)
    affAdjInc = clamp(0.55 * salary + 0.45 * aff)
    economy = clamp(0.22 * employment + 0.18 * salary + 0.15 * business + 0.13 * startup
                    + 0.12 * innovation + 0.10 * remoteWork + 0.10 * affAdjInc)

    technologyJobs = clamp(innovB + 0.10 * (edu - 60) + 5 * min(s, 1.7) + 3 * cap + 3 * air)
    healthcareJobs = clamp(0.50 * health + 0.28 * econB + 4 * min(s, 1.5) + 3 * cap)
    financeJobs = clamp(0.70 * businessB + 0.08 * (ov - 60) + 8 * min(s, 1.8) + 12 * cap + 3 * air)
    manufacturingJobs = clamp(manuB + 0.05 * (energy - 55) + 2 * min(s, 1.2) - 7 * max(0.0, s - 1.6))
    tourismJobs = clamp(tourB + 0.10 * (comfort - 50) + (10 if coast else 0)
                        + (5 if mtn else 0) + 1.5 * min(natureCount, 8))
    educationJobs = clamp(0.55 * edu + 0.22 * econB + 4 * min(s, 1.5) + 4 * cap)
    remoteAvail = clamp(0.55 * remoteWork + 0.25 * technologyJobs + 0.20 * infra)
    jobMarket = clamp(0.30 * employment + 0.24 * economy + 0.24 * business + 0.22 * technologyJobs)
    overallCareer = clamp(0.30 * jobMarket + 0.20 * salary + 0.20 * economy
                          + 0.15 * innovation + 0.15 * remoteAvail)

    # --- industries (deterministic weights; take >=60, 3..6, tie-break vocab order) ---
    w = {
        "Technology": technologyJobs - 6,
        "Software": technologyJobs - 12,
        "Finance": financeJobs,
        "Banking": financeJobs - 5,
        "Insurance": financeJobs - 12,
        "Healthcare": healthcareJobs,
        "Biotech": (innovation + healthcareJobs) / 2 - 8,
        "Manufacturing": manufacturingJobs + 4,
        "Automotive": (manufacturingJobs + 2) if cs in AUTO else 18,
        "Aerospace": (innovation - 6) if cs in AEROSPACE else 16,
        "Tourism": tourismJobs + 2,
        "Hospitality": tourismJobs - 4,
        "Education": educationJobs,
        "Research": (innovation - 8) if innovation >= 66 else (innovation - 22),
        "Government": 80 if cap else 22,
        "Logistics": 54 + (10 if air else 0) + (5 if coast else 0) + 4 * min(s, 1.5),
        "Maritime": (60 + 4 * min(s, 1.5)) if coast else 16,
        "Energy": 78 if cs in ENERGY else 20,
        "Mining": 74 if cs in MINING else 14,
        "Agriculture": 70 if cs in AGRI else 22,
        "Creative Industries": (innovation - 16) if pop >= 1.5e6 else (innovation - 26),
        "Telecommunications": (infra - 24) if pop >= 1.2e6 else (infra - 36),
    }
    ranked = sorted(VOCAB, key=lambda n: (-w[n], VOCAB_INDEX[n]))
    industries = [n for n in ranked if w[n] >= 58][:6]
    if len(industries) < 3:
        industries = ranked[:3]

    # --- economy category (deterministic tree) ---
    sectors = {"technology": technologyJobs, "finance": financeJobs,
               "healthcare": healthcareJobs, "manufacturing": manufacturingJobs,
               "tourism": tourismJobs, "education": educationJobs}
    max_sector = max(sectors, key=lambda k: (sectors[k], k))
    if pop >= 5e6 and economy >= 82:
        category = "global_hub"
    elif cap and economy >= 64:
        category = "government_center"
    elif max_sector == "tourism" and tourismJobs >= 68:
        category = "tourism_economy"
    elif max_sector == "manufacturing" and manufacturingJobs >= 66:
        category = "industrial_city"
    elif max_sector == "education" and educationJobs >= 68 and pop < 1.3e6:
        category = "education_research"
    elif economy >= 70 and pop >= 1.3e6:
        category = "major_economy"
    elif economy >= 54:
        category = "regional_center"
    else:
        category = "mixed"

    # --- summaries ---
    econ_sum = (f"{name} has a {CAT_PHRASE[category]} economy with strengths in "
                f"{join_human([i.lower() for i in industries[:3]])}.")

    top_sectors = sorted(sectors, key=lambda k: (-sectors[k], k))
    job_sectors = join_human([SECTOR_LABEL[k] for k in top_sectors[:3]])
    jobs_sum = (f"{name}'s labour market is {band(jobMarket)}, with opportunities "
                f"concentrated in {job_sectors}.")

    rlevel = "strong" if remoteWork >= 72 else ("solid" if remoteWork >= 58 else "limited")
    remote_sum = (f"{name} offers {rlevel} infrastructure and amenities for remote "
                  f"professionals, with a remote-work score of {remoteWork}/100.")

    sfactors = []
    if edu >= 72:
        sfactors.append("universities and skilled talent")
    if business >= 72:
        sfactors.append("a favourable business environment")
    if infra >= 75:
        sfactors.append("strong infrastructure")
    if cap:
        sfactors.append("institutional and government presence")
    if not sfactors:
        sfactors.append("local business activity")
    startup_sum = (f"The startup ecosystem in {name} is {band(startup)}, supported by "
                   f"{join_human(sfactors[:3])}.")

    econ_rec = {
        "citySlug": c["slug"], "economyScore": economy, "employmentScore": employment,
        "salaryScore": salary, "startupScore": startup, "businessEnvironmentScore": business,
        "remoteWorkScore": remoteWork, "innovationScore": innovation,
        "affordabilityAdjustedIncomeScore": affAdjInc, "dominantIndustries": industries,
        "economyCategory": category, "economySummary": econ_sum, "jobsSummary": jobs_sum,
        "remoteWorkSummary": remote_sum, "startupSummary": startup_sum,
        "createdAt": "2026-06-15", "updatedAt": "2026-06-15",
    }
    jobs_rec = {
        "citySlug": c["slug"], "jobMarketScore": jobMarket,
        "technologyJobsScore": technologyJobs, "healthcareJobsScore": healthcareJobs,
        "financeJobsScore": financeJobs, "manufacturingJobsScore": manufacturingJobs,
        "tourismJobsScore": tourismJobs, "educationJobsScore": educationJobs,
        "remoteWorkAvailabilityScore": remoteAvail,
        "overallCareerOpportunityScore": overallCareer,
        "createdAt": "2026-06-15", "updatedAt": "2026-06-15",
    }
    return econ_rec, jobs_rec


econ_profiles, jobs_profiles = [], []
for c in sig:
    e, j = gen(c)
    econ_profiles.append(e)
    jobs_profiles.append(j)

# --- Python-side guard mirror (fail before writing) ---
ECON_SCORES = ["economyScore", "employmentScore", "salaryScore", "startupScore",
               "businessEnvironmentScore", "remoteWorkScore", "innovationScore",
               "affordabilityAdjustedIncomeScore"]
ECON_SUMMARIES = ["economySummary", "jobsSummary", "remoteWorkSummary", "startupSummary"]
JOBS_SCORES = ["jobMarketScore", "technologyJobsScore", "healthcareJobsScore",
               "financeJobsScore", "manufacturingJobsScore", "tourismJobsScore",
               "educationJobsScore", "remoteWorkAvailabilityScore",
               "overallCareerOpportunityScore"]
seen = set()
for e in econ_profiles:
    assert e["citySlug"] not in seen, e["citySlug"]
    seen.add(e["citySlug"])
    for k in ECON_SCORES:
        assert isinstance(e[k], int) and 0 <= e[k] <= 100, (e["citySlug"], k, e[k])
    assert 3 <= len(e["dominantIndustries"]) <= 6, (e["citySlug"], e["dominantIndustries"])
    assert all(isinstance(i, str) and i for i in e["dominantIndustries"])
    assert e["economyCategory"] in VALID_CATEGORIES, (e["citySlug"], e["economyCategory"])
    for k in ECON_SUMMARIES:
        assert isinstance(e[k], str) and len(e[k]) >= 12, (e["citySlug"], k)
sj = set()
for j in jobs_profiles:
    assert j["citySlug"] not in sj
    sj.add(j["citySlug"])
    for k in JOBS_SCORES:
        assert isinstance(j[k], int) and 0 <= j[k] <= 100, (j["citySlug"], k, j[k])
assert seen == sj, "economy/jobs citySlug parity mismatch"

# --- /tmp/economy_scores.json for the collections generator ---
flat = []
for e, j in zip(econ_profiles, jobs_profiles):
    row = {"citySlug": e["citySlug"], "economyCategory": e["economyCategory"],
           "dominantIndustries": e["dominantIndustries"]}
    for k in ECON_SCORES:
        row[k] = e[k]
    for k in JOBS_SCORES:
        row[k] = j[k]
    flat.append(row)
json.dump(flat, open("/tmp/economy_scores.json", "w"))


def j(v):
    return json.dumps(v, ensure_ascii=False)


def econ_line(e):
    return ("economyScore: %d, employmentScore: %d, salaryScore: %d, startupScore: %d, "
            "businessEnvironmentScore: %d, remoteWorkScore: %d, innovationScore: %d, "
            "affordabilityAdjustedIncomeScore: %d" % (
                e["economyScore"], e["employmentScore"], e["salaryScore"], e["startupScore"],
                e["businessEnvironmentScore"], e["remoteWorkScore"], e["innovationScore"],
                e["affordabilityAdjustedIncomeScore"]))


L = []
L.append('import type { EconomyProfile } from "@/types/economy";')
L.append('import type { JobsProfile } from "@/types/jobs";')
L.append("")
L.append("/**")
L.append(" * Deterministic Economy & Jobs profiles — one of each per city. Generated by")
L.append(" * scripts/generate-economy.py from country economic priors blended with")
L.append(" * existing per-city signals (overall/education/infrastructure/digital-nomad")
L.append(" * scores, affordability, climate comfort, metro size, capital + airport")
L.append(" * status). Planning estimates, not measured economic or labour-market data;")
L.append(" * do not edit by hand. Scoring, industry, and category rules are documented")
L.append(" * in the generator header.")
L.append(" */")
L.append("export const economyProfiles: readonly EconomyProfile[] = [")
for e in econ_profiles:
    L.append("  {")
    L.append(f"    citySlug: {j(e['citySlug'])},")
    L.append(f"    {econ_line(e)},")
    L.append(f"    dominantIndustries: {j(e['dominantIndustries'])},")
    L.append(f"    economyCategory: {j(e['economyCategory'])},")
    L.append(f"    economySummary: {j(e['economySummary'])},")
    L.append(f"    jobsSummary: {j(e['jobsSummary'])},")
    L.append(f"    remoteWorkSummary: {j(e['remoteWorkSummary'])},")
    L.append(f"    startupSummary: {j(e['startupSummary'])},")
    L.append(f"    createdAt: {j(e['createdAt'])},")
    L.append(f"    updatedAt: {j(e['updatedAt'])},")
    L.append("  },")
L.append("];")
L.append("")
L.append("export const jobsProfiles: readonly JobsProfile[] = [")
for jp in jobs_profiles:
    L.append("  { " + ", ".join([
        f"citySlug: {j(jp['citySlug'])}",
        f"jobMarketScore: {jp['jobMarketScore']}",
        f"technologyJobsScore: {jp['technologyJobsScore']}",
        f"healthcareJobsScore: {jp['healthcareJobsScore']}",
        f"financeJobsScore: {jp['financeJobsScore']}",
        f"manufacturingJobsScore: {jp['manufacturingJobsScore']}",
        f"tourismJobsScore: {jp['tourismJobsScore']}",
        f"educationJobsScore: {jp['educationJobsScore']}",
        f"remoteWorkAvailabilityScore: {jp['remoteWorkAvailabilityScore']}",
        f"overallCareerOpportunityScore: {jp['overallCareerOpportunityScore']}",
        f"createdAt: {j(jp['createdAt'])}",
        f"updatedAt: {j(jp['updatedAt'])}",
    ]) + " },")
L.append("];")
L.append("")
L.append("const economyBySlug: Record<string, EconomyProfile> = {};")
L.append("for (const profile of economyProfiles) {")
L.append("  economyBySlug[profile.citySlug] = profile;")
L.append("}")
L.append("const jobsBySlug: Record<string, JobsProfile> = {};")
L.append("for (const profile of jobsProfiles) {")
L.append("  jobsBySlug[profile.citySlug] = profile;")
L.append("}")
L.append("")
L.append("const VALID_ECONOMY_CATEGORIES: ReadonlySet<string> = new Set([")
L.append('  "global_hub", "major_economy", "regional_center", "industrial_city",')
L.append('  "tourism_economy", "government_center", "education_research", "mixed",')
L.append("]);")
L.append("")
L.append("/** Build-time integrity guard — throws (failing `next build`) on any invalid profile. */")
L.append("function assertEconomyIntegrity(")
L.append("  economy: readonly EconomyProfile[],")
L.append("  jobs: readonly JobsProfile[],")
L.append("): void {")
L.append("  const errors: string[] = [];")
L.append("  const inRange = (n: number) =>")
L.append('    typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 100;')
L.append("  const econSeen = new Set<string>();")
L.append("  for (const e of economy) {")
L.append("    if (!e.citySlug) errors.push(`missing citySlug`);")
L.append("    if (econSeen.has(e.citySlug)) errors.push(`duplicate economy citySlug: ${e.citySlug}`);")
L.append("    econSeen.add(e.citySlug);")
L.append("    const scores = [")
L.append("      e.economyScore, e.employmentScore, e.salaryScore, e.startupScore,")
L.append("      e.businessEnvironmentScore, e.remoteWorkScore, e.innovationScore,")
L.append("      e.affordabilityAdjustedIncomeScore,")
L.append("    ];")
L.append("    if (scores.some((n) => !inRange(n)))")
L.append("      errors.push(`${e.citySlug}: economy score out of range`);")
L.append("    if (e.dominantIndustries.length < 3 || e.dominantIndustries.length > 6)")
L.append("      errors.push(`${e.citySlug}: dominantIndustries must be 3-6`);")
L.append('    if (e.dominantIndustries.some((i) => typeof i !== "string" || i.length === 0))')
L.append("      errors.push(`${e.citySlug}: empty industry`);")
L.append("    if (!VALID_ECONOMY_CATEGORIES.has(e.economyCategory))")
L.append("      errors.push(`${e.citySlug}: invalid economyCategory ${e.economyCategory}`);")
L.append("    const summaries = [")
L.append("      e.economySummary, e.jobsSummary, e.remoteWorkSummary, e.startupSummary,")
L.append("    ];")
L.append('    if (summaries.some((t) => typeof t !== "string" || t.length === 0))')
L.append("      errors.push(`${e.citySlug}: missing summary`);")
L.append("  }")
L.append("  const jobsSeen = new Set<string>();")
L.append("  for (const jp of jobs) {")
L.append("    if (jobsSeen.has(jp.citySlug)) errors.push(`duplicate jobs citySlug: ${jp.citySlug}`);")
L.append("    jobsSeen.add(jp.citySlug);")
L.append("    const scores = [")
L.append("      jp.jobMarketScore, jp.technologyJobsScore, jp.healthcareJobsScore,")
L.append("      jp.financeJobsScore, jp.manufacturingJobsScore, jp.tourismJobsScore,")
L.append("      jp.educationJobsScore, jp.remoteWorkAvailabilityScore,")
L.append("      jp.overallCareerOpportunityScore,")
L.append("    ];")
L.append("    if (scores.some((n) => !inRange(n)))")
L.append("      errors.push(`${jp.citySlug}: jobs score out of range`);")
L.append("  }")
L.append("  for (const slug of econSeen)")
L.append("    if (!jobsSeen.has(slug)) errors.push(`${slug}: economy without jobs profile`);")
L.append("  for (const slug of jobsSeen)")
L.append("    if (!econSeen.has(slug)) errors.push(`${slug}: jobs without economy profile`);")
L.append("  if (errors.length > 0) {")
L.append('    throw new Error(`economy integrity failure:\\n${errors.join("\\n")}`);')
L.append("  }")
L.append("}")
L.append("")
L.append("assertEconomyIntegrity(economyProfiles, jobsProfiles);")
L.append("")
L.append("export function getEconomy(citySlug: string): EconomyProfile | undefined {")
L.append("  return economyBySlug[citySlug];")
L.append("}")
L.append("")
L.append("export function hasEconomy(citySlug: string): boolean {")
L.append("  return Object.prototype.hasOwnProperty.call(economyBySlug, citySlug);")
L.append("}")
L.append("")
L.append("export function getAllEconomyProfiles(): readonly EconomyProfile[] {")
L.append("  return economyProfiles;")
L.append("}")
L.append("")
L.append("export function getJobs(citySlug: string): JobsProfile | undefined {")
L.append("  return jobsBySlug[citySlug];")
L.append("}")
L.append("")
L.append("export function hasJobs(citySlug: string): boolean {")
L.append("  return Object.prototype.hasOwnProperty.call(jobsBySlug, citySlug);")
L.append("}")
L.append("")
L.append("export function getAllJobsProfiles(): readonly JobsProfile[] {")
L.append("  return jobsProfiles;")
L.append("}")

open(ROOT / "lib/data/economy.ts", "w").write("\n".join(L) + "\n")

from collections import Counter
print(f"wrote lib/data/economy.ts: {len(econ_profiles)} economy + {len(jobs_profiles)} jobs")
print("category dist:", dict(Counter(e["economyCategory"] for e in econ_profiles)))
print("capitals flagged:", len(CAPITAL_SLUGS))
by = {e["citySlug"]: e for e in econ_profiles}
byj = {x["citySlug"]: x for x in jobs_profiles}
for s in ("munich", "zurich", "singapore", "detroit", "stuttgart", "frankfurt",
          "barcelona", "dubai", "bern", "lagos"):
    if s in by:
        e = by[s]
        print(f"  {s:11s} econ={e['economyScore']:3d} cat={e['economyCategory']:16s} "
              f"career={byj[s]['overallCareerOpportunityScore']:3d} ind={e['dominantIndustries']}")
