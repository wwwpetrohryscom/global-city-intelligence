// Build-time content quality helpers. Deterministic and side-effect free.

const MIN_INTRO_CHARS = 80;
const MIN_EXPLANATION_CHARS = 160;

export const CONTENT_QUALITY = {
  MIN_INTRO_CHARS,
  MIN_EXPLANATION_CHARS,
} as const;

export function isLongEnough(text: string, min: number): boolean {
  return text.trim().length >= min;
}

export function passesIntro(text: string): boolean {
  return isLongEnough(text, MIN_INTRO_CHARS);
}

export function passesExplanation(text: string): boolean {
  return isLongEnough(text, MIN_EXPLANATION_CHARS);
}

// Returns the text if it meets the minimum, otherwise the transparent fallback.
// We never invent details; if data is thin, we say so plainly.
export function withMinLength(
  text: string,
  min: number,
  fallback: string,
): string {
  return isLongEnough(text, min) ? text : fallback;
}

export function hasSources(sourceIds: string[] | undefined): boolean {
  return Array.isArray(sourceIds) && sourceIds.length > 0;
}

export function hasRequiredFreshness(input: {
  dataYear?: string;
  lastUpdated?: string;
}): boolean {
  return Boolean(input.dataYear && input.lastUpdated);
}

// Compact human-readable freshness string used inside generated paragraphs.
export function freshnessSentence(input: {
  dataYear: string;
  lastUpdated: string;
  sourceCount: number;
}): string {
  const sourcePart =
    input.sourceCount > 0
      ? ` Drawn from ${input.sourceCount} institutional reference${input.sourceCount === 1 ? "" : "s"}.`
      : "";
  return `Data year ${input.dataYear}; last updated ${input.lastUpdated}.${sourcePart}`;
}

// Demo-data transparency line used on every dynamic page.
// Keeps factual safety explicit so the reader is never misled about precision.
export function demoDataNotice(): string {
  return "This page uses a typed sample dataset shaped to demonstrate the indexable content structure. Values are directional and not official measurements.";
}
