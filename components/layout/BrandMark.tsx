import Link from "next/link";
import { staticRoutes } from "@/lib/seo/routes";
import { cn } from "@/lib/utils/cn";

const SIZES = {
  sm: { mark: "h-7 w-7", text: "text-base" },
  md: { mark: "h-9 w-9", text: "text-lg" },
  lg: { mark: "h-11 w-11", text: "text-xl" },
} as const;

type BrandMarkSize = keyof typeof SIZES;

export function BrandMark({
  size = "md",
  withWordmark = true,
  className,
}: {
  size?: BrandMarkSize;
  withWordmark?: boolean;
  className?: string;
}) {
  const dimensions = SIZES[size];

  return (
    <Link
      aria-label="Global City Intelligence — home"
      className={cn(
        "group inline-flex items-center gap-3 font-semibold text-text-primary",
        className,
      )}
      href={staticRoutes.home}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center rounded-full border border-brand-navy bg-white shadow-sm",
          "transition group-hover:shadow-md",
          dimensions.mark,
        )}
      >
        <BrandIcon />
      </span>
      {withWordmark ? (
        <span
          className={cn(
            "leading-tight",
            dimensions.text,
          )}
        >
          <span className="block tracking-tight text-text-primary">
            Global City
          </span>
          <span className="block text-brand-500">Intelligence</span>
        </span>
      ) : null}
    </Link>
  );
}

function BrandIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[60%] w-[60%]"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#0D1B3D" height="14" rx="1" width="3" x="3" y="8" />
      <rect fill="#FF6B00" height="18" rx="1" width="3" x="8" y="4" />
      <rect fill="#FF6B00" height="11" rx="1" width="3" x="13" y="11" />
      <rect fill="#0D1B3D" height="16" rx="1" width="3" x="18" y="6" />
    </svg>
  );
}
