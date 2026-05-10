import { cn } from "@/lib/utils/cn";

export function HealthcareDisclaimer({
  variant = "default",
  className,
}: {
  variant?: "default" | "fallback";
  className?: string;
}) {
  const message =
    variant === "fallback"
      ? "Verified healthcare and hospital information is not yet available for this location. For urgent medical situations, use local emergency services and confirm current healthcare access through official government or public health sources."
      : "This section summarises verified public healthcare information drawn from official government and public health publishers. It is informational only and does not provide medical advice, diagnosis, or treatment recommendations. For urgent medical situations, contact local emergency services.";

  return (
    <aside
      aria-label="Healthcare information disclaimer"
      className={cn(
        "rounded-2xl border border-neutral-border bg-neutral-soft p-4 text-sm leading-6 text-text-secondary",
        className,
      )}
      role="note"
    >
      {message}
    </aside>
  );
}
