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
        "rounded-[1.125rem] border border-neutral-border/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_rgba(15,23,42,0.035)]",
        "transition duration-200",
        interactive &&
          "hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_18px_44px_rgba(15,23,42,0.085)]",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
