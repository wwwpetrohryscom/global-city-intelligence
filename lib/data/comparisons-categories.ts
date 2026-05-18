import {
  getAirQualityProfileForCity,
  getCityMobilityProfile,
  getCountryEmergencyProfile,
  getCountryHealthcareProfile,
  getCountryTransportProfile,
} from "@/lib/data/queries";
import type {
  AirQualityCityProfile,
  City,
  ComparisonCategory,
  Country,
  ModuleSlug,
} from "@/types";

const FALLBACK = "Verified city-level data unavailable; directional indicator.";

const moduleOrder: { slug: ModuleSlug; label: string; interpretation: string }[] = [
  {
    slug: "cost-of-living",
    label: "Cost of living",
    interpretation:
      "Weighs essential spending, mobility patterns, and service access alongside headline prices.",
  },
  {
    slug: "air-quality",
    label: "Air quality",
    interpretation:
      "Prioritises health, weighting fine particulates and other pollutants against WHO guidance.",
  },
  {
    slug: "energy",
    label: "Energy",
    interpretation:
      "Combines resource context, infrastructure maturity, and transition planning capacity.",
  },
  {
    slug: "safety",
    label: "Safety",
    interpretation:
      "Blends violent-crime context, resident perception, and institutional response capacity.",
  },
  {
    slug: "internet-speed",
    label: "Internet speed",
    interpretation:
      "Weighs fixed broadband, mobile network performance, and digital-readiness context.",
  },
  {
    slug: "climate-risk",
    label: "Climate risk",
    interpretation:
      "Combines hazard exposure with adaptation capacity rather than exposure alone.",
  },
];

function cityModuleSummary(city: City, slug: ModuleSlug): string {
  const moduleData = city.modules[slug];
  return moduleData?.summary ?? FALLBACK;
}

function cityModuleScore(city: City, slug: ModuleSlug): string {
  const moduleData = city.modules[slug];
  if (!moduleData) {
    return FALLBACK;
  }
  return `Directional score ${moduleData.score}/100. ${moduleData.summary}`;
}

function emergencyRow(countryA: Country | undefined, countryB: Country | undefined): ComparisonCategory {
  const profileA = countryA ? getCountryEmergencyProfile(countryA.slug) : undefined;
  const profileB = countryB ? getCountryEmergencyProfile(countryB.slug) : undefined;

  const describe = (
    country: Country | undefined,
    profile: ReturnType<typeof getCountryEmergencyProfile>,
  ) => {
    if (!country) {
      return FALLBACK;
    }
    if (!profile || profile.verificationStatus !== "verified") {
      return `${country.name}: no verified national emergency profile on file yet; use official local services and confirm current numbers.`;
    }
    const numbers = [
      profile.universalNumber?.value,
      profile.police?.value,
      profile.ambulance?.value,
      profile.fire?.value,
    ]
      .filter(Boolean)
      .join(" / ");
    return `${country.name}: verified contacts include ${numbers}.`;
  };

  return {
    key: "emergency",
    label: "Emergency contacts",
    summary:
      "Verified emergency contact numbers attributed to official emergency-service or government publishers, with fallback where no verified data exists.",
    cityANote: describe(countryA, profileA),
    cityBNote: describe(countryB, profileB),
    interpretation:
      "Numbers change by region; always rely on local official services in an active emergency.",
  };
}

function healthcareRow(countryA: Country | undefined, countryB: Country | undefined): ComparisonCategory {
  const profileA = countryA ? getCountryHealthcareProfile(countryA.slug) : undefined;
  const profileB = countryB ? getCountryHealthcareProfile(countryB.slug) : undefined;

  const describe = (
    country: Country | undefined,
    profile: ReturnType<typeof getCountryHealthcareProfile>,
  ) => {
    if (!country) {
      return FALLBACK;
    }
    if (!profile || profile.verificationStatus !== "verified") {
      return `${country.name}: no verified national healthcare profile on file yet; confirm current access through official sources.`;
    }
    return `${country.name}: ${profile.healthcareSystemName ?? "verified national healthcare information available"}.`;
  };

  return {
    key: "healthcare",
    label: "Healthcare access",
    summary:
      "National healthcare and public-health context attributed to official ministries and recognised national health-service publishers.",
    cityANote: describe(countryA, profileA),
    cityBNote: describe(countryB, profileB),
    interpretation:
      "Informational only; coverage and access vary by region, status, and visa category.",
  };
}

