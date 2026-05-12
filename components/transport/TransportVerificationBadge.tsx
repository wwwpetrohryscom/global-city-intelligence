import { cn } from "@/lib/utils/cn";
import type { TransportVerificationStatus } from "@/types";

const STATUS_LABEL: Record<TransportVerificationStatus, string> = {
  verified: "Verified",
  partial: "Partially verified",
  unavailable: "Unverified",
};

const STATUS_DESCRIPTION: Record<TransportVerificationStatus, string> = {
  verified:
    "Source-attributed and reviewed against an official transport authority, national operator, or government publisher.",
  partial:
    "Some fields are source-attributed; others are not yet verified.",
  unavailable:
    "No verified data on file. Confirm current transport information through official transport authorities or operators.",
};

export function TransportVerificationBadge({
  status,
  className,
}: {
  status: TransportVerificationStatus;
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
