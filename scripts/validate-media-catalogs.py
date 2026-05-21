#!/usr/bin/env python3
"""
Static validation for lib/data/media/city-images.ts and country-images.ts.

Checks:
  - every record has src, alt, sourceUrl, source
  - every verified Wikimedia record has author and a license
  - license is in the allowed prefix set (CC0, CC BY, CC BY-SA, Public domain, PD)
  - source is one of the allowed providers
  - filename does not match the unsuitable-filename token list
  - every placeSlug references a real city / country in lib/data/cities.ts /
    lib/data/countries.ts
  - (placeSlug, imageType) pair is unique (no two heroes for one place;
    no two secondaries of the same kind for one place)

Exit code is non-zero if any check fails. Safe to call as a pre-build
gate or in CI.
"""

from __future__ import annotations

import importlib.util
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HERE = os.path.dirname(os.path.abspath(__file__))

_spec_v = importlib.util.spec_from_file_location(
    "verifier", os.path.join(HERE, "verify-place-images.py")
)
verifier = importlib.util.module_from_spec(_spec_v)
_spec_v.loader.exec_module(verifier)

_spec_b = importlib.util.spec_from_file_location(
    "builder", os.path.join(HERE, "build-place-images.py")
)
builder = importlib.util.module_from_spec(_spec_b)
_spec_b.loader.exec_module(builder)

ALLOWED_SOURCES = {
    "wikimedia",
    "unsplash",
    "pexels",
    "openverse",
    "flickr",
    "mapillary",
}

PLACEHOLDER_TOKENS = (
    "placeholder",
    "lorem",
    "click here",
    "unknown author",
    "unknown license",
    "image here",
    "todo",
    "tbd",
)

RECORD_PATTERN = re.compile(
    r"\{\s*id:\s*\"(?P<id>[^\"]+)\",\s*"
    r"placeSlug:\s*\"(?P<slug>[^\"]+)\",\s*"
    r"placeType:\s*\"(?P<placeType>city|country)\",\s*"
    r"imageType:\s*\"(?P<imageType>[^\"]+)\",\s*"
    r"src:\s*\"(?P<src>[^\"]+)\",\s*"
    r"(?:width:\s*(?P<width>\d+),\s*)?"
    r"(?:height:\s*(?P<height>\d+),\s*)?"
    r"alt:\s*\"(?P<alt>[^\"]*)\",\s*"
    r"(?:caption:\s*\"(?P<caption>[^\"]*)\",\s*)?"
    r"source:\s*\"(?P<source>[^\"]+)\",\s*"
    r"sourceUrl:\s*\"(?P<sourceUrl>[^\"]+)\",\s*"
    r"(?:author:\s*\"(?P<author>[^\"]+)\",\s*)?"
    r"(?:authorUrl:\s*\"(?P<authorUrl>[^\"]+)\",\s*)?"
    r"(?:license:\s*\"(?P<license>[^\"]+)\",\s*)?"
    r"(?:licenseUrl:\s*\"(?P<licenseUrl>[^\"]+)\",\s*)?"
    r"attributionText:\s*\"(?P<attributionText>[^\"]+)\",\s*"
    r"verified:\s*(?P<verified>true|false),\s*"
    r"verifiedAt:\s*\"(?P<verifiedAt>[^\"]+)\"",
    re.DOTALL,
)


def parse_records(path: str) -> list[dict]:
    text = open(path).read()
    return [m.groupdict() for m in RECORD_PATTERN.finditer(text)]


def known_slugs(path: str) -> set[str]:
    text = open(path).read()
    return set(re.findall(r'slug:\s*"([^"]+)"', text))


def has_placeholder(text: str | None) -> bool:
    if not text:
        return False
    lower = text.lower()
    return any(tok in lower for tok in PLACEHOLDER_TOKENS)


def validate(records: list[dict], expected_slugs: set[str], label: str) -> list[str]:
    errors: list[str] = []
    seen_pairs: set[tuple[str, str]] = set()
    for r in records:
        tag = f"{label}/{r['slug']}/{r['imageType']}"
        if not r["src"]:
            errors.append(f"{tag}: missing src")
        elif builder.file_is_unsuitable(r["src"]):
            errors.append(
                f"{tag}: filename matches unsuitable token list ({r['src'].rsplit('/', 1)[-1]})"
            )
        if not r["alt"]:
            errors.append(f"{tag}: missing alt text")
        if r["source"] not in ALLOWED_SOURCES:
            errors.append(f"{tag}: source {r['source']!r} not in allowed set")
        if not r["sourceUrl"]:
            errors.append(f"{tag}: missing sourceUrl")
        if r["source"] == "wikimedia":
            if not r.get("author"):
                errors.append(f"{tag}: wikimedia record missing author")
            if not r.get("license"):
                errors.append(f"{tag}: wikimedia record missing license")
            elif not verifier.license_is_allowed(r["license"]):
                errors.append(
                    f"{tag}: license {r['license']!r} not in allowed prefix set"
                )
        if r["slug"] not in expected_slugs:
            errors.append(
                f"{tag}: placeSlug does not match any entry in lib/data/{label}.ts"
            )
        pair = (r["slug"], r["imageType"])
        if pair in seen_pairs:
            errors.append(f"{tag}: duplicate placeSlug + imageType")
        seen_pairs.add(pair)
        for field in (
            "alt",
            "caption",
            "attributionText",
            "author",
            "license",
            "sourceUrl",
        ):
            if has_placeholder(r.get(field)):
                errors.append(f"{tag}: placeholder-looking text in {field}")
    return errors


def main() -> None:
    city_records = parse_records(os.path.join(ROOT, "lib/data/media/city-images.ts"))
    country_records = parse_records(
        os.path.join(ROOT, "lib/data/media/country-images.ts")
    )
    city_slugs = known_slugs(os.path.join(ROOT, "lib/data/cities.ts"))
    country_slugs = known_slugs(os.path.join(ROOT, "lib/data/countries.ts"))

    errors: list[str] = []
    errors.extend(validate(city_records, city_slugs, "cities"))
    errors.extend(validate(country_records, country_slugs, "countries"))

    n_hero_city = sum(1 for r in city_records if r["imageType"] == "hero")
    n_hero_ctry = sum(1 for r in country_records if r["imageType"] == "hero")

    print(
        f"cities:    {n_hero_city} hero / {len(city_records)} total "
        f"(slugs known: {len(city_slugs)})"
    )
    print(
        f"countries: {n_hero_ctry} hero / {len(country_records)} total "
        f"(slugs known: {len(country_slugs)})"
    )

    if errors:
        print("\nVALIDATION ERRORS:", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        sys.exit(1)
    print("\nAll media catalog records pass static validation.")


if __name__ == "__main__":
    main()
