/**
 * Local stand-in for Netlify's static edge, for redirect rehearsal only.
 *
 * Applies netlify.toml the way Netlify documents it: a real file always wins
 * over a non-forced redirect, rules are evaluated top to bottom, `:splat`
 * expands a trailing `/*`, and anything unmatched is a real 404 served from
 * out/404.html. There is deliberately no SPA fallback, because production has
 * none and adding one here would hide exactly the failure this rehearsal looks
 * for.
 *
 * Usage: node scripts/release/netlify-harness.mjs <outDir> [port]
 */
import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const ROOT = resolve(new URL("../..", import.meta.url).pathname);
const OUT = resolve(process.argv[2] ?? "out");
const PORT = Number(process.argv[3] ?? 4331);

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".png": "image/png", ".jpg": "image/jpeg",
  ".webp": "image/webp", ".woff2": "font/woff2" };

// ---- parse netlify.toml redirects (order preserved) ------------------------
const toml = readFileSync(join(ROOT, "netlify.toml"), "utf8");
const rules = [];
for (const m of toml.matchAll(/\[\[redirects\]\]\s*\n((?:\s*\w+\s*=\s*.*\n)+)/g)) {
  const rule = {};
  for (const kv of m[1].matchAll(/(\w+)\s*=\s*"?([^"\n]+)"?/g)) rule[kv[1]] = kv[2].trim();
  rules.push({
    from: rule.from,
    to: rule.to,
    status: Number(rule.status ?? 200),
    force: String(rule.force ?? "false") === "true",
  });
}

function fileFor(pathname) {
  const rel = normalize(pathname).replace(/^(\.\.[/\\])+/, "").replace(/^\//, "");
  const candidates = rel === "" ? ["index.html"] : [rel, `${rel}.html`, join(rel, "index.html")];
  for (const c of candidates) {
    const p = join(OUT, c);
    if (existsSync(p) && statSync(p).isFile()) return p;
  }
  return null;
}

function matchRule(pathname) {
  for (const rule of rules) {
    if (!rule.from || !rule.to) continue;
    // Absolute `from` values are host rules (apex -> www); the harness reports
    // them rather than simulating a second hostname.
    if (/^https?:\/\//.test(rule.from)) continue;
    if (rule.from.endsWith("/*")) {
      const prefix = rule.from.slice(0, -1);
      if (pathname.startsWith(prefix)) {
        return { ...rule, target: rule.to.replace(":splat", pathname.slice(prefix.length)) };
      }
    } else if (pathname === rule.from) {
      return { ...rule, target: rule.to };
    }
  }
  return null;
}

createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split("?")[0]);
  const rule = matchRule(pathname);

  // Netlify: a real file wins unless the rule is forced.
  const file = fileFor(pathname);
  if (rule && (rule.force || !file)) {
    res.writeHead(rule.status, { location: rule.target });
    res.end();
    return;
  }
  if (file) {
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
    return;
  }
  const notFound = join(OUT, "404.html");
  res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
  if (existsSync(notFound)) createReadStream(notFound).pipe(res);
  else res.end("404");
}).listen(PORT, () => {
  console.log(`netlify harness: ${OUT} on http://127.0.0.1:${PORT}`);
  console.log(`  redirect rules loaded: ${rules.length} (host rules skipped: ${
    rules.filter((r) => /^https?:\/\//.test(r.from)).length})`);
});
