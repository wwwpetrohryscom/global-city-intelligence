import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type CardElement = "article" | "section" | "div";

export function Card({
  as: Component = "article",
  children,
  className,
  interactive = false,
  ...props
}: HTMLAttributes<HTMLElement> & {
  as?: CardElement;
  children: ReactNode;
  interactive?: boolean;
}) {
  return (
    <Component
      className={cn(
        "rounded-2xl border border-neutral-border/85 bg-white/95 p-5 shadow-[0_1px_2px_rgba(23,32,51,0.04),0_10px_24px_rgba(23,32,51,0.035)]",
        "transition duration-200",
        interactive &&
          "hover:-translate-y-px hover:border-eco-200 hover:bg-eco-50/30 hover:shadow-[0_12px_30px_rgba(23,32,51,0.07)]",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
