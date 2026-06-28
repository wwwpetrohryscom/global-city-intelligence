#!/usr/bin/env python3
"""Re-splice ONLY heroes + nearby seeds/images + facts after fix_media corrected
the data. Run AFTER `git checkout` of city-images.ts, nearby-places.ts,
nearby-place-facts.ts (revert to HEAD). cities/weekend/visual/detail/graphs/PhaseA-F
are NOT touched (their content does not depend on the corrected image/iucn values)."""
import json
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
DATE = "2026-06-28"
sel = json.load(open("/tmp/w11/selected.json"))
heroes = json.load(open("/tmp/w11/heroes.json"))
nearby = json.load(open("/tmp/w11/nearby.json"))
COUNTRY_NAME = {"united-states": "United States", "canada": "Canada", "australia": "Australia",
                "germany": "Germany", "france": "France", "netherlands": "Netherlands"}
def j(v): return json.dumps(v, ensure_ascii=False)
cities = [{"slug": c["slug"], "name": c["name"], "qid": c["qid"], "countrySlug": c["countrySlug"],
           "countryName": COUNTRY_NAME[c["countrySlug"]], "hero": heroes.get(c["slug"])} for c in sel]

# ---- heroes ----
hero_blocks = [f"  // ===== Wave 11 heroes ({DATE}) ====="]
hn = 0
for c in cities:
    h = c["hero"]
    if not h: continue
    hn += 1
    fields = [f"    id: {j('city-' + c['slug'] + '-hero')},", f"    placeSlug: {j(c['slug'])},",
        "    placeType: \"city\",", "    imageType: \"hero\",", f"    src: {j(h['src'])},",
        f"    width: {int(h['width'])},", f"    height: {int(h['height'])},",
        f"    alt: {j(h.get('alt') or ('View of ' + c['name'] + ', ' + c['countryName']))},",
        "    source: \"wikimedia\",", f"    sourceUrl: {j(h['sourceUrl'])},", f"    author: {j(h['author'])},"]
    if h.get("authorUrl"): fields.append(f"    authorUrl: {j(h['authorUrl'])},")
    fields += [f"    license: {j(h['license'])},", f"    licenseUrl: {j(h['licenseUrl'])},",
        f"    attributionText: {j(h['attributionText'])},", "    verified: true,", f"    verifiedAt: {j(DATE)},",
        f"    notes: {j('Resolved via Wikidata ' + c['qid'] + ' -> Commons file ' + (h.get('commonsFile') or ''))},"]
    hero_blocks.append("  {\n" + "\n".join(fields) + "\n  },")
img_src = (ROOT / "lib/data/media/city-images.ts").read_text()
concat = "export const cityImages: PlaceImage[] = [...cityImagesBase, ...cityImagesWave8, ...cityImagesWave9, ...cityImagesWave10];"
assert concat in img_src, "cityImages concat not found (file must be at HEAD)"
new_block = ("const cityImagesWave11: PlaceImage[] = [\n" + "\n".join(hero_blocks) + "\n];\n\n"
             "export const cityImages: PlaceImage[] = [...cityImagesBase, ...cityImagesWave8, ...cityImagesWave9, ...cityImagesWave10, ...cityImagesWave11];")
(ROOT / "lib/data/media/city-images.ts").write_text(img_src.replace(concat, new_block))
print(f"city-images.ts: +{hn} heroes")

