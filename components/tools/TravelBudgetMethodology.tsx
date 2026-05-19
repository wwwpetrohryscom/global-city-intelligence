import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { staticRoutes } from "@/lib/seo/routes";

export function TravelBudgetMethodology() {
  return (
    <Card as="article">
      <h2 className="text-2xl font-semibold text-text-primary">
        How the travel budget calculator works
      </h2>
      <p className="mt-3 leading-7 text-text-secondary">
        The calculator scales the values you enter by your trip length and
        traveler count, sums them, and shows daily and per-person breakdowns.
        Nothing else is happening behind the scenes — no city-specific
        multipliers, no synthesized hotel or flight prices, no guessed
        activity rates.
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Accommodation subtotal
          </dt>
          <dd className="mt-1 font-mono text-sm text-text-primary">
            accommodation per night × trip length
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Food subtotal
          </dt>
          <dd className="mt-1 font-mono text-sm text-text-primary">
            food per day × trip length × travelers
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Local transport subtotal
          </dt>
          <dd className="mt-1 font-mono text-sm text-text-primary">
            local transport per day × trip length × travelers
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Activities subtotal
          </dt>
          <dd className="mt-1 font-mono text-sm text-text-primary">
            activities per day × trip length × travelers
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Insurance / healthcare buffer
          </dt>
          <dd className="mt-1 font-mono text-sm text-text-primary">
            flat amount you enter for the whole trip
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Flight / train subtotal
          </dt>
          <dd className="mt-1 font-mono text-sm text-text-primary">
            flat amount you enter for the whole trip
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Emergency buffer
          </dt>
          <dd className="mt-1 font-mono text-sm text-text-primary">
            flat amount you enter for the whole trip
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Total trip estimate
          </dt>
          <dd className="mt-1 font-mono text-sm text-text-primary">
            sum of all seven subtotals
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Daily estimate
          </dt>
          <dd className="mt-1 font-mono text-sm text-text-primary">
            total trip estimate ÷ trip length
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Per-person estimate
          </dt>
          <dd className="mt-1 font-mono text-sm text-text-primary">
            total trip estimate ÷ travelers
          </dd>
        </div>
      </dl>

      <h3 className="mt-6 text-lg font-semibold text-text-primary">
        What this calculator is not
      </h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-text-secondary">
        <li>
          · It is not an official travel cost estimate. The platform does not
          publish official hotel, flight, transport, or activity prices.
        </li>
        <li>
          · It is not a fare or hotel price estimator. It does not query any
          booking or airline provider.
        </li>
        <li>
          · It is not financial, insurance, or medical advice. Verify real
          prices and coverage with providers before booking.
        </li>
        <li>
          · It does not rank destinations. The city dropdown is a selector,
          not a leaderboard, and there is no &ldquo;best&rdquo; or
          &ldquo;cheapest&rdquo; destination implied by this tool.
        </li>
      </ul>

      <h3 className="mt-6 text-lg font-semibold text-text-primary">
        How to use the result honestly
      </h3>
      <p className="mt-3 leading-7 text-text-secondary">
        Use the worksheet to bracket a planning conversation: try realistic
        per-night and per-day numbers from quotes you have on hand, then test
        what changing trip length, travelers, or buffers does to the total.
        Pair the result with the destination city profile and the country
        page — those carry the source-attributed safety, healthcare, and
        transport context that a single-number estimate can&apos;t.
      </p>
      <p className="mt-3 leading-7 text-text-secondary">
        For methodology behind the structured city scores, indicator labels,
        and dataset provenance, read the {" "}
        <Link
          className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
          href={staticRoutes.methodology}
        >
          scoring methodology
        </Link>
        {" "}and the {" "}
        <Link
          className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
          href={staticRoutes.dataSources}
        >
          data sources registry
        </Link>
        .
      </p>
    </Card>
  );
}
