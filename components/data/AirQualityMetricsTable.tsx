import type { AirQualityCityMetric } from "@/types";

function formatValue(metric: AirQualityCityMetric): string {
  if (metric.metricKey === "air_quality_category") {
    return metric.category ?? "—";
  }
  if (metric.value === undefined) {
    return "—";
  }
  return metric.unit
    ? `${metric.value} ${metric.unit}`
    : String(metric.value);
}

const STATUS_LABEL = {
  verified: "Verified",
  partial: "Partially verified",
  unavailable: "Unavailable",
} as const;

export function AirQualityMetricsTable({
  caption,
  metrics,
}: {
  caption: string;
  metrics: AirQualityCityMetric[];
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
              Metric
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
          {metrics.length === 0 ? (
            <tr>
              <th
                className="px-4 py-4 font-medium text-text-primary"
                scope="row"
              >
                Air quality
              </th>
              <td
                className="border-l-2 border-brand-500 px-4 py-4 text-text-secondary"
                colSpan={3}
              >
                Verified air-quality measurements are not yet published for
                this location.
              </td>
            </tr>
          ) : (
            metrics.map((metric) => (
              <tr
                className="odd:bg-white even:bg-neutral-soft/60 hover:bg-orange-50/60"
                key={`${metric.citySlug}-${metric.metricKey}`}
              >
                <th
                  className="px-4 py-4 font-medium text-text-primary"
                  scope="row"
                >
                  {metric.label}
                </th>
                <td className="border-l-2 border-brand-500 px-4 py-4 font-semibold text-text-primary">
                  {formatValue(metric)}
                </td>
                <td className="px-4 py-4 text-text-secondary">
                  {metric.dataYear}
                </td>
                <td className="px-4 py-4 text-text-secondary">
                  {STATUS_LABEL[metric.verificationStatus]}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
