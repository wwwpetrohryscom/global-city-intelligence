#!/usr/bin/env node
/**
 * Validates the generated city-discovery index against the exported site.
 *
 * Runs against `out/` for the same reason `validate-search-index.mjs` does:
 * only the built tree proves that every city the Finder can surface resolves to
 * a page that was actually emitted. A record that looks fine in the data but
 * has no page is precisely the failure that ships a dead link.
 *
 * Beyond referential integrity it enforces the data-integrity rules the Finder
 * depends on:
 *   - no fabricated fields (the record shape is closed)
 *   - no NaN/Infinity, no out-of-range scores
 *   - the missing-data contract: a score is a number or null, never 0-as-absent
 *   - the sentinel cohort really is null rather than a placeholder 50
 *
 * Usage: node scripts/validate-discovery-index.mjs [outDir]
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { gzipSync, brotliCompressSync, constants } from "node:zlib";
import { join, resolve } from "node:path";

const OUT = resolve(process.argv[2] ?? "out");
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const INDEX_PATH = "discovery-index/cities.json";

const errors = [];
const fail = (msg) => errors.push(msg);

const full = join(OUT, INDEX_PATH);
if (!existsSync(full)) {
  console.error(`discovery-index validation FAILED\n  - missing ${INDEX_PATH} in ${OUT}`);
  process.exit(1);
}
const bytes = statSync(full).size;
const raw = readFileSync(full);
let index;
try {
  index = JSON.parse(raw.toString("utf8"));
} catch (err) {
  console.error(`discovery-index validation FAILED\n  - unparseable: ${err.message}`);
  process.exit(1);
}

const routeExists = (routePath) => {
  const rel = routePath.replace(/^\/+/, "");
  return existsSync(join(OUT, `${rel}.html`)) || existsSync(join(OUT, rel, "index.html"));
};

const cities = Array.isArray(index.cities) ? index.cities : [];
const countries = Array.isArray(index.countries) ? index.countries : [];
const zones = Array.isArray(index.zones) ? index.zones : [];

if (index.generatedFor !== "city-discovery") fail(`unexpected generatedFor: ${index.generatedFor}`);
if (typeof index.version !== "number") fail("missing numeric version");
if (index.count !== cities.length) fail(`count ${index.count} != cities ${cities.length}`);
if (cities.length === 0) fail("index contains no cities");
if (countries.length === 0) fail("index contains no countries");

/* The record shape is CLOSED: an unexpected key means a field was added
 * without going through this validator, which is how a fabricated metric would
 * enter the product unnoticed. */
const ALLOWED_KEYS = new Set(["s","n","c","p","a","f","q","i","z","t","k","e","u","h","mc","cur"]);
const SCORE_KEYS = ["a","f","q","i","k","e","u","h"];
const NULLABLE = new Set(["p","a","f","q","i","mc","cur"]);

const seen = new Set();
let missingRoutes = 0;
let nullCounts = Object.fromEntries([...NULLABLE].map((k) => [k, 0]));

