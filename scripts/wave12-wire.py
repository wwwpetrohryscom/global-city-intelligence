#!/usr/bin/env python3
"""Wave 12 wiring: splice 250 resolved cities + heroes + nearby places into repo
data files. Deterministic; reads /tmp/w12/{selected,heroes,nearby}.json.
Append-only: existing rows untouched."""
import json, re, hashlib
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
DATE = "2026-06-28"
sel = json.load(open("/tmp/w12/selected.json"))
heroes = json.load(open("/tmp/w12/heroes.json"))
nearby = json.load(open("/tmp/w12/nearby.json"))

COUNTRY_NAME = {"united-states": "United States", "canada": "Canada", "australia": "Australia",
                "germany": "Germany", "france": "France", "united-kingdom": "United Kingdom"}
REGION = {"united-states": "North America", "canada": "North America", "australia": "Oceania",
          "germany": "Central Europe", "france": "Western Europe", "united-kingdom": "Western Europe"}

def pop_label(p):
    p = float(p)
    if p >= 1e6: return f"~{p/1e6:.1f}M"
    return f"~{round(p/1000)}K"

# normalize cities
cities = []
for c in sel:
    cities.append({
        "slug": c["slug"], "name": c["name"], "qid": c["qid"],
        "countrySlug": c["countrySlug"], "countryName": COUNTRY_NAME[c["countrySlug"]],
        "region": REGION[c["countrySlug"]], "populationLabel": pop_label(c["population"]),
        "hero": heroes.get(c["slug"]),
    })
cityByslug = {c["slug"]: c for c in cities}

def j(v): return json.dumps(v, ensure_ascii=False)
def hjit(slug, lo, hi):
    h = int(hashlib.md5(slug.encode()).hexdigest(), 16)
    return lo + (h % (hi - lo + 1))
def clamp(x): return max(35, min(95, x))

TIER = {}
for c in ["germany", "france", "united-kingdom"]:
    TIER[c] = (78, 48, 78, 80, 80)
for c in ["united-states", "canada"]:
    TIER[c] = (76, 52, 70, 78, 72)
TIER["australia"] = (77, 50, 76, 76, 74)
DEF = (62, 60, 62, 62, 60)
CAT_WORD = {"nature": "natural area", "park": "park", "mountain": "mountain area",
            "lake": "lake", "beach": "beach", "island": "island", "waterfront": "waterfront area"}

# ---------- 1. cities.ts seed blocks ----------
city_blocks = [f"  // ===== Wave 12: +250 cities (US/CA/AU/DE/FR/NL), A-F complete ({DATE}) ====="]
for c in cities:
    ov, aff, air, en, res = TIER.get(c["countrySlug"], DEF)
    jit = hjit(c["slug"], -4, 4)
    scores = {
        "overall": clamp(ov + jit), "affordability": clamp(aff - jit),
        "airQuality": clamp(air + hjit(c["slug"] + "a", -5, 5)),
        "energy": clamp(en + hjit(c["slug"] + "e", -4, 4)),
        "resilience": clamp(res + hjit(c["slug"] + "r", -4, 4)),
    }
    pop, region, cn = c["populationLabel"], c["region"], c["countryName"]
    intro = (f"{c['name']} is an indexed city in {cn} ({region}), with a metropolitan population of "
             f"about {pop}. This profile brings together deterministic city-intelligence indicators "
             f"for {c['name']} spanning cost of living, climate, safety and quality of life, economy "
             f"and jobs, education, and healthcare.")
    outlook = (f"Use the {c['name']} profile to compare affordability, livability, and economic "
               f"indicators against other indexed cities in {cn} and across {region}, and to explore "
               f"nearby nature and weekend destinations.")
    city_blocks.append(
        "  buildNeutralCitySeed({\n"
        f"    slug: {j(c['slug'])},\n    name: {j(c['name'])},\n"
        f"    countrySlug: {j(c['countrySlug'])},\n    countryName: {j(cn)},\n"
        f"    region: {j(region)},\n    population: {j(pop)},\n"
        f"    intro:\n      {j(intro)},\n    outlook:\n      {j(outlook)},\n"
        f"    scores: {{ overall: {scores['overall']}, affordability: {scores['affordability']}, "
        f"airQuality: {scores['airQuality']}, energy: {scores['energy']}, resilience: {scores['resilience']} }},\n"
        "  }),")
src = (ROOT / "lib/data/cities.ts").read_text()
anchor = "\n];\n\nexport const cities: City[] = seeds.map(buildCity);"
assert anchor in src, "cities anchor not found"
src = src.replace(anchor, "\n" + "\n".join(city_blocks) + "\n];\n\nexport const cities: City[] = seeds.map(buildCity);")
(ROOT / "lib/data/cities.ts").write_text(src)
print(f"cities.ts: +{len(cities)} seeds")

