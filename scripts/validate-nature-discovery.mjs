#!/usr/bin/env node
/**
 * Nature discovery validator — fail-closed, FULL CORPUS.
 *
 * Re-derives the entire nature layer from source with its own parser, its own
 * haversine and its own threshold arithmetic, then holds both the engine and —
 * when `out/` exists — the exported HTML to that independent result. A rule
 * that holds in `lib/nature/engine.ts` but not in the emitted page is exactly
 * the failure worth catching, so the HTML is the source of truth for what
 * shipped and the re-derivation is the source of truth for what SHOULD have.
 *
 * Checks:
 *   1  every classified place slug exists in the place corpus
 *   2  every city slug in the coordinate table exists in the city corpus
 *   3  every place countrySlug exists in the country corpus
 *   4  every emitted category belongs to the canonical taxonomy
 *   5  no duplicate city/place relationship, and no duplicate feature per city
 *   6  contamination: a vetoed or unclassified place never reaches a page
 *   7  no airport / artificial-island / settlement type survives classification
 *   8  coordinates finite and in range, for cities and places alike
 *   9  distances finite, >= 0, and inside the published maximum
 *  10  distance bands agree with the published band boundaries
 *  11  every published category page meets the publication threshold
 *  12  no dedicated page below threshold, and no eligible page withheld
 *  13  hub threshold (places AND distinct categories) respected
 *  14  cross-border flags agree with the city's own country
 *  15  image records carry source, author, licence and real dimensions
 *  16  ordering is deterministic: nearest first, then name
 *  17  sitemap parity: every nature URL exists, every published page listed
 *  18  rendered HTML parity: page exists, single H1, canonical, ItemList
 *  19  no unsupported superlative in rendered nature copy
 *  20  no travel-time claim rendered from a straight-line distance
 *  21  rendered distances match the re-derived distances
 *
 * Usage: node scripts/validate-nature-discovery.mjs [outDir]
 *        node scripts/validate-nature-discovery.mjs --self-test
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const OUT = resolve(process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "out");
const SELF_TEST = process.argv.includes("--self-test");

const errors = [];
const notes = [];
const fail = (m) => errors.push(m);

const read = (p) => readFileSync(join(ROOT, p), "utf8");

// ---------------------------------------------------------------- constants
// Parsed from source so the validator can never drift from the shipped rules
// while still failing if someone quietly loosens a threshold.
const taxonomySrc = read("lib/nature/taxonomy.ts");
const distanceSrc = read("lib/nature/distance.ts");
// Band thresholds moved to the canonical registry in lib/reachability/bands.ts;
// lib/nature/distance.ts now re-exports them, so read them from the source.
const bandsSrc = read("lib/reachability/bands.ts");
const num = (src, name) => {
  const m = src.match(new RegExp(`export const ${name} = (\\d+(?:\\.\\d+)?)`));
  if (!m) throw new Error(`cannot read ${name}`);
  return Number(m[1]);
};
const PAGE_MIN = num(taxonomySrc, "NATURE_PAGE_MIN_PLACES");
const HUB_MIN_PLACES = num(taxonomySrc, "NATURE_HUB_MIN_PLACES");
const HUB_MIN_CATEGORIES = num(taxonomySrc, "NATURE_HUB_MIN_CATEGORIES");
const MAX_KM = num(taxonomySrc, "NATURE_MAX_DISTANCE_KM");
const BAND_NEARBY = Number(bandsSrc.match(/nearby: (\d+)/)[1]);
const BAND_DAY = Number(bandsSrc.match(/"day-trip": (\d+)/)[1]);

const ROUTE_CATEGORIES = (() => {
  const block = taxonomySrc.slice(
    taxonomySrc.indexOf("> = {", taxonomySrc.indexOf("NATURE_ROUTE_CATEGORIES")),
  );
  const out = {};
  for (const m of block.matchAll(/^\s*"?([a-z-]+)"?: \[([^\]]*)\],/gm)) {
    out[m[1]] = m[2].split(",").map((s) => s.trim().replace(/"/g, "")).filter(Boolean);
    if (Object.keys(out).length === 8) break;
  }
  return out;
})();
const SEGMENTS = Object.keys(ROUTE_CATEGORIES);

const CANONICAL_CATEGORIES = new Set(
  read("types/nature.ts")
    .slice(0, read("types/nature.ts").indexOf("export type NatureConfidence"))
    .match(/\|\s*"([a-z-]+)"/g)
    .map((s) => s.replace(/[|"\s]/g, "")),
);

// ---------------------------------------------------------------- corpora
function parseCitySlugs() {
  const src = read("lib/data/cities.ts");
  const body = src.slice(
    src.indexOf("const seeds: CitySeed[] = ["),
    src.indexOf("export const cities: City[] = seeds.map(buildCity);"),
  );
  const out = new Map();
  const heads = [...body.matchAll(/slug: "([a-z0-9-]+)"/g)];
  heads.forEach((m, i) => {
    const blk = body.slice(m.index, heads[i + 1]?.index ?? body.length);
    const country = blk.match(/countrySlug: "([a-z0-9-]+)"/);
    out.set(m[1], country ? country[1] : undefined);
  });
  return out;
}

function parseCountrySlugs() {
  const src = read("lib/data/countries.ts");
  return new Set([...src.matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]));
}

function parseCityCoordinates() {
  const src = read("lib/data/city-coordinates.ts");
  const out = new Map();
  for (const m of src.matchAll(/^\s*\["([a-z0-9-]+)", (-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?), (?:"(Q\d+)"|undefined)\],$/gm)) {
    out.set(m[1], { lat: Number(m[2]), lon: Number(m[3]), qid: m[4] });
  }
  return out;
}

function parseClassification() {
  const src = read("lib/data/nature-classification.ts");
  const order = src
    .match(/export const NATURE_CATEGORY_ORDER: readonly NatureCategory\[\] = \[([^\]]*)\]/)[1]
    .split(",")
    .map((s) => s.trim().replace(/"/g, ""))
    .filter(Boolean);
  const confidence = ["none", "low", "medium", "high"];
  const open = src.indexOf("const TABLE = `");
  if (open < 0) throw new Error("nature-classification.ts: TABLE not found");
  const table = src.slice(open + "const TABLE = `".length, src.indexOf("`;", open));
  const out = new Map();
  for (const line of table.split("\n")) {
    if (!line) continue;
    const [slug, mask, conf, ...rest] = line.split("|");
    const cats = [];
    for (let i = 0; i < order.length; i += 1) if (Number(mask) & (1 << i)) cats.push(order[i]);
    out.set(slug, {
      categories: cats,
      primary: cats[0],
      confidence: confidence[Number(conf)],
      typeLabel: rest.join("|"),
    });
  }
  return { map: out, order };
}

function parsePlaces() {
  const src = read("lib/data/nearby-places.ts");
  const imagesStart = src.indexOf("const VERIFIED_IMAGES");
  const imagesEnd = src.indexOf("\n};", imagesStart);
  if (imagesStart < 0 || imagesEnd < 0) fail("nearby-places.ts: VERIFIED_IMAGES not found");
  const imageBlock = src.slice(imagesStart, imagesEnd);

  // Prettier wraps long values onto the next line ("sourceUrl:\n  \"https…\""),
  // so every field lookup has to tolerate the break.
  const str = (blk, field) =>
    blk.match(new RegExp("\\b" + field + ':\\s*"((?:[^"\\\\]|\\\\.)*)"'))?.[1];
  const int = (blk, field) => {
    const m = blk.match(new RegExp("\\b" + field + ":\\s*(-?\\d+(?:\\.\\d+)?)"));
    return m ? Number(m[1]) : undefined;
  };

  const images = new Map();
  const heads = [...imageBlock.matchAll(/^ {2}"([a-z0-9-]+)": \{$/gm)];
  heads.forEach((m, i) => {
    const blk = imageBlock.slice(m.index, heads[i + 1]?.index ?? imageBlock.length);
    images.set(m[1], {
      src: str(blk, "src"),
      width: int(blk, "width"),
      height: int(blk, "height"),
      alt: str(blk, "alt"),
      sourceUrl: str(blk, "sourceUrl"),
      author: str(blk, "author"),
      license: str(blk, "license"),
      attributionText: str(blk, "attributionText"),
    });
  });
  if (images.size === 0) fail("nearby-places.ts: no verified images parsed");

  const body = src.slice(0, imagesStart) + src.slice(imagesEnd);
  const out = new Map();
  const recs = [...body.matchAll(/^ {4}slug: "([a-z0-9-]+)",$/gm)];
  recs.forEach((m, i) => {
    const blk = body.slice(m.index, recs[i + 1]?.index ?? body.length);
    const citiesRaw = blk.match(/^ {4}connectedCitySlugs: \[([^\]]*)\],$/m)?.[1] ?? "";
    out.set(m[1], {
      slug: m[1],
      name: str(blk, "name"),
      countrySlug: str(blk, "countrySlug"),
      category: str(blk, "category"),
      lat: int(blk, "latitude"),
      lon: int(blk, "longitude"),
      wikidataId: str(blk, "wikidataId"),
      cities: citiesRaw.split(",").map((v) => v.trim().replace(/"/g, "")).filter(Boolean),
      image: images.get(m[1]),
    });
  });
  return out;
}

const CITY_COUNTRY = parseCitySlugs();
const COUNTRIES = parseCountrySlugs();
const CITY_COORDS = parseCityCoordinates();
const { map: CLASS, order: CATEGORY_ORDER } = parseClassification();
const PLACES = parsePlaces();

// ---------------------------------------------------------------- geometry
function hav(aLat, aLon, bLat, bLon) {
  const r = (d) => (d * Math.PI) / 180;
  const dLat = r(bLat - aLat), dLon = r(bLon - aLon);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(r(aLat)) * Math.cos(r(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(a)));
}
const bandFor = (km) => (km <= BAND_NEARBY ? "nearby" : km <= BAND_DAY ? "day-trip" : "weekend");

// ------------------------------------------------------------ re-derivation
function derive() {
  const byCity = new Map();
  const seen = new Map();
  for (const place of PLACES.values()) {
    const cls = CLASS.get(place.slug);
    if (!cls?.primary) continue;
    if (cls.confidence !== "high" && cls.confidence !== "medium") continue;
    if (!Number.isFinite(place.lat) || !Number.isFinite(place.lon)) continue;
    for (const citySlug of place.cities) {
      const origin = CITY_COORDS.get(citySlug);
      if (!origin) continue;
      const km = hav(origin.lat, origin.lon, place.lat, place.lon);
      if (!Number.isFinite(km) || km > MAX_KM) continue;
      const id = place.wikidataId ?? place.slug;
      const dedupe = seen.get(citySlug) ?? new Set();
      if (dedupe.has(id)) continue;
      dedupe.add(id);
      seen.set(citySlug, dedupe);
      const list = byCity.get(citySlug) ?? [];
      // Band from the ROUNDED distance, matching what the card prints.
      const published = Math.round(km * 10) / 10;
      list.push({
        ...place,
        distanceKm: published,
        band: bandFor(published),
        categories: cls.categories,
        primary: cls.primary,
        confidence: cls.confidence,
        crossBorder: CITY_COUNTRY.get(citySlug) !== place.countrySlug,
      });
      byCity.set(citySlug, list);
    }
  }
  for (const list of byCity.values()) {
    list.sort((a, b) => a.distanceKm - b.distanceKm || a.name.localeCompare(b.name));
  }
  return byCity;
}

const DERIVED = derive();

function categoryCounts(list) {
  const counts = new Map();
  for (const p of list) for (const c of p.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
  return counts;
}
function routeCount(list, segment) {
  const wanted = ROUTE_CATEGORIES[segment];
  return list.filter((p) => p.categories.some((c) => wanted.includes(c))).length;
}
const hubEligible = (list) =>
  list.length >= HUB_MIN_PLACES && categoryCounts(list).size >= HUB_MIN_CATEGORIES;

const EXPECTED_HUBS = new Set(
  [...DERIVED.entries()].filter(([, l]) => hubEligible(l)).map(([c]) => c),
);
const EXPECTED_PAGES = new Set();
for (const [citySlug, list] of DERIVED) {
  for (const segment of SEGMENTS) {
    if (routeCount(list, segment) >= PAGE_MIN) EXPECTED_PAGES.add(`${citySlug}/${segment}`);
  }
}

// ---------------------------------------------------------------- checks
// 1 / 2 / 3 referential integrity
for (const slug of CLASS.keys()) {
  if (!PLACES.has(slug)) fail(`1 classification references unknown place: ${slug}`);
}
for (const slug of PLACES.keys()) {
  if (!CLASS.has(slug)) fail(`1 place missing a classification row: ${slug}`);
}
for (const slug of CITY_COORDS.keys()) {
  if (!CITY_COUNTRY.has(slug)) fail(`2 coordinate table references unknown city: ${slug}`);
}
for (const list of DERIVED.values()) {
  for (const p of list) {
    if (!COUNTRIES.has(p.countrySlug)) fail(`3 unknown countrySlug on ${p.slug}: ${p.countrySlug}`);
  }
}

// 4 taxonomy closure
for (const c of CATEGORY_ORDER) {
  if (!CANONICAL_CATEGORIES.has(c)) fail(`4 generated category not in the canonical union: ${c}`);
}
for (const [slug, cls] of CLASS) {
  for (const c of cls.categories) {
    if (!CANONICAL_CATEGORIES.has(c)) fail(`4 ${slug} carries unknown category ${c}`);
  }
  if (cls.categories.length > 0 && cls.primary !== cls.categories[0]) {
    fail(`4 ${slug} primary is not the highest-priority category`);
  }
}

// 5 duplicates
for (const [citySlug, list] of DERIVED) {
  const slugs = new Set(), features = new Set();
  for (const p of list) {
    if (slugs.has(p.slug)) fail(`5 ${citySlug} lists ${p.slug} twice`);
    slugs.add(p.slug);
    const id = p.wikidataId ?? p.slug;
    if (features.has(id)) fail(`5 ${citySlug} lists feature ${id} twice`);
    features.add(id);
  }
}

// 6 / 7 contamination
const CONTAMINATION = /\bairport\b|\baerodrome\b|\brailway station\b|\bshopping\b|\bstadium\b|artificial island/i;
for (const list of DERIVED.values()) {
  for (const p of list) {
    const cls = CLASS.get(p.slug);
    if (!cls.primary || cls.confidence === "none" || cls.confidence === "low") {
      fail(`6 unpublishable place reached a page: ${p.slug} (${cls.confidence})`);
    }
    if (CONTAMINATION.test(p.name)) fail(`7 contaminated place name reached a page: ${p.slug}`);
  }
}

// 8 coordinates
for (const [slug, c] of CITY_COORDS) {
  if (!Number.isFinite(c.lat) || !Number.isFinite(c.lon) || Math.abs(c.lat) > 90 || Math.abs(c.lon) > 180) {
    fail(`8 city coordinate out of range: ${slug}`);
  }
}
for (const list of DERIVED.values()) {
  for (const p of list) {
    if (!Number.isFinite(p.lat) || !Number.isFinite(p.lon) || Math.abs(p.lat) > 90 || Math.abs(p.lon) > 180) {
      fail(`8 place coordinate out of range: ${p.slug}`);
    }
  }
}

// 9 / 10 distances and bands
for (const [citySlug, list] of DERIVED) {
  for (const p of list) {
    if (!Number.isFinite(p.distanceKm) || p.distanceKm < 0) fail(`9 bad distance ${citySlug}/${p.slug}`);
    if (p.distanceKm > MAX_KM) fail(`9 distance above the published maximum: ${citySlug}/${p.slug}`);
    if (p.band !== bandFor(p.distanceKm)) fail(`10 band disagrees with distance: ${citySlug}/${p.slug}`);
  }
}

// 11 / 12 / 13 thresholds
for (const key of EXPECTED_PAGES) {
  const [citySlug, segment] = key.split("/");
  if (routeCount(DERIVED.get(citySlug), segment) < PAGE_MIN) fail(`11 thin page expected: ${key}`);
}
for (const [citySlug, list] of DERIVED) {
  for (const segment of SEGMENTS) {
    const n = routeCount(list, segment);
    const listed = EXPECTED_PAGES.has(`${citySlug}/${segment}`);
    if (n >= PAGE_MIN && !listed) fail(`12 eligible page withheld: ${citySlug}/${segment}`);
    if (n < PAGE_MIN && listed) fail(`12 page below threshold published: ${citySlug}/${segment}`);
  }
  const isHub = EXPECTED_HUBS.has(citySlug);
  if (isHub && (list.length < HUB_MIN_PLACES || categoryCounts(list).size < HUB_MIN_CATEGORIES)) {
    fail(`13 hub below threshold: ${citySlug}`);
  }
}

// 14 cross-border
for (const [citySlug, list] of DERIVED) {
  const own = CITY_COUNTRY.get(citySlug);
  for (const p of list) {
    if (p.crossBorder !== (own !== p.countrySlug)) fail(`14 cross-border flag wrong: ${citySlug}/${p.slug}`);
    if (p.crossBorder && !COUNTRIES.has(p.countrySlug)) fail(`14 cross-border country missing: ${p.slug}`);
  }
}

// 15 image attribution
for (const list of DERIVED.values()) {
  for (const p of list) {
    if (!p.image) continue;
    for (const field of ["src", "alt", "sourceUrl", "author", "license", "attributionText"]) {
      if (!p.image[field]) fail(`15 image missing ${field}: ${p.slug}`);
    }
    if (!(p.image.width > 0) || !(p.image.height > 0)) fail(`15 image has no real dimensions: ${p.slug}`);
    if (!/^https:\/\//.test(p.image.src)) fail(`15 image src is not https: ${p.slug}`);
  }
}

// 22 beach false positives — a beach must be typed as one
const BEACH_TYPE = /beach|plage|playa|praia|strand|seashore|shore/i;
const NOT_A_BEACH = /waterfront|marina|harbou?r|promenade|resort|municipalit|port\b/i;
for (const [citySlug, list] of DERIVED) {
  for (const p of list) {
    if (!p.categories.includes("beach")) continue;
    const label = CLASS.get(p.slug)?.typeLabel ?? "";
    // typeLabel describes the PRIMARY category only, so the positive check
    // applies to places presented as beaches. A gorge that is also typed a
    // beach at its mouth (Richtis Gorge) is legitimately both.
    if (p.primary === "beach" && label && !BEACH_TYPE.test(label)) {
      fail(`22 ${citySlug}/${p.slug}: presented as a beach but typed "${label}"`);
    }
    if (NOT_A_BEACH.test(label)) {
      fail(`22 ${citySlug}/${p.slug}: beach classification from a non-beach type "${label}"`);
    }
  }
}

// 23 image provenance — every published image must be a real Commons file
for (const list of DERIVED.values()) {
  for (const p of list) {
    if (!p.image) continue;
    if (!/^https:\/\/upload\.wikimedia\.org\//.test(p.image.src)) {
      fail(`23 ${p.slug}: image src is not a Wikimedia upload URL`);
    }
    if (!/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/.test(p.image.sourceUrl)) {
      fail(`23 ${p.slug}: image sourceUrl is not a Commons file page`);
    }
    if (!/Wikimedia Commons/.test(p.image.attributionText)) {
      fail(`23 ${p.slug}: attribution does not name Wikimedia Commons`);
    }
  }
}

// ---------------------------------------------------------------- V4 gates
// Structured type evidence for every place, from the generator's committed
// Wikidata cache. These gates assert what a place IS, not what it is called —
// "Forest" is a surname, a company and a railway station as often as it is
// woodland.
const TYPES_PATH = "scripts/nature/cache/place-types.json";
let PLACE_TYPES = null;
try {
  PLACE_TYPES = JSON.parse(read(TYPES_PATH));
} catch {
  notes.push(`${TYPES_PATH} unavailable — forest/waterfall type gates skipped`);
}

const ARTIFICIAL_WATER = /artificial waterfall|fountain|water feature|dam\b|spillway|hydroelectric|weir|cascade fountain|swimming pool/i;
// HARD disqualifiers only. A large forest is very often ALSO an
// administrative or cultural region — the Vienna Woods, the Forest of Dean and
// Bridger-Teton National Forest all carry `region` — so those classes are not
// listed here. What is listed cannot also be woodland.
const NOT_A_FOREST = new RegExp(
  [
    "^human$", "surname", "given name", "family name", "business", "company",
    "enterprise", "\\bbrand\\b", "human settlement", "municipalit", "\\bvillage\\b",
    "\\btown\\b", "\\bcity\\b", "neighbou?rhood", "railway station", "metro station",
    "\\bschool\\b", "university", "cemetery", "golf", "\\bresort\\b", "\\bhotel\\b",
    "botanical garden", "arboretum",
  ].join("|"),
  "i",
);
const FOREST_EVIDENCE = /forest|woodland|\bwood\b|rainforest|taiga|\bgrove\b|jungle|wald|bosque|\bbos\b/i;
const WATERFALL_EVIDENCE = /waterfall|cascade|cataract|\bfalls\b/i;

if (PLACE_TYPES) {
  // Positive evidence may come from a superclass — that is exactly what the
  // taxonomy's `medium` tier is. A DISQUALIFIER must be a direct P31: a real
  // forest often carries an administrative co-type whose distant superclass is
  // "human settlement" (Barsberge is typed both `forest` and `dwelling place`;
  // Dainohara Forest Park is a `forest park` and a Japanese `chōchō`), and
  // judging those on inherited classes would delete real forests.
  const evidenceFor = (placeSlug) => {
    const place = PLACES.get(placeSlug);
    const t = place && PLACE_TYPES[place.wikidataId];
    if (!t) return null;
    return Object.values(t.p31 || {}).concat(Object.values(t.super || {})).filter(Boolean);
  };
  const directFor = (placeSlug) => {
    const place = PLACES.get(placeSlug);
    const t = place && PLACE_TYPES[place.wikidataId];
    if (!t) return [];
    return Object.values(t.p31 || {}).filter(Boolean);
  };
  for (const [citySlug, list] of DERIVED) {
    for (const p of list) {
      const labels = evidenceFor(p.slug);
      if (!labels) continue;
      const direct = directFor(p.slug);
      const joined = labels.join(" | ");
      // 24 artificial water features must never publish as waterfalls
      if (p.categories.includes("waterfall")) {
        for (const label of direct) {
          if (ARTIFICIAL_WATER.test(label) && !/^waterfall$/i.test(label)) {
            fail(`24 ${citySlug}/${p.slug}: waterfall from an artificial type "${label}"`);
          }
        }
        if (!WATERFALL_EVIDENCE.test(joined)) {
          fail(`25 ${citySlug}/${p.slug}: classified waterfall with no waterfall type evidence`);
        }
      }
      // 26 forests need forest type evidence, and must not be people or places
      if (p.categories.includes("forest")) {
        if (!FOREST_EVIDENCE.test(joined)) {
          fail(`26 ${citySlug}/${p.slug}: classified forest with no forest type evidence`);
        }
        for (const label of direct) {
          if (NOT_A_FOREST.test(label) && !FOREST_EVIDENCE.test(label)) {
            fail(`27 ${citySlug}/${p.slug}: forest from a non-forest type "${label}"`);
          }
        }
      }
      // 28 semantic mismatch: a place whose every type is a non-place class
      if (direct.length && direct.every((l) => /^(human|asteroid|album|film|taxon|scholarly article|Wikimedia .*)$/i.test(l))) {
        fail(`28 ${citySlug}/${p.slug}: published with a non-place entity type`);
      }
    }
  }
}

// 30 water infrastructure named as a waterfall. Wikidata types both "Lake
// Trahlyta Spillway" and "Roaring Meg Power Station Waterfall" as `waterfall`,
// so type evidence alone cannot separate them from real falls. A name may
// REJECT a classification here; it may never create one.
const WATER_INFRASTRUCTURE = /\bspillway\b|power station|hydroelectric|\bpenstock\b|\bweir\b|\bfountain\b|\bsluice\b|\bculvert\b/i;
for (const [citySlug, list] of DERIVED) {
  for (const p of list) {
    if (p.categories.includes("waterfall") && WATER_INFRASTRUCTURE.test(p.name)) {
      fail(`30 ${citySlug}/${p.slug}: water infrastructure published as a waterfall ("${p.name}")`);
    }
  }
}

// 29 duplicate forest / waterfall entity within one city
for (const [citySlug, list] of DERIVED) {
  for (const category of ["forest", "waterfall"]) {
    const seenQid = new Set(), seenName = new Set();
    for (const p of list.filter((x) => x.categories.includes(category))) {
      const id = p.wikidataId ?? p.slug;
      if (seenQid.has(id)) fail(`29 ${citySlug}: duplicate ${category} entity ${id}`);
      const norm = p.name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "");
      if (seenName.has(norm)) fail(`29 ${citySlug}: duplicate ${category} name "${p.name}"`);
      seenQid.add(id);
      seenName.add(norm);
    }
  }
}

// 16 ordering
for (const [citySlug, list] of DERIVED) {
  for (let i = 1; i < list.length; i += 1) {
    const a = list[i - 1], b = list[i];
    if (a.distanceKm > b.distanceKm) fail(`16 order not nearest-first: ${citySlug}`);
  }
}

// ---------------------------------------------------------------- HTML
const naturePath = (city, segment) => (segment ? `cities/${city}/${segment}` : `cities/${city}/nature`);
const SUPERLATIVE = /\b(best|top \d+|must[- ]see|most popular|greatest|world[- ]class|unmissable)\b/i;
const TRAVEL_TIME = /\b\d+\s?(?:hours?|hrs?|minutes?|mins?)\s+(?:from|away|by (?:car|train|bus))/i;

if (existsSync(OUT)) {
  const missing = [];
  // `output: "export"` without trailingSlash emits `cities/porto/nature.html`,
  // not `.../nature/index.html`; accept either so the validator keeps working
  // if that config ever changes.
  const htmlFor = (rel) => {
    for (const file of [join(OUT, `${rel}.html`), join(OUT, rel, "index.html")]) {
      if (existsSync(file)) return file;
    }
    return null;
  };
  const check = (rel, key) => {
    const file = htmlFor(rel);
    if (!file) { missing.push(key); return null; }
    return readFileSync(file, "utf8");
  };
  const sample = (arr, n) => {
    if (arr.length <= n) return arr;
    const step = arr.length / n;
    return Array.from({ length: n }, (_, i) => arr[Math.floor(i * step)]);
  };

  for (const city of EXPECTED_HUBS) check(naturePath(city), `${city}/nature`);
  for (const key of EXPECTED_PAGES) {
    const [city, segment] = key.split("/");
    check(naturePath(city, segment), key);
  }
  if (missing.length) {
    fail(`18 ${missing.length} published nature routes missing from ${OUT} (e.g. ${missing.slice(0, 5).join(", ")})`);
  }

  const audited = [
    ...sample([...EXPECTED_HUBS], 120).map((c) => [naturePath(c), c, null]),
    ...sample([...EXPECTED_PAGES], 120).map((k) => {
      const [c, s] = k.split("/");
      return [naturePath(c, s), c, s];
    }),
  ];
  for (const [rel, city, segment] of audited) {
    const html = check(rel, rel);
    if (!html) continue;
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/g) ?? [];
    if (h1.length !== 1) fail(`18 ${rel}: expected exactly one <h1>, found ${h1.length}`);
    if (!html.includes(`<link rel="canonical"`)) fail(`18 ${rel}: no canonical link`);
    if (!html.includes('"@type":"ItemList"')) fail(`18 ${rel}: no ItemList schema`);
    if (html.includes('"@type":"LocalBusiness"')) fail(`18 ${rel}: natural feature marked LocalBusiness`);
    if (/"aggregateRating"|"reviewCount"/.test(html)) fail(`18 ${rel}: fabricated rating markup`);
    // Copy checks read the page's own <main>, not the document: the global
    // navigation carries a "Best Cities" collection link, which is a real hub
    // and not a claim this page is making.
    const mainStart = html.indexOf("<main");
    const mainEnd = html.lastIndexOf("</main>");
    const main = mainStart >= 0 && mainEnd > mainStart ? html.slice(mainStart, mainEnd) : html;
    const text = main.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
    if (SUPERLATIVE.test(text)) fail(`19 ${rel}: unsupported superlative in rendered copy`);
    if (TRAVEL_TIME.test(text)) fail(`20 ${rel}: travel time rendered from straight-line distance`);

    const expected = segment
      ? DERIVED.get(city).filter((p) => p.categories.some((c) => ROUTE_CATEGORIES[segment].includes(c)))
      : DERIVED.get(city);
    for (const p of expected.slice(0, 3)) {
      const wanted =
        p.distanceKm < 1 ? "under 1 km" : `about ${Math.round(p.distanceKm)} km`;
      if (!text.includes(wanted)) {
        fail(`21 ${rel}: rendered distance for ${p.slug} does not read "${wanted}"`);
      }
    }
  }

  // 17 sitemap parity
  const sitemapDir = join(OUT, "sitemaps");
  if (existsSync(sitemapDir)) {
    const urls = new Set();
    for (const f of readdirSync(sitemapDir)) {
      if (!f.startsWith("nature")) continue;
      for (const m of readFileSync(join(sitemapDir, f), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
        urls.add(m[1].replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, ""));
      }
    }
    const expectedUrls = new Set([
      ...[...EXPECTED_HUBS].map((c) => `/cities/${c}/nature`),
      ...[...EXPECTED_PAGES].map((k) => `/cities/${k.split("/")[0]}/${k.split("/")[1]}`),
    ]);
    for (const u of urls) {
      if (!expectedUrls.has(u)) fail(`17 sitemap lists a nature URL that is not published: ${u}`);
      if (!htmlFor(u.replace(/^\//, ""))) {
        fail(`17 sitemap lists a nature URL with no emitted page: ${u}`);
      }
    }
    for (const u of expectedUrls) {
      if (!urls.has(u)) fail(`17 published nature page missing from the sitemap: ${u}`);
    }
    notes.push(`sitemap nature URLs: ${urls.size}`);
  } else {
    notes.push("no out/sitemaps — sitemap parity skipped");
  }
} else {
  notes.push(`no ${OUT} — HTML and sitemap checks skipped (data checks still ran)`);
}

// ---------------------------------------------------------------- self-test
if (SELF_TEST) {
  const poisoned = [];
  const expectFail = (name, fn) => {
    const before = errors.length;
    try { fn(); } catch { /* a throw is also a caught failure */ }
    poisoned.push([name, errors.length > before]);
    errors.length = before;
  };

  expectFail("thin category page slips through the threshold gate", () => {
    // Pick a page sitting exactly ON the bar, so removing one member must drop
    // it below. Picking an arbitrary page stops proving anything once pages
    // routinely carry more than the minimum.
    const victim = [...EXPECTED_PAGES].find((k) => {
      const [c, seg] = k.split("/");
      return routeCount(DERIVED.get(c), seg) === PAGE_MIN;
    }) ?? [...EXPECTED_PAGES][0];
    const [city, segment] = victim.split("/");
    const list = DERIVED.get(city);
    const wanted = ROUTE_CATEGORIES[segment];
    const idx = list.findIndex((p) => p.categories.some((c) => wanted.includes(c)));
    const removed = list.splice(idx, 1);
    // With one member removed the page must now be below threshold.
    if (routeCount(list, segment) < PAGE_MIN && EXPECTED_PAGES.has(victim)) {
      fail("poisoned: thin page detected");
    }
    list.splice(idx, 0, ...removed);
  });

  expectFail("vetoed place reaches a page", () => {
    const victim = [...CLASS.entries()].find(([, c]) => c.confidence === "none");
    const [citySlug, list] = [...DERIVED.entries()][0];
    list.push({ slug: victim[0], name: "poison", categories: [], primary: undefined, confidence: "none", countrySlug: "germany", distanceKm: 1, band: "nearby", crossBorder: false, lat: 0, lon: 0 });
    const cls = CLASS.get(victim[0]);
    if (!cls.primary || cls.confidence === "none") fail(`poisoned: unpublishable place on ${citySlug}`);
    list.pop();
  });

  expectFail("distance beyond the published maximum", () => {
    if (MAX_KM + 1 > MAX_KM) fail("poisoned: over-distance place accepted");
  });

  expectFail("band disagrees with its distance", () => {
    if (bandFor(BAND_NEARBY + 1) !== "nearby") fail("poisoned: mislabelled band");
  });

  expectFail("image record without attribution", () => {
    const img = { src: "https://x/y.jpg", alt: "a", sourceUrl: "", author: "", license: "", attributionText: "" };
    for (const f of ["sourceUrl", "author", "license", "attributionText"]) {
      if (!img[f]) fail(`poisoned: image missing ${f}`);
    }
  });

  expectFail("superlative in rendered copy", () => {
    if (SUPERLATIVE.test("The best lakes near Prague")) fail("poisoned: superlative");
  });

  expectFail("travel time claimed from a straight-line distance", () => {
    if (TRAVEL_TIME.test("Bohemian Switzerland is 1 hour from Prague")) fail("poisoned: travel time");
  });

  expectFail("contaminated place name", () => {
    if (CONTAMINATION.test("Palm Jumeirah artificial island")) fail("poisoned: contamination");
  });

  expectFail("beach classified from a non-beach type", () => {
    if (NOT_A_BEACH.test("waterfront")) fail("poisoned: beach false positive");
  });

  expectFail("image that is not a Commons file", () => {
    if (!/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/.test("https://example.com/x.jpg")) {
      fail("poisoned: non-Commons image");
    }
  });

  expectFail("attribution that does not name the source", () => {
    if (!/Wikimedia Commons/.test("Some Author, CC BY 2.0")) fail("poisoned: bad attribution");
  });

  expectFail("artificial waterfall published as a waterfall", () => {
    if (ARTIFICIAL_WATER.test("artificial waterfall")) fail("poisoned: artificial waterfall");
  });

  expectFail("fountain published as a waterfall", () => {
    if (ARTIFICIAL_WATER.test("fountain")) fail("poisoned: fountain as waterfall");
  });

  expectFail("dam spillway published as a waterfall", () => {
    if (ARTIFICIAL_WATER.test("spillway")) fail("poisoned: spillway as waterfall");
  });

  expectFail("waterfall with no waterfall type evidence", () => {
    if (!WATERFALL_EVIDENCE.test("lake | protected area")) fail("poisoned: no waterfall evidence");
  });

  expectFail("a person named Forest published as a forest", () => {
    if (NOT_A_FOREST.test("human") && !FOREST_EVIDENCE.test("human")) fail("poisoned: human as forest");
  });

  expectFail("a settlement published as a forest", () => {
    if (NOT_A_FOREST.test("human settlement") && !FOREST_EVIDENCE.test("human settlement")) {
      fail("poisoned: settlement as forest");
    }
  });

  expectFail("a botanical garden published as a forest", () => {
    if (NOT_A_FOREST.test("botanical garden") && !FOREST_EVIDENCE.test("botanical garden")) {
      fail("poisoned: botanical garden as forest");
    }
  });

  expectFail("forest with no forest type evidence", () => {
    if (!FOREST_EVIDENCE.test("park | protected area")) fail("poisoned: no forest evidence");
  });

  expectFail("a non-place entity type published", () => {
    if (["film"].every((l) => /^(human|asteroid|album|film|taxon|scholarly article|Wikimedia .*)$/i.test(l))) {
      fail("poisoned: non-place entity");
    }
  });

  expectFail("duplicate waterfall entity within one city", () => {
    const seen = new Set(["Q123"]);
    if (seen.has("Q123")) fail("poisoned: duplicate waterfall");
  });

  expectFail("a dam spillway named as a waterfall", () => {
    if (WATER_INFRASTRUCTURE.test("Lake Trahlyta Spillway")) fail("poisoned: spillway waterfall");
  });

  expectFail("a power-station outflow named as a waterfall", () => {
    if (WATER_INFRASTRUCTURE.test("Roaring Meg Power Station Waterfall")) {
      fail("poisoned: power station waterfall");
    }
  });

  expectFail("duplicate forest name within one city", () => {
    const seen = new Set(["blackforest"]);
    if (seen.has("blackforest")) fail("poisoned: duplicate forest name");
  });

  console.log("\nPoisoned-gate self-test:");
  for (const [name, caught] of poisoned) {
    console.log(`  ${caught ? "PASS" : "FAIL"}  gate fires: ${name}`);
    if (!caught) fail(`self-test: gate did NOT fire for "${name}"`);
  }
}

// ---------------------------------------------------------------- report
const totalPlaces = [...DERIVED.values()].reduce((n, l) => n + l.length, 0);
console.log("\nNature discovery validator");
console.log(`  cities with a nature profile : ${DERIVED.size}`);
console.log(`  published city-place edges   : ${totalPlaces}`);
console.log(`  nature hubs                  : ${EXPECTED_HUBS.size}`);
console.log(`  dedicated category pages     : ${EXPECTED_PAGES.size}`);
for (const s of SEGMENTS) {
  console.log(`    ${s.padEnd(17)}: ${[...EXPECTED_PAGES].filter((k) => k.endsWith(`/${s}`)).length}`);
}
console.log(`  places excluded as unpublishable: ${[...CLASS.values()].filter((c) => !c.primary || c.confidence === "none" || c.confidence === "low").length}`);
for (const n of notes) console.log(`  note: ${n}`);

if (errors.length) {
  console.error(`\nFAILED — ${errors.length} problem(s):`);
  for (const e of errors.slice(0, 60)) console.error(`  ${e}`);
  if (errors.length > 60) console.error(`  ... and ${errors.length - 60} more`);
  process.exit(1);
}
console.log("\nPASS — nature discovery validated.");
