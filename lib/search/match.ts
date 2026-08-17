/**
 * Deterministic substring/prefix matching for the discovery search.
 *
 * Explicitly NOT fuzzy. Edit-distance matching over ~4,500 city names produces
 * confident-looking nonsense ("Porto" → "Perth") and there is no relevance
 * signal in the corpus to rank it back down, so matching is limited to exact /
 * prefix / word-prefix / substring tiers. That is enough for the real query
 * shapes ("Tokyo", "Port", "New", "Czech") and never surfaces a result a
 * visitor cannot explain.
 */

/**
 * Casefold + strip diacritics so "São" and "Sao" are the same key, and
 * collapse whitespace so a trailing space does not kill a match. NFD splits
 * accents into combining marks, which the U+0300–U+036F range then removes.
 */
export function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Match tiers, strongest last. A plain const object rather than a `const enum`
 *  because Next builds with `isolatedModules`, which cannot inline those. */
export const MatchRank = {
  None: 0,
  Substring: 1,
  WordPrefix: 2,
  Prefix: 3,
  Exact: 4,
} as const;

export type MatchRank = (typeof MatchRank)[keyof typeof MatchRank];

/** Rank a single already-folded haystack against an already-folded query. */
export function rankFolded(haystack: string, query: string): MatchRank {
  if (!query) return MatchRank.None;
  if (haystack === query) return MatchRank.Exact;
  if (haystack.startsWith(query)) return MatchRank.Prefix;
  const at = haystack.indexOf(query);
  if (at < 0) return MatchRank.None;
  // A match that begins a word ("york" in "new york") outranks one that starts
  // mid-word ("ork"), which keeps "New"/"York" style queries intuitive.
  return haystack[at - 1] === " " || haystack[at - 1] === "-"
    ? MatchRank.WordPrefix
    : MatchRank.Substring;
}

/** Best rank across several haystacks (e.g. city name and its country name). */
export function bestRank(haystacks: string[], query: string): MatchRank {
  let best: MatchRank = MatchRank.None;
  for (const h of haystacks) {
    const r = rankFolded(h, query);
    if (r > best) best = r;
    if (best === MatchRank.Exact) break;
  }
  return best;
}

/**
 * Stable comparator: stronger match first, then shorter name (a prefix hit on
 * "Porto" should beat one on "Portomarin"), then alphabetical so results never
 * reshuffle between identical queries.
 */
export function compareMatches(
  a: { rank: MatchRank; name: string },
  b: { rank: MatchRank; name: string },
): number {
  if (a.rank !== b.rank) return b.rank - a.rank;
  if (a.name.length !== b.name.length) return a.name.length - b.name.length;
  return a.name.localeCompare(b.name);
}
