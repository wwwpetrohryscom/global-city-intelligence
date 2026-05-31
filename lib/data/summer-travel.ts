import { DATA_YEAR } from "@/lib/data/constants";
import type {
  SummerTravelChecklistItem,
  SummerTravelCityPage,
  SummerTravelFocus,
} from "@/types";

/**
 * Curated summer city travel planning pages for the 2026 summer
 * publishing cycle. Every entry references an existing city slug
 * from `lib/data/cities.ts` and existing source IDs from
 * `lib/data/sources/`.
 *
 * These pages are NOT:
 *  - a tourism attractions guide
 *  - a "things to do" page
 *  - a live events page
 *  - a weather forecast page
 *  - a hotel / flight price page
 *  - an itinerary generator
 *  - an official tourism page
 *  - a page with invented local facts
 *
 * They provide a structured *summer travel research checklist* that
 * routes back to the platform's city, country, arrival, visual-guide,
 * neighborhood, moving-to, transport, public-safety, healthcare, and
 * budgeting layers. They do not publish weather forecasts, event
 * dates, ticket prices, hotel or flight prices, opening hours,
 * transport schedules, airport routes, attraction rankings, safety
 * claims, or any "best" / "must-see" / "safest" / "cheapest" claims.
 *
 * Strict geographic scope for this first batch: European Union,
 * United Kingdom / Ireland, United States, Canada, Australia, New
 * Zealand, and Switzerland. Cities outside these regions are
 * deferred to a future batch.
 */

const BATCH_1_UPDATED_DATE = "2026-05-25";

const COMMON_SOURCES: readonly string[] = [
  "un-habitat",
  "nasa-power",
  "ipcc-urban",
];

function summerSources(extra: readonly string[] = []): string[] {
  return Array.from(new Set([...COMMON_SOURCES, ...extra]));
}

const FOCUS_LABEL: Record<SummerTravelFocus, string> = {
  city_break: "City break",
  family_trip: "Family trip",
  culture_context: "Culture context",
  coastal_or_waterfront_context: "Coastal / waterfront context",
  heat_planning: "Heat planning",
  arrival_and_transport: "Arrival and transport",
  budget_planning: "Budget planning",
  general_summer_planning: "General summer planning",
};

export function getSummerTravelFocusLabel(focus: SummerTravelFocus): string {
  return FOCUS_LABEL[focus];
}

function summary(cityName: string, countryName: string): string {
  return `Use this summer 2026 planning guide for ${cityName}, ${countryName} as a checklist alongside the city profile, country hub, arrival planning, visual orientation, neighborhood and moving-to research, transport context, public-safety references, healthcare access notes, and budgeting tools. Not a weather forecast, events calendar, tourism ranking, or hotel-price guide. Verify weather, events, transport, health, and safety details with official or trusted current sources before departure.`;
}

interface Seed {
  citySlug: string;
  cityName: string;
  countryName: string;
  summerFocus: SummerTravelFocus;
  extra?: readonly string[];
}

