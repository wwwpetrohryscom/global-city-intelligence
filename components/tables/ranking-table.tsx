import Link from "next/link";
import { cityRoute } from "@/lib/seo/routes";
import type { City } from "@/types";

type RankingEntry = {
  rank: number;
  score: number;
  note: string;
  city: City;
};

// Rich table rows carry a per-city rationale ("note"); rendering that for all
// ~2,400 ranked cities roughly doubled the page weight (HTML + the duplicated RSC
// hydration payload), pushing ranking pages past 4 MB. We keep the full rich table
// for the top entries and render the remainder as a compact, fully-crawlable link
// list — every ranked city still links to its profile (no lost internal links,
// no orphans), at a fraction of the byte cost.
const RICH_ROWS = 100;

export function RankingTable({
  caption,
  entries,
}: {
  caption: string;
  entries: RankingEntry[];
}) {
  const rich = entries.slice(0, RICH_ROWS);
  const rest = entries.slice(RICH_ROWS);
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-2xl border border-neutral-border bg-white shadow-sm">
        <table className="min-w-full border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-neutral-soft text-text-secondary">
            <tr>
              <th className="px-4 py-3 font-semibold" scope="col">
                Rank
              </th>
              <th className="px-4 py-3 font-semibold" scope="col">
                City
              </th>
              <th className="px-4 py-3 font-semibold" scope="col">
                Score
              </th>
              <th className="px-4 py-3 font-semibold" scope="col">
                Why it ranks here
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-border">
            {rich.map((entry) => (
              <tr className="odd:bg-white even:bg-neutral-soft/60 hover:bg-orange-50/60" key={entry.city.slug}>
                <td className="px-4 py-4 font-semibold text-text-primary">
                  #{entry.rank}
                </td>
                <th className="px-4 py-4 font-medium text-text-primary" scope="row">
                  <Link className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline" href={cityRoute(entry.city.slug)}>
                    {entry.city.name}
                  </Link>
                  <span className="block text-xs font-normal text-text-secondary">
                    {entry.city.countryName}
                  </span>
                </th>
                <td className="border-l-2 border-brand-500 px-4 py-4 font-semibold text-text-primary">
                  {entry.score}/100
                </td>
                <td className="px-4 py-4 text-text-secondary">{entry.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rest.length > 0 ? (
        <section aria-labelledby="ranking-full-list-heading">
          <h3
            className="text-sm font-semibold text-text-secondary"
            id="ranking-full-list-heading"
          >
            Full ranked list ({rich.length + 1}–{entries.length})
          </h3>
          <ul className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((entry) => (
              <li className="text-sm text-text-secondary" key={entry.city.slug}>
                <span className="tabular-nums text-text-secondary">
                  #{entry.rank}
                </span>{" "}
                <Link
                  className="text-text-primary decoration-brand-500 underline-offset-4 hover:underline"
                  href={cityRoute(entry.city.slug)}
                >
                  {entry.city.name}
                </Link>{" "}
                <span className="text-text-secondary">
                  · {entry.city.countryName} · {entry.score}/100
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
