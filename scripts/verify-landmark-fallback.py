#!/usr/bin/env python3
"""
Hero-image fallback verifier for places whose Wikidata P18 is a montage,
flag, dictionary cover, location map, or otherwise unusable.

Instead of resolving the place itself, this script resolves a curated
list of landmark / landscape Wikipedia article titles that represent
each place. For each candidate landmark it:

  1. Resolves the Wikipedia article title via the search API.
  2. Reads the Wikidata QID from page-props.
  3. Fetches the P18 image from Wikidata.
  4. Validates the Commons file through the same license / author /
     restrictions / filename pipeline as verify-place-images.py.

The first landmark that passes ALL checks AND whose Wikipedia title
matches the requested landmark name wins. Records are merged into the
existing city-images.generated.json / country-images.generated.json
files. Re-run scripts/build-place-images.py after this script to emit
the final TypeScript catalogs.

Every record produced here is fully attributed and license-checked
against live Commons metadata — nothing is invented.
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


# Curated landmark / landscape Wikipedia article titles per place.
# Each entry is a list of candidate titles tried in order. The first
# one whose live Wikidata P18 image passes every verifier check wins.
#
# Landmark choice rules:
#   - clearly represents the place
#   - landscape, architecture, or skyline subject (no people-centric shots)
#   - not a flag, emblem, montage, or generic location map
#
# License, author, source URL, filename, and Commons restrictions are
# all verified live against Wikimedia Commons. Nothing is hard-coded
# beyond the search term — the rest of the record (image src, author,
# license, etc.) comes from live API responses.

CITY_LANDMARKS: dict[str, list[str]] = {
    "amsterdam": [
        "Rijksmuseum",
        "Magere Brug",
        "Concertgebouw",
    ],
    "chicago": [
        "Cloud Gate",
        "Willis Tower",
        "Wrigley Building",
    ],
    "shanghai": [
        "Oriental Pearl Tower",
        "Shanghai Tower",
        "The Bund",
    ],
    "jakarta": [
        "National Monument (Indonesia)",
        "Istiqlal Mosque, Jakarta",
    ],
    "osaka": [
        "Osaka Castle",
        "Umeda Sky Building",
    ],
    "delhi": [
        "Humayun's Tomb",
        "Lotus Temple",
        "Qutb Minar",
    ],
    "istanbul": [
        "Sultan Ahmed Mosque",
        "Bosphorus Bridge",
        "Galata Tower",
    ],
    "wellington": [
        "Beehive (New Zealand)",
        "Wellington railway station",
    ],
    "busan": [
        "Gwangan Bridge",
        "Haeundae Beach",
        "Busan Tower",
        "Beomeosa",
    ],
    "dar-es-salaam": [
        "Askari Monument",
        "Azania Front Lutheran Church",
        "St. Joseph's Cathedral, Dar es Salaam",
    ],
    # ===== Expansion-batch fallbacks =====
    "valparaiso": [
        "Cerro Concepción",
        "Valparaíso funiculars",
        "Plaza Sotomayor",
    ],
    "cebu": [
        "Basilica del Santo Niño",
        "Magellan's Cross",
        "Fort San Pedro",
    ],
    "ottawa": [
        "Parliament Hill",
        "Centre Block",
        "Rideau Canal",
    ],
    "daegu": [
        "Donghwasa",
        "Apsan",
        "Daegu Stadium",
    ],
    "naples": [
        "Castel Nuovo",
        "Castel dell'Ovo",
        "Royal Palace of Naples",
    ],
    "nagoya": [
        "Nagoya Castle",
        "Atsuta Shrine",
        "Osu Kannon",
    ],
}

COUNTRY_LANDMARKS: dict[str, list[str]] = {
    "denmark": [
        "Nyhavn",
        "Kronborg",
    ],
    "united-states": [
        "Grand Canyon",
        "Statue of Liberty",
        "Yosemite Valley",
    ],
    "spain": [
        "Alhambra",
        "Plaza de España, Seville",
    ],
    "switzerland": [
        "Matterhorn",
        "Jungfrau",
    ],
    "austria": [
        "Hallstatt",
        "Schönbrunn Palace",
        "Salzburg Cathedral",
    ],
    "mexico": [
        "Chichen Itza",
        "Teotihuacan",
        "Palacio de Bellas Artes",
    ],
    "kenya": [
        "Maasai Mara",
        "Mount Kenya",
        "Amboseli National Park",
    ],
    "italy": [
        "Grand Canal (Venice)",
        "Mount Etna",
        "Amalfi Coast",
    ],
    "czechia": [
        "Český Krumlov",
        "Karlštejn Castle",
    ],
    "colombia": [
        "Cartagena, Colombia",
        "Caño Cristales",
        "Monserrate",
    ],
    "malaysia": [
        "Petronas Towers",
        "Mount Kinabalu",
    ],
    "indonesia": [
        "Borobudur",
        "Mount Bromo",
    ],
    "philippines": [
        "Banaue Rice Terraces",
        "Chocolate Hills",
        "Mayon",
    ],
    "india": [
        "Taj Mahal",
        "Amber Fort",
    ],
    "sweden": [
        "Gamla stan",
        "Vasa Museum",
    ],
    "norway": [
        "Geirangerfjord",
        "Preikestolen",
    ],
    "finland": [
        "Suomenlinna",
        "Helsinki Cathedral",
    ],
    "ethiopia": [
        "Rock-hewn churches of Lalibela",
        "Simien Mountains",
    ],
    "uruguay": [
        "Colonia del Sacramento",
        "Punta del Este",
    ],
    "panama": [
        "Panama Canal",
        "Panamá Viejo",
    ],
    "serbia": [
        "Studenica Monastery",
        "Belgrade Fortress",
    ],
    "estonia": [
        "Tallinn Old Town",
        "Toompea",
    ],
    "lithuania": [
        "Trakai Island Castle",
        "Hill of Crosses",
    ],
    "costa-rica": [
        "Arenal Volcano",
        "Monteverde Cloud Forest Reserve",
    ],
    "dominican-republic": [
        "Cathedral of Santa María la Menor",
        "Alcázar de Colón",
    ],
    "kuwait": [
        "Kuwait Towers",
        "Grand Mosque (Kuwait)",
        "Al Hamra Tower",
    ],
    "senegal": [
        "Gorée",
        "African Renaissance Monument",
    ],
    "tanzania": [
        "Mount Kilimanjaro",
        "Serengeti National Park",
    ],
    "uganda": [
        "Bwindi Impenetrable Forest",
        "Murchison Falls",
    ],
    # ===== Expansion-batch fallbacks =====
    "zambia": [
        "Victoria Falls",
        "South Luangwa National Park",
    ],
    "mozambique": [
        "Bazaruto Archipelago",
        "Quirimbas Archipelago",
        "Ilha de Moçambique",
    ],
}


def lookup_city_meta(slug: str) -> tuple[str, str]:
    for s, name, country in verifier.extract_cities():
        if s == slug:
            return name, country
    return slug, ""


def lookup_country_meta(slug: str) -> str:
    for s, name in verifier.extract_countries():
        if s == slug:
            return name
    return slug


def title_matches(requested: str, resolved: str | None) -> bool:
    """Sanity check: the Wikipedia article we resolved actually matches
    the landmark we asked for. Prevents picking up disambiguation
    articles that point to unrelated topics.
    """
    if not resolved:
        return False
    a = requested.lower().split("(")[0].strip().strip(",")
    b = resolved.lower().split("(")[0].strip().strip(",")
    return a == b or a in b or b in a


def candidate_record(
    place_type: str,
    slug: str,
    place_name: str,
    country: str,
    landmark_title: str,
) -> dict | None:
    """Resolve landmark title → Wikidata QID → P18 → Commons metadata.
    Returns a validated PlaceImage dict or None.
    """
    resolved_title = verifier.resolve_wikipedia_title(landmark_title, None, None)
    if not title_matches(landmark_title, resolved_title):
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
        return None

    landmark_label = resolved_title  # use the actual article title

    if place_type == "city" and country:
        alt = f"View of {landmark_label} in {place_name}, {country}"
    elif place_type == "country":
        alt = f"View of {landmark_label} in {place_name}"
    else:
        alt = f"View of {landmark_label}"

    record = {
        "id": f"{place_type}-{slug}-hero",
        "placeSlug": slug,
        "placeType": place_type,
        "imageType": "hero",
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
            f"Resolved via landmark article {resolved_title!r} → "
            f"Wikidata {qid} → Commons file '{filename}'."
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

    def index_by_slug(records: list[dict]) -> dict[str, int]:
        return {r["placeSlug"]: i for i, r in enumerate(records)}

    def existing_is_suitable(records: list[dict], slug: str) -> bool:
        idx = index_by_slug(records).get(slug)
        if idx is None:
            return False
        src = records[idx].get("src", "")
        return not builder.file_is_unsuitable(src)

    def upsert(records: list[dict], record: dict) -> None:
        idx = index_by_slug(records).get(record["placeSlug"])
        if idx is None:
            records.append(record)
        else:
            records[idx] = record

    added_city = 0
    for slug, candidates in CITY_LANDMARKS.items():
        if existing_is_suitable(city_records, slug):
            continue
        name, country = lookup_city_meta(slug)
        for title in candidates:
            record = None
            try:
                record = candidate_record("city", slug, name, country, title)
            except Exception as exc:
                print(f"  [city/{slug}] {title!r}: error {exc}", file=sys.stderr)
            if record:
                upsert(city_records, record)
                added_city += 1
                print(
                    f"  [city/{slug}] {title!r}: ok "
                    f"(caption='{record['caption']}', {record['author']} / {record['license']})",
                    file=sys.stderr,
                )
                break
            else:
                print(f"  [city/{slug}] {title!r}: skip", file=sys.stderr)
            time.sleep(0.1)

    added_country = 0
    for slug, candidates in COUNTRY_LANDMARKS.items():
        if existing_is_suitable(country_records, slug):
            continue
        name = lookup_country_meta(slug)
        for title in candidates:
            record = None
            try:
                record = candidate_record("country", slug, name, "", title)
            except Exception as exc:
                print(f"  [country/{slug}] {title!r}: error {exc}", file=sys.stderr)
            if record:
                upsert(country_records, record)
                added_country += 1
                print(
                    f"  [country/{slug}] {title!r}: ok "
                    f"(caption='{record['caption']}', {record['author']} / {record['license']})",
                    file=sys.stderr,
                )
                break
            else:
                print(f"  [country/{slug}] {title!r}: skip", file=sys.stderr)
            time.sleep(0.1)

    with open(os.path.join(media_dir, "city-images.generated.json"), "w") as f:
        json.dump(city_records, f, indent=2)
    with open(os.path.join(media_dir, "country-images.generated.json"), "w") as f:
        json.dump(country_records, f, indent=2)

    print(
        f"\nAdded {added_city} new city records, {added_country} new country records",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
