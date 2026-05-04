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
      { label: "Urban resilience context", value: "Advanced", description: "Strong public institutions and climate policy improve city implementation capacity." },
      { label: "Energy transition context", value: "Very strong", description: "Clean-energy planning gives cities a favorable national operating environment." },
      { label: "Data confidence", value: "High", description: "European monitoring and reporting systems support indexable, comparable pages." },
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
      { label: "Urban variation", value: "Very high", description: "Large metropolitan differences make city-level pages more useful than national averages." },
      { label: "Air-quality context", value: "Strong monitoring", description: "EPA standards and reporting support pollutant trend interpretation." },
      { label: "Climate exposure", value: "Diverse", description: "Coastal, heat, wildfire, drought, and storm exposure vary sharply by city." },
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
      { label: "Infrastructure reliability", value: "Very high", description: "Urban systems are supported by mature rail, emergency planning, and engineering capacity." },
      { label: "Adaptation priority", value: "High", description: "Heat, flood, storm, and seismic exposure make resilience central." },
      { label: "Urban access", value: "Strong", description: "Dense service networks reduce daily-life friction in major cities." },
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
      { label: "Urban policy context", value: "Strong", description: "Mobility, climate, and public-space reform provide useful city-level comparison signals." },
      { label: "Air-quality context", value: "High transparency", description: "European monitoring supports pollutant comparison and health framing." },
      { label: "Energy priority", value: "Retrofit and heat", description: "Older buildings and heat stress shape city transition strategy." },
    ],
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    iso2: "GB",
    region: "Western Europe",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    intro:
      "The United Kingdom's profile combines strong financial and creative industries with mature climate policy, transit reach, and rising housing pressure in major cities.",
    sources: ["un-habitat", "nasa-power", "eea-air", "ipcc-urban", "itu-connectivity"],
    citySlugs: ["london"],
    metrics: [
      { label: "Urban policy context", value: "Strong", description: "Clean-air zones and net-zero targets shape major-city implementation." },
      { label: "Air-quality context", value: "High transparency", description: "Public monitoring supports pollutant comparison and health framing." },
      { label: "Affordability pressure", value: "High", description: "Housing pressure is the main resident well-being constraint in major cities." },
    ],
  },
  {
    slug: "singapore",
    name: "Singapore",
    iso2: "SG",
    region: "Southeast Asia",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    intro:
      "Singapore's country and city-state profile emphasizes service depth, governance, digital infrastructure, and climate adaptation under hot-and-humid conditions.",
    sources: ["un-habitat", "nasa-power", "ipcc-urban", "itu-connectivity"],
    citySlugs: ["singapore"],
    metrics: [
      { label: "Service depth", value: "Exceptional", description: "Health, transit, and digital services reach near-universal coverage." },
      { label: "Heat adaptation", value: "Active", description: "Continuous urban heat-management investment shapes outdoor design." },
      { label: "Connectivity", value: "Top-tier", description: "Fiber and 5G coverage are essentially universal." },
    ],
  },
  {
    slug: "germany",
    name: "Germany",
    iso2: "DE",
    region: "Central Europe",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    intro:
      "Germany's profile combines strong public services, progressive clean-energy policy, and varied affordability across major cities.",
    sources: ["un-habitat", "nasa-power", "eea-air", "ipcc-urban", "iea-cities"],
    citySlugs: ["berlin"],
    metrics: [
      { label: "Energy transition context", value: "Very strong", description: "National renewable-electricity progress supports city-level transition." },
      { label: "Affordability context", value: "Mixed-favorable", description: "Major cities are more affordable than other Western European peers." },
      { label: "Air-quality context", value: "High transparency", description: "European monitoring supports pollutant comparison and health framing." },
    ],
  },
  {
    slug: "canada",
    name: "Canada",
    iso2: "CA",
    region: "North America",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    intro:
      "Canada's profile combines strong public services, low-carbon electricity in many provinces, and rising housing-cost pressure in major cities.",
    sources: ["un-habitat", "nasa-power", "ipcc-urban", "iea-cities"],
    citySlugs: ["toronto"],
    metrics: [
      { label: "Service depth", value: "High", description: "Public health and education services support strong daily life." },
      { label: "Energy transition context", value: "Favorable grid", description: "Low-carbon electricity in major provinces supports city-level transition." },
      { label: "Affordability pressure", value: "High", description: "Housing-cost pressure is the main resident well-being constraint in major cities." },
    ],
  },
  {
    slug: "australia",
    name: "Australia",
    iso2: "AU",
    region: "Oceania",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    intro:
      "Australia's profile combines high quality of life and outdoor amenity with elevated housing pressure and meaningful climate exposure from heat and bushfire.",
    sources: ["un-habitat", "nasa-power", "ipcc-urban"],
    citySlugs: ["sydney"],
    metrics: [
      { label: "Outdoor amenity", value: "Very high", description: "Coastal and outdoor amenity supports a high quality of daily life." },
      { label: "Climate exposure", value: "Heat and bushfire", description: "Heat and bushfire pressure are central adaptation priorities." },
      { label: "Affordability pressure", value: "High", description: "Housing pressure is the main resident well-being constraint in major cities." },
    ],
  },
];
