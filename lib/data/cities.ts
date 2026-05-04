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
];

export const cities: City[] = seeds.map(buildCity);
