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
      "border-text-primary bg-white text-text-primary shadow-[0_1px_2px_rgba(15,23,42,0.08)]",
    wordPrimary: "text-text-primary",
    wordAccent: "text-brand-700",
    bars: {
      primary: "#0F172A",
      accent: "#92400E",
      tint: "#D97706",
      baseline: "#0F172A",
    },
  },
  accent: {
    mark:
      "border-brand-200 bg-brand-50 text-text-primary shadow-[0_1px_2px_rgba(146,64,14,0.12)]",
    wordPrimary: "text-text-primary",
    wordAccent: "text-brand-700",
    bars: {
      primary: "#0F172A",
      accent: "#92400E",
      tint: "#D97706",
      baseline: "#92400E",
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
          "relative inline-flex shrink-0 items-center justify-center rounded-[0.7rem] border",
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
      <path
        d="M6 26.25H26"
        opacity="0.28"
        stroke={colors.baseline}
        strokeLinecap="round"
        strokeWidth="1.35"
      />
      <rect fill={colors.primary} height="10" rx="1.25" width="4" x="6" y="16" />
      <rect fill={colors.accent} height="17" rx="1.25" width="4" x="12" y="9" />
      <rect fill={colors.tint} height="13" rx="1.25" width="4" x="18" y="13" />
      <rect fill={colors.primary} height="20" rx="1.25" width="4" x="24" y="6" />
    </svg>
  );
}
