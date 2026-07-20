import { StoreLinks } from "@/components/ecosystem/StoreLinks";
import type { EcosystemApp } from "@/lib/ecosystem/products";
import { cn } from "@/lib/utils/cn";

/**
 * A single HELPERG mobile app: a monogram "icon", name, one-line description,
 * and its store links. The monogram is a lightweight, dependency-free stand-in
 * for the real app icon (no external image assets are pulled in), styled in
 * the brand gradient so the row reads as a coherent set.
 */
export function AppCard({
  app,
  compact = false,
}: {
  app: EcosystemApp;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-[1.125rem] border border-neutral-border/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        compact ? "p-4" : "p-5",
      )}
    >
      <div className="flex items-center gap-3">
        <AppMonogram name={app.name} />
        <div className="min-w-0">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-brand-700">
            {app.category}
          </p>
          <h3
            className={cn(
              "truncate font-semibold text-text-primary",
              compact ? "text-[0.95rem]" : "text-base",
            )}
          >
            {app.name}
          </h3>
        </div>
      </div>
      <p
        className={cn(
          "leading-6 text-text-secondary",
          compact ? "mt-2 text-[0.8125rem]" : "mt-3 text-sm",
        )}
      >
        {app.tagline}
      </p>
      <StoreLinks
        appName={app.name}
        className="mt-3.5"
        stores={app.stores}
      />
    </div>
  );
}

/** Brand-gradient tile showing the app's initial(s) — a placeholder icon. */
function AppMonogram({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-[0.75rem] bg-[linear-gradient(135deg,#B86108_0%,#EA8C1A_100%)] text-sm font-semibold text-white shadow-[0_2px_6px_rgba(184,97,8,0.28)]"
    >
      {initials}
    </span>
  );
}
