import type { ModuleSlug } from "./module";

export type CityIntentSlug =
  | "remote-work"
  | "family-life"
  | "startup-ecosystem"
  | "clean-air"
  | "public-transport";

export interface CityIntentCriterion {
  key: string;
  label: string;
  explanation: string;
  sourceIds?: string[];
}

export interface CityIntent {
  slug: CityIntentSlug;
  title: string;
  shortTitle: string;
  description: string;
  criteria: CityIntentCriterion[];
  relatedCollectionSlug?: string;
  relatedModuleSlugs?: ModuleSlug[];
  sourceIds: string[];
}

export interface CityIntentPage {
  citySlug: string;
  intentSlug: CityIntentSlug;
  title: string;
  intro: string;
  summary: string;
  criteriaNotes: Record<string, string>;
  updatedDate: string;
  dataYear: string;
  sourceIds: string[];
  relatedComparisonSlugs?: string[];
  relatedCollectionSlugs?: string[];
}
