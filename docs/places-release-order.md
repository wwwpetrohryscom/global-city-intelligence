# Release order: turning on GCI Places

**Status: blocked.** `PLACES_PUBLIC_LINKING_BLOCKED_UNTIL_PLACES_RELEASE`

`https://www.globalcityintelligence.com/places/` returns 404 (verified
2026-09-08). The navigation work for Places is complete and merged behind a
switch; what is missing is the public surface itself.

## Why the links are switched off rather than shipped

A link in the global navigation of an 84,000-page site is not a promise that
can be broken cheaply. Shipping `/places` before the proxy exists would put a
404 in the header of every page, in the footer of every page, and on every city
page — and search engines would index it there. The switch costs one constant;
the alternative costs a sitewide broken link.

## Order of operations

1. **Deploy GCI Places.** From `globalcityintelligence-places`: `npm run gates`,
   then a manual artifact deploy of `out/` to its own Netlify site. It is an
   independent static deployment and must stay one — do not couple its build to
   the main artifact.
2. **Disable SSO on the Places site.** Netlify's `sso_login` defaults to true on
   new sites and returns 401 to a proxy origin, which presents as a broken
   rewrite rather than an auth error.
3. **Add the rewrite** to the main repository's `netlify.toml`, alongside the
   existing `/blog` pair — two rules, because a `/places/*` splat does not
   reliably match the bare `/places`:

   ```toml
   [[redirects]]
     from = "/places"
     to = "https://<places-site>.netlify.app/places"
     status = 200
     force = true

   [[redirects]]
     from = "/places/*"
     to = "https://<places-site>.netlify.app/places/:splat"
     status = 200
     force = true
   ```

4. **Verify** `/places/`, `/places/singapore/` and one deep place URL return 200
   on the canonical host with no redirect.
5. **Refresh the manifest** if the Places corpus changed:
   `npx tsx scripts/export-nav-manifest.ts ../global-city-intelligence/lib/navigation/places-manifest.json`
6. **Flip `PLACES_PUBLIC` to `true`** in all three repositories:
   - `global-city-intelligence` — `lib/navigation/ecosystem.ts`
   - `global-city-intelligence-blog` — `src/data/ecosystem.ts`
   - `globalcityintelligence-places` — `src/lib/ecosystem.ts`
7. **Rebuild and redeploy** GCI Media, then the main application (main last: it
   is the largest artifact and the one whose navigation references the others).
8. **Re-run** `npm run validate:navigation -- --out out` in the main repository.
   With the switch on, it asserts the inverse of what it asserts today: that
   Places links are present, and that every city-scoped one is in the manifest.
