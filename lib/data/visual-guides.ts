import { DATA_YEAR } from "@/lib/data/constants";
import type {
  VisualCityGuidePage,
  VisualGuideFocus,
  VisualGuideSection,
} from "@/types";

/**
 * Curated visual city guide pages. Every entry references an
 * existing city slug from `lib/data/cities.ts` and existing source
 * IDs from `lib/data/sources/`.
 *
 * These pages are NOT:
 *  - a tourist attraction guide
 *  - a travel blog
 *  - an official tourism page
 *  - a ranking page
 *  - a page with invented visual facts
 *  - a page with unverified images
 *
 * They render verified Wikimedia hero (and where available, secondary)
 * imagery from the existing verified media catalog only, alongside
 * structured city intelligence, arrival / neighborhood / moving-to
 * planning links, comparisons, and budgeting tools. They do not name
 * tourist attractions or neighborhoods, publish prices, rankings,
 * safety claims, or any "best" / "must-see" / "most beautiful" /
 * "safest" / "cheapest" claims.
 *
 * Strict geographic scope for this first batch: European Union,
 * United Kingdom / Ireland, United States, Canada, Australia, and
 * Switzerland. Cities outside these regions are deferred to a future
 * batch.
 */

const BATCH_1_UPDATED_DATE = "2026-05-25";
const BATCH_4_UPDATED_DATE = "2026-06-01";

const COMMON_SOURCES: readonly string[] = [
  "un-habitat",
  "nasa-power",
  "ipcc-urban",
];

function visualSources(extra: readonly string[] = []): string[] {
  return Array.from(new Set([...COMMON_SOURCES, ...extra]));
}

const FOCUS_LABEL: Record<VisualGuideFocus, string> = {
  relocation_visual_context: "Relocation visual context",
  arrival_visual_context: "Arrival visual context",
  neighborhood_visual_context: "Neighborhood visual context",
  transport_visual_context: "Transport visual context",
  family_visual_context: "Family visual context",
  remote_work_visual_context: "Remote-work visual context",
  general_city_context: "General city context",
};

export function getVisualGuideFocusLabel(focus: VisualGuideFocus): string {
  return FOCUS_LABEL[focus];
}

function summary(
  cityName: string,
  countryName: string,
  contextHint: string,
): string {
  return `Explore source-attributed visual context for ${cityName}, ${countryName} — verified hero imagery from the existing media catalog alongside city intelligence, ${contextHint}, comparisons, and budgeting tools. Not a tourism guide, not an attractions ranking, and not official tourism information.`;
}

interface Seed {
  citySlug: string;
  cityName: string;
  countryName: string;
  visualFocus: VisualGuideFocus;
  extra?: readonly string[];
  context: string;
  updatedDate?: string;  // NEW — optional override; falls back to BATCH_1_UPDATED_DATE
}

