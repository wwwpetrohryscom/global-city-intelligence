import { cityAiOverviews } from "@/lib/data/city-ai-overviews";
import { cityFaqs } from "@/lib/data/city-faqs";
import type { CityAiOverview, CityFaq } from "@/types/faq";

const faqBySlug = new Map<string, CityFaq>(
  cityFaqs.map((f) => [f.citySlug, f]),
);
const aiOverviewBySlug = new Map<string, CityAiOverview>(
  cityAiOverviews.map((a) => [a.citySlug, a]),
);

export function getCityFaq(citySlug: string): CityFaq | undefined {
  return faqBySlug.get(citySlug);
}

export function getCityAiOverview(
  citySlug: string,
): CityAiOverview | undefined {
  return aiOverviewBySlug.get(citySlug);
}
