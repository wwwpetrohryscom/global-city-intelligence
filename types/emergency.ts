export type EmergencyContactType =
  | "universal"
  | "police"
  | "ambulance"
  | "fire"
  | "tourist"
  | "coast-guard"
  | "disaster";

export type EmergencyAvailability =
  | "24/7"
  | "business-hours"
  | "limited"
  | "unknown";

export type VerificationStatus = "verified" | "partial" | "unavailable";

export interface EmergencyContact {
  label: string;
  value: string;
  type: EmergencyContactType;
  availability?: EmergencyAvailability;
  notes?: string;
  sourceIds: string[];
}

export interface CountryEmergencyProfile {
  countrySlug: string;
  countryCode: string;
  universalNumber?: EmergencyContact;
  police?: EmergencyContact;
  ambulance?: EmergencyContact;
  fire?: EmergencyContact;
  touristEmergency?: EmergencyContact;
  coastGuard?: EmergencyContact;
  disasterResponse?: EmergencyContact;
  lastVerified: string;
  dataYear?: string;
  sourceIds: string[];
  verificationStatus: VerificationStatus;
}

export interface CitySafetyProfile {
  citySlug: string;
  countrySlug: string;
  localGuidance?: string;
  hospitalEmergencyNotes?: string;
  transportEmergencyNotes?: string;
  touristSafetyNotes?: string;
  lastVerified: string;
  dataYear?: string;
  sourceIds: string[];
  verificationStatus: VerificationStatus;
}
