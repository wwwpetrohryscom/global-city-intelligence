import { Card } from "@/components/ui/Card";
import { DataVerificationBadge } from "@/components/data/DataVerificationBadge";
import type { CountryIndicatorRecord } from "@/types";

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

export function CountryIndicatorCards({
  indicators,
}: {
  indicators: CountryIndicatorRecord[];
}) {
  if (indicators.length === 0) {
    return null;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {indicators.map((indicator) => {
        const valueText =
          indicator.value === undefined
            ? "—"
            : isLargeInteger(indicator.value)
              ? formatValueLong(indicator.value)
              : formatNumber(indicator.value);

        return (
          <li key={`${indicator.countrySlug}-${indicator.indicatorKey}`}>
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
              <p className="mt-auto text-xs leading-5 text-text-muted">
                Data year {indicator.dataYear}
                {" "}
                <span aria-hidden="true">/</span> updated{" "}
                {indicator.lastUpdated}
              </p>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
