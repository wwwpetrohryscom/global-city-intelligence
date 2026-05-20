export type PlaceType = "city" | "country";

export type PlaceImageType =
  | "hero"
  | "architecture"
  | "landmark"
  | "street"
  | "transport";

export type PlaceImageSource =
  | "wikimedia"
  | "unsplash"
  | "pexels"
  | "openverse"
  | "flickr"
  | "mapillary";

export interface PlaceImage {
  id: string;
  placeSlug: string;
  placeType: PlaceType;
  imageType: PlaceImageType;
  src: string;
  width?: number;
  height?: number;
  alt: string;
  caption?: string;
  source: PlaceImageSource;
  sourceUrl: string;
  author?: string;
  authorUrl?: string;
  license?: string;
  licenseUrl?: string;
  attributionText?: string;
  verified: boolean;
  verifiedAt: string;
  notes?: string;
}
