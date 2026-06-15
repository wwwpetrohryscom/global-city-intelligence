#!/usr/bin/env python3
"""Validate the Education & Universities layer in lib/data/education.ts against
lib/data/cities.ts. Mirrors the runtime guard `assertEducationIntegrity` (which
fails `next build`):

  - 1119 education profiles, 100% city coverage, unique citySlug, valid city refs
  - all 7 education scores in 0-100; valid educationCategory; 4 summaries present
  - universities: unique ids, citySlug resolves to an education profile/city,
    valid type, valid studentPopulationCategory, scores 0-100, 2-6 valid focus
    areas, plausible foundedYear
  - 3-15 universities per city (guard parity)

Non-zero exit on failure.
"""
from __future__ import annotations
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "lib/data/education.ts"
CITIES = ROOT / "lib/data/cities.ts"

EDU_SCORES = ["educationScore", "higherEducationScore", "researchScore",
              "internationalStudentScore", "studentFriendlinessScore",
              "universityDensityScore", "academicReputationScore"]
EDU_SUMMARIES = ["educationSummary", "studentExperienceSummary", "researchSummary",
                 "internationalSummary"]
VALID_CATEGORIES = {"global_academic_hub", "major_university_city", "research_center",
                    "student_city", "regional_education_center", "mixed"}
VALID_TYPES = {"public", "private", "research", "technical", "medical", "business"}
VALID_POP = {"small", "medium", "large"}
VOCAB = {"Engineering", "Computer Science", "Medicine", "Healthcare", "Business",
         "Economics", "Finance", "Law", "Humanities", "Social Sciences", "Education",
         "Environmental Sciences", "Agriculture", "Architecture", "Design", "Arts",
         "Physics", "Mathematics", "Biotechnology", "Energy", "Transportation",
         "Tourism", "Public Policy"}


def city_slugs() -> set[str]:
    return set(re.findall(r'^\s+slug: "([a-z0-9][a-z0-9-]*)",', CITIES.read_text(), re.M))


def main() -> int:
    errors: list[str] = []
    cities = city_slugs()
    text = DATA.read_text()
    try:
        edu_text = text.split("export const educationProfiles")[1].split("export const universities")[0]
        uni_text = text.split("export const universities")[1].split("const educationBySlug")[0]
    except IndexError:
        print("FAIL: could not locate educationProfiles / universities arrays")
        return 1

    # --- education profiles ---
    edu_seen: set[str] = set()
    edu_count = 0
    starts = [m.start() for m in re.finditer(r'\n  \{\n    citySlug: "[a-z0-9-]+",', edu_text)]
    starts.append(len(edu_text))
    for i in range(len(starts) - 1):
        block = edu_text[starts[i]:starts[i + 1]]
        sm = re.search(r'citySlug: "([a-z0-9-]+)"', block)
        if not sm:
            continue
        slug = sm.group(1)
        edu_count += 1
        if slug in edu_seen:
            errors.append(f"duplicate education citySlug: {slug}")
        edu_seen.add(slug)
        if slug not in cities:
            errors.append(f"{slug}: education profile for non-existent city")
        for k in EDU_SCORES:
            mm = re.search(rf'\b{k}: (-?\d+)', block)
            if not mm:
                errors.append(f"{slug}: missing {k}")
            elif not (0 <= int(mm.group(1)) <= 100):
                errors.append(f"{slug}: {k} out of range ({mm.group(1)})")
        cm = re.search(r'educationCategory: "([a-z_]+)"', block)
        if not cm or cm.group(1) not in VALID_CATEGORIES:
            errors.append(f"{slug}: invalid/missing educationCategory")
        for k in EDU_SUMMARIES:
            sm2 = re.search(rf'{k}: "([^"]*)"', block)
            if not sm2 or len(sm2.group(1).strip()) == 0:
                errors.append(f"{slug}: missing/empty {k}")

    # --- universities (one-line records) ---
    id_seen: set[str] = set()
    uni_count = 0
    per_city: dict[str, int] = {}
    for m in re.finditer(
        r'\{ id: "([^"]+)", citySlug: "([a-z0-9-]+)", name: "((?:[^"\\]|\\.)*)", '
        r'type: "([a-z]+)", focusAreas: \[([^\]]*)\], '
        r'internationalFocusScore: (\d+), researchIntensityScore: (\d+), '
        r'studentPopulationCategory: "([a-z]+)", foundedYear: (\d+),',
        uni_text,
    ):
        uid, slug, _name, utype, focus, intl, res, pop, year = m.groups()
        uni_count += 1
        if uid in id_seen:
            errors.append(f"duplicate university id: {uid}")
        id_seen.add(uid)
        if slug not in edu_seen:
            errors.append(f"{uid}: references unknown city {slug}")
        if utype not in VALID_TYPES:
            errors.append(f"{uid}: invalid type {utype}")
        if pop not in VALID_POP:
            errors.append(f"{uid}: invalid studentPopulationCategory {pop}")
        if not (0 <= int(intl) <= 100) or not (0 <= int(res) <= 100):
            errors.append(f"{uid}: score out of range")
        if not (1000 <= int(year) <= 2025):
            errors.append(f"{uid}: implausible foundedYear {year}")
        focus_list = re.findall(r'"([^"]+)"', focus)
        if not (2 <= len(focus_list) <= 6):
            errors.append(f"{uid}: focusAreas count {len(focus_list)} not 2-6")
        for f in focus_list:
            if f not in VOCAB:
                errors.append(f"{uid}: invalid focus area {f}")
        per_city[slug] = per_city.get(slug, 0) + 1

    for s in sorted(cities - edu_seen):
        errors.append(f"city without education profile: {s}")
    for slug in sorted(edu_seen):
        n = per_city.get(slug, 0)
        if not (3 <= n <= 15):
            errors.append(f"{slug}: {n} universities (must be 3-15)")

    if errors:
        print("FAIL: education validation failed:")
        for e in errors[:60]:
            print("  - " + e)
        if len(errors) > 60:
            print(f"  ... and {len(errors) - 60} more")
        return 1

    print(f"PASS: education ({edu_count} profiles, {uni_count} universities, "
          f"{len(cities)} cities, 3-15 unis/city) — all checks clean.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
