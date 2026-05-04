import type { IntelligenceModule, ModuleSlug } from "@/types";

export const intelligenceModules: IntelligenceModule[] = [
  {
    slug: "cost-of-living",
    name: "Cost of Living",
    shortName: "Living Costs",
    pathSegment: "cost-of-living",
    description:
      "Affordability, essential costs, and day-to-day financial pressure for residents.",
    sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
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
    sources: ["nasa-power", "ipcc-urban", "iea-cities"],
  },
  {
    slug: "safety",
    name: "Safety",
    shortName: "Safety",
    pathSegment: "safety",
    description:
      "Personal safety, institutional trust, and resilience signals informed by international safety and crime data.",
    sources: ["unodc-crime", "un-habitat"],
  },
  {
    slug: "internet-speed",
    name: "Internet Speed",
    shortName: "Connectivity",
    pathSegment: "internet-speed",
    description:
      "Broadband and mobile connectivity quality, latency, and digital-readiness signals for residents and remote workers.",
    sources: ["itu-connectivity", "ookla-speedtest"],
  },
  {
    slug: "climate-risk",
    name: "Climate Risk",
    shortName: "Climate Risk",
    pathSegment: "climate-risk",
    description:
      "Climate exposure, hazard frequency, and adaptation context for floods, heat, storms, and wildfires.",
    sources: ["ipcc-urban", "nasa-power", "un-habitat"],
  },
];

export const moduleLabels: Record<ModuleSlug, string> = {
  "cost-of-living": "cost of living",
  "air-quality": "air quality",
  energy: "energy",
  safety: "safety",
  "internet-speed": "internet speed",
  "climate-risk": "climate risk",
};

export const moduleSlugs: ModuleSlug[] = intelligenceModules.map((m) => m.slug);
