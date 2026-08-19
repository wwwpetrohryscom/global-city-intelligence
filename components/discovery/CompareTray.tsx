"use client";

import Link from "next/link";
import { MAX_COMPARE } from "@/lib/discovery/storage";
import { compareCitiesRoute } from "@/lib/discovery/compare-url";

/**
 * Persistent selection tray for the comparison workflow.
 *
 * Fixed to the BOTTOM of the viewport. The top of the screen is already
 * occupied by two sticky layers (ecosystem bar + site header); anchoring here
 * keeps the tray clear of them and clear of the search dialog, which opens
 * against `--sticky-stack-height`.
 *
 * It renders nothing at all when the selection is empty, so it costs no space
 * until the visitor has actually started a comparison. The results list below
 * reserves matching padding while it is open so the tray can never cover the
 * final row of cities.
 */
export function CompareTray({
  selected,
  nameOf,
  onRemove,
  onClear,
}: {
  selected: string[];
  nameOf: (slug: string) => string;
  onRemove: (slug: string) => void;
  onClear: () => void;
}) {
  if (selected.length === 0) return null;

  return (
    <div
      aria-label="Comparison selection"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-border bg-white/95 shadow-[0_-1px_12px_rgba(23,32,51,0.08)] backdrop-blur supports-[backdrop-filter]:bg-white/90"
      role="region"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap">
        <p aria-live="polite" className="sr-only">
          {selected.length} of {MAX_COMPARE} cities selected for comparison
        </p>

        <ul className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {selected.map((slug) => (
            <li key={slug}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-border bg-surface-muted py-1 pl-3 pr-1 text-sm text-text-primary">
                <span className="max-w-[9rem] truncate">{nameOf(slug)}</span>
                <button
                  aria-label={`Remove ${nameOf(slug)} from comparison`}
                  className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-neutral-border hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-500"
                  onClick={() => onRemove(slug)}
                  type="button"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </span>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <button
            className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            onClick={onClear}
            type="button"
          >
            Clear
          </button>
          {selected.length >= 2 ? (
            <Link
              className="inline-flex min-h-[44px] items-center rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              href={compareCitiesRoute(selected)}
            >
              Compare {selected.length} cities
            </Link>
          ) : (
            <span className="inline-flex min-h-[44px] items-center rounded-lg border border-dashed border-neutral-line px-4 text-sm text-text-muted">
              Add one more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
