"use client";

import Link from "next/link";
import { formatPopulation } from "@/lib/discovery/bands";
import { cityRoute } from "@/lib/seo/routes";
import type { DiscoveryCity, DiscoveryIndex } from "@/lib/discovery/types";

/**
 * Side-by-side comparison of 2–4 cities.
 *
 * SEMANTICS (see the brief's compare rules): no city is declared a winner, and
 * nothing is coloured green or red. The only comparative marker is a neutral
 * "Highest" chip, applied solely to rows whose scale is directional by
 * definition — the published 0–100 scores, where the label already says which
 * way is up. It is never applied to temperature (warmer is not better), to
 * population, or to cost (see below).
 *
 * MISSING VALUES render the words "Not available" and are excluded from the
 * "Highest" calculation, so a city can never win a row by having no data, nor
 * be made to look worst by it.
 *
 * COST is shown in each city's own local currency and is deliberately NOT
 * marked, ranked or totalled: the corpus holds 83 currencies and no exchange
 * rates, so the figures sit next to each other as reference points, not as a
 * comparison. The group note says so.
 */

type Row = {
  label: string;
  /** Rendered value per city. */
  value: (city: DiscoveryCity, index: DiscoveryIndex) => string;
  /** Numeric basis for the "Highest" marker; null opts the row out. */
  rank?: (city: DiscoveryCity) => number | null;
  note?: string;
};

type Group = { title: string; note?: string; rows: Row[] };

const GROUPS: Group[] = [
  {
    title: "Overview",
    rows: [
      {
        label: "Country",
        value: (c, idx) => idx.countries[c.c]?.n ?? "Not available",
      },
      { label: "Region", value: (c, idx) => idx.countries[c.c]?.m ?? "Not available" },
      { label: "Population", value: (c) => formatPopulation(c.p) },
    ],
  },
  {
    title: "Cost",
    note: "Monthly estimate for one person, in each city's own local currency. These figures are not converted to a common currency and are not directly comparable.",
    rows: [
      {
        label: "Monthly cost, one person",
        value: (c) =>
          c.mc === null || c.cur === null
            ? "Not available"
            : `${new Intl.NumberFormat("en-US").format(c.mc)} ${c.cur}`,
      },
      {
        label: "Affordability score",
        value: (c) => (c.a === null ? "Not available" : `${c.a}/100`),
        rank: (c) => c.a,
        note: "Higher means more affordable.",
      },
    ],
  },
  {
    title: "Climate",
    rows: [
      { label: "Climate zone", value: (c, idx) => idx.zones[c.z] ?? "Not available" },
      { label: "Annual average temperature", value: (c) => `${c.t}°C` },
      {
        label: "Climate comfort score",
        value: (c) => `${c.k}/100`,
        rank: (c) => c.k,
      },
    ],
  },
  {
    title: "Safety and environment",
    rows: [
      {
        label: "Safety score",
        value: (c) => (c.f === null ? "Not available" : `${c.f}/100`),
        rank: (c) => c.f,
      },
      {
        label: "Air quality score",
        value: (c) => (c.q === null ? "Not available" : `${c.q}/100`),
        rank: (c) => c.q,
      },
      {
        label: "Internet speed score",
        value: (c) => (c.i === null ? "Not available" : `${c.i}/100`),
        rank: (c) => c.i,
      },
    ],
  },
  {
    title: "Economy",
    rows: [{ label: "Economy score", value: (c) => `${c.e}/100`, rank: (c) => c.e }],
  },
  {
    title: "Education",
    rows: [{ label: "Education score", value: (c) => `${c.u}/100`, rank: (c) => c.u }],
  },
  {
    title: "Healthcare",
    rows: [{ label: "Healthcare score", value: (c) => `${c.h}/100`, rank: (c) => c.h }],
  },
];

function highestSlugs(cities: DiscoveryCity[], rank: Row["rank"]): Set<string> {
  if (!rank) return new Set();
  const scored = cities
    .map((c) => ({ slug: c.s, value: rank(c) }))
    .filter((e): e is { slug: string; value: number } => e.value !== null);
  // A single value is not a comparison, so nothing is marked.
  if (scored.length < 2) return new Set();
  const max = Math.max(...scored.map((e) => e.value));
  const winners = scored.filter((e) => e.value === max);
  // If every city ties there is nothing to distinguish.
  if (winners.length === scored.length) return new Set();
  return new Set(winners.map((e) => e.slug));
}

export function CompareView({
  cities,
  index,
  onRemove,
}: {
  cities: DiscoveryCity[];
  index: DiscoveryIndex;
  onRemove?: (slug: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-border bg-white">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <caption className="sr-only">
          Comparison of {cities.map((c) => c.n).join(", ")} across published
          intelligence dimensions
        </caption>
        <thead>
          <tr>
            {/* Pinned metric column: on a narrow screen the table scrolls
                horizontally while the row label stays readable. */}
            <th
              className="sticky left-0 z-10 w-40 border-b border-neutral-border bg-white p-3 text-left align-bottom text-xs font-semibold uppercase tracking-wide text-text-muted"
              scope="col"
            >
              Metric
            </th>
            {cities.map((city) => (
              <th
                className="min-w-[9rem] border-b border-l border-neutral-border bg-white p-3 text-left align-bottom"
                key={city.s}
                scope="col"
              >
                <Link
                  className="block font-semibold text-text-primary hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                  href={cityRoute(city.s)}
                >
                  {city.n}
                </Link>
                <span className="block text-xs font-normal text-text-secondary">
                  {index.countries[city.c]?.n}
                </span>
                {onRemove ? (
                  <button
                    className="mt-1 text-xs font-medium text-text-muted underline underline-offset-2 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                    onClick={() => onRemove(city.s)}
                    type="button"
                  >
                    Remove
                  </button>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        {GROUPS.map((group) => (
          <tbody key={group.title}>
            <tr>
              <th
                className="border-b border-t border-neutral-border bg-surface-muted p-3 text-left"
                colSpan={cities.length + 1}
                scope="colgroup"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-text-primary">
                  {group.title}
                </span>
                {group.note ? (
                  <span className="mt-1 block text-xs font-normal normal-case tracking-normal text-text-muted">
                    {group.note}
                  </span>
                ) : null}
              </th>
            </tr>
            {group.rows.map((row) => {
              const winners = highestSlugs(cities, row.rank);
              return (
                <tr key={row.label}>
                  <th
                    className="sticky left-0 z-10 border-b border-neutral-border bg-white p-3 text-left align-top font-medium text-text-secondary"
                    scope="row"
                  >
                    {row.label}
                    {row.note ? (
                      <span className="mt-0.5 block text-xs font-normal text-text-muted">
                        {row.note}
                      </span>
                    ) : null}
                  </th>
                  {cities.map((city) => {
                    const value = row.value(city, index);
                    const missing = value === "Not available";
                    return (
                      <td
                        className="border-b border-l border-neutral-border p-3 align-top"
                        key={city.s}
                      >
                        <span
                          className={
                            missing
                              ? "italic text-text-muted"
                              : "font-medium text-text-primary"
                          }
                        >
                          {value}
                        </span>
                        {winners.has(city.s) ? (
                          <span className="ml-2 inline-flex items-center rounded-full border border-neutral-border bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                            Highest
                          </span>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>
      <p className="border-t border-neutral-border p-3 text-xs text-text-muted">
        &ldquo;Highest&rdquo; states which city holds the largest value in that
        row. It is not a judgement of which city is better. Open any city name
        above for its full profile, including the cost and climate detail behind
        these figures.
      </p>
    </div>
  );
}
