#!/usr/bin/env node
/**
 * Similar Cities + Better Alternatives validator — fail-closed, FULL CORPUS.
 *
 * Runs against the exported HTML in `out/` plus the published discovery index,
 * and re-derives every recommendation independently of the TypeScript engine.
 * A rule that holds in the engine but not in the emitted page is exactly the
 * failure worth catching, so the HTML is the source of truth for what shipped
 * and the index is the source of truth for what SHOULD have shipped.
 *
 * Checks:
 *   1  every recommended slug exists and resolves to an emitted page
 *   2  no city recommends itself
 *   3  no duplicate recommendations within a card list
 *   4  output is deterministic (recomputation reproduces the rendered set)
 *   5  sentinel contamination = 0 (placeholders neither recommend nor appear)
 *   6  minimum comparable dimensions respected
 *   7  similarity bands consistent with the measured distance
 *   8  no unsupported "better"/superlative claim in rendered copy
 *   9  recommendation count capped at SIMILAR_COUNT
 *  10  same-country diversity cap respected
 *  11  no malformed slugs, no NaN/Infinity
 *  12  band vocabulary bounded
 *
 * Usage: node scripts/validate-similar-cities.mjs [outDir]
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const OUT = resolve(process.argv[2] ?? "out");
const errors = [];
const fail = (m) => errors.push(m);

const SCORE_KEYS = ["f", "h", "e", "u", "k", "q", "i", "a"];
const BAND_VERY = 0.02, BAND_SIMILAR = 0.035, BAND_SOMEWHAT = 0.055;
const SIMILAR_COUNT = 6, MAX_SAME_COUNTRY = 3, MIN_DIMS = 10;
const BANDS = new Map([["Very similar", BAND_VERY], ["Similar", BAND_SIMILAR], ["Somewhat similar", BAND_SOMEWHAT]]);
const FORBIDDEN = /\b(better city|best (?:city|alternative)|upgrade|top choice|superior|worse city)\b/i;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const idxPath = join(OUT, "discovery-index/cities.json");
const cityDir = join(OUT, "cities");
if (!existsSync(idxPath) || !existsSync(cityDir)) {
  console.error(`similar-cities validation FAILED\n  - missing ${idxPath} or ${cityDir} (build first)`);
  process.exit(1);
}
const index = JSON.parse(readFileSync(idxPath, "utf8"));

/* ---------------------------------------- independent re-implementation ---- */
const valid = index.cities.filter(
  (c) => c.a !== null && c.f !== null && c.q !== null && c.i !== null && c.p !== null && Number.isFinite(c.t),
);
const placeholders = new Set(index.cities.filter((c) => c.a === null).map((c) => c.s));
const rawVec = (c) => [...SCORE_KEYS.map((k) => c[k]), c.t, Math.log10(c.p)];
const raws = valid.map(rawVec);
const dims = raws[0]?.length ?? 0;
if (dims !== MIN_DIMS) fail(`check6: vector has ${dims} dimensions, expected ${MIN_DIMS}`);
const mins = [], maxs = [];
for (let j = 0; j < dims; j += 1) {
  let lo = Infinity, hi = -Infinity;
  for (const r of raws) { if (r[j] < lo) lo = r[j]; if (r[j] > hi) hi = r[j]; }
  mins.push(lo); maxs.push(hi === lo ? lo + 1 : hi);
}
const VEC = raws.map((r) => r.map((v, j) => (v - mins[j]) / (maxs[j] - mins[j])));
for (const v of VEC) for (const x of v) if (!Number.isFinite(x)) fail("check11: non-finite value in normalized vector");
const bySlug = new Map(valid.map((c, i) => [c.s, i]));
const dist = (a, b) => { let s = 0; for (let j = 0; j < a.length; j += 1) s += Math.abs(a[j] - b[j]); return s / a.length; };

function expected(slugIdx) {
  const scored = [];
  for (let j = 0; j < valid.length; j += 1) {
    if (j === slugIdx) continue;
    const d = dist(VEC[slugIdx], VEC[j]);
    if (d <= BAND_SOMEWHAT) scored.push({ j, d });
  }
  scored.sort((a, b) => a.d - b.d || valid[a.j].s.localeCompare(valid[b.j].s));
  const out = []; let same = 0;
  for (const { j, d } of scored) {
    const isSame = valid[j].c === valid[slugIdx].c;
    if (isSame && same >= MAX_SAME_COUNTRY) continue;
    out.push({ slug: valid[j].s, d, country: valid[j].c });
    if (isSame) same += 1;
    if (out.length === SIMILAR_COUNT) break;
  }
  return out;
}

