# Air quality dataset layer

The air-quality dataset is the first verified dataset published through the platform's official data ingestion foundation. Read `data-ingestion.md` first for the architecture overview, accepted-source policy, and provenance model.

## Status

- Dataset ID: `global-city-air-quality`
- Publisher: Global City Intelligence
- Records at launch: 0
- Verification status: `unavailable`

The dataset begins empty by design. Every page that surfaces the air-quality dataset shows a transparent fallback until verified measurements are integrated from accepted publishers.

## Metric model

`AirQualityMetricKey` is a closed set: `pm25`, `pm10`, `no2`, `o3`, `aqi`, `air_quality_category`. Units default to `µg/m³` for the four pollutants and remain unitless for AQI and category. Add new metric keys only when an accepted publisher reports them at city level with a reliable methodology.

`AirQualityCityMetric` carries the metric value, unit, data year, last-updated date, dataset id, source ids, verification status, and free-form notes. The component layer never reads any other shape — adapters must produce this type.

`AirQualityCityProfile` is the canonical per-city view: an array of metrics plus aggregated provenance, source ids, and verification status (resolved by `lib/data/official/normalization.ts:resolveAggregateStatus`).

## Where the dataset is surfaced

- **City detail page** (`/cities/[city]`): renders `AirQualityProfileSection`. Verified records show metric cards and a table; otherwise the section displays the fallback card and the empty-state table.
- **Clean-air city intent page** (`/cities/[city]/clean-air`): same section, plus tailored fallback copy.
- **Clean-air collection page** (`/best-cities-for-clean-air`): renders `AirQualityCoverageTable` listing every city in the collection with its current dataset coverage. The collection remains unordered; numeric measurements are never used to rank.
- **Comparison pages** (`/compare/[comparison]`): the air-quality category row is enriched with per-city values when the platform has verified records; otherwise the existing structured module summary is used.

## Adding a verified record

1. Identify a city already present in `lib/data/cities.ts`.
2. Find the publisher (WHO, EEA, EPA, OECD, OpenAQ station attributed to an official source, or a national/city environmental agency).
3. Ensure each publisher's URL is in `lib/data/sources/index.ts`. If not, add it with a `reliabilityNote` that ties it to the accepted-source policy.
4. Append an `AirQualityDatasetRecord` to `airQualityDatasetRecords` in `lib/data/official/air-quality/dataset.ts`:
   ```ts
   {
     citySlug: "<existing slug>",
     countrySlug: "<matching country slug>",
     pm25: <number from publisher>,
     dataYear: "<year from publisher>",
     lastUpdated: "<YYYY-MM-DD>",
     sourceIds: ["who-air"],
     datasetId: AIR_QUALITY_DATASET_ID,
   }
   ```
5. Run `npm run typecheck`, `npm run lint`, and `npm run build`. `validate.ts` runs at module load — any malformed value (negative PM, AQI > 500, unknown source id, city/country mismatch, duplicate city) throws before pages render.

## Build-time validation

`validate.ts` performs these checks:

- City slug exists in the city registry.
- Country slug matches the city's `countrySlug`.
- Every source id resolves in `lib/data/sources/index.ts`.
- `datasetId` matches `AIR_QUALITY_DATASET_ID`.
- Numeric fields (`pm25`, `pm10`, `no2`, `o3`, `aqi`) are finite, non-negative, and (for `aqi`) within `[0, 500]`.
- `dataYear`, `lastUpdated`, and `datasetId` are non-empty strings.
- No two records share the same `citySlug`.

The validator runs at module load, so a malformed record blocks the build instead of silently shipping.

## Anti-patterns

- Do not insert any record whose source URL is not listed in the source registry.
- Do not use a category string (e.g. "Good", "Moderate") without a publisher attribution; if uncertain, leave it out.
- Do not produce an AQI value computed locally from PM2.5; if the publisher does not provide AQI, do not synthesize it.
- Do not adjust the published numeric value (no rounding, scaling, or normalization) inside a record. If a transformation is necessary, document it in `provenance.transformationNotes` via the normalization helper.

## Future work (not in this task)

- A `scripts/data/ingest-air-quality.ts` script can read publisher output and emit `AirQualityDatasetRecord` objects locally, then run the validator before writing.
- A `validate:air-quality` npm script can be added once an ingest pipeline exists.
