import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/collections/CollectionPage";
import { getCollectionBySlug } from "@/lib/data/queries";
import { generateCollectionMetadata } from "@/lib/seo/metadata";

const COLLECTION_SLUG = "best-cities-for-clean-air";

const comparisonNotes: Record<string, string> = {
  copenhagen:
    "Frequently included in clean-air comparison; verified transport context supports day-to-day mobility framing.",
  stockholm:
    "Structured air-quality module context alongside Nordic climate and resilience signals.",
  oslo:
    "Comparison-friendly through air-quality and country-level transport context.",
  helsinki:
    "Nordic comparison anchor with structured air-quality and climate-risk module context.",
  zurich:
    "Comparison-friendly through air-quality and country-level transport context.",
  vienna:
    "Central-European comparison anchor with structured air-quality and resilience context.",
  auckland:
    "Pacific comparison anchor with structured air-quality and climate-risk context.",
  wellington:
    "Pacific comparison anchor with structured air-quality and climate-risk context.",
  sydney:
    "Australian comparison anchor with structured air-quality and climate-risk context.",
  melbourne:
    "Australian comparison anchor with structured air-quality and climate-risk context.",
};

export const metadata: Metadata = (() => {
  const collection = getCollectionBySlug(COLLECTION_SLUG);
  if (!collection) {
    return {};
  }
  return generateCollectionMetadata(collection);
})();

export default function BestCitiesForCleanAirPage() {
  const collection = getCollectionBySlug(COLLECTION_SLUG);

  if (!collection) {
    notFound();
  }

  return (
    <CollectionPage
      collection={collection}
      comparisonNotes={comparisonNotes}
    />
  );
}
