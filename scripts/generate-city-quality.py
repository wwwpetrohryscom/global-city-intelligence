#!/usr/bin/env python3
"""Deterministic Safety & Quality-of-Life generator. No randomness, no network.

Inputs (all present for 100% of cities, via scripts/export-quality-signals.py):
  country priors (safety/health/education/infra/cleanliness/walk/cycle, by
  development + known-quality tiers) BLENDED with per-city signals: existing
  overall/airQuality/energy/resilience scores, affordability, climate comfort,
  nearby-nature density, coastal/mountain/lake cluster flags, and metro size.

SCORING (every score clamped to 0-100, integer; composites use weights summing
to 1.0 so they stay in range):
  size s = clamp(log10(pop)-5, -1..2.2)   internet = (overall+energy)/2
  nature_norm = min(100, natureCount*14)
  SAFETY
    crime    = safeB + .15(ov-60) - 6*max(0,s-1) + .04(air-60)
    personal = safeB + .10(ov-60) - 4*max(0,s-1)
    night    = safeB - 4 - 6*max(0,s-.5) + .08(ov-60)
    road     = .80*safeB + 12 + .12(en-60) - 3*max(0,s-1)
    overallSafety = .32crime + .30personal + .20night + .18road
  QUALITY
    healthcare = healthB + .10(ov-60)
    education  = eduB + .08(ov-60) + 3*min(s,1.5)
    green      = 38 + .5*nature_norm + .22(air-50) + 9[mtn] + 6[lake] + 5[coast] + .10(res-50)
    cleanliness= cleanB + .30(air-60) - 3*max(0,s-1)
    infra      = infraB + .20(en-60) + 4*min(s,1.5)
    mobility   = .42*infraB + .38*walkB + 7*min(s,2) + .10(en-60)
    qol = .20health + .12edu + .14green + .12clean + .12infra + .10mobility + .12overallSafety + .08comfort
  LIFESTYLE
    walk    = walkB + 9*min(s,1.8) + .06(ov-60)
    cycle   = cycleB + .28(air-55) + 6[!mtn]/-3[mtn] + 5*min(s,1.5) + .08(res-50)
    outdoor = .34comfort + .30*min(100,natureCount*13) + 11[coast] + 11[mtn] + 6[lake] + .10(air-50)
    family  = .30overallSafety + .20health + .18edu + .16green + .08clean + .08aff
    nomad   = .24internet + .18aff + .16overallSafety + .16qol + .14walk + .12infra
    retire  = .26health + .20overallSafety + .16aff + .12comfort + .12clean + .08green + .06qol

Writes lib/data/city-quality.ts (data + guard + access) and /tmp/quality_scores.json."""
import json, math, re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
sig = json.load(open("/tmp/quality_signals.json"))

# country -> (safety, health, education, infra, cleanliness, walk, cycle) priors.
# Built from development + known quality-of-life tiers; deterministic estimates.
def tier(slugs, t):
    return {s: t for s in slugs}

PRIORS = {}
# Tier S — very high
PRIORS.update(tier(["switzerland", "norway", "denmark", "finland", "sweden",
                    "iceland", "austria", "luxembourg", "japan", "singapore"],
                   (90, 92, 88, 92, 90, 80, 62)))
PRIORS.update(tier(["netherlands"], (88, 90, 87, 90, 88, 86, 92)))
# Tier A — high
PRIORS.update(tier(["germany", "belgium"], (82, 87, 84, 88, 84, 80, 72)))
PRIORS.update(tier(["france", "united-kingdom", "ireland", "spain", "italy",
                    "portugal", "slovenia", "estonia", "czechia"],
                   (80, 85, 83, 84, 82, 79, 52)))
PRIORS.update(tier(["canada", "australia", "new-zealand", "united-states"],
                   (78, 84, 84, 86, 82, 60, 46)))
PRIORS.update(tier(["south-korea", "taiwan", "hong-kong"], (84, 84, 85, 88, 82, 82, 44)))
PRIORS.update(tier(["united-arab-emirates", "qatar"], (84, 80, 76, 90, 82, 52, 28)))
# Tier B — upper-mid
PRIORS.update(tier(["poland", "hungary", "slovakia", "lithuania", "latvia",
                    "croatia", "greece", "israel", "malaysia", "china",
                    "chile", "uruguay", "costa-rica", "panama"],
                   (70, 74, 75, 74, 72, 73, 50)))
