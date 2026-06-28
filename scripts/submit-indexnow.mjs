#!/usr/bin/env node
/**
 * IndexNow submission CLI (post-deploy / manual only — never during build).
 *
 * Notifies IndexNow search engines that URLs were added or updated. This is
 * a self-contained ESM script (not typechecked, runnable with plain `node`).
 * It mirrors the contract of lib/seo/indexnow.ts (endpoint, payload,
 * chunking, retries, timeout) so behaviour matches the in-app service.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs <url> [url ...]      Submit explicit URLs
 *   node scripts/submit-indexnow.mjs --sitemap            Submit every URL (follows the sitemap index)
 *   node scripts/submit-indexnow.mjs --cities             Submit only the city-page shards
 *   node scripts/submit-indexnow.mjs --category=nearby    Submit only one shard category
 *   node scripts/submit-indexnow.mjs --recent[=days]      Submit only URLs updated in the last N days (default 30)
 *   node scripts/submit-indexnow.mjs --sitemap=<url>      Submit every URL in a specific sitemap (or index)
 *   node scripts/submit-indexnow.mjs --file=urls.txt      Submit URLs from a file (one per line)
 *   node scripts/submit-indexnow.mjs --sitemap --dry-run  Show what would be sent without sending
 *
 * Options:
 *   --dry-run            Validate + print, do not POST
 *   --key=<key>          Override INDEXNOW_KEY
 *   --host=<host>        Override host (bare host, no protocol)
 *   --endpoint=<url>     Override IndexNow endpoint
 *   --chunk=<n>          URLs per request (default/max 10000)
 *   --retries=<n>        Retry attempts per batch (default 3)
 *   --timeout=<ms>       Per-request timeout (default 15000)
 *
 * Environment:
 *   INDEXNOW_KEY                 (required unless --key)
 *   NEXT_PUBLIC_SITE_URL / SITE_URL  (host + sitemap base; default https://www.globalcityintelligence.com)
 */

import { readFile } from "node:fs/promises";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_MAX_BATCH = 10000;
const DEFAULT_SITE_URL = "https://www.globalcityintelligence.com";

function parseArgs(argv) {
  const opts = { urls: [], dryRun: false, sitemap: null, file: null, category: null, recentDays: null };
  for (const arg of argv) {
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--sitemap") opts.sitemap = opts.sitemap ?? "";
    else if (arg.startsWith("--sitemap=")) opts.sitemap = arg.slice("--sitemap=".length);
    // --cities → only the city-page shards; --category=<name> → any shard category.
    else if (arg === "--cities") { opts.sitemap = opts.sitemap ?? ""; opts.category = "cities"; }
    else if (arg.startsWith("--category=")) { opts.sitemap = opts.sitemap ?? ""; opts.category = arg.slice("--category=".length); }
    // --recent[=days] → only URLs whose <lastmod> is within the last N days (default 30).
    else if (arg === "--recent") { opts.sitemap = opts.sitemap ?? ""; opts.recentDays = 30; }
    else if (arg.startsWith("--recent=")) { opts.sitemap = opts.sitemap ?? ""; opts.recentDays = Number(arg.slice("--recent=".length)); }
    else if (arg.startsWith("--file=")) opts.file = arg.slice("--file=".length);
    else if (arg.startsWith("--key=")) opts.key = arg.slice("--key=".length);
    else if (arg.startsWith("--host=")) opts.host = arg.slice("--host=".length);
    else if (arg.startsWith("--endpoint=")) opts.endpoint = arg.slice("--endpoint=".length);
    else if (arg.startsWith("--chunk=")) opts.chunk = Number(arg.slice("--chunk=".length));
    else if (arg.startsWith("--retries=")) opts.retries = Number(arg.slice("--retries=".length));
    else if (arg.startsWith("--timeout=")) opts.timeout = Number(arg.slice("--timeout=".length));
    else if (arg === "--help" || arg === "-h") opts.help = true;
    else if (arg.startsWith("--")) throw new Error(`Unknown flag: ${arg}`);
    else opts.urls.push(arg);
  }
  return opts;
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
}

function hostFor(opts) {
  if (opts.host) return opts.host;
  try {
    return new URL(siteUrl()).host;
  } catch {
    return new URL(DEFAULT_SITE_URL).host;
  }
}

