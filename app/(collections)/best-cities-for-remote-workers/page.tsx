import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/collections/CollectionPage";
import { getCollectionBySlug } from "@/lib/data/queries";
import { generateCollectionMetadata } from "@/lib/seo/metadata";

const COLLECTION_SLUG = "best-cities-for-remote-workers";

const comparisonNotes: Record<string, string> = {
  lisbon:
    "Often referenced for remote-work relocation through the platform's cost and connectivity context.",
  berlin:
    "Anchored by structured connectivity, transport, and country-level emergency profiles.",
  amsterdam:
    "Compact metro footprint, verified transport context, and structured cost framing.",
  barcelona:
    "Comparison-friendly for cost and lifestyle context alongside Mediterranean climate signals.",
  bangkok:
    "Often considered for affordability comparison; structured intelligence supports orientation.",
  singapore:
    "Includes verified emergency, healthcare, and transport authority context at country and city levels.",
  toronto:
    "Verified healthcare, transport, and emergency context support North-American comparison.",
  "mexico-city":
    "Useful for Latin-American comparison through structured cost and connectivity context.",
  "buenos-aires":
    "Latin-American comparison anchor with structured cost, safety, and healthcare context.",
  prague:
    "Central-European comparison anchor with structured cost and connectivity context.",
  warsaw:
    "Central-European comparison anchor with structured connectivity and cost intelligence.",
  tallinn:
    "Baltic EU comparison anchor often cited for digital-services context and remote-work relocation.",
  riga:
    "Baltic EU comparison anchor with compact services-economy framing and country-level intelligence.",
  "chiang-mai":
    "Northern-Thai comparison anchor frequently included in remote-work shortlists for cost framing.",
};

export const metadata: Metadata = (() => {
  const collection = getCollectionBySlug(COLLECTION_SLUG);
  if (!collection) {
    return {};
  }
  return generateCollectionMetadata(collection);
})();

export default function BestCitiesForRemoteWorkersPage() {
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
