import type { Metadata } from "next";
import { NatureCityPage } from "@/components/nature/NatureCityPage";
import { getAllCitiesWithNatureRoute } from "@/lib/nature/engine";
import {
  buildNatureCategoryProps,
  natureMetadataFor,
  requireNatureCategoryProps,
} from "@/lib/nature/page-data";
import { createMetadata } from "@/lib/seo/metadata";

/**
 * `islands` for one city. Published only when the city clears the
 * dedicated-page threshold — see lib/nature/taxonomy.ts.
 */
const SEGMENT = "islands" as const;

export const dynamicParams = false;

type PageProps = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return getAllCitiesWithNatureRoute(SEGMENT).map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city } = await params;
  const props = buildNatureCategoryProps(city, SEGMENT);
  if (!props) return {};
  return createMetadata(natureMetadataFor(props)!);
}

export default async function CityNatureCategoryPage({ params }: PageProps) {
  const { city } = await params;
  return <NatureCityPage {...requireNatureCategoryProps(city, SEGMENT)} />;
}
