#!/usr/bin/env node
/**
 * Validates the generated search index against the exported site.
 *
 * Runs against `out/` (the `output: 'export'` result) rather than against the
 * TypeScript source, so it proves the stronger property: every row the search
 * UI can surface resolves to a page that was actually emitted. A result that
 * looks fine in the data but has no page is exactly the failure that would
 * produce a dead link in production, and only the built tree can catch it.
 *
 * Usage: node scripts/validate-search-index.mjs [outDir]
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const OUT = resolve(process.argv[2] ?? "out");
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);

function readJson(relPath) {
  const full = join(OUT, relPath);
  if (!existsSync(full)) {
    fail(`missing generated index: ${relPath} (looked in ${OUT})`);
    return null;
  }
  try {
    return { data: JSON.parse(readFileSync(full, "utf8")), bytes: statSync(full).size };
  } catch (err) {
    fail(`unparseable index ${relPath}: ${err.message}`);
    return null;
  }
}

/** A route is considered emitted if either `<path>.html` or `<path>/index.html` exists. */
function routeExists(routePath) {
  const rel = routePath.replace(/^\/+/, "");
  return existsSync(join(OUT, `${rel}.html`)) || existsSync(join(OUT, rel, "index.html"));
}

const countryIdx = readJson("search-index/countries.json");
const cityIdx = readJson("search-index/cities.json");
if (!countryIdx || !cityIdx) {
  console.error("search-index validation FAILED\n  - " + errors.join("\n  - "));
  process.exit(1);
}

const countries = countryIdx.data.countries ?? [];
const cities = cityIdx.data.cities ?? [];

// ---------------------------------------------------------------- structure
if (countryIdx.data.count !== countries.length) {
  fail(`country index count ${countryIdx.data.count} != rows ${countries.length}`);
}
if (cityIdx.data.count !== cities.length) {
  fail(`city index count ${cityIdx.data.count} != rows ${cities.length}`);
}
if (!countries.length) fail("country index is empty");
if (!cities.length) fail("city index is empty");

// ------------------------------------------------------------ duplicate keys
const countrySlugs = new Set();
for (const c of countries) {
  if (countrySlugs.has(c.s)) fail(`duplicate country slug: ${c.s}`);
  countrySlugs.add(c.s);
}
const citySlugs = new Set();
for (const c of cities) {
  if (citySlugs.has(c.s)) fail(`duplicate city slug: ${c.s}`);
  citySlugs.add(c.s);
}

// ------------------------------------------------------------- slug validity
for (const c of countries) {
  if (!SLUG_RE.test(c.s)) fail(`malformed country slug: ${JSON.stringify(c.s)}`);
  if (!c.n?.trim()) fail(`country ${c.s} has empty name`);
  if (!/^[A-Z]{2}$/.test(c.i ?? "")) fail(`country ${c.s} has malformed iso2: ${c.i}`);
  if (typeof c.c !== "number" || c.c < 0) fail(`country ${c.s} has bad city count: ${c.c}`);
  if (c.m === null) warnings.push(`country ${c.s} (${c.r}) has no macro region — hidden from region filters`);
}
for (const c of cities) {
  if (!SLUG_RE.test(c.s)) fail(`malformed city slug: ${JSON.stringify(c.s)}`);
  if (!c.n?.trim()) fail(`city ${c.s} has empty name`);
}

// ------------------------------------------------- country relationship + counts
const derivedCounts = new Map();
for (const c of cities) {
  if (!countrySlugs.has(c.cs)) {
    fail(`city ${c.s} references unknown country slug: ${c.cs}`);
    continue;
  }
  derivedCounts.set(c.cs, (derivedCounts.get(c.cs) ?? 0) + 1);
}
const byCountrySlug = new Map(countries.map((c) => [c.s, c]));
for (const c of cities) {
  const country = byCountrySlug.get(c.cs);
  if (country && country.n !== c.cn) {
    fail(`city ${c.s} country name "${c.cn}" != country index "${country.n}"`);
  }
}
for (const c of countries) {
  const derived = derivedCounts.get(c.s) ?? 0;
  if (derived !== c.c) {
    fail(`country ${c.s} claims ${c.c} cities but index contains ${derived}`);
  }
}

// --------------------------------------------- ambiguous rows carry a disambiguator
// A result row is identified to the visitor by "<name> — <country>". Where that
// string is not unique the row must carry `d`, or two different cities are
// indistinguishable in the UI.
const pairCounts = new Map();
for (const c of cities) {
  const key = `${c.n}\u0000${c.cn}`;
  pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);
}
let ambiguousRows = 0;
for (const c of cities) {
  const ambiguous = pairCounts.get(`${c.n}\u0000${c.cn}`) > 1;
  if (ambiguous) {
    ambiguousRows += 1;
    if (!c.d) fail(`ambiguous city "${c.n} — ${c.cn}" (${c.s}) has no disambiguator`);
    else if (c.d !== c.s) fail(`city ${c.s} disambiguator "${c.d}" is not its slug`);
  } else if (c.d) {
    warnings.push(`city ${c.s} carries an unnecessary disambiguator`);
  }
}

// ------------------------------------------------------------- route existence
let missingCountryRoutes = 0;
for (const c of countries) {
  if (!routeExists(`/countries/${c.s}`)) {
    missingCountryRoutes += 1;
    if (missingCountryRoutes <= 5) fail(`country route not emitted: /countries/${c.s}`);
  }
}
if (missingCountryRoutes > 5) fail(`...and ${missingCountryRoutes - 5} more missing country routes`);

let missingCityRoutes = 0;
for (const c of cities) {
  if (!routeExists(`/cities/${c.s}`)) {
    missingCityRoutes += 1;
    if (missingCityRoutes <= 5) fail(`city route not emitted: /cities/${c.s}`);
  }
}
if (missingCityRoutes > 5) fail(`...and ${missingCityRoutes - 5} more missing city routes`);

// -------------------------------------------------------------------- report
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log("search-index validation");
console.log(`  countries : ${countries.length} rows, ${kb(countryIdx.bytes)}`);
console.log(`  cities    : ${cities.length} rows, ${kb(cityIdx.bytes)}`);
console.log(`  total     : ${countries.length + cities.length} rows, ${kb(countryIdx.bytes + cityIdx.bytes)}`);
console.log(`  routes    : ${countries.length - missingCountryRoutes}/${countries.length} country, ${cities.length - missingCityRoutes}/${cities.length} city`);
console.log(`  ambiguous : ${ambiguousRows} row(s) share a name+country string, all disambiguated`);

for (const w of warnings) console.log(`  WARN  ${w}`);

if (errors.length) {
  console.error(`\nFAILED with ${errors.length} error(s):`);
  for (const e of errors.slice(0, 40)) console.error(`  - ${e}`);
  if (errors.length > 40) console.error(`  ...and ${errors.length - 40} more`);
  process.exit(1);
}
console.log("\nPASS — every search result maps to an emitted route.");
