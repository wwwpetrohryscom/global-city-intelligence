import type { HospitalRegistryProfile } from "@/types";

export function HospitalRegistryCard({
  profile,
}: {
  profile: HospitalRegistryProfile;
}) {
  if (!profile.registryUrl || !profile.registryName) {
    return null;
  }

  return (
    <article className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        Official hospital registry
      </p>
      <p className="mt-2 text-base font-semibold text-text-primary">
        <a
          className="underline decoration-brand-500 decoration-2 underline-offset-4 hover:bg-orange-50"
          href={profile.registryUrl}
          rel="noreferrer"
          target="_blank"
        >
          {profile.registryName}
        </a>
      </p>
      {profile.registryDescription ? (
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {profile.registryDescription}
        </p>
      ) : null}
      <p className="mt-3 text-xs uppercase tracking-wide text-text-secondary">
        Last verified: {profile.lastVerified}
      </p>
    </article>
  );
}
