export function formatScore(score: number) {
  return `${score}/100`;
}

export function getScoreLabel(score: number) {
  if (score >= 90) {
    return "Exceptional";
  }

  if (score >= 80) {
    return "Strong";
  }

  if (score >= 70) {
    return "Good";
  }

  if (score >= 60) {
    return "Mixed";
  }

  return "Constrained";
}

export function getScoreTone(score: number) {
  if (score >= 85) {
    return "text-text-primary bg-orange-50 border-brand-400";
  }

  if (score >= 70) {
    return "text-text-primary bg-teal-50 border-teal-200";
  }

  if (score >= 55) {
    return "text-text-primary bg-blue-50 border-blue-200";
  }

  return "text-text-primary bg-neutral-soft border-neutral-border";
}
