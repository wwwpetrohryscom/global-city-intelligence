import Link from "next/link";
import {
  cityRoute,
  comparisonRoute,
  countryRoute,
  getCollectionUrl,
  moduleRoute,
  staticRoutes,
} from "@/lib/seo/routes";
import type { City, CityIntentPage, Country } from "@/types";

interface UtilityFlags {
  verifiedEmergency: boolean;
  verifiedHealthcare: boolean;
  verifiedTransport: boolean;
}

export function CityIntentTable({
  caption,
  city,
  country,
  intentPage,
  flags,
}: {
  caption: string;
  city: City;
  country?: Country;
  intentPage: CityIntentPage;
  flags: UtilityFlags;
}) {
  const collectionLink = intentPage.relatedCollectionSlugs?.[0];
  const comparisonLink = intentPage.relatedComparisonSlugs?.[0];

  const rows: Array<{
    category: string;
    context: string;
    verification: string;
    explore: { label: string; href: string };
  }> = [
    {
      category: "Cost context",
      context: `Cost-of-living module references for ${city.name}.`,
      verification: "Directional indicator (Numbeo context)",
      explore: {
        label: `Open ${city.name} cost-of-living module`,
        href: moduleRoute("cost-of-living", city.slug),
      },
    },
    {
      category: "Air quality context",
      context: `Air-quality module references for ${city.name} framed against WHO and regional guidelines.`,
      verification: "Directional indicator",
      explore: {
        label: `Open ${city.name} air-quality module`,
        href: moduleRoute("air-quality", city.slug),
      },
    },
    {
      category: "Safety / public services",
      context: `Public safety module and country-level emergency profile for ${city.name}.`,
      verification: flags.verifiedEmergency
        ? "Verified country emergency profile"
        : "Fallback (verified data unavailable)",
      explore: {
        label: `Open ${city.name} safety module`,
        href: moduleRoute("safety", city.slug),
      },
    },
    {
      category: "Healthcare access",
      context: `Country and city healthcare references for ${city.name}.`,
      verification: flags.verifiedHealthcare
        ? "Verified healthcare profile"
        : "Fallback (verified data unavailable)",
      explore: {
        label: `Open ${city.name} city profile`,
        href: cityRoute(city.slug),
      },
    },
    {
      category: "Transport / mobility",
      context: `Country and city transport references for ${city.name}.`,
      verification: flags.verifiedTransport
        ? "Verified transport profile"
        : "Fallback (verified data unavailable)",
      explore: {
        label: `Open ${city.name} city profile`,
        href: cityRoute(city.slug),
      },
    },
    {
      category: "Country context",
      context: country
        ? `National context from the ${country.name} country hub.`
        : "National context is available from the country directory.",
      verification: "Structured country intelligence",
      explore: country
        ? {
            label: `Open ${country.name} country hub`,
            href: countryRoute(country.slug),
          }
        : {
            label: "Open country directory",
            href: staticRoutes.countries,
          },
    },
    {
      category: "Related comparisons",
      context: comparisonLink
        ? `Curated city-vs-city comparison page referencing ${city.name}.`
        : "No curated comparison page references this city yet.",
      verification: comparisonLink
        ? "Curated comparison"
        : "Browse the directory",
      explore: comparisonLink
        ? {
            label: `Open related comparison`,
            href: comparisonRoute(comparisonLink),
          }
        : {
            label: "Open comparison directory",
            href: staticRoutes.compare,
          },
    },
    {
      category: "Relevant collections",
      context: collectionLink
        ? "Curated Best Cities collection that lists this city."
        : "Curated collection may be available from the index.",
      verification: collectionLink
        ? "Curated shortlist (not an official ranking)"
        : "Browse the index",
      explore: collectionLink
        ? {
            label: "Open related collection",
            href: getCollectionUrl(collectionLink),
          }
        : {
            label: "Open Best Cities index",
            href: staticRoutes.collections,
          },
    },
  ];

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
              Category
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              City context
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Verification / source status
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Where to explore next
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-border">
          {rows.map((row) => (
            <tr
              className="odd:bg-white even:bg-neutral-soft/60 hover:bg-orange-50/60"
              key={row.category}
            >
              <th
                className="px-4 py-4 font-medium text-text-primary"
                scope="row"
              >
                {row.category}
              </th>
              <td className="border-l-2 border-brand-500 px-4 py-4 text-text-secondary">
                {row.context}
              </td>
              <td className="px-4 py-4 text-text-secondary">
                {row.verification}
              </td>
              <td className="px-4 py-4">
                <Link
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={row.explore.href}
                >
                  {row.explore.label}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
