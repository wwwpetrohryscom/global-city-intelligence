"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CompareView } from "@/components/discovery/CompareView";
import { useDiscoveryIndex } from "@/components/discovery/use-discovery-index";
import { COMPARE_PARAM, compareCitiesRoute, parseCompareSlugs } from "@/lib/discovery/compare-url";
import { staticRoutes } from "@/lib/seo/routes";
import type { DiscoveryCity } from "@/lib/discovery/types";

/**
 * Comparison driven entirely by the `cities` query parameter.
 *
 * This is what makes a comparison shareable, bookmarkable and refresh-safe
 * while staying compatible with `output: "export"`: the page is one prerendered
 * static file, and the parameter is read in the browser. No server sees it, and
 * no per-combination route is ever generated.
 *
 * `useSearchParams` forces its subtree to bail out of prerendering, so the
 * parent page renders this inside a `<Suspense>` boundary with a static
 * fallback — otherwise the export step fails.
 */
export function CompareCitiesClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { index, status, retry } = useDiscoveryIndex(true);

  const requested = useMemo(
    () => parseCompareSlugs(params.get(COMPARE_PARAM)),
    [params],
  );

  const resolved = useMemo(() => {
    if (!index) return { cities: [] as DiscoveryCity[], unknown: [] as string[] };
    const bySlug = new Map(index.cities.map((c) => [c.s, c]));
    const cities: DiscoveryCity[] = [];
    const unknown: string[] = [];
    for (const slug of requested) {
      const city = bySlug.get(slug);
      if (city) cities.push(city);
      else unknown.push(slug);
    }
    return { cities, unknown };
  }, [index, requested]);

  // Removing a city rewrites the URL, so the address bar always reflects what
  // is on screen and the back button steps through comparisons.
  const remove = useCallback(
    (slug: string) => {
      const next = requested.filter((s) => s !== slug);
      router.replace(compareCitiesRoute(next), { scroll: false });
    },
    [requested, router],
  );

  if (status === "error") {
    return (
      <Notice title="The city index could not be loaded">
        <p>
          The comparison needs a data file that did not download.{" "}
          <button className="underline" onClick={retry} type="button">
            Try again
          </button>
          , or browse{" "}
          <Link className="underline" href={staticRoutes.cities}>
            all cities
          </Link>
          .
        </p>
      </Notice>
    );
  }

  if (status !== "ready" || !index) {
    return (
      <p aria-busy="true" aria-live="polite" className="text-sm text-text-secondary">
        Loading city data…
      </p>
    );
  }

  if (requested.length === 0) {
    return (
      <Notice title="No cities selected yet">
        <p>
          Pick cities in the{" "}
          <Link className="underline decoration-brand-500" href={staticRoutes.exploreCities}>
            city finder
          </Link>{" "}
          and choose Compare. Up to four cities can be compared at once, and the
          resulting link can be shared or bookmarked.
        </p>
      </Notice>
    );
  }

  if (resolved.cities.length === 0) {
    return (
      <Notice title="Those cities could not be found">
        <p>
          The link refers to {resolved.unknown.length}{" "}
          {resolved.unknown.length === 1 ? "city" : "cities"} that{" "}
          {resolved.unknown.length === 1 ? "is" : "are"} not in the dataset. Start
          again from the{" "}
          <Link className="underline decoration-brand-500" href={staticRoutes.exploreCities}>
            city finder
          </Link>
          .
        </p>
      </Notice>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {resolved.unknown.length > 0 ? (
        <p className="rounded-lg border border-neutral-border bg-surface-warm p-3 text-sm text-text-secondary">
          Skipped {resolved.unknown.length} unrecognised{" "}
          {resolved.unknown.length === 1 ? "city" : "cities"} from the link:{" "}
          {resolved.unknown.join(", ")}.
        </p>
      ) : null}

      {resolved.cities.length === 1 ? (
        <p className="rounded-lg border border-neutral-border bg-surface-soft p-3 text-sm text-text-secondary">
          Only one city is selected. Add another from the{" "}
          <Link className="underline decoration-brand-500" href={staticRoutes.exploreCities}>
            city finder
          </Link>{" "}
          to see a side-by-side comparison.
        </p>
      ) : null}

      <CompareView cities={resolved.cities} index={index} onRemove={remove} />

      <div>
        <Link
          className="inline-flex min-h-[44px] items-center rounded-lg border border-neutral-border bg-white px-4 text-sm font-medium text-text-primary hover:border-brand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          href={staticRoutes.exploreCities}
        >
          Back to the city finder
        </Link>
      </div>
    </div>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-line bg-surface-soft p-8 text-center">
      <p className="text-sm font-semibold text-text-primary">{title}</p>
      <div className="mx-auto mt-2 max-w-md text-sm text-text-secondary">{children}</div>
    </div>
  );
}
