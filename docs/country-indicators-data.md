# Country indicators dataset

The country-indicators layer is the second verified dataset to ride on the platform's official data ingestion foundation. Read `data-ingestion.md` first for the architecture overview, accepted-source policy, and provenance model.

## Status

- Dataset ID: `global-country-indicators`
- Publisher: Global City Intelligence
- Records at launch: 0
- Verification status: `unavailable`

The dataset begins empty by design. Country hubs and the `/countries` directory show transparent fallback states until verified records land from accepted publishers.

## Indicator model

`CountryIndicatorKey` is a closed set:

- `population`
- `gdp_per_capita`
- `unemployment_rate`
- `internet_usage`
- `life_expectancy`
- `health_expenditure`
- `education_index`
- `co2_emissions_per_capita`
- `urban_population_share`
- `public_transport_context`
- `digital_access`

Add new keys only when an accepted publisher reports the indicator at country level with documented methodology. Labels and default units live in `lib/data/official/country-indicators/types.ts`.

`CountryIndicatorRecord` carries `countrySlug`, `countryCode`, the indicator key + label, optional `value` and `unit`, `dataYear`, `lastUpdated`, `sourceIds`, `datasetId`, `verificationStatus`, and free-form `notes`. Records must never include a value that is not present in the cited publisher's output.

`CountryIndicatorProfile` is the canonical per-country view: an array of records plus aggregated provenance, source ids, dataset ids, data year, last-updated date, and verification status (resolved by the shared `resolveAggregateStatus` helper).

## Accepted sources

Only the publishers listed in `docs/data-ingestion.md` qualify, with these country-indicator-relevant categories:

- World Bank Data
- OECD Data
- UN Data (including UN-Habitat where applicable)
- WHO Global Health Observatory
- IMF Data
- Eurostat / EEA
- Official national statistical offices
- Official government open-data portals
- Documented university or peer-reviewed datasets

Every cited source must be present in `lib/data/sources/index.ts` before any record can reference it.

## Where the dataset is surfaced

- **Country hub** (`/countries/[country]`): renders `CountryIndicatorsSection` after the cities section. Verified records show indicator cards and a table; otherwise the section displays a transparent fallback card and empty-state table. The `#country-indicators` anchor is included in the country hub navigation.
- **Countries directory** (`/countries`): the per-country verified-layer column adds an `Indicators` chip. The directory intro counts how many countries have verified indicators.
- **City pages, intent pages, comparison pages**: untouched in this task. Country indicators may be surfaced there later through dedicated helpers.

## Adding a verified record

1. Confirm the country slug exists in `lib/data/countries.ts` and the iso2 code matches.
2. Confirm every cited publisher is registered in `lib/data/sources/index.ts`. If not, add the source with a `reliabilityNote` tied to the accepted-source policy.
3. Append a `CountryIndicatorRecord` to `countryIndicatorRecords` in `lib/data/official/country-indicators/dataset.ts`:
   ```ts
   {
     countrySlug: "<existing slug>",
     countryCode: "<matching iso2>",
     indicatorKey: "population",
     label: "Population",
     value: <number from publisher>,
     unit: "people",
     dataYear: "<year from publisher>",
     lastUpdated: "<YYYY-MM-DD>",
     sourceIds: ["world-bank-population"], // must exist in central registry
     datasetId: COUNTRY_INDICATOR_DATASET_ID,
     verificationStatus: "verified",
   }
   ```
4. Run `npm run typecheck`, `npm run lint`, and `npm run build`. `validate.ts` runs at module load and throws on:
   - unknown country slug
   - iso2 mismatch
   - unknown source id
   - unknown indicator key
   - mismatched dataset id
   - non-finite or negative numeric value
   - percentage indicator above 100
   - implausible life expectancy (> 130)
   - duplicate `(countrySlug, indicatorKey)` pair

## Build-time validation

`validate.ts` performs these checks and throws via `ValidationReport.throwIfErrors` at module load. The `queries.ts` module imports the validator as a side-effect, so any page that touches a country indicator helper boots the validator. Empty datasets pass cleanly.

## Anti-patterns

- Don't add a value without a publisher attribution; if uncertain, leave it out.
- Don't compute an indicator locally from other indicators; if the publisher does not provide it, do not synthesize it.
- Don't round, scale, or normalize the published numeric value inside a record. Document any necessary transformation in `provenance.transformationNotes` via the normalization helper.
- Don't call external APIs from page or component code. All ingestion is local/manual or runs as a separate build-time script.

## Future work (not in this task)

- A `scripts/data/ingest-country-indicators.ts` script can read publisher exports and emit validated records.
- A `npm run validate:country-indicators` script can be added once an ingest pipeline exists.
- Surface verified indicators on city detail pages and comparison categories once the dataset has coverage.