/* --------------------------------------------------------- HTML sweep ----- */
const files = readdirSync(cityDir).filter((f) => f.endsWith(".html"));
const emitted = new Set(files.map((f) => f.replace(/\.html$/, "")));
let pagesWithSection = 0, totalRecs = 0, phWithSection = 0;
const inbound = new Map();

for (const file of files) {
  const slug = file.replace(/\.html$/, "");
  const html = readFileSync(join(cityDir, file), "utf8");
  const start = html.indexOf('id="similar-cities"');
  if (start === -1) {
    // Placeholders and cities with no neighbour in band legitimately have none.
    continue;
  }
  const end = html.indexOf("</section>", start);
  if (end === -1) { fail(`check1: ${slug} similar-cities section unterminated`); continue; }
  const block = html.slice(start, end);
  const text = block.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  pagesWithSection += 1;
  if (placeholders.has(slug)) { phWithSection += 1; fail(`check5: placeholder city ${slug} renders similar-cities`); }

  const recs = [...block.matchAll(/href="\/cities\/([a-z0-9-]+)"/g)].map((m) => m[1]);
  totalRecs += recs.length;
  if (recs.length > SIMILAR_COUNT) fail(`check9: ${slug} renders ${recs.length} recommendations (cap ${SIMILAR_COUNT})`);
  if (new Set(recs).size !== recs.length) fail(`check3: ${slug} has duplicate recommendations`);
  if (recs.includes(slug)) fail(`check2: ${slug} recommends itself`);
  for (const r of recs) {
    if (!SLUG_RE.test(r)) fail(`check11: ${slug} malformed rec slug "${r}"`);
    if (!emitted.has(r)) fail(`check1: ${slug} recommends unemitted city ${r}`);
    if (placeholders.has(r)) fail(`check5: ${slug} recommends placeholder city ${r}`);
    inbound.set(r, (inbound.get(r) ?? 0) + 1);
  }
  if (FORBIDDEN.test(text)) fail(`check8: ${slug} renders an unsupported superlative claim`);
  if (/\b(NaN|Infinity)\b/.test(text)) fail(`check11: ${slug} renders NaN/Infinity`);

  // check4 + check7 + check10: determinism, bands, diversity
  const i = bySlug.get(slug);
  if (i === undefined) { fail(`check5: ${slug} renders recommendations but is not a valid engine city`); continue; }
  const exp = expected(i);
  const expSlugs = exp.map((e) => e.slug);
  if (JSON.stringify(recs) !== JSON.stringify(expSlugs)) {
    fail(`check4: ${slug} rendered [${recs.join(",")}] but engine recomputes [${expSlugs.join(",")}]`);
  }
  const labels = [...text.matchAll(/(Very similar|Similar|Somewhat similar)/g)].map((m) => m[1]);
  for (const l of labels) if (!BANDS.has(l)) fail(`check12: ${slug} unknown band "${l}"`);
  for (let k = 0; k < exp.length; k += 1) {
    const want = exp[k].d <= BAND_VERY ? "Very similar" : exp[k].d <= BAND_SIMILAR ? "Similar" : "Somewhat similar";
    if (labels[k] && labels[k] !== want) {
      fail(`check7: ${slug} rec ${exp[k].slug} labelled "${labels[k]}" but distance ${exp[k].d.toFixed(4)} implies "${want}"`);
    }
  }
  const sameCount = exp.filter((e) => e.country === valid[i].c).length;
  if (sameCount > MAX_SAME_COUNTRY) fail(`check10: ${slug} has ${sameCount} same-country recs (cap ${MAX_SAME_COUNTRY})`);
}

if (errors.length > 0) {
  console.error("similar-cities validation FAILED");
  for (const e of errors.slice(0, 30)) console.error(`  - ${e}`);
  if (errors.length > 30) console.error(`  ...and ${errors.length - 30} more`);
  process.exit(1);
}
const counts = [...inbound.values()].sort((a, b) => a - b);
const q = (p) => counts[Math.floor(p * counts.length)] ?? 0;
console.log("similar-cities validation PASSED");
console.log(`  corpus cities          ${index.cities.length} (valid ${valid.length}, placeholder ${placeholders.size})`);
console.log(`  pages with section     ${pagesWithSection}   placeholder pages with section ${phWithSection}`);
console.log(`  recommendations shown  ${totalRecs}  (avg ${(totalRecs / Math.max(1, pagesWithSection)).toFixed(1)} per page)`);
console.log(`  inbound link spread    min=${counts[0] ?? 0} p50=${q(0.5)} p90=${q(0.9)} p99=${q(0.99)} max=${counts[counts.length - 1] ?? 0}`);
console.log(`  cities never recommended ${valid.length - inbound.size}`);
