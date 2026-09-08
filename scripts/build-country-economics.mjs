#!/usr/bin/env node
/**
 * Rebuilds the committed country-economics snapshot from the World Bank API.
 *
 * BUILD-TIME ONLY. The application never fetches economic data at runtime: it
 * is a static export, so a network call would either fail or freeze a value
 * into HTML without provenance. This script is the documented, repeatable way
 * that snapshot is produced, and its output is committed and reviewed.
 *
 * Indicators (exact official ids):
 *   NY.GDP.MKTP.CD  — GDP (current US$)
 *   NY.GDP.PCAP.CD  — GDP per capita (current US$)
 *
 * Reference year: the most recent year for which EVERY World-Bank-reporting
 * supported country has a value, so the default ordering never compares one
 * country's newer year against another's older one. The script prints coverage
 * per year and refuses to pick a year that is not complete.
 *
 * Usage: node scripts/build-country-economics.mjs [--write]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = resolve(ROOT, "lib/data/official/country-economics/dataset.ts");
const WRITE = process.argv.includes("--write");
const RETRIEVED_AT = new Date().toISOString().slice(0, 10);
const YEARS = "2018:2025";

const INDICATORS = {
  gdpCurrentUsd: "NY.GDP.MKTP.CD",
  gdpPerCapitaCurrentUsd: "NY.GDP.PCAP.CD",
};

/** Supported countries, read from the corpus so the two can never diverge. */
function readSupportedCountries() {
  const src = readFileSync(resolve(ROOT, "lib/data/countries.ts"), "utf8");
  const re =
    /slug:\s*"([a-z0-9-]+)",\s*\n\s*name:\s*"([^"]+)",\s*\n\s*iso2:\s*"([A-Z]{2})"/g;
  const out = [];
  for (const m of src.matchAll(re)) out.push({ slug: m[1], name: m[2], iso2: m[3] });
  if (out.length === 0) throw new Error("parsed zero countries from lib/data/countries.ts");
  return out;
}

async function getJson(url) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(90_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
    }
  }
}

