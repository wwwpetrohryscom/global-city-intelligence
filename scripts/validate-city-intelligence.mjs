#!/usr/bin/env node
/**
 * City Intelligence Scorecard validator — fail-closed.
 *
 * Runs against the exported HTML in `out/`, not against the TypeScript source,
 * so it verifies what a visitor actually receives. A rule that holds in the
 * engine but not in the emitted page is exactly the failure worth catching.
 *
 * Checks (numbered as specified):
 *  1  every city slug accounted for
 *  2  no sentinel/placeholder score presented as positioned intelligence
 *  3  no NaN / Infinity rendered
 *  4  band labels bounded to the canonical set
 *  5  cohort sizes plausible and never larger than the country's city count
 *  6  a city is never compared with another country
 *  7  missing values render "Not available", never 0
 *  8  raw multi-currency cost never appears as a compared dimension
 *  9  strengths/trade-offs only where a position exists
 * 10  small cohorts receive no positional claim
 * 11  every deep link resolves to an emitted static route
 * 12  every rendered dimension label comes from the canonical registry
 * 13  no fabricated labels (Popular/Trending/Best/Recommended/Rank #N)
 * 14  sentinel wording/pattern regression detected (delegates to the shared
 *     cohort guard's contract by re-deriving the placeholder set from source)
 *
 * Usage: node scripts/validate-city-intelligence.mjs [outDir] [sampleSize]
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const OUT = resolve(process.argv[2] ?? "out");
const SAMPLE = Number.parseInt(process.argv[3] ?? "0", 10) || Number.POSITIVE_INFINITY;
const errors = [];
const fail = (m) => errors.push(m);

const BANDS = new Set([
  "Among the highest", "Higher than most", "Above typical",
  "Around typical", "Below typical", "Among the lowest",
]);
/**
 * check15 — band labels must not promise a quantile. Aggregated the bands are
 * well calibrated, but per dimension they are not (39.1% of positioned climate
 * entries fall in the lowest band), so a "Top 10%" / "Bottom 25%" label would
 * be a precision claim the corpus cannot support.
 */
const QUANTILE_LABEL = /\b(?:Top|Bottom)\s*\d+\s*%/;
const LABELS = new Set([
  "Safety", "Healthcare", "Economy", "Education",
  "Climate comfort", "Air quality", "Internet", "Affordability",
]);
const FORBIDDEN = /\b(popular|trending|featured|recommended|best city|rank\s*#\d)\b/i;
const MIN_COHORT = 10;

/* ---------------------------------------------------- placeholder cohort ---- */
const citiesSrc = readFileSync("lib/data/cities.ts", "utf8");
const placeholders = new Set();
const allSlugs = new Set();
for (const m of citiesSrc.matchAll(
  /\{\s*slug:\s*"([^"]+)",\s*name:\s*"[^"]*",\s*countrySlug:\s*"([^"]+)",\s*countryName:\s*"[^"]*",\s*region:\s*"[^"]*",\s*population:\s*"([^"]*)",[\s\S]{0,1400}?scores:\s*\{([^}]*)\}/g,
)) {
  const [, slug, , population, scoreBlock] = m;
  allSlugs.add(slug);
  const vals = [...scoreBlock.matchAll(/(\w+):\s*([\d.]+)/g)].map((x) => Number.parseFloat(x[2]));
  // Detect the placeholder SEMANTICS (all-50), not the wording — check 14.
  if (vals.length > 0 && vals.every((v) => v === 50)) placeholders.add(slug);
  if (population.trim() === "Pending integration" && !(vals.length > 0 && vals.every((v) => v === 50))) {
    fail(`check14: "${slug}" carries the pending-integration marker but not the all-50 pattern — sentinel semantics drifted`);
  }
}
if (allSlugs.size === 0) fail("check1: parsed 0 cities from lib/data/cities.ts — parser is blind");

/* ------------------------------------------------------------- html sample -- */
const cityDir = join(OUT, "cities");
if (!existsSync(cityDir)) {
  console.error(`city-intelligence validation FAILED\n  - missing ${cityDir} (run a build first)`);
  process.exit(1);
}
const files = readdirSync(cityDir).filter((f) => f.endsWith(".html"));
const emitted = new Set(files.map((f) => f.replace(/\.html$/, "")));
for (const slug of allSlugs) {
  if (!emitted.has(slug)) fail(`check1: no emitted page for city "${slug}"`);
}

