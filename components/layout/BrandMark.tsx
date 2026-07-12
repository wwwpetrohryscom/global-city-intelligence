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
      "border-text-primary/80 bg-white text-text-primary shadow-[0_1px_2px_rgba(15,23,42,0.08)]",
    wordPrimary: "text-text-primary",
    wordAccent: "text-brand-700",
    bars: {
      primary: "#0F172A",
      accent: "#B86108",
      tint: "#D97706",
      baseline: "#0F172A",
    },
  },
  accent: {
    mark:
      "border-brand-200 bg-white text-text-primary shadow-[0_1px_2px_rgba(184,97,8,0.14)]",
    wordPrimary: "text-text-primary",
    wordAccent: "text-brand-700",
    bars: {
      primary: "#0F172A",
      accent: "#B86108",
      tint: "#D97706",
      baseline: "#B86108",
    },
  },
  monochrome: {
    mark:
      "border-text-primary bg-white text-text-primary shadow-[0_1px_2px_rgba(15,23,42,0.08)]",
    wordPrimary: "text-text-primary",
    wordAccent: "text-text-primary",
    bars: {
      primary: "#0F172A",
      accent: "#0F172A",
      tint: "#475569",
      baseline: "#0F172A",
    },
  },
  dark: {
    mark:
      "border-white/20 bg-white/10 text-white shadow-[0_1px_2px_rgba(0,0,0,0.22)]",
    wordPrimary: "text-white",
    wordAccent: "text-brand-100",
    bars: {
      primary: "#FFFFFF",
      accent: "#FED7AA",
      tint: "#EA8C1A",
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
