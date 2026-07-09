#!/usr/bin/env python3
"""Fill collection-coverage gaps for wave14 new cities so every new city has >=1
regional AND >=1 thematic collection (the deterministic-audit + task requirement).
Append-only city memberships into EXISTING room-having collections (guard/validator
have no city-level country/theme constraint — only place-level, untouched). Honest,
geography-appropriate targets; MAX_CITIES=80 guard NOT changed. Distributes across
multiple same-theme collections when one lacks room."""
import json, re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
CAP = 80
new = [c["slug"] for c in json.load(open("/tmp/w14/selected.json"))]
country = {c["slug"]: c["countrySlug"] for c in json.load(open("/tmp/w14/selected.json"))}
NEW = set(new)


def parse(path):
    """Return (ordered list of (slug, cities-list), full text). Splits per collection block."""
    text = (ROOT / path).read_text()
    blocks = text.split("\n  {\n")
    out = []
    for i in range(1, len(blocks)):
        b = blocks[i]
        sm = re.search(r'slug:\s*"([a-z0-9-]+)"', b)
        cm = re.search(r'\n(\s*)cities: \[(.*?)\]', b)
        if sm and cm:
            cities = re.findall(r'"([a-z0-9-]+)"', cm.group(2))
            out.append((sm.group(1), cities))
    return out, text


def coverage(parsed):
    from collections import Counter
    cov = Counter()
    for slug, cities in parsed:
        for c in cities:
            cov[c] += 1
    return cov


def splice(path, adds):
    """adds = {collection_slug: [city,...]} appended to each collection's cities array."""
    text = (ROOT / path).read_text()
    parts = text.split("\n  {\n")
    touched = added = 0
    for i in range(1, len(parts)):
        b = parts[i]
        sm = re.search(r'slug:\s*"([a-z0-9-]+)"', b)
        if not sm or sm.group(1) not in adds:
            continue
        m = re.search(r'(\n(\s*)cities: \[)(.*?)(\])', b)
        existing = re.findall(r'"([^"]+)"', m.group(3))
        to_add = [c for c in adds[sm.group(1)] if c not in existing]
        if not to_add:
            continue
        insert = "".join(f', "{c}"' for c in to_add)
        parts[i] = b[:m.start()] + m.group(1) + m.group(3) + insert + m.group(4) + b[m.end():]
        touched += 1; added += len(to_add)
    (ROOT / path).write_text("\n  {\n".join(parts))
    print(f"{path}: {touched} collections touched, +{added} memberships")


def assign(gap_cities, targets, sizes):
    """Greedily place gap cities into target collections (in order) respecting CAP.
    targets = ordered list of collection slugs; sizes = live {slug: count} (mutated)."""
    adds = {}
    ti = 0
    for city in gap_cities:
        placed = False
        for k in range(len(targets)):
            t = targets[(ti + k) % len(targets)]
            if sizes.get(t, 0) < CAP:
                adds.setdefault(t, []).append(city)
                sizes[t] += 1
                ti = (ti + k + 1) % len(targets)
                placed = True
                break
        if not placed:
            raise SystemExit(f"NO ROOM for {city} in {targets}")
    return adds


# ---------- REGIONAL ----------
rparsed, _ = parse("lib/data/regional-collections.ts")
rsize = {s: len(c) for s, c in rparsed}
rcov = coverage(rparsed)
noreg = [s for s in new if rcov.get(s, 0) < 1]
ch_gap = [s for s in noreg if country[s] == "switzerland"]
us_gap = [s for s in noreg if country[s] == "united-states"]
other_gap = [s for s in noreg if country[s] not in ("switzerland", "united-states")]
print(f"regional gaps: CH={len(ch_gap)} US={len(us_gap)} other={len(other_gap)} {other_gap[:5]}")
radds = {}
# CH -> central-europe-weekend-escapes (Alpine/Central Europe; room), fallback european-mountains/lakes
for t, lst in assign(ch_gap, ["central-europe-weekend-escapes", "european-mountains", "european-lakes"], rsize).items():
    radds.setdefault(t, []).extend(lst)
# US -> united-states-national-parks (near protected parkland; room), fallback coast/river
for t, lst in assign(us_gap, ["united-states-national-parks", "united-states-coast", "united-states-river-valleys"], rsize).items():
    radds.setdefault(t, []).extend(lst)
