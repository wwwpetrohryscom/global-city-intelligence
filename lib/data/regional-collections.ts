import { cities } from "@/lib/data/cities";
import { nearbyWeekendPlaces } from "@/lib/data/nearby-places";
import type { RegionalCollection, RegionType } from "@/types";

/**
 * Regional discovery collections (Phase: local-first regional navigation).
 * Deterministically generated from city + nearby-place coordinates, nearby-place
 * categories, and Wikidata classifications (mountain range P4552, body of water P206,
 * protected-area operator P137, national park P31), plus geographic city clusters and
 * continental sub-threshold pools. Each collection is a named region with 5-30 nearby
 * places across 2-15 cities, answering "where else nearby could I spend a day or
 * weekend?" — never popularity or tourism ranking. Members reuse existing
 * /cities/[slug] and /nearby-weekend-places/[slug] routes.
 *
 * Integrity (unique slug, valid regionType, 5-30 places, 2-15 cities, no duplicate
 * refs, every city/place resolves, featured subsets, category-consistency, river/
 * forest token match, no same-type strict subset, valid non-self related refs, no
 * orphan) is enforced by `assertRegionalCollections` at module load, so invalid data
 * fails `next build`.
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
    relatedCollections: ["australia-national-parks", "australia-weekend-escapes", "weekend-escapes-near-hobart", "australia-mountains", "weekend-escapes-near-melbourne", "australia-islands", "baltic-sea-coast", "european-coast"],
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
    relatedCollections: ["australia-weekend-escapes", "queensland-weekend-escapes", "weekend-escapes-near-brisbane", "weekend-escapes-near-melbourne", "weekend-escapes-near-perth", "australia-national-parks", "australia-coast", "australia-mountains"],
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
    relatedCollections: ["australia-weekend-escapes", "australia-national-parks", "australia-coast", "queensland-weekend-escapes", "weekend-escapes-near-brisbane", "weekend-escapes-near-hobart", "australia-islands", "weekend-escapes-near-melbourne"],
  },
  {
    slug: "australia-national-parks",
    title: "Australia National Parks",
    description:
      "Australia National Parks groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly nature areas, beaches, mountains. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["adelaide", "ballarat", "brisbane", "bunbury", "cairns", "coffs-harbour", "devonport", "gold-coast", "hobart", "mackay", "perth", "port-macquarie", "rockhampton", "sydney"],
    nearbyPlaces: ["blue-mountains-near-sydney", "bongil-bongil-national-park-near-coffs-harbour", "byfield-national-park-near-rockhampton", "cape-hillsborough-national-park-near-mackay", "cleland-national-park-near-adelaide", "crowdy-bay-national-park-near-port-macquarie", "daguilar-national-park-near-brisbane", "daintree-national-park-near-cairns", "dorrigo-national-park-near-coffs-harbour", "eungella-national-park-near-mackay", "garigal-national-park-near-sydney", "grampians-national-park-near-ballarat", "john-forrest-national-park-near-perth", "kalamunda-national-park-near-perth", "ku-ring-gai-chase-national-park-near-sydney", "lamington-national-park-near-gold-coast", "mole-creek-karst-national-park-near-devonport", "mount-archer-national-park-near-rockhampton", "mount-field-national-park-near-hobart", "narawntapu-national-park-near-devonport", "nerang-national-park-near-gold-coast", "onkaparinga-river-national-park-near-adelaide", "royal-national-park-sydney", "south-bruny-national-park-near-hobart", "springbrook-national-park-near-gold-coast", "tamborine-national-park-near-brisbane", "tasman-national-park-near-hobart", "tuart-forest-national-park-near-bunbury", "venman-bushland-national-park-near-brisbane", "walyunga-national-park-near-perth"],
    featuredPlaces: ["blue-mountains-near-sydney", "bongil-bongil-national-park-near-coffs-harbour", "byfield-national-park-near-rockhampton", "cape-hillsborough-national-park-near-mackay", "cleland-national-park-near-adelaide", "crowdy-bay-national-park-near-port-macquarie", "daguilar-national-park-near-brisbane", "daintree-national-park-near-cairns"],
    featuredCities: ["sydney", "brisbane", "gold-coast", "hobart", "perth", "adelaide"],
    relatedCollections: ["australia-weekend-escapes", "australia-coast", "weekend-escapes-near-brisbane", "weekend-escapes-near-perth", "weekend-escapes-near-sydney", "queensland-weekend-escapes", "weekend-escapes-near-hobart", "australia-mountains"],
  },
  {
    slug: "australia-weekend-escapes",
    title: "Australia Weekend Escapes",
    description:
      "Australia Weekend Escapes groups 25 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, beaches, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["adelaide", "albury", "cairns", "canberra", "coffs-harbour", "darwin", "devonport", "geraldton", "gold-coast", "mackay", "melbourne", "mildura", "port-macquarie", "rockhampton", "townsville"],
    nearbyPlaces: ["bongil-bongil-national-park-near-coffs-harbour", "byfield-national-park-near-rockhampton", "cape-hillsborough-national-park-near-mackay", "cleland-national-park-near-adelaide", "crowdy-bay-national-park-near-port-macquarie", "daintree-national-park-near-cairns", "dorrigo-national-park-near-coffs-harbour", "eungella-national-park-near-mackay", "hallett-cove-conservation-park-near-adelaide", "hattah-kulkyne-national-park-near-mildura", "houtman-abrolhos-near-geraldton", "kalbarri-national-park-near-geraldton", "lake-hume-near-albury", "litchfield-national-park-near-darwin", "magnetic-island-near-townsville", "mole-creek-karst-national-park-near-devonport", "morialta-conservation-park-near-adelaide", "mount-archer-national-park-near-rockhampton", "namadgi-national-park-near-canberra", "narawntapu-national-park-near-devonport", "onkaparinga-river-national-park-near-adelaide", "tamborine-national-park-near-gold-coast", "werrikimbe-national-park-near-port-macquarie", "woomargama-national-park-near-albury", "you-yangs-regional-park-near-melbourne"],
    featuredPlaces: ["bongil-bongil-national-park-near-coffs-harbour", "byfield-national-park-near-rockhampton", "cape-hillsborough-national-park-near-mackay", "cleland-national-park-near-adelaide", "crowdy-bay-national-park-near-port-macquarie", "daintree-national-park-near-cairns", "dorrigo-national-park-near-coffs-harbour", "eungella-national-park-near-mackay"],
    featuredCities: ["adelaide", "albury", "coffs-harbour", "devonport", "geraldton", "mackay"],
    relatedCollections: ["australia-national-parks", "australia-coast", "australia-mountains", "queensland-weekend-escapes", "australia-islands", "oceania-lakes", "weekend-escapes-near-brisbane", "weekend-escapes-near-melbourne"],
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
    relatedCollections: ["weekend-escapes-near-innsbruck", "weekend-escapes-near-munich", "germany-lakes", "austria-italy-borderlands", "austria-lakes", "austria-mountains", "germany-mountains", "germany-forests"],
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
    relatedCollections: ["austria-mountains", "austria-germany-borderlands", "weekend-escapes-near-innsbruck", "weekend-escapes-near-venice", "italy-mountains", "italy-slovenia-borderlands", "austria-slovenia-borderlands", "italy-protected-landscapes"],
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
    relatedCollections: ["weekend-escapes-near-innsbruck", "weekend-escapes-near-graz", "austria-germany-borderlands", "austria-mountains", "austria-slovenia-borderlands", "austria-italy-borderlands", "european-lakes", "france-lakes"],
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
    relatedCollections: ["weekend-escapes-near-graz", "austria-italy-borderlands", "austria-germany-borderlands", "weekend-escapes-near-innsbruck", "austria-slovenia-borderlands", "austria-lakes", "australia-mountains", "canada-mountains"],
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
    relatedCollections: ["weekend-escapes-near-ljubljana", "weekend-escapes-near-graz", "italy-slovenia-borderlands", "austria-mountains", "austria-lakes", "european-mountains", "austria-italy-borderlands", "european-lakes"],
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
    relatedCollections: ["estonia-finland-borderlands", "sweden-islands", "sweden-weekend-escapes", "weekend-escapes-near-tallinn", "european-coast", "european-islands", "finland-islands", "weekend-escapes-near-hamburg"],
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
    relatedCollections: ["weekend-escapes-near-cologne", "germany-luxembourg-borderlands", "germany-netherlands-borderlands", "belgium-netherlands-borderlands", "germany-forests", "weekend-escapes-near-antwerp", "france-germany-borderlands", "germany-mountains"],
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
    relatedCollections: ["weekend-escapes-near-antwerp", "netherlands-national-parks", "weekend-escapes-near-rotterdam", "belgium-germany-borderlands", "germany-netherlands-borderlands", "weekend-escapes-near-amsterdam", "netherlands-weekend-escapes", "austria-germany-borderlands"],
  },
  {
    slug: "california-weekend-escapes",
    title: "California Weekend Escapes",
    description:
      "California Weekend Escapes groups 5 nearby places across 4 cities for local-first day and weekend discovery — mainly nature areas, lakes, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["los-angeles", "sacramento", "san-diego", "san-francisco"],
    nearbyPlaces: ["folsom-lake-recreation-area-near-sacramento", "muir-woods-near-san-francisco", "point-reyes-near-san-francisco", "santa-monica-mountains-recreation-area-near-los-angeles", "torrey-pines-state-reserve-near-san-diego"],
    featuredPlaces: ["folsom-lake-recreation-area-near-sacramento", "muir-woods-near-san-francisco", "point-reyes-near-san-francisco", "santa-monica-mountains-recreation-area-near-los-angeles", "torrey-pines-state-reserve-near-san-diego"],
    featuredCities: ["san-francisco", "los-angeles", "sacramento", "san-diego"],
    relatedCollections: ["weekend-escapes-near-san-francisco", "united-states-national-parks", "united-states-mountains", "united-states-weekend-escapes", "weekend-escapes-near-los-angeles", "united-states-forests", "united-states-lakes", "united-states-coast"],
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
    relatedCollections: ["canada-weekend-escapes", "canada-united-states-borderlands", "weekend-escapes-near-vancouver", "canada-national-parks", "weekend-escapes-near-montreal", "weekend-escapes-near-toronto", "canada-protected-landscapes", "canada-mountains"],
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
    relatedCollections: ["canada-weekend-escapes", "weekend-escapes-near-vancouver", "canada-national-parks", "weekend-escapes-near-montreal", "canada-islands", "canada-protected-landscapes", "canada-united-states-borderlands", "australia-mountains"],
  },
  {
    slug: "canada-national-parks",
    title: "Canada National Parks",
    description:
      "Canada National Parks groups 11 nearby places across 9 cities for local-first day and weekend discovery — mainly nature areas, mountains, parks. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["calgary", "charlottetown", "edmonton", "gatineau", "halifax", "montreal", "saskatoon", "sherbrooke", "winnipeg"],
    nearbyPlaces: ["banff-national-park-near-calgary", "elk-island-national-park-near-edmonton", "kejimkujik-national-park-near-halifax", "mont-orford-national-park-near-sherbrooke", "mont-tremblant-national-park-near-montreal", "oka-national-park-near-montreal", "plaisance-national-park-near-gatineau", "prince-albert-national-park-near-saskatoon", "prince-edward-island-national-park-near-charlottetown", "riding-mountain-national-park-near-winnipeg", "iles-de-boucherville-national-park-near-montreal"],
    featuredPlaces: ["banff-national-park-near-calgary", "elk-island-national-park-near-edmonton", "kejimkujik-national-park-near-halifax", "mont-orford-national-park-near-sherbrooke", "mont-tremblant-national-park-near-montreal", "oka-national-park-near-montreal", "plaisance-national-park-near-gatineau", "prince-albert-national-park-near-saskatoon"],
    featuredCities: ["montreal", "calgary", "charlottetown", "edmonton", "gatineau", "halifax"],
    relatedCollections: ["canada-weekend-escapes", "weekend-escapes-near-montreal", "canada-mountains", "canada-islands", "canada-united-states-borderlands", "australia-national-parks", "finland-national-parks", "france-national-parks"],
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
    relatedCollections: ["canada-weekend-escapes", "weekend-escapes-near-montreal", "weekend-escapes-near-vancouver", "canada-united-states-borderlands", "weekend-escapes-near-toronto", "canada-islands", "canada-mountains", "france-protected-landscapes"],
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
    relatedCollections: ["weekend-escapes-near-seattle", "weekend-escapes-near-vancouver", "canada-islands", "united-states-coast", "weekend-escapes-near-toronto", "canada-protected-landscapes", "united-states-national-parks", "united-states-lakes"],
  },
  {
    slug: "canada-weekend-escapes",
    title: "Canada Weekend Escapes",
    description:
      "Canada Weekend Escapes groups 22 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, mountains, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["calgary", "charlottetown", "edmonton", "halifax", "kamloops", "kelowna", "montreal", "prince-george", "quebec-city", "regina", "saskatoon", "st-johns", "sudbury", "thunder-bay", "whitehorse"],
    nearbyPlaces: ["banff-national-park-near-calgary", "elk-island-national-park-near-edmonton", "emerald-lake-near-whitehorse", "french-river-near-sudbury", "kananaskis-country-near-calgary", "kejimkujik-national-park-near-halifax", "killarney-provincial-park-near-sudbury", "lac-le-jeune-provincial-park-near-kamloops", "lake-superior-national-marine-conservation-area-near-thunder-bay", "last-mountain-lake-national-wildlife-area-near-regina", "miles-canyon-near-whitehorse", "nechako-river-near-prince-george", "okanagan-mountain-park-near-kelowna", "peter-lougheed-provincial-park-near-calgary", "plaisance-national-park-near-montreal", "prince-albert-national-park-near-saskatoon", "prince-edward-island-national-park-near-charlottetown", "signal-hill-near-st-johns", "sleeping-giant-provincial-park-near-thunder-bay", "spray-valley-provincial-park-near-calgary", "witless-bay-ecological-reserve-near-st-johns", "ile-d-orleans-near-quebec-city"],
    featuredPlaces: ["banff-national-park-near-calgary", "elk-island-national-park-near-edmonton", "emerald-lake-near-whitehorse", "french-river-near-sudbury", "kananaskis-country-near-calgary", "kejimkujik-national-park-near-halifax", "killarney-provincial-park-near-sudbury", "lac-le-jeune-provincial-park-near-kamloops"],
    featuredCities: ["calgary", "st-johns", "sudbury", "thunder-bay", "whitehorse", "charlottetown"],
    relatedCollections: ["canada-national-parks", "canada-protected-landscapes", "canada-mountains", "canada-islands", "weekend-escapes-near-montreal", "australia-weekend-escapes", "california-weekend-escapes", "finland-weekend-escapes"],
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
    relatedCollections: ["romania-mountains", "weekend-escapes-near-cluj-napoca", "european-mountains", "poland-mountains", "czechia-slovakia-borderlands", "poland-slovakia-borderlands", "romania-weekend-escapes", "weekend-escapes-near-brno"],
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
    relatedCollections: ["weekend-escapes-near-zagreb", "weekend-escapes-near-dubrovnik", "european-islands", "australia-mountains", "austria-mountains", "canada-mountains", "carpathians", "european-mountains"],
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
    relatedCollections: ["weekend-escapes-near-berlin", "germany-mountains", "weekend-escapes-near-prague", "weekend-escapes-near-munich", "germany-forests", "germany-poland-borderlands", "czechia-poland-borderlands", "european-mountains"],
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
    relatedCollections: ["poland-mountains", "poland-national-parks", "czechia-germany-borderlands", "european-mountains", "weekend-escapes-near-brno", "weekend-escapes-near-prague", "weekend-escapes-near-pozna", "czechia-slovakia-borderlands"],
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
    relatedCollections: ["weekend-escapes-near-bratislava", "weekend-escapes-near-brno", "european-mountains", "poland-slovakia-borderlands", "czechia-poland-borderlands", "carpathians", "austria-germany-borderlands", "austria-italy-borderlands"],
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
    relatedCollections: ["weekend-escapes-near-aarhus", "european-islands", "germany-weekend-escapes", "weekend-escapes-near-hamburg", "denmark-sweden-borderlands", "austria-germany-borderlands", "austria-italy-borderlands", "austria-slovenia-borderlands"],
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
    relatedCollections: ["weekend-escapes-near-malm", "weekend-escapes-near-aarhus", "sweden-national-parks", "denmark-germany-borderlands", "european-coast", "austria-germany-borderlands", "austria-italy-borderlands", "austria-slovenia-borderlands"],
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
    relatedCollections: ["weekend-escapes-near-helsinki", "baltic-sea-coast", "finland-islands", "finland-national-parks", "weekend-escapes-near-tallinn", "austria-germany-borderlands", "austria-italy-borderlands", "austria-slovenia-borderlands"],
  },
  {
    slug: "european-coast",
    title: "European Coast",
    description:
      "European Coast groups 16 nearby places across 14 cities for local-first day and weekend discovery — mainly beaches. This is a geographic discovery collection derived from a shared coastline; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "coastal_region",
    cities: ["amsterdam", "bayonne", "bruges", "caen", "cagliari", "constanta", "gdansk", "granada", "lisbon", "lubeck", "malmo", "san-sebastian", "tarragona", "venice"],
    nearbyPlaces: ["blankenberge-near-bruges", "knokke-heist-near-bruges", "nieuwpoort-near-bruges", "biarritz-near-bayonne", "cote-fleurie-near-caen", "travemunde-near-lubeck", "cavallino-treporti-near-venice", "poetto-near-cagliari", "zuid-kennemerland-national-park-near-amsterdam", "slowinski-national-park-near-gdansk", "costa-da-caparica-near-lisbon", "vama-veche-near-constanta", "cabo-de-gata-nijar-natural-park-near-granada", "costa-daurada-near-tarragona", "hendaye-bay-near-san-sebastian", "falsterbo-near-malmo"],
    featuredPlaces: ["biarritz-near-bayonne", "blankenberge-near-bruges", "cabo-de-gata-nijar-natural-park-near-granada", "cavallino-treporti-near-venice", "costa-daurada-near-tarragona", "costa-da-caparica-near-lisbon", "cote-fleurie-near-caen", "falsterbo-near-malmo"],
    featuredCities: ["bruges", "amsterdam", "bayonne", "caen", "cagliari", "constanta"],
    relatedCollections: ["spain-coast", "weekend-escapes-near-bruges", "france-spain-borderlands", "baltic-sea-coast", "denmark-sweden-borderlands", "france-weekend-escapes", "italy-weekend-escapes", "netherlands-national-parks"],
  },
  {
    slug: "european-forests",
    title: "European Forests",
    description:
      "European Forests groups 7 nearby places across 7 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from forest landscapes; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "forest_region",
    cities: ["aarhus", "brussels", "jaca", "karlovy-vary", "limerick", "paris", "rennes"],
    nearbyPlaces: ["sonian-forest-near-brussels", "slavkov-forest-near-karlovy-vary", "marselisborg-forests-near-aarhus", "foret-de-rambouillet-near-paris", "broceliande-forest-near-rennes", "curragh-chase-forest-park-near-limerick", "irati-forest-near-jaca"],
    featuredPlaces: ["curragh-chase-forest-park-near-limerick", "foret-de-rambouillet-near-paris", "irati-forest-near-jaca", "marselisborg-forests-near-aarhus", "broceliande-forest-near-rennes", "slavkov-forest-near-karlovy-vary", "sonian-forest-near-brussels"],
    featuredCities: ["aarhus", "brussels", "jaca", "karlovy-vary", "limerick", "paris"],
    relatedCollections: ["czechia-germany-borderlands", "france-spain-borderlands", "france-weekend-escapes", "spain-weekend-escapes", "weekend-escapes-near-aarhus", "weekend-escapes-near-antwerp", "weekend-escapes-near-cork", "weekend-escapes-near-paris"],
  },
  {
    slug: "european-islands",
    title: "European Islands",
    description:
      "European Islands groups 16 nearby places across 15 cities for local-first day and weekend discovery — mainly islands. This is a geographic discovery collection derived from island geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "island_region",
    cities: ["bilbao", "brest", "cork", "dublin", "dubrovnik", "esbjerg", "hamburg", "kingston-upon-hull", "konstanz", "la-rochelle", "liverpool", "naples", "parnu", "rijeka", "rostock"],
    nearbyPlaces: ["elaphiti-islands-near-dubrovnik", "krk-near-rijeka", "mljet-national-park-near-dubrovnik", "fano-near-esbjerg", "kihnu-near-parnu", "crozon-peninsula-near-brest", "ile-de-re-near-la-rochelle", "fischland-darss-zingst-near-rostock", "neuwerk-near-hamburg", "reichenau-island-near-konstanz", "bull-island-near-dublin", "fota-island-near-cork", "ischia-near-naples", "gaztelugatxe-near-bilbao", "hilbre-island-near-liverpool", "spurn-near-kingston-upon-hull"],
    featuredPlaces: ["bull-island-near-dublin", "crozon-peninsula-near-brest", "elaphiti-islands-near-dubrovnik", "fano-near-esbjerg", "fischland-darss-zingst-near-rostock", "fota-island-near-cork", "gaztelugatxe-near-bilbao", "hilbre-island-near-liverpool"],
    featuredCities: ["dubrovnik", "bilbao", "brest", "cork", "dublin", "esbjerg"],
    relatedCollections: ["denmark-germany-borderlands", "weekend-escapes-near-dubrovnik", "baltic-sea-coast", "france-spain-borderlands", "france-weekend-escapes", "germany-weekend-escapes", "italy-weekend-escapes", "united-kingdom-weekend-escapes"],
  },
  {
    slug: "european-lakes",
    title: "European Lakes",
    description:
      "European Lakes groups 15 nearby places across 15 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["bucharest", "budapest", "burgas", "cesis", "debrecen", "dublin", "evora", "ghent", "gothenburg", "ioannina", "jonkoping", "karlstad", "kaunas", "kranj", "leiden"],
    nearbyPlaces: ["donkmeer-near-ghent", "lake-burgas-near-burgas", "lake-pamvotida-near-ioannina", "lake-balaton-near-budapest", "lake-tisza-near-debrecen", "glendalough-near-dublin", "lake-burtnieks-near-cesis", "kaunas-reservoir-near-kaunas", "kaag-near-leiden", "alqueva-dam-near-evora", "snagov-near-bucharest", "lake-bled-near-kranj", "delsjon-near-gothenburg", "lake-vanern-near-karlstad", "vattern-near-jonkoping"],
    featuredPlaces: ["alqueva-dam-near-evora", "delsjon-near-gothenburg", "donkmeer-near-ghent", "glendalough-near-dublin", "kaag-near-leiden", "kaunas-reservoir-near-kaunas", "lake-balaton-near-budapest", "lake-bled-near-kranj"],
    featuredCities: ["bucharest", "budapest", "burgas", "cesis", "debrecen", "dublin"],
    relatedCollections: ["weekend-escapes-near-gothenburg", "austria-slovenia-borderlands", "romania-weekend-escapes", "sweden-weekend-escapes", "weekend-escapes-near-amsterdam", "weekend-escapes-near-antwerp", "weekend-escapes-near-budapest", "weekend-escapes-near-dublin"],
  },
  {
    slug: "european-mountains",
    title: "European Mountains",
    description:
      "European Mountains groups 16 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["banska-bystrica", "braga", "bratislava", "brno", "burgas", "evora", "karlovy-vary", "liberec", "ljubljana", "maribor", "ostrava", "pecs", "plovdiv", "sofia", "viseu"],
    nearbyPlaces: ["rhodope-mountains-near-plovdiv", "strandzha-near-burgas", "vitosha-near-sofia", "beskydy-protected-area-near-ostrava", "jested-near-liberec", "ore-mountains-near-karlovy-vary", "white-carpathians-near-brno", "mecsek-near-pecs", "peneda-geres-national-park-near-braga", "serra-da-estrela-natural-park-near-viseu", "serra-de-sao-mamede-near-evora", "little-carpathians-near-bratislava", "polana-near-banska-bystrica", "velka-fatra-near-bratislava", "pohorje-near-maribor", "triglav-national-park-near-ljubljana"],
    featuredPlaces: ["beskydy-protected-area-near-ostrava", "jested-near-liberec", "little-carpathians-near-bratislava", "mecsek-near-pecs", "ore-mountains-near-karlovy-vary", "peneda-geres-national-park-near-braga", "pohorje-near-maribor", "polana-near-banska-bystrica"],
    featuredCities: ["bratislava", "banska-bystrica", "braga", "brno", "burgas", "evora"],
    relatedCollections: ["czechia-slovakia-borderlands", "czechia-poland-borderlands", "weekend-escapes-near-bratislava", "weekend-escapes-near-brno", "weekend-escapes-near-porto", "weekend-escapes-near-prague", "weekend-escapes-near-sofia", "austria-slovenia-borderlands"],
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
    relatedCollections: ["weekend-escapes-near-helsinki", "finland-national-parks", "finland-weekend-escapes", "estonia-finland-borderlands", "baltic-sea-coast", "australia-islands", "canada-islands", "european-islands"],
  },
  {
    slug: "finland-national-parks",
    title: "Finland National Parks",
    description:
      "Finland National Parks groups 9 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas, islands, lakes. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["helsinki", "jyvaskyla", "rovaniemi", "tampere", "turku"],
    nearbyPlaces: ["archipelago-national-park-near-turku", "helvetinjarvi-national-park-near-tampere", "isojarvi-national-park-near-tampere", "leivonmaki-national-park-near-jyvaskyla", "liesjarvi-national-park-near-helsinki", "nuuksio-national-park-near-helsinki", "pyha-luosto-national-park-near-rovaniemi", "seitseminen-national-park-near-tampere", "tammisaari-archipelago-national-park-near-helsinki"],
    featuredPlaces: ["archipelago-national-park-near-turku", "helvetinjarvi-national-park-near-tampere", "isojarvi-national-park-near-tampere", "leivonmaki-national-park-near-jyvaskyla", "liesjarvi-national-park-near-helsinki", "nuuksio-national-park-near-helsinki", "pyha-luosto-national-park-near-rovaniemi", "seitseminen-national-park-near-tampere"],
    featuredCities: ["helsinki", "tampere", "jyvaskyla", "rovaniemi", "turku"],
    relatedCollections: ["weekend-escapes-near-helsinki", "finland-weekend-escapes", "finland-islands", "estonia-finland-borderlands", "baltic-sea-coast", "australia-national-parks", "canada-national-parks", "france-national-parks"],
  },
  {
    slug: "finland-weekend-escapes",
    title: "Finland Weekend Escapes",
    description:
      "Finland Weekend Escapes groups 9 nearby places across 6 cities for local-first day and weekend discovery — mainly lakes, nature areas, islands. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["jyvaskyla", "kuopio", "oulu", "rovaniemi", "tampere", "vaasa"],
    nearbyPlaces: ["hailuoto-near-oulu", "kallavesi-near-kuopio", "kemijoki-near-rovaniemi", "kvarken-archipelago-near-vaasa", "leivonmaki-national-park-near-jyvaskyla", "liesjarvi-national-park-near-tampere", "pyha-luosto-national-park-near-rovaniemi", "paijanne-near-jyvaskyla", "soderfjarden-near-vaasa"],
    featuredPlaces: ["hailuoto-near-oulu", "kallavesi-near-kuopio", "kemijoki-near-rovaniemi", "kvarken-archipelago-near-vaasa", "leivonmaki-national-park-near-jyvaskyla", "liesjarvi-national-park-near-tampere", "pyha-luosto-national-park-near-rovaniemi", "paijanne-near-jyvaskyla"],
    featuredCities: ["jyvaskyla", "rovaniemi", "vaasa", "kuopio", "oulu", "tampere"],
    relatedCollections: ["finland-national-parks", "finland-islands", "weekend-escapes-near-helsinki", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
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
    relatedCollections: ["weekend-escapes-near-strasbourg", "weekend-escapes-near-freiburg", "france-protected-landscapes", "germany-forests", "france-mountains", "germany-lakes", "germany-mountains", "france-lakes"],
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
    relatedCollections: ["france-mountains", "italy-mountains", "weekend-escapes-near-milan", "france-national-parks", "weekend-escapes-near-grenoble", "weekend-escapes-near-marseille", "italy-national-parks", "italy-protected-landscapes"],
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
    relatedCollections: ["weekend-escapes-near-grenoble", "france-weekend-escapes", "weekend-escapes-near-strasbourg", "weekend-escapes-near-marseille", "france-mountains", "france-germany-borderlands", "france-italy-borderlands", "france-national-parks"],
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
    relatedCollections: ["weekend-escapes-near-marseille", "weekend-escapes-near-grenoble", "france-national-parks", "france-italy-borderlands", "france-spain-borderlands", "weekend-escapes-near-bordeaux", "france-germany-borderlands", "weekend-escapes-near-strasbourg"],
  },
  {
    slug: "france-national-parks",
    title: "France National Parks",
    description:
      "France National Parks groups 5 nearby places across 5 cities for local-first day and weekend discovery — mainly mountains, nature areas. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["grenoble", "marseille", "montpellier", "nice", "pau"],
    nearbyPlaces: ["calanques-near-marseille", "cevennes-national-park-near-montpellier", "mercantour-national-park-near-nice", "pyrenees-national-park-near-pau", "ecrins-national-park-near-grenoble"],
    featuredPlaces: ["calanques-near-marseille", "cevennes-national-park-near-montpellier", "mercantour-national-park-near-nice", "pyrenees-national-park-near-pau", "ecrins-national-park-near-grenoble"],
    featuredCities: ["grenoble", "marseille", "montpellier", "nice", "pau"],
    relatedCollections: ["france-mountains", "weekend-escapes-near-marseille", "france-italy-borderlands", "france-spain-borderlands", "weekend-escapes-near-bordeaux", "weekend-escapes-near-grenoble", "france-lakes", "france-weekend-escapes"],
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
    relatedCollections: ["france-weekend-escapes", "france-germany-borderlands", "weekend-escapes-near-strasbourg", "weekend-escapes-near-bordeaux", "weekend-escapes-near-grenoble", "weekend-escapes-near-toulouse", "france-mountains", "france-lakes"],
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
    relatedCollections: ["weekend-escapes-near-bilbao", "spain-mountains", "weekend-escapes-near-bordeaux", "france-mountains", "european-coast", "spain-protected-landscapes", "spain-weekend-escapes", "european-forests"],
  },
  {
    slug: "france-weekend-escapes",
    title: "France Weekend Escapes",
    description:
      "France Weekend Escapes groups 15 nearby places across 12 cities for local-first day and weekend discovery — mainly mountains, nature areas, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["annecy", "besancon", "brest", "caen", "clermont-ferrand", "dijon", "grenoble", "lille", "marseille", "nantes", "nimes", "rennes"],
    nearbyPlaces: ["armorique-regional-natural-park-near-brest", "crozon-peninsula-near-brest", "cevennes-national-park-near-nimes", "cote-fleurie-near-caen", "lac-pavin-near-clermont-ferrand", "lac-de-saint-point-near-besancon", "lac-du-bourget-near-grenoble", "marais-audomarois-near-lille", "massif-des-bauges-near-annecy", "montagne-sainte-victoire-near-marseille", "morvan-regional-park-near-dijon", "normandy-maine-regional-natural-park-near-caen", "broceliande-forest-near-rennes", "parc-naturel-regional-de-briere-near-nantes", "puy-de-sancy-near-clermont-ferrand"],
    featuredPlaces: ["armorique-regional-natural-park-near-brest", "crozon-peninsula-near-brest", "cevennes-national-park-near-nimes", "cote-fleurie-near-caen", "lac-pavin-near-clermont-ferrand", "lac-de-saint-point-near-besancon", "lac-du-bourget-near-grenoble", "marais-audomarois-near-lille"],
    featuredCities: ["brest", "caen", "clermont-ferrand", "annecy", "besancon", "dijon"],
    relatedCollections: ["france-protected-landscapes", "france-lakes", "france-mountains", "european-coast", "european-forests", "european-islands", "weekend-escapes-near-grenoble", "weekend-escapes-near-marseille"],
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
    relatedCollections: ["weekend-escapes-near-frankfurt", "czechia-germany-borderlands", "weekend-escapes-near-berlin", "belgium-germany-borderlands", "france-germany-borderlands", "germany-luxembourg-borderlands", "weekend-escapes-near-cologne", "weekend-escapes-near-munich"],
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
    relatedCollections: ["weekend-escapes-near-munich", "austria-germany-borderlands", "weekend-escapes-near-hamburg", "france-germany-borderlands", "weekend-escapes-near-freiburg", "germany-weekend-escapes", "weekend-escapes-near-berlin", "germany-mountains"],
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
    relatedCollections: ["belgium-germany-borderlands", "weekend-escapes-near-cologne", "germany-forests", "germany-netherlands-borderlands", "france-germany-borderlands", "germany-mountains", "germany-weekend-escapes", "austria-germany-borderlands"],
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
    relatedCollections: ["czechia-germany-borderlands", "weekend-escapes-near-frankfurt", "weekend-escapes-near-munich", "germany-weekend-escapes", "germany-poland-borderlands", "weekend-escapes-near-berlin", "france-germany-borderlands", "weekend-escapes-near-freiburg"],
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
    relatedCollections: ["netherlands-national-parks", "weekend-escapes-near-cologne", "weekend-escapes-near-rotterdam", "belgium-germany-borderlands", "belgium-netherlands-borderlands", "netherlands-weekend-escapes", "germany-luxembourg-borderlands", "germany-forests"],
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
    relatedCollections: ["weekend-escapes-near-berlin", "czechia-germany-borderlands", "germany-mountains", "poland-national-parks", "czechia-poland-borderlands", "germany-forests", "germany-weekend-escapes", "poland-mountains"],
  },
  {
    slug: "germany-weekend-escapes",
    title: "Germany Weekend Escapes",
    description:
      "Germany Weekend Escapes groups 12 nearby places across 10 cities for local-first day and weekend discovery — mainly mountains, lakes, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["cologne", "erfurt", "gorlitz", "kiel", "lubeck", "mainz", "munich", "potsdam", "regensburg", "rostock"],
    nearbyPlaces: ["ammersee-near-munich", "bavarian-forest-national-park-near-regensburg", "berzdorfer-see-near-gorlitz", "fischland-darss-zingst-near-rostock", "grunewald-near-potsdam", "hainich-national-park-near-erfurt", "holstein-switzerland-near-kiel", "schaalsee-near-lubeck", "siebengebirge-near-cologne", "taunus-near-mainz", "thuringian-forest-near-erfurt", "zittau-mountains-near-gorlitz"],
    featuredPlaces: ["ammersee-near-munich", "bavarian-forest-national-park-near-regensburg", "berzdorfer-see-near-gorlitz", "fischland-darss-zingst-near-rostock", "grunewald-near-potsdam", "hainich-national-park-near-erfurt", "holstein-switzerland-near-kiel", "schaalsee-near-lubeck"],
    featuredCities: ["erfurt", "gorlitz", "cologne", "kiel", "lubeck", "mainz"],
    relatedCollections: ["germany-mountains", "denmark-germany-borderlands", "germany-lakes", "czechia-germany-borderlands", "european-islands", "germany-poland-borderlands", "weekend-escapes-near-hamburg", "weekend-escapes-near-munich"],
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
    relatedCollections: ["weekend-escapes-near-athens", "european-lakes", "australia-mountains", "austria-mountains", "canada-mountains", "carpathians", "croatia-mountains", "european-mountains"],
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
    relatedCollections: ["weekend-escapes-near-cork", "weekend-escapes-near-galway", "ireland-united-kingdom-borderlands", "weekend-escapes-near-dublin", "european-forests", "european-islands", "australia-mountains", "austria-mountains"],
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
    relatedCollections: ["weekend-escapes-near-belfast", "united-kingdom-mountains", "ireland-mountains", "weekend-escapes-near-dublin", "weekend-escapes-near-galway", "european-islands", "european-lakes", "austria-germany-borderlands"],
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
    relatedCollections: ["weekend-escapes-near-florence", "weekend-escapes-near-milan", "italy-weekend-escapes", "weekend-escapes-near-rome", "italy-mountains", "italy-national-parks", "austria-lakes", "european-lakes"],
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
    relatedCollections: ["italy-weekend-escapes", "italy-national-parks", "weekend-escapes-near-venice", "france-italy-borderlands", "weekend-escapes-near-milan", "austria-italy-borderlands", "italy-slovenia-borderlands", "weekend-escapes-near-florence"],
  },
  {
    slug: "italy-national-parks",
    title: "Italy National Parks",
    description:
      "Italy National Parks groups 7 nearby places across 6 cities for local-first day and weekend discovery — mainly mountains, nature areas, parks. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["bari", "laquila", "naples", "rome", "turin", "venice"],
    nearbyPlaces: ["alta-murgia-national-park-near-bari", "circeo-national-park-near-rome", "dolomiti-bellunesi-national-park-near-venice", "gran-paradiso-national-park-near-turin", "gran-sasso-and-monti-della-laga-national-park-near-laquila", "maiella-national-park-near-laquila", "vesuvius-national-park-near-naples"],
    featuredPlaces: ["alta-murgia-national-park-near-bari", "circeo-national-park-near-rome", "dolomiti-bellunesi-national-park-near-venice", "gran-paradiso-national-park-near-turin", "gran-sasso-and-monti-della-laga-national-park-near-laquila", "maiella-national-park-near-laquila", "vesuvius-national-park-near-naples"],
    featuredCities: ["laquila", "bari", "naples", "rome", "turin", "venice"],
    relatedCollections: ["italy-mountains", "weekend-escapes-near-rome", "italy-weekend-escapes", "france-italy-borderlands", "weekend-escapes-near-milan", "weekend-escapes-near-venice", "european-coast", "european-islands"],
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
    relatedCollections: ["weekend-escapes-near-milan", "weekend-escapes-near-venice", "austria-italy-borderlands", "france-italy-borderlands", "italy-slovenia-borderlands", "italy-weekend-escapes", "weekend-escapes-near-florence", "italy-mountains"],
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
    relatedCollections: ["weekend-escapes-near-venice", "austria-slovenia-borderlands", "weekend-escapes-near-ljubljana", "austria-italy-borderlands", "italy-mountains", "italy-protected-landscapes", "european-coast", "european-lakes"],
  },
  {
    slug: "italy-weekend-escapes",
    title: "Italy Weekend Escapes",
    description:
      "Italy Weekend Escapes groups 18 nearby places across 12 cities for local-first day and weekend discovery — mainly mountains, nature areas, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["ancona", "aosta", "bari", "bolzano", "cagliari", "catania", "milan", "naples", "palermo", "pisa", "trapani", "trento"],
    nearbyPlaces: ["alta-murgia-national-park-near-bari", "apuan-alps-near-pisa", "dolomites-near-bolzano", "favignana-near-trapani", "frasassi-caves-near-ancona", "ischia-near-naples", "lake-como-near-milan", "lake-garda-near-trento", "lake-iseo-near-milan", "madonie-park-near-palermo", "matese-regional-park-near-naples", "mont-blanc-near-aosta", "mount-etna-near-catania", "paganella-near-trento", "poetto-near-cagliari", "sorrentine-peninsula-near-naples", "vesuvius-national-park-near-naples", "zingaro-nature-reserve-near-trapani"],
    featuredPlaces: ["alta-murgia-national-park-near-bari", "apuan-alps-near-pisa", "dolomites-near-bolzano", "favignana-near-trapani", "frasassi-caves-near-ancona", "ischia-near-naples", "lake-como-near-milan", "lake-garda-near-trento"],
    featuredCities: ["naples", "milan", "trapani", "trento", "ancona", "aosta"],
    relatedCollections: ["italy-mountains", "italy-national-parks", "italy-lakes", "austria-italy-borderlands", "european-coast", "european-islands", "france-italy-borderlands", "italy-protected-landscapes"],
  },
  {
    slug: "netherlands-national-parks",
    title: "Netherlands National Parks",
    description:
      "Netherlands National Parks groups 10 nearby places across 9 cities for local-first day and weekend discovery — mainly nature areas, parks, beaches. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["amsterdam", "arnhem", "delft", "eindhoven", "groningen", "nijmegen", "tilburg", "utrecht", "zwolle"],
    nearbyPlaces: ["de-biesbosch-national-park-near-delft", "groote-peel-national-park-near-eindhoven", "de-maasduinen-national-park-near-nijmegen", "hoge-veluwe-national-park-near-arnhem", "lauwersmeer-national-park-near-groningen", "loonse-en-drunense-duinen-national-park-near-tilburg", "sallandse-heuvelrug-national-park-near-zwolle", "utrechtse-heuvelrug-national-park-near-utrecht", "veluwezoom-national-park-near-arnhem", "zuid-kennemerland-national-park-near-amsterdam"],
    featuredPlaces: ["de-biesbosch-national-park-near-delft", "groote-peel-national-park-near-eindhoven", "de-maasduinen-national-park-near-nijmegen", "hoge-veluwe-national-park-near-arnhem", "lauwersmeer-national-park-near-groningen", "loonse-en-drunense-duinen-national-park-near-tilburg", "sallandse-heuvelrug-national-park-near-zwolle", "utrechtse-heuvelrug-national-park-near-utrecht"],
    featuredCities: ["arnhem", "amsterdam", "delft", "eindhoven", "groningen", "nijmegen"],
    relatedCollections: ["germany-netherlands-borderlands", "weekend-escapes-near-rotterdam", "belgium-netherlands-borderlands", "weekend-escapes-near-amsterdam", "netherlands-weekend-escapes", "european-coast", "australia-national-parks", "canada-national-parks"],
  },
  {
    slug: "netherlands-weekend-escapes",
    title: "Netherlands Weekend Escapes",
    description:
      "Netherlands Weekend Escapes groups 5 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["groningen", "haarlem", "maastricht", "the-hague", "zwolle"],
    nearbyPlaces: ["lauwersmeer-national-park-near-groningen", "midden-delfland-near-the-hague", "sallandse-heuvelrug-national-park-near-zwolle", "sint-pietersberg-near-maastricht", "zuid-kennemerland-national-park-near-haarlem"],
    featuredPlaces: ["lauwersmeer-national-park-near-groningen", "midden-delfland-near-the-hague", "sallandse-heuvelrug-national-park-near-zwolle", "sint-pietersberg-near-maastricht", "zuid-kennemerland-national-park-near-haarlem"],
    featuredCities: ["groningen", "haarlem", "maastricht", "the-hague", "zwolle"],
    relatedCollections: ["germany-netherlands-borderlands", "netherlands-national-parks", "belgium-netherlands-borderlands", "weekend-escapes-near-amsterdam", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
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
    relatedCollections: ["new-zealand-weekend-escapes", "weekend-escapes-near-auckland", "weekend-escapes-near-queenstown", "weekend-escapes-near-wellington", "oceania-lakes", "australia-mountains", "austria-mountains", "canada-mountains"],
  },
  {
    slug: "new-zealand-weekend-escapes",
    title: "New Zealand Weekend Escapes",
    description:
      "New Zealand Weekend Escapes groups 7 nearby places across 4 cities for local-first day and weekend discovery — mainly mountains, lakes, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["christchurch", "napier", "new-plymouth", "rotorua"],
    nearbyPlaces: ["arthurs-pass-national-park-near-christchurch", "egmont-national-park-near-new-plymouth", "hanmer-springs-near-christchurch", "lake-rotokare-near-new-plymouth", "port-hills-near-christchurch", "te-mata-peak-near-napier", "waiotapu-near-rotorua"],
    featuredPlaces: ["arthurs-pass-national-park-near-christchurch", "egmont-national-park-near-new-plymouth", "hanmer-springs-near-christchurch", "lake-rotokare-near-new-plymouth", "port-hills-near-christchurch", "te-mata-peak-near-napier", "waiotapu-near-rotorua"],
    featuredCities: ["christchurch", "new-plymouth", "napier", "rotorua"],
    relatedCollections: ["new-zealand-mountains", "oceania-lakes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
  },
  {
    slug: "oceania-lakes",
    title: "Oceania Lakes",
    description:
      "Oceania Lakes groups 5 nearby places across 4 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["albury", "hamilton-new-zealand", "new-plymouth", "queenstown"],
    nearbyPlaces: ["lake-hume-near-albury", "lake-hayes-near-queenstown", "lake-karapiro-near-hamilton-new-zealand", "lake-rotokare-near-new-plymouth", "moke-lake-near-queenstown"],
    featuredPlaces: ["lake-hayes-near-queenstown", "lake-hume-near-albury", "lake-karapiro-near-hamilton-new-zealand", "lake-rotokare-near-new-plymouth", "moke-lake-near-queenstown"],
    featuredCities: ["queenstown", "albury", "hamilton-new-zealand", "new-plymouth"],
    relatedCollections: ["weekend-escapes-near-queenstown", "australia-weekend-escapes", "new-zealand-weekend-escapes", "weekend-escapes-near-auckland", "new-zealand-mountains", "austria-lakes", "european-lakes", "france-lakes"],
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
    relatedCollections: ["poland-slovakia-borderlands", "weekend-escapes-near-krakow", "poland-national-parks", "czechia-poland-borderlands", "weekend-escapes-near-pozna", "carpathians", "germany-poland-borderlands", "australia-mountains"],
  },
  {
    slug: "poland-national-parks",
    title: "Poland National Parks",
    description:
      "Poland National Parks groups 13 nearby places across 11 cities for local-first day and weekend discovery — mainly nature areas, mountains, beaches. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["bialystok", "bydgoszcz", "gdansk", "krakow", "lublin", "poznan", "rzeszow", "szczecin", "warsaw", "wroclaw", "zakopane"],
    nearbyPlaces: ["giant-mountains-national-park-near-wroclaw", "gorce-national-park-near-zakopane", "kampinos-national-park-near-warsaw", "magura-national-park-near-rzeszow", "narew-national-park-near-bialystok", "ojcow-national-park-near-krakow", "roztocze-national-park-near-lublin", "stolowe-mountains-national-park-near-wroclaw", "slowinski-national-park-near-gdansk", "tatra-national-park-near-zakopane", "tuchola-forest-national-park-near-bydgoszcz", "wielkopolska-national-park-near-poznan", "wolin-national-park-near-szczecin"],
    featuredPlaces: ["giant-mountains-national-park-near-wroclaw", "gorce-national-park-near-zakopane", "kampinos-national-park-near-warsaw", "magura-national-park-near-rzeszow", "narew-national-park-near-bialystok", "ojcow-national-park-near-krakow", "roztocze-national-park-near-lublin", "stolowe-mountains-national-park-near-wroclaw"],
    featuredCities: ["wroclaw", "zakopane", "bialystok", "bydgoszcz", "gdansk", "krakow"],
    relatedCollections: ["poland-mountains", "weekend-escapes-near-krakow", "weekend-escapes-near-pozna", "poland-slovakia-borderlands", "czechia-poland-borderlands", "poland-weekend-escapes", "weekend-escapes-near-warsaw", "germany-poland-borderlands"],
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
    relatedCollections: ["weekend-escapes-near-krakow", "poland-mountains", "weekend-escapes-near-bratislava", "poland-national-parks", "czechia-slovakia-borderlands", "czechia-poland-borderlands", "carpathians", "european-mountains"],
  },
  {
    slug: "poland-weekend-escapes",
    title: "Poland Weekend Escapes",
    description:
      "Poland Weekend Escapes groups 5 nearby places across 4 cities for local-first day and weekend discovery — mainly nature areas, islands. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bialystok", "gdynia", "szczecin", "torun"],
    nearbyPlaces: ["narew-national-park-near-bialystok", "szczecin-landscape-park-near-szczecin", "slowinski-national-park-near-gdynia", "tuchola-forest-near-torun", "wolin-national-park-near-szczecin"],
    featuredPlaces: ["narew-national-park-near-bialystok", "szczecin-landscape-park-near-szczecin", "slowinski-national-park-near-gdynia", "tuchola-forest-near-torun", "wolin-national-park-near-szczecin"],
    featuredCities: ["szczecin", "bialystok", "gdynia", "torun"],
    relatedCollections: ["poland-national-parks", "germany-poland-borderlands", "weekend-escapes-near-pozna", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
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
    relatedCollections: ["portugal-spain-borderlands", "portugal-weekend-escapes", "weekend-escapes-near-porto", "weekend-escapes-near-lisbon", "european-coast", "canada-protected-landscapes", "france-protected-landscapes", "italy-protected-landscapes"],
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
    relatedCollections: ["portugal-protected-landscapes", "weekend-escapes-near-porto", "spain-weekend-escapes", "portugal-weekend-escapes", "spain-national-parks", "european-mountains", "spain-protected-landscapes", "weekend-escapes-near-lisbon"],
  },
  {
    slug: "portugal-weekend-escapes",
    title: "Portugal Weekend Escapes",
    description:
      "Portugal Weekend Escapes groups 5 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["braganca", "coimbra", "faro", "funchal", "guimaraes"],
    nearbyPlaces: ["montesinho-natural-park-near-braganca", "peneda-geres-national-park-near-guimaraes", "ponta-de-sao-lourenco-near-funchal", "ria-formosa-natural-park-near-faro", "bucaco-forest-near-coimbra"],
    featuredPlaces: ["montesinho-natural-park-near-braganca", "peneda-geres-national-park-near-guimaraes", "ponta-de-sao-lourenco-near-funchal", "ria-formosa-natural-park-near-faro", "bucaco-forest-near-coimbra"],
    featuredCities: ["braganca", "coimbra", "faro", "funchal", "guimaraes"],
    relatedCollections: ["portugal-protected-landscapes", "portugal-spain-borderlands", "weekend-escapes-near-porto", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "queensland-weekend-escapes",
    title: "Queensland Weekend Escapes",
    description:
      "Queensland Weekend Escapes groups 6 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, mountains, islands. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["brisbane", "cairns", "gold-coast", "sunshine-coast", "toowoomba", "townsville"],
    nearbyPlaces: ["bunya-mountains-national-park-near-toowoomba", "daguilar-national-park-near-brisbane", "daintree-national-park-near-cairns", "magnetic-island-near-townsville", "noosa-national-park-near-sunshine-coast", "springbrook-national-park-near-gold-coast"],
    featuredPlaces: ["bunya-mountains-national-park-near-toowoomba", "daguilar-national-park-near-brisbane", "daintree-national-park-near-cairns", "magnetic-island-near-townsville", "noosa-national-park-near-sunshine-coast", "springbrook-national-park-near-gold-coast"],
    featuredCities: ["brisbane", "cairns", "gold-coast", "sunshine-coast", "toowoomba", "townsville"],
    relatedCollections: ["weekend-escapes-near-brisbane", "australia-national-parks", "australia-weekend-escapes", "australia-islands", "australia-mountains", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
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
    relatedCollections: ["carpathians", "romania-weekend-escapes", "weekend-escapes-near-cluj-napoca", "european-lakes", "australia-mountains", "austria-mountains", "canada-mountains", "croatia-mountains"],
  },
  {
    slug: "romania-weekend-escapes",
    title: "Romania Weekend Escapes",
    description:
      "Romania Weekend Escapes groups 9 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, mountains, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["brasov", "bucharest", "constanta", "iasi", "oradea", "timisoara"],
    nearbyPlaces: ["apuseni-natural-park-near-oradea", "bicaz-gorge-near-iasi", "bucegi-natural-park-near-bucharest", "ceahlau-massif-near-iasi", "cheile-nerei-beusnita-national-park-near-timisoara", "piatra-craiului-national-park-near-brasov", "snagov-near-bucharest", "vama-veche-near-constanta", "vacaresti-nature-park-near-bucharest"],
    featuredPlaces: ["apuseni-natural-park-near-oradea", "bicaz-gorge-near-iasi", "bucegi-natural-park-near-bucharest", "ceahlau-massif-near-iasi", "cheile-nerei-beusnita-national-park-near-timisoara", "piatra-craiului-national-park-near-brasov", "snagov-near-bucharest", "vama-veche-near-constanta"],
    featuredCities: ["bucharest", "iasi", "brasov", "constanta", "oradea", "timisoara"],
    relatedCollections: ["romania-mountains", "carpathians", "european-coast", "european-lakes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
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
    relatedCollections: ["european-coast", "weekend-escapes-near-barcelona", "france-spain-borderlands", "spain-weekend-escapes", "weekend-escapes-near-bilbao", "weekend-escapes-near-malaga", "spain-mountains", "spain-protected-landscapes"],
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
    relatedCollections: ["spain-national-parks", "spain-weekend-escapes", "france-spain-borderlands", "weekend-escapes-near-bilbao", "weekend-escapes-near-malaga", "weekend-escapes-near-madrid", "weekend-escapes-near-barcelona", "weekend-escapes-near-valencia"],
  },
  {
    slug: "spain-national-parks",
    title: "Spain National Parks",
    description:
      "Spain National Parks groups 8 nearby places across 8 cities for local-first day and weekend discovery — mainly mountains, nature areas, islands. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["granada", "jaca", "madrid", "malaga", "santander", "seville", "toledo", "vigo"],
    nearbyPlaces: ["atlantic-islands-of-galicia-national-park-near-vigo", "cabaneros-national-park-near-toledo", "donana-national-park-near-seville", "guadarrama-national-park-near-madrid", "ordesa-y-monte-perdido-national-park-near-jaca", "picos-de-europa-national-park-near-santander", "sierra-nevada-national-park-near-granada", "sierra-de-las-nieves-national-park-near-malaga"],
    featuredPlaces: ["atlantic-islands-of-galicia-national-park-near-vigo", "cabaneros-national-park-near-toledo", "donana-national-park-near-seville", "guadarrama-national-park-near-madrid", "ordesa-y-monte-perdido-national-park-near-jaca", "picos-de-europa-national-park-near-santander", "sierra-nevada-national-park-near-granada", "sierra-de-las-nieves-national-park-near-malaga"],
    featuredCities: ["granada", "jaca", "madrid", "malaga", "santander", "seville"],
    relatedCollections: ["spain-mountains", "weekend-escapes-near-malaga", "portugal-spain-borderlands", "spain-weekend-escapes", "weekend-escapes-near-madrid", "france-spain-borderlands", "weekend-escapes-near-bilbao", "european-coast"],
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
    relatedCollections: ["spain-weekend-escapes", "weekend-escapes-near-bilbao", "france-spain-borderlands", "weekend-escapes-near-valencia", "weekend-escapes-near-malaga", "spain-mountains", "portugal-spain-borderlands", "weekend-escapes-near-barcelona"],
  },
  {
    slug: "spain-weekend-escapes",
    title: "Spain Weekend Escapes",
    description:
      "Spain Weekend Escapes groups 11 nearby places across 8 cities for local-first day and weekend discovery — mainly nature areas, mountains, islands. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["a-coruna", "caceres", "jaca", "murcia", "oviedo", "salamanca", "vigo", "zaragoza"],
    nearbyPlaces: ["arribes-del-duero-natural-park-near-salamanca", "atlantic-islands-of-galicia-national-park-near-vigo", "costa-da-morte-near-a-coruna", "fragas-do-eume-near-a-coruna", "irati-forest-near-jaca", "moncayo-natural-park-near-zaragoza", "ordesa-y-monte-perdido-national-park-near-jaca", "picos-de-europa-near-oviedo", "redes-natural-park-near-oviedo", "sierra-espuna-near-murcia", "sierra-de-san-pedro-near-caceres"],
    featuredPlaces: ["arribes-del-duero-natural-park-near-salamanca", "atlantic-islands-of-galicia-national-park-near-vigo", "costa-da-morte-near-a-coruna", "fragas-do-eume-near-a-coruna", "irati-forest-near-jaca", "moncayo-natural-park-near-zaragoza", "ordesa-y-monte-perdido-national-park-near-jaca", "picos-de-europa-near-oviedo"],
    featuredCities: ["a-coruna", "jaca", "oviedo", "caceres", "murcia", "salamanca"],
    relatedCollections: ["spain-mountains", "portugal-spain-borderlands", "spain-protected-landscapes", "spain-national-parks", "france-spain-borderlands", "european-forests", "spain-coast", "australia-weekend-escapes"],
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
    relatedCollections: ["weekend-escapes-near-gothenburg", "baltic-sea-coast", "sweden-national-parks", "sweden-weekend-escapes", "weekend-escapes-near-stockholm", "european-lakes", "australia-islands", "canada-islands"],
  },
  {
    slug: "sweden-national-parks",
    title: "Sweden National Parks",
    description:
      "Sweden National Parks groups 6 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, islands. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["gothenburg", "helsingborg", "jonkoping", "malmo", "stockholm", "uppsala"],
    nearbyPlaces: ["dalby-soderskog-national-park-near-malmo", "farnebofjarden-national-park-near-uppsala", "sodra-bohuslan-archipelago-near-gothenburg", "store-mosse-national-park-near-jonkoping", "soderasen-national-park-near-helsingborg", "angso-national-park-near-stockholm"],
    featuredPlaces: ["dalby-soderskog-national-park-near-malmo", "farnebofjarden-national-park-near-uppsala", "sodra-bohuslan-archipelago-near-gothenburg", "store-mosse-national-park-near-jonkoping", "soderasen-national-park-near-helsingborg", "angso-national-park-near-stockholm"],
    featuredCities: ["gothenburg", "helsingborg", "jonkoping", "malmo", "stockholm", "uppsala"],
    relatedCollections: ["denmark-sweden-borderlands", "sweden-islands", "weekend-escapes-near-gothenburg", "weekend-escapes-near-malm", "weekend-escapes-near-stockholm", "european-lakes", "european-coast", "australia-national-parks"],
  },
  {
    slug: "sweden-weekend-escapes",
    title: "Sweden Weekend Escapes",
    description:
      "Sweden Weekend Escapes groups 6 nearby places across 4 cities for local-first day and weekend discovery — mainly nature areas, islands, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["karlstad", "lund", "umea", "visby"],
    nearbyPlaces: ["gotska-sandon-national-park-near-visby", "high-coast-near-umea", "holmoarna-near-umea", "hogklint-near-visby", "lake-vanern-near-karlstad", "soderasen-national-park-near-lund"],
    featuredPlaces: ["gotska-sandon-national-park-near-visby", "high-coast-near-umea", "holmoarna-near-umea", "hogklint-near-visby", "lake-vanern-near-karlstad", "soderasen-national-park-near-lund"],
    featuredCities: ["umea", "visby", "karlstad", "lund"],
    relatedCollections: ["baltic-sea-coast", "sweden-islands", "european-lakes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
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
    relatedCollections: ["united-kingdom-weekend-escapes", "weekend-escapes-near-cardiff", "united-kingdom-forests", "weekend-escapes-near-birmingham", "weekend-escapes-near-edinburgh", "weekend-escapes-near-liverpool", "united-kingdom-protected-landscapes", "european-islands"],
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
    relatedCollections: ["weekend-escapes-near-birmingham", "united-kingdom-coast", "united-kingdom-national-parks", "united-kingdom-weekend-escapes", "weekend-escapes-near-cardiff", "weekend-escapes-near-liverpool", "weekend-escapes-near-london", "united-kingdom-protected-landscapes"],
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
    relatedCollections: ["weekend-escapes-near-birmingham", "weekend-escapes-near-edinburgh", "united-kingdom-weekend-escapes", "united-kingdom-national-parks", "united-kingdom-coast", "united-kingdom-forests", "united-kingdom-protected-landscapes", "austria-lakes"],
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
    relatedCollections: ["weekend-escapes-near-belfast", "ireland-united-kingdom-borderlands", "weekend-escapes-near-cardiff", "weekend-escapes-near-birmingham", "united-kingdom-national-parks", "weekend-escapes-near-liverpool", "united-kingdom-protected-landscapes", "united-kingdom-forests"],
  },
  {
    slug: "united-kingdom-national-parks",
    title: "United Kingdom National Parks",
    description:
      "United Kingdom National Parks groups 9 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas, mountains. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["aberdeen", "brighton", "cardiff", "glasgow", "leeds", "manchester", "newcastle-upon-tyne", "sheffield", "southampton", "york"],
    nearbyPlaces: ["brecon-beacons-near-cardiff", "cairngorms-national-park-near-aberdeen", "loch-lomond-and-the-trossachs-near-glasgow", "new-forest-national-park-near-southampton", "north-york-moors-national-park-near-york", "northumberland-national-park-near-newcastle-upon-tyne", "peak-district-near-manchester", "south-downs-national-park-near-brighton", "yorkshire-dales-near-leeds"],
    featuredPlaces: ["brecon-beacons-near-cardiff", "cairngorms-national-park-near-aberdeen", "loch-lomond-and-the-trossachs-near-glasgow", "new-forest-national-park-near-southampton", "north-york-moors-national-park-near-york", "northumberland-national-park-near-newcastle-upon-tyne", "peak-district-near-manchester", "south-downs-national-park-near-brighton"],
    featuredCities: ["aberdeen", "brighton", "cardiff", "glasgow", "leeds", "manchester"],
    relatedCollections: ["weekend-escapes-near-edinburgh", "weekend-escapes-near-liverpool", "weekend-escapes-near-london", "weekend-escapes-near-birmingham", "united-kingdom-forests", "united-kingdom-mountains", "weekend-escapes-near-cardiff", "united-kingdom-lakes"],
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
    relatedCollections: ["weekend-escapes-near-liverpool", "weekend-escapes-near-london", "united-kingdom-weekend-escapes", "weekend-escapes-near-birmingham", "weekend-escapes-near-edinburgh", "united-kingdom-coast", "united-kingdom-forests", "united-kingdom-mountains"],
  },
  {
    slug: "united-kingdom-weekend-escapes",
    title: "United Kingdom Weekend Escapes",
    description:
      "United Kingdom Weekend Escapes groups 12 nearby places across 8 cities for local-first day and weekend discovery — mainly nature areas, beaches, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["durham", "inverness", "kingston-upon-hull", "newcastle-upon-tyne", "norwich", "plymouth", "stoke-on-trent", "truro"],
    nearbyPlaces: ["cannock-chase-near-stoke-on-trent", "carrick-roads-near-truro", "dartmoor-near-plymouth", "durham-coast-near-durham", "glen-affric-near-inverness", "hadrians-wall-near-newcastle-upon-tyne", "loch-ness-near-inverness", "norfolk-coast-near-norwich", "north-pennines-near-durham", "roseland-peninsula-near-truro", "spurn-near-kingston-upon-hull", "thetford-forest-near-norwich"],
    featuredPlaces: ["cannock-chase-near-stoke-on-trent", "carrick-roads-near-truro", "dartmoor-near-plymouth", "durham-coast-near-durham", "glen-affric-near-inverness", "hadrians-wall-near-newcastle-upon-tyne", "loch-ness-near-inverness", "norfolk-coast-near-norwich"],
    featuredCities: ["durham", "inverness", "norwich", "truro", "kingston-upon-hull", "newcastle-upon-tyne"],
    relatedCollections: ["united-kingdom-coast", "united-kingdom-protected-landscapes", "united-kingdom-lakes", "european-islands", "united-kingdom-forests", "weekend-escapes-near-birmingham", "weekend-escapes-near-edinburgh", "united-kingdom-national-parks"],
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
    relatedCollections: ["canada-united-states-borderlands", "weekend-escapes-near-portland", "weekend-escapes-near-seattle", "united-states-weekend-escapes", "united-states-mountains", "united-states-national-parks", "weekend-escapes-near-boston", "weekend-escapes-near-los-angeles"],
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
    relatedCollections: ["united-states-weekend-escapes", "weekend-escapes-near-san-francisco", "united-states-national-parks", "california-weekend-escapes", "weekend-escapes-near-boulder", "weekend-escapes-near-chicago", "united-states-coast", "united-states-mountains"],
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
    relatedCollections: ["united-states-weekend-escapes", "california-weekend-escapes", "canada-united-states-borderlands", "weekend-escapes-near-boston", "weekend-escapes-near-boulder", "weekend-escapes-near-san-francisco", "united-states-mountains", "austria-lakes"],
  },
  {
    slug: "united-states-mountains",
    title: "United States Mountains",
    description:
      "United States Mountains groups 19 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["albuquerque", "anchorage", "bellingham", "boulder", "charlotte", "chattanooga", "denver", "knoxville", "los-angeles", "omaha", "portland", "richmond", "salt-lake-city", "san-diego", "seattle"],
    nearbyPlaces: ["angeles-national-forest-near-los-angeles", "big-cottonwood-canyon-near-salt-lake-city", "chugach-state-park-near-anchorage", "crowders-mountain-state-park-near-charlotte", "cuyamaca-rancho-state-park-near-san-diego", "golden-gate-canyon-state-park-near-denver", "great-smoky-mountains-national-park-near-knoxville", "jemez-mountains-near-albuquerque", "little-cottonwood-canyon-near-salt-lake-city", "loess-hills-near-omaha", "lookout-mountain-near-chattanooga", "mount-hood-national-forest-near-portland", "mount-rainier-near-seattle", "north-cascades-national-park-near-bellingham", "pike-national-forest-near-denver", "rocky-mountain-national-park-near-boulder", "san-gabriel-mountains-national-monument-near-los-angeles", "santa-monica-mountains-recreation-area-near-los-angeles", "shenandoah-national-park-near-richmond"],
    featuredPlaces: ["angeles-national-forest-near-los-angeles", "big-cottonwood-canyon-near-salt-lake-city", "chugach-state-park-near-anchorage", "crowders-mountain-state-park-near-charlotte", "cuyamaca-rancho-state-park-near-san-diego", "golden-gate-canyon-state-park-near-denver", "great-smoky-mountains-national-park-near-knoxville", "jemez-mountains-near-albuquerque"],
    featuredCities: ["los-angeles", "denver", "salt-lake-city", "albuquerque", "anchorage", "bellingham"],
    relatedCollections: ["united-states-weekend-escapes", "united-states-national-parks", "weekend-escapes-near-los-angeles", "weekend-escapes-near-boulder", "weekend-escapes-near-seattle", "california-weekend-escapes", "united-states-coast", "weekend-escapes-near-portland"],
  },
  {
    slug: "united-states-national-parks",
    title: "United States National Parks",
    description:
      "United States National Parks groups 16 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, mountains, waterfronts. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["atlanta", "bellingham", "boulder", "chicago", "cleveland", "durango", "knoxville", "los-angeles", "louisville", "miami", "richmond", "san-diego", "san-francisco", "santa-barbara", "seattle"],
    nearbyPlaces: ["cabrillo-national-monument-near-san-diego", "channel-islands-national-park-near-santa-barbara", "chattahoochee-river-recreation-area-near-atlanta", "cuyahoga-valley-national-park-near-cleveland", "everglades-near-miami", "great-smoky-mountains-national-park-near-knoxville", "indiana-dunes-near-chicago", "mammoth-cave-national-park-near-louisville", "mesa-verde-national-park-near-durango", "mount-rainier-near-seattle", "muir-woods-near-san-francisco", "north-cascades-national-park-near-bellingham", "olympic-near-seattle", "rocky-mountain-national-park-near-boulder", "santa-monica-mountains-recreation-area-near-los-angeles", "shenandoah-national-park-near-richmond"],
    featuredPlaces: ["cabrillo-national-monument-near-san-diego", "channel-islands-national-park-near-santa-barbara", "chattahoochee-river-recreation-area-near-atlanta", "cuyahoga-valley-national-park-near-cleveland", "everglades-near-miami", "great-smoky-mountains-national-park-near-knoxville", "indiana-dunes-near-chicago", "mammoth-cave-national-park-near-louisville"],
    featuredCities: ["seattle", "atlanta", "bellingham", "boulder", "chicago", "cleveland"],
    relatedCollections: ["united-states-mountains", "united-states-weekend-escapes", "weekend-escapes-near-seattle", "california-weekend-escapes", "united-states-river-valleys", "weekend-escapes-near-los-angeles", "canada-united-states-borderlands", "united-states-forests"],
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
    relatedCollections: ["united-states-national-parks", "weekend-escapes-near-chicago", "weekend-escapes-near-portland", "united-states-coast", "united-states-mountains"],
  },
  {
    slug: "united-states-weekend-escapes",
    title: "United States Weekend Escapes",
    description:
      "United States Weekend Escapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, mountains, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["albuquerque", "anchorage", "ann-arbor", "asheville", "austin", "buffalo", "charleston", "duluth", "fort-collins", "knoxville", "richmond", "salt-lake-city", "san-diego", "santa-cruz", "savannah"],
    nearbyPlaces: ["antelope-island-state-park-near-salt-lake-city", "anza-borrego-desert-state-park-near-san-diego", "ano-nuevo-state-park-near-santa-cruz", "big-basin-redwoods-state-park-near-santa-cruz", "big-cottonwood-canyon-near-salt-lake-city", "cabrillo-national-monument-near-san-diego", "chugach-state-park-near-anchorage", "cuyamaca-rancho-state-park-near-san-diego", "dupont-state-recreational-forest-near-asheville", "folly-beach-near-charleston", "francis-marion-national-forest-near-charleston", "frozen-head-state-park-near-knoxville", "great-salt-lake-near-salt-lake-city", "great-smoky-mountains-national-park-near-knoxville", "jay-cooke-state-park-near-duluth", "jemez-mountains-near-albuquerque", "lake-travis-near-austin", "letchworth-state-park-near-buffalo", "little-cottonwood-canyon-near-salt-lake-city", "mckinney-falls-state-park-near-austin", "niagara-falls-state-park-near-buffalo", "pedernales-falls-state-park-near-austin", "pinckney-state-recreation-area-near-ann-arbor", "pocahontas-state-park-near-richmond", "rocky-mountain-national-park-near-fort-collins", "roosevelt-national-forest-near-fort-collins", "shenandoah-national-park-near-richmond", "skidaway-island-state-park-near-savannah", "tettegouche-state-park-near-duluth", "torrey-pines-state-reserve-near-san-diego"],
    featuredPlaces: ["antelope-island-state-park-near-salt-lake-city", "anza-borrego-desert-state-park-near-san-diego", "ano-nuevo-state-park-near-santa-cruz", "big-basin-redwoods-state-park-near-santa-cruz", "big-cottonwood-canyon-near-salt-lake-city", "cabrillo-national-monument-near-san-diego", "chugach-state-park-near-anchorage", "cuyamaca-rancho-state-park-near-san-diego"],
    featuredCities: ["salt-lake-city", "san-diego", "austin", "buffalo", "charleston", "duluth"],
    relatedCollections: ["united-states-mountains", "united-states-national-parks", "united-states-forests", "united-states-lakes", "united-states-coast", "california-weekend-escapes", "canada-united-states-borderlands", "australia-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-aarhus",
    title: "Weekend Escapes near Aarhus",
    description:
      "Weekend Escapes near Aarhus groups 12 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, islands. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["aalborg", "aarhus", "copenhagen", "esbjerg", "odense", "roskilde"],
    nearbyPlaces: ["fano-near-esbjerg", "gribskov-near-copenhagen", "gudena-near-aarhus", "hareskoven-near-copenhagen", "kalo-castle-near-aarhus", "marselisborg-forests-near-aarhus", "mols-bjerge-national-park-near-aarhus", "rebild-bakker-near-aalborg", "roskilde-near-copenhagen", "roskilde-fjord-near-roskilde", "stevns-klint-near-copenhagen", "svanninge-bakker-near-odense"],
    featuredPlaces: ["fano-near-esbjerg", "gribskov-near-copenhagen", "gudena-near-aarhus", "hareskoven-near-copenhagen", "kalo-castle-near-aarhus", "marselisborg-forests-near-aarhus", "mols-bjerge-national-park-near-aarhus", "rebild-bakker-near-aalborg"],
    featuredCities: ["aarhus", "copenhagen", "aalborg", "esbjerg", "odense", "roskilde"],
    relatedCollections: ["denmark-sweden-borderlands", "denmark-germany-borderlands", "european-forests", "european-islands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-amsterdam",
    title: "Weekend Escapes near Amsterdam",
    description:
      "Weekend Escapes near Amsterdam groups 13 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas, historic towns, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["amsterdam", "delft", "leiden", "the-hague", "utrecht"],
    nearbyPlaces: ["berkheide-near-the-hague", "de-biesbosch-national-park-near-delft", "delft-near-rotterdam", "eemmeer-near-utrecht", "groene-hart-near-utrecht", "haarlem-near-amsterdam", "kaag-near-leiden", "kromme-rijn-near-utrecht", "midden-delfland-near-delft", "oostvaardersplassen-near-amsterdam", "utrechtse-heuvelrug-national-park-near-utrecht", "zaanse-schans-near-amsterdam", "zuid-kennemerland-national-park-near-amsterdam"],
    featuredPlaces: ["berkheide-near-the-hague", "de-biesbosch-national-park-near-delft", "delft-near-rotterdam", "eemmeer-near-utrecht", "groene-hart-near-utrecht", "haarlem-near-amsterdam", "kaag-near-leiden", "kromme-rijn-near-utrecht"],
    featuredCities: ["amsterdam", "utrecht", "delft", "the-hague", "leiden"],
    relatedCollections: ["netherlands-national-parks", "belgium-netherlands-borderlands", "european-coast", "european-lakes", "germany-netherlands-borderlands", "weekend-escapes-near-rotterdam", "netherlands-weekend-escapes", "australia-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-antwerp",
    title: "Weekend Escapes near Antwerp",
    description:
      "Weekend Escapes near Antwerp groups 14 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas, regional cities, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["antwerp", "brussels", "ghent", "hasselt", "leuven"],
    nearbyPlaces: ["bokrijk-near-hasselt", "bourgoyen-ossemeersen-near-ghent", "bruges-near-brussels", "dijle-near-leuven", "donkmeer-near-ghent", "flemish-ardennes-near-ghent", "ghent-near-brussels", "hallerbos-near-brussels", "hoge-kempen-national-park-near-antwerp", "kalmthoutse-heide-near-antwerp", "lys-near-ghent", "nete-near-antwerp", "peerdsbos-near-antwerp", "sonian-forest-near-brussels"],
    featuredPlaces: ["bokrijk-near-hasselt", "bourgoyen-ossemeersen-near-ghent", "bruges-near-brussels", "dijle-near-leuven", "donkmeer-near-ghent", "flemish-ardennes-near-ghent", "ghent-near-brussels", "hallerbos-near-brussels"],
    featuredCities: ["antwerp", "brussels", "ghent", "hasselt", "leuven"],
    relatedCollections: ["belgium-netherlands-borderlands", "belgium-germany-borderlands", "european-forests", "european-lakes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-athens",
    title: "Weekend Escapes near Athens",
    description:
      "Weekend Escapes near Athens groups 6 nearby places across 2 cities for local-first day and weekend discovery — mainly mountains, lakes, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["athens", "volos"],
    nearbyPlaces: ["lake-karla-near-volos", "mount-geraneia-near-athens", "mount-hymettus-near-athens", "mount-pelion-near-volos", "mount-parnitha-near-athens", "vravrona-near-athens"],
    featuredPlaces: ["lake-karla-near-volos", "mount-geraneia-near-athens", "mount-hymettus-near-athens", "mount-pelion-near-volos", "mount-parnitha-near-athens", "vravrona-near-athens"],
    featuredCities: ["athens", "volos"],
    relatedCollections: ["greece-mountains", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes", "italy-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-auckland",
    title: "Weekend Escapes near Auckland",
    description:
      "Weekend Escapes near Auckland groups 8 nearby places across 4 cities for local-first day and weekend discovery — mainly nature areas, parks, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["auckland", "hamilton-new-zealand", "tauranga", "whangarei"],
    nearbyPlaces: ["bream-head-near-whangarei", "kaimai-mamaku-forest-park-near-tauranga", "lake-karapiro-near-hamilton-new-zealand", "muriwai-near-auckland", "pirongia-forest-park-near-hamilton-new-zealand", "waiheke-island-near-auckland", "waitakere-ranges-regional-park-near-auckland", "whangarei-falls-near-whangarei"],
    featuredPlaces: ["bream-head-near-whangarei", "kaimai-mamaku-forest-park-near-tauranga", "lake-karapiro-near-hamilton-new-zealand", "muriwai-near-auckland", "pirongia-forest-park-near-hamilton-new-zealand", "waiheke-island-near-auckland", "waitakere-ranges-regional-park-near-auckland", "whangarei-falls-near-whangarei"],
    featuredCities: ["auckland", "hamilton-new-zealand", "whangarei", "tauranga"],
    relatedCollections: ["new-zealand-mountains", "oceania-lakes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-barcelona",
    title: "Weekend Escapes near Barcelona",
    description:
      "Weekend Escapes near Barcelona groups 7 nearby places across 3 cities for local-first day and weekend discovery — mainly waterfronts, mountains, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["barcelona", "girona", "tarragona"],
    nearbyPlaces: ["cap-de-creus-near-girona", "costa-daurada-near-tarragona", "garraf-massif-near-barcelona", "garrotxa-volcanic-zone-natural-park-near-girona", "llobregat-delta-near-barcelona", "montserrat-near-barcelona", "sitges-near-barcelona"],
    featuredPlaces: ["cap-de-creus-near-girona", "costa-daurada-near-tarragona", "garraf-massif-near-barcelona", "garrotxa-volcanic-zone-natural-park-near-girona", "llobregat-delta-near-barcelona", "montserrat-near-barcelona", "sitges-near-barcelona"],
    featuredCities: ["barcelona", "girona", "tarragona"],
    relatedCollections: ["spain-coast", "spain-mountains", "european-coast", "spain-protected-landscapes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-belfast",
    title: "Weekend Escapes near Belfast",
    description:
      "Weekend Escapes near Belfast groups 6 nearby places across 2 cities for local-first day and weekend discovery — mainly mountains, nature areas, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["belfast", "derry"],
    nearbyPlaces: ["cave-hill-near-belfast", "glens-of-antrim-near-belfast", "lough-foyle-near-derry", "mourne-mountains-near-belfast", "slieve-croob-near-belfast", "sperrins-near-derry"],
    featuredPlaces: ["cave-hill-near-belfast", "glens-of-antrim-near-belfast", "lough-foyle-near-derry", "mourne-mountains-near-belfast", "slieve-croob-near-belfast", "sperrins-near-derry"],
    featuredCities: ["belfast", "derry"],
    relatedCollections: ["ireland-united-kingdom-borderlands", "united-kingdom-mountains", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-berlin",
    title: "Weekend Escapes near Berlin",
    description:
      "Weekend Escapes near Berlin groups 11 nearby places across 4 cities for local-first day and weekend discovery — mainly nature areas, mountains, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["berlin", "dresden", "leipzig", "potsdam"],
    nearbyPlaces: ["dresden-heath-near-dresden", "grunewald-near-berlin", "leipzig-riverside-forest-near-leipzig", "lusatian-mountains-near-dresden", "markische-schweiz-nature-park-near-berlin", "ore-mountains-near-dresden", "potsdam-near-berlin", "saxon-switzerland-national-park-near-dresden", "spreewald-near-potsdam", "spreewald-near-berlin", "wannsee-berlin"],
    featuredPlaces: ["dresden-heath-near-dresden", "grunewald-near-berlin", "leipzig-riverside-forest-near-leipzig", "lusatian-mountains-near-dresden", "markische-schweiz-nature-park-near-berlin", "ore-mountains-near-dresden", "potsdam-near-berlin", "saxon-switzerland-national-park-near-dresden"],
    featuredCities: ["berlin", "dresden", "leipzig", "potsdam"],
    relatedCollections: ["czechia-germany-borderlands", "germany-poland-borderlands", "germany-forests", "germany-mountains", "germany-lakes", "germany-weekend-escapes", "australia-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-bilbao",
    title: "Weekend Escapes near Bilbao",
    description:
      "Weekend Escapes near Bilbao groups 12 nearby places across 5 cities for local-first day and weekend discovery — mainly mountains, nature areas, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bilbao", "logrono", "pamplona", "san-sebastian", "santander"],
    nearbyPlaces: ["aiako-harria-near-san-sebastian", "aizkorri-aratz-natural-park-near-san-sebastian", "bardenas-reales-near-pamplona", "flysch-basque-coast-near-bilbao", "gaztelugatxe-near-bilbao", "gorbea-natural-park-near-bilbao", "hendaye-bay-near-san-sebastian", "najerilla-near-logrono", "pagoeta-natural-park-near-san-sebastian", "picos-de-europa-national-park-near-santander", "picos-de-urbion-near-logrono", "urdaibai-biosphere-reserve-near-bilbao"],
    featuredPlaces: ["aiako-harria-near-san-sebastian", "aizkorri-aratz-natural-park-near-san-sebastian", "bardenas-reales-near-pamplona", "flysch-basque-coast-near-bilbao", "gaztelugatxe-near-bilbao", "gorbea-natural-park-near-bilbao", "hendaye-bay-near-san-sebastian", "najerilla-near-logrono"],
    featuredCities: ["bilbao", "san-sebastian", "logrono", "pamplona", "santander"],
    relatedCollections: ["france-spain-borderlands", "spain-mountains", "spain-protected-landscapes", "european-coast", "european-islands", "spain-coast", "spain-national-parks", "australia-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-birmingham",
    title: "Weekend Escapes near Birmingham",
    description:
      "Weekend Escapes near Birmingham groups 15 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, lakes, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["birmingham", "bristol", "manchester", "nottingham", "sheffield", "stoke-on-trent"],
    nearbyPlaces: ["cannock-chase-near-birmingham", "carsington-water-near-nottingham", "chew-valley-lake-near-bristol", "clent-hills-near-birmingham", "dovestone-reservoir-near-manchester", "forest-of-dean-near-bristol", "lyme-park-near-manchester", "malvern-hills-near-birmingham", "mendip-hills-near-bristol", "peak-district-near-nottingham", "peak-district-near-manchester", "rivington-near-manchester", "sand-point-near-bristol", "tittesworth-reservoir-near-stoke-on-trent", "wyre-forest-near-birmingham"],
    featuredPlaces: ["cannock-chase-near-birmingham", "carsington-water-near-nottingham", "chew-valley-lake-near-bristol", "clent-hills-near-birmingham", "dovestone-reservoir-near-manchester", "forest-of-dean-near-bristol", "lyme-park-near-manchester", "malvern-hills-near-birmingham"],
    featuredCities: ["birmingham", "bristol", "manchester", "nottingham", "sheffield", "stoke-on-trent"],
    relatedCollections: ["united-kingdom-lakes", "united-kingdom-forests", "united-kingdom-mountains", "united-kingdom-national-parks", "united-kingdom-coast", "united-kingdom-protected-landscapes", "united-kingdom-weekend-escapes", "australia-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-bordeaux",
    title: "Weekend Escapes near Bordeaux",
    description:
      "Weekend Escapes near Bordeaux groups 10 nearby places across 4 cities for local-first day and weekend discovery — mainly nature areas, mountains, beaches. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bayonne", "bordeaux", "la-rochelle", "pau"],
    nearbyPlaces: ["biarritz-near-bayonne", "dordogne-near-bordeaux", "dune-of-pilat-near-bordeaux", "gave-de-pau-near-pau", "la-rhune-near-bayonne", "landes-de-gascogne-regional-natural-park-near-bordeaux", "marais-poitevin-near-la-rochelle", "medoc-near-bordeaux", "pyrenees-national-park-near-pau", "ile-de-re-near-la-rochelle"],
    featuredPlaces: ["biarritz-near-bayonne", "dordogne-near-bordeaux", "dune-of-pilat-near-bordeaux", "gave-de-pau-near-pau", "la-rhune-near-bayonne", "landes-de-gascogne-regional-natural-park-near-bordeaux", "marais-poitevin-near-la-rochelle", "medoc-near-bordeaux"],
    featuredCities: ["bordeaux", "bayonne", "la-rochelle", "pau"],
    relatedCollections: ["france-spain-borderlands", "france-mountains", "france-protected-landscapes", "european-coast", "european-islands", "france-national-parks", "australia-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-boston",
    title: "Weekend Escapes near Boston",
    description:
      "Weekend Escapes near Boston groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["boston", "providence"],
    nearbyPlaces: ["blue-hills-reservation-near-boston", "cape-cod-near-boston", "colt-state-park-near-providence", "lincoln-woods-state-park-near-providence", "middlesex-fells-reservation-near-boston"],
    featuredPlaces: ["blue-hills-reservation-near-boston", "cape-cod-near-boston", "colt-state-park-near-providence", "lincoln-woods-state-park-near-providence", "middlesex-fells-reservation-near-boston"],
    featuredCities: ["boston", "providence"],
    relatedCollections: ["united-states-coast", "united-states-lakes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-boulder",
    title: "Weekend Escapes near Boulder",
    description:
      "Weekend Escapes near Boulder groups 6 nearby places across 2 cities for local-first day and weekend discovery — mainly parks, mountains, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["boulder", "denver"],
    nearbyPlaces: ["chatfield-state-park-near-denver", "eldorado-canyon-state-park-near-boulder", "golden-gate-canyon-state-park-near-boulder", "pike-national-forest-near-denver", "rocky-mountain-national-park-near-boulder", "roosevelt-national-forest-near-boulder"],
    featuredPlaces: ["chatfield-state-park-near-denver", "eldorado-canyon-state-park-near-boulder", "golden-gate-canyon-state-park-near-boulder", "pike-national-forest-near-denver", "rocky-mountain-national-park-near-boulder", "roosevelt-national-forest-near-boulder"],
    featuredCities: ["boulder", "denver"],
    relatedCollections: ["united-states-mountains", "united-states-forests", "united-states-lakes", "united-states-national-parks", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-bratislava",
    title: "Weekend Escapes near Bratislava",
    description:
      "Weekend Escapes near Bratislava groups 6 nearby places across 3 cities for local-first day and weekend discovery — mainly nature areas, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["banska-bystrica", "bratislava", "zilina"],
    nearbyPlaces: ["devinska-kobyla-near-bratislava", "little-carpathians-near-bratislava", "mala-fatra-national-park-near-zilina", "polana-near-banska-bystrica", "sulov-rocks-near-zilina", "velka-fatra-near-banska-bystrica"],
    featuredPlaces: ["devinska-kobyla-near-bratislava", "little-carpathians-near-bratislava", "mala-fatra-national-park-near-zilina", "polana-near-banska-bystrica", "sulov-rocks-near-zilina", "velka-fatra-near-banska-bystrica"],
    featuredCities: ["banska-bystrica", "bratislava", "zilina"],
    relatedCollections: ["czechia-slovakia-borderlands", "poland-slovakia-borderlands", "european-mountains", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-brisbane",
    title: "Weekend Escapes near Brisbane",
    description:
      "Weekend Escapes near Brisbane groups 9 nearby places across 4 cities for local-first day and weekend discovery — mainly nature areas, mountains, islands. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["brisbane", "gold-coast", "sunshine-coast", "toowoomba"],
    nearbyPlaces: ["bunya-mountains-national-park-near-toowoomba", "daguilar-national-park-near-brisbane", "lamington-national-park-near-gold-coast", "nerang-national-park-near-gold-coast", "noosa-national-park-near-sunshine-coast", "north-stradbroke-island-near-brisbane", "springbrook-national-park-near-gold-coast", "tamborine-national-park-near-brisbane", "venman-bushland-national-park-near-brisbane"],
    featuredPlaces: ["bunya-mountains-national-park-near-toowoomba", "daguilar-national-park-near-brisbane", "lamington-national-park-near-gold-coast", "nerang-national-park-near-gold-coast", "noosa-national-park-near-sunshine-coast", "north-stradbroke-island-near-brisbane", "springbrook-national-park-near-gold-coast", "tamborine-national-park-near-brisbane"],
    featuredCities: ["brisbane", "gold-coast", "sunshine-coast", "toowoomba"],
    relatedCollections: ["australia-national-parks", "queensland-weekend-escapes", "australia-islands", "australia-mountains", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-brno",
    title: "Weekend Escapes near Brno",
    description:
      "Weekend Escapes near Brno groups 7 nearby places across 4 cities for local-first day and weekend discovery — mainly nature areas, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["brno", "ceske-budejovice", "olomouc", "ostrava"],
    nearbyPlaces: ["beskydy-protected-area-near-ostrava", "litovelske-pomoravi-near-olomouc", "macocha-gorge-near-brno", "moravian-karst-near-brno", "podyji-national-park-near-brno", "trebon-basin-near-ceske-budejovice", "white-carpathians-near-brno"],
    featuredPlaces: ["beskydy-protected-area-near-ostrava", "litovelske-pomoravi-near-olomouc", "macocha-gorge-near-brno", "moravian-karst-near-brno", "podyji-national-park-near-brno", "trebon-basin-near-ceske-budejovice", "white-carpathians-near-brno"],
    featuredCities: ["brno", "ceske-budejovice", "olomouc", "ostrava"],
    relatedCollections: ["czechia-slovakia-borderlands", "czechia-poland-borderlands", "european-mountains", "carpathians", "czechia-germany-borderlands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-bruges",
    title: "Weekend Escapes near Bruges",
    description:
      "Weekend Escapes near Bruges groups 6 nearby places across 3 cities for local-first day and weekend discovery — mainly beaches, cultural sites, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bruges", "namur", "ostend"],
    nearbyPlaces: ["blankenberge-near-bruges", "citadel-of-namur-near-namur", "knokke-heist-near-bruges", "nieuwpoort-near-bruges", "yser-near-ostend", "zwin-near-bruges"],
    featuredPlaces: ["blankenberge-near-bruges", "citadel-of-namur-near-namur", "knokke-heist-near-bruges", "nieuwpoort-near-bruges", "yser-near-ostend", "zwin-near-bruges"],
    featuredCities: ["bruges", "namur", "ostend"],
    relatedCollections: ["european-coast", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes", "italy-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-budapest",
    title: "Weekend Escapes near Budapest",
    description:
      "Weekend Escapes near Budapest groups 6 nearby places across 2 cities for local-first day and weekend discovery — mainly nature areas, lakes, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["budapest", "pecs"],
    nearbyPlaces: ["bukk-national-park-near-budapest", "danube-ipoly-national-park-near-budapest", "lake-balaton-near-budapest", "mecsek-near-pecs", "orfu-near-pecs", "tihany-near-budapest"],
    featuredPlaces: ["bukk-national-park-near-budapest", "danube-ipoly-national-park-near-budapest", "lake-balaton-near-budapest", "mecsek-near-pecs", "orfu-near-pecs", "tihany-near-budapest"],
    featuredCities: ["budapest", "pecs"],
    relatedCollections: ["european-lakes", "european-mountains", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-cardiff",
    title: "Weekend Escapes near Cardiff",
    description:
      "Weekend Escapes near Cardiff groups 8 nearby places across 3 cities for local-first day and weekend discovery — mainly nature areas, mountains, beaches. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["cardiff", "exeter", "swansea"],
    nearbyPlaces: ["afan-forest-park-near-swansea", "brecon-beacons-near-cardiff", "caerphilly-mountain-near-cardiff", "dartmoor-near-exeter", "garth-mountain-near-cardiff", "gower-peninsula-near-swansea", "jurassic-coast-near-exeter", "wye-valley-near-cardiff"],
    featuredPlaces: ["afan-forest-park-near-swansea", "brecon-beacons-near-cardiff", "caerphilly-mountain-near-cardiff", "dartmoor-near-exeter", "garth-mountain-near-cardiff", "gower-peninsula-near-swansea", "jurassic-coast-near-exeter", "wye-valley-near-cardiff"],
    featuredCities: ["cardiff", "exeter", "swansea"],
    relatedCollections: ["united-kingdom-mountains", "united-kingdom-coast", "united-kingdom-forests", "united-kingdom-national-parks", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-chicago",
    title: "Weekend Escapes near Chicago",
    description:
      "Weekend Escapes near Chicago groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["chicago", "milwaukee"],
    nearbyPlaces: ["indiana-dunes-near-chicago", "kankakee-river-state-park-near-chicago", "kettle-moraine-state-forest-near-milwaukee", "morton-arboretum-near-chicago", "starved-rock-state-park-near-chicago"],
    featuredPlaces: ["indiana-dunes-near-chicago", "kankakee-river-state-park-near-chicago", "kettle-moraine-state-forest-near-milwaukee", "morton-arboretum-near-chicago", "starved-rock-state-park-near-chicago"],
    featuredCities: ["chicago", "milwaukee"],
    relatedCollections: ["united-states-forests", "united-states-national-parks", "united-states-river-valleys", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-cluj-napoca",
    title: "Weekend Escapes near Cluj-Napoca",
    description:
      "Weekend Escapes near Cluj-Napoca groups 7 nearby places across 3 cities for local-first day and weekend discovery — mainly nature areas, mountains, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["baia-mare", "cluj-napoca", "sibiu"],
    nearbyPlaces: ["apuseni-natural-park-near-cluj-napoca", "cibin-river-near-sibiu", "cindrel-mountains-near-sibiu", "fagaras-mountains-near-cluj-napoca", "rodna-mountains-near-baia-mare", "scarisoara-cave-near-cluj-napoca", "turda-gorge-near-cluj-napoca"],
    featuredPlaces: ["apuseni-natural-park-near-cluj-napoca", "cibin-river-near-sibiu", "cindrel-mountains-near-sibiu", "fagaras-mountains-near-cluj-napoca", "rodna-mountains-near-baia-mare", "scarisoara-cave-near-cluj-napoca", "turda-gorge-near-cluj-napoca"],
    featuredCities: ["cluj-napoca", "sibiu", "baia-mare"],
    relatedCollections: ["romania-mountains", "carpathians", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-cologne",
    title: "Weekend Escapes near Cologne",
    description:
      "Weekend Escapes near Cologne groups 8 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, parks, cultural sites. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bonn", "cologne", "dortmund", "dusseldorf", "essen", "trier"],
    nearbyPlaces: ["eifel-national-park-near-cologne", "hambach-forest-near-cologne", "hohe-mark-nature-park-near-dortmund", "hunsruck-hochwald-national-park-near-trier", "neandertal-near-dusseldorf", "rhineland-nature-park-near-cologne", "siebengebirge-near-bonn", "zollverein-coal-mine-industrial-complex-near-essen"],
    featuredPlaces: ["eifel-national-park-near-cologne", "hambach-forest-near-cologne", "hohe-mark-nature-park-near-dortmund", "hunsruck-hochwald-national-park-near-trier", "neandertal-near-dusseldorf", "rhineland-nature-park-near-cologne", "siebengebirge-near-bonn", "zollverein-coal-mine-industrial-complex-near-essen"],
    featuredCities: ["cologne", "bonn", "dortmund", "dusseldorf", "essen", "trier"],
    relatedCollections: ["belgium-germany-borderlands", "germany-netherlands-borderlands", "germany-luxembourg-borderlands", "germany-forests", "france-germany-borderlands", "germany-weekend-escapes", "germany-mountains", "australia-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-cork",
    title: "Weekend Escapes near Cork",
    description:
      "Weekend Escapes near Cork groups 13 nearby places across 6 cities for local-first day and weekend discovery — mainly mountains, nature areas, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["cork", "kilkenny", "killarney", "limerick", "tralee", "waterford"],
    nearbyPlaces: ["ballyhoura-mountains-near-limerick", "beara-peninsula-near-cork", "blackstairs-mountains-near-kilkenny", "cliffs-of-moher-near-limerick", "comeragh-mountains-near-waterford", "curragh-chase-forest-park-near-limerick", "fota-island-near-cork", "galtee-mountains-near-cork", "gougane-barra-near-cork", "jenkinstown-park-near-kilkenny", "lough-derg-near-limerick", "macgillycuddys-reeks-near-killarney", "slieve-mish-mountains-near-tralee"],
    featuredPlaces: ["ballyhoura-mountains-near-limerick", "beara-peninsula-near-cork", "blackstairs-mountains-near-kilkenny", "cliffs-of-moher-near-limerick", "comeragh-mountains-near-waterford", "curragh-chase-forest-park-near-limerick", "fota-island-near-cork", "galtee-mountains-near-cork"],
    featuredCities: ["cork", "limerick", "kilkenny", "killarney", "tralee", "waterford"],
    relatedCollections: ["ireland-mountains", "european-forests", "european-islands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-dublin",
    title: "Weekend Escapes near Dublin",
    description:
      "Weekend Escapes near Dublin groups 6 nearby places across 2 cities for local-first day and weekend discovery — mainly nature areas, islands, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["athlone", "dublin"],
    nearbyPlaces: ["bull-island-near-dublin", "clara-bog-near-athlone", "glendalough-near-dublin", "phoenix-park-dublin", "slieve-bloom-mountains-near-athlone", "wicklow-mountains-near-dublin"],
    featuredPlaces: ["bull-island-near-dublin", "clara-bog-near-athlone", "glendalough-near-dublin", "phoenix-park-dublin", "slieve-bloom-mountains-near-athlone", "wicklow-mountains-near-dublin"],
    featuredCities: ["dublin", "athlone"],
    relatedCollections: ["european-islands", "european-lakes", "ireland-mountains", "ireland-united-kingdom-borderlands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-dubrovnik",
    title: "Weekend Escapes near Dubrovnik",
    description:
      "Weekend Escapes near Dubrovnik groups 7 nearby places across 2 cities for local-first day and weekend discovery — mainly islands, mountains, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["dubrovnik", "split"],
    nearbyPlaces: ["biokovo-nature-park-near-split", "elaphiti-islands-near-dubrovnik", "hvar-near-split", "krka-national-park-near-split", "mljet-national-park-near-dubrovnik", "mosor-near-split", "peljesac-near-dubrovnik"],
    featuredPlaces: ["biokovo-nature-park-near-split", "elaphiti-islands-near-dubrovnik", "hvar-near-split", "krka-national-park-near-split", "mljet-national-park-near-dubrovnik", "mosor-near-split", "peljesac-near-dubrovnik"],
    featuredCities: ["split", "dubrovnik"],
    relatedCollections: ["croatia-mountains", "european-islands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-edinburgh",
    title: "Weekend Escapes near Edinburgh",
    description:
      "Weekend Escapes near Edinburgh groups 13 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, parks, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["aberdeen", "carlisle", "dundee", "edinburgh", "glasgow", "newcastle-upon-tyne"],
    nearbyPlaces: ["aberlady-bay-near-edinburgh", "cairngorms-national-park-near-aberdeen", "glamis-castle-near-dundee", "hadrians-wall-near-carlisle", "holyrood-park-edinburgh", "kielder-water-near-newcastle-upon-tyne", "lake-district-near-carlisle", "loch-lomond-and-the-trossachs-near-glasgow", "mugdock-country-park-near-glasgow", "north-pennines-near-newcastle-upon-tyne", "northumberland-national-park-near-newcastle-upon-tyne", "pentland-hills-edinburgh", "yellowcraig-near-edinburgh"],
    featuredPlaces: ["aberlady-bay-near-edinburgh", "cairngorms-national-park-near-aberdeen", "glamis-castle-near-dundee", "hadrians-wall-near-carlisle", "holyrood-park-edinburgh", "kielder-water-near-newcastle-upon-tyne", "lake-district-near-carlisle", "loch-lomond-and-the-trossachs-near-glasgow"],
    featuredCities: ["edinburgh", "newcastle-upon-tyne", "carlisle", "glasgow", "aberdeen", "dundee"],
    relatedCollections: ["united-kingdom-national-parks", "united-kingdom-lakes", "united-kingdom-coast", "united-kingdom-protected-landscapes", "united-kingdom-weekend-escapes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-florence",
    title: "Weekend Escapes near Florence",
    description:
      "Weekend Escapes near Florence groups 10 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, lakes, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bologna", "florence", "lucca", "perugia", "pisa", "siena"],
    nearbyPlaces: ["alpi-apuane-near-lucca", "comacchio-valleys-near-bologna", "garfagnana-near-lucca", "gessi-bolognesi-park-near-bologna", "lake-bilancino-near-florence", "lake-massaciuccoli-near-pisa", "lake-trasimeno-near-perugia", "monti-del-chianti-near-florence", "val-d-orcia-near-siena", "vallombrosa-near-florence"],
    featuredPlaces: ["alpi-apuane-near-lucca", "comacchio-valleys-near-bologna", "garfagnana-near-lucca", "gessi-bolognesi-park-near-bologna", "lake-bilancino-near-florence", "lake-massaciuccoli-near-pisa", "lake-trasimeno-near-perugia", "monti-del-chianti-near-florence"],
    featuredCities: ["florence", "bologna", "lucca", "perugia", "pisa", "siena"],
    relatedCollections: ["italy-lakes", "italy-mountains", "italy-protected-landscapes", "italy-weekend-escapes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-frankfurt",
    title: "Weekend Escapes near Frankfurt",
    description:
      "Weekend Escapes near Frankfurt groups 13 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, mountains, regional cities. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["frankfurt", "heidelberg", "karlsruhe", "mainz", "stuttgart", "wurzburg"],
    nearbyPlaces: ["black-forest-national-park-near-karlsruhe", "heidelberg-near-frankfurt", "odenwald-near-heidelberg", "rheingau-near-frankfurt", "rhon-mountains-near-frankfurt", "schurwald-near-stuttgart", "schonbuch-nature-park-near-stuttgart", "spessart-near-wurzburg", "steigerwald-near-wurzburg", "swabian-jura-near-stuttgart", "taunus-near-frankfurt", "upper-middle-rhine-valley-near-mainz", "welzheim-forest-near-stuttgart"],
    featuredPlaces: ["black-forest-national-park-near-karlsruhe", "heidelberg-near-frankfurt", "odenwald-near-heidelberg", "rheingau-near-frankfurt", "rhon-mountains-near-frankfurt", "schurwald-near-stuttgart", "schonbuch-nature-park-near-stuttgart", "spessart-near-wurzburg"],
    featuredCities: ["frankfurt", "stuttgart", "wurzburg", "heidelberg", "karlsruhe", "mainz"],
    relatedCollections: ["germany-forests", "germany-mountains", "france-germany-borderlands", "germany-weekend-escapes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-freiburg",
    title: "Weekend Escapes near Freiburg",
    description:
      "Weekend Escapes near Freiburg groups 6 nearby places across 2 cities for local-first day and weekend discovery — mainly mountains, lakes, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["freiburg", "konstanz"],
    nearbyPlaces: ["feldberg-near-freiburg", "hegau-near-konstanz", "reichenau-island-near-konstanz", "schauinsland-near-freiburg", "schluchsee-near-freiburg", "titisee-near-freiburg"],
    featuredPlaces: ["feldberg-near-freiburg", "hegau-near-konstanz", "reichenau-island-near-konstanz", "schauinsland-near-freiburg", "schluchsee-near-freiburg", "titisee-near-freiburg"],
    featuredCities: ["freiburg", "konstanz"],
    relatedCollections: ["france-germany-borderlands", "germany-lakes", "germany-mountains", "european-islands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-galway",
    title: "Weekend Escapes near Galway",
    description:
      "Weekend Escapes near Galway groups 7 nearby places across 3 cities for local-first day and weekend discovery — mainly nature areas, mountains, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["galway", "sligo", "westport"],
    nearbyPlaces: ["benbulbin-near-sligo", "clew-bay-near-westport", "connemara-national-park-near-galway", "coole-park-near-galway", "lough-gill-near-sligo", "maumturks-near-galway", "the-burren-near-galway"],
    featuredPlaces: ["benbulbin-near-sligo", "clew-bay-near-westport", "connemara-national-park-near-galway", "coole-park-near-galway", "lough-gill-near-sligo", "maumturks-near-galway", "the-burren-near-galway"],
    featuredCities: ["galway", "sligo", "westport"],
    relatedCollections: ["ireland-mountains", "ireland-united-kingdom-borderlands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-gdansk",
    title: "Weekend Escapes near Gdansk",
    description:
      "Weekend Escapes near Gdansk groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly nature areas, lakes, beaches. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["gdansk", "olsztyn"],
    nearbyPlaces: ["lake-ukiel-near-olsztyn", "slowinski-national-park-near-gdansk", "tricity-landscape-park-near-gdansk", "tuchola-forest-national-park-near-gdansk", "lyna-near-olsztyn"],
    featuredPlaces: ["lake-ukiel-near-olsztyn", "slowinski-national-park-near-gdansk", "tricity-landscape-park-near-gdansk", "tuchola-forest-national-park-near-gdansk", "lyna-near-olsztyn"],
    featuredCities: ["gdansk", "olsztyn"],
    relatedCollections: ["european-coast", "poland-national-parks", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-gothenburg",
    title: "Weekend Escapes near Gothenburg",
    description:
      "Weekend Escapes near Gothenburg groups 6 nearby places across 2 cities for local-first day and weekend discovery — mainly islands, lakes, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["gothenburg", "jonkoping"],
    nearbyPlaces: ["delsjon-near-gothenburg", "gothenburg-archipelago-near-gothenburg", "sodra-bohuslan-archipelago-near-gothenburg", "marstrand-near-gothenburg", "store-mosse-national-park-near-jonkoping", "vattern-near-jonkoping"],
    featuredPlaces: ["delsjon-near-gothenburg", "gothenburg-archipelago-near-gothenburg", "sodra-bohuslan-archipelago-near-gothenburg", "marstrand-near-gothenburg", "store-mosse-national-park-near-jonkoping", "vattern-near-jonkoping"],
    featuredCities: ["gothenburg", "jonkoping"],
    relatedCollections: ["sweden-islands", "european-lakes", "sweden-national-parks", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-graz",
    title: "Weekend Escapes near Graz",
    description:
      "Weekend Escapes near Graz groups 10 nearby places across 3 cities for local-first day and weekend discovery — mainly mountains, lakes, cultural sites. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["graz", "klagenfurt", "vienna"],
    nearbyPlaces: ["barenschutzklamm-near-graz", "gesause-national-park-near-graz", "hohe-wand-near-vienna", "karawanks-near-klagenfurt", "lake-neusiedl-near-vienna", "schockl-near-graz", "schonbrunn-vienna", "stubenberg-am-see-near-graz", "wachau-valley-near-vienna", "worthersee-near-klagenfurt"],
    featuredPlaces: ["barenschutzklamm-near-graz", "gesause-national-park-near-graz", "hohe-wand-near-vienna", "karawanks-near-klagenfurt", "lake-neusiedl-near-vienna", "schockl-near-graz", "schonbrunn-vienna", "stubenberg-am-see-near-graz"],
    featuredCities: ["graz", "vienna", "klagenfurt"],
    relatedCollections: ["austria-mountains", "austria-slovenia-borderlands", "austria-lakes", "austria-italy-borderlands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-grenoble",
    title: "Weekend Escapes near Grenoble",
    description:
      "Weekend Escapes near Grenoble groups 12 nearby places across 5 cities for local-first day and weekend discovery — mainly mountains, lakes, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["annecy", "avignon", "chambery", "grenoble", "lyon"],
    nearbyPlaces: ["alpilles-near-avignon", "bauges-near-chambery", "beaujolais-near-lyon", "grand-parc-de-miribel-jonage-near-lyon", "lac-de-monteynard-avignonet-near-grenoble", "lac-du-bourget-near-chambery", "lake-annecy-near-annecy", "mont-ventoux-near-avignon", "monts-du-lyonnais-near-lyon", "pilat-regional-natural-park-near-lyon", "vercors-regional-park-near-grenoble", "ecrins-national-park-near-grenoble"],
    featuredPlaces: ["alpilles-near-avignon", "bauges-near-chambery", "beaujolais-near-lyon", "grand-parc-de-miribel-jonage-near-lyon", "lac-de-monteynard-avignonet-near-grenoble", "lac-du-bourget-near-chambery", "lake-annecy-near-annecy", "mont-ventoux-near-avignon"],
    featuredCities: ["lyon", "grenoble", "avignon", "chambery", "annecy"],
    relatedCollections: ["france-mountains", "france-lakes", "france-italy-borderlands", "france-national-parks", "france-protected-landscapes", "france-weekend-escapes", "australia-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-hamburg",
    title: "Weekend Escapes near Hamburg",
    description:
      "Weekend Escapes near Hamburg groups 9 nearby places across 6 cities for local-first day and weekend discovery — mainly lakes, waterfronts, historic towns. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bremen", "flensburg", "hamburg", "hanover", "kiel", "lubeck"],
    nearbyPlaces: ["flensburg-fjord-near-flensburg", "holstein-switzerland-near-hamburg", "kiel-fjord-near-kiel", "lubeck-near-hamburg", "neuwerk-near-hamburg", "schaalsee-near-hamburg", "steinhuder-meer-near-hanover", "teufelsmoor-near-bremen", "travemunde-near-lubeck"],
    featuredPlaces: ["flensburg-fjord-near-flensburg", "holstein-switzerland-near-hamburg", "kiel-fjord-near-kiel", "lubeck-near-hamburg", "neuwerk-near-hamburg", "schaalsee-near-hamburg", "steinhuder-meer-near-hanover", "teufelsmoor-near-bremen"],
    featuredCities: ["hamburg", "bremen", "flensburg", "hanover", "kiel", "lubeck"],
    relatedCollections: ["germany-lakes", "denmark-germany-borderlands", "baltic-sea-coast", "european-coast", "european-islands", "germany-weekend-escapes", "australia-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-helsinki",
    title: "Weekend Escapes near Helsinki",
    description:
      "Weekend Escapes near Helsinki groups 8 nearby places across 3 cities for local-first day and weekend discovery — mainly islands, nature areas, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["helsinki", "tampere", "turku"],
    nearbyPlaces: ["archipelago-national-park-near-turku", "helvetinjarvi-national-park-near-tampere", "isojarvi-national-park-near-tampere", "liesjarvi-national-park-near-helsinki", "nuuksio-national-park-near-helsinki", "seitseminen-national-park-near-tampere", "suomenlinna-helsinki", "tammisaari-archipelago-national-park-near-helsinki"],
    featuredPlaces: ["archipelago-national-park-near-turku", "helvetinjarvi-national-park-near-tampere", "isojarvi-national-park-near-tampere", "liesjarvi-national-park-near-helsinki", "nuuksio-national-park-near-helsinki", "seitseminen-national-park-near-tampere", "suomenlinna-helsinki", "tammisaari-archipelago-national-park-near-helsinki"],
    featuredCities: ["helsinki", "tampere", "turku"],
    relatedCollections: ["finland-national-parks", "finland-islands", "estonia-finland-borderlands", "baltic-sea-coast", "finland-weekend-escapes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-hobart",
    title: "Weekend Escapes near Hobart",
    description:
      "Weekend Escapes near Hobart groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly nature areas, beaches, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["hobart", "launceston"],
    nearbyPlaces: ["cataract-gorge-near-launceston", "mount-field-national-park-near-hobart", "south-bruny-national-park-near-hobart", "tasman-national-park-near-hobart", "kunanyi-mount-wellington-near-hobart"],
    featuredPlaces: ["cataract-gorge-near-launceston", "mount-field-national-park-near-hobart", "south-bruny-national-park-near-hobart", "tasman-national-park-near-hobart", "kunanyi-mount-wellington-near-hobart"],
    featuredCities: ["hobart", "launceston"],
    relatedCollections: ["australia-national-parks", "australia-coast", "australia-mountains", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-innsbruck",
    title: "Weekend Escapes near Innsbruck",
    description:
      "Weekend Escapes near Innsbruck groups 8 nearby places across 2 cities for local-first day and weekend discovery — mainly lakes, mountains, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["innsbruck", "salzburg"],
    nearbyPlaces: ["achen-lake-near-innsbruck", "karwendel-near-innsbruck", "krimml-waterfalls-near-salzburg", "lake-fuschl-near-salzburg", "lake-wolfgang-near-salzburg", "natterer-see-near-innsbruck", "patscherkofel-near-innsbruck", "untersberg-near-salzburg"],
    featuredPlaces: ["achen-lake-near-innsbruck", "karwendel-near-innsbruck", "krimml-waterfalls-near-salzburg", "lake-fuschl-near-salzburg", "lake-wolfgang-near-salzburg", "natterer-see-near-innsbruck", "patscherkofel-near-innsbruck", "untersberg-near-salzburg"],
    featuredCities: ["innsbruck", "salzburg"],
    relatedCollections: ["austria-germany-borderlands", "austria-lakes", "austria-italy-borderlands", "austria-mountains", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-krakow",
    title: "Weekend Escapes near Krakow",
    description:
      "Weekend Escapes near Krakow groups 9 nearby places across 4 cities for local-first day and weekend discovery — mainly mountains, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["katowice", "krakow", "rzeszow", "zakopane"],
    nearbyPlaces: ["beskids-near-krakow", "czarnorzeki-strzyzow-landscape-park-near-rzeszow", "eagle-nests-landscape-park-near-katowice", "gorce-national-park-near-zakopane", "magura-national-park-near-rzeszow", "ojcow-national-park-near-krakow", "pieniny-near-krakow", "tatra-mountains-near-krakow", "tatra-national-park-near-zakopane"],
    featuredPlaces: ["beskids-near-krakow", "czarnorzeki-strzyzow-landscape-park-near-rzeszow", "eagle-nests-landscape-park-near-katowice", "gorce-national-park-near-zakopane", "magura-national-park-near-rzeszow", "ojcow-national-park-near-krakow", "pieniny-near-krakow", "tatra-mountains-near-krakow"],
    featuredCities: ["krakow", "rzeszow", "zakopane", "katowice"],
    relatedCollections: ["poland-slovakia-borderlands", "poland-mountains", "poland-national-parks", "carpathians", "czechia-poland-borderlands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-lisbon",
    title: "Weekend Escapes near Lisbon",
    description:
      "Weekend Escapes near Lisbon groups 6 nearby places across 2 cities for local-first day and weekend discovery — mainly lakes, waterfronts, beaches. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["evora", "lisbon"],
    nearbyPlaces: ["alqueva-dam-near-evora", "cascais-near-lisbon", "costa-da-caparica-near-lisbon", "serra-de-sao-mamede-near-evora", "sintra-near-lisbon", "tagus-estuary-natural-reserve-near-lisbon"],
    featuredPlaces: ["alqueva-dam-near-evora", "cascais-near-lisbon", "costa-da-caparica-near-lisbon", "serra-de-sao-mamede-near-evora", "sintra-near-lisbon", "tagus-estuary-natural-reserve-near-lisbon"],
    featuredCities: ["lisbon", "evora"],
    relatedCollections: ["european-coast", "european-lakes", "european-mountains", "portugal-protected-landscapes", "portugal-spain-borderlands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-liverpool",
    title: "Weekend Escapes near Liverpool",
    description:
      "Weekend Escapes near Liverpool groups 9 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas, beaches, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["lancaster", "leeds", "lincoln", "liverpool", "york"],
    nearbyPlaces: ["arnside-and-silverdale-national-landscape-near-lancaster", "delamere-forest-near-liverpool", "formby-near-liverpool", "hartsholme-country-park-near-lincoln", "hilbre-island-near-liverpool", "north-york-moors-national-park-near-york", "thurstaston-common-near-liverpool", "yorkshire-dales-near-lancaster", "yorkshire-dales-near-leeds"],
    featuredPlaces: ["arnside-and-silverdale-national-landscape-near-lancaster", "delamere-forest-near-liverpool", "formby-near-liverpool", "hartsholme-country-park-near-lincoln", "hilbre-island-near-liverpool", "north-york-moors-national-park-near-york", "thurstaston-common-near-liverpool", "yorkshire-dales-near-lancaster"],
    featuredCities: ["liverpool", "lancaster", "leeds", "lincoln", "york"],
    relatedCollections: ["united-kingdom-protected-landscapes", "united-kingdom-national-parks", "european-islands", "united-kingdom-coast", "united-kingdom-forests", "united-kingdom-mountains", "australia-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-ljubljana",
    title: "Weekend Escapes near Ljubljana",
    description:
      "Weekend Escapes near Ljubljana groups 5 nearby places across 3 cities for local-first day and weekend discovery — mainly lakes, nature areas, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["kranj", "ljubljana", "maribor"],
    nearbyPlaces: ["lake-bled-near-kranj", "lake-bohinj-near-ljubljana", "pohorje-near-maribor", "triglav-national-park-near-kranj", "vipava-valley-near-ljubljana"],
    featuredPlaces: ["lake-bled-near-kranj", "lake-bohinj-near-ljubljana", "pohorje-near-maribor", "triglav-national-park-near-kranj", "vipava-valley-near-ljubljana"],
    featuredCities: ["kranj", "ljubljana", "maribor"],
    relatedCollections: ["austria-slovenia-borderlands", "italy-slovenia-borderlands", "european-mountains", "european-lakes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-london",
    title: "Weekend Escapes near London",
    description:
      "Weekend Escapes near London groups 11 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, parks, cultural sites. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bath", "brighton", "cambridge", "london", "oxford", "southampton"],
    nearbyPlaces: ["brighton-near-london", "cotswolds-near-oxford", "hyde-park-london", "greenwich-london", "mendip-hills-near-bath", "new-forest-national-park-near-southampton", "richmond-park-london", "kew-gardens-london", "south-downs-national-park-near-brighton", "wicken-fen-near-cambridge", "windsor-near-london"],
    featuredPlaces: ["brighton-near-london", "cotswolds-near-oxford", "hyde-park-london", "greenwich-london", "mendip-hills-near-bath", "new-forest-national-park-near-southampton", "richmond-park-london", "kew-gardens-london"],
    featuredCities: ["london", "bath", "brighton", "cambridge", "oxford", "southampton"],
    relatedCollections: ["united-kingdom-protected-landscapes", "united-kingdom-national-parks", "united-kingdom-forests", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-los-angeles",
    title: "Weekend Escapes near Los Angeles",
    description:
      "Weekend Escapes near Los Angeles groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly mountains, islands, beaches. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["los-angeles", "santa-barbara"],
    nearbyPlaces: ["angeles-national-forest-near-los-angeles", "channel-islands-national-park-near-santa-barbara", "crystal-cove-state-park-near-los-angeles", "san-gabriel-mountains-national-monument-near-los-angeles", "santa-monica-mountains-recreation-area-near-los-angeles"],
    featuredPlaces: ["angeles-national-forest-near-los-angeles", "channel-islands-national-park-near-santa-barbara", "crystal-cove-state-park-near-los-angeles", "san-gabriel-mountains-national-monument-near-los-angeles", "santa-monica-mountains-recreation-area-near-los-angeles"],
    featuredCities: ["los-angeles", "santa-barbara"],
    relatedCollections: ["united-states-mountains", "united-states-national-parks", "california-weekend-escapes", "united-states-coast", "australia-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-madrid",
    title: "Weekend Escapes near Madrid",
    description:
      "Weekend Escapes near Madrid groups 8 nearby places across 3 cities for local-first day and weekend discovery — mainly mountains, historic towns, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["madrid", "toledo", "valladolid"],
    nearbyPlaces: ["cabaneros-national-park-near-toledo", "canal-de-castilla-near-valladolid", "guadarrama-national-park-near-madrid", "manzanares-el-real-near-madrid", "el-escorial-near-madrid", "montes-de-toledo-near-toledo", "segovia-near-madrid", "toledo-near-madrid"],
    featuredPlaces: ["cabaneros-national-park-near-toledo", "canal-de-castilla-near-valladolid", "guadarrama-national-park-near-madrid", "manzanares-el-real-near-madrid", "el-escorial-near-madrid", "montes-de-toledo-near-toledo", "segovia-near-madrid", "toledo-near-madrid"],
    featuredCities: ["madrid", "toledo", "valladolid"],
    relatedCollections: ["spain-mountains", "spain-national-parks", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-malaga",
    title: "Weekend Escapes near Malaga",
    description:
      "Weekend Escapes near Malaga groups 8 nearby places across 3 cities for local-first day and weekend discovery — mainly nature areas, mountains, beaches. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["granada", "malaga", "seville"],
    nearbyPlaces: ["cabo-de-gata-nijar-natural-park-near-granada", "donana-national-park-near-seville", "torcal-de-antequera-near-malaga", "fuente-de-piedra-lagoon-near-malaga", "montes-de-malaga-natural-park-near-malaga", "sierra-nevada-national-park-near-granada", "sierra-de-baza-natural-park-near-granada", "sierra-de-las-nieves-national-park-near-malaga"],
    featuredPlaces: ["cabo-de-gata-nijar-natural-park-near-granada", "donana-national-park-near-seville", "torcal-de-antequera-near-malaga", "fuente-de-piedra-lagoon-near-malaga", "montes-de-malaga-natural-park-near-malaga", "sierra-nevada-national-park-near-granada", "sierra-de-baza-natural-park-near-granada", "sierra-de-las-nieves-national-park-near-malaga"],
    featuredCities: ["malaga", "granada", "seville"],
    relatedCollections: ["spain-national-parks", "spain-mountains", "spain-protected-landscapes", "european-coast", "portugal-spain-borderlands", "spain-coast", "australia-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-malm",
    title: "Weekend Escapes near Malmö",
    description:
      "Weekend Escapes near Malmö groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly nature areas, beaches, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["helsingborg", "malmo"],
    nearbyPlaces: ["dalby-soderskog-national-park-near-malmo", "falsterbo-near-malmo", "kullaberg-near-malmo", "soderasen-national-park-near-helsingborg", "oresund-near-helsingborg"],
    featuredPlaces: ["dalby-soderskog-national-park-near-malmo", "falsterbo-near-malmo", "kullaberg-near-malmo", "soderasen-national-park-near-helsingborg", "oresund-near-helsingborg"],
    featuredCities: ["malmo", "helsingborg"],
    relatedCollections: ["denmark-sweden-borderlands", "sweden-national-parks", "european-coast", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-marseille",
    title: "Weekend Escapes near Marseille",
    description:
      "Weekend Escapes near Marseille groups 10 nearby places across 5 cities for local-first day and weekend discovery — mainly mountains, nature areas, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["aix-en-provence", "marseille", "montpellier", "nice", "nimes"],
    nearbyPlaces: ["alpilles-near-marseille", "calanques-near-marseille", "cevennes-national-park-near-montpellier", "lac-de-saint-cassien-near-nice", "lake-of-sainte-croix-near-nice", "massif-de-lesterel-near-nice", "mercantour-national-park-near-nice", "montagne-sainte-victoire-near-aix-en-provence", "pont-du-gard-near-nimes", "sainte-baume-near-marseille"],
    featuredPlaces: ["alpilles-near-marseille", "calanques-near-marseille", "cevennes-national-park-near-montpellier", "lac-de-saint-cassien-near-nice", "lake-of-sainte-croix-near-nice", "massif-de-lesterel-near-nice", "mercantour-national-park-near-nice", "montagne-sainte-victoire-near-aix-en-provence"],
    featuredCities: ["nice", "marseille", "aix-en-provence", "montpellier", "nimes"],
    relatedCollections: ["france-mountains", "france-national-parks", "france-italy-borderlands", "france-lakes", "france-weekend-escapes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-melbourne",
    title: "Weekend Escapes near Melbourne",
    description:
      "Weekend Escapes near Melbourne groups 6 nearby places across 4 cities for local-first day and weekend discovery — mainly nature areas, beaches, islands. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["ballarat", "bendigo", "geelong", "melbourne"],
    nearbyPlaces: ["castlemaine-diggings-national-heritage-park-near-bendigo", "grampians-national-park-near-ballarat", "mornington-peninsula-national-park-near-melbourne", "phillip-island-near-melbourne", "werribee-gorge-state-park-near-melbourne", "you-yangs-regional-park-near-geelong"],
    featuredPlaces: ["castlemaine-diggings-national-heritage-park-near-bendigo", "grampians-national-park-near-ballarat", "mornington-peninsula-national-park-near-melbourne", "phillip-island-near-melbourne", "werribee-gorge-state-park-near-melbourne", "you-yangs-regional-park-near-geelong"],
    featuredCities: ["melbourne", "ballarat", "bendigo", "geelong"],
    relatedCollections: ["australia-coast", "australia-islands", "australia-national-parks", "australia-weekend-escapes", "australia-mountains", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-milan",
    title: "Weekend Escapes near Milan",
    description:
      "Weekend Escapes near Milan groups 11 nearby places across 6 cities for local-first day and weekend discovery — mainly mountains, lakes, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bergamo", "como", "genoa", "milan", "parma", "turin"],
    nearbyPlaces: ["bergamo-near-milan", "castello-di-torrechiara-near-parma", "gran-paradiso-national-park-near-turin", "la-mandria-regional-park-near-turin", "lake-como-near-como", "lake-iseo-near-bergamo", "lake-maggiore-near-milan", "maritime-alps-natural-park-near-turin", "monte-generoso-near-como", "orsiera-rocciavre-natural-park-near-turin", "portofino-regional-park-near-genoa"],
    featuredPlaces: ["bergamo-near-milan", "castello-di-torrechiara-near-parma", "gran-paradiso-national-park-near-turin", "la-mandria-regional-park-near-turin", "lake-como-near-como", "lake-iseo-near-bergamo", "lake-maggiore-near-milan", "maritime-alps-natural-park-near-turin"],
    featuredCities: ["turin", "como", "milan", "bergamo", "genoa", "parma"],
    relatedCollections: ["italy-mountains", "france-italy-borderlands", "italy-lakes", "italy-protected-landscapes", "italy-national-parks", "italy-weekend-escapes", "australia-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-montreal",
    title: "Weekend Escapes near Montreal",
    description:
      "Weekend Escapes near Montreal groups 11 nearby places across 4 cities for local-first day and weekend discovery — mainly nature areas, parks, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["gatineau", "montreal", "ottawa", "sherbrooke"],
    nearbyPlaces: ["foy-provincial-park-near-ottawa", "gatineau-park-near-ottawa", "lake-memphremagog-near-sherbrooke", "larose-forest-near-ottawa", "mer-bleue-bog-near-ottawa", "mont-orford-national-park-near-sherbrooke", "mont-tremblant-national-park-near-montreal", "oka-national-park-near-montreal", "ottawa-river-near-gatineau", "plaisance-national-park-near-gatineau", "iles-de-boucherville-national-park-near-montreal"],
    featuredPlaces: ["foy-provincial-park-near-ottawa", "gatineau-park-near-ottawa", "lake-memphremagog-near-sherbrooke", "larose-forest-near-ottawa", "mer-bleue-bog-near-ottawa", "mont-orford-national-park-near-sherbrooke", "mont-tremblant-national-park-near-montreal", "oka-national-park-near-montreal"],
    featuredCities: ["ottawa", "montreal", "gatineau", "sherbrooke"],
    relatedCollections: ["canada-national-parks", "canada-protected-landscapes", "canada-islands", "canada-mountains", "canada-united-states-borderlands", "canada-weekend-escapes", "australia-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-munich",
    title: "Weekend Escapes near Munich",
    description:
      "Weekend Escapes near Munich groups 14 nearby places across 6 cities for local-first day and weekend discovery — mainly lakes, nature areas, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["augsburg", "garmisch-partenkirchen", "munich", "nuremberg", "passau", "regensburg"],
    nearbyPlaces: ["ammersee-near-augsburg", "augsburg-western-woods-nature-park-near-augsburg", "bavarian-forest-near-passau", "bavarian-forest-national-park-near-passau", "eibsee-near-garmisch-partenkirchen", "englischer-garten-munich", "franconian-jura-near-nuremberg", "franconian-switzerland-near-nuremberg", "grosser-arbersee-near-regensburg", "hesselberg-near-nuremberg", "lake-starnberg-near-munich", "pegnitz-valley-near-nuremberg", "tegernsee-near-munich", "zugspitze-near-garmisch-partenkirchen"],
    featuredPlaces: ["ammersee-near-augsburg", "augsburg-western-woods-nature-park-near-augsburg", "bavarian-forest-near-passau", "bavarian-forest-national-park-near-passau", "eibsee-near-garmisch-partenkirchen", "englischer-garten-munich", "franconian-jura-near-nuremberg", "franconian-switzerland-near-nuremberg"],
    featuredCities: ["nuremberg", "munich", "augsburg", "garmisch-partenkirchen", "passau", "regensburg"],
    relatedCollections: ["austria-germany-borderlands", "germany-lakes", "germany-mountains", "czechia-germany-borderlands", "germany-forests", "germany-weekend-escapes", "australia-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-new-york",
    title: "Weekend Escapes near New York",
    description:
      "Weekend Escapes near New York groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly parks, weekend places, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["new-york", "philadelphia"],
    nearbyPlaces: ["harriman-state-park-near-new-york", "hudson-valley-near-new-york", "jamaica-bay-wildlife-refuge-near-new-york", "jones-beach-state-park-near-new-york", "valley-forge-national-historical-park-near-philadelphia"],
    featuredPlaces: ["harriman-state-park-near-new-york", "hudson-valley-near-new-york", "jamaica-bay-wildlife-refuge-near-new-york", "jones-beach-state-park-near-new-york", "valley-forge-national-historical-park-near-philadelphia"],
    featuredCities: ["new-york", "philadelphia"],
    relatedCollections: ["united-states-coast", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes", "italy-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-paris",
    title: "Weekend Escapes near Paris",
    description:
      "Weekend Escapes near Paris groups 7 nearby places across 3 cities for local-first day and weekend discovery — mainly cultural sites, nature areas, historic towns. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["paris", "reims", "rouen"],
    nearbyPlaces: ["champagne-hillsides-houses-and-cellars-near-reims", "chantilly-near-paris", "fontainebleau-near-paris", "foret-de-rambouillet-near-paris", "haute-vallee-de-chevreuse-regional-natural-park-near-paris", "versailles-near-paris", "etretat-near-rouen"],
    featuredPlaces: ["champagne-hillsides-houses-and-cellars-near-reims", "chantilly-near-paris", "fontainebleau-near-paris", "foret-de-rambouillet-near-paris", "haute-vallee-de-chevreuse-regional-natural-park-near-paris", "versailles-near-paris", "etretat-near-rouen"],
    featuredCities: ["paris", "reims", "rouen"],
    relatedCollections: ["european-forests", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes", "italy-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-perth",
    title: "Weekend Escapes near Perth",
    description:
      "Weekend Escapes near Perth groups 6 nearby places across 2 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, islands. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bunbury", "perth"],
    nearbyPlaces: ["john-forrest-national-park-near-perth", "kalamunda-national-park-near-perth", "leschenault-estuary-near-bunbury", "rottnest-island-near-perth", "tuart-forest-national-park-near-bunbury", "walyunga-national-park-near-perth"],
    featuredPlaces: ["john-forrest-national-park-near-perth", "kalamunda-national-park-near-perth", "leschenault-estuary-near-bunbury", "rottnest-island-near-perth", "tuart-forest-national-park-near-bunbury", "walyunga-national-park-near-perth"],
    featuredCities: ["perth", "bunbury"],
    relatedCollections: ["australia-national-parks", "australia-islands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-portland",
    title: "Weekend Escapes near Portland",
    description:
      "Weekend Escapes near Portland groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly nature areas, beaches, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["eugene", "portland"],
    nearbyPlaces: ["columbia-river-gorge-near-portland", "mount-hood-national-forest-near-portland", "oregon-dunes-national-recreation-area-near-eugene", "oswald-west-state-park-near-portland", "silver-falls-state-park-near-portland"],
    featuredPlaces: ["columbia-river-gorge-near-portland", "mount-hood-national-forest-near-portland", "oregon-dunes-national-recreation-area-near-eugene", "oswald-west-state-park-near-portland", "silver-falls-state-park-near-portland"],
    featuredCities: ["portland", "eugene"],
    relatedCollections: ["united-states-coast", "united-states-mountains", "united-states-river-valleys", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-porto",
    title: "Weekend Escapes near Porto",
    description:
      "Weekend Escapes near Porto groups 8 nearby places across 6 cities for local-first day and weekend discovery — mainly waterfronts, nature areas, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["aveiro", "braga", "guimaraes", "porto", "viana-do-castelo", "viseu"],
    nearbyPlaces: ["douro-valley-near-porto", "alvao-natural-park-near-porto", "costa-nova-do-prado-near-aveiro", "cavado-river-near-guimaraes", "douro-international-natural-park-near-porto", "lima-river-near-viana-do-castelo", "peneda-geres-national-park-near-braga", "serra-da-estrela-natural-park-near-viseu"],
    featuredPlaces: ["douro-valley-near-porto", "alvao-natural-park-near-porto", "costa-nova-do-prado-near-aveiro", "cavado-river-near-guimaraes", "douro-international-natural-park-near-porto", "lima-river-near-viana-do-castelo", "peneda-geres-national-park-near-braga", "serra-da-estrela-natural-park-near-viseu"],
    featuredCities: ["porto", "aveiro", "braga", "guimaraes", "viana-do-castelo", "viseu"],
    relatedCollections: ["portugal-spain-borderlands", "european-mountains", "portugal-protected-landscapes", "portugal-weekend-escapes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-pozna",
    title: "Weekend Escapes near Poznań",
    description:
      "Weekend Escapes near Poznań groups 11 nearby places across 4 cities for local-first day and weekend discovery — mainly nature areas, mountains, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bydgoszcz", "poznan", "torun", "wroclaw"],
    nearbyPlaces: ["barycz-valley-landscape-park-near-wroclaw", "brodnica-landscape-park-near-torun", "giant-mountains-national-park-near-wroclaw", "powidz-landscape-park-near-poznan", "promno-landscape-park-near-poznan", "rogalin-landscape-park-near-poznan", "stolowe-mountains-national-park-near-wroclaw", "tuchola-forest-near-bydgoszcz", "tuchola-forest-national-park-near-bydgoszcz", "wielkopolska-national-park-near-poznan", "sleza-landscape-park-near-wroclaw"],
    featuredPlaces: ["barycz-valley-landscape-park-near-wroclaw", "brodnica-landscape-park-near-torun", "giant-mountains-national-park-near-wroclaw", "powidz-landscape-park-near-poznan", "promno-landscape-park-near-poznan", "rogalin-landscape-park-near-poznan", "stolowe-mountains-national-park-near-wroclaw", "tuchola-forest-near-bydgoszcz"],
    featuredCities: ["poznan", "wroclaw", "bydgoszcz", "torun"],
    relatedCollections: ["poland-national-parks", "poland-mountains", "czechia-poland-borderlands", "germany-poland-borderlands", "poland-weekend-escapes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-prague",
    title: "Weekend Escapes near Prague",
    description:
      "Weekend Escapes near Prague groups 6 nearby places across 3 cities for local-first day and weekend discovery — mainly nature areas, mountains, cultural sites. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["karlovy-vary", "liberec", "prague"],
    nearbyPlaces: ["bohemian-switzerland-near-prague", "jested-near-liberec", "karlstejn-near-prague", "koneprusy-caves-near-prague", "ore-mountains-near-karlovy-vary", "slavkov-forest-near-karlovy-vary"],
    featuredPlaces: ["bohemian-switzerland-near-prague", "jested-near-liberec", "karlstejn-near-prague", "koneprusy-caves-near-prague", "ore-mountains-near-karlovy-vary", "slavkov-forest-near-karlovy-vary"],
    featuredCities: ["prague", "karlovy-vary", "liberec"],
    relatedCollections: ["czechia-germany-borderlands", "czechia-poland-borderlands", "european-mountains", "european-forests", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-queenstown",
    title: "Weekend Escapes near Queenstown",
    description:
      "Weekend Escapes near Queenstown groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly lakes, nature areas, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["dunedin", "queenstown"],
    nearbyPlaces: ["fiordland-near-queenstown", "lake-hayes-near-queenstown", "moke-lake-near-queenstown", "otago-peninsula-near-dunedin", "the-remarkables-near-queenstown"],
    featuredPlaces: ["fiordland-near-queenstown", "lake-hayes-near-queenstown", "moke-lake-near-queenstown", "otago-peninsula-near-dunedin", "the-remarkables-near-queenstown"],
    featuredCities: ["queenstown", "dunedin"],
    relatedCollections: ["oceania-lakes", "new-zealand-mountains", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-rome",
    title: "Weekend Escapes near Rome",
    description:
      "Weekend Escapes near Rome groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly lakes, nature areas, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["laquila", "rome"],
    nearbyPlaces: ["bracciano-lake-near-rome", "circeo-national-park-near-rome", "gran-sasso-and-monti-della-laga-national-park-near-laquila", "maiella-national-park-near-laquila", "tivoli-near-rome"],
    featuredPlaces: ["bracciano-lake-near-rome", "circeo-national-park-near-rome", "gran-sasso-and-monti-della-laga-national-park-near-laquila", "maiella-national-park-near-laquila", "tivoli-near-rome"],
    featuredCities: ["rome", "laquila"],
    relatedCollections: ["italy-national-parks", "italy-lakes", "italy-mountains", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-rotterdam",
    title: "Weekend Escapes near Rotterdam",
    description:
      "Weekend Escapes near Rotterdam groups 10 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, historic towns, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["arnhem", "breda", "eindhoven", "nijmegen", "rotterdam", "tilburg"],
    nearbyPlaces: ["de-biesbosch-national-park-near-rotterdam", "groote-peel-national-park-near-eindhoven", "de-maasduinen-national-park-near-nijmegen", "delft-near-rotterdam", "hoge-veluwe-national-park-near-arnhem", "kinderdijk-near-rotterdam", "loonse-en-drunense-duinen-national-park-near-tilburg", "mastbos-near-breda", "midden-delfland-near-rotterdam", "veluwezoom-national-park-near-arnhem"],
    featuredPlaces: ["de-biesbosch-national-park-near-rotterdam", "groote-peel-national-park-near-eindhoven", "de-maasduinen-national-park-near-nijmegen", "delft-near-rotterdam", "hoge-veluwe-national-park-near-arnhem", "kinderdijk-near-rotterdam", "loonse-en-drunense-duinen-national-park-near-tilburg", "mastbos-near-breda"],
    featuredCities: ["rotterdam", "arnhem", "breda", "eindhoven", "nijmegen", "tilburg"],
    relatedCollections: ["netherlands-national-parks", "belgium-netherlands-borderlands", "germany-netherlands-borderlands", "weekend-escapes-near-amsterdam", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-san-francisco",
    title: "Weekend Escapes near San Francisco",
    description:
      "Weekend Escapes near San Francisco groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly nature areas, beaches, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["sacramento", "san-francisco"],
    nearbyPlaces: ["ano-nuevo-state-park-near-san-francisco", "big-basin-redwoods-state-park-near-san-francisco", "folsom-lake-recreation-area-near-sacramento", "muir-woods-near-san-francisco", "point-reyes-near-san-francisco"],
    featuredPlaces: ["ano-nuevo-state-park-near-san-francisco", "big-basin-redwoods-state-park-near-san-francisco", "folsom-lake-recreation-area-near-sacramento", "muir-woods-near-san-francisco", "point-reyes-near-san-francisco"],
    featuredCities: ["san-francisco", "sacramento"],
    relatedCollections: ["california-weekend-escapes", "united-states-forests", "united-states-coast", "united-states-lakes", "united-states-national-parks", "australia-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-seattle",
    title: "Weekend Escapes near Seattle",
    description:
      "Weekend Escapes near Seattle groups 6 nearby places across 2 cities for local-first day and weekend discovery — mainly mountains, nature areas, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bellingham", "seattle"],
    nearbyPlaces: ["deception-pass-state-park-near-seattle", "larrabee-state-park-near-bellingham", "mount-rainier-near-seattle", "north-cascades-national-park-near-bellingham", "olympic-near-seattle", "wallace-falls-state-park-near-seattle"],
    featuredPlaces: ["deception-pass-state-park-near-seattle", "larrabee-state-park-near-bellingham", "mount-rainier-near-seattle", "north-cascades-national-park-near-bellingham", "olympic-near-seattle", "wallace-falls-state-park-near-seattle"],
    featuredCities: ["seattle", "bellingham"],
    relatedCollections: ["canada-united-states-borderlands", "united-states-national-parks", "united-states-coast", "united-states-mountains", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-sofia",
    title: "Weekend Escapes near Sofia",
    description:
      "Weekend Escapes near Sofia groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly mountains, parks, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["plovdiv", "sofia"],
    nearbyPlaces: ["iskar-gorge-near-sofia", "rhodope-mountains-near-plovdiv", "rila-monastery-nature-park-near-sofia", "rila-national-park-near-sofia", "vitosha-near-sofia"],
    featuredPlaces: ["iskar-gorge-near-sofia", "rhodope-mountains-near-plovdiv", "rila-monastery-nature-park-near-sofia", "rila-national-park-near-sofia", "vitosha-near-sofia"],
    featuredCities: ["sofia", "plovdiv"],
    relatedCollections: ["european-mountains", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes", "italy-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-stockholm",
    title: "Weekend Escapes near Stockholm",
    description:
      "Weekend Escapes near Stockholm groups 7 nearby places across 3 cities for local-first day and weekend discovery — mainly nature areas, islands, cultural sites. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["linkoping", "stockholm", "uppsala"],
    nearbyPlaces: ["drottningholm-near-stockholm", "farnebofjarden-national-park-near-uppsala", "roxen-near-linkoping", "stockholm-archipelago-near-stockholm", "takern-near-linkoping", "uppsala-near-stockholm", "angso-national-park-near-stockholm"],
    featuredPlaces: ["drottningholm-near-stockholm", "farnebofjarden-national-park-near-uppsala", "roxen-near-linkoping", "stockholm-archipelago-near-stockholm", "takern-near-linkoping", "uppsala-near-stockholm", "angso-national-park-near-stockholm"],
    featuredCities: ["stockholm", "linkoping", "uppsala"],
    relatedCollections: ["sweden-national-parks", "sweden-islands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-strasbourg",
    title: "Weekend Escapes near Strasbourg",
    description:
      "Weekend Escapes near Strasbourg groups 6 nearby places across 2 cities for local-first day and weekend discovery — mainly lakes, mountains, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["nancy", "strasbourg"],
    nearbyPlaces: ["lac-blanc-near-strasbourg", "lac-de-madine-near-nancy", "mont-sainte-odile-near-strasbourg", "northern-vosges-regional-park-near-strasbourg", "parc-naturel-regional-de-lorraine-near-nancy", "vosges-near-strasbourg"],
    featuredPlaces: ["lac-blanc-near-strasbourg", "lac-de-madine-near-nancy", "mont-sainte-odile-near-strasbourg", "northern-vosges-regional-park-near-strasbourg", "parc-naturel-regional-de-lorraine-near-nancy", "vosges-near-strasbourg"],
    featuredCities: ["strasbourg", "nancy"],
    relatedCollections: ["france-germany-borderlands", "france-lakes", "france-protected-landscapes", "france-mountains", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-sydney",
    title: "Weekend Escapes near Sydney",
    description:
      "Weekend Escapes near Sydney groups 6 nearby places across 3 cities for local-first day and weekend discovery — mainly nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["newcastle", "sydney", "wollongong"],
    nearbyPlaces: ["blue-mountains-near-sydney", "budderoo-national-park-near-wollongong", "garigal-national-park-near-sydney", "ku-ring-gai-chase-national-park-near-sydney", "royal-national-park-sydney", "watagans-national-park-near-newcastle"],
    featuredPlaces: ["blue-mountains-near-sydney", "budderoo-national-park-near-wollongong", "garigal-national-park-near-sydney", "ku-ring-gai-chase-national-park-near-sydney", "royal-national-park-sydney", "watagans-national-park-near-newcastle"],
    featuredCities: ["sydney", "newcastle", "wollongong"],
    relatedCollections: ["australia-national-parks", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes", "italy-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-tallinn",
    title: "Weekend Escapes near Tallinn",
    description:
      "Weekend Escapes near Tallinn groups 6 nearby places across 3 cities for local-first day and weekend discovery — mainly islands, nature areas, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["parnu", "tallinn", "tartu"],
    nearbyPlaces: ["aegna-near-tallinn", "kihnu-near-parnu", "lahemaa-national-park-near-tallinn", "lake-peipus-near-tartu", "matsalu-national-park-near-tallinn", "soomaa-national-park-near-parnu"],
    featuredPlaces: ["aegna-near-tallinn", "kihnu-near-parnu", "lahemaa-national-park-near-tallinn", "lake-peipus-near-tartu", "matsalu-national-park-near-tallinn", "soomaa-national-park-near-parnu"],
    featuredCities: ["tallinn", "parnu", "tartu"],
    relatedCollections: ["baltic-sea-coast", "estonia-finland-borderlands", "european-islands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-toronto",
    title: "Weekend Escapes near Toronto",
    description:
      "Weekend Escapes near Toronto groups 6 nearby places across 3 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["hamilton-ontario", "kitchener", "toronto"],
    nearbyPlaces: ["dundas-valley-conservation-area-near-hamilton-ontario", "elora-gorge-near-kitchener", "grand-river-near-kitchener", "niagara-falls-near-toronto", "rouge-national-urban-park-near-toronto", "toronto-islands-near-toronto"],
    featuredPlaces: ["dundas-valley-conservation-area-near-hamilton-ontario", "elora-gorge-near-kitchener", "grand-river-near-kitchener", "niagara-falls-near-toronto", "rouge-national-urban-park-near-toronto", "toronto-islands-near-toronto"],
    featuredCities: ["toronto", "kitchener", "hamilton-ontario"],
    relatedCollections: ["canada-united-states-borderlands", "canada-islands", "canada-protected-landscapes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-toulouse",
    title: "Weekend Escapes near Toulouse",
    description:
      "Weekend Escapes near Toulouse groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly nature areas, mountains, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["perpignan", "toulouse"],
    nearbyPlaces: ["cap-de-creus-near-perpignan", "garonne-near-toulouse", "haut-languedoc-regional-park-near-toulouse", "montagne-noire-near-toulouse", "pyrenees-national-park-near-toulouse"],
    featuredPlaces: ["cap-de-creus-near-perpignan", "garonne-near-toulouse", "haut-languedoc-regional-park-near-toulouse", "montagne-noire-near-toulouse", "pyrenees-national-park-near-toulouse"],
    featuredCities: ["toulouse", "perpignan"],
    relatedCollections: ["france-mountains", "france-protected-landscapes", "france-spain-borderlands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-valencia",
    title: "Weekend Escapes near Valencia",
    description:
      "Weekend Escapes near Valencia groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly nature areas, mountains, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["alicante", "valencia"],
    nearbyPlaces: ["albufera-natural-park-near-valencia", "montgo-natural-park-near-alicante", "penyal-difac-near-valencia", "sierra-calderona-near-valencia", "sierra-de-espadan-near-valencia"],
    featuredPlaces: ["albufera-natural-park-near-valencia", "montgo-natural-park-near-alicante", "penyal-difac-near-valencia", "sierra-calderona-near-valencia", "sierra-de-espadan-near-valencia"],
    featuredCities: ["valencia", "alicante"],
    relatedCollections: ["spain-protected-landscapes", "spain-mountains", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-vancouver",
    title: "Weekend Escapes near Vancouver",
    description:
      "Weekend Escapes near Vancouver groups 10 nearby places across 3 cities for local-first day and weekend discovery — mainly mountains, nature areas, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["nanaimo", "vancouver", "victoria"],
    nearbyPlaces: ["garibaldi-provincial-park-near-vancouver", "goldstream-provincial-park-near-victoria", "juan-de-fuca-provincial-park-near-victoria", "lynn-canyon-park-near-vancouver", "mount-benson-near-nanaimo", "mount-douglas-near-victoria", "mount-seymour-provincial-park-near-vancouver", "salt-spring-island-near-victoria", "saysutshun-newcastle-island-marine-park-near-nanaimo", "stanley-park-vancouver"],
    featuredPlaces: ["garibaldi-provincial-park-near-vancouver", "goldstream-provincial-park-near-victoria", "juan-de-fuca-provincial-park-near-victoria", "lynn-canyon-park-near-vancouver", "mount-benson-near-nanaimo", "mount-douglas-near-victoria", "mount-seymour-provincial-park-near-vancouver", "salt-spring-island-near-victoria"],
    featuredCities: ["vancouver", "victoria", "nanaimo"],
    relatedCollections: ["canada-mountains", "canada-united-states-borderlands", "canada-islands", "canada-protected-landscapes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-venice",
    title: "Weekend Escapes near Venice",
    description:
      "Weekend Escapes near Venice groups 13 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, mountains, cultural sites. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["padua", "ravenna", "trieste", "udine", "venice", "verona"],
    nearbyPlaces: ["adige-valley-near-verona", "cansiglio-near-venice", "carnic-alps-near-udine", "castello-di-miramare-near-trieste", "cavallino-treporti-near-venice", "comacchio-near-ravenna", "dolomiti-bellunesi-national-park-near-venice", "euganean-hills-near-venice", "euganean-hills-near-padua", "julian-prealps-natural-park-near-udine", "lake-garda-near-verona", "lessinia-regional-park-near-verona", "monte-baldo-near-verona"],
    featuredPlaces: ["adige-valley-near-verona", "cansiglio-near-venice", "carnic-alps-near-udine", "castello-di-miramare-near-trieste", "cavallino-treporti-near-venice", "comacchio-near-ravenna", "dolomiti-bellunesi-national-park-near-venice", "euganean-hills-near-venice"],
    featuredCities: ["venice", "verona", "udine", "padua", "ravenna", "trieste"],
    relatedCollections: ["italy-mountains", "austria-italy-borderlands", "italy-slovenia-borderlands", "italy-protected-landscapes", "european-coast", "italy-national-parks", "australia-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-vilnius",
    title: "Weekend Escapes near Vilnius",
    description:
      "Weekend Escapes near Vilnius groups 6 nearby places across 2 cities for local-first day and weekend discovery — mainly lakes, parks, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["kaunas", "vilnius"],
    nearbyPlaces: ["asveja-near-vilnius", "dzukija-national-park-near-vilnius", "kaunas-reservoir-near-kaunas", "kauno-marios-regional-park-near-kaunas", "trakai-historical-national-park-near-vilnius", "verkiai-regional-park-near-vilnius"],
    featuredPlaces: ["asveja-near-vilnius", "dzukija-national-park-near-vilnius", "kaunas-reservoir-near-kaunas", "kauno-marios-regional-park-near-kaunas", "trakai-historical-national-park-near-vilnius", "verkiai-regional-park-near-vilnius"],
    featuredCities: ["vilnius", "kaunas"],
    relatedCollections: ["european-lakes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes", "italy-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-warsaw",
    title: "Weekend Escapes near Warsaw",
    description:
      "Weekend Escapes near Warsaw groups 6 nearby places across 3 cities for local-first day and weekend discovery — mainly nature areas, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["lodz", "lublin", "warsaw"],
    nearbyPlaces: ["kabaty-woods-near-warsaw", "kampinos-national-park-near-warsaw", "masovian-landscape-park-near-warsaw", "roztocze-national-park-near-lublin", "zegrze-reservoir-near-warsaw", "lodz-hills-landscape-park-near-lodz"],
    featuredPlaces: ["kabaty-woods-near-warsaw", "kampinos-national-park-near-warsaw", "masovian-landscape-park-near-warsaw", "roztocze-national-park-near-lublin", "zegrze-reservoir-near-warsaw", "lodz-hills-landscape-park-near-lodz"],
    featuredCities: ["warsaw", "lodz", "lublin"],
    relatedCollections: ["poland-national-parks", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes", "italy-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-wellington",
    title: "Weekend Escapes near Wellington",
    description:
      "Weekend Escapes near Wellington groups 6 nearby places across 3 cities for local-first day and weekend discovery — mainly nature areas, islands, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["nelson", "palmerston-north", "wellington"],
    nearbyPlaces: ["abel-tasman-national-park-near-nelson", "kapiti-island-near-wellington", "remutaka-forest-park-near-wellington", "tararua-forest-park-near-palmerston-north", "tararua-forest-park-near-wellington", "zealandia-near-wellington"],
    featuredPlaces: ["abel-tasman-national-park-near-nelson", "kapiti-island-near-wellington", "remutaka-forest-park-near-wellington", "tararua-forest-park-near-palmerston-north", "tararua-forest-park-near-wellington", "zealandia-near-wellington"],
    featuredCities: ["wellington", "nelson", "palmerston-north"],
    relatedCollections: ["new-zealand-mountains", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes", "italy-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-zagreb",
    title: "Weekend Escapes near Zagreb",
    description:
      "Weekend Escapes near Zagreb groups 5 nearby places across 2 cities for local-first day and weekend discovery — mainly mountains, islands, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["rijeka", "zagreb"],
    nearbyPlaces: ["krk-near-rijeka", "medvednica-nature-park-near-zagreb", "papuk-nature-park-near-zagreb", "plitvice-lakes-national-park-near-zagreb", "risnjak-national-park-near-rijeka"],
    featuredPlaces: ["krk-near-rijeka", "medvednica-nature-park-near-zagreb", "papuk-nature-park-near-zagreb", "plitvice-lakes-national-park-near-zagreb", "risnjak-national-park-near-rijeka"],
    featuredCities: ["zagreb", "rijeka"],
    relatedCollections: ["croatia-mountains", "european-islands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes", "germany-weekend-escapes"],
  },
];

const VALID_REGION_TYPES: ReadonlySet<string> = new Set<RegionType>([
  "mountain_region", "coastal_region", "lake_region", "river_region",
  "national_park_region", "forest_region", "island_region", "cross_border_region",
  "protected_landscape_region", "weekend_escape_region",
]);
const MIN_PLACES = 5;
const MAX_PLACES = 30;
const MIN_CITIES = 2;
const MAX_CITIES = 15;
// Category-consistency: single-feature region types only admit matching categories.
const ALLOWED_CATEGORIES: Partial<Record<RegionType, ReadonlySet<string>>> = {
  mountain_region: new Set(["mountain"]),
  lake_region: new Set(["lake"]),
  coastal_region: new Set(["beach", "island", "waterfront"]),
  island_region: new Set(["island"]),
  river_region: new Set(["nature", "park", "waterfront"]),
  forest_region: new Set(["nature", "park"]),
  protected_landscape_region: new Set(["park", "nature"]),
};
const FOREST_TOKENS = ["forest", "wald", "forêt", "foret", "bos", "bois", "woods"];
const RIVER_TOKENS = ["valley", "vallée", "vallee", "river", "rhine", "danube", "loire", "gorge"];

function assertRegionalCollections(cols: readonly RegionalCollection[]): void {
  const citySlugs = new Set(cities.map((c) => c.slug));
  const placeSlugs = new Set(nearbyWeekendPlaces.map((p) => p.slug));
  const placeCategory = new Map(nearbyWeekendPlaces.map((p) => [p.slug, p.category]));
  const placeName = new Map(nearbyWeekendPlaces.map((p) => [p.slug, p.name.toLowerCase()]));
  const allSlugs = new Set(cols.map((c) => c.slug));
  const slugSeen = new Set<string>();
  const placeSets = cols.map((c) => ({ slug: c.slug, type: c.regionType, set: new Set(c.nearbyPlaces) }));
  const errors: string[] = [];
  for (const c of cols) {
    if (slugSeen.has(c.slug)) errors.push(`${c.slug}: duplicate collection slug`);
    slugSeen.add(c.slug);
    if (!VALID_REGION_TYPES.has(c.regionType)) errors.push(`${c.slug}: invalid regionType ${c.regionType}`);
    if (c.nearbyPlaces.length < MIN_PLACES || c.nearbyPlaces.length > MAX_PLACES) errors.push(`${c.slug}: ${c.nearbyPlaces.length} places out of range ${MIN_PLACES}-${MAX_PLACES}`);
    if (c.cities.length < MIN_CITIES || c.cities.length > MAX_CITIES) errors.push(`${c.slug}: ${c.cities.length} cities out of range ${MIN_CITIES}-${MAX_CITIES}`);
    const pSeen = new Set<string>();
    const allowed = ALLOWED_CATEGORIES[c.regionType];
    for (const p of c.nearbyPlaces) {
      if (pSeen.has(p)) errors.push(`${c.slug}: duplicate place ${p}`);
      pSeen.add(p);
      if (!placeSlugs.has(p)) errors.push(`${c.slug}: place ${p} not found in nearby-places.ts`);
      const cat = placeCategory.get(p);
      if (allowed && cat && !allowed.has(cat)) errors.push(`${c.slug}: place ${p} category ${cat} invalid for ${c.regionType}`);
      const name = placeName.get(p) ?? "";
      if (c.regionType === "forest_region" && !FOREST_TOKENS.some((t) => name.includes(t))) errors.push(`${c.slug}: forest_region place ${p} is not forest-linked`);
      if (c.regionType === "river_region" && !RIVER_TOKENS.some((t) => name.includes(t))) errors.push(`${c.slug}: river_region place ${p} is not river-linked`);
    }
    const cSeen = new Set<string>();
    for (const ct of c.cities) {
      if (cSeen.has(ct)) errors.push(`${c.slug}: duplicate city ${ct}`);
      cSeen.add(ct);
      if (!citySlugs.has(ct)) errors.push(`${c.slug}: city ${ct} not found in cities.ts`);
    }
    for (const p of c.featuredPlaces) if (!pSeen.has(p)) errors.push(`${c.slug}: featuredPlace ${p} not in nearbyPlaces`);
    for (const ct of c.featuredCities) if (!cSeen.has(ct)) errors.push(`${c.slug}: featuredCity ${ct} not in cities`);
    if (c.relatedCollections.length === 0) errors.push(`${c.slug}: orphan collection (no relatedCollections)`);
    const rSeen = new Set<string>();
    for (const r of c.relatedCollections) {
      if (r === c.slug) errors.push(`${c.slug}: related self-reference`);
      if (rSeen.has(r)) errors.push(`${c.slug}: duplicate related ${r}`);
      rSeen.add(r);
      if (!allSlugs.has(r)) errors.push(`${c.slug}: related ${r} not found`);
    }
  }
  // no collection may be a strict subset of another of the same type
  for (const a of placeSets) {
    for (const b of placeSets) {
      if (a.slug === b.slug || a.type !== b.type) continue;
      if (a.set.size < b.set.size && [...a.set].every((p) => b.set.has(p))) {
        errors.push(`${a.slug}: strict subset of same-type ${b.slug}`); break;
      }
    }
  }
  if (errors.length > 0) {
    throw new Error(`Invalid regional discovery collections (${errors.length}):\n  - ${errors.slice(0,40).join("\n  - ")}`);
  }
}

assertRegionalCollections(REGIONAL_DISCOVERY_COLLECTIONS);

const BY_CITY = new Map<string, RegionalCollection[]>();
const BY_PLACE = new Map<string, RegionalCollection[]>();
const BY_SLUG = new Map<string, RegionalCollection>();
for (const c of REGIONAL_DISCOVERY_COLLECTIONS) {
  BY_SLUG.set(c.slug, c);
  for (const ct of c.cities) { const a = BY_CITY.get(ct) ?? []; a.push(c); BY_CITY.set(ct, a); }
  for (const p of c.nearbyPlaces) { const a = BY_PLACE.get(p) ?? []; a.push(c); BY_PLACE.set(p, a); }
}

export function getAllRegionalCollections(): readonly RegionalCollection[] {
  return REGIONAL_DISCOVERY_COLLECTIONS;
}
export function getRegionalCollectionBySlug(slug: string): RegionalCollection | undefined {
  return BY_SLUG.get(slug);
}
export function getRegionalCollectionsForCity(citySlug: string): readonly RegionalCollection[] {
  return BY_CITY.get(citySlug) ?? [];
}
export function getRegionalCollectionsForPlace(placeSlug: string): readonly RegionalCollection[] {
  return BY_PLACE.get(placeSlug) ?? [];
}
export function getRelatedRegionalCollections(slug: string): RegionalCollection[] {
  const c = BY_SLUG.get(slug);
  if (!c) return [];
  return c.relatedCollections.map((s) => BY_SLUG.get(s)).filter((x): x is RegionalCollection => Boolean(x));
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
