import {
  REACHABILITY_BAND_HEADING,
  REACHABILITY_BAND_NOTE,
  REACHABILITY_BAND_ORDER,
} from "@/lib/reachability/bands";
import { ReachabilityList } from "@/components/reachability/ReachabilityList";
import { selectForBand } from "@/lib/reachability/engine";
import type { CityReachability } from "@/lib/reachability/types";

/**
 * Destinations grouped by distance band.
 *
 * A band that has nothing is not rendered — no empty state, no zero chip. The
 * per-band note is the guarantee that a band is read as a distance and never as
 * a journey time.
 */
export function ReachabilityBands({
  reach,
  cityName,
  perBand,
  headingId,
}: {
  reach: CityReachability;
  cityName: string;
  perBand: number;
  headingId: string;
}) {
  const groups = REACHABILITY_BAND_ORDER.map((band) => ({
    band,
    items: selectForBand(reach, band, perBand),
  })).filter((group) => group.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className="space-y-6">
      <div>
        <h2
          className="text-xl font-semibold text-text-primary"
          id={headingId}
        >
          What you can reach from {cityName}
        </h2>
        <p className="mt-2 max-w-[65ch] text-sm leading-6 text-text-secondary">
          Cities and natural destinations already indexed on this site, grouped
          by measured straight-line distance from the city centre. Distances are
          geographic, not travel times — check routes and schedules with a
          transport operator before travelling.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {groups.map(({ band, items }) => (
          <div
            className="rounded-2xl border border-neutral-border bg-white p-5"
            key={band}
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-eco-800">
              {REACHABILITY_BAND_HEADING[band]}
            </h3>
            <p className="mt-1 text-xs leading-5 text-text-muted">
              {REACHABILITY_BAND_NOTE[band]}
            </p>
            <div className="mt-3">
              <ReachabilityList
                ariaLabel={`${REACHABILITY_BAND_HEADING[band]} from ${cityName}`}
                destinations={items}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
