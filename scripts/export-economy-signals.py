#!/usr/bin/env python3
"""Merge per-city signals for the Economy & Jobs generator. Reads the Phase C
outputs /tmp/quality_signals.json (overall/air/energy/resilience/comfort/nature/
coastal/population/etc.) and /tmp/quality_scores.json (18 quality-of-life scores)
plus airport presence from lib/data/mobility.ts, and writes /tmp/economy_signals.json.
No network, no randomness. Run after export-quality-signals.py + generate-city-quality.py."""
import json, re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
sig = {r["slug"]: r for r in json.load(open("/tmp/quality_signals.json"))}
qol = {r["citySlug"]: r for r in json.load(open("/tmp/quality_scores.json"))}

# airport presence (verified airports only) from mobility.ts
mob = (ROOT / "lib/data/mobility.ts").read_text()
airport_cities = set(re.findall(r'citySlug: "([a-z0-9-]+)"', mob))

out = []
for slug, s in sig.items():
    q = qol.get(slug, {})
    out.append({
        "slug": slug,
        "name": s["name"],
        "countrySlug": s["countrySlug"],
        "region": s["region"],
        "population": s["population"],
        "overall": s["overall"],
        "affordability": s["affordability"],
        "airQuality": s["airQuality"],
        "energy": s["energy"],
        "resilience": s["resilience"],
        "comfort": s["comfort"],
        "natureCount": s["natureCount"],
        "coastal": s["coastal"],
        "mountain": s["mountain"],
        "lake": s["lake"],
        # quality-of-life signals reused as economy inputs
        "education": q.get("educationScore", 60),
        "infrastructure": q.get("infrastructureScore", 60),
        "healthcare": q.get("healthcareScore", 60),
        "mobility": q.get("mobilityScore", 60),
        "qualityOfLife": q.get("qualityOfLifeScore", 60),
        "digitalNomad": q.get("digitalNomadScore", 60),
        "walkability": q.get("walkabilityScore", 60),
        "cleanliness": q.get("cleanlinessScore", 60),
        "airport": slug in airport_cities,
    })

json.dump(out, open("/tmp/economy_signals.json", "w"), ensure_ascii=False)
print(f"wrote {len(out)} economy signal records; airport cities: {len(airport_cities)}")
