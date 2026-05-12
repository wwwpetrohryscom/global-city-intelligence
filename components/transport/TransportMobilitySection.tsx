import { AirportLinksTable } from "@/components/transport/AirportLinksTable";
import { TransportDisclaimer } from "@/components/transport/TransportDisclaimer";
import { TransportInfoCard } from "@/components/transport/TransportInfoCard";
import { TransportSourcesBlock } from "@/components/transport/TransportSourcesBlock";
import { TransportVerificationBadge } from "@/components/transport/TransportVerificationBadge";
import { getTransportSources } from "@/lib/data/queries/transport";
import { staticRoutes } from "@/lib/seo/routes";
import type {
  AirportProfile,
  CityMobilityProfile,
  CountryTransportProfile,
  DataSource,
} from "@/types";

interface TransportMobilitySectionProps {
  variant: "country" | "city";
  countryName: string;
  countryProfile?: CountryTransportProfile;
  cityName?: string;
  cityProfile?: CityMobilityProfile;
  cityAirports?: AirportProfile[];
  countryHref?: string;
  emergencySectionHref?: string;
  healthcareSectionHref?: string;
}

export function TransportMobilitySection({
  variant,
  countryName,
  countryProfile,
  cityName,
  cityProfile,
  cityAirports = [],
  countryHref,
  emergencySectionHref,
  healthcareSectionHref,
}: TransportMobilitySectionProps) {
  const heading =
    variant === "country"
      ? `Transport and mobility in ${countryName}`
      : `Transport and mobility in ${cityName ?? countryName}`;

  const intro =
    variant === "country"
      ? `Verified national transport context for ${countryName}, attributed to official transport ministries, national operators, and aviation authorities. This is informational only; routes, fares, and schedules change frequently — check the linked authorities for current details.`
      : `Local mobility context for ${cityName ?? countryName}, with national-level context from ${countryName} where city-specific data is not yet verified. This is informational only.`;

  const status =
    cityProfile?.verificationStatus ??
    countryProfile?.verificationStatus ??
    "unavailable";

  const lastVerified =
    cityProfile?.lastVerified ?? countryProfile?.lastVerified;

  const sources = mergeSources(
    countryProfile ? getTransportSources(countryProfile) : [],
    cityProfile ? getTransportSources(cityProfile) : [],
  );

  const hasCountryDetail = Boolean(
    countryProfile &&
      (countryProfile.nationalTransportAuthority ||
        countryProfile.publicTransportOverview ||
        countryProfile.railAuthority ||
        countryProfile.aviationAuthority ||
        countryProfile.transportSafetyAuthority ||
        countryProfile.officialTransportPortal),
  );

  return (
    <section
      aria-labelledby="transport-mobility-heading"
      className="space-y-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <h2
            className="text-2xl font-semibold text-text-primary"
            id="transport-mobility-heading"
          >
            {heading}
          </h2>
          <p className="mt-3 text-base leading-7 text-text-secondary">
            {intro}
          </p>
        </div>
        <TransportVerificationBadge status={status} />
      </div>

      {variant === "country" && countryProfile ? (
        <CountryTransportDetails profile={countryProfile} />
      ) : null}

      {variant === "city" ? (
        <CityMobilityDetails
          cityName={cityName ?? countryName}
          countryHref={countryHref}
          countryName={countryName}
          hasCountryProfile={hasCountryDetail}
          profile={cityProfile}
        />
      ) : null}

      {cityAirports.length > 0 ? (
        <AirportLinksTable
          airports={cityAirports}
          caption={`Airports serving ${cityName ?? countryName}`}
        />
      ) : null}

      {!countryProfile && !cityProfile ? (
        <TransportDisclaimer variant="fallback" />
      ) : (
        <TransportDisclaimer />
      )}

      <TransportSourcesBlock lastVerified={lastVerified} sources={sources} />

      <TransportCrossLinks
        emergencySectionHref={emergencySectionHref}
        healthcareSectionHref={healthcareSectionHref}
      />
    </section>
  );
}

