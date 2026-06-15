#!/usr/bin/env python3
"""Validate the Economy & Jobs layer in lib/data/economy.ts against the city
dataset in lib/data/cities.ts. Mirrors the runtime guard `assertEconomyIntegrity`
(which fails `next build`):

  - 1119 economy profiles + 1119 jobs profiles exist (100% city coverage)
  - citySlug values unique, resolve to a real city, and have economy/jobs parity
  - all economy scores (8) and jobs scores (9) present and in 0-100
  - dominantIndustries: 3-6 valid non-empty strings from the industry vocabulary
  - economyCategory in the valid 8-value set
  - all 4 economy summaries present and non-empty
  - createdAt / updatedAt present on both

Non-zero exit on failure.
"""
from __future__ import annotations
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "lib/data/economy.ts"
CITIES = ROOT / "lib/data/cities.ts"

ECON_SCORES = ["economyScore", "employmentScore", "salaryScore", "startupScore",
               "businessEnvironmentScore", "remoteWorkScore", "innovationScore",
               "affordabilityAdjustedIncomeScore"]
ECON_SUMMARIES = ["economySummary", "jobsSummary", "remoteWorkSummary", "startupSummary"]
JOBS_SCORES = ["jobMarketScore", "technologyJobsScore", "healthcareJobsScore",
               "financeJobsScore", "manufacturingJobsScore", "tourismJobsScore",
               "educationJobsScore", "remoteWorkAvailabilityScore",
               "overallCareerOpportunityScore"]
VALID_CATEGORIES = {"global_hub", "major_economy", "regional_center", "industrial_city",
                    "tourism_economy", "government_center", "education_research", "mixed"}
VOCAB = {"Technology", "Software", "Finance", "Banking", "Insurance", "Healthcare",
         "Biotech", "Manufacturing", "Automotive", "Aerospace", "Tourism", "Hospitality",
         "Education", "Research", "Government", "Logistics", "Maritime", "Energy",
         "Mining", "Agriculture", "Creative Industries", "Telecommunications"}


def city_slugs() -> set[str]:
    return set(re.findall(r'^\s+slug: "([a-z0-9][a-z0-9-]*)",', CITIES.read_text(), re.M))


def split_blocks(text: str):
    starts = [m.start() for m in re.finditer(r'\n  \{\n    citySlug: "[a-z0-9-]+",', text)]
    starts.append(len(text))
    for i in range(len(starts) - 1):
        yield text[starts[i]:starts[i + 1]]


def main() -> int:
    errors: list[str] = []
    cities = city_slugs()
    text = DATA.read_text()

    # economy array and jobs array are two separate `export const ... = [ ... ];`
    try:
        econ_text = text.split("export const economyProfiles")[1].split("export const jobsProfiles")[0]
        jobs_text = text.split("export const jobsProfiles")[1].split("const economyBySlug")[0]
    except IndexError:
        print("FAIL: could not locate economyProfiles / jobsProfiles arrays")
        return 1

    econ_seen: set[str] = set()
    econ_count = 0
    for block in split_blocks(econ_text):
        sm = re.search(r'citySlug: "([a-z0-9-]+)"', block)
        if not sm:
            continue
        slug = sm.group(1)
        econ_count += 1
        if slug in econ_seen:
            errors.append(f"duplicate economy citySlug: {slug}")
        econ_seen.add(slug)
        if slug not in cities:
            errors.append(f"{slug}: economy profile for non-existent city")
        for k in ECON_SCORES:
            mm = re.search(rf'\b{k}: (-?\d+)', block)
            if not mm:
                errors.append(f"{slug}: missing {k}")
            elif not (0 <= int(mm.group(1)) <= 100):
                errors.append(f"{slug}: {k} out of range ({mm.group(1)})")
        im = re.search(r'dominantIndustries: \[([^\]]*)\]', block)
        if not im:
            errors.append(f"{slug}: missing dominantIndustries")
        else:
            inds = re.findall(r'"([^"]+)"', im.group(1))
            if not (3 <= len(inds) <= 6):
                errors.append(f"{slug}: dominantIndustries count {len(inds)} not 3-6")
            for ind in inds:
                if ind not in VOCAB:
                    errors.append(f"{slug}: invalid industry {ind}")
        cm = re.search(r'economyCategory: "([a-z_]+)"', block)
        if not cm or cm.group(1) not in VALID_CATEGORIES:
            errors.append(f"{slug}: invalid/missing economyCategory")
        for k in ECON_SUMMARIES:
            sm2 = re.search(rf'{k}: "([^"]*)"', block)
            if not sm2 or len(sm2.group(1).strip()) == 0:
                errors.append(f"{slug}: missing/empty {k}")
        for k in ("createdAt", "updatedAt"):
            if not re.search(rf'{k}: "\d{{4}}-\d{{2}}-\d{{2}}"', block):
                errors.append(f"{slug}: missing {k}")

    jobs_seen: set[str] = set()
    jobs_count = 0
    for m in re.finditer(r'\{ citySlug: "([a-z0-9-]+)",([^}]*)\}', jobs_text):
        slug, body = m.group(1), m.group(2)
        jobs_count += 1
        if slug in jobs_seen:
            errors.append(f"duplicate jobs citySlug: {slug}")
        jobs_seen.add(slug)
        if slug not in cities:
            errors.append(f"{slug}: jobs profile for non-existent city")
        for k in JOBS_SCORES:
            mm = re.search(rf'\b{k}: (-?\d+)', body)
            if not mm:
                errors.append(f"{slug}: missing {k}")
            elif not (0 <= int(mm.group(1)) <= 100):
                errors.append(f"{slug}: {k} out of range ({mm.group(1)})")

    for s in sorted(cities - econ_seen):
        errors.append(f"city without economy profile: {s}")
    for s in sorted(cities - jobs_seen):
        errors.append(f"city without jobs profile: {s}")
    for s in sorted(econ_seen ^ jobs_seen):
        errors.append(f"economy/jobs parity mismatch: {s}")

    if errors:
        print("FAIL: economy validation failed:")
        for e in errors[:60]:
            print("  - " + e)
        if len(errors) > 60:
            print(f"  ... and {len(errors) - 60} more")
        return 1

    print(f"PASS: economy ({econ_count} economy + {jobs_count} jobs profiles, "
          f"{len(cities)} cities, 8+9 scores, 4 summaries each) — all checks clean.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
