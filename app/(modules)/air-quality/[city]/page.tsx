import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModulePageContent } from "@/components/layout/module-page-content";
import { getCities, getCityBySlug, getModuleBySlug } from "@/lib/data/queries";
import { createMetadata } from "@/lib/seo/metadata";
import { moduleRoute } from "@/lib/seo/routes";

const MODULE_SLUG = "air-quality" as const;

type PageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return getCities().map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    return {};
  }

  return createMetadata({
    title: `Air Quality in ${city.name}: Health Score, Data and Sources`,
    description: `${city.name} air quality intelligence with clean-air score, pollutant context, health-based explanation, data table, and trusted sources.`,
    path: moduleRoute(MODULE_SLUG, city.slug),
    type: "article",
  });
}

export default async function AirQualityPage({ params }: PageProps) {
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
      description={`${moduleData.summary} Includes pollutant context, visible data table, source block, and links back to the city profile.`}
      moduleData={moduleData}
      moduleItem={moduleItem}
      title={`Air Quality in ${city.name}`}
    />
  );
}
