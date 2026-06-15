/**
 * Medical facility — a deterministic, REPRESENTATIVE healthcare-ecosystem entity.
 *
 * IMPORTANT: these records are generated deterministically by
 * scripts/generate-healthcare.py as illustrative dataset entities for research,
 * discovery, and SEO. They are NOT a directory of specific, real, or accredited
 * hospitals or clinics. Names follow generic type-based templates. Verify actual
 * facilities, services, and emergency information with official sources.
 */
export type MedicalFacilityType =
  | "general_hospital"
  | "specialist_hospital"
  | "university_hospital"
  | "medical_center"
  | "community_hospital";

export type MedicalServiceLevel = "local" | "regional" | "national";

export interface MedicalFacility {
  id: string;

  citySlug: string;

  name: string;

  type: MedicalFacilityType;

  serviceLevel: MedicalServiceLevel;

  createdAt: string;
  updatedAt: string;
}
