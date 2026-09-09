# Operator and privacy ownership

**Status: UNRESOLVED. This is an owner decision, not an engineering one.**

The canonical privacy policy is written, gated and merged. It cannot be
published until this page names a real operator, because a policy that
misstates who is accountable is worse than one that admits a gap.

## What was searched, and what was found

Nothing. Across all three repositories — source, content, configuration and
documentation — and across every live surface:

| Looked at | Result |
|---|---|
| Main footer | `© Global City Intelligence` — a product name, not a legal entity |
| `lib/ecosystem/products.ts` | places GCI in the HELPERG family; no entity, no contact |
| `/about`, `/contact`, `/terms`, `/legal`, `/imprint`, `/impressum` | all 404 |
| `/blog/about` | exists; publishes no entity and no contact address |
| Every email address in the codebase | photographers', inside Wikimedia attribution strings |

## What must NOT be used to fill the gap

The operator was not, and must not be, inferred from GitHub repository
ownership, Git author identity, the Netlify account, the domain registrant,
billing details, WHOIS, another HELPERG product, or the footer copyright line.
None of those establishes who is legally accountable for the processing this
policy describes, and a plausible guess published as fact is the worst
available outcome.

## What is needed

Five values. `PRIVACY_OPERATOR` in `lib/legal/privacy.ts` renders them
automatically, and `scripts/validate-privacy.mjs` reports the change.

```
LEGAL ENTITY / OPERATOR:
PUBLIC BUSINESS ADDRESS:
PRIVACY CONTACT EMAIL:
GENERAL CONTACT EMAIL:
ENTITY COUNTRY:
```

Notes on each:

- **Legal entity** — the exact registered spelling, if there is a registered
  entity. If GCI is operated by an individual rather than a company, that is a
  legitimate answer and the page should say so plainly.
- **Public business address** — required in some jurisdictions, and a
  reasonable thing for a reader to be able to find. If none is to be published,
  say so and the page will not invent one.
- **Privacy contact** — a role address (`privacy@`, `legal@`) is preferable,
  but only if it actually exists and is monitored. A verified general contact
  is acceptable. **Do not create an alias because it looks professional.**
- **Entity country** — which law the operator sits under. Note this does not
  decide the consent posture: readers' jurisdictions do, and that analysis is
  already complete.

## What is deliberately not asked for

Registration numbers, tax identifiers and any other corporate detail the policy
does not need. Publishing more than is required is its own privacy failure.

## What this blocks, and what it does not

**Blocks:** publishing the privacy policy, and therefore the coordinated
privacy release, and therefore Phase 9.3.

**Does not block:** anything already built. The policy, the disclosures, the
consent architecture and the gates are all complete and correct; they are
waiting on one fact, not on more work.

## Effective date

The page's `PRIVACY_PREPARED_ON` records when the text was prepared, not when
it went live. Whoever publishes it should confirm the date still reflects the
text and set it if the wording changed in the meantime.

Covers all three products: the main site, GCI Places and GCI Media.
