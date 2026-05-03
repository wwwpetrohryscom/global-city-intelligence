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
        "rounded-2xl border border-neutral-border bg-white p-5 shadow-sm",
        "transition duration-150",
        interactive && "hover:border-brand-400 hover:shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
