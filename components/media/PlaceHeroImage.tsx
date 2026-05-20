import type { PlaceImage, PlaceType } from "@/types";
import { getPlaceHeroImage } from "@/lib/data/media/queries";
import { ImageAttribution } from "./ImageAttribution";
import { ImageFallback } from "./ImageFallback";

export function PlaceHeroImage({
  placeType,
  placeSlug,
  placeName,
  priority = false,
  className,
}: {
  placeType: PlaceType;
  placeSlug: string;
  placeName: string;
  priority?: boolean;
  className?: string;
}) {
  const image = getPlaceHeroImage(placeType, placeSlug);
  const wrapperClass =
    "overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-sm" +
    (className ? ` ${className}` : "");

  if (!image) {
    return (
      <figure className={wrapperClass}>
        <ImageFallback placeName={placeName} placeType={placeType} />
        <figcaption className="border-t border-neutral-border bg-surface-soft px-4 py-3 text-xs leading-5 text-text-secondary">
          Verified hero imagery is being sourced for {placeName}.
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className={wrapperClass}>
      <HeroImg image={image} priority={priority} />
      <figcaption className="space-y-1 border-t border-neutral-border bg-surface-soft px-4 py-3">
        {image.caption ? (
          <p className="text-sm leading-6 text-text-secondary">
            {image.caption}
          </p>
        ) : null}
        <ImageAttribution image={image} />
      </figcaption>
    </figure>
  );
}

function HeroImg({
  image,
  priority,
}: {
  image: PlaceImage;
  priority: boolean;
}) {
  const aspectStyle =
    image.width && image.height
      ? { aspectRatio: `${image.width} / ${image.height}` }
      : { aspectRatio: "16 / 9" };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={image.alt}
      className="block h-auto w-full object-cover"
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      height={image.height}
      loading={priority ? "eager" : "lazy"}
      sizes="(min-width: 1024px) 768px, 100vw"
      src={image.src}
      style={aspectStyle}
      width={image.width}
    />
  );
}
