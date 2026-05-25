import { DATA_YEAR } from "@/lib/data/constants";
import type {
  MovingChecklistItem,
  MovingFocus,
  MovingToCityPage,
} from "@/types";

/**
 * Curated "Moving to {City}" planning pages. Every entry references
 * an existing city slug from `lib/data/cities.ts` and existing source
 * IDs from `lib/data/sources/`.
 *
 * These pages are NOT:
 *  - immigration / visa advice
 *  - tax advice
 *  - legal advice
 *  - medical advice
 *  - a rental-price guide
 *  - a property-buying guide
 *  - an official relocation instruction service
 *  - a city ranking page
 *
 * They give users a structured *relocation research checklist* that
 * routes back to the platform's city, country, neighborhood-planning,
 * arrival, transport, public-safety, healthcare, and budgeting layers.
 * They do not name neighborhoods, publish rent or sale prices, salary
 * expectations, visa rules, tax rules, school rankings, crime rates,
 * transport times, or "best" / "cheapest" / "safest" claims.
 *
 * Strict geographic scope for this first batch: European Union,
 * United Kingdom / Ireland, United States, Canada, Australia, and
 * Switzerland. Cities outside these regions are deferred to a future
 * batch.
 */

const BATCH_1_UPDATED_DATE = "2026-05-25";

const COMMON_SOURCES: readonly string[] = [
  "un-habitat",
  "nasa-power",
  "ipcc-urban",
];

function movingSources(extra: readonly string[] = []): string[] {
  return Array.from(new Set([...COMMON_SOURCES, ...extra]));
}

const FOCUS_LABEL: Record<MovingFocus, string> = {
  relocation_research: "Relocation research",
  family_move: "Family relocation",
  remote_work_move: "Remote-work relocation",
  career_move: "Career relocation",
  student_move: "Student relocation",
  general_move: "General relocation",
};

export function getMovingFocusLabel(focus: MovingFocus): string {
  return FOCUS_LABEL[focus];
}

