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
  {
    id: "ec-112",
    name: "112 — The European emergency number",
    organization: "European Commission",
    url: "https://digital-strategy.ec.europa.eu/en/policies/112",
    description:
      "Official European Commission policy page describing 112 as the single emergency number reachable across the European Union and several neighboring countries.",
    reliabilityNote:
      "Used as the primary attribution for the EU-wide 112 universal emergency number on European country profiles.",
  },
  {
    id: "fcc-911",
    name: "9-1-1 and E9-1-1 services",
    organization: "Federal Communications Commission",
    url: "https://www.fcc.gov/general/9-1-1-and-e9-1-1-services",
    description:
      "FCC reference page for the United States 9-1-1 and Enhanced 9-1-1 emergency calling system, covering availability and routing.",
    reliabilityNote:
      "Used as the primary attribution for the United States 911 universal emergency number.",
  },
  {
    id: "canada-emergency",
    name: "Emergency services in Canada",
    organization: "Government of Canada",
    url: "https://www.canada.ca/en/services/policing/police/community-safety-policing/911service.html",
    description:
      "Government of Canada reference for 9-1-1 emergency calling service availability across Canadian provinces and territories.",
    reliabilityNote:
      "Used as the primary attribution for Canada's 911 universal emergency number.",
  },
  {
    id: "triple-zero-au",
    name: "Triple Zero (000)",
    organization: "Australian Government",
    url: "https://www.triplezero.gov.au/",
    description:
      "Official Australian Government information site for the Triple Zero (000) emergency call service for police, fire, and ambulance.",
    reliabilityNote:
      "Used as the primary attribution for Australia's 000 universal emergency number.",
  },
  {
    id: "nz-police-111",
    name: "Dial 111 — Emergencies",
    organization: "New Zealand Police",
    url: "https://www.police.govt.nz/contact-us/dial-111-emergencies",
    description:
      "New Zealand Police reference page for the 111 emergency calling service across police, fire, and ambulance.",
    reliabilityNote:
      "Used as the primary attribution for New Zealand's 111 universal emergency number.",
  },
  {
    id: "npa-japan",
    name: "National Police Agency of Japan",
    organization: "National Police Agency, Japan",
    url: "https://www.npa.go.jp/english/",
    description:
      "Official site of Japan's National Police Agency, with public guidance referencing 110 for police and 119 for fire and ambulance.",
    reliabilityNote:
      "Used as the primary attribution for Japan's 110 police and 119 fire and ambulance emergency numbers.",
  },
  {
    id: "spf-singapore",
    name: "Singapore Police Force",
    organization: "Singapore Police Force",
    url: "https://www.police.gov.sg/",
    description:
      "Official Singapore Police Force site with public emergency contact guidance, referencing 999 for police emergencies.",
    reliabilityNote:
      "Used as the primary attribution for Singapore's 999 police emergency number.",
  },
  {
    id: "scdf-singapore",
    name: "Singapore Civil Defence Force",
    organization: "Singapore Civil Defence Force",
    url: "https://www.scdf.gov.sg/",
    description:
      "Official Singapore Civil Defence Force site with public emergency contact guidance, referencing 995 for fire and ambulance.",
    reliabilityNote:
      "Used as the primary attribution for Singapore's 995 fire and ambulance emergency number.",
  },
  {
    id: "korea-police",
    name: "Korean National Police Agency",
    organization: "Korean National Police Agency",
    url: "https://www.police.go.kr/eng/main.do",
    description:
      "Official site of the Korean National Police Agency, with public guidance referencing 112 for police and 119 for fire and ambulance.",
    reliabilityNote:
      "Used as the primary attribution for South Korea's 112 police and 119 fire and ambulance emergency numbers.",
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
