#!/usr/bin/env python3
"""
Diagnose why missing cities/countries failed verify-place-images.py.

For each slug, prints:
  - resolved Wikipedia title
  - Wikidata QID
  - P18 filename returned
  - whether the BAD_FILE_TOKENS filter would reject it
  - license / author / restrictions (when fetched from Commons)

Use this to find which records need manually-chosen alternate files.
"""

from __future__ import annotations

import importlib.util
import os
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


MISSING_CITIES = [
    "amsterdam",
    "chicago",
    "shanghai",
    "jakarta",
    "osaka",
    "delhi",
    "istanbul",
    "wellington",
    "busan",
    "dar-es-salaam",
]

MISSING_COUNTRIES = [
    "denmark",
    "united-states",
    "spain",
    "switzerland",
    "austria",
    "mexico",
    "kenya",
    "italy",
    "czechia",
    "colombia",
    "malaysia",
    "indonesia",
    "philippines",
    "india",
    "sweden",
    "norway",
    "finland",
    "ethiopia",
    "uruguay",
    "panama",
    "serbia",
    "estonia",
    "lithuania",
    "costa-rica",
    "dominican-republic",
    "kuwait",
    "senegal",
    "tanzania",
    "uganda",
]


def lookup_city_name(slug: str) -> tuple[str, str]:
    for s, name, country in verifier.extract_cities():
        if s == slug:
            return name, country
    return slug, ""


def lookup_country_name(slug: str) -> str:
    for s, name in verifier.extract_countries():
        if s == slug:
            return name
    return slug


def diagnose(place_type: str, slug: str, name: str, country: str = "") -> None:
    title = verifier.resolve_wikipedia_title(name, country or None, slug)
    qid = verifier.get_wikidata_qid(title) if title else None
    fname = verifier.get_p18_filename(qid) if qid else None
    rejected_by_filter = builder.file_is_unsuitable(fname) if fname else False
    meta = verifier.get_commons_metadata(fname) if fname else None
    lic = meta.get("license") if meta else None
    artist = meta.get("artist") if meta else None
    license_ok = verifier.license_is_allowed(lic) if lic else False

    print(
        f"[{place_type}/{slug}]"
        f" title={title!r}"
        f" qid={qid}"
        f" file={fname!r}"
        f" filter_rejects={rejected_by_filter}"
        f" license={lic!r}"
        f" license_ok={license_ok}"
        f" artist={artist!r}"
    )


def main() -> None:
    for slug in MISSING_CITIES:
        name, country = lookup_city_name(slug)
        diagnose("city", slug, name, country)
    for slug in MISSING_COUNTRIES:
        name = lookup_country_name(slug)
        diagnose("country", slug, name)


if __name__ == "__main__":
    main()