const seeds: readonly Seed[] = [
  // ===== UK / Ireland =====
  { citySlug: "london", cityName: "London", countryName: "United Kingdom", visualFocus: "relocation_visual_context", extra: ["eea-air", "itu-connectivity"], context: "arrival and neighborhood planning links, moving-to research" },
  { citySlug: "manchester", cityName: "Manchester", countryName: "United Kingdom", visualFocus: "neighborhood_visual_context", extra: ["eea-air"], context: "neighborhood and arrival planning links, moving-to research" },
  { citySlug: "birmingham", cityName: "Birmingham", countryName: "United Kingdom", visualFocus: "general_city_context", extra: ["eea-air"], context: "arrival and neighborhood planning links" },
  { citySlug: "bristol", cityName: "Bristol", countryName: "United Kingdom", visualFocus: "neighborhood_visual_context", extra: ["eea-air"], context: "neighborhood and arrival planning links" },
  { citySlug: "glasgow", cityName: "Glasgow", countryName: "United Kingdom", visualFocus: "general_city_context", extra: ["eea-air"], context: "arrival and neighborhood planning links" },
  { citySlug: "edinburgh", cityName: "Edinburgh", countryName: "United Kingdom", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "arrival and neighborhood planning links, moving-to research" },
  { citySlug: "oxford", cityName: "Oxford", countryName: "United Kingdom", visualFocus: "family_visual_context", extra: ["eea-air"], context: "arrival and neighborhood planning links, moving-to research" },
  { citySlug: "cambridge", cityName: "Cambridge", countryName: "United Kingdom", visualFocus: "family_visual_context", extra: ["eea-air", "itu-connectivity"], context: "arrival and neighborhood planning links, moving-to research" },
  { citySlug: "liverpool", cityName: "Liverpool", countryName: "United Kingdom", visualFocus: "general_city_context", extra: ["eea-air"], context: "arrival and neighborhood planning links" },
  { citySlug: "dublin", cityName: "Dublin", countryName: "Ireland", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "arrival and neighborhood planning links, moving-to research" },
  { citySlug: "cardiff", cityName: "Cardiff", countryName: "United Kingdom", visualFocus: "general_city_context", extra: ["eea-air"], context: "arrival planning links" },
  { citySlug: "belfast", cityName: "Belfast", countryName: "United Kingdom", visualFocus: "general_city_context", extra: ["eea-air"], context: "arrival planning links" },
  { citySlug: "leeds", cityName: "Leeds", countryName: "United Kingdom", visualFocus: "general_city_context", extra: ["eea-air"], context: "arrival planning links" },
  { citySlug: "brighton", cityName: "Brighton", countryName: "United Kingdom", visualFocus: "general_city_context", extra: ["eea-air"], context: "arrival planning links" },

  // ===== France =====
  { citySlug: "paris", cityName: "Paris", countryName: "France", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "arrival and neighborhood planning links, moving-to research" },
  { citySlug: "lyon", cityName: "Lyon", countryName: "France", visualFocus: "neighborhood_visual_context", extra: ["eea-air"], context: "arrival and neighborhood planning links" },
  { citySlug: "marseille", cityName: "Marseille", countryName: "France", visualFocus: "general_city_context", extra: ["eea-air"], context: "arrival and neighborhood planning links" },
  { citySlug: "toulouse", cityName: "Toulouse", countryName: "France", visualFocus: "general_city_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "bordeaux", cityName: "Bordeaux", countryName: "France", visualFocus: "general_city_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "nice", cityName: "Nice", countryName: "France", visualFocus: "general_city_context", extra: ["eea-air"], context: "arrival planning links" },
  { citySlug: "strasbourg", cityName: "Strasbourg", countryName: "France", visualFocus: "general_city_context", extra: ["eea-air"], context: "arrival planning links" },
  { citySlug: "rennes", cityName: "Rennes", countryName: "France", visualFocus: "general_city_context", extra: ["eea-air"], context: "arrival planning links" },

  // ===== Germany =====
  { citySlug: "berlin", cityName: "Berlin", countryName: "Germany", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "arrival and neighborhood planning links, moving-to research" },
  { citySlug: "hamburg", cityName: "Hamburg", countryName: "Germany", visualFocus: "general_city_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "munich", cityName: "Munich", countryName: "Germany", visualFocus: "family_visual_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "frankfurt", cityName: "Frankfurt", countryName: "Germany", visualFocus: "arrival_visual_context", extra: ["eea-air"], context: "arrival and neighborhood planning links" },
  { citySlug: "cologne", cityName: "Cologne", countryName: "Germany", visualFocus: "general_city_context", extra: ["eea-air"], context: "arrival and neighborhood planning links" },
  { citySlug: "dusseldorf", cityName: "Düsseldorf", countryName: "Germany", visualFocus: "general_city_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "stuttgart", cityName: "Stuttgart", countryName: "Germany", visualFocus: "general_city_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "leipzig", cityName: "Leipzig", countryName: "Germany", visualFocus: "general_city_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "dresden", cityName: "Dresden", countryName: "Germany", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },

  // ===== Netherlands / Belgium / Luxembourg =====
  { citySlug: "amsterdam", cityName: "Amsterdam", countryName: "Netherlands", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "arrival and neighborhood planning links, moving-to research" },
  { citySlug: "rotterdam", cityName: "Rotterdam", countryName: "Netherlands", visualFocus: "general_city_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "the-hague", cityName: "The Hague", countryName: "Netherlands", visualFocus: "general_city_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "utrecht", cityName: "Utrecht", countryName: "Netherlands", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },
  { citySlug: "brussels", cityName: "Brussels", countryName: "Belgium", visualFocus: "general_city_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "antwerp", cityName: "Antwerp", countryName: "Belgium", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },
  { citySlug: "ghent", cityName: "Ghent", countryName: "Belgium", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },
  { citySlug: "luxembourg-city", cityName: "Luxembourg City", countryName: "Luxembourg", visualFocus: "general_city_context", extra: ["eea-air"], context: "neighborhood planning links" },

  // ===== Spain / Portugal / Italy =====
  { citySlug: "madrid", cityName: "Madrid", countryName: "Spain", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "arrival and neighborhood planning links, moving-to research" },
  { citySlug: "barcelona", cityName: "Barcelona", countryName: "Spain", visualFocus: "neighborhood_visual_context", extra: ["eea-air"], context: "arrival and neighborhood planning links" },
  { citySlug: "valencia", cityName: "Valencia", countryName: "Spain", visualFocus: "remote_work_visual_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "seville", cityName: "Seville", countryName: "Spain", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },
  { citySlug: "malaga", cityName: "Málaga", countryName: "Spain", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },
  { citySlug: "lisbon", cityName: "Lisbon", countryName: "Portugal", visualFocus: "remote_work_visual_context", extra: ["eea-air"], context: "arrival and neighborhood planning links, moving-to research" },
  { citySlug: "porto", cityName: "Porto", countryName: "Portugal", visualFocus: "remote_work_visual_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "rome", cityName: "Rome", countryName: "Italy", visualFocus: "general_city_context", extra: ["eea-air"], context: "arrival and neighborhood planning links" },
  { citySlug: "milan", cityName: "Milan", countryName: "Italy", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "arrival and neighborhood planning links" },
  { citySlug: "florence", cityName: "Florence", countryName: "Italy", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },
  { citySlug: "bologna", cityName: "Bologna", countryName: "Italy", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },
  { citySlug: "turin", cityName: "Turin", countryName: "Italy", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },

  // ===== Austria / Switzerland / Nordics =====
  { citySlug: "vienna", cityName: "Vienna", countryName: "Austria", visualFocus: "family_visual_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "zurich", cityName: "Zürich", countryName: "Switzerland", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "stockholm", cityName: "Stockholm", countryName: "Sweden", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "gothenburg", cityName: "Gothenburg", countryName: "Sweden", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },
  { citySlug: "copenhagen", cityName: "Copenhagen", countryName: "Denmark", visualFocus: "family_visual_context", extra: ["eea-air"], context: "neighborhood planning links" },
  { citySlug: "aarhus", cityName: "Aarhus", countryName: "Denmark", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },
  { citySlug: "helsinki", cityName: "Helsinki", countryName: "Finland", visualFocus: "general_city_context", extra: ["eea-air", "itu-connectivity"], context: "neighborhood planning links" },

  // ===== Central / Eastern Europe =====
  { citySlug: "prague", cityName: "Prague", countryName: "Czechia", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },
  { citySlug: "warsaw", cityName: "Warsaw", countryName: "Poland", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },
  { citySlug: "krakow", cityName: "Kraków", countryName: "Poland", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },
  { citySlug: "budapest", cityName: "Budapest", countryName: "Hungary", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },
  { citySlug: "athens", cityName: "Athens", countryName: "Greece", visualFocus: "general_city_context", extra: ["eea-air"], context: "city context" },

  // ===== United States =====
  { citySlug: "new-york", cityName: "New York", countryName: "United States", visualFocus: "relocation_visual_context", extra: ["epa-naaqs"], context: "arrival and neighborhood planning links, moving-to research" },
  { citySlug: "los-angeles", cityName: "Los Angeles", countryName: "United States", visualFocus: "relocation_visual_context", extra: ["epa-naaqs"], context: "neighborhood planning links" },
  { citySlug: "chicago", cityName: "Chicago", countryName: "United States", visualFocus: "relocation_visual_context", extra: ["epa-naaqs"], context: "neighborhood planning links" },
  { citySlug: "boston", cityName: "Boston", countryName: "United States", visualFocus: "family_visual_context", extra: ["epa-naaqs"], context: "neighborhood planning links" },
  { citySlug: "washington-dc", cityName: "Washington DC", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "neighborhood planning links" },
  { citySlug: "san-francisco", cityName: "San Francisco", countryName: "United States", visualFocus: "remote_work_visual_context", extra: ["epa-naaqs"], context: "neighborhood planning links" },
  { citySlug: "seattle", cityName: "Seattle", countryName: "United States", visualFocus: "remote_work_visual_context", extra: ["epa-naaqs"], context: "neighborhood planning links" },
  { citySlug: "austin", cityName: "Austin", countryName: "United States", visualFocus: "remote_work_visual_context", extra: ["epa-naaqs"], context: "neighborhood planning links" },
  { citySlug: "denver", cityName: "Denver", countryName: "United States", visualFocus: "remote_work_visual_context", extra: ["epa-naaqs"], context: "neighborhood planning links" },
  { citySlug: "miami", cityName: "Miami", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "neighborhood planning links" },
  { citySlug: "nashville", cityName: "Nashville", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "arrival and neighborhood planning links" },
  { citySlug: "philadelphia", cityName: "Philadelphia", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "neighborhood planning links" },
  { citySlug: "atlanta", cityName: "Atlanta", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "city context" },
  { citySlug: "phoenix", cityName: "Phoenix", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "city context" },
  { citySlug: "san-diego", cityName: "San Diego", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "city context" },
  { citySlug: "portland", cityName: "Portland", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "city context" },
  { citySlug: "dallas", cityName: "Dallas", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "city context" },
  { citySlug: "houston", cityName: "Houston", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "city context" },
  { citySlug: "pittsburgh", cityName: "Pittsburgh", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "city context" },
  { citySlug: "salt-lake-city", cityName: "Salt Lake City", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "arrival planning links" },

  // ===== Canada =====
  { citySlug: "toronto", cityName: "Toronto", countryName: "Canada", visualFocus: "relocation_visual_context", extra: ["canada-emergency"], context: "neighborhood planning links" },
  { citySlug: "vancouver", cityName: "Vancouver", countryName: "Canada", visualFocus: "relocation_visual_context", extra: ["canada-emergency"], context: "neighborhood planning links" },
  { citySlug: "montreal", cityName: "Montréal", countryName: "Canada", visualFocus: "relocation_visual_context", extra: ["canada-emergency"], context: "neighborhood planning links" },
  { citySlug: "ottawa", cityName: "Ottawa", countryName: "Canada", visualFocus: "family_visual_context", extra: ["canada-emergency"], context: "neighborhood planning links" },
  { citySlug: "calgary", cityName: "Calgary", countryName: "Canada", visualFocus: "general_city_context", extra: ["canada-emergency"], context: "city context" },
  { citySlug: "edmonton", cityName: "Edmonton", countryName: "Canada", visualFocus: "general_city_context", extra: ["canada-emergency"], context: "arrival planning links" },
  { citySlug: "quebec-city", cityName: "Québec City", countryName: "Canada", visualFocus: "general_city_context", extra: ["canada-emergency"], context: "arrival planning links" },
  { citySlug: "halifax", cityName: "Halifax", countryName: "Canada", visualFocus: "general_city_context", extra: ["canada-emergency"], context: "arrival planning links" },

  // ===== Australia / New Zealand =====
  { citySlug: "sydney", cityName: "Sydney", countryName: "Australia", visualFocus: "relocation_visual_context", extra: ["triple-zero-au"], context: "arrival and neighborhood planning links" },
  { citySlug: "melbourne", cityName: "Melbourne", countryName: "Australia", visualFocus: "relocation_visual_context", extra: ["triple-zero-au"], context: "arrival and neighborhood planning links" },
  { citySlug: "brisbane", cityName: "Brisbane", countryName: "Australia", visualFocus: "general_city_context", extra: ["triple-zero-au"], context: "neighborhood planning links" },
  { citySlug: "perth", cityName: "Perth", countryName: "Australia", visualFocus: "general_city_context", extra: ["triple-zero-au"], context: "arrival planning links" },
  { citySlug: "adelaide", cityName: "Adelaide", countryName: "Australia", visualFocus: "general_city_context", extra: ["triple-zero-au"], context: "city context" },
  { citySlug: "auckland", cityName: "Auckland", countryName: "New Zealand", visualFocus: "general_city_context", extra: ["nz-police-111"], context: "arrival planning links" },
  { citySlug: "wellington", cityName: "Wellington", countryName: "New Zealand", visualFocus: "general_city_context", extra: ["nz-police-111"], context: "arrival planning links" },
  { citySlug: "christchurch", cityName: "Christchurch", countryName: "New Zealand", visualFocus: "general_city_context", extra: ["nz-police-111"], context: "arrival planning links" },
  { citySlug: "canberra", cityName: "Canberra", countryName: "Australia", visualFocus: "general_city_context", extra: ["triple-zero-au"], context: "city context" },

  // === Batch four (2026-06-01): +49 visual-guide pages ===
  { citySlug: "york", cityName: "York", countryName: "United Kingdom", visualFocus: "neighborhood_visual_context", extra: ["eea-air"], context: "historic streets and city walls visual context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "southampton", cityName: "Southampton", countryName: "United Kingdom", visualFocus: "arrival_visual_context", extra: ["eea-air"], context: "port and ferry arrival visual context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "aberdeen", cityName: "Aberdeen", countryName: "United Kingdom", visualFocus: "arrival_visual_context", extra: ["eea-air"], context: "harbour and coastal arrival visual context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "dundee", cityName: "Dundee", countryName: "United Kingdom", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "riverside redevelopment and relocation context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "limerick", cityName: "Limerick", countryName: "Ireland", visualFocus: "neighborhood_visual_context", extra: ["eea-air"], context: "Georgian streets and riverside neighborhood context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "waterford", cityName: "Waterford", countryName: "Ireland", visualFocus: "arrival_visual_context", extra: ["eea-air"], context: "river harbour arrival visual context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "nantes", cityName: "Nantes", countryName: "France", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "Loire-side regional relocation context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "lille", cityName: "Lille", countryName: "France", visualFocus: "transport_visual_context", extra: ["eea-air"], context: "cross-border rail and transport visual context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "rouen", cityName: "Rouen", countryName: "France", visualFocus: "neighborhood_visual_context", extra: ["eea-air"], context: "Norman old-town neighborhood context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "reims", cityName: "Reims", countryName: "France", visualFocus: "general_city_context", extra: ["eea-air"], context: "regional city and cathedral context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "tours", cityName: "Tours", countryName: "France", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "Loire valley regional relocation context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "karlsruhe", cityName: "Karlsruhe", countryName: "Germany", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "planned-city civic and relocation context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "essen", cityName: "Essen", countryName: "Germany", visualFocus: "general_city_context", extra: ["eea-air"], context: "Ruhr industrial heritage and city context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "vigo", cityName: "Vigo", countryName: "Spain", visualFocus: "arrival_visual_context", extra: ["eea-air"], context: "Atlantic port and ria arrival context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "santander", cityName: "Santander", countryName: "Spain", visualFocus: "arrival_visual_context", extra: ["eea-air"], context: "Cantabrian coast arrival context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "faro", cityName: "Faro", countryName: "Portugal", visualFocus: "arrival_visual_context", extra: ["eea-air"], context: "Algarve airport and ria arrival context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "aveiro", cityName: "Aveiro", countryName: "Portugal", visualFocus: "arrival_visual_context", extra: ["eea-air"], context: "lagoon-side visual arrival context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "siena", cityName: "Siena", countryName: "Italy", visualFocus: "neighborhood_visual_context", extra: ["eea-air"], context: "medieval old-town neighborhood context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "trieste", cityName: "Trieste", countryName: "Italy", visualFocus: "arrival_visual_context", extra: ["eea-air"], context: "Adriatic port arrival context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "parma", cityName: "Parma", countryName: "Italy", visualFocus: "neighborhood_visual_context", extra: ["eea-air"], context: "historic regional neighborhood context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "lecce", cityName: "Lecce", countryName: "Italy", visualFocus: "neighborhood_visual_context", extra: ["eea-air"], context: "Baroque Salento neighborhood context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "namur", cityName: "Namur", countryName: "Belgium", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "Walloon regional capital relocation context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "liege", cityName: "Liège", countryName: "Belgium", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "Meuse regional relocation context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "tilburg", cityName: "Tilburg", countryName: "Netherlands", visualFocus: "general_city_context", extra: ["eea-air"], context: "regional university city context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "breda", cityName: "Breda", countryName: "Netherlands", visualFocus: "neighborhood_visual_context", extra: ["eea-air"], context: "historic regional neighborhood context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "oulu", cityName: "Oulu", countryName: "Finland", visualFocus: "remote_work_visual_context", extra: ["eea-air"], context: "northern university and remote-work context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "aalborg", cityName: "Aalborg", countryName: "Denmark", visualFocus: "relocation_visual_context", extra: ["eea-air"], context: "northern Jutland regional relocation context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "tartu", cityName: "Tartu", countryName: "Estonia", visualFocus: "remote_work_visual_context", extra: ["eea-air"], context: "university city remote-work context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "klaipeda", cityName: "Klaipėda", countryName: "Lithuania", visualFocus: "arrival_visual_context", extra: ["eea-air"], context: "Baltic ferry port arrival context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "kosice", cityName: "Košice", countryName: "Slovakia", visualFocus: "neighborhood_visual_context", extra: ["eea-air"], context: "old-town and main-street neighborhood context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "lublin", cityName: "Lublin", countryName: "Poland", visualFocus: "neighborhood_visual_context", extra: ["eea-air"], context: "Old Town and castle neighborhood context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "timisoara", cityName: "Timișoara", countryName: "Romania", visualFocus: "neighborhood_visual_context", extra: ["eea-air"], context: "Habsburg quarter neighborhood context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "oradea", cityName: "Oradea", countryName: "Romania", visualFocus: "neighborhood_visual_context", extra: ["eea-air"], context: "Art Nouveau old-town neighborhood context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "varna", cityName: "Varna", countryName: "Bulgaria", visualFocus: "arrival_visual_context", extra: ["eea-air"], context: "Black Sea arrival and coast context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "ann-arbor", cityName: "Ann Arbor", countryName: "United States", visualFocus: "remote_work_visual_context", extra: ["epa-naaqs"], context: "university and tech remote-work context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "new-orleans", cityName: "New Orleans", countryName: "United States", visualFocus: "neighborhood_visual_context", extra: ["epa-naaqs"], context: "French Quarter and neighborhood context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "louisville", cityName: "Louisville", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "Ohio River regional city context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "oklahoma-city", cityName: "Oklahoma City", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "plains regional city context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "omaha", cityName: "Omaha", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "Missouri River regional city context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "boise", cityName: "Boise", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "foothills regional city context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "tucson", cityName: "Tucson", countryName: "United States", visualFocus: "general_city_context", extra: ["epa-naaqs"], context: "desert valley regional city context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "regina", cityName: "Regina", countryName: "Canada", visualFocus: "general_city_context", extra: ["canada-emergency"], context: "Saskatchewan prairie regional city context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "townsville", cityName: "Townsville", countryName: "Australia", visualFocus: "arrival_visual_context", extra: ["triple-zero-au"], context: "tropical coast arrival context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "toowoomba", cityName: "Toowoomba", countryName: "Australia", visualFocus: "family_visual_context", extra: ["triple-zero-au"], context: "Garden City and family visual context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "ballarat", cityName: "Ballarat", countryName: "Australia", visualFocus: "neighborhood_visual_context", extra: ["triple-zero-au"], context: "gold-rush heritage neighborhood context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "bendigo", cityName: "Bendigo", countryName: "Australia", visualFocus: "neighborhood_visual_context", extra: ["triple-zero-au"], context: "gold-rush heritage neighborhood context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "launceston", cityName: "Launceston", countryName: "Australia", visualFocus: "arrival_visual_context", extra: ["triple-zero-au"], context: "Tamar river arrival context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "palmerston-north", cityName: "Palmerston North", countryName: "New Zealand", visualFocus: "remote_work_visual_context", extra: ["nz-police-111"], context: "university and remote-work visual context", updatedDate: BATCH_4_UPDATED_DATE },
  { citySlug: "nelson", cityName: "Nelson", countryName: "New Zealand", visualFocus: "arrival_visual_context", extra: ["nz-police-111"], context: "Tasman bay arrival context", updatedDate: BATCH_4_UPDATED_DATE },
];

export const visualCityGuidePages: VisualCityGuidePage[] = seeds.map((seed) => ({
  citySlug: seed.citySlug,
  title: `Visual Guide to ${seed.cityName}`,
  summary: summary(seed.cityName, seed.countryName, seed.context),
  visualFocus: seed.visualFocus,
  updatedDate: seed.updatedDate ?? BATCH_1_UPDATED_DATE,
  dataYear: DATA_YEAR,
  sourceIds: visualSources(seed.extra),
}));

export const visualGuideSections: readonly VisualGuideSection[] = [
  {
    label: "Urban form and density",
    description:
      "Use verified imagery to orient around the city's general form, density, and street-level texture. Confirm any specific district or address with official local sources rather than reading exact facts from a single image.",
    category: "urban_form",
  },
  {
    label: "Transport and arrival context",
    description:
      "Hero and secondary imagery can hint at the city's mobility patterns. Confirm routes, fares, and schedules through the official local transport authority — this guide does not publish them.",
    category: "transport_context",
  },
  {
    label: "Climate and seasonal context",
    description:
      "Verified imagery captures a single moment. Use the city profile's climate framing and the country hub for seasonal expectations rather than inferring climate from one image.",
    category: "climate_context",
  },
  {
    label: "Public realm and daily-life context",
    description:
      "Imagery suggests how public space looks. Verify everyday details — safety, healthcare access, services — with the country emergency and healthcare profiles and official local sources.",
    category: "public_realm",
  },
  {
    label: "Country and regional context",
    description:
      "Open the country hub for verified emergency, healthcare, and transport-authority context alongside the visual guide. The hero image is orientation, not evidence.",
    category: "regional_context",
  },
];

export function getVisualGuideSections(): readonly VisualGuideSection[] {
  return visualGuideSections;
}
