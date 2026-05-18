import type { MetricVerificationStatus } from "@/types";

const STYLES: Record<MetricVerificationStatus, string> = {
  verified:
    "border-brand-500 bg-orange-50 text-text-primary",
  partial:
    "border-neutral-border bg-surface-soft text-text-primary",
  unavailable:
    "border-neutral-border bg-white text-text-secondary",
};

const LABELS: Record<MetricVerificationStatus, string> = {
  verified: "Verified",
  partial: "Partially verified",
  unavailable: "Verified data unavailable",
};

export function DataVerificationBadge({
  status,
  className,
}: {
  status: MetricVerificationStatus;
  className?: string;
}) {
  const style = STYLES[status];
  const label = LABELS[status];

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        style,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </span>
  );
}
