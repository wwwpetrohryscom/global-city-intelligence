import Link from "next/link";
import { cityRoute } from "@/lib/seo/routes";
import type { City } from "@/types";

export interface RankingBarChartEntry {
  rank: number;
  score: number;
  note: string;
  city: City;
}

interface RankingBarChartProps {
  title: string;
  caption: string;
  entries: readonly RankingBarChartEntry[];
  /**
   * Maximum number of bars to render visually. The HTML table on the
   * same page remains the source of truth and is unaffected by this
   * limit.
   */
  limit?: number;
}

const DEFAULT_LIMIT = 10;
const SCORE_AXIS_MAX = 100;

/**
 * Server-rendered horizontal bar chart used as a "visual summary" beside
 * the canonical ranking table. Bars are pure HTML/CSS — no SVG runtime,
 * no client JS, no chart library. Every numeric value is also rendered
 * as visible text so screen readers and crawlers can read the data
 * without parsing the visual.
 */
export function RankingBarChart({
  title,
  caption,
  entries,
  limit = DEFAULT_LIMIT,
}: RankingBarChartProps) {
  const visible = entries.slice(0, limit);
  if (visible.length === 0) {
    return null;
  }
  const topScore = Math.max(...visible.map((e) => e.score), 1);
  const scale = Math.max(topScore, SCORE_AXIS_MAX);
  const totalCount = entries.length;
  const remaining = Math.max(0, totalCount - visible.length);

  return (
    <figure
      aria-labelledby="ranking-bar-chart-title"
      className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm sm:p-6"
    >
      <figcaption className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
          Visual summary
        </p>
        <h3
          className="text-lg font-semibold text-text-primary"
          id="ranking-bar-chart-title"
        >
          {title}
        </h3>
        <p className="text-sm leading-6 text-text-secondary">
          Directional ranking context based on the platform&apos;s structured
          indicators. Not an official government ranking. The ranking table
          below is the source of truth.
        </p>
      </figcaption>
      <ol
        aria-label={caption}
        className="mt-5 space-y-3"
      >
        {visible.map((entry) => {
          const widthPct = Math.max(
            6,
            Math.round((entry.score / scale) * 100),
          );
          return (
            <li
              className="grid grid-cols-[2.25rem_minmax(8rem,1fr)_3rem] items-center gap-3 sm:grid-cols-[2.5rem_minmax(10rem,1fr)_3.5rem]"
              key={entry.city.slug}
            >
              <span className="text-sm font-semibold text-text-primary tabular-nums">
                #{entry.rank}
              </span>
              <div>
                <Link
                  className="text-sm font-medium text-text-primary decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                  href={cityRoute(entry.city.slug)}
                >
                  {entry.city.name}
                  <span className="ml-2 text-xs font-normal text-text-secondary">
                    {entry.city.countryName}
                  </span>
                </Link>
                <div
                  aria-hidden="true"
                  className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-neutral-soft"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
              <span className="text-right text-sm font-semibold text-text-primary tabular-nums">
                {entry.score}
                <span className="text-xs font-normal text-text-secondary">
                  /100
                </span>
              </span>
            </li>
          );
        })}
      </ol>
      {remaining > 0 ? (
        <p className="mt-4 text-xs leading-5 text-text-secondary">
          Visual summary shows the top {visible.length} of {totalCount} cities.
          See the full ranking table below for every entry.
        </p>
      ) : null}
    </figure>
  );
}
