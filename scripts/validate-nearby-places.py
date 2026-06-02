#!/usr/bin/env python3
"""
Validate the curated nearby-weekend-places dataset against the
established safety rules:

  - unique place slugs
  - every connectedCitySlug exists in lib/data/cities.ts
  - every countrySlug exists in lib/data/countries.ts
  - every sourceId resolves to an existing source
  - no exact distance / travel-time / price / opening-hour fields
    (also no liveSchedule / routeDetails / currentWeather /
    eventDate / hotelPrice / flightPrice fields)
  - no unsafe positive wording in summary or cautionNotes
  - every record's verificationStatus is exactly one of
    "verified", "partial", or "needs_review"
  - records flagged "verified" must carry a wikidataId and/or
    officialUrl (preferably both)
  - if a record declares latitude OR longitude, both must be
    present alongside a non-empty coordinateSource
  - records flagged "verified" must additionally declare
    latitude/longitude coordinates (they must be geolocatable)
  - records with image: ensure source/author/license/attribution
    structure is present AND `verified: true` with a non-empty
    `verifiedAt` value (no images shipped in MVP; this is a
    forward-compatible check)
  - NEARBY_WEEKEND_PLACE_DETAIL_SLUGS (from
    lib/data/nearby-place-detail-pages.ts) — every curated slug
    must be unique, must resolve to a seed record whose
    verificationStatus is "verified", and the underlying seed
    must declare both a wikidataId and an officialUrl field plus
    have an entry in VERIFIED_IMAGES.
  - VERIFIED_IMAGES entries (sourced from Wikidata P18 + Wikimedia
    Commons API) must carry every required field, the `sourceUrl`
    must point at commons.wikimedia.org, the `author` must be a
    real name (not "Unknown"/"Anonymous"), the `license` string
    must be on the accept-list (public domain / CC0 / CC BY /
    CC BY-SA — regional suffixes allowed) and must NOT contain any
    of the reject tokens (NC/ND/FAL/GFDL/etc.), and the src and
    sourceUrl must not point at montages, collages, flags, coats
    of arms, logos, maps, protests, military or disaster imagery,
    cartographic / survey documents (Ordnance Survey, Ferraris,
    topographic-map sheets), fauna / fungus / flower macro shots,
    or town-centre / civic-core scenes. Each image's larger side
    must also be at least MIN_IMAGE_MAX_DIMENSION (600) pixels.

Run:   python3 scripts/validate-nearby-places.py
Exit:  non-zero on any failure.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NEARBY_PATH = ROOT / "lib/data/nearby-places.ts"
CITIES_PATH = ROOT / "lib/data/cities.ts"
COUNTRIES_PATH = ROOT / "lib/data/countries.ts"
SOURCES_PATH = ROOT / "lib/data/sources/index.ts"
DETAIL_SLUGS_PATH = ROOT / "lib/data/nearby-place-detail-pages.ts"
FACTS_PATH = ROOT / "lib/data/nearby-place-facts.ts"

# Wording rules — every match in a summary or cautionNotes is a
# positive claim and must be flagged. Negative-disclaimer matches in
# documentation comments are tolerated (the script scans seed
# `summary:` strings only).
POSITIVE_BANNED = (
    "best nearby",
    "best day trip",
    "must-see",
    "must see",
    "hidden gem",
    "top attraction",
    "top attractions",
    "cheapest",
    "safest",
    "guaranteed",
    "ticket price",
    "opening hours",
    "live schedule",
    "exact travel time",
    "exact distance",
)

# Field-name rules — these field names are not allowed on records.
BANNED_FIELDS = (
    "travelTimeMinutes",
    "exactDistanceKm",
    "ticketPrice",
    "openingHours",
    "liveSchedule",
    "routeDetails",
    "currentWeather",
    "eventDate",
    "hotelPrice",
    "flightPrice",
)

# Allowed verificationStatus literal values.
ALLOWED_VERIFICATION_STATUSES = ("verified", "partial", "needs_review")

# Required fields on every image / VERIFIED_IMAGES entry.
IMAGE_REQUIRED_FIELDS = (
    "src",
    "width",
    "height",
    "alt",
    "source",
    "sourceUrl",
    "author",
    "license",
    "licenseUrl",
    "attributionText",
    "verified",
    "verifiedAt",
)

# License reject tokens — any case-insensitive substring match here
# is a hard failure.
LICENSE_REJECT_TOKENS = (
    "-nc",
    "non-commercial",
    "noncommercial",
    "-nd",
    "no derivatives",
    "noderivs",
    "fal",
    "gfdl",
    "copyrighted free use",
    "all rights reserved",
    "fair use",
    "fair-use",
    "attribution-noncommercial",
    "attribution-noderivs",
    "unknown",
)


def is_license_accepted(license_str: str) -> bool:
    """Return True when the license string matches the accept-list.

    Accept rules:
      - starts with "Public domain"
      - starts with "PD" or "PD-" (case sensitive prefix on PD)
      - equals "CC0" or starts with "CC0 "
      - equals "CC BY" or starts with "CC BY "
      - equals "CC BY-SA" or starts with "CC BY-SA "
    Regional CC suffixes (e.g. " 3.0 de", " 2.0 fr") are allowed
    because they follow the "CC BY " / "CC BY-SA " prefix rule.
    """
    if not license_str:
        return False
    s = license_str.strip()
    if s.lower().startswith("public domain"):
        return True
    if s == "PD" or s.startswith("PD ") or s.startswith("PD-"):
        return True
    if s == "CC0" or s.startswith("CC0 "):
        return True
    if s == "CC BY" or s.startswith("CC BY "):
        return True
    if s == "CC BY-SA" or s.startswith("CC BY-SA "):
        return True
    return False


# Suspicious filename / src tokens. Each entry is a case-insensitive
# regex pattern that, if matched in `src` or `sourceUrl`, must fail
# validation. Patterns are filename-position-aware where indicated
# so that accidental substrings (e.g. a path component that happens
# to contain "logo") do not produce false positives.
SUSPICIOUS_SRC_PATTERNS = (
    ("montage", r"montage"),
    ("collage", r"collage"),
    ("flag", r"(?:/Flag_|_flag\.|/flag\.|_flag_)"),
    ("coat_of_arms", r"(?:coat[_-]of[_-]arms)"),
    ("emblem", r"emblem"),
    ("logo", r"(?:_logo_|/Logo_|/logo_|_logo\.|/logo\.|\.logo\.)"),
    ("map", r"(?:/Map_|_map\.)"),
    ("protest", r"protest"),
    ("military", r"military"),
    ("disaster", r"disaster"),
    ("postcard", r"postcard"),
    # Cartographic / survey documents (not photographs).
    (
        "cartography",
        r"(?:ferraris|ordnance|topograf|mapa|\bcarte\b|\bkaart\b|\bkaarte\b"
        r"|\bkarte\b|mtn25|mtn-|/Sheet_|_sheet\.)",
    ),
    # Insect / animal macro shots (not a place landscape).
    (
        "fauna_macro",
        r"(?:butterfly|\badmiral\b|\binsect\b|beetle|\bmoth\b|\bbee\b"
        r"|honey.?bee|\bwasp\b|spider|\bsnail\b|dragonfly)",
    ),
    # Fungus / mushroom macro shots.
    (
        "fungus_macro",
        r"(?:fungus|fungi|mushroom|\bzwam\b|koraal|amanita|amaniet|toadstool)",
    ),
    # Flower / moss / lichen macro shots.
    ("flora_macro", r"(?:\bflower\b|\bbloom\b|lichen|\bmoss\b)"),
    # Town centre / civic-core shots (not the natural area itself).
    ("urban_core", r"(?:\btown\b|rathaus|altstadt|ortskern|downtown)"),
)

# Minimum acceptable image resolution: the larger image side must be at
# least this many pixels. Guards against tiny crops / thumbnail slivers.
MIN_IMAGE_MAX_DIMENSION = 600


def load(path: Path) -> str:
    return path.read_text()


def collect_set(pattern: str, text: str) -> set[str]:
    return set(re.findall(pattern, text, re.MULTILINE))


def _string_field(block: str, name: str) -> str | None:
    """Return the literal string value of `name: "..."` in block."""
    m = re.search(rf'\b{re.escape(name)}\s*:\s*"((?:[^"\\]|\\.)*)"', block)
    if not m:
        return None
    return m.group(1)


def _numeric_field(block: str, name: str) -> int | None:
    """Return the integer value of `name: <number>` in block."""
    m = re.search(rf"\b{re.escape(name)}\s*:\s*(-?\d+)", block)
    if not m:
        return None
    try:
        return int(m.group(1))
    except ValueError:
        return None


def _validate_image_block(block: str, *, label: str) -> list[str]:
    """Apply field / license / src safety checks to one image block."""
    out: list[str] = []

    # (a) Required-field presence + non-emptiness.
    for required in IMAGE_REQUIRED_FIELDS:
        if not re.search(rf"\b{required}\s*:", block):
            out.append(f"{label}: missing required field: {required}")

    # Non-empty string fields.
    for str_field in (
        "src",
        "alt",
        "source",
        "sourceUrl",
        "author",
        "license",
        "licenseUrl",
        "attributionText",
        "verifiedAt",
    ):
        val = _string_field(block, str_field)
        if val is not None and not val.strip():
            out.append(f"{label}: `{str_field}` must be non-empty")

    # Positive-integer width / height.
    for dim in ("width", "height"):
        val = _numeric_field(block, dim)
        if val is not None and val <= 0:
            out.append(f"{label}: `{dim}` must be a positive integer")

    # Minimum resolution: the larger side must clear MIN_IMAGE_MAX_DIMENSION.
    w_val = _numeric_field(block, "width")
    h_val = _numeric_field(block, "height")
    if w_val is not None and h_val is not None and w_val > 0 and h_val > 0:
        if max(w_val, h_val) < MIN_IMAGE_MAX_DIMENSION:
            out.append(
                f"{label}: image max dimension {max(w_val, h_val)}px is below "
                f"the {MIN_IMAGE_MAX_DIMENSION}px minimum"
            )

    # verified: true literal
    if re.search(r"\bverified\s*:", block) and not re.search(
        r"\bverified\s*:\s*true\b", block
    ):
        out.append(f"{label}: must declare `verified: true`")

    # sourceUrl must live on commons.wikimedia.org
    source_url = _string_field(block, "sourceUrl")
    if source_url and not source_url.startswith(
        "https://commons.wikimedia.org/"
    ):
        out.append(
            f"{label}: `sourceUrl` must start with "
            f"'https://commons.wikimedia.org/' (got: {source_url})"
        )

    # Author must not be Unknown / Anonymous / empty placeholder.
    author = _string_field(block, "author")
    if author is not None:
        author_norm = author.strip().lower()
        if author_norm in ("unknown", "anonymous"):
            out.append(
                f"{label}: `author` must not be 'Unknown' or 'Anonymous'"
            )

    # (b) License accept/reject.
    license_val = _string_field(block, "license")
    if license_val is not None:
        license_lower = license_val.lower()
        for token in LICENSE_REJECT_TOKENS:
            if token in license_lower:
                out.append(
                    f"{label}: license rejected (contains '{token}'): "
                    f"{license_val}"
                )
        if license_val.strip() and not is_license_accepted(license_val):
            out.append(
                f"{label}: license not on accept-list "
                f"(expected public domain / CC0 / CC BY / CC BY-SA): "
                f"{license_val}"
            )

    # src must be HTTPS upload.wikimedia.org (the canonical Commons CDN).
    src_val = _string_field(block, "src")
    if src_val and not src_val.startswith("https://upload.wikimedia.org/"):
        out.append(
            f"{label}: `src` must be served from "
            f"https://upload.wikimedia.org/ (got: {src_val})"
        )

    # source must be the literal "wikimedia-commons".
    source_val = _string_field(block, "source")
    if source_val is not None and source_val != "wikimedia-commons":
        out.append(
            f"{label}: `source` must be the literal "
            f"'wikimedia-commons' (got: {source_val})"
        )

    # (c) Suspicious tokens on src + sourceUrl.
    haystacks = [
        ("src", src_val or ""),
        ("sourceUrl", source_url or ""),
    ]
    for field_name, value in haystacks:
        if not value:
            continue
        for token_label, pattern in SUSPICIOUS_SRC_PATTERNS:
            if re.search(pattern, value, re.IGNORECASE):
                out.append(
                    f"{label}: `{field_name}` contains suspicious "
                    f"token '{token_label}': {value}"
                )

    return out


def main() -> int:
    errors: list[str] = []

    nearby_src = load(NEARBY_PATH)
    cities_src = load(CITIES_PATH)
    countries_src = load(COUNTRIES_PATH)
    sources_src = load(SOURCES_PATH)

    # Build seed records (each delimited by `{` ... `},` inside the
    # `seeds` constant — we walk the file for slug+name+summary
    # triplets, which is enough for the validation rules below).
    seed_pattern = re.compile(
        r'\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*'
        r'countrySlug:\s*"([^"]+)",'
        r'(?:\s*regionName:\s*"([^"]*)",)?'
        r'\s*category:\s*"([^"]+)",\s*'
        r'summary:\s*\n?\s*"((?:[^"\\]|\\.)+)",\s*'
        r'connectedCitySlugs:\s*\[([^\]]*)\]',
        re.DOTALL,
    )
    seeds: list[dict[str, object]] = []
    for m in seed_pattern.finditer(nearby_src):
        seeds.append(
            {
                "slug": m.group(1),
                "name": m.group(2),
                "countrySlug": m.group(3),
                "regionName": m.group(4) or "",
                "category": m.group(5),
                "summary": m.group(6),
                "connectedCitySlugs": re.findall(r'"([^"]+)"', m.group(7)),
            }
        )

    if not seeds:
        errors.append("no seed records parsed from lib/data/nearby-places.ts")
        print_results(errors)
        return 1

    # Unique slugs
    seen: set[str] = set()
    for seed in seeds:
        slug = seed["slug"]
        assert isinstance(slug, str)
        if slug in seen:
            errors.append(f"duplicate slug: {slug}")
        seen.add(slug)

    # City references
    city_slugs = collect_set(
        r'^\s+slug:\s*"([a-z][a-z0-9-]*)",',
        cities_src,
    )
    # Cities.ts has many slugs across various scopes; the registry
    # column extraction above matches the established pattern used
    # by other validation scripts.
    for seed in seeds:
        for ref in seed["connectedCitySlugs"]:
            assert isinstance(ref, str)
            if ref not in city_slugs:
                errors.append(
                    f"{seed['slug']}: connectedCitySlug not in cities.ts: {ref}"
                )

    # Country references
    country_slugs = collect_set(
        r'^\s+slug:\s*"([a-z][a-z0-9-]*)",',
        countries_src,
    )
    for seed in seeds:
        cs = seed["countrySlug"]
        assert isinstance(cs, str)
        if cs not in country_slugs:
            errors.append(f"{seed['slug']}: countrySlug not in countries.ts: {cs}")

    # Source IDs (places use the shared COMMON_SOURCES list; check both
    # the literal IDs in the COMMON_SOURCES array and any extras passed
    # to placeSources()).
    source_ids = collect_set(r'id:\s*"([a-z][a-z0-9-]*)"', sources_src)
    used_sources: set[str] = set()
    common_match = re.search(
        r"COMMON_SOURCES:\s*readonly string\[\]\s*=\s*\[([^\]]+)\]",
        nearby_src,
    )
    if common_match:
        for s in re.findall(r'"([a-z][a-z0-9-]*)"', common_match.group(1)):
            used_sources.add(s)
    for m in re.finditer(r"placeSources\(\[([^\]]*)\]\)", nearby_src):
        for s in re.findall(r'"([a-z][a-z0-9-]*)"', m.group(1)):
            used_sources.add(s)
    for sid in sorted(used_sources):
        if sid not in source_ids:
            errors.append(f"sourceId not in sources registry: {sid}")

    # Banned fields anywhere in the records section
    for field in BANNED_FIELDS:
        if re.search(rf"\b{re.escape(field)}\s*:", nearby_src):
            errors.append(f"banned field present in nearby-places.ts: {field}")

    # Positive-wording check in seed summaries and cautionNotes only
    # (NOT in file-level docstrings or comments).
    for seed in seeds:
        text = seed["summary"]
        assert isinstance(text, str)
        for banned in POSITIVE_BANNED:
            if banned.lower() in text.lower():
                errors.append(
                    f"{seed['slug']}: banned positive wording in summary: '{banned}'"
                )
    for m in re.finditer(r'cautionNotes:\s*"((?:[^"\\]|\\.)+)"', nearby_src):
        text = m.group(1)
        for banned in POSITIVE_BANNED:
            if banned.lower() in text.lower():
                errors.append(
                    f"banned positive wording in cautionNotes: '{banned}'"
                )

    # If any image records ever ship inline on a seed: enforce required
    # attribution fields and license + filename safety rules.
    for m in re.finditer(r"image:\s*\{([^}]+)\}", nearby_src):
        block = m.group(1)
        for err in _validate_image_block(block, label="image record"):
            errors.append(err)

    # VERIFIED_IMAGES Record check — the constant lives in
    # nearby-places.ts and maps slug -> image-attribution object.
    # Each entry must pass the same field / license / src checks.
    verified_images_match = re.search(
        r"VERIFIED_IMAGES\s*:[^=]*=\s*\{(.*?)\n\}\s*(?:as\s+const\s*)?;",
        nearby_src,
        re.DOTALL,
    )
    if verified_images_match:
        body = verified_images_match.group(1)
        # Walk entries of the form "<slug>": { ... },
        # by carving each value object's brace span.
        i = 0
        while i < len(body):
            key_match = re.search(
                r'"([a-z][a-z0-9-]*)"\s*:\s*\{', body[i:]
            )
            if not key_match:
                break
            slug = key_match.group(1)
            entry_start = i + key_match.end() - 1  # position of `{`
            depth = 0
            j = entry_start
            entry_end = -1
            while j < len(body):
                ch = body[j]
                if ch == "{":
                    depth += 1
                elif ch == "}":
                    depth -= 1
                    if depth == 0:
                        entry_end = j + 1
                        break
                j += 1
            if entry_end < 0:
                errors.append(
                    f"VERIFIED_IMAGES[{slug}]: unterminated entry block"
                )
                break
            entry_block = body[entry_start + 1 : entry_end - 1]
            label = f"VERIFIED_IMAGES[{slug}]"
            for err in _validate_image_block(entry_block, label=label):
                errors.append(err)
            i = entry_end

    # Per-seed block scans for verificationStatus / wikidataId /
    # officialUrl / coordinate enforcement. We walk the file and
    # carve out each `{ slug: "...", ... }` record block by tracking
    # brace depth from the slug declaration onward.
    seed_blocks: dict[str, str] = {}
    for slug_match in re.finditer(r'\{\s*slug:\s*"([^"]+)"', nearby_src):
        slug = slug_match.group(1)
        start = slug_match.start()
        # Walk forward to find the matching closing brace for this
        # record. Start one char after the opening `{`.
        depth = 0
        i = start
        end = -1
        while i < len(nearby_src):
            ch = nearby_src[i]
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
            i += 1
        if end > start:
            seed_blocks[slug] = nearby_src[start:end]

    for seed in seeds:
        slug = seed["slug"]
        assert isinstance(slug, str)
        block = seed_blocks.get(slug, "")

        # verificationStatus literal must be one of the allowed values
        vs_match = re.search(
            r'\bverificationStatus\s*:\s*"([^"]*)"', block
        )
        if not vs_match:
            errors.append(
                f"{slug}: missing verificationStatus literal"
            )
            verification_status = None
        else:
            verification_status = vs_match.group(1)
            if verification_status not in ALLOWED_VERIFICATION_STATUSES:
                errors.append(
                    f"{slug}: invalid verificationStatus "
                    f"'{verification_status}' (expected one of "
                    f"{', '.join(ALLOWED_VERIFICATION_STATUSES)})"
                )

        # When verified — must have wikidataId or officialUrl
        if verification_status == "verified":
            wd_match = re.search(
                r'\bwikidataId\s*:\s*"([^"]+)"', block
            )
            ou_match = re.search(
                r'\bofficialUrl\s*:\s*"([^"]+)"', block
            )
            if not wd_match and not ou_match:
                errors.append(
                    f"{slug}: verificationStatus 'verified' requires "
                    f"wikidataId and/or officialUrl"
                )
            # Verified records must also be geolocatable.
            if not re.search(r"\blatitude\s*:\s*-?\d", block):
                errors.append(
                    f"{slug}: verificationStatus 'verified' requires "
                    f"latitude/longitude coordinates"
                )

        # Coordinate enforcement: if latitude or longitude declared,
        # both must be present and coordinateSource must be non-empty.
        lat_match = re.search(r'\blatitude\s*:\s*([^,\n}]+)', block)
        lon_match = re.search(r'\blongitude\s*:\s*([^,\n}]+)', block)
        if lat_match or lon_match:
            if not lat_match:
                errors.append(
                    f"{slug}: longitude declared without latitude"
                )
            if not lon_match:
                errors.append(
                    f"{slug}: latitude declared without longitude"
                )
            cs_match = re.search(
                r'\bcoordinateSource\s*:\s*"([^"]*)"', block
            )
            if not cs_match or not cs_match.group(1).strip():
                errors.append(
                    f"{slug}: latitude/longitude declared without "
                    f"non-empty coordinateSource"
                )

    # Curated detail-slug allow-list validation.
    # The file lib/data/nearby-place-detail-pages.ts exports an
    # ordered tuple NEARBY_WEEKEND_PLACE_DETAIL_SLUGS naming the
    # subset of seeds that have a dedicated detail route. Every
    # entry must:
    #   (a) exist as a seed slug in nearby-places.ts
    #   (b) carry verificationStatus === "verified"
    #   (c) declare a wikidataId field
    #   (d) declare an officialUrl field
    #   (e) appear as a key in VERIFIED_IMAGES
    # The list must also be free of duplicates. An empty / missing
    # tuple is tolerated (the file may not have landed yet).
    if DETAIL_SLUGS_PATH.exists():
        detail_src = load(DETAIL_SLUGS_PATH)
        tuple_match = re.search(
            r"NEARBY_WEEKEND_PLACE_DETAIL_SLUGS"
            r"[^=]*=\s*\[(.*?)\]\s*as\s+const\s*;",
            detail_src,
            re.DOTALL,
        )
        curated_slugs: list[str] = []
        if tuple_match:
            curated_slugs = re.findall(
                r'"([a-z][a-z0-9-]*)"', tuple_match.group(1)
            )

        # Duplicate check.
        seen_curated: set[str] = set()
        for cs in curated_slugs:
            if cs in seen_curated:
                errors.append(
                    f"NEARBY_WEEKEND_PLACE_DETAIL_SLUGS: duplicate slug: {cs}"
                )
            seen_curated.add(cs)

        # Re-collect VERIFIED_IMAGES keys for the image-presence check.
        verified_image_keys: set[str] = set()
        vi_match = re.search(
            r"VERIFIED_IMAGES\s*:[^=]*=\s*\{(.*?)\n\}\s*(?:as\s+const\s*)?;",
            nearby_src,
            re.DOTALL,
        )
        if vi_match:
            verified_image_keys = set(
                re.findall(
                    r'"([a-z][a-z0-9-]*)"\s*:\s*\{',
                    vi_match.group(1),
                )
            )

        seed_slug_set = {seed["slug"] for seed in seeds}

        for cs in curated_slugs:
            # (a) Must exist in the seed list.
            if cs not in seed_slug_set:
                errors.append(
                    f"NEARBY_WEEKEND_PLACE_DETAIL_SLUGS[{cs}]: "
                    f"slug not present in nearby-places.ts seeds"
                )
                continue

            block = seed_blocks.get(cs, "")

            # (b) verificationStatus must be exactly "verified".
            vs_match = re.search(
                r'\bverificationStatus\s*:\s*"([^"]*)"', block
            )
            if not vs_match or vs_match.group(1) != "verified":
                errors.append(
                    f"NEARBY_WEEKEND_PLACE_DETAIL_SLUGS[{cs}]: "
                    f"verificationStatus is not 'verified'"
                )

            # (c) Must declare a wikidataId field.
            if not re.search(r'\bwikidataId\s*:\s*"Q\d+"', block):
                errors.append(
                    f"NEARBY_WEEKEND_PLACE_DETAIL_SLUGS[{cs}]: "
                    f"missing wikidataId field"
                )

            # (d) Must declare an officialUrl field.
            if not re.search(r'\bofficialUrl\s*:\s*"[^"]+"', block):
                errors.append(
                    f"NEARBY_WEEKEND_PLACE_DETAIL_SLUGS[{cs}]: "
                    f"missing officialUrl field"
                )

            # (e) Must have an entry in VERIFIED_IMAGES.
            if cs not in verified_image_keys:
                errors.append(
                    f"NEARBY_WEEKEND_PLACE_DETAIL_SLUGS[{cs}]: "
                    f"no matching VERIFIED_IMAGES entry"
                )

    # NEARBY_PLACE_FACTS (lib/data/nearby-place-facts.ts) — optional
    # verified reference facts keyed by detail-slug. Each key must be a
    # curated detail slug, its wikidataId must match the seed's
    # wikidataId, any iucnCategory must be a valid IUCN class, and any
    # established year must be plausible.
    if FACTS_PATH.exists():
        facts_src = load(FACTS_PATH)
        detail_slug_set = (
            set(curated_slugs) if DETAIL_SLUGS_PATH.exists() else set()
        )
        valid_iucn = {"Ia", "Ib", "I", "II", "III", "IV", "V", "VI"}
        for fm in re.finditer(
            r'"([a-z0-9-]+)"\s*:\s*\{([^}]*)\}', facts_src
        ):
            fslug, fbody = fm.group(1), fm.group(2)
            if detail_slug_set and fslug not in detail_slug_set:
                errors.append(
                    f"NEARBY_PLACE_FACTS[{fslug}]: not a curated detail slug"
                )
            wd = re.search(r'wikidataId:\s*"(Q\d+)"', fbody)
            if not wd:
                errors.append(
                    f"NEARBY_PLACE_FACTS[{fslug}]: missing wikidataId"
                )
            else:
                seed_block = seed_blocks.get(fslug, "")
                seed_wd = re.search(
                    r'\bwikidataId\s*:\s*"(Q\d+)"', seed_block
                )
                if seed_wd and seed_wd.group(1) != wd.group(1):
                    errors.append(
                        f"NEARBY_PLACE_FACTS[{fslug}]: wikidataId "
                        f"{wd.group(1)} does not match seed "
                        f"{seed_wd.group(1)}"
                    )
            iucn = re.search(r'iucnCategory:\s*"([^"]*)"', fbody)
            if iucn and iucn.group(1) not in valid_iucn:
                errors.append(
                    f"NEARBY_PLACE_FACTS[{fslug}]: invalid IUCN category "
                    f"'{iucn.group(1)}'"
                )
            est = re.search(r"established:\s*(\d+)", fbody)
            if est and not (1000 <= int(est.group(1)) <= 2026):
                errors.append(
                    f"NEARBY_PLACE_FACTS[{fslug}]: implausible established "
                    f"year {est.group(1)}"
                )

    return print_results(errors, count=len(seeds))


def print_results(errors: list[str], count: int = 0) -> int:
    if errors:
        print("FAIL: nearby-weekend-places validation failed:", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        return 1
    print(f"PASS: nearby-weekend-places ({count} records) — all checks clean.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
