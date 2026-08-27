# Batch release — operational preflight

Recorded state for the five-wave batch plus the release-hardening commit.
**Nothing here has been executed against production.** No upload, no promotion,
no configuration change.

## Target

| | |
| --- | --- |
| Site name | `globalcityintelligence` |
| Site ID | `85ce5e66-cc2a-47b1-9271-26e5374089ee` |
| Team | `hello13hub@gmail.com` |
| Production URL | `https://www.globalcityintelligence.com` |
| Custom domain | `www.globalcityintelligence.com` |
| Domain alias | `globalcityintelligence.com` (301 → www, verified live) |
| TLS | valid, `notAfter Nov 11 2026`, `force_ssl: true` |

## Architecture, as verified read-only

| Expectation | Actual |
| --- | --- |
| Git repo linkage | **NONE** — `repo_url`, `provider`, `installation_id` all absent |
| Build command | **NONE** |
| Plugins | **`[]`** |
| Functions | **0** |
| Edge Functions | **none declared** |

A push therefore cannot trigger a build. The model is manual prebuilt artifact,
exactly as `netlify.toml` documents.

## ROLLBACK_DEPLOY_ID

```
6a863e9dcfd3426bbf394410
```

- state `ready`, published `2026-08-20T00:58:07Z`
- built from commit `84dd393`, title *"city intelligence scorecard v1 from main 84dd393"*
- 0 functions, 0 edge functions
- its own deploy took **4,551 s = 75.8 min**

**Production is one merge behind `origin/main`.** It serves `84dd393`; `origin/main`
is `916e7e0` (the similar-cities merge, PR #42), which has never been deployed —
confirmed live: `/cities/porto` contains no similar-cities block. This release
therefore ships similar-cities *and* the six local commits.

Production health, checked live: `/`, `/cities/tokyo`, `/countries`,
`/robots.txt`, `/sitemap.xml` all 200; an invalid city route returns a real 404;
apex 301s to www.

Production sitemap today: **73,549 URLs across 10 shards**. After release:
**84,833 across 11** (+11,284, +15.3%; the new shard is `nature`).

## SSO

```
sso_login          : true
sso_login_context  : non_production
password           : not set
```

Production is public; **deploy previews and drafts are SSO-protected**. Draft QA
will therefore need either an authenticated browser session or a temporary
change. Record these two values verbatim before touching anything.

## The future draft command — constructed, not run

```
cd ~/global-city-intelligence
npx -y netlify-cli@27.1.2 deploy \
  --dir=out \
  --site 85ce5e66-cc2a-47b1-9271-26e5374089ee \
  --no-build
```

No `--prod`. No `--build`. `netlify-cli` is pinned to **27.1.2**: `latest`
(27.4.0) and 27.3.1 both fail to install here — npm cannot resolve
`@netlify/ai@^1.0.1`.

## Upload monitoring

Three independent signals; the deploy is declared unhealthy only when **several
agree**, never on one.

1. **Process tree, by PID not by name.** Capture the CLI's PID when it starts
   (`$!`) and watch that PID and its descendants. Do not `pgrep "ntl deploy"` —
   npx runs `.bin/netlify`, so a name match proves nothing either way.
2. **CLI stdout/stderr**, tee'd to a log and tailed. This is the only place
   per-file upload progress appears.
3. **Deploy state via API**, polled every 60–120 s once a deploy id is known:
   `netlify api getDeploy --data '{"deploy_id":"<id>"}'` → `state`. Terminal
   states are `ready` and `error`.

Supporting: cumulative bytes over long windows (10+ min), not instantaneous
rate. Do not use `nettop -L 1` as a "one sample" — it blocks ~50 s and will be
mistaken for a hang.

### Alert conditions

Escalate only on:

- deploy `state = error`, or the server cancels the deploy
- CLI exits non-zero
- **no** uploaded-file/byte progress for a sustained interval (≥ 30 min)
- a repeating HTTP/API error in the CLI log

### Explicit non-conditions

Do **not** cancel because early average MB/s looks low. Recorded history: a
healthy full deploy took ~78 min; one healthy run was slow for ~55 min then
finished quickly; the rollback target itself took 75.8 min. **No automatic
restart** — a restart costs a full re-upload.

## Draft QA plan (run after the draft reaches `ready`)

| Group | Checks |
| --- | --- |
| Valid routes (30) | home, `/cities`, `/countries`, 5 city overviews, nature hub, forests, waterfalls, beaches, islands, parks, protected-areas, mountains, lakes, nearby-weekend-places, weekend-trip, visual-guide, 6 module routes, `/explore-cities`, `/compare-cities`, a comparison, a ranking, a theme, a collection |
| Invalid routes (30) | fake cities, malformed nature paths, `wp-admin`, `.env`, `.git/config`, API-ish paths, nested fakes → all real 404 |
| Identity redirects | both retired cities + wildcards + 6 module families + the retired place-detail page → single 301 → 200, no chain |
| Cosmetic redirects | `/sitemap`, `/sitemap/xml`, `/sitemap/`, `/robots` |
| Waves | nature V2/V3/V4 pages, reachability blocks on overview + nearby + weekend-trip, scorecard, similar cities |
| Sitemap | index lists 11 shards; **84,833** URLs total; 0 duplicates; 0 retired slugs |
| Canonical | every sampled page canonical on `www.globalcityintelligence.com`; no `netlify.app` |
| Assets | CSS + JS chunks 200; shared First Load JS 102 kB |
| Runtime | Functions 0, Edge Functions 0 on the deploy record |

Promotion is blocked until every group passes.

## Promotion

Publish the **exact draft that passed QA** — never a second upload, never
`--prod`, never a rebuild:

```
npx -y netlify-cli@27.1.2 api restoreSiteDeploy \
  --data '{"site_id":"85ce5e66-cc2a-47b1-9271-26e5374089ee","deploy_id":"<DRAFT_DEPLOY_ID>"}'
```

(or Netlify UI → Deploys → the draft → *Publish deploy*.)

Then repeat the QA suite against the production host.

## Rollback

If production QA fails:

```
npx -y netlify-cli@27.1.2 api restoreSiteDeploy \
  --data '{"site_id":"85ce5e66-cc2a-47b1-9271-26e5374089ee","deploy_id":"6a863e9dcfd3426bbf394410"}'
```

This is a pointer change, not an upload. **Do not rebuild during an incident.**

## Git release sequence

One push, one PR, one merge, one artifact:

1. `git push -u origin feat/nature-weekend-expansion-v2` — safe: Netlify has no
   Git linkage, so this cannot trigger a build.
2. Open **one** PR containing all six commits.
3. Verify the PR diff equals `origin/main..HEAD` — 113 files at audit time.
4. Merge once (**not** squash — the six commits are the audit trail).
5. `git checkout main && git pull`.
6. Rebuild only if the merge commit changes content; the build id is derived
   from the commit, so a merge **will** change every file's build id and the
   artifact must be rebuilt from merged `main` before deploying.
7. Manual draft deploy, per the command above.

No per-wave pushes. No per-wave deploys.
