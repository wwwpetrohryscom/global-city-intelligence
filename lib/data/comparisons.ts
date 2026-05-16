import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import type { CityComparison, ComparisonIntent, ComparisonRegion } from "@/types";

interface ComparisonSeed {
  cityASlug: string;
  cityBSlug: string;
  cityAName: string;
  cityBName: string;
  intent: ComparisonIntent;
  region: ComparisonRegion;
  description: string;
}

const intentLabel: Record<ComparisonIntent, string> = {
  relocation: "Relocation",
  remote_work: "Remote work",
  business: "Business",
  travel_planning: "Travel planning",
  quality_of_life: "Quality of life",
  regional_alternative: "Regional alternative",
  global_hub_comparison: "Global hub comparison",
};

const seeds: ComparisonSeed[] = [
  // Europe
  {
    cityASlug: "london",
    cityBSlug: "paris",
    cityAName: "London",
    cityBName: "Paris",
    intent: "quality_of_life",
    region: "Europe",
    description:
      "Compare London and Paris across cost of living, air quality, safety, healthcare, transport, emergency services, and country context to support relocation, remote work, and travel planning.",
  },
  {
    cityASlug: "berlin",
    cityBSlug: "amsterdam",
    cityAName: "Berlin",
    cityBName: "Amsterdam",
    intent: "quality_of_life",
    region: "Europe",
    description:
      "Compare Berlin and Amsterdam across cost of living, air quality, safety, healthcare, transport, emergency services, and country context with structured directional indicators.",
  },
  {
    cityASlug: "madrid",
    cityBSlug: "barcelona",
    cityAName: "Madrid",
    cityBName: "Barcelona",
    intent: "regional_alternative",
    region: "Europe",
    description:
      "Compare Madrid and Barcelona across cost of living, air quality, safety, healthcare, transport, and country context for residents considering Spain's two largest metros.",
  },
  {
    cityASlug: "rome",
    cityBSlug: "milan",
    cityAName: "Rome",
    cityBName: "Milan",
    intent: "regional_alternative",
    region: "Europe",
    description:
      "Compare Rome and Milan across cost of living, air quality, safety, healthcare, transport, and country context for users weighing Italy's principal economic and political centers.",
  },
  {
    cityASlug: "stockholm",
    cityBSlug: "oslo",
    cityAName: "Stockholm",
    cityBName: "Oslo",
    intent: "regional_alternative",
    region: "Europe",
    description:
      "Compare Stockholm and Oslo across cost of living, air quality, safety, healthcare, transport, and country context for users weighing Scandinavian capitals.",
  },
  {
    cityASlug: "vienna",
    cityBSlug: "zurich",
    cityAName: "Vienna",
    cityBName: "Zurich",
    intent: "quality_of_life",
    region: "Europe",
    description:
      "Compare Vienna and Zurich across cost of living, air quality, safety, healthcare, transport, and country context for users weighing Central European service-quality capitals.",
  },
  {
    cityASlug: "lisbon",
    cityBSlug: "prague",
    cityAName: "Lisbon",
    cityBName: "Prague",
    intent: "remote_work",
    region: "Europe",
    description:
      "Compare Lisbon and Prague across cost of living, air quality, safety, healthcare, transport, and country context with remote-work-oriented relocation planning in mind.",
  },
  {
    cityASlug: "dublin",
    cityBSlug: "edinburgh",
    cityAName: "Dublin",
    cityBName: "Edinburgh",
    intent: "relocation",
    region: "Europe",
    description:
      "Compare Dublin and Edinburgh across cost of living, air quality, safety, healthcare, transport, and country context for English-speaking European relocation.",
  },

  // North America
  {
    cityASlug: "new-york",
    cityBSlug: "toronto",
    cityAName: "New York",
    cityBName: "Toronto",
    intent: "relocation",
    region: "North America",
    description:
      "Compare New York and Toronto across cost of living, air quality, safety, healthcare, transport, and country context for North American relocation and remote-work planning.",
  },
  {
    cityASlug: "los-angeles",
    cityBSlug: "san-francisco",
    cityAName: "Los Angeles",
    cityBName: "San Francisco",
    intent: "regional_alternative",
    region: "North America",
    description:
      "Compare Los Angeles and San Francisco across cost of living, air quality, safety, healthcare, transport, and country context for California metro-to-metro decisions.",
  },
  {
    cityASlug: "chicago",
    cityBSlug: "seattle",
    cityAName: "Chicago",
    cityBName: "Seattle",
    intent: "regional_alternative",
    region: "North America",
    description:
      "Compare Chicago and Seattle across cost of living, air quality, safety, healthcare, transport, and country context for United States cross-region relocation.",
  },
  {
    cityASlug: "vancouver",
    cityBSlug: "toronto",
    cityAName: "Vancouver",
    cityBName: "Toronto",
    intent: "regional_alternative",
    region: "North America",
    description:
      "Compare Vancouver and Toronto across cost of living, air quality, safety, healthcare, transport, and country context for Canadian intra-country relocation.",
  },
  {
    cityASlug: "new-york",
    cityBSlug: "london",
    cityAName: "New York",
    cityBName: "London",
    intent: "global_hub_comparison",
    region: "Global",
    description:
      "Compare New York and London across cost of living, air quality, safety, healthcare, transport, and country context for users evaluating the world's two largest English-language financial hubs.",
  },

  // Asia
  {
    cityASlug: "tokyo",
    cityBSlug: "singapore",
    cityAName: "Tokyo",
    cityBName: "Singapore",
    intent: "global_hub_comparison",
    region: "Asia",
    description:
      "Compare Tokyo and Singapore across cost of living, air quality, safety, healthcare, transport, and country context for Asia-Pacific business and relocation decisions.",
  },
  {
    cityASlug: "seoul",
    cityBSlug: "tokyo",
    cityAName: "Seoul",
    cityBName: "Tokyo",
    intent: "regional_alternative",
    region: "Asia",
    description:
      "Compare Seoul and Tokyo across cost of living, air quality, safety, healthcare, transport, and country context for East Asian regional relocation.",
  },
  {
    cityASlug: "hong-kong",
    cityBSlug: "singapore",
    cityAName: "Hong Kong",
    cityBName: "Singapore",
    intent: "global_hub_comparison",
    region: "Asia",
    description:
      "Compare Hong Kong and Singapore across cost of living, air quality, safety, healthcare, transport, and country context for global finance and trade hubs.",
  },
  {
    cityASlug: "bangkok",
    cityBSlug: "kuala-lumpur",
    cityAName: "Bangkok",
    cityBName: "Kuala Lumpur",
    intent: "regional_alternative",
    region: "Asia",
    description:
      "Compare Bangkok and Kuala Lumpur across cost of living, air quality, safety, healthcare, transport, and country context for Southeast Asian regional planning.",
  },
  {
    cityASlug: "taipei",
    cityBSlug: "seoul",
    cityAName: "Taipei",
    cityBName: "Seoul",
    intent: "regional_alternative",
    region: "Asia",
    description:
      "Compare Taipei and Seoul across cost of living, air quality, safety, healthcare, transport, and country context for East Asian relocation and remote-work planning.",
  },
  {
    cityASlug: "osaka",
    cityBSlug: "kyoto",
    cityAName: "Osaka",
    cityBName: "Kyoto",
    intent: "regional_alternative",
    region: "Asia",
    description:
      "Compare Osaka and Kyoto across cost of living, air quality, safety, healthcare, transport, and country context for users weighing western Japan's two anchor cities.",
  },

  // Middle East
  {
    cityASlug: "dubai",
    cityBSlug: "abu-dhabi",
    cityAName: "Dubai",
    cityBName: "Abu Dhabi",
    intent: "regional_alternative",
    region: "Middle East",
    description:
      "Compare Dubai and Abu Dhabi across cost of living, air quality, safety, healthcare, transport, and country context for UAE intra-country relocation and business planning.",
  },
  {
    cityASlug: "dubai",
    cityBSlug: "singapore",
    cityAName: "Dubai",
    cityBName: "Singapore",
    intent: "global_hub_comparison",
    region: "Global",
    description:
      "Compare Dubai and Singapore across cost of living, air quality, safety, healthcare, transport, and country context for global trade, services, and relocation hubs.",
  },
  {
    cityASlug: "doha",
    cityBSlug: "dubai",
    cityAName: "Doha",
    cityBName: "Dubai",
    intent: "regional_alternative",
    region: "Middle East",
    description:
      "Compare Doha and Dubai across cost of living, air quality, safety, healthcare, transport, and country context for Gulf regional planning.",
  },
  {
    cityASlug: "riyadh",
    cityBSlug: "dubai",
    cityAName: "Riyadh",
    cityBName: "Dubai",
    intent: "regional_alternative",
    region: "Middle East",
    description:
      "Compare Riyadh and Dubai across cost of living, air quality, safety, healthcare, transport, and country context for Gulf-region relocation and business decisions.",
  },

  // Latin America
  {
    cityASlug: "mexico-city",
    cityBSlug: "bogota",
    cityAName: "Mexico City",
    cityBName: "Bogotá",
    intent: "regional_alternative",
    region: "Latin America",
    description:
      "Compare Mexico City and Bogotá across cost of living, air quality, safety, healthcare, transport, and country context for Latin American regional planning.",
  },
  {
    cityASlug: "buenos-aires",
    cityBSlug: "santiago",
    cityAName: "Buenos Aires",
    cityBName: "Santiago",
    intent: "regional_alternative",
    region: "Latin America",
    description:
      "Compare Buenos Aires and Santiago across cost of living, air quality, safety, healthcare, transport, and country context for Southern Cone relocation.",
  },
  {
    cityASlug: "sao-paulo",
    cityBSlug: "rio-de-janeiro",
    cityAName: "São Paulo",
    cityBName: "Rio de Janeiro",
    intent: "regional_alternative",
    region: "Latin America",
    description:
      "Compare São Paulo and Rio de Janeiro across cost of living, air quality, safety, healthcare, transport, and country context for Brazilian intra-country relocation.",
  },
  {
    cityASlug: "lima",
    cityBSlug: "quito",
    cityAName: "Lima",
    cityBName: "Quito",
    intent: "regional_alternative",
    region: "Latin America",
    description:
      "Compare Lima and Quito across cost of living, air quality, safety, healthcare, transport, and country context for Andean regional planning.",
  },

  // Africa
  {
    cityASlug: "cape-town",
    cityBSlug: "johannesburg",
    cityAName: "Cape Town",
    cityBName: "Johannesburg",
    intent: "regional_alternative",
    region: "Africa",
    description:
      "Compare Cape Town and Johannesburg across cost of living, air quality, safety, healthcare, transport, and country context for South African intra-country relocation.",
  },
  {
    cityASlug: "nairobi",
    cityBSlug: "kigali",
    cityAName: "Nairobi",
    cityBName: "Kigali",
    intent: "regional_alternative",
    region: "Africa",
    description:
      "Compare Nairobi and Kigali across cost of living, air quality, safety, healthcare, transport, and country context for East African regional planning.",
  },
  {
    cityASlug: "cairo",
    cityBSlug: "casablanca",
    cityAName: "Cairo",
    cityBName: "Casablanca",
    intent: "regional_alternative",
    region: "Africa",
    description:
      "Compare Cairo and Casablanca across cost of living, air quality, safety, healthcare, transport, and country context for North African regional planning.",
  },
  {
    cityASlug: "lagos",
    cityBSlug: "accra",
    cityAName: "Lagos",
    cityBName: "Accra",
    intent: "regional_alternative",
    region: "Africa",
    description:
      "Compare Lagos and Accra across cost of living, air quality, safety, healthcare, transport, and country context for West African regional planning.",
  },

  // Oceania
  {
    cityASlug: "sydney",
    cityBSlug: "melbourne",
    cityAName: "Sydney",
    cityBName: "Melbourne",
    intent: "regional_alternative",
    region: "Oceania",
    description:
      "Compare Sydney and Melbourne across cost of living, air quality, safety, healthcare, transport, and country context for Australian intra-country relocation.",
  },
  {
    cityASlug: "auckland",
    cityBSlug: "wellington",
    cityAName: "Auckland",
    cityBName: "Wellington",
    intent: "regional_alternative",
    region: "Oceania",
    description:
      "Compare Auckland and Wellington across cost of living, air quality, safety, healthcare, transport, and country context for New Zealand intra-country relocation.",
  },
  {
    cityASlug: "brisbane",
    cityBSlug: "perth",
    cityAName: "Brisbane",
    cityBName: "Perth",
    intent: "regional_alternative",
    region: "Oceania",
    description:
      "Compare Brisbane and Perth across cost of living, air quality, safety, healthcare, transport, and country context for Australian inter-state relocation.",
  },

  // Global relocation / business
  {
    cityASlug: "paris",
    cityBSlug: "new-york",
    cityAName: "Paris",
    cityBName: "New York",
    intent: "global_hub_comparison",
    region: "Global",
    description:
      "Compare Paris and New York across cost of living, air quality, safety, healthcare, transport, and country context for transatlantic business and relocation planning.",
  },
  {
    cityASlug: "berlin",
    cityBSlug: "london",
    cityAName: "Berlin",
    cityBName: "London",
    intent: "relocation",
    region: "Europe",
    description:
      "Compare Berlin and London across cost of living, air quality, safety, healthcare, transport, and country context for users weighing European relocation between EU and UK contexts.",
  },
  {
    cityASlug: "singapore",
    cityBSlug: "sydney",
    cityAName: "Singapore",
    cityBName: "Sydney",
    intent: "relocation",
    region: "Global",
    description:
      "Compare Singapore and Sydney across cost of living, air quality, safety, healthcare, transport, and country context for Asia-Pacific relocation planning.",
  },
];

function buildSlug(a: string, b: string): string {
  return `${a}-vs-${b}`;
}

function buildTitle(a: string, b: string): string {
  return `${a} vs ${b}: Cost, Safety, Healthcare & Transport`;
}

export const cityComparisons: CityComparison[] = seeds.map((seed) => ({
  slug: buildSlug(seed.cityASlug, seed.cityBSlug),
  cityASlug: seed.cityASlug,
  cityBSlug: seed.cityBSlug,
  title: buildTitle(seed.cityAName, seed.cityBName),
  description: seed.description,
  comparisonIntent: seed.intent,
  region: seed.region,
  updatedDate: LAST_UPDATED,
  dataYear: DATA_YEAR,
  sourceIds: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
}));

export function getComparisonIntentLabel(intent: ComparisonIntent): string {
  return intentLabel[intent];
}

export function buildComparisonSlug(cityASlug: string, cityBSlug: string) {
  return buildSlug(cityASlug, cityBSlug);
}
