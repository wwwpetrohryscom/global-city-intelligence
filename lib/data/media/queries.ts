import type { PlaceImage, PlaceType } from "@/types";
import { cityImages } from "./city-images";
import { countryImages } from "./country-images";

const cityHeroIndex: ReadonlyMap<string, PlaceImage> = buildHeroIndex(cityImages);
const countryHeroIndex: ReadonlyMap<string, PlaceImage> = buildHeroIndex(
  countryImages,
);

function buildHeroIndex(images: PlaceImage[]): ReadonlyMap<string, PlaceImage> {
  const map = new Map<string, PlaceImage>();
  for (const image of images) {
    if (image.imageType !== "hero" || !image.verified) {
      continue;
    }
    if (map.has(image.placeSlug)) {
      continue;
    }
    map.set(image.placeSlug, image);
  }
  return map;
}

export function getCityHeroImage(citySlug: string): PlaceImage | undefined {
  return cityHeroIndex.get(citySlug);
}

export function getCountryHeroImage(
  countrySlug: string,
): PlaceImage | undefined {
  return countryHeroIndex.get(countrySlug);
}

export function getPlaceHeroImage(
  placeType: PlaceType,
  slug: string,
): PlaceImage | undefined {
  return placeType === "city"
    ? getCityHeroImage(slug)
    : getCountryHeroImage(slug);
}

export function hasVerifiedHeroImage(
  placeType: PlaceType,
  slug: string,
): boolean {
  return getPlaceHeroImage(placeType, slug) !== undefined;
}

export function getAllVerifiedCityHeroImages(): PlaceImage[] {
  return Array.from(cityHeroIndex.values());
}

export function getAllVerifiedCountryHeroImages(): PlaceImage[] {
  return Array.from(countryHeroIndex.values());
}

export { getImageAttribution } from "./attribution";
