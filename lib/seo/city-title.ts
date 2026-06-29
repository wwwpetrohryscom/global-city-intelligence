import { cities } from "@/lib/data/cities";

/**
 * Disambiguated city name for page <title>s. Most titles already carry the country
 * (added in the stabilization metadata pass), which separates same-name cities in
 * different countries. A handful of cities share BOTH name and country (e.g. two
 * "Portland"s in the United States) and differ only by slug — for those we append
 * the distinguishing slug suffix (e.g. "Portland (ME)") so every page title is unique.
 * Non-ambiguous cities are returned unchanged.
 */
const ambiguousNameCountry = (() => {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const c of cities) {
    const k = `${c.name}|${c.countrySlug}`;
    if (seen.has(k)) dup.add(k);
    seen.add(k);
  }
  return dup;
})();

function nameToSlugBase(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function cityTitleName(city: {
  name: string;
  slug: string;
  countrySlug: string;
}): string {
  if (!ambiguousNameCountry.has(`${city.name}|${city.countrySlug}`)) {
    return city.name;
  }
  const base = nameToSlugBase(city.name);
  if (city.slug.startsWith(`${base}-`)) {
    const suffix = city.slug.slice(base.length + 1).replace(/-/g, " ").toUpperCase();
    return `${city.name} (${suffix})`;
  }
  // The "bare" twin keeps its plain name; the suffixed twin(s) carry a tag, so the
  // resulting titles are distinct.
  return city.name;
}
