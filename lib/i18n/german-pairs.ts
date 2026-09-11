import pairsFile from "./german-localization-pairs.json";

/**
 * THE ENGLISH↔GERMAN ROUTE CONTRACT.
 *
 * The German edition is a separate repository and a separate deployment. This
 * application must advertise a German alternate for an English page ONLY where
 * a German page actually exists, and there is no way to work that out from a
 * country or a city name: 240 of Germany's 257 cities have a German profile,
 * 18 of 1,542 module pages do, and 2,276 of 3,001 subpages do. Deriving the
 * mapping would emit thousands of hreflang alternates pointing at pages that
 * are not published — the single most damaging thing an hreflang cluster can
 * do.
 *
 * So the mapping is DATA, generated from the German edition's own route
 * manifest at a recorded commit and committed here. If the German edition adds
 * or removes a route, this file changes in a reviewable diff; nothing infers.
 */
const PAIRS = pairsFile.pairs as Record<string, string>;

/** The commit of the German repository this contract was generated from. */
export const GERMAN_PAIRS_SOURCE_COMMIT = pairsFile.generatedFrom.commit;

/** How many English routes have a German counterpart. */
export const GERMAN_PAIR_COUNT = pairsFile.count;

/**
 * The German path for an English path, or null.
 *
 * `path` is this application's own route shape — no trailing slash. The German
 * value always HAS a trailing slash, because the German application runs with
 * `trailingSlash: true` and that is the URL that returns 200. The asymmetry is
 * correct and must be preserved: stripping the slash to match this app's
 * convention would point every alternate at a redirect.
 */
export function germanAlternate(path: string): string | null {
  return PAIRS[path] ?? null;
}

/** Every pair, for the gates. */
export function allGermanPairs(): ReadonlyArray<readonly [string, string]> {
  return Object.entries(PAIRS);
}
