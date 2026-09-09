#!/usr/bin/env node
/**
 * POISON TESTS for the navigation, ranking and country-economics gates.
 *
 * A validator that has never failed is a hope, not a gate. Each case injects
 * one real defect into the committed source, runs the REAL validator as a
 * subprocess, and asserts that it fails AND that the expected reason appears in
 * the output. Checking the reason and not merely the exit code is the point: a
 * case that asserts only "red" passes just as happily when something unrelated
 * breaks, which lets the rule it claims to cover rot away unnoticed.
 *
 * Every file is restored from an in-memory copy of the original bytes, and a
 * final clean run proves the tree was restored.
 *
 * Usage: node scripts/poison-navigation.mjs
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

const NAV = "scripts/validate-navigation.mjs";
const ECON = "scripts/validate-country-economics.mjs";
const PROXY = "scripts/validate-proxy-routes.mjs";

const CASES = [
  /* ---- economic ordering ------------------------------------------- */
  {
    group: "economic",
    name: "default country sort falls back to alphabetical",
    file: "lib/data/official/country-economics/queries.ts",
    find: `export const DEFAULT_COUNTRY_SORT: CountryEconomicSort = "gdp";`,
    replace: `export const DEFAULT_COUNTRY_SORT: CountryEconomicSort = "az";`,
    validator: NAV,
    expect: "default sort must be economic size",
  },
  {
    group: "economic",
    name: "country missing GDP treated as zero",
    file: "lib/data/official/country-economics/dataset.ts",
    find: `    countrySlug: "taiwan",\n    countryCode: "TW",\n    reportingStatus: "not-reported",\n    note:`,
    replace: `    countrySlug: "taiwan",\n    countryCode: "TW",\n    gdpCurrentUsd: 0,\n    gdpPerCapitaCurrentUsd: 0,\n    dataYear: REFERENCE_YEAR,\n    reportingStatus: "reported",\n    note:`,
    validator: ECON,
    expect: "non-positive",
  },
  {
    group: "economic",
    name: "GDP-per-capita sort accidentally reads nominal GDP",
    file: "lib/data/official/country-economics/queries.ts",
    find: `  const field =\n    sort === "gdp" ? "gdpCurrentUsd" : ("gdpPerCapitaCurrentUsd" as const);`,
    replace: `  const field = "gdpCurrentUsd" as const;`,
    validator: NAV,
    expect: "same leader as the GDP sort",
  },
  {
    group: "economic",
    name: "a synthetic platform score drives the country order",
    file: "lib/data/official/country-economics/queries.ts",
    find: `export function getCountriesByEconomicSize() {\n  return countries\n    .slice()\n    .sort((a, b) => compareByEconomicSort("gdp", a, b));`,
    replace: `export function getCountriesByEconomicSize() {\n  return countries\n    .slice()\n    .sort((a, b) => a.name.localeCompare(b.name));`,
    validator: NAV,
    expect: "economic sort is not taking effect",
  },
  {
    group: "economic",
    name: "reference year silently removed from a row",
    file: "lib/data/official/country-economics/dataset.ts",
    find: `    gdpPerCapitaCurrentUsd: 94896.5621495988,\n    dataYear: REFERENCE_YEAR,`,
    replace: `    gdpPerCapitaCurrentUsd: 94896.5621495988,`,
    validator: ECON,
    expect: "reference year",
  },
  {
    group: "economic",
    name: "unsupported country value inserted without a source country record",
    file: "lib/data/official/country-economics/dataset.ts",
    find: `export const countryEconomicRecords: CountryEconomicRecord[] = [`,
    replace: `export const countryEconomicRecords: CountryEconomicRecord[] = [\n  {\n    countrySlug: "atlantis",\n    countryCode: "AT",\n    iso3Code: "ATL",\n    gdpCurrentUsd: 1e12,\n    gdpPerCapitaCurrentUsd: 50000,\n    dataYear: REFERENCE_YEAR,\n    reportingStatus: "reported",\n  },`,
    validator: ECON,
    expect: "Unknown countrySlug",
  },
  {
    group: "economic",
    name: "the two layers disagree on the same World Bank indicator",
    file: "lib/data/official/country-economics/dataset.ts",
    find: `    countrySlug: "singapore",\n    countryCode: "SG",\n    iso3Code: "SGP",\n    gdpCurrentUsd: 572877260178.427,`,
    replace: `    countrySlug: "singapore",\n    countryCode: "SG",\n    iso3Code: "SGP",\n    gdpCurrentUsd: 572877260178.427,\n    // poisoned per-capita value below\n`,
    replaceAlso: {
      find: `    gdpPerCapitaCurrentUsd: 94896.5621495988,\n    dataYear: REFERENCE_YEAR,\n    reportingStatus: "reported",\n  },\n  {\n    countrySlug: "germany",`,
      replace: `    gdpPerCapitaCurrentUsd: 80000,\n    dataYear: REFERENCE_YEAR,\n    reportingStatus: "reported",\n  },\n  {\n    countrySlug: "germany",`,
    },
    validator: ECON,
    expect: "differs between layers",
  },

  /* ---- rankings ----------------------------------------------------- */
  {
    group: "ranking",
    name: "published ranking absent from the registry, and so from the footer",
    file: "lib/navigation/rankings-registry.ts",
    find: `  ranking(\n    "affordability-balance",`,
    replace: `  // removed\n  ranking(\n    "affordability-balance-removed",`,
    validator: NAV,
    expect: "missing from the ranking registry",
  },
  {
    group: "ranking",
    name: "published shortlist absent from the registry",
    file: "lib/navigation/rankings-registry.ts",
    find: `  collection(\n    "best-cities-for-families",`,
    replace: `  collection(\n    "best-cities-for-familes",`,
    validator: NAV,
    expect: "missing from the ranking registry",
  },
  {
    group: "ranking",
    name: "a registry ranking route that no page publishes",
    file: "lib/navigation/rankings-registry.ts",
    find: `  ranking(\n    "clean-air-cities",`,
    replace: `  ranking(\n    "cleanest-air-cities-2026",`,
    validator: NAV,
    expect: "has no published page behind it",
  },
  {
    group: "ranking",
    name: "duplicate ranking slug in the registry",
    file: "lib/navigation/rankings-registry.ts",
    find: `export const RANKING_REGISTRY: RankingRegistryEntry[] = [`,
    replace: `export const RANKING_REGISTRY: RankingRegistryEntry[] = [\n  ranking(\n    "clean-air-cities",\n    "Cleanest Air Cities",\n    "Clean Air",\n    "Duplicate.",\n    "environment",\n  ),`,
    validator: NAV,
    expect: "duplicate ranking registry id",
  },
  {
    group: "ranking",
    name: "a draft ranking exposed on public surfaces",
    file: "lib/navigation/rankings-registry.ts",
    find: `export function publishedRankings(): RankingRegistryEntry[] {\n  return RANKING_REGISTRY.filter((entry) => entry.published);`,
    replace: `export function publishedRankings(): RankingRegistryEntry[] {\n  return RANKING_REGISTRY.filter(() => true);`,
    validatorSetup: {
      file: "lib/navigation/rankings-registry.ts",
      find: `  collection(\n    "best-cities-for-public-transport",`,
      replace: `  { id: "ranking:draft-experiment", slug: "draft-experiment", title: "Draft", shortLabel: "Draft", description: "Not published.", theme: "life", published: false, family: "ranking", route: "/rankings/draft-experiment" },\n  collection(\n    "best-cities-for-public-transport",`,
    },
    validator: NAV,
    expect: "has no published page behind it",
  },
  {
    group: "ranking",
    name: "a ranking route pointing at the wrong family's URL shape",
    file: "lib/navigation/rankings-registry.ts",
    find: `  family: "collection",\n  // Collections are served at the site root, not under /best-cities. That is\n  // the existing published shape (\`getCollectionUrl\`), preserved exactly.\n  route: \`/\${slug}\`,`,
    replace: `  family: "collection",\n  route: \`/best-cities/\${slug}\`,`,
    validator: NAV,
    expect: "its family publishes at",
  },

  /* ---- sitemap discovery --------------------------------------------- */
  {
    group: "sitemap",
    name: "a proxied product's sitemap is dropped from robots.txt",
    file: "lib/navigation/ecosystem.ts",
    find: `export const PROXIED_SITEMAPS = ["/blog/sitemap.xml", "/places/sitemap.xml"] as const;`,
    replace: `export const PROXIED_SITEMAPS = ["/blog/sitemap.xml"] as const;`,
    validator: PROXY,
    expect: 'no sitemap declared inside its "/places" namespace',
  },
  {
    group: "sitemap",
    name: "robots.txt points at a deployment origin instead of this domain",
    file: "lib/navigation/ecosystem.ts",
    find: `export const PROXIED_SITEMAPS = ["/blog/sitemap.xml", "/places/sitemap.xml"] as const;`,
    replace: `export const PROXIED_SITEMAPS = ["/blog/sitemap.xml", "https://globalcityintelligence-places.netlify.app/places/sitemap.xml"] as const;`,
    validator: PROXY,
    expect: "names an origin rather than this domain",
  },
  {
    group: "sitemap",
    name: "a sitemap is declared for a namespace this site does not proxy",
    file: "lib/navigation/ecosystem.ts",
    find: `export const PROXIED_SITEMAPS = ["/blog/sitemap.xml", "/places/sitemap.xml"] as const;`,
    replace: `export const PROXIED_SITEMAPS = ["/blog/sitemap.xml", "/places/sitemap.xml", "/guides/sitemap.xml"] as const;`,
    validator: PROXY,
    expect: "not inside any proxied namespace",
  },

  /* ---- navigation ---------------------------------------------------- */
  {
    group: "navigation",
    name: "duplicate primary nav destination",
    file: "lib/navigation/ecosystem.ts",
    find: `  { id: "rankings", label: "Rankings", path: "/rankings", primary: true },`,
    replace: `  { id: "rankings", label: "Rankings", path: "/rankings", primary: true },\n  { id: "rankings-again", label: "Rankings", path: "/rankings", primary: true },`,
    validator: NAV,
    expect: "duplicate primary nav destination",
  },
  {
    group: "navigation",
    name: "Places link points at an internal Netlify origin",
    file: "lib/navigation/ecosystem.ts",
    find: `  { id: "places", label: "Places", path: "/places", primary: true, servedBy: "gci-places" },`,
    replace: `  { id: "places", label: "Places", path: "https://gci-places.netlify.app/places", primary: true, servedBy: "gci-places" },`,
    validator: NAV,
    expect: "internal Netlify origin",
  },
  {
    group: "navigation",
    name: "Blog link points at the blog origin instead of the canonical domain",
    file: "lib/navigation/ecosystem.ts",
    find: `  { id: "blog", label: "Blog", path: "/blog", primary: true, servedBy: "gci-media" },`,
    replace: `  { id: "blog", label: "Blog", path: "https://globalcityintelligence-blog.netlify.app/blog", primary: true, servedBy: "gci-media" },`,
    validator: NAV,
    expect: "internal Netlify origin",
  },
  {
    group: "navigation",
    name: "a cross-repository target downgraded to http",
    file: "lib/navigation/ecosystem.ts",
    find: `export const CANONICAL_ORIGIN = "https://www.globalcityintelligence.com";`,
    replace: `export const CANONICAL_ORIGIN = "http://www.globalcityintelligence.com";`,
    validator: NAV,
    expect: "canonical origin must be the public www host over https",
  },
  {
    group: "navigation",
    name: "a city Explore module linking to a nonexistent ranking route",
    file: "components/discovery/ExploreCity.tsx",
    find: `  "collection:best-cities-for-families",`,
    replace: `  "collection:best-cities-for-families-2026",`,
    validator: NAV,
    expect: "REGISTRY_LOOKUP_MISS",
    // This one is proven differently: a bad id resolves to nothing, so the
    // module silently renders one fewer link rather than a broken one. The
    // rendered check below is what proves a bad ROUTE cannot ship.
    skipReason:
      "an unknown registry id cannot produce a link at all — see the rendered ranking-href check in validate-navigation.mjs",
  },
  {
    group: "navigation",
    name: "a city-specific Places link generated for an unsupported city",
    file: "lib/navigation/places.ts",
    find: `  if (!placesPublic) return null;\n  const entry = byGciSlug.get(citySlug);\n  if (entry) {`,
    replace: `  if (!placesPublic) return null;\n  const entry = byGciSlug.get(citySlug) ?? {\n    placesCitySlug: citySlug,\n    gciCitySlug: citySlug,\n    name: citySlug,\n    countryName: "",\n    path: \`/places/\${citySlug}/\`,\n    publishedPlaces: 0,\n    publishedAreas: 0,\n    publishedCollections: 0,\n  };\n  if (entry) {`,
    validator: NAV,
    expect: "must never get a city-scoped Places link",
  },
  {
    group: "navigation",
    name: "a featured country slug with no public country route",
    file: "lib/navigation/featured.ts",
    find: `  { slug: "australia", label: "Australia" },`,
    replace: `  { slug: "australiaa", label: "Australia" },`,
    validator: NAV,
    expect: "has no country record",
  },
  {
    group: "navigation",
    name: "a featured city slug with no public city route",
    file: "lib/navigation/featured.ts",
    find: `  { slug: "hong-kong", label: "Hong Kong" },`,
    replace: `  { slug: "hong-kong-sar", label: "Hong Kong" },`,
    validator: NAV,
    expect: "has no city record",
  },
  {
    group: "navigation",
    name: "the Places manifest naming a city this corpus does not have",
    file: "lib/navigation/places-manifest.json",
    find: `"gciCitySlug": "prague"`,
    replace: `"gciCitySlug": "praha"`,
    validator: NAV,
    expect: "not a city in this corpus",
  },
  {
    group: "navigation",
    name: "the navigation row grows above its breakpoint and wraps on wide screens",
    file: "components/layout/PrimaryNav.tsx",
    find: `                    "nav:min-h-10 nav:w-auto nav:px-2.5 nav:text-[13.5px]",`,
    replace: `                    "nav:min-h-10 nav:w-auto nav:px-2.5 nav:text-[13.5px] xl:px-3 xl:text-sm",`,
    validator: NAV,
    expect: "grows above its breakpoint",
  },
  {
    group: "navigation",
    name: "a contract-driven component rendering cross-deployment links with next/link",
    file: "components/navigation/HubNav.tsx",
    find: `import { EcosystemLink } from "@/components/navigation/EcosystemLink";\nimport { availableDestinations } from "@/lib/navigation/ecosystem";`,
    replace: `import Link from "next/link";\nimport { availableDestinations } from "@/lib/navigation/ecosystem";\nconst EcosystemLink = Link;\nvoid (<Link href="/" />);`,
    validator: NAV,
    expect: "renders <Link> directly",
  },
  {
    group: "navigation",
    name: "a cross-deployment path linked with next/link",
    file: "lib/navigation/ecosystem.ts",
    find: `export function isCrossDeploymentPath(href: string): boolean {\n  return ECOSYSTEM_DESTINATIONS.some(`,
    replace: `export function isCrossDeploymentPath(href: string): boolean {\n  return false && ECOSYSTEM_DESTINATIONS.some(`,
    validator: NAV,
    expect: "must treat /blog as cross-deployment",
  },
];

