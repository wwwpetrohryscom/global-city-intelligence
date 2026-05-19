interface ExampleRow {
  category: string;
  perUnit: string;
  subtotal: string;
}

const EXAMPLE_ROWS: ExampleRow[] = [
  {
    category: "Accommodation",
    perUnit: "120 per night × 7 nights",
    subtotal: "840",
  },
  {
    category: "Food",
    perUnit: "40 per day × 7 days × 2 travelers",
    subtotal: "560",
  },
  {
    category: "Local transport",
    perUnit: "15 per day × 7 days × 2 travelers",
    subtotal: "210",
  },
  {
    category: "Activities",
    perUnit: "30 per day × 7 days × 2 travelers",
    subtotal: "420",
  },
  {
    category: "Insurance / healthcare buffer",
    perUnit: "Flat trip amount",
    subtotal: "80",
  },
  {
    category: "Flight / train cost",
    perUnit: "Flat trip amount",
    subtotal: "600",
  },
  {
    category: "Emergency buffer",
    perUnit: "Flat trip amount",
    subtotal: "150",
  },
];

const TOTAL_TRIP = "2,860";
const DAILY = "≈ 409 per day";
const PER_PERSON = "≈ 1,430 per traveler";

export function TravelBudgetExampleTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-border bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">
          Illustrative trip budget breakdown for a 7-day trip with two
          travelers. Values are example inputs, not verified travel costs.
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
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Example input (scaling)
            </th>
            <th
              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Subtotal
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
              <td className="px-4 py-3 text-text-secondary">{row.perUnit}</td>
              <td className="px-4 py-3 text-right tabular-nums text-text-secondary">
                {row.subtotal}
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
              Total trip estimate
            </th>
            <td className="px-4 py-3 text-text-secondary">
              {DAILY} · {PER_PERSON}
            </td>
            <td className="border-l-2 border-brand-500 px-4 py-3 text-right font-semibold tabular-nums text-text-primary">
              {TOTAL_TRIP}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
