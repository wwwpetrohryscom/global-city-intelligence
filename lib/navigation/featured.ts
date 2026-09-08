/**
 * FEATURED CITIES AND COUNTRIES — an editorial choice, stated as one.
 *
 * WHAT THIS REPLACES: the footer used to render `getCities().slice(0, 5)` and
 * `getCountries().slice(0, 5)`. Those are not selections; they are whatever
 * happens to sit at the top of a generated corpus. That is why the site's
 * country footer read Ukraine, Montenegro, Bosnia and Herzegovina, North
 * Macedonia, Albania — the first wave of a data import, presented to every
 * visitor on every page as if it meant something.
 *
 * These lists are literal, ordered, and reviewed. Nothing here is derived from
 * scores, traffic or data order, so nothing here can silently change when the
 * corpus is regenerated.
 *
 * THEY ARE NOT A RANKING. The labels in the UI say "Featured", the headings say
 * "Featured", and no copy anywhere calls these the best, the top, or the most
 * popular — because no measurement supports that and none is claimed.
 *
 * Every slug is checked against the real corpus by
 * `scripts/validate-navigation.mjs`, which fails the build on a slug with no
 * public route rather than letting the footer render a dead link.
 */
export interface FeaturedEntry {
  slug: string;
  /** The display label. Kept here so the footer never loads the corpus. */
  label: string;
}

/**
 * Singapore leads because it is the current flagship market — the city with
 * the deepest coverage across the ecosystem (374 published places, a full
 * Places hub). That is product prioritisation, not a claim about the city.
 */
export const FEATURED_COUNTRIES: FeaturedEntry[] = [
  { slug: "singapore", label: "Singapore" },
  { slug: "united-states", label: "United States" },
  { slug: "china", label: "China" },
  { slug: "india", label: "India" },
  { slug: "united-kingdom", label: "United Kingdom" },
  { slug: "australia", label: "Australia" },
  { slug: "ukraine", label: "Ukraine" },
];

/**
 * Hong Kong is included because its canonical city route exists and it is the
 * leading candidate for the second flagship market. Its presence here is an
 * editorial choice and carries no claim of rank, traffic or coverage depth —
 * it has no Places hub yet, and this hotfix starts no expansion.
 */
export const FEATURED_CITIES: FeaturedEntry[] = [
  { slug: "singapore", label: "Singapore" },
  { slug: "hong-kong", label: "Hong Kong" },
  { slug: "new-york", label: "New York" },
  { slug: "london", label: "London" },
  { slug: "sydney", label: "Sydney" },
  { slug: "barcelona", label: "Barcelona" },
];

export const FEATURED_CITIES_HEADING = "Featured cities";
export const FEATURED_COUNTRIES_HEADING = "Featured countries";
