"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";

export interface CalculatorCityOption {
  slug: string;
  name: string;
  countryName: string;
  url: string;
}

interface CategoryConfig {
  key: CategoryKey;
  label: string;
  helper: string;
}

type CategoryKey =
  | "housing"
  | "food"
  | "transport"
  | "utilities"
  | "internet"
  | "healthcare"
  | "lifestyle";

const CATEGORIES: readonly CategoryConfig[] = [
  {
    key: "housing",
    label: "Housing",
    helper: "Rent, mortgage payment, or housing-equivalent costs.",
  },
  {
    key: "food",
    label: "Food",
    helper: "Groceries plus the share of meals you eat outside.",
  },
  {
    key: "transport",
    label: "Transport",
    helper: "Transit, fuel, ride-hail, or car-running costs combined.",
  },
  {
    key: "utilities",
    label: "Utilities",
    helper: "Electricity, water, heating, and waste.",
  },
  {
    key: "internet",
    label: "Internet / mobile",
    helper: "Home internet plus mobile plan.",
  },
  {
    key: "healthcare",
    label: "Healthcare / insurance",
    helper: "Insurance premium and recurring out-of-pocket costs.",
  },
  {
    key: "lifestyle",
    label: "Lifestyle / discretionary",
    helper: "Subscriptions, leisure, fitness, savings outside the categories above.",
  },
];

type CategoryValues = Record<CategoryKey, string>;

const DEFAULT_VALUES: CategoryValues = {
  housing: "1500",
  food: "450",
  transport: "150",
  utilities: "120",
  internet: "60",
  healthcare: "200",
  lifestyle: "300",
};

const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "CHF", "CAD", "AUD", "JPY", "SGD"] as const;
type CurrencyOption = (typeof CURRENCY_OPTIONS)[number];

function parseNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return 0;
  }
  const parsed = Number(trimmed.replace(/,/g, ""));
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
}

