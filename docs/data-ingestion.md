# Official data ingestion

This document explains how to add a verified dataset to Global City Intelligence. The platform never fabricates numeric values; data either has a source-attributed origin or is shown as a transparent fallback.

## Accepted source types

A dataset may only ship to production if every record cites at least one source from the registry in `lib/data/sources/index.ts`, and each cited source comes from one of these publisher categories:

- WHO, including the Global Air Quality Database
- European Environment Agency (EEA)
- US EPA AirNow / EPA AQS / EPA NAAQS
- OECD environmental datasets
- OpenAQ (when the underlying station is attributed to an official publisher)
- National environmental agencies (for example: RIVM, Sundhedsstyrelsen, Umweltbundesamt)
- City or regional environmental agencies operating an official monitoring network
- Government open-data portals
- Peer-reviewed datasets from a named research institution, when fully documented

The following sources are explicitly **not accepted** as data origins:

- Blogs, SEO content sites, commercial AQI widgets
- Social media or user-generated content
- Random scraping or summarized AI snippets
- Unsourced third-party aggregators

## Architecture overview

```
lib/data/official/
  registry.ts            // central registry of datasets
  sources.ts             // trusted official source candidates and registry helpers
  provenance.ts          // provenance constructor
  validation.ts          // generic record validators
  normalization.ts       // shared transforms (status aggregation, unique IDs)
  air-quality/
    types.ts             // metric labels and units
    dataset.ts           // OfficialDataset metadata + record array
    normalize.ts         // record -> AirQualityCityProfile
    validate.ts          // strict dataset validator (runs at module load)
    queries.ts           // helpers used by pages and components
    sources.ts           // baseline source assertion helpers
```

`types/datasets.ts` and `types/air-quality.ts` define the typed surface. All types are re-exported from `types/index.ts`.

## How a dataset record flows

1. A record (e.g. `AirQualityDatasetRecord`) is appended to the dataset module's record array.
2. The dataset module is imported through `lib/data/official/registry.ts`, which exposes it as an `OfficialDataset` for SEO and provenance helpers.
3. `validate.ts` runs at module load. It checks city existence, country match, source registration, finite numeric values, valid AQI bounds, and duplicate city slugs. Errors throw before any page is rendered.
4. `normalize.ts` converts each record into a `AirQualityCityProfile` with attached `DataProvenance`.
5. Query helpers in `queries.ts` provide deterministic, build-safe access for pages and components.

No external API is called during page rendering. The dataset is fully local; integration with publishers happens out of band and lands as new records in the dataset module.

## Adding a new verified dataset record

1. Confirm the source URL is listed in `lib/data/sources/index.ts`. If not, add the source there first with a `reliabilityNote` describing how it qualifies under the accepted-source policy above.
2. Append a record to the dataset's record array (for air quality: `lib/data/official/air-quality/dataset.ts`).
3. Set `datasetId` to the dataset's `id`, `sourceIds` to the relevant entries in the source registry, and `dataYear` / `lastUpdated` to values present on the original publisher's page.
4. Run `npm run typecheck`, `npm run lint`, and `npm run build`. The build invokes the validator at module load; malformed records will throw immediately.

## Fallback policy

When verified city-level data is unavailable, components render a transparent fallback that explicitly says so. Components must not guess, interpolate, or derive missing values from unrelated cities unless the data model explicitly supports it and labels the derivation clearly.

## Provenance

Every metric carries a `DataProvenance` entry built by `lib/data/official/provenance.ts:buildProvenance`. Provenance records include dataset id, publisher, source IDs, last verified date, optional license, optional transformation notes, and the verification status. The `DataProvenanceBlock` component renders provenance verbatim — do not assemble provenance inline elsewhere.

## Don't

- Don't invent values, even "directional" ones, inside a dataset record.
- Don't link to a publisher URL that is not in `lib/data/sources/index.ts`.
- Don't call external APIs from page or component code.
- Don't replace transparent fallback copy with guessed values.
- Don't add a verification status of `verified` without an attached `provenance` and at least one registered source ID.
