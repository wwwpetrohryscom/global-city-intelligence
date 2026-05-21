import { DATA_YEAR } from "@/lib/data/constants";
import type { ArrivalChecklistItem, ArrivalPage } from "@/types";

/**
 * Curated city arrival planning pages. Every entry references an
 * existing city slug from `lib/data/cities.ts` and existing source IDs
 * from `lib/data/sources/`. No airport names, no transfer routes, no
 * fares, no schedules — only neutral arrival planning context that
 * routes users back to the platform's structured city / transport /
 * safety / healthcare / tools layers.
 *
 * Add a new arrival page only when:
 *  - the city already exists in the registry
 *  - the description can be written neutrally (no fabricated transport
 *    or airport details)
 *  - the source IDs already exist in the source registry
 */

const UPDATED_DATE = "2026-05-21";

const COMMON_SOURCES: readonly string[] = [
  "un-habitat",
  "nasa-power",
  "ipcc-urban",
];

function arrivalSources(extra: readonly string[] = []): string[] {
  return Array.from(new Set([...COMMON_SOURCES, ...extra]));
}

export const arrivalPages: ArrivalPage[] = [
  // ===== Europe / UK / Ireland (16) =====
  {
    citySlug: "london",
    title: "Arriving in London: City Arrival Planning Guide",
    summary:
      "Use this guide alongside the London city profile, UK country hub, public-safety context, healthcare access notes, and verified transport-authority references to prepare your first day in the city.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air", "itu-connectivity"]),
  },
  {
    citySlug: "paris",
    title: "Arriving in Paris: City Arrival Planning Guide",
    summary:
      "Plan your first day in Paris with city intelligence, country hub context, public-safety references, healthcare access notes, and links to verified mobility context for the metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "berlin",
    title: "Arriving in Berlin: City Arrival Planning Guide",
    summary:
      "Berlin arrival context covering city intelligence links, German country hub references, public-safety background, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "amsterdam",
    title: "Arriving in Amsterdam: City Arrival Planning Guide",
    summary:
      "Prepare for arrival in Amsterdam using the city profile, Netherlands country hub, public-safety context, healthcare access references, and verified mobility-authority links for the metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "madrid",
    title: "Arriving in Madrid: City Arrival Planning Guide",
    summary:
      "Arrival planning context for Madrid covering city intelligence, Spanish country hub references, public-safety background, healthcare access notes, and links to verified mobility context where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "barcelona",
    title: "Arriving in Barcelona: City Arrival Planning Guide",
    summary:
      "Prepare your arrival in Barcelona with the city profile, Spanish country hub, public-safety references, healthcare access notes, and verified mobility context for the metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "rome",
    title: "Arriving in Rome: City Arrival Planning Guide",
    summary:
      "Use this Rome arrival page with the city intelligence profile, Italian country hub, public-safety references, healthcare access context, and links to verified mobility information where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "milan",
    title: "Arriving in Milan: City Arrival Planning Guide",
    summary:
      "Plan your first day in Milan using the city profile, Italian country hub, public-safety references, healthcare access notes, and verified mobility context for the metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "lisbon",
    title: "Arriving in Lisbon: City Arrival Planning Guide",
    summary:
      "Arrival planning context for Lisbon with the city intelligence profile, Portuguese country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "remote_work_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air", "itu-connectivity"]),
  },
  {
    citySlug: "porto",
    title: "Arriving in Porto: City Arrival Planning Guide",
    summary:
      "Plan your first day in Porto using the city intelligence profile, Portuguese country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "remote_work_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air", "itu-connectivity"]),
  },
  {
    citySlug: "vienna",
    title: "Arriving in Vienna: City Arrival Planning Guide",
    summary:
      "Vienna arrival context covering city intelligence links, Austrian country hub, public-safety references, healthcare access notes, and links to verified mobility context where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "zurich",
    title: "Arriving in Zurich: City Arrival Planning Guide",
    summary:
      "Prepare for arrival in Zurich with the city profile, Swiss country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "business_travel",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "copenhagen",
    title: "Arriving in Copenhagen: City Arrival Planning Guide",
    summary:
      "Plan your first day in Copenhagen with the city intelligence profile, Danish country hub, public-safety references, healthcare access notes, and verified mobility context for the metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "stockholm",
    title: "Arriving in Stockholm: City Arrival Planning Guide",
    summary:
      "Stockholm arrival context covering city intelligence, Swedish country hub, public-safety references, healthcare access notes, and verified mobility-authority context where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "dublin",
    title: "Arriving in Dublin: City Arrival Planning Guide",
    summary:
      "Plan your first day in Dublin using the city intelligence profile, Irish country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "business_travel",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "edinburgh",
    title: "Arriving in Edinburgh: City Arrival Planning Guide",
    summary:
      "Edinburgh arrival context covering city intelligence, UK country hub references, public-safety background, healthcare access notes, and verified mobility context for the metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  // ===== United States (10) =====
  {
    citySlug: "new-york",
    title: "Arriving in New York: City Arrival Planning Guide",
    summary:
      "Prepare for arrival in New York with the city intelligence profile, United States country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "los-angeles",
    title: "Arriving in Los Angeles: City Arrival Planning Guide",
    summary:
      "Plan your first day in Los Angeles using the city profile, United States country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "san-francisco",
    title: "Arriving in San Francisco: City Arrival Planning Guide",
    summary:
      "San Francisco arrival context covering city intelligence, United States country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Bay Area.",
    arrivalFocus: "business_travel",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "chicago",
    title: "Arriving in Chicago: City Arrival Planning Guide",
    summary:
      "Prepare for arrival in Chicago with the city profile, United States country hub, public-safety references, healthcare access notes, and verified mobility context for the metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "boston",
    title: "Arriving in Boston: City Arrival Planning Guide",
    summary:
      "Boston arrival context covering city intelligence, United States country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "business_travel",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "washington-dc",
    title: "Arriving in Washington, DC: City Arrival Planning Guide",
    summary:
      "Plan your first day in Washington, DC using the city intelligence profile, United States country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "business_travel",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "miami",
    title: "Arriving in Miami: City Arrival Planning Guide",
    summary:
      "Miami arrival context covering city intelligence, United States country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "austin",
    title: "Arriving in Austin: City Arrival Planning Guide",
    summary:
      "Plan your first day in Austin using the city profile, United States country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "remote_work_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs", "itu-connectivity"]),
  },
  {
    citySlug: "seattle",
    title: "Arriving in Seattle: City Arrival Planning Guide",
    summary:
      "Seattle arrival context covering city intelligence, United States country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "denver",
    title: "Arriving in Denver: City Arrival Planning Guide",
    summary:
      "Plan your first day in Denver using the city profile, United States country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  // ===== Canada (4) =====
  {
    citySlug: "toronto",
    title: "Arriving in Toronto: City Arrival Planning Guide",
    summary:
      "Prepare for arrival in Toronto using the city profile, Canadian country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the metro region.",
    arrivalFocus: "relocation_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["canada-emergency"]),
  },
  {
    citySlug: "vancouver",
    title: "Arriving in Vancouver: City Arrival Planning Guide",
    summary:
      "Vancouver arrival context covering city intelligence, Canadian country hub, public-safety references, healthcare access notes, and verified mobility context for the metro region.",
    arrivalFocus: "relocation_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["canada-emergency"]),
  },
  {
    citySlug: "montreal",
    title: "Arriving in Montreal: City Arrival Planning Guide",
    summary:
      "Plan your first day in Montreal using the city profile, Canadian country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "relocation_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["canada-emergency"]),
  },
  {
    citySlug: "ottawa",
    title: "Arriving in Ottawa: City Arrival Planning Guide",
    summary:
      "Ottawa arrival context covering city intelligence, Canadian country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "business_travel",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["canada-emergency"]),
  },
  // ===== Australia / New Zealand (6) =====
  {
    citySlug: "sydney",
    title: "Arriving in Sydney: City Arrival Planning Guide",
    summary:
      "Prepare for arrival in Sydney using the city profile, Australian country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["triple-zero-au"]),
  },
  {
    citySlug: "melbourne",
    title: "Arriving in Melbourne: City Arrival Planning Guide",
    summary:
      "Melbourne arrival context covering city intelligence, Australian country hub, public-safety references, healthcare access notes, and verified mobility context for the metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["triple-zero-au"]),
  },
  {
    citySlug: "brisbane",
    title: "Arriving in Brisbane: City Arrival Planning Guide",
    summary:
      "Plan your first day in Brisbane using the city profile, Australian country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["triple-zero-au"]),
  },
  {
    citySlug: "perth",
    title: "Arriving in Perth: City Arrival Planning Guide",
    summary:
      "Perth arrival context covering city intelligence, Australian country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["triple-zero-au"]),
  },
  {
    citySlug: "auckland",
    title: "Arriving in Auckland: City Arrival Planning Guide",
    summary:
      "Plan your first day in Auckland using the city profile, New Zealand country hub, public-safety references, healthcare access notes, and verified mobility context for the metro region.",
    arrivalFocus: "relocation_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["nz-police-111"]),
  },
  {
    citySlug: "wellington",
    title: "Arriving in Wellington: City Arrival Planning Guide",
    summary:
      "Wellington arrival context covering city intelligence, New Zealand country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["nz-police-111"]),
  },
  // ===== Asia / global hubs (5) =====
  {
    citySlug: "singapore",
    title: "Arriving in Singapore: City Arrival Planning Guide",
    summary:
      "Prepare for arrival in Singapore using the city profile, Singapore country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the city-state.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["spf-singapore", "scdf-singapore"]),
  },
  {
    citySlug: "tokyo",
    title: "Arriving in Tokyo: City Arrival Planning Guide",
    summary:
      "Plan your first day in Tokyo using the city intelligence profile, Japan country hub, public-safety references, healthcare access notes, and verified mobility context for the metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["npa-japan"]),
  },
  {
    citySlug: "seoul",
    title: "Arriving in Seoul: City Arrival Planning Guide",
    summary:
      "Seoul arrival context covering city intelligence, South Korean country hub, public-safety references, healthcare access notes, and verified mobility context for the metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["who-air"]),
  },
  {
    citySlug: "hong-kong",
    title: "Arriving in Hong Kong: City Arrival Planning Guide",
    summary:
      "Prepare for arrival in Hong Kong using the city profile, Hong Kong country hub, public-safety references, healthcare access notes, and verified mobility context for the region.",
    arrivalFocus: "business_travel",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["who-air"]),
  },
  {
    citySlug: "dubai",
    title: "Arriving in Dubai: City Arrival Planning Guide",
    summary:
      "Dubai arrival context covering city intelligence, United Arab Emirates country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "business_travel",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["who-air"]),
  },
];

