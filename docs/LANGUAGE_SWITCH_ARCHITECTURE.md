# The language switch

How a reader moves between languages on this domain, and why it is built the way
it is. **The next language reuses this; it does not invent another switcher.**

## One truth, used twice

A page is available in another language if — and only if — a route pair exists
for it. That pair lives in exactly one place:

    lib/i18n/german-localization-pairs.json      2,757 English→German pairs

generated from the German edition's own route manifest at a recorded commit and
committed here. From it, two things are derived and **never a third**:

| consumer | what it emits |
|---|---|
| `createMetadata` | the `de-DE` / `en` / `x-default` hreflang cluster |
| `LanguageSwitcher` | the visible control a reader clicks |

There is no second registry, no heuristic path transformation, and no runtime
lookup. Deriving a German URL from a city name would be catastrophic here and is
worth stating plainly: Germany has 257 cities and 240 have a German profile;
1,542 module pages and 18 do. Inference would advertise thousands of alternates
to pages that do not exist — and a dead alternate is worse than none, because it
tells a search engine the translation is there.

## Why the switcher reads the page's own head

`LanguageSwitcher` takes its options from the `<link rel="alternate" hreflang>`
elements already present in the document.

That is not a shortcut. It makes *"the visible switch and the hreflang cluster
agree"* true **by construction** rather than by comparison — they are the same
DOM nodes. Every alternative design (threading a path through each route family,
a parallel map, a client-side registry) can drift the moment one page passes the
wrong value. This one has nothing to pass.

The mechanism was chosen after the architecture was examined, not before:

- Next's App Router gives a **server layout no way to know which page is
  rendering beneath it**, and this application's header lives in the root layout.
- The alternative was passing locale data through **~30 route families** by hand
  — more code, more places to be wrong, and a new way for the two to disagree.
- `PrimaryNav` in that header is already a client component, so the cost of one
  more is a component, not an architecture.

## What reaches the browser

| | |
|---|---|
| Route pairs shipped to the client | **0** of 2,757 |
| Completeness matrix shipped | **0** of 5,056 records |
| Runtime locale lookup / fetch | **none** |
| Shared JS before → after | 1,220 kB → **1,220 kB** (delta 0) |
| Per-page HTML cost | **+290 bytes** |

A page carries only its own two link elements — which it already needed for SEO.
The switcher's code sits in the layout chunk (30.8 kB total, shared by every
page), not in the shared bundle.

## Negative availability is the interesting half

A page with no translation renders **no control at all** — not a disabled one,
not one pointing at the English page it is already on. The gates check this
directly, against routes drawn from every deferral state the completeness matrix
records:

| control | why it must show nothing |
|---|---|
| `/cities/paris`, `/cities/madrid` | not German cities |
| `/air-quality/aachen` | `SOURCE_TEMPLATED_DEFERRED` |
| `/air-quality/augsburg` | `SOURCE_PLACEHOLDER_DEFERRED` |
| `/nearby-weekend-places/black-forest-national-park-near-karlsruhe` | one of the **33 substantive deferred** routes |
| `/collections/austria-germany-borderlands` | `ARCHITECTURE_DEFERRED` |

## The German side

The German edition renders its own switch server-side, from `findRoute()` on its
route manifest — the same manifest that generated the pair contract. Where the
page's own path IS known at render time, resolving it on the server is better,
and that edition knows its path. The two implementations consume one truth and
differ only in where they can read it.

## Accessibility and 320px

- semantic `<nav aria-label="Language">` with real links, never hover-only
- the current language is `aria-current` and carries `lang`
- an `sr-only` sentence announces the current language at every width
- focus is visible (`focus-visible:outline`)
- tap targets are at least 32px tall

**Below 360px the current-language label is hidden visually and kept in the
accessibility tree.** Brand, navigation, switch and search share one row, and
rendering "English · Deutsch" pushed that row 11px past a 320px viewport on
every page with a translation — measured in a browser, not guessed. The label a
reader cannot click is the one that gives way.

## Adding a language

1. That edition publishes its routes and generates a pair contract.
2. `createMetadata` emits its `hrefLang` alongside the existing ones.
3. Add the locale's label to `LOCALE_LABEL` in `LanguageSwitcher.tsx`.

Nothing else changes. The switcher has no knowledge of German — a gate asserts
that, reading the code with comments stripped, because an earlier version of the
rule failed the component for a doc comment that said it knows nothing about
Germany.

## Gates

| gate | proves |
|---|---|
| `scripts/validate-german-alternates.mjs` | every emitted alternate matches the contract, counts reconcile, no alternate lost its trailing slash, the switcher still reads hreflang, performs no runtime lookup, names no origin, excludes `x-default`, and `createMetadata` still consults the contract |
| `scripts/validate-proxy-routes.mjs` | `/de` and `/de/*` proxy to the German origin |
| `scripts/poison-locale-contract.mjs` | 13 injected defects, each caught by its own validator; `POISON_PRECHECK=1` proves every case still injects something |
| browser QA | the switch appears where a counterpart exists, is absent where none does, at 1280×900, 390×844 and 320px |

## Release discipline

Before any Main release build: `git fetch origin --prune`, and
`MAIN_BRANCH_BEHIND_ORIGIN_MAIN` must be **0** — an integration branch was once
cut from a local `main` five commits stale, and that artifact would have deleted
the production privacy policy. Stage explicit paths, never `git add -A`; the
owner's untracked file is recorded by checksum before work and verified after.

Promotion order: the German origin first, then Main. German pages must offer the
English switch before Main starts advertising a German one. Promote the exact
validated draft; never rebuild between QA and promotion.