export const movingToCityPages: MovingToCityPage[] = [
  // ===== United Kingdom / Ireland (10) =====
  {
    citySlug: "london",
    title: "Moving to London: Planning Guide",
    summary:
      "Plan relocation research for London using city intelligence, United Kingdom country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, public-safety references, and transport context. Not immigration, visa, tax, legal, financial, medical, or property advice.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air", "itu-connectivity"]),
  },
  {
    citySlug: "manchester",
    title: "Moving to Manchester: Planning Guide",
    summary:
      "Organize relocation research for Manchester using the city profile, United Kingdom country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "birmingham",
    title: "Moving to Birmingham: Planning Guide",
    summary:
      "Plan relocation research for Birmingham using the city profile, United Kingdom country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "bristol",
    title: "Moving to Bristol: Planning Guide",
    summary:
      "Organize relocation research for Bristol using the city profile, United Kingdom country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "glasgow",
    title: "Moving to Glasgow: Planning Guide",
    summary:
      "Plan relocation research for Glasgow using the city profile, United Kingdom country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "edinburgh",
    title: "Moving to Edinburgh: Planning Guide",
    summary:
      "Organize relocation research for Edinburgh using the city profile, United Kingdom country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "oxford",
    title: "Moving to Oxford: Planning Guide",
    summary:
      "Plan relocation research for Oxford using the city profile, United Kingdom country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "student_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "cambridge",
    title: "Moving to Cambridge: Planning Guide",
    summary:
      "Organize relocation research for Cambridge using the city profile, United Kingdom country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "student_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air", "itu-connectivity"]),
  },
  {
    citySlug: "liverpool",
    title: "Moving to Liverpool: Planning Guide",
    summary:
      "Plan relocation research for Liverpool using the city profile, United Kingdom country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "dublin",
    title: "Moving to Dublin: Planning Guide",
    summary:
      "Organize relocation research for Dublin using the city profile, Irish country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "career_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },

  // ===== France (5) =====
  {
    citySlug: "paris",
    title: "Moving to Paris: Planning Guide",
    summary:
      "Plan relocation research for Paris using the city profile, French country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "lyon",
    title: "Moving to Lyon: Planning Guide",
    summary:
      "Organize relocation research for Lyon using the city profile, French country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "marseille",
    title: "Moving to Marseille: Planning Guide",
    summary:
      "Plan relocation research for Marseille using the city profile, French country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "toulouse",
    title: "Moving to Toulouse: Planning Guide",
    summary:
      "Organize relocation research for Toulouse using the city profile, French country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "bordeaux",
    title: "Moving to Bordeaux: Planning Guide",
    summary:
      "Plan relocation research for Bordeaux using the city profile, French country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },

  // ===== Germany (8) =====
  {
    citySlug: "berlin",
    title: "Moving to Berlin: Planning Guide",
    summary:
      "Plan relocation research for Berlin using the city profile, German country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "hamburg",
    title: "Moving to Hamburg: Planning Guide",
    summary:
      "Organize relocation research for Hamburg using the city profile, German country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "munich",
    title: "Moving to Munich: Planning Guide",
    summary:
      "Plan relocation research for Munich using the city profile, German country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "family_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "frankfurt",
    title: "Moving to Frankfurt: Planning Guide",
    summary:
      "Organize relocation research for Frankfurt using the city profile, German country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "career_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "cologne",
    title: "Moving to Cologne: Planning Guide",
    summary:
      "Plan relocation research for Cologne using the city profile, German country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "dusseldorf",
    title: "Moving to Düsseldorf: Planning Guide",
    summary:
      "Organize relocation research for Düsseldorf using the city profile, German country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "career_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "stuttgart",
    title: "Moving to Stuttgart: Planning Guide",
    summary:
      "Plan relocation research for Stuttgart using the city profile, German country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "career_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "leipzig",
    title: "Moving to Leipzig: Planning Guide",
    summary:
      "Organize relocation research for Leipzig using the city profile, German country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },

  // ===== Netherlands / Belgium / Luxembourg (5) =====
  {
    citySlug: "amsterdam",
    title: "Moving to Amsterdam: Planning Guide",
    summary:
      "Plan relocation research for Amsterdam using the city profile, Dutch country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "rotterdam",
    title: "Moving to Rotterdam: Planning Guide",
    summary:
      "Organize relocation research for Rotterdam using the city profile, Dutch country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "the-hague",
    title: "Moving to The Hague: Planning Guide",
    summary:
      "Plan relocation research for The Hague using the city profile, Dutch country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "brussels",
    title: "Moving to Brussels: Planning Guide",
    summary:
      "Organize relocation research for Brussels using the city profile, Belgian country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "career_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "luxembourg-city",
    title: "Moving to Luxembourg City: Planning Guide",
    summary:
      "Plan relocation research for Luxembourg City using the city profile, Luxembourg country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "career_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },

  // ===== Spain / Portugal / Italy (8) =====
  {
    citySlug: "madrid",
    title: "Moving to Madrid: Planning Guide",
    summary:
      "Plan relocation research for Madrid using the city profile, Spanish country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "barcelona",
    title: "Moving to Barcelona: Planning Guide",
    summary:
      "Organize relocation research for Barcelona using the city profile, Spanish country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "valencia",
    title: "Moving to Valencia: Planning Guide",
    summary:
      "Plan relocation research for Valencia using the city profile, Spanish country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "remote_work_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "lisbon",
    title: "Moving to Lisbon: Planning Guide",
    summary:
      "Organize relocation research for Lisbon using the city profile, Portuguese country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "remote_work_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "porto",
    title: "Moving to Porto: Planning Guide",
    summary:
      "Plan relocation research for Porto using the city profile, Portuguese country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "remote_work_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "rome",
    title: "Moving to Rome: Planning Guide",
    summary:
      "Organize relocation research for Rome using the city profile, Italian country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "milan",
    title: "Moving to Milan: Planning Guide",
    summary:
      "Plan relocation research for Milan using the city profile, Italian country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "career_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "florence",
    title: "Moving to Florence: Planning Guide",
    summary:
      "Organize relocation research for Florence using the city profile, Italian country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },

  // ===== Austria / Switzerland / Nordics (5) =====
  {
    citySlug: "vienna",
    title: "Moving to Vienna: Planning Guide",
    summary:
      "Plan relocation research for Vienna using the city profile, Austrian country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "family_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "zurich",
    title: "Moving to Zürich: Planning Guide",
    summary:
      "Organize relocation research for Zürich using the city profile, Swiss country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "career_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "stockholm",
    title: "Moving to Stockholm: Planning Guide",
    summary:
      "Plan relocation research for Stockholm using the city profile, Swedish country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "career_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "copenhagen",
    title: "Moving to Copenhagen: Planning Guide",
    summary:
      "Organize relocation research for Copenhagen using the city profile, Danish country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "family_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air"]),
  },
  {
    citySlug: "helsinki",
    title: "Moving to Helsinki: Planning Guide",
    summary:
      "Plan relocation research for Helsinki using the city profile, Finnish country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["eea-air", "itu-connectivity"]),
  },

  // ===== United States (12) =====
  {
    citySlug: "new-york",
    title: "Moving to New York: Planning Guide",
    summary:
      "Plan relocation research for New York using the city profile, United States country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["epa-naaqs"]),
  },
  {
    citySlug: "los-angeles",
    title: "Moving to Los Angeles: Planning Guide",
    summary:
      "Organize relocation research for Los Angeles using the city profile, United States country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["epa-naaqs"]),
  },
  {
    citySlug: "chicago",
    title: "Moving to Chicago: Planning Guide",
    summary:
      "Plan relocation research for Chicago using the city profile, United States country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["epa-naaqs"]),
  },
  {
    citySlug: "boston",
    title: "Moving to Boston: Planning Guide",
    summary:
      "Organize relocation research for Boston using the city profile, United States country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "family_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["epa-naaqs"]),
  },
  {
    citySlug: "washington-dc",
    title: "Moving to Washington DC: Planning Guide",
    summary:
      "Plan relocation research for Washington DC using the city profile, United States country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "career_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["epa-naaqs"]),
  },
  {
    citySlug: "san-francisco",
    title: "Moving to San Francisco: Planning Guide",
    summary:
      "Organize relocation research for San Francisco using the city profile, United States country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "remote_work_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["epa-naaqs"]),
  },
  {
    citySlug: "seattle",
    title: "Moving to Seattle: Planning Guide",
    summary:
      "Plan relocation research for Seattle using the city profile, United States country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "remote_work_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["epa-naaqs"]),
  },
  {
    citySlug: "austin",
    title: "Moving to Austin: Planning Guide",
    summary:
      "Organize relocation research for Austin using the city profile, United States country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "remote_work_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["epa-naaqs"]),
  },
  {
    citySlug: "denver",
    title: "Moving to Denver: Planning Guide",
    summary:
      "Plan relocation research for Denver using the city profile, United States country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "remote_work_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["epa-naaqs"]),
  },
  {
    citySlug: "miami",
    title: "Moving to Miami: Planning Guide",
    summary:
      "Organize relocation research for Miami using the city profile, United States country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["epa-naaqs"]),
  },
  {
    citySlug: "nashville",
    title: "Moving to Nashville: Planning Guide",
    summary:
      "Plan relocation research for Nashville using the city profile, United States country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["epa-naaqs"]),
  },
  {
    citySlug: "philadelphia",
    title: "Moving to Philadelphia: Planning Guide",
    summary:
      "Organize relocation research for Philadelphia using the city profile, United States country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["epa-naaqs"]),
  },

  // ===== Canada (4) =====
  {
    citySlug: "toronto",
    title: "Moving to Toronto: Planning Guide",
    summary:
      "Plan relocation research for Toronto using the city profile, Canadian country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["canada-emergency"]),
  },
  {
    citySlug: "vancouver",
    title: "Moving to Vancouver: Planning Guide",
    summary:
      "Organize relocation research for Vancouver using the city profile, Canadian country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["canada-emergency"]),
  },
  {
    citySlug: "montreal",
    title: "Moving to Montréal: Planning Guide",
    summary:
      "Plan relocation research for Montréal using the city profile, Canadian country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["canada-emergency"]),
  },
  {
    citySlug: "ottawa",
    title: "Moving to Ottawa: Planning Guide",
    summary:
      "Organize relocation research for Ottawa using the city profile, Canadian country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "family_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["canada-emergency"]),
  },

  // ===== Australia (3) =====
  {
    citySlug: "sydney",
    title: "Moving to Sydney: Planning Guide",
    summary:
      "Plan relocation research for Sydney using the city profile, Australian country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["triple-zero-au"]),
  },
  {
    citySlug: "melbourne",
    title: "Moving to Melbourne: Planning Guide",
    summary:
      "Organize relocation research for Melbourne using the city profile, Australian country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["triple-zero-au"]),
  },
  {
    citySlug: "brisbane",
    title: "Moving to Brisbane: Planning Guide",
    summary:
      "Plan relocation research for Brisbane using the city profile, Australian country hub, neighborhood planning, arrival planning, cost tools, healthcare access notes, and transport context.",
    movingFocus: "general_move",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: movingSources(["triple-zero-au"]),
  },
];

