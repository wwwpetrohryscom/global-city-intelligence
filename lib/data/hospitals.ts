import type { CityHealthcareProfile, VerifiedHospital } from "@/types";

// Verified hospital records and city-level healthcare profiles are
// intentionally empty until each entry is backed by an official public
// hospital registry, government health authority, or recognised national
// health-service publisher. City pages render a transparent fallback and
// link to the country healthcare profile in the meantime.
export const verifiedHospitals: VerifiedHospital[] = [];

export const cityHealthcareProfiles: CityHealthcareProfile[] = [];
