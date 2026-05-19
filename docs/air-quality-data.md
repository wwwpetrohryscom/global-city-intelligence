# Air quality dataset layer

The air-quality dataset is the first verified dataset published through the platform's official data ingestion foundation. Read `data-ingestion.md` first for the architecture overview, accepted-source policy, and provenance model.

## Status

- Dataset ID: `global-city-air-quality`
- Publisher: Global City Intelligence
- Records currently shipped: **1** (`new-york`)
- Verification status: `partial`
- Accepted citations: WHO Global Air Quality Database (`who-air`), European Environment Agency (`eea-air`), US EPA NAAQS (`epa-naaqs`), US EPA AirData annual summary (`us-epa-airdata`), OpenAQ open air-quality platform (`openaq`)

The first verified batch ships a single city (New York City) with a single metric (annual Median AQI for 2024) sourced from the US EPA AirData annual-AQI-by-county summary. Every other candidate city remains in transparent fallback until its publisher data is integrated through the same flow. The platform never fabricates AQI, PM2.5, PM10, NO₂, or O₃ values to fill the gap — empty is the honest answer when no accepted publisher value is available locally.

## First verified batch

| City | Country | Metric | Value | Year | Publisher | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `new-york` | United States | `aqi` (Median AQI) | 43 | 2024 | US EPA AirData (`us-epa-airdata`) | Annual Median AQI for New York County (Manhattan) — disclosed as the reference borough |

The record is stored verbatim from EPA AirData's `annual_aqi_by_county_2024.csv` (file last modified 2025-12-04). New York City spans five counties (Bronx, Kings, New York, Queens, Richmond); Manhattan (New York County) is shown as the reference borough and that choice is disclosed in the record's `notes` field. No transformation beyond the documented reference-county selection is applied.

## Skipped cities (and why)

The 15 other cities listed in the first-batch brief (`copenhagen`, `stockholm`, `oslo`, `helsinki`, `amsterdam`, `berlin`, `paris`, `london`, `vienna`, `zurich`, `toronto`, `vancouver`, `tokyo`, `singapore`, `sydney`) were each evaluated for a verified path and **skipped** in this batch:

- **Copenhagen, Stockholm, Oslo, Helsinki, Amsterdam, Berlin, Paris, Vienna, Zurich** — Verified city-level annual values for the canonical EEA national feeds are not exposed through a stable JSON download from this environment; the per-station JSON paths require ad-hoc aggregation that is out of scope for a "first verified batch" task. They are intentionally deferred to the OpenAQ-routed pull (which preserves underlying publisher attribution) once an `OPENAQ_API_KEY` is configured.
- **London** — UK DEFRA AURN annual statistics are published as a JS-rendered portal rather than a stable JSON/CSV endpoint reachable from this environment. Deferred to the OpenAQ-routed pull.
- **Toronto, Vancouver** — Environment and Climate Change Canada's NAPS annual data portal is a JS application that does not expose a static city-aggregated JSON endpoint from this environment. Deferred to the OpenAQ-routed pull.
- **Tokyo** — The Ministry of the Environment / Tokyo Metropolitan Government publish station-level data but no stable city-aggregated JSON endpoint was reachable from this environment. Deferred to the OpenAQ-routed pull.
- **Singapore** — `data.gov.sg` exposes a live PSI reading endpoint with five sub-region values (south, north, east, west, central). These are 24-hour readings at a specific timestamp, not an annual mean comparable to EPA AirData; mixing them into the same dataset without a scope qualifier would be misleading. Deferred until the platform either adds a "current reading" record shape or aggregates the sub-regions through a documented methodology.
- **Sydney** — The NSW air-quality portal API rejected an anonymous query from this environment. Deferred to the OpenAQ-routed pull.

The skipped cities will be added incrementally once their accepted-publisher data is downloaded through the manual ingestion flow (OpenAQ-routed via `scripts/data/ingest-air-quality.sh`, or a future per-publisher helper) and reviewed.

## Ingestion paths

Two paths feed the dataset; both are run manually at build time and are **never** imported by any module under `app/`, `lib/`, or `components/`.

### Path A — direct publisher download (used for `new-york`)

EPA AirData publishes annual summary files at predictable URLs. The 2024 file used for the New York record is `https://aqs.epa.gov/aqsweb/airdata/annual_aqi_by_county_2024.zip`. The maintainer downloads the file, locates the rows for the relevant county, reviews the Median AQI / 90th percentile AQI / day-count columns, then appends a record by hand. No script is required for a single-city pull, and writing one would have added churn for one row.

### Path B — OpenAQ-routed station pull (used for OpenAQ-attributed cities)

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

## Data year policy

Each record carries its own `dataYear` and `lastUpdated`. The platform never silently mixes reporting years: when a comparison page or coverage table renders multiple cities, the per-record year is preserved alongside the value so readers can spot mismatched years. The first verified batch is a single record at `dataYear: "2024"`. As future records are added, their own years remain attached and the surface UI continues to show them per record.

## No-fabrication policy and how it is enforced

- **No invented values.** Numbers are only ever copied from an accepted publisher's published output. The `notes` field on each record carries the exact source attribution and the column / file / methodology that yielded the value.
- **No invented AQI.** AQI is taken directly from a publisher (EPA AirData's Median AQI). The platform does **not** synthesize AQI from PM2.5 or any other concentration — there is no AQI calculator in this codebase.
- **No invented categories.** A categorical reading (Good / Moderate / etc.) is only added when the publisher itself reports a category for the city. Categories derived locally from a numeric value are not permitted.
- **No invented sources.** Every `sourceIds` entry must resolve in `lib/data/sources/index.ts`. The validator throws at module load if an unknown source id is cited.
- **No invented coverage.** The dataset's `verificationStatus` is `partial` because only one city has a verified record; it is **not** marked `verified` until coverage is broad enough to honestly describe the dataset as verified.
- **No runtime fetches.** No `fetch`, `axios`, `useEffect`, `useState`, `"use client"`, or runtime API key is involved in rendering air-quality data. Pages read the in-memory dataset module.

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
