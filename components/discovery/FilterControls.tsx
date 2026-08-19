"use client";

import { useId, useState } from "react";
import {
  AFFORDABILITY_BANDS,
  POPULATION_BANDS,
  SCORE_BANDS,
  TEMPERATURE_BANDS,
  type Band,
} from "@/lib/discovery/bands";
import type { FinderFilters } from "@/lib/discovery/filter";
import type { DiscoveryIndex } from "@/lib/discovery/types";

/**
 * The Finder's facets.
 *
 * PROGRESSIVE DISCLOSURE: the four facets that answer the common question
 * ("an affordable European city with a mild climate") are always visible;
 * the remaining six sit behind "More filters" so the initial screen is a
 * decision surface rather than a control panel.
 *
 * EXPLAINABILITY: every band label states its own numeric threshold
 * ("1M – 5M", "Warm — 18 to 24°C", "More affordable — score 75+"), so no
 * facet needs a glossary to be understood, and no label makes a quality claim
 * the corpus does not support.
 */

type ArrayFacet = Exclude<keyof FinderFilters, "q">;

function FacetGroup<Id extends string>({
  legend,
  note,
  bands,
  selected,
  onToggle,
}: {
  legend: string;
  note?: string;
  bands: readonly Band<Id>[];
  selected: readonly string[];
  onToggle: (id: Id) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-xs font-semibold uppercase tracking-wide text-text-primary">
        {legend}
      </legend>
      {note ? <p className="mt-1 text-xs text-text-muted">{note}</p> : null}
      <div className="mt-2 flex flex-col gap-1.5">
        {bands.map((band) => (
          <label
            className="flex min-h-[32px] cursor-pointer items-center gap-2 text-sm text-text-secondary"
            key={band.id}
          >
            <input
              checked={selected.includes(band.id)}
              className="size-4 shrink-0 rounded border-neutral-line text-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              onChange={() => onToggle(band.id)}
              type="checkbox"
            />
            <span>{band.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function CheckList({
  legend,
  values,
  selected,
  onToggle,
  scroll,
}: {
  legend: string;
  values: { id: string; label: string }[];
  selected: readonly string[];
  onToggle: (id: string) => void;
  scroll?: boolean;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-xs font-semibold uppercase tracking-wide text-text-primary">
        {legend}
      </legend>
      <div
        className={[
          "mt-2 flex flex-col gap-1.5",
          scroll ? "max-h-56 overflow-y-auto pr-1" : "",
        ].join(" ")}
      >
        {values.map((value) => (
          <label
            className="flex min-h-[32px] cursor-pointer items-center gap-2 text-sm text-text-secondary"
            key={value.id}
          >
            <input
              checked={selected.includes(value.id)}
              className="size-4 shrink-0 rounded border-neutral-line text-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              onChange={() => onToggle(value.id)}
              type="checkbox"
            />
            <span>{value.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function FilterControls({
  index,
  filters,
  onToggleArray,
}: {
  index: DiscoveryIndex;
  filters: FinderFilters;
  onToggleArray: (facet: ArrayFacet, value: string) => void;
}) {
  const [showMore, setShowMore] = useState(false);
  const moreId = useId();

  const regions = Array.from(
    new Set(index.countries.map((c) => c.m).filter((m): m is string => m !== null)),
  ).sort();

  const countries = index.countries
    .map((c) => ({ id: c.s, label: c.n }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const zones = [...index.zones].sort().map((z) => ({ id: z, label: z }));

  return (
    <div className="flex flex-col gap-6">
      <CheckList
        legend="Region"
        onToggle={(v) => onToggleArray("regions", v)}
        selected={filters.regions}
        values={regions.map((r) => ({ id: r, label: r }))}
      />
      <FacetGroup
        bands={POPULATION_BANDS}
        legend="Population"
        onToggle={(v) => onToggleArray("population", v)}
        selected={filters.population}
      />
      <FacetGroup
        bands={AFFORDABILITY_BANDS}
        legend="Affordability"
        note="Published affordability score. Higher means more affordable."
        onToggle={(v) => onToggleArray("affordability", v)}
        selected={filters.affordability}
      />
      <FacetGroup
        bands={TEMPERATURE_BANDS}
        legend="Temperature"
        note="Annual average."
        onToggle={(v) => onToggleArray("temperature", v)}
        selected={filters.temperature}
      />

      <div>
        <button
          aria-controls={moreId}
          aria-expanded={showMore}
          className="inline-flex min-h-[40px] w-full items-center justify-between rounded-lg border border-neutral-border px-3 text-sm font-medium text-text-primary transition-colors hover:border-neutral-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          onClick={() => setShowMore((v) => !v)}
          type="button"
        >
          <span>{showMore ? "Fewer filters" : "More filters"}</span>
          <span aria-hidden="true" className="text-text-muted">
            {showMore ? "−" : "+"}
          </span>
        </button>

        {showMore ? (
          <div className="mt-6 flex flex-col gap-6" id={moreId}>
            <CheckList
              legend="Climate zone"
              onToggle={(v) => onToggleArray("zones", v)}
              selected={filters.zones}
              values={zones}
            />
            <FacetGroup
              bands={SCORE_BANDS}
              legend="Safety score"
              onToggle={(v) => onToggleArray("safety", v)}
              selected={filters.safety}
            />
            <FacetGroup
              bands={SCORE_BANDS}
              legend="Air quality score"
              onToggle={(v) => onToggleArray("airQuality", v)}
              selected={filters.airQuality}
            />
            <FacetGroup
              bands={SCORE_BANDS}
              legend="Internet speed score"
              onToggle={(v) => onToggleArray("internet", v)}
              selected={filters.internet}
            />
            <FacetGroup
              bands={SCORE_BANDS}
              legend="Economy score"
              onToggle={(v) => onToggleArray("economy", v)}
              selected={filters.economy}
            />
            <FacetGroup
              bands={SCORE_BANDS}
              legend="Education score"
              onToggle={(v) => onToggleArray("education", v)}
              selected={filters.education}
            />
            <FacetGroup
              bands={SCORE_BANDS}
              legend="Healthcare score"
              onToggle={(v) => onToggleArray("healthcare", v)}
              selected={filters.healthcare}
            />
            <CheckList
              legend="Country"
              onToggle={(v) => onToggleArray("countries", v)}
              scroll
              selected={filters.countries}
              values={countries}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
