import type { PlaceImage } from "@/types";
import { ImageAttribution } from "@/components/media/ImageAttribution";

interface VisualGuideMediaSectionProps {
  images: readonly PlaceImage[];
}

/**
 * Renders up to 3 verified secondary images from the existing media
 * catalog. Each image is lazy-loaded, carries explicit width/height,
 * and is rendered alongside its existing attribution component.
 *
 * If `images` is empty, the section is skipped — no placeholders,
 * no fabricated thumbnails.
 */
export function VisualGuideMediaSection({
  images,
}: VisualGuideMediaSectionProps) {
  const visible = images.slice(0, 3);
  if (visible.length === 0) {
    return null;
  }

  return (
    <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {visible.map((image) => {
        const aspectStyle =
          image.width && image.height
            ? { aspectRatio: `${image.width} / ${image.height}` }
            : { aspectRatio: "16 / 9" };
        return (
          <li key={image.id}>
            <figure className="overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={image.alt}
                className="block h-auto w-full object-cover"
                decoding="async"
                height={image.height}
                loading="lazy"
                sizes="(min-width: 1280px) 384px, (min-width: 768px) 50vw, 100vw"
                src={image.src}
                style={aspectStyle}
                width={image.width}
              />
              <figcaption className="space-y-1 border-t border-neutral-border bg-surface-soft px-4 py-3">
                {image.caption ? (
                  <p className="text-sm leading-6 text-text-secondary">
                    {image.caption}
                  </p>
                ) : null}
                <ImageAttribution image={image} />
              </figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
}
