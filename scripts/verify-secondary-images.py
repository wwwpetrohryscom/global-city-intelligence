#!/usr/bin/env python3
"""
Verify secondary contextual images (one extra image per top place).

Each entry is a (placeType, slug, imageType, landmark-article-title)
tuple. The verifier:

  1. Resolves the Wikipedia article title.
  2. Reads the Wikidata QID.
  3. Fetches the P18 image filename.
  4. Validates Commons license / author / restrictions / filename.

Records are emitted only if:
  - the source file is photographic
  - the license is a permissive CC / public-domain license
  - the author is present
  - the file is NOT the same as the place's existing hero image (no duplicates)
  - the Wikipedia article title resolves to (or close to) the requested title

Output: lib/data/media/secondary-images.generated.json
The build step appends these into city/country catalogs.

Coverage is intentionally limited (max 1 secondary per place) to keep
page payloads small and the data set easy to audit.
"""

from __future__ import annotations

import importlib.util
import json
import os
import sys
import time

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

_spec_l = importlib.util.spec_from_file_location(
    "landmark", os.path.join(HERE, "verify-landmark-fallback.py")
)
landmark = importlib.util.module_from_spec(_spec_l)
_spec_l.loader.exec_module(landmark)


# Secondary image candidates per place. Each list is ordered; the first
# valid candidate wins. The image type is paired with the candidate so
# the recorded `imageType` matches the actual subject.
#
# Tuples: (image_type, wikipedia_article_title)

CITY_SECONDARY: dict[str, list[tuple[str, str]]] = {
    "tokyo": [
        ("landmark", "Tokyo Tower"),
        ("landmark", "Sensō-ji"),
    ],
    "paris": [
        ("landmark", "Notre-Dame de Paris"),
        ("landmark", "Louvre"),
    ],
    "london": [
        ("landmark", "Tower Bridge"),
        ("landmark", "Big Ben"),
    ],
    "new-york": [
        ("skyline", "Manhattan"),
        ("landmark", "Brooklyn Bridge"),
    ],
    "berlin": [
        ("landmark", "Brandenburg Gate"),
        ("landmark", "Reichstag building"),
    ],
    "singapore": [
        ("landmark", "Marina Bay Sands"),
        ("landmark", "Gardens by the Bay"),
    ],
    "sydney": [
        ("landmark", "Sydney Opera House"),
        ("landmark", "Sydney Harbour Bridge"),
    ],
    "toronto": [
        ("landmark", "CN Tower"),
        ("landmark", "Casa Loma"),
    ],
    "vienna": [
        ("landmark", "Schönbrunn Palace"),
        ("landmark", "St. Stephen's Cathedral, Vienna"),
    ],
    "rome": [
        ("landmark", "Pantheon, Rome"),
        ("landmark", "Trevi Fountain"),
    ],
    "milan": [
        ("landmark", "Milan Cathedral"),
        ("architecture", "Galleria Vittorio Emanuele II"),
    ],
    "barcelona": [
        ("landmark", "Park Güell"),
        ("architecture", "Casa Batlló"),
    ],
    "madrid": [
        ("landmark", "Royal Palace of Madrid"),
        ("landmark", "Puerta de Alcalá"),
    ],
    "prague": [
        ("landmark", "Charles Bridge"),
        ("landmark", "Prague Castle"),
    ],
    "warsaw": [
        ("landmark", "Palace of Culture and Science"),
        ("architecture", "Wilanów Palace"),
    ],
    "zurich": [
        ("landmark", "Grossmünster"),
        ("landmark", "Lake Zurich"),
    ],
    "copenhagen": [
        ("landmark", "Nyhavn"),
        ("landmark", "Tivoli Gardens"),
    ],
    "amsterdam": [
        ("landmark", "Anne Frank House"),
        ("architecture", "Royal Palace of Amsterdam"),
    ],
    "stockholm": [
        ("landmark", "Stockholm City Hall"),
        ("landmark", "Vasa Museum"),
    ],
    "lisbon": [
        ("landmark", "Belém Tower"),
        ("landmark", "Jerónimos Monastery"),
    ],
    "san-francisco": [
        ("landmark", "Golden Gate Bridge"),
        ("landmark", "Alcatraz Island"),
    ],
    "los-angeles": [
        ("landmark", "Griffith Observatory"),
        ("landmark", "Walt Disney Concert Hall"),
    ],
    "chicago": [
        ("landmark", "Navy Pier"),
        ("architecture", "Tribune Tower"),
    ],
    "seattle": [
        ("landmark", "Space Needle"),
        ("landmark", "Pike Place Market"),
    ],
    "vancouver": [
        ("landmark", "Stanley Park"),
        ("landmark", "Capilano Suspension Bridge"),
    ],
    "melbourne": [
        ("landmark", "Royal Exhibition Building"),
        ("landmark", "Flinders Street railway station"),
    ],
    "auckland": [
        ("landmark", "Sky Tower (Auckland)"),
        ("landmark", "Auckland Harbour Bridge"),
    ],
    "hong-kong": [
        ("skyline", "Victoria Harbour"),
        ("landmark", "Peak Tram"),
    ],
    "seoul": [
        ("landmark", "Gyeongbokgung"),
        ("landmark", "N Seoul Tower"),
    ],
    "dubai": [
        ("landmark", "Burj Khalifa"),
        ("landmark", "Palm Jumeirah"),
    ],
    "bangkok": [
        ("landmark", "Wat Arun"),
        ("landmark", "Grand Palace"),
    ],
    "mumbai": [
        ("landmark", "Gateway of India"),
        ("landmark", "Chhatrapati Shivaji Maharaj Terminus"),
    ],
    "delhi": [
        ("landmark", "Lotus Temple"),
        ("landmark", "Red Fort"),
    ],
    "istanbul": [
        ("landmark", "Hagia Sophia"),
        ("landmark", "Sultan Ahmed Mosque"),
    ],
    "cape-town": [
        ("landscape", "Table Mountain"),
        ("landmark", "Cape Point"),
    ],
}

