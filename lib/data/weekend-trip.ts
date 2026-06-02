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
const BATCH_4_UPDATED_DATE = "2026-06-01";
const BATCH_5_UPDATED_DATE = "2026-06-02";
const BATCH_6_UPDATED_DATE = "2026-06-02";
const BATCH_7_UPDATED_DATE = "2026-06-02";

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
  updatedDate?: string;
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

  // === Batch four (2026-06-01): +49 weekend-trip pages ===
  { citySlug: "york", cityName: "York", countryName: "United Kingdom", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "southampton", cityName: "Southampton", countryName: "United Kingdom", weekendFocus: "city_break", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "aberdeen", cityName: "Aberdeen", countryName: "United Kingdom", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "dundee", cityName: "Dundee", countryName: "United Kingdom", weekendFocus: "city_break", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "limerick", cityName: "Limerick", countryName: "Ireland", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "waterford", cityName: "Waterford", countryName: "Ireland", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "nantes", cityName: "Nantes", countryName: "France", weekendFocus: "city_break", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "lille", cityName: "Lille", countryName: "France", weekendFocus: "city_break", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "rouen", cityName: "Rouen", countryName: "France", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "reims", cityName: "Reims", countryName: "France", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "tours", cityName: "Tours", countryName: "France", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "karlsruhe", cityName: "Karlsruhe", countryName: "Germany", weekendFocus: "city_break", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "essen", cityName: "Essen", countryName: "Germany", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "vigo", cityName: "Vigo", countryName: "Spain", weekendFocus: "visual_orientation", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "santander", cityName: "Santander", countryName: "Spain", weekendFocus: "visual_orientation", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "faro", cityName: "Faro", countryName: "Portugal", weekendFocus: "visual_orientation", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "aveiro", cityName: "Aveiro", countryName: "Portugal", weekendFocus: "visual_orientation", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "siena", cityName: "Siena", countryName: "Italy", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "trieste", cityName: "Trieste", countryName: "Italy", weekendFocus: "city_break", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "parma", cityName: "Parma", countryName: "Italy", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "lecce", cityName: "Lecce", countryName: "Italy", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "namur", cityName: "Namur", countryName: "Belgium", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "liege", cityName: "Liège", countryName: "Belgium", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "tilburg", cityName: "Tilburg", countryName: "Netherlands", weekendFocus: "general_weekend_planning", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "breda", cityName: "Breda", countryName: "Netherlands", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "oulu", cityName: "Oulu", countryName: "Finland", weekendFocus: "visual_orientation", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "aalborg", cityName: "Aalborg", countryName: "Denmark", weekendFocus: "general_weekend_planning", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "tartu", cityName: "Tartu", countryName: "Estonia", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "klaipeda", cityName: "Klaipėda", countryName: "Lithuania", weekendFocus: "visual_orientation", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "kosice", cityName: "Košice", countryName: "Slovakia", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "lublin", cityName: "Lublin", countryName: "Poland", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "timisoara", cityName: "Timișoara", countryName: "Romania", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "oradea", cityName: "Oradea", countryName: "Romania", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "varna", cityName: "Varna", countryName: "Bulgaria", weekendFocus: "visual_orientation", extra: ["eea-air"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "ann-arbor", cityName: "Ann Arbor", countryName: "United States", weekendFocus: "city_break", extra: ["epa-naaqs"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "new-orleans", cityName: "New Orleans", countryName: "United States", weekendFocus: "culture_context", extra: ["epa-naaqs"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "louisville", cityName: "Louisville", countryName: "United States", weekendFocus: "city_break", extra: ["epa-naaqs"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "oklahoma-city", cityName: "Oklahoma City", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "omaha", cityName: "Omaha", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "boise", cityName: "Boise", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "tucson", cityName: "Tucson", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "regina", cityName: "Regina", countryName: "Canada", weekendFocus: "general_weekend_planning", extra: ["canada-emergency"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "townsville", cityName: "Townsville", countryName: "Australia", weekendFocus: "visual_orientation", extra: ["triple-zero-au"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "toowoomba", cityName: "Toowoomba", countryName: "Australia", weekendFocus: "general_weekend_planning", extra: ["triple-zero-au"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "ballarat", cityName: "Ballarat", countryName: "Australia", weekendFocus: "culture_context", extra: ["triple-zero-au"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "bendigo", cityName: "Bendigo", countryName: "Australia", weekendFocus: "culture_context", extra: ["triple-zero-au"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "launceston", cityName: "Launceston", countryName: "Australia", weekendFocus: "visual_orientation", extra: ["triple-zero-au"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "palmerston-north", cityName: "Palmerston North", countryName: "New Zealand", weekendFocus: "general_weekend_planning", extra: ["nz-police-111"], updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "nelson", cityName: "Nelson", countryName: "New Zealand", weekendFocus: "visual_orientation", extra: ["nz-police-111"], updatedDate: BATCH_4_UPDATED_DATE },

  // === Batch five (2026-06-02): +47 weekend-trip pages (batch-five nearby cities) ===
  { citySlug: "aix-en-provence", cityName: "Aix-en-Provence", countryName: "France", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "baltimore", cityName: "Baltimore", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "bari", cityName: "Bari", countryName: "Italy", weekendFocus: "general_weekend_planning", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "bonn", cityName: "Bonn", countryName: "Germany", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "boulder", cityName: "Boulder", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "braga", cityName: "Braga", countryName: "Portugal", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "brasov", cityName: "Brașov", countryName: "Romania", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "bruges", cityName: "Bruges", countryName: "Belgium", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "bucharest", cityName: "Bucharest", countryName: "Romania", weekendFocus: "city_break", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "cairns", cityName: "Cairns", countryName: "Australia", weekendFocus: "city_break", extra: ["triple-zero-au"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "catania", cityName: "Catania", countryName: "Italy", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "charlotte", cityName: "Charlotte", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "columbus", cityName: "Columbus", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "darwin", cityName: "Darwin", countryName: "Australia", weekendFocus: "general_weekend_planning", extra: ["triple-zero-au"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "detroit", cityName: "Detroit", countryName: "United States", weekendFocus: "culture_context", extra: ["epa-naaqs"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "dijon", cityName: "Dijon", countryName: "France", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "dortmund", cityName: "Dortmund", countryName: "Germany", weekendFocus: "general_weekend_planning", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "eindhoven", cityName: "Eindhoven", countryName: "Netherlands", weekendFocus: "general_weekend_planning", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "freiburg", cityName: "Freiburg", countryName: "Germany", weekendFocus: "city_break", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "galway", cityName: "Galway", countryName: "Ireland", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "gdansk", cityName: "Gdansk", countryName: "Poland", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "gold-coast", cityName: "Gold Coast", countryName: "Australia", weekendFocus: "family_weekend", extra: ["triple-zero-au"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "granada", cityName: "Granada", countryName: "Spain", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "groningen", cityName: "Groningen", countryName: "Netherlands", weekendFocus: "general_weekend_planning", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "hobart", cityName: "Hobart", countryName: "Australia", weekendFocus: "culture_context", extra: ["triple-zero-au"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "las-vegas", cityName: "Las Vegas", countryName: "United States", weekendFocus: "city_break", extra: ["epa-naaqs"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "ljubljana", cityName: "Ljubljana", countryName: "Slovenia", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "lund", cityName: "Lund", countryName: "Sweden", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "madison", cityName: "Madison", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "minneapolis", cityName: "Minneapolis", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "montpellier", cityName: "Montpellier", countryName: "France", weekendFocus: "general_weekend_planning", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "naples", cityName: "Naples", countryName: "Italy", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "orlando", cityName: "Orlando", countryName: "United States", weekendFocus: "family_weekend", extra: ["epa-naaqs"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "ostrava", cityName: "Ostrava", countryName: "Czechia", weekendFocus: "general_weekend_planning", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "palermo", cityName: "Palermo", countryName: "Italy", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "poznan", cityName: "Poznań", countryName: "Poland", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "raleigh", cityName: "Raleigh", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "riga", cityName: "Riga", countryName: "Latvia", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "san-antonio", cityName: "San Antonio", countryName: "United States", weekendFocus: "culture_context", extra: ["epa-naaqs"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "saskatoon", cityName: "Saskatoon", countryName: "Canada", weekendFocus: "general_weekend_planning", extra: ["canada-emergency"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "split", cityName: "Split", countryName: "Croatia", weekendFocus: "city_break", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "sunshine-coast", cityName: "Sunshine Coast", countryName: "Australia", weekendFocus: "family_weekend", extra: ["triple-zero-au"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "tampere", cityName: "Tampere", countryName: "Finland", weekendFocus: "visual_orientation", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "turku", cityName: "Turku", countryName: "Finland", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "uppsala", cityName: "Uppsala", countryName: "Sweden", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "vilnius", cityName: "Vilnius", countryName: "Lithuania", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_5_UPDATED_DATE },
  { citySlug: "winnipeg", cityName: "Winnipeg", countryName: "Canada", weekendFocus: "general_weekend_planning", extra: ["canada-emergency"], updatedDate: BATCH_5_UPDATED_DATE },

  // === Batch six (2026-06-02): +36 weekend-trip pages (batch-six nearby cities) ===
  { citySlug: "bergamo", cityName: "Bergamo", countryName: "Italy", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "bilbao", cityName: "Bilbao", countryName: "Spain", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "bratislava", cityName: "Bratislava", countryName: "Slovakia", weekendFocus: "city_break", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "bremen", cityName: "Bremen", countryName: "Germany", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "brno", cityName: "Brno", countryName: "Czechia", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "cincinnati", cityName: "Cincinnati", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "cleveland", cityName: "Cleveland", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "cluj-napoca", cityName: "Cluj-Napoca", countryName: "Romania", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "coimbra", cityName: "Coimbra", countryName: "Portugal", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "cork", cityName: "Cork", countryName: "Ireland", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "dunedin", cityName: "Dunedin", countryName: "New Zealand", weekendFocus: "culture_context", extra: ["nz-police-111"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "geelong", cityName: "Geelong", countryName: "Australia", weekendFocus: "general_weekend_planning", extra: ["triple-zero-au"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "grenoble", cityName: "Grenoble", countryName: "France", weekendFocus: "general_weekend_planning", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "hanover", cityName: "Hanover", countryName: "Germany", weekendFocus: "general_weekend_planning", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "heidelberg", cityName: "Heidelberg", countryName: "Germany", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "kansas-city", cityName: "Kansas City", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "kelowna", cityName: "Kelowna", countryName: "Canada", weekendFocus: "general_weekend_planning", extra: ["canada-emergency"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "lodz", cityName: "Łódź", countryName: "Poland", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "memphis", cityName: "Memphis", countryName: "United States", weekendFocus: "culture_context", extra: ["epa-naaqs"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "milwaukee", cityName: "Milwaukee", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "napier", cityName: "Napier", countryName: "New Zealand", weekendFocus: "general_weekend_planning", extra: ["nz-police-111"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "newcastle", cityName: "Newcastle", countryName: "Australia", weekendFocus: "general_weekend_planning", extra: ["triple-zero-au"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "nuremberg", cityName: "Nuremberg", countryName: "Germany", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "odense", cityName: "Odense", countryName: "Denmark", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "plovdiv", cityName: "Plovdiv", countryName: "Bulgaria", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "st-louis", cityName: "St. Louis", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "tallinn", cityName: "Tallinn", countryName: "Estonia", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "tampa", cityName: "Tampa", countryName: "United States", weekendFocus: "family_weekend", extra: ["epa-naaqs"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "valladolid", cityName: "Valladolid", countryName: "Spain", weekendFocus: "general_weekend_planning", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "verona", cityName: "Verona", countryName: "Italy", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "victoria", cityName: "Victoria", countryName: "Canada", weekendFocus: "culture_context", extra: ["canada-emergency"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "waterloo-ontario", cityName: "Waterloo", countryName: "Canada", weekendFocus: "general_weekend_planning", extra: ["canada-emergency"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "wollongong", cityName: "Wollongong", countryName: "Australia", weekendFocus: "general_weekend_planning", extra: ["triple-zero-au"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "wroclaw", cityName: "Wroclaw", countryName: "Poland", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "zagreb", cityName: "Zagreb", countryName: "Croatia", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },
  { citySlug: "zaragoza", cityName: "Zaragoza", countryName: "Spain", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_6_UPDATED_DATE },

  // === Batch seven (2026-06-02): +9 weekend-trip pages (batch-seven nearby cities) ===
  { citySlug: "alicante", cityName: "Alicante", countryName: "Spain", weekendFocus: "general_weekend_planning", extra: ["eea-air"], updatedDate: BATCH_7_UPDATED_DATE },
  { citySlug: "genoa", cityName: "Genoa", countryName: "Italy", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_7_UPDATED_DATE },
  { citySlug: "indianapolis", cityName: "Indianapolis", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_7_UPDATED_DATE },
  { citySlug: "katowice", cityName: "Katowice", countryName: "Poland", weekendFocus: "general_weekend_planning", extra: ["eea-air"], updatedDate: BATCH_7_UPDATED_DATE },
  { citySlug: "malmo", cityName: "Malmö", countryName: "Sweden", weekendFocus: "general_weekend_planning", extra: ["eea-air"], updatedDate: BATCH_7_UPDATED_DATE },
  { citySlug: "murcia", cityName: "Murcia", countryName: "Spain", weekendFocus: "general_weekend_planning", extra: ["eea-air"], updatedDate: BATCH_7_UPDATED_DATE },
  { citySlug: "padua", cityName: "Padua", countryName: "Italy", weekendFocus: "culture_context", extra: ["eea-air"], updatedDate: BATCH_7_UPDATED_DATE },
  { citySlug: "sacramento", cityName: "Sacramento", countryName: "United States", weekendFocus: "general_weekend_planning", extra: ["epa-naaqs"], updatedDate: BATCH_7_UPDATED_DATE },
  { citySlug: "tauranga", cityName: "Tauranga", countryName: "New Zealand", weekendFocus: "general_weekend_planning", extra: ["nz-police-111"], updatedDate: BATCH_7_UPDATED_DATE },
];

export const weekendTripPages: WeekendTripCityPage[] = seeds.map((seed) => ({
  citySlug: seed.citySlug,
  title: `Weekend Trip Planning Guide for ${seed.cityName}`,
  summary: summary(seed.cityName, seed.countryName),
  weekendFocus: seed.weekendFocus,
  updatedDate: seed.updatedDate ?? BATCH_1_UPDATED_DATE,
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
