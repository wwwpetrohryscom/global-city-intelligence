import type { VerificationStatus } from "./emergency";

export type TransportSourceType =
  | "national_transport_ministry"
  | "city_transport_authority"
  | "regional_transport_authority"
  | "airport_authority"
  | "railway_operator"
  | "metro_operator"
  | "public_transport_operator"
  | "transport_open_data"
  | "transport_safety_authority"
  | "international_transport_dataset";

export type TransportVerificationStatus = VerificationStatus;

export interface TransportLink {
  label: string;
  url: string;
  sourceIds: string[];
}

export interface CountryTransportProfile {
  countrySlug: string;
  countryCode: string;
  nationalTransportAuthority?: TransportLink;
  publicTransportOverview?: string;
  railAuthority?: TransportLink;
  aviationAuthority?: TransportLink;
  transportSafetyAuthority?: TransportLink;
  officialTransportPortal?: TransportLink;
  lastVerified: string;
  dataYear?: string;
  sourceIds: string[];
  verificationStatus: TransportVerificationStatus;
}

export interface CityMobilityProfile {
  citySlug: string;
  countrySlug: string;
  publicTransportAuthority?: TransportLink;
  metroOrRailOperator?: TransportLink;
  airportLinks?: TransportLink[];
  bikeWalkabilityNote?: string;
  transitSafetyNote?: string;
  mobilityOverview?: string;
  lastVerified: string;
  dataYear?: string;
  sourceIds: string[];
  verificationStatus: TransportVerificationStatus;
}

export interface AirportProfile {
  id: string;
  citySlug?: string;
  countrySlug: string;
  name: string;
  iataCode?: string;
  officialUrl: string;
  sourceIds: string[];
  lastVerified: string;
  verificationStatus: TransportVerificationStatus;
}
