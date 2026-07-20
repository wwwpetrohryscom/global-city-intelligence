import {
  AppStoreGlyph,
  ExternalLinkIcon,
  GooglePlayGlyph,
} from "@/components/ecosystem/icons";
import {
  STORE_LABELS,
  type EcosystemAppStore,
  type StorePlatform,
} from "@/lib/ecosystem/products";
import { cn } from "@/lib/utils/cn";

const GLYPHS: Record<StorePlatform, typeof AppStoreGlyph> = {
  "app-store": AppStoreGlyph,
  "google-play": GooglePlayGlyph,
};

/**
 * Store links for a mobile app, rendered as clean labelled pills.
 *
 * We deliberately do NOT reproduce the official App Store / Google Play badge
 * artwork (forbidden by the brand + trademark guidelines). These are neutral,
 * monochrome, keyboard-accessible links that match the site's pill system.
 */
export function StoreLinks({
  stores,
  appName,
  className,
}: {
  stores: EcosystemAppStore[];
  appName: string;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {stores.map((store) => {
        const Glyph = GLYPHS[store.platform];
        const label = STORE_LABELS[store.platform];
        return (
          <li key={store.platform}>
            <a
              aria-label={`${appName} on the ${label} (opens in a new tab)`}
              className="group inline-flex min-h-11 items-center gap-1.5 rounded-full border border-neutral-border bg-white px-3.5 text-xs font-semibold text-text-secondary shadow-[0_1px_2px_rgba(23,32,51,0.04)] transition duration-150 hover:border-eco-200 hover:bg-eco-50 hover:text-eco-800 focus-visible:border-eco-200 focus-visible:bg-eco-50 sm:min-h-8 sm:px-3 sm:py-1.5"
              href={store.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Glyph className="h-3.5 w-3.5 text-text-muted transition group-hover:text-eco-500" />
              <span>{label}</span>
              <ExternalLinkIcon className="h-3 w-3 text-text-muted/70 transition group-hover:text-eco-500" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