/* ------------------------------------------------------------------ */
const originals = new Map();
const readOriginal = (file) => {
  if (!originals.has(file)) {
    originals.set(file, readFileSync(resolve(ROOT, file), "utf8"));
  }
  return originals.get(file);
};
const restore = () => {
  for (const [file, content] of originals) {
    writeFileSync(resolve(ROOT, file), content);
  }
};

const run = (validator) => {
  try {
    const out = execFileSync("node", [validator], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { ok: true, output: out };
  } catch (error) {
    return {
      ok: false,
      output: `${error.stdout ?? ""}${error.stderr ?? ""}`,
    };
  }
};

let failures = 0;
let skipped = 0;

for (const validator of [NAV, ECON, PROXY]) {
  const baseline = run(validator);
  if (!baseline.ok) {
    console.error(`ABORT: ${validator} is already failing before any poison was applied.`);
    console.error(baseline.output);
    process.exit(1);
  }
}
console.log("  baseline: all validators are GREEN before poisoning\n");

for (const testCase of CASES) {
  if (testCase.skipReason) {
    console.log(`  n/a        ${testCase.name}\n               ${testCase.skipReason}`);
    skipped += 1;
    continue;
  }

  const targets = [testCase, testCase.validatorSetup, testCase.replaceAlso].filter(Boolean);
  let anchorMissing = null;

  for (const target of targets) {
    const file = target.file ?? testCase.file;
    // Snapshot before the first edit so restore() can put every file back.
    readOriginal(file);
    const current = readFileSync(resolve(ROOT, file), "utf8");
    if (!current.includes(target.find)) {
      anchorMissing = `${file}: anchor not found`;
      break;
    }
    writeFileSync(resolve(ROOT, file), current.replace(target.find, target.replace));
  }

  if (anchorMissing) {
    console.log(`  ANCHOR ✗   ${testCase.name}  (${anchorMissing})`);
    failures += 1;
    restore();
    continue;
  }

  const result = run(testCase.validator);
  restore();

  if (result.ok) {
    console.log(`  NOT CAUGHT ${testCase.name}`);
    failures += 1;
  } else if (!result.output.includes(testCase.expect)) {
    console.log(`  WRONG RULE ${testCase.name}`);
    console.log(`               expected "${testCase.expect}" in the failure`);
    console.log(`               got: ${result.output.split("\n").filter((l) => l.trim().startsWith("-")).slice(0, 2).join(" | ")}`);
    failures += 1;
  } else {
    console.log(`  caught     [${testCase.group}] ${testCase.name}`);
  }
}

restore();
const finalNav = run(NAV);
const finalEcon = run(ECON);
const finalProxy = run(PROXY);
console.log(
  `\n  restored: navigation is ${finalNav.ok ? "GREEN" : "RED"}, country economics is ${finalEcon.ok ? "GREEN" : "RED"}, proxy routes are ${finalProxy.ok ? "GREEN" : "RED"}`,
);
if (!finalNav.ok || !finalEcon.ok || !finalProxy.ok) failures += 1;

const tested = CASES.length - skipped;
console.log(
  failures === 0
    ? `\nALL ${tested} POISON CASES CAUGHT BY THE EXPECTED RULE${skipped ? ` (${skipped} documented as not-applicable)` : ""}`
    : `\n${failures} POISON CASE(S) NOT HANDLED CORRECTLY`,
);
process.exit(failures === 0 ? 0 : 1);