PRIORS.update(tier(["kuwait", "bahrain", "oman", "saudi-arabia"], (74, 72, 70, 78, 74, 48, 26)))
# Tier C — mid
PRIORS.update(tier(["romania", "bulgaria", "serbia", "montenegro",
                    "north-macedonia", "albania", "bosnia-and-herzegovina",
                    "moldova", "ukraine", "turkey", "thailand", "vietnam",
                    "indonesia", "philippines", "peru", "ecuador",
                    "dominican-republic", "jordan", "lebanon", "sri-lanka",
                    "india", "morocco", "tunisia", "egypt", "namibia",
                    "botswana", "cambodia"],
                   (58, 62, 64, 62, 60, 66, 44)))
PRIORS.update(tier(["mexico", "brazil", "argentina", "colombia", "guatemala",
                    "south-africa"], (48, 60, 62, 58, 52, 64, 42)))
# Tier D — lower
PRIORS.update(tier(["pakistan", "nigeria", "kenya", "ghana", "ethiopia",
                    "tanzania", "uganda", "zambia", "mozambique", "senegal"],
                   (50, 52, 55, 50, 52, 64, 40)))
PRIORS.update(tier(["rwanda"], (66, 56, 56, 56, 70, 64, 40)))
DEFAULT = (60, 64, 66, 64, 62, 68, 46)


def clamp(x):
    return max(0, min(100, int(round(x))))


def parse_pop(s):
    m = re.search(r'([\d.]+)\s*([MmKk])', s or '')
    if not m:
        return 300000.0
    return float(m.group(1)) * (1e6 if m.group(2) in 'Mm' else 1e3)


def band_word(x):
    if x >= 80:
        return "very high"
    if x >= 68:
        return "high"
    if x >= 55:
        return "moderate"
    if x >= 42:
        return "modest"
    return "limited"


def strengths_list(pairs):
    return [label for cond, label in pairs if cond]


def join_human(items):
    if not items:
        return ""
    if len(items) == 1:
        return items[0]
    return ", ".join(items[:-1]) + " and " + items[-1]


