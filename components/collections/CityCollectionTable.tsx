import Link from "next/link";
import {
  getCityHealthcareProfile,
  getCountryEmergencyProfile,
  getCountryHealthcareProfile,
  hasVerifiedCityMobilityData,
  hasVerifiedEmergencyData,
  hasVerifiedHealthcareData,
} from "@/lib/data/queries";
import { cityRoute, countryRoute } from "@/lib/seo/routes";
import type { City } from "@/types";

interface CityCollectionTableProps {
  caption: string;
  cities: City[];
  comparisonNotes: Record<string, string>;
}

function buildUtilityLayerList(city: City): string {
  const layers: string[] = [];

  if (hasVerifiedEmergencyData(getCountryEmergencyProfile(city.countrySlug))) {
    layers.push("Verified emergency contacts");
  }

  const healthcareProfile =
    getCityHealthcareProfile(city.slug) ??
    getCountryHealthcareProfile(city.countrySlug);

  if (hasVerifiedHealthcareData(healthcareProfile)) {
    layers.push("Verified healthcare context");
  }

  if (hasVerifiedCityMobilityData(city.slug)) {
    layers.push("Verified city transport profile");
  }

  if (layers.length === 0) {
    return "Structured indicators only";
  }

  return layers.join("; ");
}

function buildIntelligenceCategoryList(city: City): string {
  const moduleKeys = Object.keys(city.modules) as Array<keyof typeof city.modules>;
  const labels = moduleKeys.map((key) => city.modules[key].moduleSlug);
  const human: Record<string, string> = {
    "cost-of-living": "Cost of living",
    "air-quality": "Air quality",
    energy: "Energy",
    safety: "Safety",
    "internet-speed": "Internet speed",
    "climate-risk": "Climate risk",
  };
  return labels.map((slug) => human[slug] ?? slug).join("; ");
}

export function CityCollectionTable({
  caption,
  cities,
  comparisonNotes,
}: CityCollectionTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-border bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
          {caption}
        </caption>
        <thead className="bg-neutral-soft text-text-primary">
          <tr>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              City
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Country
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Why compare it
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Relevant intelligence categories
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Utility layers available
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              City profile
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-border">
          {cities.map((city) => (
            <tr
              className="odd:bg-white even:bg-neutral-soft/60 hover:bg-orange-50/60"
              key={city.slug}
            >
              <th
                className="px-4 py-4 font-medium text-text-primary"
                scope="row"
              >
                {city.name}
              </th>
              <td className="px-4 py-4 text-text-secondary">
                <Link
                  className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                  href={countryRoute(city.countrySlug)}
                >
                  {city.countryName}
                </Link>
              </td>
              <td className="border-l-2 border-brand-500 px-4 py-4 text-text-secondary">
                {comparisonNotes[city.slug] ??
                  `Structured intelligence is available for ${city.name} across the platform's intelligence categories.`}
              </td>
              <td className="px-4 py-4 text-text-secondary">
                {buildIntelligenceCategoryList(city)}
              </td>
              <td className="px-4 py-4 text-text-secondary">
                {buildUtilityLayerList(city)}
              </td>
              <td className="px-4 py-4">
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={cityRoute(city.slug)}
                >
                  Open {city.name}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
