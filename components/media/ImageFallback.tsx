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
        "relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl border border-eco-100 bg-eco-50 shadow-[0_1px_2px_rgba(23,32,51,0.04)]" +
        (className ? ` ${className}` : "")
      }
      role="img"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(219,238,254,0.92),transparent_60%),radial-gradient(circle_at_84%_22%,rgba(220,252,233,0.78),transparent_44%),linear-gradient(135deg,#FFFFFF_0%,#EFF8FF_70%,#FFF8ED_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-8 bottom-8 h-px bg-eco-200"
      />
      <div className="relative z-10 max-w-[80%] text-center text-text-primary">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-eco-800">
          {label}
        </p>
        <p className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">
          {placeName}
        </p>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-text-secondary">
          Verified image pending
        </p>
      </div>
    </div>
  );
}
