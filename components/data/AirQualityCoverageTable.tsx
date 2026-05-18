import Link from "next/link";
import {
  getAirQualityProfileForCity,
  hasVerifiedAirQualityData,
} from "@/lib/data/queries";
import { cityRoute } from "@/lib/seo/routes";
import type { City } from "@/types";

const STATUS_LABEL: Record<string, string> = {
  verified: "Verified",
  partial: "Partially verified",
  unavailable: "Verified data unavailable",
};

export function AirQualityCoverageTable({
  caption,
  cities,
}: {
  caption: string;
  cities: City[];
}) {
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
              Air-quality dataset
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Dataset link
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-border">
          {cities.map((city) => {
            const verified = hasVerifiedAirQualityData(city.slug);
            const profile = getAirQualityProfileForCity(city.slug);
            const statusKey = profile?.verificationStatus ?? "unavailable";

            return (
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
                  {city.countryName}
                </td>
                <td className="border-l-2 border-brand-500 px-4 py-4 text-text-secondary">
                  {STATUS_LABEL[statusKey] ?? "Verified data unavailable"}
                </td>
                <td className="px-4 py-4">
                  <Link
                    className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                    href={`${cityRoute(city.slug)}#air-quality-dataset`}
                  >
                    {verified
                      ? `Open verified dataset for ${city.name}`
                      : `View dataset coverage for ${city.name}`}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
