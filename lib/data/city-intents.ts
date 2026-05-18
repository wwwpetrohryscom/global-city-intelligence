import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import type {
  CityIntent,
  CityIntentPage,
  CityIntentSlug,
} from "@/types";

const intentTitle: Record<CityIntentSlug, string> = {
  "remote-work": "Remote Work",
  "family-life": "Family Life",
  "startup-ecosystem": "Startup Ecosystem",
  "clean-air": "Clean Air",
  "public-transport": "Public Transport",
};

export function getCityIntentTitle(slug: CityIntentSlug): string {
  return intentTitle[slug];
}

export const cityIntents: CityIntent[] = [
  {
    slug: "remote-work",
    title: "Remote work city intelligence guide",
    shortTitle: "Remote work",
    description:
      "Evaluate a city for remote-work relocation through connectivity, cost, transport, safety, and healthcare context — useful for comparison, not an official ranking.",
    relatedCollectionSlug: "best-cities-for-remote-workers",
    relatedModuleSlugs: ["internet-speed", "cost-of-living", "safety"],
    sourceIds: [
      "itu-connectivity",
      "ookla-speedtest",
      "numbeo-cost",
      "unodc-crime",
      "who",
    ],
    criteria: [
      {
        key: "connectivity",
        label: "Connectivity context",
        explanation:
          "Internet-speed module context informs day-to-day remote-work feasibility. Country-level digital-readiness references are used where city-level monitoring is unavailable.",
        sourceIds: ["itu-connectivity", "ookla-speedtest"],
      },
      {
        key: "cost",
        label: "Cost framing",
        explanation:
          "Cost-of-living module context supports directional affordability comparison. Cost numbers are directional; always verify for any specific decision.",
        sourceIds: ["numbeo-cost"],
      },
      {
        key: "transport",
        label: "Transport access",
        explanation:
          "Transport and mobility indicators surface day-to-day movement, including verified transport authority layers when available.",
      },
      {
        key: "safety",
        label: "Safety and public services",
        explanation:
          "Public safety module and country emergency profile help compare day-to-day operating context.",
        sourceIds: ["unodc-crime"],
      },
      {
        key: "healthcare",
        label: "Healthcare access",
        explanation:
          "Country and city healthcare layers attributed to official health authorities where available.",
        sourceIds: ["who"],
      },
    ],
  },
  {
    slug: "family-life",
    title: "Family life city intelligence guide",
    shortTitle: "Family life",
    description:
      "Compare a city through family-relevant context: safety, healthcare, public services, transport, and air quality — comparison-oriented, not an official ranking.",
    relatedCollectionSlug: "best-cities-for-families",
    relatedModuleSlugs: ["safety", "air-quality", "cost-of-living"],
    sourceIds: ["unodc-crime", "who", "oecd-health", "who-air", "un-habitat"],
    criteria: [
      {
        key: "safety",
        label: "Public safety",
        explanation:
          "Safety module and country emergency service profile, attributed to official publishers where verified.",
        sourceIds: ["unodc-crime"],
      },
      {
        key: "healthcare",
        label: "Healthcare access",
        explanation:
          "Country and city healthcare profiles plus international references such as WHO and OECD for system framing.",
        sourceIds: ["who", "oecd-health"],
      },
      {
        key: "air_quality",
        label: "Air quality",
        explanation:
          "Air-quality indicators framed against WHO and regional guidelines. Numbers are directional, not exact.",
        sourceIds: ["who-air"],
      },
      {
        key: "transport",
        label: "Public transport",
        explanation:
          "Transport module context plus verified transport authority and operator references where available.",
      },
      {
        key: "public_services",
        label: "Livability and public services",
        explanation:
          "Affordability, energy, and resilience module context surface alongside structured city intelligence.",
      },
    ],
  },
  {
    slug: "startup-ecosystem",
    title: "Startup ecosystem city intelligence guide",
    shortTitle: "Startup ecosystem",
    description:
      "Compare a city's startup and business context through connectivity, infrastructure, transport, and international hub positioning — comparison-oriented, not an official ranking.",
    relatedCollectionSlug: "best-cities-for-startups",
    relatedModuleSlugs: ["internet-speed", "energy", "cost-of-living"],
    sourceIds: [
      "itu-connectivity",
      "ookla-speedtest",
      "iea-cities",
      "numbeo-cost",
      "un-habitat",
    ],
    criteria: [
      {
        key: "connectivity",
        label: "Connectivity and digital readiness",
        explanation:
          "Internet-speed module and country-level digital-development references.",
        sourceIds: ["itu-connectivity", "ookla-speedtest"],
      },
      {
        key: "transport",
        label: "Transport and hub positioning",
        explanation:
          "Verified transport authority and operator layers where available, supporting intra-city and international comparison.",
      },
      {
        key: "energy",
        label: "Energy readiness",
        explanation:
          "Energy module context references IEA urban transition framing for cities operating energy-intensive infrastructure.",
        sourceIds: ["iea-cities"],
      },
      {
        key: "cost",
        label: "Cost framing",
        explanation:
          "Cost-of-living module context supports directional affordability comparison.",
        sourceIds: ["numbeo-cost"],
      },
      {
        key: "safety",
        label: "Safety and stability",
        explanation:
          "Safety module and verified country emergency profile support day-to-day operating comparison.",
      },
    ],
  },
  {
    slug: "clean-air",
    title: "Clean air city intelligence guide",
    shortTitle: "Clean air",
    description:
      "Compare a city through air-quality context referenced against WHO and regional guidelines — comparison-oriented, not a ranked claim of cleanest air.",
    relatedCollectionSlug: "best-cities-for-clean-air",
    relatedModuleSlugs: ["air-quality", "climate-risk", "energy"],
    sourceIds: [
      "who-air",
      "eea-air",
      "epa-naaqs",
      "ipcc-urban",
      "iea-cities",
    ],
    criteria: [
      {
        key: "air_quality",
        label: "Air quality coverage",
        explanation:
          "Air-quality module referencing WHO global air-quality guidelines and applicable regional standards such as EEA and EPA context.",
        sourceIds: ["who-air", "eea-air", "epa-naaqs"],
      },
      {
        key: "climate",
        label: "Climate and resilience context",
        explanation:
          "Climate-risk module context for urban environment framing alongside air quality.",
        sourceIds: ["ipcc-urban"],
      },
      {
        key: "energy",
        label: "Energy mix context",
        explanation:
          "Energy module references IEA urban transition framing, which shapes long-term air-quality outcomes.",
        sourceIds: ["iea-cities"],
      },
      {
        key: "transport",
        label: "Public transport access",
        explanation:
          "Strong public transport context often correlates with lower direct vehicle emissions; verified transport layers are surfaced where available.",
      },
    ],
  },
  {
    slug: "public-transport",
    title: "Public transport city intelligence guide",
    shortTitle: "Public transport",
    description:
      "Compare a city through public-transport and mobility context referenced against verified transport authority and operator layers where available.",
    relatedCollectionSlug: "best-cities-for-public-transport",
    relatedModuleSlugs: ["air-quality", "safety", "climate-risk"],
    sourceIds: ["un-habitat", "ipcc-urban", "who-air", "unodc-crime"],
    criteria: [
      {
        key: "transport_authority",
        label: "Transport authority coverage",
        explanation:
          "Verified country or city transport authority and operator layers attributed to official sources where available.",
      },
      {
        key: "metro_rail",
        label: "Metro and rail context",
        explanation:
          "Metro and rail operators linked through verified transport layers where the operator publishes official public information.",
      },
      {
        key: "airports",
        label: "Airport and aviation context",
        explanation:
          "Airport profiles attributed to verified aviation authority and operator references where available.",
      },
      {
        key: "safety",
        label: "Safety overlap",
        explanation:
          "Safety module context lets users compare transport alongside personal-safety considerations.",
        sourceIds: ["unodc-crime"],
      },
      {
        key: "air_quality",
        label: "Air quality and climate overlap",
        explanation:
          "Strong public transport context often appears in climate and air-quality conversations; module pages provide structured context for further comparison.",
        sourceIds: ["who-air", "ipcc-urban"],
      },
    ],
  },
];

