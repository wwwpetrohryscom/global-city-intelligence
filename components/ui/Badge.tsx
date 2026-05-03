import { cn } from "@/lib/utils/cn";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-brand-400 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-text-primary",
        className,
      )}
    >
      {children}
    </span>
  );
}
