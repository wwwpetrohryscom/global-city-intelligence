import type { Metric } from "./seo";

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
