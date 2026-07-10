#!/usr/bin/env python3
"""Wave 11 Phase 6 (APPEND-ONLY): generate Phase A-F rows for the 250 NEW cities
only and splice them into the existing data files. Existing rows untouched.
Run AFTER wave11-wire.py (cities.ts + nearby-places.ts must already contain new cities)."""
import json, subprocess, sys
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
sel = json.load(open("/tmp/w17/selected.json"))
new_slugs = [c["slug"] for c in sel]

# 1. col_cities.json = 250 NEW cities only (deterministic inputs for generators)
COUNTRY_NAME = {"greece": "Greece", "hungary": "Hungary", "bulgaria": "Bulgaria",
                "slovenia": "Slovenia", "serbia": "Serbia", "lithuania": "Lithuania",
                "latvia": "Latvia", "estonia": "Estonia", "montenegro": "Montenegro",
                "ukraine": "Ukraine", "belarus": "Belarus", "russia": "Russia",
                "turkey": "Turkey", "israel": "Israel", "czechia": "Czechia"}
REGION = {"greece": "Southern Europe", "hungary": "Central Europe", "bulgaria": "Southeastern Europe",
          "slovenia": "Central Europe", "serbia": "Southeastern Europe", "lithuania": "Baltic Europe",
          "latvia": "Baltic Europe", "estonia": "Baltic Europe", "montenegro": "Southeastern Europe",
          "ukraine": "Eastern Europe", "belarus": "Eastern Europe", "russia": "Eastern Europe",
          "turkey": "Western Asia", "israel": "Western Asia", "czechia": "Central Europe"}
def pop_label(p):
    p = float(p)
    return f"~{p/1e6:.1f}M" if p >= 1e6 else f"~{round(p/1000)}K"
# affordability must match what wire wrote into cities.ts. Re-derive identically.
import hashlib
def hjit(slug, lo, hi):
    h = int(hashlib.md5(slug.encode()).hexdigest(), 16); return lo + (h % (hi - lo + 1))
def clamp(x): return max(35, min(95, x))
TIER = {}
TIER["greece"] = (74, 60, 74, 72, 72)
TIER["hungary"] = (74, 62, 70, 74, 72)
TIER["bulgaria"] = (72, 66, 66, 70, 68)
TIER["slovenia"] = (76, 58, 78, 78, 76)
TIER["serbia"] = (70, 66, 64, 68, 66)
TIER["lithuania"] = (75, 62, 74, 76, 74)
TIER["latvia"] = (74, 62, 72, 74, 72)
TIER["estonia"] = (76, 60, 78, 78, 76)
TIER["montenegro"] = (70, 64, 68, 68, 66)
TIER["ukraine"] = (66, 70, 60, 64, 58)
TIER["belarus"] = (66, 70, 62, 66, 62)
TIER["russia"] = (68, 66, 60, 70, 64)
TIER["turkey"] = (70, 64, 62, 70, 66)
TIER["israel"] = (76, 46, 70, 76, 74)
TIER["czechia"] = (74, 62, 70, 74, 72)
col = []
coords = {}
for c in sel:
    ov, aff, air, en, res = TIER[c["countrySlug"]]
    jit = hjit(c["slug"], -4, 4)
    affordability = clamp(aff - jit)
    col.append({"slug": c["slug"], "name": c["name"], "countrySlug": c["countrySlug"],
                "region": REGION[c["countrySlug"]], "population": pop_label(c["population"]),
                "affordability": affordability})
    coords[c["slug"]] = {"lat": round(c["lat"], 5), "lon": round(c["lon"], 5)}
json.dump(col, open("/tmp/col_cities.json", "w"), ensure_ascii=False)
json.dump(coords, open("/tmp/city_coords.json", "w"))
print(f"col_cities.json = {len(col)} new cities; city_coords.json = {len(coords)}")

def find_array_span(text, const_name):
    i = text.index(f"export const {const_name}")
    open_i = text.index("[", text.index("= [", i))
    depth = 0; j = open_i
    while j < len(text):
        if text[j] == "[": depth += 1
        elif text[j] == "]":
            depth -= 1
            if depth == 0: return open_i, j
        j += 1
    raise RuntimeError(f"no close for {const_name}")

def run_and_splice(gen_script, target_rel, array_names):
    target = ROOT / target_rel
    original = target.read_text()
    r = subprocess.run([sys.executable, str(ROOT / "scripts" / gen_script)], capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  GEN FAIL {gen_script}:\n{r.stderr[-1500:]}"); raise SystemExit(1)
    generated = target.read_text()
    out = original
    added = {}
    for name in array_names:
        go, gc = find_array_span(generated, name)
        inner = generated[go + 1:gc].rstrip()
        if not inner.strip():
            added[name] = 0; continue
        oo, oc = find_array_span(out, name)
        before = out[:oc].rstrip()
        # ensure the existing last record ends cleanly then append new records
        if not before.endswith(","):
            before = before + ","
        block = f"\n  // ===== Wave 17 ({len(new_slugs)} new) =====\n" + inner.lstrip("\n") + "\n"
        out = before + block + out[oc:]
        added[name] = inner.count("citySlug:") or inner.count("slug:") or inner.count("{")
    target.write_text(out)
    print(f"  {target_rel}: spliced arrays {list(array_names)} (~{added})")

# Phase B: climate (append-only) -- must run before quality signals (reads climate comfort)
run_and_splice("generate-climate.py", "lib/data/climate.ts", ["climateProfiles"])
# Phase A: cost-of-living
run_and_splice("generate-cost-of-living.py", "lib/data/cost-of-living.ts", ["costOfLivingProfiles"])
# signals -> Phase C
subprocess.run([sys.executable, str(ROOT / "scripts/export-quality-signals.py")], check=True)
run_and_splice("generate-city-quality.py", "lib/data/city-quality.ts", ["cityQualityProfiles"])
# signals -> Phase D
subprocess.run([sys.executable, str(ROOT / "scripts/export-economy-signals.py")], check=True)
run_and_splice("generate-economy.py", "lib/data/economy.ts", ["economyProfiles", "jobsProfiles"])
# Phase E
run_and_splice("generate-education.py", "lib/data/education.ts", ["educationProfiles", "universities"])
# Phase F
run_and_splice("generate-healthcare.py", "lib/data/healthcare-retirement.ts",
               ["healthcareProfiles", "retirementProfiles", "medicalFacilities"])
print("PHASE 6 APPEND DONE")
