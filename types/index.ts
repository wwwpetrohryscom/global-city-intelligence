export type { City, CityModuleData, CityScores } from "./city";
export type { Country } from "./country";
export type {
  CitySafetyProfile,
  CountryEmergencyProfile,
  EmergencyAvailability,
  EmergencyContact,
  EmergencyContactType,
  VerificationStatus,
} from "./emergency";
export type {
  CityHealthcareProfile,
  HealthcareAccessProfile,
  HealthcareLink,
  HealthcareSourceType,
  HealthcareVerificationStatus,
  HospitalRegistryProfile,
  VerifiedHospital,
} from "./healthcare";
export type {
  AirportProfile,
  CityMobilityProfile,
  CountryTransportProfile,
  TransportLink,
  TransportSourceType,
  TransportVerificationStatus,
} from "./transport";
export type {
  CityComparison,
  ComparisonCategory,
  ComparisonIntent,
  ComparisonRegion,
} from "./comparison";
export type {
  CityCollection,
  CollectionCriterion,
  CollectionIntent,
} from "./collection";
export type {
  CommunityPhotoAttachmentTargetType,
  CommunityPhotoLicenseIntent,
  CommunityPhotoModerationDecision,
  CommunityPhotoModerationRecord,
  CommunityPhotoPolicy,
  CommunityPhotoPublicRecord,
  CommunityPhotoReviewPriority,
  CommunityPhotoSafetyFlag,
  CommunityPhotoSourceType,
  CommunityPhotoSubmission,
  CommunityPhotoSubmissionStatus,
  CommunityPhotoValidationResult,
  CommunityPhotoVisibility,
} from "./community-media";
export type {
  CityIntent,
  CityIntentCriterion,
  CityIntentPage,
  CityIntentSlug,
} from "./intent";
export type {
  ArrivalChecklistCategory,
  ArrivalChecklistItem,
  ArrivalFocus,
  ArrivalPage,
} from "./arrival";
export type {
  NeighborhoodChecklistCategory,
  NeighborhoodChecklistItem,
  NeighborhoodPlanningFocus,
  NeighborhoodPlanningPage,
} from "./neighborhoods";
export type {
  MovingChecklistCategory,
  MovingChecklistItem,
  MovingFocus,
  MovingToCityPage,
} from "./moving";
export type {
  VisualCityGuidePage,
  VisualGuideFocus,
  VisualGuideSection,
  VisualGuideSectionCategory,
} from "./visual-guides";
export type {
  SummerTravelChecklistCategory,
  SummerTravelChecklistItem,
  SummerTravelCityPage,
  SummerTravelFocus,
} from "./summer-travel";
export type {
  WeekendTripChecklistCategory,
  WeekendTripChecklistItem,
  WeekendTripCityPage,
  WeekendTripFocus,
} from "./weekend-trip";
export type {
  DistanceBand,
  NearbyPlaceCategory,
  NearbyPlaceFacts,
  NearbyPlaceImage,
  NearbyPlaceTravelMode,
  NearbyPlaceVerificationStatus,
  NearbyWeekendPlace,
} from "./nearby-places";
export type {
  DataProvenance,
  DatasetCoverage,
  MetricVerificationStatus,
  NormalizedMetric,
  OfficialDataset,
} from "./datasets";
export type {
  AirQualityCityMetric,
  AirQualityCityProfile,
  AirQualityDatasetRecord,
  AirQualityMetricKey,
} from "./air-quality";
export type {
  CountryIndicatorKey,
  CountryIndicatorProfile,
  CountryIndicatorRecord,
} from "./country-indicators";
export type { IntelligenceModule, ModuleSlug } from "./module";
export type { Ranking, RankingEntry } from "./ranking";
export type {
  BreadcrumbItem,
  ChangeFrequency,
  DataTableRow,
  Metric,
  PageFreshness,
} from "./seo";
export type { DataSource } from "./source";
export type {
  PlaceImage,
  PlaceImageSource,
  PlaceImageType,
  PlaceType,
} from "./media";
export type {
  Photo,
  PhotoAttribution,
  PhotoGallery,
  PhotoGalleryTargetType,
  PhotoSourceType,
  PhotoStatus,
} from "./photos";
// Community photo submission lifecycle (Phase 3). `CommunityPhotoSubmission`
// is intentionally NOT re-exported here: a distinct internal admin record of
// the same name already lives in ./community-media. Import the submission
// record from "@/types/submissions" directly.
export type {
  CommunityPhotoSubmissionDraft,
  SubmissionReviewState,
  SubmissionStatus,
  SubmissionValidationError,
  SubmissionValidationResult,
  SubmissionValidationSeverity,
} from "./submissions";
// Community photo publication bridge (Phase 4).
export type {
  PublicationCandidate,
  PublicationResult,
  PublicationRule,
  PublicationStatus,
  PublicationValidationError,
  PublicationValidationResult,
  PublicationValidationSeverity,
} from "./publication";
// City discovery graph (local-first city-to-city navigation).
export type {
  CityDiscoveryNode,
  CityRelationshipType,
  RelatedCity,
} from "./discovery";
// Regional discovery collections (local-first regional navigation).
export type { RegionalCollection, RegionType } from "./regional-collections";
// Nearby-place discovery graph (local-first place-to-place navigation).
// NearbyPlaceRelationshipType is a string enum (runtime value), so it is
// exported as a value, not type-only.
export { NearbyPlaceRelationshipType } from "./nearby-discovery";
export type {
  NearbyPlaceDiscoveryNode,
  RelatedPlace,
} from "./nearby-discovery";
