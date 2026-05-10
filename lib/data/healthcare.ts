import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import type {
  HealthcareAccessProfile,
  HospitalRegistryProfile,
} from "@/types";

// All entries below cite official government, public health authority, or
// recognised national health-system publishers. Where a verified registry
// or portal is unknown, the field is intentionally omitted rather than
// guessed: pages render a transparent fallback in that case.

export const countryHealthcareProfiles: HealthcareAccessProfile[] = [
  {
    countrySlug: "united-states",
    countryCode: "US",
    healthcareSystemName:
      "Mixed public–private system; federal Medicare and state Medicaid programs alongside employer and individual insurance.",
    officialHealthPortal: {
      label: "U.S. Department of Health and Human Services",
      url: "https://www.hhs.gov/",
      sourceIds: ["us-hhs"],
    },
    publicHealthAuthority: {
      label: "Centers for Disease Control and Prevention",
      url: "https://www.cdc.gov/",
      sourceIds: ["us-hhs"],
    },
    emergencyMedicalInfo:
      "Call 911 for medical emergencies. Hospital emergency departments are required to provide stabilising care under federal law (EMTALA).",
    insuranceOrAccessNote:
      "Healthcare access depends on insurance coverage. Federal information on coverage options is published at HealthCare.gov.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["us-hhs"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "united-kingdom",
    countryCode: "GB",
    healthcareSystemName:
      "Publicly funded National Health Service (NHS), free at the point of use for residents.",
    officialHealthPortal: {
      label: "National Health Service (NHS)",
      url: "https://www.nhs.uk/",
      sourceIds: ["uk-nhs"],
    },
    publicHealthAuthority: {
      label: "NHS service finder",
      url: "https://www.nhs.uk/service-search/",
      sourceIds: ["uk-nhs"],
    },
    emergencyMedicalInfo:
      "Call 999 for medical emergencies. NHS 111 provides non-emergency medical advice in England, Scotland, and Wales.",
    insuranceOrAccessNote:
      "Most NHS services are free at the point of use for residents; visitors should consult NHS guidance on charges.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["uk-nhs"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "canada",
    countryCode: "CA",
    healthcareSystemName:
      "Publicly funded Medicare delivered by provincial and territorial health insurance plans.",
    officialHealthPortal: {
      label: "Health Canada",
      url: "https://www.canada.ca/en/health-canada.html",
      sourceIds: ["ca-health"],
    },
    publicHealthAuthority: {
      label: "Canadian Institute for Health Information",
      url: "https://www.cihi.ca/en",
      sourceIds: ["ca-cihi"],
    },
    emergencyMedicalInfo:
      "Call 911 for medical emergencies in most regions. Hospital emergency departments provide acute care; provincial health insurance covers medically necessary services for residents.",
    insuranceOrAccessNote:
      "Coverage and access vary by province or territory. Each province publishes its own health insurance information.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["ca-health", "ca-cihi"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "australia",
    countryCode: "AU",
    healthcareSystemName:
      "Publicly funded Medicare alongside private health insurance and a hospital system jointly operated by federal and state governments.",
    officialHealthPortal: {
      label: "Department of Health and Aged Care",
      url: "https://www.health.gov.au/",
      sourceIds: ["au-health"],
    },
    publicHealthAuthority: {
      label: "healthdirect — national health information service",
      url: "https://www.healthdirect.gov.au/",
      sourceIds: ["au-health"],
    },
    emergencyMedicalInfo:
      "Call 000 for medical emergencies. Public hospital emergency departments provide acute care.",
    insuranceOrAccessNote:
      "Medicare provides subsidised access to many services for eligible residents; private insurance covers additional services.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["au-health", "au-aihw"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "new-zealand",
    countryCode: "NZ",
    healthcareSystemName:
      "Publicly funded health system delivered nationally by Te Whatu Ora — Health New Zealand.",
    officialHealthPortal: {
      label: "Te Whatu Ora — Health New Zealand",
      url: "https://www.tewhatuora.govt.nz/",
      sourceIds: ["nz-tewhatuora"],
    },
    emergencyMedicalInfo:
      "Call 111 for medical emergencies. Healthline (0800 611 116) provides non-emergency health advice from registered nurses.",
    insuranceOrAccessNote:
      "Many publicly funded services are free or low-cost for eligible residents and certain visa categories.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["nz-tewhatuora"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "singapore",
    countryCode: "SG",
    healthcareSystemName:
      "Mixed public and private system regulated by the Ministry of Health, with subsidised public hospitals and a national medical savings scheme (MediSave).",
    officialHealthPortal: {
      label: "Ministry of Health, Singapore",
      url: "https://www.moh.gov.sg/",
      sourceIds: ["sg-moh"],
    },
    emergencyMedicalInfo:
      "Call 995 for ambulance and fire emergencies (Singapore Civil Defence Force). Public hospitals operate 24-hour emergency departments.",
    insuranceOrAccessNote:
      "Subsidies for citizens and permanent residents differ from charges for non-residents. Refer to MOH for current eligibility and fee information.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["sg-moh", "sg-moh-hospitals"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "japan",
    countryCode: "JP",
    healthcareSystemName:
      "Universal statutory health insurance system overseen by the Ministry of Health, Labour and Welfare.",
    officialHealthPortal: {
      label: "Ministry of Health, Labour and Welfare",
      url: "https://www.mhlw.go.jp/english/",
      sourceIds: ["jp-mhlw"],
    },
    emergencyMedicalInfo:
      "Call 119 for ambulance and fire services. Hospital availability and language support vary by city; municipal portals publish local information.",
    insuranceOrAccessNote:
      "Residents are required to enrol in statutory health insurance; visitors typically pay out-of-pocket and seek reimbursement through travel insurance.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["jp-mhlw"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "germany",
    countryCode: "DE",
    healthcareSystemName:
      "Statutory health insurance system (Gesetzliche Krankenversicherung) supplemented by private insurance, overseen federally and at the Länder level.",
    officialHealthPortal: {
      label: "Federal Ministry of Health (Bundesministerium für Gesundheit)",
      url: "https://www.bundesgesundheitsministerium.de/en/",
      sourceIds: ["de-bmg"],
    },
    emergencyMedicalInfo:
      "Call 112 for medical emergencies and the fire service. The non-emergency on-call medical service is reachable on 116 117 in many regions.",
    insuranceOrAccessNote:
      "Most residents are covered by statutory health insurance. The Federal Ministry of Health publishes guidance for residents and visitors.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["de-bmg"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "france",
    countryCode: "FR",
    healthcareSystemName:
      "Statutory health insurance system (Assurance Maladie) covering residents, with public and private healthcare providers.",
    officialHealthPortal: {
      label: "Ministère de la Santé et de la Prévention",
      url: "https://sante.gouv.fr/",
      sourceIds: ["fr-sante"],
    },
    emergencyMedicalInfo:
      "Call 15 for SAMU (medical) or 112 for the European emergency number. Hospital emergency services (urgences) are available in public hospitals.",
    insuranceOrAccessNote:
      "Most residents are covered by statutory health insurance. Visitor coverage depends on EHIC, GHIC, or private travel insurance.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["fr-sante"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "denmark",
    countryCode: "DK",
    healthcareSystemName:
      "Tax-funded universal health service administered by the regions, with primary care delivered by general practitioners.",
    officialHealthPortal: {
      label: "Danish Health Authority (Sundhedsstyrelsen)",
      url: "https://www.sst.dk/en",
      sourceIds: ["dk-sst"],
    },
    emergencyMedicalInfo:
      "Call 112 for medical emergencies. Out-of-hours medical services vary by region and are coordinated through regional health authorities.",
    insuranceOrAccessNote:
      "Most services are free at the point of use for registered residents. Visitor coverage depends on EHIC or private insurance.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["dk-sst"],
    verificationStatus: "verified",
  },
  {
    countrySlug: "netherlands",
    countryCode: "NL",
    healthcareSystemName:
      "Statutory private health insurance system regulated by national law, with primary care delivered by huisartsen (GPs).",
    officialHealthPortal: {
      label: "RIVM — National Institute for Public Health and the Environment",
      url: "https://www.rivm.nl/en",
      sourceIds: ["nl-rivm"],
    },
    emergencyMedicalInfo:
      "Call 112 for medical emergencies. The huisartsenpost (out-of-hours GP service) handles urgent non-emergency care.",
    insuranceOrAccessNote:
      "Residents are required to hold basic health insurance; visitors use EHIC, GHIC, or private travel insurance.",
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    sourceIds: ["nl-rivm"],
    verificationStatus: "verified",
  },
];

