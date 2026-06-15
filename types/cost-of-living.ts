/**
 * Cost of Living profile for a city.
 *
 * Values are deterministic, source-grounded estimates expressed in the
 * city's local currency (`localCurrency`), generated from a country cost
 * baseline adjusted for the city's affordability score and metro size.
 * They are planning estimates — not live prices, not a tourism ranking,
 * and not a "best city" claim. `affordabilityScore` (0–100, higher = more
 * affordable) is the cross-city comparable metric and mirrors the city's
 * affordability score used across the platform's rankings.
 */
export interface CostOfLivingProfile {
  citySlug: string;

  monthlyCostSingle: number;
  monthlyCostCouple: number;
  monthlyCostFamily: number;

  rentStudio: number;
  rentOneBedroom: number;
  rentThreeBedroom: number;

  mealRestaurant: number;
  coffee: number;
  publicTransportPass: number;

  localCurrency: string;

  affordabilityScore: number;

  createdAt: string;
  updatedAt: string;
}
