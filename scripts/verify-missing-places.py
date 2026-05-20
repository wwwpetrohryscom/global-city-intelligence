#!/usr/bin/env python3
"""Re-verify only the places currently missing from city-images.ts / country-images.ts.

Merges new records into the existing .generated.json files so the next
build-place-images.py run picks them up.
"""

from __future__ import annotations

import importlib.util
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

_spec = importlib.util.spec_from_file_location(
    "verifier",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "verify-place-images.py"),
)
verifier = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(verifier)


def load_slugs(path: str) -> set[str]:
    text = open(path).read()
    return set(re.findall(r'placeSlug:\s*"([^"]+)"', text))


def main():
    cities = verifier.extract_cities()
    countries = verifier.extract_countries()
    covered_cities = load_slugs(os.path.join(ROOT, "lib/data/media/city-images.ts"))
    covered_countries = load_slugs(
        os.path.join(ROOT, "lib/data/media/country-images.ts")
    )

    media_dir = os.path.join(ROOT, "lib/data/media")
    with open(os.path.join(media_dir, "city-images.generated.json")) as f:
        city_records = json.load(f)
    with open(os.path.join(media_dir, "country-images.generated.json")) as f:
        country_records = json.load(f)

    existing_city_slugs = {r["placeSlug"] for r in city_records}
    existing_country_slugs = {r["placeSlug"] for r in country_records}

    new_city = 0
    for slug, name, country in cities:
        if slug in covered_cities or slug in existing_city_slugs:
            continue
        print(f"[city] {slug} ({name})", file=sys.stderr, flush=True)
        try:
            record = verifier.verify_place("city", slug, name, country)
        except Exception as exc:
            print(f"  error: {exc}", file=sys.stderr)
            record = None
        if record:
            city_records.append(record)
            new_city += 1
            print(
                f"  ok: {record['author']} / {record['license']}",
                file=sys.stderr,
            )

    new_country = 0
    for slug, name in countries:
        if slug in covered_countries or slug in existing_country_slugs:
            continue
        print(f"[country] {slug} ({name})", file=sys.stderr, flush=True)
        try:
            record = verifier.verify_place("country", slug, name, None)
        except Exception as exc:
            print(f"  error: {exc}", file=sys.stderr)
            record = None
        if record:
            country_records.append(record)
            new_country += 1
            print(
                f"  ok: {record['author']} / {record['license']}",
                file=sys.stderr,
            )

    with open(os.path.join(media_dir, "city-images.generated.json"), "w") as f:
        json.dump(city_records, f, indent=2)
    with open(os.path.join(media_dir, "country-images.generated.json"), "w") as f:
        json.dump(country_records, f, indent=2)

    print(f"\nAdded {new_city} new city records, {new_country} new country records")


if __name__ == "__main__":
    main()
