import { DATA_YEAR } from "@/lib/data/constants";
import type {
  NeighborhoodChecklistItem,
  NeighborhoodPlanningFocus,
  NeighborhoodPlanningPage,
} from "@/types";

/**
 * Curated city neighborhood planning pages. Every entry references an
 * existing city slug from `lib/data/cities.ts` and existing source IDs
 * from `lib/data/sources/`.
 *
 * These pages are NOT:
 *  - a real-estate listing service
 *  - a rental-price guide
 *  - a neighborhood ranking page
 *  - a crime / safety ranking page
 *  - a school ranking page
 *  - legal, rental, immigration, visa, financial, or medical advice
 *  - an official local guidance source
 *
 * They give users a structured *research checklist* that routes back
 * to the platform's city, country, transport, public-safety,
 * healthcare, arrival, and budgeting layers. They do not name
 * neighborhoods, district boundaries, prices, crime rates, school
 * rankings, hospital proximities, transit operators, walkability
 * scores, or any "best" / "safest" / "cheapest" claims.
 *
 * Strict geographic scope for this first batch: European Union,
 * United Kingdom / Ireland, United States, Canada, Australia, and
 * New Zealand only. Cities outside these regions are deferred to a
 * future batch.
 */

const BATCH_1_UPDATED_DATE = "2026-05-25";

const COMMON_SOURCES: readonly string[] = [
  "un-habitat",
  "nasa-power",
  "ipcc-urban",
];

function planningSources(extra: readonly string[] = []): string[] {
  return Array.from(new Set([...COMMON_SOURCES, ...extra]));
}

const FOCUS_LABEL: Record<NeighborhoodPlanningFocus, string> = {
  relocation_research: "Relocation research",
  family_research: "Family research",
  remote_work_research: "Remote-work research",
  transport_access: "Transport access research",
  arrival_shortlist: "Arrival shortlist research",
  general_research: "General neighborhood research",
};

export function getNeighborhoodPlanningFocusLabel(
  focus: NeighborhoodPlanningFocus,
): string {
  return FOCUS_LABEL[focus];
}

