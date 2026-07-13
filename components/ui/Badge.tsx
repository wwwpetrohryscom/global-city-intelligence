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
        "inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-brand-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