export const movingChecklist: readonly MovingChecklistItem[] = [
  // 1. Legal and official requirements
  {
    label: "Identify official government sources",
    description:
      "From the country hub, locate the official immigration, residency, registration, and tax publishers for the destination. Use those sources directly — this guide is not immigration, legal, or tax advice.",
    category: "legal_official",
  },
  {
    label: "Verify immigration / residency rules separately",
    description:
      "Confirm visa, residency, work-permit, and registration rules with the official government source and, where needed, a qualified professional. Rules change; do not rely on third-party summaries.",
    category: "legal_official",
  },
  {
    label: "Keep document copies and a backup",
    description:
      "Carry copies of identification, contracts, and key correspondence (digital and paper). Store an offline backup in a separate location.",
    category: "legal_official",
  },
  {
    label: "Avoid relying on unofficial advice",
    description:
      "Forum and social-media posts are not a substitute for official sources. Confirm anything time-sensitive with a qualified professional or the official publisher.",
    category: "legal_official",
  },

  // 2. Housing research
  {
    label: "Compare neighborhoods using planning criteria",
    description:
      "Use the neighborhood planning guide when available and the structured city context. This guide does not name neighborhoods, publish rent, or claim 'best' / 'safest' / 'cheapest' areas.",
    category: "housing",
  },
  {
    label: "Verify lease and rental terms locally",
    description:
      "Lease, deposit, notice-period, registration, and tax requirements differ by city and country. Confirm everything with the landlord, agent, or official housing authority — this guide is not legal or rental advice.",
    category: "housing",
  },
  {
    label: "Avoid payments before verification",
    description:
      "Do not transfer rent, deposit, or fees before verifying the property, the landlord, and the contract through trusted local channels.",
    category: "housing",
  },
  {
    label: "Document communications",
    description:
      "Keep written records of offers, agreements, and correspondence. Save copies of receipts, contracts, and identification submitted.",
    category: "housing",
  },

  // 3. Cost planning
  {
    label: "Run the cost-of-living calculator",
    description:
      "Use the cost-of-living calculator with your own inputs to scope a monthly budget. The calculator is a planning estimator only — not an official cost measurement.",
    category: "cost_planning",
  },
  {
    label: "Run the travel budget calculator for arrival",
    description:
      "Use the travel budget calculator to scope an arrival and first-month trip budget for the city. Include an emergency buffer.",
    category: "cost_planning",
  },
  {
    label: "Plan deposits and moving expenses without quoting figures",
    description:
      "Think through upfront deposits, broker fees, moving costs, registration fees, and insurance — but verify specific amounts directly with each provider rather than relying on third-party averages.",
    category: "cost_planning",
  },
  {
    label: "Keep an emergency buffer in your relocation budget",
    description:
      "Plan a buffer for delays, changes, healthcare gaps, or unforeseen costs. The travel budget calculator includes an emergency-buffer line for this.",
    category: "cost_planning",
  },

  // 4. Arrival and first week
  {
    label: "Use the city arrival guide if available",
    description:
      "When the city has a structured arrival guide on the platform, use it for first-day planning. It does not publish airport names, fares, schedules, or visa instructions.",
    category: "arrival",
  },
  {
    label: "Save the city profile and country hub offline",
    description:
      "Bookmark the city intelligence profile and country hub before you travel. Save key official sources for offline reference where possible.",
    category: "arrival",
  },
  {
    label: "Confirm your arrival address and route in advance",
    description:
      "Save the destination address, an offline map, and a backup direction in case connectivity is limited on arrival.",
    category: "arrival",
  },
  {
    label: "Keep backup payment and communication options",
    description:
      "Carry one backup payment method appropriate for the country and notify your bank of travel where required. Keep a secondary communication channel available.",
    category: "arrival",
  },

  // 5. Healthcare and public safety
  {
    label: "Review country healthcare access context",
    description:
      "From the country hub, open the verified healthcare access context where available, or the transparent fallback. Confirm registration, insurance, and access through official local sources.",
    category: "healthcare_safety",
  },
  {
    label: "Review public-safety context",
    description:
      "Use the country emergency profile and the official local emergency service. This guide does not publish crime rates, area safety rankings, or operator-level claims.",
    category: "healthcare_safety",
  },
  {
    label: "Verify emergency and healthcare details locally",
    description:
      "Always confirm current emergency numbers, hospital access, and insurance rules with official local sources before you rely on them.",
    category: "healthcare_safety",
  },
  {
    label: "Document emergency contacts and key addresses",
    description:
      "Save emergency contacts (local emergency service, embassy / consulate, trusted contact, employer or school) and key addresses in an offline-accessible note.",
    category: "healthcare_safety",
  },

  // 6. Transport and daily access
  {
    label: "Review the transport / mobility context",
    description:
      "Open the city transport context and the official local mobility authority. Confirm routes, fares, and schedules with the official authority — this guide does not publish them.",
    category: "transport_daily",
  },
  {
    label: "Plan commute and daily-access criteria",
    description:
      "Think through your typical week — work, school, gym, grocery, parks — and use this as a research filter rather than a generic 'best area' search.",
    category: "transport_daily",
  },
  {
    label: "Plan a back-up access route",
    description:
      "Sketch a back-up mobility plan for late evenings, weekends, and disruption days. Verify specifics with the official local transport authority.",
    category: "transport_daily",
  },

  // 7. Work / study / family routines
  {
    label: "Research work / study location access",
    description:
      "Confirm employer or institution requirements, on-site versus remote expectations, and any registration steps directly with the employer, school, or official authority.",
    category: "work_study_family",
  },
  {
    label: "Plan family needs without rankings",
    description:
      "For school, childcare, and healthcare research, use official local registries and authorities — not third-party rankings. This guide does not publish school rankings.",
    category: "work_study_family",
  },
  {
    label: "Plan a remote-work setup",
    description:
      "If you work remotely, confirm connectivity, workspace fallback (coworking, library, café), and time-zone trade-offs before committing to an area.",
    category: "work_study_family",
  },
  {
    label: "Use the relocation checklist for structure",
    description:
      "Open the platform relocation checklist for a structured prompt across documents, housing, healthcare, finances, and the first-week setup.",
    category: "work_study_family",
  },
];

export function getMovingChecklist(): readonly MovingChecklistItem[] {
  return movingChecklist;
}
