/**
 * POISON TESTS for the locale contract and the visible language switch.
 *
 * Each case injects one defect and names the validator that must fail. A case
 * that injects nothing is reported as stale rather than silently passing — the
 * German repository lost five cases to exactly that before it was checked, so
 * the check is built in here from the start:
 *
 *   POISON_PRECHECK=1 node scripts/poison-locale-contract.mjs
 *
 * A crash is not a catch. A case counts only when the validator exits non-zero
 * AND its output names the expected rule text.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const SWITCHER = "components/i18n/LanguageSwitcher.tsx";
const CONTRACT = "lib/i18n/german-localization-pairs.json";
const METADATA = "lib/seo/metadata.ts";
const TOML = "netlify.toml";
const PARIS = "out/cities/paris.html";
const COLOGNE = "out/cities/cologne.html";

const VALIDATE_ALTERNATES = "scripts/validate-german-alternates.mjs";
const VALIDATE_PROXY = "scripts/validate-proxy-routes.mjs";

/** @type {{name:string,file:string,find:string,replace:string,validator:string,expect:string}[]} */
const CASES = [
  {
    name: "a page with no German counterpart is given a German alternate",
    file: PARIS,
    find: "<title>",
    replace:
      '<link rel="alternate" hrefLang="de-DE" href="https://www.globalcityintelligence.com/de/deutschland/paris/"/><title>',
    validator: VALIDATE_ALTERNATES,
    expect: "is not in the contract",
  },
  {
    name: "a German alternate loses its trailing slash and points at a redirect",
    file: COLOGNE,
    find: 'hrefLang="de-DE" href="https://www.globalcityintelligence.com/de/deutschland/koeln/"',
    replace: 'hrefLang="de-DE" href="https://www.globalcityintelligence.com/de/deutschland/koeln"',
    validator: VALIDATE_ALTERNATES,
    expect: "trailing slash",
  },
  {
    name: "a German alternate points at the wrong German city",
    file: COLOGNE,
    find: 'hrefLang="de-DE" href="https://www.globalcityintelligence.com/de/deutschland/koeln/"',
    replace: 'hrefLang="de-DE" href="https://www.globalcityintelligence.com/de/deutschland/berlin/"',
    validator: VALIDATE_ALTERNATES,
    expect: "the contract says",
  },
  {
    name: "a language link points at the physical Netlify origin",
    file: COLOGNE,
    find: 'hrefLang="de-DE" href="https://www.globalcityintelligence.com/de/deutschland/koeln/"',
    replace: 'hrefLang="de-DE" href="https://globalcityintelligence-de.netlify.app/de/deutschland/koeln/"',
    validator: VALIDATE_ALTERNATES,
    expect: "the contract says",
  },
  {
    name: "the pair contract misreports how many pairs it holds",
    file: CONTRACT,
    find: '"count": 2757,',
    replace: '"count": 2500,',
    validator: VALIDATE_ALTERNATES,
    expect: "pairs and holds",
  },
  {
    name: "the pair contract forgets which German commit produced it",
    file: CONTRACT,
    find: '"commit": "874059e395af40e73027524fd7c280314225e04e"',
    replace: '"commit": "unknown"',
    validator: VALIDATE_ALTERNATES,
    expect: "does not record the German commit",
  },
  {
    name: "the switcher stops deriving its options from the page's hreflang links",
    file: SWITCHER,
    find: "link[rel='alternate'][hreflang]",
    replace: "a[data-locale]",
    validator: VALIDATE_ALTERNATES,
    expect: "no longer derives its options",
  },
  {
    name: "the switcher fetches a localization registry at runtime",
    file: SWITCHER,
    find: "    setLinks(readLocaleLinks(document));",
    replace: "    fetch('/locales.json').then(() => setLinks(readLocaleLinks(document)));",
    validator: VALIDATE_ALTERNATES,
    expect: "runtime lookup",
  },
  {
    name: "the switcher special-cases German instead of staying locale-agnostic",
    file: SWITCHER,
    find: "    if (!label) continue;",
    replace: "    if (locale === 'de-DE' && href.startsWith('/de/')) { /* german */ }\n    if (!label) continue;",
    validator: VALIDATE_ALTERNATES,
    expect: "special-cases German",
  },
  {
    name: "the switcher offers x-default as if it were a language",
    file: SWITCHER,
    find: 'locale === "x-default"',
    replace: 'locale === "not-a-default"',
    validator: VALIDATE_ALTERNATES,
    expect: "does not exclude x-default",
  },
  {
    name: "createMetadata stops emitting the German alternate",
    file: METADATA,
    find: "  const german = germanAlternate(path);",
    replace: "  const german = null as string | null;",
    validator: VALIDATE_ALTERNATES,
    expect: "no longer asks the pair contract",
  },
  {
    name: "the German proxy origin is retargeted",
    file: TOML,
    find: 'to = "https://globalcityintelligence-de.netlify.app/de/:splat"',
    replace: 'to = "https://example.invalid/de/:splat"',
    validator: VALIDATE_PROXY,
    expect: "de",
  },
  {
    name: "the bare /de proxy rule is removed",
    file: TOML,
    find: '  from = "/de"\n  to = "https://globalcityintelligence-de.netlify.app/de"',
    replace: '  from = "/de-disabled"\n  to = "https://globalcityintelligence-de.netlify.app/de"',
    validator: VALIDATE_PROXY,
    expect: "de",
  },
];

