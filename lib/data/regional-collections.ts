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
      "Australia Mountains groups 10 nearby places across 8 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["canberra", "dubbo", "hobart", "melbourne", "port-macquarie", "rockhampton", "toowoomba", "orange"],
    nearbyPlaces: ["bunya-mountains-national-park-near-toowoomba", "mount-archer-national-park-near-rockhampton", "namadgi-national-park-near-canberra", "warrumbungle-national-park-near-dubbo", "werrikimbe-national-park-near-port-macquarie", "you-yangs-regional-park-near-melbourne", "kunanyi-mount-wellington-near-hobart", "mount-canobolas-near-dubbo", "nangar-national-park-near-dubbo", "mount-canobolas-near-orange"],
    featuredPlaces: ["bunya-mountains-national-park-near-toowoomba", "mount-archer-national-park-near-rockhampton", "namadgi-national-park-near-canberra", "warrumbungle-national-park-near-dubbo", "werrikimbe-national-park-near-port-macquarie", "you-yangs-regional-park-near-melbourne", "kunanyi-mount-wellington-near-hobart"],
    featuredCities: ["canberra", "dubbo", "hobart", "melbourne", "port-macquarie", "rockhampton"],
    relatedCollections: ["australia-weekend-escapes", "australia-national-parks", "australia-coast", "oceania-weekend-escapes", "queensland-weekend-escapes", "weekend-escapes-near-brisbane", "weekend-escapes-near-hobart", "australia-islands"],
  },
  {
    slug: "australia-national-parks",
    title: "Australia National Parks",
    description:
      "Australia National Parks groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, beaches, mountains. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["adelaide", "brisbane", "bundaberg", "coffs-harbour", "devonport", "dubbo", "gladstone", "gold-coast", "hobart", "mackay", "perth", "port-macquarie", "rockhampton", "sydney", "tamworth"],
    nearbyPlaces: ["blue-mountains-near-sydney", "bongil-bongil-national-park-near-coffs-harbour", "burrum-coast-national-park-near-bundaberg", "byfield-national-park-near-rockhampton", "cape-hillsborough-national-park-near-mackay", "cleland-national-park-near-adelaide", "crowdy-bay-national-park-near-port-macquarie", "daguilar-national-park-near-brisbane", "deepwater-national-park-near-bundaberg", "dorrigo-national-park-near-coffs-harbour", "eungella-national-park-near-mackay", "eurimbula-national-park-near-gladstone", "garigal-national-park-near-sydney", "goulburn-river-national-park-near-dubbo", "john-forrest-national-park-near-perth", "kalamunda-national-park-near-perth", "kroombit-tops-national-park-near-gladstone", "ku-ring-gai-chase-national-park-near-sydney", "lamington-national-park-near-gold-coast", "mole-creek-karst-national-park-near-devonport", "mount-archer-national-park-near-rockhampton", "mount-field-national-park-near-hobart", "narawntapu-national-park-near-devonport", "nerang-national-park-near-gold-coast", "onkaparinga-river-national-park-near-adelaide", "oxley-wild-rivers-national-park-near-tamworth", "royal-national-park-sydney", "south-bruny-national-park-near-hobart", "springbrook-national-park-near-gold-coast", "tamborine-national-park-near-brisbane"],
    featuredPlaces: ["blue-mountains-near-sydney", "bongil-bongil-national-park-near-coffs-harbour", "burrum-coast-national-park-near-bundaberg", "byfield-national-park-near-rockhampton", "cape-hillsborough-national-park-near-mackay", "cleland-national-park-near-adelaide", "crowdy-bay-national-park-near-port-macquarie", "daguilar-national-park-near-brisbane"],
    featuredCities: ["sydney", "gold-coast", "adelaide", "brisbane", "bundaberg", "coffs-harbour"],
    relatedCollections: ["australia-weekend-escapes", "australia-coast", "oceania-weekend-escapes", "weekend-escapes-near-brisbane", "weekend-escapes-near-sydney", "queensland-weekend-escapes", "australia-mountains", "weekend-escapes-near-hobart"],
  },
  {
    slug: "australia-weekend-escapes",
    title: "Australia Weekend Escapes",
    description:
      "Australia Weekend Escapes groups 27 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, beaches, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["adelaide", "albury", "cairns", "canberra", "coffs-harbour", "darwin", "devonport", "geraldton", "gold-coast", "mackay", "melbourne", "mildura", "port-macquarie", "rockhampton", "townsville"],
    nearbyPlaces: ["bongil-bongil-national-park-near-coffs-harbour", "byfield-national-park-near-rockhampton", "cape-hillsborough-national-park-near-mackay", "cleland-national-park-near-adelaide", "crowdy-bay-national-park-near-port-macquarie", "daintree-national-park-near-cairns", "dorrigo-national-park-near-coffs-harbour", "eungella-national-park-near-mackay", "hallett-cove-conservation-park-near-adelaide", "hattah-kulkyne-national-park-near-mildura", "houtman-abrolhos-near-geraldton", "kalbarri-national-park-near-geraldton", "lake-hume-near-albury", "litchfield-national-park-near-darwin", "magnetic-island-near-townsville", "mole-creek-karst-national-park-near-devonport", "morialta-conservation-park-near-adelaide", "mount-archer-national-park-near-rockhampton", "namadgi-national-park-near-canberra", "narawntapu-national-park-near-devonport", "onkaparinga-river-national-park-near-adelaide", "tamborine-national-park-near-gold-coast", "werrikimbe-national-park-near-port-macquarie", "woomargama-national-park-near-albury", "you-yangs-regional-park-near-melbourne", "livingstone-national-park-near-wagga-wagga", "woomargama-national-park-near-wagga-wagga"],
    featuredPlaces: ["bongil-bongil-national-park-near-coffs-harbour", "byfield-national-park-near-rockhampton", "cape-hillsborough-national-park-near-mackay", "cleland-national-park-near-adelaide", "crowdy-bay-national-park-near-port-macquarie", "daintree-national-park-near-cairns", "dorrigo-national-park-near-coffs-harbour", "eungella-national-park-near-mackay"],
    featuredCities: ["adelaide", "albury", "coffs-harbour", "devonport", "geraldton", "mackay"],
    relatedCollections: ["australia-national-parks", "australia-coast", "australia-mountains", "queensland-weekend-escapes", "australia-islands", "oceania-lakes", "weekend-escapes-near-brisbane", "weekend-escapes-near-melbourne"],
  },
  {
    slug: "austria-czechia-borderlands",
    title: "Austria–Czechia Borderlands",
    description:
      "Austria–Czechia Borderlands groups 30 nearby places across 11 cities for local-first day and weekend discovery — mainly nature areas, mountains. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["brno", "ceske-budejovice", "sankt-polten", "vienna", "plzen", "linz", "pardubice", "jihlava", "decin", "eisenstadt", "wiener-neustadt"],
    nearbyPlaces: ["dunkelsteinerwald-near-sankt-polten", "hohe-wand-near-vienna", "wachau-near-sankt-polten", "podyji-national-park-near-brno", "trebon-basin-near-ceske-budejovice", "hohe-wand-near-sankt-polten", "otscher-near-sankt-polten", "traisen-near-sankt-polten", "vienna-woods-near-sankt-polten", "brdy-near-plzen", "kalkalpen-national-park-near-linz", "schonbrunn-vienna", "sengsengebirge-near-linz", "sumava-national-park-near-plzen", "traunsee-near-linz", "traunstein-near-linz", "wachau-valley-near-vienna", "zdar-hills-near-pardubice", "bohemian-moravian-highlands-near-jihlava", "central-bohemian-uplands-near-decin", "dalesice-reservoir-near-jihlava", "danube-auen-national-park-near-eisenstadt", "ferto-hansag-national-park-near-eisenstadt", "hoellental-near-wiener-neustadt", "hohe-wand-nature-park-near-eisenstadt", "hohe-wand-near-wiener-neustadt", "iron-mountains-near-jihlava", "javorice-near-jihlava", "lake-neusiedl-near-eisenstadt", "lake-neusiedl-near-wiener-neustadt"],
    featuredPlaces: ["dunkelsteinerwald-near-sankt-polten", "hohe-wand-near-vienna", "podyji-national-park-near-brno", "trebon-basin-near-ceske-budejovice", "wachau-near-sankt-polten"],
    featuredCities: ["sankt-polten", "brno", "ceske-budejovice", "vienna"],
    relatedCollections: ["weekend-escapes-near-graz", "weekend-escapes-near-brno", "central-europe-weekend-escapes", "czechia-germany-borderlands", "czechia-slovakia-borderlands", "austria-mountains", "european-forests", "czechia-poland-borderlands"],
  },
  {
    slug: "austria-germany-borderlands",
    title: "Austria–Germany Borderlands",
    description:
      "Austria–Germany Borderlands groups 30 nearby places across 10 cities for local-first day and weekend discovery — mainly lakes, mountains, nature areas. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["augsburg", "garmisch-partenkirchen", "innsbruck", "munich", "salzburg", "ulm", "ingolstadt", "linz", "bregenz", "feldkirch"],
    nearbyPlaces: ["achen-lake-near-innsbruck", "karwendel-near-innsbruck", "krimml-waterfalls-near-salzburg", "lake-fuschl-near-salzburg", "natterer-see-near-innsbruck", "patscherkofel-near-innsbruck", "untersberg-near-salzburg", "ammersee-near-augsburg", "eibsee-near-garmisch-partenkirchen", "englischer-garten-munich", "lake-starnberg-near-munich", "tegernsee-near-munich", "zugspitze-near-garmisch-partenkirchen", "adelegg-near-ulm", "altmuhl-valley-nature-park-near-ingolstadt", "attersee-near-linz", "blautopf-near-ulm", "bregenz-forest-mountains-near-bregenz", "bregenz-forest-mountains-near-feldkirch", "danube-gorge-weltenburg-near-ingolstadt", "hollengebirge-near-linz", "kalkalpen-national-park-near-linz", "lunersee-near-feldkirch", "nordlinger-ries-near-ingolstadt", "old-bavarian-donaumoos-near-ingolstadt", "pfander-near-bregenz", "ratikon-near-feldkirch", "rhine-delta-near-bregenz", "sengsengebirge-near-linz", "traunsee-near-linz"],
    featuredPlaces: ["achen-lake-near-innsbruck", "ammersee-near-augsburg", "eibsee-near-garmisch-partenkirchen", "englischer-garten-munich", "karwendel-near-innsbruck", "krimml-waterfalls-near-salzburg", "lake-fuschl-near-salzburg", "lake-starnberg-near-munich"],
    featuredCities: ["innsbruck", "munich", "salzburg", "garmisch-partenkirchen", "augsburg"],
    relatedCollections: ["weekend-escapes-near-innsbruck", "weekend-escapes-near-munich", "germany-lakes", "austria-italy-borderlands", "austria-lakes", "austria-mountains", "eastern-alps", "germany-mountains"],
  },
  {
    slug: "austria-italy-borderlands",
    title: "Austria–Italy Borderlands",
    description:
      "Austria–Italy Borderlands groups 30 nearby places across 13 cities for local-first day and weekend discovery — mainly mountains, nature areas, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["bolzano", "innsbruck", "klagenfurt", "salzburg", "udine", "verona", "villach", "brescia", "feldkirch", "bregenz", "vicenza", "treviso", "trieste"],
    nearbyPlaces: ["dobratsch-near-villach", "karawanks-near-klagenfurt", "karwendel-near-innsbruck", "krimml-waterfalls-near-salzburg", "patscherkofel-near-innsbruck", "adige-valley-near-verona", "carnic-alps-near-udine", "dolomites-near-bolzano", "julian-prealps-natural-park-near-udine", "julian-alps-near-villach", "lake-ossiach-near-villach", "millstatter-see-near-villach", "worthersee-near-villach", "adamello-brenta-natural-park-near-brescia", "alpstein-near-feldkirch", "appenzell-alps-near-bregenz", "asiago-plateau-near-vicenza", "biosphere-reserve-groes-walsertal-near-feldkirch", "bregenz-forest-mountains-near-bregenz", "bregenz-forest-mountains-near-feldkirch", "cansiglio-near-treviso", "castello-di-miramare-near-trieste", "dolomiti-bellunesi-national-park-near-treviso", "drei-schwestern-near-feldkirch", "lago-di-santa-croce-near-treviso", "lakes-of-revine-lago-near-treviso", "lunersee-near-feldkirch", "pfander-near-bregenz", "piave-river-near-treviso", "ratikon-near-feldkirch"],
    featuredPlaces: ["adige-valley-near-verona", "carnic-alps-near-udine", "dobratsch-near-villach", "dolomites-near-bolzano", "julian-prealps-natural-park-near-udine", "karawanks-near-klagenfurt", "karwendel-near-innsbruck", "krimml-waterfalls-near-salzburg"],
    featuredCities: ["innsbruck", "udine", "bolzano", "klagenfurt", "salzburg", "verona"],
    relatedCollections: ["austria-mountains", "eastern-alps", "austria-germany-borderlands", "weekend-escapes-near-innsbruck", "weekend-escapes-near-venice", "italy-mountains", "austria-slovenia-borderlands", "weekend-escapes-near-graz"],
  },
  {
    slug: "austria-lakes",
    title: "Austria Lakes",
    description:
      "Austria Lakes groups 15 nearby places across 9 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["graz", "innsbruck", "klagenfurt", "salzburg", "vienna", "villach", "linz", "eisenstadt", "wiener-neustadt"],
    nearbyPlaces: ["achen-lake-near-innsbruck", "lake-faak-near-villach", "lake-fuschl-near-salzburg", "lake-neusiedl-near-vienna", "lake-wolfgang-near-salzburg", "natterer-see-near-innsbruck", "stubenberg-am-see-near-graz", "worthersee-near-klagenfurt", "lake-ossiach-near-villach", "millstatter-see-near-villach", "worthersee-near-villach", "attersee-near-linz", "traunsee-near-linz", "lake-neusiedl-near-eisenstadt", "lake-neusiedl-near-wiener-neustadt"],
    featuredPlaces: ["achen-lake-near-innsbruck", "lake-faak-near-villach", "lake-fuschl-near-salzburg", "lake-neusiedl-near-vienna", "lake-wolfgang-near-salzburg", "natterer-see-near-innsbruck", "stubenberg-am-see-near-graz", "worthersee-near-klagenfurt"],
    featuredCities: ["innsbruck", "salzburg", "graz", "klagenfurt", "vienna", "villach"],
    relatedCollections: ["weekend-escapes-near-graz", "weekend-escapes-near-innsbruck", "austria-germany-borderlands", "austria-slovenia-borderlands", "austria-mountains", "austria-italy-borderlands", "central-europe-weekend-escapes", "eastern-alps"],
  },
  {
    slug: "austria-mountains",
    title: "Austria Mountains",
    description:
      "Austria Mountains groups 19 nearby places across 9 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["graz", "innsbruck", "klagenfurt", "salzburg", "vienna", "villach", "linz", "wiener-neustadt", "eisenstadt"],
    nearbyPlaces: ["dobratsch-near-villach", "gesause-national-park-near-graz", "hohe-wand-near-vienna", "karawanks-near-klagenfurt", "karwendel-near-innsbruck", "patscherkofel-near-innsbruck", "schockl-near-graz", "untersberg-near-salzburg", "julian-alps-near-villach", "hollengebirge-near-linz", "sengsengebirge-near-linz", "traunstein-near-linz", "hohe-wand-near-wiener-neustadt", "leitha-mountains-near-eisenstadt", "rosalia-mountains-near-eisenstadt", "schneeberg-near-wiener-neustadt", "semmering-pass-near-wiener-neustadt", "sopron-mountains-near-eisenstadt", "unterberg-near-wiener-neustadt"],
    featuredPlaces: ["dobratsch-near-villach", "gesause-national-park-near-graz", "hohe-wand-near-vienna", "karawanks-near-klagenfurt", "karwendel-near-innsbruck", "patscherkofel-near-innsbruck", "schockl-near-graz", "untersberg-near-salzburg"],
    featuredCities: ["graz", "innsbruck", "klagenfurt", "salzburg", "vienna", "villach"],
    relatedCollections: ["weekend-escapes-near-graz", "austria-italy-borderlands", "austria-slovenia-borderlands", "austria-germany-borderlands", "weekend-escapes-near-innsbruck", "eastern-alps", "austria-lakes", "central-europe-mountains"],
  },
  {
    slug: "austria-slovenia-borderlands",
    title: "Austria–Slovenia Borderlands",
    description:
      "Austria–Slovenia Borderlands groups 30 nearby places across 11 cities for local-first day and weekend discovery — mainly mountains, lakes, nature areas. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["celje", "graz", "klagenfurt", "kranj", "ljubljana", "villach", "linz", "maribor", "eisenstadt", "wiener-neustadt", "koper"],
    nearbyPlaces: ["barenschutzklamm-near-graz", "dobratsch-near-villach", "karawanks-near-klagenfurt", "lake-faak-near-villach", "schockl-near-graz", "worthersee-near-klagenfurt", "kamniksavinja-alps-near-celje", "lake-bled-near-kranj", "lake-bohinj-near-ljubljana", "pohorje-near-celje", "triglav-national-park-near-kranj", "vipava-valley-near-ljubljana", "donacka-gora-near-celje", "julian-alps-near-villach", "lake-ossiach-near-villach", "millstatter-see-near-villach", "savinja-near-celje", "worthersee-near-villach", "kalkalpen-national-park-near-linz", "pohorje-near-maribor", "sengsengebirge-near-linz", "ferto-hansag-national-park-near-eisenstadt", "hoellental-near-wiener-neustadt", "hohe-wand-nature-park-near-eisenstadt", "hohe-wand-near-wiener-neustadt", "karst-plateau-near-koper", "lake-cerknica-near-koper", "leitha-mountains-near-eisenstadt", "myra-falls-near-wiener-neustadt", "nanos-near-koper"],
    featuredPlaces: ["barenschutzklamm-near-graz", "dobratsch-near-villach", "kamniksavinja-alps-near-celje", "karawanks-near-klagenfurt", "lake-bled-near-kranj", "lake-bohinj-near-ljubljana", "lake-faak-near-villach", "pohorje-near-celje"],
    featuredCities: ["celje", "graz", "klagenfurt", "kranj", "ljubljana", "villach"],
    relatedCollections: ["weekend-escapes-near-graz", "weekend-escapes-near-ljubljana", "central-europe-weekend-escapes", "italy-slovenia-borderlands", "austria-mountains", "croatia-slovenia-borderlands", "central-europe-mountains", "austria-lakes"],
  },
  {
    slug: "baltic-europe-weekend-escapes",
    title: "Baltic Europe Weekend Escapes",
    description:
      "Baltic Europe Weekend Escapes groups 30 nearby places across 8 cities for local-first day and weekend discovery — mainly parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["daugavpils", "kohtla-jarve", "panevezys", "tallinn", "siauliai", "narva", "alytus", "liepaja"],
    nearbyPlaces: ["alutaguse-national-park-near-kohtla-jarve", "lahemaa-national-park-near-kohtla-jarve", "aukstaitija-national-park-near-daugavpils", "razna-national-park-near-daugavpils", "anyksciai-regional-park-near-panevezys", "birzai-regional-park-near-panevezys", "augsdaugava-protected-landscape-near-daugavpils", "endla-nature-reserve-near-kohtla-jarve", "grazute-regional-park-near-panevezys", "krustkalni-nature-reserve-near-daugavpils", "labanoras-regional-park-near-panevezys", "lake-sartai-near-panevezys", "lake-tauragnas-near-panevezys", "muraka-nature-reserve-near-kohtla-jarve", "narva-reservoir-near-kohtla-jarve", "teici-nature-reserve-near-daugavpils", "lahemaa-national-park-near-tallinn", "lake-rekyva-near-siauliai", "soomaa-national-park-near-tallinn", "alutaguse-national-park-near-narva", "aukstadvaris-regional-park-near-alytus", "bartuva-river-near-liepaja", "kurtna-lake-district-near-narva", "lahemaa-national-park-near-narva", "lake-peipus-near-narva", "narva-bay-near-narva", "narva-joesuu-beach-near-narva", "ontika-landscape-conservation-area-near-narva", "plateliai-lake-near-liepaja", "trakai-historical-national-park-near-alytus"],
    featuredPlaces: ["alutaguse-national-park-near-kohtla-jarve", "anyksciai-regional-park-near-panevezys", "aukstaitija-national-park-near-daugavpils", "birzai-regional-park-near-panevezys", "lahemaa-national-park-near-kohtla-jarve", "razna-national-park-near-daugavpils"],
    featuredCities: ["daugavpils", "kohtla-jarve", "panevezys"],
    relatedCollections: ["latvia-lithuania-borderlands", "latvia-weekend-escapes", "weekend-escapes-near-tallinn", "weekend-escapes-near-vilnius", "estonia-finland-borderlands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "baltic-sea-coast",
    title: "Baltic Sea Coast",
    description:
      "Baltic Sea Coast groups 10 nearby places across 8 cities for local-first day and weekend discovery — mainly islands, beaches. This is a geographic discovery collection derived from a shared coastline; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "coastal_region",
    cities: ["helsinki", "lubeck", "parnu", "tallinn", "umea", "visby", "espoo", "schwerin"],
    nearbyPlaces: ["aegna-near-tallinn", "kihnu-near-parnu", "suomenlinna-helsinki", "travemunde-near-lubeck", "gotska-sandon-national-park-near-visby", "holmoarna-near-umea", "porkkalanniemi-near-espoo", "bay-of-wismar-near-schwerin", "boltenhagen-near-schwerin", "poel-near-schwerin"],
    featuredPlaces: ["aegna-near-tallinn", "gotska-sandon-national-park-near-visby", "holmoarna-near-umea", "kihnu-near-parnu", "suomenlinna-helsinki", "travemunde-near-lubeck"],
    featuredCities: ["helsinki", "lubeck", "parnu", "tallinn", "umea", "visby"],
    relatedCollections: ["estonia-finland-borderlands", "sweden-islands", "sweden-weekend-escapes", "weekend-escapes-near-tallinn", "european-coast", "european-islands", "finland-islands", "weekend-escapes-near-hamburg"],
  },
  {
    slug: "belgium-germany-borderlands",
    title: "Belgium–Germany Borderlands",
    description:
      "Belgium–Germany Borderlands groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["aachen", "antwerp", "bonn", "cologne", "dusseldorf", "hasselt", "liege", "saarbrucken", "gelsenkirchen", "hamm", "herne", "munster", "duisburg", "krefeld", "leverkusen"],
    nearbyPlaces: ["bokrijk-near-hasselt", "hautes-fagnes-nature-reserve-near-liege", "hoge-kempen-national-park-near-antwerp", "eifel-national-park-near-aachen", "hambach-forest-near-cologne", "neandertal-near-dusseldorf", "rhineland-nature-park-near-cologne", "saar-hunsruck-nature-park-near-saarbrucken", "saarschleife-near-saarbrucken", "siebengebirge-near-bonn", "bostalsee-near-saarbrucken", "hunsruck-hochwald-national-park-near-saarbrucken", "hurtgen-forest-near-aachen", "northern-vosges-regional-nature-park-near-saarbrucken", "rheinland-nature-park-near-aachen", "siebengebirge-near-aachen", "vesdre-near-aachen", "ardey-hills-near-gelsenkirchen", "arnsberg-forest-nature-park-near-hamm", "arnsberg-forest-nature-park-near-herne", "baumberge-near-munster", "bergisches-land-near-duisburg", "bergisches-land-near-gelsenkirchen", "bergisches-land-near-krefeld", "bergisches-land-near-leverkusen", "bergisches-land-near-mulheim-an-der-ruhr", "bergisches-land-near-neuss", "bergisches-land-near-solingen", "bergisches-land-near-wuppertal", "bigge-reservoir-near-herne"],
    featuredPlaces: ["bokrijk-near-hasselt", "eifel-national-park-near-aachen", "hambach-forest-near-cologne", "hautes-fagnes-nature-reserve-near-liege", "hoge-kempen-national-park-near-antwerp", "neandertal-near-dusseldorf", "rhineland-nature-park-near-cologne", "saar-hunsruck-nature-park-near-saarbrucken"],
    featuredCities: ["cologne", "saarbrucken", "aachen", "antwerp", "bonn", "dusseldorf"],
    relatedCollections: ["weekend-escapes-near-cologne", "germany-netherlands-borderlands", "belgium-netherlands-borderlands", "germany-luxembourg-borderlands", "central-europe-weekend-escapes", "weekend-escapes-near-antwerp", "france-germany-borderlands", "weekend-escapes-near-freiburg"],
  },
  {
    slug: "belgium-netherlands-borderlands",
    title: "Belgium–Netherlands Borderlands",
    description:
      "Belgium–Netherlands Borderlands groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["antwerp", "breda", "charleroi", "delft", "eindhoven", "hasselt", "liege", "maastricht", "nijmegen", "s-hertogenbosch", "zoetermeer", "aalst", "alphen-aan-den-rijn", "dordrecht", "ede"],
    nearbyPlaces: ["bokrijk-near-hasselt", "hautes-fagnes-nature-reserve-near-liege", "hoge-kempen-national-park-near-antwerp", "kalmthoutse-heide-near-antwerp", "nete-near-antwerp", "peerdsbos-near-antwerp", "sonian-forest-near-charleroi", "de-biesbosch-national-park-near-delft", "groote-peel-national-park-near-eindhoven", "de-loonse-en-drunense-duinen-national-park-near-s-hertogenbosch", "de-maasduinen-national-park-near-nijmegen", "mastbos-near-breda", "midden-delfland-near-delft", "sint-pietersberg-near-maastricht", "ardennes-near-charleroi", "de-maasduinen-national-park-near-s-hertogenbosch", "dommel-near-s-hertogenbosch", "het-groene-woud-near-s-hertogenbosch", "lesse-near-charleroi", "marche-les-dames-near-charleroi", "sambre-near-charleroi", "strabrechtse-heide-near-s-hertogenbosch", "ackerdijkse-plassen-near-zoetermeer", "berkheide-near-zoetermeer", "bourgoyen-ossemeersen-near-aalst", "de-biesbosch-national-park-near-alphen-aan-den-rijn", "de-biesbosch-national-park-near-dordrecht", "de-biesbosch-national-park-near-ede", "de-biesbosch-national-park-near-zoetermeer", "de-biesbosch-near-westland"],
    featuredPlaces: ["bokrijk-near-hasselt", "de-biesbosch-national-park-near-delft", "groote-peel-national-park-near-eindhoven", "de-loonse-en-drunense-duinen-national-park-near-s-hertogenbosch", "de-maasduinen-national-park-near-nijmegen", "hautes-fagnes-nature-reserve-near-liege", "hoge-kempen-national-park-near-antwerp", "kalmthoutse-heide-near-antwerp"],
    featuredCities: ["antwerp", "delft", "breda", "charleroi", "eindhoven", "hasselt"],
    relatedCollections: ["weekend-escapes-near-rotterdam", "weekend-escapes-near-antwerp", "netherlands-national-parks", "belgium-germany-borderlands", "germany-netherlands-borderlands", "weekend-escapes-near-arnhem", "western-europe-weekend-escapes", "weekend-escapes-near-bruges"],
  },
  {
    slug: "california-weekend-escapes",
    title: "California Weekend Escapes",
    description:
      "California Weekend Escapes groups 30 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas, lakes, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["los-angeles", "sacramento", "san-diego", "san-francisco", "oakland", "santa-rosa", "san-jose-us", "anaheim", "stockton", "riverside"],
    nearbyPlaces: ["folsom-lake-recreation-area-near-sacramento", "muir-woods-near-san-francisco", "point-reyes-near-san-francisco", "santa-monica-mountains-recreation-area-near-los-angeles", "torrey-pines-state-reserve-near-san-diego", "angel-island-near-oakland", "armstrong-redwoods-state-natural-reserve-near-santa-rosa", "big-basin-redwoods-state-park-near-san-jose-us", "bolsa-chica-ecological-reserve-near-anaheim", "calaveras-big-trees-state-park-near-stockton", "camanche-reservoir-near-stockton", "castle-rock-state-park-near-san-jose-us", "chino-hills-state-park-near-anaheim", "cleveland-national-forest-near-anaheim", "cleveland-national-forest-near-riverside", "cosumnes-river-preserve-near-stockton", "crystal-cove-state-park-near-anaheim", "irvine-regional-park-near-anaheim", "lake-chabot-near-oakland", "lake-perris-near-riverside", "lexington-reservoir-near-san-jose-us", "mount-hamilton-near-san-jose-us", "mount-saint-helena-near-santa-rosa", "muir-woods-national-monument-near-oakland", "pardee-reservoir-near-stockton", "point-reyes-national-seashore-near-oakland", "point-reyes-national-seashore-near-santa-rosa", "redwood-regional-park-near-oakland", "robert-louis-stevenson-state-park-near-santa-rosa", "san-bernardino-national-forest-near-riverside"],
    featuredPlaces: ["folsom-lake-recreation-area-near-sacramento", "muir-woods-near-san-francisco", "point-reyes-near-san-francisco", "santa-monica-mountains-recreation-area-near-los-angeles", "torrey-pines-state-reserve-near-san-diego"],
    featuredCities: ["san-francisco", "los-angeles", "sacramento", "san-diego"],
    relatedCollections: ["weekend-escapes-near-san-francisco", "united-states-national-parks", "weekend-escapes-near-los-angeles", "united-states-forests", "united-states-lakes", "united-states-mountains", "united-states-coast", "united-states-weekend-escapes"],
  },
  {
    slug: "canada-islands",
    title: "Canada Islands",
    description:
      "Canada Islands groups 9 nearby places across 9 cities for local-first day and weekend discovery — mainly islands. This is a geographic discovery collection derived from island geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "island_region",
    cities: ["laval", "nanaimo", "quebec-city", "st-johns", "toronto", "victoria", "windsor-ontario", "montreal", "sarnia"],
    nearbyPlaces: ["pelee-island-near-windsor-ontario", "salt-spring-island-near-victoria", "saysutshun-newcastle-island-marine-park-near-nanaimo", "toronto-islands-near-toronto", "witless-bay-ecological-reserve-near-st-johns", "ile-d-orleans-near-quebec-city", "iles-de-boucherville-national-park-near-laval", "iles-de-boucherville-national-park-near-montreal", "walpole-island-near-sarnia"],
    featuredPlaces: ["pelee-island-near-windsor-ontario", "salt-spring-island-near-victoria", "saysutshun-newcastle-island-marine-park-near-nanaimo", "toronto-islands-near-toronto", "witless-bay-ecological-reserve-near-st-johns", "ile-d-orleans-near-quebec-city", "iles-de-boucherville-national-park-near-laval"],
    featuredCities: ["laval", "nanaimo", "quebec-city", "st-johns", "toronto", "victoria"],
    relatedCollections: ["canada-united-states-borderlands", "weekend-escapes-near-vancouver", "canada-national-parks", "canada-weekend-escapes", "north-america-weekend-escapes", "weekend-escapes-near-montreal", "weekend-escapes-near-toronto", "canada-mountains"],
  },
  {
    slug: "canada-mountains",
    title: "Canada Mountains",
    description:
      "Canada Mountains groups 11 nearby places across 6 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["calgary", "nanaimo", "sherbrooke", "vancouver", "abbotsford", "banff"],
    nearbyPlaces: ["banff-national-park-near-calgary", "garibaldi-provincial-park-near-vancouver", "kananaskis-country-near-calgary", "mont-orford-national-park-near-sherbrooke", "mount-benson-near-nanaimo", "mount-seymour-provincial-park-near-vancouver", "peter-lougheed-provincial-park-near-calgary", "spray-valley-provincial-park-near-calgary", "mount-baker-near-abbotsford", "sumas-mountain-near-abbotsford", "mount-rundle-near-banff"],
    featuredPlaces: ["banff-national-park-near-calgary", "garibaldi-provincial-park-near-vancouver", "kananaskis-country-near-calgary", "mont-orford-national-park-near-sherbrooke", "mount-benson-near-nanaimo", "mount-seymour-provincial-park-near-vancouver", "peter-lougheed-provincial-park-near-calgary", "spray-valley-provincial-park-near-calgary"],
    featuredCities: ["calgary", "vancouver", "nanaimo", "sherbrooke"],
    relatedCollections: ["canada-weekend-escapes", "weekend-escapes-near-vancouver", "canada-national-parks", "weekend-escapes-near-montreal", "canada-islands", "canada-protected-landscapes", "canada-united-states-borderlands", "australia-mountains"],
  },
  {
    slug: "canada-national-parks",
    title: "Canada National Parks",
    description:
      "Canada National Parks groups 19 nearby places across 13 cities for local-first day and weekend discovery — mainly nature areas, mountains, parks. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["calgary", "charlottetown", "edmonton", "gatineau", "halifax", "laval", "montreal", "saskatoon", "sherbrooke", "winnipeg", "longueuil", "banff", "cornwall"],
    nearbyPlaces: ["banff-national-park-near-calgary", "elk-island-national-park-near-edmonton", "kejimkujik-national-park-near-halifax", "mont-orford-national-park-near-sherbrooke", "mont-tremblant-national-park-near-montreal", "oka-national-park-near-laval", "plaisance-national-park-near-gatineau", "prince-albert-national-park-near-saskatoon", "prince-edward-island-national-park-near-charlottetown", "riding-mountain-national-park-near-winnipeg", "iles-de-boucherville-national-park-near-laval", "mont-saint-bruno-national-park-near-laval", "iles-de-boucherville-national-park-near-montreal", "oka-national-park-near-montreal", "yamaska-national-park-near-longueuil", "banff-national-park-near-banff", "kootenay-national-park-near-banff", "plaisance-national-park-near-cornwall", "yoho-national-park-near-banff"],
    featuredPlaces: ["banff-national-park-near-calgary", "elk-island-national-park-near-edmonton", "kejimkujik-national-park-near-halifax", "mont-orford-national-park-near-sherbrooke", "mont-tremblant-national-park-near-montreal", "oka-national-park-near-laval", "plaisance-national-park-near-gatineau", "prince-albert-national-park-near-saskatoon"],
    featuredCities: ["laval", "calgary", "charlottetown", "edmonton", "gatineau", "halifax"],
    relatedCollections: ["weekend-escapes-near-montreal", "canada-weekend-escapes", "canada-mountains", "north-america-weekend-escapes", "canada-islands", "canada-united-states-borderlands", "australia-national-parks", "finland-national-parks"],
  },
  {
    slug: "canada-protected-landscapes",
    title: "Canada Protected Landscapes",
    description:
      "Canada Protected Landscapes groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly parks, nature areas. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["brampton", "burnaby", "kelowna", "markham", "mississauga", "ottawa", "regina", "sudbury", "surrey", "thunder-bay", "vancouver", "vaughan", "victoria", "yellowknife"],
    nearbyPlaces: ["belcarra-regional-park-near-burnaby", "boyd-conservation-area-near-vaughan", "bronte-creek-provincial-park-near-mississauga", "campbell-valley-regional-park-near-surrey", "forks-of-the-credit-provincial-park-near-brampton", "foy-provincial-park-near-ottawa", "fred-henne-territorial-park-near-yellowknife", "gatineau-park-near-ottawa", "goldstream-provincial-park-near-victoria", "killarney-provincial-park-near-sudbury", "last-mountain-lake-national-wildlife-area-near-regina", "lynn-canyon-park-near-vancouver", "mer-bleue-bog-near-ottawa", "okanagan-mountain-park-near-kelowna", "pacific-spirit-regional-park-near-burnaby", "rouge-national-urban-park-near-markham", "sibbald-point-provincial-park-near-markham", "sleeping-giant-provincial-park-near-thunder-bay", "albion-hills-conservation-area-near-brampton", "albion-hills-conservation-area-near-markham", "albion-hills-conservation-area-near-vaughan", "bruce-s-mill-conservation-area-near-markham", "bruce-s-mill-conservation-area-near-vaughan", "cold-creek-conservation-area-near-markham", "crawford-lake-conservation-area-near-mississauga", "cultus-lake-provincial-park-near-surrey", "cypress-provincial-park-near-surrey", "forks-of-the-credit-provincial-park-near-vaughan", "heart-lake-conservation-area-near-brampton", "hilton-falls-conservation-area-near-mississauga"],
    featuredPlaces: ["belcarra-regional-park-near-burnaby", "boyd-conservation-area-near-vaughan", "bronte-creek-provincial-park-near-mississauga", "campbell-valley-regional-park-near-surrey", "forks-of-the-credit-provincial-park-near-brampton", "foy-provincial-park-near-ottawa", "fred-henne-territorial-park-near-yellowknife", "gatineau-park-near-ottawa"],
    featuredCities: ["ottawa", "burnaby", "markham", "brampton", "kelowna", "mississauga"],
    relatedCollections: ["north-america-protected-landscapes", "weekend-escapes-near-toronto", "weekend-escapes-near-vancouver", "north-america-weekend-escapes", "canada-weekend-escapes", "weekend-escapes-near-montreal", "canada-united-states-borderlands", "canada-islands"],
  },
  {
    slug: "canada-united-states-borderlands",
    title: "Canada–United States Borderlands",
    description:
      "Canada–United States Borderlands groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly waterfronts, lakes, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["bellingham", "buffalo", "burlington-vt", "kitchener", "rochester", "seattle", "sherbrooke", "surrey", "tacoma", "toronto", "victoria", "st-catharines", "abbotsford", "chilliwack"],
    nearbyPlaces: ["boundary-bay-near-surrey", "goldstream-provincial-park-near-victoria", "grand-river-near-kitchener", "lake-memphremagog-near-sherbrooke", "mount-douglas-near-victoria", "niagara-falls-near-toronto", "salt-spring-island-near-victoria", "toronto-islands-near-toronto", "deception-pass-state-park-near-seattle", "hamlin-beach-state-park-near-rochester", "lake-champlain-near-burlington-vt", "larrabee-state-park-near-bellingham", "niagara-falls-state-park-near-buffalo", "olympic-national-park-near-tacoma", "buntzen-lake-near-surrey", "chimney-bluffs-state-park-near-rochester", "cultus-lake-provincial-park-near-surrey", "cypress-provincial-park-near-surrey", "federation-forest-state-park-near-tacoma", "flaming-geyser-state-park-near-tacoma", "mendon-ponds-park-near-rochester", "montezuma-national-wildlife-refuge-near-rochester", "point-defiance-park-near-tacoma", "stony-brook-state-park-near-rochester", "vashon-island-near-tacoma", "ball-s-falls-near-st-catharines", "bridal-veil-falls-provincial-park-near-abbotsford", "bridal-veil-falls-provincial-park-near-chilliwack", "chilliwack-lake-near-chilliwack", "chilliwack-lake-provincial-park-near-abbotsford"],
    featuredPlaces: ["boundary-bay-near-surrey", "deception-pass-state-park-near-seattle", "goldstream-provincial-park-near-victoria", "grand-river-near-kitchener", "hamlin-beach-state-park-near-rochester", "lake-champlain-near-burlington-vt", "lake-memphremagog-near-sherbrooke", "larrabee-state-park-near-bellingham"],
    featuredCities: ["victoria", "toronto", "bellingham", "buffalo", "burlington-vt", "kitchener"],
    relatedCollections: ["weekend-escapes-near-vancouver", "united-states-coast", "weekend-escapes-near-seattle", "canada-islands", "weekend-escapes-near-toronto", "canada-protected-landscapes", "united-states-national-parks", "united-states-weekend-escapes"],
  },
  {
    slug: "canada-weekend-escapes",
    title: "Canada Weekend Escapes",
    description:
      "Canada Weekend Escapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["calgary", "charlottetown", "edmonton", "halifax", "kamloops", "kelowna", "kitchener", "longueuil", "mississauga", "montreal", "prince-george", "st-johns", "sudbury", "thunder-bay", "whitehorse"],
    nearbyPlaces: ["banff-national-park-near-calgary", "elk-island-national-park-near-edmonton", "elora-gorge-near-kitchener", "emerald-lake-near-whitehorse", "forks-of-the-credit-provincial-park-near-mississauga", "french-river-near-sudbury", "grand-river-near-kitchener", "kananaskis-country-near-calgary", "kejimkujik-national-park-near-halifax", "killarney-provincial-park-near-sudbury", "lac-le-jeune-provincial-park-near-kamloops", "lake-superior-national-marine-conservation-area-near-thunder-bay", "miles-canyon-near-whitehorse", "nechako-river-near-prince-george", "oka-national-park-near-longueuil", "okanagan-mountain-park-near-kelowna", "peter-lougheed-provincial-park-near-calgary", "plaisance-national-park-near-montreal", "prince-edward-island-national-park-near-charlottetown", "signal-hill-near-st-johns", "sleeping-giant-provincial-park-near-thunder-bay", "spray-valley-provincial-park-near-calgary", "witless-bay-ecological-reserve-near-st-johns", "iles-de-boucherville-national-park-near-longueuil", "crawford-lake-conservation-area-near-mississauga", "hilton-falls-conservation-area-near-mississauga", "mont-orford-national-park-near-longueuil", "mont-rougemont-near-longueuil", "mont-saint-bruno-national-park-near-longueuil", "rattray-marsh-conservation-area-near-mississauga"],
    featuredPlaces: ["banff-national-park-near-calgary", "elk-island-national-park-near-edmonton", "elora-gorge-near-kitchener", "emerald-lake-near-whitehorse", "forks-of-the-credit-provincial-park-near-mississauga", "french-river-near-sudbury", "grand-river-near-kitchener", "kananaskis-country-near-calgary"],
    featuredCities: ["calgary", "kitchener", "longueuil", "st-johns", "sudbury", "thunder-bay"],
    relatedCollections: ["canada-national-parks", "canada-protected-landscapes", "canada-mountains", "canada-islands", "canada-united-states-borderlands", "weekend-escapes-near-montreal", "weekend-escapes-near-toronto", "north-america-protected-landscapes"],
  },
  {
    slug: "carpathians",
    title: "Carpathians",
    description:
      "Carpathians groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["baia-mare", "brno", "cluj-napoca", "iasi", "krakow", "chorzow", "ploiesti", "tychy", "ramnicu-valcea", "bacau", "suceava", "zlin", "buzau", "rybnik", "targu-mures"],
    nearbyPlaces: ["white-carpathians-near-brno", "beskids-near-krakow", "ceahlau-massif-near-iasi", "fagaras-mountains-near-cluj-napoca", "rodna-mountains-near-baia-mare", "babia-gora-national-park-near-chorzow", "baiu-mountains-near-ploiesti", "beskid-mountains-near-tychy", "capatanii-mountains-near-ramnicu-valcea", "ceahlau-massif-near-bacau", "ceahlau-massif-near-suceava", "chriby-near-zlin", "ciucas-mountains-near-buzau", "ciucas-mountains-near-ploiesti", "czantoria-wielka-near-rybnik", "fagaras-mountains-near-ramnicu-valcea", "gurghiu-mountains-near-targu-mures", "gutai-mountains-near-satu-mare", "harghita-mountains-near-targu-mures", "hostyn-vsetin-mountains-near-zlin", "iezer-mountains-near-pitesti", "little-beskids-near-bielsko-biala", "little-beskids-near-chorzow", "little-beskids-near-ruda-slaska", "little-beskids-near-tychy", "lotru-mountains-near-ramnicu-valcea", "maple-mountains-javorniky-near-zlin", "piatra-craiului-national-park-near-bucharest", "piatra-mare-mountains-near-ploiesti", "rarau-massif-near-suceava"],
    featuredPlaces: ["beskids-near-krakow", "ceahlau-massif-near-iasi", "fagaras-mountains-near-cluj-napoca", "rodna-mountains-near-baia-mare", "white-carpathians-near-brno"],
    featuredCities: ["baia-mare", "brno", "cluj-napoca", "iasi", "krakow"],
    relatedCollections: ["romania-mountains", "weekend-escapes-near-cluj-napoca", "czechia-mountains", "poland-mountains", "czechia-slovakia-borderlands", "hungary-poland-borderlands", "poland-slovakia-borderlands", "romania-weekend-escapes"],
  },
  {
    slug: "central-europe-mountains",
    title: "Central Europe Mountains",
    description:
      "Central Europe Mountains groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["celje", "hradec-kralove", "kielce", "magdeburg", "opole", "villach", "braunschweig", "rybnik", "walbrzych", "legnica", "pardubice", "halle", "bielsko-biala", "chorzow", "ruda-slaska"],
    nearbyPlaces: ["dobratsch-near-villach", "orlicke-mountains-near-hradec-kralove", "harz-near-magdeburg", "saint-anne-mountain-near-opole", "swietokrzyskie-mountains-near-kielce", "kamniksavinja-alps-near-celje", "pohorje-near-celje", "brocken-near-magdeburg", "donacka-gora-near-celje", "julian-alps-near-villach", "kuneticka-hora-near-hradec-kralove", "asse-near-braunschweig", "brocken-near-braunschweig", "czantoria-wielka-near-rybnik", "elm-near-braunschweig", "giant-mountains-near-walbrzych", "kaczawskie-mountains-near-legnica", "krkonose-national-park-near-pardubice", "kuneticka-hora-near-pardubice", "kyffhauser-near-halle", "little-beskids-near-bielsko-biala", "little-beskids-near-chorzow", "little-beskids-near-ruda-slaska", "little-beskids-near-tychy", "owl-mountains-near-walbrzych", "petersberg-near-halle", "pohorje-near-maribor", "silesian-beskids-near-bielsko-biala", "silesian-beskids-near-rybnik", "silesian-beskids-near-tychy"],
    featuredPlaces: ["dobratsch-near-villach", "harz-near-magdeburg", "kamniksavinja-alps-near-celje", "orlicke-mountains-near-hradec-kralove", "pohorje-near-celje", "saint-anne-mountain-near-opole", "swietokrzyskie-mountains-near-kielce"],
    featuredCities: ["celje", "hradec-kralove", "kielce", "magdeburg", "opole", "villach"],
    relatedCollections: ["central-europe-weekend-escapes", "austria-slovenia-borderlands", "poland-mountains", "czechia-poland-borderlands", "european-mountains", "croatia-slovenia-borderlands", "weekend-escapes-near-ljubljana", "austria-mountains"],
  },
  {
    slug: "central-europe-weekend-escapes",
    title: "Central Europe Weekend Escapes",
    description:
      "Central Europe Weekend Escapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["aachen", "bochum", "celje", "chemnitz", "czestochowa", "hradec-kralove", "kassel", "kielce", "magdeburg", "miskolc", "opole", "presov", "saarbrucken", "sankt-polten", "villach"],
    nearbyPlaces: ["dobratsch-near-villach", "dunkelsteinerwald-near-sankt-polten", "lake-faak-near-villach", "wachau-near-sankt-polten", "adrspach-teplice-rocks-near-hradec-kralove", "orlicke-mountains-near-hradec-kralove", "arnsberg-forest-nature-park-near-bochum", "eifel-national-park-near-aachen", "harz-near-magdeburg", "hohe-mark-nature-park-near-bochum", "kellerwald-edersee-national-park-near-kassel", "middle-elbe-biosphere-reserve-near-magdeburg", "ore-mountains-vogtland-nature-park-near-chemnitz", "reinhardswald-near-kassel", "rur-reservoir-near-aachen", "saar-hunsruck-nature-park-near-saarbrucken", "saarschleife-near-saarbrucken", "zschopau-near-chemnitz", "aggtelek-national-park-near-miskolc", "bukk-national-park-near-miskolc", "ojcow-national-park-near-czestochowa", "opawskie-mountains-landscape-park-near-opole", "saint-anne-mountain-near-opole", "swietokrzyski-national-park-near-kielce", "swietokrzyskie-mountains-near-kielce", "pieniny-national-park-near-presov", "slovak-paradise-national-park-near-presov", "kamniksavinja-alps-near-celje", "pohorje-near-celje", "bergisches-land-near-bochum"],
    featuredPlaces: ["adrspach-teplice-rocks-near-hradec-kralove", "aggtelek-national-park-near-miskolc", "arnsberg-forest-nature-park-near-bochum", "bukk-national-park-near-miskolc", "dobratsch-near-villach", "dunkelsteinerwald-near-sankt-polten", "eifel-national-park-near-aachen", "harz-near-magdeburg"],
    featuredCities: ["aachen", "bochum", "celje", "chemnitz", "hradec-kralove", "kassel"],
    relatedCollections: ["central-europe-mountains", "weekend-escapes-near-cologne", "weekend-escapes-near-graz", "austria-slovenia-borderlands", "czechia-poland-borderlands", "belgium-germany-borderlands", "czechia-germany-borderlands", "germany-luxembourg-borderlands"],
  },
  {
    slug: "croatia-mountains",
    title: "Croatia Mountains",
    description:
      "Croatia Mountains groups 11 nearby places across 7 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["rijeka", "split", "zagreb", "dubrovnik", "osijek", "pula", "zadar"],
    nearbyPlaces: ["biokovo-nature-park-near-split", "medvednica-nature-park-near-zagreb", "mosor-near-split", "papuk-nature-park-near-zagreb", "risnjak-national-park-near-rijeka", "biokovo-near-dubrovnik", "dilj-near-osijek", "papuk-near-osijek", "risnjak-national-park-near-zagreb", "ucka-near-pula", "velebit-near-zadar"],
    featuredPlaces: ["biokovo-nature-park-near-split", "medvednica-nature-park-near-zagreb", "mosor-near-split", "papuk-nature-park-near-zagreb", "risnjak-national-park-near-rijeka"],
    featuredCities: ["split", "zagreb", "rijeka"],
    relatedCollections: ["weekend-escapes-near-zagreb", "croatia-slovenia-borderlands", "weekend-escapes-near-dubrovnik", "european-islands", "australia-mountains", "austria-mountains", "canada-mountains", "carpathians"],
  },
  {
    slug: "croatia-slovenia-borderlands",
    title: "Croatia–Slovenia Borderlands",
    description:
      "Croatia–Slovenia Borderlands groups 29 nearby places across 9 cities for local-first day and weekend discovery — mainly mountains, nature areas. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["celje", "ljubljana", "rijeka", "zagreb", "osijek", "maribor", "pula", "koper", "zadar"],
    nearbyPlaces: ["medvednica-nature-park-near-zagreb", "risnjak-national-park-near-rijeka", "kamniksavinja-alps-near-celje", "pohorje-near-celje", "vipava-valley-near-ljubljana", "donacka-gora-near-celje", "savinja-near-celje", "lonjsko-polje-near-osijek", "pohorje-near-maribor", "risnjak-national-park-near-zagreb", "brijuni-national-park-near-pula", "cape-kamenjak-near-pula", "cres-near-pula", "karst-plateau-near-koper", "kvarner-gulf-near-pula", "lake-cerknica-near-koper", "lake-vrana-cres-near-pula", "lim-bay-near-pula", "losinj-near-pula", "nanos-near-koper", "northern-velebit-national-park-near-zadar", "plitvice-lakes-national-park-near-zadar", "postojna-cave-near-koper", "skocjan-caves-near-koper", "slavnik-near-koper", "triglav-national-park-near-koper", "ucka-near-koper", "ucka-near-pula", "velebit-near-zadar"],
    featuredPlaces: ["kamniksavinja-alps-near-celje", "medvednica-nature-park-near-zagreb", "pohorje-near-celje", "risnjak-national-park-near-rijeka", "vipava-valley-near-ljubljana"],
    featuredCities: ["celje", "ljubljana", "rijeka", "zagreb"],
    relatedCollections: ["austria-slovenia-borderlands", "weekend-escapes-near-ljubljana", "italy-slovenia-borderlands", "croatia-mountains", "european-mountains", "weekend-escapes-near-zagreb", "central-europe-mountains", "central-europe-weekend-escapes"],
  },
  {
    slug: "czechia-germany-borderlands",
    title: "Czechia–Germany Borderlands",
    description:
      "Czechia–Germany Borderlands groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, mountains. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["ceske-budejovice", "chemnitz", "dresden", "gorlitz", "hradec-kralove", "karlovy-vary", "leipzig", "liberec", "nuremberg", "passau", "potsdam", "prague", "pardubice", "ingolstadt", "plzen"],
    nearbyPlaces: ["adrspach-teplice-rocks-near-hradec-kralove", "bohemian-switzerland-near-prague", "jested-near-liberec", "koneprusy-caves-near-prague", "slavkov-forest-near-karlovy-vary", "trebon-basin-near-ceske-budejovice", "bavarian-forest-near-passau", "bavarian-forest-national-park-near-passau", "dresden-heath-near-dresden", "franconian-switzerland-near-nuremberg", "leipzig-riverside-forest-near-leipzig", "lusatian-mountains-near-dresden", "ore-mountains-near-dresden", "ore-mountains-vogtland-nature-park-near-chemnitz", "pegnitz-valley-near-nuremberg", "saxon-switzerland-national-park-near-dresden", "spreewald-near-potsdam", "zittau-mountains-near-gorlitz", "zschopau-near-chemnitz", "broumovsko-protected-landscape-area-near-hradec-kralove", "dubener-heide-nature-park-near-chemnitz", "floha-near-chemnitz", "kuneticka-hora-near-hradec-kralove", "orlice-near-hradec-kralove", "prachov-rocks-near-hradec-kralove", "saxon-switzerland-national-park-near-chemnitz", "tharandt-forest-near-chemnitz", "adrspach-teplice-rocks-near-pardubice", "altmuhl-valley-nature-park-near-ingolstadt", "berounka-near-plzen"],
    featuredPlaces: ["adrspach-teplice-rocks-near-hradec-kralove", "bavarian-forest-near-passau", "bavarian-forest-national-park-near-passau", "bohemian-switzerland-near-prague", "dresden-heath-near-dresden", "franconian-switzerland-near-nuremberg", "jested-near-liberec", "koneprusy-caves-near-prague"],
    featuredCities: ["dresden", "chemnitz", "nuremberg", "passau", "prague", "ceske-budejovice"],
    relatedCollections: ["weekend-escapes-near-berlin", "germany-mountains", "weekend-escapes-near-prague", "weekend-escapes-near-munich", "czechia-poland-borderlands", "germany-forests", "germany-poland-borderlands", "central-europe-weekend-escapes"],
  },
  {
    slug: "czechia-mountains",
    title: "Czechia Mountains",
    description:
      "Czechia Mountains groups 25 nearby places across 11 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["brno", "hradec-kralove", "karlovy-vary", "liberec", "ostrava", "plzen", "zlin", "pardubice", "usti-nad-labem", "decin", "jihlava"],
    nearbyPlaces: ["beskydy-protected-area-near-ostrava", "jested-near-liberec", "ore-mountains-near-karlovy-vary", "orlicke-mountains-near-hradec-kralove", "white-carpathians-near-brno", "kuneticka-hora-near-hradec-kralove", "brdy-near-plzen", "chriby-near-zlin", "hostyn-vsetin-mountains-near-zlin", "krkonose-national-park-near-pardubice", "kuneticka-hora-near-pardubice", "lusatian-mountains-near-usti-nad-labem", "maple-mountains-javorniky-near-zlin", "milesovka-near-usti-nad-labem", "ore-mountains-near-usti-nad-labem", "slavkov-forest-near-plzen", "velka-javorina-near-zlin", "white-carpathians-near-zlin", "decinsky-sneznik-near-decin", "elbe-sandstone-mountains-near-decin", "iron-mountains-near-jihlava", "javorice-near-jihlava", "jizera-mountains-near-decin", "lusatian-mountains-near-decin", "zdarske-vrchy-near-jihlava"],
    featuredPlaces: ["beskydy-protected-area-near-ostrava", "jested-near-liberec", "ore-mountains-near-karlovy-vary", "orlicke-mountains-near-hradec-kralove", "white-carpathians-near-brno"],
    featuredCities: ["brno", "hradec-kralove", "karlovy-vary", "liberec", "ostrava"],
    relatedCollections: ["czechia-poland-borderlands", "weekend-escapes-near-prague", "czechia-slovakia-borderlands", "weekend-escapes-near-brno", "czechia-germany-borderlands", "carpathians", "central-europe-mountains", "central-europe-weekend-escapes"],
  },
  {
    slug: "czechia-poland-borderlands",
    title: "Czechia–Poland Borderlands",
    description:
      "Czechia–Poland Borderlands groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains, nature areas, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["brno", "hradec-kralove", "liberec", "olomouc", "opole", "ostrava", "prague", "wroclaw", "pardubice", "bielsko-biala", "chorzow", "kalisz", "dabrowa-gornicza", "sosnowiec", "zlin"],
    nearbyPlaces: ["adrspach-teplice-rocks-near-hradec-kralove", "beskydy-protected-area-near-ostrava", "bohemian-switzerland-near-prague", "jested-near-liberec", "litovelske-pomoravi-near-olomouc", "macocha-gorge-near-brno", "orlicke-mountains-near-hradec-kralove", "barycz-valley-landscape-park-near-wroclaw", "giant-mountains-national-park-near-wroclaw", "opawskie-mountains-landscape-park-near-opole", "saint-anne-mountain-near-opole", "stolowe-mountains-national-park-near-wroclaw", "sleza-landscape-park-near-wroclaw", "broumovsko-protected-landscape-area-near-hradec-kralove", "kuneticka-hora-near-hradec-kralove", "orlice-near-hradec-kralove", "otmuchow-lake-near-opole", "owl-mountains-landscape-park-near-opole", "prachov-rocks-near-hradec-kralove", "stoowe-mountains-national-park-near-opole", "zaecze-landscape-park-near-opole", "adrspach-teplice-rocks-near-pardubice", "babia-gora-national-park-near-bielsko-biala", "babia-gora-national-park-near-chorzow", "barycz-valley-landscape-park-near-kalisz", "bedow-desert-near-dabrowa-gornicza", "bedow-desert-near-sosnowiec", "beskydy-protected-landscape-area-near-zlin", "bobr-valley-landscape-park-near-legnica", "bobr-valley-landscape-park-near-walbrzych"],
    featuredPlaces: ["adrspach-teplice-rocks-near-hradec-kralove", "barycz-valley-landscape-park-near-wroclaw", "beskydy-protected-area-near-ostrava", "bohemian-switzerland-near-prague", "giant-mountains-national-park-near-wroclaw", "jested-near-liberec", "litovelske-pomoravi-near-olomouc", "macocha-gorge-near-brno"],
    featuredCities: ["wroclaw", "hradec-kralove", "opole", "brno", "liberec", "olomouc"],
    relatedCollections: ["weekend-escapes-near-prague", "central-europe-weekend-escapes", "poland-mountains", "czechia-mountains", "czechia-germany-borderlands", "weekend-escapes-near-pozna", "weekend-escapes-near-brno", "czechia-slovakia-borderlands"],
  },
  {
    slug: "czechia-slovakia-borderlands",
    title: "Czechia–Slovakia Borderlands",
    description:
      "Czechia–Slovakia Borderlands groups 30 nearby places across 11 cities for local-first day and weekend discovery — mainly nature areas, mountains. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["banska-bystrica", "bratislava", "brno", "ostrava", "zilina", "zlin", "pardubice", "poprad", "jihlava", "decin", "nitra"],
    nearbyPlaces: ["beskydy-protected-area-near-ostrava", "macocha-gorge-near-brno", "moravian-karst-near-brno", "podyji-national-park-near-brno", "white-carpathians-near-brno", "devinska-kobyla-near-bratislava", "little-carpathians-near-bratislava", "mala-fatra-national-park-near-zilina", "sulov-rocks-near-zilina", "velka-fatra-near-banska-bystrica", "beskydy-protected-landscape-area-near-zlin", "chriby-near-zlin", "hostyn-vsetin-mountains-near-zlin", "iron-mountains-near-pardubice", "kuneticka-hora-near-pardubice", "maple-mountains-javorniky-near-zlin", "sec-reservoir-near-pardubice", "velka-javorina-near-zlin", "white-carpathians-near-zlin", "zdar-hills-near-pardubice", "belianske-tatras-near-poprad", "bohemian-moravian-highlands-near-jihlava", "dalesice-reservoir-near-jihlava", "dunajec-river-gorge-near-poprad", "gerlachovsky-stit-near-poprad", "high-tatras-near-poprad", "iron-mountains-near-jihlava", "javorice-near-jihlava", "jizera-mountains-near-decin", "little-carpathians-near-nitra"],
    featuredPlaces: ["beskydy-protected-area-near-ostrava", "devinska-kobyla-near-bratislava", "little-carpathians-near-bratislava", "macocha-gorge-near-brno", "mala-fatra-national-park-near-zilina", "moravian-karst-near-brno", "podyji-national-park-near-brno", "sulov-rocks-near-zilina"],
    featuredCities: ["brno", "bratislava", "zilina", "banska-bystrica", "ostrava"],
    relatedCollections: ["weekend-escapes-near-bratislava", "weekend-escapes-near-brno", "poland-slovakia-borderlands", "european-mountains", "czechia-poland-borderlands", "czechia-mountains", "austria-czechia-borderlands", "carpathians"],
  },
  {
    slug: "denmark-germany-borderlands",
    title: "Denmark–Germany Borderlands",
    description:
      "Denmark–Germany Borderlands groups 30 nearby places across 12 cities for local-first day and weekend discovery — mainly waterfronts, islands, nature areas. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["copenhagen", "esbjerg", "flensburg", "kiel", "odense", "rostock", "vejle", "frederiksberg", "kolding", "stralsund", "schwerin", "helsingor"],
    nearbyPlaces: ["fano-near-esbjerg", "stevns-klint-near-copenhagen", "svanninge-bakker-near-odense", "vejle-fjord-near-vejle", "fischland-darss-zingst-near-rostock", "flensburg-fjord-near-flensburg", "holstein-switzerland-near-kiel", "endelave-near-vejle", "grejs-river-near-vejle", "little-belt-near-vejle", "skamlingsbanken-near-vejle", "fures-near-frederiksberg", "gribskov-near-frederiksberg", "jgersborg-dyrehave-the-deer-park-near-frederiksberg", "kalvebod-flled-near-frederiksberg", "lake-esrum-near-frederiksberg", "mlleaen-near-frederiksberg", "roskilde-near-copenhagen", "als-near-kolding", "bay-of-greifswald-near-stralsund", "bay-of-wismar-near-schwerin", "boltenhagen-near-schwerin", "endelave-near-kolding", "fan-near-kolding", "gribskov-near-helsingor", "hallands-vadero-near-helsingor", "hiddensee-near-stralsund", "jasmund-national-park-near-stralsund", "kongernes-nordsjaelland-national-park-near-helsingor", "kullaberg-near-helsingor"],
    featuredPlaces: ["fano-near-esbjerg", "fischland-darss-zingst-near-rostock", "flensburg-fjord-near-flensburg", "holstein-switzerland-near-kiel", "stevns-klint-near-copenhagen", "svanninge-bakker-near-odense", "vejle-fjord-near-vejle"],
    featuredCities: ["copenhagen", "esbjerg", "flensburg", "kiel", "odense", "rostock"],
    relatedCollections: ["germany-weekend-escapes", "weekend-escapes-near-aarhus", "denmark-sweden-borderlands", "european-islands", "northern-europe-weekend-escapes", "weekend-escapes-near-hamburg", "austria-czechia-borderlands", "austria-germany-borderlands"],
  },
  {
    slug: "denmark-sweden-borderlands",
    title: "Denmark–Sweden Borderlands",
    description:
      "Denmark–Sweden Borderlands groups 30 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, beaches. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["copenhagen", "helsingborg", "malmo", "roskilde", "frederiksberg", "halmstad", "vaxjo", "kolding", "helsingor", "karlskrona"],
    nearbyPlaces: ["gribskov-near-copenhagen", "hareskoven-near-copenhagen", "roskilde-fjord-near-roskilde", "stevns-klint-near-copenhagen", "dalby-soderskog-national-park-near-malmo", "falsterbo-near-malmo", "kullaberg-near-malmo", "soderasen-national-park-near-helsingborg", "oresund-near-helsingborg", "fures-near-frederiksberg", "gribskov-near-frederiksberg", "hallands-vadero-near-halmstad", "hallandsasen-near-halmstad", "jgersborg-dyrehave-the-deer-park-near-frederiksberg", "kalvebod-flled-near-frederiksberg", "lake-bolmen-near-vaxjo", "lake-esrum-near-frederiksberg", "mlleaen-near-frederiksberg", "nissan-river-near-halmstad", "roskilde-near-copenhagen", "soderasen-national-park-near-halmstad", "soderasen-national-park-near-malmo", "tylosand-near-halmstad", "endelave-near-kolding", "gribskov-near-helsingor", "hallands-vadero-near-helsingor", "hano-bay-near-karlskrona", "hano-near-karlskrona", "ivo-lake-near-karlskrona", "kongernes-nordsjaelland-national-park-near-helsingor"],
    featuredPlaces: ["dalby-soderskog-national-park-near-malmo", "falsterbo-near-malmo", "gribskov-near-copenhagen", "hareskoven-near-copenhagen", "kullaberg-near-malmo", "roskilde-fjord-near-roskilde", "stevns-klint-near-copenhagen", "soderasen-national-park-near-helsingborg"],
    featuredCities: ["copenhagen", "malmo", "helsingborg", "roskilde"],
    relatedCollections: ["weekend-escapes-near-malm", "sweden-national-parks", "denmark-germany-borderlands", "european-coast", "weekend-escapes-near-aarhus", "austria-czechia-borderlands", "austria-germany-borderlands", "austria-italy-borderlands"],
  },
  {
    slug: "eastern-alps",
    title: "Eastern Alps",
    description:
      "Eastern Alps groups 18 nearby places across 13 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["bolzano", "celje", "innsbruck", "klagenfurt", "verona", "vicenza", "brescia", "maribor", "belluno", "mantua", "varese", "monza", "koper"],
    nearbyPlaces: ["karawanks-near-klagenfurt", "karwendel-near-innsbruck", "dolomites-near-bolzano", "lessinia-regional-park-near-verona", "kamniksavinja-alps-near-celje", "donacka-gora-near-celje", "asiago-plateau-near-vicenza", "cima-palon-pasubio-near-vicenza", "lessinia-near-vicenza", "monte-maddalena-near-brescia", "pohorje-near-maribor", "antelao-near-belluno", "monte-baldo-near-mantua", "monte-civetta-near-belluno", "monte-generoso-near-varese", "monte-pelmo-near-belluno", "resegone-near-monza", "slavnik-near-koper"],
    featuredPlaces: ["dolomites-near-bolzano", "kamniksavinja-alps-near-celje", "karawanks-near-klagenfurt", "karwendel-near-innsbruck", "lessinia-regional-park-near-verona"],
    featuredCities: ["bolzano", "celje", "innsbruck", "klagenfurt", "verona"],
    relatedCollections: ["austria-italy-borderlands", "austria-mountains", "italy-mountains", "austria-slovenia-borderlands", "central-europe-mountains", "european-mountains", "austria-germany-borderlands", "central-europe-weekend-escapes"],
  },
  {
    slug: "estonia-finland-borderlands",
    title: "Estonia–Finland Borderlands",
    description:
      "Estonia–Finland Borderlands groups 27 nearby places across 6 cities for local-first day and weekend discovery — mainly islands, parks, nature areas. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["helsinki", "kohtla-jarve", "tallinn", "vantaa", "espoo", "narva"],
    nearbyPlaces: ["aegna-near-tallinn", "lahemaa-national-park-near-kohtla-jarve", "nuuksio-national-park-near-helsinki", "sipoonkorpi-national-park-near-vantaa", "suomenlinna-helsinki", "tammisaari-archipelago-national-park-near-helsinki", "endla-nature-reserve-near-kohtla-jarve", "lake-tuusula-near-vantaa", "liesjarvi-national-park-near-vantaa", "muraka-nature-reserve-near-kohtla-jarve", "narva-reservoir-near-kohtla-jarve", "vantaanjoki-near-vantaa", "lahemaa-national-park-near-tallinn", "liesjarvi-national-park-near-espoo", "lohjanjarvi-near-espoo", "nuuksio-national-park-near-espoo", "porkkalanniemi-near-espoo", "sipoonkorpi-national-park-near-espoo", "soomaa-national-park-near-tallinn", "torronsuo-national-park-near-espoo", "alutaguse-national-park-near-narva", "kurtna-lake-district-near-narva", "lahemaa-national-park-near-narva", "lake-peipus-near-narva", "narva-bay-near-narva", "narva-joesuu-beach-near-narva", "ontika-landscape-conservation-area-near-narva"],
    featuredPlaces: ["aegna-near-tallinn", "lahemaa-national-park-near-kohtla-jarve", "nuuksio-national-park-near-helsinki", "sipoonkorpi-national-park-near-vantaa", "suomenlinna-helsinki", "tammisaari-archipelago-national-park-near-helsinki"],
    featuredCities: ["helsinki", "kohtla-jarve", "tallinn", "vantaa"],
    relatedCollections: ["weekend-escapes-near-helsinki", "finland-national-parks", "baltic-sea-coast", "weekend-escapes-near-tallinn", "finland-islands", "baltic-europe-weekend-escapes", "northern-europe-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "european-coast",
    title: "European Coast",
    description:
      "European Coast groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly beaches. This is a geographic discovery collection derived from a shared coastline; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "coastal_region",
    cities: ["amsterdam", "bayonne", "bruges", "caen", "cagliari", "constanta", "gdansk", "granada", "le-havre", "lisbon", "lubeck", "malmo", "san-sebastian", "tarragona", "venice"],
    nearbyPlaces: ["blankenberge-near-bruges", "knokke-heist-near-bruges", "nieuwpoort-near-bruges", "alabaster-coast-near-le-havre", "biarritz-near-bayonne", "cote-fleurie-near-caen", "travemunde-near-lubeck", "cavallino-treporti-near-venice", "poetto-near-cagliari", "zuid-kennemerland-national-park-near-amsterdam", "slowinski-national-park-near-gdansk", "costa-da-caparica-near-lisbon", "vama-veche-near-constanta", "cabo-de-gata-nijar-natural-park-near-granada", "costa-daurada-near-tarragona", "hendaye-bay-near-san-sebastian", "falsterbo-near-malmo", "cote-fleurie-near-le-havre", "alabaster-coast-near-beauvais", "bay-of-the-somme-near-beauvais", "bay-of-the-somme-near-dunkirk", "bay-of-wissant-near-calais", "berkheide-near-zoetermeer", "berlengas-natural-reserve-near-leiria", "cabo-da-roca-near-amadora", "cabo-da-roca-near-cascais", "cabo-da-roca-near-loures", "cabo-da-roca-near-sintra", "cap-blanc-nez-near-bethune", "cap-gris-nez-near-bethune"],
    featuredPlaces: ["alabaster-coast-near-le-havre", "biarritz-near-bayonne", "blankenberge-near-bruges", "cabo-de-gata-nijar-natural-park-near-granada", "cavallino-treporti-near-venice", "costa-daurada-near-tarragona", "costa-da-caparica-near-lisbon", "cote-fleurie-near-caen"],
    featuredCities: ["bruges", "amsterdam", "bayonne", "caen", "cagliari", "constanta"],
    relatedCollections: ["spain-coast", "weekend-escapes-near-bruges", "italy-coast", "france-spain-borderlands", "france-weekend-escapes", "baltic-sea-coast", "denmark-sweden-borderlands", "italy-weekend-escapes"],
  },
  {
    slug: "european-forests",
    title: "European Forests",
    description:
      "European Forests groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from forest landscapes; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "forest_region",
    cities: ["aarhus", "brussels", "jaca", "karlovy-vary", "limerick", "orleans", "paris", "rennes", "sankt-polten", "beauvais", "saint-quentin", "valenciennes", "lens", "bourges", "bethune"],
    nearbyPlaces: ["dunkelsteinerwald-near-sankt-polten", "sonian-forest-near-brussels", "slavkov-forest-near-karlovy-vary", "marselisborg-forests-near-aarhus", "forest-of-orleans-near-orleans", "foret-de-rambouillet-near-paris", "broceliande-forest-near-rennes", "curragh-chase-forest-park-near-limerick", "irati-forest-near-jaca", "vienna-woods-near-sankt-polten", "chantilly-forest-near-beauvais", "ermenonville-forest-near-beauvais", "ermenonville-forest-near-saint-quentin", "forest-of-arenberg-trouee-d-arenberg-near-valenciennes", "forest-of-halatte-near-saint-quentin", "forest-of-mormal-near-lens", "forest-of-mormal-near-valenciennes", "forest-of-orleans-near-bourges", "foret-de-mormal-near-bethune", "foret-de-mormal-near-saint-quentin", "hallerbos-near-aalst", "hallerbos-near-anderlecht", "hallerbos-near-kortrijk", "hallerbos-near-mechelen", "hallerbos-near-molenbeek", "hallerbos-near-schaerbeek", "meerdaal-forest-near-aalst", "meerdaal-forest-near-anderlecht", "meerdaal-forest-near-schaerbeek", "sonian-forest-near-aalst"],
    featuredPlaces: ["curragh-chase-forest-park-near-limerick", "dunkelsteinerwald-near-sankt-polten", "forest-of-orleans-near-orleans", "foret-de-rambouillet-near-paris", "irati-forest-near-jaca", "marselisborg-forests-near-aarhus", "broceliande-forest-near-rennes", "slavkov-forest-near-karlovy-vary"],
    featuredCities: ["aarhus", "brussels", "jaca", "karlovy-vary", "limerick", "orleans"],
    relatedCollections: ["weekend-escapes-near-paris", "austria-czechia-borderlands", "central-europe-weekend-escapes", "czechia-germany-borderlands", "france-spain-borderlands", "spain-weekend-escapes", "weekend-escapes-near-aarhus", "weekend-escapes-near-angers"],
  },
  {
    slug: "european-islands",
    title: "European Islands",
    description:
      "European Islands groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly islands. This is a geographic discovery collection derived from island geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "island_region",
    cities: ["bilbao", "brest", "cork", "dublin", "dubrovnik", "esbjerg", "hamburg", "kingston-upon-hull", "konstanz", "la-rochelle", "liverpool", "naples", "parnu", "portsmouth", "rijeka"],
    nearbyPlaces: ["elaphiti-islands-near-dubrovnik", "krk-near-rijeka", "mljet-national-park-near-dubrovnik", "fano-near-esbjerg", "kihnu-near-parnu", "crozon-peninsula-near-brest", "ile-de-re-near-la-rochelle", "neuwerk-near-hamburg", "reichenau-island-near-konstanz", "bull-island-near-dublin", "fota-island-near-cork", "ischia-near-naples", "gaztelugatxe-near-bilbao", "hayling-island-near-portsmouth", "hilbre-island-near-liverpool", "spurn-near-kingston-upon-hull", "brownsea-island-near-bournemouth", "glenan-islands-near-quimper", "ile-d-aix-near-angouleme", "ile-d-aix-near-niort", "ile-d-yeu-near-saint-nazaire", "ile-de-groix-near-lorient", "ile-de-re-near-niort", "ile-de-re-near-poitiers", "ile-de-sein-near-quimper", "ischia-near-giugliano-in-campania", "noirmoutier-near-saint-nazaire", "procida-near-giugliano-in-campania", "spiekeroog-near-oldenburg", "alderney-near-cherbourg"],
    featuredPlaces: ["bull-island-near-dublin", "crozon-peninsula-near-brest", "elaphiti-islands-near-dubrovnik", "fano-near-esbjerg", "fota-island-near-cork", "gaztelugatxe-near-bilbao", "hayling-island-near-portsmouth", "hilbre-island-near-liverpool"],
    featuredCities: ["dubrovnik", "bilbao", "brest", "cork", "dublin", "esbjerg"],
    relatedCollections: ["weekend-escapes-near-dubrovnik", "baltic-sea-coast", "denmark-germany-borderlands", "france-spain-borderlands", "france-weekend-escapes", "weekend-escapes-near-aarhus", "weekend-escapes-near-bilbao", "weekend-escapes-near-bordeaux"],
  },
  {
    slug: "european-lakes",
    title: "European Lakes",
    description:
      "European Lakes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["almere", "bucharest", "budapest", "burgas", "cesis", "chania", "charleroi", "debrecen", "dublin", "evora", "ghent", "gothenburg", "ioannina", "jonkoping", "karlstad"],
    nearbyPlaces: ["donkmeer-near-ghent", "eau-d-heure-lakes-near-charleroi", "lake-burgas-near-burgas", "lake-kournas-near-chania", "lake-pamvotida-near-ioannina", "lake-balaton-near-budapest", "lake-tisza-near-debrecen", "glendalough-near-dublin", "lake-burtnieks-near-cesis", "markermeer-near-almere", "alqueva-dam-near-evora", "snagov-near-bucharest", "delsjon-near-gothenburg", "lake-vanern-near-karlstad", "vattern-near-jonkoping", "burgumer-mar-near-leeuwarden", "eemmeer-near-amersfoort", "frisian-lakes-near-leeuwarden", "ijsselmeer-near-zaanstad", "kagerplassen-near-alphen-aan-den-rijn", "lake-asunden-near-boras", "lake-genval-near-anderlecht", "lake-hornborga-near-boras", "lake-mjorn-near-boras", "lake-oreg-near-gyor", "lake-siriu-near-buzau", "lake-tolken-near-boras", "lesse-near-schaerbeek", "markermeer-near-haarlemmermeer", "markermeer-near-zaanstad"],
    featuredPlaces: ["alqueva-dam-near-evora", "delsjon-near-gothenburg", "donkmeer-near-ghent", "eau-d-heure-lakes-near-charleroi", "glendalough-near-dublin", "lake-balaton-near-budapest", "lake-burgas-near-burgas", "lake-burtnieks-near-cesis"],
    featuredCities: ["almere", "bucharest", "budapest", "burgas", "cesis", "chania"],
    relatedCollections: ["western-europe-lakes", "greece-weekend-escapes", "weekend-escapes-near-gothenburg", "western-europe-weekend-escapes", "latvia-weekend-escapes", "romania-weekend-escapes", "southern-europe-weekend-escapes", "sweden-weekend-escapes"],
  },
  {
    slug: "european-mountains",
    title: "European Mountains",
    description:
      "European Mountains groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["banska-bystrica", "braga", "bratislava", "burgas", "celje", "evora", "ljubljana", "pecs", "plovdiv", "sofia", "viseu", "zilina", "porto", "maribor", "matosinhos"],
    nearbyPlaces: ["rhodope-mountains-near-plovdiv", "strandzha-near-burgas", "vitosha-near-sofia", "mecsek-near-pecs", "peneda-geres-national-park-near-braga", "serra-da-estrela-natural-park-near-viseu", "serra-de-sao-mamede-near-evora", "little-carpathians-near-bratislava", "mala-fatra-national-park-near-zilina", "polana-near-banska-bystrica", "velka-fatra-near-bratislava", "kamniksavinja-alps-near-celje", "pohorje-near-celje", "triglav-national-park-near-ljubljana", "donacka-gora-near-celje", "peneda-geres-national-park-near-porto", "pohorje-near-maribor", "serra-do-marao-near-matosinhos", "sredna-gora-near-stara-zagora", "badacsony-near-szekesfehervar", "belianske-tatras-near-poprad", "gardunha-near-guarda", "gerlachovsky-stit-near-poprad", "high-tatras-near-poprad", "leitha-mountains-near-sopron", "little-carpathians-near-nitra", "pirin-mountain-range-near-bansko", "pirin-mountains-near-blagoevgrad", "pohronsky-inovec-near-nitra", "povazsky-inovec-near-nitra"],
    featuredPlaces: ["kamniksavinja-alps-near-celje", "little-carpathians-near-bratislava", "mala-fatra-national-park-near-zilina", "mecsek-near-pecs", "peneda-geres-national-park-near-braga", "pohorje-near-celje", "polana-near-banska-bystrica", "rhodope-mountains-near-plovdiv"],
    featuredCities: ["bratislava", "celje", "banska-bystrica", "braga", "burgas", "evora"],
    relatedCollections: ["weekend-escapes-near-bratislava", "czechia-slovakia-borderlands", "austria-slovenia-borderlands", "croatia-slovenia-borderlands", "poland-slovakia-borderlands", "weekend-escapes-near-ljubljana", "weekend-escapes-near-sofia", "central-europe-mountains"],
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
      "Finland National Parks groups 19 nearby places across 9 cities for local-first day and weekend discovery — mainly nature areas, parks, islands. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["helsinki", "jyvaskyla", "lahti", "rovaniemi", "tampere", "turku", "vantaa", "espoo", "lappeenranta"],
    nearbyPlaces: ["archipelago-national-park-near-turku", "helvetinjarvi-national-park-near-tampere", "isojarvi-national-park-near-tampere", "leivonmaki-national-park-near-jyvaskyla", "liesjarvi-national-park-near-helsinki", "nuuksio-national-park-near-helsinki", "pyha-luosto-national-park-near-rovaniemi", "paijanne-national-park-near-lahti", "repovesi-national-park-near-lahti", "seitseminen-national-park-near-tampere", "sipoonkorpi-national-park-near-vantaa", "tammisaari-archipelago-national-park-near-helsinki", "liesjarvi-national-park-near-vantaa", "torronsuo-national-park-near-lahti", "liesjarvi-national-park-near-espoo", "nuuksio-national-park-near-espoo", "sipoonkorpi-national-park-near-espoo", "torronsuo-national-park-near-espoo", "repovesi-national-park-near-lappeenranta"],
    featuredPlaces: ["archipelago-national-park-near-turku", "helvetinjarvi-national-park-near-tampere", "isojarvi-national-park-near-tampere", "leivonmaki-national-park-near-jyvaskyla", "liesjarvi-national-park-near-helsinki", "nuuksio-national-park-near-helsinki", "pyha-luosto-national-park-near-rovaniemi", "paijanne-national-park-near-lahti"],
    featuredCities: ["helsinki", "tampere", "lahti", "jyvaskyla", "rovaniemi", "turku"],
    relatedCollections: ["weekend-escapes-near-helsinki", "estonia-finland-borderlands", "northern-europe-weekend-escapes", "finland-weekend-escapes", "finland-islands", "baltic-sea-coast", "australia-national-parks", "canada-national-parks"],
  },
  {
    slug: "finland-weekend-escapes",
    title: "Finland Weekend Escapes",
    description:
      "Finland Weekend Escapes groups 29 nearby places across 11 cities for local-first day and weekend discovery — mainly lakes, nature areas, islands. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["jyvaskyla", "kuopio", "oulu", "rovaniemi", "tampere", "vaasa", "vantaa", "espoo", "helsinki", "joensuu", "lappeenranta"],
    nearbyPlaces: ["hailuoto-near-oulu", "kallavesi-near-kuopio", "kemijoki-near-rovaniemi", "kvarken-archipelago-near-vaasa", "leivonmaki-national-park-near-jyvaskyla", "liesjarvi-national-park-near-tampere", "nuuksio-national-park-near-vantaa", "pyha-luosto-national-park-near-rovaniemi", "paijanne-near-jyvaskyla", "soderfjarden-near-vaasa", "lake-tuusula-near-vantaa", "liesjarvi-national-park-near-vantaa", "vantaanjoki-near-vantaa", "liesjarvi-national-park-near-espoo", "lohjanjarvi-near-espoo", "nuuksio-national-park-near-espoo", "porkkalanniemi-near-espoo", "sipoonkorpi-national-park-near-espoo", "suomenlinna-helsinki", "torronsuo-national-park-near-espoo", "koli-national-park-near-joensuu", "lake-hoytiainen-near-joensuu", "lake-kuolimo-near-lappeenranta", "lake-pielinen-near-joensuu", "lake-pyhaselka-near-joensuu", "linnansaari-national-park-near-joensuu", "linnansaari-national-park-near-lappeenranta", "pielisjoki-near-joensuu", "repovesi-national-park-near-lappeenranta"],
    featuredPlaces: ["hailuoto-near-oulu", "kallavesi-near-kuopio", "kemijoki-near-rovaniemi", "kvarken-archipelago-near-vaasa", "leivonmaki-national-park-near-jyvaskyla", "liesjarvi-national-park-near-tampere", "nuuksio-national-park-near-vantaa", "pyha-luosto-national-park-near-rovaniemi"],
    featuredCities: ["jyvaskyla", "rovaniemi", "vaasa", "kuopio", "oulu", "tampere"],
    relatedCollections: ["finland-national-parks", "finland-islands", "northern-europe-weekend-escapes", "weekend-escapes-near-helsinki", "estonia-finland-borderlands", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "france-germany-borderlands",
    title: "France–Germany Borderlands",
    description:
      "France–Germany Borderlands groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly nature areas, mountains, lakes. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["freiburg", "karlsruhe", "metz", "saarbrucken", "strasbourg", "trier", "montbeliard", "mulhouse", "colmar", "ulm", "ludwigshafen", "duisburg", "leverkusen", "troyes"],
    nearbyPlaces: ["lac-blanc-near-strasbourg", "lorraine-regional-natural-park-near-metz", "mont-sainte-odile-near-strasbourg", "northern-vosges-regional-park-near-strasbourg", "vosges-near-strasbourg", "black-forest-national-park-near-karlsruhe", "feldberg-near-freiburg", "hunsruck-hochwald-national-park-near-trier", "saar-hunsruck-nature-park-near-saarbrucken", "saarschleife-near-saarbrucken", "schauinsland-near-freiburg", "schluchsee-near-freiburg", "titisee-near-freiburg", "bostalsee-near-saarbrucken", "hunsruck-hochwald-national-park-near-saarbrucken", "lake-der-chantecoq-near-metz", "moselle-near-metz", "northern-vosges-regional-natural-park-near-metz", "northern-vosges-regional-nature-park-near-saarbrucken", "vosges-near-metz", "ballon-d-alsace-near-montbeliard", "ballon-de-servance-near-montbeliard", "ballons-des-vosges-nature-park-near-montbeliard", "ballons-des-vosges-nature-park-near-mulhouse", "ballons-des-vosges-regional-nature-park-near-colmar", "bussen-near-ulm", "donnersberg-near-ludwigshafen", "eifel-near-duisburg", "eifel-near-leverkusen", "foret-d-orient-national-nature-reserve-near-troyes"],
    featuredPlaces: ["black-forest-national-park-near-karlsruhe", "feldberg-near-freiburg", "hunsruck-hochwald-national-park-near-trier", "lac-blanc-near-strasbourg", "lorraine-regional-natural-park-near-metz", "mont-sainte-odile-near-strasbourg", "northern-vosges-regional-park-near-strasbourg", "saar-hunsruck-nature-park-near-saarbrucken"],
    featuredCities: ["freiburg", "strasbourg", "saarbrucken", "karlsruhe", "metz", "trier"],
    relatedCollections: ["weekend-escapes-near-freiburg", "weekend-escapes-near-strasbourg", "germany-luxembourg-borderlands", "france-protected-landscapes", "germany-forests", "belgium-germany-borderlands", "central-europe-weekend-escapes", "france-mountains"],
  },
  {
    slug: "france-italy-borderlands",
    title: "France–Italy Borderlands",
    description:
      "France–Italy Borderlands groups 30 nearby places across 11 cities for local-first day and weekend discovery — mainly mountains, nature areas. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["aosta", "chambery", "grenoble", "nice", "turin", "asti", "cannes", "antibes", "toulon", "valence", "pavia"],
    nearbyPlaces: ["bauges-near-chambery", "massif-de-lesterel-near-nice", "mercantour-national-park-near-nice", "ecrins-national-park-near-grenoble", "gran-paradiso-national-park-near-turin", "la-mandria-regional-park-near-turin", "maritime-alps-natural-park-near-turin", "mont-blanc-near-aosta", "orsiera-rocciavre-natural-park-near-turin", "capanne-di-marcarolo-natural-park-near-asti", "castellane-prealps-near-cannes", "esterel-massif-near-antibes", "esterel-massif-near-cannes", "giens-peninsula-near-toulon", "gorges-de-daluis-near-antibes", "iles-d-hyeres-near-toulon", "lac-de-monteynard-avignonet-near-valence", "lac-de-saint-cassien-near-cannes", "langhe-near-asti", "lerins-islands-near-antibes", "lerins-islands-near-cannes", "lombardy-ticino-valley-natural-park-near-pavia", "loup-river-and-gorges-du-loup-near-cannes", "massif-des-maures-near-antibes", "mercantour-national-park-near-antibes", "mercantour-national-park-near-cannes", "mont-aiguille-near-valence", "mont-faron-near-toulon", "montferrat-near-asti", "oltrepo-pavese-near-pavia"],
    featuredPlaces: ["bauges-near-chambery", "gran-paradiso-national-park-near-turin", "la-mandria-regional-park-near-turin", "maritime-alps-natural-park-near-turin", "massif-de-lesterel-near-nice", "mercantour-national-park-near-nice", "mont-blanc-near-aosta", "orsiera-rocciavre-natural-park-near-turin"],
    featuredCities: ["turin", "nice", "aosta", "chambery", "grenoble"],
    relatedCollections: ["france-mountains", "italy-mountains", "weekend-escapes-near-milan", "france-national-parks", "weekend-escapes-near-grenoble", "weekend-escapes-near-marseille", "italy-national-parks", "italy-protected-landscapes"],
  },
  {
    slug: "france-lakes",
    title: "France Lakes",
    description:
      "France Lakes groups 21 nearby places across 15 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["angers", "annecy", "besancon", "chambery", "clermont-ferrand", "grenoble", "limoges", "metz", "nice", "strasbourg", "colmar", "mulhouse", "saint-nazaire", "valence", "cannes"],
    nearbyPlaces: ["lac-blanc-near-strasbourg", "lac-pavin-near-clermont-ferrand", "lac-de-madine-near-metz", "lac-de-maine-near-angers", "lac-de-monteynard-avignonet-near-grenoble", "lac-de-saint-cassien-near-nice", "lac-de-saint-point-near-besancon", "lac-de-vassiviere-near-limoges", "lac-du-bourget-near-chambery", "lake-annecy-near-annecy", "lake-of-sainte-croix-near-nice", "lake-der-chantecoq-near-metz", "lac-blanc-near-colmar", "lac-blanc-near-mulhouse", "lac-de-grand-lieu-near-saint-nazaire", "lac-de-kruth-wildenstein-near-mulhouse", "lac-de-monteynard-avignonet-near-valence", "lac-de-saint-cassien-near-cannes", "lac-des-brenets-near-montbeliard", "lac-noir-near-colmar", "lakes-amance-and-du-temple-near-troyes"],
    featuredPlaces: ["lac-blanc-near-strasbourg", "lac-pavin-near-clermont-ferrand", "lac-de-madine-near-metz", "lac-de-maine-near-angers", "lac-de-monteynard-avignonet-near-grenoble", "lac-de-saint-cassien-near-nice", "lac-de-saint-point-near-besancon", "lac-de-vassiviere-near-limoges"],
    featuredCities: ["nice", "angers", "annecy", "besancon", "chambery", "clermont-ferrand"],
    relatedCollections: ["france-weekend-escapes", "western-europe-lakes", "weekend-escapes-near-grenoble", "western-europe-weekend-escapes", "weekend-escapes-near-strasbourg", "weekend-escapes-near-marseille", "france-mountains", "france-germany-borderlands"],
  },
  {
    slug: "france-mountains",
    title: "France Mountains",
    description:
      "France Mountains groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["aix-en-provence", "avignon", "bayonne", "chambery", "clermont-ferrand", "grenoble", "lyon", "marseille", "montpellier", "nice", "pau", "strasbourg", "toulouse", "montbeliard", "cannes"],
    nearbyPlaces: ["alpilles-near-marseille", "bauges-near-chambery", "cevennes-national-park-near-montpellier", "la-rhune-near-bayonne", "massif-de-lesterel-near-nice", "mercantour-national-park-near-nice", "mont-sainte-odile-near-strasbourg", "mont-ventoux-near-avignon", "montagne-noire-near-toulouse", "montagne-sainte-victoire-near-aix-en-provence", "monts-du-lyonnais-near-lyon", "puy-de-sancy-near-clermont-ferrand", "pyrenees-national-park-near-pau", "sainte-baume-near-marseille", "vercors-regional-park-near-grenoble", "vosges-near-strasbourg", "ecrins-national-park-near-grenoble", "ballon-d-alsace-near-montbeliard", "ballon-de-servance-near-montbeliard", "castellane-prealps-near-cannes", "esterel-massif-near-antibes", "esterel-massif-near-cannes", "grand-ballon-near-colmar", "grand-ballon-near-montbeliard", "grand-ballon-near-mulhouse", "hohneck-near-colmar", "hohneck-near-mulhouse", "massif-des-maures-near-antibes", "mont-aiguille-near-valence", "mont-faron-near-toulon"],
    featuredPlaces: ["alpilles-near-marseille", "bauges-near-chambery", "cevennes-national-park-near-montpellier", "la-rhune-near-bayonne", "massif-de-lesterel-near-nice", "mercantour-national-park-near-nice", "mont-sainte-odile-near-strasbourg", "mont-ventoux-near-avignon"],
    featuredCities: ["grenoble", "marseille", "nice", "strasbourg", "aix-en-provence", "avignon"],
    relatedCollections: ["weekend-escapes-near-marseille", "weekend-escapes-near-grenoble", "france-national-parks", "france-italy-borderlands", "france-spain-borderlands", "weekend-escapes-near-bordeaux", "france-germany-borderlands", "weekend-escapes-near-strasbourg"],
  },
  {
    slug: "france-national-parks",
    title: "France National Parks",
    description:
      "France National Parks groups 12 nearby places across 12 cities for local-first day and weekend discovery — mainly mountains, nature areas. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["grenoble", "marseille", "montpellier", "nice", "pau", "toulon", "antibes", "cannes", "albi", "beziers", "biarritz", "tarbes"],
    nearbyPlaces: ["calanques-near-marseille", "cevennes-national-park-near-montpellier", "mercantour-national-park-near-nice", "pyrenees-national-park-near-pau", "ecrins-national-park-near-grenoble", "calanques-national-park-near-toulon", "mercantour-national-park-near-antibes", "mercantour-national-park-near-cannes", "cevennes-national-park-near-albi", "cevennes-national-park-near-beziers", "pyrenees-national-park-near-biarritz", "pyrenees-national-park-near-tarbes"],
    featuredPlaces: ["calanques-near-marseille", "cevennes-national-park-near-montpellier", "mercantour-national-park-near-nice", "pyrenees-national-park-near-pau", "ecrins-national-park-near-grenoble"],
    featuredCities: ["grenoble", "marseille", "montpellier", "nice", "pau"],
    relatedCollections: ["france-mountains", "weekend-escapes-near-marseille", "france-italy-borderlands", "france-spain-borderlands", "weekend-escapes-near-bordeaux", "weekend-escapes-near-grenoble", "france-lakes", "france-weekend-escapes"],
  },
  {
    slug: "france-protected-landscapes",
    title: "France Protected Landscapes",
    description:
      "France Protected Landscapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly parks, nature areas. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["angers", "bordeaux", "brest", "dijon", "le-mans", "lille", "limoges", "lyon", "metz", "nantes", "orleans", "saint-etienne", "strasbourg", "toulouse", "lens"],
    nearbyPlaces: ["armorique-regional-natural-park-near-brest", "brenne-regional-natural-park-near-orleans", "dune-of-pilat-near-bordeaux", "haut-languedoc-regional-park-near-toulouse", "landes-de-gascogne-regional-natural-park-near-bordeaux", "livradois-forez-regional-natural-park-near-saint-etienne", "loire-anjou-touraine-regional-nature-park-near-angers", "lorraine-regional-natural-park-near-metz", "marais-audomarois-near-lille", "morvan-regional-park-near-dijon", "normandie-maine-regional-natural-park-near-le-mans", "northern-vosges-regional-park-near-strasbourg", "parc-naturel-regional-de-briere-near-nantes", "pilat-regional-natural-park-near-lyon", "perigord-limousin-regional-natural-park-near-limoges", "briere-regional-natural-park-near-angers", "foret-d-ecouves-near-le-mans", "loire-valley-near-angers", "mayenne-near-angers", "normandie-maine-regional-natural-park-near-angers", "northern-vosges-regional-natural-park-near-metz", "audomarois-marsh-near-lens", "auvezere-near-angouleme", "baie-de-somme-near-bethune", "blavet-valley-near-lorient", "brenne-regional-natural-park-near-bourges", "brenne-regional-natural-park-near-poitiers", "briere-regional-natural-park-near-lorient", "briere-regional-natural-park-near-saint-nazaire", "canche-near-lens"],
    featuredPlaces: ["armorique-regional-natural-park-near-brest", "brenne-regional-natural-park-near-orleans", "dune-of-pilat-near-bordeaux", "haut-languedoc-regional-park-near-toulouse", "landes-de-gascogne-regional-natural-park-near-bordeaux", "livradois-forez-regional-natural-park-near-saint-etienne", "loire-anjou-touraine-regional-nature-park-near-angers", "lorraine-regional-natural-park-near-metz"],
    featuredCities: ["bordeaux", "angers", "brest", "dijon", "le-mans", "lille"],
    relatedCollections: ["western-europe-protected-landscapes", "western-europe-weekend-escapes", "france-weekend-escapes", "weekend-escapes-near-angers", "france-germany-borderlands", "weekend-escapes-near-grenoble", "weekend-escapes-near-strasbourg", "weekend-escapes-near-bordeaux"],
  },
  {
    slug: "france-spain-borderlands",
    title: "France–Spain Borderlands",
    description:
      "France–Spain Borderlands groups 30 nearby places across 10 cities for local-first day and weekend discovery — mainly mountains, nature areas, beaches. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["bayonne", "bilbao", "jaca", "pau", "san-sebastian", "toulouse", "vitoria-gasteiz", "lleida", "biarritz", "tarbes"],
    nearbyPlaces: ["biarritz-near-bayonne", "garonne-near-toulouse", "gave-de-pau-near-pau", "la-rhune-near-bayonne", "pyrenees-national-park-near-pau", "aiako-harria-near-san-sebastian", "aizkorri-aratz-natural-park-near-san-sebastian", "flysch-basque-coast-near-bilbao", "gaztelugatxe-near-bilbao", "gorbea-natural-park-near-bilbao", "hendaye-bay-near-san-sebastian", "irati-forest-near-jaca", "ordesa-y-monte-perdido-national-park-near-jaca", "pagoeta-natural-park-near-san-sebastian", "urdaibai-biosphere-reserve-near-bilbao", "aizkorri-aratz-natural-park-near-vitoria-gasteiz", "gorbeia-natural-park-near-vitoria-gasteiz", "izki-natural-park-near-vitoria-gasteiz", "salburua-near-vitoria-gasteiz", "ullibarri-gamboa-reservoir-near-vitoria-gasteiz", "urkiola-natural-park-near-vitoria-gasteiz", "aiguestortes-i-estany-de-sant-maurici-national-park-near-lleida", "alt-pirineu-natural-park-near-lleida", "bay-of-txingudi-near-biarritz", "bidasoa-near-biarritz", "cadi-moixero-natural-park-near-lleida", "cirque-de-gavarnie-near-tarbes", "col-du-tourmalet-near-tarbes", "gaube-lake-near-tarbes", "irati-forest-near-biarritz"],
    featuredPlaces: ["aiako-harria-near-san-sebastian", "aizkorri-aratz-natural-park-near-san-sebastian", "biarritz-near-bayonne", "flysch-basque-coast-near-bilbao", "garonne-near-toulouse", "gave-de-pau-near-pau", "gaztelugatxe-near-bilbao", "gorbea-natural-park-near-bilbao"],
    featuredCities: ["bilbao", "san-sebastian", "bayonne", "jaca", "pau", "toulouse"],
    relatedCollections: ["weekend-escapes-near-bilbao", "spain-mountains", "weekend-escapes-near-bordeaux", "france-mountains", "european-coast", "spain-protected-landscapes", "spain-weekend-escapes", "european-forests"],
  },
  {
    slug: "france-weekend-escapes",
    title: "France Weekend Escapes",
    description:
      "France Weekend Escapes groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly lakes, parks, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["annecy", "besancon", "brest", "caen", "clermont-ferrand", "dijon", "grenoble", "le-havre", "lille", "limoges", "marseille", "nancy", "nimes", "saint-etienne"],
    nearbyPlaces: ["alabaster-coast-near-le-havre", "armorique-regional-natural-park-near-brest", "crozon-peninsula-near-brest", "cevennes-national-park-near-nimes", "cote-fleurie-near-caen", "lac-pavin-near-clermont-ferrand", "lac-de-madine-near-nancy", "lac-de-saint-point-near-besancon", "lac-de-vassiviere-near-limoges", "lac-du-bourget-near-grenoble", "marais-audomarois-near-lille", "massif-des-bauges-near-annecy", "montagne-sainte-victoire-near-marseille", "morvan-regional-park-near-dijon", "normandy-maine-regional-natural-park-near-caen", "parc-naturel-regional-de-lorraine-near-nancy", "pilat-regional-natural-park-near-saint-etienne", "puy-de-sancy-near-clermont-ferrand", "perigord-limousin-regional-natural-park-near-limoges", "cote-fleurie-near-le-havre", "eawy-forest-near-le-havre", "eu-forest-near-le-havre", "foret-de-brotonne-near-le-havre", "foret-de-rouvray-near-le-havre", "gartempe-near-limoges", "lac-de-grangent-near-saint-etienne", "monts-de-blond-near-limoges", "monts-du-lyonnais-near-saint-etienne", "pierre-sur-haute-near-saint-etienne", "vercors-massif-near-saint-etienne"],
    featuredPlaces: ["alabaster-coast-near-le-havre", "armorique-regional-natural-park-near-brest", "crozon-peninsula-near-brest", "cevennes-national-park-near-nimes", "cote-fleurie-near-caen", "lac-pavin-near-clermont-ferrand", "lac-de-madine-near-nancy", "lac-de-saint-point-near-besancon"],
    featuredCities: ["brest", "caen", "clermont-ferrand", "limoges", "nancy", "annecy"],
    relatedCollections: ["france-protected-landscapes", "france-lakes", "western-europe-weekend-escapes", "european-coast", "western-europe-protected-landscapes", "france-mountains", "european-islands", "weekend-escapes-near-grenoble"],
  },
  {
    slug: "germany-forests",
    title: "Germany Forests",
    description:
      "Germany Forests groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas. This is a geographic discovery collection derived from forest landscapes; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "forest_region",
    cities: ["augsburg", "berlin", "bochum", "cologne", "heidelberg", "karlsruhe", "kassel", "leipzig", "passau", "potsdam", "stuttgart", "trier", "wolfsburg", "wurzburg", "hamm"],
    nearbyPlaces: ["arnsberg-forest-nature-park-near-bochum", "augsburg-western-woods-nature-park-near-augsburg", "bavarian-forest-national-park-near-passau", "black-forest-national-park-near-karlsruhe", "elm-lappwald-nature-park-near-wolfsburg", "hambach-forest-near-cologne", "hunsruck-hochwald-national-park-near-trier", "leipzig-riverside-forest-near-leipzig", "odenwald-near-heidelberg", "reinhardswald-near-kassel", "schurwald-near-stuttgart", "spreewald-near-potsdam", "spreewald-near-berlin", "steigerwald-near-wurzburg", "welzheim-forest-near-stuttgart", "kaufunger-wald-near-kassel", "arnsberg-forest-nature-park-near-hamm", "arnsberg-forest-nature-park-near-herne", "franconian-switzerland-veldenstein-forest-nature-park-near-furth", "hunsruck-hochwald-national-park-near-wiesbaden", "kellerwald-edersee-national-park-near-offenbach-am-main", "kellerwald-edersee-national-park-near-paderborn", "klever-reichswald-near-krefeld", "neckartal-odenwald-nature-park-near-heilbronn", "palatinate-forest-north-vosges-biosphere-reserve-near-ludwigshafen", "steigerwald-nature-park-near-furth", "swabian-franconian-forest-near-heilbronn", "teutoburg-forest-egge-hills-nature-park-near-bielefeld", "teutoburg-forest-near-hamm", "teutoburg-forest-near-osnabruck"],
    featuredPlaces: ["arnsberg-forest-nature-park-near-bochum", "augsburg-western-woods-nature-park-near-augsburg", "bavarian-forest-national-park-near-passau", "black-forest-national-park-near-karlsruhe", "elm-lappwald-nature-park-near-wolfsburg", "hambach-forest-near-cologne", "hunsruck-hochwald-national-park-near-trier", "leipzig-riverside-forest-near-leipzig"],
    featuredCities: ["stuttgart", "augsburg", "berlin", "bochum", "cologne", "heidelberg"],
    relatedCollections: ["weekend-escapes-near-frankfurt", "czechia-germany-borderlands", "weekend-escapes-near-berlin", "central-europe-weekend-escapes", "france-germany-borderlands", "weekend-escapes-near-cologne", "weekend-escapes-near-munich", "weekend-escapes-near-freiburg"],
  },
  {
    slug: "germany-lakes",
    title: "Germany Lakes",
    description:
      "Germany Lakes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["aachen", "augsburg", "berlin", "freiburg", "garmisch-partenkirchen", "gorlitz", "hamburg", "hanover", "munich", "regensburg", "munster", "osnabruck", "halle", "braunschweig", "monchengladbach"],
    nearbyPlaces: ["ammersee-near-augsburg", "berzdorfer-see-near-gorlitz", "eibsee-near-garmisch-partenkirchen", "grosser-arbersee-near-regensburg", "holstein-switzerland-near-hamburg", "lake-starnberg-near-munich", "rur-reservoir-near-aachen", "schaalsee-near-hamburg", "schluchsee-near-freiburg", "steinhuder-meer-near-hanover", "tegernsee-near-munich", "titisee-near-freiburg", "wannsee-berlin", "dummer-near-munster", "dummer-near-osnabruck", "groer-goitzschesee-near-halle", "lake-steinhude-near-braunschweig", "lake-steinhude-near-osnabruck", "oker-reservoir-near-braunschweig", "rur-reservoir-near-monchengladbach", "rur-reservoir-near-neuss", "rur-reservoir-obersee-near-leverkusen", "steinhuder-meer-near-bielefeld", "steinhuder-meer-near-munster", "cottbuser-ostsee-near-cottbus", "laacher-see-near-koblenz", "lake-schwerin-near-schwerin", "lake-senftenberg-near-cottbus", "lake-steinhude-near-hildesheim", "lusatian-lake-district-near-cottbus"],
    featuredPlaces: ["ammersee-near-augsburg", "berzdorfer-see-near-gorlitz", "eibsee-near-garmisch-partenkirchen", "grosser-arbersee-near-regensburg", "holstein-switzerland-near-hamburg", "lake-starnberg-near-munich", "rur-reservoir-near-aachen", "schaalsee-near-hamburg"],
    featuredCities: ["freiburg", "hamburg", "munich", "aachen", "augsburg", "berlin"],
    relatedCollections: ["weekend-escapes-near-munich", "austria-germany-borderlands", "weekend-escapes-near-hamburg", "france-germany-borderlands", "weekend-escapes-near-freiburg", "central-europe-weekend-escapes", "weekend-escapes-near-berlin", "weekend-escapes-near-chemnitz"],
  },
  {
    slug: "germany-luxembourg-borderlands",
    title: "Germany–Luxembourg Borderlands",
    description:
      "Germany–Luxembourg Borderlands groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["aachen", "esch-sur-alzette", "luxembourg-city", "saarbrucken", "trier", "gelsenkirchen", "duisburg", "krefeld", "leverkusen", "mulheim-an-der-ruhr", "neuss", "solingen", "wuppertal", "herne", "monchengladbach"],
    nearbyPlaces: ["eifel-national-park-near-aachen", "hunsruck-hochwald-national-park-near-trier", "saar-hunsruck-nature-park-near-saarbrucken", "saarschleife-near-saarbrucken", "mullerthal-near-luxembourg-city", "upper-sure-natural-park-near-esch-sur-alzette", "bostalsee-near-saarbrucken", "hunsruck-hochwald-national-park-near-saarbrucken", "hurtgen-forest-near-aachen", "northern-vosges-regional-nature-park-near-saarbrucken", "rheinland-nature-park-near-aachen", "siebengebirge-near-aachen", "vesdre-near-aachen", "ardey-hills-near-gelsenkirchen", "bergisches-land-near-duisburg", "bergisches-land-near-gelsenkirchen", "bergisches-land-near-krefeld", "bergisches-land-near-leverkusen", "bergisches-land-near-mulheim-an-der-ruhr", "bergisches-land-near-neuss", "bergisches-land-near-solingen", "bergisches-land-near-wuppertal", "bigge-reservoir-near-herne", "biggesee-near-wuppertal", "de-maasduinen-national-park-near-monchengladbach", "de-meinweg-national-park-near-krefeld", "de-meinweg-national-park-near-monchengladbach", "donnersberg-near-ludwigshafen", "eifel-national-park-near-duisburg", "eifel-national-park-near-krefeld"],
    featuredPlaces: ["eifel-national-park-near-aachen", "hunsruck-hochwald-national-park-near-trier", "mullerthal-near-luxembourg-city", "saar-hunsruck-nature-park-near-saarbrucken", "saarschleife-near-saarbrucken", "upper-sure-natural-park-near-esch-sur-alzette"],
    featuredCities: ["saarbrucken", "aachen", "esch-sur-alzette", "luxembourg-city", "trier"],
    relatedCollections: ["belgium-germany-borderlands", "france-germany-borderlands", "central-europe-weekend-escapes", "weekend-escapes-near-freiburg", "germany-netherlands-borderlands", "germany-forests", "germany-weekend-escapes", "weekend-escapes-near-cologne"],
  },
  {
    slug: "germany-mountains",
    title: "Germany Mountains",
    description:
      "Germany Mountains groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["cologne", "dresden", "erfurt", "frankfurt", "freiburg", "garmisch-partenkirchen", "gorlitz", "magdeburg", "nuremberg", "passau", "stuttgart", "wurzburg", "ulm", "gelsenkirchen", "braunschweig"],
    nearbyPlaces: ["bavarian-forest-near-passau", "feldberg-near-freiburg", "franconian-jura-near-nuremberg", "harz-near-magdeburg", "hesselberg-near-nuremberg", "lusatian-mountains-near-dresden", "ore-mountains-near-dresden", "rhon-mountains-near-frankfurt", "saxon-switzerland-national-park-near-dresden", "schauinsland-near-freiburg", "siebengebirge-near-cologne", "spessart-near-wurzburg", "swabian-jura-near-stuttgart", "taunus-near-frankfurt", "thuringian-forest-near-erfurt", "zittau-mountains-near-gorlitz", "zugspitze-near-garmisch-partenkirchen", "brocken-near-magdeburg", "adelegg-near-ulm", "ardey-hills-near-gelsenkirchen", "asse-near-braunschweig", "bergisches-land-near-duisburg", "bergisches-land-near-gelsenkirchen", "bergisches-land-near-krefeld", "bergisches-land-near-leverkusen", "bergisches-land-near-mulheim-an-der-ruhr", "brocken-near-braunschweig", "bussen-near-ulm", "donnersberg-near-ludwigshafen", "eifel-near-duisburg"],
    featuredPlaces: ["bavarian-forest-near-passau", "feldberg-near-freiburg", "franconian-jura-near-nuremberg", "harz-near-magdeburg", "hesselberg-near-nuremberg", "lusatian-mountains-near-dresden", "ore-mountains-near-dresden", "rhon-mountains-near-frankfurt"],
    featuredCities: ["dresden", "frankfurt", "freiburg", "nuremberg", "cologne", "erfurt"],
    relatedCollections: ["czechia-germany-borderlands", "weekend-escapes-near-munich", "weekend-escapes-near-berlin", "germany-poland-borderlands", "weekend-escapes-near-frankfurt", "weekend-escapes-near-freiburg", "weekend-escapes-near-chemnitz", "france-germany-borderlands"],
  },
  {
    slug: "germany-netherlands-borderlands",
    title: "Germany–Netherlands Borderlands",
    description:
      "Germany–Netherlands Borderlands groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["aachen", "arnhem", "bochum", "cologne", "dusseldorf", "eindhoven", "enschede", "maastricht", "nijmegen", "zoetermeer", "leeuwarden", "gelsenkirchen", "hamm", "herne", "munster"],
    nearbyPlaces: ["eifel-national-park-near-aachen", "hambach-forest-near-cologne", "hohe-mark-nature-park-near-bochum", "neandertal-near-dusseldorf", "rhineland-nature-park-near-cologne", "groote-peel-national-park-near-eindhoven", "de-maasduinen-national-park-near-nijmegen", "hoge-veluwe-national-park-near-arnhem", "sallandse-heuvelrug-national-park-near-enschede", "sint-pietersberg-near-maastricht", "veluwezoom-national-park-near-arnhem", "bergisches-land-near-bochum", "drentsche-aa-near-enschede", "dummer-near-enschede", "hengsteysee-near-bochum", "hurtgen-forest-near-aachen", "mohne-reservoir-near-bochum", "rheinland-nature-park-near-aachen", "sauerland-near-bochum", "siebengebirge-near-aachen", "twickel-near-enschede", "vechte-near-enschede", "vesdre-near-aachen", "ackerdijkse-plassen-near-zoetermeer", "ameland-near-leeuwarden", "ardey-hills-near-gelsenkirchen", "arnsberg-forest-nature-park-near-hamm", "arnsberg-forest-nature-park-near-herne", "baumberge-near-munster", "bergisches-land-near-duisburg"],
    featuredPlaces: ["groote-peel-national-park-near-eindhoven", "de-maasduinen-national-park-near-nijmegen", "eifel-national-park-near-aachen", "hambach-forest-near-cologne", "hoge-veluwe-national-park-near-arnhem", "hohe-mark-nature-park-near-bochum", "neandertal-near-dusseldorf", "rhineland-nature-park-near-cologne"],
    featuredCities: ["arnhem", "cologne", "aachen", "bochum", "dusseldorf", "eindhoven"],
    relatedCollections: ["netherlands-national-parks", "weekend-escapes-near-arnhem", "weekend-escapes-near-cologne", "belgium-germany-borderlands", "belgium-netherlands-borderlands", "central-europe-weekend-escapes", "germany-forests", "germany-luxembourg-borderlands"],
  },
  {
    slug: "germany-poland-borderlands",
    title: "Germany–Poland Borderlands",
    description:
      "Germany–Poland Borderlands groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly mountains, nature areas, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["berlin", "dresden", "gorlitz", "szczecin", "wroclaw", "legnica", "walbrzych", "koszalin", "jelenia-gora", "gorzow-wielkopolski", "stralsund", "zielona-gora", "cottbus", "kolobrzeg"],
    nearbyPlaces: ["lusatian-mountains-near-dresden", "markische-schweiz-nature-park-near-berlin", "saxon-switzerland-national-park-near-dresden", "spreewald-near-berlin", "zittau-mountains-near-gorlitz", "giant-mountains-national-park-near-wroclaw", "szczecin-landscape-park-near-szczecin", "bobr-valley-landscape-park-near-legnica", "bobr-valley-landscape-park-near-walbrzych", "drawa-national-park-near-koszalin", "drawsko-landscape-park-near-koszalin", "giant-mountains-national-park-near-legnica", "giant-mountains-near-walbrzych", "kaczawskie-mountains-near-legnica", "karkonosze-national-park-near-walbrzych", "ksiazanski-landscape-park-near-walbrzych", "owl-mountains-near-walbrzych", "rudawy-landscape-park-near-legnica", "sleza-near-legnica", "stoowe-mountains-national-park-near-legnica", "stoowe-mountains-national-park-near-walbrzych", "wannsee-berlin", "wolin-national-park-near-koszalin", "adrspach-teplice-rocks-near-jelenia-gora", "barlinek-gorzow-landscape-park-near-gorzow-wielkopolski", "bay-of-greifswald-near-stralsund", "chop-lake-near-zielona-gora", "cottbuser-ostsee-near-cottbus", "drawa-national-park-near-gorzow-wielkopolski", "drawa-national-park-near-kolobrzeg"],
    featuredPlaces: ["giant-mountains-national-park-near-wroclaw", "lusatian-mountains-near-dresden", "markische-schweiz-nature-park-near-berlin", "saxon-switzerland-national-park-near-dresden", "spreewald-near-berlin", "szczecin-landscape-park-near-szczecin", "zittau-mountains-near-gorlitz"],
    featuredCities: ["berlin", "dresden", "gorlitz", "szczecin", "wroclaw"],
    relatedCollections: ["weekend-escapes-near-berlin", "czechia-germany-borderlands", "germany-mountains", "poland-national-parks", "czechia-poland-borderlands", "germany-forests", "poland-mountains", "poland-weekend-escapes"],
  },
  {
    slug: "germany-weekend-escapes",
    title: "Germany Weekend Escapes",
    description:
      "Germany Weekend Escapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, lakes, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["cologne", "dortmund", "flensburg", "kiel", "lubeck", "mainz", "munich", "potsdam", "regensburg", "rostock", "trier", "ulm", "ingolstadt", "gelsenkirchen", "hamm"],
    nearbyPlaces: ["ammersee-near-munich", "bavarian-forest-national-park-near-regensburg", "eifel-national-park-near-cologne", "fischland-darss-zingst-near-rostock", "flensburg-fjord-near-flensburg", "grunewald-near-potsdam", "hohe-mark-nature-park-near-dortmund", "holstein-switzerland-near-kiel", "hunsruck-hochwald-national-park-near-trier", "schaalsee-near-lubeck", "siebengebirge-near-cologne", "taunus-near-mainz", "adelegg-near-ulm", "altmuhl-valley-nature-park-near-ingolstadt", "ardey-hills-near-gelsenkirchen", "arnsberg-forest-nature-park-near-hamm", "arnsberg-forest-nature-park-near-herne", "baumberge-near-munster", "bergisches-land-near-duisburg", "bergisches-land-near-gelsenkirchen", "bergisches-land-near-krefeld", "bergisches-land-near-leverkusen", "bergisches-land-near-mulheim-an-der-ruhr", "bergisches-land-near-neuss", "bergisches-land-near-solingen", "bergisches-land-near-wuppertal", "bigge-reservoir-near-herne", "biggesee-near-wuppertal", "blautopf-near-ulm", "de-maasduinen-national-park-near-monchengladbach"],
    featuredPlaces: ["ammersee-near-munich", "bavarian-forest-national-park-near-regensburg", "eifel-national-park-near-cologne", "fischland-darss-zingst-near-rostock", "flensburg-fjord-near-flensburg", "grunewald-near-potsdam", "hohe-mark-nature-park-near-dortmund", "holstein-switzerland-near-kiel"],
    featuredCities: ["cologne", "dortmund", "flensburg", "kiel", "lubeck", "mainz"],
    relatedCollections: ["denmark-germany-borderlands", "germany-forests", "france-germany-borderlands", "germany-luxembourg-borderlands", "germany-mountains", "weekend-escapes-near-hamburg", "weekend-escapes-near-munich", "germany-lakes"],
  },
  {
    slug: "greece-mountains",
    title: "Greece Mountains",
    description:
      "Greece Mountains groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["athens", "heraklion", "ioannina", "kavala", "larissa", "volos", "acharnes", "peristeri", "nikaia", "patras", "thessaloniki", "piraeus", "kalamata", "corfu"],
    nearbyPlaces: ["mount-geraneia-near-athens", "mount-hymettus-near-athens", "mount-ida-crete-near-heraklion", "mount-ossa-near-larissa", "mount-pangaion-near-kavala", "mount-pelion-near-volos", "mount-parnitha-near-athens", "tymfi-near-ioannina", "antichasia-mountains-near-larissa", "mount-olympus-near-larissa", "pelion-near-larissa", "cithaeron-near-acharnes", "geraneia-near-peristeri", "hymettus-near-nikaia", "hymettus-near-peristeri", "mount-chelmos-aroania-near-patras", "mount-chortiatis-near-thessaloniki", "mount-erymanthos-near-patras", "mount-hymettus-near-acharnes", "mount-hymettus-near-piraeus", "mount-paiko-near-thessaloniki", "mount-panachaiko-near-patras", "mount-parnitha-near-acharnes", "mount-pentelicus-near-acharnes", "mount-pentelicus-near-nikaia", "mount-pentelicus-near-peristeri", "mount-pentelicus-near-piraeus", "mount-ithome-near-kalamata", "mount-lykaion-near-kalamata", "mount-pantokrator-near-corfu"],
    featuredPlaces: ["mount-geraneia-near-athens", "mount-hymettus-near-athens", "mount-ida-crete-near-heraklion", "mount-ossa-near-larissa", "mount-pangaion-near-kavala", "mount-pelion-near-volos", "mount-parnitha-near-athens", "tymfi-near-ioannina"],
    featuredCities: ["athens", "heraklion", "ioannina", "kavala", "larissa", "volos"],
    relatedCollections: ["greece-weekend-escapes", "weekend-escapes-near-athens", "southern-europe-mountains", "southern-europe-weekend-escapes", "european-lakes", "australia-mountains", "austria-mountains", "canada-mountains"],
  },
  {
    slug: "greece-weekend-escapes",
    title: "Greece Weekend Escapes",
    description:
      "Greece Weekend Escapes groups 30 nearby places across 9 cities for local-first day and weekend discovery — mainly mountains, lakes, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["chania", "heraklion", "ioannina", "kavala", "larissa", "thessaloniki", "corfu", "komotini", "alexandroupoli"],
    nearbyPlaces: ["lake-kournas-near-chania", "lake-pamvotida-near-ioannina", "mount-ida-crete-near-heraklion", "mount-ossa-near-larissa", "mount-pangaion-near-kavala", "samaria-gorge-near-chania", "tymfi-near-ioannina", "vale-of-tempe-near-larissa", "antichasia-mountains-near-larissa", "falasarna-near-chania", "frangokastello-near-chania", "gramvousa-near-chania", "lake-karla-near-larissa", "lefka-ori-near-chania", "mount-olympus-near-larissa", "pelion-near-larissa", "axios-delta-national-park-near-thessaloniki", "kedrinos-lofos-seih-sou-forest-near-thessaloniki", "lake-koroneia-near-thessaloniki", "lake-volvi-near-thessaloniki", "mount-chortiatis-near-thessaloniki", "mount-paiko-near-thessaloniki", "acheron-near-corfu", "antipaxos-near-corfu", "butrint-national-park-near-corfu", "ereikoussa-near-corfu", "kompsatos-near-komotini", "korission-lagoon-near-corfu", "lake-vistonida-near-alexandroupoli", "lake-vistonida-near-komotini"],
    featuredPlaces: ["lake-kournas-near-chania", "lake-pamvotida-near-ioannina", "mount-ida-crete-near-heraklion", "mount-ossa-near-larissa", "mount-pangaion-near-kavala", "samaria-gorge-near-chania", "tymfi-near-ioannina", "vale-of-tempe-near-larissa"],
    featuredCities: ["chania", "ioannina", "larissa", "heraklion", "kavala"],
    relatedCollections: ["greece-mountains", "southern-europe-weekend-escapes", "european-lakes", "southern-europe-mountains", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "hungary-poland-borderlands",
    title: "Hungary–Poland Borderlands",
    description:
      "Hungary–Poland Borderlands groups 30 nearby places across 13 cities for local-first day and weekend discovery — mainly mountains, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["krakow", "miskolc", "zakopane", "bielsko-biala", "chorzow", "tychy", "tarnow", "rybnik", "bytom", "dabrowa-gornicza", "ruda-slaska", "zabrze", "debrecen"],
    nearbyPlaces: ["aggtelek-national-park-near-miskolc", "beskids-near-krakow", "pieniny-near-krakow", "tatra-mountains-near-krakow", "tatra-national-park-near-zakopane", "bukk-mountains-near-miskolc", "hortobagy-national-park-near-miskolc", "lake-tisza-near-miskolc", "zemplen-mountains-near-miskolc", "babia-gora-national-park-near-bielsko-biala", "babia-gora-national-park-near-chorzow", "beskid-mountains-near-tychy", "ciezkowice-roznow-landscape-park-near-tarnow", "czantoria-wielka-near-rybnik", "goczakowice-lake-near-bytom", "goczakowice-lake-near-chorzow", "goczakowice-lake-near-dabrowa-gornicza", "goczakowice-lake-near-ruda-slaska", "goczakowice-lake-near-rybnik", "goczakowice-reservoir-near-zabrze", "goczalkowice-reservoir-near-tychy", "gorce-national-park-near-tarnow", "hortobagy-national-park-near-debrecen", "krakow-czestochowa-upland-near-bytom", "krakow-czestochowa-upland-near-dabrowa-gornicza", "lake-roznow-near-tarnow", "little-beskids-near-bielsko-biala", "little-beskids-near-chorzow", "little-beskids-near-ruda-slaska", "little-beskids-near-tychy"],
    featuredPlaces: ["aggtelek-national-park-near-miskolc", "beskids-near-krakow", "pieniny-near-krakow", "tatra-mountains-near-krakow", "tatra-national-park-near-zakopane"],
    featuredCities: ["krakow", "miskolc", "zakopane"],
    relatedCollections: ["poland-slovakia-borderlands", "poland-mountains", "weekend-escapes-near-krakow", "hungary-slovakia-borderlands", "carpathians", "central-europe-weekend-escapes", "poland-national-parks", "weekend-escapes-near-budapest"],
  },
  {
    slug: "hungary-slovakia-borderlands",
    title: "Hungary–Slovakia Borderlands",
    description:
      "Hungary–Slovakia Borderlands groups 30 nearby places across 11 cities for local-first day and weekend discovery — mainly parks, nature areas, mountains. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["banska-bystrica", "budapest", "kosice", "miskolc", "presov", "gyor", "debrecen", "nyiregyhaza", "szekesfehervar", "poprad", "sopron"],
    nearbyPlaces: ["aggtelek-national-park-near-miskolc", "bukk-national-park-near-budapest", "danube-ipoly-national-park-near-budapest", "pieniny-national-park-near-presov", "polana-near-banska-bystrica", "slovak-paradise-national-park-near-kosice", "bukk-mountains-near-miskolc", "cergov-near-presov", "hortobagy-national-park-near-miskolc", "lake-tisza-near-miskolc", "levoca-mountains-near-presov", "poloniny-national-park-near-presov", "tatra-national-park-near-presov", "zemplen-mountains-near-miskolc", "bakony-near-gyor", "gerecse-mountains-near-gyor", "hortobagy-national-park-near-debrecen", "lake-oreg-near-gyor", "aggtelek-karst-near-nyiregyhaza", "badacsony-near-szekesfehervar", "bakony-near-szekesfehervar", "balaton-uplands-national-park-near-szekesfehervar", "belianske-tatras-near-poprad", "bukk-national-park-near-nyiregyhaza", "dunajec-river-gorge-near-poprad", "ferto-hansag-national-park-near-gyor", "ferto-hansag-national-park-near-sopron", "gerecse-mountains-near-szekesfehervar", "gerlachovsky-stit-near-poprad", "geschriebenstein-near-sopron"],
    featuredPlaces: ["aggtelek-national-park-near-miskolc", "bukk-national-park-near-budapest", "danube-ipoly-national-park-near-budapest", "pieniny-national-park-near-presov", "polana-near-banska-bystrica", "slovak-paradise-national-park-near-kosice"],
    featuredCities: ["budapest", "banska-bystrica", "kosice", "miskolc", "presov"],
    relatedCollections: ["poland-slovakia-borderlands", "weekend-escapes-near-budapest", "central-europe-weekend-escapes", "hungary-poland-borderlands", "european-mountains", "weekend-escapes-near-bratislava", "czechia-slovakia-borderlands", "european-lakes"],
  },
  {
    slug: "ireland-mountains",
    title: "Ireland Mountains",
    description:
      "Ireland Mountains groups 13 nearby places across 11 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["athlone", "cork", "drogheda", "galway", "kilkenny", "killarney", "limerick", "sligo", "tralee", "waterford", "bray"],
    nearbyPlaces: ["ballyhoura-mountains-near-limerick", "benbulbin-near-sligo", "blackstairs-mountains-near-kilkenny", "comeragh-mountains-near-waterford", "cooley-mountains-near-drogheda", "galtee-mountains-near-cork", "macgillycuddys-reeks-near-killarney", "maumturks-near-galway", "slieve-bloom-mountains-near-athlone", "slieve-mish-mountains-near-tralee", "loughcrew-near-drogheda", "djouce-near-bray", "great-sugar-loaf-near-bray"],
    featuredPlaces: ["ballyhoura-mountains-near-limerick", "benbulbin-near-sligo", "blackstairs-mountains-near-kilkenny", "comeragh-mountains-near-waterford", "cooley-mountains-near-drogheda", "galtee-mountains-near-cork", "macgillycuddys-reeks-near-killarney", "maumturks-near-galway"],
    featuredCities: ["athlone", "cork", "drogheda", "galway", "kilkenny", "killarney"],
    relatedCollections: ["weekend-escapes-near-cork", "ireland-united-kingdom-borderlands", "weekend-escapes-near-dublin", "weekend-escapes-near-galway", "western-europe-weekend-escapes", "european-forests", "european-islands", "australia-mountains"],
  },
  {
    slug: "ireland-united-kingdom-borderlands",
    title: "Ireland–United Kingdom Borderlands",
    description:
      "Ireland–United Kingdom Borderlands groups 21 nearby places across 7 cities for local-first day and weekend discovery — mainly mountains, waterfronts, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["belfast", "derry", "drogheda", "dublin", "letterkenny", "sligo", "bray"],
    nearbyPlaces: ["benbulbin-near-sligo", "cooley-mountains-near-drogheda", "lough-swilly-near-letterkenny", "phoenix-park-dublin", "cave-hill-near-belfast", "lough-foyle-near-derry", "mourne-mountains-near-belfast", "slieve-croob-near-belfast", "sperrins-near-derry", "bettystown-near-drogheda", "clogherhead-near-drogheda", "hill-of-tara-near-drogheda", "loughcrew-near-drogheda", "bray-head-near-bray", "dalkey-island-near-bray", "djouce-near-bray", "great-sugar-loaf-near-bray", "killiney-hill-near-bray", "lough-tay-near-bray", "powerscourt-waterfall-near-bray", "wicklow-mountains-national-park-near-bray"],
    featuredPlaces: ["benbulbin-near-sligo", "cave-hill-near-belfast", "cooley-mountains-near-drogheda", "lough-foyle-near-derry", "lough-swilly-near-letterkenny", "mourne-mountains-near-belfast", "phoenix-park-dublin", "slieve-croob-near-belfast"],
    featuredCities: ["belfast", "derry", "drogheda", "dublin", "letterkenny", "sligo"],
    relatedCollections: ["weekend-escapes-near-belfast", "united-kingdom-mountains", "ireland-mountains", "weekend-escapes-near-dublin", "ireland-weekend-escapes", "weekend-escapes-near-galway", "western-europe-weekend-escapes", "european-islands"],
  },
  {
    slug: "ireland-weekend-escapes",
    title: "Ireland Weekend Escapes",
    description:
      "Ireland Weekend Escapes groups 29 nearby places across 7 cities for local-first day and weekend discovery — mainly parks, mountains, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["dublin", "dundalk", "letterkenny", "swords", "westport", "bray", "ennis"],
    nearbyPlaces: ["connemara-national-park-near-westport", "cooley-mountains-near-dundalk", "lough-swilly-near-letterkenny", "north-bull-island-near-swords", "wicklow-mountains-near-dublin", "cuilcagh-near-dundalk", "howth-head-near-swords", "ireland-s-eye-near-swords", "malahide-near-swords", "mourne-mountains-near-dundalk", "ravensdale-near-dundalk", "rogerstown-estuary-near-swords", "slieve-foye-near-dundalk", "phoenix-park-dublin", "bray-head-near-bray", "burren-national-park-near-ennis", "cliffs-of-moher-near-ennis", "coole-park-near-ennis", "dalkey-island-near-bray", "djouce-near-bray", "fanore-near-ennis", "great-sugar-loaf-near-bray", "inchiquin-lough-near-ennis", "killiney-hill-near-bray", "lahinch-beach-near-ennis", "lough-tay-near-bray", "powerscourt-waterfall-near-bray", "the-burren-near-ennis", "wicklow-mountains-national-park-near-bray"],
    featuredPlaces: ["connemara-national-park-near-westport", "cooley-mountains-near-dundalk", "lough-swilly-near-letterkenny", "north-bull-island-near-swords", "wicklow-mountains-near-dublin"],
    featuredCities: ["dublin", "dundalk", "letterkenny", "swords", "westport"],
    relatedCollections: ["ireland-united-kingdom-borderlands", "western-europe-weekend-escapes", "weekend-escapes-near-dublin", "weekend-escapes-near-galway", "european-islands", "european-lakes", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
  },
  {
    slug: "italy-coast",
    title: "Italy Coast",
    description:
      "Italy Coast groups 14 nearby places across 8 cities for local-first day and weekend discovery — mainly waterfronts, beaches. This is a geographic discovery collection derived from a shared coastline; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "coastal_region",
    cities: ["cagliari", "naples", "salerno", "taranto", "venice", "giugliano-in-campania", "brindisi", "matera"],
    nearbyPlaces: ["amalfi-coast-near-salerno", "cavallino-treporti-near-venice", "gulf-of-taranto-near-taranto", "poetto-near-cagliari", "sorrentine-peninsula-near-naples", "cape-palinuro-near-salerno", "cheradi-islands-near-taranto", "porto-cesareo-near-taranto", "ischia-near-giugliano-in-campania", "procida-near-giugliano-in-campania", "gulf-of-taranto-near-brindisi", "metaponto-near-matera", "santa-maria-di-leuca-near-brindisi", "strait-of-otranto-near-brindisi"],
    featuredPlaces: ["amalfi-coast-near-salerno", "cavallino-treporti-near-venice", "gulf-of-taranto-near-taranto", "poetto-near-cagliari", "sorrentine-peninsula-near-naples"],
    featuredCities: ["cagliari", "naples", "salerno", "taranto", "venice"],
    relatedCollections: ["european-coast", "weekend-escapes-near-naples", "italy-weekend-escapes", "southern-europe-weekend-escapes", "weekend-escapes-near-venice", "italy-mountains", "italy-national-parks", "european-islands"],
  },
  {
    slug: "italy-lakes",
    title: "Italy Lakes",
    description:
      "Italy Lakes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["bergamo", "como", "florence", "milan", "perugia", "pisa", "rome", "trento", "monza", "prato", "cremona", "latina", "brescia", "vicenza", "pavia"],
    nearbyPlaces: ["bracciano-lake-near-rome", "lake-bilancino-near-florence", "lake-como-near-como", "lake-garda-near-trento", "lake-iseo-near-bergamo", "lake-maggiore-near-milan", "lake-massaciuccoli-near-pisa", "lake-trasimeno-near-perugia", "lake-annone-near-monza", "lake-bilancino-near-prato", "lake-como-near-cremona", "lake-como-near-monza", "lake-fogliano-near-latina", "lake-garda-near-brescia", "lake-garda-near-cremona", "lake-garda-near-vicenza", "lake-iseo-near-brescia", "lake-iseo-near-pavia", "lake-lugano-near-varese", "lake-maggiore-near-varese", "lake-massaciuccoli-near-la-spezia", "lake-massaciuccoli-near-pistoia", "lake-massaciuccoli-near-prato", "lake-of-pusiano-near-monza", "lake-piediluco-near-terni", "lake-ridracoli-near-cesena", "lake-ridracoli-near-forli", "lake-varese-near-varese", "lake-vico-near-terni", "santo-lake-modena-near-modena"],
    featuredPlaces: ["bracciano-lake-near-rome", "lake-bilancino-near-florence", "lake-como-near-como", "lake-garda-near-trento", "lake-iseo-near-bergamo", "lake-maggiore-near-milan", "lake-massaciuccoli-near-pisa", "lake-trasimeno-near-perugia"],
    featuredCities: ["bergamo", "como", "florence", "milan", "perugia", "pisa"],
    relatedCollections: ["weekend-escapes-near-milan", "weekend-escapes-near-florence", "weekend-escapes-near-rome", "italy-weekend-escapes", "italy-mountains", "italy-national-parks", "austria-lakes", "european-lakes"],
  },
  {
    slug: "italy-mountains",
    title: "Italy Mountains",
    description:
      "Italy Mountains groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["aosta", "bolzano", "catania", "como", "laquila", "lucca", "naples", "palermo", "reggio-emilia", "trento", "turin", "udine", "venice", "verona", "la-spezia"],
    nearbyPlaces: ["alpi-apuane-near-lucca", "appennino-tosco-emiliano-national-park-near-reggio-emilia", "carnic-alps-near-udine", "dolomites-near-bolzano", "dolomiti-bellunesi-national-park-near-venice", "gran-paradiso-national-park-near-turin", "lessinia-regional-park-near-verona", "madonie-park-near-palermo", "maiella-national-park-near-laquila", "maritime-alps-natural-park-near-turin", "matese-regional-park-near-naples", "mont-blanc-near-aosta", "monte-baldo-near-verona", "monte-cusna-near-reggio-emilia", "monte-generoso-near-como", "mount-etna-near-catania", "orsiera-rocciavre-natural-park-near-turin", "paganella-near-trento", "vesuvius-national-park-near-naples", "alpe-di-succiso-near-reggio-emilia", "monte-cimone-near-reggio-emilia", "pietra-di-bismantova-near-reggio-emilia", "apuan-alps-near-la-spezia", "asiago-plateau-near-vicenza", "aurunci-mountains-near-latina", "cima-palon-pasubio-near-vicenza", "lessinia-near-vicenza", "matese-near-caserta", "montalbano-near-pistoia", "monte-barro-near-monza"],
    featuredPlaces: ["alpi-apuane-near-lucca", "appennino-tosco-emiliano-national-park-near-reggio-emilia", "carnic-alps-near-udine", "dolomites-near-bolzano", "dolomiti-bellunesi-national-park-near-venice", "gran-paradiso-national-park-near-turin", "lessinia-regional-park-near-verona", "madonie-park-near-palermo"],
    featuredCities: ["turin", "naples", "reggio-emilia", "verona", "aosta", "bolzano"],
    relatedCollections: ["italy-national-parks", "italy-weekend-escapes", "weekend-escapes-near-venice", "france-italy-borderlands", "weekend-escapes-near-milan", "austria-italy-borderlands", "eastern-alps", "southern-europe-mountains"],
  },
  {
    slug: "italy-national-parks",
    title: "Italy National Parks",
    description:
      "Italy National Parks groups 23 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains, nature areas, parks. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["bari", "laquila", "naples", "reggio-emilia", "rome", "turin", "venice", "modena", "la-spezia", "latina", "treviso", "foggia", "terni", "giugliano-in-campania", "brindisi"],
    nearbyPlaces: ["alta-murgia-national-park-near-bari", "appennino-tosco-emiliano-national-park-near-reggio-emilia", "circeo-national-park-near-rome", "dolomiti-bellunesi-national-park-near-venice", "gran-paradiso-national-park-near-turin", "gran-sasso-and-monti-della-laga-national-park-near-laquila", "maiella-national-park-near-laquila", "vesuvius-national-park-near-naples", "appennino-tosco-emiliano-national-park-near-modena", "cinque-terre-national-park-near-la-spezia", "circeo-national-park-near-latina", "dolomiti-bellunesi-national-park-near-treviso", "gargano-national-park-near-foggia", "monti-sibillini-national-park-near-terni", "vesuvius-national-park-near-giugliano-in-campania", "alta-murgia-national-park-near-brindisi", "alta-murgia-national-park-near-matera", "appennino-tosco-emiliano-national-park-near-piacenza", "dolomiti-bellunesi-national-park-near-belluno", "gran-paradiso-national-park-near-novara", "monti-sibillini-national-park-near-arezzo", "tuscan-emilian-apennines-national-park-near-mantua", "val-grande-national-park-near-novara"],
    featuredPlaces: ["alta-murgia-national-park-near-bari", "appennino-tosco-emiliano-national-park-near-reggio-emilia", "circeo-national-park-near-rome", "dolomiti-bellunesi-national-park-near-venice", "gran-paradiso-national-park-near-turin", "gran-sasso-and-monti-della-laga-national-park-near-laquila", "maiella-national-park-near-laquila", "vesuvius-national-park-near-naples"],
    featuredCities: ["laquila", "bari", "naples", "reggio-emilia", "rome", "turin"],
    relatedCollections: ["italy-mountains", "weekend-escapes-near-rome", "france-italy-borderlands", "italy-weekend-escapes", "southern-europe-mountains", "southern-europe-weekend-escapes", "weekend-escapes-near-milan", "weekend-escapes-near-naples"],
  },
  {
    slug: "italy-protected-landscapes",
    title: "Italy Protected Landscapes",
    description:
      "Italy Protected Landscapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["bologna", "genoa", "padua", "trapani", "turin", "udine", "cesena", "forli", "pavia", "modena", "pistoia", "la-spezia", "vicenza", "treviso", "asti"],
    nearbyPlaces: ["euganean-hills-near-padua", "gessi-bolognesi-park-near-bologna", "julian-prealps-natural-park-near-udine", "la-mandria-regional-park-near-turin", "portofino-regional-park-near-genoa", "zingaro-nature-reserve-near-trapani", "acquacheta-waterfall-near-cesena", "acquacheta-waterfall-near-forli", "antola-natural-regional-park-near-pavia", "appennino-tosco-emiliano-national-park-near-modena", "apuan-alps-regional-park-near-pistoia", "aveto-natural-regional-park-near-la-spezia", "berici-hills-near-vicenza", "cansiglio-near-treviso", "capanne-di-marcarolo-natural-park-near-asti", "casentinesi-forests-monte-falterona-and-campigna-national-park-near-pistoia", "cinque-terre-national-park-near-la-spezia", "dolomiti-bellunesi-national-park-near-treviso", "euganean-hills-near-vicenza", "foreste-casentinesi-monte-falterona-and-campigna-national-park-near-forli", "foreste-casentinesi-monte-falterona-campigna-national-park-near-cesena", "foreste-casentinesi-monte-falterona-campigna-national-park-near-prato", "langhe-near-asti", "lombardy-ticino-valley-natural-park-near-pavia", "magra-near-la-spezia", "montferrat-near-asti", "montone-river-near-forli", "oglio-river-near-cremona", "oltrepo-pavese-near-pavia", "parco-naturale-lombardo-della-valle-del-ticino-near-varese"],
    featuredPlaces: ["euganean-hills-near-padua", "gessi-bolognesi-park-near-bologna", "julian-prealps-natural-park-near-udine", "la-mandria-regional-park-near-turin", "portofino-regional-park-near-genoa", "zingaro-nature-reserve-near-trapani"],
    featuredCities: ["bologna", "genoa", "padua", "trapani", "turin", "udine"],
    relatedCollections: ["weekend-escapes-near-milan", "weekend-escapes-near-venice", "austria-italy-borderlands", "france-italy-borderlands", "italy-slovenia-borderlands", "italy-weekend-escapes", "weekend-escapes-near-florence", "italy-mountains"],
  },
  {
    slug: "italy-slovenia-borderlands",
    title: "Italy–Slovenia Borderlands",
    description:
      "Italy–Slovenia Borderlands groups 30 nearby places across 10 cities for local-first day and weekend discovery — mainly mountains, nature areas, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["celje", "kranj", "ljubljana", "udine", "treviso", "trieste", "maribor", "belluno", "koper", "mantua"],
    nearbyPlaces: ["carnic-alps-near-udine", "julian-prealps-natural-park-near-udine", "kamniksavinja-alps-near-celje", "triglav-national-park-near-kranj", "vipava-valley-near-ljubljana", "donacka-gora-near-celje", "savinja-near-celje", "cansiglio-near-treviso", "castello-di-miramare-near-trieste", "dolomiti-bellunesi-national-park-near-treviso", "lago-di-santa-croce-near-treviso", "lakes-of-revine-lago-near-treviso", "piave-river-near-treviso", "pohorje-near-maribor", "ampezzo-dolomites-natural-park-near-belluno", "antelao-near-belluno", "cansiglio-near-belluno", "dolomiti-bellunesi-national-park-near-belluno", "karst-plateau-near-koper", "lago-di-santa-croce-near-belluno", "lake-cerknica-near-koper", "lessinia-regional-park-near-mantua", "monte-baldo-near-mantua", "monte-civetta-near-belluno", "monte-pelmo-near-belluno", "nanos-near-koper", "paneveggio-pale-di-san-martino-natural-park-near-belluno", "postojna-cave-near-koper", "sile-river-near-treviso", "skocjan-caves-near-koper"],
    featuredPlaces: ["carnic-alps-near-udine", "julian-prealps-natural-park-near-udine", "kamniksavinja-alps-near-celje", "triglav-national-park-near-kranj", "vipava-valley-near-ljubljana"],
    featuredCities: ["udine", "celje", "kranj", "ljubljana"],
    relatedCollections: ["austria-slovenia-borderlands", "weekend-escapes-near-ljubljana", "croatia-slovenia-borderlands", "austria-italy-borderlands", "weekend-escapes-near-venice", "european-mountains", "central-europe-mountains", "central-europe-weekend-escapes"],
  },
  {
    slug: "italy-weekend-escapes",
    title: "Italy Weekend Escapes",
    description:
      "Italy Weekend Escapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains, nature areas, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["ancona", "aosta", "bari", "bolzano", "cagliari", "catania", "milan", "palermo", "pisa", "ravenna", "trapani", "trento", "cesena", "forli", "brescia"],
    nearbyPlaces: ["alta-murgia-national-park-near-bari", "apuan-alps-near-pisa", "comacchio-near-ravenna", "dolomites-near-bolzano", "favignana-near-trapani", "frasassi-caves-near-ancona", "lake-como-near-milan", "lake-garda-near-trento", "lake-iseo-near-milan", "madonie-park-near-palermo", "mont-blanc-near-aosta", "mount-etna-near-catania", "paganella-near-trento", "poetto-near-cagliari", "zingaro-nature-reserve-near-trapani", "acquacheta-waterfall-near-cesena", "acquacheta-waterfall-near-forli", "adamello-brenta-natural-park-near-brescia", "adda-river-near-cremona", "aeolian-islands-near-messina", "alcantara-near-reggio-calabria", "altopiano-delle-murge-near-taranto", "appennino-tosco-emiliano-national-park-near-modena", "apuan-alps-near-la-spezia", "apuan-alps-regional-park-near-pistoia", "asiago-plateau-near-vicenza", "aspromonte-national-park-near-catanzaro", "aspromonte-national-park-near-messina", "aveto-natural-regional-park-near-la-spezia", "berici-hills-near-vicenza"],
    featuredPlaces: ["alta-murgia-national-park-near-bari", "apuan-alps-near-pisa", "comacchio-near-ravenna", "dolomites-near-bolzano", "favignana-near-trapani", "frasassi-caves-near-ancona", "lake-como-near-milan", "lake-garda-near-trento"],
    featuredCities: ["milan", "trapani", "trento", "ancona", "aosta", "bari"],
    relatedCollections: ["italy-mountains", "italy-lakes", "austria-italy-borderlands", "eastern-alps", "european-coast", "france-italy-borderlands", "italy-coast", "italy-national-parks"],
  },
  {
    slug: "latvia-lithuania-borderlands",
    title: "Latvia–Lithuania Borderlands",
    description:
      "Latvia–Lithuania Borderlands groups 26 nearby places across 7 cities for local-first day and weekend discovery — mainly parks, nature areas. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["daugavpils", "panevezys", "riga", "vilnius", "siauliai", "alytus", "liepaja"],
    nearbyPlaces: ["aukstaitija-national-park-near-daugavpils", "kemeri-national-park-near-riga", "anyksciai-regional-park-near-panevezys", "birzai-regional-park-near-panevezys", "trakai-historical-national-park-near-vilnius", "verkiai-regional-park-near-vilnius", "augsdaugava-protected-landscape-near-daugavpils", "grazute-regional-park-near-panevezys", "krustkalni-nature-reserve-near-daugavpils", "labanoras-regional-park-near-panevezys", "lake-sartai-near-panevezys", "lake-tauragnas-near-panevezys", "teici-nature-reserve-near-daugavpils", "lake-rekyva-near-siauliai", "aukstadvaris-regional-park-near-alytus", "bartuva-river-near-liepaja", "cepkeliai-marsh-near-alytus", "dzukija-national-park-near-alytus", "lake-dusia-near-alytus", "meteliai-regional-park-near-alytus", "nemunas-loops-regional-park-near-alytus", "plateliai-lake-near-liepaja", "trakai-historical-national-park-near-alytus", "zemaitija-national-park-near-liepaja", "zemaitija-national-park-near-siauliai", "zuvintas-biosphere-reserve-near-alytus"],
    featuredPlaces: ["anyksciai-regional-park-near-panevezys", "aukstaitija-national-park-near-daugavpils", "birzai-regional-park-near-panevezys", "kemeri-national-park-near-riga", "trakai-historical-national-park-near-vilnius", "verkiai-regional-park-near-vilnius"],
    featuredCities: ["panevezys", "vilnius", "daugavpils", "riga"],
    relatedCollections: ["weekend-escapes-near-vilnius", "baltic-europe-weekend-escapes", "latvia-weekend-escapes", "austria-czechia-borderlands", "austria-germany-borderlands", "austria-italy-borderlands", "austria-slovenia-borderlands", "belgium-germany-borderlands"],
  },
  {
    slug: "latvia-weekend-escapes",
    title: "Latvia Weekend Escapes",
    description:
      "Latvia Weekend Escapes groups 8 nearby places across 3 cities for local-first day and weekend discovery — mainly parks, nature areas, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["cesis", "daugavpils", "riga"],
    nearbyPlaces: ["aukstaitija-national-park-near-daugavpils", "gauja-national-park-near-cesis", "kemeri-national-park-near-riga", "lake-burtnieks-near-cesis", "razna-national-park-near-daugavpils", "augsdaugava-protected-landscape-near-daugavpils", "krustkalni-nature-reserve-near-daugavpils", "teici-nature-reserve-near-daugavpils"],
    featuredPlaces: ["aukstaitija-national-park-near-daugavpils", "gauja-national-park-near-cesis", "kemeri-national-park-near-riga", "lake-burtnieks-near-cesis", "razna-national-park-near-daugavpils"],
    featuredCities: ["cesis", "daugavpils", "riga"],
    relatedCollections: ["latvia-lithuania-borderlands", "baltic-europe-weekend-escapes", "european-lakes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "netherlands-national-parks",
    title: "Netherlands National Parks",
    description:
      "Netherlands National Parks groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks, beaches. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["amsterdam", "arnhem", "delft", "eindhoven", "enschede", "groningen", "nijmegen", "s-hertogenbosch", "utrecht", "leeuwarden", "alphen-aan-den-rijn", "dordrecht", "ede", "zoetermeer", "amersfoort"],
    nearbyPlaces: ["de-biesbosch-national-park-near-delft", "groote-peel-national-park-near-eindhoven", "de-loonse-en-drunense-duinen-national-park-near-s-hertogenbosch", "de-maasduinen-national-park-near-nijmegen", "hoge-veluwe-national-park-near-arnhem", "lauwersmeer-national-park-near-groningen", "sallandse-heuvelrug-national-park-near-enschede", "utrechtse-heuvelrug-national-park-near-utrecht", "veluwezoom-national-park-near-arnhem", "weerribben-wieden-national-park-near-enschede", "zuid-kennemerland-national-park-near-amsterdam", "de-maasduinen-national-park-near-s-hertogenbosch", "de-alde-feanen-national-park-near-leeuwarden", "de-biesbosch-national-park-near-alphen-aan-den-rijn", "de-biesbosch-national-park-near-dordrecht", "de-biesbosch-national-park-near-ede", "de-biesbosch-national-park-near-zoetermeer", "de-hoge-veluwe-national-park-near-alphen-aan-den-rijn", "de-hoge-veluwe-national-park-near-amersfoort", "de-hoge-veluwe-national-park-near-apeldoorn", "de-hoge-veluwe-national-park-near-dordrecht", "de-hoge-veluwe-national-park-near-haarlemmermeer", "de-loonse-en-drunense-duinen-national-park-near-amersfoort", "de-loonse-en-drunense-duinen-national-park-near-dordrecht", "de-loonse-en-drunense-duinen-national-park-near-zoetermeer", "drents-friese-wold-national-park-near-leeuwarden", "hoge-veluwe-national-park-near-ede", "oosterschelde-national-park-near-dordrecht", "oosterschelde-national-park-near-westland", "sallandse-heuvelrug-national-park-near-apeldoorn"],
    featuredPlaces: ["de-biesbosch-national-park-near-delft", "groote-peel-national-park-near-eindhoven", "de-loonse-en-drunense-duinen-national-park-near-s-hertogenbosch", "de-maasduinen-national-park-near-nijmegen", "hoge-veluwe-national-park-near-arnhem", "lauwersmeer-national-park-near-groningen", "sallandse-heuvelrug-national-park-near-enschede", "utrechtse-heuvelrug-national-park-near-utrecht"],
    featuredCities: ["arnhem", "enschede", "amsterdam", "delft", "eindhoven", "groningen"],
    relatedCollections: ["weekend-escapes-near-arnhem", "germany-netherlands-borderlands", "belgium-netherlands-borderlands", "weekend-escapes-near-rotterdam", "western-europe-weekend-escapes", "weekend-escapes-near-amsterdam", "european-coast", "netherlands-weekend-escapes"],
  },
  {
    slug: "netherlands-weekend-escapes",
    title: "Netherlands Weekend Escapes",
    description:
      "Netherlands Weekend Escapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["amsterdam", "haarlem", "rotterdam", "tilburg", "zwolle", "zoetermeer", "leeuwarden", "alphen-aan-den-rijn", "dordrecht", "ede", "westland", "amersfoort", "apeldoorn", "haarlemmermeer", "zaanstad"],
    nearbyPlaces: ["de-biesbosch-national-park-near-rotterdam", "loonse-en-drunense-duinen-national-park-near-tilburg", "midden-delfland-near-rotterdam", "oostvaardersplassen-near-amsterdam", "sallandse-heuvelrug-national-park-near-zwolle", "zuid-kennemerland-national-park-near-haarlem", "ackerdijkse-plassen-near-zoetermeer", "berkheide-near-zoetermeer", "burgumer-mar-near-leeuwarden", "de-alde-feanen-national-park-near-leeuwarden", "de-biesbosch-national-park-near-alphen-aan-den-rijn", "de-biesbosch-national-park-near-dordrecht", "de-biesbosch-national-park-near-ede", "de-biesbosch-national-park-near-zoetermeer", "de-biesbosch-near-westland", "de-hoge-veluwe-national-park-near-alphen-aan-den-rijn", "de-hoge-veluwe-national-park-near-amersfoort", "de-hoge-veluwe-national-park-near-apeldoorn", "de-hoge-veluwe-national-park-near-dordrecht", "de-hoge-veluwe-national-park-near-haarlemmermeer", "de-loonse-en-drunense-duinen-national-park-near-amersfoort", "de-loonse-en-drunense-duinen-national-park-near-dordrecht", "de-loonse-en-drunense-duinen-national-park-near-zoetermeer", "drents-friese-wold-national-park-near-leeuwarden", "eemmeer-near-amersfoort", "frisian-lakes-near-leeuwarden", "hoge-veluwe-national-park-near-ede", "hook-of-holland-beach-near-westland", "ijsselmeer-near-zaanstad", "kagerplassen-near-alphen-aan-den-rijn"],
    featuredPlaces: ["de-biesbosch-national-park-near-rotterdam", "loonse-en-drunense-duinen-national-park-near-tilburg", "midden-delfland-near-rotterdam", "oostvaardersplassen-near-amsterdam", "sallandse-heuvelrug-national-park-near-zwolle", "zuid-kennemerland-national-park-near-haarlem"],
    featuredCities: ["rotterdam", "amsterdam", "haarlem", "tilburg", "zwolle"],
    relatedCollections: ["weekend-escapes-near-amsterdam", "weekend-escapes-near-rotterdam", "european-coast", "netherlands-national-parks", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "new-zealand-mountains",
    title: "New Zealand Mountains",
    description:
      "New Zealand Mountains groups 9 nearby places across 7 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["christchurch", "hamilton-new-zealand", "napier", "new-plymouth", "queenstown", "wellington", "blenheim"],
    nearbyPlaces: ["arthurs-pass-national-park-near-christchurch", "egmont-national-park-near-new-plymouth", "hanmer-springs-near-christchurch", "pirongia-forest-park-near-hamilton-new-zealand", "port-hills-near-christchurch", "tararua-forest-park-near-wellington", "te-mata-peak-near-napier", "the-remarkables-near-queenstown", "tapuae-o-uenuku-near-blenheim"],
    featuredPlaces: ["arthurs-pass-national-park-near-christchurch", "egmont-national-park-near-new-plymouth", "hanmer-springs-near-christchurch", "pirongia-forest-park-near-hamilton-new-zealand", "port-hills-near-christchurch", "tararua-forest-park-near-wellington", "te-mata-peak-near-napier", "the-remarkables-near-queenstown"],
    featuredCities: ["christchurch", "hamilton-new-zealand", "napier", "new-plymouth", "queenstown", "wellington"],
    relatedCollections: ["new-zealand-weekend-escapes", "weekend-escapes-near-auckland", "weekend-escapes-near-queenstown", "weekend-escapes-near-wellington", "oceania-lakes", "australia-mountains", "austria-mountains", "canada-mountains"],
  },
  {
    slug: "new-zealand-weekend-escapes",
    title: "New Zealand Weekend Escapes",
    description:
      "New Zealand Weekend Escapes groups 12 nearby places across 7 cities for local-first day and weekend discovery — mainly mountains, nature areas, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["christchurch", "napier", "new-plymouth", "queenstown", "rotorua", "gisborne", "blenheim"],
    nearbyPlaces: ["arthurs-pass-national-park-near-christchurch", "egmont-national-park-near-new-plymouth", "fiordland-near-queenstown", "hanmer-springs-near-christchurch", "lake-rotokare-near-new-plymouth", "port-hills-near-christchurch", "te-mata-peak-near-napier", "waiotapu-near-rotorua", "lake-waikaremoana-near-gisborne", "mahia-peninsula-near-gisborne", "tapuae-o-uenuku-near-blenheim", "te-urewera-near-gisborne"],
    featuredPlaces: ["arthurs-pass-national-park-near-christchurch", "egmont-national-park-near-new-plymouth", "fiordland-near-queenstown", "hanmer-springs-near-christchurch", "lake-rotokare-near-new-plymouth", "port-hills-near-christchurch", "te-mata-peak-near-napier", "waiotapu-near-rotorua"],
    featuredCities: ["christchurch", "new-plymouth", "napier", "queenstown", "rotorua"],
    relatedCollections: ["new-zealand-mountains", "oceania-lakes", "weekend-escapes-near-queenstown", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "north-america-protected-landscapes",
    title: "North America Protected Landscapes",
    description:
      "North America Protected Landscapes groups 30 nearby places across 11 cities for local-first day and weekend discovery — mainly parks, nature areas. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["brampton", "burnaby", "colorado-springs", "jacksonville", "long-beach", "markham", "mississauga", "newark", "surrey", "vaughan", "virginia-beach"],
    nearbyPlaces: ["belcarra-regional-park-near-burnaby", "boyd-conservation-area-near-vaughan", "bronte-creek-provincial-park-near-mississauga", "campbell-valley-regional-park-near-surrey", "forks-of-the-credit-provincial-park-near-brampton", "pacific-spirit-regional-park-near-burnaby", "rouge-national-urban-park-near-markham", "sibbald-point-provincial-park-near-markham", "back-bay-national-wildlife-refuge-near-virginia-beach", "bolsa-chica-ecological-reserve-near-long-beach", "garden-of-the-gods-near-colorado-springs", "great-swamp-national-wildlife-refuge-near-newark", "south-mountain-reservation-near-newark", "timucuan-ecological-and-historic-preserve-near-jacksonville", "albion-hills-conservation-area-near-brampton", "albion-hills-conservation-area-near-markham", "albion-hills-conservation-area-near-vaughan", "bruce-s-mill-conservation-area-near-markham", "bruce-s-mill-conservation-area-near-vaughan", "castlewood-canyon-state-park-near-colorado-springs", "cheyenne-mountain-state-park-near-colorado-springs", "chino-hills-state-park-near-long-beach", "cold-creek-conservation-area-near-markham", "crawford-lake-conservation-area-near-mississauga", "cultus-lake-provincial-park-near-surrey", "cypress-provincial-park-near-surrey", "forks-of-the-credit-provincial-park-near-vaughan", "great-dismal-swamp-national-wildlife-refuge-near-virginia-beach", "guana-tolomato-matanzas-national-estuarine-research-reserve-near-jacksonville", "heart-lake-conservation-area-near-brampton"],
    featuredPlaces: ["back-bay-national-wildlife-refuge-near-virginia-beach", "belcarra-regional-park-near-burnaby", "bolsa-chica-ecological-reserve-near-long-beach", "boyd-conservation-area-near-vaughan", "bronte-creek-provincial-park-near-mississauga", "campbell-valley-regional-park-near-surrey", "forks-of-the-credit-provincial-park-near-brampton", "garden-of-the-gods-near-colorado-springs"],
    featuredCities: ["burnaby", "markham", "newark", "brampton", "colorado-springs", "jacksonville"],
    relatedCollections: ["north-america-weekend-escapes", "canada-protected-landscapes", "united-states-protected-landscapes", "weekend-escapes-near-toronto", "weekend-escapes-near-vancouver", "north-america-weekend-escapes-2", "weekend-escapes-near-new-york", "weekend-escapes-near-boulder"],
  },
  {
    slug: "north-america-weekend-escapes",
    title: "North America Weekend Escapes",
    description:
      "North America Weekend Escapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly parks, nature areas, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["birmingham-al", "brampton", "burnaby", "colorado-springs", "el-paso", "fort-worth", "fresno", "hartford", "jacksonville", "laval", "long-beach", "markham", "newark", "reno", "rochester"],
    nearbyPlaces: ["belcarra-regional-park-near-burnaby", "cheltenham-badlands-near-brampton", "forks-of-the-credit-provincial-park-near-brampton", "oka-national-park-near-laval", "pacific-spirit-regional-park-near-burnaby", "rouge-national-urban-park-near-markham", "sibbald-point-provincial-park-near-markham", "iles-de-boucherville-national-park-near-laval", "bolsa-chica-ecological-reserve-near-long-beach", "cahaba-river-national-wildlife-refuge-near-birmingham-al", "cedar-hill-state-park-near-fort-worth", "crystal-cove-state-park-near-long-beach", "fort-worth-nature-center-and-refuge-near-fort-worth", "franklin-mountains-state-park-near-el-paso", "garden-of-the-gods-near-colorado-springs", "great-swamp-national-wildlife-refuge-near-newark", "guadalupe-mountains-national-park-near-el-paso", "hamlin-beach-state-park-near-rochester", "kings-canyon-national-park-near-fresno", "lake-tahoe-near-reno", "letchworth-state-park-near-rochester", "little-talbot-island-state-park-near-jacksonville", "mount-rose-wilderness-near-reno", "mueller-state-park-near-colorado-springs", "oak-mountain-state-park-near-birmingham-al", "penwood-state-park-near-hartford", "sequoia-national-park-near-fresno", "south-mountain-reservation-near-newark", "talcott-mountain-state-park-near-hartford", "timucuan-ecological-and-historic-preserve-near-jacksonville"],
    featuredPlaces: ["belcarra-regional-park-near-burnaby", "bolsa-chica-ecological-reserve-near-long-beach", "cahaba-river-national-wildlife-refuge-near-birmingham-al", "cedar-hill-state-park-near-fort-worth", "cheltenham-badlands-near-brampton", "crystal-cove-state-park-near-long-beach", "forks-of-the-credit-provincial-park-near-brampton", "fort-worth-nature-center-and-refuge-near-fort-worth"],
    featuredCities: ["birmingham-al", "brampton", "burnaby", "colorado-springs", "el-paso", "fort-worth"],
    relatedCollections: ["north-america-weekend-escapes-2", "north-america-protected-landscapes", "united-states-protected-landscapes", "canada-protected-landscapes", "weekend-escapes-near-new-york", "weekend-escapes-near-toronto", "united-states-mountains", "united-states-national-parks"],
  },
  {
    slug: "north-america-weekend-escapes-2",
    title: "North America Weekend Escapes",
    description:
      "North America Weekend Escapes groups 30 nearby places across 9 cities for local-first day and weekend discovery — mainly parks, nature areas, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["birmingham-al", "el-paso", "fort-worth", "fresno", "jacksonville", "reno", "rochester", "tulsa", "virginia-beach"],
    nearbyPlaces: ["back-bay-national-wildlife-refuge-near-virginia-beach", "cahaba-river-national-wildlife-refuge-near-birmingham-al", "cedar-hill-state-park-near-fort-worth", "first-landing-state-park-near-virginia-beach", "fort-worth-nature-center-and-refuge-near-fort-worth", "franklin-mountains-state-park-near-el-paso", "guadalupe-mountains-national-park-near-el-paso", "hamlin-beach-state-park-near-rochester", "keystone-state-park-near-tulsa", "kings-canyon-national-park-near-fresno", "lake-tahoe-near-reno", "letchworth-state-park-near-rochester", "little-talbot-island-state-park-near-jacksonville", "mount-rose-wilderness-near-reno", "oak-mountain-state-park-near-birmingham-al", "osage-hills-state-park-near-tulsa", "sequoia-national-park-near-fresno", "timucuan-ecological-and-historic-preserve-near-jacksonville", "anaho-island-near-reno", "chimney-bluffs-state-park-near-rochester", "dinosaur-valley-state-park-near-fort-worth", "false-cape-state-park-near-virginia-beach", "fort-clinch-state-park-near-jacksonville", "grand-lake-o-the-cherokees-near-tulsa", "great-dismal-swamp-national-wildlife-refuge-near-virginia-beach", "greenleaf-state-park-near-tulsa", "guana-tolomato-matanzas-national-estuarine-research-reserve-near-jacksonville", "kilbourne-hole-near-el-paso", "kiptopeke-state-park-near-virginia-beach", "lake-guntersville-state-park-near-birmingham-al"],
    featuredPlaces: ["back-bay-national-wildlife-refuge-near-virginia-beach", "cahaba-river-national-wildlife-refuge-near-birmingham-al", "cedar-hill-state-park-near-fort-worth", "first-landing-state-park-near-virginia-beach", "fort-worth-nature-center-and-refuge-near-fort-worth", "franklin-mountains-state-park-near-el-paso", "guadalupe-mountains-national-park-near-el-paso", "hamlin-beach-state-park-near-rochester"],
    featuredCities: ["birmingham-al", "el-paso", "fort-worth", "fresno", "jacksonville", "reno"],
    relatedCollections: ["north-america-weekend-escapes", "united-states-mountains", "united-states-national-parks", "north-america-protected-landscapes", "united-states-protected-landscapes", "canada-united-states-borderlands", "united-states-coast", "united-states-lakes"],
  },
  {
    slug: "northern-europe-weekend-escapes",
    title: "Northern Europe Weekend Escapes",
    description:
      "Northern Europe Weekend Escapes groups 30 nearby places across 8 cities for local-first day and weekend discovery — mainly parks, waterfronts, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["lahti", "norrkoping", "orebro", "vantaa", "vejle", "boras", "sodertalje", "vasteras"],
    nearbyPlaces: ["mols-bjerge-national-park-near-vejle", "vejle-fjord-near-vejle", "nuuksio-national-park-near-vantaa", "paijanne-national-park-near-lahti", "repovesi-national-park-near-lahti", "sipoonkorpi-national-park-near-vantaa", "braviken-near-norrkoping", "kolmarden-near-norrkoping", "tiveden-national-park-near-orebro", "baven-near-norrkoping", "endelave-near-vejle", "grejs-river-near-vejle", "kilsbergen-near-orebro", "kolmarden-near-orebro", "lake-tuusula-near-vantaa", "liesjarvi-national-park-near-vantaa", "little-belt-near-vejle", "norra-kvill-national-park-near-norrkoping", "skamlingsbanken-near-vejle", "takern-near-norrkoping", "tiveden-near-orebro", "torronsuo-national-park-near-lahti", "vanern-near-orebro", "vantaanjoki-near-vantaa", "vattern-near-norrkoping", "vattern-near-orebro", "vesijarvi-near-lahti", "alleberg-near-boras", "aspen-near-sodertalje", "badelundaasen-near-vasteras"],
    featuredPlaces: ["braviken-near-norrkoping", "kolmarden-near-norrkoping", "mols-bjerge-national-park-near-vejle", "nuuksio-national-park-near-vantaa", "paijanne-national-park-near-lahti", "repovesi-national-park-near-lahti", "sipoonkorpi-national-park-near-vantaa", "tiveden-national-park-near-orebro"],
    featuredCities: ["lahti", "norrkoping", "vantaa", "vejle", "orebro"],
    relatedCollections: ["weekend-escapes-near-helsinki", "weekend-escapes-near-stockholm", "finland-national-parks", "finland-weekend-escapes", "weekend-escapes-near-aarhus", "denmark-germany-borderlands", "estonia-finland-borderlands", "sweden-national-parks"],
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
    relatedCollections: ["weekend-escapes-near-queenstown", "new-zealand-weekend-escapes", "australia-weekend-escapes", "weekend-escapes-near-auckland", "new-zealand-mountains", "austria-lakes", "european-lakes", "france-lakes"],
  },
  {
    slug: "oceania-weekend-escapes",
    title: "Oceania Weekend Escapes",
    description:
      "Oceania Weekend Escapes groups 30 nearby places across 7 cities for local-first day and weekend discovery — mainly nature areas, parks, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bundaberg", "dubbo", "gladstone", "invercargill", "kalgoorlie", "lower-hutt", "tamworth"],
    nearbyPlaces: ["boorabbin-national-park-near-kalgoorlie", "burrum-coast-national-park-near-bundaberg", "deepwater-national-park-near-bundaberg", "eurimbula-national-park-near-gladstone", "goulburn-river-national-park-near-dubbo", "kroombit-tops-national-park-near-gladstone", "oxley-wild-rivers-national-park-near-tamworth", "warrabah-national-park-near-tamworth", "warrumbungle-national-park-near-dubbo", "belmont-regional-park-near-lower-hutt", "fiordland-national-park-near-invercargill", "the-catlins-near-invercargill", "ben-halls-gap-national-park-near-tamworth", "bluff-hill-motupohue-near-invercargill", "bulburin-national-park-near-gladstone", "coolah-tops-national-park-near-tamworth", "curtis-island-national-park-near-gladstone", "goldfields-woodlands-national-park-near-kalgoorlie", "goobang-national-park-near-dubbo", "goodnight-scrub-national-park-near-bundaberg", "heron-island-near-gladstone", "kapiti-island-near-lower-hutt", "lake-ballard-near-kalgoorlie", "lake-keepit-near-tamworth", "mount-canobolas-near-dubbo", "mount-walsh-national-park-near-bundaberg", "munghorn-gap-nature-reserve-near-dubbo", "nangar-national-park-near-dubbo", "oreti-beach-near-invercargill", "pakuratahi-forest-near-lower-hutt"],
    featuredPlaces: ["belmont-regional-park-near-lower-hutt", "boorabbin-national-park-near-kalgoorlie", "burrum-coast-national-park-near-bundaberg", "deepwater-national-park-near-bundaberg", "eurimbula-national-park-near-gladstone", "fiordland-national-park-near-invercargill", "goulburn-river-national-park-near-dubbo", "kroombit-tops-national-park-near-gladstone"],
    featuredCities: ["bundaberg", "dubbo", "gladstone", "invercargill", "tamworth", "kalgoorlie"],
    relatedCollections: ["australia-national-parks", "weekend-escapes-near-queenstown", "weekend-escapes-near-wellington", "australia-mountains", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "poland-mountains",
    title: "Poland Mountains",
    description:
      "Poland Mountains groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["kielce", "krakow", "opole", "rzeszow", "wroclaw", "zakopane", "chorzow", "tychy", "rybnik", "walbrzych", "legnica", "bielsko-biala", "ruda-slaska", "zabrze", "radom"],
    nearbyPlaces: ["beskids-near-krakow", "giant-mountains-national-park-near-wroclaw", "magura-national-park-near-rzeszow", "pieniny-near-krakow", "saint-anne-mountain-near-opole", "stolowe-mountains-national-park-near-wroclaw", "tatra-mountains-near-krakow", "tatra-national-park-near-zakopane", "sleza-landscape-park-near-wroclaw", "swietokrzyskie-mountains-near-kielce", "babia-gora-national-park-near-chorzow", "beskid-mountains-near-tychy", "czantoria-wielka-near-rybnik", "giant-mountains-near-walbrzych", "kaczawskie-mountains-near-legnica", "little-beskids-near-bielsko-biala", "little-beskids-near-chorzow", "little-beskids-near-ruda-slaska", "little-beskids-near-tychy", "owl-mountains-near-walbrzych", "silesian-beskids-near-bielsko-biala", "silesian-beskids-near-rybnik", "silesian-beskids-near-tychy", "silesian-beskids-near-zabrze", "skrzyczne-near-bielsko-biala", "sleza-near-legnica", "swietokrzyskie-mountains-near-radom", "ysica-near-radom", "zywiec-beskids-near-sosnowiec", "zywiec-beskids-near-tychy"],
    featuredPlaces: ["beskids-near-krakow", "giant-mountains-national-park-near-wroclaw", "magura-national-park-near-rzeszow", "pieniny-near-krakow", "saint-anne-mountain-near-opole", "stolowe-mountains-national-park-near-wroclaw", "tatra-mountains-near-krakow", "tatra-national-park-near-zakopane"],
    featuredCities: ["krakow", "wroclaw", "kielce", "opole", "rzeszow", "zakopane"],
    relatedCollections: ["poland-slovakia-borderlands", "poland-national-parks", "czechia-poland-borderlands", "hungary-poland-borderlands", "weekend-escapes-near-krakow", "weekend-escapes-near-pozna", "poland-weekend-escapes", "central-europe-mountains"],
  },
  {
    slug: "poland-national-parks",
    title: "Poland National Parks",
    description:
      "Poland National Parks groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, mountains, parks. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["bialystok", "bydgoszcz", "czestochowa", "gdansk", "kielce", "lublin", "poznan", "rzeszow", "szczecin", "warsaw", "wroclaw", "zakopane", "bielsko-biala", "chorzow", "koszalin"],
    nearbyPlaces: ["giant-mountains-national-park-near-wroclaw", "gorce-national-park-near-zakopane", "kampinos-national-park-near-warsaw", "magura-national-park-near-rzeszow", "narew-national-park-near-bialystok", "ojcow-national-park-near-czestochowa", "roztocze-national-park-near-lublin", "stolowe-mountains-national-park-near-wroclaw", "slowinski-national-park-near-gdansk", "tatra-national-park-near-zakopane", "tuchola-forest-national-park-near-bydgoszcz", "wielkopolska-national-park-near-poznan", "wolin-national-park-near-szczecin", "swietokrzyski-national-park-near-kielce", "babia-gora-national-park-near-bielsko-biala", "babia-gora-national-park-near-chorzow", "drawa-national-park-near-koszalin", "giant-mountains-national-park-near-legnica", "gorce-national-park-near-tarnow", "kampinos-national-park-near-plock", "karkonosze-national-park-near-walbrzych", "magura-national-park-near-tarnow", "ojcow-national-park-near-bytom", "ojcow-national-park-near-chorzow", "ojcow-national-park-near-dabrowa-gornicza", "ojcow-national-park-near-ruda-slaska", "ojcow-national-park-near-sosnowiec", "ojcow-national-park-near-tychy", "ojcow-national-park-near-zabrze", "pieniny-national-park-near-tarnow"],
    featuredPlaces: ["giant-mountains-national-park-near-wroclaw", "gorce-national-park-near-zakopane", "kampinos-national-park-near-warsaw", "magura-national-park-near-rzeszow", "narew-national-park-near-bialystok", "ojcow-national-park-near-czestochowa", "roztocze-national-park-near-lublin", "stolowe-mountains-national-park-near-wroclaw"],
    featuredCities: ["wroclaw", "zakopane", "bialystok", "bydgoszcz", "czestochowa", "gdansk"],
    relatedCollections: ["poland-mountains", "poland-slovakia-borderlands", "weekend-escapes-near-pozna", "poland-weekend-escapes", "weekend-escapes-near-warsaw", "weekend-escapes-near-krakow", "central-europe-weekend-escapes", "czechia-poland-borderlands"],
  },
  {
    slug: "poland-slovakia-borderlands",
    title: "Poland–Slovakia Borderlands",
    description:
      "Poland–Slovakia Borderlands groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains, nature areas, parks. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["banska-bystrica", "czestochowa", "kosice", "krakow", "presov", "rzeszow", "zakopane", "zilina", "bielsko-biala", "chorzow", "dabrowa-gornicza", "sosnowiec", "tychy", "tarnow", "rybnik"],
    nearbyPlaces: ["beskids-near-krakow", "czarnorzeki-strzyzow-landscape-park-near-rzeszow", "gorce-national-park-near-zakopane", "magura-national-park-near-rzeszow", "ojcow-national-park-near-czestochowa", "pieniny-near-krakow", "tatra-mountains-near-krakow", "tatra-national-park-near-zakopane", "mala-fatra-national-park-near-zilina", "pieniny-national-park-near-presov", "polana-near-banska-bystrica", "slovak-paradise-national-park-near-kosice", "sulov-rocks-near-zilina", "velka-fatra-near-banska-bystrica", "cergov-near-presov", "krakow-czestochowa-upland-near-czestochowa", "levoca-mountains-near-presov", "poloniny-national-park-near-presov", "przedborz-landscape-park-near-czestochowa", "stawki-landscape-park-near-czestochowa", "tatra-national-park-near-presov", "zaecze-landscape-park-near-czestochowa", "babia-gora-national-park-near-bielsko-biala", "babia-gora-national-park-near-chorzow", "bedow-desert-near-dabrowa-gornicza", "bedow-desert-near-sosnowiec", "beskid-mountains-near-tychy", "ciezkowice-roznow-landscape-park-near-tarnow", "czantoria-wielka-near-rybnik", "eagles-nests-landscape-park-near-bytom"],
    featuredPlaces: ["beskids-near-krakow", "czarnorzeki-strzyzow-landscape-park-near-rzeszow", "gorce-national-park-near-zakopane", "magura-national-park-near-rzeszow", "mala-fatra-national-park-near-zilina", "ojcow-national-park-near-czestochowa", "pieniny-near-krakow", "pieniny-national-park-near-presov"],
    featuredCities: ["krakow", "banska-bystrica", "rzeszow", "zakopane", "zilina", "czestochowa"],
    relatedCollections: ["weekend-escapes-near-krakow", "poland-mountains", "poland-national-parks", "hungary-poland-borderlands", "weekend-escapes-near-bratislava", "hungary-slovakia-borderlands", "czechia-slovakia-borderlands", "central-europe-weekend-escapes"],
  },
  {
    slug: "poland-weekend-escapes",
    title: "Poland Weekend Escapes",
    description:
      "Poland Weekend Escapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bialystok", "gdynia", "gliwice", "krakow", "opole", "rzeszow", "szczecin", "torun", "bielsko-biala", "chorzow", "kalisz", "dabrowa-gornicza", "sosnowiec", "tychy", "legnica"],
    nearbyPlaces: ["czarnorzeki-strzyzow-landscape-park-near-rzeszow", "eagles-nests-landscape-park-near-gliwice", "magura-national-park-near-rzeszow", "narew-national-park-near-bialystok", "ojcow-national-park-near-krakow", "opawskie-mountains-landscape-park-near-opole", "saint-anne-mountain-near-opole", "szczecin-landscape-park-near-szczecin", "slowinski-national-park-near-gdynia", "tuchola-forest-near-torun", "wolin-national-park-near-szczecin", "goczakowice-lake-near-gliwice", "otmuchow-lake-near-opole", "owl-mountains-landscape-park-near-opole", "rudy-landscape-park-near-gliwice", "stoowe-mountains-national-park-near-opole", "zabie-doy-near-gliwice", "zaecze-landscape-park-near-opole", "babia-gora-national-park-near-bielsko-biala", "babia-gora-national-park-near-chorzow", "barycz-valley-landscape-park-near-kalisz", "bedow-desert-near-dabrowa-gornicza", "bedow-desert-near-sosnowiec", "beskid-mountains-near-tychy", "bobr-valley-landscape-park-near-legnica", "bobr-valley-landscape-park-near-walbrzych", "brodnica-landscape-park-near-wloclawek", "ciezkowice-roznow-landscape-park-near-tarnow", "czantoria-wielka-near-rybnik", "drawa-national-park-near-koszalin"],
    featuredPlaces: ["czarnorzeki-strzyzow-landscape-park-near-rzeszow", "eagles-nests-landscape-park-near-gliwice", "magura-national-park-near-rzeszow", "narew-national-park-near-bialystok", "ojcow-national-park-near-krakow", "opawskie-mountains-landscape-park-near-opole", "saint-anne-mountain-near-opole", "szczecin-landscape-park-near-szczecin"],
    featuredCities: ["opole", "rzeszow", "szczecin", "bialystok", "gdynia", "gliwice"],
    relatedCollections: ["poland-national-parks", "poland-mountains", "poland-slovakia-borderlands", "central-europe-weekend-escapes", "czechia-poland-borderlands", "central-europe-mountains", "germany-poland-borderlands", "weekend-escapes-near-krakow"],
  },
  {
    slug: "portugal-protected-landscapes",
    title: "Portugal Protected Landscapes",
    description:
      "Portugal Protected Landscapes groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly nature areas. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["braganca", "faro", "funchal", "lisbon", "porto", "setubal", "leiria", "matosinhos", "almada", "amadora", "sintra", "viana-do-castelo", "cascais", "loures"],
    nearbyPlaces: ["alvao-natural-park-near-porto", "arrabida-natural-park-near-setubal", "douro-international-natural-park-near-porto", "montesinho-natural-park-near-braganca", "ponta-de-sao-lourenco-near-funchal", "ria-formosa-natural-park-near-faro", "sado-estuary-natural-reserve-near-setubal", "tagus-estuary-natural-reserve-near-lisbon", "sintra-cascais-natural-park-near-setubal", "aire-and-candeeiros-ranges-natural-park-near-leiria", "alvao-natural-park-near-matosinhos", "arrabida-natural-park-near-almada", "arrabida-natural-park-near-amadora", "arrabida-natural-park-near-sintra", "cabo-da-roca-near-almada", "cape-espichel-near-almada", "northern-littoral-natural-park-near-matosinhos", "paiva-river-near-matosinhos", "peneda-geres-national-park-near-matosinhos", "peneda-geres-national-park-near-viana-do-castelo", "sado-estuary-natural-reserve-near-sintra", "sintra-cascais-natural-park-near-almada", "sintra-cascais-natural-park-near-amadora", "sintra-cascais-natural-park-near-cascais", "sintra-cascais-natural-park-near-loures", "sintra-cascais-natural-park-near-sintra", "tagus-estuary-natural-reserve-near-almada", "tagus-estuary-natural-reserve-near-amadora", "tagus-estuary-natural-reserve-near-cascais", "tagus-estuary-natural-reserve-near-loures"],
    featuredPlaces: ["alvao-natural-park-near-porto", "arrabida-natural-park-near-setubal", "douro-international-natural-park-near-porto", "montesinho-natural-park-near-braganca", "ponta-de-sao-lourenco-near-funchal", "ria-formosa-natural-park-near-faro", "sado-estuary-natural-reserve-near-setubal", "tagus-estuary-natural-reserve-near-lisbon"],
    featuredCities: ["porto", "setubal", "braganca", "faro", "funchal", "lisbon"],
    relatedCollections: ["portugal-spain-borderlands", "portugal-weekend-escapes", "weekend-escapes-near-lisbon", "southern-europe-protected-landscapes", "southern-europe-weekend-escapes", "weekend-escapes-near-porto", "european-coast", "canada-protected-landscapes"],
  },
  {
    slug: "portugal-spain-borderlands",
    title: "Portugal–Spain Borderlands",
    description:
      "Portugal–Spain Borderlands groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, mountains. This is a geographic discovery collection derived from cross-border natural continuity; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "cross_border_region",
    cities: ["braganca", "caceres", "cadiz", "evora", "faro", "guimaraes", "leon", "porto", "salamanca", "viana-do-castelo", "vigo", "matosinhos", "jerez-de-la-frontera", "gijon", "santiago-de-compostela"],
    nearbyPlaces: ["alvao-natural-park-near-porto", "cavado-river-near-guimaraes", "douro-international-natural-park-near-porto", "lima-river-near-viana-do-castelo", "montesinho-natural-park-near-braganca", "ria-formosa-natural-park-near-faro", "serra-de-sao-mamede-near-evora", "arribes-del-duero-natural-park-near-salamanca", "atlantic-islands-of-galicia-national-park-near-vigo", "donana-national-park-near-cadiz", "sierra-de-ancares-near-leon", "sierra-de-san-pedro-near-caceres", "bahia-de-cadiz-natural-park-near-cadiz", "cantabrian-mountains-near-leon", "laciana-valley-near-leon", "montes-de-leon-near-leon", "sanabria-lake-near-leon", "sierra-de-cadiz-near-cadiz", "sierra-de-las-nieves-national-park-near-cadiz", "tarifa-coast-near-cadiz", "alvao-natural-park-near-matosinhos", "bahia-de-cadiz-natural-park-near-jerez-de-la-frontera", "cape-trafalgar-near-jerez-de-la-frontera", "cape-vidio-near-gijon", "cares-gorge-near-gijon", "carnota-near-santiago-de-compostela", "cies-islands-near-santiago-de-compostela", "donana-national-park-near-jerez-de-la-frontera", "el-estrecho-natural-park-near-jerez-de-la-frontera", "iznajar-reservoir-near-cordoba-spain"],
    featuredPlaces: ["alvao-natural-park-near-porto", "arribes-del-duero-natural-park-near-salamanca", "atlantic-islands-of-galicia-national-park-near-vigo", "cavado-river-near-guimaraes", "douro-international-natural-park-near-porto", "donana-national-park-near-cadiz", "lima-river-near-viana-do-castelo", "montesinho-natural-park-near-braganca"],
    featuredCities: ["porto", "braganca", "caceres", "cadiz", "evora", "faro"],
    relatedCollections: ["portugal-protected-landscapes", "weekend-escapes-near-porto", "spain-weekend-escapes", "portugal-weekend-escapes", "spain-national-parks", "southern-europe-weekend-escapes", "spain-protected-landscapes", "european-mountains"],
  },
  {
    slug: "portugal-weekend-escapes",
    title: "Portugal Weekend Escapes",
    description:
      "Portugal Weekend Escapes groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly nature areas, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["braganca", "coimbra", "faro", "funchal", "guimaraes", "vila-nova-de-gaia", "viseu", "leiria", "matosinhos", "porto", "viana-do-castelo", "vila-real", "portimao", "guarda"],
    nearbyPlaces: ["alvao-natural-park-near-vila-nova-de-gaia", "montesinho-natural-park-near-braganca", "peneda-geres-national-park-near-guimaraes", "ponta-de-sao-lourenco-near-funchal", "ria-formosa-natural-park-near-faro", "serra-da-estrela-natural-park-near-viseu", "bucaco-forest-near-coimbra", "ria-de-aveiro-near-vila-nova-de-gaia", "serra-da-estrela-near-vila-nova-de-gaia", "serra-do-bucaco-near-vila-nova-de-gaia", "serra-do-marao-near-vila-nova-de-gaia", "aire-and-candeeiros-ranges-natural-park-near-leiria", "alvao-natural-park-near-matosinhos", "northern-littoral-natural-park-near-matosinhos", "paiva-river-near-matosinhos", "peneda-geres-national-park-near-matosinhos", "peneda-geres-national-park-near-porto", "peneda-geres-national-park-near-viana-do-castelo", "ria-de-aveiro-near-matosinhos", "sao-pedro-de-moel-near-leiria", "serra-do-marao-near-matosinhos", "alto-douro-wine-region-near-vila-real", "alvao-natural-park-near-vila-real", "arade-river-near-portimao", "benagil-near-portimao", "coa-river-near-guarda", "covao-dos-conchos-near-guarda", "douro-international-natural-park-near-guarda", "douro-international-natural-park-near-vila-real", "faia-brava-reserve-near-guarda"],
    featuredPlaces: ["alvao-natural-park-near-vila-nova-de-gaia", "montesinho-natural-park-near-braganca", "peneda-geres-national-park-near-guimaraes", "ponta-de-sao-lourenco-near-funchal", "ria-formosa-natural-park-near-faro", "serra-da-estrela-natural-park-near-viseu", "bucaco-forest-near-coimbra"],
    featuredCities: ["braganca", "coimbra", "faro", "funchal", "guimaraes", "vila-nova-de-gaia"],
    relatedCollections: ["portugal-protected-landscapes", "portugal-spain-borderlands", "southern-europe-weekend-escapes", "european-mountains", "southern-europe-protected-landscapes", "weekend-escapes-near-porto", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
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
    relatedCollections: ["weekend-escapes-near-brisbane", "australia-weekend-escapes", "australia-national-parks", "australia-islands", "australia-mountains", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "romania-mountains",
    title: "Romania Mountains",
    description:
      "Romania Mountains groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["baia-mare", "brasov", "bucharest", "cluj-napoca", "galati", "iasi", "sibiu", "ploiesti", "buzau", "ramnicu-valcea", "bacau", "suceava", "targu-mures", "satu-mare", "pitesti"],
    nearbyPlaces: ["bucegi-natural-park-near-bucharest", "ceahlau-massif-near-iasi", "cindrel-mountains-near-sibiu", "fagaras-mountains-near-cluj-napoca", "macin-mountains-near-galati", "piatra-craiului-national-park-near-brasov", "rodna-mountains-near-baia-mare", "vrancea-mountains-near-galati", "baiu-mountains-near-ploiesti", "buzau-mountains-near-buzau", "capatanii-mountains-near-ramnicu-valcea", "ceahlau-massif-near-bacau", "ceahlau-massif-near-suceava", "ciucas-mountains-near-buzau", "ciucas-mountains-near-ploiesti", "fagaras-mountains-near-ramnicu-valcea", "gurghiu-mountains-near-targu-mures", "gutai-mountains-near-satu-mare", "harghita-mountains-near-targu-mures", "iezer-mountains-near-pitesti", "lotru-mountains-near-ramnicu-valcea", "macin-mountains-near-braila", "piatra-craiului-national-park-near-bucharest", "piatra-mare-mountains-near-ploiesti", "rarau-massif-near-suceava", "rodna-mountains-near-satu-mare", "tarcau-mountains-near-bacau", "tibles-mountains-near-satu-mare", "vrancea-mountains-near-buzau", "ceahlau-massif-near-botosani"],
    featuredPlaces: ["bucegi-natural-park-near-bucharest", "ceahlau-massif-near-iasi", "cindrel-mountains-near-sibiu", "fagaras-mountains-near-cluj-napoca", "macin-mountains-near-galati", "piatra-craiului-national-park-near-brasov", "rodna-mountains-near-baia-mare"],
    featuredCities: ["baia-mare", "brasov", "bucharest", "cluj-napoca", "galati", "iasi"],
    relatedCollections: ["romania-weekend-escapes", "carpathians", "weekend-escapes-near-cluj-napoca", "european-lakes", "australia-mountains", "austria-mountains", "canada-mountains", "central-europe-mountains"],
  },
  {
    slug: "romania-weekend-escapes",
    title: "Romania Weekend Escapes",
    description:
      "Romania Weekend Escapes groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly nature areas, mountains, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["brasov", "bucharest", "constanta", "craiova", "galati", "iasi", "oradea", "timisoara", "pitesti", "ploiesti", "braila", "buzau", "bacau", "targu-mures"],
    nearbyPlaces: ["apuseni-natural-park-near-oradea", "bicaz-gorge-near-iasi", "bucegi-natural-park-near-bucharest", "ceahlau-massif-near-iasi", "cheile-nerei-beusnita-national-park-near-timisoara", "defileul-jiului-national-park-near-craiova", "iron-gates-natural-park-near-craiova", "macin-mountains-near-galati", "piatra-craiului-national-park-near-brasov", "snagov-near-bucharest", "vama-veche-near-constanta", "vacaresti-nature-park-near-bucharest", "balta-mica-a-brailei-natural-park-near-galati", "buila-vanturarita-national-park-near-craiova", "cozia-national-park-near-craiova", "great-braila-island-near-galati", "lake-razelm-near-galati", "lower-prut-floodplain-natural-park-near-galati", "mehedinti-plateau-geopark-near-craiova", "parang-mountains-near-craiova", "vrancea-mountains-near-galati", "arges-river-near-pitesti", "baiu-mountains-near-ploiesti", "balta-mica-a-brailei-natural-park-near-braila", "berca-mud-volcanoes-near-buzau", "berca-mud-volcanoes-near-ploiesti", "bicaz-gorge-near-bacau", "bicaz-gorge-near-targu-mures", "bucegi-natural-park-near-buzau", "bucegi-natural-park-near-ploiesti"],
    featuredPlaces: ["apuseni-natural-park-near-oradea", "bicaz-gorge-near-iasi", "bucegi-natural-park-near-bucharest", "ceahlau-massif-near-iasi", "cheile-nerei-beusnita-national-park-near-timisoara", "defileul-jiului-national-park-near-craiova", "iron-gates-natural-park-near-craiova", "macin-mountains-near-galati"],
    featuredCities: ["bucharest", "craiova", "iasi", "brasov", "constanta", "galati"],
    relatedCollections: ["romania-mountains", "carpathians", "european-coast", "european-lakes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "southern-europe-mountains",
    title: "Southern Europe Mountains",
    description:
      "Southern Europe Mountains groups 30 nearby places across 12 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["burgos", "cartagena", "larissa", "leon", "reggio-emilia", "la-spezia", "pistoia", "modena", "forli", "prato", "pavia", "thessaloniki"],
    nearbyPlaces: ["mount-ossa-near-larissa", "appennino-tosco-emiliano-national-park-near-reggio-emilia", "monte-cusna-near-reggio-emilia", "sierra-espuna-near-cartagena", "sierra-de-ancares-near-leon", "sierra-de-la-demanda-near-burgos", "alpe-di-succiso-near-reggio-emilia", "antichasia-mountains-near-larissa", "cantabrian-mountains-near-leon", "monte-cimone-near-reggio-emilia", "montes-de-leon-near-leon", "mount-olympus-near-larissa", "pelion-near-larissa", "picos-de-urbion-near-burgos", "pietra-di-bismantova-near-reggio-emilia", "apuan-alps-near-la-spezia", "montalbano-near-pistoia", "monte-cimone-near-modena", "monte-cimone-near-pistoia", "monte-cusna-near-modena", "monte-falterona-near-forli", "monte-falterona-near-prato", "monte-lesima-near-pavia", "monte-morello-near-prato", "monte-penice-near-pavia", "monte-pisanino-near-pistoia", "monti-della-calvana-near-prato", "mount-chortiatis-near-thessaloniki", "mount-paiko-near-thessaloniki", "pietra-di-bismantova-near-modena"],
    featuredPlaces: ["appennino-tosco-emiliano-national-park-near-reggio-emilia", "monte-cusna-near-reggio-emilia", "mount-ossa-near-larissa", "sierra-espuna-near-cartagena", "sierra-de-ancares-near-leon", "sierra-de-la-demanda-near-burgos"],
    featuredCities: ["reggio-emilia", "burgos", "cartagena", "larissa", "leon"],
    relatedCollections: ["southern-europe-weekend-escapes", "spain-mountains", "italy-mountains", "greece-mountains", "greece-weekend-escapes", "italy-national-parks", "portugal-spain-borderlands", "weekend-escapes-near-bilbao"],
  },
  {
    slug: "southern-europe-protected-landscapes",
    title: "Southern Europe Protected Landscapes",
    description:
      "Southern Europe Protected Landscapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["almeria", "burgos", "cadiz", "cartagena", "santiago-de-compostela", "setubal", "vila-nova-de-gaia", "leiria", "vitoria-gasteiz", "matosinhos", "almada", "amadora", "sintra", "jerez-de-la-frontera", "gijon"],
    nearbyPlaces: ["alvao-natural-park-near-vila-nova-de-gaia", "arrabida-natural-park-near-setubal", "sado-estuary-natural-reserve-near-setubal", "cabo-de-gata-nijar-natural-park-near-almeria", "calblanque-regional-park-near-cartagena", "fragas-do-eume-near-santiago-de-compostela", "la-brena-y-marismas-del-barbate-natural-park-near-cadiz", "ojo-guarena-near-burgos", "atlantic-islands-of-galicia-national-park-near-santiago-de-compostela", "bahia-de-cadiz-natural-park-near-cadiz", "canon-del-rio-lobos-natural-park-near-burgos", "el-fondo-natural-park-near-cartagena", "obarenes-mountains-near-burgos", "pancorbo-gorge-near-burgos", "sierra-de-baza-natural-park-near-almeria", "sierra-de-las-nieves-national-park-near-cadiz", "sierra-de-maria-los-velez-natural-park-near-almeria", "sierra-nevada-national-park-near-almeria", "sintra-cascais-natural-park-near-setubal", "sorbas-karst-near-almeria", "aire-and-candeeiros-ranges-natural-park-near-leiria", "aizkorri-aratz-natural-park-near-vitoria-gasteiz", "alvao-natural-park-near-matosinhos", "arrabida-natural-park-near-almada", "arrabida-natural-park-near-amadora", "arrabida-natural-park-near-sintra", "bahia-de-cadiz-natural-park-near-jerez-de-la-frontera", "cabo-da-roca-near-almada", "cape-espichel-near-almada", "cares-gorge-near-gijon"],
    featuredPlaces: ["alvao-natural-park-near-vila-nova-de-gaia", "arrabida-natural-park-near-setubal", "cabo-de-gata-nijar-natural-park-near-almeria", "calblanque-regional-park-near-cartagena", "fragas-do-eume-near-santiago-de-compostela", "la-brena-y-marismas-del-barbate-natural-park-near-cadiz", "ojo-guarena-near-burgos", "sado-estuary-natural-reserve-near-setubal"],
    featuredCities: ["setubal", "almeria", "burgos", "cadiz", "cartagena", "santiago-de-compostela"],
    relatedCollections: ["southern-europe-weekend-escapes", "spain-protected-landscapes", "weekend-escapes-near-malaga", "portugal-protected-landscapes", "weekend-escapes-near-lisbon", "portugal-weekend-escapes", "weekend-escapes-near-bilbao", "southern-europe-mountains"],
  },
  {
    slug: "southern-europe-weekend-escapes",
    title: "Southern Europe Weekend Escapes",
    description:
      "Southern Europe Weekend Escapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["almeria", "burgos", "cadiz", "cartagena", "chania", "ferrara", "larissa", "leon", "pescara", "reggio-calabria", "reggio-emilia", "santiago-de-compostela", "setubal", "taranto", "vila-nova-de-gaia"],
    nearbyPlaces: ["lake-kournas-near-chania", "mount-ossa-near-larissa", "samaria-gorge-near-chania", "vale-of-tempe-near-larissa", "alta-murgia-national-park-near-taranto", "appennino-tosco-emiliano-national-park-near-reggio-emilia", "comacchio-near-ferrara", "gran-sasso-and-monti-della-laga-national-park-near-pescara", "gulf-of-taranto-near-taranto", "maiella-national-park-near-pescara", "monte-cusna-near-reggio-emilia", "strait-of-messina-near-reggio-calabria", "alvao-natural-park-near-vila-nova-de-gaia", "arrabida-natural-park-near-setubal", "peneda-geres-national-park-near-vila-nova-de-gaia", "sado-estuary-natural-reserve-near-setubal", "cabo-de-gata-nijar-natural-park-near-almeria", "calblanque-regional-park-near-cartagena", "costa-da-morte-near-santiago-de-compostela", "donana-national-park-near-cadiz", "fragas-do-eume-near-santiago-de-compostela", "la-brena-y-marismas-del-barbate-natural-park-near-cadiz", "ojo-guarena-near-burgos", "picos-de-europa-national-park-near-leon", "sierra-espuna-near-cartagena", "sierra-de-ancares-near-leon", "sierra-de-la-demanda-near-burgos", "tabernas-desert-near-almeria", "a-barbanza-near-santiago-de-compostela", "abruzzo-lazio-and-molise-national-park-near-pescara"],
    featuredPlaces: ["alta-murgia-national-park-near-taranto", "alvao-natural-park-near-vila-nova-de-gaia", "appennino-tosco-emiliano-national-park-near-reggio-emilia", "arrabida-natural-park-near-setubal", "cabo-de-gata-nijar-natural-park-near-almeria", "calblanque-regional-park-near-cartagena", "comacchio-near-ferrara", "costa-da-morte-near-santiago-de-compostela"],
    featuredCities: ["almeria", "burgos", "cadiz", "cartagena", "chania", "larissa"],
    relatedCollections: ["southern-europe-protected-landscapes", "southern-europe-mountains", "spain-protected-landscapes", "greece-weekend-escapes", "weekend-escapes-near-malaga", "spain-mountains", "portugal-spain-borderlands", "spain-national-parks"],
  },
  {
    slug: "spain-coast",
    title: "Spain Coast",
    description:
      "Spain Coast groups 9 nearby places across 8 cities for local-first day and weekend discovery — mainly beaches, waterfronts. This is a geographic discovery collection derived from a shared coastline; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "coastal_region",
    cities: ["a-coruna", "barcelona", "girona", "granada", "san-sebastian", "tarragona", "santiago-de-compostela", "ourense"],
    nearbyPlaces: ["cabo-de-gata-nijar-natural-park-near-granada", "cap-de-creus-near-girona", "costa-daurada-near-tarragona", "costa-da-morte-near-a-coruna", "hendaye-bay-near-san-sebastian", "sitges-near-barcelona", "carnota-near-santiago-de-compostela", "cies-islands-near-santiago-de-compostela", "cies-islands-near-ourense"],
    featuredPlaces: ["cabo-de-gata-nijar-natural-park-near-granada", "cap-de-creus-near-girona", "costa-daurada-near-tarragona", "costa-da-morte-near-a-coruna", "hendaye-bay-near-san-sebastian", "sitges-near-barcelona"],
    featuredCities: ["a-coruna", "barcelona", "girona", "granada", "san-sebastian", "tarragona"],
    relatedCollections: ["european-coast", "weekend-escapes-near-barcelona", "spain-weekend-escapes", "france-spain-borderlands", "weekend-escapes-near-bilbao", "spain-mountains", "spain-protected-landscapes", "spain-national-parks"],
  },
  {
    slug: "spain-mountains",
    title: "Spain Mountains",
    description:
      "Spain Mountains groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["barcelona", "bilbao", "burgos", "cartagena", "granada", "jaca", "leon", "logrono", "madrid", "malaga", "oviedo", "san-sebastian", "toledo", "valencia", "zaragoza"],
    nearbyPlaces: ["aiako-harria-near-san-sebastian", "aizkorri-aratz-natural-park-near-san-sebastian", "garraf-massif-near-barcelona", "gorbea-natural-park-near-bilbao", "guadarrama-national-park-near-madrid", "moncayo-natural-park-near-zaragoza", "montes-de-toledo-near-toledo", "montserrat-near-barcelona", "ordesa-y-monte-perdido-national-park-near-jaca", "picos-de-europa-near-oviedo", "picos-de-urbion-near-logrono", "sierra-calderona-near-valencia", "sierra-espuna-near-cartagena", "sierra-nevada-national-park-near-granada", "sierra-de-ancares-near-leon", "sierra-de-baza-natural-park-near-granada", "sierra-de-espadan-near-valencia", "sierra-de-la-demanda-near-burgos", "sierra-de-las-nieves-national-park-near-malaga", "cantabrian-mountains-near-leon", "montes-de-leon-near-leon", "picos-de-urbion-near-burgos", "guadarrama-mountains-near-getafe", "guadarrama-national-park-near-alcala-de-henares", "la-pedriza-near-fuenlabrada", "la-pedriza-near-getafe", "la-pedriza-near-mostoles", "montseny-massif-near-badalona", "montseny-massif-near-sabadell", "montseny-massif-near-terrassa"],
    featuredPlaces: ["aiako-harria-near-san-sebastian", "aizkorri-aratz-natural-park-near-san-sebastian", "garraf-massif-near-barcelona", "gorbea-natural-park-near-bilbao", "guadarrama-national-park-near-madrid", "moncayo-natural-park-near-zaragoza", "montes-de-toledo-near-toledo", "montserrat-near-barcelona"],
    featuredCities: ["barcelona", "granada", "san-sebastian", "valencia", "bilbao", "burgos"],
    relatedCollections: ["weekend-escapes-near-bilbao", "spain-national-parks", "france-spain-borderlands", "spain-weekend-escapes", "southern-europe-mountains", "southern-europe-weekend-escapes", "weekend-escapes-near-malaga", "spain-protected-landscapes"],
  },
  {
    slug: "spain-national-parks",
    title: "Spain National Parks",
    description:
      "Spain National Parks groups 24 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains, parks, islands. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["cadiz", "granada", "jaca", "leon", "madrid", "malaga", "toledo", "vigo", "jerez-de-la-frontera", "alcala-de-henares", "alcorcon", "fuenlabrada", "leganes", "gijon", "getafe"],
    nearbyPlaces: ["atlantic-islands-of-galicia-national-park-near-vigo", "cabaneros-national-park-near-toledo", "donana-national-park-near-cadiz", "guadarrama-national-park-near-madrid", "ordesa-y-monte-perdido-national-park-near-jaca", "picos-de-europa-national-park-near-leon", "sierra-nevada-national-park-near-granada", "sierra-de-las-nieves-national-park-near-malaga", "sierra-de-las-nieves-national-park-near-cadiz", "donana-national-park-near-jerez-de-la-frontera", "guadarrama-national-park-near-alcala-de-henares", "guadarrama-national-park-near-alcorcon", "guadarrama-national-park-near-fuenlabrada", "guadarrama-national-park-near-leganes", "picos-de-europa-national-park-near-gijon", "sierra-de-guadarrama-national-park-near-getafe", "sierra-de-guadarrama-national-park-near-mostoles", "tablas-de-daimiel-national-park-near-fuenlabrada", "aiguestortes-i-estany-de-sant-maurici-national-park-near-lleida", "atlantic-islands-of-galicia-national-park-near-ourense", "donana-national-park-near-huelva", "guadarrama-national-park-near-segovia", "sierra-de-las-nieves-national-park-near-algeciras", "sierra-de-las-nieves-national-park-near-marbella"],
    featuredPlaces: ["atlantic-islands-of-galicia-national-park-near-vigo", "cabaneros-national-park-near-toledo", "donana-national-park-near-cadiz", "guadarrama-national-park-near-madrid", "ordesa-y-monte-perdido-national-park-near-jaca", "picos-de-europa-national-park-near-leon", "sierra-nevada-national-park-near-granada", "sierra-de-las-nieves-national-park-near-malaga"],
    featuredCities: ["cadiz", "granada", "jaca", "leon", "madrid", "malaga"],
    relatedCollections: ["spain-mountains", "weekend-escapes-near-malaga", "portugal-spain-borderlands", "spain-weekend-escapes", "southern-europe-weekend-escapes", "weekend-escapes-near-madrid", "france-spain-borderlands", "spain-protected-landscapes"],
  },
  {
    slug: "spain-protected-landscapes",
    title: "Spain Protected Landscapes",
    description:
      "Spain Protected Landscapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["a-coruna", "alicante", "almeria", "bilbao", "burgos", "cadiz", "cartagena", "girona", "malaga", "oviedo", "pamplona", "salamanca", "san-sebastian", "valencia", "vitoria-gasteiz"],
    nearbyPlaces: ["arribes-del-duero-natural-park-near-salamanca", "bardenas-reales-near-pamplona", "cabo-de-gata-nijar-natural-park-near-almeria", "calblanque-regional-park-near-cartagena", "torcal-de-antequera-near-malaga", "fragas-do-eume-near-a-coruna", "garrotxa-volcanic-zone-natural-park-near-girona", "la-brena-y-marismas-del-barbate-natural-park-near-cadiz", "montes-de-malaga-natural-park-near-malaga", "montgo-natural-park-near-alicante", "ojo-guarena-near-burgos", "pagoeta-natural-park-near-san-sebastian", "penyal-difac-near-valencia", "redes-natural-park-near-oviedo", "urdaibai-biosphere-reserve-near-bilbao", "bahia-de-cadiz-natural-park-near-cadiz", "canon-del-rio-lobos-natural-park-near-burgos", "el-fondo-natural-park-near-cartagena", "obarenes-mountains-near-burgos", "pancorbo-gorge-near-burgos", "sierra-de-baza-natural-park-near-almeria", "sierra-de-las-nieves-national-park-near-cadiz", "sierra-de-maria-los-velez-natural-park-near-almeria", "sierra-nevada-national-park-near-almeria", "sorbas-karst-near-almeria", "aizkorri-aratz-natural-park-near-vitoria-gasteiz", "bahia-de-cadiz-natural-park-near-jerez-de-la-frontera", "cares-gorge-near-gijon", "donana-national-park-near-jerez-de-la-frontera", "el-fondo-natural-park-near-elche"],
    featuredPlaces: ["arribes-del-duero-natural-park-near-salamanca", "bardenas-reales-near-pamplona", "cabo-de-gata-nijar-natural-park-near-almeria", "calblanque-regional-park-near-cartagena", "torcal-de-antequera-near-malaga", "fragas-do-eume-near-a-coruna", "garrotxa-volcanic-zone-natural-park-near-girona", "la-brena-y-marismas-del-barbate-natural-park-near-cadiz"],
    featuredCities: ["malaga", "a-coruna", "alicante", "almeria", "bilbao", "burgos"],
    relatedCollections: ["southern-europe-protected-landscapes", "southern-europe-weekend-escapes", "weekend-escapes-near-bilbao", "weekend-escapes-near-malaga", "spain-weekend-escapes", "france-spain-borderlands", "spain-mountains", "weekend-escapes-near-valencia"],
  },
  {
    slug: "spain-weekend-escapes",
    title: "Spain Weekend Escapes",
    description:
      "Spain Weekend Escapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, mountains, islands. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["a-coruna", "caceres", "granada", "jaca", "murcia", "oviedo", "salamanca", "seville", "vigo", "zaragoza", "jerez-de-la-frontera", "gijon", "santiago-de-compostela", "elche", "albacete"],
    nearbyPlaces: ["arribes-del-duero-natural-park-near-salamanca", "atlantic-islands-of-galicia-national-park-near-vigo", "cabo-de-gata-nijar-natural-park-near-granada", "costa-da-morte-near-a-coruna", "donana-national-park-near-seville", "fragas-do-eume-near-a-coruna", "irati-forest-near-jaca", "moncayo-natural-park-near-zaragoza", "ordesa-y-monte-perdido-national-park-near-jaca", "picos-de-europa-near-oviedo", "redes-natural-park-near-oviedo", "sierra-espuna-near-murcia", "sierra-de-san-pedro-near-caceres", "bahia-de-cadiz-natural-park-near-jerez-de-la-frontera", "cape-trafalgar-near-jerez-de-la-frontera", "cape-vidio-near-gijon", "cares-gorge-near-gijon", "carnota-near-santiago-de-compostela", "cies-islands-near-santiago-de-compostela", "donana-national-park-near-jerez-de-la-frontera", "el-fondo-natural-park-near-elche", "la-brena-y-marismas-del-barbate-natural-park-near-jerez-de-la-frontera", "picos-de-europa-national-park-near-gijon", "redes-natural-park-near-gijon", "serra-de-crevillent-near-elche", "sierra-de-grazalema-natural-park-near-jerez-de-la-frontera", "sierra-del-sueve-near-gijon", "somiedo-natural-park-near-gijon", "source-of-the-mundo-river-near-albacete", "tabarca-near-cartagena"],
    featuredPlaces: ["arribes-del-duero-natural-park-near-salamanca", "atlantic-islands-of-galicia-national-park-near-vigo", "cabo-de-gata-nijar-natural-park-near-granada", "costa-da-morte-near-a-coruna", "donana-national-park-near-seville", "fragas-do-eume-near-a-coruna", "irati-forest-near-jaca", "moncayo-natural-park-near-zaragoza"],
    featuredCities: ["a-coruna", "jaca", "oviedo", "caceres", "granada", "murcia"],
    relatedCollections: ["spain-mountains", "portugal-spain-borderlands", "spain-protected-landscapes", "spain-national-parks", "spain-coast", "france-spain-borderlands", "european-coast", "european-forests"],
  },
  {
    slug: "sweden-islands",
    title: "Sweden Islands",
    description:
      "Sweden Islands groups 10 nearby places across 6 cities for local-first day and weekend discovery — mainly islands. This is a geographic discovery collection derived from island geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "island_region",
    cities: ["gothenburg", "stockholm", "umea", "visby", "vasteras", "eskilstuna"],
    nearbyPlaces: ["gothenburg-archipelago-near-gothenburg", "gotska-sandon-national-park-near-visby", "holmoarna-near-umea", "sodra-bohuslan-archipelago-near-gothenburg", "marstrand-near-gothenburg", "stockholm-archipelago-near-stockholm", "angso-national-park-near-stockholm", "angso-national-park-near-vasteras", "eldgarnso-nature-reserve-near-eskilstuna", "selaon-near-eskilstuna"],
    featuredPlaces: ["gothenburg-archipelago-near-gothenburg", "gotska-sandon-national-park-near-visby", "holmoarna-near-umea", "sodra-bohuslan-archipelago-near-gothenburg", "marstrand-near-gothenburg", "stockholm-archipelago-near-stockholm", "angso-national-park-near-stockholm"],
    featuredCities: ["gothenburg", "stockholm", "umea", "visby"],
    relatedCollections: ["weekend-escapes-near-gothenburg", "baltic-sea-coast", "sweden-national-parks", "sweden-weekend-escapes", "weekend-escapes-near-stockholm", "european-lakes", "australia-islands", "canada-islands"],
  },
  {
    slug: "sweden-national-parks",
    title: "Sweden National Parks",
    description:
      "Sweden National Parks groups 19 nearby places across 14 cities for local-first day and weekend discovery — mainly nature areas, islands. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["gothenburg", "helsingborg", "jonkoping", "malmo", "orebro", "stockholm", "uppsala", "vasteras", "gavle", "halmstad", "vaxjo", "eskilstuna", "sodertalje", "karlskrona"],
    nearbyPlaces: ["dalby-soderskog-national-park-near-malmo", "farnebofjarden-national-park-near-uppsala", "sodra-bohuslan-archipelago-near-gothenburg", "store-mosse-national-park-near-jonkoping", "soderasen-national-park-near-helsingborg", "tiveden-national-park-near-orebro", "angso-national-park-near-stockholm", "angso-national-park-near-vasteras", "farnebofjarden-national-park-near-gavle", "farnebofjarden-national-park-near-vasteras", "soderasen-national-park-near-halmstad", "soderasen-national-park-near-malmo", "store-mosse-national-park-near-halmstad", "store-mosse-national-park-near-vaxjo", "tiveden-national-park-near-vasteras", "tyresta-national-park-near-eskilstuna", "tyresta-national-park-near-sodertalje", "soderasen-national-park-near-karlskrona", "stenshuvud-national-park-near-karlskrona"],
    featuredPlaces: ["dalby-soderskog-national-park-near-malmo", "farnebofjarden-national-park-near-uppsala", "sodra-bohuslan-archipelago-near-gothenburg", "store-mosse-national-park-near-jonkoping", "soderasen-national-park-near-helsingborg", "tiveden-national-park-near-orebro", "angso-national-park-near-stockholm"],
    featuredCities: ["gothenburg", "helsingborg", "jonkoping", "malmo", "orebro", "stockholm"],
    relatedCollections: ["weekend-escapes-near-stockholm", "denmark-sweden-borderlands", "sweden-islands", "weekend-escapes-near-gothenburg", "weekend-escapes-near-malm", "northern-europe-weekend-escapes", "european-lakes", "european-coast"],
  },
  {
    slug: "sweden-weekend-escapes",
    title: "Sweden Weekend Escapes",
    description:
      "Sweden Weekend Escapes groups 30 nearby places across 13 cities for local-first day and weekend discovery — mainly nature areas, islands, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["karlstad", "lund", "umea", "visby", "boras", "halmstad", "vaxjo", "malmo", "vasteras", "eskilstuna", "sodertalje", "sundsvall", "karlskrona"],
    nearbyPlaces: ["gotska-sandon-national-park-near-visby", "high-coast-near-umea", "holmoarna-near-umea", "hogklint-near-visby", "lake-vanern-near-karlstad", "soderasen-national-park-near-lund", "alleberg-near-boras", "billingen-near-boras", "hallands-vadero-near-halmstad", "hallandsasen-near-halmstad", "lake-bolmen-near-vaxjo", "lake-hornborga-near-boras", "nissan-river-near-halmstad", "soderasen-national-park-near-halmstad", "soderasen-national-park-near-malmo", "tiveden-national-park-near-vasteras", "tylosand-near-halmstad", "tyresta-national-park-near-eskilstuna", "tyresta-national-park-near-sodertalje", "alnon-near-sundsvall", "doda-fallet-dead-falls-near-sundsvall", "hano-bay-near-karlskrona", "hano-near-karlskrona", "high-coast-near-sundsvall", "indalsalven-near-sundsvall", "ivo-lake-near-karlskrona", "lake-hjalmaren-near-eskilstuna", "lake-hjalmaren-near-vasteras", "lake-malaren-near-eskilstuna", "lake-malaren-near-vasteras"],
    featuredPlaces: ["gotska-sandon-national-park-near-visby", "high-coast-near-umea", "holmoarna-near-umea", "hogklint-near-visby", "lake-vanern-near-karlstad", "soderasen-national-park-near-lund"],
    featuredCities: ["umea", "visby", "karlstad", "lund"],
    relatedCollections: ["baltic-sea-coast", "sweden-islands", "european-lakes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "united-kingdom-coast",
    title: "United Kingdom Coast",
    description:
      "United Kingdom Coast groups 18 nearby places across 13 cities for local-first day and weekend discovery — mainly beaches, waterfronts. This is a geographic discovery collection derived from a shared coastline; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "coastal_region",
    cities: ["bristol", "durham", "edinburgh", "exeter", "liverpool", "norwich", "swansea", "bournemouth", "preston", "middlesbrough", "newport", "chester", "gloucester"],
    nearbyPlaces: ["durham-coast-near-durham", "formby-near-liverpool", "gower-peninsula-near-swansea", "jurassic-coast-near-exeter", "norfolk-coast-near-norwich", "sand-point-near-bristol", "yellowcraig-near-edinburgh", "brownsea-island-near-bournemouth", "jurassic-coast-near-bournemouth", "lulworth-cove-near-bournemouth", "morecambe-bay-near-preston", "ribble-and-alt-estuaries-near-preston", "robin-hood-s-bay-near-middlesbrough", "saltburn-by-the-sea-near-middlesbrough", "flat-holm-near-newport", "hilbre-islands-near-chester", "severn-estuary-near-gloucester", "wirral-peninsula-near-chester"],
    featuredPlaces: ["durham-coast-near-durham", "formby-near-liverpool", "gower-peninsula-near-swansea", "jurassic-coast-near-exeter", "norfolk-coast-near-norwich", "sand-point-near-bristol", "yellowcraig-near-edinburgh"],
    featuredCities: ["bristol", "durham", "edinburgh", "exeter", "liverpool", "norwich"],
    relatedCollections: ["weekend-escapes-near-bristol", "united-kingdom-forests", "weekend-escapes-near-durham", "weekend-escapes-near-edinburgh", "weekend-escapes-near-liverpool", "weekend-escapes-near-norwich", "united-kingdom-protected-landscapes", "european-islands"],
  },
  {
    slug: "united-kingdom-forests",
    title: "United Kingdom Forests",
    description:
      "United Kingdom Forests groups 19 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas. This is a geographic discovery collection derived from forest landscapes; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "forest_region",
    cities: ["birmingham", "bristol", "derby", "liverpool", "norwich", "southampton", "swansea", "southend-on-sea", "preston", "bournemouth", "milton-keynes", "northampton", "reading", "chester", "gloucester"],
    nearbyPlaces: ["afan-forest-park-near-swansea", "delamere-forest-near-liverpool", "forest-of-dean-near-bristol", "new-forest-national-park-near-southampton", "the-national-forest-near-derby", "thetford-forest-near-norwich", "wyre-forest-near-birmingham", "epping-forest-near-southend-on-sea", "forest-of-bowland-near-preston", "new-forest-near-bournemouth", "salcey-forest-near-milton-keynes", "salcey-forest-near-northampton", "savernake-forest-near-reading", "whittlewood-forest-near-milton-keynes", "delamere-forest-near-chester", "forest-of-dean-near-gloucester", "forest-of-dean-near-newport", "forest-of-dean-near-swindon", "savernake-forest-near-swindon"],
    featuredPlaces: ["afan-forest-park-near-swansea", "delamere-forest-near-liverpool", "forest-of-dean-near-bristol", "new-forest-national-park-near-southampton", "the-national-forest-near-derby", "thetford-forest-near-norwich", "wyre-forest-near-birmingham"],
    featuredCities: ["birmingham", "bristol", "derby", "liverpool", "norwich", "southampton"],
    relatedCollections: ["weekend-escapes-near-birmingham", "weekend-escapes-near-bristol", "united-kingdom-coast", "united-kingdom-national-parks", "weekend-escapes-near-liverpool", "weekend-escapes-near-london", "weekend-escapes-near-norwich", "western-europe-weekend-escapes"],
  },
  {
    slug: "united-kingdom-lakes",
    title: "United Kingdom Lakes",
    description:
      "United Kingdom Lakes groups 13 nearby places across 11 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["bristol", "carlisle", "inverness", "manchester", "newcastle-upon-tyne", "nottingham", "stoke-on-trent", "northampton", "swindon", "wrexham", "luton"],
    nearbyPlaces: ["carsington-water-near-nottingham", "chew-valley-lake-near-bristol", "dovestone-reservoir-near-manchester", "kielder-water-near-newcastle-upon-tyne", "lake-district-near-carlisle", "loch-ness-near-inverness", "tittesworth-reservoir-near-stoke-on-trent", "pitsford-water-near-northampton", "rutland-water-near-northampton", "coate-water-country-park-near-swindon", "lake-vyrnwy-near-wrexham", "llyn-brenig-near-wrexham", "tring-reservoirs-near-luton"],
    featuredPlaces: ["carsington-water-near-nottingham", "chew-valley-lake-near-bristol", "dovestone-reservoir-near-manchester", "kielder-water-near-newcastle-upon-tyne", "lake-district-near-carlisle", "loch-ness-near-inverness", "tittesworth-reservoir-near-stoke-on-trent"],
    featuredCities: ["bristol", "carlisle", "inverness", "manchester", "newcastle-upon-tyne", "nottingham"],
    relatedCollections: ["weekend-escapes-near-edinburgh", "united-kingdom-weekend-escapes", "weekend-escapes-near-birmingham", "weekend-escapes-near-bristol", "weekend-escapes-near-liverpool", "weekend-escapes-near-norwich", "united-kingdom-national-parks", "united-kingdom-coast"],
  },
  {
    slug: "united-kingdom-mountains",
    title: "United Kingdom Mountains",
    description:
      "United Kingdom Mountains groups 22 nearby places across 13 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["belfast", "birmingham", "cardiff", "derry", "lancaster", "northampton", "preston", "middlesbrough", "gloucester", "newport", "chester", "wrexham", "swindon"],
    nearbyPlaces: ["brecon-beacons-near-cardiff", "caerphilly-mountain-near-cardiff", "cave-hill-near-belfast", "clent-hills-near-birmingham", "garth-mountain-near-cardiff", "malvern-hills-near-birmingham", "mourne-mountains-near-belfast", "slieve-croob-near-belfast", "sperrins-near-derry", "yorkshire-dales-near-lancaster", "chiltern-hills-near-northampton", "pendle-hill-near-preston", "roseberry-topping-near-middlesbrough", "sutton-bank-near-middlesbrough", "black-mountains-near-gloucester", "brecon-beacons-near-newport", "clwydian-range-near-chester", "clwydian-range-near-wrexham", "malvern-hills-near-gloucester", "moel-famau-near-wrexham", "sugar-loaf-near-newport", "whitehorse-hill-near-swindon"],
    featuredPlaces: ["brecon-beacons-near-cardiff", "caerphilly-mountain-near-cardiff", "cave-hill-near-belfast", "clent-hills-near-birmingham", "garth-mountain-near-cardiff", "malvern-hills-near-birmingham", "mourne-mountains-near-belfast", "slieve-croob-near-belfast"],
    featuredCities: ["belfast", "cardiff", "birmingham", "derry", "lancaster"],
    relatedCollections: ["ireland-united-kingdom-borderlands", "weekend-escapes-near-belfast", "weekend-escapes-near-bristol", "weekend-escapes-near-birmingham", "united-kingdom-national-parks", "weekend-escapes-near-liverpool", "united-kingdom-protected-landscapes", "united-kingdom-forests"],
  },
  {
    slug: "united-kingdom-national-parks",
    title: "United Kingdom National Parks",
    description:
      "United Kingdom National Parks groups 10 nearby places across 11 cities for local-first day and weekend discovery — mainly nature areas, mountains. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["aberdeen", "brighton", "cardiff", "glasgow", "leeds", "manchester", "newcastle-upon-tyne", "sheffield", "southampton", "york", "stirling"],
    nearbyPlaces: ["brecon-beacons-near-cardiff", "cairngorms-national-park-near-aberdeen", "loch-lomond-and-the-trossachs-near-glasgow", "new-forest-national-park-near-southampton", "north-york-moors-national-park-near-york", "northumberland-national-park-near-newcastle-upon-tyne", "peak-district-near-manchester", "south-downs-national-park-near-brighton", "yorkshire-dales-near-leeds", "loch-lomond-and-the-trossachs-national-park-near-stirling"],
    featuredPlaces: ["brecon-beacons-near-cardiff", "cairngorms-national-park-near-aberdeen", "loch-lomond-and-the-trossachs-near-glasgow", "new-forest-national-park-near-southampton", "north-york-moors-national-park-near-york", "northumberland-national-park-near-newcastle-upon-tyne", "peak-district-near-manchester", "south-downs-national-park-near-brighton"],
    featuredCities: ["aberdeen", "brighton", "cardiff", "glasgow", "leeds", "manchester"],
    relatedCollections: ["weekend-escapes-near-edinburgh", "weekend-escapes-near-liverpool", "weekend-escapes-near-london", "united-kingdom-forests", "united-kingdom-mountains", "weekend-escapes-near-bristol", "weekend-escapes-near-durham", "united-kingdom-lakes"],
  },
  {
    slug: "united-kingdom-protected-landscapes",
    title: "United Kingdom Protected Landscapes",
    description:
      "United Kingdom Protected Landscapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["birmingham", "cambridge", "durham", "edinburgh", "inverness", "lancaster", "lincoln", "liverpool", "london", "oxford", "preston", "milton-keynes", "luton", "reading", "stoke-on-trent"],
    nearbyPlaces: ["arnside-and-silverdale-national-landscape-near-lancaster", "cannock-chase-near-birmingham", "cotswolds-near-oxford", "glen-affric-near-inverness", "hartsholme-country-park-near-lincoln", "north-pennines-near-durham", "pentland-hills-edinburgh", "richmond-park-london", "thurstaston-common-near-liverpool", "wicken-fen-near-cambridge", "arnside-and-silverdale-near-preston", "ashridge-estate-near-milton-keynes", "ashridge-near-luton", "burnham-beeches-near-reading", "cannock-chase-near-stoke-on-trent", "cannock-chase-near-wolverhampton", "chiltern-hills-near-reading", "dunstable-downs-near-luton", "epping-forest-near-southend-on-sea", "fineshade-wood-near-northampton", "forest-of-bowland-near-preston", "goring-gap-near-reading", "hadleigh-country-park-near-southend-on-sea", "holyrood-park-edinburgh", "hyde-park-london", "lake-district-near-preston", "new-forest-near-bournemouth", "north-pennines-near-middlesbrough", "north-york-moors-near-middlesbrough", "salcey-forest-near-milton-keynes"],
    featuredPlaces: ["arnside-and-silverdale-national-landscape-near-lancaster", "cannock-chase-near-birmingham", "cotswolds-near-oxford", "glen-affric-near-inverness", "hartsholme-country-park-near-lincoln", "north-pennines-near-durham", "pentland-hills-edinburgh", "richmond-park-london"],
    featuredCities: ["london", "birmingham", "cambridge", "durham", "edinburgh", "inverness"],
    relatedCollections: ["weekend-escapes-near-london", "weekend-escapes-near-liverpool", "united-kingdom-weekend-escapes", "weekend-escapes-near-birmingham", "weekend-escapes-near-durham", "weekend-escapes-near-edinburgh", "weekend-escapes-near-norwich", "united-kingdom-coast"],
  },
  {
    slug: "united-kingdom-weekend-escapes",
    title: "United Kingdom Weekend Escapes",
    description:
      "United Kingdom Weekend Escapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bristol", "coventry", "inverness", "leicester", "newcastle-upon-tyne", "plymouth", "sunderland", "truro", "preston", "milton-keynes", "luton", "bournemouth", "reading", "stoke-on-trent", "wolverhampton"],
    nearbyPlaces: ["cannock-chase-near-coventry", "carrick-roads-near-truro", "dartmoor-near-plymouth", "durham-coast-near-sunderland", "glen-affric-near-inverness", "hadrians-wall-near-newcastle-upon-tyne", "loch-ness-near-inverness", "mendip-hills-near-bristol", "roseland-peninsula-near-truro", "the-national-forest-near-leicester", "beacon-hill-near-leicester", "brandon-marsh-near-coventry", "burrough-hill-near-leicester", "castle-eden-dene-near-sunderland", "charnwood-lodge-near-leicester", "clent-hills-near-coventry", "edge-hill-near-coventry", "roker-near-sunderland", "swithland-wood-near-leicester", "ufton-fields-near-coventry", "whitburn-near-sunderland", "arnside-and-silverdale-near-preston", "ashridge-estate-near-milton-keynes", "ashridge-near-luton", "brownsea-island-near-bournemouth", "burnham-beeches-near-reading", "cannock-chase-near-stoke-on-trent", "cannock-chase-near-wolverhampton", "chiltern-hills-near-northampton", "chiltern-hills-near-reading"],
    featuredPlaces: ["cannock-chase-near-coventry", "carrick-roads-near-truro", "dartmoor-near-plymouth", "durham-coast-near-sunderland", "glen-affric-near-inverness", "hadrians-wall-near-newcastle-upon-tyne", "loch-ness-near-inverness", "mendip-hills-near-bristol"],
    featuredCities: ["inverness", "truro", "bristol", "coventry", "leicester", "newcastle-upon-tyne"],
    relatedCollections: ["western-europe-weekend-escapes", "united-kingdom-lakes", "united-kingdom-protected-landscapes", "western-europe-protected-landscapes", "weekend-escapes-near-birmingham", "weekend-escapes-near-bristol", "weekend-escapes-near-durham", "weekend-escapes-near-edinburgh"],
  },
  {
    slug: "united-states-coast",
    title: "United States Coast",
    description:
      "United States Coast groups 25 nearby places across 15 cities for local-first day and weekend discovery — mainly beaches, waterfronts. This is a geographic discovery collection derived from a shared coastline; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "coastal_region",
    cities: ["bellingham", "boston", "charleston", "eugene", "los-angeles", "new-haven", "new-york", "portland", "rochester", "san-francisco", "savannah", "seattle", "oakland", "anaheim", "salinas"],
    nearbyPlaces: ["ano-nuevo-state-park-near-san-francisco", "cape-cod-near-boston", "crystal-cove-state-park-near-los-angeles", "deception-pass-state-park-near-seattle", "folly-beach-near-charleston", "hamlin-beach-state-park-near-rochester", "hammonasset-beach-state-park-near-new-haven", "jones-beach-state-park-near-new-york", "larrabee-state-park-near-bellingham", "oregon-dunes-national-recreation-area-near-eugene", "oswald-west-state-park-near-portland", "tybee-island-near-savannah", "silver-sands-state-park-near-new-haven", "wadsworth-falls-state-park-near-new-haven", "angel-island-near-oakland", "crystal-cove-state-park-near-anaheim", "garrapata-state-park-near-salinas", "natural-bridges-state-beach-near-san-jose-us", "salinas-river-national-wildlife-refuge-near-salinas", "sherwood-island-state-park-near-bridgeport", "stewart-b-mckinney-national-wildlife-refuge-near-bridgeport", "island-beach-state-park-near-trenton", "liberty-state-park-near-jersey-city", "sandy-hook-near-jersey-city", "sonoma-coast-state-park-near-santa-rosa"],
    featuredPlaces: ["ano-nuevo-state-park-near-san-francisco", "cape-cod-near-boston", "crystal-cove-state-park-near-los-angeles", "deception-pass-state-park-near-seattle", "folly-beach-near-charleston", "hamlin-beach-state-park-near-rochester", "hammonasset-beach-state-park-near-new-haven", "jones-beach-state-park-near-new-york"],
    featuredCities: ["bellingham", "boston", "charleston", "eugene", "los-angeles", "new-haven"],
    relatedCollections: ["canada-united-states-borderlands", "weekend-escapes-near-new-york", "weekend-escapes-near-portland", "weekend-escapes-near-seattle", "united-states-weekend-escapes", "north-america-weekend-escapes", "north-america-weekend-escapes-2", "weekend-escapes-near-boston"],
  },
  {
    slug: "united-states-forests",
    title: "United States Forests",
    description:
      "United States Forests groups 12 nearby places across 11 cities for local-first day and weekend discovery — mainly nature areas. This is a geographic discovery collection derived from forest landscapes; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "forest_region",
    cities: ["asheville", "boise", "boulder", "charleston", "grand-rapids", "milwaukee", "san-francisco", "santa-fe", "santa-rosa", "san-jose-us", "oakland"],
    nearbyPlaces: ["big-basin-redwoods-state-park-near-san-francisco", "boise-national-forest-near-boise", "dupont-state-recreational-forest-near-asheville", "francis-marion-national-forest-near-charleston", "kettle-moraine-state-forest-near-milwaukee", "manistee-national-forest-near-grand-rapids", "muir-woods-near-san-francisco", "roosevelt-national-forest-near-boulder", "santa-fe-national-forest-near-santa-fe", "armstrong-redwoods-state-natural-reserve-near-santa-rosa", "big-basin-redwoods-state-park-near-san-jose-us", "muir-woods-national-monument-near-oakland"],
    featuredPlaces: ["big-basin-redwoods-state-park-near-san-francisco", "boise-national-forest-near-boise", "dupont-state-recreational-forest-near-asheville", "francis-marion-national-forest-near-charleston", "kettle-moraine-state-forest-near-milwaukee", "manistee-national-forest-near-grand-rapids", "muir-woods-near-san-francisco", "roosevelt-national-forest-near-boulder"],
    featuredCities: ["san-francisco", "asheville", "boise", "boulder", "charleston", "grand-rapids"],
    relatedCollections: ["weekend-escapes-near-san-francisco", "california-weekend-escapes", "united-states-weekend-escapes", "weekend-escapes-near-boulder", "weekend-escapes-near-chicago", "united-states-coast", "united-states-mountains", "united-states-national-parks"],
  },
  {
    slug: "united-states-lakes",
    title: "United States Lakes",
    description:
      "United States Lakes groups 21 nearby places across 15 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["austin", "burlington-vt", "denver", "madison", "missoula", "nashville", "providence", "reno", "sacramento", "salt-lake-city", "traverse-city", "aurora", "stockton", "worcester", "waco"],
    nearbyPlaces: ["chatfield-state-park-near-denver", "devils-lake-state-park-near-madison", "flathead-lake-near-missoula", "folsom-lake-recreation-area-near-sacramento", "great-salt-lake-near-salt-lake-city", "interlochen-state-park-near-traverse-city", "lake-champlain-near-burlington-vt", "lake-tahoe-near-reno", "lake-travis-near-austin", "lincoln-woods-state-park-near-providence", "radnor-lake-state-park-near-nashville", "aurora-reservoir-near-aurora", "camanche-reservoir-near-stockton", "chatfield-state-park-near-aurora", "pardee-reservoir-near-stockton", "quabbin-reservoir-near-worcester", "wachusett-reservoir-near-worcester", "belton-lake-near-waco", "center-hill-lake-near-murfreesboro", "granger-lake-near-waco", "j-percy-priest-lake-near-murfreesboro"],
    featuredPlaces: ["chatfield-state-park-near-denver", "devils-lake-state-park-near-madison", "flathead-lake-near-missoula", "folsom-lake-recreation-area-near-sacramento", "great-salt-lake-near-salt-lake-city", "interlochen-state-park-near-traverse-city", "lake-champlain-near-burlington-vt", "lake-tahoe-near-reno"],
    featuredCities: ["austin", "burlington-vt", "denver", "madison", "missoula", "nashville"],
    relatedCollections: ["united-states-weekend-escapes", "california-weekend-escapes", "canada-united-states-borderlands", "north-america-weekend-escapes", "north-america-weekend-escapes-2", "weekend-escapes-near-boston", "weekend-escapes-near-boulder", "weekend-escapes-near-san-francisco"],
  },
  {
    slug: "united-states-mountains",
    title: "United States Mountains",
    description:
      "United States Mountains groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains. This is a geographic discovery collection derived from shared mountain-range geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "mountain_region",
    cities: ["albuquerque", "anchorage", "bellingham", "boulder", "charlotte", "chattanooga", "denver", "el-paso", "knoxville", "los-angeles", "omaha", "portland", "reno", "richmond", "salt-lake-city"],
    nearbyPlaces: ["angeles-national-forest-near-los-angeles", "big-cottonwood-canyon-near-salt-lake-city", "chugach-state-park-near-anchorage", "crowders-mountain-state-park-near-charlotte", "franklin-mountains-state-park-near-el-paso", "golden-gate-canyon-state-park-near-denver", "great-smoky-mountains-national-park-near-knoxville", "guadalupe-mountains-national-park-near-el-paso", "jemez-mountains-near-albuquerque", "little-cottonwood-canyon-near-salt-lake-city", "loess-hills-near-omaha", "lookout-mountain-near-chattanooga", "mount-hood-national-forest-near-portland", "mount-rose-wilderness-near-reno", "north-cascades-national-park-near-bellingham", "pike-national-forest-near-denver", "rocky-mountain-national-park-near-boulder", "san-gabriel-mountains-national-monument-near-los-angeles", "santa-monica-mountains-recreation-area-near-los-angeles", "shenandoah-national-park-near-richmond", "mount-rose-near-reno", "organ-mountains-desert-peaks-national-monument-near-el-paso", "monte-sano-state-park-near-huntsville", "mount-timpanogos-near-provo", "paris-mountain-state-park-near-spartanburg", "rocky-mountain-near-denver", "san-emigdio-mountains-near-bakersfield", "santa-ana-mountains-near-anaheim", "santa-ana-mountains-near-riverside", "sassafras-mountain-near-greenville"],
    featuredPlaces: ["angeles-national-forest-near-los-angeles", "big-cottonwood-canyon-near-salt-lake-city", "chugach-state-park-near-anchorage", "crowders-mountain-state-park-near-charlotte", "franklin-mountains-state-park-near-el-paso", "golden-gate-canyon-state-park-near-denver", "great-smoky-mountains-national-park-near-knoxville", "guadalupe-mountains-national-park-near-el-paso"],
    featuredCities: ["los-angeles", "denver", "el-paso", "salt-lake-city", "albuquerque", "anchorage"],
    relatedCollections: ["united-states-national-parks", "united-states-weekend-escapes", "north-america-weekend-escapes", "north-america-weekend-escapes-2", "weekend-escapes-near-los-angeles", "weekend-escapes-near-boulder", "california-weekend-escapes", "weekend-escapes-near-portland"],
  },
  {
    slug: "united-states-national-parks",
    title: "United States National Parks",
    description:
      "United States National Parks groups 22 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains, parks, nature areas. This is a geographic discovery collection derived from a shared national-park system; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "national_park_region",
    cities: ["atlanta", "bellingham", "boulder", "chicago", "cleveland", "durango", "el-paso", "fresno", "knoxville", "los-angeles", "louisville", "miami", "richmond", "san-diego", "tacoma"],
    nearbyPlaces: ["cabrillo-national-monument-near-san-diego", "chattahoochee-river-recreation-area-near-atlanta", "cuyahoga-valley-national-park-near-cleveland", "everglades-near-miami", "great-smoky-mountains-national-park-near-knoxville", "guadalupe-mountains-national-park-near-el-paso", "indiana-dunes-near-chicago", "kings-canyon-national-park-near-fresno", "mammoth-cave-national-park-near-louisville", "mesa-verde-national-park-near-durango", "mount-rainier-national-park-near-tacoma", "north-cascades-national-park-near-bellingham", "olympic-national-park-near-tacoma", "rocky-mountain-national-park-near-boulder", "santa-monica-mountains-recreation-area-near-los-angeles", "sequoia-national-park-near-fresno", "shenandoah-national-park-near-richmond", "biscayne-national-park-near-fort-lauderdale", "cuyahoga-valley-national-park-near-akron", "cuyahoga-valley-national-park-near-youngstown", "rocky-mountain-near-denver", "shenandoah-near-washington-dc"],
    featuredPlaces: ["cabrillo-national-monument-near-san-diego", "chattahoochee-river-recreation-area-near-atlanta", "cuyahoga-valley-national-park-near-cleveland", "everglades-near-miami", "great-smoky-mountains-national-park-near-knoxville", "guadalupe-mountains-national-park-near-el-paso", "indiana-dunes-near-chicago", "kings-canyon-national-park-near-fresno"],
    featuredCities: ["fresno", "tacoma", "atlanta", "bellingham", "boulder", "chicago"],
    relatedCollections: ["united-states-mountains", "united-states-weekend-escapes", "north-america-weekend-escapes", "north-america-weekend-escapes-2", "weekend-escapes-near-seattle", "united-states-river-valleys", "california-weekend-escapes", "canada-united-states-borderlands"],
  },
  {
    slug: "united-states-protected-landscapes",
    title: "United States Protected Landscapes",
    description:
      "United States Protected Landscapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["ann-arbor", "colorado-springs", "jacksonville", "las-vegas", "long-beach", "new-york", "newark", "oklahoma-city", "virginia-beach", "chesapeake", "detroit", "anaheim", "aurora", "riverside", "allentown"],
    nearbyPlaces: ["back-bay-national-wildlife-refuge-near-virginia-beach", "bolsa-chica-ecological-reserve-near-long-beach", "garden-of-the-gods-near-colorado-springs", "great-swamp-national-wildlife-refuge-near-newark", "jamaica-bay-wildlife-refuge-near-new-york", "pinckney-state-recreation-area-near-ann-arbor", "red-rock-canyon-conservation-area-near-las-vegas", "south-mountain-reservation-near-newark", "timucuan-ecological-and-historic-preserve-near-jacksonville", "wichita-mountains-wildlife-refuge-near-oklahoma-city", "castlewood-canyon-state-park-near-colorado-springs", "cheyenne-mountain-state-park-near-colorado-springs", "chino-hills-state-park-near-long-beach", "great-dismal-swamp-national-wildlife-refuge-near-virginia-beach", "guana-tolomato-matanzas-national-estuarine-research-reserve-near-jacksonville", "laguna-coast-wilderness-park-near-long-beach", "mackay-island-national-wildlife-refuge-near-virginia-beach", "ramapo-mountain-state-forest-near-newark", "watchung-reservation-near-newark", "back-bay-national-wildlife-refuge-near-chesapeake", "belle-isle-park-near-detroit", "bolsa-chica-ecological-reserve-near-anaheim", "castlewood-canyon-state-park-near-aurora", "cherry-creek-state-park-near-aurora", "chino-hills-state-park-near-anaheim", "cleveland-national-forest-near-anaheim", "cleveland-national-forest-near-riverside", "delaware-water-gap-national-recreation-area-near-allentown", "first-landing-state-park-near-chesapeake", "great-dismal-swamp-national-wildlife-refuge-near-chesapeake"],
    featuredPlaces: ["back-bay-national-wildlife-refuge-near-virginia-beach", "bolsa-chica-ecological-reserve-near-long-beach", "garden-of-the-gods-near-colorado-springs", "great-swamp-national-wildlife-refuge-near-newark", "jamaica-bay-wildlife-refuge-near-new-york", "pinckney-state-recreation-area-near-ann-arbor", "red-rock-canyon-conservation-area-near-las-vegas", "south-mountain-reservation-near-newark"],
    featuredCities: ["newark", "ann-arbor", "colorado-springs", "jacksonville", "las-vegas", "long-beach"],
    relatedCollections: ["north-america-protected-landscapes", "north-america-weekend-escapes", "weekend-escapes-near-new-york", "north-america-weekend-escapes-2", "united-states-weekend-escapes", "weekend-escapes-near-boulder", "weekend-escapes-near-los-angeles", "united-states-coast"],
  },
  {
    slug: "united-states-river-valleys",
    title: "United States River Valleys",
    description:
      "United States River Valleys groups 9 nearby places across 9 cities for local-first day and weekend discovery — mainly nature areas, waterfronts. This is a geographic discovery collection derived from river-valley geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "river_region",
    cities: ["atlanta", "birmingham-al", "chicago", "cleveland", "minneapolis", "portland", "akron", "youngstown", "montgomery"],
    nearbyPlaces: ["cahaba-river-national-wildlife-refuge-near-birmingham-al", "chattahoochee-river-recreation-area-near-atlanta", "columbia-river-gorge-near-portland", "cuyahoga-valley-national-park-near-cleveland", "kankakee-river-state-park-near-chicago", "mississippi-river-recreation-area-near-minneapolis", "cuyahoga-valley-national-park-near-akron", "cuyahoga-valley-national-park-near-youngstown", "tallapoosa-river-near-montgomery"],
    featuredPlaces: ["cahaba-river-national-wildlife-refuge-near-birmingham-al", "chattahoochee-river-recreation-area-near-atlanta", "columbia-river-gorge-near-portland", "cuyahoga-valley-national-park-near-cleveland", "kankakee-river-state-park-near-chicago", "mississippi-river-recreation-area-near-minneapolis"],
    featuredCities: ["atlanta", "birmingham-al", "chicago", "cleveland", "minneapolis", "portland"],
    relatedCollections: ["united-states-national-parks", "north-america-weekend-escapes", "north-america-weekend-escapes-2", "weekend-escapes-near-chicago", "weekend-escapes-near-portland", "united-states-coast", "united-states-mountains"],
  },
  {
    slug: "united-states-weekend-escapes",
    title: "United States Weekend Escapes",
    description:
      "United States Weekend Escapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, mountains, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["albuquerque", "anchorage", "ann-arbor", "austin", "buffalo", "charleston", "duluth", "fort-collins", "knoxville", "richmond", "salt-lake-city", "san-diego", "santa-cruz", "savannah", "seattle"],
    nearbyPlaces: ["antelope-island-state-park-near-salt-lake-city", "anza-borrego-desert-state-park-near-san-diego", "ano-nuevo-state-park-near-santa-cruz", "big-basin-redwoods-state-park-near-santa-cruz", "big-cottonwood-canyon-near-salt-lake-city", "cabrillo-national-monument-near-san-diego", "chugach-state-park-near-anchorage", "cuyamaca-rancho-state-park-near-san-diego", "folly-beach-near-charleston", "francis-marion-national-forest-near-charleston", "frozen-head-state-park-near-knoxville", "great-salt-lake-near-salt-lake-city", "great-smoky-mountains-national-park-near-knoxville", "jay-cooke-state-park-near-duluth", "jemez-mountains-near-albuquerque", "lake-travis-near-austin", "letchworth-state-park-near-buffalo", "little-cottonwood-canyon-near-salt-lake-city", "mckinney-falls-state-park-near-austin", "mount-rainier-near-seattle", "niagara-falls-state-park-near-buffalo", "olympic-near-seattle", "pedernales-falls-state-park-near-austin", "pinckney-state-recreation-area-near-ann-arbor", "pocahontas-state-park-near-richmond", "rocky-mountain-national-park-near-fort-collins", "roosevelt-national-forest-near-fort-collins", "shenandoah-national-park-near-richmond", "skidaway-island-state-park-near-savannah", "tettegouche-state-park-near-duluth"],
    featuredPlaces: ["antelope-island-state-park-near-salt-lake-city", "anza-borrego-desert-state-park-near-san-diego", "ano-nuevo-state-park-near-santa-cruz", "big-basin-redwoods-state-park-near-santa-cruz", "big-cottonwood-canyon-near-salt-lake-city", "cabrillo-national-monument-near-san-diego", "chugach-state-park-near-anchorage", "cuyamaca-rancho-state-park-near-san-diego"],
    featuredCities: ["salt-lake-city", "austin", "san-diego", "buffalo", "charleston", "duluth"],
    relatedCollections: ["united-states-mountains", "united-states-national-parks", "united-states-lakes", "united-states-coast", "canada-united-states-borderlands", "united-states-forests", "united-states-protected-landscapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-aarhus",
    title: "Weekend Escapes near Aarhus",
    description:
      "Weekend Escapes near Aarhus groups 30 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, islands. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["aalborg", "aarhus", "esbjerg", "odense", "roskilde", "vejle", "frederiksberg", "copenhagen", "kolding", "helsingor"],
    nearbyPlaces: ["fano-near-esbjerg", "gudena-near-aarhus", "kalo-castle-near-aarhus", "marselisborg-forests-near-aarhus", "mols-bjerge-national-park-near-aarhus", "rebild-bakker-near-aalborg", "roskilde-fjord-near-roskilde", "stevns-klint-near-roskilde", "svanninge-bakker-near-odense", "vejle-fjord-near-vejle", "endelave-near-vejle", "grejs-river-near-vejle", "little-belt-near-vejle", "skamlingsbanken-near-vejle", "fures-near-frederiksberg", "gribskov-near-frederiksberg", "jgersborg-dyrehave-the-deer-park-near-frederiksberg", "kalvebod-flled-near-frederiksberg", "lake-esrum-near-frederiksberg", "mlleaen-near-frederiksberg", "roskilde-near-copenhagen", "als-near-kolding", "endelave-near-kolding", "fan-near-kolding", "gribskov-near-helsingor", "hallands-vadero-near-helsingor", "kongernes-nordsjaelland-national-park-near-helsingor", "kullaberg-near-helsingor", "lake-esrum-near-helsingor", "little-belt-near-kolding"],
    featuredPlaces: ["fano-near-esbjerg", "gudena-near-aarhus", "kalo-castle-near-aarhus", "marselisborg-forests-near-aarhus", "mols-bjerge-national-park-near-aarhus", "rebild-bakker-near-aalborg", "roskilde-fjord-near-roskilde", "stevns-klint-near-roskilde"],
    featuredCities: ["aarhus", "roskilde", "aalborg", "esbjerg", "odense", "vejle"],
    relatedCollections: ["denmark-germany-borderlands", "northern-europe-weekend-escapes", "denmark-sweden-borderlands", "european-forests", "european-islands", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-amsterdam",
    title: "Weekend Escapes near Amsterdam",
    description:
      "Weekend Escapes near Amsterdam groups 30 nearby places across 13 cities for local-first day and weekend discovery — mainly nature areas, lakes, historic towns. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["almere", "amsterdam", "leiden", "the-hague", "utrecht", "zoetermeer", "leeuwarden", "alphen-aan-den-rijn", "dordrecht", "ede", "westland", "amersfoort", "apeldoorn"],
    nearbyPlaces: ["berkheide-near-the-hague", "delft-near-rotterdam", "eemmeer-near-utrecht", "groene-hart-near-utrecht", "haarlem-near-amsterdam", "kaag-near-leiden", "kromme-rijn-near-utrecht", "markermeer-near-almere", "midden-delfland-near-the-hague", "oostvaardersplassen-near-almere", "utrechtse-heuvelrug-national-park-near-utrecht", "zaanse-schans-near-amsterdam", "zuid-kennemerland-national-park-near-amsterdam", "de-hoge-veluwe-national-park-near-almere", "eem-near-almere", "pampus-near-almere", "weerribben-wieden-national-park-near-almere", "ackerdijkse-plassen-near-zoetermeer", "ameland-near-leeuwarden", "berkheide-near-zoetermeer", "burgumer-mar-near-leeuwarden", "de-alde-feanen-national-park-near-leeuwarden", "de-biesbosch-national-park-near-alphen-aan-den-rijn", "de-biesbosch-national-park-near-dordrecht", "de-biesbosch-national-park-near-ede", "de-biesbosch-national-park-near-zoetermeer", "de-biesbosch-near-westland", "de-hoge-veluwe-national-park-near-alphen-aan-den-rijn", "de-hoge-veluwe-national-park-near-amersfoort", "de-hoge-veluwe-national-park-near-apeldoorn"],
    featuredPlaces: ["berkheide-near-the-hague", "delft-near-rotterdam", "eemmeer-near-utrecht", "groene-hart-near-utrecht", "haarlem-near-amsterdam", "kaag-near-leiden", "kromme-rijn-near-utrecht", "markermeer-near-almere"],
    featuredCities: ["utrecht", "amsterdam", "the-hague", "almere", "leiden"],
    relatedCollections: ["netherlands-national-parks", "western-europe-weekend-escapes", "european-coast", "european-lakes", "western-europe-lakes", "western-europe-protected-landscapes", "weekend-escapes-near-rotterdam", "netherlands-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-angers",
    title: "Weekend Escapes near Angers",
    description:
      "Weekend Escapes near Angers groups 30 nearby places across 10 cities for local-first day and weekend discovery — mainly parks, nature areas, cultural sites. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["angers", "le-mans", "nantes", "rennes", "tours", "lorient", "bourges", "poitiers", "saint-nazaire", "niort"],
    nearbyPlaces: ["chateau-de-chenonceau-near-tours", "lac-de-maine-near-angers", "loire-anjou-touraine-regional-nature-park-near-angers", "normandie-maine-regional-natural-park-near-le-mans", "broceliande-forest-near-rennes", "parc-naturel-regional-de-briere-near-nantes", "briere-regional-natural-park-near-angers", "foret-d-ecouves-near-le-mans", "huisne-near-le-mans", "loire-valley-near-angers", "mayenne-near-angers", "mayenne-near-le-mans", "normandie-maine-regional-natural-park-near-angers", "sarthe-near-le-mans", "belle-ile-near-lorient", "blavet-valley-near-lorient", "brenne-regional-natural-park-near-bourges", "brenne-regional-natural-park-near-poitiers", "briere-regional-natural-park-near-lorient", "briere-regional-natural-park-near-saint-nazaire", "gulf-of-morbihan-near-lorient", "ile-d-yeu-near-saint-nazaire", "ile-de-groix-near-lorient", "lac-de-grand-lieu-near-saint-nazaire", "lake-guerledan-near-lorient", "marais-breton-near-saint-nazaire", "noirmoutier-near-saint-nazaire", "pointe-saint-gildas-near-saint-nazaire", "sevre-niortaise-near-niort", "sologne-near-bourges"],
    featuredPlaces: ["chateau-de-chenonceau-near-tours", "lac-de-maine-near-angers", "loire-anjou-touraine-regional-nature-park-near-angers", "normandie-maine-regional-natural-park-near-le-mans", "broceliande-forest-near-rennes", "parc-naturel-regional-de-briere-near-nantes"],
    featuredCities: ["angers", "le-mans", "nantes", "rennes", "tours"],
    relatedCollections: ["france-protected-landscapes", "western-europe-protected-landscapes", "western-europe-weekend-escapes", "european-forests", "france-lakes", "western-europe-lakes", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-antwerp",
    title: "Weekend Escapes near Antwerp",
    description:
      "Weekend Escapes near Antwerp groups 30 nearby places across 13 cities for local-first day and weekend discovery — mainly nature areas, regional cities, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["antwerp", "brussels", "ghent", "hasselt", "leuven", "aalst", "genk", "molenbeek", "kortrijk", "mons", "anderlecht", "mechelen", "schaerbeek"],
    nearbyPlaces: ["bokrijk-near-hasselt", "bourgoyen-ossemeersen-near-ghent", "bruges-near-brussels", "dijle-near-leuven", "donkmeer-near-ghent", "flemish-ardennes-near-ghent", "ghent-near-brussels", "hallerbos-near-brussels", "hoge-kempen-national-park-near-antwerp", "kalmthoutse-heide-near-antwerp", "lys-near-ghent", "nete-near-antwerp", "peerdsbos-near-antwerp", "sonian-forest-near-brussels", "bourgoyen-ossemeersen-near-aalst", "de-maasduinen-national-park-near-genk", "de-meinweg-national-park-near-genk", "de-zoomkalmthoutse-heide-cross-border-park-near-molenbeek", "dyle-valley-near-molenbeek", "eifel-national-park-near-genk", "flemish-ardennes-near-aalst", "flemish-ardennes-near-kortrijk", "flemish-ardennes-near-mons", "hallerbos-near-aalst", "hallerbos-near-anderlecht", "hallerbos-near-kortrijk", "hallerbos-near-mechelen", "hallerbos-near-molenbeek", "hallerbos-near-schaerbeek", "hoge-kempen-national-park-near-genk"],
    featuredPlaces: ["bokrijk-near-hasselt", "bourgoyen-ossemeersen-near-ghent", "bruges-near-brussels", "dijle-near-leuven", "donkmeer-near-ghent", "flemish-ardennes-near-ghent", "ghent-near-brussels", "hallerbos-near-brussels"],
    featuredCities: ["antwerp", "brussels", "ghent", "hasselt", "leuven"],
    relatedCollections: ["belgium-netherlands-borderlands", "belgium-germany-borderlands", "european-forests", "european-lakes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-arnhem",
    title: "Weekend Escapes near Arnhem",
    description:
      "Weekend Escapes near Arnhem groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly nature areas, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["arnhem", "enschede", "groningen", "maastricht", "nijmegen", "zoetermeer", "leeuwarden", "alphen-aan-den-rijn", "dordrecht", "ede", "westland", "amersfoort", "apeldoorn", "haarlemmermeer"],
    nearbyPlaces: ["hoge-kempen-national-park-near-maastricht", "de-maasduinen-national-park-near-nijmegen", "hoge-veluwe-national-park-near-arnhem", "lauwersmeer-national-park-near-groningen", "sallandse-heuvelrug-national-park-near-enschede", "sint-pietersberg-near-maastricht", "veluwezoom-national-park-near-arnhem", "weerribben-wieden-national-park-near-enschede", "drentsche-aa-near-enschede", "dummer-near-enschede", "twickel-near-enschede", "vechte-near-enschede", "ackerdijkse-plassen-near-zoetermeer", "ameland-near-leeuwarden", "berkheide-near-zoetermeer", "burgumer-mar-near-leeuwarden", "de-alde-feanen-national-park-near-leeuwarden", "de-biesbosch-national-park-near-alphen-aan-den-rijn", "de-biesbosch-national-park-near-dordrecht", "de-biesbosch-national-park-near-ede", "de-biesbosch-national-park-near-zoetermeer", "de-biesbosch-near-westland", "de-hoge-veluwe-national-park-near-alphen-aan-den-rijn", "de-hoge-veluwe-national-park-near-amersfoort", "de-hoge-veluwe-national-park-near-apeldoorn", "de-hoge-veluwe-national-park-near-dordrecht", "de-hoge-veluwe-national-park-near-haarlemmermeer", "de-loonse-en-drunense-duinen-national-park-near-amersfoort", "de-loonse-en-drunense-duinen-national-park-near-dordrecht", "de-loonse-en-drunense-duinen-national-park-near-zoetermeer"],
    featuredPlaces: ["de-maasduinen-national-park-near-nijmegen", "hoge-kempen-national-park-near-maastricht", "hoge-veluwe-national-park-near-arnhem", "lauwersmeer-national-park-near-groningen", "sallandse-heuvelrug-national-park-near-enschede", "sint-pietersberg-near-maastricht", "veluwezoom-national-park-near-arnhem", "weerribben-wieden-national-park-near-enschede"],
    featuredCities: ["arnhem", "enschede", "maastricht", "groningen", "nijmegen"],
    relatedCollections: ["netherlands-national-parks", "germany-netherlands-borderlands", "belgium-netherlands-borderlands", "western-europe-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-athens",
    title: "Weekend Escapes near Athens",
    description:
      "Weekend Escapes near Athens groups 30 nearby places across 7 cities for local-first day and weekend discovery — mainly mountains, lakes, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["athens", "volos", "nikaia", "piraeus", "acharnes", "peristeri", "patras"],
    nearbyPlaces: ["lake-karla-near-volos", "mount-geraneia-near-athens", "mount-hymettus-near-athens", "mount-pelion-near-volos", "mount-parnitha-near-athens", "vravrona-near-athens", "aegina-near-nikaia", "aegina-near-piraeus", "cape-sounion-near-acharnes", "cithaeron-near-acharnes", "geraneia-near-peristeri", "hymettus-near-nikaia", "hymettus-near-peristeri", "lake-marathon-near-acharnes", "lake-marathon-near-peristeri", "lake-marathon-near-piraeus", "lake-vouliagmeni-near-nikaia", "lake-vouliagmeni-near-peristeri", "lake-vouliagmeni-near-piraeus", "mount-chelmos-aroania-near-patras", "mount-erymanthos-near-patras", "mount-hymettus-near-acharnes", "mount-hymettus-near-piraeus", "mount-panachaiko-near-patras", "mount-parnitha-near-acharnes", "mount-parnitha-near-nikaia", "mount-parnitha-near-piraeus", "mount-pentelicus-near-acharnes", "mount-pentelicus-near-nikaia", "mount-pentelicus-near-peristeri"],
    featuredPlaces: ["lake-karla-near-volos", "mount-geraneia-near-athens", "mount-hymettus-near-athens", "mount-pelion-near-volos", "mount-parnitha-near-athens", "vravrona-near-athens"],
    featuredCities: ["athens", "volos"],
    relatedCollections: ["greece-mountains", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
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
    relatedCollections: ["new-zealand-mountains", "oceania-lakes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-barcelona",
    title: "Weekend Escapes near Barcelona",
    description:
      "Weekend Escapes near Barcelona groups 30 nearby places across 8 cities for local-first day and weekend discovery — mainly waterfronts, mountains, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["barcelona", "girona", "tarragona", "lhospitalet", "badalona", "sabadell", "terrassa", "castellon-de-la-plana"],
    nearbyPlaces: ["cap-de-creus-near-girona", "costa-daurada-near-tarragona", "garraf-massif-near-barcelona", "garrotxa-volcanic-zone-natural-park-near-girona", "llobregat-delta-near-barcelona", "montserrat-near-barcelona", "sitges-near-barcelona", "foix-reservoir-near-lhospitalet", "garraf-massif-near-badalona", "garraf-massif-near-lhospitalet", "garraf-massif-near-sabadell", "garraf-massif-near-terrassa", "llobregat-delta-near-badalona", "llobregat-delta-near-lhospitalet", "llobregat-delta-near-terrassa", "montseny-massif-near-badalona", "montseny-massif-near-sabadell", "montseny-massif-near-terrassa", "montserrat-near-badalona", "montserrat-near-lhospitalet", "montserrat-near-sabadell", "montserrat-near-terrassa", "sant-llorenc-del-munt-near-badalona", "sant-llorenc-del-munt-near-lhospitalet", "sant-llorenc-del-munt-near-sabadell", "sau-reservoir-near-sabadell", "serra-d-irta-natural-park-near-castellon-de-la-plana", "serra-de-collserola-near-badalona", "serra-de-collserola-near-lhospitalet", "serra-de-collserola-near-sabadell"],
    featuredPlaces: ["cap-de-creus-near-girona", "costa-daurada-near-tarragona", "garraf-massif-near-barcelona", "garrotxa-volcanic-zone-natural-park-near-girona", "llobregat-delta-near-barcelona", "montserrat-near-barcelona", "sitges-near-barcelona"],
    featuredCities: ["barcelona", "girona", "tarragona"],
    relatedCollections: ["spain-coast", "spain-mountains", "european-coast", "spain-protected-landscapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
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
    relatedCollections: ["ireland-united-kingdom-borderlands", "united-kingdom-mountains", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-berlin",
    title: "Weekend Escapes near Berlin",
    description:
      "Weekend Escapes near Berlin groups 30 nearby places across 11 cities for local-first day and weekend discovery — mainly nature areas, mountains, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["berlin", "dresden", "leipzig", "magdeburg", "potsdam", "braunschweig", "halle", "gottingen", "cottbus", "hildesheim", "weimar"],
    nearbyPlaces: ["dresden-heath-near-dresden", "grunewald-near-berlin", "harz-near-magdeburg", "leipzig-riverside-forest-near-leipzig", "lusatian-mountains-near-dresden", "middle-elbe-biosphere-reserve-near-magdeburg", "markische-schweiz-nature-park-near-berlin", "ore-mountains-near-dresden", "potsdam-near-berlin", "saxon-switzerland-national-park-near-dresden", "spreewald-near-potsdam", "spreewald-near-berlin", "wannsee-berlin", "brocken-near-magdeburg", "high-flaming-nature-park-near-magdeburg", "asse-near-braunschweig", "brocken-near-braunschweig", "duben-heath-near-halle", "elm-near-braunschweig", "geiseltalsee-near-halle", "groer-goitzschesee-near-halle", "harz-national-park-near-braunschweig", "harz-saxony-anhalt-nature-park-near-halle", "kyffhauser-near-halle", "oker-reservoir-near-braunschweig", "petersberg-near-halle", "brocken-near-gottingen", "cottbuser-ostsee-near-cottbus", "deister-near-hildesheim", "drei-gleichen-hills-near-weimar"],
    featuredPlaces: ["dresden-heath-near-dresden", "grunewald-near-berlin", "harz-near-magdeburg", "leipzig-riverside-forest-near-leipzig", "lusatian-mountains-near-dresden", "middle-elbe-biosphere-reserve-near-magdeburg", "markische-schweiz-nature-park-near-berlin", "ore-mountains-near-dresden"],
    featuredCities: ["berlin", "dresden", "magdeburg", "leipzig", "potsdam"],
    relatedCollections: ["czechia-germany-borderlands", "germany-mountains", "germany-poland-borderlands", "germany-forests", "central-europe-weekend-escapes", "central-europe-mountains", "germany-lakes", "germany-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-bilbao",
    title: "Weekend Escapes near Bilbao",
    description:
      "Weekend Escapes near Bilbao groups 30 nearby places across 9 cities for local-first day and weekend discovery — mainly mountains, nature areas, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bilbao", "burgos", "logrono", "pamplona", "san-sebastian", "santander", "vitoria-gasteiz", "gijon", "alcala-de-henares"],
    nearbyPlaces: ["aiako-harria-near-san-sebastian", "aizkorri-aratz-natural-park-near-san-sebastian", "bardenas-reales-near-pamplona", "flysch-basque-coast-near-bilbao", "gaztelugatxe-near-bilbao", "gorbea-natural-park-near-bilbao", "hendaye-bay-near-san-sebastian", "najerilla-near-logrono", "ojo-guarena-near-burgos", "pagoeta-natural-park-near-san-sebastian", "picos-de-europa-national-park-near-santander", "picos-de-urbion-near-logrono", "sierra-de-la-demanda-near-burgos", "urdaibai-biosphere-reserve-near-bilbao", "canon-del-rio-lobos-natural-park-near-burgos", "obarenes-mountains-near-burgos", "pancorbo-gorge-near-burgos", "picos-de-urbion-near-burgos", "aizkorri-aratz-natural-park-near-vitoria-gasteiz", "cares-gorge-near-gijon", "el-atazar-reservoir-near-alcala-de-henares", "gorbeia-natural-park-near-vitoria-gasteiz", "izki-natural-park-near-vitoria-gasteiz", "picos-de-europa-national-park-near-gijon", "redes-natural-park-near-gijon", "salburua-near-vitoria-gasteiz", "sierra-de-ayllon-near-alcala-de-henares", "sierra-del-sueve-near-gijon", "ullibarri-gamboa-reservoir-near-vitoria-gasteiz", "urkiola-natural-park-near-vitoria-gasteiz"],
    featuredPlaces: ["aiako-harria-near-san-sebastian", "aizkorri-aratz-natural-park-near-san-sebastian", "bardenas-reales-near-pamplona", "flysch-basque-coast-near-bilbao", "gaztelugatxe-near-bilbao", "gorbea-natural-park-near-bilbao", "hendaye-bay-near-san-sebastian", "najerilla-near-logrono"],
    featuredCities: ["bilbao", "san-sebastian", "burgos", "logrono", "pamplona", "santander"],
    relatedCollections: ["france-spain-borderlands", "spain-mountains", "spain-protected-landscapes", "southern-europe-weekend-escapes", "european-coast", "european-islands", "southern-europe-mountains", "southern-europe-protected-landscapes"],
  },
  {
    slug: "weekend-escapes-near-birmingham",
    title: "Weekend Escapes near Birmingham",
    description:
      "Weekend Escapes near Birmingham groups 30 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas, parks, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["birmingham", "derby", "leicester", "stoke-on-trent", "wolverhampton", "preston", "milton-keynes", "luton", "northampton", "reading"],
    nearbyPlaces: ["bradgate-park-near-leicester", "cannock-chase-near-birmingham", "clent-hills-near-birmingham", "malvern-hills-near-birmingham", "peak-district-national-park-near-derby", "the-national-forest-near-derby", "tittesworth-reservoir-near-stoke-on-trent", "wenlock-edge-near-wolverhampton", "wyre-forest-near-birmingham", "baggeridge-country-park-near-wolverhampton", "beacon-hill-near-leicester", "burrough-hill-near-leicester", "carsington-water-near-derby", "charnwood-lodge-near-leicester", "clent-hills-near-wolverhampton", "crich-near-derby", "lathkill-dale-near-derby", "long-mynd-near-wolverhampton", "swithland-wood-near-leicester", "the-wrekin-near-wolverhampton", "arnside-and-silverdale-near-preston", "ashridge-estate-near-milton-keynes", "ashridge-near-luton", "cannock-chase-near-stoke-on-trent", "cannock-chase-near-wolverhampton", "chiltern-hills-near-northampton", "chiltern-hills-near-reading", "dunstable-and-whipsnade-downs-near-milton-keynes", "dunstable-downs-near-luton", "fineshade-wood-near-northampton"],
    featuredPlaces: ["bradgate-park-near-leicester", "cannock-chase-near-birmingham", "clent-hills-near-birmingham", "malvern-hills-near-birmingham", "peak-district-national-park-near-derby", "the-national-forest-near-derby", "tittesworth-reservoir-near-stoke-on-trent", "wenlock-edge-near-wolverhampton"],
    featuredCities: ["birmingham", "derby", "leicester", "stoke-on-trent", "wolverhampton"],
    relatedCollections: ["united-kingdom-forests", "united-kingdom-mountains", "western-europe-weekend-escapes", "united-kingdom-lakes", "united-kingdom-protected-landscapes", "united-kingdom-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-bordeaux",
    title: "Weekend Escapes near Bordeaux",
    description:
      "Weekend Escapes near Bordeaux groups 30 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas, mountains, beaches. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bayonne", "bordeaux", "la-rochelle", "pau", "angouleme", "niort", "saint-nazaire", "poitiers", "biarritz", "vannes"],
    nearbyPlaces: ["biarritz-near-bayonne", "dordogne-near-bordeaux", "dune-of-pilat-near-bordeaux", "gave-de-pau-near-pau", "la-rhune-near-bayonne", "landes-de-gascogne-regional-natural-park-near-bordeaux", "marais-poitevin-near-la-rochelle", "medoc-near-bordeaux", "pyrenees-national-park-near-pau", "ile-de-re-near-la-rochelle", "dronne-near-angouleme", "gironde-estuary-near-angouleme", "ile-d-aix-near-angouleme", "ile-d-aix-near-niort", "ile-d-yeu-near-saint-nazaire", "ile-de-re-near-niort", "ile-de-re-near-poitiers", "lac-de-grand-lieu-near-saint-nazaire", "lay-river-near-niort", "marais-breton-near-saint-nazaire", "marais-poitevin-near-niort", "marais-poitevin-near-poitiers", "noirmoutier-near-saint-nazaire", "sevre-niortaise-near-niort", "tardoire-near-angouleme", "vendee-river-near-niort", "bay-of-txingudi-near-biarritz", "belle-ile-en-mer-near-vannes", "bidasoa-near-biarritz", "briere-near-vannes"],
    featuredPlaces: ["biarritz-near-bayonne", "dordogne-near-bordeaux", "dune-of-pilat-near-bordeaux", "gave-de-pau-near-pau", "la-rhune-near-bayonne", "landes-de-gascogne-regional-natural-park-near-bordeaux", "marais-poitevin-near-la-rochelle", "medoc-near-bordeaux"],
    featuredCities: ["bordeaux", "bayonne", "la-rochelle", "pau"],
    relatedCollections: ["france-spain-borderlands", "france-mountains", "france-protected-landscapes", "european-coast", "european-islands", "france-national-parks", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-boston",
    title: "Weekend Escapes near Boston",
    description:
      "Weekend Escapes near Boston groups 20 nearby places across 6 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["boston", "providence", "worcester", "manchester-nh", "albany-ny", "bridgeport"],
    nearbyPlaces: ["blue-hills-reservation-near-boston", "cape-cod-near-boston", "colt-state-park-near-providence", "lincoln-woods-state-park-near-providence", "middlesex-fells-reservation-near-boston", "blackstone-river-and-canal-heritage-state-park-near-worcester", "douglas-state-forest-near-worcester", "purgatory-chasm-state-reservation-near-worcester", "quabbin-reservoir-near-worcester", "wachusett-reservoir-near-worcester", "wells-state-park-near-worcester", "bear-brook-state-park-near-manchester-nh", "berkshires-near-albany-ny", "grafton-lakes-state-park-near-albany-ny", "mount-monadnock-near-manchester-nh", "odiorne-point-state-park-near-manchester-nh", "pack-monadnock-near-manchester-nh", "pawtuckaway-state-park-near-manchester-nh", "sleeping-giant-near-bridgeport", "uncanoonuc-mountains-near-manchester-nh"],
    featuredPlaces: ["blue-hills-reservation-near-boston", "cape-cod-near-boston", "colt-state-park-near-providence", "lincoln-woods-state-park-near-providence", "middlesex-fells-reservation-near-boston"],
    featuredCities: ["boston", "providence"],
    relatedCollections: ["united-states-coast", "united-states-lakes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-boulder",
    title: "Weekend Escapes near Boulder",
    description:
      "Weekend Escapes near Boulder groups 23 nearby places across 5 cities for local-first day and weekend discovery — mainly parks, mountains, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["boulder", "colorado-springs", "denver", "aurora", "cheyenne"],
    nearbyPlaces: ["chatfield-state-park-near-denver", "eldorado-canyon-state-park-near-boulder", "garden-of-the-gods-near-colorado-springs", "golden-gate-canyon-state-park-near-boulder", "mueller-state-park-near-colorado-springs", "pike-national-forest-near-denver", "rocky-mountain-national-park-near-boulder", "roosevelt-national-forest-near-boulder", "castlewood-canyon-state-park-near-colorado-springs", "cheyenne-mountain-state-park-near-colorado-springs", "eleven-mile-state-park-near-colorado-springs", "lake-pueblo-state-park-near-colorado-springs", "aurora-reservoir-near-aurora", "castlewood-canyon-state-park-near-aurora", "chatfield-state-park-near-aurora", "cherry-creek-state-park-near-aurora", "rocky-mountain-arsenal-national-wildlife-refuge-near-aurora", "rocky-mountain-near-denver", "roxborough-state-park-near-aurora", "curt-gowdy-state-park-near-cheyenne", "laramie-mountains-near-cheyenne", "medicine-bow-mountains-near-cheyenne", "vedauwoo-near-cheyenne"],
    featuredPlaces: ["chatfield-state-park-near-denver", "eldorado-canyon-state-park-near-boulder", "garden-of-the-gods-near-colorado-springs", "golden-gate-canyon-state-park-near-boulder", "mueller-state-park-near-colorado-springs", "pike-national-forest-near-denver", "rocky-mountain-national-park-near-boulder", "roosevelt-national-forest-near-boulder"],
    featuredCities: ["boulder", "colorado-springs", "denver"],
    relatedCollections: ["united-states-mountains", "north-america-weekend-escapes", "north-america-protected-landscapes", "united-states-forests", "united-states-lakes", "united-states-national-parks", "united-states-protected-landscapes", "australia-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-bratislava",
    title: "Weekend Escapes near Bratislava",
    description:
      "Weekend Escapes near Bratislava groups 22 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["banska-bystrica", "bratislava", "zilina", "poprad", "nitra"],
    nearbyPlaces: ["devinska-kobyla-near-bratislava", "little-carpathians-near-bratislava", "mala-fatra-national-park-near-zilina", "polana-near-banska-bystrica", "sulov-rocks-near-zilina", "velka-fatra-near-banska-bystrica", "belianske-tatras-near-poprad", "dunajec-river-gorge-near-poprad", "gerlachovsky-stit-near-poprad", "high-tatras-near-poprad", "little-carpathians-near-nitra", "pieniny-national-park-slovakia-near-poprad", "pohronsky-inovec-near-nitra", "povazsky-inovec-near-nitra", "slovak-paradise-national-park-near-poprad", "stiavnica-mountains-near-nitra", "strbske-pleso-near-poprad", "tatra-national-park-near-poprad", "tribec-near-nitra", "vtacnik-mountains-near-nitra", "zitny-ostrov-near-nitra", "zobor-near-nitra"],
    featuredPlaces: ["devinska-kobyla-near-bratislava", "little-carpathians-near-bratislava", "mala-fatra-national-park-near-zilina", "polana-near-banska-bystrica", "sulov-rocks-near-zilina", "velka-fatra-near-banska-bystrica"],
    featuredCities: ["banska-bystrica", "bratislava", "zilina"],
    relatedCollections: ["czechia-slovakia-borderlands", "poland-slovakia-borderlands", "european-mountains", "hungary-slovakia-borderlands", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
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
    relatedCollections: ["australia-national-parks", "queensland-weekend-escapes", "australia-islands", "australia-mountains", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-bristol",
    title: "Weekend Escapes near Bristol",
    description:
      "Weekend Escapes near Bristol groups 30 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas, mountains, beaches. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bath", "bristol", "cardiff", "exeter", "swansea", "bournemouth", "reading", "gloucester", "newport", "swindon"],
    nearbyPlaces: ["afan-forest-park-near-swansea", "brecon-beacons-near-cardiff", "caerphilly-mountain-near-cardiff", "chew-valley-lake-near-bristol", "dartmoor-near-exeter", "forest-of-dean-near-bristol", "garth-mountain-near-cardiff", "gower-peninsula-near-swansea", "jurassic-coast-near-exeter", "mendip-hills-near-bath", "sand-point-near-bristol", "wye-valley-near-cardiff", "brownsea-island-near-bournemouth", "goring-gap-near-reading", "hengistbury-head-near-bournemouth", "jurassic-coast-near-bournemouth", "lulworth-cove-near-bournemouth", "new-forest-near-bournemouth", "savernake-forest-near-reading", "studland-and-godlingston-heath-national-nature-reserve-near-bournemouth", "black-mountains-near-gloucester", "brecon-beacons-near-newport", "cheddar-gorge-near-swindon", "coate-water-country-park-near-swindon", "cotswolds-near-gloucester", "cotswolds-near-swindon", "flat-holm-near-newport", "forest-of-dean-near-gloucester", "forest-of-dean-near-newport", "forest-of-dean-near-swindon"],
    featuredPlaces: ["afan-forest-park-near-swansea", "brecon-beacons-near-cardiff", "caerphilly-mountain-near-cardiff", "chew-valley-lake-near-bristol", "dartmoor-near-exeter", "forest-of-dean-near-bristol", "garth-mountain-near-cardiff", "gower-peninsula-near-swansea"],
    featuredCities: ["cardiff", "bristol", "exeter", "swansea", "bath"],
    relatedCollections: ["united-kingdom-coast", "united-kingdom-mountains", "united-kingdom-forests", "united-kingdom-lakes", "united-kingdom-national-parks", "united-kingdom-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-brno",
    title: "Weekend Escapes near Brno",
    description:
      "Weekend Escapes near Brno groups 29 nearby places across 9 cities for local-first day and weekend discovery — mainly nature areas, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["brno", "ceske-budejovice", "olomouc", "ostrava", "zlin", "plzen", "pardubice", "jihlava", "decin"],
    nearbyPlaces: ["beskydy-protected-area-near-ostrava", "litovelske-pomoravi-near-olomouc", "macocha-gorge-near-brno", "moravian-karst-near-brno", "podyji-national-park-near-brno", "trebon-basin-near-ceske-budejovice", "white-carpathians-near-brno", "beskydy-protected-landscape-area-near-zlin", "brdy-near-plzen", "chriby-near-zlin", "hostyn-vsetin-mountains-near-zlin", "iron-mountains-near-pardubice", "kuneticka-hora-near-pardubice", "maple-mountains-javorniky-near-zlin", "sec-reservoir-near-pardubice", "sumava-national-park-near-plzen", "velka-javorina-near-zlin", "white-carpathians-near-zlin", "zdar-hills-near-pardubice", "bohemian-moravian-highlands-near-jihlava", "central-bohemian-uplands-near-decin", "dalesice-reservoir-near-jihlava", "iron-mountains-near-jihlava", "javorice-near-jihlava", "jizera-mountains-near-decin", "podyji-national-park-near-jihlava", "sazava-river-near-jihlava", "thayatal-national-park-near-jihlava", "zdarske-vrchy-near-jihlava"],
    featuredPlaces: ["beskydy-protected-area-near-ostrava", "litovelske-pomoravi-near-olomouc", "macocha-gorge-near-brno", "moravian-karst-near-brno", "podyji-national-park-near-brno", "trebon-basin-near-ceske-budejovice", "white-carpathians-near-brno"],
    featuredCities: ["brno", "ceske-budejovice", "olomouc", "ostrava"],
    relatedCollections: ["czechia-slovakia-borderlands", "czechia-poland-borderlands", "austria-czechia-borderlands", "czechia-mountains", "carpathians", "czechia-germany-borderlands", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-bruges",
    title: "Weekend Escapes near Bruges",
    description:
      "Weekend Escapes near Bruges groups 30 nearby places across 13 cities for local-first day and weekend discovery — mainly beaches, nature areas, cultural sites. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bruges", "charleroi", "namur", "ostend", "aalst", "genk", "molenbeek", "kortrijk", "mons", "anderlecht", "mechelen", "schaerbeek", "hasselt"],
    nearbyPlaces: ["blankenberge-near-bruges", "citadel-of-namur-near-namur", "eau-d-heure-lakes-near-charleroi", "knokke-heist-near-bruges", "nieuwpoort-near-bruges", "sonian-forest-near-charleroi", "yser-near-ostend", "zwin-near-bruges", "ardennes-near-charleroi", "lesse-near-charleroi", "marche-les-dames-near-charleroi", "sambre-near-charleroi", "bourgoyen-ossemeersen-near-aalst", "de-meinweg-national-park-near-genk", "de-zoomkalmthoutse-heide-cross-border-park-near-molenbeek", "dyle-valley-near-molenbeek", "eifel-national-park-near-genk", "flemish-ardennes-near-aalst", "flemish-ardennes-near-kortrijk", "flemish-ardennes-near-mons", "hallerbos-near-aalst", "hallerbos-near-anderlecht", "hallerbos-near-kortrijk", "hallerbos-near-mechelen", "hallerbos-near-molenbeek", "hallerbos-near-schaerbeek", "hoge-kempen-national-park-near-genk", "hoge-kempen-national-park-near-hasselt", "hoge-kempen-national-park-near-molenbeek", "kalmthout-heath-near-aalst"],
    featuredPlaces: ["blankenberge-near-bruges", "citadel-of-namur-near-namur", "eau-d-heure-lakes-near-charleroi", "knokke-heist-near-bruges", "nieuwpoort-near-bruges", "sonian-forest-near-charleroi", "yser-near-ostend", "zwin-near-bruges"],
    featuredCities: ["bruges", "charleroi", "namur", "ostend"],
    relatedCollections: ["european-coast", "western-europe-weekend-escapes", "belgium-netherlands-borderlands", "european-lakes", "western-europe-lakes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-budapest",
    title: "Weekend Escapes near Budapest",
    description:
      "Weekend Escapes near Budapest groups 30 nearby places across 9 cities for local-first day and weekend discovery — mainly parks, nature areas, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["budapest", "miskolc", "pecs", "gyor", "debrecen", "szeged", "nyiregyhaza", "szekesfehervar", "sopron"],
    nearbyPlaces: ["aggtelek-national-park-near-miskolc", "bukk-national-park-near-budapest", "danube-ipoly-national-park-near-budapest", "lake-balaton-near-budapest", "mecsek-near-pecs", "orfu-near-pecs", "tihany-near-budapest", "bukk-mountains-near-miskolc", "hortobagy-national-park-near-miskolc", "lake-tisza-near-miskolc", "zemplen-mountains-near-miskolc", "bakony-near-gyor", "gerecse-mountains-near-gyor", "hortobagy-national-park-near-debrecen", "kiskunsag-national-park-near-szeged", "lake-oreg-near-gyor", "aggtelek-karst-near-nyiregyhaza", "badacsony-near-szekesfehervar", "bakony-near-szekesfehervar", "balaton-uplands-national-park-near-szekesfehervar", "bukk-national-park-near-nyiregyhaza", "ferto-hansag-national-park-near-gyor", "ferto-hansag-national-park-near-sopron", "gerecse-mountains-near-szekesfehervar", "geschriebenstein-near-sopron", "hortobagy-national-park-near-nyiregyhaza", "koszeg-mountains-near-sopron", "lake-balaton-near-szekesfehervar", "lake-feher-near-szeged", "lake-ferto-lake-neusiedl-near-gyor"],
    featuredPlaces: ["aggtelek-national-park-near-miskolc", "bukk-national-park-near-budapest", "danube-ipoly-national-park-near-budapest", "lake-balaton-near-budapest", "mecsek-near-pecs", "orfu-near-pecs", "tihany-near-budapest"],
    featuredCities: ["budapest", "pecs", "miskolc"],
    relatedCollections: ["hungary-slovakia-borderlands", "central-europe-weekend-escapes", "european-lakes", "european-mountains", "hungary-poland-borderlands", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-chemnitz",
    title: "Weekend Escapes near Chemnitz",
    description:
      "Weekend Escapes near Chemnitz groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly nature areas, mountains, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["chemnitz", "erfurt", "gorlitz", "braunschweig", "halle", "furth", "offenbach-am-main", "paderborn", "darmstadt", "berlin", "erlangen", "gottingen", "cottbus", "hildesheim"],
    nearbyPlaces: ["berzdorfer-see-near-gorlitz", "hainich-national-park-near-erfurt", "ore-mountains-vogtland-nature-park-near-chemnitz", "thuringian-forest-near-erfurt", "zittau-mountains-near-gorlitz", "zschopau-near-chemnitz", "dubener-heide-nature-park-near-chemnitz", "floha-near-chemnitz", "saxon-switzerland-national-park-near-chemnitz", "tharandt-forest-near-chemnitz", "brocken-near-braunschweig", "duben-heath-near-halle", "franconian-switzerland-veldenstein-forest-nature-park-near-furth", "geiseltalsee-near-halle", "groer-goitzschesee-near-halle", "haberge-nature-park-near-furth", "harz-national-park-near-braunschweig", "harz-saxony-anhalt-nature-park-near-halle", "kellerwald-edersee-national-park-near-offenbach-am-main", "kellerwald-edersee-national-park-near-paderborn", "kyffhauser-near-halle", "oker-reservoir-near-braunschweig", "petersberg-near-halle", "vogelsberg-near-darmstadt", "vogelsberg-near-offenbach-am-main", "wannsee-berlin", "bavarian-rhon-nature-park-near-erlangen", "brocken-near-gottingen", "cottbuser-ostsee-near-cottbus", "deister-near-hildesheim"],
    featuredPlaces: ["berzdorfer-see-near-gorlitz", "hainich-national-park-near-erfurt", "ore-mountains-vogtland-nature-park-near-chemnitz", "thuringian-forest-near-erfurt", "zittau-mountains-near-gorlitz", "zschopau-near-chemnitz"],
    featuredCities: ["chemnitz", "erfurt", "gorlitz"],
    relatedCollections: ["czechia-germany-borderlands", "germany-mountains", "central-europe-weekend-escapes", "germany-lakes", "germany-poland-borderlands", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-chicago",
    title: "Weekend Escapes near Chicago",
    description:
      "Weekend Escapes near Chicago groups 26 nearby places across 8 cities for local-first day and weekend discovery — mainly nature areas, waterfronts, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["chicago", "milwaukee", "rockford", "green-bay", "peoria", "fort-wayne", "cedar-rapids", "iowa-city"],
    nearbyPlaces: ["indiana-dunes-near-chicago", "kankakee-river-state-park-near-chicago", "kettle-moraine-state-forest-near-milwaukee", "morton-arboretum-near-chicago", "starved-rock-state-park-near-chicago", "castle-rock-state-park-near-rockford", "high-cliff-state-park-near-green-bay", "horicon-marsh-near-green-bay", "jubilee-college-state-park-near-peoria", "lowden-state-park-near-rockford", "matthiessen-state-park-near-peoria", "point-beach-state-forest-near-green-bay", "rock-cut-state-park-near-rockford", "starved-rock-state-park-near-peoria", "tippecanoe-river-state-park-near-fort-wayne", "white-pines-forest-state-park-near-rockford", "apple-river-canyon-state-park-near-rockford", "banner-marsh-state-fish-and-wildlife-area-near-peoria", "bellevue-state-park-near-cedar-rapids", "emiquon-national-wildlife-refuge-near-peoria", "j-edward-roush-lake-near-fort-wayne", "maquoketa-caves-state-park-near-cedar-rapids", "maquoketa-caves-state-park-near-iowa-city", "peninsula-state-park-near-green-bay", "spring-lake-state-fish-and-wildlife-area-near-peoria", "whitefish-dunes-state-park-near-green-bay"],
    featuredPlaces: ["indiana-dunes-near-chicago", "kankakee-river-state-park-near-chicago", "kettle-moraine-state-forest-near-milwaukee", "morton-arboretum-near-chicago", "starved-rock-state-park-near-chicago"],
    featuredCities: ["chicago", "milwaukee"],
    relatedCollections: ["united-states-forests", "united-states-national-parks", "united-states-river-valleys", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-cluj-napoca",
    title: "Weekend Escapes near Cluj-Napoca",
    description:
      "Weekend Escapes near Cluj-Napoca groups 30 nearby places across 12 cities for local-first day and weekend discovery — mainly nature areas, mountains, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["baia-mare", "cluj-napoca", "sibiu", "pitesti", "ploiesti", "buzau", "ramnicu-valcea", "suceava", "targu-mures", "arad", "satu-mare", "bucharest"],
    nearbyPlaces: ["apuseni-natural-park-near-cluj-napoca", "cibin-river-near-sibiu", "cindrel-mountains-near-sibiu", "fagaras-mountains-near-cluj-napoca", "rodna-mountains-near-baia-mare", "scarisoara-cave-near-cluj-napoca", "turda-gorge-near-cluj-napoca", "arges-river-near-pitesti", "baiu-mountains-near-ploiesti", "bucegi-natural-park-near-buzau", "bucegi-natural-park-near-ploiesti", "buila-vanturarita-national-park-near-ramnicu-valcea", "calimani-national-park-near-suceava", "calimani-national-park-near-targu-mures", "capatanii-mountains-near-ramnicu-valcea", "ciucas-mountains-near-buzau", "ciucas-mountains-near-ploiesti", "codru-moma-mountains-near-arad", "cozia-national-park-near-pitesti", "cozia-national-park-near-ramnicu-valcea", "fagaras-mountains-near-ramnicu-valcea", "gurghiu-mountains-near-targu-mures", "gutai-mountains-near-satu-mare", "harghita-mountains-near-targu-mures", "iezer-mountains-near-pitesti", "lake-vidraru-near-pitesti", "lake-vidraru-near-ramnicu-valcea", "lotru-mountains-near-ramnicu-valcea", "meses-mountains-near-satu-mare", "piatra-craiului-national-park-near-bucharest"],
    featuredPlaces: ["apuseni-natural-park-near-cluj-napoca", "cibin-river-near-sibiu", "cindrel-mountains-near-sibiu", "fagaras-mountains-near-cluj-napoca", "rodna-mountains-near-baia-mare", "scarisoara-cave-near-cluj-napoca", "turda-gorge-near-cluj-napoca"],
    featuredCities: ["cluj-napoca", "sibiu", "baia-mare"],
    relatedCollections: ["romania-mountains", "carpathians", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-cologne",
    title: "Weekend Escapes near Cologne",
    description:
      "Weekend Escapes near Cologne groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["aachen", "bochum", "bonn", "cologne", "dusseldorf", "essen", "gelsenkirchen", "hamm", "herne", "munster", "duisburg", "krefeld", "leverkusen", "mulheim-an-der-ruhr", "neuss"],
    nearbyPlaces: ["arnsberg-forest-nature-park-near-bochum", "eifel-national-park-near-aachen", "hambach-forest-near-cologne", "hohe-mark-nature-park-near-bochum", "neandertal-near-dusseldorf", "rhineland-nature-park-near-cologne", "rur-reservoir-near-aachen", "siebengebirge-near-bonn", "zollverein-coal-mine-industrial-complex-near-essen", "bergisches-land-near-bochum", "hengsteysee-near-bochum", "hurtgen-forest-near-aachen", "mohne-reservoir-near-bochum", "rheinland-nature-park-near-aachen", "sauerland-near-bochum", "siebengebirge-near-aachen", "vesdre-near-aachen", "ardey-hills-near-gelsenkirchen", "arnsberg-forest-nature-park-near-hamm", "arnsberg-forest-nature-park-near-herne", "baumberge-near-munster", "bergisches-land-near-duisburg", "bergisches-land-near-gelsenkirchen", "bergisches-land-near-krefeld", "bergisches-land-near-leverkusen", "bergisches-land-near-mulheim-an-der-ruhr", "bergisches-land-near-neuss", "bergisches-land-near-solingen", "bergisches-land-near-wuppertal", "bigge-reservoir-near-herne"],
    featuredPlaces: ["arnsberg-forest-nature-park-near-bochum", "eifel-national-park-near-aachen", "hambach-forest-near-cologne", "hohe-mark-nature-park-near-bochum", "neandertal-near-dusseldorf", "rhineland-nature-park-near-cologne", "rur-reservoir-near-aachen", "siebengebirge-near-bonn"],
    featuredCities: ["aachen", "bochum", "cologne", "bonn", "dusseldorf", "essen"],
    relatedCollections: ["belgium-germany-borderlands", "germany-netherlands-borderlands", "central-europe-weekend-escapes", "germany-forests", "germany-lakes", "germany-luxembourg-borderlands", "germany-weekend-escapes", "germany-mountains"],
  },
  {
    slug: "weekend-escapes-near-cork",
    title: "Weekend Escapes near Cork",
    description:
      "Weekend Escapes near Cork groups 30 nearby places across 9 cities for local-first day and weekend discovery — mainly mountains, nature areas, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["cork", "kilkenny", "killarney", "limerick", "tralee", "waterford", "dublin", "bray", "ennis"],
    nearbyPlaces: ["ballyhoura-mountains-near-limerick", "beara-peninsula-near-cork", "blackstairs-mountains-near-kilkenny", "cliffs-of-moher-near-limerick", "comeragh-mountains-near-waterford", "curragh-chase-forest-park-near-limerick", "fota-island-near-cork", "galtee-mountains-near-cork", "gougane-barra-near-cork", "jenkinstown-park-near-kilkenny", "lough-derg-near-limerick", "macgillycuddys-reeks-near-killarney", "slieve-mish-mountains-near-tralee", "phoenix-park-dublin", "bray-head-near-bray", "burren-national-park-near-ennis", "cliffs-of-moher-near-ennis", "coole-park-near-ennis", "dalkey-island-near-bray", "djouce-near-bray", "fanore-near-ennis", "great-sugar-loaf-near-bray", "inchiquin-lough-near-ennis", "killiney-hill-near-bray", "lahinch-beach-near-ennis", "lough-derg-near-ennis", "lough-tay-near-bray", "powerscourt-waterfall-near-bray", "the-burren-near-ennis", "wicklow-mountains-national-park-near-bray"],
    featuredPlaces: ["ballyhoura-mountains-near-limerick", "beara-peninsula-near-cork", "blackstairs-mountains-near-kilkenny", "cliffs-of-moher-near-limerick", "comeragh-mountains-near-waterford", "curragh-chase-forest-park-near-limerick", "fota-island-near-cork", "galtee-mountains-near-cork"],
    featuredCities: ["cork", "limerick", "kilkenny", "killarney", "tralee", "waterford"],
    relatedCollections: ["ireland-mountains", "european-forests", "european-islands", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-dublin",
    title: "Weekend Escapes near Dublin",
    description:
      "Weekend Escapes near Dublin groups 28 nearby places across 6 cities for local-first day and weekend discovery — mainly mountains, parks, cultural sites. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["athlone", "drogheda", "dublin", "swords", "bray", "ennis"],
    nearbyPlaces: ["bru-na-boinne-near-drogheda", "bull-island-near-dublin", "clara-bog-near-athlone", "cooley-mountains-near-drogheda", "glendalough-near-dublin", "phoenix-park-dublin", "slieve-bloom-mountains-near-athlone", "wicklow-mountains-national-park-near-swords", "bettystown-near-drogheda", "clogherhead-near-drogheda", "hill-of-tara-near-drogheda", "howth-head-near-swords", "ireland-s-eye-near-swords", "loughcrew-near-drogheda", "malahide-near-swords", "rogerstown-estuary-near-swords", "bray-head-near-bray", "burren-national-park-near-ennis", "coole-park-near-ennis", "dalkey-island-near-bray", "djouce-near-bray", "great-sugar-loaf-near-bray", "inchiquin-lough-near-ennis", "killiney-hill-near-bray", "lough-derg-near-ennis", "lough-tay-near-bray", "powerscourt-waterfall-near-bray", "wicklow-mountains-national-park-near-bray"],
    featuredPlaces: ["bru-na-boinne-near-drogheda", "bull-island-near-dublin", "clara-bog-near-athlone", "cooley-mountains-near-drogheda", "glendalough-near-dublin", "phoenix-park-dublin", "slieve-bloom-mountains-near-athlone", "wicklow-mountains-national-park-near-swords"],
    featuredCities: ["dublin", "athlone", "drogheda", "swords"],
    relatedCollections: ["western-europe-weekend-escapes", "ireland-mountains", "ireland-united-kingdom-borderlands", "european-islands", "european-lakes", "ireland-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-dubrovnik",
    title: "Weekend Escapes near Dubrovnik",
    description:
      "Weekend Escapes near Dubrovnik groups 14 nearby places across 3 cities for local-first day and weekend discovery — mainly islands, mountains, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["dubrovnik", "split", "zadar"],
    nearbyPlaces: ["biokovo-nature-park-near-split", "elaphiti-islands-near-dubrovnik", "hvar-near-split", "krka-national-park-near-split", "mljet-national-park-near-dubrovnik", "mosor-near-split", "peljesac-near-dubrovnik", "biokovo-near-dubrovnik", "dugi-otok-near-zadar", "krka-national-park-near-zadar", "lake-vrana-near-zadar", "paklenica-national-park-near-zadar", "telascica-nature-park-near-zadar", "velebit-near-zadar"],
    featuredPlaces: ["biokovo-nature-park-near-split", "elaphiti-islands-near-dubrovnik", "hvar-near-split", "krka-national-park-near-split", "mljet-national-park-near-dubrovnik", "mosor-near-split", "peljesac-near-dubrovnik"],
    featuredCities: ["split", "dubrovnik"],
    relatedCollections: ["croatia-mountains", "european-islands", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-durham",
    title: "Weekend Escapes near Durham",
    description:
      "Weekend Escapes near Durham groups 29 nearby places across 8 cities for local-first day and weekend discovery — mainly nature areas, beaches, islands. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["durham", "kingston-upon-hull", "sunderland", "york", "preston", "middlesbrough", "wrexham", "chester"],
    nearbyPlaces: ["durham-coast-near-durham", "marsden-rock-near-sunderland", "north-pennines-near-durham", "north-york-moors-national-park-near-york", "spurn-near-kingston-upon-hull", "castle-eden-dene-near-sunderland", "roker-near-sunderland", "whitburn-near-sunderland", "arnside-and-silverdale-near-preston", "forest-of-bowland-near-preston", "lake-district-near-preston", "morecambe-bay-near-preston", "north-pennines-near-middlesbrough", "north-york-moors-near-middlesbrough", "pendle-hill-near-preston", "robin-hood-s-bay-near-middlesbrough", "roseberry-topping-near-middlesbrough", "saltburn-by-the-sea-near-middlesbrough", "sutton-bank-near-middlesbrough", "clwydian-range-and-dee-valley-near-wrexham", "clwydian-range-near-chester", "clwydian-range-near-wrexham", "dee-estuary-near-chester", "delamere-forest-near-chester", "hilbre-islands-near-chester", "moel-famau-near-wrexham", "peak-district-near-chester", "peak-district-near-wrexham", "wirral-peninsula-near-chester"],
    featuredPlaces: ["durham-coast-near-durham", "marsden-rock-near-sunderland", "north-pennines-near-durham", "north-york-moors-national-park-near-york", "spurn-near-kingston-upon-hull"],
    featuredCities: ["durham", "kingston-upon-hull", "sunderland", "york"],
    relatedCollections: ["western-europe-weekend-escapes", "european-islands", "united-kingdom-coast", "united-kingdom-national-parks", "united-kingdom-protected-landscapes", "united-kingdom-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-edinburgh",
    title: "Weekend Escapes near Edinburgh",
    description:
      "Weekend Escapes near Edinburgh groups 30 nearby places across 11 cities for local-first day and weekend discovery — mainly nature areas, parks, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["aberdeen", "carlisle", "dundee", "edinburgh", "glasgow", "newcastle-upon-tyne", "preston", "middlesbrough", "stirling", "wrexham", "chester"],
    nearbyPlaces: ["aberlady-bay-near-edinburgh", "cairngorms-national-park-near-aberdeen", "glamis-castle-near-dundee", "hadrians-wall-near-carlisle", "holyrood-park-edinburgh", "kielder-water-near-newcastle-upon-tyne", "lake-district-near-carlisle", "loch-lomond-and-the-trossachs-near-glasgow", "mugdock-country-park-near-glasgow", "north-pennines-near-newcastle-upon-tyne", "northumberland-national-park-near-newcastle-upon-tyne", "pentland-hills-edinburgh", "yellowcraig-near-edinburgh", "arnside-and-silverdale-near-preston", "forest-of-bowland-near-preston", "lake-district-near-preston", "morecambe-bay-near-preston", "north-pennines-near-middlesbrough", "north-york-moors-near-middlesbrough", "pendle-hill-near-preston", "ribble-and-alt-estuaries-near-preston", "robin-hood-s-bay-near-middlesbrough", "roseberry-topping-near-middlesbrough", "saltburn-by-the-sea-near-middlesbrough", "sutton-bank-near-middlesbrough", "ben-a-an-near-stirling", "ben-ledi-near-stirling", "ben-lomond-near-stirling", "clwydian-range-and-dee-valley-near-wrexham", "clwydian-range-near-chester"],
    featuredPlaces: ["aberlady-bay-near-edinburgh", "cairngorms-national-park-near-aberdeen", "glamis-castle-near-dundee", "hadrians-wall-near-carlisle", "holyrood-park-edinburgh", "kielder-water-near-newcastle-upon-tyne", "lake-district-near-carlisle", "loch-lomond-and-the-trossachs-near-glasgow"],
    featuredCities: ["edinburgh", "newcastle-upon-tyne", "carlisle", "glasgow", "aberdeen", "dundee"],
    relatedCollections: ["united-kingdom-national-parks", "united-kingdom-lakes", "united-kingdom-coast", "united-kingdom-protected-landscapes", "united-kingdom-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-florence",
    title: "Weekend Escapes near Florence",
    description:
      "Weekend Escapes near Florence groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly nature areas, lakes, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bologna", "florence", "lucca", "pisa", "rimini", "siena", "cesena", "forli", "modena", "la-spezia", "pistoia", "vicenza", "terni", "prato"],
    nearbyPlaces: ["alpi-apuane-near-lucca", "comacchio-valleys-near-bologna", "furlo-pass-near-rimini", "garfagnana-near-lucca", "gessi-bolognesi-park-near-bologna", "lake-bilancino-near-florence", "lake-massaciuccoli-near-pisa", "monti-del-chianti-near-florence", "val-d-orcia-near-siena", "vallombrosa-near-florence", "foreste-casentinesi-monte-falterona-campigna-national-park-near-rimini", "marecchia-near-rimini", "monte-conero-near-rimini", "monte-titano-near-rimini", "acquacheta-waterfall-near-cesena", "acquacheta-waterfall-near-forli", "appennino-tosco-emiliano-national-park-near-modena", "apuan-alps-near-la-spezia", "apuan-alps-regional-park-near-pistoia", "aveto-natural-regional-park-near-la-spezia", "berici-hills-near-vicenza", "casentinesi-forests-monte-falterona-and-campigna-national-park-near-pistoia", "cimini-hills-near-terni", "cinque-terre-national-park-near-la-spezia", "euganean-hills-near-vicenza", "foreste-casentinesi-monte-falterona-and-campigna-national-park-near-forli", "foreste-casentinesi-monte-falterona-campigna-national-park-near-cesena", "foreste-casentinesi-monte-falterona-campigna-national-park-near-prato", "lake-bilancino-near-prato", "lake-massaciuccoli-near-la-spezia"],
    featuredPlaces: ["alpi-apuane-near-lucca", "comacchio-valleys-near-bologna", "furlo-pass-near-rimini", "garfagnana-near-lucca", "gessi-bolognesi-park-near-bologna", "lake-bilancino-near-florence", "lake-massaciuccoli-near-pisa", "monti-del-chianti-near-florence"],
    featuredCities: ["florence", "bologna", "lucca", "pisa", "rimini", "siena"],
    relatedCollections: ["italy-lakes", "italy-mountains", "italy-protected-landscapes", "italy-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-frankfurt",
    title: "Weekend Escapes near Frankfurt",
    description:
      "Weekend Escapes near Frankfurt groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, mountains, regional cities. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["frankfurt", "heidelberg", "karlsruhe", "kassel", "mainz", "wurzburg", "ingolstadt", "hamm", "herne", "braunschweig", "duisburg", "gelsenkirchen", "krefeld", "leverkusen", "mulheim-an-der-ruhr"],
    nearbyPlaces: ["black-forest-national-park-near-karlsruhe", "heidelberg-near-frankfurt", "kellerwald-edersee-national-park-near-kassel", "odenwald-near-heidelberg", "reinhardswald-near-kassel", "rheingau-near-frankfurt", "rhon-mountains-near-frankfurt", "spessart-near-wurzburg", "steigerwald-near-wurzburg", "taunus-near-frankfurt", "upper-middle-rhine-valley-near-mainz", "habichtswald-near-kassel", "hoher-meiner-near-kassel", "kaufunger-wald-near-kassel", "solling-vogler-nature-park-near-kassel", "altmuhl-valley-nature-park-near-ingolstadt", "arnsberg-forest-nature-park-near-hamm", "arnsberg-forest-nature-park-near-herne", "asse-near-braunschweig", "bergisches-land-near-duisburg", "bergisches-land-near-gelsenkirchen", "bergisches-land-near-krefeld", "bergisches-land-near-leverkusen", "bergisches-land-near-mulheim-an-der-ruhr", "bergisches-land-near-neuss", "bergisches-land-near-solingen", "bergisches-land-near-wuppertal", "bigge-reservoir-near-herne", "biggesee-near-wuppertal", "brocken-near-braunschweig"],
    featuredPlaces: ["black-forest-national-park-near-karlsruhe", "heidelberg-near-frankfurt", "kellerwald-edersee-national-park-near-kassel", "odenwald-near-heidelberg", "reinhardswald-near-kassel", "rheingau-near-frankfurt", "rhon-mountains-near-frankfurt", "spessart-near-wurzburg"],
    featuredCities: ["frankfurt", "kassel", "wurzburg", "heidelberg", "karlsruhe", "mainz"],
    relatedCollections: ["germany-forests", "germany-mountains", "central-europe-weekend-escapes", "france-germany-borderlands", "germany-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-freiburg",
    title: "Weekend Escapes near Freiburg",
    description:
      "Weekend Escapes near Freiburg groups 30 nearby places across 12 cities for local-first day and weekend discovery — mainly nature areas, mountains, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["freiburg", "konstanz", "saarbrucken", "stuttgart", "ulm", "ingolstadt", "ludwigshafen", "duisburg", "leverkusen", "furth", "heilbronn", "wiesbaden"],
    nearbyPlaces: ["feldberg-near-freiburg", "hegau-near-konstanz", "reichenau-island-near-konstanz", "saar-hunsruck-nature-park-near-saarbrucken", "saarschleife-near-saarbrucken", "schauinsland-near-freiburg", "schluchsee-near-freiburg", "schurwald-near-stuttgart", "schonbuch-nature-park-near-stuttgart", "swabian-jura-near-stuttgart", "titisee-near-freiburg", "welzheim-forest-near-stuttgart", "bostalsee-near-saarbrucken", "hunsruck-hochwald-national-park-near-saarbrucken", "northern-vosges-regional-nature-park-near-saarbrucken", "adelegg-near-ulm", "altmuhl-valley-nature-park-near-ingolstadt", "blautopf-near-ulm", "bussen-near-ulm", "donnersberg-near-ludwigshafen", "eifel-near-duisburg", "eifel-near-leverkusen", "federsee-near-ulm", "franconian-jura-near-furth", "franconian-jura-near-ingolstadt", "groer-brombachsee-near-furth", "groer-brombachsee-near-ingolstadt", "hesselberg-near-furth", "heuchelberg-near-heilbronn", "hunsruck-hochwald-national-park-near-wiesbaden"],
    featuredPlaces: ["feldberg-near-freiburg", "hegau-near-konstanz", "reichenau-island-near-konstanz", "saar-hunsruck-nature-park-near-saarbrucken", "saarschleife-near-saarbrucken", "schauinsland-near-freiburg", "schluchsee-near-freiburg", "schurwald-near-stuttgart"],
    featuredCities: ["freiburg", "stuttgart", "konstanz", "saarbrucken"],
    relatedCollections: ["france-germany-borderlands", "germany-mountains", "central-europe-weekend-escapes", "belgium-germany-borderlands", "germany-forests", "germany-lakes", "germany-luxembourg-borderlands", "european-islands"],
  },
  {
    slug: "weekend-escapes-near-galway",
    title: "Weekend Escapes near Galway",
    description:
      "Weekend Escapes near Galway groups 15 nearby places across 4 cities for local-first day and weekend discovery — mainly nature areas, mountains, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["galway", "sligo", "westport", "ennis"],
    nearbyPlaces: ["benbulbin-near-sligo", "clew-bay-near-westport", "connemara-national-park-near-galway", "coole-park-near-galway", "lough-gill-near-sligo", "maumturks-near-galway", "the-burren-near-galway", "burren-national-park-near-ennis", "cliffs-of-moher-near-ennis", "coole-park-near-ennis", "fanore-near-ennis", "inchiquin-lough-near-ennis", "lahinch-beach-near-ennis", "lough-derg-near-ennis", "the-burren-near-ennis"],
    featuredPlaces: ["benbulbin-near-sligo", "clew-bay-near-westport", "connemara-national-park-near-galway", "coole-park-near-galway", "lough-gill-near-sligo", "maumturks-near-galway", "the-burren-near-galway"],
    featuredCities: ["galway", "sligo", "westport"],
    relatedCollections: ["ireland-mountains", "ireland-united-kingdom-borderlands", "ireland-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-gdansk",
    title: "Weekend Escapes near Gdansk",
    description:
      "Weekend Escapes near Gdansk groups 30 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas, lakes, beaches. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["gdansk", "olsztyn", "wloclawek", "koszalin", "elblag", "slupsk", "plock", "gorzow-wielkopolski", "sopot", "grudziadz"],
    nearbyPlaces: ["lake-ukiel-near-olsztyn", "slowinski-national-park-near-gdansk", "tricity-landscape-park-near-gdansk", "tuchola-forest-national-park-near-gdansk", "lyna-near-olsztyn", "brodnica-landscape-park-near-wloclawek", "drawa-national-park-near-koszalin", "drawsko-landscape-park-near-koszalin", "druzno-lake-druzno-near-elblag", "ebsko-lake-near-slupsk", "gorzno-lidzbark-landscape-park-near-plock", "gorzno-lidzbark-landscape-park-near-wloclawek", "iawa-lakeland-landscape-park-near-elblag", "jeziorak-near-elblag", "lake-gardno-near-slupsk", "lake-jamno-near-koszalin", "lower-vistula-valley-near-elblag", "mielno-near-koszalin", "slovincian-national-park-near-slupsk", "sowinski-national-park-near-koszalin", "supia-valley-landscape-park-near-slupsk", "tuchola-forest-near-wloclawek", "upawa-river-near-slupsk", "vistula-lagoon-near-elblag", "vistula-spit-landscape-park-near-elblag", "wda-landscape-park-near-wloclawek", "wiezyca-near-slupsk", "barlinek-gorzow-landscape-park-near-gorzow-wielkopolski", "bay-of-puck-near-sopot", "brodnica-landscape-park-near-grudziadz"],
    featuredPlaces: ["lake-ukiel-near-olsztyn", "slowinski-national-park-near-gdansk", "tricity-landscape-park-near-gdansk", "tuchola-forest-national-park-near-gdansk", "lyna-near-olsztyn"],
    featuredCities: ["gdansk", "olsztyn"],
    relatedCollections: ["european-coast", "poland-national-parks", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-gothenburg",
    title: "Weekend Escapes near Gothenburg",
    description:
      "Weekend Escapes near Gothenburg groups 30 nearby places across 8 cities for local-first day and weekend discovery — mainly islands, lakes, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["gothenburg", "jonkoping", "boras", "vaxjo", "halmstad", "vasteras", "karlskrona", "eskilstuna"],
    nearbyPlaces: ["delsjon-near-gothenburg", "gothenburg-archipelago-near-gothenburg", "sodra-bohuslan-archipelago-near-gothenburg", "marstrand-near-gothenburg", "store-mosse-national-park-near-jonkoping", "vattern-near-jonkoping", "alleberg-near-boras", "billingen-near-boras", "lake-asnen-near-vaxjo", "lake-asunden-near-boras", "lake-bolmen-near-vaxjo", "lake-hornborga-near-boras", "lake-mjorn-near-boras", "lake-tolken-near-boras", "nissan-river-near-halmstad", "norra-kvill-national-park-near-vaxjo", "store-mosse-national-park-near-halmstad", "store-mosse-national-park-near-vaxjo", "taberg-near-vaxjo", "tiveden-national-park-near-vasteras", "tylosand-near-halmstad", "varaskruv-nature-reserve-near-vaxjo", "blekinge-archipelago-near-karlskrona", "hano-bay-near-karlskrona", "hano-near-karlskrona", "ivo-lake-near-karlskrona", "lake-hjalmaren-near-eskilstuna", "lake-hjalmaren-near-vasteras", "listerlandet-near-karlskrona", "soderasen-national-park-near-karlskrona"],
    featuredPlaces: ["delsjon-near-gothenburg", "gothenburg-archipelago-near-gothenburg", "sodra-bohuslan-archipelago-near-gothenburg", "marstrand-near-gothenburg", "store-mosse-national-park-near-jonkoping", "vattern-near-jonkoping"],
    featuredCities: ["gothenburg", "jonkoping"],
    relatedCollections: ["sweden-islands", "european-lakes", "sweden-national-parks", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-graz",
    title: "Weekend Escapes near Graz",
    description:
      "Weekend Escapes near Graz groups 30 nearby places across 7 cities for local-first day and weekend discovery — mainly mountains, lakes, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["graz", "klagenfurt", "sankt-polten", "vienna", "villach", "linz", "eisenstadt"],
    nearbyPlaces: ["barenschutzklamm-near-graz", "dobratsch-near-villach", "dunkelsteinerwald-near-sankt-polten", "gesause-national-park-near-graz", "hohe-wand-near-vienna", "karawanks-near-klagenfurt", "lake-faak-near-villach", "lake-neusiedl-near-vienna", "schockl-near-graz", "schonbrunn-vienna", "stubenberg-am-see-near-graz", "wachau-near-sankt-polten", "worthersee-near-klagenfurt", "hohe-wand-near-sankt-polten", "julian-alps-near-villach", "lake-ossiach-near-villach", "millstatter-see-near-villach", "otscher-near-sankt-polten", "traisen-near-sankt-polten", "vienna-woods-near-sankt-polten", "worthersee-near-villach", "attersee-near-linz", "hollengebirge-near-linz", "kalkalpen-national-park-near-linz", "sengsengebirge-near-linz", "traunsee-near-linz", "traunstein-near-linz", "wachau-valley-near-vienna", "danube-auen-national-park-near-eisenstadt", "ferto-hansag-national-park-near-eisenstadt"],
    featuredPlaces: ["barenschutzklamm-near-graz", "dobratsch-near-villach", "dunkelsteinerwald-near-sankt-polten", "gesause-national-park-near-graz", "hohe-wand-near-vienna", "karawanks-near-klagenfurt", "lake-faak-near-villach", "lake-neusiedl-near-vienna"],
    featuredCities: ["graz", "vienna", "klagenfurt", "sankt-polten", "villach"],
    relatedCollections: ["austria-slovenia-borderlands", "austria-mountains", "austria-lakes", "central-europe-weekend-escapes", "austria-czechia-borderlands", "austria-italy-borderlands", "central-europe-mountains", "eastern-alps"],
  },
  {
    slug: "weekend-escapes-near-grenoble",
    title: "Weekend Escapes near Grenoble",
    description:
      "Weekend Escapes near Grenoble groups 30 nearby places across 12 cities for local-first day and weekend discovery — mainly mountains, lakes, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["annecy", "avignon", "chambery", "grenoble", "lyon", "saint-etienne", "toulon", "antibes", "valence", "cannes", "albi", "beziers"],
    nearbyPlaces: ["alpilles-near-avignon", "bauges-near-chambery", "beaujolais-near-lyon", "grand-parc-de-miribel-jonage-near-lyon", "lac-de-monteynard-avignonet-near-grenoble", "lac-du-bourget-near-chambery", "lake-annecy-near-annecy", "livradois-forez-regional-natural-park-near-saint-etienne", "mont-ventoux-near-avignon", "monts-du-lyonnais-near-lyon", "pilat-regional-natural-park-near-lyon", "vercors-regional-park-near-grenoble", "ecrins-national-park-near-grenoble", "lac-de-grangent-near-saint-etienne", "monts-du-lyonnais-near-saint-etienne", "pierre-sur-haute-near-saint-etienne", "vercors-massif-near-saint-etienne", "calanques-national-park-near-toulon", "gorges-de-daluis-near-antibes", "lac-de-monteynard-avignonet-near-valence", "mercantour-national-park-near-antibes", "mercantour-national-park-near-cannes", "mont-aiguille-near-valence", "mont-gerbier-de-jonc-near-valence", "mont-mezenc-near-valence", "pilat-regional-natural-park-near-valence", "vercors-regional-natural-park-near-valence", "verdon-gorge-near-antibes", "aubrac-near-albi", "camargue-near-beziers"],
    featuredPlaces: ["alpilles-near-avignon", "bauges-near-chambery", "beaujolais-near-lyon", "grand-parc-de-miribel-jonage-near-lyon", "lac-de-monteynard-avignonet-near-grenoble", "lac-du-bourget-near-chambery", "lake-annecy-near-annecy", "livradois-forez-regional-natural-park-near-saint-etienne"],
    featuredCities: ["lyon", "grenoble", "avignon", "chambery", "annecy", "saint-etienne"],
    relatedCollections: ["france-mountains", "france-lakes", "france-italy-borderlands", "france-protected-landscapes", "western-europe-weekend-escapes", "france-national-parks", "france-weekend-escapes", "western-europe-protected-landscapes"],
  },
  {
    slug: "weekend-escapes-near-hamburg",
    title: "Weekend Escapes near Hamburg",
    description:
      "Weekend Escapes near Hamburg groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly lakes, nature areas, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bremen", "hamburg", "hanover", "kiel", "lubeck", "wolfsburg", "hamm", "herne", "braunschweig", "osnabruck", "oldenburg", "munster", "paderborn", "bielefeld", "halle"],
    nearbyPlaces: ["elm-lappwald-nature-park-near-wolfsburg", "holstein-switzerland-near-hamburg", "kiel-fjord-near-kiel", "lubeck-near-hamburg", "neuwerk-near-hamburg", "schaalsee-near-hamburg", "steinhuder-meer-near-hanover", "teufelsmoor-near-bremen", "travemunde-near-lubeck", "elm-near-wolfsburg", "harz-near-wolfsburg", "luneburg-heath-nature-park-near-wolfsburg", "sudheide-nature-park-near-wolfsburg", "weser-uplands-near-wolfsburg", "arnsberg-forest-nature-park-near-hamm", "arnsberg-forest-nature-park-near-herne", "asse-near-braunschweig", "brocken-near-braunschweig", "damme-hills-near-osnabruck", "dummer-nature-park-near-oldenburg", "dummer-near-munster", "dummer-near-osnabruck", "egge-hills-near-paderborn", "elm-near-braunschweig", "externsteine-near-bielefeld", "externsteine-near-paderborn", "geiseltalsee-near-halle", "harz-national-park-near-braunschweig", "harz-saxony-anhalt-nature-park-near-halle", "jade-bight-near-oldenburg"],
    featuredPlaces: ["elm-lappwald-nature-park-near-wolfsburg", "holstein-switzerland-near-hamburg", "kiel-fjord-near-kiel", "lubeck-near-hamburg", "neuwerk-near-hamburg", "schaalsee-near-hamburg", "steinhuder-meer-near-hanover", "teufelsmoor-near-bremen"],
    featuredCities: ["hamburg", "bremen", "hanover", "kiel", "lubeck", "wolfsburg"],
    relatedCollections: ["germany-lakes", "baltic-sea-coast", "european-coast", "european-islands", "germany-forests", "germany-weekend-escapes", "denmark-germany-borderlands", "australia-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-helsinki",
    title: "Weekend Escapes near Helsinki",
    description:
      "Weekend Escapes near Helsinki groups 29 nearby places across 7 cities for local-first day and weekend discovery — mainly islands, nature areas, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["helsinki", "lahti", "tampere", "turku", "vantaa", "espoo", "lappeenranta"],
    nearbyPlaces: ["archipelago-national-park-near-turku", "helvetinjarvi-national-park-near-tampere", "isojarvi-national-park-near-tampere", "liesjarvi-national-park-near-helsinki", "nuuksio-national-park-near-helsinki", "paijanne-national-park-near-lahti", "repovesi-national-park-near-lahti", "seitseminen-national-park-near-tampere", "sipoonkorpi-national-park-near-vantaa", "suomenlinna-helsinki", "tammisaari-archipelago-national-park-near-helsinki", "lake-tuusula-near-vantaa", "liesjarvi-national-park-near-vantaa", "torronsuo-national-park-near-lahti", "vantaanjoki-near-vantaa", "vesijarvi-near-lahti", "liesjarvi-national-park-near-espoo", "lohjanjarvi-near-espoo", "nuuksio-national-park-near-espoo", "porkkalanniemi-near-espoo", "sipoonkorpi-national-park-near-espoo", "torronsuo-national-park-near-espoo", "imatra-rapids-near-lappeenranta", "kylaniemi-near-lappeenranta", "lake-kivijarvi-near-lappeenranta", "lake-kuolimo-near-lappeenranta", "lake-saimaa-near-lappeenranta", "repovesi-national-park-near-lappeenranta", "vuoksi-river-near-lappeenranta"],
    featuredPlaces: ["archipelago-national-park-near-turku", "helvetinjarvi-national-park-near-tampere", "isojarvi-national-park-near-tampere", "liesjarvi-national-park-near-helsinki", "nuuksio-national-park-near-helsinki", "paijanne-national-park-near-lahti", "repovesi-national-park-near-lahti", "seitseminen-national-park-near-tampere"],
    featuredCities: ["helsinki", "tampere", "lahti", "turku", "vantaa"],
    relatedCollections: ["finland-national-parks", "estonia-finland-borderlands", "northern-europe-weekend-escapes", "finland-islands", "baltic-sea-coast", "finland-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
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
    relatedCollections: ["australia-coast", "australia-national-parks", "australia-mountains", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-innsbruck",
    title: "Weekend Escapes near Innsbruck",
    description:
      "Weekend Escapes near Innsbruck groups 18 nearby places across 5 cities for local-first day and weekend discovery — mainly lakes, mountains, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["innsbruck", "salzburg", "linz", "wiener-neustadt", "dornbirn"],
    nearbyPlaces: ["achen-lake-near-innsbruck", "karwendel-near-innsbruck", "krimml-waterfalls-near-salzburg", "lake-fuschl-near-salzburg", "lake-wolfgang-near-salzburg", "natterer-see-near-innsbruck", "patscherkofel-near-innsbruck", "untersberg-near-salzburg", "attersee-near-linz", "hollengebirge-near-linz", "kalkalpen-national-park-near-linz", "sengsengebirge-near-linz", "traunsee-near-linz", "traunstein-near-linz", "hoellental-near-wiener-neustadt", "kanisfluh-near-dornbirn", "schneeberg-near-wiener-neustadt", "unterberg-near-wiener-neustadt"],
    featuredPlaces: ["achen-lake-near-innsbruck", "karwendel-near-innsbruck", "krimml-waterfalls-near-salzburg", "lake-fuschl-near-salzburg", "lake-wolfgang-near-salzburg", "natterer-see-near-innsbruck", "patscherkofel-near-innsbruck", "untersberg-near-salzburg"],
    featuredCities: ["innsbruck", "salzburg"],
    relatedCollections: ["austria-germany-borderlands", "austria-lakes", "austria-italy-borderlands", "austria-mountains", "eastern-alps", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-krakow",
    title: "Weekend Escapes near Krakow",
    description:
      "Weekend Escapes near Krakow groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains, nature areas, cultural sites. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["czestochowa", "gliwice", "katowice", "krakow", "zakopane", "bielsko-biala", "chorzow", "dabrowa-gornicza", "sosnowiec", "tychy", "tarnow", "rybnik", "bytom", "ruda-slaska", "zabrze"],
    nearbyPlaces: ["beskids-near-krakow", "eagle-nests-landscape-park-near-katowice", "gorce-national-park-near-zakopane", "ojcow-national-park-near-czestochowa", "pieniny-near-krakow", "pieskowa-skaa-near-czestochowa", "pszczyna-near-gliwice", "tatra-mountains-near-krakow", "tatra-national-park-near-zakopane", "goczakowice-lake-near-gliwice", "krakow-czestochowa-upland-near-czestochowa", "przedborz-landscape-park-near-czestochowa", "rudy-landscape-park-near-gliwice", "stawki-landscape-park-near-czestochowa", "zabie-doy-near-gliwice", "zaecze-landscape-park-near-czestochowa", "babia-gora-national-park-near-bielsko-biala", "babia-gora-national-park-near-chorzow", "bedow-desert-near-dabrowa-gornicza", "bedow-desert-near-sosnowiec", "beskid-mountains-near-tychy", "ciezkowice-roznow-landscape-park-near-tarnow", "czantoria-wielka-near-rybnik", "eagles-nests-landscape-park-near-bytom", "eagles-nests-landscape-park-near-chorzow", "eagles-nests-landscape-park-near-dabrowa-gornicza", "eagles-nests-landscape-park-near-ruda-slaska", "eagles-nests-landscape-park-near-sosnowiec", "eagles-nests-landscape-park-near-zabrze", "ezczok-nature-reserve-near-rybnik"],
    featuredPlaces: ["beskids-near-krakow", "eagle-nests-landscape-park-near-katowice", "gorce-national-park-near-zakopane", "ojcow-national-park-near-czestochowa", "pieniny-near-krakow", "pieskowa-skaa-near-czestochowa", "pszczyna-near-gliwice", "tatra-mountains-near-krakow"],
    featuredCities: ["krakow", "czestochowa", "zakopane", "gliwice", "katowice"],
    relatedCollections: ["poland-slovakia-borderlands", "hungary-poland-borderlands", "poland-mountains", "poland-national-parks", "central-europe-weekend-escapes", "carpathians", "poland-weekend-escapes", "australia-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-lisbon",
    title: "Weekend Escapes near Lisbon",
    description:
      "Weekend Escapes near Lisbon groups 30 nearby places across 9 cities for local-first day and weekend discovery — mainly nature areas, lakes, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["evora", "lisbon", "setubal", "leiria", "almada", "amadora", "sintra", "cascais", "loures"],
    nearbyPlaces: ["alqueva-dam-near-evora", "arrabida-natural-park-near-setubal", "cascais-near-lisbon", "costa-da-caparica-near-lisbon", "sado-estuary-natural-reserve-near-setubal", "serra-de-sao-mamede-near-evora", "sintra-near-lisbon", "tagus-estuary-natural-reserve-near-lisbon", "cape-espichel-near-setubal", "costa-da-caparica-near-setubal", "sintra-cascais-natural-park-near-setubal", "troia-peninsula-near-setubal", "aire-and-candeeiros-ranges-natural-park-near-leiria", "arrabida-natural-park-near-almada", "arrabida-natural-park-near-amadora", "arrabida-natural-park-near-sintra", "berlengas-natural-reserve-near-leiria", "cabo-da-roca-near-almada", "cabo-da-roca-near-amadora", "cabo-da-roca-near-cascais", "cabo-da-roca-near-loures", "cabo-da-roca-near-sintra", "cape-espichel-near-almada", "guincho-beach-near-cascais", "obidos-lagoon-near-leiria", "praia-do-guincho-near-amadora", "sado-estuary-natural-reserve-near-sintra", "sao-pedro-de-moel-near-leiria", "serra-de-montejunto-near-loures", "serra-de-montejunto-protected-landscape-near-leiria"],
    featuredPlaces: ["alqueva-dam-near-evora", "arrabida-natural-park-near-setubal", "cascais-near-lisbon", "costa-da-caparica-near-lisbon", "sado-estuary-natural-reserve-near-setubal", "serra-de-sao-mamede-near-evora", "sintra-near-lisbon", "tagus-estuary-natural-reserve-near-lisbon"],
    featuredCities: ["lisbon", "evora", "setubal"],
    relatedCollections: ["portugal-protected-landscapes", "southern-europe-weekend-escapes", "southern-europe-protected-landscapes", "european-coast", "european-lakes", "european-mountains", "portugal-spain-borderlands", "australia-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-liverpool",
    title: "Weekend Escapes near Liverpool",
    description:
      "Weekend Escapes near Liverpool groups 30 nearby places across 11 cities for local-first day and weekend discovery — mainly nature areas, parks, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bradford", "lancaster", "leeds", "liverpool", "manchester", "sheffield", "preston", "stoke-on-trent", "wolverhampton", "middlesbrough", "northampton"],
    nearbyPlaces: ["arnside-and-silverdale-national-landscape-near-lancaster", "delamere-forest-near-liverpool", "dovestone-reservoir-near-manchester", "formby-near-liverpool", "hilbre-island-near-liverpool", "ilkley-moor-near-bradford", "lyme-park-near-manchester", "peak-district-national-park-near-bradford", "peak-district-near-manchester", "rivington-near-manchester", "thurstaston-common-near-liverpool", "yorkshire-dales-near-lancaster", "yorkshire-dales-near-leeds", "bolton-abbey-near-bradford", "brimham-rocks-near-bradford", "hardcastle-crags-near-bradford", "otley-chevin-near-bradford", "arnside-and-silverdale-near-preston", "cannock-chase-near-stoke-on-trent", "cannock-chase-near-wolverhampton", "forest-of-bowland-near-preston", "lake-district-near-preston", "morecambe-bay-near-preston", "north-pennines-near-middlesbrough", "north-york-moors-near-middlesbrough", "pendle-hill-near-preston", "ribble-and-alt-estuaries-near-preston", "robin-hood-s-bay-near-middlesbrough", "roseberry-topping-near-middlesbrough", "rutland-water-near-northampton"],
    featuredPlaces: ["arnside-and-silverdale-national-landscape-near-lancaster", "delamere-forest-near-liverpool", "dovestone-reservoir-near-manchester", "formby-near-liverpool", "hilbre-island-near-liverpool", "ilkley-moor-near-bradford", "lyme-park-near-manchester", "peak-district-national-park-near-bradford"],
    featuredCities: ["liverpool", "manchester", "bradford", "lancaster", "leeds", "sheffield"],
    relatedCollections: ["united-kingdom-national-parks", "united-kingdom-protected-landscapes", "western-europe-weekend-escapes", "european-islands", "united-kingdom-coast", "united-kingdom-forests", "united-kingdom-lakes", "united-kingdom-mountains"],
  },
  {
    slug: "weekend-escapes-near-ljubljana",
    title: "Weekend Escapes near Ljubljana",
    description:
      "Weekend Escapes near Ljubljana groups 17 nearby places across 5 cities for local-first day and weekend discovery — mainly mountains, lakes, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["celje", "kranj", "ljubljana", "maribor", "koper"],
    nearbyPlaces: ["kamniksavinja-alps-near-celje", "lake-bled-near-kranj", "lake-bohinj-near-ljubljana", "pohorje-near-celje", "triglav-national-park-near-kranj", "vipava-valley-near-ljubljana", "donacka-gora-near-celje", "savinja-near-celje", "pohorje-near-maribor", "karst-plateau-near-koper", "lake-cerknica-near-koper", "nanos-near-koper", "postojna-cave-near-koper", "skocjan-caves-near-koper", "slavnik-near-koper", "triglav-national-park-near-koper", "ucka-near-koper"],
    featuredPlaces: ["kamniksavinja-alps-near-celje", "lake-bled-near-kranj", "lake-bohinj-near-ljubljana", "pohorje-near-celje", "triglav-national-park-near-kranj", "vipava-valley-near-ljubljana"],
    featuredCities: ["celje", "kranj", "ljubljana"],
    relatedCollections: ["austria-slovenia-borderlands", "italy-slovenia-borderlands", "croatia-slovenia-borderlands", "european-mountains", "central-europe-weekend-escapes", "central-europe-mountains", "eastern-alps", "australia-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-london",
    title: "Weekend Escapes near London",
    description:
      "Weekend Escapes near London groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly nature areas, parks, cultural sites. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["brighton", "cambridge", "london", "oxford", "portsmouth", "southampton", "milton-keynes", "luton", "bournemouth", "reading", "stoke-on-trent", "wolverhampton", "northampton", "southend-on-sea"],
    nearbyPlaces: ["brighton-near-london", "cotswolds-near-oxford", "hayling-island-near-portsmouth", "hyde-park-london", "greenwich-london", "new-forest-national-park-near-southampton", "richmond-park-london", "kew-gardens-london", "south-downs-national-park-near-brighton", "wicken-fen-near-cambridge", "windsor-near-london", "butser-hill-near-portsmouth", "chichester-harbour-near-portsmouth", "kingley-vale-near-portsmouth", "south-downs-near-portsmouth", "west-wittering-near-portsmouth", "ashridge-estate-near-milton-keynes", "ashridge-near-luton", "brownsea-island-near-bournemouth", "burnham-beeches-near-reading", "cannock-chase-near-stoke-on-trent", "cannock-chase-near-wolverhampton", "chiltern-hills-near-northampton", "chiltern-hills-near-reading", "dinton-pastures-country-park-near-reading", "dunstable-and-whipsnade-downs-near-milton-keynes", "dunstable-downs-near-luton", "epping-forest-near-southend-on-sea", "fineshade-wood-near-northampton", "goring-gap-near-reading"],
    featuredPlaces: ["brighton-near-london", "cotswolds-near-oxford", "hayling-island-near-portsmouth", "hyde-park-london", "greenwich-london", "new-forest-national-park-near-southampton", "richmond-park-london", "kew-gardens-london"],
    featuredCities: ["london", "brighton", "cambridge", "oxford", "portsmouth", "southampton"],
    relatedCollections: ["united-kingdom-protected-landscapes", "united-kingdom-national-parks", "european-islands", "united-kingdom-forests", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-los-angeles",
    title: "Weekend Escapes near Los Angeles",
    description:
      "Weekend Escapes near Los Angeles groups 27 nearby places across 6 cities for local-first day and weekend discovery — mainly mountains, nature areas, islands. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["long-beach", "los-angeles", "santa-barbara", "anaheim", "riverside", "bakersfield"],
    nearbyPlaces: ["angeles-national-forest-near-los-angeles", "bolsa-chica-ecological-reserve-near-long-beach", "channel-islands-national-park-near-santa-barbara", "crystal-cove-state-park-near-long-beach", "san-gabriel-mountains-national-monument-near-los-angeles", "santa-monica-mountains-recreation-area-near-los-angeles", "chino-hills-state-park-near-long-beach", "laguna-coast-wilderness-park-near-long-beach", "santa-ana-mountains-near-long-beach", "santa-monica-mountains-national-recreation-area-near-long-beach", "bolsa-chica-ecological-reserve-near-anaheim", "chino-hills-state-park-near-anaheim", "cleveland-national-forest-near-anaheim", "cleveland-national-forest-near-riverside", "crystal-cove-state-park-near-anaheim", "irvine-regional-park-near-anaheim", "lake-perris-near-riverside", "mount-san-jacinto-state-park-near-riverside", "san-bernardino-national-forest-near-riverside", "san-emigdio-mountains-near-bakersfield", "santa-ana-mountains-near-anaheim", "santa-ana-mountains-near-riverside", "tehachapi-mountains-near-bakersfield", "carrizo-plain-near-bakersfield", "joshua-tree-national-park-near-riverside", "kern-river-canyon-near-bakersfield", "wind-wolves-preserve-near-bakersfield"],
    featuredPlaces: ["angeles-national-forest-near-los-angeles", "bolsa-chica-ecological-reserve-near-long-beach", "channel-islands-national-park-near-santa-barbara", "crystal-cove-state-park-near-long-beach", "san-gabriel-mountains-national-monument-near-los-angeles", "santa-monica-mountains-recreation-area-near-los-angeles"],
    featuredCities: ["los-angeles", "long-beach", "santa-barbara"],
    relatedCollections: ["united-states-mountains", "north-america-weekend-escapes", "california-weekend-escapes", "north-america-protected-landscapes", "united-states-national-parks", "united-states-protected-landscapes", "united-states-coast", "australia-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-madrid",
    title: "Weekend Escapes near Madrid",
    description:
      "Weekend Escapes near Madrid groups 30 nearby places across 9 cities for local-first day and weekend discovery — mainly mountains, historic towns, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["madrid", "toledo", "valladolid", "alcala-de-henares", "alcorcon", "fuenlabrada", "leganes", "getafe", "mostoles"],
    nearbyPlaces: ["cabaneros-national-park-near-toledo", "canal-de-castilla-near-valladolid", "guadarrama-national-park-near-madrid", "manzanares-el-real-near-madrid", "el-escorial-near-madrid", "montes-de-toledo-near-toledo", "segovia-near-madrid", "toledo-near-madrid", "cuenca-alta-del-manzanares-regional-park-near-alcala-de-henares", "cuenca-alta-del-manzanares-regional-park-near-alcorcon", "cuenca-alta-del-manzanares-regional-park-near-fuenlabrada", "cuenca-alta-del-manzanares-regional-park-near-leganes", "el-atazar-reservoir-near-alcala-de-henares", "guadarrama-mountains-near-getafe", "guadarrama-national-park-near-alcala-de-henares", "guadarrama-national-park-near-alcorcon", "guadarrama-national-park-near-fuenlabrada", "guadarrama-national-park-near-leganes", "henares-river-near-alcala-de-henares", "la-pedriza-near-fuenlabrada", "la-pedriza-near-getafe", "la-pedriza-near-mostoles", "monte-de-el-pardo-near-alcorcon", "monte-de-el-pardo-near-leganes", "penalara-near-alcorcon", "penalara-near-getafe", "penalara-near-leganes", "penalara-near-mostoles", "san-juan-reservoir-near-alcorcon", "san-juan-reservoir-near-fuenlabrada"],
    featuredPlaces: ["cabaneros-national-park-near-toledo", "canal-de-castilla-near-valladolid", "guadarrama-national-park-near-madrid", "manzanares-el-real-near-madrid", "el-escorial-near-madrid", "montes-de-toledo-near-toledo", "segovia-near-madrid", "toledo-near-madrid"],
    featuredCities: ["madrid", "toledo", "valladolid"],
    relatedCollections: ["spain-mountains", "spain-national-parks", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-malaga",
    title: "Weekend Escapes near Malaga",
    description:
      "Weekend Escapes near Malaga groups 30 nearby places across 7 cities for local-first day and weekend discovery — mainly parks, nature areas, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["almeria", "cadiz", "granada", "malaga", "jerez-de-la-frontera", "cordoba-spain", "albacete"],
    nearbyPlaces: ["cabo-de-gata-nijar-natural-park-near-almeria", "donana-national-park-near-cadiz", "torcal-de-antequera-near-malaga", "fuente-de-piedra-lagoon-near-malaga", "la-brena-y-marismas-del-barbate-natural-park-near-cadiz", "montes-de-malaga-natural-park-near-malaga", "sierra-nevada-national-park-near-granada", "sierra-de-baza-natural-park-near-granada", "sierra-de-las-nieves-national-park-near-malaga", "tabernas-desert-near-almeria", "bahia-de-cadiz-natural-park-near-cadiz", "sierra-de-baza-natural-park-near-almeria", "sierra-de-cadiz-near-cadiz", "sierra-de-las-nieves-national-park-near-cadiz", "sierra-de-maria-los-velez-natural-park-near-almeria", "sierra-nevada-national-park-near-almeria", "sorbas-karst-near-almeria", "tarifa-coast-near-cadiz", "bahia-de-cadiz-natural-park-near-jerez-de-la-frontera", "cape-trafalgar-near-jerez-de-la-frontera", "donana-national-park-near-jerez-de-la-frontera", "el-estrecho-natural-park-near-jerez-de-la-frontera", "guadalquivir-river-near-cordoba-spain", "iznajar-reservoir-near-cordoba-spain", "la-brena-y-marismas-del-barbate-natural-park-near-jerez-de-la-frontera", "pico-almenara-near-albacete", "san-rafael-de-navallana-reservoir-near-cordoba-spain", "sierra-de-alcaraz-near-albacete", "sierra-de-grazalema-natural-park-near-jerez-de-la-frontera", "sierra-de-hornachuelos-natural-park-near-cordoba-spain"],
    featuredPlaces: ["cabo-de-gata-nijar-natural-park-near-almeria", "donana-national-park-near-cadiz", "torcal-de-antequera-near-malaga", "fuente-de-piedra-lagoon-near-malaga", "la-brena-y-marismas-del-barbate-natural-park-near-cadiz", "montes-de-malaga-natural-park-near-malaga", "sierra-nevada-national-park-near-granada", "sierra-de-baza-natural-park-near-granada"],
    featuredCities: ["malaga", "almeria", "cadiz", "granada"],
    relatedCollections: ["spain-protected-landscapes", "southern-europe-weekend-escapes", "spain-national-parks", "spain-mountains", "southern-europe-protected-landscapes", "portugal-spain-borderlands", "spain-weekend-escapes", "european-coast"],
  },
  {
    slug: "weekend-escapes-near-malm",
    title: "Weekend Escapes near Malmö",
    description:
      "Weekend Escapes near Malmö groups 18 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas, beaches, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["helsingborg", "malmo", "halmstad", "vaxjo", "karlskrona"],
    nearbyPlaces: ["dalby-soderskog-national-park-near-malmo", "falsterbo-near-malmo", "kullaberg-near-malmo", "soderasen-national-park-near-helsingborg", "oresund-near-helsingborg", "hallands-vadero-near-halmstad", "hallandsasen-near-halmstad", "lake-bolmen-near-vaxjo", "nissan-river-near-halmstad", "soderasen-national-park-near-halmstad", "soderasen-national-park-near-malmo", "tylosand-near-halmstad", "hano-bay-near-karlskrona", "hano-near-karlskrona", "ivo-lake-near-karlskrona", "listerlandet-near-karlskrona", "soderasen-national-park-near-karlskrona", "stenshuvud-national-park-near-karlskrona"],
    featuredPlaces: ["dalby-soderskog-national-park-near-malmo", "falsterbo-near-malmo", "kullaberg-near-malmo", "soderasen-national-park-near-helsingborg", "oresund-near-helsingborg"],
    featuredCities: ["malmo", "helsingborg"],
    relatedCollections: ["denmark-sweden-borderlands", "sweden-national-parks", "european-coast", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-marseille",
    title: "Weekend Escapes near Marseille",
    description:
      "Weekend Escapes near Marseille groups 30 nearby places across 9 cities for local-first day and weekend discovery — mainly mountains, nature areas, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["aix-en-provence", "marseille", "montpellier", "nice", "nimes", "toulon", "cannes", "antibes", "valence"],
    nearbyPlaces: ["alpilles-near-marseille", "calanques-near-marseille", "cevennes-national-park-near-montpellier", "lac-de-saint-cassien-near-nice", "lake-of-sainte-croix-near-nice", "massif-de-lesterel-near-nice", "mercantour-national-park-near-nice", "montagne-sainte-victoire-near-aix-en-provence", "pont-du-gard-near-nimes", "sainte-baume-near-marseille", "calanques-national-park-near-toulon", "castellane-prealps-near-cannes", "esterel-massif-near-antibes", "esterel-massif-near-cannes", "giens-peninsula-near-toulon", "gorges-de-daluis-near-antibes", "iles-d-hyeres-near-toulon", "lac-de-saint-cassien-near-cannes", "lerins-islands-near-antibes", "lerins-islands-near-cannes", "loup-river-and-gorges-du-loup-near-cannes", "massif-des-maures-near-antibes", "mercantour-national-park-near-antibes", "mercantour-national-park-near-cannes", "mont-faron-near-toulon", "mont-gerbier-de-jonc-near-valence", "mont-mezenc-near-valence", "porquerolles-near-toulon", "port-cros-near-toulon", "verdon-gorge-near-antibes"],
    featuredPlaces: ["alpilles-near-marseille", "calanques-near-marseille", "cevennes-national-park-near-montpellier", "lac-de-saint-cassien-near-nice", "lake-of-sainte-croix-near-nice", "massif-de-lesterel-near-nice", "mercantour-national-park-near-nice", "montagne-sainte-victoire-near-aix-en-provence"],
    featuredCities: ["nice", "marseille", "aix-en-provence", "montpellier", "nimes"],
    relatedCollections: ["france-mountains", "france-national-parks", "france-italy-borderlands", "france-lakes", "france-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes"],
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
    relatedCollections: ["australia-coast", "australia-islands", "australia-weekend-escapes", "australia-mountains", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-milan",
    title: "Weekend Escapes near Milan",
    description:
      "Weekend Escapes near Milan groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly mountains, lakes, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bergamo", "como", "genoa", "milan", "parma", "turin", "brescia", "cremona", "pavia", "modena", "la-spezia", "pistoia", "varese", "asti", "vicenza"],
    nearbyPlaces: ["bergamo-near-milan", "castello-di-torrechiara-near-parma", "gran-paradiso-national-park-near-turin", "la-mandria-regional-park-near-turin", "lake-como-near-como", "lake-iseo-near-bergamo", "lake-maggiore-near-milan", "maritime-alps-natural-park-near-turin", "monte-generoso-near-como", "orsiera-rocciavre-natural-park-near-turin", "portofino-regional-park-near-genoa", "adamello-brenta-natural-park-near-brescia", "adda-river-near-cremona", "antola-natural-regional-park-near-pavia", "appennino-tosco-emiliano-national-park-near-modena", "apuan-alps-near-la-spezia", "apuan-alps-regional-park-near-pistoia", "aveto-natural-regional-park-near-la-spezia", "campo-dei-fiori-regional-park-near-varese", "capanne-di-marcarolo-natural-park-near-asti", "cima-palon-pasubio-near-vicenza", "cinque-terre-national-park-near-la-spezia", "lake-annone-near-monza", "lake-bilancino-near-prato", "lake-como-near-cremona", "lake-como-near-monza", "lake-garda-near-brescia", "lake-garda-near-cremona", "lake-garda-near-vicenza", "lake-iseo-near-brescia"],
    featuredPlaces: ["bergamo-near-milan", "castello-di-torrechiara-near-parma", "gran-paradiso-national-park-near-turin", "la-mandria-regional-park-near-turin", "lake-como-near-como", "lake-iseo-near-bergamo", "lake-maggiore-near-milan", "maritime-alps-natural-park-near-turin"],
    featuredCities: ["turin", "como", "milan", "bergamo", "genoa", "parma"],
    relatedCollections: ["italy-mountains", "france-italy-borderlands", "italy-lakes", "italy-protected-landscapes", "italy-national-parks", "italy-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-montreal",
    title: "Weekend Escapes near Montreal",
    description:
      "Weekend Escapes near Montreal groups 30 nearby places across 11 cities for local-first day and weekend discovery — mainly nature areas, parks, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["gatineau", "laval", "montreal", "ottawa", "sherbrooke", "belleville", "kingston", "trois-rivieres", "longueuil", "cornwall", "peterborough"],
    nearbyPlaces: ["foy-provincial-park-near-ottawa", "gatineau-park-near-ottawa", "lake-memphremagog-near-sherbrooke", "larose-forest-near-ottawa", "mer-bleue-bog-near-ottawa", "mont-orford-national-park-near-sherbrooke", "mont-tremblant-national-park-near-montreal", "oka-national-park-near-laval", "ottawa-river-near-gatineau", "plaisance-national-park-near-gatineau", "iles-de-boucherville-national-park-near-laval", "mont-rigaud-near-laval", "mont-rougemont-near-laval", "mont-saint-bruno-national-park-near-laval", "bon-echo-provincial-park-near-belleville", "bon-echo-provincial-park-near-kingston", "charleston-lake-provincial-park-near-kingston", "iles-de-boucherville-national-park-near-montreal", "lake-saint-pierre-near-trois-rivieres", "mastigouche-wildlife-reserve-near-trois-rivieres", "oka-national-park-near-montreal", "saint-maurice-river-near-trois-rivieres", "yamaska-national-park-near-longueuil", "azure-mountain-near-cornwall", "batiscan-river-near-trois-rivieres", "ferris-provincial-park-near-belleville", "ferris-provincial-park-near-peterborough", "frontenac-provincial-park-near-belleville", "frontenac-provincial-park-near-kingston", "gatineau-park-near-cornwall"],
    featuredPlaces: ["foy-provincial-park-near-ottawa", "gatineau-park-near-ottawa", "lake-memphremagog-near-sherbrooke", "larose-forest-near-ottawa", "mer-bleue-bog-near-ottawa", "mont-orford-national-park-near-sherbrooke", "mont-tremblant-national-park-near-montreal", "oka-national-park-near-laval"],
    featuredCities: ["ottawa", "gatineau", "laval", "sherbrooke", "montreal"],
    relatedCollections: ["canada-national-parks", "canada-protected-landscapes", "north-america-weekend-escapes", "canada-islands", "canada-mountains", "canada-united-states-borderlands", "canada-weekend-escapes", "australia-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-munich",
    title: "Weekend Escapes near Munich",
    description:
      "Weekend Escapes near Munich groups 30 nearby places across 10 cities for local-first day and weekend discovery — mainly lakes, nature areas, mountains. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["augsburg", "garmisch-partenkirchen", "munich", "nuremberg", "passau", "regensburg", "ulm", "ingolstadt", "furth", "heilbronn"],
    nearbyPlaces: ["ammersee-near-augsburg", "augsburg-western-woods-nature-park-near-augsburg", "bavarian-forest-near-passau", "bavarian-forest-national-park-near-passau", "eibsee-near-garmisch-partenkirchen", "englischer-garten-munich", "franconian-jura-near-nuremberg", "franconian-switzerland-near-nuremberg", "grosser-arbersee-near-regensburg", "hesselberg-near-nuremberg", "lake-starnberg-near-munich", "pegnitz-valley-near-nuremberg", "tegernsee-near-munich", "zugspitze-near-garmisch-partenkirchen", "adelegg-near-ulm", "altmuhl-valley-nature-park-near-ingolstadt", "blautopf-near-ulm", "bussen-near-ulm", "danube-gorge-weltenburg-near-ingolstadt", "federsee-near-ulm", "franconian-jura-near-furth", "franconian-jura-near-ingolstadt", "franconian-switzerland-veldenstein-forest-nature-park-near-furth", "groer-brombachsee-near-furth", "groer-brombachsee-near-ingolstadt", "haberge-nature-park-near-furth", "hesselberg-near-furth", "lowenstein-hills-near-heilbronn", "nordlinger-ries-near-ingolstadt", "old-bavarian-donaumoos-near-ingolstadt"],
    featuredPlaces: ["ammersee-near-augsburg", "augsburg-western-woods-nature-park-near-augsburg", "bavarian-forest-near-passau", "bavarian-forest-national-park-near-passau", "eibsee-near-garmisch-partenkirchen", "englischer-garten-munich", "franconian-jura-near-nuremberg", "franconian-switzerland-near-nuremberg"],
    featuredCities: ["nuremberg", "munich", "augsburg", "garmisch-partenkirchen", "passau", "regensburg"],
    relatedCollections: ["austria-germany-borderlands", "germany-lakes", "germany-mountains", "czechia-germany-borderlands", "germany-forests", "germany-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-naples",
    title: "Weekend Escapes near Naples",
    description:
      "Weekend Escapes near Naples groups 30 nearby places across 10 cities for local-first day and weekend discovery — mainly waterfronts, mountains, islands. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["naples", "salerno", "latina", "giugliano-in-campania", "foggia", "pescara", "caserta", "cosenza", "brindisi", "matera"],
    nearbyPlaces: ["amalfi-coast-near-salerno", "ischia-near-naples", "matese-regional-park-near-naples", "sorrentine-peninsula-near-naples", "vesuvius-national-park-near-naples", "cape-palinuro-near-salerno", "monti-lattari-near-salerno", "vesuvius-national-park-near-salerno", "aurunci-mountains-near-latina", "circeo-national-park-near-latina", "ischia-near-giugliano-in-campania", "lake-avernus-near-giugliano-in-campania", "lake-lesina-near-foggia", "lake-scanno-near-pescara", "matese-near-caserta", "monte-cornacchia-near-foggia", "monte-massico-near-caserta", "mount-circeo-near-latina", "mount-vesuvius-near-caserta", "phlegraean-fields-near-caserta", "phlegraean-fields-near-giugliano-in-campania", "pollino-national-park-near-cosenza", "procida-near-giugliano-in-campania", "roccamonfina-near-caserta", "roccamonfina-near-giugliano-in-campania", "sirente-velino-regional-park-near-pescara", "taburno-camposauro-near-caserta", "vesuvius-national-park-near-giugliano-in-campania", "alta-murgia-national-park-near-brindisi", "alta-murgia-national-park-near-matera"],
    featuredPlaces: ["amalfi-coast-near-salerno", "ischia-near-naples", "matese-regional-park-near-naples", "sorrentine-peninsula-near-naples", "vesuvius-national-park-near-naples"],
    featuredCities: ["naples", "salerno"],
    relatedCollections: ["italy-coast", "italy-mountains", "european-islands", "italy-national-parks", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-new-york",
    title: "Weekend Escapes near New York",
    description:
      "Weekend Escapes near New York groups 30 nearby places across 8 cities for local-first day and weekend discovery — mainly parks, nature areas, beaches. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["hartford", "new-haven", "new-york", "newark", "philadelphia", "allentown", "worcester", "bridgeport"],
    nearbyPlaces: ["great-swamp-national-wildlife-refuge-near-newark", "hammonasset-beach-state-park-near-new-haven", "harriman-state-park-near-new-york", "hudson-valley-near-new-york", "jamaica-bay-wildlife-refuge-near-new-york", "jones-beach-state-park-near-new-york", "penwood-state-park-near-hartford", "south-mountain-reservation-near-newark", "talcott-mountain-state-park-near-hartford", "valley-forge-national-historical-park-near-philadelphia", "chatfield-hollow-state-park-near-new-haven", "devil-s-hopyard-state-park-near-new-haven", "dinosaur-state-park-and-arboretum-near-hartford", "gay-city-state-park-near-hartford", "hurd-state-park-near-hartford", "ramapo-mountain-state-forest-near-newark", "sandy-hook-near-newark", "silver-sands-state-park-near-new-haven", "wadsworth-falls-state-park-near-hartford", "wadsworth-falls-state-park-near-new-haven", "watchung-reservation-near-newark", "beltzville-state-park-near-allentown", "blackstone-river-and-canal-heritage-state-park-near-worcester", "candlewood-lake-near-bridgeport", "delaware-water-gap-national-recreation-area-near-allentown", "douglas-state-forest-near-worcester", "hawk-mountain-sanctuary-near-allentown", "hickory-run-state-park-near-allentown", "kettletown-state-park-near-bridgeport", "lake-lillinonah-near-bridgeport"],
    featuredPlaces: ["great-swamp-national-wildlife-refuge-near-newark", "hammonasset-beach-state-park-near-new-haven", "harriman-state-park-near-new-york", "hudson-valley-near-new-york", "jamaica-bay-wildlife-refuge-near-new-york", "jones-beach-state-park-near-new-york", "penwood-state-park-near-hartford", "south-mountain-reservation-near-newark"],
    featuredCities: ["new-york", "hartford", "newark", "new-haven", "philadelphia"],
    relatedCollections: ["north-america-weekend-escapes", "united-states-protected-landscapes", "united-states-coast", "north-america-protected-landscapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-norwich",
    title: "Weekend Escapes near Norwich",
    description:
      "Weekend Escapes near Norwich groups 30 nearby places across 11 cities for local-first day and weekend discovery — mainly nature areas, lakes, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["lincoln", "norwich", "nottingham", "preston", "stoke-on-trent", "wolverhampton", "milton-keynes", "luton", "southend-on-sea", "northampton", "middlesbrough"],
    nearbyPlaces: ["carsington-water-near-nottingham", "hartsholme-country-park-near-lincoln", "norfolk-coast-near-norwich", "peak-district-near-nottingham", "thetford-forest-near-norwich", "arnside-and-silverdale-near-preston", "cannock-chase-near-stoke-on-trent", "cannock-chase-near-wolverhampton", "dunstable-and-whipsnade-downs-near-milton-keynes", "dunstable-downs-near-luton", "epping-forest-near-southend-on-sea", "fineshade-wood-near-northampton", "forest-of-bowland-near-preston", "grafham-water-near-northampton", "hadleigh-country-park-near-southend-on-sea", "hanningfield-reservoir-near-southend-on-sea", "ivinghoe-beacon-near-luton", "morecambe-bay-near-preston", "pendle-hill-near-preston", "pitsford-water-near-northampton", "ribble-and-alt-estuaries-near-preston", "rutland-water-near-northampton", "salcey-forest-near-milton-keynes", "salcey-forest-near-northampton", "stockgrove-country-park-near-luton", "stockgrove-country-park-near-milton-keynes", "sutton-bank-near-middlesbrough", "two-tree-island-near-southend-on-sea", "wallasea-island-near-southend-on-sea", "wat-tyler-country-park-near-southend-on-sea"],
    featuredPlaces: ["carsington-water-near-nottingham", "hartsholme-country-park-near-lincoln", "norfolk-coast-near-norwich", "peak-district-near-nottingham", "thetford-forest-near-norwich"],
    featuredCities: ["norwich", "nottingham", "lincoln"],
    relatedCollections: ["united-kingdom-coast", "united-kingdom-forests", "united-kingdom-lakes", "united-kingdom-protected-landscapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-paris",
    title: "Weekend Escapes near Paris",
    description:
      "Weekend Escapes near Paris groups 30 nearby places across 9 cities for local-first day and weekend discovery — mainly cultural sites, nature areas, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["orleans", "paris", "reims", "rouen", "beauvais", "poitiers", "bourges", "saint-quentin", "troyes"],
    nearbyPlaces: ["brenne-regional-natural-park-near-orleans", "champagne-hillsides-houses-and-cellars-near-reims", "chantilly-near-paris", "fontainebleau-near-paris", "forest-of-orleans-near-orleans", "foret-de-rambouillet-near-paris", "haute-vallee-de-chevreuse-regional-natural-park-near-paris", "versailles-near-paris", "etretat-near-rouen", "loing-near-orleans", "alabaster-coast-near-beauvais", "anglin-near-poitiers", "brenne-regional-natural-park-near-bourges", "brenne-regional-natural-park-near-poitiers", "chantilly-forest-near-beauvais", "ermenonville-forest-near-beauvais", "ermenonville-forest-near-saint-quentin", "eu-forest-near-beauvais", "forest-of-compiegne-near-beauvais", "forest-of-compiegne-near-saint-quentin", "forest-of-halatte-near-saint-quentin", "forest-of-orleans-near-bourges", "forest-of-retz-near-saint-quentin", "foret-d-orient-national-nature-reserve-near-troyes", "gartempe-near-poitiers", "lakes-amance-and-du-temple-near-troyes", "montagne-de-reims-regional-natural-park-near-troyes", "orient-forest-regional-natural-park-near-troyes", "sologne-near-bourges", "vienne-near-poitiers"],
    featuredPlaces: ["brenne-regional-natural-park-near-orleans", "champagne-hillsides-houses-and-cellars-near-reims", "chantilly-near-paris", "fontainebleau-near-paris", "forest-of-orleans-near-orleans", "foret-de-rambouillet-near-paris", "haute-vallee-de-chevreuse-regional-natural-park-near-paris", "versailles-near-paris"],
    featuredCities: ["paris", "orleans", "reims", "rouen"],
    relatedCollections: ["european-forests", "western-europe-weekend-escapes", "france-protected-landscapes", "western-europe-protected-landscapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
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
    relatedCollections: ["australia-national-parks", "australia-islands", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes", "finland-weekend-escapes"],
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
    relatedCollections: ["united-states-coast", "united-states-mountains", "united-states-river-valleys", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-porto",
    title: "Weekend Escapes near Porto",
    description:
      "Weekend Escapes near Porto groups 30 nearby places across 10 cities for local-first day and weekend discovery — mainly waterfronts, nature areas, weekend places. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["aveiro", "braga", "guimaraes", "porto", "viana-do-castelo", "matosinhos", "leiria", "vila-real", "guarda", "sintra"],
    nearbyPlaces: ["douro-valley-near-porto", "alvao-natural-park-near-porto", "costa-nova-do-prado-near-aveiro", "cavado-river-near-guimaraes", "douro-international-natural-park-near-porto", "lima-river-near-viana-do-castelo", "peneda-geres-national-park-near-braga", "alvao-natural-park-near-matosinhos", "northern-littoral-natural-park-near-matosinhos", "paiva-river-near-matosinhos", "peneda-geres-national-park-near-matosinhos", "peneda-geres-national-park-near-porto", "peneda-geres-national-park-near-viana-do-castelo", "ria-de-aveiro-near-matosinhos", "sao-pedro-de-moel-near-leiria", "serra-do-marao-near-matosinhos", "alto-douro-wine-region-near-vila-real", "alvao-natural-park-near-vila-real", "coa-river-near-guarda", "covao-dos-conchos-near-guarda", "douro-international-natural-park-near-guarda", "douro-international-natural-park-near-vila-real", "faia-brava-reserve-near-guarda", "montesinho-natural-park-near-vila-real", "peneda-geres-national-park-near-vila-real", "serra-da-estrela-natural-park-near-guarda", "serra-da-estrela-near-guarda", "serra-da-malcata-nature-reserve-near-guarda", "serra-do-marao-near-vila-real", "tagus-estuary-natural-reserve-near-sintra"],
    featuredPlaces: ["douro-valley-near-porto", "alvao-natural-park-near-porto", "costa-nova-do-prado-near-aveiro", "cavado-river-near-guimaraes", "douro-international-natural-park-near-porto", "lima-river-near-viana-do-castelo", "peneda-geres-national-park-near-braga"],
    featuredCities: ["porto", "aveiro", "braga", "guimaraes", "viana-do-castelo"],
    relatedCollections: ["portugal-spain-borderlands", "portugal-protected-landscapes", "european-mountains", "portugal-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-pozna",
    title: "Weekend Escapes near Poznań",
    description:
      "Weekend Escapes near Poznań groups 30 nearby places across 12 cities for local-first day and weekend discovery — mainly nature areas, mountains, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bydgoszcz", "poznan", "torun", "wroclaw", "kalisz", "legnica", "walbrzych", "wloclawek", "koszalin", "elblag", "slupsk", "plock"],
    nearbyPlaces: ["barycz-valley-landscape-park-near-wroclaw", "brodnica-landscape-park-near-torun", "giant-mountains-national-park-near-wroclaw", "powidz-landscape-park-near-poznan", "promno-landscape-park-near-poznan", "rogalin-landscape-park-near-poznan", "stolowe-mountains-national-park-near-wroclaw", "tuchola-forest-near-bydgoszcz", "tuchola-forest-national-park-near-bydgoszcz", "wielkopolska-national-park-near-poznan", "sleza-landscape-park-near-wroclaw", "barycz-valley-landscape-park-near-kalisz", "bobr-valley-landscape-park-near-legnica", "bobr-valley-landscape-park-near-walbrzych", "brodnica-landscape-park-near-wloclawek", "drawa-national-park-near-koszalin", "drawsko-landscape-park-near-koszalin", "druzno-lake-druzno-near-elblag", "ebsko-lake-near-slupsk", "giant-mountains-national-park-near-legnica", "giant-mountains-near-walbrzych", "gorzno-lidzbark-landscape-park-near-plock", "gorzno-lidzbark-landscape-park-near-wloclawek", "gostynin-and-wocawek-landscape-park-near-plock", "gostynin-wocawek-landscape-park-near-wloclawek", "iawa-lakeland-landscape-park-near-elblag", "jeziorak-near-elblag", "kaczawskie-mountains-near-legnica", "karkonosze-national-park-near-walbrzych", "ksiazanski-landscape-park-near-walbrzych"],
    featuredPlaces: ["barycz-valley-landscape-park-near-wroclaw", "brodnica-landscape-park-near-torun", "giant-mountains-national-park-near-wroclaw", "powidz-landscape-park-near-poznan", "promno-landscape-park-near-poznan", "rogalin-landscape-park-near-poznan", "stolowe-mountains-national-park-near-wroclaw", "tuchola-forest-near-bydgoszcz"],
    featuredCities: ["poznan", "wroclaw", "bydgoszcz", "torun"],
    relatedCollections: ["poland-national-parks", "czechia-poland-borderlands", "poland-mountains", "germany-poland-borderlands", "poland-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-prague",
    title: "Weekend Escapes near Prague",
    description:
      "Weekend Escapes near Prague groups 30 nearby places across 7 cities for local-first day and weekend discovery — mainly nature areas, mountains, cultural sites. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["hradec-kralove", "karlovy-vary", "liberec", "prague", "pardubice", "plzen", "usti-nad-labem"],
    nearbyPlaces: ["adrspach-teplice-rocks-near-hradec-kralove", "bohemian-switzerland-near-prague", "jested-near-liberec", "karlstejn-near-prague", "koneprusy-caves-near-prague", "ore-mountains-near-karlovy-vary", "orlicke-mountains-near-hradec-kralove", "slavkov-forest-near-karlovy-vary", "broumovsko-protected-landscape-area-near-hradec-kralove", "kuneticka-hora-near-hradec-kralove", "orlice-near-hradec-kralove", "prachov-rocks-near-hradec-kralove", "adrspach-teplice-rocks-near-pardubice", "berounka-near-plzen", "bohemian-switzerland-near-usti-nad-labem", "brdy-near-plzen", "cesky-les-protected-landscape-area-near-plzen", "iron-mountains-near-pardubice", "krivoklatsko-protected-landscape-area-near-plzen", "krkonose-national-park-near-pardubice", "kuneticka-hora-near-pardubice", "lusatian-mountains-near-usti-nad-labem", "milesovka-near-usti-nad-labem", "ore-mountains-near-usti-nad-labem", "saxon-switzerland-national-park-near-usti-nad-labem", "sec-reservoir-near-pardubice", "slavkov-forest-near-plzen", "sumava-national-park-near-plzen", "uhost-near-usti-nad-labem", "zdar-hills-near-pardubice"],
    featuredPlaces: ["adrspach-teplice-rocks-near-hradec-kralove", "bohemian-switzerland-near-prague", "jested-near-liberec", "karlstejn-near-prague", "koneprusy-caves-near-prague", "ore-mountains-near-karlovy-vary", "orlicke-mountains-near-hradec-kralove", "slavkov-forest-near-karlovy-vary"],
    featuredCities: ["prague", "hradec-kralove", "karlovy-vary", "liberec"],
    relatedCollections: ["czechia-germany-borderlands", "czechia-poland-borderlands", "czechia-mountains", "central-europe-weekend-escapes", "central-europe-mountains", "european-forests", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-queenstown",
    title: "Weekend Escapes near Queenstown",
    description:
      "Weekend Escapes near Queenstown groups 9 nearby places across 3 cities for local-first day and weekend discovery — mainly lakes, parks, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["dunedin", "invercargill", "queenstown"],
    nearbyPlaces: ["fiordland-national-park-near-invercargill", "lake-hayes-near-queenstown", "moke-lake-near-queenstown", "otago-peninsula-near-dunedin", "the-catlins-near-invercargill", "the-remarkables-near-queenstown", "bluff-hill-motupohue-near-invercargill", "oreti-beach-near-invercargill", "riverton-aparima-near-invercargill"],
    featuredPlaces: ["fiordland-national-park-near-invercargill", "lake-hayes-near-queenstown", "moke-lake-near-queenstown", "otago-peninsula-near-dunedin", "the-catlins-near-invercargill", "the-remarkables-near-queenstown"],
    featuredCities: ["queenstown", "invercargill", "dunedin"],
    relatedCollections: ["oceania-weekend-escapes", "oceania-lakes", "new-zealand-mountains", "new-zealand-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-rome",
    title: "Weekend Escapes near Rome",
    description:
      "Weekend Escapes near Rome groups 30 nearby places across 12 cities for local-first day and weekend discovery — mainly lakes, nature areas, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["laquila", "perugia", "rome", "cesena", "forli", "latina", "pistoia", "terni", "prato", "giugliano-in-campania", "pescara", "caserta"],
    nearbyPlaces: ["bracciano-lake-near-rome", "circeo-national-park-near-rome", "gran-sasso-and-monti-della-laga-national-park-near-laquila", "lake-trasimeno-near-perugia", "maiella-national-park-near-laquila", "tivoli-near-rome", "acquacheta-waterfall-near-cesena", "acquacheta-waterfall-near-forli", "alban-hills-near-latina", "aurunci-mountains-near-latina", "casentinesi-forests-monte-falterona-and-campigna-national-park-near-pistoia", "cimini-hills-near-terni", "circeo-national-park-near-latina", "foreste-casentinesi-monte-falterona-and-campigna-national-park-near-forli", "foreste-casentinesi-monte-falterona-campigna-national-park-near-cesena", "foreste-casentinesi-monte-falterona-campigna-national-park-near-prato", "ischia-near-giugliano-in-campania", "lake-avernus-near-giugliano-in-campania", "lake-fogliano-near-latina", "lake-piediluco-near-terni", "lake-ridracoli-near-cesena", "lake-ridracoli-near-forli", "lake-scanno-near-pescara", "lake-vico-near-terni", "marmore-falls-near-terni", "matese-near-caserta", "monte-carpegna-near-cesena", "monte-falterona-near-forli", "monte-falterona-near-prato", "monte-massico-near-caserta"],
    featuredPlaces: ["bracciano-lake-near-rome", "circeo-national-park-near-rome", "gran-sasso-and-monti-della-laga-national-park-near-laquila", "lake-trasimeno-near-perugia", "maiella-national-park-near-laquila", "tivoli-near-rome"],
    featuredCities: ["rome", "laquila", "perugia"],
    relatedCollections: ["italy-national-parks", "italy-lakes", "italy-mountains", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-rotterdam",
    title: "Weekend Escapes near Rotterdam",
    description:
      "Weekend Escapes near Rotterdam groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly nature areas, historic towns, cultural sites. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["breda", "delft", "eindhoven", "rotterdam", "s-hertogenbosch", "zoetermeer", "alphen-aan-den-rijn", "dordrecht", "ede", "westland", "amersfoort", "apeldoorn", "haarlemmermeer", "zaanstad"],
    nearbyPlaces: ["de-biesbosch-national-park-near-delft", "groote-peel-national-park-near-eindhoven", "de-loonse-en-drunense-duinen-national-park-near-s-hertogenbosch", "delft-near-rotterdam", "kinderdijk-near-rotterdam", "mastbos-near-breda", "midden-delfland-near-delft", "de-maasduinen-national-park-near-s-hertogenbosch", "dommel-near-s-hertogenbosch", "het-groene-woud-near-s-hertogenbosch", "strabrechtse-heide-near-s-hertogenbosch", "ackerdijkse-plassen-near-zoetermeer", "berkheide-near-zoetermeer", "de-biesbosch-national-park-near-alphen-aan-den-rijn", "de-biesbosch-national-park-near-dordrecht", "de-biesbosch-national-park-near-ede", "de-biesbosch-national-park-near-zoetermeer", "de-biesbosch-near-westland", "de-hoge-veluwe-national-park-near-alphen-aan-den-rijn", "de-hoge-veluwe-national-park-near-amersfoort", "de-hoge-veluwe-national-park-near-apeldoorn", "de-hoge-veluwe-national-park-near-dordrecht", "de-hoge-veluwe-national-park-near-haarlemmermeer", "de-loonse-en-drunense-duinen-national-park-near-amersfoort", "de-loonse-en-drunense-duinen-national-park-near-dordrecht", "de-loonse-en-drunense-duinen-national-park-near-zoetermeer", "eemmeer-near-amersfoort", "hoge-veluwe-national-park-near-ede", "hook-of-holland-beach-near-westland", "ijsselmeer-near-zaanstad"],
    featuredPlaces: ["de-biesbosch-national-park-near-delft", "groote-peel-national-park-near-eindhoven", "de-loonse-en-drunense-duinen-national-park-near-s-hertogenbosch", "delft-near-rotterdam", "kinderdijk-near-rotterdam", "mastbos-near-breda", "midden-delfland-near-delft"],
    featuredCities: ["delft", "rotterdam", "breda", "eindhoven", "s-hertogenbosch"],
    relatedCollections: ["belgium-netherlands-borderlands", "netherlands-national-parks", "western-europe-weekend-escapes", "germany-netherlands-borderlands", "weekend-escapes-near-amsterdam", "netherlands-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-san-francisco",
    title: "Weekend Escapes near San Francisco",
    description:
      "Weekend Escapes near San Francisco groups 30 nearby places across 7 cities for local-first day and weekend discovery — mainly nature areas, beaches, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["sacramento", "san-francisco", "salinas", "oakland", "santa-rosa", "san-jose-us", "stockton"],
    nearbyPlaces: ["ano-nuevo-state-park-near-san-francisco", "big-basin-redwoods-state-park-near-san-francisco", "folsom-lake-recreation-area-near-sacramento", "muir-woods-near-san-francisco", "point-reyes-near-san-francisco", "andrew-molera-state-park-near-salinas", "angel-island-near-oakland", "armstrong-redwoods-state-natural-reserve-near-santa-rosa", "big-basin-redwoods-state-park-near-san-jose-us", "calaveras-big-trees-state-park-near-stockton", "camanche-reservoir-near-stockton", "castle-rock-state-park-near-san-jose-us", "caswell-memorial-state-park-near-stockton", "cosumnes-river-preserve-near-stockton", "elkhorn-slough-near-salinas", "fremont-peak-state-park-near-salinas", "garrapata-state-park-near-salinas", "henry-w-coe-state-park-near-san-jose-us", "lake-chabot-near-oakland", "lexington-reservoir-near-san-jose-us", "mount-hamilton-near-san-jose-us", "mount-saint-helena-near-santa-rosa", "muir-woods-national-monument-near-oakland", "natural-bridges-state-beach-near-san-jose-us", "pardee-reservoir-near-stockton", "point-reyes-national-seashore-near-oakland", "point-reyes-national-seashore-near-santa-rosa", "redwood-regional-park-near-oakland", "robert-louis-stevenson-state-park-near-santa-rosa", "salinas-river-national-wildlife-refuge-near-salinas"],
    featuredPlaces: ["ano-nuevo-state-park-near-san-francisco", "big-basin-redwoods-state-park-near-san-francisco", "folsom-lake-recreation-area-near-sacramento", "muir-woods-near-san-francisco", "point-reyes-near-san-francisco"],
    featuredCities: ["san-francisco", "sacramento"],
    relatedCollections: ["california-weekend-escapes", "united-states-forests", "united-states-coast", "united-states-lakes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-seattle",
    title: "Weekend Escapes near Seattle",
    description:
      "Weekend Escapes near Seattle groups 10 nearby places across 3 cities for local-first day and weekend discovery — mainly parks, waterfronts, beaches. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["bellingham", "seattle", "tacoma"],
    nearbyPlaces: ["deception-pass-state-park-near-seattle", "larrabee-state-park-near-bellingham", "mount-rainier-national-park-near-tacoma", "north-cascades-national-park-near-bellingham", "olympic-national-park-near-tacoma", "wallace-falls-state-park-near-seattle", "federation-forest-state-park-near-tacoma", "flaming-geyser-state-park-near-tacoma", "point-defiance-park-near-tacoma", "vashon-island-near-tacoma"],
    featuredPlaces: ["deception-pass-state-park-near-seattle", "larrabee-state-park-near-bellingham", "mount-rainier-national-park-near-tacoma", "north-cascades-national-park-near-bellingham", "olympic-national-park-near-tacoma", "wallace-falls-state-park-near-seattle"],
    featuredCities: ["bellingham", "seattle", "tacoma"],
    relatedCollections: ["canada-united-states-borderlands", "united-states-national-parks", "united-states-coast", "united-states-mountains", "united-states-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-sofia",
    title: "Weekend Escapes near Sofia",
    description:
      "Weekend Escapes near Sofia groups 30 nearby places across 7 cities for local-first day and weekend discovery — mainly mountains, parks, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["plovdiv", "sofia", "stara-zagora", "pleven", "veliko-tarnovo", "bansko", "blagoevgrad"],
    nearbyPlaces: ["iskar-gorge-near-sofia", "rhodope-mountains-near-plovdiv", "rila-monastery-nature-park-near-sofia", "rila-national-park-near-sofia", "vitosha-near-sofia", "sredna-gora-near-stara-zagora", "vrachanski-balkan-nature-park-near-pleven", "bacho-kiro-cave-near-veliko-tarnovo", "bayuvi-dupki-dzhindzhiritsa-near-bansko", "belasitsa-nature-park-near-bansko", "bulgarka-nature-park-near-pleven", "bulgarka-nature-park-near-stara-zagora", "bulgarka-nature-park-near-veliko-tarnovo", "central-balkan-national-park-near-pleven", "central-balkan-national-park-near-stara-zagora", "central-balkan-national-park-near-veliko-tarnovo", "devetashka-cave-near-pleven", "koprinka-reservoir-near-stara-zagora", "kresna-gorge-near-blagoevgrad", "pirin-mountain-range-near-bansko", "pirin-mountains-near-blagoevgrad", "pirin-national-park-near-bansko", "pirin-national-park-near-blagoevgrad", "rila-monastery-nature-park-near-bansko", "rila-monastery-nature-park-near-blagoevgrad", "rila-national-park-near-bansko", "rila-national-park-near-blagoevgrad", "rila-near-blagoevgrad", "rose-valley-near-stara-zagora", "seven-rila-lakes-near-bansko"],
    featuredPlaces: ["iskar-gorge-near-sofia", "rhodope-mountains-near-plovdiv", "rila-monastery-nature-park-near-sofia", "rila-national-park-near-sofia", "vitosha-near-sofia"],
    featuredCities: ["sofia", "plovdiv"],
    relatedCollections: ["european-mountains", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-stockholm",
    title: "Weekend Escapes near Stockholm",
    description:
      "Weekend Escapes near Stockholm groups 30 nearby places across 10 cities for local-first day and weekend discovery — mainly nature areas, islands, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["linkoping", "norrkoping", "orebro", "stockholm", "uppsala", "boras", "vasteras", "sodertalje", "gavle", "eskilstuna"],
    nearbyPlaces: ["braviken-near-norrkoping", "drottningholm-near-stockholm", "farnebofjarden-national-park-near-uppsala", "kolmarden-near-norrkoping", "roxen-near-linkoping", "stockholm-archipelago-near-stockholm", "tiveden-national-park-near-orebro", "takern-near-linkoping", "uppsala-near-stockholm", "angso-national-park-near-stockholm", "baven-near-norrkoping", "kilsbergen-near-orebro", "kolmarden-near-orebro", "norra-kvill-national-park-near-norrkoping", "takern-near-norrkoping", "tiveden-near-orebro", "vanern-near-orebro", "vattern-near-norrkoping", "vattern-near-orebro", "alleberg-near-boras", "angso-national-park-near-vasteras", "aspen-near-sodertalje", "badelundaasen-near-vasteras", "billingen-near-boras", "billudden-near-gavle", "dalalven-near-gavle", "eldgarnso-nature-reserve-near-eskilstuna", "farnebofjarden-national-park-near-gavle", "farnebofjarden-national-park-near-vasteras", "garnudden-nature-reserve-near-sodertalje"],
    featuredPlaces: ["braviken-near-norrkoping", "drottningholm-near-stockholm", "farnebofjarden-national-park-near-uppsala", "kolmarden-near-norrkoping", "roxen-near-linkoping", "stockholm-archipelago-near-stockholm", "tiveden-national-park-near-orebro", "takern-near-linkoping"],
    featuredCities: ["stockholm", "linkoping", "norrkoping", "orebro", "uppsala"],
    relatedCollections: ["sweden-national-parks", "northern-europe-weekend-escapes", "sweden-islands", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-strasbourg",
    title: "Weekend Escapes near Strasbourg",
    description:
      "Weekend Escapes near Strasbourg groups 30 nearby places across 6 cities for local-first day and weekend discovery — mainly lakes, mountains, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["metz", "strasbourg", "montbeliard", "mulhouse", "colmar", "troyes"],
    nearbyPlaces: ["lac-blanc-near-strasbourg", "lac-de-madine-near-metz", "lorraine-regional-natural-park-near-metz", "mont-sainte-odile-near-strasbourg", "northern-vosges-regional-park-near-strasbourg", "vosges-near-strasbourg", "lake-der-chantecoq-near-metz", "moselle-near-metz", "northern-vosges-regional-natural-park-near-metz", "vosges-near-metz", "ballon-d-alsace-near-montbeliard", "ballon-de-servance-near-montbeliard", "ballons-des-vosges-nature-park-near-montbeliard", "ballons-des-vosges-nature-park-near-mulhouse", "ballons-des-vosges-regional-nature-park-near-colmar", "foret-d-orient-national-nature-reserve-near-troyes", "forets-national-park-near-troyes", "grand-ballon-near-colmar", "grand-ballon-near-montbeliard", "grand-ballon-near-mulhouse", "hohneck-near-colmar", "hohneck-near-mulhouse", "jura-mountains-near-montbeliard", "kaiserstuhl-near-colmar", "lac-blanc-near-colmar", "lac-blanc-near-mulhouse", "lac-de-kruth-wildenstein-near-mulhouse", "lac-des-brenets-near-montbeliard", "lac-noir-near-colmar", "lakes-amance-and-du-temple-near-troyes"],
    featuredPlaces: ["lac-blanc-near-strasbourg", "lac-de-madine-near-metz", "lorraine-regional-natural-park-near-metz", "mont-sainte-odile-near-strasbourg", "northern-vosges-regional-park-near-strasbourg", "vosges-near-strasbourg"],
    featuredCities: ["strasbourg", "metz"],
    relatedCollections: ["france-germany-borderlands", "france-lakes", "france-protected-landscapes", "western-europe-weekend-escapes", "france-mountains", "western-europe-lakes", "western-europe-protected-landscapes", "australia-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-sydney",
    title: "Weekend Escapes near Sydney",
    description:
      "Weekend Escapes near Sydney groups 14 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["newcastle", "sydney", "wollongong", "central-coast", "orange"],
    nearbyPlaces: ["blue-mountains-near-sydney", "budderoo-national-park-near-wollongong", "garigal-national-park-near-sydney", "ku-ring-gai-chase-national-park-near-sydney", "royal-national-park-sydney", "watagans-national-park-near-newcastle", "bouddi-national-park-near-central-coast", "brisbane-water-national-park-near-central-coast", "dharug-national-park-near-central-coast", "munmorah-state-conservation-area-near-central-coast", "popran-national-park-near-central-coast", "watagans-national-park-near-central-coast", "winburndale-dam-near-orange", "wollemi-national-park-near-orange"],
    featuredPlaces: ["blue-mountains-near-sydney", "budderoo-national-park-near-wollongong", "garigal-national-park-near-sydney", "ku-ring-gai-chase-national-park-near-sydney", "royal-national-park-sydney", "watagans-national-park-near-newcastle"],
    featuredCities: ["sydney", "newcastle", "wollongong"],
    relatedCollections: ["australia-national-parks", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-tallinn",
    title: "Weekend Escapes near Tallinn",
    description:
      "Weekend Escapes near Tallinn groups 19 nearby places across 5 cities for local-first day and weekend discovery — mainly parks, islands, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["kohtla-jarve", "parnu", "tallinn", "tartu", "narva"],
    nearbyPlaces: ["aegna-near-tallinn", "alutaguse-national-park-near-kohtla-jarve", "kihnu-near-parnu", "lahemaa-national-park-near-kohtla-jarve", "lake-peipus-near-tartu", "matsalu-national-park-near-tallinn", "soomaa-national-park-near-parnu", "endla-nature-reserve-near-kohtla-jarve", "muraka-nature-reserve-near-kohtla-jarve", "narva-reservoir-near-kohtla-jarve", "lahemaa-national-park-near-tallinn", "soomaa-national-park-near-tallinn", "alutaguse-national-park-near-narva", "kurtna-lake-district-near-narva", "lahemaa-national-park-near-narva", "lake-peipus-near-narva", "narva-bay-near-narva", "narva-joesuu-beach-near-narva", "ontika-landscape-conservation-area-near-narva"],
    featuredPlaces: ["aegna-near-tallinn", "alutaguse-national-park-near-kohtla-jarve", "kihnu-near-parnu", "lahemaa-national-park-near-kohtla-jarve", "lake-peipus-near-tartu", "matsalu-national-park-near-tallinn", "soomaa-national-park-near-parnu"],
    featuredCities: ["kohtla-jarve", "parnu", "tallinn", "tartu"],
    relatedCollections: ["baltic-sea-coast", "estonia-finland-borderlands", "baltic-europe-weekend-escapes", "european-islands", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-toronto",
    title: "Weekend Escapes near Toronto",
    description:
      "Weekend Escapes near Toronto groups 30 nearby places across 12 cities for local-first day and weekend discovery — mainly parks, nature areas, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["brampton", "hamilton-ontario", "markham", "mississauga", "toronto", "vaughan", "barrie", "st-catharines", "peterborough", "guelph", "oshawa", "brantford"],
    nearbyPlaces: ["boyd-conservation-area-near-vaughan", "bronte-creek-provincial-park-near-mississauga", "cheltenham-badlands-near-brampton", "dundas-valley-conservation-area-near-hamilton-ontario", "forks-of-the-credit-provincial-park-near-brampton", "niagara-falls-near-toronto", "rouge-national-urban-park-near-markham", "sibbald-point-provincial-park-near-markham", "toronto-islands-near-toronto", "albion-hills-conservation-area-near-brampton", "albion-hills-conservation-area-near-markham", "albion-hills-conservation-area-near-vaughan", "bruce-s-mill-conservation-area-near-markham", "bruce-s-mill-conservation-area-near-vaughan", "cold-creek-conservation-area-near-markham", "crawford-lake-conservation-area-near-mississauga", "forks-of-the-credit-provincial-park-near-vaughan", "heart-lake-conservation-area-near-brampton", "hilton-falls-conservation-area-near-mississauga", "kortright-centre-for-conservation-near-vaughan", "mono-cliffs-provincial-park-near-brampton", "rattray-marsh-conservation-area-near-mississauga", "rouge-national-urban-park-near-mississauga", "awenda-provincial-park-near-barrie", "ball-s-falls-near-st-catharines", "balsam-lake-provincial-park-near-peterborough", "crawford-lake-near-guelph", "darlington-provincial-park-near-oshawa", "dundas-valley-conservation-area-near-brantford", "dundas-valley-conservation-area-near-guelph"],
    featuredPlaces: ["boyd-conservation-area-near-vaughan", "bronte-creek-provincial-park-near-mississauga", "cheltenham-badlands-near-brampton", "dundas-valley-conservation-area-near-hamilton-ontario", "forks-of-the-credit-provincial-park-near-brampton", "niagara-falls-near-toronto", "rouge-national-urban-park-near-markham", "sibbald-point-provincial-park-near-markham"],
    featuredCities: ["brampton", "markham", "toronto", "hamilton-ontario", "mississauga", "vaughan"],
    relatedCollections: ["canada-protected-landscapes", "north-america-protected-landscapes", "north-america-weekend-escapes", "canada-united-states-borderlands", "canada-islands", "canada-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-toulouse",
    title: "Weekend Escapes near Toulouse",
    description:
      "Weekend Escapes near Toulouse groups 30 nearby places across 8 cities for local-first day and weekend discovery — mainly nature areas, mountains, waterfronts. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["perpignan", "toulouse", "narbonne", "albi", "beziers", "tarbes", "carcassonne", "biarritz"],
    nearbyPlaces: ["cap-de-creus-near-perpignan", "garonne-near-toulouse", "haut-languedoc-regional-park-near-toulouse", "montagne-noire-near-toulouse", "pyrenees-national-park-near-toulouse", "canigou-near-narbonne", "cevennes-national-park-near-albi", "cevennes-national-park-near-beziers", "cirque-de-gavarnie-near-tarbes", "cirque-de-navacelles-near-beziers", "col-du-tourmalet-near-tarbes", "etang-de-leucate-near-carcassonne", "etang-de-thau-near-beziers", "etang-de-thau-near-narbonne", "gaube-lake-near-tarbes", "grands-causses-regional-natural-park-near-albi", "haut-languedoc-regional-natural-park-near-albi", "haut-languedoc-regional-nature-park-near-beziers", "haut-languedoc-regional-nature-park-near-narbonne", "irati-forest-near-biarritz", "lac-de-la-cavayere-near-carcassonne", "lac-de-montbel-near-carcassonne", "lake-pareloup-near-albi", "lake-saint-ferreol-near-albi", "leucate-near-narbonne", "massif-de-la-clape-near-carcassonne", "massif-de-la-clape-near-narbonne", "montagne-noire-near-albi", "montagne-noire-near-beziers", "montagne-noire-near-carcassonne"],
    featuredPlaces: ["cap-de-creus-near-perpignan", "garonne-near-toulouse", "haut-languedoc-regional-park-near-toulouse", "montagne-noire-near-toulouse", "pyrenees-national-park-near-toulouse"],
    featuredCities: ["toulouse", "perpignan"],
    relatedCollections: ["france-mountains", "france-protected-landscapes", "france-spain-borderlands", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-valencia",
    title: "Weekend Escapes near Valencia",
    description:
      "Weekend Escapes near Valencia groups 30 nearby places across 8 cities for local-first day and weekend discovery — mainly nature areas, mountains, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["alicante", "valencia", "castellon-de-la-plana", "elche", "albacete", "cartagena", "benidorm", "teruel"],
    nearbyPlaces: ["albufera-natural-park-near-valencia", "montgo-natural-park-near-alicante", "penyal-difac-near-valencia", "sierra-calderona-near-valencia", "sierra-de-espadan-near-valencia", "desert-de-les-palmes-natural-park-near-castellon-de-la-plana", "el-fondo-natural-park-near-elche", "font-roja-natural-park-near-elche", "hoces-del-cabriel-cabriel-river-gorges-near-albacete", "mijares-river-near-castellon-de-la-plana", "montgo-massif-near-elche", "penyagolosa-near-castellon-de-la-plana", "serra-calderona-near-castellon-de-la-plana", "serra-d-espada-near-castellon-de-la-plana", "serra-d-irta-natural-park-near-castellon-de-la-plana", "serra-de-crevillent-near-elche", "serra-mariola-natural-park-near-elche", "tabarca-near-cartagena", "tabarca-near-elche", "aitana-near-benidorm", "alarcon-reservoir-near-albacete", "cap-de-la-nau-near-benidorm", "escandon-pass-near-teruel", "font-roja-natural-park-near-benidorm", "maestrazgo-near-teruel", "montes-universales-near-teruel", "montgo-massif-near-benidorm", "penyal-d-ifac-natural-park-near-benidorm", "puig-campana-near-benidorm", "serra-mariola-natural-park-near-benidorm"],
    featuredPlaces: ["albufera-natural-park-near-valencia", "montgo-natural-park-near-alicante", "penyal-difac-near-valencia", "sierra-calderona-near-valencia", "sierra-de-espadan-near-valencia"],
    featuredCities: ["valencia", "alicante"],
    relatedCollections: ["spain-protected-landscapes", "spain-mountains", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-vancouver",
    title: "Weekend Escapes near Vancouver",
    description:
      "Weekend Escapes near Vancouver groups 30 nearby places across 7 cities for local-first day and weekend discovery — mainly parks, mountains, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["burnaby", "nanaimo", "surrey", "vancouver", "victoria", "abbotsford", "chilliwack"],
    nearbyPlaces: ["belcarra-regional-park-near-burnaby", "boundary-bay-near-surrey", "campbell-valley-regional-park-near-surrey", "garibaldi-provincial-park-near-vancouver", "goldstream-provincial-park-near-victoria", "juan-de-fuca-provincial-park-near-victoria", "lynn-canyon-park-near-vancouver", "mount-benson-near-nanaimo", "mount-douglas-near-victoria", "mount-seymour-provincial-park-near-vancouver", "pacific-spirit-regional-park-near-burnaby", "salt-spring-island-near-victoria", "saysutshun-newcastle-island-marine-park-near-nanaimo", "stanley-park-vancouver", "buntzen-lake-near-burnaby", "buntzen-lake-near-surrey", "cultus-lake-provincial-park-near-surrey", "cypress-provincial-park-near-surrey", "lynn-canyon-park-near-burnaby", "lynn-headwaters-regional-park-near-burnaby", "mount-seymour-provincial-park-near-burnaby", "bridal-veil-falls-provincial-park-near-abbotsford", "bridal-veil-falls-provincial-park-near-chilliwack", "chilliwack-lake-near-chilliwack", "chilliwack-lake-provincial-park-near-abbotsford", "cultus-lake-near-abbotsford", "cultus-lake-near-chilliwack", "golden-ears-provincial-park-near-abbotsford", "golden-ears-provincial-park-near-chilliwack", "harrison-lake-near-chilliwack"],
    featuredPlaces: ["belcarra-regional-park-near-burnaby", "boundary-bay-near-surrey", "campbell-valley-regional-park-near-surrey", "garibaldi-provincial-park-near-vancouver", "goldstream-provincial-park-near-victoria", "juan-de-fuca-provincial-park-near-victoria", "lynn-canyon-park-near-vancouver", "mount-benson-near-nanaimo"],
    featuredCities: ["vancouver", "victoria", "burnaby", "nanaimo", "surrey"],
    relatedCollections: ["canada-protected-landscapes", "canada-united-states-borderlands", "canada-mountains", "north-america-protected-landscapes", "canada-islands", "north-america-weekend-escapes", "australia-weekend-escapes", "baltic-europe-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-venice",
    title: "Weekend Escapes near Venice",
    description:
      "Weekend Escapes near Venice groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly nature areas, mountains, beaches. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["ferrara", "padua", "udine", "venice", "verona", "cesena", "forli", "brescia", "cremona", "vicenza", "treviso", "pistoia", "trieste", "prato"],
    nearbyPlaces: ["adige-valley-near-verona", "cansiglio-near-venice", "carnic-alps-near-udine", "cavallino-treporti-near-venice", "comacchio-near-ferrara", "dolomiti-bellunesi-national-park-near-venice", "euganean-hills-near-venice", "euganean-hills-near-padua", "julian-prealps-natural-park-near-udine", "lake-garda-near-verona", "lessinia-regional-park-near-verona", "monte-baldo-near-verona", "euganean-hills-near-ferrara", "reno-near-ferrara", "acquacheta-waterfall-near-cesena", "acquacheta-waterfall-near-forli", "adamello-brenta-natural-park-near-brescia", "adda-river-near-cremona", "asiago-plateau-near-vicenza", "berici-hills-near-vicenza", "cansiglio-near-treviso", "casentinesi-forests-monte-falterona-and-campigna-national-park-near-pistoia", "castello-di-miramare-near-trieste", "cima-palon-pasubio-near-vicenza", "dolomiti-bellunesi-national-park-near-treviso", "euganean-hills-near-vicenza", "foreste-casentinesi-monte-falterona-and-campigna-national-park-near-forli", "foreste-casentinesi-monte-falterona-campigna-national-park-near-cesena", "foreste-casentinesi-monte-falterona-campigna-national-park-near-prato", "lago-di-santa-croce-near-treviso"],
    featuredPlaces: ["adige-valley-near-verona", "cansiglio-near-venice", "carnic-alps-near-udine", "cavallino-treporti-near-venice", "comacchio-near-ferrara", "dolomiti-bellunesi-national-park-near-venice", "euganean-hills-near-venice", "euganean-hills-near-padua"],
    featuredCities: ["venice", "verona", "udine", "ferrara", "padua"],
    relatedCollections: ["italy-mountains", "austria-italy-borderlands", "italy-protected-landscapes", "italy-slovenia-borderlands", "southern-europe-weekend-escapes", "eastern-alps", "european-coast", "italy-coast"],
  },
  {
    slug: "weekend-escapes-near-vilnius",
    title: "Weekend Escapes near Vilnius",
    description:
      "Weekend Escapes near Vilnius groups 22 nearby places across 5 cities for local-first day and weekend discovery — mainly parks, lakes, nature areas. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["kaunas", "panevezys", "vilnius", "siauliai", "alytus"],
    nearbyPlaces: ["anyksciai-regional-park-near-panevezys", "asveja-near-vilnius", "birzai-regional-park-near-panevezys", "dzukija-national-park-near-vilnius", "kaunas-reservoir-near-kaunas", "kauno-marios-regional-park-near-kaunas", "trakai-historical-national-park-near-vilnius", "verkiai-regional-park-near-vilnius", "grazute-regional-park-near-panevezys", "labanoras-regional-park-near-panevezys", "lake-sartai-near-panevezys", "lake-tauragnas-near-panevezys", "lake-rekyva-near-siauliai", "aukstadvaris-regional-park-near-alytus", "cepkeliai-marsh-near-alytus", "dzukija-national-park-near-alytus", "lake-dusia-near-alytus", "meteliai-regional-park-near-alytus", "nemunas-loops-regional-park-near-alytus", "trakai-historical-national-park-near-alytus", "zemaitija-national-park-near-siauliai", "zuvintas-biosphere-reserve-near-alytus"],
    featuredPlaces: ["anyksciai-regional-park-near-panevezys", "asveja-near-vilnius", "birzai-regional-park-near-panevezys", "dzukija-national-park-near-vilnius", "kaunas-reservoir-near-kaunas", "kauno-marios-regional-park-near-kaunas", "trakai-historical-national-park-near-vilnius", "verkiai-regional-park-near-vilnius"],
    featuredCities: ["vilnius", "kaunas", "panevezys"],
    relatedCollections: ["latvia-lithuania-borderlands", "baltic-europe-weekend-escapes", "australia-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes", "finland-weekend-escapes", "france-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-warsaw",
    title: "Weekend Escapes near Warsaw",
    description:
      "Weekend Escapes near Warsaw groups 30 nearby places across 14 cities for local-first day and weekend discovery — mainly nature areas, lakes, parks. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["kielce", "lodz", "lublin", "warsaw", "dabrowa-gornicza", "sosnowiec", "tarnow", "bytom", "chorzow", "ruda-slaska", "zabrze", "plock", "wloclawek", "radom"],
    nearbyPlaces: ["kabaty-woods-near-warsaw", "kampinos-national-park-near-warsaw", "masovian-landscape-park-near-warsaw", "roztocze-national-park-near-lublin", "zegrze-reservoir-near-warsaw", "lodz-hills-landscape-park-near-lodz", "swietokrzyski-national-park-near-kielce", "swietokrzyskie-mountains-near-kielce", "nida-landscape-park-near-kielce", "suchedniow-oblegorek-landscape-park-near-kielce", "bedow-desert-near-dabrowa-gornicza", "bedow-desert-near-sosnowiec", "ciezkowice-roznow-landscape-park-near-tarnow", "eagles-nests-landscape-park-near-bytom", "eagles-nests-landscape-park-near-chorzow", "eagles-nests-landscape-park-near-dabrowa-gornicza", "eagles-nests-landscape-park-near-ruda-slaska", "eagles-nests-landscape-park-near-sosnowiec", "eagles-nests-landscape-park-near-zabrze", "gorce-national-park-near-tarnow", "gorzno-lidzbark-landscape-park-near-plock", "gorzno-lidzbark-landscape-park-near-wloclawek", "gostynin-and-wocawek-landscape-park-near-plock", "gostynin-wocawek-landscape-park-near-wloclawek", "kampinos-national-park-near-plock", "kozienice-landscape-park-near-radom", "krakow-czestochowa-upland-near-bytom", "krakow-czestochowa-upland-near-dabrowa-gornicza", "lake-roznow-near-tarnow", "ojcow-national-park-near-bytom"],
    featuredPlaces: ["kabaty-woods-near-warsaw", "kampinos-national-park-near-warsaw", "masovian-landscape-park-near-warsaw", "roztocze-national-park-near-lublin", "zegrze-reservoir-near-warsaw", "lodz-hills-landscape-park-near-lodz", "swietokrzyski-national-park-near-kielce", "swietokrzyskie-mountains-near-kielce"],
    featuredCities: ["warsaw", "kielce", "lodz", "lublin"],
    relatedCollections: ["poland-national-parks", "central-europe-weekend-escapes", "central-europe-mountains", "poland-mountains", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-wellington",
    title: "Weekend Escapes near Wellington",
    description:
      "Weekend Escapes near Wellington groups 16 nearby places across 5 cities for local-first day and weekend discovery — mainly nature areas, parks, islands. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["lower-hutt", "nelson", "palmerston-north", "wellington", "blenheim"],
    nearbyPlaces: ["abel-tasman-national-park-near-nelson", "belmont-regional-park-near-lower-hutt", "kapiti-island-near-wellington", "remutaka-forest-park-near-wellington", "tararua-forest-park-near-palmerston-north", "tararua-forest-park-near-wellington", "zealandia-near-wellington", "kapiti-island-near-lower-hutt", "pakuratahi-forest-near-lower-hutt", "cloudy-bay-near-blenheim", "kenepuru-sound-near-blenheim", "lake-grassmere-near-blenheim", "marlborough-sounds-near-blenheim", "mount-richmond-forest-park-near-blenheim", "pelorus-bridge-near-blenheim", "wairau-river-near-blenheim"],
    featuredPlaces: ["abel-tasman-national-park-near-nelson", "belmont-regional-park-near-lower-hutt", "kapiti-island-near-wellington", "remutaka-forest-park-near-wellington", "tararua-forest-park-near-palmerston-north", "tararua-forest-park-near-wellington", "zealandia-near-wellington"],
    featuredCities: ["wellington", "lower-hutt", "nelson", "palmerston-north"],
    relatedCollections: ["oceania-weekend-escapes", "new-zealand-mountains", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes", "finland-weekend-escapes"],
  },
  {
    slug: "weekend-escapes-near-zagreb",
    title: "Weekend Escapes near Zagreb",
    description:
      "Weekend Escapes near Zagreb groups 25 nearby places across 5 cities for local-first day and weekend discovery — mainly mountains, islands, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["rijeka", "zagreb", "osijek", "pula", "zadar"],
    nearbyPlaces: ["krk-near-rijeka", "medvednica-nature-park-near-zagreb", "papuk-nature-park-near-zagreb", "plitvice-lakes-national-park-near-zagreb", "risnjak-national-park-near-rijeka", "akovo-near-osijek", "dilj-near-osijek", "kopacki-rit-near-osijek", "lonjsko-polje-near-osijek", "mura-drava-danube-near-osijek", "papuk-near-osijek", "risnjak-national-park-near-zagreb", "brijuni-national-park-near-pula", "cape-kamenjak-near-pula", "cres-near-pula", "dugi-otok-near-zadar", "kvarner-gulf-near-pula", "lake-vrana-cres-near-pula", "lim-bay-near-pula", "losinj-near-pula", "northern-velebit-national-park-near-zadar", "paklenica-national-park-near-zadar", "plitvice-lakes-national-park-near-zadar", "ucka-near-pula", "velebit-near-zadar"],
    featuredPlaces: ["krk-near-rijeka", "medvednica-nature-park-near-zagreb", "papuk-nature-park-near-zagreb", "plitvice-lakes-national-park-near-zagreb", "risnjak-national-park-near-rijeka"],
    featuredCities: ["zagreb", "rijeka"],
    relatedCollections: ["croatia-mountains", "croatia-slovenia-borderlands", "european-islands", "australia-weekend-escapes", "baltic-europe-weekend-escapes", "california-weekend-escapes", "canada-weekend-escapes", "central-europe-weekend-escapes"],
  },
  {
    slug: "western-europe-lakes",
    title: "Western Europe Lakes",
    description:
      "Western Europe Lakes groups 26 nearby places across 15 cities for local-first day and weekend discovery — mainly lakes. This is a geographic discovery collection derived from lake-district geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "lake_region",
    cities: ["almere", "angers", "charleroi", "limoges", "metz", "leeuwarden", "amersfoort", "zaanstad", "alphen-aan-den-rijn", "saint-nazaire", "saint-quentin", "anderlecht", "troyes", "schaerbeek", "haarlemmermeer"],
    nearbyPlaces: ["eau-d-heure-lakes-near-charleroi", "lac-de-madine-near-metz", "lac-de-maine-near-angers", "lac-de-vassiviere-near-limoges", "markermeer-near-almere", "lake-der-chantecoq-near-metz", "burgumer-mar-near-leeuwarden", "eemmeer-near-amersfoort", "frisian-lakes-near-leeuwarden", "ijsselmeer-near-zaanstad", "kagerplassen-near-alphen-aan-den-rijn", "lac-de-grand-lieu-near-saint-nazaire", "lac-du-val-joly-near-saint-quentin", "lake-genval-near-anderlecht", "lakes-amance-and-du-temple-near-troyes", "lesse-near-schaerbeek", "markermeer-near-haarlemmermeer", "markermeer-near-zaanstad", "veluwemeer-near-apeldoorn", "donkmeer-near-sint-niklaas", "eau-d-heure-lakes-near-tournai", "ijsselmeer-near-lelystad", "loosdrecht-lakes-near-hilversum", "markermeer-near-hilversum", "markermeer-near-lelystad", "upper-sure-lake-near-arlon"],
    featuredPlaces: ["eau-d-heure-lakes-near-charleroi", "lac-de-madine-near-metz", "lac-de-maine-near-angers", "lac-de-vassiviere-near-limoges", "markermeer-near-almere"],
    featuredCities: ["almere", "angers", "charleroi", "limoges", "metz"],
    relatedCollections: ["western-europe-weekend-escapes", "france-lakes", "european-lakes", "western-europe-protected-landscapes", "france-weekend-escapes", "weekend-escapes-near-amsterdam", "weekend-escapes-near-angers", "weekend-escapes-near-bruges"],
  },
  {
    slug: "western-europe-protected-landscapes",
    title: "Western Europe Protected Landscapes",
    description:
      "Western Europe Protected Landscapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly parks, nature areas. This is a geographic discovery collection derived from a shared protected landscape; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "protected_landscape_region",
    cities: ["almere", "angers", "coventry", "le-mans", "limoges", "metz", "orleans", "saint-etienne", "zoetermeer", "milton-keynes", "luton", "angouleme", "bourges", "poitiers", "lorient"],
    nearbyPlaces: ["brenne-regional-natural-park-near-orleans", "livradois-forez-regional-natural-park-near-saint-etienne", "loire-anjou-touraine-regional-nature-park-near-angers", "lorraine-regional-natural-park-near-metz", "normandie-maine-regional-natural-park-near-le-mans", "pilat-regional-natural-park-near-saint-etienne", "perigord-limousin-regional-natural-park-near-limoges", "oostvaardersplassen-near-almere", "cannock-chase-near-coventry", "brandon-marsh-near-coventry", "briere-regional-natural-park-near-angers", "de-hoge-veluwe-national-park-near-almere", "foret-d-ecouves-near-le-mans", "loire-valley-near-angers", "mayenne-near-angers", "normandie-maine-regional-natural-park-near-angers", "northern-vosges-regional-natural-park-near-metz", "ufton-fields-near-coventry", "weerribben-wieden-national-park-near-almere", "ackerdijkse-plassen-near-zoetermeer", "ashridge-estate-near-milton-keynes", "ashridge-near-luton", "auvezere-near-angouleme", "brenne-regional-natural-park-near-bourges", "brenne-regional-natural-park-near-poitiers", "briere-regional-natural-park-near-lorient", "briere-regional-natural-park-near-saint-nazaire", "burnham-beeches-near-reading", "cannock-chase-near-stoke-on-trent", "cannock-chase-near-wolverhampton"],
    featuredPlaces: ["brenne-regional-natural-park-near-orleans", "cannock-chase-near-coventry", "livradois-forez-regional-natural-park-near-saint-etienne", "loire-anjou-touraine-regional-nature-park-near-angers", "lorraine-regional-natural-park-near-metz", "normandie-maine-regional-natural-park-near-le-mans", "oostvaardersplassen-near-almere", "pilat-regional-natural-park-near-saint-etienne"],
    featuredCities: ["saint-etienne", "almere", "angers", "coventry", "le-mans", "limoges"],
    relatedCollections: ["western-europe-weekend-escapes", "france-protected-landscapes", "france-weekend-escapes", "weekend-escapes-near-angers", "western-europe-lakes", "france-germany-borderlands", "united-kingdom-weekend-escapes", "weekend-escapes-near-amsterdam"],
  },
  {
    slug: "western-europe-weekend-escapes",
    title: "Western Europe Weekend Escapes",
    description:
      "Western Europe Weekend Escapes groups 30 nearby places across 15 cities for local-first day and weekend discovery — mainly nature areas, parks, lakes. This is a geographic discovery collection derived from regional weekend-escape geography; it is not a tourism ranking and uses no popularity or visitor data. Verify access, transport, weather, health, and safety with official sources before visiting.",
    regionType: "weekend_escape_region",
    cities: ["almere", "angers", "bradford", "charleroi", "coventry", "derby", "drogheda", "enschede", "limoges", "metz", "orleans", "s-hertogenbosch", "saint-etienne", "sunderland", "swords"],
    nearbyPlaces: ["eau-d-heure-lakes-near-charleroi", "sonian-forest-near-charleroi", "brenne-regional-natural-park-near-orleans", "forest-of-orleans-near-orleans", "lac-de-madine-near-metz", "lac-de-maine-near-angers", "lac-de-vassiviere-near-limoges", "livradois-forez-regional-natural-park-near-saint-etienne", "loire-anjou-touraine-regional-nature-park-near-angers", "lorraine-regional-natural-park-near-metz", "pilat-regional-natural-park-near-saint-etienne", "perigord-limousin-regional-natural-park-near-limoges", "cooley-mountains-near-drogheda", "north-bull-island-near-swords", "wicklow-mountains-national-park-near-swords", "de-biesbosch-national-park-near-s-hertogenbosch", "de-loonse-en-drunense-duinen-national-park-near-s-hertogenbosch", "markermeer-near-almere", "oostvaardersplassen-near-almere", "sallandse-heuvelrug-national-park-near-enschede", "weerribben-wieden-national-park-near-enschede", "cannock-chase-near-coventry", "durham-coast-near-sunderland", "ilkley-moor-near-bradford", "marsden-rock-near-sunderland", "peak-district-national-park-near-bradford", "the-national-forest-near-derby", "ardennes-near-charleroi", "bettystown-near-drogheda", "bolton-abbey-near-bradford"],
    featuredPlaces: ["brenne-regional-natural-park-near-orleans", "cannock-chase-near-coventry", "cooley-mountains-near-drogheda", "de-biesbosch-national-park-near-s-hertogenbosch", "de-loonse-en-drunense-duinen-national-park-near-s-hertogenbosch", "durham-coast-near-sunderland", "eau-d-heure-lakes-near-charleroi", "forest-of-orleans-near-orleans"],
    featuredCities: ["almere", "angers", "bradford", "charleroi", "enschede", "limoges"],
    relatedCollections: ["western-europe-protected-landscapes", "france-protected-landscapes", "western-europe-lakes", "france-lakes", "france-weekend-escapes", "netherlands-national-parks", "united-kingdom-weekend-escapes", "weekend-escapes-near-dublin"],
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
