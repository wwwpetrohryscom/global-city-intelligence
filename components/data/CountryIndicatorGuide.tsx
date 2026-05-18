import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { staticRoutes } from "@/lib/seo/routes";

const GUIDE_POINTS: { title: string; body: string }[] = [
  {
    title: "Country-level, not city-level",
    body: "Indicators describe national context. Pair them with city profiles, comparisons, and verified utility layers (emergency, healthcare, transport) for local detail.",
  },
  {
    title: "Source-attributed where available",
    body: "Values come from the World Bank Development Indicators. Where no verified record exists, the platform shows a transparent fallback rather than a guessed number.",
  },
  {
    title: "Different indicators, different years",
    body: "Each record carries its own data year because publishers refresh indicators on their own cadence. The card and table both display the year alongside the value.",
  },
  {
    title: "Context, not a ranking",
    body: "Treat indicators as orientation, not as a leaderboard. The platform never claims any country is best, safest, cleanest, richest, healthiest, or most connected.",
  },
  {
    title: "Read alongside city intelligence",
    body: "Country indicators are most useful when combined with the city profiles in the country, the public-safety, healthcare, and transport sections, and the methodology and data-sources pages.",
  },
];

export function CountryIndicatorGuide() {
  return (
    <Card as="article" className="border-l-4 border-l-brand-500">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-text-primary">
          How to read these country indicators
        </h3>
        <span className="text-xs uppercase tracking-wide text-text-muted">
          Reading guide
        </span>
      </div>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {GUIDE_POINTS.map((point) => (
          <li
            className="rounded-xl border border-neutral-border bg-surface-soft p-3.5"
            key={point.title}
          >
            <p className="text-sm font-semibold text-text-primary">
              {point.title}
            </p>
            <p className="mt-1.5 text-xs leading-5 text-text-secondary">
              {point.body}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-5 text-text-secondary">
        For full construction details, read the{" "}
        <Link
          className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
          href={staticRoutes.methodology}
        >
          methodology page
        </Link>{" "}
        and the{" "}
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