function CountryTransportDetails({
  profile,
}: {
  profile: CountryTransportProfile;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {profile.publicTransportOverview ? (
        <TransportInfoCard
          body={profile.publicTransportOverview}
          title="Public transport overview"
        />
      ) : null}
      {profile.nationalTransportAuthority ? (
        <TransportInfoCard
          link={profile.nationalTransportAuthority}
          title="National transport authority"
        />
      ) : null}
      {profile.railAuthority ? (
        <TransportInfoCard
          link={profile.railAuthority}
          title="Rail authority or operator"
        />
      ) : null}
      {profile.aviationAuthority ? (
        <TransportInfoCard
          link={profile.aviationAuthority}
          title="Aviation authority"
        />
      ) : null}
      {profile.transportSafetyAuthority ? (
        <TransportInfoCard
          link={profile.transportSafetyAuthority}
          title="Transport safety authority"
        />
      ) : null}
      {profile.officialTransportPortal ? (
        <TransportInfoCard
          link={profile.officialTransportPortal}
          title="Official transport portal"
        />
      ) : null}
    </div>
  );
}

function CityMobilityDetails({
  cityName,
  profile,
  countryName,
  countryHref,
  hasCountryProfile,
}: {
  cityName: string;
  profile?: CityMobilityProfile;
  countryName: string;
  countryHref?: string;
  hasCountryProfile: boolean;
}) {
  const hasLocal = Boolean(
    profile &&
      (profile.publicTransportAuthority ||
        profile.metroOrRailOperator ||
        profile.bikeWalkabilityNote ||
        profile.transitSafetyNote ||
        profile.mobilityOverview ||
        (profile.airportLinks && profile.airportLinks.length > 0)),
  );

  return (
    <div className="space-y-4">
      {countryHref ? (
        <p className="text-sm leading-6 text-text-secondary">
          For national transport authorities and operators that apply in{" "}
          {cityName}, see the{" "}
          <a
            className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
            href={countryHref}
          >
            {countryName} transport profile
          </a>
          {hasCountryProfile
            ? "."
            : ", which currently lists no verified national transport information."}
        </p>
      ) : null}
      {hasLocal && profile ? (
        <div className="grid gap-4 md:grid-cols-2">
          {profile.mobilityOverview ? (
            <TransportInfoCard
              body={profile.mobilityOverview}
              title="Local mobility overview"
            />
          ) : null}
          {profile.publicTransportAuthority ? (
            <TransportInfoCard
              link={profile.publicTransportAuthority}
              title="City public transport authority"
            />
          ) : null}
          {profile.metroOrRailOperator ? (
            <TransportInfoCard
              link={profile.metroOrRailOperator}
              title="Metro or rail operator"
            />
          ) : null}
          {profile.airportLinks?.map((airport) => (
            <TransportInfoCard
              key={airport.url}
              link={airport}
              title="Airport authority"
            />
          ))}
          {profile.bikeWalkabilityNote ? (
            <TransportInfoCard
              body={profile.bikeWalkabilityNote}
              title="Bike and walkability"
            />
          ) : null}
          {profile.transitSafetyNote ? (
            <TransportInfoCard
              body={profile.transitSafetyNote}
              title="Transit safety"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function TransportCrossLinks({
  emergencySectionHref,
  healthcareSectionHref,
}: {
  emergencySectionHref?: string;
  healthcareSectionHref?: string;
}) {
  const items: Array<{ href: string; label: string }> = [];
  if (emergencySectionHref) {
    items.push({ href: emergencySectionHref, label: "emergency and public safety" });
  }
  if (healthcareSectionHref) {
    items.push({ href: healthcareSectionHref, label: "healthcare and hospitals" });
  }
  items.push({ href: staticRoutes.cities, label: "cities directory" });
  items.push({ href: staticRoutes.countries, label: "countries directory" });
  items.push({ href: staticRoutes.methodology, label: "scoring methodology" });
  items.push({ href: staticRoutes.dataSources, label: "data sources" });

  return (
    <p className="text-sm leading-6 text-text-secondary">
      Related sections:{" "}
      {items.map((item, index) => (
        <span key={item.href}>
          <a
            className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
            href={item.href}
          >
            {item.label}
          </a>
          {index < items.length - 1 ? ", " : "."}
        </span>
      ))}
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
