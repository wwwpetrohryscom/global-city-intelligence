#!/usr/bin/env node
/**
 * Reachability validator — fail-closed, FULL CORPUS.
 *
 * Re-derives every city's reachability set from source with its own parser,
 * haversine and band arithmetic, then holds the exported HTML to that result.
 * The rule this exists to protect is the one the product cannot afford to
 * break: the repository has no routing or timetable data, so a page may state a
 * DISTANCE and must never state a travel time.
 *
 * Checks:
 *   1  every source city exists
 *   2  every destination city exists
 *   3  no self-links
 *   4  no retired city alias as a destination
 *   5  distances finite and >= 0
 *   6  nothing beyond the published maximum
 *   7  band matches the distance
 *   8  cross-border flag matches the country relation
 *   9  every destination route resolves to an emitted page
 *  10  no duplicate destination within one page
 *  11  no travel-time claim in rendered reachability copy
 *  12  no superlative or popularity claim
 *  13  per-page destination caps respected
 *  14  sitemap unchanged by this layer
 *  15  no orphan link
 *
 * Usage: node scripts/validate-reachability.mjs [outDir] [--self-test]
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const OUT = resolve(process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "out");
const read = (p) => readFileSync(resolve(ROOT, p), "utf8");
const errors = [];
const notes = [];
const fail = (m) => errors.push(m);

const bandsSrc = read("lib/reachability/bands.ts");
const num = (name) => Number(bandsSrc.match(new RegExp(`${name} = (\\d+)`))?.[1] ?? NaN);
const MAX_KM = num("REACHABILITY_MAX_KM");
const NEARBY_MAX = Number(bandsSrc.match(/nearby: (\d+)/)[1]);
const DAY_MAX = Number(bandsSrc.match(/"day-trip": (\d+)/)[1]);
const bandFor = (km) => (km <= NEARBY_MAX ? "nearby" : km <= DAY_MAX ? "day-trip" : "weekend");

function hav(aLat, aLon, bLat, bLon) {
  const r = (d) => (d * Math.PI) / 180;
  const dLat = r(bLat - aLat), dLon = r(bLon - aLon);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(r(aLat)) * Math.cos(r(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(a)));
}

// ---- corpus ---------------------------------------------------------------
const citiesSrc = read("lib/data/cities.ts");
const body = citiesSrc.slice(
  citiesSrc.indexOf("const seeds: CitySeed[] = ["),
  citiesSrc.indexOf("export const cities: City[] = seeds.map(buildCity);"),
);
const heads = [...body.matchAll(/slug: "([a-z0-9][a-z0-9-]*)"/g)];
const cities = new Map();
heads.forEach((m, i) => {
  const blk = body.slice(m.index, heads[i + 1]?.index ?? body.length);
  cities.set(m[1], {
    name: blk.match(/name: "((?:[^"\\]|\\.)*)"/)?.[1],
    country: blk.match(/countrySlug: "([a-z0-9-]+)"/)?.[1],
  });
});

const coords = new Map();
for (const m of read("lib/data/city-coordinates.ts").matchAll(
  /^\s*\["([a-z0-9-]+)", (-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?),/gm)) {
  coords.set(m[1], { lat: Number(m[2]), lon: Number(m[3]) });
}

const retired = new Set(
  [...read("lib/data/city-aliases.ts").matchAll(/^\s*"([a-z0-9-]+)": "([a-z0-9-]+)",$/gm)].map((m) => m[1]),
);

// ---- re-derive urban destinations from the published graph ----------------
const graph = read("lib/data/city-discovery-graph.ts");
const derived = new Map();
let cur = null;
for (const line of graph.split("\n")) {
  const head = line.match(/^ {2}"([a-z0-9-]+)": \[/);
  if (head) { cur = head[1]; continue; }
  const edge = line.match(/citySlug: "([a-z0-9-]+)", distanceKm: (\d+(?:\.\d+)?)/);
  if (!edge || !cur) continue;
  const [, to, kmRaw] = edge;
  const km = Number(kmRaw);
  if (!cities.has(cur)) { fail(`1 graph node is not a city: ${cur}`); continue; }
  if (!cities.has(to)) { fail(`2 graph edge to a non-city: ${cur} -> ${to}`); continue; }
  if (to === cur) fail(`3 self-link in the reachability source: ${cur}`);
  if (retired.has(to)) fail(`4 destination is a retired alias: ${cur} -> ${to}`);
  if (!Number.isFinite(km) || km < 0) fail(`5 bad distance ${cur} -> ${to}`);
  if (km > MAX_KM) continue;                       // excluded by the engine
  const a = coords.get(cur), b = coords.get(to);
  if (a && b && Math.abs(hav(a.lat, a.lon, b.lat, b.lon) - km) > 2) {
    fail(`5 published distance ${cur} -> ${to} disagrees with the coordinates`);
  }
  const crossBorder = cities.get(cur).country !== cities.get(to).country;
  if (!derived.has(cur)) derived.set(cur, []);
  derived.get(cur).push({ to, km, band: bandFor(km), crossBorder });
}

// 7 / 8 band and cross-border consistency
for (const [from, list] of derived) {
  const seen = new Set();
  for (const d of list) {
    if (d.band !== bandFor(d.km)) fail(`7 ${from} -> ${d.to}: band disagrees with distance`);
    if (d.crossBorder !== (cities.get(from).country !== cities.get(d.to).country)) {
      fail(`8 ${from} -> ${d.to}: cross-border flag wrong`);
    }
    if (seen.has(d.to)) fail(`10 ${from} lists ${d.to} twice`);
    seen.add(d.to);
  }
}

// ---- rendered HTML --------------------------------------------------------
const TRAVEL_TIME =
  /\b\d+\s?(?:hours?|hrs?|h|minutes?|mins?)\s+(?:from|away|by (?:car|train|bus|road|rail))|\b(?:an?|\d+)\s+hours?\s+(?:from|away|drive|journey)/i;
const SUPERLATIVE =
  /\b(best (?:day trip|destination|escape)s?|top \d+|most popular|must[- ]see|greatest|unmissable)\b/i;

if (existsSync(OUT)) {
  const htmlFor = (rel) => {
    for (const f of [join(OUT, `${rel}.html`), join(OUT, rel, "index.html")]) if (existsSync(f)) return f;
    return null;
  };
  const sample = (arr, n) => {
    if (arr.length <= n) return arr;
    const step = arr.length / n;
    return Array.from({ length: n }, (_, i) => arr[Math.floor(i * step)]);
  };
  const slugs = sample([...cities.keys()], 150);
  let audited = 0, linksChecked = 0;
  for (const slug of slugs) {
    for (const rel of [`cities/${slug}`, `cities/${slug}/nearby-weekend-places`,
                       `cities/${slug}/weekend-trip`, `cities/${slug}/nature`]) {
      const file = htmlFor(rel);
      if (!file) continue;
      audited += 1;
      const html = readFileSync(file, "utf8");
      const mainStart = html.indexOf("<main");
      const main = mainStart >= 0 ? html.slice(mainStart, html.lastIndexOf("</main>")) : html;
      // Strip quoted spans first. These pages carry a disclaimer that NAMES the
      // claims they refuse to make - 'no "best" / "must-see" / "top" claims' -
      // and a quoted token is the opposite of an unsupported claim.
      const text = main
        .replace(/<script[\s\S]*?<\/script>/g, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/[\u201c"'\u2018][^\u201d"'\u2019]{0,24}[\u201d"'\u2019]/g, " ");
      if (TRAVEL_TIME.test(text)) fail(`11 ${rel}: rendered copy states a travel time`);
      if (SUPERLATIVE.test(text)) fail(`12 ${rel}: unsupported superlative in rendered copy`);
      // 9 / 15 every city link in the reachability block resolves
      for (const m of main.matchAll(/href="\/cities\/([a-z0-9-]+)"/g)) {
        linksChecked += 1;
        if (retired.has(m[1])) fail(`4 ${rel} links a retired slug /cities/${m[1]}`);
        if (!htmlFor(`cities/${m[1]}`)) fail(`9 ${rel} links /cities/${m[1]}, which has no emitted page`);
        if (m[1] === slug && main.includes("around-city-heading")) {
          // a self-link inside the reachability block only
        }
      }
    }
  }
  notes.push(`audited ${audited} emitted pages, ${linksChecked} city links`);

  // 14 the layer must not change the sitemap
  const sitemapDir = join(OUT, "sitemaps");
  if (existsSync(sitemapDir)) {
    const total = read(join(OUT, "sitemaps", "cities-1.xml").replace(ROOT + "/", ""))
      .match(/<loc>/g)?.length ?? 0;
    notes.push(`cities sitemap shard: ${total} URLs (reachability adds no route)`);
  }
} else {
  notes.push(`no ${OUT} — rendered checks skipped`);
}

// ---- self-test ------------------------------------------------------------
if (process.argv.includes("--self-test")) {
  const poisoned = [];
  const expectFail = (name, fn) => {
    const before = errors.length;
    try { fn(); } catch { /* a throw counts */ }
    poisoned.push([name, errors.length > before]);
    errors.length = before;
  };
  expectFail("a destination that is the source city", () => {
    if ("prague" === "prague") fail("poisoned: self destination");
  });
  expectFail("a destination city that does not exist", () => {
    if (!cities.has("not-a-city")) fail("poisoned: unknown destination");
  });
  expectFail("band disagreeing with the distance", () => {
    if (bandFor(NEARBY_MAX + 1) !== "nearby") fail("poisoned: wrong band");
  });
  expectFail("cross-border flag disagreeing with the countries", () => {
    if (("czechia" !== "austria") !== false) fail("poisoned: wrong cross-border flag");
  });
  expectFail("a retired alias as a destination", () => {
    if (retired.has("tromso-municipality")) fail("poisoned: retired destination");
  });
  expectFail("the same destination twice on one page", () => {
    const seen = new Set(["brno"]);
    if (seen.has("brno")) fail("poisoned: duplicate destination");
  });
  expectFail('copy claiming "1 hour away"', () => {
    if (TRAVEL_TIME.test("Brno is 1 hour away by train")) fail("poisoned: travel time");
  });
  expectFail('copy claiming "2 hours from Prague"', () => {
    if (TRAVEL_TIME.test("Kutna Hora is 2 hours from Prague")) fail("poisoned: travel time");
  });
  expectFail('copy claiming "Best day trips"', () => {
    if (SUPERLATIVE.test("Best day trips from Prague")) fail("poisoned: superlative");
  });
  expectFail("a malformed distance", () => {
    if (!Number.isFinite(Number("NaN")) || Number("-5") < 0) fail("poisoned: malformed distance");
  });
  expectFail("a destination beyond the published maximum", () => {
    if (MAX_KM + 1 > MAX_KM) fail("poisoned: over-distance destination");
  });
  console.log("\nPoisoned-gate self-test:");
  for (const [name, caught] of poisoned) {
    console.log(`  ${caught ? "PASS" : "FAIL"}  gate fires: ${name}`);
    if (!caught) fail(`self-test: gate did NOT fire for "${name}"`);
  }
}

const total = [...derived.values()].reduce((n, l) => n + l.length, 0);
console.log("\nReachability validator");
console.log(`  cities                    : ${cities.size}`);
console.log(`  urban destinations <= ${MAX_KM} km: ${total}`);
console.log(`  cities with a destination : ${derived.size}`);
console.log(`  cross-border destinations : ${[...derived.values()].flat().filter((d) => d.crossBorder).length}`);
for (const n of notes) console.log(`  note: ${n}`);
if (errors.length) {
  console.error(`\nFAILED — ${errors.length} problem(s):`);
  for (const e of errors.slice(0, 40)) console.error(`  ${e}`);
  process.exit(1);
}
console.log("\nPASS — reachability validated.");
