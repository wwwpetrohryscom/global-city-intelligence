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

## 2026-05-22 batch: 61 cities, 1 country, full verified media

Batch 3 expands the directory with 61 new cities and 1 new country
(Luxembourg). Every city uses the existing `buildNeutralCitySeed`
helper from `lib/data/cities.ts` with hand-written neutral intro and
outlook copy plus a directional score profile; module data is
generated by the helper and rendered as a directional indicator with
the existing transparent fallback for verified emergency, healthcare,
transport, and city-indicator layers. No fake official metrics,
emergency contacts, healthcare records, transport authorities,
airport names, IATA codes, transfer routes, fares, schedules, or
country indicators were introduced.

Cities added (61), region-grouped:

- **UK / Ireland (9)**: Manchester, Birmingham, Bristol, Leeds,
  Glasgow, Belfast, Cardiff, Cork, Galway.
- **France (6)**: Lyon, Marseille, Toulouse, Nice, Bordeaux,
  Strasbourg.
- **Germany (6)**: Frankfurt, Cologne, Stuttgart, Düsseldorf,
  Leipzig, Dresden.
- **Spain (3)**: Malaga, Zaragoza, Granada.
- **Italy (4)**: Turin, Genoa, Palermo, Verona.
- **Netherlands / Belgium / Luxembourg (4)**: The Hague, Eindhoven,
  Ghent, Luxembourg City.
- **Nordics (4)**: Aarhus, Malmö, Gothenburg, Tampere.
- **Central / Eastern Europe (5)**: Brno, Łódź, Poznań, Cluj-Napoca,
  Split.
- **United States (12)**: Nashville, Charlotte, Minneapolis, Salt
  Lake City, Raleigh, Tampa, Orlando, Pittsburgh, Houston, Las Vegas,
  Madison, Boulder.
- **Canada (4)**: Quebec City, Edmonton, Winnipeg, Halifax.
- **Australia (3)**: Newcastle, Darwin, Cairns.
- **New Zealand (1)**: Tauranga.

Countries added (1): **Luxembourg**. Existing country `citySlugs`
arrays were extended in lockstep with the new cities for: United
Kingdom, Ireland, France, Germany, Spain, Italy, Netherlands,
Belgium, Denmark, Sweden, Finland, Czechia, Poland, Romania, Croatia,
United States, Canada, Australia, New Zealand. The new Luxembourg
country uses the existing directional country profile and the
transparent fallback for verified emergency / healthcare / transport
layers — no fake official metrics were introduced.

Duplicates skipped (already in the registry from earlier batches):
Munich, Hamburg, Bratislava, Zagreb, Ljubljana, Dallas, Bengaluru
(present as `bangalore`), Taipei, Kyoto, Ho Chi Minh City, Hanoi,
Manila, Doha, Abu Dhabi, Muscat, Amman, Tunis, Rabat, Accra, Dakar,
Lagos, Nairobi, Johannesburg.

Trimmed candidates (held for a future batch to keep this batch within
the 60–80 cap and preserve geographic balance): Düsseldorf-adjacent
mid-size cities (Hanover, Nuremberg); Spanish / Portuguese mid-size
cities (Alicante, Coimbra, Braga, Faro); Italian smaller cities
(Pisa, Siena, Bari, Catania); Benelux smaller cities (Bruges, Leuven);
Nordic / Baltic smaller cities (Turku, Tartu, Klaipeda); CEE smaller
cities (Ostrava, Kosice, Katowice, Lublin, Timisoara); additional
US metros (Columbus, Indianapolis, Detroit, Baltimore, St. Louis,
Kansas City, San Antonio, Sacramento, Ann Arbor); additional Canadian
metros (Victoria, Saskatoon, Regina, Waterloo, Kingston); additional
Australian metros (Wollongong, Geelong, Townsville); additional NZ
metros (Hamilton, Queenstown, Napier); the South Africa / India /
Malaysia priority groups; and the global-diversity tail (Tainan,
Yokohama, Kobe, Nara, Chiang Rai, Phuket). These were held back
rather than added without verified neutral framing.

San Jose (California) was also intentionally skipped because the
existing `san-jose` slug already routes to San José, Costa Rica;
admitting a same-name US city would require a slug-disambiguation
strategy that is out of scope for this batch.

Verified Wikimedia Commons hero images were added for **all 61 new
cities and the 1 new country** via the existing
`scripts/verify-missing-places.py` and
`scripts/verify-landmark-fallback.py` pipelines, then merged into the
TypeScript catalogs with `scripts/build-place-images.py`. The
landmark fallback was extended to cover Aarhus, Leeds, Turin, The
Hague, Tampa, and Houston whose primary Wikidata `P18` claims were a
montage, dictionary cover, or a record whose license did not meet
the existing permissive-license requirements (CC0 / Public domain /
CC BY / CC BY-SA). `SLUG_OVERRIDES` in `verify-place-images.py` was
extended to disambiguate single-word and place-name-collision slugs
including Nice, Frankfurt, Cologne, Düsseldorf, The Hague, Luxembourg
City, Malmö, Łódź, Poznań, Split, Granada, Quebec City, Halifax,
Newcastle, Darwin, Nashville, Charlotte, Raleigh, Tampa, Orlando,
Madison, Boulder, and Cork. Every image record cites an existing
permissive Creative Commons or public-domain license, real Wikimedia
Commons source URL, and attributed author — nothing is invented.

After this batch:

- city count: 171 → 232 (+61)
- country count: 84 → 85 (+1)
- city hero coverage: 232 / 232 (100%)
- country hero coverage: 85 / 85 (100%)

The static page count grows proportionally because each new city
adds one city profile page plus six module pages (6 × 61 = 366), each
new country adds one country hub page, and the directory pages
(`/cities`, `/countries`, `/arrival`, footer) update automatically
through the existing sitemap and `getAllIndexableRoutes()` registry.
No new route files, schema types, client components, runtime fetches,
external API calls, map / chart / carousel dependencies were
introduced. Arrival pages were not changed in this batch — the new
cities are candidates for a future arrival expansion.

## 2026-05-23 batch: arrival planning cluster — priority third wave

The second arrival wave brought the curated `/arrival/[city]` set
from 41 to 82. This third wave adds **21 more** priority arrival
pages through `lib/data/arrival.ts` only — no new images, no new
cities, no new countries, no new routes, no new schema types, and no
new source ids. A new `BATCH_3_UPDATED_DATE = "2026-05-23"` constant
was introduced so the freshness of the new records is traceable
without disturbing the `updatedDate` on earlier batches. Arrival
pages 82 → 103.

Third-batch cities (21):

- **United Kingdom (6)**: Manchester, Birmingham, Bristol, Glasgow,
  Belfast, Cardiff.
- **France (2)**: Lyon, Marseille.
- **Germany (2)**: Frankfurt, Cologne.
- **United States (7)**: Nashville, Charlotte, Minneapolis, Salt
  Lake City, Raleigh, Tampa, Orlando.
- **Canada (4)**: Quebec City, Edmonton, Winnipeg, Halifax.

Arrival-focus assignments follow the existing `ArrivalFocus` enum:
`rail_arrival` for Manchester, Birmingham, Lyon, and Cologne;
`business_travel` for Frankfurt, Charlotte, and Minneapolis;
`remote_work_arrival` for Raleigh; `general_arrival` for the rest.
`sourceIds` reuse existing registry entries — `eea-air` (Europe),
`epa-naaqs` (United States), `canada-emergency` (Canada), and
`itu-connectivity` where the focus is rail / business / remote-work
relocation. No new source ids were introduced.

Safety rules continue to apply to every arrival record:

- No airport names, no IATA codes, no terminals, no transfer routes,
  no fares, no schedules, no travel times, no transport operator
  names, no taxi prices, no airport emergency contacts.
- No fastest-route, cheapest-route, or guaranteed-travel-time claims.
- No visa, immigration, legal, or medical advice — every record
  includes only neutral arrival planning context that defers
  time-sensitive details to official sources via the existing
  transport, public-safety, and healthcare layers.

After this batch:

- arrival page count: 82 → 103 (+21)
- static page count: 1,945 → 1,966 (+21)
- `/arrival` directory ItemList: 82 → 103 items (still
  `ItemListUnordered`)
- sitemap `/arrival/[city]` entries: 82 → 103 (priority 0.74, monthly)

City reverse-link cards (`hasArrivalPage(city.slug)`) automatically
appear on the 21 newly covered city profile pages with no manual
wiring. No client components, no runtime fetches, no external API
calls, and no new dependencies were introduced.

## 2026-05-23 batch: curated comparisons for batch-two cities

This batch adds **35 curated `/compare/[comparison]` pages** that pair
cities introduced in the second city-expansion wave with each other
and with established peers. Records were added only to
`lib/data/comparisons.ts` (the existing `ComparisonSeed` shape) — no
new fields, no new schema types, no new routes, no new images, no new
cities, no new countries, and no new source ids were introduced. All
new records reuse `LAST_UPDATED` (`2026-05-16`), `DATA_YEAR`
(`2025`), and the existing `sourceIds` quartet (`un-habitat`,
`who-air`, `nasa-power`, `ipcc-urban`).

Pairs added (35):

- **UK / Ireland (8)**: manchester-vs-birmingham, manchester-vs-leeds,
  manchester-vs-glasgow, birmingham-vs-bristol, glasgow-vs-edinburgh,
  cardiff-vs-bristol, belfast-vs-dublin, cork-vs-galway.
- **France / Germany (8)**: lyon-vs-marseille, lyon-vs-toulouse,
  lyon-vs-bordeaux, marseille-vs-nice, frankfurt-vs-cologne,
  frankfurt-vs-dusseldorf, cologne-vs-dusseldorf, leipzig-vs-dresden.
- **Spain / Italy (7)**: malaga-vs-valencia, zaragoza-vs-valencia,
  granada-vs-seville, turin-vs-milan, genoa-vs-turin,
  palermo-vs-naples, verona-vs-bologna.
- **Netherlands / Belgium / Luxembourg (4)**: the-hague-vs-rotterdam,
  eindhoven-vs-utrecht, ghent-vs-antwerp, luxembourg-city-vs-brussels.
- **Nordics / Central Europe (8)**: aarhus-vs-copenhagen,
  malmo-vs-gothenburg, gothenburg-vs-stockholm, tampere-vs-helsinki,
  brno-vs-prague, lodz-vs-warsaw, poznan-vs-wroclaw, split-vs-zagreb.

Intent assignments use the existing `ComparisonIntent` union:
`regional_alternative` is the dominant pattern (intra-country and
neighbouring-metro pairs), with `business` for
`frankfurt-vs-dusseldorf` and `luxembourg-city-vs-brussels`,
`remote_work` for `malaga-vs-valencia`, and `relocation` for
`belfast-vs-dublin`. All 35 records use `region: "Europe"` —
no batch-two pair crosses regions.

Skipped candidates (cities not present in `lib/data/cities.ts` after
batch two, so the pair is deferred rather than fabricated): braga,
coimbra, alicante, bruges, turku, tartu, klaipeda, cluj-napoca (the
city slug exists but `cluj-napoca-vs-bucharest` was reserved for a
later iteration to keep this batch focused on the 35-pair target).

Safety rules applied to every comparison record:

- No winner, "better than", "best city", "safest", "cheapest", or
  "official ranking" wording.
- No invented scores, no fabricated rents / salaries / crime rates,
  no hospital names, no emergency numbers, no transport operators,
  no airport information, no travel times, no visa rules, no legal
  or medical advice.
- Summaries stay neutral and directional, deferring to the existing
  city / country / healthcare / transport / public-safety layers and
  to methodology and data-sources pages.

After this batch:

- comparison record count: 67 → 102 (+35)
- static page count: 1,966 → 2,001 (+35)
- sitemap `/compare/[comparison]` entries: 67 → 102
  (priority 0.85, weekly — unchanged formula)
- `/compare` index automatically lists the new pairs via
  `getAllComparisons()`
- related-comparison rails on the affected city pages surface the
  new pairs via the existing `getComparisonsForCity()` helper

No new schema types were introduced. The `/compare/[comparison]`
template continues to emit `WebPage`, `BreadcrumbList`, and `Dataset`
JSON-LD only. No new OG image logic was added — comparison pages
inherit the existing `createMetadata` behaviour. No client
components, no runtime fetches, no external API calls, and no new
dependencies were introduced.

## 2026-05-23 batch: city and country expansion batch three

This batch adds **66 new cities** and **1 new country** (Bulgaria) by
appending `buildNeutralCitySeed` calls to `lib/data/cities.ts` and a
new country record to `lib/data/countries.ts`. Existing-country
`citySlugs` arrays are updated so the new cities surface on the
matching country hubs. No new routes, no new schema types, no new
score formulas, and no new source ids were introduced. Image
catalogs were re-verified end-to-end through the existing pipeline:

```
scripts/verify-place-images.py        # P18 hero pass
scripts/verify-landmark-fallback.py   # landmark fallback for places
                                      # where P18 is a montage/flag
scripts/build-place-images.py         # final TS catalogs
```

### Cities added (66)

- **United Kingdom (5)**: Oxford, Cambridge, Liverpool, Sheffield,
  Brighton.
- **France (5)**: Montpellier, Rennes, Grenoble, Dijon,
  Aix-en-Provence.
- **Germany (7)**: Hanover, Nuremberg, Bremen, Bonn, Freiburg,
  Heidelberg, Dortmund.
- **Spain (3)**: Alicante, Murcia, Valladolid.
- **Portugal (2)**: Braga, Coimbra.
- **Italy (5)**: Pisa, Bari, Catania, Padua, Bergamo.
- **Netherlands (2)**: Groningen, Maastricht.
- **Belgium (2)**: Bruges, Leuven.
- **Denmark (1)**: Odense.
- **Sweden (2)**: Uppsala, Lund.
- **Finland (1)**: Turku.
- **Czechia (1)**: Ostrava.
- **Poland (1)**: Katowice.
- **Romania (1)**: Brașov.
- **Bulgaria (1)**: Plovdiv.
- **United States (12)**: Columbus, Indianapolis, Detroit, Baltimore,
  St. Louis, Kansas City, San Antonio, Sacramento, Milwaukee,
  Cincinnati, Cleveland, Memphis.
- **Canada (4)**: Victoria, Saskatoon, Waterloo (Ontario, slug
  `waterloo-ontario`), Kelowna.
- **Australia (3)**: Wollongong, Geelong, Sunshine Coast.
- **New Zealand (2)**: Queenstown, Napier.
- **South Africa (2)**: Pretoria, Stellenbosch.
- **India (4)**: Chennai, Hyderabad, Pune, Jaipur.

### Countries added (1)

- **Bulgaria** (`slug: bulgaria`, `iso2: BG`, `region: Southeastern
  Europe`) — required by the new Plovdiv city profile. Uses the
  existing `un-habitat`, `nasa-power`, `eea-air`, and `ipcc-urban`
  source ids; no new official layers (emergency / healthcare /
  transport) were added — Bulgaria-area pages render the transparent
  fallback until verified national profiles are integrated.

### Skipped candidates

- **San Jose, California** — slug `san-jose` is already owned by
  San José, Costa Rica. Slug-disambiguation for US San Jose was not
  introduced in this task; the city is deferred to a later batch.
- **London (Ontario), Kingston (Ontario), St. John's, Hamilton (NZ)**
  — ambiguous slugs that would collide with existing or future cities
  in other countries. `waterloo-ontario` was disambiguated explicitly;
  the rest are deferred to a later batch with the same approach.
- **Southampton, Aberdeen, Dundee, Limerick, Waterford** (UK / IE);
  **Rouen, Reims, Tours** (FR); **Münster, Karlsruhe, Essen** (DE);
  **Vigo, Santander, Faro, Aveiro** (ES / PT); **Siena, Trieste,
  Parma, Lecce** (IT); **Namur, Liege, Tilburg, Breda** (BE / NL);
  **Oulu, Aalborg, Tartu, Klaipėda** (Nordics / Baltics);
  **Kosice, Lublin, Timisoara, Oradea, Varna, Novi Sad** (CEE);
  **Ann Arbor, New Orleans, Louisville, Oklahoma City, Omaha, Boise,
  Tucson** (US); **Regina, London Ontario, St. John's** (CA);
  **Townsville, Toowoomba, Ballarat, Bendigo, Launceston** (AU);
  **Hamilton, Palmerston North, Nelson** (NZ); **Port Elizabeth,
  Bloemfontein** (ZA); **Ahmedabad, Kochi, Chandigarh, Surat,
  Lucknow, Coimbatore** (IN); **George Town, Johor Bahru, Kuching,
  Kota Kinabalu, Ipoh, Malacca** (MY) — trimmed to keep the batch
  inside the 60-80 cap. Candidates remain available for batch four.
- **Global-diversity bonus list** (Yokohama, Kobe, Nara, Tainan,
  Chiang Rai, Phuket) — deferred to keep the batch tightly focused
  on the stated EU / US / Commonwealth priorities.

### Image verification

The pipeline ran in three passes:

1. `verify-place-images.py` resolved 232 + 66 = 298 cities and 85 + 1
   = 86 countries against Wikipedia → Wikidata P18 → Wikimedia
   Commons. New `SLUG_OVERRIDES` entries were added for ambiguous
   names (Columbus → "Columbus, Ohio", Waterloo (Ontario), Memphis →
   "Memphis, Tennessee", Stellenbosch, etc.) so the resolver picks
   the intended city.
2. `verify-landmark-fallback.py` filled in places where Wikidata P18
   points to a montage / flag / dictionary cover that the catalog
   rejects as unsuitable. This recovered hero images for several
   existing cities whose P18 was updated upstream since the previous
   verifier run.
3. `build-place-images.py` produced the final
   `lib/data/media/city-images.ts` and `country-images.ts` catalogs.

**Coverage after this batch:**

- **Existing cities**: 232 / 232 retain their hero image — no
  regression. Existing-city hero records were either re-verified
  unchanged or recovered through the landmark fallback.
- **New cities with verified hero image**: 54 / 66.
- **New cities rendering the existing `ImageFallback` block**: 12 —
  Aix-en-Provence, Columbus, Detroit, Hyderabad, Jaipur, Liverpool,
  Montpellier, Napier, San Antonio, Saskatoon, Victoria, Wollongong.
  The upstream Wikidata P18 for each is a "City Montage" /
  "PhotoMontage" composite or another file the catalog rejects as
  unsuitable, and no curated landmark fallback is on file for them
  yet. These pages remain fully functional; the page renders the
  designed fallback component as documented in
  `docs/image-sourcing.md`. (Columbus and Montpellier were initially
  let through because the early-batch-three filter only matched
  `_montage` — the audit pass tightened `BAD_FILE_TOKENS` in
  `scripts/build-place-images.py` to also reject leading-`Montage_`
  and `PhotoMontage` composites.)
- **Bulgaria country hero**: verified (`Raggatt2000 / CC BY-SA 3.0`).

Every new hero record carries `source`, `sourceUrl`, `author`,
`license`, `licenseUrl`, `attributionText`, `verified: true`, and
`verifiedAt` — no fields were invented, no images were hand-picked,
no licenses were widened. Only `CC0`, `Public domain`, `CC BY`, and
`CC BY-SA` files were accepted; `NC` / `ND` / `GFDL` / `FAL` /
ambiguous-license / unknown-author files are rejected by the
pipeline.

### Safety rules applied

- No invented official metrics: population is the only quantitative
  field on a new city and uses the existing `~N metro` framing
  (directional approximation, not an official measurement).
- No invented scores: directional `overall / affordability /
  airQuality / energy / resilience` scores follow the existing
  batch-two range (60-78 for European peers, 65-75 for North-American
  peers, 60-70 for emerging-market peers). Every score is a planning
  signal, not an official ranking.
- No invented rents, salaries, crime rates, hospital names, emergency
  numbers, transport operators, airports, IATA codes, fares,
  schedules, travel times, visa rules, or legal/medical advice.
- Every new intro and outlook is unique, neutral, and written in the
  existing voice — no winner / best / cheapest / safest /
  official-ranking wording.

### Page-count delta

- **City count**: 232 → **298** (+66).
- **Country count**: 85 → **86** (+1 — Bulgaria).
- **Static page count**: 2,001 → **2,464** (+463 = 66 city profiles +
  66 × 6 module pages + 1 country hub). Verified by `next build`:
  `Generating static pages (2464/2464)`.
- **Sitemap entries**: `/cities/[city]`, `/countries/[country]`, and
  six `/{module}/[city]` routes are emitted automatically through
  the existing `app/sitemap.ts` iteration over `getCities()`,
  `getCountries()`, and the module-x-city Cartesian product.
- **`/cities` and `/countries` directories**: automatically include
  the new entries via `getCities()` / `getCountries()` iteration.
- **`/compare`, `/arrival`, `/collections`, `/city-intents`**: not
  affected — no comparison, arrival, collection, or intent records
  were added in this batch.

### Verification results

- `npm run validate:media` — **pass** (286 city hero / 86 country hero
  records, all license + author + attribution fields valid).
- `npm run typecheck` — clean.
- `npm run lint` — clean.
- `npm run build` — succeeded, 2,464 / 2,464 static pages generated.
- `npm run validate:data` / `npm run validate:country-indicators` —
  these scripts are not defined in `package.json` (only
  `validate:media` exists).

## 2026-05-23 batch: arrival planning cluster — fourth wave

This batch adds **30 curated `/arrival/[city]` pages** for priority
cities introduced in the batch-three expansion (plus Johannesburg and
Pretoria, where Johannesburg pre-existed). Records were added only
to `lib/data/arrival.ts` — no new images, no new cities, no new
countries, no new routes, no new schema types, and no new source ids
were introduced. A new `BATCH_4_UPDATED_DATE = "2026-05-23"`
constant was added so the freshness of the new records is traceable
without disturbing the `updatedDate` on earlier batches. Arrival
pages 103 → 133.

Fourth-batch cities (30):

- **United Kingdom (4)**: Oxford, Cambridge, Liverpool, Sheffield.
- **France (2)**: Montpellier, Rennes.
- **Germany (4)**: Hanover, Nuremberg, Bremen, Bonn.
- **Spain / Italy / Belgium / Sweden (5)**: Alicante, Pisa, Bari,
  Bruges, Uppsala.
- **United States (5)**: Columbus, Indianapolis, Detroit, Baltimore,
  San Antonio.
- **Canada / Australia / New Zealand (4)**: Victoria, Saskatoon,
  Wollongong, Queenstown.
- **India (4)**: Chennai, Hyderabad, Pune, Jaipur.
- **South Africa (2)**: Johannesburg, Pretoria.

Arrival-focus assignments follow the existing `ArrivalFocus` enum:

- `rail_arrival` for Oxford, Cambridge, Rennes, Hanover, Nuremberg,
  Bonn, Uppsala.
- `business_travel` for Columbus, Indianapolis, Detroit, Baltimore,
  Chennai, Hyderabad, Pune, Johannesburg, Pretoria.
- `general_arrival` for the rest.

`sourceIds` reuse existing registry entries — `eea-air` (Europe),
`epa-naaqs` (United States), `canada-emergency` (Canada),
`triple-zero-au` (Australia), `nz-police-111` (New Zealand),
`who-air` and `itu-connectivity` (India / South Africa). No new
source ids were introduced.

The 10 cities in this batch that use the existing `ImageFallback`
component (Liverpool, Montpellier, Columbus, Detroit, San Antonio,
Victoria, Saskatoon, Wollongong, Hyderabad, Jaipur) get arrival
pages on the same terms as verified-hero cities — fallback-image
status does not block arrival page creation. Arrival pages do not
emit a hero `ImageObject` schema, so this has no structured-data
effect.

Safety rules continue to apply to every arrival record:

- No airport names, no IATA codes, no terminals, no transfer routes,
  no fares, no schedules, no travel times, no transport operator
  names, no taxi prices, no airport emergency contacts.
- No fastest-route, cheapest-route, or guaranteed-travel-time claims.
- No visa, immigration, legal, or medical advice — every record
  includes only neutral arrival planning context that defers
  time-sensitive details to official sources via the existing
  transport, public-safety, and healthcare layers.

After this batch:

- arrival page count: 103 → 133 (+30)
- static page count: 2,464 → 2,494 (+30)
- `/arrival` directory ItemList: 103 → 133 items (still
  `ItemListUnordered`)
- sitemap `/arrival/[city]` entries: 103 → 133 (priority 0.74,
  monthly)

City reverse-link cards (`hasArrivalPage(city.slug)`) automatically
appear on the 30 newly covered city profile pages with no manual
wiring. No client components, no runtime fetches, no external API
calls, and no new dependencies were introduced.

## 2026-05-25 batch: neighborhood planning cluster — first wave

This batch adds a brand-new SEO cluster: **city neighborhood planning
pages** under `/cities/[city]/neighborhoods`. The pages are a
structured **research checklist** — not a real-estate listing service,
not a rental-price guide, not a neighborhood ranking page, not a
crime / safety ranking page, not a school ranking page, and not
legal, rental, immigration, financial, or medical advice. They do
not name neighborhoods, publish prices, crime rates, school
rankings, hospital proximities, transit operators, or walkability
scores.

### Geographic scope (strict)

First batch is restricted to the EU, UK / Ireland, United States,
Canada, Australia, and New Zealand. Cities in India, South Africa,
Malaysia, the Middle East, Africa, Latin America, broader Asia, and
global-diversity lists are out of scope for this batch — even where
those cities exist in the registry.

### Files created

- `types/neighborhoods.ts` — `NeighborhoodPlanningFocus`,
  `NeighborhoodChecklistCategory`, `NeighborhoodChecklistItem`, and
  `NeighborhoodPlanningPage` types
- `lib/data/neighborhoods.ts` — 60 curated `NeighborhoodPlanningPage`
  records and the shared 21-item research checklist
- `lib/data/queries/neighborhoods.ts` — `getAllNeighborhoodPlanningPages`,
  `getNeighborhoodPlanningPageByCitySlug`,
  `getNeighborhoodPlanningPagesForCountry`, `hasNeighborhoodPlanningPage`,
  `getNeighborhoodPlanningChecklist`
- `components/neighborhoods/NeighborhoodOverviewCards.tsx`
- `components/neighborhoods/NeighborhoodPlanningChecklist.tsx`
- `components/neighborhoods/NeighborhoodRelatedLinks.tsx`
- `app/(entities)/cities/[city]/neighborhoods/page.tsx`

### Files updated

- `types/index.ts` — re-exports the new types
- `lib/data/queries/index.ts` — re-exports the new query helpers and
  the `getNeighborhoodPlanningFocusLabel` helper
- `lib/seo/routes.ts` — adds `neighborhoodPlanningRoute(citySlug)` and
  includes the new pages in `getAllIndexableRoutes()`
