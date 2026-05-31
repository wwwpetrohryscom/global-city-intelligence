import { DATA_YEAR } from "@/lib/data/constants";
import type {
  WeekendTripChecklistItem,
  WeekendTripCityPage,
  WeekendTripFocus,
} from "@/types";

/**
 * Curated weekend city trip planning pages. Every entry references an
 * existing city slug from `lib/data/cities.ts` and existing source IDs
 * from `lib/data/sources/`.
 *
 * These pages are NOT:
 *  - a fixed itinerary page
 *  - a "things to do" page
 *  - a top attractions page
 *  - a live events page
 *  - a restaurant or hotel recommendation page
 *  - a weather forecast page
 *  - a ticket-price page
 *  - an official tourism page
 *  - a page with invented local facts
 *
 * They provide a structured *short-trip research checklist* that
 * routes back to the platform's city, country, arrival, visual-guide,
 * summer-travel, neighborhood, moving-to, transport, public-safety,
 * healthcare, and budgeting layers. They do not publish day-by-day
 * itineraries, attraction rankings, restaurant or hotel
 * recommendations, event or festival dates, ticket prices, hotel /
 * flight prices, opening hours, transport schedules, airport routes,
 * weather forecasts, exact temperatures, crime rates, or any
 * "best" / "must-see" / "top" / "safest" / "cheapest" claims.
 *
 * Strict geographic scope for this first batch: European Union,
 * United Kingdom / Ireland, United States, Canada, Australia, New
 * Zealand, and Switzerland. Cities outside these regions are
 * deferred to a future batch.
 */

const BATCH_1_UPDATED_DATE = "2026-05-31";

const COMMON_SOURCES: readonly string[] = [
  "un-habitat",
  "nasa-power",
  "ipcc-urban",
];

function weekendSources(extra: readonly string[] = []): string[] {
  return Array.from(new Set([...COMMON_SOURCES, ...extra]));
}

const FOCUS_LABEL: Record<WeekendTripFocus, string> = {
  city_break: "City break",
  culture_context: "Culture context",
  family_weekend: "Family weekend",
  arrival_and_transport: "Arrival and transport",
  budget_planning: "Budget planning",
  visual_orientation: "Visual orientation",
  general_weekend_planning: "General weekend planning",
};

export function getWeekendTripFocusLabel(focus: WeekendTripFocus): string {
  return FOCUS_LABEL[focus];
}

function summary(cityName: string, countryName: string): string {
  return `Plan a weekend city trip to ${cityName}, ${countryName} using this checklist alongside the city profile, country hub, arrival planning, visual orientation, Summer 2026 travel context, neighborhood and moving-to research, transport context, public-safety references, healthcare access notes, and budgeting tools. Not a fixed itinerary, events calendar, tourism ranking, restaurant or hotel guide, or ticket-price service. Verify events, opening hours, transport, weather, health, and safety details with official or trusted current sources before departure.`;
}

interface Seed {
  citySlug: string;
  cityName: string;
  countryName: string;
  weekendFocus: WeekendTripFocus;
  extra?: readonly string[];
}

