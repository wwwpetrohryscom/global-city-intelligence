import {
  countryHealthcareProfiles,
  hospitalRegistryProfiles,
} from "@/lib/data/healthcare";
import {
  cityHealthcareProfiles,
  verifiedHospitals,
} from "@/lib/data/hospitals";
import { getSourcesByIds } from "@/lib/data/sources";
import type {
  CityHealthcareProfile,
  HealthcareAccessProfile,
  HospitalRegistryProfile,
  VerifiedHospital,
} from "@/types";

export function getCountryHealthcareProfile(
  countrySlug: string,
): HealthcareAccessProfile | undefined {
  return countryHealthcareProfiles.find(
    (profile) => profile.countrySlug === countrySlug,
  );
}

export function getCityHealthcareProfile(
  citySlug: string,
): CityHealthcareProfile | undefined {
  return cityHealthcareProfiles.find((profile) => profile.citySlug === citySlug);
}

export function getHospitalRegistryProfile(
  countrySlug: string,
  citySlug?: string,
): HospitalRegistryProfile | undefined {
  if (citySlug) {
    const cityMatch = hospitalRegistryProfiles.find(
      (profile) =>
        profile.countrySlug === countrySlug && profile.citySlug === citySlug,
    );
    if (cityMatch) {
      return cityMatch;
    }
  }
  return hospitalRegistryProfiles.find(
    (profile) => profile.countrySlug === countrySlug && !profile.citySlug,
  );
}

export function getVerifiedHospitalsForCity(
  citySlug: string,
): VerifiedHospital[] {
  return verifiedHospitals.filter(
    (hospital) =>
      hospital.citySlug === citySlug &&
      hospital.verificationStatus === "verified",
  );
}

export function getHealthcareSources(
  profile:
    | HealthcareAccessProfile
    | CityHealthcareProfile
    | HospitalRegistryProfile,
) {
  return getSourcesByIds(profile.sourceIds);
}

export function hasVerifiedHealthcareData(
  profile:
    | HealthcareAccessProfile
    | CityHealthcareProfile
    | HospitalRegistryProfile
    | undefined,
): profile is
  | HealthcareAccessProfile
  | CityHealthcareProfile
  | HospitalRegistryProfile {
  if (!profile) {
    return false;
  }
  return profile.verificationStatus === "verified";
}

export function hasVerifiedHospitalData(citySlug: string): boolean {
  return verifiedHospitals.some(
    (hospital) =>
      hospital.citySlug === citySlug &&
      hospital.verificationStatus === "verified",
  );
}
