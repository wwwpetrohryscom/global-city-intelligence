export type VisualGuideFocus =
  | "relocation_visual_context"
  | "arrival_visual_context"
  | "neighborhood_visual_context"
  | "transport_visual_context"
  | "family_visual_context"
  | "remote_work_visual_context"
  | "general_city_context";

export type VisualGuideSectionCategory =
  | "urban_form"
  | "transport_context"
  | "climate_context"
  | "public_realm"
  | "regional_context";

export interface VisualGuideSection {
  label: string;
  description: string;
  category: VisualGuideSectionCategory;
}

export interface VisualCityGuidePage {
  citySlug: string;
  title: string;
  summary: string;
  visualFocus: VisualGuideFocus;
  updatedDate: string;
  dataYear: string;
  sourceIds: string[];
  relatedComparisonSlugs?: string[];
  relatedCollectionSlugs?: string[];
}