COUNTRY_SECONDARY: dict[str, list[tuple[str, str]]] = {
    "france": [
        ("landmark", "Mont-Saint-Michel"),
        ("landmark", "Palace of Versailles"),
    ],
    "japan": [
        ("landscape", "Mount Fuji"),
        ("landmark", "Fushimi Inari-taisha"),
    ],
    "united-kingdom": [
        ("landmark", "Stonehenge"),
        ("landscape", "Lake District"),
    ],
    "germany": [
        ("landmark", "Neuschwanstein Castle"),
        ("landmark", "Cologne Cathedral"),
    ],
    "italy": [
        ("landscape", "Amalfi Coast"),
        ("landscape", "Mount Etna"),
    ],
    "spain": [
        ("landmark", "Sagrada Família"),
        ("architecture", "Plaza de España, Seville"),
    ],
    "netherlands": [
        ("landscape", "Keukenhof"),
        ("landmark", "Kinderdijk"),
    ],
    "switzerland": [
        ("landscape", "Jungfrau"),
        ("landscape", "Lake Geneva"),
    ],
    "austria": [
        ("landmark", "Schönbrunn Palace"),
        ("landscape", "Grossglockner"),
    ],
    "norway": [
        ("landscape", "Preikestolen"),
        ("landscape", "Lofoten"),
    ],
    "sweden": [
        ("landmark", "Vasa Museum"),
        ("landscape", "Abisko National Park"),
    ],
    "denmark": [
        ("landmark", "Kronborg"),
        ("landmark", "Frederiksborg Castle"),
    ],
    "portugal": [
        ("landmark", "Pena Palace"),
        ("landmark", "Belém Tower"),
    ],
    "greece": [
        ("landmark", "Acropolis of Athens"),
        ("landscape", "Santorini"),
    ],
    "united-states": [
        ("landmark", "Statue of Liberty"),
        ("landscape", "Yosemite Valley"),
    ],
    "canada": [
        ("landscape", "Banff National Park"),
        ("landmark", "Niagara Falls"),
    ],
    "australia": [
        ("landscape", "Uluru"),
        ("landscape", "Great Barrier Reef"),
    ],
    "new-zealand": [
        ("landscape", "Milford Sound"),
        ("landscape", "Tongariro National Park"),
    ],
    "brazil": [
        ("landmark", "Christ the Redeemer (statue)"),
        ("landscape", "Sugarloaf Mountain"),
    ],
    "mexico": [
        ("landmark", "Teotihuacan"),
        ("landmark", "Palacio de Bellas Artes"),
    ],
}


def existing_image_files(records: list[dict], slug: str) -> set[str]:
    """Filenames already used for this place — avoid duplicates."""
    files: set[str] = set()
    for r in records:
        if r["placeSlug"] == slug:
            files.add(r["src"].rsplit("/", 1)[-1])
    return files


