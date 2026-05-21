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

## Add a city comparison

1. Append a new entry to [`lib/data/comparisons.ts`](../lib/data/comparisons.ts) with `cityASlug`, `cityBSlug`, `cityAName`, `cityBName`, `intent`, `region`, and `description`. Both city slugs must already exist in [`lib/data/cities.ts`](../lib/data/cities.ts).
2. Reuse the existing `ComparisonIntent` values (`relocation`, `remote_work`, `business`, `travel_planning`, `quality_of_life`, `regional_alternative`, `global_hub_comparison`). Do not invent new intents without updating the type.
3. Do not create reversed duplicate pairs (e.g. `london-vs-paris` and `paris-vs-london`).
4. The new comparison automatically appears in:
   - `/compare` directory (grouped by region)
   - sitemap
   - related-comparisons sections on the linked city profiles
5. The per-comparison page lives at `/compare/[comparison]` — no route changes needed. Category rows are derived from the underlying city and country profiles, so no per-comparison content needs to be authored.

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

### Latest expansion batch — 42 cities, 24 countries

42 cities and 24 countries added in a single batch using the new
`buildNeutralCitySeed` helper at the top of
[`lib/data/cities.ts`](../lib/data/cities.ts). The helper generates a
complete `CitySeed` from a small spec (slug, name, country slugs,
region, approximate metro population, hand-written intro/outlook, and
five directional scores). Module-level facts use neutral language and
explicitly mark verified records as `Pending integration` rather than
inventing pollutant, cost, safety, or connectivity values.

Cities added (region-grouped):

- **Europe**: Athens, Budapest, Bucharest, Belgrade, Zagreb, Ljubljana,
  Bratislava, Tallinn, Riga, Vilnius.
- **North America**: Boston, Washington DC, Miami, Austin, Dallas,
  Montreal, Calgary.
- **Latin America / Caribbean**: Medellín, San José (Costa Rica),
  Santo Domingo, Guatemala City.
- **Asia**: Guangzhou, Chengdu, Wuhan, Busan, Fukuoka, Chiang Mai,
  Phnom Penh, Colombo.
- **Middle East**: Muscat, Kuwait City, Manama, Amman.
- **Africa**: Tunis, Rabat, Dakar, Dar es Salaam, Kampala, Gaborone.
- **Oceania**: Adelaide, Canberra, Christchurch.

San Juan (Puerto Rico) was intentionally skipped to avoid extending
the country model into territory-specific framing in this batch.

Countries added: Greece, Hungary, Romania, Serbia, Croatia, Slovenia,
Slovakia, Estonia, Latvia, Lithuania, Costa Rica, Dominican Republic,
Guatemala, Cambodia, Sri Lanka, Oman, Kuwait, Bahrain, Jordan, Tunisia,
Senegal, Tanzania, Uganda, Botswana.

Existing country `citySlugs` arrays were updated for: United States
(added Boston, Washington DC, Miami, Austin, Dallas), Canada (Montreal,
Calgary), Australia (Adelaide, Canberra), China (Guangzhou, Chengdu,
Wuhan), South Korea (Busan), Japan (Fukuoka), Thailand (Chiang Mai),
Morocco (Rabat), Colombia (Medellín), New Zealand (Christchurch).

No verified emergency, healthcare, transport, or country-indicator
records were added for the newly added countries — they intentionally
render the transparent fallback until each field can be attributed to
an official publisher. The static page count grew from 712 to 1,030
(42 city pages + 252 module pages + 24 country pages + the existing
712 baseline).

## 2026-05-21 batch: 50 cities, 5 countries, full verified media

Cities added (50):

- **Europe (15)**: Porto, Valencia, Seville, Bilbao, Bologna,
  Florence, Naples, Kraków, Gdańsk, Wrocław, Antwerp, Rotterdam,
  Utrecht, Geneva, Basel.
- **North America (7)**: Philadelphia, Atlanta, Denver, Phoenix,
  San Diego, Portland, Ottawa.
- **Latin America (6)**: Curitiba, Brasília, Monterrey, Guadalajara,
  Valparaíso, Córdoba.