- `lib/seo/breadcrumbs.ts` — adds `neighborhoodPlanningBreadcrumbs`
- `lib/seo/metadata.ts` — adds `generateNeighborhoodPlanningMetadata`
- `app/sitemap.ts` — emits all 60 new pages at `priority: 0.73`,
  `changeFrequency: "monthly"`
- `app/(entities)/cities/[city]/page.tsx` — adds a reverse-link
  `LinkCard` gated by `hasNeighborhoodPlanningPage(city.slug)`
- `docs/content-expansion.md` — this section

### Cities included (60)

- **United Kingdom / Ireland (10)**: London, Manchester, Birmingham,
  Bristol, Glasgow, Edinburgh, Oxford, Cambridge, Liverpool, Dublin.
- **France (5)**: Paris, Lyon, Marseille, Toulouse, Bordeaux.
- **Germany (8)**: Berlin, Hamburg, Munich, Frankfurt, Cologne,
  Düsseldorf, Stuttgart, Leipzig.
- **Netherlands / Belgium / Luxembourg (5)**: Amsterdam, Rotterdam,
  The Hague, Brussels, Luxembourg City.
- **Spain / Portugal / Italy (8)**: Madrid, Barcelona, Valencia,
  Lisbon, Porto, Rome, Milan, Florence.
- **Austria / Switzerland / Nordics (5)**: Vienna, Zürich, Stockholm,
  Copenhagen, Helsinki.
- **United States (12)**: New York, Los Angeles, Chicago, Boston,
  Washington DC, San Francisco, Seattle, Austin, Denver, Miami,
  Nashville, Philadelphia.
- **Canada (4)**: Toronto, Vancouver, Montréal, Ottawa.
- **Australia (3)**: Sydney, Melbourne, Brisbane.

### Trimmed from the candidate list

Trimmed to stay inside the 50-65 cap and to keep batch-one
EU / US / Commonwealth focused:

- UK / Ireland: Cardiff, Belfast, Cork, Galway.
- France: Nice, Montpellier, Rennes.
- Germany: Hanover, Nuremberg.
- Netherlands / Belgium: Utrecht, Eindhoven, Antwerp, Ghent, Bruges.
- Spain / Portugal / Italy: Seville, Bologna, Turin.
- US: Charlotte, Minneapolis, Tampa, Orlando, Atlanta, Phoenix,
  San Diego, Portland.
- Canada: Calgary, Edmonton, Quebec City, Halifax, Victoria.
- Australia / NZ: Perth, Adelaide, Auckland, Wellington,
  Christchurch, Queenstown.

Candidates remain available for a future wave.

### Skipped candidates

None of the candidate cities were missing from the registry. The
San Jose (California) slug-disambiguation issue does not apply here
because the candidate list excludes US San Jose.

### Planning focus assignments

`planningFocus` uses a typed `NeighborhoodPlanningFocus` enum
(`relocation_research`, `family_research`, `remote_work_research`,
`transport_access`, `arrival_shortlist`, `general_research`). The
distribution across the 60 pages: `general_research` 28,
`relocation_research` 22, `family_research` 5, `remote_work_research`
5. Used as editorial framing only — no rankings or claims attached.

### Safety rules applied

- No invented neighborhood names, district boundaries, rent or sale
  prices, crime rates, school rankings, hospital proximities,
  walkability scores, transit operators, commute times.
- No "best" / "safest" / "cheapest" / "dangerous" / "investment hot
  spot" wording — only as negative disclaimers on the page itself.
- No legal, rental, immigration, visa, financial, or medical advice.
- All copy is unique per page (60 unique summaries) and points back
  to existing city / country / transport / public-safety / healthcare
  / arrival / tools / methodology / data-sources layers.

### Structured data

`/cities/[city]/neighborhoods` pages emit only `WebPage` and
`BreadcrumbList` JSON-LD. No `HowTo`, `RealEstateListing`,
`Place`/neighborhood schema with invented boundaries, `LocalBusiness`,
`School`, `Review`, `Rating`, `Offer`, `FAQPage`, fake `Dataset`, or
`ImageObject` schemas were added.

### Metadata / OG

`generateNeighborhoodPlanningMetadata` produces unique
`title`, `description`, canonical, OG `title` / `description` /
`url`, and `lastModified` for each new page. OG image uses the
verified city hero only when `getCityHeroImage()` returns a verified
record; otherwise OG image is omitted entirely (no fallback image
emitted as OG). This matches the existing arrival-page contract.

### Sitemap

`app/sitemap.ts` automatically emits all 60 new pages via
`getAllNeighborhoodPlanningPages()`. Each entry includes `url`,
`lastModified`, `changeFrequency: "monthly"`, `priority: 0.73`.

### City reverse links

`hasNeighborhoodPlanningPage(city.slug)` (set-membership lookup,
deterministic, server-safe) gates a new `LinkCard` on the city
profile page. The 60 covered cities surface the card; the remaining
238 cities do not — no extra cards on uncovered cities, no duplicate
cards on covered cities.

### Page-count delta

- neighborhood planning pages: 0 → **60**
- static page count: 2,494 → **2,554** (+60). Verified by
  `next build`: `Generating static pages (2554/2554)`.

### Performance / runtime

- 0 client components, 0 `useEffect` / `useState`, 0 `fetch` / `axios`
  in any new or modified file
- 0 new dependencies; no map / chart / image / carousel libraries
- All 60 pages SSG; route bundle: 223 B / 106 kB First Load JS
- `validate:media`, `typecheck`, `lint`, `build` all clean

## 2026-05-25 batch: moving-to city planning cluster — first wave

This batch adds a second new SEO cluster: **"Moving to {City}" planning
pages** under `/cities/[city]/moving-to`. The pages are a structured
relocation **research checklist** — not immigration / visa advice, not
tax advice, not legal advice, not medical advice, not a rental-price
guide, not a property-buying guide, not an official relocation
service, and not a city ranking page. They do not publish visa rules,
tax rules, rental law, rent or sale prices, salary expectations,
exact cost estimates, crime rates, school rankings, hospital
proximities, transit operators, neighborhood names, or area "best" /
"safest" / "cheapest" claims.

### Geographic scope (strict)

