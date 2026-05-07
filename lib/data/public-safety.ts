import type { CitySafetyProfile } from "@/types";

// City-level safety profiles are intentionally empty until we add records
// backed by official municipal or national emergency-service publishers.
// City pages render a transparent fallback when no profile exists, and
// link to the country emergency profile for the universal contact numbers.
export const citySafetyProfiles: CitySafetyProfile[] = [];
