import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import type {
  City,
  CityModuleData,
  CityScores,
  DataTableRow,
  Metric,
  ModuleSlug,
} from "@/types";

interface ModuleFact {
  label: string;
  value: string;
  unit?: string;
  description: string;
  context: string;
}

interface CityModuleSeed {
  score: number;
  summary: string;
  explanation: string;
  sources: string[];
  facts: ModuleFact[];
}

interface CitySeed {
  slug: string;
  name: string;
  countrySlug: string;
  countryName: string;
  region: string;
  population: string;
  intro: string;
  outlook: string;
  sources: string[];
  scores: CityScores;
  metrics: Metric[];
  modules: Record<ModuleSlug, CityModuleSeed>;
  relatedCitySlugs?: string[];
}

function buildModule(
  moduleSlug: ModuleSlug,
  seed: CityModuleSeed,
): CityModuleData {
  const metrics: Metric[] = seed.facts.map((fact) => ({
    label: fact.label,
    value: fact.value,
    unit: fact.unit,
    description: fact.description,
  }));
  const table: DataTableRow[] = seed.facts.map((fact) => ({
    metric: fact.label,
    value: fact.unit ? `${fact.value}${fact.unit}` : fact.value,
    context: fact.context,
  }));

  return {
    moduleSlug,
    score: seed.score,
    summary: seed.summary,
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    sources: seed.sources,
    metrics,
    table,
    explanation: seed.explanation,
  };
}

interface NeutralCitySpec {
  slug: string;
  name: string;
  countrySlug: string;
  countryName: string;
  region: string;
  population: string;
  intro: string;
  outlook: string;
  scores: CityScores;
  relatedCitySlugs?: string[];
  /**
   * Optional source-id override. When omitted, a regional source mix
   * is picked based on the city's region so every record cites at
   * least one existing entry in the central source registry.
   */
  sources?: string[];
}

const REGIONAL_SOURCE_DEFAULTS: { match: (region: string) => boolean; sources: string[] }[] = [
  {
    match: (region) =>
      /Europe|Baltic|Nordic|Scandinavia/i.test(region) || /EU$/.test(region),
    sources: ["un-habitat", "eea-air", "nasa-power", "ipcc-urban"],
  },
  {
    match: (region) => /North America/i.test(region),
    sources: ["un-habitat", "epa-naaqs", "nasa-power", "ipcc-urban"],
  },
  {
    match: (region) => /Latin America|Caribbean|Central America|South America/i.test(region),
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban"],
  },
  {
    match: (region) => /Middle East|Gulf|Levant/i.test(region),
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban"],
  },
  {
    match: (region) => /Africa/i.test(region),
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban"],
  },
  {
    match: (region) => /Asia|Pacific|Oceania/i.test(region),
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban"],
  },
];

function resolveDefaultSources(region: string): string[] {
  const match = REGIONAL_SOURCE_DEFAULTS.find((entry) => entry.match(region));
  return match ? match.sources : ["un-habitat", "nasa-power", "ipcc-urban"];
}

const MODULE_EXPLANATIONS: Record<ModuleSlug, string> = {
  "cost-of-living":
    "Cost-of-living scoring treats affordability as more than headline prices: essential spending, mobility dependence, and service access shape the directional indicator.",
  "air-quality":
    "Air-quality scoring prioritises human health. PM2.5, PM10, nitrogen dioxide, and ozone are interpreted against WHO guidance and regional monitoring context.",
  energy:
    "Energy pages combine renewable-resource context, infrastructure maturity, and adaptation capacity into a directional readiness signal.",
  safety:
    "Safety scoring blends violent-crime context, perceived safety, and institutional response capacity. Verified country emergency profiles attach where available.",
  "internet-speed":
    "Internet-speed scoring weighs fixed broadband, mobile network performance, latency, and digital-readiness context for households and remote workers.",
  "climate-risk":
    "Climate-risk scoring combines hazard exposure with adaptation capacity. Cities with active resilience programmes reduce expected loss even where exposure is meaningful.",
};

const NEUTRAL_MODULE_FACTS: Record<ModuleSlug, ModuleFact[]> = {
  "cost-of-living": [
    {
      label: "Affordability framing",
      value: "Directional indicator",
      description:
        "Cost categories include rent, essentials, mobility, and service access; the city-level score is a directional orientation, not a verified measurement.",
      context:
        "Use this section as context, not an official cost measurement.",
    },
    {
      label: "Methodology context",
      value: "Structured benchmark context",
      description:
        "The platform interprets cost framing through published reference benchmarks rather than a single index value.",
      context:
        "See the methodology page for how the directional score is constructed.",
    },
    {
      label: "Verified local dataset",
      value: "Pending integration",
      description:
        "Source-attributed cost values appear once the platform integrates verified data for this city.",
      context: "Transparent fallback is shown until then.",
    },
  ],
  "air-quality": [
    {
      label: "Pollutant focus",
      value: "PM2.5, PM10, NO₂, O₃",
      description:
        "Health-oriented pollutants are interpreted against WHO and regional reference benchmarks.",
      context:
        "Use this section as context, not an official measurement.",
    },
    {
      label: "Monitoring framing",
      value: "Structured benchmark context",
      description:
        "Air-quality framing references WHO guidance and regional monitoring practice rather than a single index value.",
      context:
        "Verified monitoring values appear in the dedicated air-quality dataset section once integrated.",
    },
    {
      label: "Verified local dataset",
      value: "Pending integration",
      description:
        "Source-backed metrics will appear when the platform integrates verified city-level measurements.",
      context: "Transparent fallback is shown until then.",
    },
  ],
  energy: [
    {
      label: "Transition framing",
      value: "Directional indicator",
      description:
        "Energy framing combines national policy context, infrastructure maturity, and adaptation capacity into a directional readiness signal.",
      context:
        "Use this section as context, not an official measurement.",
    },
    {
      label: "Resource context",
      value: "Structured benchmark context",
      description:
        "Renewable-resource availability is interpreted against published references rather than a single index value.",
      context:
        "See the methodology page for how the directional score is constructed.",
    },
    {
      label: "Verified local dataset",
      value: "Pending integration",
      description:
        "Source-backed energy metrics will appear when the platform integrates verified city-level data.",
      context: "Transparent fallback is shown until then.",
    },
  ],
  safety: [
    {
      label: "Safety framing",
      value: "Directional indicator",
      description:
        "Safety framing blends violent-crime context, resident perception, and institutional response capacity into a directional orientation.",
      context:
        "Use this section as context, not an official measurement.",
    },
    {
      label: "Verified utility layer",
      value: "See country emergency profile",
      description:
        "Verified country-level emergency contacts attach via the country hub where official publishers have been integrated.",
      context:
        "Where no verified profile exists, the platform shows a transparent fallback rather than guessed values.",
    },
    {
      label: "Verified local dataset",
      value: "Pending integration",
      description:
        "Source-backed safety metrics will appear when the platform integrates verified city-level data.",
      context: "Transparent fallback is shown until then.",
    },
  ],
  "internet-speed": [
    {
      label: "Connectivity framing",
      value: "Directional indicator",
      description:
        "Connectivity framing combines national digital-readiness context with widely cited fixed and mobile reference benchmarks.",
      context:
        "Use this section as context, not an official measurement.",
    },
    {
      label: "Coverage context",
      value: "Structured benchmark context",
      description:
        "Fixed and mobile coverage are interpreted against published references rather than a single household-level measurement.",
      context:
        "See the methodology page for how the directional score is constructed.",
    },
    {
      label: "Verified local dataset",
      value: "Pending integration",
      description:
        "Source-backed connectivity metrics will appear when the platform integrates verified city-level data.",
      context: "Transparent fallback is shown until then.",
    },
  ],
  "climate-risk": [
    {
      label: "Hazard framing",
      value: "Directional indicator",
      description:
        "Climate-risk framing combines regional hazard categories (heat, water, coastal, seismic) with national adaptation capacity.",
      context:
        "Use this section as context, not an official measurement.",
    },
    {
      label: "Adaptation context",
      value: "Structured benchmark context",
      description:
        "Adaptation capacity is interpreted against published references rather than a single risk-index value.",
      context:
        "See the methodology page for how the directional score is constructed.",
    },
    {
      label: "Verified local dataset",
      value: "Pending integration",
      description:
        "Source-backed climate-risk metrics will appear when the platform integrates verified city-level data.",
      context: "Transparent fallback is shown until then.",
    },
  ],
};

function neutralModuleSeed(
  moduleSlug: ModuleSlug,
  cityName: string,
  score: number,
  sources: string[],
): CityModuleSeed {
  const summaries: Record<ModuleSlug, string> = {
    "cost-of-living": `${cityName}'s cost-of-living profile is a directional indicator pending integration of verified city-level data; structured benchmark context applies.`,
    "air-quality": `${cityName}'s air-quality profile is a directional indicator framed against WHO and regional benchmarks; verified city-level measurements appear in the dedicated air-quality dataset section once integrated.`,
    energy: `${cityName}'s energy-readiness profile is a directional indicator that combines national policy framing with city-level adaptation context.`,
    safety: `${cityName}'s safety profile is a directional indicator; verified country-level emergency profiles attach via the country hub where available.`,
    "internet-speed": `${cityName}'s connectivity profile is a directional indicator combining national digital-readiness context with widely cited speed-test references.`,
    "climate-risk": `${cityName}'s climate-risk profile is a directional indicator combining regional hazard categories with national adaptation capacity.`,
  };
  return {
    score,
    summary: summaries[moduleSlug],
    explanation: MODULE_EXPLANATIONS[moduleSlug],
    sources,
    facts: NEUTRAL_MODULE_FACTS[moduleSlug],
  };
}

function buildNeutralCitySeed(spec: NeutralCitySpec): CitySeed {
  const sources = spec.sources ?? resolveDefaultSources(spec.region);
  const scoreFor: Record<ModuleSlug, number> = {
    "cost-of-living": spec.scores.affordability,
    "air-quality": spec.scores.airQuality,
    energy: spec.scores.energy,
    safety: Math.round(
      (spec.scores.resilience + spec.scores.overall) / 2,
    ),
    "internet-speed": Math.round(
      (spec.scores.overall + spec.scores.energy) / 2,
    ),
    "climate-risk": spec.scores.resilience,
  };
  const moduleSlugs: ModuleSlug[] = [
    "cost-of-living",
    "air-quality",
    "energy",
    "safety",
    "internet-speed",
    "climate-risk",
  ];
  const modules = Object.fromEntries(
    moduleSlugs.map((moduleSlug) => [
      moduleSlug,
      neutralModuleSeed(moduleSlug, spec.name, scoreFor[moduleSlug], sources),
    ]),
  ) as Record<ModuleSlug, CityModuleSeed>;

  return {
    slug: spec.slug,
    name: spec.name,
    countrySlug: spec.countrySlug,
    countryName: spec.countryName,
    region: spec.region,
    population: spec.population,
    intro: spec.intro,
    outlook: spec.outlook,
    sources,
    scores: spec.scores,
    metrics: [
      {
        label: "Overall city intelligence",
        value: String(spec.scores.overall),
        unit: "/100",
        score: spec.scores.overall,
        description:
          "Composite directional score across affordability, air quality, clean energy, and resilience.",
      },
      {
        label: "Data confidence",
        value: "Directional",
        description:
          "Directional indicators pending integration of verified city-level data.",
      },
      {
        label: "Verified utility layers",
        value: "See country hub",
        description:
          "Emergency, healthcare, and transport verification status appears on the country hub.",
      },
    ],
    modules,
    relatedCitySlugs: spec.relatedCitySlugs,
  };
}

function buildCity(seed: CitySeed): City {
  const modules = Object.fromEntries(
    (Object.keys(seed.modules) as ModuleSlug[]).map((slug) => [
      slug,
      buildModule(slug, seed.modules[slug]),
    ]),
  ) as Record<ModuleSlug, CityModuleData>;

  return {
    slug: seed.slug,
    name: seed.name,
    countrySlug: seed.countrySlug,
    countryName: seed.countryName,
    region: seed.region,
    population: seed.population,
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    intro: seed.intro,
    outlook: seed.outlook,
    sources: seed.sources,
    scores: seed.scores,
    metrics: seed.metrics,
    modules,
    relatedCitySlugs: seed.relatedCitySlugs,
  };
}

const seeds: CitySeed[] = [
  {
    slug: "copenhagen",
    name: "Copenhagen",
    countrySlug: "denmark",
    countryName: "Denmark",
    region: "Northern Europe",
    population: "1.4M metro",
    intro:
      "Copenhagen combines high public-service quality, strong cycling infrastructure, and mature clean-energy policy into one of the healthiest urban profiles in the index.",
    outlook:
      "The city is best explored as a climate-forward, high-trust urban system where higher costs are balanced by safety, mobility, and environmental quality.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 91, affordability: 66, airQuality: 88, energy: 94, resilience: 92 },
    metrics: [
      { label: "Overall city intelligence", value: "91", unit: "/100", score: 91, description: "Composite score across affordability, air quality, clean energy, and resilience." },
      { label: "Mobility confidence", value: "Very high", description: "Compact form and cycling-oriented design reduce household transport dependency." },
      { label: "Climate readiness", value: "Advanced", description: "Policy continuity and district energy systems support long-run transition capacity." },
    ],
    relatedCitySlugs: ["berlin", "paris", "london"],
    modules: {
      "cost-of-living": {
        score: 66,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Copenhagen is expensive in rent and services, but strong public infrastructure reduces some hidden mobility and health costs.",
        explanation:
          "The cost-of-living model treats affordability as more than price. It weighs essential spending, mobility dependence, service access, and the stability of daily life.",
        facts: [
          { label: "Affordability score", value: "66", unit: "/100", description: "Moderate affordability after balancing high prices against public-service quality.", context: "Useful but constrained by housing and services costs." },
          { label: "Housing pressure", value: "High", description: "Central demand and limited supply create pressure for new residents.", context: "Central neighborhoods remain competitive for renters." },
          { label: "Transport cost offset", value: "Strong", description: "Cycling and public transport reduce dependence on private vehicle ownership.", context: "Bike and transit access can reduce recurring household costs." },
        ],
      },
      "air-quality": {
        score: 88,
        sources: ["who-air", "eea-air"],
        summary:
          "Copenhagen performs well on clean-air context, helped by compact mobility, regional monitoring, and strong European air-quality governance.",
        explanation:
          "Air-quality scoring prioritizes human health. PM2.5, PM10, nitrogen dioxide, and ozone are interpreted against WHO guidance and regional monitoring context.",
        facts: [
          { label: "Clean-air score", value: "88", unit: "/100", description: "High score relative to health-oriented pollutant benchmarks.", context: "Strong performance against health-oriented benchmarks." },
          { label: "Primary pollutant watch", value: "Regional PM2.5", description: "Fine particulates remain the core health benchmark to monitor.", context: "Fine particles are weighted because of long-term health evidence." },
          { label: "Monitoring confidence", value: "High", description: "European standards and monitoring support transparent improvement.", context: "European monitoring context improves comparability." },
        ],
      },
      energy: {
        score: 94,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Copenhagen has a mature energy-transition profile, with district energy experience and strong climate-adaptation planning.",
        explanation:
          "Energy pages combine renewable-resource context, infrastructure maturity, and adaptation capacity. Solar potential is useful, but resilience and implementation capacity carry more weight.",
        facts: [
          { label: "Energy readiness", value: "94", unit: "/100", description: "Very strong transition score across policy, infrastructure, and resilience context.", context: "Transition planning and infrastructure depth are major strengths." },
          { label: "Grid adaptation", value: "Advanced", description: "District systems and planning capacity reduce transition friction.", context: "Climate planning and infrastructure governance improve resilience." },
          { label: "Renewable opportunity", value: "Balanced", description: "Solar potential is moderate; wind and district energy carry the transition.", context: "Solar is moderate; district energy and wind context matter." },
        ],
      },
      safety: {
        score: 92,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Copenhagen scores high on safety due to strong public trust, low violent-crime context, and reliable institutional response.",
        explanation:
          "Safety scoring blends violent-crime context, perceived safety, and institutional response capacity. Trust and reliability raise the score even where opportunistic risks exist.",
        facts: [
          { label: "Safety score", value: "92", unit: "/100", description: "High trust and low violent-crime context support resident safety.", context: "Stable institutional response reinforces the score." },
          { label: "Resident perception", value: "Very high", description: "Day-to-day safety perception is strong across most neighborhoods.", context: "Pedestrian and night-time safety are widely positive." },
          { label: "Watch item", value: "Bike theft", description: "Property-related opportunistic risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 90,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Copenhagen delivers fast fiber broadband and reliable mobile coverage, supporting remote work and digital services.",
        explanation:
          "Internet speed scoring weighs fixed broadband, mobile network performance, latency, and digital-readiness context for households and remote workers.",
        facts: [
          { label: "Fixed broadband median", value: "230", unit: " Mbps", description: "Median fixed broadband performance supports remote workflows.", context: "Strong for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "165", unit: " Mbps", description: "Mobile network performance is fast and consistent.", context: "Useful for hybrid work and on-the-go productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad across the metro." },
        ],
      },
      "climate-risk": {
        score: 78,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Copenhagen carries moderate climate risk centered on coastal flooding and heavy-rain stormwater pressure, with strong adaptation planning.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity. Cities with active resilience programs can reduce expected loss even when exposure is meaningful.",
        facts: [
          { label: "Primary hazard", value: "Coastal flood", description: "Sea-level rise and storm surge are the main long-run pressures.", context: "Active climate-adaptation plans target this risk directly." },
          { label: "Heat exposure", value: "Low", description: "Northern-Europe context limits sustained heat-stress impact.", context: "Heat is a smaller driver than for southern peers." },
          { label: "Adaptation capacity", value: "Strong", description: "Stormwater redesign and policy continuity improve resilience.", context: "Public-realm investments are a key adaptation lever." },
        ],
      },
    },
  },
  {
    slug: "new-york",
    name: "New York",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "19.6M metro",
    intro:
      "New York is a dense global city with exceptional opportunity, high housing pressure, improving climate planning, and strong cultural and economic depth.",
    outlook:
      "The city is most useful for users comparing opportunity against cost, commute intensity, air-quality exposure, and infrastructure resilience.",
    sources: ["un-habitat", "who-air", "nasa-power", "epa-naaqs", "ipcc-urban"],
    scores: { overall: 84, affordability: 49, airQuality: 72, energy: 82, resilience: 87 },
    metrics: [
      { label: "Overall city intelligence", value: "84", unit: "/100", score: 84, description: "High opportunity and resilience offset by affordability pressure." },
      { label: "Opportunity density", value: "Exceptional", description: "Deep labor markets, universities, healthcare, culture, and transit networks create unusually broad opportunity." },
      { label: "Cost pressure", value: "Very high", description: "Housing and essential services are the main drag on resident well-being." },
    ],
    relatedCitySlugs: ["toronto", "london", "tokyo"],
    modules: {
      "cost-of-living": {
        score: 49,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "New York offers exceptional access to work and services, but housing costs place heavy pressure on household resilience.",
        explanation:
          "The model penalizes cities where essential housing costs can overwhelm the benefits of access. New York still scores well on opportunity, but the affordability risk is real.",
        facts: [
          { label: "Affordability score", value: "49", unit: "/100", description: "Lower score because housing demand and services costs are structurally high.", context: "High wages help, but housing costs dominate the model." },
          { label: "Housing pressure", value: "Very high", description: "Rent and ownership constraints dominate the resident cost profile.", context: "Demand is persistent across central and transit-rich neighborhoods." },
          { label: "Opportunity offset", value: "High", description: "Income potential and public transit partially offset higher costs.", context: "Transit reach can reduce vehicle dependence for many households." },
        ],
      },
      "air-quality": {
        score: 72,
        sources: ["who-air", "epa-naaqs"],
        summary:
          "New York has extensive monitoring and policy capacity, but particulate and ozone exposure remain important health signals.",
        explanation:
          "Air-quality scoring prioritizes exposure that can affect respiratory and cardiovascular health. High monitoring confidence does not automatically mean low exposure.",
        facts: [
          { label: "Clean-air score", value: "72", unit: "/100", description: "Moderate-to-strong score with ongoing pollutant exposure concerns.", context: "Better than many large metros, but not low-risk." },
          { label: "Primary pollutant watch", value: "PM2.5 and ozone", description: "Fine particulate matter and ozone are weighted for health relevance.", context: "Health-based benchmarks keep these pollutants central." },
          { label: "Monitoring confidence", value: "High", description: "US regulatory monitoring improves trend visibility and accountability.", context: "EPA standards and reporting create a strong evidence base." },
        ],
      },
      energy: {
        score: 82,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "New York has serious clean-energy ambition and infrastructure complexity, with resilience shaped by coastal risk and dense demand.",
        explanation:
          "The energy score treats climate adaptation, grid capacity, and building efficiency as connected. Dense cities can transition quickly, but only with coordinated infrastructure work.",
        facts: [
          { label: "Energy readiness", value: "82", unit: "/100", description: "Strong planning context with major grid and building-retrofit challenges.", context: "Policy capacity is strong, but infrastructure complexity is high." },
          { label: "Climate stressor", value: "Coastal flooding and heat", description: "Flooding, heat, and storm exposure are central adaptation signals.", context: "Resilience is inseparable from energy planning." },
          { label: "Solar opportunity", value: "Useful", description: "Rooftop and distributed energy help but do not solve peak demand alone.", context: "Distributed energy supplements grid-scale strategy." },
        ],
      },
      safety: {
        score: 74,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "New York is mid-pack on safety: violent-crime context has improved over decades but property and incident pressure remain present in dense areas.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Dense, high-throughput cities tend to have wider variation than the average suggests.",
        facts: [
          { label: "Safety score", value: "74", unit: "/100", description: "Mid-tier global score with strong neighborhood variation.", context: "Resident experience varies with neighborhood and time of day." },
          { label: "Violent-crime context", value: "Mid-low", description: "Long-term decline supports the score but recent fluctuations matter.", context: "Long-run trend is favorable; short-run variation matters." },
          { label: "Watch item", value: "Property and transit", description: "Property and transit-related risks are practical day-to-day issues.", context: "Common situational awareness still useful." },
        ],
      },
      "internet-speed": {
        score: 86,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "New York has fast broadband and dense mobile coverage, supporting remote work, financial services, and creative industries.",
        explanation:
          "Connectivity scoring weighs fixed and mobile speed, latency, and the breadth of household coverage. Dense cities benefit from infrastructure scale.",
        facts: [
          { label: "Fixed broadband median", value: "260", unit: " Mbps", description: "Strong fixed-broadband performance for remote and hybrid work.", context: "Top-tier among large North-American metros." },
          { label: "Mobile median", value: "150", unit: " Mbps", description: "Reliable mobile performance across boroughs.", context: "Coverage and capacity scale with demand." },
          { label: "Coverage", value: "Dense", description: "Fiber and cable footprint reaches most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 60,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "New York faces meaningful coastal flood, heat, and storm exposure. Adaptation investment is significant but not yet at parity with the hazard.",
        explanation:
          "The climate-risk score reflects hazard probability, infrastructure exposure, and adaptation capacity. Coastal cities require deeper investment to reach a healthy score.",
        facts: [
          { label: "Primary hazard", value: "Storm surge and heat", description: "Hurricanes, flooding, and heat are concurrent stressors.", context: "Storm-cycle and heat patterns dominate risk." },
          { label: "Flood exposure", value: "High", description: "Low-lying neighborhoods face direct sea-level and surge pressure.", context: "Multi-borough exposure shapes resilience priorities." },
          { label: "Adaptation capacity", value: "Improving", description: "Significant investment, with implementation timelines still long.", context: "Programs are underway but not yet built out." },
        ],
      },
    },
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    countrySlug: "japan",
    countryName: "Japan",
    region: "East Asia",
    population: "37.2M metro",
    intro:
      "Tokyo is a high-capacity megacity with outstanding transit, deep services, and strong adaptation discipline, balanced against climate and housing constraints.",
    outlook:
      "Tokyo is strongest where density, reliability, and day-to-day service access matter more than low costs or large private space.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 89, affordability: 68, airQuality: 78, energy: 84, resilience: 93 },
    metrics: [
      { label: "Overall city intelligence", value: "89", unit: "/100", score: 89, description: "Very strong resilience, services, mobility, and urban operating capacity." },
      { label: "Transit reliability", value: "Exceptional", description: "Rail access reduces mobility friction across the metropolitan region." },
      { label: "Adaptation discipline", value: "Advanced", description: "Earthquake, flood, and heat planning are central to the urban operating model." },
    ],
    relatedCitySlugs: ["singapore", "sydney", "new-york"],
    modules: {
      "cost-of-living": {
        score: 68,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Tokyo is not cheap, but transit access, service density, and varied housing formats improve practical affordability.",
        explanation:
          "Tokyo demonstrates why affordability is not only a price index. Transit reliability and service density lower many everyday frictions.",
        facts: [
          { label: "Affordability score", value: "68", unit: "/100", description: "Balanced score reflecting high quality of access and moderate household tradeoffs.", context: "Strong access offsets some rent and space limitations." },
          { label: "Housing pressure", value: "Moderate", description: "Space is constrained, but housing variety improves options.", context: "Small units and location tradeoffs are common." },
          { label: "Transport cost offset", value: "Very strong", description: "Rail access can reduce the need for private vehicle expenses.", context: "Transit reach supports car-light daily life." },
        ],
      },
      "air-quality": {
        score: 78,
        sources: ["who-air"],
        summary:
          "Tokyo's air profile benefits from strong governance but still requires attention to fine particles, ozone, and heat-related exposure.",
        explanation:
          "The air-quality model gives large dense cities credit for governance while still penalizing exposure patterns that matter for health.",
        facts: [
          { label: "Clean-air score", value: "78", unit: "/100", description: "Solid air-quality score for a megacity, with health benchmarks still relevant.", context: "Strong for scale, but health-guideline pressure remains." },
          { label: "Primary pollutant watch", value: "PM2.5 and ozone", description: "Dense urban activity keeps fine particles and ozone in the model.", context: "Important for long-term exposure and hot-season risk." },
          { label: "Exposure modifier", value: "Heat", description: "Heat can amplify health risk and should be read alongside pollutant levels.", context: "The model assumes strong urban monitoring context." },
        ],
      },
      energy: {
        score: 84,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Tokyo has strong engineering capacity and resilience discipline, but energy transition is constrained by dense demand and climate stress.",
        explanation:
          "Tokyo's energy score rewards implementation capacity while recognizing that megacity cooling, resilience, and land constraints make transition planning complex.",
        facts: [
          { label: "Energy readiness", value: "84", unit: "/100", description: "High readiness through infrastructure capacity and adaptation discipline.", context: "Governance and engineering capacity are major strengths." },
          { label: "Climate stressor", value: "Heat and storms", description: "Megacity scale creates demanding electrification and cooling needs.", context: "Adaptation and cooling demand shape energy resilience." },
          { label: "Renewable opportunity", value: "Moderate", description: "Distributed solar can help but is constrained by dense land use.", context: "Urban form constrains some distributed generation." },
        ],
      },
      safety: {
        score: 93,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Tokyo scores at the very top globally on safety, with very low violent-crime context, strong institutions, and high resident perception of safety.",
        explanation:
          "Safety scoring recognizes Tokyo's combination of low violent-crime context, strong institutional response, and consistent resident perception across the metro.",
        facts: [
          { label: "Safety score", value: "93", unit: "/100", description: "Top-tier safety profile across most neighborhoods.", context: "Among the safest large global cities." },
          { label: "Violent-crime context", value: "Very low", description: "Internationally low violent-crime context informs the score.", context: "Stability supports daily life and night-time activity." },
          { label: "Resident perception", value: "Very high", description: "Day-to-day perception of safety is consistently positive.", context: "Public-space confidence reinforces the score." },
        ],
      },
      "internet-speed": {
        score: 92,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Tokyo is a connectivity leader with very fast fiber, dense mobile coverage, and a digital-readiness culture that supports remote and hybrid work.",
        explanation:
          "Connectivity scoring weighs fixed and mobile speed, latency, and digital-readiness depth. Tokyo's infrastructure scale and policy continuity rank it near the top.",
        facts: [
          { label: "Fixed broadband median", value: "320", unit: " Mbps", description: "Among the fastest fixed-broadband performance globally.", context: "Supports demanding remote workflows." },
          { label: "Mobile median", value: "180", unit: " Mbps", description: "Mobile performance is fast and consistent across the metro.", context: "Hybrid and on-the-go productivity benefit." },
          { label: "Coverage", value: "Universal", description: "Fiber and 5G coverage reach almost every residential area.", context: "Service availability is comprehensive." },
        ],
      },
      "climate-risk": {
        score: 64,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Tokyo faces meaningful climate exposure across heat, storm, and seismic-coupled flood pressure, balanced by strong adaptation capacity.",
        explanation:
          "Tokyo's climate-risk profile is shaped by concurrent heat, storm, and flood hazards, partially offset by deep engineering and adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Storms and heat", description: "Typhoon, heat, and flood exposure are the main hazards.", context: "Multiple co-occurring hazards shape planning." },
          { label: "Flood exposure", value: "Moderate-to-high", description: "Low-lying districts and tidal pressure require ongoing investment.", context: "Major engineering programs reduce expected impact." },
          { label: "Adaptation capacity", value: "Very strong", description: "Engineering and emergency-management capacity are world class.", context: "Implementation depth raises the score significantly." },
        ],
      },
    },
  },
  {
    slug: "paris",
    name: "Paris",
    countrySlug: "france",
    countryName: "France",
    region: "Western Europe",
    population: "11.2M metro",
    intro:
      "Paris is a dense, transit-rich European capital with strong cultural access, ambitious street redesign, and continuing affordability and air-quality challenges.",
    outlook:
      "Paris is most interesting as a case study in converting legacy urban form into healthier, lower-emission daily life.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 86, affordability: 55, airQuality: 76, energy: 86, resilience: 88 },
    metrics: [
      { label: "Overall city intelligence", value: "86", unit: "/100", score: 86, description: "Strong access, culture, transit, and climate direction with affordability pressure." },
      { label: "Street transformation", value: "Advanced", description: "Public-space and mobility reforms improve the health profile over time." },
      { label: "Housing pressure", value: "High", description: "Central-city demand remains the main resident well-being constraint." },
    ],
    relatedCitySlugs: ["london", "berlin", "copenhagen"],
    modules: {
      "cost-of-living": {
        score: 55,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Paris has high housing pressure, but compact mobility and public amenities reduce some day-to-day costs.",
        explanation:
          "Paris shows the tradeoff between high-demand central living and strong public amenity value. The model gives credit for access but does not ignore rent pressure.",
        facts: [
          { label: "Affordability score", value: "55", unit: "/100", description: "Moderate-low affordability because housing pressure is persistent.", context: "Strong access, but housing pressure reduces the score." },
          { label: "Housing pressure", value: "High", description: "Demand for central access drives rent and space constraints.", context: "Central and well-connected areas stay competitive." },
          { label: "Amenity offset", value: "Strong", description: "Transit, public space, and cultural access improve practical value.", context: "Walkability and transit reduce some private costs." },
        ],
      },
      "air-quality": {
        score: 76,
        sources: ["who-air", "eea-air"],
        summary:
          "Paris benefits from European monitoring and mobility reform, while PM2.5, nitrogen dioxide, and ozone remain key health signals.",
        explanation:
          "The air-quality page treats policy momentum as useful context, but the score remains grounded in pollutant exposure and health-based benchmarks.",
        facts: [
          { label: "Clean-air score", value: "76", unit: "/100", description: "Improving profile with continued exposure pressure from traffic and regional conditions.", context: "Improving, but not yet low-exposure." },
          { label: "Primary pollutant watch", value: "PM2.5, NO2, ozone", description: "Traffic-related and regional pollutants remain health-relevant.", context: "A mix of traffic and regional air-quality pressures." },
          { label: "Policy momentum", value: "Strong", description: "Street redesign and European air-quality rules support progress.", context: "Mobility redesign can improve long-run exposure." },
        ],
      },
      energy: {
        score: 86,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Paris has strong energy-transition direction, with building retrofits and heat adaptation central to its readiness profile.",
        explanation:
          "Paris energy readiness depends on existing buildings, clean heat, and heat adaptation. The model rewards cities that connect emissions cuts to resident comfort.",
        facts: [
          { label: "Energy readiness", value: "86", unit: "/100", description: "Strong policy and building-efficiency direction support the transition score.", context: "Policy ambition and retrofit focus support the score." },
          { label: "Primary transition lever", value: "Building efficiency", description: "Older building stock makes efficiency upgrades a major lever.", context: "Retrofits can reduce emissions and improve comfort." },
          { label: "Climate stressor", value: "Urban heat", description: "Heat adaptation is a major quality-of-life and energy-demand issue.", context: "Summer heat increases adaptation and cooling importance." },
        ],
      },
      safety: {
        score: 78,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Paris has solid overall safety, with neighborhood variation and tourist-area opportunistic risks more visible than violent crime.",
        explanation:
          "Safety scoring weighs violent-crime context, perceived safety, and neighborhood variation. Tourist-heavy cities often have visible opportunistic risk patterns.",
        facts: [
          { label: "Safety score", value: "78", unit: "/100", description: "Solid score with neighborhood-level variation.", context: "Tourist areas and central transit see more incident reports." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low.", context: "Property and pickpocket risks are more salient." },
          { label: "Watch item", value: "Pickpocketing", description: "High-traffic tourist sites concentrate opportunistic risk.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 88,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Paris offers fast fiber broadband and strong mobile performance, well-suited to remote work and creative industries.",
        explanation:
          "France's national fiber rollout and dense mobile coverage in Paris support strong connectivity scores for residents and remote workers.",
        facts: [
          { label: "Fixed broadband median", value: "275", unit: " Mbps", description: "Strong fixed-broadband performance across the metro.", context: "Supports demanding remote workflows." },
          { label: "Mobile median", value: "140", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid and travel-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 70,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Paris carries moderate climate risk centered on heat waves and Seine flood pressure, with active adaptation programs.",
        explanation:
          "Paris's climate-risk profile is shaped by heat exposure and river-flood pressure. Adaptation investment is rising but transition timelines are long.",
        facts: [
          { label: "Primary hazard", value: "Heat waves", description: "Sustained summer heat is the main public-health hazard.", context: "Adaptation programs target cooling and shade." },
          { label: "Flood exposure", value: "Moderate", description: "Seine flood scenarios require ongoing infrastructure work.", context: "Historical and future scenarios both inform planning." },
          { label: "Adaptation capacity", value: "Improving", description: "Public-space redesign and policy continuity build resilience.", context: "Transition timelines stretch into the medium term." },
        ],
      },
    },
  },
  {
    slug: "london",
    name: "London",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    region: "Western Europe",
    population: "9.7M metro",
    intro:
      "London is a deep global financial and cultural hub with strong public transport, ambitious climate policy, and persistent housing affordability pressure.",
    outlook:
      "London is most informative for users comparing opportunity, transit reach, and clean-air policy momentum against high housing costs.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 85, affordability: 52, airQuality: 75, energy: 84, resilience: 86 },
    metrics: [
      { label: "Overall city intelligence", value: "85", unit: "/100", score: 85, description: "Strong opportunity, transit, and policy capacity offset by affordability pressure." },
      { label: "Transit reach", value: "Very high", description: "Tube, bus, and rail networks support a transit-first daily life pattern." },
      { label: "Policy capacity", value: "Advanced", description: "Clean-air zones and net-zero targets provide a continuous policy direction." },
    ],
    relatedCitySlugs: ["paris", "new-york", "berlin"],
    modules: {
      "cost-of-living": {
        score: 52,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "London is expensive in housing and central services, partially offset by transit reach and broad opportunity access.",
        explanation:
          "Cost-of-living scoring weighs essential spending against opportunity and mobility offsets. London is high-cost, but transit and labor-market depth temper the impact.",
        facts: [
          { label: "Affordability score", value: "52", unit: "/100", description: "Moderate-low score driven by housing pressure and central-services costs.", context: "Opportunity and transit reach partially offset costs." },
          { label: "Housing pressure", value: "Very high", description: "Central demand and supply constraints dominate the cost profile.", context: "Most central neighborhoods remain highly competitive." },
          { label: "Transport offset", value: "Strong", description: "Tube and bus reach reduces vehicle dependence for many households.", context: "Transit-heavy daily routines lower private mobility costs." },
        ],
      },
      "air-quality": {
        score: 75,
        sources: ["who-air", "eea-air"],
        summary:
          "London's clean-air policy has improved exposure trends, with PM2.5 and nitrogen dioxide remaining the key health signals.",
        explanation:
          "Air-quality scoring weighs pollutant exposure against monitoring confidence and policy momentum. Clean-air zones build long-run improvement.",
        facts: [
          { label: "Clean-air score", value: "75", unit: "/100", description: "Improving profile reinforced by clean-air policy.", context: "Trend is favorable; absolute exposure still matters." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO2", description: "Fine particles and traffic-related NO2 remain central health benchmarks.", context: "Traffic-corridor exposure shapes the pollutant profile." },
          { label: "Policy momentum", value: "Strong", description: "Ultra-low-emission policies support continued improvement.", context: "Mobility transition reinforces clean-air progress." },
        ],
      },
      energy: {
        score: 84,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "London has strong clean-energy direction with retrofit-led building strategy, balanced against legacy infrastructure complexity.",
        explanation:
          "Energy readiness scoring weighs policy clarity, building efficiency, and grid resilience. London's depth in policy is a strength; the building stock is the main lever.",
        facts: [
          { label: "Energy readiness", value: "84", unit: "/100", description: "Strong policy and infrastructure base support the transition score.", context: "Policy continuity supports long-run direction." },
          { label: "Primary transition lever", value: "Building efficiency", description: "Older building stock makes retrofits the highest-leverage move.", context: "Heat pumps and insulation programs build the path." },
          { label: "Climate stressor", value: "Heat and surface flood", description: "Heat and stormwater pressure shape adaptation priorities.", context: "Stormwater and flash-flood planning are growing concerns." },
        ],
      },
      safety: {
        score: 79,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "London has solid safety with neighborhood variation. Violent-crime context is comparatively low; opportunistic risks are concentrated in transit and tourist hubs.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Large global cities tend to have visible opportunistic risk patterns.",
        facts: [
          { label: "Safety score", value: "79", unit: "/100", description: "Solid score reinforced by institutional response capacity.", context: "Resident experience varies by neighborhood." },
          { label: "Violent-crime context", value: "Low-moderate", description: "Violent-crime context is comparatively low globally.", context: "Long-run trend is favorable but not flat." },
          { label: "Watch item", value: "Phone snatching", description: "High-traffic central areas concentrate opportunistic property crime.", context: "Awareness in busy transit hubs remains useful." },
        ],
      },
      "internet-speed": {
        score: 85,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "London delivers fast broadband and strong mobile coverage, supporting global financial services and remote work.",
        explanation:
          "Connectivity scoring weighs fixed broadband, mobile performance, latency, and digital-readiness depth. London ranks well across all dimensions.",
        facts: [
          { label: "Fixed broadband median", value: "245", unit: " Mbps", description: "Strong fixed-broadband performance across the metro.", context: "Top-tier among large European cities." },
          { label: "Mobile median", value: "130", unit: " Mbps", description: "Reliable mobile experience supports hybrid work.", context: "Coverage and capacity scale with demand." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber and cable footprints reach most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 72,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "London faces moderate climate exposure shaped by heat waves, Thames flood scenarios, and urban surface-water flooding.",
        explanation:
          "London's climate-risk profile blends heat exposure, river-flood scenarios, and surface-water risk in dense areas. Adaptation programs are well established.",
        facts: [
          { label: "Primary hazard", value: "Heat and surface flood", description: "Heat waves and surface flooding are the main hazards.", context: "Concurrent hazards shape adaptation priorities." },
          { label: "Flood exposure", value: "Moderate", description: "Thames Barrier reduces tidal-surge exposure in central areas.", context: "Surface flooding remains a localized challenge." },
          { label: "Adaptation capacity", value: "Strong", description: "Long-term flood and climate plans provide continuity.", context: "Implementation depth supports a healthy score." },
        ],
      },
    },
  },
  {
    slug: "singapore",
    name: "Singapore",
    countrySlug: "singapore",
    countryName: "Singapore",
    region: "Southeast Asia",
    population: "5.9M city-state",
    intro:
      "Singapore is a high-capacity city-state with exceptional public services, strong digital infrastructure, and ongoing climate adaptation under hot-and-humid conditions.",
    outlook:
      "Singapore is most useful for users comparing service quality, connectivity, and urban planning rigor against high housing costs and heat exposure.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 90, affordability: 60, airQuality: 80, energy: 85, resilience: 92 },
    metrics: [
      { label: "Overall city intelligence", value: "90", unit: "/100", score: 90, description: "Top-tier services, governance, and digital infrastructure with heat exposure to manage." },
      { label: "Service depth", value: "Exceptional", description: "Health, transit, and digital services reach near-universal coverage." },
      { label: "Heat adaptation", value: "Active", description: "Continuous urban heat-management investment shapes outdoor design." },
    ],
    relatedCitySlugs: ["tokyo", "sydney", "london"],
    modules: {
      "cost-of-living": {
        score: 60,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Singapore is expensive on rent and vehicles, balanced by strong transit, public services, and food-court price stability.",
        explanation:
          "Cost-of-living scoring weighs visible rent and services against transit and food-court offsets. Singapore performs well on offsets despite high housing pressure.",
        facts: [
          { label: "Affordability score", value: "60", unit: "/100", description: "Mid-tier affordability with strong public-service offsets.", context: "Public transport and food-courts moderate daily expense." },
          { label: "Housing pressure", value: "High", description: "Public housing programs improve access; private rents remain high.", context: "Most residents access HDB housing at managed prices." },
          { label: "Vehicle cost", value: "Very high", description: "Vehicle entitlement costs structurally limit private-car ownership.", context: "Transit and ride-hail offset most household needs." },
        ],
      },
      "air-quality": {
        score: 80,
        sources: ["who-air"],
        summary:
          "Singapore performs well on clean air with periodic regional haze events as the main exposure pressure.",
        explanation:
          "Air-quality scoring weighs baseline pollutant exposure against episodic haze events. Singapore's baseline is healthy; haze episodes are the main risk.",
        facts: [
          { label: "Clean-air score", value: "80", unit: "/100", description: "Strong baseline air quality with episodic regional events.", context: "Trans-boundary haze drives most exposure spikes." },
          { label: "Primary pollutant watch", value: "PM2.5 (haze)", description: "Episodic regional haze drives most PM2.5 exposure.", context: "Health advisories and indoor-air strategies matter on haze days." },
          { label: "Policy context", value: "Strong", description: "Clean-air policies and indoor-quality programs support resident health.", context: "Indoor-air management is integrated into building codes." },
        ],
      },
      energy: {
        score: 85,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Singapore is energy-import dependent but progressing on renewables, regional power imports, and strong building efficiency.",
        explanation:
          "Energy readiness scoring weighs grid resilience, transition strategy, and adaptation. Singapore's grid is resilient; transition relies on imports and efficiency.",
        facts: [
          { label: "Energy readiness", value: "85", unit: "/100", description: "Strong grid and policy capacity with import dependence shaping strategy.", context: "Diversification and efficiency are the main levers." },
          { label: "Primary transition lever", value: "Imports and efficiency", description: "Regional clean-power imports and building efficiency are central.", context: "Land area limits onshore generation alone." },
          { label: "Climate stressor", value: "Heat", description: "Sustained heat shapes cooling demand and building strategy.", context: "Cooling demand is a structural energy-use driver." },
        ],
      },
      safety: {
        score: 95,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Singapore is among the safest cities globally, with very low violent-crime context and strong institutional response.",
        explanation:
          "Safety scoring captures violent-crime context, institutional response, and resident perception. Singapore performs at the top of the global distribution.",
        facts: [
          { label: "Safety score", value: "95", unit: "/100", description: "Top-tier safety profile across the city-state.", context: "Among the safest large global cities." },
          { label: "Violent-crime context", value: "Very low", description: "Internationally low violent-crime context informs the score.", context: "Stability supports daily life and night-time activity." },
          { label: "Resident perception", value: "Very high", description: "Public-space confidence is consistently positive.", context: "Pedestrian and night-time safety are widely positive." },
        ],
      },
      "internet-speed": {
        score: 95,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Singapore is a global connectivity leader with very fast fiber, dense 5G mobile, and a digital-readiness culture across services.",
        explanation:
          "Connectivity scoring weighs fixed broadband, mobile performance, latency, and digital-readiness depth. Singapore ranks at the top globally.",
        facts: [
          { label: "Fixed broadband median", value: "350", unit: " Mbps", description: "Among the fastest fixed-broadband performance globally.", context: "Supports demanding remote and creative workflows." },
          { label: "Mobile median", value: "190", unit: " Mbps", description: "5G performance is fast and consistent.", context: "Hybrid and on-the-go productivity benefit." },
          { label: "Coverage", value: "Universal", description: "Fiber and 5G coverage are essentially universal.", context: "Service availability is comprehensive." },
        ],
      },
      "climate-risk": {
        score: 65,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Singapore faces meaningful climate exposure from heat, intense rainfall, and long-run sea-level pressure, balanced by very strong adaptation capacity.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Singapore's hazards are real, but adaptation depth raises the score.",
        facts: [
          { label: "Primary hazard", value: "Heat and rainfall", description: "Heat and intense rainfall are the main day-to-day hazards.", context: "Sea-level rise informs the long-run plan." },
          { label: "Flood exposure", value: "Moderate", description: "Coastal and flash-flood pressure shape infrastructure investment.", context: "Polders and stormwater design are growing." },
          { label: "Adaptation capacity", value: "Very strong", description: "Long-horizon climate plans and engineering capacity are world-class.", context: "Implementation depth raises the score significantly." },
        ],
      },
    },
  },
  {
    slug: "berlin",
    name: "Berlin",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Central Europe",
    population: "4.5M metro",
    intro:
      "Berlin combines lower-cost European living, deep cultural and creative industries, and progressive clean-energy and climate policy.",
    outlook:
      "Berlin is most useful for users comparing affordability, creative-industry depth, and clean-energy direction in a major European capital.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 84, affordability: 70, airQuality: 80, energy: 88, resilience: 84 },
    metrics: [
      { label: "Overall city intelligence", value: "84", unit: "/100", score: 84, description: "Affordable for a major Western capital, with strong clean-energy direction." },
      { label: "Affordability stance", value: "Improving but rising", description: "Berlin remains comparatively affordable in Europe, with rising rent pressure." },
      { label: "Creative-industry depth", value: "High", description: "Strong creative, technology, and academic ecosystems shape opportunity." },
    ],
    relatedCitySlugs: ["paris", "copenhagen", "london"],
    modules: {
      "cost-of-living": {
        score: 70,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Berlin is more affordable than most major European capitals, with rent pressure rising over time.",
        explanation:
          "Cost-of-living scoring weighs essential spending and offsets. Berlin's transit, public services, and rent levels combine into a relatively favorable score.",
        facts: [
          { label: "Affordability score", value: "70", unit: "/100", description: "Strong affordability for a major Western capital.", context: "Better than most Western European peers." },
          { label: "Housing pressure", value: "Moderate-rising", description: "Rents have risen sharply but remain below other capitals.", context: "Long-term renters benefit from regulation; new entrants face higher prices." },
          { label: "Transport offset", value: "Strong", description: "Transit and cycling reduce private mobility costs.", context: "Car-light daily life is realistic for most households." },
        ],
      },
      "air-quality": {
        score: 80,
        sources: ["who-air", "eea-air"],
        summary:
          "Berlin's air-quality profile benefits from strong European monitoring and ongoing transit and street redesign.",
        explanation:
          "Air-quality scoring weighs pollutant exposure and policy momentum. Berlin's baseline is solid with continued improvement on traffic-related pollutants.",
        facts: [
          { label: "Clean-air score", value: "80", unit: "/100", description: "Strong baseline air quality and improving trend.", context: "Among the better-performing major Western capitals." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO2", description: "Traffic-related and regional pollutants remain central.", context: "Mobility transition supports continuing improvement." },
          { label: "Policy momentum", value: "Strong", description: "Street redesign and clean-air policies reinforce progress.", context: "Public-realm investment is a continuing lever." },
        ],
      },
      energy: {
        score: 88,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Berlin has strong clean-energy direction supported by national renewable-electricity progress and city-level efficiency programs.",
        explanation:
          "Energy readiness scoring weighs renewable-electricity progress, building efficiency, and grid resilience. Berlin benefits from national momentum.",
        facts: [
          { label: "Energy readiness", value: "88", unit: "/100", description: "Strong national renewable progress supports the city profile.", context: "City-level programs and national policy reinforce each other." },
          { label: "Primary transition lever", value: "Heat pumps and renewables", description: "Building heat and electricity together drive transition.", context: "District-heat decarbonization is a key challenge." },
          { label: "Climate stressor", value: "Heat", description: "Heat waves are an emerging quality-of-life and energy issue.", context: "Cooling-demand patterns are shifting upward." },
        ],
      },
      safety: {
        score: 82,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Berlin has solid safety with neighborhood variation. Violent-crime context is comparatively low; opportunistic risks concentrate in transit and night-life areas.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Major capitals tend to have visible opportunistic risk patterns.",
        facts: [
          { label: "Safety score", value: "82", unit: "/100", description: "Solid score with strong neighborhood variation.", context: "Resident experience varies with area and time of day." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Day-to-day stability supports daily life." },
          { label: "Watch item", value: "Bike theft", description: "Property-related opportunistic risks are the main practical concern.", context: "Locking practices and registration help." },
        ],
      },
      "internet-speed": {
        score: 78,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Berlin's connectivity is solid but lags behind some peers on fiber rollout, with strong mobile performance.",
        explanation:
          "Connectivity scoring weighs fixed broadband, mobile performance, latency, and digital-readiness. Berlin scores well on mobile but trails on fiber depth.",
        facts: [
          { label: "Fixed broadband median", value: "190", unit: " Mbps", description: "Solid fixed-broadband performance, with fiber rollout in progress.", context: "Performance is improving as fiber expands." },
          { label: "Mobile median", value: "120", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Mixed", description: "Cable and DSL footprints dominate; fiber expanding.", context: "Service variety still supports household choice." },
        ],
      },
      "climate-risk": {
        score: 75,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Berlin faces moderate climate exposure focused on heat waves, surface-water flooding, and drought-pressure on green infrastructure.",
        explanation:
          "Berlin's climate-risk profile combines heat exposure with surface-flood and drought patterns. Adaptation programs are progressing alongside national targets.",
        facts: [
          { label: "Primary hazard", value: "Heat and drought", description: "Heat and drought are the most visible hazards.", context: "Green-infrastructure stress is rising." },
          { label: "Flood exposure", value: "Moderate", description: "Surface-water and storm flooding require ongoing investment.", context: "Localized flooding is a growing operational concern." },
          { label: "Adaptation capacity", value: "Strong", description: "Climate plans and green-infrastructure programs build resilience.", context: "Implementation timelines remain medium-term." },
        ],
      },
    },
  },
  {
    slug: "toronto",
    name: "Toronto",
    countrySlug: "canada",
    countryName: "Canada",
    region: "North America",
    population: "6.6M metro",
    intro:
      "Toronto is a diverse North American hub with strong public transit, solid services, and ongoing housing affordability and climate pressure.",
    outlook:
      "Toronto is most informative for users comparing North-American services and transit reach against rising housing pressure and winter resilience.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 83, affordability: 55, airQuality: 80, energy: 82, resilience: 85 },
    metrics: [
      { label: "Overall city intelligence", value: "83", unit: "/100", score: 83, description: "Strong public services and transit, balanced by housing-cost pressure." },
      { label: "Service depth", value: "High", description: "Health and education services reach broad coverage." },
      { label: "Housing pressure", value: "High", description: "Housing affordability is the main resident well-being constraint." },
    ],
    relatedCitySlugs: ["new-york", "sydney", "london"],
    modules: {
      "cost-of-living": {
        score: 55,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Toronto offers strong public services but housing prices and rents drive elevated cost pressure.",
        explanation:
          "Cost-of-living scoring weighs essential spending against transit and service offsets. Toronto's public services are solid; housing costs dominate the score.",
        facts: [
          { label: "Affordability score", value: "55", unit: "/100", description: "Mid-tier score driven by housing pressure.", context: "Service quality and transit offset costs partially." },
          { label: "Housing pressure", value: "Very high", description: "Long-run demand exceeds new supply across the metro.", context: "Central neighborhoods stay highly competitive." },
          { label: "Transport offset", value: "Moderate", description: "Transit reach reduces vehicle dependence in central areas.", context: "Suburban patterns still favor car ownership." },
        ],
      },
      "air-quality": {
        score: 80,
        sources: ["who-air"],
        summary:
          "Toronto has solid baseline air quality with episodic wildfire-smoke events as the main exposure spike.",
        explanation:
          "Air-quality scoring weighs baseline pollutant exposure with episodic wildfire-smoke pressure. Toronto's baseline is healthy; smoke events drive most spikes.",
        facts: [
          { label: "Clean-air score", value: "80", unit: "/100", description: "Strong baseline with episodic wildfire-smoke pressure.", context: "Trans-regional smoke events drive most exposure spikes." },
          { label: "Primary pollutant watch", value: "PM2.5 (smoke)", description: "Wildfire smoke is the main PM2.5 driver in recent years.", context: "Indoor-air strategies and air-quality alerts matter on smoke days." },
          { label: "Policy context", value: "Strong", description: "Clean-air policies support a healthy baseline.", context: "Smoke-event preparedness is rising in importance." },
        ],
      },
      energy: {
        score: 82,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Toronto benefits from a low-carbon Ontario grid and ongoing building-efficiency efforts, with winter heat as a major energy lever.",
        explanation:
          "Energy readiness scoring weighs grid resilience and transition strategy. Toronto's grid carbon intensity is low; building heat is the main lever.",
        facts: [
          { label: "Energy readiness", value: "82", unit: "/100", description: "Low-carbon grid and policy direction support the score.", context: "Building heat is the main outstanding lever." },
          { label: "Primary transition lever", value: "Heat pumps", description: "Cold-climate heat pumps and retrofits are the main path.", context: "Winter peak demand shapes infrastructure planning." },
          { label: "Climate stressor", value: "Cold and storms", description: "Winter resilience is central to energy planning.", context: "Severe weather events strain distribution networks." },
        ],
      },
      safety: {
        score: 84,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Toronto is among the safer large North American cities, with low violent-crime context and solid institutional response.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Toronto performs strongly within North America.",
        facts: [
          { label: "Safety score", value: "84", unit: "/100", description: "Strong score among large North American cities.", context: "Resident experience is generally consistent." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run trend has been favorable." },
          { label: "Watch item", value: "Auto theft", description: "Auto theft has been a rising property-crime concern.", context: "Vehicle-theft prevention has practical value." },
        ],
      },
      "internet-speed": {
        score: 84,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Toronto delivers fast broadband and reliable mobile coverage, supporting a diverse remote and hybrid workforce.",
        explanation:
          "Connectivity scoring weighs fixed broadband, mobile performance, and digital-readiness. Toronto ranks well among large North-American cities.",
        facts: [
          { label: "Fixed broadband median", value: "230", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Top-tier among large North-American metros." },
          { label: "Mobile median", value: "130", unit: " Mbps", description: "Reliable mobile experience supports hybrid work.", context: "Coverage is broad across the metro." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber and cable footprints reach most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 70,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Toronto faces rising heat, severe-storm, and wildfire-smoke pressure, balanced by solid adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Toronto's hazards are rising; institutional capacity supports a healthy score.",
        facts: [
          { label: "Primary hazard", value: "Heat and storms", description: "Heat waves and severe storms are the main day-to-day hazards.", context: "Wildfire smoke is an episodic but growing concern." },
          { label: "Flood exposure", value: "Moderate", description: "Stormwater flooding pressure is rising.", context: "Localized flooding events are increasing." },
          { label: "Adaptation capacity", value: "Strong", description: "Climate plans and stormwater investment build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "sydney",
    name: "Sydney",
    countrySlug: "australia",
    countryName: "Australia",
    region: "Oceania",
    population: "5.4M metro",
    intro:
      "Sydney combines high quality of life, strong services, and outdoor amenity with elevated housing costs and meaningful climate exposure from heat and wildfire-smoke.",
    outlook:
      "Sydney is most useful for users comparing service quality and outdoor amenity against housing pressure and climate hazard.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 85, affordability: 50, airQuality: 82, energy: 80, resilience: 84 },
    metrics: [
      { label: "Overall city intelligence", value: "85", unit: "/100", score: 85, description: "Strong services and outdoor amenity, with housing pressure and climate hazard to manage." },
      { label: "Outdoor amenity", value: "Very high", description: "Coastal access and parks support a high quality of daily life." },
      { label: "Housing pressure", value: "Very high", description: "Housing prices and rents are the main resident well-being constraint." },
    ],
    relatedCitySlugs: ["singapore", "toronto", "tokyo"],
    modules: {
      "cost-of-living": {
        score: 50,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Sydney is expensive on housing and central services, partially offset by outdoor amenity and service quality.",
        explanation:
          "Cost-of-living scoring weighs essential spending against amenity and service offsets. Sydney's amenity is high; housing costs dominate the score.",
        facts: [
          { label: "Affordability score", value: "50", unit: "/100", description: "Lower score driven by housing-cost pressure.", context: "Amenity and services partially offset costs." },
          { label: "Housing pressure", value: "Very high", description: "Long-run housing demand and supply imbalances dominate the cost profile.", context: "Inner-ring neighborhoods remain highly competitive." },
          { label: "Amenity offset", value: "Strong", description: "Outdoor and service amenity reduce some practical costs.", context: "Outdoor lifestyle reduces some indoor entertainment expense." },
        ],
      },
      "air-quality": {
        score: 82,
        sources: ["who-air"],
        summary:
          "Sydney has strong baseline air quality with episodic wildfire-smoke and bushfire events as the main exposure pressure.",
        explanation:
          "Air-quality scoring weighs baseline pollutant exposure with bushfire-smoke pressure. Sydney's baseline is excellent; smoke events drive most exposure spikes.",
        facts: [
          { label: "Clean-air score", value: "82", unit: "/100", description: "Strong baseline air quality with episodic smoke pressure.", context: "Bushfire-smoke events drive most exposure spikes." },
          { label: "Primary pollutant watch", value: "PM2.5 (smoke)", description: "Wildfire and bushfire smoke are the main PM2.5 drivers.", context: "Indoor-air strategies matter on smoke days." },
          { label: "Policy context", value: "Strong", description: "Clean-air monitoring and bushfire alerts support resident health.", context: "Smoke-event preparedness is integrated into public health." },
        ],
      },
      energy: {
        score: 80,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Sydney is in active energy transition with strong rooftop solar, ongoing grid modernization, and rising heat-driven cooling demand.",
        explanation:
          "Energy readiness scoring weighs renewable-resource context, grid resilience, and adaptation. Sydney's solar resource is excellent; grid modernization is the main lever.",
        facts: [
          { label: "Energy readiness", value: "80", unit: "/100", description: "Active transition with strong solar resource.", context: "Grid modernization is the main outstanding lever." },
          { label: "Primary transition lever", value: "Rooftop solar and grid", description: "Distributed solar and grid investment together drive transition.", context: "Rooftop solar is widely deployed." },
          { label: "Climate stressor", value: "Heat and bushfire", description: "Heat and bushfire pressure shape adaptation priorities.", context: "Cooling-demand patterns are shifting upward." },
        ],
      },
      safety: {
        score: 87,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Sydney is among the safer large global cities, with low violent-crime context and strong institutional response.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Sydney performs strongly globally.",
        facts: [
          { label: "Safety score", value: "87", unit: "/100", description: "Strong score with consistent neighborhood experience.", context: "Among the safer large global cities." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Property and night-life", description: "Property and night-life-area opportunistic risks are the main concerns.", context: "Awareness in busy entertainment areas remains useful." },
        ],
      },
      "internet-speed": {
        score: 80,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Sydney has solid broadband and mobile performance, with the national broadband network supporting most households.",
        explanation:
          "Connectivity scoring weighs fixed broadband, mobile performance, and digital-readiness. Sydney scores well, with mixed broadband technologies in different suburbs.",
        facts: [
          { label: "Fixed broadband median", value: "200", unit: " Mbps", description: "Solid fixed-broadband performance across the metro.", context: "Performance varies with suburb and access technology." },
          { label: "Mobile median", value: "140", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "National broadband network reaches most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 65,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Sydney faces meaningful climate exposure from heat, bushfire-smoke, and storm pressure, with improving adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Sydney's hazards are real; institutional capacity supports a healthy score.",
        facts: [
          { label: "Primary hazard", value: "Heat and bushfire", description: "Heat and bushfire pressure are the main day-to-day hazards.", context: "Smoke events bring concurrent air-quality risks." },
          { label: "Flood exposure", value: "Moderate", description: "Storm flooding and coastal pressure require ongoing investment.", context: "Catchment areas face periodic flooding." },
          { label: "Adaptation capacity", value: "Improving", description: "Climate plans and infrastructure investment build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "amsterdam",
    name: "Amsterdam",
    countrySlug: "netherlands",
    countryName: "Netherlands",
    region: "Western Europe",
    population: "1.2M metro",
    intro:
      "Amsterdam is a compact European capital known for canal-led urban form, mature cycling infrastructure, and a balanced mix of cultural depth and digital industries.",
    outlook:
      "Amsterdam reads best as a high-trust, transit-and-cycle-first city where moderate cost pressure is offset by strong public services and thoughtful climate planning.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 88, affordability: 60, airQuality: 85, energy: 89, resilience: 86 },
    metrics: [
      { label: "Overall city intelligence", value: "88", unit: "/100", score: 88, description: "Strong public services and clean-air progress balanced by housing pressure." },
      { label: "Cycling depth", value: "World-class", description: "Continuous cycling infrastructure shapes daily mobility for most residents." },
      { label: "Water adaptation", value: "Advanced", description: "Long-horizon water management supports a stable resilience profile." },
    ],
    relatedCitySlugs: ["copenhagen", "berlin", "paris"],
    modules: {
      "cost-of-living": {
        score: 60,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Amsterdam carries elevated rent and services costs, partly offset by cycling, transit, and broad public-service quality.",
        explanation:
          "The cost-of-living model weighs essential spending against mobility and service offsets. Amsterdam's transit and cycling infrastructure reduces several recurring household costs.",
        facts: [
          { label: "Affordability score", value: "60", unit: "/100", description: "Mid-tier affordability with strong service and mobility offsets.", context: "Public infrastructure offsets some daily expense." },
          { label: "Housing pressure", value: "High", description: "Central demand and limited supply keep rental markets competitive.", context: "Inner-canal districts remain especially competitive." },
          { label: "Mobility offset", value: "Very strong", description: "Cycling and transit access reduce private-vehicle costs for most households.", context: "Car-light daily life is realistic across the metro." },
        ],
      },
      "air-quality": {
        score: 85,
        sources: ["who-air", "eea-air"],
        summary:
          "Amsterdam performs well on clean air, supported by compact mobility patterns and European monitoring depth.",
        explanation:
          "Air-quality scoring weighs pollutant exposure against monitoring confidence and policy momentum. Amsterdam's mobility mix reduces long-run exposure trends.",
        facts: [
          { label: "Clean-air score", value: "85", unit: "/100", description: "Strong score relative to health-oriented pollutant benchmarks.", context: "Compact urban form reinforces the score." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO2", description: "Fine particles and nitrogen dioxide remain the central health benchmarks.", context: "Traffic-corridor exposure is concentrated, not metro-wide." },
          { label: "Monitoring confidence", value: "High", description: "European reporting standards support comparability and accountability.", context: "Trend visibility is strong year on year." },
        ],
      },
      energy: {
        score: 89,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Amsterdam has a clear clean-energy direction with district heat, offshore wind context, and active building-efficiency policy.",
        explanation:
          "Energy readiness scoring weighs renewable progress, building efficiency, and adaptation. Amsterdam benefits from a strong national wind and policy backdrop.",
        facts: [
          { label: "Energy readiness", value: "89", unit: "/100", description: "Strong policy and infrastructure base support the transition score.", context: "Wind and district-heat strategy carry most of the lift." },
          { label: "Primary transition lever", value: "Building heat", description: "Older building stock makes heat-pump and insulation upgrades a key lever.", context: "Heat-network expansion supports decarbonization." },
          { label: "Climate stressor", value: "Sea level and rain", description: "Coastal pressure and intense rainfall shape adaptation priorities.", context: "Water-management capacity is a major strength." },
        ],
      },
      safety: {
        score: 88,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Amsterdam scores high on safety, with low violent-crime context and strong everyday public-space confidence.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Amsterdam performs strongly across all three.",
        facts: [
          { label: "Safety score", value: "88", unit: "/100", description: "High score with strong day-to-day stability.", context: "Resident experience is consistent across most districts." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Public-space confidence is widely positive." },
          { label: "Watch item", value: "Bike theft", description: "Property-related opportunistic risks are the main practical concern.", context: "Locking practices and registration help." },
        ],
      },
      "internet-speed": {
        score: 90,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Amsterdam offers fast fiber broadband and reliable mobile coverage, supporting remote work, creative industries, and a deep digital-services sector.",
        explanation:
          "Connectivity scoring weighs fixed broadband, mobile performance, latency, and digital-readiness depth. Amsterdam's infrastructure ranks near the top in Europe.",
        facts: [
          { label: "Fixed broadband median", value: "270", unit: " Mbps", description: "Strong fixed-broadband performance supports demanding workflows.", context: "Top-tier among large European cities." },
          { label: "Mobile median", value: "150", unit: " Mbps", description: "Mobile network performance is fast and consistent.", context: "Hybrid and travel-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 76,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Amsterdam's climate-risk profile is shaped by sea-level pressure and rainfall intensity, balanced by world-class water management.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Amsterdam's hazards are real, but engineering depth raises the score.",
        facts: [
          { label: "Primary hazard", value: "Sea level and rain", description: "Coastal and rainfall pressure are the main long-run hazards.", context: "Polders, dikes, and pumps address core exposure." },
          { label: "Heat exposure", value: "Low-moderate", description: "Northern-Europe context limits sustained heat-stress impact.", context: "Summer heat is a smaller driver than for southern peers." },
          { label: "Adaptation capacity", value: "Very strong", description: "National and city-level water programs build long-run resilience.", context: "Implementation depth is a defining strength." },
        ],
      },
    },
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    countrySlug: "spain",
    countryName: "Spain",
    region: "Southern Europe",
    population: "5.6M metro",
    intro:
      "Barcelona is a Mediterranean coastal city known for compact urban form, public-space innovation, and a steady tilt toward cleaner mobility and renewable energy.",
    outlook:
      "Barcelona is most useful for users comparing public-space quality, cultural depth, and renewable progress against rising heat and tourism pressure.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 82, affordability: 64, airQuality: 78, energy: 84, resilience: 80 },
    metrics: [
      { label: "Overall city intelligence", value: "82", unit: "/100", score: 82, description: "Strong urban form and renewable resource, with rising heat exposure to manage." },
      { label: "Public-space innovation", value: "Advanced", description: "Superblocks and street redesign are reshaping daily mobility patterns." },
      { label: "Renewable resource", value: "Very strong", description: "Solar irradiance supports a favorable transition profile." },
    ],
    relatedCitySlugs: ["paris", "amsterdam", "berlin"],
    modules: {
      "cost-of-living": {
        score: 64,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Barcelona is more affordable than peer Western capitals, with rising rent pressure tied to tourism and demand for central living.",
        explanation:
          "The cost-of-living model rewards walkable cities where transit, mild climate, and outdoor amenity reduce some private costs.",
        facts: [
          { label: "Affordability score", value: "64", unit: "/100", description: "Moderate affordability shaped by steady rent growth.", context: "Walkable neighborhoods reduce some daily expense." },
          { label: "Housing pressure", value: "Rising", description: "Short-term rentals and central demand drive longer-run pressure.", context: "Inner-city districts remain especially competitive." },
          { label: "Amenity offset", value: "Strong", description: "Outdoor, transit, and public-space access reduce some private costs.", context: "Mediterranean climate supports outdoor daily life." },
        ],
      },
      "air-quality": {
        score: 78,
        sources: ["who-air", "eea-air"],
        summary:
          "Barcelona's clean-air profile is improving with mobility reform, while traffic-related and regional pollutants remain health-relevant.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Barcelona's superblocks support continued improvement.",
        facts: [
          { label: "Clean-air score", value: "78", unit: "/100", description: "Improving profile with continuing exposure pressure.", context: "Public-realm redesign reinforces the trend." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO2", description: "Traffic-related and regional pollutants remain central.", context: "Saharan-dust events occasionally affect particulate readings." },
          { label: "Policy momentum", value: "Strong", description: "Superblocks and low-emission zones support continued progress.", context: "Mobility reform builds the air-quality trend." },
        ],
      },
      energy: {
        score: 84,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Barcelona benefits from a strong solar resource, active rooftop programs, and clear urban-energy direction tied to building efficiency.",
        explanation:
          "Energy readiness scoring weighs renewable resource and policy clarity. Barcelona's climate provides high distributed-generation potential.",
        facts: [
          { label: "Energy readiness", value: "84", unit: "/100", description: "Strong solar resource and building-efficiency direction.", context: "Distributed solar carries part of the transition." },
          { label: "Primary transition lever", value: "Solar and efficiency", description: "Rooftop solar and retrofits work together as the main lever.", context: "Older buildings make efficiency upgrades a key lever." },
          { label: "Climate stressor", value: "Heat", description: "Sustained summer heat shapes cooling demand and adaptation.", context: "Heat-management programs are growing." },
        ],
      },
      safety: {
        score: 76,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Barcelona has solid overall safety, with violent-crime context low and tourist-area opportunistic risks the most visible practical concern.",
        explanation:
          "Safety scoring weighs violent-crime context, perceived safety, and neighborhood variation. Tourism-heavy cities tend to show concentrated property-crime patterns.",
        facts: [
          { label: "Safety score", value: "76", unit: "/100", description: "Solid score with neighborhood-level variation.", context: "Tourist corridors see more property-crime reports." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Pickpocketing", description: "High-traffic central areas concentrate opportunistic risk.", context: "Common-sense precautions remain useful in busy areas." },
        ],
      },
      "internet-speed": {
        score: 86,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Barcelona has fast fiber broadband and reliable mobile coverage, supporting a growing technology and creative-industry presence.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Spain's national fiber rollout supports Barcelona's strong score.",
        facts: [
          { label: "Fixed broadband median", value: "240", unit: " Mbps", description: "Strong fixed-broadband performance across the metro.", context: "Solid for streaming, calls, and remote work." },
          { label: "Mobile median", value: "130", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 68,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Barcelona faces rising heat and water-stress pressure, balanced by active adaptation programs and regional planning depth.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Mediterranean cities face concurrent heat and water stress.",
        facts: [
          { label: "Primary hazard", value: "Heat and drought", description: "Sustained heat and water stress are the main hazards.", context: "Drought-cycle planning is a growing priority." },
          { label: "Flood exposure", value: "Moderate", description: "Storm and surface flooding require ongoing investment.", context: "Localized flooding events are increasing." },
          { label: "Adaptation capacity", value: "Strong", description: "Climate plans and public-space redesign build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "zurich",
    name: "Zurich",
    countrySlug: "switzerland",
    countryName: "Switzerland",
    region: "Western Europe",
    population: "1.4M metro",
    intro:
      "Zurich is a compact financial and research center known for high-quality public services, careful urban planning, and a low-carbon electricity baseline.",
    outlook:
      "Zurich is most informative for users comparing service quality, transit reliability, and clean-energy depth against high housing and services costs.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 90, affordability: 52, airQuality: 88, energy: 92, resilience: 89 },
    metrics: [
      { label: "Overall city intelligence", value: "90", unit: "/100", score: 90, description: "Top-tier services, clean-energy baseline, and transit reliability." },
      { label: "Service reliability", value: "Very high", description: "Day-to-day systems support a stable, predictable life pattern." },
      { label: "Affordability pressure", value: "High", description: "Housing and services costs are the main resident well-being constraint." },
    ],
    relatedCitySlugs: ["copenhagen", "amsterdam", "vienna"],
    modules: {
      "cost-of-living": {
        score: 52,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Zurich is among the most expensive global cities on rent and services, with strong wages and public-service quality offsetting some pressure.",
        explanation:
          "The cost-of-living model captures the gap between sticker prices and effective household pressure. Zurich's wages and services moderate the impact for residents.",
        facts: [
          { label: "Affordability score", value: "52", unit: "/100", description: "Lower score driven by globally elevated price levels.", context: "Wages and service quality offset some pressure." },
          { label: "Housing pressure", value: "Very high", description: "Long-run demand keeps central rental markets highly competitive.", context: "New entrants face the most pressure." },
          { label: "Service quality offset", value: "Strong", description: "Health, education, and transit quality reduce hidden costs.", context: "Daily-life reliability is a major strength." },
        ],
      },
      "air-quality": {
        score: 88,
        sources: ["who-air", "eea-air"],
        summary:
          "Zurich performs strongly on clean air, supported by compact transit-led mobility and rigorous European monitoring.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring confidence. Zurich's transit-first mobility and policy continuity support a healthy baseline.",
        facts: [
          { label: "Clean-air score", value: "88", unit: "/100", description: "Strong score relative to health-oriented pollutant benchmarks.", context: "Compact form and transit reinforce the score." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO2", description: "Fine particles and nitrogen dioxide remain the central benchmarks.", context: "Background levels are comparatively low." },
          { label: "Monitoring confidence", value: "High", description: "European and national reporting support clarity and accountability.", context: "Trend visibility is strong year on year." },
        ],
      },
      energy: {
        score: 92,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Zurich operates with a low-carbon electricity baseline, strong building-efficiency standards, and continuous district-energy investment.",
        explanation:
          "Energy readiness scoring weighs grid carbon intensity, building efficiency, and adaptation. Zurich's hydropower-led grid is a defining strength.",
        facts: [
          { label: "Energy readiness", value: "92", unit: "/100", description: "Very strong score across grid, buildings, and policy.", context: "Hydropower baseline gives a structural advantage." },
          { label: "Primary transition lever", value: "Building heat", description: "Heat-pump and district-heat investments target remaining emissions.", context: "Existing buildings drive the main lever." },
          { label: "Climate stressor", value: "Heat and storms", description: "Heat waves and intense rainfall shape adaptation work.", context: "Cooling demand is rising in summer." },
        ],
      },
      safety: {
        score: 91,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Zurich is among the safest large European cities, with very low violent-crime context and strong institutional response.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Zurich performs at the top of the European distribution.",
        facts: [
          { label: "Safety score", value: "91", unit: "/100", description: "Top-tier safety profile across the metro.", context: "Resident experience is consistent across districts." },
          { label: "Violent-crime context", value: "Very low", description: "Internationally low violent-crime context informs the score.", context: "Stability supports daily life and night-time activity." },
          { label: "Watch item", value: "Pickpocketing", description: "Tourist-area opportunistic risk is the main practical concern.", context: "Awareness in busy stations remains useful." },
        ],
      },
      "internet-speed": {
        score: 92,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Zurich is a connectivity leader with very fast fiber, dense mobile coverage, and a strong digital-services environment.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Zurich's infrastructure scale and policy continuity rank it near the top.",
        facts: [
          { label: "Fixed broadband median", value: "300", unit: " Mbps", description: "Among the fastest fixed-broadband performance globally.", context: "Supports demanding remote workflows." },
          { label: "Mobile median", value: "170", unit: " Mbps", description: "Mobile performance is fast and consistent.", context: "Hybrid and on-the-go productivity benefit." },
          { label: "Coverage", value: "Universal", description: "Fiber and 5G coverage reach almost every residential area.", context: "Service availability is comprehensive." },
        ],
      },
      "climate-risk": {
        score: 80,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Zurich's climate-risk profile is comparatively low, shaped mainly by heat waves and Alpine-runoff variability.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Zurich's hazards are limited; institutional capacity supports a strong score.",
        facts: [
          { label: "Primary hazard", value: "Heat and runoff", description: "Heat and Alpine-runoff variability are the main long-run hazards.", context: "Glacier change is a regional planning input." },
          { label: "Flood exposure", value: "Moderate", description: "Lake and river flood scenarios require ongoing investment.", context: "Localized flooding events are managed actively." },
          { label: "Adaptation capacity", value: "Very strong", description: "Long-term climate plans and engineering capacity build resilience.", context: "Implementation depth raises the score significantly." },
        ],
      },
    },
  },
  {
    slug: "vienna",
    name: "Vienna",
    countrySlug: "austria",
    countryName: "Austria",
    region: "Central Europe",
    population: "2.0M metro",
    intro:
      "Vienna is a Central European capital known for deep cultural infrastructure, mature public transit, and a long tradition of high-quality social housing.",
    outlook:
      "Vienna is most useful for users comparing housing access, transit depth, and cultural amenity in a mid-sized European capital.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 89, affordability: 72, airQuality: 84, energy: 87, resilience: 87 },
    metrics: [
      { label: "Overall city intelligence", value: "89", unit: "/100", score: 89, description: "Strong housing access, transit reach, and cultural amenity." },
      { label: "Public housing depth", value: "Very high", description: "Long-running social-housing programs shape household access." },
      { label: "Cultural amenity", value: "Deep", description: "Long-standing institutions and public space support resident well-being." },
    ],
    relatedCitySlugs: ["berlin", "zurich", "copenhagen"],
    modules: {
      "cost-of-living": {
        score: 72,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Vienna offers strong housing access for a major European capital, supported by mature social-housing programs and reliable public services.",
        explanation:
          "The cost-of-living model rewards cities that combine moderate prices with strong public infrastructure. Vienna's housing programs are a defining feature.",
        facts: [
          { label: "Affordability score", value: "72", unit: "/100", description: "Strong affordability for a major Western capital.", context: "Better than most Western European peers." },
          { label: "Housing access", value: "Strong", description: "Public and cooperative housing improve household options.", context: "Long-term residents benefit substantially." },
          { label: "Transport offset", value: "Very strong", description: "Annual transit pass and dense network reduce mobility costs.", context: "Car-light daily life is realistic for most households." },
        ],
      },
      "air-quality": {
        score: 84,
        sources: ["who-air", "eea-air"],
        summary:
          "Vienna's clean-air profile is strong, supported by compact transit-led mobility and continuous European monitoring.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring confidence and policy momentum. Vienna's mobility mix supports a healthy baseline.",
        facts: [
          { label: "Clean-air score", value: "84", unit: "/100", description: "Strong baseline air quality and stable improvement trend.", context: "Compact form and transit reinforce the score." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO2", description: "Fine particles and nitrogen dioxide remain the central benchmarks.", context: "Background levels are comparatively low." },
          { label: "Policy momentum", value: "Strong", description: "European air-quality rules support continued progress.", context: "Mobility transition reinforces clean-air progress." },
        ],
      },
      energy: {
        score: 87,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Vienna has strong clean-energy direction supported by national hydropower, mature district-heating, and active building retrofits.",
        explanation:
          "Energy readiness scoring weighs renewable progress, building efficiency, and grid resilience. Austria's hydropower mix gives Vienna a favorable backdrop.",
        facts: [
          { label: "Energy readiness", value: "87", unit: "/100", description: "Strong national renewable progress supports the city profile.", context: "Hydropower baseline gives a structural advantage." },
          { label: "Primary transition lever", value: "Heat decarbonization", description: "District-heat decarbonization and retrofits target remaining emissions.", context: "Existing buildings drive the main lever." },
          { label: "Climate stressor", value: "Heat", description: "Heat waves are an emerging quality-of-life concern.", context: "Cooling-demand patterns are shifting upward." },
        ],
      },
      safety: {
        score: 88,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Vienna is among the safer large European capitals, with low violent-crime context and consistent everyday public-space confidence.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Vienna performs strongly across the metro.",
        facts: [
          { label: "Safety score", value: "88", unit: "/100", description: "High score with consistent neighborhood experience.", context: "Among the safer large global cities." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Pickpocketing", description: "High-traffic transit and tourist areas concentrate opportunistic risk.", context: "Awareness in busy stations remains useful." },
        ],
      },
      "internet-speed": {
        score: 84,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Vienna offers solid broadband and reliable mobile coverage, supporting remote work and a steady digital-services sector.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Vienna scores well across the dimensions.",
        facts: [
          { label: "Fixed broadband median", value: "210", unit: " Mbps", description: "Solid fixed-broadband performance for remote work.", context: "Performance is improving as fiber expands." },
          { label: "Mobile median", value: "135", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber and cable footprints reach most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 78,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Vienna faces moderate climate exposure focused on heat waves and Danube flood scenarios, balanced by active adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Vienna's hazards are real; institutional capacity supports a healthy score.",
        facts: [
          { label: "Primary hazard", value: "Heat", description: "Sustained heat is the main public-health hazard.", context: "Adaptation programs target cooling and shade." },
          { label: "Flood exposure", value: "Moderate", description: "Danube flood scenarios require ongoing infrastructure work.", context: "Flood-protection works reduce expected impact." },
          { label: "Adaptation capacity", value: "Strong", description: "Climate plans and green-infrastructure programs build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "seoul",
    name: "Seoul",
    countrySlug: "south-korea",
    countryName: "South Korea",
    region: "East Asia",
    population: "25.6M metro",
    intro:
      "Seoul is a high-capacity East Asian megacity known for outstanding digital infrastructure, dense transit networks, and a strong technology and creative-industry presence.",
    outlook:
      "Seoul is most informative for users comparing connectivity, services, and transit reach against rising housing and air-quality pressure.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 86, affordability: 60, airQuality: 70, energy: 82, resilience: 86 },
    metrics: [
      { label: "Overall city intelligence", value: "86", unit: "/100", score: 86, description: "Top-tier connectivity and services with air-quality and housing pressure to manage." },
      { label: "Digital infrastructure", value: "Top-tier", description: "Fiber and 5G networks reach near-universal coverage." },
      { label: "Transit reliability", value: "Very high", description: "Dense rail systems support efficient daily life." },
    ],
    relatedCitySlugs: ["tokyo", "hong-kong", "singapore"],
    modules: {
      "cost-of-living": {
        score: 60,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Seoul carries elevated rent and education costs, balanced by transit reach, dense services, and broad opportunity access.",
        explanation:
          "The cost-of-living model weighs essential spending against transit and services offsets. Seoul's transit and digital services moderate several daily costs.",
        facts: [
          { label: "Affordability score", value: "60", unit: "/100", description: "Mid-tier affordability with strong transit and services offsets.", context: "Broad opportunity access offsets some pressure." },
          { label: "Housing pressure", value: "High", description: "Apartment-led demand drives rental and ownership costs.", context: "Central districts remain especially competitive." },
          { label: "Transport offset", value: "Very strong", description: "Rail and bus reach reduce vehicle dependence.", context: "Transit-heavy daily routines lower private mobility costs." },
        ],
      },
      "air-quality": {
        score: 70,
        sources: ["who-air"],
        summary:
          "Seoul's air-quality profile is improving with policy attention, while particulate exposure from regional and seasonal sources remains a key health signal.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with policy momentum. Seoul's monitoring depth and policy focus support continued improvement.",
        facts: [
          { label: "Clean-air score", value: "70", unit: "/100", description: "Improving profile with persistent particulate exposure.", context: "Trend is favorable; absolute exposure still matters." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles are weighted because of long-term health evidence.", context: "Trans-boundary and seasonal sources contribute meaningfully." },
          { label: "Policy momentum", value: "Strong", description: "National and city-level clean-air initiatives support progress.", context: "Mobility transition reinforces clean-air work." },
        ],
      },
      energy: {
        score: 82,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Seoul has strong engineering capacity and a clear energy-transition direction, with grid modernization and building efficiency as central levers.",
        explanation:
          "Energy readiness scoring weighs transition strategy, grid resilience, and adaptation. Seoul's infrastructure scale supports active transition work.",
        facts: [
          { label: "Energy readiness", value: "82", unit: "/100", description: "Strong policy and infrastructure base support the transition score.", context: "Megacity scale shapes implementation pace." },
          { label: "Primary transition lever", value: "Buildings and grid", description: "Building efficiency and grid investment together drive transition.", context: "District-heat decarbonization is a key challenge." },
          { label: "Climate stressor", value: "Heat and storms", description: "Heat waves and intense rainfall shape adaptation work.", context: "Cooling-demand patterns are shifting upward." },
        ],
      },
      safety: {
        score: 90,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Seoul is among the safer large global cities, with low violent-crime context, strong institutional response, and consistent public-space confidence.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Seoul performs strongly across the metro.",
        facts: [
          { label: "Safety score", value: "90", unit: "/100", description: "High score with consistent neighborhood experience.", context: "Among the safer large global cities." },
          { label: "Violent-crime context", value: "Very low", description: "Internationally low violent-crime context informs the score.", context: "Stability supports daily life and night-time activity." },
          { label: "Resident perception", value: "High", description: "Public-space confidence is consistently positive.", context: "Pedestrian and night-time safety are widely positive." },
        ],
      },
      "internet-speed": {
        score: 96,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Seoul is a global connectivity leader, with very fast fiber, dense 5G coverage, and a deep digital-services culture.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance, latency, and digital-readiness depth. Seoul ranks at the top globally.",
        facts: [
          { label: "Fixed broadband median", value: "360", unit: " Mbps", description: "Among the fastest fixed-broadband performance globally.", context: "Supports demanding remote and creative workflows." },
          { label: "Mobile median", value: "210", unit: " Mbps", description: "5G performance is fast and consistent.", context: "Hybrid and on-the-go productivity benefit." },
          { label: "Coverage", value: "Universal", description: "Fiber and 5G coverage are essentially universal.", context: "Service availability is comprehensive." },
        ],
      },
      "climate-risk": {
        score: 70,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Seoul faces meaningful climate exposure from heat, intense rainfall, and storm pressure, balanced by strong adaptation capacity.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Seoul's hazards are real; engineering capacity supports a healthy score.",
        facts: [
          { label: "Primary hazard", value: "Heat and rainfall", description: "Sustained heat and intense rainfall are the main hazards.", context: "Monsoon and typhoon cycles shape planning." },
          { label: "Flood exposure", value: "Moderate-high", description: "River and surface flooding pressure require ongoing investment.", context: "Major engineering programs reduce expected impact." },
          { label: "Adaptation capacity", value: "Strong", description: "Engineering and emergency-management capacity build resilience.", context: "Implementation depth supports the score." },
        ],
      },
    },
  },
  {
    slug: "hong-kong",
    name: "Hong Kong",
    countrySlug: "hong-kong",
    countryName: "Hong Kong",
    region: "East Asia",
    population: "7.5M metro",
    intro:
      "Hong Kong is a vertical, transit-first global city known for deep financial services, dense daily life, and strong cross-cultural connectivity.",
    outlook:
      "Hong Kong is most informative for users comparing transit reach, services, and digital infrastructure against high housing pressure and humid-tropical climate exposure.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 84, affordability: 50, airQuality: 70, energy: 78, resilience: 84 },
    metrics: [
      { label: "Overall city intelligence", value: "84", unit: "/100", score: 84, description: "Strong transit reach and services with housing pressure and humid-tropical exposure to manage." },
      { label: "Transit dependency", value: "Very high", description: "One of the world's most transit-dependent urban systems." },
      { label: "Housing pressure", value: "Very high", description: "Housing prices and rents are the main resident well-being constraint." },
    ],
    relatedCitySlugs: ["singapore", "tokyo", "seoul"],
    modules: {
      "cost-of-living": {
        score: 50,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Hong Kong is among the most expensive global cities on housing, with very strong transit and services partly offsetting daily costs.",
        explanation:
          "The cost-of-living model captures the gap between housing pressure and the value of dense services. Hong Kong's transit and food-services offsets are unusually strong.",
        facts: [
          { label: "Affordability score", value: "50", unit: "/100", description: "Lower score driven by globally elevated housing pressure.", context: "Density and transit reduce some daily expense." },
          { label: "Housing pressure", value: "Very high", description: "Limited land and persistent demand keep housing markets competitive.", context: "Most central districts remain highly competitive." },
          { label: "Transport offset", value: "Very strong", description: "Rail and bus reach reduce vehicle dependence almost entirely.", context: "Car-light daily life is the norm." },
        ],
      },
      "air-quality": {
        score: 70,
        sources: ["who-air"],
        summary:
          "Hong Kong's air-quality profile is improving with policy attention, while particulate and ozone exposure remain key health signals.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth. Hong Kong's monitoring is strong; pollutant levels still warrant attention.",
        facts: [
          { label: "Clean-air score", value: "70", unit: "/100", description: "Improving profile with persistent pollutant exposure.", context: "Trend is favorable; absolute exposure still matters." },
          { label: "Primary pollutant watch", value: "PM2.5 and ozone", description: "Fine particles and ozone remain central health benchmarks.", context: "Regional and local sources contribute concurrently." },
          { label: "Monitoring confidence", value: "High", description: "Public monitoring supports trend visibility.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 78,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Hong Kong has solid grid resilience and strong engineering capacity, with transition shaped by import dependence and cooling demand.",
        explanation:
          "Energy readiness scoring weighs grid resilience and transition strategy. Hong Kong's grid is reliable; clean-electricity build-out is the main lever.",
        facts: [
          { label: "Energy readiness", value: "78", unit: "/100", description: "Solid baseline with transition direction taking shape.", context: "Cooling demand shapes structural energy use." },
          { label: "Primary transition lever", value: "Clean electricity", description: "Lower-carbon electricity supply is the main outstanding lever.", context: "Import diversification is part of the strategy." },
          { label: "Climate stressor", value: "Heat and storms", description: "Sustained heat and tropical storms shape adaptation work.", context: "Adaptation and cooling demand shape energy resilience." },
        ],
      },
      safety: {
        score: 88,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Hong Kong scores high on safety with low violent-crime context and reliable institutional response across the metro.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Hong Kong performs strongly globally.",
        facts: [
          { label: "Safety score", value: "88", unit: "/100", description: "High score with consistent neighborhood experience.", context: "Among the safer large global cities." },
          { label: "Violent-crime context", value: "Very low", description: "Internationally low violent-crime context informs the score.", context: "Day-to-day stability supports daily life." },
          { label: "Watch item", value: "Property", description: "Property and opportunistic risks are the main practical concerns.", context: "Common-sense precautions in busy areas remain useful." },
        ],
      },
      "internet-speed": {
        score: 92,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Hong Kong has very fast fiber broadband and dense mobile coverage, supporting global financial services and remote work.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Hong Kong's infrastructure ranks near the top globally.",
        facts: [
          { label: "Fixed broadband median", value: "330", unit: " Mbps", description: "Among the fastest fixed-broadband performance globally.", context: "Supports demanding remote workflows." },
          { label: "Mobile median", value: "180", unit: " Mbps", description: "Mobile performance is fast and consistent.", context: "Hybrid and on-the-go productivity benefit." },
          { label: "Coverage", value: "Universal", description: "Fiber and 5G coverage reach almost every residential area.", context: "Service availability is comprehensive." },
        ],
      },
      "climate-risk": {
        score: 64,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Hong Kong faces meaningful climate exposure from typhoons, heat, and coastal pressure, balanced by strong engineering capacity.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Hong Kong's hazards are real; engineering depth supports a healthy score.",
        facts: [
          { label: "Primary hazard", value: "Typhoons and heat", description: "Tropical storms and sustained heat are the main hazards.", context: "Concurrent hazards shape adaptation work." },
          { label: "Flood exposure", value: "Moderate", description: "Coastal and surface flooding pressure require ongoing investment.", context: "Engineering programs reduce expected impact." },
          { label: "Adaptation capacity", value: "Strong", description: "Engineering and emergency-management capacity build resilience.", context: "Implementation depth supports the score." },
        ],
      },
    },
  },
  {
    slug: "dubai",
    name: "Dubai",
    countrySlug: "united-arab-emirates",
    countryName: "United Arab Emirates",
    region: "Western Asia",
    population: "3.7M metro",
    intro:
      "Dubai is a global trade and services hub known for fast-moving infrastructure, large-scale renewable-energy projects, and active climate adaptation in hot, arid conditions.",
    outlook:
      "Dubai is most informative for users comparing service depth, digital infrastructure, and renewable progress against heat exposure and water-resource constraints.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 80, affordability: 62, airQuality: 65, energy: 78, resilience: 78 },
    metrics: [
      { label: "Overall city intelligence", value: "80", unit: "/100", score: 80, description: "Strong infrastructure and service depth with heat and water-resource exposure to manage." },
      { label: "Solar resource", value: "Exceptional", description: "Among the strongest solar irradiance levels globally." },
      { label: "Heat adaptation", value: "Active", description: "Cooling demand and outdoor-design choices shape urban planning." },
    ],
    relatedCitySlugs: ["singapore", "hong-kong", "bangkok"],
    modules: {
      "cost-of-living": {
        score: 62,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Dubai is mid-tier on cost of living, with housing and services costs varying widely across districts and household profiles.",
        explanation:
          "The cost-of-living model weighs essential spending against service-quality offsets. Dubai shows strong variation between residential districts.",
        facts: [
          { label: "Affordability score", value: "62", unit: "/100", description: "Mid-tier affordability with strong variation across districts.", context: "Wide range across central and outer areas." },
          { label: "Housing pressure", value: "Moderate-high", description: "Demand from international residents shapes rental markets.", context: "New supply has eased some pressure recently." },
          { label: "Service offset", value: "Strong", description: "Health and digital services reach broad coverage.", context: "Service quality supports household well-being." },
        ],
      },
      "air-quality": {
        score: 65,
        sources: ["who-air"],
        summary:
          "Dubai's air-quality profile is shaped by desert-dust events and traffic-related pollutants, with monitoring and indoor-air strategies as key practical inputs.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring confidence. Desert-dust patterns drive much of the year-on-year variation.",
        facts: [
          { label: "Clean-air score", value: "65", unit: "/100", description: "Mid-tier baseline with episodic dust and traffic pressure.", context: "Indoor-air strategies matter on dust-event days." },
          { label: "Primary pollutant watch", value: "PM2.5 and PM10 (dust)", description: "Particulate exposure from dust events is the central benchmark.", context: "Episodic events drive most spikes." },
          { label: "Indoor-air practice", value: "Established", description: "Building codes and HVAC standards support indoor-air quality.", context: "Indoor-air management is integrated into building practice." },
        ],
      },
      energy: {
        score: 78,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Dubai has very strong solar resource and large-scale renewable projects, balanced by structural cooling demand and resource-import dynamics.",
        explanation:
          "Energy readiness scoring weighs renewable resource, grid build-out, and adaptation. Dubai's solar resource is exceptional; cooling demand shapes structural use.",
        facts: [
          { label: "Energy readiness", value: "78", unit: "/100", description: "Strong solar resource and active renewable build-out.", context: "Cooling demand shapes structural energy use." },
          { label: "Primary transition lever", value: "Solar at scale", description: "Large-scale solar parks anchor the transition strategy.", context: "Storage and grid integration are growing priorities." },
          { label: "Climate stressor", value: "Heat", description: "Sustained heat shapes cooling demand and adaptation work.", context: "Indoor and shaded-outdoor design are central." },
        ],
      },
      safety: {
        score: 88,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Dubai scores high on safety, with very low violent-crime context and reliable institutional response across the metro.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Dubai performs strongly globally.",
        facts: [
          { label: "Safety score", value: "88", unit: "/100", description: "High score with consistent neighborhood experience.", context: "Among the safer large global cities." },
          { label: "Violent-crime context", value: "Very low", description: "Internationally low violent-crime context informs the score.", context: "Stability supports daily life and night-time activity." },
          { label: "Resident perception", value: "High", description: "Public-space confidence is consistently positive.", context: "Pedestrian and night-time safety are widely positive." },
        ],
      },
      "internet-speed": {
        score: 90,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Dubai delivers fast fiber broadband and reliable 5G coverage, supporting financial services, logistics, and remote work.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Dubai ranks among the strongest in the region.",
        facts: [
          { label: "Fixed broadband median", value: "270", unit: " Mbps", description: "Strong fixed-broadband performance for remote and creative workflows.", context: "Top-tier within the region." },
          { label: "Mobile median", value: "210", unit: " Mbps", description: "5G performance is fast and consistent.", context: "Hybrid and travel-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber and 5G coverage reach most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 60,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Dubai faces meaningful climate exposure from sustained heat and water-resource constraints, balanced by active adaptation and infrastructure investment.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Dubai's heat and water hazards are real; engineering investment supports a healthy score.",
        facts: [
          { label: "Primary hazard", value: "Heat", description: "Sustained extreme heat is the main long-run hazard.", context: "Adaptation and cooling shape urban design." },
          { label: "Water resource", value: "Constrained", description: "Desalination and water-management investment are central.", context: "Long-horizon resource planning supports resilience." },
          { label: "Adaptation capacity", value: "Strong", description: "Engineering and emergency-management capacity build resilience.", context: "Implementation depth supports the score." },
        ],
      },
    },
  },
  {
    slug: "bangkok",
    name: "Bangkok",
    countrySlug: "thailand",
    countryName: "Thailand",
    region: "Southeast Asia",
    population: "10.7M metro",
    intro:
      "Bangkok is a culturally rich Southeast Asian capital known for vibrant urban life, rapidly improving connectivity, and active work on flood resilience and air quality.",
    outlook:
      "Bangkok is most useful for users comparing affordability and service density against seasonal air-quality pressure and flood exposure.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 76, affordability: 78, airQuality: 60, energy: 72, resilience: 70 },
    metrics: [
      { label: "Overall city intelligence", value: "76", unit: "/100", score: 76, description: "Strong affordability and service density with air-quality and flood exposure to manage." },
      { label: "Affordability profile", value: "Favorable", description: "Cost-of-living levels are comparatively favorable for the region." },
      { label: "Cultural depth", value: "Very high", description: "Long-standing culinary, religious, and creative ecosystems shape daily life." },
    ],
    relatedCitySlugs: ["singapore", "hong-kong", "seoul"],
    modules: {
      "cost-of-living": {
        score: 78,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Bangkok offers favorable affordability for a major Asian capital, with strong food and transit cost stability supporting daily life.",
        explanation:
          "The cost-of-living model rewards cities with stable food and transit costs. Bangkok's street-food and transit networks reduce many daily expenses.",
        facts: [
          { label: "Affordability score", value: "78", unit: "/100", description: "Strong affordability for a major Asian capital.", context: "Public food markets and transit support stable daily costs." },
          { label: "Housing pressure", value: "Moderate", description: "Rental options span a wide range across the metro.", context: "Central districts are more competitive." },
          { label: "Transport offset", value: "Strong", description: "Rail and bus reach reduce private mobility costs.", context: "Mass-transit expansion is broadening reach." },
        ],
      },
      "air-quality": {
        score: 60,
        sources: ["who-air"],
        summary:
          "Bangkok's air-quality profile is shaped by seasonal particulate exposure and traffic-related pollutants, with policy attention rising.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Bangkok's seasonal pollutant cycles drive most spikes.",
        facts: [
          { label: "Clean-air score", value: "60", unit: "/100", description: "Mid-tier baseline with persistent seasonal exposure.", context: "Dry-season particulate events drive most spikes." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles are weighted because of long-term health evidence.", context: "Agricultural-burning and traffic sources contribute." },
          { label: "Indoor-air practice", value: "Rising", description: "Air-purifier and indoor-air practice are widely adopted.", context: "Indoor-air strategies matter on high-particulate days." },
        ],
      },
      energy: {
        score: 72,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Bangkok has solid grid reliability with growing renewable build-out and active building-efficiency work in the commercial sector.",
        explanation:
          "Energy readiness scoring weighs grid reliability, transition strategy, and adaptation. Bangkok's solar resource and policy direction support steady progress.",
        facts: [
          { label: "Energy readiness", value: "72", unit: "/100", description: "Solid baseline with active transition direction.", context: "Solar and efficiency programs are growing." },
          { label: "Primary transition lever", value: "Solar and efficiency", description: "Distributed solar and building efficiency are the main levers.", context: "Commercial-sector retrofits are visible." },
          { label: "Climate stressor", value: "Heat and rainfall", description: "Sustained heat and intense rainfall shape adaptation work.", context: "Cooling demand is structural for daily life." },
        ],
      },
      safety: {
        score: 78,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Bangkok has solid overall safety with violent-crime context comparatively low and tourist-area opportunistic risks the most visible practical concern.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Tourism-heavy cities tend to show concentrated property-crime patterns.",
        facts: [
          { label: "Safety score", value: "78", unit: "/100", description: "Solid score with neighborhood-level variation.", context: "Tourist corridors see more property-crime reports." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Property and traffic", description: "Property crime and traffic safety are the main practical concerns.", context: "Common-sense precautions remain useful in busy areas." },
        ],
      },
      "internet-speed": {
        score: 85,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Bangkok offers fast fiber broadband and dense mobile coverage, supporting a growing digital-services and creative-economy sector.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Thailand's national fiber rollout supports Bangkok's strong score.",
        facts: [
          { label: "Fixed broadband median", value: "230", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "150", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 56,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Bangkok faces meaningful climate exposure from heat, intense rainfall, and long-run flood and subsidence pressure, balanced by active adaptation work.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Bangkok's hazards are concurrent; adaptation programs are scaling up.",
        facts: [
          { label: "Primary hazard", value: "Flood and heat", description: "Flooding and sustained heat are the main hazards.", context: "Land subsidence raises long-run flood pressure." },
          { label: "Flood exposure", value: "High", description: "Monsoon and coastal flood pressure require ongoing investment.", context: "Major drainage and dike programs are central." },
          { label: "Adaptation capacity", value: "Improving", description: "Climate plans and infrastructure investment build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "san-francisco",
    name: "San Francisco",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "4.7M metro",
    intro:
      "San Francisco is a global technology and innovation hub known for deep research universities, walkable urban form, and mature climate-policy direction.",
    outlook:
      "San Francisco is most informative for users comparing innovation depth, transit-rich urban form, and clean-energy direction against high housing costs and seismic exposure.",
    sources: ["un-habitat", "who-air", "nasa-power", "epa-naaqs", "ipcc-urban"],
    scores: { overall: 84, affordability: 50, airQuality: 78, energy: 86, resilience: 80 },
    metrics: [
      { label: "Overall city intelligence", value: "84", unit: "/100", score: 84, description: "Strong innovation and clean-energy direction with housing and seismic exposure to manage." },
      { label: "Innovation depth", value: "Exceptional", description: "Universities and technology firms shape opportunity density." },
      { label: "Housing pressure", value: "Very high", description: "Long-run housing pressure dominates the resident cost profile." },
    ],
    relatedCitySlugs: ["new-york", "toronto", "seoul"],
    modules: {
      "cost-of-living": {
        score: 50,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "San Francisco offers exceptional opportunity access, with housing costs placing heavy pressure on household resilience.",
        explanation:
          "The cost-of-living model captures the tension between high opportunity density and high housing pressure. San Francisco shows this tradeoff sharply.",
        facts: [
          { label: "Affordability score", value: "50", unit: "/100", description: "Lower score driven by globally elevated housing pressure.", context: "Wages and opportunity offset some pressure." },
          { label: "Housing pressure", value: "Very high", description: "Long-run demand and supply constraints dominate the cost profile.", context: "Central neighborhoods remain especially competitive." },
          { label: "Opportunity offset", value: "High", description: "Innovation and research depth raise income potential.", context: "Transit reach reduces some private mobility costs." },
        ],
      },
      "air-quality": {
        score: 78,
        sources: ["who-air", "epa-naaqs"],
        summary:
          "San Francisco has a healthy baseline air profile, with episodic wildfire-smoke events as the main exposure pressure in recent years.",
        explanation:
          "Air-quality scoring weighs baseline pollutant exposure with episodic wildfire-smoke pressure. San Francisco's baseline is strong; smoke events drive most spikes.",
        facts: [
          { label: "Clean-air score", value: "78", unit: "/100", description: "Strong baseline with episodic smoke pressure.", context: "Wildfire-smoke events drive most exposure spikes." },
          { label: "Primary pollutant watch", value: "PM2.5 (smoke)", description: "Wildfire smoke is the main PM2.5 driver in recent years.", context: "Indoor-air strategies matter on smoke days." },
          { label: "Monitoring confidence", value: "High", description: "EPA standards and reporting support trend visibility.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 86,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "San Francisco operates with active climate policy, a comparatively low-carbon grid, and strong building-efficiency programs.",
        explanation:
          "Energy readiness scoring weighs grid carbon intensity, building efficiency, and adaptation. San Francisco benefits from strong state and city policy.",
        facts: [
          { label: "Energy readiness", value: "86", unit: "/100", description: "Strong policy and grid baseline support the transition score.", context: "State-level policy reinforces city programs." },
          { label: "Primary transition lever", value: "Buildings and electrification", description: "Building electrification and efficiency are the central levers.", context: "Heat-pump and EV programs are growing." },
          { label: "Climate stressor", value: "Heat and wildfire", description: "Wildfire and heat shape adaptation priorities.", context: "Smoke events bring concurrent air-quality risks." },
        ],
      },
      safety: {
        score: 72,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "San Francisco has mid-tier safety with strong neighborhood variation; violent-crime context is comparatively low and property-related risks are visible.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Dense, high-throughput cities tend to have wider variation than averages suggest.",
        facts: [
          { label: "Safety score", value: "72", unit: "/100", description: "Mid-tier global score with strong neighborhood variation.", context: "Resident experience varies with neighborhood and time of day." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run trend remains favorable." },
          { label: "Watch item", value: "Property crime", description: "Vehicle break-ins are a recurring practical concern.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 90,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "San Francisco has very fast fiber broadband and dense mobile coverage, supporting a deep technology and remote-work ecosystem.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. San Francisco ranks among the strongest in North America.",
        facts: [
          { label: "Fixed broadband median", value: "300", unit: " Mbps", description: "Among the fastest fixed-broadband performance in North America.", context: "Supports demanding remote and creative workflows." },
          { label: "Mobile median", value: "180", unit: " Mbps", description: "Mobile performance is fast and consistent.", context: "Hybrid and on-the-go productivity benefit." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber and 5G coverage reach most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 65,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "San Francisco faces concurrent climate exposure from wildfire-smoke, heat, sea-level pressure, and seismic risk, balanced by strong adaptation work.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. San Francisco's hazards are real; institutional capacity supports a healthy score.",
        facts: [
          { label: "Primary hazard", value: "Wildfire and heat", description: "Wildfire-smoke and heat are the main day-to-day hazards.", context: "Smoke events bring concurrent air-quality risks." },
          { label: "Coastal exposure", value: "Moderate", description: "Sea-level rise informs long-run waterfront planning.", context: "Adaptation timelines extend into the long term." },
          { label: "Adaptation capacity", value: "Strong", description: "Climate plans and seismic engineering build resilience.", context: "Implementation depth supports the score." },
        ],
      },
    },
  },
  {
    slug: "mexico-city",
    name: "Mexico City",
    countrySlug: "mexico",
    countryName: "Mexico",
    region: "Latin America",
    population: "22.0M metro",
    intro:
      "Mexico City is a culturally vibrant Latin American capital known for deep creative and culinary traditions, dense daily life, and active work on air quality and water resilience.",
    outlook:
      "Mexico City is most useful for users comparing affordability, cultural depth, and service density against air-quality and seismic exposure.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 75, affordability: 78, airQuality: 58, energy: 70, resilience: 70 },
    metrics: [
      { label: "Overall city intelligence", value: "75", unit: "/100", score: 75, description: "Strong affordability and cultural depth with air-quality and water-resource pressure to manage." },
      { label: "Cultural depth", value: "Very high", description: "Creative, culinary, and academic ecosystems shape daily life." },
      { label: "Affordability profile", value: "Favorable", description: "Cost-of-living levels are comparatively favorable for a major capital." },
    ],
    relatedCitySlugs: ["sao-paulo", "bangkok", "new-york"],
    modules: {
      "cost-of-living": {
        score: 78,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Mexico City offers favorable affordability for a major capital, with strong food and transit cost stability supporting daily life.",
        explanation:
          "The cost-of-living model rewards cities where food, transit, and services support a stable daily life. Mexico City performs well on those dimensions.",
        facts: [
          { label: "Affordability score", value: "78", unit: "/100", description: "Strong affordability for a major capital.", context: "Markets and transit support stable daily costs." },
          { label: "Housing pressure", value: "Rising", description: "Central districts have seen rising rental pressure recently.", context: "Some neighborhoods remain especially competitive." },
          { label: "Transport offset", value: "Strong", description: "Metro and bus reach reduce vehicle dependence.", context: "Transit-heavy daily routines lower private mobility costs." },
        ],
      },
      "air-quality": {
        score: 58,
        sources: ["who-air"],
        summary:
          "Mexico City's air-quality profile is shaped by particulate, ozone, and altitude factors, with long-running policy attention and steady improvement.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Mexico City's monitoring is strong; pollutant levels still warrant attention.",
        facts: [
          { label: "Clean-air score", value: "58", unit: "/100", description: "Mid-tier baseline with persistent pollutant exposure.", context: "Trend has improved over decades." },
          { label: "Primary pollutant watch", value: "Ozone and PM2.5", description: "Ozone and fine particles are the central health benchmarks.", context: "Altitude and basin geography shape exposure." },
          { label: "Policy momentum", value: "Strong", description: "Long-running clean-air programs support continued improvement.", context: "Mobility transition reinforces clean-air work." },
        ],
      },
      energy: {
        score: 70,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Mexico City has solid grid reliability with growing renewable capacity at the national level and active work on building efficiency.",
        explanation:
          "Energy readiness scoring weighs grid reliability, transition strategy, and adaptation. Mexico City's transition reflects both city and federal direction.",
        facts: [
          { label: "Energy readiness", value: "70", unit: "/100", description: "Solid baseline with active transition direction.", context: "National renewable capacity is growing." },
          { label: "Primary transition lever", value: "Buildings and renewables", description: "Building efficiency and renewable build-out are the main levers.", context: "Distributed solar potential is high." },
          { label: "Climate stressor", value: "Water and heat", description: "Water scarcity and rising heat shape adaptation work.", context: "Water-management programs are central." },
        ],
      },
      safety: {
        score: 64,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Mexico City has mid-tier safety with strong neighborhood variation; resident experience differs widely across districts and time of day.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Mexico City shows wide variation across the metro.",
        facts: [
          { label: "Safety score", value: "64", unit: "/100", description: "Mid-tier score with strong neighborhood variation.", context: "Resident experience varies sharply by district." },
          { label: "Violent-crime context", value: "Mid", description: "Violent-crime context varies meaningfully by district.", context: "Trend visibility is supported by public reporting." },
          { label: "Watch item", value: "Property and transit", description: "Property and transit-related risks are practical day-to-day issues.", context: "Common situational awareness remains useful." },
        ],
      },
      "internet-speed": {
        score: 78,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Mexico City has solid fiber broadband and improving mobile coverage, supporting a growing remote-work and creative-industry presence.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Mexico City scores well within the region.",
        facts: [
          { label: "Fixed broadband median", value: "180", unit: " Mbps", description: "Solid fixed-broadband performance for remote work.", context: "Performance varies by district and provider." },
          { label: "Mobile median", value: "100", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber and cable footprints reach most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 62,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Mexico City faces meaningful climate exposure centered on water scarcity, subsidence, and rising heat, balanced by long-running adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Mexico City's hazards are concurrent; institutional programs are scaling up.",
        facts: [
          { label: "Primary hazard", value: "Water and heat", description: "Water scarcity and rising heat are the main hazards.", context: "Subsidence raises long-run infrastructure pressure." },
          { label: "Flood exposure", value: "Moderate", description: "Surface flooding pressure rises in the rainy season.", context: "Drainage programs are central." },
          { label: "Adaptation capacity", value: "Improving", description: "Climate plans and water programs build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "sao-paulo",
    name: "São Paulo",
    countrySlug: "brazil",
    countryName: "Brazil",
    region: "Latin America",
    population: "22.6M metro",
    intro:
      "São Paulo is a globally significant Latin American business and creative center known for deep cultural ecosystems, dense daily life, and a growing innovation sector.",
    outlook:
      "São Paulo is most useful for users comparing economic depth, cultural amenity, and connectivity progress against affordability variation and traffic-related challenges.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 76, affordability: 74, airQuality: 65, energy: 78, resilience: 72 },
    metrics: [
      { label: "Overall city intelligence", value: "76", unit: "/100", score: 76, description: "Strong economic depth and cultural amenity with traffic and inequality challenges to manage." },
      { label: "Economic depth", value: "Very high", description: "Finance, services, and creative industries shape opportunity density." },
      { label: "Cultural depth", value: "Very high", description: "Music, food, sport, and creative ecosystems shape daily life." },
    ],
    relatedCitySlugs: ["mexico-city", "bangkok", "new-york"],
    modules: {
      "cost-of-living": {
        score: 74,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "São Paulo offers comparatively favorable affordability for a major global capital, with strong variation across districts and household profiles.",
        explanation:
          "The cost-of-living model captures wide variation across central, transit-served, and outer districts. São Paulo shows this variation clearly.",
        facts: [
          { label: "Affordability score", value: "74", unit: "/100", description: "Favorable affordability with strong variation across districts.", context: "Wide range across central and outer areas." },
          { label: "Housing pressure", value: "Mixed", description: "Central districts are competitive; outer districts offer broader options.", context: "Transit-served districts are more competitive." },
          { label: "Transport offset", value: "Moderate", description: "Metro and bus reach reduce vehicle dependence in central areas.", context: "Suburban patterns still favor car ownership." },
        ],
      },
      "air-quality": {
        score: 65,
        sources: ["who-air"],
        summary:
          "São Paulo's air-quality profile is shaped by traffic-related pollutants and seasonal regional sources, with active monitoring and policy attention.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth. São Paulo's monitoring is strong; pollutant levels still warrant attention.",
        facts: [
          { label: "Clean-air score", value: "65", unit: "/100", description: "Mid-tier baseline with persistent traffic pressure.", context: "Trend has improved over decades." },
          { label: "Primary pollutant watch", value: "PM2.5 and ozone", description: "Fine particles and ozone are the central health benchmarks.", context: "Traffic and regional sources contribute concurrently." },
          { label: "Policy momentum", value: "Active", description: "Vehicle-emission and fuel programs support steady improvement.", context: "Mobility transition reinforces clean-air work." },
        ],
      },
      energy: {
        score: 78,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "São Paulo benefits from a comparatively low-carbon national electricity baseline led by hydropower, with active work on building efficiency and distributed solar.",
        explanation:
          "Energy readiness scoring weighs grid carbon intensity, building efficiency, and adaptation. Brazil's hydropower mix gives São Paulo a favorable baseline.",
        facts: [
          { label: "Energy readiness", value: "78", unit: "/100", description: "Strong grid baseline with active transition direction.", context: "Hydropower baseline gives a structural advantage." },
          { label: "Primary transition lever", value: "Solar and efficiency", description: "Distributed solar and building efficiency are the main levers.", context: "Distributed solar potential is high." },
          { label: "Climate stressor", value: "Heat and water", description: "Sustained heat and water-cycle variability shape adaptation work.", context: "Drought-cycle planning is a growing priority." },
        ],
      },
      safety: {
        score: 66,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "São Paulo has mid-tier safety with strong neighborhood variation; resident experience differs widely across districts and time of day.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. São Paulo shows wide variation across the metro.",
        facts: [
          { label: "Safety score", value: "66", unit: "/100", description: "Mid-tier score with strong neighborhood variation.", context: "Resident experience varies sharply by district." },
          { label: "Violent-crime context", value: "Mid", description: "Violent-crime context varies meaningfully by district.", context: "Long-run trend has improved in many areas." },
          { label: "Watch item", value: "Property and traffic", description: "Property and traffic-related risks are practical day-to-day issues.", context: "Common situational awareness remains useful." },
        ],
      },
      "internet-speed": {
        score: 80,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "São Paulo has fast fiber broadband and reliable mobile coverage, supporting a deep technology and creative-industry presence.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. São Paulo ranks among the strongest in the region.",
        facts: [
          { label: "Fixed broadband median", value: "230", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Top-tier within the region." },
          { label: "Mobile median", value: "110", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber and cable footprints reach most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 66,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "São Paulo faces meaningful climate exposure from heat, intense rainfall, and water-cycle variability, balanced by active adaptation work.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. São Paulo's hazards are concurrent; programs are scaling up.",
        facts: [
          { label: "Primary hazard", value: "Heat and rainfall", description: "Sustained heat and intense rainfall are the main hazards.", context: "Concurrent hazards shape adaptation work." },
          { label: "Flood exposure", value: "Moderate-high", description: "Surface flooding pressure is rising.", context: "Drainage and stormwater programs are central." },
          { label: "Adaptation capacity", value: "Improving", description: "Climate plans and infrastructure investment build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "cape-town",
    name: "Cape Town",
    countrySlug: "south-africa",
    countryName: "South Africa",
    region: "Africa",
    population: "4.8M metro",
    intro:
      "Cape Town is a coastal South African city known for striking natural surroundings, a deep tourism and creative-industry presence, and active work on energy and water resilience.",
    outlook:
      "Cape Town is most useful for users comparing outdoor amenity, cultural depth, and resilience progress against energy-supply variability and water-cycle pressure.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 74, affordability: 76, airQuality: 78, energy: 70, resilience: 72 },
    metrics: [
      { label: "Overall city intelligence", value: "74", unit: "/100", score: 74, description: "Strong outdoor amenity and cultural depth with energy and water-cycle pressure to manage." },
      { label: "Outdoor amenity", value: "Very high", description: "Coastal and mountain access supports a strong quality of daily life." },
      { label: "Water resilience", value: "Active", description: "Drought-cycle planning is integrated into urban operations." },
    ],
    relatedCitySlugs: ["sao-paulo", "auckland", "sydney"],
    modules: {
      "cost-of-living": {
        score: 76,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Cape Town offers comparatively favorable affordability for a major coastal city, with rising rent pressure in central neighborhoods.",
        explanation:
          "The cost-of-living model rewards cities where outdoor amenity, food, and transit support a stable daily life. Cape Town performs well on those dimensions.",
        facts: [
          { label: "Affordability score", value: "76", unit: "/100", description: "Favorable affordability for a major coastal city.", context: "Outdoor amenity supports a strong daily life." },
          { label: "Housing pressure", value: "Rising", description: "Central districts have seen rising rental pressure.", context: "Some neighborhoods remain especially competitive." },
          { label: "Amenity offset", value: "Strong", description: "Outdoor and natural amenity reduce some private costs.", context: "Outdoor lifestyle reduces some indoor entertainment expense." },
        ],
      },
      "air-quality": {
        score: 78,
        sources: ["who-air"],
        summary:
          "Cape Town has solid baseline air quality, with episodic regional and biomass-burning events as the main exposure spikes.",
        explanation:
          "Air-quality scoring weighs baseline pollutant exposure with episodic event pressure. Cape Town's baseline is solid; episodic events drive most spikes.",
        facts: [
          { label: "Clean-air score", value: "78", unit: "/100", description: "Strong baseline with episodic exposure spikes.", context: "Coastal context supports the baseline." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles are weighted because of long-term health evidence.", context: "Episodic biomass-burning events contribute." },
          { label: "Indoor-air practice", value: "Established", description: "Indoor-air strategies matter on episodic-event days.", context: "Coastal winds support a clean baseline." },
        ],
      },
      energy: {
        score: 70,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Cape Town has solid renewable potential and active local transition work, balanced by national grid-supply variability.",
        explanation:
          "Energy readiness scoring weighs renewable resource, grid reliability, and adaptation. Cape Town's solar resource is strong; grid reliability is the main lever.",
        facts: [
          { label: "Energy readiness", value: "70", unit: "/100", description: "Solid renewable resource with grid-reliability pressure.", context: "Local programs offset some national grid issues." },
          { label: "Primary transition lever", value: "Solar and resilience", description: "Distributed solar and resilience programs are the main levers.", context: "Backup systems are widely adopted." },
          { label: "Climate stressor", value: "Heat and drought", description: "Sustained heat and drought cycles shape adaptation work.", context: "Drought-cycle planning is central." },
        ],
      },
      safety: {
        score: 64,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Cape Town has mid-tier safety with strong neighborhood variation; resident experience differs widely across districts and time of day.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Cape Town shows wide variation across the metro.",
        facts: [
          { label: "Safety score", value: "64", unit: "/100", description: "Mid-tier score with strong neighborhood variation.", context: "Resident experience varies sharply by district." },
          { label: "Violent-crime context", value: "Mid", description: "Violent-crime context varies meaningfully by district.", context: "Trend visibility is supported by public reporting." },
          { label: "Watch item", value: "Property and travel", description: "Property crime and travel-related risks are practical concerns.", context: "Common situational awareness remains useful." },
        ],
      },
      "internet-speed": {
        score: 76,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Cape Town has solid fiber broadband and reliable mobile coverage, supporting a growing remote-work and tourism-services presence.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Cape Town scores well within the region.",
        facts: [
          { label: "Fixed broadband median", value: "150", unit: " Mbps", description: "Solid fixed-broadband performance for remote work.", context: "Performance varies by district and provider." },
          { label: "Mobile median", value: "100", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 66,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Cape Town faces meaningful climate exposure from drought, heat, and wildfire pressure, balanced by active adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Cape Town's hazards are concurrent; programs have scaled up since recent drought cycles.",
        facts: [
          { label: "Primary hazard", value: "Drought and heat", description: "Drought cycles and sustained heat are the main hazards.", context: "Wildfire pressure is rising." },
          { label: "Water resilience", value: "Active", description: "Long-horizon water programs are central to operations.", context: "Major infrastructure investment is ongoing." },
          { label: "Adaptation capacity", value: "Improving", description: "Climate plans and water programs build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "nairobi",
    name: "Nairobi",
    countrySlug: "kenya",
    countryName: "Kenya",
    region: "Africa",
    population: "5.3M metro",
    intro:
      "Nairobi is a fast-growing East African capital known for a leading mobile-services sector, deep regional services and innovation, and active work on urban transit and resilience.",
    outlook:
      "Nairobi is most informative for users comparing innovation depth, mobile-services leadership, and renewable progress against rising urban-growth pressure and traffic congestion.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 70, affordability: 80, airQuality: 64, energy: 76, resilience: 68 },
    metrics: [
      { label: "Overall city intelligence", value: "70", unit: "/100", score: 70, description: "Strong affordability and innovation depth with congestion and infrastructure pressure to manage." },
      { label: "Mobile services", value: "Leading", description: "Mobile money and digital services shape daily life and small business." },
      { label: "Innovation ecosystem", value: "Growing", description: "Regional technology and services depth supports opportunity." },
    ],
    relatedCitySlugs: ["cape-town", "bangkok", "mexico-city"],
    modules: {
      "cost-of-living": {
        score: 80,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Nairobi offers favorable affordability for a major regional capital, with strong variation across districts and household profiles.",
        explanation:
          "The cost-of-living model rewards cities where food, transit, and informal services support a stable daily life. Nairobi performs well on those dimensions.",
        facts: [
          { label: "Affordability score", value: "80", unit: "/100", description: "Strong affordability for a major capital.", context: "Wide range across central and outer areas." },
          { label: "Housing pressure", value: "Mixed", description: "Central districts are competitive; outer districts offer broader options.", context: "Newer apartment supply has eased some pressure." },
          { label: "Transport profile", value: "Mixed", description: "Bus rapid transit is expanding; minibus services remain central.", context: "Mass-transit expansion is broadening reach." },
        ],
      },
      "air-quality": {
        score: 64,
        sources: ["who-air"],
        summary:
          "Nairobi's air-quality profile is shaped by traffic-related pollutants and dust, with monitoring depth and policy attention rising.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring confidence. Nairobi's monitoring is improving; pollutant levels still warrant attention.",
        facts: [
          { label: "Clean-air score", value: "64", unit: "/100", description: "Mid-tier baseline with persistent traffic and dust pressure.", context: "Trend visibility is improving." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles are weighted because of long-term health evidence.", context: "Traffic and dust sources contribute concurrently." },
          { label: "Monitoring confidence", value: "Improving", description: "Public monitoring is expanding.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 76,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Nairobi benefits from a renewable-heavy national grid led by geothermal and hydro generation, with growing distributed solar adoption.",
        explanation:
          "Energy readiness scoring weighs grid carbon intensity, transition strategy, and adaptation. Kenya's geothermal mix gives Nairobi a favorable baseline.",
        facts: [
          { label: "Energy readiness", value: "76", unit: "/100", description: "Strong grid baseline with active transition direction.", context: "Geothermal and hydro give a structural advantage." },
          { label: "Primary transition lever", value: "Distributed solar", description: "Distributed solar and grid expansion are the main levers.", context: "Off-grid solar supports broader access." },
          { label: "Climate stressor", value: "Drought and rainfall", description: "Drought cycles and intense rainfall shape adaptation work.", context: "Water-management programs are central." },
        ],
      },
      safety: {
        score: 66,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Nairobi has mid-tier safety with strong neighborhood variation; resident experience differs widely across districts and time of day.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Nairobi shows wide variation across the metro.",
        facts: [
          { label: "Safety score", value: "66", unit: "/100", description: "Mid-tier score with strong neighborhood variation.", context: "Resident experience varies sharply by district." },
          { label: "Violent-crime context", value: "Mid", description: "Violent-crime context varies meaningfully by district.", context: "Trend visibility is improving." },
          { label: "Watch item", value: "Property and traffic", description: "Property crime and traffic-related risks are practical concerns.", context: "Common situational awareness remains useful." },
        ],
      },
      "internet-speed": {
        score: 78,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Nairobi delivers solid fiber broadband and strong mobile coverage, supporting a leading mobile-services sector and growing technology presence.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Nairobi ranks among the strongest in the region.",
        facts: [
          { label: "Fixed broadband median", value: "120", unit: " Mbps", description: "Solid fixed-broadband performance for remote work.", context: "Top-tier within the region." },
          { label: "Mobile median", value: "70", unit: " Mbps", description: "Reliable 4G mobile experience.", context: "Mobile productivity is central to daily services." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber and mobile footprints reach most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 68,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Nairobi faces meaningful climate exposure from rainfall variability, drought cycles, and rising heat, balanced by active adaptation work.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Nairobi's hazards are concurrent; programs are scaling up.",
        facts: [
          { label: "Primary hazard", value: "Rainfall and drought", description: "Rainfall variability and drought cycles are the main hazards.", context: "Concurrent hazards shape adaptation work." },
          { label: "Flood exposure", value: "Moderate", description: "Surface flooding pressure rises in the rainy season.", context: "Drainage programs are central." },
          { label: "Adaptation capacity", value: "Improving", description: "Climate plans and water programs build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "auckland",
    name: "Auckland",
    countrySlug: "new-zealand",
    countryName: "New Zealand",
    region: "Oceania",
    population: "1.7M metro",
    intro:
      "Auckland is a coastal New Zealand city known for outdoor amenity, low-carbon electricity, and a strong service-led economy.",
    outlook:
      "Auckland is most useful for users comparing outdoor amenity, clean-energy direction, and service quality against high housing pressure and storm exposure.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 84, affordability: 56, airQuality: 86, energy: 86, resilience: 82 },
    metrics: [
      { label: "Overall city intelligence", value: "84", unit: "/100", score: 84, description: "Strong outdoor amenity and clean energy with housing pressure to manage." },
      { label: "Outdoor amenity", value: "Very high", description: "Coastal and natural amenity supports a strong quality of daily life." },
      { label: "Energy mix", value: "Low-carbon", description: "Hydropower and geothermal generation support a favorable baseline." },
    ],
    relatedCitySlugs: ["sydney", "cape-town", "toronto"],
    modules: {
      "cost-of-living": {
        score: 56,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Auckland is expensive on housing and central services, partially offset by outdoor amenity and service quality.",
        explanation:
          "The cost-of-living model weighs essential spending against amenity and service offsets. Auckland's amenity is high; housing costs dominate the score.",
        facts: [
          { label: "Affordability score", value: "56", unit: "/100", description: "Lower score driven by housing pressure.", context: "Amenity and services partially offset costs." },
          { label: "Housing pressure", value: "Very high", description: "Long-run demand and supply imbalances dominate the cost profile.", context: "Inner-suburb districts remain especially competitive." },
          { label: "Amenity offset", value: "Strong", description: "Outdoor and service amenity reduce some practical costs.", context: "Outdoor lifestyle reduces some indoor entertainment expense." },
        ],
      },
      "air-quality": {
        score: 86,
        sources: ["who-air"],
        summary:
          "Auckland has strong baseline air quality, supported by coastal context and comparatively low pollutant exposure.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring confidence. Auckland's baseline is healthy; episodic events are limited.",
        facts: [
          { label: "Clean-air score", value: "86", unit: "/100", description: "Strong baseline air quality and stable trend.", context: "Coastal context supports the baseline." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO2", description: "Fine particles and nitrogen dioxide remain the central benchmarks.", context: "Background levels are comparatively low." },
          { label: "Monitoring confidence", value: "High", description: "Public monitoring supports trend visibility.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 86,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Auckland operates with a low-carbon electricity baseline led by hydropower and geothermal generation, with active building-efficiency work.",
        explanation:
          "Energy readiness scoring weighs grid carbon intensity, building efficiency, and adaptation. New Zealand's hydro and geothermal mix gives Auckland a favorable baseline.",
        facts: [
          { label: "Energy readiness", value: "86", unit: "/100", description: "Strong grid baseline supports the transition score.", context: "Hydropower and geothermal give a structural advantage." },
          { label: "Primary transition lever", value: "Buildings and transport", description: "Building electrification and EV adoption are the main levers.", context: "Heat-pump uptake is rising." },
          { label: "Climate stressor", value: "Storms and rainfall", description: "Tropical storms and intense rainfall shape adaptation work.", context: "Coastal-storm exposure is rising." },
        ],
      },
      safety: {
        score: 86,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Auckland is among the safer large global cities, with low violent-crime context and strong institutional response.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Auckland performs strongly globally.",
        facts: [
          { label: "Safety score", value: "86", unit: "/100", description: "Strong score with consistent neighborhood experience.", context: "Among the safer large global cities." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Property", description: "Property and opportunistic risks are the main practical concerns.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 84,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Auckland delivers fast fiber broadband and reliable mobile coverage, supporting remote work and a service-led economy.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Auckland scores well across the dimensions.",
        facts: [
          { label: "Fixed broadband median", value: "240", unit: " Mbps", description: "Strong fixed-broadband performance across the metro.", context: "National fiber rollout supports the score." },
          { label: "Mobile median", value: "120", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 70,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Auckland faces moderate climate exposure from storms, intense rainfall, and rising sea-level pressure, balanced by active adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Auckland's hazards are real; institutional capacity supports a healthy score.",
        facts: [
          { label: "Primary hazard", value: "Storms and rainfall", description: "Tropical storms and intense rainfall are the main hazards.", context: "Concurrent hazards shape adaptation work." },
          { label: "Flood exposure", value: "Moderate", description: "Surface flooding pressure rises in storm cycles.", context: "Drainage and stormwater programs are central." },
          { label: "Adaptation capacity", value: "Strong", description: "Climate plans and engineering capacity build resilience.", context: "Implementation depth supports the score." },
        ],
      },
    },
  },
  {
    slug: "madrid",
    name: "Madrid",
    countrySlug: "spain",
    countryName: "Spain",
    region: "Southern Europe",
    population: "6.7M metro",
    intro:
      "Madrid is a major European capital with a strong cultural identity, extensive public transport, and a growing role in business and remote work.",
    outlook:
      "Madrid is most useful for users comparing cost of living, air quality, energy, and connectivity to understand how the city fits relocation, lifestyle, and planning needs.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 83, affordability: 72, airQuality: 78, energy: 80, resilience: 78 },
    metrics: [
      { label: "Overall city intelligence", value: "83", unit: "/100", score: 83, description: "Balanced profile across affordability, services, and energy direction." },
      { label: "Public transit reach", value: "Very high", description: "Dense metro and bus networks support car-light daily life." },
      { label: "Cultural depth", value: "Very high", description: "Museums, gastronomy, and creative industries shape daily life." },
    ],
    relatedCitySlugs: ["barcelona", "lisbon", "paris"],
    modules: {
      "cost-of-living": {
        score: 72,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Madrid offers moderate affordability for a major European capital, with central rents rising and transit and food keeping daily costs balanced.",
        explanation:
          "The cost-of-living model weighs essential spending against transit and service offsets. Madrid's transit and food markets keep many household routines steady.",
        facts: [
          { label: "Affordability score", value: "72", unit: "/100", description: "Moderate affordability balanced against rising central-rent pressure.", context: "Outer districts remain more accessible than the center." },
          { label: "Housing pressure", value: "Rising", description: "Central neighborhoods are increasingly competitive for renters.", context: "Investor demand has lifted rents in popular districts." },
          { label: "Transport offset", value: "Strong", description: "Metro and bus reach reduce private mobility costs across the metro.", context: "Compact urban form supports car-light daily routines." },
        ],
      },
      "air-quality": {
        score: 78,
        sources: ["who-air", "eea-air"],
        summary:
          "Madrid performs well on baseline air quality, supported by EU monitoring, low-emission zones, and ongoing mobility reform.",
        explanation:
          "Air-quality scoring weighs pollutant exposure against monitoring confidence and policy momentum. Madrid's clean-air zone work supports the score.",
        facts: [
          { label: "Clean-air score", value: "78", unit: "/100", description: "Solid baseline with steady policy attention.", context: "European monitoring supports trend visibility." },
          { label: "Primary pollutant watch", value: "NO2 and PM2.5", description: "Traffic-related nitrogen dioxide and fine particles drive the focus.", context: "Low-emission zone policy targets these pollutants directly." },
          { label: "Monitoring confidence", value: "High", description: "European reporting standards anchor pollutant interpretation.", context: "Trend visibility supports comparable city-level framing." },
        ],
      },
      energy: {
        score: 80,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Madrid benefits from strong national renewable build-out and rising solar and efficiency activity in the building sector.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and climate-adaptation depth. Spain's renewable acceleration supports Madrid's score.",
        facts: [
          { label: "Energy readiness", value: "80", unit: "/100", description: "Strong baseline lifted by national renewable progress.", context: "Solar resource is favorable across central Spain." },
          { label: "Primary transition lever", value: "Solar and efficiency", description: "Distributed solar and building retrofits are the main levers.", context: "EU funds support efficiency programs." },
          { label: "Climate stressor", value: "Heat and dry summers", description: "Rising heat and dry-summer cycles shape adaptation work.", context: "Cooling demand grows with summer extremes." },
        ],
      },
      safety: {
        score: 84,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Madrid is among the safer large European capitals, with low violent-crime context and strong night-time public life.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Madrid's daily public life remains visibly stable.",
        facts: [
          { label: "Safety score", value: "84", unit: "/100", description: "Strong score consistent across most central districts.", context: "Stable institutional response reinforces the score." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Pickpocketing", description: "Tourist-area opportunistic risks remain the main practical pain point.", context: "Common-sense precautions remain useful in busy areas." },
        ],
      },
      "internet-speed": {
        score: 88,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Madrid offers fast fiber broadband and broad mobile coverage, supporting remote work and a growing digital-services sector.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Spain's national fiber rollout is among Europe's deepest.",
        facts: [
          { label: "Fixed broadband median", value: "260", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "150", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 72,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Madrid carries moderate climate exposure centered on heat and dry-summer water stress, balanced by EU adaptation framing and city programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Madrid's main pressure is heat; flood exposure is comparatively limited.",
        facts: [
          { label: "Primary hazard", value: "Heat and drought", description: "Rising heat and water stress are the main hazards.", context: "Inland location concentrates heat exposure." },
          { label: "Flood exposure", value: "Low", description: "Surface flooding pressure is comparatively limited.", context: "Drainage and topography reduce flood risk." },
          { label: "Adaptation capacity", value: "Strong", description: "EU framing and city programs support resilience.", context: "Tree planting and shade programs build heat resilience." },
        ],
      },
    },
  },
  {
    slug: "rome",
    name: "Rome",
    countrySlug: "italy",
    countryName: "Italy",
    region: "Southern Europe",
    population: "4.3M metro",
    intro:
      "Rome is a historic Mediterranean capital where deep cultural heritage meets a working modern metro and active climate-adaptation work.",
    outlook:
      "Rome is most useful for users weighing cultural depth and walkability against heat, mobility, and infrastructure-renewal needs.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 80, affordability: 70, airQuality: 74, energy: 76, resilience: 74 },
    metrics: [
      { label: "Overall city intelligence", value: "80", unit: "/100", score: 80, description: "Strong cultural and walkability profile balanced against mobility and heat pressure." },
      { label: "Cultural depth", value: "Exceptional", description: "Heritage sites and creative life shape daily experience." },
      { label: "Walkability", value: "Very high", description: "Compact historic core supports car-light daily life." },
    ],
    relatedCitySlugs: ["milan", "madrid", "barcelona"],
    modules: {
      "cost-of-living": {
        score: 70,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Rome offers moderate affordability for a major European capital, with central rents and tourism shaping price levels in popular districts.",
        explanation:
          "The cost-of-living model balances housing pressure with food and transit access. Rome's neighborhood food markets remain a structural offset.",
        facts: [
          { label: "Affordability score", value: "70", unit: "/100", description: "Moderate affordability with central rents on the higher side.", context: "Outer districts remain more accessible." },
          { label: "Housing pressure", value: "Rising", description: "Central districts have firmed under tourism and remote-work demand.", context: "Long-term rental supply is constrained." },
          { label: "Transport offset", value: "Mixed", description: "Bus and metro support daily life; coverage varies by district.", context: "Walking remains a practical default in the core." },
        ],
      },
      "air-quality": {
        score: 74,
        sources: ["who-air", "eea-air"],
        summary:
          "Rome's air quality is moderate-to-good with traffic-related pollutants the main focus and EU monitoring providing strong trend visibility.",
        explanation:
          "Air-quality scoring weighs pollutant exposure against monitoring confidence. Rome's pollutant context is shaped by traffic and urban form.",
        facts: [
          { label: "Clean-air score", value: "74", unit: "/100", description: "Moderate baseline with traffic pollutants the main focus.", context: "Trend visibility is strong under EU monitoring." },
          { label: "Primary pollutant watch", value: "NO2 and PM2.5", description: "Traffic emissions dominate the pollutant profile.", context: "Mobility reform targets these directly." },
          { label: "Monitoring confidence", value: "High", description: "European reporting standards anchor pollutant interpretation.", context: "Health-based benchmarks structure the score." },
        ],
      },
      energy: {
        score: 76,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Rome's energy profile reflects solid Mediterranean solar resource and ongoing national renewable build-out, with building retrofits a focus.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and climate-adaptation depth. Italy's renewable acceleration supports the score.",
        facts: [
          { label: "Energy readiness", value: "76", unit: "/100", description: "Solid baseline with building-retrofit focus.", context: "Heritage stock makes retrofits more complex." },
          { label: "Primary transition lever", value: "Buildings and solar", description: "Retrofits and distributed solar are the main levers.", context: "EU funds support efficiency upgrades." },
          { label: "Climate stressor", value: "Heat", description: "Rising summer heat shapes adaptation work.", context: "Tree planting and shade build heat resilience." },
        ],
      },
      safety: {
        score: 80,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Rome is broadly safe with low violent-crime context and tourist-area pickpocketing the most visible practical concern.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Rome's resident experience is predominantly stable.",
        facts: [
          { label: "Safety score", value: "80", unit: "/100", description: "Strong score consistent across most residential districts.", context: "Tourist-area opportunistic risks are concentrated." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Pickpocketing", description: "Tourist-area property risks are the practical concern.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 80,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Rome delivers solid fiber broadband and reliable mobile coverage, with national fiber rollout still expanding district by district.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Italy's fiber program is widening Rome's footprint.",
        facts: [
          { label: "Fixed broadband median", value: "180", unit: " Mbps", description: "Solid fixed-broadband performance for remote work.", context: "Performance varies by district and provider." },
          { label: "Mobile median", value: "120", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint is widening across central and outer districts.", context: "Service availability continues to grow." },
        ],
      },
      "climate-risk": {
        score: 72,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Rome carries moderate climate exposure centered on heat and dry-summer water stress, balanced by EU adaptation framing and city programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Rome's main pressure is heat; flood exposure is moderate.",
        facts: [
          { label: "Primary hazard", value: "Heat", description: "Rising summer heat is the main hazard.", context: "Inland Mediterranean climate concentrates heat." },
          { label: "Flood exposure", value: "Moderate", description: "River and stormwater flood pressure rises in cycles.", context: "Drainage programs are central." },
          { label: "Adaptation capacity", value: "Strong", description: "EU framing and city programs support resilience.", context: "Heritage stock makes adaptation more complex." },
        ],
      },
    },
  },
  {
    slug: "milan",
    name: "Milan",
    countrySlug: "italy",
    countryName: "Italy",
    region: "Southern Europe",
    population: "3.3M metro",
    intro:
      "Milan is Italy's economic and design capital, combining strong financial services, fashion, and creative industries with active mobility and air-quality reform.",
    outlook:
      "Milan is most useful for users comparing economic depth and design culture against air-quality pressure and rising housing costs.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 82, affordability: 64, airQuality: 70, energy: 82, resilience: 78 },
    metrics: [
      { label: "Overall city intelligence", value: "82", unit: "/100", score: 82, description: "Strong economic, design, and connectivity profile balanced against air and housing pressure." },
      { label: "Economic depth", value: "Very high", description: "Finance, design, and manufacturing shape opportunity." },
      { label: "Mobility reform", value: "Active", description: "Low-emission zones and transit upgrades shape urban form." },
    ],
    relatedCitySlugs: ["rome", "paris", "zurich"],
    modules: {
      "cost-of-living": {
        score: 64,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Milan is among Italy's most expensive metros, with rising central rents balanced by strong transit and food markets.",
        explanation:
          "The cost-of-living model weighs essential spending against transit and amenity offsets. Milan's transit reach is a meaningful daily-life offset.",
        facts: [
          { label: "Affordability score", value: "64", unit: "/100", description: "Lower score driven by rising central-rent pressure.", context: "Outer districts remain more accessible." },
          { label: "Housing pressure", value: "High", description: "Central districts are increasingly competitive for renters.", context: "Investor and remote-work demand has lifted rents." },
          { label: "Transport offset", value: "Strong", description: "Metro and tram reach reduce private mobility costs.", context: "Compact urban form supports car-light routines." },
        ],
      },
      "air-quality": {
        score: 70,
        sources: ["who-air", "eea-air"],
        summary:
          "Milan's air-quality profile is shaped by Po Valley geography, with traffic and seasonal particulate exposure the main focus and active policy response.",
        explanation:
          "Air-quality scoring weighs pollutant exposure against monitoring confidence and policy momentum. Po Valley geography concentrates seasonal exposure.",
        facts: [
          { label: "Clean-air score", value: "70", unit: "/100", description: "Mid-tier baseline with seasonal particulate pressure.", context: "Po Valley geography concentrates exposure." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO2", description: "Fine particles and traffic-related nitrogen dioxide drive focus.", context: "Low-emission zones target these directly." },
          { label: "Monitoring confidence", value: "High", description: "European reporting standards anchor interpretation.", context: "Trend visibility supports comparable framing." },
        ],
      },
      energy: {
        score: 82,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Milan benefits from a strong national renewable build-out, district heating capacity, and active building-retrofit work supported by EU funds.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation depth. Italy's renewable acceleration supports Milan's score.",
        facts: [
          { label: "Energy readiness", value: "82", unit: "/100", description: "Strong baseline lifted by district energy and policy depth.", context: "EU funds support retrofit programs." },
          { label: "Primary transition lever", value: "Buildings and renewables", description: "Retrofits and distributed solar are the main levers.", context: "District heating supports efficient heat delivery." },
          { label: "Climate stressor", value: "Heat", description: "Rising summer heat shapes adaptation work.", context: "Cooling demand grows with extremes." },
        ],
      },
      safety: {
        score: 80,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Milan is broadly safe with low violent-crime context and property-related opportunistic risks the most visible day-to-day concern.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Milan's resident experience is mostly stable.",
        facts: [
          { label: "Safety score", value: "80", unit: "/100", description: "Strong score with neighborhood-level variation.", context: "Stable institutional response reinforces the score." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Property", description: "Property-related opportunistic risks remain the practical concern.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 86,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Milan offers fast fiber broadband and dense mobile coverage, supporting financial services, design, and a growing remote-work community.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Italy's national fiber rollout reaches Milan deeply.",
        facts: [
          { label: "Fixed broadband median", value: "240", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "140", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 74,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Milan carries moderate climate exposure from heat and intense rainfall, balanced by active EU adaptation framing and city programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Milan's hazards are real; institutional capacity supports a healthy score.",
        facts: [
          { label: "Primary hazard", value: "Heat and rainfall", description: "Summer heat and intense rainfall are the main hazards.", context: "Po Valley geography concentrates both." },
          { label: "Flood exposure", value: "Moderate", description: "Surface and river flood pressure rises with intense rainfall.", context: "Drainage programs are central." },
          { label: "Adaptation capacity", value: "Strong", description: "EU framing and city programs support resilience.", context: "Tree planting and shade build heat resilience." },
        ],
      },
    },
  },
  {
    slug: "lisbon",
    name: "Lisbon",
    countrySlug: "portugal",
    countryName: "Portugal",
    region: "Southern Europe",
    population: "2.9M metro",
    intro:
      "Lisbon is a coastal European capital known for mild climate, strong creative culture, and a fast-growing remote-work and digital-services sector.",
    outlook:
      "Lisbon is most useful for users comparing affordability, climate, and connectivity for remote work or relocation against rising housing pressure.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 82, affordability: 70, airQuality: 82, energy: 82, resilience: 76 },
    metrics: [
      { label: "Overall city intelligence", value: "82", unit: "/100", score: 82, description: "Balanced lifestyle, climate, and connectivity profile with rising housing pressure to manage." },
      { label: "Climate", value: "Mild Atlantic", description: "Coastal moderation supports a comfortable year-round profile." },
      { label: "Remote-work activity", value: "Growing", description: "Coworking and digital-services activity continue to expand." },
    ],
    relatedCitySlugs: ["madrid", "barcelona", "paris"],
    modules: {
      "cost-of-living": {
        score: 70,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Lisbon offers moderate affordability for Western Europe, with central rents climbing as remote-work demand grows.",
        explanation:
          "The cost-of-living model balances housing pressure against transit and food access. Lisbon's tram and bus reach support steady daily routines.",
        facts: [
          { label: "Affordability score", value: "70", unit: "/100", description: "Moderate affordability balanced against rising rents.", context: "Outer districts remain more accessible." },
          { label: "Housing pressure", value: "High", description: "Central districts have firmed under remote-work demand.", context: "Long-term rental supply is constrained." },
          { label: "Transport offset", value: "Strong", description: "Metro, tram, and bus reach reduce private mobility costs.", context: "Compact urban form supports walkable routines." },
        ],
      },
      "air-quality": {
        score: 82,
        sources: ["who-air", "eea-air"],
        summary:
          "Lisbon performs well on baseline air quality, helped by coastal context, EU monitoring, and limited heavy industry.",
        explanation:
          "Air-quality scoring weighs pollutant exposure against monitoring confidence. Lisbon's coastal geography supports a healthy baseline.",
        facts: [
          { label: "Clean-air score", value: "82", unit: "/100", description: "Strong baseline supported by coastal context.", context: "Atlantic ventilation reduces persistent buildup." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO2", description: "Fine particles and traffic emissions remain the central focus.", context: "Mobility reform targets these directly." },
          { label: "Monitoring confidence", value: "High", description: "European reporting standards anchor interpretation.", context: "Trend visibility supports comparable framing." },
        ],
      },
      energy: {
        score: 82,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Lisbon benefits from strong national renewable build-out led by wind and solar, with active building-efficiency activity.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation depth. Portugal's renewable share supports the score.",
        facts: [
          { label: "Energy readiness", value: "82", unit: "/100", description: "Strong baseline lifted by national renewable progress.", context: "Wind and solar resources are favorable." },
          { label: "Primary transition lever", value: "Solar and efficiency", description: "Distributed solar and building retrofits are the main levers.", context: "EU funds support efficiency programs." },
          { label: "Climate stressor", value: "Heat and dry summers", description: "Rising heat and water stress shape adaptation work.", context: "Coastal context moderates extremes." },
        ],
      },
      safety: {
        score: 86,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Lisbon is among the safer European capitals, with low violent-crime context and strong public-life stability.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Lisbon's resident experience is widely stable.",
        facts: [
          { label: "Safety score", value: "86", unit: "/100", description: "Strong score across most central districts.", context: "Stable institutional response reinforces the score." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Pickpocketing", description: "Tourist-area opportunistic risks are the practical concern.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 88,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Lisbon delivers fast fiber broadband and reliable mobile coverage, supporting a vibrant remote-work and digital-services scene.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Portugal's national fiber rollout is among Europe's deepest.",
        facts: [
          { label: "Fixed broadband median", value: "260", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "150", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 72,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Lisbon carries moderate climate exposure centered on heat and dry-summer water stress, balanced by EU adaptation framing.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Lisbon's main pressure is heat and water; coastal location moderates some extremes.",
        facts: [
          { label: "Primary hazard", value: "Heat and drought", description: "Rising summer heat and dry cycles are the main hazards.", context: "Coastal context moderates some extremes." },
          { label: "Flood exposure", value: "Moderate", description: "Surface and coastal flood pressure rises in storm cycles.", context: "Drainage programs are central." },
          { label: "Adaptation capacity", value: "Strong", description: "EU framing and city programs support resilience.", context: "Tree planting and shade build heat resilience." },
        ],
      },
    },
  },
  {
    slug: "prague",
    name: "Prague",
    countrySlug: "czechia",
    countryName: "Czechia",
    region: "Central Europe",
    population: "1.3M metro",
    intro:
      "Prague is a Central European capital with strong cultural heritage, dense public transit, and a growing technology and services economy.",
    outlook:
      "Prague is most useful for users comparing affordability, services, and connectivity in Central Europe against air-quality and energy-transition needs.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 81, affordability: 74, airQuality: 76, energy: 74, resilience: 80 },
    metrics: [
      { label: "Overall city intelligence", value: "81", unit: "/100", score: 81, description: "Balanced services, transit, and cultural depth with energy-transition needs to manage." },
      { label: "Public transit", value: "Very high", description: "Metro, tram, and bus networks support car-light daily life." },
      { label: "Cultural depth", value: "Very high", description: "Heritage and creative industries shape daily life." },
    ],
    relatedCitySlugs: ["vienna", "warsaw", "berlin"],
    modules: {
      "cost-of-living": {
        score: 74,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Prague offers favorable affordability for Central Europe, with central rents rising and food and transit keeping daily costs balanced.",
        explanation:
          "The cost-of-living model balances housing pressure with food and transit access. Prague's transit reach is a structural daily-life offset.",
        facts: [
          { label: "Affordability score", value: "74", unit: "/100", description: "Favorable affordability for the region.", context: "Outer districts remain more accessible." },
          { label: "Housing pressure", value: "Rising", description: "Central districts have firmed under demand.", context: "Long-term rental supply is constrained." },
          { label: "Transport offset", value: "Strong", description: "Metro and tram reach reduce private mobility costs.", context: "Compact urban form supports car-light routines." },
        ],
      },
      "air-quality": {
        score: 76,
        sources: ["who-air", "eea-air"],
        summary:
          "Prague's air quality is moderate-to-good with seasonal heating-related particulate exposure and active EU monitoring.",
        explanation:
          "Air-quality scoring weighs pollutant exposure against monitoring confidence and policy momentum. Heating cycles concentrate seasonal exposure.",
        facts: [
          { label: "Clean-air score", value: "76", unit: "/100", description: "Solid baseline with heating-cycle seasonal pressure.", context: "Topography concentrates winter exposure." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles drive the focus during heating season.", context: "Heating reform targets these directly." },
          { label: "Monitoring confidence", value: "High", description: "European reporting standards anchor interpretation.", context: "Trend visibility supports comparable framing." },
        ],
      },
      energy: {
        score: 74,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Prague's energy profile reflects ongoing transition work, with district heating capacity and rising renewable share at the national level.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation depth. Czechia's transition is steadily progressing.",
        facts: [
          { label: "Energy readiness", value: "74", unit: "/100", description: "Solid baseline with active transition direction.", context: "EU funds support retrofit programs." },
          { label: "Primary transition lever", value: "Heating and renewables", description: "Heating decarbonization and solar are the main levers.", context: "District heating supports efficient delivery." },
          { label: "Climate stressor", value: "Heat and rainfall", description: "Rising heat and intense rainfall shape adaptation work.", context: "Cooling demand grows with extremes." },
        ],
      },
      safety: {
        score: 88,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Prague is among the safer European capitals, with low violent-crime context and consistent neighborhood experience.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Prague's resident experience is widely stable.",
        facts: [
          { label: "Safety score", value: "88", unit: "/100", description: "Strong score across most central districts.", context: "Stable institutional response reinforces the score." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Pickpocketing", description: "Tourist-area opportunistic risks are the practical concern.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 88,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Prague delivers fast fiber broadband and dense mobile coverage, supporting a growing technology and services economy.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Czechia's fiber footprint is broad in major metros.",
        facts: [
          { label: "Fixed broadband median", value: "240", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "140", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 78,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Prague carries moderate climate exposure centered on heat, intense rainfall, and river flood pressure, balanced by EU adaptation framing.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Prague's main pressures are heat and river flooding.",
        facts: [
          { label: "Primary hazard", value: "Heat and rainfall", description: "Rising heat and intense rainfall are the main hazards.", context: "Continental geography concentrates heat." },
          { label: "Flood exposure", value: "Moderate", description: "River flood pressure rises in storm cycles.", context: "Vltava flood-management programs are central." },
          { label: "Adaptation capacity", value: "Strong", description: "EU framing and city programs support resilience.", context: "Tree planting and shade build heat resilience." },
        ],
      },
    },
  },
  {
    slug: "warsaw",
    name: "Warsaw",
    countrySlug: "poland",
    countryName: "Poland",
    region: "Central Europe",
    population: "3.1M metro",
    intro:
      "Warsaw is Poland's capital and a fast-growing Central European business hub with strong public transit, expanding tech industries, and active modernization.",
    outlook:
      "Warsaw is most useful for users comparing affordability, services, and tech-sector activity in Central Europe against air-quality and energy-transition needs.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 79, affordability: 74, airQuality: 70, energy: 70, resilience: 76 },
    metrics: [
      { label: "Overall city intelligence", value: "79", unit: "/100", score: 79, description: "Strong services and tech-sector profile balanced against air and energy-transition needs." },
      { label: "Tech-sector activity", value: "Growing", description: "Software, services, and finance shape opportunity." },
      { label: "Public transit", value: "Strong", description: "Metro, tram, and bus networks support car-light daily life." },
    ],
    relatedCitySlugs: ["prague", "berlin", "vienna"],
    modules: {
      "cost-of-living": {
        score: 74,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Warsaw offers favorable affordability for a major European capital, with central rents rising and transit keeping daily costs balanced.",
        explanation:
          "The cost-of-living model balances housing pressure with food and transit access. Warsaw's transit reach offsets many daily costs.",
        facts: [
          { label: "Affordability score", value: "74", unit: "/100", description: "Favorable affordability for the region.", context: "Outer districts remain more accessible." },
          { label: "Housing pressure", value: "Rising", description: "Central districts have firmed under tech-sector demand.", context: "Long-term rental supply is constrained." },
          { label: "Transport offset", value: "Strong", description: "Metro and tram reach reduce private mobility costs.", context: "Compact urban form supports car-light routines." },
        ],
      },
      "air-quality": {
        score: 70,
        sources: ["who-air", "eea-air"],
        summary:
          "Warsaw's air quality reflects ongoing improvement with seasonal heating-related particulate exposure remaining the main focus.",
        explanation:
          "Air-quality scoring weighs pollutant exposure against monitoring confidence and policy momentum. Heating reform shapes the trend.",
        facts: [
          { label: "Clean-air score", value: "70", unit: "/100", description: "Mid-tier baseline with seasonal heating exposure.", context: "Trend has improved with heating reform." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles drive the focus during heating season.", context: "Coal-replacement programs target these directly." },
          { label: "Monitoring confidence", value: "High", description: "European reporting standards anchor interpretation.", context: "Trend visibility supports comparable framing." },
        ],
      },
      energy: {
        score: 70,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Warsaw's energy profile reflects an active transition with district heating decarbonization and rising renewable share.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation depth. Poland's transition is steadily progressing.",
        facts: [
          { label: "Energy readiness", value: "70", unit: "/100", description: "Mid-tier baseline with active transition direction.", context: "EU funds support program acceleration." },
          { label: "Primary transition lever", value: "Heating and renewables", description: "Heating decarbonization and solar are the main levers.", context: "District heating supports efficient delivery." },
          { label: "Climate stressor", value: "Heat and rainfall", description: "Rising heat and intense rainfall shape adaptation work.", context: "Cooling demand grows with extremes." },
        ],
      },
      safety: {
        score: 86,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Warsaw is among the safer European capitals, with low violent-crime context and stable resident experience.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Warsaw's daily public life is stable.",
        facts: [
          { label: "Safety score", value: "86", unit: "/100", description: "Strong score across most central districts.", context: "Stable institutional response reinforces the score." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Property", description: "Property-related opportunistic risks remain the practical concern.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 86,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Warsaw delivers fast fiber broadband and dense mobile coverage, supporting a growing tech and services economy.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Poland's fiber footprint is broad in major metros.",
        facts: [
          { label: "Fixed broadband median", value: "230", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "130", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 76,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Warsaw carries moderate climate exposure centered on heat, intense rainfall, and river flood pressure, balanced by EU adaptation framing.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Warsaw's main pressures are heat and river flooding.",
        facts: [
          { label: "Primary hazard", value: "Heat and rainfall", description: "Rising heat and intense rainfall are the main hazards.", context: "Continental geography concentrates heat." },
          { label: "Flood exposure", value: "Moderate", description: "River and stormwater flood pressure rises in cycles.", context: "Vistula flood-management programs are central." },
          { label: "Adaptation capacity", value: "Strong", description: "EU framing and city programs support resilience.", context: "Tree planting and shade build heat resilience." },
        ],
      },
    },
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "13.2M metro",
    intro:
      "Los Angeles is a major Pacific-coast metropolis with a globally significant creative economy, large port and logistics base, and active climate-adaptation work.",
    outlook:
      "Los Angeles is most useful for users comparing creative-economy depth and amenity against affordability, mobility, and climate-exposure trade-offs.",
    sources: ["un-habitat", "who-air", "nasa-power", "epa-naaqs", "ipcc-urban"],
    scores: { overall: 78, affordability: 56, airQuality: 66, energy: 80, resilience: 70 },
    metrics: [
      { label: "Overall city intelligence", value: "78", unit: "/100", score: 78, description: "Strong creative and innovation profile balanced against affordability and climate exposure." },
      { label: "Creative economy", value: "Globally leading", description: "Film, media, and design ecosystems shape opportunity." },
      { label: "Climate exposure", value: "Heat and wildfire", description: "Heat, drought, and wildfire shape adaptation priorities." },
    ],
    relatedCitySlugs: ["san-francisco", "seattle", "chicago"],
    modules: {
      "cost-of-living": {
        score: 56,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Los Angeles is expensive on housing and central services, partially offset by amenity and labor-market depth.",
        explanation:
          "The cost-of-living model balances housing pressure with services and amenity. Los Angeles' costs are dominated by housing and transport.",
        facts: [
          { label: "Affordability score", value: "56", unit: "/100", description: "Lower score driven by housing and mobility costs.", context: "Amenity and labor depth partially offset costs." },
          { label: "Housing pressure", value: "Very high", description: "Long-run demand and supply imbalances dominate the cost profile.", context: "Coastal and central districts are especially competitive." },
          { label: "Transport cost", value: "High", description: "Car dependence raises recurring household transport spend.", context: "Transit expansion is in progress but coverage varies." },
        ],
      },
      "air-quality": {
        score: 66,
        sources: ["who-air", "epa-naaqs"],
        summary:
          "Los Angeles' air-quality profile is shaped by basin geography, traffic, and seasonal wildfire smoke, with long-running policy attention.",
        explanation:
          "Air-quality scoring weighs pollutant exposure against monitoring depth and policy momentum. Basin geography concentrates pollutants.",
        facts: [
          { label: "Clean-air score", value: "66", unit: "/100", description: "Mid-tier baseline with seasonal wildfire and ozone exposure.", context: "Trend has improved meaningfully over decades." },
          { label: "Primary pollutant watch", value: "Ozone and PM2.5", description: "Ozone and fine particles are the central health benchmarks.", context: "Wildfire smoke drives episodic spikes." },
          { label: "Monitoring confidence", value: "High", description: "EPA standards and reporting anchor pollutant interpretation.", context: "Public monitoring supports trend visibility." },
        ],
      },
      energy: {
        score: 80,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Los Angeles benefits from strong solar resource, ambitious state-level transition policy, and active building and transport electrification.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. California's policy depth supports a strong score.",
        facts: [
          { label: "Energy readiness", value: "80", unit: "/100", description: "Strong baseline lifted by state policy and solar resource.", context: "Distributed solar adoption is high." },
          { label: "Primary transition lever", value: "Solar and EVs", description: "Distributed solar and EV adoption are the main levers.", context: "Charging infrastructure continues to grow." },
          { label: "Climate stressor", value: "Heat and wildfire", description: "Rising heat and wildfire shape adaptation work.", context: "Grid resilience programs target these directly." },
        ],
      },
      safety: {
        score: 70,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Los Angeles has mid-tier safety with strong neighborhood variation; resident experience differs widely across districts.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Los Angeles shows wide variation across the metro.",
        facts: [
          { label: "Safety score", value: "70", unit: "/100", description: "Mid-tier score with strong neighborhood variation.", context: "Resident experience varies sharply by district." },
          { label: "Violent-crime context", value: "Mid", description: "Violent-crime context varies meaningfully by district.", context: "Trend visibility is supported by public reporting." },
          { label: "Watch item", value: "Property", description: "Property crime is the main practical day-to-day concern.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 88,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Los Angeles delivers fast fiber broadband and dense mobile coverage, supporting media production and a large remote-work community.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Los Angeles' fiber and mobile footprint is broad.",
        facts: [
          { label: "Fixed broadband median", value: "260", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "150", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 64,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Los Angeles carries meaningful climate exposure from heat, drought, wildfire, and coastal pressure, balanced by active state-level adaptation.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Los Angeles' hazards are concurrent and require sustained investment.",
        facts: [
          { label: "Primary hazard", value: "Heat and wildfire", description: "Rising heat and wildfire are the main hazards.", context: "Drought cycles raise long-run pressure." },
          { label: "Flood exposure", value: "Moderate", description: "Surface and coastal flood pressure rises in storm cycles.", context: "Drainage programs are central." },
          { label: "Adaptation capacity", value: "Strong", description: "State and city programs support resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "chicago",
    name: "Chicago",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "9.3M metro",
    intro:
      "Chicago is a major Midwestern metropolis with a deep finance, logistics, and creative economy and a strong architecture and lakefront identity.",
    outlook:
      "Chicago is most useful for users comparing affordability, transit, and economic depth in the US Midwest against winter and air-quality considerations.",
    sources: ["un-habitat", "who-air", "nasa-power", "epa-naaqs", "ipcc-urban"],
    scores: { overall: 79, affordability: 68, airQuality: 74, energy: 76, resilience: 76 },
    metrics: [
      { label: "Overall city intelligence", value: "79", unit: "/100", score: 79, description: "Balanced economic and transit profile with affordability tilt favorable to coastal peers." },
      { label: "Public transit", value: "Strong", description: "Rail and bus reach support car-light daily life in central districts." },
      { label: "Economic depth", value: "Very high", description: "Finance, logistics, and creative industries shape opportunity." },
    ],
    relatedCitySlugs: ["new-york", "toronto", "los-angeles"],
    modules: {
      "cost-of-living": {
        score: 68,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Chicago is more affordable than US coastal peers, with central rents balanced and transit reach reducing transport costs.",
        explanation:
          "The cost-of-living model balances housing pressure with transit and services access. Chicago's transit reach offsets many costs.",
        facts: [
          { label: "Affordability score", value: "68", unit: "/100", description: "Moderate affordability favorable versus coastal peers.", context: "Outer districts remain more accessible." },
          { label: "Housing pressure", value: "Moderate", description: "Central districts are competitive but supply is broader than coastal peers.", context: "Long-term rental options span a wide range." },
          { label: "Transport offset", value: "Strong", description: "Rail and bus reach reduce private mobility costs.", context: "Transit-oriented routines lower household transport spend." },
        ],
      },
      "air-quality": {
        score: 74,
        sources: ["who-air", "epa-naaqs"],
        summary:
          "Chicago's air-quality profile is moderate-to-good, shaped by traffic and industrial sources, with strong EPA monitoring.",
        explanation:
          "Air-quality scoring weighs pollutant exposure against monitoring depth and policy momentum. Chicago's monitoring is broad.",
        facts: [
          { label: "Clean-air score", value: "74", unit: "/100", description: "Solid baseline with episodic seasonal pressure.", context: "Trend has improved meaningfully over decades." },
          { label: "Primary pollutant watch", value: "Ozone and PM2.5", description: "Ozone and fine particles are the central health benchmarks.", context: "Wildfire smoke drift drives some episodic spikes." },
          { label: "Monitoring confidence", value: "High", description: "EPA standards and reporting anchor pollutant interpretation.", context: "Public monitoring supports trend visibility." },
        ],
      },
      energy: {
        score: 76,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Chicago has solid grid reliability with strong wind resource in the region and growing building-efficiency activity.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. Midwest wind resource and state policy support the score.",
        facts: [
          { label: "Energy readiness", value: "76", unit: "/100", description: "Solid baseline with regional renewable strength.", context: "Wind resource is among the strongest in the country." },
          { label: "Primary transition lever", value: "Wind and efficiency", description: "Regional wind and building retrofits are the main levers.", context: "Federal funds support efficiency programs." },
          { label: "Climate stressor", value: "Heat and rainfall", description: "Rising heat and intense rainfall shape adaptation work.", context: "Drainage programs are central." },
        ],
      },
      safety: {
        score: 72,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Chicago has mid-tier safety with strong neighborhood variation; central districts and the Loop are widely stable for daily life.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Chicago shows wide variation across the metro.",
        facts: [
          { label: "Safety score", value: "72", unit: "/100", description: "Mid-tier score with strong neighborhood variation.", context: "Resident experience varies sharply by district." },
          { label: "Violent-crime context", value: "Mid", description: "Violent-crime context varies meaningfully by district.", context: "Trend visibility is supported by public reporting." },
          { label: "Watch item", value: "Property", description: "Property crime is the main practical day-to-day concern.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 88,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Chicago delivers fast fiber broadband and reliable mobile coverage, supporting financial services and a growing tech sector.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Chicago's fiber and mobile footprint is broad.",
        facts: [
          { label: "Fixed broadband median", value: "270", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "140", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 76,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Chicago carries moderate climate exposure from heat, intense rainfall, and lakefront stormwater pressure, balanced by active adaptation.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Chicago's main pressures are heat and rainfall-driven flooding.",
        facts: [
          { label: "Primary hazard", value: "Heat and rainfall", description: "Rising heat and intense rainfall are the main hazards.", context: "Lakefront geography moderates some heat extremes." },
          { label: "Flood exposure", value: "Moderate", description: "Surface and stormwater flood pressure rises in cycles.", context: "Drainage and stormwater programs are central." },
          { label: "Adaptation capacity", value: "Strong", description: "State and city programs support resilience.", context: "Tree planting and shade build heat resilience." },
        ],
      },
    },
  },
  {
    slug: "vancouver",
    name: "Vancouver",
    countrySlug: "canada",
    countryName: "Canada",
    region: "North America",
    population: "2.6M metro",
    intro:
      "Vancouver is a Pacific-coast Canadian city with strong outdoor amenity, low-carbon hydroelectricity, and a fast-growing tech and creative economy.",
    outlook:
      "Vancouver is most useful for users comparing outdoor amenity, clean-energy direction, and tech-sector growth against high housing pressure.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban", "iea-cities"],
    scores: { overall: 84, affordability: 56, airQuality: 86, energy: 90, resilience: 80 },
    metrics: [
      { label: "Overall city intelligence", value: "84", unit: "/100", score: 84, description: "Strong amenity and clean-energy profile balanced against high housing pressure." },
      { label: "Outdoor amenity", value: "Very high", description: "Coastal and mountain amenity supports a strong quality of daily life." },
      { label: "Energy mix", value: "Low-carbon", description: "Hydropower supports a favorable transition baseline." },
    ],
    relatedCitySlugs: ["seattle", "toronto", "auckland"],
    modules: {
      "cost-of-living": {
        score: 56,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Vancouver is expensive on housing and central services, partially offset by outdoor amenity and service depth.",
        explanation:
          "The cost-of-living model weighs essential spending against amenity and service offsets. Vancouver's amenity is high; housing dominates the score.",
        facts: [
          { label: "Affordability score", value: "56", unit: "/100", description: "Lower score driven by housing pressure.", context: "Amenity and services partially offset costs." },
          { label: "Housing pressure", value: "Very high", description: "Long-run demand and supply imbalances dominate the cost profile.", context: "Inner-suburb districts remain especially competitive." },
          { label: "Amenity offset", value: "Strong", description: "Outdoor and service amenity reduce some practical costs.", context: "Outdoor lifestyle reduces some indoor entertainment expense." },
        ],
      },
      "air-quality": {
        score: 86,
        sources: ["who-air"],
        summary:
          "Vancouver has strong baseline air quality, helped by coastal context, with episodic wildfire smoke the main seasonal concern.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring confidence. Vancouver's baseline is healthy; wildfire seasons drive most spikes.",
        facts: [
          { label: "Clean-air score", value: "86", unit: "/100", description: "Strong baseline with stable trend.", context: "Coastal context supports the baseline." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles are the central benchmark.", context: "Wildfire smoke drives episodic spikes." },
          { label: "Monitoring confidence", value: "High", description: "Public monitoring supports trend visibility.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 90,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Vancouver operates with a low-carbon electricity baseline led by hydropower, with active building and transport electrification work.",
        explanation:
          "Energy readiness scoring weighs grid carbon intensity, building efficiency, and adaptation. British Columbia's hydro mix gives a structural advantage.",
        facts: [
          { label: "Energy readiness", value: "90", unit: "/100", description: "Very strong baseline supported by hydropower.", context: "Provincial grid is among the lowest-carbon globally." },
          { label: "Primary transition lever", value: "Buildings and transport", description: "Building electrification and EV adoption are the main levers.", context: "Heat-pump uptake is rising." },
          { label: "Climate stressor", value: "Heat and rainfall", description: "Rising heat and atmospheric-river rainfall shape adaptation work.", context: "Coastal-storm exposure is rising." },
        ],
      },
      safety: {
        score: 84,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Vancouver is among the safer large North American cities, with low violent-crime context and strong institutional response.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Vancouver's resident experience is mostly stable.",
        facts: [
          { label: "Safety score", value: "84", unit: "/100", description: "Strong score with consistent neighborhood experience.", context: "Among the safer large North American cities." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Property", description: "Property and opportunistic risks are the main practical concerns.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 88,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Vancouver delivers fast fiber broadband and reliable mobile coverage, supporting a growing tech and creative economy.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Vancouver's fiber footprint is broad.",
        facts: [
          { label: "Fixed broadband median", value: "260", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "140", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 76,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Vancouver faces moderate climate exposure from heat, atmospheric-river rainfall, and seasonal wildfire smoke, balanced by active adaptation.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Vancouver's main pressures are heat and rainfall.",
        facts: [
          { label: "Primary hazard", value: "Heat and rainfall", description: "Rising heat and atmospheric-river rainfall are the main hazards.", context: "Coastal-storm exposure is rising." },
          { label: "Flood exposure", value: "Moderate", description: "Surface and coastal flood pressure rises in storm cycles.", context: "Drainage programs are central." },
          { label: "Adaptation capacity", value: "Strong", description: "Provincial and city programs support resilience.", context: "Implementation depth supports the score." },
        ],
      },
    },
  },
  {
    slug: "seattle",
    name: "Seattle",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "4.0M metro",
    intro:
      "Seattle is a Pacific-Northwest metropolis with a deep technology and aerospace economy, low-carbon hydroelectricity, and strong outdoor amenity.",
    outlook:
      "Seattle is most useful for users comparing tech-sector depth and clean-energy context against affordability and rainfall-related considerations.",
    sources: ["un-habitat", "who-air", "nasa-power", "epa-naaqs", "ipcc-urban", "iea-cities"],
    scores: { overall: 84, affordability: 60, airQuality: 84, energy: 90, resilience: 80 },
    metrics: [
      { label: "Overall city intelligence", value: "84", unit: "/100", score: 84, description: "Strong tech and clean-energy profile balanced against housing pressure." },
      { label: "Tech-sector depth", value: "Very high", description: "Software, cloud, and aerospace ecosystems shape opportunity." },
      { label: "Energy mix", value: "Low-carbon", description: "Hydropower supports a favorable transition baseline." },
    ],
    relatedCitySlugs: ["vancouver", "san-francisco", "los-angeles"],
    modules: {
      "cost-of-living": {
        score: 60,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Seattle is expensive on housing and central services, partially offset by amenity, services, and tech-sector wage depth.",
        explanation:
          "The cost-of-living model balances housing pressure with services and amenity. Seattle's costs are dominated by housing.",
        facts: [
          { label: "Affordability score", value: "60", unit: "/100", description: "Lower score driven by housing pressure.", context: "Amenity and services partially offset costs." },
          { label: "Housing pressure", value: "High", description: "Long-run demand and supply imbalances dominate the cost profile.", context: "Central districts remain especially competitive." },
          { label: "Amenity offset", value: "Strong", description: "Outdoor and service amenity reduce some practical costs.", context: "Outdoor lifestyle supports car-light routines for many." },
        ],
      },
      "air-quality": {
        score: 84,
        sources: ["who-air", "epa-naaqs"],
        summary:
          "Seattle has strong baseline air quality with episodic wildfire smoke the main seasonal concern.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring confidence. Seattle's baseline is healthy; wildfire seasons drive most spikes.",
        facts: [
          { label: "Clean-air score", value: "84", unit: "/100", description: "Strong baseline with stable trend.", context: "Coastal context supports the baseline." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles are the central benchmark.", context: "Wildfire smoke drives episodic spikes." },
          { label: "Monitoring confidence", value: "High", description: "EPA standards and reporting anchor pollutant interpretation.", context: "Health-based benchmarks structure the score." },
        ],
      },
      energy: {
        score: 90,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Seattle operates with a low-carbon electricity baseline led by hydropower, with active building and transport electrification work.",
        explanation:
          "Energy readiness scoring weighs grid carbon intensity, building efficiency, and adaptation. The Pacific-Northwest hydro mix gives a structural advantage.",
        facts: [
          { label: "Energy readiness", value: "90", unit: "/100", description: "Very strong baseline supported by hydropower.", context: "Regional grid is among the lowest-carbon nationally." },
          { label: "Primary transition lever", value: "Buildings and transport", description: "Building electrification and EV adoption are the main levers.", context: "Heat-pump uptake is rising." },
          { label: "Climate stressor", value: "Rainfall and heat", description: "Atmospheric-river rainfall and rising heat shape adaptation work.", context: "Wildfire smoke drives seasonal pressure." },
        ],
      },
      safety: {
        score: 78,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Seattle has solid overall safety with neighborhood variation and property-related opportunistic risks the main day-to-day concern.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Seattle's resident experience is mostly stable.",
        facts: [
          { label: "Safety score", value: "78", unit: "/100", description: "Solid score with neighborhood-level variation.", context: "Stable institutional response reinforces the score." },
          { label: "Violent-crime context", value: "Mid-low", description: "Violent-crime context is comparatively low globally.", context: "Trend visibility is supported by public reporting." },
          { label: "Watch item", value: "Property", description: "Property crime is the main practical day-to-day concern.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 90,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Seattle delivers fast fiber broadband and reliable mobile coverage, supporting a deep technology and remote-work community.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Seattle's fiber and mobile footprint is broad.",
        facts: [
          { label: "Fixed broadband median", value: "300", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "150", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 76,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Seattle faces moderate climate exposure from heat, atmospheric-river rainfall, and seasonal wildfire smoke, balanced by active adaptation.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Seattle's main pressures are heat and rainfall.",
        facts: [
          { label: "Primary hazard", value: "Heat and rainfall", description: "Rising heat and atmospheric-river rainfall are the main hazards.", context: "Wildfire smoke drives seasonal pressure." },
          { label: "Flood exposure", value: "Moderate", description: "Surface and coastal flood pressure rises in storm cycles.", context: "Drainage programs are central." },
          { label: "Adaptation capacity", value: "Strong", description: "State and city programs support resilience.", context: "Implementation depth supports the score." },
        ],
      },
    },
  },
  {
    slug: "buenos-aires",
    name: "Buenos Aires",
    countrySlug: "argentina",
    countryName: "Argentina",
    region: "Latin America",
    population: "15.5M metro",
    intro:
      "Buenos Aires is a major Latin American capital with a deep cultural identity, dense walkable neighborhoods, and a vibrant creative and culinary scene.",
    outlook:
      "Buenos Aires is most useful for users comparing affordability, walkability, and cultural depth against currency volatility and infrastructure modernization needs.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 76, affordability: 76, airQuality: 72, energy: 70, resilience: 72 },
    metrics: [
      { label: "Overall city intelligence", value: "76", unit: "/100", score: 76, description: "Strong cultural and walkability profile balanced against macroeconomic volatility." },
      { label: "Walkability", value: "Very high", description: "Compact urban form supports car-light daily life." },
      { label: "Cultural depth", value: "Very high", description: "Music, theater, and culinary traditions shape daily life." },
    ],
    relatedCitySlugs: ["sao-paulo", "santiago", "mexico-city"],
    modules: {
      "cost-of-living": {
        score: 76,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Buenos Aires offers favorable affordability for a major capital, with currency dynamics shaping international comparisons over time.",
        explanation:
          "The cost-of-living model weighs essential spending against transit and food access. Buenos Aires' food and transit reach support steady daily routines.",
        facts: [
          { label: "Affordability score", value: "76", unit: "/100", description: "Favorable affordability with macroeconomic variability.", context: "Currency dynamics shape international comparisons." },
          { label: "Housing pressure", value: "Moderate", description: "Rental options span a wide range across the metro.", context: "Central neighborhoods are more competitive." },
          { label: "Transport offset", value: "Strong", description: "Subway and bus reach reduce private mobility costs.", context: "Walking is a practical default in many districts." },
        ],
      },
      "air-quality": {
        score: 72,
        sources: ["who-air"],
        summary:
          "Buenos Aires has moderate-to-good baseline air quality, helped by coastal and river ventilation, with traffic the main pollutant focus.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring confidence. Buenos Aires' baseline is supported by coastal and river ventilation.",
        facts: [
          { label: "Clean-air score", value: "72", unit: "/100", description: "Solid baseline with traffic pollutants the main focus.", context: "Coastal ventilation supports the score." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO2", description: "Fine particles and traffic-related nitrogen dioxide drive focus.", context: "Trend visibility continues to expand." },
          { label: "Monitoring confidence", value: "Mid", description: "Public monitoring is improving, with continued expansion needed.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 70,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Buenos Aires has solid grid reliability with growing renewable build-out at the national level and active building-efficiency activity.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. Argentina's renewable build-out supports the score.",
        facts: [
          { label: "Energy readiness", value: "70", unit: "/100", description: "Mid-tier baseline with active transition direction.", context: "Renewable capacity is growing nationally." },
          { label: "Primary transition lever", value: "Renewables and efficiency", description: "Renewable build-out and efficiency are the main levers.", context: "Wind resource is strong nationally." },
          { label: "Climate stressor", value: "Heat and rainfall", description: "Rising heat and intense rainfall shape adaptation work.", context: "Drainage programs are central." },
        ],
      },
      safety: {
        score: 70,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Buenos Aires has mid-tier safety with neighborhood variation and property-related opportunistic risks the main day-to-day concern.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Buenos Aires shows variation across the metro.",
        facts: [
          { label: "Safety score", value: "70", unit: "/100", description: "Mid-tier score with neighborhood-level variation.", context: "Resident experience varies across districts." },
          { label: "Violent-crime context", value: "Mid", description: "Violent-crime context is moderate globally.", context: "Trend visibility is supported by public reporting." },
          { label: "Watch item", value: "Property", description: "Property crime is the main practical day-to-day concern.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 78,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Buenos Aires has solid fiber broadband and improving mobile coverage, supporting a growing remote-work and creative-industry presence.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Buenos Aires scores well within the region.",
        facts: [
          { label: "Fixed broadband median", value: "180", unit: " Mbps", description: "Solid fixed-broadband performance for remote work.", context: "Performance varies by district and provider." },
          { label: "Mobile median", value: "100", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber and cable footprints reach most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 72,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Buenos Aires carries moderate climate exposure from heat, intense rainfall, and river flood pressure, balanced by active adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Buenos Aires' main pressures are heat and rainfall-driven flooding.",
        facts: [
          { label: "Primary hazard", value: "Heat and rainfall", description: "Rising heat and intense rainfall are the main hazards.", context: "River geography concentrates flood exposure." },
          { label: "Flood exposure", value: "Moderate", description: "Surface and river flood pressure rises in storm cycles.", context: "Drainage programs are central." },
          { label: "Adaptation capacity", value: "Improving", description: "Climate plans and infrastructure investment build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "santiago",
    name: "Santiago",
    countrySlug: "chile",
    countryName: "Chile",
    region: "Latin America",
    population: "7.2M metro",
    intro:
      "Santiago is Chile's capital and economic center, with a developed metro network, growing solar capacity, and active climate-adaptation work for water and air.",
    outlook:
      "Santiago is most useful for users comparing services, transit, and connectivity in South America against air-quality and water-resilience considerations.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban", "iea-cities"],
    scores: { overall: 76, affordability: 70, airQuality: 64, energy: 78, resilience: 72 },
    metrics: [
      { label: "Overall city intelligence", value: "76", unit: "/100", score: 76, description: "Strong services and energy direction with air-quality and water-resource pressure to manage." },
      { label: "Public transit", value: "Strong", description: "Metro network supports car-light daily life in central districts." },
      { label: "Solar resource", value: "Very strong", description: "National solar capacity is among the strongest globally." },
    ],
    relatedCitySlugs: ["buenos-aires", "lima", "sao-paulo"],
    modules: {
      "cost-of-living": {
        score: 70,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Santiago offers moderate affordability for a major Latin American capital, with central rents and services balanced against transit reach.",
        explanation:
          "The cost-of-living model balances housing pressure with transit and food access. Santiago's metro reach supports steady daily routines.",
        facts: [
          { label: "Affordability score", value: "70", unit: "/100", description: "Moderate affordability with rising central rents.", context: "Outer districts remain more accessible." },
          { label: "Housing pressure", value: "Rising", description: "Central districts have firmed under demand.", context: "Long-term rental supply is constrained." },
          { label: "Transport offset", value: "Strong", description: "Metro and bus reach reduce private mobility costs.", context: "Compact urban form supports car-light routines." },
        ],
      },
      "air-quality": {
        score: 64,
        sources: ["who-air"],
        summary:
          "Santiago's air-quality profile is shaped by basin geography, with seasonal heating-related particulate exposure and active policy attention.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Basin geography concentrates seasonal exposure.",
        facts: [
          { label: "Clean-air score", value: "64", unit: "/100", description: "Mid-tier baseline with seasonal heating pressure.", context: "Trend has improved over decades." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles drive the focus during heating season.", context: "Heating reform targets these directly." },
          { label: "Monitoring confidence", value: "High", description: "Public monitoring supports trend visibility.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 78,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Santiago benefits from one of the strongest national solar build-outs globally, with active building and transport electrification work.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. Chile's solar acceleration supports the score.",
        facts: [
          { label: "Energy readiness", value: "78", unit: "/100", description: "Strong baseline lifted by national solar build-out.", context: "Solar resource in central Chile is exceptional." },
          { label: "Primary transition lever", value: "Solar and electrification", description: "Distributed solar and EV adoption are the main levers.", context: "Charging infrastructure continues to grow." },
          { label: "Climate stressor", value: "Drought and heat", description: "Long-running drought and rising heat shape adaptation work.", context: "Water-management programs are central." },
        ],
      },
      safety: {
        score: 76,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Santiago has solid overall safety with neighborhood variation; property-related opportunistic risks remain the main day-to-day concern.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Santiago's resident experience is mostly stable.",
        facts: [
          { label: "Safety score", value: "76", unit: "/100", description: "Solid score with neighborhood-level variation.", context: "Stable institutional response reinforces the score." },
          { label: "Violent-crime context", value: "Mid-low", description: "Violent-crime context is comparatively low for the region.", context: "Trend visibility is supported by public reporting." },
          { label: "Watch item", value: "Property", description: "Property crime is the main practical day-to-day concern.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 84,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Santiago delivers fast fiber broadband and reliable mobile coverage, supporting a growing technology and services sector.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Chile's fiber rollout reaches Santiago broadly.",
        facts: [
          { label: "Fixed broadband median", value: "230", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "120", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 70,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Santiago faces meaningful climate exposure centered on long-running drought and rising heat, balanced by active water and adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Santiago's main pressures are drought and heat.",
        facts: [
          { label: "Primary hazard", value: "Drought and heat", description: "Long-running drought and rising heat are the main hazards.", context: "Water scarcity raises long-run pressure." },
          { label: "Seismic exposure", value: "Meaningful", description: "Earthquake exposure shapes building and infrastructure standards.", context: "Engineering codes are mature." },
          { label: "Adaptation capacity", value: "Improving", description: "Climate plans and water programs build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "bogota",
    name: "Bogotá",
    countrySlug: "colombia",
    countryName: "Colombia",
    region: "Latin America",
    population: "11.7M metro",
    intro:
      "Bogotá is Colombia's capital and a high-altitude Andean city with a globally cited bus-rapid-transit network and a fast-growing services and creative economy.",
    outlook:
      "Bogotá is most useful for users comparing affordability, transit innovation, and cultural depth against altitude and infrastructure modernization needs.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 72, affordability: 80, airQuality: 64, energy: 72, resilience: 72 },
    metrics: [
      { label: "Overall city intelligence", value: "72", unit: "/100", score: 72, description: "Strong affordability and transit-innovation profile balanced against air-quality and modernization needs." },
      { label: "Affordability profile", value: "Favorable", description: "Cost-of-living levels are comparatively favorable for a major capital." },
      { label: "Bus rapid transit", value: "Globally cited", description: "TransMilenio is a widely studied BRT system." },
    ],
    relatedCitySlugs: ["lima", "mexico-city", "santiago"],
    modules: {
      "cost-of-living": {
        score: 80,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Bogotá offers strong affordability for a major Latin American capital, with food and transit costs supporting steady daily life.",
        explanation:
          "The cost-of-living model balances housing pressure with food and transit access. Bogotá's BRT and food markets support steady daily routines.",
        facts: [
          { label: "Affordability score", value: "80", unit: "/100", description: "Strong affordability for a major capital.", context: "Markets and transit support stable daily costs." },
          { label: "Housing pressure", value: "Moderate", description: "Rental options span a wide range across the metro.", context: "Central neighborhoods are more competitive." },
          { label: "Transport offset", value: "Strong", description: "BRT and bus reach reduce private mobility costs.", context: "Transit-heavy daily routines lower private mobility costs." },
        ],
      },
      "air-quality": {
        score: 64,
        sources: ["who-air"],
        summary:
          "Bogotá's air-quality profile is shaped by altitude, traffic, and basin geography, with active policy attention and public monitoring.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Bogotá's altitude and basin geography concentrate exposure.",
        facts: [
          { label: "Clean-air score", value: "64", unit: "/100", description: "Mid-tier baseline with altitude and traffic pressure.", context: "Trend visibility is improving." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO2", description: "Fine particles and traffic emissions drive focus.", context: "Mobility reform targets these directly." },
          { label: "Monitoring confidence", value: "Mid", description: "Public monitoring is improving with continued expansion.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 72,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Bogotá benefits from a renewable-heavy national grid led by hydropower, with active EV-bus deployment and building-efficiency work.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. Colombia's hydro mix supports the score.",
        facts: [
          { label: "Energy readiness", value: "72", unit: "/100", description: "Solid baseline supported by hydropower.", context: "National grid is comparatively low-carbon." },
          { label: "Primary transition lever", value: "Buildings and transport", description: "EV-bus deployment and building efficiency are the main levers.", context: "Public-fleet electrification is accelerating." },
          { label: "Climate stressor", value: "Rainfall", description: "Intense rainfall and Andean weather shape adaptation work.", context: "Drainage programs are central." },
        ],
      },
      safety: {
        score: 64,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Bogotá has mid-tier safety with neighborhood variation and property-related opportunistic risks the main day-to-day concern.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Bogotá shows wide variation across the metro.",
        facts: [
          { label: "Safety score", value: "64", unit: "/100", description: "Mid-tier score with neighborhood-level variation.", context: "Resident experience varies sharply by district." },
          { label: "Violent-crime context", value: "Mid", description: "Violent-crime context varies meaningfully by district.", context: "Trend visibility is supported by public reporting." },
          { label: "Watch item", value: "Property and transit", description: "Property and transit-related risks are practical day-to-day issues.", context: "Common situational awareness remains useful." },
        ],
      },
      "internet-speed": {
        score: 76,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Bogotá has solid fiber broadband and improving mobile coverage, supporting a fast-growing technology and services sector.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Bogotá's fiber footprint continues to expand.",
        facts: [
          { label: "Fixed broadband median", value: "160", unit: " Mbps", description: "Solid fixed-broadband performance for remote work.", context: "Performance varies by district and provider." },
          { label: "Mobile median", value: "90", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint is widening across central and outer districts.", context: "Service availability continues to grow." },
        ],
      },
      "climate-risk": {
        score: 74,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Bogotá's altitude moderates heat exposure, with intense rainfall and landslide pressure shaping adaptation priorities.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Bogotá's altitude reduces heat exposure relative to lower-elevation peers.",
        facts: [
          { label: "Primary hazard", value: "Rainfall and landslide", description: "Intense rainfall and landslide pressure are the main hazards.", context: "Andean topography concentrates exposure." },
          { label: "Heat exposure", value: "Low", description: "High altitude moderates heat-stress impact.", context: "Heat is a smaller driver than for lowland peers." },
          { label: "Adaptation capacity", value: "Improving", description: "Climate plans and infrastructure investment build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "lima",
    name: "Lima",
    countrySlug: "peru",
    countryName: "Peru",
    region: "Latin America",
    population: "11.4M metro",
    intro:
      "Lima is Peru's capital and a Pacific-coast metropolis with a deep culinary identity, growing services economy, and active work on water and air resilience.",
    outlook:
      "Lima is most useful for users comparing affordability and culinary depth against air-quality, water, and seismic adaptation needs.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 70, affordability: 78, airQuality: 60, energy: 70, resilience: 68 },
    metrics: [
      { label: "Overall city intelligence", value: "70", unit: "/100", score: 70, description: "Strong affordability and culinary depth balanced against modernization and resilience needs." },
      { label: "Culinary depth", value: "Globally cited", description: "Lima's gastronomy is among the most influential globally." },
      { label: "Affordability profile", value: "Favorable", description: "Cost-of-living levels are comparatively favorable." },
    ],
    relatedCitySlugs: ["bogota", "santiago", "mexico-city"],
    modules: {
      "cost-of-living": {
        score: 78,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Lima offers strong affordability for a major capital, with food and transit costs supporting steady daily life.",
        explanation:
          "The cost-of-living model balances housing pressure with food and transit access. Lima's markets support steady daily routines.",
        facts: [
          { label: "Affordability score", value: "78", unit: "/100", description: "Strong affordability for a major capital.", context: "Markets and transit support stable daily costs." },
          { label: "Housing pressure", value: "Moderate", description: "Rental options span a wide range across the metro.", context: "Central districts are more competitive." },
          { label: "Transport offset", value: "Mixed", description: "Bus and rail reach reduce some private mobility costs.", context: "Transit expansion continues across the metro." },
        ],
      },
      "air-quality": {
        score: 60,
        sources: ["who-air"],
        summary:
          "Lima's air-quality profile is shaped by traffic, dust, and seasonal humidity, with active monitoring and policy attention.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Lima's coastal humidity moderates some pollutants.",
        facts: [
          { label: "Clean-air score", value: "60", unit: "/100", description: "Mid-tier baseline with traffic and dust pressure.", context: "Trend visibility is improving." },
          { label: "Primary pollutant watch", value: "PM2.5 and PM10", description: "Particulate exposure drives the focus.", context: "Dust sources contribute alongside traffic." },
          { label: "Monitoring confidence", value: "Mid", description: "Public monitoring is improving with continued expansion.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 70,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Lima has solid grid reliability with growing renewable build-out and active building-efficiency work.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. Peru's hydro and renewable mix supports the score.",
        facts: [
          { label: "Energy readiness", value: "70", unit: "/100", description: "Mid-tier baseline with active transition direction.", context: "Hydropower supports a favorable grid baseline." },
          { label: "Primary transition lever", value: "Solar and efficiency", description: "Distributed solar and building efficiency are the main levers.", context: "Solar resource is favorable nationally." },
          { label: "Climate stressor", value: "Water and heat", description: "Water variability and rising heat shape adaptation work.", context: "Water-management programs are central." },
        ],
      },
      safety: {
        score: 64,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Lima has mid-tier safety with neighborhood variation and property-related opportunistic risks the main day-to-day concern.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Lima shows variation across the metro.",
        facts: [
          { label: "Safety score", value: "64", unit: "/100", description: "Mid-tier score with neighborhood-level variation.", context: "Resident experience varies across districts." },
          { label: "Violent-crime context", value: "Mid", description: "Violent-crime context varies meaningfully by district.", context: "Trend visibility is supported by public reporting." },
          { label: "Watch item", value: "Property", description: "Property crime is the main practical day-to-day concern.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 76,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Lima has solid fiber broadband and improving mobile coverage, supporting a growing technology and remote-work community.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Lima's fiber footprint continues to expand.",
        facts: [
          { label: "Fixed broadband median", value: "150", unit: " Mbps", description: "Solid fixed-broadband performance for remote work.", context: "Performance varies by district and provider." },
          { label: "Mobile median", value: "90", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint is widening across central and outer districts.", context: "Service availability continues to grow." },
        ],
      },
      "climate-risk": {
        score: 68,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Lima carries meaningful climate exposure from water variability, seismic activity, and rising heat, balanced by active adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Lima's main pressures are water and seismic.",
        facts: [
          { label: "Primary hazard", value: "Water and seismic", description: "Water variability and earthquake exposure are the main hazards.", context: "Andes water cycle shapes resource availability." },
          { label: "Flood exposure", value: "Low", description: "Coastal arid context limits surface flooding.", context: "Episodic events drive most water pressure." },
          { label: "Adaptation capacity", value: "Improving", description: "Climate plans and infrastructure investment build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "shanghai",
    name: "Shanghai",
    countrySlug: "china",
    countryName: "China",
    region: "East Asia",
    population: "29.2M metro",
    intro:
      "Shanghai is one of the world's largest urban economies, with deep finance, manufacturing, and creative industries and a globally cited transit network.",
    outlook:
      "Shanghai is most useful for users comparing economic depth, mobility, and digital infrastructure against air-quality and climate-exposure considerations.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban", "iea-cities"],
    scores: { overall: 80, affordability: 64, airQuality: 64, energy: 78, resilience: 76 },
    metrics: [
      { label: "Overall city intelligence", value: "80", unit: "/100", score: 80, description: "Strong economic and connectivity depth balanced against air-quality and climate exposure." },
      { label: "Public transit", value: "Globally leading", description: "Among the world's most extensive metro networks." },
      { label: "Economic depth", value: "Globally leading", description: "Finance, manufacturing, and trade ecosystems shape opportunity." },
    ],
    relatedCitySlugs: ["tokyo", "hong-kong", "singapore"],
    modules: {
      "cost-of-living": {
        score: 64,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Shanghai is among China's most expensive metros, with central rents balanced against deep services, food, and transit access.",
        explanation:
          "The cost-of-living model balances housing pressure with services and transit. Shanghai's transit and services depth offsets many costs.",
        facts: [
          { label: "Affordability score", value: "64", unit: "/100", description: "Lower score driven by central rents.", context: "Outer districts remain more accessible." },
          { label: "Housing pressure", value: "High", description: "Central districts remain especially competitive.", context: "Long-term rental options span a wide range." },
          { label: "Transport offset", value: "Strong", description: "Metro reach reduces private mobility costs.", context: "Transit-heavy daily routines lower household transport spend." },
        ],
      },
      "air-quality": {
        score: 64,
        sources: ["who-air"],
        summary:
          "Shanghai's air-quality profile reflects ongoing improvement with seasonal particulate exposure remaining the main focus.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Trend has improved meaningfully over the past decade.",
        facts: [
          { label: "Clean-air score", value: "64", unit: "/100", description: "Mid-tier baseline with continued improvement.", context: "Trend has improved over the past decade." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles drive the focus.", context: "Industrial and traffic sources contribute." },
          { label: "Monitoring confidence", value: "High", description: "Public monitoring supports trend visibility.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 78,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Shanghai benefits from rapid national renewable build-out, leading EV adoption, and active building-efficiency work.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. China's renewable acceleration supports the score.",
        facts: [
          { label: "Energy readiness", value: "78", unit: "/100", description: "Strong baseline lifted by national renewable progress.", context: "EV adoption is among the highest globally." },
          { label: "Primary transition lever", value: "EVs and renewables", description: "EV adoption and renewable build-out are the main levers.", context: "Charging infrastructure is broad." },
          { label: "Climate stressor", value: "Heat and storms", description: "Rising heat and tropical storms shape adaptation work.", context: "Coastal-storm exposure is rising." },
        ],
      },
      safety: {
        score: 86,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Shanghai is among the safer large global cities, with low violent-crime context and consistent neighborhood experience.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Shanghai's resident experience is widely stable.",
        facts: [
          { label: "Safety score", value: "86", unit: "/100", description: "Strong score with consistent neighborhood experience.", context: "Among the safer large global cities." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Property", description: "Property and opportunistic risks are the main practical concerns.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 86,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Shanghai delivers fast fiber broadband and dense mobile coverage, supporting a deep digital-services and finance economy.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Shanghai's fiber and mobile footprint is broad.",
        facts: [
          { label: "Fixed broadband median", value: "300", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "180", unit: " Mbps", description: "Reliable 5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 68,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Shanghai carries meaningful climate exposure from coastal flooding, typhoons, and rising heat, balanced by major adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Shanghai's main pressures are coastal flooding and storms.",
        facts: [
          { label: "Primary hazard", value: "Coastal flood and typhoon", description: "Sea-level rise and storms are the main hazards.", context: "Major flood-management programs are central." },
          { label: "Heat exposure", value: "Rising", description: "Sustained summer heat is becoming central to planning.", context: "Cooling demand is structural for daily life." },
          { label: "Adaptation capacity", value: "Strong", description: "Major adaptation investments build resilience.", context: "Implementation depth supports the score." },
        ],
      },
    },
  },
  {
    slug: "taipei",
    name: "Taipei",
    countrySlug: "taiwan",
    countryName: "Taiwan",
    region: "East Asia",
    population: "7.1M metro",
    intro:
      "Taipei is the capital of Taiwan and a dense East Asian city with strong public transit, leading semiconductor industry context, and high digital infrastructure.",
    outlook:
      "Taipei is most useful for users comparing transit, services, and connectivity in East Asia against typhoon and seismic adaptation needs.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban", "itu-connectivity"],
    scores: { overall: 84, affordability: 70, airQuality: 76, energy: 78, resilience: 80 },
    metrics: [
      { label: "Overall city intelligence", value: "84", unit: "/100", score: 84, description: "Strong transit, services, and connectivity profile balanced against climate exposure." },
      { label: "Public transit", value: "Very high", description: "Metro and bus reach support car-light daily life." },
      { label: "Tech-industry context", value: "Leading", description: "Semiconductor and electronics ecosystems shape opportunity." },
    ],
    relatedCitySlugs: ["seoul", "hong-kong", "tokyo"],
    modules: {
      "cost-of-living": {
        score: 70,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Taipei offers moderate affordability for a major East Asian capital, with central rents balanced and food and transit costs steady.",
        explanation:
          "The cost-of-living model balances housing pressure with food and transit access. Taipei's transit and food markets keep daily costs balanced.",
        facts: [
          { label: "Affordability score", value: "70", unit: "/100", description: "Moderate affordability for a major East Asian capital.", context: "Outer districts remain more accessible." },
          { label: "Housing pressure", value: "Rising", description: "Central districts have firmed under demand.", context: "Long-term rental supply is constrained." },
          { label: "Transport offset", value: "Strong", description: "Metro and bus reach reduce private mobility costs.", context: "Compact urban form supports car-light routines." },
        ],
      },
      "air-quality": {
        score: 76,
        sources: ["who-air"],
        summary:
          "Taipei has solid baseline air quality with traffic and seasonal particulate exposure the main focus and active monitoring.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Taipei's monitoring supports a clear trend.",
        facts: [
          { label: "Clean-air score", value: "76", unit: "/100", description: "Solid baseline with seasonal pressure.", context: "Trend has improved over the past decade." },
          { label: "Primary pollutant watch", value: "PM2.5 and ozone", description: "Fine particles and ozone are the central benchmarks.", context: "Long-range transport drives some seasonal exposure." },
          { label: "Monitoring confidence", value: "High", description: "Public monitoring supports trend visibility.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 78,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Taipei has solid grid reliability with rising renewable build-out and active building and transport electrification work.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. Taiwan's renewable expansion supports the score.",
        facts: [
          { label: "Energy readiness", value: "78", unit: "/100", description: "Solid baseline with active transition direction.", context: "Renewable capacity is growing nationally." },
          { label: "Primary transition lever", value: "Renewables and efficiency", description: "Solar and offshore wind build-out are the main levers.", context: "Building-efficiency programs continue to expand." },
          { label: "Climate stressor", value: "Heat and typhoons", description: "Rising heat and typhoons shape adaptation work.", context: "Coastal-storm exposure is structural." },
        ],
      },
      safety: {
        score: 90,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Taipei is among the safer large global cities, with very low violent-crime context and consistent neighborhood experience.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Taipei's resident experience is widely stable.",
        facts: [
          { label: "Safety score", value: "90", unit: "/100", description: "Very strong score with consistent neighborhood experience.", context: "Among the safest large global cities." },
          { label: "Violent-crime context", value: "Very low", description: "Violent-crime context is among the lowest globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Traffic", description: "Traffic safety remains a practical day-to-day concern.", context: "Pedestrian and scooter safety attention is useful." },
        ],
      },
      "internet-speed": {
        score: 92,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Taipei delivers very fast fiber broadband and dense mobile coverage, supporting one of Asia's strongest digital-readiness profiles.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Taiwan's fiber and 5G footprint is broad.",
        facts: [
          { label: "Fixed broadband median", value: "320", unit: " Mbps", description: "Very strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "180", unit: " Mbps", description: "Reliable 5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 70,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Taipei carries meaningful climate exposure from typhoons, intense rainfall, and seismic activity, balanced by mature engineering and adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Taipei's hazards are concurrent; engineering depth supports the score.",
        facts: [
          { label: "Primary hazard", value: "Typhoon and rainfall", description: "Tropical storms and intense rainfall are the main hazards.", context: "Engineering codes support resilience." },
          { label: "Seismic exposure", value: "Meaningful", description: "Earthquake exposure shapes building and infrastructure standards.", context: "Codes and drills are mature." },
          { label: "Adaptation capacity", value: "Strong", description: "Engineering capacity and city programs build resilience.", context: "Implementation depth supports the score." },
        ],
      },
    },
  },
  {
    slug: "kuala-lumpur",
    name: "Kuala Lumpur",
    countrySlug: "malaysia",
    countryName: "Malaysia",
    region: "Southeast Asia",
    population: "8.4M metro",
    intro:
      "Kuala Lumpur is Malaysia's capital and a multicultural Southeast Asian metropolis with growing transit, deep services, and an expanding digital economy.",
    outlook:
      "Kuala Lumpur is most useful for users comparing affordability, services, and connectivity in Southeast Asia against air-quality and heat considerations.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 76, affordability: 78, airQuality: 66, energy: 72, resilience: 72 },
    metrics: [
      { label: "Overall city intelligence", value: "76", unit: "/100", score: 76, description: "Strong affordability and services profile balanced against air and heat pressure." },
      { label: "Affordability profile", value: "Favorable", description: "Cost-of-living levels are comparatively favorable for a major capital." },
      { label: "Multicultural depth", value: "Very high", description: "Diverse cultural and culinary traditions shape daily life." },
    ],
    relatedCitySlugs: ["singapore", "bangkok", "jakarta"],
    modules: {
      "cost-of-living": {
        score: 78,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Kuala Lumpur offers strong affordability for a major Southeast Asian capital, with food and transit costs supporting steady daily life.",
        explanation:
          "The cost-of-living model balances housing pressure with food and transit access. Kuala Lumpur's hawker culture supports stable daily costs.",
        facts: [
          { label: "Affordability score", value: "78", unit: "/100", description: "Strong affordability for a major capital.", context: "Markets and transit support stable daily costs." },
          { label: "Housing pressure", value: "Moderate", description: "Rental options span a wide range across the metro.", context: "Central districts are more competitive." },
          { label: "Transport offset", value: "Strong", description: "Rail and bus reach reduce private mobility costs.", context: "Transit expansion continues across the metro." },
        ],
      },
      "air-quality": {
        score: 66,
        sources: ["who-air"],
        summary:
          "Kuala Lumpur's air quality is shaped by traffic and seasonal regional haze, with active monitoring and policy attention.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Regional haze drives episodic seasonal exposure.",
        facts: [
          { label: "Clean-air score", value: "66", unit: "/100", description: "Mid-tier baseline with seasonal haze pressure.", context: "Regional haze cycles drive episodic spikes." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles drive the focus during haze cycles.", context: "Indoor-air practice is widely adopted." },
          { label: "Monitoring confidence", value: "Mid", description: "Public monitoring is improving with continued expansion.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 72,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Kuala Lumpur has solid grid reliability with growing solar build-out and active building-efficiency work in the commercial sector.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. Malaysia's solar and efficiency direction supports the score.",
        facts: [
          { label: "Energy readiness", value: "72", unit: "/100", description: "Solid baseline with active transition direction.", context: "Solar resource is favorable nationally." },
          { label: "Primary transition lever", value: "Solar and efficiency", description: "Distributed solar and efficiency are the main levers.", context: "Commercial-sector retrofits are visible." },
          { label: "Climate stressor", value: "Heat and rainfall", description: "Sustained heat and intense rainfall shape adaptation work.", context: "Cooling demand is structural for daily life." },
        ],
      },
      safety: {
        score: 78,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Kuala Lumpur has solid overall safety with neighborhood variation and property-related opportunistic risks the main day-to-day concern.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Kuala Lumpur's resident experience is mostly stable.",
        facts: [
          { label: "Safety score", value: "78", unit: "/100", description: "Solid score with neighborhood-level variation.", context: "Stable institutional response reinforces the score." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Property", description: "Property crime is the main practical day-to-day concern.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 84,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Kuala Lumpur offers fast fiber broadband and dense mobile coverage, supporting a growing digital-services and finance sector.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Malaysia's fiber rollout reaches Kuala Lumpur deeply.",
        facts: [
          { label: "Fixed broadband median", value: "220", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "130", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 72,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Kuala Lumpur carries moderate climate exposure from heat and intense rainfall, balanced by active adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Kuala Lumpur's main pressures are heat and rainfall-driven flooding.",
        facts: [
          { label: "Primary hazard", value: "Heat and rainfall", description: "Sustained heat and intense rainfall are the main hazards.", context: "Tropical context concentrates exposure." },
          { label: "Flood exposure", value: "Moderate", description: "Surface and river flood pressure rises in storm cycles.", context: "Drainage programs are central." },
          { label: "Adaptation capacity", value: "Improving", description: "City and federal programs build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "jakarta",
    name: "Jakarta",
    countrySlug: "indonesia",
    countryName: "Indonesia",
    region: "Southeast Asia",
    population: "33.4M metro",
    intro:
      "Jakarta is Indonesia's capital and one of Southeast Asia's largest urban regions, with deep cultural variety, growing transit investment, and active climate-adaptation work.",
    outlook:
      "Jakarta is most useful for users comparing affordability, services, and connectivity in Southeast Asia against air-quality, flood, and subsidence considerations.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 70, affordability: 80, airQuality: 56, energy: 68, resilience: 64 },
    metrics: [
      { label: "Overall city intelligence", value: "70", unit: "/100", score: 70, description: "Strong affordability and cultural depth balanced against air-quality and flood pressure." },
      { label: "Affordability profile", value: "Favorable", description: "Cost-of-living levels are comparatively favorable." },
      { label: "Cultural depth", value: "Very high", description: "Diverse cultural and culinary traditions shape daily life." },
    ],
    relatedCitySlugs: ["kuala-lumpur", "manila", "bangkok"],
    modules: {
      "cost-of-living": {
        score: 80,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Jakarta offers strong affordability for a major Southeast Asian capital, with food and transit costs supporting steady daily life.",
        explanation:
          "The cost-of-living model balances housing pressure with food and transit access. Jakarta's markets and street food support stable daily costs.",
        facts: [
          { label: "Affordability score", value: "80", unit: "/100", description: "Strong affordability for a major capital.", context: "Markets and transit support stable daily costs." },
          { label: "Housing pressure", value: "Moderate", description: "Rental options span a wide range across the metro.", context: "Central districts are more competitive." },
          { label: "Transport offset", value: "Improving", description: "MRT and bus rapid transit expansion reduce mobility costs.", context: "Transit reach continues to grow." },
        ],
      },
      "air-quality": {
        score: 56,
        sources: ["who-air"],
        summary:
          "Jakarta's air-quality profile is shaped by traffic, industry, and meteorology, with active monitoring and policy attention.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Jakarta's pollutant levels warrant continued attention.",
        facts: [
          { label: "Clean-air score", value: "56", unit: "/100", description: "Lower-tier baseline with persistent pollutant exposure.", context: "Trend visibility is improving." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles drive the focus.", context: "Industrial and traffic sources contribute." },
          { label: "Monitoring confidence", value: "Mid", description: "Public monitoring is improving with continued expansion.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 68,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Jakarta's energy profile reflects an active transition with growing renewable build-out at the national level and rising efficiency programs.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. Indonesia's renewable transition is steadily progressing.",
        facts: [
          { label: "Energy readiness", value: "68", unit: "/100", description: "Mid-tier baseline with active transition direction.", context: "Solar resource is strong nationally." },
          { label: "Primary transition lever", value: "Renewables and efficiency", description: "Renewable build-out and efficiency are the main levers.", context: "Distributed solar continues to expand." },
          { label: "Climate stressor", value: "Heat and flooding", description: "Sustained heat and flooding shape adaptation work.", context: "Subsidence raises long-run flood pressure." },
        ],
      },
      safety: {
        score: 70,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Jakarta has mid-tier safety with neighborhood variation and property-related opportunistic risks the main day-to-day concern.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Jakarta shows variation across the metro.",
        facts: [
          { label: "Safety score", value: "70", unit: "/100", description: "Mid-tier score with neighborhood-level variation.", context: "Resident experience varies across districts." },
          { label: "Violent-crime context", value: "Mid-low", description: "Violent-crime context is comparatively moderate.", context: "Trend visibility is supported by public reporting." },
          { label: "Watch item", value: "Property and traffic", description: "Property crime and traffic safety are the main practical concerns.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 76,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Jakarta has solid fiber broadband and broad mobile coverage, supporting a fast-growing digital-services and creative-economy sector.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Jakarta's fiber footprint continues to expand.",
        facts: [
          { label: "Fixed broadband median", value: "150", unit: " Mbps", description: "Solid fixed-broadband performance for remote work.", context: "Performance varies by district and provider." },
          { label: "Mobile median", value: "100", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint is widening across central and outer districts.", context: "Service availability continues to grow." },
        ],
      },
      "climate-risk": {
        score: 60,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Jakarta faces meaningful climate exposure from coastal flooding, subsidence, and rising heat, balanced by major adaptation programs and a planned capital relocation.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Jakarta's hazards are concurrent and require sustained investment.",
        facts: [
          { label: "Primary hazard", value: "Flood and subsidence", description: "Coastal flooding and land subsidence are the main hazards.", context: "Long-run pressure shapes long-term planning." },
          { label: "Heat exposure", value: "High", description: "Sustained heat is structural for daily life.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Improving", description: "Major adaptation programs build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "manila",
    name: "Manila",
    countrySlug: "philippines",
    countryName: "Philippines",
    region: "Southeast Asia",
    population: "14.6M metro",
    intro:
      "Manila is the Philippines' capital and a coastal Southeast Asian metropolis with a deep services economy, growing tech sector, and active climate-adaptation work.",
    outlook:
      "Manila is most useful for users comparing affordability and services in Southeast Asia against typhoon, flood, and infrastructure modernization needs.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 70, affordability: 78, airQuality: 60, energy: 66, resilience: 60 },
    metrics: [
      { label: "Overall city intelligence", value: "70", unit: "/100", score: 70, description: "Strong affordability and services profile balanced against typhoon and modernization needs." },
      { label: "Affordability profile", value: "Favorable", description: "Cost-of-living levels are comparatively favorable." },
      { label: "Services economy", value: "Strong", description: "Business-process services and creative industries shape opportunity." },
    ],
    relatedCitySlugs: ["jakarta", "bangkok", "kuala-lumpur"],
    modules: {
      "cost-of-living": {
        score: 78,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Manila offers strong affordability for a major Southeast Asian capital, with food and transit costs supporting steady daily life.",
        explanation:
          "The cost-of-living model balances housing pressure with food and transit access. Manila's markets support stable daily costs.",
        facts: [
          { label: "Affordability score", value: "78", unit: "/100", description: "Strong affordability for a major capital.", context: "Markets and transit support stable daily costs." },
          { label: "Housing pressure", value: "Rising", description: "Central business districts have firmed under demand.", context: "Long-term rental supply varies." },
          { label: "Transport offset", value: "Mixed", description: "Bus and rail reach reduce some private mobility costs.", context: "Transit expansion continues across the metro." },
        ],
      },
      "air-quality": {
        score: 60,
        sources: ["who-air"],
        summary:
          "Manila's air-quality profile is shaped by traffic, industry, and meteorology, with active monitoring and policy attention.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Manila's pollutant levels warrant continued attention.",
        facts: [
          { label: "Clean-air score", value: "60", unit: "/100", description: "Mid-tier baseline with persistent pollutant exposure.", context: "Trend visibility is improving." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO2", description: "Fine particles and traffic emissions drive focus.", context: "Mobility reform targets these directly." },
          { label: "Monitoring confidence", value: "Mid", description: "Public monitoring is improving with continued expansion.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 66,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Manila's energy profile reflects an active transition with growing renewable build-out and rising distributed-solar adoption.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. The Philippines' renewable transition continues to progress.",
        facts: [
          { label: "Energy readiness", value: "66", unit: "/100", description: "Mid-tier baseline with active transition direction.", context: "Solar resource is strong nationally." },
          { label: "Primary transition lever", value: "Renewables and grid", description: "Renewable build-out and grid resilience are the main levers.", context: "Distributed solar continues to expand." },
          { label: "Climate stressor", value: "Heat and typhoons", description: "Sustained heat and typhoons shape adaptation work.", context: "Coastal-storm exposure is structural." },
        ],
      },
      safety: {
        score: 66,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Manila has mid-tier safety with neighborhood variation and property-related opportunistic risks the main day-to-day concern.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Manila shows variation across the metro.",
        facts: [
          { label: "Safety score", value: "66", unit: "/100", description: "Mid-tier score with neighborhood-level variation.", context: "Resident experience varies across districts." },
          { label: "Violent-crime context", value: "Mid", description: "Violent-crime context varies meaningfully by district.", context: "Trend visibility is supported by public reporting." },
          { label: "Watch item", value: "Property and traffic", description: "Property crime and traffic safety are the main practical concerns.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 76,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Manila has solid fiber broadband and broad mobile coverage, supporting a deep business-process services and creative-economy sector.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Manila's fiber footprint continues to expand.",
        facts: [
          { label: "Fixed broadband median", value: "180", unit: " Mbps", description: "Solid fixed-broadband performance for remote work.", context: "Performance varies by district and provider." },
          { label: "Mobile median", value: "90", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint is widening across central and outer districts.", context: "Service availability continues to grow." },
        ],
      },
      "climate-risk": {
        score: 56,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Manila faces meaningful climate exposure from typhoons, coastal flooding, and rising heat, balanced by adaptation programs that continue to scale.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Manila's hazards are concurrent and require sustained investment.",
        facts: [
          { label: "Primary hazard", value: "Typhoon and flood", description: "Tropical storms and coastal flooding are the main hazards.", context: "Concurrent hazards shape adaptation work." },
          { label: "Heat exposure", value: "High", description: "Sustained heat is structural for daily life.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Improving", description: "City and national programs build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    countrySlug: "india",
    countryName: "India",
    region: "South Asia",
    population: "21.7M metro",
    intro:
      "Mumbai is India's financial capital and one of South Asia's largest urban regions, with deep finance, film, and creative industries and active urban-modernization work.",
    outlook:
      "Mumbai is most useful for users comparing affordability and economic depth in South Asia against air-quality, flood, and infrastructure modernization needs.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 70, affordability: 78, airQuality: 54, energy: 66, resilience: 60 },
    metrics: [
      { label: "Overall city intelligence", value: "70", unit: "/100", score: 70, description: "Strong affordability and economic depth balanced against air-quality and flood pressure." },
      { label: "Economic depth", value: "Globally significant", description: "Finance, film, and trade ecosystems shape opportunity." },
      { label: "Affordability profile", value: "Favorable", description: "Cost-of-living levels are comparatively favorable." },
    ],
    relatedCitySlugs: ["bangkok", "manila", "jakarta"],
    modules: {
      "cost-of-living": {
        score: 78,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Mumbai offers strong affordability for a major South Asian capital, with food and transit costs supporting steady daily life despite housing pressure.",
        explanation:
          "The cost-of-living model balances housing pressure with food and transit access. Mumbai's markets support stable daily costs.",
        facts: [
          { label: "Affordability score", value: "78", unit: "/100", description: "Strong affordability for a major financial capital.", context: "Markets and transit support stable daily costs." },
          { label: "Housing pressure", value: "Very high", description: "Central districts are among Asia's most competitive.", context: "Long-term supply remains constrained." },
          { label: "Transport offset", value: "Strong", description: "Suburban rail and bus reach reduce private mobility costs.", context: "Metro expansion continues across the metro." },
        ],
      },
      "air-quality": {
        score: 54,
        sources: ["who-air"],
        summary:
          "Mumbai's air-quality profile is shaped by traffic, industry, and seasonal meteorology, with active monitoring and policy attention.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Mumbai's pollutant levels warrant continued attention.",
        facts: [
          { label: "Clean-air score", value: "54", unit: "/100", description: "Lower-tier baseline with seasonal pressure.", context: "Trend visibility is improving." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles drive the focus.", context: "Industrial and traffic sources contribute." },
          { label: "Monitoring confidence", value: "Mid", description: "Public monitoring is improving with continued expansion.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 66,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Mumbai's energy profile reflects an active national transition with growing renewable build-out and rising distributed-solar adoption.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. India's renewable acceleration supports the score.",
        facts: [
          { label: "Energy readiness", value: "66", unit: "/100", description: "Mid-tier baseline with active transition direction.", context: "Solar resource is strong nationally." },
          { label: "Primary transition lever", value: "Renewables and efficiency", description: "Renewable build-out and efficiency are the main levers.", context: "Distributed solar continues to expand." },
          { label: "Climate stressor", value: "Heat and monsoon", description: "Sustained heat and intense monsoon shape adaptation work.", context: "Coastal-storm exposure is structural." },
        ],
      },
      safety: {
        score: 76,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Mumbai has solid overall safety with consistent neighborhood experience and property-related opportunistic risks the main day-to-day concern.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Mumbai's resident experience is broadly stable.",
        facts: [
          { label: "Safety score", value: "76", unit: "/100", description: "Solid score with consistent neighborhood experience.", context: "Stable institutional response reinforces the score." },
          { label: "Violent-crime context", value: "Mid-low", description: "Violent-crime context is comparatively low for a major metro.", context: "Trend visibility is supported by public reporting." },
          { label: "Watch item", value: "Property and traffic", description: "Property crime and traffic safety are the main practical concerns.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 80,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Mumbai has solid fiber broadband and broad mobile coverage, supporting deep finance, services, and digital-economy activity.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Mumbai's fiber and mobile footprint is broad.",
        facts: [
          { label: "Fixed broadband median", value: "200", unit: " Mbps", description: "Solid fixed-broadband performance for remote work.", context: "Performance varies by district and provider." },
          { label: "Mobile median", value: "100", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint is widening across central and outer districts.", context: "Service availability continues to grow." },
        ],
      },
      "climate-risk": {
        score: 56,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Mumbai faces meaningful climate exposure from coastal flooding, monsoon rainfall, and rising heat, balanced by adaptation programs that continue to scale.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Mumbai's hazards are concurrent and require sustained investment.",
        facts: [
          { label: "Primary hazard", value: "Coastal flood and monsoon", description: "Sea-level rise and intense monsoon rainfall are the main hazards.", context: "Concurrent hazards shape adaptation work." },
          { label: "Heat exposure", value: "High", description: "Sustained heat is structural for daily life.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Improving", description: "City and national programs build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "doha",
    name: "Doha",
    countrySlug: "qatar",
    countryName: "Qatar",
    region: "Western Asia",
    population: "2.4M metro",
    intro:
      "Doha is Qatar's capital and a fast-growing Gulf city with deep services, modern infrastructure, and ambitious clean-energy and adaptation programs in hot, arid conditions.",
    outlook:
      "Doha is most useful for users comparing services, connectivity, and modern infrastructure in the Gulf against heat-adaptation needs.",
    sources: ["un-habitat", "nasa-power", "ipcc-urban", "iea-cities", "itu-connectivity"],
    scores: { overall: 80, affordability: 64, airQuality: 70, energy: 78, resilience: 76 },
    metrics: [
      { label: "Overall city intelligence", value: "80", unit: "/100", score: 80, description: "Strong services and infrastructure profile balanced against heat exposure." },
      { label: "Service depth", value: "Strong", description: "Health, transit, and digital services reach broad coverage." },
      { label: "Solar resource", value: "Exceptional", description: "Among the strongest solar irradiance levels globally." },
    ],
    relatedCitySlugs: ["dubai", "abu-dhabi", "singapore"],
    modules: {
      "cost-of-living": {
        score: 64,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Doha is moderately expensive on housing and central services, with food, transit, and household services balanced for residents.",
        explanation:
          "The cost-of-living model balances housing pressure with services and amenity. Doha's services depth offsets some costs.",
        facts: [
          { label: "Affordability score", value: "64", unit: "/100", description: "Lower score driven by housing and services costs.", context: "Compounds and outer districts offer more options." },
          { label: "Housing pressure", value: "Moderate", description: "Rental options span a wide range across the metro.", context: "Central districts are more competitive." },
          { label: "Services offset", value: "Strong", description: "Modern services reduce some practical household costs.", context: "Public infrastructure supports daily life." },
        ],
      },
      "air-quality": {
        score: 70,
        sources: ["who-air"],
        summary:
          "Doha's air quality is shaped by arid context with seasonal dust, traffic, and industrial sources contributing to particulate exposure.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Arid context drives natural dust contribution.",
        facts: [
          { label: "Clean-air score", value: "70", unit: "/100", description: "Mid-tier baseline shaped by dust and traffic.", context: "Seasonal dust drives episodic pressure." },
          { label: "Primary pollutant watch", value: "PM10 and PM2.5", description: "Particulates from dust and traffic drive focus.", context: "Indoor-air practice is widely adopted." },
          { label: "Monitoring confidence", value: "Mid", description: "Public monitoring is expanding with continued investment.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 78,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Doha benefits from exceptional solar resource and ambitious clean-energy targets supporting renewable build-out and efficiency programs.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. Qatar's solar resource and transition direction support the score.",
        facts: [
          { label: "Energy readiness", value: "78", unit: "/100", description: "Strong baseline lifted by solar resource and policy direction.", context: "Large-scale solar build-out is underway." },
          { label: "Primary transition lever", value: "Solar and efficiency", description: "Distributed solar and efficiency are the main levers.", context: "Building cooling efficiency is a focus." },
          { label: "Climate stressor", value: "Heat", description: "Sustained extreme heat shapes adaptation work.", context: "Cooling demand is structural for daily life." },
        ],
      },
      safety: {
        score: 90,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Doha is among the safer global cities, with very low violent-crime context and consistent neighborhood experience.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Doha's resident experience is widely stable.",
        facts: [
          { label: "Safety score", value: "90", unit: "/100", description: "Very strong score with consistent neighborhood experience.", context: "Among the safest global cities." },
          { label: "Violent-crime context", value: "Very low", description: "Violent-crime context is among the lowest globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Traffic", description: "Traffic safety remains a practical day-to-day concern.", context: "Pedestrian-friendly design is expanding." },
        ],
      },
      "internet-speed": {
        score: 90,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Doha delivers very fast fiber broadband and dense 5G mobile coverage, supporting a rapidly expanding digital economy.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Qatar's fiber and 5G footprint is broad.",
        facts: [
          { label: "Fixed broadband median", value: "300", unit: " Mbps", description: "Very strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "200", unit: " Mbps", description: "Reliable 5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 64,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Doha carries meaningful climate exposure centered on extreme heat and water stress, balanced by ambitious adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Doha's main pressure is heat; coastal location adds storm sensitivity.",
        facts: [
          { label: "Primary hazard", value: "Heat", description: "Sustained extreme heat is the main hazard.", context: "Arid context concentrates exposure." },
          { label: "Water resilience", value: "Active", description: "Desalination and water-management programs are central.", context: "Long-run water security is a structural priority." },
          { label: "Adaptation capacity", value: "Strong", description: "Ambitious adaptation programs build resilience.", context: "Implementation depth supports the score." },
        ],
      },
    },
  },
  {
    slug: "abu-dhabi",
    name: "Abu Dhabi",
    countrySlug: "united-arab-emirates",
    countryName: "United Arab Emirates",
    region: "Western Asia",
    population: "1.6M metro",
    intro:
      "Abu Dhabi is the UAE's capital and a major Gulf city with deep services, modern infrastructure, and ambitious clean-energy and adaptation programs in hot, arid conditions.",
    outlook:
      "Abu Dhabi is most useful for users comparing services, connectivity, and modern infrastructure in the Gulf against heat-adaptation needs.",
    sources: ["un-habitat", "nasa-power", "ipcc-urban", "iea-cities", "itu-connectivity"],
    scores: { overall: 82, affordability: 66, airQuality: 70, energy: 82, resilience: 78 },
    metrics: [
      { label: "Overall city intelligence", value: "82", unit: "/100", score: 82, description: "Strong services and infrastructure profile balanced against heat exposure." },
      { label: "Service depth", value: "Strong", description: "Health, transit, and digital services reach broad coverage." },
      { label: "Solar resource", value: "Exceptional", description: "Among the strongest solar irradiance levels globally." },
    ],
    relatedCitySlugs: ["dubai", "doha", "singapore"],
    modules: {
      "cost-of-living": {
        score: 66,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Abu Dhabi is moderately expensive on housing and central services, with food, transit, and household services balanced for residents.",
        explanation:
          "The cost-of-living model balances housing pressure with services and amenity. Abu Dhabi's services depth offsets some costs.",
        facts: [
          { label: "Affordability score", value: "66", unit: "/100", description: "Moderate affordability with services depth as offset.", context: "Outer districts offer more options." },
          { label: "Housing pressure", value: "Moderate", description: "Rental options span a wide range across the metro.", context: "Central districts are more competitive." },
          { label: "Services offset", value: "Strong", description: "Modern services reduce some practical household costs.", context: "Public infrastructure supports daily life." },
        ],
      },
      "air-quality": {
        score: 70,
        sources: ["who-air"],
        summary:
          "Abu Dhabi's air quality is shaped by arid context with seasonal dust, traffic, and industrial sources contributing to particulate exposure.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Arid context drives natural dust contribution.",
        facts: [
          { label: "Clean-air score", value: "70", unit: "/100", description: "Mid-tier baseline shaped by dust and traffic.", context: "Seasonal dust drives episodic pressure." },
          { label: "Primary pollutant watch", value: "PM10 and PM2.5", description: "Particulates from dust and traffic drive focus.", context: "Indoor-air practice is widely adopted." },
          { label: "Monitoring confidence", value: "Mid", description: "Public monitoring is expanding with continued investment.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 82,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Abu Dhabi benefits from exceptional solar resource and one of the world's largest utility-scale solar build-outs supporting clean-energy progress.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. The UAE's solar acceleration is among the most ambitious globally.",
        facts: [
          { label: "Energy readiness", value: "82", unit: "/100", description: "Strong baseline lifted by major solar build-out.", context: "Among the largest utility-scale solar deployments globally." },
          { label: "Primary transition lever", value: "Solar and clean fuels", description: "Utility-scale solar and clean fuels are the main levers.", context: "Diversification programs continue to grow." },
          { label: "Climate stressor", value: "Heat", description: "Sustained extreme heat shapes adaptation work.", context: "Cooling demand is structural for daily life." },
        ],
      },
      safety: {
        score: 90,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Abu Dhabi is among the safer global cities, with very low violent-crime context and consistent neighborhood experience.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Abu Dhabi's resident experience is widely stable.",
        facts: [
          { label: "Safety score", value: "90", unit: "/100", description: "Very strong score with consistent neighborhood experience.", context: "Among the safest global cities." },
          { label: "Violent-crime context", value: "Very low", description: "Violent-crime context is among the lowest globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Traffic", description: "Traffic safety remains a practical day-to-day concern.", context: "Pedestrian-friendly design is expanding." },
        ],
      },
      "internet-speed": {
        score: 90,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Abu Dhabi delivers very fast fiber broadband and dense 5G mobile coverage, supporting a rapidly expanding digital economy.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. The UAE's fiber and 5G footprint is broad.",
        facts: [
          { label: "Fixed broadband median", value: "300", unit: " Mbps", description: "Very strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "200", unit: " Mbps", description: "Reliable 5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 66,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Abu Dhabi carries meaningful climate exposure centered on extreme heat and water stress, balanced by ambitious adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Abu Dhabi's main pressure is heat; coastal location adds sensitivity.",
        facts: [
          { label: "Primary hazard", value: "Heat", description: "Sustained extreme heat is the main hazard.", context: "Arid context concentrates exposure." },
          { label: "Water resilience", value: "Active", description: "Desalination and water-management programs are central.", context: "Long-run water security is a structural priority." },
          { label: "Adaptation capacity", value: "Strong", description: "Ambitious adaptation programs build resilience.", context: "Implementation depth supports the score." },
        ],
      },
    },
  },
  {
    slug: "lagos",
    name: "Lagos",
    countrySlug: "nigeria",
    countryName: "Nigeria",
    region: "Africa",
    population: "21.0M metro",
    intro:
      "Lagos is Nigeria's economic capital and one of Africa's largest urban regions, with a vibrant creative, music, and entrepreneurial culture and active urban-modernization work.",
    outlook:
      "Lagos is most useful for users comparing affordability, creative-economy depth, and entrepreneurial activity in West Africa against air-quality and modernization needs.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 66, affordability: 78, airQuality: 54, energy: 60, resilience: 56 },
    metrics: [
      { label: "Overall city intelligence", value: "66", unit: "/100", score: 66, description: "Strong affordability and creative-economy profile balanced against modernization needs." },
      { label: "Creative economy", value: "Globally cited", description: "Music, film, and creative industries shape opportunity." },
      { label: "Affordability profile", value: "Favorable", description: "Cost-of-living levels are comparatively favorable." },
    ],
    relatedCitySlugs: ["nairobi", "johannesburg", "cape-town"],
    modules: {
      "cost-of-living": {
        score: 78,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Lagos offers strong affordability for a major capital, with food and transit costs supporting steady daily life despite urban density.",
        explanation:
          "The cost-of-living model balances housing pressure with food and transit access. Lagos' markets support stable daily costs.",
        facts: [
          { label: "Affordability score", value: "78", unit: "/100", description: "Strong affordability for a major capital.", context: "Markets support stable daily costs." },
          { label: "Housing pressure", value: "Rising", description: "Central districts have firmed under demand.", context: "Long-term rental supply varies." },
          { label: "Transport offset", value: "Mixed", description: "Bus and growing rail reach reduce some private mobility costs.", context: "Transit expansion continues across the metro." },
        ],
      },
      "air-quality": {
        score: 54,
        sources: ["who-air"],
        summary:
          "Lagos' air-quality profile is shaped by traffic, industry, and seasonal dust, with active monitoring expansion and policy attention.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Lagos' pollutant levels warrant continued attention.",
        facts: [
          { label: "Clean-air score", value: "54", unit: "/100", description: "Lower-tier baseline with seasonal pressure.", context: "Trend visibility is improving." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles drive the focus.", context: "Industrial and traffic sources contribute." },
          { label: "Monitoring confidence", value: "Mid-low", description: "Public monitoring continues to expand with investment.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 60,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Lagos' energy profile reflects an active transition with rising distributed-solar adoption and ongoing grid-modernization work.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. Nigeria's solar resource and transition direction support the score.",
        facts: [
          { label: "Energy readiness", value: "60", unit: "/100", description: "Mid-tier baseline with active transition direction.", context: "Solar resource is favorable nationally." },
          { label: "Primary transition lever", value: "Solar and grid", description: "Distributed solar and grid resilience are the main levers.", context: "Off-grid solar continues to expand." },
          { label: "Climate stressor", value: "Heat and rainfall", description: "Sustained heat and intense rainfall shape adaptation work.", context: "Coastal exposure raises storm sensitivity." },
        ],
      },
      safety: {
        score: 60,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Lagos has mid-tier safety with strong neighborhood variation and property-related opportunistic risks the main day-to-day concern.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Lagos shows wide variation across the metro.",
        facts: [
          { label: "Safety score", value: "60", unit: "/100", description: "Mid-tier score with strong neighborhood variation.", context: "Resident experience varies sharply by district." },
          { label: "Violent-crime context", value: "Mid", description: "Violent-crime context varies meaningfully by district.", context: "Trend visibility continues to improve." },
          { label: "Watch item", value: "Property and traffic", description: "Property crime and traffic safety are the main practical concerns.", context: "Common situational awareness remains useful." },
        ],
      },
      "internet-speed": {
        score: 70,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Lagos has improving fiber broadband and broad mobile coverage, supporting a fast-growing technology and creative-industry sector.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Lagos' fiber footprint continues to expand.",
        facts: [
          { label: "Fixed broadband median", value: "120", unit: " Mbps", description: "Improving fixed-broadband performance for remote work.", context: "Performance varies by district and provider." },
          { label: "Mobile median", value: "80", unit: " Mbps", description: "Reliable 4G mobile experience with growing 5G.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint is widening across central and outer districts.", context: "Service availability continues to grow." },
        ],
      },
      "climate-risk": {
        score: 56,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Lagos faces meaningful climate exposure from coastal flooding, intense rainfall, and rising heat, balanced by adaptation programs that continue to scale.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Lagos' hazards are concurrent and require sustained investment.",
        facts: [
          { label: "Primary hazard", value: "Coastal flood and rainfall", description: "Sea-level rise and intense rainfall are the main hazards.", context: "Concurrent hazards shape adaptation work." },
          { label: "Heat exposure", value: "High", description: "Sustained heat is structural for daily life.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Improving", description: "City and national programs build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "kigali",
    name: "Kigali",
    countrySlug: "rwanda",
    countryName: "Rwanda",
    region: "Africa",
    population: "1.7M metro",
    intro:
      "Kigali is Rwanda's capital and a fast-developing East African city known for clean public spaces, strong governance signals, and a growing technology and services sector.",
    outlook:
      "Kigali is most useful for users comparing affordability, public-space quality, and institutional context in East Africa against modernization needs.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 74, affordability: 80, airQuality: 70, energy: 70, resilience: 72 },
    metrics: [
      { label: "Overall city intelligence", value: "74", unit: "/100", score: 74, description: "Strong affordability and public-space profile balanced against modernization needs." },
      { label: "Public-space quality", value: "Notable", description: "Well-kept public spaces are widely cited regionally." },
      { label: "Institutional signals", value: "Stable", description: "Governance signals support a stable operating environment." },
    ],
    relatedCitySlugs: ["nairobi", "cape-town", "lagos"],
    modules: {
      "cost-of-living": {
        score: 80,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Kigali offers strong affordability for an African capital, with food and transit costs supporting steady daily life.",
        explanation:
          "The cost-of-living model balances housing pressure with food and transit access. Kigali's markets support stable daily costs.",
        facts: [
          { label: "Affordability score", value: "80", unit: "/100", description: "Strong affordability for a regional capital.", context: "Markets support stable daily costs." },
          { label: "Housing pressure", value: "Moderate", description: "Central districts have firmed with growth.", context: "Outer districts remain more accessible." },
          { label: "Transport offset", value: "Improving", description: "Bus reach and growing rail plans reduce mobility costs.", context: "Transit-network expansion is in progress." },
        ],
      },
      "air-quality": {
        score: 70,
        sources: ["who-air"],
        summary:
          "Kigali has solid baseline air quality with traffic and seasonal dust the main pollutant focus and active monitoring expansion.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Kigali's geography supports a moderate baseline.",
        facts: [
          { label: "Clean-air score", value: "70", unit: "/100", description: "Solid baseline with traffic and seasonal pressure.", context: "Trend visibility continues to improve." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles drive the focus.", context: "Traffic and dust sources contribute." },
          { label: "Monitoring confidence", value: "Mid", description: "Public monitoring is improving with continued expansion.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 70,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Kigali's energy profile reflects an active transition with growing renewable build-out and rising solar adoption supporting national targets.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. Rwanda's renewable direction supports the score.",
        facts: [
          { label: "Energy readiness", value: "70", unit: "/100", description: "Mid-tier baseline with active transition direction.", context: "Solar and hydro resources support progress." },
          { label: "Primary transition lever", value: "Solar and grid", description: "Distributed solar and grid expansion are the main levers.", context: "National electrification continues to grow." },
          { label: "Climate stressor", value: "Rainfall", description: "Intense rainfall shapes adaptation work.", context: "Slope stability is a related concern." },
        ],
      },
      safety: {
        score: 84,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Kigali is widely cited as among the safer African capitals, with low violent-crime context and consistent neighborhood experience.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Kigali's resident experience is widely stable.",
        facts: [
          { label: "Safety score", value: "84", unit: "/100", description: "Strong score with consistent neighborhood experience.", context: "Among the safer regional capitals." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low for the region.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Property", description: "Property-related opportunistic risks remain the practical concern.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 76,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Kigali offers improving fiber broadband and broad mobile coverage, supporting a growing technology and services sector.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Kigali's fiber footprint continues to expand.",
        facts: [
          { label: "Fixed broadband median", value: "150", unit: " Mbps", description: "Improving fixed-broadband performance for remote work.", context: "Performance varies by district and provider." },
          { label: "Mobile median", value: "80", unit: " Mbps", description: "Reliable 4G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint is widening across central and outer districts.", context: "Service availability continues to grow." },
        ],
      },
      "climate-risk": {
        score: 72,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Kigali carries moderate climate exposure from intense rainfall and slope stability, balanced by active adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Kigali's altitude moderates heat exposure.",
        facts: [
          { label: "Primary hazard", value: "Rainfall and slope", description: "Intense rainfall and slope stability are the main hazards.", context: "Hilly topography concentrates exposure." },
          { label: "Heat exposure", value: "Low", description: "High altitude moderates heat-stress impact.", context: "Heat is a smaller driver than for lowland peers." },
          { label: "Adaptation capacity", value: "Strong", description: "City and national programs build resilience.", context: "Implementation depth supports the score." },
        ],
      },
    },
  },
  {
    slug: "johannesburg",
    name: "Johannesburg",
    countrySlug: "south-africa",
    countryName: "South Africa",
    region: "Africa",
    population: "9.7M metro",
    intro:
      "Johannesburg is South Africa's largest urban region and a major economic and cultural hub with deep finance, mining, and creative industries.",
    outlook:
      "Johannesburg is most useful for users comparing affordability and economic depth in southern Africa against energy-transition and safety considerations.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban", "iea-cities"],
    scores: { overall: 70, affordability: 76, airQuality: 64, energy: 64, resilience: 68 },
    metrics: [
      { label: "Overall city intelligence", value: "70", unit: "/100", score: 70, description: "Strong economic depth and affordability profile balanced against energy-transition needs." },
      { label: "Economic depth", value: "Very high", description: "Finance, mining, and creative industries shape opportunity." },
      { label: "Affordability profile", value: "Favorable", description: "Cost-of-living levels are comparatively favorable." },
    ],
    relatedCitySlugs: ["cape-town", "nairobi", "lagos"],
    modules: {
      "cost-of-living": {
        score: 76,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Johannesburg offers favorable affordability for a major economic capital, with food and services costs supporting steady daily life.",
        explanation:
          "The cost-of-living model balances housing pressure with food and services access. Johannesburg's services depth supports stable daily costs.",
        facts: [
          { label: "Affordability score", value: "76", unit: "/100", description: "Favorable affordability for a major capital.", context: "Markets and services support stable daily costs." },
          { label: "Housing pressure", value: "Moderate", description: "Rental options span a wide range across the metro.", context: "Central districts are more competitive." },
          { label: "Transport offset", value: "Mixed", description: "Bus and rail reach reduce some mobility costs.", context: "Transit expansion continues across the metro." },
        ],
      },
      "air-quality": {
        score: 64,
        sources: ["who-air"],
        summary:
          "Johannesburg's air-quality profile is shaped by traffic, industry, and seasonal heating, with active monitoring and policy attention.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring depth and policy momentum. Johannesburg's pollutant levels warrant continued attention.",
        facts: [
          { label: "Clean-air score", value: "64", unit: "/100", description: "Mid-tier baseline with seasonal pressure.", context: "Trend visibility is supported by monitoring." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles drive the focus during heating season.", context: "Heating reform targets these directly." },
          { label: "Monitoring confidence", value: "Mid", description: "Public monitoring continues to expand.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 64,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Johannesburg's energy profile reflects an active national transition with rising renewable build-out and ongoing grid-resilience work.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. South Africa's renewable acceleration supports the score.",
        facts: [
          { label: "Energy readiness", value: "64", unit: "/100", description: "Mid-tier baseline with active transition direction.", context: "Solar resource is favorable nationally." },
          { label: "Primary transition lever", value: "Renewables and grid", description: "Renewable build-out and grid resilience are the main levers.", context: "Distributed solar continues to expand." },
          { label: "Climate stressor", value: "Heat and storms", description: "Rising heat and intense storms shape adaptation work.", context: "Hailstorms drive some seasonal pressure." },
        ],
      },
      safety: {
        score: 60,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Johannesburg has mid-tier safety with strong neighborhood variation; resident experience differs widely across districts.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Johannesburg shows wide variation across the metro.",
        facts: [
          { label: "Safety score", value: "60", unit: "/100", description: "Mid-tier score with strong neighborhood variation.", context: "Resident experience varies sharply by district." },
          { label: "Violent-crime context", value: "Mid-high", description: "Violent-crime context varies meaningfully by district.", context: "Trend visibility is supported by public reporting." },
          { label: "Watch item", value: "Property", description: "Property crime is the main practical day-to-day concern.", context: "Common situational awareness remains useful." },
        ],
      },
      "internet-speed": {
        score: 80,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Johannesburg offers solid fiber broadband and reliable mobile coverage, supporting a deep finance, services, and digital-economy presence.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Johannesburg's fiber footprint is broad.",
        facts: [
          { label: "Fixed broadband median", value: "180", unit: " Mbps", description: "Solid fixed-broadband performance for remote work.", context: "Performance varies by district and provider." },
          { label: "Mobile median", value: "100", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 70,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Johannesburg carries moderate climate exposure from heat, water variability, and intense storms, balanced by active adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Johannesburg's altitude moderates some heat extremes.",
        facts: [
          { label: "Primary hazard", value: "Heat and storms", description: "Rising heat and intense storms are the main hazards.", context: "Drought cycles raise long-run pressure." },
          { label: "Water resilience", value: "Active", description: "Drought-cycle planning and water programs are central.", context: "Long-run water security shapes urban operations." },
          { label: "Adaptation capacity", value: "Improving", description: "City and national programs build resilience.", context: "Implementation timelines extend into the medium term." },
        ],
      },
    },
  },
  {
    slug: "melbourne",
    name: "Melbourne",
    countrySlug: "australia",
    countryName: "Australia",
    region: "Oceania",
    population: "5.2M metro",
    intro:
      "Melbourne is Australia's second-largest city, known for cultural depth, design and creative industries, walkable laneways, and a growing technology and services economy.",
    outlook:
      "Melbourne is most useful for users comparing cultural depth, services, and connectivity against high housing pressure and rising heat exposure.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 86, affordability: 60, airQuality: 84, energy: 78, resilience: 78 },
    metrics: [
      { label: "Overall city intelligence", value: "86", unit: "/100", score: 86, description: "Strong cultural and connectivity profile balanced against housing pressure." },
      { label: "Cultural depth", value: "Very high", description: "Design, food, and creative industries shape daily life." },
      { label: "Walkability", value: "Strong", description: "Compact central form and laneways support car-light routines." },
    ],
    relatedCitySlugs: ["sydney", "brisbane", "auckland"],
    modules: {
      "cost-of-living": {
        score: 60,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Melbourne is expensive on housing and central services, partially offset by amenity and service quality.",
        explanation:
          "The cost-of-living model balances housing pressure with services and amenity. Melbourne's amenity is high; housing dominates the score.",
        facts: [
          { label: "Affordability score", value: "60", unit: "/100", description: "Lower score driven by housing pressure.", context: "Amenity and services partially offset costs." },
          { label: "Housing pressure", value: "Very high", description: "Long-run demand and supply imbalances dominate the cost profile.", context: "Inner-suburb districts remain especially competitive." },
          { label: "Amenity offset", value: "Strong", description: "Cultural and service amenity reduce some practical costs.", context: "Walking and tram routines support car-light life." },
        ],
      },
      "air-quality": {
        score: 84,
        sources: ["who-air"],
        summary:
          "Melbourne has strong baseline air quality with episodic bushfire smoke the main seasonal concern.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring confidence. Melbourne's baseline is healthy; bushfire seasons drive most spikes.",
        facts: [
          { label: "Clean-air score", value: "84", unit: "/100", description: "Strong baseline with stable trend.", context: "Coastal context supports the baseline." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles are the central benchmark.", context: "Bushfire smoke drives episodic spikes." },
          { label: "Monitoring confidence", value: "High", description: "Public monitoring supports trend visibility.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 78,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Melbourne benefits from rapid renewable build-out at the state level, with rising distributed-solar adoption and active building-efficiency work.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. Victoria's renewable acceleration supports the score.",
        facts: [
          { label: "Energy readiness", value: "78", unit: "/100", description: "Strong baseline lifted by state renewable progress.", context: "Distributed solar adoption is high." },
          { label: "Primary transition lever", value: "Renewables and electrification", description: "Renewable build-out and electrification are the main levers.", context: "Heat-pump uptake is rising." },
          { label: "Climate stressor", value: "Heat and bushfire", description: "Rising heat and bushfire shape adaptation work.", context: "Drought cycles raise long-run pressure." },
        ],
      },
      safety: {
        score: 86,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Melbourne is among the safer large global cities, with low violent-crime context and consistent neighborhood experience.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Melbourne's resident experience is widely stable.",
        facts: [
          { label: "Safety score", value: "86", unit: "/100", description: "Strong score with consistent neighborhood experience.", context: "Among the safer large global cities." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Property", description: "Property and opportunistic risks are the main practical concerns.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 86,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Melbourne offers fast fiber broadband and reliable mobile coverage, supporting a growing tech, design, and remote-work community.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Australia's NBN footprint reaches Melbourne broadly.",
        facts: [
          { label: "Fixed broadband median", value: "240", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "130", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service variety supports household choice." },
        ],
      },
      "climate-risk": {
        score: 74,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Melbourne carries moderate climate exposure from heat, bushfire, and storm pressure, balanced by active adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Melbourne's main pressures are heat and bushfire.",
        facts: [
          { label: "Primary hazard", value: "Heat and bushfire", description: "Rising heat and bushfire are the main hazards.", context: "Drought cycles raise long-run pressure." },
          { label: "Flood exposure", value: "Moderate", description: "Surface and storm flood pressure rises in cycles.", context: "Drainage programs are central." },
          { label: "Adaptation capacity", value: "Strong", description: "State and city programs support resilience.", context: "Tree planting and shade build heat resilience." },
        ],
      },
    },
  },
  {
    slug: "brisbane",
    name: "Brisbane",
    countrySlug: "australia",
    countryName: "Australia",
    region: "Oceania",
    population: "2.7M metro",
    intro:
      "Brisbane is Queensland's capital, a sub-tropical Australian city with strong outdoor amenity, growing tech and services activity, and active climate-adaptation work.",
    outlook:
      "Brisbane is most useful for users comparing outdoor amenity, growing services activity, and connectivity against heat and storm-exposure considerations.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: { overall: 84, affordability: 64, airQuality: 84, energy: 78, resilience: 76 },
    metrics: [
      { label: "Overall city intelligence", value: "84", unit: "/100", score: 84, description: "Strong outdoor amenity and connectivity profile balanced against housing pressure." },
      { label: "Outdoor amenity", value: "Very high", description: "Sub-tropical climate and outdoor amenity support strong daily life." },
      { label: "Tech-sector activity", value: "Growing", description: "Software, services, and finance shape rising opportunity." },
    ],
    relatedCitySlugs: ["sydney", "melbourne", "auckland"],
    modules: {
      "cost-of-living": {
        score: 64,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Brisbane is moderately expensive on housing and central services, partially offset by amenity and service quality.",
        explanation:
          "The cost-of-living model balances housing pressure with services and amenity. Brisbane's amenity is high; housing pressure has firmed.",
        facts: [
          { label: "Affordability score", value: "64", unit: "/100", description: "Lower score driven by rising housing pressure.", context: "Outer suburbs remain more accessible." },
          { label: "Housing pressure", value: "High", description: "Long-run demand has firmed under interstate migration.", context: "Inner-suburb districts are especially competitive." },
          { label: "Amenity offset", value: "Strong", description: "Outdoor and service amenity reduce some practical costs.", context: "Outdoor lifestyle reduces some indoor entertainment expense." },
        ],
      },
      "air-quality": {
        score: 84,
        sources: ["who-air"],
        summary:
          "Brisbane has strong baseline air quality, supported by coastal context, with episodic bushfire smoke the main seasonal concern.",
        explanation:
          "Air-quality scoring weighs pollutant exposure with monitoring confidence. Brisbane's baseline is healthy; bushfire seasons drive most spikes.",
        facts: [
          { label: "Clean-air score", value: "84", unit: "/100", description: "Strong baseline with stable trend.", context: "Coastal context supports the baseline." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particles are the central benchmark.", context: "Bushfire smoke drives episodic spikes." },
          { label: "Monitoring confidence", value: "High", description: "Public monitoring supports trend visibility.", context: "Health-based benchmarks anchor the score." },
        ],
      },
      energy: {
        score: 78,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Brisbane benefits from rapid renewable build-out at the state level and one of the world's highest distributed-solar adoption rates.",
        explanation:
          "Energy readiness scoring weighs grid context, transition strategy, and adaptation. Queensland's renewable acceleration supports the score.",
        facts: [
          { label: "Energy readiness", value: "78", unit: "/100", description: "Strong baseline lifted by state renewable progress.", context: "Distributed solar adoption is among the highest globally." },
          { label: "Primary transition lever", value: "Solar and electrification", description: "Distributed solar and electrification are the main levers.", context: "Battery adoption continues to rise." },
          { label: "Climate stressor", value: "Heat and storms", description: "Rising heat and storms shape adaptation work.", context: "Coastal-storm exposure is structural." },
        ],
      },
      safety: {
        score: 86,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Brisbane is among the safer large global cities, with low violent-crime context and consistent neighborhood experience.",
        explanation:
          "Safety scoring weighs violent-crime context, neighborhood variation, and institutional response. Brisbane's resident experience is widely stable.",
        facts: [
          { label: "Safety score", value: "86", unit: "/100", description: "Strong score with consistent neighborhood experience.", context: "Among the safer large global cities." },
          { label: "Violent-crime context", value: "Low", description: "Violent-crime context is comparatively low globally.", context: "Long-run stability supports daily life." },
          { label: "Watch item", value: "Property", description: "Property and opportunistic risks are the main practical concerns.", context: "Common-sense precautions remain useful." },
        ],
      },
      "internet-speed": {
        score: 84,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Brisbane offers fast fiber broadband and reliable mobile coverage, supporting a growing tech and services economy.",
        explanation:
          "Connectivity scoring weighs fixed and mobile performance and digital-readiness depth. Australia's NBN footprint reaches Brisbane broadly.",
        facts: [
          { label: "Fixed broadband median", value: "220", unit: " Mbps", description: "Strong fixed-broadband performance for remote work.", context: "Solid for streaming, calls, and large-file workflows." },
          { label: "Mobile median", value: "130", unit: " Mbps", description: "Reliable 4G/5G mobile experience.", context: "Hybrid work-friendly mobile productivity." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 70,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Brisbane carries moderate climate exposure from heat, intense rainfall, and storm and flood pressure, balanced by active adaptation programs.",
        explanation:
          "Climate-risk scoring weighs hazard exposure with adaptation capacity. Brisbane's main pressures are storms and flooding.",
        facts: [
          { label: "Primary hazard", value: "Storms and flood", description: "Tropical storms and intense rainfall are the main hazards.", context: "Concurrent hazards shape adaptation work." },
          { label: "Heat exposure", value: "Rising", description: "Sustained heat is rising as a structural concern.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Strong", description: "State and city programs support resilience.", context: "Drainage and stormwater investments are central." },
        ],
      },
    },
  },
  {
    slug: "stockholm",
    name: "Stockholm",
    countrySlug: "sweden",
    countryName: "Sweden",
    region: "Northern Europe",
    population: "2.4M metro",
    intro:
      "Stockholm pairs stable public institutions with a low-carbon electricity baseline and transit-rich urban form across an archipelago city centre.",
    outlook:
      "Read Stockholm as a high-trust, climate-forward capital where higher costs are balanced by service quality, mobility, and digital readiness.",
    sources: ["un-habitat", "nasa-power", "eea-air", "ipcc-urban", "iea-cities"],
    scores: { overall: 90, affordability: 60, airQuality: 86, energy: 92, resilience: 88 },
    metrics: [
      { label: "Overall city intelligence", value: "90", unit: "/100", score: 90, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Mobility confidence", value: "Strong", description: "Metro, commuter rail, and pedestrian-first streets reduce private-vehicle dependence." },
      { label: "Climate readiness", value: "Advanced", description: "Long-running climate planning and district energy support transition capacity." },
    ],
    relatedCitySlugs: ["copenhagen", "oslo", "helsinki"],
    modules: {
      "cost-of-living": {
        score: 60,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Stockholm is costly for rent and services, partly offset by strong public infrastructure and mobility-cost savings.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, services, and the stability of daily life rather than headline prices alone.",
        facts: [
          { label: "Affordability score", value: "60", unit: "/100", description: "Below-median directional score driven by housing and services costs.", context: "Public-service quality partially offsets headline prices." },
          { label: "Housing pressure", value: "High", description: "Central rental demand outpaces supply in inner districts.", context: "New residents often start in outer transit-served areas." },
          { label: "Transport cost offset", value: "Strong", description: "Transit and cycling networks reduce vehicle-dependence costs.", context: "Multi-modal commuting is feasible across most boroughs." },
        ],
      },
      "air-quality": {
        score: 86,
        sources: ["who-air", "eea-air"],
        summary:
          "Stockholm performs well against health-oriented air-quality benchmarks, with European monitoring context.",
        explanation:
          "Air-quality scoring prioritizes health, weighting PM2.5, PM10, nitrogen dioxide, and ozone against WHO guidance and regional monitoring.",
        facts: [
          { label: "Clean-air score", value: "86", unit: "/100", description: "Healthy directional performance against pollutant benchmarks.", context: "Compact form and electrified transit support results." },
          { label: "Primary pollutant watch", value: "Regional PM2.5", description: "Fine particulates remain the central health benchmark.", context: "Long-term health evidence supports the weighting." },
          { label: "Monitoring confidence", value: "High", description: "EEA-aligned monitoring supports transparent comparison.", context: "European reporting context improves comparability." },
        ],
      },
      energy: {
        score: 92,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Stockholm benefits from a low-carbon national grid and a long-running district energy and biofuel transition.",
        explanation:
          "Energy pages combine resource context, infrastructure maturity, and adaptation capacity rather than headline renewable share alone.",
        facts: [
          { label: "Energy readiness", value: "92", unit: "/100", description: "Strong directional transition score across infrastructure and policy.", context: "District energy and electrification are mature." },
          { label: "Grid adaptation", value: "Advanced", description: "Renewable share and infrastructure investment support resilience.", context: "Northern-Europe planning capacity is a strength." },
          { label: "Renewable opportunity", value: "Mixed", description: "Solar is modest; wind, hydro, and bioenergy carry the transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 84,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Stockholm scores well on safety overall, with strong institutional response and steady public-safety planning.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity rather than a single headline statistic.",
        facts: [
          { label: "Safety score", value: "84", unit: "/100", description: "Healthy directional score; localised concerns vary by district.", context: "Stable institutional response supports the score." },
          { label: "Resident perception", value: "Strong", description: "Day-to-day perception is positive across central districts.", context: "Outer-district variation shapes local experience." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 90,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Stockholm offers fast fiber broadband and strong mobile coverage, supporting digital services and remote work.",
        explanation:
          "Connectivity scoring weighs fixed broadband, mobile network performance, and digital-readiness context for households and remote workers.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming, calls, and large-file workflows." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across the metro.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 80,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Stockholm carries moderate climate risk centered on stormwater pressure and Baltic flooding, with strong adaptation planning.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity rather than exposure alone.",
        facts: [
          { label: "Primary hazard", value: "Stormwater", description: "Heavy-rain stormwater pressure is the main short-term hazard.", context: "Active drainage upgrades target this risk." },
          { label: "Heat exposure", value: "Low", description: "Northern-Europe context limits sustained heat stress.", context: "Heat is a smaller driver than for southern peers." },
          { label: "Adaptation capacity", value: "Strong", description: "Long-running planning and infrastructure investment support resilience.", context: "Public-realm and infrastructure investments are key levers." },
        ],
      },
    },
  },
  {
    slug: "oslo",
    name: "Oslo",
    countrySlug: "norway",
    countryName: "Norway",
    region: "Northern Europe",
    population: "1.0M metro",
    intro:
      "Oslo combines hydropower-led low-carbon electricity, strong public services, and rapid electrification of urban transport.",
    outlook:
      "Read Oslo as a stable, climate-forward capital where higher costs are balanced by service depth, electrification, and outdoor amenity.",
    sources: ["un-habitat", "nasa-power", "eea-air", "ipcc-urban", "iea-cities"],
    scores: { overall: 89, affordability: 56, airQuality: 87, energy: 95, resilience: 87 },
    metrics: [
      { label: "Overall city intelligence", value: "89", unit: "/100", score: 89, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "EV adoption", value: "Very high", description: "Electric-vehicle share is among the highest in any major capital." },
      { label: "Climate readiness", value: "Advanced", description: "Hydropower-led electricity and active climate planning support transition capacity." },
    ],
    relatedCitySlugs: ["stockholm", "copenhagen", "helsinki"],
    modules: {
      "cost-of-living": {
        score: 56,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Oslo is one of Europe's most expensive cities for rent, dining, and services, partly offset by income levels and service quality.",
        explanation:
          "Affordability scoring balances headline prices against essential service access and mobility patterns.",
        facts: [
          { label: "Affordability score", value: "56", unit: "/100", description: "Below-median directional score driven by housing and services costs.", context: "Service depth and income levels partially offset prices." },
          { label: "Housing pressure", value: "High", description: "Central rental demand outpaces supply.", context: "New residents often start in outer transit-served neighborhoods." },
          { label: "Transport cost offset", value: "Strong", description: "Transit and EV adoption reduce private mobility costs.", context: "Multi-modal commuting is well established." },
        ],
      },
      "air-quality": {
        score: 87,
        sources: ["who-air", "eea-air"],
        summary:
          "Oslo performs well against health-oriented air-quality benchmarks, with strong European monitoring context.",
        explanation:
          "Scoring prioritizes health, weighting PM2.5, PM10, nitrogen dioxide, and ozone against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "87", unit: "/100", description: "Healthy directional performance against pollutant benchmarks.", context: "Electrified transit and clean energy support results." },
          { label: "Primary pollutant watch", value: "Winter PM10", description: "Wintertime particulates remain a recurring focus.", context: "Studded-tyre and wood-burning context shape exposure." },
          { label: "Monitoring confidence", value: "High", description: "EEA-aligned monitoring supports transparent comparison.", context: "Norwegian monitoring is well-instrumented." },
        ],
      },
      energy: {
        score: 95,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Oslo benefits from a near-fully-renewable national grid led by hydropower, supporting deep electrification of mobility and buildings.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity rather than headline renewable share alone.",
        facts: [
          { label: "Energy readiness", value: "95", unit: "/100", description: "Very strong directional transition score across infrastructure and policy.", context: "Hydropower baseline supports transition options." },
          { label: "Electrification", value: "Very high", description: "Mobility and buildings electrification are mature.", context: "EV share is among the highest globally." },
          { label: "Renewable opportunity", value: "Hydro-led", description: "Hydropower carries the system; wind expansion is more limited.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 88,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Oslo scores well on safety, with strong institutional response and steady public-safety planning.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity rather than a single headline.",
        facts: [
          { label: "Safety score", value: "88", unit: "/100", description: "Healthy directional score; opportunistic risks vary by district.", context: "Stable institutional response supports the score." },
          { label: "Resident perception", value: "Strong", description: "Day-to-day perception is positive across most districts.", context: "Outer-district variation shapes local experience." },
          { label: "Watch item", value: "Property crime", description: "Property-related opportunistic risks remain the practical pain point.", context: "Common-sense precautions are still useful." },
        ],
      },
      "internet-speed": {
        score: 91,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Oslo offers fast fiber broadband and strong mobile coverage, supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context for households.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and large-file workflows." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across the metro.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 84,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Oslo carries moderate climate risk centered on heavy precipitation and stormwater pressure, with strong adaptation planning.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Heavy rain", description: "Stormwater and surface flooding are the main short-term hazards.", context: "Active drainage upgrades target this risk." },
          { label: "Heat exposure", value: "Low", description: "Northern-Europe context limits sustained heat stress.", context: "Heat is a smaller driver than for southern peers." },
          { label: "Adaptation capacity", value: "Strong", description: "Long-running planning supports resilience.", context: "Public-realm and infrastructure investments are key levers." },
        ],
      },
    },
  },
  {
    slug: "helsinki",
    name: "Helsinki",
    countrySlug: "finland",
    countryName: "Finland",
    region: "Northern Europe",
    population: "1.5M metro",
    intro:
      "Helsinki combines strong digital and education infrastructure with steady clean-energy progress and a compact, transit-served urban form.",
    outlook:
      "Read Helsinki as a stable, digitally mature capital where service quality and outdoor amenity balance higher costs.",
    sources: ["un-habitat", "nasa-power", "eea-air", "ipcc-urban", "itu-connectivity"],
    scores: { overall: 88, affordability: 63, airQuality: 88, energy: 88, resilience: 86 },
    metrics: [
      { label: "Overall city intelligence", value: "88", unit: "/100", score: 88, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Digital readiness", value: "Top-tier", description: "Fiber and 5G coverage support remote work and public services." },
      { label: "Climate readiness", value: "Advanced", description: "Heating decarbonization and adaptation planning support transition capacity." },
    ],
    relatedCitySlugs: ["stockholm", "oslo", "copenhagen"],
    modules: {
      "cost-of-living": {
        score: 63,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Helsinki is expensive for rent and services, partly offset by strong public infrastructure and digital service depth.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, services, and stability of daily life.",
        facts: [
          { label: "Affordability score", value: "63", unit: "/100", description: "Moderate directional score; balanced by service quality.", context: "Public-service depth offsets headline prices." },
          { label: "Housing pressure", value: "Moderate-high", description: "Central rental demand is steady; outer districts are more accessible.", context: "Transit access supports outer-district housing." },
          { label: "Transport cost offset", value: "Strong", description: "Transit and cycling networks reduce vehicle costs.", context: "Multi-modal commuting is feasible across the metro." },
        ],
      },
      "air-quality": {
        score: 88,
        sources: ["who-air", "eea-air"],
        summary:
          "Helsinki performs well against health-oriented air-quality benchmarks with steady European monitoring.",
        explanation:
          "Scoring prioritizes health, weighting PM2.5, PM10, nitrogen dioxide, and ozone against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "88", unit: "/100", description: "Healthy directional performance against pollutant benchmarks.", context: "Coastal context and electrified transit support results." },
          { label: "Primary pollutant watch", value: "Winter PM10", description: "Wintertime particulates remain a recurring focus.", context: "Wood-burning and road dust shape seasonal exposure." },
          { label: "Monitoring confidence", value: "High", description: "EEA-aligned monitoring supports transparent comparison.", context: "European monitoring improves comparability." },
        ],
      },
      energy: {
        score: 88,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Helsinki is moving steadily through heating decarbonization with nuclear and renewable electricity supporting the wider transition.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "88", unit: "/100", description: "Strong directional transition score across infrastructure and policy.", context: "District heating decarbonization is a central lever." },
          { label: "Grid adaptation", value: "Advanced", description: "Renewable and nuclear electricity support transition planning.", context: "Northern-Europe planning capacity is a strength." },
          { label: "Renewable opportunity", value: "Mixed", description: "Solar is modest; wind and bioenergy carry the transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 90,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Helsinki scores well on safety, with strong institutional response and stable public-safety perception.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "90", unit: "/100", description: "Healthy directional score.", context: "Stable institutional response supports the score." },
          { label: "Resident perception", value: "Very high", description: "Day-to-day safety perception is strong across the metro.", context: "Pedestrian and night-time perception is widely positive." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 92,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Helsinki offers fast fiber and mobile networks supporting digital services, remote work, and public-service delivery.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and large-file workflows." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across the metro.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 82,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Helsinki carries moderate climate risk centered on coastal storm exposure and stormwater pressure, with steady adaptation planning.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Coastal storms", description: "Baltic storm exposure is the main long-run pressure.", context: "Active adaptation programs target this risk." },
          { label: "Heat exposure", value: "Low", description: "Northern-Europe context limits sustained heat stress.", context: "Heat is a smaller driver than for southern peers." },
          { label: "Adaptation capacity", value: "Strong", description: "Long-running planning supports resilience.", context: "Public-realm investments are key levers." },
        ],
      },
    },
  },
  {
    slug: "brussels",
    name: "Brussels",
    countrySlug: "belgium",
    countryName: "Belgium",
    region: "Western Europe",
    population: "2.1M metro",
    intro:
      "Brussels combines European institutional presence, dense transit networks, and a multilingual services economy at the heart of Western Europe.",
    outlook:
      "Read Brussels as an institutional hub where service depth and connectivity balance housing and air-quality pressures.",
    sources: ["un-habitat", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 81, affordability: 65, airQuality: 74, energy: 80, resilience: 78 },
    metrics: [
      { label: "Overall city intelligence", value: "81", unit: "/100", score: 81, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Institutional density", value: "Very high", description: "European institutions and international organizations shape the local economy." },
      { label: "Mobility confidence", value: "Strong", description: "Metro, rail, and bus systems support car-light daily life." },
    ],
    relatedCitySlugs: ["amsterdam", "paris", "london"],
    modules: {
      "cost-of-living": {
        score: 65,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Brussels is more affordable than Paris or London, with rent and services moderated by city scale and supply.",
        explanation:
          "Affordability scoring balances headline prices against essential service access and mobility patterns.",
        facts: [
          { label: "Affordability score", value: "65", unit: "/100", description: "Moderate directional score; balanced for a Western European capital.", context: "Service depth supports practical affordability." },
          { label: "Housing pressure", value: "Moderate", description: "Rental demand is steady; supply is more flexible than Paris peers.", context: "Outer communes are more accessible than central districts." },
          { label: "Transport cost offset", value: "Strong", description: "Transit access reduces dependence on private vehicles.", context: "Multi-modal commuting is feasible across the metro." },
        ],
      },
      "air-quality": {
        score: 74,
        sources: ["who-air", "eea-air"],
        summary:
          "Brussels performs moderately on air-quality benchmarks, with traffic-related pollutants the main focus.",
        explanation:
          "Scoring prioritizes health, weighting pollutants against WHO guidance and EU monitoring.",
        facts: [
          { label: "Clean-air score", value: "74", unit: "/100", description: "Moderate directional performance against pollutant benchmarks.", context: "Traffic and heating are recurring drivers." },
          { label: "Primary pollutant watch", value: "NO₂", description: "Traffic-related nitrogen dioxide remains a key focus.", context: "Low-emission zone work targets this exposure." },
          { label: "Monitoring confidence", value: "High", description: "EEA-aligned monitoring supports transparent comparison.", context: "European monitoring improves comparability." },
        ],
      },
      energy: {
        score: 80,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Brussels is steadily decarbonising, with national policy momentum and active building-retrofit programs.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "80", unit: "/100", description: "Solid directional transition score across infrastructure and policy.", context: "Retrofit and electrification programs are active." },
          { label: "Grid adaptation", value: "Strong", description: "European grid integration supports renewable scaling.", context: "Cross-border flows shape supply security." },
          { label: "Renewable opportunity", value: "Mixed", description: "Solar is modest; offshore wind carries the broader transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 78,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Brussels scores moderately on safety, with stable institutional response and district-level variation.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "78", unit: "/100", description: "Solid directional score with district-level variation.", context: "Institutional response is stable." },
          { label: "Resident perception", value: "Mixed", description: "Perception varies across central and outer districts.", context: "Local district context matters for everyday experience." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 85,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Brussels offers reliable fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across central districts.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 78,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Brussels carries moderate climate risk centered on heat and heavy-rain stormwater pressure.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Heavy rain", description: "Stormwater and surface flooding are the main short-term hazards.", context: "Active drainage upgrades target this risk." },
          { label: "Heat exposure", value: "Rising", description: "Sustained summer heat is becoming a planning priority.", context: "Tree canopy and cooling work are growing." },
          { label: "Adaptation capacity", value: "Strong", description: "Planning continuity supports resilience.", context: "Public-realm investments are key levers." },
        ],
      },
    },
  },
  {
    slug: "munich",
    name: "Munich",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Central Europe",
    population: "2.9M metro",
    intro:
      "Munich combines strong industrial and technology services with high quality of life, mature transit networks, and alpine outdoor amenity.",
    outlook:
      "Read Munich as a high-service, transit-rich Bavarian capital where higher costs are balanced by income levels and infrastructure quality.",
    sources: ["un-habitat", "nasa-power", "eea-air", "ipcc-urban", "iea-cities"],
    scores: { overall: 88, affordability: 58, airQuality: 80, energy: 84, resilience: 84 },
    metrics: [
      { label: "Overall city intelligence", value: "88", unit: "/100", score: 88, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Industrial depth", value: "Globally cited", description: "Automotive, aerospace, and technology ecosystems shape opportunity." },
      { label: "Mobility confidence", value: "Strong", description: "S-Bahn, U-Bahn, and tram systems support car-light daily life." },
    ],
    relatedCitySlugs: ["berlin", "hamburg", "zurich"],
    modules: {
      "cost-of-living": {
        score: 58,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Munich is Germany's most expensive major city, with rent the main pressure on household budgets.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, services, and the stability of daily life.",
        facts: [
          { label: "Affordability score", value: "58", unit: "/100", description: "Below-median directional score driven by rent.", context: "Income levels partially offset headline prices." },
          { label: "Housing pressure", value: "Very high", description: "Central rental demand consistently outpaces supply.", context: "New residents often start in outer transit-served areas." },
          { label: "Transport cost offset", value: "Strong", description: "Integrated transit reduces vehicle dependence.", context: "Multi-modal commuting is well established." },
        ],
      },
      "air-quality": {
        score: 80,
        sources: ["who-air", "eea-air"],
        summary:
          "Munich performs solidly on air-quality benchmarks, with traffic-related pollutants the main focus.",
        explanation:
          "Scoring prioritizes health against WHO guidance and EU monitoring.",
        facts: [
          { label: "Clean-air score", value: "80", unit: "/100", description: "Solid directional performance against pollutant benchmarks.", context: "Heating and traffic are recurring drivers." },
          { label: "Primary pollutant watch", value: "NO₂", description: "Traffic-related nitrogen dioxide remains a key focus.", context: "Low-emission policy targets this exposure." },
          { label: "Monitoring confidence", value: "High", description: "EEA-aligned monitoring supports transparent comparison.", context: "European monitoring improves comparability." },
        ],
      },
      energy: {
        score: 84,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Munich benefits from active heating and grid-decarbonization work alongside Germany's national renewable transition.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "84", unit: "/100", description: "Strong directional transition score across infrastructure and policy.", context: "District heating and electrification are central." },
          { label: "Grid adaptation", value: "Advanced", description: "Renewable build-out supports planning continuity.", context: "Germany's national transition pace shapes the trajectory." },
          { label: "Renewable opportunity", value: "Solar and geothermal", description: "Local resources support transition direction.", context: "Geothermal capacity is a notable Bavarian strength." },
        ],
      },
      safety: {
        score: 89,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Munich scores well on safety, with strong institutional response and stable public-safety perception.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "89", unit: "/100", description: "Healthy directional score.", context: "Stable institutional response supports the score." },
          { label: "Resident perception", value: "Strong", description: "Day-to-day perception is positive across most districts.", context: "Pedestrian and night-time perception are widely positive." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 84,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Munich offers reliable broadband and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across the metro.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 82,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Munich carries moderate climate risk centered on river flooding and rising summer heat.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Riverine flood", description: "Isar river flooding is the main long-run pressure.", context: "Active flood-management work targets this risk." },
          { label: "Heat exposure", value: "Rising", description: "Sustained summer heat is becoming a planning priority.", context: "Tree canopy and cooling work are growing." },
          { label: "Adaptation capacity", value: "Strong", description: "Planning continuity supports resilience.", context: "Public-realm investments are key levers." },
        ],
      },
    },
  },
  {
    slug: "hamburg",
    name: "Hamburg",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Central Europe",
    population: "3.3M metro",
    intro:
      "Hamburg combines Germany's largest port, strong creative and services sectors, and a coastal climate-adaptation profile.",
    outlook:
      "Read Hamburg as a maritime services hub where infrastructure depth and quality of life balance coastal climate exposure.",
    sources: ["un-habitat", "nasa-power", "eea-air", "ipcc-urban", "iea-cities"],
    scores: { overall: 85, affordability: 64, airQuality: 80, energy: 82, resilience: 80 },
    metrics: [
      { label: "Overall city intelligence", value: "85", unit: "/100", score: 85, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Port and logistics", value: "Globally cited", description: "Hamburg's port shapes regional trade and services activity." },
      { label: "Climate exposure", value: "Coastal", description: "Elbe and North Sea exposure shape adaptation priorities." },
    ],
    relatedCitySlugs: ["berlin", "munich", "amsterdam"],
    modules: {
      "cost-of-living": {
        score: 64,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Hamburg is somewhat more affordable than Munich, with rent steady and service depth supporting daily life.",
        explanation:
          "Affordability scoring balances headline prices against essential service access.",
        facts: [
          { label: "Affordability score", value: "64", unit: "/100", description: "Moderate directional score; balanced by service depth.", context: "Income levels support practical affordability." },
          { label: "Housing pressure", value: "High", description: "Central rental demand is steady; supply is moderate.", context: "Outer districts are more accessible." },
          { label: "Transport cost offset", value: "Strong", description: "Integrated transit reduces vehicle dependence.", context: "Multi-modal commuting is well established." },
        ],
      },
      "air-quality": {
        score: 80,
        sources: ["who-air", "eea-air"],
        summary:
          "Hamburg performs solidly on air-quality benchmarks, with port emissions and traffic the recurring drivers.",
        explanation:
          "Scoring prioritizes health against WHO guidance and EU monitoring.",
        facts: [
          { label: "Clean-air score", value: "80", unit: "/100", description: "Solid directional performance against pollutant benchmarks.", context: "Port and traffic exposure are recurring drivers." },
          { label: "Primary pollutant watch", value: "NO₂", description: "Traffic-related nitrogen dioxide remains a key focus.", context: "Low-emission policy targets this exposure." },
          { label: "Monitoring confidence", value: "High", description: "EEA-aligned monitoring supports transparent comparison.", context: "European monitoring improves comparability." },
        ],
      },
      energy: {
        score: 82,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Hamburg benefits from coastal wind resource and active port and grid decarbonization programs.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "82", unit: "/100", description: "Strong directional transition score across infrastructure and policy.", context: "Wind and hydrogen are central levers." },
          { label: "Grid adaptation", value: "Advanced", description: "Renewable build-out supports planning continuity.", context: "Northern coastal context favors wind." },
          { label: "Renewable opportunity", value: "Wind-led", description: "Offshore and onshore wind carry the transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 84,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Hamburg scores well on safety, with strong institutional response and district-level variation.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "84", unit: "/100", description: "Healthy directional score.", context: "Stable institutional response supports the score." },
          { label: "Resident perception", value: "Strong", description: "Day-to-day perception is positive across most districts.", context: "District-level variation shapes local experience." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 84,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Hamburg offers reliable broadband and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across the metro.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 76,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Hamburg carries elevated climate risk centered on Elbe and storm-surge flooding, with strong adaptation planning.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Storm surge", description: "Coastal storm surge and Elbe flooding are the main long-run pressures.", context: "Long-standing flood programs target these risks." },
          { label: "Heat exposure", value: "Rising", description: "Sustained summer heat is becoming a planning priority.", context: "Tree canopy and cooling work are growing." },
          { label: "Adaptation capacity", value: "Very strong", description: "Long-running flood programs support resilience.", context: "Engineered defences are central." },
        ],
      },
    },
  },
  {
    slug: "dublin",
    name: "Dublin",
    countrySlug: "ireland",
    countryName: "Ireland",
    region: "Western Europe",
    population: "1.5M metro",
    intro:
      "Dublin combines a globally significant technology and finance sector, growing wind capacity, and a compact historic core with rising housing pressure.",
    outlook:
      "Read Dublin as a services-led capital where opportunity and connectivity balance housing-cost pressure.",
    sources: ["un-habitat", "nasa-power", "eea-air", "ipcc-urban", "iea-cities"],
    scores: { overall: 81, affordability: 55, airQuality: 80, energy: 82, resilience: 76 },
    metrics: [
      { label: "Overall city intelligence", value: "81", unit: "/100", score: 81, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Tech-services depth", value: "Globally cited", description: "Software, social, and finance ecosystems shape opportunity." },
      { label: "Affordability pressure", value: "High", description: "Housing-cost pressure is the main resident well-being constraint." },
    ],
    relatedCitySlugs: ["london", "edinburgh", "amsterdam"],
    modules: {
      "cost-of-living": {
        score: 55,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Dublin is among the more expensive Western European capitals for housing, with services more moderate.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, services, and the stability of daily life.",
        facts: [
          { label: "Affordability score", value: "55", unit: "/100", description: "Below-median directional score driven by housing.", context: "Services are more moderate than housing." },
          { label: "Housing pressure", value: "Very high", description: "Central rental demand consistently outpaces supply.", context: "New residents often start in outer areas." },
          { label: "Transport cost offset", value: "Moderate", description: "Bus and rail networks reduce vehicle dependence; coverage is uneven.", context: "Multi-modal commuting varies by corridor." },
        ],
      },
      "air-quality": {
        score: 80,
        sources: ["who-air", "eea-air"],
        summary:
          "Dublin performs solidly on air-quality benchmarks, with traffic-related pollutants the main focus.",
        explanation:
          "Scoring prioritizes health against WHO guidance and EU monitoring.",
        facts: [
          { label: "Clean-air score", value: "80", unit: "/100", description: "Solid directional performance against pollutant benchmarks.", context: "Traffic and heating are recurring drivers." },
          { label: "Primary pollutant watch", value: "NO₂", description: "Traffic-related nitrogen dioxide remains a key focus.", context: "Active mobility policy targets this exposure." },
          { label: "Monitoring confidence", value: "High", description: "EEA-aligned monitoring supports transparent comparison.", context: "European monitoring improves comparability." },
        ],
      },
      energy: {
        score: 82,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Dublin benefits from Ireland's growing wind capacity and an active building-retrofit and electrification policy.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "82", unit: "/100", description: "Strong directional transition score across infrastructure and policy.", context: "Wind capacity drives the national transition." },
          { label: "Grid adaptation", value: "Advanced", description: "Renewable build-out supports planning continuity.", context: "Storage and interconnectors shape grid plans." },
          { label: "Renewable opportunity", value: "Wind-led", description: "Onshore and offshore wind carry the transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 84,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Dublin scores well on safety overall, with district-level variation and stable institutional response.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "84", unit: "/100", description: "Healthy directional score.", context: "Institutional response supports the score." },
          { label: "Resident perception", value: "Mixed", description: "Perception varies between central and outer districts.", context: "Local district context matters." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 88,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Dublin offers fast fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across the metro.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 78,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Dublin carries moderate climate risk centered on coastal storm exposure and heavy-rain stormwater pressure.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Coastal storms", description: "Atlantic storms and storm surge are the main long-run pressures.", context: "Active adaptation work targets these risks." },
          { label: "Heat exposure", value: "Low", description: "Atlantic climate limits sustained heat stress.", context: "Heat is a smaller driver than for southern peers." },
          { label: "Adaptation capacity", value: "Strong", description: "Coastal and drainage adaptation programs support resilience.", context: "Public-realm investments are key levers." },
        ],
      },
    },
  },
  {
    slug: "edinburgh",
    name: "Edinburgh",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    region: "Western Europe",
    population: "0.9M metro",
    intro:
      "Edinburgh combines deep cultural heritage, a strong financial-services sector, and a walkable historic core in a temperate maritime climate.",
    outlook:
      "Read Edinburgh as a high-amenity, services-led capital where heritage and quality of life balance housing pressure.",
    sources: ["un-habitat", "nasa-power", "eea-air", "ipcc-urban"],
    scores: { overall: 85, affordability: 62, airQuality: 82, energy: 80, resilience: 80 },
    metrics: [
      { label: "Overall city intelligence", value: "85", unit: "/100", score: 85, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Cultural heritage", value: "Globally cited", description: "Heritage and creative ecosystems shape urban identity." },
      { label: "Services depth", value: "High", description: "Finance, tourism, and academic services support opportunity." },
    ],
    relatedCitySlugs: ["london", "dublin", "amsterdam"],
    modules: {
      "cost-of-living": {
        score: 62,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Edinburgh is expensive for rent during festival peaks, more moderate off-season; services costs are in line with UK peers.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and seasonal demand.",
        facts: [
          { label: "Affordability score", value: "62", unit: "/100", description: "Moderate directional score; festival seasonality shapes housing.", context: "Off-season is more accessible than peak periods." },
          { label: "Housing pressure", value: "High", description: "Central demand and short-let competition tighten supply.", context: "Outer districts are more accessible." },
          { label: "Transport cost offset", value: "Strong", description: "Walking and transit reduce vehicle dependence.", context: "Multi-modal commuting is feasible." },
        ],
      },
      "air-quality": {
        score: 82,
        sources: ["who-air", "eea-air"],
        summary:
          "Edinburgh performs solidly on air-quality benchmarks, with traffic-related pollutants the main focus.",
        explanation:
          "Scoring prioritizes health against WHO guidance and UK/EEA monitoring.",
        facts: [
          { label: "Clean-air score", value: "82", unit: "/100", description: "Solid directional performance against pollutant benchmarks.", context: "Compact form and traffic policy support results." },
          { label: "Primary pollutant watch", value: "NO₂", description: "Traffic-related nitrogen dioxide remains a key focus.", context: "Low-emission zone work targets this exposure." },
          { label: "Monitoring confidence", value: "High", description: "Public monitoring supports transparent comparison.", context: "UK monitoring is well-instrumented." },
        ],
      },
      energy: {
        score: 80,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Edinburgh benefits from Scotland's strong wind resource and active retrofit and electrification work.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "80", unit: "/100", description: "Solid directional transition score across infrastructure and policy.", context: "Wind capacity drives the regional transition." },
          { label: "Grid adaptation", value: "Strong", description: "Renewable build-out supports planning continuity.", context: "Storage and interconnectors shape grid plans." },
          { label: "Renewable opportunity", value: "Wind-led", description: "Onshore and offshore wind carry the transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 88,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Edinburgh scores well on safety, with stable institutional response and steady public-safety perception.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "88", unit: "/100", description: "Healthy directional score.", context: "Stable institutional response supports the score." },
          { label: "Resident perception", value: "Strong", description: "Day-to-day perception is positive across central districts.", context: "Pedestrian perception is widely positive." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 84,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Edinburgh offers reliable broadband and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across the city.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 80,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Edinburgh carries moderate climate risk centered on coastal storm exposure and heavy-rain stormwater pressure.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Coastal storms", description: "Atlantic storms and storm surge are the main long-run pressures.", context: "Active adaptation work targets these risks." },
          { label: "Heat exposure", value: "Low", description: "Maritime climate limits sustained heat stress.", context: "Heat is a smaller driver than for southern peers." },
          { label: "Adaptation capacity", value: "Strong", description: "Coastal and drainage adaptation programs support resilience.", context: "Public-realm investments are key levers." },
        ],
      },
    },
  },
  {
    slug: "osaka",
    name: "Osaka",
    countrySlug: "japan",
    countryName: "Japan",
    region: "East Asia",
    population: "19M metro",
    intro:
      "Osaka anchors western Japan with dense rail networks, deep food and trade culture, and steady investment in infrastructure modernization.",
    outlook:
      "Read Osaka as a mature, transit-rich metropolitan economy where service density and infrastructure depth balance climate exposure.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban"],
    scores: { overall: 84, affordability: 70, airQuality: 78, energy: 78, resilience: 80 },
    metrics: [
      { label: "Overall city intelligence", value: "84", unit: "/100", score: 84, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Transit reliance", value: "Very high", description: "Rail networks dominate daily mobility patterns." },
      { label: "Service depth", value: "High", description: "Health, retail, and food service density supports daily life." },
    ],
    relatedCitySlugs: ["tokyo", "kyoto", "seoul"],
    modules: {
      "cost-of-living": {
        score: 70,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Osaka is more affordable than Tokyo for housing, with services costs similar.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, services, and the stability of daily life.",
        facts: [
          { label: "Affordability score", value: "70", unit: "/100", description: "Moderate directional score; balanced for a major Japanese metro.", context: "Housing is more accessible than Tokyo peers." },
          { label: "Housing pressure", value: "Moderate", description: "Central rental demand is steady; supply is more flexible.", context: "Outer districts are widely accessible." },
          { label: "Transport cost offset", value: "Very strong", description: "Dense rail networks reduce private-vehicle dependence.", context: "Multi-modal commuting is standard." },
        ],
      },
      "air-quality": {
        score: 78,
        sources: ["who-air"],
        summary:
          "Osaka performs solidly on air-quality benchmarks, with seasonal particulates the main concern.",
        explanation:
          "Scoring prioritizes health against WHO guidance and national monitoring.",
        facts: [
          { label: "Clean-air score", value: "78", unit: "/100", description: "Solid directional performance against pollutant benchmarks.", context: "Industrial and seasonal exposure shape variation." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particulates remain the central health benchmark.", context: "Seasonal patterns shape exposure." },
          { label: "Monitoring confidence", value: "High", description: "National monitoring supports transparent comparison.", context: "Japanese monitoring is well-instrumented." },
        ],
      },
      energy: {
        score: 78,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Osaka benefits from active grid modernization and Japan's broader decarbonization policy.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "78", unit: "/100", description: "Solid directional transition score across infrastructure and policy.", context: "National transition pace shapes the trajectory." },
          { label: "Grid adaptation", value: "Advanced", description: "Mature engineering capacity supports planning continuity.", context: "Japan's infrastructure depth is a strength." },
          { label: "Renewable opportunity", value: "Solar-led", description: "Solar deployment carries the local transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 92,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Osaka scores high on safety, with strong institutional response and steady public-safety perception.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "92", unit: "/100", description: "Healthy directional score.", context: "Stable institutional response supports the score." },
          { label: "Resident perception", value: "Very high", description: "Day-to-day perception is widely positive.", context: "Pedestrian and night-time perception are widely positive." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 88,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Osaka offers fast fiber and mobile networks supporting digital services, remote work, and public-service delivery.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across the metro.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 70,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Osaka carries elevated climate risk centered on coastal flooding, typhoon exposure, and rising summer heat.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Typhoon and flood", description: "Coastal flooding and typhoon surge are the main long-run pressures.", context: "Engineered defences support resilience." },
          { label: "Heat exposure", value: "Rising", description: "Sustained summer heat is rising as a structural concern.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Strong", description: "Engineering capacity supports resilience.", context: "Infrastructure depth is a national strength." },
        ],
      },
    },
  },
  {
    slug: "kyoto",
    name: "Kyoto",
    countrySlug: "japan",
    countryName: "Japan",
    region: "East Asia",
    population: "1.5M city",
    intro:
      "Kyoto anchors Japan's cultural heritage with deep traditional crafts, university research, and a compact, transit-served urban core.",
    outlook:
      "Read Kyoto as a heritage-rich, walkable mid-sized city where cultural depth and service quality balance seasonal tourism pressure.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban"],
    scores: { overall: 86, affordability: 72, airQuality: 82, energy: 78, resilience: 80 },
    metrics: [
      { label: "Overall city intelligence", value: "86", unit: "/100", score: 86, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Cultural heritage", value: "Globally leading", description: "Heritage sites and traditional crafts shape urban identity." },
      { label: "Mobility confidence", value: "Strong", description: "Bus, rail, and walking networks support car-light daily life." },
    ],
    relatedCitySlugs: ["osaka", "tokyo", "taipei"],
    modules: {
      "cost-of-living": {
        score: 72,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Kyoto is more affordable than Tokyo and Osaka for most residents, with seasonal tourism shaping central housing.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and seasonal demand.",
        facts: [
          { label: "Affordability score", value: "72", unit: "/100", description: "Solid directional score for a major heritage city.", context: "Tourist seasonality shapes central rents." },
          { label: "Housing pressure", value: "Moderate", description: "Central demand is steady; outer wards are accessible.", context: "Seasonal short-let competition shapes central rents." },
          { label: "Transport cost offset", value: "Strong", description: "Walking, cycling, and transit reduce vehicle dependence.", context: "Multi-modal commuting is feasible." },
        ],
      },
      "air-quality": {
        score: 82,
        sources: ["who-air"],
        summary:
          "Kyoto performs solidly on air-quality benchmarks, with seasonal particulates the main concern.",
        explanation:
          "Scoring prioritizes health against WHO guidance and national monitoring.",
        facts: [
          { label: "Clean-air score", value: "82", unit: "/100", description: "Solid directional performance against pollutant benchmarks.", context: "Basin geography shapes seasonal exposure." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particulates remain the central health benchmark.", context: "Seasonal patterns shape exposure." },
          { label: "Monitoring confidence", value: "High", description: "National monitoring supports transparent comparison.", context: "Japanese monitoring is well-instrumented." },
        ],
      },
      energy: {
        score: 78,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Kyoto benefits from active retrofit programs and Japan's broader decarbonization policy.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "78", unit: "/100", description: "Solid directional transition score.", context: "National transition pace shapes the trajectory." },
          { label: "Grid adaptation", value: "Advanced", description: "Mature engineering capacity supports planning continuity.", context: "Japan's infrastructure depth is a strength." },
          { label: "Renewable opportunity", value: "Solar-led", description: "Solar deployment carries the local transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 93,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Kyoto scores very high on safety, with stable institutional response and steady public-safety perception.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "93", unit: "/100", description: "Healthy directional score.", context: "Stable institutional response supports the score." },
          { label: "Resident perception", value: "Very high", description: "Day-to-day perception is widely positive.", context: "Pedestrian and night-time perception are widely positive." },
          { label: "Watch item", value: "Tourist-area pickpocketing", description: "Opportunistic risks concentrate in busy tourist zones.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 86,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Kyoto offers fast fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across the city.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 76,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Kyoto carries moderate climate risk centered on rising summer heat and heavy-rain stormwater pressure.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Heavy rain", description: "Stormwater and surface flooding are the main short-term hazards.", context: "Active adaptation work targets this risk." },
          { label: "Heat exposure", value: "Rising", description: "Basin geography accentuates summer heat.", context: "Tree canopy and cooling work are growing." },
          { label: "Adaptation capacity", value: "Strong", description: "Engineering capacity supports resilience.", context: "Infrastructure depth is a national strength." },
        ],
      },
    },
  },
  {
    slug: "beijing",
    name: "Beijing",
    countrySlug: "china",
    countryName: "China",
    region: "East Asia",
    population: "22M metro",
    intro:
      "Beijing anchors China's political and academic life with extensive metro and high-speed rail networks alongside active air-quality and grid-decarbonization work.",
    outlook:
      "Read Beijing as a vast, transit-rich metropolitan capital where infrastructure scale balances air-quality and water-resilience pressures.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban", "iea-cities"],
    scores: { overall: 74, affordability: 68, airQuality: 58, energy: 76, resilience: 70 },
    metrics: [
      { label: "Overall city intelligence", value: "74", unit: "/100", score: 74, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Transit reach", value: "Globally leading", description: "Metro and high-speed rail systems are among the world's largest." },
      { label: "Air-quality priority", value: "Active", description: "Particulate exposure is a central public-health focus." },
    ],
    relatedCitySlugs: ["shanghai", "shenzhen", "seoul"],
    modules: {
      "cost-of-living": {
        score: 68,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Beijing is moderately expensive by Chinese standards, with rent the main pressure on household budgets.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "68", unit: "/100", description: "Moderate directional score.", context: "Outer districts are widely accessible." },
          { label: "Housing pressure", value: "High", description: "Central rental demand outpaces supply.", context: "New residents often start in outer transit-served areas." },
          { label: "Transport cost offset", value: "Very strong", description: "Dense metro network reduces vehicle dependence.", context: "Multi-modal commuting is standard." },
        ],
      },
      "air-quality": {
        score: 58,
        sources: ["who-air"],
        summary:
          "Beijing carries elevated air-quality pressure, with sustained improvement programs reducing peak particulates.",
        explanation:
          "Scoring prioritizes health against WHO guidance and national monitoring.",
        facts: [
          { label: "Clean-air score", value: "58", unit: "/100", description: "Below-median directional score driven by particulate exposure.", context: "Sustained improvement programs reduce peak levels." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particulates remain the central health benchmark.", context: "Seasonal patterns shape exposure." },
          { label: "Monitoring confidence", value: "High", description: "Public monitoring supports transparent comparison.", context: "National monitoring expansion improves comparability." },
        ],
      },
      energy: {
        score: 76,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Beijing benefits from rapid renewable build-out and active grid modernization, with coal-heating transition the central lever.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "76", unit: "/100", description: "Solid directional transition score.", context: "National transition pace shapes the trajectory." },
          { label: "Grid adaptation", value: "Advanced", description: "Renewable build-out supports planning continuity.", context: "Scale of investment is a national strength." },
          { label: "Renewable opportunity", value: "Solar and wind", description: "Diverse resources support transition direction.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 84,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Beijing scores well on safety, with stable institutional response and steady public-safety perception.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "84", unit: "/100", description: "Healthy directional score.", context: "Institutional response supports the score." },
          { label: "Resident perception", value: "Strong", description: "Day-to-day perception is widely positive.", context: "Pedestrian perception is widely positive." },
          { label: "Watch item", value: "Crowded-area pickpocketing", description: "Opportunistic risks concentrate in busy zones.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 78,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Beijing offers fast fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median fiber performance supports digital workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across the metro.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 70,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Beijing carries elevated climate risk centered on water scarcity, heat, and dust events.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Water scarcity", description: "Long-run water management is the main structural pressure.", context: "Inter-basin transfer and demand management shape resilience." },
          { label: "Heat exposure", value: "Rising", description: "Sustained summer heat is rising as a structural concern.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Strong", description: "Engineering capacity supports resilience.", context: "Scale of infrastructure investment is a strength." },
        ],
      },
    },
  },
  {
    slug: "shenzhen",
    name: "Shenzhen",
    countrySlug: "china",
    countryName: "China",
    region: "East Asia",
    population: "17M metro",
    intro:
      "Shenzhen anchors southern China's electronics and tech-services economy with leading EV adoption, dense metro networks, and rapid renewable build-out.",
    outlook:
      "Read Shenzhen as a young, manufacturing-heavy tech metropolis where dynamism and connectivity balance climate exposure and housing pressure.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban", "iea-cities"],
    scores: { overall: 80, affordability: 64, airQuality: 70, energy: 82, resilience: 74 },
    metrics: [
      { label: "Overall city intelligence", value: "80", unit: "/100", score: 80, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "EV adoption", value: "Globally leading", description: "Electric-vehicle share is among the highest globally." },
      { label: "Tech-sector depth", value: "Globally cited", description: "Electronics and software ecosystems shape opportunity." },
    ],
    relatedCitySlugs: ["beijing", "shanghai", "hong-kong"],
    modules: {
      "cost-of-living": {
        score: 64,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Shenzhen is moderately expensive for housing, with services more accessible than headline prices suggest.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "64", unit: "/100", description: "Moderate directional score; housing leads pressure.", context: "Services costs are more accessible." },
          { label: "Housing pressure", value: "High", description: "Central rental demand outpaces supply.", context: "Outer districts are more accessible." },
          { label: "Transport cost offset", value: "Very strong", description: "Dense metro network reduces vehicle dependence.", context: "Multi-modal commuting is standard." },
        ],
      },
      "air-quality": {
        score: 70,
        sources: ["who-air"],
        summary:
          "Shenzhen performs better than northern Chinese peers on air quality, with sustained improvement programs.",
        explanation:
          "Scoring prioritizes health against WHO guidance and national monitoring.",
        facts: [
          { label: "Clean-air score", value: "70", unit: "/100", description: "Moderate directional performance against pollutant benchmarks.", context: "Coastal and renewable energy context support results." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particulates remain the central health benchmark.", context: "Regional flows shape exposure." },
          { label: "Monitoring confidence", value: "High", description: "Public monitoring supports transparent comparison.", context: "National monitoring expansion improves comparability." },
        ],
      },
      energy: {
        score: 82,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Shenzhen benefits from rapid EV adoption, active grid modernization, and proximity to renewable manufacturing.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "82", unit: "/100", description: "Strong directional transition score.", context: "EV adoption and renewables are central levers." },
          { label: "Grid adaptation", value: "Advanced", description: "Renewable build-out supports planning continuity.", context: "Manufacturing ecosystem is a strength." },
          { label: "Renewable opportunity", value: "Solar-led", description: "Solar carries the local transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 82,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Shenzhen scores well on safety, with stable institutional response and steady public-safety perception.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "82", unit: "/100", description: "Healthy directional score.", context: "Institutional response supports the score." },
          { label: "Resident perception", value: "Strong", description: "Day-to-day perception is widely positive.", context: "Pedestrian perception is widely positive." },
          { label: "Watch item", value: "Crowded-area pickpocketing", description: "Opportunistic risks concentrate in busy zones.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 82,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Shenzhen offers fast fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median fiber performance supports digital workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across the metro.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Comprehensive", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 72,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Shenzhen carries elevated climate risk centered on typhoon exposure, coastal flooding, and rising heat.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Typhoon and flood", description: "Coastal flooding and typhoon surge are the main long-run pressures.", context: "Engineered defences support resilience." },
          { label: "Heat exposure", value: "Rising", description: "Sustained summer heat is rising as a structural concern.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Strong", description: "Engineering capacity supports resilience.", context: "Scale of infrastructure investment is a strength." },
        ],
      },
    },
  },
  {
    slug: "ho-chi-minh-city",
    name: "Ho Chi Minh City",
    countrySlug: "vietnam",
    countryName: "Vietnam",
    region: "Southeast Asia",
    population: "13M metro",
    intro:
      "Ho Chi Minh City anchors Vietnam's services and manufacturing growth with rapid urban expansion, expanding metro lines, and active coastal climate-adaptation work.",
    outlook:
      "Read Ho Chi Minh City as a fast-growing, services-led metropolitan economy where dynamism and affordability balance climate exposure and air-quality pressure.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban"],
    scores: { overall: 70, affordability: 80, airQuality: 60, energy: 66, resilience: 60 },
    metrics: [
      { label: "Overall city intelligence", value: "70", unit: "/100", score: 70, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Urban dynamism", value: "Very high", description: "Rapid urban growth and services activity shape opportunity." },
      { label: "Climate exposure", value: "Coastal and monsoon", description: "Coastal flooding and intense rainfall shape adaptation priorities." },
    ],
    relatedCitySlugs: ["hanoi", "bangkok", "manila"],
    modules: {
      "cost-of-living": {
        score: 80,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Ho Chi Minh City is comparatively affordable for housing and services among major regional capitals.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "80", unit: "/100", description: "Strong directional affordability score for the region.", context: "Housing and services are accessible." },
          { label: "Housing pressure", value: "Rising", description: "Central rental demand is rising with growth.", context: "Outer districts are widely accessible." },
          { label: "Transport cost offset", value: "Moderate", description: "Motorbikes dominate mobility; metro is expanding.", context: "Multi-modal options are growing." },
        ],
      },
      "air-quality": {
        score: 60,
        sources: ["who-air"],
        summary:
          "Ho Chi Minh City carries elevated air-quality pressure, with traffic-related pollutants the main concern.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "60", unit: "/100", description: "Below-median directional score driven by traffic and seasonal exposure.", context: "Active mobility transition will shape direction." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO₂", description: "Traffic-related pollutants remain key health benchmarks.", context: "Seasonal patterns shape exposure." },
          { label: "Monitoring confidence", value: "Growing", description: "National monitoring expansion supports transparent comparison.", context: "Coverage is improving." },
        ],
      },
      energy: {
        score: 66,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Ho Chi Minh City benefits from strong solar resource and active grid expansion, with coal-heavy electricity the central transition lever.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "66", unit: "/100", description: "Moderate directional transition score.", context: "National transition pace shapes the trajectory." },
          { label: "Grid adaptation", value: "Growing", description: "Renewable build-out and grid investment are accelerating.", context: "Storage and interconnections shape grid plans." },
          { label: "Renewable opportunity", value: "Solar-led", description: "Strong solar resource supports the transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 76,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Ho Chi Minh City scores moderately on safety, with tourist-area opportunistic risks the main practical pain point.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "76", unit: "/100", description: "Solid directional score.", context: "Institutional response supports the score." },
          { label: "Resident perception", value: "Strong", description: "Day-to-day perception is generally positive.", context: "District-level variation shapes local experience." },
          { label: "Watch item", value: "Phone snatching", description: "Opportunistic property risks concentrate in busy areas.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 72,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Ho Chi Minh City offers reliable fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Solid", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Solid", description: "4G coverage is comprehensive; 5G is expanding.", context: "Useful for daily work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most central areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 56,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Ho Chi Minh City carries elevated climate risk centered on coastal subsidence, flooding, and rising heat.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Flood and subsidence", description: "Coastal flooding and groundwater subsidence are the main pressures.", context: "Active adaptation programs target these risks." },
          { label: "Heat exposure", value: "Rising", description: "Sustained heat is rising as a structural concern.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Growing", description: "Adaptation work is active but exposure is significant.", context: "Drainage and flood programs are central." },
        ],
      },
    },
  },
  {
    slug: "hanoi",
    name: "Hanoi",
    countrySlug: "vietnam",
    countryName: "Vietnam",
    region: "Southeast Asia",
    population: "8.2M metro",
    intro:
      "Hanoi anchors northern Vietnam with deep cultural heritage, growing services activity, and a compact urban core in a humid sub-tropical climate.",
    outlook:
      "Read Hanoi as a heritage-rich, fast-growing capital where affordability and dynamism balance air-quality and climate pressures.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban"],
    scores: { overall: 68, affordability: 82, airQuality: 54, energy: 64, resilience: 62 },
    metrics: [
      { label: "Overall city intelligence", value: "68", unit: "/100", score: 68, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Cultural depth", value: "Very high", description: "Heritage and culinary traditions shape urban identity." },
      { label: "Air-quality priority", value: "Active", description: "Seasonal particulate exposure is a central public-health focus." },
    ],
    relatedCitySlugs: ["ho-chi-minh-city", "bangkok", "manila"],
    modules: {
      "cost-of-living": {
        score: 82,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Hanoi is comparatively affordable for housing and services across most districts.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "82", unit: "/100", description: "Strong directional affordability score for the region.", context: "Housing and services are accessible." },
          { label: "Housing pressure", value: "Rising", description: "Central rental demand is rising with growth.", context: "Outer districts are widely accessible." },
          { label: "Transport cost offset", value: "Moderate", description: "Motorbikes dominate; metro is expanding.", context: "Multi-modal options are growing." },
        ],
      },
      "air-quality": {
        score: 54,
        sources: ["who-air"],
        summary:
          "Hanoi carries elevated air-quality pressure, with seasonal particulates and traffic the main concerns.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "54", unit: "/100", description: "Below-median directional score driven by seasonal particulate exposure.", context: "Improvement programs are active." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particulates remain the central health benchmark.", context: "Seasonal patterns shape exposure." },
          { label: "Monitoring confidence", value: "Growing", description: "National monitoring expansion supports transparent comparison.", context: "Coverage is improving." },
        ],
      },
      energy: {
        score: 64,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Hanoi benefits from active grid expansion and Vietnam's growing renewable build-out.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "64", unit: "/100", description: "Moderate directional transition score.", context: "National transition pace shapes the trajectory." },
          { label: "Grid adaptation", value: "Growing", description: "Renewable build-out and grid investment are accelerating.", context: "Coal-heavy mix is the central transition challenge." },
          { label: "Renewable opportunity", value: "Solar and hydro", description: "Diverse resources support transition direction.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 78,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Hanoi scores well on safety, with steady public-safety perception and stable institutional response.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "78", unit: "/100", description: "Solid directional score.", context: "Institutional response supports the score." },
          { label: "Resident perception", value: "Strong", description: "Day-to-day perception is generally positive.", context: "District-level variation shapes local experience." },
          { label: "Watch item", value: "Tourist-area pickpocketing", description: "Opportunistic property risks concentrate in busy zones.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 72,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Hanoi offers reliable fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Solid", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Solid", description: "4G coverage is comprehensive; 5G is expanding.", context: "Useful for daily work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most central areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 58,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Hanoi carries elevated climate risk centered on monsoon flooding and rising summer heat.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Flood and heat", description: "Monsoon flooding and summer heat are the main pressures.", context: "Active adaptation programs target these risks." },
          { label: "Heat exposure", value: "Rising", description: "Sustained summer heat is rising as a structural concern.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Growing", description: "Adaptation work is active but exposure is significant.", context: "Drainage and flood programs are central." },
        ],
      },
    },
  },
  {
    slug: "delhi",
    name: "Delhi",
    countrySlug: "india",
    countryName: "India",
    region: "South Asia",
    population: "33M metro",
    intro:
      "Delhi anchors northern India's political, services, and academic life with extensive metro networks and active air-quality and water-resilience work.",
    outlook:
      "Read Delhi as a vast, dynamic capital where economic depth and connectivity balance significant air-quality and heat pressures.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban", "iea-cities"],
    scores: { overall: 64, affordability: 80, airQuality: 38, energy: 66, resilience: 58 },
    metrics: [
      { label: "Overall city intelligence", value: "64", unit: "/100", score: 64, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Metro network", value: "Globally cited", description: "Delhi Metro is one of the world's largest." },
      { label: "Air-quality priority", value: "Very high", description: "Particulate exposure is a central public-health focus." },
    ],
    relatedCitySlugs: ["mumbai", "bangalore", "dubai"],
    modules: {
      "cost-of-living": {
        score: 80,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Delhi is comparatively affordable for housing and services across most districts.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "80", unit: "/100", description: "Strong directional affordability score for the region.", context: "Housing and services are accessible." },
          { label: "Housing pressure", value: "Mixed", description: "Central premium districts contrast with broad outer accessibility.", context: "District-level variation shapes experience." },
          { label: "Transport cost offset", value: "Strong", description: "Metro and bus networks reduce vehicle dependence.", context: "Multi-modal commuting is widely used." },
        ],
      },
      "air-quality": {
        score: 38,
        sources: ["who-air"],
        summary:
          "Delhi carries significant air-quality pressure, with seasonal particulate exposure a central public-health focus.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "38", unit: "/100", description: "Low directional score driven by particulate exposure.", context: "Improvement programs are active but pressure is significant." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particulates remain the central health benchmark.", context: "Seasonal patterns shape peak exposure." },
          { label: "Monitoring confidence", value: "High", description: "Public monitoring supports transparent comparison.", context: "National monitoring expansion improves comparability." },
        ],
      },
      energy: {
        score: 66,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Delhi benefits from rapid solar build-out and active grid expansion, with coal-heavy electricity the central transition lever.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "66", unit: "/100", description: "Moderate directional transition score.", context: "National transition pace shapes the trajectory." },
          { label: "Grid adaptation", value: "Growing", description: "Renewable build-out and grid investment are accelerating.", context: "Coal-heavy mix is the central transition challenge." },
          { label: "Renewable opportunity", value: "Solar-led", description: "Strong solar resource supports the transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 70,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Delhi scores moderately on safety, with district-level variation and active institutional response.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "70", unit: "/100", description: "Moderate directional score.", context: "District-level variation shapes experience." },
          { label: "Resident perception", value: "Mixed", description: "Perception varies sharply across districts and times.", context: "Local district context matters." },
          { label: "Watch item", value: "Pickpocketing and harassment", description: "Opportunistic risks concentrate in crowded zones.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 74,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Delhi offers reliable fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Solid", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Solid", description: "4G coverage is comprehensive; 5G is expanding.", context: "Useful for daily work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 54,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Delhi carries significant climate risk centered on heat, water scarcity, and air-quality co-stress.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Heat and water", description: "Sustained heat and water scarcity are the main long-run pressures.", context: "Cooling demand grows with extremes." },
          { label: "Heat exposure", value: "Very high", description: "Sustained summer heat is a central concern.", context: "Cooling and adaptation programs are growing." },
          { label: "Adaptation capacity", value: "Growing", description: "Adaptation work is active but exposure is significant.", context: "Public realm and cooling programs are central." },
        ],
      },
    },
  },
  {
    slug: "bangalore",
    name: "Bangalore",
    countrySlug: "india",
    countryName: "India",
    region: "South Asia",
    population: "13M metro",
    intro:
      "Bangalore anchors India's technology and software services economy with rapid urban growth, mild climate, and active metro expansion.",
    outlook:
      "Read Bangalore as a services-led tech metropolis where opportunity and climate balance traffic and water-resilience pressures.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban"],
    scores: { overall: 72, affordability: 76, airQuality: 62, energy: 70, resilience: 64 },
    metrics: [
      { label: "Overall city intelligence", value: "72", unit: "/100", score: 72, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Tech-services depth", value: "Globally cited", description: "Software and IT services ecosystems shape opportunity." },
      { label: "Climate context", value: "Mild plateau", description: "Elevation moderates temperatures year-round." },
    ],
    relatedCitySlugs: ["mumbai", "delhi", "ho-chi-minh-city"],
    modules: {
      "cost-of-living": {
        score: 76,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Bangalore is moderately affordable, with rapid growth pushing central rents but outer districts remaining accessible.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "76", unit: "/100", description: "Solid directional affordability score for the region.", context: "Outer districts are widely accessible." },
          { label: "Housing pressure", value: "Rising", description: "Central rental demand is rising with tech-sector growth.", context: "Outer districts remain accessible." },
          { label: "Transport cost offset", value: "Moderate", description: "Metro is expanding; private mobility dominates today.", context: "Multi-modal options are growing." },
        ],
      },
      "air-quality": {
        score: 62,
        sources: ["who-air"],
        summary:
          "Bangalore performs moderately on air-quality benchmarks, with traffic-related pollutants the main concern.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "62", unit: "/100", description: "Moderate directional performance against pollutant benchmarks.", context: "Traffic is a recurring driver." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO₂", description: "Traffic-related pollutants remain key health benchmarks.", context: "Seasonal patterns shape exposure." },
          { label: "Monitoring confidence", value: "Growing", description: "Public monitoring supports transparent comparison.", context: "Coverage is improving." },
        ],
      },
      energy: {
        score: 70,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Bangalore benefits from strong solar resource and active grid expansion, with services-sector demand shaping the transition.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "70", unit: "/100", description: "Moderate directional transition score.", context: "National transition pace shapes the trajectory." },
          { label: "Grid adaptation", value: "Growing", description: "Renewable build-out and grid investment are accelerating.", context: "Services-sector demand shapes planning." },
          { label: "Renewable opportunity", value: "Solar-led", description: "Strong solar resource supports the transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 78,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Bangalore scores well on safety, with steady public-safety perception and stable institutional response.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "78", unit: "/100", description: "Solid directional score.", context: "Institutional response supports the score." },
          { label: "Resident perception", value: "Strong", description: "Day-to-day perception is generally positive.", context: "District-level variation shapes experience." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 80,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Bangalore offers fast fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median fiber performance supports digital workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Fast", description: "4G coverage is comprehensive; 5G is expanding.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 64,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Bangalore carries moderate climate risk centered on water scarcity and urban flooding.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Water and flood", description: "Water scarcity and urban flooding are the main pressures.", context: "Active adaptation programs target these risks." },
          { label: "Heat exposure", value: "Moderate", description: "Plateau elevation moderates sustained heat stress.", context: "Heat is a smaller driver than for northern Indian peers." },
          { label: "Adaptation capacity", value: "Growing", description: "Adaptation work is active.", context: "Stormwater and water-supply programs are central." },
        ],
      },
    },
  },
  {
    slug: "riyadh",
    name: "Riyadh",
    countrySlug: "saudi-arabia",
    countryName: "Saudi Arabia",
    region: "Western Asia",
    population: "8.0M metro",
    intro:
      "Riyadh anchors Saudi Arabia's political and economic life with large-scale urban modernization programs, expanding metro infrastructure, and exceptional solar resource.",
    outlook:
      "Read Riyadh as a fast-evolving capital where modernization investment and digital readiness balance significant heat and water-resilience pressures.",
    sources: ["un-habitat", "nasa-power", "ipcc-urban", "iea-cities"],
    scores: { overall: 70, affordability: 70, airQuality: 60, energy: 76, resilience: 62 },
    metrics: [
      { label: "Overall city intelligence", value: "70", unit: "/100", score: 70, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Solar resource", value: "Exceptional", description: "Among the strongest solar irradiance levels globally." },
      { label: "Urban modernization", value: "Active", description: "Major infrastructure programs are underway across the metro." },
    ],
    relatedCitySlugs: ["dubai", "doha", "abu-dhabi"],
    modules: {
      "cost-of-living": {
        score: 70,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Riyadh is moderately priced for the region, with rent rising in central districts and services costs steady.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "70", unit: "/100", description: "Moderate directional score for the region.", context: "Outer districts are widely accessible." },
          { label: "Housing pressure", value: "Rising", description: "Central rental demand is rising with modernization.", context: "Outer districts remain accessible." },
          { label: "Transport cost offset", value: "Growing", description: "Metro is expanding; private mobility dominates today.", context: "Multi-modal options are growing." },
        ],
      },
      "air-quality": {
        score: 60,
        sources: ["who-air"],
        summary:
          "Riyadh carries elevated air-quality pressure with seasonal dust and traffic-related pollutants the main concerns.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "60", unit: "/100", description: "Moderate directional performance against pollutant benchmarks.", context: "Dust and traffic shape exposure." },
          { label: "Primary pollutant watch", value: "PM10 and PM2.5", description: "Particulates remain the central health benchmark.", context: "Seasonal dust events shape peak exposure." },
          { label: "Monitoring confidence", value: "Growing", description: "Public monitoring supports transparent comparison.", context: "Coverage is expanding." },
        ],
      },
      energy: {
        score: 76,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Riyadh benefits from exceptional solar resource and active national renewable build-out under the national transition plan.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "76", unit: "/100", description: "Solid directional transition score.", context: "National transition pace shapes the trajectory." },
          { label: "Grid adaptation", value: "Growing", description: "Renewable build-out and grid investment are accelerating.", context: "Solar carries the transition." },
          { label: "Renewable opportunity", value: "Exceptional solar", description: "Among the strongest solar resources globally.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 86,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Riyadh scores well on safety, with stable institutional response and steady public-safety perception.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "86", unit: "/100", description: "Healthy directional score.", context: "Institutional response supports the score." },
          { label: "Resident perception", value: "Strong", description: "Day-to-day perception is widely positive.", context: "Pedestrian perception is widely positive." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 84,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Riyadh offers fast fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across central districts.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 58,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Riyadh carries elevated climate risk centered on extreme heat and water scarcity.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Heat and water", description: "Sustained heat and water scarcity are the main long-run pressures.", context: "Cooling demand grows with extremes." },
          { label: "Heat exposure", value: "Very high", description: "Sustained summer heat is a central concern.", context: "Cooling and adaptation programs are central." },
          { label: "Adaptation capacity", value: "Growing", description: "Adaptation work is active.", context: "Water and cooling programs are central." },
        ],
      },
    },
  },
  {
    slug: "tel-aviv",
    name: "Tel Aviv",
    countrySlug: "israel",
    countryName: "Israel",
    region: "Western Asia",
    population: "4.4M metro",
    intro:
      "Tel Aviv anchors Israel's technology and innovation economy with a compact coastal urban core, strong digital readiness, and Mediterranean climate amenity.",
    outlook:
      "Read Tel Aviv as a high-amenity, tech-led coastal capital where opportunity and connectivity balance housing pressure and water-resilience priorities.",
    sources: ["un-habitat", "nasa-power", "ipcc-urban", "itu-connectivity"],
    scores: { overall: 81, affordability: 56, airQuality: 76, energy: 78, resilience: 74 },
    metrics: [
      { label: "Overall city intelligence", value: "81", unit: "/100", score: 81, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Tech-sector depth", value: "Globally cited", description: "Software and deep-tech ecosystems shape opportunity." },
      { label: "Digital readiness", value: "Top-tier", description: "Fiber and mobile networks reach broad urban coverage." },
    ],
    relatedCitySlugs: ["dubai", "doha", "istanbul"],
    modules: {
      "cost-of-living": {
        score: 56,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Tel Aviv is among the more expensive cities globally for housing, with services costs also elevated.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "56", unit: "/100", description: "Below-median directional score driven by housing.", context: "Income levels partially offset prices." },
          { label: "Housing pressure", value: "Very high", description: "Central rental demand consistently outpaces supply.", context: "New residents often start outside the central core." },
          { label: "Transport cost offset", value: "Moderate", description: "Bus networks support mobility; light rail is expanding.", context: "Multi-modal options are growing." },
        ],
      },
      "air-quality": {
        score: 76,
        sources: ["who-air"],
        summary:
          "Tel Aviv performs moderately on air-quality benchmarks, with traffic-related pollutants the main focus.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "76", unit: "/100", description: "Moderate directional performance against pollutant benchmarks.", context: "Traffic is a recurring driver." },
          { label: "Primary pollutant watch", value: "NO₂ and PM2.5", description: "Traffic-related pollutants remain key health benchmarks.", context: "Coastal context shapes dispersion." },
          { label: "Monitoring confidence", value: "High", description: "Public monitoring supports transparent comparison.", context: "National monitoring is well-instrumented." },
        ],
      },
      energy: {
        score: 78,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Tel Aviv benefits from strong solar resource and active national grid modernization.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "78", unit: "/100", description: "Solid directional transition score.", context: "National transition pace shapes the trajectory." },
          { label: "Grid adaptation", value: "Strong", description: "Renewable build-out supports planning continuity.", context: "Storage shapes grid plans." },
          { label: "Renewable opportunity", value: "Solar-led", description: "Strong solar resource supports the transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 82,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Tel Aviv scores well on day-to-day safety with stable institutional response.",
        explanation:
          "Safety blends day-to-day crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "82", unit: "/100", description: "Healthy directional score.", context: "Stable institutional response supports the score." },
          { label: "Resident perception", value: "Strong", description: "Day-to-day perception is generally positive in central districts.", context: "District-level variation shapes experience." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 88,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Tel Aviv offers fast fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across the metro.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 72,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Tel Aviv carries moderate climate risk centered on coastal flooding, heat, and water resilience.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Coastal flood", description: "Sea-level rise and storm exposure shape long-run risk.", context: "Active adaptation work targets this risk." },
          { label: "Heat exposure", value: "Rising", description: "Sustained summer heat is rising as a structural concern.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Strong", description: "Engineering capacity supports resilience.", context: "Water and stormwater programs are central." },
        ],
      },
    },
  },
  {
    slug: "istanbul",
    name: "Istanbul",
    countrySlug: "turkey",
    countryName: "Turkey",
    region: "Western Asia",
    population: "16M metro",
    intro:
      "Istanbul anchors Turkey's economic and cultural life across two continents with deep heritage, extensive metro networks, and active seismic and renewable transition work.",
    outlook:
      "Read Istanbul as a vast, heritage-rich, transit-served metropolitan economy where cultural depth and connectivity balance seismic and air-quality pressures.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban", "iea-cities"],
    scores: { overall: 70, affordability: 76, airQuality: 60, energy: 66, resilience: 60 },
    metrics: [
      { label: "Overall city intelligence", value: "70", unit: "/100", score: 70, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Cultural heritage", value: "Globally significant", description: "Heritage and creative ecosystems shape urban identity." },
      { label: "Seismic adaptation", value: "Active", description: "Building-code and resilience programs are central to urban planning." },
    ],
    relatedCitySlugs: ["athens", "dubai", "cairo"],
    modules: {
      "cost-of-living": {
        score: 76,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Istanbul is comparatively affordable for housing and services across most districts.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "76", unit: "/100", description: "Solid directional affordability score for the region.", context: "Outer districts are widely accessible." },
          { label: "Housing pressure", value: "Mixed", description: "Central premium districts contrast with broader accessibility.", context: "District-level variation shapes experience." },
          { label: "Transport cost offset", value: "Strong", description: "Metro and bus networks reduce vehicle dependence.", context: "Multi-modal commuting is widely used." },
        ],
      },
      "air-quality": {
        score: 60,
        sources: ["who-air"],
        summary:
          "Istanbul carries elevated air-quality pressure with seasonal heating and traffic-related pollutants the main concerns.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "60", unit: "/100", description: "Moderate directional performance against pollutant benchmarks.", context: "Heating and traffic are recurring drivers." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO₂", description: "Traffic and heating pollutants remain key health benchmarks.", context: "Seasonal patterns shape exposure." },
          { label: "Monitoring confidence", value: "Growing", description: "Public monitoring supports transparent comparison.", context: "Coverage is expanding." },
        ],
      },
      energy: {
        score: 66,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Istanbul benefits from active national renewable build-out with diverse wind, hydro, and solar resources.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "66", unit: "/100", description: "Moderate directional transition score.", context: "National transition pace shapes the trajectory." },
          { label: "Grid adaptation", value: "Growing", description: "Renewable build-out supports planning continuity.", context: "Storage and interconnections shape grid plans." },
          { label: "Renewable opportunity", value: "Diverse", description: "Wind, hydro, and solar support the transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 76,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Istanbul scores moderately on safety, with tourist-area opportunistic risks the main practical pain point.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "76", unit: "/100", description: "Solid directional score.", context: "District-level variation shapes experience." },
          { label: "Resident perception", value: "Mixed", description: "Perception varies between central tourist zones and outer districts.", context: "Local district context matters." },
          { label: "Watch item", value: "Tourist-area pickpocketing", description: "Opportunistic property risks concentrate in busy zones.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 74,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Istanbul offers reliable fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Solid", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Solid", description: "4G coverage is comprehensive; 5G is expanding.", context: "Useful for daily work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 58,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Istanbul carries elevated climate risk centered on seismic exposure, heat, and storm flooding.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Seismic and flood", description: "Seismic exposure and storm flooding are the main pressures.", context: "Active building-code and adaptation work target these risks." },
          { label: "Heat exposure", value: "Rising", description: "Sustained summer heat is rising as a structural concern.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Growing", description: "Adaptation work is active.", context: "Building codes and drainage programs are central." },
        ],
      },
    },
  },
  {
    slug: "casablanca",
    name: "Casablanca",
    countrySlug: "morocco",
    countryName: "Morocco",
    region: "Africa",
    population: "4.3M metro",
    intro:
      "Casablanca anchors Morocco's commercial and financial life with a major Atlantic port, growing services activity, and strong national solar build-out.",
    outlook:
      "Read Casablanca as a commercial gateway where regional services and affordability balance coastal climate exposure and water-resilience pressures.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban", "iea-cities"],
    scores: { overall: 70, affordability: 78, airQuality: 66, energy: 74, resilience: 66 },
    metrics: [
      { label: "Overall city intelligence", value: "70", unit: "/100", score: 70, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Services depth", value: "Strong", description: "Finance, logistics, and trade ecosystems shape opportunity." },
      { label: "Renewable resource", value: "Very strong", description: "National solar build-out is among the most ambitious globally." },
    ],
    relatedCitySlugs: ["lisbon", "madrid", "cairo"],
    modules: {
      "cost-of-living": {
        score: 78,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Casablanca is comparatively affordable for housing and services among major North African cities.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "78", unit: "/100", description: "Solid directional affordability score for the region.", context: "Housing and services are accessible." },
          { label: "Housing pressure", value: "Moderate", description: "Central rental demand is steady.", context: "Outer districts are widely accessible." },
          { label: "Transport cost offset", value: "Growing", description: "Tram and bus networks support mobility.", context: "Multi-modal options are growing." },
        ],
      },
      "air-quality": {
        score: 66,
        sources: ["who-air"],
        summary:
          "Casablanca performs moderately on air-quality benchmarks, with traffic and port emissions the main drivers.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "66", unit: "/100", description: "Moderate directional performance against pollutant benchmarks.", context: "Traffic and port exposure shape variation." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO₂", description: "Traffic-related pollutants remain key health benchmarks.", context: "Coastal context shapes dispersion." },
          { label: "Monitoring confidence", value: "Growing", description: "Public monitoring supports transparent comparison.", context: "Coverage is expanding." },
        ],
      },
      energy: {
        score: 74,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Casablanca benefits from Morocco's leading solar build-out and active grid modernization.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "74", unit: "/100", description: "Solid directional transition score.", context: "National transition pace shapes the trajectory." },
          { label: "Grid adaptation", value: "Strong", description: "Renewable build-out supports planning continuity.", context: "Solar carries the national transition." },
          { label: "Renewable opportunity", value: "Solar and wind", description: "Strong resources support the transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 76,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Casablanca scores moderately on safety, with tourist-area opportunistic risks the main practical pain point.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "76", unit: "/100", description: "Solid directional score.", context: "District-level variation shapes experience." },
          { label: "Resident perception", value: "Strong", description: "Day-to-day perception is generally positive.", context: "District-level variation shapes experience." },
          { label: "Watch item", value: "Pickpocketing", description: "Opportunistic property risks concentrate in busy zones.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 72,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Casablanca offers reliable fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Solid", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Solid", description: "4G coverage is comprehensive; 5G is expanding.", context: "Useful for daily work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most central areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 66,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Casablanca carries moderate climate risk centered on coastal flooding and water scarcity.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Coastal and water", description: "Coastal flooding and water scarcity are the main pressures.", context: "Active adaptation programs target these risks." },
          { label: "Heat exposure", value: "Moderate", description: "Atlantic coastal context moderates sustained heat.", context: "Inland heat is rising." },
          { label: "Adaptation capacity", value: "Growing", description: "Adaptation work is active.", context: "Water and coastal programs are central." },
        ],
      },
    },
  },
  {
    slug: "accra",
    name: "Accra",
    countrySlug: "ghana",
    countryName: "Ghana",
    region: "Africa",
    population: "2.5M metro",
    intro:
      "Accra anchors Ghana's services, finance, and culture along the Atlantic coast with growing fintech activity and active coastal climate-adaptation work.",
    outlook:
      "Read Accra as a coastal services hub where regional dynamism and affordability balance flood and air-quality pressures.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban"],
    scores: { overall: 64, affordability: 80, airQuality: 56, energy: 60, resilience: 56 },
    metrics: [
      { label: "Overall city intelligence", value: "64", unit: "/100", score: 64, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Services depth", value: "Growing", description: "Finance, fintech, and creative ecosystems shape opportunity." },
      { label: "Climate exposure", value: "Coastal flood", description: "Coastal flooding shapes adaptation priorities." },
    ],
    relatedCitySlugs: ["lagos", "nairobi", "cape-town"],
    modules: {
      "cost-of-living": {
        score: 80,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Accra is comparatively affordable for housing and services, with central premium districts the exception.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "80", unit: "/100", description: "Strong directional affordability score for the region.", context: "Outer areas are widely accessible." },
          { label: "Housing pressure", value: "Mixed", description: "Central premium districts contrast with broader accessibility.", context: "District-level variation shapes experience." },
          { label: "Transport cost offset", value: "Limited", description: "Private mobility and informal transit dominate.", context: "Formal transit options are limited." },
        ],
      },
      "air-quality": {
        score: 56,
        sources: ["who-air"],
        summary:
          "Accra carries elevated air-quality pressure with traffic and seasonal dust the main drivers.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "56", unit: "/100", description: "Below-median directional score driven by traffic and seasonal exposure.", context: "Improvement programs are growing." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particulates remain the central health benchmark.", context: "Seasonal Harmattan dust shapes peak exposure." },
          { label: "Monitoring confidence", value: "Growing", description: "Public monitoring is expanding.", context: "Coverage is improving." },
        ],
      },
      energy: {
        score: 60,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Accra benefits from active grid expansion and Ghana's growing renewable build-out, with reliability the central operational lever.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "60", unit: "/100", description: "Moderate directional transition score.", context: "Reliability shapes user experience." },
          { label: "Grid adaptation", value: "Growing", description: "Renewable build-out is accelerating.", context: "Reliability programs are central." },
          { label: "Renewable opportunity", value: "Solar-led", description: "Strong solar resource supports the transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 76,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Accra scores moderately on safety, with stable institutional response and steady public-safety perception.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "76", unit: "/100", description: "Solid directional score.", context: "Institutional response supports the score." },
          { label: "Resident perception", value: "Generally positive", description: "Day-to-day perception is generally positive.", context: "District-level variation shapes experience." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 66,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Accra offers reliable mobile networks and growing fiber coverage supporting digital services.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Solid", description: "Median fiber performance supports remote workflows in covered areas.", context: "Coverage is expanding." },
          { label: "Mobile network", value: "Solid", description: "4G coverage is broad; 5G is expanding.", context: "Useful for daily work and mobility." },
          { label: "Coverage", value: "Expanding", description: "Fiber footprint is expanding across the metro.", context: "Service availability is growing." },
        ],
      },
      "climate-risk": {
        score: 56,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Accra carries elevated climate risk centered on coastal flooding, drainage pressure, and rising heat.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Coastal flood", description: "Coastal erosion and flooding are the main long-run pressures.", context: "Active adaptation work targets this risk." },
          { label: "Heat exposure", value: "Rising", description: "Sustained heat is rising as a structural concern.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Growing", description: "Adaptation work is active.", context: "Drainage and coastal programs are central." },
        ],
      },
    },
  },
  {
    slug: "cairo",
    name: "Cairo",
    countrySlug: "egypt",
    countryName: "Egypt",
    region: "Africa",
    population: "22M metro",
    intro:
      "Cairo anchors Egypt's political, economic, and cultural life along the Nile with deep heritage, vast metro networks, and active solar and water-resilience programs.",
    outlook:
      "Read Cairo as a vast, heritage-rich capital where service density and infrastructure scale balance significant air-quality and water-resilience pressures.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban", "iea-cities"],
    scores: { overall: 66, affordability: 80, airQuality: 50, energy: 68, resilience: 58 },
    metrics: [
      { label: "Overall city intelligence", value: "66", unit: "/100", score: 66, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Cultural heritage", value: "Globally leading", description: "Heritage and creative ecosystems shape urban identity." },
      { label: "Solar resource", value: "Exceptional", description: "Among the strongest solar irradiance levels globally." },
    ],
    relatedCitySlugs: ["istanbul", "dubai", "casablanca"],
    modules: {
      "cost-of-living": {
        score: 80,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Cairo is comparatively affordable for housing and services across most districts.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "80", unit: "/100", description: "Strong directional affordability score for the region.", context: "Outer districts are widely accessible." },
          { label: "Housing pressure", value: "Mixed", description: "Central premium districts contrast with broad outer accessibility.", context: "District-level variation shapes experience." },
          { label: "Transport cost offset", value: "Strong", description: "Metro and bus networks reduce vehicle dependence.", context: "Multi-modal commuting is widely used." },
        ],
      },
      "air-quality": {
        score: 50,
        sources: ["who-air"],
        summary:
          "Cairo carries significant air-quality pressure, with sustained particulate exposure a central public-health focus.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "50", unit: "/100", description: "Low directional score driven by particulate exposure.", context: "Improvement programs are active but exposure is significant." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particulates remain the central health benchmark.", context: "Dust and traffic shape exposure." },
          { label: "Monitoring confidence", value: "Growing", description: "Public monitoring is expanding.", context: "Coverage is improving." },
        ],
      },
      energy: {
        score: 68,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Cairo benefits from exceptional solar resource and active national grid modernization.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "68", unit: "/100", description: "Moderate directional transition score.", context: "National transition pace shapes the trajectory." },
          { label: "Grid adaptation", value: "Growing", description: "Renewable build-out supports planning continuity.", context: "Storage and interconnections shape grid plans." },
          { label: "Renewable opportunity", value: "Exceptional solar", description: "Strong solar resource supports the transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 78,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Cairo scores moderately on safety, with tourist-area opportunistic risks the main practical pain point.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "78", unit: "/100", description: "Solid directional score.", context: "Institutional response supports the score." },
          { label: "Resident perception", value: "Generally positive", description: "Day-to-day perception is generally positive.", context: "District-level variation shapes experience." },
          { label: "Watch item", value: "Tourist-area pickpocketing", description: "Opportunistic property risks concentrate in busy zones.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 68,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Cairo offers reliable fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Solid", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Solid", description: "4G coverage is comprehensive; 5G is expanding.", context: "Useful for daily work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most central areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 54,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Cairo carries elevated climate risk centered on extreme heat, water resilience, and dust events.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Heat and water", description: "Sustained heat and water management are the main long-run pressures.", context: "Cooling demand grows with extremes." },
          { label: "Heat exposure", value: "Very high", description: "Sustained summer heat is a central concern.", context: "Cooling and adaptation programs are central." },
          { label: "Adaptation capacity", value: "Growing", description: "Adaptation work is active.", context: "Water and cooling programs are central." },
        ],
      },
    },
  },
  {
    slug: "addis-ababa",
    name: "Addis Ababa",
    countrySlug: "ethiopia",
    countryName: "Ethiopia",
    region: "Africa",
    population: "5.5M metro",
    intro:
      "Addis Ababa anchors Ethiopia's political and diplomatic life on the highland plateau with growing infrastructure modernization and a temperate climate.",
    outlook:
      "Read Addis Ababa as a fast-growing highland capital where institutional depth and renewable electricity balance air-quality and infrastructure pressures.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban"],
    scores: { overall: 64, affordability: 82, airQuality: 62, energy: 72, resilience: 60 },
    metrics: [
      { label: "Overall city intelligence", value: "64", unit: "/100", score: 64, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Energy mix", value: "Hydropower-led", description: "Hydropower supports a comparatively low-carbon baseline." },
      { label: "Climate context", value: "Mild highland", description: "Elevation moderates temperatures year-round." },
    ],
    relatedCitySlugs: ["nairobi", "kigali", "accra"],
    modules: {
      "cost-of-living": {
        score: 82,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Addis Ababa is comparatively affordable for housing and services across most districts.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "82", unit: "/100", description: "Strong directional affordability score for the region.", context: "Outer areas are widely accessible." },
          { label: "Housing pressure", value: "Rising", description: "Central rental demand is rising with growth.", context: "Outer districts remain accessible." },
          { label: "Transport cost offset", value: "Growing", description: "Light rail and bus networks support mobility.", context: "Multi-modal options are growing." },
        ],
      },
      "air-quality": {
        score: 62,
        sources: ["who-air"],
        summary:
          "Addis Ababa performs moderately on air-quality benchmarks, with traffic and seasonal exposure the main drivers.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "62", unit: "/100", description: "Moderate directional performance against pollutant benchmarks.", context: "Highland context shapes dispersion." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particulates remain the central health benchmark.", context: "Seasonal patterns shape exposure." },
          { label: "Monitoring confidence", value: "Growing", description: "Public monitoring is expanding.", context: "Coverage is improving." },
        ],
      },
      energy: {
        score: 72,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Addis Ababa benefits from Ethiopia's hydropower-led low-carbon electricity baseline and active grid expansion.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "72", unit: "/100", description: "Solid directional transition score.", context: "Hydropower supports the baseline." },
          { label: "Grid adaptation", value: "Growing", description: "Grid expansion supports planning continuity.", context: "Reliability is the central operational lever." },
          { label: "Renewable opportunity", value: "Hydro-led", description: "Hydropower carries the local transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 78,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Addis Ababa scores moderately on safety, with stable institutional response and steady public-safety perception.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "78", unit: "/100", description: "Solid directional score.", context: "Institutional response supports the score." },
          { label: "Resident perception", value: "Generally positive", description: "Day-to-day perception is generally positive.", context: "District-level variation shapes experience." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 60,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Addis Ababa offers growing fiber and mobile networks supporting digital services in covered areas.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Moderate", description: "Median fiber performance is growing in covered areas.", context: "Coverage is expanding." },
          { label: "Mobile network", value: "Solid", description: "4G coverage is comprehensive in the central metro.", context: "Useful for daily work and mobility." },
          { label: "Coverage", value: "Expanding", description: "Fiber footprint is expanding across the metro.", context: "Service availability is growing." },
        ],
      },
      "climate-risk": {
        score: 70,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Addis Ababa carries moderate climate risk centered on heavy-rain stormwater pressure and water-supply variability.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Heavy rain", description: "Stormwater and surface flooding are the main short-term hazards.", context: "Active adaptation work targets this risk." },
          { label: "Heat exposure", value: "Low", description: "Highland elevation moderates sustained heat stress.", context: "Heat is a smaller driver than for lower-altitude peers." },
          { label: "Adaptation capacity", value: "Growing", description: "Adaptation work is active.", context: "Stormwater and water-supply programs are central." },
        ],
      },
    },
  },
  {
    slug: "rio-de-janeiro",
    name: "Rio de Janeiro",
    countrySlug: "brazil",
    countryName: "Brazil",
    region: "Latin America",
    population: "13M metro",
    intro:
      "Rio de Janeiro combines globally cited cultural and creative depth with a striking coastal setting and hydropower-led low-carbon electricity.",
    outlook:
      "Read Rio as a vibrant coastal capital where cultural amenity and renewable electricity balance climate exposure and district-level safety variation.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban", "iea-cities"],
    scores: { overall: 70, affordability: 76, airQuality: 68, energy: 80, resilience: 64 },
    metrics: [
      { label: "Overall city intelligence", value: "70", unit: "/100", score: 70, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Cultural depth", value: "Globally cited", description: "Music, sport, and creative ecosystems shape urban identity." },
      { label: "Energy mix", value: "Renewable-heavy", description: "Hydropower supports a comparatively low-carbon baseline." },
    ],
    relatedCitySlugs: ["sao-paulo", "buenos-aires", "lima"],
    modules: {
      "cost-of-living": {
        score: 76,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Rio is moderately affordable, with district-level variation between premium beachfront areas and accessible inland neighborhoods.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "76", unit: "/100", description: "Solid directional affordability score for the region.", context: "District-level variation shapes experience." },
          { label: "Housing pressure", value: "Mixed", description: "Premium beachfront contrasts with broader accessibility.", context: "District-level variation shapes experience." },
          { label: "Transport cost offset", value: "Strong", description: "Metro, BRT, and bus networks reduce vehicle dependence.", context: "Multi-modal commuting is widely used." },
        ],
      },
      "air-quality": {
        score: 68,
        sources: ["who-air"],
        summary:
          "Rio performs moderately on air-quality benchmarks, with traffic-related pollutants the main focus.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "68", unit: "/100", description: "Moderate directional performance against pollutant benchmarks.", context: "Coastal context shapes dispersion." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO₂", description: "Traffic-related pollutants remain key health benchmarks.", context: "Seasonal patterns shape exposure." },
          { label: "Monitoring confidence", value: "Growing", description: "Public monitoring supports transparent comparison.", context: "Coverage is improving." },
        ],
      },
      energy: {
        score: 80,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Rio benefits from Brazil's hydropower-led low-carbon grid and active wind and solar build-out.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "80", unit: "/100", description: "Solid directional transition score.", context: "Hydropower supports the baseline." },
          { label: "Grid adaptation", value: "Strong", description: "Renewable build-out supports planning continuity.", context: "Diverse resources shape grid plans." },
          { label: "Renewable opportunity", value: "Hydro-led", description: "Hydropower carries the system; wind and solar are growing.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 64,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Rio scores moderately on safety with significant district-level variation and active institutional response.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "64", unit: "/100", description: "Moderate directional score.", context: "District-level variation shapes experience." },
          { label: "Resident perception", value: "Mixed", description: "Perception varies sharply across districts.", context: "Local district context matters strongly." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 76,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Rio offers reliable fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Solid", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Solid", description: "4G coverage is comprehensive; 5G is expanding.", context: "Useful for daily work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 64,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Rio carries moderate climate risk centered on heavy rainfall, landslides, and coastal storm exposure.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Rain and landslide", description: "Intense rainfall and hillside landslide risk are the main pressures.", context: "Active adaptation work targets these risks." },
          { label: "Heat exposure", value: "Rising", description: "Sustained heat is rising as a structural concern.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Growing", description: "Adaptation work is active.", context: "Drainage and hillside programs are central." },
        ],
      },
    },
  },
  {
    slug: "montevideo",
    name: "Montevideo",
    countrySlug: "uruguay",
    countryName: "Uruguay",
    region: "Latin America",
    population: "1.9M metro",
    intro:
      "Montevideo anchors Uruguay's compact, coastal capital with strong public services, leading renewable electricity share, and steady institutional signals.",
    outlook:
      "Read Montevideo as a stable, services-led coastal capital where service depth and renewable electricity balance moderate costs.",
    sources: ["un-habitat", "nasa-power", "ipcc-urban", "iea-cities"],
    scores: { overall: 80, affordability: 72, airQuality: 80, energy: 86, resilience: 78 },
    metrics: [
      { label: "Overall city intelligence", value: "80", unit: "/100", score: 80, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Energy mix", value: "Renewable-heavy", description: "Wind, hydro, and solar provide most electricity nationally." },
      { label: "Service depth", value: "High", description: "Public services support a stable urban operating environment." },
    ],
    relatedCitySlugs: ["buenos-aires", "santiago", "lisbon"],
    modules: {
      "cost-of-living": {
        score: 72,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Montevideo is moderately priced for the region, with rent and services balanced by service depth.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "72", unit: "/100", description: "Solid directional score for a regional capital.", context: "Services depth supports practical affordability." },
          { label: "Housing pressure", value: "Moderate", description: "Central rental demand is steady; supply is more flexible.", context: "Outer districts are widely accessible." },
          { label: "Transport cost offset", value: "Moderate", description: "Bus networks support mobility; private vehicles common.", context: "Multi-modal options are growing." },
        ],
      },
      "air-quality": {
        score: 80,
        sources: ["who-air"],
        summary:
          "Montevideo performs solidly on air-quality benchmarks, with coastal context supporting dispersion.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "80", unit: "/100", description: "Solid directional performance against pollutant benchmarks.", context: "Coastal context supports results." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particulates remain the central health benchmark.", context: "Seasonal patterns shape exposure." },
          { label: "Monitoring confidence", value: "Growing", description: "Public monitoring supports transparent comparison.", context: "Coverage is improving." },
        ],
      },
      energy: {
        score: 86,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Montevideo benefits from Uruguay's leading renewable-electricity share with wind and hydropower providing most generation.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "86", unit: "/100", description: "Strong directional transition score.", context: "Renewable-heavy mix supports the trajectory." },
          { label: "Grid adaptation", value: "Strong", description: "Renewable integration supports planning continuity.", context: "Wind is a major resource." },
          { label: "Renewable opportunity", value: "Wind-led", description: "Wind carries the system; hydro and solar are supporting.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 82,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Montevideo scores well on safety, with stable institutional response and steady public-safety perception.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "82", unit: "/100", description: "Healthy directional score.", context: "Stable institutional response supports the score." },
          { label: "Resident perception", value: "Strong", description: "Day-to-day perception is generally positive.", context: "District-level variation shapes experience." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 80,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Montevideo offers reliable fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Solid", description: "4G coverage is comprehensive; 5G is expanding.", context: "Useful for daily work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 78,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Montevideo carries moderate climate risk centered on coastal storm exposure and rising heat.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Coastal storms", description: "Storm exposure shapes long-run coastal risk.", context: "Active adaptation work targets this risk." },
          { label: "Heat exposure", value: "Rising", description: "Sustained heat is rising as a structural concern.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Strong", description: "Adaptation work is active.", context: "Public-realm investments support resilience." },
        ],
      },
    },
  },
  {
    slug: "quito",
    name: "Quito",
    countrySlug: "ecuador",
    countryName: "Ecuador",
    region: "Latin America",
    population: "2.0M metro",
    intro:
      "Quito anchors Ecuador's Andean capital with deep cultural heritage, hydropower-led electricity, and high-altitude climate amenity.",
    outlook:
      "Read Quito as a heritage-rich, high-altitude capital where service depth and renewable electricity balance seismic and infrastructure pressures.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban"],
    scores: { overall: 70, affordability: 80, airQuality: 70, energy: 76, resilience: 64 },
    metrics: [
      { label: "Overall city intelligence", value: "70", unit: "/100", score: 70, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Cultural heritage", value: "Globally cited", description: "Heritage and culinary traditions shape urban identity." },
      { label: "Energy mix", value: "Hydropower-led", description: "Hydropower supports a comparatively low-carbon baseline." },
    ],
    relatedCitySlugs: ["bogota", "lima", "panama-city"],
    modules: {
      "cost-of-living": {
        score: 80,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Quito is comparatively affordable for housing and services across most districts.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "80", unit: "/100", description: "Strong directional affordability score for the region.", context: "Housing and services are accessible." },
          { label: "Housing pressure", value: "Moderate", description: "Central rental demand is steady.", context: "Outer districts are widely accessible." },
          { label: "Transport cost offset", value: "Moderate", description: "BRT and bus networks support mobility.", context: "Multi-modal options are growing." },
        ],
      },
      "air-quality": {
        score: 70,
        sources: ["who-air"],
        summary:
          "Quito performs moderately on air-quality benchmarks, with traffic-related pollutants and altitude shaping exposure.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "70", unit: "/100", description: "Moderate directional performance against pollutant benchmarks.", context: "Altitude and traffic shape exposure." },
          { label: "Primary pollutant watch", value: "PM2.5", description: "Fine particulates remain the central health benchmark.", context: "Seasonal patterns shape exposure." },
          { label: "Monitoring confidence", value: "Growing", description: "Public monitoring supports transparent comparison.", context: "Coverage is improving." },
        ],
      },
      energy: {
        score: 76,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Quito benefits from Ecuador's hydropower-led low-carbon electricity baseline and active grid expansion.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "76", unit: "/100", description: "Solid directional transition score.", context: "Hydropower supports the baseline." },
          { label: "Grid adaptation", value: "Growing", description: "Renewable build-out supports planning continuity.", context: "Hydropower is the central resource." },
          { label: "Renewable opportunity", value: "Hydro-led", description: "Hydropower carries the system.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 74,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Quito scores moderately on safety with district-level variation and active institutional response.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "74", unit: "/100", description: "Solid directional score.", context: "District-level variation shapes experience." },
          { label: "Resident perception", value: "Mixed", description: "Perception varies between central and outer districts.", context: "Local district context matters." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 70,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Quito offers reliable fiber and mobile networks supporting digital services in covered areas.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Solid", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Solid", description: "4G coverage is comprehensive in the central metro.", context: "Useful for daily work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most central areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 66,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Quito carries moderate climate risk centered on seismic exposure and hillside stormwater pressure.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Seismic and rain", description: "Seismic exposure and intense rainfall are the main pressures.", context: "Active adaptation work targets these risks." },
          { label: "Heat exposure", value: "Low", description: "High-altitude climate moderates heat stress.", context: "Heat is a smaller driver than for lowland peers." },
          { label: "Adaptation capacity", value: "Growing", description: "Adaptation work is active.", context: "Building codes and drainage programs are central." },
        ],
      },
    },
  },
  {
    slug: "panama-city",
    name: "Panama City",
    countrySlug: "panama",
    countryName: "Panama",
    region: "Latin America",
    population: "1.5M metro",
    intro:
      "Panama City anchors a globally significant logistics and finance hub at the Canal with growing services activity and active coastal climate-adaptation work.",
    outlook:
      "Read Panama City as a logistics-led services hub where regional connectivity and dollarized stability balance climate exposure and housing pressure.",
    sources: ["un-habitat", "nasa-power", "who-air", "ipcc-urban"],
    scores: { overall: 72, affordability: 72, airQuality: 74, energy: 74, resilience: 68 },
    metrics: [
      { label: "Overall city intelligence", value: "72", unit: "/100", score: 72, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Logistics depth", value: "Globally cited", description: "Canal and trade infrastructure shape regional and global flows." },
      { label: "Climate exposure", value: "Coastal", description: "Coastal flooding and storm exposure shape adaptation priorities." },
    ],
    relatedCitySlugs: ["bogota", "lima", "santiago"],
    modules: {
      "cost-of-living": {
        score: 72,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Panama City is moderately priced for the region, with central premium districts the main pressure on housing.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "72", unit: "/100", description: "Solid directional affordability score for the region.", context: "District-level variation shapes experience." },
          { label: "Housing pressure", value: "Mixed", description: "Central premium districts contrast with broader accessibility.", context: "District-level variation shapes experience." },
          { label: "Transport cost offset", value: "Strong", description: "Metro and bus networks reduce vehicle dependence.", context: "Multi-modal commuting is widely used." },
        ],
      },
      "air-quality": {
        score: 74,
        sources: ["who-air"],
        summary:
          "Panama City performs moderately on air-quality benchmarks, with coastal context supporting dispersion.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "74", unit: "/100", description: "Moderate directional performance against pollutant benchmarks.", context: "Coastal context shapes dispersion." },
          { label: "Primary pollutant watch", value: "PM2.5 and NO₂", description: "Traffic-related pollutants remain key health benchmarks.", context: "Seasonal patterns shape exposure." },
          { label: "Monitoring confidence", value: "Growing", description: "Public monitoring supports transparent comparison.", context: "Coverage is improving." },
        ],
      },
      energy: {
        score: 74,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Panama City benefits from Panama's hydropower-led electricity baseline and active solar build-out.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "74", unit: "/100", description: "Solid directional transition score.", context: "Hydropower supports the baseline." },
          { label: "Grid adaptation", value: "Growing", description: "Renewable build-out supports planning continuity.", context: "Diverse resources shape grid plans." },
          { label: "Renewable opportunity", value: "Hydro and solar", description: "Diverse resources support the transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 76,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Panama City scores moderately on safety with stable institutional response and district-level variation.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "76", unit: "/100", description: "Solid directional score.", context: "Institutional response supports the score." },
          { label: "Resident perception", value: "Generally positive", description: "Day-to-day perception is generally positive in central districts.", context: "District-level variation shapes experience." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 76,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Panama City offers reliable fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Solid", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Solid", description: "4G coverage is comprehensive; 5G is expanding.", context: "Useful for daily work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 68,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Panama City carries moderate climate risk centered on coastal flooding, heavy rainfall, and rising heat.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Coastal and rain", description: "Coastal flooding and intense rainfall are the main pressures.", context: "Active adaptation work targets these risks." },
          { label: "Heat exposure", value: "Rising", description: "Sustained heat and humidity are rising as structural concerns.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Growing", description: "Adaptation work is active.", context: "Coastal and drainage programs are central." },
        ],
      },
    },
  },
  {
    slug: "perth",
    name: "Perth",
    countrySlug: "australia",
    countryName: "Australia",
    region: "Oceania",
    population: "2.2M metro",
    intro:
      "Perth anchors Western Australia with a compact coastal urban core, deep mining-services economy, and exceptional solar resource.",
    outlook:
      "Read Perth as an isolated but high-amenity coastal capital where service quality and outdoor amenity balance housing pressure and drought-resilience priorities.",
    sources: ["un-habitat", "nasa-power", "ipcc-urban", "iea-cities"],
    scores: { overall: 82, affordability: 64, airQuality: 86, energy: 78, resilience: 76 },
    metrics: [
      { label: "Overall city intelligence", value: "82", unit: "/100", score: 82, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Solar resource", value: "Exceptional", description: "Among the strongest solar irradiance levels globally." },
      { label: "Outdoor amenity", value: "Very high", description: "Coastal and natural amenity supports a strong quality of daily life." },
    ],
    relatedCitySlugs: ["sydney", "melbourne", "brisbane"],
    modules: {
      "cost-of-living": {
        score: 64,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Perth is expensive for housing, with services costs in line with major Australian peers.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "64", unit: "/100", description: "Moderate directional score; housing leads pressure.", context: "Income levels partially offset prices." },
          { label: "Housing pressure", value: "High", description: "Central rental demand is steady.", context: "Outer suburbs are more accessible." },
          { label: "Transport cost offset", value: "Moderate", description: "Rail and bus networks support mobility; vehicles common.", context: "Multi-modal commuting varies by corridor." },
        ],
      },
      "air-quality": {
        score: 86,
        sources: ["who-air"],
        summary:
          "Perth performs well against health-oriented air-quality benchmarks, with bushfire smoke the seasonal concern.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "86", unit: "/100", description: "Healthy directional performance against pollutant benchmarks.", context: "Coastal context supports results." },
          { label: "Primary pollutant watch", value: "Smoke events", description: "Bushfire smoke is the seasonal health benchmark.", context: "Seasonal patterns shape peak exposure." },
          { label: "Monitoring confidence", value: "High", description: "Public monitoring supports transparent comparison.", context: "Australian monitoring is well-instrumented." },
        ],
      },
      energy: {
        score: 78,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Perth benefits from exceptional solar resource and active grid modernization with high household solar adoption.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "78", unit: "/100", description: "Solid directional transition score.", context: "Solar adoption is a strength." },
          { label: "Grid adaptation", value: "Strong", description: "Renewable build-out supports planning continuity.", context: "Storage and grid integration shape plans." },
          { label: "Renewable opportunity", value: "Exceptional solar", description: "Strong solar resource carries the transition.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 88,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Perth scores well on safety, with stable institutional response and steady public-safety perception.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "88", unit: "/100", description: "Healthy directional score.", context: "Stable institutional response supports the score." },
          { label: "Resident perception", value: "Strong", description: "Day-to-day perception is widely positive.", context: "Pedestrian perception is widely positive." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 80,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Perth offers reliable fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across the metro.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most suburbs.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 70,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Perth carries elevated climate risk centered on drought, bushfire, and rising heat.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Drought and fire", description: "Long-run drought and bushfire exposure are the main pressures.", context: "Active adaptation work targets these risks." },
          { label: "Heat exposure", value: "Rising", description: "Sustained summer heat is a structural concern.", context: "Cooling demand grows with extremes." },
          { label: "Adaptation capacity", value: "Strong", description: "Water and fire-management programs support resilience.", context: "Public-realm investments are key levers." },
        ],
      },
    },
  },
  {
    slug: "wellington",
    name: "Wellington",
    countrySlug: "new-zealand",
    countryName: "New Zealand",
    region: "Oceania",
    population: "0.4M metro",
    intro:
      "Wellington anchors New Zealand's political and creative life on a compact harbour with strong public services, low-carbon electricity, and active seismic-adaptation work.",
    outlook:
      "Read Wellington as a compact, services-led capital where service quality and renewable electricity balance seismic and housing pressures.",
    sources: ["un-habitat", "nasa-power", "ipcc-urban", "iea-cities"],
    scores: { overall: 84, affordability: 64, airQuality: 88, energy: 88, resilience: 76 },
    metrics: [
      { label: "Overall city intelligence", value: "84", unit: "/100", score: 84, description: "Composite directional score across affordability, air quality, clean energy, and resilience." },
      { label: "Energy mix", value: "Low-carbon", description: "Hydropower and geothermal generation support a favorable baseline." },
      { label: "Services depth", value: "High", description: "Public services and creative industries shape opportunity." },
    ],
    relatedCitySlugs: ["auckland", "melbourne", "sydney"],
    modules: {
      "cost-of-living": {
        score: 64,
        sources: ["un-habitat", "ipcc-urban", "numbeo-cost"],
        summary:
          "Wellington is expensive for housing, with services costs in line with New Zealand peers.",
        explanation:
          "Affordability scoring weighs essential spending, mobility, and services.",
        facts: [
          { label: "Affordability score", value: "64", unit: "/100", description: "Moderate directional score; housing leads pressure.", context: "Income levels partially offset prices." },
          { label: "Housing pressure", value: "High", description: "Central rental demand is steady; supply is constrained by geography.", context: "Outer suburbs are more accessible." },
          { label: "Transport cost offset", value: "Strong", description: "Bus, rail, and walking networks reduce vehicle dependence.", context: "Multi-modal commuting is feasible in the central area." },
        ],
      },
      "air-quality": {
        score: 88,
        sources: ["who-air"],
        summary:
          "Wellington performs well on air-quality benchmarks, with coastal winds supporting dispersion.",
        explanation:
          "Scoring prioritizes health against WHO guidance.",
        facts: [
          { label: "Clean-air score", value: "88", unit: "/100", description: "Healthy directional performance against pollutant benchmarks.", context: "Coastal winds support results." },
          { label: "Primary pollutant watch", value: "Winter PM2.5", description: "Wintertime particulates remain a seasonal benchmark.", context: "Wood-burning shapes seasonal exposure." },
          { label: "Monitoring confidence", value: "High", description: "Public monitoring supports transparent comparison.", context: "New Zealand monitoring is well-instrumented." },
        ],
      },
      energy: {
        score: 88,
        sources: ["nasa-power", "ipcc-urban", "iea-cities"],
        summary:
          "Wellington benefits from New Zealand's low-carbon electricity baseline with hydropower and geothermal providing most generation.",
        explanation:
          "Energy scoring weighs resource context, infrastructure maturity, and adaptation capacity.",
        facts: [
          { label: "Energy readiness", value: "88", unit: "/100", description: "Strong directional transition score.", context: "Low-carbon mix supports the trajectory." },
          { label: "Grid adaptation", value: "Strong", description: "Renewable integration supports planning continuity.", context: "Hydropower is the central resource." },
          { label: "Renewable opportunity", value: "Hydro and geothermal", description: "Diverse low-carbon resources carry the system.", context: "Resource mix shapes the local transition path." },
        ],
      },
      safety: {
        score: 90,
        sources: ["unodc-crime", "un-habitat"],
        summary:
          "Wellington scores high on safety, with stable institutional response and steady public-safety perception.",
        explanation:
          "Safety blends violent-crime context, perception, and response capacity.",
        facts: [
          { label: "Safety score", value: "90", unit: "/100", description: "Healthy directional score.", context: "Stable institutional response supports the score." },
          { label: "Resident perception", value: "Very high", description: "Day-to-day perception is widely positive.", context: "Pedestrian perception is widely positive." },
          { label: "Watch item", value: "Property crime", description: "Opportunistic property risks remain the practical pain point.", context: "Common-sense precautions still useful." },
        ],
      },
      "internet-speed": {
        score: 84,
        sources: ["itu-connectivity", "ookla-speedtest"],
        summary:
          "Wellington offers reliable fiber and mobile networks supporting digital services and remote work.",
        explanation:
          "Scoring weighs fixed broadband, mobile network performance, and digital-readiness context.",
        facts: [
          { label: "Fixed broadband", value: "Fast", description: "Median fiber performance supports remote workflows.", context: "Strong for streaming and calls." },
          { label: "Mobile network", value: "Fast", description: "5G coverage extends across the city.", context: "Useful for hybrid work and mobility." },
          { label: "Coverage", value: "Broad", description: "Fiber footprint reaches most residential areas.", context: "Service availability is broad." },
        ],
      },
      "climate-risk": {
        score: 70,
        sources: ["ipcc-urban", "nasa-power", "un-habitat"],
        summary:
          "Wellington carries elevated climate risk centered on seismic exposure, coastal storms, and stormwater pressure.",
        explanation:
          "Climate-risk scoring combines hazard exposure with adaptation capacity.",
        facts: [
          { label: "Primary hazard", value: "Seismic and storm", description: "Seismic exposure and coastal storms are the main pressures.", context: "Active building-code and adaptation work target these risks." },
          { label: "Heat exposure", value: "Low", description: "Maritime climate limits sustained heat stress.", context: "Heat is a smaller driver than for northern peers." },
          { label: "Adaptation capacity", value: "Strong", description: "Engineering capacity supports resilience.", context: "Public-realm investments are key levers." },
        ],
      },
    },
  },
  // --- Expansion batch: 40 new cities across Europe, North America, Latin
  // America, Asia, Middle East, Africa, and Oceania. Each entry uses
  // `buildNeutralCitySeed` with a hand-written intro/outlook + a
  // directional score profile. Module data is generated by the helper
  // and presented as a directional indicator pending verified records.
  buildNeutralCitySeed({
    slug: "athens",
    name: "Athens",
    countrySlug: "greece",
    countryName: "Greece",
    region: "Southern Europe",
    population: "~3.1M metro",
    intro:
      "Athens is a Mediterranean capital with deep cultural depth, a growing remote-work scene, and city-intelligence categories that benefit from heat-and-water adaptation context.",
    outlook:
      "Use the Athens profile to compare cost framing, transport access, healthcare and emergency context, and climate-adaptation priorities alongside Mediterranean peers.",
    scores: { overall: 70, affordability: 72, airQuality: 65, energy: 70, resilience: 65 },
    relatedCitySlugs: ["rome", "lisbon", "barcelona"],
  }),
  buildNeutralCitySeed({
    slug: "budapest",
    name: "Budapest",
    countrySlug: "hungary",
    countryName: "Hungary",
    region: "Central Europe",
    population: "~3.0M metro",
    intro:
      "Budapest is a Central-European capital often considered for cost-friendly relocation, with structured city-intelligence across transport, healthcare framing, and public services.",
    outlook:
      "Use the Budapest profile to compare affordability framing, transport access, and country-level context alongside other Central-European capitals.",
    scores: { overall: 73, affordability: 78, airQuality: 70, energy: 70, resilience: 70 },
    relatedCitySlugs: ["prague", "warsaw", "vienna"],
  }),
  buildNeutralCitySeed({
    slug: "bucharest",
    name: "Bucharest",
    countrySlug: "romania",
    countryName: "Romania",
    region: "Eastern Europe",
    population: "~2.3M metro",
    intro:
      "Bucharest is a fast-growing Eastern-European capital known for digital services and competitive cost framing for remote-work comparison.",
    outlook:
      "Compare Bucharest's directional indicators across cost, connectivity, transport, and country-level context alongside other EU capitals.",
    scores: { overall: 70, affordability: 80, airQuality: 65, energy: 68, resilience: 65 },
    relatedCitySlugs: ["warsaw", "prague", "budapest"],
  }),
  buildNeutralCitySeed({
    slug: "belgrade",
    name: "Belgrade",
    countrySlug: "serbia",
    countryName: "Serbia",
    region: "Southeastern Europe",
    population: "~1.7M metro",
    intro:
      "Belgrade is a regional Western-Balkans hub with growing services activity and a profile useful for relocation and regional comparison.",
    outlook:
      "Use the Belgrade profile to review directional cost framing, transport access, and country-level context against neighbouring capitals.",
    scores: { overall: 68, affordability: 80, airQuality: 60, energy: 60, resilience: 62 },
    relatedCitySlugs: ["zagreb", "bucharest", "budapest"],
  }),
  buildNeutralCitySeed({
    slug: "zagreb",
    name: "Zagreb",
    countrySlug: "croatia",
    countryName: "Croatia",
    region: "Southeastern Europe",
    population: "~1.1M metro",
    intro:
      "Zagreb is Croatia's Adriatic-adjacent capital, useful for comparing relocation and remote-work contexts within the EU regulatory frame.",
    outlook:
      "Compare Zagreb directional indicators alongside other EU regional capitals using cost, connectivity, transport, and country-level signals.",
    scores: { overall: 72, affordability: 76, airQuality: 70, energy: 68, resilience: 68 },
    relatedCitySlugs: ["ljubljana", "belgrade", "vienna"],
  }),
  buildNeutralCitySeed({
    slug: "ljubljana",
    name: "Ljubljana",
    countrySlug: "slovenia",
    countryName: "Slovenia",
    region: "Central Europe",
    population: "~0.5M metro",
    intro:
      "Ljubljana is a compact Alpine-adjacent EU capital often included in relocation and remote-work comparisons for its mid-size, walkable profile.",
    outlook:
      "Use the Ljubljana profile to compare compact Central-European city contexts alongside Vienna, Zagreb, and Bratislava.",
    scores: { overall: 76, affordability: 72, airQuality: 75, energy: 72, resilience: 75 },
    relatedCitySlugs: ["vienna", "zagreb", "bratislava"],
  }),
  buildNeutralCitySeed({
    slug: "bratislava",
    name: "Bratislava",
    countrySlug: "slovakia",
    countryName: "Slovakia",
    region: "Central Europe",
    population: "~0.7M metro",
    intro:
      "Bratislava is a Visegrád-region EU capital with a compact urban core and close connections to Vienna, useful for cross-border relocation comparison.",
    outlook:
      "Compare Bratislava's directional indicators alongside Vienna, Budapest, and Prague for Central-European relocation review.",
    scores: { overall: 73, affordability: 74, airQuality: 70, energy: 70, resilience: 70 },
    relatedCitySlugs: ["vienna", "budapest", "prague"],
  }),
  buildNeutralCitySeed({
    slug: "tallinn",
    name: "Tallinn",
    countrySlug: "estonia",
    countryName: "Estonia",
    region: "Baltic Europe",
    population: "~0.6M metro",
    intro:
      "Tallinn is a compact Baltic EU capital widely cited for digital-government infrastructure and remote-work relocation comparison.",
    outlook:
      "Use the Tallinn profile to compare digital-readiness framing, cost context, and country-level intelligence alongside other Baltic peers.",
    scores: { overall: 78, affordability: 72, airQuality: 80, energy: 75, resilience: 76 },
    relatedCitySlugs: ["riga", "vilnius", "helsinki"],
  }),
  buildNeutralCitySeed({
    slug: "riga",
    name: "Riga",
    countrySlug: "latvia",
    countryName: "Latvia",
    region: "Baltic Europe",
    population: "~0.9M metro",
    intro:
      "Riga is Latvia's Baltic capital with a compact services economy and EU regulatory anchoring, useful for regional and relocation comparisons.",
    outlook:
      "Compare Riga's directional indicators across cost framing, transport access, and country-level context alongside other Baltic and Nordic capitals.",
    scores: { overall: 74, affordability: 74, airQuality: 76, energy: 72, resilience: 72 },
    relatedCitySlugs: ["tallinn", "vilnius", "stockholm"],
  }),
  buildNeutralCitySeed({
    slug: "vilnius",
    name: "Vilnius",
    countrySlug: "lithuania",
    countryName: "Lithuania",
    region: "Baltic Europe",
    population: "~0.8M metro",
    intro:
      "Vilnius is Lithuania's compact Baltic EU capital with growing financial-services activity, useful for relocation and remote-work comparison.",
    outlook:
      "Use the Vilnius profile to compare cost framing, connectivity, and country-level context alongside other Baltic capitals.",
    scores: { overall: 74, affordability: 76, airQuality: 76, energy: 72, resilience: 72 },
    relatedCitySlugs: ["tallinn", "riga", "warsaw"],
  }),
  buildNeutralCitySeed({
    slug: "boston",
    name: "Boston",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~4.9M metro",
    intro:
      "Boston is a dense North-American hub anchored by universities, life-sciences, and a strong public-transport core, useful for relocation and remote-work review.",
    outlook:
      "Use the Boston profile to compare cost framing, transport access, healthcare framing, and country-level context alongside other US metros.",
    scores: { overall: 80, affordability: 60, airQuality: 78, energy: 74, resilience: 75 },
    relatedCitySlugs: ["new-york", "washington-dc", "toronto"],
  }),
  buildNeutralCitySeed({
    slug: "washington-dc",
    name: "Washington DC",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~6.3M metro",
    intro:
      "Washington DC is the United States capital with strong institutional density and useful for comparing public-services and policy-context dimensions of city intelligence.",
    outlook:
      "Use the Washington DC profile to compare structured indicators across cost, transport, safety, and country-level context.",
    scores: { overall: 78, affordability: 60, airQuality: 76, energy: 72, resilience: 76 },
    relatedCitySlugs: ["new-york", "boston", "chicago"],
  }),
  buildNeutralCitySeed({
    slug: "miami",
    name: "Miami",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~6.1M metro",
    intro:
      "Miami is a coastal US metro with strong Latin-American connectivity and active coastal-climate adaptation, useful for relocation and regional comparison.",
    outlook:
      "Use the Miami profile to compare cost framing, transport access, and climate-resilience context alongside other coastal US metros.",
    scores: { overall: 72, affordability: 64, airQuality: 70, energy: 70, resilience: 60 },
    relatedCitySlugs: ["new-york", "mexico-city", "panama-city"],
  }),
  buildNeutralCitySeed({
    slug: "austin",
    name: "Austin",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.4M metro",
    intro:
      "Austin is a fast-growing Texan metro with a strong technology economy and active urban-growth dynamics, useful for relocation and remote-work comparison.",
    outlook:
      "Use the Austin profile to compare cost framing, connectivity, transport, and country-level context alongside other US tech-economy hubs.",
    scores: { overall: 74, affordability: 70, airQuality: 70, energy: 72, resilience: 68 },
    relatedCitySlugs: ["dallas", "san-francisco", "miami"],
  }),
  buildNeutralCitySeed({
    slug: "dallas",
    name: "Dallas",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~7.8M metro",
    intro:
      "Dallas is a large North-Texas metro with strong logistics, finance, and corporate-services depth, useful for cross-region US comparison.",
    outlook:
      "Use the Dallas profile to compare cost framing, transport access, and country-level context alongside other large US metros.",
    scores: { overall: 72, affordability: 72, airQuality: 68, energy: 70, resilience: 65 },
    relatedCitySlugs: ["austin", "chicago", "miami"],
  }),
  buildNeutralCitySeed({
    slug: "montreal",
    name: "Montreal",
    countrySlug: "canada",
    countryName: "Canada",
    region: "North America",
    population: "~4.3M metro",
    intro:
      "Montreal is a bilingual Canadian metro with strong cultural depth and university density, useful for relocation comparison and remote-work review.",
    outlook:
      "Use the Montreal profile to compare cost framing, transport access, healthcare framing, and country-level context alongside Toronto and Vancouver.",
    scores: { overall: 77, affordability: 72, airQuality: 76, energy: 76, resilience: 75 },
    relatedCitySlugs: ["toronto", "vancouver", "boston"],
  }),
  buildNeutralCitySeed({
    slug: "calgary",
    name: "Calgary",
    countrySlug: "canada",
    countryName: "Canada",
    region: "North America",
    population: "~1.6M metro",
    intro:
      "Calgary is a prairie-foothills Canadian metro anchored by energy and services, useful for cross-region Canadian comparison.",
    outlook:
      "Use the Calgary profile to compare cost framing, country-level healthcare and transport context, and relocation framing alongside Toronto and Vancouver.",
    scores: { overall: 74, affordability: 74, airQuality: 78, energy: 78, resilience: 72 },
    relatedCitySlugs: ["vancouver", "toronto", "seattle"],
  }),
  buildNeutralCitySeed({
    slug: "medellin",
    name: "Medellín",
    countrySlug: "colombia",
    countryName: "Colombia",
    region: "Latin America",
    population: "~4.0M metro",
    intro:
      "Medellín is a Colombian metro widely referenced for active urban renewal and metro infrastructure, useful for Latin-American relocation comparison.",
    outlook:
      "Use the Medellín profile to compare cost framing, transport access, and country-level context alongside Bogotá and other Andean metros.",
    scores: { overall: 70, affordability: 78, airQuality: 60, energy: 65, resilience: 65 },
    relatedCitySlugs: ["bogota", "lima", "quito"],
  }),
  buildNeutralCitySeed({
    slug: "san-jose",
    name: "San José",
    countrySlug: "costa-rica",
    countryName: "Costa Rica",
    region: "Central America",
    population: "~2.2M metro",
    intro:
      "San José is Costa Rica's compact capital known for conservation policy and a renewable-electricity profile, useful for Central-American comparison.",
    outlook:
      "Use the San José profile to compare cost framing, transport access, and country-level context alongside Panama City and other Central-American metros.",
    scores: { overall: 72, affordability: 70, airQuality: 70, energy: 80, resilience: 70 },
    relatedCitySlugs: ["panama-city", "santo-domingo", "guatemala-city"],
  }),
  buildNeutralCitySeed({
    slug: "santo-domingo",
    name: "Santo Domingo",
    countrySlug: "dominican-republic",
    countryName: "Dominican Republic",
    region: "Caribbean",
    population: "~3.5M metro",
    intro:
      "Santo Domingo is the Dominican Republic's capital and a major Caribbean services centre, useful for regional and relocation comparison.",
    outlook:
      "Use the Santo Domingo profile to compare cost framing, country-level transport and healthcare context, and Caribbean climate resilience.",
    scores: { overall: 65, affordability: 72, airQuality: 60, energy: 60, resilience: 58 },
    relatedCitySlugs: ["panama-city", "san-jose", "mexico-city"],
  }),
  buildNeutralCitySeed({
    slug: "guatemala-city",
    name: "Guatemala City",
    countrySlug: "guatemala",
    countryName: "Guatemala",
    region: "Central America",
    population: "~3.0M metro",
    intro:
      "Guatemala City is Central America's largest metro and a regional services centre, useful for cross-country regional comparison.",
    outlook:
      "Use the Guatemala City profile to compare cost framing, country-level transport and healthcare context, and seismic-climate resilience.",
    scores: { overall: 60, affordability: 70, airQuality: 55, energy: 55, resilience: 55 },
    relatedCitySlugs: ["san-jose", "santo-domingo", "mexico-city"],
  }),
  buildNeutralCitySeed({
    slug: "guangzhou",
    name: "Guangzhou",
    countrySlug: "china",
    countryName: "China",
    region: "East Asia",
    population: "~18.7M metro",
    intro:
      "Guangzhou is a major southern-Chinese megacity and a long-standing trade hub, useful for cross-region Chinese comparison and supply-chain context.",
    outlook:
      "Use the Guangzhou profile to compare cost framing, transport access, and country-level context alongside Shanghai, Beijing, and Shenzhen.",
    scores: { overall: 70, affordability: 68, airQuality: 60, energy: 68, resilience: 62 },
    relatedCitySlugs: ["shenzhen", "shanghai", "hong-kong"],
  }),
  buildNeutralCitySeed({
    slug: "chengdu",
    name: "Chengdu",
    countrySlug: "china",
    countryName: "China",
    region: "East Asia",
    population: "~21.4M metro",
    intro:
      "Chengdu is a fast-growing inland Chinese megacity with a strong cultural and technology profile, useful for inland-China comparison and relocation review.",
    outlook:
      "Use the Chengdu profile to compare cost framing, transport access, and country-level context alongside coastal and other inland Chinese metros.",
    scores: { overall: 68, affordability: 72, airQuality: 58, energy: 64, resilience: 60 },
    relatedCitySlugs: ["shanghai", "beijing", "wuhan"],
  }),
  buildNeutralCitySeed({
    slug: "wuhan",
    name: "Wuhan",
    countrySlug: "china",
    countryName: "China",
    region: "East Asia",
    population: "~13.4M metro",
    intro:
      "Wuhan is a major central-Chinese megacity at the confluence of the Yangtze and Han rivers, useful for inland-China comparison and logistics framing.",
    outlook:
      "Use the Wuhan profile to compare cost framing, transport access, and country-level context alongside Shanghai, Beijing, and Chengdu.",
    scores: { overall: 66, affordability: 72, airQuality: 56, energy: 62, resilience: 58 },
    relatedCitySlugs: ["shanghai", "chengdu", "beijing"],
  }),
  buildNeutralCitySeed({
    slug: "busan",
    name: "Busan",
    countrySlug: "south-korea",
    countryName: "South Korea",
    region: "East Asia",
    population: "~3.4M metro",
    intro:
      "Busan is South Korea's second city and a major Pacific port, useful for cross-region Korean comparison and maritime-logistics framing.",
    outlook:
      "Use the Busan profile to compare cost framing, transport access, and country-level context alongside Seoul and other East-Asian metros.",
    scores: { overall: 74, affordability: 72, airQuality: 68, energy: 70, resilience: 70 },
    relatedCitySlugs: ["seoul", "fukuoka", "tokyo"],
  }),
  buildNeutralCitySeed({
    slug: "fukuoka",
    name: "Fukuoka",
    countrySlug: "japan",
    countryName: "Japan",
    region: "East Asia",
    population: "~2.6M metro",
    intro:
      "Fukuoka is a Kyushu-region Japanese metro known for accessibility, food culture, and growing remote-work activity, useful for cross-region Japanese comparison.",
    outlook:
      "Use the Fukuoka profile to compare cost framing, transport access, and country-level context alongside Tokyo and Osaka.",
    scores: { overall: 78, affordability: 74, airQuality: 76, energy: 72, resilience: 74 },
    relatedCitySlugs: ["osaka", "tokyo", "kyoto"],
  }),
  buildNeutralCitySeed({
    slug: "chiang-mai",
    name: "Chiang Mai",
    countrySlug: "thailand",
    countryName: "Thailand",
    region: "Southeast Asia",
    population: "~1.2M metro",
    intro:
      "Chiang Mai is a northern-Thai metro frequently included in remote-work and relocation comparisons for its compact form and cost framing.",
    outlook:
      "Use the Chiang Mai profile to compare cost framing, country-level transport and healthcare context, and seasonal air-quality dynamics.",
    scores: { overall: 70, affordability: 80, airQuality: 50, energy: 60, resilience: 62 },
    relatedCitySlugs: ["bangkok", "kuala-lumpur", "ho-chi-minh-city"],
  }),
  buildNeutralCitySeed({
    slug: "phnom-penh",
    name: "Phnom Penh",
    countrySlug: "cambodia",
    countryName: "Cambodia",
    region: "Southeast Asia",
    population: "~2.3M metro",
    intro:
      "Phnom Penh is Cambodia's capital at the Mekong-Tonlé Sap confluence, with growing services activity and Southeast-Asian regional connectivity.",
    outlook:
      "Use the Phnom Penh profile to compare cost framing, country-level transport and healthcare context, and monsoon-climate resilience.",
    scores: { overall: 62, affordability: 78, airQuality: 55, energy: 55, resilience: 55 },
    relatedCitySlugs: ["bangkok", "ho-chi-minh-city", "hanoi"],
  }),
  buildNeutralCitySeed({
    slug: "colombo",
    name: "Colombo",
    countrySlug: "sri-lanka",
    countryName: "Sri Lanka",
    region: "South Asia",
    population: "~5.6M metro",
    intro:
      "Colombo is Sri Lanka's commercial capital and a major Indian-Ocean trade node, useful for South-Asian regional comparison.",
    outlook:
      "Use the Colombo profile to compare cost framing, country-level transport and healthcare context, and coastal-climate resilience.",
    scores: { overall: 62, affordability: 74, airQuality: 58, energy: 58, resilience: 58 },
    relatedCitySlugs: ["mumbai", "bangalore", "delhi"],
  }),
  buildNeutralCitySeed({
    slug: "muscat",
    name: "Muscat",
    countrySlug: "oman",
    countryName: "Oman",
    region: "Middle East",
    population: "~1.6M metro",
    intro:
      "Muscat is Oman's coastal capital with a calm urban profile and growing services activity, useful for Gulf-region comparison.",
    outlook:
      "Use the Muscat profile to compare cost framing, country-level transport and healthcare context, and arid-climate resilience.",
    scores: { overall: 70, affordability: 70, airQuality: 62, energy: 68, resilience: 64 },
    relatedCitySlugs: ["dubai", "abu-dhabi", "doha"],
  }),
  buildNeutralCitySeed({
    slug: "kuwait-city",
    name: "Kuwait City",
    countrySlug: "kuwait",
    countryName: "Kuwait",
    region: "Middle East",
    population: "~3.3M metro",
    intro:
      "Kuwait City is Kuwait's capital and largest urban centre, anchored by energy activity and a compact services economy.",
    outlook:
      "Use the Kuwait City profile to compare cost framing, country-level transport and healthcare context, and Gulf-region resilience.",
    scores: { overall: 66, affordability: 70, airQuality: 58, energy: 70, resilience: 60 },
    relatedCitySlugs: ["riyadh", "dubai", "doha"],
  }),
  buildNeutralCitySeed({
    slug: "manama",
    name: "Manama",
    countrySlug: "bahrain",
    countryName: "Bahrain",
    region: "Middle East",
    population: "~0.7M metro",
    intro:
      "Manama is Bahrain's compact capital and a long-standing Gulf-region financial-services hub.",
    outlook:
      "Use the Manama profile to compare cost framing, country-level context, and Gulf-region resilience alongside Doha and Dubai.",
    scores: { overall: 70, affordability: 68, airQuality: 60, energy: 65, resilience: 60 },
    relatedCitySlugs: ["doha", "dubai", "abu-dhabi"],
  }),
  buildNeutralCitySeed({
    slug: "amman",
    name: "Amman",
    countrySlug: "jordan",
    countryName: "Jordan",
    region: "Middle East",
    population: "~4.0M metro",
    intro:
      "Amman is Jordan's capital and a regional Levant hub, useful for comparing Middle-Eastern city contexts and humanitarian-region framing.",
    outlook:
      "Use the Amman profile to compare cost framing, country-level transport and healthcare context, and Levant-region resilience.",
    scores: { overall: 66, affordability: 72, airQuality: 60, energy: 60, resilience: 58 },
    relatedCitySlugs: ["dubai", "cairo", "riyadh"],
  }),
  buildNeutralCitySeed({
    slug: "tunis",
    name: "Tunis",
    countrySlug: "tunisia",
    countryName: "Tunisia",
    region: "North Africa",
    population: "~2.7M metro",
    intro:
      "Tunis is Tunisia's Mediterranean capital with North-African and European-adjacent context, useful for regional and relocation comparison.",
    outlook:
      "Use the Tunis profile to compare cost framing, country-level context, and Mediterranean-climate resilience.",
    scores: { overall: 64, affordability: 76, airQuality: 60, energy: 60, resilience: 58 },
    relatedCitySlugs: ["casablanca", "rabat", "cairo"],
  }),
  buildNeutralCitySeed({
    slug: "rabat",
    name: "Rabat",
    countrySlug: "morocco",
    countryName: "Morocco",
    region: "North Africa",
    population: "~2.0M metro",
    intro:
      "Rabat is Morocco's administrative capital with a calm coastal urban profile, useful for cross-region Moroccan comparison.",
    outlook:
      "Use the Rabat profile to compare cost framing, country-level transport and healthcare context, and Mediterranean-Atlantic resilience.",
    scores: { overall: 66, affordability: 74, airQuality: 65, energy: 60, resilience: 60 },
    relatedCitySlugs: ["casablanca", "tunis", "cairo"],
  }),
  buildNeutralCitySeed({
    slug: "dakar",
    name: "Dakar",
    countrySlug: "senegal",
    countryName: "Senegal",
    region: "West Africa",
    population: "~3.9M metro",
    intro:
      "Dakar is Senegal's Atlantic-facing capital and a major West-African services and logistics hub.",
    outlook:
      "Use the Dakar profile to compare cost framing, country-level context, and West-African coastal resilience.",
    scores: { overall: 62, affordability: 74, airQuality: 58, energy: 56, resilience: 56 },
    relatedCitySlugs: ["accra", "lagos", "casablanca"],
  }),
  buildNeutralCitySeed({
    slug: "dar-es-salaam",
    name: "Dar es Salaam",
    countrySlug: "tanzania",
    countryName: "Tanzania",
    region: "East Africa",
    population: "~7.4M metro",
    intro:
      "Dar es Salaam is Tanzania's largest city and a major Indian-Ocean port, useful for cross-region East-African comparison.",
    outlook:
      "Use the Dar es Salaam profile to compare cost framing, country-level transport and healthcare context, and coastal resilience.",
    scores: { overall: 60, affordability: 76, airQuality: 56, energy: 54, resilience: 54 },
    relatedCitySlugs: ["nairobi", "kampala", "addis-ababa"],
  }),
  buildNeutralCitySeed({
    slug: "kampala",
    name: "Kampala",
    countrySlug: "uganda",
    countryName: "Uganda",
    region: "East Africa",
    population: "~3.8M metro",
    intro:
      "Kampala is Uganda's capital and largest urban centre, with a regional services and logistics role useful for cross-region East-African comparison.",
    outlook:
      "Use the Kampala profile to compare cost framing, country-level transport and healthcare context, and inland-East-Africa resilience.",
    scores: { overall: 60, affordability: 78, airQuality: 56, energy: 54, resilience: 54 },
    relatedCitySlugs: ["nairobi", "kigali", "dar-es-salaam"],
  }),
  buildNeutralCitySeed({
    slug: "gaborone",
    name: "Gaborone",
    countrySlug: "botswana",
    countryName: "Botswana",
    region: "Southern Africa",
    population: "~0.4M metro",
    intro:
      "Gaborone is Botswana's compact capital with stable institutional context and a calm urban profile, useful for Southern-African comparison.",
    outlook:
      "Use the Gaborone profile to compare cost framing, country-level context, and Southern-African resilience.",
    scores: { overall: 64, affordability: 72, airQuality: 68, energy: 60, resilience: 60 },
    relatedCitySlugs: ["johannesburg", "cape-town", "nairobi"],
  }),
  buildNeutralCitySeed({
    slug: "adelaide",
    name: "Adelaide",
    countrySlug: "australia",
    countryName: "Australia",
    region: "Oceania",
    population: "~1.4M metro",
    intro:
      "Adelaide is a Southern-Australian metro known for compact form, food and wine, and growing services activity, useful for cross-region Australian comparison.",
    outlook:
      "Use the Adelaide profile to compare cost framing, country-level transport and healthcare context, and quality-of-life signals.",
    scores: { overall: 78, affordability: 70, airQuality: 80, energy: 74, resilience: 75 },
    relatedCitySlugs: ["melbourne", "perth", "brisbane"],
  }),
  buildNeutralCitySeed({
    slug: "canberra",
    name: "Canberra",
    countrySlug: "australia",
    countryName: "Australia",
    region: "Oceania",
    population: "~0.5M metro",
    intro:
      "Canberra is the Australian capital with a planned, low-density form and strong public-services density, useful for cross-region Australian comparison.",
    outlook:
      "Use the Canberra profile to compare cost framing, country-level context, and quality-of-life signals alongside other Australian metros.",
    scores: { overall: 80, affordability: 68, airQuality: 84, energy: 74, resilience: 78 },
    relatedCitySlugs: ["sydney", "melbourne", "adelaide"],
  }),
  buildNeutralCitySeed({
    slug: "christchurch",
    name: "Christchurch",
    countrySlug: "new-zealand",
    countryName: "New Zealand",
    region: "Oceania",
    population: "~0.4M metro",
    intro:
      "Christchurch is New Zealand's largest South-Island city with active urban renewal following past seismic events, useful for cross-region NZ comparison.",
    outlook:
      "Use the Christchurch profile to compare cost framing, country-level context, and seismic-resilience signals alongside Auckland and Wellington.",
    scores: { overall: 76, affordability: 70, airQuality: 80, energy: 72, resilience: 68 },
    relatedCitySlugs: ["auckland", "wellington", "melbourne"],
  }),
  // ===== Expansion batch: Europe (15) =====
  buildNeutralCitySeed({
    slug: "porto",
    name: "Porto",
    countrySlug: "portugal",
    countryName: "Portugal",
    region: "Southern Europe",
    population: "~1.7M metro",
    intro:
      "Porto is Portugal's second-largest metro, with riverfront historic architecture and active digital-services and remote-work activity that pair well with Lisbon for cross-region comparison.",
    outlook:
      "Use the Porto profile to compare cost framing, country-level context, and connectivity signals alongside Lisbon and other Southern-European metros.",
    scores: { overall: 79, affordability: 74, airQuality: 78, energy: 74, resilience: 72 },
    relatedCitySlugs: ["lisbon", "barcelona", "madrid"],
  }),
  buildNeutralCitySeed({
    slug: "valencia",
    name: "Valencia",
    countrySlug: "spain",
    countryName: "Spain",
    region: "Southern Europe",
    population: "~1.6M metro",
    intro:
      "Valencia is a Mediterranean Spanish metro with a compact urban core, mild climate, and growing remote-work and design economy useful for cross-region comparison.",
    outlook:
      "Use the Valencia profile to compare cost framing, mobility context, and quality-of-life signals alongside Barcelona, Madrid, and other Mediterranean metros.",
    scores: { overall: 78, affordability: 72, airQuality: 76, energy: 74, resilience: 72 },
    relatedCitySlugs: ["barcelona", "madrid", "lisbon"],
  }),
  buildNeutralCitySeed({
    slug: "seville",
    name: "Seville",
    countrySlug: "spain",
    countryName: "Spain",
    region: "Southern Europe",
    population: "~1.5M metro",
    intro:
      "Seville is the largest Andalusian metro, known for historic urban form, walkable centre, and heat-adaptation pressure that shapes summer urban planning conversations.",
    outlook:
      "Use the Seville profile to compare cost framing, mobility, and heat-adaptation signals alongside other Southern-European metros.",
    scores: { overall: 75, affordability: 74, airQuality: 72, energy: 72, resilience: 66 },
    relatedCitySlugs: ["madrid", "barcelona", "valencia"],
  }),
  buildNeutralCitySeed({
    slug: "bilbao",
    name: "Bilbao",
    countrySlug: "spain",
    countryName: "Spain",
    region: "Western Europe",
    population: "~1.0M metro",
    intro:
      "Bilbao is the largest Basque-region metro, with a regenerated post-industrial waterfront and compact transit network useful for cross-region Spanish and European comparison.",
    outlook:
      "Use the Bilbao profile to compare cost framing, mobility, and regeneration signals alongside Barcelona, Madrid, and other compact European metros.",
    scores: { overall: 79, affordability: 72, airQuality: 78, energy: 74, resilience: 74 },
    relatedCitySlugs: ["barcelona", "madrid", "valencia"],
  }),
  buildNeutralCitySeed({
    slug: "bologna",
    name: "Bologna",
    countrySlug: "italy",
    countryName: "Italy",
    region: "Southern Europe",
    population: "~1.0M metro",
    intro:
      "Bologna is a mid-sized northern Italian metro with strong university and food-economy density, used for cross-region Italian and European comparison.",
    outlook:
      "Use the Bologna profile to compare cost framing, mobility, and quality-of-life signals alongside Milan, Florence, and other northern Italian metros.",
    scores: { overall: 78, affordability: 70, airQuality: 72, energy: 72, resilience: 72 },
    relatedCitySlugs: ["milan", "florence", "rome"],
  }),
  buildNeutralCitySeed({
    slug: "florence",
    name: "Florence",
    countrySlug: "italy",
    countryName: "Italy",
    region: "Southern Europe",
    population: "~1.0M metro",
    intro:
      "Florence is a compact Tuscan metro with dense historic architecture, strong arts and design economy, and visitor pressure that shapes urban planning conversations.",
    outlook:
      "Use the Florence profile to compare cost framing, mobility, and heritage-management signals alongside other Italian and Mediterranean metros.",
    scores: { overall: 77, affordability: 68, airQuality: 72, energy: 70, resilience: 70 },
    relatedCitySlugs: ["rome", "milan", "bologna"],
  }),
  buildNeutralCitySeed({
    slug: "naples",
    name: "Naples",
    countrySlug: "italy",
    countryName: "Italy",
    region: "Southern Europe",
    population: "~3.0M metro",
    intro:
      "Naples is the largest Southern-Italian metro, with dense historic urban form, Mediterranean climate, and volcanic-region context that shapes adaptation planning.",
    outlook:
      "Use the Naples profile to compare cost framing, mobility, and resilience signals alongside other Italian and Mediterranean metros.",
    scores: { overall: 72, affordability: 74, airQuality: 66, energy: 66, resilience: 64 },
    relatedCitySlugs: ["rome", "milan", "florence"],
  }),
  buildNeutralCitySeed({
    slug: "krakow",
    name: "Krakow",
    countrySlug: "poland",
    countryName: "Poland",
    region: "Central Europe",
    population: "~1.1M metro",
    intro:
      "Krakow is southern Poland's largest metro, with a compact historic core and growing services and digital-economy activity, useful for Central-European comparison.",
    outlook:
      "Use the Krakow profile to compare cost framing, mobility, and connectivity signals alongside Warsaw and other Central-European metros.",
    scores: { overall: 77, affordability: 76, airQuality: 64, energy: 70, resilience: 72 },
    relatedCitySlugs: ["warsaw", "prague", "wroclaw"],
  }),
  buildNeutralCitySeed({
    slug: "gdansk",
    name: "Gdansk",
    countrySlug: "poland",
    countryName: "Poland",
    region: "Central Europe",
    population: "~1.5M tricity",
    intro:
      "Gdansk anchors the Tricity Baltic-coast metro in northern Poland, with port and services activity, useful for Northern-European and Baltic comparison.",
    outlook:
      "Use the Gdansk profile to compare cost framing, mobility, and coastal-resilience signals alongside other Polish and Baltic metros.",
    scores: { overall: 76, affordability: 74, airQuality: 72, energy: 70, resilience: 70 },
    relatedCitySlugs: ["warsaw", "krakow", "riga"],
  }),
  buildNeutralCitySeed({
    slug: "wroclaw",
    name: "Wroclaw",
    countrySlug: "poland",
    countryName: "Poland",
    region: "Central Europe",
    population: "~1.3M metro",
    intro:
      "Wroclaw is south-western Poland's largest metro, with a walkable historic centre and active business-services and tech-employer activity used for Central-European comparison.",
    outlook:
      "Use the Wroclaw profile to compare cost framing, mobility, and connectivity signals alongside Warsaw, Krakow, and other Central-European metros.",
    scores: { overall: 77, affordability: 74, airQuality: 68, energy: 70, resilience: 72 },
    relatedCitySlugs: ["warsaw", "krakow", "prague"],
  }),
  buildNeutralCitySeed({
    slug: "antwerp",
    name: "Antwerp",
    countrySlug: "belgium",
    countryName: "Belgium",
    region: "Western Europe",
    population: "~1.2M metro",
    intro:
      "Antwerp is Belgium's second-largest metro, with port and logistics density, design and diamond-trade activity, and compact urban form used for Western-European comparison.",
    outlook:
      "Use the Antwerp profile to compare cost framing, mobility, and port-economy signals alongside Brussels and other Northwest-European metros.",
    scores: { overall: 80, affordability: 70, airQuality: 74, energy: 76, resilience: 74 },
    relatedCitySlugs: ["brussels", "amsterdam", "rotterdam"],
  }),
  buildNeutralCitySeed({
    slug: "rotterdam",
    name: "Rotterdam",
    countrySlug: "netherlands",
    countryName: "Netherlands",
    region: "Western Europe",
    population: "~1.2M metro",
    intro:
      "Rotterdam is the largest Dutch port metro, with modern architecture, climate-adaptation pilots, and delta-region context that shapes long-run urban planning.",
    outlook:
      "Use the Rotterdam profile to compare cost framing, mobility, and delta-resilience signals alongside Amsterdam and other Northwest-European metros.",
    scores: { overall: 82, affordability: 70, airQuality: 76, energy: 80, resilience: 78 },
    relatedCitySlugs: ["amsterdam", "utrecht", "antwerp"],
  }),
  buildNeutralCitySeed({
    slug: "utrecht",
    name: "Utrecht",
    countrySlug: "netherlands",
    countryName: "Netherlands",
    region: "Western Europe",
    population: "~0.7M metro",
    intro:
      "Utrecht is a compact central-Dutch metro with strong cycling infrastructure, a major rail hub, and an active university and services economy.",
    outlook:
      "Use the Utrecht profile to compare cost framing, mobility, and quality-of-life signals alongside Amsterdam and Rotterdam.",
    scores: { overall: 84, affordability: 70, airQuality: 80, energy: 80, resilience: 78 },
    relatedCitySlugs: ["amsterdam", "rotterdam", "brussels"],
  }),
  buildNeutralCitySeed({
    slug: "geneva",
    name: "Geneva",
    countrySlug: "switzerland",
    countryName: "Switzerland",
    region: "Western Europe",
    population: "~1.0M cross-border metro",
    intro:
      "Geneva is a cross-border Lake-Geneva metro with international-organisation density, multilingual workforce, and high-cost daily-life framing used for European comparison.",
    outlook:
      "Use the Geneva profile to compare cost framing, mobility, and quality-of-life signals alongside Zurich and other Western-European metros.",
    scores: { overall: 87, affordability: 60, airQuality: 84, energy: 82, resilience: 86 },
    relatedCitySlugs: ["zurich", "basel", "paris"],
  }),
  buildNeutralCitySeed({
    slug: "basel",
    name: "Basel",
    countrySlug: "switzerland",
    countryName: "Switzerland",
    region: "Western Europe",
    population: "~0.8M tri-national metro",
    intro:
      "Basel is a Rhine-side tri-national metro with pharma and life-sciences density, walkable cultural districts, and reliable cross-border transit used for European comparison.",
    outlook:
      "Use the Basel profile to compare cost framing, mobility, and quality-of-life signals alongside Zurich and Geneva.",
    scores: { overall: 86, affordability: 62, airQuality: 84, energy: 82, resilience: 84 },
    relatedCitySlugs: ["zurich", "geneva", "vienna"],
  }),
  // ===== Expansion batch: North America (7) =====
  buildNeutralCitySeed({
    slug: "philadelphia",
    name: "Philadelphia",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~6.2M metro",
    intro:
      "Philadelphia is a Mid-Atlantic US metro with dense historic neighborhoods, education and healthcare anchors, and rail connectivity to the Northeast Corridor.",
    outlook:
      "Use the Philadelphia profile to compare cost framing, mobility, and healthcare-anchor signals alongside other US-East metros.",
    scores: { overall: 76, affordability: 70, airQuality: 70, energy: 72, resilience: 72 },
    relatedCitySlugs: ["new-york", "washington-dc", "boston"],
  }),
  buildNeutralCitySeed({
    slug: "atlanta",
    name: "Atlanta",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~6.3M metro",
    intro:
      "Atlanta is the largest US-Southeast metro, with airline-hub connectivity, dispersed urban form, and major film, healthcare, and corporate employer presence.",
    outlook:
      "Use the Atlanta profile to compare cost framing, mobility, and climate-exposure signals alongside other US-South metros.",
    scores: { overall: 74, affordability: 70, airQuality: 68, energy: 70, resilience: 66 },
    relatedCitySlugs: ["dallas", "miami", "austin"],
  }),
  buildNeutralCitySeed({
    slug: "denver",
    name: "Denver",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~3.0M metro",
    intro:
      "Denver is the US Mountain-West gateway metro, with elevation, dry climate, and active outdoor-economy framing useful for cross-region US comparison.",
    outlook:
      "Use the Denver profile to compare cost framing, mobility, and climate-exposure signals alongside other US-West metros.",
    scores: { overall: 78, affordability: 70, airQuality: 72, energy: 76, resilience: 72 },
    relatedCitySlugs: ["seattle", "san-francisco", "phoenix"],
  }),
  buildNeutralCitySeed({
    slug: "phoenix",
    name: "Phoenix",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~5.0M metro",
    intro:
      "Phoenix is the largest US-Southwest desert metro, with sustained summer heat, water-resource pressure, and large solar potential shaping the energy and resilience conversation.",
    outlook:
      "Use the Phoenix profile to compare cost framing, energy, and heat-adaptation signals alongside other US-West metros.",
    scores: { overall: 72, affordability: 72, airQuality: 64, energy: 76, resilience: 60 },
    relatedCitySlugs: ["los-angeles", "san-diego", "denver"],
  }),
  buildNeutralCitySeed({
    slug: "san-diego",
    name: "San Diego",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~3.3M metro",
    intro:
      "San Diego is a Pacific-coastal US metro with mild climate, naval and life-sciences density, and water-resource and wildfire-adaptation considerations.",
    outlook:
      "Use the San Diego profile to compare cost framing, mobility, and coastal-adaptation signals alongside Los Angeles and San Francisco.",
    scores: { overall: 80, affordability: 66, airQuality: 76, energy: 76, resilience: 72 },
    relatedCitySlugs: ["los-angeles", "san-francisco", "phoenix"],
  }),
  buildNeutralCitySeed({
    slug: "portland",
    name: "Portland",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.5M metro",
    intro:
      "Portland is a Pacific-Northwest US metro with active land-use planning, transit and cycling infrastructure, and forest and wildfire-adaptation context.",
    outlook:
      "Use the Portland profile to compare cost framing, mobility, and climate-adaptation signals alongside Seattle and San Francisco.",
    scores: { overall: 80, affordability: 68, airQuality: 76, energy: 78, resilience: 72 },
    relatedCitySlugs: ["seattle", "san-francisco", "vancouver"],
  }),
  buildNeutralCitySeed({
    slug: "ottawa",
    name: "Ottawa",
    countrySlug: "canada",
    countryName: "Canada",
    region: "North America",
    population: "~1.5M metro",
    intro:
      "Ottawa is Canada's national-capital metro, with stable public-sector employment, bilingual workforce, and continental-cold climate framing used for cross-region Canadian comparison.",
    outlook:
      "Use the Ottawa profile to compare cost framing, mobility, and public-services signals alongside Toronto and Montreal.",
    scores: { overall: 81, affordability: 72, airQuality: 80, energy: 76, resilience: 76 },
    relatedCitySlugs: ["toronto", "montreal", "vancouver"],
  }),
  // ===== Expansion batch: Latin America (7) =====
  buildNeutralCitySeed({
    slug: "curitiba",
    name: "Curitiba",
    countrySlug: "brazil",
    countryName: "Brazil",
    region: "Latin America",
    population: "~3.6M metro",
    intro:
      "Curitiba is a Southern-Brazilian metro known for bus-rapid-transit pioneering, planned parks system, and active services economy used for Latin-American comparison.",
    outlook:
      "Use the Curitiba profile to compare cost framing, mobility, and urban-planning signals alongside São Paulo and other Brazilian metros.",
    scores: { overall: 75, affordability: 72, airQuality: 74, energy: 72, resilience: 72 },
    relatedCitySlugs: ["sao-paulo", "rio-de-janeiro", "brasilia"],
  }),
  buildNeutralCitySeed({
    slug: "brasilia",
    name: "Brasilia",
    countrySlug: "brazil",
    countryName: "Brazil",
    region: "Latin America",
    population: "~4.7M metro",
    intro:
      "Brasilia is Brazil's planned federal-capital metro, with modernist urban design, dispersed form, and central-plateau climate framing used for cross-region comparison.",
    outlook:
      "Use the Brasilia profile to compare cost framing, mobility, and public-services signals alongside other Brazilian metros.",
    scores: { overall: 76, affordability: 70, airQuality: 76, energy: 74, resilience: 72 },
    relatedCitySlugs: ["sao-paulo", "rio-de-janeiro", "buenos-aires"],
  }),
  buildNeutralCitySeed({
    slug: "monterrey",
    name: "Monterrey",
    countrySlug: "mexico",
    countryName: "Mexico",
    region: "Latin America",
    population: "~5.3M metro",
    intro:
      "Monterrey is Mexico's largest northern metro, with heavy industry, manufacturing, and trade-corridor activity, and water-resource pressure that shapes adaptation planning.",
    outlook:
      "Use the Monterrey profile to compare cost framing, mobility, and water-adaptation signals alongside Mexico City and Guadalajara.",
    scores: { overall: 72, affordability: 74, airQuality: 64, energy: 70, resilience: 64 },
    relatedCitySlugs: ["mexico-city", "guadalajara", "dallas"],
  }),
  buildNeutralCitySeed({
    slug: "guadalajara",
    name: "Guadalajara",
    countrySlug: "mexico",
    countryName: "Mexico",
    region: "Latin America",
    population: "~5.3M metro",
    intro:
      "Guadalajara anchors Mexico's western Bajío region, with growing tech-employer presence, walkable historic core, and cultural industries used for Latin-American comparison.",
    outlook:
      "Use the Guadalajara profile to compare cost framing, mobility, and connectivity signals alongside Mexico City and Monterrey.",
    scores: { overall: 75, affordability: 76, airQuality: 68, energy: 72, resilience: 68 },
    relatedCitySlugs: ["mexico-city", "monterrey", "bogota"],
  }),
  buildNeutralCitySeed({
    slug: "valparaiso",
    name: "Valparaiso",
    countrySlug: "chile",
    countryName: "Chile",
    region: "Latin America",
    population: "~1.0M metro",
    intro:
      "Valparaiso is Chile's main Pacific-coast port metro, with hillside historic neighborhoods, cultural districts, and seismic and coastal-resilience considerations.",
    outlook:
      "Use the Valparaiso profile to compare cost framing, mobility, and seismic-coastal-resilience signals alongside Santiago and other Pacific-coast metros.",
    scores: { overall: 71, affordability: 72, airQuality: 72, energy: 68, resilience: 64 },
    relatedCitySlugs: ["santiago", "lima", "buenos-aires"],
  }),
  buildNeutralCitySeed({
    slug: "cordoba",
    name: "Cordoba",
    countrySlug: "argentina",
    countryName: "Argentina",
    region: "Latin America",
    population: "~1.5M metro",
    intro:
      "Cordoba is Argentina's second-largest metro, with a strong university base, automotive industry, and central-Argentine geography used for cross-region comparison.",
    outlook:
      "Use the Cordoba profile to compare cost framing, mobility, and education-economy signals alongside Buenos Aires and other Southern-Cone metros.",
    scores: { overall: 72, affordability: 76, airQuality: 70, energy: 70, resilience: 68 },
    relatedCitySlugs: ["buenos-aires", "santiago", "montevideo"],
  }),
  // ===== Expansion batch: Asia (9) =====
  buildNeutralCitySeed({
    slug: "nagoya",
    name: "Nagoya",
    countrySlug: "japan",
    countryName: "Japan",
    region: "East Asia",
    population: "~9.5M Chukyo metro",
    intro:
      "Nagoya is the core of Japan's Chukyo metropolitan region, with automotive-manufacturing density, rail-network anchor, and resilient infrastructure context.",
    outlook:
      "Use the Nagoya profile to compare cost framing, mobility, and industrial-economy signals alongside Tokyo and Osaka.",
    scores: { overall: 82, affordability: 70, airQuality: 76, energy: 76, resilience: 76 },
    relatedCitySlugs: ["tokyo", "osaka", "kyoto"],
  }),
  buildNeutralCitySeed({
    slug: "sapporo",
    name: "Sapporo",
    countrySlug: "japan",
    countryName: "Japan",
    region: "East Asia",
    population: "~2.6M metro",
    intro:
      "Sapporo is Hokkaido's largest metro, with cold-climate planning, winter-economy activity, and rail-grid form used for cross-region Japanese comparison.",
    outlook:
      "Use the Sapporo profile to compare cost framing, mobility, and cold-climate-resilience signals alongside Tokyo and other Japanese metros.",
    scores: { overall: 79, affordability: 74, airQuality: 80, energy: 72, resilience: 74 },
    relatedCitySlugs: ["tokyo", "osaka", "fukuoka"],
  }),
  buildNeutralCitySeed({
    slug: "daegu",
    name: "Daegu",
    countrySlug: "south-korea",
    countryName: "South Korea",
    region: "East Asia",
    population: "~2.4M metro",
    intro:
      "Daegu is a southeastern Korean metro, with textile and manufacturing heritage, dense urban form, and rail-link to Seoul used for cross-region comparison.",
    outlook:
      "Use the Daegu profile to compare cost framing, mobility, and connectivity signals alongside Seoul and Busan.",
    scores: { overall: 77, affordability: 76, airQuality: 70, energy: 74, resilience: 72 },
    relatedCitySlugs: ["seoul", "busan", "incheon"],
  }),
  buildNeutralCitySeed({
    slug: "incheon",
    name: "Incheon",
    countrySlug: "south-korea",
    countryName: "South Korea",
    region: "East Asia",
    population: "~3.0M metro",
    intro:
      "Incheon is the Seoul Capital Area's port and aviation gateway, with Songdo planned-district context and active logistics and trade economy.",
    outlook:
      "Use the Incheon profile to compare cost framing, mobility, and aviation-port signals alongside Seoul and Busan.",
    scores: { overall: 80, affordability: 74, airQuality: 70, energy: 76, resilience: 74 },
    relatedCitySlugs: ["seoul", "busan", "daegu"],
  }),
  buildNeutralCitySeed({
    slug: "kaohsiung",
    name: "Kaohsiung",
    countrySlug: "taiwan",
    countryName: "Taiwan",
    region: "East Asia",
    population: "~2.7M city",
    intro:
      "Kaohsiung is southern Taiwan's largest port metro, with heavy-industry transition, harbour regeneration, and active light-rail expansion used for regional comparison.",
    outlook:
      "Use the Kaohsiung profile to compare cost framing, mobility, and port-economy-transition signals alongside Taipei and other East-Asian metros.",
    scores: { overall: 76, affordability: 76, airQuality: 68, energy: 70, resilience: 70 },
    relatedCitySlugs: ["taipei", "hong-kong", "busan"],
  }),
  buildNeutralCitySeed({
    slug: "cebu",
    name: "Cebu",
    countrySlug: "philippines",
    countryName: "Philippines",
    region: "Southeast Asia",
    population: "~3.0M metro",
    intro:
      "Cebu is the largest Visayan metro in the Philippines, with island-economy logistics, business-process-outsourcing density, and active tourism flows used for Southeast-Asian comparison.",
    outlook:
      "Use the Cebu profile to compare cost framing, mobility, and coastal-resilience signals alongside Manila and other Southeast-Asian metros.",
    scores: { overall: 70, affordability: 76, airQuality: 70, energy: 66, resilience: 62 },
    relatedCitySlugs: ["manila", "bangkok", "ho-chi-minh-city"],
  }),
  buildNeutralCitySeed({
    slug: "da-nang",
    name: "Da Nang",
    countrySlug: "vietnam",
    countryName: "Vietnam",
    region: "Southeast Asia",
    population: "~1.2M metro",
    intro:
      "Da Nang is central Vietnam's main coastal metro, with growing services, tourism, and remote-work activity, and active typhoon and coastal-resilience planning.",
    outlook:
      "Use the Da Nang profile to compare cost framing, mobility, and coastal-resilience signals alongside Ho Chi Minh City and Hanoi.",
    scores: { overall: 73, affordability: 78, airQuality: 70, energy: 68, resilience: 64 },
    relatedCitySlugs: ["ho-chi-minh-city", "hanoi", "chiang-mai"],
  }),
  buildNeutralCitySeed({
    slug: "lahore",
    name: "Lahore",
    countrySlug: "pakistan",
    countryName: "Pakistan",
    region: "South Asia",
    population: "~13M metro",
    intro:
      "Lahore is Pakistan's cultural and historic Punjab metro, with dense urban form, education and services anchors, and persistent air-quality and heat-adaptation pressure.",
    outlook:
      "Use the Lahore profile to compare cost framing, mobility, and air-quality signals alongside Karachi, Delhi, and other South-Asian metros.",
    scores: { overall: 64, affordability: 78, airQuality: 50, energy: 58, resilience: 58 },
    relatedCitySlugs: ["karachi", "delhi", "mumbai"],
  }),
  buildNeutralCitySeed({
    slug: "karachi",
    name: "Karachi",
    countrySlug: "pakistan",
    countryName: "Pakistan",
    region: "South Asia",
    population: "~17M metro",
    intro:
      "Karachi is Pakistan's largest coastal megacity and main port, with dense urban form, heavy trade and finance activity, and meaningful heat, coastal, and air-quality pressures.",
    outlook:
      "Use the Karachi profile to compare cost framing, mobility, and coastal-air-quality signals alongside Lahore, Mumbai, and other South-Asian metros.",
    scores: { overall: 64, affordability: 78, airQuality: 50, energy: 58, resilience: 58 },
    relatedCitySlugs: ["lahore", "mumbai", "delhi"],
  }),
  // ===== Expansion batch: Middle East (4) =====
  buildNeutralCitySeed({
    slug: "jeddah",
    name: "Jeddah",
    countrySlug: "saudi-arabia",
    countryName: "Saudi Arabia",
    region: "Middle East",
    population: "~4.7M metro",
    intro:
      "Jeddah is Saudi Arabia's main Red-Sea coastal metro, with port economy, historic Al-Balad district, and active service and tourism investment used for regional comparison.",
    outlook:
      "Use the Jeddah profile to compare cost framing, mobility, and coastal-economy signals alongside Riyadh and other Gulf metros.",
    scores: { overall: 72, affordability: 70, airQuality: 64, energy: 76, resilience: 64 },
    relatedCitySlugs: ["riyadh", "medina", "dubai"],
  }),
  buildNeutralCitySeed({
    slug: "medina",
    name: "Medina",
    countrySlug: "saudi-arabia",
    countryName: "Saudi Arabia",
    region: "Middle East",
    population: "~1.5M metro",
    intro:
      "Medina is a major religious-pilgrimage city in western Saudi Arabia, with seasonal visitor flows that shape transport, services, and urban-management priorities.",
    outlook:
      "Use the Medina profile to compare cost framing, mobility, and pilgrimage-flow services signals alongside Jeddah and Mecca-region context.",
    scores: { overall: 70, affordability: 72, airQuality: 64, energy: 74, resilience: 64 },
    relatedCitySlugs: ["jeddah", "riyadh", "dubai"],
  }),
  buildNeutralCitySeed({
    slug: "sharjah",
    name: "Sharjah",
    countrySlug: "united-arab-emirates",
    countryName: "United Arab Emirates",
    region: "Middle East",
    population: "~1.8M city",
    intro:
      "Sharjah is the third-largest UAE emirate metro, with cultural-heritage focus, family-oriented residential context, and dense Dubai-region commuting links.",
    outlook:
      "Use the Sharjah profile to compare cost framing, mobility, and cross-emirate signals alongside Dubai and Abu Dhabi.",
    scores: { overall: 76, affordability: 72, airQuality: 64, energy: 76, resilience: 70 },
    relatedCitySlugs: ["dubai", "abu-dhabi", "doha"],
  }),
  buildNeutralCitySeed({
    slug: "beirut",
    name: "Beirut",
    countrySlug: "lebanon",
    countryName: "Lebanon",
    region: "Middle East",
    population: "~2.2M metro",
    intro:
      "Beirut is Lebanon's coastal Mediterranean capital metro, with dense historic neighborhoods, banking and services heritage, and a strongly diaspora-linked economy.",
    outlook:
      "Use the Beirut profile to compare cost framing, mobility, and coastal-Mediterranean signals alongside other Levantine and Mediterranean metros — confirm current operating conditions via official Lebanese publishers.",
    scores: { overall: 64, affordability: 70, airQuality: 60, energy: 56, resilience: 56 },
    relatedCitySlugs: ["amman", "istanbul", "tel-aviv"],
  }),
  // ===== Expansion batch: Africa (6) =====
  buildNeutralCitySeed({
    slug: "alexandria",
    name: "Alexandria",
    countrySlug: "egypt",
    countryName: "Egypt",
    region: "North Africa",
    population: "~5.5M metro",
    intro:
      "Alexandria is Egypt's main Mediterranean coastal metro, with port economy, historic university and cultural anchors, and active coastal-erosion and sea-level adaptation work.",
    outlook:
      "Use the Alexandria profile to compare cost framing, mobility, and coastal-resilience signals alongside Cairo and other Mediterranean metros.",
    scores: { overall: 68, affordability: 74, airQuality: 60, energy: 64, resilience: 60 },
    relatedCitySlugs: ["cairo", "tunis", "casablanca"],
  }),
  buildNeutralCitySeed({
    slug: "marrakesh",
    name: "Marrakesh",
    countrySlug: "morocco",
    countryName: "Morocco",
    region: "North Africa",
    population: "~1.5M metro",
    intro:
      "Marrakesh is a historic central-Moroccan metro at the foot of the Atlas Mountains, with dense medina form, tourism-led services, and persistent heat-adaptation context.",
    outlook:
      "Use the Marrakesh profile to compare cost framing, mobility, and heritage-and-heat signals alongside Casablanca, Rabat, and other North-African metros.",
    scores: { overall: 70, affordability: 74, airQuality: 66, energy: 68, resilience: 62 },
    relatedCitySlugs: ["casablanca", "rabat", "tunis"],
  }),
  buildNeutralCitySeed({
    slug: "durban",
    name: "Durban",
    countrySlug: "south-africa",
    countryName: "South Africa",
    region: "Southern Africa",
    population: "~3.7M metro",
    intro:
      "Durban is South Africa's main Indian-Ocean port metro, with subtropical climate, manufacturing and logistics anchors, and active coastal-flood and climate-resilience work.",
    outlook:
      "Use the Durban profile to compare cost framing, mobility, and coastal-resilience signals alongside Cape Town and Johannesburg.",
    scores: { overall: 70, affordability: 72, airQuality: 66, energy: 64, resilience: 62 },
    relatedCitySlugs: ["cape-town", "johannesburg", "maputo"],
  }),
  buildNeutralCitySeed({
    slug: "windhoek",
    name: "Windhoek",
    countrySlug: "namibia",
    countryName: "Namibia",
    region: "Southern Africa",
    population: "~0.4M city",
    intro:
      "Windhoek is Namibia's capital and largest city, in a semi-arid central-plateau setting, with national-services anchor role and active water-resource planning.",
    outlook:
      "Use the Windhoek profile to compare cost framing, country-level context, and arid-resilience signals alongside other Southern-African capitals.",
    scores: { overall: 66, affordability: 70, airQuality: 76, energy: 64, resilience: 60 },
    relatedCitySlugs: ["gaborone", "cape-town", "johannesburg"],
  }),
  buildNeutralCitySeed({
    slug: "lusaka",
    name: "Lusaka",
    countrySlug: "zambia",
    countryName: "Zambia",
    region: "Southern Africa",
    population: "~3.2M metro",
    intro:
      "Lusaka is Zambia's inland-plateau capital metro, with national-services anchor role, growing services activity, and hydro-grid context that shapes the energy conversation.",
    outlook:
      "Use the Lusaka profile to compare cost framing, country-level context, and hydro-energy signals alongside other Southern-African metros.",
    scores: { overall: 64, affordability: 74, airQuality: 70, energy: 60, resilience: 58 },
    relatedCitySlugs: ["gaborone", "nairobi", "johannesburg"],
  }),
  buildNeutralCitySeed({
    slug: "maputo",
    name: "Maputo",
    countrySlug: "mozambique",
    countryName: "Mozambique",
    region: "Southern Africa",
    population: "~2.5M metro",
    intro:
      "Maputo is Mozambique's coastal capital metro on the Indian Ocean, with port economy, growing services activity, and active tropical-cyclone and flood-adaptation work.",
    outlook:
      "Use the Maputo profile to compare cost framing, country-level context, and coastal-cyclone-resilience signals alongside other Southern-African coastal metros.",
    scores: { overall: 62, affordability: 74, airQuality: 70, energy: 58, resilience: 54 },
    relatedCitySlugs: ["durban", "dar-es-salaam", "cape-town"],
  }),
  // ===== Expansion batch: Oceania (2) =====
  buildNeutralCitySeed({
    slug: "hobart",
    name: "Hobart",
    countrySlug: "australia",
    countryName: "Australia",
    region: "Oceania",
    population: "~0.25M metro",
    intro:
      "Hobart is the Tasmanian capital metro, with compact urban form, cool-temperate climate, and a research, food, and tourism mix used for cross-region Australian comparison.",
    outlook:
      "Use the Hobart profile to compare cost framing, mobility, and quality-of-life signals alongside Melbourne, Adelaide, and other Australian metros.",
    scores: { overall: 78, affordability: 72, airQuality: 84, energy: 74, resilience: 74 },
    relatedCitySlugs: ["melbourne", "adelaide", "christchurch"],
  }),
  buildNeutralCitySeed({
    slug: "gold-coast",
    name: "Gold Coast",
    countrySlug: "australia",
    countryName: "Australia",
    region: "Oceania",
    population: "~0.7M metro",
    intro:
      "Gold Coast is the largest non-capital Australian metro, with coastal subtropical geography, tourism-led economy, and active coastal and flood-adaptation conversations.",
    outlook:
      "Use the Gold Coast profile to compare cost framing, mobility, and coastal-resilience signals alongside Brisbane and other Australian metros.",
    scores: { overall: 76, affordability: 70, airQuality: 80, energy: 74, resilience: 70 },
    relatedCitySlugs: ["brisbane", "sydney", "auckland"],
  }),
  buildNeutralCitySeed({
    slug: "dunedin",
    name: "Dunedin",
    countrySlug: "new-zealand",
    countryName: "New Zealand",
    region: "Oceania",
    population: "~0.13M metro",
    intro:
      "Dunedin is a Southern-NZ university metro, with compact historic centre, cool-temperate climate, and active student and research economy used for cross-region NZ comparison.",
    outlook:
      "Use the Dunedin profile to compare cost framing, mobility, and education-economy signals alongside Auckland, Wellington, and Christchurch.",
    scores: { overall: 75, affordability: 72, airQuality: 82, energy: 70, resilience: 68 },
    relatedCitySlugs: ["christchurch", "wellington", "auckland"],
  }),
  // ===== Expansion batch 3 (2026-05-22): EU, UK/Ireland, US, Commonwealth =====
  // 61 cities added across UK/Ireland, France, Germany, Spain, Italy,
  // Benelux + Luxembourg, Nordics, Central/Eastern Europe, the United
  // States, Canada, Australia, and New Zealand. Every entry uses the
  // existing `buildNeutralCitySeed` helper with hand-written neutral
  // intro/outlook copy and directional scores; module data is generated
  // by the helper and rendered as a directional indicator with the
  // existing transparent fallback for verified utility layers.
  buildNeutralCitySeed({
    slug: "manchester",
    name: "Manchester",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    region: "Western Europe",
    population: "~2.9M metro",
    intro:
      "Manchester is a Northern-English metro with a digital-services and creative-industries anchor, useful for comparing relocation and remote-work contexts against London at a different cost framing.",
    outlook:
      "Use the Manchester profile to compare structured indicators across cost, transport, healthcare context, and country-level signals alongside other major UK cities.",
    scores: { overall: 76, affordability: 70, airQuality: 74, energy: 74, resilience: 74 },
    relatedCitySlugs: ["london", "edinburgh", "leeds"],
  }),
  buildNeutralCitySeed({
    slug: "birmingham",
    name: "Birmingham",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    region: "Western Europe",
    population: "~4.3M metro",
    intro:
      "Birmingham is England's second-largest metro, with a manufacturing-to-services transition profile and active transport investment used for cross-UK relocation comparison.",
    outlook:
      "Use the Birmingham profile to compare cost framing, transport access, and country-level context against London, Manchester, and other UK cities.",
    scores: { overall: 74, affordability: 72, airQuality: 72, energy: 72, resilience: 72 },
    relatedCitySlugs: ["london", "manchester", "leeds"],
  }),
  buildNeutralCitySeed({
    slug: "bristol",
    name: "Bristol",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    region: "Western Europe",
    population: "~0.7M metro",
    intro:
      "Bristol is a compact South-West English metro with a strong creative-industries and aerospace mix, often considered for relocation by remote workers and families.",
    outlook:
      "Use the Bristol profile to compare cost framing, transport access, and country-level intelligence alongside other mid-size UK cities.",
    scores: { overall: 76, affordability: 70, airQuality: 76, energy: 74, resilience: 74 },
    relatedCitySlugs: ["london", "manchester", "cardiff"],
  }),
  buildNeutralCitySeed({
    slug: "leeds",
    name: "Leeds",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    region: "Western Europe",
    population: "~1.9M metro",
    intro:
      "Leeds is a Northern-English financial and digital-services hub, used for cross-region UK relocation comparison alongside Manchester and Sheffield.",
    outlook:
      "Use the Leeds profile to compare cost framing, transport access, and country-level context across the UK's Northern metro cluster.",
    scores: { overall: 75, affordability: 72, airQuality: 74, energy: 72, resilience: 72 },
    relatedCitySlugs: ["manchester", "birmingham", "london"],
  }),
  buildNeutralCitySeed({
    slug: "glasgow",
    name: "Glasgow",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    region: "Western Europe",
    population: "~1.8M metro",
    intro:
      "Glasgow is Scotland's largest metro, with a strong cultural-economy and engineering tradition, useful for cross-region UK and Scottish comparison.",
    outlook:
      "Use the Glasgow profile to compare cost framing, transport access, and country-level context alongside Edinburgh and other Scottish-region cities.",
    scores: { overall: 74, affordability: 74, airQuality: 74, energy: 72, resilience: 70 },
    relatedCitySlugs: ["edinburgh", "manchester", "london"],
  }),
  buildNeutralCitySeed({
    slug: "belfast",
    name: "Belfast",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    region: "Western Europe",
    population: "~0.66M metro",
    intro:
      "Belfast is Northern Ireland's capital metro, with growing professional-services activity and post-industrial regeneration relevant to relocation comparison.",
    outlook:
      "Use the Belfast profile to compare cost framing, transport access, and country-level context against other UK and Irish metros.",
    scores: { overall: 72, affordability: 76, airQuality: 74, energy: 70, resilience: 70 },
    relatedCitySlugs: ["dublin", "edinburgh", "cardiff"],
  }),
  buildNeutralCitySeed({
    slug: "cardiff",
    name: "Cardiff",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    region: "Western Europe",
    population: "~0.49M metro",
    intro:
      "Cardiff is Wales' capital metro, with a compact urban core, public-sector and media employment, and active waterfront regeneration.",
    outlook:
      "Use the Cardiff profile to compare cost framing, transport access, and country-level context alongside Bristol and other UK mid-size cities.",
    scores: { overall: 74, affordability: 74, airQuality: 76, energy: 72, resilience: 72 },
    relatedCitySlugs: ["bristol", "london", "belfast"],
  }),
  buildNeutralCitySeed({
    slug: "cork",
    name: "Cork",
    countrySlug: "ireland",
    countryName: "Ireland",
    region: "Western Europe",
    population: "~0.34M metro",
    intro:
      "Cork is Ireland's second metro, with a pharmaceutical, tech, and services mix on the south coast, used for cross-region Irish relocation comparison.",
    outlook:
      "Use the Cork profile to compare cost framing, transport access, and country-level context alongside Dublin and other Western-European mid-size cities.",
    scores: { overall: 74, affordability: 70, airQuality: 78, energy: 72, resilience: 72 },
    relatedCitySlugs: ["dublin", "belfast", "galway"],
  }),
  buildNeutralCitySeed({
    slug: "lyon",
    name: "Lyon",
    countrySlug: "france",
    countryName: "France",
    region: "Western Europe",
    population: "~2.3M metro",
    intro:
      "Lyon is France's third-largest metro with a strong life-sciences, finance, and gastronomy mix, used for cross-region French comparison beyond Paris.",
    outlook:
      "Use the Lyon profile to compare cost framing, transport access, healthcare context, and country-level signals against other large European metros.",
    scores: { overall: 78, affordability: 70, airQuality: 74, energy: 76, resilience: 76 },
    relatedCitySlugs: ["paris", "geneva", "marseille"],
  }),
  buildNeutralCitySeed({
    slug: "marseille",
    name: "Marseille",
    countrySlug: "france",
    countryName: "France",
    region: "Western Europe",
    population: "~1.6M metro",
    intro:
      "Marseille is France's Mediterranean port metro, with a multicultural services and logistics economy and active climate-adaptation work along the coast.",
    outlook:
      "Use the Marseille profile to compare cost framing, transport access, and heat-and-coastal resilience context alongside other Mediterranean cities.",
    scores: { overall: 72, affordability: 74, airQuality: 70, energy: 72, resilience: 68 },
    relatedCitySlugs: ["lyon", "barcelona", "nice"],
  }),
  buildNeutralCitySeed({
    slug: "toulouse",
    name: "Toulouse",
    countrySlug: "france",
    countryName: "France",
    region: "Western Europe",
    population: "~1.4M metro",
    intro:
      "Toulouse is an aerospace and research metro in southwestern France, useful for comparing tech-relocation context inside the EU regulatory frame.",
    outlook:
      "Use the Toulouse profile to compare cost framing, transport access, and country-level intelligence alongside Bordeaux, Lyon, and Spanish peers.",
    scores: { overall: 76, affordability: 72, airQuality: 74, energy: 74, resilience: 74 },
    relatedCitySlugs: ["lyon", "bordeaux", "barcelona"],
  }),
  buildNeutralCitySeed({
    slug: "nice",
    name: "Nice",
    countrySlug: "france",
    countryName: "France",
    region: "Western Europe",
    population: "~1.0M metro",
    intro:
      "Nice is a Mediterranean French metro on the Côte d'Azur, with tourism, services, and active coastal-resilience work used in regional comparison.",
    outlook:
      "Use the Nice profile to compare cost framing, transport access, and coastal-resilience signals alongside other Mediterranean cities.",
    scores: { overall: 74, affordability: 64, airQuality: 74, energy: 72, resilience: 70 },
    relatedCitySlugs: ["marseille", "lyon", "barcelona"],
  }),
  buildNeutralCitySeed({
    slug: "bordeaux",
    name: "Bordeaux",
    countrySlug: "france",
    countryName: "France",
    region: "Western Europe",
    population: "~1.0M metro",
    intro:
      "Bordeaux is a southwestern French metro known for compact urban form and a wine, services, and aerospace mix, frequently cited in remote-work relocation comparisons.",
    outlook:
      "Use the Bordeaux profile to compare cost framing, transport access, and country-level intelligence alongside other mid-size French and Iberian cities.",
    scores: { overall: 78, affordability: 70, airQuality: 76, energy: 76, resilience: 76 },
    relatedCitySlugs: ["lyon", "toulouse", "porto"],
  }),
  buildNeutralCitySeed({
    slug: "strasbourg",
    name: "Strasbourg",
    countrySlug: "france",
    countryName: "France",
    region: "Western Europe",
    population: "~0.79M metro",
    intro:
      "Strasbourg is a cross-border French metro on the Rhine with EU-institution presence, used for relocation comparison and cross-regional French-German comparison.",
    outlook:
      "Use the Strasbourg profile to compare cost framing, transport access, and country-level intelligence alongside Lyon, Frankfurt, and other Rhine metros.",
    scores: { overall: 76, affordability: 72, airQuality: 74, energy: 76, resilience: 76 },
    relatedCitySlugs: ["lyon", "frankfurt", "basel"],
  }),
  buildNeutralCitySeed({
    slug: "frankfurt",
    name: "Frankfurt",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Western Europe",
    population: "~5.7M metro",
    intro:
      "Frankfurt is Germany's financial centre with an international-services and aviation-hub profile, used for European-wide financial-services relocation comparison.",
    outlook:
      "Use the Frankfurt profile to compare cost framing, transport access, and country-level context across German and Western-European metros.",
    scores: { overall: 80, affordability: 64, airQuality: 76, energy: 76, resilience: 78 },
    relatedCitySlugs: ["berlin", "munich", "luxembourg-city"],
  }),
  buildNeutralCitySeed({
    slug: "cologne",
    name: "Cologne",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Western Europe",
    population: "~3.6M metro",
    intro:
      "Cologne is a Rhine-region German metro with media, chemicals, and trade-fair activity, used for cross-region German comparison alongside Düsseldorf and Frankfurt.",
    outlook:
      "Use the Cologne profile to compare cost framing, transport access, and country-level intelligence against other Rhine and German metros.",
    scores: { overall: 76, affordability: 70, airQuality: 74, energy: 74, resilience: 74 },
    relatedCitySlugs: ["dusseldorf", "frankfurt", "berlin"],
  }),
  buildNeutralCitySeed({
    slug: "stuttgart",
    name: "Stuttgart",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Western Europe",
    population: "~2.8M metro",
    intro:
      "Stuttgart is a southwestern German metro with an automotive and engineering anchor, used for comparing engineering-relocation context inside the EU.",
    outlook:
      "Use the Stuttgart profile to compare cost framing, transport access, and country-level signals alongside other engineering-led European metros.",
    scores: { overall: 78, affordability: 68, airQuality: 74, energy: 76, resilience: 76 },
    relatedCitySlugs: ["munich", "frankfurt", "zurich"],
  }),
  buildNeutralCitySeed({
    slug: "dusseldorf",
    name: "Düsseldorf",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Western Europe",
    population: "~1.5M metro",
    intro:
      "Düsseldorf is a Rhine-region German metro with media, fashion, and corporate-services activity, used for cross-region German and Benelux comparison.",
    outlook:
      "Use the Düsseldorf profile to compare cost framing, transport access, and country-level context against Cologne, Frankfurt, and Benelux peers.",
    scores: { overall: 76, affordability: 70, airQuality: 74, energy: 74, resilience: 74 },
    relatedCitySlugs: ["cologne", "frankfurt", "amsterdam"],
  }),
  buildNeutralCitySeed({
    slug: "leipzig",
    name: "Leipzig",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Central Europe",
    population: "~1.1M metro",
    intro:
      "Leipzig is an eastern-German metro with a creative-industries and logistics profile, frequently used for cost-friendly German relocation comparison.",
    outlook:
      "Use the Leipzig profile to compare cost framing, transport access, and country-level intelligence alongside Berlin, Dresden, and other German metros.",
    scores: { overall: 76, affordability: 76, airQuality: 74, energy: 74, resilience: 72 },
    relatedCitySlugs: ["berlin", "dresden", "prague"],
  }),
  buildNeutralCitySeed({
    slug: "dresden",
    name: "Dresden",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Central Europe",
    population: "~0.8M metro",
    intro:
      "Dresden is an eastern-German metro with a research, microelectronics, and culture mix, used for cross-region German and Czech relocation comparison.",
    outlook:
      "Use the Dresden profile to compare cost framing, transport access, and country-level context alongside Leipzig, Prague, and Berlin.",
    scores: { overall: 75, affordability: 76, airQuality: 74, energy: 72, resilience: 72 },
    relatedCitySlugs: ["leipzig", "prague", "berlin"],
  }),
  buildNeutralCitySeed({
    slug: "malaga",
    name: "Malaga",
    countrySlug: "spain",
    countryName: "Spain",
    region: "Southern Europe",
    population: "~1.7M metro",
    intro:
      "Malaga is a southern Spanish coastal metro with a growing tech, tourism, and remote-work mix on the Costa del Sol, useful for relocation comparison.",
    outlook:
      "Use the Malaga profile to compare cost framing, transport access, and country-level intelligence alongside other southern-European coastal metros.",
    scores: { overall: 76, affordability: 74, airQuality: 76, energy: 74, resilience: 70 },
    relatedCitySlugs: ["seville", "valencia", "lisbon"],
  }),
  buildNeutralCitySeed({
    slug: "zaragoza",
    name: "Zaragoza",
    countrySlug: "spain",
    countryName: "Spain",
    region: "Southern Europe",
    population: "~0.95M metro",
    intro:
      "Zaragoza is a north-eastern Spanish metro on the Madrid-Barcelona corridor, with logistics and services activity used for cross-region Spanish comparison.",
    outlook:
      "Use the Zaragoza profile to compare cost framing, transport access, and country-level context against Madrid, Barcelona, and Valencia.",
    scores: { overall: 74, affordability: 76, airQuality: 74, energy: 72, resilience: 72 },
    relatedCitySlugs: ["madrid", "barcelona", "valencia"],
  }),
  buildNeutralCitySeed({
    slug: "granada",
    name: "Granada",
    countrySlug: "spain",
    countryName: "Spain",
    region: "Southern Europe",
    population: "~0.5M metro",
    intro:
      "Granada is a southern Spanish metro at the foot of the Sierra Nevada, with a university and culture-led economy useful for compact-city comparison.",
    outlook:
      "Use the Granada profile to compare cost framing, transport access, and country-level intelligence alongside other southern-Spanish and Mediterranean cities.",
    scores: { overall: 74, affordability: 76, airQuality: 74, energy: 72, resilience: 70 },
    relatedCitySlugs: ["seville", "malaga", "valencia"],
  }),
  buildNeutralCitySeed({
    slug: "turin",
    name: "Turin",
    countrySlug: "italy",
    countryName: "Italy",
    region: "Southern Europe",
    population: "~2.2M metro",
    intro:
      "Turin is a north-western Italian metro with an automotive, aerospace, and design economy, used for cross-region Italian and Alpine comparison.",
    outlook:
      "Use the Turin profile to compare cost framing, transport access, and country-level intelligence alongside Milan, Genoa, and Lyon.",
    scores: { overall: 74, affordability: 72, airQuality: 68, energy: 72, resilience: 72 },
    relatedCitySlugs: ["milan", "genoa", "lyon"],
  }),
  buildNeutralCitySeed({
    slug: "genoa",
    name: "Genoa",
    countrySlug: "italy",
    countryName: "Italy",
    region: "Southern Europe",
    population: "~0.83M metro",
    intro:
      "Genoa is an Italian port metro on the Ligurian coast, with maritime, logistics, and tourism activity used for coastal-resilience and Mediterranean comparison.",
    outlook:
      "Use the Genoa profile to compare cost framing, transport access, and coastal-resilience signals alongside other Mediterranean metros.",
    scores: { overall: 72, affordability: 74, airQuality: 70, energy: 70, resilience: 66 },
    relatedCitySlugs: ["milan", "turin", "marseille"],
  }),
  buildNeutralCitySeed({
    slug: "palermo",
    name: "Palermo",
    countrySlug: "italy",
    countryName: "Italy",
    region: "Southern Europe",
    population: "~1.2M metro",
    intro:
      "Palermo is the Sicilian capital metro on the Mediterranean, with a culture, services, and tourism mix used for southern-Italian comparison.",
    outlook:
      "Use the Palermo profile to compare cost framing, transport access, and country-level context alongside Naples and other southern-Italian cities.",
    scores: { overall: 68, affordability: 76, airQuality: 68, energy: 68, resilience: 64 },
    relatedCitySlugs: ["naples", "rome", "catania"],
  }),
  buildNeutralCitySeed({
    slug: "verona",
    name: "Verona",
    countrySlug: "italy",
    countryName: "Italy",
    region: "Southern Europe",
    population: "~0.71M metro",
    intro:
      "Verona is a north-eastern Italian metro on the Verona–Brenner corridor, with tourism, agriculture, and logistics activity used in regional comparison.",
    outlook:
      "Use the Verona profile to compare cost framing, transport access, and country-level context alongside Milan, Venice, and other northern Italian cities.",
    scores: { overall: 74, affordability: 74, airQuality: 70, energy: 72, resilience: 72 },
    relatedCitySlugs: ["milan", "turin", "bologna"],
  }),
  buildNeutralCitySeed({
    slug: "the-hague",
    name: "The Hague",
    countrySlug: "netherlands",
    countryName: "Netherlands",
    region: "Western Europe",
    population: "~1.1M metro",
    intro:
      "The Hague is the Netherlands' administrative and international-justice metro on the North Sea coast, used for cross-region Dutch and international-organisations comparison.",
    outlook:
      "Use The Hague profile to compare cost framing, transport access, and country-level intelligence alongside Amsterdam and Rotterdam.",
    scores: { overall: 80, affordability: 66, airQuality: 80, energy: 78, resilience: 76 },
    relatedCitySlugs: ["amsterdam", "rotterdam", "utrecht"],
  }),
  buildNeutralCitySeed({
    slug: "eindhoven",
    name: "Eindhoven",
    countrySlug: "netherlands",
    countryName: "Netherlands",
    region: "Western Europe",
    population: "~0.78M metro",
    intro:
      "Eindhoven is a southern-Dutch metro and Brainport hub, with semiconductors and design industries used for tech-relocation comparison inside the EU.",
    outlook:
      "Use the Eindhoven profile to compare cost framing, transport access, and country-level context alongside Amsterdam, Antwerp, and other Western-European tech metros.",
    scores: { overall: 78, affordability: 70, airQuality: 78, energy: 78, resilience: 76 },
    relatedCitySlugs: ["amsterdam", "antwerp", "rotterdam"],
  }),
  buildNeutralCitySeed({
    slug: "ghent",
    name: "Ghent",
    countrySlug: "belgium",
    countryName: "Belgium",
    region: "Western Europe",
    population: "~0.55M metro",
    intro:
      "Ghent is a Belgian Flemish metro with a port, university, and creative-industries mix, used for cross-region Belgian and Benelux comparison.",
    outlook:
      "Use the Ghent profile to compare cost framing, transport access, and country-level context alongside Brussels, Antwerp, and other Flemish cities.",
    scores: { overall: 78, affordability: 72, airQuality: 76, energy: 76, resilience: 74 },
    relatedCitySlugs: ["brussels", "antwerp", "leuven"],
  }),
  buildNeutralCitySeed({
    slug: "luxembourg-city",
    name: "Luxembourg City",
    countrySlug: "luxembourg",
    countryName: "Luxembourg",
    region: "Western Europe",
    population: "~0.13M metro",
    intro:
      "Luxembourg City is the EU-institution and financial-services capital of Luxembourg, with high cross-border commuter integration used for relocation comparison inside the EU.",
    outlook:
      "Use the Luxembourg City profile to compare cost framing, transport access, and country-level context alongside Brussels, Frankfurt, and other Western-European hubs.",
    scores: { overall: 82, affordability: 56, airQuality: 78, energy: 76, resilience: 78 },
    relatedCitySlugs: ["brussels", "frankfurt", "strasbourg"],
  }),
  buildNeutralCitySeed({
    slug: "aarhus",
    name: "Aarhus",
    countrySlug: "denmark",
    countryName: "Denmark",
    region: "Northern Europe",
    population: "~0.35M metro",
    intro:
      "Aarhus is Denmark's second metro on the Jutland east coast, with university, life-sciences, and design activity used for cross-region Danish comparison.",
    outlook:
      "Use the Aarhus profile to compare cost framing, transport access, and country-level context alongside Copenhagen and Scandinavian peers.",
    scores: { overall: 82, affordability: 68, airQuality: 84, energy: 86, resilience: 82 },
    relatedCitySlugs: ["copenhagen", "oslo", "stockholm"],
  }),
  buildNeutralCitySeed({
    slug: "malmo",
    name: "Malmö",
    countrySlug: "sweden",
    countryName: "Sweden",
    region: "Northern Europe",
    population: "~0.74M metro",
    intro:
      "Malmö is southern Sweden's metro on the Öresund strait, with tech, design, and cross-border integration with Copenhagen used for relocation comparison.",
    outlook:
      "Use the Malmö profile to compare cost framing, transport access, and country-level context alongside Copenhagen and other Scandinavian metros.",
    scores: { overall: 80, affordability: 70, airQuality: 82, energy: 84, resilience: 80 },
    relatedCitySlugs: ["copenhagen", "stockholm", "gothenburg"],
  }),
  buildNeutralCitySeed({
    slug: "gothenburg",
    name: "Gothenburg",
    countrySlug: "sweden",
    countryName: "Sweden",
    region: "Northern Europe",
    population: "~1.0M metro",
    intro:
      "Gothenburg is Sweden's west-coast port metro with automotive and life-sciences activity, used for cross-region Swedish and Scandinavian comparison.",
    outlook:
      "Use the Gothenburg profile to compare cost framing, transport access, and country-level intelligence alongside Stockholm, Oslo, and other Scandinavian cities.",
    scores: { overall: 80, affordability: 70, airQuality: 82, energy: 84, resilience: 80 },
    relatedCitySlugs: ["stockholm", "oslo", "malmo"],
  }),
  buildNeutralCitySeed({
    slug: "tampere",
    name: "Tampere",
    countrySlug: "finland",
    countryName: "Finland",
    region: "Northern Europe",
    population: "~0.4M metro",
    intro:
      "Tampere is Finland's largest inland metro with a tech and university anchor, used for cross-region Finnish and Nordic relocation comparison.",
    outlook:
      "Use the Tampere profile to compare cost framing, transport access, and country-level context alongside Helsinki and other Nordic mid-size cities.",
    scores: { overall: 80, affordability: 72, airQuality: 84, energy: 80, resilience: 78 },
    relatedCitySlugs: ["helsinki", "stockholm", "tallinn"],
  }),
  buildNeutralCitySeed({
    slug: "brno",
    name: "Brno",
    countrySlug: "czechia",
    countryName: "Czechia",
    region: "Central Europe",
    population: "~0.66M metro",
    intro:
      "Brno is the Czech Republic's second metro in Moravia, with research, software, and life-sciences activity used for cross-region Czech and Central-European comparison.",
    outlook:
      "Use the Brno profile to compare cost framing, transport access, and country-level intelligence alongside Prague and Bratislava.",
    scores: { overall: 76, affordability: 78, airQuality: 74, energy: 72, resilience: 72 },
    relatedCitySlugs: ["prague", "bratislava", "vienna"],
  }),
  buildNeutralCitySeed({
    slug: "lodz",
    name: "Łódź",
    countrySlug: "poland",
    countryName: "Poland",
    region: "Central Europe",
    population: "~1.1M metro",
    intro:
      "Łódź is a central Polish metro with a creative-industries, services, and logistics mix, useful for cross-region Polish relocation comparison.",
    outlook:
      "Use the Łódź profile to compare cost framing, transport access, and country-level intelligence alongside Warsaw, Kraków, and other Polish cities.",
    scores: { overall: 72, affordability: 80, airQuality: 68, energy: 68, resilience: 70 },
    relatedCitySlugs: ["warsaw", "krakow", "poznan"],
  }),
  buildNeutralCitySeed({
    slug: "poznan",
    name: "Poznań",
    countrySlug: "poland",
    countryName: "Poland",
    region: "Central Europe",
    population: "~1.0M metro",
    intro:
      "Poznań is a western Polish metro with services, logistics, and trade-fair activity, used for cross-region Polish and EU comparison.",
    outlook:
      "Use the Poznań profile to compare cost framing, transport access, and country-level context alongside Warsaw, Wrocław, and Berlin.",
    scores: { overall: 74, affordability: 78, airQuality: 70, energy: 70, resilience: 70 },
    relatedCitySlugs: ["warsaw", "wroclaw", "berlin"],
  }),
  buildNeutralCitySeed({
    slug: "cluj-napoca",
    name: "Cluj-Napoca",
    countrySlug: "romania",
    countryName: "Romania",
    region: "Eastern Europe",
    population: "~0.4M metro",
    intro:
      "Cluj-Napoca is Romania's Transylvanian metro, with software services, university, and life-sciences activity used for cross-region Romanian comparison.",
    outlook:
      "Use the Cluj-Napoca profile to compare cost framing, transport access, and country-level intelligence alongside Bucharest and other Central-European mid-size cities.",
    scores: { overall: 74, affordability: 80, airQuality: 72, energy: 70, resilience: 70 },
    relatedCitySlugs: ["bucharest", "budapest", "warsaw"],
  }),
  buildNeutralCitySeed({
    slug: "split",
    name: "Split",
    countrySlug: "croatia",
    countryName: "Croatia",
    region: "Southern Europe",
    population: "~0.35M metro",
    intro:
      "Split is a Croatian Adriatic-coast metro with tourism, services, and active coastal-adaptation work used for Mediterranean comparison.",
    outlook:
      "Use the Split profile to compare cost framing, transport access, and coastal-resilience signals alongside Zagreb, Ljubljana, and other Adriatic cities.",
    scores: { overall: 72, affordability: 76, airQuality: 76, energy: 70, resilience: 68 },
    relatedCitySlugs: ["zagreb", "ljubljana", "naples"],
  }),
  buildNeutralCitySeed({
    slug: "nashville",
    name: "Nashville",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.0M metro",
    intro:
      "Nashville is a Tennessee metro with healthcare, music, and services growth, used for relocation comparison against other Sun Belt US cities.",
    outlook:
      "Use the Nashville profile to compare cost framing, transport access, and country-level intelligence alongside Charlotte, Atlanta, and other Southeast metros.",
    scores: { overall: 74, affordability: 70, airQuality: 72, energy: 70, resilience: 70 },
    relatedCitySlugs: ["atlanta", "charlotte", "austin"],
  }),
  buildNeutralCitySeed({
    slug: "charlotte",
    name: "Charlotte",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.7M metro",
    intro:
      "Charlotte is a North-Carolina financial-services and energy metro, used for relocation comparison across the US Southeast.",
    outlook:
      "Use the Charlotte profile to compare cost framing, transport access, and country-level intelligence alongside Atlanta, Nashville, and other Southeast US metros.",
    scores: { overall: 74, affordability: 70, airQuality: 74, energy: 70, resilience: 70 },
    relatedCitySlugs: ["atlanta", "nashville", "raleigh"],
  }),
  buildNeutralCitySeed({
    slug: "minneapolis",
    name: "Minneapolis",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~3.7M metro",
    intro:
      "Minneapolis is the larger of the Twin Cities and a Midwestern US metro, with healthcare, services, and active cycling infrastructure used in comparison.",
    outlook:
      "Use the Minneapolis profile to compare cost framing, transport access, and country-level context alongside Chicago and other Midwestern US metros.",
    scores: { overall: 76, affordability: 70, airQuality: 78, energy: 74, resilience: 74 },
    relatedCitySlugs: ["chicago", "denver", "boston"],
  }),
  buildNeutralCitySeed({
    slug: "salt-lake-city",
    name: "Salt Lake City",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~1.3M metro",
    intro:
      "Salt Lake City is a Utah metro with services growth and outdoor-recreation context, used for inland-West US relocation comparison.",
    outlook:
      "Use the Salt Lake City profile to compare cost framing, transport access, and country-level intelligence alongside Denver and other Mountain-West US metros.",
    scores: { overall: 74, affordability: 70, airQuality: 68, energy: 72, resilience: 70 },
    relatedCitySlugs: ["denver", "boulder", "portland"],
  }),
  buildNeutralCitySeed({
    slug: "raleigh",
    name: "Raleigh",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~1.5M metro",
    intro:
      "Raleigh is part of the North Carolina Research Triangle, with university, life-sciences, and tech-services activity used in Southeast US comparison.",
    outlook:
      "Use the Raleigh profile to compare cost framing, transport access, and country-level context alongside Charlotte, Atlanta, and other Southeast US metros.",
    scores: { overall: 76, affordability: 72, airQuality: 76, energy: 72, resilience: 72 },
    relatedCitySlugs: ["charlotte", "atlanta", "nashville"],
  }),
  buildNeutralCitySeed({
    slug: "tampa",
    name: "Tampa",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~3.3M metro",
    intro:
      "Tampa is a Florida Gulf Coast metro, with services, healthcare, and active coastal-resilience and hurricane-adaptation work used in regional comparison.",
    outlook:
      "Use the Tampa profile to compare cost framing, transport access, and coastal-resilience signals alongside Miami and other Southeast US coastal metros.",
    scores: { overall: 72, affordability: 70, airQuality: 74, energy: 70, resilience: 62 },
    relatedCitySlugs: ["miami", "orlando", "atlanta"],
  }),
  buildNeutralCitySeed({
    slug: "orlando",
    name: "Orlando",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.7M metro",
    intro:
      "Orlando is a central Florida metro with tourism, simulation, and services activity, used for relocation comparison across Florida.",
    outlook:
      "Use the Orlando profile to compare cost framing, transport access, and country-level intelligence alongside Tampa, Miami, and other Southeast US metros.",
    scores: { overall: 72, affordability: 72, airQuality: 74, energy: 70, resilience: 66 },
    relatedCitySlugs: ["tampa", "miami", "atlanta"],
  }),
  buildNeutralCitySeed({
    slug: "pittsburgh",
    name: "Pittsburgh",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.4M metro",
    intro:
      "Pittsburgh is a Western-Pennsylvania metro with a post-industrial transition into healthcare, robotics, and education, used in Rust-Belt comparison.",
    outlook:
      "Use the Pittsburgh profile to compare cost framing, transport access, and country-level intelligence alongside other Northeast US metros.",
    scores: { overall: 74, affordability: 76, airQuality: 70, energy: 70, resilience: 72 },
    relatedCitySlugs: ["philadelphia", "boston", "chicago"],
  }),
  buildNeutralCitySeed({
    slug: "houston",
    name: "Houston",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~7.3M metro",
    intro:
      "Houston is the largest Texas metro, with energy, healthcare, and aerospace activity, used for Gulf-Coast and energy-sector comparison.",
    outlook:
      "Use the Houston profile to compare cost framing, transport access, and country-level context alongside Dallas, Austin, and other Gulf-Coast metros.",
    scores: { overall: 72, affordability: 70, airQuality: 66, energy: 70, resilience: 60 },
    relatedCitySlugs: ["dallas", "austin", "atlanta"],
  }),
  buildNeutralCitySeed({
    slug: "las-vegas",
    name: "Las Vegas",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.3M metro",
    intro:
      "Las Vegas is a Mojave-desert US metro with tourism, services, and active heat-and-water resilience conversations used in arid-city comparison.",
    outlook:
      "Use the Las Vegas profile to compare cost framing, transport access, and heat-and-water resilience signals alongside Phoenix and other arid-region cities.",
    scores: { overall: 70, affordability: 70, airQuality: 68, energy: 68, resilience: 60 },
    relatedCitySlugs: ["phoenix", "los-angeles", "san-diego"],
  }),
  buildNeutralCitySeed({
    slug: "madison",
    name: "Madison",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~0.68M metro",
    intro:
      "Madison is a Wisconsin university metro with biotech, public-sector, and lake-front character, used for compact-city Midwestern US comparison.",
    outlook:
      "Use the Madison profile to compare cost framing, transport access, and country-level intelligence alongside Minneapolis and other Midwestern US cities.",
    scores: { overall: 76, affordability: 74, airQuality: 80, energy: 72, resilience: 74 },
    relatedCitySlugs: ["minneapolis", "chicago", "boulder"],
  }),
  buildNeutralCitySeed({
    slug: "boulder",
    name: "Boulder",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~0.33M metro",
    intro:
      "Boulder is a Colorado Front-Range university metro with climate-research and outdoor-economy activity, used for inland-West US compact-city comparison.",
    outlook:
      "Use the Boulder profile to compare cost framing, transport access, and country-level context alongside Denver and other Mountain-West US metros.",
    scores: { overall: 76, affordability: 64, airQuality: 76, energy: 74, resilience: 70 },
    relatedCitySlugs: ["denver", "salt-lake-city", "madison"],
  }),
  buildNeutralCitySeed({
    slug: "quebec-city",
    name: "Quebec City",
    countrySlug: "canada",
    countryName: "Canada",
    region: "North America",
    population: "~0.84M metro",
    intro:
      "Quebec City is the French-speaking capital of Québec province in eastern Canada, with public-sector, tourism, and heritage-economy character used in cross-region Canadian comparison.",
    outlook:
      "Use the Quebec City profile to compare cost framing, transport access, and country-level context alongside Montreal and other Canadian metros.",
    scores: { overall: 78, affordability: 76, airQuality: 82, energy: 76, resilience: 76 },
    relatedCitySlugs: ["montreal", "ottawa", "halifax"],
  }),
  buildNeutralCitySeed({
    slug: "edmonton",
    name: "Edmonton",
    countrySlug: "canada",
    countryName: "Canada",
    region: "North America",
    population: "~1.5M metro",
    intro:
      "Edmonton is Alberta's northern metro and provincial capital, with energy, public-sector, and university activity used for cross-region Canadian comparison.",
    outlook:
      "Use the Edmonton profile to compare cost framing, transport access, and country-level context alongside Calgary, Winnipeg, and other Canadian metros.",
    scores: { overall: 74, affordability: 74, airQuality: 78, energy: 70, resilience: 70 },
    relatedCitySlugs: ["calgary", "winnipeg", "saskatoon"],
  }),
  buildNeutralCitySeed({
    slug: "winnipeg",
    name: "Winnipeg",
    countrySlug: "canada",
    countryName: "Canada",
    region: "North America",
    population: "~0.83M metro",
    intro:
      "Winnipeg is Manitoba's prairie metro and provincial capital, with insurance, manufacturing, and culture activity used in cross-region Canadian comparison.",
    outlook:
      "Use the Winnipeg profile to compare cost framing, transport access, and country-level intelligence alongside Edmonton, Saskatoon, and other Canadian metros.",
    scores: { overall: 72, affordability: 78, airQuality: 80, energy: 68, resilience: 68 },
    relatedCitySlugs: ["edmonton", "calgary", "ottawa"],
  }),
  buildNeutralCitySeed({
    slug: "halifax",
    name: "Halifax",
    countrySlug: "canada",
    countryName: "Canada",
    region: "North America",
    population: "~0.49M metro",
    intro:
      "Halifax is the Atlantic-Canadian metro and Nova Scotia capital, with port, defence, and university activity used for Atlantic-coast Canadian comparison.",
    outlook:
      "Use the Halifax profile to compare cost framing, transport access, and coastal-resilience signals alongside other Atlantic-Canadian and US metros.",
    scores: { overall: 75, affordability: 72, airQuality: 82, energy: 70, resilience: 70 },
    relatedCitySlugs: ["ottawa", "quebec-city", "montreal"],
  }),
  buildNeutralCitySeed({
    slug: "newcastle",
    name: "Newcastle",
    countrySlug: "australia",
    countryName: "Australia",
    region: "Oceania",
    population: "~0.5M metro",
    intro:
      "Newcastle is a coastal New South Wales metro north of Sydney, with port, energy-transition, and services activity used for cross-region Australian comparison.",
    outlook:
      "Use the Newcastle profile to compare cost framing, transport access, and coastal-resilience signals alongside Sydney, Wollongong, and other Australian metros.",
    scores: { overall: 76, affordability: 70, airQuality: 80, energy: 74, resilience: 70 },
    relatedCitySlugs: ["sydney", "brisbane", "adelaide"],
  }),
  buildNeutralCitySeed({
    slug: "darwin",
    name: "Darwin",
    countrySlug: "australia",
    countryName: "Australia",
    region: "Oceania",
    population: "~0.15M metro",
    intro:
      "Darwin is a Top-End Australian metro on the Timor Sea, with tropical climate, port, and defence activity used in cross-region Australian and Southeast-Asian comparison.",
    outlook:
      "Use the Darwin profile to compare cost framing, transport access, and tropical-resilience signals alongside other Australian and equatorial-region metros.",
    scores: { overall: 70, affordability: 68, airQuality: 78, energy: 68, resilience: 64 },
    relatedCitySlugs: ["brisbane", "perth", "cairns"],
  }),
  buildNeutralCitySeed({
    slug: "cairns",
    name: "Cairns",
    countrySlug: "australia",
    countryName: "Australia",
    region: "Oceania",
    population: "~0.16M metro",
    intro:
      "Cairns is a tropical north-Queensland metro adjacent to the Great Barrier Reef, with tourism, agriculture, and active cyclone-and-reef-resilience work in regional comparison.",
    outlook:
      "Use the Cairns profile to compare cost framing, transport access, and tropical-resilience signals alongside Darwin, Brisbane, and other Australian metros.",
    scores: { overall: 70, affordability: 70, airQuality: 80, energy: 70, resilience: 64 },
    relatedCitySlugs: ["brisbane", "darwin", "gold-coast"],
  }),
  buildNeutralCitySeed({
    slug: "tauranga",
    name: "Tauranga",
    countrySlug: "new-zealand",
    countryName: "New Zealand",
    region: "Oceania",
    population: "~0.16M metro",
    intro:
      "Tauranga is a Bay-of-Plenty New Zealand metro on the North Island east coast, with port, horticulture, and lifestyle-migration activity used for cross-region NZ comparison.",
    outlook:
      "Use the Tauranga profile to compare cost framing, transport access, and coastal-resilience signals alongside Auckland, Wellington, and other NZ metros.",
    scores: { overall: 75, affordability: 70, airQuality: 82, energy: 72, resilience: 70 },
    relatedCitySlugs: ["auckland", "wellington", "christchurch"],
  }),
  buildNeutralCitySeed({
    slug: "galway",
    name: "Galway",
    countrySlug: "ireland",
    countryName: "Ireland",
    region: "Western Europe",
    population: "~0.27M metro",
    intro:
      "Galway is a western Irish metro on the Atlantic coast, with university, medtech, and creative-industries activity used for cross-region Irish comparison.",
    outlook:
      "Use the Galway profile to compare cost framing, transport access, and country-level context alongside Dublin and Cork.",
    scores: { overall: 74, affordability: 70, airQuality: 80, energy: 72, resilience: 70 },
    relatedCitySlugs: ["dublin", "cork", "belfast"],
  }),

  // Batch three: additional EU, US, and Commonwealth metros.
  // Every record uses `buildNeutralCitySeed` with a hand-written
  // intro/outlook and directional score shape. No invented official
  // metrics, no fake rents, no airport names, no hospital names —
  // verified utility layers attach via the country hub where available,
  // transparent fallback applies otherwise.

  // United Kingdom
  buildNeutralCitySeed({
    slug: "oxford",
    name: "Oxford",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    region: "Western Europe",
    population: "~0.17M metro",
    intro:
      "Oxford is an English university and research metro south of Birmingham, with deep academic and life-sciences activity that shapes daily life and relocation context.",
    outlook:
      "Use the Oxford profile to compare cost framing, transport access, healthcare context, and country-level intelligence alongside other English regional cores.",
    scores: { overall: 76, affordability: 60, airQuality: 78, energy: 72, resilience: 70 },
    relatedCitySlugs: ["london", "cambridge", "bristol"],
  }),
  buildNeutralCitySeed({
    slug: "cambridge",
    name: "Cambridge",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    region: "Western Europe",
    population: "~0.15M metro",
    intro:
      "Cambridge is an English university metro north-east of London, with concentrated research, biotech, and software activity that drives a distinctive housing and labor-market profile.",
    outlook:
      "Use the Cambridge profile to compare cost framing, transport access, and country-level context alongside Oxford and other English research cores.",
    scores: { overall: 77, affordability: 58, airQuality: 78, energy: 72, resilience: 70 },
    relatedCitySlugs: ["oxford", "london", "leeds"],
  }),
  buildNeutralCitySeed({
    slug: "liverpool",
    name: "Liverpool",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    region: "Western Europe",
    population: "~1.6M metro",
    intro:
      "Liverpool is a north-western English port metro with creative-industries, maritime, and higher-education depth, used by users comparing affordable Northern-England relocation options.",
    outlook:
      "Use the Liverpool profile to compare cost framing, transport access, and country-level context alongside Manchester and Leeds.",
    scores: { overall: 71, affordability: 72, airQuality: 75, energy: 70, resilience: 68 },
    relatedCitySlugs: ["manchester", "leeds", "birmingham"],
  }),
  buildNeutralCitySeed({
    slug: "sheffield",
    name: "Sheffield",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    region: "Western Europe",
    population: "~0.6M metro",
    intro:
      "Sheffield is a northern English metro with steel-industry heritage, two large universities, and an outdoor-amenity profile shaped by the Peak District edge.",
    outlook:
      "Use the Sheffield profile to compare cost framing, transport access, and country-level context alongside Leeds and Manchester.",
    scores: { overall: 71, affordability: 73, airQuality: 76, energy: 70, resilience: 68 },
    relatedCitySlugs: ["leeds", "manchester", "nottingham"],
  }),
  buildNeutralCitySeed({
    slug: "brighton",
    name: "Brighton",
    countrySlug: "united-kingdom",
    countryName: "United Kingdom",
    region: "Western Europe",
    population: "~0.29M metro",
    intro:
      "Brighton is an English south-coast metro south of London, with creative-industries activity, university presence, and a distinctive seaside-urban profile.",
    outlook:
      "Use the Brighton profile to compare cost framing, transport access, and country-level context alongside other southern English metros.",
    scores: { overall: 73, affordability: 60, airQuality: 78, energy: 72, resilience: 70 },
    relatedCitySlugs: ["london", "bristol", "oxford"],
  }),

  // France
  buildNeutralCitySeed({
    slug: "montpellier",
    name: "Montpellier",
    countrySlug: "france",
    countryName: "France",
    region: "Southern Europe",
    population: "~0.6M metro",
    intro:
      "Montpellier is a southern French metro inland from the Mediterranean coast, with a young university-driven population and concentrated medical-research activity.",
    outlook:
      "Use the Montpellier profile to compare cost framing, transport access, healthcare context, and heat-adaptation considerations alongside Lyon and Marseille.",
    scores: { overall: 72, affordability: 70, airQuality: 73, energy: 72, resilience: 65 },
    relatedCitySlugs: ["marseille", "lyon", "toulouse"],
  }),
  buildNeutralCitySeed({
    slug: "rennes",
    name: "Rennes",
    countrySlug: "france",
    countryName: "France",
    region: "Western Europe",
    population: "~0.45M metro",
    intro:
      "Rennes is a Breton regional capital in western France, with university, public-services, and digital-industries activity that supports a steady relocation profile.",
    outlook:
      "Use the Rennes profile to compare cost framing, transport access, and country-level context alongside other French regional capitals.",
    scores: { overall: 73, affordability: 72, airQuality: 78, energy: 72, resilience: 72 },
    relatedCitySlugs: ["nantes", "bordeaux", "lyon"],
  }),
  buildNeutralCitySeed({
    slug: "grenoble",
    name: "Grenoble",
    countrySlug: "france",
    countryName: "France",
    region: "Western Europe",
    population: "~0.5M metro",
    intro:
      "Grenoble is an Alpine French metro south-east of Lyon, with university, research-institute, and mountain-amenity context shaping daily life.",
    outlook:
      "Use the Grenoble profile to compare cost framing, transport access, air-quality context, and country-level intelligence alongside Lyon and other Alpine peers.",
    scores: { overall: 72, affordability: 70, airQuality: 65, energy: 72, resilience: 68 },
    relatedCitySlugs: ["lyon", "geneva", "turin"],
  }),
  buildNeutralCitySeed({
    slug: "dijon",
    name: "Dijon",
    countrySlug: "france",
    countryName: "France",
    region: "Western Europe",
    population: "~0.24M metro",
    intro:
      "Dijon is the capital of the Burgundy region in eastern France, with food-economy, university, and rail-connected regional-services activity.",
    outlook:
      "Use the Dijon profile to compare cost framing, transport access, and country-level context alongside other French regional metros.",
    scores: { overall: 71, affordability: 72, airQuality: 76, energy: 72, resilience: 70 },
    relatedCitySlugs: ["lyon", "strasbourg", "reims"],
  }),
  buildNeutralCitySeed({
    slug: "aix-en-provence",
    name: "Aix-en-Provence",
    countrySlug: "france",
    countryName: "France",
    region: "Southern Europe",
    population: "~0.15M metro",
    intro:
      "Aix-en-Provence is a Provençal university metro near Marseille, with academic, cultural, and tourism activity inside a hot Mediterranean climate context.",
    outlook:
      "Use the Aix-en-Provence profile to compare cost framing, transport access, and country-level Mediterranean context alongside Marseille and Nice.",
    scores: { overall: 72, affordability: 65, airQuality: 72, energy: 72, resilience: 65 },
    relatedCitySlugs: ["marseille", "nice", "montpellier"],
  }),

  // Germany
  buildNeutralCitySeed({
    slug: "hanover",
    name: "Hanover",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Central Europe",
    population: "~1.2M metro",
    intro:
      "Hanover is a northern German metro on the Mittelland rail corridor, with trade-fair, machinery-industry, and public-services activity shaping the urban profile.",
    outlook:
      "Use the Hanover profile to compare cost framing, transport access, and country-level context alongside other German regional cores.",
    scores: { overall: 73, affordability: 74, airQuality: 78, energy: 75, resilience: 72 },
    relatedCitySlugs: ["hamburg", "bremen", "berlin"],
  }),
  buildNeutralCitySeed({
    slug: "nuremberg",
    name: "Nuremberg",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Central Europe",
    population: "~3.5M metro",
    intro:
      "Nuremberg is a Bavarian metro north of Munich, with manufacturing, logistics, and university activity, often considered alongside Munich for cost-aware German relocation.",
    outlook:
      "Use the Nuremberg profile to compare cost framing, transport access, and country-level context alongside Munich and Stuttgart.",
    scores: { overall: 74, affordability: 72, airQuality: 78, energy: 74, resilience: 72 },
    relatedCitySlugs: ["munich", "stuttgart", "frankfurt"],
  }),
  buildNeutralCitySeed({
    slug: "bremen",
    name: "Bremen",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Central Europe",
    population: "~1.0M metro",
    intro:
      "Bremen is a northern German port city-state west of Hamburg, with maritime, aerospace, and logistics activity shaping the regional profile.",
    outlook:
      "Use the Bremen profile to compare cost framing, transport access, and country-level context alongside Hamburg and Hanover.",
    scores: { overall: 72, affordability: 74, airQuality: 78, energy: 75, resilience: 72 },
    relatedCitySlugs: ["hamburg", "hanover", "dortmund"],
  }),
  buildNeutralCitySeed({
    slug: "bonn",
    name: "Bonn",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Central Europe",
    population: "~0.33M metro",
    intro:
      "Bonn is a Rhineland metro south of Cologne, with international-organisations, science-policy, and university activity that shapes its services-oriented profile.",
    outlook:
      "Use the Bonn profile to compare cost framing, transport access, and country-level context alongside Cologne and Düsseldorf.",
    scores: { overall: 73, affordability: 72, airQuality: 76, energy: 74, resilience: 72 },
    relatedCitySlugs: ["cologne", "dusseldorf", "frankfurt"],
  }),
  buildNeutralCitySeed({
    slug: "freiburg",
    name: "Freiburg",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Central Europe",
    population: "~0.23M metro",
    intro:
      "Freiburg is a south-western German metro at the edge of the Black Forest, with university, environmental-research, and sustainable-urbanism context shaping daily life.",
    outlook:
      "Use the Freiburg profile to compare cost framing, transport access, energy-transition context, and country-level intelligence alongside other German university metros.",
    scores: { overall: 75, affordability: 70, airQuality: 80, energy: 78, resilience: 74 },
    relatedCitySlugs: ["heidelberg", "stuttgart", "basel"],
  }),
  buildNeutralCitySeed({
    slug: "heidelberg",
    name: "Heidelberg",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Central Europe",
    population: "~0.16M metro",
    intro:
      "Heidelberg is a south-western German university metro on the Neckar river, with research, life-sciences, and tourism activity shaping the urban profile.",
    outlook:
      "Use the Heidelberg profile to compare cost framing, transport access, and country-level context alongside Freiburg and other German university cores.",
    scores: { overall: 75, affordability: 68, airQuality: 78, energy: 75, resilience: 72 },
    relatedCitySlugs: ["freiburg", "stuttgart", "frankfurt"],
  }),
  buildNeutralCitySeed({
    slug: "dortmund",
    name: "Dortmund",
    countrySlug: "germany",
    countryName: "Germany",
    region: "Central Europe",
    population: "~5.1M metro",
    intro:
      "Dortmund is a Ruhr-region metro in western Germany, with logistics, software, and university activity inside a post-industrial economic-transition context.",
    outlook:
      "Use the Dortmund profile to compare cost framing, transport access, and country-level context alongside Essen and other Ruhr metros.",
    scores: { overall: 71, affordability: 75, airQuality: 75, energy: 74, resilience: 70 },
    relatedCitySlugs: ["cologne", "dusseldorf", "frankfurt"],
  }),

  // Spain
  buildNeutralCitySeed({
    slug: "alicante",
    name: "Alicante",
    countrySlug: "spain",
    countryName: "Spain",
    region: "Southern Europe",
    population: "~0.45M metro",
    intro:
      "Alicante is a Mediterranean Spanish metro on the Costa Blanca, with tourism, services, and growing remote-work activity inside a hot, dry climate context.",
    outlook:
      "Use the Alicante profile to compare cost framing, transport access, and country-level Mediterranean context alongside Valencia and Murcia.",
    scores: { overall: 71, affordability: 72, airQuality: 74, energy: 72, resilience: 65 },
    relatedCitySlugs: ["valencia", "murcia", "malaga"],
  }),
  buildNeutralCitySeed({
    slug: "murcia",
    name: "Murcia",
    countrySlug: "spain",
    countryName: "Spain",
    region: "Southern Europe",
    population: "~0.66M metro",
    intro:
      "Murcia is a south-eastern Spanish metro, with agriculture, university, and services activity inside a hot, dry Mediterranean climate context.",
    outlook:
      "Use the Murcia profile to compare cost framing, transport access, and country-level context alongside Alicante and Valencia.",
    scores: { overall: 70, affordability: 74, airQuality: 73, energy: 72, resilience: 65 },
    relatedCitySlugs: ["alicante", "valencia", "granada"],
  }),
  buildNeutralCitySeed({
    slug: "valladolid",
    name: "Valladolid",
    countrySlug: "spain",
    countryName: "Spain",
    region: "Southern Europe",
    population: "~0.4M metro",
    intro:
      "Valladolid is a Castilian regional capital in north-western Spain, with automotive-industry, university, and high-speed-rail activity shaping the urban profile.",
    outlook:
      "Use the Valladolid profile to compare cost framing, transport access, and country-level context alongside Zaragoza and other inland Spanish metros.",
    scores: { overall: 71, affordability: 75, airQuality: 76, energy: 72, resilience: 70 },
    relatedCitySlugs: ["zaragoza", "madrid", "bilbao"],
  }),

  // Portugal
  buildNeutralCitySeed({
    slug: "braga",
    name: "Braga",
    countrySlug: "portugal",
    countryName: "Portugal",
    region: "Southern Europe",
    population: "~0.18M metro",
    intro:
      "Braga is a northern Portuguese metro inland from Porto, with university, software-services, and historical-tourism activity shaping a growing relocation profile.",
    outlook:
      "Use the Braga profile to compare cost framing, transport access, and country-level context alongside Porto and Coimbra.",
    scores: { overall: 72, affordability: 75, airQuality: 76, energy: 72, resilience: 70 },
    relatedCitySlugs: ["porto", "coimbra", "lisbon"],
  }),
  buildNeutralCitySeed({
    slug: "coimbra",
    name: "Coimbra",
    countrySlug: "portugal",
    countryName: "Portugal",
    region: "Southern Europe",
    population: "~0.43M metro",
    intro:
      "Coimbra is a central Portuguese university metro between Lisbon and Porto, with research, healthcare, and academic activity shaping a distinctive urban profile.",
    outlook:
      "Use the Coimbra profile to compare cost framing, transport access, and country-level context alongside Porto and Braga.",
    scores: { overall: 72, affordability: 75, airQuality: 76, energy: 72, resilience: 70 },
    relatedCitySlugs: ["porto", "braga", "lisbon"],
  }),

  // Italy
  buildNeutralCitySeed({
    slug: "pisa",
    name: "Pisa",
    countrySlug: "italy",
    countryName: "Italy",
    region: "Southern Europe",
    population: "~0.2M metro",
    intro:
      "Pisa is a Tuscan metro west of Florence, with university, research-institute, and tourism activity that shapes its compact urban profile.",
    outlook:
      "Use the Pisa profile to compare cost framing, transport access, and country-level context alongside Florence and other Tuscan peers.",
    scores: { overall: 72, affordability: 70, airQuality: 74, energy: 72, resilience: 68 },
    relatedCitySlugs: ["florence", "bologna", "genoa"],
  }),
  buildNeutralCitySeed({
    slug: "bari",
    name: "Bari",
    countrySlug: "italy",
    countryName: "Italy",
    region: "Southern Europe",
    population: "~0.74M metro",
    intro:
      "Bari is a Puglian port metro on the Italian Adriatic coast, with university, services, and logistics activity inside a hot Mediterranean climate context.",
    outlook:
      "Use the Bari profile to compare cost framing, transport access, and country-level context alongside Naples and other southern Italian metros.",
    scores: { overall: 69, affordability: 76, airQuality: 73, energy: 70, resilience: 65 },
    relatedCitySlugs: ["naples", "palermo", "rome"],
  }),
  buildNeutralCitySeed({
    slug: "catania",
    name: "Catania",
    countrySlug: "italy",
    countryName: "Italy",
    region: "Southern Europe",
    population: "~0.77M metro",
    intro:
      "Catania is an eastern Sicilian metro at the base of Mount Etna, with university, agriculture, and tourism activity inside a volcanic-and-hot-climate context.",
    outlook:
      "Use the Catania profile to compare cost framing, transport access, and country-level Mediterranean context alongside Palermo and Bari.",
    scores: { overall: 68, affordability: 77, airQuality: 70, energy: 70, resilience: 62 },
    relatedCitySlugs: ["palermo", "bari", "naples"],
  }),
  buildNeutralCitySeed({
    slug: "padua",
    name: "Padua",
    countrySlug: "italy",
    countryName: "Italy",
    region: "Southern Europe",
    population: "~0.42M metro",
    intro:
      "Padua is a Veneto regional metro west of Venice, with university, healthcare-research, and industrial-district activity shaping a stable urban profile.",
    outlook:
      "Use the Padua profile to compare cost framing, transport access, and country-level context alongside Verona and Venice region peers.",
    scores: { overall: 73, affordability: 70, airQuality: 72, energy: 72, resilience: 70 },
    relatedCitySlugs: ["verona", "bologna", "milan"],
  }),
  buildNeutralCitySeed({
    slug: "bergamo",
    name: "Bergamo",
    countrySlug: "italy",
    countryName: "Italy",
    region: "Southern Europe",
    population: "~0.4M metro",
    intro:
      "Bergamo is a Lombard metro north-east of Milan, with manufacturing, services, and historical-tourism activity shaping the regional profile.",
    outlook:
      "Use the Bergamo profile to compare cost framing, transport access, and country-level context alongside Milan and Verona.",
    scores: { overall: 73, affordability: 70, airQuality: 70, energy: 72, resilience: 70 },
    relatedCitySlugs: ["milan", "verona", "turin"],
  }),

  // Netherlands
  buildNeutralCitySeed({
    slug: "groningen",
    name: "Groningen",
    countrySlug: "netherlands",
    countryName: "Netherlands",
    region: "Western Europe",
    population: "~0.23M metro",
    intro:
      "Groningen is a northern Dutch university metro, with research, healthcare, and energy-transition activity shaping a young, compact urban profile.",
    outlook:
      "Use the Groningen profile to compare cost framing, transport access, and country-level context alongside other Dutch regional cores.",
    scores: { overall: 75, affordability: 68, airQuality: 78, energy: 75, resilience: 74 },
    relatedCitySlugs: ["utrecht", "eindhoven", "amsterdam"],
  }),
  buildNeutralCitySeed({
    slug: "maastricht",
    name: "Maastricht",
    countrySlug: "netherlands",
    countryName: "Netherlands",
    region: "Western Europe",
    population: "~0.12M metro",
    intro:
      "Maastricht is a southern Dutch metro at the German and Belgian borders, with international-university, EU-treaty heritage, and cross-border-services activity.",
    outlook:
      "Use the Maastricht profile to compare cost framing, transport access, and country-level cross-border context alongside Liege and Aachen-area peers.",
    scores: { overall: 74, affordability: 68, airQuality: 75, energy: 74, resilience: 72 },
    relatedCitySlugs: ["eindhoven", "utrecht", "luxembourg-city"],
  }),

  // Belgium
  buildNeutralCitySeed({
    slug: "bruges",
    name: "Bruges",
    countrySlug: "belgium",
    countryName: "Belgium",
    region: "Western Europe",
    population: "~0.12M metro",
    intro:
      "Bruges is a north-western Belgian historic metro near the North Sea coast, with tourism, university-college, and heritage-preservation activity shaping its compact urban profile.",
    outlook:
      "Use the Bruges profile to compare cost framing, transport access, and country-level context alongside Ghent and Antwerp.",
    scores: { overall: 74, affordability: 70, airQuality: 76, energy: 72, resilience: 70 },
    relatedCitySlugs: ["ghent", "antwerp", "brussels"],
  }),
  buildNeutralCitySeed({
    slug: "leuven",
    name: "Leuven",
    countrySlug: "belgium",
    countryName: "Belgium",
    region: "Western Europe",
    population: "~0.1M metro",
    intro:
      "Leuven is a central Belgian university metro east of Brussels, with research, life-sciences, and software activity shaping the urban profile.",
    outlook:
      "Use the Leuven profile to compare cost framing, transport access, and country-level context alongside Brussels and Ghent.",
    scores: { overall: 75, affordability: 70, airQuality: 76, energy: 74, resilience: 72 },
    relatedCitySlugs: ["brussels", "ghent", "antwerp"],
  }),

  // Denmark
  buildNeutralCitySeed({
    slug: "odense",
    name: "Odense",
    countrySlug: "denmark",
    countryName: "Denmark",
    region: "Northern Europe",
    population: "~0.21M metro",
    intro:
      "Odense is a central Danish metro on Funen, with robotics-cluster, university, and steady public-services activity shaping the regional profile.",
    outlook:
      "Use the Odense profile to compare cost framing, transport access, and country-level context alongside Copenhagen and Aarhus.",
    scores: { overall: 76, affordability: 68, airQuality: 80, energy: 80, resilience: 76 },
    relatedCitySlugs: ["copenhagen", "aarhus", "malmo"],
  }),

  // Sweden
  buildNeutralCitySeed({
    slug: "uppsala",
    name: "Uppsala",
    countrySlug: "sweden",
    countryName: "Sweden",
    region: "Northern Europe",
    population: "~0.23M metro",
    intro:
      "Uppsala is a Swedish university metro north of Stockholm, with research, life-sciences, and healthcare activity shaping a stable urban profile.",
    outlook:
      "Use the Uppsala profile to compare cost framing, transport access, and country-level context alongside Stockholm and other Nordic peers.",
    scores: { overall: 76, affordability: 65, airQuality: 80, energy: 80, resilience: 76 },
    relatedCitySlugs: ["stockholm", "gothenburg", "lund"],
  }),
  buildNeutralCitySeed({
    slug: "lund",
    name: "Lund",
    countrySlug: "sweden",
    countryName: "Sweden",
    region: "Northern Europe",
    population: "~0.13M metro",
    intro:
      "Lund is a southern Swedish university metro near Malmö, with research, life-sciences, and tech-services activity that shapes a compact urban profile.",
    outlook:
      "Use the Lund profile to compare cost framing, transport access, and country-level context alongside Malmö and Copenhagen.",
    scores: { overall: 76, affordability: 65, airQuality: 80, energy: 80, resilience: 76 },
    relatedCitySlugs: ["malmo", "copenhagen", "uppsala"],
  }),

  // Finland
  buildNeutralCitySeed({
    slug: "turku",
    name: "Turku",
    countrySlug: "finland",
    countryName: "Finland",
    region: "Northern Europe",
    population: "~0.33M metro",
    intro:
      "Turku is a south-western Finnish metro on the Baltic, with university, maritime, and life-sciences activity shaping a historic regional profile.",
    outlook:
      "Use the Turku profile to compare cost framing, transport access, and country-level context alongside Helsinki and Tampere.",
    scores: { overall: 75, affordability: 68, airQuality: 80, energy: 78, resilience: 74 },
    relatedCitySlugs: ["helsinki", "tampere", "stockholm"],
  }),

  // Czechia
  buildNeutralCitySeed({
    slug: "ostrava",
    name: "Ostrava",
    countrySlug: "czechia",
    countryName: "Czechia",
    region: "Central Europe",
    population: "~0.55M metro",
    intro:
      "Ostrava is an eastern Czech metro near the Polish and Slovak borders, with post-industrial economic-transition, services, and university activity.",
    outlook:
      "Use the Ostrava profile to compare cost framing, transport access, air-quality context, and country-level intelligence alongside Brno and Katowice.",
    scores: { overall: 70, affordability: 76, airQuality: 65, energy: 72, resilience: 68 },
    relatedCitySlugs: ["brno", "prague", "katowice"],
  }),

  // Poland
  buildNeutralCitySeed({
    slug: "katowice",
    name: "Katowice",
    countrySlug: "poland",
    countryName: "Poland",
    region: "Central Europe",
    population: "~2.2M metro",
    intro:
      "Katowice is a Silesian metro in southern Poland, with post-industrial economic-transition, services, and growing software-industry activity inside an urban-agglomeration context.",
    outlook:
      "Use the Katowice profile to compare cost framing, transport access, air-quality context, and country-level intelligence alongside Wrocław and Ostrava.",
    scores: { overall: 70, affordability: 76, airQuality: 64, energy: 70, resilience: 68 },
    relatedCitySlugs: ["wroclaw", "krakow", "ostrava"],
  }),

  // Romania
  buildNeutralCitySeed({
    slug: "brasov",
    name: "Brașov",
    countrySlug: "romania",
    countryName: "Romania",
    region: "Eastern Europe",
    population: "~0.4M metro",
    intro:
      "Brașov is a Transylvanian Romanian metro at the foot of the Carpathians, with university, tourism, and growing services activity shaping the regional profile.",
    outlook:
      "Use the Brașov profile to compare cost framing, transport access, and country-level context alongside Cluj-Napoca and Bucharest.",
    scores: { overall: 70, affordability: 78, airQuality: 72, energy: 70, resilience: 68 },
    relatedCitySlugs: ["cluj-napoca", "bucharest", "sofia"],
  }),

  // Bulgaria
  buildNeutralCitySeed({
    slug: "plovdiv",
    name: "Plovdiv",
    countrySlug: "bulgaria",
    countryName: "Bulgaria",
    region: "Southeastern Europe",
    population: "~0.35M metro",
    intro:
      "Plovdiv is the second city of Bulgaria, with deep historical heritage, university activity, and a growing services and creative-industries profile.",
    outlook:
      "Use the Plovdiv profile to compare cost framing, transport access, and country-level context inside the Balkans and Southeastern Europe.",
    scores: { overall: 68, affordability: 80, airQuality: 68, energy: 68, resilience: 66 },
    relatedCitySlugs: ["sofia", "bucharest", "belgrade"],
  }),

  // United States
  buildNeutralCitySeed({
    slug: "columbus",
    name: "Columbus",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.1M metro",
    intro:
      "Columbus is the Ohio state capital metro, with university, insurance, logistics, and growing tech-services activity shaping a stable Midwestern profile.",
    outlook:
      "Use the Columbus profile to compare cost framing, transport access, and country-level context alongside Indianapolis and Cincinnati.",
    scores: { overall: 72, affordability: 76, airQuality: 74, energy: 70, resilience: 70 },
    relatedCitySlugs: ["indianapolis", "cincinnati", "cleveland"],
  }),
  buildNeutralCitySeed({
    slug: "indianapolis",
    name: "Indianapolis",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.1M metro",
    intro:
      "Indianapolis is the Indiana state capital metro, with logistics, healthcare-systems, and motorsport-industry activity shaping a Midwestern services profile.",
    outlook:
      "Use the Indianapolis profile to compare cost framing, transport access, and country-level context alongside Columbus and Cincinnati.",
    scores: { overall: 71, affordability: 77, airQuality: 73, energy: 68, resilience: 70 },
    relatedCitySlugs: ["columbus", "cincinnati", "louisville"],
  }),
  buildNeutralCitySeed({
    slug: "detroit",
    name: "Detroit",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~4.3M metro",
    intro:
      "Detroit is a Michigan metro on the Canadian border, with automotive-industry depth, ongoing urban-revitalisation, and growing tech-services activity.",
    outlook:
      "Use the Detroit profile to compare cost framing, transport access, and country-level context alongside Cleveland and Pittsburgh.",
    scores: { overall: 68, affordability: 78, airQuality: 70, energy: 68, resilience: 65 },
    relatedCitySlugs: ["cleveland", "pittsburgh", "chicago"],
  }),
  buildNeutralCitySeed({
    slug: "baltimore",
    name: "Baltimore",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.8M metro",
    intro:
      "Baltimore is a US Mid-Atlantic port metro north of Washington DC, with university, healthcare-systems, and federal-services activity shaping the regional profile.",
    outlook:
      "Use the Baltimore profile to compare cost framing, transport access, and country-level context alongside Washington DC and Philadelphia.",
    scores: { overall: 70, affordability: 72, airQuality: 72, energy: 68, resilience: 65 },
    relatedCitySlugs: ["washington-dc", "philadelphia", "pittsburgh"],
  }),
  buildNeutralCitySeed({
    slug: "st-louis",
    name: "St. Louis",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.8M metro",
    intro:
      "St. Louis is a Missouri metro on the Mississippi River, with biotech, logistics, and university activity shaping a Midwestern services profile.",
    outlook:
      "Use the St. Louis profile to compare cost framing, transport access, and country-level context alongside Kansas City and Indianapolis.",
    scores: { overall: 70, affordability: 78, airQuality: 72, energy: 68, resilience: 68 },
    relatedCitySlugs: ["kansas-city", "indianapolis", "memphis"],
  }),
  buildNeutralCitySeed({
    slug: "kansas-city",
    name: "Kansas City",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.2M metro",
    intro:
      "Kansas City is a cross-state metro on the Missouri-Kansas border, with logistics, agriculture-tech, and engineering-services activity shaping a Midwestern profile.",
    outlook:
      "Use the Kansas City profile to compare cost framing, transport access, and country-level context alongside St. Louis and Omaha-area peers.",
    scores: { overall: 71, affordability: 78, airQuality: 74, energy: 68, resilience: 70 },
    relatedCitySlugs: ["st-louis", "indianapolis", "denver"],
  }),
  buildNeutralCitySeed({
    slug: "san-antonio",
    name: "San Antonio",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.6M metro",
    intro:
      "San Antonio is a south-central Texas metro south of Austin, with healthcare, military, and university activity inside a hot, semi-arid climate context.",
    outlook:
      "Use the San Antonio profile to compare cost framing, transport access, and country-level Texas context alongside Austin and Houston.",
    scores: { overall: 71, affordability: 77, airQuality: 73, energy: 68, resilience: 65 },
    relatedCitySlugs: ["austin", "houston", "dallas"],
  }),
  buildNeutralCitySeed({
    slug: "sacramento",
    name: "Sacramento",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.4M metro",
    intro:
      "Sacramento is the California state capital metro north-east of San Francisco, with government, healthcare-systems, and agriculture-tech activity shaping the profile.",
    outlook:
      "Use the Sacramento profile to compare cost framing, transport access, and country-level California context alongside San Francisco and San Diego.",
    scores: { overall: 71, affordability: 70, airQuality: 70, energy: 70, resilience: 65 },
    relatedCitySlugs: ["san-francisco", "san-diego", "portland"],
  }),
  buildNeutralCitySeed({
    slug: "milwaukee",
    name: "Milwaukee",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~1.6M metro",
    intro:
      "Milwaukee is a Wisconsin metro on Lake Michigan north of Chicago, with manufacturing, university, and Great-Lakes-services activity shaping the regional profile.",
    outlook:
      "Use the Milwaukee profile to compare cost framing, transport access, and country-level context alongside Chicago and Minneapolis.",
    scores: { overall: 70, affordability: 76, airQuality: 74, energy: 68, resilience: 68 },
    relatedCitySlugs: ["chicago", "minneapolis", "madison"],
  }),
  buildNeutralCitySeed({
    slug: "cincinnati",
    name: "Cincinnati",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.3M metro",
    intro:
      "Cincinnati is a south-western Ohio metro on the Kentucky border, with consumer-products, healthcare, and logistics activity shaping a Midwestern profile.",
    outlook:
      "Use the Cincinnati profile to compare cost framing, transport access, and country-level context alongside Columbus and Indianapolis.",
    scores: { overall: 71, affordability: 77, airQuality: 73, energy: 68, resilience: 70 },
    relatedCitySlugs: ["columbus", "indianapolis", "louisville"],
  }),
  buildNeutralCitySeed({
    slug: "cleveland",
    name: "Cleveland",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~2.1M metro",
    intro:
      "Cleveland is a north-eastern Ohio metro on Lake Erie, with healthcare-systems, manufacturing, and university activity shaping the post-industrial profile.",
    outlook:
      "Use the Cleveland profile to compare cost framing, transport access, and country-level context alongside Detroit and Pittsburgh.",
    scores: { overall: 69, affordability: 78, airQuality: 73, energy: 68, resilience: 68 },
    relatedCitySlugs: ["detroit", "pittsburgh", "columbus"],
  }),
  buildNeutralCitySeed({
    slug: "memphis",
    name: "Memphis",
    countrySlug: "united-states",
    countryName: "United States",
    region: "North America",
    population: "~1.3M metro",
    intro:
      "Memphis is a south-western Tennessee metro on the Mississippi River, with logistics, music-industry, and healthcare activity shaping a regional services profile.",
    outlook:
      "Use the Memphis profile to compare cost framing, transport access, and country-level context alongside Nashville and St. Louis.",
    scores: { overall: 68, affordability: 78, airQuality: 72, energy: 68, resilience: 65 },
    relatedCitySlugs: ["nashville", "st-louis", "atlanta"],
  }),

  // Canada
  buildNeutralCitySeed({
    slug: "victoria",
    name: "Victoria",
    countrySlug: "canada",
    countryName: "Canada",
    region: "North America",
    population: "~0.4M metro",
    intro:
      "Victoria is the British Columbia provincial capital metro on Vancouver Island, with government, tourism, and marine-research activity shaping a Pacific-coast profile.",
    outlook:
      "Use the Victoria profile to compare cost framing, transport access, and country-level context alongside Vancouver and Seattle.",
    scores: { overall: 75, affordability: 65, airQuality: 82, energy: 76, resilience: 72 },
    relatedCitySlugs: ["vancouver", "seattle", "portland"],
  }),
  buildNeutralCitySeed({
    slug: "saskatoon",
    name: "Saskatoon",
    countrySlug: "canada",
    countryName: "Canada",
    region: "North America",
    population: "~0.32M metro",
    intro:
      "Saskatoon is a Prairie Canadian metro in central Saskatchewan, with university, agriculture-research, and resource-services activity shaping the regional profile.",
    outlook:
      "Use the Saskatoon profile to compare cost framing, transport access, and country-level Canadian Prairie context alongside Edmonton and Winnipeg.",
    scores: { overall: 71, affordability: 74, airQuality: 80, energy: 70, resilience: 70 },
    relatedCitySlugs: ["edmonton", "winnipeg", "calgary"],
  }),
  buildNeutralCitySeed({
    slug: "waterloo-ontario",
    name: "Waterloo",
    countrySlug: "canada",
    countryName: "Canada",
    region: "North America",
    population: "~0.58M metro",
    intro:
      "Waterloo is a south-western Ontario metro west of Toronto, with university, software-engineering, and insurance-services activity shaping a tech-cluster profile.",
    outlook:
      "Use the Waterloo profile to compare cost framing, transport access, and country-level context alongside Toronto and Ottawa.",
    scores: { overall: 74, affordability: 72, airQuality: 78, energy: 72, resilience: 72 },
    relatedCitySlugs: ["toronto", "ottawa", "montreal"],
  }),
  buildNeutralCitySeed({
    slug: "kelowna",
    name: "Kelowna",
    countrySlug: "canada",
    countryName: "Canada",
    region: "North America",
    population: "~0.22M metro",
    intro:
      "Kelowna is an interior British Columbia metro in the Okanagan Valley, with tourism, agriculture, and growing services activity shaping a temperate-interior profile.",
    outlook:
      "Use the Kelowna profile to compare cost framing, transport access, and country-level context alongside Vancouver and Victoria.",
    scores: { overall: 72, affordability: 68, airQuality: 75, energy: 72, resilience: 65 },
    relatedCitySlugs: ["vancouver", "victoria", "calgary"],
  }),

  // Australia
  buildNeutralCitySeed({
    slug: "wollongong",
    name: "Wollongong",
    countrySlug: "australia",
    countryName: "Australia",
    region: "Oceania",
    population: "~0.31M metro",
    intro:
      "Wollongong is a New South Wales coastal metro south of Sydney, with university, steel-industry, and Pacific-coastline activity shaping the regional profile.",
    outlook:
      "Use the Wollongong profile to compare cost framing, transport access, and country-level context alongside Sydney and Newcastle.",
    scores: { overall: 72, affordability: 68, airQuality: 78, energy: 72, resilience: 68 },
    relatedCitySlugs: ["sydney", "newcastle", "canberra"],
  }),
  buildNeutralCitySeed({
    slug: "geelong",
    name: "Geelong",
    countrySlug: "australia",
    countryName: "Australia",
    region: "Oceania",
    population: "~0.29M metro",
    intro:
      "Geelong is a Victorian metro south-west of Melbourne, with manufacturing-transition, services, and coastal-Bay activity shaping the regional profile.",
    outlook:
      "Use the Geelong profile to compare cost framing, transport access, and country-level context alongside Melbourne and Ballarat-region peers.",
    scores: { overall: 72, affordability: 70, airQuality: 78, energy: 72, resilience: 68 },
    relatedCitySlugs: ["melbourne", "adelaide", "hobart"],
  }),
  buildNeutralCitySeed({
    slug: "sunshine-coast",
    name: "Sunshine Coast",
    countrySlug: "australia",
    countryName: "Australia",
    region: "Oceania",
    population: "~0.36M metro",
    intro:
      "Sunshine Coast is a south-eastern Queensland coastal metro north of Brisbane, with tourism, healthcare, and Pacific-coastline activity shaping the regional profile.",
    outlook:
      "Use the Sunshine Coast profile to compare cost framing, transport access, and country-level Queensland context alongside Brisbane and Gold Coast.",
    scores: { overall: 73, affordability: 68, airQuality: 80, energy: 72, resilience: 65 },
    relatedCitySlugs: ["brisbane", "gold-coast", "cairns"],
  }),

  // New Zealand
  buildNeutralCitySeed({
    slug: "queenstown",
    name: "Queenstown",
    countrySlug: "new-zealand",
    countryName: "New Zealand",
    region: "Oceania",
    population: "~0.05M metro",
    intro:
      "Queenstown is a South Island New Zealand alpine-lakeside metro, with tourism, outdoor-recreation, and services-cluster activity shaping a small but high-amenity profile.",
    outlook:
      "Use the Queenstown profile to compare cost framing, transport access, and country-level context alongside Auckland and Christchurch.",
    scores: { overall: 73, affordability: 58, airQuality: 82, energy: 72, resilience: 68 },
    relatedCitySlugs: ["christchurch", "auckland", "wellington"],
  }),
  buildNeutralCitySeed({
    slug: "napier",
    name: "Napier",
    countrySlug: "new-zealand",
    countryName: "New Zealand",
    region: "Oceania",
    population: "~0.07M metro",
    intro:
      "Napier is a North Island New Zealand coastal metro in Hawke's Bay, with agriculture, wine-industry, and Art-Deco heritage activity shaping the regional profile.",
    outlook:
      "Use the Napier profile to compare cost framing, transport access, and country-level context alongside Wellington and Auckland.",
    scores: { overall: 72, affordability: 70, airQuality: 80, energy: 72, resilience: 65 },
    relatedCitySlugs: ["wellington", "auckland", "tauranga"],
  }),

  // South Africa
  buildNeutralCitySeed({
    slug: "pretoria",
    name: "Pretoria",
    countrySlug: "south-africa",
    countryName: "South Africa",
    region: "Africa",
    population: "~2.5M metro",
    intro:
      "Pretoria is one of South Africa's administrative capitals, north of Johannesburg, with government, university, and embassy-services activity shaping the regional profile.",
    outlook:
      "Use the Pretoria profile to compare cost framing, transport access, and country-level context alongside Johannesburg and Cape Town.",
    scores: { overall: 65, affordability: 75, airQuality: 70, energy: 60, resilience: 60 },
    relatedCitySlugs: ["johannesburg", "cape-town", "durban"],
  }),
  buildNeutralCitySeed({
    slug: "stellenbosch",
    name: "Stellenbosch",
    countrySlug: "south-africa",
    countryName: "South Africa",
    region: "Africa",
    population: "~0.16M metro",
    intro:
      "Stellenbosch is a Western Cape South African metro east of Cape Town, with university, wine-industry, and innovation-cluster activity shaping the regional profile.",
    outlook:
      "Use the Stellenbosch profile to compare cost framing, transport access, and country-level Cape context alongside Cape Town.",
    scores: { overall: 68, affordability: 72, airQuality: 76, energy: 62, resilience: 62 },
    relatedCitySlugs: ["cape-town", "johannesburg", "durban"],
  }),

  // India
  buildNeutralCitySeed({
    slug: "chennai",
    name: "Chennai",
    countrySlug: "india",
    countryName: "India",
    region: "South Asia",
    population: "~11M metro",
    intro:
      "Chennai is a southern Indian Tamil-Nadu metro on the Bay of Bengal, with automotive, software-services, and healthcare-systems activity shaping a large regional profile.",
    outlook:
      "Use the Chennai profile to compare cost framing, transport access, and country-level South-India context alongside Bangalore and Hyderabad.",
    scores: { overall: 65, affordability: 78, airQuality: 60, energy: 62, resilience: 58 },
    relatedCitySlugs: ["bangalore", "hyderabad", "mumbai"],
  }),
  buildNeutralCitySeed({
    slug: "hyderabad",
    name: "Hyderabad",
    countrySlug: "india",
    countryName: "India",
    region: "South Asia",
    population: "~10M metro",
    intro:
      "Hyderabad is a south-central Indian Telangana metro, with software-services, pharmaceuticals, and biotechnology-cluster activity shaping the regional profile.",
    outlook:
      "Use the Hyderabad profile to compare cost framing, transport access, and country-level context alongside Bangalore and Chennai.",
    scores: { overall: 65, affordability: 78, airQuality: 60, energy: 62, resilience: 58 },
    relatedCitySlugs: ["bangalore", "chennai", "pune"],
  }),
  buildNeutralCitySeed({
    slug: "pune",
    name: "Pune",
    countrySlug: "india",
    countryName: "India",
    region: "South Asia",
    population: "~7M metro",
    intro:
      "Pune is a western Indian Maharashtra metro south-east of Mumbai, with university, software-services, and automotive-cluster activity shaping the regional profile.",
    outlook:
      "Use the Pune profile to compare cost framing, transport access, and country-level context alongside Mumbai and Bangalore.",
    scores: { overall: 66, affordability: 76, airQuality: 60, energy: 62, resilience: 58 },
    relatedCitySlugs: ["mumbai", "bangalore", "hyderabad"],
  }),
  buildNeutralCitySeed({
    slug: "jaipur",
    name: "Jaipur",
    countrySlug: "india",
    countryName: "India",
    region: "South Asia",
    population: "~4M metro",
    intro:
      "Jaipur is the Rajasthan state capital in northern India, with tourism, handicrafts-industry, and services-cluster activity inside a hot, semi-arid climate context.",
    outlook:
      "Use the Jaipur profile to compare cost framing, transport access, and country-level North-India context alongside Delhi and Mumbai.",
    scores: { overall: 63, affordability: 80, airQuality: 55, energy: 60, resilience: 55 },
    relatedCitySlugs: ["delhi", "mumbai", "hyderabad"],
  }),
];

export const cities: City[] = seeds.map(buildCity);