First batch is restricted to the EU, UK / Ireland, United States,
Canada, Australia, and Switzerland (per spec "Austria / Switzerland /
Nordics"). The same 60 cities as the neighborhood-planning batch
were chosen to maximise internal-linking density: every moving-to
page links to its matching neighborhood page, and 50 of the 60 also
link to an existing arrival page. Cities in India, South Africa,
Malaysia, the Middle East, Africa, Latin America, broader Asia, and
global-diversity lists are out of scope for this batch.

### Files created

- `types/moving.ts` — `MovingFocus`, `MovingChecklistCategory`,
  `MovingChecklistItem`, and `MovingToCityPage` types
- `lib/data/moving.ts` — 60 curated `MovingToCityPage` records and
  the shared 26-item relocation research checklist
- `lib/data/queries/moving.ts` — `getAllMovingToCityPages`,
  `getMovingToCityPageByCitySlug`, `getMovingToCityPagesForCountry`,
  `hasMovingToCityPage`, `getMovingToCityChecklist`
- `components/moving/MovingOverviewCards.tsx`
- `components/moving/MovingChecklist.tsx`
- `components/moving/MovingRelatedLinks.tsx`
- `app/(entities)/cities/[city]/moving-to/page.tsx`

### Files updated

- `types/index.ts` — re-exports the new types
- `lib/data/queries/index.ts` — re-exports the new query helpers and
  the `getMovingFocusLabel` helper
- `lib/seo/routes.ts` — adds `movingToCityRoute(citySlug)` and
  includes the new pages in `getAllIndexableRoutes()`
- `lib/seo/breadcrumbs.ts` — adds `movingToCityBreadcrumbs`
- `lib/seo/metadata.ts` — adds `generateMovingToCityMetadata`
- `app/sitemap.ts` — emits all 60 new pages at `priority: 0.74`,
  `changeFrequency: "monthly"`
- `app/(entities)/cities/[city]/page.tsx` — reverse-link `LinkCard`
  gated by `hasMovingToCityPage(city.slug)`
- `app/(entities)/cities/[city]/neighborhoods/page.tsx` — adds a
  reverse link to the moving-to guide when present
- `app/(arrival)/arrival/[city]/page.tsx` — adds reverse links to
  both the neighborhood planning guide and the moving-to guide when
  present
- `docs/content-expansion.md` — this section

### Cities included (60)

Same 60 cities as the neighborhood-planning batch:

- **United Kingdom / Ireland (10)**: London, Manchester, Birmingham,
  Bristol, Glasgow, Edinburgh, Oxford, Cambridge, Liverpool, Dublin.
- **France (5)**: Paris, Lyon, Marseille, Toulouse, Bordeaux.
- **Germany (8)**: Berlin, Hamburg, Munich, Frankfurt, Cologne,
  Düsseldorf, Stuttgart, Leipzig.
- **Netherlands / Belgium / Luxembourg (5)**: Amsterdam, Rotterdam,
  The Hague, Brussels, Luxembourg City.
- **Spain / Portugal / Italy (8)**: Madrid, Barcelona, Valencia,
  Lisbon, Porto, Rome, Milan, Florence.
- **Austria / Switzerland / Nordics (5)**: Vienna, Zürich, Stockholm,
  Copenhagen, Helsinki.
- **United States (12)**: New York, Los Angeles, Chicago, Boston,
  Washington DC, San Francisco, Seattle, Austin, Denver, Miami,
  Nashville, Philadelphia.
- **Canada (4)**: Toronto, Vancouver, Montréal, Ottawa.
- **Australia (3)**: Sydney, Melbourne, Brisbane.

### Trimmed from the candidate list

Cities in the original candidate list that were trimmed to stay at
the 60-page target (deferred to a future wave): Cardiff, Belfast,
Nice, Montpellier, Rennes, Hanover, Nuremberg, Utrecht, Eindhoven,
Antwerp, Ghent, Bruges, Seville, Bologna, Turin, Pisa, Bari, Uppsala,
Charlotte, Minneapolis, Tampa, Orlando, Atlanta, Phoenix, San Diego,
Portland, Columbus, Indianapolis, Detroit, Baltimore, San Antonio,
Calgary, Edmonton, Quebec City, Halifax, Victoria, Saskatoon, Perth,
Adelaide, Auckland, Wellington, Christchurch, Queenstown, Wollongong.

### Skipped candidates

None — every selected slug exists in the registry.

### Moving focus assignments

`movingFocus` uses a typed `MovingFocus` enum
(`relocation_research`, `family_move`, `remote_work_move`,
`career_move`, `student_move`, `general_move`). Used as editorial
framing only — no rankings or claims attached. Distribution: see the
sealed enum values in `types/moving.ts`.

### Safety rules applied

- No invented visa rules, immigration steps, tax rules, legal
  requirements, rental law, rent / sale prices, salary expectations,
  exact cost estimates, crime rates, school rankings, hospital
  proximities, transit operators, neighborhood names, district
  boundaries, or property purchase / mortgage advice.
- No "best" / "cheapest" / "safest" / "guaranteed" / "investment hot
  spot" wording — only as negative disclaimers on the page itself.
- No legal, immigration, tax, financial, medical, or property advice.
- All copy is unique per page (60 unique summaries) and points back
  to existing city / country / neighborhood / arrival / transport /
  public-safety / healthcare / tools / methodology / data-sources
  layers.

### Structured data

`/cities/[city]/moving-to` pages emit only `WebPage` and
`BreadcrumbList` JSON-LD. No `HowTo`, `RealEstateListing`, `Place`,
`LocalBusiness`, `School`, `Review`, `Rating`, `Offer`, `FAQPage`,
fake `Dataset`, or `ImageObject` schemas were added.

### Metadata / OG

`generateMovingToCityMetadata` produces unique `title`,
`description`, canonical, OG `title` / `description` / `url`, and
`lastModified` for each new page. OG image uses the verified city
hero only when `getCityHeroImage()` returns a verified record;
otherwise OG image is omitted entirely (no fallback image emitted
as OG). This matches the existing arrival- and neighborhood-page
contract.

### Sitemap

`app/sitemap.ts` automatically emits all 60 new pages via
`getAllMovingToCityPages()`. Each entry includes `url`,
`lastModified`, `changeFrequency: "monthly"`, `priority: 0.74`
(slightly higher than neighborhoods because relocation pages serve
deeper user intent).

### Internal linking and reverse links

Each moving-to page links to: city profile, country hub,
`arrivalRoute(city.slug)` (when present), `neighborhoodPlanningRoute(city.slug)`
(present for all 60 in this batch), cost-of-living calculator,
travel-budget calculator, relocation checklist, `/cities`,
`/countries`, `/compare`, methodology, data sources, up to 4 related
comparisons via `getComparisonsForCity()`. No broad header/footer
additions (no `/moving-to` index yet).

Three reverse-link surfaces gated by `hasMovingToCityPage(city.slug)`:

- **City profile** — new `LinkCard` next to the existing arrival /
  neighborhood cards
- **Neighborhood planning guide** — new related-link entry
- **Arrival planning guide** — new related-link entry alongside a
  newly added neighborhood-planning reverse link

All three gates use set membership (Map-backed), so the cards appear
exactly once on covered cities and not at all on uncovered cities.

### Page-count delta

- moving-to pages: 0 → **60**
- static page count: 2,554 → **2,614** (+60). Verified by
  `next build`: `Generating static pages (2614/2614)`.

### Performance / runtime

- 0 client components, 0 `useEffect` / `useState`, 0 `fetch` / `axios`
  in any new or modified file
- 0 new dependencies; no map / chart / image / carousel libraries
- All 60 pages SSG; route bundle: 224 B / 106 kB First Load JS
- `validate:media`, `typecheck`, `lint`, `build` all clean

## 2026-05-25: /moving-to directory page

Adds a single central directory page for the moving-to SEO cluster
at `/moving-to`. Mirrors the existing `/arrival` directory pattern:
crawlable card grid for all 60 moving-to guides, country-grouped
index, `ItemList` JSON-LD, breadcrumbs, hub nav, related-tools rail.

### Files created

- `app/(moving)/moving-to/page.tsx` — server-rendered directory page

### Files updated

- `lib/seo/routes.ts` — adds `staticRoutes.movingTo = "/moving-to"`
  and includes it in `getAllIndexableRoutes()`
- `app/sitemap.ts` — emits the new directory URL at `priority: 0.75`,
  `changeFrequency: "monthly"`
- `components/layout/Footer.tsx` — adds a "Moving to city guides"
  link next to the existing "Arrival planning guides" entry in the
  Reference column
- `docs/content-expansion.md` — this section

### Page content

- H1 `Moving to City Planning Guides`, unique intro paragraph
- `Last updated` and `Data year` chips
- Sources / methodology disclaimer block (no visa, immigration, tax,
  legal, financial, medical, rental, or property advice)
- Card grid for all **60** moving-to guides, sorted alphabetically by
  city name. Each card shows: country tag, `Moving to {City}` link,
  `movingFocus` label, page summary, plus contextual links — city
  profile, country hub, neighborhood guide (when present), arrival
  guide (when present)
- Country-grouped index (alphabetical) with every guide also linked
  here for crawler density
- "Continue exploring" related-tools rail: cities, countries,
  compare, arrival, cost calc, travel-budget calc, relocation
  checklist, methodology, data sources

### Structured data

- `WebPage` JSON-LD for the directory itself
- `BreadcrumbList` JSON-LD via `staticBreadcrumbs("Moving to", "/moving-to")`
- `ItemList` JSON-LD with `numberOfItems: 60`, `itemListOrder: ItemListUnordered`,
  and absolute `url` for each moving-to guide

No `HowTo`, `RealEstateListing`, `Place`, `LocalBusiness`, `School`,
`Review`, `Rating`, `Offer`, `FAQPage`, fake `Dataset`, or
`ImageObject` schemas added.

### Image / thumbnail decision

**No images on `/moving-to`.** The 60-card grid already provides
dense navigation, and the per-guide pages carry the visual hero or
fallback. Skipping thumbnails keeps the directory fast and clean.
No `og:image` is emitted for the directory itself — `createMetadata`
omits OG image when no `image` is passed, matching the existing
behaviour for arrival / neighborhood / moving-to pages without
verified heroes.

### Footer / internal linking

Footer "Reference" column now reads:

```
City comparisons
Arrival planning guides
Moving to city guides       ← new
Tools and calculators
Cost of living calculator
Travel budget calculator
Relocation checklist
Methodology
Data sources
```

No broad city-by-city footer additions in this task.

### Page-count delta

- static page count: 2,614 → **2,615** (+1). Verified by `next build`:
  `Generating static pages (2615/2615)`.
- New route appears as `○ /moving-to` (Static) in the build manifest.

### Validation

- `npm run validate:media` — pass
- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — succeeded, 2615/2615 static pages
- 0 client components, 0 runtime fetch, 0 new dependencies

## 2026-05-25 batch: visual city guide cluster — first wave

This batch adds a new visual SEO cluster: **`/cities/[city]/visual-guide`**.
100 curated pages combine source-attributed verified Wikimedia
imagery from the existing media catalog with structured city
intelligence, arrival / neighborhood / moving-to planning links,
comparisons, and budgeting tools. The pages are **not** a tourist
attraction guide, travel blog, photo dump, official tourism page,
ranking page, or page with invented visual facts.

### Geographic scope (strict)

EU, UK / Ireland, US, Canada, Australia, New Zealand, and
Switzerland only. Cities in India, South Africa, Malaysia, the
Middle East, Africa, Latin America, broader Asia, and global-
diversity lists are out of scope for this batch.

### Files created

- `types/visual-guides.ts` — `VisualGuideFocus`,
  `VisualGuideSectionCategory`, `VisualGuideSection`, and
  `VisualCityGuidePage` types
- `lib/data/visual-guides.ts` — 100 curated records (seeded with a
  shared summary template) + a 5-item shared "How to read this city
  visually" section list
- `lib/data/queries/visual-guides.ts` — `getAllVisualCityGuidePages`,
  `getVisualCityGuidePageByCitySlug`,
  `getVisualCityGuidePagesForCountry`, `hasVisualCityGuidePage`,
  `getVisualGuideSections`
- `components/visual-guides/VisualGuideOverviewCards.tsx`
- `components/visual-guides/VisualGuideMediaSection.tsx`
- `components/visual-guides/VisualGuideRelatedLinks.tsx`
- `app/(entities)/cities/[city]/visual-guide/page.tsx`

### Files updated

- `types/index.ts` — re-exports new types
- `lib/data/queries/index.ts` — re-exports new query helpers and
  `getVisualGuideFocusLabel`
- `lib/seo/routes.ts` — adds `visualCityGuideRoute(citySlug)` and
  includes the new pages in `getAllIndexableRoutes()`
- `lib/seo/breadcrumbs.ts` — adds `visualCityGuideBreadcrumbs`
- `lib/seo/metadata.ts` — adds `generateVisualCityGuideMetadata`
- `app/sitemap.ts` — emits all 100 new pages at `priority: 0.72`,
  `changeFrequency: "monthly"`
- `app/(entities)/cities/[city]/page.tsx` — new `LinkCard` reverse
  link gated by `hasVisualCityGuidePage(city.slug)`
- `app/(arrival)/arrival/[city]/page.tsx` — new related-link entry
  to the visual guide when present
- `app/(entities)/cities/[city]/neighborhoods/page.tsx` — new
  related-link entry to the visual guide when present
- `app/(entities)/cities/[city]/moving-to/page.tsx` — new
  related-link entry to the visual guide when present

### Cities included (100)

A 100-city selection that fully covers the 60 baseline neighborhood
and moving-to cities (so the visual guide reverse-links into both
clusters for every page in those clusters) plus 40 additional major
metros from the allowed regions:

- **UK / Ireland (14)**: London, Manchester, Birmingham, Bristol,
  Glasgow, Edinburgh, Oxford, Cambridge, Liverpool, Dublin, Cardiff,
  Belfast, Leeds, Brighton.
- **France (8)**: Paris, Lyon, Marseille, Toulouse, Bordeaux, Nice,
  Strasbourg, Rennes.
- **Germany (9)**: Berlin, Hamburg, Munich, Frankfurt, Cologne,
  Düsseldorf, Stuttgart, Leipzig, Dresden.
- **Netherlands / Belgium / Luxembourg (8)**: Amsterdam, Rotterdam,
  The Hague, Utrecht, Brussels, Antwerp, Ghent, Luxembourg City.
- **Spain / Portugal / Italy (12)**: Madrid, Barcelona, Valencia,
  Seville, Málaga, Lisbon, Porto, Rome, Milan, Florence, Bologna,
  Turin.
- **Austria / Switzerland / Nordics (7)**: Vienna, Zürich,
  Stockholm, Gothenburg, Copenhagen, Aarhus, Helsinki.
- **Central / Eastern Europe (5)**: Prague, Warsaw, Kraków,
  Budapest, Athens.
- **United States (20)**: New York, Los Angeles, Chicago, Boston,
  Washington DC, San Francisco, Seattle, Austin, Denver, Miami,
  Nashville, Philadelphia, Atlanta, Phoenix, San Diego, Portland,
  Dallas, Houston, Pittsburgh, Salt Lake City.
- **Canada (8)**: Toronto, Vancouver, Montréal, Ottawa, Calgary,
  Edmonton, Québec City, Halifax.
- **Australia / New Zealand (9)**: Sydney, Melbourne, Brisbane,
  Perth, Adelaide, Canberra, Auckland, Wellington, Christchurch.

### Cities skipped

- **Lille** (recommended list) — slug not present in `lib/data/cities.ts`.
  Replaced with **Rennes** (existing slug with a verified hero
  image and an existing arrival page).
- **Montpellier**, **aix-en-provence**, **reims**, and other French
  candidates considered as the Lille replacement — Wikidata P18 is
  a montage / unsuitable, so they would render the fallback block.
  Rennes was chosen instead because it has a verified hero.

### Wikimedia / verified media usage

- Hero imagery rendered via the existing `PlaceHeroImage` component
  → `getCityHeroImage(slug)` → existing verified media catalog
- Optional secondary images rendered via the new
  `VisualGuideMediaSection` → `getPlaceSecondaryImages("city", slug)`
  → existing verified media catalog. The component caps at 3 images,
  lazy-loads every image (`loading="lazy"`, `decoding="async"`),
  emits explicit `width` / `height`, and renders the existing
  `ImageAttribution` component for each.
- **No new images added.** No random URLs, no AI-generated images,
  no unverified attribution, no fallback used as OG.

### Fallback-image city handling

- **99 / 100** cities have a verified hero record → `og:image` set
  via `ogImageFromPlaceImage(getCityHeroImage(city.slug))`
- **1 / 100** (Liverpool) renders the fallback `ImageFallback` block;
  `ogImageFromPlaceImage` returns `undefined`, so `createMetadata`
  omits `openGraph.images` and `twitter.images` entirely
- No `ImageObject` schema emitted for the fallback case
- The visual guide page still renders fully for Liverpool — the
  overview card surfaces "Fallback (no verified hero)" rather than
  an image count

### Data / content safety

- **0 invented** image facts, landmark names, district names,
  tourist attraction claims, official tourism claims, neighborhood
  names, safety claims, crime rates, transport times, rent or sale
  prices, salary expectations, exact cost estimates, school
  rankings, hospital proximity claims, transit operators, or any
  "best" / "must-see" / "most beautiful" / "safest" / "cheapest"
  claims
- All 100 summaries follow a single neutral template
- 5-item shared "How to read" section list reframes imagery as
  orientation, not evidence
- Scope-and-limitations disclaimer block on every page reads in
  part: "Imagery comes from the existing verified media catalog
  with source, author, and license attribution. It is not a tourism
  guide, not an attractions ranking, not an official tourism page,
  and not evidence of current local conditions."

### Route / sitemap / metadata

- New route helper `visualCityGuideRoute(citySlug)` →
  `/cities/${citySlug}/visual-guide`
- `getAllIndexableRoutes()` includes the 100 new pages
- Sitemap auto-emits via `getAllVisualCityGuidePages()`:
  `priority: 0.72`, `changeFrequency: monthly`, `lastModified` per
  record
- `generateVisualCityGuideMetadata` produces unique `title`
  (`Visual Guide to {City}`), unique `description`, canonical, OG
  title/description/url, `lastModified` per page
- OG image populated from verified hero only

### Internal linking

Each visual-guide page links to: city profile, country hub,
arrival page (when present), neighborhood page (when present),
moving-to page (when present), cost-of-living calculator,
travel-budget calculator, relocation checklist, `/cities`,
`/countries`, `/compare`, `/arrival` directory, `/moving-to`
directory, methodology, data sources, up to 4 related comparisons.

### Reverse-link impact

Four reverse-link surfaces, each gated by `hasVisualCityGuidePage(city.slug)`:

1. **City profile** — new `LinkCard` next to existing arrival /
   neighborhood / moving-to cards
2. **Arrival page** — new related-link entry alongside existing
   neighborhood and moving-to entries
3. **Neighborhood page** — new related-link entry alongside
   existing moving-to entry
4. **Moving-to page** — new related-link entry alongside existing
   neighborhood / arrival entries

All four gates use Map-backed set membership: exactly-once render,
no duplicate links possible, cards correctly skip for cities outside
the 100-city set.

### Structured data

Only `WebPage` and `BreadcrumbList` JSON-LD emitted per visual-
guide page. No `ImageObject`, `TouristAttraction`, `TravelAction`,
`Place`, `Review`, `Rating`, `Offer`, `FAQPage`, or fake `Dataset`
schemas added.

### Accessibility / performance

- One `<h1>` per page (`Visual Guide to {City}`), `aria-labelledby`
  on every section with visually-hidden `<h2>`
- Imagery carries descriptive alt text + `ImageAttribution`
- All thumbnails lazy-loaded with explicit dimensions
- 0 client components, 0 `useEffect` / `useState`, 0 runtime fetch,
  0 new dependencies, no carousels, no galleries, no maps
- All 100 pages SSG; route bundle 230 B / 106 kB First Load JS

### Page-count delta

- visual-guide pages: 0 → **100**
- static page count: 2,615 → **2,715** (+100). Verified by
  `next build`: `Generating static pages (2715/2715)`

### Validation

- `npm run validate:media` — pass
- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — succeeded, 2715/2715 static pages

## 2026-05-25: /visual-guides directory page

Adds a single central directory page at `/visual-guides`. Mirrors
the `/arrival` and `/moving-to` directory patterns: server-rendered
card grid for all 100 visual-guide pages, country-grouped index,
`ItemList` JSON-LD, breadcrumbs, hub nav, and a related-tools rail.

### Files created

- `app/(visual-guides)/visual-guides/page.tsx` — server-rendered
  directory

### Files updated

- `lib/seo/routes.ts` — adds `staticRoutes.visualGuides = "/visual-guides"`
  and includes it in `getAllIndexableRoutes()`
- `app/sitemap.ts` — emits the new directory URL at `priority: 0.75`,
  `changeFrequency: "monthly"`
- `components/layout/Footer.tsx` — adds a "Visual city guides" link
  under "Moving to city guides" in the Reference column
- `docs/content-expansion.md` — this section

### Page content

- H1 `Visual City Guides`, unique intro paragraph
- `Last updated` and `Data year` chips, plus `Visual guides` count
  and `Countries represented` count from live data
- Sources / methodology disclaimer block (no tourism / attractions
  ranking / best / safest / cheapest claims)
- Card grid for all **100** visual guides, sorted alphabetically by
  city name. Each card shows: country tag, `Visual Guide to {City}`
  link, `visualFocus` label, page summary, plus 5 contextual links —
  city profile, country hub, arrival guide (when present),
  neighborhood guide (when present), moving-to guide (when present)
- Country-grouped index (alphabetical) with every guide also linked
  here for crawler density
- "Continue exploring" related-tools rail: cities, countries,
  compare, arrival, moving-to, cost calc, travel-budget calc,
  relocation checklist, methodology, data sources

### Image / thumbnail decision

**No thumbnails on `/visual-guides`.** Per the audit spec's default
recommendation: text-card directory only. The 100 cards already
provide dense navigation, and each per-city visual guide carries the
verified hero plus optional secondary images. Keeping the directory
text-only avoids gallery weight and keeps the hub fast.

No `og:image` is emitted for the directory itself — `createMetadata`
omits OG image when no `image` is passed.

### Structured data

- `WebPage` JSON-LD for the directory
- `BreadcrumbList` JSON-LD via `staticBreadcrumbs("Visual guides", "/visual-guides")`
- `ItemList` JSON-LD with `numberOfItems: 100`,
  `itemListOrder: ItemListUnordered`, absolute `url` per visual guide

No `ImageObject`, `TouristAttraction`, `TravelAction`, `Place`,
`LocalBusiness`, `School`, `Review`, `Rating`, `Offer`, `FAQPage`,
fake `Dataset`, or other schemas added.

### Footer / internal linking

Footer "Reference" column now reads:

```
City comparisons
Arrival planning guides
Moving to city guides
Visual city guides          ← new
Tools and calculators
Cost of living calculator
Travel budget calculator
Relocation checklist
Methodology
Data sources
```

No broad city-by-city footer additions in this task.

### Page-count delta

- static page count: 2,715 → **2,716** (+1). Verified by `next build`:
  `Generating static pages (2716/2716)`.
- New route appears as `○ /visual-guides` (Static) in the build manifest.

### Validation

- `npm run validate:media` — pass
- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — succeeded, 2716/2716 static pages
- 0 client components, 0 runtime fetch, 0 new dependencies, 0 images
  added on the directory itself

## 2026-05-25 batch: summer city travel planning cluster — first wave

A seasonal SEO cluster for the active 2026 summer travel cycle:
**`/cities/[city]/summer-travel`**. 100 curated pages combine
verified Wikimedia hero imagery (and where available, secondary
images) with structured city intelligence, arrival / visual /
neighborhood / moving-to planning links, comparisons, and budgeting
tools. The pages are **not** a tourism attractions guide, "things to
do" page, live events page, weather forecast, hotel/flight price
page, itinerary generator, official tourism page, or a page with
invented local facts.

### Geographic scope (strict)

EU, UK / Ireland, US, Canada, Australia, New Zealand, and
Switzerland only. Same 100 cities as the visual-guide cluster — so
the full 6-cluster reverse-link mesh (city ↔ arrival ↔ neighborhood
↔ moving-to ↔ visual-guide ↔ summer-travel) is wired for every city
that participates in the visual-guide cluster.

Australia and New Zealand cities receive a `general_summer_planning`
focus by default, with a code comment noting that Northern-Hemisphere
summer = Southern-Hemisphere winter; the pages still serve travel-
research intent for both Northern-Hemisphere arrivals and Southern-
Hemisphere local visitors.

### Files created

- `types/summer-travel.ts` — `SummerTravelFocus`,
  `SummerTravelChecklistCategory`, `SummerTravelChecklistItem`, and
  `SummerTravelCityPage` types
- `lib/data/summer-travel.ts` — 100 curated records via a
  seed-template pattern + 18-item shared seasonal-planning checklist
- `lib/data/queries/summer-travel.ts` — `getAllSummerTravelPages`,
  `getSummerTravelPageByCitySlug`, `getSummerTravelPagesForCountry`,
  `hasSummerTravelPage`, `getSummerTravelChecklist`
- `components/summer-travel/SummerTravelOverviewCards.tsx`
- `components/summer-travel/SummerTravelChecklist.tsx`
- `components/summer-travel/SummerTravelRelatedLinks.tsx`
- `app/(entities)/cities/[city]/summer-travel/page.tsx`

### Files updated

- `types/index.ts`, `lib/data/queries/index.ts` — re-exports
- `lib/seo/routes.ts` — adds `summerTravelRoute(citySlug)` and
  includes the new pages in `getAllIndexableRoutes()`
- `lib/seo/breadcrumbs.ts` — adds `summerTravelBreadcrumbs`
- `lib/seo/metadata.ts` — adds `generateSummerTravelMetadata`
- `app/sitemap.ts` — emits 100 new pages at `priority: 0.76`,
  `changeFrequency: "monthly"`
- `app/(entities)/cities/[city]/page.tsx` — new `LinkCard` reverse
  link gated by `hasSummerTravelPage(city.slug)`
- `app/(arrival)/arrival/[city]/page.tsx`,
  `app/(entities)/cities/[city]/visual-guide/page.tsx`,
  `app/(entities)/cities/[city]/neighborhoods/page.tsx`,
  `app/(entities)/cities/[city]/moving-to/page.tsx` — new
  related-link entries gated by `hasSummerTravelPage(city.slug)`

### Cities included (100)

Same 100 cities as the visual-guide cluster: UK/IE 14, FR 8, DE 9,
NL/BE/LU 8, ES/PT/IT 12, AT/CH/Nordics 7, CEE 5, US 20, CA 8, AU/NZ
9. Full list in the visual-guide batch documentation above.

### Cities skipped

None — every selected slug exists in the registry. Liverpool is the
one fallback-image city (same as the visual-guide cluster): hero
falls back, OG image omitted entirely.

### Wikimedia / verified media usage

- Hero imagery via existing `PlaceHeroImage` → `getCityHeroImage(slug)`
- No new images added; no random URLs, no AI-generated images, no
  unverified attribution

### Fallback-image city handling

- **99 / 100** cities have a verified hero → `og:image` set with
  absolute Wikimedia URL, `og:image:alt`, matching `twitter:image`
- **1 / 100** (Liverpool) → fallback `ImageFallback` block on the
  page; `ogImageFromPlaceImage` returns `undefined`, so
  `createMetadata` omits `openGraph.images` and `twitter.images`
  entirely. No `ImageObject` schema. Page remains fully indexable.

### Data / content safety

- **0 invented** weather forecasts, exact temperatures, heatwave
  claims, event or festival dates, ticket prices, hotel or flight
  prices, opening hours, transport schedules, airport routes,
  attraction rankings, crime / safety claims, medical or visa advice,
  immigration advice, or any "best" / "must-see" / "safest" /
  "cheapest" claims
- All 100 summaries built from a neutral template parameterised by
  `cityName` + `countryName` → 100 unique summaries
- 18-item shared checklist reframes summer travel as a research
  checklist that defers time-sensitive details to official sources
- Scope-and-limitations disclaimer block on every page reads in
  part: "Verify weather, events, transport, health, and safety
  details with official or trusted current sources before
  departure. This is not medical, legal, visa, or immigration advice."

### Route / sitemap / metadata

- `summerTravelRoute(citySlug)` → `/cities/${citySlug}/summer-travel`
- `getAllIndexableRoutes()` includes the 100 new pages
- Sitemap auto-emits via `getAllSummerTravelPages()`: `priority: 0.76`,
  `changeFrequency: monthly`, `lastModified` per record
- `generateSummerTravelMetadata` produces unique `title`
  (`Summer 2026 Travel Planning Guide for {City}`), `description`,
  canonical, OG metadata, `lastModified` per page
- OG image emitted only from verified hero via `ogImageFromPlaceImage`

### Internal linking

Each summer-travel page links to: city profile, country hub, arrival
page (when present), visual guide (when present), neighborhood page
(when present), moving-to page (when present), travel-budget calc,
cost-of-living calc, relocation checklist, `/cities`, `/countries`,
`/compare`, `/arrival` directory, `/moving-to` directory,
`/visual-guides` directory, methodology, data sources, up to 4
related comparisons.

### Reverse-link impact

Five reverse-link surfaces, each gated by `hasSummerTravelPage(city.slug)`:

| Surface | Hook |
|---|---|
| City profile | new `LinkCard` next to existing planning-cluster cards |
| Arrival page | new related-link entry |
| Visual-guide page | new related-link entry |
| Neighborhood page | new related-link entry |
| Moving-to page | new related-link entry |

All five gates use Map-backed set membership (Liverpool example: all
five gates return true, so the full link mesh appears on every cluster
page).

### Structured data

Only `WebPage` and `BreadcrumbList` JSON-LD emitted per summer-travel
page. No `Event`, `TouristAttraction`, `TravelAction`,
`WeatherForecast`, `Place`, `LocalBusiness`, `Review`, `Rating`,
`Offer`, `FAQPage`, fake `Dataset`, or `ImageObject` schemas added.

### Accessibility / performance

- One `<h1>` per page (`Summer 2026 Travel Planning Guide for {City}`),
  `aria-labelledby` on every section with visually-hidden `<h2>`
- Hero imagery carries descriptive alt text + `ImageAttribution`
- 0 client components, 0 `useEffect` / `useState`, 0 runtime fetch
  (no weather APIs, no event APIs), 0 new dependencies, no carousels,
  no maps, no booking widgets
- All 100 pages SSG; route bundle 233 B / 106 kB First Load JS

### Page-count delta

- summer-travel pages: 0 → **100**
- static page count: 2,716 → **2,816** (+100). Verified by
  `next build`: `Generating static pages (2816/2816)`.

### Validation

- `npm run validate:media` — pass
- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — succeeded, 2816/2816 static pages

## 2026-05-31: summer-travel cluster — explicit "Summer 2026" naming pass

Renamed user-facing titles and reverse-link labels for the existing
summer-travel cluster to include the explicit "Summer 2026" year token
per the seasonal-naming spec. No new pages, no new cities, no new
images, no schema changes, no behavior changes — only string updates.

### Renamed surfaces

- `lib/data/summer-travel.ts` — record title template now reads
  `Summer 2026 Travel Planning Guide for ${cityName}`
- `lib/seo/metadata.ts` — `generateSummerTravelMetadata` now produces
  `Summer 2026 Travel Planning Guide for ${city.name}` and a matching
  description starting with "Plan summer 2026 travel research…"
- `app/(entities)/cities/[city]/summer-travel/page.tsx` — H1 now reads
  `Summer 2026 Travel Planning Guide for ${city.name}`
- City profile, arrival page, visual-guide page, neighborhood page,
  and moving-to page reverse-link cards/entries now read
  "Summer 2026 travel planning guide for {City}"

### Page-count delta

- static page count: **2,816 → 2,816** (unchanged — naming pass only)

### Validation

- `npm run validate:media` — pass
- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — succeeded, 2816/2816 static pages

## 2026-05-31: /summer-travel directory page

Adds a single central directory page at `/summer-travel`. Mirrors the
existing `/arrival`, `/moving-to`, and `/visual-guides` directory
patterns: server-rendered text-card grid for all 100 Summer 2026
travel planning guides, country-grouped index, `ItemList` JSON-LD,
breadcrumbs, hub nav, and a related-tools rail.

### Files created

- `app/(summer-travel)/summer-travel/page.tsx` — server-rendered
  directory

### Files updated

- `lib/seo/routes.ts` — adds `staticRoutes.summerTravel = "/summer-travel"`
  and includes it in `getAllIndexableRoutes()`
- `app/sitemap.ts` — emits the new directory URL at `priority: 0.75`,
  `changeFrequency: "monthly"`
- `components/layout/Footer.tsx` — adds a "Summer 2026 travel guides"
  link under "Visual city guides" in the Reference column
- `docs/content-expansion.md` — this section

### Page content

- H1 `Summer 2026 City Travel Planning Guides`, unique intro paragraph
  framed for the active summer 2026 cycle
- `Last updated` and `Data year` chips, plus `Summer 2026 guides`
  count and `Countries represented` count from live data
- Sources / methodology disclaimer block (no weather forecasts,
  events calendars, ticket prices, hotel / flight prices, transport
  schedules, attraction rankings, or best / must-see / safest /
  cheapest claims)
- Card grid for all **100** Summer 2026 guides, sorted alphabetically
  by city name. Each card shows: country tag, `Summer 2026 travel in
  {City}` link, `summerFocus` label, page summary, plus 6 contextual
  links — city profile, country hub, arrival guide, visual guide,
  neighborhood guide, moving-to guide (each shown only when the city
  has the underlying page)
- Country-grouped index (alphabetical) with every guide also linked
  here for crawler density
- "Continue exploring" related-tools rail: cities, countries,
  compare, arrival, visual guides, moving-to, travel-budget calc,
  cost calc, relocation checklist, methodology, data sources

### Image / thumbnail decision

**No thumbnails on `/summer-travel`.** Per the audit spec's default
recommendation: text-card directory only. The 100 cards already
provide dense navigation, and each per-city Summer 2026 guide
carries the verified hero. Keeping the directory text-only avoids
gallery weight and keeps the hub fast.

No `og:image` is emitted for the directory itself — `createMetadata`
omits OG image when no `image` is passed.

### Structured data

- `WebPage` JSON-LD for the directory
- `BreadcrumbList` JSON-LD via `staticBreadcrumbs("Summer travel", "/summer-travel")`
- `ItemList` JSON-LD with `numberOfItems: 100`,
  `itemListOrder: ItemListUnordered`, absolute `url` per guide,
  each `name` set to `Summer 2026 Travel Planning Guide for {City}`

No `Event`, `TouristAttraction`, `TravelAction`, `WeatherForecast`,
`Place`, `LocalBusiness`, `Review`, `Rating`, `Offer`, `FAQPage`,
fake `Dataset`, or `ImageObject` schemas added.

### Footer / internal linking

Footer "Reference" column now reads:

```
City comparisons
Arrival planning guides
Moving to city guides
Visual city guides
Summer 2026 travel guides   ← new
Tools and calculators
Cost of living calculator
Travel budget calculator
Relocation checklist
Methodology
Data sources
```

No broad city-by-city footer additions in this task.

### Page-count delta

- static page count: 2,816 → **2,817** (+1). Verified by `next build`:
  `Generating static pages (2817/2817)`.
- New route appears as `○ /summer-travel` (Static) in the build manifest.

### Validation

- `npm run validate:media` — pass
- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — succeeded, 2817/2817 static pages
- 0 client components, 0 runtime fetch, 0 new dependencies, 0 images
  added on the directory itself

## 2026-05-31 batch: weekend city trip planning cluster — first wave

A travel-intent SEO cluster for short-trip planning research:
**`/cities/[city]/weekend-trip`**. 100 curated pages combine
verified Wikimedia hero imagery (where available) with structured
city intelligence, arrival / visual / Summer 2026 / neighborhood /
moving-to planning links, comparisons, and budgeting tools. The
pages are **not** a fixed itinerary, "things to do" page, top
attractions page, live events page, restaurant or hotel
recommendation page, weather forecast, ticket-price page, official
tourism page, or a page with invented local facts.

### Geographic scope (strict)

EU, UK / Ireland, US, Canada, Australia, New Zealand, and
Switzerland only. Same 100 cities as the visual-guide and
summer-travel clusters — so the full 7-cluster reverse-link mesh
(city ↔ arrival ↔ neighborhood ↔ moving-to ↔ visual-guide ↔
summer-travel ↔ weekend-trip) is wired for every city that
participates in those clusters.

### Files created

- `types/weekend-trip.ts` — `WeekendTripFocus`,
  `WeekendTripChecklistCategory`, `WeekendTripChecklistItem`, and
  `WeekendTripCityPage` types
- `lib/data/weekend-trip.ts` — 100 curated records via a
  seed-template pattern + 18-item shared short-trip checklist
- `lib/data/queries/weekend-trip.ts` — `getAllWeekendTripPages`,
  `getWeekendTripPageByCitySlug`,
  `getWeekendTripPagesForCountry`, `hasWeekendTripPage`,
  `getWeekendTripChecklist`
- `components/weekend-trip/WeekendTripOverviewCards.tsx`
- `components/weekend-trip/WeekendTripChecklist.tsx`
- `components/weekend-trip/WeekendTripRelatedLinks.tsx`
- `app/(entities)/cities/[city]/weekend-trip/page.tsx`

### Files updated

- `types/index.ts`, `lib/data/queries/index.ts` — re-exports
- `lib/seo/routes.ts` — adds `weekendTripRoute(citySlug)` and
  includes the new pages in `getAllIndexableRoutes()`
- `lib/seo/breadcrumbs.ts` — adds `weekendTripBreadcrumbs`
- `lib/seo/metadata.ts` — adds `generateWeekendTripMetadata`
- `app/sitemap.ts` — emits 100 new pages at `priority: 0.75`,
  `changeFrequency: "monthly"`
- `app/(entities)/cities/[city]/page.tsx` — new `LinkCard` reverse
  link gated by `hasWeekendTripPage(city.slug)`
- `app/(arrival)/arrival/[city]/page.tsx`,
  `app/(entities)/cities/[city]/summer-travel/page.tsx`,
  `app/(entities)/cities/[city]/visual-guide/page.tsx`,
  `app/(entities)/cities/[city]/neighborhoods/page.tsx`,
  `app/(entities)/cities/[city]/moving-to/page.tsx` — new
  related-link entries gated by `hasWeekendTripPage(city.slug)`

### Cities included (100)

Same 100 cities as the visual-guide and summer-travel clusters:
UK/IE 14, FR 8, DE 9, NL/BE/LU 8, ES/PT/IT 12, AT/CH/Nordics 7,
CEE 5, US 20, CA 8, AU/NZ 9.

### Cities skipped

None — every selected slug exists in the registry. Liverpool is
the one fallback-image city (same as visual-guide and summer-travel
clusters).

### Wikimedia / verified media usage

- Hero imagery via existing `PlaceHeroImage` → `getCityHeroImage(slug)`
- No new images added; no random URLs, no AI-generated images, no
  unverified attribution

### Fallback-image city handling

- **99 / 100** verified hero → `og:image` set
- **1 / 100** (Liverpool) → fallback `ImageFallback` block on page;
  `og:image` and `twitter:image` omitted entirely by `createMetadata`;
  no `ImageObject` schema; page remains indexable

### Data / content safety

- **0 invented** fixed itineraries, day-by-day schedules, attraction
  rankings, "things to do" lists, "must-see" / "top attractions"
  claims, restaurant or hotel recommendations, nightlife
  recommendations, event or festival dates, ticket prices, hotel or
  flight prices, opening hours, transport schedules, airport routes,
  exact travel times, weather forecasts, exact temperatures, crime
  rates, medical advice, or visa rules
- All 100 summaries built from a neutral template parameterised by
  `cityName` + `countryName` → 100 unique summaries
- 18-item shared checklist reframes weekend travel as a research
  checklist deferring time-sensitive details to official sources
- Scope-and-limitations disclaimer block on every page reads in
  part: "Verify events, opening hours, transport, weather, health,
  and safety details with official or trusted current sources
  before departure. This is not medical, legal, visa, or
  immigration advice."

### Route / sitemap / metadata

- `weekendTripRoute(citySlug)` → `/cities/${citySlug}/weekend-trip`
- `getAllIndexableRoutes()` includes the 100 new pages
- Sitemap auto-emits via `getAllWeekendTripPages()`: `priority: 0.75`,
  `changeFrequency: monthly`, `lastModified` per record
- `generateWeekendTripMetadata` produces unique `title`
  (`Weekend Trip Planning Guide for {City}`), `description`,
  canonical, OG metadata, `lastModified` per page
- OG image populated from verified hero only

### Internal linking

Each weekend-trip page links to: city profile, country hub, arrival
page (when present), Summer 2026 travel guide (when present),
visual guide (when present), neighborhood page (when present),
moving-to page (when present), travel-budget calc, cost-of-living
calc, relocation checklist, `/cities`, `/countries`, `/compare`,
`/arrival` directory, `/summer-travel` directory, `/visual-guides`
directory, `/moving-to` directory, methodology, data sources, up to
4 related comparisons.

### Reverse-link impact

Six reverse-link surfaces, each gated by `hasWeekendTripPage(city.slug)`:

| Surface | Hook |
|---|---|
| City profile | new `LinkCard` next to existing planning-cluster cards |
| Arrival page | new related-link entry |
| Summer-travel page | new related-link entry |
| Visual-guide page | new related-link entry |
| Neighborhood page | new related-link entry |
| Moving-to page | new related-link entry |

All six gates use Map-backed set membership.

### Structured data

Only `WebPage` and `BreadcrumbList` JSON-LD emitted per weekend-trip
page. No `Event`, `TouristAttraction`, `TravelAction`, `Itinerary`,
`Place`, `WeatherForecast`, `Review`, `Rating`, `Offer`, `FAQPage`,
fake `Dataset`, or `ImageObject` schemas added.

### Accessibility / performance

- One `<h1>` per page (`Weekend Trip Planning Guide for {City}`),
  `aria-labelledby` on every section with visually-hidden `<h2>`
- Hero imagery carries descriptive alt text + `ImageAttribution`
- 0 client components, 0 `useEffect` / `useState`, 0 runtime fetch
  (no weather APIs, no event APIs), 0 new dependencies, no carousels,
  no maps, no booking widgets
- All 100 pages SSG; route bundle 262 B / 106 kB First Load JS

### Page-count delta

- weekend-trip pages: 0 → **100**
- static page count: 2,817 → **2,917** (+100). Verified by
  `next build`: `Generating static pages (2917/2917)`.

### Validation

- `npm run validate:media` — pass
- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — succeeded, 2917/2917 static pages

## 2026-05-31: /weekend-trips directory page

Adds a single central directory page at `/weekend-trips`. Mirrors
the existing `/arrival`, `/moving-to`, `/visual-guides`, and
`/summer-travel` directory patterns: server-rendered text-card grid
for all 100 weekend trip planning guides, country-grouped index,
`ItemList` JSON-LD, breadcrumbs, hub nav, and a related-tools rail.

**New "local-first" framing**: the directory leads with a "Plan a
weekend close to your city" section that reframes weekend travel
research toward short-distance, close-to-home planning. The framing
is text-only — it does not name specific nearby places, claim
distances, publish travel times, or rank destinations. The site has
no verified nearby-place model yet, so the section sticks to general
research-practice guidance that defers time-sensitive details to
official sources.

### Files created

- `app/(weekend-trips)/weekend-trips/page.tsx` — server-rendered
  directory

### Files updated

- `lib/seo/routes.ts` — adds `staticRoutes.weekendTrips = "/weekend-trips"`
  and includes it in `getAllIndexableRoutes()`
- `app/sitemap.ts` — emits the new directory URL at `priority: 0.75`,
  `changeFrequency: "monthly"`
- `components/layout/Footer.tsx` — adds a "Weekend trip guides" link
  under "Summer 2026 travel guides" in the Reference column
- `docs/content-expansion.md` — this section

### Page content

- H1 `Weekend City Trip Planning Guides`, unique intro paragraph
- `Last updated` and `Data year` chips, plus `Weekend guides` count
  and `Countries represented` count from live data
- **Local-first section** ("Plan a weekend close to your city"): 6
  short-trip research prompts that lead with using the user's own
  city as the starting point and link inward to `/cities`,
  `/compare`, `/arrival`, `/visual-guides`, and the travel-budget
  calculator. No named nearby places, no distances, no travel times,
  no route advice.
- Sources / methodology disclaimer block (no fixed itineraries,
  attraction rankings, restaurant or hotel recommendations, event
  dates, ticket prices, hotel / flight prices, opening hours,
  transport schedules, airport routes, exact travel times, exact
  distances, weather forecasts, crime rates, or any "best" /
  "must-see" / "safest" / "cheapest" claims)
- Card grid for all **100** weekend guides, sorted alphabetically by
  city name. Each card shows: country tag, `Weekend trip in {City}`
  link, `weekendFocus` label, page summary, plus 7 contextual links
  — city profile, country hub, arrival guide, Summer 2026 guide,
  visual guide, neighborhood guide, moving-to guide (each shown only
  when the city has the underlying page)
- Country-grouped index (alphabetical) with every guide also linked
  here for crawler density
- "Continue exploring" related-tools rail: cities, countries,
  compare, arrival, Summer 2026, visual guides, moving-to,
  travel-budget calc, cost calc, relocation checklist, methodology,
  data sources

### Image / thumbnail decision

**No thumbnails on `/weekend-trips`.** Per the audit spec's default
recommendation: text-card directory only. The 100 cards already
provide dense navigation, per-city weekend pages carry the verified
hero, and the directory stays fast and crawlable. No `og:image` is
emitted for the directory itself — `createMetadata` omits OG image
when no `image` is passed.

### Structured data

- `WebPage` JSON-LD for the directory
- `BreadcrumbList` JSON-LD via `staticBreadcrumbs("Weekend trips", "/weekend-trips")`
- `ItemList` JSON-LD with `numberOfItems: 100`,
  `itemListOrder: ItemListUnordered`, absolute `url` per guide,
  each `name` set to `Weekend Trip Planning Guide for {City}`

No `Event`, `TouristAttraction`, `TravelAction`, `Itinerary`,
`Place`, `WeatherForecast`, `Review`, `Rating`, `Offer`, `FAQPage`,
fake `Dataset`, or `ImageObject` schemas added.

### Footer / internal linking

Footer "Reference" column now reads:

```
City comparisons
Arrival planning guides
Moving to city guides
Visual city guides
Summer 2026 travel guides
Weekend trip guides         ← new
Tools and calculators
Cost of living calculator
Travel budget calculator
Relocation checklist
Methodology
Data sources
```

No broad city-by-city footer additions in this task.

### Local-first / nearby rest positioning

The "Plan a weekend close to your city" section uses **only generic
research-practice language** — no nearby place names, no distances,
no travel times, no route advice, no transport operators, no
destination rankings. The platform has no verified nearby-place
helper today, so the section sticks to:

- "Use your city as the starting point" → `/cities`
- "Look for short-distance options before planning a flight" →
  verify with official transport sources
- "Compare nearby city profiles where available" → `/compare`
- "Use the calculators with your own inputs" → travel-budget calc
- "Open arrival and visual guides where available" → `/arrival`,
  `/visual-guides`
- "Verify transport and access with official sources"

When a verified nearby-place model is added later, the section can
be extended without breaking the disclaimer contract.

### Page-count delta

- static page count: 2,917 → **2,918** (+1). Verified by `next build`:
  `Generating static pages (2918/2918)`.
- New route appears as `○ /weekend-trips` (Static) in the build manifest.

### Validation

- `npm run validate:media` — pass
- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — succeeded, 2918/2918 static pages
- 0 client components, 0 runtime fetch, 0 new dependencies, 0 images
  added on the directory itself

## 2026-05-31: nearby weekend places model (data foundation)

This is a **data foundation** task — not a mass page generation. It
establishes a structured registry of verified nearby weekend places
connected to existing city profiles so the platform can support
**close-to-home rest** and **local-first weekend planning** without
inventing distances, routes, schedules, attraction rankings, or
prices.

### Purpose / product direction

- short breaks near the user's home city
- local-first weekend planning
- close-to-home rest without flights required
- nearby nature, waterfronts, small towns, historic areas, and
  regional cities (parks, national parks, UNESCO sites, lakes,
  islands, well-known regional destinations)
- verified sources only; no fake "best places" lists; no invented
  routes, distances, prices, or opening hours

### Files created

- `types/nearby-places.ts` — `NearbyWeekendPlace`,
  `NearbyPlaceCategory` (12 categories: nature, waterfront,
  historic_town, park, beach, lake, mountain, island, cultural_site,
  regional_city, family_outdoor, general_weekend_place),
  `NearbyPlaceTravelMode`, `DistanceBand`,
  `NearbyPlaceVerificationStatus`, `NearbyPlaceImage`
- `lib/data/nearby-places.ts` — **68 curated records** connected to
  **24 priority cities** + `getNearbyPlaceCategoryLabel` helper
- `lib/data/queries/nearby-places.ts` — `getAllNearbyWeekendPlaces`,
  `getNearbyWeekendPlaceBySlug`, `getNearbyWeekendPlacesForCity`,
  `getNearbyWeekendPlacesForCountry`,
  `getNearbyWeekendPlacesByCategory`, `hasNearbyWeekendPlacesForCity`,
  `getNearbyWeekendPlacesForWeekendTrip(citySlug, limit = 6)`
- `scripts/validate-nearby-places.py` — slug uniqueness, city /
  country / source reference resolution, banned-field check,
  positive-wording check on summaries and cautionNotes, image
  attribution check (forward-compatible)

### Files updated

- `types/index.ts`, `lib/data/queries/index.ts` — re-exports
- `lib/data/sources/index.ts` — adds `wikidata` and
  `wikimedia-commons` source registry entries; every nearby-place
  record cites these alongside the urban-data baseline
- `package.json` — adds `validate:nearby-places` npm script
- `app/(entities)/cities/[city]/weekend-trip/page.tsx` — adds a
  restrained "Nearby weekend places to research" section gated by
  `nearbyPlaces.length > 0`; the section renders the first 6 places
  for the city using `getNearbyWeekendPlacesForWeekendTrip`
- `docs/content-expansion.md` — this section

### Records added (68)

Distribution by region:

- **UK / Ireland (12)**: Hyde Park, Richmond Park, Kew Gardens,
  Maritime Greenwich, Windsor, Brighton (regional city), Peak
  District National Park, Holyrood Park, Pentland Hills Regional
  Park, Phoenix Park, Wicklow Mountains National Park, Cotswolds
- **France (6)**: Versailles, Fontainebleau, Chantilly, Calanques
  National Park, Beaujolais
- **Germany (7)**: Potsdam Palaces and Parks, Wannsee, Spreewald,
  Englischer Garten, Lübeck, Rheingau, Heidelberg
- **Netherlands / Belgium (6)**: Zaanse Schans, Haarlem,
  Kinderdijk, Delft, Bruges, Ghent
- **Spain / Portugal / Italy (12)**: Toledo, Segovia, Escurial,
  Montserrat, Sitges, Sintra, Cascais, Alto Douro Wine Region,
  Tivoli, Lake Como, Bergamo
- **Austria / Sweden / Finland / Denmark / Czechia (7)**: Schönbrunn,
  Wachau, Drottningholm, Uppsala, Suomenlinna, Roskilde, Karlštejn
- **United States (10)**: Hudson Valley, Cape Cod, Shenandoah NP,
  Muir Woods NM, Point Reyes NS, Olympic NP, Mount Rainier NP,
  Indiana Dunes NP, Rocky Mountain NP, Everglades NP
- **Canada (4)**: Niagara Falls, Stanley Park, Gatineau Park,
  Île d'Orléans
- **Australia / New Zealand (6)**: Blue Mountains NP, Royal NP,
  Phillip Island, Rottnest Island, Waiheke Island, Fiordland NP

### Connected cities (24)

UK / IE: london, manchester, edinburgh, dublin, oxford  ·
FR: paris, lyon, marseille  ·  DE: berlin, munich, hamburg,
frankfurt  ·  NL: amsterdam, rotterdam, the-hague  ·  BE: brussels
·  ES: madrid, barcelona  ·  PT: lisbon, porto  ·  IT: rome, milan
·  AT: vienna  ·  CZ: prague  ·  SE: stockholm  ·  FI: helsinki  ·
DK: copenhagen  ·  US: new-york, boston, washington-dc,
san-francisco, seattle, chicago, denver, miami  ·  CA: toronto,
vancouver, ottawa, quebec-city  ·  AU: sydney, melbourne, perth  ·
NZ: auckland, queenstown

(Counts above sum across overlapping connections — the `byCity`
index in queries handles fan-out for places connected to multiple
cities, e.g. Cotswolds → oxford + london.)

### Source / verification strategy

Each record cites the urban-data baseline (`un-habitat`,
`ipcc-urban`) and the two new identifier-registry sources
(`wikidata`, `wikimedia-commons`). Every record's
`verificationStatus` is **`needs_review`** in this batch — the
optional fields (`wikidataId`, `officialUrl`, `commonsCategory`,
`latitude`, `longitude`, `image`) are deliberately left empty so a
follow-up verification pass can resolve QIDs against Wikidata and
populate the URL / image / coordinate fields under the existing
verify-place-images pipeline.

### Image usage

**No images added in this batch.** Records simply omit the optional
`image` field. When a future verification pass populates images, the
existing media-attribution / verification rules apply through the
`NearbyPlaceImage` type and the validation script's image-block
check.

### Weekend-trip page integration

Restrained section added to `/cities/[city]/weekend-trip` pages:

- Gated on `nearbyPlaces.length > 0` — pages for cities without any
  connected places render unchanged
- Renders the first 6 places via `getNearbyWeekendPlacesForWeekendTrip`
- Each card shows: category label + region tag, place name (linked
  to `officialUrl` when present), summary, and a footer line
  surfacing verification status and Wikidata identifier (or
  "pending")
- No travel time, no exact distance, no "best nearby" wording — the
  card explicitly defers time-sensitive details to the official
  source
- The disclaimer paragraph at the bottom of the section reads:
  "Records do not publish exact distances, travel times, transport
  schedules, opening hours, ticket prices, restaurant or hotel
  recommendations, attraction rankings, or live access status."

### Safety / content

- **0 invented** distances, travel times, transport routes, ticket
  prices, opening hours, event dates, hotel prices, safety claims,
  weather claims, accessibility claims, or official tourism
  information
- **0 named** restaurants, hotels, nightlife venues, tour operators,
  or scheduled events
- All 68 record summaries follow the same neutral template
- `npm run validate:nearby-places` passes with **0 errors**:
  - 68 unique slugs
  - every `connectedCitySlug` resolves to a city in `cities.ts`
  - every `countrySlug` resolves to a country in `countries.ts`
  - every `sourceId` resolves to a source in
    `lib/data/sources/index.ts`
  - no banned field (`travelTimeMinutes`, `exactDistanceKm`,
    `ticketPrice`, `openingHours`)
  - no banned positive wording in any summary

### Structured data impact

No new schema types in this task. Weekend-trip pages continue to
emit only `WebPage` + `BreadcrumbList` JSON-LD. No `Place`,
`TouristAttraction`, `TravelAction`, `Itinerary`, `Review`, `Rating`,
`Offer`, or `Event` schema for nearby places.

### Internal linking impact

- Place cards on weekend-trip pages link **outward** to each place's
  `officialUrl` only when present (currently 0 of 68 records — all
  are pending source-URL verification)
- No sitemap routes added for nearby places
- No new static routes; no new pages

### Page-count delta

- static page count: **2,918 → 2,918** (unchanged — data foundation
  only, no new routes)
- Weekend-trip pages may render a new conditional section but route
  count is identical

### Validation results

- `npm run validate:nearby-places` — pass (68 / 68 records clean)
- `npm run validate:media` — pass
- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — succeeded, 2918/2918 static pages

### Future next step

- **`feat: add nearby weekend places directory page`** — a
  `/weekend-places` (or similar) directory page that lists all 68
  records grouped by category and country
- **`feat: populate Wikidata QIDs and official URLs for nearby
  weekend places`** — a verification pass that lifts every record's
  `verificationStatus` from `needs_review` to `verified`, populates
  `wikidataId` and `officialUrl`, and (where Commons has a verified
  CC-licensed file) extends the existing image pipeline to cover
  nearby places
- Place detail pages should be added **only after** the source model
  matures — empty pages with no verified URL / image would be thin

## 2026-05-31: nearby weekend places verification pass (Wikidata + official sources)

This pass lifts every record in the nearby-weekend-places dataset
from `needs_review` to a confident verification state by sourcing
identifiers and URLs from Wikidata and the small whitelist of
authoritative bodies listed below. The work is strictly metadata —
no summaries were rewritten and no images were shipped.

### Scope

- **68 records reviewed** — the full nearby-weekend-places dataset
  introduced in the previous section
- **52 records marked `verified`** — each carries both a stable
  Wikidata QID and an `officialUrl` sourced from Wikidata property
  P856 (official website)
- **16 records marked `partial`** — Wikidata QID is confirmed, but
  the Wikidata entity does not currently expose a P856 official URL,
  so no `officialUrl` was set
- **0 records remain `needs_review`** — every record in the dataset
  now has a confirmed QID

### Field-level deltas

- **68 records gained a `wikidataId`** (every record in the dataset)
- **52 records gained an `officialUrl`**, populated exclusively from
  Wikidata property P856 — no URL was inferred, guessed, or copied
  from search results
- **68 records gained `latitude` and `longitude`** from Wikidata
  property P625, with `coordinateSource` set to exactly the string
  `"wikidata"` on every record
- **~60 records gained a `commonsCategory`** where the linked
  Wikidata entity exposes a Wikimedia Commons category — this is a
  prerequisite for the future image pass, but no images were
  ingested or rendered in this task

### Source rules

The verification process followed a strict priority order. No source
outside this list was used:

1. **Wikidata** — primary identifier (QID), coordinates (P625),
   official website (P856), Commons category
2. **Official park / municipality / heritage body** — only consulted
   to confirm that the URL returned by Wikidata P856 still resolves
   to the operator's own site
3. **UNESCO official** — only for World Heritage entries, and only
   to confirm the inscription matches the QID
4. **Public-authority tourism boards** — used only when Wikidata's
   P856 explicitly points at a municipal or national tourism authority
   that is the de-facto operator

Commercial travel sites, aggregators, review platforms, OTAs, and
user-generated content sources were not used as evidence for any
field.

### Safety / content rules retained

No summaries were rewritten and no banned content was introduced:

- **0** travel times, exact distances, ticket prices, opening hours,
  weather statements, hotel prices, or attraction rankings were
  added to any record
- The existing ban on positive marketing wording in summaries remains
  in force; all 68 summaries are byte-identical to the previous pass
- No restaurants, hotels, nightlife venues, tour operators, or
  scheduled events were named

### UI surface

The weekend-trip place card now renders human-readable status labels
in place of the raw enum value:

- `verified` -> **"Verified source record"**
- `partial` -> **"Partially verified source record"**
- `needs_review` -> **"Pending detailed verification"**

The disclaimer paragraph and the deferral of time-sensitive details
to the official source are unchanged.

### Validation script changes

`npm run validate:nearby-places` was extended to enforce the
verification invariants:

- `verificationStatus` must be one of the valid enum values
  (`verified`, `partial`, `needs_review`)
- Any record with `verificationStatus === "verified"` must have at
  least one of `wikidataId` or `officialUrl` populated
- Any record that sets coordinates must set **all three** of
  `latitude`, `longitude`, and `coordinateSource` together
- `BANNED_FIELDS` was expanded to keep blocking distance, time,
  price, and hours fields from ever entering the dataset
- Any image record must have `verified: true` — image rendering is
  gated on explicit per-record verification (and no image records
  exist yet in this pass)

### Page-count delta

- static page count: **2,918 -> 2,918** (unchanged — verification is
  a metadata pass, no new routes)
- sitemap unchanged
- no new routes added
- no client-side fetching introduced; all verification data is
  embedded at build time

### Future next step

- **`feat: add nearby weekend places directory page`** — surface the
  verified dataset on a dedicated directory page grouping records by
  category and country; image verification remains a separate,
  future pass

## 2026-05-31: nearby weekend places directory page

This change adds a single top-level static directory page that
surfaces the existing nearby-weekend-places dataset. It is a
read-only listing of the records already verified in the previous
pass and does not introduce any new place records, images, or
detail pages.

### Route added

- **`/nearby-weekend-places`** — a top-level static directory route.
  No place-level detail routes were added; each record is anchored
  on the directory via a `#slug` fragment, and in-page navigation
  scrolls to the matching card.

### What the page is, and what it deliberately is not

The page lists **68 records** from the existing dataset, broken
down exactly as:

- **52 verified** (Verified source record)
- **16 partial** (Partially verified source record)
- **0 needs_review** (Pending detailed verification)

Positioning is intentionally narrow:

- it is a **local-first weekend rest** directory, oriented toward
  source-backed planning candidates near the listed origin cities
- it is **not** a tourism ranking, a curated itinerary, a route
  planner, a distance or travel-time calculator, or a live
  availability page
- it does **not** claim &ldquo;best&rdquo;, &ldquo;must-see&rdquo;,
  &ldquo;safest&rdquo;, or &ldquo;cheapest&rdquo; for any record,
  and the existing ban on promotional wording in summaries remains
  in force

### Content boundaries

The directory inherits the dataset's existing content rules without
relaxation:

- no place detail pages were added; records use `#slug` fragments on
  the directory page itself
- no images were added; the text-only card layout retains the
  no-image policy, and the future image pass is still gated on
  per-record `verified: true`
- no exact distances, no travel times, no transport routes, no
  ticket prices, no opening hours, no weather statements, no hotel
  prices, and no attraction-ranking claims are rendered for any
  record
- time-sensitive details continue to be deferred to the official
  source linked on each card

### Structured data

The page emits three JSON-LD blocks, all derived from the existing
dataset and the existing route helpers:

- **`WebPage`** JSON-LD describing the directory page itself
- **`BreadcrumbList`** JSON-LD linking Home -> Nearby weekend places
- **`ItemList`** JSON-LD with `itemListOrder: "ItemListUnordered"`,
  where every entry carries a `name` and a `url` of the form
  `/nearby-weekend-places#<slug>`; the unordered ordering is
  deliberate, because the page is not a ranking

### Sitemap delta

- **+1 entry**: `/nearby-weekend-places` at **priority 0.75**,
  **monthly** changefreq
- no other sitemap entries were modified

### Static page-count delta

- static page count: **2,918 -> 2,919** (**+1**, the new directory
  route)
- no detail pages were generated, so the delta is exactly +1

### Footer

- a **"Nearby weekend places"** link was added to the **Reference**
  column of the footer, placed immediately after **Weekend trip
  guides**; column ordering and the other footer links are unchanged

### routes.ts

- `staticRoutes.nearbyWeekendPlaces` was added and is set to
  `"/nearby-weekend-places"` (the value was already defined in the
  route map and is reused, not re-declared)
- the new route is included in `getAllIndexableRoutes()`, so the
  sitemap, breadcrumb helpers, and link-validation tooling all see
  it through the existing single source of truth

### Validations

All required checks pass on the change:

- **`npm run validate:nearby-places`** — PASS (record count,
  verification-status enum, banned-field guard, and coordinate
  triple invariant all hold)
- **`npm run validate:media`** — PASS (no new images were added,
  and the no-image policy on this page is enforced)
- **typecheck** — clean
- **lint** — clean
- **build** — **2,919 / 2,919** routes generated, matching the
  expected post-change page count

## 2026-05-31: nearby weekend places Wikimedia image pass

This change attaches verified Wikimedia Commons images to a subset
of the existing nearby-weekend-places dataset. No new records, no
new routes, and no place detail pages were added. Images are visual
context only and are not used to support any travel, ranking, or
time-sensitive claim.

### Coverage

- **68 records attempted**
- **54 images added** (records that resolved cleanly to a Wikidata
  P18 file with an accepted license and attribution)
- **14 records skipped** — these records keep their existing
  `verificationStatus` untouched and render text-only as before

### Skip-reason breakdown

The 14 skips fall into three buckets, and the per-record reasons
are recorded so a later pass can revisit them:

- **8 `missing_attribution`** — the Commons file resolved but
  lacked Artist metadata in `imageinfo`, so an attribution string
  could not be constructed without inventing data:
  `richmond-park-london`, `phoenix-park-dublin`,
  `rheingau-near-frankfurt`, `ghent-near-brussels`,
  `cascais-near-lisbon`, `muir-woods-near-san-francisco`,
  `waiheke-island-near-auckland`, `fiordland-near-queenstown`
- **5 `no_p18_on_wikidata`** — the linked Wikidata entity does not
  declare a P18 image at all, so there is no canonical file to
  resolve: `pentland-hills-edinburgh`, `beaujolais-near-lyon`,
  `sitges-near-barcelona`, `hudson-valley-near-new-york`,
  `cape-cod-near-boston`
- **1 `incompatible_license`** — the Commons file declares a
  generic `"Attribution"` license without a CC version, which is
  not on the accepted-license list:
  `indiana-dunes-near-chicago`

### Source policy

Image candidates were resolved through a single pipeline with no
fallback to ad-hoc sources:

- **Wikidata P18** -> **Wikimedia Commons `imageinfo` API** only
- no Google Images, no general web search, no random URLs
- no tourism-board, OTA, or commercial-travel imagery
- no AI-generated images
- no manually curated or hand-picked files outside the P18 path

### License policy

Only the following licenses were accepted:

- Public domain / **PD** / **CC0**
- **CC BY** (any version)
- **CC BY-SA** (any version)

The following were explicitly rejected:

- NC (non-commercial), ND (no-derivatives), FAL, GFDL
- unknown / unparseable license strings
- a bare `"Attribution"` declaration without a CC version
  (this is what skipped `indiana-dunes-near-chicago`)

### Safety policy

Files that resolved with the right license were still discarded if
the filename or main subject suggested unsafe or unsuitable content
for a place card. Specifically:

- filenames containing tokens like `montage`, `collage`, `flag`,
  `coat_of_arms`, `emblem`, `logo`, `map`, `protest`, `military`,
  `disaster`, or `postcard` were rejected
- images whose apparent main subject is an identifiable person
  were rejected, since a weekend-place card should depict the
  place itself

### UI impact

The image is surfaced on two existing surfaces only. No new
surface, route, gallery, carousel, or place detail page was added.

- **`/nearby-weekend-places` directory** — cards that have a
  verified image now render a leading image inside the card using
  a `-mx-5 -mt-5` negative-space `<figure>` with an inline
  `<figcaption>` for attribution; cards without a verified image
  render text-only exactly as before
- **`/cities/[city]/weekend-trip` nearby section** — the same
  `<figure>` is rendered when `place.image` is set, within the
  existing max-6-cards layout (the cap is unchanged)
- both surfaces use a plain
  `<img loading="lazy" decoding="async">` tag with explicit
  `width` and `height` attributes and an `aspectRatio` style; no
  `next/image`, no client components, no new dependencies, and no
  carousel / gallery / masonry component was introduced
- attribution is rendered inline in the `<figcaption>` as
  `author / Wikimedia Commons, license`, with separate links to
  `authorUrl` (when available), `sourceUrl` (the Commons file
  page), and `licenseUrl`

### Verification status policy

Adding an image does **not** change any record's
`verificationStatus`:

- `partial` records that gained an image remain `partial`
- `verified` records that gained an image remain `verified`
- the 14 skipped records keep whatever `verificationStatus` they
  already had — none were promoted to `verified` or demoted to
  `needs_review` as a side effect of this pass

### Static page-count delta

- static page count: **2,919 -> 2,919** (unchanged)
- no new routes
- no sitemap growth
- no client-side fetching introduced; all image metadata is
  embedded at build time
- no place detail pages were added

### Validation script changes

`npm run validate:nearby-places` was extended to enforce the
image-record invariants:

- when a record carries an `image`, the required fields are
  `src`, `width`, `height`, `alt`, `source`, `sourceUrl`,
  `author`, `license`, `licenseUrl`, `attributionText`,
  `verified: true`, and `verifiedAt`
- `license` must not be NC, ND, FAL, GFDL, unknown, or a bare
  `"Attribution"` without a CC version
- `src` (and the file referenced by `sourceUrl`) must not contain
  any of the suspicious filename tokens listed under the safety
  policy
- `sourceUrl` must use the Wikimedia Commons file-page prefix, so
  that off-Commons URLs cannot enter the dataset

### Next steps

- audit the nearby weekend places image pass against the live
  build, including the 14 skipped records, to confirm the
  text-only fallback renders cleanly on both surfaces
- future place detail pages remain deferred until image and source
  maturity are higher; this pass does not unlock them

## 2026-05-31: verified nearby weekend place detail pages

This pass introduces the first set of per-place detail pages for
the nearby weekend places dataset. The pages are statically
generated, source-backed, and deliberately scoped to records that
already carry every required attribute. No new place records, no
new images, no new schemas beyond `WebPage` + `BreadcrumbList`,
and no new cities or countries were introduced.

### Scope

- 25 detail pages were added, one per curated slug, at the route
  `/nearby-weekend-places/[slug]`
- the route is fully SSG: `dynamicParams = false` and
  `generateStaticParams()` returns only the 25 curated slugs
- every detail page is positioned as a "source-backed nearby
  weekend place to research", oriented toward local-first
  planning, and tells the reader to verify current access and
  conditions with official sources — it is explicitly not a route
  planner, not a live schedule, and not a tourism ranking

### Eligibility criteria

A nearby place record qualifies for a detail page only when every
one of the following holds:

- `verificationStatus === "verified"`
- a non-empty `officialUrl` (sourced from Wikidata)
- a non-empty `wikidataId`
- a verified image entry in `VERIFIED_IMAGES` (with full
  attribution, a safe Wikimedia Commons license, and the safety
  filename filter passed)
- non-null `coordinates` (latitude + longitude)
- a populated `countrySlug` that resolves to a known country
- a populated `connectedCitySlug` that resolves to a known city in
  the cities dataset

Records that fail any single one of those checks do not get a
detail page in this batch.

### Curated slugs (25, alphabetical)

1. `blue-mountains-near-sydney`
2. `brighton-near-london`
3. `bruges-near-brussels`
4. `calanques-near-marseille`
5. `englischer-garten-munich`
6. `fontainebleau-near-paris`
7. `greenwich-london`
8. `heidelberg-near-frankfurt`
9. `holyrood-park-edinburgh`
10. `hyde-park-london`
11. `karlstejn-near-prague`
12. `kew-gardens-london`
13. `lake-como-near-milan`
14. `mount-rainier-near-seattle`
15. `peak-district-near-manchester`
16. `schonbrunn-vienna`
17. `shenandoah-near-washington-dc`
18. `sintra-near-lisbon`
19. `suomenlinna-helsinki`
20. `tivoli-near-rome`
21. `toledo-near-madrid`
22. `versailles-near-paris`
23. `wicklow-mountains-near-dublin`
24. `windsor-near-london`
25. `zaanse-schans-near-amsterdam`

### Eligible-but-deferred verified+imaged records (19)

The following 19 records satisfy every eligibility criterion above
but were intentionally held back from this batch to keep the first
detail-page release small and reviewable. They are deferred to a
future batch — they were not skipped because they were
ineligible:

- `chantilly-near-paris`
- `lubeck-near-hamburg`
- `haarlem-near-amsterdam`
- `delft-near-rotterdam`
- `segovia-near-madrid`
- `el-escorial-near-madrid`
- `bergamo-near-milan`
- `wachau-valley-near-vienna`
- `drottningholm-near-stockholm`
- `uppsala-near-stockholm`
- `roskilde-near-copenhagen`
- `point-reyes-near-san-francisco`
- `olympic-near-seattle`
- `rocky-mountain-near-denver`
- `everglades-near-miami`
- `stanley-park-vancouver`
- `gatineau-park-near-ottawa`
- `royal-national-park-sydney`

### Records not eligible for a detail page

Two classes of records were excluded by the eligibility filter and
are not part of this pass:

- **16 partial records** — these carry
  `verificationStatus === "partial"` because Wikidata does not
  publish an `officialUrl` for the place; without an authoritative
  outbound source the detail-page template cannot anchor a
  "Sources and identity" block, so they are excluded
- **8 verified records that are image-free** — these are verified
  on Wikidata + officialUrl + wikidataId + coordinates but do not
  yet have a `VERIFIED_IMAGES` entry that passes the license +
  safety filter, so they cannot satisfy the "verified image"
  requirement of the detail-page template:
  - `richmond-park-london`
  - `phoenix-park-dublin`
  - `cascais-near-lisbon`
  - `muir-woods-near-san-francisco`
  - `pentland-hills-edinburgh`
  - `sitges-near-barcelona`
  - `indiana-dunes-near-chicago`
  - `fiordland-near-queenstown`

### Page structure

Every detail page renders the same fixed, server-rendered layout:

- **`PageHeader`** — place name, country, and the verification
  status label "Verified source record"
- **4-cell stats `<dl>`** — country, connected city, verification
  status, and the source identifier (Wikidata QID) — populated
  exclusively from existing record fields
- **Visual context** — the verified Wikimedia Commons image with
  full inline attribution (author, license, license URL, source
  file page); rendered as a plain `<img>` with explicit `width`,
  `height`, and `aspectRatio`, no `next/image`, no client
  components
- **Overview** — neutral prose derived from existing record
  fields and safe templates; no invented distances, travel times,
  ticket prices, opening hours, weather, hotel prices, attraction
  rankings, or accessibility claims
- **Connected cities** — links back to the connected city page
  and the country page using existing slugs
- **Sources and identity** — outbound links to the Wikidata
  entity, the `officialUrl`, and the Wikimedia Commons category
  (when present), each rendered as plain anchors
- **"What to verify before departure" checklist** — a fixed,
  non-promotional checklist that names the categories the reader
  must check with official sources before they travel; the list
  itself does not state any specific distance, time, price,
  schedule, or access claim
- **Planning tools** — internal links to the relevant connected
  city page and the country index, so the page is a planning
  anchor rather than a terminal page
- **Continue exploring** — internal links back to the
  `/nearby-weekend-places` directory and to the connected city's
  `weekend-trip` page

### Frozen disclaimer

Every detail page renders the frozen disclaimer:

> Records do not publish exact distances, travel times, transport
> schedules, opening hours, ticket prices, restaurant or hotel
> recommendations, attraction rankings, or live access status.

### Safety policy

Detail pages do not publish:

- exact distances or travel times from the connected city
- transport routes, schedules, ticket prices, or operator names
- opening hours or live access status
- weather, climate guidance, or seasonal recommendations
- hotel prices, hotel recommendations, or restaurant
  recommendations
- attraction rankings or tourism rankings
- safety claims or accessibility claims

All page copy is derived from existing record fields plus fixed
safe-template strings. Promotional wording ("best", "top",
"must-see", "hidden gem", "perfect", "safest", "cheapest",
"guaranteed", "exact distance", "exact travel time") is excluded
from the template.

### Structured data

Each page emits exactly two JSON-LD blocks:

- `WebPage`
- `BreadcrumbList`

No `Place`, `TouristAttraction`, `Event`, `Itinerary`, or `Offer`
schema is emitted. This keeps the pages aligned with the
source-record framing and avoids implying first-party place
authority.

### Directory integration

On the `/nearby-weekend-places` directory, every card whose slug
is in the curated 25 now has its card title linked to the
internal detail page at `/nearby-weekend-places/[slug]`. The
external "Official source" link is preserved as a separate
secondary link on the same card — it is not replaced. Cards whose
slug is not in the curated 25 continue to render with the
previous text-only title (no internal detail-page link).

### Weekend-trip integration

The same internal-link substitution is applied on the nearby
cards rendered inside `/cities/[city]/weekend-trip`. When a
nearby card's slug is in the curated 25, the card title links to
the internal detail page; otherwise the card renders exactly as
before, including its external official source link. The
existing max-6-cards cap on the weekend-trip nearby section is
unchanged.

### Sitemap

- +25 entries appended to the sitemap, one per detail page
- each entry uses priority `0.7` and `changefreq` `monthly`
- no other sitemap entry's priority or `changefreq` was changed

### Static page-count delta

- static page count: **2,919 -> 2,944** (+25)
- no new cities, no new countries, no new place records, no new
  images
- no new schemas beyond `WebPage` + `BreadcrumbList`
- no client components, no `fetch`, no new dependencies

### Validation script changes

`npm run validate:nearby-places` was extended to enforce the
detail-page eligibility invariant for every curated slug:

- each curated slug must exist in the nearby places dataset
- each curated slug's record must have
  `verificationStatus === "verified"`
- each curated slug's record must have a non-empty `wikidataId`
- each curated slug's record must have a non-empty `officialUrl`
- each curated slug must have a corresponding entry in
  `VERIFIED_IMAGES`

If any one of those checks fails for any curated slug, validation
fails and the build is blocked.

### Next steps

- expand to the remaining 19 eligible verified+imaged records in
  a future batch, after auditing this first 25-page release
  against the live build
- consider partial records only after Wikidata publishes an
  `officialUrl` for the place; until then they remain
  detail-page-ineligible by design
- for the 8 verified image-free records, detail pages remain
  blocked until a license-clean, safety-clean Commons image is
  available

## 2026-05-31: verified nearby weekend place detail pages — batch two

This batch promotes the 19 previously deferred eligible records
into rendered detail pages at `/nearby-weekend-places/[slug]`,
bringing the total curated detail-page count from **25 to 44**.

### Scope of this batch

- 19 new detail pages added at `/nearby-weekend-places/[slug]`
- Detail-page count: **25 -> 44**
- No new nearby records, no new images, no new routes, no new
  schemas, no new cities, no new countries
- No new client components, no `fetch`, no new dependencies

### Added slugs (alphabetical)

1. `bergamo-near-milan`
2. `chantilly-near-paris`
3. `delft-near-rotterdam`
4. `drottningholm-near-stockholm`
5. `el-escorial-near-madrid`
6. `everglades-near-miami`
7. `gatineau-park-near-ottawa`
8. `haarlem-near-amsterdam`
9. `lubeck-near-hamburg`
10. `olympic-near-seattle`
11. `point-reyes-near-san-francisco`
12. `rocky-mountain-near-denver`
13. `roskilde-near-copenhagen`
14. `rottnest-island-near-perth`
15. `royal-national-park-sydney`
16. `segovia-near-madrid`
17. `stanley-park-vancouver`
18. `uppsala-near-stockholm`
19. `wachau-valley-near-vienna`

### Eligibility criteria

The eligibility criteria are unchanged from batch one: a record
qualifies for a detail page only when it carries
`verificationStatus === "verified"` together with a non-empty
`officialUrl`, a non-empty `wikidataId`, resolvable coordinates,
a verified Wikimedia Commons image that passes the license and
safety filter, a resolvable country, a resolvable connected city,
resolvable outbound sources, and a neutral summary derived from
record fields plus safe-template strings.

All 19 slugs in this batch were re-verified against those criteria
before inclusion. None were promoted on the basis of the earlier
deferred-list snapshot alone.

### Records still excluded

The same two classes of records remain excluded from detail-page
rendering after batch two:

- **16 partial records** — these carry
  `verificationStatus === "partial"` because Wikidata does not
  publish an `officialUrl` for the place; without an authoritative
  outbound source the detail-page template cannot anchor a
  "Sources and identity" block, so they are excluded
- **8 verified-but-image-free records** — these are verified on
  Wikidata + officialUrl + wikidataId + coordinates but do not yet
  have a `VERIFIED_IMAGES` entry that passes the license + safety
  filter, so they cannot satisfy the "verified image" requirement
  of the detail-page template:
  - `richmond-park-london`
  - `phoenix-park-dublin`
  - `cascais-near-lisbon`
  - `muir-woods-near-san-francisco`
  - `pentland-hills-edinburgh`
  - `sitges-near-barcelona`
  - `indiana-dunes-near-chicago`
  - `fiordland-near-queenstown`

### No code changes required per slug

The detail-page template, the `/nearby-weekend-places/[slug]`
route, the sitemap generator, the `/nearby-weekend-places`
directory integration, the `/cities/[city]/weekend-trip` nearby
integration, and the `validate:nearby-places` validator are all
generic. They read from the curated slug list at build time and
require no per-slug code changes. Appending the 19 slugs to
`NEARBY_WEEKEND_PLACE_DETAIL_SLUGS` is the only code change made
in this batch.

### Sitemap delta

- +19 detail entries appended to the sitemap, one per new
  detail page
- each entry uses priority `0.7` and `changefreq` `monthly`,
  matching the batch-one entries
- total nearby-weekend-place detail entries in the sitemap:
  **25 -> 44**
- no other sitemap entry's priority or `changefreq` was changed

### Static page-count delta

- static page count: **2,944 -> 2,963** (+19)
- no new cities, no new countries, no new place records, no new
  images
- no new schemas beyond the existing `WebPage` + `BreadcrumbList`
  blocks already emitted by the detail-page template

### Validation results

- `npm run validate:nearby-places` — **PASS**; 68 records plus
  the 44 curated detail-page rules all clean
- `npm run validate:media` — **PASS**
- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — emits `/nearby-weekend-places/[slug]` as
  Static-prerendered for all 44 slugs

### Next steps

- audit batch two against the same 16-dimension framework used
  for batch one, once the live build is observed
- partial records remain ineligible until Wikidata publishes an
  `officialUrl` for the place
- image-free verified records remain ineligible until a
  license-clean, safety-clean Wikimedia Commons image is found

## 2026-05-31: nearby weekend places by city pages

This section documents a new per-city index surface that sits
between the city profile page and the existing global
`/nearby-weekend-places` directory. The new surface re-uses the
existing curated nearby-weekend-place dataset and adds no new
records, no new images, no new cities, and no new countries.

### Route pattern

- New route: `/cities/[city]/nearby-weekend-places`
- One page is generated per connected city that has at least one
  nearby-weekend-place record in the curated dataset
- The route is fully static. `dynamicParams = false` and
  `generateStaticParams()` returns the full list of eligible
  city slugs at build time

### Page count

- 45 city pages added — one per connected city with at least
  one nearby place record
- No partial-record city pages are emitted in this batch; a
  city only becomes eligible once at least one record resolves
  through `getNearbyWeekendPlacesForCity` against the curated
  dataset

### Eligibility rules

A city qualifies for a per-city index page only when both of
these conditions hold:

- the city slug resolves through `getCityBySlug` against the
  curated `cities.ts` registry
- the city slug has at least one nearby-weekend-place record
  attached via `getNearbyWeekendPlacesForCity(citySlug)`, which
  is gated by the `hasNearbyWeekendPlacesForCity(citySlug)`
  helper used in `generateStaticParams`

Cities that exist in `cities.ts` but have no nearby-place
records do not get a page. Nearby records that exist in the
dataset but whose connected city slug does not resolve through
`getCityBySlug` are not exposed by this route.

### Eligible city slugs (alphabetical)

1. `amsterdam`
2. `auckland`
3. `barcelona`
4. `berlin`
5. `boston`
6. `brussels`
7. `chicago`
8. `copenhagen`
9. `denver`
10. `dublin`
11. `edinburgh`
12. `frankfurt`
13. `hamburg`
14. `helsinki`
15. `lisbon`
16. `london`
17. `lyon`
18. `madrid`
19. `manchester`
20. `marseille`
21. `melbourne`
22. `miami`
23. `milan`
24. `munich`
25. `new-york`
26. `ottawa`
27. `oxford`
28. `paris`
29. `perth`
30. `porto`
31. `prague`
32. `quebec-city`
33. `queenstown`
34. `rome`
35. `rotterdam`
36. `san-francisco`
37. `seattle`
38. `sheffield`
39. `stockholm`
40. `sydney`
41. `the-hague`
42. `toronto`
43. `vancouver`
44. `vienna`
45. `washington-dc`

### Local-first positioning

The per-city pages are positioned as a research checklist for
readers planning a short break from their own home city, not
as a tourism guide or itinerary builder. The framing follows
the platform's local-first stance:

- start from your own city — each page is anchored at the
  connected city, not at the destination
- short breaks close to home — the surface frames the records
  as planning candidates for short trips out of the anchor city
- planning candidates not route instructions — the page
  surfaces candidate places to research, not how to get there
- verify with official sources — every record links out to its
  `officialUrl` plus the Wikidata identifier so the reader can
  confirm operating details against the authoritative source
  before booking or travelling

### Safety policy

The per-city pages inherit the platform's standard nearby-place
safety policy and do not publish any of the following:

- exact distances between the anchor city and the candidate
  places
- travel times by car, train, bus, ferry, or any other mode
- transport routes, schedules, ticket prices, or operator
  recommendations
- opening hours, seasonal closure dates, or last-entry times
- weather, climate-window, or "best time to visit" claims
- hotel prices, hotel recommendations, restaurant prices, or
  restaurant recommendations
- attraction rankings, "top day trip" lists, "must-see" claims,
  or other promotional framing
- route advice or driving directions

The page includes the platform's standard negative disclaimer
block making each of these exclusions explicit, in line with
the disclaimer pattern already used on the weekend-trip page.

### Structured data policy

Each per-city page emits exactly two JSON-LD blocks alongside
the page-level content:

- a `WebPage` block pointing at the canonical per-city URL
- a `BreadcrumbList` block following the canonical breadcrumb
  shape Home -> Cities -> {city.name} -> Nearby weekend places

The record list itself is emitted as an unordered `ItemList`,
where each `ListItem` points at `/nearby-weekend-places/<slug>`
when a curated detail page exists for the record and otherwise
at the `/nearby-weekend-places#<slug>` fragment on the global
directory. No additional schema types are emitted: no `Place`,
no `TouristAttraction`, no `Event`, no `Itinerary`, no `Offer`,
no `ImageObject`. The per-card status label is restricted to
the three frozen verification labels already used elsewhere
on the platform: "Verified source record", "Partially verified
source record", and "Pending detailed verification".

### Reverse links added

To make the new surface reachable from existing pages without
introducing any new navigation components, three reverse links
were added. Each reverse link is gated by
`hasNearbyWeekendPlacesCityPage` so it only renders when the
target city has a per-city page:

- **City profile page** (`/cities/[city]`) — a new `LinkCard`
  is rendered between the existing weekend-trip card and the
  cost-of-living card, with neutral copy that describes the
  target as a research checklist rather than a distance,
  transport, or ranking guide
- **Weekend-trip page** (`/cities/[city]/weekend-trip`) — a
  single clear link is added inside the existing
  "Nearby weekend places to research" section, gated by the
  same `nearbyPlaces.length > 0` condition that already
  guards that section
- **Global directory** (`/nearby-weekend-places`) — a small
  secondary link is added inside each "Nearby places by
  connected city" article, immediately under the existing
  `cityRoute` heading, pointing to the new per-city route

No other navigation surface was modified.

### Sitemap delta

- +45 entries appended to the sitemap, one per eligible city
- each entry uses priority `0.72` and `changeFrequency`
  `monthly`, matching the visual-guide priority used elsewhere
  on the platform
- each entry's `lastModified` is taken from the connected
  city's `lastUpdated` field
- no other sitemap entry's priority or `changeFrequency` was
  changed

### Static page-count delta

- static page count: **2,963 -> 3008** (+45)
- no new cities, no new countries, no new place records, no
  new images, no new client components, no new dependencies
- no new schemas beyond the `WebPage` + `BreadcrumbList` +
  unordered `ItemList` blocks described above

### Validation results

- `npm run validate:nearby-places` — **PASS**
- `npm run validate:media` — **PASS**
- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — emits
  `/cities/[city]/nearby-weekend-places` as Static-prerendered
  for each of the 45 eligible city slugs

### Next steps

- audit the per-city pages against the same audit framework
  already applied to the global directory and the curated
  detail pages
- expand nearby records to additional cities only after source
  verification on Wikidata, including a resolvable
  `officialUrl` and a license-clean, safety-clean image where
  the platform's detail-page template is the eventual target
- consider partial-record city pages only after `officialUrl`
  resolution for the underlying records, so each per-city
  page can continue to anchor every card against an
  authoritative outbound source

## 2026-05-31: nearby weekend places local recreation photo coverage

This pass closes the remaining image gap on the nearby weekend
places dataset by adding verified imagery for every record that
was previously text-only. The scope is strictly imagery: no new
records, no new routes, no sitemap growth, no schema changes,
no client-side fetching, and no promotion of any record's
`verificationStatus`.

### Coverage delta

- records attempted: 14 (the previously image-free records)
- images added: 14 of 14 (full coverage)
- records still image-free: 0
- skip reasons: 0 (no records remain image-free)

The `VERIFIED_IMAGES` dictionary now holds 68 entries, matching
the full 68-record nearby-weekend-places dataset one-for-one.

### Resolution strategy

The resolution loop followed the same source policy already in
force for the surrounding nearby-place imagery:

- the first attempt for each record fetched the Wikidata `P18`
  image and ran the standard attribution / license / safety
  filter; the candidate was rejected and replaced whenever any
  filter failed
- when the `P18` candidate was rejected, the loop fell back to
  the record's Commons category via Wikidata `P373` and
  iterated up to 8 candidates per record under the same strict
  filter
- 9 of the 14 newly imaged records were resolved through the
  Commons-category fallback (the original `P18` candidate did
  not pass the filter); the remaining 5 resolved on the first
  `P18` candidate

### Source policy (unchanged)

Source acceptance was restricted to:

- Wikidata `P18`
- Commons category `P373`
- Commons `imageinfo` API

No Google Images, no AI-generated imagery, no random URLs, no
tourism-board substitutes, no blogs, no review platforms, and
no social media were accepted at any point in the loop.

### License policy (unchanged)

License acceptance was restricted to Public domain, CC0,
CC BY, and CC BY-SA, with regional suffixes permitted. The
following were rejected on sight: NC, ND, FAL, GFDL, generic
"Attribution", and any candidate whose license could not be
resolved against the Commons `imageinfo` payload.

### License distribution across the 14 new entries

- CC BY-SA 4.0 ×4
- CC BY-SA 3.0 ×3
- CC BY 4.0 ×3
- CC BY-SA 2.0 ×2
- CC BY 2.0 ×1
- CC0 ×1

### Image subject distribution across the 14 new entries

Subjects were selected against the recreation-priority list
already used elsewhere in the nearby-weekend-places dataset:

- national park landscape ×2
- regional park landscape ×1
- public park ×1
- public garden ×1
- forest trail ×2
- waterfront ×2
- beach ×1
- sea coast ×1
- mountain ×1
- historic town exterior ×1
- scenic public space ×1

### Per-slug summary

| slug | subject | author | license |
| --- | --- | --- | --- |
| richmond-park-london | public garden | Diliff | CC BY-SA 3.0 |
| phoenix-park-dublin | public park | N Chadwick | CC BY-SA 2.0 |
| rheingau-near-frankfurt | scenic public space | DXR | CC BY-SA 4.0 |
| ghent-near-brussels | historic town exterior | Mario Falcetti | CC BY 4.0 |
| cascais-near-lisbon | waterfront | swissbert from Switzerland | CC0 |
| muir-woods-near-san-francisco | forest trail | PeteBobb | CC BY-SA 3.0 |
| waiheke-island-near-auckland | beach | ShakyIsles | CC BY-SA 4.0 |
| fiordland-near-queenstown | national park landscape | Ron Knight | CC BY 2.0 |
| pentland-hills-edinburgh | regional park landscape | Sandy Gemmill | CC BY-SA 2.0 |
| beaujolais-near-lyon | forest trail | Fibois 69 | CC BY-SA 4.0 |
| sitges-near-barcelona | waterfront | Werner Lang / Wela49 | CC BY-SA 3.0 |
| hudson-valley-near-new-york | mountain | Levineuwirth | CC BY-SA 4.0 |
| cape-cod-near-boston | sea coast | Kevin M. Gill | CC BY 4.0 |
| indiana-dunes-near-chicago | national park landscape | Indianadunes | CC BY 4.0 |

### UI impact

The existing conditional `<figure>` render on every
nearby-weekend-place surface now automatically renders the new
images on the 14 previously text-only cards. No UI code change
was required because every surface was already
image-conditional:

- `/nearby-weekend-places` — global directory
- `/nearby-weekend-places/[slug]` — curated detail pages
- `/cities/[city]/weekend-trip` — the nearby section inside the
  weekend-trip page
- `/cities/[city]/nearby-weekend-places` — the per-city page

### Verification status policy

No record's `verificationStatus` changed in this pass. Partial
records that gained an image remain partial. Verified records
that gained an image remain verified. Image presence is not a
substitute for source verification and is not used as a signal
for promoting a record's status.

### Detail-page policy

`NEARBY_WEEKEND_PLACE_DETAIL_SLUGS` is unchanged in this task.
Newly imaged verified records may become detail-page candidates
in a future expansion, but partial records — including
`rheingau-near-frankfurt`, `ghent-near-brussels`,
`beaujolais-near-lyon`, `hudson-valley-near-new-york`,
`cape-cod-near-boston`, and `waiheke-island-near-auckland` —
remain ineligible regardless of image presence until their
underlying `officialUrl` resolves on Wikidata.

### Surface delta

- no new routes
- no sitemap growth
- no schema changes
- no client-side fetching
- static page count unchanged

### Validation results

- `npm run validate:nearby-places` — **PASS** (68 records,
  68 `VERIFIED_IMAGES` entries, 44 curated detail rules clean)
- `npm run validate:media` — **PASS**
- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — clean

### Next steps

- audit the expanded nearby-place photo coverage against the
  same audit framework already applied to the rest of the
  nearby-weekend-places dataset
- optionally expand detail pages to the 8 newly imaged verified
  candidates after that audit:
  `richmond-park-london`, `phoenix-park-dublin`,
  `cascais-near-lisbon`, `muir-woods-near-san-francisco`,
  `pentland-hills-edinburgh`, `sitges-near-barcelona`,
  `indiana-dunes-near-chicago`, `fiordland-near-queenstown`
- partial records remain ineligible for detail pages until
  `officialUrl` resolves on Wikidata

## 2026-05-31: community photo submission model (foundation only)

- No upload UI added. No public community photos rendered. No API routes
  added. No storage / auth / DB integration. No new package dependencies.
- Types defined in /types/community-media.ts: CommunityPhotoSourceType,
  CommunityPhotoSubmissionStatus, CommunityPhotoModerationDecision,
  CommunityPhotoSafetyFlag (18 values), CommunityPhotoVisibility,
  CommunityPhotoAttachmentTargetType, CommunityPhotoLicenseIntent,
  CommunityPhotoReviewPriority, plus CommunityPhotoSubmission,
  CommunityPhotoPublicRecord, CommunityPhotoModerationRecord,
  CommunityPhotoPolicy, CommunityPhotoValidationResult interfaces.
- Policy helpers in /lib/community-media/policy.ts: getCommunityPhotoPolicy,
  getCommunityPhotoStatusLabel, getCommunityPhotoSourceLabel,
  getCommunityPhotoSafetyFlagLabel,
  getCommunityPhotoVisibilityForStatus, canCommunityPhotoBePublic,
  requiresModeration, isUserUploadedSource, isVerifiedSource,
  getDefaultCommunityPhotoReviewPriority, shouldBlockAutoApproval,
  getCommunityPhotoHighRiskFlags. All pure / synchronous / server-safe.
- Validation helpers in /lib/community-media/validation.ts:
  validateCommunityPhotoSubmissionDraft, validateCommunityPhotoTarget,
  validateCommunityPhotoFileMetadata,
  validateCommunityPhotoRightsConfirmation,
  validateCommunityPhotoModerationReadiness, and
  validateCommunityPhotoPublicRecord. Each returns
  { ok, errors[], warnings[] }.
- Verified-source media (NearbyPlaceImage, VERIFIED_IMAGES,
  PlaceHeroImage, etc.) untouched. The new "verified_source" tag in
  CommunityPhotoSourceType is for future-UI tab parity only and does NOT
  bridge to the existing verified media catalog.
- High-risk flag set: child_visible, private_person_main_subject,
  personal_information, violence_or_disturbing, hate_or_extremism,
  nudity_or_sexual_content, copyright_risk, manipulated_or_ai_generated.
  These block auto-approval.
- Public visibility derives from status (only "approved" -> "public").
- Static page count unchanged.
- Validation results: npm run validate:nearby-places PASS;
  npm run validate:media PASS; npm run typecheck clean; npm run lint clean;
  npm run build produces the prior 3,008 static pages with no additions.
- Roadmap detail in /docs/community-media-roadmap.md.
- Next step: design the upload + moderation API surface in a separate task.

## 2026-05-31: city and country coverage batch four

### Scope

This batch expands the city catalog by 49 records across 21 existing
countries. No new countries were added. The geographic scope was
explicitly limited per spec to the EU, the United Kingdom, Ireland,
the United States, Canada, Australia, and New Zealand.

### Counts

- city count delta: 298 -> 347 (+49)
- country count: 86 (unchanged)
- country `citySlugs[]` arrays updated: 21 (one append per slug per
  country, totaling 49 appended slugs)
- verified Wikimedia Commons hero images added: 49 (100% coverage of
  the new batch)
- skipped due to image failure: 0

### Eligibility filtering

- 70 initial candidates were drawn from the user-recommended pool.
- 21 candidates were dropped as out of scope for this batch
  (India, Malaysia, Japan, South Africa, Thailand, Taiwan, Serbia),
  leaving 49 eligible.
- 4 additional candidates were skipped explicitly:
  - `lille` appeared twice in the raw spec (duplicate).
  - `erfurth` was flagged as a typo of `erfurt` and skipped.
  - `munster` is ambiguous between Muenster (Germany) and Munster
    (India) and was skipped pending disambiguation.
  - `hamilton-nz` is ambiguous against Hamilton, Ontario and was
    skipped pending disambiguation in a future batch.

### Per-country distribution (21 countries, 49 cities)

- united-states 7
- france 5
- australia 5
- united-kingdom 4
- italy 4
- ireland 2
- germany 2
- spain 2
- portugal 2
- belgium 2
- netherlands 2
- romania 2
- new-zealand 2
- finland 1
- denmark 1
- estonia 1
- lithuania 1
- slovakia 1
- poland 1
- bulgaria 1
- canada 1

### Full alphabetical list of new slugs

aalborg, aberdeen, ann-arbor, aveiro, ballarat, bendigo, boise,
breda, dundee, essen, faro, karlsruhe, klaipeda, kosice, launceston,
lecce, liege, lille, limerick, louisville, lublin, namur, nantes,
nelson, new-orleans, oklahoma-city, omaha, oradea, oulu,
palmerston-north, parma, regina, reims, rouen, santander, siena,
southampton, tartu, tilburg, timisoara, toowoomba, tours, townsville,
trieste, tucson, varna, vigo, waterford, york.

### Verified image strategy

The hero image for each new city was resolved through the same
pipeline already used by the nearby photo coverage pass:

1. Wikidata QID lookup for the city.
2. Wikidata P18 (image) on the city item.
3. Commons category P373 fallback if P18 is missing or unsuitable.
4. Commons imageinfo API for canonical file metadata.
5. Strict filter for license, attribution, and subject safety.

### Subject distribution of the 49 hero images

- city_skyline 27
- river_or_harbor 9
- cathedral_or_landmark_exterior 7
- public_square 4
- scenic_public_space 2

### License distribution of the 49 hero images

- CC BY-SA 4.0 x14
- CC BY-SA 3.0 x12
- CC BY 2.0 x6
- CC BY-SA 2.0 x5
- CC BY 3.0 x3
- Public domain x3
- CC0 x2
- CC BY 2.5 x2
- CC BY 4.0 x1
- CC BY-SA 2.5 x1

Zero entries used NC, ND, FAL, GFDL, "Attribution"-only, or unknown
licenses.

### Data safety

No exact population, cost, rent, salary, crime, transport,
healthcare, airport, visa, weather, event, or tourism-ranking data
was added. Each new seed uses the existing `buildNeutralCitySeed`
helper, which tags module data as "Pending integration" via
`NEUTRAL_MODULE_FACTS`. All scoring numbers attached to the new
seeds are structural defaults, not editorial claims.

### Local-first future use

This batch deliberately prioritizes mid-sized regional cities with
strong nearby-park, waterfront, coastline, mountain, or historic-town
potential. The intent is that a future curated batch of nearby
weekend places can hang off these new city anchors without needing
further base-city expansion.

### Automatic page impact

- +49 `/cities/[city]` pages.
- +N module pages per new city if generated by the existing module
  `flatMap` inside `getAllIndexableRoutes`.
- +49 sitemap entries via the existing city iteration.
- NO arrival, weekend-trip, visual-guide, moving-to, nearby-places,
  or comparison pages were added in this batch.

### Validation results

- `npm run validate:nearby-places` -- PASS (68 records, 68/68 image
  coverage unchanged)
- `npm run validate:media` -- PASS (cities: 335 hero / 367 total
  on 347 known slugs, project-wide hero coverage rose from
  286 / 298 to 335 / 347; countries: 86 hero / 106 total unchanged)
- `npm run validate:community-media` -- PASS (28 enum values
  labeled, unchanged)
- `npm run typecheck` -- clean
- `npm run lint` -- clean
- `npm run build` -- clean (3,351 / 3,351 static pages)

### Static page count delta

- previous baseline: 3,008
- new total: 3,351 (+343 = 49 new `/cities/[city]` profile pages
  + 294 `/{moduleSlug}/[city]` module pages via the existing
  6-module flatMap in `getAllIndexableRoutes()`)

### City hero coverage delta

- before batch four: 286 / 298 city hero records
- after batch four: 335 / 347 city hero records
- per-batch additions: 49 / 49 new cities ship with a verified
  Wikimedia hero (100% of the new slugs)

### Out-of-scope skipped candidates (21)

The user-recommended pool included 21 candidates from countries
outside the strict batch-four scope. They were dropped in the
eligibility funnel and are NOT in the registry. Listed
alphabetically by country, slug:

- **India**: ahmedabad, chandigarh, coimbatore, kochi, lucknow,
  surat
- **Japan**: kobe, nara, yokohama
- **Malaysia**: george-town, ipoh, johor-bahru, kota-kinabalu,
  kuching, malacca
- **Serbia**: novi-sad
- **South Africa**: bloemfontein, port-elizabeth
- **Taiwan**: tainan
- **Thailand**: chiang-rai, phuket

Additionally these ambiguous / typo slugs were dropped without
being added: `erfurth` (typo of `erfurt`; skipped pending
clarification), `munster` (ambiguous Münster DE vs Munster IN),
`hamilton-nz` (ambiguous with `hamilton`/`london-ontario`-style
disambiguation policy; deferred).

### Next steps

- Audit batch four against the existing city-data and image-coverage
  audit framework.
- Plan a future curated batch of nearby weekend places anchored to
  the 49 new city slugs added here.

## 2026-05-31: nearby weekend places for batch four cities

### Scope

This task adds exactly 49 new nearby weekend place records to
`lib/data/nearby-places.ts`, one per batch-four city. Every
batch-four city now returns at least one place from
`getNearbyWeekendPlacesForCity`. The 68 pre-existing nearby place
records are preserved unchanged. The curated detail-slug list
`NEARBY_WEEKEND_PLACE_DETAIL_SLUGS` is UNCHANGED in this task.

### Counts

- nearby place records total: 68 -> 117 (+49)
- VERIFIED_IMAGES entries: 68 -> 117 (+49, one per new record)
- image coverage on the new batch: 49 / 49 = 100%
- batch-four cities covered: 49 / 49

### VerificationStatus distribution (new batch only)

- verified: 33 (Wikidata QID + officialUrl from P856 + coordinates
  from P625 + verified Commons image all present)
- partial: 16 (QID + coordinates + verified image, but no P856
  officialUrl on Wikidata)
- needs_review: 0

This follows the existing nearby-place model rules. No
needs_review records were added.

### Full alphabetical list of the 49 batch-four cities covered

aalborg, aberdeen, ann-arbor, aveiro, ballarat, bendigo, boise,
breda, dundee, essen, faro, karlsruhe, klaipeda, kosice, launceston,
lecce, liege, lille, limerick, louisville, lublin, namur, nantes,
nelson, new-orleans, oklahoma-city, omaha, oradea, oulu,
palmerston-north, parma, regina, reims, rouen, santander, siena,
southampton, tartu, tilburg, timisoara, toowoomba, tours, townsville,
trieste, tucson, varna, vigo, waterford, york.

### Per-country distribution of the 49 new nearby places

- united-states 7
- france 5
- australia 5
- united-kingdom 4
- italy 4
- ireland 2
- germany 2
- spain 2
- portugal 2
- belgium 2
- netherlands 2
- romania 2
- new-zealand 2
- finland 1
- denmark 1
- estonia 1
- lithuania 1
- slovakia 1
- poland 1
- bulgaria 1
- canada 1

Total: 49.

### License distribution of the 49 new verified images

- CC BY-SA 3.0 x17
- CC BY-SA 4.0 x11
- Public domain x9
- CC BY 2.0 x7
- CC BY-SA 3.0 de x1
- CC0 x1
- CC BY 4.0 x1
- CC BY-SA 3.0 RO x1
- CC BY-SA 2.0 x1

Zero entries used NC, ND, FAL, GFDL, "Attribution"-only, or
unknown licenses.

### Subject distribution of the 49 new image subjects

All 49 images are scenic outdoor public subjects: national park
landscapes, regional park landscapes, cultural sites, waterfronts,
lakes, mountains, forests, historic town exteriors, and scenic
public spaces. Zero portraits, hotel interiors, restaurant
interiors, private interiors, identifiable crowds, or political
content.

### Source strategy

The Wikimedia image resolution pipeline mirrors the existing
nearby-place verification pass exactly:

1. Wikidata QID lookup for the candidate place.
2. Wikidata P18 (image) on the place item.
3. Commons category P373 fallback if P18 is missing or unsuitable.
4. Commons imageinfo API for canonical file metadata.
5. Strict filter for license, attribution, and subject safety.

For each new VERIFIED_IMAGES entry:

- `src` always starts with `https://upload.wikimedia.org/`.
- `sourceUrl` always starts with
  `https://commons.wikimedia.org/wiki/File:`.
- `source` literal is `"wikimedia-commons"` (matches the existing
  nearby-places convention).
- `alt` follows the template:
  `Verified Wikimedia Commons image of {placeName}, {countryName}`.
- `attributionText` follows the template:
  `{author} / Wikimedia Commons, {license}`.
- `verifiedAt` is `"2026-05-31"`.

### Bendigo resolution note

One bendigo record was resolved on retry. The primary candidate
Mount Alexander Regional Park had no clear Wikidata entity that
matched the "regional park" framing. Hepburn Regional Park was
also considered but lacked Wikidata P18, P373, P625, and P856.
The retry pass identified Castlemaine Diggings National Heritage
Park (Q5050535) with a CC BY-SA 3.0 Commons-category image and
an `officialUrl` taken from Parks Victoria (the canonical
management agency).

### PlaceSeed shape and safety conventions

- Each new seed uses the existing `PlaceSeed` shape exactly. If
  a field in the source JSON is null, it is omitted from the seed
  (no invented data).
- `coordinateSource = "wikidata"` for every record where lat/lon
  is present (all 49).
- `distanceBand = "regional"` (a qualitative bucket per the
  existing convention, NOT an exact distance).
- `travelModeHint = "mixed"` (a qualitative bucket per the
  existing convention, NOT an exact travel time).
- Each `summary` is the per-record sentence pre-verified in
  `/tmp/batch-four-nearby-resolved.json` -- safe wording, one
  neutral sentence per record, each ending with the canonical
  disclaimer: "Verify access, opening status, transport, and
  seasonal conditions with official sources before departure."

### Safety policy

The new records contain ZERO fake distances, travel times,
routes, ticket prices, opening hours, weather data, hotel prices,
attraction rankings, restaurant or hotel recommendations,
accessibility claims, or official-tourism claims.

### UI impact (no code change required)

Every nearby-places UI surface is already image-conditional and
gated on `getNearbyWeekendPlacesForCity`, so no code changes are
needed for the new records to surface:

- `/nearby-weekend-places` directory: the 49 new records now
  appear in the by-city, by-country, and by-category sub-indexes.
- `/cities/[city]/weekend-trip` nearby section: each of the 49
  batch-four cities now has nearby cards.
- `/cities/[city]/nearby-weekend-places` city hubs: 49 new pages
  are auto-generated by the existing
  `getAllCitiesWithNearbyWeekendPlaces` helper, because each
  batch-four city now has at least one connected nearby place.
  The route already exists.
- `/nearby-weekend-places/[slug]` curated detail pages:
  `NEARBY_WEEKEND_PLACE_DETAIL_SLUGS` is UNCHANGED in this task
  (still 44 entries). None of the 49 new records were added to
  the curated detail list.

### Detail-page candidates for a future controlled batch

33 verified records meet the eligibility criteria for the curated
detail-page list (QID + officialUrl + coordinates + verified
image). These are listed by city and deferred to a future
controlled task. They are intentionally NOT added in this batch
to keep this task narrowly scoped.

### Sitemap impact

- +49 city-hub sitemap entries. The existing per-city iteration
  in `app/sitemap.ts` auto-picks them up because each new
  batch-four city now resolves true via
  `hasNearbyWeekendPlacesCityPage`.
- No new detail-page sitemap entries this task.

### Static page count delta

- previous baseline: 3,351
- new total: 3,400 (+49 from the 49 newly-eligible city-specific
  `/cities/[city]/nearby-weekend-places` hub pages)

### Validation results

- `npm run validate:nearby-places` -- PASS (117 records clean)
- `npm run validate:media` -- PASS (unchanged)
- `npm run validate:community-media` -- PASS (unchanged)
- `npm run typecheck` -- clean
- `npm run lint` -- clean
- `npm run build` -- clean

## 2026-05-31: verified nearby place detail pages for batch four records

This task promotes the 33 batch-four nearby weekend place records
that meet the curated detail-page eligibility criteria into
`NEARBY_WEEKEND_PLACE_DETAIL_SLUGS`, expanding the curated
detail-page roster from 44 to 77 entries.

### Scope

- 33 new curated detail pages are now rendered at
  `/nearby-weekend-places/[slug]`.
- Total curated detail-page count: 44 -> 77.
- The detail-page template, route, sitemap integration, and
  validator are already generic. Appending slugs to
  `NEARBY_WEEKEND_PLACE_DETAIL_SLUGS` is the only change.
- No new nearby records were added in this task.
- No new images were added in this task.
- No new structured-data types were introduced; detail pages
  continue to emit only `WebPage` + `BreadcrumbList`.

### Eligibility criteria (unchanged)

A nearby weekend place is eligible for a curated detail page only
when ALL of the following hold:

- `verified === true`
- `officialUrl` is set (from a stable public-authority Wikidata
  source or equivalent)
- `wikidataId` is set
- coordinates are present
- a verified image entry exists in `VERIFIED_IMAGES`
- the country resolves through the country index
- the connected city resolves through the cities index

Each of the 33 promoted slugs was re-verified against all seven
criteria before inclusion in this batch. They are the verified 33
of the 49 batch-four nearby records added in the previous feat
commit.

### Slugs promoted in this batch (alphabetical, 33)

- apuseni-natural-park-near-oradea
- atlantic-islands-of-galicia-national-park-near-vigo
- black-forest-national-park-near-karlsruhe
- boise-national-forest-near-boise
- bunya-mountains-national-park-near-toowoomba
- cairngorms-national-park-near-aberdeen
- castello-di-torrechiara-near-parma
- castlemaine-diggings-national-heritage-park-near-bendigo
- champagne-hillsides-houses-and-cellars-near-reims
- chateau-de-chenonceau-near-tours
- citadel-of-namur-near-namur
- cliffs-of-moher-near-limerick
- curonian-spit-national-park-near-klaipeda
- etretat-near-rouen
- glamis-castle-near-dundee
- grampians-national-park-near-ballarat
- hailuoto-near-oulu
- jean-lafitte-national-historical-park-near-new-orleans
- last-mountain-lake-national-wildlife-area-near-regina
- loonse-en-drunense-duinen-national-park-near-tilburg
- mammoth-cave-national-park-near-louisville
- nesebar-near-varna
- new-forest-national-park-near-southampton
- north-york-moors-national-park-near-york
- otranto-near-lecce
- parc-naturel-regional-de-briere-near-nantes
- picos-de-europa-national-park-near-santander
- roztocze-national-park-near-lublin
- saguaro-national-park-near-tucson
- slovak-paradise-national-park-near-kosice
- val-d-orcia-near-siena
- wichita-mountains-wildlife-refuge-near-oklahoma-city
- zollverein-coal-mine-industrial-complex-near-essen

### Records still excluded

- The 16 batch-four partial records (the difference between the
  49 batch-four nearby records and the 33 verified slugs promoted
  here) remain excluded from the curated detail list because they
  do not yet satisfy all seven eligibility criteria (most commonly
  missing a stable `officialUrl` from a public-authority Wikidata
  source).
- Older partial records from the original 68-record cohort (the
  previously documented 16 partials) remain excluded.
- The 8 previously identified verified-but-image-free records
  remain excluded.

### Safety policy (unchanged)

The detail pages introduced in this batch contain no fake
distances, travel times, routes, ticket prices, opening hours,
weather data, hotel prices, attraction rankings, restaurant or
hotel recommendations, accessibility claims, or official-tourism
claims. All content is sourced from the existing verified record
fields surfaced through the generic detail template.

### Sitemap impact

- +33 detail-route URLs at priority 0.7, monthly change frequency.
- Total `/nearby-weekend-places/[slug]` entries in the sitemap:
  44 -> 77.

### Static page count delta

- previous baseline: 3,400
- new total: 3,433 (+33 from the 33 newly promoted curated
  detail pages)

### Validator

The existing curated-slug rules in
`scripts/validate-nearby-places.py` automatically cover the 33
new entries. Each curated slug must be verified, must declare a
`wikidataId`, must declare an `officialUrl`, and must have an
entry in `VERIFIED_IMAGES`. All 33 promoted slugs satisfy these
four invariants, so no validator code change is required.

### Validation results

- `npm run validate:nearby-places` -- PASS (117 records and 77
  curated detail-slug rules clean)
- `npm run validate:media` -- PASS
- `npm run validate:community-media` -- PASS
- `npm run typecheck` -- clean
- `npm run lint` -- clean
- `npm run build` -- emits `/nearby-weekend-places/[slug]` as
  Static for all 77 slugs

### Future steps

- Audit the batch-four detail promotion once live for any
  rendering or metadata regressions.
- Revisit the partial records (batch-four and older) only after
  an `officialUrl` is verified from a stable public-authority
  source on Wikidata or equivalent. No partial record will be
  promoted before that condition is met.

## 2026-06-01: weekend trip pages for batch four cities

This task adds 49 new weekend-trip pages, one per batch-four
city. Every batch-four city now has weekend-trip coverage: the
batch-four weekend-trip count moves from 0 / 49 before this task
to 49 / 49 after this task. The site-wide weekend-trip page total
moves from 100 to 149.

### Scope

- 49 new `/cities/[city]/weekend-trip` pages auto-generated by
  the existing `generateStaticParams` iteration in the weekend-
  trip route.
- Pre-existing batch-four weekend-trip pages: 0 (none of the 49
  batch-four cities had a weekend-trip page before this commit).
- Total weekend-trip pages: 100 -> 149.
- No new arrival, visual-guide, moving-to, or summer-travel
  pages added in this task.
- No new images, no new sources, no new structured-data types.

### Cities covered (alphabetical, 49)

aalborg, aberdeen, ann-arbor, aveiro, ballarat, bendigo, boise,
breda, dundee, essen, faro, karlsruhe, klaipeda, kosice,
launceston, lecce, liege, lille, limerick, louisville, lublin,
namur, nantes, nelson, new-orleans, oklahoma-city, omaha,
oradea, oulu, palmerston-north, parma, regina, reims, rouen,
santander, siena, southampton, tartu, tilburg, timisoara,
toowoomba, tours, townsville, trieste, tucson, varna, vigo,
waterford, york.

### WeekendTripFocus distribution across the 49 new pages

- `culture_context`: 22 pages. Regional historic and cultural-
  context cities such as York, Reims, Siena, Limerick, Tartu,
  Kosice, Lublin, Timisoara, Oradea, Bendigo, and Ballarat.
- `visual_orientation`: 10 pages. Coastal and waterfront or
  otherwise scenic cities such as Aveiro, Faro, Klaipeda, Vigo,
  Santander, Oulu, Varna, Nelson, Townsville, and Launceston.
- `city_break`: 8 pages. Mid-sized city-break cities such as
  Trieste, Southampton, Dundee, Nantes, Lille, Karlsruhe, Ann
  Arbor, and Louisville.
- `general_weekend_planning`: 9 pages. Regional planning bases
  such as Tilburg, Aalborg, Boise, Oklahoma City, Omaha, Tucson,
  Regina, Toowoomba, and Palmerston North.
- `family_weekend`, `arrival_and_transport`, and
  `budget_planning`: 0 pages each. Those enum values exist and
  remain available, but they were not a natural fit for any
  batch-four city's character.

No new `WeekendTripFocus` enum values were introduced. All 49
new seeds resolve to one of the existing seven valid values.

### Local-first positioning

Every summary is derived through the existing weekend-trip
helper's neutral derivation. No itinerary, no route, no
distance, no travel time, no price, no weather data, and no
promotional wording. Each summary positions the city as a local-
first planning anchor and references the nearby weekend places
already added in the prior batch-four nearby pass.

### Nearby-place integration

Every one of the 49 batch-four cities now carries at least one
nearby weekend place (added in the prior batch-four nearby
pass). The weekend-trip page's "Nearby weekend places to
research" section is already gated on
`nearbyPlaces.length > 0`, so all 49 new pages render that
section automatically and link out to
`/cities/[city]/nearby-weekend-places` through the existing
`hasNearbyWeekendPlacesCityPage` gate.

### City profile reverse-link

The existing city-profile page's conditional `LinkCard` titled
"Weekend Trip Planning for {City}" gates on
`hasWeekendTripPage`. That conditional now resolves true for all
49 batch-four cities, so the reverse link flows automatically
without a profile-page edit.

### Weekend-trips directory

- `/weekend-trips` `ItemList` JSON-LD `numberOfItems` moves from
  100 to 149.
- The by-country grouped index automatically lists the new 49
  entries through the existing iteration.
- The global directory's stats `dl` now reports
  "Weekend guides: 149" after this commit.

### Sitemap delta

- +49 `/cities/[city]/weekend-trip` entries flow from the
  existing per-page iteration in `app/sitemap.ts`.
- No edit to `app/sitemap.ts` was required.

### Structured data

- No new structured-data types were introduced.
- Each weekend-trip page continues to emit `WebPage` plus
  `BreadcrumbList` from the existing template.
- The weekend-trips directory's `ItemList` is preserved.

### Image policy

- No new images.
- Each weekend-trip page reuses the existing city hero through
  `PlaceHeroImage`.
- The nearby section continues to draw from the existing nearby
  image catalog.
- Zero placeholder or fallback usage.

### Date convention

- A new `BATCH_4_UPDATED_DATE = "2026-06-01"` constant was
  introduced in `lib/data/weekend-trip.ts`.
- The `Seed` interface now accepts an optional per-seed
  `updatedDate` override (additive field). When absent the
  per-seed value falls back to `BATCH_1_UPDATED_DATE` through
  the seeds-to-pages map, preserving the existing 100 records'
  resolved dates without edits.
- The 49 new seeds carry
  `updatedDate: BATCH_4_UPDATED_DATE`. The original 100 seeds
  are unchanged and continue to resolve to
  `BATCH_1_UPDATED_DATE` through the fallback.

### Source convention

Each new seed inherits the existing `COMMON_SOURCES`
(`un-habitat`, `nasa-power`, `ipcc-urban`) plus one regional
extra:

- `eea-air` for UK, Ireland, and EU cities (34 new pages — UK 4
  + Ireland 2 + EU 28)
- `epa-naaqs` for United States cities (7 new pages)
- `canada-emergency` for Canada (1 new page)
- `triple-zero-au` for Australia (5 new pages)
- `nz-police-111` for New Zealand (2 new pages)

All source IDs are pre-registered in
`lib/data/sources/index.ts`. No new sources were added.

### Static page count delta

- previous baseline: 3,433
- new total: 3,482 (+49 from the 49 new
  `/cities/[city]/weekend-trip` pages auto-generated by the
  existing `generateStaticParams` iteration)

### Validation results

- `npm run validate:nearby-places` -- PASS (117 records and 77
  curated detail-slug rules unchanged)
- `npm run validate:media` -- PASS
- `npm run validate:community-media` -- PASS
- `npm run typecheck` -- clean
- `npm run lint` -- clean
- `npm run build` -- emits 3,482 / 3,482 pages

### Future steps

- Audit the batch-four weekend-trip pages once live for any
  rendering or metadata regressions.
- Consider adding visual-guide, arrival, or moving-to clusters
  for the most local-first-relevant batch-four entries in a
  future curated batch.

## 2026-06-01: visual guides for batch four cities

This pass extends the visual-guide cluster to cover every
batch-four city. Forty-nine new visual-guide pages were seeded
in `lib/data/visual-guides.ts`, one per batch-four city.
Before this commit, none of the 49 batch-four cities had a
visual-guide page (0 / 49 coverage). After this commit, every
batch-four city has a visual-guide entry (49 / 49 coverage).
The total visual-guide page count moves from 100 to 149.

### Coverage scope

- 49 new visual-guide pages — one per batch-four city.
- Pre-existing batch-four visual-guide pages: 0. None of the
  49 batch-four cities carried a visual-guide entry before
  this commit.
- Visual-guide total: 100 -> 149.

### Cities covered

The 49 new visual-guide pages, alphabetical:

aalborg, aberdeen, ann-arbor, aveiro, ballarat, bendigo,
boise, breda, dundee, essen, faro, karlsruhe, klaipeda,
kosice, launceston, lecce, liege, lille, limerick, louisville,
lublin, namur, nantes, nelson, new-orleans, oklahoma-city,
omaha, oradea, oulu, palmerston-north, parma, regina, reims,
rouen, santander, siena, southampton, tartu, tilburg,
timisoara, toowoomba, tours, townsville, trieste, tucson,
varna, vigo, waterford, york.

### VisualGuideFocus distribution

Every seed uses one of the seven existing `VisualGuideFocus`
enum values; no new enum members were introduced.

- `neighborhood_visual_context`: 14 — york, limerick, rouen,
  siena, parma, lecce, breda, kosice, lublin, timisoara,
  oradea, new-orleans, ballarat, bendigo
- `arrival_visual_context`: 13 — southampton, aberdeen,
  waterford, vigo, santander, faro, aveiro, trieste,
  klaipeda, varna, townsville, launceston, nelson
- `general_city_context`: 9 — reims, essen, tilburg,
  louisville, oklahoma-city, omaha, boise, tucson, regina
- `relocation_visual_context`: 7 — dundee, nantes, tours,
  karlsruhe, namur, liege, aalborg
- `remote_work_visual_context`: 4 — oulu, tartu, ann-arbor,
  palmerston-north
- `transport_visual_context`: 1 — lille
- `family_visual_context`: 1 — toowoomba
- Total: 49

### Local-first visual positioning

Every page is positioned as visual orientation rather than as
an attractions ranking or a live tourism guide. The existing
template's safe wording — directing readers to "verify access,
opening status, transport, weather, health, and safety details
with official or trusted current sources before departure" —
applies uniformly to all 49 new entries. No promotional
language, no exact distances, travel times, routes, prices,
opening hours, weather, event dates, safety rankings, or
accessibility claims appear in the seeds.

### Verified city hero image reuse

Every batch-four city already received a verified Wikimedia
Commons city hero during the earlier batch-four city
expansion (335 / 347 hero coverage). No new images were added
in this pass. The existing `PlaceHeroImage` flow renders the
verified hero automatically on each new visual-guide page.

### Nearby-place and weekend-trip integration

Because the prior batch-four passes added (a) at least one
nearby weekend place per batch-four city and (b) a
weekend-trip page per batch-four city, every one of the 49
new visual-guide pages will auto-link to
`/cities/[city]/nearby-weekend-places` (via
`hasNearbyWeekendPlacesCityPage`) and to
`/cities/[city]/weekend-trip` (via `hasWeekendTripPage`).
Cross-cluster linking is now complete for every batch-four
city.

### City profile reverse-link

The existing city-profile page's `hasVisualCityGuidePage`
conditional `LinkCard` for "Visual Guide to {City}" now
auto-renders on each of the 49 batch-four city profiles.
Zero code change was required.

### Visual-guides directory

The directory at `/visual-guides` keeps its existing layout.
- The `ItemList` JSON-LD `numberOfItems` rises 100 -> 149.
- The by-country grouped index automatically lists the new
  49 entries.
- The stats `dl` will read "Visual guides: 149" after this
  commit.

### Sitemap delta

- +49 `/cities/[city]/visual-guide` entries flow from the
  existing per-page iteration in `app/sitemap.ts`.
- No edit to `app/sitemap.ts` was required.

### Structured data

- No new structured-data types were introduced.
- Each new visual-guide page continues to emit `WebPage` plus
  `BreadcrumbList`.
- The directory continues to emit `WebPage` plus
  `BreadcrumbList` plus an unordered `ItemList`.

### Image policy

- No new images.
- Each visual-guide page reuses the existing verified city
  hero image.
- Nearby-place sections reuse the existing nearby image
  catalog.
- Zero placeholders, fallback images, or city-hero
  substitutes were added.

### Date convention

- A new `BATCH_4_UPDATED_DATE = "2026-06-01"` constant was
  introduced in `lib/data/visual-guides.ts`, alongside the
  existing `BATCH_1_UPDATED_DATE = "2026-05-25"`.
- The `Seed` interface now accepts an optional per-seed
  `updatedDate` override (additive field). When absent, the
  seeds-to-pages map falls back to `BATCH_1_UPDATED_DATE`,
  preserving the existing 100 records' resolved dates without
  edits.
- The 49 new seeds carry
  `updatedDate: BATCH_4_UPDATED_DATE`. The original 100
  seeds are unchanged and continue to resolve to
  `BATCH_1_UPDATED_DATE` through the fallback.

### Source convention

Each new seed inherits the existing `COMMON_SOURCES`
(`un-habitat`, `nasa-power`, `ipcc-urban`) plus one regional
extra. Tally across the 49:

- `eea-air` for UK, Ireland, and EU cities (34 new pages — UK
  4 + Ireland 2 + EU 28)
- `epa-naaqs` for United States cities (7 new pages)
- `canada-emergency` for Canada (1 new page)
- `triple-zero-au` for Australia (5 new pages)
- `nz-police-111` for New Zealand (2 new pages)

All source IDs are pre-registered in
`lib/data/sources/index.ts`. No new sources were added.

### Static page count delta

- previous baseline: 3,482
- new total: 3,531 (+49 from the 49 new
  `/cities/[city]/visual-guide` routes auto-generated by the
  existing `generateStaticParams` iteration)

### Validation results

- `npm run validate:nearby-places` -- PASS (117 records and 77
  curated detail-slug rules unchanged)
- `npm run validate:media` -- PASS
- `npm run validate:community-media` -- PASS
- `npm run typecheck` -- clean
- `npm run lint` -- clean
- `npm run build` -- emits 3,531 / 3,531 pages

### Future steps

- Audit the batch-four visual-guide pages once live for any
  rendering or metadata regressions.
- Consider arrival, moving-to, or summer-travel clusters for
  the most local-first-relevant batch-four entries in a
  future curated batch.




## 2026-06-02: batch five nearby weekend place expansion

This batch expands verified nearby weekend place coverage to 78
previously uncovered cities across the EU, UK, Ireland, USA,
Canada, Australia, and New Zealand. Each city already had a
city profile and a verified hero image; this pass gives every
one of them at least one local-first nearby place to anchor
weekend rest, day trips, and outdoor recreation. Coverage
breadth was prioritised over clustering: exactly one strong
place per city.

Every record is sourced the same way: a stable Wikidata QID,
the official-website URL from Wikidata `P856` (official park,
conservation, or government agency), `P625` coordinates, and a
verified Wikimedia Commons image resolved from the entity's
`P18` claim (or its `P373` Commons category) and checked
against the `validate:nearby-places` image rules. No image was
hand-picked without confirming author, license, dimensions,
and Commons provenance through the MediaWiki API.

### Places added

- Nearby weekend places: 117 -> 195 (+78).
- All 78 reach `verificationStatus: "verified"` (QID +
  `officialUrl` + coordinates + verified image).
- New connected cities: 78 (one place each). Cities with at
  least one nearby place: 94 -> 172.

### Detail pages added

- Curated detail slugs in
  [`lib/data/nearby-place-detail-pages.ts`](../lib/data/nearby-place-detail-pages.ts):
  77 -> 155 (+78).
- Every new slug satisfies the existing eligibility audit:
  `verificationStatus === "verified"`, a `wikidataId`, an
  `officialUrl`, `latitude`/`longitude`/`coordinateSource`, and
  a passing `VERIFIED_IMAGES` entry.

### Image coverage

- 100% of the 78 new places carry a verified Wikimedia Commons
  image (78 / 78). All `src` values are served from
  `upload.wikimedia.org`, all `sourceUrl` values point at
  `commons.wikimedia.org`, and all licenses are on the
  public-domain / CC0 / CC BY / CC BY-SA accept-list.

### Source coverage

- Wikidata QID: 78 / 78.
- `officialUrl` from Wikidata `P856`: 78 / 78 (national-park,
  state-park, regional-park, and conservation-agency sites such
  as the U.S. National Park Service, Parks Canada, SEPAQ,
  Queensland / NT / Tasmania park services, the UK national
  park authorities, ICNF, MITECO, and national park boards
  across the EU).
- `P625` coordinates: 78 / 78, `coordinateSource: "wikidata"`.

### City coverage impact

The 78 newly covered cities, alphabetical:

aarhus, aix-en-provence, atlanta, austin, baltimore, bari,
birmingham, bonn, bordeaux, boulder, braga, brasov, bruges,
bucharest, budapest, cairns, calgary, cambridge, canberra,
cardiff, catania, charlotte, columbus, dallas, darwin,
detroit, dijon, dortmund, dresden, edmonton, eindhoven,
freiburg, galway, gdansk, glasgow, gold-coast, gothenburg,
granada, groningen, halifax, hobart, houston, krakow, las-
vegas, ljubljana, los-angeles, lund, madison, minneapolis,
montpellier, montreal, naples, nashville, nice, orlando,
ostrava, palermo, phoenix, pittsburgh, poznan, raleigh, riga,
salt-lake-city, san-antonio, san-diego, saskatoon, seville,
split, sunshine-coast, tampere, toulouse, turin, turku,
uppsala, utrecht, vilnius, warsaw, winnipeg.

Country spread: United States 21, Australia 6, Canada 6, France
6, Italy 5, Germany 4, Poland 4, United Kingdom 4, Netherlands
3, Sweden 3, Finland 2, Romania 2, Spain 2, and one each for
Belgium, Croatia, Czechia, Denmark, Hungary, Ireland, Latvia,
Lithuania, Portugal, and Slovenia.

Category spread: nature 42, mountain 19, park 11, island 3,
lake 2, waterfront 1 — all drawn from existing
`NearbyPlaceCategory` enum values; no new categories were
introduced.

### Sitemap impact

- +78 `/nearby-weekend-places/[slug]` entries flow from the
  existing `NEARBY_WEEKEND_PLACE_DETAIL_SLUGS.map(...)`
  iteration in `app/sitemap.ts`.
- +78 `/cities/[city]/nearby-weekend-places` entries flow from
  the existing `getAllCitiesWithNearbyWeekendPlaces()`
  iteration (94 -> 172 city pages).
- No edit to `app/sitemap.ts` was required; no duplicate or
  orphan URLs.

### Structured data

Detail and city pages keep their existing `WebPage`,
`BreadcrumbList`, and `ItemList` structured data. No
`TouristAttraction`, `Event`, `Review`, `Rating`, `Offer`,
`TravelAction`, or `Itinerary` types were added.

### Content safety

Summaries use neutral wording and the standard "confirm access
points, current conditions, and seasonal context with the
official authority before departure" closing. No exact
distances, travel times, routes, schedules, ticket prices,
opening hours, weather, or safety/accessibility claims appear.
No `best` / `top` / `must-see` / `hidden gem` /
`world-class` / `bucket list` wording is present.

### Static page delta

- previous baseline: 3,531
- new total: 3,687 (+156: 78 new
  `/nearby-weekend-places/[slug]` detail routes and 78 new
  `/cities/[city]/nearby-weekend-places` routes, both
  auto-generated by existing `generateStaticParams` iterations)

### Validation results

- `npm run validate:nearby-places` -- PASS (195 records, 155
  curated detail slugs)
- `npm run validate:media` -- PASS
- `npm run validate:community-media` -- PASS
- `npm run typecheck` -- clean
- `npm run lint` -- clean
- `npm run build` -- emits 3,687 / 3,687 pages

### Future steps

- A further pass can cover the remaining uncovered
  target-region cities (e.g. Hanover, Brisbane, Freiburg) once
  a verified, high-quality Commons image and an official URL
  are confirmed for a suitable local place.
- Image quality on the new entries can be audited once live and
  upgraded from each place's `P373` Commons category if a
  better-licensed landscape becomes available.


## 2026-06-02: weekend-trip + visual-guide cluster for batch-five cities

Follow-up to the batch-five nearby-places pass. 47 of the 78
batch-five cities already had a nearby place but no weekend-trip
or visual-guide page, so their nearby → weekend-trip →
visual-guide cross-linking was incomplete. This pass adds the
two missing layers for those 47 cities, mirroring the batch-four
sequence. The remaining 31 batch-five cities already had both
pages.

### Pages added

- Weekend-trip pages: 149 -> 196 (+47), seeded in
  [`lib/data/weekend-trip.ts`](../lib/data/weekend-trip.ts) under
  `BATCH_5_UPDATED_DATE`.
- Visual-guide pages: 149 -> 196 (+47), seeded in
  [`lib/data/visual-guides.ts`](../lib/data/visual-guides.ts)
  under `BATCH_5_UPDATED_DATE`.
- Every one of the 78 batch-five cities now carries the full
  cluster (nearby place + weekend-trip + visual-guide). The
  city-profile `hasWeekendTripPage` / `hasVisualCityGuidePage`
  link cards and the weekend-trip ↔ visual-guide ↔ nearby
  cross-links now resolve for all 47.

### Verified hero reuse

All 47 cities already hold a verified Wikimedia Commons city
hero in the media catalog (297 city heroes total), so every new
visual-guide page renders a real verified hero — no new images
were added and `validate:media` is unchanged.

### Focus / source coverage

- Weekend-trip `weekendFocus` and visual-guide `visualFocus`
  use only the existing enum values; no new members.
- Air-quality `extra` source ids follow the established
  per-country mapping (`eea-air` for EU/UK/IE, `epa-naaqs` US,
  `triple-zero-au` AU, `canada-emergency` CA). All resolve in
  the sources registry.
- Visual-guide `context` strings stay neutral (urban form /
  geographic character only) — no named attractions, no
  superlatives, no prices, hours, or rankings.

### Static page delta

- previous baseline: 3,687
- new total: 3,781 (+94: 47 `/cities/[city]/weekend-trip` and
  47 `/cities/[city]/visual-guide` routes, auto-generated by the
  existing `generateStaticParams` iterations)

### Validation results

- `npm run validate:nearby-places` -- PASS (195 records)
- `npm run validate:media` -- PASS
- `npm run validate:community-media` -- PASS
- `npm run typecheck` -- clean
- `npm run lint` -- clean
- `npm run build` -- emits 3,781 / 3,781 pages

### Cities completed (47)

aix-en-provence, baltimore, bari, bonn, boulder, braga,
brasov, bruges, bucharest, cairns, catania, charlotte,
columbus, darwin, detroit, dijon, dortmund, eindhoven,
freiburg, galway, gdansk, gold-coast, granada, groningen,
hobart, las-vegas, ljubljana, lund, madison, minneapolis,
montpellier, naples, orlando, ostrava, palermo, poznan,
raleigh, riga, san-antonio, saskatoon, split, sunshine-coast,
tampere, turku, uppsala, vilnius, winnipeg.


## 2026-06-02: batch six nearby weekend places (closing the regional gap)

Second nearby-places pass over the cities still uncovered after
batch five. Of the 73 remaining target-region cities, 55 now
receive a verified nearby place; 18 were deferred (14 whose
best candidate did not resolve to a confident country-matched
Wikidata entity or lacked coordinates, plus 4 — sacramento,
leuven, ghent, maastricht — whose Commons category yielded no
clean, relevant landscape image at the required quality bar).

Two verification tiers are used, both carrying a verified
Wikimedia Commons image, coordinates, and a Wikidata QID:

- `verified` (13): also carry a Wikidata `P856` officialUrl, so
  they additionally become curated detail pages.
- `partial` (42): stable QID + coordinates + verified image but
  no `officialUrl` present in Wikidata. These render as nearby
  places only (no detail page), matching the dataset's existing
  `partial` convention.

### Places added

- Nearby weekend places: 195 -> 250 (+55).
- Detail pages: 155 -> 168 (+13, the `verified`-tier records).
- Cities with at least one nearby place: 172 -> 227 (+55).

### Image quality

- 100% of the 55 new places carry a verified Wikimedia Commons
  image (55 / 55), every license on the public-domain / CC0 /
  CC BY / CC BY-SA accept-list. Each P18 image was re-checked
  and, where it was a map, sign, building, macro (insect / fungus
  / flower), or sub-800px crop, replaced with the largest clean
  landscape from the place's `P373` Commons category. Cities
  whose category held no clean landscape were dropped rather than
  shipped with a weak image.

### Country spread

australia: 5, belgium: 1, bulgaria: 1, canada: 3, croatia: 1, czechia: 1, denmark: 1, estonia: 1, france: 2, germany: 7, ireland: 1, italy: 3, luxembourg: 1, new-zealand: 4, poland: 2, portugal: 1, romania: 1, slovakia: 1, spain: 4, united-kingdom: 5, united-states: 9.

### Cities — verified tier (13)

adelaide, brighton, brisbane, cincinnati, cleveland, grenoble,
hanover, kansas-city, memphis, philadelphia, st-louis, tampa,
verona.

### Cities — partial tier (42)

antwerp, belfast, bergamo, bilbao, bratislava, bremen,
bristol, brno, christchurch, cluj-napoca, coimbra, cork,
dunedin, dusseldorf, florence, geelong, heidelberg, kelowna,
leeds, leipzig, liverpool, lodz, luxembourg-city, malaga,
milwaukee, napier, newcastle, nuremberg, odense, plovdiv,
portland, rennes, stuttgart, tallinn, valladolid, victoria,
waterloo-ontario, wellington, wollongong, wroclaw, zagreb,
zaragoza.

### Static page delta

- previous baseline: 3,781
- new total: 3,849 (+68: 13 new `/nearby-weekend-places/[slug]`
  detail routes and 55 new `/cities/[city]/nearby-weekend-places`
  routes, auto-generated)

### Validation results

- `npm run validate:nearby-places` -- PASS (250 records, 168
  curated detail slugs)
- `npm run validate:media` -- PASS
- `npm run validate:community-media` -- PASS
- `npm run typecheck` -- clean
- `npm run lint` -- clean
- `npm run build` -- emits 3,849 / 3,849 pages

### Deferred (future batch)

18 target-region cities remain without a nearby place. Most need
either a more precise Wikidata match (several Italian / French /
Spanish regional parks whose English search term did not surface
the native-language entity) or a clean landscape image; both are
tractable in a focused follow-up.

## 2026-06-02: weekend-trip + visual-guide cluster for batch-six cities

Follow-up to batch six, same pattern as the batch-five cluster pass.
Of the 55 batch-six cities, 36 lacked a weekend-trip and visual-guide
page (the other 19 already had both from earlier batches). This pass
adds the missing layers so their nearby -> weekend-trip ->
visual-guide cross-linking resolves.

### Pages added

- Weekend-trip pages: 196 -> 232 (+36), under `BATCH_6_UPDATED_DATE`.
- Visual-guide pages: 196 -> 231 (+35), under `BATCH_6_UPDATED_DATE`.
- Napier receives a weekend-trip page only: it has no verified city
  hero in the media catalog yet, so no visual-guide page was added
  (visual guides require a verified hero). All other 35 cities hold a
  verified hero and receive both layers.

### Coverage / safety

- `weekendFocus` / `visualFocus` reuse existing enum values; air
  source ids follow the per-country mapping; visual-guide `context`
  strings stay neutral (urban form / geographic character only).
- No new images: every visual guide renders an existing verified
  Wikimedia hero, so `validate:media` is unchanged.

### Static page delta

- previous baseline: 3,849
- new total: 3,920 (+71: 36 `/cities/[city]/weekend-trip` and 35
  `/cities/[city]/visual-guide` routes, auto-generated)

### Validation results

- `npm run validate:nearby-places` -- PASS (250 records)
- `npm run validate:media` -- PASS
- `npm run validate:community-media` -- PASS
- `npm run typecheck` -- clean
- `npm run lint` -- clean
- `npm run build` -- emits 3,920 / 3,920 pages

## 2026-06-02: image-quality audit + validator hardening

A quality pass over the batch-five / batch-six imagery plus a
strengthening of `scripts/validate-nearby-places.py` so the gaps
that needed manual catching this round are caught automatically
in future batches.

### Image fixes (3)

- `teufelsmoor-near-bremen`: replaced an 800×114 panorama sliver
  with a 1280×853 moor landscape from the
  `Naturschutzgebiet Teufelsmoor` Commons category.
- `feldberg-near-freiburg`: replaced a village-centre ("ortskern")
  shot — the place is the Black Forest summit, not the
  municipality core — with a 1280×872 Feldberg landscape.
- `archipelago-national-park-near-turku`: replaced a 1280×368
  banner strip with a 1280×960 island scene.

All three remain verified Wikimedia Commons images with
acceptable licenses; `validate:media` and the build are
unchanged.

### Validator hardening

`scripts/validate-nearby-places.py` now additionally rejects, for
any image, `src` / `sourceUrl` filenames that look like:

- cartographic / survey documents (Ordnance Survey, Ferraris
  maps, topographic-map sheets, `mtn25`, `mapa` / `carte` /
  `karte`);
- fauna macro shots (butterfly, bee, wasp, beetle, moth, spider,
  snail, dragonfly);
- fungus / mushroom macro shots (incl. Dutch `zwam`, `koraal`,
  `amanita`);
- flower / moss / lichen macro shots;
- town-centre / civic-core scenes (`town`, `rathaus`, `altstadt`,
  `ortskern`, `downtown`).

It also requires every image's larger side to be at least
`MIN_IMAGE_MAX_DIMENSION` (600 px), and requires every `verified`
record to carry latitude/longitude coordinates. All new gates
were calibrated against the current dataset (smallest existing
image is 600 px on its long side; every verified record already
has coordinates) so the suite still reports PASS on all 250
records with zero false positives.

### Validation results

- `npm run validate:nearby-places` -- PASS (250 records)
- `npm run validate:media` -- PASS
- `npm run typecheck` -- clean
- `npm run lint` -- clean
- `npm run build` -- emits 3,920 / 3,920 pages

## 2026-06-02: official-URL liveness audit (batch five / six)

Ran an HTTP liveness check over every new `officialUrl` (the
Wikidata `P856` values that drive detail-page "official source"
links). 12 of 91 were stale — dead domains (Queensland's renamed
`nprsr.qld.gov.au`, ACT's `tams.act.gov.au`), timeouts, or moved
404 paths.

- 10 were repointed to verified-working official URLs (HTTP 200):
  alta-murgia (parks.it), belle-isle (Belle Isle Conservancy),
  kemeri (kemerunacionalaisparks.lv), mols-bjerge
  (nationalparkmolsbjerge.dk), montagne-sainte-victoire (https),
  namadgi (parks.act.gov.au), piatra-craiului (pcrai.ro root),
  trakai (tinp.lt root), d'aguilar (parks.des.qld.gov.au), noosa
  (parks.qld.gov.au).
- 2 (hocking-hills, hueston-woods — both Ohio DNR) could not be
  re-verified to a 200, so they were downgraded from `verified`
  to `partial` and removed from the detail-slug list rather than
  ship a broken link. Both remain nearby places with a verified
  image and coordinates.

Detail pages: 168 -> 166. Static pages: 3,920 -> 3,918. Image
`src` values were also spot-checked and all resolve (200; the
occasional 429 is Wikimedia rate-limiting the checker, not a dead
asset). `validate:nearby-places` PASS (250) · build 3,918 pages.

## 2026-06-02: verified reference facts on nearby-place detail pages

Step 5 of the post-batch-six roadmap. Detail pages now carry a
"Reference data" block of verified, single-valued Wikidata facts:

- designation — `P31` protected-area class label (e.g. "National
  park", "Utah state park", "Regional natural park");
- IUCN category — `P814` (e.g. II, V);
- established — `P571` inception year (fallback `P1619`).

### Data layer

- New `lib/data/nearby-place-facts.ts` exports
  `NEARBY_PLACE_FACTS` (slug → `NearbyPlaceFacts`) and
  `getNearbyPlaceFacts(slug)`. 131 of the 166 detail places have at
  least one fact (designation 110, IUCN 96, established 123). New
  `NearbyPlaceFacts` type in `types/nearby-places.ts`.
- Every key is a curated detail slug and every `wikidataId` matches
  that slug's seed record (cross-checked by the validator).

### Why no area

`P2046` (area) is deliberately excluded. It is multi-valued with
inconsistent units on Wikidata — sampling found hectare figures
mislabelled as km² (e.g. a "36,422 km²" D'Aguilar value alongside
the correct 392 km², and Roztocze stored as 8,483 "km²" for an
85 km² park). Rather than ship unverifiable numbers on a panel
labelled "verified", only single-valued, reliable properties are
kept.

### Rendering

`/nearby-weekend-places/[slug]` renders a neutral "Reference data"
`dl` after "Sources and identity"; a place with no facts omits the
block entirely (confirmed: 131 prerendered detail pages contain the
block). No new structured-data types were added (still WebPage /
BreadcrumbList / ItemList only). No prices, hours, rankings, or
marketing language.

### Validator

`scripts/validate-nearby-places.py` now also checks the facts file:
every key is a curated detail slug, each `wikidataId` matches the
seed, IUCN categories are valid classes, and established years are
plausible.

### Validation results

- `npm run validate:nearby-places` -- PASS (250 records + facts)
- `npm run validate:media` -- PASS
- `npm run typecheck` -- clean
- `npm run lint` -- clean
- `npm run build` -- emits 3,918 / 3,918 pages


## 2026-06-02: batch seven — closing the target-region gap

Final recovery pass over the 18 cities still uncovered after batch
six. Most failed earlier because an English search term did not
surface the native-language Wikidata entity; this pass resolves each
via native-language search (it / fr / es / ca / pl / sv / el) with a
coordinates-in-country fallback, and picks images with the hardened
filter (maps, fauna, fungus, flower, town-centre, building tokens all
excluded; landscape ratio + >=800px).

14 of 18 recovered (9 verified -> detail pages, 5 partial -> nearby
only). 4 stay deferred: migliarino-san-rossore (pisa) would not
resolve to a confident entity; leuven / maastricht / ghent had no
clean landscape in their Commons categories (fungus-dominated,
canal-only, visitor-building) and were not shipped with a weak image.

### Added

- Nearby weekend places: 250 -> 264 (+14).
- Detail pages: 166 -> 175 (+9 verified-tier).
- Cities with nearby coverage: 227 -> 241.
- Reference facts: 131 -> 139 (8 of the 9 new verified places).

### Verified (9)

alicante, athens, bologna, genoa, murcia, padua, sacramento,
strasbourg, valencia.

### Partial (5)

cologne, indianapolis, katowice, malmo, tauranga.

### Validation results

- `npm run validate:nearby-places` -- PASS (264 records + facts)
- `npm run validate:media` -- PASS
- `npm run typecheck` / `npm run lint` -- clean
- `npm run build` -- emits 3,941 / 3,941 pages

### Remaining

4 target-region cities deferred (pisa, leuven, maastricht, ghent).
After this pass, 241 of 347 platform cities carry a nearby place and
every target-region city is covered except these four.

## 2026-06-02: weekend-trip + visual-guide cluster for batch-seven cities

Closes the cluster for the batch-seven recoveries. 9 of the 14
recovered cities lacked a weekend-trip and visual-guide page (the
other 5 already had both); all 9 have a verified hero, so both layers
were added.

- weekend-trip pages: 232 -> 241 (+9)
- visual-guide pages: 231 -> 240 (+9)
- cities: alicante, genoa, indianapolis, katowice, malmo, murcia,
  padua, sacramento, tauranga
- static pages 3,941 -> 3,959

Focus/source ids reuse existing enums and the per-country mapping;
visual-guide context strings stay neutral; every visual guide renders
an existing verified hero (no new images).

validate:nearby-places PASS (264) · validate:media PASS · typecheck/lint
clean · build 3,959 pages.

## 2026-06-12: city coverage batch five

### Scope

This batch expands the city catalog by **100 records across 27 existing
countries**. No new countries were added. Geographic scope was limited
per spec to the European Union, the United Kingdom, Ireland, the United
States, Canada, Australia, and New Zealand. The selection deliberately
favors regional capitals, university hubs, coastal/harbor cities, river
and lake cities, mountain/Arctic gateways, and culturally important
secondary cities — not raw population — so every record is a strong
future anchor for visual guides, weekend trips, and nearby-weekend-place
discovery.

### Counts

- city count delta: **347 -> 447 (+100)**
- country count: 86 (unchanged)
- country `citySlugs[]` arrays updated: 27 (100 appended slugs)
- verified Wikimedia Commons hero images added: **100 (100% of the batch)**
- skipped due to image failure: 0

### Target distribution (per spec)

| Region            | Spec range | This batch |
|-------------------|-----------:|-----------:|
| European Union    |     55–60  |     **56** |
| UK + Ireland      |     10–15  |     **13** |
| United States     |     15–20  |     **16** |
| Canada            |      8–10  |      **8** |
| Australia         |       5–8  |      **5** |
| New Zealand       |       2–4  |      **2** |
| **Total**         |            |    **100** |

### Per-country distribution (27 countries)

united-states 16, united-kingdom 9, canada 8, germany 7, france 6,
italy 6, australia 5, spain 5, ireland 4, poland 4, netherlands 3,
portugal 3, sweden 3, austria 2, belgium 2, czechia 2, finland 2,
greece 2, new-zealand 2, romania 2, bulgaria 1, croatia 1, denmark 1,
hungary 1, lithuania 1, slovakia 1, slovenia 1.

### Selection funnel

- A curated, over-provisioned pool of 183 in-scope candidate cities was
  drawn across the 27 countries (~1.4× the per-country target).
- Each candidate was resolved deterministically against Wikidata +
  Wikimedia Commons (see "Verified image strategy"); 169/183 produced a
  permissively licensed, subject-appropriate hero image.
- The final 100 were hand-selected from the image-backed pool to hit the
  spec distribution while maximizing UNESCO/coast/lake/mountain/river
  diversity and avoiding excessive clustering inside any one country.
- Result: **every one of the 100 new cities ships with a verified hero
  image (100% coverage)** — zero records fall back to `ImageFallback`.

### Full alphabetical list of new slugs

a-coruna, albuquerque, albury, anchorage, annecy, asheville, athlone,
augsburg, avignon, bath, bolzano, buffalo, bunbury, burlington-vt,
charleston, charlottetown, chattanooga, clermont-ferrand, como,
constanta, delft, derry, des-moines, dubrovnik, evora, exeter, funchal,
gatineau, gdynia, girona, grand-rapids, guimaraes, hamilton-ontario,
helsingborg, heraklion, honolulu, innsbruck, inverness, ioannina,
jyvaskyla, karlovy-vary, kaunas, kiel, kilkenny, killarney, kitchener,
knoxville, la-rochelle, leiden, linkoping, lubeck, lucca, mackay, mainz,
maribor, mechelen, mildura, nancy, new-plymouth, newcastle-upon-tyne,
nijmegen, nimes, norwich, nottingham, olomouc, olsztyn, ostend, pecs,
perugia, plymouth, port-macquarie, potsdam, providence, ravenna,
regensburg, richmond, roskilde, rotorua, rovaniemi, salamanca,
salzburg, san-sebastian, santa-fe, savannah, sherbrooke, sibiu, sligo,
sofia, spokane, st-johns, swansea, szczecin, thunder-bay, toledo,
torun, umea, venice, windsor-ontario, wurzburg, zilina.

Note: `sofia` adds the Bulgarian capital, which was not previously in
the registry; `hamilton-ontario`, `windsor-ontario`, and `st-johns`
use province/region-qualified slugs to avoid collisions with existing
or ambiguous names.

### Verified image strategy

Each hero image was resolved through the same pipeline used by earlier
city image passes:

1. Explicit Wikipedia title per city (disambiguated where ambiguous) ->
   Wikidata QID via the page-props endpoint.
2. Wikidata P18 ("image") claim on the city item.
3. Commons `imageinfo` API for canonical file metadata (URL, dimensions,
   author, license, restrictions).
4. Strict filter reusing the repo's own `verify-place-images.py`
   (`license_is_allowed`) and `build-place-images.py`
   (`file_is_unsuitable`) so anything accepted here also passes
   `validate:media`. Montages, flags, emblems, NC/ND/FAL licenses,
   missing-author files, and restricted files were rejected.

14 candidates were dropped in the funnel for exactly these reasons
(e.g. `london-ontario`/`kingston-ontario` carried FAL-licensed P18
images; `fredericton`/`moncton`/`leicester` resolved to montage files;
`thessaloniki`/`mons`/`vasteras` had no usable P18) and were replaced
by image-backed alternates from the same country pool.

### License distribution of the 100 hero images

CC BY-SA 3.0 x33, CC BY-SA 4.0 x21, CC BY-SA 2.0 x12, CC BY 2.0 x8,
Public domain x7, CC BY 3.0 x5, CC BY-SA 2.5 x4, CC BY 4.0 x3, CC0 x3,
CC BY 2.5 x1, plus 3 jurisdiction ports (CC BY-SA 3.0 de/es,
CC BY-SA 1.0 fi). Zero entries used NC, ND, FAL, "Attribution"-only, or
unknown licenses.

### Data safety

No exact population, cost, rent, salary, crime, transport, healthcare,
airport, visa, weather, event, or tourism-ranking data was added. Each
new seed uses the existing `buildNeutralCitySeed` helper; module data is
tagged "Pending integration" via `NEUTRAL_MODULE_FACTS`, `population` is
"Pending integration", and scores are structural directional defaults
(50), not editorial claims. The `intro`/`outlook` copy is grounded
strictly in each city's verified Wikipedia summary (river, lake, sea,
mountain range, UNESCO status, regional role) and contains no numbers,
statistics, or rankings.

### Automatic page impact

- +100 `/cities/[city]` profile pages.
- +600 `/{moduleSlug}/[city]` module pages (6 modules × 100 cities via
  the existing `getAllCities()` `generateStaticParams`).
- +100 city URLs + +600 module URLs in the sitemap via the existing
  `cities.map` / `modules.flatMap` iteration — no duplicate or orphan
  URLs.
- Country hubs for the 27 affected countries pick up the new
  `citySlugs[]` automatically.
- NO arrival, weekend-trip, visual-guide, moving-to, nearby-places, or
  comparison pages were added in this batch (those remain gated by their
  own registries and can be layered onto these anchors later).

### Static page count delta

- previous baseline: **3,959**
- new total: **4,659 (+700 = 100 profile + 600 module pages)**

### City hero coverage delta

- before batch five: 335 / 347 city hero records
- after batch five: **435 / 447** city hero records
- per-batch additions: **100 / 100** new cities ship with a verified
  Wikimedia hero (100% of the new slugs)

### Validation results

- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — clean (4,659 / 4,659 static pages)
- `npm run validate:media` — PASS (cities: 435 hero / 467 total on 447
  known slugs; countries: 86 hero / 106 total unchanged)
- `npm run validate:nearby-places` — PASS (264 records, unchanged)
- `npm run validate:community-media` — PASS (28 values, unchanged)

### Future expansion opportunities

- Layer nearby-weekend-place, weekend-trip, and visual-guide clusters
  onto the 100 new anchors (lake, coastal, mountain-gateway, and UNESCO
  cities are especially strong candidates: annecy, como, killarney,
  rotorua, salzburg, lubeck, dubrovnik, asheville, burlington-vt).
- Image-backed alternates held in reserve from the candidate pool
  (e.g. graz, lille-adjacent French regional cities, tarragona, burgas,
  debrecen) remain available for a future batch six.

## 2026-06-12: local-first cluster for batch-five cities (nearby places, detail pages, weekend trips, visual guides)

### Scope

This batch turns the 100 batch-five cities (added the same day) from
isolated city records into complete local-first discovery nodes. For
every batch-five city it adds nearby weekend places, a weekend-trip
page, and a visual-guide page, plus dedicated detail pages for the
verified protected/natural areas. The geographic scope stays inside
the supported regions (EU / UK / IE / US / CA / AU / NZ). No new
cities, countries, restaurants, hotels, events, schedules, prices,
weather data, or AI imagery were introduced.

### Counts (before → after)

- nearby weekend places: **264 → 432 (+168)**
- nearby place detail pages: **175 → 253 (+78)**
- nearby place reference facts: **139 → 217 (+78)**
- weekend-trip pages: **241 → 341 (+100)**
- visual-guide pages: **240 → 340 (+100)**

### Batch-five city coverage achieved

- nearby weekend places: **100 / 100** batch-five cities (≥1 each;
  68 cities received 2 places, 32 received 1)
- weekend-trip pages: **100 / 100**
- visual-guide pages: **100 / 100**

Every batch-five city now has the full cluster: `/cities/[city]`,
`/cities/[city]/nearby-weekend-places`, `/cities/[city]/weekend-trip`,
and `/cities/[city]/visual-guide`.

### Local-first place selection

Places were proposed per city (officially protected natural areas:
national/regional/nature parks, nature reserves, protected landscapes,
mountain ranges, lake districts, river valleys, coastlines, islands,
wetlands, biosphere reserves), then verified deterministically against
Wikidata + Wikimedia Commons:

1. English Wikipedia title → Wikidata QID.
2. Wikidata P625 coordinates on both the place and its connected city,
   with a great-circle **proximity gate (≤170 km)** so only genuinely
   reachable escapes are kept (resulting bands: 127 nearby, 38 regional,
   3 longer-weekend).
3. Wikidata P856 official URL (→ `verificationStatus: "verified"`;
   places without an official URL are `"partial"`).
4. Wikidata P18 image → Commons `imageinfo`, run through the repo's own
   `validate-nearby-places.py` filters (license accept-list, reject
   tokens, suspicious-filename patterns — montage/flag/map/town-core/
   flora-fauna macro/etc. — and a 600px minimum).
5. Wikidata P31 (designation), P814 (IUCN category), P571/P1619
   (inception year) for reference facts.

300 candidates were resolved; 213 passed all gates. The final 168 were
selected to cover every city while keeping country breadth (round-robin
second places). Two cities whose first candidates failed the image gate
(`gdynia`, `constanta`) were re-resolved against alternate nearby
protected areas.

Category mix of the 168: nature 63, mountain 36, lake 28, waterfront
20, beach 10, island 6, park 5.

### Image coverage

- **168 / 168 (100%)** new nearby places ship with a verified Wikimedia
  Commons image (independently attributed; no city-image substitution,
  no fallback, no placeholder).
- License mix: CC BY-SA 3.0 ×73, CC BY-SA 4.0 ×35, CC BY-SA 2.0 ×14,
  CC BY 3.0 ×12, CC BY 2.0 ×8, CC BY 2.5 ×7, CC BY-SA 2.5 ×5, CC0 ×2,
  CC BY 4.0 ×2, plus regional CC ports. Zero NC/ND/FAL/GFDL/unknown.

### Source coverage

- Every place cites the shared registry sources (`un-habitat`,
  `ipcc-urban`, `wikidata`, `wikimedia-commons`) and carries a
  `wikidataId`. The 78 verified places additionally carry an
  official-authority `officialUrl` (Wikidata P856).
- 78 reference-fact records (designation / IUCN category / inception
  year) were added, each keyed to a verified detail slug with a
  matching `wikidataId`.

### Detail pages

The 78 new detail pages are exactly the new places that satisfy the
audited eligibility rules (verificationStatus "verified" + wikidataId +
officialUrl + coordinates + verified image). They render the existing
detail template (image + attribution, official link, coordinates,
reference facts, connected-city context) — no thin pages, no new route
types.

### Countries expanded (27)

united-states 22, united-kingdom 16, germany 14, canada 13, france 12,
australia 9, spain 9, italy 8, ireland 7, poland 7, sweden 6,
netherlands 5, portugal 5, austria 4, finland 4, belgium 3, czechia 3,
greece 3, new-zealand 3, romania 3, bulgaria 2, denmark 2, hungary 2,
lithuania 2, slovakia 2, croatia 1, slovenia 1.

### Internal linking

All linking flows through existing helpers/templates (no hardcoded
routes): city → nearby/weekend-trip/visual-guide, weekend-trip and
visual-guide → nearby places, nearby directory → detail pages, detail →
connected-city context. The new data appears automatically in
`/nearby-weekend-places`, the per-city cluster pages, and the sitemap.

### Sitemap impact

- +78 `/nearby-weekend-places/[slug]` detail URLs (via
  `NEARBY_WEEKEND_PLACE_DETAIL_SLUGS`).
- +100 `/cities/[city]/nearby-weekend-places`, +100
  `/cities/[city]/weekend-trip`, +100 `/cities/[city]/visual-guide`.
- No duplicate or orphan URLs; emitted by the existing sitemap
  iteration.

### Static page count

- before: **4,659**
- after: **5,037 (+378 = 78 detail + 100 nearby-city + 100 weekend-trip
  + 100 visual-guide)**

### Validation results

- `npm run validate:nearby-places` — PASS (432 records)
- `npm run validate:media` — PASS (cities 435/467, countries unchanged)
- `npm run validate:community-media` — PASS (28 values)
- `npm run typecheck` — clean
- `npm run lint` — clean (0 problems)
- `npm run build` — clean (5,037 / 5,037 static pages)

### Structured data / performance

Detail and cluster pages reuse the existing WebPage + BreadcrumbList +
ItemList architecture only — no TouristAttraction/Event/Review/Offer
schema, no maps, no runtime fetches, no new dependencies; all pages
remain static.

## 2026-06-12: target-region completeness pass

### Scope

A gap-closing pass that brings **target-region** local-first coverage
to **100%** on every cluster dimension, following the platform
completeness audit (which scored 98/100). No new cities, countries, or
route types were introduced; only missing records were filled using the
existing architecture and the established Wikidata → Wikimedia Commons
verification pipeline.

### Gaps closed

The audit identified a small set of pre-existing target-region gaps
(all outside the batch-five cohort, which was already 100% complete):

- **Hero images (10 cities):** aix-en-provence, columbus, detroit,
  liverpool, montpellier, napier, san-antonio, saskatoon, victoria,
  wollongong.
- **Nearby-place coverage (4 cities):** ghent, leuven, maastricht, pisa.
- **Weekend-trip pages (5 cities):** leuven, maastricht, pisa,
  queenstown, sheffield.
- **Visual-guide pages (6 cities):** leuven, maastricht, napier, pisa,
  queenstown, sheffield.
- **Detail-page promotions (8 verified, eligible places):**
  richmond-park-london, pentland-hills-edinburgh, phoenix-park-dublin,
  sitges-near-barcelona, cascais-near-lisbon, muir-woods-near-san-francisco,
  indiana-dunes-near-chicago, fiordland-near-queenstown.

### Counts (before → after)

- hero images: **435 → 445 (+10)**
- nearby weekend places: **432 → 439 (+7)**
- nearby detail pages: **253 → 262 (+9)**
- reference facts: **217 → 226 (+9)**
- weekend-trip pages: **341 → 346 (+5)**
- visual-guide pages: **340 → 346 (+6)**
- static pages: **5,037 → 5,061 (+24 = 4 nearby-city + 9 detail + 5 weekend + 6 visual)**

### Target-region completeness (before → after)

| Dimension | Before | After |
|---|---|---|
| Hero image | 335/345 (97.1%) | **345/345 (100%)** |
| Nearby-place page | 341/345 (98.8%) | **345/345 (100%)** |
| Weekend-trip page | 340/345 (98.6%) | **345/345 (100%)** |
| Visual-guide page | 339/345 (98.3%) | **345/345 (100%)** |

*(102 non-target-region cities remain outside the cluster by policy.)*

### Hero images

Resolved Wikidata QID → P18, with a **Commons-category (P373) fallback**
for the 9 cities whose P18 was an unsuitable montage (the original cause
of the gap); napier resolved directly from P18. The fallback picks the
largest clean landscape file in the city's Commons category that passes
the repo's own `file_is_unsuitable` + `license_is_allowed` filters.
License mix: CC BY-SA 4.0 ×6, Public domain ×3, CC BY 2.0 ×1 — every
record carries author, license, license URL, source URL, and
attribution. No fallback/placeholder/AI/stock imagery.

### Nearby places

7 verified natural areas resolved through the standard nearby pipeline
(Wikidata QID → P625 proximity gate ≤170 km, P856 official URL, P18 →
Commons image with full filter parity): Bourgoyen-Ossemeersen and
Donkmeer (ghent), the Dyle valley (leuven), Sint-Pietersberg and Hoge
Kempen National Park (maastricht), the Apuan Alps and Lake Massaciuccoli
(pisa). 1 reached `verified` (Hoge Kempen, with P856 official URL) and 6
are `partial`. All 7 ship a verified Wikimedia image (100% coverage:
CC BY-SA 3.0 ×6, CC BY 4.0 ×1). Cross-border note: Hoge Kempen National
Park is in Belgium but anchored to Maastricht, so its `countrySlug` is
`belgium`.

### Detail pages

The 8 audited eligible places were promoted to
`NEARBY_WEEKEND_PLACE_DETAIL_SLUGS`, plus the newly verified Hoge Kempen
National Park (9 total). Each already satisfies the audited criteria
(verificationStatus "verified" + wikidataId + officialUrl + coordinates
+ verified image) and now carries reference facts (designation / IUCN
category / inception year from Wikidata P31/P814/P571). No thin pages;
same structure as existing detail pages.

### Internal linking

All new records flow through existing helpers/templates — city →
nearby/weekend/visual, weekend & visual → nearby, nearby directory →
detail, detail → connected-city context — and appear automatically in
`/nearby-weekend-places`, the per-city cluster pages, and the sitemap.
No routes hardcoded.

### SEO / structured data

Unchanged strategy: every route uses `createMetadata` (canonical +
OpenGraph); detail/cluster pages emit WebPage + BreadcrumbList (+
ItemList on directory/city-nearby) only. No TouristAttraction / Event /
Review / Rating / Offer / TravelAction / Itinerary. Sitemap has no
duplicate or orphan URLs.

### Validation results

- `npm run validate:nearby-places` — PASS (439 records)
- `npm run validate:media` — PASS (cities 445 hero / 477 total)
- `npm run validate:community-media` — PASS (28 values)
- `npm run typecheck` — clean
- `npm run lint` — clean (0 problems)
- `npm run build` — clean (5,061 / 5,061 static pages)

### Performance / philosophy

No runtime fetches, no new dependencies, no maps/weather/routing
libraries; all pages static. New copy is neutral, factual, and
source-grounded (no best/top/must-see/world-class wording, no prices,
schedules, hours, or weather).

## 2026-06-12: official-source expansion for nearby places

### Scope

A source-quality pass that resolves verified **official managing-authority
URLs** for partial nearby places, upgrading them to `verified` and
unlocking dedicated detail pages. No new cities, countries, places,
route types, or images. Existing verified images are untouched.

### Counts (before → after)

- partial nearby places: **177 → 24 (−153)**
- verified nearby places: **262 → 415 (+153)**
- nearby detail pages: **262 → 415 (+153)**
- reference facts: **226 → 379 (+153)**
- static pages: **5,061 → 5,214 (+153 detail pages)**
- nearby places total: 439 (unchanged); image coverage 439/439 = **100%** (unchanged)

### Official-URL resolution (no guessing)

Every URL is a verified official site belonging to the body that
manages or governs the place — never a tourism portal, wiki, OTA,
social network, or blog. Resolution tiers:

1. **Wikidata P856** on the place (its official website) — 1.
2. **Operator (P137/P126) → operator's P856** (the responsible
   authority's official site) — 10.
3. **Verified authority lookup** (search + page fetch confirming the
   managing authority, then deterministic liveness-check + banned-domain
   screen + manual domain review) — 142.

Total resolved: **153**. 148 candidate URLs were proposed; rejects were
dropped for dead links / banned domains. The 24 places left partial are
genuinely multi-jurisdiction natural features with no single managing
authority (e.g. Loch Ness, Øresund, Lake Champlain, the Rhodope
Mountains, several trans-regional rivers and coastlines) — correctly
kept partial rather than assigned a non-authoritative URL.

### Source coverage

Resolved URLs are all official authorities, spanning:
- National agencies — NPS, US Forest Service, Fish & Wildlife,
  Parks Canada / BC Parks / Ontario Parks, NZ DOC, Natural Resources
  Wales, NatureScot/Forestry & Land Scotland, Forestry England,
  NPWS Ireland (×6), Metsähallitus, Naturstyrelsen / Länsstyrelsen (SE),
  Staatsbosbeheer, RMK & Keskkonnaamet (EE), ICNF (PT), MITECO (ES).
- Regional / landscape / nature-park authorities — Parcs naturels
  régionaux (FR), Enti Parco Regionale (IT), Naturparke /
  Biosphärenreservate / Zweckverbände (DE), Landscape Parks Authorities
  (PL), Catalan/Aragón/Galicia/Basque park services (ES), UNESCO geoparks.
- County / municipal governments and official conservation trusts /
  foundations that legally manage a site (National Trust, Natuurmonumenten,
  RSPB, Phillip Island Nature Parks, SPSG, Te Mata Park Trust, etc.).

After this pass, **415 / 439 (94.5%)** nearby places carry an official
URL.

### Reference facts

153 fact records added (designation = Wikidata P31, IUCN category =
P814, inception year = P571/P1619), fetched deterministically from each
place's Wikidata entity — no fabrication. The detail-page "Reference
data" block renders these via the existing template; the managing
authority is conveyed through the official-URL link (the
`NearbyPlaceFacts` schema is unchanged — no new fields).

### Detail pages

Every newly verified place satisfies the audited eligibility rules
(verificationStatus "verified" + wikidataId + officialUrl + coordinates
+ verified image) and was promoted to
`NEARBY_WEEKEND_PLACE_DETAIL_SLUGS`. Pages render via the existing
detail template — full content (image + attribution, official link,
coordinates, reference facts, connected-city context), no thin pages,
no new route types.

### Internal linking / SEO

All linking flows through existing helpers (no hardcoded routes):
nearby directory → detail, detail → connected city, city / weekend-trip
/ visual-guide → nearby places. New detail URLs are emitted
automatically in the sitemap (no duplicate or orphan URLs). Metadata
(canonical + OpenGraph) and structured data (WebPage + BreadcrumbList,
ItemList on directories) use the existing architecture unchanged — no
TouristAttraction / Event / Review / Rating / Offer / TravelAction /
Itinerary.

### Validation results

- `npm run validate:nearby-places` — PASS (439 records)
- `npm run validate:media` — PASS (cities 445 hero / 477 total)
- `npm run validate:community-media` — PASS (28 values)
- `npm run typecheck` — clean
- `npm run lint` — clean (0 problems)
- `npm run build` — clean (5,214 / 5,214 static pages)

### Performance

No runtime fetches, no new dependencies, no maps/APIs/routing; all pages
remain static.

## 2026-06-12: community photo platform foundations

### Scope

Architecture-only foundation for future community photos — a render-layer
photo + gallery model that sits alongside the existing community-media
submission/moderation contract. No uploads, no auth, no accounts, no
storage, no backend, no moderation UI, no routes, no gallery/photo pages,
no sitemap or metadata changes. Everything stays static and build-safe.

### Photo model (`types/photos.ts`)

- `Photo`: id, slug, title, description, sourceType, status, attribution,
  authorName, createdAt, updatedAt, optional citySlug / nearbyPlaceSlug,
  plus a render payload (src, width, height, alt).
- `PhotoSourceType` = `official | community`.
- `PhotoStatus` = `pending | approved | rejected` (official ships
  `approved`; future community defaults to `pending`).
- `PhotoAttribution` = author, source, license, licenseUrl?, sourceUrl,
  authorUrl?, attributionText? — compatible with existing Wikimedia records.
- A photo may attach to a city, a nearby place, or both.

### Gallery model (`lib/data/photo-galleries.ts`)

- `PhotoGallery` (targetType `city | nearby_place`, photos, officialCount,
  communityCount, total) — supports official, community, and mixed sets.
- Data-access layer only (no UI): `getCityPhotos`, `getNearbyPlacePhotos`,
  `getCityPhotoGallery`, `getNearbyPlacePhotoGallery`, `hasCityPhotos`,
  `hasNearbyPlacePhotos`, plus moderation-tooling reads (`getAllPhotos`,
  `getPhotosByStatus`, `getPhotosBySourceType`). Public galleries surface
  ONLY `status: "approved"` photos. Re-exported from `lib/data/queries`.

### Moderation model

The render-layer `PhotoStatus` (pending/approved/rejected) composes with
the richer submission lifecycle already in `types/community-media.ts`
(`CommunityPhotoSubmission`: draft → pending_review → approved, safety
flags, policy, pure validators in `lib/community-media/`). An approved
submission maps onto a `Photo` with `sourceType: "community"`,
`status: "approved"`. The existing foundation is untouched.

### Validation model

- Runtime guard (`assertPhotoReferentialIntegrity`, runs at module
  evaluation): unique ids, unique slugs, valid `citySlug` (cities.ts),
  valid `nearbyPlaceSlug` (nearby-places.ts), at-least-one target, valid
  sourceType/status, official-not-pending, render-payload present. Because
  the gallery module is re-exported from `lib/data/queries` (imported by
  built pages), **`next build` fails on any invalid reference** (verified).
- `scripts/validate-photos.py` (`npm run validate:photos`) enforces the
  same rules as an explicit CI gate.

### Sample dataset

15 records (`lib/data/community-photos.ts`), all `sourceType: "official"`,
`status: "approved"`, reusing verified Wikimedia Commons attribution from
the existing catalog purely to exercise the architecture (5 city-only,
5 nearby-only, 5 dual-attached). No invented users; not a content
expansion.

### Future roadmap

- Phase 1 ✓ official photo records + galleries (this pass).
- Phase 2 ✓ community photo records (model + status support ready).
- Phase 3 — upload workflow (future; submission types already exist).
- Phase 4 — moderation workflow (future; lifecycle + validators exist).
- Phase 5 — community galleries surface (future; gallery layer ready).
The architecture needs no rewrite to reach later phases.

### Validation results

- `npm run validate:photos` — PASS (15 records: 15 official, 0 community)
- `npm run validate:nearby-places` — PASS (439)
- `npm run validate:media` — PASS
- `npm run validate:community-media` — PASS (28 values)
- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — clean (5,214 / 5,214 static pages, unchanged — no new
  routes or pages)

## 2026-06-12: community photo submission foundations

### Scope

Architecture-only Phase 3 — the draft → review → approval lifecycle a
contributor's photo moves through BEFORE any upload, auth, account, storage,
database, backend, moderation UI, or publishing exists. Static, build-safe,
validation-driven. No routes, pages, sitemap, or metadata changes.

### Submission model (`types/submissions.ts`)

- `CommunityPhotoSubmissionDraft`: id, citySlug?, nearbyPlaceSlug?, title,
  description, photographerName, sourceFileName, sourceFileSize, captureDate?,
  notes?, createdAt, updatedAt, isExample? (`sourceFileName`/`sourceFileSize`
  are metadata only — no real file).
- `CommunityPhotoSubmission` extends the draft with `status`, `submittedAt?`,
  and the review block (`reviewState`, `reviewedAt?`, `reviewReason?`,
  `reviewNotes?`).
- This is the PUBLIC, lightweight lifecycle record. It is deliberately
  distinct from the heavier internal admin `CommunityPhotoSubmission` in
  `types/community-media.ts` (which carries userId / storageKey / safetyFlags
  for the Phase 4-5 moderation queue). To avoid a barrel name clash, the new
  record is imported from `@/types/submissions`; the existing one is untouched.

### Workflow model (`lib/submissions/workflow.ts`)

- `SubmissionStatus` = `draft | submitted | under_review | approved | rejected`.
- `SUBMISSION_TRANSITIONS` encodes allowed status moves; `canTransition(from,to)`
  guards them.
- `STATUS_REVIEW_CONSISTENCY` maps each status to its valid review states;
  `isReviewStateConsistent` enforces no inconsistent state can exist.

### Review model

- `SubmissionReviewState` = `not_reviewed | in_review | accepted | declined |
  changes_requested`, plus `reviewedAt?`, `reviewReason?`, `reviewNotes?` on
  the submission. Future-moderation-compatible; no moderation implemented.

### Validation model (`lib/submissions/validation.ts`)

Pure, synchronous validators returning `SubmissionValidationResult`
(`{ ok, errors, warnings }`) with detailed `SubmissionValidationError`
(`{ field, code, message, severity }`): `validateSubmissionDraft` (empty
guard, length limits, file metadata), `validateSubmissionReferences`,
`validateSubmissionState` (enum + consistency), `validateSubmissionTransition`,
`validateSubmissionRecord` (composes all), `findDuplicateSubmissionMetadata`.
Content-safety preparation only — no AI, no image analysis.

### Publication flow (documented, not implemented)

`draft → submitted → under_review → approved → (future) Community Photo`.
An approved submission becomes a published `Photo` (sourceType "community")
only once a real upload exists — a later phase. No publishing implemented.

### Build safety (`lib/data/community-photo-submissions.ts`)

`assertSubmissionIntegrity` runs at module evaluation (the module is
re-exported from `lib/data/queries`, imported by built pages) so **`next build`
fails** on: duplicate ids, invalid city/nearby references, missing target,
invalid status/reviewState, inconsistent state, empty or over-length text, or
bad file metadata. The `validate:submissions` script enforces the same rules.

### Data-access layer

`getAllSubmissions`, `getSubmissionById`, `getSubmissionsByStatus`,
`getDraftSubmissions`, `getApprovedSubmissions`, `getSubmissionsForCity`,
`getSubmissionsForNearbyPlace`, `getApprovedSubmissionsForCity`,
`getApprovedSubmissionsForNearbyPlace`. Static only; re-exported from
`lib/data/queries`.

### Sample dataset

9 fictional, clearly-marked (`isExample: true`) example records — no real
users, no uploads — covering all five statuses (3 draft, 2 submitted,
2 under_review, 1 approved, 1 rejected), some city-targeted, some
nearby-place-targeted, one dual-target.

### Future roadmap

- Phase 1-2 ✓ official photos + galleries · Phase 3 ✓ submission architecture
  (this pass) · Phase 4 → uploads · Phase 5 → moderation · Phase 6 →
  publishing · Phase 7 → community galleries. No rewrites required.

### Validation results

- `npm run validate:submissions` — PASS (9 records)
- `npm run validate:photos` — PASS (15)
- `npm run validate:community-media` — PASS (28)
- `npm run validate:nearby-places` — PASS (439)
- `npm run validate:media` — PASS
- `npm run typecheck` / `npm run lint` — clean
- `npm run build` — clean (5,214 / 5,214 static pages, unchanged)
