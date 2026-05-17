export type CollectionIntent =
  | "remote_work"
  | "family_life"
  | "startups"
  | "clean_air"
  | "public_transport"
  | "relocation"
  | "quality_of_life";

export interface CollectionCriterion {
  key: string;
  label: string;
  explanation: string;
  sourceIds?: string[];
}

export interface CityCollection {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  intro: string;
  intent: CollectionIntent;
  citySlugs: string[];
  criteria: CollectionCriterion[];
  updatedDate: string;
  dataYear: string;
  sourceIds: string[];
  methodologyNote: string;
  relatedCollectionSlugs?: string[];
  relatedRankingSlugs?: string[];
  relatedModuleSlugs?: string[];
}
