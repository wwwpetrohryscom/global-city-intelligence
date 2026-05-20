import type { PlaceImageSource } from "@/types";

export interface PlaceImageSourceMeta {
  id: PlaceImageSource;
  name: string;
  homepage: string;
  attributionRequired: boolean;
  description: string;
}

export const placeImageSources: Record<PlaceImageSource, PlaceImageSourceMeta> = {
  wikimedia: {
    id: "wikimedia",
    name: "Wikimedia Commons",
    homepage: "https://commons.wikimedia.org/",
    attributionRequired: true,
    description:
      "Primary source for encyclopedic city and country imagery. Records must include the file page URL, author, and a Creative Commons or public-domain license.",
  },
  unsplash: {
    id: "unsplash",
    name: "Unsplash",
    homepage: "https://unsplash.com/",
    attributionRequired: true,
    description:
      "Premium hero imagery. Records must include the photographer name, profile URL, and source page URL per Unsplash provider terms.",
  },
  pexels: {
    id: "pexels",
    name: "Pexels",
    homepage: "https://www.pexels.com/",
    attributionRequired: true,
    description:
      "Fallback source for high-quality urban photography. Records must include the photographer name and the source page URL per Pexels provider terms.",
  },
  openverse: {
    id: "openverse",
    name: "Openverse",
    homepage: "https://openverse.org/",
    attributionRequired: true,
    description:
      "Aggregator over multiple openly licensed providers. Use only when license, author, and source URL are explicit on the record.",
  },
  flickr: {
    id: "flickr",
    name: "Flickr",
    homepage: "https://www.flickr.com/",
    attributionRequired: true,
    description:
      "Use only when the original photo is published under an explicit Creative Commons or public-domain license and the author can be verified.",
  },
  mapillary: {
    id: "mapillary",
    name: "Mapillary",
    homepage: "https://www.mapillary.com/",
    attributionRequired: true,
    description:
      "Reserved for street-level mobility context only. Not used as primary hero imagery in the current visual layer.",
  },
};

export function getPlaceImageSourceMeta(
  source: PlaceImageSource,
): PlaceImageSourceMeta {
  return placeImageSources[source];
}
