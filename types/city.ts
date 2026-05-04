import type { ModuleSlug } from "./module";
import type { DataTableRow, Metric } from "./seo";

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
  relatedCitySlugs?: string[];
}
