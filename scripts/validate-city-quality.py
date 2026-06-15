#!/usr/bin/env python3
"""Validate the Safety & Quality-of-Life layer in lib/data/city-quality.ts
against the city dataset in lib/data/cities.ts. Mirrors the runtime guard
`assertCityQualityIntegrity` (which fails `next build`):

  - 100% city coverage: every city has exactly one profile, no city missing
  - citySlug values unique and resolve to a real city
  - all 18 scores present and in 0-100
  - all 5 summaries present and non-empty
  - createdAt / updatedAt present
  - no duplicate profiles, no extra (orphan) profiles

Non-zero exit on failure.
"""
from __future__ import annotations
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "lib/data/city-quality.ts"
CITIES = ROOT / "lib/data/cities.ts"

SAFETY = ["crimeScore", "personalSafetyScore", "nightSafetyScore", "roadSafetyScore", "overallSafetyScore"]
QUALITY = ["qualityOfLifeScore", "healthcareScore", "educationScore", "greenSpaceScore",
           "cleanlinessScore", "infrastructureScore", "mobilityScore"]
LIFESTYLE = ["familyFriendlyScore", "digitalNomadScore", "retirementScore",
             "walkabilityScore", "cyclingScore", "outdoorLifestyleScore"]
SUMMARIES = ["safetySummary", "qualitySummary", "familySummary", "nomadSummary", "retirementSummary"]


def city_slugs() -> set[str]:
    src = CITIES.read_text()
    return set(re.findall(r'^\s+slug: "([a-z0-9][a-z0-9-]*)",', src, re.M))


def scores_in(group_text: str, keys: list[str], slug: str, errors: list[str]) -> None:
    for k in keys:
        m = re.search(rf'\b{k}: (-?\d+)', group_text)
        if not m:
            errors.append(f"{slug}: missing {k}")
        else:
            v = int(m.group(1))
            if not (0 <= v <= 100):
                errors.append(f"{slug}: {k} out of range ({v})")


def main() -> int:
    errors: list[str] = []
    cities = city_slugs()
    text = DATA.read_text()

    starts = [m.start() for m in re.finditer(r'\n    citySlug: "[a-z0-9-]+"', text)]
    if not starts:
        print("FAIL: no city-quality profiles parsed")
        return 1
    starts.append(len(text))
    seen: set[str] = set()
    count = 0
    for i in range(len(starts) - 1):
        block = text[starts[i]:starts[i + 1]]
        sm = re.search(r'citySlug: "([a-z0-9-]+)"', block)
        if not sm:
            continue
        slug = sm.group(1)
        count += 1
        if slug in seen:
            errors.append(f"duplicate citySlug: {slug}")
        seen.add(slug)
        if slug not in cities:
            errors.append(f"{slug}: profile for non-existent city")

        sg = re.search(r'safety: \{([^}]*)\}', block)
        qg = re.search(r'quality: \{([^}]*)\}', block)
        lg = re.search(r'lifestyle: \{([^}]*)\}', block)
        if not (sg and qg and lg):
            errors.append(f"{slug}: missing a profile group (safety/quality/lifestyle)")
        else:
            scores_in(sg.group(1), SAFETY, slug, errors)
            scores_in(qg.group(1), QUALITY, slug, errors)
            scores_in(lg.group(1), LIFESTYLE, slug, errors)

        for k in SUMMARIES:
            sm2 = re.search(rf'{k}: "([^"]*)"', block)
            if not sm2 or len(sm2.group(1).strip()) == 0:
                errors.append(f"{slug}: missing/empty {k}")

        for k in ("createdAt", "updatedAt"):
            if not re.search(rf'{k}: "\d{{4}}-\d{{2}}-\d{{2}}"', block):
                errors.append(f"{slug}: missing {k}")

    for s in sorted(cities - seen):
        errors.append(f"city without quality profile: {s}")

    if errors:
        print("FAIL: city-quality validation failed:")
        for e in errors[:60]:
            print("  - " + e)
        if len(errors) > 60:
            print(f"  ... and {len(errors) - 60} more")
        return 1

    print(f"PASS: city-quality ({count} profiles, {len(cities)} cities, "
          f"18 scores + 5 summaries each) — all checks clean.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