def candidate_record(
    place_type: str,
    slug: str,
    place_name: str,
    country: str,
    image_type: str,
    landmark_title: str,
    already_used_files: set[str],
) -> dict | None:
    resolved_title = verifier.resolve_wikipedia_title(landmark_title, None, None)
    if not landmark.title_matches(landmark_title, resolved_title):
        return None
    time.sleep(0.1)
    qid = verifier.get_wikidata_qid(resolved_title)
    if not qid:
        return None
    time.sleep(0.1)
    filename = verifier.get_p18_filename(qid)
    if not filename:
        return None
    if builder.file_is_unsuitable(filename):
        return None
    if filename in already_used_files:
        return None  # would duplicate the place's hero or another secondary
    time.sleep(0.1)
    meta = verifier.get_commons_metadata(filename)
    if not meta:
        return None
    if not meta["thumb_url"]:
        return None
    if not verifier.license_is_allowed(meta["license"]):
        return None
    if meta.get("restrictions"):
        return None
    artist = meta.get("artist") or ""
    if not artist:
        return None
    if "unknown author" in artist.lower():
        # Commons sometimes records "Unknown author" as the artist string
        # itself — reject so we don't render a placeholder-looking credit.
        return None

    # Also reject if Commons thumb is the same as an existing one.
    if meta["thumb_url"].rsplit("/", 1)[-1] in already_used_files:
        return None

    landmark_label = resolved_title
    if place_type == "city" and country:
        alt = f"{landmark_label} in {place_name}, {country}"
    elif place_type == "country":
        alt = f"{landmark_label} in {place_name}"
    else:
        alt = landmark_label

    record = {
        "id": f"{place_type}-{slug}-{image_type}",
        "placeSlug": slug,
        "placeType": place_type,
        "imageType": image_type,
        "src": meta["thumb_url"],
        "width": meta["thumb_width"],
        "height": meta["thumb_height"],
        "alt": alt,
        "caption": landmark_label,
        "source": "wikimedia",
        "sourceUrl": meta["page_url"],
        "author": meta["artist"],
        "license": meta["license"],
        "licenseUrl": meta["license_url"],
        "attributionText": f"{meta['artist']} / Wikimedia Commons, {meta['license']}",
        "verified": True,
        "verifiedAt": "2026-05-21",
        "notes": (
            f"Secondary {image_type} image. Resolved via article "
            f"{resolved_title!r} → Wikidata {qid} → Commons file '{filename}'."
        ),
    }
    if meta.get("author_url"):
        record["authorUrl"] = meta["author_url"]
    return record


def main() -> None:
    media_dir = os.path.join(ROOT, "lib", "data", "media")
    with open(os.path.join(media_dir, "city-images.generated.json")) as f:
        city_records = json.load(f)
    with open(os.path.join(media_dir, "country-images.generated.json")) as f:
        country_records = json.load(f)

    secondary_records: list[dict] = []

    for slug, candidates in CITY_SECONDARY.items():
        name, country = landmark.lookup_city_meta(slug)
        used = existing_image_files(city_records, slug)
        used.update(existing_image_files(secondary_records, slug))
        for image_type, title in candidates:
            try:
                record = candidate_record(
                    "city", slug, name, country, image_type, title, used
                )
            except Exception as exc:
                record = None
                print(f"  [city/{slug}] {title!r}: error {exc}", file=sys.stderr)
            if record:
                secondary_records.append(record)
                print(
                    f"  [city/{slug}] {title!r}: ok "
                    f"({image_type}, {record['author']} / {record['license']})",
                    file=sys.stderr,
                )
                break
            else:
                print(f"  [city/{slug}] {title!r}: skip", file=sys.stderr)
            time.sleep(0.1)

    for slug, candidates in COUNTRY_SECONDARY.items():
        name = landmark.lookup_country_meta(slug)
        used = existing_image_files(country_records, slug)
        used.update(existing_image_files(secondary_records, slug))
        for image_type, title in candidates:
            try:
                record = candidate_record(
                    "country", slug, name, "", image_type, title, used
                )
            except Exception as exc:
                record = None
                print(
                    f"  [country/{slug}] {title!r}: error {exc}", file=sys.stderr
                )
            if record:
                secondary_records.append(record)
                print(
                    f"  [country/{slug}] {title!r}: ok "
                    f"({image_type}, {record['author']} / {record['license']})",
                    file=sys.stderr,
                )
                break
            else:
                print(f"  [country/{slug}] {title!r}: skip", file=sys.stderr)
            time.sleep(0.1)

    out_path = os.path.join(media_dir, "secondary-images.generated.json")
    with open(out_path, "w") as f:
        json.dump(secondary_records, f, indent=2)
    print(
        f"\nWrote {len(secondary_records)} secondary records to "
        f"{os.path.relpath(out_path, ROOT)}",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
