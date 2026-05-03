export type ModuleSlug = "cost-of-living" | "air-quality" | "energy";

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface DataSource {
  id: string;
  name: string;
  organization: string;
  url: string;
  description: string;
  reliabilityNote: string;
}

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

export interface CityModuleData {
  moduleSlug: ModuleSlug;
  score: number;
  summary: string;
  dataYear: string;
  lastUpdated: string;
  sources: string[];
  metrics: Metric[];
  table: DataTableRow[];
  explanation: string;
}

export interface CityScores {
  overall: number;
  affordability: number;
  airQuality: number;
  energy: number;
  resilience: number;
}

export interface City {
  slug: string;
  name: string;
  countrySlug: string;
  countryName: string;
  region: string;
  population: string;
  dataYear: string;
  lastUpdated: string;
  intro: string;
  outlook: string;
  sources: string[];
  scores: CityScores;
  metrics: Metric[];
  modules: Record<ModuleSlug, CityModuleData>;
}

export interface Country {
  slug: string;
  name: string;
  iso2: string;
  region: string;
  dataYear: string;
  lastUpdated: string;
  intro: string;
  sources: string[];
  metrics: Metric[];
  citySlugs: string[];
}

export interface IntelligenceModule {
  slug: ModuleSlug;
  name: string;
  shortName: string;
  description: string;
  pathSegment: string;
  sources: string[];
}

export interface RankingEntry {
  citySlug: string;
  rank: number;
  score: number;
  note: string;
}

export interface Ranking {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  dataYear: string;
  lastUpdated: string;
  sources: string[];
  methodology: string;
  entries: RankingEntry[];
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}
