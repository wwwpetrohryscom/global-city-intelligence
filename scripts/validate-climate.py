#!/usr/bin/env python3
"""
Validate the Climate layer in lib/data/climate.ts against the city dataset in
lib/data/cities.ts:

  - every city has exactly one climate profile
  - citySlug values are unique and resolve to a real city
  - exactly 12 months per profile
  - valid temperature ranges (avgHighC >= avgLowC)
  - valid precipitation values (precipitationMm >= 0, 0 <= rainyDays <= 31)
  - valid sunshine values (sunshineHours >= 0)
  - comfortScore in 0-100
  - climateZone present

Mirrors the runtime guard (which fails `next build`). Non-zero exit on failure.
"""
from __future__ import annotations
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CLIMATE = ROOT / "lib/data/climate.ts"
CITIES = ROOT / "lib/data/cities.ts"


def city_slugs() -> set[str]:
    src = CITIES.read_text()
    return set(re.findall(
        r'slug:\s*"([a-z0-9][a-z0-9-]*)",\s*\n\s*name:\s*"[^"]+",\s*\n\s*countrySlug:',
        src,
    ))


def main() -> int:
    errors: list[str] = []
    cities = city_slugs()
    text = CLIMATE.read_text()

    # split into profile windows keyed on citySlug
    starts = [m.start() for m in re.finditer(r'\n    citySlug:\s*"[a-z0-9-]+"', text)]
    if not starts:
        print("FAIL: no climate profiles parsed")
        return 1
    starts.append(len(text))
    seen: set[str] = set()
    count = 0
    zones: set[str] = set()
    for i in range(len(starts) - 1):
        block = text[starts[i]:starts[i + 1]]
        sm = re.search(r'citySlug:\s*"([a-z0-9-]+)"', block)
        if not sm:
            continue
        slug = sm.group(1)
        count += 1
        if slug in seen:
            errors.append(f"duplicate citySlug: {slug}")
        seen.add(slug)
        if slug not in cities:
            errors.append(f"{slug}: profile for non-existent city")
        zm = re.search(r'climateZone:\s*"([^"]*)"', block)
        if not zm or not zm.group(1):
            errors.append(f"{slug}: missing climateZone")
        else:
            zones.add(zm.group(1))
        cs = re.search(r'comfortScore:\s*(-?\d+)', block)
        if not cs:
            errors.append(f"{slug}: missing comfortScore")
        elif not (0 <= int(cs.group(1)) <= 100):
            errors.append(f"{slug}: comfortScore out of range ({cs.group(1)})")
        months = re.findall(
            r'\{\s*month:\s*"([A-Za-z]+)",\s*avgHighC:\s*(-?[0-9.]+),\s*avgLowC:\s*(-?[0-9.]+),'
            r'\s*precipitationMm:\s*(-?[0-9.]+),\s*rainyDays:\s*(-?[0-9.]+),\s*sunshineHours:\s*(-?[0-9.]+)\s*\}',
            block,
        )
        if len(months) != 12:
            errors.append(f"{slug}: expected 12 months, found {len(months)}")
        for mo, hi, lo, pr, rd, su in months:
            hi, lo, pr, rd, su = float(hi), float(lo), float(pr), float(rd), float(su)
            if hi < lo:
                errors.append(f"{slug}/{mo}: avgHighC < avgLowC ({hi} < {lo})")
            if pr < 0:
                errors.append(f"{slug}/{mo}: negative precipitation ({pr})")
            if not (0 <= rd <= 31):
                errors.append(f"{slug}/{mo}: rainyDays out of range ({rd})")
            if su < 0:
                errors.append(f"{slug}/{mo}: negative sunshine ({su})")

    for s in sorted(cities - seen):
        errors.append(f"city without climate profile: {s}")

    if errors:
        print("FAIL: climate validation failed:")
        for e in errors[:60]:
            print("  - " + e)
        if len(errors) > 60:
            print(f"  ... and {len(errors) - 60} more")
        return 1

    print(f"PASS: climate ({count} profiles, {len(cities)} cities, "
          f"{len(zones)} zones) — all checks clean.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
