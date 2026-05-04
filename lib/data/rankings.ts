import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import { cities } from "@/lib/data/cities";
import type { Ranking, RankingEntry } from "@/types";

function rankBy(
  scoreFor: (city: (typeof cities)[number]) => number,
  noteFor: (city: (typeof cities)[number]) => string,
): RankingEntry[] {
  return [...cities]
    .map((city) => ({
      citySlug: city.slug,
      score: scoreFor(city),
      note: noteFor(city),
    }))
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export const rankings: Ranking[] = [
  {
    slug: "overall-city-intelligence",
    title: "Overall City Intelligence Ranking",
    shortTitle: "Overall Intelligence",
    description:
      "A balanced ranking of cities across affordability, air quality, clean-energy readiness, and resilience.",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    methodology:
      "The overall ranking combines module scores with extra weight for health, climate resilience, and practical daily-life access.",
    relatedRankingSlugs: ["best-cities-quality-of-life", "clean-air-cities", "energy-ready-cities"],
    entries: rankBy(
      (city) => city.scores.overall,
      (city) =>
        `Overall composite ${city.scores.overall}/100; affordability ${city.scores.affordability}, air ${city.scores.airQuality}, energy ${city.scores.energy}.`,
    ),
  },
  {
    slug: "best-cities-quality-of-life",
    title: "Best Cities for Quality of Life",
    shortTitle: "Quality of Life",
    description:
      "Cities that combine strong services, mobility, safety, clean air, and resilience into a healthy day-to-day profile.",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    sources: ["un-habitat", "who-air", "ipcc-urban", "unodc-crime"],
    methodology:
      "Quality of life weights overall score, air quality, safety, and resilience. The model rewards cities where daily life is healthy, predictable, and connected.",
    relatedRankingSlugs: ["overall-city-intelligence", "clean-air-cities", "best-connected-cities"],
    entries: rankBy(
      (city) => {
        const safety = city.modules.safety?.score ?? 0;
        return Math.round(
          city.scores.overall * 0.35 +
            city.scores.airQuality * 0.25 +
            safety * 0.25 +
            city.scores.resilience * 0.15,
        );
      },
      (city) =>
        `Strong combination of services, air quality, and safety in ${city.name}.`,
    ),
  },
  {
    slug: "best-cities-remote-workers",
    title: "Best Cities for Remote Workers",
    shortTitle: "Remote Work",
    description:
      "Cities that combine fast connectivity, safety, healthy day-to-day life, and a manageable cost-of-living balance for remote and hybrid workers.",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    sources: ["itu-connectivity", "ookla-speedtest", "un-habitat", "unodc-crime"],
    methodology:
      "Remote-worker scoring combines internet-speed, safety, affordability, and overall city quality. Connectivity carries the largest weight; affordability is a meaningful tiebreaker.",
    relatedRankingSlugs: ["best-connected-cities", "best-cities-quality-of-life", "most-affordable-global-cities"],
    entries: rankBy(
      (city) => {
        const internet = city.modules["internet-speed"]?.score ?? 0;
        const safety = city.modules.safety?.score ?? 0;
        return Math.round(
          internet * 0.4 +
            safety * 0.2 +
            city.scores.affordability * 0.2 +
            city.scores.overall * 0.2,
        );
      },
      (city) =>
        `Connectivity ${city.modules["internet-speed"]?.score ?? "n/a"}/100 and safety ${city.modules.safety?.score ?? "n/a"}/100 in ${city.name}.`,
    ),
  },
  {
    slug: "clean-air-cities",
    title: "Cleanest Air Cities",
    shortTitle: "Clean Air",
    description:
      "A health-oriented comparison of city air-quality scores using WHO-centered pollutant interpretation.",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    sources: ["who-air", "eea-air", "epa-naaqs"],
    methodology:
      "The clean-air ranking emphasizes PM2.5, PM10, nitrogen dioxide, ozone, monitoring confidence, and policy context.",
    relatedRankingSlugs: ["best-cities-quality-of-life", "energy-ready-cities", "overall-city-intelligence"],
    entries: rankBy(
      (city) => city.scores.airQuality,
      (city) =>
        `Clean-air score ${city.scores.airQuality}/100 informed by ${city.modules["air-quality"].sources.join(", ")}.`,
    ),
  },
  {
    slug: "most-affordable-global-cities",
    title: "Most Affordable Global Cities",
    shortTitle: "Most Affordable",
    description:
      "Cities ranked by cost-of-living score, weighing housing pressure, essential spending, and household offsets across global metros.",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
    methodology:
      "The most-affordable ranking is driven by the cost-of-living module score, with overall city score as a tiebreaker.",
    relatedRankingSlugs: ["affordability-balance", "best-cities-remote-workers", "overall-city-intelligence"],
    entries: rankBy(
      (city) => city.modules["cost-of-living"].score,
      (city) =>
        `Cost-of-living score ${city.modules["cost-of-living"].score}/100. ${city.modules["cost-of-living"].summary}`,
    ),
  },
  {
    slug: "best-connected-cities",
    title: "Best Connected Cities",
    shortTitle: "Best Connected",
    description:
      "Cities ranked by internet speed, mobile coverage, and digital-readiness depth for residents, businesses, and remote workers.",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    sources: ["itu-connectivity", "ookla-speedtest"],
    methodology:
      "The best-connected ranking is driven by the internet-speed module score, with overall city score as a directional tiebreaker.",
    relatedRankingSlugs: ["best-cities-remote-workers", "best-cities-quality-of-life", "overall-city-intelligence"],
    entries: rankBy(
      (city) => city.modules["internet-speed"].score,
      (city) =>
        `Internet-speed score ${city.modules["internet-speed"].score}/100. ${city.modules["internet-speed"].summary}`,
    ),
  },
  {
    slug: "energy-ready-cities",
    title: "Energy Ready City Ranking",
    shortTitle: "Energy Readiness",
    description:
      "A ranking of city energy-transition readiness, grid resilience, clean-resource potential, and adaptation capacity.",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    sources: ["nasa-power", "ipcc-urban", "un-habitat", "iea-cities"],
    methodology:
      "Energy readiness weighs transition policy, infrastructure complexity, renewable-resource context, and climate adaptation capacity.",
    relatedRankingSlugs: ["clean-air-cities", "overall-city-intelligence", "best-cities-quality-of-life"],
    entries: rankBy(
      (city) => city.scores.energy,
      (city) =>
        `Energy readiness ${city.scores.energy}/100. ${city.modules.energy.summary}`,
    ),
  },
  {
    slug: "affordability-balance",
    title: "Affordability Balance Ranking",
    shortTitle: "Affordability Balance",
    description:
      "A practical affordability ranking that weighs housing pressure against transport access, services, and opportunity density.",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
    methodology:
      "Affordability balance scores visible costs and hidden offsets, including transit access, service quality, and household resilience.",
    relatedRankingSlugs: ["most-affordable-global-cities", "best-cities-remote-workers", "overall-city-intelligence"],
    entries: rankBy(
      (city) =>
        Math.round(
          city.scores.affordability * 0.6 + city.scores.overall * 0.4,
        ),
      (city) =>
        `Affordability ${city.scores.affordability}/100 with overall context ${city.scores.overall}/100.`,
    ),
  },
];
