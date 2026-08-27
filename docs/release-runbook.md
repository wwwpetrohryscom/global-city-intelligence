# Batch release runbook

For the five-wave local batch. **Nothing in this document has been executed.**
It is written to be followed by the owner, or by an agent with explicit
per-step approval.

## Preconditions (all must hold before step 1)

| Gate | Required | How to check |
| --- | --- | --- |
| Local commits | exactly 5 ahead of `origin/main`, 0 behind, 0 merges | `git rev-list --left-right --count origin/main...HEAD` |
| Owner file | `components/tools/CostOfLivingCalculator.tsx` modified, unstaged, not in any commit | `git diff --name-only origin/main..HEAD \| grep -c CostOfLiving` → `0` |
| Clean build | two consecutive clean builds, identical output | `scripts/release/build-probe.sh` |
| Validators | 23/23 PASS | see the master run in this document |
| Netlify CLI | **installed and authenticated** — it is NOT installed on this machine | `netlify --version`, `netlify status` |
| Site id | known, and passed explicitly — this checkout is **not linked** | no `.netlify/state.json` present |

## Release steps

1. **Push the batch branch.** `git push -u origin feat/nature-weekend-expansion-v2`
   Nothing else in the repo changes. Netlify is disconnected from GitHub, so a
   push cannot trigger a build.
2. **Open a PR** against `main`. Review the five commits as one batch.
3. **Merge** (squash is *not* appropriate here — the five commits are the audit
   trail; use a merge commit or rebase-merge).
4. **Pull merged main.** `git checkout main && git pull`
5. **Clean local static export.**
   `rm -rf .next out && NODE_OPTIONS=--max-old-space-size=12288 npm run build`
   Expect exit 0, ~7 minutes, 84,835 HTML files, 84,833 sitemap URLs.
6. **Validation.** Run the full validator master run. All 23 must pass.
   Confirm `out/` contains no `.netlify` directory, no functions, no
   `_middleware`.
7. **ONE manual draft deploy.** No `--prod`.
   `netlify deploy --dir=out --site <site-id> --no-build`
   Record the deploy id and the draft URL it prints.
8. **Wait for ready.** Do not start QA before the deploy reports complete. A
   17.8 GB / 169,774-file upload is not fast; see the upload estimate.
9. **Open draft access only if needed.** See the SSO runbook below. Record the
   previous value first.
10. **Full draft QA.** At minimum: the redirect table from
    `docs/release-runbook.md#redirect-acceptance`, ten sampled pages per wave,
    `/sitemap.xml` and every shard, and a 404 probe.
11. **Restore SSO** to its recorded previous value, and verify the draft is
    protected again *before* promoting.
12. **Promote the exact draft** that passed QA — never a fresh build.
13. **Production QA.** Repeat step 10 against `https://www.globalcityintelligence.com`.

## STOP conditions

Stop and do not continue if any of these occur:

- the clean export produces a page count other than 84,835 or a sitemap other
  than 84,833 without an explained cause
- any validator fails
- the deploy stalls with no progress for more than 30 minutes (see rollback)
- draft QA finds a redirect resolving to a 404, a chain, or a soft 200
- `out/` contains any function, edge function or middleware artifact
- SSO cannot be restored to its previous value

## Redirect acceptance

Every row must be a single 301 to a target that returns 200, with no chain:

| From | To |
| --- | --- |
| `/cities/alexandroupolis-gr` and `/cities/alexandroupolis-gr/*` | `/cities/alexandroupoli…` |
| `/cities/tromso-municipality` and `/cities/tromso-municipality/*` | `/cities/tromso…` |
| `/{air-quality,climate-risk,cost-of-living,energy,internet-speed,safety}/<retired>` | same module, canonical city |
| `/nearby-weekend-places/dadia-…-near-alexandroupolis-gr` | `…-near-alexandroupoli` |
| `/sitemap`, `/sitemap/xml`, `/sitemap/`, `/robots` | `/sitemap.xml`, `/robots.txt` |
| `https://globalcityintelligence.com/*` (forced) | `https://www.globalcityintelligence.com/:splat` |

All 17 non-host rules were rehearsed locally against
`scripts/release/netlify-harness.mjs` and passed with no chains.

## SSO / protection runbook

The site uses Netlify site-level password/SSO protection. From the prior
AgricultureID migration, one failure mode is known and must be avoided:

> `sso_login: true` returns 401 on the ACME challenge path and silently blocks
> certificate issuance, which surfaces later as a browser "may be impersonating"
> warning.

Procedure:

1. **Record the current value first** (`sso_login`, password protection, and
   whether protection applies to deploy previews). Write it into the release
   notes before changing anything.
2. Disable only what is needed, only for the draft, and only for the duration of
   draft QA.
3. **Restore the recorded value** and verify the draft is protected again.
4. Only then promote.

Never leave protection disabled across a promotion. This site has no ACME work
pending, but the rule stands because the failure is silent.

## Rollback plan

If post-promotion QA fails:

1. **Do not rebuild.** A rebuild during an incident costs another ~7 minutes
   locally plus a full upload, and changes the artifact under investigation.
2. **Restore the previous known-good deploy** from the Netlify deploy list
   (Deploys → the last deploy before this one → "Publish deploy"). This is an
   instant pointer change, not an upload.
3. Record the failing deploy id, then investigate locally against the same
   commit.
4. Only re-promote after the cause is fixed and a fresh draft passes QA.

**Record the current production deploy id before step 12** — that id is the
rollback target, and it is not recoverable from the local checkout.
