import { countryEmergencyProfiles } from "@/lib/data/emergency";
import { citySafetyProfiles } from "@/lib/data/public-safety";
import { getSourcesByIds } from "@/lib/data/sources";
import type {
  CitySafetyProfile,
  CountryEmergencyProfile,
  EmergencyContact,
} from "@/types";

export function getCountryEmergencyProfile(
  countrySlug: string,
): CountryEmergencyProfile | undefined {
  return countryEmergencyProfiles.find(
    (profile) => profile.countrySlug === countrySlug,
  );
}

export function getCitySafetyProfile(
  citySlug: string,
): CitySafetyProfile | undefined {
  return citySafetyProfiles.find((profile) => profile.citySlug === citySlug);
}

export function getCountryEmergencyContacts(
  profile: CountryEmergencyProfile,
): EmergencyContact[] {
  const contacts: EmergencyContact[] = [];
  const seen = new Set<string>();

  const candidates: Array<EmergencyContact | undefined> = [
    profile.universalNumber,
    profile.police,
    profile.ambulance,
    profile.fire,
    profile.touristEmergency,
    profile.coastGuard,
    profile.disasterResponse,
  ];

  for (const contact of candidates) {
    if (!contact) {
      continue;
    }
    const key = `${contact.type}:${contact.value}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    contacts.push(contact);
  }

  return contacts;
}

export function getEmergencySources(
  profile: CountryEmergencyProfile | CitySafetyProfile,
) {
  return getSourcesByIds(profile.sourceIds);
}

export function hasVerifiedEmergencyData(
  profile: CountryEmergencyProfile | CitySafetyProfile | undefined,
): profile is CountryEmergencyProfile | CitySafetyProfile {
  if (!profile) {
    return false;
  }
  return profile.verificationStatus === "verified";
}
