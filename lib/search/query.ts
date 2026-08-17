import { bestRank, compareMatches, fold, MatchRank } from "@/lib/search/match";
import type { CityIndexRecord, CountryIndexRecord } from "@/lib/search/types";

/**
 * Query evaluation shared by every search surface (global header, countries
 * discovery, per-country city directory). Client-safe: no `lib/data` import.
 */

export interface CountryHit extends CountryIndexRecord {
  rank: MatchRank;
}
export interface CityHit extends CityIndexRecord {
  rank: MatchRank;
}
export interface SearchResults {
  countries: CountryHit[];
  cities: CityHit[];
  total: number;
}

export const EMPTY_RESULTS: SearchResults = {
  countries: [],
  cities: [],
  total: 0,
};

/**
 * Countries match on name or ISO alpha-2 code. The code is only honoured as a
 * whole-token exact match: treating it as a substring would make "in" match
 * India via its code on every third keystroke.
 */
function rankCountry(country: CountryIndexRecord, q: string): MatchRank {
  const byName = bestRank([fold(country.n)], q);
  if (byName !== MatchRank.None) return byName;
  return fold(country.i) === q ? MatchRank.Exact : MatchRank.None;
}

/**
 * Cities match on their own name, or on their country's name so "Czech"
 * surfaces Brno. A country-name hit is deliberately capped below a name hit —
 * otherwise typing "Japan" would bury Japan itself under 80 Japanese cities.
 */
function rankCity(city: CityIndexRecord, q: string): MatchRank {
  const byName = bestRank([fold(city.n)], q);
  if (byName !== MatchRank.None) return byName;
  const byCountry = bestRank([fold(city.cn)], q);
  return byCountry === MatchRank.None ? MatchRank.None : MatchRank.Substring;
}

export function search(
  countries: CountryIndexRecord[],
  cities: CityIndexRecord[],
  rawQuery: string,
  limits: { countries: number; cities: number } = { countries: 6, cities: 8 },
): SearchResults {
  const q = fold(rawQuery);
  if (!q) return EMPTY_RESULTS;

  const countryHits: CountryHit[] = [];
  for (const c of countries) {
    const rank = rankCountry(c, q);
    if (rank !== MatchRank.None) countryHits.push({ ...c, rank });
  }
  const cityHits: CityHit[] = [];
  for (const c of cities) {
    const rank = rankCity(c, q);
    if (rank !== MatchRank.None) cityHits.push({ ...c, rank });
  }

  countryHits.sort((a, b) =>
    compareMatches({ rank: a.rank, name: a.n }, { rank: b.rank, name: b.n }),
  );
  cityHits.sort((a, b) =>
    compareMatches({ rank: a.rank, name: a.n }, { rank: b.rank, name: b.n }),
  );

  return {
    countries: countryHits.slice(0, limits.countries),
    cities: cityHits.slice(0, limits.cities),
    // Pre-truncation totals so the UI can honestly say "showing 8 of 214".
    total: countryHits.length + cityHits.length,
  };
}

/** Filter a fixed city list (one country's cities) by name. */
export function filterCities<T extends { name: string }>(
  cities: T[],
  rawQuery: string,
): T[] {
  const q = fold(rawQuery);
  if (!q) return cities;
  return cities
    .map((city) => ({ city, rank: bestRank([fold(city.name)], q) }))
    .filter((entry) => entry.rank !== MatchRank.None)
    .sort((a, b) =>
      compareMatches(
        { rank: a.rank, name: a.city.name },
        { rank: b.rank, name: b.city.name },
      ),
    )
    .map((entry) => entry.city);
}
