# City reachability

Answers "what can I reach from here" over the destinations the site already
indexes. It creates **no new route family**: the sitemap is unchanged at 84,833
URLs, and the page count is unchanged at 84,835.

## It builds nothing new

The audit found the inputs already existed:

| Input | State |
| --- | --- |
| City coordinates | 4,442, each corroborated |
| City-to-city distances | `lib/data/city-discovery-graph.ts`, 42,741 edges, 6,481 cross-border |
| Nature destinations | 51,284 classified places with per-city distances |
| Distance vocabulary | the corpus's own `nearby` / `regional` / `longer_weekend` |

So `lib/reachability/engine.ts` composes the city graph and the nature profiles
at build time. **No dataset is generated**, which is why this wave costs nothing
in corpus size, build memory or module count — only the markup it renders.

## One band registry

`lib/reachability/bands.ts` is the single definition of the thresholds, and
`lib/nature/distance.ts` now imports them instead of restating them, so a second
competing model cannot appear:

| Band | Range |
| --- | --- |
| Nearby | ≤ 60 km |
| Day-trip distance | 60–120 km |
| Weekend distance | > 120 km, capped at 300 km |

The boundaries were derived from the corpus's `distanceBand` vocabulary and hold
for city destinations too: across the 42,741 inter-city edges they split
15,277 / 11,377 / 11,886, and 90.2% of edges fall inside the 300 km ceiling.

## Distance is never time

The repository has no routing or timetable data. Every rendered string states
measured straight-line kilometres, and `validate:reachability` fails the build
on any copy matching a travel-time claim — `"1 hour away"`, `"2 hours from
Prague"`, `"a 30-minute trip"`. Quoted tokens are excluded from the copy checks
because these pages carry a disclaimer that *names* the claims they refuse to
make.

## Selection

Destinations are ordered nearest-first, then by name — never by popularity,
which the corpus does not measure. Diversity is applied as a **cap, never a
promotion**: at most two nature destinations of one category and at most four of
either kind per band, so a band cannot render as six lakes, but a city that
genuinely only has lakes still shows them.

Excluded by construction: self-links, retired city aliases (`lib/data/city-aliases.ts`),
and anything beyond 300 km.

## Per-page purpose

The same block is not repeated four times. Each page gets the shape it needs:

| Page | Block |
| --- | --- |
| `/cities/[city]` | compact "Around {City}" — one line per band, three destinations each |
| `/cities/[city]/nearby-weekend-places` | full band sections, eight per band |
| `/cities/[city]/weekend-trip` | band sections, six per band |
| `/cities/[city]/nature` | a band summary only — reachability is a second axis over the nature taxonomy, not a replacement for it |

Rows are links, not image cards: these blocks appear on four page families
across 4,442 cities, and cards at that multiplier would cost more artifact than
the feature is worth. The nature pages already carry the imagery.

## Link concentration

Measured across every city (Phase 18): 3,754 cities receive at least one inbound
reachability link, median 3, p90 9, p99 16, max 23. No capital becomes a hub —
the graph links to *nearest* cities, and the most-linked are mid-sized regional
ones (Panevėžys 23, Šiauliai 22, Volos 22).

## Cost

Artifact 17.550 → 17.818 GB, **+1.53%**, inside the 2% budget. Shared First Load
JS unchanged at 102 kB; every page's own JS unchanged. No client component was
added — the blocks are static HTML.

## Gate

`npm run validate:reachability` — 15 checks re-derived from source, including
band-versus-distance agreement, cross-border flags against the country relation,
every destination link resolving to an emitted page, and the travel-time and
superlative copy rules. 11 poisoned gates, all proven to fire.
