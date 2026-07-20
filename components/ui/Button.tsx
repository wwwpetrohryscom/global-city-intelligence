import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-brand-300 bg-brand-300 text-text-primary shadow-[0_1px_2px_rgba(23,32,51,0.05),0_8px_18px_rgba(251,146,60,0.18)] hover:border-brand-400 hover:bg-brand-400",
  secondary:
    "border-neutral-border bg-white text-text-primary shadow-[0_1px_2px_rgba(23,32,51,0.045)] hover:border-eco-200 hover:bg-eco-50 hover:text-text-primary",
  ghost:
    "border-transparent bg-transparent text-text-secondary hover:bg-eco-50 hover:text-eco-800",
};

const baseClassName =
  "inline-flex min-h-11 items-center justify-center rounded-xl border px-5 py-2 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-eco-500";

type AnchorButtonProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  children: ReactNode;
  className?: string;
  href: string;
  variant?: ButtonVariant;
};

type NativeButtonProps = ComponentPropsWithoutRef<"button"> & {
  href?: never;
  variant?: ButtonVariant;
};

export function Button(props: AnchorButtonProps | NativeButtonProps) {
  if ("href" in props && props.href) {
    const { className, children, variant = "primary", href, ...linkProps } = props;
    const buttonClassName = cn(baseClassName, variants[variant], className);

    return (
      <Link className={buttonClassName} href={href} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonOnlyProps = props as NativeButtonProps;
  const {
    className,
    children,
    variant = "primary",
    type = "button",
    ...buttonProps
  } = buttonOnlyProps;
  const buttonClassName = cn(baseClassName, variants[variant], className);

  return (
    <button className={buttonClassName} type={type} {...buttonProps}>
      {children}
    </button>
  );
}
