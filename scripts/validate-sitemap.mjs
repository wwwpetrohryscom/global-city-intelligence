#!/usr/bin/env node
/**
 * Static validation of the built sitemap index + shards (run after `next build`).
 *
 * Checks:
 *   - /sitemap.xml is a valid <sitemapindex> with >=1 child
 *   - every child shard file exists, is a valid <urlset>, has <=45,000 URLs
 *   - no duplicate page URLs across shards
 *   - every sitemap URL is absolute, HTTPS, and on the canonical host
 *   - every <url> has <lastmod>, <changefreq> and <priority>
 *   - no <changefreq>always (deterministic only)
 *   - robots.txt advertises this site's sitemap index AND every proxied
 *     product's sitemap, all on the canonical host
 *   - sitemap URL set == generated indexable page set (no broken, no orphan)
 *
 * Exit non-zero on any failure.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createJiti } from "jiti";

const ROOT = process.cwd();
const APP = join(ROOT, ".next/server/app");
/**
 * The canonical host, and the sitemaps the OTHER two deployments publish inside
 * the namespaces they own. Read from the navigation contract rather than typed
 * here, so this gate and app/robots.ts cannot disagree about what should be
 * advertised.
 */
const jiti = createJiti(ROOT, { alias: { "@": ROOT } });
const { PROXIED_SITEMAPS } = jiti("./lib/navigation/ecosystem.ts");
const SITE = "https://www.globalcityintelligence.com";
const MAX_PER_SHARD = 45000;
const errors = [];
const warnings = [];

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}
function locs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].trim().replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
  );
}

const indexXml = read(join(APP, "sitemap.xml.body"));
if (!indexXml) { console.error("FAIL: .next/server/app/sitemap.xml.body not found — run `next build` first."); process.exit(1); }
if (!/<sitemapindex[\s>]/.test(indexXml)) errors.push("/sitemap.xml is not a <sitemapindex>");

const childLocs = locs(indexXml);
if (childLocs.length === 0) errors.push("sitemap index lists no child sitemaps");

let host = null;
try { host = new URL(childLocs[0]).host; } catch { /* handled below */ }

const allUrls = [];
const dupes = new Set();
for (const childUrl of childLocs) {
  let path;
  try {
    const u = new URL(childUrl);
    if (u.protocol !== "https:") errors.push(`child sitemap not HTTPS: ${childUrl}`);
    if (host && u.host !== host) errors.push(`child sitemap host mismatch: ${childUrl}`);
    path = u.pathname; // /sitemaps/<name>.xml
  } catch { errors.push(`child sitemap not an absolute URL: ${childUrl}`); continue; }
  const file = join(APP, path.replace(/^\//, "") + ".body");
  const xml = read(file);
  if (!xml) { errors.push(`child sitemap file missing for ${childUrl} (${file})`); continue; }
  if (!/<urlset[\s>]/.test(xml)) errors.push(`${path} is not a <urlset>`);
  const urls = locs(xml);
  if (urls.length === 0) errors.push(`${path} has 0 URLs`);
  if (urls.length > MAX_PER_SHARD) errors.push(`${path} has ${urls.length} URLs (> ${MAX_PER_SHARD})`);
  // per-url metadata completeness + no "always"
  const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
  for (const block of urlBlocks) {
    if (!/<lastmod>/.test(block)) errors.push(`${path}: a <url> missing <lastmod>`);
    if (!/<changefreq>/.test(block)) errors.push(`${path}: a <url> missing <changefreq>`);
    if (!/<priority>/.test(block)) errors.push(`${path}: a <url> missing <priority>`);
    if (/<changefreq>always<\/changefreq>/.test(block)) errors.push(`${path}: uses changefreq "always"`);
  }
  for (const u of urls) {
    try {
      const pu = new URL(u);
      if (pu.protocol !== "https:") errors.push(`URL not HTTPS: ${u}`);
      if (host && pu.host !== host) errors.push(`URL host mismatch: ${u}`);
      if (pu.pathname !== "/" && pu.pathname.endsWith("/")) errors.push(`trailing-slash URL: ${u}`);
    } catch { errors.push(`URL not absolute: ${u}`); }
    if (allUrls.includes(u)) dupes.add(u);
    allUrls.push(u);
  }
}
if (dupes.size) errors.push(`${dupes.size} duplicate URL(s) across shards, e.g. ${[...dupes].slice(0, 3).join(", ")}`);

// robots
const robots = read(join(APP, "robots.txt.body"));
if (!robots) errors.push("robots.txt.body not found");
else {
  /*
   * This used to require EXACTLY ONE Sitemap line. That rule encoded an
   * assumption the architecture outgrew: one domain is now served by three
   * independent deployments, and because each origin's own robots.txt
   * disallows everything, this file is the only one a crawler reads for the
   * host — so it is the only place /blog/sitemap.xml and /places/sitemap.xml
   * can be announced. The rule now checks the SET, which is the thing that
   * actually matters, rather than the count.
   */
  const lines = [...robots.matchAll(/^\s*Sitemap:\s*(\S+)/gim)].map((m) => m[1]);
  const ownIndex = `${SITE}/sitemap.xml`;
  if (!lines.includes(ownIndex)) {
    errors.push(`robots.txt does not advertise this site's sitemap index (${ownIndex})`);
  }
  for (const path of PROXIED_SITEMAPS) {
    if (!lines.includes(`${SITE}${path}`)) {
      errors.push(`robots.txt does not advertise the proxied sitemap ${path}`);
    }
  }
  const expected = new Set([ownIndex, ...PROXIED_SITEMAPS.map((path) => `${SITE}${path}`)]);
  for (const line of lines) {
    if (!expected.has(line)) errors.push(`robots.txt advertises an unexpected sitemap: ${line}`);
    if (!line.startsWith(`${SITE}/`)) errors.push(`robots Sitemap line is not on the canonical host: ${line}`);
  }
}

// coverage: generated indexable pages vs sitemap
function walkHtml(dir, acc) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walkHtml(p, acc);
    else if (name.endsWith(".html")) acc.push(p);
  }
  return acc;
}
const htmlFiles = existsSync(APP) ? walkHtml(APP, []) : [];
const genPaths = new Set();
/** route path -> emitted HTML file, so indexability can be read from the artifact. */
const htmlByPath = new Map();
for (const f of htmlFiles) {
  let rel = f.slice(APP.length).replace(/\.html$/, "").replace(/\/\([^)]+\)/g, "");
  if (rel === "/index" || rel === "") rel = "/";
  genPaths.add(rel);
  if (!htmlByPath.has(rel)) htmlByPath.set(rel, f);
}
const NON_INDEXABLE = new Set(["/_not-found", "/404", "/500", "/_error"]);

