import type { City, ModuleSlug } from "@/types";

interface ComparisonBarSummaryProps {
  cityA: City;
  cityB: City;
  /**
   * Module slugs to render, in display order. Each module's score is
   * read directly from city.modules[slug].score — no derived or
   * synthesized values.
   */
  modules?: readonly { slug: ModuleSlug; label: string }[];
}

const DEFAULT_MODULES: readonly { slug: ModuleSlug; label: string }[] = [
  { slug: "cost-of-living", label: "Cost of living" },
  { slug: "air-quality", label: "Air quality" },
  { slug: "energy", label: "Energy" },
  { slug: "safety", label: "Safety" },
  { slug: "internet-speed", label: "Internet speed" },
  { slug: "climate-risk", label: "Climate risk" },
];

const SCORE_AXIS_MAX = 100;

/**
 * Server-rendered side-by-side bar summary for the module scores of two
 * cities. Uses only the existing typed module scores on each City — no
 * synthesized indicators, no winner declarations. Renders next to the
 * canonical comparison table; the table remains the source of truth.
 */
export function ComparisonBarSummary({
  cityA,
  cityB,
  modules = DEFAULT_MODULES,
}: ComparisonBarSummaryProps) {
  const rows = modules
    .map(({ slug, label }) => {
      const a = cityA.modules[slug]?.score;
      const b = cityB.modules[slug]?.score;
      if (typeof a !== "number" || typeof b !== "number") {
        return null;
      }
      return { slug, label, a, b };
    })
    .filter((row): row is { slug: ModuleSlug; label: string; a: number; b: number } =>
      Boolean(row),
    );

  if (rows.length === 0) {
    return null;
  }

  return (
    <figure
      aria-labelledby="comparison-bar-summary-title"
      className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm sm:p-6"
    >
      <figcaption className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
          Visual summary
        </p>
        <h3
          className="text-lg font-semibold text-text-primary"
          id="comparison-bar-summary-title"
        >
          {cityA.name} and {cityB.name}: module directional scores
        </h3>
        <p className="text-sm leading-6 text-text-secondary">
          Each row reads the directional module score from the underlying city
          profile. Scores are not a verdict — open the table below for the full
          interpretation, and the linked city profiles for source context.
        </p>
      </figcaption>
      <div className="mt-5 grid grid-cols-[1fr_1fr] gap-4 text-xs sm:gap-6">
        <p className="font-semibold uppercase tracking-wide text-text-secondary">
          <span
            aria-hidden="true"
            className="mr-2 inline-block h-2.5 w-2.5 rounded-sm bg-brand-500 align-middle"
          />
          {cityA.name}
        </p>
        <p className="font-semibold uppercase tracking-wide text-text-secondary">
          <span
            aria-hidden="true"
            className="mr-2 inline-block h-2.5 w-2.5 rounded-sm bg-brand-navy align-middle"
          />
          {cityB.name}
        </p>
      </div>
      <ul className="mt-3 space-y-4">
        {rows.map((row) => (
          <li key={row.slug}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold text-text-primary">
                {row.label}
              </p>
              <p className="text-xs leading-5 text-text-secondary">
                Directional, /{SCORE_AXIS_MAX}
              </p>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
              <ScoreBar
                aria-label={`${cityA.name} ${row.label} directional score ${row.a} out of ${SCORE_AXIS_MAX}`}
                color="brand"
                cityName={cityA.name}
                score={row.a}
              />
              <ScoreBar
                aria-label={`${cityB.name} ${row.label} directional score ${row.b} out of ${SCORE_AXIS_MAX}`}
                color="navy"
                cityName={cityB.name}
                score={row.b}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs leading-5 text-text-secondary">
        Visual summary is directional only and does not declare a winner. See
        the comparison table below for category-by-category interpretation.
      </p>
    </figure>
  );
}

function ScoreBar({
  cityName,
  score,
  color,
  "aria-label": ariaLabel,
}: {
  cityName: string;
  score: number;
  color: "brand" | "navy";
  "aria-label": string;
}) {
  const widthPct = Math.max(6, Math.round((score / SCORE_AXIS_MAX) * 100));
  const fillClass =
    color === "brand"
      ? "bg-gradient-to-r from-brand-500 to-brand-400"
      : "bg-brand-navy";

  return (
    <div aria-label={ariaLabel} role="group">
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span className="sr-only">{cityName}</span>
        <span aria-hidden="true">{cityName}</span>
        <span className="font-semibold text-text-primary tabular-nums">
          {score}/{SCORE_AXIS_MAX}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="mt-1 h-2 w-full overflow-hidden rounded-full bg-neutral-soft"
      >
        <div
          className={`h-full rounded-full ${fillClass}`}
          style={{ width: `${widthPct}%` }}
        />
      </div>
    </div>
  );
}