- **Asia (9)**: Nagoya, Sapporo, Daegu, Incheon, Kaohsiung, Cebu,
  Da Nang, Lahore, Karachi.
- **Middle East (4)**: Jeddah, Medina, Sharjah, Beirut.
- **Africa (6)**: Alexandria, Marrakesh, Durban, Windhoek, Lusaka,
  Maputo.
- **Oceania (3)**: Hobart, Gold Coast, Dunedin.

Quebec City, Recife, Puebla, Yokohama, Kobe, Tainan, Fes, and Pretoria
were intentionally trimmed from the suggested batch to stay within the
50-city cap while preserving geographic balance. Porto Alegre was
trimmed after build to keep the cap exact at 50.

Countries added (5): **Lebanon, Pakistan, Namibia, Zambia,
Mozambique**. Pakistan was added because Lahore and Karachi belong to
it and the country registry did not yet include it; the other four
match the cities Beirut, Windhoek, Lusaka, and Maputo. Each new
country uses the existing directional country profile and the
transparent fallback for verified emergency / healthcare / transport
layers — no fake official metrics were introduced.

Existing country `citySlugs` arrays were extended in lockstep with the
new cities for: United States, Canada, Australia, Japan, South Korea,
Spain, Italy, Portugal, Netherlands, Switzerland, Belgium, Poland,
Brazil, Mexico, Chile, Argentina, Taiwan, Philippines, Vietnam,
United Arab Emirates, Saudi Arabia, Egypt, Morocco, South Africa,
New Zealand.

Verified Wikimedia Commons hero images were added for **all 50 new
cities and all 5 new countries** via the existing
`scripts/verify-missing-places.py` and `scripts/verify-landmark-fallback.py`
pipelines. The landmark fallback covered Valparaíso, Cebu, Ottawa,
Daegu, Naples, Zambia, and Mozambique where the place's primary
Wikidata `P18` was a montage, location map, or a record with a
non-clean author field. `SLUG_OVERRIDES` was extended in the verifier
to disambiguate names like Phoenix, Portland, Valencia, Cordoba, and
others that share their plain name with other articles.

The static page count grew from 1,079 to 1,434 (50 city pages + 300
module pages [50 × 6 modules] + 5 country pages = +355 pages on the
existing 1,079 baseline). `npm run validate:media` reports 171 / 171
city hero coverage and 84 / 84 country hero coverage after this batch.

## 2026-05-21 batch: arrival planning cluster — second wave

The first arrival batch added 41 curated `/arrival/[city]` static
pages. This second wave adds **41 more** through `lib/data/arrival.ts`
only — no new images, no new cities, no new countries, no new route
files. Arrival pages 41 → 82.

Second-batch cities (41):

- **Europe (20)**: Valencia, Seville, Bilbao, Bologna, Florence,
  Naples, Kraków, Gdańsk, Wrocław, Antwerp, Rotterdam, Utrecht,
  Geneva, Basel, Athens, Budapest, Prague, Warsaw, Helsinki, Oslo.
- **United States (6)**: Philadelphia, Atlanta, Phoenix, San Diego,
  Portland, Dallas.
- **Canada / Commonwealth (7)**: Calgary, Gold Coast, Hobart,
  Adelaide, Canberra, Christchurch, Dunedin.
- **Asia / global hubs (8)**: Osaka, Fukuoka, Busan, Incheon,
  Kaohsiung, Da Nang, Kuala Lumpur, Bangkok.

Skipped from the suggested batch:

- **Already covered in batch 1**: Porto, Denver.
- **Not in city registry**: Nashville, Charlotte, Quebec City.

Safety rules continue to apply to every arrival record:

- No airport names, no IATA codes, no terminals, no transfer routes,
  no fares, no schedules, no travel times.
- No fabricated transport operator names or emergency contacts.
- No visa, immigration, legal, or medical advice — every record
  includes only neutral arrival planning context that defers
  time-sensitive details to official sources via the existing
  transport, public-safety, and healthcare layers.

The static page count grew from 1,434 (post-50-city expansion) to
1,475 (post-first-arrival-batch) to **1,516** after this second
arrival wave (+41).
