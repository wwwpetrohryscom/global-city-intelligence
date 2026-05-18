import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/collections/CollectionPage";
import { getCollectionBySlug } from "@/lib/data/queries";
import { generateCollectionMetadata } from "@/lib/seo/metadata";

const COLLECTION_SLUG = "best-cities-for-families";

const comparisonNotes: Record<string, string> = {
  copenhagen:
    "Verified transport and healthcare context support comparison through a family-relevant lens.",
  stockholm:
    "Structured intelligence covers public services, safety, and country-level healthcare context.",
  oslo:
    "Useful Nordic comparison anchor with structured safety, healthcare, and climate context.",
  vienna:
    "Comparison-friendly for transport, safety, and quality-of-life context.",
  zurich:
    "Anchored by structured safety, transport, and country-level healthcare context.",
  singapore:
    "Verified emergency, healthcare, and transport authority context across country and city scope.",
  toronto:
    "Verified healthcare, transport, and emergency context support North-American family comparison.",
  melbourne:
    "Australian comparison anchor with verified emergency and transport context.",
  auckland:
    "Pacific comparison anchor with verified emergency and country-level transport context.",
  amsterdam:
    "Compact, transit-rich city with verified transport context for family orientation.",
  adelaide:
    "Compact Australian metro often cited for quality-of-life context and country-level public-service references.",
  christchurch:
    "New Zealand South-Island metro with active urban-renewal context and family-relevant comparison framing.",
  montreal:
    "Canadian metro with structured cultural and public-services context for family-relevant comparison.",
};

export const metadata: Metadata = (() => {
  const collection = getCollectionBySlug(COLLECTION_SLUG);
  if (!collection) {
    return {};
  }
  return generateCollectionMetadata(collection);
})();

export default function BestCitiesForFamiliesPage() {
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
