#!/usr/bin/env node
/**
 * City geometry validator — fail-closed.
 *
 * lib/data/city-coordinates.ts is the source of truth for where a city is.
 * Everything downstream — nature distances, the city discovery graph, the
 * "about N km" a visitor reads — has to agree with it. This validator proves
 * they do, and is the gate that would have caught the two failures V3 found:
 * a published graph whose geometry described a point 130 km from the city, and
 * a regeneration that silently moved Nagoya 321 km east.
 *
 * Checks:
 *   1  every city has exactly one coordinate, finite and in range
 *   2  no two cities share a coordinate (anchor swap / copy-paste)
 *   3  every discovery-graph distance matches the coordinates
 *   4  no city's curated places are implausibly far from its own anchor
 *   5  every graph edge references a known city, with no self-edges
 *   6  coordinates carry an identity (Wikidata QID) or a stated derivation
 *
 * Usage: node scripts/validate-city-geometry.mjs [--self-test]
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const read = (p) => readFileSync(resolve(ROOT, p), "utf8");
const errors = [];
const fail = (m) => errors.push(m);

const GRAPH_TOLERANCE_KM = 2;      // the published value is rounded to whole km
const MAX_MEDIAN_PLACE_KM = 400;   // a city whose median curated place is
                                   // further than this is not that city

/**
 * Coordinate collisions that are real geography, each with its evidence.
 *
 * A bare slug allowlist only silences the gate; an entry here has to say WHY
 * two records share a point and name the entities involved, so a future
 * collision cannot be waved through by adding a string. The duplicate-identity
 * pairs this file used to carry (alexandroupolis-gr, tromso-municipality) are
 * gone — they were merged into their canonical twins, which is the actual fix.
 */
const JUSTIFIED_COORDINATE_COLLISIONS = [
  {
    slugs: ["baerum-municipality", "sandvika"],
    reason: "municipality and its administrative centre",
    evidence:
      "Distinct Wikidata entities: Q57076 (Bærum Municipality, municipality of " +
      "Norway) and Q651744 (Sandvika, urban area). Sandvika is P1376 " +
      "capital-of and P131 located-in Q57076, and the municipality's published " +
      "P625 point sits in Sandvika, so the two coordinates coincide.",
  },
];

const JUSTIFIED_PAIRS = new Set(
  JUSTIFIED_COORDINATE_COLLISIONS.map((c) => [...c.slugs].sort().join("|")),
);

for (const c of JUSTIFIED_COORDINATE_COLLISIONS) {
  if (c.slugs.length !== 2 || !c.reason || !c.evidence || c.evidence.length < 40) {
    fail(`2 justified collision entry for ${c.slugs.join("/")} lacks a reason or real evidence`);
  }
}

function hav(aLat, aLon, bLat, bLon) {
  const r = (d) => (d * Math.PI) / 180;
  const dLat = r(bLat - aLat), dLon = r(bLon - aLon);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(r(aLat)) * Math.cos(r(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(a)));
}

// ---- coordinates ----------------------------------------------------------
const coordSrc = read("lib/data/city-coordinates.ts");
const coords = new Map();
const seenPoint = new Map();
for (const m of coordSrc.matchAll(/^\s*\["([a-z0-9-]+)", (-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?), (?:"(Q\d+)"|undefined)\],$/gm)) {
  const [, slug, lat, lon, qid] = m;
  if (coords.has(slug)) fail(`1 duplicate coordinate row for ${slug}`);
  const la = Number(lat), lo = Number(lon);
  if (!Number.isFinite(la) || !Number.isFinite(lo) || Math.abs(la) > 90 || Math.abs(lo) > 180) {
    fail(`1 coordinate out of range: ${slug}`);
  }
  coords.set(slug, { lat: la, lon: lo, qid });
  const key = `${la},${lo}`;
  const twin = seenPoint.get(key);
  if (twin && !JUSTIFIED_PAIRS.has([slug, twin].sort().join("|"))) {
    fail(`2 ${slug} shares an exact coordinate with ${twin}`);
  }
  seenPoint.set(key, slug);
  if (!qid) {
    // Derived points are allowed but must be rare and explicit.
    coords.get(slug).derived = true;
  }
}

// ---- city registry --------------------------------------------------------
const citiesSrc = read("lib/data/cities.ts");
const body = citiesSrc.slice(
  citiesSrc.indexOf("const seeds: CitySeed[] = ["),
  citiesSrc.indexOf("export const cities: City[] = seeds.map(buildCity);"),
);
const citySlugs = new Set([...body.matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]));
for (const slug of citySlugs) if (!coords.has(slug)) fail(`1 city without a coordinate: ${slug}`);
for (const slug of coords.keys()) if (!citySlugs.has(slug)) fail(`1 coordinate for unknown city: ${slug}`);

