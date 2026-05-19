# Air quality dataset layer

The air-quality dataset is the first verified dataset published through the platform's official data ingestion foundation. Read `data-ingestion.md` first for the architecture overview, accepted-source policy, and provenance model.

## Status

- Dataset ID: `global-city-air-quality`
- Publisher: Global City Intelligence
- Records currently shipped: **0**
- Verification status: `unavailable`
- Accepted citations: WHO Global Air Quality Database (`who-air`), European Environment Agency (`eea-air`), US EPA NAAQS (`epa-naaqs`), OpenAQ open air-quality platform (`openaq`)

The dataset begins empty by design. Every page that surfaces the air-quality dataset shows a transparent fallback until verified measurements are integrated from accepted publishers. The platform never fabricates AQI, PM2.5, PM10, NO₂, or O₃ values to fill the gap — empty is the honest answer when no accepted publisher value is available locally.

## Why the dataset is still empty

A verified air-quality batch needs values published by an accepted official publisher, with provenance preserved at the record level. The accepted publishers each impose a different access path:

- **WHO Global Air Quality Database** is distributed as an Excel workbook updated on an irregular cadence; it is not exposed over a public JSON API.
- **EEA national air-quality feeds** publish daily/hourly values per station, but the city-level aggregation is left to the consumer.
- **US EPA NAAQS / AirNow** publish station-level measurements for US monitors, not city-level summaries.
- **OpenAQ** aggregates the above (and many other national feeds) and is the only publisher that exposes a unified, station-level JSON API across countries. OpenAQ v3 requires an API key (`OPENAQ_API_KEY`) and gates anonymous traffic.

The platform integrates OpenAQ as the primary station-level aggregator and preserves the underlying publisher attribution that OpenAQ exposes (provider/owner metadata) on every record. Anonymous, unattributed measurements are skipped rather than published.

## Ingestion workflow

`scripts/data/ingest-air-quality.sh` is a build-time/manual helper that fetches the latest measurement per `(city, parameter)` tuple from OpenAQ v3 and prints a TypeScript record literal. The script is **never** invoked during page rendering — and never imported by any module under `app/`, `lib/`, or `components/`.

```
OPENAQ_API_KEY=your-openaq-key \
  ./scripts/data/ingest-air-quality.sh > /tmp/air-quality.ts
```

Without `OPENAQ_API_KEY`, the script writes a noisy stderr warning, emits a header-only TypeScript file, and exits 0. It never silently substitutes another data source.

Optional filters compose as the intersection of two sets:

```
# refresh a single city
CITY_FILTER="copenhagen" OPENAQ_API_KEY=... ./scripts/data/ingest-air-quality.sh

# refresh PM-only metrics across all cities
METRIC_FILTER="pm25:pm10" OPENAQ_API_KEY=... ./scripts/data/ingest-air-quality.sh

# combine — PM2.5 for Copenhagen and Stockholm only
CITY_FILTER="copenhagen:stockholm" METRIC_FILTER="pm25" OPENAQ_API_KEY=... \
  ./scripts/data/ingest-air-quality.sh
```

The script never produces an `aqi` field: OpenAQ does not compute AQI, and AQI must not be derived locally from PM measurements. Records emitted by the script carry only the parameters OpenAQ reports.

After reviewing the generated file, paste the records into `airQualityDatasetRecords` in `lib/data/official/air-quality/dataset.ts`, then run:

```
npm run typecheck && npm run lint && npm run build
```

`validate.ts` runs at module load and refuses any record that fails the schema.

## Source attribution policy

OpenAQ is registered as an accepted source (`openaq` in `lib/data/sources/index.ts`) but **only** as the aggregator. Every record emitted by `ingest-air-quality.sh` includes the underlying publisher name in `notes`. Before committing the generated records:

- Confirm the underlying publisher (national environment agency, EEA feed, EPA AirNow, etc.) is itself listed in `lib/data/sources/index.ts`. If it is missing, add it first.
- Extend `sourceIds` from `["openaq"]` to `["openaq", "<underlying-publisher>"]`. A bare `["openaq"]` citation is acceptable only when the underlying publisher is itself OpenAQ-managed and no other registry exists.
- If the OpenAQ provider/owner metadata is empty, skip the record. The platform does not publish a measurement it cannot attribute.

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

- A `validate:air-quality` npm script that runs the validator without booting Next.js.
- A WHO-air ingestion helper for the Global Air Quality Database (Excel) once a stable parser is in place.
- EEA per-country city-level aggregation helpers for European cities lacking OpenAQ coverage.
