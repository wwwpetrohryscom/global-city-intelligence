import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/collections/CollectionPage";
import { getCollectionBySlug } from "@/lib/data/queries";
import { generateCollectionMetadata } from "@/lib/seo/metadata";

const COLLECTION_SLUG = "best-cities-for-startups";

const comparisonNotes: Record<string, string> = {
  "san-francisco":
    "Frequently considered for startup activity; structured intelligence covers connectivity, transport, and cost context.",
  "new-york":
    "Verified transport and emergency context support comparison with structured intelligence.",
  london:
    "Verified UK aviation, rail, and metro context support international hub comparison.",
  berlin:
    "Verified BVG, Deutsche Bahn, and BER context support European hub comparison.",
  singapore:
    "Verified emergency, healthcare, aviation, and transport authority context at country and city levels.",
  toronto:
    "Verified healthcare, transport, and aviation context support North-American hub comparison.",
  amsterdam:
    "Verified GVB, NS, and Schiphol context support European startup-hub comparison.",
  paris:
    "Verified IDFM, SNCF, and Paris Aéroport context support international hub comparison.",
  stockholm:
    "Structured connectivity and country-level transport context support Nordic comparison.",
  "tel-aviv":
    "Useful comparison anchor in the platform's startup-context shortlist with structured intelligence.",
  bangalore:
    "Structured connectivity and country-level intelligence support South-Asian comparison.",
  boston:
    "Frequently included in startup-hub comparisons through structured connectivity and US country-level context.",
  austin:
    "Texas metro often considered for tech-economy comparison through cost framing and structured intelligence.",
  "washington-dc":
    "US capital region useful for policy-and-services-oriented startup comparison alongside structured country context.",
};

export const metadata: Metadata = (() => {
  const collection = getCollectionBySlug(COLLECTION_SLUG);
  if (!collection) {
    return {};
  }
  return generateCollectionMetadata(collection);
})();

export default function BestCitiesForStartupsPage() {
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
