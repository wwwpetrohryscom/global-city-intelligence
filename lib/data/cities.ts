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
];

export const cities: City[] = seeds.map(buildCity);