export const neighborhoodPlanningPages: NeighborhoodPlanningPage[] = [
  // ===== United Kingdom / Ireland (10) =====
  {
    citySlug: "london",
    title: "Neighborhood Planning Guide for London",
    summary:
      "Build a neighborhood research checklist for London using city intelligence, United Kingdom country hub, public-safety references, healthcare access notes, transport context, and budgeting tools. Not a real-estate, rental, or safety-ranking service.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air", "itu-connectivity"]),
  },
  {
    citySlug: "manchester",
    title: "Neighborhood Planning Guide for Manchester",
    summary:
      "Plan neighborhood research in Manchester using the city profile, United Kingdom country hub, public-safety references, healthcare access notes, transport access context, and budgeting tools. Not a rental-price guide or area ranking.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "birmingham",
    title: "Neighborhood Planning Guide for Birmingham",
    summary:
      "Structured neighborhood research checklist for Birmingham, with links to city intelligence, United Kingdom country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "bristol",
    title: "Neighborhood Planning Guide for Bristol",
    summary:
      "Plan neighborhood research in Bristol using the city profile, United Kingdom country hub, transport access context, public-safety references, healthcare access notes, and budgeting tools. Not a property or rental service.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "glasgow",
    title: "Neighborhood Planning Guide for Glasgow",
    summary:
      "Structured neighborhood research checklist for Glasgow, linking to city intelligence, United Kingdom country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "edinburgh",
    title: "Neighborhood Planning Guide for Edinburgh",
    summary:
      "Plan neighborhood research in Edinburgh using the city profile, United Kingdom country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "oxford",
    title: "Neighborhood Planning Guide for Oxford",
    summary:
      "Build a neighborhood research checklist for Oxford with city intelligence links, United Kingdom country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "family_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "cambridge",
    title: "Neighborhood Planning Guide for Cambridge",
    summary:
      "Plan neighborhood research in Cambridge using the city profile, United Kingdom country hub, transport context, public-safety references, healthcare access notes, and budgeting tools. Not a property or school-ranking service.",
    planningFocus: "family_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air", "itu-connectivity"]),
  },
  {
    citySlug: "liverpool",
    title: "Neighborhood Planning Guide for Liverpool",
    summary:
      "Structured neighborhood research checklist for Liverpool, with links to city intelligence, United Kingdom country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "dublin",
    title: "Neighborhood Planning Guide for Dublin",
    summary:
      "Plan neighborhood research in Dublin using the city profile, Irish country hub, transport context, public-safety references, healthcare access notes, and budgeting tools. Not a rental or area-ranking service.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },

  // ===== France (5) =====
  {
    citySlug: "paris",
    title: "Neighborhood Planning Guide for Paris",
    summary:
      "Build a neighborhood research checklist for Paris with city intelligence, French country hub, transport access context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "lyon",
    title: "Neighborhood Planning Guide for Lyon",
    summary:
      "Plan neighborhood research in Lyon using the city profile, French country hub, transport access context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "marseille",
    title: "Neighborhood Planning Guide for Marseille",
    summary:
      "Structured neighborhood research checklist for Marseille, with links to city intelligence, French country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "toulouse",
    title: "Neighborhood Planning Guide for Toulouse",
    summary:
      "Plan neighborhood research in Toulouse using the city profile, French country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "bordeaux",
    title: "Neighborhood Planning Guide for Bordeaux",
    summary:
      "Structured neighborhood research checklist for Bordeaux, with links to city intelligence, French country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },

  // ===== Germany (8) =====
  {
    citySlug: "berlin",
    title: "Neighborhood Planning Guide for Berlin",
    summary:
      "Plan neighborhood research in Berlin using the city profile, German country hub, transport access context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "hamburg",
    title: "Neighborhood Planning Guide for Hamburg",
    summary:
      "Structured neighborhood research checklist for Hamburg, with links to city intelligence, German country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "munich",
    title: "Neighborhood Planning Guide for Munich",
    summary:
      "Plan neighborhood research in Munich using the city profile, German country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "family_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "frankfurt",
    title: "Neighborhood Planning Guide for Frankfurt",
    summary:
      "Structured neighborhood research checklist for Frankfurt, with links to city intelligence, German country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "cologne",
    title: "Neighborhood Planning Guide for Cologne",
    summary:
      "Plan neighborhood research in Cologne using the city profile, German country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "dusseldorf",
    title: "Neighborhood Planning Guide for Düsseldorf",
    summary:
      "Structured neighborhood research checklist for Düsseldorf, with links to city intelligence, German country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "stuttgart",
    title: "Neighborhood Planning Guide for Stuttgart",
    summary:
      "Plan neighborhood research in Stuttgart using the city profile, German country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "leipzig",
    title: "Neighborhood Planning Guide for Leipzig",
    summary:
      "Structured neighborhood research checklist for Leipzig, with links to city intelligence, German country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },

  // ===== Netherlands / Belgium / Luxembourg (5) =====
  {
    citySlug: "amsterdam",
    title: "Neighborhood Planning Guide for Amsterdam",
    summary:
      "Plan neighborhood research in Amsterdam using the city profile, Dutch country hub, transport access context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "rotterdam",
    title: "Neighborhood Planning Guide for Rotterdam",
    summary:
      "Structured neighborhood research checklist for Rotterdam, with links to city intelligence, Dutch country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "the-hague",
    title: "Neighborhood Planning Guide for The Hague",
    summary:
      "Plan neighborhood research in The Hague using the city profile, Dutch country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "brussels",
    title: "Neighborhood Planning Guide for Brussels",
    summary:
      "Structured neighborhood research checklist for Brussels, with links to city intelligence, Belgian country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "luxembourg-city",
    title: "Neighborhood Planning Guide for Luxembourg City",
    summary:
      "Plan neighborhood research in Luxembourg City using the city profile, Luxembourg country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },

  // ===== Spain / Portugal / Italy (8) =====
  {
    citySlug: "madrid",
    title: "Neighborhood Planning Guide for Madrid",
    summary:
      "Plan neighborhood research in Madrid using the city profile, Spanish country hub, transport access context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "barcelona",
    title: "Neighborhood Planning Guide for Barcelona",
    summary:
      "Structured neighborhood research checklist for Barcelona, with links to city intelligence, Spanish country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "valencia",
    title: "Neighborhood Planning Guide for Valencia",
    summary:
      "Plan neighborhood research in Valencia using the city profile, Spanish country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "remote_work_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "lisbon",
    title: "Neighborhood Planning Guide for Lisbon",
    summary:
      "Structured neighborhood research checklist for Lisbon, with links to city intelligence, Portuguese country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "remote_work_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "porto",
    title: "Neighborhood Planning Guide for Porto",
    summary:
      "Plan neighborhood research in Porto using the city profile, Portuguese country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "remote_work_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "rome",
    title: "Neighborhood Planning Guide for Rome",
    summary:
      "Structured neighborhood research checklist for Rome, with links to city intelligence, Italian country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "milan",
    title: "Neighborhood Planning Guide for Milan",
    summary:
      "Plan neighborhood research in Milan using the city profile, Italian country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "florence",
    title: "Neighborhood Planning Guide for Florence",
    summary:
      "Structured neighborhood research checklist for Florence, with links to city intelligence, Italian country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },

  // ===== Austria / Switzerland / Nordics (5) =====
  {
    citySlug: "vienna",
    title: "Neighborhood Planning Guide for Vienna",
    summary:
      "Plan neighborhood research in Vienna using the city profile, Austrian country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "family_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "zurich",
    title: "Neighborhood Planning Guide for Zürich",
    summary:
      "Structured neighborhood research checklist for Zürich, with links to city intelligence, Swiss country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "stockholm",
    title: "Neighborhood Planning Guide for Stockholm",
    summary:
      "Plan neighborhood research in Stockholm using the city profile, Swedish country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "copenhagen",
    title: "Neighborhood Planning Guide for Copenhagen",
    summary:
      "Structured neighborhood research checklist for Copenhagen, with links to city intelligence, Danish country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "family_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air"]),
  },
  {
    citySlug: "helsinki",
    title: "Neighborhood Planning Guide for Helsinki",
    summary:
      "Plan neighborhood research in Helsinki using the city profile, Finnish country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["eea-air", "itu-connectivity"]),
  },

  // ===== United States (12) =====
  {
    citySlug: "new-york",
    title: "Neighborhood Planning Guide for New York",
    summary:
      "Plan neighborhood research in New York using the city profile, United States country hub, transport access context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["epa-naaqs"]),
  },
  {
    citySlug: "los-angeles",
    title: "Neighborhood Planning Guide for Los Angeles",
    summary:
      "Structured neighborhood research checklist for Los Angeles, with links to city intelligence, United States country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["epa-naaqs"]),
  },
  {
    citySlug: "chicago",
    title: "Neighborhood Planning Guide for Chicago",
    summary:
      "Plan neighborhood research in Chicago using the city profile, United States country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["epa-naaqs"]),
  },
  {
    citySlug: "boston",
    title: "Neighborhood Planning Guide for Boston",
    summary:
      "Structured neighborhood research checklist for Boston, with links to city intelligence, United States country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "family_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["epa-naaqs"]),
  },
  {
    citySlug: "washington-dc",
    title: "Neighborhood Planning Guide for Washington DC",
    summary:
      "Plan neighborhood research in Washington DC using the city profile, United States country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["epa-naaqs"]),
  },
  {
    citySlug: "san-francisco",
    title: "Neighborhood Planning Guide for San Francisco",
    summary:
      "Structured neighborhood research checklist for San Francisco, with links to city intelligence, United States country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "remote_work_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["epa-naaqs"]),
  },
  {
    citySlug: "seattle",
    title: "Neighborhood Planning Guide for Seattle",
    summary:
      "Plan neighborhood research in Seattle using the city profile, United States country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "remote_work_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["epa-naaqs"]),
  },
  {
    citySlug: "austin",
    title: "Neighborhood Planning Guide for Austin",
    summary:
      "Structured neighborhood research checklist for Austin, with links to city intelligence, United States country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "remote_work_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["epa-naaqs"]),
  },
  {
    citySlug: "denver",
    title: "Neighborhood Planning Guide for Denver",
    summary:
      "Plan neighborhood research in Denver using the city profile, United States country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "remote_work_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["epa-naaqs"]),
  },
  {
    citySlug: "miami",
    title: "Neighborhood Planning Guide for Miami",
    summary:
      "Structured neighborhood research checklist for Miami, with links to city intelligence, United States country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["epa-naaqs"]),
  },
  {
    citySlug: "nashville",
    title: "Neighborhood Planning Guide for Nashville",
    summary:
      "Plan neighborhood research in Nashville using the city profile, United States country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["epa-naaqs"]),
  },
  {
    citySlug: "philadelphia",
    title: "Neighborhood Planning Guide for Philadelphia",
    summary:
      "Structured neighborhood research checklist for Philadelphia, with links to city intelligence, United States country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["epa-naaqs"]),
  },

  // ===== Canada (4) =====
  {
    citySlug: "toronto",
    title: "Neighborhood Planning Guide for Toronto",
    summary:
      "Plan neighborhood research in Toronto using the city profile, Canadian country hub, transport access context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["canada-emergency"]),
  },
  {
    citySlug: "vancouver",
    title: "Neighborhood Planning Guide for Vancouver",
    summary:
      "Structured neighborhood research checklist for Vancouver, with links to city intelligence, Canadian country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["canada-emergency"]),
  },
  {
    citySlug: "montreal",
    title: "Neighborhood Planning Guide for Montréal",
    summary:
      "Plan neighborhood research in Montréal using the city profile, Canadian country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["canada-emergency"]),
  },
  {
    citySlug: "ottawa",
    title: "Neighborhood Planning Guide for Ottawa",
    summary:
      "Structured neighborhood research checklist for Ottawa, with links to city intelligence, Canadian country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "family_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["canada-emergency"]),
  },

  // ===== Australia (3) =====
  {
    citySlug: "sydney",
    title: "Neighborhood Planning Guide for Sydney",
    summary:
      "Plan neighborhood research in Sydney using the city profile, Australian country hub, transport access context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["triple-zero-au"]),
  },
  {
    citySlug: "melbourne",
    title: "Neighborhood Planning Guide for Melbourne",
    summary:
      "Structured neighborhood research checklist for Melbourne, with links to city intelligence, Australian country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "relocation_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["triple-zero-au"]),
  },
  {
    citySlug: "brisbane",
    title: "Neighborhood Planning Guide for Brisbane",
    summary:
      "Plan neighborhood research in Brisbane using the city profile, Australian country hub, transport context, public-safety references, healthcare access notes, and budgeting tools.",
    planningFocus: "general_research",
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    sourceIds: planningSources(["triple-zero-au"]),
  },
];

