# Privacy release checklist

Phase 9.2 wrote a privacy policy, corrected the product copy that contradicted
it, and added gates that keep the two agreeing. **Nothing was deployed.**

This is what a release of that work has to get right.

## Consent is resolved

Phase 9.2A settled the global posture as **`GLOBAL_OPT_IN`** and implemented it
in GCI Places: a first-party preference, Do Not Track and Global Privacy
Control read by GCI's own code and outranking a stored grant, and a refusal
that leaves saved places, lists, pins and notes untouched. Measurement is still
switched off and no tracker is loaded.

The sources and the condition-by-condition analysis are in the Places
repository, `docs/ANALYTICS_CONSENT_DECISION.md`.

## The operator is named

**Global City Intelligence is operated by HELPERG LLC**, 30 N Gould St Ste N,
Sheridan, WY 82801, United States, reachable at `info@helperg.com` — supplied
as an explicit owner directive on 2026-09-09, not inferred from anything. The
page names it, and the gate fails if it stops doing so. See
`docs/OPERATOR_AND_PRIVACY_OWNERSHIP.md`.

That was the blocker on publishing. **The policy is releasable.**

One blocker remains before Phase 9.3, and it is this release: the policy has to
be live, not merged.

## Release order, and why it matters more than usual

The three products ship separately, and one ordering produces a window where
the policy is wrong.

**GCI Places' personal map is merged but NOT deployed.** Production Places has
no Save control and `/places/saved/` returns 404 — Phases 8, 9 and 9.1 were all
built under "no deploy". The policy describes saved places, lists, pins and
notes because they ship in the same window, not because they are live today.

So:

1. **Places first.** Deploy the personal map together with its corrected
   privacy copy. Its footer link to `/privacy` will 404 for as long as step 2
   takes — a broken link, visible, and fixed within the window.
2. **Main immediately after.** The policy goes live and the link resolves. From
   this moment every sentence about GCI Places is true, because the features it
   describes are deployed.
3. **Media last.** A one-line footer link; nothing depends on it.

The alternative — Main first — puts a live privacy policy describing a personal
map that does not exist in front of readers for the length of the window. A
temporarily broken link is the smaller wrong: it is obviously an error, where a
policy describing absent features looks authoritative and is not.

**Keep the window short.** Both deploys in one session.

## Before releasing

- [x] `PRIVACY_OPERATOR` decided — HELPERG LLC, by owner directive 2026-09-09
- [ ] `PRIVACY_PREPARED_ON` still reflects when the text was last changed
- [ ] `info@helperg.com` is monitored, and whoever reads it knows privacy
      questions arrive there
- [ ] `node scripts/validate-privacy.mjs` passes on the merged tree
- [ ] `node scripts/poison-privacy.mjs` passes
- [ ] Places `npm run validate:privacy-copy` passes
- [ ] Places `npm run validate:consent` and `npm run validate:readiness` pass
- [ ] Media `npm run validate:links` passes
- [ ] The Places release includes the personal map, not just the copy change

## After releasing

- [ ] `https://www.globalcityintelligence.com/privacy/` returns 200
- [ ] The footer link resolves on the main site, GCI Places and GCI Media
- [ ] `https://www.globalcityintelligence.com/places/saved/` returns 200
- [ ] The Saved page shows the corrected copy, its Privacy link and the
      Analytics preferences panel
- [ ] A first visit shows the analytics ask; declining leaves Save working
- [ ] The page appears in the sitemap
- [ ] No page anywhere loads a tracker it did not load before

## What this release does NOT do

It does not enable retention measurement. `RETENTION_ANALYTICS_ENABLED` stays
`false`, no tracker is added to GCI Places, and no new identifier is created by
any of this work — including for readers who choose "Allow analytics", whose
answer is recorded as authorisation for a future release and acted on by
nothing today.

Activation is Phase 9.3, and it is blocked on more than this release: the
policy must be LIVE, and the operator must be named. See the Places repository,
`docs/RETENTION_ANALYTICS_ACTIVATION.md`.
