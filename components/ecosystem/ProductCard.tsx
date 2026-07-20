import Link from "next/link";
import { ExternalLinkIcon } from "@/components/ecosystem/icons";
import type { EcosystemWebsite } from "@/lib/ecosystem/products";
import { staticRoutes } from "@/lib/seo/routes";
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
    ? "border-brand-200 bg-brand-50/40 shadow-[0_1px_2px_rgba(184,97,8,0.06)]"
    : website.hub
      ? "border-brand-200/70 bg-surface-warm shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-[0_16px_38px_rgba(15,23,42,0.08)] focus-within:border-brand-400"
      : "border-neutral-border/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_16px_38px_rgba(15,23,42,0.08)] focus-within:border-brand-200";

  const cardClassName = cn(
    "group relative flex h-full flex-col rounded-[1.125rem] border transition duration-200",
    compact ? "p-4" : "p-5",
    stateClassName,
  );

  const header = (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-brand-700">
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
        <span className="shrink-0 rounded-full border border-brand-200 bg-white px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-brand-700">
          You are here
        </span>
      ) : (
        <ExternalLinkIcon className="mt-0.5 h-4 w-4 shrink-0 text-text-muted/60 transition group-hover:text-brand-600" />
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
        href={staticRoutes.home}
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
