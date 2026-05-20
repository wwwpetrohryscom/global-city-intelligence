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
        "relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl border border-neutral-border bg-surface-soft shadow-sm" +
        (className ? ` ${className}` : "")
      }
      role="img"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#0D1B3D] via-[#1B2A55] to-[#FF6B00] opacity-90"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.12),transparent_50%)]"
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