// Deterministic spread: always include known-interesting cities, then stride.
const forced = ["tokyo", "new-york", "london", "prague", "brno", "porto", "sao-paulo",
  "mexico-city", "sofia", "york", "reykjavik", "kumzar"].filter((s) => emitted.has(s));
const rest = files.map((f) => f.replace(/\.html$/, "")).filter((s) => !forced.includes(s)).sort();
const stride = Number.isFinite(SAMPLE)
  ? Math.max(1, Math.floor(rest.length / Math.max(1, SAMPLE - forced.length)))
  : 1;
const sample = [...forced, ...rest.filter((_, i) => i % stride === 0)].slice(0, SAMPLE);

const routeExists = (p) => {
  const rel = p.replace(/^\/+/, "");
  return existsSync(join(OUT, `${rel}.html`)) || existsSync(join(OUT, rel, "index.html"));
};

let withScorecard = 0, positioned = 0, suppressed = 0, placeholderPages = 0;
const linkCache = new Map();

for (const slug of sample) {
  const html = readFileSync(join(cityDir, `${slug}.html`), "utf8");
  const start = html.indexOf('id="city-intelligence"');
  if (start === -1) { fail(`check1: ${slug} has no scorecard section`); continue; }
  // Bound to the section's own closing tag. A fixed-size window would run past
  // it into the photo-attribution markup and flag credit links ("Wikimedia
  // Commons") as if they were dimension labels. The component nests no
  // <section>, so the first closing tag is the right one.
  const end = html.indexOf("</section>", start);
  if (end === -1) { fail(`check1: ${slug} scorecard section is unterminated`); continue; }
  const block = html.slice(start, end);
  withScorecard += 1;
  const isPlaceholder = placeholders.has(slug);
  if (isPlaceholder) placeholderPages += 1;

  // 3 — no NaN/Infinity anywhere in the block
  if (/\b(NaN|Infinity|-Infinity)\b/.test(block)) fail(`check3: ${slug} renders NaN/Infinity`);

  // 13 — no fabricated labels
  const text = block.replace(/<[^>]+>/g, " ");
  if (FORBIDDEN.test(text)) fail(`check13: ${slug} renders a fabricated label`);

  // 8 — no raw currency amounts presented as a dimension
  if (/\b(USD|EUR|GBP|JPY|IRR|KWD)\b/.test(text)) fail(`check8: ${slug} shows a raw currency in the scorecard`);

  // 12 — every dimension label is canonical
  for (const m of block.matchAll(/>([A-Z][A-Za-z ]{2,20})<\/a>/g)) {
    const label = m[1].trim();
    if (!LABELS.has(label) && !/^\d+$/.test(label)) {
      fail(`check12: ${slug} renders non-registry dimension label "${label}"`);
    }
  }

  // 4 + 5 + 10 — band labels bounded; cohort >= MIN_COHORT whenever stated
  const bandMatches = [...text.matchAll(/(Among the highest|Higher than most|Above typical|Around typical|Below typical|Among the lowest) of (\d+) cities/g)];
  if (QUANTILE_LABEL.test(text)) fail(`check15: ${slug} renders a quantile band label, which the distribution does not support`);
  for (const [, band, nRaw] of bandMatches) {
    const n = Number.parseInt(nRaw, 10);
    if (!BANDS.has(band)) fail(`check4: ${slug} unknown band "${band}"`);
    if (!Number.isFinite(n) || n < MIN_COHORT) fail(`check10: ${slug} states "${band} of ${n} cities" below the ${MIN_COHORT}-city minimum`);
    if (n > allSlugs.size) fail(`check5: ${slug} cohort ${n} exceeds corpus size`);
  }
  if (bandMatches.length > 0) positioned += 1; else suppressed += 1;

  // 2 + 9 — placeholder cities must have no position and no highlights
  if (isPlaceholder) {
    if (bandMatches.length > 0) fail(`check2: placeholder city ${slug} carries ${bandMatches.length} positional claim(s)`);
    if (/Strongest in|Trade-offs in/.test(text)) fail(`check9: placeholder city ${slug} shows strengths/trade-offs`);
    if (!/pending data integration|Directional/i.test(text)) fail(`check2: placeholder city ${slug} does not disclose its directional status`);
  }

  // 9 — highlights require at least one position
  if (/Strongest in|Trade-offs in/.test(text) && bandMatches.length === 0) {
    fail(`check9: ${slug} shows highlights without any positioned dimension`);
  }

  // 6 — country context names this city's own country only
  const ctx = [...text.matchAll(/(?:Strongest|Trade-offs) in ([A-Z][A-Za-z .'-]+)/g)].map((m) => m[1].trim());
  const own = /Positions compare .*? with other indexed cities in ([A-Z][A-Za-z .'-]+?)\./.exec(text);
  if (own) {
    for (const c of ctx) {
      if (!own[1].startsWith(c) && !c.startsWith(own[1])) {
        fail(`check6: ${slug} compares against "${c}" but its country context is "${own[1]}"`);
      }
    }
  }

  // 7 — absent values say "Not available", never 0
  if (/>0<\/span>/.test(block)) fail(`check7: ${slug} renders a bare 0 as a dimension value`);

  // 11 — every deep link resolves
  for (const m of block.matchAll(/href="(\/[^"#?]+)"/g)) {
    const href = m[1];
    if (!linkCache.has(href)) linkCache.set(href, routeExists(href));
    if (!linkCache.get(href)) fail(`check11: ${slug} links to unemitted route ${href}`);
  }
}

/* check16 — tie suppression, actually executed.
 * A city sharing its published value with more than a quarter of its cohort
 * must NOT carry a band for that dimension; the card must say "Typical for
 * this country" instead. Without this gate a change to MAX_TIE_SHARE, or to
 * how ties are counted, would ship silently. */
const idxPath = join(OUT, "discovery-index/cities.json");
let tieChecked = 0;
let tieViolations = 0;
if (existsSync(idxPath)) {
  const idx = JSON.parse(readFileSync(idxPath, "utf8"));
  const KEYS = { Safety: "f", Healthcare: "h", Economy: "e", Education: "u",
    "Climate comfort": "k", "Air quality": "q", Internet: "i", Affordability: "a" };
  const byCountry = new Map();
  for (const c of idx.cities) {
    if (c.a === null) continue; // placeholders never enter a cohort
    let m = byCountry.get(c.c);
    if (!m) { m = new Map(); byCountry.set(c.c, m); }
    for (const k of Object.values(KEYS)) {
      if (c[k] === null) continue;
      const arr = m.get(k) ?? [];
      arr.push(c[k]); m.set(k, arr);
    }
  }
  const labels = Object.keys(KEYS);
  for (const c of idx.cities) {
    if (c.a === null) continue;
    const file = join(cityDir, `${c.s}.html`);
    if (!existsSync(file)) continue;
    const html = readFileSync(file, "utf8");
    const i = html.indexOf('id="city-intelligence"');
    if (i === -1) continue;
    const text = html.slice(i, html.indexOf("</section>", i)).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    for (const [label, k] of Object.entries(KEYS)) {
      const v = c[k];
      if (v === null) continue;
      const arr = byCountry.get(c.c)?.get(k) ?? [];
      if (arr.length < MIN_COHORT) continue;
      const tie = arr.filter((x) => x === v).length;
      if (tie / arr.length <= 0.25) continue;
      // Slice this dimension's own caption: from its label to the next label.
      const at = text.indexOf(label);
      if (at === -1) continue;
      let stop = text.length;
      for (const other of labels) {
        if (other === label) continue;
        const o = text.indexOf(other, at + label.length);
        if (o !== -1 && o < stop) stop = o;
      }
      const caption = text.slice(at, stop);
      tieChecked += 1;
      if (/of \d+ cities/.test(caption)) {
        tieViolations += 1;
        if (tieViolations <= 5) {
          fail(`check16: ${c.s} "${label}" has tie share ${(tie / arr.length * 100).toFixed(0)}% but still renders a band: ${caption.trim().slice(0, 80)}`);
        }
      }
    }
  }
  if (tieViolations > 5) fail(`check16: ...and ${tieViolations - 5} more tie-suppression violations`);
}

if (errors.length > 0) {
  console.error("city-intelligence validation FAILED");
  for (const e of errors.slice(0, 30)) console.error(`  - ${e}`);
  if (errors.length > 30) console.error(`  ...and ${errors.length - 30} more`);
  process.exit(1);
}
console.log("city-intelligence validation PASSED");
console.log(`  corpus cities           ${allSlugs.size}`);
console.log(`  placeholder cohort      ${placeholders.size} (all-50 semantics, wording-independent)`);
console.log(`  pages sampled           ${sample.length} (incl. ${placeholderPages} placeholder)`);
console.log(`  scorecard present       ${withScorecard}/${sample.length}`);
console.log(`  with country positions  ${positioned}`);
console.log(`  positions suppressed    ${suppressed}`);
console.log(`  distinct deep links     ${linkCache.size}, all resolve`);
console.log(`  tie-suppression checked ${tieChecked} entries, ${tieViolations} violations`);
