import { cn } from "@/lib/utils/cn";

export function TransportDisclaimer({
  variant = "default",
  className,
}: {
  variant?: "default" | "fallback";
  className?: string;
}) {
  const message =
    variant === "fallback"
      ? "Verified transport and mobility information is not yet available for this location. Check official transport authorities, airport operators, and local public service sources before making time-sensitive travel decisions."
      : "This section lists verified transport authorities, operators, and airport publishers where official sources are available. It is informational only — routes, fares, schedules, and disruptions change frequently; check the linked operators for current details.";

  return (
    <aside
      aria-label="Transport information disclaimer"
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
