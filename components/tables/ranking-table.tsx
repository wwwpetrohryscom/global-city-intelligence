import Link from "next/link";
import { cityRoute } from "@/lib/seo/routes";
import type { City } from "@/types";

export function RankingTable({
  caption,
  entries,
}: {
  caption: string;
  entries: {
    rank: number;
    score: number;
    note: string;
    city: City;
  }[];
}) {
  return (
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
          {entries.map((entry) => (
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
  );
}
