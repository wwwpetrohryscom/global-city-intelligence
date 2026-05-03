import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import type { Country } from "@/types";

export const countries: Country[] = [
  {
    slug: "denmark",
    name: "Denmark",
    iso2: "DK",
    region: "Northern Europe",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    intro:
      "Denmark's country profile emphasizes clean-energy governance, high public trust, and urban systems that support healthy daily life.",
    sources: ["un-habitat", "nasa-power", "eea-air", "ipcc-urban"],
    citySlugs: ["copenhagen"],
    metrics: [
      {
        label: "Urban resilience context",
        value: "Advanced",
        description:
          "Strong public institutions and climate policy improve city implementation capacity.",
      },
      {
        label: "Energy transition context",
        value: "Very strong",
        description:
          "Clean-energy planning gives cities a favorable national operating environment.",
      },
      {
        label: "Data confidence",
        value: "High",
        description:
          "European monitoring and reporting systems support indexable, comparable pages.",
      },
    ],
  },
  {
    slug: "united-states",
    name: "United States",
    iso2: "US",
    region: "North America",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    intro:
      "The United States profile combines strong data transparency, large regional variation, and city-level contrasts in affordability, air quality, and climate risk.",
    sources: ["un-habitat", "nasa-power", "epa-naaqs", "ipcc-urban"],
    citySlugs: ["new-york"],
    metrics: [
      {
        label: "Urban variation",
        value: "Very high",
        description:
          "Large metropolitan differences make city-level pages more useful than national averages.",
      },
      {
        label: "Air-quality context",
        value: "Strong monitoring",
        description:
          "EPA standards and reporting support pollutant trend interpretation.",
      },
      {
        label: "Climate exposure",
        value: "Diverse",
        description:
          "Coastal, heat, wildfire, drought, and storm exposure vary sharply by city.",
      },
    ],
  },
  {
    slug: "japan",
    name: "Japan",
    iso2: "JP",
    region: "East Asia",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    intro:
      "Japan's country profile is shaped by dense transit-oriented cities, high infrastructure discipline, and serious climate and seismic adaptation needs.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban"],
    citySlugs: ["tokyo"],
    metrics: [
      {
        label: "Infrastructure reliability",
        value: "Very high",
        description:
          "Urban systems are supported by mature rail, emergency planning, and engineering capacity.",
      },
      {
        label: "Adaptation priority",
        value: "High",
        description:
          "Heat, flood, storm, and seismic exposure make resilience central.",
      },
      {
        label: "Urban access",
        value: "Strong",
        description:
          "Dense service networks reduce daily-life friction in major cities.",
      },
    ],
  },
  {
    slug: "france",
    name: "France",
    iso2: "FR",
    region: "Western Europe",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    intro:
      "France's city profile benefits from European air-quality reporting, transit-rich urban regions, and strong policy pressure toward lower-emission mobility.",
    sources: ["un-habitat", "nasa-power", "eea-air", "ipcc-urban"],
    citySlugs: ["paris"],
    metrics: [
      {
        label: "Urban policy context",
        value: "Strong",
        description:
          "Mobility, climate, and public-space reform provide useful city-level comparison signals.",
      },
      {
        label: "Air-quality context",
        value: "High transparency",
        description:
          "European monitoring supports pollutant comparison and health framing.",
      },
      {
        label: "Energy priority",
        value: "Retrofit and heat",
        description:
          "Older buildings and heat stress shape city transition strategy.",
      },
    ],
  },
];
