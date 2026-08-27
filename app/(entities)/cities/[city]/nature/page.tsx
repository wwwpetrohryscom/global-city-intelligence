import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NatureCityPage } from "@/components/nature/NatureCityPage";
import { getAllCitiesWithNatureHub } from "@/lib/nature/engine";
import {
  buildNatureHubProps,
  natureMetadataFor,
} from "@/lib/nature/page-data";
import { createMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

type PageProps = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return getAllCitiesWithNatureHub().map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city } = await params;
  const props = buildNatureHubProps(city);
  if (!props) return {};
  return createMetadata(natureMetadataFor(props)!);
}

export default async function CityNatureHubPage({ params }: PageProps) {
  const { city } = await params;
  const props = buildNatureHubProps(city);
  if (!props) notFound();
  return <NatureCityPage {...props} />;
}
