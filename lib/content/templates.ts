import { bandLabel, type ScoreBand } from "@/lib/content/tone";
import { bandSentenceFragment } from "@/lib/content/rules";

// Small composable sentence templates. Pure, deterministic, and data-bound.
// No external strings, no randomness.

export function tplCityFraming(input: {
  name: string;
  countryName: string;
  region: string;
  population: string;
}): string {
  return `${input.name} is a ${input.region.toLowerCase()} city of about ${input.population} in ${input.countryName}.`;
}

export function tplOverallBand(input: {
  name: string;
  score: number;
  band: ScoreBand;
}): string {
  return `On the composite city-intelligence score, ${input.name} sits ${bandSentenceFragment(input.band)} (${input.score}/100).`;
}

export function tplStrengths(input: {
  name: string;
  primary: { name: string; score: number };
  secondary: { name: string; score: number } | undefined;
}): string {
  if (!input.secondary) {
    return `Its standout dimension is ${input.primary.name.toLowerCase()} (${input.primary.score}/100).`;
  }
  return `Its standout dimensions are ${input.primary.name.toLowerCase()} (${input.primary.score}/100) and ${input.secondary.name.toLowerCase()} (${input.secondary.score}/100).`;
}

export function tplWatchArea(input: {
  name: string;
  weakest: { name: string; score: number } | undefined;
}): string {
  if (!input.weakest) return "";
  return `The area most worth watching is ${input.weakest.name.toLowerCase()} (${input.weakest.score}/100), where the model registers practical gaps.`;
}

export function tplCountryFraming(input: {
  name: string;
  region: string;
  cityCount: number;
}): string {
  if (input.cityCount === 0) {
    return `${input.name} is indexed at the country level in the ${input.region} region.`;
  }
  if (input.cityCount === 1) {
    return `${input.name} is indexed at the country level in ${input.region}, with one city profile linked below.`;
  }
  return `${input.name} is indexed at the country level in ${input.region}, with ${input.cityCount} city profiles linked below.`;
}

export function tplModuleScopeForCity(input: {
  moduleName: string;
  cityName: string;
  score: number;
  band: ScoreBand;
}): string {
  return `${input.moduleName} in ${input.cityName} scores ${input.score}/100, placing it in the ${bandLabel(input.band)} group of the indexed set.`;
}

export function tplModuleComparison(input: {
  moduleName: string;
  cityName: string;
  cityScore: number;
  globalAverage: number;
}): string {
  const delta = input.cityScore - input.globalAverage;
  if (Math.abs(delta) < 3) {
    return `Across the indexed cities the ${input.moduleName.toLowerCase()} average is ${input.globalAverage}/100, so ${input.cityName} is close to the median for this dimension.`;
  }
  if (delta >= 3) {
    return `Across the indexed cities the ${input.moduleName.toLowerCase()} average is ${input.globalAverage}/100, so ${input.cityName} is ${delta} points above the median.`;
  }
  return `Across the indexed cities the ${input.moduleName.toLowerCase()} average is ${input.globalAverage}/100, so ${input.cityName} is ${Math.abs(delta)} points below the median.`;
}

export function tplRankingFraming(input: {
  title: string;
  entryCount: number;
  topCityName: string | undefined;
  topScore: number | undefined;
}): string {
  if (!input.topCityName || input.topScore === undefined) {
    return `${input.title} compares ${input.entryCount} indexed cities.`;
  }
  return `${input.title} compares ${input.entryCount} indexed cities, with ${input.topCityName} at the top of the table at ${input.topScore}/100.`;
}

export function tplSourceFraming(input: { sourceCount: number }): string {
  if (input.sourceCount === 0) {
    return "No sources are listed for this view yet.";
  }
  if (input.sourceCount === 1) {
    return "One institutional reference informs this view.";
  }
  return `${input.sourceCount} institutional references inform this view, listed below with reliability notes.`;
}
