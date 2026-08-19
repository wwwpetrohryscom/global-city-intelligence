import { hasClimate } from "@/lib/data/climate";
import { hasCostOfLiving } from "@/lib/data/cost-of-living";
import { hasEconomy } from "@/lib/data/economy";
import { hasEducation } from "@/lib/data/education";
import { hasHealthcare } from "@/lib/data/healthcare-retirement";
import { getCityBySlug } from "@/lib/data/queries";
import {
  CITY_SECTIONS,
  type CitySectionAvailability,
  type CitySectionId,
} from "@/lib/discovery/city-sections";

/**
 * SERVER ONLY — resolves which quick-navigation sections genuinely exist for a
 * city, using the same predicates the pages' own `generateStaticParams` use.
 *
 * This is the guarantee behind "never link to a page that does not exist": the
 * navigator asks the publication source directly at build time rather than
 * assuming a route exists, or discovering a 404 in the visitor's browser.
 *
 * `overview` and `safety` are keyed off the city record itself because
 * /cities/[city] and /safety/[city] both enumerate `getAllCities()`.
 */
const AVAILABILITY: Record<CitySectionId, (slug: string) => boolean> = {
  overview: (slug) => getCityBySlug(slug) !== undefined,
  "cost-of-living": hasCostOfLiving,
  climate: hasClimate,
  safety: (slug) => getCityBySlug(slug) !== undefined,
  economy: hasEconomy,
  education: hasEducation,
  healthcare: hasHealthcare,
};

export function citySectionAvailability(citySlug: string): CitySectionAvailability {
  const out: CitySectionAvailability = {};
  for (const section of CITY_SECTIONS) {
    out[section.id] = AVAILABILITY[section.id](citySlug);
  }
  return out;
}
