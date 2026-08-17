import { getAllCities, getAllCountries } from "@/lib/data/queries";
import { macroRegionFor } from "@/lib/search/regions";
import type {
  CityIndexRecord,
  CitySearchIndex,
  CountryIndexRecord,
  CountrySearchIndex,
} from "@/lib/search/types";

/**
 * Build-time construction of the search index.
 *
 * SERVER ONLY — this imports `lib/data`, so it must never be pulled into a
 * client component. It is consumed exclusively by the two static route
 * handlers under `app/search-index/`, which Next materialises into plain JSON
 * files during `next build`. At runtime the client only ever fetches those
 * files; there is no API route, no server search endpoint and no runtime data
 * dependency, which keeps the site true-static.
 */

/**
 * City counts are derived the same way the countries page derives them — from
 * the published city records, not from `Country.citySlugs` — so the number on
 * a card can never claim a city that has no page. Counting once here is also
 * what keeps this O(cities) instead of O(countries x cities).
 */
function publishedCityCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const city of getAllCities()) {
    counts.set(city.countrySlug, (counts.get(city.countrySlug) ?? 0) + 1);
  }
  return counts;
}

export function buildCountryIndex(): CountrySearchIndex {
  const counts = publishedCityCounts();
  const countries: CountryIndexRecord[] = getAllCountries()
    .map((country) => ({
      s: country.slug,
      n: country.name,
      i: country.iso2,
      r: country.region,
      m: macroRegionFor(country.slug, country.region),
      c: counts.get(country.slug) ?? 0,
    }))
    .sort((a, b) => a.n.localeCompare(b.n));

  return {
    generatedFor: "countries",
    count: countries.length,
    countries,
  };
}

export function buildCityIndex(): CitySearchIndex {
  const all = getAllCities();

  // Rows whose (name, country) pair repeats would render as indistinguishable
  // result strings, so those — and only those — carry a disambiguator. Paying
  // the extra bytes for all ~4,400 rows to fix 14 of them is not worth it.
  const pairCounts = new Map<string, number>();
  for (const city of all) {
    const key = `${city.name}\u0000${city.countryName}`;
    pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);
  }

  const cities: CityIndexRecord[] = all
    .map((city) => {
      const ambiguous =
        (pairCounts.get(`${city.name}\u0000${city.countryName}`) ?? 0) > 1;
      const record: CityIndexRecord = {
        s: city.slug,
        n: city.name,
        cs: city.countrySlug,
        cn: city.countryName,
      };
      if (ambiguous) record.d = city.slug;
      return record;
    })
    .sort((a, b) => a.n.localeCompare(b.n));

  return {
    generatedFor: "cities",
    count: cities.length,
    cities,
  };
}
