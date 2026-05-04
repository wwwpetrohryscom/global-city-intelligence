// Calm, factual, non-alarmist phrasing helpers. No hype words.

const HYPE_PHRASES = [
  "best ever",
  "perfect city",
  "world's most",
  "ultimate",
  "unbelievable",
  "absolute best",
  "guaranteed",
  "must-visit",
  "you won't believe",
  "mind-blowing",
];

const ALARMIST_PHRASES = [
  "catastrophic",
  "doomed",
  "collapsing",
  "crisis-level",
  "terrifying",
];

export function containsHype(text: string): boolean {
  const lower = text.toLowerCase();
  return HYPE_PHRASES.some((phrase) => lower.includes(phrase));
}

export function containsAlarmism(text: string): boolean {
  const lower = text.toLowerCase();
  return ALARMIST_PHRASES.some((phrase) => lower.includes(phrase));
}

export function isHealthyTone(text: string): boolean {
  return !containsHype(text) && !containsAlarmism(text);
}

// Score-band vocabulary, neutral and consistent.
// Used to pick a single descriptive word from a numeric score.
export type ScoreBand = "leading" | "strong" | "solid" | "developing" | "early";

export function bandLabel(band: ScoreBand): string {
  switch (band) {
    case "leading":
      return "leading";
    case "strong":
      return "strong";
    case "solid":
      return "solid";
    case "developing":
      return "developing";
    case "early":
      return "early-stage";
  }
}

export const TONE_GUIDELINES = {
  preferred: [
    "clear",
    "factual",
    "useful",
    "calm",
    "specific",
    "data-led",
  ],
  avoid: [
    "fear-based copy",
    "exaggerated claims",
    "best-ever superlatives",
    "unsupported recommendations",
  ],
} as const;
