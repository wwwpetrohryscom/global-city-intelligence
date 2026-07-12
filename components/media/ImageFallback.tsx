import type { PlaceType } from "@/types";

export function ImageFallback({
  placeName,
  placeType,
  className,
}: {
  placeName: string;
  placeType: PlaceType;
  className?: string;
}) {
  const label = placeType === "city" ? "City profile" : "Country profile";

  return (
    <div
      aria-label={`Verified hero image pending for ${placeName}`}
      className={
        "relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-[1.125rem] border border-neutral-border/90 bg-text-primary shadow-[0_1px_2px_rgba(15,23,42,0.04)]" +
        (className ? ` ${className}` : "")
      }
      role="img"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(135deg,#0F172A_0%,#1E293B_68%,#92400E_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-8 bottom-8 h-px bg-white/25"
      />
      <div className="relative z-10 max-w-[80%] text-center text-text-inverse">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
          {label}
        </p>
        <p className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">
          {placeName}
        </p>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
          Verified image pending
        </p>
      </div>
    </div>
  );
}
