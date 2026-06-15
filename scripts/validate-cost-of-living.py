#!/usr/bin/env python3
"""
Validate the Cost of Living layer in lib/data/cost-of-living.ts against the
city dataset in lib/data/cities.ts:

  - every city has exactly one cost-of-living profile
  - citySlug values are unique
  - no profile for a non-existent city
  - all required numeric fields present, finite, and positive
  - monthly: couple > single, family > couple
  - rent: threeBedroom > oneBedroom > studio
  - affordabilityScore in 0-100
  - localCurrency present and non-empty
  - createdAt / updatedAt present

Mirrors the runtime guard (which fails `next build`). Non-zero exit on failure.
"""
from __future__ import annotations
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COL = ROOT / "lib/data/cost-of-living.ts"
CITIES = ROOT / "lib/data/cities.ts"

NUM_FIELDS = [
    "monthlyCostSingle", "monthlyCostCouple", "monthlyCostFamily",
    "rentStudio", "rentOneBedroom", "rentThreeBedroom",
    "mealRestaurant", "coffee", "publicTransportPass",
]


def city_slugs() -> set[str]:
    src = CITIES.read_text()
    # city-level slugs only (followed by name + countrySlug), not relatedCitySlugs
    return set(re.findall(
        r'slug:\s*"([a-z0-9][a-z0-9-]*)",\s*\n\s*name:\s*"[^"]+",\s*\n\s*countrySlug:',
        src,
    ))


def parse_profiles(text: str) -> list[dict]:
    profiles = []
    # each profile object lives on one line beginning with `{ citySlug:`
    for m in re.finditer(r'\{\s*citySlug:\s*"([a-z0-9-]+)"(.*?)\}', text):
        slug, body = m.group(1), m.group(2)
        rec = {"citySlug": slug}
        for f in NUM_FIELDS + ["affordabilityScore"]:
            nm = re.search(f + r":\s*(-?[0-9.]+)", body)
            rec[f] = float(nm.group(1)) if nm else None
        cm = re.search(r'localCurrency:\s*"([^"]*)"', body)
        rec["localCurrency"] = cm.group(1) if cm else None
        rec["createdAt"] = bool(re.search(r'createdAt:\s*"[^"]+"', body))
        rec["updatedAt"] = bool(re.search(r'updatedAt:\s*"[^"]+"', body))
        profiles.append(rec)
    return profiles


def main() -> int:
    errors: list[str] = []
    cities = city_slugs()
    profiles = parse_profiles(COL.read_text())
    if not profiles:
        print("FAIL: no cost-of-living profiles parsed")
        return 1

    seen: set[str] = set()
    for p in profiles:
        s = p["citySlug"]
        if s in seen:
            errors.append(f"duplicate citySlug: {s}")
        seen.add(s)
        if s not in cities:
            errors.append(f"{s}: profile for non-existent city")
        for f in NUM_FIELDS + ["affordabilityScore"]:
            v = p[f]
            if v is None:
                errors.append(f"{s}: missing field {f}")
            elif f in NUM_FIELDS and not (v > 0):
                errors.append(f"{s}: {f} not positive ({v})")
        if p["affordabilityScore"] is not None and not (0 <= p["affordabilityScore"] <= 100):
            errors.append(f"{s}: affordabilityScore out of range ({p['affordabilityScore']})")
        if not p["localCurrency"]:
            errors.append(f"{s}: missing localCurrency")
        if not p["createdAt"] or not p["updatedAt"]:
            errors.append(f"{s}: missing createdAt/updatedAt")
        # ordering consistency
        if all(p[k] is not None for k in ("monthlyCostSingle", "monthlyCostCouple", "monthlyCostFamily")):
            if not (p["monthlyCostCouple"] > p["monthlyCostSingle"] < p["monthlyCostFamily"] and p["monthlyCostFamily"] > p["monthlyCostCouple"]):
                errors.append(f"{s}: monthly cost ordering invalid")
        if all(p[k] is not None for k in ("rentStudio", "rentOneBedroom", "rentThreeBedroom")):
            if not (p["rentStudio"] < p["rentOneBedroom"] < p["rentThreeBedroom"]):
                errors.append(f"{s}: rent ordering invalid")

    missing = cities - seen
    for s in sorted(missing):
        errors.append(f"city without cost-of-living profile: {s}")

    if errors:
        print("FAIL: cost-of-living validation failed:")
        for e in errors[:60]:
            print("  - " + e)
        if len(errors) > 60:
            print(f"  ... and {len(errors) - 60} more")
        return 1

    print(f"PASS: cost-of-living ({len(profiles)} profiles, {len(cities)} cities, "
          f"{len({p['localCurrency'] for p in profiles})} currencies) — all checks clean.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