# any other-country regional gap -> its country's weekend-escapes / continental fallback
if other_gap:
    for s in other_gap:
        cc = country[s]
        cands = [f"{cc}-weekend-escapes", "central-europe-weekend-escapes", "western-europe-weekend-escapes"]
        cands = [c for c in cands if c in rsize]
        for t, lst in assign([s], cands, rsize).items():
            radds.setdefault(t, []).extend(lst)
splice("lib/data/regional-collections.ts", radds)

# ---------- THEMATIC ----------
tparsed, _ = parse("lib/data/thematic-collections.ts")
tsize = {s: len(c) for s, c in tparsed}
tcov = coverage(tparsed)
nothe = [s for s in new if tcov.get(s, 0) < 1]
us_t = [s for s in nothe if country[s] == "united-states"]
uk_t = [s for s in nothe if country[s] == "united-kingdom"]
other_t = [s for s in nothe if country[s] not in ("united-states", "united-kingdom")]
print(f"thematic gaps: US={len(us_t)} UK={len(uk_t)} other={len(other_t)} {other_t[:5]}")
tadds = {}
# NATURE-only themes (exclude city-attribute economy/education themes to stay honest)
ATTR = {"safest_cities", "family_friendly_cities", "digital_nomad_cities", "retirement_friendly_cities",
        "high_quality_of_life_cities", "technology_cities", "startup_cities", "business_hubs",
        "remote_work_cities", "finance_centers", "manufacturing_cities", "research_cities",
        "tourism_economies", "government_centers", "innovation_cities", "academic_research_cities",
        "student_cities", "university_cities", "engineering_education_cities", "medical_education_cities",
        "business_education_cities", "international_student_cities", "technology_education_hubs",
        "academic_capitals", "knowledge_economy_cities", "healthcare_cities", "medical_centers",
        "university_medical_cities", "healthcare_access_cities", "healthy_living_cities",
        "active_lifestyle_cities", "senior_friendly_cities", "retirement_cities",
        "affordable_retirement_cities", "nature_retirement_cities"}
theme_of = {s: t for s, t in ((sl, re.search(r'themeType:\s*"([a-z_]+)"', open(ROOT / "lib/data/thematic-collections.ts").read().split("\n  {\n")[i]).group(1)) for i, (sl, _) in enumerate(tparsed, start=1))}


def nature_targets(prefixes):
    cands = [s for s, _ in tparsed
             if any(s.startswith(p) for p in prefixes)
             and tsize.get(s, 0) < CAP and theme_of.get(s) not in ATTR]
    cands.sort(key=lambda s: -(CAP - tsize.get(s, 0)))  # most room first
    return cands


us_targets = nature_targets(["united-states-", "north-american-"])
uk_targets = nature_targets(["united-kingdom-"])
print(f"US nature-theme targets w/ room: {[(t, CAP-tsize[t]) for t in us_targets[:8]]}")
print(f"UK nature-theme targets w/ room: {[(t, CAP-tsize[t]) for t in uk_targets[:8]]}")
for t, lst in assign(us_t, us_targets, tsize).items():
    tadds.setdefault(t, []).extend(lst)
for t, lst in assign(uk_t, uk_targets, tsize).items():
    tadds.setdefault(t, []).extend(lst)
if other_t:
    raise SystemExit(f"unexpected other-country thematic gaps: {other_t}")
splice("lib/data/thematic-collections.ts", tadds)

# ---------- verify ----------
rcov2 = coverage(parse("lib/data/regional-collections.ts")[0])
tcov2 = coverage(parse("lib/data/thematic-collections.ts")[0])
still_r = [s for s in new if rcov2.get(s, 0) < 1]
still_t = [s for s in new if tcov2.get(s, 0) < 1]
mx_r = max(len(c) for _, c in parse("lib/data/regional-collections.ts")[0])
mx_t = max(len(c) for _, c in parse("lib/data/thematic-collections.ts")[0])
print(f"after: new w/o regional={len(still_r)} w/o thematic={len(still_t)} | max reg={mx_r} max the={mx_t}")
assert not still_r and not still_t and mx_r <= CAP and mx_t <= CAP, "gap fill incomplete or CAP exceeded"
print("GAP FILL OK")
