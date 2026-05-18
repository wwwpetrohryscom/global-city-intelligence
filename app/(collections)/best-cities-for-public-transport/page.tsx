import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/collections/CollectionPage";
import { getCollectionBySlug } from "@/lib/data/queries";
import { generateCollectionMetadata } from "@/lib/seo/metadata";

const COLLECTION_SLUG = "best-cities-for-public-transport";

const comparisonNotes: Record<string, string> = {
  tokyo:
    "Verified Tokyo Metro, MLIT, Haneda, and Narita context support detailed mobility comparison.",
  singapore:
    "Verified LTA, CAAS, and Changi context support public-transport comparison.",
  london:
    "Verified Transport for London, Network Rail, and Heathrow context support public-transport comparison.",
  paris:
    "Verified IDFM, RATP, SNCF, and Paris Aéroport context support public-transport comparison.",
  berlin:
    "Verified BVG, Deutsche Bahn, and BER context support public-transport comparison.",
  amsterdam:
    "Verified GVB, NS, and Schiphol context support compact-city mobility comparison.",
  seoul:
    "East-Asian comparison anchor with structured transport and country-level context.",
  "hong-kong":
    "East-Asian comparison anchor with structured transport and country-level context.",
  zurich:
    "European comparison anchor with structured transport context and country-level intelligence.",
  copenhagen:
    "Verified Metroselskabet, DSB, and CPH context support compact-city mobility comparison.",
  "new-york":
    "Verified MTA and Port Authority of New York and New Jersey context support metro-system comparison.",
  busan:
    "Korean port metro included as a public-transport comparison anchor alongside Seoul.",
  fukuoka:
    "Compact Kyushu metro with structured transport context for cross-Japan mobility comparison.",
  montreal:
    "Canadian bilingual metro with structured transport context for cross-Canada mobility comparison.",
};

export const metadata: Metadata = (() => {
  const collection = getCollectionBySlug(COLLECTION_SLUG);
  if (!collection) {
    return {};
  }
  return generateCollectionMetadata(collection);
})();

export default function BestCitiesForPublicTransportPage() {
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
