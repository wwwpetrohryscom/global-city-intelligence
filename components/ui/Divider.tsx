import { cn } from "@/lib/utils/cn";

export function Divider({ className }: { className?: string }) {
  return (
    <hr
      className={cn("border-0 border-t border-neutral-border/90", className)}
      aria-hidden="true"
    />
  );
}