# ---------- 2. city-images.ts heroes ----------
hero_blocks = [f"  // ===== Wave 12 heroes ({DATE}) ====="]
hn = 0
for c in cities:
    h = c.get("hero")
    if not h: continue
    hn += 1
    fields = [
        f"    id: {j('city-' + c['slug'] + '-hero')},",
        f"    placeSlug: {j(c['slug'])},",
        "    placeType: \"city\",", "    imageType: \"hero\",",
        f"    src: {j(h['src'])},",
        f"    width: {int(h['width'])},", f"    height: {int(h['height'])},",
        f"    alt: {j(h.get('alt') or ('View of ' + c['name'] + ', ' + c['countryName']))},",
        "    source: \"wikimedia\",",
        f"    sourceUrl: {j(h['sourceUrl'])},",
        f"    author: {j(h['author'])},",
    ]
    if h.get("authorUrl"): fields.append(f"    authorUrl: {j(h['authorUrl'])},")
    fields.append(f"    license: {j(h['license'])},")
    fields.append(f"    licenseUrl: {j(h['licenseUrl'])},")
    fields.append(f"    attributionText: {j(h['attributionText'])},")
    fields.append("    verified: true,")
    fields.append(f"    verifiedAt: {j(DATE)},")
    fields.append(f"    notes: {j('Resolved via Wikidata ' + c['qid'] + ' -> Commons file ' + (h.get('commonsFile') or ''))},")
    hero_blocks.append("  {\n" + "\n".join(fields) + "\n  },")
img_src = (ROOT / "lib/data/media/city-images.ts").read_text()
concat = "export const cityImages: PlaceImage[] = [...cityImagesBase, ...cityImagesWave8, ...cityImagesWave9, ...cityImagesWave10, ...cityImagesWave11];"
assert concat in img_src, "cityImages concat not found"
new_block = ("const cityImagesWave12: PlaceImage[] = [\n" + "\n".join(hero_blocks) + "\n];\n\n"
             "export const cityImages: PlaceImage[] = [...cityImagesBase, ...cityImagesWave8, ...cityImagesWave9, ...cityImagesWave10, ...cityImagesWave11, ...cityImagesWave12];")
img_src = img_src.replace(concat, new_block)
(ROOT / "lib/data/media/city-images.ts").write_text(img_src)
print(f"city-images.ts: +{hn} heroes (cityImagesWave12 const)")

# ---------- 3. nearby-places.ts: wave12NearbySeeds + VERIFIED_IMAGES ----------
seed_lines = ["const wave12NearbySeeds: readonly PlaceSeed[] = ["]
img_lines = [f"  // ===== Wave 12 verified images ({DATE}) ====="]
facts_lines = [f"  // ===== Wave 12 facts ({DATE}) ====="]
detail_slugs = []
place_total = 0
for cs, places in nearby.items():
    for p in places:
        place_total += 1
        sf = [
            f"    slug: {j(p['slug'])},", f"    name: {j(p['name'])},",
            f"    countrySlug: {j(p['countrySlug'])},", f"    regionName: {j(p['regionName'])},",
            f"    category: {j(p['category'])},",
        ]
        sf.append(f"    summary:\n      {j(p['summary'])},")
        sf.append(f"    connectedCitySlugs: {j(p['connectedCitySlugs'])},")
        sf.append(f"    distanceBand: {j(p['distanceBand'])},")
        sf.append(f"    wikidataId: {j(p['wikidataId'])},")
        if p.get("officialUrl"):
            sf.append(f"    officialUrl: {j(p['officialUrl'])},")
        sf.append(f"    latitude: {p['latitude']},")
        sf.append(f"    longitude: {p['longitude']},")
        sf.append("    coordinateSource: \"wikidata\",")
        sf.append(f"    verificationStatus: {j(p['verificationStatus'])},")
        seed_lines.append("  {\n" + "\n".join(sf) + "\n  },")
        im = p["img"]
        ifields = [
            f"    src: {j(im['src'])},", f"    width: {int(im['width'])},", f"    height: {int(im['height'])},",
            f"    alt: {j(im['alt'])},", "    source: \"wikimedia-commons\",",
            f"    sourceUrl: {j(im['sourceUrl'])},", f"    author: {j(im['author'])},",
        ]
        if im.get("authorUrl"): ifields.append(f"    authorUrl: {j(im['authorUrl'])},")
        ifields += [
            f"    license: {j(im['license'])},", f"    licenseUrl: {j(im['licenseUrl'])},",
            f"    attributionText: {j(im['attributionText'])},",
            "    verified: true,", f"    verifiedAt: {j(DATE)},",
        ]
        img_lines.append(f"  {j(p['slug'])}: {{\n" + "\n".join(ifields) + "\n  },")
        # detail pages + facts require an authority URL (officialUrl) AND a
        # letter-first slug (the detail-slugs validator regex is [a-z][a-z0-9-]*)
        if p["verificationStatus"] == "verified" and p.get("officialUrl") and p["slug"][:1].isalpha():
            detail_slugs.append(p["slug"])
            fa = p["facts"]; fparts = []
            if fa.get("designation"): fparts.append(f"designation: {j(fa['designation'])}")
            if fa.get("iucnCategory"): fparts.append(f"iucnCategory: {j(fa['iucnCategory'])}")
            if fa.get("established"): fparts.append(f"established: {int(fa['established'])}")
            fparts.append(f"wikidataId: {j(p['wikidataId'])}")
            facts_lines.append(f"  {j(p['slug'])}: {{ " + ", ".join(fparts) + " },")
