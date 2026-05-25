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
