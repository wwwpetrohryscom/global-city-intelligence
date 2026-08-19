#!/usr/bin/env node
/**
 * Sentinel-cohort regression guard.
 *
 * WHAT THIS PROTECTS AGAINST
 * --------------------------
 * `lib/discovery/build-index.ts` decides whether a city's directional scores
 * are real by testing one literal string: `population === "Pending
 * integration"`. That string is upstream data, not code. If it is ever reworded
 * — "pending", "TBD", "awaiting integration" — `isSentinelCity()` silently
 * returns false, the placeholder scores stop being nulled, and the Finder
 * begins presenting a fabricated 50 as a measurement. Nothing in the index's
 * own internal consistency would necessarily notice.
 *
 * So this validator does NOT trust the string. It reads the corpus directly and
 * detects the placeholder SEMANTICS: a city whose every `City.scores.*` value
 * is exactly 50 and whose cost profile also reports `affordabilityScore: 50`.
 * That pattern is what "no measured data yet" actually looks like in this
 * repository, whatever the population field happens to say.
 *
 * THE CONTRACT
 *   1. every placeholder-pattern city MUST be nulled in the emitted index
 *      (a/f/q/i), regardless of how its population string is worded;
 *   2. every city carrying a published score in the index MUST NOT match the
 *      placeholder pattern;
 *   3. the string-based and pattern-based cohorts must agree — a divergence
 *      means the wording changed and `build-index.ts` needs updating.
 *
 * MIGRATION-SAFE BY DESIGN
 * The cohort size is reported, never asserted. If placeholder cities are later
 * populated with real measurements they stop matching the pattern and are
 * legitimately allowed to carry scores; a cohort of 0 is a valid PASS. This
 * guard freezes the *rule*, not today's 249.
 *
 * Usage: node scripts/validate-sentinel-cohort.mjs [outDir]
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const OUT = resolve(process.argv[2] ?? "out");
const errors = [];
const fail = (m) => errors.push(m);

const INDEX = join(OUT, "discovery-index/cities.json");
if (!existsSync(INDEX)) {
  console.error(`sentinel-cohort validation FAILED\n  - missing ${INDEX} (run a build first)`);
  process.exit(1);
}
const index = JSON.parse(readFileSync(INDEX, "utf8"));
const bySlug = new Map(index.cities.map((c) => [c.s, c]));

/* ------------------------------------------------------------------ source */
const citiesSrc = readFileSync("lib/data/cities.ts", "utf8");
const costSrc = readFileSync("lib/data/cost-of-living.ts", "utf8");

/** affordabilityScore per city, from the cost profiles. */
const affordability = new Map();
for (const [, slug, val] of costSrc.matchAll(
  /citySlug:\s*"([^"]+)"[\s\S]{0,900}?affordabilityScore:\s*([\d.]+)/g,
)) {
  if (!affordability.has(slug)) affordability.set(slug, Number.parseFloat(val));
}

const PLACEHOLDER_VALUE = 50;
const STRING_SENTINEL = "Pending integration";

let parsed = 0;
const patternCohort = new Set(); // all-50 semantics
const stringCohort = new Set(); // population === "Pending integration"

for (const m of citiesSrc.matchAll(
  /\{\s*slug:\s*"([^"]+)",\s*name:\s*"[^"]*",\s*countrySlug:\s*"[^"]+",\s*countryName:\s*"[^"]*",\s*region:\s*"[^"]*",\s*population:\s*"([^"]*)",[\s\S]{0,1400}?scores:\s*\{([^}]*)\}/g,
)) {
  const [, slug, population, scoreBlock] = m;
  parsed += 1;
  if (population.trim() === STRING_SENTINEL) stringCohort.add(slug);

  const values = [...scoreBlock.matchAll(/(\w+):\s*([\d.]+)/g)].map((x) => Number.parseFloat(x[2]));
  if (values.length === 0) {
    fail(`city "${slug}": could not read City.scores — parser needs updating before this guard can protect anything`);
    continue;
  }
  const allPlaceholder =
    values.every((v) => v === PLACEHOLDER_VALUE) &&
    affordability.get(slug) === PLACEHOLDER_VALUE;
  if (allPlaceholder) patternCohort.add(slug);
}

