/**
 * University profile — a deterministic, REPRESENTATIVE academic-ecosystem entity.
 *
 * IMPORTANT: these records are generated deterministically by
 * scripts/generate-education.py as illustrative dataset entities for research,
 * discovery, and SEO. They are NOT a directory of specific, real, or accredited
 * institutions, and the scores are NOT rankings or measured data. Names follow
 * generic type-based templates; `foundedYear` is an illustrative estimate. Verify
 * actual universities and accreditation with official sources.
 *
 * `focusAreas` (2–6 academic fields) is stored alongside the profile (Phase E
 * "Academic fields" requirement).
 */
export type UniversityType =
  | "public"
  | "private"
  | "research"
  | "technical"
  | "medical"
  | "business";

export type StudentPopulationCategory = "small" | "medium" | "large";

export interface UniversityProfile {
  id: string;

  citySlug: string;

  name: string;

  type: UniversityType;

  focusAreas: string[];

  internationalFocusScore: number;

  researchIntensityScore: number;

  studentPopulationCategory: StudentPopulationCategory;

  foundedYear?: number;

  createdAt: string;
  updatedAt: string;
}
