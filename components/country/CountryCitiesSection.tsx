import { CityCard } from "@/components/cards/CityCard";
import { CityDirectory } from "@/components/search/CityDirectory";
import { SectionHeading } from "@/components/ui/section-heading";
import type { City } from "@/types";

const SECTION_ID = "country-cities";

/**
 * Below this many cities the full card grid already fits comfortably on one
 * screen, so a searchable directory would only duplicate links for no gain.
 */
const DIRECTORY_MIN_CITIES = 8;

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
        <>
          {cities.length >= DIRECTORY_MIN_CITIES ? (
            <div className="mt-6">
              <CityDirectory
                countryName={countryName}
                cities={cities.map((city) => ({
                  slug: city.slug,
                  name: city.name,
                  region: city.region,
                }))}
              />
            </div>
          ) : null}
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {cities.map((city) => (
              <CityCard city={city} key={city.slug} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
