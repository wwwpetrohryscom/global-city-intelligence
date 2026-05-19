"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";

export interface TravelCityOption {
  slug: string;
  name: string;
  countryName: string;
  countrySlug: string;
  url: string;
  countryUrl: string;
}

interface CategoryConfig {
  key: CategoryKey;
  label: string;
  helper: string;
  scaling: "perTrip" | "perDay" | "perPersonPerDay";
}

type CategoryKey =
  | "accommodation"
  | "food"
  | "localTransport"
  | "activities"
  | "insuranceHealthcare"
  | "flightTrain"
  | "emergencyBuffer";

const CATEGORIES: readonly CategoryConfig[] = [
  {
    key: "accommodation",
    label: "Accommodation per night",
    helper: "Hotel, rental, or hostel rate per night (for the room/booking).",
    scaling: "perDay",
  },
  {
    key: "food",
    label: "Food per day per person",
    helper: "Groceries plus the share of meals you eat outside.",
    scaling: "perPersonPerDay",
  },
  {
    key: "localTransport",
    label: "Local transport per day per person",
    helper: "Transit, taxis, ride-hail, or car-rental share per traveler.",
    scaling: "perPersonPerDay",
  },
  {
    key: "activities",
    label: "Activities per day per person",
    helper: "Tickets, tours, museums, or other paid activities per traveler.",
    scaling: "perPersonPerDay",
  },
  {
    key: "insuranceHealthcare",
    label: "Insurance / healthcare buffer",
    helper: "Travel insurance and a buffer for any out-of-pocket healthcare.",
    scaling: "perTrip",
  },
  {
    key: "flightTrain",
    label: "Flight / train cost",
    helper: "Total long-distance travel cost to and from the destination.",
    scaling: "perTrip",
  },
  {
    key: "emergencyBuffer",
    label: "Emergency buffer",
    helper: "Reserve for unexpected costs (lost gear, delays, rebookings).",
    scaling: "perTrip",
  },
];

type CategoryValues = Record<CategoryKey, string>;

