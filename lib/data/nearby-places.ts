import { DATA_YEAR } from "@/lib/data/constants";
import type { NearbyWeekendPlace } from "@/types";

/**
 * Curated nearby weekend places connected to existing city profiles.
 *
 * Each record names a real, well-documented public place (park,
 * national park, historic town, waterfront, regional city, lake,
 * island, cultural heritage site) that users can use as a starting
 * point for short-trip research. The records do not publish
 * itineraries, distances, travel times, transport schedules, ticket
 * prices, opening hours, or live conditions.
 *
 * MVP scope:
 *  - 50+ records across 25+ priority cities (EU / UK / IE / US /
 *    CA / AU / NZ + Switzerland only)
 *  - every record's `verificationStatus` starts at `"needs_review"`
 *    while optional fields (`wikidataId`, `officialUrl`,
 *    `commonsCategory`, `latitude`, `longitude`, `image`) are filled
 *    in by a follow-up verification pass
 *  - no images in this batch — the existing verify-place-images
 *    pipeline will resolve them in a later pass
 *  - safe neutral summaries; no "best" / "must-see" / "top" /
 *    "safest" / "cheapest" claims, no exact distances or travel
 *    times, no ticket prices or opening hours
 *
 * Source citations name the urban-data baseline (`un-habitat`,
 * `ipcc-urban`) and the identifier registries (`wikidata`,
 * `wikimedia-commons`) that follow-up verification will populate.
 */

const BATCH_1_UPDATED_DATE = "2026-05-31";

const COMMON_SOURCES: readonly string[] = [
  "un-habitat",
  "ipcc-urban",
  "wikidata",
  "wikimedia-commons",
];

function placeSources(extra: readonly string[] = []): string[] {
  return Array.from(new Set([...COMMON_SOURCES, ...extra]));
}

interface PlaceSeed {
  slug: string;
  name: string;
  countrySlug: string;
  regionName?: string;
  category: NearbyWeekendPlace["category"];
  summary: string;
  connectedCitySlugs: string[];
  distanceBand?: NearbyWeekendPlace["distanceBand"];
  travelModeHint?: NearbyWeekendPlace["travelModeHint"];
  cautionNotes?: string;
}

