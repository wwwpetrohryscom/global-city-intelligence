# Global City Intelligence Platform

A scalable, server-rendered programmatic SEO platform for city and country
intelligence. The app compares cities, countries, modules, and rankings with
indexable HTML, visible source attribution, automated metadata, sitemap
generation, and verified intelligence layers for emergency, healthcare, and
transport — each attributed to official publishers.

## Features
- City intelligence profiles (cost of living, air quality, energy, safety,
  internet speed, climate risk)
- Country profiles with national context and verified-layer indicators
- /cities and /countries directory pages
- City ranking pages
- Verified Emergency & Public Safety, Healthcare & Hospitals, and Transport &
  Mobility intelligence layers with transparent fallbacks
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
