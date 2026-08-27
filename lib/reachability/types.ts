import type { NatureCategory } from "@/types";
import type { ReachabilityBand } from "@/lib/reachability/bands";

/**
 * What kind of destination this is. Kept deliberately coarse: the reader is
 * choosing between "a town" and "a landscape", and the nature taxonomy already
 * carries the fine detail for the second.
 */
export type ReachabilityKind = "city" | "nature";

export interface ReachabilityDestination {
  kind: ReachabilityKind;
  /** City slug, or nearby-place slug. */
  slug: string;
  name: string;
  /** Great-circle kilometres from the source city centre. */
  distanceKm: number;
  band: ReachabilityBand;
  countrySlug: string;
  countryName: string;
  /** True when the destination sits in a different country from the source. */
  crossBorder: boolean;
  /** Route this destination links to. Always an existing page. */
  href: string;
  /** Nature destinations only: the classified category. */
  category?: NatureCategory;
  /** Nature destinations only: the Wikidata type label, e.g. "reservoir". */
  typeLabel?: string;
  /** City destinations only: how the discovery graph relates the two cities. */
  relationship?: string;
}

/** Everything the enrichment blocks need for one city, computed once. */
export interface CityReachability {
  citySlug: string;
  destinations: readonly ReachabilityDestination[];
  byBand: Readonly<Record<ReachabilityBand, readonly ReachabilityDestination[]>>;
  cities: readonly ReachabilityDestination[];
  nature: readonly ReachabilityDestination[];
  crossBorder: readonly ReachabilityDestination[];
  /** Distinct destination countries other than the source city's own. */
  crossBorderCountries: readonly string[];
}