const seeds: readonly Seed[] = [
  // ===== United Kingdom / Ireland =====
  { citySlug: "london", cityName: "London", countryName: "United Kingdom", weekendFocus: "city_break", extra: ["eea-air", "itu-connectivity"] },
  { citySlug: "manchester", cityName: "Manchester", countryName: "United Kingdom", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "birmingham", cityName: "Birmingham", countryName: "United Kingdom", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "bristol", cityName: "Bristol", countryName: "United Kingdom", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "glasgow", cityName: "Glasgow", countryName: "United Kingdom", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "edinburgh", cityName: "Edinburgh", countryName: "United Kingdom", weekendFocus: "culture_context", extra: ["eea-air"] },
  { citySlug: "oxford", cityName: "Oxford", countryName: "United Kingdom", weekendFocus: "culture_context", extra: ["eea-air"] },
  { citySlug: "cambridge", cityName: "Cambridge", countryName: "United Kingdom", weekendFocus: "culture_context", extra: ["eea-air"] },
  { citySlug: "liverpool", cityName: "Liverpool", countryName: "United Kingdom", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "dublin", cityName: "Dublin", countryName: "Ireland", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "cardiff", cityName: "Cardiff", countryName: "United Kingdom", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "belfast", cityName: "Belfast", countryName: "United Kingdom", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "leeds", cityName: "Leeds", countryName: "United Kingdom", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "brighton", cityName: "Brighton", countryName: "United Kingdom", weekendFocus: "city_break", extra: ["eea-air"] },

  // ===== France =====
  { citySlug: "paris", cityName: "Paris", countryName: "France", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "lyon", cityName: "Lyon", countryName: "France", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "marseille", cityName: "Marseille", countryName: "France", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "toulouse", cityName: "Toulouse", countryName: "France", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "bordeaux", cityName: "Bordeaux", countryName: "France", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "nice", cityName: "Nice", countryName: "France", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "strasbourg", cityName: "Strasbourg", countryName: "France", weekendFocus: "culture_context", extra: ["eea-air"] },
  { citySlug: "rennes", cityName: "Rennes", countryName: "France", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },

  // ===== Germany =====
  { citySlug: "berlin", cityName: "Berlin", countryName: "Germany", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "hamburg", cityName: "Hamburg", countryName: "Germany", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "munich", cityName: "Munich", countryName: "Germany", weekendFocus: "family_weekend", extra: ["eea-air"] },
  { citySlug: "frankfurt", cityName: "Frankfurt", countryName: "Germany", weekendFocus: "arrival_and_transport", extra: ["eea-air"] },
  { citySlug: "cologne", cityName: "Cologne", countryName: "Germany", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "dusseldorf", cityName: "Düsseldorf", countryName: "Germany", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "stuttgart", cityName: "Stuttgart", countryName: "Germany", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "leipzig", cityName: "Leipzig", countryName: "Germany", weekendFocus: "culture_context", extra: ["eea-air"] },
  { citySlug: "dresden", cityName: "Dresden", countryName: "Germany", weekendFocus: "culture_context", extra: ["eea-air"] },

  // ===== Netherlands / Belgium / Luxembourg =====
  { citySlug: "amsterdam", cityName: "Amsterdam", countryName: "Netherlands", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "rotterdam", cityName: "Rotterdam", countryName: "Netherlands", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "the-hague", cityName: "The Hague", countryName: "Netherlands", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "utrecht", cityName: "Utrecht", countryName: "Netherlands", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "brussels", cityName: "Brussels", countryName: "Belgium", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "antwerp", cityName: "Antwerp", countryName: "Belgium", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "ghent", cityName: "Ghent", countryName: "Belgium", weekendFocus: "culture_context", extra: ["eea-air"] },
  { citySlug: "luxembourg-city", cityName: "Luxembourg City", countryName: "Luxembourg", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },

  // ===== Spain / Portugal / Italy =====
  { citySlug: "madrid", cityName: "Madrid", countryName: "Spain", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "barcelona", cityName: "Barcelona", countryName: "Spain", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "valencia", cityName: "Valencia", countryName: "Spain", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "seville", cityName: "Seville", countryName: "Spain", weekendFocus: "culture_context", extra: ["eea-air"] },
  { citySlug: "malaga", cityName: "Málaga", countryName: "Spain", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "lisbon", cityName: "Lisbon", countryName: "Portugal", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "porto", cityName: "Porto", countryName: "Portugal", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "rome", cityName: "Rome", countryName: "Italy", weekendFocus: "culture_context", extra: ["eea-air"] },
  { citySlug: "milan", cityName: "Milan", countryName: "Italy", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "florence", cityName: "Florence", countryName: "Italy", weekendFocus: "culture_context", extra: ["eea-air"] },
  { citySlug: "bologna", cityName: "Bologna", countryName: "Italy", weekendFocus: "culture_context", extra: ["eea-air"] },
  { citySlug: "turin", cityName: "Turin", countryName: "Italy", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },

  // ===== Austria / Switzerland / Nordics =====
  { citySlug: "vienna", cityName: "Vienna", countryName: "Austria", weekendFocus: "culture_context", extra: ["eea-air"] },
  { citySlug: "zurich", cityName: "Zürich", countryName: "Switzerland", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "stockholm", cityName: "Stockholm", countryName: "Sweden", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "gothenburg", cityName: "Gothenburg", countryName: "Sweden", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "copenhagen", cityName: "Copenhagen", countryName: "Denmark", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "aarhus", cityName: "Aarhus", countryName: "Denmark", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "helsinki", cityName: "Helsinki", countryName: "Finland", weekendFocus: "general_weekend_planning", extra: ["eea-air", "itu-connectivity"] },

  // ===== Central / Eastern Europe =====
  { citySlug: "prague", cityName: "Prague", countryName: "Czechia", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "warsaw", cityName: "Warsaw", countryName: "Poland", weekendFocus: "general_weekend_planning", extra: ["eea-air"] },
  { citySlug: "krakow", cityName: "Kraków", countryName: "Poland", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "budapest", cityName: "Budapest", countryName: "Hungary", weekendFocus: "city_break", extra: ["eea-air"] },
  { citySlug: "athens", cityName: "Athens", countryName: "Greece", weekendFocus: "culture_context", extra: ["eea-air"] },

  // ===== United States =====
  { citySlug: "new-york", cityName: "New York", countryName: "United States", weekendFocus: "city_break", extra: ["epa-naaqs"] },
  { citySlug: "los-angeles", cityName: "Los Angeles", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"] },
  { citySlug: "chicago", cityName: "Chicago", countryName: "United States", weekendFocus: "city_break", extra: ["epa-naaqs"] },
  { citySlug: "boston", cityName: "Boston", countryName: "United States", weekendFocus: "family_weekend", extra: ["epa-naaqs"] },
  { citySlug: "washington-dc", cityName: "Washington DC", countryName: "United States", weekendFocus: "family_weekend", extra: ["epa-naaqs"] },
  { citySlug: "san-francisco", cityName: "San Francisco", countryName: "United States", weekendFocus: "city_break", extra: ["epa-naaqs"] },
  { citySlug: "seattle", cityName: "Seattle", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"] },
  { citySlug: "austin", cityName: "Austin", countryName: "United States", weekendFocus: "city_break", extra: ["epa-naaqs"] },
  { citySlug: "denver", cityName: "Denver", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"] },
  { citySlug: "miami", cityName: "Miami", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"] },
  { citySlug: "nashville", cityName: "Nashville", countryName: "United States", weekendFocus: "culture_context", extra: ["epa-naaqs"] },
  { citySlug: "philadelphia", cityName: "Philadelphia", countryName: "United States", weekendFocus: "culture_context", extra: ["epa-naaqs"] },
  { citySlug: "atlanta", cityName: "Atlanta", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"] },
  { citySlug: "phoenix", cityName: "Phoenix", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"] },
  { citySlug: "san-diego", cityName: "San Diego", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"] },
  { citySlug: "portland", cityName: "Portland", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"] },
  { citySlug: "dallas", cityName: "Dallas", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"] },
  { citySlug: "houston", cityName: "Houston", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"] },
  { citySlug: "pittsburgh", cityName: "Pittsburgh", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"] },
  { citySlug: "salt-lake-city", cityName: "Salt Lake City", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"] },

  // ===== Canada =====
  { citySlug: "toronto", cityName: "Toronto", countryName: "Canada", weekendFocus: "city_break", extra: ["canada-emergency"] },
  { citySlug: "vancouver", cityName: "Vancouver", countryName: "Canada", weekendFocus: "city_break", extra: ["canada-emergency"] },
  { citySlug: "montreal", cityName: "Montréal", countryName: "Canada", weekendFocus: "culture_context", extra: ["canada-emergency"] },
  { citySlug: "ottawa", cityName: "Ottawa", countryName: "Canada", weekendFocus: "family_weekend", extra: ["canada-emergency"] },
  { citySlug: "calgary", cityName: "Calgary", countryName: "Canada", weekendFocus: "general_weekend_planning", extra: ["canada-emergency"] },
  { citySlug: "edmonton", cityName: "Edmonton", countryName: "Canada", weekendFocus: "general_weekend_planning", extra: ["canada-emergency"] },
  { citySlug: "quebec-city", cityName: "Québec City", countryName: "Canada", weekendFocus: "culture_context", extra: ["canada-emergency"] },
  { citySlug: "halifax", cityName: "Halifax", countryName: "Canada", weekendFocus: "general_weekend_planning", extra: ["canada-emergency"] },

  // ===== Australia / New Zealand =====
  { citySlug: "sydney", cityName: "Sydney", countryName: "Australia", weekendFocus: "city_break", extra: ["triple-zero-au"] },
  { citySlug: "melbourne", cityName: "Melbourne", countryName: "Australia", weekendFocus: "city_break", extra: ["triple-zero-au"] },
  { citySlug: "brisbane", cityName: "Brisbane", countryName: "Australia", weekendFocus: "general_weekend_planning", extra: ["triple-zero-au"] },
  { citySlug: "perth", cityName: "Perth", countryName: "Australia", weekendFocus: "general_weekend_planning", extra: ["triple-zero-au"] },
  { citySlug: "adelaide", cityName: "Adelaide", countryName: "Australia", weekendFocus: "general_weekend_planning", extra: ["triple-zero-au"] },
  { citySlug: "auckland", cityName: "Auckland", countryName: "New Zealand", weekendFocus: "general_weekend_planning", extra: ["nz-police-111"] },
  { citySlug: "wellington", cityName: "Wellington", countryName: "New Zealand", weekendFocus: "general_weekend_planning", extra: ["nz-police-111"] },
  { citySlug: "christchurch", cityName: "Christchurch", countryName: "New Zealand", weekendFocus: "general_weekend_planning", extra: ["nz-police-111"] },
  { citySlug: "canberra", cityName: "Canberra", countryName: "Australia", weekendFocus: "general_weekend_planning", extra: ["triple-zero-au"] },
];

export const weekendTripPages: WeekendTripCityPage[] = seeds.map((seed) => ({
  citySlug: seed.citySlug,
  title: `Weekend Trip Planning Guide for ${seed.cityName}`,
  summary: summary(seed.cityName, seed.countryName),
  weekendFocus: seed.weekendFocus,
  updatedDate: BATCH_1_UPDATED_DATE,
  dataYear: DATA_YEAR,
  sourceIds: weekendSources(seed.extra),
}));

export const weekendTripChecklist: readonly WeekendTripChecklistItem[] = [
  // 1. Arrival and first evening planning
  {
    label: "Confirm your arrival address and route",
    description:
      "Save the destination address, an offline map, and a backup direction in case connectivity is limited on arrival.",
    category: "arrival_first_evening",
  },
  {
    label: "Save offline maps and key contacts",
    description:
      "Download offline maps and save key contacts (accommodation, embassy / consulate, trusted contact) before you travel.",
    category: "arrival_first_evening",
  },
  {
    label: "Check official transport sources for arrival day",
    description:
      "Open the country transport profile or city transport context and use that source for live information. This guide does not publish airport routes, fares, or schedules.",
    category: "arrival_first_evening",
  },
  {
    label: "Keep backup payment and communication options",
    description:
      "Carry one backup payment method appropriate for the country and keep a secondary communication channel available on arrival day.",
    category: "arrival_first_evening",
  },

  // 2. Short-trip time management
  {
    label: "Prioritise a few areas to research, not a full itinerary",
    description:
      "Pick two or three areas you want to research using the neighborhood and visual guides where available. This guide does not publish itineraries or attraction rankings.",
    category: "time_management",
  },
  {
    label: "Avoid over-planning",
    description:
      "A two- or three-day trip suits a few unrushed anchors per day. Leave room for serendipity rather than packing fixed schedules.",
    category: "time_management",
  },
  {
    label: "Keep flexibility for delays and weather",
    description:
      "Short trips are sensitive to weather and transport delays. Build flexibility into your plan and confirm details closer to departure with official sources.",
    category: "time_management",
  },

  // 3. Budget and trip buffer
  {
    label: "Run the travel budget calculator",
    description:
      "Use the travel budget calculator with your own inputs to scope an arrival and weekend trip budget. Planning estimator only — not an official cost measurement.",
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
    label: "Open the Summer 2026 travel guide when available",
    description:
      "Where a Summer 2026 travel guide is available, open it for seasonal planning context. It does not publish weather forecasts, event dates, or ticket prices.",
    category: "visual_planning_links",
  },
  {
    label: "Use the arrival guide when available",
    description:
      "Where an arrival guide is available, use it for first-day arrival planning context. It does not publish airport names, fares, schedules, or visa instructions.",
    category: "visual_planning_links",
  },
];

export function getWeekendTripChecklist(): readonly WeekendTripChecklistItem[] {
  return weekendTripChecklist;
}
