"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { NatureCategory, NatureDistanceBand } from "@/types";

/**
 * Client-side filtering for the nature hub.
 *
 * The cards themselves stay server-rendered HTML — this component receives
 * only a descriptor per card (slug, categories, band, cross-border flag),
 * which for a city is at most a couple of dozen small objects. The 42 MB place
 * corpus never crosses into the client bundle.
 *
 * Filtering toggles the `hidden` attribute on the server-rendered list items
 * rather than re-rendering them, so there is no second copy of the markup and
 * assistive technology sees the same removal sighted users do.
 */

export type NatureFilterItem = {
  slug: string;
  categories: readonly NatureCategory[];
  band: NatureDistanceBand;
  crossBorder: boolean;
};

type BandFilter = "all" | NatureDistanceBand;
type OriginFilter = "all" | "domestic" | "cross-border";

export function NatureFilterBar({
  items,
  categoryOptions,
  bandOptions,
  hasCrossBorder,
  children,
}: {
  items: readonly NatureFilterItem[];
  categoryOptions: readonly { value: NatureCategory; label: string }[];
  bandOptions: readonly { value: NatureDistanceBand; label: string }[];
  hasCrossBorder: boolean;
  children: React.ReactNode;
}) {
  const [category, setCategory] = useState<"all" | NatureCategory>("all");
  const [band, setBand] = useState<BandFilter>("all");
  const [origin, setOrigin] = useState<OriginFilter>("all");
  const listRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (category !== "all" && !item.categories.includes(category)) continue;
      if (band !== "all" && item.band !== band) continue;
      if (origin === "domestic" && item.crossBorder) continue;
      if (origin === "cross-border" && !item.crossBorder) continue;
      set.add(item.slug);
    }
    return set;
  }, [items, category, band, origin]);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    for (const node of Array.from(
      root.querySelectorAll<HTMLElement>("[data-nature-slug]"),
    )) {
      const slug = node.dataset.natureSlug;
      node.hidden = Boolean(slug) && !visible.has(slug as string);
    }
  }, [visible]);

  const unfiltered = category === "all" && band === "all" && origin === "all";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-border bg-surface-soft p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            id="nature-filter-category"
            label="Type of place"
            onChange={(value) => setCategory(value as "all" | NatureCategory)}
            options={[
              { value: "all", label: "All types" },
              ...categoryOptions,
            ]}
            value={category}
          />
          <Select
            id="nature-filter-band"
            label="Distance"
            onChange={(value) => setBand(value as BandFilter)}
            options={[{ value: "all", label: "Any distance" }, ...bandOptions]}
            value={band}
          />
          {hasCrossBorder ? (
            <Select
              id="nature-filter-origin"
              label="Country"
              onChange={(value) => setOrigin(value as OriginFilter)}
              options={[
                { value: "all", label: "Any country" },
                { value: "domestic", label: "Same country" },
                { value: "cross-border", label: "Across the border" },
              ]}
              value={origin}
            />
          ) : null}
        </div>
        <p aria-live="polite" className="mt-3 text-sm text-text-secondary">
          {unfiltered
            ? `Showing all ${items.length} places.`
            : `Showing ${visible.size} of ${items.length} places.`}
        </p>
      </div>

      <div ref={listRef}>{children}</div>

      {visible.size === 0 ? (
        <p className="rounded-2xl border border-neutral-border bg-white p-6 text-sm text-text-secondary">
          No places match this combination. Clear a filter to see the full list.
        </p>
      ) : null}
    </div>
  );
}

function Select({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted"
        htmlFor={id}
      >
        {label}
      </label>
      <select
        className="mt-1 block min-h-[44px] w-full rounded-xl border border-neutral-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
