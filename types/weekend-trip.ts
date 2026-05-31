export type WeekendTripFocus =
  | "city_break"
  | "culture_context"
  | "family_weekend"
  | "arrival_and_transport"
  | "budget_planning"
  | "visual_orientation"
  | "general_weekend_planning";

export type WeekendTripChecklistCategory =
  | "arrival_first_evening"
  | "time_management"
  | "budget_buffer"
  | "transport_daily"
  | "healthcare_safety"
  | "visual_planning_links";

export interface WeekendTripChecklistItem {
  label: string;
  description: string;
  category: WeekendTripChecklistCategory;
}

export interface WeekendTripCityPage {
  citySlug: string;
  title: string;
  summary: string;
  weekendFocus: WeekendTripFocus;
  updatedDate: string;
  dataYear: string;
  sourceIds: string[];
  relatedComparisonSlugs?: string[];
  relatedCollectionSlugs?: string[];
}
