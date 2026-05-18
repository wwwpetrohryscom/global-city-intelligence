import { Card } from "@/components/ui/Card";
import { DataVerificationBadge } from "@/components/data/DataVerificationBadge";
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

export function AirQualityMetricCards({
  metrics,
}: {
  metrics: AirQualityCityMetric[];
}) {
  if (metrics.length === 0) {
    return null;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <li key={`${metric.citySlug}-${metric.metricKey}`}>
          <Card as="article" className="h-full">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {metric.label}
              </p>
              <DataVerificationBadge status={metric.verificationStatus} />
            </div>
            <p className="mt-2 text-2xl font-semibold text-text-primary">
              {formatValue(metric)}
            </p>
            <p className="mt-2 text-xs leading-5 text-text-muted">
              Data year {metric.dataYear} / updated {metric.lastUpdated}
            </p>
            {metric.notes ? (
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {metric.notes}
              </p>
            ) : null}
          </Card>
        </li>
      ))}
    </ul>
  );
}
