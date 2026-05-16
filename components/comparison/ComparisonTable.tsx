import type { ComparisonCategory } from "@/types";

export function ComparisonTable({
  caption,
  cityAName,
  cityBName,
  categories,
}: {
  caption: string;
  cityAName: string;
  cityBName: string;
  categories: ComparisonCategory[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-border bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
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
              {cityAName}
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              {cityBName}
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              How to interpret
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-border">
          {categories.map((category) => (
            <tr
              className="odd:bg-white even:bg-neutral-soft/60 align-top"
              key={category.key}
            >
              <th
                className="px-4 py-4 font-medium text-text-primary"
                scope="row"
              >
                {category.label}
                <span className="mt-1 block text-xs font-normal text-text-secondary">
                  {category.summary}
                </span>
              </th>
              <td className="border-l-2 border-brand-500 px-4 py-4 text-text-secondary">
                {category.cityANote ?? "Directional indicator."}
              </td>
              <td className="px-4 py-4 text-text-secondary">
                {category.cityBNote ?? "Directional indicator."}
              </td>
              <td className="px-4 py-4 text-text-secondary">
                {category.interpretation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
