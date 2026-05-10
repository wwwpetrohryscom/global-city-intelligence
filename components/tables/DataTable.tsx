import type { DataTableRow } from "@/types";

export function DataTable({
  caption,
  rows,
}: {
  caption: string;
  rows: DataTableRow[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-border bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-neutral-soft text-text-primary">
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
            <tr className="odd:bg-white even:bg-neutral-soft/60 hover:bg-orange-50/60" key={row.metric}>
              <th className="px-4 py-4 font-medium text-text-primary" scope="row">
                {row.metric}
              </th>
              <td className="border-l-2 border-brand-500 px-4 py-4 font-semibold text-text-primary">
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
