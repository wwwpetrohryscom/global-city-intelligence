#!/usr/bin/env node
/**
 * PROXY ROUTE GATE.
 *
 * Two of this site's three public products are served by other deployments
 * through Netlify rewrites: /blog/* (GCI Media) and /places/* (GCI Places).
 * Those rules are the only thing making one domain out of three deploy units,
 * and nothing else in the build would notice if one of them broke:
 *
 *   - a rule downgraded from 200 to 301 turns a proxy into a redirect and
 *     exposes the origin hostname in the address bar
 *   - a missing `force` lets a stray file in this 169,774-file artifact win
 *     over the rule
 *   - a bare-path rule dropped (only the splat kept) 404s the exact URL the
 *     primary navigation links to
 *   - an origin hostname appearing in emitted HTML leaks infrastructure into
 *     the canonical product and into search results
 *
 * Usage: node scripts/validate-proxy-routes.mjs [--out out]
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const outFlag = process.argv.indexOf("--out");
const OUT = outFlag === -1 ? null : resolve(process.argv[outFlag + 1] ?? "out");

const errors = [];
let checks = 0;
const check = (ok, msg) => {
  checks += 1;
  if (!ok) errors.push(msg);
};

/** The products this site proxies, and the origin each must point at. */
const PROXIED = [
  { name: "GCI Media", base: "/blog", origin: "https://globalcityintelligence-blog.netlify.app" },
  { name: "GCI Places", base: "/places", origin: "https://globalcityintelligence-places.netlify.app" },
];

const toml = readFileSync(join(ROOT, "netlify.toml"), "utf8");

/** Minimal [[redirects]] parser — enough to assert the properties that matter. */
function parseRedirects(source) {
  const blocks = source.split(/\[\[redirects\]\]/).slice(1);
  return blocks.map((block, index) => {
    const stop = block.search(/\n\[\[|\n\[build|\n\[\[headers\]\]/);
    const body = stop === -1 ? block : block.slice(0, stop);
    const field = (name) => {
      const m = body.match(new RegExp(`^\\s*${name}\\s*=\\s*(?:"([^"]*)"|(true|false)|(\\d+))`, "m"));
      return m ? (m[1] ?? m[2] ?? m[3]) : undefined;
    };
    return {
      order: index,
      from: field("from"),
      to: field("to"),
      status: field("status"),
      force: field("force") === "true",
    };
  });
}

const redirects = parseRedirects(toml);
check(redirects.length > 0, "netlify.toml declares no redirects at all");

for (const product of PROXIED) {
  const bare = redirects.find((r) => r.from === product.base);
  const splat = redirects.find((r) => r.from === `${product.base}/*`);

  // Both rules. The splat alone does not reliably match the bare path, which is
  // the URL the primary navigation links to.
  check(Boolean(bare), `${product.name}: no rule for the bare "${product.base}" path`);
  check(Boolean(splat), `${product.name}: no rule for "${product.base}/*"`);

  for (const [label, rule, expectedTo] of [
    ["bare", bare, `${product.origin}${product.base}`],
    ["splat", splat, `${product.origin}${product.base}/:splat`],
  ]) {
    if (!rule) continue;
    check(
      rule.status === "200",
      `${product.name} ${label}: status is ${rule.status}, not 200 — that is a redirect, and it would put the origin hostname in the address bar`,
    );
    check(
      rule.force === true,
      `${product.name} ${label}: force is not true — a file in this artifact could win over the proxy`,
    );
    check(
      rule.to === expectedTo,
      `${product.name} ${label}: proxies to "${rule.to}", expected "${expectedTo}"`,
    );
    check(
      rule.to?.startsWith("https://"),
      `${product.name} ${label}: origin is not https`,
    );
  }

  // Ordering: nothing earlier may swallow the namespace.
  const earliest = Math.min(bare?.order ?? Infinity, splat?.order ?? Infinity);
  const swallowing = redirects.filter(
    (r) =>
      r.order < earliest &&
      typeof r.from === "string" &&
      (r.from === "/*" || r.from === `${product.base}/*` || r.from === product.base) &&
      r.to !== bare?.to &&
      r.to !== splat?.to,
  );
  check(
    swallowing.length === 0,
    `${product.name}: an earlier rule (${swallowing[0]?.from} -> ${swallowing[0]?.to}) matches before the proxy`,
  );
}

// A catch-all SPA fallback would soft-200 every unknown URL, including inside
// the proxied namespaces.
check(
  !redirects.some((r) => r.from === "/*" && r.status === "200"),
  "a catch-all `/* -> 200` rule exists; every unknown URL would become a soft 200",
);

// The two namespaces must not overlap each other.
check(
  new Set(redirects.filter((r) => r.status === "200").map((r) => r.from)).size ===
    redirects.filter((r) => r.status === "200").length,
  "two proxy rules declare the same `from` path",
);

/* ---- the emitted artifact ---- */
if (OUT) {
  check(existsSync(OUT), `${OUT} does not exist — build first`);

  for (const product of PROXIED) {
    const dir = join(OUT, product.base.replace(/^\//, ""));
    // `force = true` makes the rule win anyway, but a file here means this
    // build has started generating a namespace another product owns.
    check(
      !existsSync(dir),
      `${product.name}: this artifact emits ${product.base}/ files; the namespace belongs to another deployment`,
    );
  }

  // No origin hostname may appear in any emitted HTML.
  const origins = PROXIED.map((p) => p.origin.replace("https://", ""));
  const sample = [];
  const walk = (dir, depth = 0) => {
    if (sample.length > 400 || depth > 2) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (sample.length > 400) return;
      if (entry.name.startsWith("_next")) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full, depth + 1);
      else if (entry.name.endsWith(".html")) sample.push(full);
    }
  };
  walk(OUT);
  let leaks = 0;
  for (const file of sample) {
    const html = readFileSync(file, "utf8");
    for (const origin of origins) {
      if (html.includes(origin)) {
        leaks += 1;
        if (leaks <= 3) {
          errors.push(`${file.slice(OUT.length + 1)} references the deployment origin "${origin}"`);
        }
      }
    }
  }
  checks += 1;
  check(leaks === 0, `${leaks} emitted page(s) reference a deployment origin hostname`);
  console.log(`  scanned ${sample.length} emitted pages for origin leakage`);
}

if (errors.length > 0) {
  console.error(`proxy route validation FAILED (${errors.length} of ${checks} checks)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`proxy route validation passed — ${checks} checks${OUT ? ` (including the emitted artifact)` : ""}`);
