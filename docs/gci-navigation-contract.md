# The GCI navigation contract

Global City Intelligence is three independently deployed products that must
read as one site:

| Product | Repository | Framework | Public surface |
| --- | --- | --- | --- |
| Main application | `global-city-intelligence` | Next.js static export | `www.globalcityintelligence.com` |
| GCI Media | `global-city-intelligence-blog` | Astro | `/blog/*` (Netlify rewrite, live) |
| GCI Places | `globalcityintelligence-places` | Next.js static export | `/places/*` (**not yet proxied**) |

There is deliberately **no runtime dependency** between them. Each repository
keeps its own copy of the contract in its own idiom, and each has a validator
that checks its copy. What is shared is the content: the same destinations,
the same labels, the same canonical URLs, in the same order.

## Where the contract lives

| Repository | File |
| --- | --- |
| Main | `lib/navigation/ecosystem.ts` |
| Media | `src/data/ecosystem.ts` |
| Places | `src/lib/ecosystem.ts` |

## The destinations

| id | Label | Canonical path | Served by |
| --- | --- | --- | --- |
| `cities` | Cities | `/cities` | main |
| `countries` | Countries | `/countries` | main |
| `places` | Places | `/places` | GCI Places |
| `rankings` | Rankings | `/rankings` | main |
| `compare` | Compare | `/compare` | main |
| `best-cities` | Best Cities | `/best-cities` | main |
| `city-finder` | City Finder | `/explore-cities` | main |
| `methodology` | Methodology | `/methodology` | main |
| `data-sources` | Data Sources | `/data-sources` | main |
| `blog` | Blog | `/blog` | GCI Media |

Every path is domain-relative. No product may link to another product's
deployment origin (`*.netlify.app`); the canonical host is the only public
identity, and the validators fail the build on an origin leak or on `http://`.

## The Places release switch

`PLACES_PUBLIC` is `false` in all three repositories.

`www.globalcityintelligence.com/places/` returns **404** (verified 2026-09-08):
GCI Places has no `/places/*` rewrite in the main site's `netlify.toml` and no
public deployment. Until it has both, every Places link in the ecosystem is
suppressed — the navigation renders without Places rather than shipping a link
that 404s for every visitor.

Turning Places on is a one-constant change per repository, followed by a
rebuild and redeploy. See `docs/places-release-order.md`.

## Which cities have Places coverage

`lib/navigation/places-manifest.json` is **generated** by the Places
repository:

```
cd ../globalcityintelligence-places
npx tsx scripts/export-nav-manifest.ts ../global-city-intelligence/lib/navigation/places-manifest.json
```

It is derived from the same published-only accessors the Places routes use, so
a city cannot appear in it without publishing a hub. This committed file is the
entire coupling between the two products.

A city that is not in the manifest never receives a `/places/<slug>/` link.

## Route builders

Cross-product URLs are built in one place, never assembled inline:

- `cityRoute(slug)`, `countryRoute(slug)`, `rankingRoute(slug)` — `lib/seo/routes.ts`
- `placesCityUrl(slug)`, `placesIndexUrl()`, `blogUrl(path)` — `lib/navigation/ecosystem.ts`

## Gates

```
npm run validate:navigation                 # contract, registries, featured slugs, sort defaults
npm run validate:navigation -- --out out    # the same rules against the emitted HTML
npm run validate:country-economics          # the economic snapshot
```

`--out` mode is the one that proves the product. Registries can agree with one
another perfectly while the rendered footer contains something else.