def gen(c):
    name = c["name"]
    ov, aff, air, en, res = c["overall"], c["affordability"], c["airQuality"], c["energy"], c["resilience"]
    comfort = c["comfort"]
    natureCount = c["natureCount"]
    coast, mtn, lake = c["coastal"], c["mountain"], c["lake"]
    safeB, healthB, eduB, infraB, cleanB, walkB, cycleB = PRIORS.get(c["countrySlug"], DEFAULT)

    pop = parse_pop(c["population"])
    s = max(-1.0, min(2.2, math.log10(max(pop, 1.0)) - 5.0))
    internet = (ov + en) / 2.0
    nature_norm = min(100.0, natureCount * 14.0)

    crime = clamp(safeB + 0.15 * (ov - 60) - 6 * max(0.0, s - 1) + 0.04 * (air - 60))
    personal = clamp(safeB + 0.10 * (ov - 60) - 4 * max(0.0, s - 1))
    night = clamp(safeB - 4 - 6 * max(0.0, s - 0.5) + 0.08 * (ov - 60))
    road = clamp(0.80 * safeB + 12 + 0.12 * (en - 60) - 3 * max(0.0, s - 1))
    overallSafety = clamp(0.32 * crime + 0.30 * personal + 0.20 * night + 0.18 * road)

    healthcare = clamp(healthB + 0.10 * (ov - 60))
    education = clamp(eduB + 0.08 * (ov - 60) + 3 * min(s, 1.5))
    green = clamp(38 + 0.5 * nature_norm + 0.22 * (air - 50) + (9 if mtn else 0)
                  + (6 if lake else 0) + (5 if coast else 0) + 0.10 * (res - 50))
    cleanliness = clamp(cleanB + 0.30 * (air - 60) - 3 * max(0.0, s - 1))
    infra = clamp(infraB + 0.20 * (en - 60) + 4 * min(s, 1.5))
    mobility = clamp(0.42 * infraB + 0.38 * walkB + 7 * min(s, 2.0) + 0.10 * (en - 60))
    qol = clamp(0.20 * healthcare + 0.12 * education + 0.14 * green + 0.12 * cleanliness
                + 0.12 * infra + 0.10 * mobility + 0.12 * overallSafety + 0.08 * comfort)

    walk = clamp(walkB + 9 * min(s, 1.8) + 0.06 * (ov - 60))
    cycle = clamp(cycleB + 0.28 * (air - 55) + (-3 if mtn else 6) + 5 * min(s, 1.5) + 0.08 * (res - 50))
    outdoor = clamp(0.34 * comfort + 0.30 * min(100.0, natureCount * 13.0) + (11 if coast else 0)
                    + (11 if mtn else 0) + (6 if lake else 0) + 0.10 * (air - 50))
    family = clamp(0.30 * overallSafety + 0.20 * healthcare + 0.18 * education
                   + 0.16 * green + 0.08 * cleanliness + 0.08 * aff)
    nomad = clamp(0.24 * internet + 0.18 * aff + 0.16 * overallSafety + 0.16 * qol
                  + 0.14 * walk + 0.12 * infra)
    retire = clamp(0.26 * healthcare + 0.20 * overallSafety + 0.16 * aff + 0.12 * comfort
                   + 0.12 * cleanliness + 0.08 * green + 0.06 * qol)

    # --- deterministic, band-based summaries (no fabricated external rankings) ---
    if overallSafety >= 80:
        safety_sum = (f"{name} ranks in the upper tier of our safety index "
                      f"({overallSafety}/100), with strong personal-safety and "
                      f"{'low' if night >= 72 else 'reasonable'} night-time indicators.")
    elif overallSafety >= 65:
        safety_sum = (f"{name} is estimated to be a generally safe city "
                      f"({overallSafety}/100 in our safety index), with solid "
                      f"personal-safety indicators"
                      f"{', though night-time scores run lower' if night < overallSafety - 6 else ''}.")
    elif overallSafety >= 50:
        safety_sum = (f"{name} has a moderate safety estimate ({overallSafety}/100); "
                      f"standard urban precautions are advised, particularly after dark.")
    else:
        safety_sum = (f"{name} scores below average for safety in our index "
                      f"({overallSafety}/100); research neighborhoods and take standard precautions.")

    qstr = join_human(strengths_list([
        (healthcare >= 75, "healthcare"), (mobility >= 72, "public transport"),
        (green >= 70, "green space"), (cleanliness >= 76, "cleanliness"),
        (infra >= 80, "infrastructure"),
    ]))
    quality_sum = (f"{name} has a {band_word(qol)} quality-of-life estimate ({qol}/100)"
                   f"{', with notable strengths in ' + qstr if qstr else ' across our combined indicators'}.")

    fstr = join_human(strengths_list([
        (education >= 74, "education access"), (overallSafety >= 72, "safety"),
        (green >= 70, "parks and green space"), (healthcare >= 74, "healthcare"),
    ]))
    family_sum = (f"{name} scores {band_word(family)} for family living ({family}/100)"
                  f"{', helped by ' + fstr if fstr else ''}.")

    nstr = join_human(strengths_list([
        (aff >= 60, "affordability"), (walk >= 72, "walkability"),
        (overallSafety >= 72, "safety"), (qol >= 72, "overall livability"),
    ]))
    nomad_sum = (f"{name} is {band_word(nomad)} for remote workers ({nomad}/100), "
                 f"based on connectivity{', ' + nstr if nstr else ''} and day-to-day amenities.")

    rstr = join_human(strengths_list([
        (healthcare >= 74, "healthcare access"), (aff >= 60, "affordability"),
        (comfort >= 68, "a comfortable climate"), (cleanliness >= 74, "a clean environment"),
    ]))
    retire_sum = (f"{name} is {band_word(retire)} for retirement ({retire}/100)"
                  f"{', appealing for ' + rstr if rstr else ''}.")

    return {
        "citySlug": c["slug"],
        "safety": {"crimeScore": crime, "personalSafetyScore": personal,
                   "nightSafetyScore": night, "roadSafetyScore": road,
                   "overallSafetyScore": overallSafety},
        "quality": {"qualityOfLifeScore": qol, "healthcareScore": healthcare,
                    "educationScore": education, "greenSpaceScore": green,
                    "cleanlinessScore": cleanliness, "infrastructureScore": infra,
                    "mobilityScore": mobility},
        "lifestyle": {"familyFriendlyScore": family, "digitalNomadScore": nomad,
                      "retirementScore": retire, "walkabilityScore": walk,
                      "cyclingScore": cycle, "outdoorLifestyleScore": outdoor},
        "safetySummary": safety_sum, "qualitySummary": quality_sum,
        "familySummary": family_sum, "nomadSummary": nomad_sum,
        "retirementSummary": retire_sum,
        "createdAt": "2026-06-15", "updatedAt": "2026-06-15",
    }