async function main() {
  const supported = readSupportedCountries();

  // iso2 -> iso3. Aggregates (region id "NA") are excluded so an aggregate row
  // can never be mistaken for a country.
  const wbList = await getJson("https://api.worldbank.org/v2/country?format=json&per_page=400");
  const iso2to3 = new Map();
  for (const row of wbList[1]) {
    if (row.region?.id === "NA") continue;
    iso2to3.set(row.iso2Code, row.id);
  }

  const codes = supported.map((c) => iso2to3.get(c.iso2)).filter(Boolean);
  const series = {};
  let sourceLastUpdated = null;

  for (const [field, indicator] of Object.entries(INDICATORS)) {
    const byCountry = new Map();
    for (let i = 0; i < codes.length; i += 40) {
      const chunk = codes.slice(i, i + 40).join(";");
      const payload = await getJson(
        `https://api.worldbank.org/v2/country/${chunk}/indicator/${indicator}?format=json&per_page=2000&date=${YEARS}`,
      );
      sourceLastUpdated ??= payload[0]?.lastupdated ?? null;
      for (const row of payload[1] ?? []) {
        if (row.value === null) continue;
        if (!byCountry.has(row.countryiso3code)) byCountry.set(row.countryiso3code, new Map());
        byCountry.get(row.countryiso3code).set(row.date, row.value);
      }
    }
    series[field] = byCountry;
  }

  // Reference year = newest year complete for every reporting country in BOTH
  // indicators. A year that is complete in one indicator but not the other
  // would silently mix vintages between the default sort and the second sort.
  const reporting = codes.filter((code) =>
    Object.values(series).every((byCountry) => byCountry.has(code)),
  );
  let referenceYear = null;
  for (const year of ["2025", "2024", "2023", "2022", "2021", "2020"]) {
    const complete = Object.values(series).every((byCountry) =>
      reporting.every((code) => byCountry.get(code)?.has(year)),
    );
    const covered = reporting.filter((code) =>
      Object.values(series).every((byCountry) => byCountry.get(code)?.has(year)),
    ).length;
    console.log(`  ${year}: ${covered}/${reporting.length} reporting countries complete`);
    if (complete && !referenceYear) referenceYear = year;
  }
  if (!referenceYear) throw new Error("no year has complete coverage across both indicators");
  console.log(`reference year: ${referenceYear}`);

  const records = supported.map((country) => {
    const iso3 = iso2to3.get(country.iso2);
    const gdp = iso3 ? series.gdpCurrentUsd.get(iso3)?.get(referenceYear) : undefined;
    const pc = iso3 ? series.gdpPerCapitaCurrentUsd.get(iso3)?.get(referenceYear) : undefined;
    return { ...country, iso3, gdp, pc };
  });

  const unreported = records.filter((r) => r.gdp === undefined || r.pc === undefined);
  console.log(`records: ${records.length}, unreported: ${unreported.map((r) => r.slug).join(", ") || "none"}`);

  const body = records
    .map((r) => {
      const lines = [
        "  {",
        `    countrySlug: ${JSON.stringify(r.slug)},`,
        `    countryCode: ${JSON.stringify(r.iso2)},`,
      ];
      if (r.iso3) lines.push(`    iso3Code: ${JSON.stringify(r.iso3)},`);
      if (r.gdp !== undefined && r.pc !== undefined) {
        lines.push(`    gdpCurrentUsd: ${r.gdp},`);
        lines.push(`    gdpPerCapitaCurrentUsd: ${r.pc},`);
        lines.push(`    dataYear: REFERENCE_YEAR,`);
        lines.push(`    reportingStatus: "reported",`);
      } else {
        lines.push(`    reportingStatus: "not-reported",`);
        lines.push(
          `    note: "Not a World Bank reporting economy, so no NY.GDP.MKTP.CD or NY.GDP.PCAP.CD value is published for it.",`,
        );
      }
      lines.push("  },");
      return lines.join("\n");
    })
    .join("\n");

  const file = `${HEADER(referenceYear, sourceLastUpdated)}\nexport const countryEconomicRecords: CountryEconomicRecord[] = [\n${body}\n];\n`;

  if (WRITE) {
    writeFileSync(OUT, file);
    console.log(`wrote ${OUT}`);
  } else {
    console.log("(dry run — pass --write to update the committed snapshot)");
  }
}

const HEADER = (referenceYear, sourceLastUpdated) => `// GENERATED FILE — do not edit by hand.
// Rebuild with: node scripts/build-country-economics.mjs --write
//
// Source: World Bank Open Data (World Development Indicators).
//   NY.GDP.MKTP.CD — GDP (current US\$)
//   NY.GDP.PCAP.CD — GDP per capita (current US\$)
//
// Retrieved ${RETRIEVED_AT}. World Bank indicator database last updated
// ${sourceLastUpdated ?? "unknown"}.
//
// Every value belongs to the SAME reference year (${referenceYear}), which is the most
// recent year with complete coverage across both indicators for every
// World-Bank-reporting supported country. Countries the World Bank does not
// report are marked "not-reported" and carry no value — they are never
// defaulted to zero, because zero would sort as the world's smallest economy.
import type { CountryEconomicRecord } from "./types";

export const COUNTRY_ECONOMICS_DATASET_ID = "world-bank-country-economics" as const;
export const REFERENCE_YEAR = "${referenceYear}" as const;
export const COUNTRY_ECONOMICS_RETRIEVED_AT = "${RETRIEVED_AT}" as const;
export const COUNTRY_ECONOMICS_SOURCE_LAST_UPDATED = "${sourceLastUpdated ?? "unknown"}" as const;

/** Exact official indicator ids, so the mapping is auditable from the code. */
export const COUNTRY_ECONOMICS_INDICATOR_IDS = {
  gdpCurrentUsd: "NY.GDP.MKTP.CD",
  gdpPerCapitaCurrentUsd: "NY.GDP.PCAP.CD",
} as const;
`;

await main();
