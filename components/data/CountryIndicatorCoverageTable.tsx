import Link from "next/link";
import {
  getCountryIndicatorProfile,
  hasVerifiedCountryIndicators,
} from "@/lib/data/queries";
import { countryRoute } from "@/lib/seo/routes";
import type { Country } from "@/types";

const STATUS_LABEL: Record<string, string> = {
  verified: "Verified",
  partial: "Partially verified",
  unavailable: "Verified data unavailable",
};

export function CountryIndicatorCoverageTable({
  caption,
  countries,
}: {
  caption: string;
  countries: Country[];
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
              Country
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Region
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Country indicators
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Data year
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Country hub
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-border">
          {countries.map((country) => {
            const verified = hasVerifiedCountryIndicators(country.slug);
            const profile = getCountryIndicatorProfile(country.slug);
            const statusKey = profile?.verificationStatus ?? "unavailable";

            return (
              <tr
                className="odd:bg-white even:bg-neutral-soft/60 hover:bg-orange-50/60"
                key={country.slug}
              >
                <th
                  className="px-4 py-4 font-medium text-text-primary"
                  scope="row"
                >
                  {country.name}
                </th>
                <td className="px-4 py-4 text-text-secondary">
                  {country.region}
                </td>
                <td className="border-l-2 border-brand-500 px-4 py-4 text-text-secondary">
                  {STATUS_LABEL[statusKey] ?? "Verified data unavailable"}
                </td>
                <td className="px-4 py-4 text-text-secondary">
                  {profile?.dataYear ?? "—"}
                </td>
                <td className="px-4 py-4">
                  <Link
                    className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                    href={`${countryRoute(country.slug)}#country-indicators`}
                  >
                    {verified
                      ? `Open verified indicators for ${country.name}`
                      : `View indicator coverage for ${country.name}`}
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
