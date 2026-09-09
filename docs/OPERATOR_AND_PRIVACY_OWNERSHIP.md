# Operator and privacy ownership

**Status: RESOLVED by explicit owner directive, 2026-09-09.**

Global City Intelligence is operated by **HELPERG LLC**.

```
LEGAL ENTITY / OPERATOR:  HELPERG LLC
PUBLIC BUSINESS ADDRESS:  30 N Gould St Ste N
                          Sheridan, WY 82801
                          United States
PRIVACY CONTACT EMAIL:    info@helperg.com
GENERAL CONTACT EMAIL:    info@helperg.com
ENTITY COUNTRY:           United States
```

These values live in `PRIVACY_OPERATOR` in `lib/legal/privacy.ts`. The privacy
page renders them from there, and `scripts/validate-privacy.mjs` fails the
build if the contract publishes an operator the page does not name — a contract
nobody can read is the same failure as no contract, dressed as a resolution.

## Where these came from

**An explicit owner directive**, and nothing else.

The operator was **not** inferred from GitHub repository ownership, Git author
identity, the Netlify account, the domain registrant, billing details, WHOIS,
another product in the HELPERG family, or the footer copyright line. None of
those establishes who is legally accountable for the processing this policy
describes, and a plausible guess published as fact would have been the worst
available outcome — it looks settled while being unverified.

Before the directive, a search across all three repositories and every live
surface found nothing: `/about`, `/contact`, `/terms`, `/legal` and `/imprint`
all 404, `/blog/about` published neither, and the only email addresses in the
codebase belonged to photographers inside Wikimedia attribution strings. The
page rendered an explicit gap for exactly as long as that was true.

## One mailbox, deliberately

`info@helperg.com` takes both privacy and general enquiries, and the page says
so rather than implying a dedicated privacy desk.

**No `privacy@` alias was invented.** A role address that looks official and
bounces is worse than a plain one somebody reads — it turns a working contact
route into a dead end at precisely the moment a reader needs it. If a dedicated
mailbox is configured later, change `PRIVACY_OPERATOR.contact` and set
`contactIsShared` to `false`; the page adjusts its own wording.

## What is deliberately not published

Per the owner directive, and because a privacy policy that over-publishes is
its own privacy failure:

- no EIN or other tax identifier
- no registration or filing numbers
- no member, officer or beneficial-owner personal details
- no billing, hosting or repository ownership information

The policy needs an accountable entity, a place to write to, and a working
address. It has those. Anything further would be corporate detail published for
its own sake.

## What this unblocked

Publishing the privacy policy, and therefore the coordinated privacy release.

It does **not** enable measurement. `RETENTION_ANALYTICS_ENABLED` stays `false`
and no tracker is loaded; naming the operator resolved an accountability
question, not a consent one. Consent was settled separately as `GLOBAL_OPT_IN`
— see the Places repository, `docs/ANALYTICS_CONSENT_DECISION.md`.

Phase 9.3 remains blocked on one thing: the policy has to be **live**, not
merged.

## Effective date

`PRIVACY_PREPARED_ON` records when the text was prepared;
`PRIVACY_OPERATOR_DECIDED_ON` records when the owner supplied these details.
Neither is the date the page went live. Whoever publishes it should confirm the
prepared date still reflects the text.

Covers all three products: the main site, GCI Places and GCI Media.
