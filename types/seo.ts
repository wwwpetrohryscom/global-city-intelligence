export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface Metric {
  label: string;
  value: string;
  unit?: string;
  score?: number;
  description: string;
}

export interface DataTableRow {
  metric: string;
  value: string;
  context: string;
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export interface PageFreshness {
  dataYear: string;
  lastUpdated: string;
  changeFrequency: ChangeFrequency;
}
