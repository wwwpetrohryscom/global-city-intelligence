import type { PlaceImage, PlaceType } from "@/types";
import { getPlaceSecondaryImages } from "@/lib/data/media/queries";
import { ImageAttribution } from "./ImageAttribution";

const MAX_SECONDARY_IMAGES = 2;

export function PlaceSecondaryImages({
  placeType,
  placeSlug,
  placeName,
  headingId,
}: {
  placeType: PlaceType;
  placeSlug: string;
  placeName: string;
  headingId: string;
}) {
  const images = getPlaceSecondaryImages(placeType, placeSlug).slice(
    0,
    MAX_SECONDARY_IMAGES,
  );

  if (images.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={headingId}>
      <h2
        className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary"
        id={headingId}
      >
        Visual context
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
        Additional verified imagery for {placeName}. Each photo is sourced from
        Wikimedia Commons with full attribution and a permissive license.
      </p>
      <ul
        className={
          "mt-4 grid gap-4 " +
          (images.length > 1 ? "sm:grid-cols-2" : "sm:grid-cols-1")
        }
      >
        {images.map((image) => (
          <li key={image.id}>
            <SecondaryImageCard image={image} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SecondaryImageCard({ image }: { image: PlaceImage }) {
  const aspectStyle =
    image.width && image.height
      ? { aspectRatio: `${image.width} / ${image.height}` }
      : { aspectRatio: "16 / 9" };

  return (
    <figure className="overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={image.alt}
        className="block h-auto w-full object-cover"
        decoding="async"
        height={image.height}
        loading="lazy"
        sizes="(min-width: 1024px) 384px, 100vw"
        src={image.src}
        style={aspectStyle}
        width={image.width}
      />
      <figcaption className="space-y-1 border-t border-neutral-border bg-surface-soft px-4 py-3">
        {image.caption ? (
          <p className="text-sm font-semibold leading-6 text-text-primary">
            {image.caption}
          </p>
        ) : null}
        <ImageAttribution image={image} />
      </figcaption>
    </figure>
  );
}