const NEUTRAL_VALUES: CategoryValues = {
  accommodation: "",
  food: "",
  localTransport: "",
  activities: "",
  insuranceHealthcare: "",
  flightTrain: "",
  emergencyBuffer: "",
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

function parsePositiveInteger(raw: string, fallback: number): number {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return fallback;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.floor(parsed);
}

function formatCurrency(value: number, currency: CurrencyOption): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

interface CalculatorProps {
  cities: TravelCityOption[];
  methodologyPath: string;
  dataSourcesPath: string;
}

function subtotalFor(
  category: CategoryConfig,
  amount: number,
  tripLength: number,
  travelers: number,
): number {
  switch (category.scaling) {
    case "perDay":
      return amount * tripLength;
    case "perPersonPerDay":
      return amount * tripLength * travelers;
    case "perTrip":
    default:
      return amount;
  }
}

export function TravelBudgetCalculator({
  cities,
  methodologyPath,
  dataSourcesPath,
}: CalculatorProps) {
  const headingId = useId();
  const tripLengthId = useId();
  const travelersId = useId();
  const destinationId = useId();
  const currencyId = useId();

  const [currency, setCurrency] = useState<CurrencyOption>("USD");
  const [tripLength, setTripLength] = useState<string>("7");
  const [travelers, setTravelers] = useState<string>("1");
  const [destination, setDestination] = useState<string>(cities[0]?.slug ?? "");
  const [values, setValues] = useState<CategoryValues>(NEUTRAL_VALUES);

  const tripLengthSafe = parsePositiveInteger(tripLength, 1);
  const travelersSafe = parsePositiveInteger(travelers, 1);

  const subtotals = useMemo(() => {
    const result: Record<CategoryKey, number> = {
      accommodation: 0,
      food: 0,
      localTransport: 0,
      activities: 0,
      insuranceHealthcare: 0,
      flightTrain: 0,
      emergencyBuffer: 0,
    };
    for (const category of CATEGORIES) {
      result[category.key] = subtotalFor(
        category,
        parseNumber(values[category.key]),
        tripLengthSafe,
        travelersSafe,
      );
    }
    return result;
  }, [values, tripLengthSafe, travelersSafe]);

  const totalTripEstimate = useMemo(
    () =>
      CATEGORIES.reduce((sum, category) => sum + subtotals[category.key], 0),
    [subtotals],
  );
  const dailyEstimate = totalTripEstimate / tripLengthSafe;
  const perPersonEstimate = totalTripEstimate / travelersSafe;

  const destinationCity = useMemo(
    () => cities.find((entry) => entry.slug === destination),
    [cities, destination],
  );

  const allZero = totalTripEstimate === 0;

  const resetValues = () => {
    setValues(NEUTRAL_VALUES);
  };

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary" id={headingId}>
            Build your trip budget worksheet
          </h2>
          <p className="mt-2 max-w-[58ch] text-sm leading-6 text-text-secondary">
            Planning estimate based on the numbers you enter. Not an official
            travel cost estimate. Verify real prices with providers before
            booking.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <label className="flex flex-col gap-1" htmlFor={currencyId}>
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Currency
            </span>
            <select
              className="rounded-lg border border-neutral-border bg-white px-3 py-2 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
              id={currencyId}
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
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm" htmlFor={destinationId}>
          <span className="font-semibold text-text-primary">Destination city</span>
          <select
            className="rounded-lg border border-neutral-border bg-white px-3 py-2 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
            id={destinationId}
            onChange={(event) => setDestination(event.target.value)}
            value={destination}
          >
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name} — {city.countryName}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm" htmlFor={tripLengthId}>
          <span className="font-semibold text-text-primary">Trip length (days)</span>
          <input
            className="rounded-lg border border-neutral-border bg-white px-3 py-2 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
            id={tripLengthId}
            inputMode="numeric"
            min={1}
            onChange={(event) => setTripLength(event.target.value)}
            type="number"
            value={tripLength}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm" htmlFor={travelersId}>
          <span className="font-semibold text-text-primary">Travelers</span>
          <input
            className="rounded-lg border border-neutral-border bg-white px-3 py-2 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
            id={travelersId}
            inputMode="numeric"
            min={1}
            onChange={(event) => setTravelers(event.target.value)}
            type="number"
            value={travelers}
          />
        </label>
      </div>

      <p className="mt-2 text-xs leading-5 text-text-muted">
        Trip length and travelers default to a minimum of 1 so the math stays
        valid even before you finalise the values.
      </p>

      <div className="mt-6 rounded-xl border border-neutral-border bg-surface-soft p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
            Your trip budget inputs
          </p>
          <button
            className="inline-flex items-center rounded-full border border-neutral-border bg-white px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-brand-400 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
            onClick={resetValues}
            type="button"
          >
            Reset values
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {CATEGORIES.map((category) => (
            <BudgetInput
              helper={category.helper}
              key={category.key}
              label={category.label}
              onChange={(value) =>
                setValues((previous) => ({ ...previous, [category.key]: value }))
              }
              value={values[category.key]}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-border bg-surface-soft p-5">
        <h3 className="text-base font-semibold text-text-primary">
          Planning estimate
        </h3>
        <p className="mt-1 text-xs text-text-muted">
          {tripLengthSafe} {tripLengthSafe === 1 ? "day" : "days"} ·{" "}
          {travelersSafe} {travelersSafe === 1 ? "traveler" : "travelers"}.
          Directional estimate — not an official travel cost calculator.
        </p>
        {allZero ? (
          <p className="mt-3 rounded-lg border border-dashed border-neutral-border bg-white px-3 py-2 text-sm text-text-secondary">
            Enter at least one category above to see your planning estimate.
          </p>
        ) : null}
        <dl
          aria-live="polite"
          className="mt-4 grid gap-4 sm:grid-cols-3"
        >
          <SummaryStat
            accent
            label="Total trip estimate"
            value={formatCurrency(totalTripEstimate, currency)}
          />
          <SummaryStat
            label="Daily estimate"
            value={formatCurrency(dailyEstimate, currency)}
          />
          <SummaryStat
            label="Per-person estimate"
            value={formatCurrency(perPersonEstimate, currency)}
          />
        </dl>

        <CategoryBreakdownTable
          currency={currency}
          subtotals={subtotals}
          total={totalTripEstimate}
        />

        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          {destinationCity ? (
            <>
              <Link
                className="inline-flex items-center rounded-full border border-neutral-border bg-white px-3 py-1.5 font-medium text-text-secondary hover:border-brand-400 hover:text-text-primary"
                href={destinationCity.url}
              >
                Destination city profile: {destinationCity.name}
              </Link>
              <Link
                className="inline-flex items-center rounded-full border border-neutral-border bg-white px-3 py-1.5 font-medium text-text-secondary hover:border-brand-400 hover:text-text-primary"
                href={destinationCity.countryUrl}
              >
                Country context: {destinationCity.countryName}
              </Link>
            </>
          ) : null}
          <Link
            className="inline-flex items-center rounded-full border border-neutral-border bg-white px-3 py-1.5 font-medium text-text-secondary hover:border-brand-400 hover:text-text-primary"
            href={methodologyPath}
          >
            Read methodology
          </Link>
          <Link
            className="inline-flex items-center rounded-full border border-neutral-border bg-white px-3 py-1.5 font-medium text-text-secondary hover:border-brand-400 hover:text-text-primary"
            href={dataSourcesPath}
          >
            Data sources
          </Link>
        </div>
        {destinationCity ? (
          <p className="mt-4 text-xs leading-5 text-text-muted">
            Use the {destinationCity.name} profile and the {destinationCity.countryName}{" "}
            country page for source-attributed safety, healthcare, and
            transport context before you finalise your trip.
          </p>
        ) : null}
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
      <dd className="mt-1 text-xl font-semibold text-text-primary">
        {value}
      </dd>
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
        placeholder="0"
        type="number"
        value={value}
      />
    </label>
  );
}

function CategoryBreakdownTable({
  subtotals,
  total,
  currency,
}: {
  subtotals: Record<CategoryKey, number>;
  total: number;
  currency: CurrencyOption;
}) {
  return (
    <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-border bg-white">
      <table className="min-w-full text-left text-sm">
        <caption className="sr-only">
          Category breakdown of your entered trip budget, scaled by trip
          length and travelers where applicable
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
              Subtotal
            </th>
            <th
              className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Share
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-border">
          {CATEGORIES.map((category) => {
            const subtotal = subtotals[category.key];
            const share = total > 0 ? (subtotal / total) * 100 : null;
            return (
              <tr key={category.key}>
                <th
                  className="px-3 py-2 font-medium text-text-primary"
                  scope="row"
                >
                  {category.label}
                </th>
                <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
                  {formatCurrency(subtotal, currency)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
                  {share === null ? "—" : `${share.toFixed(0)}%`}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="bg-neutral-soft">
          <tr>
            <th
              className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-text-primary"
              scope="row"
            >
              Total trip estimate
            </th>
            <td className="px-3 py-2 text-right font-semibold tabular-nums text-text-primary">
              {formatCurrency(total, currency)}
            </td>
            <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
              {total > 0 ? "100%" : "—"}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