interface CityIntentSeed {
  citySlug: string;
  intentSlug: CityIntentSlug;
  summary: string;
  criteriaNotes?: Record<string, string>;
  relatedComparisonSlugs?: string[];
}

const seeds: CityIntentSeed[] = [
  // Remote work
  {
    citySlug: "lisbon",
    intentSlug: "remote-work",
    summary:
      "Lisbon's profile is often referenced for remote-work relocation. Structured intelligence covers connectivity, cost framing, transport access, safety context, and healthcare references.",
    relatedComparisonSlugs: ["lisbon-vs-prague"],
  },
  {
    citySlug: "berlin",
    intentSlug: "remote-work",
    summary:
      "Berlin offers structured connectivity context, verified BVG, Deutsche Bahn, and BER transport references, and country-level emergency and healthcare profiles to support relocation orientation.",
    relatedComparisonSlugs: ["berlin-vs-amsterdam", "berlin-vs-london"],
  },
  {
    citySlug: "amsterdam",
    intentSlug: "remote-work",
    summary:
      "Amsterdam combines verified GVB, NS, and Schiphol context with structured cost framing and Dutch public-health references for remote-work comparison.",
    relatedComparisonSlugs: ["berlin-vs-amsterdam"],
  },
  {
    citySlug: "barcelona",
    intentSlug: "remote-work",
    summary:
      "Barcelona supports remote-work comparison through cost framing, Mediterranean climate context, and structured intelligence across safety and healthcare references.",
    relatedComparisonSlugs: ["madrid-vs-barcelona"],
  },
  {
    citySlug: "bangkok",
    intentSlug: "remote-work",
    summary:
      "Bangkok is often considered for affordability-focused remote-work comparison. Structured intelligence supports orientation, with verified utility layers used where available.",
    relatedComparisonSlugs: ["bangkok-vs-kuala-lumpur"],
  },
  {
    citySlug: "singapore",
    intentSlug: "remote-work",
    summary:
      "Singapore includes verified emergency, healthcare, aviation, and transport authority context at country and city levels, supporting detailed remote-work comparison.",
    relatedComparisonSlugs: ["tokyo-vs-singapore", "hong-kong-vs-singapore"],
  },
  {
    citySlug: "toronto",
    intentSlug: "remote-work",
    summary:
      "Toronto's profile includes verified healthcare, TTC transport, and Pearson aviation context, supported by Canadian federal emergency and health references.",
    relatedComparisonSlugs: ["new-york-vs-toronto", "vancouver-vs-toronto"],
  },
  {
    citySlug: "mexico-city",
    intentSlug: "remote-work",
    summary:
      "Mexico City supports Latin-American remote-work comparison through structured cost and connectivity context, with transparent fallback states where verified local data is unavailable.",
    relatedComparisonSlugs: ["mexico-city-vs-bogota"],
  },

  // Family life
  {
    citySlug: "copenhagen",
    intentSlug: "family-life",
    summary:
      "Copenhagen surfaces verified Danish emergency, Sundhedsstyrelsen, and metro/airport context, supporting family-relevant comparison through transport, safety, and healthcare references.",
  },
  {
    citySlug: "stockholm",
    intentSlug: "family-life",
    summary:
      "Stockholm's profile includes structured intelligence across public services, safety, and country-level healthcare context, supporting family-life orientation.",
    relatedComparisonSlugs: ["stockholm-vs-oslo"],
  },
  {
    citySlug: "oslo",
    intentSlug: "family-life",
    summary:
      "Oslo offers a useful Nordic family-life comparison anchor with structured safety, healthcare, and climate context.",
    relatedComparisonSlugs: ["stockholm-vs-oslo"],
  },
  {
    citySlug: "vienna",
    intentSlug: "family-life",
    summary:
      "Vienna supports family-relevant comparison through transport, safety, and quality-of-life context.",
    relatedComparisonSlugs: ["vienna-vs-zurich"],
  },
  {
    citySlug: "zurich",
    intentSlug: "family-life",
    summary:
      "Zurich offers structured safety, transport, and country-level healthcare context for family-life comparison.",
    relatedComparisonSlugs: ["vienna-vs-zurich"],
  },
  {
    citySlug: "singapore",
    intentSlug: "family-life",
    summary:
      "Singapore combines verified MOH, SPF, SCDF, LTA, and Changi context with structured intelligence to support family-relevant comparison.",
  },
  {
    citySlug: "toronto",
    intentSlug: "family-life",
    summary:
      "Toronto includes verified Canadian healthcare, TTC transport, and federal emergency context, supporting North-American family comparison.",
  },
  {
    citySlug: "amsterdam",
    intentSlug: "family-life",
    summary:
      "Amsterdam's compact, transit-rich profile pairs with verified Dutch healthcare and transport context for family-life orientation.",
    relatedComparisonSlugs: ["berlin-vs-amsterdam"],
  },

  // Startup ecosystem
  {
    citySlug: "san-francisco",
    intentSlug: "startup-ecosystem",
    summary:
      "San Francisco is frequently considered for startup activity. Structured intelligence covers connectivity, transport context, and cost framing without inventing funding or talent metrics.",
  },
  {
    citySlug: "new-york",
    intentSlug: "startup-ecosystem",
    summary:
      "New York's profile includes verified MTA and Port Authority context, supporting startup and business comparison alongside structured cost intelligence.",
    relatedComparisonSlugs: ["new-york-vs-toronto", "new-york-vs-london"],
  },
  {
    citySlug: "london",
    intentSlug: "startup-ecosystem",
    summary:
      "London surfaces verified Transport for London, Network Rail, and Heathrow context for international hub comparison.",
    relatedComparisonSlugs: ["london-vs-paris", "new-york-vs-london"],
  },
  {
    citySlug: "berlin",
    intentSlug: "startup-ecosystem",
    summary:
      "Berlin combines verified BVG, Deutsche Bahn, and BER context with structured connectivity and cost intelligence for startup-hub comparison.",
    relatedComparisonSlugs: ["berlin-vs-amsterdam", "berlin-vs-london"],
  },
  {
    citySlug: "singapore",
    intentSlug: "startup-ecosystem",
    summary:
      "Singapore includes verified emergency, healthcare, aviation, and transport authority context across country and city scope, supporting startup-hub comparison.",
    relatedComparisonSlugs: ["dubai-vs-singapore", "hong-kong-vs-singapore"],
  },
  {
    citySlug: "toronto",
    intentSlug: "startup-ecosystem",
    summary:
      "Toronto includes verified Canadian healthcare, TTC transport, and Pearson aviation context, supporting North-American startup-hub comparison.",
  },
  {
    citySlug: "amsterdam",
    intentSlug: "startup-ecosystem",
    summary:
      "Amsterdam combines verified GVB, NS, and Schiphol context with structured intelligence for European startup-hub comparison.",
  },
  {
    citySlug: "paris",
    intentSlug: "startup-ecosystem",
    summary:
      "Paris surfaces verified IDFM, RATP, SNCF, and Paris Aéroport context to support international startup-hub comparison.",
    relatedComparisonSlugs: ["london-vs-paris", "paris-vs-new-york"],
  },

  // Clean air
  {
    citySlug: "copenhagen",
    intentSlug: "clean-air",
    summary:
      "Copenhagen pairs structured air-quality context with verified Danish transport references that support day-to-day mobility framing.",
  },
  {
    citySlug: "stockholm",
    intentSlug: "clean-air",
    summary:
      "Stockholm's air-quality module sits alongside Nordic climate and resilience signals for transparent comparison.",
  },
  {
    citySlug: "oslo",
    intentSlug: "clean-air",
    summary:
      "Oslo supports air-quality comparison through structured city intelligence and country-level transport references.",
  },
  {
    citySlug: "helsinki",
    intentSlug: "clean-air",
    summary:
      "Helsinki is a Nordic comparison anchor with structured air-quality and climate-risk module context.",
  },
  {
    citySlug: "zurich",
    intentSlug: "clean-air",
    summary:
      "Zurich pairs air-quality module context with structured Swiss country-level intelligence for comparison.",
  },
  {
    citySlug: "vienna",
    intentSlug: "clean-air",
    summary:
      "Vienna is a Central-European anchor with structured air-quality and resilience context.",
  },
  {
    citySlug: "auckland",
    intentSlug: "clean-air",
    summary:
      "Auckland offers a Pacific air-quality anchor with structured climate-risk module context.",
  },
  {
    citySlug: "wellington",
    intentSlug: "clean-air",
    summary:
      "Wellington is a Pacific anchor with structured air-quality and climate-risk context.",
  },

  // Public transport
  {
    citySlug: "tokyo",
    intentSlug: "public-transport",
    summary:
      "Tokyo surfaces verified Tokyo Metro, MLIT, Haneda, and Narita context, supporting detailed mobility comparison.",
    relatedComparisonSlugs: ["tokyo-vs-singapore", "seoul-vs-tokyo"],
  },
  {
    citySlug: "singapore",
    intentSlug: "public-transport",
    summary:
      "Singapore's profile includes verified LTA, CAAS, and Changi context for public-transport comparison.",
  },
  {
    citySlug: "london",
    intentSlug: "public-transport",
    summary:
      "London surfaces verified Transport for London, Network Rail, and Heathrow context for public-transport comparison.",
  },
  {
    citySlug: "paris",
    intentSlug: "public-transport",
    summary:
      "Paris surfaces verified IDFM, RATP, SNCF, and Paris Aéroport context to support public-transport comparison.",
  },
  {
    citySlug: "berlin",
    intentSlug: "public-transport",
    summary:
      "Berlin surfaces verified BVG, Deutsche Bahn, and BER context for public-transport comparison.",
  },
  {
    citySlug: "amsterdam",
    intentSlug: "public-transport",
    summary:
      "Amsterdam pairs verified GVB, NS, and Schiphol context with structured cost and safety intelligence.",
  },
  {
    citySlug: "seoul",
    intentSlug: "public-transport",
    summary:
      "Seoul is an East-Asian public-transport anchor with structured intelligence and country-level emergency context.",
  },
  {
    citySlug: "zurich",
    intentSlug: "public-transport",
    summary:
      "Zurich is a European public-transport anchor with structured city intelligence and country-level context.",
  },

  // Expansion batch: 15 curated intent pages for cities added to the
  // expansion shortlist (Baltics, North-American secondary metros,
  // Korean / Japanese / Latin-American peers). Each entry reuses the
  // existing intent slug and links to the relevant curated comparison
  // pages without inventing scores, costs, AQI, or transport facts.

  // Remote work
  {
    citySlug: "tallinn",
    intentSlug: "remote-work",
    summary:
      "Tallinn is a Baltic EU capital often cited for digital-services context and useful to compare for remote-work relocation. Structured city intelligence covers cost framing, transport access, country-level public-service profiles, and source-backed references where available.",
    relatedComparisonSlugs: ["tallinn-vs-riga"],
  },
  {
    citySlug: "riga",
    intentSlug: "remote-work",
    summary:
      "Riga is a compact Baltic EU capital useful to compare for remote-work planning. Structured intelligence covers cost framing, connectivity context, transport access, and country-level public-service references.",
    relatedComparisonSlugs: ["tallinn-vs-riga", "riga-vs-vilnius"],
  },
  {
    citySlug: "chiang-mai",
    intentSlug: "remote-work",
    summary:
      "Chiang Mai is a Northern-Thai metro frequently included in remote-work shortlists. Structured intelligence covers cost framing, country-level transport and healthcare context, and seasonal air-quality dynamics that benefit from honest comparison framing.",
    relatedComparisonSlugs: ["chiang-mai-vs-bangkok"],
  },

  // Family life
  {
    citySlug: "adelaide",
    intentSlug: "family-life",
    summary:
      "Adelaide is a compact Australian metro often cited for quality-of-life context and useful to compare for family-life planning. Structured intelligence covers public-service references, country-level healthcare context, and transport access.",
    relatedComparisonSlugs: ["adelaide-vs-melbourne"],
  },
  {
    citySlug: "christchurch",
    intentSlug: "family-life",
    summary:
      "Christchurch is a South-Island New Zealand metro with active urban-renewal context and useful to compare for family-life planning. Structured intelligence covers country-level public-service references and seismic-resilience framing.",
    relatedComparisonSlugs: ["christchurch-vs-auckland"],
  },
  {
    citySlug: "montreal",
    intentSlug: "family-life",
    summary:
      "Montreal is a bilingual Canadian metro with deep cultural depth and useful to compare for family-life planning. Structured intelligence covers verified Canadian country-level healthcare and emergency references plus transport access.",
    relatedComparisonSlugs: ["montreal-vs-toronto", "montreal-vs-calgary"],
  },

  // Startup ecosystem
  {
    citySlug: "boston",
    intentSlug: "startup-ecosystem",
    summary:
      "Boston is a US East-Coast metro anchored by universities and life-sciences activity, useful to compare for startup-context review through structured connectivity, transport, and country-level references.",
    relatedComparisonSlugs: ["boston-vs-washington-dc", "boston-vs-new-york"],
  },
  {
    citySlug: "austin",
    intentSlug: "startup-ecosystem",
    summary:
      "Austin is a fast-growing Texan metro with a strong technology economy, useful to compare for startup-context review through cost framing, connectivity, and country-level intelligence.",
    relatedComparisonSlugs: ["miami-vs-austin", "dallas-vs-austin"],
  },
  {
    citySlug: "washington-dc",
    intentSlug: "startup-ecosystem",
    summary:
      "Washington DC is the US capital region with high institutional density, useful to compare for policy-and-services-oriented startup review through structured intelligence and country-level context.",
    relatedComparisonSlugs: [
      "boston-vs-washington-dc",
      "washington-dc-vs-new-york",
    ],
  },

  // Clean air
  {
    citySlug: "tallinn",
    intentSlug: "clean-air",
    summary:
      "Tallinn is a Baltic EU comparison anchor for air-quality context, with EU monitoring framing and the platform's transparent fallback while city-level measurements are integrated.",
    relatedComparisonSlugs: ["tallinn-vs-riga"],
  },
  {
    citySlug: "riga",
    intentSlug: "clean-air",
    summary:
      "Riga is a Baltic EU comparison anchor for air-quality context. Structured intelligence references WHO and EEA benchmarks; verified city-level measurements appear in the air-quality dataset section when integrated.",
    relatedComparisonSlugs: ["tallinn-vs-riga", "riga-vs-vilnius"],
  },
  {
    citySlug: "ljubljana",
    intentSlug: "clean-air",
    summary:
      "Ljubljana is an Alpine-adjacent EU comparison anchor for air-quality context, useful alongside other Central-European capitals. Structured intelligence references WHO and EEA benchmarks; verified city-level measurements appear when integrated.",
    relatedComparisonSlugs: ["ljubljana-vs-zagreb"],
  },

  // Public transport
  {
    citySlug: "busan",
    intentSlug: "public-transport",
    summary:
      "Busan is South Korea's second metro and a major Pacific port, useful to compare for cross-region Korean public-transport context through structured intelligence and country-level references.",
    relatedComparisonSlugs: ["busan-vs-seoul"],
  },
  {
    citySlug: "fukuoka",
    intentSlug: "public-transport",
    summary:
      "Fukuoka is a compact Kyushu Japanese metro useful to compare for cross-Japan public-transport context. Structured intelligence covers country-level transport references and city-scale mobility framing.",
    relatedComparisonSlugs: ["fukuoka-vs-osaka"],
  },
  {
    citySlug: "montreal",
    intentSlug: "public-transport",
    summary:
      "Montreal is a Canadian bilingual metro useful to compare for cross-Canada public-transport context, with structured intelligence covering metro and country-level transport references.",
    relatedComparisonSlugs: ["montreal-vs-toronto", "montreal-vs-calgary"],
  },
];

export const cityIntentPages: CityIntentPage[] = seeds.map((seed) => {
  const intent = cityIntents.find((entry) => entry.slug === seed.intentSlug);
  if (!intent) {
    throw new Error(`Unknown intent slug: ${seed.intentSlug}`);
  }

  return {
    citySlug: seed.citySlug,
    intentSlug: seed.intentSlug,
    title: `${seed.citySlug} ${intent.shortTitle}`,
    intro: seed.summary,
    summary: seed.summary,
    criteriaNotes: seed.criteriaNotes ?? {},
    updatedDate: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: intent.sourceIds,
    relatedComparisonSlugs: seed.relatedComparisonSlugs,
    relatedCollectionSlugs: intent.relatedCollectionSlug
      ? [intent.relatedCollectionSlug]
      : undefined,
  };
});
