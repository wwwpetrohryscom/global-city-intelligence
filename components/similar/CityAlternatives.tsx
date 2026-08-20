"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDiscoveryIndex } from "@/components/discovery/use-discovery-index";
import { useSavedCities } from "@/components/discovery/use-city-lists";
import { compareCitiesRoute } from "@/lib/discovery/compare-url";
import { MAX_COMPARE } from "@/lib/discovery/storage";
import {
  INTENTS,
  alternatives,
  buildContext,
  type EngineContext,
  type IntentId,
} from "@/lib/similar/engine";

/**
 * Explore alternatives — the interactive half of the recommendation layer.
 *
 * Runs the SAME pure engine as the server-rendered Similar Cities section,
 * over the SAME already-published /discovery-index/cities.json. No second
 * index is created and no recommendation matrix is baked into the HTML: nine
 * intents × 4,444 cities would be a large duplication for something most
 * visitors never open, so the interactive branch is computed on demand from
 * an index the site already ships and the browser may already have cached
 * from /explore-cities.
 *
 * Save and Compare reuse the existing Saved Cities storage and the existing
 * `/compare-cities?cities=` URL state — no parallel implementations, and the
 * existing MAX_COMPARE cap is respected.
 *
 * Client-safe: imports only the pure engine and existing client hooks; no
 * `@/lib/data` anywhere in the graph.
 */
export function CityAlternatives({ citySlug, cityName }: { citySlug: string; cityName: string }) {
  const { index, status, prime } = useDiscoveryIndex(false);
  const { saved, hydrated, toggle } = useSavedCities();
  const [intent, setIntent] = useState<IntentId | null>(null);
  const [compare, setCompare] = useState<string[]>([]);

  useEffect(() => {
    if (intent !== null) prime();
  }, [intent, prime]);

  const ctx = useMemo<EngineContext | null>(
    () => (index ? buildContext(index) : null),
    [index],
  );

  const hits = useMemo(
    () => (ctx && intent ? alternatives(ctx, citySlug, intent) : []),
    [ctx, intent, citySlug],
  );

  const compareHref = compareCitiesRoute([citySlug, ...compare]);
  const full = compare.length + 1 >= MAX_COMPARE;

  return (
    <section aria-labelledby="alternatives-heading" className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-text-primary" id="alternatives-heading">
          Explore alternatives to {cityName}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Cities that stay broadly comparable to {cityName} while improving one named
          indicator. Each result states what it gains and what it gives up.
        </p>
      </div>

      <ul className="flex flex-wrap gap-2">
        {INTENTS.map((it) => {
          const active = intent === it.id;
          return (
            <li key={it.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setIntent(active ? null : it.id)}
                className={`inline-flex min-h-11 items-center rounded-xl border px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500 ${
                  active
                    ? "border-eco-500 bg-eco-500 text-white"
                    : "border-neutral-border bg-white text-text-secondary hover:border-eco-300 hover:text-text-primary"
                }`}
              >
                {it.label}
              </button>
            </li>
          );
        })}
      </ul>

      <p aria-live="polite" className="text-sm text-text-secondary">
        {intent === null
          ? "Choose an indicator to see alternatives."
          : status === "loading"
            ? "Loading city data…"
            : status === "error"
              ? "City data is unavailable right now."
              : hits.length === 0
                ? `No city stays comparable to ${cityName} while materially improving this indicator.`
                : `${hits.length} alternative${hits.length === 1 ? "" : "s"} found.`}
      </p>

      {hits.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {hits.map((hit) => {
            const isSaved = hydrated && saved.includes(hit.city.s);
            const inCompare = compare.includes(hit.city.s);
            return (
              <li
                key={hit.city.s}
                className="flex flex-col gap-2 rounded-xl border border-neutral-border bg-white p-3"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <Link
                    href={`/cities/${hit.city.s}`}
                    className="min-h-11 truncate font-medium text-text-primary underline decoration-eco-300 decoration-2 underline-offset-4 hover:decoration-eco-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500"
                  >
                    {hit.city.n}
                  </Link>
                  <span className="shrink-0 rounded-md bg-ecogreen-50 px-1.5 py-0.5 text-[11px] font-medium text-ecogreen-800">
                    {hit.gain}
                  </span>
                </div>
                <p className="text-xs leading-5 text-text-secondary">
                  {hit.sharedTraits.length > 0
                    ? `Keeps comparable ${hit.sharedTraits.join(", ")}.`
                    : "Broadly comparable profile."}{" "}
                  {hit.tradeOffs.length > 0
                    ? `Trade-off: ${hit.tradeOffs.join(", ")}.`
                    : "No material trade-off on the other published indicators."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    aria-pressed={isSaved}
                    onClick={() => toggle(hit.city.s)}
                    className="inline-flex min-h-11 items-center rounded-lg border border-neutral-border px-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-eco-300 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500 lg:min-h-9"
                  >
                    {isSaved ? "Saved" : "Save"}
                  </button>
                  <button
                    type="button"
                    aria-pressed={inCompare}
                    disabled={!inCompare && full}
                    onClick={() =>
                      setCompare((prev) =>
                        prev.includes(hit.city.s)
                          ? prev.filter((s) => s !== hit.city.s)
                          : prev.length + 1 >= MAX_COMPARE
                            ? prev
                            : [...prev, hit.city.s],
                      )
                    }
                    className="inline-flex min-h-11 items-center rounded-lg border border-neutral-border px-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-eco-300 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500 disabled:cursor-not-allowed disabled:opacity-40 lg:min-h-9"
                  >
                    {inCompare ? "Comparing" : "Compare"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      {compare.length > 0 ? (
        <Link
          href={compareHref}
          className="inline-flex min-h-11 items-center rounded-lg bg-brand-navy px-3 text-sm font-medium text-white transition-colors hover:bg-brand-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500"
        >
          Compare {cityName} with {compare.length} selected
        </Link>
      ) : null}

      <details className="group">
        <summary className="inline-flex min-h-11 cursor-pointer items-center text-xs font-medium text-text-secondary underline decoration-dotted underline-offset-4 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500 lg:min-h-9">
          How recommendations are calculated
        </summary>
        <p className="mt-2 max-w-3xl text-xs leading-5 text-text-secondary">
          Recommendations use the indicators currently published on this site — they are
          not external rankings. Each indicator is scaled to a common range before
          cities are compared, so no single measure dominates because of its units, and
          only cities with a complete set of published indicators take part. Cities whose
          data is still pending integration are excluded entirely. An alternative must
          stay broadly comparable to {cityName} and improve the indicator you chose by a
          margin large enough to be meaningful rather than rounding noise; where it gives
          something up in exchange, that is stated on the card.
        </p>
      </details>
    </section>
  );
}
