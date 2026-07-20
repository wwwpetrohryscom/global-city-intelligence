import Link from "next/link";
import { staticRoutes } from "@/lib/seo/routes";
import { cn } from "@/lib/utils/cn";

const SIZES = {
  sm: { mark: "h-7 w-7", text: "text-base" },
  md: { mark: "h-9 w-9", text: "text-lg" },
  lg: { mark: "h-11 w-11", text: "text-xl" },
} as const;

const TONES = {
  default: {
    mark:
      "border-neutral-border bg-white text-text-primary shadow-[0_1px_2px_rgba(23,32,51,0.08)]",
    wordPrimary: "text-text-primary",
    wordAccent: "text-eco-800",
    bars: {
      primary: "#172033",
      accent: "#268DC8",
      tint: "#FB923C",
      baseline: "#172033",
    },
  },
  accent: {
    mark:
      "border-eco-200 bg-white text-text-primary shadow-[0_1px_2px_rgba(38,141,200,0.12)]",
    wordPrimary: "text-text-primary",
    wordAccent: "text-brand-700",
    bars: {
      primary: "#172033",
      accent: "#268DC8",
      tint: "#22C76F",
      baseline: "#F97316",
    },
  },
  monochrome: {
    mark:
      "border-text-primary bg-white text-text-primary shadow-[0_1px_2px_rgba(23,32,51,0.08)]",
    wordPrimary: "text-text-primary",
    wordAccent: "text-text-primary",
    bars: {
      primary: "#172033",
      accent: "#172033",
      tint: "#526071",
      baseline: "#172033",
    },
  },
  dark: {
    mark:
      "border-white/25 bg-white/12 text-white shadow-[0_1px_2px_rgba(0,0,0,0.18)]",
    wordPrimary: "text-white",
    wordAccent: "text-brand-100",
    bars: {
      primary: "#FFFFFF",
      accent: "#86C7F3",
      tint: "#FDBA74",
      baseline: "#FFFFFF",
    },
  },
} as const;

type BrandMarkSize = keyof typeof SIZES;
type BrandMarkTone = keyof typeof TONES;

export function BrandMark({
  size = "md",
  tone = "default",
  withWordmark = true,
  className,
}: {
  size?: BrandMarkSize;
  tone?: BrandMarkTone;
  withWordmark?: boolean;
  className?: string;
}) {
  const dimensions = SIZES[size];
  const palette = TONES[tone];

  return (
    <Link
      aria-label="Global City Intelligence — home"
      className={cn(
        "group inline-flex items-center gap-3 font-semibold",
        className,
      )}
      href={staticRoutes.home}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center rounded-full border",
          "transition duration-150 group-hover:-translate-y-px group-hover:shadow-md",
          palette.mark,
          dimensions.mark,
        )}
      >
        <BrandIcon colors={palette.bars} />
      </span>
      {withWordmark ? (
        <span
          className={cn(
            "leading-[0.98]",
            dimensions.text,
          )}
        >
          <span className={cn("block font-semibold", palette.wordPrimary)}>
            Global City
          </span>
          <span className={cn("block font-semibold", palette.wordAccent)}>
            Intelligence
          </span>
        </span>
      ) : null}
    </Link>
  );
}

function BrandIcon({
  colors,
}: {
  colors: {
    primary: string;
    accent: string;
    tint: string;
    baseline: string;
  };
}) {
  return (
    <svg
      aria-hidden="true"
      className="h-[72%] w-[72%]"
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="16"
        cy="16"
        opacity="0.22"
        r="12"
        stroke={colors.baseline}
        strokeWidth="1.35"
      />
      <path
        d="M16 4.5C13.4 7.3 12 11.1 12 16s1.4 8.7 4 11.5M16 4.5c2.6 2.8 4 6.6 4 11.5s-1.4 8.7-4 11.5"
        opacity="0.2"
        stroke={colors.baseline}
        strokeLinecap="round"
        strokeWidth="1.1"
      />
      <path
        d="M7 24.75H25"
        opacity="0.32"
        stroke={colors.baseline}
        strokeLinecap="round"
        strokeWidth="1.35"
      />
      <rect fill={colors.primary} height="9" rx="1.2" width="3.6" x="8" y="16" />
      <rect fill={colors.accent} height="15" rx="1.2" width="3.6" x="13.2" y="10" />
      <rect fill={colors.tint} height="11" rx="1.2" width="3.6" x="18.4" y="14" />
    </svg>
  );
}
