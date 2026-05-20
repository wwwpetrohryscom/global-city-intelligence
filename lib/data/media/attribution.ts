import type { PlaceImage } from "@/types";
import { getPlaceImageSourceMeta } from "./sources";

export interface ImageAttributionParts {
  author?: string;
  authorUrl?: string;
  sourceName: string;
  sourceUrl: string;
  license?: string;
  licenseUrl?: string;
  attributionText: string;
}

export function getImageAttribution(image: PlaceImage): ImageAttributionParts {
  const sourceMeta = getPlaceImageSourceMeta(image.source);

  const baseAttribution = image.attributionText
    ? image.attributionText
    : buildAttributionText({
        author: image.author,
        sourceName: sourceMeta.name,
        license: image.license,
      });

  return {
    author: image.author,
    authorUrl: image.authorUrl,
    sourceName: sourceMeta.name,
    sourceUrl: image.sourceUrl,
    license: image.license,
    licenseUrl: image.licenseUrl,
    attributionText: baseAttribution,
  };
}

function buildAttributionText({
  author,
  sourceName,
  license,
}: {
  author?: string;
  sourceName: string;
  license?: string;
}): string {
  const credit = author ? `${author} / ${sourceName}` : sourceName;
  return license ? `${credit}, ${license}` : credit;
}
