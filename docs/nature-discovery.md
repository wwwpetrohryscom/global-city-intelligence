# Nature discovery layer

City-based nature discovery answers a small set of concrete questions — *what
lakes are near my city, are there beaches nearby, which mountains can I reach,
what kind of outdoor destination is this* — from the curated nearby-place
corpus that already ships. It adds no new place records. It classifies,
measures, and groups what is already there, and it publishes a page only where
that produces a useful answer.

Read `content-expansion.md` for the wider corpus history first.

## What it is built from

| Input | Role |
| --- | --- |
| `lib/data/nearby-places.ts` | 32,543 curated places: name, country, Wikidata QID, P625 coordinates, verified image, connected city slugs |
| `lib/data/city-coordinates.ts` | **generated** — one corroborated centre coordinate per indexed city |
| `lib/data/nature-classification.ts` | **generated** — one nature classification per place |
| `lib/nature/taxonomy.ts` | category labels, route mapping, publication thresholds |
| `lib/nature/distance.ts` | great-circle distance and the distance-band vocabulary |
| `lib/nature/engine.ts` | per-city profiles, eligibility, ordering (server-only) |

Both generated files come from `scripts/nature/`. Edit the generators, never
the output.

## City coordinates

The corpus had no city coordinates. The hero-image `notes` field in
`lib/data/media/city-images.ts` records the **landmark** entity a photo was
resolved through ("Resolved via landmark article 'Rijksmuseum' → Wikidata
Q190804"), not the city entity, so it is not a usable city identity.

Cities are resolved from scratch and then corroborated against evidence the
repository already contains:

1. `scripts/nature/resolve_city_coords.py` collects Wikidata candidates by
   label and alt-label, constrained to the city's country (P17) and to
   settlement classes, carrying P625 and P1082.
2. `scripts/nature/repair_city_coords.py` re-fetches candidates from the live
   `wbsearchentities` API for cities whose geometry looks wrong. The QLever
   mirror is missing English `rdfs:label` for a set of entities — Tampa
   (Q49255), Indianapolis, Jacksonville — so a label-driven SPARQL lookup
   silently returns only namesakes.
3. `scripts/nature/verify_city_coords.py` picks between candidates on
   **geometry, not population**: the curated places for a city carry their own
   coordinates and were selected inside a bounded radius, so the correct entity
   is the one whose connected places sit closest. A namesake in another region
   fails by hundreds of kilometres.

Result: 4,444 / 4,444 cities resolved, median connected-place distance 25 km
(p90 86 km). Thirty hand-checked cities land within 9 km of their true centre,
most within 1 km.

`lib/data/city-discovery-graph.ts` is used only as a secondary witness and is
**not** authoritative — it disagrees with both Wikidata and the place corpus
for 18 cities. `hradec-kralove` is the clearest case: its published graph
geometry is self-consistent around a point ~130 km away, near Prague, while its
six curated places sit 14–50 km from the real city. Those conflicts are
reported by the resolver, never silently adopted.

## Taxonomy

Nineteen categories, chosen from what the corpus actually contains rather than
from a wish list:

`waterfall`, `cave`, `canyon`, `glacier`, `beach`, `lake`, `island`,
`volcano`, `river`, `wetland`, `mountain`, `valley`, `coast`, `desert`,
`forest`, `national-park`, `nature-reserve`, `park`, `viewpoint`

The list is also the **priority order**, which settles the three real
collisions in the corpus:

- a volcanic crater lake reads as a **lake** (Lake Haruna)
- a river island reads as an **island** (Yeouido)
- a stratovolcano reads as a **volcano** (Mount Fuji) — and still appears under
  mountains, because a place carries every category its types license

`desert` (24 places), `viewpoint` (22) and `glacier` (16) exist so those places
can be labelled honestly. They will never reach a page threshold, and that is
the correct outcome rather than a reason to mislabel them.

## Classification rules

Driven by Wikidata structured types, in three tiers:

| Tier | Evidence | Places |
| --- | --- | --- |
| `high` | a curated P31 type in `TYPE_CATEGORIES` | 30,389 |
| `medium` | one P279 hop from a P31 value | 826 |
| `low` | only the English label of the type entity | 54 |
| `none` | vetoed, or no structured evidence | 1,274 |

Only `high` and `medium` are publishable. The `low` tier is retained for
inspection but excluded, because label matching on a type entity produces real
false positives — a place mis-linked to `parish in Prince Edward Island` would
otherwise become an island.

**A place name never adds a category.** "Lakeview Park" is typed `park`, so it
is a park. Names are consulted in exactly one direction: to *remove* a category
a type would otherwise license.

## Contamination

Three layers, all keyed on type entities rather than free text:

- **Hard type vetoes** apply however else a place is typed. Artificial islands,
  botanical gardens, arboreta, golf courses, resorts, power stations,
  observation towers. Canvey Island is typed both `town` and `river island`,
  and it is a town.
- **Soft type vetoes** apply only when nothing curated matched. These describe
  a designation layered on top of a place rather than what it is — `cultural
  heritage`, `cultural landscape`, `mesoregion`, `region`, `tourist
  destination`. Applying them unconditionally deleted Peneda-Gerês National
  Park, which is typed both `national park` and `cultural heritage`.
- **Landmass entities**, a short explicit list: the Korean and Iberian
  Peninsulas, Anatolia, the Alps as a whole, the Amazon rainforest, the
  Caucasus. Nobody spends a weekend at "the Iberian Peninsula".

An **area threshold was considered and rejected**. Wikidata P2046 units are
inconsistent across exactly these entities — Haut-Languedoc publishes
`307,183,804` with unit `hectare`, three orders of magnitude out — so an area
gate would encode a wrong number as a rule.

1,274 places are excluded as contamination or unclassifiable; 54 more sit in
the withheld `low` tier.

## Distances

Great-circle kilometres between two published coordinates. Nothing here
produces a travel time, because the repository has no routing or timetable
data, and every rendered string says "km" or "mi".

Band boundaries reproduce the corpus's own `distanceBand` vocabulary measured
against real coordinates — existing `nearby` records reach a p99 of 59 km,
`regional` spans 60–120 km, `longer_weekend` begins at 122 km:

| Band | Range |
| --- | --- |
| Nearby | ≤ 60 km |
| Day-trip distance | 60–120 km |
| Weekend distance | > 120 km, capped at 300 km |

The 300 km cap drops 42 city-place edges (0.1%).

Below one kilometre the rounded value is 0, and "about 0 km" reads as a broken
number, so the sub-kilometre case is worded — "under 1 km from the city
centre". Seventy-four places sit that close.

## Publication thresholds

| Page | Rule | Published |
| --- | --- | --- |
| `/cities/[city]/nature` | ≥ 5 places **and** ≥ 3 distinct categories | 3,540 |
| `/cities/[city]/lakes` etc. | ≥ 4 places in that category | 2,891 |

A dedicated page stands on its own evidence and is deliberately **not** gated
behind the hub: Cusco has seven classified mountains and nothing else, so it
earns `/mountains` while `/nature` — whose entire job is grouping — has nothing
to group and is correctly withheld.

Dropping the dedicated threshold to three would add 1,867 pages whose median
content is a three-card list. That is route count, not value.

`protected-areas` aggregates `national-park` and `nature-reserve`; splitting
them produces two thin pages where the reader wants one.

## Coverage

Every one of the 4,444 indexed cities now has at least one classified nature
place. The gaps this layer shipped with were closed by the V3 corpus recovery
(`scripts/nature-v3/`, documented in its own README), not by relaxing any gate:

| | V2 | V3 |
| --- | --- | --- |
| cities with zero coverage | 103 | **0** |
| nature hubs | 3,540 | **3,759** |
| beach pages | 59 | **324** |
| dedicated category pages | 2,891 | **3,265** |

V4 (`scripts/nature-v4/`) then closed the two remaining weak categories the same
way — by recovering source coverage, not by moving a bar:

| | V3 | V4 |
| --- | --- | --- |
| forest pages | 83 | **1,840** |
| waterfall pages | 10 | **1,503** |
| nature hubs | 3,759 | **4,094** |
| total nature routes | 7,024 | **11,220** |

The thresholds are unchanged. Lisbon still has no `/beaches` page because it
has three verified beaches and the bar is four — that is the gate working, not
a gap.

Two classes of defect were repaired at source rather than worked around: 52
records wired to the wrong Wikidata entity, and the discovery-graph distances
that described the wrong point for cities such as Hradec Králové. Records whose
correct entity could not be established safely stay excluded rather than
guessed.

## Validation

`npm run validate:nature-discovery` re-derives the entire layer from source
with its own parser, haversine and threshold arithmetic, then holds both the
engine and the exported HTML to that result. Twenty-one checks covering
referential integrity, taxonomy closure, duplicates, contamination, coordinate
range, distance and band agreement, thresholds in both directions, cross-border
country validity, image attribution, ordering, sitemap parity, rendered-page
structure, superlative copy, and travel-time claims.

`--self-test` additionally poisons eight gates and fails if any of them does
not fire.
