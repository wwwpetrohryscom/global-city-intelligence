import Link from "next/link";
import {
  INTELLIGENCE_DIMENSIONS,
  dimensionById,
} from "@/lib/city-intelligence/dimensions";
import { MIN_COHORT, bandLabel } from "@/lib/city-intelligence/scorecard";
import type { CityScorecard, ScorecardEntry } from "@/lib/city-intelligence/types";

/**
 * City Intelligence Scorecard.
 *
 * A SERVER component on purpose: nothing here is interactive, so rendering it
 * on the server keeps the client JS delta at exactly zero and puts every value
 * and every deep link into the static HTML where crawlers and no-JS visitors
 * can read them. It receives a prepared `CityScorecard` and renders it — no
 * statistics are computed here.
 *
 * PRESENTATION RULES
 * - The number is the primary evidence; any bar is decoration behind it.
 * - A band is never rendered as a bare colour. Every position carries text.
 * - Absent values say "Not available" rather than showing 0 or an empty bar.
 * - No dimension is called good or bad; positions are comparisons against the
 *   city's own country, and the cohort size is always stated so the reader can
 *   judge the claim.
 */

const SECTION_ID = "city-intelligence";

function EntryRow({ entry, citySlug }: { entry: ScorecardEntry; citySlug: string }) {
  const dimension = dimensionById(entry.dimensionId);
  if (!dimension) return null;
  const hasValue = entry.value !== null;

  return (
    <li className="flex flex-col gap-1 rounded-xl border border-neutral-border bg-white p-3">
      <div className="flex items-baseline justify-between gap-3">
        <Link
          className="inline-flex min-h-11 items-center text-sm font-medium text-text-primary underline decoration-eco-300 decoration-2 underline-offset-4 hover:decoration-eco-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500"
          href={dimension.sectionHref(citySlug)}
        >
          {dimension.label}
        </Link>
        <span
          className={
            hasValue
              ? "shrink-0 text-lg font-semibold tabular-nums text-text-primary"
              : "shrink-0 text-sm text-text-secondary"
          }
        >
          {hasValue ? (
            <>
              {entry.value}
              <span className="text-xs font-normal text-text-secondary"> /100</span>
            </>
          ) : (
            "Not available"
          )}
        </span>
      </div>
      {hasValue ? (
        <>
          <span className="text-xs text-text-secondary">
            {entry.position
              ? `${bandLabel(entry.position.band)} of ${entry.position.cohortSize} cities`
              : entry.positionSuppressedReason === "tie-block-too-large"
                ? "Typical for this country"
                : entry.positionSuppressedReason === "cohort-too-small"
                  ? "Too few comparable cities to position"
                  : entry.positionSuppressedReason === "placeholder-record"
                    ? "Directional — pending data integration"
                    : ""}
          </span>
        </>
      ) : null}
    </li>
  );
}

function Highlights({ ids, title, marker }: { ids: string[]; title: string; marker: string }) {
  if (ids.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-secondary">{title}</p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {ids.map((id) => {
          const d = dimensionById(id);
          if (!d) return null;
          return (
            <li
              key={id}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-border bg-neutral-soft px-2.5 py-1 text-sm text-text-primary"
            >
              <span aria-hidden="true" className="text-text-secondary">{marker}</span>
              {d.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function CityIntelligenceScorecard({ scorecard }: { scorecard: CityScorecard }) {
  const positioned = scorecard.entries.filter((e) => e.position !== null);
  const published = scorecard.entries.filter((e) => e.value !== null).length;

  return (
    <section aria-labelledby={`${SECTION_ID}-heading`} id={SECTION_ID} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-text-primary" id={`${SECTION_ID}-heading`}>
          {scorecard.cityName} at a glance
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          {published} of {INTELLIGENCE_DIMENSIONS.length} published intelligence dimensions.{" "}
          {scorecard.isPlaceholderRecord
            ? `Indicators for ${scorecard.cityName} are directional and pending integration of verified city-level data, so they are not compared with other cities.`
            : positioned.length > 0
              ? `Positions compare ${scorecard.cityName} with other indexed cities in ${scorecard.countryName}.`
              : `Too few comparable cities in ${scorecard.countryName} to position these values.`}
        </p>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {scorecard.entries.map((entry) => (
          <EntryRow citySlug={scorecard.citySlug} entry={entry} key={entry.dimensionId} />
        ))}
      </ul>

      {scorecard.strengths.length > 0 || scorecard.tradeOffs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Highlights ids={scorecard.strengths} marker="+" title={`Strongest in ${scorecard.countryName}`} />
          <Highlights ids={scorecard.tradeOffs} marker="−" title={`Trade-offs in ${scorecard.countryName}`} />
        </div>
      ) : null}

      {/* Methodology, disclosed but not shouted. A native <details> keeps it
          collapsed by default, needs no JavaScript, and leaves the text in the
          static HTML so it is readable without hydration. */}
      <details className="group">
        <summary className="inline-flex min-h-11 cursor-pointer items-center text-xs font-medium text-text-secondary underline decoration-dotted underline-offset-4 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500">
          How this is calculated
        </summary>
        <p className="mt-2 max-w-3xl text-xs leading-5 text-text-secondary">
          Where a position is shown, it compares {scorecard.cityName} with the other
          indexed cities in {scorecard.countryName} — using the data currently published
          on this site, not any external benchmark. Cities whose indicators are still
          pending integration are excluded from those comparisons entirely, and no
          position is shown for a country with fewer than {MIN_COHORT} comparable
          cities. Where too many cities share the same published value to separate them
          honestly, the card says “Typical for this country” instead of a stronger
          claim, and positions describe rank order rather than a fixed percentage.
        </p>
      </details>
    </section>
  );
}