/**
 * Shared neutral arrival checklist. Items reference structured
 * platform sections and official sources rather than fabricating
 * timetables, fares, or operator names. Rendered as semantic lists
 * inside ArrivalChecklist.
 */
export const arrivalChecklist: ArrivalChecklistItem[] = [
  {
    label: "Review the city intelligence profile",
    description:
      "Open the city profile for directional context across affordability, air quality, safety, transport, and healthcare modules before arrival.",
    category: "before",
  },
  {
    label: "Review the country intelligence hub",
    description:
      "The country hub surfaces verified emergency contact, healthcare access, and transport profiles where official-source data is on file — and a transparent fallback where it is not.",
    category: "before",
  },
  {
    label: "Save the country's verified emergency context",
    description:
      "When the country emergency profile is verified, save the linked official emergency-service numbers and authority pages locally. Always confirm current numbers with the official local service.",
    category: "safety",
  },
  {
    label: "Review verified healthcare access references",
    description:
      "Open the country healthcare profile and any verified hospital registry references. Pair them with official insurance and access documentation from authoritative sources before travel.",
    category: "healthcare",
  },
  {
    label: "Open the city transport / mobility profile",
    description:
      "Use the platform's verified city mobility or country transport profile to identify official authorities. Confirm routes, fares, and schedules through those official authorities — not from this guide.",
    category: "transport",
  },
  {
    label: "Plan an initial budget with platform calculators",
    description:
      "Use the travel budget calculator for shorter stays or the cost of living calculator for longer ones. Both calculators use your own inputs and do not import live prices.",
    category: "budget",
  },
  {
    label: "Prepare documents using official government sources",
    description:
      "Confirm visa, residence, and customs requirements directly with official government publishers for your nationality and travel purpose. This guide is not legal or immigration advice.",
    category: "before",
  },
  {
    label: "Confirm your arrival address and route in advance",
    description:
      "Save the destination address, an offline map, and a backup direction in case connectivity is limited on arrival.",
    category: "first_day",
  },
  {
    label: "Keep a payment-method backup",
    description:
      "Carry one backup payment method appropriate for the country and notify your bank of travel where required.",
    category: "first_day",
  },
  {
    label: "Share an arrival plan with a trusted contact",
    description:
      "Share your arrival flight or train, accommodation address, and an expected check-in time with someone you trust before you travel.",
    category: "first_day",
  },
  {
    label: "Identify the official transport information source",
    description:
      "From the city transport profile or country transport profile, save the link to the official mobility authority responsible for the local network. Use that source for live information.",
    category: "transport",
  },
  {
    label: "Keep an emergency buffer in your budget",
    description:
      "Plan a small emergency buffer for delays, changes, or unforeseen healthcare or transport costs. The travel budget calculator includes an emergency buffer line for this.",
    category: "budget",
  },
];

const ARRIVAL_FOCUS_LABEL: Record<ArrivalPage["arrivalFocus"], string> = {
  general_arrival: "General arrival",
  airport_arrival: "Airport arrival",
  rail_arrival: "Rail arrival",
  relocation_arrival: "Relocation arrival",
  business_travel: "Business travel",
  family_arrival: "Family arrival",
  remote_work_arrival: "Remote-work arrival",
};

export function getArrivalFocusLabel(
  focus: ArrivalPage["arrivalFocus"],
): string {
  return ARRIVAL_FOCUS_LABEL[focus];
}
