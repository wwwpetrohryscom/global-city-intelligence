import { cn } from "@/lib/utils/cn";
import type { HealthcareVerificationStatus } from "@/types";

const STATUS_LABEL: Record<HealthcareVerificationStatus, string> = {
  verified: "Verified",
  partial: "Partially verified",
  unavailable: "Unverified",
};

const STATUS_DESCRIPTION: Record<HealthcareVerificationStatus, string> = {
  verified:
    "Source-attributed and reviewed against an official government, public health, or recognised health-system publisher.",
  partial:
    "Some fields are source-attributed; others are not yet verified.",
  unavailable:
    "No verified data on file. Confirm current healthcare information through official government or public health sources.",
};

export function HealthcareVerificationBadge({
  status,
  className,
}: {
  status: HealthcareVerificationStatus;
  className?: string;
}) {
  const label = STATUS_LABEL[status];
  const description = STATUS_DESCRIPTION[status];
  const isVerified = status === "verified";

  return (
    <span
      aria-label={`${label}: ${description}`}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        isVerified
          ? "border-brand-400 bg-orange-50 text-text-primary"
          : "border-neutral-border bg-neutral-soft text-text-secondary",
        className,
      )}
      title={description}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block h-1.5 w-1.5 rounded-full",
          isVerified ? "bg-brand-500" : "bg-text-secondary/60",
        )}
      />
      {label}
    </span>
  );
}
