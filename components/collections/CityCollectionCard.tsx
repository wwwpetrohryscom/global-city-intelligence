import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { cityRoute } from "@/lib/seo/routes";
import type { City } from "@/types";

interface CityCollectionCardProps {
  city: City;
  note?: string;
}

export function CityCollectionCard({ city, note }: CityCollectionCardProps) {
  return (
    <Card interactive>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {city.countryName} / {city.region}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-text-primary">
        <Link
          className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
          href={cityRoute(city.slug)}
        >
          {city.name}
        </Link>
      </h3>
      <p className="mt-3 text-sm leading-6 text-text-secondary">
        {note ?? city.outlook}
      </p>
      <p className="mt-4 text-xs text-text-muted">
        Last updated {city.lastUpdated} / data year {city.dataYear}
      </p>
    </Card>
  );
}
