import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import type { City } from "@/types";

export const cities: City[] = [
  {
    slug: "copenhagen",
    name: "Copenhagen",
    countrySlug: "denmark",
    countryName: "Denmark",
    region: "Northern Europe",
    population: "1.4M metro",
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    intro:
      "Copenhagen combines high public-service quality, strong cycling infrastructure, and mature clean-energy policy into one of the healthiest urban profiles in the index.",
    outlook:
      "The city is best explored as a climate-forward, high-trust urban system where higher costs are balanced by safety, mobility, and environmental quality.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: {
      overall: 91,
      affordability: 66,
      airQuality: 88,
      energy: 94,
      resilience: 92,
    },
    metrics: [
      {
        label: "Overall city intelligence",
        value: "91",
        unit: "/100",
        score: 91,
        description:
          "Composite score across affordability, air quality, clean energy, and resilience.",
      },
      {
        label: "Mobility confidence",
        value: "Very high",
        description:
          "Compact form and cycling-oriented design reduce household transport dependency.",
      },
      {
        label: "Climate readiness",
        value: "Advanced",
        description:
          "Policy continuity and district energy systems support long-run transition capacity.",
      },
    ],
    modules: {
      "cost-of-living": {
        moduleSlug: "cost-of-living",
        score: 66,
        summary:
          "Copenhagen is expensive in rent and services, but strong public infrastructure reduces some hidden mobility and health costs.",
        dataYear: DATA_YEAR,
        lastUpdated: LAST_UPDATED,
        sources: ["un-habitat", "ipcc-urban"],
        metrics: [
          {
            label: "Affordability score",
            value: "66",
            unit: "/100",
            score: 66,
            description:
              "Moderate affordability after balancing high prices against public-service quality.",
          },
          {
            label: "Housing pressure",
            value: "High",
            description:
              "Central demand and limited supply create pressure for new residents.",
          },
          {
            label: "Transport cost offset",
            value: "Strong",
            description:
              "Cycling and public transport reduce dependence on private vehicle ownership.",
          },
        ],
        table: [
          {
            metric: "Affordability score",
            value: "66 / 100",
            context: "Useful but constrained by housing and services costs.",
          },
          {
            metric: "Housing pressure",
            value: "High",
            context: "Central neighborhoods remain competitive for renters.",
          },
          {
            metric: "Everyday mobility",
            value: "Low friction",
            context: "Bike and transit access can reduce recurring household costs.",
          },
        ],
        explanation:
          "The cost-of-living model treats affordability as more than price. It weighs essential spending, mobility dependence, service access, and the stability of daily life.",
      },
      "air-quality": {
        moduleSlug: "air-quality",
        score: 88,
        summary:
          "Copenhagen performs well on clean-air context, helped by compact mobility, regional monitoring, and strong European air-quality governance.",
        dataYear: DATA_YEAR,
        lastUpdated: LAST_UPDATED,
        sources: ["who-air", "eea-air"],
        metrics: [
          {
            label: "Clean-air score",
            value: "88",
            unit: "/100",
            score: 88,
            description:
              "High score relative to health-oriented pollutant benchmarks.",
          },
          {
            label: "Main exposure concern",
            value: "Regional PM2.5",
            description:
              "Fine particulates remain the core health benchmark to monitor.",
          },
          {
            label: "Policy context",
            value: "Strong",
            description:
              "European standards and monitoring support transparent improvement.",
          },
        ],
        table: [
          {
            metric: "Clean-air score",
            value: "88 / 100",
            context: "Strong performance against health-oriented benchmarks.",
          },
          {
            metric: "Primary pollutant watch",
            value: "PM2.5",
            context: "Fine particles are weighted because of long-term health evidence.",
          },
          {
            metric: "Monitoring confidence",
            value: "High",
            context: "European monitoring context improves comparability.",
          },
        ],
        explanation:
          "Air-quality scoring prioritizes human health. PM2.5, PM10, nitrogen dioxide, and ozone are interpreted against WHO guidance and regional monitoring context.",
      },
      energy: {
        moduleSlug: "energy",
        score: 94,
        summary:
          "Copenhagen has a mature energy-transition profile, with district energy experience and strong climate-adaptation planning.",
        dataYear: DATA_YEAR,
        lastUpdated: LAST_UPDATED,
        sources: ["nasa-power", "ipcc-urban", "un-habitat"],
        metrics: [
          {
            label: "Energy readiness",
            value: "94",
            unit: "/100",
            score: 94,
            description:
              "Very strong transition score across policy, infrastructure, and resilience context.",
          },
          {
            label: "Grid adaptation",
            value: "Advanced",
            description:
              "District systems and planning capacity reduce transition friction.",
          },
          {
            label: "Solar resource",
            value: "Moderate",
            description:
              "Solar potential is useful but not the only driver of the energy score.",
          },
        ],
        table: [
          {
            metric: "Energy readiness",
            value: "94 / 100",
            context: "Transition planning and infrastructure depth are major strengths.",
          },
          {
            metric: "Adaptation capacity",
            value: "Advanced",
            context: "Climate planning and infrastructure governance improve resilience.",
          },
          {
            metric: "Renewable opportunity",
            value: "Balanced",
            context: "Solar is moderate; district energy and wind context matter.",
          },
        ],
        explanation:
          "Energy pages combine renewable-resource context, infrastructure maturity, and adaptation capacity. Solar potential is useful, but resilience and implementation capacity carry more weight.",
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
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    intro:
      "New York is a dense global city with exceptional opportunity, high housing pressure, improving climate planning, and strong cultural and economic depth.",
    outlook:
      "The city is most useful for users comparing opportunity against cost, commute intensity, air-quality exposure, and infrastructure resilience.",
    sources: ["un-habitat", "who-air", "nasa-power", "epa-naaqs", "ipcc-urban"],
    scores: {
      overall: 84,
      affordability: 49,
      airQuality: 72,
      energy: 82,
      resilience: 87,
    },
    metrics: [
      {
        label: "Overall city intelligence",
        value: "84",
        unit: "/100",
        score: 84,
        description:
          "High opportunity and resilience offset by affordability pressure.",
      },
      {
        label: "Opportunity density",
        value: "Exceptional",
        description:
          "Deep labor markets, universities, healthcare, culture, and transit networks create unusually broad opportunity.",
      },
      {
        label: "Cost pressure",
        value: "Very high",
        description:
          "Housing and essential services are the main drag on resident well-being.",
      },
    ],
    modules: {
      "cost-of-living": {
        moduleSlug: "cost-of-living",
        score: 49,
        summary:
          "New York offers exceptional access to work and services, but housing costs place heavy pressure on household resilience.",
        dataYear: DATA_YEAR,
        lastUpdated: LAST_UPDATED,
        sources: ["un-habitat", "ipcc-urban"],
        metrics: [
          {
            label: "Affordability score",
            value: "49",
            unit: "/100",
            score: 49,
            description:
              "Lower score because housing demand and services costs are structurally high.",
          },
          {
            label: "Housing pressure",
            value: "Very high",
            description:
              "Rent and ownership constraints dominate the resident cost profile.",
          },
          {
            label: "Opportunity offset",
            value: "High",
            description:
              "Income potential and public transit partially offset higher costs.",
          },
        ],
        table: [
          {
            metric: "Affordability score",
            value: "49 / 100",
            context: "High wages help, but housing costs dominate the model.",
          },
          {
            metric: "Housing pressure",
            value: "Very high",
            context: "Demand is persistent across central and transit-rich neighborhoods.",
          },
          {
            metric: "Public-service offset",
            value: "Moderate",
            context: "Transit reach can reduce vehicle dependence for many households.",
          },
        ],
        explanation:
          "The model penalizes cities where essential housing costs can overwhelm the benefits of access. New York still scores well on opportunity, but the affordability risk is real.",
      },
      "air-quality": {
        moduleSlug: "air-quality",
        score: 72,
        summary:
          "New York has extensive monitoring and policy capacity, but particulate and ozone exposure remain important health signals.",
        dataYear: DATA_YEAR,
        lastUpdated: LAST_UPDATED,
        sources: ["who-air", "epa-naaqs"],
        metrics: [
          {
            label: "Clean-air score",
            value: "72",
            unit: "/100",
            score: 72,
            description:
              "Moderate-to-strong score with ongoing pollutant exposure concerns.",
          },
          {
            label: "Main exposure concern",
            value: "PM2.5 and ozone",
            description:
              "Fine particulate matter and ozone are weighted for health relevance.",
          },
          {
            label: "Monitoring confidence",
            value: "High",
            description:
              "US regulatory monitoring improves trend visibility and accountability.",
          },
        ],
        table: [
          {
            metric: "Clean-air score",
            value: "72 / 100",
            context: "Better than many large metros, but not low-risk.",
          },
          {
            metric: "Primary pollutant watch",
            value: "PM2.5, ozone",
            context: "Health-based benchmarks keep these pollutants central.",
          },
          {
            metric: "Monitoring confidence",
            value: "High",
            context: "EPA standards and reporting create a strong evidence base.",
          },
        ],
        explanation:
          "Air-quality scoring prioritizes exposure that can affect respiratory and cardiovascular health. High monitoring confidence does not automatically mean low exposure.",
      },
      energy: {
        moduleSlug: "energy",
        score: 82,
        summary:
          "New York has serious clean-energy ambition and infrastructure complexity, with resilience shaped by coastal risk and dense demand.",
        dataYear: DATA_YEAR,
        lastUpdated: LAST_UPDATED,
        sources: ["nasa-power", "ipcc-urban", "un-habitat"],
        metrics: [
          {
            label: "Energy readiness",
            value: "82",
            unit: "/100",
            score: 82,
            description:
              "Strong planning context with major grid and building-retrofit challenges.",
          },
          {
            label: "Demand complexity",
            value: "Very high",
            description:
              "Dense buildings, peak demand, and electrification needs make implementation difficult.",
          },
          {
            label: "Resilience pressure",
            value: "Coastal",
            description:
              "Flooding, heat, and storm exposure are central adaptation signals.",
          },
        ],
        table: [
          {
            metric: "Energy readiness",
            value: "82 / 100",
            context: "Policy capacity is strong, but infrastructure complexity is high.",
          },
          {
            metric: "Climate stressor",
            value: "Coastal flooding and heat",
            context: "Resilience is inseparable from energy planning.",
          },
          {
            metric: "Solar opportunity",
            value: "Useful",
            context: "Rooftop and distributed energy help but do not solve peak demand alone.",
          },
        ],
        explanation:
          "The energy score treats climate adaptation, grid capacity, and building efficiency as connected. Dense cities can transition quickly, but only with coordinated infrastructure work.",
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
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    intro:
      "Tokyo is a high-capacity megacity with outstanding transit, deep services, and strong adaptation discipline, balanced against climate and housing constraints.",
    outlook:
      "Tokyo is strongest where density, reliability, and day-to-day service access matter more than low costs or large private space.",
    sources: ["un-habitat", "who-air", "nasa-power", "ipcc-urban"],
    scores: {
      overall: 89,
      affordability: 68,
      airQuality: 78,
      energy: 84,
      resilience: 93,
    },
    metrics: [
      {
        label: "Overall city intelligence",
        value: "89",
        unit: "/100",
        score: 89,
        description:
          "Very strong resilience, services, mobility, and urban operating capacity.",
      },
      {
        label: "Transit reliability",
        value: "Exceptional",
        description:
          "Rail access reduces mobility friction across the metropolitan region.",
      },
      {
        label: "Adaptation discipline",
        value: "Advanced",
        description:
          "Earthquake, flood, and heat planning are central to the urban operating model.",
      },
    ],
    modules: {
      "cost-of-living": {
        moduleSlug: "cost-of-living",
        score: 68,
        summary:
          "Tokyo is not cheap, but transit access, service density, and varied housing formats improve practical affordability.",
        dataYear: DATA_YEAR,
        lastUpdated: LAST_UPDATED,
        sources: ["un-habitat", "ipcc-urban"],
        metrics: [
          {
            label: "Affordability score",
            value: "68",
            unit: "/100",
            score: 68,
            description:
              "Balanced score reflecting high quality of access and moderate household tradeoffs.",
          },
          {
            label: "Housing pressure",
            value: "Moderate",
            description:
              "Space is constrained, but housing variety improves options.",
          },
          {
            label: "Transport cost offset",
            value: "Very strong",
            description:
              "Rail access can reduce the need for private vehicle expenses.",
          },
        ],
        table: [
          {
            metric: "Affordability score",
            value: "68 / 100",
            context: "Strong access offsets some rent and space limitations.",
          },
          {
            metric: "Housing pressure",
            value: "Moderate",
            context: "Small units and location tradeoffs are common.",
          },
          {
            metric: "Mobility cost offset",
            value: "Very strong",
            context: "Transit reach supports car-light daily life.",
          },
        ],
        explanation:
          "Tokyo demonstrates why affordability is not only a price index. Transit reliability and service density lower many everyday frictions.",
      },
      "air-quality": {
        moduleSlug: "air-quality",
        score: 78,
        summary:
          "Tokyo's air profile benefits from strong governance but still requires attention to fine particles, ozone, and heat-related exposure.",
        dataYear: DATA_YEAR,
        lastUpdated: LAST_UPDATED,
        sources: ["who-air"],
        metrics: [
          {
            label: "Clean-air score",
            value: "78",
            unit: "/100",
            score: 78,
            description:
              "Solid air-quality score for a megacity, with health benchmarks still relevant.",
          },
          {
            label: "Main exposure concern",
            value: "PM2.5 and ozone",
            description:
              "Dense urban activity keeps fine particles and ozone in the model.",
          },
          {
            label: "Exposure modifier",
            value: "Heat",
            description:
              "Heat can amplify health risk and should be read alongside pollutant levels.",
          },
        ],
        table: [
          {
            metric: "Clean-air score",
            value: "78 / 100",
            context: "Strong for scale, but health-guideline pressure remains.",
          },
          {
            metric: "Primary pollutant watch",
            value: "PM2.5, ozone",
            context: "Important for long-term exposure and hot-season risk.",
          },
          {
            metric: "Monitoring confidence",
            value: "Good",
            context: "The model assumes strong urban monitoring context.",
          },
        ],
        explanation:
          "The air-quality model gives large dense cities credit for governance while still penalizing exposure patterns that matter for health.",
      },
      energy: {
        moduleSlug: "energy",
        score: 84,
        summary:
          "Tokyo has strong engineering capacity and resilience discipline, but energy transition is constrained by dense demand and climate stress.",
        dataYear: DATA_YEAR,
        lastUpdated: LAST_UPDATED,
        sources: ["nasa-power", "ipcc-urban"],
        metrics: [
          {
            label: "Energy readiness",
            value: "84",
            unit: "/100",
            score: 84,
            description:
              "High readiness through infrastructure capacity and adaptation discipline.",
          },
          {
            label: "Demand complexity",
            value: "Very high",
            description:
              "Megacity scale creates demanding electrification and cooling needs.",
          },
          {
            label: "Solar opportunity",
            value: "Moderate",
            description:
              "Distributed solar can help but is constrained by dense land use.",
          },
        ],
        table: [
          {
            metric: "Energy readiness",
            value: "84 / 100",
            context: "Governance and engineering capacity are major strengths.",
          },
          {
            metric: "Climate stressor",
            value: "Heat and storms",
            context: "Adaptation and cooling demand shape energy resilience.",
          },
          {
            metric: "Renewable opportunity",
            value: "Moderate",
            context: "Urban form constrains some distributed generation.",
          },
        ],
        explanation:
          "Tokyo's energy score rewards implementation capacity while recognizing that megacity cooling, resilience, and land constraints make transition planning complex.",
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
    dataYear: DATA_YEAR,
    lastUpdated: LAST_UPDATED,
    intro:
      "Paris is a dense, transit-rich European capital with strong cultural access, ambitious street redesign, and continuing affordability and air-quality challenges.",
    outlook:
      "Paris is most interesting as a case study in converting legacy urban form into healthier, lower-emission daily life.",
    sources: ["un-habitat", "who-air", "nasa-power", "eea-air", "ipcc-urban"],
    scores: {
      overall: 86,
      affordability: 55,
      airQuality: 76,
      energy: 86,
      resilience: 88,
    },
    metrics: [
      {
        label: "Overall city intelligence",
        value: "86",
        unit: "/100",
        score: 86,
        description:
          "Strong access, culture, transit, and climate direction with affordability pressure.",
      },
      {
        label: "Street transformation",
        value: "Advanced",
        description:
          "Public-space and mobility reforms improve the health profile over time.",
      },
      {
        label: "Housing pressure",
        value: "High",
        description:
          "Central-city demand remains the main resident well-being constraint.",
      },
    ],
    modules: {
      "cost-of-living": {
        moduleSlug: "cost-of-living",
        score: 55,
        summary:
          "Paris has high housing pressure, but compact mobility and public amenities reduce some day-to-day costs.",
        dataYear: DATA_YEAR,
        lastUpdated: LAST_UPDATED,
        sources: ["un-habitat", "ipcc-urban"],
        metrics: [
          {
            label: "Affordability score",
            value: "55",
            unit: "/100",
            score: 55,
            description:
              "Moderate-low affordability because housing pressure is persistent.",
          },
          {
            label: "Housing pressure",
            value: "High",
            description:
              "Demand for central access drives rent and space constraints.",
          },
          {
            label: "Amenity offset",
            value: "Strong",
            description:
              "Transit, public space, and cultural access improve practical value.",
          },
        ],
        table: [
          {
            metric: "Affordability score",
            value: "55 / 100",
            context: "Strong access, but housing pressure reduces the score.",
          },
          {
            metric: "Housing pressure",
            value: "High",
            context: "Central and well-connected areas stay competitive.",
          },
          {
            metric: "Daily amenity offset",
            value: "Strong",
            context: "Walkability and transit reduce some private costs.",
          },
        ],
        explanation:
          "Paris shows the tradeoff between high-demand central living and strong public amenity value. The model gives credit for access but does not ignore rent pressure.",
      },
      "air-quality": {
        moduleSlug: "air-quality",
        score: 76,
        summary:
          "Paris benefits from European monitoring and mobility reform, while PM2.5, nitrogen dioxide, and ozone remain key health signals.",
        dataYear: DATA_YEAR,
        lastUpdated: LAST_UPDATED,
        sources: ["who-air", "eea-air"],
        metrics: [
          {
            label: "Clean-air score",
            value: "76",
            unit: "/100",
            score: 76,
            description:
              "Improving profile with continued exposure pressure from traffic and regional conditions.",
          },
          {
            label: "Main exposure concern",
            value: "PM2.5, NO2, ozone",
            description:
              "Traffic-related and regional pollutants remain health-relevant.",
          },
          {
            label: "Policy context",
            value: "Improving",
            description:
              "Street redesign and European air-quality rules support progress.",
          },
        ],
        table: [
          {
            metric: "Clean-air score",
            value: "76 / 100",
            context: "Improving, but not yet low-exposure.",
          },
          {
            metric: "Primary pollutant watch",
            value: "PM2.5, NO2, ozone",
            context: "A mix of traffic and regional air-quality pressures.",
          },
          {
            metric: "Policy momentum",
            value: "Strong",
            context: "Mobility redesign can improve long-run exposure.",
          },
        ],
        explanation:
          "The air-quality page treats policy momentum as useful context, but the score remains grounded in pollutant exposure and health-based benchmarks.",
      },
      energy: {
        moduleSlug: "energy",
        score: 86,
        summary:
          "Paris has strong energy-transition direction, with building retrofits and heat adaptation central to its readiness profile.",
        dataYear: DATA_YEAR,
        lastUpdated: LAST_UPDATED,
        sources: ["nasa-power", "ipcc-urban", "un-habitat"],
        metrics: [
          {
            label: "Energy readiness",
            value: "86",
            unit: "/100",
            score: 86,
            description:
              "Strong policy and building-efficiency direction support the transition score.",
          },
          {
            label: "Retrofit need",
            value: "High",
            description:
              "Older building stock makes efficiency upgrades a major lever.",
          },
          {
            label: "Climate stressor",
            value: "Urban heat",
            description:
              "Heat adaptation is a major quality-of-life and energy-demand issue.",
          },
        ],
        table: [
          {
            metric: "Energy readiness",
            value: "86 / 100",
            context: "Policy ambition and retrofit focus support the score.",
          },
          {
            metric: "Primary transition lever",
            value: "Building efficiency",
            context: "Retrofits can reduce emissions and improve comfort.",
          },
          {
            metric: "Climate stressor",
            value: "Heat",
            context: "Summer heat increases adaptation and cooling importance.",
          },
        ],
        explanation:
          "Paris energy readiness depends on existing buildings, clean heat, and heat adaptation. The model rewards cities that connect emissions cuts to resident comfort.",
      },
    },
  },
];
