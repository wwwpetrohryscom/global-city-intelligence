import type { PlaceImage } from "@/types";
import { getImageAttribution } from "@/lib/data/media/queries";

export function ImageAttribution({
  image,
  className,
}: {
  image: PlaceImage;
  className?: string;
}) {
  const attribution = getImageAttribution(image);
  const showAuthorLink = Boolean(attribution.author && attribution.authorUrl);

  return (
    <p
      className={
        "text-xs leading-5 text-text-secondary" +
        (className ? ` ${className}` : "")
      }
    >
      <span className="sr-only">Image credit: </span>
      Image:{" "}
      {showAuthorLink ? (
        <a
          className="underline decoration-brand-500 decoration-2 hover:bg-orange-50"
          href={attribution.authorUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {attribution.author}
        </a>
      ) : attribution.author ? (
        <span>{attribution.author}</span>
      ) : null}
      {attribution.author ? " / " : null}
      <a
        className="underline decoration-brand-500 decoration-2 hover:bg-orange-50"
        href={attribution.sourceUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        {attribution.sourceName}
      </a>
      {attribution.license ? (
        <>
          {", "}
          {attribution.licenseUrl ? (
            <a
              className="underline decoration-brand-500 decoration-2 hover:bg-orange-50"
              href={attribution.licenseUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {attribution.license}
            </a>
          ) : (
            <span>{attribution.license}</span>
          )}
        </>
      ) : null}
    </p>
  );
}
