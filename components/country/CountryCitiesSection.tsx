import { CityCard } from "@/components/cards/CityCard";
import { SectionHeading } from "@/components/ui/section-heading";
import type { City } from "@/types";

const SECTION_ID = "country-cities";

export function CountryCitiesSection({
  countryName,
  cities,
}: {
  countryName: string;
  cities: City[];
}) {
  return (
    <section aria-labelledby={`${SECTION_ID}-heading`} id={SECTION_ID}>
      <SectionHeading
        description="Each linked city page includes its own metadata, data table, source block, module links, and any verified utility layers."
        title={`Indexed cities in ${countryName}`}
      />
      <h2 className="sr-only" id={`${SECTION_ID}-heading`}>
        Indexed cities in {countryName}
      </h2>
      {cities.length === 0 ? (
        <p className="mt-6 text-sm leading-6 text-text-secondary">
          No indexed city profiles for {countryName} yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cities.map((city) => (
            <CityCard city={city} key={city.slug} />
          ))}
        </div>
      )}
    </section>
  );
}
