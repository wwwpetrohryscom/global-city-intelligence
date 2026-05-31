#!/usr/bin/env python3
"""
Validate the community-media foundation against the established coherence
rules between the type vocabulary (types/community-media.ts) and the
policy + label tables (lib/community-media/policy.ts):

  - every CommunityPhotoSubmissionStatus value is keyed in STATUS_LABEL
  - every CommunityPhotoSourceType value is keyed in SOURCE_LABEL
  - every CommunityPhotoSafetyFlag value is keyed in SAFETY_FLAG_LABEL
  - DEFAULT_POLICY.publicUseAllowedStatuses contains only values that
    appear in CommunityPhotoSubmissionStatus, AND must be exactly the
    list ["approved"] (per the foundation design contract)
  - DEFAULT_POLICY.allowedTargetTypes excludes "future_custom_place"
    (reserved for a later phase and not eligible at the foundation)
  - HIGH_RISK_FLAGS is a subset of the CommunityPhotoSafetyFlag union

This is a STATIC check only. The script does NOT execute TypeScript;
it parses the TS source files with regex. No new runtime dependencies.

Run:   python3 scripts/validate-community-media.py
Exit:  non-zero on any failure.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TYPES_PATH = ROOT / "types/community-media.ts"
POLICY_PATH = ROOT / "lib/community-media/policy.ts"


def load(path: Path) -> str:
    if not path.exists():
        print(
            f"FAIL: community-media: required source not found: {path}",
            file=sys.stderr,
        )
        sys.exit(1)
    return path.read_text()


def parse_union(src: str, type_name: str) -> list[str]:
    """Extract the string literal members of a `export type X = "a" | "b" | ...;` union."""
    pattern = re.compile(
        rf"export\s+type\s+{re.escape(type_name)}\s*=\s*(.*?);",
        re.DOTALL,
    )
    m = pattern.search(src)
    if not m:
        return []
    body = m.group(1)
    return re.findall(r'"([^"]+)"', body)


def parse_record_keys(src: str, const_name: str) -> list[str]:
    """Extract the string-literal keys from a `const NAME: Record<...> = { ... };` map."""
    pattern = re.compile(
        rf"const\s+{re.escape(const_name)}\s*:\s*Record<[^>]+>\s*=\s*\{{(.*?)\n\}};",
        re.DOTALL,
    )
    m = pattern.search(src)
    if not m:
        return []
    body = m.group(1)
    keys: list[str] = []
    # Keys may be bare identifiers or quoted strings — community-media uses
    # bare snake_case identifiers like `pending_review:`.
    for line in body.splitlines():
        key_match = re.match(r"\s*([A-Za-z_][A-Za-z0-9_]*)\s*:", line)
        if key_match:
            keys.append(key_match.group(1))
            continue
        quoted = re.match(r'\s*"([^"]+)"\s*:', line)
        if quoted:
            keys.append(quoted.group(1))
    return keys


def parse_string_array(src: str, field_name: str) -> list[str] | None:
    """Extract the string literals inside a `field: [ "a", "b" ] as const,` entry."""
    pattern = re.compile(
        rf"\b{re.escape(field_name)}\s*:\s*\[(.*?)\]\s*(?:as\s+const\s*)?,",
        re.DOTALL,
    )
    m = pattern.search(src)
    if not m:
        return None
    body = m.group(1)
    return re.findall(r'"([^"]+)"', body)


def parse_const_array(src: str, const_name: str) -> list[str] | None:
    """Extract string literals from a top-level `const NAME: ... = [ ... ] as const;`."""
    pattern = re.compile(
        rf"const\s+{re.escape(const_name)}\s*:[^=]*=\s*\[(.*?)\]\s*(?:as\s+const\s*)?;",
        re.DOTALL,
    )
    m = pattern.search(src)
    if not m:
        return None
    body = m.group(1)
    return re.findall(r'"([^"]+)"', body)


def main() -> int:
    errors: list[str] = []

    types_src = load(TYPES_PATH)
    policy_src = load(POLICY_PATH)

    # --- Union member extraction --------------------------------------
    statuses = parse_union(types_src, "CommunityPhotoSubmissionStatus")
    sources = parse_union(types_src, "CommunityPhotoSourceType")
    safety_flags = parse_union(types_src, "CommunityPhotoSafetyFlag")
    target_types = parse_union(types_src, "CommunityPhotoAttachmentTargetType")

    if not statuses:
        errors.append(
            "could not parse CommunityPhotoSubmissionStatus union from "
            "types/community-media.ts"
        )
    if not sources:
        errors.append(
            "could not parse CommunityPhotoSourceType union from "
            "types/community-media.ts"
        )
    if not safety_flags:
        errors.append(
            "could not parse CommunityPhotoSafetyFlag union from "
            "types/community-media.ts"
        )
    if not target_types:
        errors.append(
            "could not parse CommunityPhotoAttachmentTargetType union from "
            "types/community-media.ts"
        )

    # --- Label map coverage -------------------------------------------
    status_label_keys = parse_record_keys(policy_src, "STATUS_LABEL")
    source_label_keys = parse_record_keys(policy_src, "SOURCE_LABEL")
    safety_flag_label_keys = parse_record_keys(policy_src, "SAFETY_FLAG_LABEL")

    if not status_label_keys:
        errors.append("could not parse STATUS_LABEL map from policy.ts")
    if not source_label_keys:
        errors.append("could not parse SOURCE_LABEL map from policy.ts")
    if not safety_flag_label_keys:
        errors.append("could not parse SAFETY_FLAG_LABEL map from policy.ts")

    status_label_set = set(status_label_keys)
    source_label_set = set(source_label_keys)
    safety_flag_label_set = set(safety_flag_label_keys)

    for s in statuses:
        if s not in status_label_set:
            errors.append(
                f"STATUS_LABEL missing key for CommunityPhotoSubmissionStatus '{s}'"
            )
    for extra in status_label_set - set(statuses):
        errors.append(
            f"STATUS_LABEL has stale key '{extra}' not in "
            f"CommunityPhotoSubmissionStatus"
        )

    for s in sources:
        if s not in source_label_set:
            errors.append(
                f"SOURCE_LABEL missing key for CommunityPhotoSourceType '{s}'"
            )
    for extra in source_label_set - set(sources):
        errors.append(
            f"SOURCE_LABEL has stale key '{extra}' not in "
            f"CommunityPhotoSourceType"
        )

    for f in safety_flags:
        if f not in safety_flag_label_set:
            errors.append(
                f"SAFETY_FLAG_LABEL missing key for "
                f"CommunityPhotoSafetyFlag '{f}'"
            )
    for extra in safety_flag_label_set - set(safety_flags):
        errors.append(
            f"SAFETY_FLAG_LABEL has stale key '{extra}' not in "
            f"CommunityPhotoSafetyFlag"
        )

    # --- DEFAULT_POLICY.publicUseAllowedStatuses ----------------------
    public_use = parse_string_array(policy_src, "publicUseAllowedStatuses")
    if public_use is None:
        errors.append(
            "could not parse DEFAULT_POLICY.publicUseAllowedStatuses from "
            "policy.ts"
        )
    else:
        for s in public_use:
            if s not in set(statuses):
                errors.append(
                    f"DEFAULT_POLICY.publicUseAllowedStatuses contains "
                    f"unknown status '{s}' "
                    f"(not in CommunityPhotoSubmissionStatus)"
                )
        if public_use != ["approved"]:
            errors.append(
                f"DEFAULT_POLICY.publicUseAllowedStatuses must be exactly "
                f"['approved'] (got: {public_use})"
            )

    # --- DEFAULT_POLICY.allowedTargetTypes ----------------------------
    allowed_targets = parse_string_array(policy_src, "allowedTargetTypes")
    if allowed_targets is None:
        errors.append(
            "could not parse DEFAULT_POLICY.allowedTargetTypes from policy.ts"
        )
    else:
        if "future_custom_place" in allowed_targets:
            errors.append(
                "DEFAULT_POLICY.allowedTargetTypes must NOT include "
                "'future_custom_place' (reserved for a later phase)"
            )
        for t in allowed_targets:
            if t not in set(target_types):
                errors.append(
                    f"DEFAULT_POLICY.allowedTargetTypes contains unknown "
                    f"target '{t}' "
                    f"(not in CommunityPhotoAttachmentTargetType)"
                )

    # --- HIGH_RISK_FLAGS subset check ---------------------------------
    high_risk = parse_const_array(policy_src, "HIGH_RISK_FLAGS")
    if high_risk is None:
        errors.append("could not parse HIGH_RISK_FLAGS from policy.ts")
    else:
        for f in high_risk:
            if f not in set(safety_flags):
                errors.append(
                    f"HIGH_RISK_FLAGS contains unknown flag '{f}' "
                    f"(not in CommunityPhotoSafetyFlag)"
                )

    if errors:
        print("FAIL: community-media validation failed:", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        return 1

    labeled_count = (
        len(status_label_keys)
        + len(source_label_keys)
        + len(safety_flag_label_keys)
    )
    print(f"PASS: community-media ({labeled_count} values labeled)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
