#!/usr/bin/env python3
"""Validate the Healthcare & Retirement layer in lib/data/healthcare-retirement.ts
against lib/data/cities.ts. Mirrors the runtime guard `assertHealthcareIntegrity`
(which fails `next build`):

  - 1119 healthcare profiles + 1119 retirement profiles, 100% coverage, parity
  - unique citySlug, valid city refs; valid categories; all scores 0-100; summaries present
  - medical facilities: unique ids, valid city refs, valid type/serviceLevel,
    name present, 3-10 per city, 4000-8000 total

Non-zero exit on failure.
"""
from __future__ import annotations
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "lib/data/healthcare-retirement.ts"
CITIES = ROOT / "lib/data/cities.ts"

HC_SCORES = ["healthcareScore", "healthcareAccessScore", "hospitalAvailabilityScore",
             "specialistCareScore", "preventativeCareScore", "emergencyCareScore",
             "healthcareAffordabilityScore"]
HC_SUMM = ["healthcareSummary", "medicalAccessSummary", "healthcareEnvironmentSummary"]
RET_SCORES = ["retirementScore", "affordabilityScore", "healthcareSupportScore",
              "climateComfortScore", "safetySupportScore", "walkabilityScore",
              "accessibilityScore", "activeLifestyleScore"]
RET_SUMM = ["retirementSummary", "lifestyleSummary", "affordabilitySummary", "activeLivingSummary"]
HC_CATS = {"global_medical_hub", "major_healthcare_center", "regional_healthcare_center",
           "healthcare_access_city", "developing_healthcare_market", "mixed"}
RET_CATS = {"premium_retirement", "active_retirement", "affordable_retirement",
            "urban_retirement", "nature_retirement", "mixed"}
FAC_TYPES = {"general_hospital", "specialist_hospital", "university_hospital",
             "medical_center", "community_hospital"}
SVC = {"local", "regional", "national"}


def city_slugs() -> set[str]:
    return set(re.findall(r'^\s+slug: "([a-z0-9][a-z0-9-]*)",', CITIES.read_text(), re.M))


def check_profile_block(block, slug, scores, summaries, cat_field, cats, errors):
    for k in scores:
        mm = re.search(rf'\b{k}: (-?\d+)', block)
        if not mm:
            errors.append(f"{slug}: missing {k}")
        elif not (0 <= int(mm.group(1)) <= 100):
            errors.append(f"{slug}: {k} out of range ({mm.group(1)})")
    cm = re.search(rf'{cat_field}: "([a-z_]+)"', block)
    if not cm or cm.group(1) not in cats:
        errors.append(f"{slug}: invalid/missing {cat_field}")
    for k in summaries:
        sm = re.search(rf'{k}: "([^"]*)"', block)
        if not sm or len(sm.group(1).strip()) == 0:
            errors.append(f"{slug}: missing/empty {k}")


def parse_profiles(text, scores, summaries, cat_field, cats, cities, errors):
    seen: set[str] = set()
    starts = [m.start() for m in re.finditer(r'\n  \{\n    citySlug: "[a-z0-9-]+",', text)]
    starts.append(len(text))
    for i in range(len(starts) - 1):
        block = text[starts[i]:starts[i + 1]]
        sm = re.search(r'citySlug: "([a-z0-9-]+)"', block)
        if not sm:
            continue
        slug = sm.group(1)
        if slug in seen:
            errors.append(f"duplicate {cat_field} citySlug: {slug}")
        seen.add(slug)
        if slug not in cities:
            errors.append(f"{slug}: profile for non-existent city")
        check_profile_block(block, slug, scores, summaries, cat_field, cats, errors)
    return seen


def main() -> int:
    errors: list[str] = []
    cities = city_slugs()
    text = DATA.read_text()
    try:
        hc_text = text.split("export const healthcareProfiles")[1].split("export const retirementProfiles")[0]
        ret_text = text.split("export const retirementProfiles")[1].split("export const medicalFacilities")[0]
        fac_text = text.split("export const medicalFacilities")[1].split("const healthcareBySlug")[0]
    except IndexError:
        print("FAIL: could not locate healthcare/retirement/facility arrays")
        return 1

    hc_seen = parse_profiles(hc_text, HC_SCORES, HC_SUMM, "healthcareCategory", HC_CATS, cities, errors)
    ret_seen = parse_profiles(ret_text, RET_SCORES, RET_SUMM, "retirementCategory", RET_CATS, cities, errors)

    id_seen: set[str] = set()
    fac_count = 0
    per_city: dict[str, int] = {}
    for m in re.finditer(
        r'\{ id: "([^"]+)", citySlug: "([a-z0-9-]+)", name: "((?:[^"\\]|\\.)*)", '
        r'type: "([a-z_]+)", serviceLevel: "([a-z]+)",', fac_text):
        fid, slug, _name, ftype, svc = m.groups()
        fac_count += 1
        if fid in id_seen:
            errors.append(f"duplicate facility id: {fid}")
        id_seen.add(fid)
        if slug not in hc_seen:
            errors.append(f"{fid}: references unknown city {slug}")
        if ftype not in FAC_TYPES:
            errors.append(f"{fid}: invalid type {ftype}")
        if svc not in SVC:
            errors.append(f"{fid}: invalid serviceLevel {svc}")
        per_city[slug] = per_city.get(slug, 0) + 1

    for s in sorted(cities - hc_seen):
        errors.append(f"city without healthcare profile: {s}")
    for s in sorted(cities - ret_seen):
        errors.append(f"city without retirement profile: {s}")
    for s in sorted(hc_seen ^ ret_seen):
        errors.append(f"healthcare/retirement parity mismatch: {s}")
    for slug in sorted(hc_seen):
        n = per_city.get(slug, 0)
        if not (3 <= n <= 10):
            errors.append(f"{slug}: {n} medical facilities (must be 3-10)")
    if not (4000 <= fac_count <= 8000):
        errors.append(f"facility total {fac_count} outside 4000-8000")

    if errors:
        print("FAIL: healthcare validation failed:")
        for e in errors[:60]:
            print("  - " + e)
        if len(errors) > 60:
            print(f"  ... and {len(errors) - 60} more")
        return 1

    print(f"PASS: healthcare ({len(hc_seen)} healthcare + {len(ret_seen)} retirement profiles, "
          f"{fac_count} medical facilities, {len(cities)} cities, 3-10 facilities/city) — all checks clean.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
