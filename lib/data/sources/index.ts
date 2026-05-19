import type { DataSource } from "@/types";

export const dataSources: DataSource[] = [
  {
    id: "un-habitat",
    name: "World Cities Report 2024",
    organization: "UN-Habitat",
    url: "https://unhabitat.org/world-cities-report-2024-cities-and-climate-action",
    description:
      "Urban climate, resilience, housing, and inclusion context for city-level interpretation.",
    reliabilityNote:
      "Used as a policy and methodology reference for urban exposure and resilience signals.",
  },
  {
    id: "who-air",
    name: "WHO Global Air Quality Guidelines",
    organization: "World Health Organization",
    url: "https://www.who.int/publications/i/item/9789240034228/",
    description:
      "Health-based reference levels for PM2.5, PM10, ozone, nitrogen dioxide, sulfur dioxide, and carbon monoxide.",
    reliabilityNote:
      "Used to normalize air-quality indicators toward health-protective benchmarks.",
  },
  {
    id: "nasa-power",
    name: "NASA POWER",
    organization: "NASA",
    url: "https://power.larc.nasa.gov/",
    description:
      "Satellite-derived solar and meteorological datasets for energy and climate screening.",
    reliabilityNote:
      "Used as an energy-resource and weather-normalization reference.",
  },
  {
    id: "eea-air",
    name: "Air Quality Status Report",
    organization: "European Environment Agency",
    url: "https://www.eea.europa.eu/en/analysis/publications/air-quality-status-report-2026",
    description:
      "European air-quality assessment context for pollutant trends, thresholds, and health risk framing.",
    reliabilityNote:
      "Used where European city comparisons need monitored air-quality context.",
  },
  {
    id: "epa-naaqs",
    name: "National Ambient Air Quality Standards",
    organization: "US Environmental Protection Agency",
    url: "https://www.epa.gov/naaqs",
    description:
      "Scientific and regulatory context for criteria pollutants and particulate matter standards.",
    reliabilityNote:
      "Used where United States city comparisons need air-quality benchmark context.",
  },
  {
    id: "us-epa-airdata",
    name: "US EPA AirData — annual AQI summary",
    organization: "US Environmental Protection Agency",
    url: "https://aqs.epa.gov/aqsweb/airdata/download_files.html",
    description:
      "EPA AirData publishes annual AQI summary statistics per US county, including Median AQI, 90th percentile AQI, and the number of days in each AQI category. Values are computed from official monitoring data submitted to AQS.",
    reliabilityNote:
      "Used as the city-level source for US air-quality records where a single county clearly maps to the city. Records that span multiple counties must disclose the borough/county selection in record notes.",
  },
  {
    id: "ipcc-urban",
    name: "AR6 WGII Chapter 6: Cities, settlements and key infrastructure",
    organization: "IPCC",
    url: "https://www.ipcc.ch/report/ar6/wg2/chapter/chapter-6",
    description:
      "Climate-risk and adaptation reference for cities, settlements, infrastructure, and resilience.",
    reliabilityNote:
      "Used to explain urban climate vulnerability and adaptation scoring logic.",
  },
  {
    id: "numbeo-cost",
    name: "Cost of Living Index",
    organization: "Numbeo",
    url: "https://www.numbeo.com/cost-of-living/",
    description:
      "Crowd-sourced cost-of-living, rent, and purchasing-power index used as a directional comparison reference.",
    reliabilityNote:
      "Used for directional affordability framing alongside official housing and price datasets.",
  },
  {
    id: "iea-cities",
    name: "Empowering Urban Energy Transitions",
    organization: "International Energy Agency",
    url: "https://www.iea.org/reports/empowering-urban-energy-transitions",
    description:
      "City-scale clean-energy transition framing covering policy, electrification, buildings, and grid context.",
    reliabilityNote:
      "Used to ground energy-readiness scoring in international transition guidance.",
  },
  {
    id: "unodc-crime",
    name: "UNODC Data Portal",
    organization: "United Nations Office on Drugs and Crime",
    url: "https://dataunodc.un.org/",
    description:
      "International crime, victimization, and criminal-justice statistics used for safety context.",
    reliabilityNote:
      "Used as a directional benchmark for relative city safety framing.",
  },
  {
    id: "itu-connectivity",
    name: "Measuring Digital Development",
    organization: "International Telecommunication Union",
    url: "https://www.itu.int/itu-d/reports/statistics/",
    description:
      "Global broadband, mobile, and digital-development indicators for connectivity benchmarking.",
    reliabilityNote:
      "Used as the connectivity reference for national and city-level digital-readiness signals.",
  },
  {
    id: "ookla-speedtest",
    name: "Speedtest Global Index",
    organization: "Ookla",
    url: "https://www.speedtest.net/global-index",
    description:
      "Continuously updated fixed-broadband and mobile-network performance comparison index.",
    reliabilityNote:
      "Used as a directional speed and latency reference for city connectivity scoring.",
  },
  {
    id: "ec-112",
    name: "112 — The European emergency number",
    organization: "European Commission",
    url: "https://digital-strategy.ec.europa.eu/en/policies/112",
    description:
      "Official European Commission policy page describing 112 as the single emergency number reachable across the European Union and several neighboring countries.",
    reliabilityNote:
      "Used as the primary attribution for the EU-wide 112 universal emergency number on European country profiles.",
  },
  {
    id: "fcc-911",
    name: "9-1-1 and E9-1-1 services",
    organization: "Federal Communications Commission",
    url: "https://www.fcc.gov/general/9-1-1-and-e9-1-1-services",
    description:
      "FCC reference page for the United States 9-1-1 and Enhanced 9-1-1 emergency calling system, covering availability and routing.",
    reliabilityNote:
      "Used as the primary attribution for the United States 911 universal emergency number.",
  },
  {
    id: "canada-emergency",
    name: "Emergency services in Canada",
    organization: "Government of Canada",
    url: "https://www.canada.ca/en/services/policing/police/community-safety-policing/911service.html",
    description:
      "Government of Canada reference for 9-1-1 emergency calling service availability across Canadian provinces and territories.",
    reliabilityNote:
      "Used as the primary attribution for Canada's 911 universal emergency number.",
  },
  {
    id: "triple-zero-au",
    name: "Triple Zero (000)",
    organization: "Australian Government",
    url: "https://www.triplezero.gov.au/",
    description:
      "Official Australian Government information site for the Triple Zero (000) emergency call service for police, fire, and ambulance.",
    reliabilityNote:
      "Used as the primary attribution for Australia's 000 universal emergency number.",
  },
  {
    id: "nz-police-111",
    name: "Dial 111 — Emergencies",
    organization: "New Zealand Police",
    url: "https://www.police.govt.nz/contact-us/dial-111-emergencies",
    description:
      "New Zealand Police reference page for the 111 emergency calling service across police, fire, and ambulance.",
    reliabilityNote:
      "Used as the primary attribution for New Zealand's 111 universal emergency number.",
  },
  {
    id: "npa-japan",
    name: "National Police Agency of Japan",
    organization: "National Police Agency, Japan",
    url: "https://www.npa.go.jp/english/",
    description:
      "Official site of Japan's National Police Agency, with public guidance referencing 110 for police and 119 for fire and ambulance.",
    reliabilityNote:
      "Used as the primary attribution for Japan's 110 police and 119 fire and ambulance emergency numbers.",
  },
  {
    id: "spf-singapore",
    name: "Singapore Police Force",
    organization: "Singapore Police Force",
    url: "https://www.police.gov.sg/",
    description:
      "Official Singapore Police Force site with public emergency contact guidance, referencing 999 for police emergencies.",
    reliabilityNote:
      "Used as the primary attribution for Singapore's 999 police emergency number.",
  },
  {
    id: "scdf-singapore",
    name: "Singapore Civil Defence Force",
    organization: "Singapore Civil Defence Force",
    url: "https://www.scdf.gov.sg/",
    description:
      "Official Singapore Civil Defence Force site with public emergency contact guidance, referencing 995 for fire and ambulance.",
    reliabilityNote:
      "Used as the primary attribution for Singapore's 995 fire and ambulance emergency number.",
  },
  {
    id: "korea-police",
    name: "Korean National Police Agency",
    organization: "Korean National Police Agency",
    url: "https://www.police.go.kr/eng/main.do",
    description:
      "Official site of the Korean National Police Agency, with public guidance referencing 112 for police and 119 for fire and ambulance.",
    reliabilityNote:
      "Used as the primary attribution for South Korea's 112 police and 119 fire and ambulance emergency numbers.",
  },
  {
    id: "who",
    name: "World Health Organization",
    organization: "World Health Organization",
    url: "https://www.who.int/",
    description:
      "United Nations specialized agency for international public health, providing health system context, guidelines, and country statistics.",
    reliabilityNote:
      "Used for international public-health context and as a secondary reference for country health-system framing.",
  },
  {
    id: "oecd-health",
    name: "OECD Health Statistics",
    organization: "Organisation for Economic Co-operation and Development",
    url: "https://www.oecd.org/health/health-data.htm",
    description:
      "Comparable cross-country health expenditure, workforce, and outcomes statistics for OECD member countries.",
    reliabilityNote:
      "Used as a comparative reference for OECD-country healthcare-system framing.",
  },
  {
    id: "us-hhs",
    name: "U.S. Department of Health and Human Services",
    organization: "U.S. Department of Health and Human Services",
    url: "https://www.hhs.gov/",
    description:
      "Cabinet-level United States department responsible for federal public health, social services, and health policy.",
    reliabilityNote:
      "Used as the primary federal attribution for United States public-health context.",
  },
  {
    id: "us-cms-care-compare",
    name: "Medicare Care Compare",
    organization: "Centers for Medicare & Medicaid Services",
    url: "https://www.medicare.gov/care-compare/",
    description:
      "Official United States federal directory for comparing Medicare-certified hospitals, nursing homes, and care providers.",
    reliabilityNote:
      "Used as the official United States hospital registry reference for verified facility lookups.",
  },
  {
    id: "uk-nhs",
    name: "National Health Service",
    organization: "National Health Service (UK)",
    url: "https://www.nhs.uk/",
    description:
      "Official information portal for the United Kingdom's National Health Service, including service finders and public health guidance.",
    reliabilityNote:
      "Used as the primary attribution for United Kingdom public-health and hospital information.",
  },
  {
    id: "uk-nhs-find-hospital",
    name: "Find a hospital — NHS",
    organization: "National Health Service (UK)",
    url: "https://www.nhs.uk/service-search/find-a-hospital",
    description:
      "Official NHS hospital and service finder for England.",
    reliabilityNote:
      "Used as the official England hospital registry reference for verified facility lookups.",
  },
  {
    id: "ca-health",
    name: "Health Canada",
    organization: "Government of Canada",
    url: "https://www.canada.ca/en/health-canada.html",
    description:
      "Federal department of the Government of Canada responsible for national public health policy and information.",
    reliabilityNote:
      "Used as the primary federal attribution for Canadian public-health context.",
  },
  {
    id: "ca-cihi",
    name: "Canadian Institute for Health Information",
    organization: "Canadian Institute for Health Information",
    url: "https://www.cihi.ca/en",
    description:
      "Independent, not-for-profit organization that provides comparable Canadian health-system data and analysis recognized by federal and provincial governments.",
    reliabilityNote:
      "Used as the primary reference for Canadian health-system statistics and hospital-system framing.",
  },
  {
    id: "au-health",
    name: "Australian Department of Health and Aged Care",
    organization: "Australian Government",
    url: "https://www.health.gov.au/",
    description:
      "Federal Australian department responsible for national health policy, public health, and aged care.",
    reliabilityNote:
      "Used as the primary federal attribution for Australian public-health context.",
  },
  {
    id: "au-aihw",
    name: "Australian Institute of Health and Welfare — MyHospitals",
    organization: "Australian Institute of Health and Welfare",
    url: "https://www.aihw.gov.au/reports-data/myhospitals",
    description:
      "Official Australian Government statistical agency hospital information portal.",
    reliabilityNote:
      "Used as the official Australian hospital registry reference for verified facility lookups.",
  },
  {
    id: "nz-tewhatuora",
    name: "Te Whatu Ora — Health New Zealand",
    organization: "Te Whatu Ora — Health New Zealand",
    url: "https://www.tewhatuora.govt.nz/",
    description:
      "Public agency responsible for delivering and funding New Zealand's health services nationally.",
    reliabilityNote:
      "Used as the primary attribution for New Zealand public-health and hospital information.",
  },
  {
    id: "sg-moh",
    name: "Ministry of Health, Singapore",
    organization: "Ministry of Health, Singapore",
    url: "https://www.moh.gov.sg/",
    description:
      "Singapore Government ministry responsible for national health policy, hospital oversight, and public health information.",
    reliabilityNote:
      "Used as the primary attribution for Singapore public-health context.",
  },
  {
    id: "sg-moh-hospitals",
    name: "Hospital Services — Ministry of Health, Singapore",
    organization: "Ministry of Health, Singapore",
    url: "https://www.moh.gov.sg/home/our-healthcare-system/healthcare-services-and-facilities/hospitals",
    description:
      "Official Ministry of Health directory describing Singapore's public and private hospital services.",
    reliabilityNote:
      "Used as the official Singapore hospital registry reference for verified facility framing.",
  },
  {
    id: "jp-mhlw",
    name: "Ministry of Health, Labour and Welfare, Japan",
    organization: "Ministry of Health, Labour and Welfare, Japan",
    url: "https://www.mhlw.go.jp/english/",
    description:
      "Japanese ministry responsible for national health, labour, and welfare policy and public health information.",
    reliabilityNote:
      "Used as the primary attribution for Japanese public-health context.",
  },
  {
    id: "de-bmg",
    name: "Federal Ministry of Health, Germany",
    organization: "Federal Ministry of Health (Bundesministerium für Gesundheit)",
    url: "https://www.bundesgesundheitsministerium.de/en/",
    description:
      "German federal ministry responsible for national health policy and public health information.",
    reliabilityNote:
      "Used as the primary attribution for German public-health context.",
  },
  {
    id: "fr-sante",
    name: "Ministère de la Santé et de la Prévention",
    organization: "Government of France",
    url: "https://sante.gouv.fr/",
    description:
      "French ministry responsible for national health policy, public health, and prevention.",
    reliabilityNote:
      "Used as the primary attribution for French public-health context.",
  },
  {
    id: "dk-sst",
    name: "Sundhedsstyrelsen — Danish Health Authority",
    organization: "Danish Health Authority",
    url: "https://www.sst.dk/en",
    description:
      "Danish national board of health responsible for public health policy, surveillance, and prevention.",
    reliabilityNote:
      "Used as the primary attribution for Danish public-health context.",
  },
  {
    id: "nl-rivm",
    name: "RIVM — National Institute for Public Health and the Environment",
    organization: "RIVM (Government of the Netherlands)",
    url: "https://www.rivm.nl/en",
    description:
      "Dutch government public health and environment institute responsible for national health monitoring and prevention.",
    reliabilityNote:
      "Used as the primary attribution for Dutch public-health context.",
  },
  {
    id: "us-dot",
    name: "U.S. Department of Transportation",
    organization: "U.S. Department of Transportation",
    url: "https://www.transportation.gov/",
    description:
      "Federal United States department responsible for national transportation policy, infrastructure, and safety.",
    reliabilityNote:
      "Used as the primary federal attribution for United States national transport context.",
  },
  {
    id: "us-faa",
    name: "Federal Aviation Administration",
    organization: "Federal Aviation Administration",
    url: "https://www.faa.gov/",
    description:
      "United States federal agency regulating civil aviation safety and airspace.",
    reliabilityNote:
      "Used as the primary attribution for United States aviation authority information.",
  },
  {
    id: "us-fra",
    name: "Federal Railroad Administration",
    organization: "Federal Railroad Administration",
    url: "https://railroads.dot.gov/",
    description:
      "United States federal agency responsible for railroad safety and policy.",
    reliabilityNote:
      "Used as the primary attribution for United States rail authority information.",
  },
  {
    id: "us-mta",
    name: "Metropolitan Transportation Authority",
    organization: "MTA — New York",
    url: "https://www.mta.info/",
    description:
      "Public benefit corporation responsible for public transportation in the New York City metropolitan area.",
    reliabilityNote:
      "Used as the primary attribution for New York metro and commuter rail information.",
  },
  {
    id: "us-panynj",
    name: "Port Authority of New York and New Jersey",
    organization: "Port Authority of New York and New Jersey",
    url: "https://www.panynj.gov/",
    description:
      "Bi-state public agency that operates JFK, LaGuardia, and Newark Liberty international airports and other regional transport assets.",
    reliabilityNote:
      "Used as the primary attribution for New York metropolitan airport information.",
  },
  {
    id: "uk-dft",
    name: "Department for Transport",
    organization: "UK Government",
    url: "https://www.gov.uk/government/organisations/department-for-transport",
    description:
      "United Kingdom government department responsible for national transport policy and statistics.",
    reliabilityNote:
      "Used as the primary attribution for United Kingdom national transport context.",
  },
  {
    id: "uk-caa",
    name: "Civil Aviation Authority",
    organization: "UK Civil Aviation Authority",
    url: "https://www.caa.co.uk/",
    description:
      "UK statutory corporation that oversees and regulates civil aviation in the United Kingdom.",
    reliabilityNote:
      "Used as the primary attribution for United Kingdom aviation authority information.",
  },
  {
    id: "uk-networkrail",
    name: "Network Rail",
    organization: "Network Rail",
    url: "https://www.networkrail.co.uk/",
    description:
      "Public body that owns and operates most of the rail network infrastructure in Great Britain.",
    reliabilityNote:
      "Used as the primary attribution for Great Britain rail infrastructure information.",
  },
  {
    id: "uk-tfl",
    name: "Transport for London",
    organization: "Transport for London",
    url: "https://tfl.gov.uk/",
    description:
      "Local government body responsible for most aspects of London's transport system.",
    reliabilityNote:
      "Used as the primary attribution for London public transport authority information.",
  },
  {
    id: "ca-tc",
    name: "Transport Canada",
    organization: "Government of Canada",
    url: "https://tc.canada.ca/en",
    description:
      "Federal department responsible for transportation policies and programs in Canada.",
    reliabilityNote:
      "Used as the primary federal attribution for Canadian national transport context.",
  },
  {
    id: "ca-via",
    name: "VIA Rail Canada",
    organization: "VIA Rail Canada",
    url: "https://www.viarail.ca/",
    description:
      "Canadian Crown corporation that operates intercity passenger rail services.",
    reliabilityNote:
      "Used as the primary attribution for Canadian national rail operator information.",
  },
  {
    id: "ca-ttc",
    name: "Toronto Transit Commission",
    organization: "Toronto Transit Commission",
    url: "https://www.ttc.ca/",
    description:
      "Public transit agency operating buses, streetcars, and subway lines in Toronto, Ontario.",
    reliabilityNote:
      "Used as the primary attribution for Toronto public transport authority information.",
  },
  {
    id: "ca-gtaa",
    name: "Greater Toronto Airports Authority",
    organization: "Greater Toronto Airports Authority",
    url: "https://www.torontopearson.com/",
    description:
      "Operator of Toronto Pearson International Airport (YYZ).",
    reliabilityNote:
      "Used as the official attribution for Toronto Pearson International Airport.",
  },
  {
    id: "au-infrastructure",
    name: "Department of Infrastructure, Transport, Regional Development, Communications and the Arts",
    organization: "Australian Government",
    url: "https://www.infrastructure.gov.au/",
    description:
      "Australian federal department responsible for transport policy, infrastructure, and aviation oversight.",
    reliabilityNote:
      "Used as the primary federal attribution for Australian national transport context.",
  },
  {
    id: "au-casa",
    name: "Civil Aviation Safety Authority",
    organization: "Civil Aviation Safety Authority",
    url: "https://www.casa.gov.au/",
    description:
      "Australian statutory authority that regulates civil aviation safety.",
    reliabilityNote:
      "Used as the primary attribution for Australian aviation authority information.",
  },
  {
    id: "au-tfnsw",
    name: "Transport for NSW",
    organization: "Transport for NSW",
    url: "https://www.transport.nsw.gov.au/",
    description:
      "Government agency responsible for transport across New South Wales, including Sydney's public transport network.",
    reliabilityNote:
      "Used as the primary attribution for Sydney and New South Wales public transport authority information.",
  },
  {
    id: "au-syd",
    name: "Sydney Airport",
    organization: "Sydney Airport Corporation",
    url: "https://www.sydneyairport.com.au/",
    description:
      "Operator of Sydney (Kingsford Smith) Airport (SYD).",
    reliabilityNote:
      "Used as the official attribution for Sydney Airport.",
  },
  {
    id: "nz-nzta",
    name: "Waka Kotahi NZ Transport Agency",
    organization: "Waka Kotahi NZ Transport Agency",
    url: "https://www.nzta.govt.nz/",
    description:
      "New Zealand crown entity responsible for land transport, roads, and licensing.",
    reliabilityNote:
      "Used as the primary attribution for New Zealand national land-transport context.",
  },
  {
    id: "nz-caa",
    name: "Civil Aviation Authority of New Zealand",
    organization: "Civil Aviation Authority of New Zealand",
    url: "https://www.aviation.govt.nz/",
    description:
      "New Zealand government agency responsible for civil aviation safety and regulation.",
    reliabilityNote:
      "Used as the primary attribution for New Zealand aviation authority information.",
  },
  {
    id: "sg-lta",
    name: "Land Transport Authority",
    organization: "Land Transport Authority, Singapore",
    url: "https://www.lta.gov.sg/",
    description:
      "Statutory board under the Singapore Ministry of Transport responsible for land transport infrastructure and policy.",
    reliabilityNote:
      "Used as the primary attribution for Singapore public-transport authority information.",
  },
  {
    id: "sg-caas",
    name: "Civil Aviation Authority of Singapore",
    organization: "Civil Aviation Authority of Singapore",
    url: "https://www.caas.gov.sg/",
    description:
      "Singapore statutory board responsible for civil aviation oversight.",
    reliabilityNote:
      "Used as the primary attribution for Singapore aviation authority information.",
  },
  {
    id: "sg-changi",
    name: "Changi Airport Group",
    organization: "Changi Airport Group",
    url: "https://www.changiairport.com/",
    description:
      "Operator of Singapore Changi Airport (SIN).",
    reliabilityNote:
      "Used as the official attribution for Singapore Changi Airport.",
  },
  {
    id: "jp-mlit",
    name: "Ministry of Land, Infrastructure, Transport and Tourism",
    organization: "Ministry of Land, Infrastructure, Transport and Tourism, Japan",
    url: "https://www.mlit.go.jp/en/",
    description:
      "Japanese ministry responsible for national policy on land, infrastructure, transport, and tourism.",
    reliabilityNote:
      "Used as the primary attribution for Japanese national transport and aviation context.",
  },
  {
    id: "jp-tokyometro",
    name: "Tokyo Metro",
    organization: "Tokyo Metro Co., Ltd.",
    url: "https://www.tokyometro.jp/en/",
    description:
      "Operator of nine of the Tokyo subway lines.",
    reliabilityNote:
      "Used as the primary attribution for Tokyo metro operator information.",
  },
  {
    id: "jp-haneda",
    name: "Haneda Airport (Tokyo International)",
    organization: "Japan Airport Terminal Co., Ltd.",
    url: "https://tokyo-haneda.com/en/",
    description:
      "Operator of Tokyo Haneda Airport (HND).",
    reliabilityNote:
      "Used as the official attribution for Tokyo Haneda Airport.",
  },
  {
    id: "jp-narita",
    name: "Narita International Airport",
    organization: "Narita International Airport Corporation",
    url: "https://www.narita-airport.jp/en",
    description:
      "Operator of Narita International Airport (NRT) serving the Greater Tokyo Area.",
    reliabilityNote:
      "Used as the official attribution for Narita International Airport.",
  },
  {
    id: "de-bmdv",
    name: "Federal Ministry for Digital and Transport",
    organization: "Bundesministerium für Digitales und Verkehr",
    url: "https://www.bmdv.bund.de/EN/",
    description:
      "German federal ministry responsible for digital infrastructure and transport policy.",
    reliabilityNote:
      "Used as the primary federal attribution for German national transport context.",
  },
  {
    id: "de-db",
    name: "Deutsche Bahn",
    organization: "Deutsche Bahn AG",
    url: "https://www.bahn.com/en",
    description:
      "German national railway company, owned by the federal government.",
    reliabilityNote:
      "Used as the primary attribution for German national rail operator information.",
  },
  {
    id: "de-bvg",
    name: "Berliner Verkehrsbetriebe",
    organization: "BVG — Berliner Verkehrsbetriebe",
    url: "https://www.bvg.de/en",
    description:
      "Berlin's main public transport company, operating U-Bahn, trams, buses, and ferries.",
    reliabilityNote:
      "Used as the primary attribution for Berlin public-transport operator information.",
  },
  {
    id: "de-ber",
    name: "Berlin Brandenburg Airport",
    organization: "Flughafen Berlin Brandenburg GmbH",
    url: "https://ber.berlin-airport.de/en.html",
    description:
      "Operator of Berlin Brandenburg Airport (BER).",
    reliabilityNote:
      "Used as the official attribution for Berlin Brandenburg Airport.",
  },
  {
    id: "fr-ecologie",
    name: "Ministère de la Transition écologique",
    organization: "Government of France",
    url: "https://www.ecologie.gouv.fr/",
    description:
      "French ministry responsible for ecological transition, transport, and infrastructure policy.",
    reliabilityNote:
      "Used as the primary federal attribution for French national transport context.",
  },
  {
    id: "fr-sncf",
    name: "SNCF",
    organization: "Société nationale des chemins de fer français",
    url: "https://www.sncf.com/en",
    description:
      "French national state-owned railway company.",
    reliabilityNote:
      "Used as the primary attribution for French national rail operator information.",
  },
  {
    id: "fr-idfm",
    name: "Île-de-France Mobilités",
    organization: "Île-de-France Mobilités",
    url: "https://www.iledefrance-mobilites.fr/en",
    description:
      "Public transport authority for the Paris and Île-de-France region.",
    reliabilityNote:
      "Used as the primary attribution for Paris public-transport authority information.",
  },
  {
    id: "fr-ratp",
    name: "RATP",
    organization: "Régie Autonome des Transports Parisiens",
    url: "https://www.ratp.fr/en",
    description:
      "Public operator of metro, RER, tram, and bus services in the Paris region.",
    reliabilityNote:
      "Used as the primary attribution for Paris metro and bus operator information.",
  },
  {
    id: "fr-paris-aeroport",
    name: "Paris Aéroport",
    organization: "Groupe ADP",
    url: "https://www.parisaeroport.fr/en",
    description:
      "Operator of Paris-Charles de Gaulle (CDG), Paris-Orly (ORY), and Paris-Le Bourget airports.",
    reliabilityNote:
      "Used as the official attribution for Paris airport information.",
  },
  {
    id: "dk-trafikstyrelsen",
    name: "Trafikstyrelsen — Danish Transport Authority",
    organization: "Danish Transport Authority",
    url: "https://www.trafikstyrelsen.dk/",
    description:
      "Danish national authority responsible for civil aviation, rail safety, and transport oversight.",
    reliabilityNote:
      "Used as the primary attribution for Danish national transport context.",
  },
  {
    id: "dk-dsb",
    name: "DSB",
    organization: "DSB — Danske Statsbaner",
    url: "https://www.dsb.dk/en",
    description:
      "Danish state-owned railway company.",
    reliabilityNote:
      "Used as the primary attribution for Danish national rail operator information.",
  },
  {
    id: "dk-metroselskabet",
    name: "Metroselskabet — Copenhagen Metro",
    organization: "Metroselskabet I/S",
    url: "https://m.dk/en/",
    description:
      "Operator of the Copenhagen Metro.",
    reliabilityNote:
      "Used as the primary attribution for Copenhagen metro operator information.",
  },
  {
    id: "dk-cph",
    name: "Copenhagen Airport",
    organization: "Københavns Lufthavne A/S",
    url: "https://www.cph.dk/en",
    description:
      "Operator of Copenhagen Airport (CPH).",
    reliabilityNote:
      "Used as the official attribution for Copenhagen Airport.",
  },
  {
    id: "nl-iw",
    name: "Ministerie van Infrastructuur en Waterstaat",
    organization: "Government of the Netherlands",
    url: "https://www.rijksoverheid.nl/ministeries/ministerie-van-infrastructuur-en-waterstaat",
    description:
      "Dutch ministry responsible for infrastructure, water management, and transport policy.",
    reliabilityNote:
      "Used as the primary federal attribution for Dutch national transport context.",
  },
  {
    id: "nl-ns",
    name: "Nederlandse Spoorwegen",
    organization: "Nederlandse Spoorwegen (NS)",
    url: "https://www.ns.nl/en",
    description:
      "Principal passenger railway operator in the Netherlands.",
    reliabilityNote:
      "Used as the primary attribution for Dutch national rail operator information.",
  },
  {
    id: "nl-gvb",
    name: "GVB — Amsterdam Public Transport",
    organization: "GVB",
    url: "https://en.gvb.nl/",
    description:
      "Amsterdam public transport operator running metro, tram, bus, and ferry services.",
    reliabilityNote:
      "Used as the primary attribution for Amsterdam public-transport operator information.",
  },
  {
    id: "nl-schiphol",
    name: "Schiphol Group — Amsterdam Airport",
    organization: "Royal Schiphol Group",
    url: "https://www.schiphol.nl/en/",
    description:
      "Operator of Amsterdam Airport Schiphol (AMS).",
    reliabilityNote:
      "Used as the official attribution for Amsterdam Schiphol Airport.",
  },
  {
    id: "uk-heathrow",
    name: "Heathrow Airport",
    organization: "Heathrow Airport Holdings",
    url: "https://www.heathrow.com/",
    description:
      "Operator of London Heathrow Airport (LHR).",
    reliabilityNote:
      "Used as the official attribution for London Heathrow Airport.",
  },
  {
    id: "world-bank-wdi",
    name: "World Development Indicators",
    organization: "World Bank",
    url: "https://data.worldbank.org/",
    description:
      "World Bank open-data programme that compiles cross-country development indicators from official statistical sources.",
    reliabilityNote:
      "Used as the primary attribution for country-level indicator values such as population, internet usage, and urban-population share.",
  },
  {
    id: "openaq",
    name: "OpenAQ open air-quality platform",
    organization: "OpenAQ",
    url: "https://openaq.org/",
    description:
      "Open-source aggregator of air-quality monitoring data sourced from government, research, and intergovernmental publishers worldwide.",
    reliabilityNote:
      "Used as a primary aggregator of station-level air-quality measurements; every record cites the underlying official publisher through OpenAQ's provider attribution. Ingestion requires the OpenAQ v3 API key (OPENAQ_API_KEY) at build time.",
  },
];

export function getSourceById(sourceId: string) {
  return dataSources.find((source) => source.id === sourceId);
}

export function getSourcesByIds(sourceIds: string[]) {
  return sourceIds
    .map((sourceId) => getSourceById(sourceId))
    .filter((source): source is DataSource => Boolean(source));
}
