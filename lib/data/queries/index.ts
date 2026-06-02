import { cities } from "@/lib/data/cities";
import { countries } from "@/lib/data/countries";
import { intelligenceModules } from "@/lib/data/modules";
import { rankings } from "@/lib/data/rankings";
import { dataSources, getSourcesByIds as getSourcesByIdsImpl } from "@/lib/data/sources";
import type { ModuleSlug } from "@/types";

export function getAllCities() {
  return cities;
}

export function getCityBySlug(slug: string) {
  return cities.find((city) => city.slug === slug);
}

export function getAllCountries() {
  return countries;
}

export function getCountryBySlug(slug: string) {
  return countries.find((country) => country.slug === slug);
}

export function getCitiesByCountrySlug(countrySlug: string) {
  return cities.filter((city) => city.countrySlug === countrySlug);
}

export function getAllModules() {
  return intelligenceModules;
}

export function getModuleBySlug(slug: string) {
  return intelligenceModules.find((moduleItem) => moduleItem.slug === slug);
}

export function getCityModule(citySlug: string, moduleSlug: ModuleSlug) {
  const city = getCityBySlug(citySlug);

  if (!city) {
    return undefined;
  }

  return city.modules[moduleSlug];
}

export function getAllRankings() {
  return rankings;
}

export function getRankingBySlug(slug: string) {
  return rankings.find((ranking) => ranking.slug === slug);
}

