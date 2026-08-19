import {
  climateRoute,
  costOfLivingRoute,
  economyRoute,
  educationRoute,
  healthcareRoute,
  moduleRoute,
} from "@/lib/seo/routes";
import type { DimensionDirection } from "@/lib/city-intelligence/types";

/**
 * THE canonical Scorecard dimension registry.
 *
 * One definition per dimension, reused by the Scorecard today and by City
 * Match / Similar Cities / City vs City later. Nothing here duplicates
 * `lib/discovery` — that registry describes *filter facets*; this one describes
 * *published measurements and where to investigate them*. They intentionally
 * share the same underlying source fields so the two features can never
 * disagree about what a city's safety score is.
 *
 * Client-safe: `@/lib/seo/routes` is pure path construction.
 *
 * WHAT IS DELIBERATELY ABSENT
 * - Raw monthly cost. It is denominated in 83 local currencies with no
 *   exchange-rate table in the repository, so it can be displayed on a city's
 *   own page but never compared or ranked. Affordability — a published
 *   unitless 0–100 score — carries the comparable signal instead.
 * - Population. It is context, not performance; "top 10% by population" would
 *   read as a quality claim it is not.
 * - Any composite, overall or match score. No weighting is justified by the
 *   sources, so none is invented.
 */
export interface IntelligenceDimension {
  id: string;
  label: string;
  /** One line, stating what the number is — shown under the value. */
  description: string;
  direction: DimensionDirection;
  /** Deep link to the section where this dimension is explained for a city. */
  sectionHref: (citySlug: string) => string;
  /**
   * True when the value exists for placeholder-record cities but is a
   * country-level default rather than a city measurement. Such values are
   * displayed (they are what the city's own page publishes) but never
   * positioned, never a strength and never a trade-off.
   */
  countryDefaultForPlaceholders: boolean;
}

export const INTELLIGENCE_DIMENSIONS: readonly IntelligenceDimension[] = [
  {
    id: "safety",
    label: "Safety",
    description: "Published safety score, 0–100.",
    direction: "higher",
    sectionHref: (slug) => moduleRoute("safety", slug),
    countryDefaultForPlaceholders: false,
  },
  {
    id: "healthcare",
    label: "Healthcare",
    description: "Published healthcare access score, 0–100.",
    direction: "higher",
    sectionHref: (slug) => healthcareRoute(slug),
    countryDefaultForPlaceholders: true,
  },
  {
    id: "economy",
    label: "Economy",
    description: "Published economy and jobs score, 0–100.",
    direction: "higher",
    sectionHref: (slug) => economyRoute(slug),
    countryDefaultForPlaceholders: true,
  },
  {
    id: "education",
    label: "Education",
    description: "Published education score, 0–100.",
    direction: "higher",
    sectionHref: (slug) => educationRoute(slug),
    countryDefaultForPlaceholders: true,
  },
  {
    id: "climate",
    label: "Climate comfort",
    description: "Published climate comfort score, 0–100.",
    direction: "higher",
    sectionHref: (slug) => climateRoute(slug),
    countryDefaultForPlaceholders: false,
  },
  {
    id: "air-quality",
    label: "Air quality",
    description: "Published air-quality score, 0–100.",
    direction: "higher",
    sectionHref: (slug) => moduleRoute("air-quality", slug),
    countryDefaultForPlaceholders: false,
  },
  {
    id: "internet",
    label: "Internet",
    description: "Published internet-speed score, 0–100.",
    direction: "higher",
    sectionHref: (slug) => moduleRoute("internet-speed", slug),
    countryDefaultForPlaceholders: false,
  },
  {
    id: "affordability",
    label: "Affordability",
    description: "Published affordability score, 0–100. Higher means more affordable.",
    direction: "higher",
    sectionHref: (slug) => costOfLivingRoute(slug),
    countryDefaultForPlaceholders: false,
  },
] as const;

export const DIMENSION_IDS = INTELLIGENCE_DIMENSIONS.map((d) => d.id);

export function dimensionById(id: string): IntelligenceDimension | undefined {
  return INTELLIGENCE_DIMENSIONS.find((d) => d.id === id);
}
