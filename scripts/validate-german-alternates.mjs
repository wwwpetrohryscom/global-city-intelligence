/**
 * THE ENGLISH SIDE OF THE GERMAN HREFLANG CLUSTER.
 *
 * This application advertises a German alternate for 2,757 of its pages. The
 * German pages live in another repository and another deployment, so nothing
 * here can follow the link at build time — which is exactly why the mapping is
 * a committed contract and this gate exists to hold the emitted artifact to it.
 *
 * The failure this prevents is specific and damaging: an hreflang alternate
 * pointing at a page that does not exist. Germany has 257 cities and 240 have a
 * German profile; 1,542 module pages and 18 do. Anything that DERIVED the
 * German URL from a city name would advertise thousands of dead alternates,
 * and a dead alternate is worse than no alternate — it tells a search engine
 * the translation exists.
 *
 * Usage: node scripts/validate-german-alternates.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const OUT = join(ROOT, "out");
const errors = [];
let checks = 0;
const check = (ok, msg) => {
  checks += 1;
  if (!ok) errors.push(msg);
};

if (!existsSync(OUT)) {
  console.error("out/ is missing — build before validating the German alternates");
  process.exit(1);
}

const contract = JSON.parse(
  readFileSync(join(ROOT, "lib", "i18n", "german-localization-pairs.json"), "utf8"),
);
const pairs = contract.pairs;
const pairCount = Object.keys(pairs).length;
check(
  pairCount === contract.count,
  `the contract says it holds ${contract.count} pairs and holds ${pairCount}`,
);
check(
  /^[0-9a-f]{40}$/.test(contract.generatedFrom.commit),
  "the contract does not record the German commit it was generated from",
);

/* Every German target must be an absolute path under /de/ that ends in a slash. */
for (const [en, de] of Object.entries(pairs)) {
  if (!de.startsWith("/de/")) {
    errors.push(`"${en}" maps to "${de}", which is not under /de/`);
    break;
  }
  if (!de.endsWith("/")) {
    errors.push(
      `"${en}" maps to "${de}", which has no trailing slash — the German app runs trailingSlash:true and that URL would redirect`,
    );
    break;
  }
  if (!en.startsWith("/") || en.endsWith("/")) {
    errors.push(`"${en}" is not this application's route shape (leading slash, no trailing slash)`);
    break;
  }
}
checks += 3;

/* Walk the emitted artifact and collect every de-DE alternate actually shipped. */
const htmlFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith(".html")) htmlFiles.push(full);
  }
})(OUT);

const ALTERNATE = /<link rel="alternate" hrefLang="de-DE" href="([^"]+)"/;
const emitted = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const m = ALTERNATE.exec(html);
  if (!m) continue;
  const route = "/" + relative(OUT, file).replace(/\.html$/, "").replace(/\/index$/, "");
  emitted.set(route === "/index" ? "/" : route, m[1]);
}

const ORIGIN = "https://www.globalcityintelligence.com";
check(
  emitted.size === pairCount,
  `${emitted.size} pages emit a German alternate, but the contract holds ${pairCount} pairs`,
);

for (const [route, href] of emitted) {
  const expected = pairs[route];
  if (!expected) {
    errors.push(`${route} advertises a German alternate but is not in the contract`);
    continue;
  }
  if (href !== `${ORIGIN}${expected}`) {
    errors.push(`${route}: alternate is "${href}", the contract says "${ORIGIN}${expected}"`);
  }
}
for (const en of Object.keys(pairs)) {
  if (!emitted.has(en)) {
    errors.push(`the contract pairs "${en}", but that page emits no German alternate`);
  }
}
checks += emitted.size;

/*
 * THE TRAILING SLASH SURVIVED THE BUILD.
 *
 * Next rewrites URLs it considers its own against `trailingSlash`, and DE-1 lost
 * an entire hreflang cluster to exactly that: the German app appended a slash to
 * Main's unslashed URL and pointed every alternate at a 301. The behaviour was
 * measured before relying on it here, and this check is what keeps it measured.
 */
const stripped = [...emitted.values()].filter((href) => !href.endsWith("/"));
check(
  stripped.length === 0,
  `${stripped.length} German alternates lost their trailing slash in the build (e.g. ${stripped[0]}) — each one now points at a redirect`,
);

if (errors.length > 0) {
  console.error(`German alternate validation FAILED — ${errors.length} problem(s)`);
  for (const e of errors.slice(0, 12)) console.error(`  ${e}`);
  if (errors.length > 12) console.error(`  …and ${errors.length - 12} more`);
  process.exit(1);
}
console.log(
  `German alternate validation passed — ${checks} checks; ${emitted.size} reciprocal pairs, all with a trailing slash, all matching the contract generated from ${contract.generatedFrom.commit.slice(0, 12)}`,
);
