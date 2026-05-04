import type { ScoreBand } from "@/lib/content/tone";

// Score interpretation rules. Centralized so every generator uses the same bands.

export function scoreToBand(score: number): ScoreBand {
  if (score >= 90) return "leading";
  if (score >= 80) return "strong";
  if (score >= 70) return "solid";
  if (score >= 60) return "developing";
  return "early";
}

// Words used inside generator sentences. Avoid hype.
export function bandSentenceFragment(band: ScoreBand): string {
  switch (band) {
    case "leading":
      return "near the top of the indexed set";
    case "strong":
      return "comfortably above the indexed median";
    case "solid":
      return "around the indexed median";
    case "developing":
      return "below the indexed median, with practical gaps to close";
    case "early":
      return "at an early stage relative to the indexed set";
  }
}

export interface ModuleHighlight<TScore extends { score: number }> {
  slug: string;
  name: string;
  score: number;
  data: TScore;
}

export function pickTopAndLow<T extends { score: number }>(
  candidates: { slug: string; name: string; data: T }[],
): { top: ModuleHighlight<T>[]; low: ModuleHighlight<T> | undefined } {
  if (candidates.length === 0) {
    return { top: [], low: undefined };
  }

  const sorted = [...candidates]
    .map((candidate) => ({
      slug: candidate.slug,
      name: candidate.name,
      score: candidate.data.score,
      data: candidate.data,
    }))
    .sort((a, b) => b.score - a.score);

  const top = sorted.slice(0, 2);
  const low = sorted[sorted.length - 1];

  return { top, low };
}
