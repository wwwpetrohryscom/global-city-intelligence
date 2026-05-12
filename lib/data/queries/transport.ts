import { cityMobilityProfiles, verifiedAirports } from "@/lib/data/mobility";
import { getSourcesByIds } from "@/lib/data/sources";
import { countryTransportProfiles } from "@/lib/data/transport";
import type {
  AirportProfile,
  CityMobilityProfile,
  CountryTransportProfile,
} from "@/types";

export function getCountryTransportProfile(
  countrySlug: string,
): CountryTransportProfile | undefined {
  return countryTransportProfiles.find(
    (profile) => profile.countrySlug === countrySlug,
  );
}

export function getCityMobilityProfile(
  citySlug: string,
): CityMobilityProfile | undefined {
  return cityMobilityProfiles.find((profile) => profile.citySlug === citySlug);
}

export function getAirportsForCity(citySlug: string): AirportProfile[] {
  return verifiedAirports.filter(
    (airport) =>
      airport.citySlug === citySlug &&
      airport.verificationStatus === "verified",
  );
}

export function getTransportSources(
  profile: CountryTransportProfile | CityMobilityProfile,
) {
  return getSourcesByIds(profile.sourceIds);
}

export function hasVerifiedTransportData(
  profile: CountryTransportProfile | CityMobilityProfile | undefined,
): profile is CountryTransportProfile | CityMobilityProfile {
  if (!profile) {
    return false;
  }
  return profile.verificationStatus === "verified";
}

export function hasVerifiedCityMobilityData(citySlug: string): boolean {
  const profile = getCityMobilityProfile(citySlug);
  if (!profile) {
    return false;
  }
  return profile.verificationStatus === "verified";
}
