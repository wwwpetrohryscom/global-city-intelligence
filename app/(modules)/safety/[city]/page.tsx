import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModulePageContent } from "@/components/layout/module-page-content";
import { getAllCities, getCityBySlug, getModuleBySlug } from "@/lib/data/queries";
import { createMetadata } from "@/lib/seo/metadata";
import { moduleRoute } from "@/lib/seo/routes";

const MODULE_SLUG = "safety" as const;

type PageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return getAllCities().map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    return {};
  }

  return createMetadata({
    title: `Safety in ${city.name}: Score, Data and Sources`,
    description: `${city.name} safety profile with violent-crime context, neighborhood variation, institutional response, data table, and sources.`,
    path: moduleRoute(MODULE_SLUG, city.slug),
    type: "article",
  });
}

export default async function SafetyPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  const moduleItem = getModuleBySlug(MODULE_SLUG);

  if (!city || !moduleItem) {
    notFound();
  }

  const moduleData = city.modules[MODULE_SLUG];

  return (
    <ModulePageContent
      city={city}
      description={`${moduleData.summary} Includes safety score, visible data table, source block, and links back to the city profile.`}
      moduleData={moduleData}
      moduleItem={moduleItem}
      title={`Safety in ${city.name}`}
    />
  );
}
