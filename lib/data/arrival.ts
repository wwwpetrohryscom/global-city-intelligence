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
const BATCH_3_UPDATED_DATE = "2026-05-23";
const BATCH_4_UPDATED_DATE = "2026-05-23";

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
  // ===== Second arrival batch: Europe / EU (20) =====
  {
    citySlug: "valencia",
    title: "Arriving in Valencia: City Arrival Planning Guide",
    summary:
      "Valencia arrival context with city intelligence, Spanish country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the metropolitan region where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "seville",
    title: "Arriving in Seville: City Arrival Planning Guide",
    summary:
      "Plan your first day in Seville using the city intelligence profile, Spanish country hub, public-safety references, healthcare access notes, and verified mobility context for the Andalusian region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "bilbao",
    title: "Arriving in Bilbao: City Arrival Planning Guide",
    summary:
      "Bilbao arrival context covering city intelligence, Spanish country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Basque metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "bologna",
    title: "Arriving in Bologna: City Arrival Planning Guide",
    summary:
      "Plan your first day in Bologna using the city intelligence profile, Italian country hub, public-safety references, healthcare access notes, and verified mobility context for the Emilia-Romagna region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "florence",
    title: "Arriving in Florence: City Arrival Planning Guide",
    summary:
      "Florence arrival context covering city intelligence, Italian country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Tuscany region where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "naples",
    title: "Arriving in Naples: City Arrival Planning Guide",
    summary:
      "Plan your first day in Naples using the city intelligence profile, Italian country hub, public-safety references, healthcare access notes, and verified mobility context for the Campania region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "krakow",
    title: "Arriving in Kraków: City Arrival Planning Guide",
    summary:
      "Kraków arrival context covering city intelligence, Polish country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the metropolitan region where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "gdansk",
    title: "Arriving in Gdańsk: City Arrival Planning Guide",
    summary:
      "Plan your first day in the Gdańsk Tricity metro using the city intelligence profile, Polish country hub, public-safety references, healthcare access notes, and verified mobility context where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "wroclaw",
    title: "Arriving in Wrocław: City Arrival Planning Guide",
    summary:
      "Wrocław arrival context covering city intelligence, Polish country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the metropolitan region where available.",
    arrivalFocus: "remote_work_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air", "itu-connectivity"]),
  },
  {
    citySlug: "antwerp",
    title: "Arriving in Antwerp: City Arrival Planning Guide",
    summary:
      "Plan your first day in Antwerp using the city intelligence profile, Belgian country hub, public-safety references, healthcare access notes, and verified mobility context for the Flemish port region.",
    arrivalFocus: "business_travel",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "rotterdam",
    title: "Arriving in Rotterdam: City Arrival Planning Guide",
    summary:
      "Rotterdam arrival context covering city intelligence, Dutch country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Rijnmond port region where available.",
    arrivalFocus: "business_travel",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "utrecht",
    title: "Arriving in Utrecht: City Arrival Planning Guide",
    summary:
      "Plan your first day in Utrecht using the city intelligence profile, Dutch country hub, public-safety references, healthcare access notes, and verified mobility context for the central-Netherlands rail hub.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "geneva",
    title: "Arriving in Geneva: City Arrival Planning Guide",
    summary:
      "Geneva arrival context covering city intelligence, Swiss country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the cross-border Lake-Geneva region.",
    arrivalFocus: "business_travel",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "basel",
    title: "Arriving in Basel: City Arrival Planning Guide",
    summary:
      "Plan your first day in Basel using the city intelligence profile, Swiss country hub, public-safety references, healthcare access notes, and verified mobility context for the tri-national Rhine metropolitan region.",
    arrivalFocus: "business_travel",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "athens",
    title: "Arriving in Athens: City Arrival Planning Guide",
    summary:
      "Athens arrival context covering city intelligence, Greek country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Attica metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "budapest",
    title: "Arriving in Budapest: City Arrival Planning Guide",
    summary:
      "Plan your first day in Budapest using the city intelligence profile, Hungarian country hub, public-safety references, healthcare access notes, and verified mobility context for the Danube metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "prague",
    title: "Arriving in Prague: City Arrival Planning Guide",
    summary:
      "Prague arrival context covering city intelligence, Czech country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the metropolitan region where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "warsaw",
    title: "Arriving in Warsaw: City Arrival Planning Guide",
    summary:
      "Plan your first day in Warsaw using the city intelligence profile, Polish country hub, public-safety references, healthcare access notes, and verified mobility context for the metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "helsinki",
    title: "Arriving in Helsinki: City Arrival Planning Guide",
    summary:
      "Helsinki arrival context covering city intelligence, Finnish country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Uusimaa metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "oslo",
    title: "Arriving in Oslo: City Arrival Planning Guide",
    summary:
      "Plan your first day in Oslo using the city intelligence profile, Norwegian country hub, public-safety references, healthcare access notes, and verified mobility context for the metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  // ===== Second arrival batch: United States (6) =====
  {
    citySlug: "philadelphia",
    title: "Arriving in Philadelphia: City Arrival Planning Guide",
    summary:
      "Philadelphia arrival context covering city intelligence, United States country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Mid-Atlantic metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "atlanta",
    title: "Arriving in Atlanta: City Arrival Planning Guide",
    summary:
      "Plan your first day in Atlanta using the city intelligence profile, United States country hub, public-safety references, healthcare access notes, and verified mobility context for the metropolitan region.",
    arrivalFocus: "business_travel",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "phoenix",
    title: "Arriving in Phoenix: City Arrival Planning Guide",
    summary:
      "Phoenix arrival context covering city intelligence, United States country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Sun-Belt metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "san-diego",
    title: "Arriving in San Diego: City Arrival Planning Guide",
    summary:
      "Plan your first day in San Diego using the city intelligence profile, United States country hub, public-safety references, healthcare access notes, and verified mobility context for the Pacific-coast metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "portland",
    title: "Arriving in Portland: City Arrival Planning Guide",
    summary:
      "Portland arrival context covering city intelligence, United States country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Pacific-Northwest metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "dallas",
    title: "Arriving in Dallas: City Arrival Planning Guide",
    summary:
      "Plan your first day in Dallas using the city intelligence profile, United States country hub, public-safety references, healthcare access notes, and verified mobility context for the North-Texas metropolitan region.",
    arrivalFocus: "business_travel",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  // ===== Second arrival batch: Canada / Commonwealth (7) =====
  {
    citySlug: "calgary",
    title: "Arriving in Calgary: City Arrival Planning Guide",
    summary:
      "Calgary arrival context covering city intelligence, Canadian country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Prairie metropolitan region.",
    arrivalFocus: "relocation_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["canada-emergency"]),
  },
  {
    citySlug: "gold-coast",
    title: "Arriving in Gold Coast: City Arrival Planning Guide",
    summary:
      "Plan your first day on the Gold Coast using the city intelligence profile, Australian country hub, public-safety references, healthcare access notes, and verified mobility context for the South-East-Queensland region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["triple-zero-au"]),
  },
  {
    citySlug: "hobart",
    title: "Arriving in Hobart: City Arrival Planning Guide",
    summary:
      "Hobart arrival context covering city intelligence, Australian country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Tasmanian metropolitan region where available.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["triple-zero-au"]),
  },
  {
    citySlug: "adelaide",
    title: "Arriving in Adelaide: City Arrival Planning Guide",
    summary:
      "Plan your first day in Adelaide using the city intelligence profile, Australian country hub, public-safety references, healthcare access notes, and verified mobility context for the South-Australian metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["triple-zero-au"]),
  },
  {
    citySlug: "canberra",
    title: "Arriving in Canberra: City Arrival Planning Guide",
    summary:
      "Canberra arrival context covering city intelligence, Australian country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the national-capital region.",
    arrivalFocus: "business_travel",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["triple-zero-au"]),
  },
  {
    citySlug: "christchurch",
    title: "Arriving in Christchurch: City Arrival Planning Guide",
    summary:
      "Plan your first day in Christchurch using the city intelligence profile, New Zealand country hub, public-safety references, healthcare access notes, and verified mobility context for the Canterbury metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["nz-police-111"]),
  },
  {
    citySlug: "dunedin",
    title: "Arriving in Dunedin: City Arrival Planning Guide",
    summary:
      "Dunedin arrival context covering city intelligence, New Zealand country hub, public-safety references, healthcare access notes, and verified mobility context for the Otago metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["nz-police-111"]),
  },
  // ===== Second arrival batch: Asia / global hubs (8) =====
  {
    citySlug: "osaka",
    title: "Arriving in Osaka: City Arrival Planning Guide",
    summary:
      "Plan your first day in Osaka using the city intelligence profile, Japan country hub, public-safety references, healthcare access notes, and verified mobility context for the Kansai metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["npa-japan"]),
  },
  {
    citySlug: "fukuoka",
    title: "Arriving in Fukuoka: City Arrival Planning Guide",
    summary:
      "Fukuoka arrival context covering city intelligence, Japan country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Kyushu metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["npa-japan"]),
  },
  {
    citySlug: "busan",
    title: "Arriving in Busan: City Arrival Planning Guide",
    summary:
      "Plan your first day in Busan using the city intelligence profile, South Korean country hub, public-safety references, healthcare access notes, and verified mobility context for the south-eastern coastal metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["who-air"]),
  },
  {
    citySlug: "incheon",
    title: "Arriving in Incheon: City Arrival Planning Guide",
    summary:
      "Incheon arrival context covering city intelligence, South Korean country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Seoul-Capital-Area port region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["who-air"]),
  },
  {
    citySlug: "kaohsiung",
    title: "Arriving in Kaohsiung: City Arrival Planning Guide",
    summary:
      "Plan your first day in Kaohsiung using the city intelligence profile, Taiwan country hub, public-safety references, healthcare access notes, and verified mobility context for the southern-Taiwan port region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["who-air"]),
  },
  {
    citySlug: "da-nang",
    title: "Arriving in Da Nang: City Arrival Planning Guide",
    summary:
      "Da Nang arrival context covering city intelligence, Vietnam country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the central-coastal region.",
    arrivalFocus: "remote_work_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["who-air", "itu-connectivity"]),
  },
  {
    citySlug: "kuala-lumpur",
    title: "Arriving in Kuala Lumpur: City Arrival Planning Guide",
    summary:
      "Plan your first day in Kuala Lumpur using the city intelligence profile, Malaysian country hub, public-safety references, healthcare access notes, and verified mobility context for the Klang-Valley metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["who-air"]),
  },
  {
    citySlug: "bangkok",
    title: "Arriving in Bangkok: City Arrival Planning Guide",
    summary:
      "Bangkok arrival context covering city intelligence, Thai country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Chao-Phraya metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["who-air"]),
  },
  // ===== Third arrival batch (2026-05-23): UK / Ireland (6) =====
  {
    citySlug: "manchester",
    title: "Arriving in Manchester: City Arrival Planning Guide",
    summary:
      "Manchester arrival context covering city intelligence, United Kingdom country hub, public-safety references, healthcare access notes, and verified mobility context for the North-West-English metropolitan region.",
    arrivalFocus: "rail_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air", "itu-connectivity"]),
  },
  {
    citySlug: "birmingham",
    title: "Arriving in Birmingham: City Arrival Planning Guide",
    summary:
      "Plan your first day in Birmingham using the city intelligence profile, United Kingdom country hub, public-safety references, healthcare access notes, and verified mobility context for the West-Midlands metropolitan region.",
    arrivalFocus: "rail_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "bristol",
    title: "Arriving in Bristol: City Arrival Planning Guide",
    summary:
      "Bristol arrival context covering city intelligence, United Kingdom country hub, public-safety references, healthcare access notes, and verified mobility context for the South-West-English metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "glasgow",
    title: "Arriving in Glasgow: City Arrival Planning Guide",
    summary:
      "Plan your first day in Glasgow using the city intelligence profile, United Kingdom country hub, public-safety references, healthcare access notes, and verified mobility context for the West-Central-Scottish region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "belfast",
    title: "Arriving in Belfast: City Arrival Planning Guide",
    summary:
      "Belfast arrival context covering city intelligence, United Kingdom country hub, public-safety references, healthcare access notes, and verified mobility context for the Northern-Irish metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "cardiff",
    title: "Arriving in Cardiff: City Arrival Planning Guide",
    summary:
      "Plan your first day in Cardiff using the city intelligence profile, United Kingdom country hub, public-safety references, healthcare access notes, and verified mobility context for the South-Wales metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  // ===== Third arrival batch: France / Germany (4) =====
  {
    citySlug: "lyon",
    title: "Arriving in Lyon: City Arrival Planning Guide",
    summary:
      "Lyon arrival context covering city intelligence, French country hub, public-safety references, healthcare access notes, and verified mobility context for the Rhône-Alpes metropolitan region.",
    arrivalFocus: "rail_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "marseille",
    title: "Arriving in Marseille: City Arrival Planning Guide",
    summary:
      "Plan your first day in Marseille using the city intelligence profile, French country hub, public-safety references, healthcare access notes, and verified mobility context for the Mediterranean-French metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "frankfurt",
    title: "Arriving in Frankfurt: City Arrival Planning Guide",
    summary:
      "Frankfurt arrival context covering city intelligence, German country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Rhine-Main metropolitan region.",
    arrivalFocus: "business_travel",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air", "itu-connectivity"]),
  },
  {
    citySlug: "cologne",
    title: "Arriving in Cologne: City Arrival Planning Guide",
    summary:
      "Plan your first day in Cologne using the city intelligence profile, German country hub, public-safety references, healthcare access notes, and verified mobility context for the Rhineland metropolitan region.",
    arrivalFocus: "rail_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  // ===== Third arrival batch: United States (7) =====
  {
    citySlug: "nashville",
    title: "Arriving in Nashville: City Arrival Planning Guide",
    summary:
      "Nashville arrival context covering city intelligence, United States country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Middle-Tennessee metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "charlotte",
    title: "Arriving in Charlotte: City Arrival Planning Guide",
    summary:
      "Plan your first day in Charlotte using the city intelligence profile, United States country hub, public-safety references, healthcare access notes, and verified mobility context for the Carolinas metropolitan region.",
    arrivalFocus: "business_travel",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "minneapolis",
    title: "Arriving in Minneapolis: City Arrival Planning Guide",
    summary:
      "Minneapolis arrival context covering city intelligence, United States country hub, public-safety references, healthcare access notes, and verified mobility context for the Twin-Cities metropolitan region.",
    arrivalFocus: "business_travel",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "salt-lake-city",
    title: "Arriving in Salt Lake City: City Arrival Planning Guide",
    summary:
      "Plan your first day in Salt Lake City using the city intelligence profile, United States country hub, public-safety references, healthcare access notes, and verified mobility context for the Wasatch-Front metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "raleigh",
    title: "Arriving in Raleigh: City Arrival Planning Guide",
    summary:
      "Raleigh arrival context covering city intelligence, United States country hub, public-safety references, healthcare access notes, and verified mobility context for the Research-Triangle metropolitan region.",
    arrivalFocus: "remote_work_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs", "itu-connectivity"]),
  },
  {
    citySlug: "tampa",
    title: "Arriving in Tampa: City Arrival Planning Guide",
    summary:
      "Plan your first day in Tampa using the city intelligence profile, United States country hub, public-safety references, healthcare access notes, and verified mobility context for the Florida-Gulf-Coast metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "orlando",
    title: "Arriving in Orlando: City Arrival Planning Guide",
    summary:
      "Orlando arrival context covering city intelligence, United States country hub, public-safety references, healthcare access notes, and verified mobility context for the Central-Florida metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  // ===== Third arrival batch: Canada (4) =====
  {
    citySlug: "quebec-city",
    title: "Arriving in Quebec City: City Arrival Planning Guide",
    summary:
      "Quebec City arrival context covering city intelligence, Canadian country hub, public-safety references, healthcare access notes, and verified mobility context for the eastern-Québec metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["canada-emergency"]),
  },
  {
    citySlug: "edmonton",
    title: "Arriving in Edmonton: City Arrival Planning Guide",
    summary:
      "Plan your first day in Edmonton using the city intelligence profile, Canadian country hub, public-safety references, healthcare access notes, and verified mobility context for the northern-Alberta metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["canada-emergency"]),
  },
  {
    citySlug: "winnipeg",
    title: "Arriving in Winnipeg: City Arrival Planning Guide",
    summary:
      "Winnipeg arrival context covering city intelligence, Canadian country hub, public-safety references, healthcare access notes, and verified mobility context for the Manitoba prairie metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["canada-emergency"]),
  },
  {
    citySlug: "halifax",
    title: "Arriving in Halifax: City Arrival Planning Guide",
    summary:
      "Plan your first day in Halifax using the city intelligence profile, Canadian country hub, public-safety references, healthcare access notes, and verified mobility context for the Atlantic-Canadian metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_3_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["canada-emergency"]),
  },

  // ===== Batch four: 30 additional arrival pages =====
  // Cities added in the batch-three expansion (and Johannesburg /
  // Pretoria, where Johannesburg pre-existed). Same neutral framing:
  // routes back to structured city / country / public-safety /
  // healthcare / transport / tools layers — no airport names, no
  // IATA codes, no transfer routes, no fares, no schedules, no
  // travel times, no transport operators, no visa or medical advice.

  // UK
  {
    citySlug: "oxford",
    title: "Arriving in Oxford: City Arrival Planning Guide",
    summary:
      "Plan your first day in Oxford using the city intelligence profile, United Kingdom country hub, public-safety references, healthcare access notes, and verified mobility context for the Oxfordshire region.",
    arrivalFocus: "rail_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "cambridge",
    title: "Arriving in Cambridge: City Arrival Planning Guide",
    summary:
      "Cambridge arrival context covering city intelligence, United Kingdom country hub, public-safety references, healthcare access notes, and verified mobility context for the Cambridgeshire research metro.",
    arrivalFocus: "rail_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air", "itu-connectivity"]),
  },
  {
    citySlug: "liverpool",
    title: "Arriving in Liverpool: City Arrival Planning Guide",
    summary:
      "Liverpool arrival context covering city intelligence, United Kingdom country hub, public-safety references, healthcare access notes, and verified mobility context for the Merseyside metropolitan region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "sheffield",
    title: "Arriving in Sheffield: City Arrival Planning Guide",
    summary:
      "Plan your first day in Sheffield using the city intelligence profile, United Kingdom country hub, public-safety references, healthcare access notes, and verified mobility context for the South-Yorkshire region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },

  // France
  {
    citySlug: "montpellier",
    title: "Arriving in Montpellier: City Arrival Planning Guide",
    summary:
      "Montpellier arrival context covering city intelligence, French country hub, public-safety references, healthcare access notes, and verified mobility context for the Occitanie Mediterranean metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "rennes",
    title: "Arriving in Rennes: City Arrival Planning Guide",
    summary:
      "Plan your first day in Rennes using the city intelligence profile, French country hub, public-safety references, healthcare access notes, and verified mobility context for the Brittany regional capital.",
    arrivalFocus: "rail_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },

  // Germany
  {
    citySlug: "hanover",
    title: "Arriving in Hanover: City Arrival Planning Guide",
    summary:
      "Hanover arrival context covering city intelligence, German country hub, public-safety references, healthcare access notes, and verified mobility context for the Lower-Saxony regional capital.",
    arrivalFocus: "rail_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "nuremberg",
    title: "Arriving in Nuremberg: City Arrival Planning Guide",
    summary:
      "Plan your first day in Nuremberg using the city intelligence profile, German country hub, public-safety references, healthcare access notes, and verified mobility context for the Northern-Bavarian metro region.",
    arrivalFocus: "rail_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "bremen",
    title: "Arriving in Bremen: City Arrival Planning Guide",
    summary:
      "Bremen arrival context covering city intelligence, German country hub, public-safety references, healthcare access notes, and verified mobility context for the Lower-Weser city-state region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "bonn",
    title: "Arriving in Bonn: City Arrival Planning Guide",
    summary:
      "Plan your first day in Bonn using the city intelligence profile, German country hub, public-safety references, healthcare access notes, and verified mobility context for the Rhineland-Bonn region.",
    arrivalFocus: "rail_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },

  // Spain / Italy / Belgium / Sweden
  {
    citySlug: "alicante",
    title: "Arriving in Alicante: City Arrival Planning Guide",
    summary:
      "Alicante arrival context covering city intelligence, Spanish country hub, public-safety references, healthcare access notes, and verified mobility context for the Mediterranean Costa-Blanca region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "pisa",
    title: "Arriving in Pisa: City Arrival Planning Guide",
    summary:
      "Plan your first day in Pisa using the city intelligence profile, Italian country hub, public-safety references, healthcare access notes, and verified mobility context for the Tuscan regional metro.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "bari",
    title: "Arriving in Bari: City Arrival Planning Guide",
    summary:
      "Bari arrival context covering city intelligence, Italian country hub, public-safety references, healthcare access notes, and verified mobility context for the Puglian Adriatic metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "bruges",
    title: "Arriving in Bruges: City Arrival Planning Guide",
    summary:
      "Plan your first day in Bruges using the city intelligence profile, Belgian country hub, public-safety references, healthcare access notes, and verified mobility context for the West-Flanders heritage region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },
  {
    citySlug: "uppsala",
    title: "Arriving in Uppsala: City Arrival Planning Guide",
    summary:
      "Uppsala arrival context covering city intelligence, Swedish country hub, public-safety references, healthcare access notes, and verified mobility context for the Uppland regional university metro.",
    arrivalFocus: "rail_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["eea-air"]),
  },

  // United States
  {
    citySlug: "columbus",
    title: "Arriving in Columbus: City Arrival Planning Guide",
    summary:
      "Columbus arrival context covering city intelligence, United States country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Central-Ohio metro region.",
    arrivalFocus: "business_travel",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "indianapolis",
    title: "Arriving in Indianapolis: City Arrival Planning Guide",
    summary:
      "Plan your first day in Indianapolis using the city intelligence profile, United States country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Central-Indiana metro region.",
    arrivalFocus: "business_travel",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "detroit",
    title: "Arriving in Detroit: City Arrival Planning Guide",
    summary:
      "Detroit arrival context covering city intelligence, United States country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the South-East-Michigan metro region.",
    arrivalFocus: "business_travel",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "baltimore",
    title: "Arriving in Baltimore: City Arrival Planning Guide",
    summary:
      "Plan your first day in Baltimore using the city intelligence profile, United States country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the Mid-Atlantic metro region.",
    arrivalFocus: "business_travel",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },
  {
    citySlug: "san-antonio",
    title: "Arriving in San Antonio: City Arrival Planning Guide",
    summary:
      "San Antonio arrival context covering city intelligence, United States country hub, public-safety references, healthcare access notes, and verified mobility-authority context for the South-Central-Texas metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["epa-naaqs"]),
  },

  // Canada / Australia / New Zealand
  {
    citySlug: "victoria",
    title: "Arriving in Victoria: City Arrival Planning Guide",
    summary:
      "Plan your first day in Victoria using the city intelligence profile, Canadian country hub, public-safety references, healthcare access notes, and verified mobility context for the Vancouver-Island regional capital.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["canada-emergency"]),
  },
  {
    citySlug: "saskatoon",
    title: "Arriving in Saskatoon: City Arrival Planning Guide",
    summary:
      "Saskatoon arrival context covering city intelligence, Canadian country hub, public-safety references, healthcare access notes, and verified mobility context for the Prairie-Saskatchewan metro region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["canada-emergency"]),
  },
  {
    citySlug: "wollongong",
    title: "Arriving in Wollongong: City Arrival Planning Guide",
    summary:
      "Plan your first day in Wollongong using the city intelligence profile, Australian country hub, public-safety references, healthcare access notes, and verified mobility context for the Illawarra coastal region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["triple-zero-au"]),
  },
  {
    citySlug: "queenstown",
    title: "Arriving in Queenstown: City Arrival Planning Guide",
    summary:
      "Queenstown arrival context covering city intelligence, New Zealand country hub, public-safety references, healthcare access notes, and verified mobility context for the Otago alpine-lakeside region.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["nz-police-111"]),
  },

  // India
  {
    citySlug: "chennai",
    title: "Arriving in Chennai: City Arrival Planning Guide",
    summary:
      "Chennai arrival context covering city intelligence, Indian country hub, public-safety references, healthcare access notes, and verified mobility context for the Tamil-Nadu Bay-of-Bengal metro region.",
    arrivalFocus: "business_travel",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["who-air", "itu-connectivity"]),
  },
  {
    citySlug: "hyderabad",
    title: "Arriving in Hyderabad: City Arrival Planning Guide",
    summary:
      "Plan your first day in Hyderabad using the city intelligence profile, Indian country hub, public-safety references, healthcare access notes, and verified mobility context for the Telangana metro region.",
    arrivalFocus: "business_travel",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["who-air", "itu-connectivity"]),
  },
  {
    citySlug: "pune",
    title: "Arriving in Pune: City Arrival Planning Guide",
    summary:
      "Pune arrival context covering city intelligence, Indian country hub, public-safety references, healthcare access notes, and verified mobility context for the Maharashtra Western-Ghats metro region.",
    arrivalFocus: "business_travel",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["who-air", "itu-connectivity"]),
  },
  {
    citySlug: "jaipur",
    title: "Arriving in Jaipur: City Arrival Planning Guide",
    summary:
      "Plan your first day in Jaipur using the city intelligence profile, Indian country hub, public-safety references, healthcare access notes, and verified mobility context for the Rajasthan regional capital.",
    arrivalFocus: "general_arrival",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["who-air"]),
  },

  // South Africa
  {
    citySlug: "johannesburg",
    title: "Arriving in Johannesburg: City Arrival Planning Guide",
    summary:
      "Johannesburg arrival context covering city intelligence, South-African country hub, public-safety references, healthcare access notes, and verified mobility context for the Gauteng metropolitan region.",
    arrivalFocus: "business_travel",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["who-air", "itu-connectivity"]),
  },
  {
    citySlug: "pretoria",
    title: "Arriving in Pretoria: City Arrival Planning Guide",
    summary:
      "Plan your first day in Pretoria using the city intelligence profile, South-African country hub, public-safety references, healthcare access notes, and verified mobility context for the Tshwane metropolitan region.",
    arrivalFocus: "business_travel",
    updatedDate: BATCH_4_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: arrivalSources(["who-air", "itu-connectivity"]),
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
