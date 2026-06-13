import { cities } from "@/lib/data/cities";
import { nearbyWeekendPlaces } from "@/lib/data/nearby-places";
import type { RegionalCollection, RegionType } from "@/types";

/**
 * Regional discovery collections (Phase: local-first regional navigation).
 * Deterministically generated from city + nearby-place coordinates, nearby-place
 * categories, and Wikidata classifications (mountain range P4552, body of water
 * P206 typed sea/lake/river, protected-area operator P137 / parent P361). Each
 * collection is a named natural region with >=5 nearby places across >=2 cities,
 * answering "where else nearby could I spend a day or weekend?" — never popularity
 * or tourism ranking. Members reuse existing /cities/[slug] and
 * /nearby-weekend-places/[slug] routes.
 *
 * Referential + shape integrity (unique slug, valid regionType, >=5 places, >=2
 * cities, no duplicate refs, every city/place resolves, featured subsets) is
 * enforced by `assertRegionalCollections` at module load, so invalid data fails
 * `next build`.
 */
export const REGIONAL_DISCOVERY_COLLECTIONS: readonly RegionalCollection[] = [
  {
    slug: "australia-coast",
    title: "Australia Coast",
    description:
      "Australia Coast groups 9 nearby places across 8 cities for local-first day and weekend discovery — mainly beaches. This is a geographic discovery collection derived from a shared coastline; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "coastal_region",
    cities: ["adelaide", "coffs-harbour", "devonport", "hobart", "mackay", "melbourne", "port-macquarie", "rockhampton"],
    nearbyPlaces: ["bongil-bongil-national-park-near-coffs-harbour", "byfield-national-park-near-rockhampton", "cape-hillsborough-national-park-near-mackay", "crowdy-bay-national-park-near-port-macquarie", "hallett-cove-conservation-park-near-adelaide", "mornington-peninsula-national-park-near-melbourne", "narawntapu-national-park-near-devonport", "south-bruny-national-park-near-hobart", "tasman-national-park-near-hobart"],
    featuredPlaces: ["bongil-bongil-national-park-near-coffs-harbour", "byfield-national-park-near-rockhampton", "cape-hillsborough-national-park-near-mackay", "crowdy-bay-national-park-near-port-macquarie", "hallett-cove-conservation-park-near-adelaide", "mornington-peninsula-national-park-near-melbourne", "narawntapu-national-park-near-devonport", "south-bruny-national-park-near-hobart"],
    featuredCities: ["hobart", "adelaide", "coffs-harbour", "devonport", "mackay", "melbourne"],
  },
  {
    slug: "australia-islands",
    title: "Australia Islands",
    description:
      "Australia Islands groups 5 nearby places across 5 cities for local-first day and weekend discovery — mainly islands. This is a geographic discovery collection derived from island geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "island_region",
    cities: ["brisbane", "geraldton", "melbourne", "perth", "townsville"],
    nearbyPlaces: ["houtman-abrolhos-near-geraldton", "magnetic-island-near-townsville", "north-stradbroke-island-near-brisbane", "phillip-island-near-melbourne", "rottnest-island-near-perth"],
    featuredPlaces: ["houtman-abrolhos-near-geraldton", "magnetic-island-near-townsville", "north-stradbroke-island-near-brisbane", "phillip-island-near-melbourne", "rottnest-island-near-perth"],
    featuredCities: ["brisbane", "geraldton", "melbourne", "perth", "townsville"],
  },
  {
    slug: "australia-mountains",
    title: "Australia Mountains",
    description:
      "Australia Mountains groups 6 nearby places across 6 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["canberra", "hobart", "melbourne", "port-macquarie", "rockhampton", "toowoomba"],
    nearbyPlaces: ["bunya-mountains-national-park-near-toowoomba", "mount-archer-national-park-near-rockhampton", "namadgi-national-park-near-canberra", "werrikimbe-national-park-near-port-macquarie", "you-yangs-regional-park-near-melbourne", "kunanyi-mount-wellington-near-hobart"],
    featuredPlaces: ["bunya-mountains-national-park-near-toowoomba", "mount-archer-national-park-near-rockhampton", "namadgi-national-park-near-canberra", "werrikimbe-national-park-near-port-macquarie", "you-yangs-regional-park-near-melbourne", "kunanyi-mount-wellington-near-hobart"],
    featuredCities: ["canberra", "hobart", "melbourne", "port-macquarie", "rockhampton", "toowoomba"],
  },
  {
    slug: "australia-national-parks",
    title: "Australia National Parks",
    description:
      "Australia National Parks groups 30 nearby places across 22 cities for local-first day and weekend discovery — mainly nature areas, beaches, mountains. This is a geographic discovery collection derived from a shared protected-area system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["adelaide", "ballarat", "brisbane", "cairns", "canberra", "coffs-harbour", "darwin", "devonport", "geraldton", "gold-coast", "hobart", "mackay", "melbourne", "mildura", "perth", "port-macquarie", "rockhampton", "sunshine-coast", "sydney", "toowoomba", "wagga-wagga", "wollongong"],
    nearbyPlaces: ["blue-mountains-near-sydney", "bongil-bongil-national-park-near-coffs-harbour", "budderoo-national-park-near-wollongong", "bunya-mountains-national-park-near-toowoomba", "byfield-national-park-near-rockhampton", "cape-hillsborough-national-park-near-mackay", "cleland-national-park-near-adelaide", "crowdy-bay-national-park-near-port-macquarie", "daguilar-national-park-near-brisbane", "daintree-national-park-near-cairns", "dorrigo-national-park-near-coffs-harbour", "eungella-national-park-near-mackay", "garigal-national-park-near-sydney", "grampians-national-park-near-ballarat", "hattah-kulkyne-national-park-near-mildura", "john-forrest-national-park-near-perth", "kalamunda-national-park-near-perth", "kalbarri-national-park-near-geraldton", "ku-ring-gai-chase-national-park-near-sydney", "lamington-national-park-near-gold-coast", "litchfield-national-park-near-darwin", "livingstone-national-park-near-wagga-wagga", "mole-creek-karst-national-park-near-devonport", "mornington-peninsula-national-park-near-melbourne", "mount-archer-national-park-near-rockhampton", "mount-field-national-park-near-hobart", "namadgi-national-park-near-canberra", "narawntapu-national-park-near-devonport", "nerang-national-park-near-gold-coast", "noosa-national-park-near-sunshine-coast"],
    featuredPlaces: ["blue-mountains-near-sydney", "bongil-bongil-national-park-near-coffs-harbour", "budderoo-national-park-near-wollongong", "bunya-mountains-national-park-near-toowoomba", "byfield-national-park-near-rockhampton", "cape-hillsborough-national-park-near-mackay", "cleland-national-park-near-adelaide", "crowdy-bay-national-park-near-port-macquarie"],
    featuredCities: ["sydney", "coffs-harbour", "devonport", "gold-coast", "mackay", "perth"],
  },
  {
    slug: "australia-nature-escapes",
    title: "Australia Nature Escapes",
    description:
      "Australia Nature Escapes groups 30 nearby places across 21 cities for local-first day and weekend discovery — mainly nature areas, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["adelaide", "albury", "ballarat", "bendigo", "brisbane", "bunbury", "cairns", "coffs-harbour", "darwin", "devonport", "geraldton", "gold-coast", "hobart", "mackay", "mildura", "newcastle", "perth", "sunshine-coast", "sydney", "wagga-wagga", "wollongong"],
    nearbyPlaces: ["blue-mountains-near-sydney", "budderoo-national-park-near-wollongong", "castlemaine-diggings-national-heritage-park-near-bendigo", "cleland-national-park-near-adelaide", "daguilar-national-park-near-brisbane", "daintree-national-park-near-cairns", "dorrigo-national-park-near-coffs-harbour", "eungella-national-park-near-mackay", "garigal-national-park-near-sydney", "grampians-national-park-near-ballarat", "hattah-kulkyne-national-park-near-mildura", "john-forrest-national-park-near-perth", "kalamunda-national-park-near-perth", "kalbarri-national-park-near-geraldton", "ku-ring-gai-chase-national-park-near-sydney", "lamington-national-park-near-gold-coast", "leschenault-estuary-near-bunbury", "litchfield-national-park-near-darwin", "livingstone-national-park-near-wagga-wagga", "mole-creek-karst-national-park-near-devonport", "mount-field-national-park-near-hobart", "nerang-national-park-near-gold-coast", "noosa-national-park-near-sunshine-coast", "royal-national-park-sydney", "springbrook-national-park-near-gold-coast", "tamborine-national-park-near-brisbane", "venman-bushland-national-park-near-brisbane", "walyunga-national-park-near-perth", "watagans-national-park-near-newcastle", "woomargama-national-park-near-albury"],
    featuredPlaces: ["blue-mountains-near-sydney", "budderoo-national-park-near-wollongong", "castlemaine-diggings-national-heritage-park-near-bendigo", "cleland-national-park-near-adelaide", "daguilar-national-park-near-brisbane", "daintree-national-park-near-cairns", "dorrigo-national-park-near-coffs-harbour", "eungella-national-park-near-mackay"],
    featuredCities: ["sydney", "brisbane", "gold-coast", "perth", "adelaide", "albury"],
  },
  {
    slug: "austria-germany-borderlands",
    title: "Austria–Germany Borderlands",
    description:
      "Austria–Germany Borderlands groups 13 nearby places across 5 cities for local-first day and weekend discovery — mainly lakes, mountains, nature areas. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["augsburg", "garmisch-partenkirchen", "innsbruck", "munich", "salzburg"],
    nearbyPlaces: ["achen-lake-near-innsbruck", "karwendel-near-innsbruck", "krimml-waterfalls-near-salzburg", "lake-fuschl-near-salzburg", "natterer-see-near-innsbruck", "patscherkofel-near-innsbruck", "untersberg-near-salzburg", "ammersee-near-augsburg", "eibsee-near-garmisch-partenkirchen", "englischer-garten-munich", "lake-starnberg-near-munich", "tegernsee-near-munich", "zugspitze-near-garmisch-partenkirchen"],
    featuredPlaces: ["achen-lake-near-innsbruck", "ammersee-near-augsburg", "eibsee-near-garmisch-partenkirchen", "englischer-garten-munich", "karwendel-near-innsbruck", "krimml-waterfalls-near-salzburg", "lake-fuschl-near-salzburg", "lake-starnberg-near-munich"],
    featuredCities: ["innsbruck", "munich", "salzburg", "garmisch-partenkirchen", "augsburg"],
  },
  {
    slug: "austria-italy-borderlands",
    title: "Austria–Italy Borderlands",
    description:
      "Austria–Italy Borderlands groups 8 nearby places across 6 cities for local-first day and weekend discovery — mainly mountains, nature areas, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["bolzano", "innsbruck", "klagenfurt", "salzburg", "udine", "verona"],
    nearbyPlaces: ["karawanks-near-klagenfurt", "karwendel-near-innsbruck", "krimml-waterfalls-near-salzburg", "patscherkofel-near-innsbruck", "adige-valley-near-verona", "carnic-alps-near-udine", "dolomites-near-bolzano", "julian-prealps-natural-park-near-udine"],
    featuredPlaces: ["adige-valley-near-verona", "carnic-alps-near-udine", "dolomites-near-bolzano", "julian-prealps-natural-park-near-udine", "karawanks-near-klagenfurt", "karwendel-near-innsbruck", "krimml-waterfalls-near-salzburg", "patscherkofel-near-innsbruck"],
    featuredCities: ["innsbruck", "udine", "bolzano", "klagenfurt", "salzburg", "verona"],
  },
  {
    slug: "austria-lakes",
    title: "Austria Lakes",
    description:
      "Austria Lakes groups 7 nearby places across 5 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["graz", "innsbruck", "klagenfurt", "salzburg", "vienna"],
    nearbyPlaces: ["achen-lake-near-innsbruck", "lake-fuschl-near-salzburg", "lake-neusiedl-near-vienna", "lake-wolfgang-near-salzburg", "natterer-see-near-innsbruck", "stubenberg-am-see-near-graz", "worthersee-near-klagenfurt"],
    featuredPlaces: ["achen-lake-near-innsbruck", "lake-fuschl-near-salzburg", "lake-neusiedl-near-vienna", "lake-wolfgang-near-salzburg", "natterer-see-near-innsbruck", "stubenberg-am-see-near-graz", "worthersee-near-klagenfurt"],
    featuredCities: ["innsbruck", "salzburg", "graz", "klagenfurt", "vienna"],
  },
  {
    slug: "austria-mountains",
    title: "Austria Mountains",
    description:
      "Austria Mountains groups 7 nearby places across 5 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["graz", "innsbruck", "klagenfurt", "salzburg", "vienna"],
    nearbyPlaces: ["gesause-national-park-near-graz", "hohe-wand-near-vienna", "karawanks-near-klagenfurt", "karwendel-near-innsbruck", "patscherkofel-near-innsbruck", "schockl-near-graz", "untersberg-near-salzburg"],
    featuredPlaces: ["gesause-national-park-near-graz", "hohe-wand-near-vienna", "karawanks-near-klagenfurt", "karwendel-near-innsbruck", "patscherkofel-near-innsbruck", "schockl-near-graz", "untersberg-near-salzburg"],
    featuredCities: ["graz", "innsbruck", "klagenfurt", "salzburg", "vienna"],
  },
  {
    slug: "austria-slovenia-borderlands",
    title: "Austria–Slovenia Borderlands",
    description:
      "Austria–Slovenia Borderlands groups 9 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas, mountains, lakes. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["graz", "klagenfurt", "kranj", "ljubljana", "maribor"],
    nearbyPlaces: ["barenschutzklamm-near-graz", "karawanks-near-klagenfurt", "schockl-near-graz", "worthersee-near-klagenfurt", "lake-bled-near-kranj", "lake-bohinj-near-ljubljana", "pohorje-near-maribor", "triglav-national-park-near-kranj", "vipava-valley-near-ljubljana"],
    featuredPlaces: ["barenschutzklamm-near-graz", "karawanks-near-klagenfurt", "lake-bled-near-kranj", "lake-bohinj-near-ljubljana", "pohorje-near-maribor", "schockl-near-graz", "triglav-national-park-near-kranj", "vipava-valley-near-ljubljana"],
    featuredCities: ["graz", "klagenfurt", "kranj", "ljubljana", "maribor"],
  },
  {
    slug: "baltic-sea-coast",
    title: "Baltic Sea Coast",
    description:
      "Baltic Sea Coast groups 6 nearby places across 6 cities for local-first day and weekend discovery — mainly islands, beaches. This is a geographic discovery collection derived from a shared coastline; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "coastal_region",
    cities: ["helsinki", "lubeck", "parnu", "tallinn", "umea", "visby"],
    nearbyPlaces: ["aegna-near-tallinn", "kihnu-near-parnu", "suomenlinna-helsinki", "travemunde-near-lubeck", "gotska-sandon-national-park-near-visby", "holmoarna-near-umea"],
    featuredPlaces: ["aegna-near-tallinn", "gotska-sandon-national-park-near-visby", "holmoarna-near-umea", "kihnu-near-parnu", "suomenlinna-helsinki", "travemunde-near-lubeck"],
    featuredCities: ["helsinki", "lubeck", "parnu", "tallinn", "umea", "visby"],
  },
  {
    slug: "belgium-germany-borderlands",
    title: "Belgium–Germany Borderlands",
    description:
      "Belgium–Germany Borderlands groups 9 nearby places across 7 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["antwerp", "bonn", "cologne", "dusseldorf", "hasselt", "liege", "trier"],
    nearbyPlaces: ["bokrijk-near-hasselt", "hautes-fagnes-nature-reserve-near-liege", "hoge-kempen-national-park-near-antwerp", "eifel-national-park-near-cologne", "hambach-forest-near-cologne", "hunsruck-hochwald-national-park-near-trier", "neandertal-near-dusseldorf", "rhineland-nature-park-near-cologne", "siebengebirge-near-bonn"],
    featuredPlaces: ["bokrijk-near-hasselt", "eifel-national-park-near-cologne", "hambach-forest-near-cologne", "hautes-fagnes-nature-reserve-near-liege", "hoge-kempen-national-park-near-antwerp", "hunsruck-hochwald-national-park-near-trier", "neandertal-near-dusseldorf", "rhineland-nature-park-near-cologne"],
    featuredCities: ["cologne", "antwerp", "bonn", "dusseldorf", "hasselt", "liege"],
  },
  {
    slug: "belgium-netherlands-borderlands",
    title: "Belgium–Netherlands Borderlands",
    description:
      "Belgium–Netherlands Borderlands groups 14 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["antwerp", "breda", "delft", "eindhoven", "hasselt", "liege", "maastricht", "mechelen", "nijmegen", "tilburg"],
    nearbyPlaces: ["bokrijk-near-hasselt", "hautes-fagnes-nature-reserve-near-liege", "hoge-kempen-national-park-near-antwerp", "kalmthoutse-heide-near-antwerp", "nete-near-antwerp", "peerdsbos-near-antwerp", "sonian-forest-near-mechelen", "de-biesbosch-national-park-near-delft", "groote-peel-national-park-near-eindhoven", "de-maasduinen-national-park-near-nijmegen", "loonse-en-drunense-duinen-national-park-near-tilburg", "mastbos-near-breda", "midden-delfland-near-delft", "sint-pietersberg-near-maastricht"],
    featuredPlaces: ["bokrijk-near-hasselt", "de-biesbosch-national-park-near-delft", "groote-peel-national-park-near-eindhoven", "de-maasduinen-national-park-near-nijmegen", "hautes-fagnes-nature-reserve-near-liege", "hoge-kempen-national-park-near-antwerp", "kalmthoutse-heide-near-antwerp", "loonse-en-drunense-duinen-national-park-near-tilburg"],
    featuredCities: ["antwerp", "delft", "breda", "eindhoven", "hasselt", "liege"],
  },
  {
    slug: "belgium-waterside-escapes",
    title: "Belgium Waterside Escapes",
    description:
      "Belgium Waterside Escapes groups 13 nearby places across 8 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["antwerp", "brussels", "ghent", "hasselt", "leuven", "liege", "mechelen", "ostend"],
    nearbyPlaces: ["bokrijk-near-hasselt", "bourgoyen-ossemeersen-near-ghent", "dijle-near-leuven", "flemish-ardennes-near-ghent", "hallerbos-near-brussels", "hautes-fagnes-nature-reserve-near-liege", "hoge-kempen-national-park-near-antwerp", "kalmthoutse-heide-near-antwerp", "lys-near-ghent", "nete-near-antwerp", "peerdsbos-near-antwerp", "sonian-forest-near-mechelen", "yser-near-ostend"],
    featuredPlaces: ["bokrijk-near-hasselt", "bourgoyen-ossemeersen-near-ghent", "dijle-near-leuven", "flemish-ardennes-near-ghent", "hallerbos-near-brussels", "hautes-fagnes-nature-reserve-near-liege", "hoge-kempen-national-park-near-antwerp", "kalmthoutse-heide-near-antwerp"],
    featuredCities: ["antwerp", "ghent", "brussels", "hasselt", "leuven", "liege"],
  },
  {
    slug: "canada-islands",
    title: "Canada Islands",
    description:
      "Canada Islands groups 7 nearby places across 7 cities for local-first day and weekend discovery — mainly islands. This is a geographic discovery collection derived from island geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "island_region",
    cities: ["montreal", "nanaimo", "quebec-city", "st-johns", "toronto", "victoria", "windsor-ontario"],
    nearbyPlaces: ["pelee-island-near-windsor-ontario", "salt-spring-island-near-victoria", "saysutshun-newcastle-island-marine-park-near-nanaimo", "toronto-islands-near-toronto", "witless-bay-ecological-reserve-near-st-johns", "ile-d-orleans-near-quebec-city", "iles-de-boucherville-national-park-near-montreal"],
    featuredPlaces: ["pelee-island-near-windsor-ontario", "salt-spring-island-near-victoria", "saysutshun-newcastle-island-marine-park-near-nanaimo", "toronto-islands-near-toronto", "witless-bay-ecological-reserve-near-st-johns", "ile-d-orleans-near-quebec-city", "iles-de-boucherville-national-park-near-montreal"],
    featuredCities: ["montreal", "nanaimo", "quebec-city", "st-johns", "toronto", "victoria"],
  },
  {
    slug: "canada-mountains",
    title: "Canada Mountains",
    description:
      "Canada Mountains groups 8 nearby places across 4 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["calgary", "nanaimo", "sherbrooke", "vancouver"],
    nearbyPlaces: ["banff-national-park-near-calgary", "garibaldi-provincial-park-near-vancouver", "kananaskis-country-near-calgary", "mont-orford-national-park-near-sherbrooke", "mount-benson-near-nanaimo", "mount-seymour-provincial-park-near-vancouver", "peter-lougheed-provincial-park-near-calgary", "spray-valley-provincial-park-near-calgary"],
    featuredPlaces: ["banff-national-park-near-calgary", "garibaldi-provincial-park-near-vancouver", "kananaskis-country-near-calgary", "mont-orford-national-park-near-sherbrooke", "mount-benson-near-nanaimo", "mount-seymour-provincial-park-near-vancouver", "peter-lougheed-provincial-park-near-calgary", "spray-valley-provincial-park-near-calgary"],
    featuredCities: ["calgary", "vancouver", "nanaimo", "sherbrooke"],
  },
  {
    slug: "canada-national-parks",
    title: "Canada National Parks",
    description:
      "Canada National Parks groups 11 nearby places across 9 cities for local-first day and weekend discovery — mainly nature areas, mountains, parks. This is a geographic discovery collection derived from a shared protected-area system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["calgary", "charlottetown", "edmonton", "gatineau", "halifax", "montreal", "saskatoon", "sherbrooke", "winnipeg"],
    nearbyPlaces: ["banff-national-park-near-calgary", "elk-island-national-park-near-edmonton", "kejimkujik-national-park-near-halifax", "mont-orford-national-park-near-sherbrooke", "mont-tremblant-national-park-near-montreal", "oka-national-park-near-montreal", "plaisance-national-park-near-gatineau", "prince-albert-national-park-near-saskatoon", "prince-edward-island-national-park-near-charlottetown", "riding-mountain-national-park-near-winnipeg", "iles-de-boucherville-national-park-near-montreal"],
    featuredPlaces: ["banff-national-park-near-calgary", "elk-island-national-park-near-edmonton", "kejimkujik-national-park-near-halifax", "mont-orford-national-park-near-sherbrooke", "mont-tremblant-national-park-near-montreal", "oka-national-park-near-montreal", "plaisance-national-park-near-gatineau", "prince-albert-national-park-near-saskatoon"],
    featuredCities: ["montreal", "calgary", "charlottetown", "edmonton", "gatineau", "halifax"],
  },
  {
    slug: "canada-nature-escapes",
    title: "Canada Nature Escapes",
    description:
      "Canada Nature Escapes groups 16 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["edmonton", "gatineau", "halifax", "kitchener", "montreal", "prince-george", "saskatoon", "st-johns", "sudbury", "thunder-bay", "toronto", "vancouver", "victoria", "whitehorse", "winnipeg"],
    nearbyPlaces: ["elk-island-national-park-near-edmonton", "french-river-near-sudbury", "grand-river-near-kitchener", "kejimkujik-national-park-near-halifax", "lake-superior-national-marine-conservation-area-near-thunder-bay", "miles-canyon-near-whitehorse", "mont-tremblant-national-park-near-montreal", "mount-douglas-near-victoria", "nechako-river-near-prince-george", "niagara-falls-near-toronto", "ottawa-river-near-gatineau", "plaisance-national-park-near-gatineau", "prince-albert-national-park-near-saskatoon", "riding-mountain-national-park-near-winnipeg", "signal-hill-near-st-johns", "stanley-park-vancouver"],
    featuredPlaces: ["elk-island-national-park-near-edmonton", "french-river-near-sudbury", "grand-river-near-kitchener", "kejimkujik-national-park-near-halifax", "lake-superior-national-marine-conservation-area-near-thunder-bay", "miles-canyon-near-whitehorse", "mont-tremblant-national-park-near-montreal", "mount-douglas-near-victoria"],
    featuredCities: ["gatineau", "edmonton", "halifax", "kitchener", "montreal", "prince-george"],
  },
  {
    slug: "canada-protected-landscapes",
    title: "Canada Protected Landscapes",
    description:
      "Canada Protected Landscapes groups 11 nearby places across 9 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["kelowna", "ottawa", "regina", "sudbury", "thunder-bay", "toronto", "vancouver", "victoria", "yellowknife"],
    nearbyPlaces: ["foy-provincial-park-near-ottawa", "fred-henne-territorial-park-near-yellowknife", "gatineau-park-near-ottawa", "goldstream-provincial-park-near-victoria", "killarney-provincial-park-near-sudbury", "last-mountain-lake-national-wildlife-area-near-regina", "lynn-canyon-park-near-vancouver", "mer-bleue-bog-near-ottawa", "okanagan-mountain-park-near-kelowna", "rouge-national-urban-park-near-toronto", "sleeping-giant-provincial-park-near-thunder-bay"],
    featuredPlaces: ["foy-provincial-park-near-ottawa", "fred-henne-territorial-park-near-yellowknife", "gatineau-park-near-ottawa", "goldstream-provincial-park-near-victoria", "killarney-provincial-park-near-sudbury", "last-mountain-lake-national-wildlife-area-near-regina", "lynn-canyon-park-near-vancouver", "mer-bleue-bog-near-ottawa"],
    featuredCities: ["ottawa", "kelowna", "regina", "sudbury", "thunder-bay", "toronto"],
  },
  {
    slug: "canada-united-states-borderlands",
    title: "Canada–United States Borderlands",
    description:
      "Canada–United States Borderlands groups 11 nearby places across 8 cities for local-first day and weekend discovery — mainly waterfronts, nature areas, lakes. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["bellingham", "buffalo", "burlington-vt", "kitchener", "seattle", "sherbrooke", "toronto", "victoria"],
    nearbyPlaces: ["goldstream-provincial-park-near-victoria", "grand-river-near-kitchener", "lake-memphremagog-near-sherbrooke", "mount-douglas-near-victoria", "salt-spring-island-near-victoria", "toronto-islands-near-toronto", "deception-pass-state-park-near-seattle", "lake-champlain-near-burlington-vt", "larrabee-state-park-near-bellingham", "niagara-falls-state-park-near-buffalo", "olympic-near-seattle"],
    featuredPlaces: ["deception-pass-state-park-near-seattle", "goldstream-provincial-park-near-victoria", "grand-river-near-kitchener", "lake-champlain-near-burlington-vt", "lake-memphremagog-near-sherbrooke", "larrabee-state-park-near-bellingham", "mount-douglas-near-victoria", "niagara-falls-state-park-near-buffalo"],
    featuredCities: ["victoria", "seattle", "bellingham", "buffalo", "burlington-vt", "kitchener"],
  },
  {
    slug: "carpathians",
    title: "Carpathians",
    description:
      "Carpathians groups 5 nearby places across 5 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["baia-mare", "brno", "cluj-napoca", "iasi", "krakow"],
    nearbyPlaces: ["white-carpathians-near-brno", "beskids-near-krakow", "ceahlau-massif-near-iasi", "fagaras-mountains-near-cluj-napoca", "rodna-mountains-near-baia-mare"],
    featuredPlaces: ["beskids-near-krakow", "ceahlau-massif-near-iasi", "fagaras-mountains-near-cluj-napoca", "rodna-mountains-near-baia-mare", "white-carpathians-near-brno"],
    featuredCities: ["baia-mare", "brno", "cluj-napoca", "iasi", "krakow"],
  },
  {
    slug: "croatia-mountains",
    title: "Croatia Mountains",
    description:
      "Croatia Mountains groups 5 nearby places across 3 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["rijeka", "split", "zagreb"],
    nearbyPlaces: ["biokovo-nature-park-near-split", "medvednica-nature-park-near-zagreb", "mosor-near-split", "papuk-nature-park-near-zagreb", "risnjak-national-park-near-rijeka"],
    featuredPlaces: ["biokovo-nature-park-near-split", "medvednica-nature-park-near-zagreb", "mosor-near-split", "papuk-nature-park-near-zagreb", "risnjak-national-park-near-rijeka"],
    featuredCities: ["split", "zagreb", "rijeka"],
  },
  {
    slug: "czechia-germany-borderlands",
    title: "Czechia–Germany Borderlands",
    description:
      "Czechia–Germany Borderlands groups 16 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas, mountains. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["ceske-budejovice", "dresden", "gorlitz", "karlovy-vary", "leipzig", "liberec", "nuremberg", "passau", "potsdam", "prague"],
    nearbyPlaces: ["bohemian-switzerland-near-prague", "jested-near-liberec", "koneprusy-caves-near-prague", "slavkov-forest-near-karlovy-vary", "trebon-basin-near-ceske-budejovice", "bavarian-forest-near-passau", "bavarian-forest-national-park-near-passau", "dresden-heath-near-dresden", "franconian-switzerland-near-nuremberg", "leipzig-riverside-forest-near-leipzig", "lusatian-mountains-near-dresden", "ore-mountains-near-dresden", "pegnitz-valley-near-nuremberg", "saxon-switzerland-national-park-near-dresden", "spreewald-near-potsdam", "zittau-mountains-near-gorlitz"],
    featuredPlaces: ["bavarian-forest-near-passau", "bavarian-forest-national-park-near-passau", "bohemian-switzerland-near-prague", "dresden-heath-near-dresden", "franconian-switzerland-near-nuremberg", "jested-near-liberec", "koneprusy-caves-near-prague", "leipzig-riverside-forest-near-leipzig"],
    featuredCities: ["dresden", "nuremberg", "passau", "prague", "ceske-budejovice", "gorlitz"],
  },
  {
    slug: "czechia-poland-borderlands",
    title: "Czechia–Poland Borderlands",
    description:
      "Czechia–Poland Borderlands groups 7 nearby places across 6 cities for local-first day and weekend discovery — mainly mountains, nature areas. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["liberec", "olomouc", "ostrava", "prague", "wroclaw", "zakopane"],
    nearbyPlaces: ["beskydy-protected-area-near-ostrava", "bohemian-switzerland-near-prague", "jested-near-liberec", "litovelske-pomoravi-near-olomouc", "giant-mountains-national-park-near-wroclaw", "stolowe-mountains-national-park-near-wroclaw", "tatra-national-park-near-zakopane"],
    featuredPlaces: ["beskydy-protected-area-near-ostrava", "bohemian-switzerland-near-prague", "giant-mountains-national-park-near-wroclaw", "jested-near-liberec", "litovelske-pomoravi-near-olomouc", "stolowe-mountains-national-park-near-wroclaw", "tatra-national-park-near-zakopane"],
    featuredCities: ["wroclaw", "liberec", "olomouc", "ostrava", "prague", "zakopane"],
  },
  {
    slug: "czechia-slovakia-borderlands",
    title: "Czechia–Slovakia Borderlands",
    description:
      "Czechia–Slovakia Borderlands groups 10 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas, mountains. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["banska-bystrica", "bratislava", "brno", "ostrava", "zilina"],
    nearbyPlaces: ["beskydy-protected-area-near-ostrava", "macocha-gorge-near-brno", "moravian-karst-near-brno", "podyji-national-park-near-brno", "white-carpathians-near-brno", "devinska-kobyla-near-bratislava", "little-carpathians-near-bratislava", "mala-fatra-national-park-near-zilina", "sulov-rocks-near-zilina", "velka-fatra-near-banska-bystrica"],
    featuredPlaces: ["beskydy-protected-area-near-ostrava", "devinska-kobyla-near-bratislava", "little-carpathians-near-bratislava", "macocha-gorge-near-brno", "mala-fatra-national-park-near-zilina", "moravian-karst-near-brno", "podyji-national-park-near-brno", "sulov-rocks-near-zilina"],
    featuredCities: ["brno", "bratislava", "zilina", "banska-bystrica", "ostrava"],
  },
  {
    slug: "denmark-germany-borderlands",
    title: "Denmark–Germany Borderlands",
    description:
      "Denmark–Germany Borderlands groups 6 nearby places across 6 cities for local-first day and weekend discovery — mainly islands, waterfronts, nature areas. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["copenhagen", "esbjerg", "flensburg", "kiel", "odense", "rostock"],
    nearbyPlaces: ["fano-near-esbjerg", "stevns-klint-near-copenhagen", "svanninge-bakker-near-odense", "fischland-darss-zingst-near-rostock", "flensburg-fjord-near-flensburg", "holstein-switzerland-near-kiel"],
    featuredPlaces: ["fano-near-esbjerg", "fischland-darss-zingst-near-rostock", "flensburg-fjord-near-flensburg", "holstein-switzerland-near-kiel", "stevns-klint-near-copenhagen", "svanninge-bakker-near-odense"],
    featuredCities: ["copenhagen", "esbjerg", "flensburg", "kiel", "odense", "rostock"],
  },
  {
    slug: "denmark-nature-escapes",
    title: "Denmark Nature Escapes",
    description:
      "Denmark Nature Escapes groups 8 nearby places across 4 cities for local-first day and weekend discovery — mainly nature areas, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["aarhus", "copenhagen", "odense", "roskilde"],
    nearbyPlaces: ["gribskov-near-copenhagen", "gudena-near-aarhus", "hareskoven-near-copenhagen", "kalo-castle-near-aarhus", "mols-bjerge-national-park-near-aarhus", "roskilde-fjord-near-roskilde", "stevns-klint-near-copenhagen", "svanninge-bakker-near-odense"],
    featuredPlaces: ["gribskov-near-copenhagen", "gudena-near-aarhus", "hareskoven-near-copenhagen", "kalo-castle-near-aarhus", "mols-bjerge-national-park-near-aarhus", "roskilde-fjord-near-roskilde", "stevns-klint-near-copenhagen", "svanninge-bakker-near-odense"],
    featuredCities: ["aarhus", "copenhagen", "odense", "roskilde"],
  },
  {
    slug: "denmark-sweden-borderlands",
    title: "Denmark–Sweden Borderlands",
    description:
      "Denmark–Sweden Borderlands groups 9 nearby places across 4 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, beaches. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["copenhagen", "helsingborg", "malmo", "roskilde"],
    nearbyPlaces: ["gribskov-near-copenhagen", "hareskoven-near-copenhagen", "roskilde-fjord-near-roskilde", "stevns-klint-near-copenhagen", "dalby-soderskog-national-park-near-malmo", "falsterbo-near-malmo", "kullaberg-near-malmo", "soderasen-national-park-near-helsingborg", "oresund-near-helsingborg"],
    featuredPlaces: ["dalby-soderskog-national-park-near-malmo", "falsterbo-near-malmo", "gribskov-near-copenhagen", "hareskoven-near-copenhagen", "kullaberg-near-malmo", "roskilde-fjord-near-roskilde", "stevns-klint-near-copenhagen", "soderasen-national-park-near-helsingborg"],
    featuredCities: ["copenhagen", "malmo", "helsingborg", "roskilde"],
  },
  {
    slug: "estonia-finland-borderlands",
    title: "Estonia–Finland Borderlands",
    description:
      "Estonia–Finland Borderlands groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly islands, nature areas. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["helsinki", "tallinn"],
    nearbyPlaces: ["aegna-near-tallinn", "lahemaa-national-park-near-tallinn", "nuuksio-national-park-near-helsinki", "suomenlinna-helsinki", "tammisaari-archipelago-national-park-near-helsinki"],
    featuredPlaces: ["aegna-near-tallinn", "lahemaa-national-park-near-tallinn", "nuuksio-national-park-near-helsinki", "suomenlinna-helsinki", "tammisaari-archipelago-national-park-near-helsinki"],
    featuredCities: ["helsinki", "tallinn"],
  },
  {
    slug: "finland-islands",
    title: "Finland Islands",
    description:
      "Finland Islands groups 5 nearby places across 4 cities for local-first day and weekend discovery — mainly islands. This is a geographic discovery collection derived from island geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "island_region",
    cities: ["helsinki", "oulu", "turku", "vaasa"],
    nearbyPlaces: ["archipelago-national-park-near-turku", "hailuoto-near-oulu", "kvarken-archipelago-near-vaasa", "suomenlinna-helsinki", "tammisaari-archipelago-national-park-near-helsinki"],
    featuredPlaces: ["archipelago-national-park-near-turku", "hailuoto-near-oulu", "kvarken-archipelago-near-vaasa", "suomenlinna-helsinki", "tammisaari-archipelago-national-park-near-helsinki"],
    featuredCities: ["helsinki", "oulu", "turku", "vaasa"],
  },
  {
    slug: "finland-national-parks",
    title: "Finland National Parks",
    description:
      "Finland National Parks groups 9 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas, islands, lakes. This is a geographic discovery collection derived from a shared protected-area system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["helsinki", "jyvaskyla", "rovaniemi", "tampere", "turku"],
    nearbyPlaces: ["archipelago-national-park-near-turku", "helvetinjarvi-national-park-near-tampere", "isojarvi-national-park-near-tampere", "leivonmaki-national-park-near-jyvaskyla", "liesjarvi-national-park-near-helsinki", "nuuksio-national-park-near-helsinki", "pyha-luosto-national-park-near-rovaniemi", "seitseminen-national-park-near-tampere", "tammisaari-archipelago-national-park-near-helsinki"],
    featuredPlaces: ["archipelago-national-park-near-turku", "helvetinjarvi-national-park-near-tampere", "isojarvi-national-park-near-tampere", "leivonmaki-national-park-near-jyvaskyla", "liesjarvi-national-park-near-helsinki", "nuuksio-national-park-near-helsinki", "pyha-luosto-national-park-near-rovaniemi", "seitseminen-national-park-near-tampere"],
    featuredCities: ["helsinki", "tampere", "jyvaskyla", "rovaniemi", "turku"],
  },
  {
    slug: "finland-nature-escapes",
    title: "Finland Nature Escapes",
    description:
      "Finland Nature Escapes groups 7 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["helsinki", "jyvaskyla", "rovaniemi", "tampere", "vaasa"],
    nearbyPlaces: ["helvetinjarvi-national-park-near-tampere", "kemijoki-near-rovaniemi", "leivonmaki-national-park-near-jyvaskyla", "nuuksio-national-park-near-helsinki", "pyha-luosto-national-park-near-rovaniemi", "seitseminen-national-park-near-tampere", "soderfjarden-near-vaasa"],
    featuredPlaces: ["helvetinjarvi-national-park-near-tampere", "kemijoki-near-rovaniemi", "leivonmaki-national-park-near-jyvaskyla", "nuuksio-national-park-near-helsinki", "pyha-luosto-national-park-near-rovaniemi", "seitseminen-national-park-near-tampere", "soderfjarden-near-vaasa"],
    featuredCities: ["rovaniemi", "tampere", "helsinki", "jyvaskyla", "vaasa"],
  },
  {
    slug: "france-germany-borderlands",
    title: "France–Germany Borderlands",
    description:
      "France–Germany Borderlands groups 11 nearby places across 5 cities for local-first day and weekend discovery — mainly mountains, nature areas, lakes. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["freiburg", "karlsruhe", "nancy", "strasbourg", "trier"],
    nearbyPlaces: ["lac-blanc-near-strasbourg", "mont-sainte-odile-near-strasbourg", "northern-vosges-regional-park-near-strasbourg", "parc-naturel-regional-de-lorraine-near-nancy", "vosges-near-strasbourg", "black-forest-national-park-near-karlsruhe", "feldberg-near-freiburg", "hunsruck-hochwald-national-park-near-trier", "schauinsland-near-freiburg", "schluchsee-near-freiburg", "titisee-near-freiburg"],
    featuredPlaces: ["black-forest-national-park-near-karlsruhe", "feldberg-near-freiburg", "hunsruck-hochwald-national-park-near-trier", "lac-blanc-near-strasbourg", "mont-sainte-odile-near-strasbourg", "northern-vosges-regional-park-near-strasbourg", "parc-naturel-regional-de-lorraine-near-nancy", "schauinsland-near-freiburg"],
    featuredCities: ["freiburg", "strasbourg", "karlsruhe", "nancy", "trier"],
  },
  {
    slug: "france-italy-borderlands",
    title: "France–Italy Borderlands",
    description:
      "France–Italy Borderlands groups 9 nearby places across 5 cities for local-first day and weekend discovery — mainly mountains, nature areas. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["aosta", "chambery", "grenoble", "nice", "turin"],
    nearbyPlaces: ["bauges-near-chambery", "massif-de-lesterel-near-nice", "mercantour-national-park-near-nice", "ecrins-national-park-near-grenoble", "gran-paradiso-national-park-near-turin", "la-mandria-regional-park-near-turin", "maritime-alps-natural-park-near-turin", "mont-blanc-near-aosta", "orsiera-rocciavre-natural-park-near-turin"],
    featuredPlaces: ["bauges-near-chambery", "gran-paradiso-national-park-near-turin", "la-mandria-regional-park-near-turin", "maritime-alps-natural-park-near-turin", "massif-de-lesterel-near-nice", "mercantour-national-park-near-nice", "mont-blanc-near-aosta", "orsiera-rocciavre-natural-park-near-turin"],
    featuredCities: ["turin", "nice", "aosta", "chambery", "grenoble"],
  },
  {
    slug: "france-lakes",
    title: "France Lakes",
    description:
      "France Lakes groups 9 nearby places across 8 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["annecy", "besancon", "chambery", "clermont-ferrand", "grenoble", "nancy", "nice", "strasbourg"],
    nearbyPlaces: ["lac-blanc-near-strasbourg", "lac-pavin-near-clermont-ferrand", "lac-de-madine-near-nancy", "lac-de-monteynard-avignonet-near-grenoble", "lac-de-saint-cassien-near-nice", "lac-de-saint-point-near-besancon", "lac-du-bourget-near-chambery", "lake-annecy-near-annecy", "lake-of-sainte-croix-near-nice"],
    featuredPlaces: ["lac-blanc-near-strasbourg", "lac-pavin-near-clermont-ferrand", "lac-de-madine-near-nancy", "lac-de-monteynard-avignonet-near-grenoble", "lac-de-saint-cassien-near-nice", "lac-de-saint-point-near-besancon", "lac-du-bourget-near-chambery", "lake-annecy-near-annecy"],
    featuredCities: ["nice", "annecy", "besancon", "chambery", "clermont-ferrand", "grenoble"],
  },
  {
    slug: "france-mountains",
    title: "France Mountains",
    description:
      "France Mountains groups 17 nearby places across 13 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["aix-en-provence", "avignon", "bayonne", "chambery", "clermont-ferrand", "grenoble", "lyon", "marseille", "montpellier", "nice", "pau", "strasbourg", "toulouse"],
    nearbyPlaces: ["alpilles-near-marseille", "bauges-near-chambery", "cevennes-national-park-near-montpellier", "la-rhune-near-bayonne", "massif-de-lesterel-near-nice", "mercantour-national-park-near-nice", "mont-sainte-odile-near-strasbourg", "mont-ventoux-near-avignon", "montagne-noire-near-toulouse", "montagne-sainte-victoire-near-aix-en-provence", "monts-du-lyonnais-near-lyon", "puy-de-sancy-near-clermont-ferrand", "pyrenees-national-park-near-pau", "sainte-baume-near-marseille", "vercors-regional-park-near-grenoble", "vosges-near-strasbourg", "ecrins-national-park-near-grenoble"],
    featuredPlaces: ["alpilles-near-marseille", "bauges-near-chambery", "cevennes-national-park-near-montpellier", "la-rhune-near-bayonne", "massif-de-lesterel-near-nice", "mercantour-national-park-near-nice", "mont-sainte-odile-near-strasbourg", "mont-ventoux-near-avignon"],
    featuredCities: ["grenoble", "marseille", "nice", "strasbourg", "aix-en-provence", "avignon"],
  },
  {
    slug: "france-national-parks",
    title: "France National Parks",
    description:
      "France National Parks groups 5 nearby places across 5 cities for local-first day and weekend discovery — mainly mountains, nature areas. This is a geographic discovery collection derived from a shared protected-area system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["grenoble", "marseille", "montpellier", "nice", "pau"],
    nearbyPlaces: ["calanques-near-marseille", "cevennes-national-park-near-montpellier", "mercantour-national-park-near-nice", "pyrenees-national-park-near-pau", "ecrins-national-park-near-grenoble"],
    featuredPlaces: ["calanques-near-marseille", "cevennes-national-park-near-montpellier", "mercantour-national-park-near-nice", "pyrenees-national-park-near-pau", "ecrins-national-park-near-grenoble"],
    featuredCities: ["grenoble", "marseille", "montpellier", "nice", "pau"],
  },
  {
    slug: "france-nature-escapes",
    title: "France Nature Escapes",
    description:
      "France Nature Escapes groups 10 nearby places across 9 cities for local-first day and weekend discovery — mainly nature areas, parks, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["avignon", "bordeaux", "la-rochelle", "lyon", "marseille", "nimes", "pau", "rouen", "toulouse"],
    nearbyPlaces: ["alpilles-near-avignon", "calanques-near-marseille", "dordogne-near-bordeaux", "garonne-near-toulouse", "gave-de-pau-near-pau", "grand-parc-de-miribel-jonage-near-lyon", "marais-poitevin-near-la-rochelle", "medoc-near-bordeaux", "pont-du-gard-near-nimes", "etretat-near-rouen"],
    featuredPlaces: ["alpilles-near-avignon", "calanques-near-marseille", "dordogne-near-bordeaux", "garonne-near-toulouse", "gave-de-pau-near-pau", "grand-parc-de-miribel-jonage-near-lyon", "marais-poitevin-near-la-rochelle", "medoc-near-bordeaux"],
    featuredCities: ["bordeaux", "avignon", "la-rochelle", "lyon", "marseille", "nimes"],
  },
  {
    slug: "france-protected-landscapes",
    title: "France Protected Landscapes",
    description:
      "France Protected Landscapes groups 11 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["bordeaux", "brest", "caen", "dijon", "lille", "lyon", "nancy", "nantes", "strasbourg", "toulouse"],
    nearbyPlaces: ["armorique-regional-natural-park-near-brest", "dune-of-pilat-near-bordeaux", "haut-languedoc-regional-park-near-toulouse", "landes-de-gascogne-regional-natural-park-near-bordeaux", "marais-audomarois-near-lille", "morvan-regional-park-near-dijon", "normandy-maine-regional-natural-park-near-caen", "northern-vosges-regional-park-near-strasbourg", "parc-naturel-regional-de-briere-near-nantes", "parc-naturel-regional-de-lorraine-near-nancy", "pilat-regional-natural-park-near-lyon"],
    featuredPlaces: ["armorique-regional-natural-park-near-brest", "dune-of-pilat-near-bordeaux", "haut-languedoc-regional-park-near-toulouse", "landes-de-gascogne-regional-natural-park-near-bordeaux", "marais-audomarois-near-lille", "morvan-regional-park-near-dijon", "normandy-maine-regional-natural-park-near-caen", "northern-vosges-regional-park-near-strasbourg"],
    featuredCities: ["bordeaux", "brest", "caen", "dijon", "lille", "lyon"],
  },
  {
    slug: "france-spain-borderlands",
    title: "France–Spain Borderlands",
    description:
      "France–Spain Borderlands groups 15 nearby places across 6 cities for local-first day and weekend discovery — mainly mountains, nature areas, beaches. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["bayonne", "bilbao", "jaca", "pau", "san-sebastian", "toulouse"],
    nearbyPlaces: ["biarritz-near-bayonne", "garonne-near-toulouse", "gave-de-pau-near-pau", "la-rhune-near-bayonne", "pyrenees-national-park-near-pau", "aiako-harria-near-san-sebastian", "aizkorri-aratz-natural-park-near-san-sebastian", "flysch-basque-coast-near-bilbao", "gaztelugatxe-near-bilbao", "gorbea-natural-park-near-bilbao", "hendaye-bay-near-san-sebastian", "irati-forest-near-jaca", "ordesa-y-monte-perdido-national-park-near-jaca", "pagoeta-natural-park-near-san-sebastian", "urdaibai-biosphere-reserve-near-bilbao"],
    featuredPlaces: ["aiako-harria-near-san-sebastian", "aizkorri-aratz-natural-park-near-san-sebastian", "biarritz-near-bayonne", "flysch-basque-coast-near-bilbao", "garonne-near-toulouse", "gave-de-pau-near-pau", "gaztelugatxe-near-bilbao", "gorbea-natural-park-near-bilbao"],
    featuredCities: ["bilbao", "san-sebastian", "bayonne", "jaca", "pau", "toulouse"],
  },
  {
    slug: "germany-forests",
    title: "Germany Forests",
    description:
      "Germany Forests groups 12 nearby places across 11 cities for local-first day and weekend discovery — mainly nature areas. This is a geographic discovery collection derived from forest landscapes; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "forest_region",
    cities: ["augsburg", "berlin", "cologne", "heidelberg", "karlsruhe", "leipzig", "passau", "potsdam", "stuttgart", "trier", "wurzburg"],
    nearbyPlaces: ["augsburg-western-woods-nature-park-near-augsburg", "bavarian-forest-national-park-near-passau", "black-forest-national-park-near-karlsruhe", "hambach-forest-near-cologne", "hunsruck-hochwald-national-park-near-trier", "leipzig-riverside-forest-near-leipzig", "odenwald-near-heidelberg", "schurwald-near-stuttgart", "spreewald-near-potsdam", "spreewald-near-berlin", "steigerwald-near-wurzburg", "welzheim-forest-near-stuttgart"],
    featuredPlaces: ["augsburg-western-woods-nature-park-near-augsburg", "bavarian-forest-national-park-near-passau", "black-forest-national-park-near-karlsruhe", "hambach-forest-near-cologne", "hunsruck-hochwald-national-park-near-trier", "leipzig-riverside-forest-near-leipzig", "odenwald-near-heidelberg", "schurwald-near-stuttgart"],
    featuredCities: ["stuttgart", "augsburg", "berlin", "cologne", "heidelberg", "karlsruhe"],
  },
  {
    slug: "germany-lakes",
    title: "Germany Lakes",
    description:
      "Germany Lakes groups 12 nearby places across 9 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["augsburg", "berlin", "freiburg", "garmisch-partenkirchen", "gorlitz", "hamburg", "hanover", "munich", "regensburg"],
    nearbyPlaces: ["ammersee-near-augsburg", "berzdorfer-see-near-gorlitz", "eibsee-near-garmisch-partenkirchen", "grosser-arbersee-near-regensburg", "holstein-switzerland-near-hamburg", "lake-starnberg-near-munich", "schaalsee-near-hamburg", "schluchsee-near-freiburg", "steinhuder-meer-near-hanover", "tegernsee-near-munich", "titisee-near-freiburg", "wannsee-berlin"],
    featuredPlaces: ["ammersee-near-augsburg", "berzdorfer-see-near-gorlitz", "eibsee-near-garmisch-partenkirchen", "grosser-arbersee-near-regensburg", "holstein-switzerland-near-hamburg", "lake-starnberg-near-munich", "schaalsee-near-hamburg", "schluchsee-near-freiburg"],
    featuredCities: ["freiburg", "hamburg", "munich", "augsburg", "berlin", "garmisch-partenkirchen"],
  },
  {
    slug: "germany-luxembourg-borderlands",
    title: "Germany–Luxembourg Borderlands",
    description:
      "Germany–Luxembourg Borderlands groups 6 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["bonn", "cologne", "esch-sur-alzette", "luxembourg-city", "trier"],
    nearbyPlaces: ["eifel-national-park-near-cologne", "hambach-forest-near-cologne", "hunsruck-hochwald-national-park-near-trier", "siebengebirge-near-bonn", "mullerthal-near-luxembourg-city", "upper-sure-natural-park-near-esch-sur-alzette"],
    featuredPlaces: ["eifel-national-park-near-cologne", "hambach-forest-near-cologne", "hunsruck-hochwald-national-park-near-trier", "mullerthal-near-luxembourg-city", "siebengebirge-near-bonn", "upper-sure-natural-park-near-esch-sur-alzette"],
    featuredCities: ["cologne", "bonn", "esch-sur-alzette", "luxembourg-city", "trier"],
  },
  {
    slug: "germany-mountains",
    title: "Germany Mountains",
    description:
      "Germany Mountains groups 16 nearby places across 11 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["cologne", "dresden", "erfurt", "frankfurt", "freiburg", "garmisch-partenkirchen", "gorlitz", "nuremberg", "passau", "stuttgart", "wurzburg"],
    nearbyPlaces: ["bavarian-forest-near-passau", "feldberg-near-freiburg", "franconian-jura-near-nuremberg", "hesselberg-near-nuremberg", "lusatian-mountains-near-dresden", "ore-mountains-near-dresden", "rhon-mountains-near-frankfurt", "saxon-switzerland-national-park-near-dresden", "schauinsland-near-freiburg", "siebengebirge-near-cologne", "spessart-near-wurzburg", "swabian-jura-near-stuttgart", "taunus-near-frankfurt", "thuringian-forest-near-erfurt", "zittau-mountains-near-gorlitz", "zugspitze-near-garmisch-partenkirchen"],
    featuredPlaces: ["bavarian-forest-near-passau", "feldberg-near-freiburg", "franconian-jura-near-nuremberg", "hesselberg-near-nuremberg", "lusatian-mountains-near-dresden", "ore-mountains-near-dresden", "rhon-mountains-near-frankfurt", "saxon-switzerland-national-park-near-dresden"],
    featuredCities: ["dresden", "frankfurt", "freiburg", "nuremberg", "cologne", "erfurt"],
  },
  {
    slug: "germany-nature-escapes",
    title: "Germany Nature Escapes",
    description:
      "Germany Nature Escapes groups 15 nearby places across 14 cities for local-first day and weekend discovery — mainly nature areas, parks, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["berlin", "bonn", "bremen", "cologne", "dortmund", "dresden", "dusseldorf", "erfurt", "flensburg", "kiel", "konstanz", "munich", "nuremberg", "stuttgart"],
    nearbyPlaces: ["dresden-heath-near-dresden", "eifel-national-park-near-cologne", "englischer-garten-munich", "flensburg-fjord-near-flensburg", "franconian-switzerland-near-nuremberg", "grunewald-near-berlin", "hainich-national-park-near-erfurt", "hegau-near-konstanz", "hohe-mark-nature-park-near-dortmund", "holstein-switzerland-near-kiel", "markische-schweiz-nature-park-near-berlin", "neandertal-near-dusseldorf", "schonbuch-nature-park-near-stuttgart", "siebengebirge-near-bonn", "teufelsmoor-near-bremen"],
    featuredPlaces: ["dresden-heath-near-dresden", "eifel-national-park-near-cologne", "englischer-garten-munich", "flensburg-fjord-near-flensburg", "franconian-switzerland-near-nuremberg", "grunewald-near-berlin", "hainich-national-park-near-erfurt", "hegau-near-konstanz"],
    featuredCities: ["berlin", "bonn", "bremen", "cologne", "dortmund", "dresden"],
  },
  {
    slug: "germany-netherlands-borderlands",
    title: "Germany–Netherlands Borderlands",
    description:
      "Germany–Netherlands Borderlands groups 12 nearby places across 9 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["arnhem", "cologne", "dortmund", "dusseldorf", "eindhoven", "maastricht", "nijmegen", "utrecht", "zwolle"],
    nearbyPlaces: ["eifel-national-park-near-cologne", "hambach-forest-near-cologne", "hohe-mark-nature-park-near-dortmund", "neandertal-near-dusseldorf", "rhineland-nature-park-near-cologne", "groote-peel-national-park-near-eindhoven", "de-maasduinen-national-park-near-nijmegen", "hoge-veluwe-national-park-near-arnhem", "sallandse-heuvelrug-national-park-near-zwolle", "sint-pietersberg-near-maastricht", "utrechtse-heuvelrug-national-park-near-utrecht", "veluwezoom-national-park-near-arnhem"],
    featuredPlaces: ["groote-peel-national-park-near-eindhoven", "de-maasduinen-national-park-near-nijmegen", "eifel-national-park-near-cologne", "hambach-forest-near-cologne", "hoge-veluwe-national-park-near-arnhem", "hohe-mark-nature-park-near-dortmund", "neandertal-near-dusseldorf", "rhineland-nature-park-near-cologne"],
    featuredCities: ["cologne", "arnhem", "dortmund", "dusseldorf", "eindhoven", "maastricht"],
  },
  {
    slug: "germany-poland-borderlands",
    title: "Germany–Poland Borderlands",
    description:
      "Germany–Poland Borderlands groups 7 nearby places across 5 cities for local-first day and weekend discovery — mainly mountains, nature areas, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["berlin", "dresden", "gorlitz", "szczecin", "wroclaw"],
    nearbyPlaces: ["lusatian-mountains-near-dresden", "markische-schweiz-nature-park-near-berlin", "saxon-switzerland-national-park-near-dresden", "spreewald-near-berlin", "zittau-mountains-near-gorlitz", "giant-mountains-national-park-near-wroclaw", "szczecin-landscape-park-near-szczecin"],
    featuredPlaces: ["giant-mountains-national-park-near-wroclaw", "lusatian-mountains-near-dresden", "markische-schweiz-nature-park-near-berlin", "saxon-switzerland-national-park-near-dresden", "spreewald-near-berlin", "szczecin-landscape-park-near-szczecin", "zittau-mountains-near-gorlitz"],
    featuredCities: ["berlin", "dresden", "gorlitz", "szczecin", "wroclaw"],
  },
  {
    slug: "greece-mountains",
    title: "Greece Mountains",
    description:
      "Greece Mountains groups 7 nearby places across 5 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["athens", "heraklion", "ioannina", "kavala", "volos"],
    nearbyPlaces: ["mount-geraneia-near-athens", "mount-hymettus-near-athens", "mount-ida-crete-near-heraklion", "mount-pangaion-near-kavala", "mount-pelion-near-volos", "mount-parnitha-near-athens", "tymfi-near-ioannina"],
    featuredPlaces: ["mount-geraneia-near-athens", "mount-hymettus-near-athens", "mount-ida-crete-near-heraklion", "mount-pangaion-near-kavala", "mount-pelion-near-volos", "mount-parnitha-near-athens", "tymfi-near-ioannina"],
    featuredCities: ["athens", "heraklion", "ioannina", "kavala", "volos"],
  },
  {
    slug: "ireland-mountains",
    title: "Ireland Mountains",
    description:
      "Ireland Mountains groups 9 nearby places across 9 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["athlone", "cork", "galway", "kilkenny", "killarney", "limerick", "sligo", "tralee", "waterford"],
    nearbyPlaces: ["ballyhoura-mountains-near-limerick", "benbulbin-near-sligo", "blackstairs-mountains-near-kilkenny", "comeragh-mountains-near-waterford", "galtee-mountains-near-cork", "macgillycuddys-reeks-near-killarney", "maumturks-near-galway", "slieve-bloom-mountains-near-athlone", "slieve-mish-mountains-near-tralee"],
    featuredPlaces: ["ballyhoura-mountains-near-limerick", "benbulbin-near-sligo", "blackstairs-mountains-near-kilkenny", "comeragh-mountains-near-waterford", "galtee-mountains-near-cork", "macgillycuddys-reeks-near-killarney", "maumturks-near-galway", "slieve-bloom-mountains-near-athlone"],
    featuredCities: ["athlone", "cork", "galway", "kilkenny", "killarney", "limerick"],
  },
  {
    slug: "ireland-nature-escapes",
    title: "Ireland Nature Escapes",
    description:
      "Ireland Nature Escapes groups 8 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["cork", "dublin", "galway", "kilkenny", "letterkenny", "westport"],
    nearbyPlaces: ["beara-peninsula-near-cork", "clew-bay-near-westport", "connemara-national-park-near-galway", "gougane-barra-near-cork", "jenkinstown-park-near-kilkenny", "lough-swilly-near-letterkenny", "phoenix-park-dublin", "wicklow-mountains-near-dublin"],
    featuredPlaces: ["beara-peninsula-near-cork", "clew-bay-near-westport", "connemara-national-park-near-galway", "gougane-barra-near-cork", "jenkinstown-park-near-kilkenny", "lough-swilly-near-letterkenny", "phoenix-park-dublin", "wicklow-mountains-near-dublin"],
    featuredCities: ["cork", "dublin", "galway", "kilkenny", "letterkenny", "westport"],
  },
  {
    slug: "ireland-united-kingdom-borderlands",
    title: "Ireland–United Kingdom Borderlands",
    description:
      "Ireland–United Kingdom Borderlands groups 7 nearby places across 5 cities for local-first day and weekend discovery — mainly mountains, waterfronts, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["belfast", "derry", "dublin", "letterkenny", "sligo"],
    nearbyPlaces: ["benbulbin-near-sligo", "lough-swilly-near-letterkenny", "phoenix-park-dublin", "lough-foyle-near-derry", "mourne-mountains-near-belfast", "slieve-croob-near-belfast", "sperrins-near-derry"],
    featuredPlaces: ["benbulbin-near-sligo", "lough-foyle-near-derry", "lough-swilly-near-letterkenny", "mourne-mountains-near-belfast", "phoenix-park-dublin", "slieve-croob-near-belfast", "sperrins-near-derry"],
    featuredCities: ["belfast", "derry", "dublin", "letterkenny", "sligo"],
  },
  {
    slug: "italy-lakes",
    title: "Italy Lakes",
    description:
      "Italy Lakes groups 8 nearby places across 8 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["bergamo", "como", "florence", "milan", "perugia", "pisa", "rome", "trento"],
    nearbyPlaces: ["bracciano-lake-near-rome", "lake-bilancino-near-florence", "lake-como-near-como", "lake-garda-near-trento", "lake-iseo-near-bergamo", "lake-maggiore-near-milan", "lake-massaciuccoli-near-pisa", "lake-trasimeno-near-perugia"],
    featuredPlaces: ["bracciano-lake-near-rome", "lake-bilancino-near-florence", "lake-como-near-como", "lake-garda-near-trento", "lake-iseo-near-bergamo", "lake-maggiore-near-milan", "lake-massaciuccoli-near-pisa", "lake-trasimeno-near-perugia"],
    featuredCities: ["bergamo", "como", "florence", "milan", "perugia", "pisa"],
  },
  {
    slug: "italy-mountains",
    title: "Italy Mountains",
    description:
      "Italy Mountains groups 17 nearby places across 13 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["aosta", "bolzano", "catania", "como", "laquila", "lucca", "naples", "palermo", "trento", "turin", "udine", "venice", "verona"],
    nearbyPlaces: ["alpi-apuane-near-lucca", "carnic-alps-near-udine", "dolomites-near-bolzano", "dolomiti-bellunesi-national-park-near-venice", "gran-paradiso-national-park-near-turin", "lessinia-regional-park-near-verona", "madonie-park-near-palermo", "maiella-national-park-near-laquila", "maritime-alps-natural-park-near-turin", "matese-regional-park-near-naples", "mont-blanc-near-aosta", "monte-baldo-near-verona", "monte-generoso-near-como", "mount-etna-near-catania", "orsiera-rocciavre-natural-park-near-turin", "paganella-near-trento", "vesuvius-national-park-near-naples"],
    featuredPlaces: ["alpi-apuane-near-lucca", "carnic-alps-near-udine", "dolomites-near-bolzano", "dolomiti-bellunesi-national-park-near-venice", "gran-paradiso-national-park-near-turin", "lessinia-regional-park-near-verona", "madonie-park-near-palermo", "maiella-national-park-near-laquila"],
    featuredCities: ["turin", "naples", "verona", "aosta", "bolzano", "catania"],
  },
  {
    slug: "italy-national-parks",
    title: "Italy National Parks",
    description:
      "Italy National Parks groups 7 nearby places across 6 cities for local-first day and weekend discovery — mainly mountains, nature areas, parks. This is a geographic discovery collection derived from a shared protected-area system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["bari", "laquila", "naples", "rome", "turin", "venice"],
    nearbyPlaces: ["alta-murgia-national-park-near-bari", "circeo-national-park-near-rome", "dolomiti-bellunesi-national-park-near-venice", "gran-paradiso-national-park-near-turin", "gran-sasso-and-monti-della-laga-national-park-near-laquila", "maiella-national-park-near-laquila", "vesuvius-national-park-near-naples"],
    featuredPlaces: ["alta-murgia-national-park-near-bari", "circeo-national-park-near-rome", "dolomiti-bellunesi-national-park-near-venice", "gran-paradiso-national-park-near-turin", "gran-sasso-and-monti-della-laga-national-park-near-laquila", "maiella-national-park-near-laquila", "vesuvius-national-park-near-naples"],
    featuredCities: ["laquila", "bari", "naples", "rome", "turin", "venice"],
  },
  {
    slug: "italy-nature-escapes",
    title: "Italy Nature Escapes",
    description:
      "Italy Nature Escapes groups 9 nearby places across 7 cities for local-first day and weekend discovery — mainly nature areas, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["ancona", "bari", "florence", "lucca", "ravenna", "rome", "venice"],
    nearbyPlaces: ["alta-murgia-national-park-near-bari", "cansiglio-near-venice", "circeo-national-park-near-rome", "comacchio-near-ravenna", "euganean-hills-near-venice", "frasassi-caves-near-ancona", "garfagnana-near-lucca", "monti-del-chianti-near-florence", "vallombrosa-near-florence"],
    featuredPlaces: ["alta-murgia-national-park-near-bari", "cansiglio-near-venice", "circeo-national-park-near-rome", "comacchio-near-ravenna", "euganean-hills-near-venice", "frasassi-caves-near-ancona", "garfagnana-near-lucca", "monti-del-chianti-near-florence"],
    featuredCities: ["florence", "venice", "ancona", "bari", "lucca", "ravenna"],
  },
  {
    slug: "italy-protected-landscapes",
    title: "Italy Protected Landscapes",
    description:
      "Italy Protected Landscapes groups 6 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["bologna", "genoa", "padua", "trapani", "turin", "udine"],
    nearbyPlaces: ["euganean-hills-near-padua", "gessi-bolognesi-park-near-bologna", "julian-prealps-natural-park-near-udine", "la-mandria-regional-park-near-turin", "portofino-regional-park-near-genoa", "zingaro-nature-reserve-near-trapani"],
    featuredPlaces: ["euganean-hills-near-padua", "gessi-bolognesi-park-near-bologna", "julian-prealps-natural-park-near-udine", "la-mandria-regional-park-near-turin", "portofino-regional-park-near-genoa", "zingaro-nature-reserve-near-trapani"],
    featuredCities: ["bologna", "genoa", "padua", "trapani", "turin", "udine"],
  },
  {
    slug: "italy-slovenia-borderlands",
    title: "Italy–Slovenia Borderlands",
    description:
      "Italy–Slovenia Borderlands groups 5 nearby places across 4 cities for local-first day and weekend discovery — mainly nature areas, mountains, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["kranj", "ljubljana", "udine", "venice"],
    nearbyPlaces: ["cansiglio-near-venice", "carnic-alps-near-udine", "julian-prealps-natural-park-near-udine", "triglav-national-park-near-kranj", "vipava-valley-near-ljubljana"],
    featuredPlaces: ["cansiglio-near-venice", "carnic-alps-near-udine", "julian-prealps-natural-park-near-udine", "triglav-national-park-near-kranj", "vipava-valley-near-ljubljana"],
    featuredCities: ["udine", "kranj", "ljubljana", "venice"],
  },
  {
    slug: "netherlands-national-parks",
    title: "Netherlands National Parks",
    description:
      "Netherlands National Parks groups 10 nearby places across 9 cities for local-first day and weekend discovery — mainly nature areas, parks, beaches. This is a geographic discovery collection derived from a shared protected-area system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["amsterdam", "arnhem", "delft", "eindhoven", "groningen", "nijmegen", "tilburg", "utrecht", "zwolle"],
    nearbyPlaces: ["de-biesbosch-national-park-near-delft", "groote-peel-national-park-near-eindhoven", "de-maasduinen-national-park-near-nijmegen", "hoge-veluwe-national-park-near-arnhem", "lauwersmeer-national-park-near-groningen", "loonse-en-drunense-duinen-national-park-near-tilburg", "sallandse-heuvelrug-national-park-near-zwolle", "utrechtse-heuvelrug-national-park-near-utrecht", "veluwezoom-national-park-near-arnhem", "zuid-kennemerland-national-park-near-amsterdam"],
    featuredPlaces: ["de-biesbosch-national-park-near-delft", "groote-peel-national-park-near-eindhoven", "de-maasduinen-national-park-near-nijmegen", "hoge-veluwe-national-park-near-arnhem", "lauwersmeer-national-park-near-groningen", "loonse-en-drunense-duinen-national-park-near-tilburg", "sallandse-heuvelrug-national-park-near-zwolle", "utrechtse-heuvelrug-national-park-near-utrecht"],
    featuredCities: ["arnhem", "amsterdam", "delft", "eindhoven", "groningen", "nijmegen"],
  },
  {
    slug: "netherlands-nature-escapes",
    title: "Netherlands Nature Escapes",
    description:
      "Netherlands Nature Escapes groups 15 nearby places across 12 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["arnhem", "breda", "delft", "eindhoven", "groningen", "haarlem", "maastricht", "nijmegen", "the-hague", "tilburg", "utrecht", "zwolle"],
    nearbyPlaces: ["berkheide-near-the-hague", "de-biesbosch-national-park-near-delft", "groote-peel-national-park-near-eindhoven", "de-maasduinen-national-park-near-nijmegen", "groene-hart-near-utrecht", "kromme-rijn-near-utrecht", "lauwersmeer-national-park-near-groningen", "loonse-en-drunense-duinen-national-park-near-tilburg", "mastbos-near-breda", "midden-delfland-near-delft", "sallandse-heuvelrug-national-park-near-zwolle", "sint-pietersberg-near-maastricht", "utrechtse-heuvelrug-national-park-near-utrecht", "veluwezoom-national-park-near-arnhem", "zuid-kennemerland-national-park-near-haarlem"],
    featuredPlaces: ["berkheide-near-the-hague", "de-biesbosch-national-park-near-delft", "groote-peel-national-park-near-eindhoven", "de-maasduinen-national-park-near-nijmegen", "groene-hart-near-utrecht", "kromme-rijn-near-utrecht", "lauwersmeer-national-park-near-groningen", "loonse-en-drunense-duinen-national-park-near-tilburg"],
    featuredCities: ["utrecht", "delft", "arnhem", "breda", "eindhoven", "groningen"],
  },
  {
    slug: "new-zealand-mountains",
    title: "New Zealand Mountains",
    description:
      "New Zealand Mountains groups 8 nearby places across 6 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["christchurch", "hamilton-new-zealand", "napier", "new-plymouth", "queenstown", "wellington"],
    nearbyPlaces: ["arthurs-pass-national-park-near-christchurch", "egmont-national-park-near-new-plymouth", "hanmer-springs-near-christchurch", "pirongia-forest-park-near-hamilton-new-zealand", "port-hills-near-christchurch", "tararua-forest-park-near-wellington", "te-mata-peak-near-napier", "the-remarkables-near-queenstown"],
    featuredPlaces: ["arthurs-pass-national-park-near-christchurch", "egmont-national-park-near-new-plymouth", "hanmer-springs-near-christchurch", "pirongia-forest-park-near-hamilton-new-zealand", "port-hills-near-christchurch", "tararua-forest-park-near-wellington", "te-mata-peak-near-napier", "the-remarkables-near-queenstown"],
    featuredCities: ["christchurch", "hamilton-new-zealand", "napier", "new-plymouth", "queenstown", "wellington"],
  },
  {
    slug: "new-zealand-nature-escapes",
    title: "New Zealand Nature Escapes",
    description:
      "New Zealand Nature Escapes groups 6 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["auckland", "nelson", "queenstown", "rotorua", "whangarei"],
    nearbyPlaces: ["abel-tasman-national-park-near-nelson", "bream-head-near-whangarei", "fiordland-near-queenstown", "waiotapu-near-rotorua", "waitakere-ranges-regional-park-near-auckland", "whangarei-falls-near-whangarei"],
    featuredPlaces: ["abel-tasman-national-park-near-nelson", "bream-head-near-whangarei", "fiordland-near-queenstown", "waiotapu-near-rotorua", "waitakere-ranges-regional-park-near-auckland", "whangarei-falls-near-whangarei"],
    featuredCities: ["whangarei", "auckland", "nelson", "queenstown", "rotorua"],
  },
  {
    slug: "poland-mountains",
    title: "Poland Mountains",
    description:
      "Poland Mountains groups 8 nearby places across 4 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["krakow", "rzeszow", "wroclaw", "zakopane"],
    nearbyPlaces: ["beskids-near-krakow", "giant-mountains-national-park-near-wroclaw", "magura-national-park-near-rzeszow", "pieniny-near-krakow", "stolowe-mountains-national-park-near-wroclaw", "tatra-mountains-near-krakow", "tatra-national-park-near-zakopane", "sleza-landscape-park-near-wroclaw"],
    featuredPlaces: ["beskids-near-krakow", "giant-mountains-national-park-near-wroclaw", "magura-national-park-near-rzeszow", "pieniny-near-krakow", "stolowe-mountains-national-park-near-wroclaw", "tatra-mountains-near-krakow", "tatra-national-park-near-zakopane", "sleza-landscape-park-near-wroclaw"],
    featuredCities: ["krakow", "wroclaw", "rzeszow", "zakopane"],
  },
  {
    slug: "poland-national-parks",
    title: "Poland National Parks",
    description:
      "Poland National Parks groups 13 nearby places across 11 cities for local-first day and weekend discovery — mainly nature areas, mountains, beaches. This is a geographic discovery collection derived from a shared protected-area system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["bialystok", "bydgoszcz", "gdansk", "krakow", "lublin", "poznan", "rzeszow", "szczecin", "warsaw", "wroclaw", "zakopane"],
    nearbyPlaces: ["giant-mountains-national-park-near-wroclaw", "gorce-national-park-near-zakopane", "kampinos-national-park-near-warsaw", "magura-national-park-near-rzeszow", "narew-national-park-near-bialystok", "ojcow-national-park-near-krakow", "roztocze-national-park-near-lublin", "stolowe-mountains-national-park-near-wroclaw", "slowinski-national-park-near-gdansk", "tatra-national-park-near-zakopane", "tuchola-forest-national-park-near-bydgoszcz", "wielkopolska-national-park-near-poznan", "wolin-national-park-near-szczecin"],
    featuredPlaces: ["giant-mountains-national-park-near-wroclaw", "gorce-national-park-near-zakopane", "kampinos-national-park-near-warsaw", "magura-national-park-near-rzeszow", "narew-national-park-near-bialystok", "ojcow-national-park-near-krakow", "roztocze-national-park-near-lublin", "stolowe-mountains-national-park-near-wroclaw"],
    featuredCities: ["wroclaw", "zakopane", "bialystok", "bydgoszcz", "gdansk", "krakow"],
  },
  {
    slug: "poland-nature-escapes",
    title: "Poland Nature Escapes",
    description:
      "Poland Nature Escapes groups 16 nearby places across 13 cities for local-first day and weekend discovery — mainly nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bialystok", "gdansk", "gdynia", "katowice", "krakow", "lodz", "lublin", "olsztyn", "poznan", "rzeszow", "szczecin", "warsaw", "zakopane"],
    nearbyPlaces: ["czarnorzeki-strzyzow-landscape-park-near-rzeszow", "eagle-nests-landscape-park-near-katowice", "gorce-national-park-near-zakopane", "kampinos-national-park-near-warsaw", "masovian-landscape-park-near-warsaw", "narew-national-park-near-bialystok", "ojcow-national-park-near-krakow", "promno-landscape-park-near-poznan", "rogalin-landscape-park-near-poznan", "roztocze-national-park-near-lublin", "szczecin-landscape-park-near-szczecin", "slowinski-national-park-near-gdynia", "tricity-landscape-park-near-gdansk", "wielkopolska-national-park-near-poznan", "lyna-near-olsztyn", "lodz-hills-landscape-park-near-lodz"],
    featuredPlaces: ["czarnorzeki-strzyzow-landscape-park-near-rzeszow", "eagle-nests-landscape-park-near-katowice", "gorce-national-park-near-zakopane", "kampinos-national-park-near-warsaw", "masovian-landscape-park-near-warsaw", "narew-national-park-near-bialystok", "ojcow-national-park-near-krakow", "promno-landscape-park-near-poznan"],
    featuredCities: ["poznan", "warsaw", "bialystok", "gdansk", "gdynia", "katowice"],
  },
  {
    slug: "poland-slovakia-borderlands",
    title: "Poland–Slovakia Borderlands",
    description:
      "Poland–Slovakia Borderlands groups 11 nearby places across 6 cities for local-first day and weekend discovery — mainly mountains, nature areas. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["banska-bystrica", "kosice", "krakow", "rzeszow", "zakopane", "zilina"],
    nearbyPlaces: ["beskids-near-krakow", "gorce-national-park-near-zakopane", "magura-national-park-near-rzeszow", "pieniny-near-krakow", "tatra-mountains-near-krakow", "tatra-national-park-near-zakopane", "mala-fatra-national-park-near-zilina", "polana-near-banska-bystrica", "slovak-paradise-national-park-near-kosice", "sulov-rocks-near-zilina", "velka-fatra-near-banska-bystrica"],
    featuredPlaces: ["beskids-near-krakow", "gorce-national-park-near-zakopane", "magura-national-park-near-rzeszow", "mala-fatra-national-park-near-zilina", "pieniny-near-krakow", "polana-near-banska-bystrica", "slovak-paradise-national-park-near-kosice", "sulov-rocks-near-zilina"],
    featuredCities: ["krakow", "banska-bystrica", "zakopane", "zilina", "kosice", "rzeszow"],
  },
  {
    slug: "portugal-protected-landscapes",
    title: "Portugal Protected Landscapes",
    description:
      "Portugal Protected Landscapes groups 6 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["braganca", "faro", "funchal", "lisbon", "porto"],
    nearbyPlaces: ["alvao-natural-park-near-porto", "douro-international-natural-park-near-porto", "montesinho-natural-park-near-braganca", "ponta-de-sao-lourenco-near-funchal", "ria-formosa-natural-park-near-faro", "tagus-estuary-natural-reserve-near-lisbon"],
    featuredPlaces: ["alvao-natural-park-near-porto", "douro-international-natural-park-near-porto", "montesinho-natural-park-near-braganca", "ponta-de-sao-lourenco-near-funchal", "ria-formosa-natural-park-near-faro", "tagus-estuary-natural-reserve-near-lisbon"],
    featuredCities: ["porto", "braganca", "faro", "funchal", "lisbon"],
  },
  {
    slug: "portugal-spain-borderlands",
    title: "Portugal–Spain Borderlands",
    description:
      "Portugal–Spain Borderlands groups 11 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, mountains. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["braganca", "caceres", "evora", "faro", "guimaraes", "porto", "salamanca", "seville", "viana-do-castelo", "vigo"],
    nearbyPlaces: ["alvao-natural-park-near-porto", "cavado-river-near-guimaraes", "douro-international-natural-park-near-porto", "lima-river-near-viana-do-castelo", "montesinho-natural-park-near-braganca", "ria-formosa-natural-park-near-faro", "serra-de-sao-mamede-near-evora", "arribes-del-duero-natural-park-near-salamanca", "atlantic-islands-of-galicia-national-park-near-vigo", "donana-national-park-near-seville", "sierra-de-san-pedro-near-caceres"],
    featuredPlaces: ["alvao-natural-park-near-porto", "arribes-del-duero-natural-park-near-salamanca", "atlantic-islands-of-galicia-national-park-near-vigo", "cavado-river-near-guimaraes", "donana-national-park-near-seville", "douro-international-natural-park-near-porto", "lima-river-near-viana-do-castelo", "montesinho-natural-park-near-braganca"],
    featuredCities: ["porto", "braganca", "caceres", "evora", "faro", "guimaraes"],
  },
  {
    slug: "portugal-waterside-escapes",
    title: "Portugal Waterside Escapes",
    description:
      "Portugal Waterside Escapes groups 6 nearby places across 5 cities for local-first day and weekend discovery — mainly waterfronts, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["aveiro", "coimbra", "guimaraes", "lisbon", "viana-do-castelo"],
    nearbyPlaces: ["cascais-near-lisbon", "costa-nova-do-prado-near-aveiro", "cavado-river-near-guimaraes", "lima-river-near-viana-do-castelo", "peneda-geres-national-park-near-guimaraes", "bucaco-forest-near-coimbra"],
    featuredPlaces: ["cascais-near-lisbon", "costa-nova-do-prado-near-aveiro", "cavado-river-near-guimaraes", "lima-river-near-viana-do-castelo", "peneda-geres-national-park-near-guimaraes", "bucaco-forest-near-coimbra"],
    featuredCities: ["guimaraes", "aveiro", "coimbra", "lisbon", "viana-do-castelo"],
  },
  {
    slug: "romania-mountains",
    title: "Romania Mountains",
    description:
      "Romania Mountains groups 6 nearby places across 6 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["baia-mare", "brasov", "bucharest", "cluj-napoca", "iasi", "sibiu"],
    nearbyPlaces: ["bucegi-natural-park-near-bucharest", "ceahlau-massif-near-iasi", "cindrel-mountains-near-sibiu", "fagaras-mountains-near-cluj-napoca", "piatra-craiului-national-park-near-brasov", "rodna-mountains-near-baia-mare"],
    featuredPlaces: ["bucegi-natural-park-near-bucharest", "ceahlau-massif-near-iasi", "cindrel-mountains-near-sibiu", "fagaras-mountains-near-cluj-napoca", "piatra-craiului-national-park-near-brasov", "rodna-mountains-near-baia-mare"],
    featuredCities: ["baia-mare", "brasov", "bucharest", "cluj-napoca", "iasi", "sibiu"],
  },
  {
    slug: "spain-coast",
    title: "Spain Coast",
    description:
      "Spain Coast groups 6 nearby places across 6 cities for local-first day and weekend discovery — mainly beaches, waterfronts. This is a geographic discovery collection derived from a shared coastline; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "coastal_region",
    cities: ["a-coruna", "barcelona", "girona", "granada", "san-sebastian", "tarragona"],
    nearbyPlaces: ["cabo-de-gata-nijar-natural-park-near-granada", "cap-de-creus-near-girona", "costa-daurada-near-tarragona", "costa-da-morte-near-a-coruna", "hendaye-bay-near-san-sebastian", "sitges-near-barcelona"],
    featuredPlaces: ["cabo-de-gata-nijar-natural-park-near-granada", "cap-de-creus-near-girona", "costa-daurada-near-tarragona", "costa-da-morte-near-a-coruna", "hendaye-bay-near-san-sebastian", "sitges-near-barcelona"],
    featuredCities: ["a-coruna", "barcelona", "girona", "granada", "san-sebastian", "tarragona"],
  },
  {
    slug: "spain-mountains",
    title: "Spain Mountains",
    description:
      "Spain Mountains groups 17 nearby places across 13 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["barcelona", "bilbao", "granada", "jaca", "logrono", "madrid", "malaga", "murcia", "oviedo", "san-sebastian", "toledo", "valencia", "zaragoza"],
    nearbyPlaces: ["aiako-harria-near-san-sebastian", "aizkorri-aratz-natural-park-near-san-sebastian", "garraf-massif-near-barcelona", "gorbea-natural-park-near-bilbao", "guadarrama-national-park-near-madrid", "moncayo-natural-park-near-zaragoza", "montes-de-toledo-near-toledo", "montserrat-near-barcelona", "ordesa-y-monte-perdido-national-park-near-jaca", "picos-de-europa-near-oviedo", "picos-de-urbion-near-logrono", "sierra-calderona-near-valencia", "sierra-espuna-near-murcia", "sierra-nevada-national-park-near-granada", "sierra-de-baza-natural-park-near-granada", "sierra-de-espadan-near-valencia", "sierra-de-las-nieves-national-park-near-malaga"],
    featuredPlaces: ["aiako-harria-near-san-sebastian", "aizkorri-aratz-natural-park-near-san-sebastian", "garraf-massif-near-barcelona", "gorbea-natural-park-near-bilbao", "guadarrama-national-park-near-madrid", "moncayo-natural-park-near-zaragoza", "montes-de-toledo-near-toledo", "montserrat-near-barcelona"],
    featuredCities: ["barcelona", "granada", "san-sebastian", "valencia", "bilbao", "jaca"],
  },
  {
    slug: "spain-national-parks",
    title: "Spain National Parks",
    description:
      "Spain National Parks groups 8 nearby places across 8 cities for local-first day and weekend discovery — mainly mountains, nature areas, islands. This is a geographic discovery collection derived from a shared protected-area system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["granada", "jaca", "madrid", "malaga", "santander", "seville", "toledo", "vigo"],
    nearbyPlaces: ["atlantic-islands-of-galicia-national-park-near-vigo", "cabaneros-national-park-near-toledo", "donana-national-park-near-seville", "guadarrama-national-park-near-madrid", "ordesa-y-monte-perdido-national-park-near-jaca", "picos-de-europa-national-park-near-santander", "sierra-nevada-national-park-near-granada", "sierra-de-las-nieves-national-park-near-malaga"],
    featuredPlaces: ["atlantic-islands-of-galicia-national-park-near-vigo", "cabaneros-national-park-near-toledo", "donana-national-park-near-seville", "guadarrama-national-park-near-madrid", "ordesa-y-monte-perdido-national-park-near-jaca", "picos-de-europa-national-park-near-santander", "sierra-nevada-national-park-near-granada", "sierra-de-las-nieves-national-park-near-malaga"],
    featuredCities: ["granada", "jaca", "madrid", "malaga", "santander", "seville"],
  },
  {
    slug: "spain-protected-landscapes",
    title: "Spain Protected Landscapes",
    description:
      "Spain Protected Landscapes groups 11 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["a-coruna", "alicante", "bilbao", "girona", "malaga", "oviedo", "pamplona", "salamanca", "san-sebastian", "valencia"],
    nearbyPlaces: ["arribes-del-duero-natural-park-near-salamanca", "bardenas-reales-near-pamplona", "torcal-de-antequera-near-malaga", "fragas-do-eume-near-a-coruna", "garrotxa-volcanic-zone-natural-park-near-girona", "montes-de-malaga-natural-park-near-malaga", "montgo-natural-park-near-alicante", "pagoeta-natural-park-near-san-sebastian", "penyal-difac-near-valencia", "redes-natural-park-near-oviedo", "urdaibai-biosphere-reserve-near-bilbao"],
    featuredPlaces: ["arribes-del-duero-natural-park-near-salamanca", "bardenas-reales-near-pamplona", "torcal-de-antequera-near-malaga", "fragas-do-eume-near-a-coruna", "garrotxa-volcanic-zone-natural-park-near-girona", "montes-de-malaga-natural-park-near-malaga", "montgo-natural-park-near-alicante", "pagoeta-natural-park-near-san-sebastian"],
    featuredCities: ["malaga", "a-coruna", "alicante", "bilbao", "girona", "oviedo"],
  },
  {
    slug: "spain-waterside-escapes",
    title: "Spain Waterside Escapes",
    description:
      "Spain Waterside Escapes groups 8 nearby places across 8 cities for local-first day and weekend discovery — mainly nature areas, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["barcelona", "bilbao", "caceres", "logrono", "santander", "seville", "toledo", "valladolid"],
    nearbyPlaces: ["cabaneros-national-park-near-toledo", "canal-de-castilla-near-valladolid", "donana-national-park-near-seville", "flysch-basque-coast-near-bilbao", "llobregat-delta-near-barcelona", "najerilla-near-logrono", "picos-de-europa-national-park-near-santander", "sierra-de-san-pedro-near-caceres"],
    featuredPlaces: ["cabaneros-national-park-near-toledo", "canal-de-castilla-near-valladolid", "donana-national-park-near-seville", "flysch-basque-coast-near-bilbao", "llobregat-delta-near-barcelona", "najerilla-near-logrono", "picos-de-europa-national-park-near-santander", "sierra-de-san-pedro-near-caceres"],
    featuredCities: ["barcelona", "bilbao", "caceres", "logrono", "santander", "seville"],
  },
  {
    slug: "sweden-islands",
    title: "Sweden Islands",
    description:
      "Sweden Islands groups 7 nearby places across 4 cities for local-first day and weekend discovery — mainly islands. This is a geographic discovery collection derived from island geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "island_region",
    cities: ["gothenburg", "stockholm", "umea", "visby"],
    nearbyPlaces: ["gothenburg-archipelago-near-gothenburg", "gotska-sandon-national-park-near-visby", "holmoarna-near-umea", "sodra-bohuslan-archipelago-near-gothenburg", "marstrand-near-gothenburg", "stockholm-archipelago-near-stockholm", "angso-national-park-near-stockholm"],
    featuredPlaces: ["gothenburg-archipelago-near-gothenburg", "gotska-sandon-national-park-near-visby", "holmoarna-near-umea", "sodra-bohuslan-archipelago-near-gothenburg", "marstrand-near-gothenburg", "stockholm-archipelago-near-stockholm", "angso-national-park-near-stockholm"],
    featuredCities: ["gothenburg", "stockholm", "umea", "visby"],
  },
  {
    slug: "sweden-national-parks",
    title: "Sweden National Parks",
    description:
      "Sweden National Parks groups 6 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, islands. This is a geographic discovery collection derived from a shared protected-area system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["gothenburg", "helsingborg", "jonkoping", "malmo", "stockholm", "uppsala"],
    nearbyPlaces: ["dalby-soderskog-national-park-near-malmo", "farnebofjarden-national-park-near-uppsala", "sodra-bohuslan-archipelago-near-gothenburg", "store-mosse-national-park-near-jonkoping", "soderasen-national-park-near-helsingborg", "angso-national-park-near-stockholm"],
    featuredPlaces: ["dalby-soderskog-national-park-near-malmo", "farnebofjarden-national-park-near-uppsala", "sodra-bohuslan-archipelago-near-gothenburg", "store-mosse-national-park-near-jonkoping", "soderasen-national-park-near-helsingborg", "angso-national-park-near-stockholm"],
    featuredCities: ["gothenburg", "helsingborg", "jonkoping", "malmo", "stockholm", "uppsala"],
  },
  {
    slug: "sweden-nature-escapes",
    title: "Sweden Nature Escapes",
    description:
      "Sweden Nature Escapes groups 9 nearby places across 7 cities for local-first day and weekend discovery — mainly nature areas, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["helsingborg", "jonkoping", "linkoping", "malmo", "umea", "uppsala", "visby"],
    nearbyPlaces: ["dalby-soderskog-national-park-near-malmo", "farnebofjarden-national-park-near-uppsala", "high-coast-near-umea", "hogklint-near-visby", "kullaberg-near-malmo", "store-mosse-national-park-near-jonkoping", "soderasen-national-park-near-helsingborg", "takern-near-linkoping", "oresund-near-helsingborg"],
    featuredPlaces: ["dalby-soderskog-national-park-near-malmo", "farnebofjarden-national-park-near-uppsala", "high-coast-near-umea", "hogklint-near-visby", "kullaberg-near-malmo", "store-mosse-national-park-near-jonkoping", "soderasen-national-park-near-helsingborg", "takern-near-linkoping"],
    featuredCities: ["helsingborg", "malmo", "jonkoping", "linkoping", "umea", "uppsala"],
  },
  {
    slug: "united-kingdom-coast",
    title: "United Kingdom Coast",
    description:
      "United Kingdom Coast groups 7 nearby places across 7 cities for local-first day and weekend discovery — mainly beaches, waterfronts. This is a geographic discovery collection derived from a shared coastline; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "coastal_region",
    cities: ["bristol", "durham", "edinburgh", "exeter", "liverpool", "norwich", "swansea"],
    nearbyPlaces: ["durham-coast-near-durham", "formby-near-liverpool", "gower-peninsula-near-swansea", "jurassic-coast-near-exeter", "norfolk-coast-near-norwich", "sand-point-near-bristol", "yellowcraig-near-edinburgh"],
    featuredPlaces: ["durham-coast-near-durham", "formby-near-liverpool", "gower-peninsula-near-swansea", "jurassic-coast-near-exeter", "norfolk-coast-near-norwich", "sand-point-near-bristol", "yellowcraig-near-edinburgh"],
    featuredCities: ["bristol", "durham", "edinburgh", "exeter", "liverpool", "norwich"],
  },
  {
    slug: "united-kingdom-forests",
    title: "United Kingdom Forests",
    description:
      "United Kingdom Forests groups 6 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas. This is a geographic discovery collection derived from forest landscapes; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "forest_region",
    cities: ["birmingham", "bristol", "liverpool", "norwich", "southampton", "swansea"],
    nearbyPlaces: ["afan-forest-park-near-swansea", "delamere-forest-near-liverpool", "forest-of-dean-near-bristol", "new-forest-national-park-near-southampton", "thetford-forest-near-norwich", "wyre-forest-near-birmingham"],
    featuredPlaces: ["afan-forest-park-near-swansea", "delamere-forest-near-liverpool", "forest-of-dean-near-bristol", "new-forest-national-park-near-southampton", "thetford-forest-near-norwich", "wyre-forest-near-birmingham"],
    featuredCities: ["birmingham", "bristol", "liverpool", "norwich", "southampton", "swansea"],
  },
  {
    slug: "united-kingdom-lakes",
    title: "United Kingdom Lakes",
    description:
      "United Kingdom Lakes groups 7 nearby places across 7 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["bristol", "carlisle", "inverness", "manchester", "newcastle-upon-tyne", "nottingham", "stoke-on-trent"],
    nearbyPlaces: ["carsington-water-near-nottingham", "chew-valley-lake-near-bristol", "dovestone-reservoir-near-manchester", "kielder-water-near-newcastle-upon-tyne", "lake-district-near-carlisle", "loch-ness-near-inverness", "tittesworth-reservoir-near-stoke-on-trent"],
    featuredPlaces: ["carsington-water-near-nottingham", "chew-valley-lake-near-bristol", "dovestone-reservoir-near-manchester", "kielder-water-near-newcastle-upon-tyne", "lake-district-near-carlisle", "loch-ness-near-inverness", "tittesworth-reservoir-near-stoke-on-trent"],
    featuredCities: ["bristol", "carlisle", "inverness", "manchester", "newcastle-upon-tyne", "nottingham"],
  },
  {
    slug: "united-kingdom-mountains",
    title: "United Kingdom Mountains",
    description:
      "United Kingdom Mountains groups 10 nearby places across 5 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["belfast", "birmingham", "cardiff", "derry", "lancaster"],
    nearbyPlaces: ["brecon-beacons-near-cardiff", "caerphilly-mountain-near-cardiff", "cave-hill-near-belfast", "clent-hills-near-birmingham", "garth-mountain-near-cardiff", "malvern-hills-near-birmingham", "mourne-mountains-near-belfast", "slieve-croob-near-belfast", "sperrins-near-derry", "yorkshire-dales-near-lancaster"],
    featuredPlaces: ["brecon-beacons-near-cardiff", "caerphilly-mountain-near-cardiff", "cave-hill-near-belfast", "clent-hills-near-birmingham", "garth-mountain-near-cardiff", "malvern-hills-near-birmingham", "mourne-mountains-near-belfast", "slieve-croob-near-belfast"],
    featuredCities: ["belfast", "cardiff", "birmingham", "derry", "lancaster"],
  },
  {
    slug: "united-kingdom-national-parks",
    title: "United Kingdom National Parks",
    description:
      "United Kingdom National Parks groups 9 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas, mountains. This is a geographic discovery collection derived from a shared protected-area system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["aberdeen", "brighton", "cardiff", "glasgow", "leeds", "manchester", "newcastle-upon-tyne", "sheffield", "southampton", "york"],
    nearbyPlaces: ["brecon-beacons-near-cardiff", "cairngorms-national-park-near-aberdeen", "loch-lomond-and-the-trossachs-near-glasgow", "new-forest-national-park-near-southampton", "north-york-moors-national-park-near-york", "northumberland-national-park-near-newcastle-upon-tyne", "peak-district-near-manchester", "south-downs-national-park-near-brighton", "yorkshire-dales-near-leeds"],
    featuredPlaces: ["brecon-beacons-near-cardiff", "cairngorms-national-park-near-aberdeen", "loch-lomond-and-the-trossachs-near-glasgow", "new-forest-national-park-near-southampton", "north-york-moors-national-park-near-york", "northumberland-national-park-near-newcastle-upon-tyne", "peak-district-near-manchester", "south-downs-national-park-near-brighton"],
    featuredCities: ["aberdeen", "brighton", "cardiff", "glasgow", "leeds", "manchester"],
  },
  {
    slug: "united-kingdom-nature-escapes",
    title: "United Kingdom Nature Escapes",
    description:
      "United Kingdom Nature Escapes groups 21 nearby places across 17 cities for local-first day and weekend discovery — mainly nature areas, parks, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["aberdeen", "bath", "belfast", "brighton", "carlisle", "derry", "edinburgh", "exeter", "glasgow", "leeds", "london", "manchester", "newcastle-upon-tyne", "nottingham", "sheffield", "truro", "york"],
    nearbyPlaces: ["aberlady-bay-near-edinburgh", "cairngorms-national-park-near-aberdeen", "carrick-roads-near-truro", "dartmoor-near-exeter", "glens-of-antrim-near-belfast", "hadrians-wall-near-carlisle", "holyrood-park-edinburgh", "hyde-park-london", "loch-lomond-and-the-trossachs-near-glasgow", "lough-foyle-near-derry", "lyme-park-near-manchester", "mendip-hills-near-bath", "mugdock-country-park-near-glasgow", "north-york-moors-national-park-near-york", "northumberland-national-park-near-newcastle-upon-tyne", "peak-district-near-nottingham", "peak-district-near-manchester", "rivington-near-manchester", "roseland-peninsula-near-truro", "south-downs-national-park-near-brighton", "yorkshire-dales-near-leeds"],
    featuredPlaces: ["aberlady-bay-near-edinburgh", "cairngorms-national-park-near-aberdeen", "carrick-roads-near-truro", "dartmoor-near-exeter", "glens-of-antrim-near-belfast", "hadrians-wall-near-carlisle", "holyrood-park-edinburgh", "hyde-park-london"],
    featuredCities: ["manchester", "edinburgh", "glasgow", "truro", "aberdeen", "bath"],
  },
  {
    slug: "united-kingdom-protected-landscapes",
    title: "United Kingdom Protected Landscapes",
    description:
      "United Kingdom Protected Landscapes groups 10 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["birmingham", "cambridge", "durham", "edinburgh", "inverness", "lancaster", "lincoln", "liverpool", "london", "oxford"],
    nearbyPlaces: ["arnside-and-silverdale-national-landscape-near-lancaster", "cannock-chase-near-birmingham", "cotswolds-near-oxford", "glen-affric-near-inverness", "hartsholme-country-park-near-lincoln", "north-pennines-near-durham", "pentland-hills-edinburgh", "richmond-park-london", "thurstaston-common-near-liverpool", "wicken-fen-near-cambridge"],
    featuredPlaces: ["arnside-and-silverdale-national-landscape-near-lancaster", "cannock-chase-near-birmingham", "cotswolds-near-oxford", "glen-affric-near-inverness", "hartsholme-country-park-near-lincoln", "north-pennines-near-durham", "pentland-hills-edinburgh", "richmond-park-london"],
    featuredCities: ["london", "birmingham", "cambridge", "durham", "edinburgh", "inverness"],
  },
  {
    slug: "united-states-coast",
    title: "United States Coast",
    description:
      "United States Coast groups 10 nearby places across 10 cities for local-first day and weekend discovery — mainly beaches, waterfronts. This is a geographic discovery collection derived from a shared coastline; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "coastal_region",
    cities: ["bellingham", "boston", "charleston", "eugene", "los-angeles", "new-york", "portland", "san-francisco", "savannah", "seattle"],
    nearbyPlaces: ["ano-nuevo-state-park-near-san-francisco", "cape-cod-near-boston", "crystal-cove-state-park-near-los-angeles", "deception-pass-state-park-near-seattle", "folly-beach-near-charleston", "jones-beach-state-park-near-new-york", "larrabee-state-park-near-bellingham", "oregon-dunes-national-recreation-area-near-eugene", "oswald-west-state-park-near-portland", "tybee-island-near-savannah"],
    featuredPlaces: ["ano-nuevo-state-park-near-san-francisco", "cape-cod-near-boston", "crystal-cove-state-park-near-los-angeles", "deception-pass-state-park-near-seattle", "folly-beach-near-charleston", "jones-beach-state-park-near-new-york", "larrabee-state-park-near-bellingham", "oregon-dunes-national-recreation-area-near-eugene"],
    featuredCities: ["bellingham", "boston", "charleston", "eugene", "los-angeles", "new-york"],
  },
  {
    slug: "united-states-forests",
    title: "United States Forests",
    description:
      "United States Forests groups 9 nearby places across 8 cities for local-first day and weekend discovery — mainly nature areas. This is a geographic discovery collection derived from forest landscapes; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "forest_region",
    cities: ["asheville", "boise", "boulder", "charleston", "grand-rapids", "milwaukee", "san-francisco", "santa-fe"],
    nearbyPlaces: ["big-basin-redwoods-state-park-near-san-francisco", "boise-national-forest-near-boise", "dupont-state-recreational-forest-near-asheville", "francis-marion-national-forest-near-charleston", "kettle-moraine-state-forest-near-milwaukee", "manistee-national-forest-near-grand-rapids", "muir-woods-near-san-francisco", "roosevelt-national-forest-near-boulder", "santa-fe-national-forest-near-santa-fe"],
    featuredPlaces: ["big-basin-redwoods-state-park-near-san-francisco", "boise-national-forest-near-boise", "dupont-state-recreational-forest-near-asheville", "francis-marion-national-forest-near-charleston", "kettle-moraine-state-forest-near-milwaukee", "manistee-national-forest-near-grand-rapids", "muir-woods-near-san-francisco", "roosevelt-national-forest-near-boulder"],
    featuredCities: ["san-francisco", "asheville", "boise", "boulder", "charleston", "grand-rapids"],
  },
  {
    slug: "united-states-lakes",
    title: "United States Lakes",
    description:
      "United States Lakes groups 10 nearby places across 10 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["austin", "burlington-vt", "denver", "madison", "missoula", "nashville", "providence", "sacramento", "salt-lake-city", "traverse-city"],
    nearbyPlaces: ["chatfield-state-park-near-denver", "devils-lake-state-park-near-madison", "flathead-lake-near-missoula", "folsom-lake-recreation-area-near-sacramento", "great-salt-lake-near-salt-lake-city", "interlochen-state-park-near-traverse-city", "lake-champlain-near-burlington-vt", "lake-travis-near-austin", "lincoln-woods-state-park-near-providence", "radnor-lake-state-park-near-nashville"],
    featuredPlaces: ["chatfield-state-park-near-denver", "devils-lake-state-park-near-madison", "flathead-lake-near-missoula", "folsom-lake-recreation-area-near-sacramento", "great-salt-lake-near-salt-lake-city", "interlochen-state-park-near-traverse-city", "lake-champlain-near-burlington-vt", "lake-travis-near-austin"],
    featuredCities: ["austin", "burlington-vt", "denver", "madison", "missoula", "nashville"],
  },
  {
    slug: "united-states-mountains",
    title: "United States Mountains",
    description:
      "United States Mountains groups 20 nearby places across 16 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["albuquerque", "anchorage", "bellingham", "boulder", "charlotte", "chattanooga", "denver", "knoxville", "los-angeles", "omaha", "portland", "richmond", "salt-lake-city", "san-diego", "seattle", "spokane"],
    nearbyPlaces: ["angeles-national-forest-near-los-angeles", "big-cottonwood-canyon-near-salt-lake-city", "chugach-state-park-near-anchorage", "crowders-mountain-state-park-near-charlotte", "cuyamaca-rancho-state-park-near-san-diego", "golden-gate-canyon-state-park-near-denver", "great-smoky-mountains-national-park-near-knoxville", "jemez-mountains-near-albuquerque", "little-cottonwood-canyon-near-salt-lake-city", "loess-hills-near-omaha", "lookout-mountain-near-chattanooga", "mount-hood-national-forest-near-portland", "mount-rainier-near-seattle", "mount-spokane-state-park-near-spokane", "north-cascades-national-park-near-bellingham", "pike-national-forest-near-denver", "rocky-mountain-national-park-near-boulder", "san-gabriel-mountains-national-monument-near-los-angeles", "santa-monica-mountains-recreation-area-near-los-angeles", "shenandoah-national-park-near-richmond"],
    featuredPlaces: ["angeles-national-forest-near-los-angeles", "big-cottonwood-canyon-near-salt-lake-city", "chugach-state-park-near-anchorage", "crowders-mountain-state-park-near-charlotte", "cuyamaca-rancho-state-park-near-san-diego", "golden-gate-canyon-state-park-near-denver", "great-smoky-mountains-national-park-near-knoxville", "jemez-mountains-near-albuquerque"],
    featuredCities: ["los-angeles", "denver", "salt-lake-city", "albuquerque", "anchorage", "bellingham"],
  },
  {
    slug: "united-states-national-parks",
    title: "United States National Parks",
    description:
      "United States National Parks groups 17 nearby places across 16 cities for local-first day and weekend discovery — mainly nature areas, mountains, waterfronts. This is a geographic discovery collection derived from a shared protected-area system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["atlanta", "bellingham", "boulder", "chicago", "cleveland", "durango", "knoxville", "los-angeles", "louisville", "miami", "richmond", "san-diego", "san-francisco", "santa-barbara", "seattle", "tucson"],
    nearbyPlaces: ["cabrillo-national-monument-near-san-diego", "channel-islands-national-park-near-santa-barbara", "chattahoochee-river-recreation-area-near-atlanta", "cuyahoga-valley-national-park-near-cleveland", "everglades-near-miami", "great-smoky-mountains-national-park-near-knoxville", "indiana-dunes-near-chicago", "mammoth-cave-national-park-near-louisville", "mesa-verde-national-park-near-durango", "mount-rainier-near-seattle", "muir-woods-near-san-francisco", "north-cascades-national-park-near-bellingham", "olympic-near-seattle", "rocky-mountain-national-park-near-boulder", "saguaro-national-park-near-tucson", "santa-monica-mountains-recreation-area-near-los-angeles", "shenandoah-national-park-near-richmond"],
    featuredPlaces: ["cabrillo-national-monument-near-san-diego", "channel-islands-national-park-near-santa-barbara", "chattahoochee-river-recreation-area-near-atlanta", "cuyahoga-valley-national-park-near-cleveland", "everglades-near-miami", "great-smoky-mountains-national-park-near-knoxville", "indiana-dunes-near-chicago", "mammoth-cave-national-park-near-louisville"],
    featuredCities: ["seattle", "atlanta", "bellingham", "boulder", "chicago", "cleveland"],
  },
  {
    slug: "united-states-nature-escapes",
    title: "United States Nature Escapes",
    description:
      "United States Nature Escapes groups 30 nearby places across 28 cities for local-first day and weekend discovery — mainly parks, nature areas, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["boston", "boulder", "bozeman", "buffalo", "chicago", "cincinnati", "columbus", "dallas", "des-moines", "detroit", "duluth", "fargo", "honolulu", "houston", "indianapolis", "iowa-city", "knoxville", "louisville", "miami", "new-orleans", "new-york", "phoenix", "providence", "san-antonio", "san-diego", "santa-cruz", "st-louis", "tampa"],
    nearbyPlaces: ["anza-borrego-desert-state-park-near-san-diego", "belle-isle-park-near-detroit", "big-basin-redwoods-state-park-near-santa-cruz", "blue-hills-reservation-near-boston", "brazos-bend-state-park-near-houston", "brown-county-state-park-near-indianapolis", "cabrillo-national-monument-near-san-diego", "castlewood-state-park-near-st-louis", "cedar-hill-state-park-near-dallas", "colt-state-park-near-providence", "eldorado-canyon-state-park-near-boulder", "everglades-near-miami", "fort-ransom-state-park-near-fargo", "frozen-head-state-park-near-knoxville", "gallatin-river-near-bozeman", "golden-gate-canyon-state-park-near-boulder", "guadalupe-river-state-park-near-san-antonio", "harriman-state-park-near-new-york", "hillsborough-river-state-park-near-tampa", "hocking-hills-state-park-near-columbus", "hueston-woods-state-park-near-cincinnati", "indiana-dunes-near-chicago", "jay-cooke-state-park-near-duluth", "jean-lafitte-national-historical-park-near-new-orleans", "kaena-point-near-honolulu", "ledges-state-park-near-des-moines", "letchworth-state-park-near-buffalo", "lost-dutchman-state-park-near-phoenix", "mammoth-cave-national-park-near-louisville", "maquoketa-caves-state-park-near-iowa-city"],
    featuredPlaces: ["anza-borrego-desert-state-park-near-san-diego", "belle-isle-park-near-detroit", "big-basin-redwoods-state-park-near-santa-cruz", "blue-hills-reservation-near-boston", "brazos-bend-state-park-near-houston", "brown-county-state-park-near-indianapolis", "cabrillo-national-monument-near-san-diego", "castlewood-state-park-near-st-louis"],
    featuredCities: ["boulder", "san-diego", "boston", "bozeman", "buffalo", "chicago"],
  },
  {
    slug: "united-states-river-valleys",
    title: "United States River Valleys",
    description:
      "United States River Valleys groups 5 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas, waterfronts. This is a geographic discovery collection derived from river-valley geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "river_region",
    cities: ["atlanta", "chicago", "cleveland", "minneapolis", "portland"],
    nearbyPlaces: ["chattahoochee-river-recreation-area-near-atlanta", "columbia-river-gorge-near-portland", "cuyahoga-valley-national-park-near-cleveland", "kankakee-river-state-park-near-chicago", "mississippi-river-recreation-area-near-minneapolis"],
    featuredPlaces: ["chattahoochee-river-recreation-area-near-atlanta", "columbia-river-gorge-near-portland", "cuyahoga-valley-national-park-near-cleveland", "kankakee-river-state-park-near-chicago", "mississippi-river-recreation-area-near-minneapolis"],
    featuredCities: ["atlanta", "chicago", "cleveland", "minneapolis", "portland"],
  },
];

