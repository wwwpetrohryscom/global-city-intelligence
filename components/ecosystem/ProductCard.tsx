import Link from "next/link";
import { ExternalLinkIcon } from "@/components/ecosystem/icons";
import { HOME_PATH, type EcosystemWebsite } from "@/lib/ecosystem/products";
import { cn } from "@/lib/utils/cn";

/**
 * A single HELPERG website, rendered as a card that matches the site's
 * `Card` primitive (radius, border, hover-lift). The current site links to
 * the local home page and is flagged "You are here" instead of opening a new
 * tab to itself; every other site opens in a new tab.
 */
export function ProductCard({
  website,
  compact = false,
}: {
  website: EcosystemWebsite;
  compact?: boolean;
}) {
  const isCurrent = Boolean(website.current);

  // `cn` is a plain join (no tailwind-merge), so each state must supply exactly
  // one background + one border utility — never layer a conditional colour over
  // a base one, or the winner would depend on stylesheet order.
  const stateClassName = isCurrent
    ? "border-eco-200 bg-eco-50/60 shadow-[0_1px_2px_rgba(15,108,189,0.06)]"
    : website.hub
      ? "border-ecogreen-200 bg-ecogreen-50 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:border-ecogreen-500 hover:shadow-[0_16px_38px_rgba(15,23,42,0.08)] focus-within:border-ecogreen-500"
      : "border-neutral-border/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:border-eco-200 hover:shadow-[0_16px_38px_rgba(15,23,42,0.08)] focus-within:border-eco-200";

  const cardClassName = cn(
    "group relative flex h-full flex-col rounded-[1.125rem] border transition duration-200",
    compact ? "p-4" : "p-5",
    stateClassName,
  );

  const header = (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p
          className={cn(
            "text-[0.6875rem] font-semibold uppercase tracking-[0.08em]",
            website.hub ? "text-ecogreen-700" : "text-eco-700",
          )}
        >
          {website.category}
        </p>
        <h3
          className={cn(
            "mt-1 font-semibold text-text-primary",
            compact ? "text-[0.95rem]" : "text-base",
          )}
        >
          {website.name}
        </h3>
      </div>
      {isCurrent ? (
        <span className="shrink-0 rounded-full border border-eco-200 bg-white px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-eco-700">
          You are here
        </span>
      ) : (
        <ExternalLinkIcon className="mt-0.5 h-4 w-4 shrink-0 text-text-muted/60 transition group-hover:text-eco-500" />
      )}
    </div>
  );

  const body = (
    <p
      className={cn(
        "leading-6 text-text-secondary",
        compact ? "mt-1.5 text-[0.8125rem]" : "mt-2 text-sm",
      )}
    >
      {website.tagline}
    </p>
  );

  if (isCurrent) {
    return (
      <Link
        aria-label={`${website.name} — you are here (go to home)`}
        className={cardClassName}
        href={HOME_PATH}
      >
        {header}
        {body}
      </Link>
    );
  }

  return (
    <a
      aria-label={`${website.name} — ${website.tagline} (opens in a new tab)`}
      className={cardClassName}
      href={website.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      {header}
      {body}
    </a>
  );
}
