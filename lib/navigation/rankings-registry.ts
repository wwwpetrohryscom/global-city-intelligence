/**
 * THE CANONICAL RANKING REGISTRY.
 *
 * WHAT PROBLEM THIS SOLVES: the site publishes thirteen ranking pages across
 * two route families — eight scored rankings under /rankings/<slug> and five
 * curated shortlists at /<slug> — and the footer hard-coded four of them
 * (`getRankings().slice(0, 4)`). A ranking could be published and be reachable
 * from nowhere in the global navigation, and nothing would notice.
 *
 * This registry is the single list of what is published. The footer, the
 * rankings index and the city Explore module all project from it, and
 * `scripts/validate-navigation.mjs` proves three things that together make the
 * gap impossible to reopen:
 *
 *   1. registry  ==  the real ranking + collection data (no entry invented,
 *      none forgotten)
 *   2. registry  ==  the routes actually emitted into `out/`
 *   3. registry  ==  what the rendered footer and rankings index contain
 *
 * WHY LITERAL AND NOT DERIVED: `lib/data/rankings.ts` computes an entry for
 * every one of 4,442 cities in every ranking. The footer needs a slug and a
 * short label. Deriving the registry from that module would pull the whole
 * city corpus into the shared chunk of every page on the site to render eight
 * links. The registry is therefore metadata only, and the parity gate — not an
 * import — is what keeps it true.
 */
export type RankingFamily = "ranking" | "collection";

export type RankingTheme = "life" | "work" | "mobility" | "environment" | "economy";

export interface RankingRegistryEntry {
  id: string;
  slug: string;
  title: string;
  shortLabel: string;
  description: string;
  theme: RankingTheme;
  /** Draft entries never reach a public surface. */
  published: boolean;
  family: RankingFamily;
  route: string;
}

/**
 * Theme groups for the footer's ranking columns.
 *
 * These are the themes the corpus already expresses: the collections carry an
 * explicit `intent` (remote_work, family_life, startups, clean_air,
 * public_transport) and the rankings are built from named module scores. No
 * group exists to balance a column, and a group with one entry stays a group
 * with one entry.
 */
export const RANKING_THEMES: { key: RankingTheme; label: string }[] = [
  { key: "life", label: "Life" },
  { key: "work", label: "Work" },
  { key: "mobility", label: "Mobility" },
  { key: "environment", label: "Environment" },
  { key: "economy", label: "Economy" },
];

const ranking = (
  slug: string,
  title: string,
  shortLabel: string,
  description: string,
  theme: RankingTheme,
): RankingRegistryEntry => ({
  id: `ranking:${slug}`,
  slug,
  title,
  shortLabel,
  description,
  theme,
  published: true,
  family: "ranking",
  route: `/rankings/${slug}`,
});

const collection = (
  slug: string,
  title: string,
  shortLabel: string,
  description: string,
  theme: RankingTheme,
): RankingRegistryEntry => ({
  id: `collection:${slug}`,
  slug,
  title,
  shortLabel,
  description,
  theme,
  published: true,
  family: "collection",
  // Collections are served at the site root, not under /best-cities. That is
  // the existing published shape (`getCollectionUrl`), preserved exactly.
  route: `/${slug}`,
});

export const RANKING_REGISTRY: RankingRegistryEntry[] = [
  ranking(
    "overall-city-intelligence",
    "Overall City Intelligence Ranking",
    "Overall Intelligence",
    "Cities across affordability, air quality, clean-energy readiness and resilience.",
    "life",
  ),
  ranking(
    "best-cities-quality-of-life",
    "Best Cities for Quality of Life",
    "Quality of Life",
    "Services, mobility, safety, clean air and resilience together.",
    "life",
  ),
  ranking(
    "best-cities-remote-workers",
    "Best Cities for Remote Workers",
    "Remote Work",
    "Connectivity, affordability and day-to-day workability.",
    "work",
  ),
  ranking(
    "clean-air-cities",
    "Cleanest Air Cities",
    "Clean Air",
    "Cities ordered by measured air-quality context.",
    "environment",
  ),
  ranking(
    "most-affordable-global-cities",
    "Most Affordable Global Cities",
    "Most Affordable",
    "Cost context across the indexed city set.",
    "economy",
  ),
  ranking(
    "best-connected-cities",
    "Best Connected Cities",
    "Best Connected",
    "Transport and connectivity context.",
    "mobility",
  ),
  ranking(
    "energy-ready-cities",
    "Energy Ready City Ranking",
    "Energy Readiness",
    "Clean-energy readiness context.",
    "environment",
  ),
  ranking(
    "affordability-balance",
    "Affordability Balance Ranking",
    "Affordability Balance",
    "Affordability read against the rest of a city's profile.",
    "economy",
  ),
  collection(
    "best-cities-for-remote-workers",
    "Best Cities for Remote Workers: City Intelligence Shortlist",
    "Remote workers",
    "A curated shortlist for remote work.",
    "work",
  ),
  collection(
    "best-cities-for-families",
    "Best Cities for Families: City Intelligence Shortlist",
    "Families",
    "A curated shortlist for family life.",
    "life",
  ),
  collection(
    "best-cities-for-startups",
    "Best Cities for Startups: City Intelligence Shortlist",
    "Startups",
    "A curated shortlist for startups.",
    "work",
  ),
  collection(
    "best-cities-for-clean-air",
    "Best Cities for Clean Air: City Intelligence Shortlist",
    "Clean air",
    "A curated shortlist for air quality.",
    "environment",
  ),
  collection(
    "best-cities-for-public-transport",
    "Best Cities for Public Transport: City Intelligence Shortlist",
    "Public transport",
    "A curated shortlist for public transport.",
    "mobility",
  ),
];

/** The only accessor public surfaces may use. Drafts are filtered here, once. */
export function publishedRankings(): RankingRegistryEntry[] {
  return RANKING_REGISTRY.filter((entry) => entry.published);
}

export function publishedRankingsByTheme(): {
  key: RankingTheme;
  label: string;
  entries: RankingRegistryEntry[];
}[] {
  return RANKING_THEMES.map((theme) => ({
    ...theme,
    entries: publishedRankings().filter((entry) => entry.theme === theme.key),
  })).filter((group) => group.entries.length > 0);
}

export function rankingRegistryEntry(id: string): RankingRegistryEntry | undefined {
  return publishedRankings().find((entry) => entry.id === id);
}