const VALID_REGION_TYPES: ReadonlySet<string> = new Set<RegionType>([
  "mountain_region", "coastal_region", "lake_region", "river_region",
  "national_park_region", "forest_region", "island_region", "cross_border_region",
  "protected_landscape_region", "weekend_escape_region",
]);
const MIN_PLACES = 5;
const MIN_CITIES = 2;

// Category-consistency: for single-feature region types, every member place
// must carry a matching nearby-place category (national-park / cross-border /
// weekend-escape span categories and are intentionally unconstrained).
const ALLOWED_CATEGORIES: Partial<Record<RegionType, ReadonlySet<string>>> = {
  mountain_region: new Set(["mountain"]),
  lake_region: new Set(["lake"]),
  coastal_region: new Set(["beach", "island", "waterfront"]),
  island_region: new Set(["island"]),
  river_region: new Set(["nature", "park", "waterfront"]),
  forest_region: new Set(["nature", "park"]),
  protected_landscape_region: new Set(["park", "nature"]),
};

function assertRegionalCollections(cols: readonly RegionalCollection[]): void {
  const citySlugs = new Set(cities.map((c) => c.slug));
  const placeSlugs = new Set(nearbyWeekendPlaces.map((p) => p.slug));
  const placeCategory = new Map(nearbyWeekendPlaces.map((p) => [p.slug, p.category]));
  const slugSeen = new Set<string>();
  const errors: string[] = [];
  for (const c of cols) {
    if (slugSeen.has(c.slug)) errors.push(`${c.slug}: duplicate collection slug`);
    slugSeen.add(c.slug);
    if (!VALID_REGION_TYPES.has(c.regionType)) errors.push(`${c.slug}: invalid regionType ${c.regionType}`);
    if (c.nearbyPlaces.length < MIN_PLACES) errors.push(`${c.slug}: ${c.nearbyPlaces.length} places below min ${MIN_PLACES}`);
    if (c.cities.length < MIN_CITIES) errors.push(`${c.slug}: ${c.cities.length} cities below min ${MIN_CITIES}`);
    const pSeen = new Set<string>();
    for (const p of c.nearbyPlaces) {
      if (pSeen.has(p)) errors.push(`${c.slug}: duplicate place ${p}`);
      pSeen.add(p);
      if (!placeSlugs.has(p)) errors.push(`${c.slug}: place ${p} not found in nearby-places.ts`);
      const allowed = ALLOWED_CATEGORIES[c.regionType];
      const cat = placeCategory.get(p);
      if (allowed && cat && !allowed.has(cat)) errors.push(`${c.slug}: place ${p} category ${cat} invalid for ${c.regionType}`);
    }
    const cSeen = new Set<string>();
    for (const ct of c.cities) {
      if (cSeen.has(ct)) errors.push(`${c.slug}: duplicate city ${ct}`);
      cSeen.add(ct);
      if (!citySlugs.has(ct)) errors.push(`${c.slug}: city ${ct} not found in cities.ts`);
    }
    for (const p of c.featuredPlaces) if (!pSeen.has(p)) errors.push(`${c.slug}: featuredPlace ${p} not in nearbyPlaces`);
    for (const ct of c.featuredCities) if (!cSeen.has(ct)) errors.push(`${c.slug}: featuredCity ${ct} not in cities`);
  }
  if (errors.length > 0) {
    throw new Error(`Invalid regional discovery collections (${errors.length}):\n  - ${errors.join("\n  - ")}`);
  }
}

