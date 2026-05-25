export type NeighborhoodPlanningFocus =
  | "relocation_research"
  | "family_research"
  | "remote_work_research"
  | "transport_access"
  | "arrival_shortlist"
  | "general_research";

export type NeighborhoodChecklistCategory =
  | "daily_access"
  | "transport_fit"
  | "housing_research"
  | "safety_services"
  | "healthcare_family"
  | "remote_work"
  | "budget_planning";

export interface NeighborhoodChecklistItem {
  label: string;
  description: string;
  category: NeighborhoodChecklistCategory;
}

export interface NeighborhoodPlanningPage {
  citySlug: string;
  title: string;
  summary: string;
  planningFocus: NeighborhoodPlanningFocus;
  updatedDate: string;
  dataYear: string;
  sourceIds: string[];
  relatedComparisonSlugs?: string[];
  relatedCollectionSlugs?: string[];
}
