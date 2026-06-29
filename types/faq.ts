/**
 * City FAQ + AI-Overview content types. Both are generated deterministically from a
 * city's Phase A–F profiles + nearby nature (no hallucination) and rendered with
 * schema.org FAQPage structured data for SEO + Google AI Overview eligibility.
 */

export interface FaqItem {
  /** Topic bucket: cost | safety | climate | healthcare | education | retirement | jobs | nature | transportation | weekend */
  category: string;
  question: string;
  answer: string;
}

export interface CityFaq {
  citySlug: string;
  items: readonly FaqItem[];
}

export interface AiOverviewItem {
  question: string;
  /** Concise, answer-first response (≈40–80 words). */
  answer: string;
}

export interface CityAiOverview {
  citySlug: string;
  items: readonly AiOverviewItem[];
}
