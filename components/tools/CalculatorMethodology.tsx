import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { staticRoutes } from "@/lib/seo/routes";

export function CalculatorMethodology() {
  return (
    <Card as="article">
      <h2 className="text-2xl font-semibold text-text-primary">
        How the calculator works
      </h2>
      <p className="mt-3 leading-7 text-text-secondary">
        The calculator adds the seven monthly budget categories you enter for
        the current city and for the target city, subtracts the totals, and
        annualises the difference. Nothing else is happening behind the
        scenes — no city-specific multipliers, no synthesized rent prices, no
        guessed grocery or transport costs.
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Current monthly total
          </dt>
          <dd className="mt-1 font-mono text-sm text-text-primary">
            sum of the seven current-city categories you entered
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Target monthly total
          </dt>
          <dd className="mt-1 font-mono text-sm text-text-primary">
            sum of the seven target-city categories you entered
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Monthly difference
          </dt>
          <dd className="mt-1 font-mono text-sm text-text-primary">
            target total − current total
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Annualised difference
          </dt>
          <dd className="mt-1 font-mono text-sm text-text-primary">
            monthly difference × 12
          </dd>
        </div>
      </dl>

      <h3 className="mt-6 text-lg font-semibold text-text-primary">
        What this calculator is not
      </h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-text-secondary">
        <li>
          · It is not an official cost-of-living measurement. The platform
          does not publish official rent, grocery, transport, salary, or
          purchasing-power values.
        </li>
        <li>
          · It is not financial advice. Treat the output as a planning
          estimate that reflects the numbers you entered.
        </li>
        <li>
          · It does not adjust your inputs for inflation, currency volatility,
          or local tax. Whatever you enter for each category is used as-is.
        </li>
        <li>
          · It does not rank cities. The city dropdowns are selectors, not a
          leaderboard, and there is no &ldquo;best&rdquo; or &ldquo;cheapest&rdquo; city implied by
          this tool.
        </li>
      </ul>

      <h3 className="mt-6 text-lg font-semibold text-text-primary">
        How to use the result honestly
      </h3>
      <p className="mt-3 leading-7 text-text-secondary">
        Use the calculator to bracket a relocation conversation: try a
        realistic current monthly budget, then test what changing housing,
        transport, or healthcare lines does to the total. Pair the result
        with the linked city profiles and structured comparisons — those
        carry the source-attributed context that a single-number estimate
        can&apos;t.
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