const seeds: readonly Seed[] = [
  // ===== United Kingdom / Ireland =====
  { citySlug: "london", cityName: "London", countryName: "United Kingdom", summerFocus: "city_break", extra: ["eea-air", "itu-connectivity"] },
  { citySlug: "manchester", cityName: "Manchester", countryName: "United Kingdom", summerFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "birmingham", cityName: "Birmingham", countryName: "United Kingdom", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "bristol", cityName: "Bristol", countryName: "United Kingdom", summerFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "glasgow", cityName: "Glasgow", countryName: "United Kingdom", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "edinburgh", cityName: "Edinburgh", countryName: "United Kingdom", summerFocus: "culture_context", extra: ["eea-air"] },
  { citySlug: "oxford", cityName: "Oxford", countryName: "United Kingdom", summerFocus: "family_trip", extra: ["eea-air"] },
  { citySlug: "cambridge", cityName: "Cambridge", countryName: "United Kingdom", summerFocus: "family_trip", extra: ["eea-air"] },
  { citySlug: "liverpool", cityName: "Liverpool", countryName: "United Kingdom", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "dublin", cityName: "Dublin", countryName: "Ireland", summerFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "cardiff", cityName: "Cardiff", countryName: "United Kingdom", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "belfast", cityName: "Belfast", countryName: "United Kingdom", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "leeds", cityName: "Leeds", countryName: "United Kingdom", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "brighton", cityName: "Brighton", countryName: "United Kingdom", summerFocus: "coastal_or_waterfront_context", extra: ["eea-air"] },

  // ===== France =====
  { citySlug: "paris", cityName: "Paris", countryName: "France", summerFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "lyon", cityName: "Lyon", countryName: "France", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "marseille", cityName: "Marseille", countryName: "France", summerFocus: "coastal_or_waterfront_context", extra: ["eea-air"] },
  { citySlug: "toulouse", cityName: "Toulouse", countryName: "France", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "bordeaux", cityName: "Bordeaux", countryName: "France", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "nice", cityName: "Nice", countryName: "France", summerFocus: "coastal_or_waterfront_context", extra: ["eea-air"] },
  { citySlug: "strasbourg", cityName: "Strasbourg", countryName: "France", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "rennes", cityName: "Rennes", countryName: "France", summerFocus: "general_summer_planning", extra: ["eea-air"] },

  // ===== Germany =====
  { citySlug: "berlin", cityName: "Berlin", countryName: "Germany", summerFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "hamburg", cityName: "Hamburg", countryName: "Germany", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "munich", cityName: "Munich", countryName: "Germany", summerFocus: "family_trip", extra: ["eea-air"] },
  { citySlug: "frankfurt", cityName: "Frankfurt", countryName: "Germany", summerFocus: "arrival_and_transport", extra: ["eea-air"] },
  { citySlug: "cologne", cityName: "Cologne", countryName: "Germany", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "dusseldorf", cityName: "Düsseldorf", countryName: "Germany", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "stuttgart", cityName: "Stuttgart", countryName: "Germany", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "leipzig", cityName: "Leipzig", countryName: "Germany", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "dresden", cityName: "Dresden", countryName: "Germany", summerFocus: "culture_context", extra: ["eea-air"] },

  // ===== Netherlands / Belgium / Luxembourg =====
  { citySlug: "amsterdam", cityName: "Amsterdam", countryName: "Netherlands", summerFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "rotterdam", cityName: "Rotterdam", countryName: "Netherlands", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "the-hague", cityName: "The Hague", countryName: "Netherlands", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "utrecht", cityName: "Utrecht", countryName: "Netherlands", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "brussels", cityName: "Brussels", countryName: "Belgium", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "antwerp", cityName: "Antwerp", countryName: "Belgium", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "ghent", cityName: "Ghent", countryName: "Belgium", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "luxembourg-city", cityName: "Luxembourg City", countryName: "Luxembourg", summerFocus: "general_summer_planning", extra: ["eea-air"] },

  // ===== Spain / Portugal / Italy =====
  { citySlug: "madrid", cityName: "Madrid", countryName: "Spain", summerFocus: "heat_planning", extra: ["eea-air"] },
  { citySlug: "barcelona", cityName: "Barcelona", countryName: "Spain", summerFocus: "coastal_or_waterfront_context", extra: ["eea-air"] },
  { citySlug: "valencia", cityName: "Valencia", countryName: "Spain", summerFocus: "coastal_or_waterfront_context", extra: ["eea-air"] },
  { citySlug: "seville", cityName: "Seville", countryName: "Spain", summerFocus: "heat_planning", extra: ["eea-air"] },
  { citySlug: "malaga", cityName: "Málaga", countryName: "Spain", summerFocus: "coastal_or_waterfront_context", extra: ["eea-air"] },
  { citySlug: "lisbon", cityName: "Lisbon", countryName: "Portugal", summerFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "porto", cityName: "Porto", countryName: "Portugal", summerFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "rome", cityName: "Rome", countryName: "Italy", summerFocus: "heat_planning", extra: ["eea-air"] },
  { citySlug: "milan", cityName: "Milan", countryName: "Italy", summerFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "florence", cityName: "Florence", countryName: "Italy", summerFocus: "culture_context", extra: ["eea-air"] },
  { citySlug: "bologna", cityName: "Bologna", countryName: "Italy", summerFocus: "culture_context", extra: ["eea-air"] },
  { citySlug: "turin", cityName: "Turin", countryName: "Italy", summerFocus: "general_summer_planning", extra: ["eea-air"] },

  // ===== Austria / Switzerland / Nordics =====
  { citySlug: "vienna", cityName: "Vienna", countryName: "Austria", summerFocus: "culture_context", extra: ["eea-air"] },
  { citySlug: "zurich", cityName: "Zürich", countryName: "Switzerland", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "stockholm", cityName: "Stockholm", countryName: "Sweden", summerFocus: "coastal_or_waterfront_context", extra: ["eea-air"] },
  { citySlug: "gothenburg", cityName: "Gothenburg", countryName: "Sweden", summerFocus: "coastal_or_waterfront_context", extra: ["eea-air"] },
  { citySlug: "copenhagen", cityName: "Copenhagen", countryName: "Denmark", summerFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "aarhus", cityName: "Aarhus", countryName: "Denmark", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "helsinki", cityName: "Helsinki", countryName: "Finland", summerFocus: "general_summer_planning", extra: ["eea-air", "itu-connectivity"] },

  // ===== Central / Eastern Europe =====
  { citySlug: "prague", cityName: "Prague", countryName: "Czechia", summerFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "warsaw", cityName: "Warsaw", countryName: "Poland", summerFocus: "general_summer_planning", extra: ["eea-air"] },
  { citySlug: "krakow", cityName: "Kraków", countryName: "Poland", summerFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "budapest", cityName: "Budapest", countryName: "Hungary", summerFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "athens", cityName: "Athens", countryName: "Greece", summerFocus: "heat_planning", extra: ["eea-air"] },

  // ===== United States =====
  { citySlug: "new-york", cityName: "New York", countryName: "United States", summerFocus: "city_break", extra: ["epa-naaqs"] },
  { citySlug: "los-angeles", cityName: "Los Angeles", countryName: "United States", summerFocus: "coastal_or_waterfront_context", extra: ["epa-naaqs"] },
  { citySlug: "chicago", cityName: "Chicago", countryName: "United States", summerFocus: "city_break", extra: ["epa-naaqs"] },
  { citySlug: "boston", cityName: "Boston", countryName: "United States", summerFocus: "family_trip", extra: ["epa-naaqs"] },
  { citySlug: "washington-dc", cityName: "Washington DC", countryName: "United States", summerFocus: "family_trip", extra: ["epa-naaqs"] },
  { citySlug: "san-francisco", cityName: "San Francisco", countryName: "United States", summerFocus: "coastal_or_waterfront_context", extra: ["epa-naaqs"] },
  { citySlug: "seattle", cityName: "Seattle", countryName: "United States", summerFocus: "coastal_or_waterfront_context", extra: ["epa-naaqs"] },
  { citySlug: "austin", cityName: "Austin", countryName: "United States", summerFocus: "heat_planning", extra: ["epa-naaqs"] },
  { citySlug: "denver", cityName: "Denver", countryName: "United States", summerFocus: "general_summer_planning", extra: ["epa-naaqs"] },
  { citySlug: "miami", cityName: "Miami", countryName: "United States", summerFocus: "heat_planning", extra: ["epa-naaqs"] },
  { citySlug: "nashville", cityName: "Nashville", countryName: "United States", summerFocus: "culture_context", extra: ["epa-naaqs"] },
  { citySlug: "philadelphia", cityName: "Philadelphia", countryName: "United States", summerFocus: "general_summer_planning", extra: ["epa-naaqs"] },
  { citySlug: "atlanta", cityName: "Atlanta", countryName: "United States", summerFocus: "heat_planning", extra: ["epa-naaqs"] },
  { citySlug: "phoenix", cityName: "Phoenix", countryName: "United States", summerFocus: "heat_planning", extra: ["epa-naaqs"] },
  { citySlug: "san-diego", cityName: "San Diego", countryName: "United States", summerFocus: "coastal_or_waterfront_context", extra: ["epa-naaqs"] },
  { citySlug: "portland", cityName: "Portland", countryName: "United States", summerFocus: "general_summer_planning", extra: ["epa-naaqs"] },
  { citySlug: "dallas", cityName: "Dallas", countryName: "United States", summerFocus: "heat_planning", extra: ["epa-naaqs"] },
  { citySlug: "houston", cityName: "Houston", countryName: "United States", summerFocus: "heat_planning", extra: ["epa-naaqs"] },
  { citySlug: "pittsburgh", cityName: "Pittsburgh", countryName: "United States", summerFocus: "general_summer_planning", extra: ["epa-naaqs"] },
  { citySlug: "salt-lake-city", cityName: "Salt Lake City", countryName: "United States", summerFocus: "general_summer_planning", extra: ["epa-naaqs"] },

  // ===== Canada =====
  { citySlug: "toronto", cityName: "Toronto", countryName: "Canada", summerFocus: "city_break", extra: ["canada-emergency"] },
  { citySlug: "vancouver", cityName: "Vancouver", countryName: "Canada", summerFocus: "coastal_or_waterfront_context", extra: ["canada-emergency"] },
  { citySlug: "montreal", cityName: "Montréal", countryName: "Canada", summerFocus: "culture_context", extra: ["canada-emergency"] },
  { citySlug: "ottawa", cityName: "Ottawa", countryName: "Canada", summerFocus: "family_trip", extra: ["canada-emergency"] },
  { citySlug: "calgary", cityName: "Calgary", countryName: "Canada", summerFocus: "general_summer_planning", extra: ["canada-emergency"] },
  { citySlug: "edmonton", cityName: "Edmonton", countryName: "Canada", summerFocus: "general_summer_planning", extra: ["canada-emergency"] },
  { citySlug: "quebec-city", cityName: "Québec City", countryName: "Canada", summerFocus: "culture_context", extra: ["canada-emergency"] },
  { citySlug: "halifax", cityName: "Halifax", countryName: "Canada", summerFocus: "coastal_or_waterfront_context", extra: ["canada-emergency"] },

  // ===== Australia / New Zealand =====
  // (Summer in the Northern Hemisphere = winter in AU/NZ; pages still serve
  //  user research intent for travel planning and are useful year-round
  //  for both NH-summer arrivals and SH-winter local visitors.)
  { citySlug: "sydney", cityName: "Sydney", countryName: "Australia", summerFocus: "general_summer_planning", extra: ["triple-zero-au"] },
  { citySlug: "melbourne", cityName: "Melbourne", countryName: "Australia", summerFocus: "general_summer_planning", extra: ["triple-zero-au"] },
  { citySlug: "brisbane", cityName: "Brisbane", countryName: "Australia", summerFocus: "general_summer_planning", extra: ["triple-zero-au"] },
  { citySlug: "perth", cityName: "Perth", countryName: "Australia", summerFocus: "general_summer_planning", extra: ["triple-zero-au"] },
  { citySlug: "adelaide", cityName: "Adelaide", countryName: "Australia", summerFocus: "general_summer_planning", extra: ["triple-zero-au"] },
  { citySlug: "auckland", cityName: "Auckland", countryName: "New Zealand", summerFocus: "general_summer_planning", extra: ["nz-police-111"] },
  { citySlug: "wellington", cityName: "Wellington", countryName: "New Zealand", summerFocus: "general_summer_planning", extra: ["nz-police-111"] },
  { citySlug: "christchurch", cityName: "Christchurch", countryName: "New Zealand", summerFocus: "general_summer_planning", extra: ["nz-police-111"] },
  { citySlug: "canberra", cityName: "Canberra", countryName: "Australia", summerFocus: "general_summer_planning", extra: ["triple-zero-au"] },
];

