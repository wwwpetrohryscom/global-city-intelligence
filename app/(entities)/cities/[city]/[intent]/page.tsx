import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityIntentPage } from "@/components/intents/CityIntentPage";
import {
  getAllCityIntentPages,
  getCityBySlug,
  getCityIntentBySlug,
  getCityIntentPage,
  getCountryBySlug,
  getIntentPagesForCity,
} from "@/lib/data/queries";
import { generateCityIntentMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ city: string; intent: string }>;
};

export function generateStaticParams() {
  return getAllCityIntentPages().map((page) => ({
    city: page.citySlug,
    intent: page.intentSlug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: citySlug, intent: intentSlug } = await params;
  const city = getCityBySlug(citySlug);
  const intent = getCityIntentBySlug(intentSlug);
  const intentPage = getCityIntentPage(citySlug, intentSlug);

  if (!city || !intent || !intentPage) {
    return {};
  }

  const country = getCountryBySlug(city.countrySlug);

  return generateCityIntentMetadata({
    city,
    country,
    intent,
    intentPage,
  });
}

export default async function CityIntentRoute({ params }: PageProps) {
  const { city: citySlug, intent: intentSlug } = await params;
  const city = getCityBySlug(citySlug);
  const intent = getCityIntentBySlug(intentSlug);
  const intentPage = getCityIntentPage(citySlug, intentSlug);

  if (!city || !intent || !intentPage) {
    notFound();
  }

  const country = getCountryBySlug(city.countrySlug);
  const otherIntentPagesForCity = getIntentPagesForCity(city.slug).filter(
    (page) => page.intentSlug !== intent.slug,
  );

  return (
    <CityIntentPage
      city={city}
      country={country}
      intent={intent}
      intentPage={intentPage}
      otherIntentPagesForCity={otherIntentPagesForCity}
    />
  );
}
