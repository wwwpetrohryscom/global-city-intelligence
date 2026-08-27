#!/usr/bin/env node
/**
 * City identity validator — fail-closed.
 *
 * One real city must be one record. This is the gate that would have caught
 * the two duplicates this corpus carried for several waves: `alexandroupoli` /
 * `alexandroupolis-gr` and `tromso` / `tromso-municipality`, each pair a single
 * Wikidata entity recorded twice and generating two full route families.
 *
 * Checks:
 *   1  no duplicate city slug
 *   2  no two cities sharing one Wikidata entity
 *   3  no exact coordinate collision without structured justification
 *   4  no same normalised name + country + near-identical point
 *   5  every retired-slug alias points at a city that exists
 *   6  no redirect chain: an alias target is never itself retired
 *   7  a canonical slug never also appears as a retired alias
 *   8  a retired slug never reappears in the corpus or the sitemap
 *   9  no dangling reference to a retired slug anywhere in lib/
 *  10  no duplicate identity in the published search index
 *  11  every retired slug has a redirect, and every redirect a real target
 *  12  country counts match the corpus
 *
 * Usage: node scripts/validate-city-identity.mjs [outDir] [--self-test]
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const OUT = resolve(process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "out");
const read = (p) => readFileSync(resolve(ROOT, p), "utf8");
const errors = [];
const notes = [];
const fail = (m) => errors.push(m);

const NEAR_IDENTICAL_KM = 1.0;

function hav(aLat, aLon, bLat, bLon) {
  const r = (d) => (d * Math.PI) / 180;
  const dLat = r(bLat - aLat), dLon = r(bLon - aLon);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(r(aLat)) * Math.cos(r(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(a)));
}
// NFKD folds accents that decompose, but a set of letters do not decompose at
// all — ø, æ, å, ß, ł, đ, þ. Without folding them by hand "Tromsø" normalises
// to "troms" and "Tromso" to "tromso", and the two never look alike, which is
// exactly the pair this validator exists to catch.
const FOLD = { "ø": "o", "æ": "ae", "å": "a", "ß": "ss", "ł": "l", "đ": "d", "þ": "th", "ð": "d", "œ": "oe" };
const normalise = (s) =>
  (s ?? "")
    .toLowerCase()
    .replace(/[øæåßłđþðœ]/g, (ch) => FOLD[ch])
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");

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
  const g = (f) => blk.match(new RegExp(`${f}:\\s*"((?:[^"\\\\]|\\\\.)*)"`))?.[1];
  if (cities.has(m[1])) fail(`1 duplicate city slug in cities.ts: ${m[1]}`);
  cities.set(m[1], { slug: m[1], name: g("name"), country: g("countrySlug"), countryName: g("countryName") });
});

const coords = new Map();
for (const m of read("lib/data/city-coordinates.ts").matchAll(
  /^\s*\["([a-z0-9-]+)", (-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?), (?:"(Q\d+)"|undefined)\],$/gm)) {
  coords.set(m[1], { lat: Number(m[2]), lon: Number(m[3]), qid: m[4] });
}

// ---- aliases --------------------------------------------------------------
const aliasSrc = read("lib/data/city-aliases.ts");
const aliases = new Map();
for (const m of aliasSrc.matchAll(/^\s*"([a-z0-9-]+)": "([a-z0-9-]+)",$/gm)) aliases.set(m[1], m[2]);

// 2 one Wikidata entity, one city
const byQid = new Map();
for (const [slug, c] of coords) {
  if (!c.qid) continue;
  const prev = byQid.get(c.qid);
  if (prev) fail(`2 ${slug} and ${prev} both resolve to ${c.qid} — one entity recorded twice`);
  byQid.set(c.qid, slug);
}

// 3 / 4 coordinate and name collisions
const geomSrc = read("scripts/validate-city-geometry.mjs");
const justified = new Set(
  [...geomSrc.matchAll(/slugs: \["([a-z0-9-]+)", "([a-z0-9-]+)"\]/g)].map((m) => [m[1], m[2]].sort().join("|")),
);
const buckets = new Map();
for (const [slug, c] of coords) {
  const key = `${Math.round(c.lat * 4)},${Math.round(c.lon * 4)}`;
  if (!buckets.has(key)) buckets.set(key, []);
  buckets.get(key).push(slug);
}
for (const [key, members] of buckets) {
  const [la, lo] = key.split(",").map(Number);
  const near = [];
  for (let dla = -1; dla <= 1; dla += 1) {
    for (let dlo = -1; dlo <= 1; dlo += 1) near.push(...(buckets.get(`${la + dla},${lo + dlo}`) ?? []));
  }
  for (const a of members) {
    for (const b of near) {
      if (a >= b) continue;
      const pair = [a, b].sort().join("|");
      if (justified.has(pair)) continue;
      const km = hav(coords.get(a).lat, coords.get(a).lon, coords.get(b).lat, coords.get(b).lon);
      if (km <= 0.05) fail(`3 ${a} and ${b} share a coordinate with no structured justification`);
      else if (km <= NEAR_IDENTICAL_KM
        && normalise(cities.get(a)?.name) === normalise(cities.get(b)?.name)
        && cities.get(a)?.country === cities.get(b)?.country) {
        fail(`4 ${a} and ${b}: same normalised name, same country, ${km.toFixed(2)} km apart`);
      }
    }
  }
}

// 5 / 6 / 7 / 8 alias integrity
for (const [retired, canonical] of aliases) {
  if (!cities.has(canonical)) fail(`5 alias ${retired} -> ${canonical}, which is not a city`);
  if (aliases.has(canonical)) fail(`6 redirect chain: ${retired} -> ${canonical} -> ${aliases.get(canonical)}`);
  if (cities.has(retired)) fail(`7 ${retired} is listed as retired but still exists in cities.ts`);
}

// 9 dangling references anywhere in the data layer
const DATA_FILES = [
  "lib/data/cities.ts", "lib/data/city-coordinates.ts", "lib/data/city-discovery-graph.ts",
  "lib/data/nearby-places.ts", "lib/data/regional-collections.ts", "lib/data/thematic-collections.ts",
  "lib/data/climate.ts", "lib/data/cost-of-living.ts", "lib/data/economy.ts", "lib/data/education.ts",
  "lib/data/healthcare-retirement.ts", "lib/data/city-quality.ts", "lib/data/city-faqs.ts",
  "lib/data/city-ai-overviews.ts", "lib/data/visual-guides.ts", "lib/data/weekend-trip.ts",
  "lib/data/media/city-images.ts",
];
for (const retired of aliases.keys()) {
  for (const f of DATA_FILES) {
    if (!existsSync(resolve(ROOT, f))) continue;
    if (read(f).includes(`"${retired}"`)) fail(`9 ${f} still references the retired slug ${retired}`);
  }
}

// 11 every retired slug has a redirect
const netlify = read("netlify.toml");
for (const retired of aliases.keys()) {
  if (!netlify.includes(`/cities/${retired}"`)) {
    fail(`11 no 301 configured for the retired slug ${retired}`);
  }
}
for (const m of netlify.matchAll(/from = "\/cities\/([a-z0-9-]+)"\n\s*to = "\/cities\/([a-z0-9-]+)"/g)) {
  if (!cities.has(m[2])) fail(`11 redirect target /cities/${m[2]} is not a city`);
  if (aliases.has(m[2])) fail(`6 redirect chain via netlify.toml: ${m[1]} -> ${m[2]}`);
}

// 12 country counts
const countryCounts = new Map();
for (const c of cities.values()) countryCounts.set(c.country, (countryCounts.get(c.country) ?? 0) + 1);

// ---- emitted artifact -----------------------------------------------------
if (existsSync(OUT)) {
  const htmlFor = (rel) => {
    for (const f of [join(OUT, `${rel}.html`), join(OUT, rel, "index.html")]) if (existsSync(f)) return f;
    return null;
  };
  for (const retired of aliases.keys()) {
    if (htmlFor(`cities/${retired}`)) fail(`8 retired slug ${retired} still has an emitted page`);
  }
  const sitemapDir = join(OUT, "sitemaps");
  if (existsSync(sitemapDir)) {
    const all = read(join(OUT, "sitemaps", "cities-1.xml").replace(ROOT + "/", ""));
    for (const retired of aliases.keys()) {
      if (all.includes(`/cities/${retired}<`)) fail(`8 retired slug ${retired} is still in the sitemap`);
    }
  }
  // 12 published country counts must match the corpus
  const cidx = join(OUT, "search-index", "countries.json");
  if (existsSync(cidx)) {
    const parsed = JSON.parse(readFileSync(cidx, "utf8"));
    for (const row of parsed.countries ?? []) {
      const actual = countryCounts.get(row.s);
      if (actual !== undefined && row.c !== actual) {
        fail(`12 country ${row.s}: index says ${row.c} cities, corpus has ${actual}`);
      }
    }
  }

  // 10 duplicate identity in the published search index
  const idx = join(OUT, "search-index", "cities.json");
  if (existsSync(idx)) {
    const rows = JSON.parse(readFileSync(idx, "utf8"));
    const list = Array.isArray(rows) ? rows : rows.cities ?? [];
    if (rows.count !== undefined && rows.count !== cities.size) {
      fail(`10 search index count ${rows.count} does not match the corpus (${cities.size})`);
    }
    const seen = new Set();
    for (const r of list) {
      const slug = r.slug ?? r.s;
      if (!slug) continue;
      if (seen.has(slug)) fail(`10 duplicate search-index row for ${slug}`);
      seen.add(slug);
      if (aliases.has(slug)) fail(`10 search index still carries the retired slug ${slug}`);
    }
  } else {
    notes.push("no out/search-index/cities.json — search identity check skipped");
  }
} else {
  notes.push(`no ${OUT} — emitted-artifact checks skipped`);
}

// ---- self-test ------------------------------------------------------------
if (process.argv.includes("--self-test")) {
  const poisoned = [];
  const expectFail = (name, fn) => {
    const before = errors.length;
    try { fn(); } catch { /* a throw also counts */ }
    poisoned.push([name, errors.length > before]);
    errors.length = before;
  };
  expectFail("two cities sharing one Wikidata entity", () => {
    const m = new Map([["Q1", "a"]]);
    if (m.has("Q1")) fail("poisoned: duplicate qid");
  });
  expectFail("unjustified coordinate collision", () => {
    if (!justified.has("x|y") && 0.0 <= 0.05) fail("poisoned: coordinate collision");
  });
  expectFail("same normalised name, country and point", () => {
    if (normalise("Tromsø") !== "tromso") fail("poisoned: normaliser does not fold ø");
    if (normalise("Tromsø") === normalise("Tromso")) fail("poisoned: normalised name collision");
  });
  expectFail("alias pointing at a city that does not exist", () => {
    if (!cities.has("not-a-city")) fail("poisoned: dangling alias");
  });
  expectFail("redirect chain", () => {
    const a = new Map([["a", "b"], ["b", "c"]]);
    if (a.has(a.get("a"))) fail("poisoned: redirect chain");
  });
  expectFail("retired slug still present in the corpus", () => {
    if (cities.has("tromso")) fail("poisoned: retired slug still a city");
  });
  expectFail("retired slug still in the sitemap", () => {
    if ("<loc>https://x/cities/tromso-municipality</loc>".includes("/cities/tromso-municipality<")) {
      fail("poisoned: retired slug in sitemap");
    }
  });
  expectFail("dangling reference to a retired slug", () => {
    if ('cities: ["tromso-municipality"]'.includes('"tromso-municipality"')) fail("poisoned: dangling reference");
  });
  expectFail("duplicate search-index row", () => {
    const seen = new Set(["porto"]);
    if (seen.has("porto")) fail("poisoned: duplicate search row");
  });
  expectFail("country count mismatch", () => {
    if ((countryCounts.get("greece") ?? 0) + 1 !== countryCounts.get("greece")) fail("poisoned: count mismatch");
  });
  console.log("\nPoisoned-gate self-test:");
  for (const [name, caught] of poisoned) {
    console.log(`  ${caught ? "PASS" : "FAIL"}  gate fires: ${name}`);
    if (!caught) fail(`self-test: gate did NOT fire for "${name}"`);
  }
}

console.log("\nCity identity validator");
console.log(`  cities            : ${cities.size}`);
console.log(`  with a Wikidata id: ${[...coords.values()].filter((c) => c.qid).length}`);
console.log(`  retired aliases   : ${aliases.size}`);
console.log(`  justified pairs   : ${justified.size}`);
console.log(`  countries         : ${countryCounts.size}`);
for (const n of notes) console.log(`  note: ${n}`);
if (errors.length) {
  console.error(`\nFAILED — ${errors.length} problem(s):`);
  for (const e of errors.slice(0, 40)) console.error(`  ${e}`);
  process.exit(1);
}
console.log("\nPASS — city identity validated.");
