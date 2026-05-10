import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-brand-500 bg-brand-500 text-white shadow-sm hover:bg-brand-600 hover:border-brand-600",
  secondary:
    "border-neutral-border bg-white text-text-primary hover:border-brand-500 hover:text-brand-500",
  ghost:
    "border-transparent bg-transparent text-text-secondary hover:bg-neutral-soft hover:text-text-primary",
};

const baseClassName =
  "inline-flex min-h-11 items-center justify-center rounded-full border px-5 py-2 text-sm font-semibold tracking-tight transition duration-150 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

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
