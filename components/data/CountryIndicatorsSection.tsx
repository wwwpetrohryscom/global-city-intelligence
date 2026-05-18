import Link from "next/link";
import { CountryIndicatorCards } from "@/components/data/CountryIndicatorCards";
import { CountryIndicatorsTable } from "@/components/data/CountryIndicatorsTable";
import { DataProvenanceBlock } from "@/components/data/DataProvenanceBlock";
import { DataVerificationBadge } from "@/components/data/DataVerificationBadge";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getCountryIndicatorProfile,
  getCountryIndicatorSources,
} from "@/lib/data/queries";
import { staticRoutes } from "@/lib/seo/routes";
import type { Country, DataProvenance } from "@/types";

const SECTION_ID = "country-indicators";

interface CountryIndicatorsSectionProps {
  country: Country;
  fallbackCopy?: string;
}

const BASELINE_PROVENANCE_NOTE =
  "Verified country indicators for this country are not yet integrated. The first verified batch covers 10 supported countries from the World Bank Development Indicators (population, internet usage, urban-population share); additional batches will follow.";

function buildBaselineProvenance(country: Country): DataProvenance {
  return {
    datasetId: "global-country-indicators",
    sourceIds: ["world-bank-wdi"],
    publisher: "World Bank — World Development Indicators",
    lastVerified: country.lastUpdated,
    verificationStatus: "unavailable",
    transformationNotes: BASELINE_PROVENANCE_NOTE,
  };
}

export function CountryIndicatorsSection({
  country,
  fallbackCopy,
}: CountryIndicatorsSectionProps) {
  const profile = getCountryIndicatorProfile(country.slug);
  const sources = getCountryIndicatorSources(country.slug);
  const verified = profile?.verificationStatus === "verified";
  const status = profile?.verificationStatus ?? "unavailable";
  const provenance = profile?.provenance ?? [buildBaselineProvenance(country)];

  return (
    <section aria-labelledby={`${SECTION_ID}-heading`} id={SECTION_ID}>
      <SectionHeading
        description={`Source-attributed country indicators for ${country.name}. Verified values are surfaced once integrated from accepted official publishers; transparent fallback is shown otherwise.`}
        title="Country indicators"
      />
      <h2 className="sr-only" id={`${SECTION_ID}-heading`}>
        Country indicators for {country.name}
      </h2>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
        <DataVerificationBadge status={status} />
        <span>
          Last updated {profile?.lastUpdated ?? country.lastUpdated} / data
          year {profile?.dataYear ?? country.dataYear}
        </span>
      </div>

      {verified && profile ? (
        <div className="mt-6 space-y-6">
          <CountryIndicatorCards indicators={profile.indicators} />
          <CountryIndicatorsTable
            caption={`${country.name} verified country indicators`}
            indicators={profile.indicators}
          />
        </div>
      ) : (
        <Card as="article" className="mt-6">
          <h3 className="text-base font-semibold text-text-primary">
            Verified country indicator values are not yet published for this
            country
          </h3>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            {fallbackCopy ??
              `The platform will display source-attributed values for ${country.name} once verified records are integrated from accepted official publishers. Existing public-service layers (emergency, healthcare, transport) remain available above.`}
          </p>
          <CountryIndicatorsTable
            caption={`${country.name} country indicator dataset coverage`}
            indicators={[]}
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
            Country indicator values appear in this section only after they
            are sourced from accepted publishers and validated at build time.
            Malformed records cannot ship to production.
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
          </ul>
        </Card>
      </div>
    </section>
  );
}
