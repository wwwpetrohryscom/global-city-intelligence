import { EmergencyContactsTable } from "@/components/safety/EmergencyContactsTable";
import { SafetyDisclaimer } from "@/components/safety/SafetyDisclaimer";
import { SafetySourceBlock } from "@/components/safety/SafetySourceBlock";
import { VerificationBadge } from "@/components/safety/VerificationBadge";
import {
  getCountryEmergencyContacts,
  getEmergencySources,
} from "@/lib/data/queries/emergency";
import { staticRoutes } from "@/lib/seo/routes";
import type {
  CitySafetyProfile,
  CountryEmergencyProfile,
} from "@/types";

interface PublicSafetySectionProps {
  variant: "country" | "city";
  countryName: string;
  countryProfile?: CountryEmergencyProfile;
  cityName?: string;
  cityProfile?: CitySafetyProfile;
  countryHref?: string;
}

export function PublicSafetySection({
  variant,
  countryName,
  countryProfile,
  cityName,
  cityProfile,
  countryHref,
}: PublicSafetySectionProps) {
  const heading =
    variant === "country"
      ? `Emergency and public safety in ${countryName}`
      : `Emergency and public safety in ${cityName ?? countryName}`;

  const intro =
    variant === "country"
      ? `Verified emergency contacts for ${countryName}, drawn from official emergency services and government publishers. Use these as a starting point and confirm current details with local authorities before traveling or relocating.`
      : `Local public safety guidance for ${cityName ?? countryName}, with the country-level emergency contacts that apply when calling for police, fire, or ambulance.`;

  const contacts = countryProfile
    ? getCountryEmergencyContacts(countryProfile)
    : [];
  const countrySources = countryProfile ? getEmergencySources(countryProfile) : [];
  const citySources = cityProfile ? getEmergencySources(cityProfile) : [];
  const allSources = mergeSources(countrySources, citySources);
  const lastVerified =
    cityProfile?.lastVerified ?? countryProfile?.lastVerified;
  const status =
    cityProfile?.verificationStatus ??
    countryProfile?.verificationStatus ??
    "unavailable";

  return (
    <section
      aria-labelledby="emergency-public-safety-heading"
      className="space-y-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <h2
            className="text-2xl font-semibold text-text-primary"
            id="emergency-public-safety-heading"
          >
            {heading}
          </h2>
          <p className="mt-3 text-base leading-7 text-text-secondary">
            {intro}
          </p>
        </div>
        <VerificationBadge status={status} />
      </div>

      {countryProfile && contacts.length > 0 ? (
        <EmergencyContactsTable
          caption={`${countryName} emergency contacts`}
          contacts={contacts}
        />
      ) : (
        <SafetyDisclaimer variant="fallback" />
      )}

      {variant === "city" ? (
        <CitySafetyDetails
          cityName={cityName ?? countryName}
          countryHref={countryHref}
          countryName={countryName}
          hasCountryProfile={Boolean(countryProfile)}
          profile={cityProfile}
        />
      ) : null}

      {variant === "country" ? <SafetyDisclaimer /> : null}

      <SafetySourceBlock lastVerified={lastVerified} sources={allSources} />

      <p className="text-sm leading-6 text-text-secondary">
        Methodology and the wider source registry are documented on the{" "}
        <a
          className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
          href={staticRoutes.methodology}
        >
          scoring methodology
        </a>{" "}
        and{" "}
        <a
          className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
          href={staticRoutes.dataSources}
        >
          data sources
        </a>{" "}
        pages.
      </p>
    </section>
  );
}

function CitySafetyDetails({
  cityName,
  profile,
  countryName,
  countryHref,
  hasCountryProfile,
}: {
  cityName: string;
  profile?: CitySafetyProfile;
  countryName: string;
  countryHref?: string;
  hasCountryProfile: boolean;
}) {
  const items: Array<{ title: string; body: string }> = [];

  if (profile?.localGuidance) {
    items.push({ title: "Local guidance", body: profile.localGuidance });
  }
  if (profile?.hospitalEmergencyNotes) {
    items.push({
      title: "Hospital emergencies",
      body: profile.hospitalEmergencyNotes,
    });
  }
  if (profile?.transportEmergencyNotes) {
    items.push({
      title: "Public transport emergencies",
      body: profile.transportEmergencyNotes,
    });
  }
  if (profile?.touristSafetyNotes) {
    items.push({
      title: "Tourist safety",
      body: profile.touristSafetyNotes,
    });
  }

  return (
    <div className="space-y-4">
      {countryHref ? (
        <p className="text-sm leading-6 text-text-secondary">
          For the universal emergency contacts that apply in {cityName},
          including police, fire, and ambulance, see the{" "}
          <a
            className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
            href={countryHref}
          >
            {countryName} emergency profile
          </a>
          {hasCountryProfile ? "." : ", which currently lists no verified national contacts."}
        </p>
      ) : null}
      {items.length > 0 ? (
        <dl className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div
              className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm"
              key={item.title}
            >
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {item.title}
              </dt>
              <dd className="mt-2 text-sm leading-6 text-text-primary">
                {item.body}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

function mergeSources<T extends { id: string }>(a: T[], b: T[]): T[] {
  const seen = new Set<string>();
  const merged: T[] = [];
  for (const source of [...a, ...b]) {
    if (seen.has(source.id)) {
      continue;
    }
    seen.add(source.id);
    merged.push(source);
  }
  return merged;
}
