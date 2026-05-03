import type { IntelligenceModule } from "@/types";

export const intelligenceModules: IntelligenceModule[] = [
  {
    slug: "cost-of-living",
    name: "Cost of Living",
    shortName: "Living Costs",
    pathSegment: "cost-of-living",
    description:
      "Affordability, essential costs, and day-to-day financial pressure for residents.",
    sources: ["un-habitat", "ipcc-urban"],
  },
  {
    slug: "air-quality",
    name: "Air Quality",
    shortName: "Clean Air",
    pathSegment: "air-quality",
    description:
      "Health-oriented air-quality conditions with context from WHO, EEA, and EPA benchmarks.",
    sources: ["who-air", "eea-air", "epa-naaqs"],
  },
  {
    slug: "energy",
    name: "Energy",
    shortName: "Energy Readiness",
    pathSegment: "energy",
    description:
      "Clean-energy readiness, grid resilience, and solar or efficiency opportunity signals.",
    sources: ["nasa-power", "ipcc-urban"],
  },
];

export const moduleLabels = {
  "cost-of-living": "cost of living",
  "air-quality": "air quality",
  energy: "energy",
} as const;
