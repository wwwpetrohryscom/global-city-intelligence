import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import type { CityCollection, CollectionIntent } from "@/types";

const intentLabel: Record<CollectionIntent, string> = {
  remote_work: "Remote work",
  family_life: "Family life",
  startups: "Startups",
  clean_air: "Clean air",
  public_transport: "Public transport",
  relocation: "Relocation",
  quality_of_life: "Quality of life",
};

export function getCollectionIntentLabel(intent: CollectionIntent): string {
  return intentLabel[intent];
}

export const cityCollections: CityCollection[] = [
  {
    slug: "best-cities-for-remote-workers",
    title: "Best Cities for Remote Workers: City Intelligence Shortlist",
    shortTitle: "Remote workers",
    description:
      "A curated city intelligence shortlist for remote workers, comparing cities across cost context, safety, healthcare, transport, connectivity, and relocation utility — not an official ranking.",
    intro:
      "This collection highlights cities worth comparing when planning remote-work relocation. The shortlist is based on structured city intelligence categories — connectivity context, cost framing, safety, healthcare, transport, and quality-of-life indicators — and is designed for orientation, not as an official ranking.",
    intent: "remote_work",
    citySlugs: [
      "lisbon",
      "berlin",
      "amsterdam",
      "barcelona",
      "bangkok",
      "singapore",
      "toronto",
      "mexico-city",
      "buenos-aires",
      "prague",
      "warsaw",
      "tallinn",
      "riga",
      "chiang-mai",
    ],
    criteria: [
      {
        key: "connectivity",
        label: "Connectivity context",
        explanation:
          "Cities included have national connectivity context covered through the platform's internet-speed module and country-level digital-development references.",
        sourceIds: ["itu-connectivity", "ookla-speedtest"],
      },
      {
        key: "cost",
        label: "Cost framing",
        explanation:
          "Each city has cost-of-living module context so users can compare directional affordability alongside other indicators. Cost numbers are framed as directional, not exact.",
        sourceIds: ["numbeo-cost"],
      },
      {
        key: "safety",
        label: "Safety profile",
        explanation:
          "Public safety context is available through the safety module and country-level emergency profiles where verified data exists.",
        sourceIds: ["unodc-crime"],
      },
      {
        key: "transport",
        label: "Transport and mobility",
        explanation:
          "Transport and mobility indicators help compare day-to-day movement. Verified transport layers are surfaced where official sources exist; otherwise a transparent fallback is shown.",
      },
      {
        key: "healthcare",
        label: "Healthcare access",
        explanation:
          "Healthcare access is summarized through verified country and city healthcare layers attributed to official health authorities where available.",
        sourceIds: ["who", "oecd-health"],
      },
    ],
    updatedDate: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: [
      "itu-connectivity",
      "ookla-speedtest",
      "numbeo-cost",
      "unodc-crime",
      "who",
    ],
    methodologyNote:
      "Cities are selected for usefulness of comparison rather than scored as an absolute ranking. Where verified city-level data is unavailable, the platform shows transparent fallback states rather than fabricated numbers.",
    relatedCollectionSlugs: [
      "best-cities-for-startups",
      "best-cities-for-public-transport",
      "best-cities-for-clean-air",
    ],
    relatedModuleSlugs: ["internet-speed", "cost-of-living", "safety"],
  },
  {
    slug: "best-cities-for-families",
    title: "Best Cities for Families: Practical City Comparison",
    shortTitle: "Families",
    description:
      "A comparison-oriented collection of cities seen through family-relevant context: safety, healthcare, public services, transport, air quality, and livability indicators. Designed for comparison, not as an official family ranking.",
    intro:
      "This page is a comparison-oriented collection of cities through family-relevant context. The shortlist focuses on structured intelligence categories such as safety, healthcare, public services, transport, and air quality — useful for comparison rather than an absolute claim about which city is best for any specific family.",
    intent: "family_life",
    citySlugs: [
      "copenhagen",
      "stockholm",
      "oslo",
      "vienna",
      "zurich",
      "singapore",
      "toronto",
      "melbourne",
      "auckland",
      "amsterdam",
      "adelaide",
      "christchurch",
      "montreal",
    ],
    criteria: [
      {
        key: "safety",
        label: "Public safety",
        explanation:
          "Cities included have public safety module coverage and, where verified, country-level emergency service profiles attributed to official publishers.",
        sourceIds: ["unodc-crime"],
      },
      {
        key: "healthcare",
        label: "Healthcare access",
        explanation:
          "Healthcare access uses verified country and city healthcare profiles where available; the rest is framed through international references such as WHO and OECD context.",
        sourceIds: ["who", "oecd-health"],
      },
      {
        key: "air_quality",
        label: "Air quality context",
        explanation:
          "Air quality indicators help compare day-to-day urban exposure. Numbers are directional, not exact, and benchmarks reference WHO and regional guidelines.",
        sourceIds: ["who-air"],
      },
      {
        key: "transport",
        label: "Public transport",
        explanation:
          "Transport and mobility indicators help families compare how easy a city is to navigate without a private vehicle.",
      },
      {
        key: "livability",
        label: "Livability indicators",
        explanation:
          "Affordability, energy, and resilience scores are surfaced on each city page to round out the family-relevant comparison.",
      },
    ],
    updatedDate: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["unodc-crime", "who", "oecd-health", "who-air", "un-habitat"],
    methodologyNote:
      "Cities are selected for relevance and comparison utility, not ranked numerically. The page does not claim any city is best for families — it offers structured intelligence so users can form their own view.",
    relatedCollectionSlugs: [
      "best-cities-for-clean-air",
      "best-cities-for-public-transport",
      "best-cities-for-remote-workers",
    ],
    relatedModuleSlugs: ["air-quality", "safety", "cost-of-living"],
  },
  {
    slug: "best-cities-for-startups",
    title: "Best Cities for Startups: Global City Intelligence Shortlist",
    shortTitle: "Startups",
    description:
      "Compare cities with startup and business relevance through connectivity, infrastructure, transport, and international hub positioning. A curated shortlist, not an official ranking.",
    intro:
      "This collection highlights cities worth comparing when assessing startup and business contexts. The shortlist is based on connectivity context, infrastructure indicators, transport, and international hub positioning. It is a comparison-oriented collection, not an authoritative ranking.",
    intent: "startups",
    citySlugs: [
      "san-francisco",
      "new-york",
      "london",
      "berlin",
      "singapore",
      "toronto",
      "amsterdam",
      "paris",
      "stockholm",
      "tel-aviv",
      "bangalore",
      "boston",
      "austin",
      "washington-dc",
    ],
    criteria: [
      {
        key: "connectivity",
        label: "Connectivity and digital readiness",
        explanation:
          "Cities included have national connectivity context through the platform's internet-speed module and country-level digital-development references.",
        sourceIds: ["itu-connectivity", "ookla-speedtest"],
      },
      {
        key: "transport",
        label: "Transport and hub positioning",
        explanation:
          "Verified transport authority and operator layers are surfaced where available, supporting comparison of intra-city movement and international connectivity.",
      },
      {
        key: "energy",
        label: "Energy readiness",
        explanation:
          "Energy-readiness indicators reference IEA urban transition framing and provide directional context for cities operating energy-intensive teams and infrastructure.",
        sourceIds: ["iea-cities", "nasa-power"],
      },
      {
        key: "cost",
        label: "Cost framing",
        explanation:
          "Cost-of-living context helps compare directional affordability alongside other indicators. Cost is framed as directional and should be verified for any specific decision.",
        sourceIds: ["numbeo-cost"],
      },
      {
        key: "safety",
        label: "Safety and stability context",
        explanation:
          "Public safety indicators and verified country emergency profiles support comparison of day-to-day operating context.",
        sourceIds: ["unodc-crime"],
      },
    ],
    updatedDate: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: [
      "itu-connectivity",
      "ookla-speedtest",
      "iea-cities",
      "numbeo-cost",
      "un-habitat",
    ],
    methodologyNote:
      "The collection focuses on cities frequently considered for startup or business activity. It avoids any claim of ordering, score, or talent-market precision and instead links to structured city intelligence for transparent comparison.",
    relatedCollectionSlugs: [
      "best-cities-for-remote-workers",
      "best-cities-for-public-transport",
      "best-cities-for-families",
    ],
    relatedModuleSlugs: ["internet-speed", "energy", "cost-of-living"],
  },
  {
    slug: "best-cities-for-clean-air",
    title: "Best Cities for Clean Air: Air Quality-Oriented City Collection",
    shortTitle: "Clean air",
    description:
      "An air quality-oriented city collection. Designed for comparison through WHO and regional air-quality context — not a ranked claim of which city has the cleanest air.",
    intro:
      "This collection brings together cities where air-quality context is a useful comparison dimension. The page does not claim any city is objectively cleanest. It is a comparison-oriented shortlist that links to the structured air-quality module on each city profile.",
    intent: "clean_air",
    citySlugs: [
      "copenhagen",
      "stockholm",
      "oslo",
      "helsinki",
      "zurich",
      "vienna",
      "auckland",
      "wellington",
      "sydney",
      "melbourne",
      "tallinn",
      "riga",
      "ljubljana",
    ],
    criteria: [
      {
        key: "air_quality",
        label: "Air quality module coverage",
        explanation:
          "Each city has an air-quality module page referencing WHO global air-quality guidelines and, where applicable, regional standards such as EEA and EPA context.",
        sourceIds: ["who-air", "eea-air", "epa-naaqs"],
      },
      {
        key: "climate",
        label: "Climate and resilience context",
        explanation:
          "Climate-risk and resilience indicators support comparison of urban environment context alongside air quality.",
        sourceIds: ["ipcc-urban", "un-habitat"],
      },
      {
        key: "energy",
        label: "Energy mix context",
        explanation:
          "Energy module context references IEA urban transition framing where applicable, which can shape long-term air-quality outcomes.",
        sourceIds: ["iea-cities"],
      },
      {
        key: "transport",
        label: "Public transport access",
        explanation:
          "Cities with strong public transport context often correlate with lower direct vehicle emissions; verified transport authority layers are surfaced where available.",
      },
    ],
    updatedDate: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: [
      "who-air",
      "eea-air",
      "epa-naaqs",
      "ipcc-urban",
      "iea-cities",
    ],
    methodologyNote:
      "The collection highlights cities that have useful air-quality context to compare. It avoids ranked claims of cleanest air, since exact ordering depends on year, monitoring network, pollutant, and methodology.",
    relatedCollectionSlugs: [
      "best-cities-for-families",
      "best-cities-for-public-transport",
      "best-cities-for-remote-workers",
    ],
    relatedModuleSlugs: ["air-quality", "climate-risk", "energy"],
  },
  {
    slug: "best-cities-for-public-transport",
    title: "Best Cities for Public Transport: Mobility-Focused City Collection",
    shortTitle: "Public transport",
    description:
      "A mobility-focused city collection comparing cities with useful public-transport context and verified transport or mobility profiles where available.",
    intro:
      "This collection brings together cities with notable public transport and mobility context. The shortlist is useful for comparison, not a ranked claim of which network is best. Verified transport authority and operator layers are surfaced on city and country pages where available.",
    intent: "public_transport",
    citySlugs: [
      "tokyo",
      "singapore",
      "london",
      "paris",
      "berlin",
      "amsterdam",
      "seoul",
      "hong-kong",
      "zurich",
      "copenhagen",
      "new-york",
      "busan",
      "fukuoka",
      "montreal",
    ],
    criteria: [
      {
        key: "transport_authority",
        label: "Transport authority coverage",
        explanation:
          "Cities included generally have verified country or city transport authority and operator layers attributed to official sources where available.",
      },
      {
        key: "metro",
        label: "Metro and rail context",
        explanation:
          "Metro and rail operators are linked through verified transport layers where the official operator publishes public information.",
      },
      {
        key: "airports",
        label: "Airport and aviation context",
        explanation:
          "Airport profiles use verified aviation authority and operator references where available so users can see official aviation context.",
      },
      {
        key: "safety",
        label: "Safety overlap",
        explanation:
          "Public safety indicators are linked through the safety module so users can compare transport alongside personal-safety context.",
        sourceIds: ["unodc-crime"],
      },
      {
        key: "climate",
        label: "Air quality and climate overlap",
        explanation:
          "Cities with strong public transport often appear in climate and air-quality conversations; module pages provide structured context for further comparison.",
        sourceIds: ["who-air", "ipcc-urban"],
      },
    ],
    updatedDate: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: [
      "un-habitat",
      "ipcc-urban",
      "who-air",
      "unodc-crime",
    ],
    methodologyNote:
      "The collection prioritizes cities where verified transport context exists and the comparison is genuinely useful. The page intentionally avoids absolute or scored network rankings, which depend on metric choice, time window, and operator scope.",
    relatedCollectionSlugs: [
      "best-cities-for-clean-air",
      "best-cities-for-families",
      "best-cities-for-startups",
    ],
    relatedModuleSlugs: ["air-quality", "safety", "climate-risk"],
  },
];
