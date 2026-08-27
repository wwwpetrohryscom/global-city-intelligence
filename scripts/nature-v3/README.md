# Nature corpus recovery V3

Recovers curated nature places for cities the earlier wave pipeline never
covered, and repairs the records and anchors that were quietly wrong. It adds
no route families and changes no publication threshold — the V2 gates
(hub: 5 places across 3 categories; dedicated page: 4 places; 300 km cap) are
untouched. Coverage improves only because the data does.

## Run order

```
python3 scripts/nature-v3/inventory.py          # who has nothing, and why
python3 scripts/nature-v3/harvest.py            # nature candidates, 58 countries
python3 scripts/nature-v3/harvest_coastal.py    # beach/coast candidates, all countries
python3 scripts/nature-v3/resolve.py            # zero-coverage cities
python3 scripts/nature-v3/coastal_audit.py      # which cities are coastal, by evidence
python3 scripts/nature-v3/resolve_coastal.py    # beaches for coastal cities that lack them
python3 scripts/nature-v3/repair_qids.py        # records wired to the wrong entity
python3 scripts/nature-v3/emit_corpus.py        # write into lib/data/nearby-places.ts
python3 scripts/nature-v3/sync_coord_cache.py   # cache <- committed coordinates
python3 scripts/nature-v3/repair_graph.py       # graph distances <- committed coordinates
# then regenerate the nature layer (scripts/nature/) and validate
```

## What changed versus the wave pipeline

**Discovery net.** The wave harvest required a P18 image statement, which is the
main reason whole regions produced nothing: the feature exists and is well
typed, it just has no image on the entity. V3 accepts P18 **or** a P373 Commons
category and recovers an image from the category. The licensing bar is
unchanged — 18% of recovered places came through this path.

**Dedup is per city, not global.** The wave pipeline blocked any QID already
used anywhere, which handed Mount Fuji to whichever city was processed first and
denied it to Tokyo. The corpus legitimately curates one feature for several
cities, and slugs stay unique because they embed the city.

**Selection is stratified and diversified.** Nearest-first alone fills a large
city with canalised urban rivers; pure notability gives Nagoya, Kyoto and Osaka
the same Tokyo-area set. One pass guarantees an entry per distance band, a
second fills locally, with caps per category and on rivers.

**A physical type outranks a designation.** The inherited filter treats
"heritage" as fatal, which rejected Mount Fuji — typed both `stratovolcano` and
`World Heritage Site`.

**Scale guard.** For classes whose extent can be continental — river,
peninsula, island, bay, mountain range, region — a very high interwiki count
means a landmass, not a destination: the Nile (245), the Ganges (179), Hokkaidō
(164), "Mainland Southeast Asia" (108). Point destinations are exempt, so Mount
Fuji (146) and the Cape of Good Hope (104) are unaffected.

**Coastal-ness is evidence, never a name.** A city counts as coastal when a real
sea-coast entity sits within 30 km. River and urban beaches are excluded —
without that, 193 Seine `riverfront` quais make Paris the most coastal city in
Europe.

## Repairs

- **Wrong entity IDs.** 71 records carried a QID that does not describe the
  place: Triberg Waterfalls typed `human`, Titisee a `Wikimedia location map
  template`, Lahinch Beach the village. 52 were re-resolved, accepted only when
  the replacement's own coordinate sits within 25 km of the published one. The
  19 without a safe replacement stay excluded rather than guessed.
- **Wrong graph geometry.** `lib/data/city-discovery-graph.ts` published
  distances that described the wrong point for a set of cities — Hradec
  Králové's edges fit a location ~130 km away near Prague. Every edge is
  recomputed from `lib/data/city-coordinates.ts`, which is the source of truth.
- **Coordinates are pinned.** `verify_city_coords.py` now re-verifies the
  published coordinate instead of re-choosing it. Re-deriving a city's position
  from a place set that was itself selected using that position is circular, and
  it misfired: it moved Nagoya 321 km east.

## Gates

`npm run validate:city-geometry` is new: coordinates finite and unique, graph
distances agreeing with the coordinates, no city anchored far from its own
curated places, no dangling or self edges. `npm run validate:nature-discovery`
gained beach false-positive and Commons-provenance checks. Both carry poisoned
self-tests.
