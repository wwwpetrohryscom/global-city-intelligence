# Global City Intelligence Platform

A scalable, server-rendered programmatic SEO platform for city intelligence data.
The app compares cities, countries, modules, and rankings with indexable HTML,
visible source context, metadata, sitemap generation, and typed mock data ready
for API-backed ingestion.

## Features
- City intelligence profiles
- Country cluster pages
- Cost of living, air quality, and energy module pages
- City ranking pages
- Server-rendered tables, source blocks, breadcrumbs, and JSON-LD
- Dynamic sitemap and permissive robots configuration

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Server Components

## Data Sources
- UN-Habitat
- WHO
- NASA
- EEA
- EPA
- IPCC

## Methodology
See /methodology page in the app.

## Local Development

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Architecture

```text
app/
  (marketing)/
  (entities)/
  (modules)/
  (rankings)/
components/
lib/
  data/
  seo/
types/
styles/
```

## License
See LICENSE file.
