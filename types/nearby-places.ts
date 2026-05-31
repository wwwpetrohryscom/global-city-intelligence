export type NearbyPlaceCategory =
  | "nature"
  | "waterfront"
  | "historic_town"
  | "park"
  | "beach"
  | "lake"
  | "mountain"
  | "island"
  | "cultural_site"
  | "regional_city"
  | "family_outdoor"
  | "general_weekend_place";

export type NearbyPlaceTravelMode =
  | "train"
  | "bus"
  | "car"
  | "ferry"
  | "walking"
  | "cycling"
  | "mixed"
  | "unknown";

export type DistanceBand =
  | "nearby"
  | "regional"
  | "longer_weekend"
  | "unknown";

export type NearbyPlaceVerificationStatus =
  | "verified"
  | "partial"
  | "needs_review";

export interface NearbyPlaceImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  source: string;
  sourceUrl: string;
  author: string;
  authorUrl?: string;
  license: string;
  licenseUrl?: string;
  attributionText: string;
  verified: boolean;
  verifiedAt: string;
}

export interface NearbyWeekendPlace {
  id: string;
  slug: string;
  name: string;
  countrySlug: string;
  regionName?: string;
  category: NearbyPlaceCategory;
  summary: string;
  connectedCitySlugs: string[];
  sourceIds: string[];
  officialUrl?: string;
  wikidataId?: string;
  commonsCategory?: string;
  latitude?: number;
  longitude?: number;
  coordinateSource?: string;
  image?: NearbyPlaceImage;
  verificationStatus: NearbyPlaceVerificationStatus;
  verifiedAt: string;
  updatedDate: string;
  dataYear: string;
  travelModeHint?: NearbyPlaceTravelMode;
  distanceBand?: DistanceBand;
  cautionNotes?: string;
}
