# Main-site integration for GCI Media (/blog/*)

**Status: PREPARED, NOT DEPLOYED.** This branch (`feat/blog-proxy-integration`) is the entire
main-site footprint of the editorial product. It is 34 lines across two files.

## What this changes

| File | Change |
|---|---|
| `netlify.toml` | One `[[redirects]]` rule proxying `/blog/*` to the GCI Media Netlify site |
| `components/layout/site-header.tsx` | One nav item, "Analysis", pointing at `/blog/` |

Nothing else. No new dependency, no new route, no data-layer change, no sitemap change.

## Why the blog is a separate deployment

This artifact is 84,835 pages / 169,774 files / 17.82 GB, and a release costs a ~450 s build
plus a ~90 minute upload. An editorial product publishes far more often than that allows.
Splitting the deployment means **publishing an article never touches this repository**.

## Why the nav link is a literal path

`{ href: "/blog/", label: "Analysis" }` is deliberately **not** a `staticRoutes` entry. This
application generates no `/blog` route — the path only exists at the CDN edge, via the proxy.
Adding it to the route registry would make the SEO route model assert a page this build never
produces, which the `seo:*` gates would then either flag or, worse, silently vouch for.

## Before deploying

1. ~~Replace `<blog-origin>`~~ — **done**: the origin is `globalcityintelligence-blog.netlify.app` (`gci-blog` was already taken by an unrelated Netlify site).
2. ~~Confirm same Netlify team~~ — **verified**: both sites are in account `hello13hub` (`6a78a80749ba941ee3e25380`); it is the only team on the login.
3. ~~Confirm the origin is unprotected~~ — **done, and it was not**: the new site inherited the
   team default `sso_login: true` / `sso_login_context: all`, which protects production. It was
   set to `sso_login: false` on the blog site only. The main GCI site was not touched.
4. Ship inside a normal main-site release window. This site deploys as a manual 18 GB artifact
   upload; it must not be a surprise deploy.

## Verified impact on this repository

Measured with a full clean build on this branch:

| Check | Before | After |
|---|---|---|
| HTML pages | 84,835 | 84,835 |
| Total files | 169,774 | 169,774 |
| Sitemap URLs | 84,833 | 84,833 |
| Netlify Functions | 0 | 0 |
| Edge Functions | 0 | 0 |
| `/blog` files in artifact | 0 | 0 |

The proxy rule lives only in `netlify.toml`, which is CDN configuration and is not part of the
generated artifact, so the exported site is byte-for-byte unaffected except for the one extra
nav link.

## Rollback

Delete the `[[redirects]]` block and redeploy. `/blog/*` then 404s on the main domain; the blog
origin keeps serving independently. No main-site route is affected at any point.
