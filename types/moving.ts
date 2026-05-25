export type MovingFocus =
  | "relocation_research"
  | "family_move"
  | "remote_work_move"
  | "career_move"
  | "student_move"
  | "general_move";

export type MovingChecklistCategory =
  | "legal_official"
  | "housing"
  | "cost_planning"
  | "arrival"
  | "healthcare_safety"
  | "transport_daily"
  | "work_study_family";

export interface MovingChecklistItem {
  label: string;
  description: string;
  category: MovingChecklistCategory;
}

export interface MovingToCityPage {
  citySlug: string;
  title: string;
  summary: string;
  movingFocus: MovingFocus;
  updatedDate: string;
  dataYear: string;
  sourceIds: string[];
  relatedComparisonSlugs?: string[];
  relatedCollectionSlugs?: string[];
}
