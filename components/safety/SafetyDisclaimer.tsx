import { cn } from "@/lib/utils/cn";

export function SafetyDisclaimer({
  variant = "default",
  className,
}: {
  variant?: "default" | "fallback";
  className?: string;
}) {
  const message =
    variant === "fallback"
      ? "Emergency contact information is not yet verified for this location. In an emergency, use local official emergency services and verify current numbers through government or public safety sources."
      : "Emergency numbers can change by region or service type. This summary lists verified public safety contacts where available and links to official sources for confirmation. In an active emergency, always rely on local official services.";

  return (
    <aside
      aria-label="Safety information disclaimer"
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
