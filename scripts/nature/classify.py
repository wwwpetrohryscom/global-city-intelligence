#!/usr/bin/env python3
"""Classify every nearby place into the canonical nature taxonomy.

Emits scripts/nature/cache/classification.json:
  { placeSlug: {primary, categories, confidence, evidence, vetoed} }

Confidence tiers:
  high    - at least one P31 value is in the curated TYPE_CATEGORIES map
  medium  - resolved through one P279 hop from a P31 value
  low     - resolved only from the TYPE label pattern
  none    - no structured evidence; the place is not published as nature
"""
import json, re, sys, collections
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from taxonomy import (CATEGORY_PRIORITY, VETO_TYPE_QIDS, SOFT_VETO_TYPE_QIDS,
                      VETO_PLACE_QIDS,
                      VETO_TYPE_LABEL, HARD_VETO_TYPE_LABEL, TYPE_CATEGORIES,
                      SUPERCLASS_CATEGORIES, LABEL_CATEGORIES, NAME_DEMOTIONS)

CACHE = HERE / "cache"
types = json.load(open(CACHE / "place-types.json"))
places = json.load(open(CACHE / "places-compact.json"))
VETO_RE = re.compile(VETO_TYPE_LABEL, re.I)
HARD_VETO_RE = re.compile(HARD_VETO_TYPE_LABEL, re.I)
LABEL_RULES = [(re.compile(p, re.I), c) for p, c in LABEL_CATEGORIES]
DEMOTE_RULES = [(re.compile(p, re.I), c) for p, c in NAME_DEMOTIONS]
PRIO = {c: i for i, c in enumerate(CATEGORY_PRIORITY)}

out, stats = {}, collections.Counter()
veto_reasons = collections.Counter()
for p in places:
    t = types.get(p["qid"]) or {"p31": {}, "super": {}}
    p31, sup = t["p31"], t["super"]

    # A curated type in TYPE_CATEGORIES is an explicit editorial decision and
    # outranks the label regex, so "natural monument" and "country park" are
    # not vetoed by the generic /monument/ and /\bcountry\b/ patterns. Only
    # VETO_TYPE_QIDS, which is also curated, is unconditional.
    veto = None
    if p["qid"] in VETO_PLACE_QIDS:
        veto = f"landmass-scale entity:{p['qid']}"
    for q, lab in p31.items():
        if veto:
            break
        if q in VETO_TYPE_QIDS:
            veto = f"type:{q} ({lab})"
        elif lab and HARD_VETO_RE.search(lab):
            veto = f"hard-type-label:{q} ({lab})"
    if veto is None and not any(q in TYPE_CATEGORIES for q in p31):
        for q, lab in p31.items():
            if q in SOFT_VETO_TYPE_QIDS:
                veto = f"soft-type:{q} ({lab})"
                break
            if lab and VETO_RE.search(lab):
                veto = f"type-label:{q} ({lab})"
                break
    if veto:
        out[p["slug"]] = {"primary": None, "categories": [], "confidence": "none",
                          "evidence": [], "vetoed": veto}
        stats["vetoed"] += 1
        veto_reasons[veto.split(" (")[1][:-1] if "(" in veto else veto] += 1
        continue

    cats, evidence, conf = [], [], None
    for q, lab in sorted(p31.items()):
        if q in TYPE_CATEGORIES:
            cats += TYPE_CATEGORIES[q]
            evidence.append(q)
    if cats:
        conf = "high"
    else:
        for q, lab in sorted(sup.items()):
            if q in SUPERCLASS_CATEGORIES:
                cats += SUPERCLASS_CATEGORIES[q]
                evidence.append(q)
        if cats:
            conf = "medium"
        else:
            for q, lab in sorted(p31.items()):
                if not lab:
                    continue
                for rx, c in LABEL_RULES:
                    if rx.search(lab):
                        cats += c
                        evidence.append(q)
                        break
                if cats:
                    break
            if cats:
                conf = "low"

    cats = sorted(set(cats), key=lambda c: PRIO[c])
    if cats:
        for rx, remove in DEMOTE_RULES:
            if rx.search(p["name"]):
                kept = [c for c in cats if c not in remove]
                if kept:
                    cats = kept
    out[p["slug"]] = {"primary": cats[0] if cats else None, "categories": cats,
                      "confidence": conf or "none", "evidence": sorted(set(evidence)),
                      "vetoed": None}
    stats[conf or "none"] += 1

json.dump(out, open(CACHE / "classification.json", "w"))
print("confidence:", dict(stats))
prim = collections.Counter(v["primary"] for v in out.values() if v["primary"])
print("\nprimary category distribution:")
for k, n in prim.most_common():
    print(f"  {k:16s} {n:6d}")
mem = collections.Counter()
for v in out.values():
    for c in v["categories"]:
        mem[c] += 1
print("\nmembership (a place may belong to several):")
for k, n in mem.most_common():
    print(f"  {k:16s} {n:6d}")
print(f"\nunclassified (no structured evidence): {stats['none'] - stats['vetoed'] if stats['none'] >= stats['vetoed'] else stats['none']}")
print("\ntop veto reasons:")
for k, n in veto_reasons.most_common(20):
    print(f"  {n:5d}  {k}")
