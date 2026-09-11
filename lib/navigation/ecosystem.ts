/**
 * THE GCI NAVIGATION CONTRACT (main application copy).
 *
 * Global City Intelligence is three independently deployed products — the main
 * data application, GCI Media (Astro, proxied at /blog) and GCI Places (Next,
 * to be proxied at /places) — that must read as ONE site.
 *
 * This file is the main application's copy of the shared contract. Each
 * repository keeps its own copy in its own idiom; there is deliberately NO
 * runtime dependency between them, because a static product must stay
 * independently deployable. What is shared is the CONTENT of the contract:
 * the same destinations, the same labels, the same canonical URLs, in the same
 * order. `scripts/validate-navigation.mjs` here and the equivalents in the
 * other two repositories check each copy against these values.
 *
 * Everything in this module is a literal. It imports no data layer, so the
 * header and footer that consume it cost nothing at build or render time
 * beyond the strings themselves.
 */

/** The one public identity. Every cross-product link resolves against it. */
export const CANONICAL_ORIGIN = "https://www.globalcityintelligence.com";

/**
 * GCI Places IS reachable on the canonical domain, as of 2026-09-08:
 * netlify.toml proxies `/places` and `/places/*` to its independent
 * deployment, and the canonical URLs were verified serving 200 — with correct
 * canonical tags and a real 404 for unknown paths — before this was flipped.
 *
 * This flag is the release switch. While it was false the ecosystem navigation
 * rendered WITHOUT Places rather than shipping a link that 404s for every
 * visitor on all 84,835 pages. Turning it true enables the Places entry in the
 * header, the footer, every city page and every country page at once, which is
 * exactly why the route was made to exist and verified FIRST, in its own
 * separately released step.
 *
 * The navigation validator asserts the inverse of what it asserted before:
 * that Places links are rendered, that every city-scoped one is backed by the
 * Places publication manifest, and that none of them names a deployment origin.
 */
export const PLACES_PUBLIC = true;

export interface EcosystemDestination {
  /** Stable id, shared across all three repositories. */
  id: string;
  /** The label every product shows for this destination. */
  label: string;
  /** Canonical, domain-relative path. Never an origin, never http. */
  path: string;
  /** Whether this destination belongs in the primary header navigation. */
  primary: boolean;
  /** Set when the destination is served by another deployment. */
  servedBy?: "gci-media" | "gci-places" | "gci-de";
}

/**
 * The shared destination set, in the shared order. The header renders the
 * `primary` entries; the footer and the other two products draw from the same
 * list so labels and URLs cannot drift apart between products.
 */
export const ECOSYSTEM_DESTINATIONS: EcosystemDestination[] = [
  { id: "cities", label: "Cities", path: "/cities", primary: true },
  { id: "countries", label: "Countries", path: "/countries", primary: true },
  { id: "places", label: "Places", path: "/places", primary: true, servedBy: "gci-places" },
  { id: "rankings", label: "Rankings", path: "/rankings", primary: true },
  { id: "compare", label: "Compare", path: "/compare", primary: true },
  { id: "best-cities", label: "Best Cities", path: "/best-cities", primary: true },
  { id: "city-finder", label: "City Finder", path: "/explore-cities", primary: true },
  { id: "methodology", label: "Methodology", path: "/methodology", primary: true },
  { id: "data-sources", label: "Data Sources", path: "/data-sources", primary: true },
  { id: "blog", label: "Blog", path: "/blog", primary: true, servedBy: "gci-media" },
  /*
   * The German edition. `primary: false` on purpose — it is NOT a header item.
   * It is listed here so that isCrossDeploymentPath() knows /de belongs to
   * another deployment: a next/link to a proxied path prefetches an RSC
   * payload for a page this build does not have, 404s on every page view that
   * scrolls it into sight, and then hard-navigates anyway. Language choice is
   * offered per page where a German counterpart exists, not as a tenth nav
   * item.
   */
  { id: "german-edition", label: "Deutsch", path: "/de", primary: false, servedBy: "gci-de" },
];

/** Destinations that are live on the canonical domain right now. */
export function availableDestinations(): EcosystemDestination[] {
  return ECOSYSTEM_DESTINATIONS.filter(
    (destination) => destination.servedBy !== "gci-places" || PLACES_PUBLIC,
  );
}

export function destination(id: string): EcosystemDestination {
  const found = ECOSYSTEM_DESTINATIONS.find((entry) => entry.id === id);
  if (!found) {
    throw new Error(`Unknown ecosystem destination "${id}"`);
  }
  return found;
}

/* ------------------------------------------------------------------ *
 * Cross-product route builders.
 *
 * PART AF: these exist so a city or ranking URL is constructed in ONE place.
 * The main application's own routes already live in `lib/seo/routes.ts`; only
 * the cross-product shapes belong here.
 * ------------------------------------------------------------------ */

export const PLACES_BASE = "/places";

/** The Places city hub. Callers must first check `hasPlacesCity(slug)`. */
export function placesCityUrl(citySlug: string): string {
  return `${PLACES_BASE}/${citySlug}/`;
}

export function placesIndexUrl(): string {
  return `${PLACES_BASE}/`;
}

export function blogUrl(path = "/"): string {
  return path === "/" ? "/blog" : `/blog${path}`;
}

/**
 * Sitemaps published by the OTHER two deployments, inside the namespaces they
 * own, and reachable on this domain through the proxy.
 *
 * They are listed in this application's robots.txt because that is the only
 * robots.txt a crawler reads for this host — each origin serves its own, and
 * each of those disallows everything, deliberately. Without these two lines
 * roughly a thousand Places URLs and every article are reachable but
 * undiscoverable.
 *
 * Declared, not fetched: this build must never depend on another deployment
 * being up. `scripts/validate-proxy-routes.mjs` checks that each one sits
 * inside a namespace this site actually proxies.
 */
export const PROXIED_SITEMAPS = [
  "/blog/sitemap.xml",
  "/places/sitemap.xml",
  "/de/sitemap.xml",
] as const;

/**
 * Whether a path is served by ANOTHER deployment.
 *
 * This app builds no /blog or /places route — both arrive through Netlify
 * rewrites — so a next/link to either prefetches an RSC payload for a page
 * that does not exist here, logs a 404 on every page load that puts the link
 * in the viewport, and then falls back to a hard navigation anyway.
 *
 * It is an exported function rather than an inline condition at each call site
 * precisely so it can be tested: an inline `href.startsWith("/blog")` inside a
 * component is invisible to any gate, and a link component quietly deciding
 * "not external" is exactly the regression this is here to prevent.
 */
export function isCrossDeploymentPath(href: string): boolean {
  return ECOSYSTEM_DESTINATIONS.some(
    (item) =>
      item.servedBy !== undefined &&
      (href === item.path || href.startsWith(`${item.path}/`)),
  );
}

export function absoluteEcosystemUrl(path: string): string {
  return `${CANONICAL_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
