export type SummerTravelFocus =
  | "city_break"
  | "family_trip"
  | "culture_context"
  | "coastal_or_waterfront_context"
  | "heat_planning"
  | "arrival_and_transport"
  | "budget_planning"
  | "general_summer_planning";

export type SummerTravelChecklistCategory =
  | "arrival_first_day"
  | "weather_seasonal"
  | "budget_buffer"
  | "transport_daily"
  | "healthcare_safety"
  | "visual_planning_links";

export interface SummerTravelChecklistItem {
  label: string;
  description: string;
  category: SummerTravelChecklistCategory;
}

export interface SummerTravelCityPage {
  citySlug: string;
  title: string;
  summary: string;
  summerFocus: SummerTravelFocus;
  updatedDate: string;
  dataYear: string;
  sourceIds: string[];
  relatedComparisonSlugs?: string[];
  relatedCollectionSlugs?: string[];
}
