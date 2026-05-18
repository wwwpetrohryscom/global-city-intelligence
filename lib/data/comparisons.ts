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

  // Expansion batch: comparisons that pair newly added cities with
  // each other and with existing peers. Every pair is curated for
  // a clear comparison reason; verified utility layers attach where
  // available and transparent fallback applies otherwise.

  // Europe
  {
    cityASlug: "athens",
    cityBSlug: "rome",
    cityAName: "Athens",
    cityBName: "Rome",
    intent: "regional_alternative",
    region: "Europe",
    description:
      "Review Athens and Rome side by side through cost framing, transport access, healthcare and emergency context, and Mediterranean climate-adaptation priorities.",
  },
  {
    cityASlug: "budapest",
    cityBSlug: "prague",
    cityAName: "Budapest",
    cityBName: "Prague",
    intent: "regional_alternative",
    region: "Europe",
    description:
      "Use this comparison to weigh Budapest and Prague as Central-European capitals — affordability framing, transport access, and country-level intelligence sit alongside cultural and service-quality context.",
  },
  {
    cityASlug: "tallinn",
    cityBSlug: "riga",
    cityAName: "Tallinn",
    cityBName: "Riga",
    intent: "regional_alternative",
    region: "Europe",
    description:
      "Compare Tallinn and Riga as compact Baltic EU capitals across digital-readiness context, cost framing, and country-level public-service profiles.",
  },
  {
    cityASlug: "riga",
    cityBSlug: "vilnius",
    cityAName: "Riga",
    cityBName: "Vilnius",
    intent: "regional_alternative",
    region: "Europe",
    description:
      "Pair Riga and Vilnius for a Baltic comparison across cost framing, connectivity context, transport, and country-level indicators.",
  },
  {
    cityASlug: "bratislava",
    cityBSlug: "vienna",
    cityAName: "Bratislava",
    cityBName: "Vienna",
    intent: "regional_alternative",
    region: "Europe",
    description:
      "Compare Bratislava and Vienna across cost framing, transport access, and country-level context for users considering the Danube-crossing relocation corridor.",
  },
  {
    cityASlug: "ljubljana",
    cityBSlug: "zagreb",
    cityAName: "Ljubljana",
    cityBName: "Zagreb",
    intent: "regional_alternative",
    region: "Europe",
    description:
      "Review Ljubljana and Zagreb as compact regional capitals — useful for cross-border comparisons between Alpine and Adriatic contexts.",
  },
  {
    cityASlug: "belgrade",
    cityBSlug: "bucharest",
    cityAName: "Belgrade",
    cityBName: "Bucharest",
    intent: "regional_alternative",
    region: "Europe",
    description:
      "Pair Belgrade and Bucharest for a Southeast-European comparison across cost context, services activity, and country-level intelligence.",
  },

  // North America
  {
    cityASlug: "boston",
    cityBSlug: "washington-dc",
    cityAName: "Boston",
    cityBName: "Washington DC",
    intent: "global_hub_comparison",
    region: "North America",
    description:
      "Compare Boston and Washington DC across cost framing, transport access, and policy/services context, useful for US East-Coast relocation review.",
  },
  {
    cityASlug: "miami",
    cityBSlug: "austin",
    cityAName: "Miami",
    cityBName: "Austin",
    intent: "remote_work",
    region: "North America",
    description:
      "Pair Miami and Austin for a remote-work-oriented comparison across cost framing, connectivity context, climate-resilience considerations, and country-level signals.",
  },
  {
    cityASlug: "montreal",
    cityBSlug: "toronto",
    cityAName: "Montreal",
    cityBName: "Toronto",
    intent: "relocation",
    region: "North America",
    description:
      "Compare Montreal and Toronto across cost framing, transport access, country-level healthcare and emergency context, and cultural depth.",
  },
  {
    cityASlug: "calgary",
    cityBSlug: "vancouver",
    cityAName: "Calgary",
    cityBName: "Vancouver",
    intent: "regional_alternative",
    region: "North America",
    description:
      "Pair Calgary and Vancouver for a Western-Canada comparison across cost framing, country-level public-service context, and natural-environment considerations.",
  },
  {
    cityASlug: "dallas",
    cityBSlug: "austin",
    cityAName: "Dallas",
    cityBName: "Austin",
    intent: "regional_alternative",
    region: "North America",
    description:
      "Compare Dallas and Austin as Texas metros across cost framing, transport access, connectivity, and country-level context.",
  },
  {
    cityASlug: "boston",
    cityBSlug: "new-york",
    cityAName: "Boston",
    cityBName: "New York",
    intent: "regional_alternative",
    region: "North America",
    description:
      "Compare Boston and New York as US East-Coast metros across cost framing, transport access, public-services context, and country-level intelligence.",
  },
  {
    cityASlug: "washington-dc",
    cityBSlug: "new-york",
    cityAName: "Washington DC",
    cityBName: "New York",
    intent: "regional_alternative",
    region: "North America",
    description:
      "Pair Washington DC and New York for a US Northeast comparison across cost framing, transport access, and policy/services context.",
  },
  {
    cityASlug: "montreal",
    cityBSlug: "calgary",
    cityAName: "Montreal",
    cityBName: "Calgary",
    intent: "regional_alternative",
    region: "North America",
    description:
      "Compare Montreal and Calgary across cost framing, country-level public-service context, and cultural/linguistic profile for cross-Canada relocation review.",
  },

  // Asia
  {
    cityASlug: "guangzhou",
    cityBSlug: "shenzhen",
    cityAName: "Guangzhou",
    cityBName: "Shenzhen",
    intent: "global_hub_comparison",
    region: "Asia",
    description:
      "Pair Guangzhou and Shenzhen for a Pearl-River-Delta comparison across cost framing, transport access, and country-level intelligence.",
  },
  {
    cityASlug: "busan",
    cityBSlug: "seoul",
    cityAName: "Busan",
    cityBName: "Seoul",
    intent: "regional_alternative",
    region: "Asia",
    description:
      "Compare Busan and Seoul as primary and secondary Korean metros across cost framing, transport access, and country-level public-service context.",
  },
  {
    cityASlug: "fukuoka",
    cityBSlug: "osaka",
    cityAName: "Fukuoka",
    cityBName: "Osaka",
    intent: "relocation",
    region: "Asia",
    description:
      "Pair Fukuoka and Osaka for a Japanese cross-region comparison across cost framing, transport access, and country-level public-service context.",
  },
  {
    cityASlug: "chiang-mai",
    cityBSlug: "bangkok",
    cityAName: "Chiang Mai",
    cityBName: "Bangkok",
    intent: "remote_work",
    region: "Asia",
    description:
      "Compare Chiang Mai and Bangkok for a remote-work-oriented Thai comparison across cost framing, connectivity, air-quality context, and country-level signals.",
  },
  {
    cityASlug: "chengdu",
    cityBSlug: "guangzhou",
    cityAName: "Chengdu",
    cityBName: "Guangzhou",
    intent: "regional_alternative",
    region: "Asia",
    description:
      "Pair Chengdu and Guangzhou for an inland-versus-coastal Chinese comparison across cost framing, transport access, and country-level intelligence.",
  },
  {
    cityASlug: "wuhan",
    cityBSlug: "chengdu",
    cityAName: "Wuhan",
    cityBName: "Chengdu",
    intent: "regional_alternative",
    region: "Asia",
    description:
      "Compare Wuhan and Chengdu across cost framing, transport access, and country-level context for inland-China relocation review.",
  },
  {
    cityASlug: "phnom-penh",
    cityBSlug: "bangkok",
    cityAName: "Phnom Penh",
    cityBName: "Bangkok",
    intent: "regional_alternative",
    region: "Asia",
    description:
      "Pair Phnom Penh and Bangkok for a Southeast-Asian comparison across cost framing, transport access, and country-level public-service context.",
  },
  {
    cityASlug: "colombo",
    cityBSlug: "bangalore",
    cityAName: "Colombo",
    cityBName: "Bangalore",
    intent: "regional_alternative",
    region: "Asia",
    description:
      "Compare Colombo and Bangalore across cost framing, connectivity context, and country-level signals for South-Asian regional review.",
  },

  // Middle East
  {
    cityASlug: "muscat",
    cityBSlug: "dubai",
    cityAName: "Muscat",
    cityBName: "Dubai",
    intent: "regional_alternative",
    region: "Middle East",
    description:
      "Pair Muscat and Dubai for a Gulf-region comparison across cost framing, transport access, and country-level public-service context.",
  },
  {
    cityASlug: "amman",
    cityBSlug: "dubai",
    cityAName: "Amman",
    cityBName: "Dubai",
    intent: "regional_alternative",
    region: "Middle East",
    description:
      "Compare Amman and Dubai across cost framing, transport access, and country-level context for Levant-Gulf relocation review.",
  },

  // Africa
  {
    cityASlug: "tunis",
    cityBSlug: "rabat",
    cityAName: "Tunis",
    cityBName: "Rabat",
    intent: "regional_alternative",
    region: "Africa",
    description:
      "Pair Tunis and Rabat for a North-African comparison across cost framing, transport access, and country-level Mediterranean-Atlantic context.",
  },
  {
    cityASlug: "dakar",
    cityBSlug: "accra",
    cityAName: "Dakar",
    cityBName: "Accra",
    intent: "regional_alternative",
    region: "Africa",
    description:
      "Compare Dakar and Accra as West-African Atlantic metros across cost framing, transport access, and country-level public-service context.",
  },

  // Oceania
  {
    cityASlug: "adelaide",
    cityBSlug: "melbourne",
    cityAName: "Adelaide",
    cityBName: "Melbourne",
    intent: "regional_alternative",
    region: "Oceania",
    description:
      "Compare Adelaide and Melbourne across cost framing, transport access, and country-level public-service context for Australian intra-country relocation review.",
  },
  {
    cityASlug: "canberra",
    cityBSlug: "sydney",
    cityAName: "Canberra",
    cityBName: "Sydney",
    intent: "regional_alternative",
    region: "Oceania",
    description:
      "Pair Canberra and Sydney for an Australian capital-versus-largest-metro comparison across cost framing, transport access, and country-level context.",
  },
  {
    cityASlug: "christchurch",
    cityBSlug: "auckland",
    cityAName: "Christchurch",
    cityBName: "Auckland",
    intent: "regional_alternative",
    region: "Oceania",
    description:
      "Compare Christchurch and Auckland across cost framing, transport access, and country-level public-service context for New Zealand cross-island relocation review.",
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