assertRegionalCollections(REGIONAL_DISCOVERY_COLLECTIONS);

const BY_CITY = new Map<string, RegionalCollection[]>();
const BY_PLACE = new Map<string, RegionalCollection[]>();
for (const c of REGIONAL_DISCOVERY_COLLECTIONS) {
  for (const ct of c.cities) {
    const a = BY_CITY.get(ct) ?? []; a.push(c); BY_CITY.set(ct, a);
  }
  for (const p of c.nearbyPlaces) {
    const a = BY_PLACE.get(p) ?? []; a.push(c); BY_PLACE.set(p, a);
  }
}

export function getAllRegionalCollections(): readonly RegionalCollection[] {
  return REGIONAL_DISCOVERY_COLLECTIONS;
}
export function getRegionalCollectionBySlug(slug: string): RegionalCollection | undefined {
  return REGIONAL_DISCOVERY_COLLECTIONS.find((c) => c.slug === slug);
}
export function getRegionalCollectionsForCity(citySlug: string): readonly RegionalCollection[] {
  return BY_CITY.get(citySlug) ?? [];
}
export function getRegionalCollectionsForPlace(placeSlug: string): readonly RegionalCollection[] {
  return BY_PLACE.get(placeSlug) ?? [];
}

const REGION_TYPE_LABEL: Record<RegionType, string> = {
  mountain_region: "Mountain region",
  coastal_region: "Coastal region",
  lake_region: "Lake region",
  river_region: "River valley",
  national_park_region: "National parks",
  forest_region: "Forest region",
  island_region: "Island region",
  cross_border_region: "Cross-border region",
  protected_landscape_region: "Protected landscape",
  weekend_escape_region: "Weekend escapes",
};
export function getRegionTypeLabel(t: RegionType): string {
  return REGION_TYPE_LABEL[t];
}
