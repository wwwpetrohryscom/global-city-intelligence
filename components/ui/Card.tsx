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
        "rounded-[1.125rem] border border-neutral-border/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        "transition duration-150",
        interactive &&
          "hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)]",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
