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
        "inline-flex items-center gap-1.5 rounded-full border border-brand-400 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-brand-600",
        className,
      )}
    >
      {children}
    </span>
  );
}
