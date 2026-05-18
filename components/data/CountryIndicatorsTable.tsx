import type { CountryIndicatorRecord } from "@/types";

function formatNumeric(value: number): string {
  if (Number.isInteger(value)) {
    return value.toLocaleString("en-US");
  }
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
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
    <div
      className="overflow-x-auto rounded-2xl border border-neutral-border bg-white shadow-sm"
      role="region"
      aria-label={caption}
      tabIndex={0}
    >
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
              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Value
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Unit
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
                colSpan={4}
              >
                Verified country indicator values are not yet published for
                this location.
              </td>
            </tr>
          ) : (
            indicators.map((indicator) => (
              <tr
                className="odd:bg-white even:bg-neutral-soft/60 hover:bg-orange-50/60 focus-within:bg-orange-50/60"
                key={`${indicator.countrySlug}-${indicator.indicatorKey}`}
              >
                <th
                  className="px-4 py-4 font-medium text-text-primary"
                  scope="row"
                >
                  {indicator.label}
                </th>
                <td className="whitespace-nowrap border-l-2 border-brand-500 px-4 py-4 text-right font-semibold tabular-nums text-text-primary">
                  {indicator.value === undefined
                    ? "—"
                    : formatNumeric(indicator.value)}
                </td>
                <td className="px-4 py-4 text-text-secondary">
                  {indicator.unit ?? "—"}
                </td>
                <td className="px-4 py-4 text-text-secondary tabular-nums">
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

