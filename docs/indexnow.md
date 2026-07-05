# IndexNow integration

[IndexNow](https://www.indexnow.org/) lets us instantly notify participating
search engines (Bing, Yandex, Seznam, Naver, and others — Google reads the
same pings via Bing) that URLs were **added or updated**, instead of waiting
for the next crawl. This document covers the whole setup: the key, the
verification file, manual submission, and the automatic post-deploy workflow.

## Moving parts

| Piece | Path | Purpose |
| --- | --- | --- |
| In-app service | `lib/seo/indexnow.ts` | Framework-free `submitUrls()` / `submitUrl()` — chunking, retries, timeout, dry-run. Callable from a route handler or server action. |
| CLI | `scripts/submit-indexnow.mjs` | Post-deploy / manual submission. Reads the sitemap index, supports category + recency filters. |
| Key file | `public/8e2602dca616482897f31f249aacf1ef.txt` | Public ownership proof. Served at `/<key>.txt`, body is **exactly** the key (32 bytes, no newline). |
| Post-deploy workflow | `.github/workflows/indexnow.yml` | Auto-submits updated URLs after a successful production deploy. |
| npm script | `npm run indexnow` | Thin alias for the CLI. |

## Required environment variable

```bash
INDEXNOW_KEY=8e2602dca616482897f31f249aacf1ef
```

- Set it in local `.env.local` (see `.env.example`) and in the production
  environment (Vercel → Project → Settings → Environment Variables).
- The key is **never hardcoded in application logic** — `lib/seo/indexnow.ts`
  and the CLI both read `process.env.INDEXNOW_KEY`. The only place the literal
  key appears is the public verification filename, which the IndexNow protocol
  requires.
- For the GitHub workflow, add the same value as an Actions **secret** named
  `INDEXNOW_KEY` (Settings → Secrets and variables → Actions).

### Key rotation

To rotate the key: generate a new one, add `public/<newkey>.txt` (body = the
key, no trailing newline), update `INDEXNOW_KEY` everywhere (local, Vercel,
Actions secret), and update `.env.example`. Old key files can stay in `public/`
harmlessly — IndexNow validates the specific key sent in each request payload.

## The verification endpoint

- **URL:** `https://www.globalcityintelligence.com/8e2602dca616482897f31f249aacf1ef.txt`
- **Body:** `8e2602dca616482897f31f249aacf1ef` (nothing else — no HTML, no JSON, no newline)
- Served as a static asset from `public/`, so it needs no route logic and
  returns `200 text/plain`.

`keyLocation` is derived automatically as `https://<host>/<INDEXNOW_KEY>.txt`,
so as long as the file exists and the env var matches, verification passes.

## Running a submission manually

```bash
# One or more explicit URLs
npm run indexnow -- https://www.globalcityintelligence.com/cities/norfolk

# Everything in the sitemap index (all shards)
npm run indexnow -- --sitemap

# Only URLs changed in the last 7 days (recommended for routine runs)
npm run indexnow -- --sitemap --recent=7

# Only the city-page shards, or a single shard category
npm run indexnow -- --cities
npm run indexnow -- --category=nearby

# Preview without sending anything
npm run indexnow -- --sitemap --recent=7 --dry-run
```

Notes:
- Requires `INDEXNOW_KEY` in the environment (or pass `--key=`).
- Host + sitemap base come from `NEXT_PUBLIC_SITE_URL` (defaults to the
  production origin). URLs whose host doesn't match are skipped, so a stray
  localhost URL can never be submitted.
- Exit code is non-zero if any batch fails, so CI can detect problems — but the
  post-deploy workflow treats failure as non-fatal (see below).

## Automatic submission after production deploys

`.github/workflows/indexnow.yml` runs **after** Vercel reports a successful
production deployment (via the `deployment_status` event), so the new build —
including its updated sitemap and any new routes — is already live when we ping.

- **What it submits:** `--sitemap --recent=7`, i.e. only URLs whose `<lastmod>`
  is within the last 7 days. This avoids re-submitting all ~40k URLs on every
  deploy (no spam) while still covering everything that actually changed.
- **After large sitemap / static-route changes:** trigger the workflow manually
  from the Actions tab (**Run workflow → scope: `full-sitemap`**) to submit
  every URL once. Use `recent` for day-to-day deploys.
- **Production-safe:**
  - Runs as its own workflow — it can never block or fail a build/deploy.
  - `continue-on-error` on the submit step: an IndexNow outage logs a warning
    but does not mark the run red.
  - `concurrency` group prevents two submissions running at once.
  - Skips (with a warning, not an error) if `INDEXNOW_KEY` is missing.
  - Only production deploys trigger it; preview deploys are ignored.
- **Logging:** each batch prints `OK`/`FAILED` with HTTP status and attempt
  count; the final line reports `N/total URLs submitted`.

### Alternative trigger (no GitHub Actions)

If you prefer a Vercel-native trigger, add a
[Vercel Deploy Hook](https://vercel.com/docs/deployments/deploy-hooks) or a
`vercel.json` cron that calls a small route wrapping `submitUrls()` from
`lib/seo/indexnow.ts`. The workflow above is the default because it needs no
extra runtime surface and keeps submission fully decoupled from the app.

## Do NOT submit during build

IndexNow is a *post-publish* notification. Never call it from `next build` or a
`postbuild` hook: the URLs aren't live yet, and a slow/oustage IndexNow call
would delay or break the build. Submission only happens from the CLI or the
post-deploy workflow.