seed_lines.append("];")

np_src = (ROOT / "lib/data/nearby-places.ts").read_text()
seeds_decl = "const seeds: readonly PlaceSeed[] = [...baseSeeds, ...batchSevenDensitySeeds, ...wave1NearbySeeds, ...wave2NearbySeeds, ...wave3NearbySeeds, ...wave4NearbySeeds, ...wave5NearbySeeds, ...wave6NearbySeeds, ...wave7NearbySeeds, ...wave8NearbySeeds, ...wave9NearbySeeds, ...wave10NearbySeeds, ...wave11NearbySeeds];"
assert seeds_decl in np_src, "seeds decl not found"
np_src = np_src.replace(seeds_decl,
    "\n".join(seed_lines) + "\n\n" + seeds_decl.replace("...wave10NearbySeeds]", "...wave10NearbySeeds, ...wave12NearbySeeds]"))
vi_close = np_src.index("\n};", np_src.index("const VERIFIED_IMAGES"))
np_src = np_src[:vi_close] + "\n" + "\n".join(img_lines) + np_src[vi_close:]
(ROOT / "lib/data/nearby-places.ts").write_text(np_src)
print(f"nearby-places.ts: +{place_total} seeds + images (wave12NearbySeeds const)")

# ---------- 4. facts ----------
facts_src = (ROOT / "lib/data/nearby-place-facts.ts").read_text()
idx = facts_src.rfind("\n};")
facts_src = facts_src[:idx] + "\n" + "\n".join(facts_lines) + facts_src[idx:]
(ROOT / "lib/data/nearby-place-facts.ts").write_text(facts_src)
print(f"nearby-place-facts.ts: +{len(facts_lines)-1} facts")

# ---------- 5. detail-slugs (verified only) ----------
det_src = (ROOT / "lib/data/nearby-place-detail-pages.ts").read_text()
det_block = f"  // ===== Wave 12 verified detail pages ({DATE}) =====\n" + "\n".join(f"  {j(s)}," for s in detail_slugs)
idx = det_src.rfind("\n] as const;")
det_src = det_src[:idx] + "\n" + det_block + det_src[idx:]
(ROOT / "lib/data/nearby-place-detail-pages.ts").write_text(det_src)
print(f"nearby-place-detail-pages.ts: +{len(detail_slugs)} detail slugs")

# ---------- 6. weekend-trip + visual-guides ----------
WF = ["general_weekend_planning", "city_break", "culture_context", "family_weekend", "arrival_and_transport", "visual_orientation"]
VF = ["general_city_context", "relocation_visual_context", "arrival_visual_context", "neighborhood_visual_context", "transport_visual_context", "remote_work_visual_context", "family_visual_context"]
wt_lines = [f"  // ===== Wave 12 ({DATE}) ====="]
vg_lines = [f"  // ===== Wave 12 ({DATE}) ====="]
for i, c in enumerate(cities):
    wt_lines.append(f"  {{ citySlug: {j(c['slug'])}, cityName: {j(c['name'])}, countryName: {j(c['countryName'])}, weekendFocus: {j(WF[i % len(WF)])} }},")
    vg_lines.append(f"  {{ citySlug: {j(c['slug'])}, cityName: {j(c['name'])}, countryName: {j(c['countryName'])}, visualFocus: {j(VF[i % len(VF)])}, context: \"nature and weekend discovery, arrival and neighborhood planning links\" }},")
wt_src = (ROOT / "lib/data/weekend-trip.ts").read_text()
idx = wt_src.index("\n];", wt_src.index("const seeds: readonly Seed[] = ["))
wt_src = wt_src[:idx] + "\n" + "\n".join(wt_lines) + wt_src[idx:]
(ROOT / "lib/data/weekend-trip.ts").write_text(wt_src)
vg_src = (ROOT / "lib/data/visual-guides.ts").read_text()
idx = vg_src.index("\n];", vg_src.index("const seeds: readonly Seed[] = ["))
vg_src = vg_src[:idx] + "\n" + "\n".join(vg_lines) + vg_src[idx:]
(ROOT / "lib/data/visual-guides.ts").write_text(vg_src)
print(f"weekend-trip.ts + visual-guides.ts: +{len(cities)} each")
print("WIRING DONE")
