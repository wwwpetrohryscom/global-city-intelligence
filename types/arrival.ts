export type ArrivalFocus =
  | "general_arrival"
  | "airport_arrival"
  | "rail_arrival"
  | "relocation_arrival"
  | "business_travel"
  | "family_arrival"
  | "remote_work_arrival";

export type ArrivalChecklistCategory =
  | "before"
  | "first_day"
  | "transport"
  | "safety"
  | "healthcare"
  | "budget";

export interface ArrivalChecklistItem {
  label: string;
  description: string;
  category: ArrivalChecklistCategory;
}

export interface ArrivalPage {
  citySlug: string;
  title: string;
  summary: string;
  arrivalFocus: ArrivalFocus;
  updatedDate: string;
  dataYear: string;
  sourceIds: string[];
  relatedComparisonSlugs?: string[];
  relatedCollectionSlugs?: string[];
}
