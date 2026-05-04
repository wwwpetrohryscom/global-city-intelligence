export type ModuleSlug =
  | "cost-of-living"
  | "air-quality"
  | "energy"
  | "safety"
  | "internet-speed"
  | "climate-risk";

export interface IntelligenceModule {
  slug: ModuleSlug;
  name: string;
  shortName: string;
  description: string;
  pathSegment: string;
  sources: string[];
}