profiles = [gen(c) for c in sig]

# --- Python-side mirror of the runtime guard (fail before writing) ---
SCORE_KEYS = {
    "safety": ["crimeScore", "personalSafetyScore", "nightSafetyScore", "roadSafetyScore", "overallSafetyScore"],
    "quality": ["qualityOfLifeScore", "healthcareScore", "educationScore", "greenSpaceScore",
                "cleanlinessScore", "infrastructureScore", "mobilityScore"],
    "lifestyle": ["familyFriendlyScore", "digitalNomadScore", "retirementScore",
                  "walkabilityScore", "cyclingScore", "outdoorLifestyleScore"],
}
SUMMARY_KEYS = ["safetySummary", "qualitySummary", "familySummary", "nomadSummary", "retirementSummary"]
seen = set()
for p in profiles:
    assert p["citySlug"] not in seen, f"dup {p['citySlug']}"
    seen.add(p["citySlug"])
    for grp, keys in SCORE_KEYS.items():
        for k in keys:
            v = p[grp][k]
            assert isinstance(v, int) and 0 <= v <= 100, (p["citySlug"], grp, k, v)
    for k in SUMMARY_KEYS:
        assert isinstance(p[k], str) and len(p[k]) >= 12, (p["citySlug"], k)

# --- emit /tmp/quality_scores.json (flat) for the collections generator ---
flat = []
for p in profiles:
    row = {"citySlug": p["citySlug"]}
    for grp, keys in SCORE_KEYS.items():
        for k in keys:
            row[k] = p[grp][k]
    flat.append(row)
json.dump(flat, open("/tmp/quality_scores.json", "w"))


def j(v):
    return json.dumps(v, ensure_ascii=False)


def obj(d, keys):
    return "{ " + ", ".join(f"{k}: {d[k]}" for k in keys) + " }"


L = []
L.append('import type { CityQualityProfileRecord } from "@/types/city-quality";')
L.append("")
L.append("/**")
L.append(" * Deterministic Safety & Quality-of-Life profiles — one per city. Generated")
L.append(" * by scripts/generate-city-quality.py from country priors blended with")
L.append(" * existing per-city signals (overall/air-quality/energy/resilience scores,")
L.append(" * affordability, climate comfort, nearby-nature density, coastal/mountain")
L.append(" * cluster flags, metro size). Planning estimates, not measured survey or")
L.append(" * crime data; do not edit by hand. Scoring formulas are documented in the")
L.append(" * generator header.")
L.append(" */")
L.append("export const cityQualityProfiles: readonly CityQualityProfileRecord[] = [")
for p in profiles:
    L.append("  {")
    L.append(f"    citySlug: {j(p['citySlug'])},")
    L.append(f"    safety: {obj(p['safety'], SCORE_KEYS['safety'])},")
    L.append(f"    quality: {obj(p['quality'], SCORE_KEYS['quality'])},")
    L.append(f"    lifestyle: {obj(p['lifestyle'], SCORE_KEYS['lifestyle'])},")
    for k in SUMMARY_KEYS:
        L.append(f"    {k}: {j(p[k])},")
    L.append(f"    createdAt: {j(p['createdAt'])},")
    L.append(f"    updatedAt: {j(p['updatedAt'])},")
    L.append("  },")
