import Link from "next/link";
import { AirQualityMetricCards } from "@/components/data/AirQualityMetricCards";
import { AirQualityMetricsTable } from "@/components/data/AirQualityMetricsTable";
import { DataProvenanceBlock } from "@/components/data/DataProvenanceBlock";
import { DataVerificationBadge } from "@/components/data/DataVerificationBadge";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getAirQualityProfileForCity,
  getAirQualitySourcesForCity,
} from "@/lib/data/queries";
import { staticRoutes } from "@/lib/seo/routes";
import type { City, DataProvenance } from "@/types";

const SECTION_ID = "air-quality-dataset";

interface AirQualityProfileSectionProps {
  city: City;
  /**
   * Optional override copy for the fallback paragraph. The default
   * is intentionally generic; use this prop to vary the wording on
   * intent pages, collection pages, and comparison surfaces so the
   * paragraph is not repeated verbatim across the site.
   */
  fallbackCopy?: string;
  /**
   * Optional context links to surface alongside the section
   * (e.g. clean-air collection or clean-air intent guide).
   */
  contextLinks?: { label: string; href: string }[];
}

const BASELINE_PROVENANCE_NOTE =
  "The air-quality dataset begins empty by design. Verified city-level measurements appear here only after they are sourced from accepted publishers (WHO, EEA, US EPA, OpenAQ, OECD, or official national/city environmental agencies).";

function buildBaselineProvenance(city: City): DataProvenance {
  return {
    datasetId: "global-city-air-quality",
    sourceIds: ["who-air"],
    publisher: "Global City Intelligence",
    lastVerified: city.lastUpdated,
    verificationStatus: "unavailable",
    transformationNotes: BASELINE_PROVENANCE_NOTE,
  };
}

export function AirQualityProfileSection({
  city,
  fallbackCopy,
  contextLinks,
}: AirQualityProfileSectionProps) {
  const profile = getAirQualityProfileForCity(city.slug);
  const sources = getAirQualitySourcesForCity(city.slug);
  const verified = profile?.verificationStatus === "verified";
  const status = profile?.verificationStatus ?? "unavailable";

  const provenance = profile?.provenance ?? [buildBaselineProvenance(city)];

  return (
    <section aria-labelledby={`${SECTION_ID}-heading`} id={SECTION_ID}>
      <SectionHeading
        description={`Source-attributed air-quality dataset for ${city.name}. Verified measurements are surfaced when published from accepted official datasets; transparent fallback is shown otherwise.`}
        title="Air quality dataset"
      />
      <h2 className="sr-only" id={`${SECTION_ID}-heading`}>
        Air quality dataset for {city.name}
      </h2>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
        <DataVerificationBadge status={status} />
        <span>
          Last updated {profile?.lastUpdated ?? city.lastUpdated} / data year{" "}
          {profile?.dataYear ?? city.dataYear}
        </span>
      </div>

      {verified && profile ? (
        <div className="mt-6 space-y-6">
          <AirQualityMetricCards metrics={profile.metrics} />
          <AirQualityMetricsTable
            caption={`${city.name} verified air-quality metrics`}
            metrics={profile.metrics}
          />
        </div>
      ) : (
        <Card as="article" className="mt-6">
          <h3 className="text-base font-semibold text-text-primary">
            Verified air-quality measurements are not yet published for this
            location
          </h3>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            {fallbackCopy ??
              `Source-attributed values for ${city.name} will appear here after the platform integrates verified measurements from accepted official publishers. Until then, structured air-quality module context remains available on the dedicated module page.`}
          </p>
          <AirQualityMetricsTable
            caption={`${city.name} air-quality dataset coverage`}
            metrics={[]}
          />
        </Card>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <DataProvenanceBlock provenance={provenance} />
        <Card as="article">
          <h3 className="text-lg font-semibold text-text-primary">
            Methodology and context
          </h3>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Numeric measurements appear in this section only after they are
            sourced from accepted official publishers. The dataset is
            independently validated at build time; malformed records cannot
            ship to production.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.methodology}
              >
                Scoring methodology
              </Link>
              <span className="text-text-secondary">
                {" "}
                — how indicators across the platform are constructed.
              </span>
            </li>
            <li>
              <Link
                className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                href={staticRoutes.dataSources}
              >
                Data sources registry
              </Link>
              <span className="text-text-secondary">
                {" "}
                — the official sources cited by verified datasets.
              </span>
            </li>
            {sources.length > 0 ? (
              <li className="text-xs leading-5 text-text-secondary">
                Cited references:{" "}
                {sources.map((source, index) => (
                  <span key={source.id}>
                    <a
                      className="font-medium text-text-secondary underline decoration-brand-500 decoration-2"
                      href={source.url}
                    >
                      {source.organization}
                    </a>
                    {index < sources.length - 1 ? "; " : ""}
                  </span>
                ))}
              </li>
            ) : null}
            {contextLinks?.map((link) => (
              <li key={link.href}>
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
