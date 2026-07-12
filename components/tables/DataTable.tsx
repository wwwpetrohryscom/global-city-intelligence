import type { DataTableRow } from "@/types";

export function DataTable({
  caption,
  rows,
}: {
  caption: string;
  rows: DataTableRow[];
}) {
  return (
    <div className="overflow-x-auto rounded-[1.125rem] border border-neutral-border/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_rgba(15,23,42,0.035)]">
      <table className="min-w-[44rem] border-collapse text-left text-sm md:min-w-full">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b border-neutral-border bg-neutral-soft text-text-primary">
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
            <tr className="odd:bg-white even:bg-neutral-soft/60 hover:bg-brand-50/70" key={row.metric}>
              <th className="px-4 py-4 font-medium text-text-primary" scope="row">
                {row.metric}
              </th>
              <td className="border-l-2 border-brand-500 bg-brand-50/35 px-4 py-4 font-semibold tabular-nums text-text-primary">
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