function decodeXml(s) {
  return s.trim().replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

async function fetchXml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch (${res.status}) from ${url}`);
  return res.text();
}

/**
 * Follow the sitemap (index-aware). If the document is a <sitemapindex>, each child
 * is fetched and its page URLs collected. opts.category filters child shards by name
 * prefix (e.g. "cities" -> cities-*); opts.recentDays keeps only <url> entries whose
 * <lastmod> is within the last N days.
 */
async function fetchSitemapUrls(sitemapUrl, opts = {}) {
  const url = sitemapUrl || `${siteUrl()}/sitemap.xml`;
  console.log(`Fetching sitemap: ${url}`);
  const xml = await fetchXml(url);

  if (/<sitemapindex[\s>]/i.test(xml)) {
    let children = [...xml.matchAll(/<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/sitemap>/gi)].map((m) => decodeXml(m[1]));
    if (opts.category) {
      const before = children.length;
      children = children.filter((c) => {
        const name = c.split("/").pop().replace(/\.xml$/i, "");
        return name === opts.category || name.startsWith(`${opts.category}-`);
      });
      console.log(`  index: ${before} shards → ${children.length} match category "${opts.category}"`);
    } else {
      console.log(`  index: ${children.length} child sitemaps`);
    }
    const all = [];
    for (const child of children) {
      const childXml = await fetchXml(child);
      all.push(...extractUrlEntries(childXml, opts.recentDays));
    }
    console.log(`Sitemap index yielded ${all.length} URL(s).`);
    return all;
  }

  const urls = extractUrlEntries(xml, opts.recentDays);
  console.log(`Sitemap contained ${urls.length} <loc> entries.`);
  return urls;
}

/** Extract page URLs from a <urlset>, optionally filtered to entries modified within `recentDays`. */
function extractUrlEntries(xml, recentDays) {
  const cutoff = recentDays != null && Number.isFinite(recentDays) ? Date.now() - recentDays * 86_400_000 : null;
  const out = [];
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)) {
    const locM = m[1].match(/<loc>([^<]+)<\/loc>/i);
    if (!locM) continue;
    if (cutoff != null) {
      const lm = m[1].match(/<lastmod>([^<]+)<\/lastmod>/i);
      const t = lm ? Date.parse(lm[1].trim()) : NaN;
      if (!Number.isFinite(t) || t < cutoff) continue;
    }
    out.push(decodeXml(locM[1]));
  }
  // Fallback for urlsets without <url> wrappers (defensive)
  if (out.length === 0 && cutoff == null) {
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => decodeXml(m[1]));
  }
  return out;
}

async function readUrlsFromFile(path) {
  const text = await readFile(path, "utf8");
  return text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
}

function normalizeUrls(urls, host) {
  const seen = new Set();
  const kept = [];
  let skipped = 0;
  for (const raw of urls) {
    const url = (raw || "").trim();
    if (!url) { skipped++; continue; }
    let parsed;
    try { parsed = new URL(url); } catch { skipped++; continue; }
    if (!/^https?:$/.test(parsed.protocol) || parsed.host !== host || seen.has(parsed.href)) { skipped++; continue; }
    seen.add(parsed.href);
    kept.push(parsed.href);
  }
  return { kept, skipped };
}

function chunk(items, size) {
  if (!Number.isInteger(size) || size < 1) throw new Error(`chunk size must be a positive integer (got ${size})`);
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function postBatch(urlList, cfg, batchIndex) {
  const body = JSON.stringify({ host: cfg.host, key: cfg.key, keyLocation: cfg.keyLocation, urlList });
  let lastStatus = null;
  let lastError;
  for (let attempt = 1; attempt <= cfg.retries + 1; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), cfg.timeoutMs);
    try {
      const res = await fetch(cfg.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8", Accept: "application/json" },
        body,
        signal: controller.signal,
      });
      lastStatus = res.status;
      if (res.status === 200 || res.status === 202) return { batch: batchIndex, count: urlList.length, status: res.status, ok: true, attempts: attempt };
      if (res.status !== 429 && res.status < 500) return { batch: batchIndex, count: urlList.length, status: res.status, ok: false, attempts: attempt, error: `HTTP ${res.status} (not retryable)` };
      lastError = `HTTP ${res.status}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    } finally {
      clearTimeout(timer);
    }
    if (attempt <= cfg.retries) {
      const backoff = Math.min(1000 * 2 ** (attempt - 1), 8000);
      console.log(`  batch ${batchIndex}: attempt ${attempt} failed (${lastError}); retrying in ${backoff}ms`);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  return { batch: batchIndex, count: urlList.length, status: lastStatus, ok: false, attempts: cfg.retries + 1, error: lastError };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    console.log(`Submit URLs to IndexNow.

  node scripts/submit-indexnow.mjs <url> [url ...]
  node scripts/submit-indexnow.mjs --sitemap [--dry-run]
  node scripts/submit-indexnow.mjs --sitemap=https://host/sitemap.xml
  node scripts/submit-indexnow.mjs --file=urls.txt

Env: INDEXNOW_KEY (required), NEXT_PUBLIC_SITE_URL (host + sitemap base).`);
    return;
  }

  // Validate numeric filter flags up front so bad input fails loudly (never
  // silently submits everything / nothing).
  if (opts.recentDays != null && !(Number.isFinite(opts.recentDays) && opts.recentDays > 0)) {
    console.error(`ERROR: --recent must be a positive number of days (got "${opts.recentDays}").`);
    process.exit(1);
  }
  if (opts.chunk != null && !(Number.isFinite(opts.chunk) && opts.chunk >= 1)) {
    console.error(`ERROR: --chunk must be a positive integer (got "${opts.chunk}").`);
    process.exit(1);
  }

  const key = opts.key || process.env.INDEXNOW_KEY;
  if (!key) {
    console.error("ERROR: INDEXNOW_KEY is not set (and --key not provided).");
    process.exit(1);
  }
  const host = hostFor(opts);
  const cfg = {
    key,
    host,
    keyLocation: `https://${host}/${key}.txt`,
    endpoint: opts.endpoint || INDEXNOW_ENDPOINT,
    chunkSize: Number.isFinite(opts.chunk) && opts.chunk > 0
      ? Math.min(Math.floor(opts.chunk), INDEXNOW_MAX_BATCH)
      : INDEXNOW_MAX_BATCH,
    retries: Number.isFinite(opts.retries) ? Math.max(0, Math.floor(opts.retries)) : 3,
    timeoutMs: Number.isFinite(opts.timeout) && opts.timeout > 0 ? opts.timeout : 15000,
  };

  // Gather URLs from whichever source(s) were given.
  let urls = [...opts.urls];
  if (opts.file) urls.push(...(await readUrlsFromFile(opts.file)));
  if (opts.sitemap !== null) {
    urls.push(...(await fetchSitemapUrls(opts.sitemap, { category: opts.category, recentDays: opts.recentDays })));
  }

  if (urls.length === 0) {
    console.error("ERROR: no URLs to submit. Pass URLs, --sitemap, or --file=<path>. Use --help for usage.");
    process.exit(1);
  }

  const { kept, skipped } = normalizeUrls(urls, host);
  if (kept.length === 0) {
    console.error(`ERROR: no valid URLs for host ${host} (skipped ${skipped}). Check NEXT_PUBLIC_SITE_URL / --host.`);
    process.exit(1);
  }

  const batches = chunk(kept, cfg.chunkSize);
  console.log(
    `IndexNow: ${kept.length} URL(s) → ${cfg.endpoint} in ${batches.length} batch(es) ` +
      `(host=${host}, key=${key.slice(0, 6)}…, keyLocation=${cfg.keyLocation}, skipped=${skipped})${opts.dryRun ? " [DRY RUN]" : ""}`,
  );

  if (opts.dryRun) {
    for (const u of kept.slice(0, 20)) console.log(`  would submit: ${u}`);
    if (kept.length > 20) console.log(`  …and ${kept.length - 20} more`);
    console.log("Dry run complete — nothing was sent.");
    return;
  }

  const results = [];
  let i = 0;
  for (const b of batches) {
    i++;
    const r = await postBatch(b, cfg, i);
    console.log(`  batch ${i}/${batches.length}: ${r.ok ? "OK" : "FAILED"} (${r.count} URLs, status ${r.status ?? "n/a"}, attempts ${r.attempts})${r.error ? ` — ${r.error}` : ""}`);
    results.push(r);
  }

  const okCount = results.filter((r) => r.ok).reduce((n, r) => n + r.count, 0);
  const allOk = results.every((r) => r.ok);
  console.log(`IndexNow: ${allOk ? "all batches OK" : "some batches FAILED"} — ${okCount}/${kept.length} URLs submitted.`);
  if (!allOk) process.exit(2);
}

main().catch((err) => {
  console.error(`IndexNow CLI error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