L.append("];")
L.append("")
L.append("const byCitySlug: Record<string, CityQualityProfileRecord> = {};")
L.append("for (const profile of cityQualityProfiles) {")
L.append("  byCitySlug[profile.citySlug] = profile;")
L.append("}")
L.append("")
L.append("/** Build-time integrity guard — throws (failing `next build`) on any invalid profile. */")
L.append("function assertCityQualityIntegrity(")
L.append("  profiles: readonly CityQualityProfileRecord[],")
L.append("): void {")
L.append("  const errors: string[] = [];")
L.append("  const seen = new Set<string>();")
L.append("  const inRange = (n: number) =>")
L.append("    typeof n === \"number\" && Number.isFinite(n) && n >= 0 && n <= 100;")
L.append("  for (const p of profiles) {")
L.append("    if (!p.citySlug) errors.push(`missing citySlug`);")
L.append("    if (seen.has(p.citySlug)) errors.push(`duplicate citySlug: ${p.citySlug}`);")
L.append("    seen.add(p.citySlug);")
L.append("    const scores = [")
L.append("      p.safety.crimeScore, p.safety.personalSafetyScore, p.safety.nightSafetyScore,")
L.append("      p.safety.roadSafetyScore, p.safety.overallSafetyScore,")
L.append("      p.quality.qualityOfLifeScore, p.quality.healthcareScore, p.quality.educationScore,")
L.append("      p.quality.greenSpaceScore, p.quality.cleanlinessScore, p.quality.infrastructureScore,")
L.append("      p.quality.mobilityScore,")
L.append("      p.lifestyle.familyFriendlyScore, p.lifestyle.digitalNomadScore,")
L.append("      p.lifestyle.retirementScore, p.lifestyle.walkabilityScore,")
L.append("      p.lifestyle.cyclingScore, p.lifestyle.outdoorLifestyleScore,")
L.append("    ];")
L.append("    if (scores.some((n) => !inRange(n)))")
L.append("      errors.push(`${p.citySlug}: score out of range (0-100)`);")
L.append("    const summaries = [")
L.append("      p.safetySummary, p.qualitySummary, p.familySummary,")
L.append("      p.nomadSummary, p.retirementSummary,")
L.append("    ];")
L.append("    if (summaries.some((t) => typeof t !== \"string\" || t.length === 0))")
L.append("      errors.push(`${p.citySlug}: missing summary`);")
L.append("  }")
L.append("  if (errors.length > 0) {")
L.append("    throw new Error(`city-quality integrity failure:\\n${errors.join(\"\\n\")}`);")
L.append("  }")
L.append("}")
L.append("")
L.append("assertCityQualityIntegrity(cityQualityProfiles);")
L.append("")
L.append("export function getCityQuality(")
L.append("  citySlug: string,")
L.append("): CityQualityProfileRecord | undefined {")
L.append("  return byCitySlug[citySlug];")
L.append("}")
L.append("")
L.append("export function hasCityQuality(citySlug: string): boolean {")
L.append("  return Object.prototype.hasOwnProperty.call(byCitySlug, citySlug);")
L.append("}")
L.append("")
L.append("export function getAllCityQualityProfiles(): readonly CityQualityProfileRecord[] {")
L.append("  return cityQualityProfiles;")
L.append("}")

open(ROOT / "lib/data/city-quality.ts", "w").write("\n".join(L) + "\n")

# --- report ---
from collections import Counter
print(f"wrote lib/data/city-quality.ts: {len(profiles)} profiles")
print("safety overall band:", Counter(band_word(p["safety"]["overallSafetyScore"]) for p in profiles))
print("qol band:", Counter(band_word(p["quality"]["qualityOfLifeScore"]) for p in profiles))
by = {p["citySlug"]: p for p in profiles}
for s in ("copenhagen", "vienna", "zurich", "singapore", "tokyo", "norfolk", "lagos", "mumbai", "reykjavik"):
    if s in by:
        p = by[s]
        print(f"  {s:12s} safe={p['safety']['overallSafetyScore']:3d} qol={p['quality']['qualityOfLifeScore']:3d} "
              f"fam={p['lifestyle']['familyFriendlyScore']:3d} nomad={p['lifestyle']['digitalNomadScore']:3d} "
              f"retire={p['lifestyle']['retirementScore']:3d} walk={p['lifestyle']['walkabilityScore']:3d}")
