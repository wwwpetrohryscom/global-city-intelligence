#!/usr/bin/env node
/**
 * Runs the country-economics module-load validation on its own.
 *
 * The assertions live in `lib/data/official/country-economics/validate.ts` and
 * fire whenever the layer is imported, so a broken snapshot already fails the
 * build. This runner exists so the same rules can be checked in a second
 * rather than a full build — which is what makes poison-testing them practical.
 */
import { resolve } from "node:path";
import { createJiti } from "jiti";

const ROOT = resolve(import.meta.dirname, "..");
const jiti = createJiti(ROOT, { alias: { "@": ROOT } });

try {
  const { validateCountryEconomics } = jiti(
    "./lib/data/official/country-economics/validate.ts",
  );
  const report = validateCountryEconomics();
  report.throwIfErrors("Country-economics snapshot failed validation:");
  const { countryEconomicRecords, REFERENCE_YEAR } = jiti(
    "./lib/data/official/country-economics/dataset.ts",
  );
  const reported = countryEconomicRecords.filter(
    (record) => record.reportingStatus === "reported",
  ).length;
  console.log(
    `country economics validation passed — ${countryEconomicRecords.length} countries, ${reported} with World Bank values for ${REFERENCE_YEAR}`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
