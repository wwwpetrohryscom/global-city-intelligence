# Nature discovery generators

Generate the two files the nature layer reads:

- `lib/data/city-coordinates.ts`
- `lib/data/nature-classification.ts`

Run order (steps 1–4 need network; the rest are offline and deterministic):

```
python3 scripts/nature/fetch_place_types.py     # Wikidata P31 + one P279 hop, per place QID
python3 scripts/nature/resolve_city_coords.py   # city candidates by label/altLabel + country
python3 scripts/nature/verify_city_coords.py    # pick + corroborate; writes the unresolved list
python3 scripts/nature/recover_city_coords.py   # wider net for cities with no candidate at all
python3 scripts/nature/verify_city_coords.py
python3 scripts/nature/repair_city_coords.py    # live-API candidates for cities the mirror mislabels
python3 scripts/nature/verify_city_coords.py
python3 scripts/nature/classify.py              # apply taxonomy.py to every place
python3 scripts/nature/emit_data.py             # write the two generated TS files
node    scripts/validate-nature-discovery.mjs --self-test
```

`verify_city_coords.py` runs three times on purpose: each recovery pass only
targets the cities the previous verification could not place, so it needs that
list to exist first. Re-running it is cheap and offline.

`taxonomy.py` holds every classification, veto and priority rule. It is the
only file to edit when a category or contamination rule changes — everything
downstream is derived.

`cache/` keeps the network-fetched inputs (`place-types.json`, `qids.json`,
`city-candidates.json`) so classification is reproducible offline. Derived
intermediates in the same directory are gitignored.

`verify_city_coords.py` also reports the cities where the published
`lib/data/city-discovery-graph.ts` disagrees with the place geometry. Those are
pre-existing corpus defects; the resolver never adopts the graph's answer.

See `docs/nature-discovery.md` for the design and the rules themselves.
