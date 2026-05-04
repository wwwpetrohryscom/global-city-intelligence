import { freshnessSentence } from "@/lib/content/quality";
import { pickTopAndLow, scoreToBand } from "@/lib/content/rules";
import {
  tplCityFraming,
  tplCountryFraming,
  tplModuleComparison,
  tplModuleScopeForCity,
  tplOverallBand,
  tplRankingFraming,
  tplSourceFraming,
  tplStrengths,
  tplWatchArea,
} from "@/lib/content/templates";
import type {
  City,
  CityModuleData,
  Country,
  DataSource,
  IntelligenceModule,
  Ranking,
} from "@/types";

// All generators below produce deterministic text from typed structured data.
// They never invent facts and never call external services.

export function generateCityIntro(city: City): string {
  const band = scoreToBand(city.scores.overall);
  const framing = tplCityFraming({
    name: city.name,
    countryName: city.countryName,
    region: city.region,
    population: city.population,
  });
  const overall = tplOverallBand({ name: city.name, score: city.scores.overall, band });
  return `${city.intro} ${framing} ${overall}`;
}

export function generateCityExplanation(
  city: City,
  modules: IntelligenceModule[],
): string {
  const moduleHighlights = modules.map((moduleItem) => ({
    slug: moduleItem.slug,
    name: moduleItem.name,
    data: city.modules[moduleItem.slug],
  }));

  const { top, low } = pickTopAndLow(moduleHighlights);
  const strengths = tplStrengths({
    name: city.name,
    primary: top[0] ? { name: top[0].name, score: top[0].score } : { name: "overall", score: city.scores.overall },
    secondary: top[1] ? { name: top[1].name, score: top[1].score } : undefined,
  });
  const watch = tplWatchArea({
    name: city.name,
    weakest: low ? { name: low.name, score: low.score } : undefined,
  });
  const fresh = freshnessSentence({
    dataYear: city.dataYear,
    lastUpdated: city.lastUpdated,
    sourceCount: city.sources.length,
  });

  return [city.outlook, strengths, watch, fresh].filter(Boolean).join(" ");
}

export function generateCountryIntro(country: Country, cities: City[]): string {
  const framing = tplCountryFraming({
    name: country.name,
    region: country.region,
    cityCount: cities.length,
  });
  return `${country.intro} ${framing}`;
}

export function generateCountryExplanation(
  country: Country,
  cities: City[],
): string {
  const fresh = freshnessSentence({
    dataYear: country.dataYear,
    lastUpdated: country.lastUpdated,
    sourceCount: country.sources.length,
  });

  if (cities.length === 0) {
    return `Country profile for ${country.name} provides national context for future indexed cities. ${fresh}`;
  }

  const sortedByOverall = [...cities].sort(
    (a, b) => b.scores.overall - a.scores.overall,
  );
  const lead = sortedByOverall[0];
  const trailing = sortedByOverall[sortedByOverall.length - 1];

  const lede =
    cities.length === 1
      ? `The ${country.name} cluster currently holds one indexed city, ${lead.name} (${lead.scores.overall}/100 overall).`
      : `Across ${cities.length} indexed cities, ${lead.name} leads at ${lead.scores.overall}/100 and ${trailing.name} sits at ${trailing.scores.overall}/100.`;

  const reading = `Use the country page as a parent context layer; module-level detail lives on each city profile.`;

  return `${lede} ${reading} ${fresh}`;
}

export function generateModuleIntro(
  moduleItem: IntelligenceModule,
  city: City,
): string {
  const moduleData = city.modules[moduleItem.slug];
  const band = scoreToBand(moduleData.score);
  const scope = tplModuleScopeForCity({
    moduleName: moduleItem.name,
    cityName: city.name,
    score: moduleData.score,
    band,
  });
  return `${moduleData.summary} ${scope}`;
}

export function generateModuleExplanation(
  moduleItem: IntelligenceModule,
  city: City,
  allCities: City[],
): string {
  const moduleData = city.modules[moduleItem.slug];
  const totalScores = allCities
    .map((entry) => entry.modules[moduleItem.slug]?.score ?? 0)
    .filter((score) => score > 0);
  const globalAverage =
    totalScores.length > 0
      ? Math.round(
          totalScores.reduce((sum, score) => sum + score, 0) /
            totalScores.length,
        )
      : moduleData.score;

  const comparison = tplModuleComparison({
    moduleName: moduleItem.name,
    cityName: city.name,
    cityScore: moduleData.score,
    globalAverage,
  });

  const fresh = freshnessSentence({
    dataYear: moduleData.dataYear,
    lastUpdated: moduleData.lastUpdated,
    sourceCount: moduleData.sources.length,
  });

  return `${moduleData.explanation} ${comparison} ${fresh}`;
}

export function generateRankingIntro(ranking: Ranking): string {
  const top = ranking.entries[0];
  const framing = tplRankingFraming({
    title: ranking.title,
    entryCount: ranking.entries.length,
    topCityName: undefined,
    topScore: top?.score,
  });
  return `${ranking.description} ${framing}`;
}

export function generateRankingExplanation(
  ranking: Ranking,
  topCity: City | undefined,
): string {
  const top = ranking.entries[0];
  const framing = tplRankingFraming({
    title: ranking.title,
    entryCount: ranking.entries.length,
    topCityName: topCity?.name,
    topScore: top?.score,
  });
  const fresh = freshnessSentence({
    dataYear: ranking.dataYear,
    lastUpdated: ranking.lastUpdated,
    sourceCount: ranking.sources.length,
  });
  const reading =
    "Each row links directly to the relevant city profile so users can step from comparison into module-level context.";

  return `${ranking.methodology} ${framing} ${reading} ${fresh}`;
}

export function generateSourceBlockIntro(sources: DataSource[]): string {
  return tplSourceFraming({ sourceCount: sources.length });
}

export interface ModuleInterpretation {
  module: IntelligenceModule;
  data: CityModuleData;
  caption: string;
}

export function describeModuleForCity(
  moduleItem: IntelligenceModule,
  city: City,
): ModuleInterpretation {
  const data = city.modules[moduleItem.slug];
  const band = scoreToBand(data.score);
  const caption = tplModuleScopeForCity({
    moduleName: moduleItem.name,
    cityName: city.name,
    score: data.score,
    band,
  });
  return { module: moduleItem, data, caption };
}
