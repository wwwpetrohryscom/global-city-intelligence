import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/collections/CollectionPage";
import { AirQualityCoverageTable } from "@/components/data/AirQualityCoverageTable";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getCitiesForCollection,
  getCollectionBySlug,
  getCitiesWithVerifiedAirQualityData,
} from "@/lib/data/queries";
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

  const collectionCities = getCitiesForCollection(collection.slug);
  const verifiedCount = getCitiesWithVerifiedAirQualityData().filter(
    (citySlug) => collectionCities.some((city) => city.slug === citySlug),
  ).length;

  return (
    <CollectionPage
      additionalSection={
        <section aria-labelledby="clean-air-dataset-coverage-heading">
          <SectionHeading
            description={
              verifiedCount > 0
                ? `Air-quality dataset coverage for cities in this collection. Verified measurements are surfaced where the platform has integrated source-attributed data; transparent fallback is shown otherwise.`
                : "Air-quality dataset coverage for cities in this collection. The platform has not yet integrated verified city-level measurements from accepted publishers, so every row shows transparent fallback. The collection remains an unordered curated shortlist, not a ranked claim of which city has the cleanest air."
            }
            title="Air-quality dataset coverage"
          />
          <h2 className="sr-only" id="clean-air-dataset-coverage-heading">
            Air-quality dataset coverage
          </h2>
          <div className="mt-6">
            <AirQualityCoverageTable
              caption="Air-quality dataset coverage table for cities in this collection"
              cities={collectionCities}
            />
          </div>
        </section>
      }
      collection={collection}
      comparisonNotes={comparisonNotes}
    />
  );
}
