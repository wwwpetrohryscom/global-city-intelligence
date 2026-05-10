import { HealthcareDisclaimer } from "@/components/healthcare/HealthcareDisclaimer";
import { HealthcareInfoCard } from "@/components/healthcare/HealthcareInfoCard";
import { HealthcareSourcesBlock } from "@/components/healthcare/HealthcareSourcesBlock";
import { HealthcareVerificationBadge } from "@/components/healthcare/HealthcareVerificationBadge";
import { HospitalRegistryCard } from "@/components/healthcare/HospitalRegistryCard";
import { VerifiedHospitalsTable } from "@/components/healthcare/VerifiedHospitalsTable";
import { getHealthcareSources } from "@/lib/data/queries/healthcare";
import { staticRoutes } from "@/lib/seo/routes";
import type {
  CityHealthcareProfile,
  DataSource,
  HealthcareAccessProfile,
  HospitalRegistryProfile,
  VerifiedHospital,
} from "@/types";

interface HealthcareAccessSectionProps {
  variant: "country" | "city";
  countryName: string;
  countryProfile?: HealthcareAccessProfile;
  cityName?: string;
  cityProfile?: CityHealthcareProfile;
  hospitalRegistry?: HospitalRegistryProfile;
  verifiedHospitals?: VerifiedHospital[];
  countryHref?: string;
  emergencySectionHref?: string;
}

export function HealthcareAccessSection({
  variant,
  countryName,
  countryProfile,
  cityName,
  cityProfile,
  hospitalRegistry,
  verifiedHospitals = [],
  countryHref,
  emergencySectionHref,
}: HealthcareAccessSectionProps) {
  const heading =
    variant === "country"
      ? `Healthcare and hospitals in ${countryName}`
      : `Healthcare and hospitals in ${cityName ?? countryName}`;

  const intro =
    variant === "country"
      ? `Verified national healthcare information for ${countryName}, drawn from official government and public health publishers. This is informational only and does not provide medical advice.`
      : `Healthcare context for ${cityName ?? countryName}, with national-level information from ${countryName} where city-specific data is not yet verified. This is informational only and does not provide medical advice.`;

  const status =
    cityProfile?.verificationStatus ??
    countryProfile?.verificationStatus ??
    "unavailable";

  const lastVerified =
    cityProfile?.lastVerified ?? countryProfile?.lastVerified;

  const sources = mergeSources(
    countryProfile ? getHealthcareSources(countryProfile) : [],
    cityProfile ? getHealthcareSources(cityProfile) : [],
    hospitalRegistry ? getHealthcareSources(hospitalRegistry) : [],
  );

  const hasCountryDetail = Boolean(
    countryProfile &&
      (countryProfile.healthcareSystemName ||
        countryProfile.officialHealthPortal ||
        countryProfile.publicHealthAuthority ||
        countryProfile.emergencyMedicalInfo ||
        countryProfile.insuranceOrAccessNote),
  );

  return (
    <section
      aria-labelledby="healthcare-access-heading"
      className="space-y-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <h2
            className="text-2xl font-semibold text-text-primary"
            id="healthcare-access-heading"
          >
            {heading}
          </h2>
          <p className="mt-3 text-base leading-7 text-text-secondary">
            {intro}
          </p>
        </div>
        <HealthcareVerificationBadge status={status} />
      </div>

      {variant === "country" && countryProfile ? (
        <CountryHealthcareDetails profile={countryProfile} />
      ) : null}

      {variant === "city" ? (
        <CityHealthcareDetails
          cityName={cityName ?? countryName}
          countryHref={countryHref}
          countryName={countryName}
          hasCountryProfile={hasCountryDetail}
          profile={cityProfile}
        />
      ) : null}

      {hospitalRegistry ? (
        <HospitalRegistryCard profile={hospitalRegistry} />
      ) : null}

      {verifiedHospitals.length > 0 ? (
        <VerifiedHospitalsTable
          caption={`Verified hospitals in ${cityName ?? countryName}`}
          hospitals={verifiedHospitals}
        />
      ) : null}

      {!countryProfile && !cityProfile ? (
        <HealthcareDisclaimer variant="fallback" />
      ) : (
        <HealthcareDisclaimer />
      )}

      <HealthcareSourcesBlock lastVerified={lastVerified} sources={sources} />

      <HealthcareCrossLinks emergencySectionHref={emergencySectionHref} />
    </section>
  );
}

