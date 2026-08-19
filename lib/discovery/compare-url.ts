import { MAX_COMPARE } from "@/lib/discovery/storage";
import { isValidSlug } from "@/lib/discovery/storage";

/**
 * URL encoding for the comparison selection.
 *
 * The selection lives in the query string (`/compare-cities?cities=a,b,c`) so a
 * comparison is shareable, bookmarkable and survives a refresh. This stays
 * compatible with `output: "export"`: the page itself is a single prerendered
 * static HTML file and the query string is read in the browser, so no server
 * ever sees the parameter and no per-combination route is generated.
 *
 * That last point is also why these URLs must not become indexable — see the
 * `robots` directive on the /compare-cities page. There are ~10^13 possible
 * 4-city combinations; letting crawlers enumerate them would be a textbook
 * faceted-indexation explosion.
 */
export const COMPARE_PARAM = "cities";
export const COMPARE_CITIES_PATH = "/compare-cities";

export function compareCitiesRoute(slugs: string[]): string {
  const clean = parseCompareSlugs(slugs.join(","));
  if (clean.length === 0) return COMPARE_CITIES_PATH;
  return `${COMPARE_CITIES_PATH}?${COMPARE_PARAM}=${clean.join(",")}`;
}

/**
 * Parse and sanitise the `cities` parameter.
 *
 * Applies the same slug validation as the storage layer, drops duplicates and
 * caps the list, so a hand-edited or truncated URL degrades to a valid subset
 * instead of rendering a broken comparison.
 */
export function parseCompareSlugs(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const part of raw.split(",")) {
    const slug = part.trim().toLowerCase();
    if (!isValidSlug(slug) || seen.has(slug)) continue;
    seen.add(slug);
    out.push(slug);
    if (out.length >= MAX_COMPARE) break;
  }
  return out;
}
