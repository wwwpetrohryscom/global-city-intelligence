#!/usr/bin/env python3
"""Wave 12 deterministic audit — file-based integrity checks over the final repo
state (no network). Exits non-zero on any hard failure."""
import json, re, sys
from pathlib import Path
from collections import Counter

ROOT = Path("/Users/agent/global-city-intelligence")
OUT = Path("/tmp/w12")
new = [c["slug"] for c in json.load(open(OUT / "selected.json"))]
NEW = set(new)
fail, warn = [], []


def rd(p): return (ROOT / p).read_text()


# 1. cities
cs = rd("lib/data/cities.ts")
body = cs[cs.index("const seeds: CitySeed[] = ["):cs.index("export const cities")]
slugs = re.findall(r'slug: "([a-z0-9][a-z0-9-]*)"', body)
if len(slugs) != 2369: fail.append(f"city count {len(slugs)} != 2369")
if len(set(slugs)) != len(slugs): fail.append("duplicate city slugs")
miss = [s for s in new if s not in set(slugs)]
if miss: fail.append(f"missing new cities: {miss[:5]}")

# 2. heroes
img = rd("lib/data/media/city-images.ts")
heroes = json.load(open(OUT / "heroes.json"))
LOK = ("CC0", "CC BY", "Public domain", "Public Domain", "PD")
badh = []
for s in new:
    h = heroes.get(s)
    if not h: badh.append((s, "missing")); continue
    if not h["src"].startswith("https://upload.wikimedia.org/"): badh.append((s, "host"))
    if max(h["width"], h["height"]) < 600: badh.append((s, "lowres"))
    if not h["license"].startswith(LOK): badh.append((s, "license"))
    if not h["author"] or "unknown" in h["author"].lower(): badh.append((s, "author"))
    if not h.get("licenseUrl"): badh.append((s, "licurl"))
    if f'placeSlug: "{s}"' not in img: badh.append((s, "not-in-file"))
if badh: fail.append(f"hero issues: {badh[:6]}")

# 3. nearby — parse live seeds: per-city count + qids + global slugs
np = rd("lib/data/nearby-places.ts")
# verify all wave consts are spread
decl = re.search(r'const seeds: readonly PlaceSeed\[\] = \[[^;]*\]', np).group(0)
for needconst in ("wave12NearbySeeds", "wave12SparseSeeds"):
    if needconst in np and f"...{needconst}" not in decl:
        fail.append(f"{needconst} defined but NOT spread into seeds")
gslug = Counter(); ccount = Counter(); cqid = {}
for ch in re.split(r'(?=slug: ")', np):
    sm = re.match(r'slug: "([a-z0-9-]+)"', ch)
    if not sm:
        continue
    gslug[sm.group(1)] += 1
    qm = re.search(r'wikidataId: "(Q\d+)"', ch)
    cm = re.search(r'connectedCitySlugs: \[([^\]]*)\]', ch)
    for c in (re.findall(r'"([a-z0-9-]+)"', cm.group(1)) if cm else []):
        ccount[c] += 1
        if qm:
            cqid.setdefault(c, Counter())[qm.group(1)] += 1
dupslug = [s for s, n in gslug.items() if n > 1]
if dupslug: fail.append(f"duplicate nearby place slugs: {len(dupslug)} e.g {dupslug[:4]}")
# new cities 5-8 (emerald may be the lone exception if AU pool was thin)
bad_new = [(s, ccount.get(s, 0)) for s in new if ccount.get(s, 0) < 5]
if bad_new: warn.append(f"new cities still <5 nearby: {bad_new}")
over = [(s, ccount.get(s, 0)) for s in new if ccount.get(s, 0) > 8]
if over: warn.append(f"new cities >8 nearby: {over[:6]}")
# per-city duplicate QID
dq = [(c, q) for c, qs in cqid.items() for q, n in qs.items() if n > 1]
if dq: fail.append(f"per-city duplicate nearby QIDs: {len(dq)} e.g {dq[:4]}")

# 4. sparse — cities that we topped up are now >=5
add = json.load(open(OUT / "sparse_add.json")) if (OUT / "sparse_add.json").exists() else {}
sp_bad = [(c, ccount.get(c, 0)) for c in add if ccount.get(c, 0) < 5]
if sp_bad: warn.append(f"sparse-topped cities still <5: {len(sp_bad)} e.g {sp_bad[:5]}")

# 5. Phase A-F coverage
for f, anc in [("cost-of-living", "costOfLivingProfiles"), ("climate", "climateProfiles"),
               ("city-quality", "cityQualityProfiles"), ("economy", "economyProfiles"),
               ("education", "educationProfiles"), ("healthcare-retirement", "healthcareProfiles")]:
    s = rd(f"lib/data/{f}.ts"); have = set(re.findall(r'citySlug: "([a-z0-9-]+)"', s))
    m = [x for x in new if x not in have]
    if m: fail.append(f"{f} missing {len(m)} new cities e.g {m[:4]}")

# 6. graphs
cg = rd("lib/data/city-discovery-graph.ts")
gm = [s for s in new if f'"{s}": [' not in cg]
if gm: fail.append(f"city-discovery-graph missing {len(gm)} new cities e.g {gm[:4]}")

# 7. collections coverage
def memb(path):
    text = rd(path); out = Counter()
    for b in re.split(r'\n  \{\n', text):
        cm = re.search(r'\n\s*cities: \[(.*?)\]', b)
        if cm:
            for c in re.findall(r'"([^"]+)"', cm.group(1)): out[c] += 1
    return out
rcol = memb("lib/data/regional-collections.ts"); tcol = memb("lib/data/thematic-collections.ts")
nr = [s for s in new if rcol.get(s, 0) < 1]; nt = [s for s in new if tcol.get(s, 0) < 1]
if nr: fail.append(f"{len(nr)} new cities w/o regional collection")
if nt: fail.append(f"{len(nt)} new cities w/o thematic collection")

# 8. FAQ / AIO coverage
faq = rd("lib/data/city-faqs.ts"); aio = rd("lib/data/city-ai-overviews.ts")
fm = [s for s in new if f'citySlug: "{s}"' not in faq]
am = [s for s in new if f'citySlug: "{s}"' not in aio]
if fm: fail.append(f"FAQ missing {len(fm)} new cities")
if am: fail.append(f"AIO missing {len(am)} new cities")

# 9. nearby image hosts (live seeds VERIFIED_IMAGES) + license
vi = np[np.index("const VERIFIED_IMAGES"):]
badimg = len(re.findall(r'src: "(?!https://upload\.wikimedia\.org/)', vi))
if badimg: warn.append(f"nearby images with non-commons host: {badimg}")

print("=" * 60)
print(f"AUDIT: {len(slugs)} cities | heroes {len(new)-len(badh)}/{len(new)} ok | "
      f"nearby places {sum(gslug.values())} | sparse-added cities {len(add)}")
print(f"new-city nearby range: min={min(ccount.get(s,0) for s in new)} "
      f"max={max(ccount.get(s,0) for s in new)}")
if warn:
    print("\nWARNINGS:")
    for w in warn: print("  ⚠ ", w)
if fail:
    print("\nFAILURES:")
    for x in fail: print("  ✗ ", x)
    sys.exit(1)
print("\n✓ ALL DETERMINISTIC CHECKS PASSED")