export function getRankingEntriesWithCities(slug: string) {
  const ranking = getRankingBySlug(slug);

  if (!ranking) {
    return [];
  }

  return ranking.entries
    .map((entry) => {
      const city = getCityBySlug(entry.citySlug);
      return city ? { ...entry, city } : undefined;
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
}

export function getAllSources() {
  return dataSources;
}

export const getSourcesByIds = getSourcesByIdsImpl;

// Backward-compatible aliases.
export const getCities = getAllCities;
export const getCountries = getAllCountries;
export const getModules = getAllModules;
export const getRankings = getAllRankings;

export {
  getCitySafetyProfile,
  getCountryEmergencyContacts,
  getCountryEmergencyProfile,
  getEmergencySources,
  hasVerifiedEmergencyData,
} from "@/lib/data/queries/emergency";

export {
  getCityHealthcareProfile,
  getCountryHealthcareProfile,
  getHealthcareSources,
  getHospitalRegistryProfile,
  getVerifiedHospitalsForCity,
  hasVerifiedHealthcareData,
  hasVerifiedHospitalData,
} from "@/lib/data/queries/healthcare";

export {
  getAirportsForCity,
  getCityMobilityProfile,
  getCountryTransportProfile,
  getTransportSources,
  hasVerifiedCityMobilityData,
  hasVerifiedTransportData,
} from "@/lib/data/queries/transport";

export {
  getAllComparisons,
  getComparisonBySlug,
  getComparisonsForCity,
  getRelatedComparisons,
} from "@/lib/data/queries/comparisons";

export { buildComparisonSlug, getComparisonIntentLabel } from "@/lib/data/comparisons";

export {
  getAllCollections,
  getCitiesForCollection,
  getCollectionBySlug,
  getCollectionsForCity,
  getRelatedCollections,
} from "@/lib/data/queries/collections";

export { getCollectionIntentLabel } from "@/lib/data/collections";

export {
  getCollectionsForCountry,
  getComparisonsForCountry,
  getRankingsForCountry,
} from "@/lib/data/queries/country-hub";

export {
  getAllCityIntentPages,
  getAllCityIntents,
  getCityIntentBySlug,
  getCityIntentPage,
  getIntentPagesForCity,
  getIntentPagesForCollection,
  getIntentPagesForIntent,
} from "@/lib/data/queries/city-intents";

export {
  getAllArrivalPages,
  getArrivalChecklist,
  getArrivalPageByCitySlug,
  getArrivalPagesForCountry,
  hasArrivalPage,
} from "@/lib/data/queries/arrival";

export { getArrivalFocusLabel } from "@/lib/data/arrival";

export {
  getAllNeighborhoodPlanningPages,
  getNeighborhoodPlanningChecklist,
  getNeighborhoodPlanningPageByCitySlug,
  getNeighborhoodPlanningPagesForCountry,
  hasNeighborhoodPlanningPage,
} from "@/lib/data/queries/neighborhoods";

export { getNeighborhoodPlanningFocusLabel } from "@/lib/data/neighborhoods";

export {
  getAllMovingToCityPages,
  getMovingToCityChecklist,
  getMovingToCityPageByCitySlug,
  getMovingToCityPagesForCountry,
  hasMovingToCityPage,
} from "@/lib/data/queries/moving";

export { getMovingFocusLabel } from "@/lib/data/moving";

export {
  getAllVisualCityGuidePages,
  getVisualCityGuidePageByCitySlug,
  getVisualCityGuidePagesForCountry,
  getVisualGuideSections,
  hasVisualCityGuidePage,
} from "@/lib/data/queries/visual-guides";

export { getVisualGuideFocusLabel } from "@/lib/data/visual-guides";

export {
  getAllSummerTravelPages,
  getSummerTravelChecklist,
  getSummerTravelPageByCitySlug,
  getSummerTravelPagesForCountry,
  hasSummerTravelPage,
} from "@/lib/data/queries/summer-travel";

export { getSummerTravelFocusLabel } from "@/lib/data/summer-travel";

export {
  getAllWeekendTripPages,
  getWeekendTripChecklist,
  getWeekendTripPageByCitySlug,
  getWeekendTripPagesForCountry,
  hasWeekendTripPage,
} from "@/lib/data/queries/weekend-trip";

export { getWeekendTripFocusLabel } from "@/lib/data/weekend-trip";

export {
  getAllCitiesWithNearbyWeekendPlaces,
  getAllNearbyWeekendPlaceDetailPages,
  getAllNearbyWeekendPlaces,
  getNearbyWeekendPlaceBySlug,
  getNearbyWeekendPlaceCityPageBySlug,
  getNearbyWeekendPlaceDetailPageBySlug,
  getNearbyWeekendPlacesByCategory,
  getNearbyWeekendPlacesForCity,
  getNearbyWeekendPlacesForCountry,
  getNearbyWeekendPlacesForWeekendTrip,
  hasNearbyWeekendPlaceDetailPage,
  hasNearbyWeekendPlacesCityPage,
  hasNearbyWeekendPlacesForCity,
} from "@/lib/data/queries/nearby-places";

export { getNearbyPlaceCategoryLabel } from "@/lib/data/nearby-places";

export { getNearbyPlaceFacts } from "@/lib/data/nearby-place-facts";

export { getCityIntentTitle } from "@/lib/data/city-intents";

export {
  getAirQualityDatasetMetadata,
  getAirQualityMetricsForCity,
  getAirQualityProfileForCity,
  getAirQualitySourcesForCity,
  getCitiesWithVerifiedAirQualityData,
  hasVerifiedAirQualityData,
} from "@/lib/data/official/air-quality/queries";

export {
  getAirQualityBaselineSourceIds,
  getAirQualityBaselineSources,
} from "@/lib/data/official/air-quality/sources";

export { listOfficialDatasets } from "@/lib/data/official/registry";

export {
  getCountriesWithVerifiedIndicators,
  getCountryIndicatorDatasetMetadata,
  getCountryIndicatorProfile,
  getCountryIndicatorSources,
  getCountryIndicatorsForCountry,
  hasVerifiedCountryIndicators,
} from "@/lib/data/official/country-indicators/queries";

export {
  getCountryIndicatorBaselineSourceIds,
  getCountryIndicatorBaselineSources,
} from "@/lib/data/official/country-indicators/sources";

export type {
  CountryCollectionMatch,
  CountryRankingMatch,
} from "@/lib/data/queries/country-hub";