function transportRow(
  cityA: City | undefined,
  cityB: City | undefined,
  countryA: Country | undefined,
  countryB: Country | undefined,
): ComparisonCategory {
  const cityProfileA = cityA ? getCityMobilityProfile(cityA.slug) : undefined;
  const cityProfileB = cityB ? getCityMobilityProfile(cityB.slug) : undefined;
  const countryProfileA = countryA ? getCountryTransportProfile(countryA.slug) : undefined;
  const countryProfileB = countryB ? getCountryTransportProfile(countryB.slug) : undefined;

  const describe = (
    city: City | undefined,
    cityProfile: ReturnType<typeof getCityMobilityProfile>,
    countryProfile: ReturnType<typeof getCountryTransportProfile>,
  ) => {
    if (!city) {
      return FALLBACK;
    }
    if (cityProfile?.verificationStatus === "verified") {
      const authority =
        cityProfile.publicTransportAuthority?.label ??
        cityProfile.metroOrRailOperator?.label;
      if (authority) {
        return `${city.name}: verified city authority — ${authority}.`;
      }
    }
    if (countryProfile?.verificationStatus === "verified") {
      return `${city.name}: national-level transport context verified for ${countryProfile.nationalTransportAuthority?.label ?? "the country"}; city-level data is not yet verified.`;
    }
    return `${city.name}: no verified transport profile on file yet; check official authorities for current information.`;
  };

  return {
    key: "transport",
    label: "Transport and mobility",
    summary:
      "Public transport authorities and operators attributed to official sources, with fallback where city-level data is not yet verified.",
    cityANote: describe(cityA, cityProfileA, countryProfileA),
    cityBNote: describe(cityB, cityProfileB, countryProfileB),
    interpretation:
      "Routes, fares, schedules, and disruptions change frequently — confirm with the linked authorities for current details.",
  };
}

function countryContextRow(countryA: Country | undefined, countryB: Country | undefined): ComparisonCategory {
  return {
    key: "country-context",
    label: "Country context",
    summary:
      "National-level summary from the country intelligence profile, providing context behind city indicators.",
    cityANote: countryA?.intro ?? FALLBACK,
    cityBNote: countryB?.intro ?? FALLBACK,
    interpretation:
      "Use this to interpret structured indicators against national institutions, climate, and policy direction.",
  };
}

export function buildComparisonCategories({
  cityA,
  cityB,
  countryA,
  countryB,
}: {
  cityA: City;
  cityB: City;
  countryA?: Country;
  countryB?: Country;
}): ComparisonCategory[] {
  const airQualityProfileA = getAirQualityProfileForCity(cityA.slug);
  const airQualityProfileB = getAirQualityProfileForCity(cityB.slug);

  const moduleCategories: ComparisonCategory[] = moduleOrder.map(
    ({ slug, label, interpretation }) => {
      if (slug === "air-quality") {
        return airQualityCategoryRow({
          cityA,
          cityB,
          profileA: airQualityProfileA,
          profileB: airQualityProfileB,
          interpretation,
          label,
        });
      }
      return {
        key: slug,
        label,
        summary: cityA.modules[slug]?.summary ?? cityModuleSummary(cityA, slug),
        cityANote: cityModuleScore(cityA, slug),
        cityBNote: cityModuleScore(cityB, slug),
        interpretation,
        sourceIds: cityA.modules[slug]?.sources ?? [],
      };
    },
  );

  return [
    ...moduleCategories,
    healthcareRow(countryA, countryB),
    transportRow(cityA, cityB, countryA, countryB),
    emergencyRow(countryA, countryB),
    countryContextRow(countryA, countryB),
  ];
}

function describeAirQuality(
  city: City,
  profile: AirQualityCityProfile | undefined,
): string {
  if (!profile || profile.verificationStatus !== "verified") {
    return `${city.name}: verified city-level air-quality measurements unavailable; structured air-quality module context is shown instead.`;
  }
  const numericMetrics = profile.metrics.filter(
    (metric) => metric.value !== undefined,
  );
  if (numericMetrics.length === 0) {
    return `${city.name}: verified air-quality dataset is available; see the city profile for source-attributed values.`;
  }
  const summary = numericMetrics
    .map((metric) => {
      const unit = metric.unit ? ` ${metric.unit}` : "";
      return `${metric.label} ${metric.value}${unit}`;
    })
    .join("; ");
  return `${city.name}: ${summary}.`;
}

function airQualityCategoryRow({
  cityA,
  cityB,
  profileA,
  profileB,
  interpretation,
  label,
}: {
  cityA: City;
  cityB: City;
  profileA: AirQualityCityProfile | undefined;
  profileB: AirQualityCityProfile | undefined;
  interpretation: string;
  label: string;
}): ComparisonCategory {
  const anyVerified =
    profileA?.verificationStatus === "verified" ||
    profileB?.verificationStatus === "verified";

  const summary = anyVerified
    ? "Compares air quality using source-attributed measurements where the platform has integrated verified datasets; structured module context elsewhere."
    : (cityA.modules["air-quality"]?.summary ??
        "Structured air-quality module context; verified dataset measurements are not yet integrated for either city.");

  const sourceIdsFromProfiles = [
    ...(profileA?.sourceIds ?? []),
    ...(profileB?.sourceIds ?? []),
  ];
  const sourceIds =
    sourceIdsFromProfiles.length > 0
      ? Array.from(new Set(sourceIdsFromProfiles))
      : (cityA.modules["air-quality"]?.sources ?? []);

  return {
    key: "air-quality",
    label,
    summary,
    cityANote: describeAirQuality(cityA, profileA),
    cityBNote: describeAirQuality(cityB, profileB),
    interpretation,
    sourceIds,
  };
}