for (const city of cities) {
  const where = `city "${city?.s ?? "?"}"`;
  if (!city || typeof city !== "object") { fail("non-object city record"); continue; }

  for (const key of Object.keys(city)) {
    if (!ALLOWED_KEYS.has(key)) fail(`${where}: unexpected field "${key}" (closed record shape)`);
  }
  if (typeof city.s !== "string" || !SLUG_RE.test(city.s)) fail(`${where}: invalid slug`);
  if (seen.has(city.s)) fail(`${where}: duplicate slug`);
  seen.add(city.s);
  if (typeof city.n !== "string" || city.n.length === 0) fail(`${where}: missing name`);

  if (!Number.isInteger(city.c) || city.c < 0 || city.c >= countries.length) {
    fail(`${where}: country index ${city.c} out of range`);
  }
  if (!Number.isInteger(city.z) || city.z < 0 || city.z >= zones.length) {
    fail(`${where}: zone index ${city.z} out of range`);
  }

  for (const key of SCORE_KEYS) {
    const value = city[key];
    if (value === null) {
      if (!NULLABLE.has(key)) fail(`${where}: field "${key}" must not be null`);
      continue;
    }
    if (typeof value !== "number" || !Number.isFinite(value)) {
      fail(`${where}: field "${key}" is not a finite number (${value})`);
      continue;
    }
    if (value < 0 || value > 100) fail(`${where}: score "${key}" out of 0-100 range: ${value}`);
  }

  if (city.p !== null && (!Number.isFinite(city.p) || city.p <= 0)) {
    fail(`${where}: population must be a positive number or null (${city.p})`);
  }
  if (!Number.isFinite(city.t)) fail(`${where}: temperature is not finite (${city.t})`);
  if (city.t < -60 || city.t > 60) fail(`${where}: temperature out of plausible range: ${city.t}`);

  // Cost must always carry its currency: a bare number would invite the exact
  // cross-currency comparison the product refuses to make.
  if ((city.mc === null) !== (city.cur === null)) {
    fail(`${where}: cost value and currency must both be present or both null`);
  }
  if (city.cur !== null && !/^[A-Z]{3}$/.test(city.cur)) {
    fail(`${where}: invalid currency code "${city.cur}"`);
  }

  for (const key of NULLABLE) if (city[key] === null) nullCounts[key] += 1;

  if (!routeExists(`/cities/${city.s}`)) {
    missingRoutes += 1;
    if (missingRoutes <= 10) fail(`${where}: /cities/${city.s} was not emitted`);
  }
}
if (missingRoutes > 10) fail(`...and ${missingRoutes - 10} more cities with no emitted page`);

for (const country of countries) {
  if (typeof country.s !== "string" || !SLUG_RE.test(country.s)) fail(`invalid country slug: ${country.s}`);
  if (typeof country.i !== "string" || !/^[A-Z]{2}$/.test(country.i)) fail(`country ${country.s}: invalid ISO2 "${country.i}"`);
}

/* THE SENTINEL CONTRACT. The cities with no published population must also have
 * no published affordability/safety/air-quality/internet score — those are the
 * fields proven to be a placeholder 50 for that exact cohort. If a future data
 * change breaks the 1:1 correspondence, the Finder would start presenting
 * placeholders as measurements, so this is an error, not a warning. */
const noPop = cities.filter((c) => c.p === null).map((c) => c.s);
for (const key of ["a", "f", "q", "i"]) {
  const noScore = new Set(cities.filter((c) => c[key] === null).map((c) => c.s));
  const mismatched = noPop.filter((slug) => !noScore.has(slug));
  if (mismatched.length > 0) {
    fail(
      `sentinel contract broken: ${mismatched.length} cities have no population but DO have a "${key}" score ` +
        `(e.g. ${mismatched.slice(0, 5).join(", ")}). A placeholder would be presented as a measurement.`,
    );
  }
  if (noScore.size !== noPop.length) {
    fail(`sentinel contract broken: ${noScore.size} cities lack "${key}" but ${noPop.length} lack population`);
  }
}

const gzip = gzipSync(raw, { level: 9 }).length;
const brotli = brotliCompressSync(raw, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length;

if (errors.length > 0) {
  console.error("discovery-index validation FAILED");
  for (const err of errors.slice(0, 40)) console.error(`  - ${err}`);
  if (errors.length > 40) console.error(`  ...and ${errors.length - 40} more`);
  process.exit(1);
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log("discovery-index validation PASSED");
console.log(`  cities            ${cities.length}`);
console.log(`  countries         ${countries.length}`);
console.log(`  climate zones     ${zones.length}`);
console.log(`  size              raw ${kb(bytes)} / gzip ${kb(gzip)} / brotli ${kb(brotli)}`);
console.log(`  bytes per city    ${(bytes / cities.length).toFixed(1)} raw`);
console.log(
  `  unpublished       ` +
    Object.entries(nullCounts).map(([k, v]) => `${k}=${v}`).join("  "),
);