export const hospitalRegistryProfiles: HospitalRegistryProfile[] = [
  {
    countrySlug: "united-states",
    registryName: "Medicare Care Compare",
    registryUrl: "https://www.medicare.gov/care-compare/",
    registryDescription:
      "Federal directory for comparing Medicare-certified hospitals, nursing homes, and other care providers.",
    sourceIds: ["us-cms-care-compare"],
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    verificationStatus: "verified",
  },
  {
    countrySlug: "united-kingdom",
    registryName: "Find a hospital — NHS",
    registryUrl: "https://www.nhs.uk/service-search/find-a-hospital",
    registryDescription:
      "NHS England service finder for locating hospitals and other NHS services by postcode.",
    sourceIds: ["uk-nhs-find-hospital"],
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    verificationStatus: "verified",
  },
  {
    countrySlug: "australia",
    registryName: "MyHospitals — Australian Institute of Health and Welfare",
    registryUrl: "https://www.aihw.gov.au/reports-data/myhospitals",
    registryDescription:
      "Official Australian Government statistical agency portal with hospital information across the country.",
    sourceIds: ["au-aihw"],
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    verificationStatus: "verified",
  },
  {
    countrySlug: "singapore",
    registryName: "Hospital Services — Ministry of Health",
    registryUrl:
      "https://www.moh.gov.sg/home/our-healthcare-system/healthcare-services-and-facilities/hospitals",
    registryDescription:
      "Ministry of Health overview of Singapore's public and private hospital services.",
    sourceIds: ["sg-moh-hospitals"],
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    verificationStatus: "verified",
  },
  {
    countrySlug: "canada",
    registryName: "Canadian Institute for Health Information",
    registryUrl: "https://www.cihi.ca/en",
    registryDescription:
      "National source of comparable Canadian health-system data and analysis recognised by federal and provincial governments.",
    sourceIds: ["ca-cihi"],
    lastVerified: LAST_UPDATED,
    dataYear: DATA_YEAR,
    verificationStatus: "verified",
  },
];
