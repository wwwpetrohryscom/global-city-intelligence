export type ComparisonIntent =
  | "relocation"
  | "remote_work"
  | "business"
  | "travel_planning"
  | "quality_of_life"
  | "regional_alternative"
  | "global_hub_comparison";

export type ComparisonRegion =
  | "Europe"
  | "North America"
  | "Asia"
  | "Middle East"
  | "Latin America"
  | "Africa"
  | "Oceania"
  | "Global";

export interface CityComparison {
  slug: string;
  cityASlug: string;
  cityBSlug: string;
  title: string;
  description: string;
  comparisonIntent: ComparisonIntent;
  region: ComparisonRegion;
  updatedDate: string;
  dataYear: string;
  sourceIds: string[];
}

export interface ComparisonCategory {
  key: string;
  label: string;
  summary: string;
  cityANote?: string;
  cityBNote?: string;
  interpretation: string;
  sourceIds?: string[];
}
