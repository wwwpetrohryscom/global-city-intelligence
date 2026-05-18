import { Card } from "@/components/ui/Card";
import { DataVerificationBadge } from "@/components/data/DataVerificationBadge";
import type { CountryIndicatorRecord } from "@/types";

function formatValue(indicator: CountryIndicatorRecord): string {
  if (indicator.value === undefined) {
    return "—";
  }
  const formatted = indicator.value.toLocaleString("en-US");
  return indicator.unit ? `${formatted} ${indicator.unit}` : formatted;
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
      {indicators.map((indicator) => (
        <li key={`${indicator.countrySlug}-${indicator.indicatorKey}`}>
          <Card as="article" className="h-full">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {indicator.label}
              </p>
              <DataVerificationBadge status={indicator.verificationStatus} />
            </div>
            <p className="mt-2 text-2xl font-semibold text-text-primary">
              {formatValue(indicator)}
            </p>
            <p className="mt-2 text-xs leading-5 text-text-muted">
              Data year {indicator.dataYear} / updated {indicator.lastUpdated}
            </p>
            {indicator.notes ? (
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {indicator.notes}
              </p>
            ) : null}
          </Card>
        </li>
      ))}
    </ul>
  );
}