const seeds: readonly PlaceSeed[] = [
  // ===== United Kingdom / Ireland =====
  {
    slug: "hyde-park-london",
    name: "Hyde Park",
    countrySlug: "united-kingdom",
    regionName: "Greater London",
    category: "park",
    summary:
      "A large royal park in central London. Research access, opening status, transport, and seasonal conditions with official sources before departure.",
    connectedCitySlugs: ["london"],
    distanceBand: "nearby",
    travelModeHint: "walking",
  },
  {
    slug: "richmond-park-london",
    name: "Richmond Park",
    countrySlug: "united-kingdom",
    regionName: "Greater London",
    category: "park",
    summary:
      "The largest of London's royal parks, designated as a National Nature Reserve. Verify access points and current conditions with official sources before departure.",
    connectedCitySlugs: ["london"],
    distanceBand: "nearby",
    travelModeHint: "mixed",
  },
  {
    slug: "kew-gardens-london",
    name: "Royal Botanic Gardens, Kew",
    countrySlug: "united-kingdom",
    regionName: "Greater London",
    category: "cultural_site",
    summary:
      "UNESCO World Heritage botanic gardens on the south-western edge of London. Use official sources to confirm opening times, ticketing, transport access, and seasonal context before departure.",
    connectedCitySlugs: ["london"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "greenwich-london",
    name: "Maritime Greenwich",
    countrySlug: "united-kingdom",
    regionName: "Greater London",
    category: "cultural_site",
    summary:
      "UNESCO World Heritage area covering the Old Royal Naval College, Queen's House, the Royal Observatory, and the National Maritime Museum. Verify opening, ticketing, and transport with official sources before departure.",
    connectedCitySlugs: ["london"],
    distanceBand: "nearby",
    travelModeHint: "mixed",
  },
  {
    slug: "windsor-near-london",
    name: "Windsor",
    countrySlug: "united-kingdom",
    regionName: "Berkshire",
    category: "historic_town",
    summary:
      "A historic Berkshire town west of London, the location of Windsor Castle. Use official sources to confirm transport, opening status, and seasonal context before departure.",
    connectedCitySlugs: ["london"],
    distanceBand: "regional",
    travelModeHint: "train",
  },
  {
    slug: "brighton-near-london",
    name: "Brighton",
    countrySlug: "united-kingdom",
    regionName: "East Sussex",
    category: "regional_city",
    summary:
      "A seaside city on the south coast of England, frequently researched as a weekend trip from London. Brighton also has its own city profile elsewhere in the platform.",
    connectedCitySlugs: ["london"],
    distanceBand: "regional",
    travelModeHint: "train",
  },
  {
    slug: "peak-district-near-manchester",
    name: "Peak District National Park",
    countrySlug: "united-kingdom",
    regionName: "Derbyshire / South Pennines",
    category: "nature",
    summary:
      "England's first national park, spanning hills and moorland east of Manchester. Verify access points, transport, and seasonal conditions with the official park authority before departure.",
    connectedCitySlugs: ["manchester", "sheffield"],
    distanceBand: "regional",
    travelModeHint: "mixed",
  },
  {
    slug: "holyrood-park-edinburgh",
    name: "Holyrood Park",
    countrySlug: "united-kingdom",
    regionName: "City of Edinburgh",
    category: "park",
    summary:
      "A royal park in the heart of Edinburgh containing Arthur's Seat. Use official sources to confirm access and seasonal conditions before departure.",
    connectedCitySlugs: ["edinburgh"],
    distanceBand: "nearby",
    travelModeHint: "walking",
  },
  {
    slug: "pentland-hills-edinburgh",
    name: "Pentland Hills Regional Park",
    countrySlug: "united-kingdom",
    regionName: "Midlothian / West Lothian",
    category: "nature",
    summary:
      "A regional park of upland moor south-west of Edinburgh. Verify trail access and seasonal conditions with the official regional-park authority before departure.",
    connectedCitySlugs: ["edinburgh"],
    distanceBand: "nearby",
    travelModeHint: "car",
  },
  {
    slug: "phoenix-park-dublin",
    name: "Phoenix Park",
    countrySlug: "ireland",
    regionName: "Dublin",
    category: "park",
    summary:
      "One of Europe's largest enclosed urban parks, on the western edge of Dublin. Verify access and opening status with official sources before departure.",
    connectedCitySlugs: ["dublin"],
    distanceBand: "nearby",
    travelModeHint: "mixed",
  },
  {
    slug: "wicklow-mountains-near-dublin",
    name: "Wicklow Mountains National Park",
    countrySlug: "ireland",
    regionName: "County Wicklow",
    category: "nature",
    summary:
      "A mountainous national park south of Dublin. Verify trail and access information with the official national park authority before departure.",
    connectedCitySlugs: ["dublin"],
    distanceBand: "regional",
    travelModeHint: "car",
  },
  {
    slug: "cotswolds-near-oxford",
    name: "Cotswolds",
    countrySlug: "united-kingdom",
    regionName: "Cotswold National Landscape",
    category: "nature",
    summary:
      "A designated National Landscape (formerly AONB) of rolling hills and villages west of Oxford and London. Verify access, transport, and seasonal context with official sources before departure.",
    connectedCitySlugs: ["oxford", "london"],
    distanceBand: "regional",
    travelModeHint: "car",
  },

  // ===== France =====
  {
    slug: "versailles-near-paris",
    name: "Palace of Versailles",
    countrySlug: "france",
    regionName: "Yvelines",
    category: "cultural_site",
    summary:
      "UNESCO World Heritage palace and gardens west of Paris. Verify opening, ticketing, and transport with official sources before departure.",
    connectedCitySlugs: ["paris"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "fontainebleau-near-paris",
    name: "Fontainebleau",
    countrySlug: "france",
    regionName: "Seine-et-Marne",
    category: "cultural_site",
    summary:
      "Historic town south-east of Paris with a UNESCO-listed royal château and surrounding forest. Verify opening, ticketing, and transport with official sources before departure.",
    connectedCitySlugs: ["paris"],
    distanceBand: "regional",
    travelModeHint: "train",
  },
  {
    slug: "chantilly-near-paris",
    name: "Chantilly",
    countrySlug: "france",
    regionName: "Oise",
    category: "historic_town",
    summary:
      "A historic town north of Paris with a Renaissance château, forest, and racecourse. Verify access and opening with official sources before departure.",
    connectedCitySlugs: ["paris"],
    distanceBand: "regional",
    travelModeHint: "train",
  },
  {
    slug: "calanques-near-marseille",
    name: "Calanques National Park",
    countrySlug: "france",
    regionName: "Bouches-du-Rhône",
    category: "nature",
    summary:
      "A coastal national park of cliffs and inlets between Marseille and Cassis. Verify access, seasonal conditions, and any access restrictions with the official park authority before departure.",
    connectedCitySlugs: ["marseille"],
    distanceBand: "nearby",
    travelModeHint: "mixed",
  },
  {
    slug: "beaujolais-near-lyon",
    name: "Beaujolais",
    countrySlug: "france",
    regionName: "Beaujolais",
    category: "general_weekend_place",
    summary:
      "A wine-growing region north of Lyon with rolling hills and historic villages. Verify access and seasonal context with official regional sources before departure.",
    connectedCitySlugs: ["lyon"],
    distanceBand: "regional",
    travelModeHint: "car",
  },

  // ===== Germany =====
  {
    slug: "potsdam-near-berlin",
    name: "Potsdam Palaces and Parks",
    countrySlug: "germany",
    regionName: "Brandenburg",
    category: "cultural_site",
    summary:
      "UNESCO World Heritage ensemble of palaces and parks immediately west of Berlin, centered on Sanssouci. Verify opening, ticketing, and transport with official sources before departure.",
    connectedCitySlugs: ["berlin"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "wannsee-berlin",
    name: "Wannsee",
    countrySlug: "germany",
    regionName: "Berlin",
    category: "lake",
    summary:
      "A lake on the south-western edge of Berlin with public-bathing and ferry access. Verify access and seasonal conditions with official sources before departure.",
    connectedCitySlugs: ["berlin"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "spreewald-near-berlin",
    name: "Spreewald Biosphere Reserve",
    countrySlug: "germany",
    regionName: "Brandenburg",
    category: "nature",
    summary:
      "A UNESCO biosphere reserve of waterways and forests south-east of Berlin. Verify access and seasonal context with the official park authority before departure.",
    connectedCitySlugs: ["berlin"],
    distanceBand: "regional",
    travelModeHint: "car",
  },
  {
    slug: "englischer-garten-munich",
    name: "Englischer Garten",
    countrySlug: "germany",
    regionName: "Bavaria",
    category: "park",
    summary:
      "A large urban park in central Munich. Verify access and seasonal conditions with official sources before departure.",
    connectedCitySlugs: ["munich"],
    distanceBand: "nearby",
    travelModeHint: "walking",
  },
  {
    slug: "lubeck-near-hamburg",
    name: "Lübeck",
    countrySlug: "germany",
    regionName: "Schleswig-Holstein",
    category: "historic_town",
    summary:
      "A UNESCO World Heritage Hanseatic town north-east of Hamburg. Verify opening, transport, and seasonal context with official sources before departure.",
    connectedCitySlugs: ["hamburg"],
    distanceBand: "regional",
    travelModeHint: "train",
  },
  {
    slug: "rheingau-near-frankfurt",
    name: "Rheingau",
    countrySlug: "germany",
    regionName: "Hesse",
    category: "general_weekend_place",
    summary:
      "A Rhine-river wine region west of Frankfurt. Verify access and seasonal context with official regional sources before departure.",
    connectedCitySlugs: ["frankfurt"],
    distanceBand: "regional",
    travelModeHint: "train",
  },
  {
    slug: "heidelberg-near-frankfurt",
    name: "Heidelberg",
    countrySlug: "germany",
    regionName: "Baden-Württemberg",
    category: "regional_city",
    summary:
      "A historic Neckar-river university town south of Frankfurt. Heidelberg also has its own city profile elsewhere in the platform.",
    connectedCitySlugs: ["frankfurt"],
    distanceBand: "regional",
    travelModeHint: "train",
  },

  // ===== Netherlands / Belgium / Luxembourg =====
  {
    slug: "zaanse-schans-near-amsterdam",
    name: "Zaanse Schans",
    countrySlug: "netherlands",
    regionName: "North Holland",
    category: "cultural_site",
    summary:
      "A heritage area of historic windmills and Dutch architecture north of Amsterdam. Verify opening, transport, and seasonal context with official sources before departure.",
    connectedCitySlugs: ["amsterdam"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "haarlem-near-amsterdam",
    name: "Haarlem",
    countrySlug: "netherlands",
    regionName: "North Holland",
    category: "historic_town",
    summary:
      "A historic city west of Amsterdam, easily reached by train. Verify transport with official sources before departure.",
    connectedCitySlugs: ["amsterdam"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "kinderdijk-near-rotterdam",
    name: "Kinderdijk Windmills",
    countrySlug: "netherlands",
    regionName: "South Holland",
    category: "cultural_site",
    summary:
      "A UNESCO World Heritage site of historic windmills south-east of Rotterdam. Verify opening, ticketing, and transport with official sources before departure.",
    connectedCitySlugs: ["rotterdam"],
    distanceBand: "nearby",
    travelModeHint: "mixed",
  },
  {
    slug: "delft-near-rotterdam",
    name: "Delft",
    countrySlug: "netherlands",
    regionName: "South Holland",
    category: "historic_town",
    summary:
      "A historic canal town north-west of Rotterdam. Verify access and transport with official sources before departure.",
    connectedCitySlugs: ["rotterdam", "the-hague"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "bruges-near-brussels",
    name: "Bruges",
    countrySlug: "belgium",
    regionName: "West Flanders",
    category: "regional_city",
    summary:
      "A UNESCO-listed medieval city in West Flanders, frequently researched as a short trip from Brussels. Bruges also has its own city profile elsewhere in the platform.",
    connectedCitySlugs: ["brussels"],
    distanceBand: "regional",
    travelModeHint: "train",
  },
  {
    slug: "ghent-near-brussels",
    name: "Ghent",
    countrySlug: "belgium",
    regionName: "East Flanders",
    category: "regional_city",
    summary:
      "A historic Flemish city east of Bruges and north-west of Brussels. Ghent also has its own city profile elsewhere in the platform.",
    connectedCitySlugs: ["brussels"],
    distanceBand: "regional",
    travelModeHint: "train",
  },

  // ===== Spain / Portugal / Italy =====
  {
    slug: "toledo-near-madrid",
    name: "Toledo",
    countrySlug: "spain",
    regionName: "Castile-La Mancha",
    category: "historic_town",
    summary:
      "A UNESCO World Heritage historic city south of Madrid. Verify opening, ticketing, and transport with official sources before departure.",
    connectedCitySlugs: ["madrid"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "segovia-near-madrid",
    name: "Segovia",
    countrySlug: "spain",
    regionName: "Castile and León",
    category: "historic_town",
    summary:
      "A UNESCO World Heritage historic city north-west of Madrid with a Roman aqueduct and Alcázar. Verify opening, ticketing, and transport with official sources before departure.",
    connectedCitySlugs: ["madrid"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "el-escorial-near-madrid",
    name: "Monastery and Site of the Escurial",
    countrySlug: "spain",
    regionName: "Madrid",
    category: "cultural_site",
    summary:
      "UNESCO World Heritage royal monastery and palace north-west of Madrid. Verify opening, ticketing, and transport with official sources before departure.",
    connectedCitySlugs: ["madrid"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "montserrat-near-barcelona",
    name: "Montserrat",
    countrySlug: "spain",
    regionName: "Catalonia",
    category: "mountain",
    summary:
      "A multi-peaked mountain range and abbey north-west of Barcelona. Verify access and seasonal context with official sources before departure.",
    connectedCitySlugs: ["barcelona"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "sitges-near-barcelona",
    name: "Sitges",
    countrySlug: "spain",
    regionName: "Catalonia",
    category: "waterfront",
    summary:
      "A coastal town south-west of Barcelona. Verify access and seasonal context with official sources before departure.",
    connectedCitySlugs: ["barcelona"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "sintra-near-lisbon",
    name: "Sintra",
    countrySlug: "portugal",
    regionName: "Lisbon Region",
    category: "cultural_site",
    summary:
      "UNESCO World Heritage cultural landscape of palaces and gardens west of Lisbon. Verify opening, ticketing, and transport with official sources before departure.",
    connectedCitySlugs: ["lisbon"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "cascais-near-lisbon",
    name: "Cascais",
    countrySlug: "portugal",
    regionName: "Lisbon Region",
    category: "waterfront",
    summary:
      "A coastal town west of Lisbon on the Estoril line. Verify transport and seasonal context with official sources before departure.",
    connectedCitySlugs: ["lisbon"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "douro-valley-near-porto",
    name: "Alto Douro Wine Region",
    countrySlug: "portugal",
    regionName: "Northern Portugal",
    category: "general_weekend_place",
    summary:
      "A UNESCO World Heritage wine region along the upper Douro east of Porto. Verify access and seasonal context with official regional sources before departure.",
    connectedCitySlugs: ["porto"],
    distanceBand: "regional",
    travelModeHint: "train",
  },
  {
    slug: "tivoli-near-rome",
    name: "Tivoli (Villa d'Este and Villa Adriana)",
    countrySlug: "italy",
    regionName: "Lazio",
    category: "cultural_site",
    summary:
      "A historic town east of Rome containing two UNESCO World Heritage sites (Villa d'Este and Villa Adriana). Verify opening, ticketing, and transport with official sources before departure.",
    connectedCitySlugs: ["rome"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "lake-como-near-milan",
    name: "Lake Como",
    countrySlug: "italy",
    regionName: "Lombardy",
    category: "lake",
    summary:
      "A pre-Alpine lake north of Milan. Verify transport, ferry access, and seasonal context with official sources before departure.",
    connectedCitySlugs: ["milan"],
    distanceBand: "regional",
    travelModeHint: "train",
  },
  {
    slug: "bergamo-near-milan",
    name: "Bergamo",
    countrySlug: "italy",
    regionName: "Lombardy",
    category: "regional_city",
    summary:
      "A historic Lombard city north-east of Milan, frequently researched as a short trip from Milan. Bergamo also has its own city profile elsewhere in the platform.",
    connectedCitySlugs: ["milan"],
    distanceBand: "regional",
    travelModeHint: "train",
  },

  // ===== Austria / Switzerland / Nordics =====
  {
    slug: "schonbrunn-vienna",
    name: "Schönbrunn Palace",
    countrySlug: "austria",
    regionName: "Vienna",
    category: "cultural_site",
    summary:
      "UNESCO World Heritage Habsburg summer palace and gardens in Vienna. Verify opening, ticketing, and transport with official sources before departure.",
    connectedCitySlugs: ["vienna"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "wachau-valley-near-vienna",
    name: "Wachau Cultural Landscape",
    countrySlug: "austria",
    regionName: "Lower Austria",
    category: "cultural_site",
    summary:
      "A UNESCO World Heritage Danube valley west of Vienna with terraced vineyards and historic towns. Verify access and seasonal context with official regional sources before departure.",
    connectedCitySlugs: ["vienna"],
    distanceBand: "regional",
    travelModeHint: "train",
  },
  {
    slug: "drottningholm-near-stockholm",
    name: "Drottningholm Palace",
    countrySlug: "sweden",
    regionName: "Stockholm County",
    category: "cultural_site",
    summary:
      "UNESCO World Heritage royal palace west of Stockholm. Verify opening, ticketing, and transport with official sources before departure.",
    connectedCitySlugs: ["stockholm"],
    distanceBand: "nearby",
    travelModeHint: "ferry",
  },
  {
    slug: "uppsala-near-stockholm",
    name: "Uppsala",
    countrySlug: "sweden",
    regionName: "Uppsala County",
    category: "regional_city",
    summary:
      "A historic university city north of Stockholm, frequently researched as a short trip from Stockholm. Uppsala also has its own city profile elsewhere in the platform.",
    connectedCitySlugs: ["stockholm"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },
  {
    slug: "suomenlinna-helsinki",
    name: "Suomenlinna",
    countrySlug: "finland",
    regionName: "Helsinki",
    category: "island",
    summary:
      "UNESCO World Heritage sea fortress on islands off Helsinki. Verify ferry access and seasonal context with official sources before departure.",
    connectedCitySlugs: ["helsinki"],
    distanceBand: "nearby",
    travelModeHint: "ferry",
  },
  {
    slug: "roskilde-near-copenhagen",
    name: "Roskilde",
    countrySlug: "denmark",
    regionName: "Zealand",
    category: "historic_town",
    summary:
      "A historic town west of Copenhagen with a UNESCO-listed cathedral and the Viking Ship Museum. Verify opening, ticketing, and transport with official sources before departure.",
    connectedCitySlugs: ["copenhagen"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },

  // ===== Central / Eastern Europe =====
  {
    slug: "karlstejn-near-prague",
    name: "Karlštejn Castle",
    countrySlug: "czechia",
    regionName: "Central Bohemia",
    category: "cultural_site",
    summary:
      "A Gothic castle south-west of Prague. Verify opening, ticketing, and transport with official sources before departure.",
    connectedCitySlugs: ["prague"],
    distanceBand: "nearby",
    travelModeHint: "train",
  },

  // ===== United States =====
  {
    slug: "hudson-valley-near-new-york",
    name: "Hudson Valley",
    countrySlug: "united-states",
    regionName: "New York",
    category: "general_weekend_place",
    summary:
      "A river-valley region north of New York City. Verify access, transport, and seasonal context with official regional sources before departure.",
    connectedCitySlugs: ["new-york"],
    distanceBand: "regional",
    travelModeHint: "train",
  },
  {
    slug: "cape-cod-near-boston",
    name: "Cape Cod",
    countrySlug: "united-states",
    regionName: "Massachusetts",
    category: "waterfront",
    summary:
      "A coastal peninsula south-east of Boston. Verify access, transport, and seasonal context with official sources before departure.",
    connectedCitySlugs: ["boston"],
    distanceBand: "regional",
    travelModeHint: "car",
  },
  {
    slug: "shenandoah-near-washington-dc",
    name: "Shenandoah National Park",
    countrySlug: "united-states",
    regionName: "Virginia",
    category: "nature",
    summary:
      "A long mountain national park west of Washington DC. Verify access points and seasonal conditions with the official National Park Service before departure.",
    connectedCitySlugs: ["washington-dc"],
    distanceBand: "regional",
    travelModeHint: "car",
  },
  {
    slug: "muir-woods-near-san-francisco",
    name: "Muir Woods National Monument",
    countrySlug: "united-states",
    regionName: "California",
    category: "nature",
    summary:
      "An old-growth redwood national monument north of San Francisco. Verify access, reservation requirements, and seasonal conditions with the official National Park Service before departure.",
    connectedCitySlugs: ["san-francisco"],
    distanceBand: "nearby",
    travelModeHint: "car",
  },
  {
    slug: "point-reyes-near-san-francisco",
    name: "Point Reyes National Seashore",
    countrySlug: "united-states",
    regionName: "California",
    category: "waterfront",
    summary:
      "A coastal national seashore north-west of San Francisco. Verify access, trail status, and seasonal conditions with the official National Park Service before departure.",
    connectedCitySlugs: ["san-francisco"],
    distanceBand: "regional",
    travelModeHint: "car",
  },
  {
    slug: "olympic-near-seattle",
    name: "Olympic National Park",
    countrySlug: "united-states",
    regionName: "Washington",
    category: "nature",
    summary:
      "A national park covering the Olympic Peninsula west of Seattle. Verify access, ferry connections, and seasonal conditions with the official National Park Service before departure.",
    connectedCitySlugs: ["seattle"],
    distanceBand: "regional",
    travelModeHint: "mixed",
  },
  {
    slug: "mount-rainier-near-seattle",
    name: "Mount Rainier National Park",
    countrySlug: "united-states",
    regionName: "Washington",
    category: "mountain",
    summary:
      "A volcanic national park south-east of Seattle. Verify access, reservation requirements, and seasonal conditions with the official National Park Service before departure.",
    connectedCitySlugs: ["seattle"],
    distanceBand: "regional",
    travelModeHint: "car",
  },
  {
    slug: "indiana-dunes-near-chicago",
    name: "Indiana Dunes National Park",
    countrySlug: "united-states",
    regionName: "Indiana",
    category: "waterfront",
    summary:
      "A Lake Michigan shoreline national park east of Chicago. Verify access points and seasonal conditions with the official National Park Service before departure.",
    connectedCitySlugs: ["chicago"],
    distanceBand: "regional",
    travelModeHint: "car",
  },
  {
    slug: "rocky-mountain-near-denver",
    name: "Rocky Mountain National Park",
    countrySlug: "united-states",
    regionName: "Colorado",
    category: "mountain",
    summary:
      "An alpine national park north-west of Denver. Verify access points, reservation requirements, and seasonal conditions with the official National Park Service before departure.",
    connectedCitySlugs: ["denver"],
    distanceBand: "regional",
    travelModeHint: "car",
  },
  {
    slug: "everglades-near-miami",
    name: "Everglades National Park",
    countrySlug: "united-states",
    regionName: "Florida",
    category: "nature",
    summary:
      "A subtropical wetlands national park south-west of Miami. Verify access points, seasonal conditions, and wildlife guidance with the official National Park Service before departure.",
    connectedCitySlugs: ["miami"],
    distanceBand: "regional",
    travelModeHint: "car",
  },

  // ===== Canada =====
  {
    slug: "niagara-falls-near-toronto",
    name: "Niagara Falls",
    countrySlug: "canada",
    regionName: "Ontario",
    category: "waterfront",
    summary:
      "A group of waterfalls on the Niagara River south-west of Toronto on the Canada-US border. Verify access, transport, and seasonal context with official sources before departure.",
    connectedCitySlugs: ["toronto"],
    distanceBand: "regional",
    travelModeHint: "car",
  },
  {
    slug: "stanley-park-vancouver",
    name: "Stanley Park",
    countrySlug: "canada",
    regionName: "British Columbia",
    category: "park",
    summary:
      "A large urban park on the peninsula adjacent to downtown Vancouver. Verify access and seasonal conditions with official sources before departure.",
    connectedCitySlugs: ["vancouver"],
    distanceBand: "nearby",
    travelModeHint: "walking",
  },
  {
    slug: "gatineau-park-near-ottawa",
    name: "Gatineau Park",
    countrySlug: "canada",
    regionName: "Quebec / Outaouais",
    category: "nature",
    summary:
      "A federal park of forests and lakes immediately north of the Ottawa-Gatineau metropolitan area. Verify access points and seasonal conditions with the official park authority before departure.",
    connectedCitySlugs: ["ottawa"],
    distanceBand: "nearby",
    travelModeHint: "car",
  },
  {
    slug: "ile-d-orleans-near-quebec-city",
    name: "Île d'Orléans",
    countrySlug: "canada",
    regionName: "Quebec",
    category: "island",
    summary:
      "An island in the Saint Lawrence River just east of Québec City. Verify access and seasonal context with official sources before departure.",
    connectedCitySlugs: ["quebec-city"],
    distanceBand: "nearby",
    travelModeHint: "car",
  },

  // ===== Australia / New Zealand =====
  {
    slug: "blue-mountains-near-sydney",
    name: "Blue Mountains National Park",
    countrySlug: "australia",
    regionName: "New South Wales",
    category: "nature",
    summary:
      "A UNESCO World Heritage national park west of Sydney. Verify access, trail status, and seasonal conditions with the official park authority before departure.",
    connectedCitySlugs: ["sydney"],
    distanceBand: "regional",
    travelModeHint: "train",
  },
  {
    slug: "royal-national-park-sydney",
    name: "Royal National Park",
    countrySlug: "australia",
    regionName: "New South Wales",
    category: "nature",
    summary:
      "Australia's oldest national park, on the southern edge of Sydney. Verify access points and seasonal conditions with the official park authority before departure.",
    connectedCitySlugs: ["sydney"],
    distanceBand: "nearby",
    travelModeHint: "mixed",
  },
  {
    slug: "phillip-island-near-melbourne",
    name: "Phillip Island",
    countrySlug: "australia",
    regionName: "Victoria",
    category: "island",
    summary:
      "An island south-east of Melbourne. Verify access, seasonal wildlife guidance, and transport with official sources before departure.",
    connectedCitySlugs: ["melbourne"],
    distanceBand: "regional",
    travelModeHint: "car",
  },
  {
    slug: "rottnest-island-near-perth",
    name: "Rottnest Island",
    countrySlug: "australia",
    regionName: "Western Australia",
    category: "island",
    summary:
      "An island off the coast of Perth and Fremantle. Verify ferry access and seasonal context with official sources before departure.",
    connectedCitySlugs: ["perth"],
    distanceBand: "nearby",
    travelModeHint: "ferry",
  },
  {
    slug: "waiheke-island-near-auckland",
    name: "Waiheke Island",
    countrySlug: "new-zealand",
    regionName: "Auckland Region",
    category: "island",
    summary:
      "An island in the Hauraki Gulf east of Auckland. Verify ferry access and seasonal context with official sources before departure.",
    connectedCitySlugs: ["auckland"],
    distanceBand: "nearby",
    travelModeHint: "ferry",
  },
  {
    slug: "fiordland-near-queenstown",
    name: "Fiordland National Park",
    countrySlug: "new-zealand",
    regionName: "Southland",
    category: "nature",
    summary:
      "A UNESCO World Heritage national park south-west of Queenstown. Verify access, trail status, and seasonal conditions with the official park authority before departure.",
    connectedCitySlugs: ["queenstown"],
    distanceBand: "regional",
    travelModeHint: "car",
  },
];

function buildPlace(seed: PlaceSeed): NearbyWeekendPlace {
  return {
    id: `nearby-${seed.slug}`,
    slug: seed.slug,
    name: seed.name,
    countrySlug: seed.countrySlug,
    regionName: seed.regionName,
    category: seed.category,
    summary: seed.summary,
    connectedCitySlugs: seed.connectedCitySlugs,
    sourceIds: placeSources(),
    verificationStatus: "needs_review",
    verifiedAt: BATCH_1_UPDATED_DATE,
    updatedDate: BATCH_1_UPDATED_DATE,
    dataYear: DATA_YEAR,
    travelModeHint: seed.travelModeHint,
    distanceBand: seed.distanceBand,
    cautionNotes: seed.cautionNotes,
  };
}

export const nearbyWeekendPlaces: NearbyWeekendPlace[] = seeds.map(buildPlace);

const CATEGORY_LABEL: Record<NearbyWeekendPlace["category"], string> = {
  nature: "Nature area",
  waterfront: "Waterfront",
  historic_town: "Historic town",
  park: "Park",
  beach: "Beach",
  lake: "Lake",
  mountain: "Mountain area",
  island: "Island",
  cultural_site: "Cultural site",
  regional_city: "Regional city",
  family_outdoor: "Family outdoor",
  general_weekend_place: "Weekend place",
};

export function getNearbyPlaceCategoryLabel(
  category: NearbyWeekendPlace["category"],
): string {
  return CATEGORY_LABEL[category];
}
