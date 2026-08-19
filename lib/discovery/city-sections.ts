import {
  cityRoute,
  climateRoute,
  costOfLivingRoute,
  economyRoute,
  educationRoute,
  healthcareRoute,
  moduleRoute,
} from "@/lib/seo/routes";

/**
 * The city intelligence sections exposed by the contextual quick navigation.
 *
 * SINGLE SOURCE OF TRUTH for these hrefs. Before this file the same seven route
 * strings were rebuilt by hand in each Phase page's "Continue exploring" block,
 * so a route change had to be repeated five times to stay consistent.
 *
 * Client-safe: `@/lib/seo/routes` is pure path construction (it carries an
 * explicit note forbidding `@/lib/data` imports), so this module can be pulled
 * into a client component without dragging the corpus into the browser bundle.
 * Availability is resolved on the SERVER and passed down as plain booleans —
 * see `CITY_SECTION_AVAILABILITY` in `lib/discovery/city-sections.server.ts`.
 *
 * WHY THESE SEVEN: each is published for all 4,444 cities (verified), so the
 * navigation is complete for every city rather than ragged. Sparse families are
 * deliberately excluded — neighborhoods (1.4% of cities), moving-to (1.4%) and
 * summer-travel (2.3%) would be absent from ~98% of cities and turn a
 * consistent navigator into a lottery. They remain reachable from the existing
 * "Continue exploring" and "Related guides" blocks, which gate per city.
 *
 * COST: the city-scoped Phase page (/cities/{slug}/cost-of-living) is used
 * rather than the module page (/cost-of-living/{slug}). Both exist for every
 * city; the Phase page carries the real budget/rent figures, while the module
 * page carries the directional-score framing. Keeping the navigator on
 * city-scoped routes also means every tab but Safety shares one URL prefix.
 */

export type CitySectionId =
  | "overview"
  | "cost-of-living"
  | "climate"
  | "safety"
  | "economy"
  | "education"
  | "healthcare";

export interface CitySection {
  id: CitySectionId;
  /** Tab label. Short — this renders in a horizontal strip on a 390px screen. */
  label: string;
  /** Accessible name, expanded with the city so links are unambiguous. */
  ariaLabel: (cityName: string) => string;
  href: (citySlug: string) => string;
}

export const CITY_SECTIONS: readonly CitySection[] = [
  {
    id: "overview",
    label: "Overview",
    ariaLabel: (city) => `${city} overview`,
    href: (slug) => cityRoute(slug),
  },
  {
    id: "cost-of-living",
    label: "Cost of living",
    ariaLabel: (city) => `Cost of living in ${city}`,
    href: (slug) => costOfLivingRoute(slug),
  },
  {
    id: "climate",
    label: "Climate",
    ariaLabel: (city) => `Climate in ${city}`,
    href: (slug) => climateRoute(slug),
  },
  {
    id: "safety",
    label: "Safety",
    ariaLabel: (city) => `Safety in ${city}`,
    href: (slug) => moduleRoute("safety", slug),
  },
  {
    id: "economy",
    label: "Economy",
    ariaLabel: (city) => `Economy and jobs in ${city}`,
    href: (slug) => economyRoute(slug),
  },
  {
    id: "education",
    label: "Education",
    ariaLabel: (city) => `Universities and education in ${city}`,
    href: (slug) => educationRoute(slug),
  },
  {
    id: "healthcare",
    label: "Healthcare",
    ariaLabel: (city) => `Healthcare in ${city}`,
    href: (slug) => healthcareRoute(slug),
  },
] as const;

export const CITY_SECTION_IDS = CITY_SECTIONS.map((s) => s.id);

/** Availability of each section for one city, resolved at build time. */
export type CitySectionAvailability = Partial<Record<CitySectionId, boolean>>;