const run = (script) => {
  try {
    const out = execFileSync("node", [script], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ""}${e.stderr ?? ""}` };
  }
};

if (process.env.POISON_PRECHECK) {
  let stale = 0;
  for (const c of CASES) {
    const path = join(ROOT, c.file);
    if (!existsSync(path)) {
      console.error(`  STALE  ${c.name}\n           missing file: ${c.file}`);
      stale += 1;
    } else if (!readFileSync(path, "utf8").includes(c.find)) {
      console.error(`  STALE  ${c.name}\n           find string absent in ${c.file}`);
      stale += 1;
    }
  }
  console.log(`\npoison:locale: ${CASES.length - stale}/${CASES.length} cases still inject their defect`);
  if (stale > 0) process.exit(1);
  console.log("poison:locale precheck OK");
  process.exit(0);
}

const baseline = run(VALIDATE_ALTERNATES);
if (baseline.code !== 0) {
  console.error("baseline is already failing — fix the corpus before poisoning it");
  console.error(baseline.out);
  process.exit(1);
}
console.log("  baseline: the clean artifact passes the validator\n");

let caught = 0;
for (const c of CASES) {
  const path = join(ROOT, c.file);
  const backup = `${path}.poison-backup`;
  copyFileSync(path, backup);
  try {
    const original = readFileSync(path, "utf8");
    if (!original.includes(c.find)) {
      console.log(`  MISSED  ${c.name}\n           the find string is not present — the case injected nothing`);
      continue;
    }
    writeFileSync(path, original.replace(c.find, c.replace));
    const result = run(c.validator);
    const hit = result.code !== 0 && result.out.includes(c.expect);
    if (hit) {
      caught += 1;
      console.log(`  caught  ${c.name}`);
    } else {
      console.log(
        `  MISSED  ${c.name}\n           expected "${c.expect}", validator exited ${result.code}`,
      );
    }
  } finally {
    copyFileSync(backup, path);
    unlinkSync(backup);
  }
}

const restored = run(VALIDATE_ALTERNATES);
if (restored.code !== 0) {
  console.error("\npoison:locale FAILED — the tree did not return to a clean state");
  process.exit(1);
}
console.log(`\npoison:locale: ${caught}/${CASES.length} caught`);
if (caught !== CASES.length) {
  console.error("poison:locale FAILED — a defect went undetected");
  process.exit(1);
}
console.log("poison:locale OK — every case was caught by its own validator");
