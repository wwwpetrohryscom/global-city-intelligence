# Forest + waterfall recovery V4

Improves the two categories the nature layer was weakest in — 83 forest pages
and 10 waterfall pages — by recovering verified source coverage. No threshold
changed: a hub still needs 5 places across 3 categories, a dedicated page still
needs 4, the cap is still 300 km, and low-confidence entities stay unpublished.

## What the audit found

The bottleneck was **not** classification, images or geography. 1,499 forests
and 616 waterfalls were already published and correctly typed; only ~57 forest
and ~17 waterfall candidates were being lost to vetoes. What was missing was
density: each city carried one or two, and the bar is four.

| | before | after |
| --- | --- | --- |
| forest pages | 83 | **1,840** |
| waterfall pages | 10 | **1,503** |

Ontology gaps were real but tiny — 15 forest places across 8 unmapped types,
and for waterfalls nothing legitimate at all (the only unmapped types were
`artificial waterfall` and `former waterfall`, both correctly rejected). Every
added type is listed explicitly in `scripts/nature/taxonomy.py`.

## Search radius

Candidates are taken from within **120 km**, deliberately tighter than the
layer's 300 km cap. A "Forests near X" page whose every entry sits 280 km away
is within policy and still not worth publishing. Cities that cannot reach four
verified entities inside 120 km get no page — São Paulo, Cape Town, Porto and
Vancouver all withhold forests on that basis, with no special-casing.

## Per-city target

Five: the bar plus one spare. Measured: the page count is **identical** whether
cities are topped up to 4, 5 or 6, because everything past the bar is an extra
card rather than an extra page. Topping up to 6 would have added 2,850 corpus
records and zero pages.

## Traversal

Bounded P31/P279* from an explicit root list, never open-ended recursion:

- **forest** — forest, woodland, national forest, state forest, forest reserve,
  protection forest, urban forest, royal forest, old-growth forest, rainforest,
  taiga, cloud forest, grove, tropical forest, US National Forest, protected
  forest
- **waterfall** — waterfall, cascade, cataract, waterfall group

## Contamination

Forest labels are ambiguous — "Forest" is a surname, a company and a railway
station as often as it is woodland — so disqualifiers are judged on **direct
P31 types only**. Positive evidence may come from a superclass (that is the
taxonomy's `medium` tier), but an inherited class must never disqualify: real
forests routinely carry an administrative co-type whose distant superclass is
`human settlement`. Barsberge is typed both `forest` and `dwelling place`;
Dainohara Forest Park is a `forest park` and a Japanese `chōchō`. Judging those
on inherited classes deleted real forests, so it does not.

Water infrastructure is the mirror case. Wikidata types both "Lake Trahlyta
Spillway" and "Roaring Meg Power Station Waterfall" as `waterfall`, so type
evidence alone cannot separate them from real falls. Those names are rejected
explicitly — a name may reject a classification, never create one.

## Gates

`validate:nature-discovery` gained seven forest/waterfall gates: artificial
water types, waterfall without waterfall evidence, forest without forest
evidence, forest from a disqualifying direct type, non-place entity types,
duplicate forest/waterfall per city, and water infrastructure named as a
waterfall. 24 poisoned gates across the validator, all proven to fire.
