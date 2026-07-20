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
        "inline-flex items-center gap-1.5 rounded-full border border-eco-200 bg-eco-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-eco-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
