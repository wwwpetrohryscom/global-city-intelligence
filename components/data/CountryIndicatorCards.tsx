import { Card } from "@/components/ui/Card";
import { DataVerificationBadge } from "@/components/data/DataVerificationBadge";
import {
  COUNTRY_INDICATOR_GROUPS,
  COUNTRY_INDICATOR_INTERPRETATIONS,
} from "@/lib/data/official/country-indicators/types";
import type { CountryIndicatorKey, CountryIndicatorRecord } from "@/types";

function formatNumber(value: number): string {
  if (Number.isInteger(value)) {
    return value.toLocaleString("en-US");
  }
  // Two decimal places strikes a balance between precision and scan-ability
  // while preserving the source value in the underlying record.
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
}

function formatValueLong(value: number): string {
  // Used for very large integer values like population.
  if (!Number.isFinite(value)) {
    return "—";
  }
  return value.toLocaleString("en-US");
}

function isLargeInteger(value: number): boolean {
  return Number.isInteger(value) && Math.abs(value) >= 1_000_000;
}

function renderCard(indicator: CountryIndicatorRecord) {
  const valueText =
    indicator.value === undefined
      ? "—"
      : isLargeInteger(indicator.value)
        ? formatValueLong(indicator.value)
        : formatNumber(indicator.value);
  const interpretation =
    COUNTRY_INDICATOR_INTERPRETATIONS[indicator.indicatorKey];

  return (
    <Card as="article" className="flex h-full flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          {indicator.label}
        </p>
        <DataVerificationBadge status={indicator.verificationStatus} />
      </div>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="break-words text-2xl font-semibold leading-tight text-text-primary">
          {valueText}
        </span>
        {indicator.unit ? (
          <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            {indicator.unit}
          </span>
        ) : null}
      </div>
      {interpretation ? (
        <p className="text-xs leading-5 text-text-secondary">
          {interpretation}
        </p>
      ) : null}
      <p className="mt-auto text-xs leading-5 text-text-muted">
        Data year {indicator.dataYear}
        {" "}
        <span aria-hidden="true">/</span> updated {indicator.lastUpdated}
      </p>
    </Card>
  );
}

interface CountryIndicatorCardsProps {
  indicators: CountryIndicatorRecord[];
  /**
   * When `true`, the cards are organised under the canonical
   * `COUNTRY_INDICATOR_GROUPS` headings. Indicators that do not
   * belong to any group are appended in a fallback "Additional
   * indicators" section so nothing is lost.
   */
  grouped?: boolean;
}

export function CountryIndicatorCards({
  indicators,
  grouped = false,
}: CountryIndicatorCardsProps) {
  if (indicators.length === 0) {
    return null;
  }

  if (!grouped) {
    return (
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {indicators.map((indicator) => (
          <li key={`${indicator.countrySlug}-${indicator.indicatorKey}`}>
            {renderCard(indicator)}
          </li>
        ))}
      </ul>
    );
  }

  const byKey = new Map<CountryIndicatorKey, CountryIndicatorRecord>();
  for (const indicator of indicators) {
    byKey.set(indicator.indicatorKey, indicator);
  }

  const orderedKeys: CountryIndicatorKey[] = [];
  const sections = COUNTRY_INDICATOR_GROUPS.map((group) => {
    const items = group.indicatorKeys
      .map((key) => {
        const record = byKey.get(key);
        if (record) {
          orderedKeys.push(key);
        }
        return record;
      })
      .filter((entry): entry is CountryIndicatorRecord => Boolean(entry));
    return { group, items };
  }).filter((entry) => entry.items.length > 0);

  const ungrouped = indicators.filter(
    (indicator) => !orderedKeys.includes(indicator.indicatorKey),
  );

  return (
    <div className="space-y-6">
      {sections.map(({ group, items }) => (
        <section
          aria-labelledby={`indicator-group-${group.key}`}
          key={group.key}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3
              className="text-sm font-semibold uppercase tracking-wide text-brand-600"
              id={`indicator-group-${group.key}`}
            >
              {group.label}
            </h3>
            <p className="max-w-2xl text-xs leading-5 text-text-secondary">
              {group.description}
            </p>
          </div>
          <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((indicator) => (
              <li key={`${indicator.countrySlug}-${indicator.indicatorKey}`}>
                {renderCard(indicator)}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {ungrouped.length > 0 ? (
        <section aria-labelledby="indicator-group-additional">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3
              className="text-sm font-semibold uppercase tracking-wide text-brand-600"
              id="indicator-group-additional"
            >
              Additional indicators
            </h3>
            <p className="max-w-2xl text-xs leading-5 text-text-secondary">
              Other source-attributed indicators that do not belong to the
              groups above.
            </p>
          </div>
          <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ungrouped.map((indicator) => (
              <li key={`${indicator.countrySlug}-${indicator.indicatorKey}`}>
                {renderCard(indicator)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
