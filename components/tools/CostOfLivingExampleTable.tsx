interface ExampleRow {
  category: string;
  current: string;
  target: string;
  delta: string;
}

const EXAMPLE_ROWS: ExampleRow[] = [
  { category: "Housing", current: "1,500", target: "1,800", delta: "+300" },
  { category: "Food", current: "450", target: "500", delta: "+50" },
  { category: "Transport", current: "150", target: "120", delta: "−30" },
  { category: "Utilities", current: "120", target: "140", delta: "+20" },
  { category: "Internet / mobile", current: "60", target: "70", delta: "+10" },
  { category: "Healthcare / insurance", current: "200", target: "260", delta: "+60" },
  { category: "Lifestyle / discretionary", current: "300", target: "300", delta: "0" },
];

const TOTAL_CURRENT = "2,780";
const TOTAL_TARGET = "3,190";
const TOTAL_DELTA = "+410";

export function CostOfLivingExampleTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-border bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">
          Illustrative monthly budget breakdown for two cities. Values are
          example inputs, not verified cost-of-living measurements.
        </caption>
        <thead className="bg-neutral-soft text-text-primary">
          <tr>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Category
            </th>
            <th
              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Current city (example)
            </th>
            <th
              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Target city (example)
            </th>
            <th
              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Δ
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-border">
          {EXAMPLE_ROWS.map((row) => (
            <tr key={row.category}>
              <th
                className="px-4 py-3 font-medium text-text-primary"
                scope="row"
              >
                {row.category}
              </th>
              <td className="px-4 py-3 text-right tabular-nums text-text-secondary">
                {row.current}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-text-secondary">
                {row.target}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-text-secondary">
                {row.delta}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-neutral-soft">
          <tr>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-primary"
              scope="row"
            >
              Monthly total
            </th>
            <td className="border-l-2 border-brand-500 px-4 py-3 text-right font-semibold tabular-nums text-text-primary">
              {TOTAL_CURRENT}
            </td>
            <td className="border-l-2 border-brand-500 px-4 py-3 text-right font-semibold tabular-nums text-text-primary">
              {TOTAL_TARGET}
            </td>
            <td className="border-l-2 border-brand-500 px-4 py-3 text-right font-semibold tabular-nums text-text-primary">
              {TOTAL_DELTA}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