# ---- nearby seeds + images + facts ----
seed_lines = ["const wave11NearbySeeds: readonly PlaceSeed[] = ["]
img_lines = [f"  // ===== Wave 11 verified images ({DATE}) ====="]
facts_lines = [f"  // ===== Wave 11 facts ({DATE}) ====="]
detail_slugs = []
place_total = 0
for cs, places in nearby.items():
    for p in places:
        place_total += 1
        sf = [f"    slug: {j(p['slug'])},", f"    name: {j(p['name'])},",
              f"    countrySlug: {j(p['countrySlug'])},", f"    regionName: {j(p['regionName'])},",
              f"    category: {j(p['category'])},", f"    summary:\n      {j(p['summary'])},",
              f"    connectedCitySlugs: {j(p['connectedCitySlugs'])},", f"    distanceBand: {j(p['distanceBand'])},",
              f"    wikidataId: {j(p['wikidataId'])},"]
        if p.get("officialUrl"): sf.append(f"    officialUrl: {j(p['officialUrl'])},")
        sf += [f"    latitude: {p['latitude']},", f"    longitude: {p['longitude']},",
               "    coordinateSource: \"wikidata\",", f"    verificationStatus: {j(p['verificationStatus'])},"]
        seed_lines.append("  {\n" + "\n".join(sf) + "\n  },")
        im = p["img"]
        ifields = [f"    src: {j(im['src'])},", f"    width: {int(im['width'])},", f"    height: {int(im['height'])},",
            f"    alt: {j(im['alt'])},", "    source: \"wikimedia-commons\",", f"    sourceUrl: {j(im['sourceUrl'])},",
            f"    author: {j(im['author'])},"]
        if im.get("authorUrl"): ifields.append(f"    authorUrl: {j(im['authorUrl'])},")
        ifields += [f"    license: {j(im['license'])},", f"    licenseUrl: {j(im['licenseUrl'])},",
            f"    attributionText: {j(im['attributionText'])},", "    verified: true,", f"    verifiedAt: {j(DATE)},"]
        img_lines.append(f"  {j(p['slug'])}: {{\n" + "\n".join(ifields) + "\n  },")
        if p["verificationStatus"] == "verified":
            detail_slugs.append(p["slug"])
            fa = p["facts"]; fparts = []
            if fa.get("designation"): fparts.append(f"designation: {j(fa['designation'])}")
            if fa.get("iucnCategory"): fparts.append(f"iucnCategory: {j(fa['iucnCategory'])}")
            if fa.get("established"): fparts.append(f"established: {int(fa['established'])}")
            fparts.append(f"wikidataId: {j(p['wikidataId'])}")
            facts_lines.append(f"  {j(p['slug'])}: {{ " + ", ".join(fparts) + " },")
seed_lines.append("];")
np_src = (ROOT / "lib/data/nearby-places.ts").read_text()
seeds_decl = "const seeds: readonly PlaceSeed[] = [...baseSeeds, ...batchSevenDensitySeeds, ...wave1NearbySeeds, ...wave2NearbySeeds, ...wave3NearbySeeds, ...wave4NearbySeeds, ...wave5NearbySeeds, ...wave6NearbySeeds, ...wave7NearbySeeds, ...wave8NearbySeeds, ...wave9NearbySeeds, ...wave10NearbySeeds];"
assert seeds_decl in np_src, "seeds decl not found (file must be at HEAD)"
np_src = np_src.replace(seeds_decl, "\n".join(seed_lines) + "\n\n" + seeds_decl.replace("...wave10NearbySeeds]", "...wave10NearbySeeds, ...wave11NearbySeeds]"))
vi_close = np_src.index("\n};", np_src.index("const VERIFIED_IMAGES"))
np_src = np_src[:vi_close] + "\n" + "\n".join(img_lines) + np_src[vi_close:]
(ROOT / "lib/data/nearby-places.ts").write_text(np_src)
print(f"nearby-places.ts: +{place_total} seeds + images")

facts_src = (ROOT / "lib/data/nearby-place-facts.ts").read_text()
idx = facts_src.rfind("\n};")
(ROOT / "lib/data/nearby-place-facts.ts").write_text(facts_src[:idx] + "\n" + "\n".join(facts_lines) + facts_src[idx:])
print(f"nearby-place-facts.ts: +{len(facts_lines)-1} facts; detail slugs unchanged={len(detail_slugs)}")
print("REWIRE MEDIA DONE")
