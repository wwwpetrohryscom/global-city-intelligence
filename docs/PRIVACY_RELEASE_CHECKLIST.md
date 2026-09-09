# Privacy release checklist

Phase 9.2 wrote a privacy policy, corrected the product copy that contradicted
it, and added gates that keep the two agreeing. **Nothing was deployed.**

This is what a release of that work has to get right.

## The blocker that comes first

**The operator is not identified.** Nothing in any of the three repositories
publishes a legal entity, a postal address or a contact route for privacy
questions. The page currently renders an explicit gap — it says the operator
and contact "have not yet been published here" — rather than inventing one,
because naming the wrong accountable party is worse than naming none.

Publishing a privacy policy that cannot say who is accountable is defensible
only as a temporary state. Before release, either:

- fill in `PRIVACY_OPERATOR.legalEntity`, `.postalAddress` and `.contact` in
  `lib/legal/privacy.ts` — the page renders them automatically and the gate
  reports the change; **or**
- release deliberately with the gap acknowledged, and close it next.

This is the owner's decision. It is not one this repository can make.

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

- [ ] `PRIVACY_OPERATOR` decided — filled in, or released with the gap knowingly
- [ ] `PRIVACY_PREPARED_ON` still reflects when the text was last changed
- [ ] `node scripts/validate-privacy.mjs` passes on the merged tree
- [ ] `node scripts/poison-privacy.mjs` passes
- [ ] Places `npm run validate:privacy-copy` passes
- [ ] Media `npm run validate:links` passes
- [ ] The Places release includes the personal map, not just the copy change

## After releasing

- [ ] `https://www.globalcityintelligence.com/privacy/` returns 200
- [ ] The footer link resolves on the main site, GCI Places and GCI Media
- [ ] `https://www.globalcityintelligence.com/places/saved/` returns 200
- [ ] The Saved page shows the corrected copy and its Privacy link
- [ ] The page appears in the sitemap
- [ ] No page anywhere loads a tracker it did not load before

## What this release does NOT do

It does not enable retention measurement. `RETENTION_ANALYTICS_ENABLED` stays
`false`, no tracker is added to GCI Places, and no new identifier is created by
any of this work.

Activation is Phase 9.3, and it is blocked on more than this release. See the
Places repository, `docs/RETENTION_ANALYTICS_ACTIVATION.md` — in particular the
consent question, which nothing here answers.