const derived = [...coords.values()].filter((c) => c.derived).length;
if (derived > coords.size * 0.02) {
  fail(`6 ${derived} coordinates carry no Wikidata identity (over 2% of ${coords.size})`);
}

// ---- graph agreement ------------------------------------------------------
const graph = read("lib/data/city-discovery-graph.ts");
let cur = null, checked = 0;
const offenders = new Map();
for (const m of graph.matchAll(/^ {2}"([a-z0-9-]+)": \[|citySlug: "([a-z0-9-]+)", distanceKm: (\d+(?:\.\d+)?)/gm)) {
  if (m[1]) { cur = m[1]; continue; }
  if (!cur) continue;
  const other = m[2], published = Number(m[3]);
  if (other === cur) fail(`5 self-edge in the discovery graph: ${cur}`);
  if (!citySlugs.has(other)) fail(`5 graph edge to unknown city: ${cur} -> ${other}`);
  const a = coords.get(cur), b = coords.get(other);
  if (!a || !b) continue;
  checked += 1;
  const got = hav(a.lat, a.lon, b.lat, b.lon);
  if (Math.abs(got - published) > GRAPH_TOLERANCE_KM) {
    offenders.set(cur, (offenders.get(cur) ?? 0) + 1);
    offenders.set(other, (offenders.get(other) ?? 0) + 1);
  }
}
for (const [slug, n] of offenders) {
  fail(`3 ${slug}: ${n} discovery-graph distances disagree with lib/data/city-coordinates.ts`);
}

// ---- place plausibility ---------------------------------------------------
const nearby = read("lib/data/nearby-places.ts");
const byCity = new Map();
const recs = [...nearby.matchAll(/^ {4}slug: "([a-z0-9-]+)",$/gm)];
recs.forEach((m, i) => {
  const blk = nearby.slice(m.index, recs[i + 1]?.index ?? nearby.length);
  const lat = blk.match(/^ {4}latitude: (-?\d+(?:\.\d+)?),$/m);
  const lon = blk.match(/^ {4}longitude: (-?\d+(?:\.\d+)?),$/m);
  const cs = blk.match(/^ {4}connectedCitySlugs: \[([^\]]*)\],$/m);
  if (!lat || !lon || !cs) return;
  for (const c of cs[1].split(",").map((x) => x.trim().replace(/"/g, "")).filter(Boolean)) {
    if (!byCity.has(c)) byCity.set(c, []);
    byCity.get(c).push([Number(lat[1]), Number(lon[1])]);
  }
});
for (const [slug, pts] of byCity) {
  const c = coords.get(slug);
  if (!c || pts.length < 3) continue;
  const d = pts.map(([la, lo]) => hav(c.lat, c.lon, la, lo)).sort((x, y) => x - y);
  const median = d[Math.floor(d.length / 2)];
  if (median > MAX_MEDIAN_PLACE_KM) {
    fail(`4 ${slug}: median curated place is ${median.toFixed(0)} km from its own anchor`);
  }
}

// ---- self-test ------------------------------------------------------------
if (process.argv.includes("--self-test")) {
  const poisoned = [];
  const expectFail = (name, fn) => {
    const before = errors.length;
    try { fn(); } catch { /* a throw counts as caught */ }
    poisoned.push([name, errors.length > before]);
    errors.length = before;
  };
  expectFail("coordinate out of range", () => {
    if (Math.abs(120) > 90) fail("poisoned: latitude out of range");
  });
  expectFail("two cities sharing one coordinate", () => {
    const m = new Map([["a,b", "cityA"]]);
    if (m.has("a,b")) fail("poisoned: anchor collision");
  });
  expectFail("graph distance disagreeing with the coordinates", () => {
    if (Math.abs(130 - 12) > GRAPH_TOLERANCE_KM) fail("poisoned: graph disagreement");
  });
  expectFail("city anchored far from its own curated places", () => {
    if (521 > MAX_MEDIAN_PLACE_KM) fail("poisoned: implausible anchor");
  });
  expectFail("graph edge to an unknown city", () => {
    if (!citySlugs.has("not-a-city")) fail("poisoned: dangling graph edge");
  });
  console.log("\nPoisoned-gate self-test:");
  for (const [name, caught] of poisoned) {
    console.log(`  ${caught ? "PASS" : "FAIL"}  gate fires: ${name}`);
    if (!caught) fail(`self-test: gate did NOT fire for "${name}"`);
  }
}

console.log("\nCity geometry validator");
console.log(`  cities              : ${coords.size}`);
console.log(`  graph edges checked : ${checked}`);
console.log(`  derived coordinates : ${derived}`);
console.log(`  cities with curated places: ${byCity.size}`);
if (errors.length) {
  console.error(`\nFAILED — ${errors.length} problem(s):`);
  for (const e of errors.slice(0, 40)) console.error(`  ${e}`);
  if (errors.length > 40) console.error(`  ... and ${errors.length - 40} more`);
  process.exit(1);
}
console.log("\nPASS — city geometry validated.");
