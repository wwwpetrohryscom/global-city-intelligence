import type { CountryIndicatorRecord } from "@/types";

function formatValue(indicator: CountryIndicatorRecord): string {
  if (indicator.value === undefined) {
    return "—";
  }
  const formatted = indicator.value.toLocaleString("en-US");
  return indicator.unit ? `${formatted} ${indicator.unit}` : formatted;
}

const STATUS_LABEL = {
  verified: "Verified",
  partial: "Partially verified",
  unavailable: "Unavailable",
} as const;

export function CountryIndicatorsTable({
  caption,
  indicators,
}: {
  caption: string;
  indicators: CountryIndicatorRecord[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-border bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
          {caption}
        </caption>
        <thead className="bg-neutral-soft text-text-primary">
          <tr>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Indicator
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Value
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Data year
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-border">
          {indicators.length === 0 ? (
            <tr>
              <th
                className="px-4 py-4 font-medium text-text-primary"
                scope="row"
              >
                Country indicators
              </th>
              <td
                className="border-l-2 border-brand-500 px-4 py-4 text-text-secondary"
                colSpan={3}
              >
                Verified country indicator values are not yet published for
                this location.
              </td>
            </tr>
          ) : (
            indicators.map((indicator) => (
              <tr
                className="odd:bg-white even:bg-neutral-soft/60 hover:bg-orange-50/60"
                key={`${indicator.countrySlug}-${indicator.indicatorKey}`}
              >
                <th
                  className="px-4 py-4 font-medium text-text-primary"
                  scope="row"
                >
                  {indicator.label}
                </th>
                <td className="border-l-2 border-brand-500 px-4 py-4 font-semibold text-text-primary">
                  {formatValue(indicator)}
                </td>
                <td className="px-4 py-4 text-text-secondary">
                  {indicator.dataYear}
                </td>
                <td className="px-4 py-4 text-text-secondary">
                  {STATUS_LABEL[indicator.verificationStatus]}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
