#!/usr/bin/env node
/**
 * Bing sitemap ping CLI (post-deploy / manual only — NEVER during build).
 *
 * Pings Bing's legacy sitemap endpoint to nudge a recrawl of the sitemap index.
 *
 *   NOTE: Bing has deprecated unauthenticated sitemap ping; Bing now recommends
 *   IndexNow for instant submission (see `npm run indexnow -- --sitemap`) and
 *   Bing Webmaster Tools for one-time sitemap submission. This CLI is kept for
 *   completeness/automation and logs the real response.
 *
 * Usage:
 *   node scripts/bing-ping.mjs                 Ping {SITE_URL}/sitemap.xml
 *   node scripts/bing-ping.mjs --sitemap=<url> Ping a specific sitemap URL
 *   node scripts/bing-ping.mjs --dry-run       Print the request, do not send
 *
 * Options: --retries=<n> (default 3)  --timeout=<ms> (default 15000)
 * Env: NEXT_PUBLIC_SITE_URL / SITE_URL (default https://www.globalcityintelligence.com)
 */
const DEFAULT_SITE_URL = "https://www.globalcityintelligence.com";
const PING_BASE = "https://www.bing.com/ping";

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
}

function parseArgs(argv) {
  const o = { dryRun: false, retries: 3, timeout: 15000 };
  for (const a of argv) {
    if (a === "--dry-run") o.dryRun = true;
    else if (a === "--help" || a === "-h") o.help = true;
    else if (a.startsWith("--sitemap=")) o.sitemap = a.slice("--sitemap=".length);
    else if (a.startsWith("--retries=")) o.retries = Number(a.slice("--retries=".length));
    else if (a.startsWith("--timeout=")) o.timeout = Number(a.slice("--timeout=".length));
    else throw new Error(`Unknown flag: ${a}`);
  }
  return o;
}

async function pingOnce(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: "GET", signal: controller.signal, redirect: "follow" });
    return { status: res.status, ok: res.ok };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  if (o.help) {
    console.log("Ping Bing to recrawl the sitemap.\n  node scripts/bing-ping.mjs [--sitemap=<url>] [--dry-run]\n" +
      "Prefer `npm run indexnow -- --sitemap` for instant Bing submission via IndexNow.");
    return;
  }
  const sitemap = o.sitemap || `${siteUrl()}/sitemap.xml`;
  const pingUrl = `${PING_BASE}?sitemap=${encodeURIComponent(sitemap)}`;
  console.log(`Bing ping → ${pingUrl}`);
  if (o.dryRun) {
    console.log("[DRY RUN] nothing sent.");
    return;
  }
  let last;
  for (let attempt = 1; attempt <= o.retries + 1; attempt++) {
    try {
      const r = await pingOnce(pingUrl, o.timeout);
      console.log(`  attempt ${attempt}: HTTP ${r.status} ${r.ok ? "OK" : ""}`);
      if (r.ok) { console.log("Bing ping accepted."); return; }
      if (r.status === 404 || r.status === 410) {
        console.log("NOTE: Bing's sitemap ping is deprecated (404/410 expected). " +
          "Use IndexNow (`npm run indexnow -- --sitemap`) or Bing Webmaster Tools instead.");
        return;
      }
      last = `HTTP ${r.status}`;
    } catch (e) {
      last = e instanceof Error ? e.message : String(e);
      console.log(`  attempt ${attempt}: failed (${last})`);
    }
    if (attempt <= o.retries) await new Promise((res) => setTimeout(res, Math.min(1000 * 2 ** (attempt - 1), 8000)));
  }
  console.error(`Bing ping failed after ${o.retries + 1} attempt(s): ${last}`);
  process.exit(2);
}

main().catch((e) => { console.error(`bing-ping error: ${e instanceof Error ? e.message : e}`); process.exit(1); });
