import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import type { Ranking } from "@/types";

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
    entries: [
      {
        citySlug: "copenhagen",
        rank: 1,
        score: 91,
        note: "Best balance of clean energy, mobility, air quality, and resilience.",
      },
      {
        citySlug: "tokyo",
        rank: 2,
        score: 89,
        note: "Exceptional operating capacity and transit reliability at megacity scale.",
      },
      {
        citySlug: "paris",
        rank: 3,
        score: 86,
        note: "Strong access and climate direction with affordability pressure.",
      },
      {
        citySlug: "new-york",
        rank: 4,
        score: 84,
        note: "High opportunity and resilience, constrained by housing costs.",
      },
    ],
  },
  {
    slug: "clean-air-cities",
    title: "Clean Air City Ranking",
    shortTitle: "Clean Air",
    description:
      "A health-oriented comparison of city air-quality scores using WHO-centered pollutant interpretation.",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    sources: ["who-air", "eea-air", "epa-naaqs"],
    methodology:
      "The clean-air ranking emphasizes PM2.5, PM10, nitrogen dioxide, ozone, monitoring confidence, and policy context.",
    entries: [
      {
        citySlug: "copenhagen",
        rank: 1,
        score: 88,
        note: "Strong regional monitoring and low-emission mobility profile.",
      },
      {
        citySlug: "tokyo",
        rank: 2,
        score: 78,
        note: "Solid megacity performance with heat and ozone context to watch.",
      },
      {
        citySlug: "paris",
        rank: 3,
        score: 76,
        note: "Improving street and mobility policy, with pollutant pressure remaining.",
      },
      {
        citySlug: "new-york",
        rank: 4,
        score: 72,
        note: "High monitoring confidence, but PM2.5 and ozone remain health signals.",
      },
    ],
  },
  {
    slug: "energy-ready-cities",
    title: "Energy Ready City Ranking",
    shortTitle: "Energy Readiness",
    description:
      "A ranking of city energy-transition readiness, grid resilience, clean-resource potential, and adaptation capacity.",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    sources: ["nasa-power", "ipcc-urban", "un-habitat"],
    methodology:
      "Energy readiness weighs transition policy, infrastructure complexity, renewable-resource context, and climate adaptation capacity.",
    entries: [
      {
        citySlug: "copenhagen",
        rank: 1,
        score: 94,
        note: "District energy and climate planning create a strong transition profile.",
      },
      {
        citySlug: "paris",
        rank: 2,
        score: 86,
        note: "Building retrofits and heat adaptation define the opportunity.",
      },
      {
        citySlug: "tokyo",
        rank: 3,
        score: 84,
        note: "Strong engineering capacity with megacity demand complexity.",
      },
      {
        citySlug: "new-york",
        rank: 4,
        score: 82,
        note: "Strong ambition and high coastal infrastructure complexity.",
      },
    ],
  },
  {
    slug: "affordability-balance",
    title: "Affordability Balance Ranking",
    shortTitle: "Affordability Balance",
    description:
      "A practical affordability ranking that weighs housing pressure against transport access, services, and opportunity density.",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    sources: ["un-habitat", "ipcc-urban"],
    methodology:
      "Affordability balance scores visible costs and hidden offsets, including transit access, service quality, and household resilience.",
    entries: [
      {
        citySlug: "tokyo",
        rank: 1,
        score: 68,
        note: "Transit reliability and housing variety improve practical affordability.",
      },
      {
        citySlug: "copenhagen",
        rank: 2,
        score: 66,
        note: "High prices are partly offset by public services and low mobility friction.",
      },
      {
        citySlug: "paris",
        rank: 3,
        score: 55,
        note: "Strong amenities cannot fully offset central housing pressure.",
      },
      {
        citySlug: "new-york",
        rank: 4,
        score: 49,
        note: "Opportunity is exceptional, but housing costs heavily reduce the score.",
      },
    ],
  },
];