export const summerTravelPages: SummerTravelCityPage[] = seeds.map((seed) => ({
  citySlug: seed.citySlug,
  title: `Summer 2026 Travel Planning Guide for ${seed.cityName}`,
  summary: summary(seed.cityName, seed.countryName),
  summerFocus: seed.summerFocus,
  updatedDate: BATCH_1_UPDATED_DATE,
  dataYear: DATA_YEAR,
  sourceIds: summerSources(seed.extra),
}));

export const summerTravelChecklist: readonly SummerTravelChecklistItem[] = [
  // 1. Arrival and first-day planning
  {
    label: "Confirm your arrival address and route",
    description:
      "Save the destination address, an offline map, and a backup direction in case connectivity is limited on arrival.",
    category: "arrival_first_day",
  },
  {
    label: "Save offline maps and key contacts",
    description:
      "Download offline maps and save key contacts (accommodation, embassy / consulate, trusted contact) before you travel.",
    category: "arrival_first_day",
  },
  {
    label: "Check official transport sources for arrival day",
    description:
      "Open the country transport profile or city transport context for the official local mobility authority, and use that source for live information. This guide does not publish routes, fares, or schedules.",
    category: "arrival_first_day",
  },
  {
    label: "Keep backup payment and communication options",
    description:
      "Carry one backup payment method appropriate for the country and keep a secondary communication channel available on arrival day.",
    category: "arrival_first_day",
  },

  // 2. Weather and seasonal preparation
  {
    label: "Check current weather from official or trusted sources",
    description:
      "Use the official local meteorological service for current and forecast weather close to departure. This guide does not publish weather forecasts or exact temperatures.",
    category: "weather_seasonal",
  },
  {
    label: "Plan hydration and shade breaks where relevant",
    description:
      "For warm or hot-summer cities, plan hydration, shade breaks, and indoor alternatives. Confirm any specific health guidance with a qualified professional.",
    category: "weather_seasonal",
  },
  {
    label: "Keep flexibility for delays",
    description:
      "Summer travel can be disrupted by heat events, storms, or transport demand. Build flexibility into your plan and confirm details closer to departure.",
    category: "weather_seasonal",
  },

  // 3. Budget and trip buffer
  {
    label: "Run the travel budget calculator",
    description:
      "Use the travel budget calculator with your own inputs to scope an arrival and trip budget. Planning estimator only — not an official cost measurement.",
    category: "budget_buffer",
  },
  {
    label: "Estimate daily spending from your own inputs",
    description:
      "Use the cost-of-living calculator with your own inputs to scope daily spending. Calculators do not import live prices.",
    category: "budget_buffer",
  },
  {
    label: "Keep an emergency buffer",
    description:
      "Plan a buffer for delays, changes, healthcare gaps, or unforeseen costs. The travel budget calculator includes an emergency-buffer line.",
    category: "budget_buffer",
  },

  // 4. Transport and daily access
  {
    label: "Review the city transport context",
    description:
      "Open the city transport / mobility profile for structured framing, then confirm routes, fares, and schedules through the official local authority. This guide does not publish them.",
    category: "transport_daily",
  },
  {
    label: "Plan a back-up access route",
    description:
      "Think through a back-up mobility plan for evenings, weekends, and disruption days. Verify specifics with the official local transport authority.",
    category: "transport_daily",
  },
  {
    label: "Avoid relying on third-party operator claims",
    description:
      "For airport, intercity, or local transport service details, use the official transport authority or operator rather than third-party summaries.",
    category: "transport_daily",
  },

  // 5. Healthcare and public safety
  {
    label: "Open the country healthcare access context",
    description:
      "From the country hub, find the verified healthcare access context where available, or the transparent fallback. Confirm registration, insurance, and access with official local sources. This guide is not medical advice.",
    category: "healthcare_safety",
  },
  {
    label: "Open the country emergency profile",
    description:
      "From the country hub, find the verified emergency contact context where available, or the transparent fallback. Confirm current emergency numbers with the official local service.",
    category: "healthcare_safety",
  },
  {
    label: "Save official emergency information",
    description:
      "Save key contacts (local emergency service, embassy / consulate, trusted contact) in an offline-accessible note before you travel.",
    category: "healthcare_safety",
  },

  // 6. Visual orientation and planning links
  {
    label: "Open the visual guide when available",
    description:
      "Where a visual guide is available, open it for source-attributed verified imagery alongside the structured city profile. Imagery is orientation, not evidence.",
    category: "visual_planning_links",
  },
  {
    label: "Use the arrival guide when available",
    description:
      "Where an arrival guide is available, use it for first-day arrival planning context. It does not publish airport names, fares, schedules, or visa instructions.",
    category: "visual_planning_links",
  },
  {
    label: "Compare cities you are considering",
    description:
      "Use the comparison pages to weigh transport, healthcare, public-safety, and cost framing across the cities you are considering for summer travel.",
    category: "visual_planning_links",
  },
];

export function getSummerTravelChecklist(): readonly SummerTravelChecklistItem[] {
  return summerTravelChecklist;
}
