import { AppCard } from "@/components/ecosystem/AppCard";
import { ProductCard } from "@/components/ecosystem/ProductCard";
import {
  ecosystemApps,
  ecosystemWebsites,
} from "@/lib/ecosystem/products";
import { cn } from "@/lib/utils/cn";

/**
 * The data-driven grids shared by the ecosystem drawer and the dedicated
 * `/ecosystem` page. Both surfaces render the exact same product lists from
 * these components, so there is a single source of markup as well as data.
 * Each surface supplies its own section headings/chrome around the grids.
 */

export function WebsitesGrid({ compact = false }: { compact?: boolean }) {
  return (
    <ul
      className={cn(
        "grid gap-3",
        compact
          ? "sm:grid-cols-2 lg:grid-cols-3"
          : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      )}
    >
      {ecosystemWebsites.map((website) => (
        <li className="h-full" key={website.url}>
          <ProductCard compact={compact} website={website} />
        </li>
      ))}
    </ul>
  );
}

export function AppsGrid({ compact = false }: { compact?: boolean }) {
  return (
    <ul
      className={cn(
        "grid gap-3",
        compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {ecosystemApps.map((app) => (
        <li className="h-full" key={app.name}>
          <AppCard app={app} compact={compact} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Honest "future products" placeholder. It states plainly that more is on the
 * way without inventing product names, dates, or metrics.
 */
export function FutureProductsNote({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-eco-200 bg-eco-50/50 text-text-secondary",
        compact ? "p-4" : "p-6",
      )}
    >
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-text-muted">
        In development
      </p>
      <p className={cn("mt-1.5 leading-6", compact ? "text-sm" : "text-[0.95rem]")}>
        New HELPERG websites and apps are added here as they ship. This section
        is reserved for products that are still in development.
      </p>
    </div>
  );
}
