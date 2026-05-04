import type { DataSource } from "@/types";

export const dataSources: DataSource[] = [
  {
    id: "un-habitat",
    name: "World Cities Report 2024",
    organization: "UN-Habitat",
    url: "https://unhabitat.org/world-cities-report-2024-cities-and-climate-action",
    description:
      "Urban climate, resilience, housing, and inclusion context for city-level interpretation.",
    reliabilityNote:
      "Used as a policy and methodology reference for urban exposure and resilience signals.",
  },
  {
    id: "who-air",
    name: "WHO Global Air Quality Guidelines",
    organization: "World Health Organization",
    url: "https://www.who.int/publications/i/item/9789240034228/",
    description:
      "Health-based reference levels for PM2.5, PM10, ozone, nitrogen dioxide, sulfur dioxide, and carbon monoxide.",
    reliabilityNote:
      "Used to normalize air-quality indicators toward health-protective benchmarks.",
  },
  {
    id: "nasa-power",
    name: "NASA POWER",
    organization: "NASA",
    url: "https://power.larc.nasa.gov/",
    description:
      "Satellite-derived solar and meteorological datasets for energy and climate screening.",
    reliabilityNote:
      "Used as an energy-resource and weather-normalization reference.",
  },
  {
    id: "eea-air",
    name: "Air Quality Status Report",
    organization: "European Environment Agency",
    url: "https://www.eea.europa.eu/en/analysis/publications/air-quality-status-report-2026",
    description:
      "European air-quality assessment context for pollutant trends, thresholds, and health risk framing.",
    reliabilityNote:
      "Used where European city comparisons need monitored air-quality context.",
  },
  {
    id: "epa-naaqs",
    name: "National Ambient Air Quality Standards",
    organization: "US Environmental Protection Agency",
    url: "https://www.epa.gov/naaqs",
    description:
      "Scientific and regulatory context for criteria pollutants and particulate matter standards.",
    reliabilityNote:
      "Used where United States city comparisons need air-quality benchmark context.",
  },
  {
    id: "ipcc-urban",
    name: "AR6 WGII Chapter 6: Cities, settlements and key infrastructure",
    organization: "IPCC",
    url: "https://www.ipcc.ch/report/ar6/wg2/chapter/chapter-6",
    description:
      "Climate-risk and adaptation reference for cities, settlements, infrastructure, and resilience.",
    reliabilityNote:
      "Used to explain urban climate vulnerability and adaptation scoring logic.",
  },
  {
    id: "numbeo-cost",
    name: "Cost of Living Index",
    organization: "Numbeo",
    url: "https://www.numbeo.com/cost-of-living/",
    description:
      "Crowd-sourced cost-of-living, rent, and purchasing-power index used as a directional comparison reference.",
    reliabilityNote:
      "Used for directional affordability framing alongside official housing and price datasets.",
  },
  {
    id: "iea-cities",
    name: "Empowering Urban Energy Transitions",
    organization: "International Energy Agency",
    url: "https://www.iea.org/reports/empowering-urban-energy-transitions",
    description:
      "City-scale clean-energy transition framing covering policy, electrification, buildings, and grid context.",
    reliabilityNote:
      "Used to ground energy-readiness scoring in international transition guidance.",
  },
  {
    id: "unodc-crime",
    name: "UNODC Data Portal",
    organization: "United Nations Office on Drugs and Crime",
    url: "https://dataunodc.un.org/",
    description:
      "International crime, victimization, and criminal-justice statistics used for safety context.",
    reliabilityNote:
      "Used as a directional benchmark for relative city safety framing.",
  },
  {
    id: "itu-connectivity",
    name: "Measuring Digital Development",
    organization: "International Telecommunication Union",
    url: "https://www.itu.int/itu-d/reports/statistics/",
    description:
      "Global broadband, mobile, and digital-development indicators for connectivity benchmarking.",
    reliabilityNote:
      "Used as the connectivity reference for national and city-level digital-readiness signals.",
  },
  {
    id: "ookla-speedtest",
    name: "Speedtest Global Index",
    organization: "Ookla",
    url: "https://www.speedtest.net/global-index",
    description:
      "Continuously updated fixed-broadband and mobile-network performance comparison index.",
    reliabilityNote:
      "Used as a directional speed and latency reference for city connectivity scoring.",
  },
];

export function getSourceById(sourceId: string) {
  return dataSources.find((source) => source.id === sourceId);
}

export function getSourcesByIds(sourceIds: string[]) {
  return sourceIds
    .map((sourceId) => getSourceById(sourceId))
    .filter((source): source is DataSource => Boolean(source));
}
