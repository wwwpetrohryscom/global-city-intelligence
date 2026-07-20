import { Card } from "@/components/ui/Card";
import { getScoreLabel, getScoreTone } from "@/lib/data/transform/scoring";
import type { Metric } from "@/types";

export function MetricCard({
  metric,
  delta,
  highlight = false,
}: {
  metric: Metric;
  delta?: string;
  highlight?: boolean;
}) {
  const cardClassName = [
    "relative overflow-hidden",
    highlight ? "border-eco-200 bg-eco-50/25" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className={cardClassName}>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-info),var(--color-positive),var(--color-brand))]"
      />
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold text-text-primary">
          {metric.label}
        </h3>
        {typeof metric.score === "number" ? (
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getScoreTone(
              metric.score,
            )}`}
          >
            {getScoreLabel(metric.score)}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-3xl font-semibold tabular-nums text-text-primary">
        {metric.value}
        {metric.unit ? (
          <span className="text-lg font-medium text-text-secondary">
            {metric.unit}
          </span>
        ) : null}
      </p>
      {delta ? (
        <p className="mt-2 rounded-r-lg border-l-2 border-ecogreen-400 bg-ecogreen-50 py-1 pl-3 text-sm font-medium text-text-primary">
          {delta}
        </p>
      ) : null}
      <p className="mt-3 text-sm leading-6 text-text-secondary">
        {metric.description}
      </p>
    </Card>
  );
}
