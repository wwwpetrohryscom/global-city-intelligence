import type { VerificationStatus } from "./emergency";

export type HealthcareSourceType =
  | "government_health_ministry"
  | "national_health_service"
  | "regional_health_authority"
  | "city_health_department"
  | "emergency_medical_service"
  | "international_public_health"
  | "official_hospital_registry";

export type HealthcareVerificationStatus = VerificationStatus;

export interface HealthcareLink {
  label: string;
  url: string;
  sourceIds: string[];
}

export interface HealthcareAccessProfile {
  countrySlug: string;
  countryCode: string;
  healthcareSystemName?: string;
  officialHealthPortal?: HealthcareLink;
  emergencyMedicalInfo?: string;
  publicHealthAuthority?: HealthcareLink;
  insuranceOrAccessNote?: string;
  lastVerified: string;
  dataYear?: string;
  sourceIds: string[];
  verificationStatus: HealthcareVerificationStatus;
}

export interface HospitalRegistryProfile {
  countrySlug: string;
  citySlug?: string;
  registryName?: string;
  registryUrl?: string;
  registryDescription?: string;
  sourceIds: string[];
  lastVerified: string;
  dataYear?: string;
  verificationStatus: HealthcareVerificationStatus;
}

export interface VerifiedHospital {
  id: string;
  citySlug: string;
  countrySlug: string;
  name: string;
  type?: string;
  emergencyDepartmentAvailable?: boolean;
  officialUrl?: string;
  address?: string;
  phone?: string;
  sourceIds: string[];
  lastVerified: string;
  verificationStatus: HealthcareVerificationStatus;
}

export interface CityHealthcareProfile {
  citySlug: string;
  countrySlug: string;
  healthcareAccessNote?: string;
  emergencyCareNote?: string;
  hospitalRegistryNote?: string;
  verifiedHospitalIds?: string[];
  lastVerified: string;
  dataYear?: string;
  sourceIds: string[];
  verificationStatus: HealthcareVerificationStatus;
}
