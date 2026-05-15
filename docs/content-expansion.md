# Content expansion

This platform is built so that adding cities, countries, and verified
sources flows through a small number of typed registries. New entries
automatically appear across the directory pages, sitemap, internal links,
and metadata system without manual route wiring.

## Add a country

1. Append a new `Country` record to [`lib/data/countries.ts`](../lib/data/countries.ts).
2. Use existing `DataSource` ids from [`lib/data/sources/index.ts`](../lib/data/sources/index.ts), or extend that registry with official sources first (see "Add a verified source").
3. The new country automatically appears in:
   - `/countries` directory
   - sitemap
   - footer columns
   - country breadcrumbs
4. Per-country dynamic page lives at `/countries/[country]` — no route changes needed.

## Add a city

1. Append a new `City` record to [`lib/data/cities.ts`](../lib/data/cities.ts).
2. Reference an existing `countrySlug` so the city groups under the right country.
3. The new city automatically appears in:
   - `/cities` directory
   - country profile page (linked cities section)
   - sitemap
   - footer columns
   - city breadcrumbs

## Add a verified emergency, healthcare, or transport profile

Each verified layer lives in its own typed registry:

- Emergency: [`lib/data/emergency.ts`](../lib/data/emergency.ts)
- Healthcare: [`lib/data/healthcare.ts`](../lib/data/healthcare.ts) and [`lib/data/hospitals.ts`](../lib/data/hospitals.ts)
- Transport: [`lib/data/transport.ts`](../lib/data/transport.ts) and [`lib/data/mobility.ts`](../lib/data/mobility.ts)

Add a new profile only when every field cited can be attributed to an
official publisher already present in [`lib/data/sources/index.ts`](../lib/data/sources/index.ts).
Profiles include a `verificationStatus` field — set it to `"verified"`
only when every cited field has an official source.

## Add a verified source

1. Append a new entry to [`lib/data/sources/index.ts`](../lib/data/sources/index.ts) with `id`, `name`, `organization`, `url`, `description`, and `reliabilityNote`.
2. Use only official government, public-health, emergency-service, or
   transport publishers. Do not add blog, listicle, or directory sources.
3. Reference the new `id` from profile records as needed.

## Sitemap and metadata

The sitemap automation in [`app/sitemap.ts`](../app/sitemap.ts) and the
indexable-route registry in [`lib/seo/routes.ts`](../lib/seo/routes.ts)
iterate over the data registries. Adding a city or country automatically
updates the sitemap and crawl frontier; you do not need to edit those
files for content additions.

Metadata is generated per-page via [`lib/seo/metadata.ts`](../lib/seo/metadata.ts).
Bumping `LAST_UPDATED` in [`lib/data/constants.ts`](../lib/data/constants.ts)
propagates a fresh `dateModified` across all profile-driven JSON-LD.

## Rules

- **Never invent official data.** No invented hospitals, emergency
  numbers, transport authorities, addresses, phone numbers, statistics,
  fares, schedules, or service-status claims.
- **Cite official publishers only.** Government, public health,
  emergency-service, transport ministry, national operator, or
  recognised statistical-agency sources.
- **Use the fallback when data is missing.** Components render a
  transparent disclaimer rather than guessed values.
- **Keep content server-rendered.** All directory and profile content
  must be present in the initial HTML so it remains crawlable and
  accessible without client JavaScript.

## Recent expansion batches

### 2026-05-15 — global cities batch

29 cities and 16 countries added. Verified emergency, healthcare, and
transport profiles for new countries are intentionally left in the
fallback state until each field can be attributed to an official
publisher; pages render the transparent disclaimer rather than guessed
values.

Cities added: Stockholm, Oslo, Helsinki, Brussels, Munich, Hamburg,
Dublin, Edinburgh, Osaka, Kyoto, Beijing, Shenzhen, Ho Chi Minh City,
Hanoi, Delhi, Bangalore, Riyadh, Tel Aviv, Istanbul, Casablanca, Accra,
Cairo, Addis Ababa, Rio de Janeiro, Montevideo, Quito, Panama City,
Perth, Wellington.

Countries added: Sweden, Norway, Finland, Belgium, Ireland, Vietnam,
Saudi Arabia, Israel, Turkey, Morocco, Ghana, Egypt, Ethiopia, Uruguay,
Ecuador, Panama. Existing country `citySlugs` arrays were updated for
Germany (added Munich, Hamburg), United Kingdom (Edinburgh), Japan
(Osaka, Kyoto), China (Beijing, Shenzhen), India (Delhi, Bangalore),
Brazil (Rio de Janeiro), Australia (Perth), and New Zealand
(Wellington).

All new entries cite existing source ids from
[`lib/data/sources/index.ts`](../lib/data/sources/index.ts); no source
URLs were invented. Structured indicators on city pages are directional
and intended for orientation, consistent with the rest of the platform.