function CountryHealthcareDetails({
  profile,
}: {
  profile: HealthcareAccessProfile;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {profile.healthcareSystemName ? (
        <HealthcareInfoCard
          body={profile.healthcareSystemName}
          title="Healthcare system"
        />
      ) : null}
      {profile.officialHealthPortal ? (
        <HealthcareInfoCard
          link={profile.officialHealthPortal}
          title="Official health portal"
        />
      ) : null}
      {profile.publicHealthAuthority ? (
        <HealthcareInfoCard
          link={profile.publicHealthAuthority}
          title="Public health authority"
        />
      ) : null}
      {profile.emergencyMedicalInfo ? (
        <HealthcareInfoCard
          body={profile.emergencyMedicalInfo}
          title="Emergency medical information"
        />
      ) : null}
      {profile.insuranceOrAccessNote ? (
        <HealthcareInfoCard
          body={profile.insuranceOrAccessNote}
          title="Insurance and access"
        />
      ) : null}
    </div>
  );
}

function CityHealthcareDetails({
  cityName,
  profile,
  countryName,
  countryHref,
  hasCountryProfile,
}: {
  cityName: string;
  profile?: CityHealthcareProfile;
  countryName: string;
  countryHref?: string;
  hasCountryProfile: boolean;
}) {
  const hasLocal = Boolean(
    profile &&
      (profile.healthcareAccessNote ||
        profile.emergencyCareNote ||
        profile.hospitalRegistryNote),
  );

  return (
    <div className="space-y-4">
      {countryHref ? (
        <p className="text-sm leading-6 text-text-secondary">
          For the national healthcare and public-health context that applies
          in {cityName}, see the{" "}
          <a
            className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
            href={countryHref}
          >
            {countryName} healthcare profile
          </a>
          {hasCountryProfile
            ? "."
            : ", which currently lists no verified national healthcare information."}
        </p>
      ) : null}
      {hasLocal && profile ? (
        <div className="grid gap-4 md:grid-cols-2">
          {profile.healthcareAccessNote ? (
            <HealthcareInfoCard
              body={profile.healthcareAccessNote}
              title="Local healthcare access"
            />
          ) : null}
          {profile.emergencyCareNote ? (
            <HealthcareInfoCard
              body={profile.emergencyCareNote}
              title="Local emergency care"
            />
          ) : null}
          {profile.hospitalRegistryNote ? (
            <HealthcareInfoCard
              body={profile.hospitalRegistryNote}
              title="Local hospital information"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function HealthcareCrossLinks({
  emergencySectionHref,
}: {
  emergencySectionHref?: string;
}) {
  return (
    <p className="text-sm leading-6 text-text-secondary">
      Related sections:{" "}
      {emergencySectionHref ? (
        <>
          <a
            className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
            href={emergencySectionHref}
          >
            emergency and public safety
          </a>
          ,{" "}
        </>
      ) : null}
      <a
        className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
        href={staticRoutes.methodology}
      >
        scoring methodology
      </a>
      , and{" "}
      <a
        className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
        href={staticRoutes.dataSources}
      >
        data sources
      </a>
      .
    </p>
  );
}

function mergeSources(...lists: DataSource[][]): DataSource[] {
  const seen = new Set<string>();
  const merged: DataSource[] = [];
  for (const list of lists) {
    for (const source of list) {
      if (seen.has(source.id)) {
        continue;
      }
      seen.add(source.id);
      merged.push(source);
    }
  }
  return merged;
}