if (parsed === 0) {
  fail("parsed 0 cities from lib/data/cities.ts — the source shape changed and this guard is blind; fix the parser");
}
if (parsed !== index.cities.length) {
  fail(`parsed ${parsed} source cities but index has ${index.cities.length} — the guard is not seeing the whole corpus`);
}

/* --------------------------------------------------- contract 1: nulled ---- */
const SCORED = ["a", "f", "q", "i"];
const leaked = [];
for (const slug of patternCohort) {
  const row = bySlug.get(slug);
  if (!row) { fail(`placeholder city "${slug}" is absent from the index`); continue; }
  const published = SCORED.filter((k) => row[k] !== null);
  if (published.length > 0) leaked.push(`${slug} (${published.join(",")})`);
}
if (leaked.length > 0) {
  fail(
    `${leaked.length} placeholder-pattern cities carry published scores in the index — ` +
      `a fabricated ${PLACEHOLDER_VALUE} is being presented as a measurement. e.g. ${leaked.slice(0, 5).join("; ")}`,
  );
}

/* ------------------------------------- contract 2: scored ⇒ not placeholder */
const contaminated = [];
for (const row of index.cities) {
  if (SCORED.some((k) => row[k] !== null) && patternCohort.has(row.s)) contaminated.push(row.s);
}
if (contaminated.length > 0) {
  fail(`${contaminated.length} scored index rows match the placeholder pattern: ${contaminated.slice(0, 5).join(", ")}`);
}

/* ------------------------------------------ contract 3: cohorts must agree */
const onlyString = [...stringCohort].filter((s) => !patternCohort.has(s));
const onlyPattern = [...patternCohort].filter((s) => !stringCohort.has(s));
if (onlyString.length > 0) {
  fail(
    `${onlyString.length} cities use the "${STRING_SENTINEL}" marker but no longer carry the all-${PLACEHOLDER_VALUE} ` +
      `pattern (e.g. ${onlyString.slice(0, 5).join(", ")}). If they now hold real data the marker should be removed.`,
  );
}
if (onlyPattern.length > 0) {
  fail(
    `${onlyPattern.length} cities carry the all-${PLACEHOLDER_VALUE} placeholder pattern but NOT the ` +
      `"${STRING_SENTINEL}" marker (e.g. ${onlyPattern.slice(0, 5).join(", ")}). ` +
      `isSentinelCity() in lib/discovery/build-index.ts keys off that exact string, so these placeholders ` +
      `are reaching the Finder as real scores. Update the sentinel predicate.`,
  );
}

/* ----------------------------------------------------------------- report */
if (errors.length > 0) {
  console.error("sentinel-cohort validation FAILED");
  for (const e of errors.slice(0, 30)) console.error(`  - ${e}`);
  process.exit(1);
}
const nulled = index.cities.filter((c) => SCORED.every((k) => c[k] === null)).length;
console.log("sentinel-cohort validation PASSED");
console.log(`  source cities parsed    ${parsed}`);
console.log(`  placeholder pattern     ${patternCohort.size}  (all-${PLACEHOLDER_VALUE} scores + affordability ${PLACEHOLDER_VALUE})`);
console.log(`  "${STRING_SENTINEL}"  ${stringCohort.size}  (string marker)`);
console.log(`  cohorts agree           yes`);
console.log(`  nulled in index         ${nulled}`);
console.log(`  scored cities           ${index.cities.length - patternCohort.size}`);
console.log(
  patternCohort.size === 0
    ? "  cohort is empty — all cities now carry measured data (valid)"
    : "  no placeholder value is presented as a measurement",
);
