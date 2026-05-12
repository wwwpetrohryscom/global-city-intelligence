import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import type { CountryTransportProfile } from "@/types";

// All entries below cite official transport ministries, national operators,
// or government aviation/safety publishers. Where a verified portal is
// unknown, the field is intentionally omitted rather than guessed: pages
// render a transparent fallback in that case.

export const countryTransportProfiles: CountryTransportProfile[] = [
  {
    countrySlug: "united-states",
    countryCode: "US",
    nationalTransportAuthority: {
      label: "U.S. Department of Transportation",
      url: "https://www.transportation.gov/",
      sourceIds: ["us-dot"],
    },
    aviationAuthority: {
      label: "Federal Aviation Administration",
      url: "https://www.faa.gov/",
      sourceIds: ["us-faa"],
    },
    railAuthority: {
      label: "Federal Railroad Administration",
      url: "https://railroads.dot.gov/",
      sourceIds: ["us-fra"],
    },
    publicTransportOverview:
      "Public transport in the United States is organised regionally, with transit authorities operating in each metropolitan area. National policy and safety oversight are coordinated by the U.S. Department of Transportation.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["us-dot", "us-faa", "us-fra"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "united-kingdom",
    countryCode: "GB",
    nationalTransportAuthority: {
      label: "Department for Transport",
      url: "https://www.gov.uk/government/organisations/department-for-transport",
      sourceIds: ["uk-dft"],
    },
    aviationAuthority: {
      label: "UK Civil Aviation Authority",
      url: "https://www.caa.co.uk/",
      sourceIds: ["uk-caa"],
    },
    railAuthority: {
      label: "Network Rail",
      url: "https://www.networkrail.co.uk/",
      sourceIds: ["uk-networkrail"],
    },
    publicTransportOverview:
      "The Department for Transport sets national policy; rail infrastructure is operated by Network Rail with multiple passenger operators, and major metropolitan areas have dedicated transport authorities such as Transport for London.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["uk-dft", "uk-caa", "uk-networkrail"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "canada",
    countryCode: "CA",
    nationalTransportAuthority: {
      label: "Transport Canada",
      url: "https://tc.canada.ca/en",
      sourceIds: ["ca-tc"],
    },
    railAuthority: {
      label: "VIA Rail Canada",
      url: "https://www.viarail.ca/",
      sourceIds: ["ca-via"],
    },
    publicTransportOverview:
      "Transport Canada sets federal transport policy and safety standards. Intercity passenger rail is operated by VIA Rail; urban transit is delivered by provincial and municipal authorities.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["ca-tc", "ca-via"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "australia",
    countryCode: "AU",
    nationalTransportAuthority: {
      label: "Department of Infrastructure, Transport, Regional Development",
      url: "https://www.infrastructure.gov.au/",
      sourceIds: ["au-infrastructure"],
    },
    aviationAuthority: {
      label: "Civil Aviation Safety Authority",
      url: "https://www.casa.gov.au/",
      sourceIds: ["au-casa"],
    },
    publicTransportOverview:
      "Federal policy is set by the Department of Infrastructure, Transport, Regional Development; aviation safety is overseen by CASA. Urban and regional public transport is delivered by state government authorities.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["au-infrastructure", "au-casa"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "new-zealand",
    countryCode: "NZ",
    nationalTransportAuthority: {
      label: "Waka Kotahi NZ Transport Agency",
      url: "https://www.nzta.govt.nz/",
      sourceIds: ["nz-nzta"],
    },
    aviationAuthority: {
      label: "Civil Aviation Authority of New Zealand",
      url: "https://www.aviation.govt.nz/",
      sourceIds: ["nz-caa"],
    },
    publicTransportOverview:
      "Waka Kotahi NZ Transport Agency leads national land-transport planning and safety. Civil aviation safety is overseen by the Civil Aviation Authority of New Zealand.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["nz-nzta", "nz-caa"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "singapore",
    countryCode: "SG",
    nationalTransportAuthority: {
      label: "Land Transport Authority",
      url: "https://www.lta.gov.sg/",
      sourceIds: ["sg-lta"],
    },
    aviationAuthority: {
      label: "Civil Aviation Authority of Singapore",
      url: "https://www.caas.gov.sg/",
      sourceIds: ["sg-caas"],
    },
    publicTransportOverview:
      "Singapore's land transport is planned and regulated by the Land Transport Authority. Civil aviation is overseen by the Civil Aviation Authority of Singapore.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["sg-lta", "sg-caas"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "japan",
    countryCode: "JP",
    nationalTransportAuthority: {
      label: "Ministry of Land, Infrastructure, Transport and Tourism",
      url: "https://www.mlit.go.jp/en/",
      sourceIds: ["jp-mlit"],
    },
    publicTransportOverview:
      "Japan's transport policy is set by the Ministry of Land, Infrastructure, Transport and Tourism (MLIT). Major cities are served by multiple rail and metro operators coordinated by local and prefectural authorities.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["jp-mlit"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "germany",
    countryCode: "DE",
    nationalTransportAuthority: {
      label: "Federal Ministry for Digital and Transport (BMDV)",
      url: "https://www.bmdv.bund.de/EN/",
      sourceIds: ["de-bmdv"],
    },
    railAuthority: {
      label: "Deutsche Bahn",
      url: "https://www.bahn.com/en",
      sourceIds: ["de-db"],
    },
    publicTransportOverview:
      "National transport policy is led by the Federal Ministry for Digital and Transport (BMDV). Long-distance rail is operated by Deutsche Bahn; urban transport is delivered by regional and municipal operators.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["de-bmdv", "de-db"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "france",
    countryCode: "FR",
    nationalTransportAuthority: {
      label: "Ministère de la Transition écologique",
      url: "https://www.ecologie.gouv.fr/",
      sourceIds: ["fr-ecologie"],
    },
    railAuthority: {
      label: "SNCF",
      url: "https://www.sncf.com/en",
      sourceIds: ["fr-sncf"],
    },
    publicTransportOverview:
      "Transport policy sits with the Ministry of Ecological Transition. National passenger rail is operated by SNCF; the Île-de-France region is served by Île-de-France Mobilités and RATP.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["fr-ecologie", "fr-sncf"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "denmark",
    countryCode: "DK",
    nationalTransportAuthority: {
      label: "Trafikstyrelsen — Danish Transport Authority",
      url: "https://www.trafikstyrelsen.dk/",
      sourceIds: ["dk-trafikstyrelsen"],
    },
    railAuthority: {
      label: "DSB",
      url: "https://www.dsb.dk/en",
      sourceIds: ["dk-dsb"],
    },
    publicTransportOverview:
      "The Danish Transport Authority oversees civil aviation, rail safety, and transport regulation. Intercity rail is operated by DSB.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["dk-trafikstyrelsen", "dk-dsb"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "netherlands",
    countryCode: "NL",
    nationalTransportAuthority: {
      label: "Ministerie van Infrastructuur en Waterstaat",
      url: "https://www.rijksoverheid.nl/ministeries/ministerie-van-infrastructuur-en-waterstaat",
      sourceIds: ["nl-iw"],
    },
    railAuthority: {
      label: "Nederlandse Spoorwegen (NS)",
      url: "https://www.ns.nl/en",
      sourceIds: ["nl-ns"],
    },
    publicTransportOverview:
      "National transport policy is led by the Ministry of Infrastructure and Water Management. Principal passenger rail is operated by Nederlandse Spoorwegen (NS).",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["nl-iw", "nl-ns"],
    verificationStatus: "verified",
  },
];
