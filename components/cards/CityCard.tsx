import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ScoreBar } from "@/components/ui/score-bar";
import { cityRoute } from "@/lib/seo/routes";
import type { City } from "@/types";

export function CityCard({ city }: { city: City }) {
  return (
    <Card interactive>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">
            <Link className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline" href={cityRoute(city.slug)}>
              {city.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            {city.countryName} / {city.region}
          </p>
        </div>
        <span className="rounded-full border border-brand-400 bg-orange-50 px-3 py-1 text-sm font-semibold text-text-primary">
          {city.scores.overall}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-text-secondary">{city.outlook}</p>
      <div className="mt-5">
        <ScoreBar label="Overall" value={city.scores.overall} />
      </div>
    </Card>
  );
}