export const neighborhoodPlanningChecklist: readonly NeighborhoodChecklistItem[] = [
  // Daily access
  {
    label: "Sketch your daily access pattern",
    description:
      "List the places you expect to visit on most days — work, school, gym, grocery, parks — and use this as a research filter rather than a generic 'best area' search.",
    category: "daily_access",
  },
  {
    label: "Check grocery and daily-service access generally",
    description:
      "Confirm that the areas you research have day-to-day services (grocery, pharmacy, post, banking) within a reasonable distance. The city profile links to structured context; verify specific addresses locally.",
    category: "daily_access",
  },
  {
    label: "Plan an arrival address for the first night",
    description:
      "Save the destination address, an offline map, and a backup direction in case connectivity is limited on arrival. Use the city arrival page when one is available.",
    category: "daily_access",
  },

  // Transport fit
  {
    label: "Identify the official transport information source",
    description:
      "Open the country transport profile or city transport context and save the link to the official mobility authority responsible for the local network. Use that source for live information.",
    category: "transport_fit",
  },
  {
    label: "Research transport fit, not specific routes",
    description:
      "Filter areas by transport fit (commute pattern, mobility options, late-night backup) using the city transport context. This guide does not publish routes, fares, schedules, or operator names.",
    category: "transport_fit",
  },
  {
    label: "Plan a late-night and back-up route generally",
    description:
      "Think through a back-up mobility plan for late evenings and weekends. Confirm specifics directly with the official local transport authority.",
    category: "transport_fit",
  },

  // Housing research
  {
    label: "Verify lease and rental terms locally",
    description:
      "Lease and rental terms differ by city and country. Confirm everything — deposit, notice period, registration, taxes — with the local landlord, agent, or official housing authority. This guide is not legal or rental advice.",
    category: "housing_research",
  },
  {
    label: "Inspect documentation and ID requirements",
    description:
      "Check what documents and identification are required to rent or sign a contract. Confirm directly with the landlord, agent, or official local source.",
    category: "housing_research",
  },
  {
    label: "Avoid sending money before verification",
    description:
      "Do not transfer rent, deposit, or fees before verifying the property, the landlord, and the contract through trusted local channels.",
    category: "housing_research",
  },

  // Safety and public services
  {
    label: "Open the country emergency profile",
    description:
      "From the country hub, find the verified emergency contact context where available, or the transparent fallback. Confirm current emergency numbers with the official local service.",
    category: "safety_services",
  },
  {
    label: "Use official local public-safety sources",
    description:
      "For area-level public-safety questions, use official local government and police publishers — not third-party or aggregated rankings. This guide does not publish crime rates or safety rankings.",
    category: "safety_services",
  },
  {
    label: "Share your address with a trusted contact",
    description:
      "Share your accommodation address and an expected check-in time with someone you trust. Keep a back-up contact who can reach you on arrival day.",
    category: "safety_services",
  },

  // Healthcare and family
  {
    label: "Use the country healthcare profile",
    description:
      "Open the country hub for verified healthcare access context where available, or the transparent fallback. Confirm registration, insurance, and access with official local sources.",
    category: "healthcare_family",
  },
  {
    label: "Research family-life context without rankings",
    description:
      "For school and childcare research, use official local registries and school authorities — not third-party rankings. This guide does not publish school rankings.",
    category: "healthcare_family",
  },
  {
    label: "Plan family routines generally",
    description:
      "Think about typical family routines (childcare, school, healthcare, parks) and use this as a research lens. Verify specific options locally.",
    category: "healthcare_family",
  },

  // Remote work / daily productivity
  {
    label: "Research connectivity context",
    description:
      "Open the city intelligence profile and the country digital-readiness context for connectivity framing. Confirm individual building / address connectivity with the local provider.",
    category: "remote_work",
  },
  {
    label: "Plan a workspace fallback",
    description:
      "Think through a workspace fallback — coworking, public library, or quiet café — before relying on a single home setup. Verify hours and access locally.",
    category: "remote_work",
  },
  {
    label: "Consider time-zone and commute trade-offs",
    description:
      "If your work spans time zones, weigh commute and quiet-time needs against neighborhood research before committing to an area.",
    category: "remote_work",
  },

  // Budget planning
  {
    label: "Run the cost-of-living calculator",
    description:
      "Use the cost-of-living calculator with your own inputs to scope a monthly budget for the city. The calculator is a planning estimator only — not an official cost measurement.",
    category: "budget_planning",
  },
  {
    label: "Run the travel budget calculator for arrival",
    description:
      "Use the travel budget calculator to scope an arrival and first-month trip budget for the city. Include an emergency buffer.",
    category: "budget_planning",
  },
  {
    label: "Keep a moving and emergency buffer",
    description:
      "Plan a buffer for moving costs, deposits, and unforeseen expenses. The relocation checklist includes structured prompts for first-week setup.",
    category: "budget_planning",
  },
];

export function getNeighborhoodPlanningChecklist(): readonly NeighborhoodChecklistItem[] {
  return neighborhoodPlanningChecklist;
}
