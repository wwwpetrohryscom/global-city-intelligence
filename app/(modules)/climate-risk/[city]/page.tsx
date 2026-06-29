import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModulePageContent } from "@/components/layout/module-page-content";
import { getAllCities, getCityBySlug, getModuleBySlug } from "@/lib/data/queries";
import { createMetadata } from "@/lib/seo/metadata";
import { cityTitleName } from "@/lib/seo/city-title";
import { moduleRoute } from "@/lib/seo/routes";

const MODULE_SLUG = "climate-risk" as const;

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
    title: `Climate Risk in ${cityTitleName(city)}, ${city.countryName}: Score, Data and Sources`,
    description: `${cityTitleName(city)}, ${city.countryName} climate-risk profile with hazard exposure, adaptation capacity, data table, and sources.`,
    path: moduleRoute(MODULE_SLUG, city.slug),
    type: "article",
  });
}

export default async function ClimateRiskPage({ params }: PageProps) {
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
      description={`${moduleData.summary} Includes climate-risk score, visible data table, source block, and links back to the city profile.`}
      moduleData={moduleData}
      moduleItem={moduleItem}
      title={`Climate Risk in ${city.name}`}
    />
  );
}