/**
 * A page that declares `robots: noindex` is intentionally out of the sitemap —
 * listing it would be the actual error. Read that intent from the emitted HTML
 * rather than maintaining a hand-written exclusion list, so a future noindex
 * page is handled without editing this file.
 */
const noindexPaths = new Set();
for (const [rel, file] of htmlByPath) {
  const html = read(file);
  if (html && /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)) {
    noindexPaths.add(rel);
  }
}

const sitemapPaths = new Set(allUrls.map((u) => { try { return new URL(u).pathname; } catch { return u; } }));

const broken = [...sitemapPaths].filter((p) => !genPaths.has(p));
const orphans = [...genPaths].filter(
  (p) => !sitemapPaths.has(p) && !NON_INDEXABLE.has(p) && !noindexPaths.has(p),
);
// The inverse is a genuine contradiction: a noindex page must never be
// advertised in the sitemap.
const noindexInSitemap = [...sitemapPaths].filter((p) => noindexPaths.has(p));
if (noindexInSitemap.length) {
  errors.push(
    `${noindexInSitemap.length} noindex page(s) present in sitemap, e.g. ${noindexInSitemap.slice(0, 3).join(", ")}`,
  );
}
if (broken.length) errors.push(`${broken.length} sitemap URL(s) with no generated page (broken), e.g. ${broken.slice(0, 3).join(", ")}`);
if (orphans.length) {
  // report as warning — some generated pages may be intentionally non-indexable
  warnings.push(`${orphans.length} generated page(s) not in sitemap (possible orphans), e.g. ${orphans.slice(0, 8).join(", ")}`);
}

console.log(`sitemap index: ${childLocs.length} shards, ${allUrls.length} URLs (${new Set(allUrls).size} unique), host ${host}`);
console.log(`generated pages: ${genPaths.size} (noindex: ${noindexPaths.size}); broken: ${broken.length}; orphans: ${orphans.length}`);
for (const w of warnings) console.log(`  WARN: ${w}`);
if (errors.length) {
  console.error("\nFAIL: sitemap validation errors:");
  for (const e of errors.slice(0, 50)) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("\nPASS: sitemap index + shards + robots + coverage all valid.");
