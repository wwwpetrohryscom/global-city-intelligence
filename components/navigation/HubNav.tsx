import Link from "next/link";
import { staticRoutes } from "@/lib/seo/routes";

export interface HubNavItem {
  href: string;
  label: string;
}

const DEFAULT_HUB_ITEMS: HubNavItem[] = [
  { href: staticRoutes.cities, label: "Cities" },
  { href: staticRoutes.countries, label: "Countries" },
  { href: staticRoutes.collections, label: "Best Cities" },
  { href: staticRoutes.compare, label: "Compare" },
  { href: staticRoutes.rankings, label: "Rankings" },
  { href: staticRoutes.methodology, label: "Methodology" },
  { href: staticRoutes.dataSources, label: "Data Sources" },
];

interface HubNavProps {
  items?: HubNavItem[];
  label?: string;
  activeHref?: string;
}

/**
 * Reusable hub navigation. Used on top-level hub pages (homepage,
 * /cities, /countries, /best-cities, /compare, /rankings) to give
 * users a consistent way to move between the main entry points.
 *
 * Server-rendered, no client JS, no scroll logic. For in-page anchor
 * navigation on detail pages, use `CountryHubNavigation` instead.
 */
export function HubNav({
  items = DEFAULT_HUB_ITEMS,
  label = "Explore the platform",
  activeHref,
}: HubNavProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={label}
      className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {label}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2 text-sm">
        {items.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <li key={item.href}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={[
                  "inline-flex items-center rounded-full border px-3 py-1.5 font-medium transition",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500",
                  isActive
                    ? "border-brand-500 bg-orange-50 text-text-primary"
                    : "border-neutral-border bg-surface-soft text-text-secondary hover:border-brand-400 hover:bg-orange-50 hover:text-text-primary",
                ].join(" ")}
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