function formatCurrency(value: number, currency: CurrencyOption): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSignedCurrency(value: number, currency: CurrencyOption): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatCurrency(Math.abs(value), currency)}`;
}

interface CalculatorProps {
  cities: CalculatorCityOption[];
  comparisonByPair: Record<string, string>;
  comparePath: string;
  methodologyPath: string;
}

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("::");
}

export function CostOfLivingCalculator({
  cities,
  comparisonByPair,
  comparePath,
  methodologyPath,
}: CalculatorProps) {
  const headingId = useId();
  const summaryId = useId();
  const [currency, setCurrency] = useState<CurrencyOption>("USD");
  const [householdSize, setHouseholdSize] = useState<string>("1");
  const [currentCity, setCurrentCity] = useState<string>(cities[0]?.slug ?? "");
  const [targetCity, setTargetCity] = useState<string>(
    cities[1]?.slug ?? cities[0]?.slug ?? "",
  );
  const [currentValues, setCurrentValues] = useState<CategoryValues>(DEFAULT_VALUES);
  const [targetValues, setTargetValues] = useState<CategoryValues>(DEFAULT_VALUES);

  const currentTotal = useMemo(
    () =>
      CATEGORIES.reduce(
        (sum, category) => sum + parseNumber(currentValues[category.key]),
        0,
      ),
    [currentValues],
  );
  const targetTotal = useMemo(
    () =>
      CATEGORIES.reduce(
        (sum, category) => sum + parseNumber(targetValues[category.key]),
        0,
      ),
    [targetValues],
  );
  const monthlyDifference = targetTotal - currentTotal;
  const annualDifference = monthlyDifference * 12;

  const currentCityData = useMemo(
    () => cities.find((entry) => entry.slug === currentCity),
    [cities, currentCity],
  );
  const targetCityData = useMemo(
    () => cities.find((entry) => entry.slug === targetCity),
    [cities, targetCity],
  );

  const comparisonSlug =
    currentCity && targetCity && currentCity !== targetCity
      ? comparisonByPair[pairKey(currentCity, targetCity)]
      : undefined;

  const copyCurrentToTarget = () => {
    setTargetValues({ ...currentValues });
  };

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary" id={headingId}>
            Compare your monthly budget
          </h2>
          <p className="mt-2 max-w-[58ch] text-sm leading-6 text-text-secondary">
            Planning estimate based on the numbers you enter. Not an official
            cost-of-living measurement.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Currency
            </span>
            <select
              className="rounded-lg border border-neutral-border bg-white px-3 py-2 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
              onChange={(event) => setCurrency(event.target.value as CurrencyOption)}
              value={currency}
            >
              {CURRENCY_OPTIONS.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Household size
            </span>
            <input
              className="w-24 rounded-lg border border-neutral-border bg-white px-3 py-2 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
              inputMode="numeric"
              min={1}
              onChange={(event) => setHouseholdSize(event.target.value)}
              type="number"
              value={householdSize}
            />
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <CityColumn
          cities={cities}
          eyebrow="Current city"
          onCityChange={setCurrentCity}
          onValueChange={(key, value) =>
            setCurrentValues((previous) => ({ ...previous, [key]: value }))
          }
          selectedCity={currentCity}
          values={currentValues}
        />
        <CityColumn
          cities={cities}
          eyebrow="Target city"
          onCityChange={setTargetCity}
          onValueChange={(key, value) =>
            setTargetValues((previous) => ({ ...previous, [key]: value }))
          }
          selectedCity={targetCity}
          values={targetValues}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <button
          className="inline-flex items-center rounded-full border border-neutral-border bg-surface-soft px-4 py-1.5 font-medium text-text-secondary transition hover:border-brand-400 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
          onClick={copyCurrentToTarget}
          type="button"
        >
          Copy current budget to target
        </button>
        <p className="text-xs text-text-muted">
          Adjust the target column to test how a different budget would
          change your monthly total.
        </p>
      </div>

      <div
        aria-live="polite"
        className="mt-8 rounded-2xl border border-neutral-border bg-surface-soft p-5"
        id={summaryId}
      >
        <h3 className="text-base font-semibold text-text-primary">
          Planning estimate
        </h3>
        <p className="mt-1 text-xs text-text-muted">
          Household size {parseNumber(householdSize) || 1}. Directional
          comparison — not an official cost-of-living measurement.
        </p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <SummaryStat
            label={`Current monthly (${currentCityData?.name ?? "current city"})`}
            value={formatCurrency(currentTotal, currency)}
          />
          <SummaryStat
            label={`Target monthly (${targetCityData?.name ?? "target city"})`}
            value={formatCurrency(targetTotal, currency)}
          />
          <SummaryStat
            accent
            label="Monthly difference"
            value={formatSignedCurrency(monthlyDifference, currency)}
          />
        </dl>
        <p className="mt-4 text-sm text-text-secondary">
          Annualised difference: {" "}
          <span className="font-semibold text-text-primary">
            {formatSignedCurrency(annualDifference, currency)}
          </span>
          {monthlyDifference === 0 ? (
            <span> — the two budgets match.</span>
          ) : monthlyDifference > 0 ? (
            <span>
              {" "}
              — the target budget is higher than the current budget by this
              amount, based on the values you entered.
            </span>
          ) : (
            <span>
              {" "}
              — the target budget is lower than the current budget by this
              amount, based on the values you entered.
            </span>
          )}
        </p>

        <CategoryShareTable
          currency={currency}
          currentTotal={currentTotal}
          currentValues={currentValues}
          targetTotal={targetTotal}
          targetValues={targetValues}
        />

        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          {currentCityData ? (
            <Link
              className="inline-flex items-center rounded-full border border-neutral-border bg-white px-3 py-1.5 font-medium text-text-secondary hover:border-brand-400 hover:text-text-primary"
              href={currentCityData.url}
            >
              Current city profile: {currentCityData.name}
            </Link>
          ) : null}
          {targetCityData && targetCity !== currentCity ? (
            <Link
              className="inline-flex items-center rounded-full border border-neutral-border bg-white px-3 py-1.5 font-medium text-text-secondary hover:border-brand-400 hover:text-text-primary"
              href={targetCityData.url}
            >
              Target city profile: {targetCityData.name}
            </Link>
          ) : null}
          {comparisonSlug ? (
            <Link
              className="inline-flex items-center rounded-full border border-brand-500 bg-orange-50 px-3 py-1.5 font-medium text-text-primary hover:bg-orange-100"
              href={`/compare/${comparisonSlug}`}
            >
              View structured comparison
            </Link>
          ) : (
            <Link
              className="inline-flex items-center rounded-full border border-neutral-border bg-white px-3 py-1.5 font-medium text-text-secondary hover:border-brand-400 hover:text-text-primary"
              href={comparePath}
            >
              Browse all comparisons
            </Link>
          )}
          <Link
            className="inline-flex items-center rounded-full border border-neutral-border bg-white px-3 py-1.5 font-medium text-text-secondary hover:border-brand-400 hover:text-text-primary"
            href={methodologyPath}
          >
            Read methodology
          </Link>
        </div>
      </div>
    </section>
  );
}

function SummaryStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border bg-white p-4",
        accent ? "border-brand-500" : "border-neutral-border",
      ].join(" ")}
    >
      <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {label}
      </dt>
      <dd
        className={[
          "mt-1 text-xl font-semibold",
          accent ? "text-text-primary" : "text-text-primary",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}

function CityColumn({
  eyebrow,
  cities,
  selectedCity,
  values,
  onCityChange,
  onValueChange,
}: {
  eyebrow: string;
  cities: CalculatorCityOption[];
  selectedCity: string;
  values: CategoryValues;
  onCityChange: (slug: string) => void;
  onValueChange: (key: CategoryKey, value: string) => void;
}) {
  const cityFieldId = useId();

  return (
    <div className="rounded-xl border border-neutral-border bg-surface-soft p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
        {eyebrow}
      </p>
      <label
        className="mt-2 flex flex-col gap-1 text-sm"
        htmlFor={cityFieldId}
      >
        <span className="font-semibold text-text-primary">City</span>
        <select
          className="rounded-lg border border-neutral-border bg-white px-3 py-2 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
          id={cityFieldId}
          onChange={(event) => onCityChange(event.target.value)}
          value={selectedCity}
        >
          {cities.map((city) => (
            <option key={city.slug} value={city.slug}>
              {city.name} — {city.countryName}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4 grid gap-3">
        {CATEGORIES.map((category) => (
          <BudgetInput
            helper={category.helper}
            key={category.key}
            label={category.label}
            onChange={(value) => onValueChange(category.key, value)}
            value={values[category.key]}
          />
        ))}
      </div>
    </div>
  );
}

function BudgetInput({
  label,
  helper,
  value,
  onChange,
}: {
  label: string;
  helper: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputId = useId();

  return (
    <label className="flex flex-col gap-1 text-sm" htmlFor={inputId}>
      <span className="font-semibold text-text-primary">{label}</span>
      <span className="text-xs leading-5 text-text-muted">{helper}</span>
      <input
        className="rounded-lg border border-neutral-border bg-white px-3 py-2 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
        id={inputId}
        inputMode="decimal"
        min={0}
        onChange={(event) => onChange(event.target.value)}
        type="number"
        value={value}
      />
    </label>
  );
}

function CategoryShareTable({
  currentValues,
  targetValues,
  currentTotal,
  targetTotal,
  currency,
}: {
  currentValues: CategoryValues;
  targetValues: CategoryValues;
  currentTotal: number;
  targetTotal: number;
  currency: CurrencyOption;
}) {
  return (
    <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-border bg-white">
      <table className="min-w-full text-left text-sm">
        <caption className="sr-only">
          Category breakdown of your entered budget for current and target city
        </caption>
        <thead className="bg-neutral-soft text-text-primary">
          <tr>
            <th
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Category
            </th>
            <th
              className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Current
            </th>
            <th
              className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Target
            </th>
            <th
              className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Δ
            </th>
            <th
              className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Share (target)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-border">
          {CATEGORIES.map((category) => {
            const currentValue = parseNumber(currentValues[category.key]);
            const targetValue = parseNumber(targetValues[category.key]);
            const delta = targetValue - currentValue;
            const share =
              targetTotal > 0 ? (targetValue / targetTotal) * 100 : 0;
            return (
              <tr key={category.key}>
                <th
                  className="px-3 py-2 font-medium text-text-primary"
                  scope="row"
                >
                  {category.label}
                </th>
                <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
                  {formatCurrency(currentValue, currency)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
                  {formatCurrency(targetValue, currency)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
                  {formatSignedCurrency(delta, currency)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
                  {share.toFixed(0)}%
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="bg-neutral-soft">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-text-primary" scope="row">
              Monthly total
            </th>
            <td className="px-3 py-2 text-right font-semibold tabular-nums text-text-primary">
              {formatCurrency(currentTotal, currency)}
            </td>
            <td className="px-3 py-2 text-right font-semibold tabular-nums text-text-primary">
              {formatCurrency(targetTotal, currency)}
            </td>
            <td className="px-3 py-2 text-right font-semibold tabular-nums text-text-primary">
              {formatSignedCurrency(targetTotal - currentTotal, currency)}
            </td>
            <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
              100%
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
