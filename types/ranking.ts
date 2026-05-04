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
  relatedRankingSlugs?: string[];
}
