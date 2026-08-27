# City identity

One real city is one record. This document records how that is enforced and
what was consolidated when it was not.

## What counts as a duplicate

A name match is never enough. Consolidation requires that both records denote
the **same Wikidata entity** — the same `Q` id on the same point. Everything
else stays separate, including cases that look like duplicates:

| Case | Ruling |
| --- | --- |
| Same name, different country | separate (93 pairs) |
| Same name, same country, hundreds of km apart | separate (Portland OR/ME, Salem OR/MA, Columbus OH/GA, Decatur, Norwalk, Quincy, Rochester) |
| Municipality and its administrative centre, **distinct** entities | separate (Bærum Municipality / Sandvika; Sandnes / Sandnes Municipality) |
| Two records, **one** entity, one point | consolidated |

Diacritics and transliteration are candidate-discovery signals only. `Tromsø`
and `Tromso` are the same string after folding, and that is a reason to *look*,
never a reason to merge.

## Consolidated

| Retired | Canonical | Evidence |
| --- | --- | --- |
| `alexandroupolis-gr` | `alexandroupoli` | Both resolved to **Q190847** ("Alexandroupolis, city in Thrace, Greece"), identical coordinates. The canonical record carries a curated intro and no artificial country suffix; the retired one carried the generic auto-generated intro of a later wave. |
| `tromso-municipality` | `tromso` | Both resolved to **Q26087** ("Tromsø Municipality") on the same point, and **both carried municipality-scale population** (~77K / ~80K), so neither described the city proper. A distinct city entity exists (Q42328401) but no record used it. |

Both were wave artifacts: a later batch re-added an existing city under a
suffixed slug because the bare slug was taken.

## What a consolidation touches

Every downstream reference is repaired, never left dangling: 16 per-city
datasets, hero imagery, coordinates, the city discovery graph (node plus every
inbound edge), curated collections, and the nearby place records — which are
repointed to the canonical city and de-duplicated by Wikidata id so one feature
cannot appear twice on one city's page. Place **slugs are not renamed**: they
are published URLs and a slug is an opaque identifier, so renaming them would
cost redirects for no reader benefit.

## Retired slugs stay reachable

Retired slugs had been published, so each keeps a permanent 301 to its canonical
twin across every route family it had (`/cities/...`, and the six per-city
module routes). The mapping's source of truth is `lib/data/city-aliases.ts`,
which also resolves slugs read back from a visitor's browser — Saved Cities and
Recently Viewed collapse a retired slug into its canonical entry silently,
keeping the most recent visit rather than the first-written one.

## Coordinate collisions that are real

`scripts/validate-city-geometry.mjs` no longer carries a bare slug allowlist. A
collision must be declared with a reason and evidence naming the entities
involved, so a future collision cannot be waved through by adding a string.
One entry stands: Bærum Municipality (Q57076) and Sandvika (Q651744), where
Sandvika is `P1376` capital-of and `P131` located-in Bærum and the municipality's
published point sits in the town.

## Gate

`npm run validate:city-identity` — 12 checks: duplicate slugs, one entity per
city, unjustified coordinate collisions, same normalised name plus country plus
point, alias integrity, redirect chains, retired slugs reappearing in the corpus
or the sitemap, dangling references across the data layer, duplicate search-index
identity, redirect coverage, and published country counts against the corpus.
10 poisoned gates, all proven to fire.

The name normaliser folds `ø æ å ß ł đ þ ð œ` by hand before NFKD, because those
letters do not decompose: without it `Tromsø` normalises to `troms` and never
looks like `Tromso` — the exact pair the gate exists to catch.
