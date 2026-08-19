#!/usr/bin/env node
/**
 * Validates the city quick-navigation against the exported site.
 *
 * The navigator's core promise is that it never links to a page that does not
 * exist. That cannot be proven from the data alone — only the built tree shows
 * what was actually emitted — so this walks every city in the discovery index,
 * reconstructs the seven section hrefs, and asserts each one resolves.
 *
 * It also asserts the inverse: that the rendered HTML of a sample of city pages
 * really does contain the navigator, with exactly one aria-current="page", and
 * that every href in it is city-scoped (never a bare module index). A navigator
 * that silently disappeared, or that sent a visitor from "Tokyo Climate" to the
 * generic climate hub, would pass a pure data check.
 *
 * Usage: node scripts/validate-quick-nav.mjs [outDir]
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const OUT = resolve(process.argv[2] ?? "out");
const errors = [];
const fail = (msg) => errors.push(msg);

/** Must mirror lib/discovery/city-sections.ts exactly. */
const SECTIONS = [
  { id: "overview", label: "Overview", href: (s) => `/cities/${s}` },
  { id: "cost-of-living", label: "Cost of living", href: (s) => `/cities/${s}/cost-of-living` },
  { id: "climate", label: "Climate", href: (s) => `/cities/${s}/climate` },
  { id: "safety", label: "Safety", href: (s) => `/safety/${s}` },
  { id: "economy", label: "Economy", href: (s) => `/cities/${s}/economy` },
  { id: "education", label: "Education", href: (s) => `/cities/${s}/education` },
  { id: "healthcare", label: "Healthcare", href: (s) => `/cities/${s}/healthcare` },
];

const indexFile = join(OUT, "discovery-index/cities.json");
if (!existsSync(indexFile)) {
  console.error(`quick-nav validation FAILED\n  - missing discovery-index/cities.json in ${OUT}`);
  process.exit(1);
}
const cities = JSON.parse(readFileSync(indexFile, "utf8")).cities ?? [];

const htmlFor = (routePath) => {
  const rel = routePath.replace(/^\/+/, "");
  const a = join(OUT, `${rel}.html`);
  if (existsSync(a)) return a;
  const b = join(OUT, rel, "index.html");
  return existsSync(b) ? b : null;
};

/* ---- 1. every generated href resolves to an emitted page ---- */
let checked = 0;
const missingBySection = new Map();
for (const city of cities) {
  for (const section of SECTIONS) {
    const href = section.href(city.s);
    checked += 1;
    if (!htmlFor(href)) {
      missingBySection.set(section.id, (missingBySection.get(section.id) ?? 0) + 1);
      if (errors.length < 10) fail(`missing page for quick-nav link: ${href}`);
    }
  }
}
for (const [id, n] of missingBySection) fail(`section "${id}": ${n} unresolved links`);

/* ---- 2. the navigator is actually rendered, and behaves ---- */
const SAMPLE = ["tokyo", "brno", "porto", "new-york", "sofia", "york", "kumzar"]
  .filter((slug) => cities.some((c) => c.s === slug));

for (const slug of SAMPLE) {
  for (const section of SECTIONS) {
    const file = htmlFor(section.href(slug));
    if (!file) continue;
    const html = readFileSync(file, "utf8");

    const navMatch = html.match(
      /<nav[^>]*aria-label="[^"]*intelligence sections"[\s\S]*?<\/nav>/,
    );
    if (!navMatch) {
      fail(`${section.href(slug)}: quick nav is absent from the rendered HTML`);
      continue;
    }
    const nav = navMatch[0];

    const current = [...nav.matchAll(/aria-current="page"/g)].length;
    if (current !== 1) {
      fail(`${section.href(slug)}: expected exactly 1 aria-current="page" in quick nav, found ${current}`);
    }

    // Every link must be scoped to THIS city.
    const hrefs = [...nav.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    if (hrefs.length < 2) fail(`${section.href(slug)}: quick nav has ${hrefs.length} links`);
    for (const href of hrefs) {
      if (!href.includes(`/${slug}`)) {
        fail(`${section.href(slug)}: quick-nav link "${href}" is not scoped to this city`);
      }
      if (!htmlFor(href)) fail(`${section.href(slug)}: quick-nav link "${href}" has no emitted page`);
    }

    // The active tab must be the section we are actually on.
    const activeHref = nav.match(/href="([^"]+)"[^>]*aria-current="page"/)
      ?? nav.match(/aria-current="page"[^>]*href="([^"]+)"/);
    if (activeHref && activeHref[1] !== section.href(slug)) {
      fail(
        `${section.href(slug)}: active tab points at "${activeHref[1]}" instead of the current page`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error("quick-nav validation FAILED");
  for (const err of errors.slice(0, 40)) console.error(`  - ${err}`);
  if (errors.length > 40) console.error(`  ...and ${errors.length - 40} more`);
  process.exit(1);
}

console.log("quick-nav validation PASSED");
console.log(`  cities                 ${cities.length}`);
console.log(`  sections per city      ${SECTIONS.length}`);
console.log(`  links verified         ${checked.toLocaleString("en-US")}`);
console.log(`  pages HTML-inspected   ${SAMPLE.length * SECTIONS.length} (${SAMPLE.join(", ")})`);
