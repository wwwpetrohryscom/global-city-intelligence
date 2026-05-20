#!/usr/bin/env python3
"""
Verify hero images for indexed cities and countries against Wikidata + Wikimedia Commons.

Workflow per place:
  1. Resolve the Wikipedia page title via the MediaWiki search/opensearch API.
  2. Read the page's Wikibase QID via the page-props endpoint.
  3. Fetch the P18 "image" claim from Wikidata for that QID.
  4. Query Commons imageinfo for the file: license, author, dimensions, thumb URL.
  5. Emit a verified PlaceImage record only if a permissive Creative Commons or
     public-domain license is present and the source URL is reachable.

Records with non-commercial licenses, missing authors, missing licenses, or
without a usable thumb URL are dropped — the page will render the fallback
component instead.

Outputs:
  lib/data/media/city-images.generated.json
  lib/data/media/country-images.generated.json
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from typing import Optional

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
USER_AGENT = (
    "global-city-intelligence-image-verifier/1.0 "
    "(https://github.com/wwwpetrohryscom/global-city-intelligence; contact via repo)"
)

ALLOWED_LICENSE_PREFIXES = (
    "CC0",
    "CC BY",
    "CC-BY",
    "Public domain",
    "PD",
)

DISALLOWED_LICENSE_TOKENS = (
    "NC",  # non-commercial
    "ND",  # no-derivatives
)


def http_get_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def strip_html(value: str) -> str:
    text = re.sub(r"<[^>]+>", "", value or "")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def normalize_license(value: str) -> Optional[str]:
    if not value:
        return None
    v = value.strip()
    if v.lower().startswith("cc-"):
        v = "CC " + v[3:]
    return v


def license_is_allowed(license_short: Optional[str]) -> bool:
    if not license_short:
        return False
    upper = license_short.upper()
    if any(token in upper.split() or f" {token} " in f" {upper} " for token in DISALLOWED_LICENSE_TOKENS):
        return False
    return any(upper.startswith(prefix.upper()) for prefix in ALLOWED_LICENSE_PREFIXES)


SLUG_OVERRIDES: dict[str, str] = {
    # cities whose plain name disambiguates incorrectly on Wikipedia
    "new-york": "New York City",
    "amsterdam": "Amsterdam",
    "chicago": "Chicago",
    "shanghai": "Shanghai",
    "jakarta": "Jakarta",
    "osaka": "Osaka",
    "delhi": "Delhi",
    "istanbul": "Istanbul",
    "wellington": "Wellington",
    "busan": "Busan",
    "dar-es-salaam": "Dar es Salaam",
    # countries
    "united-states": "United States",
    "czechia": "Czech Republic",
}


def resolve_wikipedia_title(
    name: str, country: Optional[str], slug: Optional[str] = None
) -> Optional[str]:
    """Try a few search strategies to find the Wikipedia article for a place."""
    queries = []
    if slug and slug in SLUG_OVERRIDES:
        queries.append(SLUG_OVERRIDES[slug])
    if country:
        queries.append(f"{name} ({country})")
        queries.append(f"{name}, {country}")
    queries.append(name)
    for q in queries:
        params = {
            "action": "query",
            "list": "search",
            "srsearch": q,
            "srnamespace": 0,
            "srlimit": 3,
            "format": "json",
        }
        url = "https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode(params)
        try:
            data = http_get_json(url)
        except Exception:
            continue
        results = data.get("query", {}).get("search", [])
        for r in results:
            title = r.get("title")
            if not title:
                continue
            # Prefer exact name matches before falling back to disambig pages.
            if title.lower() == name.lower() or title.lower().startswith(f"{name.lower()} ("):
                return title
        if results:
            return results[0].get("title")
    return None


def get_wikidata_qid(title: str) -> Optional[str]:
    params = {
        "action": "query",
        "prop": "pageprops",
        "ppprop": "wikibase_item",
        "titles": title,
        "format": "json",
        "redirects": 1,
    }
    url = "https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode(params)
    try:
        data = http_get_json(url)
    except Exception:
        return None
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        qid = page.get("pageprops", {}).get("wikibase_item")
        if qid:
            return qid
    return None


def get_p18_filename(qid: str) -> Optional[str]:
    params = {
        "action": "wbgetclaims",
        "entity": qid,
        "property": "P18",
        "format": "json",
    }
    url = "https://www.wikidata.org/w/api.php?" + urllib.parse.urlencode(params)
    try:
        data = http_get_json(url)
    except Exception:
        return None
    claims = data.get("claims", {}).get("P18", [])
    if not claims:
        return None
    return claims[0].get("mainsnak", {}).get("datavalue", {}).get("value")


def get_commons_metadata(filename: str, thumb_width: int = 1600) -> Optional[dict]:
    title = f"File:{filename}"
    params = {
        "action": "query",
        "titles": title,
        "prop": "imageinfo",
        "iiprop": "url|user|extmetadata|size|mime",
        "iiurlwidth": thumb_width,
        "format": "json",
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    try:
        data = http_get_json(url)
    except Exception:
        return None
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        ii_list = page.get("imageinfo")
        if not ii_list:
            continue
        ii = ii_list[0]
        ext = ii.get("extmetadata", {}) or {}
        artist_raw = (ext.get("Artist", {}) or {}).get("value", "")
        license_short = (ext.get("LicenseShortName", {}) or {}).get("value")
        license_url = (ext.get("LicenseUrl", {}) or {}).get("value")
        restrictions = (ext.get("Restrictions", {}) or {}).get("value")
        artist = strip_html(artist_raw) or ii.get("user")
        author_url_match = re.search(r'href="(//commons\.wikimedia\.org/[^\"]+)"', artist_raw or "")
        author_url = ("https:" + author_url_match.group(1)) if author_url_match else None

        mime = ii.get("mime", "")
        if mime not in ("image/jpeg", "image/png", "image/webp"):
            return None
        return {
            "thumb_url": ii.get("thumburl"),
            "thumb_width": ii.get("thumbwidth"),
            "thumb_height": ii.get("thumbheight"),
            "full_url": ii.get("url"),
            "width": ii.get("width"),
            "height": ii.get("height"),
            "page_url": ii.get("descriptionurl"),
            "artist": artist,
            "author_url": author_url,
            "license": normalize_license(license_short),
            "license_url": license_url,
            "restrictions": restrictions,
            "mime": mime,
        }
    return None


def make_alt(name: str, country: Optional[str], place_type: str) -> str:
    if place_type == "city" and country:
        return f"View of {name}, {country}"
    if place_type == "country":
        return f"Landscape or landmark of {name}"
    return f"View of {name}"


def verify_place(
    place_type: str,
    slug: str,
    name: str,
    country: Optional[str] = None,
) -> Optional[dict]:
    title = resolve_wikipedia_title(name, country, slug)
    if not title:
        return None
    time.sleep(0.1)
    qid = get_wikidata_qid(title)
    if not qid:
        return None
    time.sleep(0.1)
    filename = get_p18_filename(qid)
    if not filename:
        return None
    time.sleep(0.1)
    meta = get_commons_metadata(filename)
    if not meta:
        return None
    if not meta["thumb_url"]:
        return None
    if not license_is_allowed(meta["license"]):
        return None
    if meta.get("restrictions"):
        return None
    if not meta.get("artist"):
        return None

    record = {
        "id": f"{place_type}-{slug}-hero",
        "placeSlug": slug,
        "placeType": place_type,
        "imageType": "hero",
        "src": meta["thumb_url"],
        "width": meta["thumb_width"],
        "height": meta["thumb_height"],
        "alt": make_alt(name, country, place_type),
        "source": "wikimedia",
        "sourceUrl": meta["page_url"],
        "author": meta["artist"],
        "license": meta["license"],
        "licenseUrl": meta["license_url"],
        "attributionText": f"{meta['artist']} / Wikimedia Commons, {meta['license']}",
        "verified": True,
        "verifiedAt": "2026-05-20",
        "notes": f"Resolved via Wikidata {qid} → Commons file '{filename}'.",
    }
    if meta.get("author_url"):
        record["authorUrl"] = meta["author_url"]
    return record


def extract_cities() -> list[tuple[str, str, str]]:
    src = open(os.path.join(ROOT, "lib/data/cities.ts")).read()
    pattern = re.compile(
        r'\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*countrySlug:\s*"[^"]+",\s*countryName:\s*"([^"]+)"'
    )
    return pattern.findall(src)


def extract_countries() -> list[tuple[str, str]]:
    src = open(os.path.join(ROOT, "lib/data/countries.ts")).read()
    pattern = re.compile(r'\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"')
    return pattern.findall(src)


def main():
    cities = extract_cities()
    countries = extract_countries()
    print(f"Cities: {len(cities)}  Countries: {len(countries)}", file=sys.stderr)

    out_dir = os.path.join(ROOT, "lib/data/media")
    os.makedirs(out_dir, exist_ok=True)

    city_records: list[dict] = []
    for i, (slug, name, country) in enumerate(cities, 1):
        print(f"[city {i}/{len(cities)}] {slug}", file=sys.stderr, flush=True)
        try:
            record = verify_place("city", slug, name, country)
        except Exception as exc:
            print(f"  error: {exc}", file=sys.stderr)
            record = None
        if record:
            city_records.append(record)
            print(
                f"  ok: {record['author']} / {record['license']}",
                file=sys.stderr,
            )
        else:
            print("  no verified record", file=sys.stderr)
        time.sleep(0.1)

    with open(os.path.join(out_dir, "city-images.generated.json"), "w") as f:
        json.dump(city_records, f, indent=2)
    print(
        f"Wrote {len(city_records)} city records / {len(cities)} cities",
        file=sys.stderr,
    )

    country_records: list[dict] = []
    for i, (slug, name) in enumerate(countries, 1):
        print(f"[country {i}/{len(countries)}] {slug}", file=sys.stderr, flush=True)
        try:
            record = verify_place("country", slug, name, None)
        except Exception as exc:
            print(f"  error: {exc}", file=sys.stderr)
            record = None
        if record:
            country_records.append(record)
            print(
                f"  ok: {record['author']} / {record['license']}",
                file=sys.stderr,
            )
        else:
            print("  no verified record", file=sys.stderr)
        time.sleep(0.1)

    with open(os.path.join(out_dir, "country-images.generated.json"), "w") as f:
        json.dump(country_records, f, indent=2)
    print(
        f"Wrote {len(country_records)} country records / {len(countries)} countries",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
