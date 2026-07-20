import type { DataTableRow } from "@/types";

export function DataTable({
  caption,
  rows,
}: {
  caption: string;
  rows: DataTableRow[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-border/85 bg-white shadow-[0_1px_2px_rgba(23,32,51,0.04),0_10px_24px_rgba(23,32,51,0.035)]">
      <table className="min-w-[44rem] border-collapse text-left text-sm md:min-w-full">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b border-eco-100 bg-eco-50 text-text-primary">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide" scope="col">
              Metric
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide" scope="col">
              Value
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide" scope="col">
              Context
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-border">
          {rows.map((row) => (
            <tr className="odd:bg-white even:bg-neutral-soft/60 hover:bg-eco-50/80" key={row.metric}>
              <th className="px-4 py-4 font-medium text-text-primary" scope="row">
                {row.metric}
              </th>
              <td className="border-l-2 border-eco-300 bg-eco-50/70 px-4 py-4 font-semibold tabular-nums text-text-primary">
                {row.value}
              </td>
              <td className="px-4 py-4 text-text-secondary">{row.context}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
